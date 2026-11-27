-- NEXFIT | Prévia somente leitura da reconciliação de identidades legadas.
-- Execute antes de 20261122001700_reconcile_legacy_workout_identities.sql.
-- Este arquivo contém somente SELECT/CTEs: não cria tabelas temporárias,
-- não altera identidades, sessões, séries, schema, funções ou permissões.
-- A lógica de elegibilidade e escolha da identidade canônica espelha a migration 017.

WITH exercise_keys AS (
  SELECT
    e.subworkout_id,
    CASE
      WHEN e.catalog_exercise_id IS NOT NULL
        THEN 'catalog:' || e.catalog_exercise_id::text
      ELSE 'name:' || lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g'))
    END AS exercise_key
  FROM public.training_exercises e
),
workout_signatures AS (
  SELECT
    subworkout_id,
    count(*) AS exercise_count,
    count(DISTINCT exercise_key) AS distinct_exercise_count,
    md5(string_agg(length(exercise_key)::text || ':' || exercise_key, '|' ORDER BY exercise_key)) AS signature
  FROM exercise_keys
  GROUP BY subworkout_id
  HAVING count(*) > 0
     AND count(*) = count(DISTINCT exercise_key)
),
workout_rows AS (
  SELECT
    sw.id AS subworkout_id,
    sw.identity_id,
    sw.version_id,
    v.program_id,
    v.version_number,
    sw.position,
    lower(regexp_replace(trim(sw.title), '[[:space:]]+', ' ', 'g')) AS title_key,
    sig.signature
  FROM public.training_subworkouts sw
  JOIN public.training_program_versions v ON v.id = sw.version_id
  JOIN workout_signatures sig ON sig.subworkout_id = sw.id
  WHERE nullif(trim(sw.title), '') IS NOT NULL
),
eligible_groups AS (
  SELECT program_id, title_key, signature
  FROM workout_rows
  GROUP BY program_id, title_key, signature
  HAVING count(*) > 1
     AND count(*) = count(DISTINCT version_id)
),
workout_map AS (
  SELECT
    w.subworkout_id,
    w.version_id,
    w.program_id,
    w.version_number,
    w.position,
    w.title_key,
    w.signature,
    w.identity_id AS current_identity_id,
    first_value(w.identity_id) OVER (
      PARTITION BY w.program_id, w.title_key, w.signature
      ORDER BY w.version_number, w.position, w.subworkout_id
    ) AS canonical_identity_id
  FROM workout_rows w
  JOIN eligible_groups g
    ON g.program_id = w.program_id
   AND g.title_key = w.title_key
   AND g.signature = w.signature
),
exercise_rows AS (
  SELECT
    wm.program_id,
    wm.title_key,
    wm.signature AS workout_signature,
    wm.version_id,
    wm.version_number,
    e.id AS exercise_id,
    e.identity_id,
    e.position,
    CASE
      WHEN e.catalog_exercise_id IS NOT NULL
        THEN 'catalog:' || e.catalog_exercise_id::text
      ELSE 'name:' || lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g'))
    END AS exercise_key
  FROM workout_map wm
  JOIN public.training_exercises e ON e.subworkout_id = wm.subworkout_id
),
eligible_exercises AS (
  SELECT program_id, title_key, workout_signature, exercise_key
  FROM exercise_rows
  GROUP BY program_id, title_key, workout_signature, exercise_key
  HAVING count(*) > 1
     AND count(*) = count(DISTINCT version_id)
),
exercise_map AS (
  SELECT
    e.exercise_id,
    e.program_id,
    e.version_id,
    e.version_number,
    e.identity_id AS current_identity_id,
    e.exercise_key,
    first_value(e.identity_id) OVER (
      PARTITION BY e.program_id, e.title_key, e.workout_signature, e.exercise_key
      ORDER BY e.version_number, e.position, e.exercise_id
    ) AS canonical_identity_id
  FROM exercise_rows e
  JOIN eligible_exercises x
    ON x.program_id = e.program_id
   AND x.title_key = e.title_key
   AND x.workout_signature = e.workout_signature
   AND x.exercise_key = e.exercise_key
)
SELECT
  'treinos'::text AS entity,
  count(*) AS eligible_rows,
  count(*) FILTER (WHERE current_identity_id IS DISTINCT FROM canonical_identity_id) AS identity_updates,
  (
    SELECT count(DISTINCT s.id)
    FROM public.training_sessions s
    JOIN workout_map m ON m.subworkout_id = s.subworkout_id
  ) AS linked_sessions_preserved,
  (
    SELECT count(DISTINCT l.id)
    FROM public.training_set_logs l
    JOIN public.training_sessions s ON s.id = l.session_id
    JOIN workout_map m ON m.subworkout_id = s.subworkout_id
  ) AS linked_set_logs_preserved
