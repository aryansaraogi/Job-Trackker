import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useJobApplications } from './hooks/useJobApplications'
import { useDarkMode } from './hooks/useDarkMode'
import { useAuth } from './context/AuthContext'
import type { JobApplication } from './types'
import type { FilterValue } from './components/FilterBar'
import { Header } from './components/Header'
import { StatusSummary } from './components/StatusSummary'
import { FilterBar } from './components/FilterBar'
import { JobList } from './components/JobList'
import { JobFormModal } from './components/JobFormModal'
import { AuthModal } from './components/AuthModal'
import { AnalyticsPage } from './pages/AnalyticsPage'

function AppContent() {
  const { currentUser, loading: authLoading } = useAuth()
  const { applications, addApplication, updateApplication, deleteApplication } = useJobApplications(currentUser?.uid)
  const { isDark, toggle } = useDarkMode()
  const [filter, setFilter] = useState<FilterValue>('All')
  const [modalState, setModalState] = useState<{ open: boolean; editing?: JobApplication }>({ open: false })

  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter)

  function openAdd() { setModalState({ open: true }) }
  function openEdit(app: JobApplication) { setModalState({ open: true, editing: app }) }
  function closeModal() { setModalState({ open: false }) }

  function handleSave(data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    if (modalState.editing) {
      updateApplication(modalState.editing.id, data)
    } else {
      addApplication(data)
    }
    closeModal()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <AuthModal />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Header isDark={isDark} onToggleDark={toggle} onAdd={openAdd} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <StatusSummary applications={applications} />
                <FilterBar active={filter} onChange={setFilter} />
                <JobList applications={filtered} onEdit={openEdit} onDelete={deleteApplication} />
              </>
            }
          />
          <Route
            path="/analytics"
            element={<AnalyticsPage applications={applications} isDark={isDark} />}
          />
        </Routes>
      </div>
      {modalState.open && (
        <JobFormModal
          initial={modalState.editing}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
