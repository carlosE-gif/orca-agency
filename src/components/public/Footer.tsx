'use client'

import { useState } from 'react'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Behance', href: 'https://behance.net' },
  { label: 'X', href: 'https://x.com' },
] as const

export default function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  return (
    <footer
      className="footer-inner"
      style={{ borderTop: '1px solid rgba(245,244,240,0.08)' }}
    >
      {/* Logo */}
      <a
        href="#"
        style={{
          fontFamily: 'var(--font-cormorant)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#F5F4F0',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        ORC<span style={{ color: '#4569AD' }}>A</span>
      </a>

      {/* Copyright */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.65rem',
          color: 'rgba(245,244,240,0.3)',
          margin: 0,
          textAlign: 'center',
        }}
      >
        © 2025 Orca Creative Agency. All rights reserved.
      </p>

      {/* Social links */}
      <nav aria-label="Social links">
        <ul
          style={{
            display: 'flex',
            gap: 32,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {SOCIAL_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredSocial(href)}
                onMouseLeave={() => setHoveredSocial(null)}
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color:
                    hoveredSocial === href ? '#4569AD' : 'rgba(245,244,240,0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  )
}
