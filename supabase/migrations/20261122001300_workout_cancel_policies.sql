-- Permite que o atleta cancele uma sessão e remova seus próprios registros.
-- Execute uma única vez no Supabase SQL Editor.
begin;

drop policy if exists sessions_delete on public.training_sessions;
create policy sessions_delete
on public.training_sessions
for delete
to authenticated
using (athlete_id = (select auth.uid()));

drop policy if exists logs_delete on public.training_set_logs;
create policy logs_delete
on public.training_set_logs
for delete
to authenticated
using (
  exists (
    select 1
    from public.training_sessions s
    where s.id = training_set_logs.session_id
      and s.athlete_id = (select auth.uid())
  )
);

grant delete on public.training_sessions, public.training_set_logs to authenticated;

commit;
