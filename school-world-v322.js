import { SCHOOL_MODULES } from './school-data-v322.js';

const STORAGE_KEY = 'divina-bruxa-3.escola.progresso.v1';
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function moduleCards(module, cards) {
  if (module.cardFilter === 'major') return cards.filter(card => card.arcanaCode === 'major');
  if (module.cardFilter === 'court') return cards.filter(card => Boolean(card.court));
  if (module.cardFilter) return cards.filter(card => card.suitCode === module.cardFilter);
  return [];
}

function loadProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return new Set(Array.isArray(value) ? value.filter(id => SCHOOL_MODULES.some(module => module.id === id)) : []);
  } catch { return new Set(); }
}

export function createSchoolWorld({ cards, showCard, announce }) {
  const nodes = {
    search:document.querySelector('#schoolSearch'),
    modules:document.querySelector('#schoolModules'),
    completed:document.querySelector('#schoolCompleted'),
    progress:document.querySelector('#schoolProgressBar'),
    symbol:document.querySelector('#schoolLessonSymbol'),
    number:document.querySelector('#schoolLessonNumber'),
    title:document.querySelector('#schoolLessonTitle'),
    intro:document.querySelector('#schoolLessonIntro'),
    focus:document.querySelector('#schoolLessonFocus'),
    body:document.querySelector('#schoolLessonBody'),
    practicePrompt:document.querySelector('#schoolPracticePrompt'),
    practiceToggle:document.querySelector('#schoolPracticeToggle'),
    practiceGuide:document.querySelector('#schoolPracticeGuide'),
    cards:document.querySelector('#schoolCards'),
    complete:document.querySelector('#completeSchoolModule'),
    next:document.querySelector('#nextSchoolModule'),
    lesson:document.querySelector('#schoolLesson')
  };
  let selectedId = SCHOOL_MODULES[0].id;
  let practiceOpen = false;
  const completed = loadProgress();

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch {}
  }

  function selected() {
    return SCHOOL_MODULES.find(module => module.id === selectedId) || SCHOOL_MODULES[0];
  }

  function matchingModules() {
    const query = normalize(nodes.search.value);
    if (!query) return SCHOOL_MODULES;
    return SCHOOL_MODULES.filter(module => {
      const text = normalize([module.title, module.intro, ...module.focus].join(' '));
      return text.includes(query) || moduleCards(module, cards).some(card => normalize(`${card.name} ${card.element} ${card.suit}`).includes(query));
    });
  }

  function renderModules() {
    const fragment = document.createDocumentFragment();
    const modules = matchingModules();
    modules.forEach(module => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'school-module';
      if (completed.has(module.id)) button.classList.add('is-complete');
      if (module.id === selectedId) button.setAttribute('aria-current', 'true');
      button.innerHTML = `<span aria-hidden="true">${completed.has(module.id) ? '✓' : module.symbol}</span><span><small>MÓDULO ${module.number}</small><b>${module.title}</b></span>`;
      button.addEventListener('click', () => {
        selectedId = module.id;
        practiceOpen = false;
        render();
        announce(`Módulo ${module.number}: ${module.title}.`);
        if (matchMedia('(max-width: 779px)').matches) {
          requestAnimationFrame(() => {
            nodes.lesson.scrollIntoView({ behavior:'smooth', block:'start' });
            nodes.title.setAttribute('tabindex', '-1');
            nodes.title.focus({ preventScroll:true });
          });
        }
      });
      fragment.append(button);
    });
    if (!modules.length) {
      const empty = document.createElement('p');
      empty.className = 'library-empty';
      empty.textContent = 'Nenhum módulo ou carta encontrou esse termo.';
      fragment.append(empty);
    }
    nodes.modules.replaceChildren(fragment);
  }

  function renderLesson() {
    const module = selected();
    nodes.symbol.textContent = module.symbol;
    nodes.number.textContent = `MÓDULO ${module.number}`;
    nodes.title.textContent = module.title;
    nodes.intro.textContent = module.intro;
    nodes.focus.replaceChildren(...module.focus.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
    nodes.body.replaceChildren(...module.lesson.map(paragraph => {
      const node = document.createElement('p');
      node.textContent = paragraph;
      return node;
    }));
    nodes.practicePrompt.textContent = module.practice;
    nodes.practiceToggle.textContent = practiceOpen ? 'FECHAR PRÁTICA' : 'COMEÇAR PRÁTICA';
    nodes.practiceToggle.setAttribute('aria-expanded', String(practiceOpen));
    nodes.practiceGuide.hidden = !practiceOpen;
    const filteredCards = moduleCards(module, cards);
    nodes.cards.hidden = !filteredCards.length;
    const fragment = document.createDocumentFragment();
    filteredCards.forEach(card => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'school-card';
      button.setAttribute('aria-label', `Estudar ${card.name}`);
      const image = new Image();
      image.src = `assets/cards/${card.image}`;
      image.alt = '';
      image.loading = 'lazy';
      image.width = 160;
      image.height = 240;
      const label = document.createElement('span');
      label.textContent = card.name;
      button.append(image, label);
      button.addEventListener('click', () => showCard(card, `ESCOLA · ${module.title.toUpperCase()}`));
      fragment.append(button);
    });
    nodes.cards.replaceChildren(fragment);
    const done = completed.has(module.id);
    nodes.complete.textContent = done ? 'Módulo concluído · desfazer' : 'Marcar módulo como concluído';
    nodes.complete.setAttribute('aria-pressed', String(done));
    nodes.next.textContent = module.number === SCHOOL_MODULES.length ? 'Voltar ao módulo 1 ↺' : 'Próximo módulo →';
  }

  function renderProgress() {
    nodes.completed.textContent = String(completed.size);
    nodes.progress.style.width = `${(completed.size / SCHOOL_MODULES.length) * 100}%`;
  }

  function render() {
    renderModules();
    renderLesson();
    renderProgress();
  }

  nodes.search.addEventListener('input', renderModules);
  nodes.practiceToggle.addEventListener('click', () => {
    practiceOpen = !practiceOpen;
    renderLesson();
    announce(practiceOpen ? `Prática do módulo ${selected().number} aberta.` : 'Prática recolhida.');
  });
  nodes.complete.addEventListener('click', () => {
    const module = selected();
    if (completed.has(module.id)) completed.delete(module.id);
    else completed.add(module.id);
    save();
    render();
    announce(completed.has(module.id) ? `${module.title} concluído.` : `${module.title} voltou ao caminho de estudo.`);
  });
  nodes.next.addEventListener('click', () => {
    const currentIndex = SCHOOL_MODULES.findIndex(module => module.id === selectedId);
    selectedId = SCHOOL_MODULES[(currentIndex + 1) % SCHOOL_MODULES.length].id;
    practiceOpen = false;
    render();
    nodes.lesson.scrollIntoView({ behavior:'smooth', block:'start' });
    announce(`Módulo ${selected().number}: ${selected().title}.`);
  });

  render();
  return Object.freeze({ activate:render });
}
