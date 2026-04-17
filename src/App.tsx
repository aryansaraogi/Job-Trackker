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
import { BGPattern } from '@/components/ui/bg-pattern'

function AppContent() {
  const { currentUser, loading: authLoading } = useAuth()
  const { applications, firestoreError, addApplication, updateApplication, deleteApplication } = useJobApplications(currentUser?.uid)
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
    <BGPattern
      variant="dots"
      mask="none"
      size={2}
      gap={20}
      patternColor="currentColor"
      patternOpacity={0.08}
      className="min-h-screen bg-background transition-colors"
    >
      <div className="max-w-5xl mx-auto px-8 py-10">
        <Header isDark={isDark} onToggleDark={toggle} onAdd={openAdd} />
        {firestoreError === 'permission-denied' && (
          <div className="mb-6 border border-ring bg-ring/10 px-4 py-3 text-sm text-ring">
            <strong>Firestore permission denied.</strong> Your security rules haven't been deployed yet. Run: <code className="font-mono bg-ring/10 px-1">firebase deploy --only firestore:rules</code>
          </div>
        )}
        {firestoreError && firestoreError !== 'permission-denied' && (
          <div className="mb-6 border border-ring bg-ring/10 px-4 py-3 text-sm text-ring">
            <strong>Firestore error:</strong> {firestoreError}
          </div>
        )}
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
    </BGPattern>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
