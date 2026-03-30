import type { AboutContent } from '@/lib/types'

const ORCA_SVG_PATHS = [
  'M100 40 C80 40 60 55 55 75 C50 95 58 115 70 125 C60 130 50 145 55 160 C60 175 80 182 100 180 C120 182 140 175 145 160 C150 145 140 130 130 125 C142 115 150 95 145 75 C140 55 120 40 100 40Z',
  'M85 75 C88 68 95 65 100 66 C105 65 112 68 115 75 C118 85 112 95 100 98 C88 95 82 85 85 75Z',
]

interface Props { content: AboutContent }

export default function AboutSection({ content }: Props) {
  const stats = [
    { value: content.stat1_value, suffix: content.stat1_suffix, label: content.stat1_label },
    { value: content.stat2_value, suffix: content.stat2_suffix, label: content.stat2_label },
    { value: content.stat3_value, suffix: content.stat3_suffix, label: content.stat3_label },
  ]

  return (
    <>
      <style>{`
        .about-stat-number {
          font-family: var(--font-cormorant);
          font-size: 3.5rem;
          font-weight: 300;
          color: #F5F4F0;
          line-height: 1;
        }
        .about-stat-suffix {
          font-family: var(--font-cormorant);
          font-size: 2rem;
          font-weight: 300;
          color: #4569AD;
          line-height: 1;
        }
      `}</style>

      <section
        id="about"
        className="section-pad two-col-grid"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(245,244,240,0.08)',
        }}
      >
        {/* Left column */}
        <div>
          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#4569AD',
            marginBottom: 24,
          }}>
            {content.subheading}
          </p>

          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(40px, 5vw, 72px)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#F5F4F0',
            margin: '0 0 32px',
          }}>
            {content.heading_line1}
            <br />
            <em style={{ color: '#4569AD', fontStyle: 'italic' }}>{content.heading_line2}</em>
          </h2>

          <p style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.9rem',
            lineHeight: 1.8,
            color: 'rgba(245,244,240,0.55)',
            marginBottom: 48,
            maxWidth: 480,
          }}>
            {content.body}
          </p>

          <div style={{ display: 'flex', gap: 48 }}>
            {stats.map(({ value, suffix, label }) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span className="about-stat-number">{value}</span>
                  <span className="about-stat-suffix">{suffix}</span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,244,240,0.38)',
                  marginTop: 8,
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual panel */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0d1f3c 0%, #14366D 50%, #0A0A0A 100%)',
          borderRadius: 2,
          padding: '60px 40px',
          minHeight: 420,
          overflow: 'hidden',
        }}>
          {/* Faint year watermark */}
          <span style={{
            position: 'absolute',
            bottom: -20,
            right: -10,
            fontFamily: 'var(--font-cormorant)',
            fontSize: '180px',
            fontWeight: 300,
            color: 'rgba(69,105,173,0.06)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            24
          </span>

          {/* Panel image or SVG fallback */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%', marginBottom: 40 }}>
            {content.panel_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.panel_image}
                alt="About panel"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.7 }}
              />
            ) : (
              <svg viewBox="0 0 200 220" width="180" height="200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {ORCA_SVG_PATHS.map((d, i) => (
                  <path key={i} d={d} fill="rgba(69,105,173,0.6)" stroke="rgba(69,105,173,0.3)" strokeWidth="0.5" />
                ))}
                <path d="M95 40 C92 20 85 8 80 5 C88 15 90 28 92 40Z" fill="rgba(69,105,173,0.5)" />
                <path d="M70 170 C60 180 48 185 42 180 C50 175 58 165 62 158 M130 170 C140 180 152 185 158 180 C150 175 142 165 138 158" stroke="rgba(69,105,173,0.5)" strokeWidth="2" fill="none" />
              </svg>
            )}
          </div>

          {/* Bottom tag */}
          <div style={{ position: 'absolute', bottom: 32, left: 32, zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,244,240,0.4)',
              lineHeight: 1.6,
            }}>
              {content.tagline_title}
              <br />
              <span style={{ color: '#4569AD' }}>{content.tagline_subtitle}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
