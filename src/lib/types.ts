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

export interface AboutContent {
  id: string
  subheading: string
  heading_line1: string
  heading_line2: string
  body: string
  stat1_value: string
  stat1_suffix: string
  stat1_label: string
  stat2_value: string
  stat2_suffix: string
  stat2_label: string
  stat3_value: string
  stat3_suffix: string
  stat3_label: string
  panel_image: string | null
  tagline_title: string
  tagline_subtitle: string
  updated_at: string
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
