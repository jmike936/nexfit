const test = require('node:test');
const assert = require('node:assert/strict');
const sync = require('../../workout-sync-core.js');

test('session snapshot is scoped to its owning account',()=>{
 const saved={userId:'athlete-a',sessionId:'session-1'};
 assert.equal(sync.isOwnedSessionSnapshot(saved,'athlete-a'),true);
 assert.equal(sync.isOwnedSessionSnapshot(saved,'athlete-b'),false);
 assert.equal(sync.isOwnedSessionSnapshot({...saved,userId:null},'athlete-a'),false);
 assert.equal(sync.isOwnedSessionSnapshot({...saved,sessionId:null},'athlete-a'),false);
});

test('server set logs win conflicts while local-only logs are retained',()=>{
 const server=[{exercise_id:'e1',set_number:1,reps_completed:10,load_kg:40}];
 const local=[
  {exercise_id:'e1',set_number:1,reps_completed:9,load_kg:35},
  {exercise_id:'e1',set_number:2,reps_completed:8,load_kg:35}
 ];
 const merged=sync.mergeSetLogs(server,local);
 assert.equal(merged.length,2);
 assert.equal(merged.find(x=>x.set_number===1).load_kg,40);
 assert.equal(merged.find(x=>x.set_number===2).load_kg,35);
 assert.deepEqual(sync.mergeSetLogs(merged,local),merged);
});

test('session and set-log payloads retain ownership and stable idempotency keys',()=>{
 const session=sync.buildSessionPayload({id:'s1',started_at:'2026-11-23T10:00:00Z'},{programId:'p1',versionId:'v1',subworkoutId:'w1'},'athlete-a');
 assert.deepEqual(session,{id:'s1',athlete_id:'athlete-a',program_id:'p1',version_id:'v1',subworkout_id:'w1',started_at:'2026-11-23T10:00:00Z',status:'in_progress'});
 const rows=sync.buildSetLogPayloads('s1',[
  {exercise_id:'e1',set_number:1,reps_completed:12,load_kg:50},
  {exercise_id:'e2',set_number:2,reps_completed:0,load_kg:null,duration_seconds:35,notes:'skip',rir:2},
  {exercise_id:'e3',set_number:3,reps_completed:8,load_kg:40,rpe:8.5}
 ],'2026-11-23T10:05:00Z');
 assert.equal(rows.length,3);
 assert.equal(rows[0].session_id,'s1');
 assert.equal(rows[0].load_kg,50);
 assert.equal(rows[0].completed_at,'2026-11-23T10:05:00Z');
 assert.equal(rows[1].load_kg,null);
 assert.equal(rows[1].duration_seconds,35);
 assert.equal(rows[1].notes,'skip');
 assert.equal(rows[1].rir,2);
 assert.equal(rows[1].rpe,null);
 assert.equal(rows[2].rpe,8.5);
 assert.equal(rows[2].rir,null);
});

test('completed activity has a deterministic session marker and duration',()=>{
 const payload=sync.buildCompletedActivityPayload({
  pendingSession:{id:'s1',started_at:'2026-11-23T10:00:00Z'},
  saved:{subworkoutId:'w1',subworkouts:[{id:'w1',title:'Treino A'}],current:{title:'Hipertrofia'}},
  userId:'athlete-a',finishedAt:'2026-11-23T10:42:00Z'
 });
 assert.equal(payload.id,'s1');
 assert.equal(payload.user_id,'athlete-a');
 assert.equal(payload.duration_minutes,42);
 assert.equal(payload.notes,'Hipertrofia · Treino A [NEXFIT_SESSION:s1]');
 assert.equal(payload.activity_date,'2026-11-23');
 assert.deepEqual(sync.buildCompletedActivityPayload({
  pendingSession:{id:'s1',started_at:'2026-11-23T10:00:00Z'},
  saved:{subworkoutId:'w1',subworkouts:[{id:'w1',title:'Treino A'}],current:{title:'Hipertrofia'}},
  userId:'athlete-a',finishedAt:'2026-11-23T10:42:00Z'
 }),payload);
});

