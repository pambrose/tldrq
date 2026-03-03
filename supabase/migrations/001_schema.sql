-- Collections table
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

-- Bookmarks table
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete set null,
  url text not null,
  title text,
  description text,
  image_url text,
  site_name text,
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
