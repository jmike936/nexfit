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
  {exercise_id:'e2',set_number:2,reps_completed:0,load_kg:null,duration_seconds:35,notes:'skip'}
 ],'2026-11-23T10:05:00Z');
 assert.equal(rows.length,2);
 assert.equal(rows[0].session_id,'s1');
 assert.equal(rows[0].load_kg,50);
 assert.equal(rows[0].completed_at,'2026-11-23T10:05:00Z');
 assert.equal(rows[1].load_kg,null);
 assert.equal(rows[1].duration_seconds,35);
 assert.equal(rows[1].notes,'skip');
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
