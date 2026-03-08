'use client'

import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Brain {
  id: string
  name: string
}

interface ThoughtFiltersProps {
  category: string
  brainId: string
  pinned: boolean
  archived: boolean
  conflictsOnly: boolean
  brains: Brain[]
  onCategoryChange: (value: string) => void
  onBrainChange: (value: string) => void
  onPinnedChange: (value: boolean) => void
  onArchivedChange: (value: boolean) => void
  onConflictsOnlyChange: (value: boolean) => void
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'idea', label: 'Idea' },
  { value: 'decision', label: 'Decision' },
  { value: 'person_note', label: 'Person Note' },
  { value: 'task', label: 'Task' },
  { value: 'reference', label: 'Reference' },
  { value: 'observation', label: 'Observation' },
  { value: 'question', label: 'Question' },
]

export function ThoughtFilters({
  category,
  brainId,
  pinned,
  archived,
  conflictsOnly,
  brains,
  onCategoryChange,
  onBrainChange,
  onPinnedChange,
  onArchivedChange,
  onConflictsOnlyChange,
}: ThoughtFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select
        value={category || null}
        onValueChange={(value) => onCategoryChange((value as string) ?? '')}
      >
        <SelectTrigger className="w-40 border-white/10 bg-zinc-900 text-white">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-zinc-900">
          {categories.map((cat) => (
            <SelectItem key={cat.value || '__all__'} value={cat.value || '__all__'}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={brainId || null}
        onValueChange={(value) => onBrainChange((value as string) ?? '')}
      >
        <SelectTrigger className="w-40 border-white/10 bg-zinc-900 text-white">
          <SelectValue placeholder="All Brains" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-zinc-900">
          <SelectItem value="__all__">All Brains</SelectItem>
          {brains.map((brain) => (
            <SelectItem key={brain.id} value={brain.id}>
              {brain.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <Switch
          checked={pinned}
          onCheckedChange={(checked) => onPinnedChange(checked)}
        />
        Pinned
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <Switch
          checked={archived}
          onCheckedChange={(checked) => onArchivedChange(checked)}
        />
        Archived
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <Switch
          checked={conflictsOnly}
          onCheckedChange={(checked) => onConflictsOnlyChange(checked)}
        />
        Conflicts only
      </label>
    </div>
  )
}
