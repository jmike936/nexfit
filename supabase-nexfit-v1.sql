-- NEXFIT | Nova estrutura de musculação (v1)
-- Preserva auth.users, activities e tabelas antigas. Não apaga histórico.
create extension if not exists pgcrypto;

create table if not exists public.athlete_professional_access (
 id uuid primary key default gen_random_uuid(),
 athlete_id uuid not null references auth.users(id) on delete cascade,
 professional_id uuid not null references auth.users(id) on delete cascade,
 can_view_history boolean not null default false,
 can_manage_programs boolean not null default false,
 status text not null default 'pending' check(status in ('pending','active','revoked')),
 requested_at timestamptz not null default now(),
 decided_at timestamptz,
 unique(athlete_id,professional_id),
 check(athlete_id <> professional_id)
);
create table if not exists public.training_programs (
 id uuid primary key default gen_random_uuid(),
 athlete_id uuid not null references auth.users(id) on delete restrict,
 created_by uuid not null references auth.users(id) on delete restrict,
 title text not null,
 description text,
 status text not null default 'pending' check(status in ('pending','active','archived','deletion_pending')),
 current_version_id uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 archived_at timestamptz
);
create table if not exists public.training_program_versions (
 id uuid primary key default gen_random_uuid(),
 program_id uuid not null references public.training_programs(id) on delete restrict,
 version_number integer not null,
 created_by uuid not null references auth.users(id) on delete restrict,
 change_note text,
 status text not null default 'pending' check(status in ('pending','active','archived')),
 created_at timestamptz not null default now(),
 confirmed_at timestamptz,
 unique(program_id,version_number)
);
alter table public.training_programs drop constraint if exists training_programs_current_version_fk;
alter table public.training_programs add constraint training_programs_current_version_fk
 foreign key(current_version_id) references public.training_program_versions(id) on delete set null;
create table if not exists public.training_subworkouts (
 id uuid primary key default gen_random_uuid(),
 version_id uuid not null references public.training_program_versions(id) on delete restrict,
 title text not null,
 description text,
 position integer not null default 0
);
create table if not exists public.training_exercises (
 id uuid primary key default gen_random_uuid(),
 subworkout_id uuid not null references public.training_subworkouts(id) on delete restrict,
 name text not null,
 position integer not null default 0,
 sets jsonb not null default '[{"reps":10,"load_kg":null}]'::jsonb,
 rest_seconds integer not null default 60 check(rest_seconds between 0 and 3600),
 notes text,
 media_url text
);
create table if not exists public.training_sessions (
 id uuid primary key default gen_random_uuid(),
 athlete_id uuid not null references auth.users(id) on delete restrict,
 program_id uuid not null references public.training_programs(id) on delete restrict,
 version_id uuid not null references public.training_program_versions(id) on delete restrict,
 subworkout_id uuid references public.training_subworkouts(id) on delete restrict,
 started_at timestamptz not null default now(),
 finished_at timestamptz,
 status text not null default 'in_progress' check(status in ('in_progress','completed','abandoned')),
 notes text
);
create table if not exists public.training_set_logs (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.training_sessions(id) on delete restrict,
 exercise_id uuid not null references public.training_exercises(id) on delete restrict,
 set_number integer not null,
 reps_completed integer,
 load_kg numeric(8,2),
 duration_seconds integer,
 distance_m numeric(10,2),
 notes text,
 completed_at timestamptz not null default now()
);
create table if not exists public.training_program_deletion_requests (
 id uuid primary key default gen_random_uuid(),
 program_id uuid not null references public.training_programs(id) on delete restrict,
 requested_by uuid not null references auth.users(id) on delete restrict,
 decided_by uuid references auth.users(id) on delete restrict,
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 reason text,
 requested_at timestamptz not null default now(),
 decided_at timestamptz
);
create table if not exists public.app_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 type text not null,
 title text not null,
 body text not null default '',
 entity_id uuid,
 read_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.training_audit_events (
 id uuid primary key default gen_random_uuid(),
 actor_id uuid references auth.users(id) on delete set null,
 athlete_id uuid references auth.users(id) on delete set null,
 program_id uuid references public.training_programs(id) on delete set null,
 event_type text not null,
 details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists training_programs_athlete_idx on public.training_programs(athlete_id,updated_at desc);
create index if not exists training_versions_program_idx on public.training_program_versions(program_id,version_number desc);
create index if not exists training_sessions_athlete_idx on public.training_sessions(athlete_id,started_at desc);
create index if not exists app_notifications_user_idx on public.app_notifications(user_id,created_at desc);
create or replace function public.nexfit_can_manage_program(p_program uuid)
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from training_programs p
 where p.id=p_program and (
  p.athlete_id=auth.uid()
  or (p.created_by=auth.uid() and exists(select 1 from athlete_professional_access a
      where a.athlete_id=p.athlete_id and a.professional_id=auth.uid()
      and a.status='active' and a.can_manage_programs))
 ))
