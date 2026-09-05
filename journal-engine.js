/* DIVINA BRUXA — DIÁRIO E ESPELHO CELESTIAL V140
   Escrita privada, autosave local, calendário, linha do tempo e padrões não diagnósticos. */

import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js';
import {
  JOURNAL_STORAGE_KEY,
  JOURNAL_DRAFT_KEY,
  JOURNAL_VIEW_KEY,
  JOURNAL_AI_SELECTION_KEY,
  JOURNAL_PERIODS,
  JOURNAL_TYPES,
  JOURNAL_MOODS,
  createJournalEntry,
  normalizeJournalEntries,
  entriesForJournalPeriod,
  calendarJournalCounts,
  publicMirrorData,
  privateJournalExport,
  splitJournalTags,
  entryCardIds,
  journalDateKey
} from './journal-policy.js?v=140';

const safe = value => escapeHTML(value ?? '');
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const smooth = () => reducedMotion() ? 'auto' : 'smooth';
const formatDate = value => {
  try { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value)); }
  catch { return 'Data preservada'; }
};
const formatShortDate = value => {
  try { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); }
  catch { return 'Memória'; }
};
const toLocalInput = value => {
  const date = new Date(value || Date.now());
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};
const typeLabel = value => JOURNAL_TYPES.find(item => item.id === value)?.label || 'Reflexão livre';
const topPair = object => Object.entries(object || {}).sort((a, b) => b[1] - a[1])[0] || null;
const selectorEscape = value => globalThis.CSS?.escape
  ? CSS.escape(String(value))
  : String(value).replace(/[^a-zA-Z0-9_-]/g, character => `\\${character}`);

export class JournalEngine {
  constructor(root) {
    this.root = root?.id === 'journalApp' ? root : document.querySelector('#journalApp');
    if (!this.root) return;
    const savedView = store.get(JOURNAL_VIEW_KEY, {});
    this.editingId = null;
    this.pendingDelete = '';
    this.pendingAI = '';
    this.filters = { query: '', mood: '', type: '', date: '', card: '', theme: '', favorites: false };
    this.period = JOURNAL_PERIODS.some(item => item.id === savedView?.period) ? savedView.period : '30';
    this.view = savedView?.view === 'calendar' ? 'calendar' : 'timeline';
    this.calendarDate = new Date();
    this.draftTimer = 0;
    this.renderShell();
    this.bind();
    this.restoreDraft();
    this.render();
    this.updateNetworkState();
  }

  notify(message) {
    window.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
  }

  all() {
    return normalizeJournalEntries(store.get(JOURNAL_STORAGE_KEY, []));
  }

  saveAll(entries) {
    store.set(JOURNAL_STORAGE_KEY, normalizeJournalEntries(entries));
  }

  saveView() {
    store.set(JOURNAL_VIEW_KEY, { period: this.period, view: this.view });
  }

