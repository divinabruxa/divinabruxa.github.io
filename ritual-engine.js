/* DIVINA BRUXA — CARTA DO DIA DEFINITIVA — V183 */
import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js?v=183';
import { brasiliaDate, collectiveDailyIdentity, createAccountDailyRecord, createDailyRecord, isDailyRecord, nextBrasiliaBoundary, resolveDailyIdentity, DAILY_ACCOUNT_SELECTION_VERSION, DAILY_SELECTION_VERSION, DAILY_STORAGE_KEY } from './daily-policy.js?v=189';
import { dailyMeaning } from './daily-meaning-runtime.js?v=183';

const DAILY_STORAGE_EVENT_SUFFIX = `:${DAILY_STORAGE_KEY}`;
const DAILY_STATES = Object.freeze({ READY: 'Ready', INTENTION: 'Intention', REVEALING: 'Revealing', REVEALED: 'Revealed', ERROR: 'Error' });
const safe = value => escapeHTML(value ?? '');
const section = (title, body) => body ? `<article class="meaning-card"><span>${safe(title)}</span><p>${safe(body)}</p></article>` : '';
const cycleLabel = date => {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'long' }).format(new Date(Date.UTC(year, month - 1, day, 15)));
};
const announce = message => globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail: message }));

export class DailyRitual {
  constructor(root, onSave, { authClient = globalThis.divinaAuth } = {}) {
    if (!root) throw new TypeError('O espaço da Carta do Dia não foi encontrado.');
    this.root = root;
    this.onSave = typeof onSave === 'function' ? onSave : () => undefined;
    this.authClient = authClient;
    this.memoryRecord = null;
    this.data = this.readRecord();
    this.identity = collectiveDailyIdentity();
    this.identityPromise = resolveDailyIdentity(this.authClient).then(identity => (this.identity = identity));
    this.drawing = false;
    this.cycleTimer = 0;
    this.onStorage = event => {
      if (!event.key?.endsWith(DAILY_STORAGE_EVENT_SUFFIX) || !event.newValue) return;
      let next = null;
      try { next = JSON.parse(event.newValue); } catch { return; }
      if (!isDailyRecord(next, brasiliaDate())) return;
      this.memoryRecord = next;
      this.data = next;
      this.reveal(false);
    };
    this.onVisibility = () => {
      if (document.visibilityState === 'visible') this.refreshCycle();
    };
    this.onAccountSync = event => {
      if (!event.detail?.daily) return;
      const next = this.readRecord();
      if (!next) return;
      this.data = next;
      this.reveal(false);
    };
    globalThis.addEventListener?.('storage', this.onStorage);
    globalThis.addEventListener?.('divina:account-sync-applied', this.onAccountSync);
    document.addEventListener?.('visibilitychange', this.onVisibility);
    this.scheduleNextCycle();
    this.render();
  }

  setState(state) {
    if (!Object.values(DAILY_STATES).includes(state)) return;
    this.root.dataset.dailyState = state;
    if (state === DAILY_STATES.REVEALING) this.root.setAttribute('aria-busy', 'true');
    else this.root.removeAttribute('aria-busy');
  }

  readRecord(date = brasiliaDate()) {
    let stored = null;
    try { stored = store.get(DAILY_STORAGE_KEY); } catch { stored = null; }
    if (isDailyRecord(stored, date)) return stored;
    return isDailyRecord(this.memoryRecord, date) ? this.memoryRecord : null;
  }

  saveRecord(record) {
    this.memoryRecord = record;
    let persisted = false;
    try { store.set(DAILY_STORAGE_KEY, record); persisted = true; } catch { persisted = false; }
    if (!persisted) announce('Sua carta continua nesta aba, mas a retomada foi bloqueada pelo navegador.');
    return persisted;
  }

  scheduleNextCycle() {
    globalThis.clearTimeout(this.cycleTimer);
    const delay = Math.max(1000, nextBrasiliaBoundary().getTime() - Date.now() + 100);
    this.cycleTimer = globalThis.setTimeout(() => {
      this.refreshCycle();
      this.scheduleNextCycle();
    }, delay);
  }

