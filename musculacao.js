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
 let plans=[],current=null,version=null,subworkouts=[],session=null,timer=null,activeRest=null,notificationsAllowed=false;
 const dbRef=()=>window.db||db, userRef=()=>window.currentUser||currentUser;
 function go(){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section));home()}
 tab.onclick=go;
 const field=(id,label,placeholder='',type='text')=>`<label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}">`;
 function shell(title,body){section.innerHTML=`<div class="sectionhead"><div><div class="eyebrow">TREINAMENTO DE FORÇA</div><h2>${title}</h2></div><button class="btn alt" id="refresh">Atualizar</button></div>${body}`;const b=$('refresh');if(b)b.onclick=home}
 async function home(){
  const db=dbRef(),u=userRef();if(!db||!u){shell('Musculação','<div class="panel muted">Faça login para acessar seus programas.</div>');return}
  shell('Importação / Criação de treinos',`<div class="panel"><h3>Meus programas</h3><label for="programCategory">Categoria do treino</label><select id="programCategory"><option>Musculação</option><option>Natação</option><option>Corrida</option><option>Pedal</option><option>Ciclismo</option><option>Caminhada</option><option>Funcional</option><option>Cross training</option><option>Outra</option></select><div>${field('programTitle','Nome do programa','Ex.: Hipertrofia — bloco 1')}</div><label for="programDesc">Descrição</label><textarea id="programDesc" rows="2" placeholder="Objetivo, observações e contexto"></textarea><button class="btn" id="createProgram">＋ Criar meu programa</button><p class="muted">Você pode criar e organizar programas para sua própria conta. A categoria escolhida identifica a modalidade do programa.</p></div><div class="panel"><h3>Importar treino de Excel ou CSV</h3><label for="importCategory">Categoria do treino importado</label><select id="importCategory"><option>Musculação</option><option>Natação</option><option>Corrida</option><option>Pedal</option><option>Ciclismo</option><option>Caminhada</option><option>Funcional</option><option>Cross training</option><option>Outra</option></select><p class="muted">Use uma linha por série. Colunas: Treino, Exercício, Série, Repetições, Carga e Descanso. Treino e Série são opcionais.</p><input id="strengthFile" type="file" accept=".xlsx,.csv"><div id="strengthPreview" class="muted">Selecione um arquivo para visualizar os exercícios e séries.</div><button class="btn" id="strengthImport" disabled>Importar para meus programas</button></div><div id="professionalCreate" class="panel" style="display:none"><h3>Prescrever para atleta</h3><p class="muted">Disponível somente quando você possui autorização ativa de gestão concedida pelo atleta.</p>${field('athleteEmail','E-mail do atleta','aluno@email.com','email')}<button class="btn" id="createForAthlete">Criar programa para atleta</button></div><div id="programList" class="panel">Carregando…</div><div class="panel" id="professionalAccessPanel"><h3>Acessos profissionais</h3><div id="professionalRequestControls"><div class="rowf"><div>${field('professionalEmail','Solicitar acesso como profissional','personal@email.com','email')}</div><div><label for="accessType">Permissão solicitada</label><select id="accessType"><option value="view">Visualizar histórico</option><option value="manage">Gerenciar meus programas</option></select></div></div><button class="btn alt" id="requestAccess">Solicitar acesso ao atleta</button></div><div id="accessList"></div></div><div class="panel"><h3>Notificações</h3><div id="notifications" class="muted">Carregando…</div></div>`);
  const accountType=u.user_metadata?.account_type||'athlete';
  if(accountType!=='professional')$('professionalRequestControls').style.display='none';
  $('createProgram').onclick=createProgram;$('requestAccess').onclick=requestAccess;
  $('strengthFile').onchange=e=>readStrengthFile(e.target.files?.[0]);
  $('strengthImport').onclick=importStrengthFile;
  const q=await db.from('training_programs').select('*').order('updated_at',{ascending:false});
  if(q.error){$('programList').textContent='A estrutura do NEXFIT ainda precisa ser inicializada no Supabase. '+q.error.message;return}
  plans=q.data||[];$('programList').innerHTML=plans.length?plans.map(p=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong>${esc(p.title)}</strong><span class="tag">${p.status==='active'?'VIGENTE':p.status==='pending'?'PENDENTE':'ARQUIVADO'}</span></div><p class="muted">${esc(p.description||'Sem descrição')} · ${p.athlete_id===u.id?'Meu programa':'Programa compartilhado'}</p><button class="btn" data-open="${p.id}">Abrir programa</button><button class="btn alt" data-edit-program="${p.id}">Editar</button><button class="btn alt" data-archive-program="${p.id}">Excluir</button></div>`).join(''):'<p class="muted">Nenhum programa encontrado. Crie seu primeiro programa ou solicite acesso a um profissional.</p>';
  section.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openProgram(b.dataset.open));
  section.querySelectorAll('[data-edit-program]').forEach(b=>b.onclick=()=>editProgram(b.dataset.editProgram));
  section.querySelectorAll('[data-archive-program]').forEach(b=>b.onclick=()=>archiveProgram(b.dataset.archiveProgram));
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
  for(let i=0;i<text.length;i++){
   const ch=text[i],n=text[i+1];
   if(ch==='"'&&q&&n==='"'){v+='"';i++}
   else if(ch==='"')q=!q;
   else if((ch===','||ch===';'||ch==='\t')&&!q){row.push(v);v=''}
   else if((ch==='\n'||ch==='\r')&&!q){if(ch==='\r'&&n==='\n')i++;row.push(v);if(row.some(x=>x.trim()))out.push(row);row=[];v=''}
   else v+=ch;
  }
  row.push(v);if(row.some(x=>x.trim()))out.push(row);return out;
 }
 const normHeader=s=>String(s||'').replace(String.fromCharCode(65279),'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'_');
 function parseRestSeconds(raw){
  const value=String(raw??'').trim().toLowerCase();if(!value)return 0;
  const clock=value.match(/^(\d+):([0-5]?\d)$/);if(clock)return Number(clock[1])*60+Number(clock[2]);
  const amount=Number(value.replace(',','.').replace(/[^\d.-]/g,''));if(!Number.isFinite(amount))return 0;
  return /min|minute/.test(value)?Math.round(amount*60):Math.max(0,Math.round(amount));
 }
 async function readStrengthFile(file){
  importedExercises=[];$('strengthImport').disabled=true;
  const preview=$('strengthPreview');
  if(!file){preview.textContent='Selecione um arquivo Excel ou CSV.';return}
  preview.textContent='Lendo arquivo e identificando os exercícios…';
  try{
   let matrix;
   if(file.name.toLowerCase().endsWith('.csv'))matrix=csvRows(await file.text());
   else{
    if(!window.XLSX){
     preview.textContent='Carregando leitor de Excel…';
     await new Promise((ok,no)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';script.onload=ok;script.onerror=()=>no(Error('Não foi possível carregar o leitor Excel. Verifique sua conexão e tente novamente.'));document.head.append(script)});
    }
    const book=window.XLSX.read(await file.arrayBuffer(),{type:'array'});
    matrix=window.XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,defval:''});
   }
   if(!matrix?.length)throw Error('A planilha está vazia ou não contém dados na primeira aba.');
   const h=(matrix[0]||[]).map(normHeader);
   const find=names=>h.findIndex(x=>names.includes(x));
   const headerMap={sub:find(['treino','subtreino','divisao']),exercise:find(['exercicio','nome_exercicio']),set:find(['serie','set']),reps:find(['repeticoes','reps','repeticao','prescricao']),load:find(['carga','carga_kg','peso']),rest:find(['descanso','intervalo','int_recup'])};
   const hasHeaders=headerMap.exercise>=0;
   let ix,rows;
   if(hasHeaders){
    ix=headerMap;rows=matrix.slice(1);
    if(ix.reps<0)throw Error('Não encontrei a coluna Repetições. Confira os cabeçalhos da planilha.');
   }else{
    // Formato sem cabeçalho: e-mail opcional | subtreino | exercício | descanso | repetições.
    // Também aceita o formato compacto: subtreino | exercício | descanso | repetições.
    const firstRow=matrix[0]||[];
    if(firstRow.length>=5&&String(firstRow[0]||'').includes('@')){
     ix={sub:1,exercise:2,rest:3,reps:4,set:-1,load:-1};rows=matrix;
    }else if(firstRow.length>=4){
     ix={sub:0,exercise:1,rest:2,reps:3,set:-1,load:-1};rows=matrix;
    }else throw Error('Não reconheci os cabeçalhos. Use SUBTREINO, EXERCÍCIO, DESCANSO e REPETIÇÕES, com uma linha por exercício.');
   }
   const get=(r,k)=>ix[k]<0?'':String(r?.[ix[k]]??'').trim();
   const groups=new Map();let validRows=0;
   for(let ri=0;ri<rows.length;ri++){
    const r=rows[ri],name=get(r,'exercise');if(!name)continue;
    const sub=get(r,'sub')||'Treino A',key=sub+'||'+name;
    const restSeconds=parseRestSeconds(get(r,'rest'));
    const prescription=get(r,'reps').trim().toUpperCase();
    if(!prescription)throw Error('Repetições não informadas para "'+name+'" (linha '+(ri+(hasHeaders?2:1))+').');
    let repsList=[];
    const multi=prescription.match(/^(\d+)\s*X\s*(MR|AMRAP|\d+(?:[.,]\d+)?)$/i);
    if(multi){
     const count=Number(multi[1]),rep=multi[2]==='MR'||multi[2]==='AMRAP'?'MR':Number(multi[2].replace(',','.'));
     if(count<1||count>30)throw Error('Número de séries inválido para "'+name+'".');
     repsList=Array(count).fill(rep);
    }else{
     const vals=prescription.match(/\d+(?:[.,]\d+)?|MR|AMRAP/gi)||[];
     repsList=vals.map(v=>v==='MR'||v==='AMRAP'?'MR':Number(v.replace(',','.'))).filter(v=>v==='MR'||(Number.isFinite(v)&&v>0));
    }
    if(!repsList.length)throw Error('Formato de repetições não reconhecido para "'+name+'": '+prescription);
    const loadRaw=get(r,'load').replace(/[a-zA-Z ]/g,'').replace(',','.');
    const load=loadRaw===''?null:Number(loadRaw);
    if(loadRaw!==''&&!Number.isFinite(load))throw Error('Carga inválida para "'+name+'".');
    if(!groups.has(key))groups.set(key,{sub,name,sets:[],rest_seconds:restSeconds});
    const group=groups.get(key);
    if(ix.set>=0){
     const setNo=Number(get(r,'set'))||group.sets.length+1;
     group.sets.push({set_number:setNo,reps:repsList[0],load_kg:load});
    }else{
     repsList.forEach(rep=>group.sets.push({set_number:group.sets.length+1,reps:rep,load_kg:load}));
    }
    validRows++;
   }
   importedExercises=[...groups.values()];
   if(!importedExercises.length)throw Error('Nenhum exercício válido foi encontrado. Confira a coluna Exercício.');
   const totalSets=importedExercises.reduce((n,e)=>n+e.sets.length,0);
   preview.innerHTML='<strong>Arquivo lido com sucesso</strong><p>'+importedExercises.length+' exercícios · '+[...new Set(importedExercises.map(x=>x.sub))].length+' treinos · '+totalSets+' séries reconhecidas.</p>'+importedExercises.map(x=>'<div class="item"><strong>'+esc(x.sub)+' · '+esc(x.name)+'</strong><div class="muted">'+x.sets.map(z=>z.reps+' reps'+(z.load_kg!=null?' · '+z.load_kg+' kg':'')).join(' / ')+' · descanso '+x.rest_seconds+'s</div></div>').join('');
   $('strengthImport').disabled=false;
  }catch(err){
   importedExercises=[];preview.textContent='Não foi possível ler a planilha: '+(err?.message||String(err))+' Selecione outro arquivo ou ajuste as colunas e tente novamente.';
   $('strengthImport').disabled=true;
  }
 }
 async function importStrengthFile(){
  if(!importedExercises.length){$('strengthPreview').textContent='Primeiro selecione e valide uma planilha com exercícios.';return}
  const title=prompt('Nome do programa importado:', $('strengthFile').files[0].name.replace(/\.[^.]+$/,''));
  if(!title?.trim()){$('strengthPreview').textContent='Importação cancelada. Nenhum programa foi criado.';return}
  const btn=$('strengthImport'),preview=$('strengthPreview'),db=dbRef(),u=userRef();
  btn.disabled=true;btn.textContent='Importando…';
  const report=msg=>{preview.textContent=msg};
  let programId=null;
  try{
   report('Etapa 1 de 4: criando o programa…');
   const {data:p,error}=await db.from('training_programs').insert({athlete_id:u.id,created_by:u.id,title:title.trim(),description:'[MODALIDADE: '+$('importCategory').value+'] Importado de Excel/CSV',status:'active'}).select().single();
   if(error)throw Error('Não foi possível criar o programa: '+error.message);
   programId=p.id;
   report('Etapa 2 de 4: criando a versão inicial…');
   const {data:v,error:ve}=await db.from('training_program_versions').insert({program_id:p.id,version_number:1,created_by:u.id,change_note:'Importação de planilha',status:'active'}).select().single();
   if(ve)throw Error('O programa foi criado, mas a versão não pôde ser gravada: '+ve.message);
   report('Etapa 3 de 4: organizando os treinos e exercícios…');
   const up=await db.from('training_programs').update({current_version_id:v.id}).eq('id',p.id);
   if(up.error)throw Error('A versão foi criada, mas não foi possível vinculá-la ao programa: '+up.error.message);
   const subs=[...new Set(importedExercises.map(x=>x.sub))];
   for(let i=0;i<subs.length;i++){
    report('Etapa 3 de 4: gravando '+subs[i]+' ('+(i+1)+' de '+subs.length+')…');
    const {data:s,error:se}=await db.from('training_subworkouts').insert({version_id:v.id,title:subs[i],position:i+1}).select().single();
    if(se)throw Error('Falha ao criar '+subs[i]+': '+se.message);
    const rows=importedExercises.filter(x=>x.sub===subs[i]).map((x,j)=>({subworkout_id:s.id,name:x.name,position:j+1,sets:x.sets.map(z=>({reps:z.reps,load_kg:z.load_kg})),rest_seconds:x.rest_seconds}));
    const ins=await db.from('training_exercises').insert(rows);
    if(ins.error)throw Error('Falha ao gravar exercícios de '+subs[i]+': '+ins.error.message);
   }
   report('Etapa 4 de 4: finalizando e atualizando a lista…');
   alert('Importação concluída! Programa "'+title.trim()+'" criado com '+importedExercises.length+' exercícios em '+subs.length+' treinos.');
   home();
  }catch(err){
   report('Importação interrompida. '+(programId?'O programa já foi criado; confira a lista antes de tentar novamente. ':'Nenhum programa foi criado. ')+(err?.message||String(err)));
   alert('Não foi possível concluir a importação.\n\n'+(err?.message||String(err)));
  }finally{
   btn.disabled=!importedExercises.length;btn.textContent='Importar para meus programas';
  }
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
  shell(current.title,`<div class="panel"><p class="muted">${esc(current.description||'')} · Versão ${version.version_number} · ${version.status==='pending'?'Aguardando confirmação do atleta':version.status==='active'?'Vigente':'Arquivada'}</p>${pending&&isAthlete?'<button class="btn" id="confirmVersion">Confirmar recebimento desta versão</button>':''}<button class="btn alt" id="newVersion">Criar nova versão</button><button class="btn alt" id="editCurrentProgram">Editar programa</button><button class="btn alt" id="archiveCurrentProgram">Excluir programa</button><button class="btn alt" id="newSub">＋ Adicionar subtreino</button></div><div id="subList"></div><div class="panel"><h3>Solicitar exclusão</h3><p class="muted">A exclusão depende da aprovação do atleta. O histórico de treinos nunca é apagado.</p><button class="btn alt" id="deleteRequest">Solicitar arquivamento</button></div>`);
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
  for(const s of subworkouts){const q=await db.from('training_exercises').select('*').eq('subworkout_id',s.id).order('position');const done=await db.from('training_sessions').select('subworkout_id').eq('program_id',current.id).eq('athlete_id',userRef().id).eq('status','completed');let total=0;if(!done.error&&done.data?.length){const ids=[...new Set(done.data.map(x=>x.subworkout_id).filter(Boolean))];if(ids.length){const names=await db.from('training_subworkouts').select('id,title').in('id',ids);const titleIds=(names.data||[]).filter(x=>x.title===s.title).map(x=>x.id);total=done.data.filter(x=>titleIds.includes(x.subworkout_id)).length}}html+=`<div class="panel"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><h3>${esc(s.title)}</h3><span class="tag">${total} ${total===1?'treino registrado':'treinos registrados'}</span><button class="btn alt" data-edit-sub="${s.id}">Editar subtreino</button><button class="btn alt" data-delete-sub="${s.id}">Excluir subtreino</button></div><p class="muted">${esc(s.description||'')}</p>${(q.data||[]).map((e,i)=>`<div class="item"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><strong>${i+1}. ${esc(e.name)}</strong><span><button class="btn alt" data-edit-ex="${e.id}">Editar</button><button class="btn alt" data-delete-ex="${e.id}">Excluir</button></span></div><div class="muted">${(e.sets||[]).map(x=>(x.reps??'—')+' reps'+(x.load_kg!=null?' · '+x.load_kg+' kg':'')).join(' / ')} · descanso ${e.rest_seconds}s</div></div>`).join('')}<button class="btn alt" data-add-ex="${s.id}">Adicionar exercício</button><button class="btn" data-start="${s.id}">Iniciar subtreino</button></div>`}
  $('subList').innerHTML=html||'<div class="panel muted">Nenhum subtreino nesta versão. Adicione A, B, C…</div>';
  section.querySelectorAll('[data-add-ex]').forEach(b=>b.onclick=()=>addExercise(b.dataset.addEx));
  section.querySelectorAll('[data-edit-sub]').forEach(b=>b.onclick=()=>editSubworkout(b.dataset.editSub));
  section.querySelectorAll('[data-delete-sub]').forEach(b=>b.onclick=()=>deleteSubworkout(b.dataset.deleteSub));
  section.querySelectorAll('[data-edit-ex]').forEach(b=>b.onclick=()=>editExercise(b.dataset.editEx));
  section.querySelectorAll('[data-delete-ex]').forEach(b=>b.onclick=()=>deleteExercise(b.dataset.deleteEx));
  section.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startSession(b.dataset.start));
 }
 async function addExercise(subId){
  const name=prompt('Nome do exercício:');if(!name?.trim())return;
  const raw=prompt('Séries e repetições (ex.: 12,10,8):','12,10,8')||'12,10,8';
  const rest=parseRestSeconds(prompt('Descanso em segundos ou minutos (ex.: 60 ou 1 min):','90')||'90');
  let reps;try{reps=parseRepScheme(raw)}catch(err){return alert(err.message)}
  const sets=reps.map(value=>({reps:value,load_kg:null}));
  if(!sets.length)return alert('Informe repetições válidas.');
  const {data,error}=await dbRef().from('training_exercises').select('position').eq('subworkout_id',subId).order('position',{ascending:false}).limit(1);
  if(error)return alert(error.message);
  const r=await dbRef().from('training_exercises').insert({subworkout_id:subId,name:name.trim(),position:(data?.[0]?.position||0)+1,sets,rest_seconds:Math.max(0,Math.min(rest,3600))});
  if(r.error)return alert(r.error.message);openProgram(current.id);
 }
 async function editProgram(id){
  const p=plans.find(x=>String(x.id)===String(id));if(!p)return;
  const title=prompt('Nome do programa:',p.title);if(title===null)return;if(!title.trim())return alert('O nome do programa não pode ficar vazio.');
  const prefix=(p.description||'').match(/^\[MODALIDADE:\s*[^\]]+\]\s*/i)?.[0]||'';
  const description=prompt('Descrição do programa:',(p.description||'').replace(/^\[MODALIDADE:\s*[^\]]+\]\s*/i,''));if(description===null)return;
  const {error}=await dbRef().from('training_programs').update({title:title.trim(),description:prefix+description.trim()}).eq('id',p.id);
  if(error)return alert('Não foi possível editar o programa: '+error.message);await home();
 }
 async function archiveProgram(id){
  const p=plans.find(x=>String(x.id)===String(id));if(!p)return;
  if(!confirm('Excluir este programa da lista de treinos? Ele será arquivado para preservar o histórico das sessões.'))return;
  const {error}=await dbRef().from('training_programs').update({status:'archived'}).eq('id',p.id);
  if(error)return alert('Não foi possível excluir o programa: '+error.message);current=null;await home();
 }
 async function editSubworkout(id){
  const item=subworkouts.find(x=>String(x.id)===String(id));if(!item)return;
  const title=prompt('Nome do subtreino:',item.title);if(title===null)return;if(!title.trim())return alert('O nome do subtreino não pode ficar vazio.');
  const description=prompt('Descrição do subtreino:',item.description||'');if(description===null)return;
  const {error}=await dbRef().from('training_subworkouts').update({title:title.trim(),description:description.trim()||null}).eq('id',item.id);
  if(error)return alert('Não foi possível editar o subtreino: '+error.message);await openProgram(current.id);
 }
 async function deleteSubworkout(id){
  const item=subworkouts.find(x=>String(x.id)===String(id));if(!item)return;
  if(!confirm('Excluir o subtreino "'+item.title+'"?'))return;
  const db=dbRef(),used=await db.from('training_sessions').select('id',{count:'exact',head:true}).eq('subworkout_id',item.id);
  if(used.error)return alert('Não foi possível verificar o histórico: '+used.error.message);
  if((used.count||0)>0)return alert('Este subtreino já tem sessões registradas. Para preservar o histórico, ele não pode ser excluído.');
  const delExercises=await db.from('training_exercises').delete().eq('subworkout_id',item.id);
  if(delExercises.error)return alert('Não foi possível excluir os exercícios: '+delExercises.error.message);
  const {error}=await db.from('training_subworkouts').delete().eq('id',item.id);
  if(error)return alert('Não foi possível excluir o subtreino: '+error.message);await openProgram(current.id);
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
  if(q.error||!q.data)return alert('Não foi possível abrir o exercício para edição.');
  const e=q.data,name=prompt('Nome do exercício:',e.name);if(name===null)return;if(!name.trim())return alert('O nome do exercício não pode ficar vazio.');
  const repText=prompt('Séries e repetições (ex.: 3 x 10, 3 x MR ou 12, 10, 8):',(e.sets||[]).map(x=>x.reps).join(', '));if(repText===null)return;
  let reps;try{reps=parseRepScheme(repText)}catch(err){return alert(err.message)}
  const loadText=prompt('Carga por série em kg, separada por ponto e vírgula. Deixe vazio para manter as cargas atuais:',(e.sets||[]).map(x=>x.load_kg??'').join(';'));if(loadText===null)return;
  let loads=(e.sets||[]).map(x=>x.load_kg??null);
  if(loadText.trim()){
   const parts=loadText.split(';').map(x=>x.trim());
   if(parts.length===1&&reps.length>1)parts.push(...Array(reps.length-1).fill(parts[0]));
   if(parts.length!==reps.length)return alert('Informe uma carga ou um valor por série.');
   loads=parts.map(v=>v===''||v==='-'?null:Number(v.replace(',','.')));
   if(loads.some(v=>v!==null&&(!Number.isFinite(v)||v<0)))return alert('Há uma carga inválida.');
  }else loads=reps.map((_,i)=>loads[i]??null);
  const restText=prompt('Descanso (segundos, mm:ss ou minutos):',String(e.rest_seconds??0));if(restText===null)return;
  const rest=parseRestSeconds(restText);if(!rest&&restText.trim()!=='0')return alert('Informe um descanso válido.');
  const sets=reps.map((r,i)=>({reps:r,load_kg:loads[i]??null}));
  const {error}=await db.from('training_exercises').update({name:name.trim(),sets,rest_seconds:rest}).eq('id',id);
  if(error)return alert('Não foi possível editar o exercício: '+error.message);await openProgram(current.id);
 }
 async function deleteExercise(id){
  const db=dbRef(),q=await db.from('training_exercises').select('*').eq('id',id).maybeSingle();
  if(q.error||!q.data)return alert('Não foi possível localizar o exercício.');
  if(!confirm('Excluir o exercício "'+q.data.name+'"?'))return;
  const used=await db.from('training_set_logs').select('id',{count:'exact',head:true}).eq('exercise_id',id);
  if(used.error)return alert('Não foi possível verificar o histórico: '+used.error.message);
  if((used.count||0)>0)return alert('Este exercício tem séries registradas. Para preservar o histórico, ele não pode ser excluído.');
  const {error}=await db.from('training_exercises').delete().eq('id',id);
  if(error)return alert('Não foi possível excluir o exercício: '+error.message);await openProgram(current.id);
 }
 async function requestDeletion(){
  const reason=prompt('Motivo do pedido de arquivamento (opcional):')||null;
  const {error}=await dbRef().from('training_program_deletion_requests').insert({program_id:current.id,requested_by:userRef().id,reason});
  if(error)return alert(error.message);
  await dbRef().from('training_programs').update({status:'deletion_pending'}).eq('id',current.id);
  await dbRef().from('app_notifications').insert({user_id:current.athlete_id,type:'deletion_request',title:'Pedido de arquivamento',body:'Um profissional solicitou arquivar um programa. Aprove ou rejeite o pedido.',entity_id:current.id});
  alert('Pedido enviado ao atleta para aprovação.');
 }
 let sessionPlan=[],sessionIndex=0,sessionExerciseRows=[],sessionLoads={};
 function renderSessionStep(){
  const host=$('sessionExercises');if(!host)return;
  if(sessionIndex>=sessionPlan.length){finishSession();return}
  const item=sessionPlan[sessionIndex],e=item.exercise,set=item.set,setNo=item.setIndex+1,total=(e.sets||[]).length;
  const planned=set.reps==='MR'?'MR':Number(set.reps)||0;
  const loadKey=e.id+':'+item.setIndex;
  if(sessionLoads[loadKey]===undefined)sessionLoads[loadKey]=set.load_kg??'';
  const loadValue=sessionLoads[loadKey];
  const setDots=(e.sets||[]).map((x,i)=>'<span style="display:inline-block;padding:8px 11px;margin:4px;border:1px solid '+(i===item.setIndex?'#b7f34a':'#354454')+';border-radius:9px;background:'+(i===item.setIndex?'#28371a':'#111922')+';color:'+(i===item.setIndex?'#b7f34a':'#f4f7fa')+';font-weight:800">'+(x.reps==='MR'?'MR':esc(x.reps))+'</span>').join('');
  const media=e.media_url?'<img src="'+esc(e.media_url)+'" alt="Demonstração de '+esc(e.name)+'" style="width:100%;max-height:320px;object-fit:contain;background:#111922;border:1px solid #354454;border-radius:12px;margin:12px 0">':'';
  host.innerHTML='<div class="panel" style="padding:18px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><div class="muted">'+esc(current.title)+' · exercício '+(item.exerciseIndex+1)+' de '+sessionExerciseRows.length+'</div><button class="btn alt" id="exitSession">Sair</button></div><div style="height:8px;background:#354454;border-radius:9px;margin:12px 0 18px"><span style="display:block;width:'+Math.round(((sessionIndex+1)/sessionPlan.length)*100)+'%;height:100%;background:#b7f34a;border-radius:9px"></span></div>'+media+'<h2 style="margin:8px 0;font-size:28px">'+esc(e.name)+'</h2>'+(e.notes?'<p class="muted">'+esc(e.notes)+'</p>':'')+'<p class="muted">'+total+' séries · '+(e.sets||[]).map(x=>x.reps==='MR'?'MR':esc(x.reps)).join(' / ')+' · descanso '+(Number(e.rest_seconds)||0)+' s</p><div style="margin:12px 0">'+setDots+'</div><label for="sessionLoad">Carga da série '+setNo+' ('+(planned==='MR'?'MR':planned+' reps')+'), em kg</label><div style="display:grid;grid-template-columns:74px 1fr 74px;gap:8px;align-items:center"><button class="btn alt" id="loadDown" type="button">−2,5</button><input id="sessionLoad" type="number" min="0" step="0.25" placeholder="Informe a carga" value="'+(loadValue??'')+'" style="background:#111922;border:1px solid #354454;color:#f4f7fa;border-radius:10px;padding:12px;width:100%"><button class="btn alt" id="loadUp" type="button">+2,5</button></div>'+(planned==='MR'?'<label for="sessionReps">Repetições realizadas</label><input id="sessionReps" type="number" min="1" placeholder="Informe quantas conseguiu">':'')+'<button class="btn" id="completeSet" style="width:100%;margin-top:14px">Concluir série '+setNo+(planned==='MR'?' (MR)':' ('+planned+' reps)')+'</button><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn alt" id="skipSet">Pular série (não executada)</button><button class="btn alt" id="skipExercise">Pular exercício</button></div></div><div id="restPanel" class="panel" style="display:none;text-align:center"><div class="eyebrow">DESCANSO</div><div id="restClock" style="font-size:52px;font-weight:900;color:#b7f34a">00:00</div><p class="muted" id="nextStepText"></p><p class="muted">O tempo usa o relógio real. Você pode trocar de aba; o aviso aparece ao terminar.</p><button class="btn alt" id="skipRest">Pular descanso</button></div>';
  $('sessionLoad').oninput=()=>{sessionLoads[loadKey]=$('sessionLoad').value};
  $('loadDown').onclick=()=>adjustLoad(loadKey,-2.5);
  $('loadUp').onclick=()=>adjustLoad(loadKey,2.5);
  $('completeSet').onclick=completeCurrentSet;
  $('skipSet').onclick=skipCurrentSet;$('skipExercise').onclick=skipCurrentExercise;
  $('exitSession').onclick=()=>{if(timer)clearInterval(timer);timer=null;openProgram(current.id)};
 }
 function adjustLoad(loadKey,delta){
  const input=$('sessionLoad');if(!input)return;
  const value=Number(input.value||0),next=Math.max(0,value+delta);
  input.value=Number(next.toFixed(2));sessionLoads[loadKey]=input.value;
 }
 async function enableWorkoutNotifications(){
  if(!('Notification' in window)){notificationsAllowed=false;return}
  try{if(Notification.permission==='granted')notificationsAllowed=true;else if(Notification.permission==='default')notificationsAllowed=(await Notification.requestPermission())==='granted';else notificationsAllowed=false}catch(_){notificationsAllowed=false}
 }
 function tickRestTimer(){
  if(!activeRest)return;
  const remaining=Math.max(0,Math.ceil((activeRest.deadline-Date.now())/1000));
  const clock=$('restClock');if(clock){const m=Math.floor(remaining/60),s=remaining%60;clock.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
  if(remaining>0)return;
  const rest=activeRest;
  if(!rest.notified){
   rest.notified=true;
   if(notificationsAllowed){try{new Notification('Descanso finalizado',{body:rest.nextText,tag:'nexfit-rest-'+(session?.id||'active')})}catch(_){}}
   if(navigator.vibrate)navigator.vibrate([180,80,180]);
   const text=$('nextStepText');if(text)text.textContent='Descanso concluído. '+rest.nextText;
  }
  rest.advance();
 }
 document.addEventListener('visibilitychange',()=>{if(activeRest)tickRestTimer()});
 function skipCurrentSet(){
  if(!session)return;
  if(!confirm('Pular esta série? Ela será registrada no histórico como não executada.'))return;
  sessionIndex++;renderSessionStep();
 }
 function skipCurrentExercise(){
  if(!session)return;
  const item=sessionPlan[sessionIndex];if(!item)return;
  if(!confirm('Pular o restante de "'+item.exercise.name+'"? As séries restantes ficarão como não executadas.'))return;
  let next=sessionIndex+1;while(next<sessionPlan.length&&sessionPlan[next].exerciseIndex===item.exerciseIndex)next++;
  sessionIndex=next;renderSessionStep();
 }
 async function completeCurrentSet(){
  const item=sessionPlan[sessionIndex],repsInput=$('sessionReps');
  const reps=repsInput?repsInput.value.trim():String(item.set.reps??'');
  const load=$('sessionLoad')?.value.trim()??'';
  if(!reps||reps==='MR'||Number(reps)<1)return alert('Informe as repetições realizadas.');
  if(load!=='')sessionLoads[item.exercise.id+':'+item.setIndex]=load;
  const row={session_id:session.id,exercise_id:item.exercise.id,set_number:item.setIndex+1,reps_completed:Number(reps),load_kg:load===''?(item.set.load_kg??null):Number(load)};
  const {error}=await dbRef().from('training_set_logs').insert(row);
  if(error)return alert('Não foi possível salvar esta série: '+error.message);
  const rest=parseRestSeconds(item.exercise.rest_seconds),panel=$('restPanel'),clock=$('restClock'),complete=$('completeSet');
  if(complete)complete.disabled=true;
  if(!rest){sessionIndex++;renderSessionStep();return}
  panel.style.display='block';const deadline=Date.now()+rest*1000;
  const next=sessionPlan[sessionIndex+1];
  const nextText=next?'Próxima: '+next.exercise.name+' · série '+(next.setIndex+1)+' · '+(next.set.reps==='MR'?'MR':next.set.reps+' reps')+' · carga '+(next.set.load_kg==null?'a informar':next.set.load_kg+' kg'):'Último descanso do treino.';
  $('nextStepText').textContent=nextText;
  const advance=()=>{if(timer)clearInterval(timer);timer=null;activeRest=null;sessionIndex++;renderSessionStep()};
  activeRest={deadline,advance,nextText,notified:false};
  $('skipRest').onclick=advance;
  timer=setInterval(tickRestTimer,250);tickRestTimer();
 }
 async function startSession(subId){
  const db=dbRef(),sub=subworkouts.find(s=>s.id===subId);
  const ex=await db.from('training_exercises').select('*').eq('subworkout_id',subId).order('position');
  if(ex.error)return alert(ex.error.message);
  if(!ex.data?.length)return alert('Este subtreino ainda não possui exercícios.');
  await enableWorkoutNotifications();
  const {data,error}=await db.from('training_sessions').insert({athlete_id:userRef().id,program_id:current.id,version_id:version.id,subworkout_id:subId}).select().single();
  if(error)return alert(error.message);session=data;sessionExerciseRows=ex.data;sessionPlan=[];
  ex.data.forEach((exercise,exerciseIndex)=>(exercise.sets||[]).forEach((set,setIndex)=>sessionPlan.push({exercise,exerciseIndex,set,setIndex})));
  sessionIndex=0;sessionLoads={};
  shell('Treino em andamento','<div class="panel"><h3>'+esc(current.title)+' · '+esc(sub?.title||'Treino')+'</h3><p class="muted">Faça uma série por vez. Registre as repetições; a carga é opcional. Ao concluir, o descanso será cronometrado automaticamente.</p><div id="sessionExercises"></div><button class="btn alt" id="cancelSession">Voltar ao programa</button></div>');
  $('cancelSession').onclick=()=>{if(timer)clearInterval(timer);timer=null;openProgram(current.id)};
  renderSessionStep();
 }
 async function finishSession(){
  if(!session)return;
  if(timer)clearInterval(timer);timer=null;
  const {error}=await dbRef().from('training_sessions').update({status:'completed',finished_at:new Date().toISOString()}).eq('id',session.id).eq('athlete_id',userRef().id);
  if(error)return alert('Não foi possível finalizar a sessão: '+error.message);
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
  if(!available.length)return alert('Você ainda não possui um programa de musculação ativo. Acesse a aba Musculação para criar ou importar seu programa.');
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b===tab));document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p===section));
  const showPrograms=()=>{
   shell('Escolha seu programa','<div class="panel"><p class="muted">Selecione o programa que você vai executar agora.</p>'+available.map((p,i)=>'<div class="item"><strong>'+esc(p.title)+'</strong><p class="muted">'+esc((p.description||'').replace(/\[MODALIDADE:[^\]]+\]\s*/i,''))+'</p><button class="btn" data-select-program="'+p.id+'">Escolher programa</button></div>').join('')+'</div>');
   section.querySelectorAll('[data-select-program]').forEach(button=>button.onclick=()=>chooseProgram(button.dataset.selectProgram));
  };
  const chooseProgram=async id=>{
   const program=available.find(p=>String(p.id)===String(id));if(!program)return;
   const vq=await db.from('training_program_versions').select('*').eq('id',program.current_version_id).maybeSingle();
   if(vq.error||!vq.data)return alert('Não foi possível localizar a versão vigente deste programa.');
   const sq=await db.from('training_subworkouts').select('*').eq('version_id',vq.data.id).order('position');
   if(sq.error)return alert(sq.error.message);
   if(!sq.data?.length)return alert('Este programa ainda não possui subtreinos. Adicione A, B, C… na aba Musculação.');
   current=program;version=vq.data;subworkouts=sq.data;
   shell('Qual subtreino você vai executar?','<div class="panel"><p class="muted">'+esc(program.title)+' · Escolha seu treino de hoje.</p>'+sq.data.map((s,i)=>'<div class="item"><strong style="font-size:18px">'+esc(s.title)+'</strong><p class="muted">'+esc(s.description||'Subtreino '+(i+1))+'</p><button class="btn" data-start-selected="'+s.id+'">Começar este treino</button></div>').join('')+'<button class="btn alt" id="backPrograms">Escolher outro programa</button></div>');
   section.querySelectorAll('[data-start-selected]').forEach(button=>button.onclick=()=>startSession(button.dataset.startSelected));
   $('backPrograms').onclick=showPrograms;
  };
  if(available.length===1)chooseProgram(available[0].id);else showPrograms();
 };
 home();
})();