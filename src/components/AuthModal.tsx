import { useState } from 'react'
import { Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type Tab = 'login' | 'signup'

export function AuthModal() {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (tab === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border shadow-2xl w-full max-w-sm p-8">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Briefcase size={20} className="text-foreground" />
          <span className="text-lg font-bold tracking-tight text-foreground uppercase">Job Tracker</span>
        </div>

        <div className="flex border-b border-border mb-6">
          {(['login', 'signup'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 pb-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                tab === t
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full border border-border px-3 py-2 text-sm bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border px-3 py-2 text-sm bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="text-xs text-ring border border-ring px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-accent-foreground py-2.5 text-sm font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Please wait…' : tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