  refreshCycle() {
    const current = this.readRecord();
    if (current) {
      const changed = current.date !== this.data?.date || current.id !== this.data?.id || current.intention !== this.data?.intention;
      this.data = current;
      if (changed) this.reveal(false);
      return;
    }
    if (this.data) {
      this.data = null;
      this.memoryRecord = null;
      this.render();
    }
  }

  render() {
    const current = this.readRecord();
    if (current) {
      this.data = current;
      return this.reveal(false);
    }
    this.setState(DAILY_STATES.READY);
    this.root.innerHTML = `<div class="ritual-steps" aria-label="Etapa 1 de 3"><i class="on"></i><i></i><i></i></div><div class="ritual-breathe"><span></span></div><p class="eyebrow">PASSO 1 · RESPIRAR</p><h3>Chegue ao presente.</h3><p>Toque na Orbe, respire lentamente e deixe o agora se aproximar.</p><button class="primary" type="button" data-next>Começar ritual</button><p class="free-rule">O ritual funciona também offline. A carta respeita a data oficial de Brasília.</p>`;
    this.root.querySelector('[data-next]').addEventListener('click', () => this.intention());
  }

  intention() {
    if (this.readRecord()) return this.render();
    this.setState(DAILY_STATES.INTENTION);
    this.root.innerHTML = `<div class="ritual-steps" aria-label="Etapa 2 de 3"><i class="on"></i><i class="on"></i><i></i></div><p class="eyebrow">PASSO 2 · INTENÇÃO PRIVADA</p><h3>O que deseja compreender?</h3><p>Esta intenção permanece somente neste dispositivo e nunca altera qual carta pertence ao dia.</p><label for="dailyIntention">Sua intenção opcional</label><input id="dailyIntention" maxlength="120" autocomplete="off" placeholder="Uma palavra ou pergunta"><button class="primary" type="button" data-draw>Despertar minha carta</button><p class="security-note" data-daily-status role="status" aria-live="polite"></p>`;
    const input = this.root.querySelector('#dailyIntention');
    const button = this.root.querySelector('[data-draw]');
    button.addEventListener('click', () => this.draw(input.value, button));
    input.focus({ preventScroll: true });
  }

  async draw(intention, button) {
    if (this.drawing) return null;
    const existing = this.readRecord();
    if (existing) {
      this.data = existing;
      this.reveal(false);
      return existing.id;
    }
    this.drawing = true;
    this.setState(DAILY_STATES.REVEALING);
    button.disabled = true;
    button.textContent = 'A Orbe está revelando…';
    const status = this.root.querySelector('[data-daily-status]');
    if (status) status.textContent = 'A Orbe está preparando a Carta do Dia.';
    try {
      const identity = await this.identityPromise;
      let record = null;
      if (this.authClient?.enabled && typeof this.authClient.dailyCard === 'function' && navigator.onLine !== false) {
        const remote = await this.authClient.dailyCard();
        if (remote?.ok) record = createAccountDailyRecord(remote.body, intention);
      }
      record ||= createDailyRecord(intention, new Date(), identity);
      const concurrent = this.readRecord(record.date);
      this.data = concurrent || record;
      if (!concurrent) this.saveRecord(record);
      this.reveal(true);
      return this.data.id;
    } catch {
      this.setState(DAILY_STATES.ERROR);
      button.disabled = false;
      button.textContent = 'Tentar novamente';
      if (status) status.textContent = 'A revelação foi interrompida. Sua intenção permanece na tela.';
      announce('A Carta do Dia não abriu. Tente novamente; nenhum registro foi perdido.');
      return null;
    } finally {
      this.drawing = false;
    }
  }

