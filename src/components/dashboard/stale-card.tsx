'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { Archive, Clock, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Thought {
  id: string
  content: string
  updated_at: string
  created_at: string
}

interface StaleCardProps {
  thought: Thought
  onResolved: () => void
}

export function StaleCard({ thought, onResolved }: StaleCardProps) {
  const [loading, setLoading] = useState(false)

  async function markRelevant() {
    setLoading(true)
    try {
      await fetch(`/api/thoughts/${thought.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // The PATCH route sets updated_at automatically
      })
      toast.success('Marked as still relevant')
      onResolved()
    } catch {
      toast.error('Failed to update')
    } finally {
      setLoading(false)
    }
  }

  async function archive() {
    setLoading(true)
    try {
      await fetch(`/api/thoughts/${thought.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: true }),
      })
      toast.success('Thought archived')
      onResolved()
    } catch {
      toast.error('Failed to archive')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-zinc-900">
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-yellow-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Stale Thought</span>
        </div>

        <p className="text-sm text-white">{thought.content}</p>

        <p className="text-xs text-zinc-500">
          Last updated{' '}
          {formatDistanceToNow(new Date(thought.updated_at), {
            addSuffix: true,
          })}
        </p>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={markRelevant}
            disabled={loading}
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            Still Relevant
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={archive}
            disabled={loading}
            className="border-white/10 text-zinc-300 hover:text-white"
          >
            <Archive className="mr-1 h-3.5 w-3.5" />
            Archive
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
