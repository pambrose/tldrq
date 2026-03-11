-- ============================================================
-- Combined schema for tldrq
-- ============================================================

-- Drop all application objects for a clean reset
drop function if exists public.get_shared_bookmarks(text) cascade;
drop table if exists public.shared_views cascade;
drop table if exists public.bookmarks cascade;
drop table if exists public.collections cascade;

-- ============================================================
-- Collections
-- ============================================================

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  is_public boolean not null default false,
  share_slug text unique,
  created_at timestamptz not null default now()
);
create index idx_collections_user_id on public.collections(user_id);
create index idx_collections_share_slug on public.collections(share_slug);
alter table public.collections enable row level security;
create policy "Users can view own collections" on public.collections for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own collections" on public.collections for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own collections" on public.collections for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own collections" on public.collections for delete to authenticated using (auth.uid() = user_id);
create policy "Anyone can view public collections" on public.collections for select to anon using (is_public = true);

-- ============================================================
-- Bookmarks
-- ============================================================

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete set null,
  url text not null,
  title text,
  description text,
  image_url text,
  site_name text,
  repo_stars integer,
  repo_forks integer,
  repo_language text,
  is_read boolean not null default false,
  priority text not null default 'normal' check (priority in ('urgent', 'high', 'normal', 'low')),
  priority_order smallint generated always as (
    case priority
      when 'urgent' then 0
      when 'high'   then 1
      when 'normal' then 2
      when 'low'    then 3
    end
  ) stored,
  created_at timestamptz not null default now()
);
create index idx_bookmarks_user_id on public.bookmarks(user_id);
create index idx_bookmarks_collection_id on public.bookmarks(collection_id);
create index idx_bookmarks_user_read on public.bookmarks(user_id, is_read);
create index idx_bookmarks_priority on public.bookmarks(user_id, priority);
create index idx_bookmarks_priority_order on public.bookmarks(user_id, priority_order, created_at desc);
alter table public.bookmarks enable row level security;
create policy "Users can view own bookmarks" on public.bookmarks for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own bookmarks" on public.bookmarks for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own bookmarks" on public.bookmarks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own bookmarks" on public.bookmarks for delete to authenticated using (auth.uid() = user_id);
create policy "Anyone can view bookmarks in public collections" on public.bookmarks for select to anon using (exists (select 1 from public.collections where collections.id = bookmarks.collection_id and collections.is_public = true));

-- ============================================================
-- Shared views
-- ============================================================

create table public.shared_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text,
  collection_id uuid references public.collections(id) on delete cascade,
  collection_uncategorized boolean not null default false,
  filter text check (filter in ('read', 'unread')),
  priority text check (priority in ('urgent', 'high', 'normal', 'low')),
  sort text check (sort in ('priority')),
  search text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_shared_views_slug on public.shared_views(slug);
create index idx_shared_views_user_id on public.shared_views(user_id);

alter table public.shared_views enable row level security;

create policy "Users can view own shared views"
  on public.shared_views for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own shared views"
  on public.shared_views for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own shared views"
  on public.shared_views for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own shared views"
  on public.shared_views for delete to authenticated
  using (auth.uid() = user_id);

create policy "Anyone can view active shared views"
  on public.shared_views for select to anon
  using (is_active = true);

-- ============================================================
-- Function: get_shared_bookmarks
-- ============================================================

create or replace function public.get_shared_bookmarks(view_slug text)
returns setof public.bookmarks
language plpgsql security definer
as $$
declare
  v record;
  q text;
begin
  select * into v from public.shared_views
  where slug = view_slug and is_active = true;

  if not found then
    return;
  end if;

  q := 'select * from public.bookmarks where user_id = ' || quote_literal(v.user_id);

  if v.collection_uncategorized then
    q := q || ' and collection_id is null';
  elsif v.collection_id is not null then
    q := q || ' and collection_id = ' || quote_literal(v.collection_id);
  end if;

  if v.filter = 'unread' then
    q := q || ' and is_read = false';
  elsif v.filter = 'read' then
    q := q || ' and is_read = true';
  end if;

  if v.priority is not null then
    q := q || ' and priority = ' || quote_literal(v.priority);
  end if;

  if v.search is not null and v.search <> '' then
    q := q || ' and (title ilike ' || quote_literal('%' || v.search || '%')
           || ' or description ilike ' || quote_literal('%' || v.search || '%')
           || ' or url ilike ' || quote_literal('%' || v.search || '%')
           || ' or site_name ilike ' || quote_literal('%' || v.search || '%') || ')';
  end if;

  if v.sort = 'priority' then
    q := q || ' order by priority_order asc, created_at desc';
  else
    q := q || ' order by created_at desc';
  end if;

  return query execute q;
end;
$$;
