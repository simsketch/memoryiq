import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="relative px-6 py-32 overflow-hidden">
      {/* Gradient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(139,92,246,0.15),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/10 blur-3xl rounded-full" />
      </div>

      {/* Top gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Ready to Give Your AI a Brain?
          </span>
        </h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Stop repeating yourself to every AI tool. Give them all a shared memory — and get smarter responses from day one.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex h-14 items-center justify-center rounded-xl bg-violet-600 px-10 text-base font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0a0118]"
        >
          Get Started Free
        </Link>
        <p className="text-zinc-500 text-sm mt-5">No credit card required</p>
        <p className="text-zinc-600 text-xs mt-2">Join 1,000+ teams building with MemoryIQ</p>
      </div>
    </section>
  )
}
