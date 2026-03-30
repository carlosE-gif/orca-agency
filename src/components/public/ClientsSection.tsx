'use client'

import { useState } from 'react'
import type { Client } from '@/lib/types'

interface ClientsSectionProps {
  clients: Client[]
}

function ClientItem({ client }: { client: Client }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        transition: 'filter 0.3s ease',
        filter: hovered
          ? 'grayscale(0) brightness(1)'
          : 'grayscale(1) brightness(0.5)',
        cursor: 'default',
      }}
    >
      {client.logo_url ? (
        <img
          src={client.logo_url}
          alt={client.name}
          style={{
            maxWidth: '120px',
            maxHeight: '48px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.4rem',
              fontWeight: 400,
              color: '#F5F4F0',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {client.name}
          </p>
          {client.industry && (
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#4569AD',
                marginTop: 6,
              }}
            >
              {client.industry}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function ClientsSection({ clients }: ClientsSectionProps) {
  return (
    <section
      id="clients"
      style={{
        padding: '160px 60px',
        borderTop: '1px solid rgba(245,244,240,0.08)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#4569AD',
            marginBottom: 20,
          }}
        >
          Our Clients
        </p>
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
          Brands that{' '}
          <em style={{ color: '#4569AD', fontStyle: 'italic' }}>trust</em> the
          current.
        </h2>
      </div>

      {clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.6rem',
              color: 'rgba(245,244,240,0.3)',
              fontStyle: 'italic',
            }}
          >
            Client roster coming soon.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            borderTop: '1px solid rgba(245,244,240,0.08)',
            borderLeft: '1px solid rgba(245,244,240,0.08)',
          }}
        >
          {clients.map((client) => (
            <div
              key={client.id}
              style={{
                borderRight: '1px solid rgba(245,244,240,0.08)',
                borderBottom: '1px solid rgba(245,244,240,0.08)',
              }}
            >
              <ClientItem client={client} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
