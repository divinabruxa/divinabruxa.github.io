/* DIVINA BRUXA — BIBLIOTECA 2.0 · V215
   78 cartas oficiais, imagem íntegra, busca instantânea, filtros discretos,
   favoritos privados, comparação simbólica, leitor progressivo e ponte consentida para Whit.
*/
import { CARDS } from './tarot-data.js';
import { escapeHTML, store } from './storage.js';
import { cardImageMarkup, preloadCardImages } from './tarot-image-runtime.js';
import {
  LIBRARY_COMPARE_LIMIT,
  LIBRARY_PAGE_SIZE,
  cardContentId,
  cardKind,
  cardPageHref,
  librarySearchText,
  meaningForCard,
  normalizeLibraryText,
  sortLibraryCards
} from './card-library-policy.js?v=184';

const RELEASE = '215';
const FAVORITES_KEY = 'library-favorites-v215';
const WHIT_DRAFT_KEY = 'whit-draft-v190';
const safe = value => escapeHTML(value ?? '');
const kinds = Object.freeze({ major: 'Arcano Maior', number: 'Carta numerada', court: 'Carta da corte' });
const PATHS = Object.freeze(['all', 'major', 'copas', 'espadas', 'paus', 'ouros', 'court']);

function ensureStyles() {
  if (document.getElementById('bibliotecaV215Styles')) return;
  const link = document.createElement('link');
  link.id = 'bibliotecaV215Styles';
  link.rel = 'stylesheet';
  link.href = 'biblioteca-v215.css?v=215';
  link.dataset.libraryStyles = RELEASE;
  document.head.append(link);
}

function normalizeFavoriteIds(value) {
  const valid = new Set(CARDS.map(card => cardContentId(card)));
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(id => typeof id === 'string' && valid.has(id)))];
}

function toList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => String(item ?? '').trim()).filter(Boolean);
  if (typeof value === 'object') return Object.values(value).flatMap(toList).filter(Boolean);
  const text = String(value).trim();
  return text ? [text] : [];
}

function deepText(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.map(item => String(item ?? '').trim()).filter(Boolean).join(' · ');
  if (typeof value === 'object') return Object.entries(value)
    .map(([key, item]) => `${key}: ${Array.isArray(item) ? item.join(', ') : String(item ?? '')}`)
    .join(' · ');
  return String(value);
}

function publicWhitDraft(card, deep) {
  const keywords = toList(deep?.keywords).slice(0, 6).join(', ');
  const symbols = toList(deep?.symbols).slice(0, 5).join('; ');
  const essence = String(deep?.essence || deep?.centralMessage || '').slice(0, 1800);
  return [
    `Quero refletir com Whit sobre uma carta que escolhi conscientemente na Biblioteca da Divina Bruxa.`,
    `Carta: ${card.name}.`,
    `Arcano: ${card.arcana}.`,
    `Orientação: direta.`,
    card.element ? `Elemento: ${card.element}.` : '',
    keywords ? `Palavras-chave editoriais: ${keywords}.` : '',
    symbols ? `Símbolos editoriais: ${symbols}.` : '',
    essence ? `Essência editorial pública da carta: ${essence}` : '',
    `Use somente este contexto público e o que eu escrever na conversa. Não trate simbolismo como certeza factual ou destino inevitável.`
  ].filter(Boolean).join('\n').slice(0, 5000);
}

export class CardLibraryEngine {
  constructor(root, options = {}) {
    if (!root) throw new Error('A Biblioteca precisa de um destino válido.');
    ensureStyles();
    this.root = root;
    this.mode = options.mode === 'standalone' ? 'standalone' : 'portal';
    this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
    this.filters = { query: '', arcana: '', suit: '', element: '', kind: '', order: 'journey', favoritesOnly: false };
    this.comparison = [];
    try { this.favorites = normalizeFavoriteIds(store.get(FAVORITES_KEY, [])); }
    catch { this.favorites = []; }
    this.favoritePersistenceWarning = false;
    this.searchIndex = new Map(CARDS.map(card => [cardContentId(card), librarySearchText(card)]));
    this.filteredCards = [...CARDS];
    this.readerCard = null;
    this.readerTrigger = null;
    this.searchFrame = 0;
    this.searchGeneration = 0;
    this.swipeStart = null;
    this.ensureMenuEntry();
    this.renderShell();
    this.bind();
    this.scheduleRender(true);
  }

