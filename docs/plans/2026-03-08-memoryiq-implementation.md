# MemoryIQ Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-stack AI-powered shared memory platform with semantic search, collaborative brains, and MCP integration.

**Architecture:** Next.js App Router monorepo with Clerk auth, Neon Postgres + pgvector for semantic storage, Drizzle ORM, OpenRouter/OpenAI for embeddings and metadata extraction. MCP server exposes brains to AI tools. Marketing site + authenticated dashboard in one app.

**Tech Stack:** Next.js (App Router), TypeScript, React, Clerk, Neon + pgvector, Drizzle ORM, OpenRouter, OpenAI SDK, @modelcontextprotocol/sdk, Tailwind CSS, shadcn/ui, date-fns, next-themes

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js App

**Files:**
- Create: All scaffolded files from create-next-app

**Step 1: Create the app**

```bash
cd /Users/simsketch/repos/memoryiq
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --use-npm \
  --src-dir=false \
  --import-alias '@/*' \
  --yes
```

Note: This will scaffold into the existing directory. The `.env.local` file already exists and should be preserved.

**Step 2: Verify scaffold**

```bash
npm run dev
```

Expected: Dev server starts on localhost:3000 with the Next.js welcome page.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with TypeScript, Tailwind, ESLint"
```

---

### Task 2: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install runtime dependencies**

```bash
npm install \
  drizzle-orm \
  @neondatabase/serverless \
  @clerk/nextjs \
  lucide-react \
  @modelcontextprotocol/sdk \
  openai \
  date-fns \
  next-themes \
  clsx \
  tailwind-merge \
  svix
```

**Step 2: Install dev dependencies**

```bash
npm install -D drizzle-kit
```

**Step 3: Init shadcn and add components**

```bash
npx shadcn@latest init --defaults
npx shadcn@latest add \
  button card input dialog dropdown-menu badge tabs \
  toast switch popover select label separator avatar \
  textarea scroll-area alert-dialog
```

**Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: install all dependencies and shadcn components"
```

---

### Task 3: Database Schema

**Files:**
- Create: `drizzle/schema.ts`
- Create: `drizzle.config.ts`

**Step 1: Create `drizzle/schema.ts`**

```typescript
import {
  pgSchema, uuid, text, timestamp, boolean,
  real, integer, jsonb
} from 'drizzle-orm/pg-core'
import { vector } from 'drizzle-orm/pg-core'

export const memoryiq = pgSchema('memoryiq')

export const brains = memoryiq.table('brains', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        text('name').notNull(),
  type:        text('type').notNull(),
  description: text('description'),
  owner_id:    text('owner_id').notNull(),
  mcp_key:     text('mcp_key').notNull().unique(),
  created_at:  timestamp('created_at').defaultNow(),
  updated_at:  timestamp('updated_at').defaultNow(),
})

export const brain_members = memoryiq.table('brain_members', {
  id:         uuid('id').primaryKey().defaultRandom(),
  brain_id:   uuid('brain_id').notNull()
               .references(() => brains.id, { onDelete: 'cascade' }),
  user_id:    text('user_id').notNull(),
  role:       text('role').notNull(),
  invited_by: text('invited_by'),
  created_at: timestamp('created_at').defaultNow(),
})

export const thoughts = memoryiq.table('thoughts', {
  id:              uuid('id').primaryKey().defaultRandom(),
  brain_id:        uuid('brain_id').notNull()
                    .references(() => brains.id, { onDelete: 'cascade' }),
  content:         text('content').notNull(),
  embedding:       vector('embedding', { dimensions: 1536 }),
  metadata:        jsonb('metadata'),
  source_type:     text('source_type').notNull().default('web'),
  captured_by:     text('captured_by').notNull(),
  supersedes_id:   uuid('supersedes_id'),
  is_pinned:       boolean('is_pinned').notNull().default(false),
  is_archived:     boolean('is_archived').notNull().default(false),
  conflict_flag:   boolean('conflict_flag').notNull().default(false),
  staleness_score: real('staleness_score').notNull().default(0),
  created_at:      timestamp('created_at').defaultNow(),
  updated_at:      timestamp('updated_at').defaultNow(),
})

export const thought_links = memoryiq.table('thought_links', {
  id:                uuid('id').primaryKey().defaultRandom(),
  thought_id:        uuid('thought_id').notNull()
                      .references(() => thoughts.id, { onDelete: 'cascade' }),
  linked_thought_id: uuid('linked_thought_id').notNull()
                      .references(() => thoughts.id, { onDelete: 'cascade' }),
  link_type:         text('link_type').notNull(),
  similarity_score:  real('similarity_score'),
  created_at:        timestamp('created_at').defaultNow(),
})

export const ai_interactions = memoryiq.table('ai_interactions', {
  id:            uuid('id').primaryKey().defaultRandom(),
  thought_id:    uuid('thought_id')
                  .references(() => thoughts.id, { onDelete: 'set null' }),
  model:         text('model').notNull(),
  input_tokens:  integer('input_tokens'),
  output_tokens: integer('output_tokens'),
  cost_estimate: real('cost_estimate'),
  operation:     text('operation').notNull(),
  created_at:    timestamp('created_at').defaultNow(),
})

export const integrations = memoryiq.table('integrations', {
  id:         uuid('id').primaryKey().defaultRandom(),
  brain_id:   uuid('brain_id').notNull()
               .references(() => brains.id, { onDelete: 'cascade' }),
  user_id:    text('user_id').notNull(),
  type:       text('type').notNull(),
  config:     jsonb('config'),
  is_active:  boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
})
```

