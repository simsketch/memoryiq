import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { brain_members, thoughts } from '../../../../../../drizzle/schema'
import { eq, and, count, avg, sql } from 'drizzle-orm'
import { subDays } from 'date-fns'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Verify caller is a member of this brain
  const [membership] = await db
    .select()
    .from(brain_members)
    .where(
      and(
        eq(brain_members.brain_id, id),
        eq(brain_members.user_id, userId)
      )
    )

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const oneWeekAgo = subDays(new Date(), 7)

  // Run all stat queries in parallel
  const [
    totalResult,
    byCategoryResult,
    capturedThisWeekResult,
    conflictResult,
    stalenessResult,
    memberCountResult,
  ] = await Promise.all([
    // total_thoughts
    db
      .select({ count: count() })
      .from(thoughts)
      .where(eq(thoughts.brain_id, id)),

    // by_category
    db
      .select({
        category: sql<string>`${thoughts.metadata}->>'category'`,
        count: count(),
      })
      .from(thoughts)
      .where(eq(thoughts.brain_id, id))
      .groupBy(sql`${thoughts.metadata}->>'category'`),

    // captured_this_week
    db
      .select({ count: count() })
      .from(thoughts)
      .where(
        and(
          eq(thoughts.brain_id, id),
          sql`${thoughts.created_at} >= ${oneWeekAgo}`
        )
      ),

    // conflict_count
    db
      .select({ count: count() })
      .from(thoughts)
      .where(
        and(
          eq(thoughts.brain_id, id),
          eq(thoughts.conflict_flag, true)
        )
      ),

    // avg_staleness_score
    db
      .select({ avg: avg(thoughts.staleness_score) })
      .from(thoughts)
      .where(eq(thoughts.brain_id, id)),

    // member_count
    db
      .select({ count: count() })
      .from(brain_members)
      .where(eq(brain_members.brain_id, id)),
  ])

  return NextResponse.json({
    total_thoughts: totalResult[0].count,
    by_category: byCategoryResult,
    captured_this_week: capturedThisWeekResult[0].count,
    conflict_count: conflictResult[0].count,
    avg_staleness_score: stalenessResult[0].avg
      ? parseFloat(stalenessResult[0].avg)
      : 0,
    member_count: memberCountResult[0].count,
  })
}
