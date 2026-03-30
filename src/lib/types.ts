export interface Project {
  id: string
  title: string
  category: string | null
  location: string | null
  year: number | null
  description: string | null
  cover_image: string | null
  images: string[] | null
  published: boolean
  display_order: number
  created_at: string
}

export interface Client {
  id: string
  name: string
  industry: string | null
  logo_url: string | null
  featured: boolean
  display_order: number
}

export interface Service {
  id: string
  number: number | null
  name: string
  description: string | null
  tags: string[] | null
  display_order: number
}

export interface ContactSubmission {
  id: string
  name: string | null
  email: string | null
  company: string | null
  project_type: string | null
  message: string | null
  read: boolean
  created_at: string
}
