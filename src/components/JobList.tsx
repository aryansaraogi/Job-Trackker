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
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-base">No applications yet. Click <strong>+ Add Application</strong> to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map(app => (
        <JobCard key={app.id} application={app} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
