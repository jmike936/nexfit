-- RLS inventory and SECURITY DEFINER helper-grant assertions.
-- Runs only in the disposable PostgreSQL database used by GitHub Actions.
DO $$
DECLARE
  unprotected_tables text;
  tables_without_policies text;
BEGIN
  SELECT string_agg(format('%I.%I',n.nspname,c.relname),', ' ORDER BY c.relname)
  INTO unprotected_tables
  FROM pg_class c
  JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='public' AND c.relkind IN ('r','p')
    AND NOT c.relrowsecurity;

  IF unprotected_tables IS NOT NULL THEN
    RAISE EXCEPTION 'Public tables without RLS enabled: %', unprotected_tables;
  END IF;

  SELECT string_agg(format('%I.%I',n.nspname,c.relname),', ' ORDER BY c.relname)
  INTO tables_without_policies
  FROM pg_class c
  JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='public' AND c.relkind IN ('r','p')
    AND NOT EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname=n.nspname AND p.tablename=c.relname
    );

  IF tables_without_policies IS NOT NULL THEN
    RAISE EXCEPTION 'Public tables without an RLS policy: %', tables_without_policies;
  END IF;

  IF NOT (SELECT relforcerowsecurity FROM pg_class WHERE oid='public.activities'::regclass) THEN
    RAISE EXCEPTION 'activities must retain FORCE ROW LEVEL SECURITY';
  END IF;

  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='storage.objects'::regclass) THEN
    RAISE EXCEPTION 'storage.objects must have RLS enabled';
  END IF;

  IF has_function_privilege('anon','public.nexfit_can_manage_program(uuid)','EXECUTE')
     OR has_function_privilege('anon','public.nexfit_can_read_program(uuid)','EXECUTE')
     OR has_function_privilege('anon','public.nexfit_request_access_by_email(text)','EXECUTE') THEN
    RAISE EXCEPTION 'An anon role can execute a protected SECURITY DEFINER helper';
  END IF;

  IF NOT has_function_privilege('authenticated','public.nexfit_can_manage_program(uuid)','EXECUTE')
     OR NOT has_function_privilege('authenticated','public.nexfit_can_read_program(uuid)','EXECUTE')
     OR NOT has_function_privilege('authenticated','public.nexfit_request_access_by_email(text)','EXECUTE') THEN
    RAISE EXCEPTION 'Authenticated role is missing required helper execution grants';
  END IF;

  IF NOT has_function_privilege('service_role','public.nexfit_can_manage_program(uuid)','EXECUTE')
     OR NOT has_function_privilege('service_role','public.nexfit_can_read_program(uuid)','EXECUTE')
     OR NOT has_function_privilege('service_role','public.nexfit_request_access_by_email(text)','EXECUTE') THEN
    RAISE EXCEPTION 'service_role is missing required helper execution grants';
  END IF;
END $$;

SELECT count(*) AS public_tables_with_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('r','p') AND c.relrowsecurity;
