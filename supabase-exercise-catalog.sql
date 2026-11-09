-- NEXFIT | Catálogo compartilhado de exercícios
-- Execute uma única vez no SQL Editor do Supabase antes de validar a build 20261109.36.

create table if not exists public.training_exercise_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text not null,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists training_exercise_catalog_normalized_name_uidx
  on public.training_exercise_catalog (normalized_name);

alter table public.training_exercise_catalog enable row level security;
grant select on public.training_exercise_catalog to authenticated;

drop policy if exists "Authenticated users can read exercise catalog" on public.training_exercise_catalog;
create policy "Authenticated users can read exercise catalog"
  on public.training_exercise_catalog
  for select to authenticated
  using (is_active = true);

alter table public.training_exercises
  add column if not exists catalog_exercise_id uuid
  references public.training_exercise_catalog(id) on delete set null;

-- Migra os nomes já utilizados nos treinos para o catálogo global.
-- A chave ignora caixa e espaços repetidos, evitando entradas duplicadas por digitação.
insert into public.training_exercise_catalog (name, normalized_name)
select min(trim(e.name)), lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g'))
from public.training_exercises e
where nullif(trim(e.name), '') is not null
group by lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g'))
on conflict (normalized_name) do nothing;

-- Relaciona os exercícios existentes ao item correspondente do catálogo.
update public.training_exercises e
set catalog_exercise_id = c.id
from public.training_exercise_catalog c
where e.catalog_exercise_id is null
  and lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g')) = c.normalized_name;

create index if not exists training_exercises_catalog_exercise_id_idx
  on public.training_exercises (catalog_exercise_id);

comment on table public.training_exercise_catalog is
  'Catálogo global compartilhado de exercícios; atletas selecionam itens existentes ao montar treinos.';
