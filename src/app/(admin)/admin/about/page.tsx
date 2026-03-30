import { createClient } from '@/lib/supabase-server'
import type { AboutContent } from '@/lib/types'
import { AboutManager } from '@/components/admin/AboutManager'

export default async function AdminAboutPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('about_content').select('*').single()
  return <AboutManager initialContent={data as AboutContent} />
}
