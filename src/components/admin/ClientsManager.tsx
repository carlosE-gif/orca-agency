'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Client } from '@/lib/types'
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

const ACCENT = '#4569AD'
const CARD_BG = '#111111'
const BORDER = 'rgba(255,255,255,0.08)'
const TEXT_MUTED = 'rgba(255,255,255,0.5)'

const EMPTY_FORM = {
  name: '',
  industry: '',
  logo_url: '',
  featured: false,
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

function clientToForm(c: Client): FormState {
  return {
    name: c.name,
    industry: c.industry ?? '',
    logo_url: c.logo_url ?? '',
    featured: c.featured,
    display_order: String(c.display_order),
  }
}

function buildPayload(f: FormState) {
  return {
    name: f.name,
    industry: f.industry || null,
    logo_url: f.logo_url || null,
    featured: f.featured,
    display_order: Number(f.display_order) || 0,
  }
}

interface Props {
  initialClients: Client[]
}

export function ClientsManager({ initialClients }: Props) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditingClient(null)
    setForm({ ...EMPTY_FORM, display_order: String(clients.length) })
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(client: Client) {
    setEditingClient(client)
    setForm(clientToForm(client))
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

    if (editingClient) {
      const { data, error: err } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', editingClient.id)
        .select()
        .single()

      if (err) { setError(err.message); setSaving(false); return }
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? (data as Client) : c))
      )
    } else {
      const { data, error: err } = await supabase
        .from('clients')
        .insert(payload)
        .select()
        .single()

      if (err) { setError(err.message); setSaving(false); return }
      setClients((prev) => [...prev, data as Client])
    }

    setSaving(false)
    setDialogOpen(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const supabase = createClient()
    const { error: err } = await supabase
      .from('clients')
      .delete()
      .eq('id', deleteTarget.id)

    if (err) { setError(err.message); return }
    setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
    router.refresh()
  }

  async function toggleFeatured(client: Client) {
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('clients')
      .update({ featured: !client.featured })
      .eq('id', client.id)
      .select()
      .single()

    if (err) return
    setClients((prev) =>
      prev.map((c) => (c.id === client.id ? (data as Client) : c))
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
          Clients
        </h1>
        <Button
          onClick={openCreate}
          style={{ background: ACCENT, color: '#fff', border: 'none' }}
        >
          New client
        </Button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}`, background: CARD_BG }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: BORDER }}>
              {['Name', 'Industry', 'Featured', 'Order', 'Actions'].map((col) => (
                <TableHead key={col} style={{ color: TEXT_MUTED }}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8" style={{ color: TEXT_MUTED }}>
                  No clients yet.
                </TableCell>
              </TableRow>
            )}
            {clients.map((client) => (
              <TableRow key={client.id} style={{ borderColor: BORDER }}>
                <TableCell style={{ color: '#fff' }}>{client.name}</TableCell>
                <TableCell style={{ color: TEXT_MUTED }}>{client.industry ?? '—'}</TableCell>
                <TableCell>
                  <button onClick={() => toggleFeatured(client)}>
                    {client.featured ? (
                      <Badge style={{ background: ACCENT, color: '#fff', border: 'none' }}>
                        Featured
                      </Badge>
                    ) : (
                      <Badge variant="outline" style={{ color: TEXT_MUTED, borderColor: BORDER }}>
                        Standard
                      </Badge>
                    )}
                  </button>
                </TableCell>
                <TableCell style={{ color: TEXT_MUTED }}>{client.display_order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(client)}
                      style={{ color: TEXT_MUTED }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(client)}
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
              {editingClient ? 'Edit client' : 'New client'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                style={inputStyle()}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Industry</Label>
              <Input
                value={form.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                style={inputStyle()}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label style={labelStyle()}>Logo URL</Label>
              <Input
                value={form.logo_url}
                onChange={(e) => updateField('logo_url', e.target.value)}
                placeholder="https://..."
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="accent-[#4569AD]"
              />
              <span style={{ color: TEXT_MUTED, fontSize: '0.875rem' }}>Featured</span>
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

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent
          style={{ background: '#161616', border: `1px solid ${BORDER}`, color: '#fff' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}>
              Delete client
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
