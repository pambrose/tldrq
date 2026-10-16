---
icon: lucide/bookmark-plus
---

# Saving Bookmarks

Saving a link takes one paste or one drag. tldrq then fetches the page's title, description and thumbnail for you,
and files the bookmark into a collection.

## Paste a URL

Paste or type a URL into the field at the top of the dashboard and press Enter, or click **Save** (it reads
"Saving..." while tldrq fetches the page).

The URL must start with `http://` or `https://`. Your browser won't submit text that isn't a URL, and other kinds
of URL, such as `ftp://`, are refused with "URL must start with http:// or https://", shown in red above the field.

After a successful save the field clears and the priority menu goes back to **Normal**. The collection menu keeps
your choice, so you can save several links into the same collection in a row.

## Drag and drop

Drag a link from anywhere (a browser tab, the address bar, a link on another page) and drop it anywhere on the
dashboard. While you drag, an overlay reads "Drop URL to save bookmark". Dropping saves the link right away, with
whatever the collection and priority menus are set to.

Dragged text works too, as long as it starts with `http://` or `https://`.

## Choosing a collection and priority

The two menus next to **Save** apply to the link you're saving:

- **Collection**: **Auto-categorize** (the default) picks a collection from the link itself; see
  [Auto-categorization](collections.md#auto-categorization). Or choose any of your collections.
- **Priority**: Urgent, High, Normal (the default) or Low. See [Priorities & Read Status](priorities.md).

Both can be changed later from the bookmark's ⋮ menu.

## Duplicates

Each URL can be saved once. Saving one you already have shows "This URL has already been bookmarked". The match is
exact, so `https://example.com` and `https://example.com/` count as different URLs. If you can't see the existing
bookmark, clear your filters and [search](finding.md#search) for it.

## What tldrq fetches

tldrq recognizes these sites and asks each one for its own details. Everything else gets the preview information
pages publish for link previews (their Open Graph tags).

| Site | Recognized URLs | Title | Description | Thumbnail |
|---|---|---|---|---|
| YouTube | `youtube.com/watch?v=…`, `youtu.be/…`, and `/shorts/`, `/embed/` and `/v/` links, on `www.` and `m.` too | The video's title | *By channel* | The video's thumbnail |
| X / Twitter | `x.com/user/status/…` and `twitter.com/user/status/…` | The author's name, prefixed with `@` | The post's text | The page's preview image |
| Vimeo | `vimeo.com/` followed by a video number | The video's title | *By author* | The video's thumbnail |
| TikTok | `tiktok.com` links containing `/video/` | The video's title | *By author* | The video's thumbnail |
| Spotify | `open.spotify.com/` track, album, playlist, episode and show links | The title | None | The cover image |
| Reddit | `reddit.com/r/subreddit/comments/…`, on `www.` and `old.` too | The post's title | *By u/author*, or the page's description | The page's preview image |
| SoundCloud | `soundcloud.com/artist/track` | The track's title | *By author* | The artwork |
| Flickr | `flickr.com/photos/…` | The photo's title | *By author* | The photo |
| SlideShare | `slideshare.net/user/deck` | The deck's title | *By author* | The deck's thumbnail |
| GitHub | `github.com/owner/repo`, and any page inside a repository | `owner/repo` | The repository's description | The owner's avatar, plus [stats](#repository-stats) |
| GitLab | `gitlab.com/group/project` | `group/project` | The project's description | The project's avatar, plus [stats](#repository-stats) |
| Instagram | `instagram.com/p/…`, `/reel/…` and `/tv/…` | From the page's preview tags | From the page | From the page |
| Everything else | Any `http(s)` URL | The page's preview title, or its `<title>` | The page's preview description, or its meta description | The page's preview image |

A few details:

- GitHub and GitLab pages that aren't a repository, such as a profile or an organization, are treated like any other
  site. So is a repository whose details GitHub or GitLab won't return.
- A thumbnail given as a relative path is resolved against the page. Images that aren't ordinary `http(s)` URLs are
  dropped.

## Repository stats

Bookmarks of GitHub and GitLab repositories show the number of stars and forks. GitHub repositories also show their
main language; GitLab projects show their first topic in that spot. Counts of 1,000 or more are shortened to `1.2k`,
and a million or more to `1.2m`.

## When metadata can't be fetched

tldrq gives each site it asks up to 5 seconds to start responding. If it can't get anything (the site is slow, it
refuses automated requests, or it sits behind a sign-in), the bookmark is still saved. Its card shows the URL in
place of a title, with no description or thumbnail.

## Updating a bookmark's details

Details are fetched once, when you save. The refresh button reloads your list but doesn't fetch anything from the
bookmarked pages again, and titles can't be edited.
To get fresh details, delete the bookmark and save the URL again.
