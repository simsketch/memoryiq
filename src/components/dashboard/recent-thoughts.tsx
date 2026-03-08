'use client'

import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryBadge } from '@/components/dashboard/category-badge'

interface Thought {
  id: string
  content: string
  metadata: Record<string, unknown> | null
  created_at: string
}

interface RecentThoughtsProps {
  thoughts: Thought[]
}

export function RecentThoughts({ thoughts }: RecentThoughtsProps) {
  if (thoughts.length === 0) {
    return (
      <Card className="border-white/10 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-white">Recent Thoughts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">
            No thoughts yet. Capture your first thought to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-white">Recent Thoughts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {thoughts.map((thought) => {
          const category =
            (thought.metadata as Record<string, unknown>)?.category as
              | string
              | undefined
          return (
            <div
              key={thought.id}
              className="rounded-lg border border-white/5 bg-zinc-950 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="line-clamp-3 flex-1 text-sm text-white">
                  {thought.content}
                </p>
                {category && <CategoryBadge category={category} />}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {formatDistanceToNow(new Date(thought.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
