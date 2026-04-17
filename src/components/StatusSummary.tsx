import type { JobApplication, Status } from '../types'

const STATUSES: Status[] = ['Applied', 'Interview', 'Offer', 'Rejected']

export function StatusSummary({ applications }: { applications: JobApplication[] }) {
  const counts = STATUSES.reduce<Record<Status, number>>((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length
    return acc
  }, { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 })

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3.5 py-1 text-sm text-gray-600 dark:text-gray-300">
        All: {applications.length}
      </span>
      {STATUSES.map(s => (
        <span key={s} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3.5 py-1 text-sm text-gray-600 dark:text-gray-300">
          {s}: {counts[s]}
        </span>
      ))}
    </div>
  )
}
