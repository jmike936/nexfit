const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const migration = fs.readFileSync('supabase/migrations/20261127173903_exercise_catalog_purposes.sql', 'utf8');

test('exercise purposes use a many-to-many relationship with review status', () => {
  assert.match(migration, /create table if not exists public\.training_exercise_purposes/);
  assert.match(migration, /create table if not exists public\.training_exercise_catalog_purposes/);
  assert.match(migration, /primary key \(catalog_exercise_id, purpose_id\)/);
  assert.match(migration, /review_status in \('pending', 'approved', 'rejected'\)/);
  assert.match(migration, /review_status = 'approved' and reviewed_at is not null/);
});

test('exercise purpose tables enable RLS and expose only approved links to authenticated users', () => {
  assert.match(migration, /alter table public\.training_exercise_purposes enable row level security/);
  assert.match(migration, /alter table public\.training_exercise_catalog_purposes enable row level security/);
  assert.match(migration, /revoke all on table public\.training_exercise_catalog_purposes from public, anon, authenticated/);
  assert.match(migration, /grant select on table public\.training_exercise_catalog_purposes to authenticated/);
  assert.match(migration, /grant all on table public\.training_exercise_catalog_purposes to service_role/);
  assert.match(migration, /review_status = 'approved'/);
});
