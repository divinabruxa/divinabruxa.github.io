/* DIVINA BRUXA — CARTA DO DIA 2.0 · V216
   Ritual diário: toque explícito, singularidade curta, uma carta por ciclo de Brasília,
   significado profundo em camadas e Whit somente por escolha da pessoa. */

import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup, prepareCardImage } from './tarot-image-runtime.js?v=182';
import { dailyMeaning } from './daily-meaning-runtime.js?v=183';
import {
  DAILY_STORAGE_KEY,
  DAILY_HISTORY_KEY,
  DAILY_TIME_ZONE,
  appendDailyHistory,
  brasiliaDate,
  createAccountDailyRecord,
  createDeviceDailyRecord,
  cycleLabel,
  deviceDailyIdentity,
  isDailyRecord,
  nextBrasiliaBoundary,
  normalizeDailyHistory
} from './daily-policy-v216.js?v=216';

const WHIT_DRAFT_KEY = 'whit-draft-v190';
const DAILY_STATES = Object.freeze({
  READY:'Ready',
  REVEALING:'Revealing',
  REVEALED:'Revealed',
  ERROR:'Error'
});
const REVEAL_MIN_MS = 190;
const IMAGE_BUDGET_MS = 1800;
const safe = value => escapeHTML(value ?? '');
const wait = ms => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));
const announce = message => globalThis.dispatchEvent?.(new CustomEvent('orbe:toast', { detail:message }));

