/* DIVINA BRUXA — ORBE 2.0 V209 · RESILIÊNCIA E AUTORIDADE DE TEXTURA
   WORK7.0 — preserva integralmente visual, shader, gestos e navegação V208.
   Este módulo não cria renderer, loop, gesto ou textura paralelos.
*/

import { preloadSkinAsset, preparedSkinImage } from './skin-universal-v10.js?v=133';

const STATE_KEY = Symbol.for('divina.orb.v209.state');
const html = document.documentElement;

const absoluteUrl = source => {
  try { return new URL(source, document.baseURI).href; }
  catch { return String(source || ''); }
};

const nextFrame = task => requestAnimationFrame(() => {
  try { task(); } catch (error) { console.warn('[Divina V209] reconciliação adiada', error); }
});

function temporarilySuppressLegacyContextListener(canvas, task) {
  if (!canvas || typeof canvas.addEventListener !== 'function') return task();
  const hadOwn = Object.prototype.hasOwnProperty.call(canvas, 'addEventListener');
  const previous = canvas.addEventListener;
  try {
    canvas.addEventListener = function v209AddEventListener(type, listener, options) {
      if (type === 'webglcontextlost') return undefined;
      return previous.call(this, type, listener, options);
    };
    return task();
  } finally {
    try {
      if (hadOwn) canvas.addEventListener = previous;
      else delete canvas.addEventListener;
    } catch {
      canvas.addEventListener = previous;
    }
  }
}

function currentEngine() {
  return window.divinaOrbV208?.engine || window.divinaOrbV209?.engine || null;
}

function uploadPreparedTexture(engine, source, image, token) {
  const state = engine?.[STATE_KEY];
  if (!engine || !state || engine.destroyed || token !== state.textureToken) return false;

  engine.imageSource = source;
  engine.image = image;
  state.desiredSource = source;
  state.preparedSource = absoluteUrl(source);

  const gl = engine.gl;
  const texture = engine.texture;
  if (!gl || !texture || gl.isContextLost?.() || state.contextLost) {
    state.pendingAfterRestore = true;
    return false;
  }

  try {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    state.appliedSource = absoluteUrl(source);
    state.pendingAfterRestore = false;
    html.dataset.orbTexture = 'v209-ready';
    html.dataset.orbRecovery = 'ready';
    engine.requestFrame?.();
    engine.canvas?.dispatchEvent(new CustomEvent('divina:orb-texture-applied', {
      detail: { src: state.appliedSource, authority: 'orb-engine-v209' }
    }));
    return true;
  } catch (error) {
    state.pendingAfterRestore = true;
    html.dataset.orbTexture = 'v209-pending';
    console.warn('[Divina V209] textura aguardará recuperação do contexto', error);
    return false;
  }
}

async function replaceTextureAtomically(engine, source) {
  const state = engine?.[STATE_KEY];
  if (!state || !source || engine.destroyed) return false;

  const absolute = absoluteUrl(source);
  if (!absolute) return false;
  if (absolute === state.appliedSource && engine.gl && engine.texture && !state.contextLost) return true;

  const token = ++state.textureToken;
  state.desiredSource = source;
  html.dataset.orbTexture = 'v209-preparing';

  let image = preparedSkinImage(source);
  try {
    if (!image) image = await preloadSkinAsset(source, { priority: 'high' });
  } catch (error) {
    if (token === state.textureToken) {
      html.dataset.orbTexture = state.appliedSource ? 'v209-ready' : 'v209-fallback';
      document.dispatchEvent(new CustomEvent('divina:orb-texture-error', {
        detail: { src: absolute, recoverable: true }
      }));
    }
    return false;
  }

  if (token !== state.textureToken || engine.destroyed || !image?.naturalWidth) return false;
  return uploadPreparedTexture(engine, source, image, token);
}

function reconcile(engine, reason = 'lifecycle') {
  const state = engine?.[STATE_KEY];
  if (!state || engine.destroyed || !engine.canvas?.isConnected) return;
  if (document.visibilityState === 'hidden') return;

  nextFrame(() => {
    if (engine.destroyed || !engine.canvas?.isConnected) return;
    try { engine.resize?.(); } catch {}
    const source = state.desiredSource || engine.imageSource || html.dataset.orbImage;
    const glLost = engine.gl?.isContextLost?.() || state.contextLost;
    if (!glLost && source && absoluteUrl(source) !== state.appliedSource) {
      replaceTextureAtomically(engine, source);
    }
    engine.requestFrame?.();
    html.dataset.orbRecovery = `ready-${reason}`;
  });
}

