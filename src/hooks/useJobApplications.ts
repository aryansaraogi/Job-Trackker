import { useEffect, useState } from 'react'
import type { JobApplication } from '../types'
import {
  subscribeToApplications,
  addApplication as fsAdd,
  updateApplication as fsUpdate,
  deleteApplication as fsDelete,
} from '../services/firestore'

export function useJobApplications(userId: string | undefined) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [firestoreError, setFirestoreError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setApplications([])
      setLoading(false)
      return
    }
    setLoading(true)
    setFirestoreError(null)
    const unsubscribe = subscribeToApplications(
      userId,
      apps => {
        setApplications(apps)
        setLoading(false)
        setFirestoreError(null)
      },
      err => {
        setLoading(false)
        if (err.message.includes('permission') || err.message.includes('Missing or insufficient')) {
          setFirestoreError('permission-denied')
        } else {
          setFirestoreError(err.message)
        }
      }
    )
    return unsubscribe
  }, [userId])

  async function addApplication(data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!userId) return
    await fsAdd(userId, data)
  }

  async function updateApplication(
    id: string,
    data: Partial<Omit<JobApplication, 'id' | 'createdAt'>>
  ) {
    if (!userId) return
    await fsUpdate(userId, id, data)
  }

  async function deleteApplication(id: string) {
    if (!userId) return
    await fsDelete(userId, id)
  }

  return { applications, loading, firestoreError, addApplication, updateApplication, deleteApplication }
}
