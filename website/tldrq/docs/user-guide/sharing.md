---
icon: lucide/share-2
---

# Sharing

A share link shows a view of your bookmarks to people who aren't signed in to tldrq. Viewers need no account and
open it without signing in. Any filtered view can be shared: a collection, your unread Urgent bookmarks, everything
matching a search.

## Creating a share link

1. Set up the view you want with [Filters](finding.md).
2. Click the share icon in the toolbar (**Share displayed URLs**).
3. In the **Share** dialog, optionally type a title in "Add a title (optional)".
4. Click **Create link**.

The link appears with a **Copy** button, which reads "Copied!" once it's on your clipboard. Links look like
`https://tldrq.com/share/` followed by an 8-character code.

## What a link shares

A link saves the view's settings, not a list of bookmarks: the collection (or Uncategorized), the read filter, the
priority, the sort order and the search text. The view is live: whoever opens the link sees the bookmarks that
match those settings at that moment. That includes bookmarks you add later, and leaves out ones you've deleted or moved out of the view.

Each click on **Create link** makes a new link, separate from the others, even for a view you've shared before.

## What viewers see

The page's heading is the title you gave the link. Without one, it's built from the view's settings, joined with
" · ": the collection's name or "Uncategorized", the priority, the read filter, and `Search: term`. A link with no
settings at all is headed "All bookmarks". Under the heading: "N bookmarks · Shared view".

!!! warning "Signed-in tldrq users see "not found""
    Someone signed in to tldrq with a different account gets a "not found" page instead of your bookmarks. The page
    looks the link up as the person viewing it, and tldrq's database only lets signed-out visitors and the link's
    owner do that. They can open the link in a private window, or sign out first.

!!! tip "Give links for a collection a title"
    Signed-out viewers see the heading without the collection's name, because your collections aren't public. A
    title makes the link read the way you meant it.

Each bookmark shows its thumbnail, its title (linking to the page), its hostname and description, its priority
border and badge, and repository stats. The page doesn't show whether you've read a bookmark, when you saved it, or
its collection, and it has no controls. Those details are still in the data the page loads, though, so don't count
on a share link to keep them private.

A link that doesn't exist, or has been turned off, shows a "not found" page.

## Turning a link off

The app has no control for turning off a share link yet. Two things do end one:

- A link made for a collection stops working when that collection is deleted.
- Deleting a bookmark removes it from every link it appeared in.

Whoever runs the tldrq site can turn off any single link; see
[Turning off a share link](../developer-guide/database.md#turning-off-a-share-link) in the Developer Guide.

## Older public collection links

Earlier versions of tldrq could make a whole collection public. Those links still open. They're labeled
"Shared collection" and show every bookmark in it.

## Privacy

Only you can see your bookmarks, except through the share links you create. Treat every share link as public:
tldrq's database lets anyone list the active share links (and the older public collections), so what a link shows
can be found without the link itself. Share only views you'd be happy for anyone to see.
