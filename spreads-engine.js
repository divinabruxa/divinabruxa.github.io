/* DIVINA BRUXA — TEMPLO DAS TIRAGENS V139
   Revelação sequencial pela Orbe, leitura por posição e memória local protegida. */

import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup, preloadCardImages } from './tarot-image-runtime.js';
import { dailyMeaning } from './daily-meaning-runtime.js';
import {
  SPREADS,
  SPREAD_STORAGE_KEY,
  SPREAD_HISTORY_KEY,
  SPREAD_SCHEMA_VERSION,
  spreadById,
  positionsForSpread,
  normalizeSpreadSession
} from './spreads-policy.js?v=139';
import { synthesizeSpread } from './spread-synthesis.js';

const safe = value => escapeHTML(value ?? '');
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const scrollBehavior = () => reducedMotion() ? 'auto' : 'smooth';
const random = max => {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0] % max;
};
const shuffledIds = () => {
  const ids = CARDS.map(card => card.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const target = random(index + 1);
    [ids[index], ids[target]] = [ids[target], ids[index]];
  }
  return ids;
};
const formatDate = value => {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return 'Leitura guardada';
  }
};

function cleanHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.map(entry => {
    const session = normalizeSpreadSession({ ...entry, revealed: entry?.cardIds?.length });
    if (!session || session.revealed !== session.cardIds.length) return null;
    return {
      ...session,
      id: typeof entry.id === 'string' ? entry.id : `${session.spreadId}:${session.createdAt}`,
      completedAt: typeof entry.completedAt === 'string' ? entry.completedAt : session.updatedAt,
      favorite: Boolean(entry.favorite),
      tags: Array.isArray(entry.tags)
        ? entry.tags.filter(tag => typeof tag === 'string' && tag.trim()).slice(0, 8).map(tag => tag.trim().slice(0, 32))
        : []
    };
  }).filter(Boolean).slice(0, 20);
}

export class SpreadsEngine {
  constructor(elements, onSave) {
    this.grid = elements?.grid || elements;
    this.result = elements?.result || document.querySelector('#spreadResult');
    this.intention = elements?.intention || document.querySelector('#spreadIntention');
    this.historyRoot = elements?.history || document.querySelector('#spreadHistory');
    this.onSave = onSave;
    this.session = normalizeSpreadSession(store.get(SPREAD_STORAGE_KEY));
    this.history = cleanHistory(store.get(SPREAD_HISTORY_KEY, []));
    this.question = this.session?.question || '';
    this.justRevealed = -1;
    this.pendingSpreadId = '';
    this.renderIntention();
    this.renderMenu();
    if (this.session) {
      if (this.isComplete()) this.archiveCompleted();
      this.renderReading(true);
    }
    this.renderHistory();
  }

  notify(message) {
    window.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
  }

  saveSession() {
    if (!this.session) return;
    this.session.question = this.question.trim().slice(0, 600);
    this.session.updatedAt = new Date().toISOString();
    this.session.revision = SPREAD_SCHEMA_VERSION;
    store.set(SPREAD_STORAGE_KEY, this.session);
  }

  saveHistory() {
    store.set(SPREAD_HISTORY_KEY, this.history.slice(0, 20));
  }

  isComplete() {
    return Boolean(this.session && this.session.revealed === this.session.cardIds.length);
  }

  renderIntention() {
    if (!this.intention) return;
    this.intention.innerHTML = `<label class="spread-intention-field">
      <span>PERGUNTA OU INTENÇÃO</span>
      <textarea data-spread-question maxlength="600" rows="2" placeholder="O que você deseja compreender nesta tiragem?">${safe(this.question)}</textarea>
      <small>Opcional e privada: fica somente neste aparelho. A leitura não envia sua pergunta automaticamente para a IA.</small>
    </label>`;
    this.intention.querySelector('[data-spread-question]').addEventListener('input', event => {
      this.question = event.target.value.slice(0, 600);
      if (!this.session) return;
      this.saveSession();
      if (this.isComplete()) this.archiveCompleted();
    });
  }