**Step 2: Create `drizzle.config.ts`**

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema:        './drizzle/schema.ts',
  out:           './drizzle/migrations',
  dialect:       'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED! },
  schemaFilter:  ['memoryiq'],
})
```

**Step 3: Commit**

```bash
git add drizzle/schema.ts drizzle.config.ts
git commit -m "feat: add Drizzle database schema with pgvector support"
```

---

### Task 4: Run Migrations + match_thoughts Function

**Files:**
- Create: `drizzle/migrations/` (auto-generated)
- Create: `drizzle/custom-migration.sql` (match_thoughts function)

**Step 1: Generate migrations**

```bash
npx drizzle-kit generate
```

Expected: Migration SQL files created in `drizzle/migrations/`.

**Step 2: Create custom migration for match_thoughts**

After the generated migration files, create an additional SQL file in `drizzle/migrations/` with the next sequence number. The file should contain:

```sql
CREATE SCHEMA IF NOT EXISTS memoryiq;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE OR REPLACE FUNCTION memoryiq.match_thoughts(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count     int   DEFAULT 10,
  brain_ids       uuid[] DEFAULT NULL
)
RETURNS TABLE (
  id            uuid,
  brain_id      uuid,
  content       text,
  metadata      jsonb,
  source_type   text,
  captured_by   text,
  is_pinned     boolean,
  conflict_flag boolean,
  similarity    float,
  created_at    timestamptz
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.brain_id, t.content, t.metadata,
         t.source_type, t.captured_by, t.is_pinned,
         t.conflict_flag,
         1 - (t.embedding <=> query_embedding) AS similarity,
         t.created_at
  FROM memoryiq.thoughts t
  WHERE t.is_archived = false
    AND (brain_ids IS NULL OR t.brain_id = ANY(brain_ids))
    AND 1 - (t.embedding <=> query_embedding) > match_threshold
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

Note: Drizzle's `migrate` command runs all SQL files in the migrations folder in order. If drizzle-kit doesn't pick up the custom file, run it manually against the database using `psql` or the Neon SQL editor. The `CREATE SCHEMA IF NOT EXISTS` and `CREATE EXTENSION IF NOT EXISTS` should go at the top of the first generated migration file if not already present.

**Step 3: Run migrations**

```bash
npx drizzle-kit migrate
```

Expected: Tables created in the `memoryiq` schema on Neon.

**Step 4: Verify by checking migration output**

The migrate command should report success. If there are errors about pgvector extension, enable it in the Neon dashboard first.

**Step 5: Commit**

```bash
git add drizzle/
git commit -m "feat: run database migrations with match_thoughts function"
```

---

### Task 5: Core Library Files

**Files:**
- Create: `lib/db.ts`
- Create: `lib/ai.ts`
- Create: `lib/utils.ts` (may already exist from shadcn init — modify if so)

**Step 1: Create `lib/db.ts`**

```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/drizzle/schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

**Step 2: Create `lib/ai.ts`**

```typescript
const OPENROUTER_URL = 'https://openrouter.ai/api/v1'

interface Metadata {
  category: string
  tags: string[]
  people: string[]
  action_items: string[]
  sentiment: string
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const res = await fetch(`${OPENROUTER_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: text,
      }),
    })
    if (!res.ok) throw new Error(`OpenRouter embedding failed: ${res.status}`)
    const data = await res.json()
    return data.data[0].embedding
  } catch (err) {
    // Fallback to OpenAI SDK
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    return response.data[0].embedding
  }
}

const EXTRACT_SYSTEM_PROMPT = `You are a metadata extractor. Extract structured information from the thought text provided. Return ONLY raw JSON — no markdown, no explanation, no code fences. The JSON must have exactly these fields:

{
  "category": one of: idea | decision | person_note | task | reference | observation | question,
  "tags": string[],
  "people": string[],
  "action_items": string[],
  "sentiment": positive | neutral | negative
}`

export async function extractMetadata(text: string): Promise<Metadata> {
  try {
    const res = await fetch(`${OPENROUTER_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: EXTRACT_SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!res.ok) throw new Error(`OpenRouter chat failed: ${res.status}`)
    const data = await res.json()
    const raw = data.choices[0].message.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(raw)
  } catch (err) {
    // Fallback to OpenAI SDK
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EXTRACT_SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
    })
    const raw = (response.choices[0].message.content || '{}')
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(raw)
  }
}

export async function processThought(text: string) {
  const [embedding, metadata] = await Promise.all([
    generateEmbedding(text),
    extractMetadata(text),
  ])
  return { embedding, metadata }
}
```

**Step 3: Verify `lib/utils.ts` exists and has the `cn` helper**

If shadcn init created it, it should already contain:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

If not, create it.

**Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

**Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add core library files (db, ai, utils)"
```

---

## Phase 2: Backend — API Routes

### Task 6: POST /api/brains — Create Brain

**Files:**
- Create: `app/api/brains/route.ts`

**Step 1: Create the route**

```typescript
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brains, brain_members } from '@/drizzle/schema'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, type, description } = body

  if (!name || !type) {
    return NextResponse.json({ error: 'name and type are required' }, { status: 400 })
  }

  const mcp_key = randomUUID()

  const [brain] = await db.insert(brains).values({
    name,
    type,
    description: description || null,
    owner_id: userId,
    mcp_key,
  }).returning()

  await db.insert(brain_members).values({
    brain_id: brain.id,
    user_id: userId,
    role: 'owner',
  })

  return NextResponse.json(brain, { status: 201 })
}
```