function installStyles() {
  if (document.getElementById('dailyV216Styles')) return;
  const style = document.createElement('style');
  style.id = 'dailyV216Styles';
  style.textContent = `
  [data-daily-version="216"]{--d216-gold:#e8cb88;--d216-ink:#fbf6ff;--d216-muted:#c9bdd2;--d216-line:rgba(226,201,255,.2);--d216-panel:rgba(13,7,27,.82);position:relative;isolation:isolate}
  [data-daily-version="216"] .daily216-ready{min-height:min(670px,72vh);display:grid;place-items:center;align-content:center;gap:18px;text-align:center;padding:30px 12px}
  [data-daily-version="216"] .daily216-kicker{margin:0;color:var(--d216-gold);font:700 11px/1.4 system-ui;letter-spacing:.18em;text-transform:uppercase}
  [data-daily-version="216"] .daily216-title{margin:0;max-width:650px;color:var(--d216-ink);font:500 clamp(27px,6vw,46px)/1.05 Georgia,serif}
  [data-daily-version="216"] .daily216-copy{max-width:520px;margin:0;color:var(--d216-muted);font:400 15px/1.65 system-ui}
  [data-daily-version="216"] .daily216-orb{position:relative;display:grid;place-items:center;width:clamp(176px,48vw,238px);aspect-ratio:1;border:0;border-radius:50%;padding:0;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
  [data-daily-version="216"] .daily216-orb:focus-visible{outline:2px solid var(--d216-gold);outline-offset:9px}
  [data-daily-version="216"] .daily216-orb .ritual-breathe{position:absolute;inset:0;display:grid;place-items:center;border-radius:50%;filter:drop-shadow(0 20px 42px rgba(0,0,0,.48))}
  [data-daily-version="216"] .daily216-orb .ritual-breathe>span{display:block;width:100%;height:100%;border-radius:50%;background-position:center;background-repeat:no-repeat;background-size:cover;animation:daily216-breathe 4.8s ease-in-out infinite}
  [data-daily-version="216"] .daily216-orb::before{content:"";position:absolute;inset:-12%;border-radius:50%;background:radial-gradient(circle,rgba(196,131,255,.18),transparent 66%);filter:blur(12px);pointer-events:none;animation:daily216-aura 4.8s ease-in-out infinite}
  [data-daily-version="216"] .daily216-orb-label{position:absolute;inset:auto 10% -28px;color:var(--d216-gold);font:700 11px/1.3 system-ui;letter-spacing:.14em;text-transform:uppercase}
  [data-daily-version="216"][data-daily-state="Revealing"] .daily216-ready{min-height:min(670px,72vh)}
  [data-daily-version="216"] .daily216-singularity{position:absolute;inset:50% auto auto 50%;width:min(62vw,300px);aspect-ratio:1;translate:-50% -50%;border-radius:50%;pointer-events:none;opacity:0;background:conic-gradient(from 40deg,transparent 0 16%,rgba(230,202,255,.48) 23%,rgba(121,57,178,.15) 37%,transparent 50%,rgba(248,214,139,.42) 69%,transparent 83%);mask-image:radial-gradient(circle,transparent 0 10%,#000 18% 58%,transparent 74%);filter:blur(1.2px) drop-shadow(0 0 34px rgba(169,94,255,.35))}
  [data-daily-version="216"][data-daily-state="Revealing"] .daily216-singularity{animation:daily216-singularity 280ms cubic-bezier(.2,.9,.2,1) both}
  [data-daily-version="216"] .daily216-reveal{display:grid;gap:18px;width:min(900px,100%);margin:0 auto;padding:12px 0 34px}
  [data-daily-version="216"] .daily216-hero{display:grid;grid-template-columns:minmax(210px,340px) minmax(0,1fr);gap:clamp(22px,5vw,56px);align-items:center;padding:clamp(16px,3vw,28px);border:1px solid var(--d216-line);border-radius:30px;background:radial-gradient(circle at 18% 20%,rgba(124,66,186,.2),transparent 42%),linear-gradient(145deg,rgba(26,15,48,.91),rgba(8,4,18,.96));box-shadow:0 28px 72px rgba(0,0,0,.32)}
  [data-daily-version="216"] .daily216-card{position:relative}
  [data-daily-version="216"] .daily216-card picture,[data-daily-version="216"] .daily216-card img{display:block;width:100%;height:auto;aspect-ratio:2/3;object-fit:cover;border-radius:20px;box-shadow:0 20px 46px rgba(0,0,0,.48),0 0 0 1px rgba(239,216,255,.12)}
  [data-daily-version="216"] .daily216-card.is-born{animation:daily216-born 520ms cubic-bezier(.16,1,.3,1) both}
  [data-daily-version="216"] .daily216-essence{display:grid;gap:13px;align-content:center}
  [data-daily-version="216"] .daily216-essence h3{margin:0;color:var(--d216-ink);font:500 clamp(30px,5vw,48px)/1.02 Georgia,serif}
  [data-daily-version="216"] .daily216-keywords{display:flex;flex-wrap:wrap;gap:7px;margin:0;padding:0;list-style:none}
  [data-daily-version="216"] .daily216-keywords li{padding:6px 9px;border:1px solid var(--d216-line);border-radius:999px;background:rgba(95,55,132,.18);color:#e3d7ec;font:600 11px/1.2 system-ui}
  [data-daily-version="216"] .daily216-essence>p{margin:0;color:#eadff0;font:400 16px/1.72 system-ui}
  [data-daily-version="216"] .daily216-cycle{color:var(--d216-muted)!important;font-size:12px!important}
  [data-daily-version="216"] .daily216-layers{display:grid;gap:9px}
  [data-daily-version="216"] .daily216-layers>h4{margin:14px 3px 2px;color:var(--d216-ink);font:500 25px/1.15 Georgia,serif}
  [data-daily-version="216"] .daily216-layer{border:1px solid var(--d216-line);border-radius:18px;background:var(--d216-panel);overflow:clip}
  [data-daily-version="216"] .daily216-layer summary{min-height:54px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 15px;color:var(--d216-ink);cursor:pointer;font:700 13px/1.35 system-ui;letter-spacing:.045em;list-style:none}
  [data-daily-version="216"] .daily216-layer summary::-webkit-details-marker{display:none}
  [data-daily-version="216"] .daily216-layer summary::after{content:"＋";color:var(--d216-gold);font-size:18px;font-weight:400}
  [data-daily-version="216"] .daily216-layer[open] summary::after{content:"−"}
  [data-daily-version="216"] .daily216-layer-body{display:grid;gap:10px;padding:0 15px 16px;color:#d9cfdf;font:400 15px/1.72 system-ui}
  [data-daily-version="216"] .daily216-layer-body p{margin:0}
  [data-daily-version="216"] .daily216-reflection{display:grid;gap:10px;padding:19px;border:1px solid rgba(232,203,136,.28);border-radius:22px;background:linear-gradient(135deg,rgba(91,49,126,.28),rgba(16,8,31,.92))}
  [data-daily-version="216"] .daily216-reflection b{color:var(--d216-gold);font:700 11px/1.4 system-ui;letter-spacing:.15em}
  [data-daily-version="216"] .daily216-reflection p{margin:0;color:var(--d216-ink);font:500 clamp(19px,4vw,26px)/1.35 Georgia,serif}
  [data-daily-version="216"] .daily216-actions{display:flex;flex-wrap:wrap;gap:9px}
  [data-daily-version="216"] .daily216-actions button{min-height:48px;padding:10px 16px;border-radius:999px;border:1px solid rgba(232,203,136,.33);background:rgba(28,15,43,.9);color:#f3e4bc;font:700 12px/1.2 system-ui;cursor:pointer}
  [data-daily-version="216"] .daily216-actions button.primary{background:linear-gradient(135deg,#60407c,#2b163d);border-color:rgba(232,203,136,.58)}
  [data-daily-version="216"] .daily216-whit{padding:15px;border:1px solid rgba(201,160,255,.25);border-radius:18px;background:rgba(16,8,30,.94)}
  [data-daily-version="216"] .daily216-whit[hidden]{display:none}
  [data-daily-version="216"] .daily216-whit p{margin:0 0 12px;color:var(--d216-muted);font:400 13px/1.55 system-ui}
  [data-daily-version="216"] .daily216-whit strong{color:var(--d216-ink)}
  [data-daily-version="216"] .daily216-history{border:1px solid var(--d216-line);border-radius:20px;background:rgba(9,5,19,.78);overflow:clip}
  [data-daily-version="216"] .daily216-history summary{padding:15px 17px;cursor:pointer;color:var(--d216-gold);font:700 12px/1.3 system-ui;letter-spacing:.08em}
  [data-daily-version="216"] .daily216-history-list{display:grid;gap:0;padding:0 16px 14px}
  [data-daily-version="216"] .daily216-history-row{display:grid;grid-template-columns:auto 1fr;gap:10px;padding:10px 0;border-top:1px solid rgba(226,201,255,.09)}
  [data-daily-version="216"] .daily216-history-row time{color:var(--d216-muted);font:600 11px/1.4 system-ui}
  [data-daily-version="216"] .daily216-history-row b{color:var(--d216-ink);font:500 14px/1.4 Georgia,serif}
  [data-daily-version="216"] .daily216-history-note{margin:0;padding:4px 0 8px;color:var(--d216-muted);font:400 12px/1.5 system-ui}
  [data-daily-version="216"] .daily216-error{min-height:420px;display:grid;place-items:center;align-content:center;gap:12px;text-align:center;padding:28px}
  [data-daily-version="216"] .daily216-error h3{margin:0;color:var(--d216-ink);font:500 30px/1.1 Georgia,serif}
  [data-daily-version="216"] .daily216-error p{max-width:520px;margin:0;color:var(--d216-muted);line-height:1.6}
  [data-daily-version="216"] .daily216-error button{min-height:48px;padding:10px 18px;border:1px solid rgba(232,203,136,.55);border-radius:999px;background:#281439;color:#f4dfad;font-weight:700}
  @keyframes daily216-breathe{0%,100%{transform:scale(.985);filter:saturate(.98) brightness(.98)}50%{transform:scale(1.025);filter:saturate(1.08) brightness(1.06)}}
  @keyframes daily216-aura{0%,100%{opacity:.55;transform:scale(.96)}50%{opacity:.9;transform:scale(1.04)}}
  @keyframes daily216-singularity{0%{opacity:0;transform:rotate(0deg) scale(.6)}35%{opacity:1}100%{opacity:0;transform:rotate(200deg) scale(1.18)}}
  @keyframes daily216-born{0%{opacity:0;transform:translateY(12px) scale(.96);filter:blur(4px)}70%{opacity:1;transform:translateY(-2px) scale(1.008);filter:blur(0)}100%{transform:none}}
  @media(max-width:700px){[data-daily-version="216"] .daily216-hero{grid-template-columns:1fr;justify-items:center;text-align:center}[data-daily-version="216"] .daily216-card{width:min(78vw,320px)}[data-daily-version="216"] .daily216-essence{justify-items:center}[data-daily-version="216"] .daily216-keywords{justify-content:center}[data-daily-version="216"] .daily216-actions{justify-content:center}}
  @media(prefers-reduced-motion:reduce){[data-daily-version="216"] .daily216-orb .ritual-breathe>span,[data-daily-version="216"] .daily216-orb::before,[data-daily-version="216"][data-daily-state="Revealing"] .daily216-singularity,[data-daily-version="216"] .daily216-card.is-born{animation:none!important}}
  `;
  document.head.append(style);
}

