import { createClient } from '@/lib/supabase-server'
import { ProjectsManager } from '@/components/admin/ProjectsManager'
import type { Project } from '@/lib/types'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    return (
      <p style={{ color: '#f87171', fontFamily: 'var(--font-dm-sans)' }}>
        Failed to load projects: {error.message}
      </p>
    )
  }

  return (
    <ProjectsManager initialProjects={(data ?? []) as Project[]} />
  )
}
