'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('supabase/operations/preview_legacy_workout_identity_reconciliation.sql','utf8');
const executable=sql.replace(/--[^\n]*/g,'').trim();

test('legacy identity preflight is read-only and does not mutate production data',()=>{
 assert.doesNotMatch(executable,/\b(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE|COMMENT|CALL|DO)\b/i);
 assert.match(executable,/WITH exercise_keys AS/);
 assert.match(executable,/linked_sessions_preserved/);
 assert.match(executable,/linked_set_logs_preserved/);
 assert.match(executable,/canonical_identity_id/);
});
