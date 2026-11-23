-- NEXFIT | Read-only RLS, Storage and SECURITY DEFINER diagnostic.
-- SAFE: this file contains SELECT statements only. It does not change schema or data.
-- Run in the Supabase SQL Editor with an administrative role and review the result sets.

-- 1) RLS state for every table in public, auth and storage.
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  c.relkind AS relation_kind,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS force_rls,
  pg_get_userbyid(c.relowner) AS table_owner
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('public','auth','storage')
  AND c.relkind IN ('r','p')
ORDER BY n.nspname,c.relname;

-- 2) Complete policy inventory. Multiple PERMISSIVE policies combine with OR.
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check
FROM pg_policies
WHERE schemaname IN ('public','auth','storage')
ORDER BY schemaname,tablename,cmd,policyname;

-- 3) SECURITY DEFINER functions and effective EXECUTE access.
-- Pay particular attention to anon_can_execute and functions without a fixed search_path.
SELECT
  n.nspname AS schema_name,
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS arguments,
  pg_get_userbyid(p.proowner) AS owner,
  p.prosecdef AS security_definer,
  p.proconfig AS function_settings,
  COALESCE(
    array_agg(DISTINCT CASE WHEN acl.grantee = 0 THEN 'PUBLIC' ELSE pg_get_userbyid(acl.grantee) END)
      FILTER (WHERE acl.privilege_type = 'EXECUTE'),
    ARRAY[]::text[]
  ) AS execute_grantees,
  has_function_privilege('anon',p.oid,'EXECUTE') AS anon_can_execute,
  has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_can_execute,
  has_function_privilege('service_role',p.oid,'EXECUTE') AS service_role_can_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid=p.pronamespace
LEFT JOIN LATERAL aclexplode(COALESCE(p.proacl,acldefault('f',p.proowner))) acl ON true
WHERE p.prosecdef
  AND n.nspname IN ('public','auth','storage')
GROUP BY n.nspname,p.proname,p.oid,p.proowner,p.prosecdef,p.proconfig
ORDER BY n.nspname,p.proname,arguments;

-- 4) Effective table grants to the standard Supabase API roles.
SELECT grantee,table_schema,table_name,privilege_type
FROM information_schema.role_table_grants
WHERE grantee IN ('anon','authenticated','service_role')
  AND table_schema IN ('public','auth','storage')
ORDER BY table_schema,table_name,grantee,privilege_type;

-- 5) Storage bucket visibility and upload constraints.
SELECT id,name,public,file_size_limit,allowed_mime_types
FROM storage.buckets
ORDER BY id;

-- 6) Auth triggers that can affect signup/profile creation.
SELECT trigger_schema,event_object_schema,event_object_table,trigger_name,action_statement
FROM information_schema.triggers
WHERE event_object_schema='auth'
ORDER BY event_object_table,trigger_name;
