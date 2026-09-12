/* DIVINA BRUXA — MACROETAPA 4/4 · SKINS, DESEMPENHO E ACABAMENTO V518
   Uma autoridade de acabamento para as 30 skins. O Runtime V12 continua sendo
   a autoridade da troca de textura; a conta continua sendo a autoridade de
   propriedade. Esta camada não cria Orbes nem desbloqueia skins: preserva o
   desenho aprovado da Chama V516 e governa o orçamento do Universo Vivo V520.
*/

import { SKIN_REGISTRY_V12, skinByIdV12 } from './skin-registry-v12.js?v=133';

const VERSION = 518;
const INSTANCE = Symbol.for('divina.skin.performance.v518');
const STYLE_ID = 'divinaSkinPerformanceV518Styles';
const STYLE_HREF = './skin-performance-core-v518.css?v=518';
const VEIL_ID = 'divinaSkinVeilV518';
const EXPECTED_SKINS = 30;
const MONITOR_MS = 4000;
const QUALITY_ORDER = Object.freeze(['protected', 'balanced', 'cinematic']);

/* A identidade, a textura e accent/light continuam vindo do registro canônico.
   Estes são somente os pigmentos complementares usados pelo acabamento. */
const FINISH = Object.freeze({
  classic:Object.freeze({ gold:'#ffdca1', deep:'#07020d', mist:'#d76cff', spark:'#ff6fce', cool:'#76e8ff' }),
  lunar:Object.freeze({ gold:'#e8ddbd', deep:'#050716', mist:'#8d9bff', spark:'#c8a8ff', cool:'#9eeeff' }),
  solar:Object.freeze({ gold:'#ffe39a', deep:'#120702', mist:'#ffaf3d', spark:'#ff6d57', cool:'#fff0bc' }),
  ocean:Object.freeze({ gold:'#f0d59b', deep:'#020d16', mist:'#32c8e8', spark:'#568dff', cool:'#b7f7ff' }),
  emerald:Object.freeze({ gold:'#f0d79c', deep:'#031008', mist:'#70cf79', spark:'#b5ef72', cool:'#c9ffe1' }),
  fire:Object.freeze({ gold:'#ffd18a', deep:'#140304', mist:'#ff604f', spark:'#ff2f8d', cool:'#ffc8b0' }),
  cosmic:Object.freeze({ gold:'#f1d399', deep:'#070213', mist:'#9b58ff', spark:'#f056e6', cool:'#9ee9ff' }),
  eclipse:Object.freeze({ gold:'#d8c393', deep:'#020106', mist:'#543777', spark:'#a86bdb', cool:'#aeb6ff' }),
  venus:Object.freeze({ gold:'#f3cf9d', deep:'#12030d', mist:'#ec6fb1', spark:'#ff8bd6', cool:'#ffd5ee' }),
  amethyst:Object.freeze({ gold:'#efd69d', deep:'#090213', mist:'#a85de5', spark:'#e079ff', cool:'#d9c1ff' }),
  sapphire:Object.freeze({ gold:'#e8d7ad', deep:'#020817', mist:'#417bea', spark:'#7cb5ff', cool:'#c5eeff' }),
  ruby:Object.freeze({ gold:'#f2ce8e', deep:'#130207', mist:'#e34061', spark:'#ff6a8d', cool:'#ffcbd3' }),
  aurora:Object.freeze({ gold:'#f0daac', deep:'#02110f', mist:'#58e0c6', spark:'#a36eff', cool:'#b8fff4' }),
  storm:Object.freeze({ gold:'#e5d5aa', deep:'#050611', mist:'#787ec7', spark:'#c06eff', cool:'#c7e2ff' }),
  fairy:Object.freeze({ gold:'#f2d7a1', deep:'#100310', mist:'#cf6fca', spark:'#ff85d8', cool:'#c9fff1' }),
  isis:Object.freeze({ gold:'#f0d99f', deep:'#050413', mist:'#887be0', spark:'#c77cff', cool:'#e2e0ff' }),
  'twin-flame':Object.freeze({ gold:'#ffd19b', deep:'#120307', mist:'#f06b78', spark:'#ff4eb7', cool:'#ffd6ca' }),
  realities:Object.freeze({ gold:'#f4d58d', deep:'#080112', mist:'#9639d4', spark:'#ff56d5', cool:'#8ee8ff' }),
  queen:Object.freeze({ gold:'#ffe1a2', deep:'#0d0212', mist:'#b24fc6', spark:'#ef6bdc', cool:'#dbc4ff' }),
  supreme:Object.freeze({ gold:'#fff0bd', deep:'#0b0212', mist:'#c35ee8', spark:'#ff71dc', cool:'#baf1ff' }),
  'moon-silver':Object.freeze({ gold:'#ece4c8', deep:'#05070e', mist:'#a5adc7', spark:'#d0c6ff', cool:'#dff7ff' }),
  solstice:Object.freeze({ gold:'#ffeaad', deep:'#100802', mist:'#e1a437', spark:'#ff8d42', cool:'#fff0bd' }),
  neptune:Object.freeze({ gold:'#ead7a5', deep:'#020b14', mist:'#399bce', spark:'#5dd5df', cool:'#c2f4ff' }),
  'enchanted-forest':Object.freeze({ gold:'#ead39a', deep:'#020d07', mist:'#4dac73', spark:'#97d658', cool:'#c9ffe0' }),
  'cosmic-dragon':Object.freeze({ gold:'#f3cf95', deep:'#080210', mist:'#9553c3', spark:'#ff5aa8', cool:'#a9e7ff' }),
  'lunar-rose':Object.freeze({ gold:'#efd4a7', deep:'#10030d', mist:'#ce69a5', spark:'#f385ca', cool:'#f1d8ff' }),
  'saturn-crystal':Object.freeze({ gold:'#e7d8ad', deep:'#050611', mist:'#8589c9', spark:'#b588ef', cool:'#d5efff' }),
  'violet-phoenix':Object.freeze({ gold:'#ffd295', deep:'#0d0210', mist:'#bd4fd4', spark:'#ff5799', cool:'#d2c8ff' }),
  'celestial-oracle':Object.freeze({ gold:'#efdaa8', deep:'#040610', mist:'#6d7aca', spark:'#aa82ed', cool:'#c7f0ff' }),
  'star-crown':Object.freeze({ gold:'#fff0bd', deep:'#0d0802', mist:'#d0a344', spark:'#e971b9', cool:'#d9eeff' })
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const connection = () => navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  link.dataset.skinPerformanceStyle = 'v518';
  document.head.append(link);
}

function createVeil() {
  let veil = document.getElementById(VEIL_ID);
  if (veil) return veil;
  veil = document.createElement('div');
  veil.id = VEIL_ID;
  veil.className = 'db518-skin-veil';
  veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML = '<i></i><span></span>';
  document.body?.append(veil);
  return veil;
}

function validRegistry() {
  const skins = SKIN_REGISTRY_V12?.skins || [];
  const ids = new Set(skins.map(skin => skin.id));
  return skins.length === EXPECTED_SKINS
    && ids.size === EXPECTED_SKINS
    && skins.every(skin => skin?.id && FINISH[skin.id] && (skin.surfaces?.home || skin.image));
}

function activeSkinId(requested = '') {
  const candidate = String(
    requested ||
    document.documentElement.dataset.skin ||
    document.body?.dataset.orbeSkin ||
    document.documentElement.dataset.bootSkin ||
    'classic'
  ).trim();
  return skinByIdV12(candidate).id;
}

function skinOrigin(id) {
  const card = document.querySelector(`[data-skin-card="${globalThis.CSS?.escape?.(id) || id}"]`);
  const rect = card?.getBoundingClientRect?.();
  return rect?.width
    ? { x:rect.left + rect.width / 2, y:rect.top + rect.height / 2 }
    : { x:innerWidth / 2, y:innerHeight / 2 };
}

function baseQuality() {
  if (reducedMotion()) return 'protected';
  const net = connection();
  const effective = String(net?.effectiveType || '');
  const memory = Number(navigator.deviceMemory || 0);
  const cores = Number(navigator.hardwareConcurrency || 0);
  const constrained = net?.saveData === true
    || /slow-2g|(^|-)2g$/i.test(effective)
    || (memory > 0 && memory <= 3)
    || (cores > 0 && cores <= 2);
  if (constrained) return 'protected';
  if ((memory >= 6 || memory === 0) && cores >= 6) return 'cinematic';
  return 'balanced';
}

export class SkinPerformanceCoreV518 {
  constructor() {
    installStyle();
    this.abort = new AbortController();
    this.registryValid = validRegistry();
    this.baseTier = baseQuality();
    this.tier = this.baseTier;
    this.activeSkin = activeSkinId();
    this.longTaskCount = 0;
    this.longTaskMs = 0;
    this.totalLongTasks = 0;
    this.totalLongTaskMs = 0;
    this.calmWindows = 0;
    this.monitorTimer = 0;
    this.motionTimer = 0;
    this.skinTimer = 0;
    this.longTaskObserver = null;
    this.veil = createVeil();

    const html = document.documentElement;
    html.dataset.skinFinish = 'v518';
    html.dataset.skinRegistryV518 = this.registryValid ? '30-valid' : 'invalid';
    html.dataset.visualQuality = this.tier;
    this.applyPalette(this.activeSkin, { animate:false });
    this.applyBudget('boot');
    this.bind();
    this.observeLongTasks();
    this.scheduleMonitor();
    this.assertIntegrity();

    document.dispatchEvent(new CustomEvent('divina:finish-ready', {
      detail:Object.freeze({
        version:VERSION,
        macroStage:'4/4',
        skins:SKIN_REGISTRY_V12.skins.length,
        registryValid:this.registryValid,
        quality:this.tier,
        createsOrb:false,
        unlocksSkins:false,
        activeUniverse:'v520',
        approvedFlame:'v516-preserved'
      })
    }));
  }

  applyPalette(requested, { animate=true } = {}) {
    const id = activeSkinId(requested);
    const skin = skinByIdV12(id);
    const finish = FINISH[id] || FINISH.classic;
    const html = document.documentElement;

    if (animate) {
      const origin = skinOrigin(id);
      this.veil?.style.setProperty('--db518-origin-x', `${Math.round(origin.x)}px`);
      this.veil?.style.setProperty('--db518-origin-y', `${Math.round(origin.y)}px`);
      this.veil?.classList.remove('is-committing');
      void this.veil?.offsetWidth;
    }

    const tokens = {
      '--db-skin-accent':skin.tokens?.accent || '#a565d6',
      '--db-skin-light':skin.tokens?.light || '#f0d68a',
      '--db-supreme-gold':finish.gold,
      '--db-supreme-hot':finish.light || skin.tokens?.light || '#fff8ec',
      '--db-supreme-violet':skin.tokens?.accent || finish.mist,
      '--db-supreme-pink':finish.spark,
      '--db-supreme-blue':finish.cool,
      '--db502-gold':finish.gold,
      '--db502-gold-hot':skin.tokens?.light || '#fff4cf',
      '--db502-violet':skin.tokens?.accent || finish.mist,
      '--db502-pink':finish.spark,
      '--db502-blue':finish.cool,
      '--db518-accent':skin.tokens?.accent || '#a565d6',
      '--db518-light':skin.tokens?.light || '#f0d68a',
      '--db518-gold':finish.gold,
      '--db518-deep':finish.deep,
      '--db518-mist':finish.mist,
      '--db518-spark':finish.spark,
      '--db518-cool':finish.cool
    };
    for (const [name, value] of Object.entries(tokens)) html.style.setProperty(name, value);

    this.activeSkin = id;
    html.dataset.finishSkin = id;
    document.body?.setAttribute('data-finish-skin', id);
    (globalThis.divinaLivingUniverseV520 || globalThis.divinaLivingUniverseV519 || globalThis.divinaLivingUniverseV516)?.syncPalette?.(true);
    (globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme)?.syncSkin?.(id);

    if (animate && !reducedMotion()) {
      this.veil?.classList.add('is-committing');
      clearTimeout(this.skinTimer);
      this.skinTimer = setTimeout(() => this.veil?.classList.remove('is-committing'), 520);
    }
    return id;
  }

  beginSkin(detail = {}) {
    const id = activeSkinId(detail.id);
    const html = document.documentElement;
    const origin = skinOrigin(id);
    this.veil?.style.setProperty('--db518-origin-x', `${Math.round(origin.x)}px`);
    this.veil?.style.setProperty('--db518-origin-y', `${Math.round(origin.y)}px`);
    html.dataset.skinFinishTransaction = 'preparing';
    html.classList.add('db518-skin-changing');
    document.querySelector('#skinsApp')?.setAttribute('aria-busy', 'true');
  }

  settleSkin(detail = {}) {
    this.applyPalette(detail.id, { animate:true });
    const html = document.documentElement;
    html.dataset.skinFinishTransaction = 'committed';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      html.classList.remove('db518-skin-changing');
      delete html.dataset.skinFinishTransaction;
      document.querySelector('#skinsApp')?.removeAttribute('aria-busy');
    }));
  }

  finishSkin(detail = {}) {
    const id = activeSkinId(detail.id);
    if (id !== this.activeSkin) this.applyPalette(id, { animate:false });
    const html = document.documentElement;
    html.classList.remove('db518-skin-changing');
    delete html.dataset.skinFinishTransaction;
    document.querySelector('#skinsApp')?.removeAttribute('aria-busy');
  }

  markMotion(duration = 760) {
    const html = document.documentElement;
    html.classList.add('db518-motion-critical');
    clearTimeout(this.motionTimer);
    this.motionTimer = setTimeout(() => html.classList.remove('db518-motion-critical'), duration);
  }

  setTier(next, reason = 'adaptive') {
    const baseIndex = QUALITY_ORDER.indexOf(this.baseTier);
    const requestedIndex = QUALITY_ORDER.indexOf(next);
    const index = clamp(requestedIndex < 0 ? 1 : requestedIndex, 0, Math.max(0, baseIndex));
    const tier = QUALITY_ORDER[index];
    if (tier === this.tier) return false;
    this.tier = tier;
    document.documentElement.dataset.visualQuality = tier;
    this.applyBudget(reason);
    document.dispatchEvent(new CustomEvent('divina:visual-quality', {
      detail:Object.freeze({ version:VERSION, tier, baseTier:this.baseTier, reason })
    }));
    return true;
  }

  applyBudget(reason = 'adaptive') {
    const universe = globalThis.divinaLivingUniverseV520 || globalThis.divinaLivingUniverseV519 || globalThis.divinaLivingUniverseV516;
    const mobile = innerWidth < 700;
    const budgets = {
      cinematic:{ fps:60, scale:mobile ? 0.72 : 0.80 },
      balanced:{ fps:60, scale:mobile ? 0.66 : 0.74 },
      protected:{ fps:reducedMotion() ? 24 : 40, scale:0.54 }
    };
    const budget = budgets[this.tier];
    document.documentElement.dataset.visualQuality = this.tier;
    if (!universe?.resize) return budget;

    if (typeof universe.setPerformanceBudget === 'function') {
      universe.setPerformanceBudget({ fps:budget.fps, scale:budget.scale, profile:this.tier });
    } else {
      const changed = Math.abs(Number(universe.scale || 0) - budget.scale) > 0.015;
      universe.targetFps = budget.fps;
      universe.scale = budget.scale;
      if (changed) universe.resize();
    }
    if (universe.root) {
      universe.root.dataset.adaptiveQuality = this.tier;
      universe.root.dataset.budgetReason = reason;
    }
    return budget;
  }

  observeLongTasks() {
    if (typeof PerformanceObserver !== 'function'
      || !PerformanceObserver.supportedEntryTypes?.includes('longtask')) return;
    try {
      this.longTaskObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const duration = Math.round(entry.duration || 0);
          this.longTaskCount += 1;
          this.longTaskMs += duration;
          this.totalLongTasks += 1;
          this.totalLongTaskMs += duration;
        }
      });
      this.longTaskObserver.observe({ type:'longtask' });
    } catch {}
  }

  scheduleMonitor() {
    clearTimeout(this.monitorTimer);
    this.monitorTimer = setTimeout(() => {
      if (!document.hidden) this.evaluateWindow();
      else {
        this.longTaskCount = 0;
        this.longTaskMs = 0;
      }
      this.scheduleMonitor();
    }, MONITOR_MS);
  }

  evaluateWindow() {
    const severe = this.longTaskMs >= 650 || this.longTaskCount >= 7;
    const pressured = this.longTaskMs >= 240 || this.longTaskCount >= 3;
    const index = QUALITY_ORDER.indexOf(this.tier);
    if (severe) {
      this.calmWindows = 0;
      this.setTier('protected', 'long-task-pressure');
    } else if (pressured) {
      this.calmWindows = 0;
      this.setTier(QUALITY_ORDER[Math.max(0, index - 1)], 'frame-pressure');
    } else {
      this.calmWindows += 1;
      if (this.calmWindows >= 4 && index < QUALITY_ORDER.indexOf(this.baseTier)) {
        this.calmWindows = 0;
        this.setTier(QUALITY_ORDER[index + 1], 'calm-recovery');
      }
    }
    this.longTaskCount = 0;
    this.longTaskMs = 0;
    this.assertIntegrity();
  }

  assertIntegrity() {
    const living = document.querySelectorAll('[data-supreme-orb="living"]');
    const canvases = document.querySelectorAll('#divinaLivingUniverseV520 canvas, #divinaLivingUniverseV519 canvas, #divinaLivingUniverseV516 canvas');
    document.documentElement.dataset.orbIntegrityV518 = living.length <= 1 ? 'one' : 'duplicate-detected';
    document.documentElement.dataset.universeIntegrityV518 = canvases.length <= 1 ? 'one-canvas' : 'duplicate-detected';
    return { living:living.length, universeCanvases:canvases.length };
  }

  bind() {
    const signal = this.abort.signal;
    document.addEventListener('divina:skin-preparing', event => this.beginSkin(event.detail), { signal });
    document.addEventListener('divina:skin-applied', event => this.settleSkin(event.detail), { signal });
    document.addEventListener('divina:skin-settled', event => this.finishSkin(event.detail), { signal });
    document.addEventListener('divina:runtime-ready', () => this.applyPalette(activeSkinId(), { animate:false }), { signal });
    addEventListener('divina:performance-tier', event => {
      this.baseTier = event.detail?.tier === 'constrained' ? 'protected' : baseQuality();
      if (QUALITY_ORDER.indexOf(this.tier) > QUALITY_ORDER.indexOf(this.baseTier)) {
        this.setTier(this.baseTier, 'performance-core-sync');
      }
    }, { signal });
    document.addEventListener('divina:route-start', () => this.markMotion(860), { signal });
    document.addEventListener('divina:supreme-orb-will-navigate', () => this.markMotion(920), { signal });
    document.addEventListener('tarot:supreme-revealed', () => this.markMotion(1160), { signal });
    document.addEventListener('divina:menu-state', event => {
      if (/opening|closing/.test(event.detail?.state || '')) this.markMotion(520);
    }, { signal });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.applyBudget('visibility-return');
        this.applyPalette(activeSkinId(), { animate:false });
      }
    }, { signal });
    addEventListener('resize', () => this.applyBudget('viewport'), { passive:true, signal });
    addEventListener('pageshow', () => {
      this.applyBudget('pageshow');
      this.assertIntegrity();
    }, { passive:true, signal });
    connection()?.addEventListener?.('change', () => {
      this.baseTier = baseQuality();
      this.setTier(this.baseTier, 'connection-change');
    }, { signal });
  }

  status() {
    const integrity = this.assertIntegrity();
    return Object.freeze({
      version:VERSION,
      macroStage:'4/4',
      registryVersion:SKIN_REGISTRY_V12.version,
      skinCount:SKIN_REGISTRY_V12.skins.length,
      uniqueSkinCount:new Set(SKIN_REGISTRY_V12.skins.map(skin => skin.id)).size,
      registryValid:this.registryValid,
      activeSkin:this.activeSkin,
      paletteAuthority:'skin-performance-core-v518',
      textureAuthority:'runtime-v12',
      entitlementAuthority:'account-server',
      unlocksSkins:false,
      createsOrb:false,
      physicalLivingOrbs:integrity.living,
      universeCanvases:integrity.universeCanvases,
      activeUniverseFile:'v520',
      approvedFlameLineage:'v516-preserved-inside-v520',
      quality:this.tier,
      baseQuality:this.baseTier,
      longTasks:Object.freeze({ count:this.totalLongTasks, totalMs:this.totalLongTaskMs }),
      continuousAnimationLoops:0,
      extraApiCalls:0,
      webVibration:false
    });
  }

  destroy() {
    this.abort.abort();
    clearTimeout(this.monitorTimer);
    clearTimeout(this.motionTimer);
    clearTimeout(this.skinTimer);
    this.longTaskObserver?.disconnect();
    this.veil?.remove();
    const html = document.documentElement;
    html.classList.remove('db518-motion-critical', 'db518-skin-changing');
    delete html.dataset.skinFinish;
    delete html.dataset.skinRegistryV518;
    delete html.dataset.visualQuality;
    delete html.dataset.finishSkin;
    delete html.dataset.orbIntegrityV518;
    delete html.dataset.universeIntegrityV518;
    delete globalThis.divinaSkinPerformanceV518;
    delete globalThis[INSTANCE];
  }
}

export function installSkinPerformanceCoreV518() {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const instance = new SkinPerformanceCoreV518();
  globalThis[INSTANCE] = instance;
  globalThis.divinaSkinPerformanceV518 = instance;
  return instance;
}
