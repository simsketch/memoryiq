import { MessageSquare, Sparkles, Search } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Capture',
    description: 'Type a thought from anywhere',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Understand',
    description: 'AI embeds, classifies, links by meaning',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Remember',
    description: 'Any AI searches your brain semantically',
    icon: Search,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-purple-500/50 to-pink-500/50 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col md:flex-row items-center gap-6 md:gap-12"
              >
                {/* Left content (odd) or empty */}
                <div
                  className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:order-3'}`}
                >
                  <div
                    className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 ${index % 2 === 0 ? 'md:ml-auto' : ''} max-w-sm ${index % 2 !== 0 ? 'md:ml-0' : 'md:mr-0'}`}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400">{step.description}</p>
                  </div>
                </div>

                {/* Center icon */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-violet-600 border-4 border-[#0a0118] md:order-2">
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Right content (even) or empty spacer */}
                <div
                  className={`flex-1 hidden md:block ${index % 2 === 0 ? 'md:order-3' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
