'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const history=fs.readFileSync('workout-history.js','utf8');

test('history session lookup selects only the fields needed for matching and display',()=>{
 assert.match(history,/select\('id,athlete_id,program_id,subworkout_id,started_at,finished_at'\)/);
 assert.doesNotMatch(history,/training_sessions'\)\.select\('\*'\)/);
});

test('history details fetch only exercise and set-log fields used by the view',()=>{
 assert.match(history,/training_exercises'\)\.select\('id,name,sets,rest_seconds,position'\)/);
 assert.match(history,/training_set_logs'\)\.select\('exercise_id,set_number,reps_completed,load_kg,duration_seconds,rpe,rir'\)/);
});

test('history matches set logs through a prebuilt map instead of scanning all logs for each set',()=>{
 assert.match(history,/const logBySet=new Map/);
 assert.match(history,/logBySet\.get\(String\(e\.id\)\+'_'\+no\)/);
 assert.doesNotMatch(history,/\(logs\.data\|\|\[\]\)\.find\(/);
});

test('history fallback avoids empty IN queries',()=>{
 assert.match(history,/programIds\.length\?dbx\.from\('training_programs'\)/);
 assert.match(history,/subIds\.length\?dbx\.from\('training_subworkouts'\)/);
});


test('history displays and edits optional RPE/RIR values per set',()=>{
 assert.match(history,/log\.rpe!=null\?' · RPE '/);
 assert.match(history,/log\.rir!=null\?' · RIR '/);
 assert.match(history,/data-wh-effort-type=/);
 assert.match(history,/data-wh-effort-value=/);
 assert.match(history,/effortValues=\{rpe:/);
});

test('history details use the requested per-set table columns',()=>{
 assert.ok(history.includes('>Exercício</th>'));
 assert.ok(history.includes('>Repetições</th>'));
 assert.ok(history.includes('>Carga</th>'));
 assert.ok(history.includes("if(!editing)return '<tr><td><strong>'+esc(normalizeHumanText(e.name))"));
});
