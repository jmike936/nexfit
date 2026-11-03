/* NEXFIT Strength Training module */
(()=>{
const css=`
#strengthPage .panel{background:linear-gradient(145deg,#202b37,#18212b);border:1px solid #2b3948;border-radius:18px;padding:18px;margin:14px 0}
#strengthPage input,#strengthPage select,#strengthPage textarea{background:#111922;border:1px solid #354454;color:#f4f7fa;border-radius:10px;padding:11px;width:100%;min-width:0}
#strengthPage label{display:block;color:#91a0af;font-size:12px;margin:9px 0 5px}
#strengthPage .rowf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
#strengthPage .btn{border:0;border-radius:10px;padding:11px 14px;background:#b7f34a;color:#17200b;font-weight:800;margin:8px 6px 0 0}
#strengthPage .btn.alt{background:transparent;color:#f4f7fa;border:1px solid #354454}
#strengthPage .muted{color:#91a0af;font-size:13px}
#strengthPage .exercise{border-top:1px solid #354454;padding:13px 0}
#strengthPage .progress{height:8px;background:#354454;border-radius:10px;overflow:hidden}.progress>i{display:block;height:100%;background:#b7f34a}
#strengthPage img.demo{width:100%;max-height:240px;object-fit:contain;background:#111922;border-radius:12px}
#strengthPage .timer{font-size:42px;font-weight:900;color:#b7f34a;text-align:center;padding:14px}
@media(max-width:600px){#strengthPage .rowf{grid-template-columns:1fr}}
`;
const style=document.createElement('style');style.textContent=css;document.head.append(style);
const nav=document.querySelector('.nav');
const tab=document.createElement('button');tab.dataset.page='strengthPage';tab.textContent='Musculação';nav.append(tab);
const section=document.createElement('section');section.className='page';section.id='strengthPage';
document.querySelector('.app').append(section);
tab.addEventListener('click',()=>{document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section));loadPlans()});
let plans=[],activePlan=null,exerciseList=[],sessionId=null,step=0,seriesIndex=0,timerHandle=null;
const el=(tag,attrs={},html='')=>{const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));n.innerHTML=html;return n};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formField=(id,label,type='text',placeholder='')=>`<label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}">`;
function renderHome(){
section.innerHTML=`<div class="sectionhead"><div><div class="eyebrow">TREINAMENTO DE FORÇA</div><h2>Minhas fichas de musculação</h2></div><button class="primary" id="newPlan">＋ Criar ficha</button></div>
<div class="panel"><h3>Importar ficha</h3><p class="muted">CSV separado por ponto e vírgula: Aluno;Treino;Exercício;Descanso;Tipo de série;Carga (opcional). Para cargas diferentes por série, use por exemplo 12@20|10@24|8@28|6@30.</p><input type="file" id="csvFile" accept=".csv,.txt"><button class="btn" id="importCsv">Validar e importar CSV</button><div id="importStatus" class="muted"></div></div><div id="planList" class="panel">Carregando fichas...</div>`;
$('newPlan').onclick=showCreatePlan;$('importCsv').onclick=importCsv;
}
function showCreatePlan(){
const p=el('div',{class:'panel'},`<h3>Nova ficha de treino</h3><div class="rowf"><div>${formField('planAthlete','Aluno/Atleta','text',currentUser?.email||'Nome do atleta')}</div><div>${formField('planName','Nome do treino','text','Treino B')}</div></div><button class="btn" id="savePlan">Criar ficha</button><button class="btn alt" id="cancelPlan">Cancelar</button>`);
section.prepend(p);$('cancelPlan').onclick=()=>p.remove();$('savePlan').onclick=async()=>{const athlete=$('planAthlete').value.trim(),name=$('planName').value.trim();if(!athlete||!name)return alert('Preencha aluno e treino.');const {data,error}=await db.from('workout_plans').insert({owner_id:currentUser.id,athlete_name:athlete,name}).select().single();if(error)return alert(error.message);await loadPlans();openPlan(data.id)};
}
async function loadPlans(){
if(!db||!currentUser)return;renderHome();const {data,error}=await db.from('workout_plans').select('*').order('created_at',{ascending:false});if(error){$('planList').textContent='Execute primeiro o arquivo supabase-musculacao.sql no SQL Editor do Supabase. Detalhe: '+error.message;return}
plans=data||[];$('planList').innerHTML=plans.length?plans.map(p=>`<div class="exercise"><strong>${safe(p.name)}</strong><div class="muted">${safe(p.athlete_name)}</div><button class="btn" data-open="${p.id}">Abrir ficha</button></div>`).join(''):'<p class="muted">Nenhuma ficha cadastrada. Crie uma ou importe um CSV.</p>';
section.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openPlan(b.dataset.open));
}
async function openPlan(id){
const p=plans.find(x=>x.id===id);if(!p)return;activePlan=p;
const {data,error}=await db.from('workout_exercises').select('*').eq('plan_id',id).order('position');if(error)return alert(error.message);exerciseList=data||[];
section.innerHTML=`<button class="btn alt" id="backPlans">← Minhas fichas</button><div class="panel"><div class="eyebrow">${safe(p.athlete_name)}</div><h2>${safe(p.name)}</h2><h3>Adicionar exercício</h3><div class="rowf"><div>${formField('exName','Exercício','text','SUPINO INCLINADO BARRA')}</div><div>${formField('exRest','Descanso (segundos)','number','120')}</div></div><div class="rowf"><div><label for="exPrescription">Tipo de série / repetições</label><input id="exPrescription" placeholder="12 10 8 6 ou 3x MR"></div><div>${formField('exLoads','Cargas por série (opcional)','text','20,24,28,30')}</div></div><label for="exGif">URL do GIF demonstrativo (opcional)</label><input id="exGif" placeholder="https://...gif"><button class="btn" id="addExercise">Adicionar exercício</button></div><div class="panel"><h3>Ordem do treino</h3><div id="exerciseList"></div><button class="btn" id="startWorkout" ${exerciseList.length?'':'disabled'}>Iniciar treino guiado</button></div>`;
$('backPlans').onclick=loadPlans;$('addExercise').onclick=addExercise;$('startWorkout').onclick=startWorkout;renderExercises();
}
function parsePrescription(raw,loads){
const nums=(raw.match(/\d+/g)||[]).map(Number);const mr=/mr|máximo/i.test(raw);const loadVals=(loads||'').split(/[,|]/).map(x=>x.trim()).filter(Boolean).map(Number);
if(mr){const n=nums[0]||3;return Array.from({length:n},()=>({type:'MR',reps:null,load:null}))}
return nums.map((reps,i)=>({type:'reps',reps,load:Number.isFinite(loadVals[i])?loadVals[i]:null}));
}
async function addExercise(){
const name=$('exName').value.trim(),rest=Number($('exRest').value||60),pres=$('exPrescription').value.trim();if(!name||!pres)return alert('Informe exercício e tipo de série.');const sets=parsePrescription(pres,$('exLoads').value);if(!sets.length)return alert('Não consegui interpretar as séries.');const {error}=await db.from('workout_exercises').insert({plan_id:activePlan.id,position:exerciseList.length+1,name,rest_seconds:rest,prescription:pres,prescribed_sets:sets,media_url:$('exGif').value.trim()||null});if(error)return alert(error.message);openPlan(activePlan.id)
}
function renderExercises(){const root=$('exerciseList');root.innerHTML=exerciseList.length?exerciseList.map((e,i)=>`<div class="exercise"><strong>${i+1}. ${safe(e.name)}</strong><div class="muted">${safe(e.prescription)} · descanso ${e.rest_seconds}s</div></div>`).join(''):'<p class="muted">Adicione o primeiro exercício para montar a ficha.</p>'}
async function importCsv(){
const file=$('csvFile').files[0];if(!file)return alert('Selecione um CSV.');const text=await file.text();const lines=text.split(/\r?\n/).filter(x=>x.trim());const rows=lines.map(line=>line.split(';').map(x=>x.trim()));const head=rows[0].map(x=>x.toLowerCase());const hasHeader=head.some(x=>x.includes('aluno'));const data=hasHeader?rows.slice(1):rows;const status=$('importStatus');let created=0,errors=[];
for(let i=0;i<data.length;i++){const r=data[i];if(r.length<5){errors.push('Linha '+(i+1)+': são necessárias pelo menos 5 colunas.');continue}const [athlete,name,exercise,rest,pres,loads='']=r;if(!athlete||!name||!exercise||!pres){errors.push('Linha '+(i+1)+': campos obrigatórios ausentes.');continue}
let plan=plans.find(p=>p.name.toLowerCase()===name.toLowerCase()&&p.athlete_name.toLowerCase()===athlete.toLowerCase());
if(!plan){const q=await db.from('workout_plans').insert({owner_id:currentUser.id,athlete_name:athlete,name}).select().single();if(q.error){errors.push('Linha '+(i+1)+': '+q.error.message);continue}plan=q.data;plans.push(plan)}
const sets=parsePrescription(pres,loads);const q=await db.from('workout_exercises').insert({plan_id:plan.id,position:(await db.from('workout_exercises').select('id',{count:'exact',head:true}).eq('plan_id',plan.id)).count||0+1,name,rest_seconds:Number(rest)||60,prescription:pres,prescribed_sets:sets});
if(q.error)errors.push('Linha '+(i+1)+': '+q.error.message);else created++;
}
status.textContent=created+' exercício(s) importado(s). '+(errors.length?errors.join(' '):'Sem erros.');await loadPlans();
}
async function startWorkout(){
if(!exerciseList.length)return;const {data,error}=await db.from('workout_sessions').insert({plan_id:activePlan.id,user_id:currentUser.id}).select().single();if(error)return alert(error.message);sessionId=data.id;step=0;seriesIndex=0;showRunner()
}
function showRunner(){
const ex=exerciseList[step],sets=ex.prescribed_sets||[];const donePct=Math.round((exerciseList.slice(0,step).reduce((s,e)=>s+(e.prescribed_sets||[]).length,0)+seriesIndex)/(exerciseList.reduce((s,e)=>s+(e.prescribed_sets||[]).length,0)||1)*100);
section.innerHTML=`<div class="panel"><div class="sectionhead"><strong>${safe(activePlan.name)}</strong><span class="muted">Exercício ${step+1}/${exerciseList.length}</span></div><div class="progress"><i style="width:${donePct}%"></i></div><h2 style="margin-top:18px">${safe(ex.name)}</h2>${ex.media_url?`<img class="demo" src="${safe(ex.media_url)}" alt="Demonstração de ${safe(ex.name)}">`:'<p class="muted">GIF demonstrativo ainda não cadastrado para este exercício.</p>'}<h3>Série ${seriesIndex+1} de ${sets.length}</h3><p class="muted">Prescrição: ${safe(ex.prescription)} · descanso ${ex.rest_seconds}s</p><div class="rowf"><div>${formField('actualReps','Repetições realizadas','number',sets[seriesIndex]?.type==='MR'?'Máximo realizado':String(sets[seriesIndex]?.reps??''))}</div><div>${formField('actualLoad','Carga utilizada (kg)','number',sets[seriesIndex]?.load??'')}</div></div><button class="btn" id="completeSet">Concluir série e descansar</button><button class="btn alt" id="quitWorkout">Encerrar treino</button></div><div id="restPanel"></div>`;
$('completeSet').onclick=completeSet;$('quitWorkout').onclick=()=>finishWorkout('abandoned');
}
async function completeSet(){
const ex=exerciseList[step],reps=Number($('actualReps').value),load=$('actualLoad').value===''?null:Number($('actualLoad').value);if(!Number.isFinite(reps)||reps<0)return alert('Informe as repetições realizadas.');const {error}=await db.from('workout_set_logs').insert({session_id:sessionId,workout_exercise_id:ex.id,set_number:seriesIndex+1,reps_completed:reps,load_kg:load});if(error)return alert(error.message);
seriesIndex++;if(seriesIndex>=(ex.prescribed_sets||[]).length){step++;seriesIndex=0;if(step>=exerciseList.length)return finishWorkout('completed')}
let seconds=ex.rest_seconds;const panel=$('restPanel');panel.innerHTML=`<div class="panel"><div class="muted" style="text-align:center">DESCANSO</div><div class="timer" id="restClock">${formatTime(seconds)}</div><button class="btn" id="skipRest">Pular descanso</button></div>`;const next=()=>{if(timerHandle)clearInterval(timerHandle);showRunner()};$('skipRest').onclick=next;timerHandle=setInterval(()=>{seconds--;const clock=$('restClock');if(clock)clock.textContent=formatTime(Math.max(0,seconds));if(seconds<=0)next()},1000)
}
function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
async function finishWorkout(status){if(timerHandle)clearInterval(timerHandle);await db.from('workout_sessions').update({status,finished_at:new Date().toISOString()}).eq('id',sessionId);const completed=await db.from('workout_set_logs').select('id',{count:'exact',head:true}).eq('session_id',sessionId);const total=exerciseList.reduce((s,e)=>s+(e.prescribed_sets||[]).length,0);section.innerHTML=`<div class="panel"><div class="eyebrow">SESSÃO ${status==='completed'?'CONCLUÍDA':'ENCERRADA'}</div><h2>${status==='completed'?'Treino finalizado!':'Treino interrompido'}</h2><div style="font-size:42px;color:#b7f34a;font-weight:900">${Math.round((completed.count||0)/(total||1)*100)}%</div><p class="muted">${completed.count||0} de ${total} séries registradas.</p><button class="btn" id="backToPlan">Voltar às fichas</button></div>`;$('backToPlan').onclick=loadPlans}
window.addEventListener('beforeunload',()=>{if(timerHandle)clearInterval(timerHandle)});
})();
