'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  Pin,
  PinOff,
  Archive,
  Pencil,
  Globe,
  MessageSquare,
  Bot,
  Webhook,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/dashboard/category-badge'

interface ThoughtCardProps {
  thought: {
    id: string
    content: string
    metadata: Record<string, unknown> | null
    source_type: string
    is_pinned: boolean
    is_archived: boolean
    conflict_flag: boolean
    created_at: string
  }
  onUpdated?: () => void
}

const sourceIcons: Record<string, React.ComponentType<{ className?: string }>> =
  {
    web: Globe,
    chat: MessageSquare,
    mcp: Bot,
    api: Webhook,
  }

export function ThoughtCard({ thought, onUpdated }: ThoughtCardProps) {
  const [loading, setLoading] = useState(false)
  const meta = thought.metadata as Record<string, unknown> | null
  const category = (meta?.category as string) ?? undefined
  const tags = (meta?.tags as string[]) ?? []
  const people = (meta?.people as string[]) ?? []
  const SourceIcon = sourceIcons[thought.source_type] ?? Globe

  async function togglePin() {
    setLoading(true)
    try {
      const res = await fetch(`/api/thoughts/${thought.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned: !thought.is_pinned }),
      })
      if (!res.ok) throw new Error('Failed to update')
      toast.success(thought.is_pinned ? 'Unpinned' : 'Pinned')
      onUpdated?.()
    } catch {
      toast.error('Failed to update thought')
    } finally {
      setLoading(false)
    }
  }

  async function archiveThought() {
    setLoading(true)
    try {
      const res = await fetch(`/api/thoughts/${thought.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: true }),
      })
      if (!res.ok) throw new Error('Failed to archive')
      toast.success('Thought archived')
      onUpdated?.()
    } catch {
      toast.error('Failed to archive thought')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-white/10 bg-zinc-900 transition-colors hover:border-white/20">
      <CardContent className="space-y-3">
        {/* Content */}
        <p className="line-clamp-3 text-sm text-white">{thought.content}</p>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          {category && <CategoryBadge category={category} />}
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
            >
              #{tag}
            </span>
          ))}
          {people.map((person) => (
            <span
              key={person}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
            >
              <User className="h-3 w-3" />
              {person}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <SourceIcon className="h-3.5 w-3.5" />
            <span>
              {formatDistanceToNow(new Date(thought.created_at), {
                addSuffix: true,
              })}
            </span>
            {thought.conflict_flag && (
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-red-400">
                conflict
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={togglePin}
              disabled={loading}
              className="text-zinc-400 hover:text-white"
            >
              {thought.is_pinned ? (
                <PinOff className="h-3.5 w-3.5" />
              ) : (
                <Pin className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={archiveThought}
              disabled={loading}
              className="text-zinc-400 hover:text-white"
            >
              <Archive className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={loading}
              className="text-zinc-400 hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