**Step 2: Verify build**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add app/api/brains/route.ts
git commit -m "feat: add POST /api/brains endpoint"
```

---

### Task 7: GET /api/brains — List User's Brains

**Files:**
- Modify: `app/api/brains/route.ts`

**Step 1: Add GET handler to the same file**

```typescript
import { eq } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const memberRows = await db
    .select({ brain_id: brain_members.brain_id })
    .from(brain_members)
    .where(eq(brain_members.user_id, userId))

  const brainIds = memberRows.map(r => r.brain_id)

  if (brainIds.length === 0) {
    return NextResponse.json({ brains: [] })
  }

  const { inArray } = await import('drizzle-orm')
  const userBrains = await db
    .select()
    .from(brains)
    .where(inArray(brains.id, brainIds))

  return NextResponse.json({ brains: userBrains })
}
```

Note: Combine imports at top of file. The `eq` and `inArray` imports come from `drizzle-orm`.

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/brains/route.ts
git commit -m "feat: add GET /api/brains endpoint"
```

---

### Task 8: POST /api/brains/[id]/members — Invite Member

**Files:**
- Create: `app/api/brains/[id]/members/route.ts`

**Step 1: Create the route**

```typescript
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brains, brain_members } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { email, role } = body

  if (!email || !role) {
    return NextResponse.json({ error: 'email and role are required' }, { status: 400 })
  }

  // Verify caller is owner or admin of this brain
  const [membership] = await db
    .select()
    .from(brain_members)
    .where(and(eq(brain_members.brain_id, id), eq(brain_members.user_id, userId)))

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Look up user by email in Clerk
  const clerk = await clerkClient()
  const users = await clerk.users.getUserList({ emailAddress: [email] })

  if (users.totalCount === 0) {
    return NextResponse.json({ error: 'User not found. They must sign up first.' }, { status: 404 })
  }

  const invitedUser = users.data[0]

  // Check if already a member
  const [existing] = await db
    .select()
    .from(brain_members)
    .where(and(eq(brain_members.brain_id, id), eq(brain_members.user_id, invitedUser.id)))

  if (existing) {
    return NextResponse.json({ error: 'User is already a member' }, { status: 409 })
  }

  const [member] = await db.insert(brain_members).values({
    brain_id: id,
    user_id: invitedUser.id,
    role,
    invited_by: userId,
  }).returning()

  return NextResponse.json(member, { status: 201 })
}
```

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/brains/\[id\]/members/route.ts
git commit -m "feat: add POST /api/brains/[id]/members endpoint"
```

---

### Task 9: GET /api/brains/[id]/stats — Brain Stats

**Files:**
- Create: `app/api/brains/[id]/stats/route.ts`

**Step 1: Create the route**

```typescript
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brains, brain_members, thoughts } from '@/drizzle/schema'
import { eq, and, count, sql, gte } from 'drizzle-orm'
import { subDays } from 'date-fns'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Verify membership
  const [membership] = await db
    .select()
    .from(brain_members)
    .where(and(eq(brain_members.brain_id, id), eq(brain_members.user_id, userId)))

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Total thoughts
  const [{ value: total_thoughts }] = await db
    .select({ value: count() })
    .from(thoughts)
    .where(eq(thoughts.brain_id, id))

  // By category
  const categoryRows = await db
    .select({
      category: sql<string>`${thoughts.metadata}->>'category'`,
      count: count(),
    })
    .from(thoughts)
    .where(eq(thoughts.brain_id, id))
    .groupBy(sql`${thoughts.metadata}->>'category'`)

  const by_category: Record<string, number> = {}
  for (const row of categoryRows) {
    if (row.category) by_category[row.category] = row.count
  }

  // Captured this week
  const weekAgo = subDays(new Date(), 7)
  const [{ value: captured_this_week }] = await db
    .select({ value: count() })
    .from(thoughts)
    .where(and(eq(thoughts.brain_id, id), gte(thoughts.created_at, weekAgo)))

  // Conflict count
  const [{ value: conflict_count }] = await db
    .select({ value: count() })
    .from(thoughts)
    .where(and(eq(thoughts.brain_id, id), eq(thoughts.conflict_flag, true)))

  // Avg staleness
  const [staleRow] = await db
    .select({ value: sql<number>`COALESCE(AVG(${thoughts.staleness_score}), 0)` })
    .from(thoughts)
    .where(eq(thoughts.brain_id, id))

  // Member count
  const [{ value: member_count }] = await db
    .select({ value: count() })
    .from(brain_members)
    .where(eq(brain_members.brain_id, id))

  return NextResponse.json({
    total_thoughts,
    by_category,
    captured_this_week,
    conflict_count,
    avg_staleness_score: staleRow.value,
    member_count,
  })
}
```

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/brains/\[id\]/stats/route.ts
git commit -m "feat: add GET /api/brains/[id]/stats endpoint"
```

---

### Task 10: POST /api/thoughts — Create Thought

**Files:**
- Create: `app/api/thoughts/route.ts`

**Step 1: Create the route**

This is the most complex route — it runs the AI pipeline, checks for conflicts, and inserts thought_links.

