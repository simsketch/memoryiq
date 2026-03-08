import Link from 'next/link'

const links = [
  { label: 'GitHub', href: 'https://github.com/memoryiq' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export function Footer() {
  return (
    <footer className="relative px-6 py-16">
      {/* Gradient divider at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        <nav className="flex flex-wrap items-center justify-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-zinc-600">
          Built by Yoyo Code &middot; &copy; 2026 MemoryIQ
        </p>
      </div>
    </footer>
  )
}
