const MARQUEE_ITEMS = [
  'Brand Strategy',
  'Creative Direction',
  'Digital Experience',
  'Motion & Film',
  'Social & Content',
  'Campaign Design',
] as const

const BORDER_STYLE = '1px solid rgba(245,244,240,0.08)'

export default function MarqueeSection() {
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marqueeScroll 30s linear infinite;
          display: flex;
          align-items: center;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        style={{
          borderTop: BORDER_STYLE,
          borderBottom: BORDER_STYLE,
          padding: '20px 0',
          overflow: 'hidden',
        }}
      >
        <div className="marquee-track">
          {repeatedItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: 'rgba(245,244,240,0.38)',
                  padding: '0 32px',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </span>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#4569AD',
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
