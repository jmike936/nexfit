-- NEXFIT: inventário read-only de funções SECURITY DEFINER, ACLs e histórico de migrations.
-- Somente SELECT; não altera dados, schema, grants ou funções.
-- Execute no SQL Editor do Supabase e exporte todos os resultados.
-- Antes de compartilhar os resultados, revise/redija qualquer segredo eventualmente hardcoded
-- que possa aparecer no texto de uma função.

-- 1) Definições completas de todas as funções SECURITY DEFINER no schema public.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  pg_get_function_result(p.oid) as result_type,
  owner_role.rolname as function_owner,
  p.provolatile as volatility,
  p.proleakproof as leakproof,
  p.proconfig as function_settings,
  p.proacl::text as explicit_acl,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute,
  has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_can_execute,
  pg_get_functiondef(p.oid) as function_definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join pg_roles owner_role on owner_role.oid = p.proowner
where n.nspname = 'public'
  and p.prosecdef
  and p.prokind = 'f'
order by p.proname, pg_get_function_identity_arguments(p.oid);

-- 2) ACL efetiva declarada para cada função SECURITY DEFINER.
-- Grantee 0 representa PUBLIC; isso permite distinguir PUBLIC de grants diretos a anon.
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  acl.grantor::regrole::text as grantor,
  case when acl.grantee = 0 then 'PUBLIC' else grantee_role.rolname end as grantee,
  acl.privilege_type,
  acl.is_grantable
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
left join pg_roles grantee_role on grantee_role.oid = acl.grantee
where n.nspname = 'public'
  and p.prosecdef
  and p.prokind = 'f'
order by p.proname, pg_get_function_identity_arguments(p.oid), grantee, acl.privilege_type;

-- 3) Todas as funções public que anon consegue executar (inclui SECURITY INVOKER).
-- Ajuda a identificar RPCs públicas intencionais e overloads não cobertos acima.
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.prosecdef as security_definer,
  owner_role.rolname as function_owner,
  p.proconfig as function_settings,
  p.proacl::text as explicit_acl,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute,
  pg_get_functiondef(p.oid) as function_definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join pg_roles owner_role on owner_role.oid = p.proowner
where n.nspname = 'public'
  and p.prokind = 'f'
  and has_function_privilege('anon', p.oid, 'EXECUTE')
order by p.proname, pg_get_function_identity_arguments(p.oid);

-- 4) Default privileges que podem conceder EXECUTE automaticamente a PUBLIC/anon.
select
  owner_role.rolname as owner_role,
  coalesce(n.nspname, '(global)') as schema_name,
  d.defaclobjtype as object_type,
  acl.grantor::regrole::text as grantor,
  case when acl.grantee = 0 then 'PUBLIC' else grantee_role.rolname end as grantee,
  acl.privilege_type,
  acl.is_grantable
from pg_default_acl d
join pg_roles owner_role on owner_role.oid = d.defaclrole
left join pg_namespace n on n.oid = d.defaclnamespace
cross join lateral aclexplode(d.defaclacl) acl
left join pg_roles grantee_role on grantee_role.oid = acl.grantee
where d.defaclobjtype = 'f'
order by owner_role.rolname, schema_name, grantee, acl.privilege_type;

-- 5) Privilégios efetivos de anon/authenticated nas tabelas e views public.
-- RLS não substitui a necessidade de remover privilégios de escrita desnecessários.
select
  c.relname as object_name,
  c.relkind as object_kind,
  owner_role.rolname as object_owner,
  c.relacl::text as explicit_acl,
  has_table_privilege('anon', c.oid, 'SELECT') as anon_select,
  has_table_privilege('anon', c.oid, 'INSERT') as anon_insert,
  has_table_privilege('anon', c.oid, 'UPDATE') as anon_update,
  has_table_privilege('anon', c.oid, 'DELETE') as anon_delete,
  has_table_privilege('anon', c.oid, 'TRUNCATE') as anon_truncate,
  has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_select,
  has_table_privilege('authenticated', c.oid, 'INSERT') as authenticated_insert,
  has_table_privilege('authenticated', c.oid, 'UPDATE') as authenticated_update,
  has_table_privilege('authenticated', c.oid, 'DELETE') as authenticated_delete,
  has_table_privilege('authenticated', c.oid, 'TRUNCATE') as authenticated_truncate
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
join pg_roles owner_role on owner_role.oid = c.relowner
where n.nspname = 'public'
  and c.relkind in ('r', 'p', 'v', 'm', 'f')
order by c.relname;

-- 6) ACL explícita/default expandida das tabelas e views public.
select
  c.relname as object_name,
  acl.grantor::regrole::text as grantor,
  case when acl.grantee = 0 then 'PUBLIC' else grantee_role.rolname end as grantee,
  acl.privilege_type,
  acl.is_grantable
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) acl
left join pg_roles grantee_role on grantee_role.oid = acl.grantee
where n.nspname = 'public'
  and c.relkind in ('r', 'p', 'v', 'm', 'f')
order by c.relname, grantee, acl.privilege_type;

-- 7) Descobrir se o histórico padrão do Supabase existe neste projeto.
-- O resultado informa qual das consultas condicionais abaixo pode ser executada.
select
  to_regclass('supabase_migrations.schema_migrations') as supabase_migration_history,
  to_regclass('schema_migrations') as root_migration_history;

-- 8) Se supabase_migration_history (item 7) não for NULL, execute separadamente:
-- select version, name
-- from supabase_migrations.schema_migrations
-- where version like '20261123001900%'
-- order by version;
--
-- Se root_migration_history (item 7) não for NULL, inspecione antes as colunas:
-- select column_name, data_type
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'schema_migrations'
-- order by ordinal_position;
--
-- Não presuma que a ausência de uma linha em um ledger alternativo prova que a migration
-- não foi aplicada: alguns projetos aplicam SQL manualmente pelo Dashboard.
