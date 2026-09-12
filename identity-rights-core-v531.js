/* DIVINA BRUXA — MACROETAPA 7/10 · IDENTIDADE, DIREITOS E PERSONALIZAÇÃO V531
   Conta, Premium, Skins e Notificações formam quatro mundos conectados pela
   mesma Orbe V501. Esta camada não recria autenticação, billing, entitlements,
   catálogo de skins ou consentimento e não lê conteúdo privado. */

import { COMMERCIAL_TRUTH_V200 } from './commercial-truth-v200.js?v=200';
import { SKIN_REGISTRY_V12 } from './skin-registry-v12.js?v=12';

const RELEASE = 'V531';
const STYLE_ID = 'divinaIdentityRightsV531Styles';
const MARK = Symbol.for('divina.identity.rights.core.v531');
const ROUTES = Object.freeze(['login', 'subscriptions', 'skins', 'notifications']);

const PROFILE = Object.freeze({
  login:Object.freeze({
    route:'login', sigil:'◎', eyebrow:'IDENTIDADE PROTEGIDA', title:'Minha Orbe',
    status:'Sessão nesta aba', anchor:'.account-v189-shell',
    panelTitle:'Sua presença continua sem perder o controle.',
    panelCopy:'A Conta conecta aparelhos, restaura escolhas e mantém exportação, saída e exclusão ao seu alcance.',
    facts:Object.freeze([
      ['SESSÃO', 'somente nesta aba'],
      ['DIÁRIO', 'nuvem só por escolha'],
      ['CONTROLE', 'exportar e excluir']
    ]),
    action:Object.freeze({ route:'subscriptions', label:'VER DIREITOS PREMIUM' })
  }),
  subscriptions:Object.freeze({
    route:'subscriptions', sigil:'♢', eyebrow:'DIREITOS TRANSPARENTES', title:'Premium',
    status:'R$ 199,90 · uma vez', anchor:'#subscriptionApp',
    panelTitle:'Valor, acesso e restauração sem confusão.',
    panelCopy:'Premium é vitalício e inclui as 30 skins. A Orbe IA continua separada, com créditos e ciclo próprios.',
    facts:Object.freeze([
      ['PREMIUM', 'R$ 199,90 uma vez'],
      ['ORBE IA', 'R$ 89,90 por mês'],
      ['AUTORIDADE', 'sempre o servidor']
    ]),
    action:Object.freeze({ route:'skins', label:'CONHECER AS 30 SKINS' })
  }),
  skins:Object.freeze({
    route:'skins', sigil:'✦', eyebrow:'FORMA ESCOLHIDA', title:'Skins',
    status:'30 formas cosméticas', anchor:'#skinsApp',
    panelTitle:'Mudar a aparência sem mudar a verdade.',
    panelCopy:'Uma única textura acompanha a Orbe por todos os mundos. Skins nunca alteram cartas, sorte, IA ou acesso.',
    facts:Object.freeze([
      ['FORMAS', '30 no catálogo'],
      ['CLÁSSICA', 'sempre gratuita'],
      ['EFEITO', 'somente cosmético']
    ]),
    action:Object.freeze({ route:'subscriptions', label:'ENTENDER O PREMIUM' })
  }),
  notifications:Object.freeze({
    route:'notifications', sigil:'☾', eyebrow:'PRESENÇA CONSENTIDA', title:'Notificações',
    status:'Opt-in · silêncio 22–08', anchor:'#notificationApp',
    panelTitle:'A Orbe chama apenas quando você permite.',
    panelCopy:'Cada tema é uma escolha. Marketing nasce desligado, o silêncio respeita Brasília e nenhum conteúdo íntimo segmenta avisos.',
    facts:Object.freeze([
      ['CONSENTIMENTO', 'granular e reversível'],
      ['SILÊNCIO', '22h → 08h'],
      ['CONTEÚDO ÍNTIMO', 'nunca segmenta']
    ]),
    action:Object.freeze({ route:'login', label:'ABRIR MINHA ORBE' })
  })
});

const safe = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[character]));
const currentRoute = () => String(document.body?.dataset?.screen || location.hash || '#home')
  .replace(/^#/, '').split(/[?&/]/)[0] || 'home';
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './identity-rights-core-v531.css?v=531';
  document.head.append(link);
}

export function identityRouteProfileV531(route) {
  return PROFILE[String(route || '')] || null;
}

