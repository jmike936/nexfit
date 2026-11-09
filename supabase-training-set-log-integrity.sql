-- NEXFIT | Integridade dos registros de séries
-- Execute no SQL Editor do Supabase ANTES de validar a build 20261109.42.
-- Impede que o mesmo número de série seja gravado duas vezes na mesma sessão/exercício.
-- A verificação inicial interrompe a migração caso já existam duplicidades, sem apagar dados.

do $$
declare
  duplicate_count bigint;
  example_row record;
begin
  select count(*) into duplicate_count
  from (
    select session_id, exercise_id, set_number
    from public.training_set_logs
    group by session_id, exercise_id, set_number
    having count(*) > 1
  ) duplicates;

  if duplicate_count > 0 then
    select session_id, exercise_id, set_number, count(*) as rows_count
    into example_row
    from public.training_set_logs
    group by session_id, exercise_id, set_number
    having count(*) > 1
    order by count(*) desc
    limit 1;

    raise exception 'Migração cancelada: existem % combinações de séries duplicadas. Exemplo: sessão %, exercício %, série %, registros %. Revise os dados antes de criar o índice; nenhum registro foi apagado.',
      duplicate_count, example_row.session_id, example_row.exercise_id,
      example_row.set_number, example_row.rows_count;
  end if;
end $$;

create unique index if not exists training_set_logs_session_exercise_set_uidx
  on public.training_set_logs(session_id, exercise_id, set_number);

comment on index public.training_set_logs_session_exercise_set_uidx is
  'Garante um único registro por série em cada exercício de uma sessão; permite sincronização idempotente.';
