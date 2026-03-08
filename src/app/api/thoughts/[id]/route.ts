import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { thoughts, brain_members } from '../../../../../drizzle/schema'
import { eq, and } from 'drizzle-orm'
import { processThought } from '@/lib/ai'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { content, is_pinned, is_archived, conflict_flag } = body

  // Fetch the thought to verify access
  const [thought] = await db
    .select()
    .from(thoughts)
    .where(eq(thoughts.id, id))

  if (!thought) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Verify user is a member of the thought's brain
  const [membership] = await db
    .select()
    .from(brain_members)
    .where(
      and(
        eq(brain_members.brain_id, thought.brain_id),
        eq(brain_members.user_id, userId)
      )
    )

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Build update payload
  const updates: Record<string, unknown> = {
    updated_at: new Date(),
  }

  if (content !== undefined) {
    const { embedding, metadata } = await processThought(content)
    updates.content = content
    updates.embedding = embedding
    updates.metadata = metadata
  }
  if (is_pinned !== undefined) updates.is_pinned = is_pinned
  if (is_archived !== undefined) updates.is_archived = is_archived
  if (conflict_flag !== undefined) updates.conflict_flag = conflict_flag

  const [updated] = await db
    .update(thoughts)
    .set(updates)
    .where(eq(thoughts.id, id))
    .returning()

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Fetch the thought to verify access
  const [thought] = await db
    .select()
    .from(thoughts)
    .where(eq(thoughts.id, id))

  if (!thought) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Verify user is a member of the thought's brain
  const [membership] = await db
    .select()
    .from(brain_members)
    .where(
      and(
        eq(brain_members.brain_id, thought.brain_id),
        eq(brain_members.user_id, userId)
      )
    )

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Soft delete
  await db
    .update(thoughts)
    .set({ is_archived: true, updated_at: new Date() })
    .where(eq(thoughts.id, id))

  return NextResponse.json({ success: true })
}
