import { LIBRARY_GUIDES } from '../data/library.js';

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function cardPublicHref(card) {
  if (card.arcanaCode === 'major') return `carta-${card.canonicalId}.html`;
  return `carta-${card.canonicalId.replace(/^\d{2}-/, '')}.html`;
}

export function createLibraryWorld({ cards, showCard }) {
  const nodes = {
    search:document.querySelector('#librarySearch'),
    filters:document.querySelector('#libraryFilters'),
    count:document.querySelector('#libraryCount'),
    results:document.querySelector('#libraryResults')
  };
  let filter = 'all';

  function cardMatches(card, query) {
    const searchable = normalize(`${card.name} ${card.names.en} ${card.names.es} ${card.arcana} ${card.suit} ${card.element} ${card.correspondences?.astrological || ''} ${card.correspondences?.domain || ''}`);
    return searchable.includes(query);
  }

  function allowedCard(card) {
    if (filter === 'all') return true;
    if (filter === 'major') return card.arcanaCode === 'major';
    return card.suitCode === filter;
  }

  function render() {
    const query = normalize(nodes.search.value.trim());
    const showGuides = filter === 'all' || filter === 'guides';
    const visibleCards = filter === 'guides' ? [] : cards.filter(card => allowedCard(card) && (!query || cardMatches(card, query)));
    const visibleGuides = showGuides ? LIBRARY_GUIDES.filter(guide => !query || normalize(`${guide.title} ${guide.category} ${guide.description}`).includes(query)) : [];
    const fragment = document.createDocumentFragment();

    visibleGuides.forEach(guide => {
      const article = document.createElement('article');
      article.className = 'library-item library-item--guide';
      const link = document.createElement('a');
      link.href = guide.href;
      link.innerHTML = `<small>${guide.category}</small><h3>${guide.title}</h3><p>${guide.description}</p>`;
      article.append(link);
      fragment.append(article);
    });

    visibleCards.forEach(card => {
      const article = document.createElement('article');
      article.className = 'library-item';
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Abrir ${card.name}`);
      const image = new Image();
      image.src = `assets/cards/${card.image}`;
      image.alt = '';
      image.loading = 'lazy';
      image.width = 220;
      image.height = 330;
      const title = document.createElement('h3');
      title.textContent = card.name;
      const description = document.createElement('p');
      description.textContent = `${card.arcana} · ${card.element} · ${card.suit}`;
      const more = document.createElement('small');
      more.textContent = 'Ver carta e página pública';
      button.append(image, title, description, more);
      button.addEventListener('click', () => showCard(card, 'BIBLIOTECA · CARTA DIRETA', cardPublicHref(card)));
      article.append(button);
      fragment.append(article);
    });

    if (!visibleCards.length && !visibleGuides.length) {
      const empty = document.createElement('p');
      empty.className = 'library-empty';
      empty.textContent = 'Nenhum fio encontrou esse termo. Tente um nome, elemento, naipe ou pergunta diferente.';
      fragment.append(empty);
    }
    nodes.results.replaceChildren(fragment);
    nodes.count.textContent = `${visibleGuides.length} guias · ${visibleCards.length} cartas`;
  }

  nodes.search.addEventListener('input', render);
  nodes.filters.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    nodes.filters.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));

  render();
  return Object.freeze({ activate:render });
}
