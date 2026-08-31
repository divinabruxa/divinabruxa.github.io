import { CARDS } from './tarot-data.js';
import { escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js';
import { LIBRARY_PAGE_SIZE, cardPageHref, matchesLibraryFilters } from './card-library-policy.js';

const safe = value => escapeHTML(value ?? '');

export class CardLibraryEngine {
  constructor(root) {
    this.root = root;
    this.limit = LIBRARY_PAGE_SIZE;
    this.filters = { query: '', arcana: '', suit: '', element: '' };
    this.ensureMenuEntry();
    this.renderShell();
    this.renderCards();
  }

  ensureMenuEntry() {
    const rail = document.querySelector('.magic-menu-rail');
    if (!rail || rail.querySelector('[data-go="library"]')) return;
    const button = document.createElement('button');
    button.dataset.go = 'library';
    button.innerHTML = '<span>▤</span><strong>BIBLIOTECA DAS CARTAS</strong><small>78 significados profundos</small>';
    const daily = rail.querySelector('[data-go="daily"]');
    rail.insertBefore(button, daily || rail.firstChild);
  }

  renderShell() {
    this.root.innerHTML = `<div class="library-tools"><label class="library-search">Buscar carta<input type="search" data-library-query placeholder="Nome, naipe ou elemento" autocomplete="off"></label><label>Arcano<select data-library-arcana><option value="">Todos</option><option value="major">Arcanos Maiores</option><option value="minor">Arcanos Menores</option></select></label><label>Naipe<select data-library-suit><option value="">Todos</option><option>Copas</option><option>Espadas</option><option>Paus</option><option>Ouros</option></select></label><label>Elemento<select data-library-element><option value="">Todos</option><option>Água</option><option>Ar</option><option>Fogo</option><option>Terra</option></select></label></div><p class="library-status" data-library-status aria-live="polite"></p><div class="library-grid" data-library-grid></div><button class="text-button library-more" data-library-more hidden>Revelar mais cartas</button>`;
    const bind = (selector, key, event = 'change') => this.root.querySelector(selector).addEventListener(event, ({ target }) => { this.filters[key] = target.value; this.limit = LIBRARY_PAGE_SIZE; this.renderCards(); });
    bind('[data-library-query]', 'query', 'input');
    bind('[data-library-arcana]', 'arcana');
    bind('[data-library-suit]', 'suit');
    bind('[data-library-element]', 'element');
    this.root.querySelector('[data-library-more]').onclick = () => { this.limit += LIBRARY_PAGE_SIZE; this.renderCards(); };
  }

  renderCards() {
    const filtered = CARDS.filter(card => matchesLibraryFilters(card, this.filters));
    const visible = filtered.slice(0, this.limit);
    this.root.querySelector('[data-library-status]').textContent = `${filtered.length} ${filtered.length === 1 ? 'carta encontrada' : 'cartas encontradas'} · somente orientação direta`;
    this.root.querySelector('[data-library-grid]').innerHTML = visible.map((card, index) => `<article class="library-card"><a href="${cardPageHref(card)}" aria-label="Abrir significado profundo de ${safe(card.name)}">${cardImageMarkup(card, { priority: index < 3 ? 'high' : 'auto' })}<span>${safe(card.arcana === 'Arcano Maior' ? 'ARCANO MAIOR' : card.suit)}</span><h3>${safe(card.name)}</h3><p>${safe(card.element)} · DIRETA</p><b>LER CARTA →</b></a></article>`).join('') || `<p class="library-empty">Nenhuma carta encontrou esse caminho. Experimente outro nome ou filtro.</p>`;
    const more = this.root.querySelector('[data-library-more]');
    more.hidden = visible.length >= filtered.length;
    more.textContent = `Revelar mais cartas · ${visible.length}/${filtered.length}`;
  }
}
