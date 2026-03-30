import { createClient } from '@/lib/supabase-server'
import type { Project, Client, Service, AboutContent } from '@/lib/types'
import Nav from '@/components/public/Nav'
import HeroSection from '@/components/public/HeroSection'
import MarqueeSection from '@/components/public/MarqueeSection'
import AboutSection from '@/components/public/AboutSection'
import ServicesSection from '@/components/public/ServicesSection'
import WorkSection from '@/components/public/WorkSection'
import ClientsSection from '@/components/public/ClientsSection'
import ContactSection from '@/components/public/ContactSection'
import Footer from '@/components/public/Footer'

async function fetchPublicData() {
  const supabase = await createClient()

  const [projectsRes, clientsRes, servicesRes, aboutRes] = await Promise.all([
    supabase.from('projects').select('*').eq('published', true).order('display_order', { ascending: true }),
    supabase.from('clients').select('*').order('display_order', { ascending: true }),
    supabase.from('services').select('*').order('display_order', { ascending: true }),
    supabase.from('about_content').select('*').single(),
  ])

  return {
    projects: (projectsRes.data ?? []) as Project[],
    clients: (clientsRes.data ?? []) as Client[],
    services: (servicesRes.data ?? []) as Service[],
    about: aboutRes.data as AboutContent | null,
  }
}

export default async function PublicPage() {
  const { projects, clients, services, about } = await fetchPublicData()

  return (
    <main style={{ position: 'relative', background: '#0A0A0A', color: '#F5F4F0', minHeight: '100vh' }}>
      {/* Full-page animated blue orbs */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <style>{`
          @keyframes orb1 {
            0%   { transform: translate(0, 0) scale(1); opacity: .5; }
            25%  { transform: translate(120px, -80px) scale(1.25); opacity: .75; }
            50%  { transform: translate(200px, 60px) scale(1.1); opacity: .5; }
            75%  { transform: translate(60px, 140px) scale(1.3); opacity: .7; }
            100% { transform: translate(0, 0) scale(1); opacity: .5; }
          }
          @keyframes orb2 {
            0%   { transform: translate(0, 0) scale(1); opacity: .35; }
            33%  { transform: translate(-120px, -100px) scale(1.2); opacity: .6; }
            66%  { transform: translate(80px, -160px) scale(0.9); opacity: .3; }
            100% { transform: translate(0, 0) scale(1); opacity: .35; }
          }
          @keyframes orb3 {
            0%   { transform: translate(0, 0) scale(1); opacity: .3; }
            20%  { transform: translate(-80px, 100px) scale(1.15); opacity: .5; }
            50%  { transform: translate(100px, 180px) scale(1.25); opacity: .4; }
            80%  { transform: translate(-60px, -80px) scale(0.9); opacity: .35; }
            100% { transform: translate(0, 0) scale(1); opacity: .3; }
          }
          @keyframes orb4 {
            0%   { transform: translate(0, 0) scale(1); opacity: .2; }
            40%  { transform: translate(150px, -120px) scale(1.3); opacity: .45; }
            70%  { transform: translate(-100px, 80px) scale(0.85); opacity: .25; }
            100% { transform: translate(0, 0) scale(1); opacity: .2; }
          }
          .g-orb1 { animation: orb1 18s cubic-bezier(0.4,0,0.2,1) infinite; }
          .g-orb2 { animation: orb2 24s cubic-bezier(0.4,0,0.2,1) infinite; }
          .g-orb3 { animation: orb3 30s cubic-bezier(0.4,0,0.2,1) infinite; }
          .g-orb4 { animation: orb4 22s cubic-bezier(0.4,0,0.2,1) infinite; animation-delay: -8s; }
        `}</style>
        <div className="g-orb1" style={{ position:'absolute', top:'-10%', left:'-10%', width:'60vw', height:'60vw', borderRadius:'50%', background:'radial-gradient(ellipse at center, rgba(20,54,109,0.5) 0%, transparent 65%)' }} />
        <div className="g-orb2" style={{ position:'absolute', bottom:'5%', right:'-5%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(ellipse at center, rgba(69,105,173,0.3) 0%, transparent 65%)' }} />
        <div className="g-orb3" style={{ position:'absolute', top:'40%', left:'30%', width:'45vw', height:'45vw', borderRadius:'50%', background:'radial-gradient(ellipse at center, rgba(14,40,90,0.35) 0%, transparent 65%)' }} />
        <div className="g-orb4" style={{ position:'absolute', top:'20%', right:'20%', width:'35vw', height:'35vw', borderRadius:'50%', background:'radial-gradient(ellipse at center, rgba(69,105,173,0.2) 0%, transparent 65%)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <HeroSection />
        <MarqueeSection />
        {about && <AboutSection content={about} />}
        <ServicesSection services={services} />
        <WorkSection projects={projects} />
        <ClientsSection clients={clients} />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}
