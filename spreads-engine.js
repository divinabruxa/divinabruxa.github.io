/* DIVINA BRUXA — TIRAGENS 2.0 V213
   Ritual vivo, 15 métodos, Cruz Celta correta, Mesa Real 13×6 e ponte explícita com Whit. */

import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup, preloadCardImages } from './tarot-image-runtime.js';
import { dailyMeaning } from './daily-meaning-runtime.js';
import { cardPageHref } from './card-library-policy.js?v=184';
import {
  SPREADS,
  SPREAD_FILTERS,
  SPREAD_RELEASE,
  SPREAD_STORAGE_KEY,
  SPREAD_LEGACY_STORAGE_KEYS,
  SPREAD_HISTORY_KEY,
  SPREAD_SCHEMA_VERSION,
  ROYAL_TABLE_COLUMNS,
  ROYAL_TABLE_ROWS,
  spreadById,
  spreadsForFilter,
  positionsForSpread,
  normalizeSpreadSession,
  positionLabels,
  sessionToServerRow
} from './spreads-policy.js?v=213';
import { synthesizeSpread } from './spread-synthesis.js?v=185';
import { AI_TAROT_SELECTION_KEY } from './ai-policy.js?v=190';
import { JOURNAL_AI_SELECTION_KEY } from './journal-policy.js?v=140';

const safe = value => escapeHTML(value ?? '');
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const scrollBehavior = () => reducedMotion() ? 'auto' : 'smooth';
const SERVER_TABLE = 'tarot_spread_sessions_v213';
const MAX_HISTORY = 20;

const random = max => {
  if (!Number.isInteger(max) || max < 1) return 0;
  if (!globalThis.crypto?.getRandomValues) return Math.floor(Math.random() * max);
  const ceiling = Math.floor(0x100000000 / max) * max;
  const value = new Uint32Array(1);
  do globalThis.crypto.getRandomValues(value); while (value[0] >= ceiling);
  return value[0] % max;
};

const uuid = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const values = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint8Array(16))
    : Uint8Array.from({ length:16 }, () => Math.floor(Math.random() * 256));
  values[6] = (values[6] & 15) | 64;
  values[8] = (values[8] & 63) | 128;
  const hex = Array.from(values, value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
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
    return new Intl.DateTimeFormat('pt-BR', { dateStyle:'medium', timeStyle:'short' }).format(new Date(value));
  } catch {
    return 'Leitura guardada';
  }
};

const positionLabel = position => typeof position === 'string' ? position : position?.label || '';
const positionId = (position, index) => typeof position === 'string' ? `position-${index + 1}` : position?.id || `position-${index + 1}`;

function installStyles() {
  if (document.getElementById('tiragensV213Styles')) return;
  const link = document.createElement('link');
  link.id = 'tiragensV213Styles';
  link.rel = 'stylesheet';
  link.href = './tiragens-v213.css?v=213';
  document.head.append(link);
}

function readStoredSession() {
  const current = normalizeSpreadSession(store.get(SPREAD_STORAGE_KEY));
  if (current) return current;
  for (const key of SPREAD_LEGACY_STORAGE_KEYS) {
    const legacy = normalizeSpreadSession(store.get(key));
    if (!legacy) continue;
    legacy.readingId ||= uuid();
    legacy.revision = SPREAD_SCHEMA_VERSION;
    store.set(SPREAD_STORAGE_KEY, legacy);
    store.remove(key);
    return legacy;
  }
  return null;
}

function cleanHistory(value) {
  if (!Array.isArray(value)) return [];
  return value.map(entry => {
    const session = normalizeSpreadSession({ ...entry, revealed:entry?.cardIds?.length ?? entry?.card_ids?.length });
    if (!session || session.revealed !== session.cardIds.length) return null;
    return {
      ...session,
      id:typeof entry.id === 'string' ? entry.id : session.readingId || `${session.spreadId}:${session.createdAt}`,
      completedAt:typeof entry.completedAt === 'string' ? entry.completedAt : session.updatedAt,
      favorite:Boolean(entry.favorite),
      tags:Array.isArray(entry.tags)
        ? entry.tags.filter(tag => typeof tag === 'string' && tag.trim()).slice(0,8).map(tag => tag.trim().slice(0,32))
        : []
    };
  }).filter(Boolean).slice(0, MAX_HISTORY);
}

function activePremium(snapshot) {
  return Boolean(snapshot?.entitlements?.some(item =>
    (item?.key === 'premium_lifetime' || item?.entitlementKey === 'premium_lifetime' || item?.entitlement_key === 'premium_lifetime')
    && item?.status === 'active'
  ));
}

