(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.NexfitExerciseEvolutionCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR');
 function canonicalMuscle(value){
  const key=normalize(value);
  if(!key)return '';
  if(/peito|peitoral|pector/.test(key))return 'Peito';
  if(/costas|dorsal|latissimo|latissimus|trapezio/.test(key))return 'Costas';
  if(/ombro|deltoid/.test(key))return 'Ombros';
  if(/biceps/.test(key))return 'Bíceps';
  if(/triceps/.test(key))return 'Tríceps';
  if(/quadriceps|coxa anterior/.test(key))return 'Quadríceps';
  if(/posterior|isquiotib|hamstring|femoral/.test(key))return 'Posterior de coxa';
  if(/glute/.test(key))return 'Glúteos';
  if(/panturrilha|gastrocnemio|soleo|calf/.test(key))return 'Panturrilhas';
  if(/abdomen|obliquo|core/.test(key))return 'Abdômen';
  if(/antebraco|forearm/.test(key))return 'Antebraços';
  return String(value).trim().replace(/\s+/g,' ');
 }
 function estimateOneRepMax(load,reps,formula='epley'){
  const weight=Number(load),count=Number(reps);
  if(!Number.isFinite(weight)||weight<=0||!Number.isInteger(count)||count<1)return null;
  if(formula==='epley')return count<=12?weight*(1+count/30):null;
  if(formula==='brzycki')return count<=10?36*weight/(37-count):null;
  return null;
 }
 function weekStartKey(value){
  const raw=String(value??'').slice(0,10);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(raw))return '';
  const date=new Date(raw+'T12:00:00Z');
  if(Number.isNaN(date.getTime()))return '';
  date.setUTCDate(date.getUTCDate()-((date.getUTCDay()+6)%7));
  return date.toISOString().slice(0,10);
 }
 function aggregateWeeklyVolume({logs=[],exerciseById=new Map(),catalogById=new Map(),sessionDateById=new Map()}={}){
  const groups=new Map(),weekSet=new Set();
  for(const log of logs){
   const load=Number(log.load_kg),reps=Number(log.reps_completed);
   if(!Number.isFinite(load)||load<=0||!Number.isFinite(reps)||reps<=0)continue;
   const exercise=exerciseById.get(String(log.exercise_id));
   if(!exercise?.catalogId)continue;
   const catalog=catalogById.get(String(exercise.catalogId));
   const rawMuscles=Array.isArray(catalog?.primary_muscles)?catalog.primary_muscles:[];
   const muscles=[...new Set(rawMuscles.map(canonicalMuscle).filter(Boolean))];
   if(!muscles.length)continue;
   const date=sessionDateById.get(String(log.session_id))||log.completed_at||'';
   const week=weekStartKey(date);if(!week)continue;
   weekSet.add(week);
   const share=1/muscles.length;
   for(const muscle of muscles){
    if(!groups.has(muscle))groups.set(muscle,{muscle,totalSets:0,weeks:{}});
    const group=groups.get(muscle);
    if(!group.weeks[week])group.weeks[week]={sets:0};
    group.weeks[week].sets+=share;
    group.totalSets+=share;
   }
  }
  const weeks=[...weekSet].sort();
  return {weeks,groups:[...groups.values()].sort((a,b)=>b.totalVolume-a.totalVolume||a.muscle.localeCompare(b.muscle,'pt-BR'))};
 }
 return {canonicalMuscle,weekStartKey,aggregateWeeklyVolume,estimateOneRepMax};
});
