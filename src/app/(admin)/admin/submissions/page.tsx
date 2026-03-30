import { createClient } from '@/lib/supabase-server'
import { SubmissionsManager } from '@/components/admin/SubmissionsManager'
import type { ContactSubmission } from '@/lib/types'

export default async function AdminSubmissionsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <p style={{ color: '#f87171', fontFamily: 'var(--font-dm-sans)' }}>
        Failed to load submissions: {error.message}
      </p>
    )
  }

  return (
    <SubmissionsManager
      initialSubmissions={(data ?? []) as ContactSubmission[]}
    />
  )
}
