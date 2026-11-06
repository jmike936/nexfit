-- NEXFIT — conciliar atividade recuperada com o registro original do histórico
-- Sessão confirmada de 03/11/2026. A atividade original deve permanecer no histórico.
-- O vínculo [NEXFIT_SESSION:<uuid>] será movido para o registro original.
-- Seguro para reexecução; aborta se não encontrar correspondência única.
BEGIN;

DO $$
DECLARE
  target_session uuid := '0a0ef3ea-fb8f-4ca2-ab9a-ed71fed3152f'::uuid;
  session_row record;
  original_activity_id uuid;
  recovered_activity_id uuid;
  original_count integer;
  recovered_count integer;
  marker text;
BEGIN
  SELECT s.id, s.athlete_id, s.started_at,
         p.title || ' · ' || w.title AS expected_notes
    INTO session_row
  FROM public.training_sessions s
  JOIN public.training_programs p ON p.id = s.program_id
  JOIN public.training_subworkouts w ON w.id = s.subworkout_id
  WHERE s.id = target_session
    AND s.status = 'completed'
    AND s.finished_at IS NOT NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sessão concluída não encontrada. Nenhuma alteração realizada.';
  END IF;

  marker := '[NEXFIT_SESSION:' || target_session::text || ']';

  SELECT count(*), min(a.id)
    INTO original_count, original_activity_id
  FROM public.activities a
  WHERE a.user_id = session_row.athlete_id
    AND a.sport = 'Musculação'
    AND a.activity_date = (session_row.started_at AT TIME ZONE 'America/Sao_Paulo')::date
    AND btrim(regexp_replace(COALESCE(a.notes, ''), '\\s*\\[NEXFIT_SESSION:[a-f0-9-]+\\]', '', 'gi')) = btrim(session_row.expected_notes);

  IF original_count <> 1 THEN
    RAISE EXCEPTION 'Esperava exatamente 1 atividade original com descrição "%", mas encontrei %. Nenhuma alteração realizada.', session_row.expected_notes, original_count;
  END IF;

  SELECT count(*), min(a.id)
    INTO recovered_count, recovered_activity_id
  FROM public.activities a
  WHERE a.user_id = session_row.athlete_id
    AND a.sport = 'Musculação'
    AND a.notes LIKE '%Treino de musculação recuperado do histórico%'
    AND a.notes LIKE '%' || marker || '%';

  IF recovered_count > 1 THEN
    RAISE EXCEPTION 'Encontrei mais de uma atividade recuperada vinculada à sessão. Nenhuma alteração realizada.';
  END IF;

  -- Retira o marcador da cópia recuperada antes de excluí-la, evitando que
  -- o trigger de limpeza apague a sessão e as séries legítimas.
  IF recovered_count = 1 AND recovered_activity_id <> original_activity_id THEN
    UPDATE public.activities
       SET notes = btrim(regexp_replace(COALESCE(notes, ''), '\\s*\\[NEXFIT_SESSION:[a-f0-9-]+\\]', '', 'gi'))
     WHERE id = recovered_activity_id;

    DELETE FROM public.activities WHERE id = recovered_activity_id;
  END IF;

  UPDATE public.activities
     SET notes = CASE
       WHEN COALESCE(notes, '') LIKE '%' || marker || '%' THEN notes
       ELSE rtrim(COALESCE(notes, '')) || ' ' || marker
     END
   WHERE id = original_activity_id;
END $$;

COMMIT;

-- Conferência: deve retornar somente a atividade original "HIPERTROFIA · TREINO B".
SELECT id, activity_date, notes
FROM public.activities
WHERE notes LIKE '%[NEXFIT_SESSION:0a0ef3ea-fb8f-4ca2-ab9a-ed71fed3152f]%';
