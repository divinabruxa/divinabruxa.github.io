/* DIVINA BRUXA — WORK12 · PONTE DE RECUPERAÇÃO V589
   Mantém o atlas legado aposentado. Na V589 o único guardião de boot vive no
   shell do WORK12; o recovery V588 só permanece como proteção de instalação
   parcial enquanto os arquivos novos ainda não chegaram juntos.
*/

document.documentElement.dataset.legacyCosmicAtlas = 'retired-v300';
document.dispatchEvent(new CustomEvent('divina:legacy-atlas-retired', { detail:{ version:300 } }));

(() => {
  const VERSION = 'v588';
  const root = document.documentElement;
  const managedByWork12 = document.querySelector('meta[name="divina-work12"][content="V589"]');
  if (managedByWork12) {
    root.dataset.homeRecovery = 'delegated-work12-v589';
    root.dataset.homeRecoveryReason = 'single-boot-guardian';
    return;
  }
  let opened = false;
  let timer = 0;

  const portal = () => document.getElementById('orbLoadingPortal');

  const showHome = reason => {
    if (opened) return;
    opened = true;
    clearTimeout(timer);

    const p = portal();
    const body = document.body;
    const app = document.getElementById('app');
    const home = document.getElementById('home');

    root.dataset.homeRecovery = VERSION;
    root.dataset.homeRecoveryReason = reason;

    if (app) {
      app.hidden = false;
      app.removeAttribute('aria-hidden');
      app.style.removeProperty('display');
      app.style.removeProperty('visibility');
      app.style.removeProperty('opacity');
      app.style.removeProperty('pointer-events');
    }

    if (home) {
      home.hidden = false;
      home.classList.add('active');
      home.removeAttribute('aria-hidden');
      home.style.removeProperty('display');
      home.style.removeProperty('visibility');
      home.style.removeProperty('opacity');
    }

    if (body && !body.dataset.screen) body.dataset.screen = 'home';

    if (p) {
      p.setAttribute('aria-hidden', 'true');
      p.classList.remove('is-visible','is-mounted','is-recovery','is-boot-error','is-refreshing');
      p.style.setProperty('opacity', '0', 'important');
      p.style.setProperty('visibility', 'hidden', 'important');
      p.style.setProperty('pointer-events', 'none', 'important');
      setTimeout(() => {
        p.hidden = true;
        p.style.setProperty('display', 'none', 'important');
      }, 180);
    }

    document.body?.classList.remove(
      'is-loading','db-loading','loading','boot-loading','orb-loading'
    );

    try {
      document.dispatchEvent(new CustomEvent('divina:loading-bypass', {
        detail: { source:'home-fail-open-v588', reason }
      }));
      document.dispatchEvent(new CustomEvent('divina:home-recovered', {
        detail: { version:588, reason }
      }));
    } catch {}

    console.warn(`[Divina V588] Home liberada: ${reason}`);
  };

  const bootSucceeded = () => {
    clearTimeout(timer);
    opened = true;
    root.dataset.homeRecovery = 'not-needed-v588';
  };

  const arm = () => {
    // Se o boot verdadeiro terminar primeiro, não tocamos em nada.
    document.addEventListener('divina:boot-ready', bootSucceeded, { once:true });

    // O botão do loader agora SEMPRE abre a página — nunca entra em loop infinito.
    document.addEventListener('click', event => {
      const button = event.target?.closest?.('.db-orb-loader__recovery');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      showHome('manual');
    }, true);

    // Falha de módulo/script: liberamos a Home imediatamente.
    addEventListener('error', event => {
      if (opened) return;
      const target = event?.target;
      const bootAsset =
        target?.tagName === 'SCRIPT' ||
        target?.id === 'divinaAppModule' ||
        String(event?.filename || '').includes('.js');
      if (bootAsset) setTimeout(() => showHome('boot-error'), 100);
    }, true);

    addEventListener('unhandledrejection', () => {
      if (!opened) setTimeout(() => showHome('promise-error'), 100);
    }, { once:true });

    // Limite duro. Se a aplicação principal não concluiu em 4,5s,
    // a usuária vê a Home mesmo assim.
    timer = setTimeout(() => showHome('hard-timeout'), 4500);

    // Se o SW V588 assumir, limpa o loader já na sessão atual.
    navigator.serviceWorker?.addEventListener('message', event => {
      if (event.data?.type === 'DIVINA_RECOVERY_ACTIVE' && !opened) {
        setTimeout(() => showHome('service-worker-recovery'), 150);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once:true });
  } else {
    arm();
  }
})();