  renderShell() {
    this.root.innerHTML = `
      <section class="journal-command" aria-label="Estado do Diário">
        <div><span class="journal-private-seal" aria-hidden="true">◇</span><p><b>Privado por padrão</b><small>O corpo das memórias não vai para Admin, analytics ou IA.</small></p></div>
        <div class="journal-state"><span data-journal-save-state>Pronto para escrever</span><span data-journal-network></span></div>
      </section>

      <div id="journalRhythm" class="journal-rhythm-mount"></div>

      <section class="journal-workspace">
        <form id="journalForm" class="journal-editor" autocomplete="off">
          <header><div><p class="eyebrow">NOVA MEMÓRIA</p><h3 data-editor-title>Escreva sem se perder.</h3></div><span aria-hidden="true">✦</span></header>
          <div class="journal-form-grid">
            <label class="journal-field journal-field-title"><span>Título</span><input name="title" required maxlength="120" placeholder="Nome desta memória"></label>
            <label class="journal-field"><span>Data e hora</span><input name="createdAt" type="datetime-local" value="${toLocalInput()}"></label>
            <label class="journal-field"><span>Tipo</span><select name="type">${JOURNAL_TYPES.map(item => `<option value="${item.id}">${safe(item.label)}</option>`).join('')}</select></label>
            <label class="journal-field"><span>Como você está?</span><select name="mood">${JOURNAL_MOODS.map(mood => `<option>${safe(mood)}</option>`).join('')}</select></label>
            <label class="journal-field"><span>Coleção</span><input name="collection" maxlength="80" placeholder="Ex.: Lua Nova"></label>
            <label class="journal-field"><span>Carta relacionada</span><select name="cardId"><option value="">Nenhuma carta</option>${CARDS.map(card => `<option value="${card.id}">${safe(card.name)}</option>`).join('')}</select></label>
            <label class="journal-field journal-field-wide"><span>Pergunta ou intenção</span><input name="question" maxlength="600" placeholder="O que deseja compreender?"></label>
            <label class="journal-field journal-field-wide"><span>Reflexão</span><textarea name="text" required maxlength="16000" rows="9" placeholder="Escreva sensações, acontecimentos, símbolos e aprendizados…"></textarea></label>
            <label class="journal-field"><span>Etiquetas</span><input name="tags" maxlength="440" placeholder="amor, trabalho, sonho"></label>
            <label class="journal-field"><span>Relacionamentos e pessoas</span><input name="relationships" maxlength="300" placeholder="Opcional · nomes ou temas"></label>
            <label class="journal-field journal-field-wide"><span>Aula relacionada</span><input name="relatedLesson" maxlength="180" placeholder="Opcional · módulo ou aula da Escola"></label>
          </div>
          <p class="journal-privacy"><span aria-hidden="true">◇</span><span><b>Esta página é um espaço privado.</b> O rascunho é salvo somente neste aparelho e não é sincronizado enquanto o servidor seguro não estiver ativo.</span></p>
          <div class="journal-editor-actions"><button type="submit" class="primary" data-save-entry>Guardar no Diário</button><button type="button" class="text-button" data-cancel-edit hidden>Cancelar edição</button><span data-draft-detail>Nenhum rascunho pendente</span></div>
        </form>

        <aside class="journal-mirror" aria-labelledby="mirrorTitle">
          <header><div><p class="eyebrow">ESPELHO DA ORBE</p><h3 id="mirrorTitle">Padrões, não sentenças.</h3></div><span class="mirror-glyph" aria-hidden="true">☾</span></header>
          <nav class="mirror-periods" aria-label="Período do Espelho">${JOURNAL_PERIODS.map(item => `<button type="button" data-mirror-period="${item.id}" aria-pressed="${item.id === this.period}">${safe(item.label)}</button>`).join('')}</nav>
          <div id="mirrorStats" class="mirror-celestial-stats"></div>
          <div id="mirrorPatterns" class="mirror-patterns"></div>
        </aside>
      </section>

      <section class="journal-explorer" aria-labelledby="journalMemoriesTitle">
        <header class="journal-explorer-head"><div><p class="eyebrow">MEMÓRIAS</p><h3 id="journalMemoriesTitle">Seu tempo simbólico.</h3></div><div class="journal-view-tabs" role="group" aria-label="Visualização"><button type="button" data-journal-view="timeline" aria-pressed="${this.view === 'timeline'}">Linha do tempo</button><button type="button" data-journal-view="calendar" aria-pressed="${this.view === 'calendar'}">Calendário</button></div></header>
        <div class="journal-tools">
          <label class="journal-search"><span>Buscar</span><input id="journalSearch" type="search" placeholder="Título, texto, carta ou tema"></label>
          <label><span>Humor</span><select id="journalMoodFilter"><option value="">Todos</option>${JOURNAL_MOODS.map(mood => `<option>${safe(mood)}</option>`).join('')}</select></label>
          <label><span>Tipo</span><select id="journalTypeFilter"><option value="">Todos</option>${JOURNAL_TYPES.map(item => `<option value="${item.id}">${safe(item.label)}</option>`).join('')}</select></label>
          <label><span>Data</span><input id="journalDateFilter" type="date"></label>
          <label><span>Carta</span><select id="journalCardFilter"><option value="">Todas</option>${CARDS.map(card => `<option value="${card.id}">${safe(card.name)}</option>`).join('')}</select></label>
          <label><span>Tema ou coleção</span><input id="journalThemeFilter" type="search" placeholder="Ex.: amor"></label>
          <label class="journal-favorite-filter"><input id="journalFavoriteFilter" type="checkbox"><span>Somente favoritas</span></label>
          <button type="button" class="text-button" data-clear-filters>Limpar filtros</button>
        </div>
        <div class="journal-result-line"><span data-journal-count></span><div><button type="button" id="exportJournal" class="text-button">Baixar meus dados</button><button type="button" class="text-button journal-premium-export" data-premium-export>Exportação Celestial · Premium</button></div></div>
        <div id="journalCalendar" class="journal-calendar"></div>
        <div id="entries" class="entries journal-timeline" aria-live="polite"></div>
        <footer class="journal-premium-note"><span aria-hidden="true">✦</span><p><b>Premium · R$ 199,90 · pagamento único</b><small>Histórico completo, calendário, coleções e exportação editorial. É separado da Orbe IA e não inclui IA ilimitada. A ativação final continua dependente do servidor seguro.</small></p></footer>
      </section>`;

    this.form = this.root.querySelector('#journalForm');
    this.list = this.root.querySelector('#entries');
    this.mirror = this.root.querySelector('#mirrorStats');
    this.patterns = this.root.querySelector('#mirrorPatterns');
    this.calendar = this.root.querySelector('#journalCalendar');
  }

