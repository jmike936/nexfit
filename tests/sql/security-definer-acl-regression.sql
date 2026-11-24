-- Post-migration security regression assertions.
-- Runs after all migrations in the disposable PostgreSQL CI database.
DO $$
DECLARE
  function_signature text;
  public_table text;
BEGIN
  -- All SECURITY DEFINER RPCs found in the production audit must reject anon
  -- while remaining executable by authenticated and service_role.
  IF to_regprocedure('public.nexfit_confirm_program_version(uuid)') IS NULL THEN
    RAISE EXCEPTION 'Required function nexfit_confirm_program_version(uuid) is missing';
  END IF;

  FOREACH function_signature IN ARRAY ARRAY[
    'public.activate_workout_plan(uuid)',
    'public.can_access_workout_plan(uuid,boolean)',
    'public.nexfit_can_manage_program(uuid)',
    'public.nexfit_can_read_program(uuid)',
    'public.nexfit_confirm_program_version(uuid)',
    'public.nexfit_copy_public_program(uuid)',
    'public.nexfit_create_own_program(text,text,text)',
    'public.nexfit_create_program_for_athlete(text,text,text)',
    'public.nexfit_is_admin()',
    'public.nexfit_request_access_by_email(text)',
    'public.share_workout_by_email(uuid,text,text)'
  ] LOOP
    IF to_regprocedure(function_signature) IS NULL THEN
      CONTINUE;
    END IF;
    IF has_function_privilege('anon', function_signature, 'EXECUTE') THEN
      RAISE EXCEPTION 'anon still has EXECUTE on %', function_signature;
    END IF;
    IF NOT has_function_privilege('authenticated', function_signature, 'EXECUTE') THEN
      RAISE EXCEPTION 'authenticated is missing EXECUTE on %', function_signature;
    END IF;
    IF NOT has_function_privilege('service_role', function_signature, 'EXECUTE') THEN
      RAISE EXCEPTION 'service_role is missing EXECUTE on %', function_signature;
    END IF;
  END LOOP;

  -- The authentication guard must be present in the deployed function body.
  IF position('AUTH.UID() IS NULL' in upper(pg_get_functiondef(
    'public.nexfit_confirm_program_version(uuid)'::regprocedure
  ))) = 0 THEN
    RAISE EXCEPTION 'nexfit_confirm_program_version is missing its null-authentication guard';
  END IF;

  -- anon must have no table privileges in public.
  FOR public_table IN
    SELECT format('%I.%I', n.nspname, c.relname)
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r','p','v','m','f')
  LOOP
    IF has_table_privilege('anon', public_table, 'SELECT')
       OR has_table_privilege('anon', public_table, 'INSERT')
       OR has_table_privilege('anon', public_table, 'UPDATE')
       OR has_table_privilege('anon', public_table, 'DELETE')
       OR has_table_privilege('anon', public_table, 'TRUNCATE')
       OR has_table_privilege('anon', public_table, 'REFERENCES')
       OR has_table_privilege('anon', public_table, 'TRIGGER') THEN
      RAISE EXCEPTION 'anon retains a table privilege on %', public_table;
    END IF;

    IF has_table_privilege('authenticated', public_table, 'TRUNCATE')
       OR has_table_privilege('authenticated', public_table, 'REFERENCES')
       OR has_table_privilege('authenticated', public_table, 'TRIGGER') THEN
      RAISE EXCEPTION 'authenticated retains an administrative table privilege on %', public_table;
    END IF;
    IF current_setting('server_version_num')::integer >= 170000
       AND (has_table_privilege('anon', public_table, 'MAINTAIN')
            OR has_table_privilege('authenticated', public_table, 'MAINTAIN')) THEN
      RAISE EXCEPTION 'authenticated retains MAINTAIN on %', public_table;
    END IF;
  END LOOP;

  -- Default ACLs for postgres must no longer grant function execution implicitly.
  IF EXISTS (
    SELECT 1
    FROM pg_default_acl d
    JOIN pg_namespace n ON n.oid = d.defaclnamespace
    CROSS JOIN LATERAL aclexplode(d.defaclacl) acl
    WHERE d.defaclrole = 'postgres'::regrole
      AND n.nspname = 'public'
      AND d.defaclobjtype = 'f'
      AND acl.grantee IN ('anon'::regrole, 'authenticated'::regrole)
      AND acl.privilege_type = 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'postgres default privileges still grant function EXECUTE to anon/authenticated';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_roles r
    JOIN pg_default_acl d ON d.defaclrole = r.oid
    JOIN pg_namespace n ON n.oid = d.defaclnamespace
    CROSS JOIN LATERAL aclexplode(d.defaclacl) acl
    WHERE r.rolname = 'supabase_admin'
      AND n.nspname = 'public'
      AND d.defaclobjtype = 'f'
      AND acl.grantee IN ('anon'::regrole, 'authenticated'::regrole)
      AND acl.privilege_type = 'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'supabase_admin default privileges still grant function EXECUTE to anon/authenticated';
  END IF;
END
$$;

-- Confirm an authenticated session without a JWT subject fails closed at the function body.
SET ROLE authenticated;
SET request.jwt.claim.sub = '';
DO $$
BEGIN
  BEGIN
    PERFORM public.nexfit_confirm_program_version('00000000-0000-4000-8000-000000000000');
    RAISE EXCEPTION 'Unauthenticated call unexpectedly succeeded';
  EXCEPTION
    WHEN raise_exception THEN
      IF SQLERRM <> 'Autenticação necessária.' THEN
        RAISE;
      END IF;
  END;
END
$$;
RESET ROLE;
