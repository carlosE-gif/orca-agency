'use client'

import { useRef, useEffect, useState } from 'react'
import type { Service } from '@/lib/types'

interface ServicesSectionProps {
  services: Service[]
}

function padServiceNumber(num: number | null): string {
  if (num === null) return '01'
  return String(num).padStart(2, '0')
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? '#111418' : '#0A0A0A',
        padding: '48px 40px',
        overflow: 'hidden',
        transition: 'background 0.3s ease, opacity 0.5s ease, transform 0.5s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        cursor: 'default',
      }}
    >
      {/* Bottom blue hover line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: '#4569AD',
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.35s ease',
        }}
      />

      {/* Service number */}
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '3rem',
          fontWeight: 300,
          color: 'rgba(69,105,173,0.12)',
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        {padServiceNumber(service.number ?? index + 1)}
      </p>

      {/* Service name */}
      <h3
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.6rem',
          fontWeight: 400,
          color: '#F5F4F0',
          marginBottom: 16,
          lineHeight: 1.2,
        }}
      >
        {service.name}
      </h3>

      {/* Description */}
      {service.description && (
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.85rem',
            color: 'rgba(245,244,240,0.45)',
            lineHeight: 1.7,
            marginBottom: 24,
          }}
        >
          {service.description}
        </p>
      )}

      {/* Tags */}
      {service.tags && service.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {service.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#4569AD',
                border: '1px solid rgba(69,105,173,0.35)',
                padding: '4px 10px',
                borderRadius: 1,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className="section-pad-t"
      style={{ borderTop: '1px solid rgba(245,244,240,0.08)' }}
    >
      {/* Section header */}
      <div className="services-header">
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(36px, 4.5vw, 64px)',
            fontWeight: 300,
            lineHeight: 1.05,
            color: '#F5F4F0',
            margin: 0,
          }}
        >
          Craft meets{' '}
          <em style={{ color: '#4569AD', fontStyle: 'italic' }}>strategy.</em>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.9rem',
            color: 'rgba(245,244,240,0.45)',
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          Every discipline we practise is guided by a singular belief: that
          great work is never accidental. It&apos;s the intersection of
          instinct and intention.
        </p>
      </div>

      {/* Services grid or empty state */}
      {services.length === 0 ? (
        <div
          style={{
            padding: '80px 60px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.6rem',
              color: 'rgba(245,244,240,0.3)',
              fontStyle: 'italic',
            }}
          >
            Services coming soon.
          </p>
        </div>
      ) : (
        <div className="three-col-grid">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}
