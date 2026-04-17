import { ClipboardList } from 'lucide-react'
import type { JobApplication } from '../types'
import { JobCard } from './JobCard'

interface JobListProps {
  applications: JobApplication[]
  onEdit: (app: JobApplication) => void
  onDelete: (id: string) => void
}

export function JobList({ applications, onEdit, onDelete }: JobListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground border border-dashed border-border">
        <ClipboardList size={36} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No applications yet. Click <strong className="text-foreground">Add Application</strong> to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0 border border-border divide-y divide-border">
      {applications.map(app => (
        <JobCard key={app.id} application={app} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
