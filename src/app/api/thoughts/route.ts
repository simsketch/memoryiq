import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { thoughts, thought_links, brain_members } from '../../../../drizzle/schema'
import { eq, and, inArray, sql, desc } from 'drizzle-orm'
import { processThought, generateEmbedding } from '@/lib/ai'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { brain_id, content, source_type } = body

  if (!brain_id || !content) {
    return NextResponse.json(
      { error: 'brain_id and content are required' },
      { status: 400 }
    )
  }

  // Verify user is a member of the brain
  const [membership] = await db
    .select()
    .from(brain_members)
    .where(
      and(
        eq(brain_members.brain_id, brain_id),
        eq(brain_members.user_id, userId)
      )
    )

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Run AI pipeline
  const { embedding, metadata } = await processThought(content)
  const embeddingStr = `[${embedding.join(',')}]`

  // Conflict check: find similar thoughts in the same brain
  const conflicts = await db.execute(sql`
    SELECT id, content, 1 - (embedding <=> ${embeddingStr}::vector) as similarity
    FROM memoryiq.thoughts
    WHERE brain_id = ${brain_id}::uuid AND is_archived = false
      AND 1 - (embedding <=> ${embeddingStr}::vector) > 0.85
    LIMIT 5
  `)

  const conflictRows = (conflicts.rows ?? conflicts) as { id: string; content: string; similarity: number }[]
  const hasConflicts = conflictRows.length > 0

  // Insert the thought
  const [thought] = await db.insert(thoughts).values({
    brain_id,
    content,
    embedding,
    metadata,
    source_type: source_type ?? 'web',
    captured_by: userId,
    conflict_flag: hasConflicts,
  }).returning()

  // Insert thought_links for conflicts
  if (hasConflicts) {
    const linkValues = conflictRows.map((row) => ({
      thought_id: thought.id,
      linked_thought_id: row.id,
      link_type: 'conflicts' as const,
      similarity_score: Number(row.similarity),
    }))

    await db.insert(thought_links).values(linkValues)
  }

  return NextResponse.json(thought, { status: 201 })
}

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const brain_id = searchParams.get('brain_id')
  const q = searchParams.get('q')
  const category = searchParams.get('category')
  const pinned = searchParams.get('pinned')
  const archived = searchParams.get('archived')
  const conflicts_only = searchParams.get('conflicts_only')
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  // Get user's brain IDs for access control
  const memberships = await db
    .select({ brain_id: brain_members.brain_id })
    .from(brain_members)
    .where(eq(brain_members.user_id, userId))

  const brainIds = memberships.map((m) => m.brain_id)

  if (brainIds.length === 0) {
    return NextResponse.json({ thoughts: [], total: 0 })
  }

  // If brain_id specified, verify access
  if (brain_id && !brainIds.includes(brain_id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const targetBrainIds = brain_id ? [brain_id] : brainIds

  // Semantic search path
  if (q) {
    const queryEmbedding = await generateEmbedding(q)
    const embeddingStr = `[${queryEmbedding.join(',')}]`

    const results = await db.execute(sql`
      SELECT * FROM memoryiq.match_thoughts(
        ${embeddingStr}::vector,
        ${brain_id ?? targetBrainIds[0]}::uuid,
        0.5,
        ${limit}
      )
    `)

    const rows = results.rows ?? results
    return NextResponse.json({
      thoughts: Array.isArray(rows) ? rows : [],
      total: Array.isArray(rows) ? rows.length : 0,
    })
  }

  // Standard filtered query
  const conditions = [
    inArray(thoughts.brain_id, targetBrainIds),
  ]

  if (category) {
    conditions.push(sql`${thoughts.metadata}->>'category' = ${category}`)
  }
  if (pinned === 'true') {
    conditions.push(eq(thoughts.is_pinned, true))
  }
  if (archived === 'true') {
    conditions.push(eq(thoughts.is_archived, true))
  } else if (archived !== 'true') {
    conditions.push(eq(thoughts.is_archived, false))
  }
  if (conflicts_only === 'true') {
    conditions.push(eq(thoughts.conflict_flag, true))
  }

  const [result, totalResult] = await Promise.all([
    db
      .select()
      .from(thoughts)
      .where(and(...conditions))
      .orderBy(desc(thoughts.created_at))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(thoughts)
      .where(and(...conditions)),
  ])

  return NextResponse.json({
    thoughts: result,
    total: totalResult[0].count,
  })
}
