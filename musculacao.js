/* NEXFIT | Musculação — programas versionados */
(()=>{
 if(window.__nexfitStrengthLoaded)return;window.__nexfitStrengthLoaded=true;
 const css=`
 #strengthPage .panel{background:linear-gradient(145deg,#202b37,#18212b);border:1px solid #2b3948;border-radius:18px;padding:18px;margin:14px 0}
 #strengthPage input,#strengthPage textarea,#strengthPage select{background:#111922;border:1px solid #354454;color:#f4f7fa;border-radius:10px;padding:11px;width:100%;min-width:0}
 #strengthPage label{display:block;color:#91a0af;font-size:12px;margin:9px 0 5px}
 #strengthPage .rowf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 #strengthPage .btn{border:0;border-radius:10px;padding:11px 14px;background:#b7f34a;color:#17200b;font-weight:800;margin:8px 6px 0 0}
 #strengthPage .btn.alt{background:transparent;color:#f4f7fa;border:1px solid #354454}
 #strengthPage .muted{color:#91a0af;font-size:13px}#strengthPage .item{border-top:1px solid #354454;padding:14px 0}
 #strengthPage .tag{font-size:11px;color:#b7f34a;border:1px solid #526b32;border-radius:30px;padding:4px 8px}
 @media(max-width:600px){#strengthPage .rowf{grid-template-columns:1fr}}
 body:has(#strengthPage.active) .top,body:has(#strengthPage.active) .welcome{display:none!important}
 #strengthPage.training-gallery>.sectionhead{display:none}
 #strengthPage .training-tabs{display:flex;gap:0;border-bottom:1px solid #303a30;margin:8px 0 18px}
 #strengthPage .training-tabs button{flex:1;background:transparent;border:0;border-bottom:3px solid transparent;color:#a0a99c;padding:13px 10px;font-weight:700}
 #strengthPage .training-tabs button.active{color:#b7f34a;border-color:#b7f34a}
 #strengthPage .training-toolbar{display:flex;align-items:center;gap:12px;margin:0 0 10px}
 #strengthPage .training-toolbar label{margin:0;white-space:nowrap}
 #strengthPage .training-programs{margin-bottom:14px}
 #strengthPage .training-list{display:grid;gap:12px}
 #strengthPage .training-card{position:relative;background:linear-gradient(145deg,#1d271f,#151b17);border:1px solid #303a30;border-radius:16px;padding:6px 12px}
 #strengthPage .training-card-main{display:flex;align-items:center;gap:13px;width:100%;border:0;background:transparent;color:#f5f7f2;text-align:left;padding:7px 0;cursor:pointer}
 #strengthPage .training-card-main>img,#strengthPage .training-card-placeholder{width:78px;height:78px;flex:0 0 78px;object-fit:cover;border-radius:12px;background:#101410}
 #strengthPage .training-card-placeholder{display:grid;place-items:center;background:radial-gradient(circle at 65% 30%,#39492c,#111610 70%);color:#b7f34a;font-size:25px}
 #strengthPage .training-card-copy{display:grid;gap:4px;min-width:0;flex:1}
 #strengthPage .training-card-copy strong{font-size:17px}
 #strengthPage .training-card-copy span,#strengthPage .training-card-copy small{color:#a0a99c}
 #strengthPage .training-card-copy span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 #strengthPage .training-chevron{font-size:28px;color:#a0a99c}
 #strengthPage .training-card-actions{display:none!important}
 #strengthPage .training-card-actions{display:flex;gap:5px;justify-content:flex-end;border-top:1px solid #303a30;padding:4px 0}
 #strengthPage .training-card .tag{display:inline-block}
 #strengthPage .training-empty{text-align:center;padding:34px 18px;background:#1d271f;border:1px solid #303a30;border-radius:16px}
 #strengthPage .training-empty-icon{font-size:30px;color:#b7f34a}
 #strengthPage .training-empty .btn{margin-top:10px}
 #strengthPage .archived-toggle{margin:8px 0}
 #strengthPage .training-panel-heading{display:flex;justify-content:space-between;align-items:center}
 #strengthPage .training-secondary{margin:14px 0;border:1px solid #303a30;border-radius:12px;padding:12px}
 #strengthPage .training-secondary summary{cursor:pointer;color:#a0a99c;font-weight:700}
 #strengthPage .icon-action{display:inline-grid;place-items:center;width:40px;height:40px;padding:9px;border:1px solid #354454;border-radius:10px;background:transparent;color:#b7f34a}
 #strengthPage .icon-action svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
 #strengthPage .icon-action.danger{color:#ff7a7a}
 #strengthPage .training-row-actions{display:flex;align-items:center;gap:6px}
 #strengthPage .training-program-management{display:grid;gap:10px;padding-top:10px}
 #strengthPage .training-management-row{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;border-top:1px solid #303a30;padding:12px 0}
 #strengthPage .training-management-row>div:first-child{display:grid;gap:3px}
 #strengthPage .training-management-row small{color:#a0a99c}
 #strengthPage .model-program-card{padding:12px}
 #strengthPage .model-program-card .training-card-main{cursor:default}
 #strengthPage .model-workout-preview{display:flex;gap:7px;flex-wrap:wrap;margin:4px 0 8px 90px}
 #strengthPage .model-workout-preview span{font-size:12px;color:#a0a99c;background:#111922;border:1px solid #303a30;border-radius:99px;padding:4px 9px}
 #strengthPage .model-copy-button{width:100%;margin:5px 0 0}
 #strengthPage .training-management-row>div:last-child{display:flex;gap:6px;flex-wrap:wrap}
 #strengthPage .exercise-status-actions{display:inline-flex;align-items:center;gap:7px;margin-left:8px;vertical-align:middle}
 #strengthPage .exercise-status-icon{display:inline-grid;place-items:center;width:40px;height:40px;padding:9px;margin:0;border:1px solid #354454;border-radius:10px;background:transparent;color:#b7f34a;cursor:pointer}
 #strengthPage .exercise-status-icon.skipped{color:#ff7a7a}
 #strengthPage .exercise-status-icon svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
 #strengthPage .exercise-status-icon:focus-visible{outline:2px solid #b7f34a;outline-offset:2px}
 @media(max-width:600px){#strengthPage .training-card-main>img,#strengthPage .training-card-placeholder{width:68px;height:68px;flex-basis:68px}#strengthPage .training-toolbar{display:block}}

 #strengthPage .execution-screen{padding:12px;max-width:760px;margin:0 auto;color:#f4f7fa}
 #strengthPage .execution-header{display:grid;grid-template-columns:42px 1fr 54px;align-items:center;gap:8px;text-align:center;min-height:42px}
 #strengthPage .execution-header strong{font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 #strengthPage .execution-header>span{font-size:13px;color:#a0a99c;text-align:right}
 #strengthPage .execution-back{display:grid;place-items:center;width:40px;height:40px;border:0;background:transparent;color:#f4f7fa;cursor:pointer}
 #strengthPage .execution-back svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
 #strengthPage .execution-progress{height:5px;margin:8px 0 14px;border-radius:99px;background:#303a30;overflow:hidden}
 #strengthPage .execution-progress span{display:block;height:100%;background:#b7f34a;border-radius:inherit;transition:width .2s ease}
 #strengthPage .execution-exercise-heading{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:0 0 10px}
 #strengthPage .execution-exercise-heading h2{margin:0;font-size:22px}
 #strengthPage .execution-exercise-heading p{margin:0;color:#a0a99c;font-size:13px;text-align:right}
 #strengthPage .execution-media{display:block;width:100%;height:clamp(180px,42vw,320px);object-fit:cover;background:#111610;border-radius:14px;margin:0 0 10px}
 #strengthPage .execution-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:8px 0 12px}
 #strengthPage .execution-stat{display:flex;min-width:0;min-height:76px;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 5px;border:1px solid #202821;border-radius:13px;background:linear-gradient(145deg,#171d18,#111511);text-align:center}
 #strengthPage .execution-stat>span,#strengthPage .execution-stat>label{color:#a0a99c;font-size:12px}
 #strengthPage .execution-stat>strong{font-size:23px;line-height:1.1}
 #strengthPage .execution-load-control{display:grid;grid-template-columns:24px minmax(0,1fr) 24px;align-items:center;gap:2px;width:100%}
 #strengthPage .execution-load-control button{padding:0;border:0;background:transparent;color:#b7f34a;font-size:19px;font-weight:800;cursor:pointer}
 #strengthPage .execution-load-control input{min-width:0;width:100%;padding:1px;border:0;background:transparent;color:#f4f7fa;text-align:center;font-size:20px;font-weight:800}
 #strengthPage .execution-load-control input::placeholder{color:#a0a99c;font-size:13px}
 #strengthPage .execution-load-stat small{margin-top:-4px;color:#a0a99c;font-size:10px}
 #strengthPage .execution-reps-label{display:block;margin:8px 0 5px;color:#a0a99c;font-size:12px}
 #strengthPage .execution-reps-input{width:100%;padding:11px;border:1px solid #354454;border-radius:10px;background:#111922;color:#f4f7fa}
 #strengthPage .execution-feedback{margin:10px 0 0;padding:9px 11px;border:1px solid #354454;border-radius:10px;color:#dce8d2;background:#18221a;font-size:12px;line-height:1.4}#strengthPage .execution-feedback[data-state="error"]{border-color:#8b4545;color:#ffb7b7;background:#2a191b}#strengthPage .execution-feedback[data-state="success"]{border-color:#526b32;color:#d5ff7b}
 #strengthPage .execution-actions{display:grid;grid-template-columns:1.35fr 1fr;gap:8px;margin-top:10px}
 #strengthPage .execution-primary,#strengthPage .execution-secondary{min-height:48px;border-radius:13px;padding:11px 14px;font-weight:800;cursor:pointer}
 #strengthPage .execution-primary{border:0;background:#b7f34a;color:#141a0d}
 #strengthPage .execution-secondary{border:1px solid #526b32;background:transparent;color:#b7f34a}
 #strengthPage .execution-skip-exercise{display:block;margin:8px auto 0;border:0;background:transparent;color:#a0a99c;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
 #strengthPage .execution-rest[hidden]{display:none}
 #strengthPage .execution-rest{margin-top:14px;padding:10px 0 4px;text-align:center}
 #strengthPage .execution-rest-heading{margin:4px 0 12px;color:#a0a99c;font-size:12px;font-weight:800;letter-spacing:.14em}
 #strengthPage .execution-rest-row{display:flex;align-items:flex-end;justify-content:center;gap:14px}
 #strengthPage .execution-rest-dial{display:grid;place-items:center;width:158px;height:158px;padding:8px;border-radius:50%;background:conic-gradient(#b7f34a calc(var(--progress)*1%),#35452a 0)}
 #strengthPage .execution-rest-dial>div{display:flex;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;background:#101410}
 #strengthPage .execution-rest-dial strong{font-size:36px;line-height:1.1;font-variant-numeric:tabular-nums}
 #strengthPage .execution-rest-dial span{margin-top:4px;color:#a0a99c;font-size:14px}
 #strengthPage .execution-pause{display:grid;place-items:center;width:48px;height:48px;margin-bottom:5px;border:0;border-radius:50%;background:#222a23;color:#f4f7fa;cursor:pointer}
 #strengthPage .execution-pause svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}
 #strengthPage .execution-rest p{min-height:20px;margin:10px 0;color:#a0a99c;font-size:13px}
 #strengthPage .execution-skip-rest{min-width:150px}
 @media(max-width:600px){#strengthPage .execution-screen{padding:6px 0 12px}#strengthPage .execution-media{height:clamp(175px,52vw,270px)}#strengthPage .execution-stat{min-height:70px}#strengthPage .execution-stat>strong{font-size:21px}#strengthPage .execution-exercise-heading h2{font-size:20px}}
 `;
 const st=document.createElement('style');st.textContent=css;document.head.append(st);
 const nav=document.querySelector('.nav');if(!nav)return;
 const tab=nav.querySelector('[data-page="strengthPage"]');if(!tab)return;
 const section=document.createElement('section');section.className='page';section.id='strengthPage';document.querySelector('.app').append(section);
 let executionFeedbackTimer=null,handlingSetAction=false;
 function setExecutionFeedback(message,state='info'){
  const feedback=$('executionFeedback');if(!feedback)return;
  feedback.textContent=message;feedback.dataset.state=state;
  if(executionFeedbackTimer)clearTimeout(executionFeedbackTimer);
  if(state!=='error')executionFeedbackTimer=setTimeout(()=>{if(feedback.isConnected)feedback.textContent=''},6500);
 }
 section.addEventListener('click',async event=>{
  const button=event.target?.closest?.('#completeSet, #skipSet');if(!button||!section.contains(button))return;
  event.preventDefault();if(handlingSetAction)return;
  handlingSetAction=true;button.disabled=true;
  setExecutionFeedback('Toque recebido. Verificando a série…');
  try{if(button.id==='completeSet')await completeCurrentSet();else await skipCurrentSet()}
  catch(error){setExecutionFeedback('Falha ao processar o comando: '+(error?.message||'erro inesperado.'),'error')}
  finally{handlingSetAction=false;if(button.isConnected&&button.id==='skipSet')button.disabled=false}
 });
 function normalizeHumanText(value){
 const text=String(value??'').replace(/\s+/gu,' ').trim();
 if(!text||text===text.toLocaleLowerCase('pt-BR')||text!==text.toLocaleUpperCase('pt-BR'))return text;
 const acronyms=new Set(['NEXFIT','HIIT','AMRAP','BCAA','TRX','MR','RM','PR','PB','ABC','API','CPF','CNPJ','URL','PDF']);
 const particles=new Set(['a','as','o','os','um','uma','uns','umas','de','da','das','do','dos','e','em','no','na','nos','nas','por','com','para','sem','sob','sobre','entre','contra','após','até','perante']);
 let first=true;
 return text.toLocaleLowerCase('pt-BR').replace(/[\p{L}\p{M}]+/gu,word=>{
  const upper=word.toLocaleUpperCase('pt-BR');
  if(acronyms.has(upper)){first=false;return upper}
  const position=first;first=false;
  if(!position&&(word.length>1&&particles.has(word)||word==='e'))return word;
  return word.replace(/(^|[-'’])([\p{L}])/gu,(_,separator,letter)=>separator+letter.toLocaleUpperCase('pt-BR'));
 });
}
 const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let plans=[],current=null,version=null,subworkouts=[],session=null,timer=null,activeRest=null,notificationsAllowed=false,showArchivedPlans=false,activeTrainingTab='mine',editorSubworkoutId=null,savingSet=false;
 const dbRef=()=>window.db||db, userRef=()=>window.currentUser||currentUser;
 function canManageProgramLocally(p){const u=userRef();return !!u&&(p.athlete_id===u.id||p.created_by===u.id)}
 const editIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>';
 const trashIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>';
 function go(){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section));home()}
 tab.onclick=go;
 const field=(id,label,placeholder='',type='text')=>`<label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}">`;
 function shell(title,body){section.classList.remove('training-gallery');section.innerHTML=`<div class="sectionhead"><div><div class="eyebrow">TREINAMENTO DE FORÇA</div><h2>${title}</h2></div><button class="btn alt" id="refresh">Atualizar</button></div>${body}`;const b=$('refresh');if(b)b.onclick=home}
 function programCategory(description){return String(description||'').match(/\[MODALIDADE:\s*([^\]]+)\]/i)?.[1]?.trim()||'Musculação'}
 async function assertUniqueActiveCategory(category,exceptId=null){
  const {data,error}=await dbRef().from('training_programs').select('id,title,description').eq('athlete_id',userRef().id).eq('status','active');
  if(error)throw Error('Não foi possível validar a categoria do programa: '+error.message);
  const wanted=String(category||'Musculação').trim().toLocaleLowerCase('pt-BR');
  const duplicate=(data||[]).find(p=>String(p.id)!==String(exceptId)&&programCategory(p.description).toLocaleLowerCase('pt-BR')===wanted);
  if(duplicate)throw Error('Já existe um programa vigente na categoria '+category+': “'+duplicate.title+'”. Edite ou arquive esse programa antes de criar outro.');
 }
 async function renderProgramList(){
  const host=$('programList');if(!host)return;
  if(activeTrainingTab==='models'){
   const models=plans.filter(p=>!canManageProgramLocally(p)&&p.status==='active'&&p.is_public===true&&p.current_version_id);
   if(!models.length){host.innerHTML='<div class="training-empty"><div class="training-empty-icon">✦</div><h3>Explore programas públicos</h3><p class="muted">Ainda não há programas públicos disponíveis. Quando alguém compartilhar um programa, ele aparecerá aqui.</p></div>';return}
   const cards=[];
   for(const p of models){
    const q=await dbRef().from('training_subworkouts').select('id,title,training_exercises(id)').eq('version_id',p.current_version_id).order('position');
    if(q.error)continue;
    const workouts=q.data||[],exerciseCount=workouts.reduce((n,w)=>n+(w.training_exercises||[]).length,0);
    const category=programCategory(p.description);
    const description=(p.description||'').replace(/\[MODALIDADE:[^\]]+\]\s*/i,'').trim();
    cards.push('<article class="training-card model-program-card"><div class="training-card-main"><div class="training-card-placeholder" aria-hidden="true"><span>✦</span></div><span class="training-card-copy"><strong>'+esc(normalizeHumanText(p.title))+'</strong><span>'+esc(category)+(description?' · '+esc(description):'')+'</span><small>'+workouts.length+' '+(workouts.length===1?'treino':'treinos')+' · '+exerciseCount+' '+(exerciseCount===1?'exercício':'exercícios')+'</small></span></div><div class="model-workout-preview">'+workouts.slice(0,4).map((w,i)=>'<span>'+esc(w.title||'Treino '+(i+1))+'</span>').join('')+'</div><button class="btn model-copy-button" data-copy-public="'+esc(p.id)+'">Adicionar ao meu perfil</button></article>');
   }
   host.innerHTML=cards.length?'<div class="training-list">'+cards.join('')+'</div>':'<div class="training-empty"><h3>Nenhum modelo público disponível</h3></div>';
   host.querySelectorAll('[data-copy-public]').forEach(b=>b.onclick=()=>copyPublicProgram(b.dataset.copyPublic));
   return;
  }
  const programs=plans.filter(p=>canManageProgramLocally(p)&&p.status==='active'&&p.current_version_id);
  if(!programs.length){host.innerHTML='<div class="training-empty"><h3>Nenhum treino ativo</h3><p class="muted">Crie um programa e adicione seus treinos no gerenciador.</p></div>';return}
  const workouts=[];
  for(const p of programs){
   const q=await dbRef().from('training_subworkouts').select('id,title,description,position,training_exercises(id,name,media_url)').eq('version_id',p.current_version_id).order('position');
   if(q.error)continue;
   for(const workout of q.data||[])workouts.push({program:p,workout,exercises:workout.training_exercises||[]});
  }
  const user=userRef();
  const activitiesQ=await dbRef().from('activities').select('activity_date,notes').eq('user_id',user.id).eq('sport','Musculação').order('activity_date',{ascending:false}).limit(500);
  if(activitiesQ.error){host.innerHTML='<div class="training-empty"><h3>Não foi possível carregar as últimas execuções</h3><p class="muted">'+esc(activitiesQ.error.message)+'</p></div>';return}
  const activityDateBySession=new Map((activitiesQ.data||[]).map(activity=>({
   sessionId:(activity.notes||'').match(/\[NEXFIT_SESSION:([a-f0-9-]+)\]/i)?.[1],
   date:String(activity.activity_date||'').slice(0,10)
  })).filter(item=>item.sessionId&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)).map(item=>[item.sessionId,item.date]));
  const sessionIds=[...activityDateBySession.keys()];
  const history=sessionIds.length?await dbRef().from('training_sessions').select('id,subworkout_id').eq('athlete_id',user.id).eq('status','completed').not('finished_at','is',null).in('id',sessionIds):{data:[],error:null};
  if(history.error){host.innerHTML='<div class="training-empty"><h3>Não foi possível carregar as últimas execuções</h3><p class="muted">'+esc(history.error.message)+'</p></div>';return}
  const lastExecution=new Map();
  for(const item of history.data||[]){
   const date=activityDateBySession.get(item.id);
   if(!item.subworkout_id||!date)continue;
   const previous=lastExecution.get(String(item.subworkout_id));
   if(!previous||date>previous)lastExecution.set(String(item.subworkout_id),date);
  }
  const dateLabel=value=>{
   if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';
   const [year,month,day]=value.split('-');
   return day+'/'+month+'/'+year;
  };
  workouts.sort((a,b)=>{
   const da=lastExecution.get(String(a.workout.id))||null,db=lastExecution.get(String(b.workout.id))||null;
   if(!da&&db)return -1;if(da&&!db)return 1;
   if(da&&db){const diff=da.localeCompare(db);if(diff)return diff}
   return String(a.workout.title||'Treino').localeCompare(String(b.workout.title||'Treino'),'pt-BR',{sensitivity:'base'});
  });
  const cards=workouts.map(({program:p,workout,exercises})=>{
   const thumb=exercises.find(x=>/^https?:/i.test(x.media_url||''))?.media_url||'';
   const image=thumb?'<img src="'+esc(thumb)+'" alt="" loading="lazy">':'<div class="training-card-placeholder" aria-hidden="true"><span>✦</span></div>';
   const category=programCategory(p.description),last=lastExecution.get(String(workout.id))||null;
   const lastDate=dateLabel(last);
   const executionInfo=lastDate?' <span style="font-size:10px;font-weight:500;color:#a0a99c">· Última execução registrada</span> <span style="font-size:11px;font-weight:600;color:#B7F34A">'+esc(lastDate)+'</span>':'';
   return '<article class="training-card" data-training-card><button class="training-card-main" data-start-training="'+esc(p.id)+'" data-version="'+esc(p.current_version_id)+'" data-workout="'+esc(workout.id)+'">'+image+'<span class="training-card-copy"><strong>'+esc(normalizeHumanText(workout.title||'Treino'))+executionInfo+'</strong><small>'+esc((normalizeHumanText(p.title)||category)+(workout.description?' · '+normalizeHumanText(workout.description):''))+' · '+exercises.length+' '+(exercises.length===1?'exercício':'exercícios')+'</small></span><span class="training-chevron" aria-label="Registrar atividade">›</span></button></article>';
  });
  host.innerHTML=cards.length?'<div class="training-list">'+cards.join('')+'</div>':'<div class="training-empty"><h3>Nenhum treino cadastrado</h3><p class="muted">Os programas ativos ainda não possuem treinos.</p></div>';
  host.querySelectorAll('[data-start-training]').forEach(button=>button.onclick=()=>startListedWorkout(button.dataset.startTraining,button.dataset.version,button.dataset.workout));
 }
 async function copyPublicProgram(id){
  if(!confirm('Adicionar uma cópia independente deste programa ao seu perfil? A cópia poderá ser editada sem alterar o programa público original.'))return;
  const {error}=await dbRef().rpc('nexfit_copy_public_program',{p_program:id});
  if(error){const message=error.message||String(error);if(/nexfit_copy_public_program|function.*exist|schema cache|42883/i.test(message))return alert('A função de cópia ainda não está instalada no Supabase. Execute supabase-public-program-models.sql no SQL Editor.');return alert(message)}
  activeTrainingTab='mine';alert('Cópia adicionada ao seu perfil. Você pode editá-la em Gerenciar Programas de Treino.');await home();
 }

 async function startListedWorkout(programId,versionId,workoutId){
  const program=plans.find(p=>String(p.id)===String(programId)&&canManageProgramLocally(p)&&p.status==='active');
  if(!program)return alert('Este programa não está ativo.');
  const vq=await dbRef().from('training_program_versions').select('*').eq('id',versionId).maybeSingle();
  if(vq.error||!vq.data)return alert('Não foi possível carregar a versão deste programa.');
  const sq=await dbRef().from('training_subworkouts').select('*').eq('version_id',versionId).order('position');
  if(sq.error)return alert(sq.error.message);
  current=program;version=vq.data;subworkouts=sq.data||[];
  await startSession(workoutId);
 }

 async function home(){
  const db=dbRef(),u=userRef();if(!db||!u){shell('Meus Treinos','<div class="panel muted">Faça login para acessar seus programas.</div>');return}
  if(session){if(sessionView==='exercise'){shell('Executando exercício','<div id="sessionExercises"></div>');renderSessionStep()}else renderExercisePicker();return}
  if(!restoreAttempted){restoreAttempted=true;restorePromise=restoreWorkoutState()}if(restorePromise){const pending=restorePromise;const restored=await pending;if(restorePromise===pending)restorePromise=null;if(restored)return}
  shell('Meus Treinos',`
   <div class="training-tabs" role="tablist" aria-label="Treinos">
    <button type="button" class="${activeTrainingTab==='mine'?'active':''}" data-training-tab="mine">Meus Treinos</button>
    <button type="button" class="${activeTrainingTab==='models'?'active':''}" data-training-tab="models">Modelos</button>
    <button type="button" class="${activeTrainingTab==='evolution'?'active':''}" data-training-tab="evolution">Evolução</button>
   </div>
   <div id="exerciseEvolution" class="training-programs" hidden></div>
   <div class="training-toolbar"><label for="programSearch">Buscar treino</label><input id="programSearch" type="search" placeholder="Nome do treino"></div>
   <div id="programList" class="training-programs">Carregando treinos…</div>
   <details class="training-secondary"><summary>Gerenciar Programas de Treino</summary>
    <div class="panel training-form-panel"><h3>Criar programa</h3><label for="programCategory">Categoria</label><select id="programCategory"><option>Musculação</option><option>Natação</option><option>Corrida</option><option>Pedal</option><option>Ciclismo</option><option>Caminhada</option><option>Funcional</option><option>Cross training</option><option>Outra</option></select>${field('programTitle','Nome do programa','Ex.: Hipertrofia — bloco 1')}<label for="programDesc">Descrição</label><textarea id="programDesc" rows="2" placeholder="Objetivo e observações"></textarea><button class="btn" id="createProgram">Criar programa</button><div id="professionalProgramFields" style="display:none"><hr><h3>Enviar programa a outro atleta</h3>${field('athleteEmail','E-mail do atleta','aluno@email.com','email')}<button class="btn alt" id="createForAthlete" type="button">Enviar programa</button></div></div>
    <div id="programManagement" class="training-program-management"></div>
   </details>
   <details class="training-secondary"><summary>Gerenciar Treinos</summary>
    <div class="panel training-form-panel"><h3>Criar treino dentro de um programa</h3><label for="workoutProgram">Programa vigente</label><select id="workoutProgram"><option value="">Selecione um programa</option></select>${field('workoutTitle','Nome do treino','Ex.: Treino A — Peito e tríceps')}<label for="workoutDescription">Descrição (opcional)</label><textarea id="workoutDescription" rows="2" placeholder="Observações"></textarea><button class="btn" id="createWorkout" type="button">Criar treino</button></div>
    <div id="trainingManagement" class="training-program-management"></div>
   </details>

   <details class="training-secondary"><summary>Acessos profissionais e notificações</summary><div class="panel" id="professionalAccessPanel"><div id="professionalRequestControls"><div class="rowf"><div>${field('professionalEmail','Solicitar acesso como profissional','personal@email.com','email')}</div><div><label for="accessType">Permissão solicitada</label><select id="accessType"><option value="view">Visualizar histórico</option><option value="manage">Gerenciar meus programas</option></select></div></div><button class="btn alt" id="requestAccess">Solicitar acesso ao atleta</button></div><div id="accessList"></div><h3>Notificações</h3><div id="notifications" class="muted">Carregando…</div></div></details>
  `);
  section.classList.add('training-gallery');section.querySelector('.sectionhead')?.remove();
  section.querySelectorAll('[data-training-tab]').forEach(b=>b.onclick=()=>{activeTrainingTab=b.dataset.trainingTab;home()});
  $('createProgram').onclick=createProgram;$('createForAthlete').onclick=createProgramForAthlete;$('createWorkout').onclick=createWorkout;$('requestAccess').onclick=requestAccess;
  const accountType=u.user_metadata?.account_type||'athlete';if(accountType!=='professional')$('professionalRequestControls').style.display='none';
  const q=await db.from('training_programs').select('*').order('updated_at',{ascending:false});
  if(q.error){$('programList').textContent='A estrutura do NEXFIT ainda precisa ser inicializada no Supabase. '+q.error.message;return}
  plans=q.data||[];showArchivedPlans=false;populateProgramSelectors();renderProgramManagement();await renderTrainingManagement();
  const evolutionView=activeTrainingTab==='evolution';
  $('exerciseEvolution').hidden=!evolutionView;$('programSearch').parentElement.hidden=evolutionView;$('programList').hidden=evolutionView;
  if(evolutionView){
   try{
    if(typeof window.renderNexfitExerciseEvolution!=='function'){
     $('exerciseEvolution').textContent='Preparando histórico de evolução…';
     await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./exercise-evolution.js?v=20261106.8';script.onload=resolve;script.onerror=()=>reject(new Error('Não foi possível carregar o módulo de evolução.'));document.head.append(script)});
    }
    if(typeof window.renderNexfitExerciseEvolution!=='function')throw new Error('O módulo de evolução não foi inicializado.');
    await window.renderNexfitExerciseEvolution($('exerciseEvolution'));
   }catch(error){$('exerciseEvolution').textContent=error.message||'Não foi possível abrir a evolução. Tente novamente.'}
  }else await renderProgramList();
  $('programSearch').oninput=()=>{const term=$('programSearch').value.toLocaleLowerCase('pt-BR');section.querySelectorAll('.training-card').forEach(card=>card.style.display=card.textContent.toLocaleLowerCase('pt-BR').includes(term)?'':'none')};
  const nq=await db.from('app_notifications').select('*').order('created_at',{ascending:false}).limit(8);
  if($('notifications'))$('notifications').innerHTML=nq.error?'Não foi possível carregar notificações.':(nq.data||[]).map(n=>'<div class="item"><strong>'+esc(n.title)+'</strong><p class="muted">'+esc(n.body)+'</p></div>').join('')||'Nenhuma notificação.';
  const aq=await db.from('athlete_professional_access').select('*');
  const canPrescribe=(aq.data||[]).some(a=>a.professional_id===u.id&&a.status==='active'&&a.can_manage_programs);
  if(canPrescribe)$('professionalProgramFields').style.display='block';
  if(!aq.error)$('accessList').innerHTML=(aq.data||[]).map(a=>'<div class="item"><strong>'+(a.professional_id===u.id?'Acesso solicitado':'Profissional')+'</strong> · '+esc(a.status)+' <span class="muted">Histórico: '+(a.can_view_history?'sim':'não')+' · Programas: '+(a.can_manage_programs?'sim':'não')+'</span>'+(a.athlete_id===u.id&&a.status==='pending'?'<button class="btn" data-approve="'+a.id+'">Aprovar</button><button class="btn alt" data-reject="'+a.id+'">Recusar</button>':'')+'</div>').join('');
  section.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>decideAccess(b.dataset.approve,true));section.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>decideAccess(b.dataset.reject,false));
 }
 function populateProgramSelectors(){
  const select=$('workoutProgram');if(!select)return;
  const active=plans.filter(p=>canManageProgramLocally(p)&&p.status==='active'&&p.current_version_id);
  select.innerHTML='<option value="">Selecione um programa</option>'+active.map(p=>'<option value="'+esc(p.id)+'">'+esc(programCategory(p.description)+' · '+normalizeHumanText(p.title))+'</option>').join('');
 }
 async function toggleProgramVisibility(id){
  const p=plans.find(x=>String(x.id)===String(id));if(!p||!canManageProgramLocally(p))return;
  const makePublic=!p.is_public;
  if(makePublic&&!confirm('Este programa ficará visível no menu Treinos > Modelos para que outros usuários possam copiá-lo. Cada cópia será independente e não alterará o original. Tornar público?'))return;
  const {error}=await dbRef().from('training_programs').update({is_public:makePublic}).eq('id',p.id);
  if(error){const message=error.message||String(error);if(/is_public|row.level security|42501/i.test(message))return alert('Não foi possível alterar a visibilidade. Confirme que supabase-public-program-models.sql foi executado no Supabase e que você pode gerenciar este programa.');return alert(message)}
  await home();
 }
 function renderProgramManagement(){
  const host=$('programManagement');if(!host)return;
  const active=plans.filter(p=>canManageProgramLocally(p)&&p.status==='active');
  host.innerHTML=active.length?active.map(p=>'<div class="training-management-row"><div><strong>'+esc(normalizeHumanText(p.title))+'</strong><small>'+esc(programCategory(p.description))+' · '+(p.is_public?'Público':'Privado')+'</small></div><div class="training-row-actions"><button class="btn alt" data-manage-program="'+esc(p.id)+'">Treinos e exercícios</button><button class="btn alt" data-toggle-public="'+esc(p.id)+'">'+(p.is_public?'Tornar privado':'Tornar público')+'</button><button class="icon-action" data-edit-program="'+esc(p.id)+'" title="Editar programa" aria-label="Editar programa">'+editIcon+'</button><button class="icon-action danger" data-archive-program="'+esc(p.id)+'" title="Excluir programa" aria-label="Excluir programa">'+trashIcon+'</button></div></div>').join(''):'<p class="muted">Nenhum programa vigente.</p>';
  host.querySelectorAll('[data-manage-program]').forEach(b=>b.onclick=()=>openProgram(b.dataset.manageProgram));
  host.querySelectorAll('[data-edit-program]').forEach(b=>b.onclick=()=>editProgram(b.dataset.editProgram));
  host.querySelectorAll('[data-toggle-public]').forEach(b=>b.onclick=()=>toggleProgramVisibility(b.dataset.togglePublic));
  host.querySelectorAll('[data-archive-program]').forEach(b=>b.onclick=()=>archiveProgram(b.dataset.archiveProgram));
 }
 async function renderTrainingManagement(){
  const host=$('trainingManagement');if(!host)return;
  const rows=[];
  for(const p of plans.filter(x=>canManageProgramLocally(x)&&x.status==='active'&&x.current_version_id)){
   const q=await dbRef().from('training_subworkouts').select('id,title,description,position').eq('version_id',p.current_version_id).order('position');
   if(q.error)continue;
   for(const w of q.data||[])rows.push('<div class="training-management-row"><div><strong>'+esc(normalizeHumanText(w.title||'Treino'))+'</strong><small>'+esc(normalizeHumanText(p.title))+' · '+esc(programCategory(p.description))+'</small></div><div class="training-row-actions"><button class="icon-action" data-edit-training="'+esc(p.id)+'" data-training-id="'+esc(w.id)+'" title="Editar treino" aria-label="Editar treino">'+editIcon+'</button><button class="icon-action danger" data-delete-training="'+esc(p.id)+'" data-training-id="'+esc(w.id)+'" title="Excluir treino" aria-label="Excluir treino">'+trashIcon+'</button></div></div>');
  }
  host.innerHTML=rows.length?rows.join(''):'<p class="muted">Nenhum treino nos programas vigentes.</p>';
  host.querySelectorAll('[data-edit-training]').forEach(b=>b.onclick=async()=>{await openProgram(b.dataset.editTraining);await openWorkoutEditor(b.dataset.trainingId)});
  host.querySelectorAll('[data-delete-training]').forEach(b=>b.onclick=async()=>{await openProgram(b.dataset.deleteTraining);await deleteSubworkout(b.dataset.trainingId)});
 }

 async function createWorkout(){
  const program=plans.find(p=>String(p.id)===String($('workoutProgram').value)&&p.status==='active');
  const title=normalizeHumanText($('workoutTitle').value);
  if(!program)return alert('Selecione um programa vigente.');
  if(!title)return alert('Informe o nome do treino.');
  const {data:versionRow,error:versionError}=await dbRef().from('training_program_versions').select('id').eq('id',program.current_version_id).maybeSingle();
  if(versionError||!versionRow)return alert('Não foi possível carregar a versão vigente do programa.');
  const {data:existing,error:existingError}=await dbRef().from('training_subworkouts').select('position').eq('version_id',versionRow.id).order('position',{ascending:false}).limit(1);
  if(existingError)return alert('Não foi possível preparar o treino: '+existingError.message);
  const {data,error}=await dbRef().from('training_subworkouts').insert({version_id:versionRow.id,title,description:normalizeHumanText($('workoutDescription').value)||null,position:(existing?.[0]?.position||0)+1}).select().single();
  if(error)return alert('Não foi possível criar o treino: '+error.message);
  $('workoutTitle').value='';$('workoutDescription').value='';
  current=program;version=versionRow;
  await openWorkoutEditor(data.id);
 }
 async function createProgram(){
  const title=normalizeHumanText($('programTitle').value);
  if(!title)return alert('Informe o nome do programa.');
  const category=$('programCategory').value,description=normalizeHumanText($('programDesc').value)||null;
  const {data,error}=await dbRef().rpc('nexfit_create_own_program',{p_title:title,p_category:category,p_description:description});
  if(error){const message=error.message||String(error);if(/row.level security|42501/i.test(message))return alert('O Supabase bloqueou a criação deste programa. Execute supabase-own-program-creation.sql no SQL Editor do Supabase e tente novamente.');return alert(message)}
  await home();
 }
 async function createProgramForAthlete(){
  const email=$('athleteEmail').value.trim().toLowerCase(),title=normalizeHumanText($('programTitle').value);
  if(!email)return alert('Informe o e-mail do atleta.');
  if(!title)return alert('Informe o nome do programa.');
  const category=$('programCategory').value,description='[MODALIDADE: '+category+'] '+normalizeHumanText($('programDesc').value);
  const {error}=await dbRef().rpc('nexfit_create_program_for_athlete',{p_email:email,p_title:title,p_description:description});
  if(error){const message=error.message||String(error);if(/row.level security|42501/i.test(message))return alert('O Supabase bloqueou a criação do programa para outro atleta. Execute o arquivo supabase-program-management-policies.sql no SQL Editor do Supabase e confirme que sua autorização de gestão está ativa.');return alert(message)}
  alert('Programa enviado ao atleta. Ele precisará confirmar o recebimento.');
  home();
 }
 async function requestAccess(){
  const email=$('professionalEmail').value.trim().toLowerCase();if(!email)return alert('Informe o e-mail do atleta.');
  const {error}=await dbRef().rpc('nexfit_request_access_by_email',{p_email:email});
  if(error)return alert(error.message);alert('Solicitação enviada. O atleta precisa aprovar e escolher as permissões.');home();
 }
 async function decideAccess(id,approve){
  const db=dbRef(),u=userRef();
  let permissions={can_view_history:false,can_manage_programs:false};
  if(approve){
   permissions.can_view_history=confirm('Permitir que este profissional visualize seu histórico de treinos?');
   permissions.can_manage_programs=confirm('Permitir que este profissional crie e gerencie os programas que ele próprio criar para você?');
   if(!permissions.can_view_history&&!permissions.can_manage_programs&&!confirm('Nenhuma permissão foi concedida. Deseja aprovar mesmo assim?'))return;
  }
  const {error}=await db.from('athlete_professional_access').update({...permissions,status:approve?'active':'revoked',decided_at:new Date().toISOString()}).eq('id',id).eq('athlete_id',u.id);
  if(error)return alert(error.message);home();
 }
 async function openProgram(id){
  editorSubworkoutId=null;
  const db=dbRef();current=plans.find(p=>p.id===id);if(!current)return;
  const {data:vers,error}=await db.from('training_program_versions').select('*').eq('program_id',id).order('version_number',{ascending:false});
  if(error)return alert(error.message);
  const pending=vers.find(v=>v.status==='pending'),active=vers.find(v=>v.status==='active');version=pending||active||vers[0];
  if(!version){return alert('Este programa ainda não possui versão.')}
  const sq=await db.from('training_subworkouts').select('*').eq('version_id',version.id).order('position');
  if(sq.error)return alert(sq.error.message);subworkouts=sq.data||[];
  const isAthlete=current.athlete_id===userRef().id;
  shell(current.title,`<div class="panel"><p class="muted">${esc(current.description||'')} · Versão ${version.version_number} · ${version.status==='pending'?'Aguardando confirmação do atleta':version.status==='active'?'Vigente':'Arquivada'}</p>${pending&&isAthlete?'<button class="btn" id="confirmVersion">Confirmar recebimento desta versão</button>':''}<button class="btn alt" id="newVersion">Criar nova versão</button><button class="icon-action" id="editCurrentProgram" title="Editar programa" aria-label="Editar programa">${editIcon}</button><button class="icon-action danger" id="archiveCurrentProgram" title="Excluir programa" aria-label="Excluir programa">${trashIcon}</button><button class="btn alt" id="newSub">＋ Adicionar treino</button></div><div id="subList"></div><div class="panel"><h3>Solicitar exclusão</h3><p class="muted">A exclusão depende da aprovação do atleta. O histórico de treinos nunca é apagado.</p><button class="btn alt" id="deleteRequest">Solicitar arquivamento</button></div>`);
  $('newVersion').onclick=newVersion;$('newSub').onclick=addSubworkout;$('deleteRequest').onclick=requestDeletion;$('editCurrentProgram').onclick=()=>editProgram(current.id);$('archiveCurrentProgram').onclick=()=>archiveProgram(current.id);
  if($('confirmVersion'))$('confirmVersion').onclick=async()=>{const r=await db.rpc('nexfit_confirm_program_version',{p_version:version.id});if(r.error)alert(r.error.message);else openProgram(id)};
  renderSubworkouts();
 }
 async function newVersion(){
  const db=dbRef(),q=await db.from('training_program_versions').select('version_number').eq('program_id',current.id).order('version_number',{ascending:false}).limit(1);
  if(q.error)return alert(q.error.message);const next=(q.data?.[0]?.version_number||0)+1;
  const previous=version;
  const {data,error}=await db.from('training_program_versions').insert({program_id:current.id,version_number:next,created_by:userRef().id,change_note:prompt('Resumo das alterações desta versão:')||'Atualização do programa'}).select().single();
  if(error)return alert(error.message);
  const oldSubs=await db.from('training_subworkouts').select('*').eq('version_id',previous.id).order('position');
  if(oldSubs.error)return alert('A versão foi criada, mas não foi possível copiar os treinos: '+oldSubs.error.message);
  for(const oldSub of (oldSubs.data||[])){
   const {data:newSub,error:subErr}=await db.from('training_subworkouts').insert({version_id:data.id,title:oldSub.title,description:oldSub.description,position:oldSub.position}).select().single();
   if(subErr)return alert('A versão foi criada, mas houve erro ao copiar um treino: '+subErr.message);
   const oldExercises=await db.from('training_exercises').select('*').eq('subworkout_id',oldSub.id).order('position');
   if(oldExercises.error)return alert(oldExercises.error.message);
   if(oldExercises.data?.length){
    const copied=oldExercises.data.map(e=>({subworkout_id:newSub.id,name:e.name,position:e.position,sets:e.sets,rest_seconds:e.rest_seconds,notes:e.notes,media_url:e.media_url}));
    const {error:exErr}=await db.from('training_exercises').insert(copied);
    if(exErr)return alert('A versão foi criada, mas houve erro ao copiar exercícios: '+exErr.message);
   }
  }
  await db.from('app_notifications').insert({user_id:current.athlete_id,type:'program_version_pending',title:'Nova versão disponível',body:'Analise a nova versão do seu programa. A versão atual permanece vigente até sua confirmação.',entity_id:current.id});version=data;openProgram(current.id);
 }
 async function addSubworkout(){
  const title=normalizeHumanText(prompt('Nome do treino (ex.: A — Peito e tríceps):'));if(!title)return;
  const {data,error}=await dbRef().from('training_subworkouts').insert({version_id:version.id,title,position:subworkouts.length+1}).select().single();if(error)return alert(error.message);await openWorkoutEditor(data.id);
 }
 async function refreshWorkoutEditorOrProgram(){
  if(editorSubworkoutId){await openWorkoutEditor(editorSubworkoutId);return}
  await openProgram(current.id);
 }
 async function openWorkoutEditor(subId){
  if(!current||!version)return;
  const db=dbRef(),subQuery=await db.from('training_subworkouts').select('*').eq('id',subId).maybeSingle();
  if(subQuery.error||!subQuery.data)return alert('Não foi possível abrir o treino: '+(subQuery.error?.message||'treino não encontrado'));
  const sub=subQuery.data;editorSubworkoutId=sub.id;
  const exercises=await db.from('training_exercises').select('*').eq('subworkout_id',sub.id).order('position');
  if(exercises.error)return alert('Não foi possível carregar os exercícios: '+exercises.error.message);
  const rows=(exercises.data||[]).map((e,i)=>'<div class="item"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><strong>'+(i+1)+'. '+esc(normalizeHumanText(e.name))+'</strong><span><button class="icon-action" data-edit-focused-ex="'+esc(e.id)+'" title="Editar exercício" aria-label="Editar exercício">'+editIcon+'</button><button class="icon-action danger" data-delete-focused-ex="'+esc(e.id)+'" title="Excluir exercício" aria-label="Excluir exercício">'+trashIcon+'</button></span></div><div class="muted">'+(e.sets||[]).map(x=>(x.reps??'—')+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':'')).join(' / ')+' · descanso '+e.rest_seconds+'s</div></div>').join('');
  shell('Editar treino',`<div class="panel">
   <button class="btn alt" type="button" id="backToProgram">← Voltar ao programa</button>
   <p class="muted">${esc(normalizeHumanText(current.title))}</p>
   <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2>${esc(normalizeHumanText(sub.title))}</h2><button class="icon-action" type="button" id="editFocusedWorkoutDetails" title="Editar nome e descrição" aria-label="Editar nome e descrição">${editIcon}</button></div>
   <p class="muted">${esc(sub.description||'Sem descrição.')}</p>
   <div class="training-program-management">${rows||'<p class="muted">Nenhum exercício adicionado. Comece adicionando o primeiro exercício.</p>'}</div>
   <button class="btn" type="button" id="addExerciseFocused">＋ Adicionar exercício</button>
  </div>`);
  $('backToProgram').onclick=()=>{editorSubworkoutId=null;openProgram(current.id)};
  $('editFocusedWorkoutDetails').onclick=()=>editSubworkout(sub.id);
  $('addExerciseFocused').onclick=()=>addExercise(sub.id);
  section.querySelectorAll('[data-edit-focused-ex]').forEach(b=>b.onclick=()=>editExercise(b.dataset.editFocusedEx));
  section.querySelectorAll('[data-delete-focused-ex]').forEach(b=>b.onclick=()=>deleteExercise(b.dataset.deleteFocusedEx));
 }
 async function renderSubworkouts(){
  const db=dbRef();let html='';
  for(const s of subworkouts){const q=await db.from('training_exercises').select('*').eq('subworkout_id',s.id).order('position');const done=await db.from('training_sessions').select('subworkout_id').eq('program_id',current.id).eq('athlete_id',userRef().id).eq('status','completed');let total=0;if(!done.error&&done.data?.length){const ids=[...new Set(done.data.map(x=>x.subworkout_id).filter(Boolean))];if(ids.length){const names=await db.from('training_subworkouts').select('id,title').in('id',ids);const titleIds=(names.data||[]).filter(x=>x.title===s.title).map(x=>x.id);total=done.data.filter(x=>titleIds.includes(x.subworkout_id)).length}}html+=`<div class="panel"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3>${esc(normalizeHumanText(s.title))}</h3><span class="tag">${total} ${total===1?'treino registrado':'treinos registrados'}</span><button class="icon-action" data-edit-sub="${s.id}" title="Editar treino" aria-label="Editar treino">${editIcon}</button><button class="icon-action danger" data-delete-sub="${s.id}" title="Excluir treino" aria-label="Excluir treino">${trashIcon}</button></div><p class="muted">${esc(s.description||'')}</p>${(q.data||[]).map((e,i)=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><strong>${i+1}. ${esc(normalizeHumanText(e.name))}</strong><span><button class="icon-action" data-edit-ex="${e.id}" title="Editar exercício" aria-label="Editar exercício">${editIcon}</button><button class="icon-action danger" data-delete-ex="${e.id}" title="Excluir exercício" aria-label="Excluir exercício">${trashIcon}</button></span></div><div class="muted">${(e.sets||[]).map(x=>(x.reps??'—')+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':'')).join(' / ')} · descanso ${e.rest_seconds}s</div></div>`).join('')}<button class="btn alt" data-add-ex="${s.id}">Adicionar exercício</button><button class="btn" data-start="${s.id}">Iniciar treino</button></div>`}
  $('subList').innerHTML=html||'<div class="panel muted">Nenhum treino nesta versão. Adicione o primeiro treino.</div>';
  section.querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>addExercise(b.dataset.addEx));
  section.querySelectorAll('[data-edit-sub]').forEach(b=>b.onclick=()=>editSubworkout(b.dataset.editSub));
  section.querySelectorAll('[data-delete-sub]').forEach(b=>b.onclick=()=>deleteSubworkout(b.dataset.deleteSub));
  section.querySelectorAll('[data-edit-ex]').forEach(b=>b.onclick=()=>editExercise(b.dataset.editEx));
  section.querySelectorAll('[data-delete-ex]').forEach(b=>b.onclick=()=>deleteExercise(b.dataset.deleteEx));
  section.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startSession(b.dataset.start));
 }
 async function addExercise(subId){
  const name=normalizeHumanText(prompt('Nome do exercício:'));if(!name)return;
  const raw=prompt('Séries e repetições (ex.: 12,10,8):','12,10,8')||'12,10,8';
  const rest=parseRestSeconds(prompt('Descanso em segundos ou minutos (ex.: 60 ou 1 min):','90')||'90');
  let reps;try{reps=parseRepScheme(raw)}catch(err){return alert(err.message)}
  const sets=reps.map(value=>({reps:value,load_kg:null}));
  if(!sets.length)return alert('Informe repetições válidas.');
  const {data,error}=await dbRef().from('training_exercises').select('position').eq('subworkout_id',subId).order('position',{ascending:false}).limit(1);
  if(error)return alert(error.message);
  const r=await dbRef().from('training_exercises').insert({subworkout_id:subId,name:normalizeHumanText(name),position:(data?.[0]?.position||0)+1,sets,rest_seconds:Math.max(0,Math.min(rest,3600))});
  if(r.error)return alert(r.error.message);await refreshWorkoutEditorOrProgram();
 }
 function showProgramEditor(title,fields,onSave){
  let overlay=$('programEditorModal');
  if(!overlay){overlay=document.createElement('div');overlay.id='programEditorModal';overlay.className='modalback';document.body.append(overlay);overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('show')})}
  overlay.innerHTML='<div class="modal"><div class="modalhead"><h2>'+esc(title)+'</h2><button type="button" class="close" id="editorClose">×</button></div><form id="programEditorForm">'+fields+'<div class="formactions"><button type="button" class="secondary" id="editorCancel">Cancelar</button><button type="submit" class="primary" id="editorSave">Salvar alterações</button></div></form></div>';
  overlay.classList.add('show');
  $('editorClose').onclick=$('editorCancel').onclick=()=>overlay.classList.remove('show');
  $('programEditorForm').onsubmit=async e=>{e.preventDefault();const button=$('editorSave');button.disabled=true;try{const ok=await onSave();if(ok!==false)overlay.classList.remove('show')}finally{button.disabled=false}};
 }
 const editorField=(id,label,value,type='text',placeholder='')=>{const cleanValue=/(Title|Name)$/.test(id)?normalizeHumanText(value):value;return '<div class="field"><label for="'+id+'">'+esc(label)+'</label><input id="'+id+'" type="'+type+'" value="'+esc(cleanValue)+'" placeholder="'+esc(placeholder)+'" required></div>'};
 const editorArea=(id,label,value)=>'<div class="field"><label for="'+id+'">'+esc(label)+'</label><textarea id="'+id+'" rows="3">'+esc(value)+'</textarea></div>';
 async function editProgram(id){
  const p=plans.find(x=>String(x.id)===String(id));if(!p)return;
  const prefix=(p.description||'').match(/^\[MODALIDADE:\s*[^\]]+\]\s*/i)?.[0]||'';
  const description=(p.description||'').replace(/^\[MODALIDADE:\s*[^\]]+\]\s*/i,'');
  showProgramEditor('Editar programa',editorField('editorProgramTitle','Nome do programa',p.title)+editorArea('editorProgramDescription','Descrição',description),async()=>{
   const title=normalizeHumanText($('editorProgramTitle').value);if(!title)return alert('Informe um nome para o programa.');
   const {error}=await dbRef().from('training_programs').update({title,description:prefix+normalizeHumanText($('editorProgramDescription').value)}).eq('id',p.id);
   if(error){alert('Não foi possível salvar o programa: '+error.message);return false}
   await home();return true;
  });
 }
 async function archiveProgram(id){
  const p=plans.find(x=>String(x.id)===String(id));if(!p)return;
  if(!confirm('Excluir este programa da lista de treinos? Ele será arquivado para preservar o histórico das sessões.'))return;
  const {error}=await dbRef().from('training_programs').update({status:'archived'}).eq('id',p.id);
  if(error)return alert('Não foi possível excluir o programa: '+error.message);current=null;await home();
 }
 async function restoreProgram(id){
  const p=plans.find(x=>String(x.id)===String(id));if(!p)return;
  try{await assertUniqueActiveCategory(programCategory(p.description),p.id)}catch(err){return alert(err.message)}
  const {error}=await dbRef().from('training_programs').update({status:'active'}).eq('id',p.id);
  if(error)return alert('Não foi possível restaurar o programa: '+error.message);
  showArchivedPlans=false;await home();
 }

 async function editSubworkout(id){
  const item=subworkouts.find(x=>String(x.id)===String(id));if(!item)return;
  showProgramEditor('Editar treino',editorField('editorSubTitle','Nome do treino',item.title)+editorArea('editorSubDescription','Descrição',item.description||''),async()=>{
   const title=normalizeHumanText($('editorSubTitle').value);if(!title)return alert('Informe um nome para o treino.');
   const {error}=await dbRef().from('training_subworkouts').update({title,description:normalizeHumanText($('editorSubDescription').value)||null}).eq('id',item.id);
   if(error){alert('Não foi possível salvar o treino: '+error.message);return false}
   await refreshWorkoutEditorOrProgram();return true;
  });
 }
 async function deleteSubworkout(id){
  const item=subworkouts.find(x=>String(x.id)===String(id));if(!item)return;
  if(!confirm('Excluir o treino "'+item.title+'"?'))return;
  const db=dbRef(),used=await db.from('training_sessions').select('id',{count:'exact',head:true}).eq('subworkout_id',item.id);
  if(used.error)return alert('Não foi possível verificar o histórico: '+used.error.message);
  if((used.count||0)>0)return alert('Este treino já tem sessões registradas. Para preservar o histórico, ele não pode ser excluído.');
  const delExercises=await db.from('training_exercises').delete().eq('subworkout_id',item.id);
  if(delExercises.error)return alert('Não foi possível excluir os exercícios: '+delExercises.error.message);
  const {error}=await db.from('training_subworkouts').delete().eq('id',item.id);
  if(error)return alert('Não foi possível excluir o treino: '+error.message);await openProgram(current.id);
 }
 function parseRepScheme(raw){
  const text=String(raw||'').trim().toUpperCase();
  const multi=text.match(/^(\d+)\s*X\s*(MR|AMRAP|\d+(?:[.,]\d+)?)$/);
  if(multi){const n=Number(multi[1]),rep=/^(MR|AMRAP)$/.test(multi[2])?'MR':Number(multi[2].replace(',','.'));if(n<1||n>30)throw Error('O número de séries deve ficar entre 1 e 30.');return Array(n).fill(rep)}
  const parts=text.split(/[,;\s]+/).filter(Boolean),out=parts.map(x=>/^(MR|AMRAP)$/.test(x)?'MR':Number(x.replace(',','.')));
  if(!out.length||out.some(x=>x!=='MR'&&(!Number.isFinite(x)||x<=0)))throw Error('Use valores como 3 x 10, 3 x MR ou 12, 10, 8.');
  return out;
 }
 async function editExercise(id){
  const db=dbRef(),q=await db.from('training_exercises').select('*').eq('id',id).maybeSingle();
  if(q.error||!q.data)return alert('Não foi possível abrir o exercício para edição: '+(q.error?.message||'registro não encontrado'));
  const e=q.data,initialReps=(e.sets||[]).map(x=>x.reps).join(', '),initialLoads=(e.sets||[]).map(x=>x.load_kg??'').join(';');
  const fields=editorField('editorExerciseName','Nome do exercício',e.name)
   +editorField('editorExerciseReps','Séries e repetições',initialReps,'text','Ex.: 3 x 10, 3 x MR ou 12, 10, 8')
   +editorField('editorExerciseLoads','Carga por série (kg)',initialLoads,'text','Ex.: 50; 50; 45')
   +'<p class="muted">Use ponto e vírgula para informar uma carga por série. Um único valor é aplicado a todas as séries. Se mudar a quantidade de séries e mantiver as cargas atuais, elas serão preservadas por posição.</p>'
   +editorField('editorExerciseRest','Descanso',String(e.rest_seconds??0),'text','Segundos, mm:ss ou minutos');
  showProgramEditor('Editar exercício',fields,async()=>{
   const name=normalizeHumanText($('editorExerciseName').value);if(!name)return alert('Informe o nome do exercício.');
   let reps;try{reps=parseRepScheme($('editorExerciseReps').value)}catch(err){alert(err.message);return false}
   const loadText=$('editorExerciseLoads').value,oldLoads=(e.sets||[]).map(x=>x.load_kg??null);
   let loads;
   if(loadText===initialLoads)loads=reps.map((_,i)=>oldLoads[i]??(i>0?oldLoads[i-1]??null:null));
   else if(!loadText.trim())loads=reps.map(()=>null);
   else{
    let parts=loadText.split(';').map(x=>x.trim());
    if(parts.length===1&&reps.length>1)parts=Array(reps.length).fill(parts[0]);
    if(parts.length!==reps.length){alert('Informe uma carga ou um valor por série.');return false}
    loads=parts.map(v=>v===''||v==='-'?null:Number(v.replace(',','.')));
    if(loads.some(v=>v!==null&&(!Number.isFinite(v)||v<0))){alert('Há uma carga inválida.');return false}
   }
   const restText=$('editorExerciseRest').value.trim(),rest=parseRestSeconds(restText);
   if(!rest&&restText!=='0'){alert('Informe um descanso válido.');return false}
   const sets=reps.map((r,i)=>({reps:r,load_kg:loads[i]??null}));
   const {error}=await db.from('training_exercises').update({name,sets,rest_seconds:rest}).eq('id',id);
   if(error){alert('Não foi possível salvar o exercício: '+error.message);return false}
   await refreshWorkoutEditorOrProgram();return true;
  });
 }
 async function deleteExercise(id){
  const db=dbRef(),q=await db.from('training_exercises').select('*').eq('id',id).maybeSingle();
  if(q.error||!q.data)return alert('Não foi possível localizar o exercício.');
  if(!confirm('Excluir o exercício "'+q.data.name+'"?'))return;
  const used=await db.from('training_set_logs').select('id',{count:'exact',head:true}).eq('exercise_id',id);
  if(used.error)return alert('Não foi possível verificar o histórico: '+used.error.message);
  if((used.count||0)>0)return alert('Este exercício tem séries registradas. Para preservar o histórico, ele não pode ser excluído.');
  const {error}=await db.from('training_exercises').delete().eq('id',id);
  if(error)return alert('Não foi possível excluir o exercício: '+error.message);await refreshWorkoutEditorOrProgram();
 }
 async function requestDeletion(){
  const reason=prompt('Motivo do pedido de arquivamento (opcional):')||null;
  const {error}=await dbRef().from('training_program_deletion_requests').insert({program_id:current.id,requested_by:userRef().id,reason});
  if(error)return alert(error.message);
  await dbRef().from('training_programs').update({status:'deletion_pending'}).eq('id',current.id);
  await dbRef().from('app_notifications').insert({user_id:current.athlete_id,type:'deletion_request',title:'Pedido de arquivamento',body:'Um profissional solicitou arquivar um programa. Aprove ou rejeite o pedido.',entity_id:current.id});
  alert('Pedido enviado ao atleta para aprovação.');
 }
 let sessionPlan=[],sessionIndex=0,sessionExerciseRows=[],sessionLoads={},sessionSetLogs=[],skippedSetKeys=new Set(),skippedExerciseIndices=new Set();
 let previousLoadsByExercise={};
 function exerciseIdentity(name){return String(name??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR')}
 async function preloadPreviousLoads(exercises){
  previousLoadsByExercise={};const u=userRef(),db=dbRef();if(!u||!db||!exercises?.length)return;
  const wanted=new Set(exercises.map(e=>exerciseIdentity(e.name)).filter(Boolean));if(!wanted.size)return;
  const [sessions,allExercises]=await Promise.all([
   db.from('training_sessions').select('id').eq('athlete_id',u.id).neq('id',session?.id||'00000000-0000-0000-0000-000000000000').order('started_at',{ascending:false}).limit(500),
   db.from('training_exercises').select('id,name')
  ]);
  if(sessions.error||allExercises.error){console.warn('Não foi possível consultar cargas anteriores',sessions.error||allExercises.error);return}
  const matching=(allExercises.data||[]).filter(e=>wanted.has(exerciseIdentity(e.name)));
  if(!matching.length||!sessions.data?.length)return;
  const sessionIds=sessions.data.map(x=>x.id),exerciseIds=matching.map(x=>x.id),nameById=new Map(matching.map(x=>[x.id,exerciseIdentity(x.name)]));
  const logs=await db.from('training_set_logs').select('exercise_id,reps_completed,load_kg,completed_at,session_id').in('session_id',sessionIds).in('exercise_id',exerciseIds).not('load_kg','is',null).not('reps_completed','is',null).order('completed_at',{ascending:false}).limit(5000);
  if(logs.error){console.warn('Não foi possível consultar cargas anteriores',logs.error);return}
  for(const row of logs.data||[]){const identity=nameById.get(row.exercise_id),reps=Number(row.reps_completed),load=Number(row.load_kg);if(!identity||!Number.isFinite(reps)||reps<1||!Number.isFinite(load)||load<0)continue;if(!previousLoadsByExercise[identity])previousLoadsByExercise[identity]={};if(previousLoadsByExercise[identity][reps]===undefined)previousLoadsByExercise[identity][reps]=load}
 }
 let sessionView='picker',restSnapshot=null,restoreAttempted=false,restorePromise=null;
 const sessionStorageKey=()=> 'nexfit-active-workout:'+String(userRef()?.id||'');
 function persistWorkoutState(){
  if(!session||!userRef()?.id)return;
  try{const rest=activeRest?{deadline:activeRest.deadline,total:activeRest.total,remaining:activeRest.remaining,paused:activeRest.paused,nextText:activeRest.nextText,notified:activeRest.notified,itemIndex:sessionIndex}:null;
   localStorage.setItem(sessionStorageKey(),JSON.stringify({userId:userRef().id,sessionId:session.id,programId:current?.id,versionId:version?.id,subworkoutId:session.subworkout_id,sessionIndex,sessionLoads,skippedSetKeys:[...skippedSetKeys],skippedExerciseIndices:[...skippedExerciseIndices],view:sessionView,rest,draftReps:$('sessionReps')?.value??null,draftLoad:$('sessionLoad')?.value??null,updatedAt:Date.now()}));
  }catch(e){console.warn('Não foi possível guardar a sessão localmente',e)}
 }
 function clearPersistedWorkout(){try{if(userRef()?.id)localStorage.removeItem(sessionStorageKey())}catch(_){}}
 async function restoreWorkoutState(){
  if(session)return true;const u=userRef(),db=dbRef();if(!u||!db)return false;
  let saved;try{saved=JSON.parse(localStorage.getItem(sessionStorageKey())||'null')}catch(_){saved=null}
  if(!saved||saved.userId!==u.id||!saved.sessionId)return false;
  const sq=await db.from('training_sessions').select('*').eq('id',saved.sessionId).eq('athlete_id',u.id).maybeSingle();
  if(sq.error||!sq.data||sq.data.status==='completed'){clearPersistedWorkout();return false}
  const [pq,vq,wq,eq,lq]=await Promise.all([
   db.from('training_programs').select('*').eq('id',saved.programId).maybeSingle(),
   db.from('training_program_versions').select('*').eq('id',saved.versionId).maybeSingle(),
   db.from('training_subworkouts').select('*').eq('version_id',saved.versionId).order('position'),
   db.from('training_exercises').select('*').eq('subworkout_id',saved.subworkoutId).order('position'),
   db.from('training_set_logs').select('*').eq('session_id',saved.sessionId)
  ]);
  if(pq.error||vq.error||wq.error||eq.error||lq.error||!pq.data||!vq.data||!eq.data?.length)return false;
  session=sq.data;current=pq.data;version=vq.data;subworkouts=wq.data||[];sessionExerciseRows=eq.data;sessionPlan=[];
  sessionExerciseRows.forEach((exercise,exerciseIndex)=>(exercise.sets||[]).forEach((set,setIndex)=>sessionPlan.push({exercise,exerciseIndex,set,setIndex})));
  sessionSetLogs=lq.data||[];await preloadPreviousLoads(eq.data);sessionIndex=Math.max(0,Math.min(Number(saved.sessionIndex)||0,Math.max(0,sessionPlan.length-1)));
  sessionLoads=saved.sessionLoads||{};skippedSetKeys=new Set(saved.skippedSetKeys||[]);skippedExerciseIndices=new Set(saved.skippedExerciseIndices||[]);sessionView=saved.view||'picker';restSnapshot=saved.rest||null;
  if(sessionView==='exercise'){
   shell('Executando exercício','<div id="sessionExercises"></div>');renderSessionStep();
   if(saved.draftLoad!==null&&$('sessionLoad')){$('sessionLoad').value=saved.draftLoad;$('sessionLoad').dataset.userEdited='true';}
   if(saved.draftReps!==null&&$('sessionReps'))$('sessionReps').value=saved.draftReps;
   if(restSnapshot&&sessionPlan[restSnapshot.itemIndex]){
    const item=sessionPlan[restSnapshot.itemIndex],rest=restSnapshot,advance=()=>{if(timer)clearInterval(timer);timer=null;activeRest=null;restSnapshot=null;advanceAfterSet(item)};
    activeRest={deadline:rest.deadline,total:rest.total,remaining:rest.remaining,paused:rest.paused,advance,nextText:rest.nextText,notified:rest.notified};
    const panel=$('restPanel'),actions=document.querySelector('.execution-actions'),skipExercise=$('skipExercise');
    if(panel){panel.hidden=false;$('nextStepText').textContent=rest.nextText}if(actions)actions.hidden=true;if(skipExercise)skipExercise.hidden=true;
    if(activeRest.paused){const b=$('pauseRest');if(b){b.setAttribute('aria-label','Continuar descanso');b.title='Continuar descanso';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7z"/></svg>'}}
    else{timer=setInterval(tickRestTimer,250);tickRestTimer()}
   }
  }else renderExercisePicker();
  persistWorkoutState();return true;
 }
 window.addEventListener('pagehide',persistWorkoutState);window.addEventListener('beforeunload',persistWorkoutState);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){persistWorkoutState();return}if(!session&&userRef()?.id&&section.classList.contains('active')){restoreAttempted=false;home()}});
  window.addEventListener('pageshow',()=>{if(!session&&userRef()?.id&&section.classList.contains('active')){restoreAttempted=false;home()}});

 function renderSessionStep(){
  sessionView='exercise';
  const host=$('sessionExercises');if(!host)return;
  if(sessionIndex>=sessionPlan.length){renderExercisePicker();return}
  const item=sessionPlan[sessionIndex],e=item.exercise,set=item.set,setNo=item.setIndex+1,total=(e.sets||[]).length;
  const planned=set.reps==='MR'?'MR':Number(set.reps)||0,loadKey=e.id+':'+item.setIndex,identity=exerciseIdentity(e.name);
  const previousLoad=planned==='MR'?null:previousLoadsByExercise[identity]?.[planned];
  if(sessionLoads[loadKey]===undefined)sessionLoads[loadKey]=previousLoad??set.load_kg??(item.setIndex>0?(sessionLoads[e.id+':'+(item.setIndex-1)]??''):'');
  const loadValue=sessionLoads[loadKey],loggedSets=sessionSetLogs.length,allSets=sessionPlan.length;
  const media=e.media_url?'<img class="execution-media" src="'+esc(e.media_url)+'" alt="Demonstração de '+esc(normalizeHumanText(e.name))+'">':'';
  host.innerHTML='<div class="execution-screen"><header class="execution-header"><button class="execution-back" type="button" id="exitSession" aria-label="Voltar para o início" title="Voltar para o início"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><strong>'+esc(normalizeHumanText(current.title))+'</strong><span>'+(item.exerciseIndex+1)+' / '+sessionExerciseRows.length+'</span></header><div class="execution-progress"><span style="width:'+Math.round((loggedSets/Math.max(1,allSets))*100)+'%"></span></div><div class="execution-exercise-heading"><h2>'+esc(normalizeHumanText(e.name))+'</h2><p>'+(e.notes?esc(e.notes):'Exercício '+(item.exerciseIndex+1)+' do treino')+'</p></div>'+media+'<div class="execution-stats"><div class="execution-stat"><span>Séries</span><strong>'+setNo+'/'+total+'</strong></div><div class="execution-stat"><span>Repetições</span><strong>'+(planned==='MR'?'MR':planned)+'</strong></div><div class="execution-stat execution-load-stat"><label for="sessionLoad">Carga</label><div class="execution-load-control"><button type="button" id="loadDown" aria-label="Diminuir carga">−</button><input id="sessionLoad" type="number" min="0" step="0.25" placeholder="kg" value="'+(loadValue??'')+'" aria-label="Carga em quilogramas"><button type="button" id="loadUp" aria-label="Aumentar carga">+</button></div><small id="previousLoadHint">'+(previousLoad!==undefined&&previousLoad!==null?'Última carga registrada':'kg')+'</small></div></div>'+(planned==='MR'?'<label class="execution-reps-label" for="sessionReps">Repetições realizadas</label><input class="execution-reps-input" id="sessionReps" type="number" min="1" placeholder="Informe quantas conseguiu">':'')+'<div class="execution-feedback" id="executionFeedback" role="status" aria-live="polite" data-state="info"></div><div class="execution-actions"><button class="execution-primary" type="button" id="completeSet">Registrar carga</button><button class="execution-secondary" type="button" id="skipSet">Pular</button></div><button class="execution-skip-exercise" type="button" id="skipExercise">Pular exercício</button><div class="execution-rest" id="restPanel" hidden><div class="execution-rest-heading">DESCANSO</div><div class="execution-rest-row"><div class="execution-rest-dial" id="restDial" style="--progress:100"><div><strong id="restClock">00:00</strong><span>Descanso</span></div></div><button class="execution-pause" type="button" id="pauseRest" aria-label="Pausar descanso" title="Pausar descanso"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg></button></div><p id="nextStepText"></p><button class="execution-secondary execution-skip-rest" type="button" id="skipRest">Pular descanso</button></div></div>';
  $('sessionLoad').oninput=()=>{sessionLoads[loadKey]=$('sessionLoad').value;$('sessionLoad').dataset.userEdited='true';persistWorkoutState()};
  if($('sessionReps'))$('sessionReps').oninput=()=>{const actual=Number($('sessionReps').value),suggested=previousLoadsByExercise[identity]?.[actual],loadInput=$('sessionLoad');if(suggested!==undefined&&loadInput&&!loadInput.dataset.userEdited){loadInput.value=String(suggested);sessionLoads[loadKey]=String(suggested);const hint=$('previousLoadHint');if(hint)hint.textContent='Última carga registrada'}persistWorkoutState()};
  $('loadDown').onclick=()=>adjustLoad(loadKey,-2.5);$('loadUp').onclick=()=>adjustLoad(loadKey,2.5);
  $('skipExercise').onclick=skipCurrentExercise;
  $('pauseRest').onclick=toggleRestPause;$('exitSession').onclick=exitSessionToHome;
 }
 function adjustLoad(loadKey,delta){
  const input=$('sessionLoad');if(!input)return;
  const value=Number(input.value||0),next=Math.max(0,value+delta);
  input.value=Number(next.toFixed(2));input.dataset.userEdited='true';sessionLoads[loadKey]=input.value;
 }
 async function enableWorkoutNotifications(){
  if(!('Notification' in window)){notificationsAllowed=false;return}
  try{if(Notification.permission==='granted')notificationsAllowed=true;else if(Notification.permission==='default')notificationsAllowed=(await Notification.requestPermission())==='granted';else notificationsAllowed=false}catch(_){notificationsAllowed=false}
 }
 function toggleRestPause(){
  if(!activeRest)return;
  const button=$('pauseRest');
  if(activeRest.paused){
   activeRest.deadline=Date.now()+activeRest.remaining*1000;activeRest.paused=false;
   if(button){button.setAttribute('aria-label','Pausar descanso');button.title='Pausar descanso';button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>'}
   timer=setInterval(tickRestTimer,250);tickRestTimer();
  }else{
   activeRest.remaining=Math.max(0,Math.ceil((activeRest.deadline-Date.now())/1000));activeRest.paused=true;
   if(timer)clearInterval(timer);timer=null;
   if(button){button.setAttribute('aria-label','Continuar descanso');button.title='Continuar descanso';button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7z"/></svg>'}
   tickRestTimer();
  }
  if(activeRest){restSnapshot={deadline:activeRest.deadline,total:activeRest.total,remaining:activeRest.remaining,paused:activeRest.paused,nextText:activeRest.nextText,notified:activeRest.notified,itemIndex:sessionIndex};persistWorkoutState()}
 }
 function tickRestTimer(){
  if(!activeRest)return;
  const remaining=activeRest.paused?activeRest.remaining:Math.max(0,Math.ceil((activeRest.deadline-Date.now())/1000));
  const clock=$('restClock');if(clock){const m=Math.floor(remaining/60),s=remaining%60;clock.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
  const dial=$('restDial');if(dial)dial.style.setProperty('--progress',String(Math.max(0,Math.min(100,remaining/Math.max(1,activeRest.total)*100))));
  if(activeRest.paused||remaining>0)return;
  const rest=activeRest;
  if(!rest.notified){
   rest.notified=true;persistWorkoutState();
   if(notificationsAllowed){try{const notice=new Notification('Descanso finalizado',{body:rest.nextText,tag:'nexfit-rest-'+(session?.id||'active')});notice.onclick=()=>{try{window.focus()}catch(_){};if(session)tickRestTimer();else home()}}catch(_){}}
   if(navigator.vibrate)navigator.vibrate([180,80,180]);
   const text=$('nextStepText');if(text)text.textContent='Descanso concluído. '+rest.nextText;
  }
  rest.advance();
 }
 document.addEventListener('visibilitychange',()=>{if(activeRest)tickRestTimer()});
 async function skipCurrentSet(){
  if(!session){setExecutionFeedback('A sessão de treino não está ativa.','error');return}
  const item=sessionPlan[sessionIndex];if(!item){setExecutionFeedback('Não foi possível identificar a série atual.','error');return}if(hasSetLog(item.exercise.id,item.setIndex+1)){setExecutionFeedback('Esta série já consta como registrada.','error');return}
  if(!confirm('Não conseguiu realizar esta série? Vamos registrá-la com 0 repetições e 0 kg. As outras séries do exercício continuarão normalmente.')){setExecutionFeedback('Ação cancelada.');return}
  const row={session_id:session.id,exercise_id:item.exercise.id,set_number:item.setIndex+1,reps_completed:0,load_kg:0,notes:'Série pulada pelo atleta'};
  setExecutionFeedback('Registrando série como não realizada…');
  try{const {error}=await dbRef().from('training_set_logs').insert(row);if(error)throw new Error(error.message)}
  catch(error){setExecutionFeedback('Falha ao salvar no Supabase: '+(error?.message||'verifique a conexão.'),'error');return alert('Não foi possível registrar a série como não realizada: '+(error?.message||'erro inesperado.'))}
  sessionSetLogs.push(row);skippedSetKeys.add(item.exercise.id+':'+(item.setIndex+1));persistWorkoutState();setExecutionFeedback('Série marcada como não realizada.','success');advanceAfterSet(item);
 }
 function skipCurrentExercise(){
  if(!session)return;
  const item=sessionPlan[sessionIndex];if(!item)return;
  if(!confirm('Marcar "'+item.exercise.name+'" como não executado e voltar à lista de exercícios?'))return;
  skippedExerciseIndices.add(item.exerciseIndex);
  for(const planItem of sessionPlan.filter(x=>x.exerciseIndex===item.exerciseIndex&&!hasSetLog(x.exercise.id,x.setIndex+1)))skippedSetKeys.add(planItem.exercise.id+':'+(planItem.setIndex+1));
  renderExercisePicker();
 }
 function hasSetLog(exerciseId,setNumber){
  return sessionSetLogs.some(x=>x.exercise_id===exerciseId&&Number(x.set_number)===Number(setNumber));
 }
 function exerciseProgress(index){
  const exercise=sessionExerciseRows[index],sets=exercise?.sets||[];
  const logForSet=(setNumber)=>sessionSetLogs.find(x=>x.exercise_id===exercise.id&&Number(x.set_number)===Number(setNumber));
  const done=sets.filter((_,i)=>{const row=logForSet(i+1);return row&&Number(row.reps_completed)>0}).length;
  const skipped=sets.filter((_,i)=>skippedSetKeys.has(exercise.id+':'+(i+1))||Number(logForSet(i+1)?.reps_completed)===0).length;
  const status=done===sets.length&&sets.length?'done':done?'partial':skipped===sets.length&&sets.length?'skipped':skipped?'partial':'pending';
  return {done,total:sets.length,skipped,status};
 }
 function renderExercisePicker(){
  if(!session)return;
  sessionView='picker';
  const sub=subworkouts.find(s=>s.id===session.subworkout_id);
  let cards=sessionExerciseRows.map((e,index)=>{
   const p=exerciseProgress(index),label=p.status==='done'?'Feito':p.status==='skipped'?'Não executado':p.status==='partial'?'Parcial':'Pendente';
   const color=p.status==='done'?'#b7f34a':p.status==='skipped'?'#ff7a7a':'#91a0af';
   const summary=(e.sets||[]).map(x=>x.reps==='MR'?'MR':x.reps+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':'')).join(' / ');
   return '<div class="item"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><strong style="font-size:17px">'+(index+1)+'. '+esc(normalizeHumanText(e.name))+'</strong><span class="tag" style="color:'+color+'">'+label+'</span></div><p class="muted">'+p.done+'/'+p.total+' séries · '+summary+' · descanso '+(e.rest_seconds||0)+' s</p>'+(p.status!=='done'?'<button type="button" class="btn" data-begin-ex="'+index+'">'+(p.status==='partial'||p.status==='skipped'?'Continuar exercício':'Iniciar exercício')+'</button><span class="exercise-status-actions"><button type="button" class="exercise-status-icon" data-mark-done="'+index+'" aria-label="Marcar como feito" title="Marcar como feito"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></svg></button><button type="button" class="exercise-status-icon skipped" data-mark-skipped="'+index+'" aria-label="Marcar como não executado" title="Marcar como não executado"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/></svg></button></span>':'')+'</div>';
  }).join('');
  shell('Escolha o próximo exercício','<div class="panel"><h3>'+esc(normalizeHumanText(current.title))+' · '+esc(normalizeHumanText(sub?.title||'Treino'))+'</h3><p class="muted">Escolha qualquer exercício disponível. Se o aparelho estiver ocupado, marque como não executado e continue com outro.</p>'+cards+'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="finishWorkout">Finalizar treino</button><button class="btn alt" id="cancelSession">Sair sem finalizar</button></div></div>');
  section.querySelectorAll('[data-begin-ex]').forEach(b=>b.onclick=()=>beginExercise(Number(b.dataset.beginEx)));
  section.querySelectorAll('[data-mark-done]').forEach(b=>b.onclick=()=>markExerciseDone(Number(b.dataset.markDone)));
  section.querySelectorAll('[data-mark-skipped]').forEach(b=>b.onclick=()=>markExerciseNotDone(Number(b.dataset.markSkipped)));
  $('finishWorkout').onclick=()=>{const unfinished=sessionExerciseRows.map((_,i)=>exerciseProgress(i)).filter(x=>x.status!=='done').length;if(unfinished&&!confirm(unfinished+' exercício(s) ainda não estão marcados como feitos. Eles aparecerão como não executados/parciais no histórico. Finalizar mesmo assim?'))return;finishSession()};
  $('cancelSession').onclick=exitSessionToHome;
 }
 async function exitSessionToHome(){
  if(!session)return;
  if(!confirm('Quer encerrar este treino agora? Se escolher sair, as séries já registradas nesta sessão também serão apagadas. Se preferir continuar, seu treino ficará salvo para você retomar.'))return;
  const db=dbRef(),sessionId=session.id;
  const {error:logsError}=await db.from('training_set_logs').delete().eq('session_id',sessionId);
  if(logsError)return alert('Não foi possível cancelar o treino e apagar as séries registradas: '+logsError.message);
  const {error:sessionError}=await db.from('training_sessions').delete().eq('id',sessionId).eq('athlete_id',userRef().id);
  if(sessionError)return alert('As séries foram apagadas, mas não foi possível remover a sessão. Tente novamente ou contate o suporte: '+sessionError.message);
  clearPersistedWorkout();restSnapshot=null;
  if(timer)clearInterval(timer);
  timer=null;activeRest=null;session=null;sessionPlan=[];sessionIndex=0;sessionExerciseRows=[];sessionLoads={};sessionSetLogs=[];skippedSetKeys.clear();skippedExerciseIndices.clear();
  const homeButton=document.querySelector('.nav button[data-page="home"]');
  if(homeButton){homeButton.click();return}
  document.querySelectorAll('.page').forEach(page=>page.classList.toggle('active',page.id==='home'));
 }
 function beginExercise(index){
  if(index<0||index>=sessionExerciseRows.length)return;
  skippedExerciseIndices.delete(index);
  const exercise=sessionExerciseRows[index];
  for(let i=0;i<(exercise.sets||[]).length;i++)skippedSetKeys.delete(exercise.id+':'+(i+1));
  const first=sessionPlan.findIndex(x=>x.exerciseIndex===index&&!hasSetLog(x.exercise.id,x.setIndex+1));
  if(first<0)return renderExercisePicker();
  sessionIndex=first;shell('Executando exercício','<div id="sessionExercises"></div>');renderSessionStep();
 }
 async function markExerciseDone(index){
  const exercise=sessionExerciseRows[index];if(!exercise)return;
  const pending=sessionPlan.filter(x=>x.exerciseIndex===index&&!hasSetLog(x.exercise.id,x.setIndex+1));
  if(!pending.length)return renderExercisePicker();
  if(!confirm('Marcar "'+exercise.name+'" como feito usando as repetições e cargas programadas? Você poderá ajustar os valores no histórico.'))return;
  const rows=[];
  for(const item of pending){
   let reps=item.set.reps;
   if(reps==='MR'){const value=prompt('Quantas repetições você realizou na série '+(item.setIndex+1)+' de '+exercise.name+'?');if(value===null)return;if(!Number(value)||Number(value)<1)return alert('Informe um número de repetições válido.');reps=Number(value)}
   rows.push({session_id:session.id,exercise_id:exercise.id,set_number:item.setIndex+1,reps_completed:Number(reps),load_kg:item.set.load_kg??null});
  }
  const {error}=await dbRef().from('training_set_logs').insert(rows);
  if(error)return alert('Não foi possível marcar o exercício como feito: '+error.message);
  sessionSetLogs.push(...rows);skippedExerciseIndices.delete(index);
  for(const row of rows)skippedSetKeys.delete(row.exercise_id+':'+row.set_number);
  renderExercisePicker();
 }
 function markExerciseNotDone(index){
  const exercise=sessionExerciseRows[index];if(!exercise)return;
  if(!confirm('Marcar "'+exercise.name+'" como não executado?'))return;
  skippedExerciseIndices.add(index);
  for(let i=0;i<(exercise.sets||[]).length;i++)if(!hasSetLog(exercise.id,i+1))skippedSetKeys.add(exercise.id+':'+(i+1));
  renderExercisePicker();
 }
 function advanceAfterSet(item){
  sessionIndex++;restSnapshot=null;persistWorkoutState();
  const next=sessionPlan[sessionIndex];
  if(next&&next.exerciseIndex===item.exerciseIndex)renderSessionStep();else renderExercisePicker();
 }
 async function completeCurrentSet(){
  if(savingSet){setExecutionFeedback('Já existe um registro de série em andamento.');return}
  if(!session){setExecutionFeedback('A sessão de treino não está ativa. Volte à lista de exercícios.','error');return alert('A sessão de treino não está ativa. Volte à lista de exercícios e tente novamente.')}
  const item=sessionPlan[sessionIndex],button=$('completeSet');
  if(!item){setExecutionFeedback('Não foi possível identificar a série atual.','error');return alert('Não foi possível identificar a série atual. Atualize a tela do exercício antes de continuar.')}
  const repsInput=$('sessionReps');
  const reps=repsInput?repsInput.value.trim():String(item.set.reps??'');
  const load=$('sessionLoad')?.value.trim()??'';
  if(!reps||reps==='MR'||Number(reps)<1){setExecutionFeedback('Informe as repetições realizadas.','error');return alert('Informe as repetições realizadas.')}
  if(load!==''&&!Number.isFinite(Number(load))){setExecutionFeedback('Informe uma carga válida.','error');return alert('Informe uma carga válida.')}
  if(load!=='')sessionLoads[item.exercise.id+':'+item.setIndex]=load;
  const row={session_id:session.id,exercise_id:item.exercise.id,set_number:item.setIndex+1,reps_completed:Number(reps),load_kg:load===''?(item.set.load_kg??null):Number(load)};
  savingSet=true;if(button)button.disabled=true;setExecutionFeedback('Dados válidos. Enviando série ao Supabase…');
  try{
   const {error}=await dbRef().from('training_set_logs').insert(row);
   if(error)throw new Error(error.message);
   sessionSetLogs.push(row);skippedSetKeys.delete(item.exercise.id+':'+(item.setIndex+1));persistWorkoutState();setExecutionFeedback('Série registrada com sucesso. Preparando o descanso…','success');
  }catch(error){
   if(button)button.disabled=false;
   setExecutionFeedback('Falha ao salvar no Supabase: '+(error?.message||'verifique a conexão.'),'error');alert('Não foi possível registrar a série. '+(error?.message||'Verifique sua conexão e tente novamente.'));
   return;
  }finally{savingSet=false}
  const rest=parseRestSeconds(item.exercise.rest_seconds),panel=$('restPanel'),complete=$('completeSet');
  if(complete)complete.disabled=true;
  const actions=document.querySelector('.execution-actions'),skipExercise=$('skipExercise');
  if(actions)actions.hidden=true;if(skipExercise)skipExercise.hidden=true;
  if(!rest){advanceAfterSet(item);return}
  if(!panel){alert('Série registrada, mas não foi possível abrir o painel de descanso.');advanceAfterSet(item);return}
  panel.hidden=false;const deadline=Date.now()+rest*1000;
  const next=sessionPlan[sessionIndex+1],sameExercise=next&&next.exerciseIndex===item.exerciseIndex;
  const nextLoad=next?.set.load_kg??(sameExercise?(sessionLoads[next.exercise.id+':'+item.setIndex]??null):null);
  const nextText=sameExercise?'Próxima: série '+(next.setIndex+1)+' de '+next.exercise.name+' · '+(next.set.reps==='MR'?'MR':next.set.reps+' reps')+' · carga '+(nextLoad==null?'a informar':nextLoad+' kg'):next?'Exercício concluído. Após o descanso, escolha qual exercício iniciar.':'Último descanso do treino.';
  $('nextStepText').textContent=nextText;
  const advance=()=>{if(timer)clearInterval(timer);timer=null;activeRest=null;advanceAfterSet(item)};
  activeRest={deadline,total:rest,remaining:rest,paused:false,advance,nextText,notified:false};restSnapshot={deadline,total:rest,remaining:rest,paused:false,nextText,notified:false,itemIndex:sessionIndex};persistWorkoutState();
  $('skipRest').onclick=advance;
  timer=setInterval(tickRestTimer,250);tickRestTimer();
 }
 async function startSession(subId){
  const db=dbRef(),sub=subworkouts.find(s=>s.id===subId);
  const ex=await db.from('training_exercises').select('*').eq('subworkout_id',subId).order('position');
  if(ex.error)return alert(ex.error.message);
  if(!ex.data?.length)return alert('Este treino ainda não possui exercícios.');
  await enableWorkoutNotifications();
  const {data,error}=await db.from('training_sessions').insert({athlete_id:userRef().id,program_id:current.id,version_id:version.id,subworkout_id:subId}).select().single();
  if(error)return alert(error.message);
  session=data;sessionExerciseRows=ex.data;sessionView='picker';sessionPlan=[];sessionSetLogs=[];skippedSetKeys=new Set();skippedExerciseIndices=new Set();
  await preloadPreviousLoads(ex.data);
  ex.data.forEach((exercise,exerciseIndex)=>(exercise.sets||[]).forEach((set,setIndex)=>sessionPlan.push({exercise,exerciseIndex,set,setIndex})));
  sessionIndex=0;sessionLoads={};persistWorkoutState();renderExercisePicker();
 }
 async function finishSession(){
  if(!session)return;
  restSnapshot=null;
  if(timer)clearInterval(timer);timer=null;activeRest=null;
  const {error}=await dbRef().from('training_sessions').update({status:'completed',finished_at:new Date().toISOString()}).eq('id',session.id).eq('athlete_id',userRef().id);
  if(error)return alert('Não foi possível finalizar a sessão: '+error.message);
  clearPersistedWorkout();
  const started=new Date(session.started_at||Date.now()),minutes=Math.max(1,Math.round((Date.now()-started.getTime())/60000));
  const sub=subworkouts.find(s=>s.id===session.subworkout_id),date=new Date().toISOString().slice(0,10);
  const notes=current.title+' · '+(sub?.title||'Treino')+' [NEXFIT_SESSION:'+session.id+']';
  const {data:activity,error:activityError}=await dbRef().from('activities').insert({user_id:userRef().id,sport:'Musculação',activity_date:date,duration_minutes:minutes,distance_km:null,notes}).select().single();
  if(activityError)alert('Treino finalizado, mas não foi possível criar a atividade no histórico: '+activityError.message);
  else{if(typeof activities!=='undefined'&&typeof render==='function'){activities.unshift({id:activity.id,sport:activity.sport,date:activity.activity_date,duration:activity.duration_minutes,distance:0,notes:activity.notes||''});render()}alert('Treino concluído! Todas as séries foram salvas e o treino foi registrado no histórico.')}
  session=null;sessionPlan=[];sessionExerciseRows=[];home();
 }
 window.beginStrengthActivity=async function(){
  const db=dbRef(),u=userRef();if(!db||!u)return alert('Faça login para iniciar um treino.');
  const q=await db.from('training_programs').select('*').eq('athlete_id',u.id).eq('status','active').order('updated_at',{ascending:false});
  if(q.error)return alert(q.error.message);
  const available=(q.data||[]).filter(p=>{const match=(p.description||'').match(/\[MODALIDADE:\s*([^\]]+)\]/i);return !match||match[1].trim().toLowerCase()==='musculação'});
  if(!available.length)return alert('Você ainda não possui um programa de musculação ativo. Acesse a aba Musculação para criar seu programa.');
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section));
  const showPrograms=()=>{
   shell('Escolha seu programa','<div class="panel"><p class="muted">Selecione o programa que você vai executar agora.</p>'+available.map((p,i)=>'<div class="item"><strong>'+esc(normalizeHumanText(p.title))+'</strong><p class="muted">'+esc((p.description||'').replace(/\[MODALIDADE:[^\]]+\]\s*/i,''))+'</p><button class="btn" data-select-program="'+p.id+'">Escolher programa</button></div>').join('')+'</div>');
   section.querySelectorAll('[data-select-program]').forEach(button=>button.onclick=()=>chooseProgram(button.dataset.selectProgram));
  };
  const chooseProgram=async id=>{
   const program=available.find(p=>String(p.id)===String(id));if(!program)return;
   const vq=await db.from('training_program_versions').select('*').eq('id',program.current_version_id).maybeSingle();
   if(vq.error||!vq.data)return alert('Não foi possível localizar a versão vigente deste programa.');
   const sq=await db.from('training_subworkouts').select('*').eq('version_id',vq.data.id).order('position');
   if(sq.error)return alert(sq.error.message);
   if(!sq.data?.length)return alert('Este programa ainda não possui treinos. Adicione A, B, C… na aba Musculação.');
   current=program;version=vq.data;subworkouts=sq.data;
   shell('Qual treino você vai executar?','<div class="panel"><p class="muted">'+esc(program.title)+' · Escolha seu treino de hoje.</p>'+sq.data.map((s,i)=>'<div class="item"><strong style="font-size:18px">'+esc(normalizeHumanText(s.title))+'</strong><p class="muted">'+esc(s.description||'Treino '+(i+1))+'</p><button class="btn" data-start-selected="'+s.id+'">Começar este treino</button></div>').join('')+'<button class="btn alt" id="backPrograms">Escolher outro programa</button></div>');
   section.querySelectorAll('[data-start-selected]').forEach(button=>button.onclick=()=>startSession(button.dataset.startSelected));
   $('backPrograms').onclick=showPrograms;
  };
  if(available.length===1)chooseProgram(available[0].id);else showPrograms();
 };
 home();
})();