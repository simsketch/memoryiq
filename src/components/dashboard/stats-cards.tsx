'use client'

import { Brain, Lightbulb, CalendarDays, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardsProps {
  totalThoughts: number
  brainsCount: number
  capturedThisWeek: number
  conflictsCount: number
}

const stats = [
  {
    key: 'totalThoughts' as const,
    label: 'Total Thoughts',
    icon: Lightbulb,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    key: 'brainsCount' as const,
    label: 'Brains Count',
    icon: Brain,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'capturedThisWeek' as const,
    label: 'Captured This Week',
    icon: CalendarDays,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    key: 'conflictsCount' as const,
    label: 'Conflicts Needing Attention',
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
]

export function StatsCards({
  totalThoughts,
  brainsCount,
  capturedThisWeek,
  conflictsCount,
}: StatsCardsProps) {
  const values: Record<string, number> = {
    totalThoughts,
    brainsCount,
    capturedThisWeek,
    conflictsCount,
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.key}
          className="border-white/10 bg-zinc-900"
        >
          <CardContent className="flex items-center gap-4">
            <div className={`rounded-lg p-2.5 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">
                {values[stat.key]}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
