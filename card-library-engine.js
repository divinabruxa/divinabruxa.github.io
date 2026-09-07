/* DIVINA BRUXA — BIBLIOTECA UNIVERSAL DAS 78 CARTAS V184 */
import { CARDS } from './tarot-data.js';
import { escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js';
import {
  LIBRARY_COMPARE_LIMIT,
  LIBRARY_PAGE_SIZE,
  cardContentId,
  cardKind,
  cardPageHref,
  matchesLibraryFilters,
  meaningForCard,
  sortLibraryCards
} from './card-library-policy.js?v=184';

const safe = value => escapeHTML(value ?? '');
const kinds = Object.freeze({ major: 'Arcano Maior', number: 'Carta numerada', court: 'Carta da corte' });

export class CardLibraryEngine {
  constructor(root, options = {}) {
    if (!root) throw new Error('A Biblioteca precisa de um destino válido.');
    this.root = root;
    this.mode = options.mode === 'standalone' ? 'standalone' : 'portal';
    this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
    this.filters = { query: '', arcana: '', suit: '', element: '', kind: '', order: 'journey' };
    this.comparison = [];
    this.ensureMenuEntry();
    this.renderShell();
    this.bind();
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
    this.root.dataset.libraryVersion = '184';
    this.root.innerHTML = `
      <nav class="library-paths" aria-label="Explorar famílias do Tarot">
        <button type="button" data-library-path="all" aria-pressed="true"><b>78</b><span>Todas</span></button>
        <button type="button" data-library-path="major"><b>22</b><span>Maiores</span></button>
        <button type="button" data-library-path="copas"><b>14</b><span>Copas</span></button>
        <button type="button" data-library-path="espadas"><b>14</b><span>Espadas</span></button>
        <button type="button" data-library-path="paus"><b>14</b><span>Paus</span></button>
        <button type="button" data-library-path="ouros"><b>14</b><span>Ouros</span></button>
        <button type="button" data-library-path="court"><b>16</b><span>Corte</span></button>
      </nav>
      <form class="library-tools" data-library-form role="search">
        <label class="library-search"><span>Buscar nas 78 cartas</span><input type="search" data-library-query placeholder="Nome, símbolo, palavra-chave…" autocomplete="off" spellcheck="false"></label>
        <label><span>Arcano</span><select data-library-arcana><option value="">Todos</option><option value="major">Maiores</option><option value="minor">Menores</option></select></label>
        <label><span>Naipe</span><select data-library-suit><option value="">Todos</option><option value="copas">Copas</option><option value="espadas">Espadas</option><option value="paus">Paus</option><option value="ouros">Ouros</option></select></label>
        <label><span>Elemento</span><select data-library-element><option value="">Todos</option><option value="agua">Água</option><option value="ar">Ar</option><option value="fogo">Fogo</option><option value="terra">Terra</option></select></label>
        <label><span>Tipo</span><select data-library-kind><option value="">Todos</option><option value="number">Numeradas</option><option value="court">Corte</option><option value="major">Maiores</option></select></label>
        <label><span>Ordem</span><select data-library-order><option value="journey">Jornada do Tarot</option><option value="name">Nome A–Z</option><option value="element">Elemento</option></select></label>
        <button type="reset" class="library-reset" data-library-reset>Limpar filtros</button>
      </form>
      <div class="library-result-head"><p class="library-status" data-library-status aria-live="polite"></p><p>Selecione até duas cartas para comparar símbolos.</p></div>
      <section class="library-compare" data-library-compare hidden aria-live="polite"></section>
      <div class="library-grid" data-library-grid></div>
      <button type="button" class="text-button library-more" data-library-more hidden>Mostrar mais cartas</button>`;
  }

  bind() {
    const controls = {
      query: ['[data-library-query]', 'input'],
      arcana: ['[data-library-arcana]', 'change'],
      suit: ['[data-library-suit]', 'change'],
      element: ['[data-library-element]', 'change'],
      kind: ['[data-library-kind]', 'change'],
      order: ['[data-library-order]', 'change']
    };
    for (const [key, [selector, event]] of Object.entries(controls)) {
      this.root.querySelector(selector).addEventListener(event, ({ target }) => {
        this.filters[key] = target.value;
        this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
        this.syncPaths();
        this.renderCards();
      });
    }
    this.root.querySelector('[data-library-form]').addEventListener('reset', event => {
      event.preventDefault();
      this.resetFilters();
    });
    this.root.querySelector('.library-paths').addEventListener('click', event => {
      const button = event.target.closest('[data-library-path]');
      if (button) this.applyPath(button.dataset.libraryPath);
    });
    this.root.querySelector('[data-library-grid]').addEventListener('click', event => {
      const button = event.target.closest('[data-library-compare-card]');
      if (button) this.toggleComparison(button.dataset.libraryCompareCard);
    });
    this.root.querySelector('[data-library-compare]').addEventListener('click', event => {
      const remove = event.target.closest('[data-library-remove]');
      if (remove) this.toggleComparison(remove.dataset.libraryRemove);
      if (event.target.closest('[data-library-clear-compare]')) {
        this.comparison = [];
        this.renderCards();
      }
    });
    this.root.querySelector('[data-library-more]').addEventListener('click', () => {
      this.limit += LIBRARY_PAGE_SIZE;
      this.renderCards();
    });
  }

  resetFilters() {
    this.filters = { query: '', arcana: '', suit: '', element: '', kind: '', order: 'journey' };
    this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
    for (const [selector, value] of [
      ['[data-library-query]', ''],
      ['[data-library-arcana]', ''],
      ['[data-library-suit]', ''],
      ['[data-library-element]', ''],
      ['[data-library-kind]', ''],
      ['[data-library-order]', 'journey']
    ]) this.root.querySelector(selector).value = value;
    this.syncPaths('all');
    this.renderCards();
    this.root.querySelector('[data-library-query]').focus();
  }

  applyPath(path) {
    this.filters.arcana = path === 'major' ? 'major' : '';
    this.filters.suit = ['copas', 'espadas', 'paus', 'ouros'].includes(path) ? path : '';
    this.filters.kind = path === 'court' ? 'court' : '';
    this.root.querySelector('[data-library-arcana]').value = this.filters.arcana;
    this.root.querySelector('[data-library-suit]').value = this.filters.suit;
    this.root.querySelector('[data-library-kind]').value = this.filters.kind;
    this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
    this.syncPaths(path);
    this.renderCards();
  }

  syncPaths(forced = '') {
    let active = forced;
    if (!active) {
      if (this.filters.arcana === 'major' && !this.filters.suit && !this.filters.kind) active = 'major';
      else if (this.filters.suit && !this.filters.arcana && !this.filters.kind) active = this.filters.suit;
      else if (this.filters.kind === 'court' && !this.filters.arcana && !this.filters.suit) active = 'court';
      else if (!this.filters.arcana && !this.filters.suit && !this.filters.kind) active = 'all';
    }
    this.root.querySelectorAll('[data-library-path]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.libraryPath === active)));
  }

  toggleComparison(id) {
    if (this.comparison.includes(id)) this.comparison = this.comparison.filter(item => item !== id);
    else if (this.comparison.length < LIBRARY_COMPARE_LIMIT) this.comparison = [...this.comparison, id];
    else this.comparison = [this.comparison[1], id];
    this.renderCards();
  }

  renderComparison() {
    const panel = this.root.querySelector('[data-library-compare]');
    const cards = this.comparison.map(id => CARDS.find(card => cardContentId(card) === id)).filter(Boolean);
    panel.hidden = cards.length === 0;
    if (!cards.length) { panel.innerHTML = ''; return; }
    const columns = cards.map(card => {
      const deep = meaningForCard(card);
      const keywords = (deep?.keywords || []).slice(0, 3).join(' · ');
      return `<article><button type="button" data-library-remove="${safe(cardContentId(card))}" aria-label="Remover ${safe(card.name)} da comparação">×</button><p>${safe(card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit)}</p><h3>${safe(card.name)}</h3><dl><div><dt>Elemento</dt><dd>${safe(card.element)}</dd></div><div><dt>Tipo</dt><dd>${safe(kinds[cardKind(card)])}</dd></div><div><dt>Potências</dt><dd>${safe(keywords || card.correspondences?.domain)}</dd></div></dl><a href="${cardPageHref(card)}">Ler conteúdo profundo →</a></article>`;
    }).join('');
    panel.innerHTML = `<header><div><p>COMPARADOR SIMBÓLICO</p><h2>${cards.length === 1 ? 'Escolha mais uma carta' : 'Duas forças lado a lado'}</h2></div><button type="button" data-library-clear-compare>Limpar comparação</button></header><div class="library-compare-grid">${columns}</div><small>Esta comparação é educativa e não substitui uma tiragem contextualizada.</small>`;
  }

  renderCards() {
    const filtered = sortLibraryCards(CARDS.filter(card => matchesLibraryFilters(card, this.filters)), this.filters.order);
    const visible = filtered.slice(0, this.limit);
    this.root.querySelector('[data-library-status]').textContent = `${filtered.length} ${filtered.length === 1 ? 'carta encontrada' : 'cartas encontradas'} · orientação direta`;
    this.root.querySelector('[data-library-grid]').innerHTML = visible.map((card, index) => {
      const deep = meaningForCard(card);
      const id = cardContentId(card);
      const selected = this.comparison.includes(id);
      const keywords = (deep?.keywords || []).slice(0, 3);
      return `<article class="library-card${selected ? ' is-compared' : ''}"><a href="${cardPageHref(card)}" aria-label="Abrir significado profundo de ${safe(card.name)}">${cardImageMarkup(card, { priority: index < 3 ? 'high' : 'auto' })}<span>${safe(card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit)}</span><h3>${safe(card.name)}</h3><p>${safe(card.element)} · DIRETA</p>${keywords.length ? `<ul aria-label="Palavras-chave">${keywords.map(word => `<li>${safe(word)}</li>`).join('')}</ul>` : ''}<b>LER CARTA →</b></a><button type="button" class="library-compare-button" data-library-compare-card="${safe(id)}" aria-pressed="${selected}">${selected ? 'Selecionada para comparar' : 'Comparar carta'}</button></article>`;
    }).join('') || `<div class="library-empty"><b>Nenhuma carta encontrada</b><p>Tente outra palavra, retire um filtro ou pesquise um símbolo como lua, coroa, água ou caminho.</p><button type="button" data-library-reset-empty>Limpar filtros</button></div>`;
    this.root.querySelector('[data-library-reset-empty]')?.addEventListener('click', () => this.resetFilters());
    const more = this.root.querySelector('[data-library-more]');
    more.hidden = visible.length >= filtered.length;
    more.textContent = `Mostrar mais cartas · ${visible.length}/${filtered.length}`;
    this.renderComparison();
  }
}
