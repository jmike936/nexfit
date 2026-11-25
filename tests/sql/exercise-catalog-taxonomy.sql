-- NEXFIT | Regression tests for exercise catalog taxonomy foundation
-- Runs after all migrations in the isolated PostgreSQL smoke-test database.
DO $$
DECLARE
  expected_tables text[] := ARRAY[
    'training_exercise_groups',
    'training_exercise_modalities',
    'training_exercise_equipment',
    'training_movement_patterns',
    'training_exercise_catalog_groups',
    'training_exercise_catalog_modalities',
    'training_exercise_catalog_equipment',
    'training_exercise_catalog_movement_patterns'
  ];
  table_name text;
  table_oid oid;
BEGIN
  FOREACH table_name IN ARRAY expected_tables LOOP
    table_oid := to_regclass(format('public.%I', table_name));
    IF table_oid IS NULL THEN
      RAISE EXCEPTION 'Missing taxonomy table: %', table_name;
    END IF;
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = table_oid) THEN
      RAISE EXCEPTION 'RLS is not enabled on %', table_name;
    END IF;
    IF has_table_privilege('anon', table_oid, 'SELECT')
       OR has_table_privilege('anon', table_oid, 'INSERT')
       OR has_table_privilege('anon', table_oid, 'UPDATE')
       OR has_table_privilege('anon', table_oid, 'DELETE') THEN
      RAISE EXCEPTION 'anon has an unexpected table privilege on %', table_name;
    END IF;
    IF NOT has_table_privilege('authenticated', table_oid, 'SELECT')
       OR has_table_privilege('authenticated', table_oid, 'INSERT')
       OR has_table_privilege('authenticated', table_oid, 'UPDATE')
       OR has_table_privilege('authenticated', table_oid, 'DELETE') THEN
      RAISE EXCEPTION 'authenticated privileges are incorrect on %', table_name;
    END IF;
    IF NOT has_table_privilege('service_role', table_oid, 'SELECT')
       OR NOT has_table_privilege('service_role', table_oid, 'INSERT')
       OR NOT has_table_privilege('service_role', table_oid, 'UPDATE')
       OR NOT has_table_privilege('service_role', table_oid, 'DELETE') THEN
      RAISE EXCEPTION 'service_role administrative privileges are incomplete on %', table_name;
    END IF;
    IF EXISTS (
      SELECT 1
      FROM pg_class c
      CROSS JOIN LATERAL aclexplode(COALESCE(c.relacl, acldefault('r', c.relowner))) acl
      WHERE c.oid = table_oid
        AND acl.grantee = 0
        AND acl.privilege_type IN ('SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER')
    ) THEN
      RAISE EXCEPTION 'PUBLIC has a table privilege on %', table_name;
    END IF;
  END LOOP;

  IF (SELECT count(*) FROM pg_policies
      WHERE schemaname='public' AND tablename = ANY(expected_tables)
        AND cmd='SELECT' AND roles=ARRAY['authenticated']) <> 8 THEN
    RAISE EXCEPTION 'Expected exactly eight authenticated SELECT policies for taxonomy tables';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename = ANY(expected_tables)
      AND (cmd <> 'SELECT' OR roles <> ARRAY['authenticated'])
  ) THEN
    RAISE EXCEPTION 'Unexpected write or non-authenticated policy found on taxonomy tables';
  END IF;

  IF (SELECT count(*) FROM public.training_exercise_groups) <> 13
     OR (SELECT count(*) FROM public.training_exercise_modalities) <> 5
     OR (SELECT count(*) FROM public.training_exercise_equipment) <> 24
     OR (SELECT count(*) FROM public.training_movement_patterns) <> 20 THEN
    RAISE EXCEPTION 'Taxonomy vocabulary seed counts do not match expected values';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.training_exercise_equipment
    WHERE code='wrist_roller' AND name='Wrist roller'
  ) THEN RAISE EXCEPTION 'Wrist roller equipment term is missing'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.training_movement_patterns
    WHERE code='protracao' AND name='Protração'
  ) THEN RAISE EXCEPTION 'Protração movement pattern is missing'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid='public.training_exercise_catalog_equipment'::regclass
      AND conname='training_exercise_catalog_equipment_role_chk'
      AND pg_get_constraintdef(oid) LIKE '%alternative%'
  ) THEN RAISE EXCEPTION 'Alternative equipment role is not accepted'; END IF;

  IF (
    SELECT count(*) FROM pg_constraint
    WHERE contype='f'
      AND conrelid IN (
        'public.training_exercise_catalog_groups'::regclass,
        'public.training_exercise_catalog_modalities'::regclass,
        'public.training_exercise_catalog_equipment'::regclass,
        'public.training_exercise_catalog_movement_patterns'::regclass
      )
      AND confdeltype='r'
  ) <> 8 THEN
    RAISE EXCEPTION 'Expected eight taxonomy foreign keys with ON DELETE RESTRICT';
  END IF;

  IF (SELECT count(*) FROM public.training_exercise_catalog_groups) <> 0
     OR (SELECT count(*) FROM public.training_exercise_catalog_modalities) <> 0
     OR (SELECT count(*) FROM public.training_exercise_catalog_equipment) <> 0
     OR (SELECT count(*) FROM public.training_exercise_catalog_movement_patterns) <> 0 THEN
    RAISE EXCEPTION 'Foundation migration must not classify catalog exercises';
  END IF;
END
$$;

-- Confirm an authenticated client can read the seeded vocabularies under RLS.
SET ROLE authenticated;
DO $$
BEGIN
  IF (SELECT count(*) FROM public.training_exercise_groups) <> 13 THEN
    RAISE EXCEPTION 'authenticated cannot read exercise groups';
  END IF;
END
$$;
RESET ROLE;
