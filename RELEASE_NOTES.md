# Release Notes

Verbatim release notes as published on GitHub, newest first.
For a curated, categorized history see [CHANGELOG.md](CHANGELOG.md).

Dates are the commit date of each tag. Releases 0.1.0 through 0.2.8 were
published to GitHub retroactively on 2026-04-18, so their GitHub publish
timestamps do not reflect when the work landed.

Versions 0.1.2 and 0.1.4 were never released.

---

## v0.2.9 — 2026-08-01

Maintenance release. No user-facing feature changes — this is a dependency refresh plus the repo's first CI setup.

### Dependencies

- **Next.js** 16.1.6 → 16.2.12, **React** / **React DOM** 19.2.5 → 19.2.8
- **@supabase/ssr** 0.10.2 → 0.12.3 — 47 commits upstream, concentrated in cookie handling
- **@supabase/supabase-js** 2.103.0 → 2.110.8
- **TypeScript** 5.9.3 → 6.0.3
- **@types/node** 25 → 26, matching the Node 26 runtime
- **Tailwind CSS** 4.2.1 → 4.3.3, **ESLint** 9.39.3 → 9.39.5
- Removed **@types/cheerio**, a stub package — cheerio 1.x ships its own type definitions

### Tooling

- Added a GitHub Actions CI workflow running lint and build on pull requests and pushes to `master`
- Made `Lint and build` a required status check on `master`, with admin bypass retained
- Cleared all outstanding lint problems; `npm run lint` now exits clean

### Fixes

- `fade-collapse.ts`: the two deliberate forced reflows are now written as `void element.offsetHeight`, preserving the layout flush while making the intent legible to the linter

### Known limitations

TypeScript 7 and ESLint 10 are both blocked upstream. `typescript-eslint` does not yet support TS 7 ([typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)), and `eslint-config-next` bundles plugins capped at ESLint 9.

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.8...0.2.9

---

## v0.2.8 — 2026-04-17

### Changes

