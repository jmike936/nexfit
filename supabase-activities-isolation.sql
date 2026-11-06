-- NEXFIT: isolamento obrigatório das atividades por usuário autenticado.
-- Execute este arquivo no SQL Editor do Supabase antes de publicar a Build 20261106.1.
-- Remove políticas antigas/adicionais da tabela para evitar que uma política permissiva
-- legada (OR entre políticas permissivas) exponha atividades de outros perfis.
alter table public.activities enable row level security;
alter table public.activities force row level security;

do $$
declare policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'activities'
  loop
    execute format('drop policy if exists %I on public.activities', policy_row.policyname);
  end loop;
end $$;

create policy activities_select_own
  on public.activities for select to authenticated
  using (user_id = (select auth.uid()));

create policy activities_insert_own
  on public.activities for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy activities_update_own
  on public.activities for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy activities_delete_own
  on public.activities for delete to authenticated
  using (user_id = (select auth.uid()));

create index if not exists activities_user_date_idx
  on public.activities(user_id, activity_date desc);
