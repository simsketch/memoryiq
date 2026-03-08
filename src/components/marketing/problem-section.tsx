import { Brain, Lock, Users } from 'lucide-react'

const problems = [
  {
    icon: Brain,
    title: 'Every conversation starts from zero',
    description:
      'Your AI forgets everything the moment you close the chat. No continuity, no context — you repeat yourself endlessly.',
  },
  {
    icon: Lock,
    title: 'Memories locked in silos',
    description:
      'Knowledge trapped in individual tools with no way to share across your AI ecosystem. Every tool is an island.',
  },
  {
    icon: Users,
    title: 'Team knowledge scattered everywhere',
    description:
      'Critical information lives in different heads and different tools, impossible to find when you need it most.',
  },
]

export function ProblemSection() {
  return (
    <section className="px-6 py-28">
      {/* Gradient divider */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
          <span className="text-white">Your AI Has </span>
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Amnesia
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-10 text-center transition-all duration-300 hover:bg-white/[0.08] hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/10"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-violet-500/10 mb-6 border border-violet-500/10">
                <problem.icon className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {problem.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
