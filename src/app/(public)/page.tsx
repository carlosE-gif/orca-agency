import { createClient } from '@/lib/supabase-server'
import type { Project, Client, Service } from '@/lib/types'
import Nav from '@/components/public/Nav'
import HeroSection from '@/components/public/HeroSection'
import MarqueeSection from '@/components/public/MarqueeSection'
import AboutSection from '@/components/public/AboutSection'
import ServicesSection from '@/components/public/ServicesSection'
import WorkSection from '@/components/public/WorkSection'
import ClientsSection from '@/components/public/ClientsSection'
import ContactSection from '@/components/public/ContactSection'
import Footer from '@/components/public/Footer'

async function fetchPublicData(): Promise<{
  projects: Project[]
  clients: Client[]
  services: Service[]
}> {
  const supabase = await createClient()

  const [projectsRes, clientsRes, servicesRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('clients')
      .select('*')
      .order('display_order', { ascending: true }),
    supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true }),
  ])

  return {
    projects: projectsRes.data ?? [],
    clients: clientsRes.data ?? [],
    services: servicesRes.data ?? [],
  }
}

export default async function PublicPage() {
  const { projects, clients, services } = await fetchPublicData()

  return (
    <main style={{ background: '#0A0A0A', color: '#F5F4F0', minHeight: '100vh' }}>
      <Nav />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection services={services} />
      <WorkSection projects={projects} />
      <ClientsSection clients={clients} />
      <ContactSection />
      <Footer />
    </main>
  )
}