  renderMenu() {
    if (!this.grid) return;
    this.grid.innerHTML = SPREADS.map(item => {
      const count = item.custom ? '1–12 cartas' : `${item.positions.length} ${item.positions.length === 1 ? 'carta' : 'cartas'}`;
      const active = this.session?.spreadId === item.id;
      return `<button type="button" class="spread-choice${active ? ' active' : ''}" data-spread="${item.id}"${item.premium ? ' data-premium="true"' : ''} aria-pressed="${active}">
        <span class="spread-choice-sigil" aria-hidden="true">${item.sigil}</span>
        <span class="spread-choice-copy"><small>${safe(item.category)}</small><strong>${safe(item.name)}</strong><em>${safe(item.description)}</em></span>
        <span class="spread-choice-count">${count}${item.premium ? '<b>PREMIUM</b>' : ''}</span>
      </button>`;
    }).join('');
    this.grid.onclick = event => {
      const button = event.target.closest('[data-spread]');
      if (!button) return;
      this.requestChoice(button.dataset.spread);
    };
  }

  requestChoice(spreadId) {
    const target = spreadById(spreadId);
    if (!target) return;
    if (target.premium) {
      this.renderPremium();
      return;
    }
    if (this.session?.spreadId === spreadId) {
      this.renderReading(true);
      this.result?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      return;
    }
    if (this.session && !this.isComplete()) {
      this.pendingSpreadId = spreadId;
      this.renderSwitchConfirmation(target);
      return;
    }
    if (target.custom) this.renderCustomConfig();
    else this.begin(spreadId);
  }

