-- Execute no SQL Editor do Supabase.
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sport text not null,
  activity_date date not null,
  duration_minutes integer not null check (duration_minutes > 0 and duration_minutes <= 1440),
  distance_km numeric(9,2),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists activities_user_date_idx on public.activities(user_id, activity_date desc);
alter table public.activities enable row level security;
drop policy if exists "Users can read own activities" on public.activities;
create policy "Users can read own activities" on public.activities for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can insert own activities" on public.activities;
create policy "Users can insert own activities" on public.activities for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update own activities" on public.activities;
create policy "Users can update own activities" on public.activities for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can delete own activities" on public.activities;
create policy "Users can delete own activities" on public.activities for delete to authenticated using (auth.uid() = user_id);
