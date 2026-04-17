import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTaskSnapshot,
} from 'firebase/storage'
import { storage } from './firebase'

export function uploadResume(
  userId: string,
  appId: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `resumes/${userId}/${appId}/${file.name}`)
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap: UploadTaskSnapshot) => {
        onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export async function deleteResume(userId: string, appId: string, filename: string): Promise<void> {
  const storageRef = ref(storage, `resumes/${userId}/${appId}/${filename}`)
  await deleteObject(storageRef)
}
