/* DIVINA BRUXA 2.0 — REBIRTH R025 · PERFORMANCE V324
   Core Web Vitals locais + classificação adaptativa de capacidade.
   Persistência só com consentimento de analytics. Nenhuma telemetria é enviada por esta camada. */

import { getPrivacyPreferences } from './privacy-center-v9.js?v=323';

export const CORE_WEB_VITALS_TARGETS_V324=Object.freeze({
  LCP:Object.freeze({good:2500,poor:4000,unit:'ms'}),
  INP:Object.freeze({good:200,poor:500,unit:'ms'}),
  CLS:Object.freeze({good:0.1,poor:0.25,unit:'score'})
});

const STORAGE_KEY='divina-performance-samples-v324';
const SAMPLE_LIMIT=75;
let installed=false;
let tier='balanced';
let longTaskCount=0;
let longTaskTotal=0;

const analyticsAllowed=()=>{
  try{return getPrivacyPreferences().analytics===true;}
  catch{return false;}
};

const safeRead=()=>{
  try{
    const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    return value&&typeof value==='object'?value:{};
  }catch{return {};}
};
const safeWrite=value=>{
  if(!analyticsAllowed())return false;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value));return true;}
  catch{return false;}
};
const clearOptionalSamples=()=>{try{localStorage.removeItem(STORAGE_KEY);}catch{}};
const rounded=(name,value)=>name==='CLS'?Math.round(value*1000)/1000:Math.round(value);
const ratingFor=(name,value)=>{
  const target=CORE_WEB_VITALS_TARGETS_V324[name];
  if(!target||!Number.isFinite(value))return 'unavailable';
  if(value<=target.good)return 'good';
  if(value<=target.poor)return 'needs-improvement';
  return 'poor';
};
const percentile=(values,ratio=.75)=>{
  const sorted=values.filter(Number.isFinite).sort((a,b)=>a-b);
  if(!sorted.length)return null;
  return sorted[Math.max(0,Math.ceil(sorted.length*ratio)-1)];
};
const navigationType=()=>{
  try{return performance.getEntriesByType('navigation')[0]?.type||'navigate';}
  catch{return 'navigate';}
};
const deviceClass=()=>matchMedia('(max-width: 767px)').matches?'mobile':'desktop';

export function performanceTierV324(){
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const saveData=connection?.saveData===true;
  const effective=String(connection?.effectiveType||'');
  const memory=Number(navigator.deviceMemory||0);
  const cores=Number(navigator.hardwareConcurrency||0);
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
  const constrained=saveData
    || /(^|-)2g$|slow-2g/i.test(effective)
    || (memory>0&&memory<=3)
    || (cores>0&&cores<=2);
  return Object.freeze({
    tier:constrained?'constrained':'balanced',
    saveData,
    effectiveType:effective||'unknown',
    deviceMemoryGb:memory||null,
    hardwareConcurrency:cores||null,
    reducedMotion:reduced
  });
}

const applyTier=()=>{
  const state=performanceTierV324();
  tier=state.tier;
  document.documentElement.dataset.performanceTier=tier;
  document.documentElement.dataset.saveData=String(state.saveData);
  dispatchEvent(new CustomEvent('divina:performance-tier',{detail:state}));
  return state;
};

export function summarizeLocalWebVitalsV324(){
  const samples=safeRead();
  return Object.fromEntries(Object.keys(CORE_WEB_VITALS_TARGETS_V324).map(name=>{
    const values=Array.isArray(samples[name])?samples[name].map(item=>Number(item.value)):[];
    const p75=percentile(values);
    return [name,Object.freeze({
      samples:values.length,
      p75:p75==null?null:rounded(name,p75),
      rating:p75==null?'pending':ratingFor(name,p75),
      target:CORE_WEB_VITALS_TARGETS_V324[name].good
    })];
  }));
}

const remember=detail=>{
  if(!analyticsAllowed())return false;
  const samples=safeRead();
  const list=Array.isArray(samples[detail.name])?samples[detail.name]:[];
  list.push({
    value:detail.value,rating:detail.rating,at:new Date().toISOString(),
    device:deviceClass(),navigation:detail.navigation,tier
  });
  samples[detail.name]=list.slice(-SAMPLE_LIMIT);
  return safeWrite(samples);
};

const publish=(name,value,{final=false}={})=>{
  if(!Number.isFinite(value))return;
  const detail=Object.freeze({
    name,value:rounded(name,value),rating:ratingFor(name,value),
    target:CORE_WEB_VITALS_TARGETS_V324[name]?.good??null,
    final,navigation:navigationType(),transport:'local-only',
    consentedPersistence:final&&analyticsAllowed(),tier
  });
  globalThis.__divinaWebVitalsV324||={};
  globalThis.__divinaWebVitalsV324[name]=detail;
  dispatchEvent(new CustomEvent('divina:web-vital',{detail}));
  if(final)remember(detail);
};

