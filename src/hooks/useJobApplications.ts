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

  useEffect(() => {
    if (!userId) {
      setApplications([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToApplications(userId, apps => {
      setApplications(apps)
      setLoading(false)
    })
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

  return { applications, loading, addApplication, updateApplication, deleteApplication }
}
