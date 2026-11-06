-- NEXFIT — limpeza conservadora de sessões de musculação abandonadas
-- Política: só considerar sessões sem finished_at e iniciadas há mais de 30 dias.
-- Sessões recentes permanecem disponíveis para retomada.
-- Execute no Supabase SQL Editor. Primeiro confira a prévia; depois execute a transação.

-- 1) Prévia: confira quantas sessões e séries seriam removidas.
SELECT
  s.athlete_id,
  s.id AS session_id,
  s.status,
  s.started_at,
  COUNT(l.session_id) AS series_registradas
FROM public.training_sessions AS s
LEFT JOIN public.training_set_logs AS l ON l.session_id = s.id
WHERE s.finished_at IS NULL
  AND s.started_at < now() - interval '30 days'
GROUP BY s.athlete_id, s.id, s.status, s.started_at
ORDER BY s.started_at ASC;

-- 2) Limpeza transacional.
-- IMPORTANTE: o bloco abaixo fica desativado por padrão.
-- Após revisar a prévia, remova os delimitadores /* e */ para executar a limpeza.
/*
BEGIN;

CREATE TEMP TABLE nexfit_stale_sessions ON COMMIT DROP AS
SELECT id
FROM public.training_sessions
WHERE finished_at IS NULL
  AND started_at < now() - interval '30 days';

-- Remove primeiro os logs dependentes para evitar registros sem sessão.
DELETE FROM public.training_set_logs AS l
USING nexfit_stale_sessions AS stale
WHERE l.session_id = stale.id;

-- Depois remove as sessões abandonadas.
DELETE FROM public.training_sessions AS s
USING nexfit_stale_sessions AS stale
WHERE s.id = stale.id;

COMMIT;
*/

-- Observação: sessões com menos de 30 dias não são removidas automaticamente.
-- Se a aplicação futuramente adotar status explícitos (active/cancelled/abandoned),
-- prefira também filtrar por status para tornar a política ainda mais precisa.
