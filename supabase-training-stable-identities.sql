-- NEXFIT: identidade estável de treinos e exercícios entre versões.
-- Execute uma vez no SQL Editor do Supabase antes de publicar o build 20261119.78.
-- Registros existentes recebem uma identidade própria; novas versões preservam essa identidade ao copiar.

alter table public.training_subworkouts
  add column if not exists identity_id uuid not null default gen_random_uuid();

alter table public.training_exercises
  add column if not exists identity_id uuid not null default gen_random_uuid();

create unique index if not exists training_subworkouts_version_identity_uidx
  on public.training_subworkouts(version_id, identity_id);

create unique index if not exists training_exercises_subworkout_identity_uidx
  on public.training_exercises(subworkout_id, identity_id);

comment on column public.training_subworkouts.identity_id is
  'Identidade lógica do treino preservada ao copiá-lo entre versões do mesmo programa.';
comment on column public.training_exercises.identity_id is
  'Identidade lógica do exercício preservada ao copiá-lo entre versões do mesmo treino.';
