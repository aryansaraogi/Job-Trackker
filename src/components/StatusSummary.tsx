import type { JobApplication, Status } from '../types'

const STATUSES: Status[] = ['Applied', 'Interview', 'Offer', 'Rejected']

export function StatusSummary({ applications }: { applications: JobApplication[] }) {
  const counts = STATUSES.reduce<Record<Status, number>>((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length
    return acc
  }, { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 })

  return (
    <div className="flex items-stretch divide-x divide-border border border-border mb-4">
      <div className="px-4 py-2.5 flex items-center gap-2">
        <span className="text-sm font-bold text-foreground tabular-nums">{applications.length}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
      </div>
      {STATUSES.map(s => (
        <div key={s} className="px-4 py-2.5 flex items-center gap-2">
          <span className="text-sm font-bold text-foreground tabular-nums">{counts[s]}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{s}</span>
        </div>
      ))}
    </div>
  )
}
