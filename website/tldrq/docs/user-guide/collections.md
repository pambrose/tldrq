---
icon: lucide/folders
---

# Collections

Collections group your bookmarks. Each bookmark is in one collection, or in none (Uncategorized). tldrq starts you
with four and can file new bookmarks into them for you.

## Default collections

Your first sign-in creates **Videos**, **Tweets**, **Articles** and **Repos**. Each later sign-in re-creates any of
the four that are missing.

## Auto-categorization

When **Auto-categorize** is chosen, tldrq picks the collection from the link. It's the default in the collection
menu next to **Save**, which covers links you paste and links you drag onto the page, and in the Bulk Import
dialog's own collection menu (see [bulk import](import-export.md#bulk-import)).

| Goes to | Links |
|---|---|
| Videos | YouTube, Vimeo and TikTok videos (the links listed on [Saving Bookmarks](saving.md#what-tldrq-fetches)) |
| Tweets | X and Twitter posts (links containing `/status/`) |
| Repos | Any `github.com` or `gitlab.com` link, including profiles and organizations |
| Articles | Everything else, including Spotify, Reddit, SoundCloud, Flickr, SlideShare and Instagram links |

Collections are matched by their exact name. If the one a link belongs in doesn't exist, because you deleted or
renamed it, tldrq creates it. Renaming "Videos" to "Clips", for example, means the next video you save lands in a
new collection called "Videos".

!!! tip
    Keep collection names distinct. Auto-categorization looks collections up by name.

## Browsing a collection

Open **Filters**. The **Collections:** row lists **All**, **Uncategorized**, and then your collections in
alphabetical order. Click one to show only its bookmarks; it combines with the search box and the other filters
(see [Filtering, Search & Sorting](finding.md)).

## Creating a collection

Click **+ New** at the end of the **Collections:** row, type a name, and press Enter or click **Add**. **Cancel**
closes the box without creating anything. Empty names are ignored.

## Renaming and deleting

Select the collection in the **Collections:** row. A gear icon (**Collection settings**) appears next to the row,
with two choices:

- **Rename**: edit the name in place, then press Enter or click **Save**.
- **Delete collection**: tldrq asks `Delete "name"? Bookmarks will become uncategorized.` Your bookmarks are kept and
  move to Uncategorized. Any [share link](sharing.md) made for that collection stops working.

The four default collections can be renamed or deleted like any other, but a missing default comes back at your
next sign-in.

## Moving a bookmark

Open the bookmark's ⋮ menu, choose **Move to collection**, and pick **Uncategorized** or any collection. The
bookmark's current collection has a ✓ next to it.

## Uncategorized

Uncategorized holds the bookmarks that aren't in any collection: the ones you moved there, and the ones whose
collection was deleted. Select **Uncategorized** in the **Collections:** row to see them.

## Sharing a collection

Select the collection and use the share button in the toolbar; see [Sharing](sharing.md). The link shows the
collection's bookmarks, including ones you add later.

Earlier versions of tldrq could make a whole collection public. Links made that way still open, but the app no
longer has a control for making a collection public or private.