const shortEssence = value => {
  const text = String(value || '').trim();
  if (!text) return '';
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let result = '';
  for (const sentence of sentences) {
    if (result && (result + sentence).length > 360) break;
    result += sentence.trim() + ' ';
    if (result.trim().length >= 170) break;
  }
  result = result.trim();
  if (result.length <= 380) return result;
  return `${result.slice(0, 377).replace(/\s+\S*$/, '')}…`;
};

const pairBody = (labelA, textA, labelB, textB) => {
  const parts = [];
  if (textA) parts.push(`<p><strong>${safe(labelA)}:</strong> ${safe(textA)}</p>`);
  if (textB) parts.push(`<p><strong>${safe(labelB)}:</strong> ${safe(textB)}</p>`);
  return parts.join('');
};

const layer = (title, body, open = false) => body
  ? `<details class="daily216-layer"${open ? ' open' : ''}><summary>${safe(title)}</summary><div class="daily216-layer-body">${body}</div></details>`
  : '';

const dateLabel = date => {
  const [year, month, day] = String(date).split('-').map(Number);
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone:DAILY_TIME_ZONE,
      day:'2-digit',
      month:'short',
      year:'numeric'
    }).format(new Date(Date.UTC(year, month - 1, day, 15)));
  } catch {
    return date;
  }
};