export class SpreadsEngine {
  constructor(elements, onSave, options = {}) {
    installStyles();
    this.grid = elements?.grid || elements;
    this.result = elements?.result || document.querySelector('#spreadResult');
    this.intention = elements?.intention || document.querySelector('#spreadIntention');
    this.historyRoot = elements?.history || document.querySelector('#spreadHistory');
    this.onSave = onSave;
    this.authClient = options.authClient || globalThis.divinaAuth || null;
    this.whit = options.whit || globalThis.whit || null;
    this.session = readStoredSession();
    this.history = cleanHistory(store.get(SPREAD_HISTORY_KEY, []));
    this.question = this.session?.question || '';
    this.justRevealed = -1;
    this.pendingSpreadId = '';
    this.spreadFilter = 'all';
    this.pendingDeleteHistoryId = '';
    this.premium = false;
    this.premiumChecked = false;
    this.premiumAuthState = Boolean(this.authClient?.session);
    this.cloudSaveTimer = 0;
    this.cloudState = 'local';
    this.destroyed = false;
    this.onBilling = event => {
      this.premium = activePremium(event.detail);
      this.premiumChecked = true;
      if (this.session?.spreadId === 'royal-table') this.renderReading(true);
    };
    this.onAuth = () => {
      this.premiumChecked = false;
      this.premium = false;
      this.premiumAuthState = Boolean(this.authClient?.session);
    };
    addEventListener('divina:billing-updated', this.onBilling);
    addEventListener('divina:auth-state', this.onAuth);

    this.renderIntention();
    this.renderMenu();
    if (this.session) {
      if (this.isComplete()) this.archiveCompleted();
      this.renderReading(true);
    }
    this.renderHistory();
    this.restoreCloudPremium().catch(() => {});
  }

  notify(message) {
    globalThis.dispatchEvent(new CustomEvent('orbe:toast', { detail:message }));
  }

  isComplete() {
    return Boolean(this.session && this.session.revealed === this.session.cardIds.length);
  }

  async userId() {
    let id = this.authClient?.session?.user?.id || '';
    if (!id && this.authClient?.account) {
      const result = await this.authClient.account();
      id = result?.body?.user?.id || '';
    }
    return String(id || '');
  }

  async ensurePremium({ silent = false } = {}) {
    const signedIn = Boolean(this.authClient?.session);
    if (this.premiumChecked && this.premiumAuthState === signedIn) return this.premium;
    this.premiumChecked = true;
    this.premiumAuthState = signedIn;
    if (!signedIn || !this.authClient?.billingSnapshot) {
      this.premium = false;
      return false;
    }
    try {
      const result = await this.authClient.billingSnapshot();
      this.premium = Boolean(result?.ok && activePremium(result.body?.snapshot));
      if (!this.premium && !silent && result?.status === 401) this.notify('Entre na Conta para restaurar o Premium.');
    } catch {
      this.premium = false;
      this.premiumChecked = false;
    }
    return this.premium;
  }

  saveSession() {
    if (!this.session) return;
    this.session.readingId ||= uuid();
    this.session.question = this.question.trim().slice(0,600);
    this.session.updatedAt = new Date().toISOString();
    this.session.revision = SPREAD_SCHEMA_VERSION;
    store.set(SPREAD_STORAGE_KEY, this.session);
    if (this.session.spreadId === 'royal-table') this.scheduleCloudSave();
  }

  saveHistory() {
    store.set(SPREAD_HISTORY_KEY, this.history.slice(0, MAX_HISTORY));
  }

  scheduleCloudSave() {
    clearTimeout(this.cloudSaveTimer);
    this.cloudSaveTimer = setTimeout(() => this.syncCloudSession().catch(() => {}), 450);
  }

  async syncCloudSession() {
    if (!this.session || this.session.spreadId !== 'royal-table' || !this.authClient?.restRequest) return false;
    if (!await this.ensurePremium({ silent:true })) return false;
    const userId = await this.userId();
    const row = sessionToServerRow(this.session, userId);
    if (!row) return false;
    this.cloudState = 'saving';
    this.renderCloudStatus();
    const result = await this.authClient.restRequest(`${SERVER_TABLE}?on_conflict=user_id,reading_id`, {
      method:'POST',
      prefer:'resolution=merge-duplicates,return=representation',
      body:row
    });
    if (result?.ok) {
      this.session.cloudSyncedAt = new Date().toISOString();
      store.set(SPREAD_STORAGE_KEY, this.session);
      this.cloudState = 'saved';
      this.renderCloudStatus();
      return true;
    }
    this.cloudState = 'local';
    this.renderCloudStatus();
    return false;
  }

  async restoreCloudPremium() {
    if (this.session || !this.authClient?.restRequest || !this.authClient?.session) return false;
    if (!await this.ensurePremium({ silent:true })) return false;
    const userId = await this.userId();
    if (!userId) return false;
    const result = await this.authClient.restRequest(
      `${SERVER_TABLE}?select=reading_id,spread_key,card_ids,revealed,active_index,question,orientation,created_at,updated_at,status&user_id=eq.${encodeURIComponent(userId)}&status=eq.in_progress&order=updated_at.desc&limit=1`
    );
    const row = result?.ok && Array.isArray(result.body) ? result.body[0] : null;
    const restored = normalizeSpreadSession(row);
    if (!restored || restored.spreadId !== 'royal-table') return false;
    this.session = restored;
    this.question = restored.question;
    this.cloudState = 'saved';
    store.set(SPREAD_STORAGE_KEY, restored);
    this.renderIntention();
    this.renderMenu();
    this.renderReading(true);
    this.notify('Mesa Real retomada da sua conta Premium.');
    return true;
  }

