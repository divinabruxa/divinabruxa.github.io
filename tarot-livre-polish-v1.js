/* DIVINA BRUXA — TAROT LIVRE · POLIMENTO INTERATIVO V1
   Macroetapa 6 de 7. Decorador isolado: não altera o motor das 78 cartas,
   a Home, a Orbe principal, o menu, o dock ou o sincronismo das skins. */

const SOUND_KEY = 'divina-tarot-sound-v1';

class TarotSoundscape {
  constructor(button) {
    this.button = button;
    this.Context = globalThis.AudioContext || globalThis.webkitAudioContext;
    this.context = null;
    this.enabled = this.readPreference();
    this.available = typeof this.Context === 'function';
    this.render();
  }

  readPreference() {
    try { return globalThis.localStorage?.getItem(SOUND_KEY) === 'on'; }
    catch { return false; }
  }

  savePreference() {
    try { globalThis.localStorage?.setItem(SOUND_KEY, this.enabled ? 'on' : 'off'); }
    catch { /* preferência não essencial */ }
  }

  render() {
    if (!this.button) return;
    this.button.disabled = !this.available;
    this.button.setAttribute('aria-pressed', String(this.enabled));
    this.button.setAttribute('aria-label', this.available
      ? `${this.enabled ? 'Desativar' : 'Ativar'} som mágico do Tarot Livre`
      : 'Som mágico indisponível neste navegador');
    this.button.title = this.available
      ? `Som mágico ${this.enabled ? 'ativado' : 'desativado'}`
      : 'Som indisponível';
    this.button.querySelector('span')?.setAttribute('data-sound-state', this.enabled ? 'on' : 'off');
  }

  async ensureContext() {
    if (!this.available) return null;
    if (!this.context) this.context = new this.Context();
    if (this.context.state === 'suspended') await this.context.resume();
    return this.context;
  }

  tone(context, frequency, offset, duration, volume = .025, type = 'sine') {
    const start = context.currentTime + offset;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .04);
  }

  async play(kind) {
    if (!this.enabled || document.visibilityState === 'hidden') return false;
    let context = null;
    try { context = await this.ensureContext(); }
    catch { return false; }
    if (!context) return false;
    const scores = {
      enabled: [[392,0,.18,.018,'sine'],[587.33,.08,.28,.016,'sine'],[783.99,.17,.38,.012,'sine']],
      reveal: [[261.63,0,.34,.022,'sine'],[392,.09,.42,.020,'triangle'],[523.25,.20,.54,.016,'sine'],[1046.5,.29,.34,.008,'sine']],
      shuffle: [[329.63,0,.20,.013,'triangle'],[493.88,.07,.22,.012,'sine'],[659.25,.14,.28,.010,'sine']],
      reset: [[392,0,.24,.014,'sine'],[293.66,.10,.30,.013,'triangle'],[220,.21,.42,.012,'sine']],
      complete: [[261.63,0,.45,.020,'sine'],[329.63,.10,.48,.018,'triangle'],[392,.20,.52,.018,'sine'],[523.25,.34,.70,.014,'sine']]
    };
    (scores[kind] || scores.reveal).forEach(([frequency, offset, duration, volume, type]) => {
      this.tone(context, frequency, offset, duration, volume, type);
    });
    return true;
  }

  async toggle() {
    if (!this.available) return false;
    this.enabled = !this.enabled;
    this.savePreference();
    this.render();
    if (this.enabled) await this.play('enabled');
    else if (this.context?.state === 'running') await this.context.suspend();
    return this.enabled;
  }

  suspend() {
    if (this.context?.state === 'running') this.context.suspend().catch(() => {});
  }
}

class TarotLivrePolish {
  constructor(root) {
    this.root = root;
    this.count = root.querySelector('#count');
    this.orb = root.querySelector('#tableOrb');
    this.status = null;
    this.sound = null;
    this.lastTotal = this.readTotal();
    this.pointerFrame = 0;
    this.stateFrame = 0;
    this.timers = new Map();
    this.install();
  }

  install() {
    if (this.root.dataset.tarotPolish === 'v1') return;
    this.root.dataset.tarotPolish = 'v1';
    this.installAtmosphere();
    this.installSoundControl();
    this.installStatus();
    this.bind();
    this.syncState(false);
  }

  installAtmosphere() {
    if (this.root.querySelector('.tarot-cosmos-alive')) return;
    const layer = document.createElement('div');
    layer.className = 'tarot-cosmos-alive';
    layer.setAttribute('aria-hidden', 'true');
    const stars = [
      [8,18,1.2,0],[19,32,.8,1.1],[31,14,1,.4],[43,27,.7,1.8],[57,17,1.1,.7],[72,34,.8,2.2],[88,21,1.2,1.4],
      [12,49,.7,2.7],[26,61,1.1,1.5],[39,46,.8,3.1],[62,52,1.2,.9],[77,66,.7,2.4],[91,48,1,3.4],
      [7,78,1,.8],[22,88,.7,2.1],[48,73,1.1,3.2],[68,86,.8,1.2],[87,76,1.2,2.8]
    ];
    layer.innerHTML = stars.map(([x,y,size,delay]) => `<i style="--star-x:${x}%;--star-y:${y}%;--star-size:${size};--star-delay:${delay}s"></i>`).join('');
    this.root.prepend(layer);
  }

