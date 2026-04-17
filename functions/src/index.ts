/**
 * Firebase Cloud Functions — Email Reminders
 *
 * Prerequisites before deploying:
 *  1. Upgrade Firebase project to Blaze (pay-as-you-go) plan
 *  2. Run `firebase init functions` in the project root
 *  3. Set SendGrid API key: `firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"`
 *  4. Deploy with: `firebase deploy --only functions`
 */

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as sgMail from '@sendgrid/mail'

admin.initializeApp()
const db = admin.firestore()

// Runs daily at 08:00 UTC
export const sendReminders = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('UTC')
  .onRun(async () => {
    const apiKey = functions.config().sendgrid?.key
    if (!apiKey) {
      console.error('SENDGRID_API_KEY not configured')
      return
    }
    sgMail.setApiKey(apiKey)

    const today = new Date().toISOString().slice(0, 10)

    const usersSnap = await db.collection('users').listDocuments()

    for (const userRef of usersSnap) {
      const userDoc = await userRef.get()
      const userEmail = userDoc.data()?.email as string | undefined
      if (!userEmail) continue

      const appsSnap = await userRef
        .collection('applications')
        .where('reminderDate', '<=', today)
        .where('status', 'in', ['Applied', 'Interview'])
        .get()

      for (const appDoc of appsSnap.docs) {
        const app = appDoc.data()
        await sgMail.send({
          to: userEmail,
          from: 'noreply@jobtracker.app',
          subject: `Reminder: Follow up on ${app.role} at ${app.company}`,
          text: `Hi,\n\nThis is a reminder to follow up on your application for ${app.role} at ${app.company} (applied ${app.dateApplied}).\n\nGood luck!\n\nJob Tracker`,
        })
      }
    }
  })
