(()=>{if(window.__nexfitWorkoutHistory)return;window.__nexfitWorkoutHistory=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const client=()=>window.db||db,user=()=>window.currentUser||currentUser;
let activeActivity=null,activeSession=null,activeEntries=[];
function modal(){let m=document.getElementById('workoutHistoryModal');if(m)return m;m=document.createElement('div');m.id='workoutHistoryModal';m.style.cssText='position:fixed;inset:0;z-index:40;background:#05080ddd;display:none;align-items:center;justify-content:center;padding:16px';m.innerHTML='<div style="width:min(760px,100%);max-height:90vh;overflow:auto;background:#1a232e;border:1px solid #354454;border-radius:18px;padding:20px"><header style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><div style="color:#b7f34a;font-size:11px;letter-spacing:2px">HISTÓRICO DE MUSCULAÇÃO</div><h2 id="whTitle"></h2></div><button class="secondary" id="whClose">Fechar</button></header><div id="whBody"></div><footer style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px"><button class="secondary" id="whEdit">Editar séries</button><button class="primary" id="whSave" style="display:none">Salvar alterações</button></footer></div>';document.body.append(m);m.onclick=e=>{if(e.target===m)m.style.display='none'};m.querySelector('#whClose').onclick=()=>m.style.display='none';return m}
async function findSession(activity){
 const dbx=client(),u=user(),tag=(activity.notes||'').match(/\[NEXFIT_SESSION:([a-f0-9-]+)\]/i);
 if(tag){const direct=await dbx.from('training_sessions').select('*').eq('id',tag[1]).maybeSingle();if(direct.data)return direct.data}
 const q=await dbx.from('training_sessions').select('*').eq('athlete_id',u.id).eq('status','completed').order('started_at',{ascending:false}).limit(300);
 if(q.error||!q.data?.length)return null;
 const sessions=q.data,programIds=[...new Set(sessions.map(x=>x.program_id).filter(Boolean))],subIds=[...new Set(sessions.map(x=>x.subworkout_id).filter(Boolean))];
 const [programs,subs]=await Promise.all([
  dbx.from('training_programs').select('id,title').in('id',programIds),
  dbx.from('training_subworkouts').select('id,title').in('id',subIds)
 ]);
 const pMap=new Map((programs.data||[]).map(x=>[x.id,x.title])),sMap=new Map((subs.data||[]).map(x=>[x.id,x.title]));
 const note=(activity.notes||'').replace(/\s*\[NEXFIT_SESSION:[^\]]+\]/,'').toLocaleLowerCase('pt-BR');
 const sameDay=sessions.filter(x=>(x.started_at||'').slice(0,10)===activity.date);
 const candidates=sessions.map(x=>{
  const p=pMap.get(x.program_id)||'',sub=sMap.get(x.subworkout_id)||'';
  const namesMatch=!!p&&!!sub&&note.includes(p.toLocaleLowerCase('pt-BR'))&&note.includes(sub.toLocaleLowerCase('pt-BR'));
  const day=(x.started_at||'').slice(0,10),elapsed=x.finished_at&&x.started_at?Math.max(1,Math.round((Date.parse(x.finished_at)-Date.parse(x.started_at))/60000)):0;
  const score=(day===activity.date?0:10000)+Math.abs(elapsed-Number(activity.duration||0));
  return {session:x,namesMatch,score};
 });
 const named=candidates.filter(x=>x.namesMatch).sort((a,b)=>a.score-b.score);
 if(named.length)return named[0].session;
 const dated=candidates.filter(x=>sameDay.some(s=>s.id===x.session.id)).sort((a,b)=>a.score-b.score);
 return dated[0]?.session||null;
}
async function show(id,editing=false){activeActivity=(typeof activities!=='undefined'?activities:[]).find(x=>String(x.id)===String(id));if(!activeActivity)return;const m=modal(),dbx=client();m.style.display='flex';m.querySelector('#whTitle').textContent='Carregando…';m.querySelector('#whBody').textContent='Buscando séries e cargas.';m.querySelector('#whEdit').style.display='none';m.querySelector('#whSave').style.display='none';
activeSession=await findSession(activeActivity);if(!activeSession){m.querySelector('#whTitle').textContent='Detalhes do treino';m.querySelector('#whBody').innerHTML='<p>Não encontrei uma sessão vinculada a esta atividade.</p>';return}
const [p,s,ex,logs]=await Promise.all([dbx.from('training_programs').select('title').eq('id',activeSession.program_id).maybeSingle(),dbx.from('training_subworkouts').select('title').eq('id',activeSession.subworkout_id).maybeSingle(),dbx.from('training_exercises').select('*').eq('subworkout_id',activeSession.subworkout_id).order('position'),dbx.from('training_set_logs').select('*').eq('session_id',activeSession.id)]);
if(ex.error||logs.error){m.querySelector('#whBody').textContent=(ex.error||logs.error).message;return}m.querySelector('#whTitle').textContent=(s.data?.title||'Treino')+' · '+(p.data?.title||'Programa');
activeEntries=[];const groups=(ex.data||[]).map(e=>{const rows=(e.sets||[]).map((plan,i)=>{const no=i+1,log=(logs.data||[]).find(z=>z.exercise_id===e.id&&Number(z.set_number)===no)||null,key=e.id+'_'+no,entry={exercise:e,plan,index:i,log,key};activeEntries.push(entry);
if(editing)return '<div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:8px;align-items:center;padding:10px 0;border-top:1px solid #354454"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-wh-done="'+key+'" '+(log?'checked':'')+'> Executada</label><input type="number" min="1" data-wh-reps="'+key+'" value="'+(log?.reps_completed??'')+'" placeholder="Repetições"><input type="number" min="0" step="0.25" data-wh-load="'+key+'" value="'+(log?.load_kg??'')+'" placeholder="Carga kg"><small style="grid-column:1/-1;color:#91a0af">Série '+no+' · previsto '+(plan.reps==='MR'?'MR':plan.reps+' reps')+(plan.load_kg!=null?' · '+plan.load_kg+' kg':'')+'</small></div>';
return '<div style="padding:10px 0;border-top:1px solid #354454"><strong>Série '+no+'</strong> · '+(log?'<span style="color:#b7f34a">Executada</span>':'<span style="color:#91a0af">Não executada</span>')+'<div style="color:#91a0af">Previsto: '+(plan.reps==='MR'?'MR':plan.reps+' reps')+(plan.load_kg!=null?' · '+plan.load_kg+' kg':'')+' · descanso '+(e.rest_seconds||0)+' s</div>'+(log?'<div>Realizado: '+(log.reps_completed??'—')+' reps'+(log.load_kg!=null?' · '+log.load_kg+' kg':'')+'</div>':'')+'</div>'}).join('');return '<section style="margin:14px 0;padding:14px;background:#202b37;border:1px solid #354454;border-radius:12px"><h3>'+esc(e.name)+'</h3>'+rows+'</section>'}).join('');
m.querySelector('#whBody').innerHTML='<p style="color:#91a0af">'+esc(activeActivity.date)+' · '+activeActivity.duration+' min</p>'+groups;
m.querySelector('#whEdit').style.display=editing?'none':'inline-block';m.querySelector('#whSave').style.display=editing?'inline-block':'none';m.querySelector('#whEdit').onclick=()=>show(id,true);
m.querySelector('#whSave').onclick=async()=>{for(const x of activeEntries){const done=m.querySelector('[data-wh-done="'+x.key+'"]').checked;if(done){const reps=Number(m.querySelector('[data-wh-reps="'+x.key+'"]').value),raw=m.querySelector('[data-wh-load="'+x.key+'"]').value;if(!Number.isFinite(reps)||reps<1){alert('Informe as repetições para toda série marcada como executada.');return}const load=raw===''?null:Number(raw);if(load!==null&&(!Number.isFinite(load)||load<0)){alert('Informe uma carga válida.');return}const vals={reps_completed:reps,load_kg:load};let result=x.log?await dbx.from('training_set_logs').update(vals).eq('session_id',activeSession.id).eq('exercise_id',x.exercise.id).eq('set_number',x.index+1):await dbx.from('training_set_logs').insert({session_id:activeSession.id,exercise_id:x.exercise.id,set_number:x.index+1,...vals});if(result.error){alert(result.error.message);return}}else if(x.log){const result=await dbx.from('training_set_logs').delete().eq('session_id',activeSession.id).eq('exercise_id',x.exercise.id).eq('set_number',x.index+1);if(result.error){alert(result.error.message);return}}}await show(id,false)}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-view-workout]');if(b){e.preventDefault();show(b.dataset.viewWorkout,false)}});
})();