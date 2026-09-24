import { SKINS, SKIN_COLLECTIONS, skinById } from './data/skins.js';
import { money } from './data/consultations.js';

const ACTIVE_KEY = 'divina-bruxa-3.active-skin.v1';

export function createSkinsWorld({ navigate, announce }) {
  const currentImage = document.querySelector('#skinCurrentImage');
  const currentName = document.querySelector('#skinCurrentName');
  const currentState = document.querySelector('#skinCurrentState');
  const classic = document.querySelector('#skinClassic');
  const search = document.querySelector('#skinSearch');
  const collections = document.querySelector('#skinCollections');
  const grid = document.querySelector('#skinsGrid');
  let collection = 'Todas';
  let active = 'classic';
  let ready = false;

  try { active = skinById(localStorage.getItem(ACTIVE_KEY)).id; } catch {}

  function applySkin(id, { persist = true } = {}) {
    const skin = skinById(id);
    active = skin.id;
    const path = `assets/skins/${skin.image}`;
    document.documentElement.style.setProperty('--skin-accent', skin.accent);
    document.documentElement.style.setProperty('--skin-light', skin.light);
    document.documentElement.style.setProperty('--db-skin-accent', skin.accent);
    document.documentElement.style.setProperty('--db-skin-light', skin.light);
    document.documentElement.dataset.skin = skin.id;
    document.documentElement.dataset.orbImage = path;
    document.body.dataset.skin = skin.id;
    const orbImage = document.querySelector('#orb img');
    if (orbImage) orbImage.src = path;
    currentImage.src = path;
    currentName.textContent = skin.name;
    currentState.textContent = skin.id === 'classic' ? 'Grátis para sempre e ativa neste aparelho.' : 'Prévia cosmética ativa neste aparelho. Disponível com a chave Premium.';
    classic.disabled = skin.id === 'classic';
    if (persist) try { localStorage.setItem(ACTIVE_KEY, skin.id); } catch {}
    renderGrid();
    document.dispatchEvent(new CustomEvent('divina:orb-image', { detail:{ src:path, skin:skin.id } }));
    document.dispatchEvent(new CustomEvent('divina:skin-change', {
      detail:{ id:skin.id, accent:skin.accent, light:skin.light, src:path }
    }));
    announce(`${skin.name} agora veste a Orbe neste aparelho.`);
  }

  function visibleSkins() {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    return SKINS.filter(skin => (collection === 'Todas' || skin.collection === collection) && (!query || `${skin.name} ${skin.collection}`.toLocaleLowerCase('pt-BR').includes(query)));
  }

  function renderGrid() {
    grid.replaceChildren(...visibleSkins().map(skin => {
      const article = document.createElement('article');
      article.className = `skin-card${skin.id === active ? ' is-active' : ''}`;
      article.setAttribute('role', 'listitem');
      if (skin.id === active) article.setAttribute('aria-current', 'true');
      article.style.setProperty('--card-accent', skin.accent);
      article.innerHTML = `
        <button class="skin-card__preview" type="button" data-preview="${skin.id}" aria-label="Experimentar ${skin.name}">
          <img src="assets/skins/${skin.image}" alt="" width="384" height="384" loading="lazy" decoding="async">
          <span>${skin.id === active ? 'ATIVA' : skin.id === 'classic' ? 'GRÁTIS' : 'PRÉVIA'}</span>
        </button>
        <div><small>${skin.collection}</small><h2>${skin.name}</h2><p>${skin.id === 'classic' ? 'Grátis para sempre' : `${money(skin.priceCents)} · compra única`}</p></div>
        <button type="button" data-skin="${skin.id}"${skin.id === active ? ' disabled' : ''}>${skin.id === active ? 'VIVENDO NA ORBE' : 'EXPERIMENTAR'}</button>`;
      return article;
    }));
  }

  function activate() {
    if (!ready) {
      ready = true;
      collections.replaceChildren(...SKIN_COLLECTIONS.map(name => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = name;
        button.dataset.collection = name;
        button.setAttribute('aria-pressed', String(name === collection));
        return button;
      }));
      collections.addEventListener('click', event => {
        const button = event.target.closest('[data-collection]');
        if (!button) return;
        collection = button.dataset.collection;
        collections.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        renderGrid();
      });
      search.addEventListener('input', renderGrid);
      grid.addEventListener('click', event => {
        const button = event.target.closest('[data-skin],[data-preview]');
        if (!button) return;
        applySkin(button.dataset.skin || button.dataset.preview);
      });
      classic.addEventListener('click', () => applySkin('classic'));
      const note = document.createElement('aside');
      note.className = 'skins-premium-passage';
      note.innerHTML = '<p><span aria-hidden="true">♢</span><b>As 30 skins fazem parte do Premium vitalício.</b><small>Experimentar muda apenas a aparência neste aparelho.</small></p><button type="button">CONHECER O PREMIUM</button>';
      note.querySelector('button').addEventListener('click', () => navigate('premium'));
      grid.after(note);
    }
    applySkin(active, { persist:false });
  }

  return { activate };
}
