'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {splitPeriods,sessionBest,summarize}=require('../../evolution-periods.js');

test('splits selected period from the immediately preceding equal period',()=>{
 const now=new Date('2026-11-24T12:00:00');
 const points=[{date:'2026-11-24',sessionId:'a',value:100},{date:'2026-10-25',sessionId:'b',value:80},{date:'2026-09-20',sessionId:'c',value:60}];
 const result=splitPeriods(points,30,now);
 assert.equal(result.current.length,1);
 assert.equal(result.previous.length,1);
 assert.equal(result.current[0].value,100);
 assert.equal(result.previous[0].value,80);
});

test('aggregates volume across sets but selects the best single-set metric per session',()=>{
 const points=[{date:'2026-11-24',sessionId:'a',value:100},{date:'2026-11-24',sessionId:'a',value:120},{date:'2026-11-20',sessionId:'b',value:90}];
 assert.equal(sessionBest(points,'volume').find(x=>x.sessionId==='a').value,220);
 assert.equal(sessionBest(points,'load').find(x=>x.sessionId==='a').value,120);
 assert.equal(summarize(points,'volume').sessions,2);
 assert.equal(summarize(points,'volume').average,155);
});

test('returns empty previous period when there are no matching records',()=>{
 const result=splitPeriods([{date:'2026-11-24',sessionId:'a',value:10}],30,new Date('2026-11-24T12:00:00'));
 assert.equal(result.previous.length,0);
});
