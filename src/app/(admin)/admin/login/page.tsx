'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ACCENT_COLOR = '#4569AD'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0A0A0A' }}
    >
      <div className="w-full max-w-sm px-6">
        <div className="mb-10 text-center">
          <Image src="/logo.png" alt="Orca" height={40} width={150} style={{ objectFit: 'contain', margin: '0 auto' }} />
          <p
            className="mt-2 text-sm"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-dm-sans)' }}
          >
            Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-dm-sans)' }}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{
                background: '#111111',
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="password"
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-dm-sans)' }}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                background: '#111111',
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
          </div>

          {error && (
            <p
              className="text-sm"
              style={{ color: '#f87171', fontFamily: 'var(--font-dm-sans)' }}
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 w-full"
            style={{
              background: ACCENT_COLOR,
              color: '#fff',
              fontFamily: 'var(--font-dm-sans)',
              border: 'none',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