test('cancellation queue deduplicates per user and session',()=>{
 const initial=[{userId:'athlete-a',sessionId:'s1',queuedAt:'old'}];
 const queued=sync.queueCancellation(initial,'s1','athlete-a','new');
 assert.equal(queued.length,1);
 assert.equal(queued[0].queuedAt,'old');
 const extended=sync.queueCancellation(queued,'s2','athlete-a','new');
 assert.equal(extended.length,2);
 const other=sync.queueCancellation(extended,'s1','athlete-b','other');
 assert.equal(other.length,3);
 assert.equal(sync.removePendingCancellation(other,'s1','athlete-a').length,2);
 assert.equal(sync.queueCancellation([],null,'athlete-a'),null);
});

test('sync coordinator coalesces concurrent calls and allows retry after failure',async()=>{
 const coordinator=sync.createSyncCoordinator();
 let calls=0,release;
 const gate=new Promise(resolve=>{release=resolve});
 const first=coordinator.run('athlete-a',async()=>{calls++;await gate;return 'synced'});
 const second=coordinator.run('athlete-a',async()=>{calls++;return 'duplicate'});
 assert.equal(coordinator.has('athlete-a'),true);
 assert.equal(coordinator.size(),1);
 release();
 assert.equal(await first,'synced');
 assert.equal(await second,'synced');
 assert.equal(calls,1);
 assert.equal(coordinator.size(),0);
 await assert.rejects(coordinator.run('athlete-a',async()=>{throw new Error('offline') }),/offline/);
 assert.equal(coordinator.size(),0);
 assert.equal(await coordinator.run('athlete-a',async()=> 'retry-ok'),'retry-ok');
});


function makeSyncAdapter(options={}){
 const state={sessions:new Map(),logs:new Map(),activities:new Map(),calls:{session:0,logs:0,complete:0,lookup:0,insert:0,raceLookup:0}};
 let failLogOnce=!!options.failLogOnce;
 return {
  state,
  async upsertSession(payload){state.calls.session++;state.sessions.set(payload.id,{...state.sessions.get(payload.id),...payload});return {data:null,error:null}},
  async upsertSetLogs(rows){state.calls.logs++;if(failLogOnce){failLogOnce=false;return {data:null,error:new Error('temporary offline')}}for(const row of rows)state.logs.set(row.exercise_id+':'+row.set_number,row);return {data:null,error:null}},
  async completeSession(payload){state.calls.complete++;state.sessions.set(payload.id,{...state.sessions.get(payload.id),...payload});return {data:null,error:null}},
  async findActivityByMarker(userId,notes){state.calls.lookup++;if(options.hideInitialLookup)return {data:null,error:null};const found=[...state.activities.values()].find(x=>x.user_id===userId&&x.notes===notes);return {data:found?{id:found.id}:null,error:null}},
  async insertActivity(payload){state.calls.insert++;if(options.insertRace)return {data:null,error:new Error('duplicate race')};state.activities.set(payload.id,payload);return {data:{id:payload.id},error:null}},
  async findActivityByIdAndMarker(id,userId,notes){state.calls.raceLookup++;const found=state.activities.get(id);return {data:found&&found.user_id===userId&&found.notes===notes?{id:found.id}:null,error:null}}
 };
}
function completedSnapshot(){
 return {
  userId:'athlete-a',sessionId:'session-flow-1',programId:'program-1',versionId:'version-1',subworkoutId:'workout-1',
  session:{id:'session-flow-1',started_at:'2026-11-23T10:00:00Z',finished_at:'2026-11-23T10:45:00Z',status:'completed'},
  sessionSetLogs:[{exercise_id:'exercise-1',set_number:1,reps_completed:10,load_kg:60,completed_at:'2026-11-23T10:30:00Z'}],
  subworkouts:[{id:'workout-1',title:'Treino A'}],current:{title:'Hipertrofia'}
 };
}

