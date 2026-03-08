'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryBadge } from '@/components/dashboard/category-badge'

interface Brain {
  id: string
  name: string
}

interface CapturedMetadata {
  category?: string
  tags?: string[]
  people?: string[]
  action_items?: string[]
  sentiment?: string
}

const categories = [
  { value: '__auto__', label: 'Auto-detect (AI)' },
  { value: 'idea', label: 'Idea' },
  { value: 'decision', label: 'Decision' },
  { value: 'person_note', label: 'Person Note' },
  { value: 'task', label: 'Task' },
  { value: 'reference', label: 'Reference' },
  { value: 'observation', label: 'Observation' },
  { value: 'question', label: 'Question' },
]

export default function CapturePage() {
  const [brains, setBrains] = useState<Brain[]>([])
  const [brainId, setBrainId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showOverrides, setShowOverrides] = useState(false)
  const [overrideCategory, setOverrideCategory] = useState('__auto__')
  const [overrideTags, setOverrideTags] = useState('')
  const [overridePeople, setOverridePeople] = useState('')
  const [capturedResult, setCapturedResult] = useState<CapturedMetadata | null>(
    null
  )
  const [showResult, setShowResult] = useState(false)

  const fetchBrains = useCallback(async () => {
    try {
      const res = await fetch('/api/brains')
      const data = await res.json()
      const brainList: Brain[] = data.brains ?? []
      setBrains(brainList)
      if (brainList.length > 0 && !brainId) {
        setBrainId(brainList[0].id)
      }
    } catch {
      // Error handling
    }
  }, [brainId])

  useEffect(() => {
    fetchBrains()
  }, [fetchBrains])

  async function handleSubmit() {
    if (!brainId) {
      toast.error('Please select a brain.')
      return
    }
    if (!content.trim()) {
      toast.error('Please enter your thought.')
      return
    }

    setSubmitting(true)
    setCapturedResult(null)
    setShowResult(false)

    try {
      const res = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brain_id: brainId,
          content: content.trim(),
          source_type: 'web',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to capture thought')
      }

      const thought = await res.json()
      const meta = (thought.metadata ?? {}) as CapturedMetadata

      // Apply overrides to displayed result
      if (overrideCategory && overrideCategory !== '__auto__') {
        meta.category = overrideCategory
      }
      if (overrideTags.trim()) {
        meta.tags = overrideTags.split(',').map((t: string) => t.trim()).filter(Boolean)
      }
      if (overridePeople.trim()) {
        meta.people = overridePeople.split(',').map((p: string) => p.trim()).filter(Boolean)
      }

      setCapturedResult(meta)
      setShowResult(true)
      toast.success('Thought captured successfully!')
      setContent('')
      setOverrideCategory('__auto__')
      setOverrideTags('')
      setOverridePeople('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Capture Thought</h1>
        <p className="mt-1 text-zinc-400">
          Record a new thought. AI will automatically extract metadata.
        </p>
      </div>

      {/* Brain selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Brain
        </label>
        <Select
          value={brainId}
          onValueChange={(value) => setBrainId(value as string)}
        >
          <SelectTrigger className="w-full border-white/10 bg-zinc-900 text-white">
            <SelectValue placeholder="Select a brain" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-zinc-900">
            {brains.map((brain) => (
              <SelectItem key={brain.id} value={brain.id}>
                {brain.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Thought content */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Thought
        </label>
        <Textarea
          placeholder="What's on your mind? Type your thought here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-40 border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Override metadata (collapsible) */}
      <div className="rounded-lg border border-white/10 bg-zinc-900">
        <button
          type="button"
          onClick={() => setShowOverrides(!showOverrides)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Override metadata
          {showOverrides ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {showOverrides && (
          <div className="space-y-4 border-t border-white/10 px-4 py-4">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                Category
              </label>
              <Select
                value={overrideCategory}
                onValueChange={(value) =>
                  setOverrideCategory(value as string)
                }
              >
                <SelectTrigger className="w-full border-white/10 bg-zinc-950 text-white">
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-900">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                Tags (comma-separated)
              </label>
              <Input
                placeholder="e.g. project-x, important, follow-up"
                value={overrideTags}
                onChange={(e) => setOverrideTags(e.target.value)}
                className="border-white/10 bg-zinc-950 text-white placeholder:text-zinc-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                People (comma-separated)
              </label>
              <Input
                placeholder="e.g. Alice, Bob"
                value={overridePeople}
                onChange={(e) => setOverridePeople(e.target.value)}
                className="border-white/10 bg-zinc-950 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={submitting || !content.trim() || !brainId}
        className="w-full bg-violet-600 py-5 text-white hover:bg-violet-700"
      >
        <Send className="mr-2 h-4 w-4" />
        {submitting ? 'Capturing...' : 'Capture Thought'}
      </Button>

      {/* Result card with fade-in animation */}
      {showResult && capturedResult && (
        <Card
          className="animate-in fade-in slide-in-from-bottom-4 border-white/10 bg-zinc-900 duration-500"
        >
          <CardContent className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-400">
              AI-Extracted Metadata
            </h3>

            {capturedResult.category && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Category:</span>
                <CategoryBadge category={capturedResult.category} />
              </div>
            )}

            {capturedResult.tags && capturedResult.tags.length > 0 && (
              <div>
                <span className="text-xs text-zinc-500">Tags:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {capturedResult.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {capturedResult.people && capturedResult.people.length > 0 && (
              <div>
                <span className="text-xs text-zinc-500">People:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {capturedResult.people.map((person) => (
                    <span
                      key={person}
                      className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                    >
                      <User className="h-3 w-3" />
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {capturedResult.action_items &&
              capturedResult.action_items.length > 0 && (
                <div>
                  <span className="text-xs text-zinc-500">Action Items:</span>
                  <ul className="mt-1 list-inside list-disc text-sm text-zinc-300">
                    {capturedResult.action_items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

            {capturedResult.sentiment && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Sentiment:</span>
                <span className="text-sm text-zinc-300">
                  {capturedResult.sentiment}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
