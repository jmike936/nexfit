-- Integration test for personal forks of assigned programs.
-- Runs only in the ephemeral PostgreSQL database created by GitHub Actions.
BEGIN;

INSERT INTO auth.users(id,email) VALUES
  ('20000000-0000-4000-8000-000000000001','fork-athlete@example.test'),
  ('20000000-0000-4000-8000-000000000002','other-athlete@example.test'),
  ('20000000-0000-4000-8000-000000000003','fork-trainer@example.test');

INSERT INTO public.training_programs
  (id,athlete_id,created_by,title,description,status)
VALUES
  ('a2000000-0000-4000-8000-000000000001',
   '20000000-0000-4000-8000-000000000001',
   '20000000-0000-4000-8000-000000000003',
   'Programa compartilhado','[MODALIDADE: Musculação] Plano original','active');

INSERT INTO public.training_program_versions
  (id,program_id,version_number,created_by,change_note,status)
VALUES
  ('c2000000-0000-4000-8000-000000000001',
   'a2000000-0000-4000-8000-000000000001',1,
   '20000000-0000-4000-8000-000000000003','Versão original','active');

UPDATE public.training_programs
SET current_version_id='c2000000-0000-4000-8000-000000000001'
WHERE id='a2000000-0000-4000-8000-000000000001';

INSERT INTO public.training_subworkouts
  (id,version_id,identity_id,title,description,position)
VALUES
  ('d2000000-0000-4000-8000-000000000001',
   'c2000000-0000-4000-8000-000000000001',
   'd2000000-0000-4000-8000-000000000011',
   'Treino A','Treino original',1);

INSERT INTO public.training_exercises
  (id,subworkout_id,identity_id,name,position,sets,rest_seconds,notes,media_url,
   media_end_url,execution_instructions,primary_muscles,secondary_muscles)
VALUES
  ('e2000000-0000-4000-8000-000000000001',
   'd2000000-0000-4000-8000-000000000001',
   'e2000000-0000-4000-8000-000000000011',
   'Supino reto',1,'[{"reps":10,"load_kg":40}]'::jsonb,90,
   'Observação original','/exercise-images/library/bench-press/start.webp',
   '/exercise-images/library/bench-press/end.webp','Execução controlada',
   ARRAY['Peitoral']::text[],ARRAY['Tríceps']::text[]);

INSERT INTO public.training_sessions
  (id,athlete_id,program_id,version_id,subworkout_id,status)
VALUES
  ('f2000000-0000-4000-8000-000000000001',
   '20000000-0000-4000-8000-000000000001',
   'a2000000-0000-4000-8000-000000000001',
   'c2000000-0000-4000-8000-000000000001',
   'd2000000-0000-4000-8000-000000000001','completed');

INSERT INTO public.training_set_logs
  (id,session_id,exercise_id,set_number,reps_completed,load_kg)
VALUES
  ('b2000000-0000-4000-8000-000000000001',
   'f2000000-0000-4000-8000-000000000001',
   'e2000000-0000-4000-8000-000000000001',1,10,40);

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.training_programs,public.training_program_versions,
  public.training_subworkouts,public.training_exercises,public.training_sessions,
  public.training_set_logs TO authenticated;

SET ROLE authenticated;
SET request.jwt.claim.sub='20000000-0000-4000-8000-000000000001';

SELECT set_config(
  'nexfit.test_personal_fork_id',
  public.nexfit_fork_assigned_program('a2000000-0000-4000-8000-000000000001')::text,
  true
);

DO $$
DECLARE
  fork_id uuid := current_setting('nexfit.test_personal_fork_id')::uuid;
  fork_version uuid;
  fork_workout uuid;
  fork_exercise uuid;
  second_fork uuid;
