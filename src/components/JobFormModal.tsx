import { useEffect, useRef, useState } from 'react'
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-7 max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">
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
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100"
            />
            {initial?.resumeUrl && !file && (
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Current: <a href={initial.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View resume</a>
              </p>
            )}
            {uploadProgress !== null && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{uploadProgress}% uploaded</p>
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
          <div className="flex justify-end gap-2.5 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" data-element-id="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors" data-element-id="btn-save">
              {submitting ? 'Saving…' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
