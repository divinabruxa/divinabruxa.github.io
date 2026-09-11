/* DIVINA BRUXA V211 — MENU COMPLETO + PRECISÃO E ACESSIBILIDADE
   A ordem/visual V177 permanece. V211 acrescenta somente a camada não visual de interação. */
import { installMenuAccessibilityV211 } from './menu-accessibility-v211.js?v=211';

const enhanceCompleteMenu = () => {
  const row = document.querySelector('.home-menu-portals');
  if (!row) return false;

  const order = ['videos', 'library', 'daily', 'store', 'journal', 'skins', 'subscriptions', 'notifications'];
  const labels = {
    videos: 'Vídeos',
    library: 'Biblioteca 78 Cartas',
    daily: 'Carta do Dia',
    store: 'Loja Mística',
    journal: 'Diário',
    skins: 'Skins da Orbe',
    subscriptions: 'Premium',
    notifications: 'Notificações'
  };

  order.forEach(destination => {
    const button = row.querySelector(`[data-go="${destination}"]`);
    if (!button) return;
    const label = button.querySelector('b');
    if (label) label.textContent = labels[destination];
    button.setAttribute('aria-label', labels[destination]);
    row.append(button);
  });

  row.dataset.menuVersion = '211';
  row.setAttribute('aria-label', 'Atalhos essenciais da Orbe');
  return true;
};

const installCompleteMenu = () => {
  if (enhanceCompleteMenu()) return true;
  requestAnimationFrame(() => {
    if (enhanceCompleteMenu()) return;
    setTimeout(enhanceCompleteMenu, 120);
  });
  return false;
};

const installEditorialLinks = () => {
  const guides = document.querySelector('.magic-menu-guides');
  if (!guides || guides.dataset.editorialVersion === '181') return Boolean(guides);
  const privacyHeading = [...guides.querySelectorAll('strong')].find(item => item.textContent.trim() === 'PRIVACIDADE E DIREITOS');
  if (!privacyHeading) return false;
  const heading = document.createElement('strong');
  heading.textContent = 'VERDADE EDITORIAL';
  const policy = document.createElement('a');
  policy.href = 'politica-editorial.html';
  policy.textContent = 'Política editorial e correções';
  const sources = document.createElement('a');
  sources.href = 'fontes-e-referencias.html';
  sources.textContent = 'Fontes e referências';
  privacyHeading.before(heading, policy, sources);
  guides.dataset.editorialVersion = '181';
  return true;
};

const installV211 = () => {
  installCompleteMenu();
  installEditorialLinks();
  installMenuAccessibilityV211();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installV211, { once: true });
} else {
  installV211();
}