export function assertIdentityRightsContractV531() {
  const premium = COMMERCIAL_TRUTH_V200.plans.find(item => item.productKey === 'premium_lifetime');
  const ai = COMMERCIAL_TRUTH_V200.plans.find(item => item.productKey === 'orbe_ai_monthly');
  if (premium?.priceCents !== 19990 || premium?.billingMode !== 'payment') {
    throw new Error('IDENTITY_PREMIUM_TRUTH_DRIFT');
  }
  if (ai?.priceCents !== 8990 || ai?.creditsPerCycle !== 400 || ai?.billingMode !== 'subscription') {
    throw new Error('IDENTITY_AI_TRUTH_DRIFT');
  }
  if (COMMERCIAL_TRUTH_V200.realBilling || COMMERCIAL_TRUTH_V200.checkoutEnabled) {
    throw new Error('IDENTITY_BILLING_GATE_OPEN');
  }
  if (SKIN_REGISTRY_V12.skins.length !== 30 || SKIN_REGISTRY_V12.fallbackSkin?.id !== 'classic') {
    throw new Error('IDENTITY_SKIN_CATALOG_DRIFT');
  }
  return true;
}

assertIdentityRightsContractV531();

export const IDENTITY_RIGHTS_CONTRACT_V531 = Object.freeze({
  release:RELEASE,
  macroStage:'7/10',
  worlds:ROUTES,
  oneCanonicalOrb:true,
  usesOrbJourneyV525:true,
  usesOrbPresenceV526:true,
  independentOrbEngines:0,
  independentUniverseEngines:0,
  independentAuthEngines:0,
  independentEntitlementEngines:0,
  authAuthority:'AuthClientV201',
  accountAuthority:'AccountEngineV201',
  authSessionStorageOnly:true,
  authLocalStorageTokens:false,
  entitlementAuthority:'server',
  frontendEntitlementGrants:false,
  environment:'staging',
  realBilling:false,
  checkoutEnabled:false,
  premiumLifetimePriceCents:19990,
  premiumIncludesAllSkins:true,
  premiumIncludesAI:false,
  aiMonthlyPriceCents:8990,
  aiCreditsPerCycle:400,
  skinCount:30,
  freeSkin:'classic',
  skinsCosmeticOnly:true,
  oneSkinAuthority:true,
  notificationConsent:'granular-explicit',
  notificationMarketingDefault:false,
  notificationQuietHours:'22:00-08:00 America/Sao_Paulo',
  notificationProviderActive:false,
  notificationAutomaticSend:false,
  privateContentReads:0,
  storageReads:0,
  storageWrites:0,
  extraApiCalls:0,
  permanentAnimationLoops:0,
  touchFramesOnDemandOnly:true
});

export class IdentityRightsCoreV531 {
  constructor({ go, orbCore, orbPresence, universe } = {}) {
    this.go = typeof go === 'function' ? go : id => globalThis.orbe?.go?.(id);
    this.orbCore = orbCore || globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null;
    this.orbPresence = orbPresence || globalThis.divinaOrbUniversalPresenceV526?.engine || null;
    this.universe = universe || globalThis.orbe?.universe || null;
    this.abort = new AbortController();
    this.observer = null;
    this.frame = 0;
    this.pointerFrame = 0;
    this.pointerSample = null;
    installStyle();
    this.bind();
    this.scheduleRefresh();
    document.documentElement.dataset.identityRights = 'v531';
  }

