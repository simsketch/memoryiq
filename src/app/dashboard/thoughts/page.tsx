'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ThoughtCard } from '@/components/dashboard/thought-card'
import { ThoughtFilters } from '@/components/dashboard/thought-filters'

interface Brain {
  id: string
  name: string
}

interface Thought {
  id: string
  content: string
  metadata: Record<string, unknown> | null
  source_type: string
  is_pinned: boolean
  is_archived: boolean
  conflict_flag: boolean
  created_at: string
}

const PAGE_SIZE = 20

function ThoughtsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [brains, setBrains] = useState<Brain[]>([])
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Read filter state from URL search params
  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const brainId = searchParams.get('brain_id') ?? ''
  const pinned = searchParams.get('pinned') === 'true'
  const archived = searchParams.get('archived') === 'true'
  const conflictsOnly = searchParams.get('conflicts_only') === 'true'
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const [searchInput, setSearchInput] = useState(q)

  // Update URL params helper
  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    // Reset offset when filters change (unless offset itself is being set)
    if (!('offset' in updates)) {
      params.delete('offset')
    }
    router.push(`/dashboard/thoughts?${params.toString()}`)
  }

  const fetchThoughts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (category) params.set('category', category)
      if (brainId) params.set('brain_id', brainId)
      if (pinned) params.set('pinned', 'true')
      if (archived) params.set('archived', 'true')
      if (conflictsOnly) params.set('conflicts_only', 'true')
      params.set('limit', String(PAGE_SIZE))
      params.set('offset', String(offset))

      const res = await fetch(`/api/thoughts?${params.toString()}`)
      const data = await res.json()
      setThoughts(data.thoughts ?? [])
      setTotal(data.total ?? 0)
    } catch {
      // Error handling
    } finally {
      setLoading(false)
    }
  }, [q, category, brainId, pinned, archived, conflictsOnly, offset])

  const fetchBrains = useCallback(async () => {
    try {
      const res = await fetch('/api/brains')
      const data = await res.json()
      setBrains(data.brains ?? [])
    } catch {
      // Error handling
    }
  }, [])

  useEffect(() => {
    fetchBrains()
  }, [fetchBrains])

  useEffect(() => {
    fetchThoughts()
  }, [fetchThoughts])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ q: searchInput })
  }

  const hasMore = offset + PAGE_SIZE < total
  const hasPrev = offset > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Thoughts</h1>
        <p className="mt-1 text-zinc-400">
          Search, filter, and manage your captured thoughts.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search thoughts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border-white/10 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
          />
        </div>
        <Button
          type="submit"
          className="bg-violet-600 text-white hover:bg-violet-700"
        >
          Search
        </Button>
      </form>

      {/* Filters */}
      <ThoughtFilters
        category={category}
        brainId={brainId}
        pinned={pinned}
        archived={archived}
        conflictsOnly={conflictsOnly}
        brains={brains}
        onCategoryChange={(value) =>
          updateParams({ category: value === '__all__' ? '' : value })
        }
        onBrainChange={(value) =>
          updateParams({ brain_id: value === '__all__' ? '' : value })
        }
        onPinnedChange={(value) =>
          updateParams({ pinned: value ? 'true' : '' })
        }
        onArchivedChange={(value) =>
          updateParams({ archived: value ? 'true' : '' })
        }
        onConflictsOnlyChange={(value) =>
          updateParams({ conflicts_only: value ? 'true' : '' })
        }
      />

      {/* Thoughts grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-zinc-900"
            />
          ))}
        </div>
      ) : thoughts.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">No thoughts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {thoughts.map((thought) => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              onUpdated={fetchThoughts}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {(hasPrev || hasMore) && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={!hasPrev}
            onClick={() =>
              updateParams({
                offset: String(Math.max(0, offset - PAGE_SIZE)),
              })
            }
            className="border-white/10 text-zinc-400 hover:text-white"
          >
            Previous
          </Button>
          <span className="text-sm text-zinc-500">
            Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of{' '}
            {total}
          </span>
          <Button
            variant="outline"
            disabled={!hasMore}
            onClick={() =>
              updateParams({ offset: String(offset + PAGE_SIZE) })
            }
            className="border-white/10 text-zinc-400 hover:text-white"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default function ThoughtsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Thoughts</h1>
            <p className="mt-1 text-zinc-400">Loading...</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-zinc-900"
              />
            ))}
          </div>
        </div>
      }
    >
      <ThoughtsContent />
    </Suspense>
  )
}
