import { CONFIG } from '../data/config.js';
import { amazonSearchUrl, STORE_CATEGORIES, STORE_PRODUCTS } from '../data/store.js';

const FAVORITES_KEY = 'divina-bruxa-3.store-favorites.v1';

function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return new Set(Array.isArray(value) ? value.filter(id => STORE_PRODUCTS.some(product => product.id === id)) : []);
  } catch { return new Set(); }
}

export function createStoreWorld({ announce }) {
  const search = document.querySelector('#storeSearch');
  const categories = document.querySelector('#storeCategories');
  const favoriteToggle = document.querySelector('#storeFavorites');
  const count = document.querySelector('#storeCount');
  const grid = document.querySelector('#storeGrid');
  let category = 'Tudo';
  let onlyFavorites = false;
  let favorites = readFavorites();
  let ready = false;

  function saveFavorites() {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites])); } catch {}
  }

  function filtered() {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    return STORE_PRODUCTS.filter(product => {
      const inCategory = category === 'Tudo' || product.category === category;
      const isFavorite = !onlyFavorites || favorites.has(product.id);
      const haystack = `${product.name} ${product.category} ${product.description} ${product.tags.join(' ')}`.toLocaleLowerCase('pt-BR');
      return inCategory && isFavorite && (!query || haystack.includes(query));
    });
  }

  function renderProducts() {
    const products = filtered();
    count.textContent = `${products.length} ${products.length === 1 ? 'escolha encontrada' : 'escolhas encontradas'}`;
    favoriteToggle.querySelector('b').textContent = String(favorites.size);
    favoriteToggle.setAttribute('aria-pressed', String(onlyFavorites));
    grid.replaceChildren(...products.map(product => {
      const article = document.createElement('article');
      article.className = 'store-card';
      article.innerHTML = `
        <span class="store-card__symbol" aria-hidden="true">${product.symbol}</span>
        <small>${product.category}${product.featured ? ' · DESTAQUE' : ''}</small>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div>
          <button type="button" data-favorite="${product.id}" aria-pressed="${favorites.has(product.id)}" aria-label="${favorites.has(product.id) ? 'Remover' : 'Adicionar'} ${product.name} dos favoritos">${favorites.has(product.id) ? '♥' : '♡'}</button>
          <a href="${amazonSearchUrl(product.search, CONFIG.amazonAssociateTag)}" target="_blank" rel="sponsored noopener noreferrer">VER OPÇÕES <span aria-hidden="true">↗</span></a>
        </div>`;
      return article;
    }));
    if (!products.length) {
      const empty = document.createElement('p');
      empty.className = 'world-empty';
      empty.textContent = onlyFavorites ? 'Nenhuma escolha favorita corresponde a este filtro.' : 'Nenhuma escolha corresponde a esta busca.';
      grid.append(empty);
    }
  }

  function activate() {
    if (ready) return renderProducts();
    ready = true;
    categories.replaceChildren(...STORE_CATEGORIES.map(name => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = name;
      button.dataset.category = name;
      button.setAttribute('aria-pressed', String(name === category));
      return button;
    }));
    categories.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      category = button.dataset.category;
      categories.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      renderProducts();
    });
    search.addEventListener('input', renderProducts);
    favoriteToggle.addEventListener('click', () => { onlyFavorites = !onlyFavorites; renderProducts(); });
    grid.addEventListener('click', event => {
      const button = event.target.closest('[data-favorite]');
      if (!button) return;
      const id = button.dataset.favorite;
      if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
      saveFavorites();
      renderProducts();
      const product = STORE_PRODUCTS.find(item => item.id === id);
      announce(`${product?.name || 'Escolha'} ${favorites.has(id) ? 'guardada nos favoritos' : 'removida dos favoritos'}.`);
    });
    renderProducts();
  }

  return { activate };
}
