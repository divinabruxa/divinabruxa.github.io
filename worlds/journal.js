import { dateKeyInTimeZone } from '../lib/daily-card.js';

const ENTRIES_KEY = 'divina-bruxa-3.diario.entradas.v1';
const DRAFT_KEY = 'divina-bruxa-3.diario.rascunho.v1';
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function safeEntries() {
  const value = loadJson(ENTRIES_KEY, []);
  return Array.isArray(value) ? value
    .filter(entry => entry && typeof entry.id === 'string' && typeof entry.title === 'string' && typeof entry.body === 'string')
    .slice(-500)
    .map(entry => ({
      id:entry.id.slice(0, 100),
      title:entry.title.slice(0, 90),
      body:entry.body.slice(0, 8000),
      date:/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ? entry.date : dateKeyInTimeZone(),
      mood:typeof entry.mood === 'string' ? entry.mood.slice(0, 40) : '',
      tags:Array.isArray(entry.tags) ? entry.tags.filter(tag => typeof tag === 'string').slice(0, 12).map(tag => tag.slice(0, 50)) : [],
      favorite:Boolean(entry.favorite),
      createdAt:typeof entry.createdAt === 'string' ? entry.createdAt : '',
      updatedAt:typeof entry.updatedAt === 'string' ? entry.updatedAt : ''
    })) : [];
}

