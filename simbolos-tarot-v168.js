const form = document.querySelector('[data-symbol-form]');
const input = document.querySelector('[data-symbol-input]');
const clearButton = document.querySelector('[data-symbol-clear]');
const filters = document.querySelector('[data-symbol-filters]');
const sections = [...document.querySelectorAll('[data-symbol-section]')];
const entries = [...document.querySelectorAll('[data-symbol-entry]')];
const countBox = document.querySelector('[data-symbol-count]');
const emptyBox = document.querySelector('[data-symbol-empty]');
let activeCategory = 'todos';

const normalize = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const searchable = new Map(entries.map(entry => [entry, normalize(entry.textContent)]));

const render = () => {
  const raw = input.value.trim();
  const tokens = normalize(raw).split(' ').filter(Boolean);
  let visible = 0;

  for (const entry of entries) {
    const matchesCategory = activeCategory === 'todos' || entry.dataset.category === activeCategory;
    const matchesQuery = tokens.every(token => searchable.get(entry).includes(token));
    entry.hidden = !(matchesCategory && matchesQuery);
    if (!entry.hidden) visible += 1;
  }

  for (const section of sections) {
    section.hidden = !section.querySelector('[data-symbol-entry]:not([hidden])');
  }

  clearButton.hidden = !raw;
  countBox.textContent = `${visible} ${visible === 1 ? 'símbolo' : 'símbolos'}`;
  emptyBox.hidden = visible !== 0;
};

form.addEventListener('submit', event => event.preventDefault());
input.addEventListener('input', render);
input.addEventListener('search', render);

clearButton.addEventListener('click', () => {
  input.value = '';
  input.focus();
  render();
});

filters.addEventListener('click', event => {
  const button = event.target.closest('[data-symbol-filter]');
  if (!button) return;
  activeCategory = button.dataset.symbolFilter;
  filters.querySelectorAll('[data-symbol-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  render();
});

document.querySelector('[data-symbol-reset]').addEventListener('click', () => {
  input.value = '';
  activeCategory = 'todos';
  filters.querySelectorAll('[data-symbol-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.symbolFilter === 'todos')));
  input.focus();
  render();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.activeElement === input && input.value) {
    input.value = '';
    render();
  }
});

render();