async function purgeLegacyOfflineCopy() {
  if (!globalThis.caches?.open) return;
  try {
    const cache = await caches.open('divina-bruxa-v208-tarot-offline');
    const scope = globalThis.location?.href || 'https://divinabruxa.com.br/';
    await cache.delete(new Request(new URL('./ritual-engine.js', scope)), { ignoreSearch:true });
  } catch {}
}

export class DailyRitual {
  constructor(root, onSave, { authClient = globalThis.divinaAuth } = {}) {
    if (!root) throw new TypeError('O espaço da Carta do Dia não foi encontrado.');
    installStyles();
    purgeLegacyOfflineCopy();

    this.root = root;
    this.root.dataset.dailyVersion = '216';
    this.onSave = typeof onSave === 'function' ? onSave : () => undefined;
    this.authClient = authClient;
    this.data = null;
    this.memoryRecord = null;
    this.history = [];
    this.drawing = false;
    this.cycleTimer = 0;
    this.destroyed = false;
    this.authUnsubscribe = null;
    this.deviceIdentity = deviceDailyIdentity();

    this.archiveStaleStoredRecord();
    this.data = this.readRecord();

    this.onStorage = event => {
      if (!event.key?.endsWith(`:${DAILY_STORAGE_KEY}`) || !event.newValue) return;
      let incoming = null;
      try { incoming = JSON.parse(event.newValue); } catch { return; }
      if (!isDailyRecord(incoming, brasiliaDate()) || !this.recordMatchesMode(incoming)) return;
      this.memoryRecord = incoming;
      this.data = incoming;
      this.reveal(false);
    };

    this.onVisibility = () => {
      if (document.visibilityState === 'visible') this.refreshCycle();
    };

    globalThis.addEventListener?.('storage', this.onStorage);
    document.addEventListener?.('visibilitychange', this.onVisibility);

    if (typeof this.authClient?.onAuthStateChange === 'function') {
      this.authUnsubscribe = this.authClient.onAuthStateChange(() => {
        const next = this.readRecord();
        this.data = next;
        if (next) this.reveal(false);
        else this.renderReady();
      });
    }

    this.scheduleNextCycle();
    if (this.data) this.reveal(false);
    else this.renderReady();
  }

  accountMode() {
    return Boolean(this.authClient?.session?.access_token);
  }

  recordMatchesMode(record) {
    return this.accountMode()
      ? record?.identityScope === 'account'
      : record?.identityScope !== 'account';
  }

  setState(state) {
    if (!Object.values(DAILY_STATES).includes(state)) return;
    this.root.dataset.dailyState = state;
    if (state === DAILY_STATES.REVEALING) this.root.setAttribute('aria-busy', 'true');
    else this.root.removeAttribute('aria-busy');
  }

