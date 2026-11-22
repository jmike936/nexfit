-- NEXFIT | Limpeza controlada e integridade dos registros de séries
-- Execute no SQL Editor do Supabase antes de validar a build 20261109.42.
-- Mantém a primeira gravação de cada série e remove reenvios idênticos causados por cliques repetidos.
-- Se os dados de uma mesma série divergirem, interrompe sem apagar nada para revisão manual.

begin;

do $$
declare
  conflicting_groups bigint;
  duplicate_groups bigint;
  removed_rows bigint;
  example_row record;
begin
  -- Não escolher automaticamente entre registros com cargas/repetições diferentes.
  select count(*) into conflicting_groups
  from (
    select session_id, exercise_id, set_number
    from public.training_set_logs
    group by session_id, exercise_id, set_number
    having count(*) > 1
       and count(distinct row(reps_completed, load_kg, distance_m, duration_seconds, notes)) > 1
  ) conflicts;

  if conflicting_groups > 0 then
    select session_id, exercise_id, set_number, count(*) as rows_count
      into example_row
    from public.training_set_logs
    group by session_id, exercise_id, set_number
    having count(*) > 1
       and count(distinct row(reps_completed, load_kg, distance_m, duration_seconds, notes)) > 1
    order by count(*) desc
    limit 1;

    raise exception 'Migração cancelada: existem % séries duplicadas com dados diferentes. Exemplo: sessão %, exercício %, série %, registros %. Nenhum registro foi apagado; revise essas combinações manualmente.',
      conflicting_groups, example_row.session_id, example_row.exercise_id,
      example_row.set_number, example_row.rows_count;
  end if;

  select count(*) into duplicate_groups
  from (
    select 1
    from public.training_set_logs
    group by session_id, exercise_id, set_number
    having count(*) > 1
  ) duplicates;

  -- Para reenvios idênticos, conserva a primeira gravação (menor completed_at)
  -- e remove apenas as cópias posteriores da mesma chave lógica.
  with ranked as (
    select ctid,
           row_number() over (
             partition by session_id, exercise_id, set_number
             order by completed_at asc nulls last, id asc
           ) as position
    from public.training_set_logs
  ),
  deleted as (
    delete from public.training_set_logs logs
    using ranked
    where logs.ctid = ranked.ctid
      and ranked.position > 1
    returning 1
  )
  select count(*) into removed_rows from deleted;

  raise notice 'Limpeza concluída: % combinações duplicadas verificadas; % registros repetidos removidos.', duplicate_groups, removed_rows;
end $$;

create unique index if not exists training_set_logs_session_exercise_set_uidx
  on public.training_set_logs(session_id, exercise_id, set_number);

comment on index public.training_set_logs_session_exercise_set_uidx is
  'Garante um único registro por série em cada exercício de uma sessão; permite gravação idempotente.';

commit;
