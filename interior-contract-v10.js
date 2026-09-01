// Contrato visual para interiores. Apenas cria marcações; não substitui conteúdo existente.
export function decoratePageWorld(section, config = {}) {
  if (!section) return null;
  section.classList.add('db-page-world');
  if (config.world) section.dataset.pageWorld = config.world;
  section.setAttribute('data-design-version', 'V10');
  return section;
}

export function createLoadingState(root = document) {
  const el = root.createElement('div');
  el.className = 'db-page-world__loading';
  el.setAttribute('role', 'status');
  el.textContent = 'A Orbe está abrindo este mundo…';
  return el;
}
