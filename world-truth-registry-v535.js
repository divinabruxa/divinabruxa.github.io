/* DIVINA BRUXA — PLANO SUPREMO 3.0 · MACROETAPA 1/14 · V535
   FONTE DE VERDADE E REGISTRO VIVO

   Uma definição pública e imutável para as 17 realidades. A mesma fonte
   alimenta assinatura, pouso e viagem da Orbe. Esta camada não lê campos,
   conteúdo privado, storage ou APIs e não abre nenhuma trava de produção.
*/

import { ROUTES_V180, normalizeRouteId } from './route-registry-v180.js?v=180';
import {
  COMMERCIAL_TRUTH_V200,
  assertCommercialTruthV200
} from './commercial-truth-v200.js?v=200';

const VERSION = 535;
const INSTANCE = Symbol.for('divina.world.truth.v535');
const freezeItems = items => Object.freeze(items.map(item => Object.freeze({ ...item })));

const routes = [
  {
    id:'home', family:'origin', name:'Início', purpose:'A origem e o centro do universo.',
    signature:{ mode:'home', direction:'in', tone:'origin' }, gateway:[0.50,0.50],
    journeyAnchors:['#home [data-supreme-orb="living"]','#home #orb','#home [data-orb-root]']
  },
  {
    id:'tarot', family:'tarot', name:'Tarot Livre', purpose:'A mesa viva das 78 cartas.',
    signature:{ mode:'tarot', direction:'up', tone:'stellar-fire' }, gateway:[0.50,0.42],
    journeyAnchors:['#tarot [data-supreme-orb="living"]','#tarot [data-tarot-orb-host]','#tarot .tl517__orb-host']
  },
  {
    id:'daily', family:'tarot', name:'Carta do Dia', purpose:'Um encontro diário pelo horário de Brasília.',
    signature:{ mode:'daily', direction:'up-right', tone:'dawn' }, gateway:[0.68,0.34],
    journeyAnchors:['#daily [data-supreme-orb="living"]','#daily [data-daily-orb-host]','#daily [data-orb-journey-anchor]'],
    presence:{ name:'Carta do Dia', aria:'Orbe do agora. Toque para despertar o universo.', before:'#dailyCard' }
  },
  {
    id:'library', family:'wisdom', name:'Biblioteca', purpose:'Conhecimento profundo sobre as 78 cartas.',
    signature:{ mode:'library', direction:'right', tone:'archive' }, gateway:[0.30,0.40],
    journeyAnchors:['#library [data-orb-journey-anchor]'],
    presence:{ name:'Biblioteca', aria:'Orbe do conhecimento. Toque para despertar o universo.', before:'#cardLibraryApp' }
  },
  {
    id:'school', family:'wisdom', name:'Escola do Tarot', purpose:'Aprendizado progressivo, verdadeiro e aplicável.',
    signature:{ mode:'school', direction:'right', tone:'knowledge' }, gateway:[0.70,0.38],
    journeyAnchors:['#school [data-orb-journey-anchor]'],
    presence:{ name:'Escola do Tarot', aria:'Orbe do aprendizado. Toque para despertar o universo.', before:'.school-celestial-map' }
  },
  {
    id:'spreads', family:'tarot', name:'Tiragens', purpose:'Métodos, posições e síntese para perguntas conscientes.',
    signature:{ mode:'spreads', direction:'out', tone:'constellation' }, gateway:[0.34,0.38],
    journeyAnchors:['#spreads [data-orb-journey-anchor]','#spreads [data-mesa-orb-host]'],
    presence:{ name:'Tiragens', aria:'Orbe das tiragens. Toque para despertar o universo.', before:'.spreads-celestial-map' }
  },
  {
    id:'ai', family:'whit', name:'Whit', purpose:'Companhia simbólica local e explicitamente governada.',
    signature:{ mode:'ai', direction:'out', tone:'mind' }, gateway:[0.50,0.44],
    journeyAnchors:['#ai [data-orb-journey-anchor]','#ai [data-whit-orb]','#ai [data-whit-presence]'],
    presence:{ name:'Whit', aria:'Presença da Whit na Orbe. Toque para despertar o universo.', before:'.ai-celestial-map' }
  },
  {
    id:'journal', family:'wisdom', name:'Diário e Espelho', purpose:'Espaço privado de reflexão sob controle da pessoa.',
    signature:{ mode:'journal', direction:'in', tone:'reflection' }, gateway:[0.67,0.50],
    journeyAnchors:['#journal [data-orb-journey-anchor]'],
    presence:{ name:'Diário e Espelho', aria:'Orbe do espelho. Toque para despertar o universo.', before:'.journal-celestial-map' }
  },
  {
    id:'store', family:'experience', name:'Loja Mística', purpose:'Curadoria externa com origem e limites visíveis.',
    signature:{ mode:'store', direction:'down-right', tone:'portal' }, gateway:[0.70,0.58],
    journeyAnchors:['#store [data-orb-journey-anchor]'],
    presence:{ name:'Loja', aria:'Orbe das escolhas. Toque para despertar o universo.', before:'#storeApp' }
  },
  {
    id:'consultations', family:'experience', name:'Consultas', purpose:'Serviços, acolhimento e orientação com verdade comercial.',
    signature:{ mode:'consultations', direction:'up-right', tone:'portal' }, gateway:[0.72,0.38],
    journeyAnchors:['#consultations [data-orb-journey-anchor]'],
    presence:{ name:'Consultas', aria:'Orbe do acolhimento. Toque para despertar o universo.', before:'#consultationApp' }
  },
  {
    id:'subscriptions', family:'identity', name:'Premium', purpose:'Direitos e benefícios sem concessão pelo navegador.',
    signature:{ mode:'premium', direction:'up', tone:'crown' }, gateway:[0.50,0.30],
    journeyAnchors:['#subscriptions [data-orb-journey-anchor]'],
    presence:{ name:'Premium', aria:'Orbe Premium. Toque para despertar o universo.', before:'#subscriptionApp' }
  },
  {
    id:'skins', family:'identity', name:'Skins', purpose:'Personalização cosmética da mesma Orbe.',
    signature:{ mode:'skins', direction:'around', tone:'metamorphosis' }, gateway:[0.50,0.52],
    journeyAnchors:['#skins [data-orb-journey-anchor]','#skins [data-skin-orb]'],
    presence:{ name:'Skins', aria:'Orbe em transformação. Toque para despertar o universo.', after:'.db-page-world__hero' }
  },
  {
    id:'videos', family:'experience', name:'Vídeos', purpose:'Conteúdo publicado de De Frente com o Tarot.',
    signature:{ mode:'videos', direction:'left', tone:'light' }, gateway:[0.70,0.52],
    journeyAnchors:['#videos [data-orb-journey-anchor]'],
    presence:{ name:'Vídeos', aria:'Orbe das histórias. Toque para despertar o universo.', before:'#videoApp' }
  },
  {
    id:'music', family:'experience', name:'Música', purpose:'Álbuns publicados, sem reprodução automática.',
    signature:{ mode:'music', direction:'left', tone:'wave' }, gateway:[0.30,0.52],
    journeyAnchors:['#music [data-orb-journey-anchor]'],
    presence:{ name:'Música', aria:'Orbe sonora. Toque para despertar o universo.', before:'#musicApp' }
  },
  {
    id:'notifications', family:'identity', name:'Notificações', purpose:'Sinais com consentimento granular e horários de silêncio.',
    signature:{ mode:'notifications', direction:'down', tone:'signal' }, gateway:[0.72,0.30],
    journeyAnchors:['#notifications [data-orb-journey-anchor]'],
    presence:{ name:'Notificações', aria:'Orbe dos sinais. Toque para despertar o universo.', before:'#notificationApp' }
  },
  {
    id:'login', family:'identity', name:'Conta', purpose:'Identidade, sessão e continuidade com autoridade segura.',
    signature:{ mode:'account', direction:'in', tone:'halo' }, gateway:[0.50,0.34],
    journeyAnchors:['#login [data-orb-journey-anchor]'],
    presence:{ name:'Conta', aria:'Orbe da continuidade. Toque para despertar o universo.', existing:'.account-v189-orb' }
  },
  {
    id:'admin', family:'owner', name:'Central da Proprietária', purpose:'Observatório protegido por identidade e MFA.',
    signature:{ mode:'admin', direction:'in', tone:'guard' }, gateway:[0.50,0.38],
    journeyAnchors:['#admin [data-orb-journey-anchor]'],
    presence:{ name:'Admin', aria:'Orbe guardiã. Toque para despertar o universo.', before:'#adminApp' }
  }
].map(world => Object.freeze({
  ...world,
  signature:Object.freeze({ ...world.signature }),
  gateway:Object.freeze([...world.gateway]),
  journeyAnchors:Object.freeze([...world.journeyAnchors]),
  presence:world.presence ? Object.freeze({ ...world.presence }) : null
}));

