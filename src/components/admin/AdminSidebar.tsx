'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const ACCENT = '#4569AD'
const SIDEBAR_BG = '#111111'
const BORDER = 'rgba(255,255,255,0.05)'
const TEXT_MUTED = 'rgba(255,255,255,0.5)'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'About', href: '/admin/about' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Clients', href: '/admin/clients' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Submissions', href: '/admin/submissions' },
] as const

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside
      className="flex flex-col w-56 shrink-0 min-h-screen"
      style={{
        background: SIDEBAR_BG,
        borderRight: `1px solid ${BORDER}`,
        fontFamily: 'var(--font-dm-sans)',
      }}
    >
      {/* Logo */}
      <div
        className="px-6 py-8 border-b"
        style={{ borderColor: BORDER }}
      >
        <span
          className="text-2xl tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#fff' }}
        >
          ORC<span style={{ color: ACCENT }}>A</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 pt-4 flex-1">
        {NAV_LINKS.map(({ label, href }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center h-9 rounded-lg px-3 text-sm transition-colors"
              style={{
                background: active ? `${ACCENT}22` : 'transparent',
                color: active ? '#fff' : TEXT_MUTED,
                borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: BORDER }}
      >
        <button
          onClick={handleSignOut}
          className="flex items-center h-9 w-full rounded-lg px-3 text-sm transition-colors"
          style={{ color: TEXT_MUTED }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