  reveal(animate = false) {
    if (!isDailyRecord(this.data, brasiliaDate())) return this.render();
    const card = CARDS[this.data.id];
    if (!card || card.orientation !== 'normal') {
      this.setState(DAILY_STATES.ERROR);
      this.root.innerHTML = '<p class="eyebrow">RITUAL DIÁRIO</p><h3>A carta não pôde ser confirmada.</h3><p>Nenhuma carta invertida ou fora do catálogo será exibida. Volte ao início do ritual para tentar novamente.</p><button class="primary" type="button" data-retry>Voltar ao ritual</button>';
      this.root.querySelector('[data-retry]').addEventListener('click', () => { this.data = null; this.render(); });
      return;
    }
    const meaning = dailyMeaning(card);
    const keywords = meaning.keywords.map(safe).join(' · ');
    const symbols = meaning.symbols.length ? `<article class="meaning-card"><span>SÍMBOLOS</span>${meaning.symbols.map(item => `<p>✦ ${safe(item)}</p>`).join('')}</article>` : '';
    const scope = this.data.selectionVersion === DAILY_ACCOUNT_SELECTION_VERSION
      ? 'A seleção segura desta conta foi confirmada no STAGING e permanece estável em outros aparelhos conectados.'
      : this.data.selectionVersion !== DAILY_SELECTION_VERSION
        ? 'A carta já revelada antes desta atualização foi preservada neste aparelho até o fim do ciclo atual.'
      : this.data.identityScope === 'account'
        ? 'A seleção desta conta permanece estável em outros aparelhos conectados.'
        : 'A seleção coletiva pela data permanece igual em qualquer aparelho.';
    this.setState(DAILY_STATES.REVEALED);
    this.root.innerHTML = `<div class="ritual-steps" aria-label="Etapa 3 de 3"><i class="on"></i><i class="on"></i><i class="on"></i></div>${this.data.intention ? `<p class="intention">Sua intenção privada · ${safe(this.data.intention)}</p>` : ''}<div class="current daily-reveal ${animate ? 'birth' : ''}">${cardImageMarkup(card, { alt: `${card.name}, direta`, priority: 'high' })}</div><p class="eyebrow">SUA CARTA DO DIA · DIRETA</p><h3>${safe(card.name)}</h3><p class="keywords">${keywords}</p>${section('ENERGIA DO DIA', meaning.dailyEnergy)}${section('ESSÊNCIA', meaning.essence)}${section('LUZ', meaning.light)}${section('TENSÃO', meaning.tension)}${section('AMOR', meaning.love)}${section('RELACIONAMENTOS', meaning.relationships)}${section('CARREIRA', meaning.career)}${section('DINHEIRO', meaning.money)}${section('ESPIRITUALIDADE', meaning.spirituality)}${section('CONSELHO', meaning.advice)}${symbols}${section('PERGUNTA PARA O DIA', meaning.reflectionQuestion)}${section('AÇÃO POSSÍVEL', meaning.action)}${section('LEITURA RESPONSÁVEL', meaning.responsibleNotice)}<button class="primary" type="button" data-save>Guardar no Diário</button><p class="free-rule">Ciclo de ${safe(cycleLabel(this.data.date))} · fuso de Brasília.<br>${safe(scope)}</p>`;
    const saveButton = this.root.querySelector('[data-save]');
    saveButton.addEventListener('click', async () => {
      saveButton.disabled = true;
      try {
        await Promise.resolve(this.onSave({ title: `Carta do Dia — ${card.name}`, text: `${meaning.dailyEnergy}\n\n${meaning.essence}\n\n${meaning.advice}\n\nAção possível: ${meaning.action}`, question: this.data.intention || meaning.reflectionQuestion, tags: `carta do dia, ${card.suit}`, mood: 'Reflexiva', cardId: card.id, type: 'daily', orientation: 'normal' }));
        saveButton.textContent = 'Guardada no Diário';
        announce('Sua Carta do Dia foi guardada no Diário.');
      } catch {
        saveButton.disabled = false;
        announce('Não foi possível guardar agora. Sua Carta do Dia continua aberta.');
      }
    });
  }

  destroy() {
    globalThis.clearTimeout(this.cycleTimer);
    globalThis.removeEventListener?.('storage', this.onStorage);
    globalThis.removeEventListener?.('divina:account-sync-applied', this.onAccountSync);
    document.removeEventListener?.('visibilitychange', this.onVisibility);
  }
}