  bind() {
    this.form.onsubmit = event => {
      event.preventDefault();
      this.commitForm();
    };

    this.form.addEventListener('input', () => this.scheduleDraft());
    this.root.querySelector('[data-cancel-edit]').onclick = () => this.cancelEdit();

    const bindFilter = (selector, key, event = 'input') => {
      this.root.querySelector(selector)?.addEventListener(event, ({ target }) => {
        this.filters[key] = target.type === 'checkbox' ? target.checked : target.value;
        this.pendingDelete = '';
        this.pendingAI = '';
        this.renderExplorer();
      });
    };
    bindFilter('#journalSearch', 'query');
    bindFilter('#journalMoodFilter', 'mood', 'change');
    bindFilter('#journalTypeFilter', 'type', 'change');
    bindFilter('#journalDateFilter', 'date', 'change');
    bindFilter('#journalCardFilter', 'card', 'change');
    bindFilter('#journalThemeFilter', 'theme');
    bindFilter('#journalFavoriteFilter', 'favorites', 'change');

    this.root.querySelector('[data-clear-filters]').onclick = () => this.clearFilters();
    this.root.querySelector('#exportJournal').onclick = () => this.exportData();
    this.root.querySelector('[data-premium-export]').onclick = () => {
      this.notify('A Exportação Celestial permanece protegida pelo Premium.');
      globalThis.orbe?.go?.('subscriptions');
    };

    this.root.querySelector('.mirror-periods').onclick = event => {
      const button = event.target.closest('[data-mirror-period]');
      if (!button) return;
      this.period = button.dataset.mirrorPeriod;
      this.saveView();
      this.renderMirror(this.all());
    };

    this.root.querySelector('.journal-view-tabs').onclick = event => {
      const button = event.target.closest('[data-journal-view]');
      if (!button) return;
      this.view = button.dataset.journalView;
      this.saveView();
      this.updateViewTabs();
      this.renderExplorer();
    };

    this.list.onclick = event => this.handleEntryAction(event);
    this.calendar.onclick = event => this.handleCalendarAction(event);
    window.addEventListener('online', () => this.updateNetworkState());
    window.addEventListener('offline', () => this.updateNetworkState());
  }

  formValues() {
    return Object.fromEntries(new FormData(this.form));
  }

