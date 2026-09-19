/* DIVINA BRUXA — WORK12 · QA BOOT RECUPERÁVEL · FECHAMENTO VIVO V600 */
import fs from 'node:fs';
import vm from 'node:vm';

const checks=[];
const check=(id,condition,detail='')=>checks.push({id,pass:Boolean(condition),detail:condition?'':String(detail)});
const indexSource=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const bootScript=[...indexSource.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].map(match=>match[2]).find(body=>body.includes('divina:work12-boot-release'));

function harness(){
  const timers=new Map(),listeners=new Map(),events=[];let timerId=0;
  const classList=()=>{const values=new Set();return{add:(...items)=>items.forEach(item=>values.add(item)),remove:(...items)=>items.forEach(item=>values.delete(item)),contains:item=>values.has(item)};};
  const style=()=>{const values=new Map();return{setProperty:(name,value)=>values.set(name,value),removeProperty:name=>values.delete(name)};};
  const node=()=>({hidden:false,disabled:false,textContent:'',dataset:{},classList:classList(),style:style(),attributes:new Map(),listeners:new Map(),setAttribute(name,value){this.attributes.set(name,String(value));},removeAttribute(name){this.attributes.delete(name);},addEventListener(type,handler){this.listeners.set(type,handler);}});
  const root=node(),message=node(),whisper=node(),recovery=node(),portal=node(),app=node(),home=node(),body=node();
  portal.querySelector=selector=>({'.db-orb-loader__message':message,'.db-orb-loader__whisper':whisper,'.db-orb-loader__recovery':recovery})[selector]||null;
  const document={documentElement:root,body,getElementById:id=>({orbLoadingPortal:portal,app,home})[id]||null,dispatchEvent:event=>{events.push(event);return true;}};
  class PlainCustomEvent{constructor(type,options={}){this.type=type;this.detail=options.detail;this.bubbles=Boolean(options.bubbles);}}
  const context={document,CustomEvent:PlainCustomEvent,console,navigator:{serviceWorker:{addEventListener(){},register:async()=>({scope:'https://divina.test/',update:async()=>{}})}},setTimeout:(handler,delay=0)=>{const id=++timerId;timers.set(id,{handler,delay});return id;},clearTimeout:id=>timers.delete(id),addEventListener:(type,handler)=>{if(!listeners.has(type))listeners.set(type,[]);listeners.get(type).push(handler);},removeEventListener:(type,handler)=>listeners.set(type,(listeners.get(type)||[]).filter(item=>item!==handler))};
  context.window=context;
  vm.runInContext(bootScript,vm.createContext(context),{filename:'work12-inline-boot-v600.js'});
  const runDelay=delay=>{for(const [id,timer] of [...timers]){if(timer.delay!==delay)continue;timers.delete(id);timer.handler();}};
  const fire=type=>{for(const handler of listeners.get(type)||[])handler({type});};
  const click=()=>recovery.listeners.get('click')?.({preventDefault(){},stopImmediatePropagation(){}});
  return{root,portal,home,body,timers,events,runDelay,fire,click};
}

check('boot:script-found',Boolean(bootScript));
check('boot:app-v598',indexSource.includes('app-v208.js?v=598-work12-final'));
check('boot:worker-v600',indexSource.includes("register('./sw.js?v=600'"));
check('boot:intelligence-style-v597',indexSource.includes('experience-intelligence-v597.css?v=597-work12-intelligence'));
check('boot:final-style-v599',indexSource.includes('work12-final-continuity-v598.css?v=599-live-audit'));
check('boot:one-style-identity',indexSource.includes('id="divinaWork12FinalContinuityV598"')&&!indexSource.includes('id="divinaWork12FinalContinuityV599"'));
const watchdog=harness();
check('boot:watchdog-armed',[...watchdog.timers.values()].some(timer=>timer.delay===4500));
watchdog.runDelay(4500);watchdog.runDelay(180);
check('boot:watchdog-reveals-home',watchdog.home.classList.contains('active')&&watchdog.body.dataset.screen==='home');
check('boot:watchdog-hides-portal',watchdog.portal.hidden&&watchdog.portal.attributes.get('aria-hidden')==='true');
check('boot:watchdog-v600',watchdog.root.dataset.work12Boot==='released-v600'&&watchdog.root.dataset.work12BootReason==='boot-watchdog');
check('boot:watchdog-event-v600',watchdog.events.some(event=>event.type==='divina:work12-boot-release'&&event.detail.version===600));
check('boot:recovery-source-v600',watchdog.events.some(event=>event.type==='divina:loading-bypass'&&event.detail.source==='work12-one-style-v600'));
const manual=harness();manual.click();
check('boot:manual-opens',manual.home.classList.contains('active')&&manual.root.dataset.work12BootReason==='manual');
const healthy=harness();healthy.root.dataset.appShell='v180';healthy.fire('divina:boot-ready');healthy.runDelay(4500);
check('boot:healthy-never-bypassed',healthy.root.dataset.work12Boot==='ready-v600'&&!healthy.home.classList.contains('active'));

const failures=checks.filter(item=>!item.pass);
console.log(JSON.stringify({release:'V600',work:'WORK12',macroStage:'10-of-10 / one-style-boot-runtime',state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,failed:failures.length,total:checks.length,failures:failures.map(({id,detail})=>({id,detail}))},null,2));
if(failures.length)process.exitCode=1;
