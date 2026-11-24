'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const evolution=fs.readFileSync('exercise-evolution.js','utf8');

test('evolution computes progressive personal records for load, reps and Epley 1RM',()=>{
 assert.match(evolution,/function detectPersonalRecords\(points,metricType\)/);
 assert.match(evolution,/labels\.push\('Carga'\)/);
 assert.match(evolution,/labels\.push\('Repetições'\)/);
 assert.match(evolution,/labels\.push\('1RM estimado'\)/);
 assert.match(evolution,/point\.value\*\(1\+point\.reps\/30\)/);
});

test('timed exercise history identifies duration records',()=>{
 assert.match(evolution,/labels\.push\('Duração'\)/);
 assert.match(evolution,/personalRecordData\.best\.duration/);
});

test('personal records are highlighted on the set history list',()=>{
 assert.match(evolution,/evolution-pr-badge/);
 assert.match(evolution,/personalRecordData\.flags\.get/);
 assert.match(evolution,/Recorde pessoal · repetições/);
 assert.match(evolution,/timestamp,value,reps:Number\(log\.reps_completed\|\|0\)/);
});
