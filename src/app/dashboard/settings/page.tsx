'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import {
  Brain,
  ClipboardCopy,
  Download,
  MessageSquare,
  Phone,
  Webhook,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface BrainItem {
  id: string
  name: string
  mcp_key: string
}

const integrations = [
  {
    name: 'Slack',
    description: 'Capture thoughts from Slack messages',
    icon: MessageSquare,
    enabled: false,
  },
  {
    name: 'WhatsApp',
    description: 'Capture thoughts from WhatsApp chats',
    icon: Phone,
    enabled: false,
  },
  {
    name: 'API',
    description: 'Custom API integration',
    icon: Webhook,
    enabled: false,
  },
]

export default function SettingsPage() {
  const { user } = useUser()
  const [brains, setBrains] = useState<BrainItem[]>([])

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

  function copyMcpUrl(mcpKey: string) {
    const url = `${window.location.origin}/api/mcp?key=${mcpKey}`
    navigator.clipboard.writeText(url)
    toast.success('MCP URL copied to clipboard')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-zinc-400">
          Manage your account, integrations, and data.
        </p>
      </div>

      {/* Account section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Account</h2>
        <Card className="border-white/10 bg-zinc-900">
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? ''} />
                <AvatarFallback className="bg-violet-500/20 text-violet-300">
                  {user?.firstName?.[0] ?? ''}
                  {user?.lastName?.[0] ?? ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">
                  {user?.fullName ?? 'Loading...'}
                </p>
                <p className="text-sm text-zinc-400">
                  {user?.primaryEmailAddress?.emailAddress ?? ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MCP Access Keys */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">MCP Access Keys</h2>
        {brains.length === 0 ? (
          <Card className="border-white/10 bg-zinc-900">
            <CardContent>
              <p className="text-sm text-zinc-400">
                No brains yet. Create a brain to get an MCP access key.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {brains.map((brain) => (
              <Card key={brain.id} className="border-white/10 bg-zinc-900">
                <CardContent>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-lg bg-violet-500/10 p-2">
                        <Brain className="h-4 w-4 text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white">{brain.name}</p>
                        <p className="truncate text-xs text-zinc-500">
                          {typeof window !== 'undefined'
                            ? `${window.location.origin}/api/mcp?key=${brain.mcp_key}`
                            : `...${brain.mcp_key.slice(-8)}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyMcpUrl(brain.mcp_key)}
                      className="shrink-0 border-white/10 text-zinc-400 hover:text-white"
                    >
                      <ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Connected Integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Connected Integrations
        </h2>
        <div className="space-y-3">
          {integrations.map((integration) => (
            <Card key={integration.name} className="border-white/10 bg-zinc-900">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2">
                      <integration.icon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                          {integration.name}
                        </p>
                        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
                          Coming soon
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Switch disabled checked={integration.enabled} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Export */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Data Export</h2>
        <Card className="border-white/10 bg-zinc-900">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">
                  Export All Thoughts (JSON)
                </p>
                <p className="text-sm text-zinc-400">
                  Download a JSON file with all your thoughts and metadata.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => toast.info('Coming soon')}
                className="border-white/10 text-zinc-400 hover:text-white"
              >
                <Download className="mr-1.5 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
