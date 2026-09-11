/* DIVINA BRUXA 2.0 — REBIRTH R004 · CARTA DO DIA: O ENCONTRO VIVO · V303
   A Orbe continua no centro. Uma carta nasce por dia. Profundidade aparece por camadas,
   não como parede de informação. Whit reage localmente; nenhuma API é chamada aqui. */
import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js?v=183';
import {
  brasiliaDate,
  createAccountDailyRecord,
  createDailyRecord,
  isDailyRecord,
  nextBrasiliaBoundary,
  resolveDailyIdentity,
  DAILY_ACCOUNT_SELECTION_VERSION,
  DAILY_STORAGE_KEY
} from './daily-policy-v303.js?v=303';
import { dailyMeaning } from './daily-meaning-runtime.js?v=183';

const safe = value => escapeHTML(value ?? '');
const wait = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
const reduceMotion = () => matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
const stars = () => '<span class="dw303__stars" aria-hidden="true">' + '<i></i>'.repeat(8) + '</span>';
const announce = message => globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:message }));

const dateLabel = date => {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone:'America/Sao_Paulo', weekday:'long', day:'numeric', month:'long'
  }).format(new Date(Date.UTC(year, month - 1, day, 15)));
};

const layerDefinitions = meaning => [
  ['essencia','ESSÊNCIA', meaning.dailyEnergy, meaning.essence],
  ['relacoes','VÍNCULOS', meaning.love, meaning.relationships],
  ['caminho','CAMINHO', meaning.career, meaning.money, meaning.advice],
  ['interior','INTERIOR', meaning.spirituality, meaning.light, meaning.tension],
  ['simbolos','SÍMBOLOS', ...(meaning.symbols || [])],
  ['pratica','HOJE', meaning.reflectionQuestion, meaning.action, meaning.responsibleNotice]
].map(([id, label, ...parts]) => ({ id, label, parts:parts.filter(Boolean) }));

const WHIT_AFTER_REVEAL = [
  card => `${card.name} está aberta. Não precisa transformar isso em uma sentença.`,
  card => `Fique um pouco com ${card.name}. A primeira sensação não precisa ser a resposta final.`,
  card => `${card.name} é uma lente para hoje. O resto continua sendo escolha sua.`
];

export class DailyWorldV303 {
  constructor(root, { onSave, authClient = globalThis.divinaAuth } = {}) {
    if (!root) throw new TypeError('O mundo da Carta do Dia não foi encontrado.');
    this.root = root;
    this.onSave = typeof onSave === 'function' ? onSave : () => undefined;
    this.authClient = authClient;
    this.data = this.readRecord();
    this.identityPromise = resolveDailyIdentity(this.authClient);
    this.drawing = false;
    this.timer = 0;
    this.activeLayer = 'essencia';
    this.abort = new AbortController();
    this.unsubAuth = null;
    this.root.classList.add('daily-world-v303-host');
    this.root.dataset.dailyWorld = '303';

    this.onStorage = event => {
      if (!event.key?.endsWith(`:${DAILY_STORAGE_KEY}`) || !event.newValue) return;
      let next = null;
      try { next = JSON.parse(event.newValue); } catch { return; }
      if (!isDailyRecord(next, brasiliaDate())) return;
      this.data = next;
      this.renderRevealed(false);
    };
    this.onVisibility = () => {
      if (document.visibilityState === 'visible') this.refreshCycle();
    };
    this.onAccountSync = () => this.render();

    addEventListener('storage', this.onStorage, { signal:this.abort.signal });
    addEventListener('divina:account-sync-applied', this.onAccountSync, { signal:this.abort.signal });
    document.addEventListener('visibilitychange', this.onVisibility, { signal:this.abort.signal });
    this.unsubAuth = this.authClient?.onAuthStateChange?.(() => {
      this.identityPromise = resolveDailyIdentity(this.authClient);
      this.data = this.readRecord();
      this.render();
    }) || null;
    this.scheduleNextCycle();
    this.render();
  }

