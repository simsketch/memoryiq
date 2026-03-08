import { NextResponse } from 'next/server'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'
import { db } from '@/lib/db'
import { brains, brain_members, thoughts } from '../../../../drizzle/schema'
import { eq, and, desc, count, sql } from 'drizzle-orm'
import { processThought, generateEmbedding } from '@/lib/ai'
import { subDays } from 'date-fns'

async function authenticateBrain(req: Request) {
  const url = new URL(req.url)
  const key = req.headers.get('x-brain-key') ?? url.searchParams.get('key')
  if (!key) return null

  const [brain] = await db
    .select()
    .from(brains)
    .where(eq(brains.mcp_key, key))
    .limit(1)

  return brain ?? null
}

function createMcpServer(brainId: string) {
  const server = new McpServer({
    name: 'memoryiq',
    version: '1.0.0',
  })

  server.tool(
    'search_thoughts',
    'Semantic search through thoughts in this brain',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Max results (default 10)'),
    },
    async ({ query, limit }) => {
      const maxResults = limit ?? 10
      const queryEmbedding = await generateEmbedding(query)
      const embeddingStr = `[${queryEmbedding.join(',')}]`

      const results = await db.execute(sql`
        SELECT * FROM memoryiq.match_thoughts(
          ${embeddingStr}::vector,
          ${brainId}::uuid,
          0.5,
          ${maxResults}
        )
      `)

      const rows = results.rows ?? results
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(rows) }],
      }
    }
  )

  server.tool(
    'browse_recent',
    'Browse recent thoughts in this brain',
    {
      limit: z.number().optional().describe('Max results (default 20)'),
      offset: z.number().optional().describe('Offset for pagination'),
    },
    async ({ limit, offset }) => {
      const result = await db
        .select()
        .from(thoughts)
        .where(
          and(
            eq(thoughts.brain_id, brainId),
            eq(thoughts.is_archived, false)
          )
        )
        .orderBy(desc(thoughts.created_at))
        .limit(limit ?? 20)
        .offset(offset ?? 0)

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result) }],
      }
    }
  )

  server.tool(
    'capture_thought',
    'Capture a new thought into this brain',
    {
      content: z.string().describe('The thought content to capture'),
      source_type: z.string().optional().describe('Source type (default: mcp)'),
    },
    async ({ content, source_type }) => {
      const { embedding, metadata } = await processThought(content)
      const embeddingStr = `[${embedding.join(',')}]`

      // Conflict check
      const conflicts = await db.execute(sql`
        SELECT id, content, 1 - (embedding <=> ${embeddingStr}::vector) as similarity
        FROM memoryiq.thoughts
        WHERE brain_id = ${brainId}::uuid AND is_archived = false
          AND 1 - (embedding <=> ${embeddingStr}::vector) > 0.85
        LIMIT 5
      `)

      const conflictRows = (conflicts.rows ?? conflicts) as { id: string }[]
      const hasConflicts = conflictRows.length > 0

      const [thought] = await db.insert(thoughts).values({
        brain_id: brainId,
        content,
        embedding,
        metadata,
        source_type: source_type ?? 'mcp',
        captured_by: 'mcp',
        conflict_flag: hasConflicts,
      }).returning()

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(thought) }],
      }
    }
  )

  server.tool(
    'brain_stats',
    'Get aggregated statistics for this brain',
    {},
    async () => {
      const oneWeekAgo = subDays(new Date(), 7)

      const [
        totalResult,
        byCategoryResult,
        conflictResult,
        memberCountResult,
        thisWeekResult,
      ] = await Promise.all([
        db.select({ count: count() }).from(thoughts).where(eq(thoughts.brain_id, brainId)),
        db
          .select({
            category: sql<string>`${thoughts.metadata}->>'category'`,
            count: count(),
          })
          .from(thoughts)
          .where(eq(thoughts.brain_id, brainId))
          .groupBy(sql`${thoughts.metadata}->>'category'`),
        db
          .select({ count: count() })
          .from(thoughts)
          .where(and(eq(thoughts.brain_id, brainId), eq(thoughts.conflict_flag, true))),
        db.select({ count: count() }).from(brain_members).where(eq(brain_members.brain_id, brainId)),
        db
          .select({ count: count() })
          .from(thoughts)
          .where(and(eq(thoughts.brain_id, brainId), sql`${thoughts.created_at} >= ${oneWeekAgo}`)),
      ])

      const stats = {
        total: totalResult[0].count,
        by_category: byCategoryResult,
        conflicts: conflictResult[0].count,
        members: memberCountResult[0].count,
        this_week: thisWeekResult[0].count,
      }

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(stats) }],
      }
    }
  )

  return server
}

export async function POST(req: Request) {
  const brain = await authenticateBrain(req)
  if (!brain) {
    return NextResponse.json({ error: 'Invalid or missing brain key' }, { status: 401 })
  }

  const server = createMcpServer(brain.id)

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  await server.connect(transport)

  try {
    const response = await transport.handleRequest(req)
    return response
  } finally {
    await transport.close()
    await server.close()
  }
}

export async function GET(req: Request) {
  const brain = await authenticateBrain(req)
  if (!brain) {
    return NextResponse.json({ error: 'Invalid or missing brain key' }, { status: 401 })
  }

  const server = createMcpServer(brain.id)

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  await server.connect(transport)

  try {
    const response = await transport.handleRequest(req)
    return response
  } finally {
    await transport.close()
    await server.close()
  }
}

export async function DELETE(req: Request) {
  const brain = await authenticateBrain(req)
  if (!brain) {
    return NextResponse.json({ error: 'Invalid or missing brain key' }, { status: 401 })
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })

  const response = await transport.handleRequest(req)
  await transport.close()
  return response
}
