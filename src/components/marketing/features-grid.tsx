import { Search, Users, Plug, Sparkles, Inbox, Shield } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Semantic Search',
    description: 'Find anything by meaning, not just keywords. Your memories understand context and surface the most relevant results instantly.',
  },
  {
    icon: Users,
    title: 'Shared Brains',
    description: 'Team knowledge bases with roles and permissions. Collaborate on shared memory spaces and build collective intelligence.',
  },
  {
    icon: Plug,
    title: 'MCP Protocol',
    description: 'Connect any AI tool that supports the Model Context Protocol standard. Works with Claude, ChatGPT, Cursor, and more.',
  },
  {
    icon: Sparkles,
    title: 'Smart Curation',
    description: 'AI detects conflicts, stale content, and suggests improvements automatically, keeping your knowledge base sharp.',
  },
  {
    icon: Inbox,
    title: 'Multiple Sources',
    description: 'Capture from Web, API, MCP, Slack, WhatsApp, and more. Every channel funnels into one unified memory layer.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data, your control. We never train on your memories. Full data portability with export at any time.',
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Everything You Need
          </span>
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
          A complete memory layer for your AI ecosystem
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-7 transition-all duration-300 hover:bg-white/[0.08] hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10"
            >
              {/* Hover gradient border glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-violet-500/5 to-pink-500/5" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 mb-5">
                  <feature.icon className="w-7 h-7 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
