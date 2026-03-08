'use client'

import { useEffect, useState, useCallback } from 'react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentThoughts } from '@/components/dashboard/recent-thoughts'
import { QuickCapture } from '@/components/dashboard/quick-capture'

interface Brain {
  id: string
  name: string
}

interface Thought {
  id: string
  content: string
  metadata: Record<string, unknown> | null
  created_at: string
}

interface Stats {
  total_thoughts: number
  captured_this_week: number
  conflict_count: number
}

export default function DashboardPage() {
  const [brains, setBrains] = useState<Brain[]>([])
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [brainsRes, thoughtsRes] = await Promise.all([
        fetch('/api/brains'),
        fetch('/api/thoughts?limit=10'),
      ])

      const brainsData = await brainsRes.json()
      const thoughtsData = await thoughtsRes.json()

      const brainList: Brain[] = brainsData.brains ?? []
      setBrains(brainList)
      setThoughts(thoughtsData.thoughts ?? [])

      // Fetch stats for the first brain if available
      if (brainList.length > 0) {
        const statsRes = await fetch(`/api/brains/${brainList[0].id}/stats`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      }
    } catch {
      // Silently handle errors - data will remain in loading state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-zinc-900"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-zinc-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-zinc-400">
          Welcome to MemoryIQ. Here is your overview.
        </p>
      </div>

      <StatsCards
        totalThoughts={stats?.total_thoughts ?? 0}
        brainsCount={brains.length}
        capturedThisWeek={stats?.captured_this_week ?? 0}
        conflictsCount={stats?.conflict_count ?? 0}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentThoughts thoughts={thoughts} />
        </div>
        <div>
          <QuickCapture brains={brains} onCaptured={fetchData} />
        </div>
      </div>
    </div>
  )
}
