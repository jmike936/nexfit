-- NEXFIT | Verificação read-only do search_path da função de limpeza.
-- Deve retornar uma linha com search_path="" e security_definer=false.

SELECT
  p.oid::regprocedure AS function_name,
  p.prosecdef AS security_definer,
  p.proconfig AS function_settings,
  EXISTS (
    SELECT 1
    FROM unnest(COALESCE(p.proconfig, ARRAY[]::text[])) setting
    WHERE setting = 'search_path=""'
  ) AS empty_search_path_confirmed
FROM pg_proc p
WHERE p.oid = to_regprocedure('public.nexfit_cleanup_deleted_workout_activity()');
