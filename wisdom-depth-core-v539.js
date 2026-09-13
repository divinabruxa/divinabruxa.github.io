/* DIVINA BRUXA 3.0 · MACROETAPA 5/14 · SABEDORIA VIVA PROFUNDA · V539
   Une Biblioteca, Escola, Tiragens e Diário sem duplicar motores ou ler conteúdo privado. */

const RELEASE = 'V539';
const MARK = Symbol.for('divina.wisdom.depth.core.v539');
const STYLE_ID = 'divinaWisdomDepthV539Styles';
const WISDOM_ROUTES = Object.freeze(['library', 'school', 'journal']);
const STEPS = Object.freeze([
  Object.freeze({ route:'library', number:'01', verb:'Aprender', detail:'78 cartas e seus símbolos' }),
  Object.freeze({ route:'school', number:'02', verb:'Praticar', detail:'17 módulos · 124 aulas' }),
  Object.freeze({ route:'journal', number:'03', verb:'Integrar', detail:'seu grimório privado' })
]);
const COPY = Object.freeze({
  library:Object.freeze({
    title:'Uma carta pode abrir uma jornada inteira.',
    body:'Observe a imagem, reconheça os símbolos e leve a carta escolhida para estudo ou prática sem perder o fio.',
    privacy:'A carta aberta é contexto editorial público. Nada é enviado à Whit sem sua ação.',
    actions:Object.freeze([
      Object.freeze({ route:'school', label:'LEVAR PARA A ESCOLA', primary:true }),
      Object.freeze({ route:'spreads', label:'PRATICAR EM TIRAGENS' })
    ])
  }),
  school:Object.freeze({
    title:'Estudar é transformar símbolo em linguagem.',
    body:'Avance pela trilha, revise, exercite e pratique. A Escola permanece completa mesmo sem IA.',
    privacy:'Progresso, notas e favoritos ficam neste aparelho. Esta camada recebe apenas a contagem de progresso.',
    actions:Object.freeze([
      Object.freeze({ route:'spreads', label:'PRATICAR EM TIRAGENS', primary:true }),
      Object.freeze({ route:'journal', label:'INTEGRAR NO DIÁRIO' }),
      Object.freeze({ route:'library', label:'CONSULTAR BIBLIOTECA' })
    ])
  }),
  journal:Object.freeze({
    title:'O Diário transforma prática em memória.',
    body:'Registre, retorne e perceba ritmos. O Espelho mostra somente padrões agregados e nunca define quem você é.',
    privacy:'Texto, título e rascunho não são lidos por esta camada, pela Whit, pelo Admin ou por analytics.',
    actions:Object.freeze([
      Object.freeze({ route:'library', label:'VOLTAR À BIBLIOTECA', primary:true }),
      Object.freeze({ route:'school', label:'CONTINUAR NA ESCOLA' }),
      Object.freeze({ route:'spreads', label:'ABRIR TIRAGENS' })
    ])
  })
});

const currentRoute = () => String(document.body?.dataset?.screen || location.hash || '#home')
  .replace(/^#/, '').split(/[?&/]/)[0] || 'home';

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './wisdom-depth-core-v539.css?v=539';
  document.head.append(link);
}

