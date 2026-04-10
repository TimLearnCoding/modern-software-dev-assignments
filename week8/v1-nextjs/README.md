# Job Library - V1 (Next.js + SQLite)

A job application tracker inspired by Apple's Book Store UI. Create job blocks for different categories, search for real job postings, and track your application progress.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite via Prisma ORM
- **Icons**: Lucide React
- **Job Data**: Arbeitnow API + Remotive API (free, no key required) + mock fallback

## Prerequisites

- Node.js 18+
- npm

## Setup & Run

```bash
# Install dependencies
npm install

# Generate Prisma client + create database
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Job Blocks**: Create categorized blocks (like books) for different job types
- **Real Job Search**: Fetches live job postings from free APIs (Arbeitnow, Remotive)
- **Resume Upload**: Upload a resume for keyword-based job matching
- **One-Click Apply**: Opens the external job page and auto-archives to "Applied"
- **Job Detail Modal**: LinkedIn-style popup with full job description
- **Auto-Refill**: Automatically searches for more jobs when count is low
- **CRUD**: Full create, read, update, delete for blocks and jobs

## Environment

No API keys required. The app uses free, public job search APIs by default with a mock data fallback.

## Known Issues / Deviations

- Resume parsing works best with `.txt` files; PDF parsing is basic (text extraction only)
- Job search quality depends on free API availability; mock data fills gaps automatically
- Single-user mode (no authentication)
