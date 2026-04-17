export type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected'

export interface JobApplication {
  id: string
  company: string
  role: string
  dateApplied: string
  status: Status
  notes?: string
  resumeUrl?: string
  reminderDate?: string
  userId: string
  createdAt: string
  updatedAt: string
}
