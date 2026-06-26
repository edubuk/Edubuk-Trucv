import { API_BASE_URL } from '@/main'
import { useState, useEffect, useCallback } from 'react'

interface TrackingLink {
  _id: string
  partnerName: string
  campaignTag?: string
  url: string
  createdAt: string
  expiresAt: string
  total_users:number
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}


const isExpired = (dateStr: string) => new Date(dateStr) < new Date()

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  )
}



function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      className="icon-btn"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy link'}
      aria-label={copied ? 'Copied!' : 'Copy link'}
    >
      {copied ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

function DeleteButton({ onDelete, loading }: { onDelete: () => void; loading: boolean }) {
  return (
    <button
      className="icon-btn icon-btn--danger"
      onClick={onDelete}
      disabled={loading}
      title="Delete link"
      aria-label="Delete link"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

const TrackingLink = () => {
  const [links, setLinks] = useState<TrackingLink[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const [partnerName, setPartnerName] = useState('')
  const [campaignTag, setCampaignTag] = useState('')

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(API_BASE_URL + '/api/v1/admin/get-all-partner-tracking-links', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials:"include"
      })
      const json: ApiResponse<TrackingLink[]> = await res.json()
      if (!json.success) throw new Error(json.message)
      setLinks(json.data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const handleCreate = async () => {
    setFormError(null)

    const trimmed = partnerName.trim().toUpperCase()
    if (!trimmed) return setFormError('Partner name is required.')
    if (!/^[A-Z0-9_\-]+$/.test(trimmed))
      return setFormError('Use only letters, numbers, underscores, or hyphens.')

    try {
      setCreating(true)
      const res = await fetch(API_BASE_URL + '/api/v1/admin/create-partner-tracking-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: trimmed,
          campaignTag: campaignTag.trim() || undefined,
        }),
        credentials:"include"
      })
      const json: ApiResponse<TrackingLink> = await res.json()
      if (!json.success) throw new Error(json.message)

      setLinks((prev) => [json.data, ...prev])
      setPartnerName('')
      setCampaignTag('')
    } catch (err: any) {
      setFormError(err.message || 'Failed to create link')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/delete-partner-tracking-link/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials:"include" })
      const json: ApiResponse<null> = await res.json()
      if (!json.success) throw new Error(json.message)
      setLinks((prev) => prev.filter((l) => l._id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete link')
    } finally {
      setDeletingId(null)
    }
  }

  const activeCount = links.filter((l) => !isExpired(l.expiresAt)).length
  const partnerCount = new Set(links.map((l) => l.partnerName)).size

  return (
    <>
      <style>{`
        .tl-wrap { padding: 1.5rem; font-family: inherit; }

        .tl-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 1.5rem; }
        .stat-card { background: #f5f5f4; border-radius: 8px; padding: 12px 16px; }
        .stat-label { font-size: 12px; color: #6b7280; margin: 0 0 4px; }
        .stat-value { font-size: 24px; font-weight: 500; margin: 0; color: #111827; }

        .tl-card { background: #fff; border: 0.5px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; }
        .tl-card-title { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; margin: 0 0 12px; }

        .form-row { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
        .form-field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 160px; }
        .form-field label { font-size: 13px; color: #6b7280; }
        .form-field input {
          height: 36px; padding: 0 10px;
          border: 0.5px solid #d1d5db; border-radius: 8px;
          font-size: 14px; color: #111827; outline: none;
          background: #fff;
        }
        .form-field input:focus { border-color: #6b7280; box-shadow: 0 0 0 2px rgba(107,114,128,0.15); }

        .btn-primary {
          height: 36px; padding: 0 16px;
          background: #137368; color: #fff;
          border: none; border-radius: 8px;
          font-size: 14px; cursor: pointer;
          white-space: nowrap; display: flex; align-items: center; gap: 6px;
        }
        .btn-primary:hover { background: #137368; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-error {
          margin-top: 8px; font-size: 13px; color: #dc2626;
          display: flex; align-items: center; gap: 5px;
        }

        .tl-table-wrap { border: 0.5px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .tl-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tl-table th {
          text-align: left; padding: 10px 14px;
          font-size: 12px; font-weight: 500; color: #6b7280;
          border-bottom: 0.5px solid #e5e7eb; background: #f9fafb;
        }
        .tl-table td { padding: 12px 14px; border-bottom: 0.5px solid #f3f4f6; color: #111827; vertical-align: middle; }
        .tl-table tr:last-child td { border-bottom: none; }
        .tl-table tr:hover td { background: #f9fafb; }

        .partner-chip {
          display: inline-flex; align-items: center; gap: 4px;
          background: #f3f4f6; border: 0.5px solid #e5e7eb;
          border-radius: 6px; padding: 3px 8px;
          font-size: 12px; font-weight: 500; color: #374151;
        }
        .campaign-tag { font-size: 11px; color: #9ca3af; margin-left: 4px; }

        .link-cell { display: flex; align-items: center; gap: 8px; }
        .link-mono {
          font-family: 'Courier New', monospace; font-size: 11px;
          color: #6b7280; background: #f3f4f6; border-radius: 4px;
          padding: 3px 7px; max-width: 240px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .badge { font-size: 11px; padding: 3px 8px; border-radius: 99px; font-weight: 500; }
        .badge--active { background: #dcfce7; color: #15803d; }
        .badge--expired { background: #f3f4f6; color: #9ca3af; }

        .icon-btn {
          border: none; background: none; cursor: pointer;
          color: #9ca3af; padding: 4px; border-radius: 4px;
          display: flex; align-items: center;
        }
        .icon-btn:hover { color: #374151; background: #f3f4f6; }
        .icon-btn--danger:hover { color: #dc2626; background: #fef2f2; }
        .icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .actions-cell { display: flex; align-items: center; gap: 4px; }

        .empty-state { text-align: center; padding: 3rem 1rem; color: #9ca3af; font-size: 14px; }

        .error-banner {
          background: #fef2f2; border: 0.5px solid #fecaca;
          border-radius: 8px; padding: 10px 14px;
          color: #dc2626; font-size: 13px; margin-bottom: 1rem;
          display: flex; align-items: center; justify-content: space-between;
        }

        .loading-row td { text-align: center; padding: 2rem; color: #9ca3af; font-size: 14px; }

        @media (max-width: 640px) {
          .tl-stats { grid-template-columns: 1fr 1fr; }
          .form-row { flex-direction: column; }
          .tl-table th:nth-child(3), .tl-table td:nth-child(3),
          .tl-table th:nth-child(4), .tl-table td:nth-child(4) { display: none; }
        }
      `}</style>

      <div className="tl-wrap">
        {/* Stats */}
        <div className="tl-stats">
          <StatCard label="Total partners" value={partnerCount} />
          <StatCard label="Active links" value={activeCount} />
          <StatCard label="Links created" value={links.length} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button className="icon-btn" onClick={fetchLinks} aria-label="Retry">Retry</button>
          </div>
        )}

        {/* Create form */}
        <div className="tl-card">
          <p className="tl-card-title">Generate a new tracking link</p>
          <div className="form-row">
            <div className="form-field max-w-xl w-full">
              <label htmlFor="tl-partner">Partner / Campaign name</label>
              <input
                id="tl-partner"
                type="text"
                placeholder="e.g. VEDA_IT"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
           
            <button className="btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? 'Generating…' : '+ Generate link'}
            </button>
          </div>
          {formError && (
            <p className="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
              {formError}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="tl-table-wrap">
          <table className="tl-table">
            <thead>
              <tr>
                <th>Partner / Campaign</th>
                <th>Tracking link</th>
                <th>Users</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="loading-row"><td colSpan={6}>Loading…</td></tr>
              ) : links.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state">No links yet — generate one above</div></td></tr>
              ) : (
                links.map((link) => (
                  <tr key={link._id}>
                    <td>
                      <span className="partner-chip">{link.partnerName}</span>
                      {link.campaignTag && (
                        <span className="campaign-tag">#{link.campaignTag}</span>
                      )}
                    </td>
                    <td>
                      <div className="link-cell">
                        <span className="link-mono" title={link.url}>{link.url}</span>
                        <CopyButton text={link.url} />
                      </div>
                    </td>
                    <td style={{ color: '#6b7280' }}>{link?.total_users || 0}</td>
                    <td style={{ color: '#6b7280' }}>{fmtDate(link.createdAt)}</td>
                    <td>
                      <div className="actions-cell">
                        <DeleteButton
                          onDelete={() => handleDelete(link._id)}
                          loading={deletingId === link._id}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TrackingLink