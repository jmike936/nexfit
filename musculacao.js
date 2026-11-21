/* NEXFIT | Musculação — programas versionados */
(()=>{
 if(window.__nexfitStrengthLoaded||window.__nexfitStrengthLoading)return;window.__nexfitStrengthLoading=true;
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
 #strengthPage .execution-media{display:block;width:100%;height:clamp(180px,42vw,320px);object-fit:contain;background:#111610;border-radius:14px;margin:0 0 10px}
 #strengthPage .execution-media-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 12px}
 #strengthPage .execution-media-pair figure{min-width:0;margin:0;padding:7px;border:1px solid #28342b;border-radius:12px;background:#111610}
 #strengthPage .execution-media-pair img{display:block;width:100%;height:clamp(150px,38vw,240px);object-fit:contain}
 #strengthPage .execution-media-pair figcaption{padding:5px 0 0;color:#a0a99c;text-align:center;font-size:11px}
 #strengthPage .execution-image-unavailable{display:grid;place-items:center;min-height:120px;padding:12px;color:#a0a99c;text-align:center;font-size:12px}
 #strengthPage .execution-muscle-map{margin:12px 0;padding:12px;border:1px solid #28342b;border-radius:14px;background:#121812}
 #strengthPage .execution-muscle-map h3{margin:0 0 6px;font-size:14px}
 #strengthPage .execution-muscle-map>p{margin:0 0 10px;color:#a0a99c;font-size:12px}
 #strengthPage .execution-muscle-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
 #strengthPage .execution-muscle-summary>div{padding:10px;border:1px solid #29372b;border-radius:10px;background:#101610}
 #strengthPage .execution-muscle-summary strong{display:block;margin-bottom:4px;font-size:12px}
 #strengthPage .execution-muscle-summary p{margin:0;color:#e5ebdf;font-size:13px;line-height:1.45}
 #strengthPage .execution-muscle-summary .primary strong{color:#b7f34a}
 #strengthPage .execution-muscle-summary .secondary strong{color:#e5b34e}
 #strengthPage .execution-muscle-map details{margin-top:9px;border-top:1px solid #29372b;padding-top:8px}
 #strengthPage .execution-muscle-map summary{color:#c8d2c4;font-size:12px;cursor:pointer}
 #strengthPage .muscle-map-svg{display:block;width:100%;max-height:175px;margin-top:8px}
 #strengthPage .muscle-map-svg .body-base{fill:#59645b;stroke:#89948a;stroke-width:1.2}
 #strengthPage .muscle-map-svg .muscle-region{fill:#313c32;stroke:#687568;stroke-width:.8;opacity:.95}
 #strengthPage .muscle-map-svg .muscle-region.primary{fill:#b7f34a;stroke:#d5ff8b}
 #strengthPage .muscle-map-svg .muscle-region.secondary{fill:#e5a83b;stroke:#ffd27d}
 #strengthPage .muscle-map-legend{display:flex;gap:12px;flex-wrap:wrap;color:#a0a99c;font-size:11px}
 #strengthPage .muscle-map-legend span{display:inline-flex;align-items:center;gap:5px}
 #strengthPage .muscle-map-legend i{width:9px;height:9px;border-radius:50%;background:#b7f34a}
 #strengthPage .muscle-map-legend span+span i{background:#e5a83b}
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


 #strengthPage .workout-dialog-backdrop{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:#05090dcc;backdrop-filter:blur(5px)}
 #strengthPage .workout-dialog{width:min(100%,440px);padding:24px 20px 20px;border:1px solid #354454;border-radius:20px;background:linear-gradient(145deg,#202b37,#121a22);box-shadow:0 24px 80px #0009;color:#f4f7fa;text-align:center}
 #strengthPage .workout-dialog-mark{display:grid;place-items:center;width:48px;height:48px;margin:0 auto 14px;border:1px solid #526b32;border-radius:50%;color:#b7f34a;font-size:24px;font-weight:800}
 #strengthPage .workout-dialog-mark.danger{border-color:#814747;color:#ff8989}
 #strengthPage .workout-dialog h2{margin:0;font-size:21px}
 #strengthPage .workout-dialog p{margin:10px 0 18px;color:#aeb9c5;font-size:14px;line-height:1.55}
 #strengthPage .workout-dialog-input-label{display:block;margin:0 0 6px;color:#aeb9c5;text-align:left;font-size:12px}
 #strengthPage .workout-dialog .workout-dialog-input{width:100%;margin-bottom:12px;padding:12px;border:1px solid #526b32;border-radius:11px;background:#111922;color:#fff;font-size:18px}
 #strengthPage .workout-dialog-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:20px}
 #strengthPage .workout-dialog-actions button{min-height:46px;padding:10px;border-radius:11px;font-weight:800;cursor:pointer}
 #strengthPage .workout-dialog-cancel{border:1px solid #435365;background:transparent;color:#f4f7fa}
 #strengthPage .workout-dialog-confirm{border:0;background:#b7f34a;color:#141a0d}
 #strengthPage .workout-dialog-confirm.danger{background:#ff8585;color:#241010}

 #strengthPage .completion-screen{max-width:620px;margin:18px auto;padding:24px 18px 30px;text-align:center;color:#f4f7fa}
 #strengthPage .completion-mark{width:82px;height:82px;display:grid;place-items:center;margin:8px auto 18px;border:1px solid #526b32;border-radius:50%;background:radial-gradient(circle,#b7f34a24,#b7f34a08);color:#b7f34a;box-shadow:0 0 42px #b7f34a18}
 #strengthPage .completion-mark svg{width:42px;height:42px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
 #strengthPage .completion-screen h1{margin:0;font-size:clamp(27px,6vw,36px);line-height:1.15;letter-spacing:-.8px}
 #strengthPage .completion-subtitle{max-width:430px;margin:10px auto 22px;color:#a0a99c;font-size:14px;line-height:1.6}
 #strengthPage .completion-workout{margin:0 0 14px;color:#b7f34a;font-size:13px;font-weight:800}
 #strengthPage .completion-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:18px 0}
 #strengthPage .completion-stat{min-height:88px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:12px 8px;border:1px solid #303a30;border-radius:14px;background:linear-gradient(145deg,#1d271f,#151b17)}
 #strengthPage .completion-stat strong{font-size:24px;line-height:1.1}
 #strengthPage .completion-stat span{color:#a0a99c;font-size:11px}
 #strengthPage .completion-sync{display:flex;align-items:flex-start;gap:9px;margin:16px 0;padding:12px;border:1px solid #526b32;border-radius:12px;background:#18221a;color:#d5ff7b;text-align:left;font-size:12px;line-height:1.5}
 #strengthPage .completion-sync.pending{border-color:#665b32;background:#282418;color:#f2d88a}
 #strengthPage .completion-actions{display:grid;gap:9px;margin-top:20px}
 #strengthPage .completion-actions button{width:100%;min-height:48px;border-radius:13px;padding:12px 16px;font-weight:800}
 #strengthPage .completion-primary{border:0;background:#b7f34a;color:#141a0d}
 #strengthPage .completion-secondary{border:1px solid #354454;background:transparent;color:#f4f7fa}
 @media(max-width:420px){#strengthPage .completion-screen{padding:14px 4px 24px}#strengthPage .completion-stat{min-height:80px}}

 @media(max-width:600px){#strengthPage .execution-screen{padding:6px 0 12px}#strengthPage .execution-media{height:clamp(175px,52vw,270px)}#strengthPage .execution-stat{min-height:70px}#strengthPage .execution-stat>strong{font-size:21px}#strengthPage .execution-exercise-heading h2{font-size:20px}}
 `;
 const st=document.createElement('style');st.textContent=css;document.head.append(st);
 const nav=document.querySelector('.nav');if(!nav){window.__nexfitStrengthLoading=false;window.__nexfitStrengthError='Navegação principal não encontrada.';console.error('[NEXFIT] Módulo de musculação: navegação principal não encontrada.');return;}
 const tab=nav.querySelector('[data-page="strengthPage"]');if(!tab){window.__nexfitStrengthLoading=false;window.__nexfitStrengthError='Botão Treinos não encontrado na navegação.';console.error('[NEXFIT] Módulo de musculação: botão Treinos não encontrado.');return;}
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
  finally{handlingSetAction=false;const restPanel=$('restPanel');if(button.isConnected&&(!restPanel||restPanel.hidden))button.disabled=false}
 });
 function normalizeHumanText(value){
 const text=String(value??'').normalize('NFC').replace(/\s+/gu,' ').trim();
 if(!text)return '';
 const acronyms=new Set(['NEXFIT','HIIT','AMRAP','BCAA','TRX','MR','RM','PR','PB','ABC','API','CPF','CNPJ','URL','PDF']);
 const lower=text.toLocaleLowerCase('pt-BR');
 let first=true;
 return lower.replace(/[\p{L}\p{M}]+/gu,word=>{
  const upper=word.toLocaleUpperCase('pt-BR');
  if(acronyms.has(upper))return upper;
  if(first){first=false;return word.charAt(0).toLocaleUpperCase('pt-BR')+word.slice(1)}
  return word;
 });
}
 const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let plans=[],current=null,version=null,subworkouts=[],session=null,timer=null,activeRest=null,activeExerciseTimer=null,lastExerciseTimerPersistedSecond=-1,notificationsAllowed=false,showArchivedPlans=false,activeTrainingTab='mine',editorSubworkoutId=null,savingSet=false,savingSetOwner=null,finishingSession=false,finishingSessionOwner=null,workoutSyncPromises=new Map();
 const dbRef=()=>window.db||db, userRef=()=>window.currentUser||currentUser;
 function canManageProgramLocally(p){const u=userRef();return !!u&&(p.athlete_id===u.id||p.created_by===u.id)}
 const editIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>';
 const trashIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>';
 function go(){if(typeof window.go==='function')window.go('strengthPage');else{document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section))}home()}
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
  const renderUserId=userRef()?.id,renderDb=dbRef(),isSameAccount=()=>userRef()?.id===renderUserId;
  if(!renderUserId||!renderDb)return;
  if(activeTrainingTab==='models'){
   const models=plans.filter(p=>!canManageProgramLocally(p)&&p.status==='active'&&p.is_public===true&&p.current_version_id);
   if(!models.length){host.innerHTML='<div class="training-empty"><div class="training-empty-icon">✦</div><h3>Explore programas públicos</h3><p class="muted">Ainda não há programas públicos disponíveis. Quando alguém compartilhar um programa, ele aparecerá aqui.</p></div>';return}
   const cards=[];
   for(const p of models){
    const q=await renderDb.from('training_subworkouts').select('id,title,training_exercises(id)').eq('version_id',p.current_version_id).order('position');
    if(!isSameAccount())return;
    if(q.error)continue;
    const workouts=q.data||[],exerciseCount=workouts.reduce((n,w)=>n+(w.training_exercises||[]).length,0);
    const category=programCategory(p.description);
    const description=(p.description||'').replace(/\[MODALIDADE:[^\]]+\]\s*/i,'').trim();
    cards.push('<article class="training-card model-program-card"><div class="training-card-main"><div class="training-card-placeholder" aria-hidden="true"><span>✦</span></div><span class="training-card-copy"><strong>'+esc(normalizeHumanText(p.title))+'</strong><span>'+esc(category)+(description?' · '+esc(description):'')+'</span><small>'+workouts.length+' '+(workouts.length===1?'treino':'treinos')+' · '+exerciseCount+' '+(exerciseCount===1?'exercício':'exercícios')+'</small></span></div><div class="model-workout-preview">'+workouts.slice(0,4).map((w,i)=>'<span>'+esc(w.title||'Treino '+(i+1))+'</span>').join('')+'</div><button class="btn model-copy-button" data-copy-public="'+esc(p.id)+'">Adicionar ao meu perfil</button></article>');
   }
   if(!isSameAccount())return;
   host.innerHTML=cards.length?'<div class="training-list">'+cards.join('')+'</div>':'<div class="training-empty"><h3>Nenhum modelo público disponível</h3></div>';
   host.querySelectorAll('[data-copy-public]').forEach(b=>b.onclick=()=>copyPublicProgram(b.dataset.copyPublic,renderUserId,renderDb));
   return;
  }
  if(!navigator.onLine||window.__nexfitOfflineMode){
   let cached=[];try{cached=JSON.parse(localStorage.getItem('nexfit-offline-workouts:'+String(renderUserId))||'[]')}catch(_){}
   if(!cached.length){host.innerHTML='<div class="training-empty"><h3>Treinos disponíveis offline</h3><p class="muted">Abra esta tela com internet pelo menos uma vez para guardar seus programas neste aparelho.</p></div>';return}
   host.innerHTML='<p class="muted">Modo offline · programas guardados neste aparelho</p><div class="training-list">'+cached.map(x=>'<article class="training-card"><button class="training-card-main" data-offline-workout="'+esc(x.subworkout.id)+'"><div class="training-card-placeholder">↻</div><span class="training-card-copy"><strong>'+esc(normalizeHumanText(x.subworkout.title||'Treino'))+'</strong><small>'+esc(normalizeHumanText(x.program.title||'Programa'))+' · '+(x.exercises||[]).length+' exercícios</small></span><span class="training-chevron">›</span></button></article>').join('')+'</div>';
   host.querySelectorAll('[data-offline-workout]').forEach(b=>b.onclick=()=>startOfflineWorkout(b.dataset.offlineWorkout,renderUserId));
   return;
  }
  window.__nexfitOfflineMode=false;
  const programs=plans.filter(p=>canManageProgramLocally(p)&&p.status==='active'&&p.current_version_id);
  if(!programs.length){host.innerHTML='<div class="training-empty"><h3>Nenhum treino ativo</h3><p class="muted">Crie um programa e adicione seus treinos no gerenciador.</p></div>';return}
  const workouts=[];
  for(const p of programs){
   const q=await renderDb.from('training_subworkouts').select('id,title,description,position,training_exercises(*)').eq('version_id',p.current_version_id).order('position');
   if(!isSameAccount())return;
   if(q.error)continue;
   const versionQuery=await renderDb.from('training_program_versions').select('*').eq('id',p.current_version_id).maybeSingle();
   if(!isSameAccount())return;
   if(versionQuery.error||!versionQuery.data)continue;
   for(const workout of q.data||[]){
    const exercises=workout.training_exercises||[];
    workouts.push({program:p,workout,exercises});
    try{
     const key='nexfit-offline-workouts:'+String(renderUserId);
     const snapshots=JSON.parse(localStorage.getItem(key)||'[]');
     const snapshot={program:p,version:versionQuery.data,subworkouts:q.data.map(({training_exercises,...sub})=>sub),subworkout:{id:workout.id,title:workout.title,description:workout.description,position:workout.position},exercises};
     const next=snapshots.filter(x=>String(x.subworkout?.id)!==String(workout.id));next.push(snapshot);
     localStorage.setItem(key,JSON.stringify(next));
    }catch(error){console.warn('Não foi possível atualizar o cache offline do treino',error)}
   }
  }
  if(!isSameAccount())return;
  const activitiesQ=await renderDb.from('activities').select('activity_date,notes').eq('user_id',renderUserId).eq('sport','Musculação').order('activity_date',{ascending:false}).limit(500);
  if(!isSameAccount())return;
  if(activitiesQ.error){host.innerHTML='<div class="training-empty"><h3>Não foi possível carregar as últimas execuções</h3><p class="muted">'+esc(activitiesQ.error.message)+'</p></div>';return}
  const activityDateBySession=new Map((activitiesQ.data||[]).map(activity=>({
   sessionId:(activity.notes||'').match(/\[NEXFIT_SESSION:([a-f0-9-]+)\]/i)?.[1],
   date:String(activity.activity_date||'').slice(0,10)
  })).filter(item=>item.sessionId&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)).map(item=>[item.sessionId,item.date]));
  const sessionIds=[...activityDateBySession.keys()];
  const history=sessionIds.length?await renderDb.from('training_sessions').select('id,program_id,subworkout_id').eq('athlete_id',renderUserId).eq('status','completed').not('finished_at','is',null).in('id',sessionIds):{data:[],error:null};
  if(!isSameAccount())return;
  if(history.error){host.innerHTML='<div class="training-empty"><h3>Não foi possível carregar as últimas execuções</h3><p class="muted">'+esc(history.error.message)+'</p></div>';return}
  const historicalSubworkoutIds=[...new Set((history.data||[]).map(item=>item.subworkout_id).filter(Boolean))];
  const historicalSubworkouts=historicalSubworkoutIds.length?await renderDb.from('training_subworkouts').select('id,title,identity_id').in('id',historicalSubworkoutIds):{data:[],error:null};
  if(!isSameAccount())return;
  if(historicalSubworkouts.error){host.innerHTML='<div class="training-empty"><h3>Não foi possível relacionar as execuções anteriores</h3><p class="muted">'+esc(historicalSubworkouts.error.message)+'</p></div>';return}
  const historicalById=new Map((historicalSubworkouts.data||[]).map(item=>[String(item.id),{
   identityId:String(item.identity_id||''),
   title:String(item.title||'').trim().toLocaleLowerCase('pt-BR')
  }]));
  const workoutHistoryKey=(programId,kind,value)=>String(programId)+'|'+kind+'|'+String(value||'');
  const lastExecution=new Map();
  for(const item of history.data||[]){
   const date=activityDateBySession.get(item.id),historical=historicalById.get(String(item.subworkout_id));
   if(!item.subworkout_id||!historical||!date)continue;
   const keys=[];
   if(historical.identityId)keys.push(workoutHistoryKey(item.program_id,'identity',historical.identityId));
   // Compatibilidade: versões criadas antes da identidade estável receberam UUIDs independentes.
   if(historical.title)keys.push(workoutHistoryKey(item.program_id,'legacy-title',historical.title));
   for(const key of keys){
    const previous=lastExecution.get(key);
    if(!previous||date>previous)lastExecution.set(key,date);
   }
  }
  const lastExecutionForWorkout=(programId,workout)=>{
   const byIdentity=lastExecution.get(workoutHistoryKey(programId,'identity',workout.identity_id));
   if(byIdentity)return byIdentity;
   const legacyTitle=String(workout.title||'').trim().toLocaleLowerCase('pt-BR');
   return legacyTitle?lastExecution.get(workoutHistoryKey(programId,'legacy-title',legacyTitle))||null:null;
  };
  const dateLabel=value=>{
   if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';
   const [year,month,day]=value.split('-');
   return day+'/'+month+'/'+year;
  };
  workouts.sort((a,b)=>{
   const da=lastExecutionForWorkout(a.program.id,a.workout),db=lastExecutionForWorkout(b.program.id,b.workout);
   if(!da&&db)return -1;if(da&&!db)return 1;
   if(da&&db){const diff=da.localeCompare(db);if(diff)return diff}
   return String(a.workout.title||'Treino').localeCompare(String(b.workout.title||'Treino'),'pt-BR',{sensitivity:'base'});
  });
  const cards=workouts.map(({program:p,workout,exercises})=>{
   const thumb=exercises.find(x=>/^https?:/i.test(x.media_url||''))?.media_url||'';
   const image=thumb?'<img src="'+esc(thumb)+'" alt="" loading="lazy">':'<div class="training-card-placeholder" aria-hidden="true"><span>✦</span></div>';
   const category=programCategory(p.description),last=lastExecutionForWorkout(p.id,workout);
   const lastDate=dateLabel(last);
   const executionInfo=lastDate?' <span style="font-size:10px;font-weight:500;color:#a0a99c">· Última execução registrada</span> <span style="font-size:11px;font-weight:600;color:#B7F34A">'+esc(lastDate)+'</span>':'';
   return '<article class="training-card" data-training-card><button class="training-card-main" data-start-training="'+esc(p.id)+'" data-version="'+esc(p.current_version_id)+'" data-workout="'+esc(workout.id)+'">'+image+'<span class="training-card-copy"><strong>'+esc(normalizeHumanText(workout.title||'Treino'))+executionInfo+'</strong><small>'+esc((normalizeHumanText(p.title)||category)+(workout.description?' · '+normalizeHumanText(workout.description):''))+' · '+exercises.length+' '+(exercises.length===1?'exercício':'exercícios')+'</small></span><span class="training-chevron" aria-label="Registrar atividade">›</span></button></article>';
  });
  host.innerHTML=cards.length?'<div class="training-list">'+cards.join('')+'</div>':'<div class="training-empty"><h3>Nenhum treino cadastrado</h3><p class="muted">Os programas ativos ainda não possuem treinos.</p></div>';
  host.querySelectorAll('[data-start-training]').forEach(button=>button.onclick=()=>startListedWorkout(button.dataset.startTraining,button.dataset.version,button.dataset.workout));
 }
 async function copyPublicProgram(id,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const isSameAccount=()=>userRef()?.id===expectedUserId;
  if(!expectedUserId||!expectedDb||!isSameAccount())return false;
  if(!confirm('Adicionar uma cópia independente deste programa ao seu perfil? A cópia poderá ser editada sem alterar o programa público original.'))return;
  if(!isSameAccount())return false;
  const {error}=await expectedDb.rpc('nexfit_copy_public_program',{p_program:id});
  if(!isSameAccount())return false;
  if(error){const message=error.message||String(error);if(/nexfit_copy_public_program|function.*exist|schema cache|42883/i.test(message))return alert('A função de cópia ainda não está instalada no Supabase. Execute supabase-public-program-models.sql no SQL Editor.');return alert(message)}
  activeTrainingTab='mine';alert('Cópia adicionada ao seu perfil. Você pode editá-la em Gerenciar Programas de Treino.');await home();
 }

 async function startOfflineWorkout(workoutId,expectedUserId=userRef()?.id){
  const user=userRef();if(!user||user.id!==expectedUserId)return false;let cached=[];
  try{cached=JSON.parse(localStorage.getItem('nexfit-offline-workouts:'+String(expectedUserId))||'[]')}catch(_){}
  const snapshot=cached.find(x=>String(x.subworkout?.id)===String(workoutId));
  if(!snapshot||!snapshot.exercises?.length)return alert('Este treino não está disponível offline. Abra-o com internet antes de iniciar.');
  current=snapshot.program;version=snapshot.version;subworkouts=snapshot.subworkouts||[snapshot.subworkout];
  await startSession(workoutId,snapshot.exercises,expectedUserId,dbRef());
 }

 async function startListedWorkout(programId,versionId,workoutId){
  const db=dbRef(),user=userRef(),userId=user?.id,isSameAccount=()=>userRef()?.id===userId;
  const program=plans.find(p=>String(p.id)===String(programId)&&canManageProgramLocally(p)&&p.status==='active');
  if(!db||!userId||!program)return alert('Este programa não está ativo.');
  if(!navigator.onLine||window.__nexfitOfflineMode)return startOfflineWorkout(workoutId,userId);
  const key='nexfit-offline-workouts:'+String(userId);let cached=[];
  try{cached=JSON.parse(localStorage.getItem(key)||'[]')}catch(_){}
  const snapshot=cached.find(x=>String(x.subworkout?.id)===String(workoutId));
  let vq,sq;
  try{
   vq=await db.from('training_program_versions').select('*').eq('id',versionId).maybeSingle();
   if(!isSameAccount())return false;
   if(vq.error||!vq.data){if(snapshot)return startOfflineWorkout(workoutId,userId);return alert('Não foi possível carregar a versão deste programa.')}
   sq=await db.from('training_subworkouts').select('*').eq('version_id',versionId).order('position');
   if(!isSameAccount())return false;
   if(sq.error){if(snapshot)return startOfflineWorkout(workoutId,userId);return alert(sq.error.message)}
  }catch(error){if(!isSameAccount())return false;if(snapshot)return startOfflineWorkout(workoutId,userId);return alert('Sem conexão e sem cópia offline deste treino.')}
  if(!isSameAccount())return false;
  current=program;version=vq.data;subworkouts=sq.data||[];
  await startSession(workoutId,snapshot?.exercises||null,userId,db);
 }

 async function home(){
  const db=dbRef(),u=userRef();if(!db||!u){shell('Meus Treinos','<div class="panel muted">Faça login para acessar seus programas.</div>');return}
  const isSameAccount=()=>userRef()?.id===u.id;
  if(session){if(sessionView==='exercise'){shell('Executando exercício','<div id="sessionExercises"></div>');renderSessionStep();if(activeRest)restoreActiveRestUI()}else renderExercisePicker();return}
  if(restoreUserId!==u.id){restoreUserId=u.id;restoreAttempted=false;restorePromise=null;restoreGeneration++}
  if(!restoreAttempted){restoreAttempted=true;restorePromise=restoreWorkoutState()}if(restorePromise){const pending=restorePromise;const restored=await pending;if(!isSameAccount())return;if(restorePromise===pending)restorePromise=null;if(restored)return}
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
  if(!isSameAccount())return;
  if(q.error){
   window.__nexfitOfflineMode=true;
   try{plans=JSON.parse(localStorage.getItem('nexfit-offline-programs:'+u.id)||'[]')}catch(_){plans=[]}
   if(!plans.length){$('programList').textContent='Não foi possível carregar os programas. Conecte-se à internet e tente novamente.';return}
   $('programList').innerHTML='<p class="muted">Modo offline · programas salvos neste aparelho.</p>';
   $('exerciseEvolution').hidden=true;$('programSearch').parentElement.hidden=false;$('programList').hidden=false;
   await renderProgramList();
   return;
  }
  plans=q.data||[];
  try{localStorage.setItem('nexfit-offline-programs:'+u.id,JSON.stringify(plans))}catch(error){console.warn('Não foi possível guardar os programas offline',error)}
  showArchivedPlans=false;populateProgramSelectors();renderProgramManagement();await renderTrainingManagement();if(!isSameAccount())return;
  const evolutionView=activeTrainingTab==='evolution';
  $('exerciseEvolution').hidden=!evolutionView;$('programSearch').parentElement.hidden=evolutionView;$('programList').hidden=evolutionView;
  if(evolutionView){
   try{
    if(typeof window.renderNexfitExerciseEvolution!=='function'){
     $('exerciseEvolution').textContent='Preparando histórico de evolução…';
     await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./exercise-evolution.js?v=20261106.8';script.onload=resolve;script.onerror=()=>reject(new Error('Não foi possível carregar o módulo de evolução.'));document.head.append(script)});
    }
    if(typeof window.renderNexfitExerciseEvolution!=='function')throw new Error('O módulo de evolução não foi inicializado.');
    await window.renderNexfitExerciseEvolution($('exerciseEvolution'));if(!isSameAccount())return;
   }catch(error){if(!isSameAccount())return;$('exerciseEvolution').textContent=error.message||'Não foi possível abrir a evolução. Tente novamente.'}
  }else await renderProgramList();
  if(!isSameAccount())return;
  $('programSearch').oninput=()=>{const term=$('programSearch').value.toLocaleLowerCase('pt-BR');section.querySelectorAll('.training-card').forEach(card=>card.style.display=card.textContent.toLocaleLowerCase('pt-BR').includes(term)?'':'none')};
  const nq=await db.from('app_notifications').select('*').order('created_at',{ascending:false}).limit(8);
  if(!isSameAccount())return;
  if($('notifications'))$('notifications').innerHTML=nq.error?'Não foi possível carregar notificações.':(nq.data||[]).map(n=>'<div class="item"><strong>'+esc(n.title)+'</strong><p class="muted">'+esc(n.body)+'</p></div>').join('')||'Nenhuma notificação.';
  const aq=await db.from('athlete_professional_access').select('*');
  if(!isSameAccount())return;
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
 async function toggleProgramVisibility(id,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const p=plans.find(x=>String(x.id)===String(id)),db=expectedDb;
  const isSameAccount=()=>userRef()?.id===expectedUserId&&!!p&&canManageProgramLocally(p);
  if(!db||!expectedUserId||!isSameAccount())return false;
  const makePublic=!p.is_public;
  if(makePublic&&!confirm('Este programa ficará visível no menu Treinos > Modelos para que outros usuários possam copiá-lo. Cada cópia será independente e não alterará o original. Tornar público?'))return;
  if(!isSameAccount())return false;
  const {error}=await db.from('training_programs').update({is_public:makePublic}).eq('id',p.id);
  if(!isSameAccount())return false;
  if(error){const message=error.message||String(error);if(/is_public|row.level security|42501/i.test(message))return alert('Não foi possível alterar a visibilidade. Confirme que supabase-public-program-models.sql foi executado no Supabase e que você pode gerenciar este programa.');return alert(message)}
  await home();
 }
 function renderProgramManagement(){
  const host=$('programManagement');if(!host)return;
  const renderUserId=userRef()?.id,renderDb=dbRef();
  if(!renderUserId||!renderDb)return;
  const active=plans.filter(p=>canManageProgramLocally(p)&&p.status==='active');
  host.innerHTML=active.length?active.map(p=>'<div class="training-management-row"><div><strong>'+esc(normalizeHumanText(p.title))+'</strong><small>'+esc(programCategory(p.description))+' · '+(p.is_public?'Público':'Privado')+'</small></div><div class="training-row-actions"><button class="btn alt" data-manage-program="'+esc(p.id)+'">Treinos e exercícios</button><button class="btn alt" data-toggle-public="'+esc(p.id)+'">'+(p.is_public?'Tornar privado':'Tornar público')+'</button><button class="icon-action" data-edit-program="'+esc(p.id)+'" title="Editar programa" aria-label="Editar programa">'+editIcon+'</button><button class="icon-action danger" data-archive-program="'+esc(p.id)+'" title="Excluir programa" aria-label="Excluir programa">'+trashIcon+'</button></div></div>').join(''):'<p class="muted">Nenhum programa vigente.</p>';
  host.querySelectorAll('[data-manage-program]').forEach(b=>b.onclick=()=>openProgram(b.dataset.manageProgram,renderUserId,renderDb));
  host.querySelectorAll('[data-edit-program]').forEach(b=>b.onclick=()=>editProgram(b.dataset.editProgram,renderUserId,renderDb));
  host.querySelectorAll('[data-toggle-public]').forEach(b=>b.onclick=()=>toggleProgramVisibility(b.dataset.togglePublic,renderUserId,renderDb));
  host.querySelectorAll('[data-archive-program]').forEach(b=>b.onclick=()=>archiveProgram(b.dataset.archiveProgram,renderUserId,renderDb));
 }
 async function ensurePendingProgramVersion(programId,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const db=expectedDb,userId=expectedUserId;
  if(!db||!userId||userRef()?.id!==userId)return false;
  await openProgram(programId,userId,db);
  if(userRef()?.id!==userId||current?.id!==programId||!version)return false;
  if(version.status==='pending')return true;
  if(version.status!=='active'){
   alert('Não é possível editar um programa sem uma versão vigente.');
   return false;
  }
  await newVersion();
  if(userRef()?.id!==userId||current?.id!==programId||version?.status!=='pending'){
   alert('Não foi possível preparar uma nova versão para a alteração. Nenhuma alteração foi aplicada.');
   return false;
  }
  return true;
 }
 async function openIsolatedWorkoutEdit(programId,identityId,title,expectedUserId=userRef()?.id,expectedDb=dbRef(),action='edit'){
  const ready=await ensurePendingProgramVersion(programId,expectedUserId,expectedDb);
  if(!ready)return false;
  const workout=subworkouts.find(item=>String(item.identity_id||'')===String(identityId||''));
  if(!workout){
   alert('Não foi possível localizar este treino na nova versão. Reabra o gerenciamento e tente novamente.');
   return false;
  }
  if(action==='delete')return deleteSubworkout(workout.id);
  return openWorkoutEditor(workout.id,expectedUserId,expectedDb);
 }
 async function openIsolatedExerciseEdit(programId,subworkoutIdentity,exerciseIdentity,expectedUserId=userRef()?.id,expectedDb=dbRef(),action='edit'){
  const db=expectedDb,userId=expectedUserId;
  const ready=await ensurePendingProgramVersion(programId,userId,db);
  if(!ready)return false;
  const workout=subworkouts.find(item=>String(item.identity_id||'')===String(subworkoutIdentity||''));
  if(!workout){alert('Não foi possível localizar o treino na nova versão.');return false}
  await openWorkoutEditor(workout.id,userId,db);
  if(userRef()?.id!==userId||current?.id!==programId||editorSubworkoutId!==workout.id)return false;
  if(action==='add')return addExercise(workout.id);
  const rows=await db.from('training_exercises').select('id,identity_id').eq('subworkout_id',workout.id);
  if(userRef()?.id!==userId||current?.id!==programId||editorSubworkoutId!==workout.id)return false;
  if(rows.error){alert('Não foi possível localizar o exercício na nova versão: '+rows.error.message);return false}
  const exercise=(rows.data||[]).find(item=>String(item.identity_id||'')===String(exerciseIdentity||''));
  if(!exercise){alert('O exercício não foi encontrado na nova versão.');return false}
  if(action==='delete')return deleteExercise(exercise.id);
  return editExercise(exercise.id);
 }
 async function renderTrainingManagement(){
  const host=$('trainingManagement');if(!host)return;
  const renderUserId=userRef()?.id,renderDb=dbRef(),isSameAccount=()=>userRef()?.id===renderUserId;
  if(!renderUserId||!renderDb)return;
  const rows=[],programs=plans.filter(x=>canManageProgramLocally(x)&&x.status==='active'&&x.current_version_id);
  for(const p of programs){
   const q=await renderDb.from('training_subworkouts').select('id,identity_id,title,description,position').eq('version_id',p.current_version_id).order('position');
   if(!isSameAccount())return;
   if(q.error)continue;
   for(const w of q.data||[])rows.push('<div class="training-management-row"><div><strong>'+esc(normalizeHumanText(w.title||'Treino'))+'</strong><small>'+esc(normalizeHumanText(p.title))+' · '+esc(programCategory(p.description))+'</small></div><div class="training-row-actions"><button class="icon-action" data-edit-training="'+esc(p.id)+'" data-training-identity="'+esc(w.identity_id)+'" title="Editar em uma nova versão" aria-label="Editar em uma nova versão">'+editIcon+'</button><button class="icon-action danger" data-delete-training="'+esc(p.id)+'" data-training-identity="'+esc(w.identity_id)+'" title="Remover em uma nova versão" aria-label="Remover em uma nova versão">'+trashIcon+'</button></div></div>');
  }
  if(!isSameAccount())return;
  host.innerHTML=rows.length?'<p class="muted">As alterações são preparadas em uma nova versão. O programa vigente só muda após a confirmação do atleta.</p>'+rows.join(''):'<p class="muted">Nenhum treino nos programas vigentes.</p>';
  host.querySelectorAll('[data-edit-training]').forEach(b=>b.onclick=async()=>{if(!isSameAccount())return;await openIsolatedWorkoutEdit(b.dataset.editTraining,b.dataset.trainingIdentity,'',renderUserId,renderDb,'edit')});
  host.querySelectorAll('[data-delete-training]').forEach(b=>b.onclick=async()=>{if(!isSameAccount())return;await openIsolatedWorkoutEdit(b.dataset.deleteTraining,b.dataset.trainingIdentity,'',renderUserId,renderDb,'delete')});
 }

 let creatingWorkout=false;
 async function createWorkout(){
  if(creatingWorkout)return false;
  creatingWorkout=true;
  const button=$('createWorkout');if(button)button.disabled=true;
  try{
   const db=dbRef(),userId=userRef()?.id,isSameAccount=()=>userRef()?.id===userId;
   if(!db||!userId)return alert('Faça login para criar um treino.');
   const selectedProgramId=String($('workoutProgram').value||'');
   const program=plans.find(p=>String(p.id)===selectedProgramId&&p.status==='active'&&canManageProgramLocally(p));
   const title=normalizeHumanText($('workoutTitle').value),description=normalizeHumanText($('workoutDescription').value)||null;
   if(!program)return alert('Selecione um programa vigente.');
   if(!title)return alert('Informe o nome do treino.');
   const isCurrentForm=()=>isSameAccount()&&String($('workoutProgram').value||'')===selectedProgramId&&plans.some(p=>String(p.id)===selectedProgramId&&p.status==='active'&&p.current_version_id===program.current_version_id&&canManageProgramLocally(p));
   const ready=await ensurePendingProgramVersion(selectedProgramId,userId,db);
   if(!isCurrentForm()||!ready)return false;
   const versionRow=version;
   if(!versionRow?.id||versionRow.status!=='pending')return alert('Não foi possível preparar uma nova versão para adicionar o treino.');
   const {data:existing,error:existingError}=await db.from('training_subworkouts').select('position').eq('version_id',versionRow.id).order('position',{ascending:false}).limit(1);
   if(!isCurrentForm())return false;
   if(existingError)return alert('Não foi possível preparar o treino: '+existingError.message);
   const {data,error}=await db.from('training_subworkouts').insert({version_id:versionRow.id,title,description,position:(existing?.[0]?.position||0)+1}).select().single();
   if(!isCurrentForm())return false;
   if(error)return alert('Não foi possível criar o treino: '+error.message);
   $('workoutTitle').value='';$('workoutDescription').value='';
   current=program;
   await openWorkoutEditor(data.id,userId,db);
  }finally{
   creatingWorkout=false;
   if(button)button.disabled=false;
  }
 }
 const pendingProgramActions=new Set();
 async function withProgramActionLock(actionId,callback){
  if(pendingProgramActions.has(actionId))return false;
  pendingProgramActions.add(actionId);
  const button=$(actionId);if(button)button.disabled=true;
  try{return await callback()}
  finally{pendingProgramActions.delete(actionId);if(button)button.disabled=false}
 }
 async function createProgram(){
  return withProgramActionLock('createProgram',async()=>{
   const db=dbRef(),userId=userRef()?.id,isSameAccount=()=>userRef()?.id===userId;
   if(!db||!userId)return alert('Faça login para criar um programa.');
   const title=normalizeHumanText($('programTitle').value);
   if(!title)return alert('Informe o nome do programa.');
   const category=$('programCategory').value,description=normalizeHumanText($('programDesc').value)||null;
   const {data,error}=await db.rpc('nexfit_create_own_program',{p_title:title,p_category:category,p_description:description});
   if(!isSameAccount())return false;
   if(error){const message=error.message||String(error);if(/row.level security|42501/i.test(message))return alert('O Supabase bloqueou a criação deste programa. Execute supabase-own-program-creation.sql no SQL Editor do Supabase e tente novamente.');return alert(message)}
   await home();
  });
 }
 async function createProgramForAthlete(){
  return withProgramActionLock('createForAthlete',async()=>{
   const db=dbRef(),userId=userRef()?.id,isSameAccount=()=>userRef()?.id===userId;
   if(!db||!userId)return alert('Faça login para enviar um programa.');
   const email=$('athleteEmail').value.trim().toLowerCase(),title=normalizeHumanText($('programTitle').value);
   if(!email)return alert('Informe o e-mail do atleta.');
   if(!title)return alert('Informe o nome do programa.');
   const category=$('programCategory').value,description='[MODALIDADE: '+category+'] '+normalizeHumanText($('programDesc').value);
   const {error}=await db.rpc('nexfit_create_program_for_athlete',{p_email:email,p_title:title,p_description:description});
   if(!isSameAccount())return false;
   if(error){const message=error.message||String(error);if(/row.level security|42501/i.test(message))return alert('O Supabase bloqueou a criação do programa para outro atleta. Execute o arquivo supabase-program-management-policies.sql no SQL Editor do Supabase e confirme que sua autorização de gestão está ativa.');return alert(message)}
   alert('Programa enviado ao atleta. Ele precisará confirmar o recebimento.');
   await home();
  });
 }
 async function requestAccess(){
  return withProgramActionLock('requestAccess',async()=>{
   const db=dbRef(),userId=userRef()?.id,isSameAccount=()=>userRef()?.id===userId;
   if(!db||!userId)return alert('Faça login para solicitar acesso.');
   const email=$('professionalEmail').value.trim().toLowerCase();if(!email)return alert('Informe o e-mail do atleta.');
   const {error}=await db.rpc('nexfit_request_access_by_email',{p_email:email});
   if(!isSameAccount())return false;
   if(error)return alert(error.message);alert('Solicitação enviada. O atleta precisa aprovar e escolher as permissões.');await home();
  });
 }
 async function decideAccess(id,approve){
  const db=dbRef(),u=userRef(),userId=u?.id,isSameAccount=()=>userRef()?.id===userId;
  if(!db||!userId)return false;
  let permissions={can_view_history:false,can_manage_programs:false};
  if(approve){
   permissions.can_view_history=confirm('Permitir que este profissional visualize seu histórico de treinos?');
   if(!isSameAccount())return false;
   permissions.can_manage_programs=confirm('Permitir que este profissional crie e gerencie os programas que ele próprio criar para você?');
   if(!isSameAccount())return false;
   if(!permissions.can_view_history&&!permissions.can_manage_programs&&!confirm('Nenhuma permissão foi concedida. Deseja aprovar mesmo assim?'))return;
  }
  if(!isSameAccount())return false;
  const {error}=await db.from('athlete_professional_access').update({...permissions,status:approve?'active':'revoked',decided_at:new Date().toISOString()}).eq('id',id).eq('athlete_id',userId);
  if(!isSameAccount())return false;
  if(error)return alert(error.message);await home();
 }
 async function openProgram(id,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const db=expectedDb,userId=expectedUserId,program=plans.find(p=>p.id===id);
  if(!db||!userId||userRef()?.id!==userId||!program)return false;
  const isCurrentProgram=()=>userRef()?.id===userId&&current?.id===program.id&&editorSubworkoutId===null;
  editorSubworkoutId=null;current=program;version=null;subworkouts=[];
  const {data:vers,error}=await db.from('training_program_versions').select('*').eq('program_id',id).order('version_number',{ascending:false});
  if(!isCurrentProgram())return false;
  if(error)return alert(error.message);
  const pending=vers.find(v=>v.status==='pending'),active=vers.find(v=>v.status==='active'),selectedVersion=pending||active||vers[0];
  if(!selectedVersion)return alert('Este programa ainda não possui versão.');
  version=selectedVersion;
  const sq=await db.from('training_subworkouts').select('*').eq('version_id',selectedVersion.id).order('position');
  if(!isCurrentProgram()||version?.id!==selectedVersion.id)return false;
  if(sq.error)return alert(sq.error.message);
  subworkouts=sq.data||[];
  const isAthlete=program.athlete_id===userId;
  shell(program.title,`<div class="panel"><p class="muted">${esc(program.description||'')} · Versão ${selectedVersion.version_number} · ${selectedVersion.status==='pending'?'Aguardando confirmação do atleta':selectedVersion.status==='active'?'Vigente':'Arquivada'}</p>${pending&&isAthlete?'<button class="btn" id="confirmVersion">Confirmar recebimento desta versão</button>':''}<button class="btn alt" id="newVersion">Criar nova versão</button><button class="icon-action" id="editCurrentProgram" title="Editar programa" aria-label="Editar programa">${editIcon}</button><button class="icon-action danger" id="archiveCurrentProgram" title="Excluir programa" aria-label="Excluir programa">${trashIcon}</button><button class="btn alt" id="newSub">＋ Adicionar treino</button></div><div id="subList"></div><div class="panel"><h3>Solicitar exclusão</h3><p class="muted">A exclusão depende da aprovação do atleta. O histórico de treinos nunca é apagado.</p><button class="btn alt" id="deleteRequest">Solicitar arquivamento</button></div>`);
  $('newVersion').onclick=()=>{if(isCurrentProgram())newVersion()};$('newSub').onclick=()=>{if(isCurrentProgram())addSubworkout()};$('deleteRequest').onclick=()=>{if(isCurrentProgram())requestDeletion(userId,db,program)};$('editCurrentProgram').onclick=()=>{if(isCurrentProgram())editProgram(program.id,userId,db)};$('archiveCurrentProgram').onclick=()=>{if(isCurrentProgram())archiveProgram(program.id,userId,db)};
  if($('confirmVersion'))$('confirmVersion').onclick=()=>withProgramActionLock('confirmVersion',async()=>{const result=await db.rpc('nexfit_confirm_program_version',{p_version:selectedVersion.id});if(!isCurrentProgram())return false;if(result.error)alert(result.error.message);else await openProgram(id,userId,db)});
  renderSubworkouts(userId,db,program.id,selectedVersion.id,subworkouts.slice());
 }
 async function newVersion(){
  return withProgramActionLock('newVersion',async()=>{
   const db=dbRef(),program=current,previous=version,userId=userRef()?.id;
   if(!db||!program||!previous||!userId)return false;
   const isSameAccount=()=>userRef()?.id===userId;
   const isCurrentEditor=()=>isSameAccount()&&current?.id===program.id&&version?.id===previous.id&&editorSubworkoutId===null;
   if(previous.status==='pending'){alert('Já existe uma versão aguardando confirmação. Continue editando essa versão ou aguarde a confirmação do atleta antes de criar outra.');return false}
   if(previous.status!=='active'){alert('Só é possível criar uma nova versão a partir de um programa vigente.');return false}
   const pendingCheck=await db.from('training_program_versions').select('id,version_number').eq('program_id',program.id).eq('status','pending').order('version_number',{ascending:false}).limit(1);
   if(!isCurrentEditor())return false;
   if(pendingCheck.error)return alert('Não foi possível verificar versões pendentes: '+pendingCheck.error.message);
   if(pendingCheck.data?.length){alert('Já existe uma versão aguardando confirmação. Ela será aberta para continuar a edição.');return openProgram(program.id,userId,db)}
   const q=await db.from('training_program_versions').select('version_number').eq('program_id',program.id).order('version_number',{ascending:false}).limit(1);
   if(!isCurrentEditor())return false;
   if(q.error)return alert(q.error.message);
   const next=(q.data?.[0]?.version_number||0)+1,changeNote=prompt('Resumo das alterações desta versão:')||'Atualização do programa';
   if(!isCurrentEditor())return false;
   const {data,error}=await db.from('training_program_versions').insert({program_id:program.id,version_number:next,created_by:userId,change_note:changeNote}).select().single();
   if(error){
    if(error.code==='23505'&&isCurrentEditor()){
     alert('Outra aba iniciou a criação de uma nova versão deste programa. Para evitar abrir a cópia enquanto ela ainda está sendo preparada, aguarde a conclusão e reabra a ficha.');
     return false;
    }
    return alert(error.message);
   }
   const cleanupIncompleteVersion=async()=>{
    if(!isSameAccount())return false;
    const subs=await db.from('training_subworkouts').select('id').eq('version_id',data.id);
    if(subs.error||!isSameAccount())return false;
    const ids=(subs.data||[]).map(row=>row.id);
    if(ids.length){
     const removedExercises=await db.from('training_exercises').delete().in('subworkout_id',ids);
     if(removedExercises.error||!isSameAccount())return false;
    }
    const removedSubs=await db.from('training_subworkouts').delete().eq('version_id',data.id);
    if(removedSubs.error||!isSameAccount())return false;
    const discardedVersion=await db.from('training_program_versions').update({status:'archived',change_note:'Versão descartada automaticamente após falha ao copiar os treinos.'}).eq('id',data.id).eq('program_id',program.id);
    if(discardedVersion.error){console.warn('Não foi possível arquivar a versão incompleta',discardedVersion.error);return false}
    return true;
   };
   const abortStaleVersion=async()=>{
    if(isCurrentEditor())return false;
    if(isSameAccount()){
     const cleaned=await cleanupIncompleteVersion();
     if(!cleaned)console.warn('A versão incompleta permaneceu no banco e precisa de limpeza manual.');
    }
    return true;
   };
   if(await abortStaleVersion())return false;
   const oldSubs=await db.from('training_subworkouts').select('*').eq('version_id',previous.id).order('position');
   if(await abortStaleVersion())return false;
   if(oldSubs.error){const discarded=await cleanupIncompleteVersion();return alert((discarded?'A versão incompleta foi arquivada. ':'Não foi possível arquivar a versão incompleta. ')+oldSubs.error.message)}
   for(const oldSub of (oldSubs.data||[])){
    const {data:newSub,error:subErr}=await db.from('training_subworkouts').insert({version_id:data.id,identity_id:oldSub.identity_id,title:oldSub.title,description:oldSub.description,position:oldSub.position}).select().single();
    if(await abortStaleVersion())return false;
    if(subErr){const discarded=await cleanupIncompleteVersion();return alert((discarded?'A versão incompleta foi arquivada. ':'Não foi possível arquivar a versão incompleta. ')+subErr.message)}
    const oldExercises=await db.from('training_exercises').select('*').eq('subworkout_id',oldSub.id).order('position');
    if(await abortStaleVersion())return false;
    if(oldExercises.error){const discarded=await cleanupIncompleteVersion();return alert((discarded?'A versão incompleta foi arquivada. ':'Não foi possível arquivar a versão incompleta. ')+oldExercises.error.message)}
    if(oldExercises.data?.length){
     const copied=oldExercises.data.map(e=>({subworkout_id:newSub.id,identity_id:e.identity_id,name:e.name,position:e.position,sets:e.sets,rest_seconds:e.rest_seconds,notes:e.notes,media_url:e.media_url,media_end_url:e.media_end_url,execution_instructions:e.execution_instructions,primary_muscles:e.primary_muscles,secondary_muscles:e.secondary_muscles}));
     const {error:exErr}=await db.from('training_exercises').insert(copied);
     if(await abortStaleVersion())return false;
     if(exErr){const discarded=await cleanupIncompleteVersion();return alert((discarded?'A versão incompleta foi arquivada. ':'Não foi possível arquivar a versão incompleta. ')+exErr.message)}
    }
   }
   if(await abortStaleVersion())return false;
   await db.from('app_notifications').insert({user_id:program.athlete_id,type:'program_version_pending',title:'Nova versão disponível',body:'Analise a nova versão do seu programa. A versão atual permanece vigente até sua confirmação.',entity_id:program.id});
   if(await abortStaleVersion())return false;
   return openProgram(program.id,userId,db);
  });
 }
 async function addSubworkout(){
  return withProgramActionLock('newSub',async()=>{
   const db=dbRef(),program=current,userId=userRef()?.id;
   if(!db||!program||!userId)return false;
   if(version?.status==='active'){
    const ready=await ensurePendingProgramVersion(program.id,userId,db);
    if(!ready)return false;
   }
   const programVersion=version;
   if(!programVersion||programVersion.status!=='pending')return alert('Prepare uma nova versão antes de adicionar treinos.');
   const isCurrentEditor=()=>userRef()?.id===userId&&current?.id===program.id&&version?.id===programVersion.id&&editorSubworkoutId===null;
   const title=normalizeHumanText(prompt('Nome do treino (ex.: A — Peito e tríceps):'));if(!title)return;
   if(!isCurrentEditor())return false;
   const {data,error}=await db.from('training_subworkouts').insert({version_id:programVersion.id,title,position:subworkouts.length+1}).select().single();
   if(!isCurrentEditor())return false;
   if(error)return alert(error.message);
   await openWorkoutEditor(data.id,userId,db);
  });
 }
 async function refreshWorkoutEditorOrProgram(){
  if(editorSubworkoutId){await openWorkoutEditor(editorSubworkoutId);return}
  await openProgram(current.id);
 }
 async function openWorkoutEditor(subId,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const db=expectedDb,userId=expectedUserId,program=current,programVersion=version;
  if(!db||!userId||userRef()?.id!==userId||!program||!programVersion)return false;
  editorSubworkoutId=subId;
  const isCurrentEditor=()=>userRef()?.id===userId&&current?.id===program.id&&version?.id===programVersion.id&&editorSubworkoutId===subId;
  const subQuery=await db.from('training_subworkouts').select('*').eq('id',subId).maybeSingle();
  if(!isCurrentEditor())return false;
  if(subQuery.error||!subQuery.data){if(isCurrentEditor())editorSubworkoutId=null;return alert('Não foi possível abrir o treino: '+(subQuery.error?.message||'treino não encontrado'));}
  const sub=subQuery.data;
  const exercises=await db.from('training_exercises').select('*').eq('subworkout_id',sub.id).order('position');
  if(!isCurrentEditor())return false;
  if(exercises.error){if(isCurrentEditor())editorSubworkoutId=null;return alert('Não foi possível carregar os exercícios: '+exercises.error.message)}
  const rows=(exercises.data||[]).map((e,i)=>'<div class="item"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><strong>'+(i+1)+'. '+esc(normalizeHumanText(e.name))+'</strong><span><button class="icon-action" data-edit-focused-ex="'+esc(e.id)+'" title="Editar exercício" aria-label="Editar exercício">'+editIcon+'</button><button class="icon-action danger" data-delete-focused-ex="'+esc(e.id)+'" title="Excluir exercício" aria-label="Excluir exercício">'+trashIcon+'</button></span></div><div class="muted">'+(e.sets||[]).map(x=>(x.mode==='countdown'?formatWorkoutTime(x.target_seconds)+' alvo':x.mode==='stopwatch'?'Cronômetro livre':(x.reps??'—')+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':''))).join(' / ')+' · descanso '+e.rest_seconds+'s</div></div>').join('');
  shell('Editar treino',`<div class="panel">
   <button class="btn alt" type="button" id="backToProgram">← Voltar ao programa</button>
   <p class="muted">${esc(normalizeHumanText(program.title))}</p>
   <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2>${esc(normalizeHumanText(sub.title))}</h2><button class="icon-action" type="button" id="editFocusedWorkoutDetails" title="Editar nome e descrição" aria-label="Editar nome e descrição">${editIcon}</button></div>
   <p class="muted">${esc(sub.description||'Sem descrição.')}</p>
   <div class="training-program-management">${rows||'<p class="muted">Nenhum exercício adicionado. Comece adicionando o primeiro exercício.</p>'}</div>
   <button class="btn" type="button" id="addExerciseFocused">＋ Adicionar exercício</button>
  </div>`);
  $('backToProgram').onclick=()=>{if(!isCurrentEditor())return;editorSubworkoutId=null;openProgram(program.id,userId,db)};
  $('editFocusedWorkoutDetails').onclick=()=>{if(isCurrentEditor())editSubworkout(sub.id,userId,db)};
  $('addExerciseFocused').onclick=()=>{if(isCurrentEditor())addExercise(sub.id)};
  section.querySelectorAll('[data-edit-focused-ex]').forEach(b=>b.onclick=()=>{if(isCurrentEditor())editExercise(b.dataset.editFocusedEx)});
  section.querySelectorAll('[data-delete-focused-ex]').forEach(b=>b.onclick=()=>{if(isCurrentEditor())deleteExercise(b.dataset.deleteFocusedEx)});
 }
 async function renderSubworkouts(expectedUserId=userRef()?.id,expectedDb=dbRef(),programId=current?.id,versionId=version?.id,workoutRows=subworkouts.slice()){
   const db=expectedDb,isCurrent=()=>userRef()?.id===expectedUserId&&current?.id===programId&&version?.id===versionId&&editorSubworkoutId===null;
   if(!db||!expectedUserId||!isCurrent())return;
   const workoutIds=workoutRows.map(item=>item.id),exercisesByWorkout=new Map(),sessionCountsByWorkout=new Map(),sessionsByIdentity=new Map(),sessionsByTitle=new Map();
   if(workoutIds.length){
    const [exerciseQuery,doneQuery]=await Promise.all([
     db.from('training_exercises').select('*').in('subworkout_id',workoutIds).order('position'),
     db.from('training_sessions').select('subworkout_id').eq('program_id',programId).eq('athlete_id',expectedUserId).eq('status','completed')
    ]);
    if(!isCurrent())return;
    for(const exercise of exerciseQuery.data||[]){const key=String(exercise.subworkout_id);if(!exercisesByWorkout.has(key))exercisesByWorkout.set(key,[]);exercisesByWorkout.get(key).push(exercise)}
    for(const row of doneQuery.data||[]){const key=String(row.subworkout_id||'');if(key)sessionCountsByWorkout.set(key,(sessionCountsByWorkout.get(key)||0)+1)}
    const historicalIds=[...sessionCountsByWorkout.keys()];
    if(historicalIds.length){
     const names=await db.from('training_subworkouts').select('id,title,identity_id').in('id',historicalIds);
     if(!isCurrent())return;
     for(const item of names.data||[]){
      const count=sessionCountsByWorkout.get(String(item.id))||0;
      if(item.identity_id)sessionsByIdentity.set(String(item.identity_id),(sessionsByIdentity.get(String(item.identity_id))||0)+count);
      const title=String(item.title||'').trim().toLocaleLowerCase('pt-BR');
      if(title)sessionsByTitle.set(title,(sessionsByTitle.get(title)||0)+count);
     }
    }
   }
   let html='';
   for(const s of workoutRows){
    if(!isCurrent())return;
    let total=s.identity_id?sessionsByIdentity.get(String(s.identity_id))||0:0;
    // O fallback por título existe apenas para registros legados sem identidade estável.
    // Um treino novo, com identity_id próprio, nunca herda a contagem de outro treino homônimo.
    if(!s.identity_id){const legacyTitle=String(s.title||'').trim().toLocaleLowerCase('pt-BR');total=legacyTitle?sessionsByTitle.get(legacyTitle)||0:0}
    const exercises=exercisesByWorkout.get(String(s.id))||[];
    html+=`<div class="panel"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3>${esc(normalizeHumanText(s.title))}</h3><span class="tag">${total} ${total===1?'treino registrado':'treinos registrados'}</span><button class="icon-action" data-edit-sub="${s.id}" data-workout-identity="${esc(s.identity_id)}" title="Editar em nova versão" aria-label="Editar em nova versão">${editIcon}</button><button class="icon-action danger" data-delete-sub="${s.id}" data-workout-identity="${esc(s.identity_id)}" title="Remover em nova versão" aria-label="Remover em nova versão">${trashIcon}</button></div><p class="muted">${esc(s.description||'')}</p>${exercises.map((e,i)=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><strong>${i+1}. ${esc(normalizeHumanText(e.name))}</strong><span><button class="icon-action" data-edit-ex="${e.id}" data-workout-identity="${esc(s.identity_id)}" data-exercise-identity="${esc(e.identity_id)}" title="Editar em nova versão" aria-label="Editar em nova versão">${editIcon}</button><button class="icon-action danger" data-delete-ex="${e.id}" data-workout-identity="${esc(s.identity_id)}" data-exercise-identity="${esc(e.identity_id)}" title="Remover em nova versão" aria-label="Remover em nova versão">${trashIcon}</button></span></div><div class="muted">${(e.sets||[]).map(x=>(x.mode==='countdown'?formatWorkoutTime(x.target_seconds)+' alvo':x.mode==='stopwatch'?'Cronômetro livre':(x.reps??'—')+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':''))).join(' / ')} · descanso ${e.rest_seconds}s</div></div>`).join('')}<button class="btn alt" data-add-ex="${s.id}" data-workout-identity="${esc(s.identity_id)}">Adicionar exercício</button><button class="btn" data-start="${s.id}">Iniciar treino</button></div>`;
   }
   if(!isCurrent())return;
   const host=$('subList');if(!host)return;
   host.innerHTML=html||'<div class="panel muted">Nenhum treino nesta versão. Adicione o primeiro treino.</div>';
   host.querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>{if(isCurrent())openIsolatedExerciseEdit(programId,b.dataset.workoutIdentity,null,expectedUserId,db,'add')});
   host.querySelectorAll('[data-edit-sub]').forEach(b=>b.onclick=()=>{if(isCurrent())openIsolatedWorkoutEdit(programId,b.dataset.workoutIdentity,'',expectedUserId,db,'edit')});
   host.querySelectorAll('[data-delete-sub]').forEach(b=>b.onclick=()=>{if(isCurrent())openIsolatedWorkoutEdit(programId,b.dataset.workoutIdentity,'',expectedUserId,db,'delete')});
   host.querySelectorAll('[data-edit-ex]').forEach(b=>b.onclick=()=>{if(isCurrent())openIsolatedExerciseEdit(programId,b.dataset.workoutIdentity,b.dataset.exerciseIdentity,expectedUserId,db,'edit')});
   host.querySelectorAll('[data-delete-ex]').forEach(b=>b.onclick=()=>{if(isCurrent())openIsolatedExerciseEdit(programId,b.dataset.workoutIdentity,b.dataset.exerciseIdentity,expectedUserId,db,'delete')});
   host.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{if(isCurrent())startSession(b.dataset.start,null,expectedUserId,db)});
  }
async function loadExerciseCatalog(expectedDb=dbRef()){
  let query=await expectedDb.from('training_exercise_catalog').select('id,name,category,demonstration_image_url,demonstration_end_image_url,execution_instructions,primary_muscles,secondary_muscles').eq('is_active',true).order('name');
  if(query.error&&/column .* does not exist|could not find .* column|schema cache/i.test(query.error.message||'')){
   query=await expectedDb.from('training_exercise_catalog').select('id,name,category,demonstration_image_url,execution_instructions,primary_muscles').eq('is_active',true).order('name');
   if(!query.error)return (query.data||[]).map(item=>({...item,demonstration_end_image_url:null,secondary_muscles:null,__visualFieldsAvailable:false}));
  }
  if(query.error)throw Error('Não foi possível carregar o banco de exercícios. '+query.error.message);
  return (query.data||[]).map(item=>({...item,__visualFieldsAvailable:true}));
 }
 function exerciseCatalogOptions(items,selectedId=''){
  const grouped=new Map();
  const uncategorized='Outros';
  for(const item of items||[]){
   const category=normalizeHumanText(item.category||uncategorized);
   if(!grouped.has(category))grouped.set(category,[]);
   grouped.get(category).push(item);
  }
  const groups=[...grouped.entries()].sort((a,b)=>a[0].localeCompare(b[0],'pt-BR',{sensitivity:'base'}));
  const options=groups.map(([category,groupItems])=>{
   const rows=groupItems.slice().sort((a,b)=>normalizeHumanText(a.name).localeCompare(normalizeHumanText(b.name),'pt-BR',{sensitivity:'base'}))
    .map(item=>'<option value="'+esc(item.id)+'" '+(String(item.id)===String(selectedId)?'selected':'')+'>'+esc(normalizeHumanText(item.name))+'</option>').join('');
   return '<optgroup label="'+esc(category)+'">'+rows+'</optgroup>';
  }).join('');
  return '<option value="">Selecione um exercício…</option>'+options;
 }
 function exerciseSearchKey(value){
  return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g,' ');
 }
 function exerciseCatalogKey(value){
  const key=String(value??'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]/g,'');
  const aliases={leg45:'legpress45',legpress45grau:'legpress45',legpress45graus:'legpress45',agachamento:'agachamentolivre'};
  return aliases[key]||key;
 }
 async function saveNewCatalogExercise(name,category,expectedDb=dbRef()){
  const clean=normalizeHumanText(name),key=exerciseCatalogKey(clean);
  if(!clean||key.length<2)throw Error('Informe um nome válido para o exercício.');
  const db=expectedDb;
  const existing=await db.from('training_exercise_catalog').select('id,name,category').eq('normalized_name',key).maybeSingle();
  if(existing.error)throw Error(existing.error.message);
  if(existing.data)return {item:existing.data,duplicate:true};
  const inserted=await db.from('training_exercise_catalog').insert({name:clean,normalized_name:key,category:category||null}).select('id,name,category').single();
  if(inserted.error){
   if(inserted.error.code==='23505'){
    const again=await db.from('training_exercise_catalog').select('id,name,category').eq('normalized_name',key).maybeSingle();
    if(again.data)return {item:again.data,duplicate:true};
   }
   throw Error(inserted.error.message);
  }
  return {item:inserted.data,duplicate:false};
 }
 async function addExercise(subId){
  const db=dbRef(),program=current,programVersion=version,userId=userRef()?.id,focusedSubworkoutId=editorSubworkoutId;
  if(!db||!program||!programVersion||!userId)return false;
  const isCurrentEditor=()=>userRef()?.id===userId&&current?.id===program.id&&version?.id===programVersion.id&&editorSubworkoutId===focusedSubworkoutId;
  const refresh=async()=>{if(!isCurrentEditor())return;if(focusedSubworkoutId)await openWorkoutEditor(focusedSubworkoutId,userId,db);else await openProgram(program.id,userId,db)};
  let catalog;try{catalog=await loadExerciseCatalog(db)}catch(err){if(isCurrentEditor())alert(err.message);return false}
  if(!isCurrentEditor())return false;
  const categories=['Peito','Costas','Ombros','Bíceps','Tríceps','Quadríceps','Posterior de coxa','Glúteos','Panturrilhas','Abdômen','Antebraços','Cardio','Funcional','Corpo inteiro'];
  const categoryOptions='<option value="">Selecione o grupo muscular</option>'+categories.map(x=>'<option>'+esc(x)+'</option>').join('');
  const fields='<div class="field"><label>Exercício</label><div class="catalog-picker" style="position:relative">'
   +'<button type="button" id="catalogPickerToggle" class="secondary" aria-expanded="false" style="width:100%;text-align:left;display:flex;justify-content:space-between;align-items:center"><span id="catalogPickerLabel">Selecione um exercício…</span><span aria-hidden="true">▾</span></button>'
   +'<div id="catalogPickerPanel" style="display:none;position:absolute;z-index:30;top:calc(100% + 5px);left:0;right:0;background:#111a23;border:1px solid #354454;border-radius:10px;padding:10px;box-shadow:0 12px 28px #0009;max-height:320px;overflow:auto">'
   +'<input id="searchCatalogExercise" type="search" placeholder="Pesquisar exercício ou grupo…" aria-label="Pesquisar exercício" style="width:100%;margin-bottom:8px">'
   +'<div id="catalogPickerResults"></div></div></div><select id="editorCatalogExercise" style="display:none">'+exerciseCatalogOptions(catalog)+'</select></div>'
   +'<button type="button" class="secondary" id="toggleNewCatalogExercise" style="margin:4px 0 12px">＋ Cadastrar novo exercício</button>'
   +'<div id="newCatalogExerciseFields" style="display:none;border:1px solid #354454;border-radius:10px;padding:12px;margin-bottom:12px">'
   +'<div class="field"><label for="newCatalogExerciseName">Nome do exercício</label><input id="newCatalogExerciseName" type="text" placeholder="Ex.: Supino inclinado com halteres"></div>'
   +'<div class="field"><label for="newCatalogExerciseCategory">Grupo muscular</label><select id="newCatalogExerciseCategory">'+categoryOptions+'</select></div>'
   +'<p class="muted">O exercício será adicionado ao catálogo compartilhado e ficará disponível para todos os atletas.</p></div>'
   +'<div class="field"><label for="editorExerciseMode">Tipo de exercício</label><select id="editorExerciseMode"><option value="reps">Peso e repetições</option><option value="countdown">Tempo com duração-alvo</option><option value="stopwatch">Cronômetro livre</option></select></div>'
   +editorField('editorExerciseReps','Séries e repetições','12, 10, 8','text','Ex.: 3 x 10, 3 x MR ou 12, 10, 8')
   +'<div id="timedExerciseFields" style="display:none"><div class="field"><label for="editorTimedSetCount">Quantidade de séries</label><input id="editorTimedSetCount" type="number" min="1" max="30" value="3"></div><div class="field" id="targetSecondsField"><label for="editorTargetSeconds">Duração-alvo (segundos)</label><input id="editorTargetSeconds" type="number" min="1" max="86400" value="40"></div></div>'
   +editorField('editorExerciseRest','Descanso','90','text','Segundos, mm:ss ou minutos');
  showProgramEditor('Adicionar exercício',fields,async()=>{
   if(!isCurrentEditor())return false;
   const exerciseMode=$('editorExerciseMode')?.value||'reps';
   let reps=[];if(exerciseMode==='reps'){try{reps=parseRepScheme($('editorExerciseReps').value)}catch(err){alert(err.message);return false}}
   let rest;try{rest=parseRestSeconds($('editorExerciseRest').value)}catch(err){alert(err.message);return false}
   let item=null;
   if($('newCatalogExerciseFields').style.display!=='none'){
    try{const saved=await saveNewCatalogExercise($('newCatalogExerciseName').value,$('newCatalogExerciseCategory').value,db);if(!isCurrentEditor())return false;item=saved.item;if(saved.duplicate)alert('Esse exercício já existia no catálogo. Vamos reutilizar o cadastro existente.')}
    catch(err){if(isCurrentEditor())alert('Não foi possível cadastrar o exercício: '+err.message);return false}
   }else item=catalog.find(x=>String(x.id)===String($('editorCatalogExercise').value));
   if(!isCurrentEditor())return false;
   if(!item){alert('Selecione um exercício ou cadastre um novo.');return false}
   let sets;if(exerciseMode==='reps')sets=reps.map(value=>({reps:value,load_kg:null,mode:'reps'}));else{const count=Math.max(1,Math.min(30,Number($('editorTimedSetCount')?.value)||1));const target=Number($('editorTargetSeconds')?.value)||0;if(exerciseMode==='countdown'&&(!Number.isInteger(target)||target<1||target>86400)){alert('Informe uma duração-alvo entre 1 segundo e 24 horas.');return false}sets=Array.from({length:count},()=>({reps:0,load_kg:null,mode:exerciseMode,target_seconds:exerciseMode==='countdown'?target:null}))}
   const {data,error}=await db.from('training_exercises').select('position').eq('subworkout_id',subId).order('position',{ascending:false}).limit(1);
   if(!isCurrentEditor())return false;
   if(error){alert(error.message);return false}
   const result=await db.from('training_exercises').insert({subworkout_id:subId,name:normalizeHumanText(item.name),catalog_exercise_id:item.id,position:(data?.[0]?.position||0)+1,sets,rest_seconds:Math.max(0,Math.min(rest,3600)),media_url:item.demonstration_image_url||null,execution_instructions:item.execution_instructions||null,primary_muscles:item.primary_muscles||null,...(item.__visualFieldsAvailable?{media_end_url:item.demonstration_end_image_url||null,secondary_muscles:item.secondary_muscles||null}:{})});
   if(!isCurrentEditor())return false;
   if(result.error){alert(result.error.message);return false}
   await refresh();return true;
  });
  $('editorExerciseMode').onchange=()=>{$('timedExerciseFields').style.display=$('editorExerciseMode').value==='reps'?'none':'block';$('editorExerciseReps').parentElement.style.display=$('editorExerciseMode').value==='reps'?'block':'none';$('targetSecondsField').style.display=$('editorExerciseMode').value==='countdown'?'block':'none'};
  const pickerPanel=$('catalogPickerPanel'),pickerToggle=$('catalogPickerToggle'),pickerSelect=$('editorCatalogExercise');
  const renderCatalogPicker=(query='')=>{
   const key=exerciseSearchKey(query);
   const filtered=key?catalog.filter(item=>exerciseSearchKey(item.name+' '+(item.category||'')).includes(key)):catalog;
   const grouped=new Map();
   filtered.forEach(item=>{const category=normalizeHumanText(item.category||'Outros');if(!grouped.has(category))grouped.set(category,[]);grouped.get(category).push(item)});
   const html=[...grouped.entries()].sort((a,b)=>a[0].localeCompare(b[0],'pt-BR',{sensitivity:'base'})).map(([category,items])=>
    '<div style="font-weight:700;padding:7px 5px 3px;color:var(--text-muted,#9aa8b7)">'+esc(category)+'</div>'+
    items.sort((a,b)=>normalizeHumanText(a.name).localeCompare(normalizeHumanText(b.name),'pt-BR',{sensitivity:'base'})).map(item=>
     '<button type="button" data-catalog-pick="'+esc(item.id)+'" style="display:block;width:100%;text-align:left;padding:9px 8px;border:0;border-radius:6px;background:transparent;color:inherit">'+esc(normalizeHumanText(item.name))+'</button>'
    ).join('')
   ).join('');
   $('catalogPickerResults').innerHTML=html||'<p class="muted" style="padding:8px">Nenhum exercício encontrado.</p>';
  };
  renderCatalogPicker();
  pickerToggle.onclick=()=>{
   const opening=pickerPanel.style.display==='none';
   pickerPanel.style.display=opening?'block':'none';
   pickerToggle.setAttribute('aria-expanded',String(opening));
   if(opening)$('searchCatalogExercise').focus();
  };
  $('searchCatalogExercise').oninput=()=>renderCatalogPicker($('searchCatalogExercise').value);
  $('catalogPickerResults').onclick=e=>{
   const option=e.target.closest('[data-catalog-pick]');if(!option)return;
   const item=catalog.find(x=>String(x.id)===String(option.dataset.catalogPick));if(!item)return;
   pickerSelect.value=String(item.id);
   $('catalogPickerLabel').textContent=normalizeHumanText(item.name);
   pickerPanel.style.display='none';pickerToggle.setAttribute('aria-expanded','false');
  };
  $('toggleNewCatalogExercise').onclick=()=>{
   const panel=$('newCatalogExerciseFields'),opening=panel.style.display==='none';
   panel.style.display=opening?'block':'none';
   $('editorCatalogExercise').disabled=opening;
   $('catalogPickerToggle').disabled=opening;
   $('catalogPickerPanel').style.display='none';
   $('catalogPickerToggle').setAttribute('aria-expanded','false');
   if(opening)$('newCatalogExerciseName').focus();
  };
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
 async function editProgram(id,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const p=plans.find(x=>String(x.id)===String(id)),db=expectedDb;
  const isSameAccount=()=>userRef()?.id===expectedUserId&&!!p&&canManageProgramLocally(p);
  if(!db||!expectedUserId||!isSameAccount())return false;
  const prefix=(p.description||'').match(/^\[MODALIDADE:\s*[^\]]+\]\s*/i)?.[0]||'';
  const description=(p.description||'').replace(/^\[MODALIDADE:\s*[^\]]+\]\s*/i,'');
  showProgramEditor('Editar programa',editorField('editorProgramTitle','Nome do programa',p.title)+editorArea('editorProgramDescription','Descrição',description),async()=>{
   if(!isSameAccount())return false;
   const title=normalizeHumanText($('editorProgramTitle').value);if(!title)return alert('Informe um nome para o programa.');
   const {error}=await db.from('training_programs').update({title,description:prefix+normalizeHumanText($('editorProgramDescription').value)}).eq('id',p.id);
   if(!isSameAccount())return false;
   if(error){alert('Não foi possível salvar o programa: '+error.message);return false}
   await home();return true;
  });
 }
 async function archiveProgram(id,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const p=plans.find(x=>String(x.id)===String(id)),db=expectedDb;
  const isSameAccount=()=>userRef()?.id===expectedUserId&&!!p&&canManageProgramLocally(p);
  if(!db||!expectedUserId||!isSameAccount())return false;
  if(!confirm('Excluir este programa da lista de treinos? Ele será arquivado para preservar o histórico das sessões.'))return;
  if(!isSameAccount())return false;
  const {error}=await db.from('training_programs').update({status:'archived'}).eq('id',p.id);
  if(!isSameAccount())return false;
  if(error)return alert('Não foi possível excluir o programa: '+error.message);
  if(current?.id===p.id){current=null;version=null;subworkouts=[];editorSubworkoutId=null}
  await home();
 }
 async function restoreProgram(id,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const p=plans.find(x=>String(x.id)===String(id)),db=expectedDb;
  const isSameAccount=()=>userRef()?.id===expectedUserId&&!!p&&canManageProgramLocally(p);
  if(!db||!expectedUserId||!isSameAccount())return false;
  try{await assertUniqueActiveCategory(programCategory(p.description),p.id)}catch(err){if(isSameAccount())alert(err.message);return false}
  if(!isSameAccount())return false;
  const {error}=await db.from('training_programs').update({status:'active'}).eq('id',p.id);
  if(!isSameAccount())return false;
  if(error)return alert('Não foi possível restaurar o programa: '+error.message);
  showArchivedPlans=false;await home();
 }

 async function editSubworkout(id,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const db=expectedDb,program=current,programVersion=version,userId=expectedUserId,focusedSubworkoutId=editorSubworkoutId,item=subworkouts.find(x=>String(x.id)===String(id));
  const isCurrentEditor=()=>!!db&&!!userId&&!!program&&!!programVersion&&userRef()?.id===userId&&current?.id===program.id&&version?.id===programVersion.id&&editorSubworkoutId===focusedSubworkoutId&&!!item;
  if(!isCurrentEditor())return false;
  const refresh=async()=>{if(!isCurrentEditor())return;if(focusedSubworkoutId)await openWorkoutEditor(focusedSubworkoutId,userId,db);else await openProgram(program.id,userId,db)};
  showProgramEditor('Editar treino',editorField('editorSubTitle','Nome do treino',item.title)+editorArea('editorSubDescription','Descrição',item.description||''),async()=>{
   if(!isCurrentEditor())return false;
   const title=normalizeHumanText($('editorSubTitle').value);if(!title)return alert('Informe um nome para o treino.');
   const {error}=await db.from('training_subworkouts').update({title,description:normalizeHumanText($('editorSubDescription').value)||null}).eq('id',item.id);
   if(!isCurrentEditor())return false;
   if(error){alert('Não foi possível salvar o treino: '+error.message);return false}
   await refresh();return true;
  });
 }
 async function deleteSubworkout(id){
  const db=dbRef(),program=current,programVersion=version,userId=userRef()?.id,item=subworkouts.find(x=>String(x.id)===String(id));
  if(!db||!program||!programVersion||!userId||!item)return false;
  const isCurrentEditor=()=>userRef()?.id===userId&&current?.id===program.id&&version?.id===programVersion.id&&editorSubworkoutId===null;
  if(!confirm('Excluir o treino "'+item.title+'"?'))return;
  if(!isCurrentEditor())return false;
  const used=await db.from('training_sessions').select('id',{count:'exact',head:true}).eq('subworkout_id',item.id);
  if(!isCurrentEditor())return false;
  if(used.error)return alert('Não foi possível verificar o histórico: '+used.error.message);
  if((used.count||0)>0)return alert('Este treino já tem sessões registradas. Para preservar o histórico, ele não pode ser excluído.');
  const delExercises=await db.from('training_exercises').delete().eq('subworkout_id',item.id);
  if(!isCurrentEditor())return false;
  if(delExercises.error)return alert('Não foi possível excluir os exercícios: '+delExercises.error.message);
  const {error}=await db.from('training_subworkouts').delete().eq('id',item.id);
  if(!isCurrentEditor())return false;
  if(error)return alert('Não foi possível excluir o treino: '+error.message);
  await openProgram(program.id,userId,db);
 }
 function parseRestSeconds(value){
  const text=String(value??'').trim().toLocaleLowerCase('pt-BR');
  if(!text)return 0;
  const clock=text.match(/^(\d{1,2}):([0-5]?\d)$/);
  if(clock){const seconds=Number(clock[1])*60+Number(clock[2]);if(seconds>3600)throw new Error('O descanso deve ficar entre 0 e 60 minutos.');return seconds}
  const match=text.match(/^(\d+(?:[.,]\d+)?)\s*(min|minuto|minutos|m|s|seg|segundo|segundos)?$/);
  if(!match)throw new Error('Informe o descanso em segundos, minutos ou mm:ss.');
  const amount=Number(match[1].replace(',','.'));
  const unit=match[2]||'s';
  const seconds=/^(min|minuto|minutos|m)$/.test(unit)?amount*60:amount;
  if(!Number.isFinite(seconds)||seconds<0||seconds>3600)throw new Error('O descanso deve ficar entre 0 e 60 minutos.');
  return Math.round(seconds);
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
  const db=dbRef(),program=current,programVersion=version,userId=userRef()?.id,focusedSubworkoutId=editorSubworkoutId;
  if(!db||!program||!programVersion||!userId)return false;
  const isCurrentEditor=()=>userRef()?.id===userId&&current?.id===program.id&&version?.id===programVersion.id&&editorSubworkoutId===focusedSubworkoutId;
  const refresh=async()=>{if(!isCurrentEditor())return;if(focusedSubworkoutId)await openWorkoutEditor(focusedSubworkoutId,userId,db);else await openProgram(program.id,userId,db)};
  const q=await db.from('training_exercises').select('*').eq('id',id).maybeSingle();
  if(!isCurrentEditor())return false;
  if(q.error||!q.data)return alert('Não foi possível abrir o exercício para edição: '+(q.error?.message||'registro não encontrado'));
  let catalog;try{catalog=await loadExerciseCatalog(db)}catch(err){if(isCurrentEditor())alert(err.message);return false}
  if(!isCurrentEditor())return false;
  const e=q.data,initialReps=(e.sets||[]).map(x=>x.reps).join(', '),initialLoads=(e.sets||[]).map(x=>x.load_kg??'').join(';');
  const fields='<div class="field"><label for="editorCatalogExercise">Exercício</label><select id="editorCatalogExercise" required>'+exerciseCatalogOptions(catalog,e.catalog_exercise_id)+'</select></div>'
   +editorField('editorExerciseReps','Séries e repetições',initialReps,'text','Ex.: 3 x 10, 3 x MR ou 12, 10, 8')
   +editorField('editorExerciseLoads','Carga por série (kg)',initialLoads,'text','Ex.: 50; 50; 45')
   +'<p class="muted">Use ponto e vírgula para informar uma carga por série. Um único valor é aplicado a todas as séries. Se mudar a quantidade de séries e mantiver as cargas atuais, elas serão preservadas por posição.</p>'
   +editorField('editorExerciseRest','Descanso',String(e.rest_seconds??0),'text','Segundos, mm:ss ou minutos');
  showProgramEditor('Editar exercício',fields,async()=>{
   if(!isCurrentEditor())return false;
   const catalogId=$('editorCatalogExercise').value,item=catalog.find(x=>String(x.id)===String(catalogId));
   if(!item){alert('Selecione um exercício do banco.');return false}
   let reps;try{reps=parseRepScheme($('editorExerciseReps').value)}catch(err){alert(err.message);return false}
   const loadText=$('editorExerciseLoads').value,oldLoads=(e.sets||[]).map(x=>x.load_kg??null);
   let loads;
   if(loadText===initialLoads)loads=reps.map((_,i)=>oldLoads[i]??(i>0?oldLoads[i-1]??null:null));
   else if(!loadText.trim())loads=reps.map(()=>null);
   else{let parts=loadText.split(';').map(x=>x.trim());if(parts.length===1&&reps.length>1)parts=Array(reps.length).fill(parts[0]);if(parts.length!==reps.length){alert('Informe uma carga ou um valor por série.');return false}loads=parts.map(v=>v===''||v==='-'?null:Number(v.replace(',','.')));if(loads.some(v=>v!==null&&(!Number.isFinite(v)||v<0))){alert('Há uma carga inválida.');return false}}
   let rest;try{rest=parseRestSeconds($('editorExerciseRest').value.trim())}catch(err){alert(err.message);return false}
   const sets=reps.map((r,i)=>({reps:r,load_kg:loads[i]??null}));
   const sameCatalog=String(item.id)===String(e.catalog_exercise_id);
   const visualUpdate={media_url:item.demonstration_image_url||(sameCatalog?e.media_url:null),execution_instructions:item.execution_instructions||(sameCatalog?e.execution_instructions:null),primary_muscles:item.primary_muscles||(sameCatalog?e.primary_muscles:null)};
   if(item.__visualFieldsAvailable){visualUpdate.media_end_url=item.demonstration_end_image_url||(sameCatalog?e.media_end_url:null);visualUpdate.secondary_muscles=item.secondary_muscles||(sameCatalog?e.secondary_muscles:null)}
   const {error}=await db.from('training_exercises').update({name:normalizeHumanText(item.name),catalog_exercise_id:item.id,sets,rest_seconds:rest,...visualUpdate}).eq('id',id);
   if(!isCurrentEditor())return false;
   if(error){alert('Não foi possível salvar o exercício: '+error.message);return false}
   await refresh();return true;
  });
 }
 async function deleteExercise(id){
  const db=dbRef(),program=current,programVersion=version,userId=userRef()?.id,focusedSubworkoutId=editorSubworkoutId;
  if(!db||!program||!programVersion||!userId)return false;
  const isCurrentEditor=()=>userRef()?.id===userId&&current?.id===program.id&&version?.id===programVersion.id&&editorSubworkoutId===focusedSubworkoutId;
  const refresh=async()=>{if(!isCurrentEditor())return;if(focusedSubworkoutId)await openWorkoutEditor(focusedSubworkoutId,userId,db);else await openProgram(program.id,userId,db)};
  const q=await db.from('training_exercises').select('*').eq('id',id).maybeSingle();
  if(!isCurrentEditor())return false;
  if(q.error||!q.data)return alert('Não foi possível localizar o exercício.');
  if(!confirm('Excluir o exercício "'+q.data.name+'"?'))return;
  if(!isCurrentEditor())return false;
  const used=await db.from('training_set_logs').select('id',{count:'exact',head:true}).eq('exercise_id',id);
  if(!isCurrentEditor())return false;
  if(used.error)return alert('Não foi possível verificar o histórico: '+used.error.message);
  if((used.count||0)>0)return alert('Este exercício tem séries registradas. Para preservar o histórico, ele não pode ser excluído.');
  const {error}=await db.from('training_exercises').delete().eq('id',id);
  if(!isCurrentEditor())return false;
  if(error)return alert('Não foi possível excluir o exercício: '+error.message);
  await refresh();
 }
 async function requestDeletion(expectedUserId=userRef()?.id,expectedDb=dbRef(),expectedProgram=current){
  return withProgramActionLock('deleteRequest',async()=>{
   const db=expectedDb,program=expectedProgram,userId=expectedUserId;
   const isCurrentProgram=()=>!!db&&!!userId&&userRef()?.id===userId&&current?.id===program?.id;
   if(!isCurrentProgram())return false;
   const reason=prompt('Motivo do pedido de arquivamento (opcional):')||null;
   if(!isCurrentProgram())return false;
   const {error}=await db.from('training_program_deletion_requests').insert({program_id:program.id,requested_by:userId,reason});
   if(!isCurrentProgram())return false;
   if(error)return alert(error.message);
   const updated=await db.from('training_programs').update({status:'deletion_pending'}).eq('id',program.id);
   if(!isCurrentProgram())return false;
   if(updated.error)return alert(updated.error.message);
   await db.from('app_notifications').insert({user_id:program.athlete_id,type:'deletion_request',title:'Pedido de arquivamento',body:'Um profissional solicitou arquivar um programa. Aprove ou rejeite o pedido.',entity_id:program.id});
   if(!isCurrentProgram())return false;
   alert('Pedido enviado ao atleta para aprovação.');
  });
 }
 let sessionPlan=[],sessionIndex=0,sessionExerciseRows=[],sessionLoads={},sessionSetLogs=[],skippedSetKeys=new Set(),skippedExerciseIndices=new Set();
 let previousLoadsByExercise={};
 function exerciseIdentity(name){return String(name??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR')}
 async function preloadPreviousLoads(exercises,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const u=userRef(),db=expectedDb;if(!u||!db||!exercises?.length||u.id!==expectedUserId)return;
  const isSameAccount=()=>userRef()?.id===expectedUserId;
  previousLoadsByExercise={};
  const wanted=new Set(exercises.map(e=>exerciseIdentity(e.name)).filter(Boolean));if(!wanted.size)return;
  const activeSessionId=session?.id||'00000000-0000-0000-0000-000000000000';
  const [sessions,allExercises]=await Promise.all([
   db.from('training_sessions').select('id').eq('athlete_id',expectedUserId).neq('id',activeSessionId).order('started_at',{ascending:false}).limit(500),
   db.from('training_exercises').select('id,name')
  ]);
  if(!isSameAccount())return;
  if(sessions.error||allExercises.error){console.warn('Não foi possível consultar cargas anteriores',sessions.error||allExercises.error);return}
  const matching=(allExercises.data||[]).filter(e=>wanted.has(exerciseIdentity(e.name)));
  if(!matching.length||!sessions.data?.length){previousLoadsByExercise={};return}
  const sessionIds=sessions.data.map(x=>x.id),exerciseIds=matching.map(x=>x.id),nameById=new Map(matching.map(x=>[x.id,exerciseIdentity(x.name)])),nextLoads={};
  const logs=await db.from('training_set_logs').select('exercise_id,reps_completed,load_kg,completed_at,session_id').in('session_id',sessionIds).in('exercise_id',exerciseIds).not('load_kg','is',null).not('reps_completed','is',null).order('completed_at',{ascending:false}).limit(5000);
  if(!isSameAccount())return;
  if(logs.error){console.warn('Não foi possível consultar cargas anteriores',logs.error);return}
  for(const row of logs.data||[]){const identity=nameById.get(row.exercise_id),reps=Number(row.reps_completed),load=Number(row.load_kg);if(!identity||!Number.isFinite(reps)||reps<1||!Number.isFinite(load)||load<0)continue;if(!nextLoads[identity])nextLoads[identity]={};if(nextLoads[identity][reps]===undefined)nextLoads[identity][reps]=load}
  if(isSameAccount())previousLoadsByExercise=nextLoads;
 }
 let sessionView='picker',restSnapshot=null,restoreAttempted=false,restorePromise=null,restoreUserId=null,restoreGeneration=0;
 const sessionStorageKeyFor=userId=>'nexfit-active-workout:'+String(userId||'');
 const sessionStorageKey=()=>sessionStorageKeyFor(userRef()?.id);
 function persistWorkoutState(){
  if(!session||!userRef()?.id)return false;
  try{const rest=activeRest?{deadline:activeRest.deadline,total:activeRest.total,remaining:activeRest.remaining,paused:activeRest.paused,nextText:activeRest.nextText,notified:activeRest.notified,itemIndex:sessionIndex}:null;
   localStorage.setItem(sessionStorageKey(),JSON.stringify({userId:userRef().id,sessionId:session.id,programId:current?.id,versionId:version?.id,subworkoutId:session.subworkout_id,sessionIndex,sessionLoads,skippedSetKeys:[...skippedSetKeys],skippedExerciseIndices:[...skippedExerciseIndices],view:sessionView,rest,exerciseTimer:activeExerciseTimer?{...activeExerciseTimer}:null,draftReps:$('sessionReps')?.value??null,draftLoad:$('sessionLoad')?.value??null,session,sessionSetLogs,sessionExerciseRows,current,version,subworkouts,localOnly:!!session.localOnly,updatedAt:Date.now()}));
   return true;
  }catch(e){console.warn('Não foi possível guardar a sessão localmente',e);return false}
 }
 function clearPersistedWorkout(userId=userRef()?.id){try{if(userId)localStorage.removeItem(sessionStorageKeyFor(userId))}catch(_){}}
 function queueWorkoutCancellation(sessionId,userId=userRef()?.id){
  if(!sessionId||!userId)return false;
  try{
   const key='nexfit-pending-workout-cancellations:'+String(userId),pending=JSON.parse(localStorage.getItem(key)||'[]');
   const queue=Array.isArray(pending)?pending:[];
   if(!queue.some(item=>item.sessionId===sessionId))queue.push({userId,sessionId,queuedAt:new Date().toISOString()});
   localStorage.setItem(key,JSON.stringify(queue));return true;
  }catch(error){console.warn('Não foi possível guardar o cancelamento pendente',error);return false}
 }
 async function syncPendingWorkoutCancellations(syncUserId,syncDb){
  if(!navigator.onLine||!syncDb||!syncUserId||userRef()?.id!==syncUserId)return false;
  const key='nexfit-pending-workout-cancellations:'+syncUserId;let pending=[];
  try{pending=JSON.parse(localStorage.getItem(key)||'[]')}catch(_){return false}
  if(!Array.isArray(pending)||!pending.length)return true;
  for(const item of pending){
   if(!item?.sessionId||item.userId!==syncUserId)continue;
   const logs=await syncDb.from('training_set_logs').delete().eq('session_id',item.sessionId);
   if(logs.error||userRef()?.id!==syncUserId)return false;
   const removed=await syncDb.from('training_sessions').delete().eq('id',item.sessionId).eq('athlete_id',syncUserId);
   if(removed.error||userRef()?.id!==syncUserId)return false;
   pending=pending.filter(row=>row.sessionId!==item.sessionId);
   try{localStorage.setItem(key,JSON.stringify(pending))}catch(error){console.warn('Cancelamento concluído, mas não foi possível atualizar a fila local',error);return false}
  }
  return true;
 }
 async function restoreWorkoutState(){
  if(session)return true;const u=userRef(),db=dbRef(),generation=restoreGeneration;if(!u||!db)return false;
  let saved;try{saved=JSON.parse(localStorage.getItem(sessionStorageKey())||'null')}catch(_){saved=null}
  if(!saved||saved.userId!==u.id||!saved.sessionId)return false;
  if(saved.session?.status==='completed'||saved.session?.finished_at){await syncPendingWorkout();return false}
  let remoteSession=null,remoteLogs=null;
  if(navigator.onLine&&!saved.localOnly){
   const sq=await db.from('training_sessions').select('*').eq('id',saved.sessionId).eq('athlete_id',u.id).maybeSingle();
   if(!sq.error&&sq.data)remoteSession=sq.data;
   if(remoteSession){const lq=await db.from('training_set_logs').select('*').eq('session_id',saved.sessionId);if(!lq.error)remoteLogs=lq.data||[]}
  }
  if(generation!==restoreGeneration||userRef()?.id!==u.id)return false;
  const localFallback=!!(saved.session&&saved.current&&saved.version&&saved.sessionExerciseRows?.length);
  if(!remoteSession&&!localFallback)return false;
  if(remoteSession&&!localFallback){
   const [pq,vq,wq,eq]=await Promise.all([
    db.from('training_programs').select('*').eq('id',saved.programId).maybeSingle(),
    db.from('training_program_versions').select('*').eq('id',saved.versionId).maybeSingle(),
    db.from('training_subworkouts').select('*').eq('version_id',saved.versionId).order('position'),
    db.from('training_exercises').select('*').eq('subworkout_id',saved.subworkoutId).order('position')
   ]);
   if(generation!==restoreGeneration||userRef()?.id!==u.id)return false;
   if(pq.error||vq.error||wq.error||eq.error||!pq.data||!vq.data||!eq.data?.length)return false;
   saved.current=pq.data;saved.version=vq.data;saved.subworkouts=wq.data||[];saved.sessionExerciseRows=eq.data;saved.session=remoteSession;
  }
  if(generation!==restoreGeneration||userRef()?.id!==u.id)return false;
  if(remoteSession?.status==='completed'){clearPersistedWorkout();return false}
  session=remoteSession||saved.session;current=saved.current;version=saved.version;subworkouts=saved.subworkouts||[];
  sessionExerciseRows=saved.sessionExerciseRows||[];sessionPlan=[];
  sessionExerciseRows.forEach((exercise,exerciseIndex)=>(exercise.sets||[]).forEach((set,setIndex)=>sessionPlan.push({exercise,exerciseIndex,set,setIndex})));
  const localLogs=Array.isArray(saved.sessionSetLogs)?saved.sessionSetLogs:[],serverLogs=Array.isArray(remoteLogs)?remoteLogs:null;
  if(serverLogs){
   const mergedLogs=new Map();
   for(const row of serverLogs)if(row?.exercise_id!=null&&row?.set_number!=null)mergedLogs.set(String(row.exercise_id)+':'+String(row.set_number),row);
   for(const row of localLogs)if(row?.exercise_id!=null&&row?.set_number!=null){const key=String(row.exercise_id)+':'+String(row.set_number);if(!mergedLogs.has(key))mergedLogs.set(key,row)}
   sessionSetLogs=[...mergedLogs.values()];
  }else sessionSetLogs=localLogs;sessionIndex=Math.max(0,Math.min(Number(saved.sessionIndex)||0,Math.max(0,sessionPlan.length-1)));
  sessionLoads=saved.sessionLoads||{};skippedSetKeys=new Set(saved.skippedSetKeys||[]);skippedExerciseIndices=new Set(saved.skippedExerciseIndices||[]);sessionView=saved.view||'picker';restSnapshot=saved.rest||null;activeExerciseTimer=saved.exerciseTimer?{...saved.exerciseTimer}:null;
  if(sessionView==='exercise'){
   shell('Executando exercício','<div id="sessionExercises"></div>');renderSessionStep();
   if(saved.draftLoad!==null&&$('sessionLoad')){$('sessionLoad').value=saved.draftLoad;$('sessionLoad').dataset.userEdited='true'}
   if(saved.draftReps!==null&&$('sessionReps'))$('sessionReps').value=saved.draftReps;
   if(restSnapshot&&sessionPlan[restSnapshot.itemIndex]){
    const item=sessionPlan[restSnapshot.itemIndex],rest=restSnapshot,advance=()=>{if(timer)clearInterval(timer);timer=null;activeRest=null;restSnapshot=null;advanceAfterSet(item)};
    activeRest={deadline:rest.deadline,total:rest.total,remaining:rest.remaining,paused:rest.paused,advance,nextText:rest.nextText,notified:rest.notified};
    restoreActiveRestUI();
   }
  }else renderExercisePicker();
  persistWorkoutState();
  if(navigator.onLine)syncPendingWorkout();
  return true;
 }
 window.resetStrengthUserState=function(){
   window.resetWorkoutHistoryUserState?.();
   window.resetNexfitExerciseEvolutionUserState?.();
  $('programEditorModal')?.classList.remove('show');
  if(session)persistWorkoutState();
  plans=[];activeTrainingTab='mine';showArchivedPlans=false;window.__nexfitOfflineMode=false;
  ['programList','programManagement','trainingManagement','exerciseEvolution','accessList','notifications'].forEach(id=>{const node=$(id);if(node)node.replaceChildren()});
  restoreGeneration++;restoreAttempted=false;restoreUserId=null;restorePromise=null;
  if(timer)clearInterval(timer);timer=null;activeRest=null;restSnapshot=null;
  session=null;sessionPlan=[];sessionIndex=0;sessionExerciseRows=[];sessionLoads={};sessionSetLogs=[];
  skippedSetKeys.clear();skippedExerciseIndices.clear();current=null;version=null;subworkouts=[];editorSubworkoutId=null;previousLoadsByExercise={};savingSet=false;savingSetOwner=null;finishingSession=false;finishingSessionOwner=null;
 };
 async function syncPendingWorkout(){
  const syncUserId=userRef()?.id,syncDb=dbRef();if(!syncUserId||!syncDb)return false;
  const existingSync=workoutSyncPromises.get(syncUserId);if(existingSync)return existingSync;
  const isSameAccount=()=>userRef()?.id===syncUserId;
  const runSync=async()=>{
  if(!navigator.onLine||!isSameAccount())return false;
  if(!await syncPendingWorkoutCancellations(syncUserId,syncDb)||!isSameAccount())return false;
  const storageKey=sessionStorageKeyFor(syncUserId);
  let saved;try{saved=JSON.parse(localStorage.getItem(storageKey)||'null')}catch(_){saved=null}
  if(!saved||saved.userId!==syncUserId||!saved.session)return false;
  try{
  const pendingSession=saved.session,logs=saved.sessionSetLogs||[];
  const sessionPayload={id:pendingSession.id,athlete_id:syncUserId,program_id:saved.programId,version_id:saved.versionId,subworkout_id:saved.subworkoutId,started_at:pendingSession.started_at,status:'in_progress'};
  const created=await syncDb.from('training_sessions').upsert(sessionPayload,{onConflict:'id',ignoreDuplicates:true});
  if(created.error||!isSameAccount())return false;
  if(logs.length){
   const rows=logs.map(row=>({session_id:pendingSession.id,exercise_id:row.exercise_id,set_number:row.set_number,reps_completed:row.reps_completed,load_kg:row.load_kg??null,duration_seconds:row.duration_seconds??null,distance_m:row.distance_m??null,notes:row.notes??null,completed_at:row.completed_at||new Date().toISOString()}));
   const savedLogs=await syncDb.from('training_set_logs').upsert(rows,{onConflict:'session_id,exercise_id,set_number',ignoreDuplicates:true});
   if(savedLogs.error||!isSameAccount())return false;
  }
  if(pendingSession.status==='completed'||pendingSession.finished_at){
   const finishedAt=pendingSession.finished_at||new Date().toISOString();
   const updated=await syncDb.from('training_sessions').update({status:'completed',finished_at:finishedAt}).eq('id',pendingSession.id).eq('athlete_id',syncUserId);
   if(updated.error||!isSameAccount())return false;
   const started=new Date(pendingSession.started_at||Date.now()),finished=new Date(finishedAt);
   const minutes=Math.max(1,Math.round((finished.getTime()-started.getTime())/60000));
   const sub=(saved.subworkouts||[]).find(x=>x.id===saved.subworkoutId)||{title:'Treino'};
   const title=saved.current?.title||'Treino';
   const notes=title+' · '+(sub.title||'Treino')+' [NEXFIT_SESSION:'+pendingSession.id+']';
   const now=new Date(finishedAt),date=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
   const existing=await syncDb.from('activities').select('id').eq('user_id',syncUserId).eq('notes',notes).maybeSingle();
   if(existing.error||!isSameAccount())return false;
   let activityId=existing.data?.id;
   if(!existing.data){
    const activity=await syncDb.from('activities').insert({id:pendingSession.id,user_id:syncUserId,sport:'Musculação',activity_date:date,duration_minutes:minutes,distance_km:null,notes}).select('id').single();
    if(!isSameAccount())return false;
    if(activity.error){
     const raced=await syncDb.from('activities').select('id').eq('id',pendingSession.id).eq('user_id',syncUserId).eq('notes',notes).maybeSingle();
     if(raced.error||!raced.data||!isSameAccount())return false;
     activityId=raced.data.id;
    }else activityId=activity.data.id;
   }
   if(!isSameAccount())return false;
   if(typeof activities!=='undefined'&&!activities.some(item=>item.id===activityId))activities.unshift({id:activityId,sport:'Musculação',date,duration:minutes,distance:0,notes});
   try{localStorage.removeItem(storageKey)}catch(_){}
   if(typeof window.render==='function')window.render();
   return true;
  }
  if(!isSameAccount())return false;
  saved.localOnly=false;saved.session.localOnly=false;try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch(_){}
  if(isSameAccount()&&session?.id===pendingSession.id){session.localOnly=false;persistWorkoutState()}
  return true;
  }catch(error){console.warn('Falha ao sincronizar treino offline',error);return false}
  };
  const syncPromise=(async()=>{
   if(navigator.locks?.request){
    return navigator.locks.request('nexfit-workout-sync:'+syncUserId,async()=>{
     if(!isSameAccount())return false;
     return runSync();
    });
   }
   return runSync();
  })();
  workoutSyncPromises.set(syncUserId,syncPromise);
  try{return await syncPromise}finally{if(workoutSyncPromises.get(syncUserId)===syncPromise)workoutSyncPromises.delete(syncUserId)}
 }

 window.addEventListener('online',()=>{syncPendingWorkout().then(ok=>{if(ok&&session?.status==='completed'){session=null;home()}}).catch(error=>console.warn('Falha ao sincronizar treino pendente',error))});
 window.addEventListener('pagehide',persistWorkoutState);window.addEventListener('beforeunload',persistWorkoutState);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')persistWorkoutState();else if(navigator.onLine)syncPendingWorkout()});

 function formatWorkoutTime(seconds){const value=Math.max(0,Math.floor(Number(seconds)||0));return String(Math.floor(value/60)).padStart(2,'0')+':'+String(value%60).padStart(2,'0')}
 function exerciseTimerElapsed(){if(!activeExerciseTimer)return 0;return Math.max(0,(Number(activeExerciseTimer.elapsedSeconds)||0)+(activeExerciseTimer.running?Math.floor((Date.now()-activeExerciseTimer.startedAt)/1000):0))}
 function startExerciseTimer(){const item=sessionPlan[sessionIndex];if(!item||!item.set?.mode||item.set.mode==='reps')return;if(!activeExerciseTimer)activeExerciseTimer={mode:item.set.mode,targetSeconds:Number(item.set.target_seconds)||0,elapsedSeconds:0,running:false,startedAt:null};if(activeExerciseTimer.running)return;activeExerciseTimer.startedAt=Date.now();activeExerciseTimer.running=true;persistWorkoutState();if(timer)clearInterval(timer);timer=setInterval(tickExerciseTimer,200);tickExerciseTimer()}
 function pauseExerciseTimer(){if(!activeExerciseTimer?.running)return;activeExerciseTimer.elapsedSeconds=exerciseTimerElapsed();activeExerciseTimer.running=false;activeExerciseTimer.startedAt=null;if(timer)clearInterval(timer);timer=null;persistWorkoutState();tickExerciseTimer()}
 function tickExerciseTimer(){if(!activeExerciseTimer)return;const elapsed=exerciseTimerElapsed(),target=activeExerciseTimer.targetSeconds,remaining=Math.max(0,target-elapsed),clock=$('exerciseClock'),button=$('completeSet');if(clock)clock.textContent=formatWorkoutTime(activeExerciseTimer.mode==='countdown'?remaining:elapsed);const toggle=$('toggleExerciseTimer');if(toggle)toggle.textContent=activeExerciseTimer.running?'Pausar':'Continuar';if(activeExerciseTimer.mode==='countdown'&&target>0&&remaining===0&&activeExerciseTimer.running){activeExerciseTimer.elapsedSeconds=target;activeExerciseTimer.running=false;activeExerciseTimer.startedAt=null;if(timer)clearInterval(timer);timer=null;if(button)button.textContent='Registrando…';completeCurrentSet();return}if(button)button.textContent=activeExerciseTimer.mode==='countdown'?'Concluir série':'Registrar tempo';const second=Math.floor(elapsed);if(second!==lastExerciseTimerPersistedSecond){lastExerciseTimerPersistedSecond=second;persistWorkoutState()}}
 function renderExecutionMuscleMap(primary=[],secondary=[]){
  primary=Array.isArray(primary)?primary:[];secondary=Array.isArray(secondary)?secondary:[];
  const keyFor=value=>{
   const key=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
   if(/peitoral|chest/.test(key))return 'chest';
   if(/ombro|deltoid|shoulder/.test(key))return 'shoulders';
   if(/triceps/.test(key))return 'triceps';
   if(/biceps/.test(key))return 'biceps';
   if(/antebraco|forearm/.test(key))return 'forearms';
   if(/dorsal|latissimus|lats/.test(key))return 'lats';
   if(/costas|upper back|rhomboid/.test(key))return 'back';
   if(/trapezio|traps/.test(key))return 'traps';
   if(/lombar|lower back|erector/.test(key))return 'lower_back';
   if(/abdomen|core|abdominal/.test(key))return 'core';
   if(/obliquo/.test(key))return 'obliques';
   if(/glute/.test(key))return 'glutes';
   if(/quadriceps|quad/.test(key))return 'quads';
   if(/posterior|hamstring/.test(key))return 'hamstrings';
   if(/panturrilha|calf|calves/.test(key))return 'calves';
   if(/tibial/.test(key))return 'tibialis';
   if(/pescoco|neck/.test(key))return 'neck';
   return null;
  };
  const p=new Set((Array.isArray(primary)?primary:[]).map(keyFor).filter(Boolean));
  const s=new Set((Array.isArray(secondary)?secondary:[]).map(keyFor).filter(k=>k&&!p.has(k)));
  if(!p.size&&!s.size)return '';
  const cls=k=>'muscle-region '+(p.has(k)?'primary':s.has(k)?'secondary':'');
  const shapes=[
   ['chest','<ellipse cx="75" cy="62" rx="11" ry="8"/><ellipse cx="95" cy="62" rx="11" ry="8"/>'],
   ['shoulders','<circle cx="54" cy="43" r="8"/><circle cx="116" cy="43" r="8"/>'],
   ['biceps','<ellipse cx="50" cy="67" rx="5" ry="12"/><ellipse cx="120" cy="67" rx="5" ry="12"/>'],
   ['triceps','<ellipse cx="218" cy="70" rx="5" ry="12"/><ellipse cx="278" cy="70" rx="5" ry="12"/>'],
   ['forearms','<path d="M45 82 Q40 94 42 105 L49 107 Q52 95 53 83Z"/><path d="M125 82 Q130 94 128 105 L121 107 Q118 95 117 83Z"/>'],
   ['core','<rect x="74" y="73" width="22" height="31" rx="8"/>'],
   ['obliques','<path d="M68 73 Q62 84 68 101 L74 99 L74 76Z"/><path d="M102 73 Q108 84 102 101 L96 99 L96 76Z"/>'],
   ['quads','<path d="M70 108 Q65 119 68 143 L78 144 L81 111Z"/><path d="M90 111 L93 144 L103 143 Q106 119 101 108Z"/>'],
   ['calves','<path d="M69 148 Q65 160 70 176 L78 176 L80 148Z"/><path d="M90 148 L92 176 L100 176 Q105 160 101 148Z"/>'],
   ['lats','<path d="M231 55 Q218 62 224 91 L239 101 L246 63Z"/><path d="M249 63 L256 101 L271 91 Q277 62 264 55Z"/>'],
   ['back','<path d="M239 48 L249 48 L253 76 L235 76Z"/>'],
   ['traps','<path d="M237 39 L249 39 L260 57 L249 63 L226 57Z"/>'],
   ['lower_back','<rect x="239" y="77" width="10" height="22" rx="4"/>'],
   ['glutes','<ellipse cx="239" cy="105" rx="9" ry="8"/><ellipse cx="257" cy="105" rx="9" ry="8"/>'],
   ['hamstrings','<path d="M235 114 Q230 127 234 145 L244 145 L248 115Z"/><path d="M250 115 L254 145 L264 145 Q268 127 263 114Z"/>'],
   ['tibialis','<path d="M234 148 L243 148 L241 176 L234 176Z"/><path d="M255 148 L264 148 L264 176 L257 176Z"/>'],
   ['neck','<rect x="76" y="25" width="18" height="13" rx="5"/><rect x="239" y="25" width="18" height="13" rx="5"/>']
  ];
  const region=key=>shapes.filter(x=>x[0]===key).map(x=>x[1].replace(/<(ellipse|circle|rect|path)/g,'<$1 class="'+cls(key)+'"')).join('');
  const labels=[...primary.map(x=>({name:x,role:'primary'})),...secondary.filter(x=>!primary.includes(x)).map(x=>({name:x,role:'secondary'}))];
  const body='<g class="body-base"><circle cx="85" cy="16" r="10"/><rect x="76" y="26" width="18" height="12" rx="5"/><path d="M67 39 Q58 41 56 51 L63 99 Q70 106 85 106 Q100 106 107 99 L114 51 Q112 41 103 39Z"/><path d="M57 46 Q48 45 45 58 L36 99 Q35 106 42 108 Q49 109 51 101 L65 58Z"/><path d="M113 46 Q122 45 125 58 L134 99 Q135 106 128 108 Q121 109 119 101 L105 58Z"/><path d="M68 103 L81 105 L78 151 L72 183 L62 183 L64 149Z"/><path d="M89 105 L102 103 L106 149 L108 183 L98 183 L92 151Z"/><circle cx="248" cy="16" r="10"/><rect x="239" y="26" width="18" height="12" rx="5"/><path d="M230 39 Q221 41 219 51 L226 99 Q233 106 248 106 Q263 106 270 99 L277 51 Q275 41 266 39Z"/><path d="M220 46 Q211 45 208 58 L199 99 Q198 106 205 108 Q212 109 214 101 L228 58Z"/><path d="M276 46 Q285 45 288 58 L297 99 Q298 106 291 108 Q284 109 282 101 L268 58Z"/><path d="M231 103 L244 105 L241 151 L235 183 L225 183 L227 149Z"/><path d="M252 105 L265 103 L269 149 L271 183 L261 183 L255 151Z"/></g>';
  const muscleShapes=['chest','shoulders','biceps','triceps','forearms','core','obliques','quads','calves','lats','back','traps','lower_back','glutes','hamstrings','tibialis','neck'].map(region).join('');
  const primaryNames=primary.length?primary.join(' · '):'—';
  const secondaryNames=secondary.length?secondary.join(' · '):'—';
  return '<section class="execution-muscle-map"><h3>Grupos musculares</h3><p>Veja quais músculos recebem maior estímulo neste exercício.</p><div class="execution-muscle-summary"><div class="primary"><strong>● Principais</strong><p>'+esc(primaryNames)+'</p></div><div class="secondary"><strong>● Secundários</strong><p>'+esc(secondaryNames)+'</p></div></div><details><summary>Ver mapa ilustrativo do corpo</summary><svg class="muscle-map-svg" viewBox="0 0 320 190" role="img" aria-label="Mapa muscular frontal e posterior">'+body+'<g>'+muscleShapes+'</g><g fill="#a0a99c" font-size="9" text-anchor="middle"><text x="85" y="189">Frente</text><text x="248" y="189">Costas</text></g></svg><div class="muscle-map-legend"><span><i></i>Principal</span><span><i></i>Secundário</span></div></details></section>';
 }
  function renderSessionStep(){
  sessionView='exercise';
  const host=$('sessionExercises');if(!host)return;
  if(sessionIndex>=sessionPlan.length){renderExercisePicker();return}
  const item=sessionPlan[sessionIndex],e=item.exercise,set=item.set,setNo=item.setIndex+1,total=(e.sets||[]).length;
  const planned=set.reps==='MR'?'MR':Number(set.reps)||0,loadKey=e.id+':'+item.setIndex,identity=exerciseIdentity(e.name);
  const previousLoad=planned==='MR'?null:previousLoadsByExercise[identity]?.[planned];
  if(sessionLoads[loadKey]===undefined)sessionLoads[loadKey]=previousLoad??set.load_kg??(item.setIndex>0?(sessionLoads[e.id+':'+(item.setIndex-1)]??''):'');
  const loadValue=sessionLoads[loadKey],loggedSets=sessionSetLogs.length,allSets=sessionPlan.length;
  const media=e.media_url?'<div class="execution-media-pair"><figure><img class="execution-media" src="'+esc(e.media_url)+'" alt="Posição inicial de '+esc(normalizeHumanText(e.name))+'"><figcaption>Posição inicial</figcaption></figure>'+(e.media_end_url&&e.media_end_url!==e.media_url?'<figure><img class="execution-media" src="'+esc(e.media_end_url)+'" alt="Posição final de '+esc(normalizeHumanText(e.name))+'"><figcaption>Posição final</figcaption></figure>':'')+'</div>':'';
  const muscleMap=renderExecutionMuscleMap(e.primary_muscles,e.secondary_muscles);
  const instructions=e.execution_instructions?'<div class="execution-feedback" style="margin:10px 0 12px"><strong>Como executar</strong><p style="margin:6px 0 0;white-space:pre-line">'+esc(e.execution_instructions)+'</p></div>':'';
  host.innerHTML='<div class="execution-screen"><header class="execution-header"><button class="execution-back" type="button" id="exitSession" aria-label="Voltar para o início" title="Voltar para o início"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><strong>'+esc(normalizeHumanText(current.title))+'</strong><span>'+(item.exerciseIndex+1)+' / '+sessionExerciseRows.length+'</span></header><div class="execution-progress"><span style="width:'+Math.round((loggedSets/Math.max(1,allSets))*100)+'%"></span></div><div class="execution-exercise-heading"><h2>'+esc(normalizeHumanText(e.name))+'</h2><p>'+(e.notes?esc(e.notes):'Exercício '+(item.exerciseIndex+1)+' do treino')+'</p></div>'+media+instructions+muscleMap+(set.mode&&set.mode!=='reps'?'<div class="execution-stat" style="margin:12px 0"><span>'+(set.mode==='countdown'?'Duração-alvo':'Cronômetro livre')+'</span><strong id="exerciseClock" style="display:block;font-size:42px;text-align:center">'+formatWorkoutTime(activeExerciseTimer?exerciseTimerElapsed():(set.mode==='countdown'?Number(set.target_seconds)||0:0))+'</strong><small>'+(set.mode==='countdown'?'Tempo restante':'Tempo realizado')+'</small><button class="btn alt" type="button" id="toggleExerciseTimer">'+(activeExerciseTimer?.running?'Pausar':activeExerciseTimer?.elapsedSeconds?'Continuar':'Iniciar')+'</button></div>':'')+'<div class="execution-stats"><div class="execution-stat"><span>Séries</span><strong>'+setNo+'/'+total+'</strong></div><div class="execution-stat"><span>Repetições</span><strong>'+(planned==='MR'?'MR':planned)+'</strong></div><div class="execution-stat execution-load-stat"><label for="sessionLoad">Carga</label><div class="execution-load-control"><button type="button" id="loadDown" aria-label="Diminuir carga">−</button><input id="sessionLoad" type="number" min="0" step="0.25" placeholder="kg" value="'+(loadValue??'')+'" aria-label="Carga em quilogramas"><button type="button" id="loadUp" aria-label="Aumentar carga">+</button></div><small id="previousLoadHint">'+(previousLoad!==undefined&&previousLoad!==null?'Última carga registrada':'kg')+'</small></div></div>'+(planned==='MR'?'<label class="execution-reps-label" for="sessionReps">Repetições realizadas</label><input class="execution-reps-input" id="sessionReps" type="number" min="1" placeholder="Informe quantas conseguiu">':'')+'<div class="execution-feedback" id="executionFeedback" role="status" aria-live="polite" data-state="info"></div><div class="execution-actions"><button class="execution-primary" type="button" id="completeSet">'+(set.mode&&set.mode!=='reps'?'Registrar tempo':'Registrar carga')+'</button><button class="execution-secondary" type="button" id="skipSet">Pular</button></div><button class="execution-skip-exercise" type="button" id="skipExercise">Pular exercício</button><div class="execution-rest" id="restPanel" hidden><div class="execution-rest-heading">DESCANSO</div><div class="execution-rest-row"><div class="execution-rest-dial" id="restDial" style="--progress:100"><div><strong id="restClock">00:00</strong><span>Descanso</span></div></div><button class="execution-pause" type="button" id="pauseRest" aria-label="Pausar descanso" title="Pausar descanso"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg></button></div><p id="nextStepText"></p><button class="execution-secondary execution-skip-rest" type="button" id="skipRest">Pular descanso</button></div></div>';
  host.querySelectorAll('.execution-media').forEach(img=>{
   img.dataset.originalSrc=img.getAttribute('src')||'';
   img.dataset.fallbackStep='0';
   img.onerror=()=>{
    const step=Number(img.dataset.fallbackStep||'0'),original=img.dataset.originalSrc||'';
    if(step===0&&original.includes('raw.githubusercontent.com/MarvinNazari/exercise-images/')){
     img.dataset.fallbackStep='1';
     img.src=original.replace('https://raw.githubusercontent.com/MarvinNazari/exercise-images/','https://cdn.jsdelivr.net/gh/MarvinNazari/exercise-images@');
     return;
    }
    if(step===1&&original.includes('raw.githubusercontent.com/MarvinNazari/exercise-images/')){
     img.dataset.fallbackStep='2';
     img.src=original.replace('https://raw.githubusercontent.com/MarvinNazari/exercise-images/','https://fastly.jsdelivr.net/gh/MarvinNazari/exercise-images@');
     return;
    }
    img.hidden=true;
    const note=document.createElement('div');
    note.className='execution-image-unavailable';
    note.textContent='Demonstração visual indisponível no momento';
    img.parentElement.insertBefore(note,img.nextSibling);
   };
  });
  $('sessionLoad').oninput=()=>{sessionLoads[loadKey]=$('sessionLoad').value;$('sessionLoad').dataset.userEdited='true';persistWorkoutState()};
  if($('sessionReps'))$('sessionReps').oninput=()=>{const actual=Number($('sessionReps').value),suggested=previousLoadsByExercise[identity]?.[actual],loadInput=$('sessionLoad');if(suggested!==undefined&&loadInput&&!loadInput.dataset.userEdited){loadInput.value=String(suggested);sessionLoads[loadKey]=String(suggested);const hint=$('previousLoadHint');if(hint)hint.textContent='Última carga registrada'}persistWorkoutState()};
  $('loadDown').onclick=()=>adjustLoad(loadKey,-2.5);$('loadUp').onclick=()=>adjustLoad(loadKey,2.5);
  if(set.mode&&set.mode!=='reps'){$('toggleExerciseTimer').onclick=()=>activeExerciseTimer?.running?pauseExerciseTimer():startExerciseTimer();if(activeExerciseTimer?.running){if(timer)clearInterval(timer);timer=setInterval(tickExerciseTimer,200)}tickExerciseTimer()}else activeExerciseTimer=null;
  $('skipExercise').onclick=skipCurrentExercise;
  $('pauseRest').onclick=toggleRestPause;$('exitSession').onclick=exitSessionToHome;
 }
 function restoreActiveRestUI(){
  if(!activeRest)return false;
  const rest=activeRest,panel=$('restPanel'),actions=document.querySelector('.execution-actions'),skipExercise=$('skipExercise');
  if(!panel)return false;
  panel.hidden=false;
  const nextText=$('nextStepText');if(nextText)nextText.textContent=rest.nextText;
  if(actions)actions.hidden=true;if(skipExercise)skipExercise.hidden=true;
  const pauseButton=$('pauseRest');
  if(pauseButton){
   pauseButton.onclick=toggleRestPause;
   if(rest.paused){pauseButton.setAttribute('aria-label','Continuar descanso');pauseButton.title='Continuar descanso';pauseButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7z"/></svg>'}
   else{pauseButton.setAttribute('aria-label','Pausar descanso');pauseButton.title='Pausar descanso';pauseButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>'}
  }
  const skipButton=$('skipRest');if(skipButton)skipButton.onclick=()=>{if(activeRest===rest)rest.advance()};
  if(timer)clearInterval(timer);timer=null;
  if(rest.paused)tickRestTimer();
  else{timer=setInterval(tickRestTimer,250);tickRestTimer()}
  return true;
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
 async function saveSetLogOnce(row,db=dbRef()){
  if(!db)throw new Error('Conexão com o banco indisponível.');
  const {error}=await db.from('training_set_logs').upsert(row,{onConflict:'session_id,exercise_id,set_number',ignoreDuplicates:true});
  if(error)throw new Error(error.message);
  const {data,error:readError}=await db.from('training_set_logs').select('*').eq('session_id',row.session_id).eq('exercise_id',row.exercise_id).eq('set_number',row.set_number).single();
  if(readError||!data)throw new Error(readError?.message||'Não foi possível confirmar o registro da série.');
  return data;
 }
 async function skipCurrentSet(){
  if(savingSet){setExecutionFeedback('Já existe um registro de série em andamento. Aguarde.');return}
  if(!session){setExecutionFeedback('A sessão de treino não está ativa.','error');return}
  const sessionId=session.id,userId=userRef()?.id,db=dbRef(),isCurrent=()=>userRef()?.id===userId&&session?.id===sessionId;
  const item=sessionPlan[sessionIndex];
  if(!item){setExecutionFeedback('Não foi possível identificar a série atual.','error');return}
  if(hasSetLog(item.exercise.id,item.setIndex+1)){setExecutionFeedback('Esta série já estava registrada. Recuperando a execução…','success');continueAfterRecordedSet(item);return}
  if(!await showWorkoutDialog({title:'Pular esta série?',message:'Esta série será registrada com 0 repetições e 0 kg. As demais séries deste exercício continuarão normalmente.',confirmLabel:'Sim, pular série',danger:true})){setExecutionFeedback('Tudo certo. A série foi mantida.');return}
  if(!isCurrent())return;
  const isTimed=!!item.set?.mode&&item.set.mode!=='reps';
  const row={session_id:sessionId,exercise_id:item.exercise.id,set_number:item.setIndex+1,reps_completed:0,load_kg:isTimed?null:0,duration_seconds:null,notes:'Série pulada pelo atleta',completed_at:new Date().toISOString()};
  if(isTimed){activeExerciseTimer=null;lastExerciseTimerPersistedSecond=-1;if(timer)clearInterval(timer);timer=null}
  const button=$('skipSet'),completeButton=$('completeSet');
  savingSet=true;savingSetOwner=sessionId;if(button)button.disabled=true;if(completeButton)completeButton.disabled=true;
  try{
   setExecutionFeedback('Salvando série neste aparelho…');
   if(!hasSetLog(row.exercise_id,row.set_number))sessionSetLogs.push(row);
   if(!persistWorkoutState()){sessionSetLogs=sessionSetLogs.filter(x=>!(x.exercise_id===row.exercise_id&&Number(x.set_number)===Number(row.set_number)));throw new Error('Não há espaço disponível para guardar a série neste aparelho.')}
   if(navigator.onLine&&!session.localOnly){
    try{const savedRow=await saveSetLogOnce(row,db);if(!isCurrent())return;sessionSetLogs=sessionSetLogs.map(x=>x.exercise_id===savedRow.exercise_id&&Number(x.set_number)===Number(savedRow.set_number)?savedRow:x);setExecutionFeedback('Série sincronizada com sucesso.','success')}
    catch(_){if(!isCurrent())return;setExecutionFeedback('Série guardada neste aparelho; sincronização pendente.','success')}
   }else setExecutionFeedback('Série guardada neste aparelho; será sincronizada quando a conexão voltar.','success');
   if(!isCurrent())return;
   skippedSetKeys.add(item.exercise.id+':'+(item.setIndex+1));persistWorkoutState();
  }catch(error){
   if(!isCurrent())return;
   if(button)button.disabled=false;if(completeButton)completeButton.disabled=false;
   setExecutionFeedback('Não foi possível guardar a série: '+(error?.message||'verifique o armazenamento.'),'error');
   alert('Não foi possível guardar a série. '+(error?.message||'Verifique o armazenamento do aparelho.'));
   return;
  }finally{if(savingSetOwner===sessionId){savingSet=false;savingSetOwner=null}}
  if(!isCurrent())return;
  setExecutionFeedback('Série marcada como não realizada.','success');advanceAfterSet(item);
 }
 async function skipCurrentExercise(){
  if(!session)return;
  const item=sessionPlan[sessionIndex];if(!item)return;
  if(!await showWorkoutDialog({title:'Pular exercício?',message:'O exercício “'+item.exercise.name+'” será marcado como não realizado e você voltará à lista para escolher outro.',confirmLabel:'Sim, pular exercício',danger:true}))return;
  skippedExerciseIndices.add(item.exerciseIndex);
  for(const planItem of sessionPlan.filter(x=>x.exerciseIndex===item.exerciseIndex&&!hasSetLog(x.exercise.id,x.setIndex+1)))skippedSetKeys.add(planItem.exercise.id+':'+(planItem.setIndex+1));
  persistWorkoutState();renderExercisePicker();
 }
 function hasSetLog(exerciseId,setNumber){
  return sessionSetLogs.some(x=>x.exercise_id===exerciseId&&Number(x.set_number)===Number(setNumber));
 }
 function exerciseProgress(index){
  const exercise=sessionExerciseRows[index],sets=exercise?.sets||[];
  const logForSet=(setNumber)=>sessionSetLogs.find(x=>x.exercise_id===exercise.id&&Number(x.set_number)===Number(setNumber));
  const done=sets.filter((set,i)=>{const row=logForSet(i+1);return row&&(set.mode&&set.mode!=='reps'?Number(row.duration_seconds)>0:Number(row.reps_completed)>0)}).length;
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
   const summary=(e.sets||[]).map(x=>x.mode==='countdown'?formatWorkoutTime(x.target_seconds)+' alvo':x.mode==='stopwatch'?'Cronômetro livre':x.reps==='MR'?'MR':x.reps+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':'')).join(' / ');
   return '<div class="item"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><strong style="font-size:17px">'+(index+1)+'. '+esc(normalizeHumanText(e.name))+'</strong><span class="tag" style="color:'+color+'">'+label+'</span></div><p class="muted">'+p.done+'/'+p.total+' séries · '+summary+' · descanso '+(e.rest_seconds||0)+' s</p>'+(p.status!=='done'?'<button type="button" class="btn" data-begin-ex="'+index+'">'+(p.status==='partial'||p.status==='skipped'?'Continuar exercício':'Iniciar exercício')+'</button><span class="exercise-status-actions"><button type="button" class="exercise-status-icon" data-mark-done="'+index+'" aria-label="Marcar como feito" title="Marcar como feito"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></svg></button><button type="button" class="exercise-status-icon skipped" data-mark-skipped="'+index+'" aria-label="Marcar como não executado" title="Marcar como não executado"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/></svg></button></span>':'')+'</div>';
  }).join('');
  const offlineNotice=(!navigator.onLine||session.localOnly)?'<p class="muted" style="border:1px solid #526b32;border-radius:10px;padding:9px">Modo offline: o treino e as séries ficam guardados neste aparelho e serão sincronizados quando a conexão voltar.</p>':'';
  shell('Escolha o próximo exercício','<div class="panel">'+offlineNotice+'<h3>'+esc(normalizeHumanText(current.title))+' · '+esc(normalizeHumanText(sub?.title||'Treino'))+'</h3><p class="muted">Escolha qualquer exercício disponível. Se o aparelho estiver ocupado, marque como não executado e continue com outro.</p>'+cards+'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="finishWorkout">Finalizar treino</button><button class="btn alt" id="cancelSession">Sair sem finalizar</button></div></div>');
  section.querySelectorAll('[data-begin-ex]').forEach(b=>b.onclick=()=>beginExercise(Number(b.dataset.beginEx)));
  section.querySelectorAll('[data-mark-done]').forEach(b=>b.onclick=()=>markExerciseDone(Number(b.dataset.markDone)));
  section.querySelectorAll('[data-mark-skipped]').forEach(b=>b.onclick=()=>markExerciseNotDone(Number(b.dataset.markSkipped)));
$('finishWorkout').onclick=async()=>{const unfinished=sessionExerciseRows.map((_,i)=>exerciseProgress(i)).filter(x=>x.status!=='done').length;if(unfinished&&!await showWorkoutDialog({title:'Finalizar treino?',message:unfinished+' exercício(s) ainda não estão marcados como feitos. Eles aparecerão como não realizados ou parciais no histórico. Deseja finalizar mesmo assim?',confirmLabel:'Finalizar treino',danger:true}))return;finishSession()};
  $('cancelSession').onclick=exitSessionToHome;
 }
 async function exitSessionToHome(){
  if(savingSet||finishingSession){await showWorkoutDialog({title:'Só um instante',message:'A gravação ou conclusão do treino ainda está em andamento. Aguarde alguns segundos antes de sair.',confirmLabel:'Entendi',cancelLabel:'Fechar'});return;}
  if(!session)return;
  if(!await showWorkoutDialog({title:'Sair sem finalizar?',message:'As séries registradas nesta sessão e a sessão atual serão apagadas. Se preferir continuar, seu treino ficará salvo para você retomar depois.',confirmLabel:'Sim, sair e apagar',danger:true}))return;
  const cancelUserId=userRef()?.id,cancelDb=dbRef(),sessionId=session.id,localOnly=!!session.localOnly;
  if(!cancelUserId||!cancelDb){await showWorkoutDialog({title:'Não foi possível sair',message:'Não identificamos a conta desta sessão. Seu treino permanece salvo e nenhum registro foi apagado.',confirmLabel:'Entendi'});return;}
  const isSameAccount=()=>userRef()?.id===cancelUserId;
  const queueAndClearCapturedSession=()=>{
   if(!queueWorkoutCancellation(sessionId,cancelUserId))return false;
   clearPersistedWorkout(cancelUserId);return true;
  };
  const resetCancelledSession=()=>{
   if(!isSameAccount()||session?.id!==sessionId)return false;
   clearPersistedWorkout(cancelUserId);restSnapshot=null;if(timer)clearInterval(timer);timer=null;activeRest=null;session=null;sessionPlan=[];sessionIndex=0;sessionExerciseRows=[];sessionLoads={};sessionSetLogs=[];skippedSetKeys.clear();skippedExerciseIndices.clear();return true;
  };
  if(!navigator.onLine){
   if(!queueAndClearCapturedSession()){await showWorkoutDialog({title:'Treino preservado',message:'Não foi possível guardar o cancelamento neste aparelho. Seu treino continua salvo. Libere espaço e tente novamente.',confirmLabel:'Entendi',danger:true});return;}
   if(isSameAccount()&&resetCancelledSession())home();
   await showWorkoutDialog({title:'Treino cancelado',message:'A sessão foi removida deste aparelho. A exclusão no servidor será concluída quando a conexão voltar.',confirmLabel:'Entendi'});return;
  }
  if(localOnly){if(resetCancelledSession())home();return}
  const {error:logsError}=await cancelDb.from('training_set_logs').delete().eq('session_id',sessionId);
  if(!isSameAccount()){
   if(!queueAndClearCapturedSession())alert('A conta mudou durante o cancelamento e não foi possível guardar a exclusão pendente. Não limpe os dados deste navegador.');
   return;
  }
  if(logsError){await showWorkoutDialog({title:'Não foi possível cancelar',message:'Não conseguimos apagar as séries registradas: '+logsError.message,confirmLabel:'Entendi',danger:true});return;}
  const {error:sessionError}=await cancelDb.from('training_sessions').delete().eq('id',sessionId).eq('athlete_id',cancelUserId);
  if(!isSameAccount()){
   if(!queueAndClearCapturedSession())alert('A conta mudou durante o cancelamento e não foi possível guardar a exclusão pendente. Não limpe os dados deste navegador.');
   return;
  }
  if(sessionError){await showWorkoutDialog({title:'Cancelamento incompleto',message:'As séries foram apagadas, mas não foi possível remover a sessão. Tente novamente ou contate o suporte: '+sessionError.message,confirmLabel:'Entendi',danger:true});return;}
  if(!resetCancelledSession())return;
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
  if(savingSet)return setExecutionFeedback('Já existe um registro de série em andamento. Aguarde.');
  const exercise=sessionExerciseRows[index];if(!exercise||!session)return;
  const sessionId=session.id,userId=userRef()?.id,db=dbRef(),isCurrent=()=>userRef()?.id===userId&&session?.id===sessionId;
  const pending=sessionPlan.filter(x=>x.exerciseIndex===index&&!hasSetLog(x.exercise.id,x.setIndex+1));
  if(pending.some(x=>x.set.mode&&x.set.mode!=='reps'))return alert('Para registrar exercícios por tempo, inicie o cronômetro de cada série e conclua o registro ao terminar.');
  if(!pending.length)return renderExercisePicker();
  if(!await showWorkoutDialog({title:'Marcar como feito?',message:'As séries pendentes de “'+exercise.name+'” serão registradas usando as repetições e cargas programadas. Você poderá ajustar os valores no histórico.',confirmLabel:'Sim, marcar como feito'}))return;
  if(!isCurrent())return;
  const rows=[];
  for(const item of pending){
   let reps=item.set.reps;
   if(reps==='MR'){const value=await showWorkoutDialog({title:'Quantas repetições você fez?',message:'Informe as repetições realizadas na série '+(item.setIndex+1)+' de “'+exercise.name+'”.',confirmLabel:'Continuar',input:{label:'Repetições realizadas',placeholder:'Ex.: 12',min:1,step:1}});if(value===null)return;reps=Number(value)}
   rows.push({session_id:sessionId,exercise_id:exercise.id,set_number:item.setIndex+1,reps_completed:Number(reps),load_kg:item.set.load_kg??null});
  }
  if(!isCurrent())return;
  for(const row of rows)row.completed_at=new Date().toISOString();
  const previousLogs=sessionSetLogs.slice(),previousSkippedKeys=new Set(skippedSetKeys),previousSkippedExercises=new Set(skippedExerciseIndices);
  savingSet=true;savingSetOwner=sessionId;
  try{
   for(const row of rows)if(!hasSetLog(row.exercise_id,row.set_number))sessionSetLogs.push(row);
   skippedExerciseIndices.delete(index);
   for(const row of rows)skippedSetKeys.delete(row.exercise_id+':'+row.set_number);
   if(!persistWorkoutState()){
    sessionSetLogs=previousLogs;skippedSetKeys=previousSkippedKeys;skippedExerciseIndices=previousSkippedExercises;
    alert('Não foi possível guardar as séries deste exercício neste aparelho. Libere espaço no armazenamento e tente novamente. Nenhuma série foi confirmada.');return;
   }
   if(navigator.onLine&&!session.localOnly){
    for(const row of rows){
     try{const saved=await saveSetLogOnce(row,db);if(!isCurrent())return;sessionSetLogs=sessionSetLogs.map(x=>x.exercise_id===saved.exercise_id&&Number(x.set_number)===Number(saved.set_number)?saved:x)}
     catch(_){if(!isCurrent())return;setExecutionFeedback('Séries guardadas neste aparelho; sincronização pendente.','success')}
    }
   }
   if(!isCurrent())return;
   persistWorkoutState();renderExercisePicker();
  }finally{if(savingSetOwner===sessionId){savingSet=false;savingSetOwner=null}}
 }
 async function markExerciseNotDone(index){
  const exercise=sessionExerciseRows[index];if(!exercise)return;
  if(!await showWorkoutDialog({title:'Marcar como não realizado?',message:'“'+exercise.name+'” ficará registrado como não realizado. As séries já concluídas serão preservadas.',confirmLabel:'Sim, não realizado',danger:true}))return;
  const previousSkippedKeys=new Set(skippedSetKeys),previousSkippedExercises=new Set(skippedExerciseIndices);
  skippedExerciseIndices.add(index);
  for(let i=0;i<(exercise.sets||[]).length;i++)if(!hasSetLog(exercise.id,i+1))skippedSetKeys.add(exercise.id+':'+(i+1));
  if(!persistWorkoutState()){
   skippedSetKeys=previousSkippedKeys;skippedExerciseIndices=previousSkippedExercises;
   return alert('Não foi possível guardar a alteração neste aparelho. Libere espaço no armazenamento e tente novamente. O exercício permanece pendente.');
  }
  renderExercisePicker();
 }
 function advanceAfterSet(item){
  sessionIndex++;restSnapshot=null;activeExerciseTimer=null;lastExerciseTimerPersistedSecond=-1;persistWorkoutState();
  const next=sessionPlan[sessionIndex];
  if(next&&next.exerciseIndex===item.exerciseIndex)renderSessionStep();else renderExercisePicker();
 }
 function continueAfterRecordedSet(item){
  activeExerciseTimer=null;lastExerciseTimerPersistedSecond=-1;
  const nextItem=sessionPlan[sessionIndex+1];
  if(!nextItem||nextItem.exerciseIndex!==item.exerciseIndex){advanceAfterSet(item);return}
  let rest;try{rest=parseRestSeconds(item.exercise.rest_seconds)}catch(error){setExecutionFeedback('Série registrada, mas o descanso configurado é inválido. Avançando sem timer.','error');advanceAfterSet(item);return}
  const panel=$('restPanel'),complete=$('completeSet');
  if(complete)complete.disabled=true;
  const actions=document.querySelector('.execution-actions'),skipExercise=$('skipExercise');
  if(actions)actions.hidden=true;if(skipExercise)skipExercise.hidden=true;
  if(!rest){advanceAfterSet(item);return}
  if(!panel){alert('Série registrada, mas não foi possível abrir o painel de descanso.');advanceAfterSet(item);return}
  panel.hidden=false;const deadline=Date.now()+rest*1000;
  const next=sessionPlan[sessionIndex+1],sameExercise=next&&next.exerciseIndex===item.exerciseIndex;
  const nextIdentity=sameExercise?exerciseIdentity(next.exercise.name):null,nextReps=sameExercise&&next.set.reps!=='MR'?Number(next.set.reps):null;
  const suggestedNextLoad=nextReps!==null&&Number.isFinite(nextReps)?previousLoadsByExercise[nextIdentity]?.[nextReps]:undefined;
  const nextLoad=sameExercise?(suggestedNextLoad??next.set.load_kg??sessionLoads[next.exercise.id+':'+next.setIndex]??null):null;
  const nextText=sameExercise?'Próxima: série '+(next.setIndex+1)+' de '+next.exercise.name+' · '+(next.set.reps==='MR'?'MR':next.set.reps+' reps')+' · carga '+(nextLoad==null?'a informar':nextLoad+' kg'):next?'Exercício concluído. Após o descanso, escolha qual exercício iniciar.':'Último descanso do treino.';
  $('nextStepText').textContent=nextText;
  const advance=()=>{if(timer)clearInterval(timer);timer=null;activeRest=null;advanceAfterSet(item)};
  activeRest={deadline,total:rest,remaining:rest,paused:false,advance,nextText,notified:false};restSnapshot={deadline,total:rest,remaining:rest,paused:false,nextText,notified:false,itemIndex:sessionIndex};persistWorkoutState();
  $('skipRest').onclick=advance;
  timer=setInterval(tickRestTimer,250);tickRestTimer();
 }
 async function completeCurrentSet(){
  if(savingSet){setExecutionFeedback('Já existe um registro de série em andamento.');return}
  if(!session){setExecutionFeedback('A sessão de treino não está ativa. Volte à lista de exercícios.','error');return alert('A sessão de treino não está ativa. Volte à lista de exercícios e tente novamente.')}
  const sessionId=session.id,userId=userRef()?.id,db=dbRef(),isCurrent=()=>userRef()?.id===userId&&session?.id===sessionId;
  const item=sessionPlan[sessionIndex],button=$('completeSet');
  if(!item){setExecutionFeedback('Não foi possível identificar a série atual.','error');return alert('Não foi possível identificar a série atual. Atualize a tela do exercício antes de continuar.')}
  if(hasSetLog(item.exercise.id,item.setIndex+1)){setExecutionFeedback('Esta série já estava registrada. Recuperando a execução…','success');continueAfterRecordedSet(item);return}
  const isTimed=!!item.set?.mode&&item.set.mode!=='reps';
  const timedSeconds=isTimed?Math.max(0,Math.floor(exerciseTimerElapsed())):0;
  if(isTimed&&activeExerciseTimer){activeExerciseTimer.elapsedSeconds=timedSeconds;activeExerciseTimer.running=false;activeExerciseTimer.startedAt=null}
  const repsInput=$('sessionReps');
  const reps=isTimed?'0':(repsInput?repsInput.value.trim():String(item.set.reps??''));
  const load=$('sessionLoad')?.value.trim()??'';
  if(!isTimed&&(!reps||reps==='MR'||Number(reps)<1)){setExecutionFeedback('Informe as repetições realizadas.','error');return alert('Informe as repetições realizadas.')}
  if(isTimed&&timedSeconds<1){setExecutionFeedback('Inicie o cronômetro e registre ao concluir.','error');return alert('Registre pelo menos um segundo de execução.')}
  if(load!==''&&!Number.isFinite(Number(load))){setExecutionFeedback('Informe uma carga válida.','error');return alert('Informe uma carga válida.')}
  if(load!=='')sessionLoads[item.exercise.id+':'+item.setIndex]=load;
  const row={session_id:sessionId,exercise_id:item.exercise.id,set_number:item.setIndex+1,reps_completed:Number(reps),load_kg:isTimed?null:(load===''?(item.set.load_kg??null):Number(load)),duration_seconds:isTimed?timedSeconds:null,completed_at:new Date().toISOString()};
  if(isTimed){activeExerciseTimer=null;if(timer)clearInterval(timer);timer=null}
  savingSet=true;savingSetOwner=sessionId;if(button)button.disabled=true;setExecutionFeedback('Salvando série neste aparelho…');
  try{
   if(!hasSetLog(row.exercise_id,row.set_number))sessionSetLogs.push(row);
   skippedSetKeys.delete(item.exercise.id+':'+(item.setIndex+1));if(!persistWorkoutState())throw new Error('Não há espaço disponível para guardar o treino neste aparelho.');
   if(navigator.onLine&&!session.localOnly){
    try{
     const savedRow=await saveSetLogOnce(row,db);
     if(!isCurrent())return;
     sessionSetLogs=sessionSetLogs.map(x=>x.exercise_id===savedRow.exercise_id&&Number(x.set_number)===Number(savedRow.set_number)?savedRow:x);
     setExecutionFeedback('Série registrada e sincronizada. Preparando o descanso…','success');
    }catch(_){if(!isCurrent())return;setExecutionFeedback('Série guardada neste aparelho; sincronização pendente.','success')}
   }else setExecutionFeedback('Série guardada neste aparelho; será sincronizada quando a conexão voltar.','success');
   if(!isCurrent())return;
   persistWorkoutState();
  }catch(error){
   if(!isCurrent())return;
   if(button)button.disabled=false;
   setExecutionFeedback('Não foi possível guardar a série neste aparelho: '+(error?.message||'verifique o armazenamento disponível.'),'error');
   alert('Não foi possível guardar a série. '+(error?.message||'Verifique o armazenamento do aparelho.'));
   return;
  }finally{if(savingSetOwner===sessionId){savingSet=false;savingSetOwner=null}}
  if(!isCurrent())return;
  continueAfterRecordedSet(item);
 }
 async function startSession(subId,cachedExercises=null,expectedUserId=userRef()?.id,expectedDb=dbRef()){
  const db=expectedDb,user=userRef(),userId=expectedUserId,program=current,programVersion=version;let exercises=cachedExercises;
  if(!db||!user||!userId||user.id!==userId||!program||!programVersion)return false;
  const isSameAccount=()=>userRef()?.id===userId;
  if(navigator.onLine){
   try{const ex=await db.from('training_exercises').select('*').eq('subworkout_id',subId).order('position');if(!isSameAccount())return false;if(!ex.error&&ex.data?.length)exercises=ex.data;else if(!exercises?.length)return alert('Não foi possível carregar os exercícios. Abra este treino com internet antes de iniciar offline.')}catch(error){if(!isSameAccount())return false;if(!exercises?.length)return alert('Sem conexão e sem cópia offline deste treino. Abra-o com internet antes de iniciar.')}
  }
  if(!isSameAccount())return false;
  if(!exercises?.length)return alert('Este treino não possui exercícios disponíveis neste aparelho.');
  await enableWorkoutNotifications();
  if(!isSameAccount())return false;
  try{if(navigator.storage?.persist)await navigator.storage.persist()}catch(_){}
  if(!isSameAccount())return false;
  const startedAt=new Date().toISOString();
  const sessionId=window.crypto?.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)});
  const payload={id:sessionId,athlete_id:userId,program_id:program.id,version_id:programVersion.id,subworkout_id:subId,started_at:startedAt,status:'in_progress'};
  let created=null,localOnly=true;
  if(navigator.onLine){
   try{
    const result=await db.from('training_sessions').insert(payload).select().single();
    if(!isSameAccount()){
     if(!result.error){if(!queueWorkoutCancellation(sessionId,userId)){const cleanup=await db.from('training_sessions').delete().eq('id',sessionId).eq('athlete_id',userId);if(cleanup.error)console.warn('Não foi possível limpar uma sessão iniciada antes da troca de conta',cleanup.error)}}
     return false;
    }
    if(!result.error){created=result.data;localOnly=false}
    else if(!/failed to fetch|networkerror|load failed|fetch failed|offline|err_internet|timeout/i.test(String(result.error.message||'')))return alert('Não foi possível iniciar a sessão: '+result.error.message);
   }catch(error){if(!isSameAccount())return false;console.warn('Iniciando sessão local por falha de conexão',error)}
  }
  if(!isSameAccount()){
   if(created&&!queueWorkoutCancellation(sessionId,userId)){const cleanup=await db.from('training_sessions').delete().eq('id',sessionId).eq('athlete_id',userId);if(cleanup.error)console.warn('Não foi possível limpar uma sessão iniciada antes da troca de conta',cleanup.error)}
   return false;
  }
  session={...(created||payload),localOnly};sessionExerciseRows=exercises;sessionView='picker';sessionPlan=[];sessionSetLogs=[];skippedSetKeys=new Set();skippedExerciseIndices=new Set();
  try{await preloadPreviousLoads(exercises,userId,db)}catch(_){}
  if(!isSameAccount()||session?.id!==sessionId)return false;
  exercises.forEach((exercise,exerciseIndex)=>(exercise.sets||[]).forEach((set,setIndex)=>sessionPlan.push({exercise,exerciseIndex,set,setIndex})));
  sessionIndex=0;sessionLoads={};
  if(!persistWorkoutState()){
   session=null;sessionPlan=[];sessionExerciseRows=[];
   if(created){const cleanup=await db.from('training_sessions').delete().eq('id',sessionId).eq('athlete_id',userId);if(cleanup.error&&!queueWorkoutCancellation(sessionId,userId))console.warn('Não foi possível remover a sessão que não pôde ser salva localmente',cleanup.error)}
   return alert('Não foi possível guardar a sessão neste aparelho. Libere espaço no armazenamento e tente novamente.');
  }
  renderExercisePicker();
 }
 function showWorkoutDialog({title,message,confirmLabel='Confirmar',cancelLabel='Cancelar',danger=false,input=null}){
  return new Promise(resolve=>{
   const old=$('workoutActionDialog');if(old)old.remove();
   const overlay=document.createElement('div');overlay.id='workoutActionDialog';overlay.className='workout-dialog-backdrop';
   overlay.innerHTML='<section class="workout-dialog" role="dialog" aria-modal="true" aria-labelledby="workoutDialogTitle" aria-describedby="workoutDialogMessage"><div class="workout-dialog-mark '+(danger?'danger':'')+'">'+(danger?'!':'✓')+'</div><h2 id="workoutDialogTitle">'+esc(title)+'</h2><p id="workoutDialogMessage">'+esc(message)+'</p>'+(input?'<label class="workout-dialog-input-label" for="workoutDialogInput">'+esc(input.label)+'</label><input id="workoutDialogInput" class="workout-dialog-input" type="number" min="'+input.min+'" step="'+input.step+'" placeholder="'+esc(input.placeholder)+'" inputmode="numeric">':'')+'<div class="workout-dialog-actions"><button type="button" class="workout-dialog-cancel">'+esc(cancelLabel)+'</button><button type="button" class="workout-dialog-confirm '+(danger?'danger':'')+'">'+esc(confirmLabel)+'</button></div></section>';
   section.append(overlay);
   const finish=value=>{overlay.remove();resolve(value)};
   overlay.querySelector('.workout-dialog-cancel').onclick=()=>finish(null);
   overlay.querySelector('.workout-dialog-confirm').onclick=()=>{if(!input)return finish(true);const field=overlay.querySelector('#workoutDialogInput'),value=field.value.trim();if(!value||!Number.isFinite(Number(value))||Number(value)<Number(input.min)){field.setCustomValidity('Informe um número válido.');field.reportValidity();return}finish(value)};
   overlay.addEventListener('click',event=>{if(event.target===overlay)finish(null)});
   overlay.onkeydown=event=>{if(event.key==='Escape'){event.preventDefault();finish(null)}if(event.key==='Enter'&&event.target.tagName==='INPUT'){event.preventDefault();overlay.querySelector('.workout-dialog-confirm').click()}};
   const field=overlay.querySelector('#workoutDialogInput');(field||overlay.querySelector('.workout-dialog-confirm')).focus();
  });
 }
 function renderWorkoutCompletion(summary){
  const duration=formatWorkoutTime(summary.durationSeconds);
  const subtitle=summary.allExercisesDone
   ?'Você concluiu todas as etapas deste treino. Excelente trabalho — seu progresso foi registrado!'
   :'Seu treino foi finalizado e o que você realizou ficou registrado. Continue evoluindo no seu ritmo.';
  section.classList.remove('training-gallery');
  section.innerHTML='<div class="completion-screen">'+
   '<div class="completion-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg></div>'+
   '<p class="completion-workout">'+esc(summary.workoutTitle)+'</p>'+
   '<h1>'+(summary.allExercisesDone?'Parabéns!':'Boa sessão!')+'</h1>'+
   '<p class="completion-subtitle">'+subtitle+'</p>'+
   '<div class="completion-stats">'+
    '<div class="completion-stat"><strong>'+duration+'</strong><span>Tempo de treino</span></div>'+
    '<div class="completion-stat"><strong>'+summary.completedSets+'/'+summary.totalSets+'</strong><span>Séries registradas</span></div>'+
    '<div class="completion-stat"><strong>'+summary.completedExercises+'/'+summary.totalExercises+'</strong><span>Exercícios concluídos</span></div>'+
    '<div class="completion-stat"><strong>'+summary.skippedExercises+'</strong><span>Não concluídos/parciais</span></div>'+
   '</div>'+
   '<div class="completion-sync '+(summary.synced?'':'pending')+'" role="status" aria-live="polite">'+
    (summary.synced?'✓ Treino sincronizado com seu histórico.':'↻ Treino salvo neste aparelho. A sincronização será concluída automaticamente quando a conexão voltar. Não apague os dados do navegador antes disso.')+
   '</div>'+
   '<div class="completion-actions"><button type="button" class="completion-primary" id="completionBackToWorkouts">Voltar aos treinos</button><button type="button" class="completion-secondary" id="completionGoHome">Ir para o início</button></div>'+
  '</div>';
  $('completionBackToWorkouts').onclick=()=>home();
  $('completionGoHome').onclick=()=>{const homeTab=document.querySelector('.nav button[data-page="home"]');if(homeTab)homeTab.click();else home()};
 }
 async function finishSession(){
  if(savingSet)return alert('Aguarde o registro das séries terminar antes de finalizar o treino.');
  if(!session||finishingSession)return;
  const sessionId=session.id,userId=userRef()?.id,isCurrent=()=>userRef()?.id===userId&&session?.id===sessionId;
  finishingSession=true;finishingSessionOwner=sessionId;
  const finishButton=$('finishWorkout');if(finishButton)finishButton.disabled=true;
  restSnapshot=null;if(timer)clearInterval(timer);timer=null;activeRest=null;
  const finishedAt=new Date().toISOString();
  session.status='completed';session.finished_at=finishedAt;if(!persistWorkoutState()){
   session.status='in_progress';session.finished_at=null;
   if(finishingSessionOwner===sessionId){finishingSession=false;finishingSessionOwner=null}
   if(finishButton)finishButton.disabled=false;
   return alert('Não foi possível guardar a conclusão neste aparelho. Libere espaço e tente novamente.')
  }
  const synced=await syncPendingWorkout();
  if(!isCurrent())return;
  const progress=sessionExerciseRows.map((_,i)=>exerciseProgress(i));
  const totalSets=sessionPlan.length;
  const completedSets=sessionSetLogs.filter(row=>Number(row.duration_seconds)>0||Number(row.reps_completed)>0).length;
  const completedExercises=progress.filter(item=>item.status==='done').length;
  const summary={
   workoutTitle:subworkouts.find(item=>String(item.id)===String(session.subworkout_id))?.title||'Treino',
   durationSeconds:Math.max(0,Math.round((new Date(finishedAt).getTime()-new Date(session.started_at||finishedAt).getTime())/1000)),
   completedSets,totalSets,completedExercises,totalExercises:sessionExerciseRows.length,
   skippedExercises:progress.filter(item=>item.status!=='done').length,
   allExercisesDone:progress.length>0&&progress.every(item=>item.status==='done'),
   synced:!!synced
  };
  if(synced)clearPersistedWorkout(userId);
  session=null;sessionPlan=[];sessionExerciseRows=[];sessionSetLogs=[];
  if(finishingSessionOwner===sessionId){finishingSession=false;finishingSessionOwner=null}
  renderWorkoutCompletion(summary);
 }
 window.beginStrengthActivity=async function(){
  const db=dbRef(),u=userRef(),userId=u?.id;if(!db||!userId)return alert('Faça login para iniciar um treino.');
  const isSameAccount=()=>userRef()?.id===userId;
  const q=await db.from('training_programs').select('*').eq('athlete_id',userId).eq('status','active').order('updated_at',{ascending:false});
  if(!isSameAccount())return false;
  if(q.error)return alert(q.error.message);
  const available=(q.data||[]).filter(p=>{const match=(p.description||'').match(/\[MODALIDADE:\s*([^\]]+)\]/i);return !match||match[1].trim().toLowerCase()==='musculação'});
  if(!available.length)return alert('Você ainda não possui um programa de musculação ativo. Acesse a aba Musculação para criar seu programa.');
  if(typeof window.go==='function')window.go('strengthPage');else{document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section))}
  const showPrograms=()=>{
   if(!isSameAccount())return;
   shell('Escolha seu programa','<div class="panel"><p class="muted">Selecione o programa que você vai executar agora.</p>'+available.map((p,i)=>'<div class="item"><strong>'+esc(normalizeHumanText(p.title))+'</strong><p class="muted">'+esc((p.description||'').replace(/\[MODALIDADE:[^\]]+\]\s*/i,''))+'</p><button class="btn" data-select-program="'+p.id+'">Escolher programa</button></div>').join('')+'</div>');
   section.querySelectorAll('[data-select-program]').forEach(button=>button.onclick=()=>chooseProgram(button.dataset.selectProgram));
  };
  const chooseProgram=async id=>{
   if(!isSameAccount())return false;
   const program=available.find(p=>String(p.id)===String(id));if(!program)return;
   const vq=await db.from('training_program_versions').select('*').eq('id',program.current_version_id).maybeSingle();
   if(!isSameAccount())return false;
   if(vq.error||!vq.data)return alert('Não foi possível localizar a versão vigente deste programa.');
   const sq=await db.from('training_subworkouts').select('*').eq('version_id',vq.data.id).order('position');
   if(!isSameAccount())return false;
   if(sq.error)return alert(sq.error.message);
   if(!sq.data?.length)return alert('Este programa ainda não possui treinos. Adicione A, B, C… na aba Musculação.');
   current=program;version=vq.data;subworkouts=sq.data;
   shell('Qual treino você vai executar?','<div class="panel"><p class="muted">'+esc(program.title)+' · Escolha seu treino de hoje.</p>'+sq.data.map((s,i)=>'<div class="item"><strong style="font-size:18px">'+esc(normalizeHumanText(s.title))+'</strong><p class="muted">'+esc(s.description||'Treino '+(i+1))+'</p><button class="btn" data-start-selected="'+s.id+'">Começar este treino</button></div>').join('')+'<button class="btn alt" id="backPrograms">Escolher outro programa</button></div>');
   section.querySelectorAll('[data-start-selected]').forEach(button=>button.onclick=()=>startSession(button.dataset.startSelected,null,userId,db));
   $('backPrograms').onclick=showPrograms;
  };
  if(available.length===1)chooseProgram(available[0].id);else showPrograms();
 };
 window.__nexfitStrengthLoaded=true;window.__nexfitStrengthLoading=false;window.__nexfitStrengthError=null;
 home().catch(error=>{window.__nexfitStrengthError=error?.message||String(error);console.error('[NEXFIT] Falha ao abrir a tela inicial de musculação:',error)});
})();