BEGIN
  SELECT current_version_id INTO fork_version
  FROM public.training_programs
  WHERE id=fork_id
    AND athlete_id=auth.uid()
    AND created_by=auth.uid()
    AND source_program_id='a2000000-0000-4000-8000-000000000001'
    AND status='active'
    AND is_public=false;

  IF fork_version IS NULL THEN
    RAISE EXCEPTION 'Personal fork was not created with its own active version';
  END IF;

  IF (SELECT current_version_id FROM public.training_programs
      WHERE id='a2000000-0000-4000-8000-000000000001')
      <> 'c2000000-0000-4000-8000-000000000001'::uuid THEN
    RAISE EXCEPTION 'Source program current version was changed';
  END IF;

  IF (SELECT status FROM public.training_program_versions
      WHERE id='c2000000-0000-4000-8000-000000000001') <> 'active' THEN
    RAISE EXCEPTION 'Source version was not preserved';
  END IF;

  SELECT id INTO fork_workout FROM public.training_subworkouts
  WHERE version_id=fork_version AND identity_id='d2000000-0000-4000-8000-000000000011';
  IF fork_workout IS NULL THEN RAISE EXCEPTION 'Workout identity was not preserved'; END IF;

  SELECT id INTO fork_exercise FROM public.training_exercises
  WHERE subworkout_id=fork_workout AND identity_id='e2000000-0000-4000-8000-000000000011';
  IF fork_exercise IS NULL THEN RAISE EXCEPTION 'Exercise identity was not preserved'; END IF;

  IF (SELECT notes FROM public.training_exercises WHERE id=fork_exercise) <> 'Observação original'
     OR (SELECT media_end_url FROM public.training_exercises WHERE id=fork_exercise)
        <> '/exercise-images/library/bench-press/end.webp' THEN
    RAISE EXCEPTION 'Exercise details were not copied';
  END IF;

  IF (SELECT count(*) FROM public.training_sessions
      WHERE program_id='a2000000-0000-4000-8000-000000000001') <> 1
     OR (SELECT count(*) FROM public.training_set_logs
      WHERE session_id='f2000000-0000-4000-8000-000000000001') <> 1 THEN
    RAISE EXCEPTION 'Original history was changed';
  END IF;

  IF (SELECT count(*) FROM public.training_sessions WHERE program_id=fork_id) <> 0 THEN
    RAISE EXCEPTION 'History was incorrectly copied into the personal fork';
  END IF;

  second_fork := public.nexfit_fork_assigned_program('a2000000-0000-4000-8000-000000000001');
  IF second_fork <> fork_id THEN RAISE EXCEPTION 'Fork RPC is not idempotent'; END IF;

END $$;
RESET ROLE;

-- Create a pending version as the database owner, then confirm it as the athlete.
INSERT INTO public.training_program_versions
  (id,program_id,version_number,created_by,change_note,status)
VALUES
  ('c2000000-0000-4000-8000-000000000002',
   current_setting('nexfit.test_personal_fork_id')::uuid,2,
   '20000000-0000-4000-8000-000000000001','Ajuste individual','pending');

SET ROLE authenticated;
SET request.jwt.claim.sub='20000000-0000-4000-8000-000000000001';
DO $
DECLARE fork_id uuid := current_setting('nexfit.test_personal_fork_id')::uuid;
BEGIN
  PERFORM public.nexfit_confirm_program_version('c2000000-0000-4000-8000-000000000002');
  IF (SELECT current_version_id FROM public.training_programs WHERE id=fork_id)
     <> 'c2000000-0000-4000-8000-000000000002'::uuid THEN
    RAISE EXCEPTION 'Personal version could not be confirmed alongside the source program';
  END IF;
  IF (SELECT current_version_id FROM public.training_programs
      WHERE id='a2000000-0000-4000-8000-000000000001')
      <> 'c2000000-0000-4000-8000-000000000001'::uuid THEN
    RAISE EXCEPTION 'Confirming the personal version changed the source program';
  END IF;
END $$;
RESET ROLE;

-- A different athlete and the linked professional cannot fork another athlete's assignment.
SET ROLE authenticated;
SET request.jwt.claim.sub='20000000-0000-4000-8000-000000000002';
DO $$
DECLARE denied boolean := false;
BEGIN
  BEGIN
    PERFORM public.nexfit_fork_assigned_program('a2000000-0000-4000-8000-000000000001');
  EXCEPTION WHEN OTHERS THEN
    denied := position('não encontrado' in lower(SQLERRM)) > 0
      OR position('não disponível' in lower(SQLERRM)) > 0;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'An unrelated athlete could fork another athlete program'; END IF;
END $$;
RESET ROLE;

SET ROLE authenticated;
SET request.jwt.claim.sub='20000000-0000-4000-8000-000000000003';
DO $$
DECLARE denied boolean := false;
BEGIN
  BEGIN
    PERFORM public.nexfit_fork_assigned_program('a2000000-0000-4000-8000-000000000001');
  EXCEPTION WHEN OTHERS THEN
    denied := position('não encontrado' in lower(SQLERRM)) > 0
      OR position('não disponível' in lower(SQLERRM)) > 0;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'The professional could fork an athlete-owned assignment'; END IF;
END $$;
RESET ROLE;

ROLLBACK;
