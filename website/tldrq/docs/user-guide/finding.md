---
icon: lucide/search
---

# Filtering, Search & Sorting

Search, collections, read state, priority and sort order all live in the **Filters** panel, and they all combine.
Every combination is also a URL you can bookmark.

## The Filters panel

Click **Filters**, under the saving bar, to open or close the panel. It opens by itself, and reads
"Filters (active)", whenever any filter is in effect, so you can always tell when you're looking at part of your
list.

## Search

Type in the search box ("Search bookmarks..."). It matches text anywhere in a bookmark's title, description, URL or
site name, ignoring upper and lower case. The list updates about a third of a second after you stop typing. The ×
button at the end of the box clears it.

## Collections

The **Collections:** row has **All**, **Uncategorized**, and your collections in alphabetical order, followed by
**+ New** for creating one. See [Collections](collections.md).

## Read state, priority and sort

| Row | Choices |
|---|---|
| **Filter:** | **All**, **Unread**, **Read** |
| **Priority:** | **All**, **Urgent**, **High**, **Normal**, **Low** |
| **Sort:** | **Newest first** (the default), **By priority** |

**By priority** puts Urgent first, then High, Normal and Low, newest first within each level. See
[Priorities & Read Status](priorities.md).

## Combining filters

Every filter applies at once. Unread, Urgent, in Articles, matching "rust" is one view.

The count above the list ("12 bookmarks") and the toolbar's delete, export and share buttons act on exactly the
bookmarks displayed, so filters are also how you choose what those buttons act on.

## URL parameters

Each filter is stored in the dashboard's URL:

| Parameter | Values | Example |
|---|---|---|
| `collection` | A collection's ID, or `uncategorized` | `?collection=uncategorized` |
| `filter` | `unread` or `read` | `?filter=unread` |
| `priority` | `urgent`, `high`, `normal` or `low` (other values are ignored) | `?priority=urgent` |
| `sort` | `priority` (anything else means newest first) | `?sort=priority` |
| `search` | Any text | `?search=rust` |

They combine with `&`: `https://tldrq.com/?filter=unread&sort=priority` shows unread bookmarks by priority.

A collection's ID is a long code. The easiest way to get one is to click the collection and copy the address bar.

## Saving and sharing a filtered view

Each filter change adds an entry to your browser's history, so Back and Forward step through the views you've
looked at, and you can bookmark a filtered dashboard in your browser.

Those URLs only work for you, while you're signed in. To show a view to someone else, create a
[share link](sharing.md) instead.
