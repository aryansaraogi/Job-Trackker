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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <KPICard label="Total Applications" value={total} />
      <KPICard label="Response Rate" value={`${responseRate}%`} />
      <KPICard label="Offer Rate" value={`${offerRate}%`} />
    </div>
  )
}

function KPICard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
    </div>
  )
}
