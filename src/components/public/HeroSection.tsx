'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(#n)' opacity='1'/></svg>`
const NOISE_URI = `data:image/svg+xml;base64,${typeof window !== 'undefined' ? window.btoa(NOISE_SVG) : Buffer.from(NOISE_SVG).toString('base64')}`

export default function HeroSection() {
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    if (!dot || !ring) return

    let ringX = 0
    let ringY = 0
    let mouseX = 0
    let mouseY = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes heroOrb1 {
          0%   { transform: translate(0, 0) scale(1); opacity: .45; }
          25%  { transform: translate(80px, -60px) scale(1.2); opacity: .65; }
          50%  { transform: translate(140px, 40px) scale(1.05); opacity: .45; }
          75%  { transform: translate(40px, 100px) scale(1.25); opacity: .6; }
          100% { transform: translate(0, 0) scale(1); opacity: .45; }
        }
        @keyframes heroOrb2 {
          0%   { transform: translate(0, 0) scale(1); opacity: .3; }
          33%  { transform: translate(-90px, -70px) scale(1.15); opacity: .55; }
          66%  { transform: translate(60px, -120px) scale(0.9); opacity: .25; }
          100% { transform: translate(0, 0) scale(1); opacity: .3; }
        }
        @keyframes heroOrb3 {
          0%   { transform: translate(0, 0) scale(1); opacity: .25; }
          20%  { transform: translate(-60px, 80px) scale(1.1); opacity: .45; }
          50%  { transform: translate(80px, 140px) scale(1.2); opacity: .35; }
          80%  { transform: translate(-40px, -60px) scale(0.9); opacity: .3; }
          100% { transform: translate(0, 0) scale(1); opacity: .25; }
        }
        .hero-orb1 { animation: heroOrb1 16s cubic-bezier(0.4,0,0.2,1) infinite; }
        .hero-orb2 { animation: heroOrb2 22s cubic-bezier(0.4,0,0.2,1) infinite; }
        .hero-orb3 { animation: heroOrb3 28s cubic-bezier(0.4,0,0.2,1) infinite; animation-delay: -6s; }
        @keyframes heroLineExpand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgeSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.04); }
        }
        @keyframes badgeFadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .badge-wrapper {
          animation: badgeFadeIn 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
          animation-delay: 0.7s;
          opacity: 0;
        }
        .badge-ring-spin {
          animation: badgeSpin 18s linear infinite;
          transform-origin: center;
        }
        .badge-glow {
          animation: badgePulse 4s ease-in-out infinite;
        }
        @keyframes scrollLineAnim {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .hero-line {
          animation: heroLineExpand 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
          transform-origin: left;
        }
        .hero-eyebrow {
          animation: heroFadeUp 0.8s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        .hero-title {
          animation: heroFadeUp 0.8s ease forwards;
          animation-delay: 0.55s;
          opacity: 0;
        }
        .hero-bottom {
          animation: heroFadeUp 0.8s ease forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }
        .scroll-line {
          animation: scrollLineAnim 2s ease-in-out infinite;
        }
        .hero-cta-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1px solid rgba(245,244,240,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.3s, background 0.3s;
          cursor: pointer;
        }
        .hero-cta-circle:hover {
          border-color: #4569AD;
          background: rgba(69,105,173,0.1);
        }
        .hero-cta-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
          text-decoration: none;
        }
        .hero-cta-wrapper:hover .hero-cta-label {
          color: #F5F4F0;
        }
      `}</style>

      {/* Custom cursor */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#4569AD',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'opacity 0.2s',
        }}
      />
      <div
        ref={cursorRingRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(69,105,173,0.5)',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />

      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(80px,10vw,100px) clamp(24px,5vw,60px)',
          overflow: 'hidden',
          background: `
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(20,54,109,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(69,105,173,0.15) 0%, transparent 60%),
            #0A0A0A
          `,
        }}
      >
        {/* Noise texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${NOISE_URI}")`,
            opacity: 0.03,
            pointerEvents: 'none',
          }}
        />

        {/* Moving blue orbs */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="hero-orb1" style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(20,54,109,0.55) 0%, transparent 65%)' }} />
          <div className="hero-orb2" style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(69,105,173,0.35) 0%, transparent 65%)' }} />
          <div className="hero-orb3" style={{ position: 'absolute', top: '30%', left: '25%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(14,40,90,0.4) 0%, transparent 65%)' }} />
        </div>

        {/* Animated top line */}
        <div
          className="hero-line"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(245,244,240,0.15)',
          }}
        />

        {/* Badge logo — center right */}
        <div
          className="badge-wrapper hero-badge"
          style={{
            position: 'absolute',
            top: '50%',
            left: '72%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            width: 480,
            height: 480,
          }}
        >
          {/* Outer glow */}
          <div
            className="badge-glow"
            style={{
              position: 'absolute',
              inset: -40,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(69,105,173,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Spinning dashed ring */}
          <svg
            className="badge-ring-spin"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 480 480"
            fill="none"
          >
            <circle
              cx="240" cy="240" r="220"
              stroke="rgba(69,105,173,0.25)"
              strokeWidth="1"
              strokeDasharray="6 14"
              strokeLinecap="round"
            />
          </svg>

          {/* Static thin ring */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 480 480"
            fill="none"
          >
            <circle
              cx="240" cy="240" r="196"
              stroke="rgba(245,244,240,0.06)"
              strokeWidth="1"
            />
          </svg>

          {/* The badge image */}
          <Image
            src="/logo-badge.png"
            alt=""
            width={480}
            height={480}
            style={{ objectFit: 'contain', opacity: 0.92, position: 'relative', zIndex: 1 }}
          />
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(245,244,240,0.3)',
              writingMode: 'vertical-rl',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 60,
              background: 'rgba(245,244,240,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              className="scroll-line"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#4569AD',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '900px' }}>
          <p
            className="hero-eyebrow"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.65rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#4569AD',
              marginBottom: 40,
            }}
          >
            Middle East Creative Agency · Est. 2024
          </p>

          <h1
            className="hero-title"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(56px, 7.5vw, 120px)',
              fontWeight: 300,
              lineHeight: 0.9,
              color: '#F5F4F0',
              margin: '0 0 56px',
            }}
          >
            WE CREATE{' '}
            <em style={{ color: '#4569AD', fontStyle: 'italic' }}>EXPERIENCES.</em>
          </h1>

          <div
            className="hero-bottom"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 40,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.9rem',
                color: 'rgba(245,244,240,0.38)',
                maxWidth: 420,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              A creative agency born in the Middle East, built on strength,
              intelligence, and connection.
            </p>

            <a href="#work" className="hero-cta-wrapper">
              <div className="hero-cta-circle">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10h12M10 4l6 6-6 6"
                    stroke="#F5F4F0"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className="hero-cta-label"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,244,240,0.38)',
                  transition: 'color 0.2s',
                }}
              >
                View our work
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
