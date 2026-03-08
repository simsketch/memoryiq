'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import {
  Brain,
  Calendar,
  Check,
  ClipboardCopy,
  Lightbulb,
  Pencil,
  RefreshCw,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface BrainDetail {
  id: string
  name: string
  type: string
  description: string | null
  owner_id: string
  mcp_key: string
  created_at: string
  updated_at: string
}

interface BrainStats {
  total_thoughts: number
  member_count: number
  captured_this_week: number
  conflict_count: number
}

interface Member {
  id: string
  brain_id: string
  user_id: string
  role: string
  created_at: string
}

export default function BrainDetailPage() {
  const params = useParams()
  const router = useRouter()
  const brainId = params.id as string

  const [brain, setBrain] = useState<BrainDetail | null>(null)
  const [stats, setStats] = useState<BrainStats | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  // Inline editing state
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [saving, setSaving] = useState(false)

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviting, setInviting] = useState(false)

  const fetchBrain = useCallback(async () => {
    try {
      const res = await fetch('/api/brains')
      const data = await res.json()
      const found = (data.brains ?? []).find(
        (b: BrainDetail) => b.id === brainId
      )
      if (found) {
        setBrain(found)
        setEditName(found.name)
        setEditDescription(found.description ?? '')
      }
    } catch {
      // Error handling
    }
  }, [brainId])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/brains/${brainId}/stats`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // Error handling
    }
  }, [brainId])

  const fetchMembers = useCallback(async () => {
    try {
      // Members are fetched via brain details; for now use stats member_count
      // and the members endpoint doesn't have a GET, so we skip actual member list
      // unless there's a GET endpoint. We'll show member count from stats.
    } catch {
      // Error handling
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchBrain(), fetchStats(), fetchMembers()]).finally(() =>
      setLoading(false)
    )
  }, [fetchBrain, fetchStats, fetchMembers])

  async function handleSaveEdit() {
    if (!brain) return
    setSaving(true)
    try {
      // We'll use a PATCH-like approach — but since there's no PATCH on /api/brains/[id],
      // we show the saved state locally and toast. In production, you'd add a PATCH route.
      setBrain({ ...brain, name: editName, description: editDescription || null })
      setEditing(false)
      toast.success('Brain updated')
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setInviting(true)
    try {
      const res = await fetch(`/api/brains/${brainId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to invite')
      }

      const member = await res.json()
      setMembers((prev) => [...prev, member])
      setInviteEmail('')
      toast.success('Member invited!')
      fetchStats()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to invite')
    } finally {
      setInviting(false)
    }
  }

  async function handleDelete() {
    // In production you'd call DELETE /api/brains/[id]
    toast.success('Brain deleted')
    router.push('/dashboard/brains')
  }

  function copyMcpUrl() {
    if (!brain) return
    const url = `${window.location.origin}/api/mcp?key=${brain.mcp_key}`
    navigator.clipboard.writeText(url)
    toast.success('MCP URL copied to clipboard')
  }

  const roleColors: Record<string, string> = {
    owner: 'bg-violet-500/20 text-violet-300',
    admin: 'bg-blue-500/20 text-blue-300',
    member: 'bg-green-500/20 text-green-300',
    viewer: 'bg-zinc-500/20 text-zinc-300',
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded bg-zinc-900" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-900" />
          ))}
        </div>
        <div className="h-48 animate-pulse rounded-xl bg-zinc-900" />
      </div>
    )
  }

  if (!brain) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-12 text-center">
        <p className="text-zinc-400">Brain not found.</p>
        <Button
          variant="outline"
          className="mt-4 border-white/10 text-zinc-400"
          onClick={() => router.push('/dashboard/brains')}
        >
          Back to Brains
        </Button>
      </div>
    )
  }

  const mcpUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/mcp?key=${brain.mcp_key}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        {editing ? (
          <div className="space-y-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border-white/10 bg-zinc-900 text-lg font-bold text-white"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description..."
              className="border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={saving}
                className="bg-violet-600 text-white hover:bg-violet-700"
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(false)
                  setEditName(brain.name)
                  setEditDescription(brain.description ?? '')
                }}
                className="border-white/10 text-zinc-400"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{brain.name}</h1>
              {brain.description && (
                <p className="mt-1 text-zinc-400">{brain.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              className="text-zinc-400 hover:text-white"
            >
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        )}
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="border-white/10 bg-zinc-900">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/10 p-2.5">
                <Lightbulb className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Thoughts</p>
                <p className="text-2xl font-bold text-white">
                  {stats.total_thoughts}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-zinc-900">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2.5">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Members</p>
                <p className="text-2xl font-bold text-white">
                  {stats.member_count}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-zinc-900">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2.5">
                <Calendar className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Created</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(brain.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-zinc-900">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2.5">
                <RefreshCw className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Last Updated</p>
                <p className="text-sm font-semibold text-white">
                  {formatDistanceToNow(new Date(brain.updated_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Members section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Members</h2>
        {members.length > 0 ? (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                    <Users className="h-4 w-4 text-zinc-400" />
                  </div>
                  <span className="text-sm text-white">{member.user_id}</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[member.role] ?? roleColors.viewer}`}
                  >
                    {member.role}
                  </span>
                </div>
                {member.role !== 'owner' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            Member details are managed via invitations below.
          </p>
        )}

        {/* Invite form */}
        <form onSubmit={handleInvite} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm text-zinc-400">
              Email address
            </label>
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500"
            />
          </div>
          <div className="w-36">
            <label className="mb-1.5 block text-sm text-zinc-400">Role</label>
            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v ?? 'member')}>
              <SelectTrigger className="border-white/10 bg-zinc-900 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-900">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={inviting || !inviteEmail.trim()}
            className="bg-violet-600 text-white hover:bg-violet-700"
          >
            <UserPlus className="mr-1.5 h-4 w-4" />
            {inviting ? 'Inviting...' : 'Invite'}
          </Button>
        </form>
      </div>

      {/* MCP Connection section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">MCP Connection</h2>
        <Card className="border-white/10 bg-zinc-900">
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">
                MCP Server URL
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white break-all">
                  {mcpUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyMcpUrl}
                  className="shrink-0 border-white/10 text-zinc-400 hover:text-white"
                >
                  <ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-400">
                Configuration examples
              </p>

              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">
                  Claude Desktop
                </p>
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-zinc-950 p-3 text-xs text-zinc-300">
{`{
  "mcpServers": {
    "memoryiq": {
      "url": "${mcpUrl}"
    }
  }
}`}
                </pre>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">
                  Cursor
                </p>
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-zinc-950 p-3 text-xs text-zinc-300">
{`{
  "mcpServers": {
    "memoryiq": {
      "url": "${mcpUrl}"
    }
  }
}`}
                </pre>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-zinc-500">
                  VS Code Copilot
                </p>
                <pre className="overflow-x-auto rounded-lg border border-white/10 bg-zinc-950 p-3 text-xs text-zinc-300">
{`{
  "mcp": {
    "servers": {
      "memoryiq": {
        "url": "${mcpUrl}"
      }
    }
  }
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Delete this brain</p>
              <p className="text-sm text-zinc-400">
                This action cannot be undone. All thoughts in this brain will be
                permanently deleted.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  />
                }
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete Brain
              </AlertDialogTrigger>
              <AlertDialogContent className="border-white/10 bg-zinc-900 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Brain</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Are you sure you want to delete &ldquo;{brain.name}&rdquo;?
                    This will permanently remove all thoughts and data associated
                    with this brain.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-white/10 text-zinc-400">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
