-- NEXFIT | Módulo de musculação e compartilhamento seletivo
-- Execute este arquivo no SQL Editor do Supabase após conferir o projeto.

create extension if not exists pgcrypto;

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  athlete_name text not null,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Controle de vigência: o histórico das fichas é preservado.
alter table public.workout_plans
  add column if not exists is_active boolean not null default false;
alter table public.workout_plans
  add column if not exists start_date date;

create unique index if not exists workout_plans_one_active_per_owner
  on public.workout_plans(owner_id) where is_active = true;

-- Ativa uma ficha e desativa a anterior do mesmo proprietário em uma única transação.
create or replace function public.activate_workout_plan(p_plan_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $
declare v_owner uuid;
begin
  if auth.uid() is null then
    raise exception 'É necessário estar autenticado.';
  end if;
  select owner_id into v_owner
  from public.workout_plans
  where id = p_plan_id
  for update;
  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'Somente o proprietário pode ativar esta ficha.';
  end if;
  update public.workout_plans
    set is_active = false
    where owner_id = auth.uid() and is_active = true;
  update public.workout_plans
    set is_active = true, start_date = current_date, updated_at = now()
    where id = p_plan_id and owner_id = auth.uid();
end;
$;

revoke all on function public.activate_workout_plan(uuid) from public;
grant execute on function public.activate_workout_plan(uuid) to authenticated;

create table if not exists public.exercise_library (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  muscle_group text,
  instructions text,
  media_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans(id) on delete cascade,
  exercise_id uuid references public.exercise_library(id) on delete set null,
  position integer not null default 1,
  name text not null,
  rest_seconds integer not null default 60 check (rest_seconds >= 0 and rest_seconds <= 3600),
  prescription text not null,
  notes text,
  media_url text,
  created_at timestamptz not null default now()
);

-- Cada elemento de prescribed_sets representa uma série:
-- [{"reps":12,"load":20},{"reps":10,"load":24},{"reps":8,"load":28}]
-- Para MR, usar {"reps":null,"type":"MR"} em cada série.
alter table public.workout_exercises
  add column if not exists prescribed_sets jsonb not null default '[]'::jsonb;

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress','completed','abandoned')),
  created_at timestamptz not null default now()
);

create table if not exists public.workout_set_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number integer not null check (set_number > 0),
  reps_completed integer not null default 0 check (reps_completed >= 0),
  load_kg numeric(8,2) check (load_kg is null or load_kg >= 0),
  completed_at timestamptz not null default now(),
  unique(session_id, workout_exercise_id, set_number)
);

create table if not exists public.workout_shares (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  shared_with_user_id uuid not null references auth.users(id) on delete cascade,
  permission text not null check (permission in ('view','edit')),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique(plan_id, shared_with_user_id)
);

create index if not exists workout_plans_owner_idx on public.workout_plans(owner_id);
create index if not exists workout_exercises_plan_idx on public.workout_exercises(plan_id, position);
create index if not exists workout_sessions_user_idx on public.workout_sessions(user_id, started_at desc);
create index if not exists workout_set_logs_session_idx on public.workout_set_logs(session_id);
create index if not exists workout_shares_target_idx on public.workout_shares(shared_with_user_id) where revoked_at is null;

alter table public.workout_plans enable row level security;
alter table public.exercise_library enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_set_logs enable row level security;
alter table public.workout_shares enable row level security;

-- Funções SECURITY DEFINER evitam recursão entre políticas RLS.
create or replace function public.can_access_workout_plan(p_plan_id uuid, p_edit boolean default false)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workout_plans p
    where p.id = p_plan_id and p.owner_id = auth.uid()
  ) or exists (
    select 1 from public.workout_shares s
    where s.plan_id = p_plan_id
      and s.shared_with_user_id = auth.uid()
      and s.revoked_at is null
      and (not p_edit or s.permission = 'edit')
  );
$$;

drop policy if exists "plan owner or shared read" on public.workout_plans;
create policy "plan owner or shared read" on public.workout_plans for select to authenticated
using (owner_id = auth.uid() or public.can_access_workout_plan(id, false));
drop policy if exists "plan owner insert" on public.workout_plans;
create policy "plan owner insert" on public.workout_plans for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "plan owner or editor update" on public.workout_plans;
create policy "plan owner or editor update" on public.workout_plans for update to authenticated
using (owner_id = auth.uid() or public.can_access_workout_plan(id, true))
with check (owner_id = auth.uid() or public.can_access_workout_plan(id, true));
drop policy if exists "plan owner delete" on public.workout_plans;
create policy "plan owner delete" on public.workout_plans for delete to authenticated using (owner_id = auth.uid());

