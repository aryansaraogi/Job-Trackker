import type { JobApplication } from '../../types'

interface KPICardsProps {
  applications: JobApplication[]
}

export function KPICards({ applications }: KPICardsProps) {
  const total = applications.length
  const responded = applications.filter(a => a.status === 'Interview' || a.status === 'Offer' || a.status === 'Rejected').length
  const offers = applications.filter(a => a.status === 'Offer').length
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border mb-8 divide-x divide-border sm:divide-y-0 divide-y">
      <KPICard label="Total Applications" value={total} />
      <KPICard label="Response Rate" value={`${responseRate}%`} />
      <KPICard label="Offer Rate" value={`${offerRate}%`} />
    </div>
  )
}

function KPICard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-card p-5 hover:bg-muted transition-colors">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-bold tracking-tight text-card-foreground mt-2">{value}</p>
    </div>
  )
}
