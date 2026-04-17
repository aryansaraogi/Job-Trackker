import type { Status } from '../types'

type FilterValue = Status | 'All'
const FILTERS: FilterValue[] = ['All', 'Applied', 'Interview', 'Offer', 'Rejected']

interface FilterBarProps {
  active: FilterValue
  onChange: (f: FilterValue) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-0 mb-6 border border-border">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-5 py-3 text-sm font-medium transition-colors border-r border-border last:border-r-0 ${
            active === f
              ? 'bg-foreground text-background'
              : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

export type { FilterValue }
