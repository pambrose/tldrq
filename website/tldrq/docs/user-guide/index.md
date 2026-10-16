---
icon: lucide/log-in
---

# Getting Started

tldrq keeps the links you mean to come back to. This page covers signing in, what's waiting for you the first
time, and a tour of the dashboard you'll use every day.

## Signing in

Go to [tldrq.com](https://tldrq.com). While you're signed out, every page sends you to the sign-in page, except
shared links: a [share link](sharing.md) opens without an account.

The sign-in page has two buttons, **Sign in with GitHub** and **Sign in with Google**. There's no password to
create: tldrq signs you in with your GitHub or Google account, and you come back to your dashboard when you're done.

If sign-in fails, you return to the sign-in page with the message "Authentication failed. Please try again.", or
with the error your provider reported.

## Your first sign-in

The first time you sign in, tldrq creates four collections for you: **Videos**, **Tweets**, **Articles** and
**Repos**. New bookmarks are filed into them automatically (see [Collections](collections.md#auto-categorization)).

Every time you sign in, tldrq re-creates any of those four that are missing, so deleting one of them only lasts
until your next sign-in.

## A tour of the dashboard

The dashboard is a single page. From top to bottom:

### Header

- **tldrq.com**, with the version of the app in parentheses.
- Your avatar, name and email address. On narrow screens only the avatar is shown.
- A GitHub icon that opens the project's source code.
- The sun/moon button that switches between [dark and light mode](#light-and-dark-mode).
- **Sign out**.

### Saving bar

- The URL field (it shows `https://example.com/article` until you type, and has the cursor when the page loads).
- The **Save** button.
- A collection menu, set to **Auto-categorize** unless you pick one of your collections.
- A priority menu, set to **Normal**.

[Saving Bookmarks](saving.md) covers all of this, including dragging a link onto the page.

### Filters

A collapsible **Filters** section holds the search box, your collections, and the read, priority and sort
controls. It opens by itself and reads "Filters (active)" whenever a filter is in effect. See
[Filtering, Search & Sorting](finding.md).

### Toolbar

Under the filters, a count such as "12 bookmarks" and five small icons. All but the import icon act on the
bookmarks currently shown:

| Icon | Does |
|---|---|
| Trash can | Deletes the displayed bookmarks |
| Arrow into a tray | Opens bulk import |
| Arrow out of a tray | Exports the displayed URLs to a text file |
| Share | Creates a [share link](sharing.md) for this view |
| Circular arrows | Reloads the list |

[Import, Export & Bulk Actions](import-export.md) explains the first three and the refresh button.

### Bookmark cards

Each bookmark is a card showing:

- A thumbnail (hidden on narrow screens).
- The title, which opens the page in a new tab. When tldrq found no title, the URL is shown instead.
- The site's hostname, and up to two lines of description.
- How long ago you saved it: `just now`, `5m ago`, `3h ago`, `2d ago`, `4mo ago`, `1y ago`.
- Its collection, a priority badge (none for Normal; see [Priorities](priorities.md)), and stars, forks and language
  for GitHub and GitLab repositories.
- A **Mark as read** or **Mark as unread** button.
- A ⋮ menu with **Set priority** and **Move to collection**.
- A trash icon in the bottom corner. It asks "Delete this bookmark?" first; deleting can't be undone.

Until you save something, the list reads "No bookmarks yet" with the hint "Paste a URL above, or drag and drop one
onto the page to save your first bookmark".

## Light and dark mode

tldrq is dark by default. The sun/moon button in the header switches themes, and your choice is remembered in that
browser only, so another browser or device starts dark again.

## Signing out

**Sign out** ends your session in this browser only. You stay signed in on your other devices and browsers; sign
out on each one you want to end. The [desktop app](desktop.md#signing-out) is the exception: it shares its session
with the browser you signed in with.

## Next steps

- [Save your first bookmarks](saving.md)
- [Organize them into collections](collections.md)
- [Install the desktop app](desktop.md)