const onHidden=callback=>{
  const finish=()=>{if(document.visibilityState==='hidden')callback();};
  document.addEventListener('visibilitychange',finish,{capture:true});
  addEventListener('pagehide',callback,{capture:true});
};

const observeLcp=()=>{
  if(!PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint'))return;
  let value=0,finished=false;
  const consume=entries=>{
    const entry=entries.at(-1);
    if(!entry)return;
    value=entry.startTime;publish('LCP',value);
  };
  const observer=new PerformanceObserver(list=>consume(list.getEntries()));
  observer.observe({type:'largest-contentful-paint',buffered:true});
  const finish=()=>{
    if(finished)return;finished=true;
    consume(observer.takeRecords());observer.disconnect();
    if(value)publish('LCP',value,{final:true});
  };
  addEventListener('pointerdown',finish,{once:true,capture:true});
  addEventListener('keydown',finish,{once:true,capture:true});
  onHidden(finish);
};

const observeCls=()=>{
  if(!PerformanceObserver.supportedEntryTypes?.includes('layout-shift'))return;
  let maxWindow=0,windowValue=0,windowStart=0,previous=0,finished=false;
  const consume=entries=>{
    for(const entry of entries){
      if(entry.hadRecentInput)continue;
      const within=previous&&entry.startTime-previous<1000&&entry.startTime-windowStart<5000;
      if(within)windowValue+=entry.value;
      else{windowValue=entry.value;windowStart=entry.startTime;}
      previous=entry.startTime;
      maxWindow=Math.max(maxWindow,windowValue);
      publish('CLS',maxWindow);
    }
  };
  const observer=new PerformanceObserver(list=>consume(list.getEntries()));
  observer.observe({type:'layout-shift',buffered:true});
  onHidden(()=>{
    if(finished)return;finished=true;
    consume(observer.takeRecords());observer.disconnect();
    publish('CLS',maxWindow,{final:true});
  });
};

const observeInp=()=>{
  if(!PerformanceObserver.supportedEntryTypes?.includes('event'))return;
  const interactions=new Map();
  let current=0,finished=false;
  const update=()=>{
    const durations=[...interactions.values()].sort((a,b)=>a-b);
    if(!durations.length)return;
    current=durations[Math.max(0,Math.ceil(durations.length*.98)-1)];
    publish('INP',current);
  };
  const observer=new PerformanceObserver(list=>{
    for(const entry of list.getEntries()){
      if(!entry.interactionId||entry.duration<=0)continue;
      interactions.set(entry.interactionId,Math.max(interactions.get(entry.interactionId)||0,entry.duration));
    }
    update();
  });
  try{observer.observe({type:'event',buffered:true,durationThreshold:16});}
  catch{observer.observe({type:'event',buffered:true});}
  onHidden(()=>{
    if(finished)return;finished=true;
    for(const entry of observer.takeRecords()){
      if(entry.interactionId&&entry.duration>0)interactions.set(entry.interactionId,Math.max(interactions.get(entry.interactionId)||0,entry.duration));
    }
    observer.disconnect();update();
    if(current)publish('INP',current,{final:true});
  });
};

const observeLongTasks=()=>{
  if(!PerformanceObserver.supportedEntryTypes?.includes('longtask'))return;
  try{
    const observer=new PerformanceObserver(list=>{
      for(const entry of list.getEntries()){
        longTaskCount+=1;
        longTaskTotal+=Math.round(entry.duration||0);
      }
      globalThis.__divinaLongTasksV324=Object.freeze({count:longTaskCount,totalMs:longTaskTotal});
    });
    observer.observe({type:'longtask',buffered:true});
    onHidden(()=>observer.disconnect());
  }catch{}
};

export function installPerformanceV324(){
  if(installed||typeof window==='undefined'||typeof document==='undefined')return false;
  installed=true;
  const state=applyTier();
  if(typeof PerformanceObserver!=='undefined'){
    observeLcp();observeCls();observeInp();observeLongTasks();
  }
  addEventListener('divina:privacy-change',event=>{
    if(event.detail?.analytics!==true)clearOptionalSamples();
  });
  navigator.connection?.addEventListener?.('change',applyTier);
  globalThis.divinaPerformanceV324=Object.freeze({
    targets:CORE_WEB_VITALS_TARGETS_V324,
    summary:summarizeLocalWebVitalsV324,
    tier:()=>performanceTierV324(),
    longTasks:()=>Object.freeze({count:longTaskCount,totalMs:longTaskTotal}),
    storage:'consent-only',
    networkTransport:false,
    initial:state
  });
  return true;
}
