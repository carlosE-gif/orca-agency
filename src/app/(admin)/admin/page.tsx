import { createClient } from '@/lib/supabase-server'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { ContactSubmission } from '@/lib/types'

const ACCENT = '#4569AD'
const CARD_BG = '#111111'
const BORDER = 'rgba(255,255,255,0.08)'
const TEXT_MUTED = 'rgba(255,255,255,0.5)'

async function fetchDashboardData() {
  const supabase = await createClient()

  const [projectsRes, clientsRes, servicesRes, submissionsRes, recentRes] =
    await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase
        .from('contact_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('read', false),
      supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

  return {
    projectCount: projectsRes.count ?? 0,
    clientCount: clientsRes.count ?? 0,
    serviceCount: servicesRes.count ?? 0,
    unreadCount: submissionsRes.count ?? 0,
    recentSubmissions: (recentRes.data ?? []) as ContactSubmission[],
  }
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card
      className="border-0"
      style={{ background: CARD_BG, boxShadow: 'none', border: `1px solid ${BORDER}` }}
    >
      <CardHeader>
        <CardTitle
          className="text-xs uppercase tracking-widest"
          style={{ color: TEXT_MUTED, fontFamily: 'var(--font-dm-sans)' }}
        >
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className="text-4xl font-light"
          style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function AdminDashboardPage() {
  const { projectCount, clientCount, serviceCount, unreadCount, recentSubmissions } =
    await fetchDashboardData()

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans)' }}>
      <h1
        className="text-3xl font-light mb-8"
        style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}
      >
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Projects" value={projectCount} />
        <StatCard label="Clients" value={clientCount} />
        <StatCard label="Services" value={serviceCount} />
        <StatCard label="Unread messages" value={unreadCount} />
      </div>

      <div>
        <h2
          className="text-lg font-light mb-4"
          style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}
        >
          Recent Submissions
        </h2>

        <div
          className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${BORDER}`, background: CARD_BG }}
        >
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: BORDER }}>
                {['Name', 'Email', 'Company', 'Project type', 'Date', 'Status'].map(
                  (col) => (
                    <TableHead
                      key={col}
                      style={{ color: TEXT_MUTED, fontFamily: 'var(--font-dm-sans)' }}
                    >
                      {col}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubmissions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8"
                    style={{ color: TEXT_MUTED }}
                  >
                    No submissions yet.
                  </TableCell>
                </TableRow>
              )}
              {recentSubmissions.map((sub) => (
                <TableRow key={sub.id} style={{ borderColor: BORDER }}>
                  <TableCell style={{ color: '#fff' }}>{sub.name ?? '—'}</TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>{sub.email ?? '—'}</TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>{sub.company ?? '—'}</TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>{sub.project_type ?? '—'}</TableCell>
                  <TableCell style={{ color: TEXT_MUTED }}>
                    {formatDate(sub.created_at)}
                  </TableCell>
                  <TableCell>
                    {sub.read ? (
                      <Badge
                        variant="outline"
                        style={{ color: TEXT_MUTED, borderColor: BORDER }}
                      >
                        Read
                      </Badge>
                    ) : (
                      <Badge
                        style={{ background: ACCENT, color: '#fff', border: 'none' }}
                      >
                        Unread
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
