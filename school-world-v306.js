/* DIVINA BRUXA 4.0 — ESCOLA ORGANIZADA V555 + WORK12 CÂMARA V596
   Uma única jornada visível, três níveis pedagógicos e a Orbe canônica.
   Na V596, a Orbe permanece no limiar e a Escola nasce abaixo dela. */

import { SchoolEngine } from './school-engine.js?v=555';
import { SCHOOL_MODULES, SCHOOL_STAGES, SCHOOL_LESSON_TOTAL } from './school-policy.js?v=555';

const reducedMotion=()=>globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
const routeNow=()=>String(document.body?.dataset?.screen||location.hash||'home').replace(/^#/,'').toLowerCase();

function stageSnapshot(engine,stage,seen=new Set()){
  const completed=new Set(engine?.state?.completed||[]);
  const lessons=stage.moduleIds.flatMap(id=>{
    const module=SCHOOL_MODULES.find(item=>item.id===id);
    return module?engine.lessonsFor(module):[];
  }).filter(lesson=>!seen.has(lesson.id)&&seen.add(lesson.id));
  const done=lessons.filter(lesson=>completed.has(lesson.id)).length;
  return {stage,total:lessons.length,done,percent:lessons.length?Math.round(done/lessons.length*100):0};
}

export class SchoolWorldV306{
  constructor(root,options={}){
    if(!root)throw new Error('Escola V555 precisa de #schoolApp.');
    this.root=root;this.destroyed=false;this.enhanceQueued=false;this.abort=new AbortController();
    this.orbCore=options.orbCore||globalThis.divinaOrbSupremeV501?.core||globalThis.orbe?.supreme||null;
    this.orb=this.orbCore?.orb||null;this.orbRelease=null;
    this.engine=new SchoolEngine(root,{authClient:options.authClient||globalThis.divinaAuth});

    const originalRender=this.engine.render?.bind(this.engine);
    if(originalRender)this.engine.render=(...args)=>{this.releaseOrb();const value=originalRender(...args);this.enhance();return value;};
    const originalLessons=this.engine.renderLessons?.bind(this.engine);
    if(originalLessons)this.engine.renderLessons=(...args)=>{const value=originalLessons(...args);this.queueEnhance();return value;};

    document.addEventListener('divina:route-ready',event=>{
      if(event.detail?.id==='school')this.queueEnhance();else this.releaseOrb();
    },{signal:this.abort.signal});
    this.orb?.addEventListener('click',()=>{
      const host=this.root.querySelector('[data-school-orb-host]');
      if(routeNow()!=='school'||!host?.contains(this.orb))return;
      this.orbCore?.pulse?.('school-continue',{intensity:.58});
      this.engine.continuePath?.();
    },{signal:this.abort.signal});

    this.enhance();root.dataset.schoolWorld='v555';
    document.dispatchEvent(new CustomEvent('divina:school-world-ready',{detail:Object.freeze({version:555,modules:17,lessons:SCHOOL_LESSON_TOTAL,stages:3,duplicateModuleMaps:0,canonicalOrb:true})}));
  }

  queueEnhance(){
    if(this.destroyed||this.enhanceQueued)return;
    this.enhanceQueued=true;
    requestAnimationFrame(()=>{this.enhanceQueued=false;this.enhance();});
  }

  enhance(){
    if(this.destroyed||!this.root.isConnected)return;
    const dashboard=this.root.querySelector('.school-dashboard');
    if(!dashboard)return;
    dashboard.classList.add('school-v555-dashboard');
    let compass=this.root.querySelector('.school-v555-compass');
    if(!compass){compass=document.createElement('section');compass.className='school-v555-compass';dashboard.insertAdjacentElement('afterend',compass);}
    const uniqueLessons=new Set();
    const stages=SCHOOL_STAGES.map(stage=>stageSnapshot(this.engine,stage,uniqueLessons));
    const signature=stages.map(item=>`${item.stage.id}:${item.done}`).join('|')+`|${this.engine.activeModule}|${this.engine.premium}`;
    if(compass.dataset.signature!==signature){
      compass.dataset.signature=signature;
      compass.innerHTML=`<header><div><p class="eyebrow">MAPA ÚNICO DA ESCOLA</p><h3>Três jornadas. Dezessete módulos. Um próximo passo.</h3></div><span>124 AULAS</span></header><div class="school-v555-stages">${stages.map(item=>`<button type="button" data-school-stage-target="${item.stage.moduleIds[0]}"><span>${String(item.stage.order).padStart(2,'0')}</span><div><small>JORNADA ${item.stage.order}</small><b>${item.stage.title}</b><em>${item.stage.subtitle}</em><i><u style="width:${item.percent}%"></u></i><strong>${item.done}/${item.total}</strong></div></button>`).join('')}</div><p>Abra uma jornada, escolha um módulo e estude uma aula por vez. A busca continua atravessando a Escola inteira.</p><details class="school-v555-plan"><summary>Plano de estudo em 30 dias <span>ABRIR RITMO</span></summary><ol><li><b>Dias 1–7 · Fundamentos</b><span>Linguagem, estrutura e Arcanos Maiores.</span></li><li><b>Dias 8–15 · Quatro elementos</b><span>Paus, Copas, Espadas e Ouros em prática.</span></li><li><b>Dias 16–23 · Construir leituras</b><span>Corte, números, posições, combinações e síntese.</span></li><li><b>Dias 24–30 · Maestria responsável</b><span>Tiragens, ética, revisão e método próprio.</span></li></ol><p>Marque cada aula concluída e use “Revisar depois” para criar sua fila espaçada. O plano orienta; seu ritmo continua soberano.</p></details>`;
      compass.onclick=event=>{
        const button=event.target.closest('[data-school-stage-target]');if(!button)return;
        this.root.querySelector(`[data-school-module="${button.dataset.schoolStageTarget}"]`)?.click();
      };
    }
    this.root.querySelectorAll('[data-school-module]').forEach(button=>{
      const module=SCHOOL_MODULES.find(item=>item.id===button.dataset.schoolModule);
      if(module)button.dataset.schoolStage=SCHOOL_STAGES.find(stage=>stage.moduleIds.includes(module.id))?.id||'foundations';
    });
    this.root.querySelectorAll('.school-lesson').forEach((lesson,index)=>{lesson.style.setProperty('--school-lesson-order',String(index));lesson.dataset.schoolLesson='v555';});
    this.ensureOrbHost(dashboard);this.syncOrb();
    const progress=this.engine.progress();
    document.dispatchEvent(new CustomEvent('divina:school-progress-v555',{detail:Object.freeze({done:progress.totalDone,total:SCHOOL_LESSON_TOTAL,percent:progress.percent,private:false,noteIncluded:false})}));
  }

  ensureOrbHost(dashboard){
    let zone=dashboard.querySelector('.school-v555-orb-zone');
    if(zone)return zone;
    zone=document.createElement('aside');zone.className='school-v555-orb-zone';
    zone.innerHTML='<div class="school-v555-orb-host" data-school-orb-host></div><p><b>A Orbe acompanha o estudo</b><span>Toque para continuar exatamente da próxima aula.</span></p>';
    dashboard.append(zone);return zone;
  }

  syncOrb(){
    if(document.documentElement.dataset.realityChambers==='v596'){
      this.releaseOrb();
      return false;
    }
    if(routeNow()!=='school'||!this.orbCore?.claim||!this.orb)return false;
    const host=this.root.querySelector('[data-school-orb-host]');if(!host)return false;
    if(host.contains(this.orb))return true;
    this.releaseOrb();
    this.orbRelease=this.orbCore.claim(host,{mode:'school',ariaLabel:'Orbe das Realidades. Continuar da próxima aula da Escola do Tarot.'});
    return true;
  }

  releaseOrb(){try{this.orbRelease?.();}catch{}this.orbRelease=null;}

  status(){const progress=this.engine.progress();return Object.freeze({release:'V555',modules:17,lessons:124,stages:3,duplicateModuleMaps:0,canonicalOrb:true,freeLessons:17,premiumLessons:107,premium:this.engine.premium,progress:progress.percent,normalOnly:true,permanentAnimationLoops:0,reducedMotion:reducedMotion()});}

  destroy(){this.destroyed=true;this.abort.abort();this.releaseOrb();this.engine.destroy?.();this.root?.removeAttribute('data-school-world');}
}
