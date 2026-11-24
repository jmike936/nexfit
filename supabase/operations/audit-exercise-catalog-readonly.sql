-- NEXFIT | Auditoria somente leitura do catálogo de exercícios
-- Execute no DBeaver conectado ao projeto Supabase desejado.
-- Este arquivo contém somente SELECT e não altera dados, schema ou permissões.

begin;
set transaction read only;

-- 1) Estrutura efetivamente disponível no catálogo e nos exercícios dos treinos.
select
  table_name,
  column_name,
  data_type,
  udt_name,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('training_exercise_catalog', 'training_exercises')
order by table_name, ordinal_position;

-- 2) Volume e preenchimento dos metadados do catálogo.
select
  count(*) as total_catalogo,
  count(*) filter (where is_active) as ativos,
  count(*) filter (where not is_active) as inativos,
  count(*) filter (where nullif(btrim(name), '') is null) as sem_nome,
  count(*) filter (where nullif(btrim(category), '') is null) as sem_categoria,
  count(*) filter (where coalesce(cardinality(primary_muscles), 0) = 0) as sem_musculos_principais,
  count(*) filter (where coalesce(cardinality(secondary_muscles), 0) = 0) as sem_musculos_secundarios,
  count(*) filter (where nullif(btrim(execution_instructions), '') is null) as sem_instrucoes,
  count(*) filter (where nullif(btrim(demonstration_image_url), '') is null) as sem_imagem_inicial,
  count(*) filter (where nullif(btrim(demonstration_end_image_url), '') is null) as sem_imagem_final
from public.training_exercise_catalog;

-- 3) Cobertura por grupo muscular/categoria.
select
  coalesce(nullif(btrim(category), ''), '[sem categoria]') as categoria,
  count(*) as total,
  count(*) filter (where coalesce(cardinality(primary_muscles), 0) > 0) as com_musculos_principais,
  count(*) filter (where coalesce(cardinality(secondary_muscles), 0) > 0) as com_musculos_secundarios,
  count(*) filter (where nullif(btrim(execution_instructions), '') is not null) as com_instrucoes,
  count(*) filter (where nullif(btrim(demonstration_image_url), '') is not null) as com_imagem_inicial,
  count(*) filter (where nullif(btrim(demonstration_end_image_url), '') is not null) as com_imagem_final
from public.training_exercise_catalog
where is_active
group by coalesce(nullif(btrim(category), ''), '[sem categoria]')
order by total desc, categoria;

-- 4) Lista priorizada de exercícios ativos com lacunas de conteúdo.
select
  id,
  name,
  category,
  primary_muscles,
  secondary_muscles,
  (nullif(btrim(execution_instructions), '') is not null) as tem_instrucoes,
  (nullif(btrim(demonstration_image_url), '') is not null) as tem_imagem_inicial,
  (nullif(btrim(demonstration_end_image_url), '') is not null) as tem_imagem_final
from public.training_exercise_catalog
where is_active
  and (
    nullif(btrim(category), '') is null
    or coalesce(cardinality(primary_muscles), 0) = 0
    or nullif(btrim(execution_instructions), '') is null
    or nullif(btrim(demonstration_image_url), '') is null
    or nullif(btrim(demonstration_end_image_url), '') is null
  )
order by category nulls first, name
limit 500;

-- 5) Verifica duplicidades da chave normalizada (o índice único deve impedir casos).
select
  normalized_name,
  count(*) as quantidade,
  array_agg(name order by name) as nomes
from public.training_exercise_catalog
group by normalized_name
having count(*) > 1
order by quantidade desc, normalized_name;

-- 6) Cobertura dos vínculos dos exercícios usados nos treinos.
select
  count(*) as total_exercicios_em_treinos,
  count(*) filter (where e.catalog_exercise_id is not null) as vinculados_ao_catalogo,
  count(*) filter (where e.catalog_exercise_id is null) as sem_vinculo_catalogo,
  count(*) filter (where e.catalog_exercise_id is not null and c.id is null) as vinculo_orfao
from public.training_exercises e
left join public.training_exercise_catalog c
  on c.id = e.catalog_exercise_id;

-- 7) Exemplos de exercícios dos treinos ainda sem vínculo ao catálogo.
select e.id, e.name, e.created_at
from public.training_exercises e
where e.catalog_exercise_id is null
order by e.name
limit 300;

commit;
