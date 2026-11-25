-- NEXFIT | Auditoria somente leitura de RLS e privilégios do catálogo
-- Execute no DBeaver antes de aplicar a migration de taxonomia.
-- Não altera dados, políticas ou privilégios.

begin;
set transaction read only;

-- 1) RLS habilitada/forçada nas tabelas existentes do catálogo.
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('training_exercise_catalog', 'training_exercises')
  and c.relkind = 'r'
order by c.relname;

-- 2) Políticas atuais: roles, operação e expressão aplicada.
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('training_exercise_catalog', 'training_exercises')
order by tablename, policyname;

-- 3) Privilégios efetivos declarados para os papéis usados pelo Supabase.
select
  table_name,
  grantee,
  privilege_type,
  is_grantable
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('training_exercise_catalog', 'training_exercises')
  and grantee in ('anon', 'authenticated', 'service_role')
order by table_name, grantee, privilege_type;

-- 4) Default privileges configurados para tabelas criadas por cada owner.
select
  owner_role.rolname as owner_role,
  schema_ns.nspname as schema_name,
  default_acl.defaclobjtype,
  default_acl.defaclacl
from pg_default_acl default_acl
join pg_roles owner_role on owner_role.oid = default_acl.defaclrole
join pg_namespace schema_ns on schema_ns.oid = default_acl.defaclnamespace
where schema_ns.nspname = 'public'
  and default_acl.defaclobjtype = 'r'
order by owner_role.rolname;

commit;
