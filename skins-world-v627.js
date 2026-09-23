/* DIVINA BRUXA — WORK13 · SKINS · ATELIÊ DOS UNIVERSOS · V627
   A mesma Orbe canônica veste as 30 realidades já aprovadas. Esta camada cria
   chegada, prévia e profundidade; o Runtime V12 continua sendo a única
   autoridade visual e o servidor continua sendo a única autoridade de direito.
*/

const VERSION = 627;
const INSTANCE = Symbol.for('divina.work13.skins.world.v627');
const FALLBACK_SKIN = Object.freeze({
  id:'classic',
  name:'Clássica Divina',
  image:'divina-orb-thumb-v1.webp',
  preview:'divina-orb-thumb-v1.webp',
  tokens:Object.freeze({ accent:'#d96cff', light:'#f7d991' })
});

export const SKINS_WORLD_CONTRACT_V627 = Object.freeze({
  version:VERSION,
  work:'WORK13',
  stage:'renovacao-dos-mundos-14-skins',
  planReality:12,
  reality:'skins',
  universe:'atelie-dos-universos',
  sequence:Object.freeze([
    'arrival','current-form','one-explicit-choice','atelier-on-request','preview',
    'server-authorized-apply','three-world-continuity','return','silence'
  ]),
  totalSkins:30,
  freeSkin:'classic',
  freeSkins:1,
  paidSkins:29,
  individualPurchase:true,
  premiumIncludesAllSkins:true,
  priceTiersCents:Object.freeze([1990,2990,3990,4990]),
  cosmeticOnly:true,
  tarotLogicChanges:0,
  tarotResultChanges:0,
  previewRequiresOwnership:false,
  previewGrantsEntitlement:false,
  entitlementAuthority:'account-server-snapshot',
  frontendEntitlementGrants:false,
  activePreferenceAuthority:'runtime-v12-and-account-server',
  restoreAcrossDevices:true,
  offlineActiveSkin:true,
  fallbackSkin:'classic',
  globalApplyWithoutReload:true,
  canonicalSurfaces:7,
  touchPrimary:true,
  dragForbidden:true,
  soundDefault:'off',
  reducedMotion:true,
  realBilling:false,
  productionPublish:false,
  oneCanonicalOrb:true,
  oneCanonicalCanvas:true,
  newOrbs:0,
  newCanvases:0,
  newRenderers:0,
  permanentAnimationLoops:0,
  automaticNavigation:false,
  automaticWhitSpeech:false,
  privateContentReads:0,
  adminMutationSurface:false,
  iphoneFirst:true,
  nextReality:'notifications',
  work14:false
});

const cleanId = value => String(value || '').trim().toLowerCase();
const safe = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[character]);
const money = cents => new Intl.NumberFormat('pt-BR', {
  style:'currency', currency:'BRL'
}).format(Math.max(0, Number(cents) || 0) / 100);

export const normalizeSkinPhaseV627 = value => value === 'gallery' ? 'gallery' : 'focus';

export function nextSkinPhaseV627(current, action) {
  const phase = normalizeSkinPhaseV627(current);
  if (action === 'open') return 'gallery';
  if (action === 'close' || action === 'leave') return 'focus';
  return phase;
}

export function skinAccessStateV627({ id, activeId, owned = [] } = {}) {
  const skinId = cleanId(id) || 'classic';
  const ownedSet = owned instanceof Set ? owned : new Set(Array.isArray(owned) ? owned : []);
  const isActive = skinId === (cleanId(activeId) || 'classic');
  const isOwned = skinId === 'classic' || ownedSet.has(skinId);
  return Object.freeze({
    id:skinId,
    active:isActive,
    owned:isOwned,
    locked:!isOwned,
    action:isActive ? 'active' : isOwned ? 'apply' : 'access'
  });
}

function emit(documentTarget, type, detail = {}) {
  const EventClass = documentTarget?.defaultView?.CustomEvent || globalThis.CustomEvent;
  if (!documentTarget?.dispatchEvent || typeof EventClass !== 'function') return false;
  documentTarget.dispatchEvent(new EventClass(type, {
    detail:Object.freeze({ version:VERSION, ...detail })
  }));
  return true;
}

