'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Service } from '@/lib/types'
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
  number: '',
  name: '',
  description: '',
  tags: '',
  display_order: '0',
}

type FormState = typeof EMPTY_FORM

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

function serviceToForm(s: Service): FormState {
  return {
    number: s.number != null ? String(s.number) : '',
    name: s.name,
    description: s.description ?? '',
    tags: (s.tags ?? []).join(', '),
    display_order: String(s.display_order),
  }
}

function buildPayload(f: FormState) {
  const tags = f.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  return {
    number: f.number ? Number(f.number) : null,
    name: f.name,
    description: f.description || null,
    tags: tags.length > 0 ? tags : null,
    display_order: Number(f.display_order) || 0,
  }
}

interface Props {
  initialServices: Service[]
}

export function ServicesManager({ initialServices }: Props) {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>(initialServices)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditingService(null)
    setForm({ ...EMPTY_FORM, display_order: String(services.length) })
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(service: Service) {
    setEditingService(service)
    setForm(serviceToForm(service))
    setError(null)
    setDialogOpen(true)
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const payload = buildPayload(form)

    if (editingService) {
      const { data, error: err } = await supabase
        .from('services')
        .update(payload)
        .eq('id', editingService.id)
        .select()
        .single()

      if (err) { setError(err.message); setSaving(false); return }
      setServices((prev) =>
        prev.map((s) => (s.id === editingService.id ? (data as Service) : s))
      )
    } else {
      const { data, error: err } = await supabase
        .from('services')
        .insert(payload)
        .select()
        .single()

      if (err) { setError(err.message); setSaving(false); return }
      setServices((prev) => [...prev, data as Service])
    }

    setSaving(false)
    setDialogOpen(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const supabase = createClient()
    const { error: err } = await supabase
      .from('services')
      .delete()
      .eq('id', deleteTarget.id)

    if (err) { setError(err.message); return }
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setDeleteTarget(null)
    router.refresh()
  }

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans)' }}>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-light"
          style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}
        >
          Services
        </h1>
        <Button
          onClick={openCreate}
          style={{ background: ACCENT, color: '#fff', border: 'none' }}
        >
          New service
        </Button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}`, background: CARD_BG }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: BORDER }}>
              {['#', 'Name', 'Tags', 'Order', 'Actions'].map((col) => (
                <TableHead key={col} style={{ color: TEXT_MUTED }}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8" style={{ color: TEXT_MUTED }}>
                  No services yet.
                </TableCell>
              </TableRow>
            )}
            {services.map((service) => (
              <TableRow key={service.id} style={{ borderColor: BORDER }}>
                <TableCell style={{ color: TEXT_MUTED }}>{service.number ?? '—'}</TableCell>
                <TableCell style={{ color: '#fff' }}>{service.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(service.tags ?? []).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        style={{ color: TEXT_MUTED, borderColor: BORDER, fontSize: '0.7rem' }}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {!service.tags?.length && (
                      <span style={{ color: TEXT_MUTED }}>—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ color: TEXT_MUTED }}>{service.display_order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(service)}
                      style={{ color: TEXT_MUTED }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(service)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          style={{ background: '#161616', border: `1px solid ${BORDER}`, color: '#fff' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}>
              {editingService ? 'Edit service' : 'New service'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label style={labelStyle()}>Number</Label>
                <Input
                  type="number"
                  value={form.number}
                  onChange={(e) => updateField('number', e.target.value)}
                  style={inputStyle()}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label style={labelStyle()}>Display order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => updateField('display_order', e.target.value)}
                  style={inputStyle()}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
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
              <Label style={labelStyle()}>Tags (comma-separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="Branding, Identity, Strategy"
                style={inputStyle()}
              />
            </div>
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

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent
          style={{ background: '#161616', border: `1px solid ${BORDER}`, color: '#fff' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}>
              Delete service
            </DialogTitle>
          </DialogHeader>
          <p style={{ color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;?
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