  ensureMenuEntry() {
    const rail = document.querySelector('.magic-menu-rail');
    if (!rail || rail.querySelector('[data-go="library"]')) return;
    const button = document.createElement('button');
    button.dataset.go = 'library';
    button.innerHTML = '<span>▤</span><strong>BIBLIOTECA</strong><small>78 cartas oficiais</small>';
    const daily = rail.querySelector('[data-go="daily"]');
    rail.insertBefore(button, daily || rail.firstChild);
  }

  renderShell() {
    this.root.dataset.libraryVersion = '184';
    this.root.dataset.libraryRelease = RELEASE;
    this.root.innerHTML = `
      <section class="library-v215-intro" aria-labelledby="libraryV215Title">
        <p class="eyebrow">BIBLIOTECA DAS 78 CARTAS</p>
        <h2 id="libraryV215Title">Entre pela imagem. Aprofunde no seu ritmo.</h2>
        <p>As 78 cartas oficiais, sempre diretas, organizadas para exploração, estudo e comparação simbólica.</p>
      </section>

      <nav class="library-paths" aria-label="Explorar famílias do Tarot">
        <button type="button" data-library-path="all" aria-pressed="true"><b>78</b><span>Todas</span></button>
        <button type="button" data-library-path="major"><b>22</b><span>Maiores</span></button>
        <button type="button" data-library-path="paus"><b>14</b><span>Paus</span></button>
        <button type="button" data-library-path="copas"><b>14</b><span>Copas</span></button>
        <button type="button" data-library-path="espadas"><b>14</b><span>Espadas</span></button>
        <button type="button" data-library-path="ouros"><b>14</b><span>Ouros</span></button>
        <button type="button" data-library-path="court"><b>16</b><span>Corte</span></button>
      </nav>

      <form class="library-tools library-tools-v215" data-library-form role="search">
        <label class="library-search"><span>Buscar nas 78 cartas</span><input type="search" data-library-query placeholder="Nome, símbolo ou palavra-chave…" autocomplete="off" spellcheck="false"></label>
        <button type="button" class="library-favorites-filter" data-library-favorites-filter aria-pressed="false"><span aria-hidden="true">☆</span> Favoritas</button>
        <details class="library-refine" data-library-refine>
          <summary>Refinar</summary>
          <div class="library-refine-grid">
            <label><span>Arcano</span><select data-library-arcana><option value="">Todos</option><option value="major">Maiores</option><option value="minor">Menores</option></select></label>
            <label><span>Naipe</span><select data-library-suit><option value="">Todos</option><option value="paus">Paus</option><option value="copas">Copas</option><option value="espadas">Espadas</option><option value="ouros">Ouros</option></select></label>
            <label><span>Elemento</span><select data-library-element><option value="">Todos</option><option value="agua">Água</option><option value="ar">Ar</option><option value="fogo">Fogo</option><option value="terra">Terra</option></select></label>
            <label><span>Tipo</span><select data-library-kind><option value="">Todos</option><option value="number">Numeradas</option><option value="court">Corte</option><option value="major">Maiores</option></select></label>
            <label><span>Ordem</span><select data-library-order><option value="journey">Jornada do Tarot</option><option value="name">Nome A–Z</option><option value="element">Elemento</option></select></label>
            <button type="reset" class="library-reset" data-library-reset>Limpar filtros</button>
          </div>
        </details>
      </form>

      <div class="library-result-head"><p class="library-status" data-library-status aria-live="polite"></p><p>Toque em uma carta para entrar. Compare até duas.</p></div>
      <section class="library-compare" data-library-compare hidden aria-live="polite"></section>
      <div class="library-grid" data-library-grid></div>
      <button type="button" class="text-button library-more" data-library-more hidden>Mostrar mais cartas</button>

      <dialog class="library-reader-v215" data-library-reader aria-labelledby="libraryReaderTitle">
        <div class="library-reader-shell">
          <header class="library-reader-topbar">
            <p data-library-reader-position></p>
            <button type="button" data-library-reader-close aria-label="Fechar carta">×</button>
          </header>
          <div class="library-reader-content" data-library-reader-content></div>
        </div>
      </dialog>`;

    this.grid = this.root.querySelector('[data-library-grid]');
    this.status = this.root.querySelector('[data-library-status]');
    this.reader = this.root.querySelector('[data-library-reader]');
    this.readerContent = this.root.querySelector('[data-library-reader-content]');
    this.readerPosition = this.root.querySelector('[data-library-reader-position]');
  }

