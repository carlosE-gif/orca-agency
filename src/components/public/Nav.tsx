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
  const [visible, setVisible] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll) }
  }, [])

  return (
    <>
      <style>{`
        .nav-link-line::after {
          content: '';
          display: block;
          height: 1px;
          background: #4569AD;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          margin-top: 3px;
        }
        .nav-link-line:hover::after { transform: scaleX(1); }
        .nav-link-line { transition: color 0.3s ease; }
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-animate { animation: navSlideDown 0.7s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu-animate { animation: mobileMenuIn 0.25s ease forwards; }
      `}</style>

      <nav
        className={visible ? 'nav-animate' : ''}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 60px',
          transition: 'background 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease',
          background: scrolled || menuOpen ? 'rgba(8,8,8,0.92)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(245,244,240,0.06)' : '1px solid transparent',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Image src="/logo.png" alt="Orca" height={20} width={90} style={{ objectFit: 'contain' }} />
        </a>

        {/* Desktop links */}
        <ul className="nav-links-desktop" style={{ gap: '36px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="nav-link-line"
                style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: hoveredLink === href ? '#F5F4F0' : 'rgba(245,244,240,0.45)', textDecoration: 'none', display: 'block' }}
                onMouseEnter={() => setHoveredLink(href)} onMouseLeave={() => setHoveredLink(null)}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact"
              style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', padding: '8px 20px', border: '1px solid rgba(69,105,173,0.6)', borderRadius: '2px', background: hoveredLink === '#cta' ? 'rgba(69,105,173,0.15)' : 'transparent', transition: 'background 0.3s ease' }}
              onMouseEnter={() => setHoveredLink('#cta')} onMouseLeave={() => setHoveredLink(null)}>
              Let&apos;s talk
            </a>
          </li>
        </ul>

        {/* Hamburger */}
        <button className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
          aria-label="Toggle menu">
          <span style={{ display: 'block', width: 24, height: 1, background: '#F5F4F0', transition: 'transform 0.3s ease, opacity 0.3s ease', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 1, background: '#F5F4F0', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s ease' }} />
          <span style={{ display: 'block', width: 24, height: 1, background: '#F5F4F0', transition: 'transform 0.3s ease, opacity 0.3s ease', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu-animate"
          style={{ position: 'fixed', top: 57, left: 0, right: 0, zIndex: 99, background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(245,244,240,0.06)', padding: '24px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.7)', textDecoration: 'none', padding: '16px 0', borderBottom: '1px solid rgba(245,244,240,0.06)' }}>
                  {label}
                </a>
              </li>
            ))}
            <li style={{ paddingTop: 24 }}>
              <a href="#contact" onClick={() => setMenuOpen(false)}
                style={{ display: 'block', fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', padding: '14px 24px', border: '1px solid rgba(69,105,173,0.6)', borderRadius: 2, textAlign: 'center' }}>
                Let&apos;s talk
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
