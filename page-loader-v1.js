/* DIVINA BRUXA 2.0 — MACROETAPA 3/4 V517 · COMPOSIÇÃO E FLUIDEZ
   Preserva V501, V509 e o Universo/Chama V516; conecta Tarot e Mesa Real. */

import {
  normalizeRouteId,
  routeHasModule,
  routeLabel,
  routeNeedsPortalStyles
} from './route-registry-v180.js?v=300';
import { connectTarotMesaBridgeV517 } from './tarot-mesa-bridge-v517.js?v=517';

const pageTasks = new Map();
const sharedTasks = new Map();
const LOAD_TIMEOUT_MS = 15000;
const PORTAL_STYLES_ID = 'divinaPortalStylesV180';
const PORTAL_STYLES_HREF = 'divina-core-v179.css?v=179';
let loadingSequence = 0;

function once(map,key,factory){
  if(map.has(key)) return map.get(key);
  const task=Promise.resolve().then(factory).catch(error=>{
    map.delete(key);
    throw error;
  });
  map.set(key,task);
  return task;
}
function withTimeout(task,timeout,message){
  let timer=0;
  return Promise.race([
    Promise.resolve(task),
    new Promise((_,reject)=>{ timer=setTimeout(()=>reject(new Error(message)),timeout); })
  ]).finally(()=>clearTimeout(timer));
}
function ensureStyle(id,href){
  return once(sharedTasks,`style:${id}`,()=>withTimeout(new Promise((resolve,reject)=>{
    let link=document.getElementById(id);
    if(link?.sheet){ resolve(link); return; }
    if(link) link.remove();
    link=document.createElement('link');
    link.id=id;
    link.rel='stylesheet';
    link.href=href;
    link.dataset.rebirthStyle='true';
    link.addEventListener('load',()=>resolve(link),{once:true});
    link.addEventListener('error',()=>reject(new Error(`Estilo indisponível: ${href}`)),{once:true});
    document.head.append(link);
  }),LOAD_TIMEOUT_MS,`Tempo esgotado ao carregar ${href}.`));
}
function ensureImage(href){
  return once(sharedTasks,`image:${href}`,()=>new Promise(resolve=>{
    const image=new Image();
    let settled=false;
    const finish=value=>{
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer=setTimeout(()=>finish(false),5200);
    image.decoding='async';
    image.fetchPriority='high';
    image.addEventListener('load',async()=>{
      try{await image.decode?.();}catch{}
      finish(image.naturalWidth>0);
    },{once:true});
    image.addEventListener('error',()=>finish(false),{once:true});
    image.src=href;
  }));
}
function loadPortalStyles(){
  return ensureStyle(PORTAL_STYLES_ID,PORTAL_STYLES_HREF);
}
function announceLoading(type,detail){
  document.dispatchEvent(new CustomEvent(`divina:loading-${type}`,{detail}));
}
function createRecovery(screen,id){
  if(!screen||screen.querySelector(':scope > [data-route-recovery]')) return;
  const panel=document.createElement('aside');
  panel.className='db-route-recovery';
  panel.dataset.routeRecovery=id;
  panel.setAttribute('role','alert');
  panel.setAttribute('aria-live','assertive');
  panel.innerHTML=`<span class="db-route-recovery__sigil" aria-hidden="true">✦</span><h3>Este mundo não abriu por completo</h3><p>Nada foi perdido.</p><div><button type="button" data-route-retry="${id}">TENTAR NOVAMENTE</button><button type="button" class="secondary" data-go="home">VOLTAR À ORBE</button></div>`;
  screen.prepend(panel);
}
function clearRecovery(screen){
  screen?.querySelector(':scope > [data-route-recovery]')?.remove();
}

const LOADING_MESSAGES=Object.freeze({
  tarot:'A Orbe abre o círculo…',
  daily:'A Orbe encontra a carta deste dia…',
  library:'Abrindo as 78 cartas…',
  spreads:'Preparando sua tiragem…',
  school:'Abrindo a Escola…',
  journal:'Abrindo seu espaço privado…',
  ai:'Whit está abrindo este espaço…',
  store:'Abrindo a Loja Mística…',
  consultations:'Abrindo Consultas…',
  music:'Abrindo Música…',
  videos:'Abrindo Vídeos…',
  skins:'Vestindo a Orbe…'
});

export function createPageLoader({config,go,authClient=globalThis.divinaAuth}={}){
  const $=selector=>document.querySelector(selector);
  const abort=new AbortController();
  let observer=null;

  const ensureJournal=()=>once(sharedTasks,'journal',async()=>{
    const [,module]=await Promise.all([
      ensureStyle('divinaJournalRebirthV317','journal-world-v317.css?v=317'),
      import('./journal-world-v317.js?v=317')
    ]);
    return new module.JournalWorldV317($('#journalApp'));
  });
  const remember=entry=>ensureJournal().then(journal=>journal?.add?.(entry)).catch(()=>{});

  const ensureCommerce=()=>once(sharedTasks,'commerce',async()=>{
    const {CommerceEngine}=await import('./commerce-engine.js?v=148');
    return new CommerceEngine({
      store:$('#storeApp'),
      consultations:$('#consultationApp'),
      subscriptions:$('#subscriptionApp')
    },config);
  });

  const ensureMedia=()=>once(sharedTasks,'media',async()=>{
    const [,module]=await Promise.all([
      ensureStyle('divinaMediaCommerceRebirthV320','media-commerce-world-v320.css?v=320'),
      import('./media-commerce-world-v320.js?v=320')
    ]);
    return new module.MediaWorldV320({videos:$('#videoApp'),music:$('#musicApp')},config);
  });

  const loaders=Object.freeze({
    tarot: async()=>{
      // Retira somente estilos antigos. Os arquivos V500 permanecem seguros e inertes.
      globalThis.divinaFreeTarotV345?.destroy?.();
      delete globalThis.divinaFreeTarotV345;
      globalThis.divinaTarotLivreV503?.destroy?.();
      delete globalThis.divinaTarotLivreV503;
      globalThis.divinaTarotLivreV504?.destroy?.();
      delete globalThis.divinaTarotLivreV504;
      globalThis.divinaTarotLivreV505?.destroy?.();
      delete globalThis.divinaTarotLivreV505;
      globalThis.divinaTarotLivreV506?.destroy?.();
      delete globalThis.divinaTarotLivreV506;
      globalThis.divinaTarotLivreV507?.destroy?.();
      delete globalThis.divinaTarotLivreV507;
      globalThis.divinaTarotLivreV508?.destroy?.();
      delete globalThis.divinaTarotLivreV508;
      globalThis.divinaTarotLivreV510?.destroy?.();
      delete globalThis.divinaTarotLivreV510;
      globalThis.divinaTarotLivreV512?.destroy?.();
      delete globalThis.divinaTarotLivreV512;
      globalThis.divinaTarotLivreV513?.destroy?.();
      delete globalThis.divinaTarotLivreV513;
      globalThis.divinaTarotLivreV514?.destroy?.();
      delete globalThis.divinaTarotLivreV514;
      globalThis.divinaTarotLivreV515?.destroy?.();
      delete globalThis.divinaTarotLivreV515;
      globalThis.divinaTarotLivreV516?.destroy?.();
      delete globalThis.divinaTarotLivreV516;
      [
        'freeTarotFireEngineV345Styles',
        'divinaTarotLivreCosmicoV500',
        'divinaTarotLivreChamaV401',
        'divinaTarotLivreZeroV400',
        'divinaTarotRebirthV301',
        'divinaTarotLivreSupremoV503',
        'divinaTarotLivreSupremoV504',
        'divinaTarotLivreSupremoV505',
        'divinaTarotLivreSupremoV506',
        'divinaTarotLivreSupremoV507',
        'divinaTarotLivreSupremoV508',
        'divinaTarotLivreSupremoV510',
        'divinaTarotLivreOrbOSV512',
        'divinaTarotLivreOrbOSV513',
        'divinaTarotLivreOrbOSV514',
        'divinaTarotLivreOrbOSV515',
        'divinaTarotLivreOrbOSV516'
      ].forEach(styleId=>document.getElementById(styleId)?.remove());
      const [,module]=await Promise.all([
        ensureStyle('divinaTarotLivreOrbOSV517','tarot-livre-orbe-os-v517.css?v=517-ios-composition'),
        import('./tarot-livre-orbe-os-v517.js?v=517-ios-composition')
      ]);
      const instance=new module.TarotLivreOrbOSV517($('#tarot'),{
        orbCore:globalThis.divinaOrbSupremeV501?.core||globalThis.orbe?.supreme
      });
      globalThis.divinaTarotLivreV517=instance;
      return instance;
    },
    daily: async()=>{
      globalThis.divinaDailyWorldV509?.destroy?.();
      delete globalThis.divinaDailyWorldV509;
      document.getElementById('divinaDailyRebirthV303')?.remove();
      const [,module]=await Promise.all([
        ensureStyle('divinaDailyLivingV509','daily-world-v509.css?v=509'),
        import('./daily-world-v509.js?v=509')
      ]);
      const instance=new module.DailyWorldV509($('#dailyCard'),{
        onSave:remember,
        authClient,
        orbCore:globalThis.divinaOrbSupremeV501?.core||globalThis.orbe?.supreme
      });
      globalThis.divinaDailyWorldV509=instance;
      return instance;
    },
    library: async()=>{
      const [,module]=await Promise.all([
        ensureStyle('divinaLibraryRebirthV302','library-world-v302.css?v=302'),
        import('./library-world-v302.js?v=302')
      ]);
      return new module.LibraryWorldV302($('#cardLibraryApp'));
    },
    school: async()=>{
      const [,module]=await Promise.all([
        ensureStyle('divinaSchoolRebirthV306','school-world-v306.css?v=306'),
        import('./school-world-v306.js?v=306')
      ]);
      return new module.SchoolWorldV306($('#schoolApp'));
    },
    spreads: async()=>{
      const [,module]=await Promise.all([
        ensureStyle('divinaSpreadsRebirthV305','spreads-world-v305.css?v=305'),
        import('./spreads-world-v305.js?v=305')
      ]);
      const instance=new module.SpreadsWorldV305({
        grid:$('#spreadGrid'),
        result:$('#spreadResult'),
        intention:$('#spreadIntention'),
        history:$('#spreadHistory')
      },remember,{authClient,whit:globalThis.whit});
      globalThis.divinaSpreadsWorldV305=instance;
      connectTarotMesaBridgeV517(instance);
      return instance;
    },
    journal:ensureJournal,
    ai:async()=>{
      const {AIEngine}=await import('./ai-engine.js?v=190');
      return new AIEngine($('#aiApp'),config);
    },
    store:async()=>{
      await ensureCommerce();
      const [,module]=await Promise.all([
        ensureStyle('divinaMediaCommerceRebirthV320','media-commerce-world-v320.css?v=320'),
        import('./media-commerce-world-v320.js?v=320')
      ]);
      return new module.StoreWorldV320($('#storeApp'),config);
    },
    consultations:async()=>{
      await ensureCommerce();
      const [,module]=await Promise.all([
        ensureStyle('divinaAccountConsultationsRebirthV319','account-consultations-world-v319.css?v=319'),
        import('./account-consultations-world-v319.js?v=534-consultations-anchor')
      ]);
      return new module.ConsultationsWorldV319($('#consultationApp'),config);
    },
    subscriptions:async()=>{
      const [,module]=await Promise.all([
        ensureStyle('divinaCrownRebirthV318','skins-premium-world-v318.css?v=318'),
        import('./skins-premium-world-v318.js?v=318')
      ]);
      return new module.PremiumWorldV318($('#subscriptionApp'));
    },
    skins:async()=>{
      const [,module]=await Promise.all([
        ensureStyle('divinaCrownRebirthV318','skins-premium-world-v318.css?v=318'),
        import('./skins-premium-world-v318.js?v=318')
      ]);
      return new module.SkinsWorldV318($('#skinsApp'));
    },
    videos:ensureMedia,
    music:ensureMedia,
    notifications:async()=>{
      const [,module]=await Promise.all([
        ensureStyle('divinaNotificationsRebirthV321','notifications-world-v321.css?v=321'),
        import('./notifications-world-v321.js?v=321')
      ]);
      return new module.NotificationsWorldV321($('#notificationApp'),go);
    },
    admin:async()=>{
      const [,,,adminModule,mediaModule,intelligenceModule,observatoryModule]=await Promise.all([
        ensureStyle('divinaMediaCommerceRebirthV320','media-commerce-world-v320.css?v=320'),
        ensureStyle('divinaAdminIntelligenceRebirthV322','admin-intelligence-v322.css?v=322'),
        ensureStyle('divinaOwnerObservatoryV532Styles','owner-observatory-v532.css?v=532'),
        import('./admin-engine.js?v=532'),
        import('./media-commerce-world-v320.js?v=320'),
        import('./admin-intelligence-v322.js?v=532'),
        import('./owner-observatory-v532.js?v=532')
      ]);
      const engine=new adminModule.AdminEngine($('#adminApp'));
      new mediaModule.AdminMediaV320($('#adminApp'));
      new intelligenceModule.AdminIntelligenceV322($('#adminApp'));
      observatoryModule.createOwnerObservatoryV532($('#adminApp'),{
        engine,
        orbCore:globalThis.divinaOrbSupremeV501?.core||globalThis.orbe?.supreme
      });
      return engine;
    }
  });

  const warmers=Object.freeze({
    tarot:()=>Promise.all([
      ensureStyle('divinaTarotLivreOrbOSV517','tarot-livre-orbe-os-v517.css?v=517-ios-composition'),
      import('./tarot-livre-orbe-os-v517.js?v=517-ios-composition')
    ]),
    daily:()=>Promise.all([
      ensureStyle('divinaDailyLivingV509','daily-world-v509.css?v=509'),
      import('./daily-world-v509.js?v=509')
    ]),
    library:()=>Promise.all([
      ensureStyle('divinaLibraryRebirthV302','library-world-v302.css?v=302'),
      import('./library-world-v302.js?v=302')
    ]),
    spreads:()=>Promise.all([
      ensureStyle('divinaSpreadsRebirthV305','spreads-world-v305.css?v=305'),
      import('./spreads-world-v305.js?v=305')
    ]),
    school:()=>Promise.all([
      ensureStyle('divinaSchoolRebirthV306','school-world-v306.css?v=306'),
      import('./school-world-v306.js?v=306')
    ]),
    journal:()=>Promise.all([
      ensureStyle('divinaJournalRebirthV317','journal-world-v317.css?v=317'),
      import('./journal-world-v317.js?v=317')
    ]),
    skins:()=>Promise.all([
      ensureStyle('divinaCrownRebirthV318','skins-premium-world-v318.css?v=318'),
      import('./skins-premium-world-v318.js?v=318')
    ]),
    subscriptions:()=>Promise.all([
      ensureStyle('divinaCrownRebirthV318','skins-premium-world-v318.css?v=318'),
      import('./skins-premium-world-v318.js?v=318')
    ]),
    consultations:()=>Promise.all([
      import('./commerce-engine.js?v=148'),
      ensureStyle('divinaAccountConsultationsRebirthV319','account-consultations-world-v319.css?v=319'),
      import('./account-consultations-world-v319.js?v=534-consultations-anchor')
    ]),
    store:()=>Promise.all([
      import('./commerce-engine.js?v=148'),
      ensureStyle('divinaMediaCommerceRebirthV320','media-commerce-world-v320.css?v=320'),
      import('./media-commerce-world-v320.js?v=320')
    ]),
    music:()=>Promise.all([
      ensureStyle('divinaMediaCommerceRebirthV320','media-commerce-world-v320.css?v=320'),
      import('./media-commerce-world-v320.js?v=320')
    ]),
    videos:()=>Promise.all([
      ensureStyle('divinaMediaCommerceRebirthV320','media-commerce-world-v320.css?v=320'),
      import('./media-commerce-world-v320.js?v=320')
    ]),
    admin:()=>Promise.all([
      ensureStyle('divinaMediaCommerceRebirthV320','media-commerce-world-v320.css?v=320'),
      ensureStyle('divinaAdminIntelligenceRebirthV322','admin-intelligence-v322.css?v=322'),
      ensureStyle('divinaOwnerObservatoryV532Styles','owner-observatory-v532.css?v=532'),
      import('./admin-engine.js?v=532'),
      import('./media-commerce-world-v320.js?v=320'),
      import('./admin-intelligence-v322.js?v=532'),
      import('./owner-observatory-v532.js?v=532')
    ]),
    notifications:()=>Promise.all([
      ensureStyle('divinaNotificationsRebirthV321','notifications-world-v321.css?v=321'),
      import('./notifications-world-v321.js?v=321')
    ])
  });

  const warm=ids=>{
    const list=Array.isArray(ids)?ids:[ids];
    return Promise.allSettled(
      list.filter(id=>warmers[id]).map(id=>once(sharedTasks,`warm:${id}`,warmers[id]))
    );
  };

  const load=rawId=>{
    const id=normalizeRouteId(rawId);
    if(!routeHasModule(id)) return Promise.resolve(null);
    const loader=loaders[id];
    if(!loader) return Promise.reject(new Error(`Motor ausente para ${id}`));

    return once(pageTasks,id,async()=>{
      const screen=document.getElementById(id);
      const html=document.documentElement;
      const loadingId=`world:${id}:${++loadingSequence}`;

      clearRecovery(screen);
      screen?.setAttribute('aria-busy','true');
      screen?.setAttribute('data-module-state','loading');
      html.dataset.pageLoading=id;
      announceLoading('start',{
        id:loadingId,
        pageId:id,
        label:routeLabel(id),
        message:LOADING_MESSAGES[id]
      });
      document.dispatchEvent(new CustomEvent('divina:page-loading',{detail:{id}}));

      try{
        const styleTask=routeNeedsPortalStyles(id)?loadPortalStyles():Promise.resolve(null);
        const [,instance]=await Promise.all([
          styleTask,
          withTimeout(loader(),LOAD_TIMEOUT_MS,`Tempo esgotado ao abrir ${routeLabel(id)}.`)
        ]);
        clearRecovery(screen);
        screen?.setAttribute('data-module-state','ready');
        document.dispatchEvent(new CustomEvent('divina:page-ready',{detail:{id}}));
        return instance;
      }catch(error){
        screen?.setAttribute('data-module-state','error');
        createRecovery(screen,id);
        document.dispatchEvent(new CustomEvent('divina:page-error',{detail:{id,recoverable:true}}));
        globalThis.dispatchEvent?.(new CustomEvent('orbe:toast',{
          detail:'Este mundo não abriu agora. Nada foi perdido.'
        }));
        console.error(`[Divina] falha ao abrir ${id}`,error);
        throw error;
      }finally{
        announceLoading('end',{id:loadingId,pageId:id});
        screen?.removeAttribute('aria-busy');
        if(html.dataset.pageLoading===id) delete html.dataset.pageLoading;
      }
    });
  };

  const retry=id=>{
    const route=normalizeRouteId(id);
    pageTasks.delete(route);
    clearRecovery(document.getElementById(route));
    return Promise.resolve(go?go(route):load(route));
  };

  const primeFromIntent=event=>{
    const id=event.target.closest?.('[data-go]')?.dataset.go;
    if(id&&routeHasModule(id)) load(id).catch(()=>{});
  };

  document.addEventListener('pointerdown',primeFromIntent,{capture:true,passive:true,signal:abort.signal});
  document.addEventListener('focusin',primeFromIntent,{capture:true,signal:abort.signal});
  document.addEventListener('click',primeFromIntent,{capture:true,signal:abort.signal});
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-route-retry]');
    if(!button)return;
    event.preventDefault();
    retry(button.dataset.routeRetry).catch(()=>{});
  },{signal:abort.signal});

  observer=new MutationObserver(()=>{
    const id=document.body.dataset.screen;
    if(id) load(id).catch(()=>{});
  });
  observer.observe(document.body,{attributes:true,attributeFilter:['data-screen']});

  return Object.freeze({
    load,
    prepare:load,
    retry,
    warm,
    go:id=>Promise.resolve(go?go(normalizeRouteId(id)):load(id)),
    portalStylesReady:()=>Boolean(document.getElementById(PORTAL_STYLES_ID)?.sheet),
    destroy:()=>{abort.abort();observer?.disconnect();}
  });
}
