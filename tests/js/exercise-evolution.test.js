'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const evolution=fs.readFileSync('exercise-evolution.js','utf8');

test('mobile evolution indicators use readable two-column cards and touch scrolling chart',()=>{
 assert.match(evolution,/evolution-stats\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(evolution,/evolution-chart-scroll/);
 assert.match(evolution,/overflow-x:auto/);
 assert.match(evolution,/evolution-chart-points/);
});

test('estimated 1RM is explicitly identified as Epley estimate, not a maximal test',()=>{
 assert.match(evolution,/fórmula de Epley/);
 assert.match(evolution,/não um teste de carga máxima/);
});

test('chart exposes recent session values in readable text, not only SVG tooltips',()=>{
 assert.match(evolution,/Registros mais recentes do gráfico/);
 assert.match(evolution,/formatMetric\(p\.value,metricType\)/);
});
