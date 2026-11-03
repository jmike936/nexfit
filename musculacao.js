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
 `;
 const st=document.createElement('style');st.textContent=css;document.head.append(st);
 const nav=document.querySelector('.nav');if(!nav)return;
 const tab=document.createElement('button');tab.dataset.page='strengthPage';tab.textContent='Musculação';nav.append(tab);
 const section=document.createElement('section');section.className='page';section.id='strengthPage';document.querySelector('.app').append(section);
 const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let plans=[],current=null,version=null,subworkouts=[],session=null,timer=null;
 const dbRef=()=>window.db||db, userRef=()=>window.currentUser||currentUser;
 function go(){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section));home()}
 tab.onclick=go;
 const field=(id,label,placeholder='',type='text')=>`<label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}">`;
 function shell(title,body){section.innerHTML=`<div class="sectionhead"><div><div class="eyebrow">TREINAMENTO DE FORÇA</div><h2>${title}</h2></div><button class="btn alt" id="refresh">Atualizar</button></div>${body}`;const b=$('refresh');if(b)b.onclick=home}
 async function home(){
  const db=dbRef(),u=userRef();if(!db||!u){shell('Musculação','<div class="panel muted">Faça login para acessar seus programas.</div>');return}
  shell('Programas de treinamento',`<div class="panel"><div class="rowf"><div>${field('programTitle','Nome do programa','Ex.: Hipertrofia — bloco 1')}</div><div>${field('athleteEmail','E-mail do atleta (somente profissional)','aluno@email.com','email')}</div></div><label for="programDesc">Descrição</label><textarea id="programDesc" rows="2" placeholder="Objetivo, observações e contexto"></textarea><button class="btn" id="createProgram">Criar programa</button><p class="muted">Atleta: deixe o e-mail vazio para criar um programa para você. Profissional: o atleta precisa ter autorizado a gestão de programas.</p></div><div id="programList" class="panel">Carregando…</div><div class="panel"><h3>Acessos profissionais</h3><div class="rowf"><div>${field('professionalEmail','Solicitar acesso como profissional','personal@email.com','email')}</div><div><label for="accessType">Permissão solicitada</label><select id="accessType"><option value="view">Visualizar histórico</option><option value="manage">Gerenciar meus programas</option></select></div></div><button class="btn alt" id="requestAccess">Solicitar acesso ao atleta</button><div id="accessList"></div></div><div class="panel"><h3>Notificações</h3><div id="notifications" class="muted">Carregando…</div></div>`);
  $('createProgram').onclick=createProgram;$('requestAccess').onclick=requestAccess;
  const q=await db.from('training_programs').select('*').order('updated_at',{ascending:false});
  if(q.error){$('programList').textContent='A estrutura do NEXFIT ainda precisa ser inicializada no Supabase. '+q.error.message;return}
  plans=q.data||[];$('programList').innerHTML=plans.length?plans.map(p=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong>${esc(p.title)}</strong><span class="tag">${p.status==='active'?'VIGENTE':p.status==='pending'?'PENDENTE':'ARQUIVADO'}</span></div><p class="muted">${esc(p.description||'Sem descrição')} · ${p.athlete_id===u.id?'Meu programa':'Programa compartilhado'}</p><button class="btn" data-open="${p.id}">Abrir programa</button></div>`).join(''):'<p class="muted">Nenhum programa encontrado. Crie seu primeiro programa ou solicite acesso a um profissional.</p>';
  section.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openProgram(b.dataset.open));
  const nq=await db.from('app_notifications').select('*').order('created_at',{ascending:false}).limit(8);
  $('notifications').innerHTML=nq.error?'Não foi possível carregar notificações.':(nq.data||[]).map(n=>`<div class="item"><strong>${esc(n.title)}</strong><p class="muted">${esc(n.body)}</p></div>`).join('')||'Nenhuma notificação.';
  const aq=await db.from('athlete_professional_access').select('*');
  if(!aq.error)$('accessList').innerHTML=(aq.data||[]).map(a=>`<div class="item"><strong>${a.professional_id===u.id?'Acesso solicitado':'Profissional'}</strong> · ${esc(a.status)} <span class="muted">Histórico: ${a.can_view_history?'sim':'não'} · Programas: ${a.can_manage_programs?'sim':'não'}</span>${a.athlete_id===u.id&&a.status==='pending'?'<button class="btn" data-approve="'+a.id+'">Aprovar</button><button class="btn alt" data-reject="'+a.id+'">Recusar</button>':''}</div>`).join('');
  section.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>decideAccess(b.dataset.approve,true));
  section.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>decideAccess(b.dataset.reject,false));
 }
 async function createProgram(){
  const db=dbRef(),u=userRef(),title=$('programTitle').value.trim(),email=$('athleteEmail').value.trim().toLowerCase();
  if(!title)return alert('Informe o nome do programa.');
  if(email){
   const {error}=await db.rpc('nexfit_create_program_for_athlete',{p_email:email,p_title:title,p_description:$('programDesc').value.trim()||null});
   if(error)return alert(error.message);
  }else{
   const {data,error}=await db.from('training_programs').insert({athlete_id:u.id,created_by:u.id,title,description:$('programDesc').value.trim()||null,status:'active'}).select().single();
   if(error)return alert(error.message);
   const v=await db.from('training_program_versions').insert({program_id:data.id,version_number:1,created_by:u.id,change_note:'Versão inicial'}).select().single();
   if(v.error)return alert(v.error.message);
   await db.from('training_programs').update({current_version_id:v.data.id}).eq('id',data.id);
  }
  home();
 }
 async function requestAccess(){
  const email=$('professionalEmail').value.trim().toLowerCase();if(!email)return alert('Informe o e-mail do atleta.');
  const {error}=await dbRef().rpc('nexfit_request_access_by_email',{p_email:email});
  if(error)return alert(error.message);alert('Solicitação enviada. O atleta precisa aprovar e escolher as permissões.');home();
 }
 async function decideAccess(id,approve){
  const db=dbRef(),u=userRef();const {error}=await db.from('athlete_professional_access').update({status:approve?'active':'revoked',decided_at:new Date().toISOString()}).eq('id',id).eq('athlete_id',u.id);
  if(error)return alert(error.message);home();
 }
 async function openProgram(id){
  const db=dbRef();current=plans.find(p=>p.id===id);if(!current)return;
  const {data:vers,error}=await db.from('training_program_versions').select('*').eq('program_id',id).order('version_number',{ascending:false});
  if(error)return alert(error.message);
  const pending=vers.find(v=>v.status==='pending'),active=vers.find(v=>v.status==='active');version=pending||active||vers[0];
  if(!version){return alert('Este programa ainda não possui versão.')}
  const sq=await db.from('training_subworkouts').select('*').eq('version_id',version.id).order('position');
  if(sq.error)return alert(sq.error.message);subworkouts=sq.data||[];
  const isAthlete=current.athlete_id===userRef().id;
  shell(current.title,`<div class="panel"><p class="muted">${esc(current.description||'')} · Versão ${version.version_number} · ${version.status==='pending'?'Aguardando confirmação do atleta':version.status==='active'?'Vigente':'Arquivada'}</p>${pending&&isAthlete?'<button class="btn" id="confirmVersion">Confirmar recebimento desta versão</button>':''}<button class="btn alt" id="newVersion">Criar nova versão</button><button class="btn alt" id="newSub">＋ Adicionar subtreino</button></div><div id="subList"></div><div class="panel"><h3>Solicitar exclusão</h3><p class="muted">A exclusão depende da aprovação do atleta. O histórico de treinos nunca é apagado.</p><button class="btn alt" id="deleteRequest">Solicitar arquivamento</button></div>`);
  $('newVersion').onclick=newVersion;$('newSub').onclick=addSubworkout;$('deleteRequest').onclick=requestDeletion;
  if($('confirmVersion'))$('confirmVersion').onclick=async()=>{const r=await db.rpc('nexfit_confirm_program_version',{p_version:version.id});if(r.error)alert(r.error.message);else openProgram(id)};
  renderSubworkouts();
 }
 async function newVersion(){
  const db=dbRef(),q=await db.from('training_program_versions').select('version_number').eq('program_id',current.id).order('version_number',{ascending:false}).limit(1);
  if(q.error)return alert(q.error.message);const next=(q.data?.[0]?.version_number||0)+1;
  const {data,error}=await db.from('training_program_versions').insert({program_id:current.id,version_number:next,created_by:userRef().id,change_note:prompt('Resumo das alterações desta versão:')||'Atualização do programa'}).select().single();
  if(error)return alert(error.message);await db.from('app_notifications').insert({user_id:current.athlete_id,type:'program_version_pending',title:'Nova versão disponível',body:'Analise a nova versão do seu programa. A versão atual permanece vigente até sua confirmação.',entity_id:current.id});version=data;openProgram(current.id);
 }
 async function addSubworkout(){
  const title=prompt('Nome do subtreino (ex.: A — Peito e tríceps):');if(!title?.trim())return;
  const {error}=await dbRef().from('training_subworkouts').insert({version_id:version.id,title:title.trim(),position:subworkouts.length+1});if(error)return alert(error.message);openProgram(current.id);
 }
 async function renderSubworkouts(){
  const db=dbRef();let html='';
  for(const s of subworkouts){const q=await db.from('training_exercises').select('*').eq('subworkout_id',s.id).order('position');html+=`<div class="panel"><h3>${esc(s.title)}</h3><p class="muted">${esc(s.description||'')}</p>${(q.data||[]).map((e,i)=>`<div class="item"><strong>${i+1}. ${esc(e.name)}</strong><div class="muted">${(e.sets||[]).map(x=>(x.reps??'—')+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':'')).join(' / ')} · descanso ${e.rest_seconds}s</div></div>`).join('')}<button class="btn alt" data-add-ex="${s.id}">Adicionar exercício</button><button class="btn" data-start="${s.id}">Iniciar subtreino</button></div>`}
  $('subList').innerHTML=html||'<div class="panel muted">Nenhum subtreino nesta versão. Adicione A, B, C…</div>';
  section.querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>addExercise(b.dataset.addEx));
  section.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startSession(b.dataset.start));
 }
 async function addExercise(subId){
  const name=prompt('Nome do exercício:');if(!name?.trim())return;
  const raw=prompt('Séries e repetições (ex.: 12,10,8):','12,10,8')||'12,10,8';
  const rest=Number(prompt('Descanso em segundos:','90')||90);
  const sets=raw.split(',').map(x=>({reps:Number(x.trim()),load_kg:null})).filter(x=>Number.isFinite(x.reps)&&x.reps>0);
  if(!sets.length)return alert('Informe repetições válidas.');
  const {data,error}=await dbRef().from('training_exercises').select('position').eq('subworkout_id',subId).order('position',{ascending:false}).limit(1);
  if(error)return alert(error.message);
  const r=await dbRef().from('training_exercises').insert({subworkout_id:subId,name:name.trim(),position:(data?.[0]?.position||0)+1,sets,rest_seconds:Math.max(0,Math.min(rest,3600))});
  if(r.error)return alert(r.error.message);openProgram(current.id);
 }
 async function requestDeletion(){
  const reason=prompt('Motivo do pedido de arquivamento (opcional):')||null;
  const {error}=await dbRef().from('training_program_deletion_requests').insert({program_id:current.id,requested_by:userRef().id,reason});
  if(error)return alert(error.message);
  await dbRef().from('training_programs').update({status:'deletion_pending'}).eq('id',current.id);
  await dbRef().from('app_notifications').insert({user_id:current.athlete_id,type:'deletion_request',title:'Pedido de arquivamento',body:'Um profissional solicitou arquivar um programa. Aprove ou rejeite o pedido.',entity_id:current.id});
  alert('Pedido enviado ao atleta para aprovação.');
 }
 async function startSession(subId){
  const {data,error}=await dbRef().from('training_sessions').insert({athlete_id:userRef().id,program_id:current.id,version_id:version.id,subworkout_id:subId}).select().single();
  if(error)return alert(error.message);session=data;alert('Sessão iniciada. Registre as séries nos exercícios do subtreino; o histórico ficará vinculado a esta versão.');
 }
 home();
})();