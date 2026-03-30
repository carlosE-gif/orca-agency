'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { AboutContent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const ACCENT = '#4569AD'
const BORDER = 'rgba(255,255,255,0.08)'
const TEXT_MUTED = 'rgba(255,255,255,0.5)'

function inputStyle() {
  return { background: '#1a1a1a', borderColor: BORDER, color: '#fff', fontFamily: 'var(--font-dm-sans)' }
}
function labelStyle() {
  return { color: TEXT_MUTED, fontFamily: 'var(--font-dm-sans)' }
}

interface Props { initialContent: AboutContent }

export function AboutManager({ initialContent }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function update<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `about-panel-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, file, { upsert: true })
    if (uploadError) { setError(uploadError.message); setUploading(false); return }
    const { data } = supabase.storage.from('project-images').getPublicUrl(path)
    update('panel_image', data.publicUrl)
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)
    const supabase = createClient()
    const { error: err } = await supabase
      .from('about_content')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', form.id)
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    router.refresh()
  }

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans)', maxWidth: 720 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light" style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}>
          About Section
        </h1>
        <Button onClick={handleSave} disabled={saving} style={{ background: ACCENT, color: '#fff', border: 'none' }}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>

      {error && <p className="mb-4 text-sm" style={{ color: '#f87171' }}>{error}</p>}
      {success && <p className="mb-4 text-sm" style={{ color: '#4ade80' }}>Saved successfully.</p>}

      <div className="flex flex-col gap-6">

        {/* Heading */}
        <div className="rounded-xl p-6 flex flex-col gap-4" style={{ background: '#111', border: `1px solid ${BORDER}` }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Heading</p>
          <div className="flex flex-col gap-1.5">
            <Label style={labelStyle()}>Label (e.g. "About Orca")</Label>
            <Input value={form.subheading} onChange={(e) => update('subheading', e.target.value)} style={inputStyle()} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label style={labelStyle()}>Line 1 (white text)</Label>
            <Input value={form.heading_line1} onChange={(e) => update('heading_line1', e.target.value)} style={inputStyle()} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label style={labelStyle()}>Line 2 (blue italic text)</Label>
            <Input value={form.heading_line2} onChange={(e) => update('heading_line2', e.target.value)} style={inputStyle()} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label style={labelStyle()}>Body paragraph</Label>
            <Textarea value={form.body} onChange={(e) => update('body', e.target.value)} rows={4} style={{ ...inputStyle(), resize: 'vertical' }} />
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl p-6 flex flex-col gap-4" style={{ background: '#111', border: `1px solid ${BORDER}` }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Stats</p>
          {([
            ['stat1_value', 'stat1_suffix', 'stat1_label'],
            ['stat2_value', 'stat2_suffix', 'stat2_label'],
            ['stat3_value', 'stat3_suffix', 'stat3_label'],
          ] as const).map((keys, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label style={labelStyle()}>Value</Label>
                <Input value={form[keys[0]]} onChange={(e) => update(keys[0], e.target.value)} style={inputStyle()} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label style={labelStyle()}>Suffix</Label>
                <Input value={form[keys[1]]} onChange={(e) => update(keys[1], e.target.value)} style={inputStyle()} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label style={labelStyle()}>Label</Label>
                <Input value={form[keys[2]]} onChange={(e) => update(keys[2], e.target.value)} style={inputStyle()} />
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="rounded-xl p-6 flex flex-col gap-4" style={{ background: '#111', border: `1px solid ${BORDER}` }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Right Panel</p>
          <div className="flex flex-col gap-1.5">
            <Label style={labelStyle()}>Tagline title</Label>
            <Input value={form.tagline_title} onChange={(e) => update('tagline_title', e.target.value)} style={inputStyle()} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label style={labelStyle()}>Tagline subtitle</Label>
            <Input value={form.tagline_subtitle} onChange={(e) => update('tagline_subtitle', e.target.value)} style={inputStyle()} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label style={labelStyle()}>Panel image</Label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
            {form.panel_image ? (
              <div className="relative rounded-lg overflow-hidden" style={{ height: 200, background: '#1a1a1a' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.panel_image} alt="Panel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button"
                  onClick={() => { update('panel_image', null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                  Remove
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="flex items-center justify-center rounded-lg border-2 border-dashed h-32 text-sm"
                style={{ borderColor: BORDER, color: TEXT_MUTED, background: '#1a1a1a' }}>
                {uploading ? 'Uploading…' : '+ Upload image'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
