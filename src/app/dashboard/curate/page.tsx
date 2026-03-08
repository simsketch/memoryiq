'use client'

import { useEffect, useState, useCallback } from 'react'
import { AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConflictCard } from '@/components/dashboard/conflict-card'
import { StaleCard } from '@/components/dashboard/stale-card'

interface Thought {
  id: string
  content: string
  captured_by: string
  conflict_flag: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
}

export default function CuratePage() {
  const [conflicts, setConflicts] = useState<Thought[]>([])
  const [stale, setStale] = useState<Thought[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConflicts = useCallback(async () => {
    try {
      const res = await fetch('/api/thoughts?conflicts_only=true&limit=50')
      const data = await res.json()
      setConflicts(data.thoughts ?? [])
    } catch {
      // Error handling
    }
  }, [])

  const fetchStale = useCallback(async () => {
    try {
      // Fetch all thoughts and filter client-side for those not updated in 90+ days
      const res = await fetch('/api/thoughts?limit=100')
      const data = await res.json()
      const now = new Date()
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      const staleThoughts = (data.thoughts ?? []).filter((t: Thought) => {
        const updatedAt = new Date(t.updated_at)
        return updatedAt < ninetyDaysAgo
      })
      setStale(staleThoughts)
    } catch {
      // Error handling
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchConflicts(), fetchStale()]).finally(() =>
      setLoading(false)
    )
  }, [fetchConflicts, fetchStale])

  function handleResolved() {
    fetchConflicts()
    fetchStale()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Curate</h1>
        <p className="mt-1 text-zinc-400">
          Review conflicts, stale thoughts, and keep your knowledge base tidy.
        </p>
      </div>

      <Tabs defaultValue="conflicts" className="space-y-4">
        <TabsList className="border-white/10 bg-zinc-900">
          <TabsTrigger value="conflicts" className="data-[state=active]:bg-zinc-800">
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            Conflicts
            {conflicts.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500/20 px-1.5 text-xs text-orange-300">
                {conflicts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="stale" className="data-[state=active]:bg-zinc-800">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Stale
            {stale.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500/20 px-1.5 text-xs text-yellow-300">
                {stale.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            All
            {conflicts.length + stale.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500/20 px-1.5 text-xs text-violet-300">
                {conflicts.length + stale.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conflicts" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl bg-zinc-900"
                />
              ))}
            </div>
          ) : conflicts.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
              <p className="mt-3 text-zinc-400">
                No conflicts detected. Your knowledge base is clean!
              </p>
            </div>
          ) : (
            conflicts.map((thought) => (
              <ConflictCard
                key={thought.id}
                thought={thought}
                linkedThoughts={[]}
                onResolved={handleResolved}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="stale" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-zinc-900"
                />
              ))}
            </div>
          ) : stale.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
              <p className="mt-3 text-zinc-400">
                No stale thoughts found. Everything is up to date!
              </p>
            </div>
          ) : (
            stale.map((thought) => (
              <StaleCard
                key={thought.id}
                thought={thought}
                onResolved={handleResolved}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-xl bg-zinc-900"
                />
              ))}
            </div>
          ) : conflicts.length === 0 && stale.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
              <p className="mt-3 text-zinc-400">
                Everything looks great! No items need attention.
              </p>
            </div>
          ) : (
            <>
              {conflicts.map((thought) => (
                <ConflictCard
                  key={thought.id}
                  thought={thought}
                  linkedThoughts={[]}
                  onResolved={handleResolved}
                />
              ))}
              {stale.map((thought) => (
                <StaleCard
                  key={thought.id}
                  thought={thought}
                  onResolved={handleResolved}
                />
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
