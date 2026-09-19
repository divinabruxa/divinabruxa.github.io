/* DIVINA BRUXA — WORK13 · COSMOS VIVO · MACROETAPA 8 · V608
   Consultas, Loja, Premium e Conta passam a chegar por uma decisao clara.
   Os motores V558, V543, V191 e V201 continuam como autoridades funcionais;
   esta camada organiza somente a revelacao, sem conceder direitos, cobrar,
   enviar e-mail, ler formularios ou criar outra Orbe. */

const VERSION = 608;
const INSTANCE = Symbol.for('divina.work13.living.commerce.path.v608');
const ROUTES = Object.freeze(['consultations','store','subscriptions','login']);
const ROUTE_SET = new Set(ROUTES);
const READING_ROUTES = new Set(['tarot','daily','spreads']);

const APP_BY_ROUTE = Object.freeze({
  consultations:'consultationApp',
  store:'storeApp',
  subscriptions:'subscriptionApp'
});

const SIGILS = Object.freeze({
  consultations:'☾',
  store:'◇',
  subscriptions:'♢'
});

export const LIVING_COMMERCE_PATH_CONTRACT_V608 = Object.freeze({
  version:VERSION,
  base:'V607-living-wisdom-on-WORK12-V600-frozen-by-V601',
  work:'WORK13',
  macroStage:'8-of-10',
  title:'Clareza Viva — Consultas, Loja, Premium e Conta',
  law:'one-orb-one-universe-one-presence-one-journey',
  worlds:ROUTES,
  sequence:Object.freeze([
    'one-clear-entry','explicit-choice','existing-engine','one-natural-next-step'
  ]),
  contextModel:'V602-public-route-metadata-only',
  consultations:Object.freeze({
    engine:'V558',
    entry:'one-human-reading-step',
    choicesAfterExplicitRequest:4,
    priceCents:Object.freeze([25000,20000,15000,5000]),
    contact:'orbedasrealidades@hotmail.com',
    automaticEmail:false,
    automaticBilling:false
  }),
  store:Object.freeze({
    engine:'V543',
    entry:'one-intention-step',
    intentionsAfterExplicitRequest:4,
    productsPreserved:21,
    associateTag:'orbedasrealid-20',
    checkout:'external-amazon-only',
    mutablePriceClaims:0
  }),
  premium:Object.freeze({
    engine:'V191',
    entry:'one-recommended-section',
    sections:Object.freeze(['premium','ai','access']),
    premiumLifetimeCents:19990,
    aiMonthlyCents:8990,
    aiCreditsPerCycle:400,
    extraCreditPacks:Object.freeze([[200,3990],[600,9990],[1500,19990]]),
    environment:'staging',
    realBilling:false,
    frontendEntitlementGrants:false
  }),
  account:Object.freeze({
    engine:'V201',
    existingGuideReused:'AccountWorldV319',
    guestEntry:'login-first',
    authenticatedEntry:'continuity-first',
    criticalSecurityFlowsImmediate:true,
    journalCloudConsentDefault:false,
    serverAuthority:true
  }),
  maximumPrimaryActionsAtEntry:1,
  utilityActionException:'consultation-protocol-tracking-only',
  automaticNavigation:false,
  automaticWhitSpeech:false,
  whitTimingAuthority:'V606-unchanged',
  existingEnginesPreserved:Object.freeze({
    consultations:'V558', store:'V543', premium:'V191', account:'V201'
  }),
  privateContentReads:0,
  formValueReads:0,
  consultationBodyReads:0,
  consultationProtocolReads:0,
  accountProfileReads:0,
  purchaseBodyReads:0,
  searchQueryReads:0,
  emotionInference:false,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  deferredTimers:0,
  mutationObservers:0,
  maximumNewGuideSurfaces:3,
  iphoneFirst:true,
  reducedMotionPreservesMeaning:true
});

