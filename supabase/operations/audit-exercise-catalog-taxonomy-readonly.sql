-- NEXFIT | Auditoria somente leitura da taxonomia do catálogo de exercícios
-- Execute no DBeaver conectado ao projeto Supabase desejado.
-- Objetivo: medir categorias e músculos existentes e confirmar lacunas de equipamento,
-- modalidade e padrão de movimento antes de propor alterações no schema.
-- Este arquivo contém somente consultas SELECT.

begin;
set transaction read only;

-- 1) Colunas disponíveis no catálogo: confirma quais dimensões já são estruturadas.
select
  column_name,
  data_type,
  udt_name,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'training_exercise_catalog'
order by ordinal_position;

-- 2) Distribuição das categorias atuais.
select
  coalesce(nullif(btrim(category), ''), '[sem categoria]') as categoria,
  count(*) as total,
  count(*) filter (where is_active) as ativos,
  count(*) filter (where not is_active) as inativos
from public.training_exercise_catalog
group by coalesce(nullif(btrim(category), ''), '[sem categoria]')
order by total desc, categoria;

-- 3) Frequência dos músculos principais (um registro por músculo normalizado).
select
  lower(btrim(muscle)) as musculo,
  count(*) as exercicios
from public.training_exercise_catalog c
cross join lateral unnest(coalesce(c.primary_muscles, array[]::text[])) as muscle
where c.is_active
  and nullif(btrim(muscle), '') is not null
group by lower(btrim(muscle))
order by exercicios desc, musculo;

-- 4) Frequência dos músculos secundários.
select
  lower(btrim(muscle)) as musculo,
  count(*) as exercicios
from public.training_exercise_catalog c
cross join lateral unnest(coalesce(c.secondary_muscles, array[]::text[])) as muscle
where c.is_active
  and nullif(btrim(muscle), '') is not null
group by lower(btrim(muscle))
order by exercicios desc, musculo;

-- 5) Combinações atuais de categoria e músculos principais para revisão de coerência.
select
  coalesce(nullif(btrim(category), ''), '[sem categoria]') as categoria,
  lower(btrim(muscle)) as musculo_principal,
  count(*) as exercicios,
  array_agg(name order by name) as exemplos
from public.training_exercise_catalog c
cross join lateral unnest(coalesce(c.primary_muscles, array[]::text[])) as muscle
where c.is_active
  and nullif(btrim(muscle), '') is not null
group by coalesce(nullif(btrim(category), ''), '[sem categoria]'), lower(btrim(muscle))
order by categoria, exercicios desc, musculo_principal;

-- 6) Lista completa para revisão manual de categorias ambíguas e nomenclatura.
select
  id,
  name,
  category,
  primary_muscles,
  secondary_muscles
from public.training_exercise_catalog
where is_active
order by category nulls first, name;

-- 7) Duplicidades na chave normalizada (deve retornar zero linhas).
select
  normalized_name,
  count(*) as quantidade,
  array_agg(name order by name) as nomes
from public.training_exercise_catalog
group by normalized_name
having count(*) > 1
order by quantidade desc, normalized_name;

commit;
