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
    <section className="px-6 py-28">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Works With Your Tools
          </span>
        </h2>
        <p className="text-zinc-400 mb-14 max-w-xl mx-auto">
          Connect MemoryIQ to the AI tools you already use. One memory layer, every AI.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:bg-white/[0.08] hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/15"
            >
              {/* Pulse glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <integration.icon className="relative z-10 w-9 h-9 text-violet-400 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10 text-sm text-zinc-300 font-medium">
                {integration.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-10">
          And any tool that supports the Model Context Protocol
        </p>
      </div>
    </section>
  )
}