  async deleteCloudSession(session = this.session) {
    if (!session?.readingId || session.spreadId !== 'royal-table' || !this.authClient?.restRequest) return;
    if (!await this.ensurePremium({ silent:true })) return;
    const userId = await this.userId();
    if (!userId) return;
    await this.authClient.restRequest(
      `${SERVER_TABLE}?user_id=eq.${encodeURIComponent(userId)}&reading_id=eq.${encodeURIComponent(session.readingId)}`,
      { method:'DELETE', prefer:'return=minimal' }
    );
  }

  renderCloudStatus() {
    const root = this.result?.querySelector('[data-spread-cloud-status]');
    if (!root) return;
    const copy = this.cloudState === 'saving'
      ? 'Salvando na sua conta…'
      : this.cloudState === 'saved'
        ? 'Salva na sua conta Premium'
        : 'Salva neste aparelho';
    root.dataset.state = this.cloudState;
    root.textContent = copy;
  }

  renderIntention() {
    if (!this.intention) return;
    this.intention.innerHTML = `<label class="spread-intention-field">
      <span>PERGUNTA OU INTENÇÃO</span>
      <textarea data-spread-question maxlength="600" rows="2" placeholder="O que você deseja compreender nesta tiragem?">${safe(this.question)}</textarea>
      <small>Privada. Nunca vai para analytics. Na Mesa Real Premium, o autosave guarda esta intenção somente na sua conta protegida por RLS. Whit só recebe a tiragem após sua autorização explícita.</small>
    </label>`;
    this.intention.querySelector('[data-spread-question]')?.addEventListener('input', event => {
      this.question = event.target.value.slice(0,600);
      if (!this.session) return;
      this.saveSession();
      if (this.isComplete()) this.archiveCompleted();
    });
  }

  renderMenu() {
    if (!this.grid) return;
    const visibleSpreads = spreadsForFilter(this.spreadFilter);
    const resume = this.session && !this.isComplete() ? `<aside class="spread-resume-banner">
      <span aria-hidden="true">✦</span><div><small>TIRAGEM EM ANDAMENTO · ${SPREAD_RELEASE}</small><strong>${safe(spreadById(this.session.spreadId)?.name)}</strong><p>${this.session.revealed}/${this.session.cardIds.length} posições reveladas.</p></div><button type="button" data-spread="${safe(this.session.spreadId)}">Retomar</button>
    </aside>` : '';
    const filters = `<nav class="spread-filters" aria-label="Filtrar métodos de tiragem">${SPREAD_FILTERS.map(filter => `<button type="button" data-spread-filter="${filter.id}" aria-pressed="${this.spreadFilter === filter.id}"><b>${safe(filter.label)}</b><small>${safe(filter.description)}</small></button>`).join('')}</nav>`;
    this.grid.innerHTML = `${resume}${filters}${visibleSpreads.map(item => {
      const count = item.custom ? '1–12 cartas' : item.id === 'royal-table' ? '78 · 13 × 6' : `${item.positions.length} ${item.positions.length === 1 ? 'carta' : 'cartas'}`;
      const active = this.session?.spreadId === item.id;
      return `<button type="button" class="spread-choice${active ? ' active' : ''}" data-spread="${item.id}"${item.premium ? ' data-premium="true"' : ''} aria-pressed="${active}">
        <span class="spread-choice-sigil" aria-hidden="true">${item.sigil}</span>
        <span class="spread-choice-copy"><small>${safe(item.category)}</small><strong>${safe(item.name)}</strong><em>${safe(item.description)}</em></span>
        <span class="spread-choice-count">${count}${item.premium ? '<b>PREMIUM</b>' : ''}</span>
      </button>`;
    }).join('')}`;
    this.grid.onclick = event => {
      const filter = event.target.closest('[data-spread-filter]');
      if (filter) {
        this.spreadFilter = filter.dataset.spreadFilter;
        this.renderMenu();
        return;
      }
      const button = event.target.closest('[data-spread]');
      if (!button) return;
      this.requestChoice(button.dataset.spread).catch(() => {});
    };
  }

