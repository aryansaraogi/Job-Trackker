import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { JobApplication } from '../../types'

interface WeeklyBarChartProps {
  applications: JobApplication[]
  isDark: boolean
}

function getWeekLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

export function WeeklyBarChart({ applications, isDark }: WeeklyBarChartProps) {
  const now = new Date()
  const weeks: { label: string; start: Date; end: Date }[] = []

  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000))
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
    weeks.push({ label: getWeekLabel(weekStart), start: weekStart, end: weekEnd })
  }

  const data = weeks.map(({ label, start, end }) => ({
    week: label,
    count: applications.filter(a => {
      const d = new Date(a.dateApplied + 'T00:00:00')
      return d >= start && d < end
    }).length,
  }))

  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#9ca3af' : '#6b7280'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Applications per Week (last 8 weeks)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="week" tick={{ fill: textColor, fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: textColor, fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              color: isDark ? '#d1d5db' : '#374151',
            }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
