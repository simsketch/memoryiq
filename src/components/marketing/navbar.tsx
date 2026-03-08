'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brain, Menu, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isSignedIn } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '#' },
  ]

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    const btnHeight = mobile ? 'h-10' : 'h-9'
    if (isSignedIn) {
      return (
        <Link
          href="/dashboard"
          className={`inline-flex ${btnHeight} items-center justify-center rounded-lg bg-violet-600 px-5 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500`}
          onClick={() => mobile && setMobileOpen(false)}
        >
          Dashboard
        </Link>
      )
    }
    return (
      <>
        <Link
          href="/sign-in"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
          onClick={() => mobile && setMobileOpen(false)}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className={`inline-flex ${btnHeight} items-center justify-center rounded-lg bg-violet-600 px-5 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500`}
          onClick={() => mobile && setMobileOpen(false)}
        >
          Get Started
        </Link>
      </>
    )
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-[#0a0118]/80 border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Brain className="w-6 h-6 text-violet-400" />
          <span className="text-base font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            MemoryIQ
          </span>
        </Link>

        {/* Center nav links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <AuthButtons />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden backdrop-blur-xl bg-[#0a0118]/95 border-b border-white/10 px-6 py-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-300 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <AuthButtons mobile />
          </div>
        </div>
      )}
    </header>
  )
}
