(function(){
'use strict';
const CACHE_KEY_PREFIX='nexfit-exercise-library:v1:';
const IMAGE_CACHE='nexfit-exercise-library-images-v1';
const $=id=>document.getElementById(id);
let items=[],activeUserId=null,activeItem=null,objectUrls=[];
const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g,' ');
const SMALL_NAME_WORDS=new Set(['a','as','ao','aos','com','da','das','de','do','dos','e','em','na','nas','no','nos','para','por']);
const EXERCISE_ACRONYMS=new Map([['hiit','HIIT'],['trx','TRX'],['wod','WOD'],['1rm','1RM'],['rpe','RPE'],['rir','RIR'],['bosu','BOSU'],['ems','EMS']]);
function formatExerciseName(value){
 const original=String(value??'').trim();
 if(!original||original!==original.toLocaleUpperCase('pt-BR')||!/[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(original))return original;
 const words=original.toLocaleLowerCase('pt-BR').split(/(\s+)/);
 let first=true;
 return words.map(word=>{
  if(/^\s+$/.test(word))return word;
  const key=word.replace(/^[^\p{L}\p{N}]|[^\p{L}\p{N}]$/gu,'');
  const acronym=EXERCISE_ACRONYMS.get(key);
  if(acronym){first=false;return word.replace(key,acronym)}
  if(!first&&SMALL_NAME_WORDS.has(key)){return word}
  first=false;
  return word.replace(/(^|[^\p{L}\p{N}])([\p{L}])/gu,(_,prefix,letter)=>prefix+letter.toLocaleUpperCase('pt-BR'));
 }).join('');
}
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeImageUrl=value=>{try{const url=new URL(String(value||''));return url.protocol==='https:'?url.href:''}catch(_){return ''}};
function cacheKey(){return CACHE_KEY_PREFIX+activeUserId}
function readCache(){try{const raw=localStorage.getItem(cacheKey());if(!raw)return null;const parsed=JSON.parse(raw);return Array.isArray(parsed.items)?parsed.items:null}catch(_){return null}}
function writeCache(data){try{localStorage.setItem(cacheKey(),JSON.stringify({savedAt:new Date().toISOString(),items:data}))}catch(error){console.warn('[NEXFIT] Biblioteca: cache local indisponível',error)}}
function taxonomyNames(item,key){return (Array.isArray(item[key])?item[key]:[]).map(value=>typeof value==='string'?value:value?.name).filter(Boolean)}
function primaryGroup(item){return (item.taxonomy_groups||[]).find(group=>group.is_primary)?.name||item.taxonomy_groups?.[0]?.name||item.category||'Outros'}
function filteredItems(){
 const query=normalize($('exerciseLibrarySearch')?.value),group=$('exerciseLibraryCategory')?.value||'';
 const modality=$('exerciseLibraryModality')?.value||'',equipment=$('exerciseLibraryEquipment')?.value||'',pattern=$('exerciseLibraryPattern')?.value||'';
 return items.filter(item=>{
  const groups=taxonomyNames(item,'taxonomy_groups');if(!groups.length&&item.category)groups.push(item.category);
  const modalities=taxonomyNames(item,'taxonomy_modalities'),equipmentNames=taxonomyNames(item,'taxonomy_equipment'),patterns=taxonomyNames(item,'taxonomy_patterns');
  const text=[item.name,item.category,primaryGroup(item),...groups,...modalities,...equipmentNames,...patterns,...(item.primary_muscles||[]),...(item.secondary_muscles||[])].join(' ');
  return (!group||groups.includes(group))&&(!modality||modalities.includes(modality))&&(!equipment||equipmentNames.includes(equipment))&&(!pattern||patterns.includes(pattern))&&(!query||normalize(text).includes(query));
 });
}
function renderFilter(id,values,label){
 const select=$(id);if(!select)return;
 const previous=select.value,unique=[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 select.innerHTML='<option value="">'+escapeHtml(label)+'</option>'+unique.map(value=>'<option value="'+escapeHtml(value)+'">'+escapeHtml(value)+'</option>').join('');
 select.hidden=!unique.length;
 if(unique.includes(previous))select.value=previous;
}
function render(){
 const host=$('exerciseLibraryResults');if(!host)return;
 const filtered=filteredItems();
 $('exerciseLibraryCount').textContent=filtered.length+' '+(filtered.length===1?'exercício':'exercícios');
 if(!filtered.length){host.innerHTML='<div class="exercise-library-empty"><strong>Nenhum exercício encontrado</strong><span>Tente outro nome ou grupo muscular.</span></div>';return}
 host.innerHTML=filtered.map(item=>{
  const image=safeImageUrl(item.demonstration_image_url),muscles=(item.primary_muscles||[]).slice(0,2).map(escapeHtml).join(' · ');
  return '<button class="exercise-library-card" type="button" data-exercise-id="'+escapeHtml(item.id)+'"><span class="exercise-library-thumb">'+(image?'<img src="'+escapeHtml(image)+'" alt="" loading="lazy">':'<span aria-hidden="true">🏋️</span>')+'</span><span class="exercise-library-card-copy"><strong>'+escapeHtml(formatExerciseName(item.name))+'</strong><small>'+escapeHtml(primaryGroup(item))+(muscles?' · '+muscles:'')+'</small></span><span class="exercise-library-chevron" aria-hidden="true">›</span></button>';
 }).join('');
 host.querySelectorAll('[data-exercise-id]').forEach(button=>button.addEventListener('click',()=>openDetail(button.dataset.exerciseId)));
}
function renderCategories(){
 const groups=items.flatMap(item=>{const values=taxonomyNames(item,'taxonomy_groups');return values.length?values:[item.category]});
 renderFilter('exerciseLibraryCategory',groups,'Todos os grupos');
 renderFilter('exerciseLibraryModality',items.flatMap(item=>taxonomyNames(item,'taxonomy_modalities')),'Todas as modalidades');
 renderFilter('exerciseLibraryEquipment',items.flatMap(item=>taxonomyNames(item,'taxonomy_equipment')),'Todos os equipamentos');
 renderFilter('exerciseLibraryPattern',items.flatMap(item=>taxonomyNames(item,'taxonomy_patterns')),'Todos os movimentos');
}
async function loadImage(url,img){
 const safe=safeImageUrl(url);if(!safe||!img)return;
 try{
  if('caches' in window){
   const cache=await caches.open(IMAGE_CACHE),cached=await cache.match(safe);
   if(cached){const blob=await cached.blob(),objectUrl=URL.createObjectURL(blob);objectUrls.push(objectUrl);img.src=objectUrl;return}
  }
  if(!navigator.onLine){img.hidden=true;return}
  const response=await fetch(safe,{mode:'cors'});
  if(!response.ok)throw Error('Imagem indisponível');
  const copy=response.clone();
  if('caches' in window){try{const cache=await caches.open(IMAGE_CACHE);await cache.put(safe,copy)}catch(_){}}
  const blob=await response.blob(),objectUrl=URL.createObjectURL(blob);objectUrls.push(objectUrl);img.src=objectUrl;
 }catch(error){img.src=safe;img.hidden=false}
}
function closeDetail(){
 const modal=$('exerciseLibraryModal');if(modal)modal.hidden=true;
 activeItem=null;
 objectUrls.forEach(url=>URL.revokeObjectURL(url));objectUrls=[];
}
function openDetail(id){
 const item=items.find(entry=>String(entry.id)===String(id));if(!item)return;
 activeItem=item;const modal=$('exerciseLibraryModal');
 $('exerciseLibraryDetailTitle').textContent=formatExerciseName(item.name);
 $('exerciseLibraryDetailCategory').textContent=item.category||'Outros';
 $('exerciseLibraryDetailPrimary').textContent=(item.primary_muscles||[]).join(', ')||'Não informado';
 $('exerciseLibraryDetailSecondary').textContent=(item.secondary_muscles||[]).join(', ')||'Não informado';
 const taxonomyParts=[];
 const groupNames=taxonomyNames(item,'taxonomy_groups');if(groupNames.length)taxonomyParts.push('Grupo: '+groupNames.join(', '));
 const modalityNames=taxonomyNames(item,'taxonomy_modalities');if(modalityNames.length)taxonomyParts.push('Modalidade: '+modalityNames.join(', '));
 const equipmentNames=taxonomyNames(item,'taxonomy_equipment');if(equipmentNames.length)taxonomyParts.push('Equipamento: '+equipmentNames.join(', '));
 const patternNames=taxonomyNames(item,'taxonomy_patterns');if(patternNames.length)taxonomyParts.push('Movimento: '+patternNames.join(', '));
 $('exerciseLibraryTaxonomySummary').textContent=taxonomyParts.join(' · ')||'Taxonomia estruturada ainda não disponível; exibindo a classificação legada.';
 $('exerciseLibraryInstructions').textContent=item.execution_instructions||'As instruções deste exercício ainda não foram cadastradas.';
 const start=$('exerciseLibraryStartImage'),end=$('exerciseLibraryEndImage'),startWrap=$('exerciseLibraryStartWrap'),endWrap=$('exerciseLibraryEndWrap');
 start.src='';end.src='';start.hidden=!safeImageUrl(item.demonstration_image_url);end.hidden=!safeImageUrl(item.demonstration_end_image_url);
 startWrap.hidden=start.hidden;endWrap.hidden=end.hidden;
 $('exerciseLibraryImageFallback').hidden=!(start.hidden&&end.hidden);
 modal.hidden=false;
 loadImage(item.demonstration_image_url,start);
 loadImage(item.demonstration_end_image_url,end);
 $('exerciseLibraryClose').focus();
}
async function fetchCatalog(){
 if(!db||!currentUser?.id)throw Error('Entre na sua conta para acessar a biblioteca.');
 let response=await db.from('training_exercise_catalog').select('id,name,category,demonstration_image_url,demonstration_end_image_url,execution_instructions,primary_muscles,secondary_muscles').eq('is_active',true).order('name');
 if(response.error){
  if(/column .* does not exist|could not find .* column|schema cache/i.test(response.error.message||'')){
   const fallback=await db.from('training_exercise_catalog').select('id,name,category,demonstration_image_url,execution_instructions,primary_muscles').eq('is_active',true).order('name');
   if(fallback.error)throw fallback.error;
   response={data:(fallback.data||[]).map(item=>({...item,demonstration_end_image_url:null,secondary_muscles:null})),error:null};
  }else throw response.error;
 }
 const catalog=response.data||[];
 try{
  const [groups,modalities,equipment,patterns]=await Promise.all([
   db.from('training_exercise_catalog_groups').select('catalog_exercise_id,is_primary,group:training_exercise_groups(code,name)'),
   db.from('training_exercise_catalog_modalities').select('catalog_exercise_id,modality:training_exercise_modalities(code,name)'),
   db.from('training_exercise_catalog_equipment').select('catalog_exercise_id,equipment_role,equipment:training_exercise_equipment(code,name)'),
   db.from('training_exercise_catalog_movement_patterns').select('catalog_exercise_id,pattern:training_movement_patterns(code,name)')
  ]);
  const results=[groups,modalities,equipment,patterns];
  const failed=results.find(result=>result.error);
  if(failed)throw failed.error;
  const byId=(rows)=>rows.reduce((map,row)=>{const list=map.get(row.catalog_exercise_id)||[];list.push(row);map.set(row.catalog_exercise_id,list);return map},new Map());
  const groupMap=byId(groups.data||[]),modalityMap=byId(modalities.data||[]),equipmentMap=byId(equipment.data||[]),patternMap=byId(patterns.data||[]);
  return catalog.map(item=>({
   ...item,
   taxonomy_groups:(groupMap.get(item.id)||[]).map(row=>({name:row.group?.name||'',is_primary:!!row.is_primary})).filter(row=>row.name),
   taxonomy_modalities:(modalityMap.get(item.id)||[]).map(row=>row.modality?.name||'').filter(Boolean),
   taxonomy_equipment:(equipmentMap.get(item.id)||[]).map(row=>row.equipment?.name||'').filter(Boolean),
   taxonomy_patterns:(patternMap.get(item.id)||[]).map(row=>row.pattern?.name||'').filter(Boolean)
  }));
 }catch(error){
  console.info('[NEXFIT] Taxonomia estruturada indisponível; usando category legado.',error?.message||error);
  return catalog;
 }
}
async function load(){
 const host=$('exerciseLibraryResults');if(!host)return;
 if(!currentUser?.id){host.innerHTML='<div class="exercise-library-empty">Entre na sua conta para consultar a biblioteca.</div>';return}
 if(activeUserId!==currentUser.id){activeUserId=currentUser.id;items=[]}
 host.innerHTML='<div class="exercise-library-empty">Carregando exercícios…</div>';
 const cached=readCache();
 if(cached){items=cached;renderCategories();render();$('exerciseLibrarySyncStatus').textContent='Biblioteca salva neste aparelho';}
 if(!navigator.onLine){
  if(!cached)host.innerHTML='<div class="exercise-library-empty">A biblioteca ainda não foi salva neste aparelho. Conecte-se à internet uma vez para disponibilizá-la offline.</div>';
  return;
 }
 try{
  const latest=await fetchCatalog();
  if(currentUser?.id!==activeUserId)return;
  items=latest;writeCache(items);renderCategories();render();$('exerciseLibrarySyncStatus').textContent='Biblioteca atualizada';
 }catch(error){
  if(!cached)host.innerHTML='<div class="exercise-library-empty"><strong>Não foi possível carregar a biblioteca</strong><span>'+escapeHtml(error.message||'Verifique sua conexão e tente novamente.')+'</span></div>';
  $('exerciseLibrarySyncStatus').textContent=cached?'Exibindo a última cópia salva':'Falha ao atualizar';
 }
}
function init(){
 if(!$('exerciseLibraryPage'))return;
 const detailModal=$('exerciseLibraryModal');
 if(detailModal&&detailModal.parentElement!==document.body)document.body.appendChild(detailModal);
 ['exerciseLibrarySearch','exerciseLibraryCategory','exerciseLibraryModality','exerciseLibraryEquipment','exerciseLibraryPattern'].forEach(id=>$(id)?.addEventListener(id==='exerciseLibrarySearch'?'input':'change',render));
 $('exerciseLibraryRefresh').addEventListener('click',load);
 $('exerciseLibraryClose').addEventListener('click',closeDetail);
 $('exerciseLibraryModal').addEventListener('click',event=>{if(event.target===$('exerciseLibraryModal'))closeDetail()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('exerciseLibraryModal').hidden)closeDetail()});
 document.querySelector('[data-page="exerciseLibraryPage"]')?.addEventListener('click',()=>{if(!items.length||activeUserId!==currentUser?.id)load()});
 window.addEventListener('online',()=>{if(document.getElementById('exerciseLibraryPage')?.classList.contains('active'))load()});
 window.addEventListener('storage',event=>{if(event.key?.startsWith(CACHE_KEY_PREFIX)&&activeUserId&&event.key!==cacheKey()){items=[]}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();