# tldrq.com

Save, organize, and track your reading with a clean, minimal web app.

## Features

- **Bookmark any URL** with auto-fetched title, description, and thumbnail (OG metadata)
- **Enhanced metadata** via oEmbed for: YouTube, Twitter/X, Vimeo, TikTok, Spotify, Reddit, SoundCloud, Flickr, SlideShare, and Instagram; via REST API for GitHub and GitLab repos (stars, forks, language)
- **Collections** — organize bookmarks into collections (Videos and Tweets created by default)
- **Auto-categorization** — YouTube, Vimeo, and TikTok URLs → Videos; Twitter/X URLs → Tweets; GitHub/GitLab URLs → Repos; all other URLs → Articles
- **Priority levels** — urgent, high, normal, low with color-coded borders and sorting
- **Read/unread tracking** — mark bookmarks as read with visual indicators
- **Collapsible filters** — filter by collection, read status, priority; sort by date or priority
- **Dark/light mode** — toggle with localStorage persistence, dark mode by default
- **Public sharing** — share collections via public URL or share filtered views with custom titles
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
# Apply full schema (drops and recreates all tables)
psql -f supabase/schema.sql
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

## Deploying to Vercel

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, paste and run the contents of `supabase/schema.sql`
3. Copy your **Project URL** and **anon public key** from Settings → API

### 2. Configure OAuth Providers

In the Supabase dashboard under Authentication → Providers:

**Google:**

1. Enable the Google provider
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. Set the authorized redirect URI to: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Paste the Client ID and Client Secret into Supabase

**GitHub:**

1. Enable the GitHub provider
2. Create an OAuth App in [GitHub Developer Settings](https://github.com/settings/developers)
3. Set the authorization callback URL to: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Paste the Client ID and Client Secret into Supabase

### 3. Deploy to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project → Import the repo
3. Add environment variables:
    - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
4. Deploy

### 4. Update Supabase Redirect URLs

Once you have your Vercel production URL (e.g. `https://reading-list-abc.vercel.app`):

1. In Supabase → Authentication → URL Configuration:
    - Set **Site URL** to your Vercel production URL
    - Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**
2. If you also want local dev to keep working, add `http://localhost:3000/auth/callback` to Redirect URLs as well

### 5. Verify

1. Visit your Vercel URL — you should be redirected to `/login`
2. Sign in with Google or GitHub
3. Save a bookmark, verify OG metadata appears
4. Create a collection, toggle it public, open the share URL in an incognito window

## Project Structure

```
src/
  app/
    (main)/          # Authenticated layout + dashboard
    api/             # REST endpoints (bookmarks, collections, metadata)
    auth/            # OAuth callback
    login/           # Login page
    share/[slug]/    # Public shared collections and filtered views
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
  schema.sql         # Combined database schema
  migrations/        # Individual migration files
```
