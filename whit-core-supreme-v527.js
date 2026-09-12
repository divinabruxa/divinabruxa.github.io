/* DIVINA BRUXA — WHIT CORE SUPREMA V527 · MACROETAPA 3/10
   Uma consciência de interface original, conectada à única Orbe Suprema.

   Esta camada coordena os módulos Whit V212–V316 e os estados da Orbe V501,
   V525 e V526. Ela não cria outra Orbe, não lê campos, não consulta conteúdo
   privado, não chama modelo e não altera cobrança. A antiga Orbe arrastável
   V333 é aposentada: Whit passa a existir como estado da Orbe canônica.
*/

const VERSION = 527;
const RELEASE = 'V527';
const MARK = Symbol.for('divina.whit.core.supreme.v527');
const ROOT_ID = 'whitCoreSupremeV527';
const STYLE_ID = 'whitCoreSupremeV527Styles';
const STYLE_HREF = './whit-core-supreme-v527.css?v=527';
const RETIRED_ORBIT_MARK = Symbol.for('divina.whit.orbit.v333');
const SURFACE_SELECTOR = '[data-supreme-orb="living"],[data-orb-presence-v526="true"],[data-orb-projection-v501="true"]';
const HOLD_MS = 620;
const AUTO_ROUTES_OFF = new Set(['home','tarot']);
const STATES = new Set(['resting','aware','traveling','consent','reflecting','answering']);

export const WHIT_CORE_SUPREME_CONTRACT_V527 = Object.freeze({
  identity:Object.freeze({
    name:'Whit',
    role:'presença simbólica original da Divina Bruxa',
    fictionalPersona:true,
    realPerson:false,
    literalWhitneyIdentity:false,
    voiceClone:false,
    soulClaim:false
  }),
  values:Object.freeze(['amor','verdade','consentimento','responsabilidade','autonomia']),
  architecture:Object.freeze({
    canonicalOrb:'V501',
    spatialJourney:'V525',
    universalPresence:'V526',
    independentOrb:false,
    draggableWhitOrb:false,
    newRenderingEngine:false,
    permanentAnimationLoop:false
  }),
  privacy:Object.freeze({
    publicRouteAwarenessOnly:true,
    formFieldReads:false,
    silentPrivateReads:false,
    journalBodyReads:false,
    tarotBodyReads:false,
    lessonBodyReads:false,
    exactContextConsentStillRequired:true,
    persistentPromptStorage:false
  }),
  generation:Object.freeze({
    localGuidance:true,
    modelCallsByThisLayer:0,
    extraApiCalls:0,
    existingBridge:'V313',
    lunaPreserved:true,
    terraPreserved:true,
    solEnabled:false,
    billingChanged:false
  })
});

