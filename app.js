/* DIVINA BRUXA — APLICATIVO V137 · PORTAL UNIVERSAL DE CARREGAMENTO */

import { CONFIG } from './config.js';
import { installRuntimeV12 } from './runtime-v12.js?v=133';
import { createNavigation } from './navigation.js?v=100';
import { RealityOrbEngine } from './orb-engine-v68.js?v=100';
import { bindMiniOrbs } from './mini-orb-engine.js?v=71';
import { AuthClient } from './auth-client-v6.js';
import { installVisualGuard } from './visual-guard-v6.js?v=134';
import { installTarotExperience } from './tarot-experience-v6.js';
import { SkinsEngine } from './skins-v6.js?v=133';
import { createPageLoader } from './page-loader-v1.js?v=137';
import { createOrbLoadingPortal } from './orb-loading-portal-v1.js?v=137';
import { installCosmicMedia } from './cosmic-media-v1.js?v=1341';

const $ = selector => document.querySelector(selector);
const toast = message => {
  const element = $('#toast');
  if (!element) {
    console.info('[Divina] toast:', message);
    return;
  }
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2400);
};

installRuntimeV12();
const { go } = createNavigation();
installVisualGuard();
installTarotExperience();
installCosmicMedia();
addEventListener('orbe:toast', event => toast(event.detail));

const authClient = new AuthClient(CONFIG);
window.divinaAuth = authClient;
new SkinsEngine($('#skinsApp'));
bindMiniOrbs();

const loadingPortal = createOrbLoadingPortal();
const pageLoader = createPageLoader({ config: CONFIG, go });
new RealityOrbEngine($('#orbCanvas'), {
  onOpen: () => pageLoader.go('tarot')
});

const bindSubmit = (selector, handler) => {
  const form = $(selector);
  if (form) form.onsubmit = handler;
};

bindSubmit('#userLogin', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements[0]?.value?.trim();
  const password = form.elements[1]?.value || '';
  if (!authClient.enabled) {
    toast('A conta será ativada quando o servidor seguro estiver conectado.');
    return;
  }
  if (!email || !password) {
    toast('Informe e-mail e senha.');
    return;
  }
  const result = await loadingPortal.track(
    () => authClient.login(email, password),
    { label: 'a sua conta' }
  );
  toast(result.ok
    ? 'Sessão iniciada com segurança.'
    : result.offline
      ? 'Servidor temporariamente indisponível.'
      : 'Não foi possível entrar.');
});

bindSubmit('#userRegister', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name?.value?.trim() || '';
  const email = form.elements.email?.value?.trim() || '';
  const password = form.elements.password?.value || '';
  const confirm = form.elements.confirm?.value || '';
  if (password !== confirm) {
    toast('As senhas não conferem.');
    return;
  }
  if (!authClient.enabled) {
    toast('O cadastro será ativado quando o servidor seguro estiver conectado.');
    return;
  }
  const result = await loadingPortal.track(
    () => authClient.register(email, password, name),
    { label: 'o seu novo universo' }
  );
  toast(result.ok
    ? 'Conta criada. Verifique seu e-mail.'
    : result.offline
      ? 'Servidor temporariamente indisponível.'
      : 'Não foi possível criar a conta.');
});

bindSubmit('#adminLogin', event => {
  event.preventDefault();
  const message = $('#adminMsg');
  if (message) {
    message.textContent = 'A administração exige autenticação no servidor seguro. Nenhum desbloqueio local é permitido no navegador público.';
  }
  toast('Administração disponível somente após conectar o servidor seguro.');
});

let installPrompt = null;
addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  const installButton = $('#installApp');
  if (installButton) installButton.hidden = false;
});

const installButton = $('#installApp');
if (installButton) {
  installButton.onclick = async () => {
    if (!installPrompt) {
      toast('No iPhone: Compartilhar → Adicionar à Tela de Início.');
      return;
    }
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
  };
}

if ('serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.info('[Divina] PWA registrado'))
      .catch(error => console.error('[Divina] falha ao registrar PWA', error));
  });
}

const skinsHeading = document.querySelector('#skins h2');
if (skinsHeading) skinsHeading.textContent = 'Trinta formas de sentir o universo.';

document.documentElement.dataset.appShell = 'v137';
window.divinaLoading = loadingPortal;
window.orbe = { go: pageLoader.go, loadPage: pageLoader.load, loading: loadingPortal };