  readRecord(date = brasiliaDate()) {
    let stored = null;
    try { stored = store.get(DAILY_STORAGE_KEY); } catch {}
    if (isDailyRecord(stored, date) && this.recordMatchesMode(stored)) return stored;
    if (isDailyRecord(this.memoryRecord, date) && this.recordMatchesMode(this.memoryRecord)) return this.memoryRecord;
    return null;
  }

  localHistory() {
    try { return normalizeDailyHistory(store.get(DAILY_HISTORY_KEY, [])); }
    catch { return []; }
  }

  saveHistory(history) {
    try { store.set(DAILY_HISTORY_KEY, normalizeDailyHistory(history)); return true; }
    catch { return false; }
  }

  archiveRecord(record) {
    if (!record?.date || !Number.isInteger(record?.id)) return;
    const next = appendDailyHistory(this.localHistory(), record);
    this.saveHistory(next);
  }

  archiveStaleStoredRecord() {
    let stored = null;
    try { stored = store.get(DAILY_STORAGE_KEY); } catch {}
    if (!stored?.date || stored.date === brasiliaDate()) return;
    if (isDailyRecord(stored, stored.date)) this.archiveRecord(stored);
    try { store.remove(DAILY_STORAGE_KEY); } catch {}
  }

  saveRecord(record) {
    this.memoryRecord = record;
    let persisted = false;
    try { store.set(DAILY_STORAGE_KEY, record); persisted = true; } catch {}
    if (!persisted) announce('Sua Carta do Dia continua nesta aba, mas este navegador bloqueou a retomada.');
    return persisted;
  }

  scheduleNextCycle() {
    globalThis.clearTimeout(this.cycleTimer);
    const delay = Math.max(1000, nextBrasiliaBoundary().getTime() - Date.now() + 120);
    this.cycleTimer = globalThis.setTimeout(() => {
      this.rollToNewCycle();
      this.scheduleNextCycle();
    }, delay);
  }

  rollToNewCycle() {
    const previous = this.data || this.memoryRecord;
    if (previous?.date && previous.date !== brasiliaDate()) this.archiveRecord(previous);
    this.data = null;
    this.memoryRecord = null;
    const stored = store.get(DAILY_STORAGE_KEY);
    if (stored?.date && stored.date !== brasiliaDate()) {
      if (isDailyRecord(stored, stored.date)) this.archiveRecord(stored);
      try { store.remove(DAILY_STORAGE_KEY); } catch {}
    }
    this.renderReady();
  }

  refreshCycle() {
    this.archiveStaleStoredRecord();
    const current = this.readRecord();
    if (current) {
      const changed = current.date !== this.data?.date || current.id !== this.data?.id;
      this.data = current;
      if (changed) this.reveal(false);
      return;
    }
    if (this.data?.date && this.data.date !== brasiliaDate()) this.archiveRecord(this.data);
    this.data = null;
    this.memoryRecord = null;
    this.renderReady();
  }

  renderReady() {
    if (this.destroyed) return;
    this.setState(DAILY_STATES.READY);
    const account = this.accountMode();
    const syncCopy = account
      ? 'Na sua conta, a mesma carta permanece em todos os dispositivos até a meia-noite de Brasília.'
      : 'Como visitante, este aparelho guarda o seu ciclo. Entre na conta para sincronizar entre dispositivos.';
    this.root.innerHTML = `
      <section class="daily216-ready" aria-labelledby="daily216ReadyTitle">
        <p class="daily216-kicker">CARTA DO DIA · ${safe(brasiliaDate())}</p>
        <h3 id="daily216ReadyTitle" class="daily216-title">Sua Carta do Dia está esperando.</h3>
        <button type="button" class="daily216-orb" data-daily-reveal aria-label="Tocar na Orbe para revelar a Carta do Dia">
          <span class="ritual-breathe" aria-hidden="true"><span></span></span>
          <span class="daily216-orb-label">REVELAR MINHA CARTA</span>
        </button>
        <p class="daily216-copy">${safe(syncCopy)}</p>
        <p class="daily216-copy">A carta só nasce com o seu toque. Não há invertidas e atualizar a página não troca o ciclo.</p>
        <span class="daily216-singularity" aria-hidden="true"></span>
      </section>`;
    this.root.querySelector('[data-daily-reveal]')?.addEventListener('click', event => this.draw(event.currentTarget));
  }

