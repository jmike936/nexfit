'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('../../exercise-evolution-core');

test('Epley estimate supports sets from 1 through 12 reps',()=>{
 assert.equal(core.estimateOneRepMax(100,1,'epley'),100*(1+1/30));
 assert.equal(core.estimateOneRepMax(100,12,'epley'),140);
 assert.equal(core.estimateOneRepMax(100,13,'epley'),null);
});

test('Brzycki estimate supports sets from 1 through 10 reps',()=>{
 assert.equal(core.estimateOneRepMax(100,1,'brzycki'),3600/36);
 assert.equal(core.estimateOneRepMax(100,10,'brzycki'),3600/27);
 assert.equal(core.estimateOneRepMax(100,11,'brzycki'),null);
});

test('one-rep max estimates reject invalid inputs and unknown formulas',()=>{
 for(const input of [[0,5,'epley'],[-10,5,'brzycki'],[100,0,'epley'],[100,2.5,'epley'],[100,5,'unknown'],[NaN,5,'epley']]){
  assert.equal(core.estimateOneRepMax(...input),null);
 }
});
