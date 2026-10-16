---
icon: lucide/database
---

# Database

tldrq's data is three tables and one function in Supabase's `public` schema, all defined in
`supabase/schema.sql` (included in full at the [end of this page](#full-schema)). Every table has Row Level
Security enabled.

## collections

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `user_id` | `uuid not null` | References `auth.users(id) on delete cascade` |
| `name` | `text not null` | Not unique |
| `is_public` | `boolean not null default false` | Legacy public sharing (see [below](#making-a-collection-public)) |
| `share_slug` | `text unique` | Legacy share code, set while `is_public` is true |
| `created_at` | `timestamptz not null default now()` | |

Indexes: `idx_collections_user_id`, `idx_collections_share_slug`.

## bookmarks

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `user_id` | `uuid not null` | References `auth.users(id) on delete cascade` |
| `collection_id` | `uuid` | References `collections(id) on delete set null`; null means Uncategorized |
| `url` | `text not null` | |
| `title`, `description`, `image_url`, `site_name` | `text` | From the [metadata fetcher](metadata.md); nullable |
| `repo_stars`, `repo_forks` | `integer` | GitHub and GitLab only |
| `repo_language` | `text` | GitHub's language, or GitLab's first topic |
| `is_read` | `boolean not null default false` | |
| `priority` | `text not null default 'normal'` | Check: `urgent`, `high`, `normal`, `low` |
| `priority_order` | `smallint generated always as (…) stored` | 0 for urgent, 1 high, 2 normal, 3 low |
| `created_at` | `timestamptz not null default now()` | |

Indexes: `idx_bookmarks_user_id`, `idx_bookmarks_collection_id`, `idx_bookmarks_user_read (user_id, is_read)`,
`idx_bookmarks_priority (user_id, priority)` and
`idx_bookmarks_priority_order (user_id, priority_order, created_at desc)`, which serves the "By priority" sort.

There's no unique constraint on `url`: `POST /api/bookmarks` checks for an existing bookmark with the same URL
before inserting. `priority_order` has to stay in step with `PRIORITY_ORDER` in `src/lib/utils/priority.ts`.

## shared_views

One row per [share link](../user-guide/sharing.md). It stores the view's settings, not its bookmarks.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid not null` | References `auth.users(id) on delete cascade` |
| `slug` | `text not null unique` | The code in `/share/slug` |
| `title` | `text` | Optional heading |
| `collection_id` | `uuid` | References `collections(id) on delete cascade` |
| `collection_uncategorized` | `boolean not null default false` | The view is Uncategorized |
| `filter` | `text` | Check: `read`, `unread` |
| `priority` | `text` | Check: the four levels |
| `sort` | `text` | Check: `priority` |
| `search` | `text` | |
| `is_active` | `boolean not null default true` | False turns the link off |
| `created_at` | `timestamptz not null default now()` | |

Indexes: `idx_shared_views_slug`, `idx_shared_views_user_id`. Because `collection_id` cascades, deleting a
collection deletes the share links made for it.

## Row Level Security

| Table | `authenticated` role | `anon` role |
|---|---|---|
| `collections` | Select, insert, update, delete where `auth.uid() = user_id` | Select where `is_public = true` |
| `bookmarks` | Select, insert, update, delete where `auth.uid() = user_id` | Select bookmarks whose collection is public |
| `shared_views` | Select, insert, update, delete where `auth.uid() = user_id` | Select where `is_active = true` |

Every query the app makes runs with the user's session, so these policies are what keep users apart; the route
handlers' extra `user_id` filters are a second line.

!!! warning "What these policies mean for share links"
    - The `is_active = true` policy is granted to `anon` only, and the share page queries as the visitor. Other
      signed-in users can't read someone else's row, so for them the share page returns 404: a share link works
      for signed-out visitors and for its owner, not for other signed-in users.
    - Anyone holding the anon key, which ships in the browser bundle, can list every active `shared_views` row
      (slug, title, search text and the owner's `user_id`) and call `get_shared_bookmarks` for each slug, so share
      links can be enumerated. Public collections and their bookmarks are exposed the same way.

## get_shared_bookmarks

```sql
get_shared_bookmarks(view_slug text) returns setof public.bookmarks
-- language plpgsql security definer
```

The share page calls it with `supabase.rpc("get_shared_bookmarks", { view_slug })`. It:

1. looks up the active `shared_views` row with that slug, and returns nothing if there isn't one;
2. builds a query over that view owner's bookmarks, adding the view's settings: Uncategorized or a collection, the
   read filter, the priority, the search (`ilike` on title, description, url and site_name) and the sort
   (`priority_order asc, created_at desc`, or `created_at desc`);
3. runs it, with every value quoted by `quote_literal`.

Running as `security definer` lets an anonymous viewer get exactly the bookmarks a link exposes, without an `anon`
policy on `bookmarks` that would expose more.

`src/app/share/[slug]/page.tsx` looks for an active `shared_views` row first; failing that, a `collections` row
with that `share_slug` and `is_public = true` (the legacy public collection); failing both, it returns 404.

## Share slugs

`generateShareSlug()` in `src/lib/utils/slug.ts` takes 6 random bytes from Node's `crypto.randomBytes` and
base64url-encodes them: 8 characters, 48 bits. That makes a link hard to guess, but not secret: active links can be
listed (see [Row Level Security](#row-level-security)).

## Turning off a share link

The app has no control for this. In the Supabase SQL editor:

```sql
update public.shared_views set is_active = false where slug = 'abcd1234';
```

The share page and `get_shared_bookmarks` then ignore the row, and the link shows "not found". Deleting the row
works too; setting `is_active` back to true restores the link.

## Making a collection public

Public collections are the older way of sharing, with no control left in the app. The API still supports it:
`PATCH /api/collections/{id}` with `{"is_public": true}` gives the collection a new `share_slug`, and
`{"is_public": false}` clears it. See the [API Reference](api.md).

## Migrations and resets

| File | Creates |
|---|---|
| `supabase/migrations/001_schema.sql` | `collections` and `bookmarks`, with their indexes and policies |
| `supabase/migrations/002_shared_views.sql` | `shared_views` and `get_shared_bookmarks` |
| `supabase/migrations/003_shared_views_title.sql` | Adds `shared_views.title` |

`supabase/schema.sql` is the three combined, and it starts by dropping the function and all three tables. No
migration tool is configured: apply the SQL in Supabase's SQL editor or with `psql`.

!!! warning "drop_all.sql is out of date"
    `supabase/drop_all.sql` drops only `bookmarks` and `collections`; it predates `shared_views`. For a full reset,
    use the drop statements at the top of `schema.sql`.

## TypeScript types

`src/types/database.ts` defines `Collection`, `Bookmark` and `SharedView` to match the tables (`Bookmark` leaves out
`priority_order`). Update it with any schema change.

## Full schema

This is `supabase/schema.sql`, included from the repository:

```sql title="supabase/schema.sql"
--8<-- "supabase/schema.sql"
```
