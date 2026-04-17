import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  isDark: boolean
  onToggleDark: () => void
  onAdd: () => void
}

export function Header({ isDark, onToggleDark, onAdd }: HeaderProps) {
  const { currentUser, signOut } = useAuth()
  const location = useLocation()

  return (
    <header className="flex items-center justify-between mb-6 flex-wrap gap-2">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">🗂 Job Tracker</h1>
        <nav className="flex gap-2">
          <Link
            to="/"
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              location.pathname === '/'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/analytics"
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              location.pathname === '/analytics'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Analytics
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {currentUser && (
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            {currentUser.email}
          </span>
        )}
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          data-element-id="add-btn"
        >
          + Add Application
        </button>
        {currentUser && (
          <button
            onClick={signOut}
            className="text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
