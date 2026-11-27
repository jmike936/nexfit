'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const evolution=fs.readFileSync('exercise-evolution.js','utf8');

test('exercise history exposes separate load, session-volume and estimated-1RM series',()=>{
 assert.match(evolution,/addPoint\('load',load\)/);
 assert.match(evolution,/addPoint\('volume',load\*reps\)/);
 assert.match(evolution,/addPoint\('estimated1RM',load\*\(1\+reps\/30\)\)/);
});

test('session volume sums sets while other metrics keep the best set per session',()=>{
 assert.match(evolution,/function sessionSeries\(points,metricType\)/);
 assert.match(evolution,/if\(metricType==='volume'\)/);
 assert.match(evolution,/old\.value\+=point\.value/);
 assert.match(evolution,/const series=sessionSeries\(points,metricType\)/);
});

test('volume and estimated-1RM records have metric-specific labels and summaries',()=>{
 assert.match(evolution,/Recorde pessoal · volume por sessão/);
 assert.match(evolution,/Recorde pessoal · 1RM estimado/);
 assert.match(evolution,/Volume total da sessão/);
 assert.match(evolution,/1RM estimado/);
});

test('exercise evolution exposes independent Epley and Brzycki estimate series',()=>{
 assert.match(evolution,/estimateOneRepMax\(load,reps,'epley'\)/);
 assert.match(evolution,/estimateOneRepMax\(load,reps,'brzycki'\)/);
 assert.match(evolution,/estimated1RMBrzycki/);
 assert.match(evolution,/Fórmula de '\+\(metricType==='estimated1RMBrzycki'\?'Brzycki':'Epley'\)/);
});