```typescript
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { thoughts, thought_links, brain_members } from '@/drizzle/schema'
import { eq, and, sql } from 'drizzle-orm'
import { processThought } from '@/lib/ai'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { brain_id, content, source_type = 'web' } = body

  if (!brain_id || !content) {
    return NextResponse.json({ error: 'brain_id and content are required' }, { status: 400 })
  }

  // Verify membership
  const [membership] = await db
    .select()
    .from(brain_members)
    .where(and(eq(brain_members.brain_id, brain_id), eq(brain_members.user_id, userId)))

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Run AI pipeline
  const { embedding, metadata } = await processThought(content)

  // Conflict check: find similar thoughts in same brain (threshold 0.85)
  const conflicts = await db.execute(sql`
    SELECT id, content, 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
    FROM memoryiq.thoughts
    WHERE brain_id = ${brain_id}::uuid
      AND is_archived = false
      AND 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) > 0.85
    LIMIT 5
  `)

  const hasConflicts = conflicts.rows.length > 0

  // Insert thought
  const [thought] = await db.insert(thoughts).values({
    brain_id,
    content,
    embedding,
    metadata,
    source_type,
    captured_by: userId,
    conflict_flag: hasConflicts,
  }).returning()

  // Insert conflict links
  if (hasConflicts) {
    for (const conflict of conflicts.rows) {
      await db.insert(thought_links).values({
        thought_id: thought.id,
        linked_thought_id: conflict.id as string,
        link_type: 'conflicts',
        similarity_score: conflict.similarity as number,
      })
    }
  }

  return NextResponse.json(thought, { status: 201 })
}
```

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/thoughts/route.ts
git commit -m "feat: add POST /api/thoughts with AI pipeline and conflict detection"
```

---

### Task 11: GET /api/thoughts — List/Search Thoughts

**Files:**
- Modify: `app/api/thoughts/route.ts`

**Step 1: Add GET handler**

```typescript
import { generateEmbedding } from '@/lib/ai'
import { inArray } from 'drizzle-orm'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const brain_id = url.searchParams.get('brain_id')
  const q = url.searchParams.get('q')
  const category = url.searchParams.get('category')
  const pinned = url.searchParams.get('pinned')
  const archived = url.searchParams.get('archived')
  const conflicts_only = url.searchParams.get('conflicts_only')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const offset = parseInt(url.searchParams.get('offset') || '0')

  // Get user's brain IDs for access control
  const memberRows = await db
    .select({ brain_id: brain_members.brain_id })
    .from(brain_members)
    .where(eq(brain_members.user_id, userId))

  const userBrainIds = memberRows.map(r => r.brain_id)
  if (userBrainIds.length === 0) {
    return NextResponse.json({ thoughts: [], total: 0 })
  }

  // Filter to specific brain if requested
  const targetBrainIds = brain_id ? [brain_id] : userBrainIds

  // Semantic search path
  if (q) {
    const queryEmbedding = await generateEmbedding(q)
    const results = await db.execute(sql`
      SELECT * FROM memoryiq.match_thoughts(
        ${JSON.stringify(queryEmbedding)}::vector,
        0.5,
        ${limit},
        ${targetBrainIds}::uuid[]
      )
    `)
    return NextResponse.json({ thoughts: results.rows, total: results.rows.length })
  }

  // Standard filtered query
  const conditions = [inArray(thoughts.brain_id, targetBrainIds)]
  if (category) conditions.push(sql`${thoughts.metadata}->>'category' = ${category}`)
  if (pinned === 'true') conditions.push(eq(thoughts.is_pinned, true))
  if (archived === 'true') conditions.push(eq(thoughts.is_archived, true))
  else conditions.push(eq(thoughts.is_archived, false))
  if (conflicts_only === 'true') conditions.push(eq(thoughts.conflict_flag, true))

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(thoughts)
    .where(and(...conditions))

  const results = await db
    .select()
    .from(thoughts)
    .where(and(...conditions))
    .orderBy(sql`${thoughts.created_at} DESC`)
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ thoughts: results, total })
}
```

Note: Combine all imports at the top of the file.

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/thoughts/route.ts
git commit -m "feat: add GET /api/thoughts with semantic search and filters"
```

---

### Task 12: PATCH & DELETE /api/thoughts/[id]

**Files:**
- Create: `app/api/thoughts/[id]/route.ts`

**Step 1: Create the route with both handlers**

```typescript
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { thoughts, brain_members } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'
import { processThought } from '@/lib/ai'

async function verifyThoughtAccess(thoughtId: string, userId: string) {
  const [thought] = await db.select().from(thoughts).where(eq(thoughts.id, thoughtId))
  if (!thought) return null

  const [membership] = await db
    .select()
    .from(brain_members)
    .where(and(eq(brain_members.brain_id, thought.brain_id), eq(brain_members.user_id, userId)))

  if (!membership) return null
  return thought
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const thought = await verifyThoughtAccess(id, userId)
  if (!thought) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })

  const body = await req.json()
  const updates: Record<string, unknown> = { updated_at: new Date() }

  if (body.content !== undefined && body.content !== thought.content) {
    const { embedding, metadata } = await processThought(body.content)
    updates.content = body.content
    updates.embedding = embedding
    updates.metadata = metadata
  }
  if (body.is_pinned !== undefined) updates.is_pinned = body.is_pinned
  if (body.is_archived !== undefined) updates.is_archived = body.is_archived
  if (body.conflict_flag !== undefined) updates.conflict_flag = body.conflict_flag

  const [updated] = await db
    .update(thoughts)
    .set(updates)
    .where(eq(thoughts.id, id))
    .returning()

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const thought = await verifyThoughtAccess(id, userId)
  if (!thought) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })

  await db
    .update(thoughts)
    .set({ is_archived: true, updated_at: new Date() })
    .where(eq(thoughts.id, id))

  return NextResponse.json({ success: true })
}
```

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/thoughts/\[id\]/route.ts
git commit -m "feat: add PATCH and DELETE /api/thoughts/[id] endpoints"
```

---

### Task 13: POST /api/webhooks/clerk — Clerk Webhook

**Files:**
- Create: `app/api/webhooks/clerk/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/db'
import { brains, brain_members } from '@/drizzle/schema'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const headerPayload = Object.fromEntries(req.headers.entries())
  const svix_id = headerPayload['svix-id']
  const svix_timestamp = headerPayload['svix-timestamp']
  const svix_signature = headerPayload['svix-signature']

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: { type: string; data: { id: string } }
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as typeof evt
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (evt.type === 'user.created') {
    const userId = evt.data.id
    const mcp_key = randomUUID()

    const [brain] = await db.insert(brains).values({
      name: 'My Brain',
      type: 'personal',
      owner_id: userId,
      mcp_key,
    }).returning()

    await db.insert(brain_members).values({
      brain_id: brain.id,
      user_id: userId,
      role: 'owner',
    })
  }

  return NextResponse.json({ received: true })
}
```

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/webhooks/clerk/route.ts
git commit -m "feat: add Clerk webhook for auto-creating personal brain"
```

