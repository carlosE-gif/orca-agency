import type { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactPayload {
  name: string
  email: string
  company?: string
  project_type?: string
  message: string
}

function validatePayload(body: unknown): { valid: true; data: ContactPayload } | { valid: false; error: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Invalid request body.' }
  }

  const { name, email, message } = body as Record<string, unknown>

  if (typeof name !== 'string' || name.trim().length === 0) {
    return { valid: false, error: 'Name is required.' }
  }
  if (typeof email !== 'string' || email.trim().length === 0) {
    return { valid: false, error: 'Email is required.' }
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' }
  }
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { valid: false, error: 'Message is required.' }
  }

  const payload = body as Record<string, unknown>

  return {
    valid: true,
    data: {
      name: (name as string).trim(),
      email: (email as string).trim(),
      company: typeof payload.company === 'string' ? payload.company.trim() : undefined,
      project_type:
        typeof payload.project_type === 'string' ? payload.project_type.trim() : undefined,
      message: (message as string).trim(),
    },
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const validation = validatePayload(body)

  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 400 })
  }

  const { data } = validation

  const supabase = createServiceClient()

  const { error: insertError } = await supabase
    .from('contact_submissions')
    .insert({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      project_type: data.project_type ?? null,
      message: data.message,
      read: false,
    })

  if (insertError) {
    console.error('[contact/route] Supabase insert error:', insertError.message)
    return Response.json(
      { error: 'Failed to submit your message. Please try again.' },
      { status: 500 }
    )
  }

  return Response.json({ success: true }, { status: 200 })
}
