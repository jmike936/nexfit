-- Representative synthetic fixtures for sensitive data backfills.
-- Runs only in the disposable PostgreSQL service used by GitHub Actions.
\set ON_ERROR_STOP on

INSERT INTO auth.users(id,email) VALUES
 ('90000000-0000-4000-8000-000000000001','fixture-athlete@nexfit.test');

-- Two pending versions exercise migration 008. A real historical session/log
-- remains attached to the older version throughout the catalog/identity backfills.
INSERT INTO public.training_programs(id,athlete_id,created_by,title,status)
VALUES ('90000000-0000-4000-8000-000000000010',
        '90000000-0000-4000-8000-000000000001',
        '90000000-0000-4000-8000-000000000001','Fixture program','active');

-- Allow the legacy duplicate-pending state that existed before migration 008.
DROP INDEX IF EXISTS public.training_program_versions_one_pending_uidx;

INSERT INTO public.training_program_versions
 (id,program_id,version_number,created_by,status,created_at)
VALUES
 ('90000000-0000-4000-8000-000000000011','90000000-0000-4000-8000-000000000010',1,'90000000-0000-4000-8000-000000000001','pending','2026-01-01T10:00:00Z'),
 ('90000000-0000-4000-8000-000000000012','90000000-0000-4000-8000-000000000010',2,'90000000-0000-4000-8000-000000000001','pending','2026-02-01T10:00:00Z');

UPDATE public.training_programs
SET current_version_id='90000000-0000-4000-8000-000000000012'
WHERE id='90000000-0000-4000-8000-000000000010';

-- Catalog duplicates exercise migration 010's canonical selection by created_at.
DROP INDEX IF EXISTS public.training_exercise_catalog_normalized_name_uidx;
INSERT INTO public.training_exercise_catalog
 (id,name,normalized_name,category,created_at)
VALUES
 ('90000000-0000-4000-8000-000000000020','Fixture Leg Press','fixturelegpress','Quadríceps','2025-01-01T00:00:00Z'),
 ('90000000-0000-4000-8000-000000000021','Fixture Leg-Press','fixturelegpress','Quadríceps','2025-02-01T00:00:00Z');

INSERT INTO public.training_subworkouts(id,version_id,title,position,identity_id)
VALUES
 ('90000000-0000-4000-8000-000000000030','90000000-0000-4000-8000-000000000011','Treino A',1,'90000000-0000-4000-8000-000000000040'),
 ('90000000-0000-4000-8000-000000000031','90000000-0000-4000-8000-000000000012','Treino A',1,'90000000-0000-4000-8000-000000000041'),
 ('90000000-0000-4000-8000-000000000032','90000000-0000-4000-8000-000000000011','Aliases',2,'90000000-0000-4000-8000-000000000042');

INSERT INTO public.training_exercises
 (id,subworkout_id,name,position,catalog_exercise_id,identity_id)
VALUES
 ('90000000-0000-4000-8000-000000000050','90000000-0000-4000-8000-000000000030','Fixture Leg Press',1,'90000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000060'),
 ('90000000-0000-4000-8000-000000000051','90000000-0000-4000-8000-000000000031','Fixture Leg-Press',1,'90000000-0000-4000-8000-000000000021','90000000-0000-4000-8000-000000000061'),
 ('90000000-0000-4000-8000-000000000051','90000000-0000-4000-8000-000000000031','Fixture Leg-Press',1,'90000000-0000-4000-8000-000000000021','90000000-0000-4000-8000-000000000061');

INSERT INTO public.training_sessions
 (id,athlete_id,program_id,version_id,subworkout_id,status,started_at,finished_at)
VALUES
 ('90000000-0000-4000-8000-000000000070','90000000-0000-4000-8000-000000000001',
  '90000000-0000-4000-8000-000000000010','90000000-0000-4000-8000-000000000011',
  '90000000-0000-4000-8000-000000000030','completed','2026-03-01T10:00:00Z','2026-03-01T11:00:00Z');

INSERT INTO public.training_set_logs
 (id,session_id,exercise_id,set_number,reps_completed,load_kg,completed_at)
VALUES
 ('90000000-0000-4000-8000-000000000080','90000000-0000-4000-8000-000000000070',
  '90000000-0000-4000-8000-000000000050',1,10,80,'2026-03-01T10:30:00Z');

-- Re-run the exact production migrations against the synthetic legacy state.
\ir ../../supabase/migrations/20261122000800_single_pending_version.sql
\ir ../../supabase/migrations/20261122001000_exercise_library_seed.sql

-- Add only the aliases after 010 so that this fixture isolates migration 016.
INSERT INTO public.training_exercise_catalog(id,name,normalized_name,category)
VALUES
 ('90000000-0000-4000-8000-000000000023','Leg 45','leg45','Quadríceps'),
 ('90000000-0000-4000-8000-000000000025','Agachamento','agachamento','Quadríceps');

INSERT INTO public.training_exercises
 (id,subworkout_id,name,position,catalog_exercise_id,identity_id)
VALUES
 ('90000000-0000-4000-8000-000000000052','90000000-0000-4000-8000-000000000032','Leg 45',1,'90000000-0000-4000-8000-000000000023','90000000-0000-4000-8000-000000000062'),
 ('90000000-0000-4000-8000-000000000053','90000000-0000-4000-8000-000000000032','Agachamento',2,'90000000-0000-4000-8000-000000000025','90000000-0000-4000-8000-000000000063');