---

### Task 14: POST /api/mcp — MCP Server

**Files:**
- Create: `app/api/mcp/route.ts`

**Step 1: Create the MCP route**

This route uses `@modelcontextprotocol/sdk` with `StreamableHTTPServerTransport`. It exposes 4 tools: `search_thoughts`, `browse_recent`, `capture_thought`, `brain_stats`.

```typescript
import { NextResponse } from 'next/server'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { db } from '@/lib/db'
import { brains, brain_members, thoughts } from '@/drizzle/schema'
import { eq, sql, count, desc, and, gte } from 'drizzle-orm'
import { processThought, generateEmbedding } from '@/lib/ai'
import { subDays } from 'date-fns'
import { z } from 'zod'

async function getBrainByKey(key: string) {
  const [brain] = await db.select().from(brains).where(eq(brains.mcp_key, key))
  return brain || null
}

function createMcpServer(brainId: string, userId: string) {
  const server = new McpServer({
    name: 'MemoryIQ',
    version: '1.0.0',
  })

  server.tool(
    'search_thoughts',
    'Semantic vector search across your brain. Returns ranked results by similarity score.',
    {
      query: z.string().describe('The search query'),
      threshold: z.number().optional().default(0.5).describe('Similarity threshold (0-1)'),
      limit: z.number().optional().default(10).describe('Max results'),
    },
    async ({ query, threshold, limit }) => {
      const embedding = await generateEmbedding(query)
      const results = await db.execute(sql`
        SELECT * FROM memoryiq.match_thoughts(
          ${JSON.stringify(embedding)}::vector,
          ${threshold ?? 0.5},
          ${limit ?? 10},
          ${[brainId]}::uuid[]
        )
      `)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(results.rows, null, 2) }],
      }
    }
  )

  server.tool(
    'browse_recent',
    'Returns the most recently captured thoughts, optionally filtered by category.',
    {
      limit: z.number().optional().default(10).describe('Max results'),
      category: z.string().optional().describe('Filter by category'),
    },
    async ({ limit, category }) => {
      const conditions = [eq(thoughts.brain_id, brainId), eq(thoughts.is_archived, false)]
      if (category) {
        conditions.push(sql`${thoughts.metadata}->>'category' = ${category}`)
      }
      const results = await db
        .select({
          id: thoughts.id,
          content: thoughts.content,
          metadata: thoughts.metadata,
          source_type: thoughts.source_type,
          created_at: thoughts.created_at,
        })
        .from(thoughts)
        .where(and(...conditions))
        .orderBy(desc(thoughts.created_at))
        .limit(limit ?? 10)

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }],
      }
    }
  )

  server.tool(
    'capture_thought',
    'Saves a new thought to the brain. Runs full AI processing pipeline (embed + metadata extract).',
    {
      content: z.string().describe('The thought content to capture'),
      metadata: z.record(z.unknown()).optional().describe('Optional metadata override'),
    },
    async ({ content, metadata: metadataOverride }) => {
      const { embedding, metadata } = await processThought(content)
      const finalMetadata = metadataOverride ? { ...metadata, ...metadataOverride } : metadata

      const [thought] = await db.insert(thoughts).values({
        brain_id: brainId,
        content,
        embedding,
        metadata: finalMetadata,
        source_type: 'mcp',
        captured_by: userId,
      }).returning()

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(thought, null, 2) }],
      }
    }
  )

  server.tool(
    'brain_stats',
    'Returns summary statistics: total thoughts, category breakdown, conflicts, member count.',
    {},
    async () => {
      const [{ value: total_thoughts }] = await db.select({ value: count() }).from(thoughts).where(eq(thoughts.brain_id, brainId))

      const categoryRows = await db
        .select({ category: sql<string>`${thoughts.metadata}->>'category'`, count: count() })
        .from(thoughts)
        .where(eq(thoughts.brain_id, brainId))
        .groupBy(sql`${thoughts.metadata}->>'category'`)

      const by_category: Record<string, number> = {}
      for (const row of categoryRows) {
        if (row.category) by_category[row.category] = row.count
      }

      const [{ value: conflict_count }] = await db.select({ value: count() }).from(thoughts).where(and(eq(thoughts.brain_id, brainId), eq(thoughts.conflict_flag, true)))
      const [{ value: member_count }] = await db.select({ value: count() }).from(brain_members).where(eq(brain_members.brain_id, brainId))

      const weekAgo = subDays(new Date(), 7)
      const [{ value: captured_this_week }] = await db.select({ value: count() }).from(thoughts).where(and(eq(thoughts.brain_id, brainId), gte(thoughts.created_at, weekAgo)))

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ total_thoughts, by_category, conflict_count, member_count, captured_this_week }, null, 2),
        }],
      }
    }
  )

  return server
}

export async function POST(req: Request) {
  const url = new URL(req.url)
  const key = req.headers.get('x-brain-key') || url.searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'Missing brain key' }, { status: 401 })
  }

  const brain = await getBrainByKey(key)
  if (!brain) {
    return NextResponse.json({ error: 'Invalid brain key' }, { status: 401 })
  }

  const server = createMcpServer(brain.id, brain.owner_id)
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })

  await server.connect(transport)

  const response = await transport.handleRequest(req)
  return response
}

// GET and DELETE may be needed for MCP session lifecycle
export async function GET(req: Request) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE(req: Request) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
```

