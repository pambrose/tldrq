---
icon: lucide/circle-help
---

# FAQ & Troubleshooting

## Bookmarks

### Why doesn't a bookmark have a thumbnail?

One of these:

- The page doesn't publish a preview image.
- The image failed to load. Cards hide images that don't load rather than showing a broken one.
- The image isn't an ordinary `http(s)` URL, so tldrq didn't keep it.
- The window is narrow. Thumbnails are hidden on small screens.

### Why is a bookmark's title just its URL?

The site didn't start responding within 5 seconds, or it refused: pages behind a sign-in and sites that block
automated requests often do. See [When metadata can't be fetched](saving.md#when-metadata-cant-be-fetched).

### How do I update a bookmark's title or thumbnail?

Details are fetched only when you save, and titles can't be edited.
To refresh them, delete the bookmark and save the URL again.

### "This URL has already been bookmarked", but I can't see it

It's probably filtered out. Clear the filters and [search](finding.md#search) for it. Matching is exact, so the
URL you're saving is character for character one you already have.

## Collections

### Why did "Videos" come back after I deleted it?

The four default collections (Videos, Tweets, Articles, Repos) are re-created each time you sign in. Saving a link
with **Auto-categorize** also re-creates the collection it belongs in. See
[Collections](collections.md#auto-categorization).

## Signing in

### Sign-in failed with "Authentication failed. Please try again."

Try again. In the desktop app, keep the app open while you sign in, and finish signing in in the browser tab it
opened.

### Does signing out sign me out everywhere?

No. **Sign out** ends the session in the current browser only; you stay signed in on your other devices. Sign out
on each one you want to end.

The desktop app is the exception: it shares one session with the browser you signed in with, so signing out of
either one signs out both. See [Desktop App](desktop.md#signing-out).

## Privacy and sharing

### Can someone see my bookmarks?

Only through the [share links](sharing.md) you create, and those are best treated as public: anyone can find
them, not only the people you send them to. See [Privacy](sharing.md#privacy).

### Can I turn off a share link?

Not from the app yet. See [Turning a link off](sharing.md#turning-a-link-off).

## Appearance

### Why is everything dark?

Dark is tldrq's default theme. Use the sun/moon button in the header to switch to light; the choice is stored in
each browser separately.
