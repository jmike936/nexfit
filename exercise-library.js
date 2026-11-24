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
 const words=original.toLocaleLowerCase('pt-BR').split(/(\\s+)/);
 let first=true;
 return words.map(word=>{
  if(/^\\s+$/.test(word))return word;
  const key=word.replace(/^[^\\p{L}\\p{N}]|[^\\p{L}\\p{N}]$/gu,'');
  const acronym=EXERCISE_ACRONYMS.get(key);
  if(acronym){first=false;return word.replace(key,acronym)}
  if(!first&&SMALL_NAME_WORDS.has(key)){return word}
  first=false;
  return word.replace(/(^|[^\\p{L}\\p{N}])([\\p{L}])/gu,(_,prefix,letter)=>prefix+letter.toLocaleUpperCase('pt-BR'));
 }).join('');
}
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeImageUrl=value=>{try{const url=new URL(String(value||''));return url.protocol==='https:'?url.href:''}catch(_){return ''}};
function cacheKey(){return CACHE_KEY_PREFIX+activeUserId}
function readCache(){try{const raw=localStorage.getItem(cacheKey());if(!raw)return null;const parsed=JSON.parse(raw);return Array.isArray(parsed.items)?parsed.items:null}catch(_){return null}}
function writeCache(data){try{localStorage.setItem(cacheKey(),JSON.stringify({savedAt:new Date().toISOString(),items:data}))}catch(error){console.warn('[NEXFIT] Biblioteca: cache local indisponível',error)}}
function filteredItems(){
 const query=normalize($('exerciseLibrarySearch')?.value),category=$('exerciseLibraryCategory')?.value||'';
 return items.filter(item=>(!category||item.category===category)&&(!query||normalize([item.name,item.category,...(item.primary_muscles||[]),...(item.secondary_muscles||[])].join(' ')).includes(query)));
}
function render(){
 const host=$('exerciseLibraryResults');if(!host)return;
 const filtered=filteredItems();
 $('exerciseLibraryCount').textContent=filtered.length+' '+(filtered.length===1?'exercício':'exercícios');
 if(!filtered.length){host.innerHTML='<div class="exercise-library-empty"><strong>Nenhum exercício encontrado</strong><span>Tente outro nome ou grupo muscular.</span></div>';return}
 host.innerHTML=filtered.map(item=>{
  const image=safeImageUrl(item.demonstration_image_url),muscles=(item.primary_muscles||[]).slice(0,2).map(escapeHtml).join(' · ');
  return '<button class="exercise-library-card" type="button" data-exercise-id="'+escapeHtml(item.id)+'"><span class="exercise-library-thumb">'+(image?'<img src="'+escapeHtml(image)+'" alt="" loading="lazy">':'<span aria-hidden="true">🏋️</span>')+'</span><span class="exercise-library-card-copy"><strong>'+escapeHtml(formatExerciseName(item.name))+'</strong><small>'+escapeHtml(item.category||'Outros')+(muscles?' · '+muscles:'')+'</small></span><span class="exercise-library-chevron" aria-hidden="true">›</span></button>';
 }).join('');
 host.querySelectorAll('[data-exercise-id]').forEach(button=>button.addEventListener('click',()=>openDetail(button.dataset.exerciseId)));
}
function renderCategories(){
 const select=$('exerciseLibraryCategory');if(!select)return;
 const previous=select.value,categories=[...new Set(items.map(item=>item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 select.innerHTML='<option value="">Todos os grupos</option>'+categories.map(category=>'<option value="'+escapeHtml(category)+'">'+escapeHtml(category)+'</option>').join('');
 if(categories.includes(previous))select.value=previous;
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
 const response=await db.from('training_exercise_catalog').select('id,name,category,demonstration_image_url,demonstration_end_image_url,execution_instructions,primary_muscles,secondary_muscles').eq('is_active',true).order('name');
 if(response.error){
  if(/column .* does not exist|could not find .* column|schema cache/i.test(response.error.message||'')){
   const fallback=await db.from('training_exercise_catalog').select('id,name,category,demonstration_image_url,execution_instructions,primary_muscles').eq('is_active',true).order('name');
   if(fallback.error)throw fallback.error;
   return (fallback.data||[]).map(item=>({...item,demonstration_end_image_url:null,secondary_muscles:null}));
  }
  throw response.error;
 }
 return response.data||[];
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
 $('exerciseLibrarySearch').addEventListener('input',render);
 $('exerciseLibraryCategory').addEventListener('change',render);
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