  renderRevealing() {
    this.setState(DAILY_STATES.REVEALING);
    this.root.innerHTML = `
      <section class="daily216-ready" aria-label="A Carta do Dia está atravessando a Orbe">
        <p class="daily216-kicker">A ORBE ABRIU O CAMINHO</p>
        <h3 class="daily216-title">A carta atravessa o instante.</h3>
        <div class="daily216-orb" aria-hidden="true">
          <span class="ritual-breathe"><span></span></span>
        </div>
        <p class="daily216-copy" role="status" aria-live="polite">Mantendo o ciclo de Brasília estável…</p>
        <span class="daily216-singularity" aria-hidden="true"></span>
      </section>`;
  }

  async draw(trigger) {
    if (this.drawing) return null;
    const existing = this.readRecord();
    if (existing) {
      this.data = existing;
      this.reveal(false);
      return existing.id;
    }

    const account = this.accountMode();
    if (account && navigator.onLine === false) {
      this.renderError(
        'Sua carta da conta ainda não foi revelada neste aparelho.',
        'Conecte-se para confirmar a mesma Carta do Dia que pertence à sua conta. Depois da primeira abertura, ela fica disponível offline neste ciclo.'
      );
      return null;
    }

    this.drawing = true;
    const startedAt = performance?.now?.() ?? Date.now();
    this.renderRevealing();

    try {
      let record = null;
      if (account) {
        if (typeof this.authClient?.dailyCard !== 'function') throw new Error('daily-account-bridge-missing');
        const remote = await this.authClient.dailyCard();
        if (!remote?.ok) throw new Error(remote?.message || 'daily-account-unavailable');
        record = createAccountDailyRecord(remote.body);
      } else {
        record = createDeviceDailyRecord(new Date(), this.deviceIdentity);
      }

      const concurrent = this.readRecord(record.date);
      const finalRecord = concurrent || record;
      const card = CARDS[finalRecord.id];
      if (!card || card.orientation !== 'normal') throw new Error('daily-card-invalid');

      const elapsed = (performance?.now?.() ?? Date.now()) - startedAt;
      await Promise.all([
        wait(Math.max(0, REVEAL_MIN_MS - elapsed)),
        prepareCardImage(card, { timeout:IMAGE_BUDGET_MS, priority:'high' }).catch(() => 'fallback')
      ]);

      this.data = finalRecord;
      if (!concurrent) this.saveRecord(finalRecord);
      this.reveal(true);
      return finalRecord.id;
    } catch (error) {
      console.error('[Divina] Carta do Dia V216', error);
      this.renderError(
        'A passagem não conseguiu confirmar sua carta.',
        account
          ? 'Sua conta não recebeu uma carta alternativa. Tente novamente quando a conexão segura responder.'
          : 'Nenhum ciclo foi perdido. Toque novamente para abrir a carta deste aparelho.'
      );
      return null;
    } finally {
      this.drawing = false;
    }
  }

  renderError(title, message) {
    this.setState(DAILY_STATES.ERROR);
    this.root.innerHTML = `
      <section class="daily216-error" role="alert">
        <p class="daily216-kicker">CARTA DO DIA · PASSAGEM PRESERVADA</p>
        <h3>${safe(title)}</h3>
        <p>${safe(message)}</p>
        <button type="button" data-daily-retry>Tentar novamente</button>
      </section>`;
    this.root.querySelector('[data-daily-retry]')?.addEventListener('click', () => this.renderReady());
  }

  meaningLayers(meaning) {
    return [
      layer('Emoções & afeto', `<p>${safe(meaning.love)}</p>`),
      layer('Relações', `<p>${safe(meaning.relationships)}</p>`),
      layer('Trabalho & matéria', pairBody('Trabalho', meaning.career, 'Dinheiro', meaning.money)),
      layer('Mente & consciência', pairBody('Essência', meaning.essence, 'Luz', meaning.light)),
      layer('Espírito', `<p>${safe(meaning.spirituality)}</p>`),
      layer('Ponto de atenção', `<p>${safe(meaning.tension)}</p>`),
      layer('Orientação', pairBody('Conselho', meaning.advice, 'Ação possível', meaning.action)),
      meaning.symbols?.length
        ? layer('Símbolos da carta', meaning.symbols.map(item => `<p>✦ ${safe(item)}</p>`).join(''))
        : '',
      layer('Leitura responsável', `<p>${safe(meaning.responsibleNotice)}</p>`)
    ].join('');
  }

