-- NEXFIT: criação própria de programa em uma única operação segura.
-- Execute no SQL Editor do Supabase após integrar a alteração do app.
-- A RPC cria programa e versão vigente sem depender de INSERT/UPDATE direto sob RLS.

create or replace function public.nexfit_create_own_program(
  p_title text,
  p_category text,
  p_description text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_program uuid;
  v_version uuid;
  v_category text;
  v_existing text;
  v_description text;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'Autenticação necessária.';
  end if;
  if nullif(trim(p_title), '') is null then
    raise exception 'Informe o nome do programa.';
  end if;

  v_category := lower(trim(coalesce(nullif(trim(p_category), ''), 'Musculação')));
  v_description := '[MODALIDADE: ' || coalesce(nullif(trim(p_category), ''), 'Musculação') || ']'
    || case when nullif(trim(p_description), '') is null then '' else ' ' || trim(p_description) end;

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
    raise exception 'Já existe um programa vigente na categoria selecionada: "%". Edite ou arquive esse programa antes de criar outro.', v_existing;
  end if;

  insert into public.training_programs(athlete_id, created_by, title, description, status)
  values (v_user, v_user, trim(p_title), v_description, 'active')
  returning id into v_program;

  insert into public.training_program_versions(program_id, version_number, created_by, change_note, status)
  values (v_program, 1, v_user, 'Versão inicial', 'active')
  returning id into v_version;

  update public.training_programs
  set current_version_id = v_version, updated_at = now()
  where id = v_program;

  return v_program;
end;
$$;

revoke all on function public.nexfit_create_own_program(text, text, text) from public;
grant execute on function public.nexfit_create_own_program(text, text, text) to authenticated;
