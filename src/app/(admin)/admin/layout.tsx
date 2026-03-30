import { createClient } from '@/lib/supabase-server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Login page: no sidebar, just render children
  if (!user) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        {children}
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#0A0A0A' }}
    >
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
