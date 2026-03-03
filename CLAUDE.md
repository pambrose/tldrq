# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Next.js 16 + Turbopack)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

Next.js 16 App Router with Supabase (PostgreSQL + OAuth) and Tailwind CSS v4.

### Server vs Client Components

Server components fetch data and pass it as props to client components. Client components handle interactivity and call `router.refresh()` after API mutations to trigger server re-evaluation.

- **Server**: `(main)/layout.tsx` (auth guard), `(main)/page.tsx` (data fetching), `share/[slug]/page.tsx`
- **Client** (`"use client"`): All interactive components — bookmark-card, url-input, filter-tabs, collection-tabs, collection-menu, theme-toggle, sign-out-button, refresh-button, export-button

### Auth Flow

1. **Proxy** (`src/proxy.ts`) runs `updateSession` on every request — refreshes session cookies, redirects unauthenticated users to `/login` (except `/login`, `/auth/*`, `/share/*`)
2. OAuth sign-in calls `supabase.auth.signInWithOAuth()` → redirects to provider → returns to `/auth/callback`
3. Callback exchanges code for session and creates default collections ("Videos", "Tweets", "Articles", "Repos") for the user
4. Two Supabase clients: `server.ts` (uses `await cookies()`, for server components/API routes) and `client.ts` (browser, for OAuth initiation)

### Metadata Fetching (`src/lib/utils/metadata.ts`)

URL metadata is fetched server-side during bookmark creation with a 5-second timeout:
- **YouTube**: oEmbed API for title + deterministic thumbnail URL
- **Twitter/X**: oEmbed for tweet text + parallel OG image fetch from page
- **GitHub**: REST API (`/repos/{owner}/{repo}`) for stars, forks, language, description, avatar
- **GitLab**: REST API (`/projects/{path}`) for stars, forks, topics, description, avatar
- **Other URLs**: Cheerio parses OG tags from HTML, falls back to `<title>` and meta description
- Returns nulls gracefully on failure — never blocks bookmark creation
- Non-repo GitHub/GitLab pages (profiles, orgs) fall back to generic OG scraping

### Auto-Categorization

YouTube/Vimeo/TikTok URLs → "Videos", Twitter/X URLs → "Tweets", GitHub/GitLab URLs → "Repos", all other URLs → "Articles" (find-or-create). Only when user hasn't explicitly chosen a collection.

### Dark Mode

Inline `<script>` in root layout reads `localStorage("theme")` before first paint to set `.dark` class. Tailwind v4 custom variant: `@custom-variant dark (&:where(.dark, .dark *))`. Dark is the default when no preference is saved.

### URL Search Params for Filtering

Dashboard reads `?collection=`, `?filter=`, `?priority=`, `?sort=` from URL. Client components use `useSearchParams()` + `router.push()` to update. Server component re-renders with filtered data.

### Priority System (`src/lib/utils/priority.ts`)

Four levels: urgent, high, normal, low. Database has a computed `priority_order` column for sorting. Each level has associated border colors and badge styles.

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- All API routes return `{ error: "message" }` on failure
- Row Level Security on all tables — users can only access their own data
- Public collections viewable by anonymous users via share slug
- `referrerPolicy="no-referrer"` on avatar images (Google blocks with referrer)
- `suppressHydrationWarning` on `<html>` due to theme script class mutation
- Version displayed in header, sourced from `package.json`

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Database

Two tables defined in `supabase/migrations/001_schema.sql`. Reset with `supabase/drop_all.sql`.

- **collections**: id, user_id, name, is_public, share_slug, created_at
- **bookmarks**: id, user_id, collection_id, url, title, description, image_url, site_name, repo_stars, repo_forks, repo_language, is_read, priority, priority_order (computed), created_at
