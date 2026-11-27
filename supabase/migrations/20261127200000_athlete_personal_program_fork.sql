-- NEXFIT | Cópia pessoal de programa atribuído ao atleta.
-- Cria um programa independente sem alterar a origem nem suas versões.
-- Sessões e séries existentes permanecem vinculadas ao programa original.
-- Identidades lógicas são preservadas para manter continuidade de evolução.

begin;

create unique index if not exists training_programs_one_active_personal_fork_uidx
  on public.training_programs(athlete_id, source_program_id)
  where source_program_id is not null and status = 'active';

create or replace function public.nexfit_fork_assigned_program(p_program uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
  v_source public.training_programs%rowtype;
  v_source_version uuid;
  v_existing uuid;
  v_new_program uuid;
  v_new_version uuid;
  v_new_workout uuid;
  v_category text;
  v_duplicate text;
  v_workout record;
  v_exercise record;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'Autenticação necessária.';
  end if;

  select p.* into v_source
  from public.training_programs p
  where p.id = p_program
    and p.athlete_id = v_user
    and p.created_by <> v_user
    and p.source_program_id is null
    and p.status = 'active'
  for update;

  if not found then
    raise exception 'Programa compartilhado não encontrado ou não disponível para personalização.';
  end if;

  -- A operação é idempotente: uma cópia pessoal ativa por programa de origem.
  select p.id into v_existing
  from public.training_programs p
  where p.athlete_id = v_user
    and p.created_by = v_user
    and p.source_program_id = v_source.id
    and p.status = 'active'
  order by p.updated_at desc, p.id
  limit 1;

  if v_existing is not null then
    return v_existing;
  end if;

  select v.id into v_source_version
  from public.training_program_versions v
  where v.id = v_source.current_version_id
    and v.program_id = v_source.id
    and v.status = 'active';

  if v_source_version is null then
    raise exception 'O programa compartilhado não possui uma versão vigente.';
  end if;

  v_category := lower(trim(coalesce(
    substring(v_source.description from '\[MODALIDADE:\s*([^\]]+)\]'),
    'Musculação'
  )));

  select p.title into v_duplicate
  from public.training_programs p
  where p.athlete_id = v_user
    and p.status = 'active'
    and p.id <> v_source.id
    and lower(trim(coalesce(
      substring(p.description from '\[MODALIDADE:\s*([^\]]+)\]'),
      'Musculação'
    ))) = v_category
    and p.source_program_id is distinct from v_source.id
  limit 1;

  if v_duplicate is not null then
    raise exception 'Já existe outro programa vigente nesta categoria: "%". Arquive-o antes de personalizar este programa.', v_duplicate;
  end if;

  insert into public.training_programs
    (athlete_id, created_by, title, description, status, is_public, source_program_id)
  values
    (v_user, v_user, v_source.title, v_source.description, 'active', false, v_source.id)
  returning id into v_new_program;

  insert into public.training_program_versions
    (program_id, version_number, created_by, change_note, status)
  values
    (v_new_program, 1, v_user, 'Cópia pessoal independente', 'active')
  returning id into v_new_version;

  update public.training_programs
  set current_version_id = v_new_version, updated_at = now()
  where id = v_new_program;

  for v_workout in
    select sw.*
    from public.training_subworkouts sw
    where sw.version_id = v_source_version
    order by sw.position
  loop
    insert into public.training_subworkouts
      (version_id, identity_id, title, description, position)
    values
      (v_new_version, v_workout.identity_id, v_workout.title, v_workout.description, v_workout.position)
    returning id into v_new_workout;

    for v_exercise in
      select e.*
      from public.training_exercises e
      where e.subworkout_id = v_workout.id
      order by e.position
    loop
      insert into public.training_exercises
        (subworkout_id, identity_id, catalog_exercise_id, name, position, sets,
         rest_seconds, notes, media_url, media_end_url, execution_instructions,
         primary_muscles, secondary_muscles)
      values
        (v_new_workout, v_exercise.identity_id, v_exercise.catalog_exercise_id,
         v_exercise.name, v_exercise.position, v_exercise.sets, v_exercise.rest_seconds,
         v_exercise.notes, v_exercise.media_url, v_exercise.media_end_url,
         v_exercise.execution_instructions, v_exercise.primary_muscles,
         v_exercise.secondary_muscles);
    end loop;
  end loop;

  insert into public.app_notifications(user_id, type, title, body, entity_id)
  values (
    v_source.created_by,
    'program_personalized',
    'Cópia pessoal criada',
    'O atleta criou uma cópia independente do programa. O programa original permanece inalterado.',
    v_new_program
  );

  insert into public.training_audit_events(actor_id, athlete_id, program_id, event_type, details)
  values (
    v_user, v_user, v_new_program, 'program_personalized',
    jsonb_build_object('source_program_id', v_source.id, 'source_version_id', v_source_version)
  );

  return v_new_program;
end;
$$;

revoke all on function public.nexfit_fork_assigned_program(uuid) from public;
grant execute on function public.nexfit_fork_assigned_program(uuid) to authenticated;

-- A confirmação de versões pessoais deve ignorar somente o programa de origem.
-- Outros programas ativos da mesma categoria continuam bloqueando a confirmação.
create or replace function public.nexfit_confirm_program_version(p_version uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
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
    substring(v_description from '\[MODALIDADE:\s*([^\]]+)\]'),
    'Musculação'
  )));

  if exists (
    select 1
    from public.training_programs p
    where p.athlete_id = v_athlete
      and p.id <> v_program
      and p.id is distinct from (
        select source_program_id from public.training_programs where id = v_program
      )
      and p.status = 'active'
      and lower(trim(coalesce(
        substring(p.description from '\[MODALIDADE:\s*([^\]]+)\]'),
        'Musculação'
      ))) = v_category
  ) then
    raise exception 'Já existe um programa vigente nesta categoria. Arquive o programa atual antes de confirmar a nova versão.';
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
$$;

revoke all on function public.nexfit_confirm_program_version(uuid) from public;
grant execute on function public.nexfit_confirm_program_version(uuid) to authenticated;

commit;
