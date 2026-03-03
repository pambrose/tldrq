-- Drop all application objects from Supabase
-- Run this before re-applying 001_schema.sql for a clean reset

-- Drop tables (cascades to indexes, policies, and constraints)
drop table if exists public.bookmarks cascade;
drop table if exists public.collections cascade;
