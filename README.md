# Reading List

Save, organize, and track your reading with a clean, minimal web app.

## Features

- **Bookmark any URL** with auto-fetched title, description, and thumbnail (OG metadata)
- **YouTube support** — video title and thumbnail via oEmbed API
- **Twitter/X support** — condensed tweet text and image via oEmbed + OG tags
- **Collections** — organize bookmarks into collections (Videos and Tweets created by default)
- **Auto-categorization** — YouTube and Twitter/X URLs automatically assigned to their collections
- **Priority levels** — urgent, high, normal, low with color-coded borders and sorting
- **Read/unread tracking** — mark bookmarks as read with visual indicators
- **Collapsible filters** — filter by collection, read status, priority; sort by date or priority
- **Dark/light mode** — toggle with localStorage persistence, dark mode by default
- **Public sharing** — share collections via public URL
- **Export** — download displayed URLs as a text file
- **OAuth login** — Google and GitHub authentication via Supabase

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL, Row Level Security, OAuth)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Metadata**: [Cheerio](https://cheerio.js.org) for OG tag parsing
- **Deployment**: [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

Run the schema migration against your Supabase project:

```bash
# Apply schema
psql -f supabase/migrations/001_schema.sql

# To reset (drops all tables)
psql -f supabase/drop_all.sql
```

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    (main)/          # Authenticated layout + dashboard
    api/             # REST endpoints (bookmarks, collections, metadata)
    auth/            # OAuth callback
    login/           # Login page
    share/[slug]/    # Public shared collections
  components/
    auth/            # Login buttons
    bookmarks/       # Card, list, filters, URL input, export, refresh
    collections/     # Tabs, menu
    layout/          # Header, sign-out, theme toggle
  lib/
    supabase/        # Client/server/middleware helpers
    utils/           # Metadata fetching, time formatting, priority config
  types/             # TypeScript interfaces
supabase/
  migrations/        # SQL schema
  drop_all.sql       # Reset script
```
