# Release Checklist Tool

A simple web application to help developers track their release process. Create releases, manage checklists, and monitor progress through an intuitive interface.

## Features

- 📋 **Create Releases** - Add new releases with name, due date, and optional notes
- ✅ **Track Progress** - Check off release steps (8 pre-defined steps)
- 📊 **Auto Status** - Status automatically updates: planned → ongoing → done
- ✏️ **Edit Notes** - Update additional information for any release
- 🗑️ **Delete Releases** - Remove releases you no longer need
- 📱 **Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Frontend & Backend:** Next.js 15 (App Router)
- **Database:** PostgreSQL (via Supabase)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel

## Live Demo

[Deploy your own and add the link here]

## Getting Started Locally

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to the SQL Editor in your Supabase dashboard
4. Run the following SQL to create the releases table:

```sql
CREATE TABLE releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planted' CHECK (status IN ('planned', 'ongoing', 'done')),
  additional_info TEXT,
  completed_steps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_releases_date ON releases(date DESC);
```

5. Go to Project Settings → API
6. Copy your project URL and anon/public key

### 2. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/release-checklist-tool.git
cd release-checklist-tool
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### `releases` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Release name (required) |
| `date` | TIMESTAMPTZ | Due date for the release (required) |
| `status` | TEXT | Auto-calculated: planned, ongoing, or done |
| `additional_info` | TEXT | Optional notes about the release |
| `completed_steps` | TEXT[] | Array of completed step names |
| `created_at` | TIMESTAMPTZ | Creation timestamp (auto) |
| `updated_at` | TIMESTAMPTZ | Last update timestamp (auto) |

### Release Steps

The following 8 steps are available for each release (hardcoded in the app):

1. Build completed
2. Tests passed
3. Documentation updated
4. Staging deployed
5. Code reviewed
6. Merge to main
7. Production deployed
8. Monitoring verified

### Status Logic

- **planned**: No steps completed
- **ongoing**: At least one step completed, but not all
- **done**: All steps completed

## API Endpoints

### `GET /api/releases`
Get all releases ordered by date (newest first).

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Release 1.0",
    "date": "2026-03-25T14:00:00.000Z",
    "status": "ongoing",
    "additional_info": "Important release for Q1",
    "completed_steps": ["Build completed", "Tests passed"],
    "created_at": "2026-03-22T10:00:00.000Z",
    "updated_at": "2026-03-22T11:30:00.000Z"
  }
]
```

### `POST /api/releases`
Create a new release.

**Request Body:**
```json
{
  "name": "Release 1.0",
  "date": "2026-03-25T14:00:00.000Z",
  "additional_info": "Optional notes"
}
```

**Response:** The created release object (same format as GET)

### `GET /api/releases/[id]`
Get a single release by ID.

**Response:** Single release object

### `PATCH /api/releases/[id]`
Update a release.

**Request Body (toggle a step):**
```json
{
  "toggle_step": "Build completed"
}
```

**Request Body (update additional info):**
```json
{
  "additional_info": "Updated notes"
}
```

**Request Body (set completed steps directly):**
```json
{
  "completed_steps": ["Build completed", "Tests passed"]
}
```

**Response:** Updated release object

### `DELETE /api/releases/[id]`
Delete a release.

**Response:**
```json
{
  "success": true
}
```

## Project Structure

```
release-checklist-tool/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── releases/
│   │   │       ├── route.ts          # GET all, POST create
│   │   │       └── [id]/route.ts     # GET one, PATCH update, DELETE
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Main page
│   ├── components/
│   │   ├── ReleaseCard.tsx           # Individual release display
│   │   └── NewReleaseModal.tsx       # Create release modal
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client
│   │   └── utils.ts                  # Utility functions
│   └── types/
│       └── release.ts                # TypeScript types
├── .env.local.example
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "Add New Project" → "Import Git Repository"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

## License

MIT

## Author

Built as an assignment project.
