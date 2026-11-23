-- RLS integration smoke test: athlete, linked professionals and an unlinked professional.
-- Runs only in the ephemeral PostgreSQL database created by GitHub Actions.
BEGIN;

INSERT INTO auth.users(id,email) VALUES
  ('10000000-0000-4000-8000-000000000001','athlete-a@example.test'),
  ('10000000-0000-4000-8000-000000000002','athlete-b@example.test'),
  ('10000000-0000-4000-8000-000000000003','trainer-view@example.test'),
  ('10000000-0000-4000-8000-000000000004','trainer-manage@example.test'),
  ('10000000-0000-4000-8000-000000000005','trainer-unlinked@example.test');

INSERT INTO public.athlete_professional_access
  (athlete_id,professional_id,can_view_history,can_manage_programs,status)
VALUES
  ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000003',true,false,'active'),
  ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000004',false,true,'active');

INSERT INTO public.training_programs(id,athlete_id,created_by,title,status) VALUES
  ('a1000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000003','A · leitura','active'),
  ('a1000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000004','A · gestão','active'),
  ('a1000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','B · privado','active');

INSERT INTO public.training_program_versions(id,program_id,version_number,created_by,status) VALUES
  ('c1000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000001',1,'10000000-0000-4000-8000-000000000003','active'),
  ('c1000000-0000-4000-8000-000000000002','a1000000-0000-4000-8000-000000000002',1,'10000000-0000-4000-8000-000000000004','active'),
  ('c1000000-0000-4000-8000-000000000003','a1000000-0000-4000-8000-000000000003',1,'10000000-0000-4000-8000-000000000002','active');

UPDATE public.training_programs SET current_version_id = CASE id
  WHEN 'a1000000-0000-4000-8000-000000000001' THEN 'c1000000-0000-4000-8000-000000000001'
  WHEN 'a1000000-0000-4000-8000-000000000002' THEN 'c1000000-0000-4000-8000-000000000002'
  ELSE 'c1000000-0000-4000-8000-000000000003'
END;

INSERT INTO public.training_subworkouts(id,version_id,title,position) VALUES
  ('d1000000-0000-4000-8000-000000000001','c1000000-0000-4000-8000-000000000001','Treino A leitura',1),
  ('d1000000-0000-4000-8000-000000000002','c1000000-0000-4000-8000-000000000002','Treino A gestão',1),
  ('d1000000-0000-4000-8000-000000000003','c1000000-0000-4000-8000-000000000003','Treino B',1);

INSERT INTO public.training_exercises(id,subworkout_id,name,position) VALUES
  ('e1000000-0000-4000-8000-000000000001','d1000000-0000-4000-8000-000000000001','Supino teste A leitura',1),
  ('e1000000-0000-4000-8000-000000000002','d1000000-0000-4000-8000-000000000002','Supino teste A gestão',1),
  ('e1000000-0000-4000-8000-000000000003','d1000000-0000-4000-8000-000000000003','Supino teste B',1);

INSERT INTO public.training_sessions(id,athlete_id,program_id,version_id,subworkout_id) VALUES
  ('f1000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000001','c1000000-0000-4000-8000-000000000001','d1000000-0000-4000-8000-000000000001'),
  ('f1000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','a1000000-0000-4000-8000-000000000002','c1000000-0000-4000-8000-000000000002','d1000000-0000-4000-8000-000000000002'),
  ('f1000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','a1000000-0000-4000-8000-000000000003','c1000000-0000-4000-8000-000000000003','d1000000-0000-4000-8000-000000000003');

INSERT INTO public.training_set_logs(id,session_id,exercise_id,set_number,reps_completed,load_kg) VALUES
  ('b1000000-0000-4000-8000-000000000001','f1000000-0000-4000-8000-000000000001','e1000000-0000-4000-8000-000000000001',1,10,40),
  ('b1000000-0000-4000-8000-000000000002','f1000000-0000-4000-8000-000000000002','e1000000-0000-4000-8000-000000000002',1,10,45),
  ('b1000000-0000-4000-8000-000000000003','f1000000-0000-4000-8000-000000000003','e1000000-0000-4000-8000-000000000003',1,10,50);

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON
  public.athlete_professional_access,
  public.training_programs,
  public.training_program_versions,
  public.training_subworkouts,
  public.training_exercises,
  public.training_sessions,
  public.training_set_logs
TO authenticated;

-- Athlete A sees only A's programs, sessions and logs.
SET ROLE authenticated;
SET request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';
DO $$
BEGIN
  IF (SELECT count(*) FROM public.training_programs) <> 2 THEN RAISE EXCEPTION 'Athlete A program isolation failed'; END IF;
  IF (SELECT count(*) FROM public.training_sessions) <> 2 THEN RAISE EXCEPTION 'Athlete A session isolation failed'; END IF;
  IF (SELECT count(*) FROM public.training_set_logs) <> 2 THEN RAISE EXCEPTION 'Athlete A log isolation failed'; END IF;
  IF (SELECT count(*) FROM public.athlete_professional_access) <> 2 THEN RAISE EXCEPTION 'Athlete A access-link visibility failed'; END IF;
