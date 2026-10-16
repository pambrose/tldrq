---
icon: lucide/bookmark
---

# tldrq

**The last tab you'll ever need.**

tldrq is a bookmark manager at [tldrq.com](https://tldrq.com) for the links you mean to get back to. Save a URL
and tldrq fetches its title, description and thumbnail. File it in a collection, give it a priority, mark it read
when you're done, find it again with search and filters, and share any filtered view with a link. A macOS desktop
app wraps the same site in a window of its own.

## Features

- **Save any link** by pasting it or [dragging it onto the page](user-guide/saving.md#drag-and-drop). tldrq
  [fetches its details](user-guide/saving.md#what-tldrq-fetches) automatically, with richer data for YouTube, X,
  Vimeo, TikTok, Spotify, Reddit, SoundCloud, Flickr, SlideShare and Instagram, and stars, forks and language for
  GitHub and GitLab repositories.
- **Collections**: four to start with (Videos, Tweets, Articles, Repos), as many more as you like, and
  [auto-categorization](user-guide/collections.md#auto-categorization) that files each link for you.
- **[Priorities and read status](user-guide/priorities.md)**: Urgent, High, Normal and Low, each with its own color,
  and a read/unread flag on every bookmark.
- **[Search, filters and sorting](user-guide/finding.md)** that combine, live in the page's URL, and survive the
  browser's Back button.
- **[Share links](user-guide/sharing.md)** for any filtered view. Viewers don't need an account.
- **[Bulk import](user-guide/import-export.md)** of every tab you have open, export to a text file, and bulk delete.
- **[A macOS desktop app](user-guide/desktop.md)** that signs in through your default browser.
- **Dark mode by default**, with a light theme a click away.

<div class="grid cards" markdown>

-   :lucide-log-in: **Getting Started**

    ---

    Sign in and take a tour of the dashboard.

    [:octicons-arrow-right-24: Start here](user-guide/index.md)

-   :lucide-share-2: **Sharing**

    ---

    Turn any filtered view into a public link.

    [:octicons-arrow-right-24: Share a view](user-guide/sharing.md)

-   :lucide-monitor: **Desktop App**

    ---

    tldrq in its own macOS window.

    [:octicons-arrow-right-24: Get the app](user-guide/desktop.md)

-   :lucide-layers: **Developer Guide**

    ---

    Architecture, setup, database, API and deployment.

    [:octicons-arrow-right-24: Read the internals](developer-guide/index.md)

</div>

## Two guides

The **[User Guide](user-guide/index.md)** is for people using tldrq.com and the desktop app: saving, organizing,
finding, sharing, importing and exporting bookmarks.

The **[Developer Guide](developer-guide/index.md)** is for people who run, deploy or change tldrq: the Next.js app,
its Supabase database and sign-in, the metadata fetcher, the API, the Electron wrapper, and how CI, releases and
deployment on Vercel work.

The source is on [GitHub](https://github.com/pambrose/tldrq). Every release is described in the
[Changelog](https://github.com/pambrose/tldrq/blob/master/CHANGELOG.md) and on the
[Releases](https://github.com/pambrose/tldrq/releases) page.
