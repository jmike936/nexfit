-- NEXFIT: garantir no máximo uma versão pendente por programa.
-- Se houver pendências antigas duplicadas, preserva a mais recente e arquiva as demais.
begin;

with ranked_pending as (
  select
    id,
    row_number() over (
      partition by program_id
      order by version_number desc, created_at desc, id desc
    ) as position
  from public.training_program_versions
  where status = 'pending'
)
update public.training_program_versions v
set
  status = 'archived',
  change_note = concat_ws(
    ' ',
    nullif(trim(v.change_note), ''),
    'Arquivada automaticamente: havia outra versão pendente mais recente.'
  )
from ranked_pending r
where r.id = v.id
  and r.position > 1;

create unique index if not exists training_program_versions_one_pending_uidx
  on public.training_program_versions(program_id)
  where status = 'pending';

commit;
