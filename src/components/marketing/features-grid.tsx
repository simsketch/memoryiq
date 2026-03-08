import { Search, Users, Plug, Sparkles, Inbox, Shield } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Semantic Search',
    description: 'Find anything by meaning, not just keywords. Your memories understand context.',
  },
  {
    icon: Users,
    title: 'Shared Brains',
    description: 'Team knowledge bases with roles. Collaborate on shared memory spaces.',
  },
  {
    icon: Plug,
    title: 'MCP Protocol',
    description: 'Connect any AI tool that supports the Model Context Protocol standard.',
  },
  {
    icon: Sparkles,
    title: 'Smart Curation',
    description: 'AI detects conflicts, stale content, and suggests improvements automatically.',
  },
  {
    icon: Inbox,
    title: 'Multiple Sources',
    description: 'Capture from Web, API, MCP, Slack, WhatsApp, and more.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data, your control. No training on your memories. Full data portability.',
  },
]

export function FeaturesGrid() {
  return (
    <section className="px-6 py-24">
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
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 transition-colors hover:bg-white/[0.08]"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-violet-500/10 mb-4">
                <feature.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
