import { BarChart3 } from 'lucide-react'
import type { JobApplication } from '../types'
import { KPICards } from '../components/analytics/KPICards'
import { StatusPieChart } from '../components/analytics/StatusPieChart'
import { WeeklyBarChart } from '../components/analytics/WeeklyBarChart'

interface AnalyticsPageProps {
  applications: JobApplication[]
  isDark: boolean
}

export function AnalyticsPage({ applications, isDark }: AnalyticsPageProps) {
  if (applications.length < 2) {
    return (
      <div className="text-center py-20 text-muted-foreground border border-dashed border-border">
        <BarChart3 size={36} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Add at least 2 applications to see analytics.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xs font-bold text-foreground mb-6 uppercase tracking-widest">Analytics</h2>
      <KPICards applications={applications} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusPieChart applications={applications} isDark={isDark} />
        <WeeklyBarChart applications={applications} isDark={isDark} />
      </div>
    </div>
  )
}
