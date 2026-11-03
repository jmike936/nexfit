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
 const tab=document.createElement('button');tab.dataset.page='strengthPage';tab.textContent='Importar/Criar treinos';nav.append(tab);
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
  shell('Importação / Criação de treinos',`<div class="panel"><h3>Meus programas</h3><label for="programCategory">Categoria do treino</label><select id="programCategory"><option>Musculação</option><option>Natação</option><option>Corrida</option><option>Pedal</option><option>Ciclismo</option><option>Caminhada</option><option>Funcional</option><option>Cross training</option><option>Outra</option></select><div>${field('programTitle','Nome do programa','Ex.: Hipertrofia — bloco 1')}</div><label for="programDesc">Descrição</label><textarea id="programDesc" rows="2" placeholder="Objetivo, observações e contexto"></textarea><button class="btn" id="createProgram">＋ Criar meu programa</button><p class="muted">Você pode criar e organizar programas para sua própria conta. A categoria escolhida identifica a modalidade do programa.</p></div><div class="panel"><h3>Importar treino de Excel ou CSV</h3><label for="importCategory">Categoria do treino importado</label><select id="importCategory"><option>Musculação</option><option>Natação</option><option>Corrida</option><option>Pedal</option><option>Ciclismo</option><option>Caminhada</option><option>Funcional</option><option>Cross training</option><option>Outra</option></select><p class="muted">Use uma linha por série. Colunas: Treino, Exercício, Série, Repetições, Carga e Descanso. Treino e Série são opcionais.</p><input id="strengthFile" type="file" accept=".xlsx,.csv"><div id="strengthPreview" class="muted">Selecione um arquivo para visualizar os exercícios e séries.</div><button class="btn" id="strengthImport" disabled>Importar para meus programas</button></div><div id="professionalCreate" class="panel" style="display:none"><h3>Prescrever para atleta</h3><p class="muted">Disponível somente quando você possui autorização ativa de gestão concedida pelo atleta.</p>${field('athleteEmail','E-mail do atleta','aluno@email.com','email')}<button class="btn" id="createForAthlete">Criar programa para atleta</button></div><div id="programList" class="panel">Carregando…</div><div class="panel" id="professionalAccessPanel"><h3>Acessos profissionais</h3><div id="professionalRequestControls"><div class="rowf"><div>${field('professionalEmail','Solicitar acesso como profissional','personal@email.com','email')}</div><div><label for="accessType">Permissão solicitada</label><select id="accessType"><option value="view">Visualizar histórico</option><option value="manage">Gerenciar meus programas</option></select></div></div><button class="btn alt" id="requestAccess">Solicitar acesso ao atleta</button></div><div id="accessList"></div></div><div class="panel"><h3>Notificações</h3><div id="notifications" class="muted">Carregando…</div></div>`);
  const accountType=u.user_metadata?.account_type||'athlete';\n  if(accountType!=='professional')$('professionalRequestControls').style.display='none';\n  $('createProgram').onclick=createProgram;$('requestAccess').onclick=requestAccess;
  $('strengthFile').onchange=e=>readStrengthFile(e.target.files?.[0]);
  $('strengthImport').onclick=importStrengthFile;
  const q=await db.from('training_programs').select('*').order('updated_at',{ascending:false});
  if(q.error){$('programList').textContent='A estrutura do NEXFIT ainda precisa ser inicializada no Supabase. '+q.error.message;return}
  plans=q.data||[];$('programList').innerHTML=plans.length?plans.map(p=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong>${esc(p.title)}</strong><span class="tag">${p.status==='active'?'VIGENTE':p.status==='pending'?'PENDENTE':'ARQUIVADO'}</span></div><p class="muted">${esc(p.description||'Sem descrição')} · ${p.athlete_id===u.id?'Meu programa':'Programa compartilhado'}</p><button class="btn" data-open="${p.id}">Abrir programa</button></div>`).join(''):'<p class="muted">Nenhum programa encontrado. Crie seu primeiro programa ou solicite acesso a um profissional.</p>';
  section.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openProgram(b.dataset.open));
  const nq=await db.from('app_notifications').select('*').order('created_at',{ascending:false}).limit(8);
  $('notifications').innerHTML=nq.error?'Não foi possível carregar notificações.':(nq.data||[]).map(n=>`<div class="item"><strong>${esc(n.title)}</strong><p class="muted">${esc(n.body)}</p></div>`).join('')||'Nenhuma notificação.';
  const aq=await db.from('athlete_professional_access').select('*');
  const canPrescribe=(aq.data||[]).some(a=>a.professional_id===u.id&&a.status==='active'&&a.can_manage_programs);
  if(canPrescribe){$('professionalCreate').style.display='block';$('createForAthlete').onclick=createProgramForAthlete;}
  if(!aq.error)$('accessList').innerHTML=(aq.data||[]).map(a=>`<div class="item"><strong>${a.professional_id===u.id?'Acesso solicitado':'Profissional'}</strong> · ${esc(a.status)} <span class="muted">Histórico: ${a.can_view_history?'sim':'não'} · Programas: ${a.can_manage_programs?'sim':'não'}</span>${a.athlete_id===u.id&&a.status==='pending'?'<button class="btn" data-approve="'+a.id+'">Aprovar</button><button class="btn alt" data-reject="'+a.id+'">Recusar</button>':''}</div>`).join('');
  section.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>decideAccess(b.dataset.approve,true));
  section.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>decideAccess(b.dataset.reject,false));
 }
 let importedExercises=[];
 function csvRows(text){
  const out=[];let row=[],v='',q=false;
  for(let i=0;i<text.length;i++){const ch=text[i],n=text[i+1];if(ch==='"'&&q&&n==='"'){v+='"';i++}else if(ch==='"')q=!q;else if((ch===','||ch===';'||ch==='\\t')&&!q){row.push(v);v=''}else if((ch==='\\n'||ch==='\\r')&&!q){if(ch==='\\r'&&n==='\\n')i++;row.push(v);if(row.some(x=>x.trim()))out.push(row);row=[];v=''}else v+=ch}
  row.push(v);if(row.some(x=>x.trim()))out.push(row);return out;
 }
 const normHeader=s=>String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'_');
 async function readStrengthFile(file){
  importedExercises=[];$('strengthImport').disabled=true;
  try{
   if(!file) return;
   let matrix;
   if(file.name.toLowerCase().endsWith('.csv'))matrix=csvRows(await file.text());
   else{
    if(!window.XLSX)await new Promise((ok,no)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';script.onload=ok;script.onerror=()=>no(Error('Não foi possível carregar o leitor Excel.'));document.head.append(script)});
    const book=window.XLSX.read(await file.arrayBuffer(),{type:'array'});matrix=window.XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,defval:''});
   }
   const h=matrix[0].map(normHeader),find=names=>h.findIndex(x=>names.includes(x));
   const ix={sub:find(['treino','subtreino','divisao']),exercise:find(['exercicio','nome_exercicio']),set:find(['serie','set']),reps:find(['repeticoes','reps','repeticao']),load:find(['carga','carga_kg','peso']),rest:find(['descanso','intervalo','int_recup'])};
   if(ix.exercise<0||ix.reps<0||ix.load<0)throw Error('Cabeçalhos obrigatórios: Exercício, Repetições e Carga. Inclua Série para identificar cada linha.');
   const get=(r,k)=>ix[k]<0?'':String(r[ix[k]]??'').trim(),groups=new Map();
   for(const r of matrix.slice(1)){
    const name=get(r,'exercise');if(!name)continue;
    const sub=get(r,'sub')||'Treino A',key=sub+'||'+name;
    if(!groups.has(key))groups.set(key,{sub,name,sets:[],rest_seconds:Math.max(0,Number(get(r,'rest').replace(',','.'))||0)});
    const reps=Number(get(r,'reps').replace(',','.')),load=Number(get(r,'load').replace(/[a-zA-Z ]/g,'').replace(',','.'));
    if(!Number.isFinite(reps)||reps<=0)throw Error('Repetições inválidas em '+name);
    const setNo=Number(get(r,'set'))||groups.get(key).sets.length+1;
    groups.get(key).sets.push({set_number:setNo,reps,load_kg:Number.isFinite(load)?load:null});
   }
   importedExercises=[...groups.values()];
   if(!importedExercises.length)throw Error('Nenhum exercício foi encontrado.');
   $('strengthPreview').innerHTML='<strong>'+importedExercises.length+' exercícios · '+[...new Set(importedExercises.map(x=>x.sub))].length+' treinos</strong>'+importedExercises.map(x=>'<div class="item"><strong>'+esc(x.sub)+' · '+esc(x.name)+'</strong><div class="muted">'+x.sets.sort((a,b)=>a.set_number-b.set_number).map(s=>s.reps+' reps · '+(s.load_kg??'—')+' kg').join(' / ')+'</div></div>').join('');
   $('strengthImport').disabled=false;
  }catch(err){$('strengthPreview').textContent=err.message}
 }
 async function importStrengthFile(){
  if(!importedExercises.length)return;
  const title=prompt('Nome do programa importado:', $('strengthFile').files[0].name.replace(/\\.[^.]+$/,''));if(!title?.trim())return;
  const db=dbRef(),u=userRef();
  const {data:p,error}=await db.from('training_programs').insert({athlete_id:u.id,created_by:u.id,title:title.trim(),description:'[MODALIDADE: '+$('importCategory').value+'] Importado de Excel/CSV',status:'active'}).select().single();
  if(error)return alert(error.message);
  const {data:v,error:ve}=await db.from('training_program_versions').insert({program_id:p.id,version_number:1,created_by:u.id,change_note:'Importação de planilha',status:'active'}).select().single();
  if(ve)return alert(ve.message);
  const up=await db.from('training_programs').update({current_version_id:v.id}).eq('id',p.id);if(up.error)return alert(up.error.message);
  const subs=[...new Set(importedExercises.map(x=>x.sub))];
  for(let i=0;i<subs.length;i++){
   const {data:s,error:se}=await db.from('training_subworkouts').insert({version_id:v.id,title:subs[i],position:i+1}).select().single();if(se)return alert(se.message);
   const rows=importedExercises.filter(x=>x.sub===subs[i]).map((x,j)=>({subworkout_id:s.id,name:x.name,position:j+1,sets:x.sets.sort((a,b)=>a.set_number-b.set_number).map(z=>({reps:z.reps,load_kg:z.load_kg})),rest_seconds:x.rest_seconds}));
   const ins=await db.from('training_exercises').insert(rows);if(ins.error)return alert(ins.error.message);
  }
  alert('Programa importado. As repetições e cargas individuais de cada série foram preservadas.');home();
 }
 async function createProgram(){
  const db=dbRef(),u=userRef(),title=$('programTitle').value.trim();
  if(!title)return alert('Informe o nome do programa.');
  const {data,error}=await db.from('training_programs').insert({athlete_id:u.id,created_by:u.id,title,description:'[MODALIDADE: '+$('programCategory').value+'] '+($('programDesc').value.trim()||''),status:'active'}).select().single();
  if(error)return alert(error.message);
  const v=await db.from('training_program_versions').insert({program_id:data.id,version_number:1,created_by:u.id,change_note:'Versão inicial',status:'active'}).select().single();
  if(v.error)return alert(v.error.message);
  const {error:updateError}=await db.from('training_programs').update({current_version_id:v.data.id}).eq('id',data.id);
  if(updateError)return alert(updateError.message);
  home();
 }
 async function createProgramForAthlete(){
  const email=$('athleteEmail').value.trim().toLowerCase(),title=$('programTitle').value.trim();
  if(!email)return alert('Informe o e-mail do atleta.');
  if(!title)return alert('Informe o nome do programa.');
  const {error}=await dbRef().rpc('nexfit_create_program_for_athlete',{p_email:email,p_title:title,p_description:$('programDesc').value.trim()||null});
  if(error)return alert(error.message);
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
  const previous=version;
  const {data,error}=await db.from('training_program_versions').insert({program_id:current.id,version_number:next,created_by:userRef().id,change_note:prompt('Resumo das alterações desta versão:')||'Atualização do programa'}).select().single();
  if(error)return alert(error.message);
  const oldSubs=await db.from('training_subworkouts').select('*').eq('version_id',previous.id).order('position');
  if(oldSubs.error)return alert('A versão foi criada, mas não foi possível copiar os subtreinos: '+oldSubs.error.message);
  for(const oldSub of (oldSubs.data||[])){
   const {data:newSub,error:subErr}=await db.from('training_subworkouts').insert({version_id:data.id,title:oldSub.title,description:oldSub.description,position:oldSub.position}).select().single();
   if(subErr)return alert('A versão foi criada, mas houve erro ao copiar um subtreino: '+subErr.message);
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
  const title=prompt('Nome do subtreino (ex.: A — Peito e tríceps):');if(!title?.trim())return;
  const {error}=await dbRef().from('training_subworkouts').insert({version_id:version.id,title:title.trim(),position:subworkouts.length+1});if(error)return alert(error.message);openProgram(current.id);
 }
 async function renderSubworkouts(){
  const db=dbRef();let html='';
  for(const s of subworkouts){const q=await db.from('training_exercises').select('*').eq('subworkout_id',s.id).order('position');const done=await db.from('training_sessions').select('subworkout_id').eq('program_id',current.id).eq('athlete_id',userRef().id).eq('status','completed');let total=0;if(!done.error&&done.data?.length){const ids=[...new Set(done.data.map(x=>x.subworkout_id).filter(Boolean))];if(ids.length){const names=await db.from('training_subworkouts').select('id,title').in('id',ids);const titleIds=(names.data||[]).filter(x=>x.title===s.title).map(x=>x.id);total=done.data.filter(x=>titleIds.includes(x.subworkout_id)).length}}html+=`<div class="panel"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3>${esc(s.title)}</h3><span class="tag">${total} ${total===1?'treino registrado':'treinos registrados'}</span></div><p class="muted">${esc(s.description||'')}</p>${(q.data||[]).map((e,i)=>`<div class="item"><strong>${i+1}. ${esc(e.name)}</strong><div class="muted">${(e.sets||[]).map(x=>(x.reps??'—')+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':'')).join(' / ')} · descanso ${e.rest_seconds}s</div></div>`).join('')}<button class="btn alt" data-add-ex="${s.id}">Adicionar exercício</button><button class="btn" data-start="${s.id}">Iniciar subtreino</button></div>`}
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
  const db=dbRef();
  const {data,error}=await db.from('training_sessions').insert({athlete_id:userRef().id,program_id:current.id,version_id:version.id,subworkout_id:subId}).select().single();
  if(error)return alert(error.message);session=data;
  const sub=subworkouts.find(s=>s.id===subId);
  const ex=await db.from('training_exercises').select('*').eq('subworkout_id',subId).order('position');
  if(ex.error)return alert(ex.error.message);
  shell('Sessão em andamento',`<div class="panel"><h3>${esc(current.title)} · ${esc(sub?.title||'Treino')}</h3><p class="muted">Registre as repetições e cargas realizadas em cada série. A sessão ficará vinculada à versão do programa.</p><div id="sessionExercises"></div><button class="btn" id="finishSession">Finalizar treino</button><button class="btn alt" id="cancelSession">Voltar ao programa</button></div>`);
  $('sessionExercises').innerHTML=(ex.data||[]).map(e=>`<div class="item"><strong>${esc(e.name)}</strong><div class="muted">Planejado: ${(e.sets||[]).length} séries · descanso ${e.rest_seconds||0}s</div>${(e.sets||[]).map((set,i)=>`<div class="rowf"><div><label>Série ${i+1} · repetições</label><input type="number" min="0" id="reps-${e.id}-${i+1}" value="${Number(set.reps)||''}" placeholder="Reps realizadas"></div><div><label>Carga (kg)</label><input type="number" min="0" step="0.25" id="load-${e.id}-${i+1}" value="${set.load_kg??''}" placeholder="Carga"></div></div>`).join('')}</div>`).join('')||'<p class="muted">Nenhum exercício cadastrado neste subtreino.</p>';
  $('finishSession').onclick=()=>finishSession(ex.data||[]);
  $('cancelSession').onclick=()=>openProgram(current.id);
 }
 async function finishSession(exercises){
  const db=dbRef();const rows=[];
  for(const e of exercises)for(let i=0;i<(e.sets||[]).length;i++){
   const n=i+1,reps=$('reps-'+e.id+'-'+n)?.value,load=$('load-'+e.id+'-'+n)?.value;
   if(reps!==''||load!=='')rows.push({session_id:session.id,exercise_id:e.id,set_number:n,reps_completed:reps===''?null:Number(reps),load_kg:load===''?null:Number(load)});
  }
  if(rows.length){const {error}=await db.from('training_set_logs').insert(rows);if(error)return alert('Não foi possível salvar as séries: '+error.message)}
  const {error}=await db.from('training_sessions').update({status:'completed',finished_at:new Date().toISOString()}).eq('id',session.id).eq('athlete_id',userRef().id);
  if(error)return alert(error.message);
  const started=new Date(session.started_at||Date.now()),minutes=Math.max(1,Math.round((Date.now()-started.getTime())/60000));
  const sub=subworkouts.find(s=>s.id===session.subworkout_id);
  const {error:activityError}=await db.from('activities').insert({user_id:userRef().id,sport:'Musculação',activity_date:new Date().toISOString().slice(0,10),duration_minutes:minutes,distance_km:null,notes:current.title+' · '+(sub?.title||'Treino')});
  if(activityError)alert('Treino finalizado, mas não foi possível criar a atividade no histórico: '+activityError.message);
  else alert('Treino finalizado e registrado no seu histórico!');
  session=null;home();
 }
 window.beginStrengthActivity=async function(){
  const db=dbRef(),u=userRef();if(!db||!u)return alert('Faça login para iniciar um treino.');
  const q=await db.from('training_programs').select('*').eq('athlete_id',u.id).eq('status','active').order('updated_at',{ascending:false});
  if(q.error)return alert(q.error.message);
  if(!q.data?.length)return alert('Você ainda não possui um programa de musculação ativo. Acesse a aba Musculação para criar ou receber um programa.');
  const choices=q.data.map((p,i)=>(i+1)+'. '+p.title).join('\\n');
  const chosen=Number(prompt('Qual programa deseja iniciar?\\n'+choices,'1'));
  const program=q.data[chosen-1];if(!program)return;
  const vq=await db.from('training_program_versions').select('*').eq('id',program.current_version_id).maybeSingle();
  if(vq.error||!vq.data)return alert('Não foi possível localizar a versão vigente deste programa.');
  const sq=await db.from('training_subworkouts').select('*').eq('version_id',vq.data.id).order('position');
  if(sq.error)return alert(sq.error.message);
  if(!sq.data?.length)return alert('Este programa ainda não possui subtreinos. Adicione A, B, C… na aba Musculação.');
  const subChoice=Number(prompt('Qual treino deseja iniciar?\\n'+sq.data.map((s,i)=>(i+1)+'. '+s.title).join('\\n'),'1'));
  const sub=sq.data[subChoice-1];if(!sub)return;
  current=program;version=vq.data;subworkouts=sq.data;
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section));
  await startSession(sub.id);
 };
 home();
})();