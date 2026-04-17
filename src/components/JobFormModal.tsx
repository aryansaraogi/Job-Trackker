import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import type { JobApplication, Status } from '../types'
import { uploadResume } from '../services/storage'
import { useAuth } from '../context/AuthContext'

const STATUSES: Status[] = ['Applied', 'Interview', 'Offer', 'Rejected']
const MAX_FILE_SIZE = 5 * 1024 * 1024

interface JobFormModalProps {
  initial?: JobApplication
  onSave: (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

interface FormState {
  company: string
  role: string
  dateApplied: string
  status: Status
  notes: string
  reminderDate: string
}

interface Errors {
  company?: string
  role?: string
  dateApplied?: string
  file?: string
}

export function JobFormModal({ initial, onSave, onClose }: JobFormModalProps) {
  const { currentUser } = useAuth()
  const [form, setForm] = useState<FormState>({
    company: initial?.company ?? '',
    role: initial?.role ?? '',
    dateApplied: initial?.dateApplied ?? '',
    status: initial?.status ?? 'Applied',
    notes: initial?.notes ?? '',
    reminderDate: initial?.reminderDate ?? '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function validate(): boolean {
    const next: Errors = {}
    if (!form.company.trim()) next.company = 'Company name is required'
    if (!form.role.trim()) next.role = 'Role is required'
    if (!form.dateApplied) next.dateApplied = 'Date applied is required'
    if (file) {
      if (file.size > MAX_FILE_SIZE) next.file = 'File must be under 5 MB'
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext !== 'pdf' && ext !== 'docx') next.file = 'Only PDF or DOCX files allowed'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      let resumeUrl = initial?.resumeUrl
      if (file && currentUser) {
        const tempId = initial?.id ?? crypto.randomUUID()
        resumeUrl = await uploadResume(currentUser.uid, tempId, file, pct => {
          setUploadProgress(pct)
        })
        setUploadProgress(null)
      }
      onSave({
        company: form.company.trim(),
        role: form.role.trim(),
        dateApplied: form.dateApplied,
        status: form.status,
        notes: form.notes.trim() || undefined,
        reminderDate: form.reminderDate || undefined,
        resumeUrl,
        userId: currentUser?.uid ?? '',
      })
    } catch {
      setErrors(prev => ({ ...prev, file: 'Upload failed. Please try again.' }))
    } finally {
      setSubmitting(false)
    }
  }

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      if (errors[field as keyof Errors]) setErrors(err => ({ ...err, [field]: undefined }))
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
    setErrors(prev => ({ ...prev, file: undefined }))
  }

  return (
    <div
      className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card border border-border shadow-2xl w-full max-w-md p-7 max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <h2 className="text-sm font-bold text-card-foreground mb-5 uppercase tracking-widest">
          {initial ? 'Edit Application' : 'Add Application'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Company Name" required error={errors.company}>
            <input
              ref={firstInputRef}
              type="text"
              placeholder="e.g. Acme Corp"
              value={form.company}
              onChange={set('company')}
              className={inputCls(!!errors.company)}
              data-element-id="input-company"
            />
          </Field>
          <Field label="Role / Job Title" required error={errors.role}>
            <input
              type="text"
              placeholder="e.g. Frontend Engineer"
              value={form.role}
              onChange={set('role')}
              className={inputCls(!!errors.role)}
              data-element-id="input-role"
            />
          </Field>
          <Field label="Date Applied" required error={errors.dateApplied}>
            <input
              type="date"
              value={form.dateApplied}
              onChange={set('dateApplied')}
              className={inputCls(!!errors.dateApplied)}
              data-element-id="input-date"
            />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set('status')} className={inputCls(false)} data-element-id="input-status">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Reminder Date (optional)">
            <input
              type="date"
              value={form.reminderDate}
              onChange={set('reminderDate')}
              className={inputCls(false)}
              data-element-id="input-reminder"
            />
          </Field>
          <Field label="Resume / CV (PDF or DOCX, max 5 MB)" error={errors.file}>
            <label className="flex flex-col items-center justify-center w-full border border-dashed border-border px-4 py-5 cursor-pointer hover:border-accent hover:bg-muted transition-colors">
              <Upload size={18} className="text-muted-foreground mb-1.5" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : 'Click to upload PDF or DOCX'}
              </span>
              <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
            </label>
            {initial?.resumeUrl && !file && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Current: <a href={initial.resumeUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">View resume</a>
              </p>
            )}
            {uploadProgress !== null && (
              <div className="mt-2">
                <div className="h-0.5 bg-muted overflow-hidden">
                  <div className="h-full bg-accent transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
          </Field>
          <Field label="Notes (optional)">
            <textarea
              placeholder="Any notes about this application..."
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              className={`${inputCls(false)} resize-vertical`}
              data-element-id="input-notes"
            />
          </Field>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-border text-foreground hover:bg-muted transition-colors" data-element-id="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity" data-element-id="btn-save">
              {submitting ? 'Saving…' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? 'border-ring' : 'border-border'} px-3 py-2 text-sm bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow`
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-ring ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-ring">{error}</p>}
    </div>
  )
}
