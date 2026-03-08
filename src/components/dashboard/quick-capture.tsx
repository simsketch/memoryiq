'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Brain {
  id: string
  name: string
}

interface QuickCaptureProps {
  brains: Brain[]
  onCaptured?: () => void
}

export function QuickCapture({ brains, onCaptured }: QuickCaptureProps) {
  const [content, setContent] = useState('')
  const [brainId, setBrainId] = useState<string | null>(
    brains.length > 0 ? brains[0].id : null
  )
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!brainId || !content.trim()) {
      toast.error('Please select a brain and enter your thought.')
      return
    }

    setSubmitting(true)
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

      toast.success('Thought captured!')
      setContent('')
      onCaptured?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-white/10 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-white">Quick Capture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select
          value={brainId}
          onValueChange={(value) => setBrainId(value as string)}
        >
          <SelectTrigger className="w-full border-white/10 bg-zinc-950 text-white">
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

        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-24 border-white/10 bg-zinc-950 text-white placeholder:text-zinc-500"
        />

        <Button
          onClick={handleSubmit}
          disabled={submitting || !content.trim() || !brainId}
          className="w-full bg-violet-600 text-white hover:bg-violet-700"
        >
          <Send className="mr-2 h-4 w-4" />
          {submitting ? 'Capturing...' : 'Capture'}
        </Button>
      </CardContent>
    </Card>
  )
}
