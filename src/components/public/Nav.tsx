'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Clients', href: '#clients' },
  { label: 'Contact', href: '#contact' },
] as const

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBackground = scrolled
    ? 'linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.85) 100%)'
    : 'linear-gradient(to bottom, rgba(10,10,10,0.0) 0%, transparent 100%)'

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 60px',
      transition: 'background 0.4s ease',
      background: navBackground,
    }}>
      <a href="#" style={{ textDecoration: 'none' }}>
        <Image src="/logo.png" alt="Orca" height={22} width={90} style={{ objectFit: 'contain' }} />
      </a>

      <ul style={{ display: 'flex', gap: 40, listStyle: 'none', margin: 0, padding: 0 }}>
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: hoveredLink === href ? '#F5F4F0' : 'rgba(245,244,240,0.38)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={() => setHoveredLink(href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
