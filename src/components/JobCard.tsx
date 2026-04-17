import type { JobApplication } from '../types'
import { StatusBadge } from './StatusBadge'

interface JobCardProps {
  application: JobApplication
  onEdit: (app: JobApplication) => void
  onDelete: (id: string) => void
}

function isReminderDue(app: JobApplication): boolean {
  if (!app.reminderDate) return false
  if (app.status !== 'Applied' && app.status !== 'Interview') return false
  return app.reminderDate <= new Date().toISOString().slice(0, 10)
}

export function JobCard({ application, onEdit, onDelete }: JobCardProps) {
  const { id, company, role, dateApplied, status, resumeUrl } = application

  function handleDelete() {
    if (window.confirm(`Delete application for ${role} at ${company}?`)) {
      onDelete(id)
    }
  }

  const formatted = new Date(dateApplied + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const showReminder = isReminderDue(application)

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3.5 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{company}</p>
          {showReminder && <span title="Follow-up reminder due" className="text-sm">🔔</span>}
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noreferrer" title="View resume" className="text-sm hover:opacity-75 transition-opacity">
              📎
            </a>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{role}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Applied: {formatted}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={status} />
        <button
          onClick={() => onEdit(application)}
          className="border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  )
}