  bind() {
    const { signal } = this.abort;
    [
      'divina:page-ready', 'divina:route-ready', 'divina:supreme-orb-did-navigate',
      'divina:premium-world-ready', 'divina:skins-world-ready',
      'divina:skins-world-changed', 'divina:notifications-world-ready',
      'divina:notifications-world-updated', 'divina:skin-applied', 'divina:skin-changed'
    ].forEach(type => document.addEventListener(type, () => this.scheduleRefresh(), { passive:true, signal }));
    ['divina:auth-state', 'divina:billing-updated'].forEach(type =>
      globalThis.addEventListener?.(type, () => this.scheduleRefresh(), { passive:true, signal })
    );
    document.addEventListener('click', event => this.handleClick(event), { capture:true, signal });
    document.addEventListener('pointerdown', event => this.handlePointer(event, true), { passive:true, signal });
    document.addEventListener('pointermove', event => this.handlePointer(event, false), { passive:true, signal });
    globalThis.addEventListener?.('pageshow', () => this.scheduleRefresh(), { passive:true, signal });

    this.observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList')) this.scheduleRefresh();
    });
    if (document.body) this.observer.observe(document.body, { childList:true, subtree:true });
  }

  handleClick(event) {
    const routeButton = event.target?.closest?.('[data-ir531-route]');
    if (!routeButton) return;
    event.preventDefault();
    this.travel(routeButton.dataset.ir531Route);
  }

  handlePointer(event, pressed) {
    const root = event.target?.closest?.('#login, #subscriptions, #skins, #notifications');
    if (!root || !ROUTES.includes(root.id)) return;
    this.pointerSample = { root, x:event.clientX, y:event.clientY, energy:pressed ? 1 : .5 };
    if (!this.pointerFrame) {
      this.pointerFrame = requestAnimationFrame(() => {
        this.pointerFrame = 0;
        const sample = this.pointerSample;
        this.pointerSample = null;
        if (!sample?.root?.isConnected) return;
        const rect = sample.root.getBoundingClientRect();
        const x = clamp((sample.x - rect.left) / Math.max(1, rect.width) * 100, 0, 100);
        const y = clamp((sample.y - rect.top) / Math.max(1, rect.height) * 100, 0, 100);
        sample.root.style.setProperty('--ir531-touch-x', `${x.toFixed(2)}%`);
        sample.root.style.setProperty('--ir531-touch-y', `${y.toFixed(2)}%`);
        sample.root.style.setProperty('--ir531-touch-energy', String(sample.energy));
      });
    }
    if (pressed) this.orbCore?.pulse?.('identity-touch', { intensity:.44, route:root.id });
  }

  travel(target) {
    if (!ROUTES.includes(target)) return false;
    const from = currentRoute();
    this.orbCore?.pulse?.('identity-path', { intensity:.78, from, target });
    document.dispatchEvent(new CustomEvent('divina:identity-travel-v531', {
      detail:Object.freeze({ from, target, canonicalOrb:'v501', privateContentIncluded:false })
    }));
    try {
      Promise.resolve(this.go(target, { source:'identity-rights-v531', from, target }))
        .catch(() => this.notify('A passagem continua disponível pelo menu da Orbe.'));
    } catch {
      this.notify('A passagem continua disponível pelo menu da Orbe.');
      return false;
    }
    return true;
  }

  scheduleRefresh() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.refresh();
    });
  }

  refresh() {
    ROUTES.forEach(route => {
      this.mountNavigation(route);
      this.mountCovenant(route);
      this.decorate(route);
    });
    this.updateNavigation();
  }

  mountNavigation(route) {
    const root = document.getElementById(route);
    const profile = PROFILE[route];
    if (!root || !profile) return null;
    let nav = root.querySelector(':scope > [data-ir531-nav]');
    if (!nav) {
      nav = document.createElement('section');
      nav.className = 'ir531-nav';
      nav.dataset.ir531Nav = route;
      nav.setAttribute('aria-label', 'Identidade, direitos, personalização e notificações na mesma Orbe');
      nav.innerHTML = `
        <span class="ir531-nav__aura" aria-hidden="true"></span>
        <header class="ir531-nav__head"><span aria-hidden="true">◎</span><div><small>MACROETAPA 7/10 · MESMA ORBE</small><b>Identidade, Direitos e Personalização</b></div><em>V531</em></header>
        <div class="ir531-nav__paths">${ROUTES.map(id => {
          const item = PROFILE[id];
          return `<button type="button" data-ir531-route="${id}" aria-label="Viajar para ${safe(item.title)}"><span aria-hidden="true">${item.sigil}</span><span><small>${safe(item.eyebrow)}</small><b>${safe(item.title)}</b><em>${safe(item.status)}</em></span></button>`;
        }).join('')}</div>
        <p><span aria-hidden="true">◇</span>Você escolhe quem entra, o que recebe, como a Orbe se veste e quando ela pode chamar.</p>`;
      const anchor = root.querySelector(profile.anchor);
      if (anchor) anchor.insertAdjacentElement('beforebegin', nav);
      else root.prepend(nav);
    }
    root.dataset.identityWorld = 'v531';
    return nav;
  }

  mountCovenant(route) {
    const root = document.getElementById(route);
    const profile = PROFILE[route];
    if (!root || !profile) return null;
    let section = root.querySelector(':scope > [data-ir531-covenant]');
    if (section) return section;
    section = document.createElement('section');
    section.className = 'ir531-covenant';
    section.dataset.ir531Covenant = route;
    section.setAttribute('aria-labelledby', `ir531-${route}-title`);
    section.innerHTML = `
      <span class="ir531-covenant__seal" aria-hidden="true">${profile.sigil}</span>
      <div class="ir531-covenant__copy"><p class="eyebrow">${safe(profile.eyebrow)}</p><h3 id="ir531-${route}-title">${safe(profile.panelTitle)}</h3><p>${safe(profile.panelCopy)}</p></div>
      <dl>${profile.facts.map(([term, value]) => `<div><dt>${safe(term)}</dt><dd>${safe(value)}</dd></div>`).join('')}</dl>
      <button type="button" data-ir531-route="${profile.action.route}">${safe(profile.action.label)} <span aria-hidden="true">→</span></button>`;
    const nav = root.querySelector(':scope > [data-ir531-nav]');
    const anchor = root.querySelector(profile.anchor);
    if (nav) nav.insertAdjacentElement('afterend', section);
    else if (anchor) anchor.insertAdjacentElement('beforebegin', section);
    else root.prepend(section);
    return section;
  }

  updateNavigation() {
    const route = currentRoute();
    document.querySelectorAll('[data-ir531-nav]').forEach(nav => {
      nav.querySelectorAll('[data-ir531-route]').forEach(button => {
        const active = button.dataset.ir531Route === route;
        button.classList.toggle('is-current', active);
        button.setAttribute('aria-pressed', String(active));
        if (active) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
    });
  }

  decorate(route) {
    const root = document.getElementById(route);
    if (!root) return;
    const selectors = {
      login:'.account-v189-profile, .account-v189-sync, .account-v189-trust article, .account-v189-security, .account-v189-form',
      subscriptions:'.premium-v191-hero, .premium-v191-ai, .premium-v191-compare, .premium-v191-product, .spw318__plans article',
      skins:'.skins-v191-stage, .skin-v191-card, .skins-v191-premium, .spw318__identity',
      notifications:'.notifications-world-v321, .celestial-permission-card, .celestial-category, .celestial-quiet-fieldset'
    }[route];
    root.querySelectorAll(selectors || '').forEach(surface => {
      surface.dataset.ir531Surface = route;
    });
  }

  notify(message) {
    globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:String(message || '') }));
  }

  contract() {
    return IDENTITY_RIGHTS_CONTRACT_V531;
  }

  audit() {
    const routes = Object.fromEntries(ROUTES.map(route => {
      const root = document.getElementById(route);
      return [route, Object.freeze({
        root:Boolean(root),
        navCount:root?.querySelectorAll?.(':scope > [data-ir531-nav]').length || 0,
        covenantCount:root?.querySelectorAll?.(':scope > [data-ir531-covenant]').length || 0,
        surfaceCount:root?.querySelectorAll?.('[data-ir531-surface]').length || 0
      })];
    }));
    const mountedAllWorlds = Object.values(routes).every(item => item.root && item.navCount === 1 && item.covenantCount === 1);
    return Object.freeze({
      release:RELEASE,
      routes:Object.freeze(routes),
      mountedAllWorlds,
      duplicateNavigation:Object.values(routes).some(item => item.navCount > 1 || item.covenantCount > 1),
      canonicalOrbCount:document.querySelectorAll('[data-supreme-orb="living"]').length,
      skinRegistryCount:SKIN_REGISTRY_V12.skins.length,
      premiumPriceCents:COMMERCIAL_TRUTH_V200.plans.find(item => item.productKey === 'premium_lifetime')?.priceCents || 0,
      aiPriceCents:COMMERCIAL_TRUTH_V200.plans.find(item => item.productKey === 'orbe_ai_monthly')?.priceCents || 0,
      realBilling:COMMERCIAL_TRUTH_V200.realBilling,
      checkoutEnabled:COMMERCIAL_TRUTH_V200.checkoutEnabled,
      privateContentReads:0,
      storageReads:0,
      extraApiCalls:0
    });
  }

  status() {
    const audit = this.audit();
    return Object.freeze({
      ...IDENTITY_RIGHTS_CONTRACT_V531,
      route:currentRoute(),
      ready:audit.mountedAllWorlds && !audit.duplicateNavigation,
      canonicalOrbCount:audit.canonicalOrbCount,
      usesOrbPresenceV526:Boolean(this.orbPresence),
      usesLivingUniverseV524:Boolean(this.universe),
      audit
    });
  }

  destroy() {
    this.abort.abort();
    this.observer?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
    if (this.pointerFrame) cancelAnimationFrame(this.pointerFrame);
    ROUTES.forEach(route => {
      const root = document.getElementById(route);
      root?.querySelector(':scope > [data-ir531-nav]')?.remove();
      root?.querySelector(':scope > [data-ir531-covenant]')?.remove();
      root?.querySelectorAll('[data-ir531-surface]').forEach(surface => delete surface.dataset.ir531Surface);
      if (root) delete root.dataset.identityWorld;
    });
    delete document.documentElement.dataset.identityRights;
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export function createIdentityRightsCoreV531(options = {}) {
  const existing = globalThis[MARK];
  if (existing) return existing;
  const core = new IdentityRightsCoreV531(options);
  try {
    Object.defineProperty(globalThis, MARK, { value:core, configurable:true });
  } catch {
    globalThis[MARK] = core;
  }
  globalThis.divinaIdentityRightsV531 = core;
  document.dispatchEvent(new CustomEvent('divina:identity-rights-ready-v531', {
    detail:Object.freeze({
      release:RELEASE,
      macroStage:'7/10',
      worlds:ROUTES,
      canonicalOrb:'v501',
      realBilling:false,
      privateContentIncluded:false
    })
  }));
  return core;
}