test('offline completion retry is idempotent and creates one activity',async()=>{
 const saved=completedSnapshot(),db=makeSyncAdapter({failLogOnce:true}),isCurrent=()=>true;
 const first=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent,now:()=> '2026-11-23T10:45:00Z'});
 assert.equal(first.ok,false);
 assert.equal(first.reason,'set_log_upsert');
 assert.equal(db.state.sessions.size,1);
 assert.equal(db.state.logs.size,0);
 assert.equal(db.state.activities.size,0);

 const second=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent,now:()=> '2026-11-23T10:45:00Z'});
 assert.equal(second.ok,true);
 assert.equal(second.completed,true);
 assert.equal(db.state.sessions.size,1);
 assert.equal(db.state.logs.size,1);
 assert.equal(db.state.activities.size,1);
 assert.equal(second.activityPayload.duration_minutes,45);

 const third=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent,now:()=> '2026-11-23T10:45:00Z'});
 assert.equal(third.ok,true);
 assert.equal(db.state.activities.size,1);
 assert.equal(db.state.calls.insert,1);
});

test('completed sync reuses an existing activity marker instead of inserting a duplicate',async()=>{
 const saved=completedSnapshot(),db=makeSyncAdapter();
 const expected=sync.buildCompletedActivityPayload({pendingSession:saved.session,saved,userId:'athlete-a',finishedAt:saved.session.finished_at});
 db.state.activities.set(expected.id,expected);
 const result=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent:()=>true});
 assert.equal(result.ok,true);
 assert.equal(result.activityId,expected.id);
 assert.equal(db.state.calls.insert,0);
 assert.equal(db.state.activities.size,1);
});

test('insert race is recovered by looking up the deterministic session marker',async()=>{
 const saved=completedSnapshot(),db=makeSyncAdapter({insertRace:true,hideInitialLookup:true});
 const expected=sync.buildCompletedActivityPayload({pendingSession:saved.session,saved,userId:'athlete-a',finishedAt:saved.session.finished_at});
 db.state.activities.set(expected.id,expected);
 const result=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent:()=>true});
 assert.equal(result.ok,true);
 assert.equal(result.activityId,expected.id);
 assert.equal(db.state.calls.insert,1);
 assert.equal(db.state.calls.raceLookup,1);
});

test('account change during upload stops before set logs or activity writes',async()=>{
 const saved=completedSnapshot(),db=makeSyncAdapter();
 let checks=0;
 const result=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent:()=>++checks===1});
 assert.equal(result.ok,false);
 assert.equal(result.reason,'account_changed');
 assert.equal(db.state.calls.session,1);
 assert.equal(db.state.calls.logs,0);
 assert.equal(db.state.calls.insert,0);
});

test('in-progress session sync does not create a completion activity',async()=>{
 const saved=completedSnapshot(),db=makeSyncAdapter();
 saved.session.status='in_progress';saved.session.finished_at=null;
 const result=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent:()=>true});
 assert.equal(result.ok,true);
 assert.equal(result.completed,false);
 assert.equal(db.state.sessions.size,1);
 assert.equal(db.state.logs.size,1);
 assert.equal(db.state.activities.size,0);
});


test('two independent tabs racing to sync one completed session create only one activity',async()=>{
 const saved=completedSnapshot();
 const state={sessions:new Map(),logs:new Map(),activities:new Map()};
 let lookupCount=0,releaseLookups;
 const lookupBarrier=new Promise(resolve=>{releaseLookups=resolve});
 let insertCalls=0,duplicateInsertCalls=0;
 const db={
  async upsertSession(payload){state.sessions.set(payload.id,{...state.sessions.get(payload.id),...payload});return {error:null}},
  async upsertSetLogs(rows){for(const row of rows)state.logs.set(row.exercise_id+':'+row.set_number,row);return {error:null}},
  async completeSession(payload){state.sessions.set(payload.id,{...state.sessions.get(payload.id),...payload});return {error:null}},
  async findActivityByMarker(userId,notes){
   lookupCount++;if(lookupCount===2)releaseLookups();await lookupBarrier;
   const found=[...state.activities.values()].find(x=>x.user_id===userId&&x.notes===notes);
   return {data:found?{id:found.id}:null,error:null};
  },
  async insertActivity(payload){
   insertCalls++;
   if(state.activities.has(payload.id)){duplicateInsertCalls++;return {data:null,error:new Error('duplicate key')}}
   state.activities.set(payload.id,payload);return {data:{id:payload.id},error:null};
  },
  async findActivityByIdAndMarker(id,userId,notes){
   const found=state.activities.get(id);
   return {data:found&&found.user_id===userId&&found.notes===notes?{id:found.id}:null,error:null};
  }
 };
 // Separate coordinators represent separate tabs when Web Locks are unavailable.
 const tabA=sync.createSyncCoordinator(),tabB=sync.createSyncCoordinator();
 const run=coordinator=>coordinator.run('athlete-a',()=>sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent:()=>true}));
 const [a,b]=await Promise.all([run(tabA),run(tabB)]);
 assert.equal(a.ok,true);
 assert.equal(b.ok,true);
 assert.equal(state.sessions.size,1);
 assert.equal(state.logs.size,1);
 assert.equal(state.activities.size,1);
 assert.equal(insertCalls,2);
 assert.equal(duplicateInsertCalls,1);
});