  async requestChoice(spreadId) {
    const target = spreadById(spreadId);
    if (!target) return;
    if (target.premium && !await this.ensurePremium()) {
      this.renderPremium();
      return;
    }
    if (this.session?.spreadId === spreadId) {
      this.renderReading(true);
      this.result?.scrollIntoView({ behavior:scrollBehavior(), block:'start' });
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
    if (!target || (target.premium && !this.premium)) return;
    const positions = positionsForSpread(target, customCount);
    const now = new Date().toISOString();
    const cardIds = shuffledIds().slice(0, positions.length);
    if (new Set(cardIds).size !== cardIds.length) throw new Error('A tiragem tentou repetir uma carta.');
    this.session = {
      readingId:uuid(),
      spreadId,
      cardIds,
      positions,
      revealed:0,
      activeIndex:0,
      question:this.question.trim().slice(0,600),
      orientation:'normal',
      createdAt:now,
      updatedAt:now,
      revision:SPREAD_SCHEMA_VERSION,
      cloudSyncedAt:null
    };
    this.pendingSpreadId = '';
    this.justRevealed = -1;
    this.cloudState = 'local';
    this.saveSession();
    preloadCardImages(this.session.cardIds, target.id === 'royal-table' ? 1 : 2);
    this.renderMenu();
    this.renderReading(false);
    this.result?.scrollIntoView({ behavior:scrollBehavior(), block:'start' });
  }

  renderCustomConfig() {
    if (!this.result) return;
    this.result.innerHTML = `<article class="spread-config-panel v213" aria-labelledby="customSpreadTitle">
      <p class="eyebrow">MESA PERSONALIZADA · V213</p>
      <h3 id="customSpreadTitle">Quantas posições deseja abrir?</h3>
      <p>Escolha de 1 a 12 cartas. Cada posição nasce na ordem, sempre direta e sem repetição.</p>
      <label class="spread-count-picker"><span><b data-custom-count>5</b><small>cartas</small></span><input type="range" min="1" max="12" value="5" step="1" data-custom-range aria-label="Quantidade de cartas"></label>
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
      positions.innerHTML = positionsForSpread(spreadById('custom-table'), amount).map((position,index) => `<li><b>${index + 1}</b>${safe(positionLabel(position))}</li>`).join('');
    };
    range.addEventListener('input', update);
    start.addEventListener('click', () => this.begin('custom-table', Number(range.value)));
    this.result.querySelector('[data-cancel-custom]')?.addEventListener('click', () => this.session ? this.renderReading(true) : (this.result.innerHTML = ''));
    update();
    this.result.scrollIntoView({ behavior:scrollBehavior(), block:'start' });
  }

  renderSwitchConfirmation(target) {
    if (!this.result || !this.session) return;
    const current = spreadById(this.session.spreadId);
    this.result.innerHTML = `<article class="spread-confirm-panel" role="alert"><span class="spread-confirm-sigil" aria-hidden="true">◇</span><p class="eyebrow">TIRAGEM EM ANDAMENTO</p><h3>Seu progresso continua guardado.</h3><p>Você revelou ${this.session.revealed} de ${this.session.cardIds.length} posições em <b>${safe(current?.name)}</b>. Trocar agora descartará essa tiragem e abrirá <b>${safe(target.name)}</b>.</p><div class="spread-actions"><button type="button" class="primary" data-keep-spread>Continuar tiragem atual</button><button type="button" class="text-button danger" data-confirm-switch>Descartar e trocar</button></div></article>`;
    this.result.querySelector('[data-keep-spread]')?.addEventListener('click', () => { this.pendingSpreadId = ''; this.renderReading(true); });
    this.result.querySelector('[data-confirm-switch]')?.addEventListener('click', async () => {
      const previous = this.session;
      const next = this.pendingSpreadId;
      this.pendingSpreadId = '';
      await this.deleteCloudSession(previous).catch(() => {});
      store.remove(SPREAD_STORAGE_KEY);
      this.session = null;
      this.renderMenu();
      const nextTarget = spreadById(next);
      if (nextTarget?.premium && !await this.ensurePremium()) this.renderPremium();
      else if (nextTarget?.custom) this.renderCustomConfig();
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
    preloadCardImages(this.session.cardIds.slice(this.session.revealed), this.session.spreadId === 'royal-table' ? 1 : 2);
    if (this.isComplete()) this.archiveCompleted();
    this.renderMenu();
    this.renderReading(false);
    this.result?.querySelector(`[data-position-index="${index}"]`)?.scrollIntoView({ behavior:scrollBehavior(), block:'nearest', inline:'center' });
  }

  slotMarkup(card, position, index, target) {
    const revealed = index < this.session.revealed;
    const active = revealed && index === this.session.activeIndex;
    const born = revealed && index === this.justRevealed;
    const compact = target.id === 'royal-table';
    const label = positionLabel(position);
    return `<button type="button" class="spread-position-slot${revealed ? ' revealed' : ''}${active ? ' active' : ''}${born ? ' born' : ''}${compact ? ' royal-slot' : ''}" data-position-index="${index}" data-position-id="${safe(positionId(position,index))}" ${revealed ? '' : 'disabled'} aria-label="${revealed ? `${safe(label)}: ${safe(card.name)}, carta direta` : `${safe(label)}: ainda não revelada`}">
      <span class="spread-position-label"><b>${String(index + 1).padStart(2,'0')}</b>${compact ? `<em>${safe(position?.short || '')}</em>` : safe(label)}</span>
      <span class="spread-position-card">${revealed ? cardImageMarkup(card, { priority:active ? 'high' : 'lazy' }) : '<i aria-hidden="true">✦</i><small>AGUARDA</small>'}</span>
      ${revealed ? `<strong>${safe(card.name)}</strong><small>DIRETA</small>` : ''}
    </button>`;
  }

  contextualMeaning(target, meaning) {
    const fields = {
      love:['No amor', meaning.love || meaning.relationships],
      career:['No trabalho', meaning.career],
      money:['Nos recursos', meaning.money],
      spirituality:['No caminho espiritual', meaning.spirituality]
    };
    return fields[target?.tone] || ['No contexto desta posição', meaning.essence];
  }

  meaningMarkup(target, index) {
    if (!this.session?.revealed) return '';
    const card = CARDS[this.session.cardIds[index]];
    const position = this.session.positions[index];
    if (!card) return '';
    const meaning = dailyMeaning(card);
    const [lensTitle, lensText] = this.contextualMeaning(target, meaning);
    return `<article class="spread-active-meaning v213" aria-live="polite">
      <div class="spread-meaning-card">${cardImageMarkup(card, { priority:'high' })}</div>
      <div class="spread-meaning-copy"><p class="eyebrow">POSIÇÃO ${index + 1}/${this.session.positions.length} · ${safe(positionLabel(position))} · DIRETA</p><h3>${safe(card.name)}</h3><p class="keywords">${meaning.keywords.map(safe).join(' · ')}</p>
      <div class="spread-meaning-sections"><section><h4>Essência</h4><p>${safe(meaning.essence)}</p></section><section><h4>${safe(lensTitle)}</h4><p>${safe(lensText)}</p></section><section><h4>Luz</h4><p>${safe(meaning.light)}</p></section><section><h4>Ponto de atenção</h4><p>${safe(meaning.tension)}</p></section><section><h4>Conselho prático</h4><p>${safe(meaning.advice)}</p></section><section><h4>Leitura responsável</h4><p>${safe(meaning.responsibleNotice)}</p></section></div>
      <blockquote>${safe(meaning.reflectionQuestion)}</blockquote><a class="spread-library-link" href="${cardPageHref(card)}">Abrir as 15 camadas desta carta na Biblioteca →</a></div>
    </article>`;
  }

  synthesisMarkup(items, target) {
    if (!this.isComplete()) return '';
    const synthesisItems = items.map(item => ({ card:item.card, position:positionLabel(item.position) }));
    const synthesis = synthesizeSpread(synthesisItems, { question:this.session.question, tone:target?.tone });
    return `<article class="spread-synthesis v213"><span>SÍNTESE DA TIRAGEM · ${SPREAD_RELEASE}</span><h3>O desenho que as cartas formam juntas.</h3><div class="spread-synthesis-metrics"><span><b>${synthesis.majorCount}</b>Maiores</span><span><b>${synthesis.courtCount}</b>Corte</span><span><b>${safe(synthesis.dominantElement)}</b>Elemento</span><span><b>${safe(synthesis.dominantSuit)}</b>Campo</span></div><section><h4>Escala</h4><p>${safe(synthesis.opening)}</p></section><section><h4>Padrões</h4><p>${safe(synthesis.pattern)}</p></section><section><h4>Movimento</h4><p>${safe(synthesis.movement)}</p></section><section><h4>Ponte entre posições</h4><p>${safe(synthesis.bridge)}</p></section><section><h4>Integração</h4><p>${safe(synthesis.integration)}</p></section><blockquote>${safe(synthesis.action)}</blockquote><aside><b>LEITURA RESPONSÁVEL</b><p>${safe(synthesis.responsibleNotice)}</p></aside></article>`;
  }

  layoutNote(target) {
    if (target.id === 'royal-table') return `<aside class="spread-layout-note"><b>MESA REAL 13 × 6</b><span>${ROYAL_TABLE_ROWS} linhas · ${ROYAL_TABLE_COLUMNS} colunas · todas as 78 cartas, sem repetição.</span></aside>`;
    if (target.id === 'celtic-cross') return '<aside class="spread-layout-note"><b>CRUZ CELTA · 10 POSIÇÕES</b><span>A cruz central e a coluna lateral mantêm a ordem tradicional da leitura.</span></aside>';
    return '';
  }

  renderReading(resumed) {
    this.session = normalizeSpreadSession(this.session);
    if (!this.session || !this.result) return;
    const target = spreadById(this.session.spreadId);
    const items = this.session.cardIds.map((id,index) => ({ card:CARDS[id], position:this.session.positions[index] }));
    const progress = Math.round(this.session.revealed / items.length * 100);
    const activeIndex = this.session.revealed ? Math.min(this.session.activeIndex, this.session.revealed - 1) : 0;
    this.session.activeIndex = activeIndex;
    const complete = this.isComplete();
    const question = this.session.question ? `<p class="spread-private-question"><span>INTENÇÃO PRIVADA</span>${safe(this.session.question)}</p>` : '';
    const orb = complete ? '' : `<section class="spread-orb-ritual" aria-label="Revelar a próxima posição"><p>${this.session.revealed ? 'A próxima posição está pronta.' : 'Respire. Quando sentir presença, toque a Orbe.'}</p><button type="button" class="spread-orb" data-orb-surface="spreads" data-reveal-card aria-label="Revelar carta da posição ${this.session.revealed + 1}: ${safe(positionLabel(this.session.positions[this.session.revealed]))}"><span class="spread-orb-aura" aria-hidden="true"></span><span class="spread-orb-glass" aria-hidden="true"></span><small>TOQUE PARA REVELAR</small></button><span>${this.session.revealed} reveladas · ${items.length - this.session.revealed} aguardando</span></section>`;
    const cloud = target.id === 'royal-table' ? `<span class="spread-cloud-status" data-spread-cloud-status data-state="${this.cloudState}">${this.cloudState === 'saved' ? 'Salva na sua conta Premium' : this.cloudState === 'saving' ? 'Salvando na sua conta…' : 'Salva neste aparelho'}</span>` : '';

    this.result.innerHTML = `<article class="spread-reading spread-temple-reading v213${complete ? ' complete' : ''}${target.id === 'royal-table' ? ' is-royal' : ''}">
      <header class="spread-reading-head"><div><p class="eyebrow">${safe(target.name)}${resumed ? ' · RETOMADA' : ''}</p><h3>${complete ? 'A constelação está completa.' : 'Uma posição de cada vez.'}</h3>${cloud}</div><span><b>${this.session.revealed}</b><small>/ ${items.length} reveladas</small></span></header>
      ${question}${this.layoutNote(target)}
      <div class="spread-progress" role="progressbar" aria-label="Progresso da tiragem" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${this.session.revealed}"><i style="width:${progress}%"></i></div>
      <div class="spread-map spread-map-${target.id} count-${items.length}" data-spread-layout="${target.id}">${items.map(({card,position},index) => this.slotMarkup(card,position,index,target)).join('')}</div>
      ${orb}${this.meaningMarkup(target,activeIndex)}${this.synthesisMarkup(items,target)}
      <div class="spread-actions spread-reading-actions">${complete ? '<button type="button" class="primary" data-save-spread>Guardar no Diário</button><button type="button" class="text-button" data-open-whit>Refletir com Whit · autorização explícita</button>' : ''}<button type="button" class="text-button" data-new-spread>${complete ? 'Escolher nova tiragem' : 'Recomeçar ou trocar'}</button></div><div data-whit-consent></div><div data-reset-confirm></div>
    </article>`;
    this.bindReading(items,target);
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
      this.result.querySelector('.spread-active-meaning')?.scrollIntoView({ behavior:scrollBehavior(), block:'nearest' });
    });
    this.result.querySelector('[data-save-spread]')?.addEventListener('click', () => this.saveToDiary(this.session));
    this.result.querySelector('[data-open-whit]')?.addEventListener('click', () => this.renderWhitConsent(items,target));
    this.result.querySelector('[data-new-spread]')?.addEventListener('click', async () => {
      if (this.isComplete()) {
        store.remove(SPREAD_STORAGE_KEY);
        this.session = null;
        this.result.innerHTML = '';
        this.renderMenu();
        this.grid?.scrollIntoView({ behavior:scrollBehavior(), block:'start' });
        return;
      }
      this.renderResetConfirmation(target);
    });
  }

  renderWhitConsent(items, target) {
    const root = this.result?.querySelector('[data-whit-consent]');
    if (!root || !this.isComplete()) return;
    root.innerHTML = `<aside class="spread-whit-consent" role="dialog" aria-labelledby="spreadWhitConsentTitle"><span aria-hidden="true">✦</span><div><p class="eyebrow">WHIT · CONSENTIMENTO EXATO</p><h3 id="spreadWhitConsentTitle">Compartilhar somente esta tiragem?</h3><p>Whit receberá o método, as cartas, as posições e sua intenção desta leitura. Seu Diário, outras tiragens e outras telas continuam fora do acesso.</p><small>A autorização expira automaticamente. Nenhuma API paga é acionada por este botão.</small></div><div class="spread-actions"><button type="button" class="primary" data-confirm-whit>Autorizar esta tiragem</button><button type="button" class="text-button" data-cancel-whit>Cancelar</button></div></aside>`;
    root.querySelector('[data-cancel-whit]')?.addEventListener('click', () => { root.innerHTML = ''; });
    root.querySelector('[data-confirm-whit]')?.addEventListener('click', () => this.prepareWhit(items,target,root));
  }

  async prepareWhit(items, target, root) {
    const whit = this.whit || globalThis.whit;
    if (!whit?.requestContextGrant) {
      this.notify('Whit ainda não está disponível nesta sessão.');
      return;
    }
    if (!this.authClient?.session) {
      this.notify('Entre na Conta para autorizar contexto privado para Whit.');
      globalThis.orbe?.go?.('login');
      return;
    }
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const grant = await whit.requestContextGrant({
      capability:'tarot-single-spread',
      resourceType:'tarot_reading',
      resourceId:this.session.readingId,
      scope:{ spreadKey:target.id, positionCount:items.length, orientation:'normal', release:SPREAD_RELEASE },
      expiresAt,
      confirmed:true
    });
    if (!grant?.ok) {
      this.notify(grant?.message || 'Não foi possível autorizar esta tiragem agora.');
      return;
    }
    store.remove(JOURNAL_AI_SELECTION_KEY);
    store.set(AI_TAROT_SELECTION_KEY, {
      source:'spread',
      readingId:this.session.readingId,
      spreadId:target.id,
      spreadName:target.name,
      question:this.session.question || '',
      consentScope:'single-spread',
      positions:items.map(({card,position}) => ({ position:positionLabel(position), cardId:card.id, cardName:card.name, orientation:'normal' })),
      selectedAt:new Date().toISOString(),
      expiresAt,
      private:true,
      release:SPREAD_RELEASE
    });
    if (root) root.innerHTML = '';
    this.notify('Somente esta tiragem foi autorizada para Whit.');
    globalThis.dispatchEvent(new CustomEvent('divina:tarot-ai-selected', { detail:{ readingId:this.session.readingId, spreadId:target.id } }));
    globalThis.orbe?.go?.('ai');
  }

  renderResetConfirmation(target) {
    const root = this.result?.querySelector('[data-reset-confirm]');
    if (!root || !this.session) return;
    root.innerHTML = `<div class="spread-reset-confirm" role="alert"><p><b>Descartar ${this.session.revealed} ${this.session.revealed === 1 ? 'carta revelada' : 'cartas reveladas'}?</b> Esta ação não pode ser desfeita.</p><div><button type="button" class="primary" data-cancel-reset>Continuar ${safe(target.name)}</button><button type="button" class="text-button danger" data-confirm-reset>Sim, descartar</button></div></div>`;
    root.querySelector('[data-cancel-reset]')?.addEventListener('click', () => { root.innerHTML = ''; });
    root.querySelector('[data-confirm-reset]')?.addEventListener('click', async () => {
      const previous = this.session;
      await this.deleteCloudSession(previous).catch(() => {});
      store.remove(SPREAD_STORAGE_KEY);
      this.session = null;
      this.result.innerHTML = '';
      this.renderMenu();
      this.grid?.scrollIntoView({ behavior:scrollBehavior(), block:'start' });
    });
    root.querySelector('[data-cancel-reset]')?.focus();
  }

  renderPremium() {
    if (!this.result) return;
    const signedIn = Boolean(this.authClient?.session);
    this.result.innerHTML = `<article class="spread-premium spread-temple-premium v213"><div class="spread-premium-copy"><p class="eyebrow">MESA REAL · PREMIUM</p><h3>78 cartas · 13 × 6 · sem repetição</h3><p>A Mesa Real digital completa usa todas as 78 cartas, sempre diretas. O progresso é salvo localmente e, com Premium ativo, também pode ser retomado pela sua conta.</p><div class="spread-premium-note"><b>STAGING continua sem cobrança real.</b><span>O acesso só é liberado quando o servidor confirma o Premium vitalício. Nenhuma interface concede Premium sozinha.</span></div><div class="spread-actions"><button type="button" class="primary" data-go-premium>${signedIn ? 'Ver meu Premium' : 'Entrar e verificar Premium'}</button><button type="button" class="text-button" data-go-consultation>Ver consulta profissional</button>${this.session ? '<button type="button" class="text-button" data-return-spread>Voltar à tiragem atual</button>' : ''}</div></div><div class="spread-royal-preview v213" aria-label="Prévia da Mesa Real: 6 linhas por 13 colunas">${Array.from({length:78},(_,index) => `<i><span>${index + 1}</span></i>`).join('')}<strong><span aria-hidden="true">◇</span>78 CARTAS · ACESSO PROTEGIDO</strong></div></article>`;
    this.result.querySelector('[data-go-premium]')?.addEventListener('click', () => globalThis.orbe?.go?.(signedIn ? 'subscriptions' : 'login'));
    this.result.querySelector('[data-go-consultation]')?.addEventListener('click', () => globalThis.orbe?.go?.('consultations'));
    this.result.querySelector('[data-return-spread]')?.addEventListener('click', () => this.renderReading(true));
    this.result.scrollIntoView({ behavior:scrollBehavior(), block:'start' });
  }

  archiveCompleted() {
    if (!this.isComplete()) return;
    const id = this.session.readingId || `${this.session.spreadId}:${this.session.createdAt}`;
    const previous = this.history.find(entry => entry.id === id);
    const entry = { ...this.session, id, completedAt:previous?.completedAt || new Date().toISOString(), favorite:previous?.favorite || false, tags:previous?.tags || [] };
    this.history = [entry, ...this.history.filter(item => item.id !== id)].slice(0,MAX_HISTORY);
    this.saveHistory();
    this.renderHistory();
    if (this.session.spreadId === 'royal-table') this.scheduleCloudSave();
  }

  diaryEntry(session) {
    const target = spreadById(session.spreadId);
    const items = session.cardIds.map((id,index) => ({ card:CARDS[id], position:session.positions[index] }));
    const synthesis = synthesizeSpread(items.map(item => ({ card:item.card, position:positionLabel(item.position) })), { question:session.question, tone:target?.tone });
    return {
      title:`Tiragem — ${target?.name || 'Tarot'}`,
      text:`${items.map(item => `${positionLabel(item.position)}: ${item.card.name} (direta)`).join('\n')}\n\n${synthesis.opening} ${synthesis.pattern} ${synthesis.movement} ${synthesis.bridge} ${synthesis.integration}\n\n${synthesis.action}`,
      question:session.question || 'O que esta tiragem ilumina no meu momento?',
      tags:['tiragem',target?.name,synthesis.dominantSuit].filter(Boolean).join(', '),
      mood:'Reflexiva', cardIds:session.cardIds, type:'spread', orientation:'normal', sourceReadingId:session.readingId
    };
  }

  saveToDiary(session) {
    if (!session || session.revealed !== session.cardIds.length) return;
    this.onSave?.(this.diaryEntry(session));
    this.notify('Tiragem preparada para o seu Diário privado.');
  }

  historyDetails(entry, target) {
    const items = entry.cardIds.map((id,index) => ({ card:CARDS[id], position:entry.positions[index] })).filter(item => item.card);
    const synthesis = synthesizeSpread(items.map(item => ({ card:item.card, position:positionLabel(item.position) })), { question:entry.question, tone:target?.tone });
    return `<details class="spread-history-details"><summary>Reabrir leitura completa</summary><ol>${items.map(({card,position}) => `<li><span>${safe(positionLabel(position))}</span><a href="${cardPageHref(card)}">${safe(card.name)} · direta</a></li>`).join('')}</ol><div><h5>Síntese preservada</h5><p>${safe(synthesis.opening)} ${safe(synthesis.pattern)}</p><p>${safe(synthesis.movement)}</p><p>${safe(synthesis.integration)}</p><blockquote>${safe(synthesis.action)}</blockquote></div></details>`;
  }

  renderHistory() {
    if (!this.historyRoot) return;
    const entries = this.history;
    this.historyRoot.innerHTML = `<section class="spread-history-panel v213" aria-labelledby="spreadHistoryTitle"><header><div><p class="eyebrow">MEMÓRIA DO TEMPLO · LOCAL</p><h3 id="spreadHistoryTitle">Suas tiragens neste aparelho.</h3></div><button type="button" class="text-button" data-export-history>Exportar · Premium</button></header>${entries.length ? `<div class="spread-history-list">${entries.map(entry => {
      const target = spreadById(entry.spreadId);
      const cards = entry.cardIds.map(id => CARDS[id]?.name).filter(Boolean);
      return `<article data-history-id="${safe(entry.id)}"><div class="spread-history-top"><span class="spread-history-sigil" aria-hidden="true">${target?.sigil || '✦'}</span><div><small>${safe(formatDate(entry.completedAt))}</small><h4>${safe(target?.name || 'Tiragem')}</h4></div><button type="button" class="spread-favorite${entry.favorite ? ' active' : ''}" data-favorite-history aria-pressed="${entry.favorite}" aria-label="${entry.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">♡</button></div>${entry.question ? `<p class="spread-history-question">${safe(entry.question)}</p>` : ''}<p class="spread-history-cards">${cards.map(safe).join(' · ')}</p>${this.historyDetails(entry,target)}<label>ETIQUETAS<input type="text" data-history-tags maxlength="180" value="${safe(entry.tags.join(', '))}" placeholder="amor, decisão, trabalho"></label><div class="spread-history-actions"><button type="button" class="text-button" data-history-diary>Guardar no Diário</button><button type="button" class="text-button danger" data-delete-history>Excluir</button></div>${this.pendingDeleteHistoryId === entry.id ? '<div class="spread-history-delete" role="alert"><p>Excluir esta tiragem somente deste aparelho?</p><button type="button" data-cancel-delete>Cancelar</button><button type="button" data-confirm-delete>Excluir definitivamente</button></div>' : ''}</article>`;
    }).join('')}</div>` : '<p class="spread-history-empty">Quando uma tiragem for concluída, ela aparecerá aqui.</p>'}<p class="spread-history-privacy">A pergunta não é enviada para analytics nem para Whit sem sua autorização.</p></section>`;

    this.historyRoot.querySelector('[data-export-history]')?.addEventListener('click', () => { this.notify('A exportação faz parte do Premium e continua protegida.'); globalThis.orbe?.go?.('subscriptions'); });
    this.historyRoot.onclick = event => {
      const article = event.target.closest('[data-history-id]');
      if (!article) return;
      const entry = this.history.find(item => item.id === article.dataset.historyId);
      if (!entry) return;
      if (event.target.closest('[data-favorite-history]')) { entry.favorite = !entry.favorite; this.saveHistory(); this.renderHistory(); return; }
      if (event.target.closest('[data-history-diary]')) { this.saveToDiary(entry); return; }
      if (event.target.closest('[data-delete-history]')) { this.pendingDeleteHistoryId = entry.id; this.renderHistory(); return; }
      if (event.target.closest('[data-cancel-delete]')) { this.pendingDeleteHistoryId = ''; this.renderHistory(); return; }
      if (event.target.closest('[data-confirm-delete]')) { this.history = this.history.filter(item => item.id !== entry.id); this.pendingDeleteHistoryId = ''; this.saveHistory(); this.renderHistory(); this.notify('Tiragem excluída deste aparelho.'); }
    };
    this.historyRoot.onchange = event => {
      const input = event.target.closest('[data-history-tags]');
      if (!input) return;
      const article = input.closest('[data-history-id]');
      const entry = this.history.find(item => item.id === article?.dataset.historyId);
      if (!entry) return;
      entry.tags = [...new Set(input.value.split(',').map(tag => tag.trim()).filter(Boolean))].slice(0,8).map(tag => tag.slice(0,32));
      input.value = entry.tags.join(', ');
      this.saveHistory();
    };
  }

  destroy() {
    this.destroyed = true;
    clearTimeout(this.cloudSaveTimer);
    removeEventListener('divina:billing-updated', this.onBilling);
    removeEventListener('divina:auth-state', this.onAuth);
  }
}
