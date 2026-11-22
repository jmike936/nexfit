-- NEXFIT — recuperar atividade histórica da sessão concluída confirmada
-- Sessão: 0a0ef3ea-fb8f-4ca2-ab9a-ed71fed3152f
-- O atleta confirmou que este treino de 03/11/2026 é legítimo.
-- Script idempotente: não cria duplicidade se o vínculo já existir.
-- Execute no SQL Editor do Supabase.

BEGIN;

INSERT INTO public.activities (
  user_id,
  sport,
  activity_date,
  duration_minutes,
  distance_km,
  notes
)
SELECT
  s.athlete_id,
  'Musculação',
  (s.started_at AT TIME ZONE 'America/Sao_Paulo')::date,
  GREATEST(1, ROUND(EXTRACT(EPOCH FROM (s.finished_at - s.started_at)) / 60)::integer),
  NULL,
  'Treino de musculação recuperado do histórico [NEXFIT_SESSION:' || s.id::text || ']'
FROM public.training_sessions AS s
WHERE s.id = '0a0ef3ea-fb8f-4ca2-ab9a-ed71fed3152f'::uuid
  AND s.athlete_id = '90026c4f-033d-4961-bf7d-f2e7062e3aff'::uuid
  AND s.status = 'completed'
  AND s.finished_at IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.training_set_logs AS l
    WHERE l.session_id = s.id
      AND l.reps_completed > 0
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.activities AS a
    WHERE a.user_id = s.athlete_id
      AND a.sport = 'Musculação'
      AND a.notes LIKE '%[NEXFIT_SESSION:' || s.id::text || ']%'
  );

COMMIT;

-- Conferência: deve retornar a atividade criada ou já vinculada.
SELECT
  a.id AS activity_id,
  a.user_id,
  a.sport,
  a.activity_date,
  a.duration_minutes,
  a.notes
FROM public.activities AS a
WHERE a.user_id = '90026c4f-033d-4961-bf7d-f2e7062e3aff'::uuid
  AND a.notes LIKE '%[NEXFIT_SESSION:0a0ef3ea-fb8f-4ca2-ab9a-ed71fed3152f]%';
