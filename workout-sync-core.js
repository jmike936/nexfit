/* NEXFIT | Pure offline workout sync primitives (browser + Node tests). */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.NexfitWorkoutSyncCore=api;
})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 function logKey(row){return String(row.exercise_id)+':'+String(row.set_number)}
 function mergeSetLogs(serverLogs=[],localLogs=[]){
  const merged=new Map();
  for(const row of Array.isArray(serverLogs)?serverLogs:[]){
   if(row?.exercise_id==null||row?.set_number==null)continue;
   merged.set(logKey(row),row);
  }
  for(const row of Array.isArray(localLogs)?localLogs:[]){
   if(row?.exercise_id==null||row?.set_number==null)continue;
   const key=logKey(row);if(!merged.has(key))merged.set(key,row);
  }
  return [...merged.values()];
 }
 function isOwnedSessionSnapshot(saved,userId){
  return !!saved&&!!userId&&saved.userId===userId&&!!saved.sessionId;
 }
 function buildSessionPayload(session,saved,userId){
  if(!session?.id||!saved||!userId)throw new Error('Dados insuficientes para sincronizar a sessão.');
  return {
   id:session.id,athlete_id:userId,program_id:saved.programId,
   version_id:saved.versionId,subworkout_id:saved.subworkoutId,
   started_at:session.started_at,status:'in_progress'
  };
 }
 function buildSetLogPayloads(sessionId,logs=[],fallbackCompletedAt){
  if(!sessionId)throw new Error('Sessão inválida para sincronizar séries.');
  return (Array.isArray(logs)?logs:[]).filter(row=>row?.exercise_id!=null&&row?.set_number!=null).map(row=>({
   session_id:sessionId,exercise_id:row.exercise_id,set_number:row.set_number,
   reps_completed:row.reps_completed,load_kg:row.load_kg??null,
   duration_seconds:row.duration_seconds??null,distance_m:row.distance_m??null,
   notes:row.notes??null,completed_at:row.completed_at||fallbackCompletedAt||new Date().toISOString()
  }));
 }
 function buildCompletedActivityPayload({pendingSession,saved,userId,finishedAt}){
  if(!pendingSession?.id||!saved||!userId)throw new Error('Dados insuficientes para criar a atividade.');
  const completedAt=finishedAt||pendingSession.finished_at||new Date().toISOString();
  const started=new Date(pendingSession.started_at||Date.now()),finished=new Date(completedAt);
  const minutes=Math.max(1,Math.round((finished.getTime()-started.getTime())/60000));
  const sub=(saved.subworkouts||[]).find(x=>x.id===saved.subworkoutId)||{title:'Treino'};
  const title=saved.current?.title||'Treino';
  const notes=title+' · '+(sub.title||'Treino')+' [NEXFIT_SESSION:'+pendingSession.id+']';
  const date=new Date(completedAt);
  const activityDate=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
  return {id:pendingSession.id,user_id:userId,sport:'Musculação',activity_date:activityDate,duration_minutes:minutes,distance_km:null,notes};
 }
 function queueCancellation(pending,sessionId,userId,queuedAt){
  if(!sessionId||!userId)return null;
  const queue=Array.isArray(pending)?pending.slice():[];
  if(!queue.some(item=>item?.sessionId===sessionId&&item?.userId===userId)){
   queue.push({userId,sessionId,queuedAt:queuedAt||new Date().toISOString()});
  }
  return queue;
 }
 function removePendingCancellation(pending,sessionId,userId){
  return (Array.isArray(pending)?pending:[]).filter(item=>!(item?.sessionId===sessionId&&(!userId||item?.userId===userId)));
 }
 function createSyncCoordinator(){
  const pending=new Map();
  return {
   run(key,operation){
    if(!key||typeof operation!=='function')return Promise.reject(new Error('Chave e operação são obrigatórias.'));
    if(pending.has(key))return pending.get(key);
    const task=Promise.resolve().then(operation);
    const tracked=task.finally(()=>{if(pending.get(key)===tracked)pending.delete(key)});
    pending.set(key,tracked);
    return tracked;
   },
   has(key){return pending.has(key)},
   size(){return pending.size}
  };
 }
 return {mergeSetLogs,isOwnedSessionSnapshot,buildSessionPayload,buildSetLogPayloads,buildCompletedActivityPayload,queueCancellation,removePendingCancellation,createSyncCoordinator};
});