function safeLabel(value, maximum = 72) {
  return String(value || '').replace(/[<>\r\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maximum);
}

export const WISDOM_DEPTH_PRIVACY_V539 = Object.freeze({
  privateFieldReads:0,
  journalBodyReads:0,
  journalTitleReads:0,
  journalDraftReads:0,
  schoolNoteReads:0,
  storageReads:0,
  storageWrites:0,
  networkCalls:0,
  modelCalls:0,
  publicContextMemoryOnly:true,
  whitRequiresExplicitAction:true,
  aggregateMirrorOnly:true
});

export class WisdomDepthCoreV539 {
  constructor({ go, orbCore, vitality } = {}) {
    this.go = typeof go === 'function' ? go : route => globalThis.orbe?.go?.(route);
    this.orbCore = orbCore || globalThis.divinaOrbSupremeV501?.core || null;
    this.vitality = vitality || globalThis.divinaVitalityBusV536?.core || null;
    this.abort = new AbortController();
    this.frame = 0;
    this.publicCard = null;
    this.schoolProgress = Object.freeze({ done:0, total:124, percent:0 });
    this.journalAggregate = Object.freeze({ total:0, activeDays7:0, reviewsDue:0 });
    this.journalConflict = false;
    installStyle();
    this.bind();
    this.scheduleMount();
    document.documentElement.dataset.wisdomDepth = 'v539';
  }

  bind() {
    const { signal } = this.abort;
    ['divina:page-ready', 'divina:route-ready', 'divina:supreme-orb-did-navigate',
      'divina:library-world-ready', 'divina:school-world-ready', 'divina:journal-world-ready']
      .forEach(type => document.addEventListener(type, () => this.scheduleMount(), { passive:true, signal }));

    document.addEventListener('divina:wisdom-public-context-v539', event => {
      const detail = event.detail || {};
      if (detail.private !== false || detail.kind !== 'card') return;
      this.publicCard = Object.freeze({ id:safeLabel(detail.id, 48), label:safeLabel(detail.label) });
      this.refresh('library');
    }, { signal });

    document.addEventListener('divina:school-progress-v539', event => {
      const detail = event.detail || {};
      if (detail.private !== false) return;
      const total = Number(detail.total) || 124;
      const done = Math.max(0, Math.min(total, Number(detail.done) || 0));
      this.schoolProgress = Object.freeze({ done, total, percent:Math.round(done / total * 100) });
      this.refresh('school');
    }, { signal });

    document.addEventListener('divina:journal-world-updated', event => {
      const detail = event.detail || {};
      if (detail.privateBodyIncluded !== false || detail.analyticsTextIncluded !== false) return;
      this.journalAggregate = Object.freeze({
        total:Math.max(0, Number(detail.total) || 0),
        activeDays7:Math.max(0, Number(detail.activeDays7) || 0),
        reviewsDue:Math.max(0, Number(detail.reviewsDue) || 0)
      });
      this.refresh('journal');
    }, { signal });

    document.addEventListener('divina:journal-conflict-v539', event => {
      if (event.detail?.privateContentIncluded !== false) return;
      this.journalConflict = event.detail?.protected === true;
      this.updateConnectivity();
    }, { signal });
    document.addEventListener('divina:journal-conflict-resolved-v539', event => {
      if (event.detail?.privateContentIncluded !== false) return;
      this.journalConflict = false;
      this.updateConnectivity();
    }, { signal });

    document.addEventListener('click', event => {
      const button = event.target?.closest?.('[data-sd539-go]');
      if (!button) return;
      event.preventDefault();
      this.travel(button.dataset.sd539Go, button);
    }, { signal });

    globalThis.addEventListener?.('online', () => this.updateConnectivity(), { passive:true, signal });
    globalThis.addEventListener?.('offline', () => this.updateConnectivity(), { passive:true, signal });
  }

  scheduleMount() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      WISDOM_ROUTES.forEach(route => this.mount(route));
      this.updateConnectivity();
    });
  }

  mount(route) {
    const root = document.getElementById(route);
    if (!root) return;
    let surface = root.querySelector(':scope > [data-wisdom-depth-v539]');
    if (!surface) {
      surface = document.createElement('section');
      surface.className = 'sd539';
      surface.dataset.wisdomDepthV539 = route;
      surface.setAttribute('aria-labelledby', `sd539Title-${route}`);
      const anchor = root.querySelector('[data-wisdom-universe-nav="v529"]');
      if (anchor) anchor.insertAdjacentElement('afterend', surface);
      else root.prepend(surface);
    }
    this.render(route, surface);
  }

  contextLine(route) {
    if (route === 'library' && this.publicCard?.label) return `Carta aberta: ${this.publicCard.label} · orientação direta`;
    if (route === 'school') return `${this.schoolProgress.done}/${this.schoolProgress.total} aulas concluídas · ${this.schoolProgress.percent}% da jornada`;
    if (route === 'journal') {
      const { total, activeDays7, reviewsDue } = this.journalAggregate;
      return `${total} memórias · ${activeDays7} dias ativos · ${reviewsDue} para rever`;
    }
    return '';
  }

  render(route, surface) {
    const copy = COPY[route];
    const signature = [route, this.contextLine(route), navigator.onLine].join('|');
    if (surface.dataset.signature === signature) return;
    surface.dataset.signature = signature;
    surface.innerHTML = `
      <header class="sd539__head">
        <div><p>SABEDORIA VIVA PROFUNDA · V539</p><h3 id="sd539Title-${route}">${copy.title}</h3><span>${copy.body}</span></div>
        <span class="sd539__state" data-sd539-network role="status"></span>
      </header>
      <ol class="sd539__path" aria-label="Jornada aprender, praticar e integrar">
        ${STEPS.map(step => `<li class="${step.route === route ? 'is-current' : ''}">
          <button type="button" data-sd539-go="${step.route}" ${step.route === route ? 'aria-current="step"' : ''}>
            <small>${step.number}</small><b>${step.verb}</b><span>${step.detail}</span>
          </button>
        </li>`).join('')}
      </ol>
      <div class="sd539__context"><span aria-hidden="true">✦</span><p><b>${this.contextLine(route)}</b><small>${copy.privacy}</small></p></div>
      <div class="sd539__actions">${copy.actions.map(action => `<button type="button" data-sd539-go="${action.route}" class="${action.primary ? 'is-primary' : ''}">${action.label}</button>`).join('')}</div>`;
    this.updateConnectivity(surface);
  }

  refresh(route) {
    const root = document.getElementById(route);
    const surface = root?.querySelector(':scope > [data-wisdom-depth-v539]');
    if (surface) this.render(route, surface);
  }

  updateConnectivity(scope = document) {
    scope.querySelectorAll?.('[data-sd539-network]').forEach(node => {
      node.dataset.online = String(navigator.onLine);
      const route = node.closest('[data-wisdom-depth-v539]')?.dataset?.wisdomDepthV539;
      node.textContent = route === 'journal' && this.journalConflict
        ? 'CONFLITO PROTEGIDO · RASCUNHO PRESERVADO'
        : navigator.onLine ? 'CONTEÚDO LOCAL · OFFLINE PREPARADO' : 'MODO OFFLINE · SEU CAMINHO CONTINUA';
    });
  }

  travel(target, surface) {
    if (![...WISDOM_ROUTES, 'spreads'].includes(target)) return false;
    this.orbCore?.pulse?.('wisdom-depth-path', { intensity:0.52, from:currentRoute(), target });
    this.vitality?.signal?.('wisdom-path', { route:target, source:'v539', private:false });
    document.dispatchEvent(new CustomEvent('divina:wisdom-depth-travel-v539', {
      detail:Object.freeze({ from:currentRoute(), target, publicCardId:this.publicCard?.id || null, privateContentIncluded:false })
    }));
    surface?.setAttribute('aria-busy', 'true');
    try {
      Promise.resolve(this.go(target, { source:'wisdom-depth-v539' })).finally(() => surface?.removeAttribute('aria-busy'));
    } catch {
      surface?.removeAttribute('aria-busy');
      return false;
    }
    return true;
  }

  audit() {
    const surfaces = Object.fromEntries(WISDOM_ROUTES.map(route => [route,
      document.querySelectorAll(`#${route} > [data-wisdom-depth-v539]`).length]));
    return Object.freeze({
      release:RELEASE,
      surfaces:Object.freeze(surfaces),
      duplicates:Object.values(surfaces).some(count => count > 1),
      libraryCards:78,
      schoolModules:17,
      schoolLessons:124,
      normalOnly:true,
      independentOrbEngines:0,
      permanentAnimationLoops:0,
      privacy:WISDOM_DEPTH_PRIVACY_V539
    });
  }

  status() {
    return Object.freeze({
      release:RELEASE, macroStage:'5-of-14', title:'Sabedoria Viva Profunda',
      journey:'library-school-spreads-journal', route:currentRoute(),
      online:navigator.onLine, publicCardContext:Boolean(this.publicCard),
      schoolProgress:this.schoolProgress, journalAggregate:this.journalAggregate,
      journalConflictProtected:this.journalConflict,
      whit:'optional-explicit-action-only', schoolWorksWithoutAI:true,
      privateReads:0, storageReads:0, storageWrites:0, networkCalls:0,
      permanentAnimationLoops:0, audit:this.audit()
    });
  }

  destroy() {
    this.abort.abort();
    cancelAnimationFrame(this.frame);
    document.querySelectorAll('[data-wisdom-depth-v539]').forEach(node => node.remove());
    if (document.documentElement.dataset.wisdomDepth === 'v539') delete document.documentElement.dataset.wisdomDepth;
    if (globalThis[MARK] === this) delete globalThis[MARK];
  }
}

export function createWisdomDepthCoreV539(options = {}) {
  if (globalThis[MARK]) return globalThis[MARK];
  const instance = new WisdomDepthCoreV539(options);
  globalThis[MARK] = instance;
  globalThis.divinaWisdomDepthV539 = instance;
  return instance;
}
