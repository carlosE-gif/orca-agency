import { createClient } from '@/lib/supabase-server'
import { ServicesManager } from '@/components/admin/ServicesManager'
import type { Service } from '@/lib/types'

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    return (
      <p style={{ color: '#f87171', fontFamily: 'var(--font-dm-sans)' }}>
        Failed to load services: {error.message}
      </p>
    )
  }

  return <ServicesManager initialServices={(data ?? []) as Service[]} />
}