export const WORLD_ROUTES_V535 = Object.freeze(routes);
export const WORLD_SIGNATURES_V535 = Object.freeze(Object.fromEntries(
  routes.map(world => [world.id, world.signature])
));

const routeIndex = new Map(routes.map(world => [world.id, world]));

export const WORLD_TRUTH_V535 = Object.freeze({
  release:'V535',
  plan:'Plano Supremo Divina Bruxa 3.0 — Universo Vivo pós-V534',
  macroStage:'1-of-14',
  title:'Fonte de Verdade e Registro Vivo',
  routeCount:17,
  routes:WORLD_ROUTES_V535,
  canonical:Object.freeze({
    tarotCards:78,
    tarotOrientation:'normal',
    tarotRepeats:false,
    tarotLivreColumns:6,
    dailyCardsPerBrasiliaDay:1,
    spreadMethods:15,
    celticCrossPositions:10,
    royalTable:Object.freeze({ columns:13, rows:6, total:78 }),
    schoolModules:17,
    schoolLessons:124,
    skins:30,
    consultationServices:COMMERCIAL_TRUTH_V200.services.length,
    consultationPriceCents:Object.freeze(COMMERCIAL_TRUTH_V200.services.map(service => service.priceCents)),
    publicFallbackAlbums:2,
    inventedVideos:0
  }),
  authority:Object.freeze({
    routes:'route-registry-v180.js + world-truth-registry-v535.js',
    commercialRuntime:'commercial-truth-v200.js',
    orb:'supreme-orb-core-v501.js',
    journey:'orb-ios-journey-core-v525.js',
    universe:'living-universe-core-v524.js',
    entitlements:'server'
  }),
  privacy:Object.freeze({
    privateContentReads:0,
    formValueReads:0,
    storageReads:0,
    storageWrites:0,
    apiCalls:0
  }),
  gates:Object.freeze({
    environment:'staging',
    realBilling:false,
    productionPublish:false,
    dnsChanges:false,
    storeSubmission:false,
    sol:false
  }),
  openDecisions:Object.freeze([
    Object.freeze({
      id:'DG-02-CONSULTATION-LEGACY-SURFACES',
      state:'BLOCKED_OWNER_DECISION',
      activeRuntimeAuthority:'commercial-truth-v200.js',
      rule:'Nenhuma superfície histórica de preço é reescrita silenciosamente.'
    })
  ])
});