  readRecord(date = brasiliaDate()) {
    let stored = null;
    try { stored = store.get(DAILY_STORAGE_KEY); } catch {}
    return isDailyRecord(stored, date) ? stored : null;
  }

  saveRecord(record) {
    try {
      store.set(DAILY_STORAGE_KEY, record);
      return true;
    } catch {
      announce('Sua carta continua aberta nesta visita, mas este navegador bloqueou a memória local.');
      return false;
    }
  }

  accountActive() {
    return Boolean(this.authClient?.session);
  }

  recordMatchesCurrentScope(record) {
    if (!record) return false;
    const accountRecord = record.selectionVersion === DAILY_ACCOUNT_SELECTION_VERSION;
    return this.accountActive() ? accountRecord : !accountRecord;
  }

  scheduleNextCycle() {
    clearTimeout(this.timer);
    const delay = Math.max(1000, nextBrasiliaBoundary().getTime() - Date.now() + 150);
    this.timer = setTimeout(() => {
      this.refreshCycle();
      this.scheduleNextCycle();
    }, delay);
  }

  refreshCycle() {
    const current = this.readRecord();
    if (current && this.recordMatchesCurrentScope(current)) {
      const changed = current.id !== this.data?.id || current.date !== this.data?.date;
      this.data = current;
      if (changed) this.renderRevealed(false);
      return;
    }
    if (this.data && this.data.date !== brasiliaDate()) {
      this.data = null;
      this.activeLayer = 'essencia';
      this.render();
    }
  }

