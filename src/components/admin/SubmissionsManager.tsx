'use client'

import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { ContactSubmission } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ACCENT = '#4569AD'
const CARD_BG = '#111111'
const BORDER = 'rgba(255,255,255,0.08)'
const TEXT_MUTED = 'rgba(255,255,255,0.5)'

interface Props {
  initialSubmissions: ContactSubmission[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function SubmissionsManager({ initialSubmissions }: Props) {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  async function toggleRead(submission: ContactSubmission) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ read: !submission.read })
      .eq('id', submission.id)
      .select()
      .single()

    if (error) return

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submission.id ? (data as ContactSubmission) : s
      )
    )
    router.refresh()
  }

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans)' }}>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-light"
          style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}
        >
          Submissions
        </h1>
        <span style={{ color: TEXT_MUTED, fontSize: '0.875rem' }}>
          {submissions.filter((s) => !s.read).length} unread
        </span>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}`, background: CARD_BG }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: BORDER }}>
              {['', 'Name', 'Email', 'Company', 'Project type', 'Date', 'Actions'].map((col) => (
                <TableHead key={col} style={{ color: TEXT_MUTED }}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8" style={{ color: TEXT_MUTED }}>
                  No submissions yet.
                </TableCell>
              </TableRow>
            )}
            {submissions.map((sub) => (
              <Fragment key={sub.id}>
                <TableRow
                  style={{ borderColor: BORDER, cursor: 'pointer' }}
                  onClick={() => toggleExpand(sub.id)}
                >
                  {/* Unread indicator */}
                  <TableCell className="w-6">
                    {!sub.read && (
                      <span
                        className="block w-2 h-2 rounded-full"
                        style={{ background: ACCENT }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      color: sub.read ? TEXT_MUTED : '#fff',
                      fontWeight: sub.read ? 400 : 500,
                    }}
                  >
                    {sub.name ?? '—'}
                  </TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>{sub.email ?? '—'}</TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>{sub.company ?? '—'}</TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>{sub.project_type ?? '—'}</TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>{formatDate(sub.created_at)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRead(sub)}
                      style={{ color: TEXT_MUTED, fontSize: '0.75rem' }}
                    >
                      {sub.read ? 'Mark unread' : 'Mark read'}
                    </Button>
                  </TableCell>
                </TableRow>

                {expandedId === sub.id && (
                  <TableRow style={{ borderColor: BORDER }}>
                    <TableCell colSpan={7} style={{ background: '#0f0f0f' }}>
                      <div className="py-3 px-2">
                        <p
                          className="text-xs uppercase tracking-widest mb-2"
                          style={{ color: TEXT_MUTED }}
                        >
                          Message
                        </p>
                        <p
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          style={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                          {sub.message ?? '(no message)'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
