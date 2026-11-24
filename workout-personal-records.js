(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NexfitWorkoutPersonalRecords=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function detectNewRecords({currentLogs=[],currentExercises=[],historicalLogs=[],historicalExercises=[]}={}){
  const currentById=new Map(currentExercises.map(row=>[String(row.id),row]));
  const historyById=new Map(historicalExercises.map(row=>[String(row.id),row]));
  const history=new Map();
  const update=(target,identity,log)=>{
   const item=target.get(identity)||{load:0,reps:0,estimated1RM:0,duration:0};
   const load=Number(log.load_kg),reps=Number(log.reps_completed),duration=Number(log.duration_seconds);
   if(Number.isFinite(load)&&load>item.load)item.load=load;
   if(Number.isFinite(reps)&&reps>item.reps)item.reps=reps;
   if(Number.isFinite(duration)&&duration>item.duration)item.duration=duration;
   if(Number.isFinite(load)&&load>0&&Number.isFinite(reps)&&reps>=1&&reps<=12){const estimate=load*(1+reps/30);if(estimate>item.estimated1RM)item.estimated1RM=estimate}
   target.set(identity,item);
  };
  for(const log of historicalLogs){const exercise=historyById.get(String(log.exercise_id)),identity=String(exercise?.identity_id||'');if(identity)update(history,identity,log)}
  const current=new Map();
  for(const log of currentLogs){const exercise=currentById.get(String(log.exercise_id)),identity=String(exercise?.identity_id||'');if(identity&&(Number(log.duration_seconds)>0||Number(log.reps_completed)>0))update(current,identity,log)}
  const labels={load:'Carga',reps:'Repetições',estimated1RM:'1RM estimado',duration:'Duração'};
  const results=[];
  for(const [identity,values] of current){
   const previous=history.get(identity)||{load:0,reps:0,estimated1RM:0,duration:0};
   const records=Object.keys(labels).filter(key=>values[key]>previous[key]).map(key=>({type:key,label:labels[key],value:values[key]}));
   if(records.length){const exercise=currentById.get(String(currentExercises.find(x=>String(x.identity_id)===identity)?.id));results.push({identityId:identity,exerciseName:exercise?.name||'Exercício',records})}
  }
  return results;
 }
 return {detectNewRecords};
});
