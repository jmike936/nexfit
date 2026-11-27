'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {detectNewRecords}=require('../../workout-personal-records.js');
const fs=require('node:fs');
const workout=fs.readFileSync('musculacao.js','utf8');
const exercise={id:'current',identity_id:'stable-1',name:'Supino reto'};
test('detects load, reps and Epley estimated 1RM records against prior sessions',()=>{
 const result=detectNewRecords({currentExercises:[exercise],currentLogs:[{exercise_id:'current',load_kg:80,reps_completed:8}],historicalExercises:[{id:'old',identity_id:'stable-1'}],historicalLogs:[{exercise_id:'old',load_kg:75,reps_completed:8}]});
 assert.deepEqual(result[0].records.map(x=>x.type),['load','estimated1RM']);
});
test('detects a repetitions record even when load does not improve',()=>{
 const result=detectNewRecords({currentExercises:[exercise],currentLogs:[{exercise_id:'current',load_kg:40,reps_completed:12}],historicalExercises:[{id:'old',identity_id:'stable-1'}],historicalLogs:[{exercise_id:'old',load_kg:40,reps_completed:10}]});
 assert.deepEqual(result[0].records.map(x=>x.type),['reps','estimated1RM']);
});
test('detects duration records and does not compare exercises without stable identity',()=>{
 const result=detectNewRecords({currentExercises:[{id:'timed',identity_id:'timed-1',name:'Prancha'},{id:'legacy',name:'Rosca'}],currentLogs:[{exercise_id:'timed',duration_seconds:60},{exercise_id:'legacy',load_kg:100,reps_completed:10}],historicalExercises:[{id:'old',identity_id:'timed-1'}],historicalLogs:[{exercise_id:'old',duration_seconds:45}]});
 assert.equal(result.length,1);
 assert.equal(result[0].records[0].type,'duration');
});
test('does not celebrate unchanged or lower results',()=>{
 const result=detectNewRecords({currentExercises:[exercise],currentLogs:[{exercise_id:'current',load_kg:70,reps_completed:8}],historicalExercises:[{id:'old',identity_id:'stable-1'}],historicalLogs:[{exercise_id:'old',load_kg:75,reps_completed:10}]});
 assert.deepEqual(result,[]);
});
test('does not create estimated 1RM from sets above twelve reps',()=>{
 const result=detectNewRecords({currentExercises:[exercise],currentLogs:[{exercise_id:'current',load_kg:40,reps_completed:15}],historicalExercises:[{id:'old',identity_id:'stable-1'}],historicalLogs:[{exercise_id:'old',load_kg:40,reps_completed:14}]});
 assert.deepEqual(result[0].records.map(x=>x.type),['reps']);
});

test('workout completion passes detected personal records to the celebration screen',()=>{
 assert.match(workout,/const summary=\{[\s\S]*?personalRecords,[\s\S]*?synced:!!synced/);
 assert.match(workout,/renderPersonalRecordCelebration\(summary\.personalRecords\)/);
});

test('first completed workout can create personal records without a prior session',()=>{
 assert.match(workout,/let historicalLogs=\[\]/);
 assert.match(workout,/if\(sessionIds\.length&&exerciseIds\.length\)/);
 assert.doesNotMatch(workout,/!sessionsQ\.data\?\.length/);
 assert.match(workout,/historicalLogs,historicalExercises:exercisesQ\.data\|\|\[\]/);
});
