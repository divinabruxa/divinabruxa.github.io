import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js';
import { brasiliaDate, createDailyRecord, isDailyRecord, DAILY_STORAGE_KEY } from './daily-policy.js';
import { dailyMeaning } from './daily-meaning-runtime.js';

const safe = value => escapeHTML(value ?? '');
const section = (title, body) => body ? `<article class="meaning-card"><span>${safe(title)}</span><p>${safe(body)}</p></article>` : '';

export class DailyRitual {
  constructor(root, onSave) {
    this.root = root;
    this.onSave = onSave;
    this.data = store.get(DAILY_STORAGE_KEY);
    if (this.data?.reversed) this.data = null;
    this.render();
  }

  render() {
    if (isDailyRecord(this.data)) return this.reveal(false);
    if (navigator.onLine === false) {
      this.root.innerHTML = `<p class="eyebrow">RITUAL DIÁRIO</p><h3>Sua próxima carta espera pela conexão.</h3><p>Offline, a Divina Bruxa permite rever uma carta já revelada. Conecte-se para realizar um novo ritual.</p>`;
      return;
    }
    this.root.innerHTML = `<div class="ritual-steps"><i class="on"></i><i></i><i></i></div><div class="ritual-breathe"><span></span></div><p class="eyebrow">PASSO 1 · RESPIRAR</p><h3>Chegue ao presente.</h3><p>Toque na Orbe, respire lentamente e deixe o agora se aproximar.</p><button class="primary" data-next>Começar ritual</button>`;
    this.root.querySelector('[data-next]').onclick = () => this.intention();
  }

  intention() {
    this.root.innerHTML = `<div class="ritual-steps"><i class="on"></i><i class="on"></i><i></i></div><p class="eyebrow">PASSO 2 · INTENÇÃO PRIVADA</p><h3>O que deseja compreender?</h3><p>Esta intenção permanece somente neste dispositivo e não aparece ao compartilhar a carta.</p><input id="dailyIntention" maxlength="120" autocomplete="off" placeholder="Uma palavra ou pergunta opcional"><button class="primary" data-draw>Despertar minha carta</button>`;
    this.root.querySelector('[data-draw]').onclick = () => {
      const existing = store.get(DAILY_STORAGE_KEY);
      if (isDailyRecord(existing)) {
        this.data = existing;
        this.reveal(false);
        return;
      }
      this.data = createDailyRecord(this.root.querySelector('#dailyIntention').value);
      store.set(DAILY_STORAGE_KEY, this.data);
      navigator.vibrate?.([18, 35, 24]);
      this.reveal(true);
    };
  }

  reveal(animate = false) {
    if (!isDailyRecord(this.data, brasiliaDate())) return this.render();
    const card = CARDS[this.data.id];
    const m = dailyMeaning(card);
    const keywords = m.keywords.map(safe).join(' · ');
    const symbols = m.symbols.length ? `<article class="meaning-card"><span>SÍMBOLOS</span>${m.symbols.map(item => `<p>✦ ${safe(item)}</p>`).join('')}</article>` : '';
    this.root.innerHTML = `<div class="ritual-steps"><i class="on"></i><i class="on"></i><i class="on"></i></div>${this.data.intention ? `<p class="intention">Sua intenção privada · ${safe(this.data.intention)}</p>` : ''}<div class="current daily-reveal ${animate ? 'birth' : ''}">${cardImageMarkup(card, { priority: 'high' })}</div><p class="eyebrow">SUA CARTA DO DIA · DIRETA</p><h3>${safe(card.name)}</h3><p class="keywords">${keywords}</p>${section('ESSÊNCIA', m.essence)}${section('LUZ', m.light)}${section('TENSÃO', m.tension)}${section('AMOR', m.love)}${section('RELACIONAMENTOS', m.relationships)}${section('CARREIRA', m.career)}${section('DINHEIRO', m.money)}${section('ESPIRITUALIDADE', m.spirituality)}${section('CONSELHO', m.advice)}${symbols}${section('PERGUNTA PARA O DIA', m.reflectionQuestion)}<button class="primary" data-save>Guardar no Diário</button><p class="free-rule">A carta permanece a mesma até a próxima data no fuso de Brasília.</p>`;
    this.root.querySelector('[data-save]').onclick = () => this.onSave({ title: `Carta do Dia — ${card.name}`, text: `${m.essence}\n\n${m.advice}`, question: this.data.intention || m.reflectionQuestion, tags: `carta do dia, ${card.suit}`, mood: 'Reflexiva', cardId: card.id, type: 'daily', orientation: 'normal' });
  }
}
