(()=>{if(window.__nexfitExerciseEvolution)return;window.__nexfitExerciseEvolution=true;
const normalizeHumanText=s=>{const text=String(s??'').normalize('NFC').replace(/\s+/gu,' ').trim();if(!text)return '';const acronyms=new Set(['NEXFIT','HIIT','AMRAP','BCAA','TRX','MR','RM','PR','PB','ABC']);let first=true;return text.toLocaleLowerCase('pt-BR').replace(/[\p{L}\p{M}]+/gu,word=>{const upper=word.toLocaleUpperCase('pt-BR');if(acronyms.has(upper))return upper;if(first){first=false;return word.charAt(0).toLocaleUpperCase('pt-BR')+word.slice(1)}return word})};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getClient=()=>window.db||(typeof db!=='undefined'?db:null);
const user=()=>window.currentUser||(typeof currentUser!=='undefined'?currentUser:null);
const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLocaleLowerCase('pt-BR');
const css=`
#strengthPage .evolution-wrap{display:grid;gap:14px}
#strengthPage .evolution-intro{color:#a0a99c;font-size:13px;margin:0}
#strengthPage .evolution-panel{background:linear-gradient(145deg,#202b37,#18212b);border:1px solid #2b3948;border-radius:16px;padding:15px}
#strengthPage .evolution-panel label{display:block;color:#a0a99c;font-size:12px;margin:0 0 7px}
#strengthPage .evolution-panel select{width:100%;background:#111922;border:1px solid #354454;color:#f4f7fa;border-radius:10px;padding:12px}
#strengthPage .evolution-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
#strengthPage .evolution-stat{min-width:0;padding:12px 8px;background:#111922;border:1px solid #303a30;border-radius:12px;text-align:center}
#strengthPage .evolution-stat span{display:block;color:#a0a99c;font-size:11px}
#strengthPage .evolution-stat strong{display:block;margin-top:5px;font-size:19px;overflow-wrap:anywhere}
#strengthPage .evolution-chart{width:100%;height:auto;display:block;overflow:visible}
#strengthPage .evolution-chart text{fill:#a0a99c;font-size:10px}
#strengthPage .evolution-chart .grid{stroke:#354454;stroke-width:1;stroke-dasharray:3 4}
#strengthPage .evolution-chart .line{fill:none;stroke:#b7f34a;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
#strengthPage .evolution-chart .dot{fill:#b7f34a;stroke:#17200b;stroke-width:2}
#strengthPage .evolution-chart-empty{padding:24px 8px;text-align:center;color:#a0a99c}
#strengthPage .evolution-record{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:11px 0;border-top:1px solid #354454}
#strengthPage .evolution-record strong{display:block}
#strengthPage .evolution-record small{display:block;color:#a0a99c;margin-top:3px}
#strengthPage .evolution-record b{white-space:nowrap;color:#b7f34a}
#strengthPage .evolution-empty{padding:24px 16px;text-align:center;background:#1d271f;border:1px solid #303a30;border-radius:14px;color:#a0a99c}
#strengthPage .personal-records{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-bottom:14px}
#strengthPage .personal-record{min-width:0;padding:13px;background:#111922;border:1px solid #354454;border-radius:12px}
#strengthPage .personal-record span{display:block;color:#a0a99c;font-size:11px}
#strengthPage .personal-record strong{display:block;color:#b7f34a;font-size:20px;margin:4px 0;overflow-wrap:anywhere}
#strengthPage .personal-record small{display:block;color:#a0a99c;font-size:11px}
@media(max-width:420px){#strengthPage .personal-record{padding:10px}#strengthPage .personal-record strong{font-size:17px}}
@media(max-width:420px){#strengthPage .evolution-stats{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}#strengthPage .evolution-stat{padding:10px 4px}#strengthPage .evolution-stat strong{font-size:16px}}
`;
const style=document.createElement('style');style.textContent=css;document.head.append(style);
let cache=null,cachedUserId=null;
function kg(n){return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2})+' kg'}
function dateLabel(value){if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)){const [y,m,d]=value.split('-');return d+'/'+m+'/'+y}const d=new Date(value);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric'}).format(d)}
async function load(){
 const client=getClient(),u=user();if(!client||!u?.id)throw Error('Faça login para consultar sua evolução.');
 // A Evolução só inclui sessões que ainda possuem atividade correspondente no histórico do atleta.
 // A atividade guarda o vínculo explícito [NEXFIT_SESSION:<uuid>], evitando exibir séries de atividades excluídas.
 const activitiesQ=await client.from('activities').select('notes,activity_date').eq('user_id',u.id).eq('sport','Musculação').order('activity_date',{ascending:false}).limit(500);
 if(activitiesQ.error)throw activitiesQ.error;
 const activityDateBySession=new Map((activitiesQ.data||[]).map(a=>({id:(a.notes||'').match(/\[NEXFIT_SESSION:([a-f0-9-]+)\]/i)?.[1],date:a.activity_date})).filter(a=>a.id&&a.date).map(a=>[a.id,a.date]));
 const sessionIds=[...activityDateBySession.keys()];
 if(!sessionIds.length)return [];
 const sessionsQ=await client.from('training_sessions').select('id,started_at,finished_at').eq('athlete_id',u.id).eq('status','completed').not('finished_at','is',null).in('id',sessionIds).order('started_at',{ascending:false}).limit(500);
 if(sessionsQ.error)throw sessionsQ.error;
 const sessions=sessionsQ.data||[];if(!sessions.length)return [];
 const sessionMap=new Map(sessions.map(s=>[s.id,s]));
 const ids=sessions.map(s=>s.id);
 const logsQ=await client.from('training_set_logs').select('session_id,exercise_id,set_number,reps_completed,load_kg,completed_at').in('session_id',ids).gt('reps_completed',0).not('load_kg','is',null).order('completed_at',{ascending:true}).limit(10000);
 if(logsQ.error)throw logsQ.error;
 const logs=logsQ.data||[];if(!logs.length)return [];
 const exerciseIds=[...new Set(logs.map(x=>x.exercise_id).filter(Boolean))];
 const exercisesQ=await client.from('training_exercises').select('id,name').in('id',exerciseIds);
 if(exercisesQ.error)throw exercisesQ.error;
 const exerciseMap=new Map((exercisesQ.data||[]).map(x=>[x.id,x.name]));
 const grouped=new Map();
 for(const log of logs){
  const name=exerciseMap.get(log.exercise_id);if(!name)continue;
  const key=normalize(name);if(!key)continue;
  const session=sessionMap.get(log.session_id);if(!session)continue;
  if(!grouped.has(key))grouped.set(key,{name:normalizeHumanText(name),points:[]});
  grouped.get(key).points.push({date:activityDateBySession.get(session.id)||log.completed_at||session.finished_at||session.started_at,load:Number(log.load_kg),reps:Number(log.reps_completed),set:Number(log.set_number),sessionId:log.session_id});
 }
 return [...grouped.values()].map(item=>({...item,points:item.points.sort((a,b)=>new Date(a.date)-new Date(b.date)||a.set-b.set)})).filter(item=>item.points.length).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
function chart(points){
 const bySession=new Map();for(const p of points){const old=bySession.get(p.sessionId);if(!old||p.load>old.load)bySession.set(p.sessionId,p)}
 const series=[...bySession.values()].sort((a,b)=>new Date(a.date)-new Date(b.date));
 if(!series.length)return '<div class="evolution-chart-empty">Ainda não há cargas registradas para este exercício.</div>';
 const width=620,height=240,left=48,right=16,top=18,bottom=42,plotW=width-left-right,plotH=height-top-bottom;
 const vals=series.map(x=>x.load),min=Math.min(0,...vals),max=Math.max(1,...vals),range=max-min||1;
 const x=i=>left+(series.length===1?plotW/2:i/(series.length-1)*plotW),y=v=>top+plotH-(v-min)/range*plotH;
 const pts=series.map((p,i)=>({x:x(i),y:y(p.load),p}));
 const grid=[0,1,2,3].map(i=>{const v=min+range*i/3,yy=y(v);return '<line class="grid" x1="'+left+'" y1="'+yy+'" x2="'+(width-right)+'" y2="'+yy+'"/><text x="'+(left-8)+'" y="'+(yy+4)+'" text-anchor="end">'+Number(v).toLocaleString('pt-BR',{maximumFractionDigits:1})+'</text>'}).join('');
 const labels=pts.length===1?'<text x="'+pts[0].x+'" y="'+(height-12)+'" text-anchor="middle">'+dateLabel(pts[0].p.date)+'</text>':[pts[0],pts[Math.floor((pts.length-1)/2)],pts[pts.length-1]].filter((p,i,a)=>a.findIndex(x=>x.x===p.x)===i).map(p=>'<text x="'+p.x+'" y="'+(height-12)+'" text-anchor="middle">'+dateLabel(p.p.date)+'</text>').join('');
 return '<svg class="evolution-chart" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Evolução da maior carga registrada em cada sessão">'+grid+'<polyline class="line" points="'+pts.map(p=>p.x+','+p.y).join(' ')+'"/>'+pts.map(p=>'<circle class="dot" cx="'+p.x+'" cy="'+p.y+'" r="5"><title>'+kg(p.p.load)+' · '+p.p.reps+' repetições · '+dateLabel(p.p.date)+'</title></circle>').join('')+labels+'</svg><p class="evolution-intro">Cada ponto representa a maior carga de uma sessão. A linha conecta as sessões em ordem cronológica.</p>';
}
async function render(host){
 const uid=user()?.id||null;if(cachedUserId!==uid){cachedUserId=uid}cache=null;
 host.innerHTML='<div class="evolution-panel">Carregando histórico de cargas…</div>';
 try{
  if(!cache)cache=await load();
  if(!cache.length){host.innerHTML='<div class="evolution-empty"><strong>Nenhuma evolução disponível ainda</strong><p>Conclua um treino e registre as repetições e a carga das séries. Depois, o histórico aparecerá aqui.</p></div>';return}
  const options=cache.map((x,i)=>'<option value="'+i+'">'+esc(normalizeHumanText(x.name))+'</option>').join('');
  host.innerHTML='<div class="evolution-wrap"><p class="evolution-intro">Acompanhe como suas cargas evoluem em cada exercício. O histórico reúne registros de versões diferentes do mesmo programa pelo nome do exercício.</p><div class="evolution-panel"><label for="evolutionExerciseSelect">Exercício</label><select id="evolutionExerciseSelect">'+options+'</select></div><div id="evolutionDetails"></div></div>';
  const select=host.querySelector('#evolutionExerciseSelect'),details=host.querySelector('#evolutionDetails');
  const paint=()=>{
   const item=cache[Number(select.value)];if(!item)return;
   const points=item.points;
   const sessionMap=new Map();
   for(const point of points){const current=sessionMap.get(point.sessionId);if(!current||point.load>current.load)sessionMap.set(point.sessionId,{...point})}
   const sessionPoints=[...sessionMap.values()].sort((a,b)=>String(a.date).localeCompare(String(b.date))||a.sessionId.localeCompare(b.sessionId));
   const latest=sessionPoints[sessionPoints.length-1],previous=sessionPoints.length>1?sessionPoints[sessionPoints.length-2]:null;
   const delta=previous?latest.load-previous.load:null;
   const deltaPercent=previous&&previous.load>0?(delta/previous.load)*100:null;
   const first=sessionPoints[0],overallDelta=first?latest.load-first.load:0;
   const sessions=sessionPoints.length;
   const records=[...points].sort((a,b)=>new Date(b.date)-new Date(a.date)||b.set-a.set).slice(0,30);
   const heaviest=points.filter(p=>Number.isFinite(p.load)&&p.load>0).reduce((best,p)=>!best||p.load>best.load?p:best,null);
   const estimated=points.filter(p=>Number.isFinite(p.load)&&p.load>0&&Number.isFinite(p.reps)&&p.reps>=1&&p.reps<=12).map(p=>({...p,estimated1RM:p.load*(1+p.reps/30)})).reduce((best,p)=>!best||p.estimated1RM>best.estimated1RM?p:best,null);
   const personalRecords='<div class="personal-records"><div class="personal-record"><span>Recorde de maior carga</span><strong>'+(heaviest?kg(heaviest.load):'—')+'</strong><small>'+(heaviest?dateLabel(heaviest.date)+' · '+heaviest.reps+' repetições':'Sem carga registrada')+'</small></div><div class="personal-record"><span>Melhor desempenho estimado</span><strong>'+(estimated?kg(estimated.estimated1RM):'—')+'</strong><small>'+(estimated?dateLabel(estimated.date)+' · '+estimated.load+' kg × '+estimated.reps+' reps · 1RM estimado':'Requer série entre 1 e 12 repetições')+'</small></div></div>';
   details.innerHTML=personalRecords+'<div class="evolution-stats"><div class="evolution-stat"><span>Maior carga na última sessão</span><strong>'+kg(latest.load)+'</strong></div><div class="evolution-stat"><span>Variação vs. sessão anterior</span><strong>'+(delta===null?'—':(delta>0?'+':'')+kg(delta))+'</strong></div><div class="evolution-stat"><span>Sessões</span><strong>'+sessions+'</strong></div></div><div class="evolution-panel"><h3>Gráfico de evolução</h3>'+chart(points)+'</div><div class="evolution-panel"><h3>Histórico de séries</h3>'+records.map(p=>'<div class="evolution-record"><div><strong>'+dateLabel(p.date)+'</strong><small>Série '+p.set+' · '+p.reps+' repetições</small></div><b>'+kg(p.load)+'</b></div>').join('')+'</div>';
   if(delta!==null){const note=document.createElement('p');note.className='evolution-intro';note.textContent=delta===null?'Ainda não há sessões anteriores para comparação.':'Comparação entre as maiores cargas de duas sessões consecutivas: '+(delta>0?'+':'')+kg(delta)+(deltaPercent!==null?' ('+(deltaPercent>0?'+':'')+deltaPercent.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%)':'')+'. Variação desde a primeira sessão: '+(overallDelta>0?'+':'')+kg(overallDelta)+'.';details.querySelector('.evolution-stats').after(note)}
  };
  select.addEventListener('change',paint);paint();
 }catch(error){host.innerHTML='<div class="evolution-empty"><strong>Não foi possível carregar a evolução</strong><p>'+esc(error?.message||'Verifique sua conexão e tente novamente.')+'</p><button type="button" class="btn alt" id="retryExerciseEvolution">Tentar novamente</button></div>';host.querySelector('#retryExerciseEvolution')?.addEventListener('click',()=>{cache=null;render(host)})}
}
window.renderNexfitExerciseEvolution=render;
})();
