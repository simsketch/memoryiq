'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Brain } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CreateBrainDialog } from '@/components/dashboard/create-brain-dialog'

interface BrainItem {
  id: string
  name: string
  type: string
  description: string | null
  created_at: string
}

export default function BrainsPage() {
  const router = useRouter()
  const [brains, setBrains] = useState<BrainItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBrains = useCallback(async () => {
    try {
      const res = await fetch('/api/brains')
      const data = await res.json()
      setBrains(data.brains ?? [])
    } catch {
      // Error handling
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrains()
  }, [fetchBrains])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brains</h1>
          <p className="mt-1 text-zinc-400">
            Manage your knowledge containers.
          </p>
        </div>
        <CreateBrainDialog onCreated={fetchBrains} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl bg-zinc-900"
            />
          ))}
        </div>
      ) : brains.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-12 text-center">
          <Brain className="mx-auto h-10 w-10 text-zinc-600" />
          <p className="mt-3 text-zinc-400">
            No brains yet. Create your first brain to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brains.map((brain) => (
            <Card
              key={brain.id}
              className="cursor-pointer border-white/10 bg-zinc-900 transition-colors hover:border-white/20"
              onClick={() => router.push(`/dashboard/brains/${brain.id}`)}
            >
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{brain.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      brain.type === 'personal'
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {brain.type}
                  </span>
                </div>
                {brain.description && (
                  <p className="line-clamp-2 text-sm text-zinc-400">
                    {brain.description}
                  </p>
                )}
                <p className="text-xs text-zinc-500">
                  Created{' '}
                  {new Date(brain.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
