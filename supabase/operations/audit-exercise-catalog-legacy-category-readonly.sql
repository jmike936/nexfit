-- NEXFIT | Auditoria somente leitura da categoria legada versus grupo estruturado
-- Não altera dados. A coluna category é legado e não deve sobrescrever a taxonomia.

with primary_groups as (
  select
    link.catalog_exercise_id,
    string_agg(g.name, ', ' order by g.name) as primary_group,
    count(*) as primary_group_count
  from public.training_exercise_catalog_groups link
  join public.training_exercise_groups g on g.id = link.group_id
  where link.is_primary = true
  group by link.catalog_exercise_id
)
select
  c.id,
  c.name,
  c.category as legacy_category,
  coalesce(pg.primary_group, '(sem grupo principal)') as structured_primary_group,
  coalesce(pg.primary_group_count, 0) as primary_group_count,
  case
    when pg.catalog_exercise_id is null then 'REVISAR: sem grupo principal'
    when pg.primary_group_count <> 1 then 'REVISAR: cardinalidade do grupo principal'
    when nullif(trim(c.category), '') is null then 'REVISAR: categoria legada vazia'
    when lower(trim(c.category)) = lower(trim(pg.primary_group)) then 'IGUAL'
    else 'DIFERENÇA LEGADO x TAXONOMIA — avaliar, não corrigir automaticamente'
  end as audit_status
from public.training_exercise_catalog c
left join primary_groups pg on pg.catalog_exercise_id = c.id
where c.is_active = true
order by
  case when pg.catalog_exercise_id is null or coalesce(pg.primary_group_count, 0) <> 1 then 0
       when nullif(trim(c.category), '') is null then 1
       when lower(trim(c.category)) <> lower(trim(pg.primary_group)) then 2
       else 3 end,
  c.name;