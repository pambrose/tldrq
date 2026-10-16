# tldrq documentation site — design

Date: 2026-10-15
Status: approved in conversation, awaiting spec review

## Goal

Publish thorough, accurate documentation for tldrq at **https://docs.tldrq.com**, built with
[Zensical](https://zensical.org), with dark mode as the default. One site serves two audiences:

- **Users** of tldrq.com and the macOS desktop app — how to save, organize, find, share, import and
  export bookmarks.
- **Developers** who run, deploy, or change tldrq — architecture, setup, database, auth, metadata
  fetching, API, desktop internals, CI and releases.

## Decisions

| Topic | Decision |
|---|---|
| Generator | Zensical, as a uv dev dependency, following the layout of the owner's other sites (jev4k is the reference) |
| Location | `website/tldrq/` (config + `docs/`), with `website/pyproject.toml` and `website/uv.lock` one level up |
| Audiences | Two top-level navigation tabs: **User Guide** and **Developer Guide** (`navigation.tabs`) |
| Dark mode | Default: the `slate` palette is listed first, `default` (light) second, with a toggle |
| Source of truth | The code. README, CLAUDE.md and `docs/*.md` are partly stale and are used only as leads; every claim is checked against `src/`, `supabase/`, `electron/` and `.github/` |
| Screenshots | None of the signed-in app (they would publish the owner's bookmarks and email). The login page may be shown. Flows are explained with Mermaid diagrams |
| Drift control | The full database schema is included from `supabase/schema.sql` with `pymdownx.snippets` rather than copied |
| Hosting | GitHub Pages via a `docs.yml` workflow, custom domain `docs.tldrq.com` |
| Deploy timing | Every push to master that touches the docs, plus manual runs (the app deploys continuously, so the docs follow it) |

## Information architecture

Navigation as defined in `zensical.toml` (paths relative to `website/tldrq/docs/`):

- **Home** — `index.md`: what tldrq is, a grid of feature cards, entry links to both guides and the
  desktop app.

### User Guide (`user-guide/`)

| Page | Content |
|---|---|
| `index.md` — Getting Started | Signing in with Google or GitHub, what happens on first sign-in (default collections), tour of the dashboard (URL input, filters, list, toolbar), version in the header |
| `saving.md` — Saving Bookmarks | Pasting a URL, collection choice vs Auto-categorize, priority on save, what metadata is fetched per site type (YouTube, X, Vimeo, TikTok, Spotify, Reddit, SoundCloud, Flickr, Instagram, SlideShare, GitHub, GitLab, everything else), repo stats, what happens when metadata can't be fetched |
| `collections.md` — Collections | The four default collections, auto-categorization rules, creating, renaming, deleting, moving bookmarks, Uncategorized, public/private |
| `priorities.md` — Priorities & Read Status | The four levels and their colors/badges, changing priority, read/unread and how it is shown |
| `finding.md` — Filtering, Search & Sorting | Filters panel, collection tabs, read-state and priority filters, search, sort orders, URL parameters (`collection`, `filter`, `priority`, `sort`, `search`) and bookmarking/sharing a filtered URL |
| `sharing.md` — Sharing | Public collections and share slugs, shared filtered views with custom titles, what anonymous viewers see, revoking |
| `import-export.md` — Import, Export & Bulk Actions | Bulk import (formats, limits, behavior), export of displayed URLs, delete all, refresh |
| `desktop.md` — Desktop App | What the macOS app is, building/running it, signing in through the system browser, external links, window behavior, signing out |
| `faq.md` — FAQ & Troubleshooting | Missing thumbnails, metadata not fetched, sign-in problems (desktop and web), session scope (sign-out is local), theme |

### Developer Guide (`developer-guide/`)

| Page | Content |
|---|---|
| `index.md` — Architecture | Stack and versions (from `package.json`), App Router layout, server vs client components, request lifecycle diagram (proxy → layout auth guard → page data fetch → client mutation → `router.refresh()`), directory map |
| `local-development.md` — Local Development | Prerequisites (Node version per `ci.yml`), Supabase project, `.env.local`, `npm run dev/build/start/lint`, building the docs site locally |
| `configuration.md` — Configuration | The three environment variables the code reads (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SLACK_WEBHOOK_URL`), Slack notifications, `next.config.ts` |
| `database.md` — Database | Tables (collections, bookmarks, shared views), columns, computed `priority_order`, indexes, Row Level Security policies, anonymous access to public collections, migrations and `drop_all.sql`, full schema included from `supabase/schema.sql` |
| `authentication.md` — Authentication | `proxy.ts` and `updateSession`, public paths, web OAuth flow and `/auth/callback` (default collection creation, Slack login notice), desktop OAuth hand-off (`/auth/login-desktop` → `/auth/callback-desktop` → local callback server → `/auth/desktop`) with a sequence diagram, local-scope sign-out, the two Supabase clients |
| `metadata.md` — Metadata Fetching | `fetchOGMetadata` dispatch, per-platform handlers (oEmbed, GitHub/GitLab REST, generic OG scraping), 5-second timeout, relative `og:image` resolution, failure behavior, how to add a platform |
| `api.md` — API Reference | Each route under `src/app/api/` with method, auth requirement, parameters/body, response shape, error responses (`{ error }`), and side effects |
| `frontend.md` — Frontend | Component map, URL search-param state, refresh context, theme script and Tailwind dark variant, priority utilities, conventions (path alias, `referrerPolicy`, `suppressHydrationWarning`) |
| `desktop.md` — Desktop App Internals | `electron/main.js` walkthrough (window, drag region, navigation and window-open handlers, local auth server), `npm start`, building a DMG with electron-builder, how it is (not) covered by CI |
| `deployment.md` — Deployment | Supabase project and schema, OAuth providers (Google, GitHub) and redirect URLs, Vercel project and env vars, preview vs production, verification checklist |
| `ci-releases.md` — CI, Dependencies & Releases | `ci.yml`, `docs.yml`, required checks and branch protection, Dependabot configuration and ignore rules, the release process (version bump PR, CHANGELOG/RELEASE_NOTES, tag and GitHub release conventions) |

### Links

- **Changelog** → `https://github.com/pambrose/tldrq/blob/master/CHANGELOG.md`
- **Releases** → `https://github.com/pambrose/tldrq/releases`

## Writing conventions

- Every factual statement comes from reading the code; behavior that could not be confirmed is left out
  rather than guessed.
- User Guide pages describe what a user sees and does, with no file paths. Developer Guide pages cite
  files (`src/...`) so readers can follow along.
- Mermaid for flows (request lifecycle, web OAuth, desktop OAuth, metadata dispatch). Admonitions for
  warnings and tips. Content tabs where a choice has variants (e.g. Google vs GitHub OAuth setup).
- No version numbers that will go stale, except where the version is the point (e.g. Node in CI).
- Internal links between pages so the site reads as one document; `--strict` builds keep them valid.

## Site configuration (`website/tldrq/zensical.toml`)

Based on jev4k's configuration:

- `site_name = "tldrq"`, description, `site_author = "Paul Ambrose"`, `site_url = "https://docs.tldrq.com/"`,
  `repo_url`/`repo_name` for `pambrose/tldrq`, `edit_uri = "edit/master/website/tldrq/docs/"`, copyright line.
- Features: jev4k's set plus `navigation.tabs` (and `navigation.tabs.sticky`).
- Palette: `slate` first (dark default, moon icon, "Switch to light mode"), then `default` (sun icon).
- Markdown extensions: `attr_list`, `md_in_html`, `admonition`, `tables`, `toc` (permalinks),
  `pymdownx.details`, `emoji`, `inlinehilite`, `highlight`, `tabbed`, `superfences` with Mermaid, and
  `snippets` with `base_path = ["../.."]` and `check_paths = true`.
- Social link to the GitHub repo. `docs/CNAME` contains `docs.tldrq.com`.

## Build and deploy

- `website/pyproject.toml`: replace the `uv init --package` template (its `uv_build` backend and `website`
  script expect a package that won't exist) with jev4k's shape — no build system, a `dev` dependency group
  containing `zensical`. Keep `website/.python-version` (3.13).
- `website/uv.lock` committed.
- `.gitignore`: add `website/.venv/`, `website/**/site/`, `website/**/.cache/`.
- Local: `cd website/tldrq && uv run zensical serve` (preview), `uv run --locked zensical build --clean --strict`
  (the CI build). Documented in the Developer Guide and a short README section.
- `.github/workflows/docs.yml`, modeled on jev4k's without Dokka:
  - Triggers: `pull_request` and `push` to master filtered to `website/**`, `supabase/schema.sql` and the
    workflow file; `workflow_dispatch`.
  - `docs` job: checkout with `persist-credentials: false`, `astral-sh/setup-uv` with caching off,
    strict build in `website/tldrq`, `upload-pages-artifact` only when deploying.
  - `deploy` job: on push to master or manual run, `deploy-pages` in the `github-pages` environment.
  - Least-privilege permissions per job; actions pinned by SHA to jev4k's versions.
  - Not added as a required check; branch protection is unchanged.

## One-time setup (outside the repo)

1. Enable GitHub Pages with the GitHub Actions source, custom domain `docs.tldrq.com`, HTTPS enforced
   (can be done with `gh api` once approved).
2. DNS: CNAME `docs` → `pambrose.github.io` (owner's DNS provider).

## Success criteria

- `uv run --locked zensical build --clean --strict` passes locally and in the `docs` workflow.
- Every page in the outline exists, renders in dark mode by default, and has no placeholder text.
- Spot checks of factual claims against the code find no contradictions (env vars, routes, default
  collections, auto-categorization rules, priority levels, URL parameters, auth flow steps).
- After setup, https://docs.tldrq.com serves the site.

## Out of scope

- Screenshots of the signed-in app.
- Generated API reference (TypeDoc).
- Editing or removing the stale `docs/actions.md` and `docs/vercel-setup.md`, and correcting README or
  CLAUDE.md (worth doing later; noted in the final report).
- Versioned docs, i18n, analytics, custom theme overrides.