  reveal(animate = false) {
    if (!this.data || !isDailyRecord(this.data, brasiliaDate()) || !this.recordMatchesMode(this.data)) {
      this.data = null;
      return this.renderReady();
    }

    const card = CARDS[this.data.id];
    if (!card || card.orientation !== 'normal') {
      return this.renderError('A carta não pôde ser confirmada.', 'A Carta do Dia aceita somente cartas oficiais em orientação normal.');
    }

    const meaning = dailyMeaning(card);
    const keywords = (meaning.keywords || []).slice(0, 5);
    const essence = shortEssence(meaning.dailyEnergy || meaning.essence);
    const account = this.data.identityScope === 'account';
    const scopeCopy = account
      ? 'Ciclo confirmado pela sua conta. Trocar de aparelho ou atualizar a página não gera outra carta.'
      : 'Ciclo guardado neste aparelho. A sincronização entre dispositivos só existe quando você entra na sua conta.';

    this.setState(DAILY_STATES.REVEALED);
    this.root.innerHTML = `
      <section class="daily216-reveal" aria-labelledby="daily216CardTitle">
        <article class="daily216-hero">
          <div class="daily216-card${animate ? ' is-born' : ''}">
            ${cardImageMarkup(card, { alt:`${card.name}, Carta do Dia, orientação normal`, priority:'high' })}
          </div>
          <div class="daily216-essence">
            <p class="daily216-kicker">SUA CARTA DO DIA · DIRETA</p>
            <h3 id="daily216CardTitle">${safe(card.name)}</h3>
            ${keywords.length ? `<ul class="daily216-keywords" aria-label="Palavras-chave">${keywords.map(word => `<li>${safe(word)}</li>`).join('')}</ul>` : ''}
            <p>${safe(essence)}</p>
            <p class="daily216-cycle">Ciclo de ${safe(cycleLabel(this.data.date))}. ${safe(scopeCopy)}</p>
          </div>
        </article>

        <section class="daily216-layers" aria-labelledby="daily216LayersTitle">
          <h4 id="daily216LayersTitle">Abra somente o que quiser aprofundar.</h4>
          ${this.meaningLayers(meaning)}
        </section>

        <aside class="daily216-reflection">
          <b>PERGUNTA PARA O DIA</b>
          <p>${safe(meaning.reflectionQuestion)}</p>
        </aside>

        <div class="daily216-actions" aria-label="Ações da Carta do Dia">
          <button type="button" class="primary" data-daily-journal>Guardar reflexão no Diário</button>
          <button type="button" data-daily-whit>Refletir com Whit</button>
          <button type="button" data-daily-reminder>Configurar lembrete diário</button>
        </div>

        <aside class="daily216-whit" data-daily-whit-confirm hidden>
          <p><strong>Whit só receberá o que você escolher.</strong><br>Será preparado um rascunho com esta carta, a data do ciclo e a essência pública. Diário, histórico e outros dados não entram. Nada é enviado até você revisar e consentir dentro da Whit.</p>
          <div class="daily216-actions">
            <button type="button" class="primary" data-daily-whit-confirm-button>Preparar esta carta para Whit</button>
            <button type="button" data-daily-whit-cancel>Cancelar</button>
          </div>
        </aside>

        <details class="daily216-history">
          <summary>Histórico das Cartas do Dia</summary>
          <div class="daily216-history-list" data-daily-history>
            <p class="daily216-history-note">Carregando seus ciclos anteriores…</p>
          </div>
        </details>
      </section>`;

    this.bindRevealedActions(card, meaning);
    this.refreshHistory();
  }

