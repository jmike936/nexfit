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
#strengthPage .evolution-pr-badge{display:inline-block;margin-top:5px;padding:3px 7px;border:1px solid #526b32;border-radius:999px;background:#202b20;color:#d5ff7b;font-size:10px;font-weight:800;letter-spacing:.3px}
#strengthPage .evolution-volume-scroll{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
#strengthPage .evolution-volume-table{width:100%;min-width:420px;border-collapse:collapse;font-size:12px}
#strengthPage .evolution-volume-table th,#strengthPage .evolution-volume-table td{padding:10px 8px;border-bottom:1px solid #354454;text-align:right;white-space:nowrap}
#strengthPage .evolution-volume-table th:first-child,#strengthPage .evolution-volume-table td:first-child{text-align:left}
#strengthPage .evolution-volume-table thead th{color:#b7f34a;font-size:11px}
#strengthPage .evolution-volume-table td:first-child strong{display:block}
#strengthPage .evolution-volume-table td:first-child small{display:block;color:#a0a99c;font-size:10px;margin-top:3px}
#strengthPage .evolution-period-filter{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:12px 0}
#strengthPage .evolution-period-filter label{font-size:12px;color:#c4d0d8}
#strengthPage .evolution-period-filter select{min-width:150px;max-width:100%;padding:9px 12px;border-radius:10px;background:#18232e;color:inherit;border:1px solid #526273}
#strengthPage .evolution-period-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}
#strengthPage .evolution-period-summary>div{padding:12px;border:1px solid #354454;border-radius:12px;background:#17232d}
#strengthPage .evolution-period-summary span{display:block;font-size:11px;color:#b7c3cb}
#strengthPage .evolution-period-summary strong{display:block;margin-top:5px;font-size:17px}
#strengthPage .evolution-period-summary small{display:block;margin-top:4px;color:#aebbc3;font-size:10px}
#strengthPage .evolution-plateau{padding:13px 14px;border:1px solid #526273;border-radius:12px;background:#17232d;margin:12px 0}
#strengthPage .evolution-plateau strong{display:block;margin-bottom:5px;color:#e7edf2}
#strengthPage .evolution-plateau p{margin:0;color:#b7c3cb;font-size:12px;line-height:1.5}
@media(max-width:420px){#strengthPage .personal-record{padding:10px}#strengthPage .personal-record strong{font-size:17px}}
@media(max-width:520px){
 #strengthPage .evolution-panel{padding:12px}
 #strengthPage .evolution-panel select{min-height:46px;font-size:15px}
 #strengthPage .evolution-intro{font-size:12px;line-height:1.5}
 #strengthPage .evolution-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
 #strengthPage .evolution-stat{padding:11px 8px}
 #strengthPage .evolution-stat span{font-size:11px;line-height:1.35}
 #strengthPage .evolution-stat strong{font-size:17px}
 #strengthPage .evolution-stat:last-child:nth-child(odd){grid-column:1/-1}
 #strengthPage .evolution-chart{min-width:320px}
 #strengthPage .evolution-chart-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}
 #strengthPage .evolution-chart-points{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}
 #strengthPage .evolution-chart-point{min-width:0;padding:9px;background:#111922;border:1px solid #354454;border-radius:10px}
 #strengthPage .evolution-chart-point span{display:block;color:#a0a99c;font-size:10px}
 #strengthPage .evolution-chart-point strong{display:block;margin-top:3px;font-size:13px;overflow-wrap:anywhere}
 #strengthPage .personal-records{gap:7px}
 #strengthPage .personal-record{padding:10px}
 #strengthPage .personal-record span{font-size:10px;line-height:1.35}
 #strengthPage .personal-record strong{font-size:17px}
 #strengthPage .personal-record small{font-size:10px;line-height:1.4}
 #strengthPage .evolution-record{gap:7px;padding:11px 0}
 #strengthPage .evolution-record strong{font-size:13px}
 #strengthPage .evolution-record small{font-size:11px}
 #strengthPage .evolution-record b{font-size:13px}
}
`;
const style=document.createElement('style');style.textContent=css;document.head.append(style);
let cache=null,cachedUserId=null,renderGeneration=0;
function kg(n){return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2})+' kg'}
function formatDuration(value){const total=Math.max(0,Math.round(Number(value)||0)),hours=Math.floor(total/3600),minutes=Math.floor(total%3600/60),seconds=total%60;return hours?hours+':'+String(minutes).padStart(2,'0')+':'+String(seconds).padStart(2,'0'):minutes+':'+String(seconds).padStart(2,'0')}
function formatMetric(value,type){return type==='time'?formatDuration(value):kg(value)}
function sessionSeries(points,metricType){
 const bySession=new Map();
 for(const point of points){
  const old=bySession.get(point.sessionId);
  if(metricType==='volume'){
   if(!old)bySession.set(point.sessionId,{...point});
   else{old.value+=point.value;if(new Date(point.timestamp||point.date)>new Date(old.timestamp||old.date)){old.date=point.date;old.timestamp=point.timestamp;old.set=point.set}}
  }else if(!old||point.value>old.value)bySession.set(point.sessionId,{...point});
 }
 return [...bySession.values()].sort((a,b)=>new Date(a.timestamp||a.date)-new Date(b.timestamp||b.date));
}
function detectPersonalRecords(points,metricType){
 const source=metricType==='volume'?sessionSeries(points,'volume'):points;
 const ordered=[...source].sort((a,b)=>new Date(a.timestamp||a.date)-new Date(b.timestamp||b.date)||Number(a.set)-Number(b.set));
 const best={load:0,reps:0,estimated1RM:0,duration:0,volume:0},flags=new Map();
 for(const point of ordered){
  const labels=[];
  if(metricType==='time'){
   if(Number.isFinite(point.value)&&point.value>best.duration){best.duration=point.value;labels.push('Duração')}
  }else if(metricType==='volume'){
   if(Number.isFinite(point.value)&&point.value>best.volume){best.volume=point.value;labels.push('Volume')}
  }else if(metricType==='estimated1RM'||metricType==='estimated1RMBrzycki'){
   if(Number.isFinite(point.value)&&point.value>best.estimated1RM){best.estimated1RM=point.value;labels.push('1RM estimado')}
  }else{
   if(Number.isFinite(point.value)&&point.value>best.load){best.load=point.value;labels.push('Carga')}
   if(Number.isFinite(point.reps)&&point.reps>best.reps){best.reps=point.reps;labels.push('Repetições')}
   if(Number.isFinite(point.value)&&point.value>0&&Number.isFinite(point.reps)&&point.reps>=1&&point.reps<=12){
    const estimate=window.NexfitExerciseEvolutionCore.estimateOneRepMax(point.value,point.reps,metricType==='estimated1RMBrzycki'?'brzycki':'epley');
    if(estimate&&estimate>best.estimated1RM){best.estimated1RM=estimate;labels.push(metricType==='estimated1RMBrzycki'?'1RM estimado · Brzycki':'1RM estimado · Epley')}
   }
  }
  if(labels.length)flags.set(String(point.sessionId)+'|'+String(point.set),labels);
 }
 return {best,flags};
}

function dateLabel(value){if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)){const [y,m,d]=value.split('-');return d+'/'+m+'/'+y}const d=new Date(value);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric'}).format(d)}
async function load(expectedUserId,expectedClient,isCurrent){
 const client=expectedClient;if(!client||!expectedUserId||!isCurrent())throw Error('Faça login para consultar sua evolução.');
 const evolutionCore=window.NexfitExerciseEvolutionCore;if(!evolutionCore)throw Error('Não foi possível preparar a análise de volume muscular.');
 // A Evolução só inclui sessões que ainda possuem atividade correspondente no histórico do atleta.
 // A atividade guarda o vínculo explícito [NEXFIT_SESSION:<uuid>], evitando exibir séries de atividades excluídas.
 const activitiesQ=await client.from('activities').select('notes,activity_date').eq('user_id',expectedUserId).eq('sport','Musculação').order('activity_date',{ascending:false}).limit(500);
 if(!isCurrent())return null;if(activitiesQ.error)throw activitiesQ.error;
 const activityDateBySession=new Map((activitiesQ.data||[]).map(a=>({id:(a.notes||'').match(/\[NEXFIT_SESSION:([a-f0-9-]+)\]/i)?.[1],date:a.activity_date})).filter(a=>a.id&&a.date).map(a=>[a.id,a.date]));
 const sessionIds=[...activityDateBySession.keys()];if(!sessionIds.length)return [];
 const sessionsQ=await client.from('training_sessions').select('id,started_at,finished_at').eq('athlete_id',expectedUserId).eq('status','completed').not('finished_at','is',null).in('id',sessionIds).order('started_at',{ascending:false}).limit(500);
 if(!isCurrent())return null;if(sessionsQ.error)throw sessionsQ.error;
 const sessions=sessionsQ.data||[];if(!sessions.length)return [];
 const sessionMap=new Map(sessions.map(s=>[s.id,s])),ids=sessions.map(s=>s.id);
 const logsQ=await client.from('training_set_logs').select('session_id,exercise_id,set_number,reps_completed,load_kg,duration_seconds,completed_at').in('session_id',ids).order('completed_at',{ascending:true}).limit(10000);
 if(!isCurrent())return null;if(logsQ.error)throw logsQ.error;
 const logs=(logsQ.data||[]).filter(x=>Number(x.duration_seconds)>0||Number(x.reps_completed)>0);
 if(!logs.length)return [];
 const exerciseIds=[...new Set(logs.map(x=>x.exercise_id).filter(Boolean))];
 const exercisesQ=await client.from('training_exercises').select('id,name,identity_id,catalog_exercise_id,subworkout_id').in('id',exerciseIds);
 if(!isCurrent())return null;if(exercisesQ.error)throw exercisesQ.error;
 const exerciseRows=exercisesQ.data||[],subworkoutIds=[...new Set(exerciseRows.map(x=>x.subworkout_id).filter(Boolean))];
 const subworkoutsQ=subworkoutIds.length?await client.from('training_subworkouts').select('id,version_id').in('id',subworkoutIds):{data:[],error:null};
 if(!isCurrent())return null;if(subworkoutsQ.error)throw subworkoutsQ.error;
 const versionIds=[...new Set((subworkoutsQ.data||[]).map(x=>x.version_id).filter(Boolean))];
 const versionsQ=versionIds.length?await client.from('training_program_versions').select('id,program_id').in('id',versionIds):{data:[],error:null};
 if(!isCurrent())return null;if(versionsQ.error)throw versionsQ.error;
 const subworkoutMap=new Map((subworkoutsQ.data||[]).map(x=>[x.id,x.version_id]));
 const versionMap=new Map((versionsQ.data||[]).map(x=>[x.id,x.program_id]));
 const exerciseMap=new Map(exerciseRows.map(x=>[String(x.id),{name:x.name,identityId:x.identity_id||null,catalogId:x.catalog_exercise_id||null,versionId:subworkoutMap.get(x.subworkout_id)||null,programId:versionMap.get(subworkoutMap.get(x.subworkout_id))||null}]));
 const catalogIds=[...new Set(exerciseRows.map(x=>x.catalog_exercise_id).filter(Boolean).map(String))];
 let catalogById=new Map();
 if(catalogIds.length){
  const catalogQ=await client.from('training_exercise_catalog').select('id,primary_muscles').in('id',catalogIds);
  if(!isCurrent())return null;
  if(!catalogQ.error)catalogById=new Map((catalogQ.data||[]).map(item=>[String(item.id),item]));
 }
 const weeklyVolume=evolutionCore.aggregateWeeklyVolume({logs,exerciseById:exerciseMap,catalogById,sessionDateById:activityDateBySession});
 const grouped=new Map();
 for(const log of logs){
  const exercise=exerciseMap.get(log.exercise_id);if(!exercise?.name)continue;
  const name=exercise.name,normalized=normalize(name);if(!normalized)continue;
  const session=sessionMap.get(log.session_id);if(!session)continue;
  const date=activityDateBySession.get(session.id)||log.completed_at||session.finished_at||session.started_at;
  const timestamp=log.completed_at||session.finished_at||session.started_at;
  // A identidade lógica é a fonte principal: o mesmo exercício do catálogo pode
  // aparecer em treinos diferentes e não deve fundir históricos de ocorrências distintas.
  // O catálogo só serve como fallback para registros antigos sem identity_id.
  const identityKey=exercise.identityId?'identity:'+exercise.identityId:exercise.catalogId?'catalog:'+exercise.programId+'|'+exercise.catalogId:'legacy-exercise:'+log.exercise_id;
  const addPoint=(metricType,value)=>{
   if(!Number.isFinite(value)||value<=0)return;
   const key=identityKey+'|'+metricType,label=metricType==='time'?'Tempo':metricType==='volume'?'Volume':metricType==='estimated1RM'?'1RM estimado · Epley':metricType==='estimated1RMBrzycki'?'1RM estimado · Brzycki':'Carga';
   if(!grouped.has(key))grouped.set(key,{name:normalizeHumanText(name)+' · '+label,metricType,points:[],latestDate:date});
   const group=grouped.get(key);
   if(date&&(!group.latestDate||new Date(date)>=new Date(group.latestDate))){group.name=normalizeHumanText(name)+' · '+label;group.latestDate=date}
   group.points.push({date,timestamp,value,reps:Number(log.reps_completed||0),set:Number(log.set_number),sessionId:log.session_id});
  };
  const duration=Number(log.duration_seconds),load=Number(log.load_kg),reps=Number(log.reps_completed);
  if(duration>0)addPoint('time',duration);
  else if(load>0&&reps>0){
   addPoint('load',load);
   const epley=evolutionCore.estimateOneRepMax(load,reps,'epley'),brzycki=evolutionCore.estimateOneRepMax(load,reps,'brzycki');
   if(epley)addPoint('estimated1RM',epley);
   if(brzycki)addPoint('estimated1RMBrzycki',brzycki);
  }
 }
 const result=[...grouped.values()].map(item=>({...item,points:item.points.sort((a,b)=>new Date(a.date)-new Date(b.date)||a.set-b.set)})).filter(item=>item.points.length).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
 result.weeklyVolume=weeklyVolume;
 return result;
}
function renderWeeklyVolumePanel(data){
 if(!data?.groups?.length||!data?.weeks?.length)return '<div class="evolution-panel"><h3>Séries semanais por grupo muscular</h3><p class="evolution-intro">Ainda não há séries registradas com grupo muscular identificado para este resumo.</p></div>';
 const weeks=data.weeks.slice(-4),formatSets=value=>Number(value||0).toLocaleString('pt-BR',{maximumFractionDigits:1});
 const weekLabel=key=>{const [year,month,day]=key.split('-');return day+'/'+month};
 const rows=data.groups.map(group=>'<tr><td><strong>'+esc(group.muscle)+'</strong><small>'+formatSets(group.totalSets)+' séries distribuídas</small></td>'+weeks.map(week=>'<td>'+formatSets(group.weeks[week]?.sets||0)+'</td>').join('')+'</tr>').join('');
 return '<div class="evolution-panel"><h3>Séries semanais por grupo muscular</h3><p class="evolution-intro">Contagem das séries registradas, sem multiplicar carga por repetições. Quando um exercício tem mais de um músculo principal, suas séries são distribuídas igualmente entre esses grupos. Séries por tempo também são contabilizadas quando vinculadas a um exercício do catálogo.</p><div class="evolution-volume-scroll" role="region" aria-label="Tabela de séries semanais por grupo muscular, rolável horizontalmente"><table class="evolution-volume-table"><thead><tr><th>Grupo muscular</th>'+weeks.map(week=>'<th>Semana '+weekLabel(week)+'</th>').join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}
function chart(points,metricType){
 const series=sessionSeries(points,metricType);if(!series.length)return '<div class="evolution-chart-empty">Ainda não há registros para este exercício.</div>';
 const width=360,height=224,left=52,right=12,top=16,bottom=40,plotW=width-left-right,plotH=height-top-bottom,vals=series.map(x=>x.value),min=0,max=Math.max(1,...vals),range=max-min||1;
 const x=i=>left+(series.length===1?plotW/2:i/(series.length-1)*plotW),y=v=>top+plotH-(v-min)/range*plotH,pts=series.map((p,i)=>({x:x(i),y:y(p.value),p}));
 const grid=[0,1,2,3].map(i=>{const v=min+range*i/3,yy=y(v);return '<line class="grid" x1="'+left+'" y1="'+yy+'" x2="'+(width-right)+'" y2="'+yy+'"/><text x="'+(left-7)+'" y="'+(yy+4)+'" text-anchor="end">'+(metricType==='time'?formatDuration(v):Number(v).toLocaleString('pt-BR',{maximumFractionDigits:1}))+'</text>'}).join('');
 const labelPoints=pts.length===1?[{...pts[0],anchor:'middle'}]:[{...pts[0],anchor:'start'},{...pts[Math.floor((pts.length-1)/2)],anchor:'middle'},{...pts[pts.length-1],anchor:'end'}].filter((p,i,a)=>a.findIndex(x=>x.x===p.x)===i);
 const labels=labelPoints.map(p=>'<text x="'+p.x+'" y="'+(height-12)+'" text-anchor="'+p.anchor+'">'+dateLabel(p.p.date)+'</text>').join('');
 const subject=metricType==='time'?'maior duração':metricType==='volume'?'volume total por sessão':metricType==='estimated1RM'?'1RM estimado':'maior carga';
 const recent=series.slice(-4).reverse();
 const accessiblePoints='<div class="evolution-chart-points" aria-label="Registros mais recentes do gráfico">'+recent.map(p=>'<div class="evolution-chart-point"><span>'+dateLabel(p.date)+'</span><strong>'+formatMetric(p.value,metricType)+'</strong></div>').join('')+'</div>';
 return '<div class="evolution-chart-scroll" role="region" aria-label="Gráfico rolável horizontalmente"><svg class="evolution-chart" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Evolução da '+subject+' registrada em cada sessão">'+grid+'<polyline class="line" points="'+pts.map(p=>p.x+','+p.y).join(' ')+'"/>'+pts.map(p=>'<circle class="dot" cx="'+p.x+'" cy="'+p.y+'" r="5"><title>'+formatMetric(p.p.value,metricType)+(metricType==='time'?'':metricType==='volume'?' · volume da sessão':' · '+p.p.reps+' repetições')+' · '+dateLabel(p.p.date)+'</title></circle>').join('')+labels+'</svg></div>'+accessiblePoints+'<p class="evolution-intro">Cada ponto representa a '+subject+' de uma sessão. Os registros mais recentes também aparecem abaixo do gráfico.</p>';
}
async function render(host){
 const uid=user()?.id||null,client=getClient(),generation=++renderGeneration;
 const isCurrent=()=>!!uid&&!!client&&user()?.id===uid&&renderGeneration===generation&&host?.isConnected!==false;
 if(!isCurrent())return;
 cachedUserId=uid;cache=null;
 host.innerHTML='<div class="evolution-panel">Carregando histórico de cargas e durações…</div>';
 try{
  const loaded=await load(uid,client,isCurrent);
  if(!isCurrent())return;
  cache=loaded;
  if(!cache?.length){host.innerHTML='<div class="evolution-empty"><strong>Nenhuma evolução disponível ainda</strong><p>Conclua um treino e registre a carga ou a duração das séries. Depois, o histórico aparecerá aqui.</p></div>';return}
  const options=cache.map((x,i)=>'<option value="'+i+'">'+esc(normalizeHumanText(x.name))+'</option>').join('');
  host.innerHTML='<div class="evolution-wrap"><p class="evolution-intro">Acompanhe a evolução das cargas e durações em cada exercício. O histórico reúne registros do mesmo exercício lógico entre versões do programa.</p>'+renderWeeklyVolumePanel(cache.weeklyVolume)+'<div class="evolution-panel"><label for="evolutionExerciseSelect">Exercício</label><select id="evolutionExerciseSelect">'+options+'</select></div><div id="evolutionDetails"></div></div>';
  const select=host.querySelector('#evolutionExerciseSelect'),details=host.querySelector('#evolutionDetails');
  const periodSelect=document.createElement('select');periodSelect.id='evolutionPeriodSelect';periodSelect.innerHTML='<option value="30">Últimos 30 dias</option><option value="90" selected>Últimos 90 dias</option><option value="180">Últimos 6 meses</option><option value="365">Últimos 12 meses</option><option value="all">Todo o histórico</option>';
  const periodLabel=document.createElement('label');periodLabel.htmlFor='evolutionPeriodSelect';periodLabel.textContent='Período de análise';
  const periodWrap=document.createElement('div');periodWrap.className='evolution-period-filter';periodWrap.append(periodLabel,periodSelect);
  details.before(periodWrap);
  const paint=()=>{
   if(!isCurrent())return;
   const item=cache[Number(select.value)];if(!item)return;
   if(periodSelect.value!=='all'&&!window.NexfitEvolutionPeriods.splitPeriods(item.points,Number(periodSelect.value)).current.length){
    details.innerHTML='<div class="evolution-empty"><strong>Sem registros neste período</strong><p>Amplie o intervalo para consultar o histórico anterior.</p></div>';return;
   }
   const allPoints=item.points,metricType=item.metricType,period=periodSelect.value,periodApi=window.NexfitEvolutionPeriods;
   const split=period==='all'?{current:allPoints,previous:[]}:periodApi.splitPeriods(allPoints,Number(period));
   const points=split.current.length?split.current:[],previousPoints=split.previous;
   const isTimed=metricType==='time',metricName=isTimed?'duração':metricType==='volume'?'volume':metricType==='estimated1RM'?'1RM estimado · Epley':metricType==='estimated1RMBrzycki'?'1RM estimado · Brzycki':'carga',metricPlural=isTimed?'durações':metricType==='volume'?'volumes':metricType==='estimated1RM'||metricType==='estimated1RMBrzycki'?'estimativas de 1RM':'cargas';
   const personalRecordData=detectPersonalRecords(points,metricType);
   const sessionPoints=sessionSeries(points,metricType);
   const latest=sessionPoints[sessionPoints.length-1],previous=sessionPoints.length>1?sessionPoints[sessionPoints.length-2]:null;
   const delta=previous?latest.value-previous.value:null,deltaPercent=previous&&previous.value>0?(delta/previous.value)*100:null;
   const first=sessionPoints[0],overallDelta=first?latest.value-first.value:0,sessions=sessionPoints.length;
   const currentSummary=periodApi.summarize(points,metricType),previousSummary=periodApi.summarize(previousPoints,metricType);
   const periodDelta=previousSummary.sessions?currentSummary.average-previousSummary.average:null,periodDeltaPct=previousSummary.average>0&&periodDelta!==null?periodDelta/previousSummary.average*100:null;
   const plateauApi=window.NexfitExercisePlateau;
   const plateau=plateauApi&&metricType!=='time'?plateauApi.analyze(points,metricType):{status:'insufficient'};
   const plateauNotice=plateau.status==='stable'?`<div class="evolution-plateau"><strong>Possível estabilidade nesta métrica</strong><p>Não foi observada melhora superior a 5% entre as médias das duas primeiras e das duas últimas sessões. Considere revisar progressão, recuperação, execução e adequação da carga com seu personal. Isso não confirma um platô.</p></div>`:plateau.status==='decline'?`<div class="evolution-plateau"><strong>Queda recente nesta métrica</strong><p>A média das duas sessões mais recentes está mais de 5% abaixo das duas primeiras. Verifique contexto, recuperação e execução antes de ajustar o treino; poucos dados não permitem concluir a causa.</p></div>`:'';
   const periodComparison='<div class="evolution-period-summary"><div><span>Média por sessão · período atual</span><strong>'+formatMetric(currentSummary.average,metricType)+'</strong><small>'+currentSummary.sessions+' sessões</small></div><div><span>Período anterior equivalente</span><strong>'+ (previousSummary.sessions?formatMetric(previousSummary.average,metricType):'—')+'</strong><small>'+previousSummary.sessions+' sessões</small></div></div><p class="evolution-intro">'+(periodDelta===null?'Ainda não há registros suficientes no período anterior para comparar.': 'Variação da média por sessão: '+(periodDelta>0?'+':'')+formatMetric(Math.abs(periodDelta),metricType)+(periodDelta<0?' a menos':'')+(periodDeltaPct!==null?' ('+(periodDeltaPct>0?'+':'')+periodDeltaPct.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%)':'')+'.')+'</p>';
   const records=[...points].sort((a,b)=>new Date(b.date)-new Date(a.date)||b.set-a.set).slice(0,30);
   let personalRecords;
   if(isTimed){
    const best=points.reduce((result,p)=>!result||p.value>result.value?p:result,null),average=points.reduce((sum,p)=>sum+p.value,0)/points.length;
    personalRecords='<div class="personal-records"><div class="personal-record"><span>Recorde pessoal · duração</span><strong>'+formatDuration(personalRecordData.best.duration)+'</strong><small>'+dateLabel(best.date)+' · Série '+best.set+'</small></div><div class="personal-record"><span>Duração média por série</span><strong>'+formatDuration(average)+'</strong><small>Com base em '+points.length+' séries registradas</small></div></div>';
   }else if(metricType==='volume'){
    const best=sessionPoints.reduce((result,p)=>!result||p.value>result.value?p:result,null),average=sessionPoints.reduce((sum,p)=>sum+p.value,0)/sessionPoints.length;
    personalRecords='<div class="personal-records"><div class="personal-record"><span>Recorde pessoal · volume por sessão</span><strong>'+kg(personalRecordData.best.volume)+'</strong><small>'+dateLabel(best.date)+'</small></div><div class="personal-record"><span>Volume médio por sessão</span><strong>'+kg(average)+'</strong><small>Com base em '+sessionPoints.length+' sessões</small></div></div>';
   }else if(metricType==='estimated1RM'||metricType==='estimated1RMBrzycki'){
    const best=points.reduce((result,p)=>!result||p.value>result.value?p:result,null);
    personalRecords='<div class="personal-records"><div class="personal-record"><span>Recorde pessoal · 1RM estimado</span><strong>'+kg(personalRecordData.best.estimated1RM)+'</strong><small>'+dateLabel(best.date)+' · Fórmula de '+(metricType==='estimated1RMBrzycki'?'Brzycki':'Epley')+'</small></div></div><p class="evolution-intro">Estimativa matemática, não um teste de carga máxima. Epley aceita até 12 repetições; Brzycki, até 10.</p>'; 
   }else{
    const heaviest=points.filter(p=>Number.isFinite(p.value)&&p.value>0).reduce((best,p)=>!best||p.value>best.value?p:best,null);
    const mostReps=points.filter(p=>Number.isFinite(p.reps)&&p.reps>0).reduce((best,p)=>!best||p.reps>best.reps?p:best,null);
    const estimated=points.filter(p=>Number.isFinite(p.value)&&p.value>0&&Number.isFinite(p.reps)&&p.reps>=1&&p.reps<=12).map(p=>({...p,estimated1RM:window.NexfitExerciseEvolutionCore.estimateOneRepMax(p.value,p.reps,'epley')})).reduce((best,p)=>!best||p.estimated1RM>best.estimated1RM?p:best,null);
    personalRecords='<div class="personal-records"><div class="personal-record"><span>Recorde pessoal · carga</span><strong>'+(heaviest?kg(personalRecordData.best.load):'—')+'</strong><small>'+(heaviest?dateLabel(heaviest.date)+' · '+heaviest.reps+' repetições':'Sem carga registrada')+'</small></div><div class="personal-record"><span>Recorde pessoal · repetições</span><strong>'+(mostReps?personalRecordData.best.reps+' reps':'—')+'</strong><small>'+(mostReps?dateLabel(mostReps.date)+' · '+kg(mostReps.value):'Sem repetições registradas')+'</small></div><div class="personal-record"><span>Recorde pessoal · 1RM estimado</span><strong>'+(estimated?kg(personalRecordData.best.estimated1RM):'—')+'</strong><small>'+(estimated?dateLabel(estimated.date)+' · '+estimated.value+' kg × '+estimated.reps+' reps · fórmula de Epley':'Requer série entre 1 e 12 repetições')+'</small></div></div>';
   }
   const metricLabel=isTimed?'Maior duração':metricType==='volume'?'Volume total da sessão':metricType==='estimated1RM'||metricType==='estimated1RMBrzycki'?'1RM estimado':'Maior carga';
   if(!isTimed)personalRecords+='<p class="evolution-intro">O 1RM é uma estimativa matemática (Epley ou Brzycki, conforme selecionado), não um teste de carga máxima. Use como referência e evite testar cargas máximas sem orientação.</p>';
   details.innerHTML=periodComparison+plateauNotice+personalRecords+'<div class="evolution-stats"><div class="evolution-stat"><span>'+metricLabel+' na última sessão</span><strong>'+formatMetric(latest.value,metricType)+'</strong></div><div class="evolution-stat"><span>Variação vs. sessão anterior</span><strong>'+(delta===null?'—':(delta>0?'+':'')+formatMetric(Math.abs(delta),metricType)+(delta<0?' a menos':''))+'</strong></div><div class="evolution-stat"><span>Sessões</span><strong>'+sessions+'</strong></div></div><div class="evolution-panel"><h3>Gráfico de evolução da '+metricName+'</h3>'+chart(points,metricType)+'</div><div class="evolution-panel"><h3>Histórico de séries</h3>'+records.map(p=>{const pr=personalRecordData.flags.get(String(p.sessionId)+'|'+String(p.set));return '<div class="evolution-record"><div><strong>'+dateLabel(p.date)+'</strong><small>Série '+p.set+(isTimed?' · tempo realizado':metricType==='volume'?' · volume da série':metricType==='estimated1RM'||metricType==='estimated1RMBrzycki'?' · 1RM estimado':' · '+p.reps+' repetições')+'</small>'+(pr?'<span class="evolution-pr-badge">PR · '+esc(pr.join(' · '))+'</span>':'')+'</div><b>'+formatMetric(p.value,metricType)+'</b></div>'}).join('')+'</div>';
   if(delta!==null){const note=document.createElement('p');note.className='evolution-intro';note.textContent='Variação entre as duas sessões mais recentes deste período: '+(delta>0?'+':'')+formatMetric(Math.abs(delta),metricType)+(delta<0?' a menos':'')+(deltaPercent!==null?' ('+(delta>0?'+':'')+deltaPercent.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%)':'')+'.';details.querySelector('.evolution-stats').after(note)}
  };
  select.addEventListener('change',()=>{if(isCurrent())paint()});periodSelect.addEventListener('change',()=>{if(isCurrent())paint()});paint();
 }catch(error){if(!isCurrent())return;host.innerHTML='<div class="evolution-empty"><strong>Não foi possível carregar a evolução</strong><p>'+esc(error?.message||'Verifique sua conexão e tente novamente.')+'</p><button type="button" class="btn alt" id="retryExerciseEvolution">Tentar novamente</button></div>';host.querySelector('#retryExerciseEvolution')?.addEventListener('click',()=>{if(isCurrent()){cache=null;render(host)}})}
}
window.resetNexfitExerciseEvolutionUserState=function(){renderGeneration++;cache=null;cachedUserId=null};
window.renderNexfitExerciseEvolution=render;
})();
