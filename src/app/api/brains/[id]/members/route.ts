import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brain_members } from '../../../../../../drizzle/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { email, role } = body

  if (!email || !role) {
    return NextResponse.json(
      { error: 'email and role are required' },
      { status: 400 }
    )
  }

  // Verify caller is owner or admin of this brain
  const [callerMembership] = await db
    .select()
    .from(brain_members)
    .where(
      and(
        eq(brain_members.brain_id, id),
        eq(brain_members.user_id, userId)
      )
    )

  if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Look up Clerk user by email
  const clerk = await clerkClient()
  const users = await clerk.users.getUserList({ emailAddress: [email] })

  if (users.totalCount === 0) {
    return NextResponse.json(
      { error: 'User not found. They must sign up first.' },
      { status: 404 }
    )
  }

  const targetUserId = users.data[0].id

  // Check if already a member
  const [existing] = await db
    .select()
    .from(brain_members)
    .where(
      and(
        eq(brain_members.brain_id, id),
        eq(brain_members.user_id, targetUserId)
      )
    )

  if (existing) {
    return NextResponse.json(
      { error: 'User is already a member of this brain' },
      { status: 409 }
    )
  }

  // Insert new member
  const [member] = await db
    .insert(brain_members)
    .values({
      brain_id: id,
      user_id: targetUserId,
      role,
      invited_by: userId,
    })
    .returning()

  return NextResponse.json(member, { status: 201 })
}
