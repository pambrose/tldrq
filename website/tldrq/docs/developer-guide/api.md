---
icon: lucide/braces
---

# API Reference

The client components write through six route handlers under `src/app/api/`. They're an internal API for the
app's own pages, but they're plain JSON over HTTP and easy to call from a signed-in browser.

## Conventions

- **JSON in and out.** Request bodies are JSON; so are responses.
- **Cookie authentication.** The Supabase session cookie identifies the user. There are no API keys or tokens.
- **Signed-out requests** are redirected by the [proxy](authentication.md#the-proxy) to `/login`
  (`NextResponse.redirect`, HTTP 307) before reaching a handler. A handler that runs without a user returns
  `401 {"error": "Unauthorized"}`.
- **Errors** are `{ "error": "message" }`. Database errors come back as `500` with Supabase's message.
- **Scoping.** Every query is limited to the signed-in user, by Row Level Security and by an explicit
  `.eq("user_id", user.id)`.

## Bookmarks

### `GET /api/bookmarks`

Lists the user's bookmarks, newest first.

| Query parameter | Values |
|---|---|
| `collection_id` | A collection's UUID, or `uncategorized` |
| `is_read` | `true` or `false` |
| `priority` | `urgent`, `high`, `normal` or `low`; other values are ignored |

Returns `200` with an array of bookmark rows. There are no search or sort parameters: the dashboard queries
Supabase directly from its server component.

### `POST /api/bookmarks`

Saves a bookmark.

| Body field | Type | Notes |
|---|---|---|
| `url` | string | Required; `http://` or `https://` |
| `collection_id` | UUID or null | Omit or null to auto-categorize |
| `priority` | string | A level; anything else, or nothing, becomes `normal` |

Returns `201` with the new row.

| Status | Error |
|---|---|
| `400` | "URL is required" |
| `400` | "URL must start with http:// or https://" |
| `400` | "Invalid URL format" |
| `409` | "This URL has already been bookmarked" (an exact match among the user's bookmarks) |

Side effects: [fetches metadata](metadata.md) for the URL, which can take several seconds; without a
`collection_id`, finds or creates the Videos, Tweets, Repos or Articles collection by name
(see [Auto-categorization](../user-guide/collections.md#auto-categorization)).

### `PATCH /api/bookmarks/{id}`

Updates a bookmark. The body has any of:

| Body field | Type | Notes |
|---|---|---|
| `is_read` | boolean | Non-boolean values are ignored |
| `collection_id` | UUID, null or `""` | Null or empty moves it to Uncategorized |
| `priority` | string | One of the four levels |

Returns `200` with the updated row.

| Status | Error |
|---|---|
| `400` | "Invalid priority value" |
| `400` | "No valid fields to update" |
| `500` | The ID isn't one of the user's bookmarks (the update's `.single()` finds no row) |

### `DELETE /api/bookmarks/{id}`

Deletes a bookmark. Returns `200 {"success": true}`, also when no row matched.

## Collections

### `GET /api/collections`

Returns `200` with the user's collections, oldest first.

### `POST /api/collections`

Creates a collection from `{ "name": string }`; the name is trimmed. Returns `201` with the new row, or
`400` "Name is required" for an empty name.

### `PATCH /api/collections/{id}`

| Body field | Type | Notes |
|---|---|---|
| `name` | string | Trimmed |
| `is_public` | boolean | `true` makes the collection public and gives it a new 8-character `share_slug`; `false` sets `share_slug` to null |

Returns `200` with the updated row, or `500` for an ID that isn't one of the user's collections. Public collections
are the legacy way of sharing; see [Database](database.md#making-a-collection-public).

### `DELETE /api/collections/{id}`

Deletes a collection. Returns `200 {"success": true}`. Its bookmarks get `collection_id = null` (Uncategorized),
and its share links are deleted with it (the foreign key cascades).

## Metadata

### `GET /api/metadata`

Runs the [metadata fetcher](metadata.md) on `?url=` and returns `200` with the `OGMetadata` JSON, or `400`
"URL is required". There's no other validation of the URL. The UI doesn't call it; it's for trying the fetcher.

## Shared views

### `POST /api/shared-views`

Creates a [share link](../user-guide/sharing.md).

| Body field | Type | Notes |
|---|---|---|
| `collection_id` | UUID | The view's collection |
| `collection_uncategorized` | boolean | The view is Uncategorized |
| `filter` | string | `read` or `unread` |
| `priority` | string | One of the four levels |
| `sort` | string | `priority` |
| `search` | string | Search text |
| `title` | string | Heading for the share page |

All fields are optional; empty values are stored as null. Returns `201 {"slug": "abcd1234", "url": "/share/abcd1234"}`.
Every call inserts a new row. Values the table's check constraints reject (a `filter`, `priority` or `sort` outside
the lists above) return `500`.

## Trying it

Sign in to the site, open the browser's developer console on that tab, and run:

```js
await (await fetch("/api/metadata?url=" + encodeURIComponent("https://github.com/vercel/next.js"))).json()
```

The browser sends the session cookie with the request. To use `curl` instead, copy the session cookies from the
browser.

The other server routes aren't JSON endpoints: `/auth/callback` and `/auth/callback-desktop` are described in
[Authentication](authentication.md), and `/share/[slug]` in [Database](database.md#get_shared_bookmarks).
