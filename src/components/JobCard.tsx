import { Bell, Paperclip, Pencil, Trash2 } from 'lucide-react'
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
    <div className="bg-card border border-border px-5 py-4 flex items-center justify-between gap-4 hover:border-accent transition-colors duration-150 group">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-card-foreground truncate">{company}</p>
          {showReminder && (
            <span title="Follow-up reminder due" className="shrink-0">
              <Bell size={12} className="text-chart-1" />
            </span>
          )}
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noreferrer" title="View resume" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Paperclip size={12} />
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">{role}</p>
        <p className="text-xs text-muted-foreground/60 mt-1 tabular-nums">Applied {formatted}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <StatusBadge status={status} />
        <button
          onClick={() => onEdit(application)}
          title="Edit"
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={handleDelete}
          title="Delete"
          className="p-1.5 text-muted-foreground hover:text-ring hover:bg-ring/10 transition-colors border border-transparent hover:border-ring"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
