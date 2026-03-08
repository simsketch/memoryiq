import { Bot, MessageSquare, Code, Braces, Hash, Phone } from 'lucide-react'

const integrations = [
  { name: 'Claude', icon: Bot },
  { name: 'ChatGPT', icon: MessageSquare },
  { name: 'Cursor', icon: Code },
  { name: 'VS Code Copilot', icon: Braces },
  { name: 'Slack', icon: Hash },
  { name: 'WhatsApp', icon: Phone },
]

export function Integrations() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Works With Your Tools
          </span>
        </h2>
        <p className="text-zinc-400 mb-12 max-w-xl mx-auto">
          Connect MemoryIQ to the AI tools you already use
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors hover:bg-white/[0.08]"
            >
              <integration.icon className="w-8 h-8 text-violet-400" />
              <span className="text-sm text-zinc-300 font-medium">
                {integration.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-8">
          And any tool that supports the Model Context Protocol
        </p>
      </div>
    </section>
  )
}
