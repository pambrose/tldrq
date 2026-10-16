---
icon: lucide/layers
---

# Architecture

tldrq is a Next.js App Router application backed by Supabase, deployed on Vercel. Server components read data;
client components handle interaction and write through a small JSON API. Postgres Row Level Security keeps every
user's data their own. A separate Electron wrapper turns the deployed site into a macOS app.

## Stack

- **[Next.js](https://nextjs.org) 16** with the App Router, **React 19** and **TypeScript**.
- **[Tailwind CSS](https://tailwindcss.com) 4**, through `@tailwindcss/postcss`, with a class-based dark variant.
- **[Supabase](https://supabase.com)**: Postgres, Auth (GitHub and Google OAuth) and Row Level Security, used
  through `@supabase/ssr` and `@supabase/supabase-js`.
- **[Cheerio](https://cheerio.js.org)** to parse HTML when fetching bookmark metadata.
- **ESLint 9** with `eslint-config-next`.
- **[Vercel](https://vercel.com)** hosts the app; Supabase hosts the database and auth.
- **[Electron](https://www.electronjs.org)** for the desktop app, in `electron/` with its own `package.json`
  (see [Desktop App Internals](desktop.md)).

The exact versions are the ones in `package.json`:

```json title="package.json"
--8<-- "package.json"
```

## Directory map

```text
src/
  app/
    (main)/            authenticated layout and the dashboard page
    api/               JSON route handlers: bookmarks, collections, metadata, shared-views
    auth/              OAuth callbacks and the desktop sign-in hand-off pages
    login/             sign-in page
    share/[slug]/      public share page
    layout.tsx         root layout (fonts, theme script)
    globals.css        Tailwind import and the dark variant
  components/
    auth/              sign-in buttons
    bookmarks/         saving bar, cards, list, filters, search, import, export, refresh
    collections/       collection pills and settings menu
    layout/            header, sign-out, theme toggle
    share-button.tsx   share dialog
  lib/
    supabase/          server, browser and proxy Supabase clients
    utils/             metadata, priority, slack, slug, time, ui, fade-collapse
  types/database.ts    Collection, Bookmark, SharedView
  proxy.ts             session refresh and sign-in redirect on every request
supabase/              schema.sql, migrations/, drop_all.sql
electron/              macOS desktop wrapper
website/               this documentation site
```

## Routes

| Path | Kind | Purpose |
|---|---|---|
| `/` | Server page | The dashboard (`src/app/(main)/page.tsx`) |
| `/login` | Page | Sign-in buttons |
| `/share/[slug]` | Server page | A public share link |
| `/auth/callback` | Route handler | Web OAuth callback |
| `/auth/callback-desktop` | Route handler | Desktop OAuth callback |
| `/auth/login-desktop` | Client page | Starts desktop sign-in in the system browser |
| `/auth/desktop` | Client page | Finishes desktop sign-in inside the app |
| `/api/bookmarks`, `/api/bookmarks/[id]` | Route handlers | Bookmark CRUD |
| `/api/collections`, `/api/collections/[id]` | Route handlers | Collection CRUD |
| `/api/metadata` | Route handler | Runs the metadata fetcher for a URL |
| `/api/shared-views` | Route handler | Creates share links |

The JSON endpoints are documented in the [API Reference](api.md), and the auth routes in
[Authentication](authentication.md).

## Server and client components

Server components fetch data and pass it down as props:

- `src/app/(main)/layout.tsx` is the auth guard: it calls `supabase.auth.getUser()`, redirects to `/login` when there's
  no user, and renders the header.
- `src/app/(main)/page.tsx` reads `collection`, `filter`, `priority`, `sort` and `search` from `searchParams`,
  queries the `collections` and `bookmarks` tables, and renders the dashboard.
- `src/app/share/[slug]/page.tsx` renders share links; `src/app/login/page.tsx` the sign-in page.
- `src/components/bookmarks/bookmark-list.tsx` and `src/components/layout/header.tsx` render on the server too.

Everything interactive is a client component (`"use client"`): `url-input`, `bookmark-card`,
`bookmark-card-readonly`, `bookmark-list-wrapper`, `bulk-import`, `import-button`, `export-button`,
`delete-all-button`, `refresh-button`, `refresh-context`, `filter-tabs`, `search-input`, `collection-tabs`,
`collection-menu`, `share-button`, `login-buttons`, `sign-out-button` and `theme-toggle`, plus the pages
`src/app/auth/desktop/page.tsx` and `src/app/auth/login-desktop/page.tsx`. [Frontend](frontend.md) maps them all.

## Request lifecycle

A page load passes through the proxy and the layout's guard before the page queries Supabase. A change made in the
browser goes through an API route, then `router.refresh()` re-runs the server components so the page shows the new
data.

``` mermaid
sequenceDiagram
    participant B as Browser
    participant P as proxy.ts
    participant L as (main)/layout.tsx
    participant G as (main)/page.tsx
    participant A as /api route handler
    participant S as Supabase
    B->>P: GET /
    P->>S: getUser() refreshes the session cookies
    P-->>B: redirect to /login if signed out
    P->>L: signed in
    L->>S: getUser()
    L->>G: render
    G->>S: select collections and bookmarks (RLS)
    G-->>B: HTML
    B->>A: fetch, e.g. PATCH /api/bookmarks/id
    A->>S: getUser(), then update (RLS)
    A-->>B: JSON
    B->>G: router.refresh()
    G->>S: select again
    G-->>B: updated page
```

## Data access and security

Every query runs as the signed-in user: the Supabase clients use the project's public anon key plus the user's
session cookies, so Postgres Row Level Security limits each user to their own rows. Route handlers also filter by
`user_id`, and anonymous visitors can read only what share links expose. Reads happen in server components; writes
go through the route handlers under `src/app/api`.

See [Database](database.md) for the tables and policies, and [Authentication](authentication.md) for sessions and
sign-in.

## Where to go next

- [Local Development](local-development.md): run it on your machine.
- [Configuration](configuration.md): environment variables and config files.
- [Deployment](deployment.md): Supabase, OAuth and Vercel.
