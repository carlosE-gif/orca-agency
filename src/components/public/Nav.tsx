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

const STYLES = {
  nav: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px 60px',
    transition: 'background 0.4s ease',
  },
  logo: {
    fontFamily: 'var(--font-cormorant)',
    letterSpacing: '0.3em',
    textTransform: 'uppercase' as const,
    fontSize: '1.2rem',
    fontWeight: 400,
    color: '#F5F4F0',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '40px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    fontFamily: 'var(--font-dm-sans)',
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'rgba(245,244,240,0.38)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
} as const

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBackground = scrolled
    ? 'linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.85) 100%)'
    : 'linear-gradient(to bottom, rgba(10,10,10,0.0) 0%, transparent 100%)'

  return (
    <nav style={{ ...STYLES.nav, background: navBackground }}>
      <a href="#" style={{ textDecoration: 'none' }}>
        <Image src="/logo.png" alt="Orca" height={22} width={80} style={{ objectFit: 'contain' }} />
      </a>
      <ul style={STYLES.navLinks}>
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              style={{
                ...STYLES.link,
                color: hoveredLink === href ? '#F5F4F0' : 'rgba(245,244,240,0.38)',
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
