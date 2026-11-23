-- NEXFIT: programas públicos, exploração em Modelos e cópia independente.
-- Execute no SQL Editor do Supabase após integrar a alteração do app.

alter table public.training_programs
  add column if not exists is_public boolean not null default false;

alter table public.training_programs
  add column if not exists source_program_id uuid
  references public.training_programs(id) on delete set null;

create index if not exists training_programs_public_models_idx
  on public.training_programs(updated_at desc)
  where is_public = true and status = 'active';

create or replace function public.nexfit_can_read_program(p_program uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.training_programs p
    where p.id = p_program
      and (
        (p.is_public and p.status = 'active')
        or p.athlete_id = auth.uid()
        or (
          p.created_by = auth.uid()
          and exists (
            select 1 from public.athlete_professional_access a
            where a.athlete_id = p.athlete_id
              and a.professional_id = auth.uid()
              and a.status = 'active'
              and (a.can_manage_programs or a.can_view_history)
          )
        )
      )
  );
$$;

drop policy if exists programs_read on public.training_programs;
create policy programs_read
on public.training_programs for select to authenticated
using (public.nexfit_can_read_program(id));

create or replace function public.nexfit_copy_public_program(p_program uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_origin public.training_programs%rowtype;
  v_origin_version uuid;
  v_new_program uuid;
  v_new_version uuid;
  v_new_workout uuid;
  v_category text;
  v_existing text;
  v_workout record;
  v_exercise record;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'Faça login para adicionar um programa ao seu perfil.';
  end if;

  select * into v_origin
  from public.training_programs p
  where p.id = p_program
    and p.status = 'active'
    and p.is_public = true;

  if not found then
    raise exception 'Este programa não está público ou não está mais disponível.';
  end if;

  select v.id into v_origin_version
  from public.training_program_versions v
  where v.id = v_origin.current_version_id
    and v.program_id = v_origin.id
    and v.status = 'active';

  if v_origin_version is null then
    raise exception 'O programa público ainda não possui uma versão vigente.';
  end if;

  v_category := lower(trim(coalesce(
    substring(v_origin.description from '\[MODALIDADE:\s*([^\]]+)\]'),
    'Musculação'
  )));

  select p.title into v_existing
  from public.training_programs p
  where p.athlete_id = v_user
    and p.status = 'active'
    and lower(trim(coalesce(
      substring(p.description from '\[MODALIDADE:\s*([^\]]+)\]'),
      'Musculação'
    ))) = v_category
  limit 1;

  if v_existing is not null then
    raise exception 'Você já possui um programa vigente nesta categoria: "%". Arquive-o antes de adicionar este modelo.', v_existing;
  end if;

  insert into public.training_programs
    (athlete_id, created_by, title, description, status, is_public, source_program_id)
  values
    (v_user, v_user, v_origin.title, v_origin.description, 'active', false, v_origin.id)
  returning id into v_new_program;

  insert into public.training_program_versions
    (program_id, version_number, created_by, change_note, status)
  values
    (v_new_program, 1, v_user, 'Cópia independente de programa público', 'active')
  returning id into v_new_version;

  update public.training_programs
  set current_version_id = v_new_version, updated_at = now()
  where id = v_new_program;

  for v_workout in
    select * from public.training_subworkouts
    where version_id = v_origin_version
    order by position
  loop
    insert into public.training_subworkouts(version_id, title, description, position)
    values (v_new_version, v_workout.title, v_workout.description, v_workout.position)
    returning id into v_new_workout;

    for v_exercise in
      select * from public.training_exercises
      where subworkout_id = v_workout.id
      order by position
    loop
      insert into public.training_exercises
        (subworkout_id, name, position, sets, rest_seconds, notes, media_url)
      values
        (v_new_workout, v_exercise.name, v_exercise.position, v_exercise.sets,
         v_exercise.rest_seconds, v_exercise.notes, v_exercise.media_url);
    end loop;
  end loop;

  return v_new_program;
end;
$$;

revoke all on function public.nexfit_copy_public_program(uuid) from public;
grant execute on function public.nexfit_copy_public_program(uuid) to authenticated;
