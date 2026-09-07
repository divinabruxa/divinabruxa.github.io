/* DIVINA BRUXA V177 — ORDEM COMPLETA DOS ATALHOS DO MENU */
const enhanceCompleteMenu = () => {
  const row = document.querySelector('.home-menu-portals');
  if (!row || row.dataset.menuVersion === '177') return Boolean(row);

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

  row.dataset.menuVersion = '177';
  row.setAttribute('aria-label', 'Atalhos essenciais da Orbe');
  return true;
};

const installCompleteMenu = () => {
  if (enhanceCompleteMenu()) return;
  requestAnimationFrame(() => {
    if (enhanceCompleteMenu()) return;
    setTimeout(enhanceCompleteMenu, 120);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installCompleteMenu, { once: true });
} else {
  installCompleteMenu();
}