drop policy if exists "exercise library own or public read" on public.exercise_library;
create policy "exercise library own or public read" on public.exercise_library for select to authenticated
using (owner_id is null or owner_id = auth.uid());
drop policy if exists "exercise library own insert" on public.exercise_library;
create policy "exercise library own insert" on public.exercise_library for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "exercise library own update" on public.exercise_library;
create policy "exercise library own update" on public.exercise_library for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "exercise read via plan" on public.workout_exercises;
create policy "exercise read via plan" on public.workout_exercises for select to authenticated
using (public.can_access_workout_plan(plan_id, false));
drop policy if exists "exercise insert via plan" on public.workout_exercises;
create policy "exercise insert via plan" on public.workout_exercises for insert to authenticated
with check (public.can_access_workout_plan(plan_id, true));
drop policy if exists "exercise update via plan" on public.workout_exercises;
create policy "exercise update via plan" on public.workout_exercises for update to authenticated
using (public.can_access_workout_plan(plan_id, true)) with check (public.can_access_workout_plan(plan_id, true));
drop policy if exists "exercise delete via plan" on public.workout_exercises;
create policy "exercise delete via plan" on public.workout_exercises for delete to authenticated
using (public.can_access_workout_plan(plan_id, true));

drop policy if exists "sessions own or plan shared read" on public.workout_sessions;
create policy "sessions own or plan shared read" on public.workout_sessions for select to authenticated
using (user_id = auth.uid() or public.can_access_workout_plan(plan_id, false));
drop policy if exists "sessions own insert" on public.workout_sessions;
create policy "sessions own insert" on public.workout_sessions for insert to authenticated
with check (user_id = auth.uid() and public.can_access_workout_plan(plan_id, false));
drop policy if exists "sessions own update" on public.workout_sessions;
create policy "sessions own update" on public.workout_sessions for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "set logs read via session" on public.workout_set_logs;
create policy "set logs read via session" on public.workout_set_logs for select to authenticated
using (exists(select 1 from public.workout_sessions s where s.id = session_id and (s.user_id = auth.uid() or public.can_access_workout_plan(s.plan_id, false))));
drop policy if exists "set logs insert own session" on public.workout_set_logs;
create policy "set logs insert own session" on public.workout_set_logs for insert to authenticated
with check (exists(select 1 from public.workout_sessions s where s.id = session_id and s.user_id = auth.uid()));
drop policy if exists "set logs update own session" on public.workout_set_logs;
create policy "set logs update own session" on public.workout_set_logs for update to authenticated
using (exists(select 1 from public.workout_sessions s where s.id = session_id and s.user_id = auth.uid()))
with check (exists(select 1 from public.workout_sessions s where s.id = session_id and s.user_id = auth.uid()));

drop policy if exists "share owner and recipient read" on public.workout_shares;
create policy "share owner and recipient read" on public.workout_shares for select to authenticated
using (owner_id = auth.uid() or shared_with_user_id = auth.uid());
drop policy if exists "share owner insert" on public.workout_shares;
create policy "share owner insert" on public.workout_shares for insert to authenticated
with check (owner_id = auth.uid() and exists(select 1 from public.workout_plans p where p.id = plan_id and p.owner_id = auth.uid()));
drop policy if exists "share owner update" on public.workout_shares;
create policy "share owner update" on public.workout_shares for update to authenticated
using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "share owner delete" on public.workout_shares;
create policy "share owner delete" on public.workout_shares for delete to authenticated using (owner_id = auth.uid());

-- Compartilhamento por e-mail: o aluno escolhe uma ficha e uma permissão.
create or replace function public.share_workout_by_email(p_plan_id uuid, p_email text, p_permission text)
returns uuid language plpgsql security definer set search_path = public, auth
as $$
declare target_id uuid; share_id uuid;
begin
  if auth.uid() is null then raise exception 'É necessário estar autenticado.'; end if;
  if p_permission not in ('view','edit') then raise exception 'Permissão inválida.'; end if;
  if not exists(select 1 from public.workout_plans where id=p_plan_id and owner_id=auth.uid()) then
    raise exception 'Você só pode compartilhar suas próprias fichas.';
  end if;
  select id into target_id from auth.users where lower(email)=lower(trim(p_email)) limit 1;
  if target_id is null then raise exception 'Não encontramos uma conta NEXFIT com esse e-mail.'; end if;
  if target_id=auth.uid() then raise exception 'Você não pode compartilhar uma ficha consigo mesmo.'; end if;
  insert into public.workout_shares(plan_id,owner_id,shared_with_user_id,permission,revoked_at)
  values(p_plan_id,auth.uid(),target_id,p_permission,null)
  on conflict(plan_id,shared_with_user_id) do update set permission=excluded.permission, revoked_at=null
  returning id into share_id;
  return share_id;
end;
$$;
revoke all on function public.share_workout_by_email(uuid,text,text) from public;
grant execute on function public.share_workout_by_email(uuid,text,text) to authenticated;

grant execute on function public.can_access_workout_plan(uuid,boolean) to authenticated;