CREATE TEMP TABLE expected_alias_canonicals AS
SELECT
 (SELECT id FROM public.training_exercise_catalog
  WHERE normalized_name IN ('legpress45','legpress45grau','legpress45graus')
  ORDER BY CASE WHEN normalized_name='legpress45' THEN 0 ELSE 1 END,created_at,id LIMIT 1) AS leg_press_id,
 (SELECT id FROM public.training_exercise_catalog
  WHERE normalized_name='agachamentolivre' ORDER BY created_at,id LIMIT 1) AS squat_id;

\ir ../../supabase/migrations/20261122001600_unify_exercise_aliases.sql
\ir ../../supabase/migrations/20261122001700_reconcile_legacy_workout_identities.sql

-- Repeat the two identity/catalog backfills to catch non-idempotent behavior.
\ir ../../supabase/migrations/20261122001000_exercise_library_seed.sql
\ir ../../supabase/migrations/20261122001600_unify_exercise_aliases.sql
\ir ../../supabase/migrations/20261122001700_reconcile_legacy_workout_identities.sql

DO $$
DECLARE
  canonical_catalog uuid;
BEGIN
  IF (SELECT status FROM public.training_program_versions
      WHERE id='90000000-0000-4000-8000-000000000011') <> 'archived'
  THEN RAISE EXCEPTION '008 failed: older pending version was not archived'; END IF;
  IF (SELECT status FROM public.training_program_versions
      WHERE id='90000000-0000-4000-8000-000000000012') <> 'pending'
  THEN RAISE EXCEPTION '008 failed: newest pending version was not preserved'; END IF;
  IF (SELECT count(*) FROM public.training_program_versions
      WHERE program_id='90000000-0000-4000-8000-000000000010' AND status='pending') <> 1
  THEN RAISE EXCEPTION '008 failed: pending-version invariant not satisfied'; END IF;

  SELECT id INTO canonical_catalog FROM public.training_exercise_catalog
  WHERE normalized_name='fixturelegpress';
  IF canonical_catalog <> '90000000-0000-4000-8000-000000000020'
  THEN RAISE EXCEPTION '010 failed: oldest catalog row was not retained'; END IF;
  IF (SELECT count(*) FROM public.training_exercise_catalog
      WHERE normalized_name='fixturelegpress') <> 1
  THEN RAISE EXCEPTION '010 failed: duplicate normalized catalog rows remain'; END IF;
  IF (SELECT count(*) FROM public.training_exercises
      WHERE id IN ('90000000-0000-4000-8000-000000000050','90000000-0000-4000-8000-000000000051')
        AND catalog_exercise_id=canonical_catalog) <> 2
  THEN RAISE EXCEPTION '010 failed: exercise references were not redirected'; END IF;

  IF EXISTS (SELECT 1 FROM public.training_exercise_catalog
             WHERE id IN ('90000000-0000-4000-8000-000000000023','90000000-0000-4000-8000-000000000025'))
  THEN RAISE EXCEPTION '016 failed: alias catalog rows remain'; END IF;
  IF (SELECT catalog_exercise_id FROM public.training_exercises
      WHERE id='90000000-0000-4000-8000-000000000052')
      <> (SELECT leg_press_id FROM expected_alias_canonicals)
  THEN RAISE EXCEPTION '016 failed: Leg 45 exercise was not redirected'; END IF;
  IF (SELECT name FROM public.training_exercises
      WHERE id='90000000-0000-4000-8000-000000000052') <> 'Leg Press 45°'
  THEN RAISE EXCEPTION '016 failed: Leg 45 exercise name was not normalized'; END IF;
  IF (SELECT catalog_exercise_id FROM public.training_exercises
      WHERE id='90000000-0000-4000-8000-000000000053')
      <> (SELECT squat_id FROM expected_alias_canonicals)
  THEN RAISE EXCEPTION '016 failed: squat alias exercise was not redirected'; END IF;

  IF (SELECT identity_id FROM public.training_subworkouts
      WHERE id='90000000-0000-4000-8000-000000000030')
      <> (SELECT identity_id FROM public.training_subworkouts
          WHERE id='90000000-0000-4000-8000-000000000031')
  THEN RAISE EXCEPTION '017 failed: equivalent workouts did not share identity'; END IF;
  IF (SELECT identity_id FROM public.training_exercises
      WHERE id='90000000-0000-4000-8000-000000000050')
      <> (SELECT identity_id FROM public.training_exercises
          WHERE id='90000000-0000-4000-8000-000000000051')
  THEN RAISE EXCEPTION '017 failed: equivalent exercises did not share identity'; END IF;

  IF (SELECT count(*) FROM public.training_sessions
      WHERE id='90000000-0000-4000-8000-000000000070'
        AND version_id='90000000-0000-4000-8000-000000000011'
        AND subworkout_id='90000000-0000-4000-8000-000000000030') <> 1
  THEN RAISE EXCEPTION 'Historical session was lost or detached'; END IF;
  IF (SELECT count(*) FROM public.training_set_logs
      WHERE id='90000000-0000-4000-8000-000000000080'
        AND session_id='90000000-0000-4000-8000-000000000070'
        AND exercise_id='90000000-0000-4000-8000-000000000050'
        AND load_kg=80 AND reps_completed=10) <> 1
  THEN RAISE EXCEPTION 'Historical set log was lost or detached'; END IF;
  IF (SELECT count(*) FROM public.training_sessions
      WHERE id='90000000-0000-4000-8000-000000000070') <> 1
     OR (SELECT count(*) FROM public.training_set_logs
         WHERE id='90000000-0000-4000-8000-000000000080') <> 1
  THEN RAISE EXCEPTION 'Historical row counts changed'; END IF;
END $$;

SELECT 'Sensitive backfill fixtures passed: 008, 010, 016, 017; historical session/set log preserved.' AS result;