  bindRevealedActions(card, meaning) {
    const journal = this.root.querySelector('[data-daily-journal]');
    journal?.addEventListener('click', async () => {
      if (journal.disabled) return;
      journal.disabled = true;
      try {
        await Promise.resolve(this.onSave({
          title:`Carta do Dia — ${card.name}`,
          text:`${meaning.dailyEnergy}\n\n${meaning.essence}\n\n${meaning.advice}\n\nAção possível: ${meaning.action}`,
          question:meaning.reflectionQuestion,
          tags:`carta do dia, ${card.suit}`,
          mood:'Reflexiva',
          cardId:card.id,
          type:'daily',
          orientation:'normal'
        }));
        journal.textContent = 'Guardada no Diário';
        announce('Sua reflexão da Carta do Dia foi guardada no Diário.');
      } catch {
        journal.disabled = false;
        announce('Não foi possível guardar agora. Sua Carta do Dia continua aberta.');
      }
    });

    const whitButton = this.root.querySelector('[data-daily-whit]');
    const whitPanel = this.root.querySelector('[data-daily-whit-confirm]');
    whitButton?.addEventListener('click', () => {
      whitPanel.hidden = false;
      this.root.querySelector('[data-daily-whit-confirm-button]')?.focus({ preventScroll:true });
    });
    this.root.querySelector('[data-daily-whit-cancel]')?.addEventListener('click', () => {
      whitPanel.hidden = true;
      whitButton?.focus({ preventScroll:true });
    });
    this.root.querySelector('[data-daily-whit-confirm-button]')?.addEventListener('click', () => {
      const text = [
        `Quero refletir sobre a minha Carta do Dia de ${dateLabel(this.data.date)}.`,
        `Carta: ${card.name} (direta).`,
        `Essência do ciclo: ${shortEssence(meaning.essence || meaning.dailyEnergy)}`,
        `Pergunta para reflexão: ${meaning.reflectionQuestion}`,
        'Ajude-me a explorar possibilidades sem tratar esta carta como destino, certeza ou previsão factual.'
      ].join('\n');
      store.set(WHIT_DRAFT_KEY, { text:text.slice(0, 5000), source:'message', at:new Date().toISOString() });
      try {
        globalThis.whit?.rememberSession?.('daily:last-shared-card', {
          date:this.data.date,
          cardId:card.id,
          canonicalId:card.canonicalId,
          orientation:'normal'
        });
      } catch {}
      announce('A carta foi preparada para revisão na Whit. Nada foi enviado ainda.');
      globalThis.orbe?.go?.('ai');
    });

    this.root.querySelector('[data-daily-reminder]')?.addEventListener('click', () => {
      announce('Abra Notificações para escolher se quer receber o lembrete. A carta nunca será revelada na notificação.');
      globalThis.orbe?.go?.('notifications');
    });
  }

  async refreshHistory() {
    const target = this.root.querySelector('[data-daily-history]');
    if (!target) return;

    let history = this.localHistory();
    const today = brasiliaDate();

    if (this.accountMode() && navigator.onLine !== false && typeof this.authClient?.restRequest === 'function') {
      try {
        const response = await this.authClient.restRequest(
          'daily_cards?select=card_id,local_date,timezone,revealed_at&order=local_date.desc&limit=31'
        );
        if (response?.ok && Array.isArray(response.body)) {
          const remote = response.body.map(row => {
            try { return createAccountDailyRecord(row); } catch { return null; }
          }).filter(Boolean);
          history = normalizeDailyHistory(remote);
          this.saveHistory([...remote, ...this.localHistory()]);
        }
      } catch {}
    }

    const visible = normalizeDailyHistory(history)
      .filter(item => item.date !== today)
      .slice(0, 12);

    if (!visible.length) {
      target.innerHTML = '<p class="daily216-history-note">Seus ciclos anteriores aparecerão aqui, sem contagem de sequência e sem punição por dias em que você não abrir o app.</p>';
      return;
    }

    target.innerHTML = visible.map(item => {
      const card = CARDS[item.id];
      if (!card) return '';
      return `<div class="daily216-history-row"><time datetime="${safe(item.date)}">${safe(dateLabel(item.date))}</time><b>${safe(card.name)} · direta</b></div>`;
    }).join('') + '<p class="daily216-history-note">Histórico para memória e reflexão — sem streak, ranking ou punição.</p>';
  }

  destroy() {
    this.destroyed = true;
    globalThis.clearTimeout(this.cycleTimer);
    globalThis.removeEventListener?.('storage', this.onStorage);
    document.removeEventListener?.('visibilitychange', this.onVisibility);
    try { this.authUnsubscribe?.(); } catch {}
  }
}
