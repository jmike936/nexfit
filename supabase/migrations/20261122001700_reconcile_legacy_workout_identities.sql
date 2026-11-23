-- NEXFIT — reconciliação conservadora de identidades históricas
-- Relaciona somente treinos de versões do MESMO programa quando:
-- 1) o título normalizado é igual;
-- 2) a composição de exercícios é idêntica (catálogo quando disponível, senão nome);
-- 3) o treino aparece uma única vez em cada versão participante.
-- Exercícios são relacionados apenas quando sua chave aparece uma única vez
-- em cada versão daquele mesmo treino lógico.
--
-- Não altera sessões, séries, prescrições, datas ou contagens. Não exclui dados.
-- Pode ser executado novamente com segurança.
-- Pré-requisitos: supabase-training-stable-identities.sql e
-- supabase-exercise-catalog.sql já aplicados.
--
-- Recomenda-se fazer backup do banco antes de qualquer migração.

begin;

create temp table nexfit_legacy_workout_identity_map on commit drop as
with exercise_keys as (
  select
    e.subworkout_id,
    case
      when e.catalog_exercise_id is not null
        then 'catalog:' || e.catalog_exercise_id::text
      else 'name:' || lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g'))
    end as exercise_key
  from public.training_exercises e
),
workout_signatures as (
  select
    subworkout_id,
    count(*) as exercise_count,
    count(distinct exercise_key) as distinct_exercise_count,
    md5(string_agg(length(exercise_key)::text || ':' || exercise_key, '|' order by exercise_key)) as signature
  from exercise_keys
  group by subworkout_id
  having count(*) > 0
     and count(*) = count(distinct exercise_key)
),
workout_rows as (
  select
    sw.id as subworkout_id,
    sw.identity_id,
    sw.version_id,
    v.program_id,
    v.version_number,
    sw.position,
    lower(regexp_replace(trim(sw.title), '[[:space:]]+', ' ', 'g')) as title_key,
    sig.signature
  from public.training_subworkouts sw
  join public.training_program_versions v on v.id = sw.version_id
  join workout_signatures sig on sig.subworkout_id = sw.id
  where nullif(trim(sw.title), '') is not null
),
eligible_groups as (
  select program_id, title_key, signature
  from workout_rows
  group by program_id, title_key, signature
  having count(*) > 1
     and count(*) = count(distinct version_id)
)
select
  w.subworkout_id,
  w.version_id,
  w.program_id,
  w.version_number,
  w.position,
  w.title_key,
  w.signature,
  first_value(w.identity_id) over (
    partition by w.program_id, w.title_key, w.signature
    order by w.version_number, w.position, w.subworkout_id
  ) as canonical_identity_id
from workout_rows w
join eligible_groups g
  on g.program_id = w.program_id
 and g.title_key = w.title_key
 and g.signature = w.signature;

create temp table nexfit_legacy_exercise_identity_map on commit drop as
with exercise_rows as (
  select
    wm.program_id,
    wm.title_key,
    wm.signature as workout_signature,
    wm.version_id,
    wm.version_number,
    e.id as exercise_id,
    e.identity_id,
    e.position,
    case
      when e.catalog_exercise_id is not null
        then 'catalog:' || e.catalog_exercise_id::text
      else 'name:' || lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g'))
    end as exercise_key
  from nexfit_legacy_workout_identity_map wm
  join public.training_exercises e on e.subworkout_id = wm.subworkout_id
),
eligible_exercises as (
  select program_id, title_key, workout_signature, exercise_key
  from exercise_rows
  group by program_id, title_key, workout_signature, exercise_key
  having count(*) > 1
     and count(*) = count(distinct version_id)
)
select
  e.exercise_id,
  first_value(e.identity_id) over (
    partition by e.program_id, e.title_key, e.workout_signature, e.exercise_key
    order by e.version_number, e.position, e.exercise_id
  ) as canonical_identity_id
from exercise_rows e
join eligible_exercises x
  on x.program_id = e.program_id
 and x.title_key = e.title_key
 and x.workout_signature = e.workout_signature
 and x.exercise_key = e.exercise_key;

-- Prévia registrada no histórico de execução do SQL Editor.
do $$
declare
  workout_rows bigint;
  exercise_rows bigint;
begin
  select count(*) into workout_rows from nexfit_legacy_workout_identity_map;
  select count(*) into exercise_rows from nexfit_legacy_exercise_identity_map;
  raise notice 'Reconciliação segura: % treinos e % exercícios candidatos. Nenhuma sessão ou série será alterada.', workout_rows, exercise_rows;
end $$;

update public.training_subworkouts sw
set identity_id = m.canonical_identity_id
from nexfit_legacy_workout_identity_map m
where sw.id = m.subworkout_id
  and sw.identity_id is distinct from m.canonical_identity_id;

update public.training_exercises e
set identity_id = m.canonical_identity_id
from nexfit_legacy_exercise_identity_map m
where e.id = m.exercise_id
  and e.identity_id is distinct from m.canonical_identity_id;

commit;

-- Conferência pós-migração: identidades repetidas entre versões do mesmo programa
-- são esperadas; dentro de uma mesma versão/subtreino continuam únicas.
select
  v.program_id,
  sw.identity_id,
  count(distinct sw.version_id) as versions_linked,
  count(*) as workout_rows
from public.training_subworkouts sw
join public.training_program_versions v on v.id = sw.version_id
group by v.program_id, sw.identity_id
having count(distinct sw.version_id) > 1
order by v.program_id, versions_linked desc;