export function createJournalWorld({ announce }) {
  const nodes = {
    form:document.querySelector('#journalForm'),
    id:document.querySelector('#journalId'),
    title:document.querySelector('#journalEntryTitle'),
    body:document.querySelector('#journalBody'),
    date:document.querySelector('#journalDate'),
    mood:document.querySelector('#journalMood'),
    tags:document.querySelector('#journalTags'),
    favorite:document.querySelector('#journalFavorite'),
    clear:document.querySelector('#journalClear'),
    draft:document.querySelector('#journalDraftState'),
    export:document.querySelector('#journalExport'),
    search:document.querySelector('#journalSearch'),
    entries:document.querySelector('#journalEntries')
  };
  let entries = safeEntries();

  function persistEntries() {
    try { localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries)); } catch {}
  }

  function formValue() {
    return {
      id:nodes.id.value,
      title:nodes.title.value,
      body:nodes.body.value,
      date:nodes.date.value,
      mood:nodes.mood.value,
      tags:nodes.tags.value,
      favorite:nodes.favorite.checked
    };
  }

  function saveDraft() {
    const draft = formValue();
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); nodes.draft.textContent = 'Rascunho salvo somente neste aparelho.'; }
    catch { nodes.draft.textContent = 'Rascunho mantido apenas nesta aba.'; }
  }

  function clearForm({ keepDraft = false } = {}) {
    nodes.form.reset();
    nodes.id.value = '';
    nodes.date.value = dateKeyInTimeZone();
    if (!keepDraft) {
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
    }
    nodes.draft.textContent = 'Nova página privada.';
  }

  function restoreDraft() {
    const draft = loadJson(DRAFT_KEY, null);
    if (!draft || typeof draft !== 'object') return clearForm({ keepDraft:true });
    nodes.id.value = typeof draft.id === 'string' ? draft.id : '';
    nodes.title.value = typeof draft.title === 'string' ? draft.title : '';
    nodes.body.value = typeof draft.body === 'string' ? draft.body : '';
    nodes.date.value = /^\d{4}-\d{2}-\d{2}$/.test(draft.date) ? draft.date : dateKeyInTimeZone();
    nodes.mood.value = typeof draft.mood === 'string' ? draft.mood : '';
    nodes.tags.value = typeof draft.tags === 'string' ? draft.tags : '';
    nodes.favorite.checked = Boolean(draft.favorite);
    nodes.draft.textContent = nodes.title.value || nodes.body.value ? 'Rascunho local retomado.' : 'Nova página privada.';
  }

  function render() {
    const query = normalize(nodes.search.value.trim());
    const visible = [...entries]
      .filter(entry => !query || normalize(`${entry.title} ${entry.body} ${entry.mood} ${(entry.tags || []).join(' ')}`).includes(query))
      .sort((a, b) => `${b.date}:${b.updatedAt}`.localeCompare(`${a.date}:${a.updatedAt}`));
    const fragment = document.createDocumentFragment();
    visible.forEach(entry => {
      const article = document.createElement('article');
      article.className = 'journal-entry';
      const meta = document.createElement('div');
      meta.className = 'journal-entry__meta';
      const date = document.createElement('span');
      date.textContent = `${entry.favorite ? '★ ' : ''}${entry.date}`;
      const mood = document.createElement('span');
      mood.textContent = entry.mood || 'Sem rótulo';
      meta.append(date, mood);
      const title = document.createElement('h3');
      title.textContent = entry.title;
      const preview = document.createElement('p');
      preview.className = 'journal-entry__preview';
      preview.textContent = entry.body.length > 260 ? `${entry.body.slice(0, 260)}…` : entry.body;
      const tags = document.createElement('div');
      tags.className = 'journal-entry__tags';
      (entry.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tags.append(span);
      });
      const actions = document.createElement('div');
      actions.className = 'journal-entry__actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.textContent = 'Abrir';
      edit.addEventListener('click', () => editEntry(entry));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Excluir';
      remove.addEventListener('click', () => armDelete(remove, entry.id));
      actions.append(edit, remove);
      article.append(meta, title, preview, tags, actions);
      fragment.append(article);
    });
    if (!visible.length) {
      const empty = document.createElement('p');
      empty.className = 'journal-empty';
      empty.textContent = entries.length ? 'Nenhum registro encontrou esse termo.' : 'A primeira página ainda está em branco.';
      fragment.append(empty);
    }
    nodes.entries.replaceChildren(fragment);
  }

  function editEntry(entry) {
    nodes.id.value = entry.id;
    nodes.title.value = entry.title;
    nodes.body.value = entry.body;
    nodes.date.value = entry.date;
    nodes.mood.value = entry.mood || '';
    nodes.tags.value = (entry.tags || []).join(', ');
    nodes.favorite.checked = Boolean(entry.favorite);
    saveDraft();
    nodes.title.focus();
    announce(`Registro ${entry.title} aberto para edição.`);
  }

  function armDelete(button, id) {
    if (button.dataset.armed !== 'true') {
      button.dataset.armed = 'true';
      button.textContent = 'Confirmar exclusão';
      setTimeout(() => { if (button.isConnected) { button.dataset.armed = 'false'; button.textContent = 'Excluir'; } }, 4500);
      return;
    }
    const entry = entries.find(item => item.id === id);
    entries = entries.filter(item => item.id !== id);
    persistEntries();
    render();
    announce(`${entry?.title || 'Registro'} foi excluído deste aparelho.`);
  }

  nodes.form.addEventListener('input', saveDraft);
  nodes.form.addEventListener('submit', event => {
    event.preventDefault();
    const value = formValue();
    const now = new Date().toISOString();
    const id = value.id || crypto.randomUUID?.() || `entry-${Date.now()}`;
    const entry = {
      id,
      title:value.title.trim(),
      body:value.body.trim(),
      date:value.date,
      mood:value.mood,
      tags:value.tags.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 12),
      favorite:value.favorite,
      createdAt:entries.find(item => item.id === id)?.createdAt || now,
      updatedAt:now
    };
    entries = [...entries.filter(item => item.id !== id), entry];
    persistEntries();
    clearForm();
    render();
    announce(`${entry.title} foi guardado no Diário deste aparelho.`);
  });
  nodes.clear.addEventListener('click', () => clearForm());
  nodes.search.addEventListener('input', render);
  nodes.export.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ exportedAt:new Date().toISOString(), entries }, null, 2)], { type:'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `divina-bruxa-diario-${dateKeyInTimeZone()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    announce('Cópia do Diário preparada para download.');
  });

  restoreDraft();
  render();
  return Object.freeze({ activate:render, entryCount:() => entries.length });
}