async function restoreContext(engine) {
  const state = engine?.[STATE_KEY];
  if (!state || engine.destroyed || state.restoring) return;
  state.restoring = true;
  state.contextLost = false;
  html.dataset.orbRecovery = 'restoring';

  try {
    temporarilySuppressLegacyContextListener(engine.canvas, () => engine.setupWebGL?.());
    engine.resize?.();
    engine.ready = true;
    engine.shell?.classList.remove('orb-loading', 'webgl-fallback');
    engine.shell?.classList.add('orb-live');
    const source = state.desiredSource || engine.imageSource || html.dataset.orbImage;
    if (source) {
      state.appliedSource = '';
      await replaceTextureAtomically(engine, source);
    }
    engine.requestFrame?.();
    html.dataset.orbRecovery = 'ready';
    document.dispatchEvent(new CustomEvent('divina:orb-context-recovered', {
      detail: { version: 209 }
    }));
  } catch (error) {
    html.dataset.orbRecovery = 'fallback';
    try { engine.fallback?.('contexto'); } catch {}
    document.dispatchEvent(new CustomEvent('divina:orb-context-recovery-error', {
      detail: { version: 209, recoverable: true }
    }));
  } finally {
    state.restoring = false;
  }
}

export function installOrbResilienceV209(engine = currentEngine()) {
  if (!engine?.canvas || engine.destroyed) return null;
  if (engine[STATE_KEY]?.installed) return engine[STATE_KEY].publicApi;

  const state = {
    installed: true,
    textureToken: 0,
    desiredSource: engine.imageSource || html.dataset.orbImage || '',
    preparedSource: '',
    appliedSource: engine.imageSource ? absoluteUrl(engine.imageSource) : '',
    pendingAfterRestore: false,
    contextLost: false,
    restoring: false,
    lifecycleFrame: 0,
    cleanup: []
  };
  engine[STATE_KEY] = state;

  engine.replaceTexture = source => replaceTextureAtomically(engine, source);

  const onContextLost = () => {
    state.contextLost = true;
    state.pendingAfterRestore = true;
    state.appliedSource = '';
    html.dataset.orbRecovery = 'context-lost';
  };
  const onContextRestored = () => restoreContext(engine);
  engine.canvas.addEventListener('webglcontextlost', onContextLost, { passive: true });
  engine.canvas.addEventListener('webglcontextrestored', onContextRestored, { passive: true });
  state.cleanup.push(() => engine.canvas.removeEventListener('webglcontextlost', onContextLost));
  state.cleanup.push(() => engine.canvas.removeEventListener('webglcontextrestored', onContextRestored));

  const scheduleReconcile = reason => {
    cancelAnimationFrame(state.lifecycleFrame);
    state.lifecycleFrame = requestAnimationFrame(() => {
      state.lifecycleFrame = 0;
      reconcile(engine, reason);
    });
  };
  const onVisibility = () => {
    if (document.visibilityState === 'visible') scheduleReconcile('visible');
  };
  const onPageShow = event => scheduleReconcile(event.persisted ? 'bfcache' : 'pageshow');
  const onResize = () => scheduleReconcile('resize');
  const onOrientation = () => scheduleReconcile('orientation');

  document.addEventListener('visibilitychange', onVisibility, { passive: true });
  window.addEventListener('pageshow', onPageShow, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onOrientation, { passive: true });
  state.cleanup.push(() => document.removeEventListener('visibilitychange', onVisibility));
  state.cleanup.push(() => window.removeEventListener('pageshow', onPageShow));
  state.cleanup.push(() => window.removeEventListener('resize', onResize));
  state.cleanup.push(() => window.removeEventListener('orientationchange', onOrientation));

  const originalDestroy = typeof engine.destroy === 'function' ? engine.destroy.bind(engine) : null;
  if (originalDestroy) {
    engine.destroy = () => {
      cancelAnimationFrame(state.lifecycleFrame);
      state.textureToken += 1;
      for (const dispose of state.cleanup.splice(0)) {
        try { dispose(); } catch {}
      }
      state.installed = false;
      originalDestroy();
    };
  }

  state.publicApi = Object.freeze({
    version: 209,
    replaceTexture: source => replaceTextureAtomically(engine, source),
    reconcile: reason => reconcile(engine, reason || 'manual'),
    snapshot: () => Object.freeze({
      contextLost: state.contextLost,
      restoring: state.restoring,
      desiredSource: absoluteUrl(state.desiredSource),
      appliedSource: state.appliedSource,
      fallback: engine.shell?.classList.contains('webgl-fallback') || false
    })
  });

  html.dataset.orbAuthority = 'v209';
  reconcile(engine, 'install');
  return state.publicApi;
}

export function getOrbResilienceV209() {
  const engine = currentEngine();
  return engine?.[STATE_KEY]?.publicApi || null;
}
