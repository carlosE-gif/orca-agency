import { createClient } from '@/lib/supabase-server'
import { ClientsManager } from '@/components/admin/ClientsManager'
import type { Client } from '@/lib/types'

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    return (
      <p style={{ color: '#f87171', fontFamily: 'var(--font-dm-sans)' }}>
        Failed to load clients: {error.message}
      </p>
    )
  }

  return <ClientsManager initialClients={(data ?? []) as Client[]} />
}