const WORLDS = Object.freeze({
  home:Object.freeze({ label:'Início', tone:'origin', lines:Object.freeze([
    'A Orbe respira. O próximo caminho só se abre quando você escolher.',
    'O centro não precisa correr. Primeiro presença, depois direção.',
    'Toda realidade começa com uma escolha consciente.'
  ]) }),
  tarot:Object.freeze({ label:'Tarot Livre', tone:'stellar-fire', lines:Object.freeze([
    'Deixe a imagem chegar antes de pedir uma conclusão.',
    'A carta abre uma possibilidade; sua escolha continua livre.',
    'Observe primeiro. O símbolo pode respirar antes de receber um nome.'
  ]) }),
  daily:Object.freeze({ label:'Carta do Dia', tone:'dawn', lines:Object.freeze([
    'Leve esta carta como uma lente para hoje, nunca como uma sentença.',
    'O dia continua aberto. A carta apenas ilumina um detalhe.',
    'Uma pequena percepção pode mudar a qualidade de uma escolha.'
  ]) }),
  spreads:Object.freeze({ label:'Tiragens', tone:'constellation', lines:Object.freeze([
    'Leia a relação entre as posições antes de procurar um veredito.',
    'Separe desejo, medo e realidade; o desenho fica mais nítido.',
    'A tiragem inteira forma sentido onde uma carta isolada não consegue.'
  ]) }),
  school:Object.freeze({ label:'Escola do Tarot', tone:'knowledge', lines:Object.freeze([
    'Uma aula por vez transforma símbolo em linguagem viva.',
    'Estudo não apaga intuição; oferece estrutura para ela amadurecer.',
    'Aprender Tarot é reconhecer relações, não decorar respostas.'
  ]) }),
  library:Object.freeze({ label:'Biblioteca', tone:'archive', lines:Object.freeze([
    'Entre na carta como quem entra numa sala: observe antes de nomear.',
    'Você não precisa decorar 78 cartas para enxergar com profundidade.',
    'O significado cresce quando imagem, contexto e experiência se encontram.'
  ]) }),
  journal:Object.freeze({ label:'Diário e Espelho', tone:'reflection', lines:Object.freeze([
    'Este espaço pertence a você. Eu só entro quando você abrir uma porta exata.',
    'Uma frase honesta pode revelar o que a pressa deixa escondido.',
    'Seu registro não precisa performar para ninguém.'
  ]) }),
  ai:Object.freeze({ label:'Whit · Orbe IA', tone:'mind', lines:Object.freeze([
    'Podemos organizar possibilidades sem fingir certeza sobre o invisível.',
    'Uma resposta cuidadosa amplia sua escolha; não decide sua vida.',
    'Traga a pergunta inteira. Eu respondo com clareza e limites visíveis.'
  ]) }),
  consultations:Object.freeze({ label:'Consultas', tone:'care', lines:Object.freeze([
    'Uma pergunta clara cria espaço para um encontro humano mais profundo.',
    'Nem toda dúvida pede previsão; algumas pedem compreensão.',
    'Tecnologia prepara o caminho, mas não substitui cuidado humano.'
  ]) }),
  store:Object.freeze({ label:'Loja Mística', tone:'choice', lines:Object.freeze([
    'Escolha ferramentas que sustentem sua prática, não promessas instantâneas.',
    'Beleza pode enriquecer um ritual; discernimento continua sendo seu.',
    'O objeto mais valioso é aquele que ganha sentido no uso real.'
  ]) }),
  music:Object.freeze({ label:'Música', tone:'wave', lines:Object.freeze([
    'Algumas emoções precisam de ritmo antes de receberem um nome.',
    'Escute o que muda sua respiração, não apenas o volume.',
    'Uma pausa musical também pode reorganizar pensamento.'
  ]) }),
  videos:Object.freeze({ label:'Vídeos', tone:'light', lines:Object.freeze([
    'Assista como quem investiga, não como quem procura uma verdade pronta.',
    'Uma imagem ensina melhor quando você continua fazendo perguntas.',
    'O conteúdo abre uma porta; atravessá-la continua sendo escolha sua.'
  ]) }),
  skins:Object.freeze({ label:'Skins', tone:'metamorphosis', lines:Object.freeze([
    'A luz muda de roupa; a identidade da Orbe continua inteira.',
    'Uma nova pele renova atmosfera, não promete mudar destino.',
    'Forma e cor podem transformar presença sem fabricar poder.'
  ]) }),
  subscriptions:Object.freeze({ label:'Premium', tone:'crown', lines:Object.freeze([
    'Mais recursos ampliam caminhos; não tornam uma leitura automaticamente melhor.',
    'Valor real aparece no que você consegue usar com continuidade.',
    'A experiência deve explicar o preço sem pressionar sua decisão.'
  ]) }),
  login:Object.freeze({ label:'Conta', tone:'continuity', lines:Object.freeze([
    'Continuidade entre aparelhos não precisa abrir sua intimidade.',
    'Sua Conta organiza acesso; você continua governando memória e consentimento.',
    'Controle também é saber exatamente onde seus dados ficam.'
  ]) }),
  notifications:Object.freeze({ label:'Notificações', tone:'signal', lines:Object.freeze([
    'Um lembrete bom convida; nunca invade.',
    'Silêncio também é uma configuração importante.',
    'Você decide quais sinais merecem chegar e em que horário.'
  ]) }),
  admin:Object.freeze({ label:'Admin', tone:'guard', lines:Object.freeze([
    'Um sistema saudável mede produto sem transformar intimidade em métrica.',
    'Zero verdadeiro é melhor do que um indicador inventado.',
    'Operar com responsabilidade também é saber o que não deve ser coletado.'
  ]) })
});