test('workout step guard only accepts the exact active plan item',()=>{
 const first={exerciseIndex:0,setIndex:0},second={exerciseIndex:0,setIndex:1},plan=[first,second];
 assert.equal(sync.isCurrentWorkoutStep(plan,0,first),true);
 assert.equal(sync.isCurrentWorkoutStep(plan,1,first),false);
 assert.equal(sync.isCurrentWorkoutStep(plan,0,{...first}),false);
 assert.equal(sync.isCurrentWorkoutStep(plan,-1,first),false);
 assert.equal(sync.isCurrentWorkoutStep(null,0,first),false);
});

test('rest transition callback advances at most once, even if timer and tap race',()=>{
 let advances=0;
 const advance=sync.createOnce(()=>{advances++;return 'advanced'});
 assert.equal(advance(),'advanced');
 assert.equal(advance(),false);
 assert.equal(advances,1);
});

test('rest transition can be safely ignored when its owning session is no longer active',()=>{
 let activeSession='session-a',advances=0;
 const advance=sync.createOnce(()=>activeSession==='session-a'?(advances++,'advanced'):false);
 activeSession='session-b';
 assert.equal(advance(),false);
 assert.equal(advance(),false);
 assert.equal(advances,0);
});


test('legacy set-log payloads default RPE and RIR to null',()=>{
 const [row]=sync.buildSetLogPayloads('s1',[{exercise_id:'e1',set_number:1,reps_completed:10,load_kg:20}]);
 assert.equal(row.rpe,null);
 assert.equal(row.rir,null);
});

test('account change during activity marker lookup stops before creating an activity',async()=>{
 const saved=completedSnapshot(),db=makeSyncAdapter();
 let activeUser='athlete-a';
 db.findActivityByMarker=async()=>{activeUser='athlete-b';return {data:null,error:null}};
 const result=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db,isCurrent:()=>activeUser==='athlete-a'});
 assert.equal(result.ok,false);
 assert.equal(result.reason,'account_changed');
 assert.equal(db.state.calls.session,1);
 assert.equal(db.state.calls.logs,1);
 assert.equal(db.state.calls.complete,1);
 assert.equal(db.state.calls.lookup,0);
 assert.equal(db.state.calls.insert,0);
});

test('session completion and activity lookup failures never create a partial activity',async()=>{
 const saved=completedSnapshot();
 const completionDb=makeSyncAdapter();
 completionDb.completeSession=async()=>({error:new Error('completion failed')});
 const completion=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db:completionDb,isCurrent:()=>true});
 assert.equal(completion.ok,false);
 assert.equal(completion.reason,'session_complete');
 assert.equal(completionDb.state.calls.lookup,0);
 assert.equal(completionDb.state.calls.insert,0);

 const lookupDb=makeSyncAdapter();
 lookupDb.findActivityByMarker=async()=>({data:null,error:new Error('lookup failed')});
 const lookup=await sync.syncWorkoutSnapshot({saved,userId:'athlete-a',db:lookupDb,isCurrent:()=>true});
 assert.equal(lookup.ok,false);
 assert.equal(lookup.reason,'activity_lookup');
 assert.equal(lookupDb.state.calls.complete,1);
 assert.equal(lookupDb.state.calls.insert,0);
});
