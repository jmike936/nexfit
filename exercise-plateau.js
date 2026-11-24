(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NexfitExercisePlateau=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MIN_SESSIONS=5,MIN_SPAN_DAYS=28,CHANGE_THRESHOLD=0.05;
 function sessionValues(points,metricType){
  const sessions=new Map();
  for(const point of points||[]){
   const date=new Date(point.timestamp||point.date);
   const value=Number(point.value);
   if(!point.sessionId||!Number.isFinite(date.getTime())||!Number.isFinite(value)||value<=0)continue;
   const old=sessions.get(point.sessionId);
   if(metricType==='volume'&&old)old.value+=value;
   else if(!old||value>old.value)sessions.set(point.sessionId,{sessionId:point.sessionId,date,value});
  }
  return [...sessions.values()].sort((a,b)=>a.date-b.date);
 }
 function analyze(points,metricType){
  if(!['load','volume','estimated1RM'].includes(metricType))return {status:'insufficient',sessions:0,spanDays:0,changePercent:null};
  const sessions=sessionValues(points,metricType);
  if(sessions.length<MIN_SESSIONS)return {status:'insufficient',sessions:sessions.length,spanDays:0,changePercent:null};
  const spanDays=(sessions[sessions.length-1].date-sessions[0].date)/86400000;
  if(spanDays<MIN_SPAN_DAYS)return {status:'insufficient',sessions:sessions.length,spanDays,changePercent:null};
  const first=sessions.slice(0,2).reduce((sum,item)=>sum+item.value,0)/2;
  const last=sessions.slice(-2).reduce((sum,item)=>sum+item.value,0)/2;
  if(first<=0)return {status:'insufficient',sessions:sessions.length,spanDays,changePercent:null};
  const changePercent=(last-first)/first;
  const status=changePercent < -CHANGE_THRESHOLD?'decline':changePercent <= CHANGE_THRESHOLD?'stable':'progress';
  return {status,sessions:sessions.length,spanDays,changePercent};
 }
 return {analyze,sessionValues,MIN_SESSIONS,MIN_SPAN_DAYS,CHANGE_THRESHOLD};
});
