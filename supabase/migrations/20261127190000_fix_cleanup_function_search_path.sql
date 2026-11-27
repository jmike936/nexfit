-- NEXFIT: pin the search_path of the activity cleanup trigger function.
-- The function is SECURITY INVOKER and already schema-qualifies its table references.
-- An empty search_path prevents object shadowing and removes the mutable-path warning.
-- No function body, trigger behavior, grants, or row-level permissions are changed.

BEGIN;

ALTER FUNCTION public.nexfit_cleanup_deleted_workout_activity()
  SET search_path = '';

COMMIT;
