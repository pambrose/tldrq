# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Dates are the commit date of each tag. Releases 0.1.0 through 0.2.8 were published
to GitHub retroactively on 2026-04-18, so their GitHub publish timestamps do not
reflect when the work landed.

Versions 0.1.2 and 0.1.4 were never released.

For the release notes exactly as published, see [RELEASE_NOTES.md](RELEASE_NOTES.md).

## [0.2.9] - 2026-08-01

Maintenance release. No user-facing feature changes.

### Added

- GitHub Actions CI workflow running lint and build on pull requests and pushes to `master`
- `Lint and build` as a required status check on `master`, with admin bypass retained

### Changed

- Next.js 16.1.6 → 16.2.12; React and React DOM 19.2.5 → 19.2.8
- `@supabase/ssr` 0.10.2 → 0.12.3 — 47 commits upstream, concentrated in cookie handling
- `@supabase/supabase-js` 2.103.0 → 2.110.8
- TypeScript 5.9.3 → 6.0.3
- `@types/node` 25 → 26, matching the Node 26 runtime
- Tailwind CSS 4.2.1 → 4.3.3; ESLint 9.39.3 → 9.39.5

### Fixed

- `fade-collapse.ts`: the two deliberate forced reflows are now written as
  `void element.offsetHeight`, preserving the layout flush while making the intent
  legible to the linter
- Cleared all outstanding lint problems; `npm run lint` now exits clean

### Removed

- `@types/cheerio`, a stub package — cheerio 1.x ships its own type definitions

### Known limitations

- TypeScript 7 and ESLint 10 are blocked upstream: `typescript-eslint` does not yet
  support TS 7, and `eslint-config-next` bundles plugins capped at ESLint 9

## [0.2.8] - 2026-04-17

### Added

- Electron desktop app with OAuth deep-link auth flow
- Desktop app build instructions in the README
- Electron dev icon and lockfile
- Header on the login page, including the version display
- Combined `schema.sql` alongside updated docs
- README badges

### Changed

- Renamed the package to `tldrq`
- Share dialog converted to a centered modal with a title and close button
- Bulk import rendered as a modal dialog, preventing icon bar layout shift
- Bulk import shows browser tab gathering instructions by default, replacing
  collapsible details with static content
- Import moved to an icon button next to download in the toolbar
- Import and export icons swapped; both tooltips updated
- Bookmark list fades out during refresh
- Login header structure matched to the authenticated header layout

### Fixed

- Desktop OAuth now redirects via HTTPS instead of a custom protocol
- Electron OAuth starts the flow in the system browser for PKCE
- Local HTTP server used for Electron OAuth token handoff
- Stale browser session cleared before the desktop OAuth flow
- Desktop auth pages wrapped in Suspense for `useSearchParams`
- Electron window drag behavior on navigation
- Suppressed legitimate set-state-in-effect lint errors

## [0.2.7] - 2026-03-10

### Added

- Shared views with custom titles and search
- Custom favicon and Apple Touch Icon

### Changed

- Gold header text in dark mode
- Cache-busting query param on the favicon link
- Tooltip copy updates

## [0.2.6] - 2026-03-10

### Changed

- Bookmark creation message now mentions drag-and-drop support

## [0.2.5] - 2026-03-10

### Added

- Drag-and-drop URL support for bookmark creation
- Tooltips on the save and import buttons

### Changed

- Branding updated from "Reading List" to "tldrq.com" across the app and documentation
- Delete animation changed to slide-right then collapse
- Swapped the order of "Set priority" and "Move to collection" in the overflow menu

## [0.2.4] - 2026-03-04

### Changed

- Replaced the disintegrate animation with fade and collapse on bookmark delete

## [0.2.3] - 2026-03-03

### Added

- Tooltips on toolbar buttons
- Browser tab URL export instructions in bulk import, shown per operating system
- URL input field auto-focuses on page load

### Changed

- Delete moved from the overflow menu to a trash icon on the card
- Menu and delete icons aligned
- Delete animation and API call now run concurrently

## [0.2.2] - 2026-03-03

### Added

- Disintegration animation on bookmark delete

## [0.2.1] - 2026-03-03

### Added

- Bulk delete button for displayed bookmarks

### Changed

