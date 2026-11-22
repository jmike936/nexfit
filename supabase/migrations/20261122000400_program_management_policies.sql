-- NEXFIT: permissões e RPC para profissionais gerenciarem programas de atletas.
-- Execute uma vez no SQL Editor do Supabase.
-- A função RPC usa SECURITY DEFINER e valida a autorização antes de inserir.

alter table public.training_programs enable row level security;

drop policy if exists programs_insert on public.training_programs;
create policy programs_insert
on public.training_programs for insert to authenticated
with check (
  (athlete_id = auth.uid() and created_by = auth.uid())
  or (
    created_by = auth.uid()
    and exists (
      select 1
      from public.athlete_professional_access a
      where a.athlete_id = training_programs.athlete_id
        and a.professional_id = auth.uid()
        and a.status = 'active'
        and a.can_manage_programs
    )
  )
);

create or replace function public.nexfit_create_program_for_athlete(
  p_email text,
  p_title text,
  p_description text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_athlete uuid;
  v_program uuid;
  v_version uuid;
begin
  if auth.uid() is null then
    raise exception 'Autenticação necessária.';
  end if;
  if nullif(trim(p_title), '') is null then
    raise exception 'Informe o nome do programa.';
  end if;

  select id into v_athlete
  from auth.users
  where lower(email) = lower(trim(p_email))
  limit 1;

  if v_athlete is null then
    raise exception 'Atleta não encontrado.';
  end if;

  if not exists (
    select 1 from public.athlete_professional_access a
    where a.athlete_id = v_athlete
      and a.professional_id = auth.uid()
      and a.status = 'active'
      and a.can_manage_programs
  ) then
    raise exception 'O atleta ainda não autorizou a gestão de programas.';
  end if;

  insert into public.training_programs
    (athlete_id, created_by, title, description, status)
  values
    (v_athlete, auth.uid(), trim(p_title), nullif(trim(p_description), ''), 'pending')
  returning id into v_program;

  insert into public.training_program_versions
    (program_id, version_number, created_by, change_note, status)
  values
    (v_program, 1, auth.uid(), 'Versão inicial', 'pending')
  returning id into v_version;

  update public.training_programs
  set current_version_id = v_version, updated_at = now()
  where id = v_program;

  insert into public.app_notifications(user_id, type, title, body, entity_id)
  values (
    v_athlete,
    'program_received',
    'Novo programa recebido',
    'Um profissional enviou um programa para sua análise.',
    v_program
  );

  return v_program;
end;
$$;

revoke all on function public.nexfit_create_program_for_athlete(text, text, text) from public;
grant execute on function public.nexfit_create_program_for_athlete(text, text, text) to authenticated;

-- Evita ativar um segundo programa vigente na mesma categoria.
create or replace function public.nexfit_confirm_program_version(p_version uuid)
returns void
language plpgsql
security definer
set search_path = public
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
$$;

revoke all on function public.nexfit_confirm_program_version(uuid) from public;
grant execute on function public.nexfit_confirm_program_version(uuid) to authenticated;
