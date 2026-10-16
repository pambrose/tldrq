---
icon: lucide/layout-dashboard
---

# Frontend

The UI is one server-rendered dashboard with interactive pieces layered on as client components. Filter state
lives in the URL; changes go through the API and end in `router.refresh()`.

## Dashboard composition

`src/app/(main)/page.tsx` renders, top to bottom:

1. `UrlInput`: the saving bar.
2. A `<details>` element labeled "Filters", open whenever any filter parameter is set, containing `SearchInput`,
   `CollectionTabs` (with `CollectionMenu` beside it when a real collection is selected) and `FilterTabs`.
3. Inside `RefreshProvider`:
    - the bookmark count and the toolbar: `DeleteAllButton` (given the displayed IDs), `ImportButton`,
      `ExportButton` (given the displayed URLs), `ShareButton` and `RefreshButton`;
    - `BookmarkListWrapper` around `BookmarkList`, which renders a `BookmarkCard` per bookmark.

## Component map

| File (under `src/components/`) | Kind | Role |
|---|---|---|
| `auth/login-buttons.tsx` | Client | GitHub and Google buttons; hands sign-in to the system browser in Electron; shows sign-in errors |
| `bookmarks/url-input.tsx` | Client | Save form with collection and priority menus; page-wide drag and drop |
| `bookmarks/bookmark-list.tsx` | Server | Empty state, or the list of cards |
| `bookmarks/bookmark-list-wrapper.tsx` | Client | Fades the list while a refresh is pending |
| `bookmarks/bookmark-card.tsx` | Client | A card with read toggle, ⋮ menu (priority, move) and delete |
| `bookmarks/bookmark-card-readonly.tsx` | Client | The share page's card |
| `bookmarks/priority-badge.tsx` | No directive (rendered inside client cards) | Badge for non-normal priorities |
| `bookmarks/repo-stats.tsx` | No directive (inside client cards) | Stars, forks and language |
| `bookmarks/filter-tabs.tsx` | Client | Filter, Priority and Sort pill rows |
| `bookmarks/search-input.tsx` | Client | Debounced search box |
| `bookmarks/import-button.tsx` | Client | Opens the bulk import dialog |
| `bookmarks/bulk-import.tsx` | Client | The bulk import dialog |
| `bookmarks/export-button.tsx` | Client | Downloads `bookmarks.txt` |
| `bookmarks/delete-all-button.tsx` | Client | Deletes the displayed bookmarks |
| `bookmarks/refresh-button.tsx` | Client | The refresh icon |
| `bookmarks/refresh-context.tsx` | Client | `RefreshProvider` and `useRefresh` |
| `collections/collection-tabs.tsx` | Client | Collection pills and **+ New** |
| `collections/collection-menu.tsx` | Client | Rename and delete for the selected collection |
| `layout/header.tsx` | Server | Header with version, user, links and buttons |
| `layout/sign-out-button.tsx` | Client | Local-scope sign-out |
| `layout/theme-toggle.tsx` | Client | Dark/light switch |
| `share-button.tsx` | Client | The share dialog |

## URL state

The URL is the single source of filter state. `FilterTabs` and `CollectionTabs` copy `useSearchParams()`, set or
delete one key, and call `router.push("/?" + params)`. `SearchInput` waits 300 ms after the last keystroke before
pushing, and re-syncs its text from the URL when the user goes back or forward. Each push re-renders the server
page, which reads `searchParams` and queries Supabase with those filters (the parameters are listed in the User
Guide's [URL parameters](../user-guide/finding.md#url-parameters)).

## Mutations and refresh

Components call an `/api/*` route with `fetch` and, on success, `router.refresh()`, which re-runs the server
components and swaps in fresh data without losing client state. Card actions report failures with `alert()`;
`UrlInput` shows the API's `error` message above the field.

- **Delete** runs `fadeCollapse` (`src/lib/utils/fade-collapse.ts`: slide right and fade out over 300 ms, then
  collapse height, margins and padding over 250 ms) at the same time as the `DELETE` request.
- **Delete displayed** (`DeleteAllButton`) deletes one ID at a time, one request each.
- **Refresh**: `RefreshProvider` (`refresh-context.tsx`) wraps `router.refresh()` in `useTransition` and keeps
  `isPending` true for at least 600 ms. `RefreshButton` spins while it's pending, and `BookmarkListWrapper` fades
  the list to `opacity-0`.

## Drag and drop

`UrlInput` attaches `dragenter`, `dragover`, `dragleave` and `drop` listeners to `document`, so a link can be
dropped anywhere on the page. It counts enter and leave events to show the overlay only while something is
over the page. On drop it takes the first line of `text/uri-list` that starts with `http`, else `text/plain` if
that starts with `http://` or `https://`, and saves it.

## Theme

- An inline script in the `<head>` of `src/app/layout.tsx` adds the `dark` class to `<html>` unless
  `localStorage.theme` is `"light"` (and also when reading storage fails), before the first paint. Dark is
  therefore the default.
- `<html>` has `suppressHydrationWarning`, because that script changes its `class` before React hydrates.
- `ThemeToggle` reads the class after mounting and renders nothing until then, so server and client markup agree.
  Clicking it toggles the class and stores `"dark"` or `"light"` in `localStorage`.
- `src/app/globals.css` declares Tailwind v4's class-based variant:
  `@custom-variant dark (&:where(.dark, .dark *));`.

## Priority utilities

`src/lib/utils/priority.ts` is shared by the cards, the filters, the saving bar and the API's validation:

| Export | Holds |
|---|---|
| `PRIORITY_LEVELS` | `["urgent", "high", "normal", "low"]`, in order; also defines the `Priority` type |
| `PRIORITY_ORDER` | 0 to 3, mirrored by the database's `priority_order` column |
| `PRIORITY_LABELS` | "Urgent", "High", "Normal", "Low" |
| `PRIORITY_BORDER` | Left-border classes; `normal` is empty, so the card falls back to the blue unread border |
| `PRIORITY_BADGE` | Badge color classes |

## Small utilities

- `src/lib/utils/ui.ts`: `pillClass(active)` (the pill buttons' classes), `getDisplayUrl(url)` (the hostname
  shown on cards) and `resolveImageUrl(src, pageUrl)` (see [Metadata Fetching](metadata.md#images)).
- `src/lib/utils/time.ts`: `timeAgo(date)`, giving `just now`, then minutes, hours, days, months (of 30 days) and
  years: `5m ago`, `3h ago`, `2d ago`, `4mo ago`, `1y ago`.
- `formatCount` in `repo-stats.tsx` shortens counts to `1.2k` and `1.2m`.

## Conventions

- The path alias `@/*` maps to `src/*`.
- The header and the sign-in page show the version by importing `version` from `package.json`.
- Avatars use `referrerPolicy="no-referrer"`: Google's avatar host refuses requests that carry a referrer.
- Thumbnails are plain `<img>` elements (not `next/image`, since they come from any domain) that hide themselves
  `onError`.
- Outbound links use `target="_blank" rel="noopener noreferrer"`.
- Geist and Geist Mono are loaded with `next/font/google` and assigned to Tailwind's `--font-sans` and
  `--font-mono`, but `src/app/globals.css` sets `body { font-family: Arial, Helvetica, sans-serif; }` and no
  component uses `font-sans` or `font-mono`, so body text renders in Arial rather than Geist.