Note: The MCP SDK API may differ from what's shown. Check the actual `@modelcontextprotocol/sdk` docs during implementation and adapt. The `StreamableHTTPServerTransport.handleRequest()` method should accept a Request and return a Response, but verify. If it uses a different pattern (e.g., readable/writable streams), adapt accordingly.

**Step 2: Verify build + commit**

```bash
npm run build
git add app/api/mcp/route.ts
git commit -m "feat: add MCP server with 4 tools (search, browse, capture, stats)"
```

---

## Phase 3: Auth & Layout

### Task 15: Clerk Middleware / Proxy

**Files:**
- Create: `middleware.ts` (or `proxy.ts` if Next.js 16 supports it)

**Step 1: Check which pattern the installed Next.js version supports**

Check `node_modules/next/package.json` for the version. If v16+ and proxy.ts is documented, use that. Otherwise, use middleware.ts.

**Step 2: Create the file**

```typescript
// middleware.ts (or proxy.ts)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

**Step 3: Verify build + commit**

```bash
npm run build
git add middleware.ts  # or proxy.ts
git commit -m "feat: add Clerk route protection for dashboard routes"
```

---

### Task 16: Root Layout + ClerkProvider + Theme

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/theme-provider.tsx`

**Step 1: Create theme provider**

```typescript
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Step 2: Update root layout**

Wrap with `<ClerkProvider>` and `<ThemeProvider>`. Add metadata as specified in spec section 13. Add dark class to html. Reference favicon.

```typescript
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'MemoryIQ — One Brain. Every AI.',
  description: 'AI-powered shared memory platform. Capture thoughts from anywhere, search by meaning, share knowledge across all your AI tools.',
  openGraph: {
    title: 'MemoryIQ — One Brain. Every AI.',
    description: 'AI-powered shared memory platform.',
    type: 'website',
    url: 'https://memoryiq.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemoryIQ — One Brain. Every AI.',
  },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

**Step 3: Create a simple SVG favicon**

Create `public/favicon.svg` — a simple violet brain icon.

**Step 4: Verify build + commit**

```bash
npm run build
git add app/layout.tsx components/theme-provider.tsx public/favicon.svg
git commit -m "feat: add root layout with Clerk, theme provider, and metadata"
```

---

### Task 17: Auth Pages (Sign In / Sign Up)

**Files:**
- Create: `app/sign-in/[[...sign-in]]/page.tsx`
- Create: `app/sign-up/[[...sign-up]]/page.tsx`

**Step 1: Create sign-in page**

```typescript
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#1a1035] flex items-center justify-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#8b5cf6',
            colorBackground: '#1a1035',
            colorText: '#ffffff',
          },
        }}
      />
    </div>
  )
}
```

**Step 2: Create sign-up page (same pattern with `<SignUp />`)**

**Step 3: Verify build + commit**

```bash
npm run build
git add app/sign-in/ app/sign-up/
git commit -m "feat: add Clerk sign-in and sign-up pages"
```

---

### Task 18: Dashboard Layout with Sidebar

**Files:**
- Create: `app/dashboard/layout.tsx`
- Create: `components/dashboard/sidebar.tsx`
- Create: `components/dashboard/brain-selector.tsx`

**Step 1: Create sidebar component**

Client component with:
- MemoryIQ logo text at top
- Brain selector dropdown (fetches from GET /api/brains, stores selected brain in state/context)
- Nav links: Overview (`/dashboard`), Thoughts (`/dashboard/thoughts`), Capture (`/dashboard/capture`), Brains (`/dashboard/brains`), Curate (`/dashboard/curate`), Settings (`/dashboard/settings`)
- Active state highlighting using `usePathname()`
- Lucide icons for each nav item: LayoutDashboard, Lightbulb, PenSquare, Brain, Sparkles, Settings
- `<UserButton />` from Clerk at bottom
- Light/dark toggle button using `useTheme()` from next-themes
- Responsive: full sidebar on md+, hamburger menu on mobile using Sheet/drawer pattern

**Step 2: Create brain selector component**

Client component:
- Fetches brains from `/api/brains` on mount
- shadcn `<Select>` dropdown
- Stores selected brain ID — consider React context or simple state lifted to layout

**Step 3: Create dashboard layout**

```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
```

**Step 4: Verify build + commit**

```bash
npm run build
git add app/dashboard/layout.tsx components/dashboard/
git commit -m "feat: add dashboard layout with responsive sidebar"
```

---

## Phase 4: Dashboard Pages

