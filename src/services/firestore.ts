import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { JobApplication } from '../types'

function appsCollection(userId: string) {
  return collection(db, 'users', userId, 'applications')
}

export function subscribeToApplications(
  userId: string,
  callback: (apps: JobApplication[]) => void
): Unsubscribe {
  const q = query(appsCollection(userId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snapshot => {
    const apps = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as JobApplication[]
    callback(apps)
  })
}

export async function addApplication(
  userId: string,
  data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(appsCollection(userId), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateApplication(
  userId: string,
  appId: string,
  data: Partial<Omit<JobApplication, 'id' | 'createdAt'>>
): Promise<void> {
  const ref = doc(db, 'users', userId, 'applications', appId)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteApplication(userId: string, appId: string): Promise<void> {
  const ref = doc(db, 'users', userId, 'applications', appId)
  await deleteDoc(ref)
}
