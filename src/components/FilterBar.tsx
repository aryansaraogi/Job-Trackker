import type { Status } from '../types'

type FilterValue = Status | 'All'
const FILTERS: FilterValue[] = ['All', 'Applied', 'Interview', 'Offer', 'Rejected']

interface FilterBarProps {
  active: FilterValue
  onChange: (f: FilterValue) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1 rounded-md text-sm border transition-colors ${
            active === f
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

export type { FilterValue }