function routeFrom(documentTarget, windowTarget) {
  const bodyRoute = cleanId(documentTarget?.body?.dataset?.screen);
  if (bodyRoute) return bodyRoute;
  return cleanId(windowTarget?.location?.hash?.replace(/^#/, '')) || 'home';
}

async function defaultDependencies() {
  const [engineModule, catalogModule, registryModule, runtimeModule] = await Promise.all([
    import('./skins-v201.js?v=542'),
    import('./skin-catalog-v6.js?v=542'),
    import('./skin-registry-v12.js?v=133'),
    import('./runtime-v12.js?v=133')
  ]);
  return Object.freeze({
    Engine:engineModule.SkinsEngineV201,
    catalog:catalogModule.SKINS_V6,
    catalogMoney:catalogModule.moneySkinV542,
    skinById:registryModule.skinByIdV12,
    activeSkin:runtimeModule.activeSkinV12,
    prepareSkin:runtimeModule.prepareSkinV12
  });
}

export class SkinsWorldV627 {
  constructor({
    root = globalThis.document?.getElementById?.('skinsApp'),
    orbCore = globalThis.orbe?.supreme,
    livingMedia = globalThis.orbe?.livingMediaSkins,
    documentTarget = globalThis.document,
    windowTarget = globalThis,
    dependencies = null
  } = {}) {
    this.version = VERSION;
    this.root = root || null;
    this.orbCore = orbCore || null;
    this.livingMedia = livingMedia || null;
    this.documentTarget = documentTarget || null;
    this.windowTarget = windowTarget || null;
    this.dependencies = dependencies || null;
    this.catalog = [];
    this.engine = null;
    this.engineRender = null;
    this.phase = 'focus';
    this.selectedId = 'classic';
    this.route = routeFrom(this.documentTarget, this.windowTarget);
    this.previewTouches = 0;
    this.galleryOpens = 0;
    this.applications = 0;
    this.restoreSignals = 0;
    this.continuityBaseline = '';
    this.continuityRoutes = new Set();
    this.continuityPasses = 0;
    this.continuityConsistent = true;
    this.dependencyFailures = 0;
    this.destroyed = false;
    this.touchTimer = 0;
    this.abort = new AbortController();
    if (!this.root) return;
    this.mount();
    this.bind();
    this.ready = this.hydrate();
  }

  listen(target, type, handler, options = {}) {
    target?.addEventListener?.(type, handler, { ...options, signal:this.abort.signal });
  }

  mount() {
    this.root.dataset.skinsWorld = 'v627';
    this.root.setAttribute('data-skins-universe', 'atelie-dos-universos');
    this.root.innerHTML = `
      <section id="skinsWorldV627" class="skw627" data-skw627-phase="focus" aria-labelledby="skw627Title">
        <div class="skw627-atmosphere" aria-hidden="true"><i></i><i></i><i></i></div>
        <header class="skw627-arrival">
          <p class="eyebrow">SKINS · ATELIÊ DOS UNIVERSOS · V627</p>
          <h3 id="skw627Title">A mesma alma. Trinta universos para vestir.</h3>
          <p>A forma muda luz, matéria e atmosfera. Suas cartas, leituras e escolhas permanecem exatamente as mesmas.</p>
        </header>
        <section class="skw627-stage" aria-labelledby="skw627SkinName">
          <button class="skw627-preview" type="button" data-skw627-touch aria-label="Sentir a prévia da Clássica Divina">
            <span class="skw627-preview__rings" aria-hidden="true"><i></i><i></i><i></i></span>
            <img src="${FALLBACK_SKIN.preview}" alt="" width="420" height="420" decoding="async" fetchpriority="high">
            <span class="skw627-preview__touch" aria-hidden="true"></span>
          </button>
          <div class="skw627-stage__copy">
            <p class="skw627-state" data-skw627-state>FORMA ATUAL</p>
            <h4 id="skw627SkinName" data-skw627-name>Clássica Divina</h4>
            <p data-skw627-copy>Ela acompanha a Home, o Menu, o Tarot e os portais sem reiniciar o aplicativo.</p>
            <div class="skw627-facts" aria-label="Contrato das skins">
              <span><b>30</b><small>formas</small></span>
              <span><b>1</b><small>Orbe</small></span>
              <span><b>0</b><small>mudanças no Tarot</small></span>
            </div>
            <p class="skw627-price" data-skw627-price>Grátis para sempre</p>
            <div class="skw627-actions">
              <button class="skw627-primary" type="button" data-skw627-open aria-expanded="false" aria-controls="skw627Depth">ABRIR O ATELIÊ</button>
              <button class="skw627-apply" type="button" data-skw627-apply hidden>EM USO</button>
            </div>
          </div>
        </section>
        <aside class="skw627-oath">
          <span aria-hidden="true">◇</span>
          <p><b>Cosmético é cosmético.</b><small>A prévia nunca libera propriedade. Aplicar, restaurar e sincronizar obedecem à Conta e ao direito confirmado pelo servidor.</small></p>
        </aside>
        <section id="skw627Depth" class="skw627-depth" data-skw627-depth hidden aria-labelledby="skw627DepthTitle">
          <header>
            <div><p class="eyebrow">ESCOLHA UMA REALIDADE</p><h4 id="skw627DepthTitle" tabindex="-1">Cada skin, uma presença completa.</h4><p>Toque para contemplar. Vista apenas o que pertence à sua coleção.</p></div>
            <button type="button" data-skw627-close aria-label="Fechar o Ateliê">VOLTAR À FORMA ATUAL</button>
          </header>
          <div class="skw627-engine" data-skw627-engine role="region" aria-label="Galeria das 30 skins"></div>
        </section>
        <p class="skw627-live" data-skw627-live role="status" aria-live="polite" aria-atomic="true"></p>
        <footer><span aria-hidden="true">✦</span><p><b>O pentagrama continua sendo o caminho.</b><small>Troque de mundo e a forma escolhida atravessará com você.</small></p></footer>
      </section>`;
    this.world = this.root.querySelector?.('#skinsWorldV627') || null;
    this.depth = this.root.querySelector?.('[data-skw627-depth]') || null;
    this.engineHost = this.root.querySelector?.('[data-skw627-engine]') || null;
    this.renderPreview();
  }

  bind() {
    this.listen(this.root, 'click', event => this.onClick(event), { capture:true });
    this.listen(this.documentTarget, 'divina:skin-applied', event => this.onApplied(event));
    this.listen(this.documentTarget, 'divina:skin-changed', event => this.onApplied(event));
    this.listen(this.documentTarget, 'divina:route-ready', event => this.onRoute(event));
    this.listen(this.documentTarget, 'divina:page-ready', event => this.onRoute(event));
    this.listen(this.documentTarget, 'divina:supreme-orb-did-navigate', event => this.onRoute(event));
    this.listen(this.windowTarget, 'hashchange', () => this.onRoute({ detail:{ id:routeFrom(this.documentTarget, this.windowTarget) } }));
    this.listen(this.windowTarget, 'divina:billing-updated', () => {
      this.restoreSignals += 1;
      queueMicrotask(() => this.renderPreview());
    });
  }

  async hydrate() {
    try {
      this.dependencies = this.dependencies || await defaultDependencies();
      this.catalog = Array.isArray(this.dependencies.catalog) ? this.dependencies.catalog : [];
      if (this.catalog.length !== SKINS_WORLD_CONTRACT_V627.totalSkins) throw new Error('SKINS_V627_CATALOG_DRIFT');
      this.selectedId = cleanId(this.dependencies.activeSkin?.()) || 'classic';
      this.root.dataset.v627Runtime = 'ready';
      this.renderPreview();
      if (this.phase === 'gallery') await this.ensureEngine();
      emit(this.documentTarget, 'divina:skins-world-ready', {
        release:'V627',
        universe:SKINS_WORLD_CONTRACT_V627.universe,
        total:SKINS_WORLD_CONTRACT_V627.totalSkins,
        freeSkin:'classic',
        paidSkins:29,
        individualPurchase:true,
        priceTiersCents:[1990,2990,3990,4990],
        realBilling:false,
        privateContentIncluded:false
      });
      return true;
    } catch (error) {
      this.dependencyFailures += 1;
      this.root.dataset.v627Runtime = 'fallback';
      this.announce('A forma atual continua segura. O Ateliê será tentado novamente quando os arquivos estiverem disponíveis.');
      console.error?.('[Divina] Ateliê dos Universos V627 não hidratou', error);
      emit(this.documentTarget, 'divina:skins-world-ready', {
        release:'V627', universe:SKINS_WORLD_CONTRACT_V627.universe, ready:false, fallback:'classic'
      });
      return false;
    }
  }

  skin(id = this.selectedId) {
    try { return this.dependencies?.skinById?.(id) || FALLBACK_SKIN; }
    catch { return FALLBACK_SKIN; }
  }

  activeId() {
    try { return cleanId(this.dependencies?.activeSkin?.()) || 'classic'; }
    catch { return 'classic'; }
  }

  catalogItem(id = this.selectedId) {
    return this.catalog.find?.(item => item.id === id) || {
      id:'classic', name:'Clássica Divina', priceCents:0, collection:'Essencial'
    };
  }

  ownedIds() {
    const owned = this.engine?.owned;
    return owned instanceof Set ? owned : new Set(['classic']);
  }

  access(id = this.selectedId) {
    return skinAccessStateV627({ id, activeId:this.activeId(), owned:this.ownedIds() });
  }

  renderPreview() {
    if (!this.root) return false;
    const skin = this.skin(this.selectedId);
    const catalog = this.catalogItem(this.selectedId);
    const access = this.access(this.selectedId);
    const name = skin?.name || catalog.name || FALLBACK_SKIN.name;
    const preview = skin?.preview || skin?.image || FALLBACK_SKIN.preview;
    const accent = skin?.tokens?.accent || FALLBACK_SKIN.tokens.accent;
    const light = skin?.tokens?.light || FALLBACK_SKIN.tokens.light;
    const image = this.root.querySelector?.('.skw627-preview img');
    const previewButton = this.root.querySelector?.('[data-skw627-touch]');
    const title = this.root.querySelector?.('[data-skw627-name]');
    const state = this.root.querySelector?.('[data-skw627-state]');
    const copy = this.root.querySelector?.('[data-skw627-copy]');
    const price = this.root.querySelector?.('[data-skw627-price]');
    const apply = this.root.querySelector?.('[data-skw627-apply]');
    if (image && image.getAttribute('src') !== preview) image.src = preview;
    if (previewButton) previewButton.setAttribute('aria-label', `Sentir a prévia de ${name}`);
    if (title) title.textContent = name;
    if (state) state.textContent = access.active ? 'FORMA ATUAL' : access.owned ? 'SUA COLEÇÃO' : 'PRÉVIA LIVRE';
    if (copy) copy.textContent = access.active
      ? 'Ela acompanha a Home, o Menu, o Tarot e os portais sem reiniciar o aplicativo.'
      : access.owned
        ? 'Direito confirmado. Esta forma pode atravessar agora para todas as superfícies canônicas.'
        : 'Contemple cor, luz e matéria. A prévia não concede propriedade nem altera a sua leitura.';
    if (price) price.textContent = catalog.priceCents ? `${money(catalog.priceCents)} · pagamento único` : 'Grátis para sempre';
    if (this.world?.style?.setProperty) {
      this.world.style.setProperty('--skw627-accent', accent);
      this.world.style.setProperty('--skw627-light', light);
    }
    if (this.world?.dataset) {
      this.world.dataset.skw627Selected = this.selectedId;
      this.world.dataset.skw627Access = access.action;
    }
    if (apply) {
      apply.hidden = this.phase !== 'gallery';
      apply.disabled = access.active;
      apply.dataset.skw627Action = access.action;
      apply.textContent = access.active
        ? 'EM USO'
        : access.owned
          ? 'VESTIR ESTA REALIDADE'
          : `VER ACESSO · ${money(catalog.priceCents)}`;
    }
    return true;
  }

  async ensureEngine() {
    if (this.engine || !this.engineHost || !this.dependencies?.Engine) return Boolean(this.engine);
    this.engine = new this.dependencies.Engine(this.engineHost);
    if (!this.engine) return false;
    this.engineRender = this.engine.render?.bind(this.engine) || null;
    if (this.engineRender) {
      this.engine.render = (...args) => {
        const result = this.engineRender(...args);
        queueMicrotask(() => this.afterEngineRender());
        return result;
      };
    }
    this.afterEngineRender();
    return true;
  }

  afterEngineRender() {
    if (!this.engineHost) return false;
    const legacyStage = this.engineHost.querySelector?.('.skins-v191-stage');
    if (legacyStage) {
      legacyStage.hidden = true;
      legacyStage.classList?.remove?.('skins-v191-stage');
      legacyStage.dataset.v627LegacyStage = 'hidden';
    }
    const oath = this.engineHost.querySelector?.('.skins-v191-oath');
    if (oath) oath.hidden = true;
    this.engineHost.dataset.v627Engine = 'V201-preserved';
    this.renderPreview();
    return true;
  }

  async openAtelier() {
    if (this.destroyed) return false;
    this.phase = nextSkinPhaseV627(this.phase, 'open');
    this.galleryOpens += 1;
    if (this.world?.dataset) this.world.dataset.skw627Phase = this.phase;
    if (this.depth) this.depth.hidden = false;
    const opener = this.root?.querySelector?.('[data-skw627-open]');
    opener?.setAttribute?.('aria-expanded', 'true');
    if (opener) opener.textContent = 'ATELIÊ ABERTO';
    this.livingMedia?.setPhase?.('skins', 'gallery', 'v627-explicit-atelier', true);
    if (!this.dependencies) await this.ready;
    await this.ensureEngine();
    this.selectedId = this.activeId();
    this.renderPreview();
    this.root?.querySelector?.('#skw627DepthTitle')?.focus?.({ preventScroll:true });
    emit(this.documentTarget, 'divina:skins-atelier-opened', {
      universe:SKINS_WORLD_CONTRACT_V627.universe,
      explicit:true,
      privateContentIncluded:false
    });
    return true;
  }

  closeAtelier({ focus = true, reason = 'explicit-close' } = {}) {
    this.phase = nextSkinPhaseV627(this.phase, 'close');
    if (this.world?.dataset) this.world.dataset.skw627Phase = this.phase;
    if (this.depth) this.depth.hidden = true;
    const opener = this.root?.querySelector?.('[data-skw627-open]');
    opener?.setAttribute?.('aria-expanded', 'false');
    if (opener) opener.textContent = 'ABRIR O ATELIÊ';
    this.selectedId = this.activeId();
    this.renderPreview();
    this.livingMedia?.setPhase?.('skins', 'focus', `v627-${reason}`, false);
    if (focus) opener?.focus?.({ preventScroll:true });
    return true;
  }

  selectSkin(id, { prepare = true } = {}) {
    const requested = cleanId(id);
    if (!requested || (this.catalog.length && !this.catalog.some(item => item.id === requested))) return false;
    this.selectedId = requested;
    this.renderPreview();
    if (prepare) this.dependencies?.prepareSkin?.(requested, { priority:'high' }).catch?.(() => undefined);
    emit(this.documentTarget, 'divina:skin-previewed', {
      skinId:requested,
      grantsEntitlement:false,
      privateContentIncluded:false
    });
    return true;
  }

  feelPreview() {
    this.previewTouches += 1;
    const preview = this.root?.querySelector?.('[data-skw627-touch]');
    preview?.classList?.add?.('is-touched');
    clearTimeout(this.touchTimer);
    this.touchTimer = setTimeout(() => preview?.classList?.remove?.('is-touched'), 360);
    this.orbCore?.pulse?.('skin-preview-touch', {
      intensity:.46,
      skinId:this.selectedId,
      apply:false,
      navigate:false
    });
    return true;
  }

  async applySelected() {
    if (!this.engine) await this.ensureEngine();
    if (!this.engine) {
      this.announce('O Ateliê ainda está preparando a sua coleção.');
      return false;
    }
    const access = this.access(this.selectedId);
    if (access.active) return true;
    const result = await this.engine.choose?.(this.selectedId);
    this.renderPreview();
    return Boolean(result);
  }

  onClick(event) {
    const target = event?.target;
    const cardPreview = target?.closest?.('[data-preview]');
    if (cardPreview?.dataset?.preview) this.selectSkin(cardPreview.dataset.preview);
    if (target?.closest?.('[data-skw627-open]')) {
      this.openAtelier();
      return;
    }
    if (target?.closest?.('[data-skw627-close]')) {
      this.closeAtelier();
      return;
    }
    if (target?.closest?.('[data-skw627-touch]')) {
      this.feelPreview();
      return;
    }
    if (target?.closest?.('[data-skw627-apply]')) this.applySelected();
  }

  onApplied(event) {
    const id = cleanId(event?.detail?.id || event?.detail?.skinId || this.activeId());
    this.selectedId = id || this.activeId();
    this.applications += 1;
    this.continuityBaseline = this.selectedId;
    this.continuityRoutes.clear();
    this.continuityConsistent = true;
    this.renderPreview();
    this.orbCore?.pulse?.('skin-world-applied', {
      intensity:.72,
      skinId:this.selectedId,
      sameCanonicalOrb:true
    });
    emit(this.documentTarget, 'divina:skins-world-changed', {
      skinId:this.selectedId,
      globalApply:true,
      reload:false,
      bodyIncluded:false
    });
  }

  onRoute(event) {
    const next = cleanId(event?.detail?.id || event?.detail?.to) || routeFrom(this.documentTarget, this.windowTarget);
    this.route = next;
    if (this.continuityBaseline) {
      const sameSkin = this.activeId() === this.continuityBaseline;
      this.continuityConsistent = this.continuityConsistent && sameSkin;
      if (next && next !== 'skins') this.continuityRoutes.add(next);
      if (next === 'skins' && this.continuityRoutes.size >= 3) {
        if (this.continuityConsistent) this.continuityPasses += 1;
        emit(this.documentTarget, 'divina:skins-continuity-checked', {
          skinId:this.continuityBaseline,
          realities:this.continuityRoutes.size,
          consistent:this.continuityConsistent,
          privateContentIncluded:false
        });
        this.continuityBaseline = '';
        this.continuityRoutes.clear();
      }
    }
    if (next !== 'skins' && this.phase === 'gallery') this.closeAtelier({ focus:false, reason:'route-leave' });
  }

  announce(message) {
    const live = this.root?.querySelector?.('[data-skw627-live]');
    if (live) live.textContent = String(message || '');
    const EventClass = this.windowTarget?.CustomEvent || globalThis.CustomEvent;
    if (typeof EventClass === 'function') {
      this.windowTarget?.dispatchEvent?.(new EventClass('orbe:toast', { detail:String(message || '') }));
    }
  }

  audit() {
    const orbs = this.documentTarget?.querySelectorAll?.('#orb')?.length ?? 0;
    const canvases = this.documentTarget?.querySelectorAll?.('#orbCanvas')?.length ?? 0;
    const worlds = this.documentTarget?.querySelectorAll?.('#skinsWorldV627')?.length ?? (this.world ? 1 : 0);
    return Object.freeze({
      version:VERSION,
      oneCanonicalOrb:orbs === 1,
      oneCanonicalCanvas:canvases === 1,
      canonicalOrbs:orbs,
      canonicalCanvases:canvases,
      duplicateOrbs:Math.max(0, orbs - 1),
      duplicateCanvases:Math.max(0, canvases - 1),
      oneSkinsWorld:worlds === 1,
      skinsWorlds:worlds,
      catalogCount:this.catalog.length || SKINS_WORLD_CONTRACT_V627.totalSkins,
      entitlementAuthority:SKINS_WORLD_CONTRACT_V627.entitlementAuthority,
      frontendEntitlementGrants:false,
      newRenderers:0,
      permanentAnimationLoops:0,
      privateContentReads:0,
      continuityRealities:this.continuityRoutes.size,
      continuityConsistent:this.continuityConsistent
    });
  }

  status() {
    return Object.freeze({
      ...SKINS_WORLD_CONTRACT_V627,
      phase:this.phase,
      selectedSkin:this.selectedId,
      activeSkin:this.activeId(),
      hydrated:this.root?.dataset?.v627Runtime === 'ready',
      galleryOpens:this.galleryOpens,
      previewTouches:this.previewTouches,
      applications:this.applications,
      restoreSignals:this.restoreSignals,
      continuityPasses:this.continuityPasses,
      dependencyFailures:this.dependencyFailures,
      audit:this.audit()
    });
  }

  destroy() {
    if (this.destroyed) return false;
    this.destroyed = true;
    this.abort.abort();
    clearTimeout(this.touchTimer);
    this.engine?.destroy?.();
    this.engine = null;
    if (this.root) {
      this.root.replaceChildren?.();
      delete this.root.dataset.skinsWorld;
      delete this.root.dataset.v627Runtime;
      this.root.removeAttribute?.('data-skins-universe');
    }
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
    if (globalThis.divinaWork13SkinsInstanceV627 === this) delete globalThis.divinaWork13SkinsInstanceV627;
    return true;
  }
}

export function createSkinsWorldV627(options = {}) {
  if (globalThis[INSTANCE] && !globalThis[INSTANCE].destroyed) return globalThis[INSTANCE];
  const instance = new SkinsWorldV627(options);
  globalThis[INSTANCE] = instance;
  globalThis.divinaWork13SkinsInstanceV627 = instance;
  return instance;
}
