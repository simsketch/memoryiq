import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Give Your AI a Brain?
          </span>
        </h2>
        <Link
          href="/sign-up"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-violet-600 px-8 text-base font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0a0118]"
        >
          Get Started Free
        </Link>
        <p className="text-zinc-500 text-sm mt-4">No credit card required</p>
      </div>
    </section>
  )
}
