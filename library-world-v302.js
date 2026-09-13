/* DIVINA BRUXA 4.0 — MACROETAPA 7/14 · PORTAL DA BIBLIOTECA V555
   Atlas leve das 78 cartas. A Orbe canônica conduz; Whit orienta sem invadir. */

import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardAtlasStyle, cardImageMarkup } from './tarot-image-runtime.js?v=555';
import './tarot-meanings.js?v=555';
import {
  cardContentId,
  meaningForCard,
  normalizeLibraryText
} from './card-library-policy.js?v=555';

const FAVORITES_KEY = 'library-v302-favorites';
const WHIT_DRAFT_KEY = 'whit-draft-v190';
const PAGE_SIZE = 18;
const PATHS = Object.freeze([
  { id:'all', label:'Todas', count:78, sigil:'✦' },
  { id:'major', label:'Maiores', count:22, sigil:'☉' },
  { id:'paus', label:'Paus', count:14, sigil:'△' },
  { id:'copas', label:'Copas', count:14, sigil:'▽' },
  { id:'espadas', label:'Espadas', count:14, sigil:'◇' },
  { id:'ouros', label:'Ouros', count:14, sigil:'○' }
]);
const safe = value => escapeHTML(value ?? '');
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const routeNow = () => String(document.body?.dataset?.screen || location.hash || 'home').replace(/^#/,'').toLowerCase();

function randomInt(max) {
  if (max <= 1) return 0;
  if (globalThis.crypto?.getRandomValues) {
    const limit = Math.floor(0x100000000 / max) * max;
    const values = new Uint32Array(1);
    do globalThis.crypto.getRandomValues(values); while (values[0] >= limit);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function list(value) {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.trim()) : [];
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cardMatchesPath(card, path) {
  if (path === 'all') return true;
  if (path === 'major') return card.arcanaCode === 'major';
  return card.suitCode === path;
}

function searchBlob(card) {
  const deep = meaningForCard(card);
  return normalizeLibraryText([
    card.name, card.names?.en, card.names?.es, card.arcana, card.suit,
    card.element, card.rank, card.correspondences?.astrological,
    card.correspondences?.numerology, card.correspondences?.domain,
    ...list(deep?.keywords), ...list(deep?.symbols),
    text(deep?.essence), text(deep?.centralMessage), text(deep?.dailyEnergy)
  ].filter(Boolean).join(' '));
}

function handoffDraft(card, deep) {
  const keywords = list(deep?.keywords).slice(0, 6).join(', ');
  const symbols = list(deep?.symbols).slice(0, 4).join('; ');
  const essence = text(deep?.essence || deep?.centralMessage).slice(0, 1800);
  return [
    'Quero refletir com Whit sobre uma carta que eu escolhi conscientemente na Biblioteca Viva da Divina Bruxa.',
    `Carta: ${card.name}.`,
    `Orientação: direta.`,
    card.element ? `Elemento: ${card.element}.` : '',
    keywords ? `Palavras-chave editoriais: ${keywords}.` : '',
    symbols ? `Símbolos editoriais: ${symbols}.` : '',
    essence ? `Essência editorial pública: ${essence}` : '',
    'Use somente este contexto público e o que eu escrever. Não trate o símbolo como certeza factual, leitura de pensamentos ou destino inevitável.'
  ].filter(Boolean).join('\n').slice(0, 5000);
}

export class LibraryWorldV302 {
  constructor(root, options = {}) {
    if (!root) throw new TypeError('A Biblioteca Viva não encontrou seu mundo.');
    this.root = root;
    this.abort = new AbortController();
    this.orbCore = options.orbCore || globalThis.divinaOrbSupremeV501?.core || globalThis.orbe?.supreme || null;
    this.orb = this.orbCore?.orb || null;
    this.orbRelease = null;
    this.onSave = typeof options.onSave === 'function' ? options.onSave : null;
    this.path = 'all';
    this.query = '';
    this.limit = PAGE_SIZE;
    this.readerCard = null;
    this.readerTrigger = null;
    this.searchOpen = false;
    this.compareCards = new Set();
    this.favorites = new Set();
    try {
      const saved = store.get(FAVORITES_KEY, []);
      if (Array.isArray(saved)) saved.forEach(id => this.favorites.add(String(id)));
    } catch {}
    this.index = new Map(CARDS.map(card => [card.id, searchBlob(card)]));
    this.root.dataset.libraryWorld = 'v555';
    this.root.classList.add('library-world-v302-host');
    this.build();
    this.bind();
    this.render();
    if (routeNow() === 'library') requestAnimationFrame(() => this.enter());
    document.dispatchEvent(new CustomEvent('divina:library-world-ready', { detail:Object.freeze({ release:'V555', cards:78, orientation:'normal', pageSize:18, canonicalOrb:true, gridFullImageRequests:0 }) }));
  }

  build() {
    this.root.innerHTML = `
      <div class="lb302" data-path="all">
        <header class="lb302__head">
          <div>
            <span>DIVINA BRUXA</span>
            <h2>Biblioteca Viva</h2>
          </div>
          <button type="button" class="lb302__search-toggle" data-search-toggle aria-expanded="false" aria-controls="lb302Search">Buscar</button>
        </header>

        <section class="lb302__sanctuary" aria-labelledby="lb302SanctuaryTitle">
          <div class="lb302__stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <h3 id="lb302SanctuaryTitle" class="lb302__sr">Escolha uma constelação do Tarot</h3>

          <div class="lb302__paths" aria-label="Constelações da Biblioteca">
            ${PATHS.map((path, index) => `<button type="button" data-path="${path.id}" class="lb302__path lb302__path--${index}" aria-pressed="${path.id === 'all'}"><span>${path.sigil}</span><b>${path.label}</b><small>${path.count}</small></button>`).join('')}
          </div>

          <div class="lb302__orb" data-orb aria-label="A Orbe escolhe uma carta da constelação atual">
            <div class="lb302__orb-host" data-library-orb-host></div>
            <span class="lb302__orb-aura" aria-hidden="true"></span>
          </div>

          <div class="lb302__whit" data-whit aria-live="polite">
            <span class="lb302__whit-dot" aria-hidden="true"></span>
            <p><b>Whit</b><span data-whit-line>Escolha uma constelação. Eu fico por perto.</span></p>
          </div>

          <p class="lb302__hint" data-hint>78 cartas · toque na Orbe para uma descoberta</p>
        </section>

        <form id="lb302Search" class="lb302__search" data-search hidden role="search">
          <label for="lb302Query">O que você procura?</label>
          <div><input id="lb302Query" data-query type="search" autocomplete="off" spellcheck="false" placeholder="Uma carta, símbolo, elemento…"><button type="button" data-search-close aria-label="Fechar busca">×</button></div>
        </form>

        <section class="lb302__field" aria-labelledby="lb302FieldTitle">
          <header>
            <div><small data-path-kicker>CONSTELAÇÃO COMPLETA</small><h3 id="lb302FieldTitle" data-path-title>As 78 cartas</h3></div>
            <span data-count>78</span>
          </header>
          <div class="lb302__grid" data-grid></div>
          <button type="button" class="lb302__more" data-more hidden>Continuar explorando</button>
          <aside class="lb302__compare-tray" data-compare-tray hidden aria-live="polite"></aside>
        </section>

        <dialog class="lb302__reader" data-reader aria-labelledby="lb302ReaderTitle">
          <article class="lb302__reader-shell">
            <header>
              <p data-reader-path></p>
              <button type="button" data-reader-close aria-label="Fechar carta">×</button>
            </header>
            <div data-reader-body></div>
          </article>
        </dialog>

        <dialog class="lb302__compare-dialog" data-compare-dialog aria-labelledby="lb302CompareTitle">
          <article><header><div><small>LEITURA RELACIONAL</small><h3 id="lb302CompareTitle">Comparar cartas</h3></div><button type="button" data-compare-close aria-label="Fechar comparação">×</button></header><div data-compare-body></div></article>
        </dialog>

        <p class="lb302__sr" data-live aria-live="polite" role="status"></p>
      </div>`;

    this.world = this.root.querySelector('.lb302');
    this.grid = this.root.querySelector('[data-grid]');
    this.count = this.root.querySelector('[data-count]');
    this.pathTitle = this.root.querySelector('[data-path-title]');
    this.pathKicker = this.root.querySelector('[data-path-kicker]');
    this.hint = this.root.querySelector('[data-hint]');
    this.search = this.root.querySelector('[data-search]');
    this.queryInput = this.root.querySelector('[data-query]');
    this.searchToggle = this.root.querySelector('[data-search-toggle]');
    this.whitLine = this.root.querySelector('[data-whit-line]');
    this.reader = this.root.querySelector('[data-reader]');
    this.readerBody = this.root.querySelector('[data-reader-body]');
    this.readerPath = this.root.querySelector('[data-reader-path]');
    this.live = this.root.querySelector('[data-live]');
    this.more = this.root.querySelector('[data-more]');
    this.compareTray = this.root.querySelector('[data-compare-tray]');
    this.compareDialog = this.root.querySelector('[data-compare-dialog]');
    this.compareBody = this.root.querySelector('[data-compare-body]');
  }

  bind() {
    const signal = this.abort.signal;

    this.root.querySelector('.lb302__paths').addEventListener('click', event => {
      const button = event.target.closest('[data-path]');
      if (!button) return;
      this.selectPath(button.dataset.path);
    }, { signal });

    this.root.querySelector('[data-orb]').addEventListener('click', () => this.orbDiscover(), { signal });
    document.addEventListener('divina:route-ready', event => {
      if (event.detail?.id === 'library') this.enter();
      else this.leave();
    }, { signal });

    this.searchToggle.addEventListener('click', () => this.toggleSearch(true), { signal });
    this.root.querySelector('[data-search-close]').addEventListener('click', () => this.toggleSearch(false), { signal });
    this.queryInput.addEventListener('input', () => {
      this.query = this.queryInput.value;
      this.limit = PAGE_SIZE;
      this.render();
    }, { signal });

    this.grid.addEventListener('click', event => {
      const compare = event.target.closest('[data-compare-card]');
      if (compare) {
        event.preventDefault();
        event.stopPropagation();
        this.toggleCompare(Number(compare.dataset.compareCard));
        return;
      }
      const favorite = event.target.closest('[data-favorite]');
      if (favorite) {
        event.preventDefault();
        this.toggleFavorite(favorite.dataset.favorite);
        return;
      }
      const card = event.target.closest('[data-card-id]');
      if (card) this.openReader(Number(card.dataset.cardId), card);
    }, { signal });

    this.more.addEventListener('click', () => {
      this.limit += PAGE_SIZE;
      this.render();
    }, { signal });

    this.root.querySelector('[data-reader-close]').addEventListener('click', () => this.closeReader(), { signal });
    this.reader.addEventListener('click', event => {
      if (event.target === this.reader) this.closeReader();
      const nav = event.target.closest('[data-reader-nav]');
      if (nav) this.navigateReader(Number(nav.dataset.readerNav));
      const favorite = event.target.closest('[data-reader-favorite]');
      if (favorite) this.toggleFavorite(favorite.dataset.readerFavorite, true);
      const whit = event.target.closest('[data-reader-whit]');
      if (whit) this.prepareWhit(Number(whit.dataset.readerWhit));
      const diary = event.target.closest('[data-reader-diary]');
      if (diary) this.saveReflection(Number(diary.dataset.readerDiary), diary);
    }, { signal });
    this.reader.addEventListener('close', () => this.finishReaderClose(), { signal });

    this.compareTray.addEventListener('click', event => {
      const remove = event.target.closest('[data-compare-remove]');
      if (remove) this.toggleCompare(Number(remove.dataset.compareRemove));
      if (event.target.closest('[data-compare-open]')) this.openComparison();
      if (event.target.closest('[data-compare-clear]')) {
        this.compareCards.clear();
        this.render();
      }
    }, { signal });
    this.root.querySelector('[data-compare-close]').addEventListener('click', () => this.compareDialog.close?.(), { signal });
    this.compareDialog.addEventListener('click', event => {
      if (event.target === this.compareDialog) this.compareDialog.close?.();
    }, { signal });

    this.reader.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); this.navigateReader(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); this.navigateReader(1); }
    }, { signal });
  }

  filtered() {
    const needle = normalizeLibraryText(this.query);
    return CARDS.filter(card => {
      if (!cardMatchesPath(card, this.path)) return false;
      if (!needle) return true;
      return needle.split(' ').every(term => this.index.get(card.id)?.includes(term));
    });
  }

  selectPath(path) {
    if (!PATHS.some(item => item.id === path)) return;
    this.path = path;
    this.limit = PAGE_SIZE;
    this.world.dataset.path = path;
    this.root.querySelectorAll('[data-path]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.path === path));
    });
    const meta = PATHS.find(item => item.id === path);
    this.whitLine.textContent = path === 'all'
      ? 'As 78 estão abertas. Você pode explorar sem ordem.'
      : `Entramos em ${meta.label}. Toca na Orbe se quiser que ela escolha uma carta daqui.`;
    this.render();
  }

  toggleSearch(open) {
    this.searchOpen = Boolean(open);
    this.search.hidden = !this.searchOpen;
    this.searchToggle.setAttribute('aria-expanded', String(this.searchOpen));
    if (this.searchOpen) {
      requestAnimationFrame(() => this.queryInput.focus({ preventScroll:true }));
      this.whitLine.textContent = 'Procura por nome, símbolo, elemento ou palavra. Eu organizo o caminho.';
    } else {
      this.query = '';
      this.queryInput.value = '';
      this.limit = PAGE_SIZE;
      this.render();
    }
  }

  render() {
    const filtered = this.filtered();
    const visible = filtered.slice(0, this.limit);
    const meta = PATHS.find(item => item.id === this.path) || PATHS[0];

    this.pathKicker.textContent = this.query ? 'RESULTADO DA BUSCA' : this.path === 'all' ? 'CONSTELAÇÃO COMPLETA' : `CONSTELAÇÃO · ${meta.label.toLocaleUpperCase('pt-BR')}`;
    this.pathTitle.textContent = this.query ? (filtered.length ? 'Cartas encontradas' : 'Nenhuma carta aqui') : this.path === 'all' ? 'As 78 cartas' : meta.label;
    this.count.textContent = String(filtered.length);
    this.hint.textContent = this.query
      ? `${filtered.length} ${filtered.length === 1 ? 'carta encontrada' : 'cartas encontradas'}`
      : `${meta.count} cartas · toque na Orbe para uma descoberta`;

    this.grid.innerHTML = visible.map((card, index) => {
      const id = cardContentId(card);
      const favorite = this.favorites.has(id);
      const compared = this.compareCards.has(card.id);
      return `<article class="lb302__card" data-card-id="${card.id}" tabindex="0" role="button" aria-label="Abrir ${safe(card.name)}">
        <div class="lb302__card-image"><i class="lb302__card-atlas" style="${cardAtlasStyle(card)}" role="img" aria-label="${safe(card.name)}, direta"></i></div>
        <div class="lb302__card-copy">
          <small>${safe(card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit)}</small>
          <h4>${safe(card.name)}</h4>
          <span>${safe(card.element)} · DIRETA</span>
        </div>
        <button type="button" class="lb302__favorite" data-favorite="${safe(id)}" aria-pressed="${favorite}" aria-label="${favorite ? 'Remover' : 'Adicionar'} ${safe(card.name)} ${favorite ? 'dos' : 'aos'} favoritos">${favorite ? '★' : '☆'}</button>
        <button type="button" class="lb302__compare-pick" data-compare-card="${card.id}" aria-pressed="${compared}" aria-label="${compared ? 'Remover' : 'Adicionar'} ${safe(card.name)} ${compared ? 'da' : 'à'} comparação">${compared ? '✓' : '⇄'}</button>
      </article>`;
    }).join('') || `<div class="lb302__empty"><span aria-hidden="true">✦</span><b>Nenhuma carta respondeu a essa busca.</b><p>Tente outra palavra ou volte para uma constelação.</p></div>`;

    this.grid.querySelectorAll('[data-card-id]').forEach(node => {
      node.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.openReader(Number(node.dataset.cardId), node);
        }
      }, { signal:this.abort.signal });
    });

    this.more.hidden = visible.length >= filtered.length;
    if (!this.more.hidden) this.more.textContent = `Abrir mais estrelas · ${visible.length}/${filtered.length}`;
    this.renderCompareTray();
  }

  toggleCompare(cardId) {
    if (!CARDS.some(card => card.id === cardId)) return;
    if (this.compareCards.has(cardId)) this.compareCards.delete(cardId);
    else if (this.compareCards.size < 3) this.compareCards.add(cardId);
    else {
      this.live.textContent = 'A comparação aceita até três cartas.';
      return;
    }
    this.render();
  }

  renderCompareTray() {
    const cards = [...this.compareCards].map(id => CARDS.find(card => card.id === id)).filter(Boolean);
    this.compareTray.hidden = cards.length === 0;
    if (!cards.length) {
      this.compareTray.innerHTML = '';
      return;
    }
    this.compareTray.innerHTML = `<div><p><small>CONSTELAÇÃO DE COMPARAÇÃO</small><b>${cards.length}/3 cartas escolhidas</b></p><div>${cards.map(card => `<button type="button" data-compare-remove="${card.id}" aria-label="Remover ${safe(card.name)}">${safe(card.name)} <span>×</span></button>`).join('')}</div></div><nav><button type="button" data-compare-clear>Limpar</button><button type="button" data-compare-open class="primary" ${cards.length < 2 ? 'disabled' : ''}>COMPARAR ${cards.length < 2 ? '· ESCOLHA MAIS UMA' : 'AGORA'}</button></nav>`;
  }

  openComparison() {
    const cards = [...this.compareCards].map(id => CARDS.find(card => card.id === id)).filter(Boolean);
    if (cards.length < 2) return;
    this.compareBody.innerHTML = `<p class="lb302__compare-intro">Compare sem procurar uma resposta única: observe aproximações, tensões e diferenças entre os símbolos.</p><div class="lb302__compare-grid">${cards.map(card => {
      const deep = meaningForCard(card) || {};
      const keywords = list(deep.keywords).slice(0, 5);
      return `<section><div class="lb302__compare-image">${cardImageMarkup(card, { priority:'high', decorative:true })}</div><small>${safe(card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit)} · ${safe(card.element)}</small><h4>${safe(card.name)}</h4><p>${safe(deep.essence || deep.centralMessage || deep.dailyEnergy || 'Observe como esta carta modifica o conjunto.')}</p>${keywords.length ? `<ul>${keywords.map(word => `<li>${safe(word)}</li>`).join('')}</ul>` : ''}</section>`;
    }).join('')}</div><footer><b>Perguntas para a síntese</b><p>O que se repete? O que entra em contraste? Qual carta oferece movimento, qual pede pausa e qual mostra uma possibilidade de integração?</p></footer>`;
    if (typeof this.compareDialog.showModal === 'function') this.compareDialog.showModal();
    else this.compareDialog.setAttribute('open', '');
  }

  orbDiscover() {
    const cards = this.filtered();
    if (!cards.length) {
      this.whitLine.textContent = 'Essa busca não encontrou uma carta. Limpa um pouco o caminho e tenta de novo.';
      return;
    }
    const card = cards[randomInt(cards.length)];
    const target = this.grid.querySelector(`[data-card-id="${card.id}"]`);
    this.world.dataset.orbPulse = String(Date.now());
    this.whitLine.textContent = `A Orbe puxou ${card.name}. Entra nela sem pressa.`;
    this.live.textContent = `A Orbe escolheu ${card.name}.`;
    if (!target && this.limit < cards.length) {
      const index = cards.findIndex(item => item.id === card.id);
      this.limit = Math.max(this.limit, Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE);
      this.render();
    }
    const nextTarget = this.grid.querySelector(`[data-card-id="${card.id}"]`);
    if (!reducedMotion()) nextTarget?.animate?.([
      { transform:'translateY(0) scale(1)' },
      { transform:'translateY(-5px) scale(1.018)', offset:.55 },
      { transform:'translateY(0) scale(1)' }
    ], { duration:260, easing:'cubic-bezier(.22,.82,.24,1)' });
    requestAnimationFrame(() => this.openReader(card.id, nextTarget));
  }

  toggleFavorite(contentId, keepReader = false) {
    const id = String(contentId || '');
    if (!id) return;
    if (this.favorites.has(id)) this.favorites.delete(id);
    else this.favorites.add(id);
    try { store.set(FAVORITES_KEY, [...this.favorites]); } catch {}
    this.render();
    if (keepReader && this.readerCard) this.renderReader(this.readerCard);
  }

  openReader(cardId, trigger = null) {
    const card = CARDS.find(item => item.id === cardId);
    if (!card) return false;
    this.readerCard = card;
    this.readerTrigger = trigger || document.activeElement;
    this.renderReader(card);
    if (typeof this.reader.showModal === 'function') this.reader.showModal();
    else this.reader.setAttribute('open', '');
    document.body.classList.add('lb302-reader-open');
    document.dispatchEvent(new CustomEvent('divina:wisdom-public-context-v539', {
      detail:Object.freeze({ kind:'card', id:cardContentId(card), label:card.name, orientation:'normal', private:false })
    }));
    requestAnimationFrame(() => this.root.querySelector('[data-reader-close]')?.focus({ preventScroll:true }));
    return true;
  }

  renderReader(card) {
    const deep = meaningForCard(card) || {};
    const id = cardContentId(card);
    const favorite = this.favorites.has(id);
    const keywords = list(deep.keywords).slice(0, 6);
    const symbols = list(deep.symbols).slice(0, 6);
    const combinations = Array.isArray(deep.combinations) ? deep.combinations.slice(0, 4) : [];
    const correspondences = [
      card.correspondences?.archetype,
      card.correspondences?.astrological && `Astrologia: ${card.correspondences.astrological}`,
      card.correspondences?.numerology && `Numerologia: ${card.correspondences.numerology}`,
      card.number !== null && card.number !== undefined && `Número: ${card.number}`
    ].filter(Boolean);
    const sections = [
      ['Essência', deep.essence || deep.centralMessage],
      ['Na luz', deep.light],
      ['Na tensão', deep.tension],
      ['Amor', deep.love],
      ['Relacionamentos', deep.relationships],
      ['Carreira e caminho', deep.career],
      ['Dinheiro e matéria', deep.money],
      ['Espiritualidade', deep.spirituality],
      ['Conselho', deep.advice],
      ['Pergunta para você', deep.reflectionQuestion]
    ].filter(([, body]) => text(body));

    this.readerPath.textContent = `${card.arcanaCode === 'major' ? 'ARCANO MAIOR' : card.suit.toLocaleUpperCase('pt-BR')} · ${card.element.toLocaleUpperCase('pt-BR')}`;
    this.readerBody.innerHTML = `
      <div class="lb302__reader-hero">
        <div class="lb302__reader-image">${cardImageMarkup(card, { priority:'high', alt:`${card.name}, direta` })}</div>
        <div class="lb302__reader-intro">
          <small>ORIENTAÇÃO DIRETA</small>
          <h3 id="lb302ReaderTitle">${safe(card.name)}</h3>
          ${keywords.length ? `<div class="lb302__keywords">${keywords.map(word => `<span>${safe(word)}</span>`).join('')}</div>` : ''}
          <div class="lb302__reader-actions">
            <button type="button" data-reader-favorite="${safe(id)}" aria-pressed="${favorite}">${favorite ? '★ Favorita' : '☆ Favoritar'}</button>
            <button type="button" data-reader-whit="${card.id}">Refletir com Whit</button>
            <button type="button" data-reader-diary="${card.id}">Guardar no Diário</button>
          </div>
          <p class="lb302__reader-note">Whit e Diário só recebem esta carta depois da sua confirmação. Nada é lido ou enviado automaticamente.</p>
        </div>
      </div>
      <div class="lb302__layers">
        ${sections.map(([title, body], index) => `<details ${index < 2 ? 'open' : ''}><summary>${safe(title)}</summary><p>${safe(body)}</p></details>`).join('')}
        ${correspondences.length ? `<details><summary>Arquétipo e correspondências</summary><ul>${correspondences.map(item => `<li>${safe(item)}</li>`).join('')}</ul></details>` : ''}
        ${symbols.length ? `<details><summary>Símbolos da carta</summary><ul>${symbols.map(item => `<li>${safe(item)}</li>`).join('')}</ul></details>` : ''}
        ${combinations.length ? `<details><summary>Combinações para estudar</summary><ul>${combinations.map(item => `<li><b>${safe(item.with)}</b> — ${safe(item.reading)}</li>`).join('')}</ul></details>` : ''}
      </div>
      <footer class="lb302__source"><b>Leitura editorial responsável</b><span>Tarot em posição direta · conteúdo autoral revisado em setembro de 2026 · símbolos contextualizados, nunca destino fixo.</span><a href="fontes-e-referencias.html">Fontes e referências</a></footer>
      <nav class="lb302__reader-nav" aria-label="Navegar pelas cartas">
        <button type="button" data-reader-nav="-1">← anterior</button>
        <span>${card.index + 1} / 78</span>
        <button type="button" data-reader-nav="1">próxima →</button>
      </nav>`;
  }

  navigateReader(delta) {
    if (!this.readerCard) return;
    let index = CARDS.findIndex(card => card.id === this.readerCard.id);
    index = (index + delta + CARDS.length) % CARDS.length;
    this.readerCard = CARDS[index];
    this.renderReader(this.readerCard);
    document.dispatchEvent(new CustomEvent('divina:wisdom-public-context-v539', {
      detail:Object.freeze({ kind:'card', id:cardContentId(this.readerCard), label:this.readerCard.name, orientation:'normal', private:false })
    }));
    this.reader.querySelector('.lb302__reader-shell')?.scrollTo?.({ top:0, behavior:'auto' });
  }

  prepareWhit(cardId) {
    const card = CARDS.find(item => item.id === cardId);
    if (!card) return;
    const deep = meaningForCard(card) || {};
    const confirmed = globalThis.confirm
      ? globalThis.confirm(`Levar somente ${card.name} para Whit como contexto público? Você ainda poderá revisar antes de enviar.`)
      : true;
    if (!confirmed) return;
    try {
      store.set(WHIT_DRAFT_KEY, {
        text:handoffDraft(card, deep),
        source:'message',
        at:new Date().toISOString(),
        rebirth:'library-v302'
      });
    } catch {
      this.whitLine.textContent = 'Não consegui preparar essa passagem agora. A carta continua aqui.';
      return;
    }
    this.closeReader();
    this.compareDialog?.close?.();
    this.whitLine.textContent = `${card.name} está pronta para você conversar comigo, sem envio automático.`;
    globalThis.orbe?.go?.('ai');
  }

  async saveReflection(cardId, button) {
    const card = CARDS.find(item => item.id === cardId);
    if (!card || !this.onSave) return;
    const deep = meaningForCard(card) || {};
    const confirmed = globalThis.confirm
      ? globalThis.confirm(`Guardar uma reflexão sobre ${card.name} no seu Diário privado?`)
      : true;
    if (!confirmed) return;
    button.disabled = true;
    try {
      await Promise.resolve(this.onSave({
        title:`Biblioteca — ${card.name}`,
        text:[text(deep.essence || deep.centralMessage), text(deep.advice)].filter(Boolean).join('\n\n'),
        question:text(deep.reflectionQuestion),
        tags:`biblioteca, ${card.suit || 'arcano maior'}`,
        mood:'Reflexiva', cardId:card.id, type:'library', orientation:'normal'
      }));
      button.textContent='Guardada no Diário';
      this.live.textContent=`${card.name} foi guardada no seu Diário privado.`;
    } catch {
      button.disabled=false;
      this.live.textContent='Não foi possível guardar agora. A carta continua aberta.';
    }
  }

  closeReader() {
    if (!this.reader.open) return;
    if (typeof this.reader.close === 'function') this.reader.close();
    else {
      this.reader.removeAttribute('open');
      this.finishReaderClose();
    }
  }

  finishReaderClose() {
    document.body.classList.remove('lb302-reader-open');
    const target = this.readerTrigger;
    this.readerTrigger = null;
    this.readerCard = null;
    target?.focus?.({ preventScroll:true });
  }

  destroy() {
    this.abort.abort();
    this.leave();
    this.closeReader();
    this.root.classList.remove('library-world-v302-host');
    delete this.root.dataset.libraryWorld;
  }

  enter() {
    this.leave();
    const host = this.root.querySelector('[data-library-orb-host]');
    if (!host || !this.orbCore?.claim || !this.orb || routeNow() !== 'library') return false;
    this.orbRelease = this.orbCore.claim(host, { mode:'library', ariaLabel:'Orbe das Realidades. Descobrir uma carta na constelação atual da Biblioteca.' });
    return true;
  }

  leave() {
    try { this.orbRelease?.(); } catch {}
    this.orbRelease = null;
  }

  status() {
    return Object.freeze({ release:'V555', cards:78, pageSize:18, orientation:'normal', canonicalOrb:true, duplicateOrb:false, gridFullImageRequests:0, atlasGrid:true, compareLimit:3, permanentAnimationLoops:0 });
  }
}
