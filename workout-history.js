(()=>{if(window.__nexfitWorkoutHistory)return;window.__nexfitWorkoutHistory=true;
const normalizeHumanText=s=>{const text=String(s??'').normalize('NFC').replace(/\s+/gu,' ').trim();if(!text)return '';const acronyms=new Set(['NEXFIT','HIIT','AMRAP','BCAA','TRX','MR','RM','PR','PB','ABC']);let first=true;return text.toLocaleLowerCase('pt-BR').replace(/[\p{L}\p{M}]+/gu,word=>{const upper=word.toLocaleUpperCase('pt-BR');if(acronyms.has(upper))return upper;if(first){first=false;return word.charAt(0).toLocaleUpperCase('pt-BR')+word.slice(1)}return word})};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const client=()=>window.db||db,user=()=>window.currentUser||currentUser;
async function notify(message,title='Não foi possível salvar as alterações',danger=true){const dialog=window.nexfitShowWorkoutDialog;if(typeof dialog==='function')return dialog({title,message,confirmLabel:'Entendi',danger});console.error('[NEXFIT] Diálogo de treino indisponível:',message);return false}
let activeActivity=null,activeSession=null,activeEntries=[],showGeneration=0;
function activityDateLabel(value){const raw=String(value||'');const m=raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?m[3]+'/'+m[2]+'/'+m[1]:'—'}
function saoPauloDateKey(value){if(!value)return '';if(/^\d{4}-\d{2}-\d{2}$/.test(value))return value;const d=new Date(value);if(Number.isNaN(d.getTime()))return '';const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);const get=k=>parts.find(x=>x.type===k)?.value||'';return get('year')+'-'+get('month')+'-'+get('day')}
function modal(){let m=document.getElementById('workoutHistoryModal');if(m)return m;m=document.createElement('div');m.id='workoutHistoryModal';m.style.cssText='position:fixed;inset:0;z-index:40;background:#05080ddd;display:none;align-items:center;justify-content:center;padding:16px';m.innerHTML='<div style="width:min(760px,100%);max-height:90vh;overflow:auto;background:#1a232e;border:1px solid #354454;border-radius:18px;padding:20px"><header style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><div style="color:#b7f34a;font-size:11px;letter-spacing:2px">HISTÓRICO DE MUSCULAÇÃO</div><h2 id="whTitle"></h2></div><button class="secondary" id="whClose">Fechar</button></header><div id="whBody"></div><footer style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px"><button class="secondary wh-icon-action" id="whEdit" title="Editar séries" aria-label="Editar séries"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button><button class="primary" id="whSave" style="display:none">Salvar alterações</button></footer></div>';document.body.append(m);m.onclick=e=>{if(e.target===m){showGeneration++;m.style.display='none'}};m.querySelector('#whClose').onclick=()=>{showGeneration++;m.style.display='none'};const iconStyle=document.createElement('style');iconStyle.textContent='.wh-icon-action{width:42px;height:42px;padding:10px;display:grid;place-items:center}.wh-icon-action svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}';document.head.append(iconStyle);return m}
async function findSession(activity,expectedUserId,expectedDb,isCurrent){
 const dbx=expectedDb,tag=(activity.notes||'').match(/\[NEXFIT_SESSION:([a-f0-9-]+)\]/i);
 if(!dbx||!expectedUserId||!isCurrent())return null;
 if(tag){
  const direct=await dbx.from('training_sessions').select('id,athlete_id,program_id,subworkout_id,started_at,finished_at').eq('id',tag[1]).eq('athlete_id',expectedUserId).maybeSingle();
  if(!isCurrent())return null;
  if(direct.data?.athlete_id===expectedUserId)return direct.data;
 }
 const q=await dbx.from('training_sessions').select('id,athlete_id,program_id,subworkout_id,started_at,finished_at').eq('athlete_id',expectedUserId).eq('status','completed').order('started_at',{ascending:false}).limit(300);
 if(!isCurrent()||q.error||!q.data?.length)return null;
 const sessions=q.data,programIds=[...new Set(sessions.map(x=>x.program_id).filter(Boolean))],subIds=[...new Set(sessions.map(x=>x.subworkout_id).filter(Boolean))];
 const [programs,subs]=await Promise.all([
  programIds.length?dbx.from('training_programs').select('id,title').in('id',programIds):Promise.resolve({data:[],error:null}),
  subIds.length?dbx.from('training_subworkouts').select('id,title').in('id',subIds):Promise.resolve({data:[],error:null})
 ]);
 if(!isCurrent())return null;
 const pMap=new Map((programs.data||[]).map(x=>[x.id,x.title])),sMap=new Map((subs.data||[]).map(x=>[x.id,x.title]));
 const note=(activity.notes||'').replace(/\s*\[NEXFIT_SESSION:[^\]]+\]/,'').toLocaleLowerCase('pt-BR');
 const sameDay=sessions.filter(x=>saoPauloDateKey(x.started_at)===activity.date);
 const candidates=sessions.map(x=>{
  const p=pMap.get(x.program_id)||'',sub=sMap.get(x.subworkout_id)||'';
  const namesMatch=!!p&&!!sub&&note.includes(p.toLocaleLowerCase('pt-BR'))&&note.includes(sub.toLocaleLowerCase('pt-BR'));
  const day=saoPauloDateKey(x.started_at),elapsed=x.finished_at&&x.started_at?Math.max(1,Math.round((Date.parse(x.finished_at)-Date.parse(x.started_at))/60000)):0;
  const score=(day===activity.date?0:10000)+Math.abs(elapsed-Number(activity.duration||0));
  return {session:x,namesMatch,score};
 });
 const named=candidates.filter(x=>x.namesMatch).sort((a,b)=>a.score-b.score);
 if(named.length)return named[0].session;
 const dated=candidates.filter(x=>sameDay.some(s=>s.id===x.session.id)).sort((a,b)=>a.score-b.score);
 return dated[0]?.session||null;
}
async function show(id,editing=false){
 const userId=user()?.id,dbx=client(),activity=(typeof activities!=='undefined'?activities:[]).find(x=>String(x.id)===String(id)),generation=++showGeneration;
 const isCurrent=()=>!!userId&&!!dbx&&user()?.id===userId&&showGeneration===generation;
 if(!isCurrent()||!activity)return;
 activeActivity=activity;activeSession=null;activeEntries=[];
 const m=modal();m.style.display='flex';m.querySelector('#whTitle').textContent='Carregando…';m.querySelector('#whBody').textContent='Buscando séries e cargas.';m.querySelector('#whEdit').style.display='none';m.querySelector('#whSave').style.display='none';
 const session=await findSession(activity,userId,dbx,isCurrent);
 if(!isCurrent())return;
 activeSession=session;
 if(!session){m.querySelector('#whTitle').textContent='Detalhes do treino';m.querySelector('#whBody').innerHTML='<p>Não encontrei uma sessão vinculada a esta atividade.</p>';return}
 const [p,s,ex,logs]=await Promise.all([
  dbx.from('training_programs').select('title').eq('id',session.program_id),
  dbx.from('training_subworkouts').select('title').eq('id',session.subworkout_id),
  dbx.from('training_exercises').select('id,name,sets,rest_seconds,position').eq('subworkout_id',session.subworkout_id).order('position'),
  dbx.from('training_set_logs').select('exercise_id,set_number,reps_completed,load_kg,duration_seconds,rpe,rir').eq('session_id',session.id)
 ]);
 if(!isCurrent())return;
 if(ex.error||logs.error){m.querySelector('#whBody').textContent=(ex.error||logs.error).message;return}
 m.querySelector('#whTitle').textContent=(s.data?.[0]?.title||'Treino')+' · '+(p.data?.[0]?.title||'Programa');
 const logBySet=new Map((logs.data||[]).map(log=>[String(log.exercise_id)+'_'+Number(log.set_number),log]));
 const entries=[];const groups=(ex.data||[]).map(e=>{const rows=(e.sets||[]).map((plan,i)=>{const no=i+1,log=logBySet.get(String(e.id)+'_'+no)||null,key=e.id+'_'+no,entry={exercise:e,plan,index:i,log,key};entries.push(entry);
 const timed=plan.mode&&plan.mode!=='reps';
 if(editing)return '<div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center;padding:10px 0;border-top:1px solid #354454"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-wh-done="'+key+'" '+(log?'checked':'')+'> Executada</label>'+(timed?'<input type="number" min="1" max="86400" data-wh-duration="'+key+'" value="'+(log?.duration_seconds??'')+'" placeholder="Tempo realizado (segundos)">':'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input type="number" min="1" data-wh-reps="'+key+'" value="'+(log?.reps_completed??'')+'" placeholder="Repetições"><input type="number" min="0" step="0.25" data-wh-load="'+key+'" value="'+(log?.load_kg??'')+'" placeholder="Carga kg"></div>')+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;grid-column:1/-1"><select data-wh-effort-type="'+key+'"><option value="none" '+(!log?.rpe&&!log?.rir?'selected':'')+'>Sem RPE/RIR</option><option value="rpe" '+(log?.rpe!=null?'selected':'')+'>RPE</option><option value="rir" '+(log?.rir!=null?'selected':'')+'>RIR</option></select><input type="number" min="0" max="10" step="0.5" data-wh-effort-value="'+key+'" value="'+(log?.rpe??log?.rir??'')+'" placeholder="Valor 0–10"></div>'+'<small style="grid-column:1/-1;color:#91a0af">Série '+no+' · previsto '+(timed?(plan.mode==='countdown'?Math.floor((plan.target_seconds||0)/60)+':'+String((plan.target_seconds||0)%60).padStart(2,'0')+' alvo':'Cronômetro livre'):(plan.reps==='MR'?'MR':plan.reps+' reps')+(plan.load_kg!=null?' · '+plan.load_kg+' kg':''))+'</small></div>';
 if(!editing)return '<tr><td><strong>'+esc(normalizeHumanText(e.name))+'</strong><small style="display:block;color:#91a0af">Série '+no+' · '+(log?'Executada':'Não executada')+(log?.rpe!=null?' · RPE '+log.rpe:log?.rir!=null?' · RIR '+log.rir:'')+'</small></td><td>'+(log?(timed?((Math.floor((Number(log.duration_seconds)||0)/60))+':'+String((Number(log.duration_seconds)||0)%60).padStart(2,'0')):(log.reps_completed??'—')):'—')+'</td><td>'+(log&&!timed&&log.load_kg!=null?Number(log.load_kg).toLocaleString('pt-BR')+' kg':'—')+'</td></tr>';return '<div style="padding:10px 0;border-top:1px solid #354454"><strong>Série '+no+'</strong> · '+(log?'<span style="color:#b7f34a">Executada</span>':'<span style="color:#91a0af">Não executada</span>')+'<div style="color:#91a0af">Previsto: '+(timed?(plan.mode==='countdown'?plan.target_seconds+' s':'Cronômetro livre'):(plan.reps==='MR'?'MR':plan.reps+' reps')+(plan.load_kg!=null?' · '+plan.load_kg+' kg':''))+' · descanso '+(e.rest_seconds||0)+' s</div>'+(log?'<div>Realizado: '+(timed?((Math.floor((Number(log.duration_seconds)||0)/60))+':'+String((Number(log.duration_seconds)||0)%60).padStart(2,'0')):(log.reps_completed??'—')+' reps'+(log.load_kg!=null?' · '+log.load_kg+' kg':''))+(log.rpe!=null?' · RPE '+log.rpe:log.rir!=null?' · RIR '+log.rir:'')+'</div>':'')+'</div>'}).join('');return '<section style="margin:14px 0;padding:14px;background:#202b37;border:1px solid #354454;border-radius:12px"><h3>'+esc(normalizeHumanText(e.name))+'</h3>'+(editing?rows:'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px"><thead><tr><th style="padding:9px 6px;color:#b7f34a">Exercício</th><th style="padding:9px 6px;color:#b7f34a">Repetições</th><th style="padding:9px 6px;color:#b7f34a">Carga</th></tr></thead><tbody>'+rows+'</tbody></table></div>')+'</section>'}).join('');
 activeEntries=entries;
 m.querySelector('#whBody').innerHTML='<p style="color:#91a0af">'+esc(activityDateLabel(activity.date))+' · '+activity.duration+' min</p>'+groups;
 m.querySelector('#whEdit').style.display=editing?'none':'inline-block';m.querySelector('#whSave').style.display=editing?'inline-block':'none';m.querySelector('#whEdit').onclick=()=>{if(isCurrent())show(id,true)};
 const saveButton=m.querySelector('#whSave');
 saveButton.onclick=async()=>{
  if(!isCurrent()||activeActivity?.id!==activity.id||activeSession?.id!==session.id||saveButton.disabled)return;
  saveButton.disabled=true;
  try{
   for(const x of entries){
    if(!isCurrent()||activeSession?.id!==session.id)return;
    const done=m.querySelector('[data-wh-done="'+x.key+'"]')?.checked;
    if(done===undefined){await notify('O formulário de edição não está mais disponível.');return}
    if(done){
     const timed=x.plan.mode&&x.plan.mode!=='reps';let vals;
     const effortType=m.querySelector('[data-wh-effort-type="'+x.key+'"]').value,effortRaw=m.querySelector('[data-wh-effort-value="'+x.key+'"]').value.trim(),effort=effortRaw===''?null:Number(effortRaw);if(effortType!=='none'&&(effort===null||!Number.isFinite(effort)||effort<(effortType==='rir'?0:1)||effort>10||Math.round(effort*2)!==effort*2)){await notify('Informe RPE entre 1 e 10 ou RIR entre 0 e 10, em passos de 0,5.','RPE/RIR inválido',false);return}const effortValues={rpe:effortType==='rpe'?effort:null,rir:effortType==='rir'?effort:null};
     if(timed){const duration=Number(m.querySelector('[data-wh-duration="'+x.key+'"]').value);if(!Number.isInteger(duration)||duration<1||duration>86400){await notify('Informe o tempo realizado entre 1 segundo e 24 horas.','Tempo inválido',false);return}vals={reps_completed:0,load_kg:null,duration_seconds:duration,...effortValues}}
     else{const reps=Number(m.querySelector('[data-wh-reps="'+x.key+'"]').value),raw=m.querySelector('[data-wh-load="'+x.key+'"]').value;if(!Number.isFinite(reps)||reps<1){await notify('Informe as repetições para toda série marcada como executada.','Repetições inválidas',false);return}const load=raw===''?null:Number(raw);if(load!==null&&(!Number.isFinite(load)||load<0)){await notify('Informe uma carga válida.','Carga inválida',false);return}vals={reps_completed:reps,load_kg:load,duration_seconds:null,...effortValues}}
     const result=x.log?await dbx.from('training_set_logs').update(vals).eq('session_id',session.id).eq('exercise_id',x.exercise.id).eq('set_number',x.index+1):await dbx.from('training_set_logs').insert({session_id:session.id,exercise_id:x.exercise.id,set_number:x.index+1,...vals});
     if(!isCurrent())return;
     if(result.error){await notify(result.error.message,'Não foi possível salvar a série');return}
    }else if(x.log){
     const result=await dbx.from('training_set_logs').delete().eq('session_id',session.id).eq('exercise_id',x.exercise.id).eq('set_number',x.index+1);
     if(!isCurrent())return;
     if(result.error){await notify(result.error.message,'Não foi possível salvar a série');return}
    }
   }
   if(isCurrent())await show(id,false);
  }finally{if(isCurrent())saveButton.disabled=false}
 };
}
window.resetWorkoutHistoryUserState=function(){
 showGeneration++;activeActivity=null;activeSession=null;activeEntries=[];
 const m=document.getElementById('workoutHistoryModal');if(m){m.style.display='none';m.querySelector('#whTitle').textContent='';m.querySelector('#whBody').replaceChildren();m.querySelector('#whEdit').style.display='none';m.querySelector('#whSave').style.display='none'}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-view-workout]');if(b){e.preventDefault();show(b.dataset.viewWorkout,false)}});
})();