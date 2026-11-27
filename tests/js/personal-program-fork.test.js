'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('musculacao.js','utf8');
const migration=fs.readFileSync('supabase/migrations/20261127200000_athlete_personal_program_fork.sql','utf8');

test('assigned professional programs are not edited directly by the athlete',()=>{
 assert.match(source,/function isPersonalForkSourceProgram\(p,userId=userRef\(\)\?\.id\)/);
 assert.match(source,/if\(isPersonalForkSourceProgram\(program,userId\)\).*Programa compartilhado/s);
 assert.match(source,/data-fork-program/);
 assert.match(source,/nexfit_fork_assigned_program/);
});

test('an active personal fork replaces the source only in the athlete training list',()=>{
 assert.match(source,/function activePersonalForkSourceIds/);
 assert.match(source,/function isHiddenByPersonalFork/);
 assert.match(source,/!hiddenForkSources\.has\(String\(p\.id\)\)/);
 assert.match(source,/!isHiddenByPersonalFork\(p,renderUserId\)/);
 assert.match(source,/!isPersonalForkSourceProgram\(x,renderUserId\)/);
});

test('personal fork preserves workout history continuity from its source program',()=>{
 assert.match(source,/const historyProgramIds=\[programId,\.\.\.\(current\?\.id===programId&&current\.source_program_id\?\[current\.source_program_id\]:\[\]\)\]/);
 assert.match(source,/\.in\('program_id',historyProgramIds\)/);
 assert.match(source,/lastExecutionForWorkout\(a\.program\.id,a\.workout,a\.program\.source_program_id\)/);
});

test('fork RPC is athlete-scoped, idempotent, and copies without moving history',()=>{
 assert.match(migration,/p\.athlete_id = v_user/);
 assert.match(migration,/p\.created_by <> v_user/);
 assert.match(migration,/if auth\.uid\(\) is null then/);
 assert.match(migration,/to authenticated, service_role/);
 assert.match(migration,/p\.source_program_id = v_source\.id/);
 assert.match(migration,/for update;/);
 assert.match(migration,/training_programs_one_active_personal_fork_uidx/);
 assert.match(migration,/identity_id, catalog_exercise_id, name, position, sets/);
 assert.doesNotMatch(migration,/insert into public\.training_sessions/);
 assert.doesNotMatch(migration,/insert into public\.training_set_logs/);
});

test('confirming a personal version excludes only its source from category conflict checks',()=>{
 assert.match(migration,/p\.id is distinct from \(\s*select source_program_id from public\.training_programs where id = v_program\s*\)/);
 assert.match(migration,/where id = v_program and created_by <> auth\.uid\(\)/);
});

test('replacing a workout keeps its stable identity and protects prior sessions and set logs',()=>{
 const start=source.indexOf('async function replaceSubworkout(id){');
 const end=source.indexOf('async function deleteSubworkout(id){',start);
 assert.ok(start>=0&&end>start,'replacement function should exist');
 const replacement=source.slice(start,end);
 assert.match(source,/data-replace-sub/);
 assert.match(source,/if\(action==='replace'\)return replaceSubworkout\(workout\.id\)/);
 assert.match(replacement,/programVersion\.status!=='pending'/);
 assert.match(replacement,/training_sessions'\)\.select\('id',\{count:'exact',head:true\}\)\.eq\('subworkout_id',item\.id\)/);
 assert.match(replacement,/training_set_logs'\)\.select\('id',\{count:'exact',head:true\}\)\.in\('exercise_id',exerciseIds\)/);
 assert.match(replacement,/training_subworkouts'\)\.update\(\{title\}\)\.eq\('id',item\.id\)/);
 assert.match(replacement,/training_exercises'\)\.delete\(\)\.eq\('subworkout_id',item\.id\)/);
 assert.doesNotMatch(replacement,/training_sessions'\)\.delete/);
 assert.doesNotMatch(replacement,/training_set_logs'\)\.delete/);
});
