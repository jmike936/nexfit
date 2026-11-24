-- NEXFIT | RPE/RIR opcionais por série.
-- Aplique esta migration antes de publicar a versão do frontend que envia os campos.
-- Não altera registros existentes: ambas as colunas começam como NULL.

alter table public.training_set_logs
  add column if not exists rpe numeric(3,1),
  add column if not exists rir numeric(3,1);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'training_set_logs_rpe_range_check'
      and conrelid = 'public.training_set_logs'::regclass
  ) then
    alter table public.training_set_logs
      add constraint training_set_logs_rpe_range_check
      check (rpe is null or rpe between 1 and 10);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'training_set_logs_rir_range_check'
      and conrelid = 'public.training_set_logs'::regclass
  ) then
    alter table public.training_set_logs
      add constraint training_set_logs_rir_range_check
      check (rir is null or rir between 0 and 10);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'training_set_logs_rpe_rir_exclusive_check'
      and conrelid = 'public.training_set_logs'::regclass
  ) then
    alter table public.training_set_logs
      add constraint training_set_logs_rpe_rir_exclusive_check
      check (rpe is null or rir is null);
  end if;
end
$$;

comment on column public.training_set_logs.rpe is
  'Percepção subjetiva de esforço da série, escala de 1,0 a 10,0; opcional.';
comment on column public.training_set_logs.rir is
  'Repetições em reserva estimadas ao fim da série, escala de 0,0 a 10,0; opcional.';
