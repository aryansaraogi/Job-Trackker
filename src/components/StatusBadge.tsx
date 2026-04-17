import type { Status } from '../types'

const styles: Record<Status, React.CSSProperties> = {
  Applied:   { backgroundColor: 'var(--chart-3)', color: '#ffffff' },
  Interview: { backgroundColor: 'var(--chart-2)', color: '#000000' },
  Offer:     { backgroundColor: 'var(--chart-4)', color: '#000000' },
  Rejected:  { backgroundColor: 'var(--chart-1)', color: '#ffffff' },
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className="px-2 py-0.5 text-xs font-semibold tracking-wide uppercase"
      style={styles[status]}
    >
      {status}
    </span>
  )
}
