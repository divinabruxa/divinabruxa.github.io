/* DIVINA BRUXA V148 — LOJA MÍSTICA CELESTIAL */
import { store, escapeHTML } from './storage.js';
import { STORE_POLICY, storeToneFor } from './store-policy.js?v=148';

const FAVORITES_KEY = 'mystic-store-favorites-v148';
const emit = message => dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));

export const normalizeStoreText = value => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .trim();

export function buildAmazonAffiliateURL(product, associateTag = '') {
  const fallback = `https://${STORE_POLICY.affiliateHost}/s?k=${encodeURIComponent(product?.search || product?.name || '')}`;
  let url;
  try {
    url = new URL(product?.url || fallback);
  } catch {
    url = new URL(fallback);
  }

  const validHost = url.hostname === 'amazon.com.br'
    || url.hostname === STORE_POLICY.affiliateHost
    || url.hostname.endsWith(STORE_POLICY.affiliateHostSuffix);
  if (url.protocol !== 'https:' || !validHost) url = new URL(fallback);

  const tag = String(associateTag).trim();
  if (/^[a-z0-9_-]{2,40}$/i.test(tag) && tag !== 'SEU-CODIGO-20') {
    url.searchParams.set('tag', tag);
  }
  return url.toString();
}

export function filterStoreProducts(products = [], state = {}) {
  const query = normalizeStoreText(state.query);
  const category = state.category || 'Todos';
  const collection = STORE_POLICY.collections.find(item => item.id === state.collectionId);
  const favorites = state.favorites instanceof Set ? state.favorites : new Set(state.favorites || []);

  return products.filter(product => {
    const content = normalizeStoreText([
      product.name,
      product.category,
      product.description,
      product.note,
      ...(product.tags || [])
    ].join(' '));
    return (!query || content.includes(query))
      && (category === 'Todos' || product.category === category)
      && (!collection || collection.categories.includes(product.category))
      && (!state.onlyFavorites || favorites.has(product.id));
  });
}

export class StoreEngine {
  constructor(root, config) {
    this.root = root;
    this.config = config;
    if (!root) return;

    this.query = '';
    this.category = 'Todos';
    this.collectionId = '';
    this.onlyFavorites = false;
    const validIds = new Set((config.products || []).map(product => product.id));
    const storedFavorites = store.get(FAVORITES_KEY, store.get('mystic-store-favorites-v5', []));
    this.favorites = new Set(
      (Array.isArray(storedFavorites) ? storedFavorites : []).filter(id => validIds.has(id))
    );

    this.renderShell();
    this.bind();
    this.renderCatalog();
    this.root.dataset.storeReady = 'v148';
  }

