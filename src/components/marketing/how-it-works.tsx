import { MessageSquare, Sparkles, Search } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Capture',
    description:
      'Jot down a thought, paste a snippet, or send a message from any device. MemoryIQ ingests context from the web, API, Slack, WhatsApp, and more — no friction.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Understand',
    description:
      'Our AI automatically embeds, classifies, and links each memory by meaning. It detects duplicates, surfaces connections, and keeps your knowledge base coherent.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Remember',
    description:
      'Any connected AI — Claude, ChatGPT, Cursor — can query your brain semantically. The right context surfaces at the right moment, every time.',
    icon: Search,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-28">
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
                {/* Left content (even index) or empty */}
                <div
                  className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:order-3'}`}
                >
                  <div
                    className={`relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-7 ${index % 2 === 0 ? 'md:ml-auto' : ''} max-w-sm ${index % 2 !== 0 ? 'md:ml-0' : 'md:mr-0'} transition-all duration-300 hover:bg-white/[0.08] hover:border-violet-500/20`}
                  >
                    {/* Large faded step number */}
                    <span className={`absolute top-4 ${index % 2 === 0 ? 'right-5' : 'left-5'} text-7xl font-black text-white/[0.04] select-none leading-none pointer-events-none`}>
                      {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed relative z-10">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center icon with gradient glow */}
                <div className="relative z-10 md:order-2 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-violet-600/40 blur-xl scale-150" />
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 border-4 border-[#0a0118] shadow-lg shadow-violet-500/30">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Right spacer (even index) */}
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
