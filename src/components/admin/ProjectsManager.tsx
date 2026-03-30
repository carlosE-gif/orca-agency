'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

const ACCENT = '#4569AD'
const CARD_BG = '#111111'
const BORDER = 'rgba(255,255,255,0.08)'
const TEXT_MUTED = 'rgba(255,255,255,0.5)'

const EMPTY_FORM = {
  title: '',
  category: '',
  location: '',
  year: '',
  description: '',
  cover_image: '',
  published: false,
}

type FormState = typeof EMPTY_FORM

interface Props {
  initialProjects: Project[]
}

function inputStyle() {
  return {
    background: '#1a1a1a',
    borderColor: BORDER,
    color: '#fff',
    fontFamily: 'var(--font-dm-sans)',
  }
}

function labelStyle() {
  return { color: TEXT_MUTED, fontFamily: 'var(--font-dm-sans)' }
}

function projectToForm(p: Project): FormState {
  return {
    title: p.title,
    category: p.category ?? '',
    location: p.location ?? '',
    year: p.year != null ? String(p.year) : '',
    description: p.description ?? '',
    cover_image: p.cover_image ?? '',
    published: p.published,
  }
}

export function ProjectsManager({ initialProjects }: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function openCreate() {
    setEditingProject(null)
    setForm(EMPTY_FORM)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setForm(projectToForm(project))
    setError(null)
    setDialogOpen(true)
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function buildPayload(f: FormState) {
    return {
      title: f.title,
      category: f.category || null,
      location: f.location || null,
      year: f.year ? Number(f.year) : null,
      description: f.description || null,
      cover_image: f.cover_image || null,
      published: f.published,
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('project-images').getPublicUrl(path)
    updateField('cover_image', data.publicUrl)
    setUploading(false)
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const payload = buildPayload(form)

    if (editingProject) {
      const { data, error: err } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingProject.id)
        .select()
        .single()

      if (err) { setError(err.message); setSaving(false); return }
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? (data as Project) : p))
      )
    } else {
      const { data, error: err } = await supabase
        .from('projects')
        .insert({ ...payload, display_order: projects.length })
        .select()
        .single()

      if (err) { setError(err.message); setSaving(false); return }
      setProjects((prev) => [...prev, data as Project])
    }

    setSaving(false)
    setDialogOpen(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const supabase = createClient()
    const { error: err } = await supabase
      .from('projects')
      .delete()
      .eq('id', deleteTarget.id)

    if (err) { setError(err.message); return }
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
    router.refresh()
  }

  async function togglePublished(project: Project) {
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('projects')
      .update({ published: !project.published })
      .eq('id', project.id)
      .select()
      .single()

    if (err) return
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? (data as Project) : p))
    )
    router.refresh()
  }

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans)' }}>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-light"
          style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}
        >
          Projects
        </h1>
        <Button
          onClick={openCreate}
          style={{ background: ACCENT, color: '#fff', border: 'none' }}
        >
          New project
        </Button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}`, background: CARD_BG }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: BORDER }}>
              {['Title', 'Category', 'Year', 'Published', 'Actions'].map((col) => (
                <TableHead key={col} style={{ color: TEXT_MUTED }}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8" style={{ color: TEXT_MUTED }}>
                  No projects yet.
                </TableCell>
              </TableRow>
            )}
            {projects.map((project) => (
              <TableRow key={project.id} style={{ borderColor: BORDER }}>
                <TableCell style={{ color: '#fff' }}>{project.title}</TableCell>
                <TableCell style={{ color: TEXT_MUTED }}>{project.category ?? '—'}</TableCell>
                <TableCell style={{ color: TEXT_MUTED }}>{project.year ?? '—'}</TableCell>
                <TableCell>
                  <button onClick={() => togglePublished(project)}>
                    {project.published ? (
                      <Badge style={{ background: ACCENT, color: '#fff', border: 'none' }}>
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" style={{ color: TEXT_MUTED, borderColor: BORDER }}>
                        Draft
                      </Badge>
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(project)}
                      style={{ color: TEXT_MUTED }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(project)}
                      style={{ color: '#f87171' }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-lg"
          style={{ background: '#161616', border: `1px solid ${BORDER}`, color: '#fff' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}>
              {editingProject ? 'Edit project' : 'New project'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                style={inputStyle()}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label style={labelStyle()}>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  style={inputStyle()}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label style={labelStyle()}>Year</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  style={inputStyle()}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                style={inputStyle()}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                style={{ ...inputStyle(), resize: 'vertical' }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Cover image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
              {form.cover_image ? (
                <div className="relative rounded-lg overflow-hidden" style={{ height: 160, background: '#1a1a1a' }}>
                  <Image src={form.cover_image} alt="Cover" fill style={{ objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => { updateField('cover_image', ''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs"
                    style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center justify-center rounded-lg border-2 border-dashed h-32 text-sm transition-colors"
                  style={{ borderColor: BORDER, color: TEXT_MUTED, background: '#1a1a1a' }}
                >
                  {uploading ? 'Uploading…' : '+ Upload image'}
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => updateField('published', e.target.checked)}
                className="accent-[#4569AD]"
              />
              <span style={{ color: TEXT_MUTED, fontSize: '0.875rem' }}>Published</span>
            </label>
            {error && (
              <p style={{ color: '#f87171', fontSize: '0.875rem' }}>{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              style={{ color: TEXT_MUTED, borderColor: BORDER, background: 'transparent' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              style={{ background: ACCENT, color: '#fff', border: 'none' }}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent
          style={{ background: '#161616', border: `1px solid ${BORDER}`, color: '#fff' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}>
              Delete project
            </DialogTitle>
          </DialogHeader>
          <p style={{ color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              style={{ color: TEXT_MUTED, borderColor: BORDER, background: 'transparent' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              style={{ background: '#dc2626', color: '#fff', border: 'none' }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