const cleanRoute = value => {
  const route = String(value || '').trim().toLowerCase().replace(/^#/,'').split(/[?&/]/)[0];
  return route || 'home';
};

export const normalizeCommerceRouteV608 = value => cleanRoute(value);

const publicContext = value => {
  const context = value && typeof value === 'object' ? value : {};
  return Object.freeze({
    route:cleanRoute(context.route),
    previousRoute:cleanRoute(context.returnRoute || context.previousRoute || '')
  });
};

export function recommendedPremiumSectionV608(context = {}, authenticated = false) {
  const snapshot = publicContext(context);
  if (snapshot.previousRoute === 'ai') return 'ai';
  if (authenticated) return 'access';
  return 'premium';
}

export function commerceEntryCopyV608(route, context = {}, authenticated = false) {
  const snapshot = publicContext(context);
  if (route === 'consultations') {
    const fromReading = READING_ROUTES.has(snapshot.previousRoute);
    return Object.freeze({
      eyebrow:'ATENDIMENTO HUMANO · SEM COBRANÇA AGORA',
      title:fromReading ? 'Da leitura simbólica ao cuidado humano.' : 'Uma consulta por vez.',
      copy:fromReading
        ? 'Você veio de uma leitura. Aqui, escolha somente o tipo de acolhimento que deseja; o pedido é revisado antes de qualquer confirmação.'
        : 'Primeiro escolha o tipo de leitura. Depois indique preferência, dados essenciais e revise tudo antes de registrar.',
      primary:'Escolher uma consulta',
      utility:'Já tenho um protocolo',
      facts:Object.freeze(['R$ 50 a R$ 250','confirmação por e-mail','nenhuma cobrança nesta etapa'])
    });
  }
  if (route === 'store') {
    const fromWisdom = ['library','school'].includes(snapshot.previousRoute);
    return Object.freeze({
      eyebrow:'CURADORIA AMAZON · COMPRA EXTERNA',
      title:fromWisdom ? 'Do símbolo para uma escolha concreta.' : 'Comece pela intenção, não pelo catálogo.',
      copy:'A Orbe organiza quatro caminhos. Só depois da sua escolha aparecem produtos, filtros e links para a Amazon.',
      primary:'Escolher uma intenção',
      utility:'',
      facts:Object.freeze(['21 escolhas preservadas','preço e estoque na Amazon','link de afiliado transparente'])
    });
  }
  if (route === 'subscriptions') {
    const section = recommendedPremiumSectionV608(snapshot, authenticated);
    if (section === 'ai') return Object.freeze({
      eyebrow:'DIREITOS CLAROS · STAGING',
      title:'A Orbe IA é uma escolha separada.',
      copy:'São R$ 89,90 por mês com 400 créditos. Premium não inclui IA e nenhuma cobrança real está ativa.',
      primary:'Ver Orbe IA',
      utility:'',
      facts:Object.freeze(['Luna usa 1 crédito','Terra usa 10','Sol continua desligada'])
    });
    if (section === 'access') return Object.freeze({
      eyebrow:'SEUS DIREITOS · AUTORIDADE DO SERVIDOR',
      title:'Restaure antes de escolher de novo.',
      copy:'A conta está presente. Veja acessos e recibos do STAGING sem conceder benefício pelo navegador.',
      primary:'Ver meus acessos',
      utility:'',
      facts:Object.freeze(['servidor confirma direitos','cobrança real desligada','restauração reversível'])
    });
    return Object.freeze({
      eyebrow:'PREMIUM · VALOR SEM CONFUSÃO',
      title:'Jornada completa ou IA, sem misturar.',
      copy:'Premium custa R$ 199,90 uma vez. A Orbe IA custa R$ 89,90 por mês e continua separada.',
      primary:'Entender o Premium',
      utility:'',
      facts:Object.freeze(['Premium vitalício','30 skins incluídas','IA não incluída'])
    });
  }
  return null;
}

const routeNow = (doc, win) => cleanRoute(
  doc?.body?.dataset?.screen
  || doc?.querySelector?.('#app > .screen.active[id],.screen.active[id]')?.id
  || win?.location?.hash
  || 'home'
);

const make = (doc, tag, className = '', text = '') => {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const makeButton = (doc, action, text, className = '') => {
  const node = make(doc, 'button', className, text);
  node.type = 'button';
  node.dataset.v608Action = action;
  return node;
};

const emit = (doc, type, detail) => {
  const EventCtor = doc?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!doc?.dispatchEvent || typeof EventCtor !== 'function') return false;
  doc.dispatchEvent(new EventCtor(type, { detail:Object.freeze(detail) }));
  return true;
};

export class LivingCommercePathV608 {
  constructor({
    contextMemory = globalThis.divinaCosmosContextMemoryV602,
    chambers = globalThis.divinaRealityChambersV596,
    account = globalThis.divinaAccount,
    documentTarget = globalThis.document,
    windowTarget = globalThis
  } = {}) {
    this.version = VERSION;
    this.contextMemory = contextMemory || null;
    this.chambers = chambers || null;
    this.account = account || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.documentElement = this.documentTarget?.documentElement || null;
    this.abort = new AbortController();
    this.destroyed = false;
    this.route = routeNow(this.documentTarget, this.windowTarget);
    this.context = this.readContext();
    this.authenticated = Boolean(this.account?.user);
    this.nodesCreated = 0;
    this.entryActions = 0;
    this.explicitSectionChanges = 0;
    this.protocolTrackingOpens = 0;
    this.contextUpdates = 0;

    this.installIdentity();
    this.bind();
    this.decorateAll();
    this.enterRoute(this.route, 'boot');
    emit(this.documentTarget, 'divina:living-commerce-ready', this.publicStatus());
  }

  readContext() {
    try { return publicContext(this.contextMemory?.snapshot?.() || { route:this.route }); }
    catch { return publicContext({ route:this.route }); }
  }

  installIdentity() {
    if (!this.documentElement?.dataset) return false;
    this.documentElement.dataset.work13 = 'cosmos-vivo';
    this.documentElement.dataset.work13Macro = '8-commerce-clarity-path';
    this.documentElement.dataset.livingCommercePath = 'v608';
    this.documentElement.dataset.livingCommercePrivacy = 'public-route-and-auth-boolean-only';
    return true;
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  frame(callback) {
    if (typeof this.windowTarget?.requestAnimationFrame === 'function') {
      this.windowTarget.requestAnimationFrame(callback);
      return true;
    }
    callback();
    return false;
  }

  twoFrames(callback) {
    this.frame(() => this.frame(callback));
  }

  bind() {
    const doc = this.documentTarget;
    const win = this.windowTarget;
    this.listen(doc, 'click', event => this.onClick(event), { capture:true });
    this.listen(doc, 'divina:context-memory-updated', event => this.onContext(event));
    this.listen(doc, 'divina:reality-chamber-state', event => this.onChamberState(event));
    ['divina:route-ready','divina:page-ready'].forEach(type =>
      this.listen(doc, type, event => this.onRoute(event))
    );
    [
      'divina:consultations-world-ready','divina:store-world-ready',
      'divina:premium-world-ready','divina:account-world-ready'
    ].forEach(type => this.listen(doc, type, () => this.decorateAll()));
    ['divina:auth-state','divina:billing-updated','divina:account-sync-applied'].forEach(type =>
      this.listen(win, type, event => this.onAccountState(event))
    );
    this.listen(win, 'hashchange', () => this.onRoute({ detail:{ id:routeNow(doc, win) } }));
  }

  screen(route) {
    return this.documentTarget?.getElementById?.(route) || null;
  }

  decorateAll() {
    ['consultations','store','subscriptions'].forEach(route => this.ensureGuide(route));
    this.ensureAccount();
  }

  ensureGuide(route) {
    const screen = this.screen(route);
    const app = this.documentTarget?.getElementById?.(APP_BY_ROUTE[route]);
    if (!screen || !app) return null;
    screen.dataset.v608Commerce = 'v608';
    let guide = screen.querySelector?.(`:scope > [data-v608-surface="${route}"]`);
    if (!guide) {
      guide = make(this.documentTarget, 'section', 'db608-commerce-guide');
      guide.dataset.v608Surface = route;
      guide.dataset.v608Phase = 'guide';
      guide.setAttribute('aria-labelledby', `db608-${route}-title`);

      const seal = make(this.documentTarget, 'span', 'db608-commerce-guide__seal', SIGILS[route]);
      seal.setAttribute('aria-hidden', 'true');
      const copy = make(this.documentTarget, 'div', 'db608-commerce-guide__copy');
      const eyebrow = make(this.documentTarget, 'p', 'eyebrow');
      eyebrow.dataset.v608Eyebrow = 'true';
      const title = make(this.documentTarget, 'h3');
      title.id = `db608-${route}-title`;
      title.dataset.v608Title = 'true';
      const description = make(this.documentTarget, 'p');
      description.dataset.v608Copy = 'true';
      const facts = make(this.documentTarget, 'ul', 'db608-commerce-guide__facts');
      facts.dataset.v608Facts = 'true';
      copy.append(eyebrow, title, description, facts);

      const actions = make(this.documentTarget, 'div', 'db608-commerce-guide__actions');
      const action = route === 'consultations'
        ? 'consultations-start'
        : route === 'store' ? 'store-start' : 'subscriptions-primary';
      const primary = makeButton(this.documentTarget, action, '', 'db608-primary');
      primary.dataset.v608Primary = 'true';
      const utility = makeButton(this.documentTarget, 'consultations-track', '', 'db608-utility');
      utility.dataset.v608Utility = 'true';
      utility.hidden = route !== 'consultations';
      actions.append(primary, utility);

      const paths = make(this.documentTarget, 'nav', 'db608-commerce-paths');
      paths.dataset.v608Paths = 'true';
      paths.setAttribute('aria-label', 'Escolhas de direitos e acessos');
      paths.hidden = true;
      if (route === 'subscriptions') {
        paths.append(
          makeButton(this.documentTarget, 'subscriptions-premium', 'Premium'),
          makeButton(this.documentTarget, 'subscriptions-ai', 'Orbe IA'),
          makeButton(this.documentTarget, 'subscriptions-access', 'Acessos')
        );
      }

      guide.append(seal, copy, actions, paths);
      screen.insertBefore?.(guide, app);
      this.nodesCreated += 1;
    }
    this.updateGuide(route);
    return guide;
  }

  ensureAccount() {
    const screen = this.screen('login');
    if (!screen) return null;
    screen.dataset.v608Commerce = 'v608';
    screen.dataset.v608Auth = this.authenticated ? 'authenticated' : 'guest';
    if (!screen.dataset.v608CommerceMode) screen.dataset.v608CommerceMode = this.accountNeedsDirectFlow() ? 'direct' : 'guide';
    return screen.querySelector?.('#accountWorldV319') || null;
  }

  accountNeedsDirectFlow() {
    const mode = String(this.account?.mode || '');
    return ['reset','verify'].includes(mode) || Boolean(this.account?.criticalState);
  }

  updateGuide(route) {
    const guide = this.screen(route)?.querySelector?.(`:scope > [data-v608-surface="${route}"]`);
    const copy = commerceEntryCopyV608(route, this.context, this.authenticated);
    if (!guide || !copy) return false;
    const values = [
      ['[data-v608-eyebrow]', copy.eyebrow],
      ['[data-v608-title]', copy.title],
      ['[data-v608-copy]', copy.copy],
      ['[data-v608-primary]', copy.primary],
      ['[data-v608-utility]', copy.utility]
    ];
    values.forEach(([selector,value]) => {
      const node = guide.querySelector?.(selector);
      if (node) node.textContent = value || '';
    });
    const utility = guide.querySelector?.('[data-v608-utility]');
    if (utility) utility.hidden = !copy.utility;
    const facts = guide.querySelector?.('[data-v608-facts]');
    if (facts) {
      facts.replaceChildren?.(...copy.facts.map(value => make(this.documentTarget, 'li', '', value)));
    }
    this.updateGuidePhase(route);
    return true;
  }

  updateGuidePhase(route) {
    const screen = this.screen(route);
    const guide = screen?.querySelector?.(`:scope > [data-v608-surface="${route}"]`);
    if (!guide) return false;
    const mode = screen.dataset.v608CommerceMode || 'guide';
    guide.dataset.v608Phase = mode;
    if (route === 'subscriptions') {
      const section = screen.dataset.v608PremiumSection || recommendedPremiumSectionV608(this.context, this.authenticated);
      const paths = guide.querySelector?.('[data-v608-paths]');
      if (paths) paths.hidden = mode !== 'detail';
      paths?.querySelectorAll?.('[data-v608-action^="subscriptions-"]').forEach(button => {
        const selected = button.dataset.v608Action === `subscriptions-${section}`;
        button.setAttribute('aria-pressed', String(selected));
      });
    }
    return true;
  }

  setMode(route, mode, reason = 'explicit') {
    const screen = this.screen(route);
    if (!screen?.dataset) return false;
    screen.dataset.v608Commerce = 'v608';
    screen.dataset.v608CommerceMode = mode;
    screen.dataset.v608CommerceReason = reason;
    this.updateGuidePhase(route);
    emit(this.documentTarget, 'divina:living-commerce-state', {
      version:VERSION,
      route,
      mode,
      reason,
      automaticNavigation:false,
      automaticWhitSpeech:false
    });
    return true;
  }

  setPremiumSection(section, reason = 'explicit') {
    const screen = this.screen('subscriptions');
    if (!screen?.dataset || !['premium','ai','access'].includes(section)) return false;
    screen.dataset.v608PremiumSection = section;
    this.setMode('subscriptions', 'detail', reason);
    this.explicitSectionChanges += 1;
    this.twoFrames(() => {
      const selector = {
        premium:'.premium-v191-hero',
        ai:'.premium-v191-ai',
        access:'.premium-v191-lifecycle'
      }[section];
      this.documentTarget?.querySelector?.(`#subscriptionApp ${selector}`)?.scrollIntoView?.({ behavior:'auto', block:'start' });
    });
    return true;
  }

  enterRoute(route, reason = 'route') {
    if (!ROUTE_SET.has(route)) return false;
    this.decorateAll();
    if (route === 'consultations' || route === 'store') {
      this.setMode(route, 'guide', reason);
      return true;
    }
    if (route === 'subscriptions') {
      const section = recommendedPremiumSectionV608(this.context, this.authenticated);
      const screen = this.screen(route);
      if (screen?.dataset) screen.dataset.v608PremiumSection = section;
      this.setMode(route, 'guide', reason);
      this.updateGuide(route);
      return true;
    }
    this.ensureAccount();
    this.setMode('login', this.accountNeedsDirectFlow() ? 'direct' : 'guide', reason);
    return true;
  }

  onContext(event) {
    this.context = publicContext(event?.detail?.context || this.readContext());
    this.contextUpdates += 1;
    ['consultations','store','subscriptions'].forEach(route => this.updateGuide(route));
  }

  onRoute(event) {
    const next = cleanRoute(event?.detail?.id || event?.detail?.route || event?.detail?.to || routeNow(this.documentTarget, this.windowTarget));
    const changed = next !== this.route;
    this.route = next;
    this.context = this.readContext();
    if (changed) this.enterRoute(next, 'route-entry');
    else if (ROUTE_SET.has(next)) this.decorateAll();
  }

  onAccountState(event) {
    const detail = event?.detail;
    const eventName = String(detail?.event || '');
    if (eventName === 'SIGNED_OUT') this.authenticated = false;
    else if (detail?.session) this.authenticated = true;
    else this.authenticated = Boolean(this.account?.user);
    const login = this.screen('login');
    if (login?.dataset) login.dataset.v608Auth = this.authenticated ? 'authenticated' : 'guest';
    this.ensureAccount();
    this.updateGuide('subscriptions');
  }

  onChamberState(event) {
    const route = cleanRoute(event?.detail?.route);
    if (!['consultations','store'].includes(route)) return false;
    const state = String(event?.detail?.state || '').toLowerCase();
    const mode = String(event?.detail?.mode || '').toLowerCase();
    const reason = String(event?.detail?.reason || '').toLowerCase();
    if (['threshold','awakening','travel'].includes(state)) return this.setMode(route, 'guide', `chamber-${state}`);
    if (state === 'engaged') return this.setMode(route, route === 'store' ? 'catalog' : (mode || 'request'), `chamber-${mode || 'engaged'}`);
    if (state !== 'present') return false;
    if (route === 'consultations' && (reason.includes('consultation-choice') || reason.includes('v608-consultation'))) {
      return this.setMode(route, 'choices', 'consultation-choice');
    }
    if (route === 'store' && (reason.includes('store-intentions') || reason.includes('v608-store'))) {
      return this.setMode(route, 'intentions', 'store-intentions');
    }
    return this.setMode(route, 'guide', 'chamber-present');
  }

  onClick(event) {
    const actionNode = event.target?.closest?.('[data-v608-action]');
    if (actionNode) {
      const action = String(actionNode.dataset.v608Action || '');
      if (action === 'consultations-start') {
        this.entryActions += 1;
        this.setMode('consultations', 'choices', 'explicit-consultation-entry');
        this.chambers?.setState?.('consultations', 'present', 'choice', 'v608-consultation-choice');
        this.twoFrames(() => this.documentTarget?.getElementById?.('consultationApp')?.scrollIntoView?.({ behavior:'auto', block:'start' }));
        return;
      }
      if (action === 'consultations-track') {
        this.protocolTrackingOpens += 1;
        this.setMode('consultations', 'tracking', 'explicit-protocol-tracking');
        this.documentTarget?.querySelector?.('#consultationApp [data-open-tracking]')?.click?.();
        return;
      }
      if (action === 'store-start') {
        this.entryActions += 1;
        this.setMode('store', 'intentions', 'explicit-store-entry');
        this.chambers?.setState?.('store', 'present', 'choice', 'v608-store-intentions');
        this.twoFrames(() => this.documentTarget?.querySelector?.('#storeApp #amazonStoreCoreV543')?.scrollIntoView?.({ behavior:'auto', block:'start' }));
        return;
      }
      if (action === 'subscriptions-primary') {
        this.entryActions += 1;
        this.setPremiumSection(recommendedPremiumSectionV608(this.context, this.authenticated), 'explicit-premium-entry');
        return;
      }
      if (action.startsWith('subscriptions-')) {
        this.setPremiumSection(action.replace('subscriptions-',''), 'explicit-premium-section');
      }
      return;
    }

    if (event.target?.closest?.('#login [data-acw319-main]')) {
      this.entryActions += 1;
      this.setMode('login', 'detail', this.authenticated ? 'explicit-account-continuity' : 'explicit-account-login');
      return;
    }
    if (event.target?.closest?.('#consultationApp [data-service]')) this.setMode('consultations', 'request', 'service-selected');
    if (event.target?.closest?.('#storeApp [data-collection]')) this.setMode('store', 'catalog', 'intention-selected');
  }

  publicStatus() {
    return Object.freeze({
      version:VERSION,
      route:this.route,
      authenticated:Boolean(this.authenticated),
      worlds:ROUTES,
      entryActions:this.entryActions,
      explicitSectionChanges:this.explicitSectionChanges,
      protocolTrackingOpens:this.protocolTrackingOpens,
      contextUpdates:this.contextUpdates,
      automaticNavigation:false,
      automaticWhitSpeech:false,
      privateContentReads:0
    });
  }

  status() {
    const modes = Object.freeze(Object.fromEntries(ROUTES.map(route => [
      route,
      this.screen(route)?.dataset?.v608CommerceMode || 'unmounted'
    ])));
    return Object.freeze({
      ...LIVING_COMMERCE_PATH_CONTRACT_V608,
      ...this.publicStatus(),
      modes,
      nodesCreated:this.nodesCreated,
      accountGuideReused:Boolean(this.screen('login')?.querySelector?.('#accountWorldV319'))
    });
  }

  audit() {
    const doc = this.documentTarget;
    const surfaces = Object.freeze(Object.fromEntries(['consultations','store','subscriptions'].map(route => [
      route,
      this.screen(route)?.querySelectorAll?.(`:scope > [data-v608-surface="${route}"]`)?.length || 0
    ])));
    return Object.freeze({
      release:'V608',
      surfaces,
      maximumPrimaryActionsAtEntry:1,
      existingAccountGuideReused:true,
      duplicateSurfaces:Object.values(surfaces).some(count => count > 1),
      oneCanonicalOrb:doc?.querySelectorAll?.('#orb')?.length === 1,
      oneCanonicalCanvas:doc?.querySelectorAll?.('#orbCanvas')?.length === 1,
      newCanvases:0,
      newRenderers:0,
      permanentAnimationLoops:0,
      mutationObservers:0,
      deferredTimers:0,
      storageReads:0,
      storageWrites:0,
      networkCalls:0,
      privateContentReads:0,
      realBilling:false
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort.abort();
    this.documentTarget?.querySelectorAll?.('[data-v608-surface]')?.forEach?.(node => node.remove?.());
    ROUTES.forEach(route => {
      const screen = this.screen(route);
      if (!screen?.dataset) return;
      delete screen.dataset.v608Commerce;
      delete screen.dataset.v608CommerceMode;
      delete screen.dataset.v608CommerceReason;
      delete screen.dataset.v608PremiumSection;
      delete screen.dataset.v608Auth;
    });
    if (this.documentElement?.dataset?.livingCommercePath === 'v608') {
      delete this.documentElement.dataset.livingCommercePath;
      delete this.documentElement.dataset.livingCommercePrivacy;
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaLivingCommercePathV608 === this) delete globalThis.divinaLivingCommercePathV608;
    return true;
  }
}

export function createLivingCommercePathV608(options = {}) {
  const existing = globalThis[INSTANCE];
  if (existing?.version === VERSION && !existing.destroyed) return existing;
  existing?.destroy?.();
  const path = new LivingCommercePathV608(options);
  globalThis[INSTANCE] = path;
  globalThis.divinaLivingCommercePathV608 = path;
  return path;
}

export default createLivingCommercePathV608;
