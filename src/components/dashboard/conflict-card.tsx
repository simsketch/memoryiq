'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { AlertTriangle, Check, Combine, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Thought {
  id: string
  content: string
  captured_by: string
  created_at: string
  conflict_flag: boolean
}

interface ConflictCardProps {
  thought: Thought
  linkedThoughts: Thought[]
  onResolved: () => void
}

export function ConflictCard({
  thought,
  linkedThoughts,
  onResolved,
}: ConflictCardProps) {
  const [loading, setLoading] = useState(false)

  async function keepThis() {
    setLoading(true)
    try {
      // Archive linked thoughts and clear conflict on this one
      await Promise.all([
        ...linkedThoughts.map((lt) =>
          fetch(`/api/thoughts/${lt.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_archived: true }),
          })
        ),
        fetch(`/api/thoughts/${thought.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conflict_flag: false }),
        }),
      ])
      toast.success('Kept this thought, archived conflicts')
      onResolved()
    } catch {
      toast.error('Failed to resolve conflict')
    } finally {
      setLoading(false)
    }
  }

  async function keepBoth() {
    setLoading(true)
    try {
      await Promise.all([
        fetch(`/api/thoughts/${thought.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conflict_flag: false }),
        }),
        ...linkedThoughts.map((lt) =>
          fetch(`/api/thoughts/${lt.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conflict_flag: false }),
          })
        ),
      ])
      toast.success('Kept all thoughts, cleared conflict flags')
      onResolved()
    } catch {
      toast.error('Failed to resolve conflict')
    } finally {
      setLoading(false)
    }
  }

  async function merge() {
    setLoading(true)
    try {
      const mergedContent = [
        thought.content,
        ...linkedThoughts.map((lt) => lt.content),
      ].join('\n\n---\n\n')

      await Promise.all([
        fetch(`/api/thoughts/${thought.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: mergedContent,
            conflict_flag: false,
          }),
        }),
        ...linkedThoughts.map((lt) =>
          fetch(`/api/thoughts/${lt.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_archived: true }),
          })
        ),
      ])
      toast.success('Thoughts merged')
      onResolved()
    } catch {
      toast.error('Failed to merge')
    } finally {
      setLoading(false)
    }
  }

  async function dismiss() {
    setLoading(true)
    try {
      await fetch(`/api/thoughts/${thought.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conflict_flag: false }),
      })
      toast.success('Conflict dismissed')
      onResolved()
    } catch {
      toast.error('Failed to dismiss')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-zinc-900">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-orange-400">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Conflict Detected</span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Main thought */}
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-3">
            <p className="text-sm text-white">{thought.content}</p>
            <p className="mt-2 text-xs text-zinc-500">
              {formatDistanceToNow(new Date(thought.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>

          {/* Conflicting thoughts */}
          {linkedThoughts.map((lt) => (
            <div
              key={lt.id}
              className="rounded-lg border border-orange-500/20 bg-zinc-950 p-3"
            >
              <p className="text-sm text-white">{lt.content}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {formatDistanceToNow(new Date(lt.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={keepThis}
            disabled={loading}
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            <Check className="mr-1 h-3.5 w-3.5" />
            Keep This One
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={keepBoth}
            disabled={loading}
            className="border-white/10 text-zinc-300 hover:text-white"
          >
            Keep Both
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={merge}
            disabled={loading}
            className="border-white/10 text-zinc-300 hover:text-white"
          >
            <Combine className="mr-1 h-3.5 w-3.5" />
            Merge
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={dismiss}
            disabled={loading}
            className="text-zinc-400 hover:text-white"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
