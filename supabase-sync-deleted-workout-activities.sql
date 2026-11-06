-- NEXFIT — manter atividades e sessões de musculação sincronizadas
-- O app grava o ID da sessão em activities.notes usando [NEXFIT_SESSION:<uuid>].
-- Este trigger remove séries e sessão quando a atividade vinculada é excluída.
-- A exclusão ocorre na mesma transação da exclusão da atividade.

CREATE OR REPLACE FUNCTION public.nexfit_cleanup_deleted_workout_activity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  linked_session_id uuid;
BEGIN
  linked_session_id := substring(COALESCE(OLD.notes, '') FROM '\[NEXFIT_SESSION:([a-f0-9-]+)\]');

  IF linked_session_id IS NOT NULL THEN
    DELETE FROM public.training_set_logs
    WHERE session_id = linked_session_id;

    DELETE FROM public.training_sessions
    WHERE id = linked_session_id
      AND athlete_id = OLD.user_id;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_nexfit_cleanup_deleted_workout_activity ON public.activities;

CREATE TRIGGER trg_nexfit_cleanup_deleted_workout_activity
AFTER DELETE ON public.activities
FOR EACH ROW
WHEN (OLD.sport = 'Musculação')
EXECUTE FUNCTION public.nexfit_cleanup_deleted_workout_activity();
