-- EMERGENCY ROLLBACK ONLY.
-- Restores the pre-hardening ACLs observed in the production audit, including the
-- insecure anon/PUBLIC grants. Running this script intentionally reopens those risks.
-- It also restores the original nullable-auth check in nexfit_confirm_program_version.
begin;

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
  select v.program_id, p.athlete_id, p.current_version_id, p.description
  into v_program, v_athlete, v_old, v_description
  from public.training_program_versions v
  join public.training_programs p on p.id = v.program_id
  where v.id = p_version
  for update of p;

  if v_program is null or v_athlete <> auth.uid() then
    raise exception 'Apenas o atleta pode confirmar esta versão.';
  end if;

  v_category := lower(trim(coalesce(
    substring(v_description from '\\[MODALIDADE:\\s*([^\\]]+)\\]'),
    'Musculação'
  )));

  if exists (
    select 1
    from public.training_programs p
    where p.athlete_id = v_athlete
      and p.id <> v_program
      and p.status = 'active'
      and lower(trim(coalesce(
        substring(p.description from '\\[MODALIDADE:\\s*([^\\]]+)\\]'),
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

-- Restore direct anon and former PUBLIC execution grants from the audit.
grant execute on function public.activate_workout_plan(uuid) to anon;
grant execute on function public.can_access_workout_plan(uuid, boolean) to anon, public;
grant execute on function public.nexfit_can_manage_program(uuid) to anon, public;
grant execute on function public.nexfit_can_read_program(uuid) to anon, public;
grant execute on function public.nexfit_confirm_program_version(uuid) to anon;
grant execute on function public.nexfit_copy_public_program(uuid) to anon;
grant execute on function public.nexfit_create_own_program(text, text, text) to anon;
grant execute on function public.nexfit_create_program_for_athlete(text, text, text) to anon;
grant execute on function public.nexfit_is_admin() to anon;
grant execute on function public.nexfit_request_access_by_email(text) to anon, public;
grant execute on function public.share_workout_by_email(uuid, text, text) to anon;

grant all privileges on all tables in schema public to anon;
grant truncate, references, trigger on all tables in schema public to authenticated;
do $$
begin
  if current_setting('server_version_num')::integer >= 170000 then
    execute 'grant maintain on all tables in schema public to authenticated';
  end if;
end
$$;

alter default privileges for role postgres in schema public
  grant execute on functions to anon, authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_admin')
     and pg_has_role(current_user, 'supabase_admin', 'MEMBER') then
    execute 'alter default privileges for role supabase_admin in schema public grant execute on functions to anon, authenticated';
  end if;
end
$$;

commit;