export function normalizeWorldRouteV535(value, fallback = 'home') {
  return normalizeRouteId(value, fallback);
}

export function worldForRouteV535(value) {
  return routeIndex.get(normalizeWorldRouteV535(value)) || routeIndex.get('home');
}

export function worldSignatureV535(value) {
  return worldForRouteV535(value).signature;
}

export function orbPresenceProfilesV535() {
  return Object.freeze(Object.fromEntries(
    routes.filter(world => world.presence).map(world => [world.id, world.presence])
  ));
}

export function auditWorldTruthV535(documentRef = globalThis.document) {
  const canonicalIds = ROUTES_V180.map(route => route.id);
  const registeredIds = routes.map(route => route.id);
  const routeParity = canonicalIds.length === registeredIds.length
    && canonicalIds.every((id, index) => id === registeredIds[index]);
  const screenIds = documentRef
    ? [...documentRef.querySelectorAll?.('#app > .screen[id]') || []].map(screen => screen.id)
    : [];
  const missingScreens = registeredIds.filter(id => !screenIds.includes(id));
  let commercialTruth = false;
  try { commercialTruth = assertCommercialTruthV200() === true; } catch {}
  return Object.freeze({
    release:'V535',
    routeParity,
    routeCount:registeredIds.length,
    missingScreens:Object.freeze(missingScreens),
    commercialTruth,
    oneCanonicalOrb:documentRef ? documentRef.querySelectorAll?.('#orb').length === 1 : null,
    productionLocked:WORLD_TRUTH_V535.gates.productionPublish === false,
    valid:routeParity && registeredIds.length === 17 && commercialTruth && missingScreens.length === 0
  });
}

export function createWorldTruthRegistryV535() {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const api = Object.freeze({
    version:VERSION,
    registry:WORLD_TRUTH_V535,
    route:worldForRouteV535,
    signature:worldSignatureV535,
    audit:() => auditWorldTruthV535(),
    status:() => Object.freeze({
      release:'V535',
      macroStage:'1-of-14',
      routeCount:routes.length,
      activeRoute:normalizeWorldRouteV535(document.body?.dataset?.screen || location.hash || 'home'),
      valid:auditWorldTruthV535().valid,
      openDecisionCount:WORLD_TRUTH_V535.openDecisions.length,
      oneCanonicalOrb:true,
      permanentAnimationLoops:0,
      privateContentReads:0,
      apiCalls:0,
      ...WORLD_TRUTH_V535.gates
    })
  });
  globalThis[INSTANCE] = api;
  document.documentElement.dataset.worldTruth = 'v535';
  document.dispatchEvent(new CustomEvent('divina:world-truth-ready', {
    detail:Object.freeze({ version:VERSION, routes:routes.length, valid:api.audit().valid })
  }));
  return api;
}

export default WORLD_TRUTH_V535;