FROM workout_map
UNION ALL
SELECT
  'exercícios'::text,
  count(*),
  count(*) FILTER (WHERE current_identity_id IS DISTINCT FROM canonical_identity_id),
  (
    SELECT count(DISTINCT s.id)
    FROM public.training_sessions s
    JOIN public.training_set_logs l ON l.session_id = s.id
    JOIN exercise_map m ON m.exercise_id = l.exercise_id
  ),
  (
    SELECT count(DISTINCT l.id)
    FROM public.training_set_logs l
    JOIN exercise_map m ON m.exercise_id = l.exercise_id
  )
FROM exercise_map;

-- Amostra dos vínculos propostos. Nenhuma linha será atualizada por esta consulta.
WITH exercise_keys AS (
  SELECT e.subworkout_id,
    CASE WHEN e.catalog_exercise_id IS NOT NULL
      THEN 'catalog:' || e.catalog_exercise_id::text
      ELSE 'name:' || lower(regexp_replace(trim(e.name), '[[:space:]]+', ' ', 'g'))
    END AS exercise_key
  FROM public.training_exercises e
),
workout_signatures AS (
  SELECT subworkout_id,
    md5(string_agg(length(exercise_key)::text || ':' || exercise_key, '|' ORDER BY exercise_key)) AS signature
  FROM exercise_keys
  GROUP BY subworkout_id
  HAVING count(*) > 0 AND count(*) = count(DISTINCT exercise_key)
),
workout_rows AS (
  SELECT sw.id AS subworkout_id, sw.identity_id, sw.version_id, v.program_id,
    v.version_number, sw.position,
    lower(regexp_replace(trim(sw.title), '[[:space:]]+', ' ', 'g')) AS title_key,
    sig.signature
  FROM public.training_subworkouts sw
  JOIN public.training_program_versions v ON v.id=sw.version_id
  JOIN workout_signatures sig ON sig.subworkout_id=sw.id
  WHERE nullif(trim(sw.title),'') IS NOT NULL
),
eligible_groups AS (
  SELECT program_id,title_key,signature
  FROM workout_rows
  GROUP BY program_id,title_key,signature
  HAVING count(*)>1 AND count(*)=count(DISTINCT version_id)
),
workout_map AS (
  SELECT w.*,
    first_value(w.identity_id) OVER (
      PARTITION BY w.program_id,w.title_key,w.signature
      ORDER BY w.version_number,w.position,w.subworkout_id
    ) AS canonical_identity_id
  FROM workout_rows w
  JOIN eligible_groups g USING(program_id,title_key,signature)
)
SELECT
  program_id,
  version_id,
  subworkout_id AS record_id,
  'treino'::text AS entity,
  title_key AS logical_key,
  identity_id AS current_identity_id,
  canonical_identity_id
FROM workout_map
WHERE identity_id IS DISTINCT FROM canonical_identity_id
ORDER BY program_id,version_id,subworkout_id
LIMIT 100;