$$;
create or replace function public.nexfit_can_read_program(p_program uuid)
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from training_programs p
 where p.id=p_program and (
  p.athlete_id=auth.uid()
  or (p.created_by=auth.uid() and exists(select 1 from athlete_professional_access a
      where a.athlete_id=p.athlete_id and a.professional_id=auth.uid()
      and a.status='active' and (a.can_manage_programs or a.can_view_history)))
 ))
$$;
create or replace function public.nexfit_confirm_program_version(p_version uuid)
returns void language plpgsql security definer set search_path=public as $$
declare v_program uuid; v_athlete uuid; v_old uuid;
begin
 select v.program_id,p.athlete_id,p.current_version_id into v_program,v_athlete,v_old
 from training_program_versions v join training_programs p on p.id=v.program_id
 where v.id=p_version for update of p;
 if v_program is null or v_athlete<>auth.uid() then raise exception 'Apenas o atleta pode confirmar esta versão.'; end if;
 update training_program_versions set status='archived' where id=v_old and id<>p_version;
 update training_program_versions set status='active',confirmed_at=now() where id=p_version and status='pending';
 update training_programs set current_version_id=p_version,status='active',updated_at=now() where id=v_program;
 insert into app_notifications(user_id,type,title,body,entity_id)
 select created_by,'version_confirmed','Versão confirmada','O atleta confirmou o recebimento da nova versão.',v_program
 from training_programs where id=v_program and created_by<>auth.uid();
 insert into training_audit_events(actor_id,athlete_id,program_id,event_type,details)
 values(auth.uid(),auth.uid(),v_program,'version_confirmed',jsonb_build_object('version_id',p_version,'previous_version_id',v_old));
end $$;
alter table public.athlete_professional_access enable row level security;
alter table public.training_programs enable row level security;
alter table public.training_program_versions enable row level security;
alter table public.training_subworkouts enable row level security;
alter table public.training_exercises enable row level security;
alter table public.training_sessions enable row level security;
alter table public.training_set_logs enable row level security;
alter table public.training_program_deletion_requests enable row level security;
alter table public.app_notifications enable row level security;
alter table public.training_audit_events enable row level security;

drop policy if exists access_select on public.athlete_professional_access;
create policy access_select on public.athlete_professional_access for select using (athlete_id=auth.uid() or professional_id=auth.uid());
drop policy if exists access_athlete_manage on public.athlete_professional_access;
create policy access_athlete_manage on public.athlete_professional_access for all using(athlete_id=auth.uid()) with check(athlete_id=auth.uid());
drop policy if exists access_professional_request on public.athlete_professional_access;
create policy access_professional_request on public.athlete_professional_access for insert with check(professional_id=auth.uid() and status='pending');