- Slack login notification includes the OAuth provider
- Save button moved before the collection dropdown
- Timezone suffix removed from the Slack login timestamp

## [0.2.0] - 2026-03-03

### Added

- Local timestamp in the Slack login notification

### Fixed

- Slack login timestamp now renders on the same line

## [0.1.9] - 2026-03-03

### Added

- Auth error message shown on the login page

## [0.1.8] - 2026-03-03

### Added

- Bulk URL import from `.txt` files
- URL format validation, flagging invalid URLs on import
- Visual feedback during bookmark deletion, plus a delete animation

### Changed

- Slack notification moved from bookmark creation to user login
- Shared helpers extracted; mutation error handling added
- Parenthetical removed from bulk import instructions

### Fixed

- Slack webhook awaited to prevent serverless runtime termination

## [0.1.7] - 2026-03-03

### Added

- Slack notification on bookmark creation
- Error logging for the Slack webhook

### Fixed

- Duplicate bookmark URLs prevented, with an error message

## [0.1.6] - 2026-03-03

### Added

- Rich GitHub and GitLab repo metadata: stars, forks, and language
- Repos default collection with GitHub/GitLab auto-categorization
- oEmbed support for Vimeo, TikTok, Spotify, Reddit, SoundCloud, Flickr,
  SlideShare, and Instagram
- Export button to download displayed URLs as a text file
- Bookmark count and refresh button above the list
- GitHub icon link in the header
- `CLAUDE.md`, `llms.txt`, `drop_all.sql`, and Vercel deployment instructions

### Changed

- Articles is now the default collection for uncategorized URLs
- GitHub OAuth button moved above Google on the login page
- SQL migrations consolidated into a single schema file
- Docs moved to a `docs/` folder
- Spin animation on the refresh button when clicked
- User name and email aligned left in the header

### Fixed

- Tweet thumbnail fetched from the OG image tag

## [0.1.5] - 2026-03-02

### Added

- Four-level priority system for bookmarks
- Collection badge on bookmark cards, with the current collection highlighted in the menu
- User name and avatar from the OAuth provider shown in the header

### Changed

- Dark mode is now the default theme
- Collections and Filters grouped into a single collapsible section

## [0.1.3] - 2026-03-02

### Added

- Twitter/X tweet display
- Auto-collection for tweets and videos

### Changed

- Collections sorted alphabetically
- Version display moved to the header, next to the app title

## [0.1.1] - 2026-03-02

### Added

- Light/dark mode toggle with `localStorage` persistence
- Version footer
- Deployment documentation for Vercel and Supabase

### Changed

- YouTube oEmbed API used for reliable video titles and thumbnails

## [0.1.0] - 2026-03-02

### Added

- Initial implementation of the Reading List web app

[0.2.9]: https://github.com/pambrose/tldrq/compare/0.2.8...0.2.9
[0.2.8]: https://github.com/pambrose/tldrq/compare/0.2.7...0.2.8
[0.2.7]: https://github.com/pambrose/tldrq/compare/0.2.6...0.2.7
[0.2.6]: https://github.com/pambrose/tldrq/compare/0.2.5...0.2.6
[0.2.5]: https://github.com/pambrose/tldrq/compare/0.2.4...0.2.5
[0.2.4]: https://github.com/pambrose/tldrq/compare/0.2.3...0.2.4
[0.2.3]: https://github.com/pambrose/tldrq/compare/0.2.2...0.2.3
[0.2.2]: https://github.com/pambrose/tldrq/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/pambrose/tldrq/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/pambrose/tldrq/compare/0.1.9...0.2.0
[0.1.9]: https://github.com/pambrose/tldrq/compare/0.1.8...0.1.9
[0.1.8]: https://github.com/pambrose/tldrq/compare/0.1.7...0.1.8
[0.1.7]: https://github.com/pambrose/tldrq/compare/0.1.6...0.1.7
[0.1.6]: https://github.com/pambrose/tldrq/compare/0.1.5...0.1.6
[0.1.5]: https://github.com/pambrose/tldrq/compare/0.1.3...0.1.5
[0.1.3]: https://github.com/pambrose/tldrq/compare/0.1.1...0.1.3
[0.1.1]: https://github.com/pambrose/tldrq/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/pambrose/tldrq/commits/0.1.0
