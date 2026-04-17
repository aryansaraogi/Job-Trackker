# 🗂 Job Tracker

A full-featured job application tracker built with React, TypeScript, Firebase, and Tailwind CSS. Track every application, get reminders, upload resumes, and visualize your job search progress — all synced across devices.

---

## ✨ Features

### Core
- **Dashboard** — View all applications at a glance with status counts and filter by stage
- **Add / Edit Applications** — Modal form with validation for company, role, date, status, notes, and reminder date
- **Delete with Confirmation** — Prevents accidental deletions
- **Status Filtering** — Filter by All, Applied, Interview, Offer, or Rejected
- **Dark Mode** — Toggle between light and dark themes; preference saved across sessions

### Authentication
- **Email & Password Auth** — Sign up or log in via Firebase Authentication
- **Protected Dashboard** — All data is gated behind authentication
- **Per-user Data** — Each user sees only their own applications

### Cloud Sync
- **Real-time Firestore Sync** — Changes appear instantly across all devices via `onSnapshot`
- **Offline Support** — IndexedDB persistence keeps the app functional without internet
- **Secure Rules** — Firestore security rules enforce that users can only access their own data

### Resume Upload
- **Attach a Resume** — Upload PDF or DOCX files (max 5 MB) directly from the form
- **Upload Progress Bar** — Visual progress indicator during upload
- **📎 Link on Cards** — Quick access to the uploaded resume from the application card
- **Firebase Storage** — Files stored at `resumes/{userId}/{appId}/{filename}`

### Reminders
- **Reminder Date Field** — Set a follow-up date on any application
- **🔔 Badge** — Shown on cards when the reminder date is today or past and status is Applied or Interview
- **Daily Email Reminders** — Cloud Functions scaffold (see [Email Reminders setup](#email-reminders-setup)) sends emails via SendGrid at 08:00 UTC

### Analytics
- **KPI Cards** — Total applications, Response Rate, Offer Rate
- **Status Donut Chart** — Applications broken down by status (Recharts)
- **Weekly Bar Chart** — Applications submitted over the last 8 weeks (Recharts)
- **Empty State** — Prompts to add more data when fewer than 2 applications exist

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v3 (dark mode via `class`) |
| Routing | React Router v6 |
| Charts | Recharts |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| File Storage | Firebase Storage |
| Functions | Firebase Cloud Functions + SendGrid |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aryansaraogi/Job-Trackker.git
cd Job-Trackker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) and enable:
- **Authentication** → Email/Password
- **Firestore Database**
- **Storage**

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firestore security rules

```bash
firebase deploy --only firestore:rules
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── analytics/
│   │   ├── KPICards.tsx          # Total, Response Rate, Offer Rate cards
│   │   ├── StatusPieChart.tsx    # Donut chart by status
│   │   └── WeeklyBarChart.tsx    # Bar chart — last 8 weeks
│   ├── AuthModal.tsx             # Login / Sign Up modal
│   ├── FilterBar.tsx             # Status filter buttons
│   ├── Header.tsx                # Nav, dark mode toggle, logout
│   ├── JobCard.tsx               # Single application card
│   ├── JobFormModal.tsx          # Add / Edit form modal
│   ├── JobList.tsx               # Application list with empty state
│   ├── StatusBadge.tsx           # Coloured status pill
│   └── StatusSummary.tsx         # Count badges at top of dashboard
├── context/
│   └── AuthContext.tsx           # Auth state provider
├── hooks/
│   ├── useDarkMode.ts            # Dark mode toggle + persistence
│   └── useJobApplications.ts     # Firestore CRUD + real-time sync
├── pages/
│   └── AnalyticsPage.tsx         # Full analytics page
├── services/
│   ├── auth.ts                   # Firebase Auth wrappers
│   ├── firebase.ts               # Firebase app init
│   ├── firestore.ts              # Firestore CRUD helpers
│   └── storage.ts                # Resume upload / delete
├── types/
│   └── index.ts                  # JobApplication interface, Status type
├── utils/
│   └── storage.ts                # (legacy localStorage helpers)
├── App.tsx                       # Root component + routing
└── main.tsx                      # Entry point + AuthProvider
functions/
├── src/
│   └── index.ts                  # Cloud Function: daily email reminders
├── package.json
└── tsconfig.json
firestore.rules                   # Firestore security rules
```

---

## 📧 Email Reminders Setup

The `functions/` directory contains a Cloud Scheduler function that sends follow-up reminder emails daily at 08:00 UTC via SendGrid.

To enable it:

1. **Upgrade** your Firebase project to the **Blaze (pay-as-you-go)** plan
2. Run `firebase init functions` in the project root
3. Set your SendGrid API key:
   ```bash
   firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
   ```
4. Deploy the function:
   ```bash
   firebase deploy --only functions
   ```

---

## 🏗 Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready to deploy to Firebase Hosting, Vercel, Netlify, etc.

---

## 📄 License

MIT