  bind() {
    const controlEvents = {
      arcana: '[data-library-arcana]',
      suit: '[data-library-suit]',
      element: '[data-library-element]',
      kind: '[data-library-kind]',
      order: '[data-library-order]'
    };

    this.root.querySelector('[data-library-query]').addEventListener('input', event => {
      this.filters.query = event.target.value;
      this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
      this.scheduleRender();
    });
    for (const [key, selector] of Object.entries(controlEvents)) {
      this.root.querySelector(selector).addEventListener('change', event => {
        this.filters[key] = event.target.value;
        this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
        this.syncPaths();
        this.scheduleRender();
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
    this.root.querySelector('[data-library-favorites-filter]').addEventListener('click', event => {
      this.filters.favoritesOnly = !this.filters.favoritesOnly;
      event.currentTarget.setAttribute('aria-pressed', String(this.filters.favoritesOnly));
      event.currentTarget.querySelector('span').textContent = this.filters.favoritesOnly ? '★' : '☆';
      this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
      this.scheduleRender();
    });
    this.grid.addEventListener('click', event => this.handleGridClick(event));
    this.root.querySelector('[data-library-compare]').addEventListener('click', event => this.handleCompareClick(event));
    this.root.querySelector('[data-library-more]').addEventListener('click', () => {
      this.limit += LIBRARY_PAGE_SIZE;
      this.renderCards();
    });
    this.root.querySelector('[data-library-reader-close]').addEventListener('click', () => this.closeReader());
    this.reader.addEventListener('click', event => {
      if (event.target === this.reader) this.closeReader();
      const favorite = event.target.closest('[data-library-reader-favorite]');
      if (favorite) this.toggleFavorite(favorite.dataset.libraryReaderFavorite, { keepReader: true });
      const nav = event.target.closest('[data-library-reader-nav]');
      if (nav) this.navigateReader(Number(nav.dataset.libraryReaderNav));
      const related = event.target.closest('[data-library-related]');
      if (related) this.openReader(related.dataset.libraryRelated, related);
      const whit = event.target.closest('[data-library-whit]');
      if (whit) this.showWhitConfirmation(whit.dataset.libraryWhit);
      if (event.target.closest('[data-library-whit-cancel]')) this.hideWhitConfirmation();
      if (event.target.closest('[data-library-whit-confirm]')) this.confirmWhitHandoff();
    });
    this.reader.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); this.navigateReader(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); this.navigateReader(1); }
      if (event.key === 'Escape' && typeof this.reader.showModal !== 'function') this.closeReader();
    });
    this.reader.addEventListener('close', () => this.finishReaderClose());
    this.reader.addEventListener('pointerdown', event => this.startSwipe(event), { passive: true });
    this.reader.addEventListener('pointerup', event => this.finishSwipe(event), { passive: true });
    this.reader.addEventListener('pointercancel', () => { this.swipeStart = null; }, { passive: true });
  }

  scheduleRender(immediate = false) {
    const generation = ++this.searchGeneration;
    if (this.searchFrame) cancelAnimationFrame(this.searchFrame);
    const render = () => {
      this.searchFrame = 0;
      if (generation !== this.searchGeneration) return;
      this.renderCards();
    };
    if (immediate || typeof requestAnimationFrame !== 'function') render();
    else this.searchFrame = requestAnimationFrame(render);
  }

  resetFilters() {
    this.filters = { query: '', arcana: '', suit: '', element: '', kind: '', order: 'journey', favoritesOnly: false };
    this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
    for (const [selector, value] of [
      ['[data-library-query]', ''], ['[data-library-arcana]', ''], ['[data-library-suit]', ''],
      ['[data-library-element]', ''], ['[data-library-kind]', ''], ['[data-library-order]', 'journey']
    ]) this.root.querySelector(selector).value = value;
    const fav = this.root.querySelector('[data-library-favorites-filter]');
    fav.setAttribute('aria-pressed', 'false');
    fav.querySelector('span').textContent = '☆';
    this.syncPaths('all');
    this.scheduleRender();
    this.root.querySelector('[data-library-query]').focus({ preventScroll: true });
  }

  applyPath(path) {
    if (!PATHS.includes(path)) return;
    this.filters.arcana = path === 'major' ? 'major' : '';
    this.filters.suit = ['copas', 'espadas', 'paus', 'ouros'].includes(path) ? path : '';
    this.filters.kind = path === 'court' ? 'court' : '';
    this.filters.favoritesOnly = false;
    this.root.querySelector('[data-library-arcana]').value = this.filters.arcana;
    this.root.querySelector('[data-library-suit]').value = this.filters.suit;
    this.root.querySelector('[data-library-kind]').value = this.filters.kind;
    const fav = this.root.querySelector('[data-library-favorites-filter]');
    fav.setAttribute('aria-pressed', 'false'); fav.querySelector('span').textContent = '☆';
    this.limit = this.mode === 'standalone' ? 30 : LIBRARY_PAGE_SIZE;
    this.syncPaths(path);
    this.scheduleRender();
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

  matches(card) {
    if (card.orientation !== 'normal') return false;
    if (this.filters.favoritesOnly && !this.favorites.includes(cardContentId(card))) return false;
    const terms = normalizeLibraryText(this.filters.query).split(' ').filter(Boolean);
    const searchable = this.searchIndex.get(cardContentId(card)) || '';
    if (!terms.every(term => searchable.includes(term))) return false;
    if (this.filters.arcana && card.arcanaCode !== this.filters.arcana) return false;
    if (this.filters.suit && card.suitCode !== this.filters.suit) return false;
    if (this.filters.element && normalizeLibraryText(card.element) !== this.filters.element) return false;
    if (this.filters.kind && cardKind(card) !== this.filters.kind) return false;
    return true;
  }

  filtered() {
    return sortLibraryCards(CARDS.filter(card => this.matches(card)), this.filters.order);
  }

  handleGridClick(event) {
    const favorite = event.target.closest('[data-library-favorite]');
    if (favorite) {
      event.preventDefault();
      this.toggleFavorite(favorite.dataset.libraryFavorite);
      return;
    }
    const compare = event.target.closest('[data-library-compare-card]');
    if (compare) {
      event.preventDefault();
      this.toggleComparison(compare.dataset.libraryCompareCard);
      return;
    }
    const open = event.target.closest('[data-library-open]');
    if (open) {
      event.preventDefault();
      this.openReader(open.dataset.libraryOpen, open);
    }
  }

  handleCompareClick(event) {
    const remove = event.target.closest('[data-library-remove]');
    if (remove) this.toggleComparison(remove.dataset.libraryRemove);
    if (event.target.closest('[data-library-clear-compare]')) {
      this.comparison = [];
      this.renderCards();
    }
    const open = event.target.closest('[data-library-compare-open]');
    if (open) this.openReader(open.dataset.libraryCompareOpen, open);
  }

  toggleFavorite(id, { keepReader = false } = {}) {
    const valid = CARDS.some(card => cardContentId(card) === id);
    if (!valid) return false;
    this.favorites = this.favorites.includes(id)
      ? this.favorites.filter(item => item !== id)
      : [...this.favorites, id];
    try { store.set(FAVORITES_KEY, this.favorites); }
    catch {
      if (!this.favoritePersistenceWarning) {
        this.favoritePersistenceWarning = true;
        globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail: 'A favorita ficou preservada nesta visita, mas este navegador bloqueou o armazenamento local.' }));
      }
    }
    this.renderCards();
    if (keepReader && this.readerCard && cardContentId(this.readerCard) === id) this.renderReader(this.readerCard);
    return true;
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
      const keywords = toList(deep?.keywords).slice(0, 3).join(' · ');
      return `<article>
        <button type="button" data-library-remove="${safe(cardContentId(card))}" aria-label="Remover ${safe(card.name)} da comparação">×</button>
        <p>${safe(card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit)}</p>
        <h3>${safe(card.name)}</h3>
        <dl><div><dt>Elemento</dt><dd>${safe(card.element)}</dd></div><div><dt>Tipo</dt><dd>${safe(kinds[cardKind(card)])}</dd></div><div><dt>Potências</dt><dd>${safe(keywords || card.correspondences?.domain)}</dd></div></dl>
        <button type="button" class="library-compare-open" data-library-compare-open="${safe(cardContentId(card))}">Entrar na carta →</button>
      </article>`;
    }).join('');
    panel.innerHTML = `<header><div><p>COMPARADOR SIMBÓLICO</p><h2>${cards.length === 1 ? 'Escolha mais uma carta' : 'Duas forças lado a lado'}</h2></div><button type="button" data-library-clear-compare>Limpar comparação</button></header><div class="library-compare-grid">${columns}</div><small>Comparação educativa. Uma tiragem contextualizada continua sendo uma experiência diferente.</small>`;
  }

  renderCards() {
    const filtered = this.filtered();
    this.filteredCards = filtered;
    const visible = filtered.slice(0, this.limit);
    const favoriteLabel = this.filters.favoritesOnly ? ` · ${this.favorites.length} favoritas privadas` : '';
    this.status.textContent = `${filtered.length} ${filtered.length === 1 ? 'carta encontrada' : 'cartas encontradas'} · sempre diretas${favoriteLabel}`;
    this.grid.innerHTML = visible.map((card, index) => {
      const deep = meaningForCard(card);
      const id = cardContentId(card);
      const selected = this.comparison.includes(id);
      const favorite = this.favorites.includes(id);
      const keywords = toList(deep?.keywords).slice(0, 2);
      return `<article class="library-card${selected ? ' is-compared' : ''}" data-card-id="${safe(id)}">
        <button type="button" class="library-card-open" data-library-open="${safe(id)}" aria-label="Abrir ${safe(card.name)}">
          ${cardImageMarkup(card, { priority: index < 4 ? 'high' : 'auto' })}
          <span>${safe(card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit)}</span>
          <h3>${safe(card.name)}</h3>
          <p>${safe(card.element)} · DIRETA</p>
          ${keywords.length ? `<ul aria-label="Palavras-chave">${keywords.map(word => `<li>${safe(word)}</li>`).join('')}</ul>` : ''}
          <b>ENTRAR NA CARTA →</b>
        </button>
        <div class="library-card-actions">
          <button type="button" data-library-favorite="${safe(id)}" aria-pressed="${favorite}" aria-label="${favorite ? 'Remover' : 'Adicionar'} ${safe(card.name)} ${favorite ? 'das' : 'às'} favoritas"><span aria-hidden="true">${favorite ? '★' : '☆'}</span>${favorite ? 'Favorita' : 'Favoritar'}</button>
          <button type="button" data-library-compare-card="${safe(id)}" aria-pressed="${selected}">${selected ? 'Comparando' : 'Comparar'}</button>
        </div>
      </article>`;
    }).join('') || `<div class="library-empty"><b>Nenhuma carta encontrada</b><p>Tente outra palavra ou retire um refinamento.</p><button type="button" data-library-reset-empty>Limpar filtros</button></div>`;

    this.root.querySelector('[data-library-reset-empty]')?.addEventListener('click', () => this.resetFilters());
    const more = this.root.querySelector('[data-library-more]');
    more.hidden = visible.length >= filtered.length;
    more.textContent = `Mostrar mais cartas · ${visible.length}/${filtered.length}`;
    this.renderComparison();
    preloadCardImages(visible.slice(0, 4).map(card => card.index), 4);
  }

  openReader(id, trigger = null) {
    const card = CARDS.find(item => cardContentId(item) === id);
    if (!card) return false;
    this.readerCard = card;
    this.readerTrigger = trigger || this.readerTrigger;
    this.renderReader(card);
    document.body.classList.add('library-reader-open');
    if (!this.reader.open) {
      if (typeof this.reader.showModal === 'function') this.reader.showModal();
      else this.reader.setAttribute('open', '');
    }
    requestAnimationFrame?.(() => this.root.querySelector('[data-library-reader-close]')?.focus({ preventScroll: true }));
    return true;
  }

  closeReader() {
    if (!this.reader.open) return;
    if (typeof this.reader.close === 'function') this.reader.close();
    else { this.reader.removeAttribute('open'); this.finishReaderClose(); }
  }

  finishReaderClose() {
    document.body.classList.remove('library-reader-open');
    this.swipeStart = null;
    const target = this.readerTrigger;
    this.readerTrigger = null;
    target?.focus?.({ preventScroll: true });
  }

  readerSequence() {
    return this.filteredCards.length > 1 ? this.filteredCards : CARDS;
  }

  navigateReader(direction) {
    if (!this.readerCard || !Number.isFinite(direction) || direction === 0) return false;
    const sequence = this.readerSequence();
    const current = sequence.findIndex(card => cardContentId(card) === cardContentId(this.readerCard));
    if (current < 0) return false;
    const next = current + Math.sign(direction);
    if (next < 0 || next >= sequence.length) return false;
    this.readerCard = sequence[next];
    this.renderReader(this.readerCard, direction);
    return true;
  }

  relatedCards(card) {
    return CARDS.filter(candidate => candidate.index !== card.index)
      .map(candidate => ({
        card: candidate,
        score: Number(Boolean(card.suitCode && candidate.suitCode === card.suitCode)) * 4
          + Number(candidate.element === card.element) * 2
          + Number(cardKind(candidate) === cardKind(card))
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || Math.abs(a.card.index - card.index) - Math.abs(b.card.index - card.index))
      .slice(0, 4)
      .map(item => item.card);
  }

  renderReader(card, direction = 0) {
    const deep = meaningForCard(card) || {};
    const id = cardContentId(card);
    const favorite = this.favorites.includes(id);
    const sequence = this.readerSequence();
    const sequenceIndex = Math.max(0, sequence.findIndex(item => cardContentId(item) === id));
    const related = this.relatedCards(card);
    const symbols = toList(deep.symbols);
    const keywords = toList(deep.keywords);
    const combinations = deepText(deep.combinations);
    const correspondences = Object.entries(card.correspondences || {}).filter(([, value]) => value);
    const responsible = String(deep.responsibleNotice || '').trim();

    this.readerPosition.textContent = `${sequenceIndex + 1} / ${sequence.length}`;
    this.readerContent.innerHTML = `
      <section class="library-reader-hero" data-library-reader-stage>
        <figure>
          ${cardImageMarkup(card, { priority: 'high', alt: `${card.name}, carta do Tarot em posição direta` })}
          <figcaption>${safe(card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit)} · DIRETA</figcaption>
        </figure>
        <div class="library-reader-identity">
          <p class="eyebrow">BIBLIOTECA · CARTA ${card.index + 1} DE 78</p>
          <h2 id="libraryReaderTitle">${safe(card.name)}</h2>
          ${keywords.length ? `<ul class="library-reader-keywords" aria-label="Palavras-chave">${keywords.slice(0, 6).map(word => `<li>${safe(word)}</li>`).join('')}</ul>` : ''}
          <p class="library-reader-essence">${safe(deep.essence || deep.centralMessage || 'Conteúdo editorial disponível na página completa desta carta.')}</p>
          <div class="library-reader-primary-actions">
            <button type="button" data-library-reader-favorite="${safe(id)}" aria-pressed="${favorite}"><span aria-hidden="true">${favorite ? '★' : '☆'}</span> ${favorite ? 'Favorita' : 'Favoritar'}</button>
            <button type="button" data-library-whit="${safe(id)}"><span aria-hidden="true">✦</span> Refletir com Whit</button>
          </div>
        </div>
      </section>

      <nav class="library-reader-nav" aria-label="Navegar entre cartas">
        <button type="button" data-library-reader-nav="-1" ${sequenceIndex <= 0 ? 'disabled' : ''}>← Anterior</button>
        <span>Deslize horizontalmente sobre a imagem ou use as setas</span>
        <button type="button" data-library-reader-nav="1" ${sequenceIndex >= sequence.length - 1 ? 'disabled' : ''}>Próxima →</button>
      </nav>

      <section class="library-reader-facts" aria-label="Correspondências da carta">
        <div><span>Arcano</span><b>${safe(card.arcana)}</b></div>
        <div><span>Elemento</span><b>${safe(card.element)}</b></div>
        ${card.rank ? `<div><span>Valor</span><b>${safe(card.rank)}</b></div>` : card.number !== null ? `<div><span>Número</span><b>${safe(card.number)}</b></div>` : ''}
        ${correspondences.slice(0, 2).map(([key, value]) => `<div><span>${safe(key === 'astrological' ? 'Correspondência' : key === 'domain' ? 'Domínio' : 'Padrão')}</span><b>${safe(value)}</b></div>`).join('')}
      </section>

      <section class="library-reader-layers" aria-label="Leitura profunda de ${safe(card.name)}">
        ${deep.light || deep.tension ? `<details open><summary>Luz e tensão</summary><div class="library-layer-grid"><article><p class="eyebrow">LUZ</p><p>${safe(deep.light)}</p></article><article><p class="eyebrow">TENSÃO</p><p>${safe(deep.tension)}</p></article></div></details>` : ''}
        ${deep.love || deep.relationships ? `<details><summary>Amor e relações</summary><div class="library-layer-grid"><article><h3>Amor</h3><p>${safe(deep.love)}</p></article><article><h3>Relações</h3><p>${safe(deep.relationships)}</p></article></div></details>` : ''}
        ${deep.career || deep.money ? `<details><summary>Trabalho e dinheiro</summary><div class="library-layer-grid"><article><h3>Trabalho</h3><p>${safe(deep.career)}</p></article><article><h3>Dinheiro</h3><p>${safe(deep.money)}</p></article></div></details>` : ''}
        ${deep.spirituality || deep.advice ? `<details><summary>Espiritualidade e conselho</summary><div class="library-layer-grid"><article><h3>Espiritualidade</h3><p>${safe(deep.spirituality)}</p></article><article><h3>Conselho</h3><p>${safe(deep.advice)}</p></article></div></details>` : ''}
        ${symbols.length ? `<details><summary>Símbolos da carta</summary><ul class="library-symbol-list">${symbols.map(symbol => `<li>${safe(symbol)}</li>`).join('')}</ul></details>` : ''}
        ${combinations ? `<details><summary>Combinações e relações simbólicas</summary><p>${safe(combinations)}</p></details>` : ''}
        ${deep.reflectionQuestion || deep.action ? `<details><summary>Integração prática</summary>${deep.reflectionQuestion ? `<blockquote>${safe(deep.reflectionQuestion)}</blockquote>` : ''}${deep.action ? `<p>${safe(deep.action)}</p>` : ''}</details>` : ''}
      </section>

      ${related.length ? `<section class="library-related"><header><p class="eyebrow">RELAÇÕES DO CATÁLOGO</p><h3>Continue explorando</h3></header><div>${related.map(item => `<button type="button" data-library-related="${safe(cardContentId(item))}">${cardImageMarkup(item, { decorative: true })}<span>${safe(item.name)}</span></button>`).join('')}</div></section>` : ''}

      <section class="library-reader-worlds" aria-label="Continuar no universo Divina Bruxa">
        <a href="${safe(cardPageHref(card))}">Abrir página editorial completa</a>
        <button type="button" data-go="tarot">Tarot Livre</button>
        <button type="button" data-go="spreads">Tiragens</button>
        <button type="button" data-go="school">Escola</button>
      </section>

      <aside class="library-whit-confirm" data-library-whit-confirm hidden role="dialog" aria-labelledby="libraryWhitConfirmTitle">
        <span aria-hidden="true">✦</span>
        <div><h3 id="libraryWhitConfirmTitle">Levar esta carta para Whit?</h3><p data-library-whit-preview></p><small>Nada é enviado agora. A Biblioteca apenas prepara um rascunho com conteúdo editorial público; você revisa e dá consentimento dentro da Whit antes de qualquer envio.</small></div>
        <div><button type="button" data-library-whit-cancel>Continuar na Biblioteca</button><button type="button" data-library-whit-confirm>Preparar na Whit</button></div>
      </aside>
      ${responsible ? `<p class="library-reader-notice">${safe(responsible)}</p>` : ''}`;

    this.readerContent.dataset.motionDirection = direction < 0 ? 'previous' : direction > 0 ? 'next' : 'open';
    preloadCardImages([card.index, related[0]?.index, related[1]?.index].filter(Number.isInteger), 3);
    if (!this.reducedMotion() && typeof this.readerContent.animate === 'function') {
      const x = direction < 0 ? '-18px' : direction > 0 ? '18px' : '0px';
      this.readerContent.animate([
        { opacity: .7, transform: `translate3d(${x},8px,0) scale(.992)` },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    this.readerContent.scrollTop = 0;
  }

  showWhitConfirmation(id) {
    if (!this.readerCard || cardContentId(this.readerCard) !== id) return;
    const deep = meaningForCard(this.readerCard) || {};
    const box = this.root.querySelector('[data-library-whit-confirm]');
    const preview = box?.querySelector('[data-library-whit-preview]');
    if (!box || !preview) return;
    const keywords = toList(deep.keywords).slice(0, 3).join(' · ');
    preview.textContent = `${this.readerCard.name}, direta${keywords ? ` · ${keywords}` : ''}`;
    box.hidden = false;
    box.querySelector('[data-library-whit-cancel]')?.focus({ preventScroll: true });
  }

  hideWhitConfirmation() {
    const box = this.root.querySelector('[data-library-whit-confirm]');
    if (box) box.hidden = true;
    this.root.querySelector('[data-library-whit]')?.focus({ preventScroll: true });
  }

  confirmWhitHandoff() {
    if (!this.readerCard) return false;
    const deep = meaningForCard(this.readerCard) || {};
    const text = publicWhitDraft(this.readerCard, deep);
    try { store.set(WHIT_DRAFT_KEY, { text, source: 'message', at: new Date().toISOString() }); }
    catch {
      globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail: 'Não foi possível preparar o rascunho para Whit neste navegador.' }));
      return false;
    }
    globalThis.dispatchEvent?.(new CustomEvent('divina:library-whit-prepared', { detail: { cardId: this.readerCard.index } }));
    this.closeReader();
    globalThis.orbe?.go?.('ai');
    return true;
  }

  startSwipe(event) {
    const stage = event.target.closest?.('.library-reader-hero figure');
    if (!stage || event.pointerType === 'mouse') return;
    this.swipeStart = { x: event.clientX, y: event.clientY, at: performance.now() };
  }

  finishSwipe(event) {
    if (!this.swipeStart || event.pointerType === 'mouse') return;
    const start = this.swipeStart;
    this.swipeStart = null;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const elapsed = performance.now() - start.at;
    if (elapsed > 700 || Math.abs(dx) < 54 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    this.navigateReader(dx < 0 ? 1 : -1);
  }

  reducedMotion() {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  destroy() {
    if (this.searchFrame) cancelAnimationFrame(this.searchFrame);
    this.searchGeneration += 1;
    this.closeReader();
  }
}
