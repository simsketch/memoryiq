'use client'

import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-32">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(168,85,247,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_20%_70%,rgba(236,72,153,0.08),transparent)]" />

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-violet-600/10 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[55%] right-[10%] w-96 h-96 rounded-full bg-purple-600/10 blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute bottom-[15%] left-[40%] w-64 h-64 rounded-full bg-pink-600/8 blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Eyebrow label */}
        <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-6 opacity-90">
          The Memory Layer for AI
        </p>

        {/* Headline glow */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[200px] bg-violet-600/20 blur-[80px] rounded-full" />
          </div>
          <h1 className="relative text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.95]">
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              One Brain.
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
              Every AI.
            </span>
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          A shared memory layer that connects all your AI tools. Capture thoughts
          from anywhere. Search by meaning, not keywords. Share knowledge with
          your team.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex h-13 items-center justify-center rounded-xl bg-violet-600 px-10 text-base font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0a0118]"
          >
            Get Started Free
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-13 items-center justify-center rounded-xl border border-white/20 px-10 text-base font-medium text-white transition-all hover:bg-white/5 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500"
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

        {/* Social proof */}
        <p className="text-zinc-500 text-sm mt-10">
          No credit card required &middot; Free tier available forever
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-24px); }
        }
        .h-13 { height: 3.25rem; }
      ` }} />
    </section>
  )
}