### Task 19: Dashboard Overview Page

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `components/dashboard/stats-cards.tsx`
- Create: `components/dashboard/recent-thoughts.tsx`
- Create: `components/dashboard/quick-capture.tsx`

**Step 1: Build the page**

Server component that:
- Fetches stats from `/api/brains/[id]/stats` (for selected brain, or aggregate)
- Renders 4 stat cards: Total Thoughts, Brains Count, Captured This Week, Conflicts
- Recent thoughts list (last 10) with content preview, category badge, relative timestamp via `date-fns` `formatDistanceToNow`
- Quick capture widget: textarea + brain selector + submit button (client component)

Each sub-component should be its own file under `components/dashboard/`.

**Step 2: Verify build + commit**

```bash
npm run build
git add app/dashboard/page.tsx components/dashboard/
git commit -m "feat: add dashboard overview with stats, recent thoughts, quick capture"
```

---

### Task 20: Thoughts Explorer Page

**Files:**
- Create: `app/dashboard/thoughts/page.tsx`
- Create: `components/dashboard/thought-card.tsx`
- Create: `components/dashboard/thought-filters.tsx`

**Step 1: Build the page**

- Search bar at top — input that triggers semantic search via `GET /api/thoughts?q=...`
- Filter row: category dropdown, brain dropdown, pinned toggle, archived toggle, conflicts-only toggle
- Thought cards: content preview (2-3 lines truncated), colored category badge, tag chips, people mentioned, source type icon, relative timestamp, action buttons (pin toggle, archive, edit via dialog)
- Pagination controls: previous/next with offset tracking

Use `useSearchParams` and `useRouter` for filter state in URL.

**Step 2: Verify build + commit**

```bash
npm run build
git add app/dashboard/thoughts/ components/dashboard/thought-card.tsx components/dashboard/thought-filters.tsx
git commit -m "feat: add thought explorer with semantic search, filters, pagination"
```

---

### Task 21: Capture Page

**Files:**
- Create: `app/dashboard/capture/page.tsx`

**Step 1: Build the page**

Client component with:
- Brain selector dropdown (required, full-width)
- Large `<Textarea />` for thought content
- Collapsible section "Override metadata": category dropdown, tags input (comma-separated), people input
- "Capture Thought" submit button — calls `POST /api/thoughts`
- After success: animated card appears showing the AI-extracted metadata (category, tags, people, action items, sentiment) with a fade-in transition
- Toast notification on success/error

**Step 2: Verify build + commit**

```bash
npm run build
git add app/dashboard/capture/
git commit -m "feat: add capture page with metadata preview"
```

---

### Task 22: Brains List Page

**Files:**
- Create: `app/dashboard/brains/page.tsx`
- Create: `components/dashboard/create-brain-dialog.tsx`

**Step 1: Build the page**

- Grid of brain cards: name, type badge (personal/shared), thought count, member count, last activity (relative time)
- "Create Brain" button opens shadcn `<Dialog>` with form: name input, type select (personal/shared), description textarea
- Dialog submit calls `POST /api/brains`, refreshes list on success
- Card click navigates to `/dashboard/brains/[id]`

**Step 2: Verify build + commit**

```bash
npm run build
git add app/dashboard/brains/page.tsx components/dashboard/create-brain-dialog.tsx
git commit -m "feat: add brains list page with create dialog"
```

---

### Task 23: Brain Detail Page

**Files:**
- Create: `app/dashboard/brains/[id]/page.tsx`
- Create: `components/dashboard/brain-members.tsx`
- Create: `components/dashboard/mcp-connection.tsx`

**Step 1: Build the page**

Async server component: `const { id } = await props.params`

Sections:
- Editable header: brain name + description with inline edit + save (client component)
- Stats row: thought count, member count, created date, last updated
- Members list: role badges (colored) + remove button per member. Calls `POST /api/brains/[id]/members` for invites
- Invite member form: email input + role select + send button
- MCP Connection section: displays full URL `https://{APP_URL}/api/mcp?key={mcp_key}`, copy-to-clipboard button, usage instructions for Claude/Cursor/VS Code Copilot as code blocks
- Danger Zone: "Delete Brain" button with `<AlertDialog>` confirmation — calls `DELETE` or archives the brain

**Step 2: Verify build + commit**

```bash
npm run build
git add app/dashboard/brains/\[id\]/ components/dashboard/brain-members.tsx components/dashboard/mcp-connection.tsx
git commit -m "feat: add brain detail page with members, MCP config, danger zone"
```

---

### Task 24: Curate Page

**Files:**
- Create: `app/dashboard/curate/page.tsx`
- Create: `components/dashboard/conflict-card.tsx`
- Create: `components/dashboard/stale-card.tsx`

**Step 1: Build the page**

- Tabs with count badges: Conflicts | Stale | All (using shadcn `<Tabs>`)
- **Conflicts tab:** Fetches thoughts with `conflict_flag=true`. For each, also fetch linked conflicts from `thought_links`. Display side-by-side cards showing two conflicting thoughts with timestamps and `captured_by`. Action buttons: Keep This One, Keep Both, Merge (concatenates content), Dismiss (clears conflict flag)
- **Stale tab:** Fetches thoughts where `updated_at` is 90+ days ago. Action buttons: Still Relevant (updates `updated_at`), Archive
- **All tab:** Combined view
- Empty states with icons when queues are clear

**Step 2: Verify build + commit**

```bash
npm run build
git add app/dashboard/curate/ components/dashboard/conflict-card.tsx components/dashboard/stale-card.tsx
git commit -m "feat: add curation page with conflict resolution and stale review"
```

---

### Task 25: Settings Page

