'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {analyze}=require('../../exercise-plateau.js');
function series(values,days=7,metric='load'){
 return values.map((value,index)=>({sessionId:'s'+index,date:new Date(Date.UTC(2026,0,1+index*days)).toISOString(),timestamp:new Date(Date.UTC(2026,0,1+index*days)).toISOString(),value}));
}
test('does not classify fewer than five sessions or a short observation window',()=>{
 assert.equal(analyze(series([50,50,50,50]),'load').status,'insufficient');
 assert.equal(analyze(series([50,50,50,50,50],3),'load').status,'insufficient');
});
test('detects possible stability only after enough sessions across four weeks',()=>{
 const result=analyze(series([50,51,50,51,50,51]),'load');
 assert.equal(result.status,'stable');
 assert.equal(result.sessions,6);
 assert.ok(result.spanDays>=28);
});
test('distinguishes clear progress and decline from stability',()=>{
 assert.equal(analyze(series([40,42,45,48,52]),'load').status,'progress');
 assert.equal(analyze(series([60,58,55,52,48]),'load').status,'decline');
});
test('sums session volume before comparing first and last sessions',()=>{
 const points=[];
 for(let i=0;i<5;i++){
  const date=new Date(Date.UTC(2026,0,1+i*7)).toISOString();
  points.push({sessionId:'s'+i,date,value:100},{sessionId:'s'+i,date,value:100});
 }
 assert.equal(analyze(points,'volume').status,'stable');
});
test('ignores unsupported time metric and invalid records',()=>{
 assert.equal(analyze(series([30,30,30,30,30]),'time').status,'insufficient');
 assert.equal(analyze([{sessionId:'x',date:'invalid',value:50}], 'load').status,'insufficient');
});
