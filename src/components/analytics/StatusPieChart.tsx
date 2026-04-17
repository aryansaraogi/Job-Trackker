import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { JobApplication, Status } from '../../types'

interface StatusPieChartProps {
  applications: JobApplication[]
  isDark: boolean
}

const COLORS: Record<Status, string> = {
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#22c55e',
  Rejected: '#ef4444',
}

const STATUSES: Status[] = ['Applied', 'Interview', 'Offer', 'Rejected']

export function StatusPieChart({ applications, isDark }: StatusPieChartProps) {
  const data = STATUSES.map(status => ({
    name: status,
    value: applications.filter(a => a.status === status).length,
  })).filter(d => d.value > 0)

  const textColor = isDark ? '#d1d5db' : '#374151'

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Applications by Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map(entry => (
              <Cell key={entry.name} fill={COLORS[entry.name as Status]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              color: textColor,
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: textColor, fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
