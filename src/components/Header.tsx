import { Link, useLocation } from 'react-router-dom'
import { Briefcase, Sun, Moon, LayoutDashboard, TrendingUp, Plus, LogOut } from 'lucide-react'
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
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border -mx-8 px-8 mb-10">
      <div className="flex items-center justify-between h-16 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-foreground" />
            <span className="font-semibold tracking-tight text-foreground">Job Tracker</span>
          </div>
          <nav className="flex gap-0.5">
            <Link
              to="/"
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 transition-colors border ${
                location.pathname === '/'
                  ? 'bg-foreground text-background border-foreground font-medium'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
              }`}
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 transition-colors border ${
                location.pathname === '/analytics'
                  ? 'bg-foreground text-background border-foreground font-medium'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
              }`}
            >
              <TrendingUp size={13} />
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              {currentUser.email}
            </span>
          )}
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-accent text-accent-foreground text-sm px-3.5 py-1.5 font-medium hover:opacity-90 transition-opacity border border-accent"
            data-element-id="add-btn"
          >
            <Plus size={14} />
            Add Application
          </button>
          {currentUser && (
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
