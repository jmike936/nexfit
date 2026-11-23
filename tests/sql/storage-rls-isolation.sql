-- Storage RLS smoke test: each authenticated athlete can access only their own avatar folder.
-- Runs only in the disposable PostgreSQL database used by GitHub Actions.
BEGIN;

INSERT INTO auth.users(id,email) VALUES
 ('91000000-0000-4000-8000-000000000001','avatar-a@nexfit.test'),
 ('91000000-0000-4000-8000-000000000002','avatar-b@nexfit.test');

SET ROLE authenticated;
SET request.jwt.claim.sub = '91000000-0000-4000-8000-000000000001';

INSERT INTO storage.objects(bucket_id,name)
VALUES ('athlete-avatars','91000000-0000-4000-8000-000000000001/profile.webp');

DO $$
DECLARE denied boolean := false; changed_rows integer;
BEGIN
  IF (SELECT count(*) FROM storage.objects) <> 1 THEN
    RAISE EXCEPTION 'Avatar owner cannot read their own object';
  END IF;

  BEGIN
    INSERT INTO storage.objects(bucket_id,name)
    VALUES ('athlete-avatars','91000000-0000-4000-8000-000000000002/intruder.webp');
  EXCEPTION WHEN insufficient_privilege THEN
    denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'Avatar owner inserted an object into another user folder'; END IF;
END $$;
RESET ROLE;

SET ROLE authenticated;
SET request.jwt.claim.sub = '91000000-0000-4000-8000-000000000002';
DO $$
BEGIN
  IF (SELECT count(*) FROM storage.objects) <> 0 THEN
    RAISE EXCEPTION 'Second athlete can read another athlete avatar';
  END IF;
END $$;
INSERT INTO storage.objects(bucket_id,name)
VALUES ('athlete-avatars','91000000-0000-4000-8000-000000000002/profile.webp');
RESET ROLE;

SET ROLE anon;
DO $$
BEGIN
  IF (SELECT count(*) FROM storage.objects) <> 0 THEN
    RAISE EXCEPTION 'Anonymous role can read private avatar objects';
  END IF;
END $$;
RESET ROLE;

ROLLBACK;
