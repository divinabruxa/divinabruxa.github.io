// Motor de contrato das skins V10. A inicialização é explícita para evitar regressões.
export function applySkinContract({ id, registry, root = document } = {}) {
  if (!id || !registry) return false;
  const skin = (registry.skins || []).find(item => item.id === id) || registry.fallbackSkin;
  if (!skin) return false;
  root.documentElement.dataset.skin = skin.id;
  for (const [key, value] of Object.entries(skin.tokens || {})) {
    root.documentElement.style.setProperty(`--db-skin-${key}`, value);
  }
  for (const orb of root.querySelectorAll('[data-orb-surface]')) {
    const surface = orb.dataset.orbSurface;
    const source = skin.surfaces?.[surface];
    if (source) {
      if ('src' in orb) orb.src = source;
      else orb.style.backgroundImage = `url("${source}")`;
    }
    orb.dataset.skin = skin.id;
  }
  root.dispatchEvent(new CustomEvent('divina:skin-applied', { detail: { id: skin.id } }));
  return true;
}

export function readStoredSkin(storage = localStorage, key = 'divina.skin.v10') {
  try { return storage.getItem(key) || null; } catch { return null; }
}