drop policy if exists programs_read on public.training_programs;
create policy programs_read on public.training_programs for select using(public.nexfit_can_read_program(id));
drop policy if exists programs_insert on public.training_programs;
create policy programs_insert on public.training_programs for insert with check(
 athlete_id=auth.uid() or (created_by=auth.uid() and exists(select 1 from athlete_professional_access a
 where a.athlete_id=athlete_id and a.professional_id=auth.uid() and a.status='active' and a.can_manage_programs))
);
drop policy if exists programs_update on public.training_programs;
create policy programs_update on public.training_programs for update using(public.nexfit_can_manage_program(id)) with check(public.nexfit_can_manage_program(id));
drop policy if exists versions_read on public.training_program_versions;
create policy versions_read on public.training_program_versions for select using(public.nexfit_can_read_program(program_id));
drop policy if exists versions_insert on public.training_program_versions;
create policy versions_insert on public.training_program_versions for insert with check(public.nexfit_can_manage_program(program_id) and created_by=auth.uid());
drop policy if exists versions_update on public.training_program_versions;
create policy versions_update on public.training_program_versions for update using(public.nexfit_can_manage_program(program_id)) with check(public.nexfit_can_manage_program(program_id));
drop policy if exists subworkouts_read on public.training_subworkouts;
create policy subworkouts_read on public.training_subworkouts for select using(exists(select 1 from training_program_versions v where v.id=version_id and public.nexfit_can_read_program(v.program_id)));
drop policy if exists subworkouts_manage on public.training_subworkouts;
create policy subworkouts_manage on public.training_subworkouts for all using(exists(select 1 from training_program_versions v where v.id=version_id and public.nexfit_can_manage_program(v.program_id))) with check(exists(select 1 from training_program_versions v where v.id=version_id and public.nexfit_can_manage_program(v.program_id)));
drop policy if exists exercises_read on public.training_exercises;
create policy exercises_read on public.training_exercises for select using(exists(select 1 from training_subworkouts s join training_program_versions v on v.id=s.version_id where s.id=subworkout_id and public.nexfit_can_read_program(v.program_id)));
drop policy if exists exercises_manage on public.training_exercises;
create policy exercises_manage on public.training_exercises for all using(exists(select 1 from training_subworkouts s join training_program_versions v on v.id=s.version_id where s.id=subworkout_id and public.nexfit_can_manage_program(v.program_id))) with check(exists(select 1 from training_subworkouts s join training_program_versions v on v.id=s.version_id where s.id=subworkout_id and public.nexfit_can_manage_program(v.program_id)));
drop policy if exists sessions_read on public.training_sessions;
create policy sessions_read on public.training_sessions for select using(athlete_id=auth.uid() or exists(select 1 from athlete_professional_access a where a.athlete_id=training_sessions.athlete_id and a.professional_id=auth.uid() and a.status='active' and a.can_view_history));
drop policy if exists sessions_insert on public.training_sessions;
create policy sessions_insert on public.training_sessions for insert with check(athlete_id=auth.uid() and public.nexfit_can_read_program(program_id));
drop policy if exists sessions_update on public.training_sessions;
create policy sessions_update on public.training_sessions for update using(athlete_id=auth.uid()) with check(athlete_id=auth.uid());
drop policy if exists logs_read on public.training_set_logs;
create policy logs_read on public.training_set_logs for select using(exists(select 1 from training_sessions s where s.id=session_id and (s.athlete_id=auth.uid() or exists(select 1 from athlete_professional_access a where a.athlete_id=s.athlete_id and a.professional_id=auth.uid() and a.status='active' and a.can_view_history))));
drop policy if exists logs_insert on public.training_set_logs;
create policy logs_insert on public.training_set_logs for insert with check(exists(select 1 from training_sessions s where s.id=session_id and s.athlete_id=auth.uid()));
drop policy if exists deletion_read on public.training_program_deletion_requests;
create policy deletion_read on public.training_program_deletion_requests for select using(public.nexfit_can_read_program(program_id));
drop policy if exists deletion_insert on public.training_program_deletion_requests;
create policy deletion_insert on public.training_program_deletion_requests for insert with check(requested_by=auth.uid() and exists(select 1 from training_programs p where p.id=program_id and p.created_by=auth.uid() and p.athlete_id<>auth.uid()));
drop policy if exists deletion_update on public.training_program_deletion_requests;
create policy deletion_update on public.training_program_deletion_requests for update using(exists(select 1 from training_programs p where p.id=program_id and p.athlete_id=auth.uid())) with check(exists(select 1 from training_programs p where p.id=program_id and p.athlete_id=auth.uid()));
drop policy if exists notifications_self on public.app_notifications;
create policy notifications_self on public.app_notifications for all using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists audit_read on public.training_audit_events;
create policy audit_read on public.training_audit_events for select using(athlete_id=auth.uid() or actor_id=auth.uid());
grant execute on function public.nexfit_confirm_program_version(uuid) to authenticated;
