'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { UserButton } from '@clerk/nextjs'
import {
  Brain,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Moon,
  PenSquare,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useState } from 'react'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Thoughts', href: '/dashboard/thoughts', icon: Lightbulb },
  { label: 'Capture', href: '/dashboard/capture', icon: PenSquare },
  { label: 'Brains', href: '/dashboard/brains', icon: Brain },
  { label: 'Curate', href: '/dashboard/curate', icon: Sparkles },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function SidebarContent() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-6">
          <Brain className="h-7 w-7 text-violet-500" />
          <span className="text-xl font-bold tracking-tight">MemoryIQ</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-violet-600/20 text-violet-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="space-y-3 px-4 pb-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-zinc-400 hover:text-white"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
        <div className="flex items-center gap-3 px-1">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
          <span className="text-sm text-zinc-400">Account</span>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-white" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 border-zinc-800 bg-zinc-950 p-0 text-white"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 md:block">
        <SidebarContent />
      </aside>
    </>
  )
}
