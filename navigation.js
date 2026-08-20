export function createNavigation() {
  const screens = [...document.querySelectorAll('.screen')];
  const drawer = document.querySelector('#drawer');
  const go = (id, push = true) => {
    if (!document.getElementById(id)) id = 'home';
    screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.dataset.screen = id;
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (push) history.pushState({ screen: id }, '', id === 'home' ? './' : `#${id}`);
  };
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    if (target) go(target.dataset.go);
  });
  document.querySelector('#menuBtn').addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); });
  document.querySelector('#closeMenu').addEventListener('click', () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); });
  drawer.addEventListener('click', event => { if (event.target === drawer) document.querySelector('#closeMenu').click(); });
  addEventListener('popstate', () => go(location.hash.slice(1) || 'home', false));
  go(location.hash.slice(1) || 'home', false);
  return { go };
}
