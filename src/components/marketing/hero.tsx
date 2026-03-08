'use client'

import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 rounded-full bg-violet-500/30 animate-float-1 top-[20%] left-[15%]" />
        <div className="absolute w-3 h-3 rounded-full bg-purple-500/20 animate-float-2 top-[60%] left-[75%]" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-pink-500/25 animate-float-3 top-[40%] left-[50%]" />
        <div className="absolute w-2 h-2 rounded-full bg-violet-400/20 animate-float-2 top-[80%] left-[25%]" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-purple-400/30 animate-float-1 top-[10%] left-[85%]" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-pink-400/20 animate-float-3 top-[70%] left-[40%]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            One Brain. Every AI.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          A shared memory layer that connects all your AI tools. Capture thoughts
          from anywhere. Search by meaning, not keywords. Share knowledge with
          your team.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-violet-600 px-8 text-base font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0a0118]"
          >
            Get Started Free
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 px-8 text-base font-medium text-white transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onClick={(e) => {
              e.preventDefault()
              document
                .getElementById('how-it-works')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            See How It Works
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(15px) translateX(-15px);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
        }
        :global(.animate-float-1) {
          animation: float-1 6s ease-in-out infinite;
        }
        :global(.animate-float-2) {
          animation: float-2 8s ease-in-out infinite;
        }
        :global(.animate-float-3) {
          animation: float-3 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
