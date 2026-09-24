# Accident & Incident Tracking System (AITS) — Next.js 14 + MongoDB Edition

A modern, enterprise-grade **Workplace Safety & Incident Tracking System** built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

---

## 🌟 Key Features

1. **Dashboard & Safety Analytics**
   - KPI metrics: Total Logs, Active Opened Cases, Day Shift vs Night Shift Breakdown, Filed This Year, Personnel with Multi-Incidents.
   - Live Recent Safety Event Feed and High Frequency Personnel Risk Analytics.

2. **Incidents Master Register**
   - Live multi-field search and filters by Year, Shift, Status, Type, and Category.
   - Interactive Modal for viewing incident details, risk profile, updating case status, and managing PDF attachments (upload, download, delete).

3. **Employee Master Register**
   - Full contractor and employee database (Emp No, National ID/Passport, Employer Name, Role, Department).
   - Risk classification badges (`High Risk`, `Medium Risk`, `Low Risk`, `None`).
   - Interactive Historical Safety Log Index drawer per employee.

4. **File New Incident Form**
   - Multi-field filing with employee profile preview.
   - Drag & Drop PDF document attachments (Statement, Incident Report, Investigation Report, Other).

5. **Safety Reports & CSV Export**
   - Metrics split by shift pattern and operational risk categories.
   - One-click CSV export and print-optimized ledger layout.

---

## 🚀 Quick Start

### 1. Requirements
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/accident_tracking_db`) or MongoDB Atlas URI.

### 2. Setup Environment Variables
Edit `.env.local` in the project root:
```env
MONGODB_URI=mongodb://localhost:27017/accident_tracking_db
```
*(Note: If no MongoDB URI is reachable, the application seamlessly uses memory store fallback with pre-seeded sample data).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
aits-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Main layout with Header & Sidebar
│   │   ├── page.tsx              # Dashboard page
│   │   ├── incidents/page.tsx     # Incidents Master Register
│   │   ├── employees/page.tsx     # Employee Master Register
│   │   ├── log/page.tsx           # File New Incident Report form
│   │   ├── reports/page.tsx       # Safety Reports & Analytics
│   │   └── api/
│   │       ├── employees/route.ts # Employees REST API (GET, POST)
│   │       ├── employees/[id]/route.ts # Employee PUT & DELETE
│   │       ├── incidents/route.ts # Incidents REST API (GET, POST)
│   │       └── incidents/[id]/route.ts # Incident PUT & DELETE
│   ├── components/
│   │   ├── Sidebar.tsx           # Modern navigation sidebar
│   │   ├── Header.tsx            # Top header with dark mode toggle
│   │   ├── IncidentModal.tsx     # Incident detail & doc manager modal
│   │   └── EmployeeFormModal.tsx # Employee create/edit modal
│   ├── models/
│   │   ├── Employee.ts           # Mongoose Employee Model
│   │   └── Incident.ts           # Mongoose Incident Model
│   ├── lib/
│   │   ├── mongodb.ts            # Mongoose cached connection helper
│   │   └── seedData.ts           # Initial realistic sample dataset
│   └── types/
│       └── index.ts              # Shared TypeScript interfaces
├── .env.local
├── package.json
└── README.md
```