  begin(spreadId, customCount) {
    const target = spreadById(spreadId);
    if (!target || target.premium) return;
    const positions = positionsForSpread(target, customCount);
    const now = new Date().toISOString();
    this.session = {
      spreadId,
      cardIds: shuffledIds().slice(0, positions.length),
      positions,
      revealed: 0,
      activeIndex: 0,
      question: this.question.trim().slice(0, 600),
      orientation: 'normal',
      createdAt: now,
      updatedAt: now,
      revision: SPREAD_SCHEMA_VERSION
    };
    this.pendingSpreadId = '';
    this.justRevealed = -1;
    this.saveSession();
    preloadCardImages(this.session.cardIds, 2);
    this.renderMenu();
    this.renderReading(false);
    this.result?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  renderCustomConfig() {
    this.result.innerHTML = `<article class="spread-config-panel" aria-labelledby="customSpreadTitle">
      <p class="eyebrow">MESA PERSONALIZADA</p>
      <h3 id="customSpreadTitle">Quantas posições deseja abrir?</h3>
      <p>Escolha de 1 a 12 cartas. Cada posição nasce na ordem pelo toque da Orbe.</p>
      <label class="spread-count-picker">
        <span><b data-custom-count>5</b><small>cartas</small></span>
        <input type="range" min="1" max="12" value="5" step="1" data-custom-range aria-label="Quantidade de cartas">
      </label>
      <ol class="spread-custom-positions" data-custom-positions></ol>
      <div class="spread-actions"><button type="button" class="primary" data-start-custom>Começar com 5 cartas</button><button type="button" class="text-button" data-cancel-custom>Cancelar</button></div>
    </article>`;
    const range = this.result.querySelector('[data-custom-range]');
    const count = this.result.querySelector('[data-custom-count]');
    const positions = this.result.querySelector('[data-custom-positions]');
    const start = this.result.querySelector('[data-start-custom]');
    const update = () => {
      const amount = Number(range.value);
      count.textContent = amount;
      start.textContent = `Começar com ${amount} ${amount === 1 ? 'carta' : 'cartas'}`;
      positions.innerHTML = positionsForSpread(spreadById('custom-table'), amount)
        .map((position, index) => `<li><b>${index + 1}</b>${safe(position)}</li>`).join('');
    };
    range.addEventListener('input', update);
    start.addEventListener('click', () => this.begin('custom-table', Number(range.value)));
    this.result.querySelector('[data-cancel-custom]').addEventListener('click', () => {
      if (this.session) this.renderReading(true);
      else this.result.innerHTML = '';
    });
    update();
    this.result.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  renderSwitchConfirmation(target) {
    const current = spreadById(this.session?.spreadId);
    this.result.innerHTML = `<article class="spread-confirm-panel" role="alert" aria-labelledby="spreadConfirmTitle">
      <span class="spread-confirm-sigil" aria-hidden="true">◇</span>
      <p class="eyebrow">TIRAGEM EM ANDAMENTO</p>
      <h3 id="spreadConfirmTitle">Seu progresso continua guardado.</h3>
      <p>Você revelou ${this.session.revealed} de ${this.session.cardIds.length} posições em <b>${safe(current?.name)}</b>. Trocar agora descartará essa tiragem e abrirá <b>${safe(target.name)}</b>.</p>
      <div class="spread-actions"><button type="button" class="primary" data-keep-spread>Continuar tiragem atual</button><button type="button" class="text-button danger" data-confirm-switch>Descartar e trocar</button></div>
    </article>`;
    this.result.querySelector('[data-keep-spread]').addEventListener('click', () => {
      this.pendingSpreadId = '';
      this.renderReading(true);
    });
    this.result.querySelector('[data-confirm-switch]').addEventListener('click', () => {
      const next = this.pendingSpreadId;
      this.pendingSpreadId = '';
      store.remove(SPREAD_STORAGE_KEY);
      this.session = null;
      this.renderMenu();
      if (spreadById(next)?.custom) this.renderCustomConfig();
      else this.begin(next);
    });
  }

  revealNext() {
    if (!this.session || this.isComplete()) return;
    const index = this.session.revealed;
    this.session.revealed += 1;
    this.session.activeIndex = index;
    this.justRevealed = index;
    this.saveSession();
    preloadCardImages(this.session.cardIds.slice(this.session.revealed), 2);
    if (this.isComplete()) this.archiveCompleted();
    this.renderMenu();
    this.renderReading(false);
    this.result.querySelector(`[data-position-index="${index}"]`)?.scrollIntoView({
      behavior: scrollBehavior(),
      block: 'nearest',
      inline: 'center'
    });
  }

  slotMarkup(card, position, index) {
    const revealed = index < this.session.revealed;
    const active = revealed && index === this.session.activeIndex;
    const born = revealed && index === this.justRevealed;
    return `<button type="button" class="spread-position-slot${revealed ? ' revealed' : ''}${active ? ' active' : ''}${born ? ' born' : ''}" data-position-index="${index}" ${revealed ? '' : 'disabled'} aria-label="${revealed ? `${safe(position)}: ${safe(card.name)}, carta direta` : `${safe(position)}: ainda não revelada`}">
      <span class="spread-position-label"><b>${String(index + 1).padStart(2, '0')}</b>${safe(position)}</span>
      <span class="spread-position-card">
        ${revealed ? cardImageMarkup(card, { priority: active ? 'high' : 'lazy' }) : '<i aria-hidden="true">✦</i><small>AGUARDANDO A ORBE</small>'}
      </span>
      ${revealed ? `<strong>${safe(card.name)}</strong><small>DIRETA</small>` : ''}
    </button>`;
  }

  contextualMeaning(target, meaning) {
    const fields = {
      love: ['No amor', meaning.love || meaning.relationships],
      career: ['No trabalho', meaning.career],
      money: ['Nos recursos', meaning.money],
      spirituality: ['No caminho espiritual', meaning.spirituality]
    };
    return fields[target?.tone] || ['No contexto desta posição', meaning.essence];
  }

  meaningMarkup(target, index) {
    if (!this.session?.revealed) return '';
    const card = CARDS[this.session.cardIds[index]];
    const position = this.session.positions[index];
    const meaning = dailyMeaning(card);
    const [lensTitle, lensText] = this.contextualMeaning(target, meaning);
    return `<article class="spread-active-meaning" aria-live="polite">
      <div class="spread-meaning-card">${cardImageMarkup(card, { priority: 'high' })}</div>
      <div class="spread-meaning-copy">
        <p class="eyebrow">POSIÇÃO ${index + 1}/${this.session.positions.length} · ${safe(position)} · DIRETA</p>
        <h3>${safe(card.name)}</h3>
        <p class="keywords">${meaning.keywords.map(safe).join(' · ')}</p>
        <div class="spread-meaning-sections">
          <section><h4>Essência</h4><p>${safe(meaning.essence)}</p></section>
          <section><h4>${safe(lensTitle)}</h4><p>${safe(lensText)}</p></section>
          <section><h4>Luz</h4><p>${safe(meaning.light)}</p></section>
          <section><h4>Ponto de atenção</h4><p>${safe(meaning.tension)}</p></section>
          <section><h4>Conselho prático</h4><p>${safe(meaning.advice)}</p></section>
        </div>
        <blockquote>${safe(meaning.reflectionQuestion)}</blockquote>
      </div>
    </article>`;
  }

  synthesisMarkup(items) {
    if (!this.isComplete()) return '';
    const synthesis = synthesizeSpread(items);
    return `<article class="spread-synthesis">
      <span>SÍNTESE DA TIRAGEM</span>
      <h3>O desenho que as cartas formam juntas.</h3>
      <p>${safe(synthesis.opening)}</p>
      <p>${safe(synthesis.pattern)}</p>
      <p>${safe(synthesis.integration)}</p>
    </article>`;
  }

  renderReading(resumed) {
    this.session = normalizeSpreadSession(this.session);
    if (!this.session) return;
    const target = spreadById(this.session.spreadId);
    const items = this.session.cardIds.map((id, index) => ({ card: CARDS[id], position: this.session.positions[index] }));
    const progress = Math.round(this.session.revealed / items.length * 100);
    const activeIndex = this.session.revealed ? Math.min(this.session.activeIndex, this.session.revealed - 1) : 0;
    this.session.activeIndex = activeIndex;
    const complete = this.isComplete();
    const question = this.session.question
      ? `<p class="spread-private-question"><span>INTENÇÃO PRIVADA</span>${safe(this.session.question)}</p>`
      : '';
    const orb = complete ? '' : `<section class="spread-orb-ritual" aria-label="Revelar a próxima posição">
      <p>${this.session.revealed ? 'A próxima posição está pronta.' : 'Respire. Quando sentir presença, toque a Orbe.'}</p>
      <button type="button" class="spread-orb" data-orb-surface="spreads" data-reveal-card aria-label="Revelar carta da posição ${this.session.revealed + 1}: ${safe(this.session.positions[this.session.revealed])}">
        <span class="spread-orb-aura" aria-hidden="true"></span><span class="spread-orb-glass" aria-hidden="true"></span><small>TOQUE PARA REVELAR</small>
      </button>
      <span>${this.session.revealed} reveladas · ${items.length - this.session.revealed} aguardando</span>
    </section>`;

    this.result.innerHTML = `<article class="spread-reading spread-temple-reading${complete ? ' complete' : ''}">
      <header class="spread-reading-head">
        <div><p class="eyebrow">${safe(target.name)}${resumed ? ' · RETOMADA' : ''}</p><h3>${complete ? 'A constelação está completa.' : 'Uma posição de cada vez.'}</h3></div>
        <span><b>${this.session.revealed}</b><small>/ ${items.length} reveladas</small></span>
      </header>
      ${question}
      <div class="spread-progress" role="progressbar" aria-label="Progresso da tiragem" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${this.session.revealed}"><i style="width:${progress}%"></i></div>
      <div class="spread-map spread-map-${target.id} count-${items.length}" data-spread-layout="${target.id}">
        ${items.map(({ card, position }, index) => this.slotMarkup(card, position, index)).join('')}
      </div>
      ${orb}
      ${this.meaningMarkup(target, activeIndex)}
      ${this.synthesisMarkup(items)}
      <div class="spread-actions spread-reading-actions">
        ${complete ? '<button type="button" class="primary" data-save-spread>Guardar no Diário</button><button type="button" class="text-button" data-open-ai>Refletir com a Orbe IA · opcional</button>' : ''}
        <button type="button" class="text-button" data-new-spread>${complete ? 'Escolher nova tiragem' : 'Recomeçar ou trocar'}</button>
      </div>
      <div data-reset-confirm></div>
    </article>`;

    this.bindReading(items, target);
    this.justRevealed = -1;
  }

  bindReading(items, target) {
    this.result.querySelector('[data-reveal-card]')?.addEventListener('click', () => this.revealNext());
    this.result.querySelector('.spread-map')?.addEventListener('click', event => {
      const slot = event.target.closest('[data-position-index]');
      if (!slot || slot.disabled) return;
      this.session.activeIndex = Number(slot.dataset.positionIndex);
      this.saveSession();
      this.renderReading(false);
      this.result.querySelector('.spread-active-meaning')?.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
    });
    this.result.querySelector('[data-save-spread]')?.addEventListener('click', () => {
      this.saveToDiary(this.session);
    });
    this.result.querySelector('[data-open-ai]')?.addEventListener('click', () => globalThis.orbe?.go?.('ai'));
    this.result.querySelector('[data-new-spread]')?.addEventListener('click', () => {
      if (this.isComplete()) {
        store.remove(SPREAD_STORAGE_KEY);
        this.session = null;
        this.result.innerHTML = '';
        this.renderMenu();
        this.grid?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        return;
      }
      this.renderResetConfirmation(target);
    });
  }

  renderResetConfirmation(target) {
    const root = this.result.querySelector('[data-reset-confirm]');
    if (!root) return;
    root.innerHTML = `<div class="spread-reset-confirm" role="alert">
      <p><b>Descartar ${this.session.revealed} ${this.session.revealed === 1 ? 'carta revelada' : 'cartas reveladas'}?</b> Esta ação não pode ser desfeita.</p>
      <div><button type="button" class="primary" data-cancel-reset>Continuar ${safe(target.name)}</button><button type="button" class="text-button danger" data-confirm-reset>Sim, descartar</button></div>
    </div>`;
    root.querySelector('[data-cancel-reset]').addEventListener('click', () => { root.innerHTML = ''; });
    root.querySelector('[data-confirm-reset]').addEventListener('click', () => {
      store.remove(SPREAD_STORAGE_KEY);
      this.session = null;
      this.result.innerHTML = '';
      this.renderMenu();
      this.grid?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    });
    root.querySelector('[data-cancel-reset]').focus();
  }

  renderPremium() {
    const hasSession = Boolean(this.session);
    this.result.innerHTML = `<article class="spread-premium spread-temple-premium">
      <div class="spread-premium-copy">
        <p class="eyebrow">MESA REAL · APP PREMIUM</p>
        <h3>78 cartas · 13 fileiras de 6</h3>
        <p>Este modo automático permanece bloqueado até a validação segura da assinatura. Quando ativado, cada posição terá salvamento e retomada sem repetir cartas.</p>
        <div class="spread-premium-note"><b>Não é a consulta profissional.</b><span>A Mesa Real feita pelas bruxas é um atendimento separado, agendado em Consultas.</span></div>
        <div class="spread-actions">
          <button type="button" class="primary" data-go-premium>Conhecer o Premium</button>
          <button type="button" class="text-button" data-go-consultation>Ver consulta profissional</button>
          ${hasSession ? `<button type="button" class="text-button" data-return-spread>${this.isComplete() ? 'Voltar à leitura concluída' : 'Retomar tiragem em andamento'}</button>` : ''}
        </div>
      </div>
      <div class="spread-royal-preview" aria-label="Prévia protegida da Mesa Real com 78 posições">
        ${Array.from({ length: 78 }, (_, index) => `<i><span>${index + 1}</span></i>`).join('')}
        <strong><span aria-hidden="true">◇</span>ACESSO PROTEGIDO</strong>
      </div>
    </article>`;
    this.result.querySelector('[data-go-premium]').addEventListener('click', () => globalThis.orbe?.go?.('subscriptions'));
    this.result.querySelector('[data-go-consultation]').addEventListener('click', () => globalThis.orbe?.go?.('consultations'));
    this.result.querySelector('[data-return-spread]')?.addEventListener('click', () => this.renderReading(true));
    this.result.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  archiveCompleted() {
    if (!this.isComplete()) return;
    const id = `${this.session.spreadId}:${this.session.createdAt}`;
    const previous = this.history.find(entry => entry.id === id);
    const entry = {
      ...this.session,
      id,
      completedAt: previous?.completedAt || new Date().toISOString(),
      favorite: previous?.favorite || false,
      tags: previous?.tags || []
    };
    this.history = [entry, ...this.history.filter(item => item.id !== id)].slice(0, 20);
    this.saveHistory();
    this.renderHistory();
  }

  diaryEntry(session) {
    const target = spreadById(session.spreadId);
    const items = session.cardIds.map((id, index) => ({ card: CARDS[id], position: session.positions[index] }));
    const synthesis = synthesizeSpread(items);
    return {
      title: `Tiragem — ${target?.name || 'Tarot'}`,
      text: `${items.map(item => `${item.position}: ${item.card.name} (direta)`).join('\n')}\n\n${synthesis.opening} ${synthesis.pattern} ${synthesis.integration}`,
      question: session.question || 'O que esta tiragem ilumina no meu momento?',
      tags: ['tiragem', target?.name, synthesis.dominantSuit].filter(Boolean).join(', '),
      mood: 'Reflexiva',
      cardIds: session.cardIds,
      type: 'spread',
      orientation: 'normal'
    };
  }

  saveToDiary(session) {
    if (!session || session.revealed !== session.cardIds.length) return;
    this.onSave?.(this.diaryEntry(session));
  }

  renderHistory() {
    if (!this.historyRoot) return;
    const entries = this.history;
    this.historyRoot.innerHTML = `<section class="spread-history-panel" aria-labelledby="spreadHistoryTitle">
      <header><div><p class="eyebrow">MEMÓRIA DO TEMPLO</p><h3 id="spreadHistoryTitle">Suas tiragens neste aparelho.</h3></div><button type="button" class="text-button" data-export-history>Exportar · Premium</button></header>
      ${entries.length ? `<div class="spread-history-list">${entries.map(entry => {
        const target = spreadById(entry.spreadId);
        const cards = entry.cardIds.map(id => CARDS[id]?.name).filter(Boolean);
        return `<article data-history-id="${safe(entry.id)}">
          <div class="spread-history-top"><span class="spread-history-sigil" aria-hidden="true">${target?.sigil || '✦'}</span><div><small>${safe(formatDate(entry.completedAt))}</small><h4>${safe(target?.name || 'Tiragem')}</h4></div><button type="button" class="spread-favorite${entry.favorite ? ' active' : ''}" data-favorite-history aria-pressed="${entry.favorite}" aria-label="${entry.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">♡</button></div>
          ${entry.question ? `<p class="spread-history-question">${safe(entry.question)}</p>` : ''}
          <p class="spread-history-cards">${cards.map(safe).join(' · ')}</p>
          <label>ETIQUETAS<input type="text" data-history-tags maxlength="180" value="${safe(entry.tags.join(', '))}" placeholder="amor, decisão, trabalho"></label>
          <button type="button" class="text-button" data-history-diary>Guardar também no Diário</button>
        </article>`;
      }).join('')}</div>` : '<p class="spread-history-empty">Quando uma tiragem for concluída, ela aparecerá aqui com favoritos e etiquetas.</p>'}
      <p class="spread-history-privacy">Memórias locais: não são publicadas nem enviadas automaticamente.</p>
    </section>`;

    this.historyRoot.querySelector('[data-export-history]').addEventListener('click', () => {
      this.notify('A exportação faz parte do Premium e continua protegida.');
      globalThis.orbe?.go?.('subscriptions');
    });
    this.historyRoot.onclick = event => {
      const article = event.target.closest('[data-history-id]');
      if (!article) return;
      const entry = this.history.find(item => item.id === article.dataset.historyId);
      if (!entry) return;
      if (event.target.closest('[data-favorite-history]')) {
        entry.favorite = !entry.favorite;
        this.saveHistory();
        this.renderHistory();
      }
      if (event.target.closest('[data-history-diary]')) {
        this.saveToDiary(entry);
      }
    };
    this.historyRoot.onchange = event => {
      const input = event.target.closest('[data-history-tags]');
      if (!input) return;
      const article = input.closest('[data-history-id]');
      const entry = this.history.find(item => item.id === article?.dataset.historyId);
      if (!entry) return;
      entry.tags = [...new Set(input.value.split(',').map(tag => tag.trim()).filter(Boolean))]
        .slice(0, 8).map(tag => tag.slice(0, 32));
      input.value = entry.tags.join(', ');
      this.saveHistory();
    };
  }
}
