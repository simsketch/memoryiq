'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CreateBrainDialogProps {
  onCreated: () => void
}

export function CreateBrainDialog({ onCreated }: CreateBrainDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<string>('personal')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/brains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          type,
          description: description.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create brain')
      }

      toast.success('Brain created!')
      setName('')
      setType('personal')
      setDescription('')
      setOpen(false)
      onCreated()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-violet-600 text-white hover:bg-violet-700" />
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Brain
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Create a New Brain</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Name</label>
            <Input
              placeholder="e.g. Work Notes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-white/10 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Type</label>
            <Select value={type} onValueChange={(v) => setType(v ?? 'personal')}>
              <SelectTrigger className="w-full border-white/10 bg-zinc-950 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-900">
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">
              Description
            </label>
            <Textarea
              placeholder="What is this brain for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20 border-white/10 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full bg-violet-600 text-white hover:bg-violet-700"
          >
            {submitting ? 'Creating...' : 'Create Brain'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