END $$;
RESET ROLE;

-- Athlete B cannot see A's records.
SET ROLE authenticated;
SET request.jwt.claim.sub = '10000000-0000-4000-8000-000000000002';
DO $$
BEGIN
  IF (SELECT count(*) FROM public.training_programs) <> 1 THEN RAISE EXCEPTION 'Athlete B saw another athlete program'; END IF;
  IF (SELECT count(*) FROM public.training_sessions) <> 1 THEN RAISE EXCEPTION 'Athlete B saw another athlete session'; END IF;
  IF (SELECT count(*) FROM public.training_set_logs) <> 1 THEN RAISE EXCEPTION 'Athlete B saw another athlete log'; END IF;
  IF (SELECT count(*) FROM public.athlete_professional_access) <> 0 THEN RAISE EXCEPTION 'Athlete B saw another athlete access link'; END IF;
END $$;
RESET ROLE;

-- Linked professional with history-only permission sees the created program and history,
-- but cannot edit the program or create a new one.
SET ROLE authenticated;
SET request.jwt.claim.sub = '10000000-0000-4000-8000-000000000003';
DO $$
DECLARE changed_rows integer; denied boolean := false;
BEGIN
  IF (SELECT count(*) FROM public.training_programs) <> 1 THEN RAISE EXCEPTION 'Read-only professional program visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_program_versions) <> 1 THEN RAISE EXCEPTION 'Read-only professional version visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_subworkouts) <> 1 THEN RAISE EXCEPTION 'Read-only professional workout visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_exercises) <> 1 THEN RAISE EXCEPTION 'Read-only professional exercise visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_sessions) <> 1 THEN RAISE EXCEPTION 'Read-only professional history visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_set_logs) <> 1 THEN RAISE EXCEPTION 'Read-only professional set-log visibility failed'; END IF;
  IF (SELECT count(*) FROM public.athlete_professional_access) <> 1 THEN RAISE EXCEPTION 'Professional access-link visibility failed'; END IF;

  UPDATE public.training_programs SET title='Não deve alterar' WHERE id='a1000000-0000-4000-8000-000000000001';
  GET DIAGNOSTICS changed_rows = ROW_COUNT;
  IF changed_rows <> 0 THEN RAISE EXCEPTION 'History-only professional unexpectedly edited a program'; END IF;

  BEGIN
    INSERT INTO public.training_programs(athlete_id,created_by,title)
    VALUES ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000003','Programa sem permissão');
  EXCEPTION WHEN insufficient_privilege THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'History-only professional unexpectedly created a program'; END IF;
END $$;
RESET ROLE;

-- Linked professional with management permission can manage the program, but cannot read
-- training history unless can_view_history is also enabled.
SET ROLE authenticated;
SET request.jwt.claim.sub = '10000000-0000-4000-8000-000000000004';
DO $$
DECLARE changed_rows integer;
BEGIN
  IF (SELECT count(*) FROM public.training_programs) <> 1 THEN RAISE EXCEPTION 'Manager program visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_subworkouts) <> 1 THEN RAISE EXCEPTION 'Manager workout visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_exercises) <> 1 THEN RAISE EXCEPTION 'Manager exercise visibility failed'; END IF;
  IF (SELECT count(*) FROM public.training_sessions) <> 0 THEN RAISE EXCEPTION 'Manager unexpectedly read training sessions without history permission'; END IF;
  IF (SELECT count(*) FROM public.training_set_logs) <> 0 THEN RAISE EXCEPTION 'Manager unexpectedly read set logs without history permission'; END IF;
  UPDATE public.training_programs SET title='Programa gerenciado' WHERE id='a1000000-0000-4000-8000-000000000002';
  GET DIAGNOSTICS changed_rows = ROW_COUNT;
  IF changed_rows <> 1 THEN RAISE EXCEPTION 'Linked manager could not edit their own program'; END IF;
END $$;
RESET ROLE;

-- An unlinked professional cannot see programs, workouts, sessions or logs.
SET ROLE authenticated;
SET request.jwt.claim.sub = '10000000-0000-4000-8000-000000000005';
DO $$
BEGIN
  IF (SELECT count(*) FROM public.training_programs) <> 0 THEN RAISE EXCEPTION 'Unlinked professional saw programs'; END IF;
  IF (SELECT count(*) FROM public.training_subworkouts) <> 0 THEN RAISE EXCEPTION 'Unlinked professional saw workouts'; END IF;
  IF (SELECT count(*) FROM public.training_sessions) <> 0 THEN RAISE EXCEPTION 'Unlinked professional saw sessions'; END IF;
  IF (SELECT count(*) FROM public.training_set_logs) <> 0 THEN RAISE EXCEPTION 'Unlinked professional saw set logs'; END IF;
  IF (SELECT count(*) FROM public.athlete_professional_access) <> 0 THEN RAISE EXCEPTION 'Unlinked professional saw access links'; END IF;
END $$;
RESET ROLE;

ROLLBACK;
