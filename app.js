import { LivingOrb } from './orb-engine.js?v=59';

const $ = selector => document.querySelector(selector);
const menu = $('#magicMenu');
const menuButton = $('#menuButton');
const closeButton = $('#closeMenu');
const toast = $('#toast');
let lastFocus = null;
const items = () => [...menu.querySelectorAll('button')].filter(item => !item.disabled && item.offsetParent !== null);
const showToast = message => { toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400); };
const setOpen = open => {
  menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', String(!open)); menuButton.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('menu-open', open); document.querySelector('#home').inert = open; document.querySelector('.bottom-dock').inert = open;
  if (open) requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
  else if (lastFocus?.focus) lastFocus.focus({ preventScroll: true });
};
const openMenu = () => { if (menu.classList.contains('open')) return; lastFocus = document.activeElement; setOpen(true); };
const closeMenu = () => setOpen(false);
menuButton.addEventListener('click', openMenu); closeButton.addEventListener('click', closeMenu);
menu.addEventListener('click', event => { if (event.target === menu) closeMenu(); });
document.addEventListener('keydown', event => {
  if (!menu.classList.contains('open')) return;
  if (event.key === 'Escape') return closeMenu();
  if (event.key === 'Tab') { const list = items(); const first = list[0], last = list[list.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
});
document.querySelectorAll('[data-home]').forEach(button => button.addEventListener('click', closeMenu));
document.querySelectorAll('[data-orb-ia]').forEach(button => button.addEventListener('click', () => { closeMenu(); showToast('A Orbe IA será ativada na próxima etapa.'); }));
document.querySelectorAll('[data-placeholder]').forEach(button => button.addEventListener('click', () => showToast(`${button.dataset.placeholder} será aberto na próxima etapa.`)));
$('#dockPaths').addEventListener('click', openMenu);
const orb = new LivingOrb($('#orbCanvas'), { onOpen: () => showToast('O Tarot Livre será aberto na próxima etapa.') });
window.orbe = { openMenu, closeMenu, orb };
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=59').catch(() => {}));