  setSaveState(message, mode = '') {
    const state = this.root.querySelector('[data-journal-save-state]');
    if (!state) return;
    state.textContent = message;
    state.dataset.state = mode;
  }

  scheduleDraft() {
    clearTimeout(this.draftTimer);
    this.setSaveState('Salvando rascunho…', 'saving');
    const detail = this.root.querySelector('[data-draft-detail]');
    if (detail) detail.textContent = 'Salvando…';
    this.draftTimer = setTimeout(() => {
      const draft = { ...this.formValues(), _editingId: this.editingId, status: 'draft', updatedAt: new Date().toISOString() };
      store.set(JOURNAL_DRAFT_KEY, draft);
      this.setSaveState('Rascunho salvo neste aparelho', 'saved');
      if (detail) detail.textContent = `Rascunho salvo às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }, 350);
  }

  restoreDraft() {
    const draft = store.get(JOURNAL_DRAFT_KEY);
    if (!draft || typeof draft !== 'object') return;
    for (const [name, value] of Object.entries(draft)) {
      const field = this.form.elements.namedItem(name);
      if (field && typeof value === 'string') field.value = value;
    }
    if (draft._editingId && this.all().some(entry => entry.id === draft._editingId)) {
      this.editingId = draft._editingId;
      this.setEditingState(true);
    }
    this.setSaveState('Rascunho restaurado', 'saved');
    const detail = this.root.querySelector('[data-draft-detail]');
    if (detail) detail.textContent = 'Seu texto foi recuperado sem perdas.';
    this.notify('Rascunho privado restaurado.');
  }

  commitForm() {
    clearTimeout(this.draftTimer);
    const values = this.formValues();
    const entries = this.all();
    if (this.editingId) {
      const index = entries.findIndex(entry => entry.id === this.editingId);
      if (index >= 0) entries[index] = createJournalEntry({
        ...entries[index],
        ...values,
        id: this.editingId,
        cardIds: entries[index].cardIds,
        favorite: entries[index].favorite,
        updatedAt: new Date().toISOString()
      });
    } else {
      entries.unshift(createJournalEntry({ ...values, updatedAt: new Date().toISOString() }));
    }
    this.saveAll(entries);
    store.remove(JOURNAL_DRAFT_KEY);
    this.editingId = null;
    this.form.reset();
    this.form.elements.createdAt.value = toLocalInput();
    this.form.elements.mood.value = 'Reflexiva';
    this.setEditingState(false);
    this.setSaveState('Memória guardada', 'saved');
    this.root.querySelector('[data-draft-detail]').textContent = 'Tudo salvo neste aparelho.';
    this.render();
    this.notify('Guardado no Diário da Orbe.');
  }

  cancelEdit() {
    clearTimeout(this.draftTimer);
    this.editingId = null;
    store.remove(JOURNAL_DRAFT_KEY);
    this.form.reset();
    this.form.elements.createdAt.value = toLocalInput();
    this.form.elements.mood.value = 'Reflexiva';
    this.setEditingState(false);
    this.setSaveState('Edição cancelada', '');
    this.root.querySelector('[data-draft-detail]').textContent = 'Nenhum rascunho pendente';
  }

  setEditingState(active) {
    const title = this.root.querySelector('[data-editor-title]');
    const submit = this.root.querySelector('[data-save-entry]');
    const cancel = this.root.querySelector('[data-cancel-edit]');
    if (title) title.textContent = active ? 'Revise esta memória.' : 'Escreva sem se perder.';
    if (submit) submit.textContent = active ? 'Salvar alterações' : 'Guardar no Diário';
    if (cancel) cancel.hidden = !active;
  }

  add(input) {
    const entries = this.all();
    entries.unshift(createJournalEntry(input));
    this.saveAll(entries);
    this.render();
    this.notify('Guardado no Diário da Orbe.');
  }

  filtered(entries) {
    const query = this.filters.query.trim().toLocaleLowerCase('pt-BR');
    const theme = this.filters.theme.trim().toLocaleLowerCase('pt-BR');
    const cardId = this.filters.card === '' ? null : Number(this.filters.card);
    return entries.filter(entry => {
      const cards = entryCardIds(entry);
      const cardNames = cards.map(id => CARDS[id]?.name || '').join(' ');
      const searchable = [entry.title, entry.text, entry.question, entry.tags, entry.collection, entry.mood, entry.relationships, entry.relatedLesson, cardNames].join(' ').toLocaleLowerCase('pt-BR');
      const themes = [entry.tags, entry.collection].join(' ').toLocaleLowerCase('pt-BR');
      return (!query || searchable.includes(query))
        && (!theme || themes.includes(theme))
        && (!this.filters.mood || entry.mood === this.filters.mood)
        && (!this.filters.type || entry.type === this.filters.type)
        && (!this.filters.date || journalDateKey(entry.createdAt) === this.filters.date)
        && (cardId === null || cards.includes(cardId))
        && (!this.filters.favorites || entry.favorite);
    });
  }

  clearFilters() {
    this.filters = { query: '', mood: '', type: '', date: '', card: '', theme: '', favorites: false };
    for (const selector of ['#journalSearch', '#journalMoodFilter', '#journalTypeFilter', '#journalDateFilter', '#journalCardFilter', '#journalThemeFilter']) {
      const field = this.root.querySelector(selector);
      if (field) field.value = '';
    }
    this.root.querySelector('#journalFavoriteFilter').checked = false;
    this.renderExplorer();
  }

  render() {
    const entries = this.all();
    this.renderMirror(entries);
    this.renderExplorer(entries);
  }

  renderMirror(entries) {
    const selected = entriesForJournalPeriod(entries, this.period);
    const aggregate = publicMirrorData(selected);
    const cardPair = topPair(aggregate.cardCounts);
    const topCard = cardPair ? CARDS[Number(cardPair[0])] : null;
    const suitCounts = { Maiores: 0, Copas: 0, Espadas: 0, Paus: 0, Ouros: 0 };
    let majors = 0;
    let minors = 0;
    selected.flatMap(entryCardIds).forEach(id => {
      const card = CARDS[id];
      if (!card) return;
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
      if (card.arcanaCode === 'major') majors += 1;
      else minors += 1;
    });
    const suitPair = topPair(suitCounts);
    const moodPair = topPair(aggregate.moodCounts);
    const tagCounts = {};
    selected.flatMap(entry => splitJournalTags(entry.tags)).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const activeDays = Object.keys(aggregate.dayCounts).length;
    const wordCount = selected.reduce((total, entry) => total + entry.text.split(/\s+/).filter(Boolean).length, 0);
    const windowDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = journalDateKey(date);
      return { key, label: new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow' }).format(date), count: aggregate.dayCounts[key] || 0 };
    });
    const maxDay = Math.max(1, ...windowDays.map(day => day.count));

    this.root.querySelectorAll('[data-mirror-period]').forEach(button => {
      const active = button.dataset.mirrorPeriod === this.period;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('active', active);
    });

    this.mirror.innerHTML = `
      <div><strong>${aggregate.total}</strong><span>memórias no período</span></div>
      <div><strong>${topCard ? safe(topCard.name) : '—'}</strong><span>carta mais presente</span></div>
      <div><strong>${selected.length && suitPair?.[1] ? safe(suitPair[0]) : '—'}</strong><span>naipe mais presente</span></div>
      <div><strong>${moodPair ? safe(moodPair[0]) : '—'}</strong><span>humor mais registrado</span></div>
      <div><strong>${activeDays}</strong><span>dias com memórias</span></div>
      <div><strong>${wordCount.toLocaleString('pt-BR')}</strong><span>palavras preservadas</span></div>`;

    if (!selected.length) {
      this.patterns.innerHTML = '<p class="mirror-empty">Escreva ou guarde uma leitura para que o Espelho encontre relações neste período.</p><p class="mirror-disclaimer">O Espelho descreve frequências; não faz diagnósticos nem determina quem você é.</p>';
      return;
    }

    const arcanaCopy = majors || minors ? `${majors} Arcanos Maiores e ${minors} Arcanos Menores aparecem nas memórias relacionadas a cartas.` : 'Ainda não há cartas relacionadas neste período.';
    const tagCopy = tags.length ? `Temas recorrentes: ${tags.map(([tag, count]) => `${safe(tag)} (${count})`).join(' · ')}.` : 'Adicione etiquetas para enxergar temas recorrentes.';
    this.patterns.innerHTML = `
      <section class="mirror-week" aria-label="Memórias nos últimos sete dias">${windowDays.map(day => `<span><i style="--mirror-height:${Math.max(8, Math.round(day.count / maxDay * 100))}%"></i><small>${safe(day.label)}</small><b>${day.count}</b></span>`).join('')}</section>
      <div class="mirror-observations">
        <p><span aria-hidden="true">✦</span>${topCard ? `${safe(topCard.name)} é a carta que mais reaparece neste recorte.` : 'Nenhuma carta se repete neste recorte.'}</p>
        <p><span aria-hidden="true">☾</span>${arcanaCopy}</p>
        <p><span aria-hidden="true">◇</span>${tagCopy}</p>
      </div>
      <p class="mirror-disclaimer">Estes são padrões de registro, não verdades absolutas, diagnósticos ou previsões.</p>`;
  }

  updateViewTabs() {
    this.root.querySelectorAll('[data-journal-view]').forEach(button => {
      const active = button.dataset.journalView === this.view;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('active', active);
    });
  }

  renderExplorer(source = this.all()) {
    const entries = this.filtered(source);
    this.updateViewTabs();
    this.root.querySelector('[data-journal-count]').textContent = `${entries.length} ${entries.length === 1 ? 'memória encontrada' : 'memórias encontradas'}`;
    this.calendar.hidden = this.view !== 'calendar';
    this.list.hidden = this.view === 'calendar';
    if (this.view === 'calendar') this.renderCalendar(source);
    else this.renderTimeline(entries);
  }

  renderCalendar(entries) {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const counts = calendarJournalCounts(entries, year, month);
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const title = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(this.calendarDate);
    const blanks = Array.from({ length: first }, () => '<span class="journal-calendar-blank" aria-hidden="true"></span>').join('');
    const days = Array.from({ length: total }, (_, index) => {
      const day = index + 1;
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const count = counts[key] || 0;
      const today = key === journalDateKey(new Date());
      const selected = key === this.filters.date;
      return `<button type="button" data-calendar-day="${key}" class="${count ? 'has-memory' : ''}${today ? ' today' : ''}${selected ? ' selected' : ''}" aria-label="${day} de ${safe(title)}: ${count} ${count === 1 ? 'memória' : 'memórias'}"><b>${day}</b>${count ? `<span>${count}</span>` : '<i></i>'}</button>`;
    }).join('');
    this.calendar.innerHTML = `<header><button type="button" data-calendar-prev aria-label="Mês anterior">←</button><h4>${safe(title)}</h4><button type="button" data-calendar-next aria-label="Próximo mês">→</button></header><div class="journal-weekdays" aria-hidden="true"><span>DOM</span><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span></div><div class="journal-calendar-grid">${blanks}${days}</div><button type="button" class="text-button" data-calendar-today>Voltar ao mês atual</button>`;
  }

  handleCalendarAction(event) {
    if (event.target.closest('[data-calendar-prev]')) {
      this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, 1);
      this.renderCalendar(this.all());
      return;
    }
    if (event.target.closest('[data-calendar-next]')) {
      this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 1);
      this.renderCalendar(this.all());
      return;
    }
    if (event.target.closest('[data-calendar-today]')) {
      this.calendarDate = new Date();
      this.renderCalendar(this.all());
      return;
    }
    const day = event.target.closest('[data-calendar-day]');
    if (!day) return;
    this.filters.date = day.dataset.calendarDay;
    this.root.querySelector('#journalDateFilter').value = this.filters.date;
    this.view = 'timeline';
    this.saveView();
    this.renderExplorer();
  }

  renderTimeline(entries) {
    if (!entries.length) {
      this.list.innerHTML = '<div class="journal-empty"><span aria-hidden="true">☾</span><h4>Nenhuma memória neste recorte.</h4><p>Escreva uma nova reflexão ou limpe os filtros para rever o que já foi guardado.</p></div>';
      return;
    }
    let lastDay = '';
    this.list.innerHTML = entries.map(entry => {
      const day = journalDateKey(entry.createdAt);
      const divider = day === lastDay ? '' : `<h4 class="journal-day-divider"><span>${safe(formatShortDate(entry.createdAt))}</span></h4>`;
      lastDay = day;
      return `${divider}${this.entryMarkup(entry)}`;
    }).join('');
  }

  entryMarkup(entry) {
    const ids = entryCardIds(entry);
    const cards = ids.map(id => CARDS[id]).filter(Boolean);
    const tags = splitJournalTags(entry.tags);
    const deleteConfirm = this.pendingDelete === entry.id ? `<div class="journal-inline-confirm" role="alert"><p><b>Excluir esta memória?</b> Esta ação não pode ser desfeita.</p><div><button type="button" data-delete-cancel>Manter memória</button><button type="button" class="danger" data-delete-confirm>Sim, excluir</button></div></div>` : '';
    const aiConfirm = this.pendingAI === entry.id ? `<div class="journal-inline-confirm journal-ai-confirm" role="alert"><p><b>Levar somente esta entrada para a Orbe IA?</b> Ela será preparada localmente. Nada será enviado até você marcar o consentimento da IA e tocar em Enviar.</p><div><button type="button" data-ai-cancel>Cancelar</button><button type="button" data-ai-confirm>Preparar esta entrada</button></div></div>` : '';
    return `<article class="journal-entry journal-memory-card${entry.favorite ? ' is-favorite' : ''}" data-entry-id="${safe(entry.id)}">
      <div class="journal-entry-rail"><span aria-hidden="true">${entry.favorite ? '★' : '✦'}</span><i></i></div>
      <div class="journal-entry-body">
        <header><div><small>${safe(typeLabel(entry.type))} · ${safe(formatDate(entry.createdAt))}</small><h3>${safe(entry.title)}</h3></div><span class="journal-mood">${safe(entry.mood)}</span></header>
        ${entry.question ? `<p class="journal-question"><b>Intenção</b>${safe(entry.question)}</p>` : ''}
        <p class="journal-text">${safe(entry.text).replace(/\n/g, '<br>')}</p>
        ${cards.length ? `<div class="journal-related-cards">${cards.slice(0, 3).map(card => `<span>${cardImageMarkup(card, { decorative: true })}<b>${safe(card.name)}</b></span>`).join('')}${cards.length > 3 ? `<em>+${cards.length - 3} cartas nesta leitura</em>` : ''}</div>` : ''}
        <div class="journal-entry-meta">
          ${entry.collection ? `<span class="journal-collection">◇ ${safe(entry.collection)}</span>` : ''}
          ${tags.map(tag => `<span>${safe(tag)}</span>`).join('')}
          ${entry.relatedLesson ? `<span>Escola · ${safe(entry.relatedLesson)}</span>` : ''}
          ${entry.relationships ? `<span>Pessoas · ${safe(entry.relationships)}</span>` : ''}
        </div>
        <div class="journal-entry-actions">
          <button type="button" data-favorite-entry aria-pressed="${entry.favorite}">${entry.favorite ? '★ Favorita' : '☆ Favoritar'}</button>
          <button type="button" data-edit-entry>Editar</button>
          <button type="button" data-ai-entry>Levar à Orbe IA</button>
          <button type="button" data-delete-entry>Excluir</button>
        </div>
        ${deleteConfirm}${aiConfirm}
      </div>
    </article>`;
  }

  handleEntryAction(event) {
    const article = event.target.closest('[data-entry-id]');
    if (!article) return;
    const id = article.dataset.entryId;
    const entries = this.all();
    const index = entries.findIndex(entry => entry.id === id);
    if (index < 0) return;

    if (event.target.closest('[data-favorite-entry]')) {
      entries[index] = createJournalEntry({ ...entries[index], favorite: !entries[index].favorite, updatedAt: new Date().toISOString() });
      this.saveAll(entries);
      this.render();
      return;
    }
    if (event.target.closest('[data-edit-entry]')) {
      this.editEntry(entries[index]);
      return;
    }
    if (event.target.closest('[data-delete-entry]')) {
      this.pendingDelete = id;
      this.pendingAI = '';
      this.renderExplorer(entries);
      this.list.querySelector(`[data-entry-id="${selectorEscape(id)}"] [data-delete-cancel]`)?.focus();
      return;
    }
    if (event.target.closest('[data-delete-cancel]')) {
      this.pendingDelete = '';
      this.renderExplorer(entries);
      return;
    }
    if (event.target.closest('[data-delete-confirm]')) {
      entries.splice(index, 1);
      this.pendingDelete = '';
      this.saveAll(entries);
      this.render();
      this.notify('Memória excluída deste aparelho.');
      return;
    }
    if (event.target.closest('[data-ai-entry]')) {
      this.pendingAI = id;
      this.pendingDelete = '';
      this.renderExplorer(entries);
      this.list.querySelector(`[data-entry-id="${selectorEscape(id)}"] [data-ai-cancel]`)?.focus();
      return;
    }
    if (event.target.closest('[data-ai-cancel]')) {
      this.pendingAI = '';
      this.renderExplorer(entries);
      return;
    }
    if (event.target.closest('[data-ai-confirm]')) {
      this.prepareAI(entries[index]);
    }
  }

  editEntry(entry) {
    this.editingId = entry.id;
    const values = {
      title: entry.title,
      createdAt: toLocalInput(entry.createdAt),
      type: entry.type,
      mood: entry.mood,
      collection: entry.collection,
      cardId: entry.cardId === null ? '' : String(entry.cardId),
      question: entry.question,
      text: entry.text,
      tags: entry.tags,
      relationships: entry.relationships,
      relatedLesson: entry.relatedLesson
    };
    Object.entries(values).forEach(([name, value]) => {
      const field = this.form.elements.namedItem(name);
      if (field) field.value = value;
    });
    store.set(JOURNAL_DRAFT_KEY, { ...values, _editingId: entry.id, status: 'draft', updatedAt: new Date().toISOString() });
    this.setEditingState(true);
    this.setSaveState('Editando memória', 'saving');
    this.root.querySelector('[data-draft-detail]').textContent = 'As alterações ficam salvas como rascunho.';
    this.form.scrollIntoView({ behavior: smooth(), block: 'start' });
    this.form.elements.title.focus({ preventScroll: true });
  }

  prepareAI(entry) {
    const cards = entryCardIds(entry).map(id => CARDS[id]?.name).filter(Boolean);
    store.set(JOURNAL_AI_SELECTION_KEY, {
      id: entry.id,
      title: entry.title,
      text: entry.text,
      question: entry.question,
      tags: entry.tags,
      cards,
      selectedAt: new Date().toISOString(),
      consentScope: 'single-entry',
      private: true
    });
    this.pendingAI = '';
    this.notify('Somente esta entrada foi preparada. Revise antes de enviar.');
    globalThis.orbe?.go?.('ai');
    window.dispatchEvent(new CustomEvent('divina:journal-ai-selected'));
  }

  exportData() {
    const payload = privateJournalExport(this.all());
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `diario-orbe-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
    this.notify('Sua cópia privada foi preparada.');
  }

  updateNetworkState() {
    const status = this.root.querySelector('[data-journal-network]');
    if (!status) return;
    const online = navigator.onLine !== false;
    status.textContent = online ? 'Disponível offline' : 'Sem conexão · escreva normalmente';
    status.dataset.online = String(online);
  }
}
