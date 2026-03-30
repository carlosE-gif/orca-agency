'use client'

import { useRef, useEffect, useState } from 'react'
import type { Project } from '@/lib/types'

interface WorkSectionProps {
  projects: Project[]
}

const GRADIENT_PLACEHOLDERS = [
  'linear-gradient(135deg, #14366D 0%, #0A0A0A 100%)',
  'linear-gradient(135deg, #0A0A0A 0%, #4569AD 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #14366D 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #1e3a5f 100%)',
] as const

function getGradient(index: number): string {
  return GRADIENT_PLACEHOLDERS[index % GRADIENT_PLACEHOLDERS.length]
}

const GRID_SPANS: Array<{ col: string; aspect: string }> = [
  { col: 'span 7', aspect: '16 / 10' },
  { col: 'span 5', aspect: '4 / 3' },
  { col: 'span 4', aspect: '4 / 3' },
  { col: 'span 8', aspect: '16 / 9' },
]

function getSpan(index: number, total: number): { col: string; aspect: string } {
  if (total === 1) return { col: 'span 12', aspect: '16 / 6' }
  if (total === 2) return { col: 'span 6', aspect: '4 / 3' }
  if (total === 3) {
    const threeSpans = [
      { col: 'span 12', aspect: '21 / 6' },
      { col: 'span 6', aspect: '4 / 3' },
      { col: 'span 6', aspect: '4 / 3' },
    ]
    return threeSpans[index] ?? GRID_SPANS[index % GRID_SPANS.length]
  }
  return GRID_SPANS[index % GRID_SPANS.length]
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project
  index: number
  total: number
}) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const span = getSpan(index, total)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
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
        gridColumn: span.col,
        aspectRatio: span.aspect,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Background image or gradient */}
      {project.cover_image ? (
        <img
          src={project.cover_image}
          alt={project.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: getGradient(index),
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s ease',
          }}
        />
      )}

      {/* Project number — fades out on hover */}
      <span
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          fontFamily: 'var(--font-cormorant)',
          fontSize: '4rem',
          fontWeight: 300,
          color: 'rgba(245,244,240,0.08)',
          lineHeight: 1,
          transition: 'opacity 0.3s ease',
          opacity: hovered ? 0 : 1,
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,10,0.75)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '32px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      >
        {project.category && (
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#4569AD',
              marginBottom: 10,
            }}
          >
            {project.category}
          </p>
        )}
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.8rem',
            fontWeight: 400,
            color: '#F5F4F0',
            marginBottom: 8,
            lineHeight: 1.1,
          }}
        >
          {project.title}
        </h3>
        {(project.location || project.year) && (
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.7rem',
              color: 'rgba(245,244,240,0.45)',
            }}
          >
            {[project.location, project.year].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}

export default function WorkSection({ projects }: WorkSectionProps) {
  return (
    <section
      id="work"
      className="section-pad"
      style={{
        borderTop: '1px solid rgba(245,244,240,0.08)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 60,
          gap: 40,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(36px, 4.5vw, 64px)',
            fontWeight: 300,
            lineHeight: 1.05,
            color: '#F5F4F0',
            margin: 0,
            maxWidth: 600,
          }}
        >
          Making waves, one{' '}
          <em style={{ color: '#4569AD', fontStyle: 'italic' }}>project</em> at
          a time.
        </h2>
        <a
          href="#"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,244,240,0.38)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#F5F4F0')}
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = 'rgba(245,244,240,0.38)')
          }
        >
          View all projects →
        </a>
      </div>

      {/* Projects grid or empty state */}
      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.6rem',
              color: 'rgba(245,244,240,0.3)',
              fontStyle: 'italic',
            }}
          >
            Projects coming soon.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '16px',
          }}
        >
          {projects.slice(0, 4).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={Math.min(projects.length, 4)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
