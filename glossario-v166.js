(() => {
  const form = document.querySelector('[data-glossary-form]');
  const input = document.querySelector('[data-glossary-input]');
  const clear = document.querySelector('[data-glossary-clear]');
  const count = document.querySelector('[data-glossary-count]');
  const empty = document.querySelector('[data-glossary-empty]');
  const emptyClear = document.querySelector('[data-glossary-empty-clear]');
  const entries = [...document.querySelectorAll('[data-glossary-entry]')];
  const sections = [...document.querySelectorAll('[data-letter]')];
  if (!form || !input || !clear || !count || !empty || entries.length === 0) return;

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
      const matches = tokens.every(token => searchable.get(entry).includes(token));
      entry.hidden = !matches;
      if (matches) visible += 1;
    }
    for (const section of sections) section.hidden = !section.querySelector('[data-glossary-entry]:not([hidden])');
    clear.hidden = !raw;
    empty.hidden = visible !== 0;
    count.textContent = `${visible} ${visible === 1 ? 'termo' : 'termos'}`;
  };

  form.addEventListener('submit', event => event.preventDefault());
  input.addEventListener('input', render);
  input.addEventListener('search', render);
  clear.addEventListener('click', () => { input.value = ''; input.focus(); render(); });
  emptyClear?.addEventListener('click', () => { input.value = ''; input.focus(); render(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.activeElement === input && input.value) {
      input.value = '';
      render();
    }
  });
})();