  installSoundControl() {
    const head = this.root.querySelector('.section-head');
    if (!head) return;
    let button = head.querySelector('#tarotSoundToggle');
    if (!button) {
      button = document.createElement('button');
      button.id = 'tarotSoundToggle';
      button.className = 'tarot-sound-toggle';
      button.type = 'button';
      button.innerHTML = '<span aria-hidden="true" data-sound-state="off">♪</span><small>SOM</small>';
      head.append(button);
    }
    this.sound = new TarotSoundscape(button);
    button.addEventListener('click', async () => {
      const enabled = await this.sound.toggle();
      this.announce(enabled ? 'Som mágico ativado.' : 'Som mágico desativado.');
      this.flash('is-sound-awake', 720);
    });
  }

  installStatus() {
    this.status = this.root.querySelector('#tarotPolishStatus');
    if (this.status) return;
    this.status = document.createElement('p');
    this.status.id = 'tarotPolishStatus';
    this.status.className = 'tarot-polish-status';
    this.status.setAttribute('role', 'status');
    this.status.setAttribute('aria-live', 'polite');
    this.status.setAttribute('aria-atomic', 'true');
    this.root.append(this.status);
  }

  bind() {
    this.root.addEventListener('pointermove', event => this.moveLight(event), { passive:true });
    this.root.addEventListener('pointerdown', event => this.touchLight(event), { passive:true });
    this.root.addEventListener('pointerup', () => this.root.classList.remove('is-touching'), { passive:true });
    this.root.addEventListener('pointercancel', () => this.root.classList.remove('is-touching'), { passive:true });
    this.root.addEventListener('pointerleave', () => this.root.classList.remove('is-touching'), { passive:true });
    this.root.addEventListener('keydown', () => {
      if (this.sound?.enabled) this.sound.ensureContext().catch(() => {});
    });

    this.root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || button.id === 'tarotSoundToggle') return;
      if (button.id === 'shuffleDeck' && !button.disabled && button.getAttribute('aria-busy') !== 'true') this.shuffleState(button);
      if (button.id === 'currentCardPrev' || button.id === 'currentCardNext') this.flash('is-navigating', 420);
      if (button.matches('.table-slot.revealed')) this.flash('is-opening-card', 520);
    });

    globalThis.addEventListener('tarot:revealed', event => this.cardBorn(event));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.sound?.suspend();
    });

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(this.stateFrame);
      this.stateFrame = requestAnimationFrame(() => this.syncState(true));
    });
    if (this.count) observer.observe(this.count, { childList:true, characterData:true, subtree:true });
    if (this.orb) observer.observe(this.orb, { attributes:true, attributeFilter:['disabled','aria-busy'] });
  }

  readTotal() {
    const value = Number.parseInt(this.count?.textContent || '0', 10);
    return Number.isFinite(value) ? value : 0;
  }

  syncState(announceChanges = true) {
    const total = this.readTotal();
    const previous = this.lastTotal;
    const complete = total >= 78 || this.orb?.disabled === true;
    this.root.dataset.tableState = complete ? 'complete' : total > 0 ? 'active' : 'ready';

    if (announceChanges && previous > 0 && total === 0) {
      this.flash('is-resetting', 1120);
      this.sound?.play('reset');
      this.announce('Uma nova mesa nasceu. A Orbe aguarda o primeiro toque.');
    }
    if (announceChanges && previous < 78 && complete) {
      this.flash('is-completing', 2200);
      this.sound?.play('complete');
      this.announce('Círculo completo. As 78 cartas foram reveladas.');
    }
    this.lastTotal = total;
  }

  cardBorn(event) {
    const position = Number(event.detail?.position ?? this.readTotal() - 1);
    this.root.style.setProperty('--tl-card-hue', String((Math.max(0, position) * 23 + 276) % 360));
    this.flash('is-card-born', 1700);
    this.sound?.play('reveal');
  }

  shuffleState(button) {
    button.setAttribute('aria-busy', 'true');
    this.flash('is-shuffling', 980, () => button.removeAttribute('aria-busy'));
    this.sound?.play('shuffle');
    this.announce('As cartas que ainda aguardam estão atravessando novas órbitas.');
  }

  moveLight(event) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(this.pointerFrame);
    this.pointerFrame = requestAnimationFrame(() => {
      const rect = this.root.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100));
      this.root.style.setProperty('--tl-pointer-x', `${x.toFixed(2)}%`);
      this.root.style.setProperty('--tl-pointer-y', `${y.toFixed(2)}%`);
    });
  }

  touchLight(event) {
    this.moveLight(event);
    this.root.classList.add('is-touching');
    if (this.sound?.enabled) this.sound.ensureContext().catch(() => {});
  }

  flash(className, duration, after = null) {
    clearTimeout(this.timers.get(className));
    this.root.classList.remove(className);
    void this.root.offsetWidth;
    this.root.classList.add(className);
    const timer = setTimeout(() => {
      this.root.classList.remove(className);
      this.timers.delete(className);
      after?.();
    }, duration);
    this.timers.set(className, timer);
  }

  announce(message) {
    if (!this.status) return;
    this.status.textContent = '';
    requestAnimationFrame(() => { this.status.textContent = message; });
  }
}

function installTarotLivrePolish() {
  const root = document.querySelector('#tarot');
  if (root) new TarotLivrePolish(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installTarotLivrePolish, { once:true });
} else {
  queueMicrotask(installTarotLivrePolish);
}
