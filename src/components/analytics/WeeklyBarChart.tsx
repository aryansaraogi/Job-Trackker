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

  const gridColor = isDark ? '#333333' : '#e0e0e0'
  const textColor = isDark ? '#888888' : '#666666'
  const bgColor = isDark ? '#111111' : '#ffffff'
  const borderColor = isDark ? '#333333' : '#000000'

  return (
    <div className="bg-card border border-border p-5">
      <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest">Applications per Week</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="none" stroke={gridColor} vertical={false} />
          <XAxis dataKey="week" tick={{ fill: textColor, fontSize: 11 }} axisLine={{ stroke: borderColor }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              color: textColor,
              borderRadius: 0,
              fontSize: 12,
            }}
            cursor={{ fill: isDark ? '#1c1c1c' : '#f0f0f0' }}
          />
          <Bar dataKey="count" fill="#0066ff" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