const ROUTES = new Set(Object.keys(WORLDS));
export const WHIT_CORE_SUPREME_ROUTES_V527 = Object.freeze([...ROUTES]);
const clean = (value, limit = 160) => String(value ?? '')
  .replace(/[\u0000-\u001f\u007f]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, limit);
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

function routeNow() {
  const candidate = clean(
    document.body?.dataset?.screen ||
    document.querySelector('#app > .screen.active[id],.screen.active[id]')?.id ||
    location.hash.replace(/^#/,'') ||
    'home',
    60
  ).toLowerCase();
  return ROUTES.has(candidate) ? candidate : 'home';
}

function emit(type, detail = {}) {
  document.dispatchEvent(new CustomEvent(type, {
    detail:Object.freeze({ release:RELEASE, version:VERSION, ...detail })
  }));
}

function installStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) return existing;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.whitCoreSupremeStyle = 'true';
  document.head.append(link);
  return link;
}

function randomIndex(maximum) {
  if (maximum <= 1) return 0;
  try {
    if (globalThis.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      crypto.getRandomValues(value);
      return value[0] % maximum;
    }
  } catch {}
  return Math.floor(Math.random() * maximum);
}

function componentStatus(component) {
  try { return component?.status?.() || null; }
  catch { return null; }
}

export class WhitCoreSupremeV527 {
  constructor({
    core = globalThis.whit,
    presence = globalThis.divinaWhitV307?.presence,
    nervousSystem = globalThis.divinaWhitV308?.nervousSystem,
    contextBridge = globalThis.divinaWhitV309?.contextBridge,
    memoryGarden = globalThis.divinaWhitV310?.memoryGarden,
    signature = globalThis.divinaWhitV311?.signature,
    mind = globalThis.divinaWhitV312?.mind,
    generationBridge = globalThis.divinaWhitV313?.generationBridge,
    silentPresence = globalThis.divinaWhitV316?.silentPresence,
    orbCore = globalThis.divinaOrbSupremeV501?.core,
    orbPresence = globalThis.divinaOrbUniversalPresenceV526?.engine,
    universe = globalThis.divinaLivingUniverseV524,
    go = globalThis.orbe?.go
  } = {}) {
    this.version = VERSION;
    this.release = RELEASE;
    this.core = core || null;
    this.presence = presence || null;
    this.nervousSystem = nervousSystem || null;
    this.contextBridge = contextBridge || null;
    this.memoryGarden = memoryGarden || null;
    this.signature = signature || null;
    this.mind = mind || null;
    this.generationBridge = generationBridge || null;
    this.silentPresence = silentPresence || null;
    this.orbCore = orbCore || null;
    this.orbPresence = orbPresence || null;
    this.universe = universe || null;
    this.go = typeof go === 'function' ? go : null;
    this.abort = new AbortController();
    this.route = routeNow();
    this.state = document.visibilityState === 'hidden' ? 'resting' : 'aware';
    this.surfaces = new Set();
    this.surfaceSnapshots = new WeakMap();
    this.bags = new Map();
    this.visited = new Set();
    this.visible = false;
    this.expanded = false;
    this.menuOpen = false;
    this.inFlight = false;
    this.lastSurface = null;
    this.hold = null;
    this.suppressAwakeUntil = 0;
    this.hideTimer = 0;
    this.arrivalTimer = 0;
    this.refreshFrame = 0;
    this.destroyed = false;

    this.retireIndependentOrbit();
    installStyles();
    this.mount();
    this.refreshSurfaces();
    this.bind();
    this.observe();
    this.applyRoute(this.route, 'boot', false);

    document.documentElement.dataset.whitSupreme = 'v527';
    document.documentElement.dataset.whitUniversal = 'v527-one-orb';
    emit('whit:supreme-ready', this.status());
  }

  retireIndependentOrbit() {
    try { globalThis.divinaWhitV333?.destroy?.(); } catch {}
    document.getElementById('whitOrbitV333')?.remove();
    document.getElementById('whitOrbitV333Styles')?.remove();
    try { delete globalThis.divinaWhitV333; } catch {}
    try { delete globalThis[RETIRED_ORBIT_MARK]; } catch {}
  }

