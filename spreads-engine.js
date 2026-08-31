import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js';
import { dailyMeaning } from './daily-meaning-runtime.js';
import { SPREADS, SPREAD_STORAGE_KEY, spreadById, validSpreadSession } from './spreads-policy.js';
import { synthesizeSpread } from './spread-synthesis.js';

const safe = value => escapeHTML(value ?? '');
const random = max => { const value = new Uint32Array(1); crypto.getRandomValues(value); return value[0] % max; };
const shuffledIds = () => { const ids = CARDS.map(card => card.id); for (let i = ids.length - 1; i; i -= 1) { const j = random(i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; } return ids; };

export class SpreadsEngine {
  constructor(grid, result, onSave) {
    this.grid = grid;
    this.result = result;
    this.onSave = onSave;
    this.session = store.get(SPREAD_STORAGE_KEY);
    this.renderMenu();
    if (validSpreadSession(this.session)) this.renderReading(true);
  }

  renderMenu() {
    this.grid.innerHTML = SPREADS.map(spread => `<button data-spread="${spread.id}"${spread.premium ? ' data-premium="true"' : ''}><h3>${safe(spread.name)}</h3><span>${safe(spread.description)}</span><small>${spread.positions.length} ${spread.positions.length === 1 ? 'carta' : 'cartas'}${spread.premium ? ' · PREMIUM' : ''}</small></button>`).join('');
    this.grid.onclick = event => {
      const button = event.target.closest('[data-spread]');
      if (!button) return;
      if (button.dataset.premium === 'true') return this.renderPremium();
      this.begin(button.dataset.spread);
    };
  }

  begin(spreadId) {
    const spread = spreadById(spreadId);
    if (!spread || spread.premium) return;
    this.session = { spreadId, cardIds: shuffledIds().slice(0, spread.positions.length), orientation: 'normal', createdAt: new Date().toISOString(), revision: 1 };
    store.set(SPREAD_STORAGE_KEY, this.session);
    navigator.vibrate?.([16, 30, 20]);
    this.renderReading(false);
  }

  renderPremium() {
    this.result.innerHTML = `<article class="spread-reading spread-premium"><p class="eyebrow">MESA REAL · PREMIUM</p><h3>78 cartas · 13 fileiras de 6</h3><p>A estrutura está preparada, mas a ativação Premium permanecerá bloqueada até o pagamento seguro e a retomada entre dispositivos serem validados em ambiente de testes.</p><button class="text-button" data-go-tarot>Conhecer a Mesa Real do Tarot Livre</button></article>`;
    this.result.querySelector('[data-go-tarot]').onclick = () => globalThis.orbe?.go?.('tarot');
  }

  renderReading(resumed) {
    if (!validSpreadSession(this.session)) return;
    const spread = spreadById(this.session.spreadId);
    const items = this.session.cardIds.map((id, index) => ({ card: CARDS[id], position: spread.positions[index] }));
    const synthesis = synthesizeSpread(items);
    const readings = items.map(({ card, position }, index) => {
      const meaning = dailyMeaning(card);
      return `<article><span>POSIÇÃO ${index + 1}/${items.length} · ${safe(position)} · DIRETA</span><h3>${safe(card.name)}</h3><p class="keywords">${meaning.keywords.map(safe).join(' · ')}</p><h4>Essência nesta posição</h4><p>${safe(meaning.essence)}</p><h4>Luz</h4><p>${safe(meaning.light)}</p><h4>Tensão e cuidado</h4><p>${safe(meaning.tension)}</p><h4>Conselho prático</h4><p>${safe(meaning.advice)}</p><p class="reflection">${safe(meaning.reflectionQuestion)}</p></article>`;
    }).join('');
    this.result.innerHTML = `<article class="spread-reading"><p class="eyebrow">${safe(spread.name)}${resumed ? ' · RETOMADA' : ''}</p><div class="spread-progress" aria-label="${items.length} de ${items.length} posições reveladas"><i style="width:100%"></i></div><div class="spread-layout count-${items.length}">${items.map(({ card, position }, index) => `<figure><span>${index + 1} · ${safe(position)}</span>${cardImageMarkup(card, { priority: index < 3 ? 'high' : 'auto' })}<figcaption>${safe(card.name)}</figcaption></figure>`).join('')}</div><div class="spread-meanings">${readings}</div><article class="spread-synthesis"><span>SÍNTESE DA TIRAGEM</span><p>${safe(synthesis.opening)}</p><p>${safe(synthesis.pattern)}</p><p>${safe(synthesis.integration)}</p></article><div class="spread-actions"><button class="primary" data-save-spread>Guardar no Diário</button><button class="text-button" data-new-spread>Nova tiragem</button></div></article>`;
    this.result.querySelector('[data-save-spread]').onclick = () => this.onSave({ title: `Tiragem — ${spread.name}`, text: `${items.map(item => `${item.position}: ${item.card.name} (direta)`).join('\n')}\n\n${synthesis.opening} ${synthesis.pattern} ${synthesis.integration}`, question: 'O que esta tiragem ilumina no meu momento?', tags: `tiragem, ${spread.name}, ${synthesis.dominantSuit}`, mood: 'Reflexiva', cardIds: this.session.cardIds, type: 'spread', orientation: 'normal' });
    this.result.querySelector('[data-new-spread]').onclick = () => { store.remove(SPREAD_STORAGE_KEY); this.session = null; this.result.innerHTML = ''; this.grid.scrollIntoView({ behavior: 'smooth' }); };
    this.result.scrollIntoView({ behavior: resumed ? 'auto' : 'smooth' });
  }
}
