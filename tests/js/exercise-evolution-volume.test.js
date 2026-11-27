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

test('weekly sets are split across multiple primary muscles without using load times repetitions',()=>{
 const result=core.aggregateWeeklyVolume({
  logs:[{session_id:'s1',exercise_id:'e1',load_kg:20,reps_completed:10}],
  exerciseById:new Map([['e1',{catalogId:'c1'}]]),
  catalogById:new Map([['c1',{primary_muscles:['Peitoral','Tríceps']}]]),
  sessionDateById:new Map([['s1','2026-11-24']])
 });
 assert.deepEqual(result.weeks,['2026-11-23']);
 assert.equal(result.groups.length,2);
 assert.equal(result.groups.find(x=>x.muscle==='Peito').weeks['2026-11-23'].sets,0.5);
 assert.equal(result.groups.find(x=>x.muscle==='Tríceps').weeks['2026-11-23'].sets,0.5);
});

test('weekly sets include timed records and ignore exercises without catalog muscle links',()=>{
 const result=core.aggregateWeeklyVolume({
  logs:[
   {session_id:'s1',exercise_id:'e1',load_kg:null,reps_completed:0,duration_seconds:40},
   {session_id:'s1',exercise_id:'e2',load_kg:10,reps_completed:10},
   {session_id:'s1',exercise_id:'e3',load_kg:10,reps_completed:10}
  ],
  exerciseById:new Map([['e1',{catalogId:'c1'}],['e2',{catalogId:'missing'}],['e3',{catalogId:null}]]),
  catalogById:new Map([['c1',{primary_muscles:['Abdômen']}]]),
  sessionDateById:new Map([['s1','2026-11-24']])
 });
 assert.equal(result.groups.length,1);
 assert.equal(result.groups[0].muscle,'Abdômen');
 assert.equal(result.groups[0].weeks['2026-11-23'].sets,1);
});

test('weekly set totals do not depend on load or repetition multiplication',()=>{
 const result=core.aggregateWeeklyVolume({
  logs:[{session_id:'s1',exercise_id:'e1',load_kg:200,reps_completed:20}],
  exerciseById:new Map([['e1',{catalogId:'c1'}]]),
  catalogById:new Map([['c1',{primary_muscles:['Peito']}]]),
  sessionDateById:new Map([['s1','2026-11-24']])
 });
 assert.equal(result.groups[0].weeks['2026-11-23'].sets,1);
});

test('weekly activity counts sessions, completed sets, and distinct exercises',()=>{
 const result=core.aggregateWeeklyActivity({
  logs:[
   {session_id:'s1',exercise_id:'e1'},
   {session_id:'s1',exercise_id:'e1'},
   {session_id:'s1',exercise_id:'e2'},
   {session_id:'s2',exercise_id:'e1'},
   {session_id:'s3',exercise_id:'e3'}
  ],
  sessionDateById:new Map([
   ['s1','2026-11-24'],['s2','2026-11-25'],['s3','2026-11-30']
  ])
 });
 assert.deepEqual(result,[
  {week:'2026-11-23',sessions:2,exercises:2,sets:4},
  {week:'2026-11-30',sessions:1,exercises:1,sets:1}
 ]);
});

test('weekly activity does not mix sessions from different weeks',()=>{
 const result=core.aggregateWeeklyActivity({
  logs:[
   {session_id:'s1',exercise_id:'e1',completed_at:'2026-11-22'},
   {session_id:'s2',exercise_id:'e2',completed_at:'2026-11-23'}
  ]
 });
 assert.equal(result.length,2);
 assert.equal(result[0].week,'2026-11-16');
 assert.equal(result[1].week,'2026-11-23');
});
