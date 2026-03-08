import { Brain, Lock, Users } from 'lucide-react'

const problems = [
  {
    icon: Brain,
    title: 'Every conversation starts from zero',
    description:
      'Your AI forgets everything the moment you close the chat. No continuity, no context.',
  },
  {
    icon: Lock,
    title: 'Memories locked in silos',
    description:
      'Knowledge trapped in individual tools with no way to share across your AI ecosystem.',
  },
  {
    icon: Users,
    title: 'Team knowledge scattered everywhere',
    description:
      'Critical information lives in different heads and different tools, impossible to find.',
  },
]

export function ProblemSection() {
  return (
    <section className="px-6 py-24">
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
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-violet-500/10 mb-6">
                <problem.icon className="w-7 h-7 text-violet-400" />
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
