import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  contentError,
  readContent,
  writeContent,
  uploadContentImage,
} from '../../services/contentService'
import type {
  StoryRecord,
  DealerRecord,
  InboxMessage,
  SiteSettings,
  AccessList,
} from '../../services/contentService'
import { siteConfig } from '../../constants/site'

export function AdminPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cms-panel">
      <header>
        <span>Energion Control</span>
        <h1>{title}</h1>
      </header>
      {children}
    </section>
  )
}
function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  required = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
  required?: boolean
}) {
  return (
    <label className="cms-field">
      {label}
      {multiline ? (
        <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}
const blankDealer = (): DealerRecord => ({
  id: '',
  showroom: '',
  region: '',
  city: '',
  address: '',
  phone: '',
  hours: '',
  published: true,
})
const blankStory = (): StoryRecord => ({
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  category: 'Company',
  author: 'Energion Team',
  coverImage: '',
  coverAlt: '',
  aiIllustration: false,
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime: '4 min read',
  published: false,
  featured: false,
  content: [{ heading: '', paragraphs: [''] }],
})

export function AdminContentPage({ resource }: { resource: 'blogs' | 'dealers' }) {
  const client = useQueryClient()
  const [draft, setDraft] = useState<StoryRecord | DealerRecord | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const query = useQuery({
    queryKey: ['admin-content', resource],
    queryFn: () => readContent<Record<string, (StoryRecord | DealerRecord)[]>>(resource),
  })
  const refresh = () => {
    void client.invalidateQueries({ queryKey: ['admin-content', resource] })
    void client.invalidateQueries({ queryKey: [resource] })
    void client.invalidateQueries({ queryKey: ['blog'] })
    void client.invalidateQueries({ queryKey: ['admin-summary'] })
  }
  const save = useMutation({
    mutationFn: (record: StoryRecord | DealerRecord) =>
      writeContent(
        `${resource}${record.id ? `/${record.id}` : ''}`,
        'content' in record
          ? {
              ...record,
              content: record.content.map((section) => ({
                ...section,
                ...(section.bullets
                  ? { bullets: section.bullets.filter((line) => line.trim()) }
                  : {}),
              })),
            }
          : record,
        record.id ? 'put' : 'post',
      ),
    onSuccess: () => {
      setDraft(null)
      refresh()
    },
  })
  const remove = useMutation({
    mutationFn: (id: string) => writeContent(`${resource}/${id}`, undefined, 'delete'),
    onSuccess: refresh,
  })
  function update(key: string, value: unknown) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }
  const story = draft && 'title' in draft ? draft : null
  const dealer = draft && 'showroom' in draft ? draft : null
  return (
    <AdminPanel title={resource === 'blogs' ? 'Blog and Media' : 'Dealer Network'}>
      <p>
        Published entries appear on the public website. Unpublish an entry to keep it in admin only.
      </p>
      <button
        className="cms-primary"
        disabled={save.isPending || uploading}
        onClick={() => {
          save.reset()
          setUploadError('')
          setDraft(resource === 'blogs' ? blankStory() : blankDealer())
        }}
      >
        Add {resource === 'blogs' ? 'story' : 'dealer'}
      </button>
      {query.isPending && <p role="status">Loading records...</p>}
      {query.isError && (
        <p role="alert">
          {contentError(query.error)} <button onClick={() => void query.refetch()}>Retry</button>
        </p>
      )}
      {draft && (
        <form
          className="cms-editor"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            save.mutate(draft)
          }}
        >
          <h2>
            {draft.id ? 'Edit' : 'Create'} {story ? 'story' : 'dealer'}
          </h2>
          <div className="cms-grid">
            {dealer && (
              <>
                {(['showroom', 'region', 'city', 'address', 'phone', 'hours'] as const).map(
                  (key) => (
                    <Field
                      key={key}
                      label={key === 'region' ? 'Sales area' : key[0].toUpperCase() + key.slice(1)}
                      value={dealer[key] ?? ''}
                      onChange={(v) => update(key, v)}
                      required={!['phone', 'hours'].includes(key)}
                      multiline={key === 'address'}
                    />
                  ),
                )}
              </>
            )}
            {story && (
              <>
                <Field label="Title" value={story.title} onChange={(v) => update('title', v)} />
                <Field label="URL slug" value={story.slug} onChange={(v) => update('slug', v)} />
                <label className="cms-field">
                  Category
                  <select
                    value={story.category}
                    onChange={(e) => update('category', e.target.value)}
                  >
                    {['Company', 'Technology', 'Guides'].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <Field label="Author" value={story.author} onChange={(v) => update('author', v)} />
                <Field
                  label="Publication date"
                  type="date"
                  value={story.publishedAt}
                  onChange={(v) => update('publishedAt', v)}
                />
                <Field
                  label="Reading time"
                  value={story.readTime}
                  onChange={(v) => update('readTime', v)}
                />
                <Field
                  label="Excerpt"
                  multiline
                  value={story.excerpt}
                  onChange={(v) => update('excerpt', v)}
                />
                <Field
                  label="Cover image URL"
                  value={story.coverImage}
                  onChange={(v) => update('coverImage', v)}
                />
                <Field
                  label="Image description"
                  value={story.coverAlt ?? ''}
                  onChange={(v) => update('coverAlt', v)}
                />
                <label className="cms-field">
                  Upload cover (up to 5 MB)
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setUploading(true)
                      setUploadError('')
                      try {
                        update('coverImage', await uploadContentImage(file))
                      } catch (error) {
                        setUploadError(contentError(error))
                      } finally {
                        setUploading(false)
                      }
                    }}
                  />
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={story.aiIllustration ?? false}
                    onChange={(e) => update('aiIllustration', e.target.checked)}
                  />{' '}
                  AI-generated illustration
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={story.featured ?? false}
                    onChange={(e) => update('featured', e.target.checked)}
                  />{' '}
                  Featured story
                </label>
              </>
            )}
          </div>
          {story?.coverImage && (
            <img
              className="cms-cover-preview"
              src={story.coverImage}
              alt={story.coverAlt || 'Story cover preview'}
            />
          )}
          {story && (
            <div className="cms-sections">
              {story.content.map((section, index) => {
                const change = (patch: Partial<typeof section>) =>
                  update(
                    'content',
                    story.content.map((s, i) => (i === index ? { ...s, ...patch } : s)),
                  )
                return (
                  <fieldset key={index}>
                    <legend>Section {index + 1}</legend>
                    <Field
                      label="Section heading"
                      value={section.heading}
                      onChange={(heading) => change({ heading })}
                    />
                    <Field
                      label="Paragraphs (separate with a blank line)"
                      multiline
                      value={section.paragraphs.join('\n\n')}
                      onChange={(v) => change({ paragraphs: v.split('\n\n') })}
                    />
                    <Field
                      label="Bullet points (one per line, optional)"
                      multiline
                      required={false}
                      value={section.bullets?.join('\n') ?? ''}
                      onChange={(v) => change({ bullets: v.split('\n') })}
                    />
                    <button
                      type="button"
                      disabled={story.content.length === 1}
                      onClick={() =>
                        update(
                          'content',
                          story.content.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Remove section
                    </button>
                  </fieldset>
                )
              })}
              <button
                type="button"
                onClick={() =>
                  update('content', [...story.content, { heading: '', paragraphs: [''] }])
                }
              >
                Add section
              </button>
            </div>
          )}
          <label>
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => update('published', e.target.checked)}
            />{' '}
            Published on website
          </label>
          {uploading && <p role="status">Uploading image...</p>}
          {uploadError && <p role="alert">{uploadError}</p>}
          {save.isError && <p role="alert">{contentError(save.error)}</p>}
          <div className="cms-actions">
            <button className="cms-primary" disabled={save.isPending || uploading}>
              {save.isPending ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              disabled={save.isPending || uploading}
              onClick={() => setDraft(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {remove.isError && <p role="alert">{contentError(remove.error)}</p>}
      <div className="cms-list">
        {query.data?.[resource].map((record) => (
          <article key={record.id}>
            <div>
              <h2>{'title' in record ? record.title : record.showroom}</h2>
              <p>{'title' in record ? record.category : `${record.city} / ${record.region}`}</p>
              <span>{record.published ? 'Published' : 'Draft / hidden'}</span>
            </div>
            <div className="cms-actions">
              <button
                disabled={save.isPending || uploading}
                onClick={() => {
                  save.reset()
                  setDraft({ ...record, published: record.published ?? true })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Edit
              </button>
              <button
                disabled={remove.isPending || save.isPending || uploading}
                onClick={() => {
                  if (window.confirm('Delete this record permanently?')) {
                    if (draft?.id === record.id) setDraft(null)
                    remove.mutate(record.id)
                  }
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {query.isSuccess && !query.data[resource].length && (
        <p>No entries yet. Add your first one above.</p>
      )}
    </AdminPanel>
  )
}

export function AdminMessagesPage() {
  const client = useQueryClient()
  const query = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => readContent<{ messages: InboxMessage[] }>('messages'),
  })
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      writeContent(`messages/${id}`, { status }, 'patch'),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['admin-messages'] })
    },
  })
  return (
    <AdminPanel title="Enquiry Inbox">
      <p>
        Website enquiries, newest first. Reply using your email or phone; changing status does not
        send a reply.
      </p>
      <button onClick={() => void query.refetch()}>Refresh inbox</button>
      {query.isPending && <p role="status">Loading enquiries...</p>}
      {query.isError && <p role="alert">{contentError(query.error)}</p>}
      {mutation.isError && <p role="alert">{contentError(mutation.error)}</p>}
      <div className="cms-list">
        {query.data?.messages.map((message) => (
          <article key={message.id}>
            <div>
              <h2>{message.name}</h2>
              <p>
                {new Date(message.createdAt).toLocaleString()} /{' '}
                {message.model || 'General enquiry'}
              </p>
              <p className="cms-message">{message.message}</p>
              <div className="cms-actions">
                <a href={`mailto:${message.email}`}>{message.email}</a>
                <a href={`tel:${message.phone}`}>{message.phone}</a>
              </div>
            </div>
            <label className="cms-field">
              Status
              <select
                value={message.status}
                disabled={mutation.isPending}
                onChange={(e) => mutation.mutate({ id: message.id, status: e.target.value })}
              >
                {['new', 'read', 'resolved'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>
      {query.isSuccess && !query.data.messages.length && <p>No enquiries yet.</p>}
    </AdminPanel>
  )
}

export function AdminSettingsPage() {
  const client = useQueryClient()
  const query = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => readContent<{ settings: SiteSettings }>('settings'),
  })
  const [draft, setDraft] = useState<SiteSettings | null>(null)
  const settings = draft ?? query.data?.settings ?? siteConfig
  const mutation = useMutation({
    mutationFn: () => writeContent('settings', settings),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['site-settings'] })
      void client.invalidateQueries({ queryKey: ['admin-settings'] })
    },
  })
  return (
    <AdminPanel title="Business Settings">
      <p>Update the public business name, tagline and contact information.</p>
      {query.isPending ? (
        <p>Loading settings...</p>
      ) : query.isError ? (
        <p role="alert">
          {contentError(query.error)} <button onClick={() => void query.refetch()}>Retry</button>
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
        >
          <div className="cms-grid">
            {(Object.keys(siteConfig) as (keyof SiteSettings)[]).map((key) => (
              <Field
                key={key}
                label={key[0].toUpperCase() + key.slice(1)}
                type={key === 'email' ? 'email' : 'text'}
                value={settings[key]}
                onChange={(v) => {
                  mutation.reset()
                  setDraft({ ...settings, [key]: v })
                }}
              />
            ))}
          </div>
          {mutation.isError && <p role="alert">{contentError(mutation.error)}</p>}
          {mutation.isSuccess && <p role="status">Settings saved.</p>}
          <button className="cms-primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save settings'}
          </button>
        </form>
      )}
    </AdminPanel>
  )
}

export function AdminAccessPage() {
  const client = useQueryClient()
  const [phone, setPhone] = useState('')
  const query = useQuery({
    queryKey: ['admin-access'],
    queryFn: () => readContent<AccessList>('admins'),
  })
  const mutation = useMutation({
    mutationFn: (body: { phone: string; role: string }) => writeContent('admins', body),
    onSuccess: () => {
      setPhone('')
      void client.invalidateQueries({ queryKey: ['admin-access'] })
      void client.invalidateQueries({ queryKey: ['admin-summary'] })
    },
  })
  return (
    <AdminPanel title="Admin Access">
      <p>
        Only a configured primary admin can grant or revoke access. Primary admins are protected.
        New operators must register an account first.
      </p>
      {query.isPending && <p>Loading accounts...</p>}
      {query.isError && (
        <p role="alert">
          {contentError(query.error)} <button onClick={() => void query.refetch()}>Retry</button>
        </p>
      )}
      {query.data?.canManage && (
        <form
          className="cms-actions"
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate({ phone, role: 'admin' })
          }}
        >
          <Field label="Registered phone number" type="tel" value={phone} onChange={setPhone} />
          <button className="cms-primary" disabled={mutation.isPending}>
            Grant admin access
          </button>
        </form>
      )}
      {mutation.isError && <p role="alert">{contentError(mutation.error)}</p>}
      {mutation.isSuccess && <p role="status">Access updated.</p>}
      <div className="cms-list">
        {query.data?.users.map((user) => (
          <article key={user.id}>
            <div>
              <h2>{user.name}</h2>
              <p>
                {user.phone} / {user.role}
                {query.data.protectedPhones.includes(user.phone) ? ' / Primary admin' : ''}
              </p>
            </div>
            {query.data.canManage && !query.data.protectedPhones.includes(user.phone) && (
              <button
                disabled={mutation.isPending}
                onClick={() => {
                  if (window.confirm(`Change admin access for ${user.name}?`))
                    mutation.mutate({
                      phone: user.phone,
                      role: user.role === 'admin' ? 'user' : 'admin',
                    })
                }}
              >
                {user.role === 'admin' ? 'Revoke access' : 'Make admin'}
              </button>
            )}
          </article>
        ))}
      </div>
    </AdminPanel>
  )
}
