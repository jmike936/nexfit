'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('../../exercise-evolution-core.js');

test('muscle aliases are grouped into consistent Portuguese labels',()=>{
 assert.equal(core.canonicalMuscle('Peitoral maior'),'Peito');
 assert.equal(core.canonicalMuscle('Tríceps braquial'),'Tríceps');
 assert.equal(core.canonicalMuscle('Hamstrings'),'Posterior de coxa');
 assert.equal(core.canonicalMuscle('Gluteus maximus'),'Glúteos');
});

test('weekly buckets start on Monday',()=>{
 assert.equal(core.weekStartKey('2026-11-24'),'2026-11-23');
 assert.equal(core.weekStartKey('2026-11-22'),'2026-11-16');
 assert.equal(core.weekStartKey('invalid'),'');
});

test('weekly tonnage and equivalent sets are split across multiple primary muscles',()=>{
 const result=core.aggregateWeeklyVolume({
  logs:[{session_id:'s1',exercise_id:'e1',load_kg:20,reps_completed:10}],
  exerciseById:new Map([['e1',{catalogId:'c1'}]]),
  catalogById:new Map([['c1',{primary_muscles:['Peitoral','Tríceps']}]]),
  sessionDateById:new Map([['s1','2026-11-24']])
 });
 assert.deepEqual(result.weeks,['2026-11-23']);
 assert.equal(result.groups.length,2);
 assert.equal(result.groups.find(x=>x.muscle==='Peito').weeks['2026-11-23'].volume,100);
 assert.equal(result.groups.find(x=>x.muscle==='Tríceps').weeks['2026-11-23'].sets,0.5);
});

test('weekly volume ignores timed, unloaded, and unlinked exercise records',()=>{
 const result=core.aggregateWeeklyVolume({
  logs:[
   {session_id:'s1',exercise_id:'e1',load_kg:null,reps_completed:20,duration_seconds:40},
   {session_id:'s1',exercise_id:'e2',load_kg:10,reps_completed:10},
   {session_id:'s1',exercise_id:'e3',load_kg:10,reps_completed:10}
  ],
  exerciseById:new Map([['e2',{catalogId:'missing'}],['e3',{catalogId:null}]]),
  catalogById:new Map(),
  sessionDateById:new Map([['s1','2026-11-24']])
 });
 assert.equal(result.groups.length,0);
});