  mount() {
    document.getElementById(ROOT_ID)?.remove();
    const root = document.createElement('aside');
    root.id = ROOT_ID;
    root.className = 'db527-whit-core';
    root.hidden = true;
    root.setAttribute('aria-hidden','true');
    root.setAttribute('aria-label','Whit, presença da Orbe');
    root.setAttribute('aria-live','polite');
    root.setAttribute('aria-atomic','true');
    root.innerHTML = `
      <span class="db527-whit-core__star" aria-hidden="true">✦</span>
      <div class="db527-whit-core__body">
        <small data-whit-world>WHIT · PRESENÇA DA ORBE</small>
        <p data-whit-copy></p>
        <div class="db527-whit-core__compact-actions">
          <button type="button" data-whit-expand aria-label="Abrir controles da Whit">ABRIR WHIT</button>
          <button type="button" data-whit-close aria-label="Fechar orientação da Whit">×</button>
        </div>
        <div class="db527-whit-core__sheet-actions">
          <button type="button" data-whit-talk>CONVERSAR</button>
          <button type="button" data-whit-privacy aria-expanded="false">O QUE A WHIT VÊ</button>
          <button type="button" data-whit-close>FECHAR</button>
        </div>
        <p class="db527-whit-core__privacy" data-whit-privacy-copy hidden></p>
      </div>`;
    document.body.append(root);
    this.root = root;
    this.copy = root.querySelector('[data-whit-copy]');
    this.world = root.querySelector('[data-whit-world]');
    this.talk = root.querySelector('[data-whit-talk]');
    this.privacy = root.querySelector('[data-whit-privacy-copy]');
    this.privacyButton = root.querySelector('[data-whit-privacy]');
  }