  renderShell() {
    const productCount = (this.config.products || []).length;
    this.root.innerHTML = `
      <div class="store-v148-shell" data-store-v148>
        <section class="store-v148-hero" aria-labelledby="store-v148-hero-title">
          <figure class="store-v148-hero-art">
            <img src="${escapeHTML(STORE_POLICY.heroImage)}" width="864" height="1296" alt="Cartas de Tarot, ametista, diário violeta, vela e chave dourada em uma cena editorial celestial" decoding="async">
            <figcaption>${escapeHTML(STORE_POLICY.editorialImageNotice)}</figcaption>
          </figure>
          <div class="store-v148-hero-copy">
            <p class="eyebrow">CURADORIA DA ORBE</p>
            <h3 id="store-v148-hero-title">Objetos que acompanham o seu universo.</h3>
            <p>Seleções temáticas para estudar, criar rituais, transformar ambientes e presentear. Você explora aqui e decide com calma no site da Amazon.</p>
            <div class="store-v148-trust" aria-label="Princípios da Loja Mística">
              <span><b>◇</b> curadoria transparente</span>
              <span><b>♡</b> favoritos neste aparelho</span>
              <span><b>↗</b> compra somente no parceiro</span>
            </div>
            <dl class="store-v148-numbers">
              <div><dt>${productCount}</dt><dd>escolhas</dd></div>
              <div><dt>${STORE_POLICY.collections.length}</dt><dd>coleções</dd></div>
              <div><dt>0</dt><dd>checkout interno</dd></div>
            </dl>
          </div>
        </section>

        <aside class="store-v148-disclosure" id="store-v148-disclosure" aria-label="Transparência de afiliado">
          <span class="store-v148-disclosure-seal" aria-hidden="true">✦</span>
          <div>
            <strong>TRANSPARÊNCIA DE AFILIADO</strong>
            <p>${escapeHTML(STORE_POLICY.disclosure)} ${escapeHTML(STORE_POLICY.partnerNotice)}</p>
          </div>
          <small>Sem cartão ou pagamento dentro da Divina Bruxa</small>
        </aside>

        <section class="store-v148-catalog" aria-labelledby="store-v148-catalog-title">
          <header class="store-v148-section-heading">
            <div>
              <p class="eyebrow">SUA BUSCA</p>
              <h3 id="store-v148-catalog-title">Encontre uma escolha.</h3>
            </div>
            <p>${escapeHTML(STORE_POLICY.privacyNotice)}</p>
          </header>

          <div class="store-v148-toolbar">
            <div class="store-v148-search">
              <label for="store-v148-search-input">BUSCAR NA CURADORIA</label>
              <span class="store-v148-search-line">
                <span aria-hidden="true">⌕</span>
                <input id="store-v148-search-input" type="search" inputmode="search" autocomplete="off" data-store-search placeholder="Tarot, cristais, livros…">
                <button type="button" data-clear-search aria-label="Limpar busca" hidden>×</button>
              </span>
            </div>
            <button type="button" class="store-v148-favorites" data-favorites aria-pressed="false">
              <span aria-hidden="true">♡</span>
              <span>Meus favoritos</span>
              <b data-favorites-count>${this.favorites.size}</b>
            </button>
          </div>

          <div class="store-v148-collections" aria-label="Coleções da Loja Mística">
            ${STORE_POLICY.collections.map(item => `
              <button type="button" data-collection="${escapeHTML(item.id)}" aria-pressed="false">
                <span aria-hidden="true">${escapeHTML(item.sigil)}</span>
                <b>${escapeHTML(item.name)}</b>
                <small>${escapeHTML(item.description)}</small>
                <em>${this.collectionCount(item)} escolhas</em>
              </button>
            `).join('')}
          </div>

          <div class="store-v148-categories" aria-label="Filtrar por categoria">
            ${STORE_POLICY.categories.map(category => `
              <button type="button" data-category="${escapeHTML(category)}" aria-pressed="${category === 'Todos'}" class="${category === 'Todos' ? 'is-active' : ''}">${escapeHTML(category)}</button>
            `).join('')}
          </div>

          <div class="store-v148-results-head">
            <p data-store-status role="status" aria-live="polite"></p>
            <button type="button" data-reset-store hidden>Limpar filtros</button>
          </div>
          <div data-store-results></div>
        </section>

        <footer class="store-v148-footer-note">
          <span aria-hidden="true">◇</span>
          <p><strong>Antes de escolher:</strong> confira descrição, medidas, idioma, vendedor, avaliações, prazo e política de devolução diretamente na Amazon.</p>
        </footer>
      </div>`;
  }

  collectionCount(item) {
    return (this.config.products || []).filter(product => item.categories.includes(product.category)).length;
  }

  currentProducts() {
    return filterStoreProducts(this.config.products || [], {
      query: this.query,
      category: this.category,
      collectionId: this.collectionId,
      favorites: this.favorites,
      onlyFavorites: this.onlyFavorites
    });
  }

  activeFilterLabel() {
    if (this.onlyFavorites) return 'nos seus favoritos';
    const collection = STORE_POLICY.collections.find(item => item.id === this.collectionId);
    if (collection) return `em ${collection.name}`;
    if (this.category !== 'Todos') return `em ${this.category}`;
    if (this.query) return `para “${this.query}”`;
    return 'em toda a curadoria';
  }