  render() {
    const current = this.readRecord();
    if (current && this.recordMatchesCurrentScope(current)) {
      this.data = current;
      this.renderRevealed(false);
      return;
    }

    const date = brasiliaDate();
    const account = this.accountActive();
    const offlineAccount = account && navigator.onLine === false;
    this.root.innerHTML = `
      <section class="dw303" aria-labelledby="dw303Title">
        <header class="dw303__head">
          <div><span>ENCONTRO DE HOJE</span><h2 id="dw303Title">Carta do Dia</h2></div>
          <time datetime="${date}">${safe(dateLabel(date))}</time>
        </header>

        <div class="dw303__sanctuary" data-daily-sanctuary>
          ${stars()}
          <div class="dw303__breath" aria-hidden="true"></div>
          <button class="dw303__orb" type="button" data-daily-orb aria-label="Tocar a Orbe para abrir a Carta do Dia">
            <span class="dw303__orb-aura" aria-hidden="true"></span>
            <span class="dw303__orb-image" data-orb-surface="daily"></span>
          </button>
          <p class="dw303__whisper">${offlineAccount ? 'Sua conta está aqui.<br><span>Reconecte para confirmar a carta deste dia.</span>' : 'Chegue ao dia.<br><span>Quando sentir, toque a Orbe.</span>'}</p>
          <button class="dw303__intention-toggle" type="button" data-intention-toggle aria-expanded="false">deixar uma intenção</button>
          <div class="dw303__intention" data-intention hidden>
            <label for="dailyIntention303">Uma palavra ou pergunta opcional</label>
            <input id="dailyIntention303" maxlength="120" autocomplete="off" placeholder="Só para você">
          </div>
          <p class="dw303__truth">${account ? 'conta sincronizada' : 'este dispositivo'} · 1 carta · 1 dia · Brasília · sempre direta</p>
        </div>
      </section>`;

    const toggle = this.root.querySelector('[data-intention-toggle]');
    const intention = this.root.querySelector('[data-intention]');
    toggle?.addEventListener('click', () => {
      const open = intention.hidden;
      intention.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) intention.querySelector('input')?.focus({ preventScroll:true });
    });
    const dailyOrb = this.root.querySelector('[data-daily-orb]');
    if (offlineAccount && dailyOrb) dailyOrb.disabled = true;
    dailyOrb?.addEventListener('click', () => {
      const value = this.root.querySelector('#dailyIntention303')?.value || '';
      this.draw(value);
    });
  }

  async draw(intention = '') {
    if (this.drawing) return null;
    const existing = this.readRecord();
    if (existing && this.recordMatchesCurrentScope(existing)) {
      this.data = existing;
      this.renderRevealed(false);
      return existing.id;
    }
    const account = this.accountActive();
    if (account && navigator.onLine === false) {
      announce('Reconecte para confirmar a Carta do Dia desta conta. Se ela já tiver sido aberta neste aparelho, continuará disponível offline.');
      return null;
    }

    this.drawing = true;
    const sanctuary = this.root.querySelector('[data-daily-sanctuary]');
    const orb = this.root.querySelector('[data-daily-orb]');
    sanctuary?.setAttribute('aria-busy', 'true');
    sanctuary?.classList.add('is-opening');
    if (orb) orb.disabled = true;
    globalThis.dispatchEvent?.(new CustomEvent('whit:whisper', {
      detail:{ phrase:'Só existe uma carta para hoje. Eu vou ficar por perto, sem decidir o significado por você.' }
    }));

    try {
      const identity = await this.identityPromise;
      let record = null;

      if (account) {
        if (!this.authClient?.enabled || typeof this.authClient.dailyCard !== 'function') throw new Error('account-daily-unavailable');
        const remote = await this.authClient.dailyCard();
        if (!remote?.ok) throw new Error('account-daily-unconfirmed');
        record = createAccountDailyRecord(remote.body, intention);
      } else {
        record = createDailyRecord(intention, new Date(), identity);
      }
      const concurrent = this.readRecord(record.date);
      this.data = concurrent || record;
      if (!concurrent) this.saveRecord(record);

      if (!reduceMotion()) await wait(520);
      this.renderRevealed(true);
      return this.data.id;
    } catch {
      sanctuary?.classList.remove('is-opening');
      sanctuary?.removeAttribute('aria-busy');
      if (orb) orb.disabled = false;
      announce('A Carta do Dia não abriu agora. Nada foi trocado; toque novamente.');
      return null;
    } finally {
      this.drawing = false;
    }
  }

  renderRevealed(animate = false) {
    if (!isDailyRecord(this.data, brasiliaDate())) {
      this.data = null;
      this.render();
      return;
    }

    const card = CARDS[this.data.id];
    if (!card || card.orientation !== 'normal') {
      this.data = null;
      this.render();
      announce('A carta recebida não pertence ao catálogo normal das 78 cartas.');
      return;
    }

    const meaning = dailyMeaning(card);
    const layers = layerDefinitions(meaning);
    const active = layers.find(layer => layer.id === this.activeLayer) || layers[0];
    const keywords = (meaning.keywords || []).slice(0, 4);
    const date = this.data.date;
    const account = this.data.selectionVersion === DAILY_ACCOUNT_SELECTION_VERSION;

    this.root.innerHTML = `
      <section class="dw303 dw303--revealed" aria-labelledby="dw303Title">
        <header class="dw303__head">
          <div><span>ENCONTRO DE HOJE</span><h2 id="dw303Title">Carta do Dia</h2></div>
          <time datetime="${date}">${safe(dateLabel(date))}</time>
        </header>

        <div class="dw303__sanctuary dw303__sanctuary--open${animate ? ' is-born' : ''}">
          ${stars()}
          <div class="dw303__breath" aria-hidden="true"></div>
          <div class="dw303__card" tabindex="0" aria-label="${safe(card.name)}, carta do dia, direta">
            ${cardImageMarkup(card, { alt:`${card.name}, direta`, priority:'high' })}
          </div>
          <button class="dw303__orb dw303__orb--after" type="button" data-daily-pulse aria-label="Tocar a Orbe">
            <span class="dw303__orb-aura" aria-hidden="true"></span>
            <span class="dw303__orb-image" data-orb-surface="daily"></span>
          </button>
          <div class="dw303__identity">
            <span>DIRETA</span>
            <h3>${safe(card.name)}</h3>
            ${keywords.length ? `<p>${keywords.map(safe).join(' · ')}</p>` : ''}
          </div>
          ${this.data.intention ? `<p class="dw303__private">“${safe(this.data.intention)}”</p>` : ''}
        </div>

        <nav class="dw303__constellation" aria-label="Explorar camadas da carta">
          ${layers.map(layer => `<button type="button" data-daily-layer="${layer.id}" aria-pressed="${layer.id === active.id}"><span>✦</span>${layer.label}</button>`).join('')}
        </nav>

        <article class="dw303__layer" data-daily-layer-panel aria-live="polite">
          <span>${active.label}</span>
          ${active.parts.map(part => `<p>${safe(part)}</p>`).join('')}
        </article>

        <footer class="dw303__actions">
          <button type="button" data-daily-save>Guardar no Diário</button>
          <button type="button" data-daily-whit>Whit, fica comigo nesta carta</button>
        </footer>
        <p class="dw303__source">${account ? 'Conta sincronizada · mesma carta nos seus dispositivos' : 'Este dispositivo · disponível offline'} · novo ciclo à meia-noite de Brasília</p>
      </section>`;

    this.root.querySelectorAll('[data-daily-layer]').forEach(button => button.addEventListener('click', () => {
      this.activeLayer = button.dataset.dailyLayer;
      this.renderRevealed(false);
      requestAnimationFrame(() => this.root.querySelector('[data-daily-layer-panel]')?.scrollIntoView({ behavior:reduceMotion() ? 'auto' : 'smooth', block:'nearest' }));
    }));

    this.root.querySelector('[data-daily-pulse]')?.addEventListener('click', event => {
      const button = event.currentTarget;
      button.classList.remove('is-pulsing');
      requestAnimationFrame(() => button.classList.add('is-pulsing'));
    });

    this.root.querySelector('[data-daily-whit]')?.addEventListener('click', () => {
      const phrase = WHIT_AFTER_REVEAL[Math.floor(Math.random() * WHIT_AFTER_REVEAL.length)](card);
      globalThis.dispatchEvent?.(new CustomEvent('whit:whisper', { detail:{ phrase } }));
    });

    const saveButton = this.root.querySelector('[data-daily-save]');
    saveButton?.addEventListener('click', async () => {
      saveButton.disabled = true;
      try {
        await Promise.resolve(this.onSave({
          title:`Carta do Dia — ${card.name}`,
          text:`${meaning.dailyEnergy}\n\n${meaning.essence}\n\n${meaning.advice}\n\nAção possível: ${meaning.action}`,
          question:this.data.intention || meaning.reflectionQuestion,
          tags:`carta do dia, ${card.suit}`,
          mood:'Reflexiva',
          cardId:card.id,
          type:'daily',
          orientation:'normal'
        }));
        saveButton.textContent = 'Guardada no Diário';
        announce('Sua Carta do Dia foi guardada no Diário.');
      } catch {
        saveButton.disabled = false;
        announce('Não foi possível guardar agora. Sua carta continua aberta.');
      }
    });

    if (animate) {
      const phrase = WHIT_AFTER_REVEAL[Math.floor(Math.random() * WHIT_AFTER_REVEAL.length)](card);
      setTimeout(() => globalThis.dispatchEvent?.(new CustomEvent('whit:whisper', { detail:{ phrase } })), reduceMotion() ? 50 : 1100);
    }
  }

  destroy() {
    clearTimeout(this.timer);
    this.abort.abort();
    try { this.unsubAuth?.(); } catch {}
    this.root.classList.remove('daily-world-v303-host');
  }
}
