(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NexfitEvolutionPeriods=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function splitPeriods(points,days,now=new Date()){
  const end=new Date(now);end.setHours(23,59,59,999);
  const start=new Date(end);start.setDate(start.getDate()-days+1);start.setHours(0,0,0,0);
  const previousEnd=new Date(start);previousEnd.setMilliseconds(-1);
  const previousStart=new Date(previousEnd);previousStart.setDate(previousStart.getDate()-days+1);previousStart.setHours(0,0,0,0);
  const time=p=>new Date(p.timestamp||p.date).getTime();
  const valid=points.filter(p=>Number.isFinite(time(p)));
  return {current:valid.filter(p=>time(p)>=start.getTime()&&time(p)<=end.getTime()),previous:valid.filter(p=>time(p)>=previousStart.getTime()&&time(p)<=previousEnd.getTime()),start, end, previousStart, previousEnd};
 }
 function sessionBest(points,metricType){
  const map=new Map();
  for(const p of points){const old=map.get(p.sessionId);if(metricType==='volume'&&old)old.value+=p.value;else if(!old||p.value>old.value)map.set(p.sessionId,{...p});}
  return [...map.values()].sort((a,b)=>new Date(a.timestamp||a.date)-new Date(b.timestamp||b.date));
 }
 function summarize(points,metricType){
  const sessions=sessionBest(points,metricType);
  return {sessions:sessions.length,total:sessions.reduce((sum,p)=>sum+p.value,0),best:sessions.reduce((best,p)=>!best||p.value>best.value?p:best,null),average:sessions.length?sessions.reduce((sum,p)=>sum+p.value,0)/sessions.length:0};
 }
 return {splitPeriods,sessionBest,summarize};
});