  bind() {
    const { signal } = this.abort;
    const routeEvent = event => this.applyRoute(event.detail?.id || routeNow(), event.type, true);
    document.addEventListener('divina:page-ready', routeEvent, { signal });
    document.addEventListener('divina:route-ready', routeEvent, { signal });

    document.addEventListener('divina:supreme-orb-will-navigate', event => {
      this.inFlight = true;
      this.close(true);
      this.setState('traveling', 'orb-departure');
      if (event.detail?.to) this.route = ROUTES.has(event.detail.to) ? event.detail.to : this.route;
    }, { signal });

    document.addEventListener('divina:supreme-orb-did-navigate', event => {
      this.inFlight = false;
      this.applyRoute(event.detail?.to || routeNow(), 'orb-arrival', true);
    }, { signal });

    document.addEventListener('divina:orb-ios-journey-state', event => {
      const state = clean(event.detail?.state, 30);
      this.inFlight = ['lift','flight','arrival'].includes(state);
      if (this.inFlight) this.syncOverlayVisibility();
      if (state === 'settle') {
        this.inFlight = false;
        this.setState('aware', 'orb-settle');
      }
    }, { signal });

    document.addEventListener('divina:orb-presence-awake', event => {
      if ((performance.now?.() || Date.now()) < this.suppressAwakeUntil) return;
      const route = ROUTES.has(event.detail?.route) ? event.detail.route : routeNow();
      const surface = document.querySelector(`#${route} [data-orb-presence-v526="true"]`);
      this.showGuidance(route, { source:'orb-touch', surface });
    }, { signal });

    document.addEventListener('divina:menu-state', event => {
      const state = clean(event.detail?.state || document.documentElement.dataset.menuState, 30).toLowerCase();
      this.menuOpen = state && state !== 'closed';
      this.syncOverlayVisibility();
    }, { signal });

    addEventListener('whit:consent-required', () => {
      this.setState('consent', 'consent-required');
      this.showMessage('Eu só atravesso esse limite quando você autoriza um contexto exato.', {
        route:routeNow(), source:'consent', expanded:true, duration:0
      });
    }, { signal });

    addEventListener('whit:consent-changed', event => {
      const granted = event.detail?.action === 'granted';
      this.setState('consent', granted ? 'consent-granted' : 'consent-closed');
      this.showMessage(
        granted ? 'Permissão recebida para este único contexto. Todo o restante continua fechado.' : 'Permissão encerrada. O limite voltou a fechar.',
        { route:routeNow(), source:'consent', duration:4200 }
      );
    }, { signal });

    addEventListener('whit:generation-bridge', event => {
      this.setState('reflecting', event.detail?.applied ? 'safe-context-applied' : 'message-forwarded');
      if (routeNow() === 'ai') {
        this.showMessage('Estou refletindo com o contexto que você escolheu e com os limites visíveis.', {
          route:'ai', source:'reflecting', duration:3600
        });
      }
    }, { signal });

    addEventListener('whit:mind-turn-cleared', () => {
      if (this.state === 'reflecting') this.setState('aware', 'turn-cleared');
    }, { signal });

    document.addEventListener('pointerdown', event => this.onPointerDown(event), { capture:true, passive:true, signal });
    document.addEventListener('pointermove', event => this.onPointerMove(event), { capture:true, passive:true, signal });
    document.addEventListener('pointerup', event => this.onPointerEnd(event), { capture:true, passive:true, signal });
    document.addEventListener('pointercancel', event => this.onPointerEnd(event), { capture:true, passive:true, signal });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.visible) {
        event.preventDefault();
        this.close();
        return;
      }
      if (!(event.key === 'Enter' && event.shiftKey)) return;
      const surface = event.target?.closest?.('[data-orb-presence-v526="true"]');
      if (!surface) return;
      event.preventDefault();
      this.openSheet(surface.dataset.route || routeNow(), surface, true);
    }, { signal });

    this.root.addEventListener('click', event => {
      if (event.target.closest('[data-whit-close]')) this.close();
      if (event.target.closest('[data-whit-expand]')) this.expand(true);
      if (event.target.closest('[data-whit-talk]')) this.openConversation();
      if (event.target.closest('[data-whit-privacy]')) this.togglePrivacy();
    }, { signal });

    document.addEventListener('click', event => {
      if (!this.visible || !this.expanded) return;
      if (this.root.contains(event.target) || event.target?.closest?.('[data-orb-presence-v526="true"]')) return;
      this.close();
    }, { signal });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.close(true);
        this.setState('resting', 'hidden');
      } else this.setState('aware', 'visible');
    }, { signal });
    addEventListener('pagehide', () => this.close(true), { signal });
  }

  observe() {
    this.domObserver = new MutationObserver(records => {
      if (!records.some(record => record.type === 'childList')) return;
      cancelAnimationFrame(this.refreshFrame);
      this.refreshFrame = requestAnimationFrame(() => {
        this.refreshFrame = 0;
        this.refreshSurfaces();
      });
    });
    this.domObserver.observe(document.body, { childList:true, subtree:true });

    this.stateObserver = new MutationObserver(records => {
      if (!records.some(record => record.attributeName === 'data-whit-silent-state')) return;
      const silent = document.documentElement.dataset.whitSilentState;
      if (silent === 'reflecting') this.setState('reflecting', 'silent-presence');
      if (silent === 'answering') this.setState('answering', 'answer-arrival');
      if (silent === 'resting' && routeNow() === 'ai' && ['reflecting','answering'].includes(this.state)) {
        this.setState('aware', 'answer-settled');
      }
    });
    this.stateObserver.observe(document.documentElement, {
      attributes:true,
      attributeFilter:['data-whit-silent-state']
    });
  }

  refreshSurfaces() {
    if (this.destroyed) return [];
    document.querySelectorAll(SURFACE_SELECTOR).forEach(surface => {
      if (surface.closest?.(`#${ROOT_ID},#whitOrbitV333`)) return;
      if (!this.surfaceSnapshots.has(surface)) {
        this.surfaceSnapshots.set(surface, {
          description:surface.getAttribute('aria-description'),
          label:surface.getAttribute('aria-label'),
          coreSurface:surface.dataset.whitCoreSurface,
          state:surface.dataset.whitState
        });
      }
      surface.dataset.whitCoreSurface = 'v527';
      surface.dataset.whitState = this.state;
      if (surface.matches('[data-orb-presence-v526="true"]')) {
        const baseLabel = clean(this.surfaceSnapshots.get(surface)?.label || 'Orbe das Realidades', 180);
        surface.setAttribute(
          'aria-label',
          `${baseLabel.replace(/\s*Mantenha pressionado.*$/i,'')} Mantenha pressionado para abrir a Whit.`
        );
        surface.setAttribute(
          'aria-description',
          'Toque para receber uma orientação local da Whit. Use Shift mais Enter ou mantenha pressionado para abrir os controles.'
        );
      }
      this.surfaces.add(surface);
    });
    for (const surface of this.surfaces) {
      if (!surface.isConnected) this.surfaces.delete(surface);
    }
    document.documentElement.dataset.whitOrbSurfaces = String(this.surfaces.size);
    return [...this.surfaces];
  }

  applyRoute(rawRoute, reason = 'route', offer = true) {
    const route = clean(rawRoute || routeNow(), 60).toLowerCase();
    const next = ROUTES.has(route) ? route : 'home';
    const changed = next !== this.route;
    this.route = next;
    document.documentElement.dataset.whitSupremeRoute = this.route;
    this.setState(document.visibilityState === 'hidden' ? 'resting' : 'aware', reason);
    this.refreshSurfaces();
    if (changed) {
      this.close(true);
      clearTimeout(this.arrivalTimer);
      this.arrivalTimer = 0;
    }

    if (offer && !AUTO_ROUTES_OFF.has(this.route) && !this.visited.has(this.route) && !this.arrivalTimer) {
      const expected = this.route;
      this.arrivalTimer = setTimeout(() => {
        this.arrivalTimer = 0;
        if (routeNow() !== expected || this.menuOpen || this.inFlight) return;
        this.visited.add(expected);
        this.showGuidance(expected, { source:'arrival' });
      }, reducedMotion() ? 120 : 820);
    }

    emit('whit:supreme-route', {
      route:this.route,
      reason:clean(reason, 60),
      publicRouteOnly:true,
      privateContentRead:false
    });
    return this.route;
  }

  setState(rawState, reason = 'state') {
    if (this.destroyed) return this.state;
    const next = STATES.has(rawState) ? rawState : 'aware';
    this.state = next;
    document.documentElement.dataset.whitSupremeState = next;
    if (this.root) this.root.dataset.state = next;
    for (const surface of this.surfaces) surface.dataset.whitState = next;
    emit('whit:supreme-state', {
      state:next,
      reason:clean(reason, 60),
      route:this.route,
      messageIncluded:false
    });
    return next;
  }

  bag(route) {
    const world = WORLDS[route] || WORLDS.home;
    let bag = this.bags.get(route);
    if (!bag?.length) {
      bag = world.lines.map((_, index) => index);
      for (let index=bag.length-1; index>0; index-=1) {
        const other = randomIndex(index + 1);
        [bag[index], bag[other]] = [bag[other], bag[index]];
      }
      this.bags.set(route, bag);
    }
    return bag;
  }

  guidance(route = routeNow()) {
    const normalized = ROUTES.has(route) ? route : 'home';
    const world = WORLDS[normalized];
    const index = this.bag(normalized).shift();
    return Object.freeze({
      route:normalized,
      label:world.label,
      tone:world.tone,
      phrase:world.lines[index],
      local:true,
      modelCalls:0,
      privateContentRead:false
    });
  }

  showGuidance(route = routeNow(), { source = 'local', surface = null, expanded = false } = {}) {
    const guidance = this.guidance(route);
    this.lastSurface = surface?.isConnected ? surface : this.lastSurface;
    this.showMessage(guidance.phrase, {
      route:guidance.route,
      source,
      expanded,
      duration:expanded ? 0 : source === 'arrival' ? 4800 : 6200
    });
    try {
      this.nervousSystem?.signal?.('whit-supreme-guidance', {
        visible:false,
        source:clean(source, 60),
        route:guidance.route
      });
    } catch {}
    emit('whit:supreme-guidance', {
      route:guidance.route,
      source:clean(source, 60),
      local:true,
      messageIncluded:false,
      modelCalls:0,
      privateContentRead:false
    });
    return guidance;
  }

  showMessage(message, { route = routeNow(), source = 'local', expanded = false, duration = 5600 } = {}) {
    if (this.destroyed || !this.root || !message) return false;
    const normalized = ROUTES.has(route) ? route : 'home';
    const world = WORLDS[normalized];
    this.route = normalized;
    this.world.textContent = `WHIT · ${world.label.toUpperCase()}`;
    this.copy.textContent = clean(message, 360);
    this.talk.textContent = normalized === 'ai' ? 'CONTINUAR CONVERSA' : 'CONVERSAR';
    this.privacy.textContent = `Neste momento, a Whit reconhece somente a página ${world.label}. Nenhum campo digitado, texto do Diário, tiragem ou aula foi lido por esta presença.`;
    this.privacy.hidden = true;
    this.privacyButton.setAttribute('aria-expanded','false');
    this.root.dataset.mode = expanded ? 'sheet' : 'whisper';
    this.root.dataset.source = clean(source, 40);
    this.root.hidden = false;
    this.root.setAttribute('aria-hidden','false');
    this.root.classList.remove('is-entering');
    void this.root.offsetWidth;
    this.root.classList.add('is-visible','is-entering');
    this.visible = true;
    this.expanded = expanded;
    clearTimeout(this.hideTimer);
    if (duration > 0) this.hideTimer = setTimeout(() => this.close(), duration);
    this.syncOverlayVisibility();
    return true;
  }

  expand(focus = false) {
    if (!this.visible || !this.root) return false;
    clearTimeout(this.hideTimer);
    this.expanded = true;
    this.root.dataset.mode = 'sheet';
    this.root.classList.add('is-expanded');
    this.root.setAttribute('aria-label',`Whit em ${WORLDS[this.route]?.label || 'Divina Bruxa'}`);
    if (focus) this.talk?.focus?.({ preventScroll:true });
    emit('whit:supreme-open', { route:this.route, publicRouteOnly:true, privateContentRead:false });
    return true;
  }

  openSheet(route = routeNow(), surface = null, focus = false) {
    const normalized = ROUTES.has(route) ? route : routeNow();
    if (!this.visible || this.route !== normalized) {
      this.showGuidance(normalized, { source:'explicit-open', surface, expanded:true });
    } else this.expand(focus);
    if (focus) this.talk?.focus?.({ preventScroll:true });
    return true;
  }

  togglePrivacy() {
    if (!this.privacy || !this.privacyButton) return false;
    const opening = this.privacy.hidden;
    this.privacy.hidden = !opening;
    this.privacyButton.setAttribute('aria-expanded',String(opening));
    return opening;
  }

  close(immediate = false) {
    clearTimeout(this.hideTimer);
    if (!this.root || !this.visible) return false;
    this.root.classList.remove('is-visible','is-expanded','is-entering');
    this.root.setAttribute('aria-hidden','true');
    this.visible = false;
    this.expanded = false;
    const finish = () => {
      if (!this.visible && this.root) this.root.hidden = true;
    };
    if (immediate || reducedMotion()) finish();
    else setTimeout(finish, 360);
    return true;
  }

  syncOverlayVisibility() {
    if (!this.root) return;
    const allowed = this.visible && !this.menuOpen && !this.inFlight;
    this.root.hidden = !allowed;
    this.root.setAttribute('aria-hidden',String(!allowed));
  }

  onPointerDown(event) {
    const surface = event.target?.closest?.('[data-orb-presence-v526="true"]');
    if (!surface || (event.pointerType === 'mouse' && event.button !== 0)) return;
    clearTimeout(this.hold?.timer);
    const hold = {
      pointerId:event.pointerId,
      surface,
      x:event.clientX,
      y:event.clientY,
      timer:0
    };
    hold.timer = setTimeout(() => {
      if (this.hold !== hold) return;
      this.suppressAwakeUntil = (performance.now?.() || Date.now()) + 720;
      this.lastSurface = surface;
      this.openSheet(surface.dataset.route || routeNow(), surface, false);
      surface.classList.add('db527-whit-hold-complete');
      setTimeout(() => surface.classList.remove('db527-whit-hold-complete'), 760);
    }, reducedMotion() ? 420 : HOLD_MS);
    this.hold = hold;
  }

  onPointerMove(event) {
    if (!this.hold || event.pointerId !== this.hold.pointerId) return;
    const distance = Math.hypot(event.clientX - this.hold.x, event.clientY - this.hold.y);
    if (distance <= 12) return;
    clearTimeout(this.hold.timer);
    this.hold = null;
  }

  onPointerEnd(event) {
    if (!this.hold || event.pointerId !== this.hold.pointerId) return;
    clearTimeout(this.hold.timer);
    this.hold = null;
  }

  openConversation() {
    const origin = this.lastSurface?.isConnected
      ? this.lastSurface
      : document.querySelector(`#${this.route} [data-orb-presence-v526="true"]`);
    this.close();
    if (this.route === 'ai') {
      const input = document.querySelector('#aiApp #chatInput');
      input?.scrollIntoView?.({ behavior:reducedMotion() ? 'auto' : 'smooth', block:'center' });
      setTimeout(() => input?.focus?.({ preventScroll:true }), reducedMotion() ? 0 : 280);
      return true;
    }
    if (!this.go) return false;
    Promise.resolve(this.go('ai', { source:'whit-core-supreme-v527', target:origin || null }))
      .catch(error => console.info('[Divina] a realidade da Whit permaneceu disponível pelo menu', error));
    return true;
  }

  publicContext() {
    const world = WORLDS[this.route] || WORLDS.home;
    return Object.freeze({
      route:this.route,
      label:world.label,
      tone:world.tone,
      source:'public-route',
      privateContentRead:false,
      formFieldsRead:false
    });
  }

  contract() {
    return WHIT_CORE_SUPREME_CONTRACT_V527;
  }

  status() {
    const core = componentStatus(this.core);
    const presence = componentStatus(this.presence);
    const nerves = componentStatus(this.nervousSystem);
    const context = componentStatus(this.contextBridge);
    const memory = componentStatus(this.memoryGarden);
    const signature = componentStatus(this.signature);
    const mind = componentStatus(this.mind);
    const generation = componentStatus(this.generationBridge);
    const silent = componentStatus(this.silentPresence);
    return Object.freeze({
      release:RELEASE,
      version:VERSION,
      route:this.route,
      state:this.state,
      visible:this.visible,
      expanded:this.expanded,
      connectedOrbSurfaces:[...this.surfaces].filter(surface => surface.isConnected).length,
      canonicalPhysicalOrb:'V501',
      universalPresence:'V526',
      independentWhitOrb:false,
      retiredDraggableOrbitV333:true,
      localGuidance:true,
      localGuidanceRoutes:ROUTES.size,
      publicRouteAwarenessOnly:true,
      privateContentRead:false,
      formFieldsRead:false,
      journalBodyRead:false,
      extraApiCalls:0,
      modelCallsByThisLayer:0,
      permanentAnimationLoops:0,
      audio:false,
      autoplay:false,
      microphone:false,
      voiceClone:false,
      literalWhitneyIdentity:false,
      soulClaim:false,
      originalPersona:true,
      explicitContextOnly:true,
      solEnabled:false,
      componentHealth:Object.freeze({
        core:Boolean(core),
        presence:Boolean(presence),
        nervousSystem:Boolean(nerves),
        contextBridge:Boolean(context),
        memoryGarden:Boolean(memory),
        signature:Boolean(signature),
        mind:Boolean(mind),
        generationBridge:Boolean(generation),
        silentPresence:Boolean(silent),
        orbCore:Boolean(this.orbCore),
        orbPresence:Boolean(this.orbPresence),
        universe:Boolean(this.universe)
      })
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    clearTimeout(this.hideTimer);
    clearTimeout(this.arrivalTimer);
    clearTimeout(this.hold?.timer);
    cancelAnimationFrame(this.refreshFrame);
    this.abort.abort();
    this.domObserver?.disconnect();
    this.stateObserver?.disconnect();
    this.root?.remove();
    for (const surface of this.surfaces) {
      const snapshot = this.surfaceSnapshots.get(surface);
      if (snapshot?.coreSurface == null) delete surface.dataset.whitCoreSurface;
      else surface.dataset.whitCoreSurface = snapshot.coreSurface;
      if (snapshot?.state == null) delete surface.dataset.whitState;
      else surface.dataset.whitState = snapshot.state;
      surface.classList.remove('db527-whit-hold-complete');
      if (snapshot?.label == null) surface.removeAttribute('aria-label');
      else surface.setAttribute('aria-label',snapshot.label);
      if (snapshot?.description == null) surface.removeAttribute('aria-description');
      else surface.setAttribute('aria-description',snapshot.description);
    }
    this.surfaces.clear();
    delete document.documentElement.dataset.whitSupreme;
    delete document.documentElement.dataset.whitUniversal;
    delete document.documentElement.dataset.whitSupremeRoute;
    delete document.documentElement.dataset.whitSupremeState;
    delete document.documentElement.dataset.whitOrbSurfaces;
    delete globalThis[MARK];
  }
}

export function createWhitCoreSupremeV527(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const instance = new WhitCoreSupremeV527(options);
  globalThis[MARK] = instance;
  return instance;
}
