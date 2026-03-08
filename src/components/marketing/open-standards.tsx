const badges = ['MCP Protocol', 'pgvector', 'PostgreSQL', 'Open Source']

export function OpenStandards() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Built on Open Standards
          </span>
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-2xl mx-auto">
          MemoryIQ is built on open protocols and battle-tested infrastructure.
          We use the Model Context Protocol (MCP) for AI integrations, pgvector
          for semantic search, and PostgreSQL for reliable data storage. No
          vendor lock-in — your data is always portable.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 rounded-full text-sm font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
