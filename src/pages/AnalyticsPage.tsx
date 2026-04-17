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
      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-base">Add at least 2 applications to see analytics.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Analytics</h2>
      <KPICards applications={applications} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusPieChart applications={applications} isDark={isDark} />
        <WeeklyBarChart applications={applications} isDark={isDark} />
      </div>
    </div>
  )
}
