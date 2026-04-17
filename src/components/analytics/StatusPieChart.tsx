import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { JobApplication, Status } from '../../types'

interface StatusPieChartProps {
  applications: JobApplication[]
  isDark: boolean
}

const COLORS: Record<Status, string> = {
  Applied:   '#0066ff',
  Interview: '#ffff00',
  Offer:     '#00cc00',
  Rejected:  '#ff3333',
}

const STATUSES: Status[] = ['Applied', 'Interview', 'Offer', 'Rejected']

export function StatusPieChart({ applications, isDark }: StatusPieChartProps) {
  const data = STATUSES.map(status => ({
    name: status,
    value: applications.filter(a => a.status === status).length,
  })).filter(d => d.value > 0)

  const textColor = isDark ? '#888888' : '#666666'
  const bgColor = isDark ? '#111111' : '#ffffff'
  const borderColor = isDark ? '#333333' : '#000000'

  return (
    <div className="bg-card border border-border p-5">
      <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest">Applications by Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            paddingAngle={0}
            strokeWidth={2}
            stroke={bgColor}
          >
            {data.map(entry => (
              <Cell key={entry.name} fill={COLORS[entry.name as Status]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              color: textColor,
              borderRadius: 0,
              fontSize: 12,
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
