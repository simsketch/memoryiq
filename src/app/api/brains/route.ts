import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brains, brain_members } from '../../../../drizzle/schema'
import { eq, inArray } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, type, description } = body

  if (!name || !type) {
    return NextResponse.json(
      { error: 'name and type are required' },
      { status: 400 }
    )
  }

  const mcp_key = randomUUID()

  const [brain] = await db.insert(brains).values({
    name,
    type,
    description: description ?? null,
    owner_id: userId,
    mcp_key,
  }).returning()

  await db.insert(brain_members).values({
    brain_id: brain.id,
    user_id: userId,
    role: 'owner',
    invited_by: userId,
  })

  return NextResponse.json(brain, { status: 201 })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const memberships = await db
    .select({ brain_id: brain_members.brain_id })
    .from(brain_members)
    .where(eq(brain_members.user_id, userId))

  const brainIds = memberships.map((m) => m.brain_id)

  if (brainIds.length === 0) {
    return NextResponse.json({ brains: [] })
  }

  const userBrains = await db
    .select()
    .from(brains)
    .where(inArray(brains.id, brainIds))

  return NextResponse.json({ brains: userBrains })
}
