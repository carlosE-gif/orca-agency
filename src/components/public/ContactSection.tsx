'use client'

import { useState, useCallback } from 'react'

const PROJECT_TYPES = [
  'Brand Identity',
  'Campaign',
  'Digital Experience',
  'Motion & Film',
  'Social & Content',
  'Other',
] as const

interface FormState {
  name: string
  email: string
  company: string
  project_type: string
  message: string
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  company: '',
  project_type: '',
  message: '',
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        alignItems: 'center',
        borderBottom: '1px solid rgba(245,244,240,0.08)',
        padding: '20px 0',
      }}
    >
      <label
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(245,244,240,0.38)',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#F5F4F0',
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.9rem',
  padding: '4px 0',
  width: '100%',
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const updateField = useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitting(true)
      setError(null)

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error ?? 'Something went wrong. Please try again.')
          return
        }

        setSuccess(true)
        setForm(EMPTY_FORM)
      } catch {
        setError('Network error. Please check your connection and try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [form]
  )

  const focusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { boxShadow: '0 1px 0 0 #4569AD' }
      : {}

  return (
    <section
      id="contact"
      className="section-pad two-col-grid"
      style={{
        borderTop: '1px solid rgba(245,244,240,0.08)',
        alignItems: 'start',
      }}
    >
      {/* Left info column */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#4569AD',
            marginBottom: 24,
          }}
        >
          Get in Touch
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(40px, 5vw, 72px)',
            fontWeight: 300,
            lineHeight: 1.05,
            color: '#F5F4F0',
            margin: '0 0 28px',
          }}
        >
          Let&apos;s build something{' '}
          <em style={{ color: '#4569AD', fontStyle: 'italic' }}>bold.</em>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.9rem',
            color: 'rgba(245,244,240,0.45)',
            lineHeight: 1.8,
            marginBottom: 48,
            maxWidth: 400,
          }}
        >
          Ready to make waves? Tell us about your project and we&apos;ll get
          back to you within 24 hours.
        </p>
        <div style={{ marginBottom: 32 }}>
          <a
            href="mailto:hello@orca.agency"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.4rem',
              color: '#F5F4F0',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(245,244,240,0.2)',
              paddingBottom: 4,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.borderColor = '#4569AD')
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.borderColor = 'rgba(245,244,240,0.2)')
            }
          >
            hello@orca.agency
          </a>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,244,240,0.3)',
          }}
        >
          Beirut · Dubai · Riyadh
        </p>
      </div>

      {/* Right form column */}
      <div>
        {success ? (
          <div
            style={{
              padding: '48px 0',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '1px solid #4569AD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10l5 5 7-8"
                  stroke="#4569AD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.6rem',
                color: '#F5F4F0',
                marginBottom: 12,
              }}
            >
              Message sent.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.85rem',
                color: 'rgba(245,244,240,0.45)',
              }}
            >
              We&apos;ll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Name">
              <input
                type="text"
                value={form.name}
                onChange={updateField('name')}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your name"
                style={{ ...inputStyle, ...focusStyle('name') }}
                autoComplete="name"
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                value={form.email}
                onChange={updateField('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="your@email.com"
                style={{ ...inputStyle, ...focusStyle('email') }}
                autoComplete="email"
              />
            </FormField>

            <FormField label="Company">
              <input
                type="text"
                value={form.company}
                onChange={updateField('company')}
                onFocus={() => setFocusedField('company')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your company (optional)"
                style={{ ...inputStyle, ...focusStyle('company') }}
                autoComplete="organization"
              />
            </FormField>

            <FormField label="Project">
              <select
                value={form.project_type}
                onChange={updateField('project_type')}
                onFocus={() => setFocusedField('project_type')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  ...focusStyle('project_type'),
                  cursor: 'pointer',
                }}
              >
                <option value="" style={{ background: '#111' }}>
                  Select project type
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type} style={{ background: '#111' }}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <div
              style={{
                borderBottom: '1px solid rgba(245,244,240,0.08)',
                padding: '20px 0',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,244,240,0.38)',
                  marginBottom: 16,
                }}
              >
                Message
              </label>
              <textarea
                value={form.message}
                onChange={updateField('message')}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                placeholder="Tell us about your project..."
                rows={5}
                style={{
                  ...inputStyle,
                  resize: 'none',
                  lineHeight: 1.8,
                  ...focusStyle('message'),
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.8rem',
                  color: '#e05c5c',
                  marginTop: 16,
                  marginBottom: 0,
                }}
              >
                {error}
              </p>
            )}

            <div style={{ marginTop: 40 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? 'rgba(69,105,173,0.5)' : '#4569AD',
                  color: '#F5F4F0',
                  border: 'none',
                  padding: '16px 48px',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s, opacity 0.2s',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