- Rename package to tldrq, bump to 0.2.8, add README badges (#4)
- Update import and export button tooltips
- Swap import and export icons and update export tooltip
- Convert share dialog to centered modal with title
- Add close button to share popup dialog
- Render bulk import as modal dialog to prevent icon bar layout shift
- Replace collapsible details with static content in bulk import
- Show browser tab gathering instructions by default in bulk import
- Fade out bookmark list during refresh
- Move import to icon button next to download in toolbar
- Match login header structure to authenticated header layout
- Add gap between title and version in login header
- Add version to login page header
- Add header to login page and fix Electron drag on navigation
- Add desktop app build instructions to README
- Add Electron dev icon and lockfile
- Clear stale browser session before desktop OAuth flow
- Use local HTTP server for Electron OAuth token handoff
- Fix desktop OAuth: redirect via HTTPS instead of custom protocol
- Wrap desktop auth pages in Suspense for useSearchParams
- Fix Electron OAuth by starting flow in system browser for PKCE
- Add Electron desktop app with OAuth deep-link auth flow
- Add combined schema.sql and update docs
- Suppress legitimate set-state-in-effect lint errors

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.7...0.2.8

---

## v0.2.7 — 2026-03-10

### Changes

- Add shared views with custom titles, search, and tooltip updates
- Add cache-busting query param to favicon link
- Add Apple Touch Icon and refine favicon colors
- Add custom favicon and gold header text in dark mode

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.6...0.2.7

---

## v0.2.6 — 2026-03-10

### Changes

- Bump version to 0.2.6
- Refine bookmark creation message to mention drag-and-drop support

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.5...0.2.6

---

## v0.2.5 — 2026-03-10

### Changes

- Bump version to 0.2.5
- Add drag-and-drop URL support for bookmark creation
- Update branding from "Reading List" to "tldrq.com" across app and documentation
- Add tooltip to save button
- Add tooltip to import button
- Change delete animation to slide-right then collapse
- Swap order of Set priority and Move to collection in overflow menu

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.4...0.2.5

---

## v0.2.4 — 2026-03-04

### Changes

- Replace disintegrate animation with fade+collapse on bookmark delete, bump to 0.2.4 (#3)

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.3...0.2.4

---

## v0.2.3 — 2026-03-03

### Changes

- Add tooltips to toolbar buttons, align menu/delete icons, bump to 0.2.3
- Move delete button from overflow menu to trash icon on card
- Show OS-specific browser tab export instructions in bulk import
- Add browser tab URL export instructions to bulk import
- Auto-focus URL input field on page load
- Run delete animation and API call concurrently

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.2...0.2.3

---

## v0.2.2 — 2026-03-03

### Changes

- Add disintegration animation on bookmark delete, bump to 0.2.2

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.1...0.2.2

---

## v0.2.1 — 2026-03-03

### Changes

- Add bulk delete button for displayed bookmarks (#2)
- Include OAuth provider in Slack login notification
- Move Save button before collection dropdown
- Remove timezone suffix from Slack login timestamp

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.2.0...0.2.1

---

## v0.2.0 — 2026-03-03

### Changes

- Fix Slack login timestamp on same line, bump to 0.2.0
- Include local timestamp in Slack login notification

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.9...0.2.0

---

## v0.1.9 — 2026-03-03

### Changes

- Show auth error message on login page

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.8...0.1.9

---

## v0.1.8 — 2026-03-03

### Changes

- Add delete animation and bump version to 0.1.8
- Validate URL format and flag invalid URLs on import
- Remove parenthetical from bulk import instructions
- Refactor: extract shared helpers, add mutation error handling
- Move Slack notification from bookmark creation to user login
- Add bulk URL import from .txt files
- Add visual feedback during bookmark deletion
- Reapply "Await Slack webhook to fix serverless runtime termination"
- Revert "Await Slack webhook to fix serverless runtime termination"
- Await Slack webhook to fix serverless runtime termination

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.7...0.1.8

---

## v0.1.7 — 2026-03-03

### Changes

- Bump version to 0.1.7
- Add error logging to Slack webhook for debugging
- Prevent duplicate bookmark URLs with error message
- Add Slack notification on bookmark creation (#1)

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.6...0.1.7

---

## v0.1.6 — 2026-03-03

### Changes

- Make Articles the default collection for uncategorized URLs
- Move GitHub OAuth button above Google on login page
- Add rich GitHub/GitLab repo metadata (stars, forks, language)
- Add Repos default collection with GitHub/GitLab auto-categorization
- Add Vercel deployment instructions to README and Articles default collection
- Add oEmbed support for Vimeo, TikTok, Spotify, Reddit, SoundCloud, Flickr, SlideShare, and Instagram
- Add GitHub icon link to header
- Add CLAUDE.md, move docs to docs/ folder
- Update README, add llms.txt and drop_all.sql
- Consolidate SQL migrations into a single schema file
- Add export button to download displayed URLs as text file
- Add spin animation to refresh button on click
- Add bookmark count and refresh button above list
- Align user name and email to the left in header
- Fetch tweet thumbnail from OG image tag

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.5...0.1.6

---

## v0.1.5 — 2026-03-02

### Changes

- Show collection badge on bookmark cards and highlight current in menu
- Display user name and avatar from OAuth provider in header
- Make dark mode the default theme
- Group Collections and Filters into a single collapsible section
- Add 4-level priority system for bookmarks

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.3...0.1.5

---

## v0.1.3 — 2026-03-02

### Changes

- Sort collections alphabetically and bump to 0.1.3
- Add Twitter/X tweet display and auto-collection for tweets and videos
- Move version display to header next to app title

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.1...0.1.3

---

## v0.1.1 — 2026-03-02

### Changes

- Add version footer and bump to 0.1.1
- Use YouTube oEmbed API for reliable video titles and thumbnails
- Add light/dark mode toggle with localStorage persistence
- Update .gitignore and add deployment documentation for Vercel and Supabase

**Full Changelog**: https://github.com/pambrose/tldrq/compare/0.1.0...0.1.1

---

## v0.1.0 — 2026-03-02

### Changes

- Implement Reading List web app
- Add .worktrees to .gitignore
- Initial commit with .gitignore

**Full Changelog**: https://github.com/pambrose/tldrq/commits/0.1.0

