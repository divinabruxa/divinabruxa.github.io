/* DIVINA BRUXA — PORTAL UNIVERSAL DE CARREGAMENTO V1 · V137
   A Orbe da skin ativa guarda cada espera real sem interromper a navegação. */

const START_EVENT = 'divina:loading-start';
const END_EVENT = 'divina:loading-end';
const DEFAULT_SHOW_DELAY = 120;
const EXIT_DURATION = 180;

let requestSequence = 0;

function noopPortal() {
  return Object.freeze({
    start: () => '',
    end: () => {},
    track: task => {
      try {
        return Promise.resolve(typeof task === 'function' ? task() : task);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    destroy: () => {}
  });
}

function createElement(root, tag, className, text = '') {
  const element = root.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}

function buildPortal(root) {
  const existing = root.getElementById('orbLoadingPortal');
  if (existing) return existing;

  const portal = createElement(root, 'div', 'db-orb-loader');
  portal.id = 'orbLoadingPortal';
  portal.setAttribute('role', 'status');
  portal.setAttribute('aria-live', 'polite');
  portal.setAttribute('aria-atomic', 'true');
  portal.setAttribute('aria-hidden', 'true');

  const constellation = createElement(root, 'span', 'db-orb-loader__constellation');
  constellation.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 5; index += 1) constellation.append(createElement(root, 'i', ''));

  const altar = createElement(root, 'span', 'db-orb-loader__altar');
  const orbit = createElement(root, 'span', 'db-orb-loader__orbit');
  orbit.setAttribute('aria-hidden', 'true');
  const orb = createElement(root, 'span', 'db-orb-loader__orb');
  orb.dataset.orbSurface = 'loader';
  orb.setAttribute('aria-hidden', 'true');
  altar.append(orbit, orb);

  const copy = createElement(root, 'span', 'db-orb-loader__copy');
  copy.append(
    createElement(root, 'small', 'db-orb-loader__eyebrow', 'A ORBE ABRE O CAMINHO'),
    createElement(root, 'strong', 'db-orb-loader__message', 'Alinhando o próximo portal…'),
    createElement(root, 'span', 'db-orb-loader__whisper', 'Um instante entre as estrelas')
  );

  portal.append(constellation, altar, copy);
  root.body.append(portal);
  return portal;
}

function normalizeRequest(detail = {}) {
  const source = typeof detail === 'string' ? { id: detail } : detail;
  const id = source.id || `loading:${Date.now()}:${++requestSequence}`;
  const label = String(source.label || '').trim();
  const message = String(source.message || (label ? `Abrindo ${label}…` : 'Alinhando o próximo portal…')).trim();
  return { id, label, message };
}

export function createOrbLoadingPortal({ root = document, showDelay = DEFAULT_SHOW_DELAY } = {}) {
  if (!root?.body || !root.defaultView) return noopPortal();

  const view = root.defaultView;
  const html = root.documentElement;
  const portal = buildPortal(root);
  const message = portal.querySelector('.db-orb-loader__message');
  const active = new Map();
  let showTimer = 0;
  let hideTimer = 0;
  let frame = 0;
  let destroyed = false;

  const cancelTimer = name => {
    const timer = name === 'show' ? showTimer : hideTimer;
    if (timer) view.clearTimeout(timer);
    if (name === 'show') showTimer = 0;
    else hideTimer = 0;
  };

  const setMessage = request => {
    if (message && request?.message) message.textContent = request.message;
  };

  const reveal = () => {
    showTimer = 0;
    if (destroyed || active.size === 0) return;
    cancelTimer('hide');
    portal.classList.add('is-mounted');
    portal.setAttribute('aria-hidden', 'false');
    html.dataset.orbLoading = 'visible';
    if (frame) view.cancelAnimationFrame(frame);
    frame = view.requestAnimationFrame(() => {
      frame = 0;
      if (active.size) portal.classList.add('is-visible');
    });
  };

  const conceal = () => {
    cancelTimer('show');
    portal.classList.remove('is-visible');
    portal.setAttribute('aria-hidden', 'true');
    delete html.dataset.orbLoading;
    cancelTimer('hide');
    hideTimer = view.setTimeout(() => {
      hideTimer = 0;
      if (!active.size) portal.classList.remove('is-mounted');
    }, EXIT_DURATION);
  };

  const scheduleReveal = () => {
    if (portal.classList.contains('is-mounted')) {
      cancelTimer('hide');
      reveal();
      return;
    }
    if (!showTimer) showTimer = view.setTimeout(reveal, Math.max(0, showDelay));
  };

  const start = detail => {
    if (destroyed) return '';
    const request = normalizeRequest(detail);
    active.set(request.id, request);
    setMessage(request);
    scheduleReveal();
    return request.id;
  };

  const end = detail => {
    if (destroyed) return;
    const id = typeof detail === 'string' ? detail : detail?.id;
    if (!id || !active.delete(id)) return;
    if (active.size) {
      const requests = Array.from(active.values());
      setMessage(requests[requests.length - 1]);
      return;
    }
    conceal();
  };

  const track = (task, detail = {}) => {
    const id = start(detail);
    let result;
    try {
      result = typeof task === 'function' ? task() : task;
    } catch (error) {
      end(id);
      return Promise.reject(error);
    }
    return Promise.resolve(result).finally(() => end(id));
  };

  const onStart = event => start(event.detail);
  const onEnd = event => end(event.detail);
  let skinRequestId = '';
  const onSkinPreparing = () => {
    if (skinRequestId) end(skinRequestId);
    skinRequestId = start({
      id: `skin:${Date.now()}:${++requestSequence}`,
      message: 'Vestindo a nova realidade…'
    });
  };
  const onSkinFinished = () => {
    if (!skinRequestId) return;
    end(skinRequestId);
    skinRequestId = '';
  };
  root.addEventListener(START_EVENT, onStart);
  root.addEventListener(END_EVENT, onEnd);
  root.addEventListener('divina:skin-preparing', onSkinPreparing);
  root.addEventListener('divina:skin-settled', onSkinFinished);
  root.addEventListener('divina:skin-error', onSkinFinished);
  html.dataset.orbLoader = 'v137';

  return Object.freeze({
    start,
    end,
    track,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      active.clear();
      cancelTimer('show');
      cancelTimer('hide');
      if (frame) view.cancelAnimationFrame(frame);
      root.removeEventListener(START_EVENT, onStart);
      root.removeEventListener(END_EVENT, onEnd);
      root.removeEventListener('divina:skin-preparing', onSkinPreparing);
      root.removeEventListener('divina:skin-settled', onSkinFinished);
      root.removeEventListener('divina:skin-error', onSkinFinished);
      portal.remove();
      delete html.dataset.orbLoading;
      delete html.dataset.orbLoader;
    }
  });
}
