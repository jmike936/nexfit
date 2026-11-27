'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const evolution=fs.readFileSync('exercise-evolution.js','utf8');

test('exercise history exposes separate load and estimated-1RM series without load-times-reps metric',()=>{
 assert.match(evolution,/addPoint\('load',load\)/);
 assert.doesNotMatch(evolution,/addPoint\('volume',load\*reps\)/);
 assert.match(evolution,/estimateOneRepMax\(load,reps,'epley'\)/);
 assert.match(evolution,/estimateOneRepMax\(load,reps,'brzycki'\)/);
 assert.match(evolution,/addPoint\('estimated1RMBrzycki',brzycki\)/);
});

test('session summaries keep metrics independent and no longer create load-times-reps series',()=>{
 assert.match(evolution,/function sessionSeries\(points,metricType\)/);
 assert.match(evolution,/Séries semanais por grupo muscular/);
 assert.match(evolution,/Contagem das séries registradas, sem multiplicar carga por repetições/);
 assert.match(evolution,/const series=sessionSeries\(points,metricType\)/);
});

test('weekly evolution uses sets and estimated-1RM keeps a specific label',()=>{
 assert.match(evolution,/Recorde pessoal · 1RM estimado/);
 assert.match(evolution,/1RM estimado/);
});

test('exercise evolution exposes independent Epley and Brzycki estimate series',()=>{
 assert.match(evolution,/estimateOneRepMax\(load,reps,'epley'\)/);
 assert.match(evolution,/estimateOneRepMax\(load,reps,'brzycki'\)/);
 assert.match(evolution,/estimated1RMBrzycki/);
 assert.match(evolution,/Fórmula de '\+\(metricType==='estimated1RMBrzycki'\?'Brzycki':'Epley'\)/);
});
