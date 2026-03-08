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
    <footer className="px-6 py-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-zinc-500">
          Built by Yoyo Code &middot; &copy; 2026 MemoryIQ
        </p>
      </div>
    </footer>
  )
}
