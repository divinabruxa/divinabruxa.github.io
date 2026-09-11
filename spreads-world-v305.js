/* DIVINA BRUXA 2.0 — REBIRTH R006 · TIRAGENS V305
   Camada de continuidade sobre o núcleo V213.
   Não duplica política, cartas, síntese, Premium nem persistência. */
import { SpreadsEngine } from './spreads-engine.js?v=213';
import { spreadById } from './spreads-policy.js?v=213';

const frame = callback => requestAnimationFrame(() => requestAnimationFrame(callback));
const percent = (value, total) => total > 0 ? Math.max(0, Math.min(100, Math.round((value / total) * 100))) : 0;

export class SpreadsWorldV305 extends SpreadsEngine {
  get rebirthRoot() {
    if (!this._v305Root?.isConnected) this._v305Root = document.querySelector('#spreads');
    return this._v305Root || null;
  }

  mountRitualFrame() {
    const root = this.rebirthRoot;
    if (!root) return null;
    root.dataset.rebirth = 'v305';
    let ritual = root.querySelector('[data-spread-ritual-v305]');
    if (ritual) return ritual;

    ritual = document.createElement('aside');
    ritual.className = 'spread-ritual-v305';
    ritual.dataset.spreadRitualV305 = '';
    ritual.dataset.stage = 'choose';
    ritual.setAttribute('aria-label', 'Etapas da tiragem');
    ritual.innerHTML = `
      <div class="spread-ritual-v305__progress" aria-hidden="true"><i></i></div>
      <ol>
        <li data-ritual-stage="choose"><span>1</span><b>Escolha</b></li>
        <li data-ritual-stage="prepare"><span>2</span><b>Preparação</b></li>
        <li data-ritual-stage="reveal"><span>3</span><b>Revelação</b></li>
        <li data-ritual-stage="synthesis"><span>4</span><b>Síntese</b></li>
      </ol>
      <p data-ritual-status aria-live="polite">Escolha a forma da leitura.</p>`;

    const anchor = this.intention || this.grid || this.result;
    if (anchor?.parentNode) anchor.parentNode.insertBefore(ritual, anchor);
    else root.prepend(ritual);
    return ritual;
  }

  stageSnapshot() {
    if (!this.session) return { key:'choose', message:'Escolha a forma da leitura.', progress:0 };
    const target = spreadById(this.session.spreadId);
    const total = this.session.cardIds?.length || this.session.positions?.length || 0;
    const revealed = Math.max(0, Math.min(total, Number(this.session.revealed) || 0));
    if (revealed === 0) return {
      key:'prepare',
      message:`${target?.name || 'Tiragem'} pronta. Toque na Orbe quando sentir que é o momento.`,
      progress:8
    };
    if (revealed >= total && total > 0) return {
      key:'synthesis',
      message:`Leitura completa · ${total} ${total === 1 ? 'posição revelada' : 'posições reveladas'}.`,
      progress:100
    };
    return {
      key:'reveal',
      message:`${revealed} de ${total} posições reveladas · uma intenção por toque.`,
      progress:Math.max(12, percent(revealed, total))
    };
  }

  syncRitualFrame() {
    const ritual = this.mountRitualFrame();
    if (!ritual) return;
    const snapshot = this.stageSnapshot();
    ritual.dataset.stage = snapshot.key;
    ritual.style.setProperty('--spread-rebirth-progress', `${snapshot.progress}%`);
    ritual.querySelector('[data-ritual-status]')?.replaceChildren(snapshot.message);

    const order = ['choose','prepare','reveal','synthesis'];
    const currentIndex = order.indexOf(snapshot.key);
    ritual.querySelectorAll('[data-ritual-stage]').forEach(item => {
      const index = order.indexOf(item.dataset.ritualStage);
      const current = index === currentIndex;
      item.classList.toggle('is-current', current);
      item.classList.toggle('is-past', index < currentIndex);
      if (current) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });

    const reveal = this.result?.querySelector?.('[data-reveal-card]');
    if (reveal) {
      reveal.dataset.rebirthReveal = 'v305';
      reveal.setAttribute('aria-disabled', String(Boolean(this._v305RevealLock)));
    }
  }

  renderMenu() {
    super.renderMenu();
    this.syncRitualFrame();
  }

  renderReading(resumed) {
    super.renderReading(resumed);
    this.syncRitualFrame();
    const reading = this.result?.querySelector?.('.spread-reading');
    if (reading) {
      reading.dataset.rebirth = 'v305';
      reading.classList.toggle('is-resumed-v305', Boolean(resumed));
    }
  }

  renderCustomConfig() {
    super.renderCustomConfig();
    const ritual = this.mountRitualFrame();
    if (ritual) {
      ritual.dataset.stage = 'prepare';
      ritual.style.setProperty('--spread-rebirth-progress', '8%');
      ritual.querySelector('[data-ritual-status]')?.replaceChildren('Defina a quantidade de posições antes de abrir o círculo.');
    }
  }

  begin(spreadId, customCount) {
    if (this._v305BeginLock) return;
    this._v305BeginLock = true;
    try {
      super.begin(spreadId, customCount);
      this.syncRitualFrame();
    } finally {
      frame(() => { this._v305BeginLock = false; });
    }
  }

  revealNext() {
    if (this._v305RevealLock || !this.session || this.isComplete()) return;
    this._v305RevealLock = true;
    const root = this.rebirthRoot;
    root?.classList.add('is-reveal-transaction-v305');
    this.syncRitualFrame();
    try {
      super.revealNext();
    } finally {
      frame(() => {
        this._v305RevealLock = false;
        root?.classList.remove('is-reveal-transaction-v305');
        this.syncRitualFrame();
      });
    }
  }

  renderSwitchConfirmation(target) {
    super.renderSwitchConfirmation(target);
    const ritual = this.mountRitualFrame();
    if (ritual) {
      ritual.dataset.stage = 'prepare';
      ritual.querySelector('[data-ritual-status]')?.replaceChildren('Sua tiragem atual continua protegida até você confirmar a troca.');
    }
  }

  renderPremium() {
    super.renderPremium();
    this.syncRitualFrame();
  }

  destroy() {
    this.rebirthRoot?.classList.remove('is-reveal-transaction-v305');
    super.destroy?.();
  }
}