  renderCatalog() {
    const products = this.currentProducts();
    const results = this.root.querySelector('[data-store-results]');
    const status = this.root.querySelector('[data-store-status]');
    const reset = this.root.querySelector('[data-reset-store]');
    const clearSearch = this.root.querySelector('[data-clear-search]');
    const favoritesButton = this.root.querySelector('[data-favorites]');
    const favoritesCount = this.root.querySelector('[data-favorites-count]');

    if (status) status.textContent = `${products.length} ${products.length === 1 ? 'escolha encontrada' : 'escolhas encontradas'} ${this.activeFilterLabel()}`;
    if (reset) reset.hidden = !this.query && this.category === 'Todos' && !this.collectionId && !this.onlyFavorites;
    if (clearSearch) clearSearch.hidden = !this.query;
    if (favoritesButton) {
      favoritesButton.classList.toggle('is-active', this.onlyFavorites);
      favoritesButton.setAttribute('aria-pressed', String(this.onlyFavorites));
    }
    if (favoritesCount) favoritesCount.textContent = String(this.favorites.size);

    this.root.querySelectorAll('[data-category]').forEach(button => {
      const active = !this.collectionId && button.dataset.category === this.category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.root.querySelectorAll('[data-collection]').forEach(button => {
      const active = button.dataset.collection === this.collectionId;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (!results) return;
    results.innerHTML = products.length
      ? `<div class="store-v148-grid">${products.map((product, index) => this.productCard(product, index)).join('')}</div>`
      : `<div class="store-v148-empty">
          <span aria-hidden="true">◇</span>
          <h4>Nenhuma escolha apareceu.</h4>
          <p>Tente outra palavra ou volte para toda a curadoria.</p>
          <button type="button" data-reset-store>Mostrar todas as escolhas</button>
        </div>`;
  }

  productCard(product, index) {
    const favorite = this.favorites.has(product.id);
    const url = buildAmazonAffiliateURL(product, this.config.amazonAssociateTag);
    const tone = storeToneFor(product.category);
    return `
      <article class="store-v148-product ${product.featured ? 'is-featured' : ''}" data-tone="${escapeHTML(tone)}">
        <div class="store-v148-product-art" aria-hidden="true">
          <span class="store-v148-product-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="store-v148-product-sigil">${escapeHTML(product.symbol || '✦')}</span>
          <small>SELEÇÃO TEMÁTICA</small>
        </div>
        <button type="button" class="store-v148-heart ${favorite ? 'is-active' : ''}" data-favorite="${escapeHTML(product.id)}" aria-label="${favorite ? 'Remover' : 'Adicionar'} ${escapeHTML(product.name)} ${favorite ? 'dos' : 'aos'} favoritos" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
        <div class="store-v148-product-copy">
          <div class="store-v148-product-meta">
            <span>${escapeHTML(product.category)}</span>
            ${product.featured ? '<b>ESCOLHA DA ORBE</b>' : ''}
          </div>
          <h4>${escapeHTML(product.name)}</h4>
          <p>${escapeHTML(product.description)}</p>
          ${product.note ? `<small class="store-v148-product-note">${escapeHTML(product.note)}</small>` : ''}
          <div class="store-v148-partner-state">
            <span>Preço e estoque</span>
            <b>Confirmar na Amazon</b>
          </div>
          <a href="${escapeHTML(url)}" data-affiliate="${escapeHTML(product.id)}" aria-describedby="store-v148-disclosure" target="_blank" rel="nofollow sponsored noopener" aria-label="Ver seleção de ${escapeHTML(product.name)} na Amazon, abre em nova aba">
            <span>Ver seleção na Amazon</span><b aria-hidden="true">↗</b>
          </a>
          <small class="store-v148-sponsored">PUBLICIDADE · COMPRA E ENTREGA PELO PARCEIRO</small>
        </div>
      </article>`;
  }

  persistFavorites() {
    try {
      store.set(FAVORITES_KEY, [...this.favorites]);
    } catch {
      emit('Não foi possível guardar favoritos neste aparelho.');
    }
  }

  resetFilters() {
    this.query = '';
    this.category = 'Todos';
    this.collectionId = '';
    this.onlyFavorites = false;
    const input = this.root.querySelector('[data-store-search]');
    if (input) input.value = '';
    this.renderCatalog();
  }

  bind() {
    const search = this.root.querySelector('[data-store-search]');
    search?.addEventListener('input', event => {
      this.query = event.currentTarget.value;
      this.renderCatalog();
    });
    search?.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !this.query) return;
      event.preventDefault();
      this.query = '';
      event.currentTarget.value = '';
      this.renderCatalog();
    });

    this.root.addEventListener('click', event => {
      const target = event.target.closest('button, a');
      if (!target || !this.root.contains(target)) return;

      if (target.matches('[data-category]')) {
        this.category = target.dataset.category;
        this.collectionId = '';
        this.renderCatalog();
        return;
      }
      if (target.matches('[data-collection]')) {
        const selected = target.dataset.collection;
        this.collectionId = this.collectionId === selected ? '' : selected;
        this.category = 'Todos';
        this.renderCatalog();
        return;
      }
      if (target.matches('[data-favorites]')) {
        this.onlyFavorites = !this.onlyFavorites;
        this.renderCatalog();
        return;
      }
      if (target.matches('[data-favorite]')) {
        const id = target.dataset.favorite;
        const added = !this.favorites.has(id);
        added ? this.favorites.add(id) : this.favorites.delete(id);
        this.persistFavorites();
        this.renderCatalog();
        requestAnimationFrame(() => {
          const restored = [...this.root.querySelectorAll('[data-favorite]')]
            .find(button => button.dataset.favorite === id);
          restored?.focus({ preventScroll: true });
        });
        emit(added ? 'Guardado nos favoritos deste aparelho.' : 'Removido dos favoritos.');
        return;
      }
      if (target.matches('[data-clear-search]')) {
        this.query = '';
        if (search) {
          search.value = '';
          search.focus();
        }
        this.renderCatalog();
        return;
      }
      if (target.matches('[data-reset-store]')) {
        this.resetFilters();
        search?.focus();
        return;
      }
      if (target.matches('[data-affiliate]')) {
        emit('Abrindo a seleção no site da Amazon…');
      }
    });
  }
}
