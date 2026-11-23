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
 async function syncWorkoutSnapshot({saved,userId,db,isCurrent=()=>true,now=()=>new Date().toISOString()}={}){
  if(!isOwnedSessionSnapshot(saved,userId)||!saved.session||!db)return {ok:false,reason:'invalid_snapshot'};
  const current=()=>typeof isCurrent!=='function'||isCurrent();
  if(!current())return {ok:false,reason:'account_changed'};
  const pendingSession=saved.session,logs=saved.sessionSetLogs||[];
  const created=await db.upsertSession(buildSessionPayload(pendingSession,saved,userId));
  if(created?.error)return {ok:false,reason:'session_upsert',error:created.error};
  if(!current())return {ok:false,reason:'account_changed'};
  const rows=buildSetLogPayloads(pendingSession.id,logs,now());
  if(rows.length){
   const savedLogs=await db.upsertSetLogs(rows);
   if(savedLogs?.error)return {ok:false,reason:'set_log_upsert',error:savedLogs.error};
   if(!current())return {ok:false,reason:'account_changed'};
  }
  if(!(pendingSession.status==='completed'||pendingSession.finished_at))return {ok:true,completed:false};
  const finishedAt=pendingSession.finished_at||now();
  const updated=await db.completeSession({id:pendingSession.id,athlete_id:userId,status:'completed',finished_at:finishedAt});
  if(updated?.error)return {ok:false,reason:'session_complete',error:updated.error};
  if(!current())return {ok:false,reason:'account_changed'};
  const activityPayload=buildCompletedActivityPayload({pendingSession,saved,userId,finishedAt});
  const existing=await db.findActivityByMarker(userId,activityPayload.notes);
  if(existing?.error)return {ok:false,reason:'activity_lookup',error:existing.error};
  if(!current())return {ok:false,reason:'account_changed'};
  let activityId=existing?.data?.id;
  if(!activityId){
   const inserted=await db.insertActivity(activityPayload);
   if(!current())return {ok:false,reason:'account_changed'};
   if(inserted?.error){
    const raced=await db.findActivityByIdAndMarker(pendingSession.id,userId,activityPayload.notes);
    if(raced?.error||!raced?.data?.id)return {ok:false,reason:'activity_insert',error:inserted.error};
    if(!current())return {ok:false,reason:'account_changed'};
    activityId=raced.data.id;
   }else activityId=inserted?.data?.id;
  }
  if(!activityId)return {ok:false,reason:'activity_missing_id'};
  return {ok:true,completed:true,activityId,activityPayload};
 }
  return {mergeSetLogs,isOwnedSessionSnapshot,buildSessionPayload,buildSetLogPayloads,buildCompletedActivityPayload,queueCancellation,removePendingCancellation,createSyncCoordinator,syncWorkoutSnapshot};
});
