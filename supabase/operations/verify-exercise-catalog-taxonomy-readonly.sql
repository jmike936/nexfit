-- NEXFIT | Verificação pós-migration da taxonomia do catálogo
-- Somente leitura. Executar em ambiente de teste após aplicar
-- 20261125000100_exercise_catalog_taxonomy.sql.
-- Não substitui testes de API/PostgREST com JWT anon e authenticated.

BEGIN;
SET TRANSACTION READ ONLY;

-- 1) Existência das oito tabelas e estado de RLS.
WITH expected(table_name) AS (
  VALUES
    ('training_exercise_groups'),
    ('training_exercise_modalities'),
    ('training_exercise_equipment'),
    ('training_movement_patterns'),
    ('training_exercise_catalog_groups'),
    ('training_exercise_catalog_modalities'),
    ('training_exercise_catalog_equipment'),
    ('training_exercise_catalog_movement_patterns')
)
SELECT
  e.table_name,
  (c.oid IS NOT NULL) AS table_exists,
  COALESCE(c.relrowsecurity, false) AS rls_enabled,
  COALESCE(c.relforcerowsecurity, false) AS rls_forced
FROM expected e
LEFT JOIN pg_namespace n ON n.nspname = 'public'
LEFT JOIN pg_class c
  ON c.relnamespace = n.oid
 AND c.relname = e.table_name
 AND c.relkind = 'r'
ORDER BY e.table_name;

-- 2) Políticas: deve existir somente SELECT para authenticated, sem policy para anon.
SELECT
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'training_exercise_groups',
    'training_exercise_modalities',
    'training_exercise_equipment',
    'training_movement_patterns',
    'training_exercise_catalog_groups',
    'training_exercise_catalog_modalities',
    'training_exercise_catalog_equipment',
    'training_exercise_catalog_movement_patterns'
  )
ORDER BY tablename, policyname;

-- 3) Privilégios efetivos, considerando também herança de roles.
WITH expected(table_name) AS (
  VALUES
    ('training_exercise_groups'),
    ('training_exercise_modalities'),
    ('training_exercise_equipment'),
    ('training_movement_patterns'),
    ('training_exercise_catalog_groups'),
    ('training_exercise_catalog_modalities'),
    ('training_exercise_catalog_equipment'),
    ('training_exercise_catalog_movement_patterns')
)
SELECT
  e.table_name,
  has_table_privilege('anon', c.oid, 'SELECT') AS anon_select,
  has_table_privilege('anon', c.oid, 'INSERT') AS anon_insert,
  has_table_privilege('authenticated', c.oid, 'SELECT') AS authenticated_select,
  has_table_privilege('authenticated', c.oid, 'INSERT') AS authenticated_insert,
  has_table_privilege('authenticated', c.oid, 'UPDATE') AS authenticated_update,
  has_table_privilege('authenticated', c.oid, 'DELETE') AS authenticated_delete,
  has_table_privilege('service_role', c.oid, 'SELECT') AS service_role_select,
  has_table_privilege('service_role', c.oid, 'INSERT') AS service_role_insert,
  has_table_privilege('service_role', c.oid, 'UPDATE') AS service_role_update,
  has_table_privilege('service_role', c.oid, 'DELETE') AS service_role_delete
FROM expected e
JOIN pg_class c ON c.relname = e.table_name
JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
ORDER BY e.table_name;

-- 4) Quantidade de termos inseridos nos vocabulários-base.
SELECT 'groups' AS vocabulary, count(*) AS records
FROM public.training_exercise_groups
UNION ALL
SELECT 'modalities', count(*) FROM public.training_exercise_modalities
UNION ALL
SELECT 'equipment', count(*) FROM public.training_exercise_equipment
UNION ALL
SELECT 'movement_patterns', count(*) FROM public.training_movement_patterns
ORDER BY vocabulary;

-- 5) Fundação não deve classificar automaticamente nenhum dos 197 exercícios.
SELECT 'groups' AS relation, count(*) AS links FROM public.training_exercise_catalog_groups
UNION ALL
SELECT 'modalities', count(*) FROM public.training_exercise_catalog_modalities
UNION ALL
SELECT 'equipment', count(*) FROM public.training_exercise_catalog_equipment
UNION ALL
SELECT 'movement_patterns', count(*) FROM public.training_exercise_catalog_movement_patterns
ORDER BY relation;

-- 6) Confirmar FKs com ON DELETE RESTRICT.
SELECT
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  confdeltype,
  (confdeltype = 'r') AS on_delete_restrict
FROM pg_constraint
JOIN pg_class c ON c.oid = conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE contype = 'f'
  AND n.nspname = 'public'
  AND c.relname IN (
    'training_exercise_catalog_groups',
    'training_exercise_catalog_modalities',
    'training_exercise_catalog_equipment',
    'training_exercise_catalog_movement_patterns'
  )
ORDER BY c.relname, conname;


-- 7) Confirmar que a coluna aceita os três papéis semânticos.
SELECT
  conname,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.training_exercise_catalog_equipment'::regclass
  AND conname = 'training_exercise_catalog_equipment_role_chk';

COMMIT;
