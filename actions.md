## Reading List Web App — Summary

### Design

A full-stack bookmark manager that lets authenticated users save URLs, preview them with Open Graph metadata (title,
image, description), organize them into collections, and track read/unread status.

**Stack:** Next.js 15 (App Router, TypeScript) + Supabase (Auth + Postgres with RLS) + Tailwind CSS + cheerio

**Architecture highlights:**

- **Server Components** fetch data directly via Supabase — no loading spinners or client-side waterfalls for the initial
  page render
- **Client Components** (`"use client"`) handle interactive elements: URL input, filter/collection tabs, bookmark
  actions, OAuth buttons
- **Route group `(main)/`** wraps authenticated pages in a shared layout with header/sign-out, while `/login` and
  `/share/*` remain outside it
- **Row Level Security** on Postgres enforces access control at the database layer — users can only read/modify their
  own data, and `anon` users can view public collections
- **OG metadata extraction** happens server-side at bookmark creation time using cheerio, with graceful fallbacks (
  `og:title` → `<title>` → URL)

**Database:** Two tables — `collections` (with optional public sharing via unique slug) and `bookmarks` (with nullable
`collection_id`, `ON DELETE SET NULL` so deleting a collection doesn't delete bookmarks)

### Actions Taken

| Phase                   | What was done                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1. Scaffolding**      | Initialized Next.js 15 with TypeScript/Tailwind, installed `@supabase/ssr`, `@supabase/supabase-js`, `cheerio`, created directory structure, updated `.gitignore`                                                                                                                                                                                                                      |
| **2. Database**         | Created `supabase/migrations/001_initial_schema.sql` with both tables, indexes, and 10 RLS policies                                                                                                                                                                                                                                                                                    |
| **3. Auth**             | Built Supabase browser/server clients, session-refreshing middleware (redirects unauth users to `/login`, exempts `/share/*`), OAuth callback route, login page with Google + GitHub buttons                                                                                                                                                                                           |
| **4. Bookmarks CRUD**   | Built `fetchOGMetadata()` utility, `GET/POST /api/bookmarks` (with collection + read/unread filtering), `PATCH/DELETE /api/bookmarks/[id]`                                                                                                                                                                                                                                             |
| **5. Collections CRUD** | Built slug generator, `GET/POST /api/collections`, `PATCH/DELETE /api/collections/[id]` (with public toggle + slug generation)                                                                                                                                                                                                                                                         |
| **6. UI**               | Built 10 components — header, sign-out button, URL input with collection dropdown, collection pill tabs with inline creation, filter tabs, bookmark card (OG image, clickable title, read toggle, overflow menu with move/delete), bookmark list with empty state, collection settings menu (rename, share toggle, copy URL, delete) — plus the main dashboard page composing them all |
| **7. Public sharing**   | Built `/share/[slug]` page with read-only bookmark cards, 404 for invalid/private slugs                                                                                                                                                                                                                                                                                                |

**Verification:** TypeScript type-check clean, ESLint clean (0 errors), production build passes with all 9 routes
correctly generated.

**Git:** All work committed on a feature branch in a `.worktrees/` isolated worktree, then fast-forward merged to
`master`. Worktree and feature branch cleaned up. Final repo has 3 commits on `master`.

**30 source files** total, matching the plan manifest exactly.
