/* DIVINA BRUXA — HOME RECOVERY V587
   Substitui SOMENTE cosmic-visual-atlas-v1.js.
   Preserva a função legado V300 e adiciona um fail-open cirúrgico para
   impedir que a Home fique presa eternamente em "Despertando a Divina Bruxa…".
   Não altera Tarot Livre, Carta do Dia, WORK12, Orbe, balões ou conteúdo.
*/

document.documentElement.dataset.legacyCosmicAtlas = 'retired-v300';
document.dispatchEvent(new CustomEvent('divina:legacy-atlas-retired', { detail:{ version:300 } }));

(() => {
  const VERSION = 'v587-home-recovery';
  const root = document.documentElement;
  let released = false;
  let timer = 0;

  const appIsReady = () =>
    Boolean(root.dataset.appShell) ||
    Boolean(document.body?.dataset?.screen) ||
    Boolean(document.querySelector('#app .screen.active:not(#home)'));

  const forceHomeVisible = () => {
    const body = document.body;
    const app = document.getElementById('app');
    const home = document.getElementById('home');

    if (app) {
      app.removeAttribute('aria-hidden');
      app.style.removeProperty('display');
      app.style.removeProperty('visibility');
      app.style.removeProperty('opacity');
      app.style.removeProperty('pointer-events');
    }

    if (home && !document.querySelector('#app .screen.active')) {
      home.classList.add('active');
      home.removeAttribute('aria-hidden');
    }

    if (body && !body.dataset.screen) body.dataset.screen = 'home';
  };

  const releaseLoader = (reason = 'timeout') => {
    if (released || appIsReady()) return false;
    released = true;
    clearTimeout(timer);

    const portal = document.getElementById('orbLoadingPortal');

    root.dataset.homeRecovery = VERSION;
    root.dataset.homeRecoveryReason = reason;

    forceHomeVisible();

    if (portal) {
      portal.classList.remove(
        'is-visible',
        'is-mounted',
        'is-recovery',
        'is-boot-error',
        'is-refreshing'
      );
      portal.setAttribute('aria-hidden', 'true');
      portal.style.pointerEvents = 'none';
      portal.style.transition = 'opacity 180ms ease';
      portal.style.opacity = '0';

      setTimeout(() => {
        if (!portal) return;
        portal.hidden = true;
        portal.style.display = 'none';
      }, 190);
    }

    document.body?.classList.remove(
      'is-loading',
      'db-loading',
      'loading',
      'boot-loading',
      'orb-loading'
    );

    try {
      document.dispatchEvent(new CustomEvent('divina:loading-bypass', {
        detail: { source: VERSION, reason }
      }));
      document.dispatchEvent(new CustomEvent('divina:home-recovered', {
        detail: { version: 587, reason }
      }));
    } catch {}

    console.warn(`[Divina ${VERSION}] Home liberada por fail-open: ${reason}`);
    return true;
  };

  const arm = () => {
    if (appIsReady()) return;

    // Se o app principal terminar normalmente, o recovery não interfere.
    addEventListener('divina:boot-ready', () => {
      clearTimeout(timer);
      released = true;
      root.dataset.homeRecovery = 'not-needed';
    }, { once: true });

    // O botão existente deixa de recarregar em loop e passa a abrir a Home.
    document.addEventListener('click', event => {
      const button = event.target?.closest?.('.db-orb-loader__recovery');
      if (!button || appIsReady()) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      releaseLoader('manual');
    }, true);

    // Erro de módulo/script durante o boot: libera a interface em vez de prender.
    addEventListener('error', event => {
      if (appIsReady()) return;
      const target = event?.target;
      const isBootAsset =
        target?.tagName === 'SCRIPT' ||
        target?.id === 'divinaAppModule' ||
        String(event?.filename || '').includes('.js');
      if (isBootAsset) setTimeout(() => releaseLoader('boot-error'), 120);
    }, true);

    addEventListener('unhandledrejection', () => {
      if (!appIsReady()) setTimeout(() => releaseLoader('promise-error'), 120);
    }, { once: true });

    // Limite absoluto: a Home nunca pode ficar eternamente no loader.
    timer = setTimeout(() => releaseLoader('timeout'), 6200);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  } else {
    arm();
  }
})();
