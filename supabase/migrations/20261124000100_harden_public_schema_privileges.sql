-- NEXFIT: harden public-schema RPC and table privileges after production ACL audit.
-- Idempotent; preserves authenticated CRUD and service_role access.
-- The only function body change adds a fail-closed authentication guard.
begin;

-- 1) Fail closed before reading or changing any program version.
create or replace function public.nexfit_confirm_program_version(p_version uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_program uuid;
  v_athlete uuid;
  v_old uuid;
  v_description text;
  v_category text;
begin
  if auth.uid() is null then
    raise exception 'Autenticação necessária.';
  end if;

  select v.program_id, p.athlete_id, p.current_version_id, p.description
  into v_program, v_athlete, v_old, v_description
  from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  where v.id = p_version
  for update of p;

  if v_program is null or v_athlete is distinct from auth.uid() then
    raise exception 'Apenas o atleta pode confirmar esta versão.';
  end if;

  v_category := lower(trim(coalesce(
    substring(v_description from '\[MODALIDADE:\s*([^\]]+)\]'),
    'Musculação'
  )));

  if exists (
    select 1
    from public.training_programs p
    where p.athlete_id = v_athlete
      and p.id <> v_program
      and p.status = 'active'
      and lower(trim(coalesce(
        substring(p.description from '\[MODALIDADE:\s*([^\]]+)\]'),
        'Musculação'
      ))) = v_category
  ) then
    raise exception 'Já existe um programa vigente nesta categoria. Arquive o programa atual antes de confirmar o novo.';
  end if;

  update public.training_program_versions
  set status = 'archived'
  where id = v_old and id <> p_version;

  update public.training_program_versions
  set status = 'active', confirmed_at = now()
  where id = p_version and status = 'pending';

  update public.training_programs
  set current_version_id = p_version, status = 'active', updated_at = now()
  where id = v_program;

  insert into public.app_notifications(user_id, type, title, body, entity_id)
  select created_by, 'version_confirmed', 'Versão confirmada',
         'O atleta confirmou o recebimento da nova versão.', v_program
  from public.training_programs
  where id = v_program and created_by <> auth.uid();

  insert into public.training_audit_events(actor_id, athlete_id, program_id, event_type, details)
  values (
    auth.uid(), auth.uid(), v_program, 'version_confirmed',
    jsonb_build_object('version_id', p_version, 'previous_version_id', v_old)
  );
end;
$function$;

-- 2) Restrict every audited SECURITY DEFINER RPC that exists in this database.
-- A few legacy workout RPCs exist in the production database but are intentionally
-- absent from the clean-install migration chain; to_regprocedure keeps fresh installs
-- idempotent while still hardening those functions when present.
do $$
declare
  function_signature text;
  function_oid regprocedure;
begin
  foreach function_signature in array array[
    'public.activate_workout_plan(uuid)',
    'public.can_access_workout_plan(uuid,boolean)',
    'public.nexfit_can_manage_program(uuid)',
    'public.nexfit_can_read_program(uuid)',
    'public.nexfit_confirm_program_version(uuid)',
    'public.nexfit_copy_public_program(uuid)',
    'public.nexfit_create_own_program(text,text,text)',
    'public.nexfit_create_program_for_athlete(text,text,text)',
    'public.nexfit_is_admin()',
    'public.nexfit_request_access_by_email(text)',
    'public.share_workout_by_email(uuid,text,text)'
  ] loop
    function_oid := to_regprocedure(function_signature);
    if function_oid is not null then
      execute format('revoke execute on function %s from public, anon', function_oid);
      execute format('grant execute on function %s to authenticated, service_role', function_oid);
    end if;
  end loop;
end
$$;

-- 3) The audit showed no anon-specific RLS policies that return useful data:
-- the public-role policies are all bound to auth.uid(), which is NULL for anon.
-- Remove anon table privileges entirely; authenticated CRUD remains unchanged.
revoke all privileges on all tables in schema public from anon;

-- Authenticated users need row-level CRUD, not table/DDL administration.
revoke truncate, references, trigger on all tables in schema public from authenticated;
-- MAINTAIN is available only on PostgreSQL 17+ (the production audit reports it).
do $$
begin
  if current_setting('server_version_num')::integer >= 170000 then
    execute 'revoke maintain on all tables in schema public from authenticated';
  end if;
end
$$;

-- 4) Stop implicit PUBLIC EXECUTE globally, then remove role-specific defaults in public.
-- PostgreSQL schema-level REVOKE cannot subtract a privilege inherited from global defaults.
-- Every future RPC must receive an explicit, reviewed GRANT.
alter default privileges for role postgres
  revoke execute on functions from public;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated;

-- Some Supabase installations create functions as supabase_admin. Only alter that
-- role's defaults when the migration runner is allowed to manage its privileges.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_admin') then
    if pg_has_role(current_user, 'supabase_admin', 'MEMBER') then
      execute 'alter default privileges for role supabase_admin revoke execute on functions from public';
      execute 'alter default privileges for role supabase_admin in schema public revoke execute on functions from anon, authenticated';
    else
      raise warning 'Não foi possível alterar os privilégios padrão de supabase_admin. Execute a correção complementar como supabase_admin ou membro desse papel.';
    end if;
  end if;
end
$$;

commit;