**Files:**
- Create: `app/dashboard/settings/page.tsx`

**Step 1: Build the page**

Client component with:
- Account info section: uses `useUser()` from Clerk — displays name, email, avatar
- MCP Access Keys section: lists all brain MCP URLs with copy button + regenerate key button per brain
- Connected Integrations section: toggle list (Slack, WhatsApp, API) with status indicators — toggles are visual only for now (placeholder)
- Data Export section: "Export All Thoughts (JSON)" button — placeholder, shows toast "Coming soon"

**Step 2: Verify build + commit**

```bash
npm run build
git add app/dashboard/settings/
git commit -m "feat: add settings page with MCP keys and account info"
```

---

## Phase 5: Marketing Pages & Polish

### Task 26: AnimateOnScroll Component

**Files:**
- Create: `components/animate-on-scroll.tsx`

**Step 1: Create the component**

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function AnimateOnScroll({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add components/animate-on-scroll.tsx
git commit -m "feat: add AnimateOnScroll component with IntersectionObserver"
```

---

### Task 27: Landing Page

**Files:**
- Create: `app/page.tsx`
- Create: `components/marketing/hero.tsx`
- Create: `components/marketing/problem-section.tsx`
- Create: `components/marketing/how-it-works.tsx`
- Create: `components/marketing/features-grid.tsx`
- Create: `components/marketing/integrations.tsx`
- Create: `components/marketing/pricing-section.tsx`
- Create: `components/marketing/open-standards.tsx`
- Create: `components/marketing/final-cta.tsx`
- Create: `components/marketing/footer.tsx`

**Step 1: Build all 9 sections as specified in the spec**

Follow the design language: dark background (`#0a0118` → `#1a1035`), violet accent, glass morphism cards, gradient text. Use `AnimateOnScroll` wrapper on each section. Use Lucide React icons throughout.

Key details per section:
- **Hero:** Gradient text headline, two CTA buttons, CSS-only animated background dots via keyframes
- **Problem:** 3 glass cards with Brain, Lock, Users icons
- **How It Works:** 3 numbered steps with connecting line on desktop (CSS border-left or after pseudo-element)
- **Features Grid:** 3x2 on desktop (grid-cols-3), 1-col mobile
- **Integrations:** Text+icon cards for Claude, ChatGPT, Cursor, VS Code Copilot, Slack, WhatsApp
- **Pricing:** 3 tiers, Pro tier highlighted with violet border + `scale-105`
- **Open Standards:** Short paragraph + badge pills
- **Final CTA:** Headline + button + subtext
- **Footer:** Links + copyright

**Step 2: Verify build + commit**

```bash
npm run build
git add app/page.tsx components/marketing/
git commit -m "feat: add landing page with all 9 marketing sections"
```

---

### Task 28: Pricing Page

**Files:**
- Create: `app/pricing/page.tsx`

**Step 1: Build the page**

- Same 3 pricing tiers from landing page (reuse or extract shared pricing component)
- Full feature comparison table below the cards
- FAQ accordion with 5-7 questions using shadcn components (Collapsible or custom accordion): free trial, cancellation, team billing, MCP support, data export, self-hosting, data portability

Match marketing design language.

**Step 2: Verify build + commit**

```bash
npm run build
git add app/pricing/
git commit -m "feat: add pricing page with comparison table and FAQ"
```

---

### Task 29: Privacy & Terms Pages

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`

**Step 1: Build both pages**

Dark themed, standard legal page layout. Use the marketing design tokens (background, text colors).

- **Privacy:** Sections for data collected, how used, retention, third parties, contact info
- **Terms:** Sections for acceptance, usage, IP ownership, limitation of liability, contact info

Content can be placeholder legal text styled appropriately.

**Step 2: Verify build + commit**

```bash
npm run build
git add app/privacy/ app/terms/
git commit -m "feat: add privacy and terms pages"
```

---

### Task 30: README and .gitignore

**Files:**
- Create or modify: `README.md`
- Create or modify: `.gitignore`

**Step 1: Write README with all required sections**

- What is MemoryIQ — overview + key features
- Tech Stack
- Local Development: clone → copy .env.local → npm install → npx drizzle-kit migrate → npm run dev
- Environment Variables table
- MCP Integration Guide with config examples for Claude Desktop, Cursor, VS Code Copilot
- Deployment — Vercel + Neon
- Database Migrations

**Step 2: Ensure .gitignore has required entries**

```
.env.local
.env*.local
node_modules/
.next/
.DS_Store
*.log
```

**Step 3: Commit**

```bash
git add README.md .gitignore
git commit -m "docs: add README and .gitignore"
```

---

### Task 31: Final Build Verification

**Step 1: Clean build**

```bash
rm -rf .next
npm run build
```

Expected: 0 TypeScript errors, 0 ESLint errors, successful build.

**Step 2: Dev server smoke test**

```bash
npm run dev
```

Verify:
- `/` loads landing page
- `/sign-in` shows Clerk sign-in
- `/dashboard` redirects to sign-in if not authenticated
- After sign-in, `/dashboard` loads with sidebar

**Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build issues from final verification"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1. Foundation | 1-5 | Scaffold, deps, schema, migrations, lib files |
| 2. Backend | 6-14 | All API routes + MCP server |
| 3. Auth & Layout | 15-18 | Middleware, root layout, auth pages, dashboard layout |
| 4. Dashboard | 19-25 | All 7 dashboard pages |
| 5. Marketing & Polish | 26-31 | Landing, pricing, legal, README, final verification |

**Total: 31 tasks**
