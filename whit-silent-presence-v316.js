/* DIVINA BRUXA 2.0 — REBIRTH R017 · WHIT SILENT PRESENCE V316
   Whit permanece viva sem áudio: texto, luz, timing e respiração visual.
   Sem síntese de voz, microfone, TTS, gravação, autoplay ou chamada de rede. */

const RELEASE = 'V316';
const STYLE_ID = 'whitSilentPresenceV316Styles';
const BADGE_ID = 'whitSilentPresenceV316Badge';

const clean = (value, limit = 180) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const routeNow = () =>
  document.body?.dataset?.screen
  || document.querySelector('#app > .screen.active[id]')?.id
  || location.hash.replace(/^#/, '')
  || 'home';

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './whit-silent-presence-v316.css?v=316';
  document.head.append(link);
}

export class WhitSilentPresenceV316 {
  constructor({
    presence = globalThis.divinaWhitV307?.presence,
    mind = globalThis.divinaWhitV312?.mind
  } = {}) {
    this.presence = presence || null;
    this.mind = mind || null;
    this.abort = new AbortController();
    this.chatObserver = null;
    this.chat = null;
    this.lastAssistantCount = 0;
    this.settleTimer = 0;
    this.mountTimer = 0;
    this.mountAttempts = 0;
    this.destroyed = false;
    installStyle();
    this.removeVoiceResidue();
    document.documentElement.dataset.whitSilentPresence = 'v316';
    this.bind();
    this.mount();
  }

  removeVoiceResidue() {
    document.getElementById('whitVoiceGateV315')?.remove();
    document.querySelectorAll('[data-whit-voice-speak]').forEach(node => node.remove());
    document.getElementById('whitVoiceV315Styles')?.remove();
    delete document.documentElement.dataset.whitVoiceGate;
    delete document.documentElement.dataset.whitVoiceArmed;
    delete document.documentElement.dataset.whitVoiceState;
  }

  bind() {
    const signal = this.abort.signal;
    document.addEventListener('divina:page-ready', event => {
      if (event.detail?.id === 'ai') queueMicrotask(() => this.mount());
      else this.disconnectChat();
    }, { signal });
    document.addEventListener('divina:route-ready', event => {
      if (event.detail?.id === 'ai') queueMicrotask(() => this.mount());
      else this.disconnectChat();
    }, { signal });
    addEventListener('whit:generation-bridge', () => {
      if (routeNow() === 'ai') this.setState('reflecting');
    }, { signal });
    addEventListener('pagehide', () => this.setState('resting'), { signal });
  }

  mount() {
    if (this.destroyed || routeNow() !== 'ai') return false;
    this.removeVoiceResidue();

    const conversation = document.querySelector('#aiApp .ai-conversation');
    const chat = document.querySelector('#aiApp #chat');
    if (!conversation || !chat) {
      if (this.mountAttempts < 10) {
        this.mountAttempts += 1;
        clearTimeout(this.mountTimer);
        this.mountTimer = setTimeout(() => this.mount(), 180);
      }
      return false;
    }

    this.mountAttempts = 0;
    clearTimeout(this.mountTimer);

    if (!document.getElementById(BADGE_ID)) {
      const badge = document.createElement('aside');
      badge.id = BADGE_ID;
      badge.className = 'whit-silent-presence-v316__badge';
      badge.setAttribute('aria-label', 'Whit usa presença silenciosa');
      badge.innerHTML = `
        <span aria-hidden="true">✦</span>
        <p><b>PRESENÇA SILENCIOSA</b><small>Whit responde por texto, luz e ritmo. Sem áudio.</small></p>`;
      const head = conversation.querySelector('.ai-conversation-head');
      if (head?.nextSibling) conversation.insertBefore(badge, head.nextSibling);
      else conversation.prepend(badge);
    }

    this.connectChat(chat);
    this.sync();
    return true;
  }

  connectChat(chat) {
    if (this.chat === chat && this.chatObserver) return;
    this.disconnectChat();
    this.chat = chat;
    this.lastAssistantCount = this.assistantBubbles().length;
    this.chatObserver = new MutationObserver(() => this.sync());
    this.chatObserver.observe(chat, { childList:true, subtree:true, characterData:true });
  }

  disconnectChat() {
    this.chatObserver?.disconnect();
    this.chatObserver = null;
    this.chat = null;
    clearTimeout(this.settleTimer);
    this.setState('resting');
  }

  assistantBubbles() {
    if (!this.chat) return [];
    return [...this.chat.querySelectorAll('.bubble.bot:not(.ai-streaming):not(.ai-welcome)')];
  }

  sync() {
    if (!this.chat || routeNow() !== 'ai') return;
    this.removeVoiceResidue();

    if (this.chat.querySelector('.ai-streaming')) {
      this.setState('reflecting');
      return;
    }

    const bubbles = this.assistantBubbles();
    if (bubbles.length > this.lastAssistantCount) {
      const newest = bubbles.at(-1);
      this.lastAssistantCount = bubbles.length;
      newest?.classList.add('whit-answer-arrival-v316');
      this.setState('answering');
      clearTimeout(this.settleTimer);
      this.settleTimer = setTimeout(() => {
        newest?.classList.remove('whit-answer-arrival-v316');
        this.setState('resting');
      }, 1800);
      return;
    }

    this.lastAssistantCount = bubbles.length;
    if (document.documentElement.dataset.whitSilentState !== 'answering') {
      this.setState('resting');
    }
  }

  setState(state) {
    const next = ['resting','reflecting','answering'].includes(state) ? state : 'resting';
    document.documentElement.dataset.whitSilentState = next;
    const label = document.querySelector('#whitMindV312Panel [data-wm312-state]');
    if (label) {
      label.textContent =
        next === 'reflecting' ? 'Whit está refletindo'
        : next === 'answering' ? 'Whit respondeu'
        : 'Presença conectada';
    }
  }

  status() {
    return Object.freeze({
      release:RELEASE,
      route:clean(routeNow(), 40),
      state:clean(document.documentElement.dataset.whitSilentState || 'resting', 24),
      audio:false,
      autoplay:false,
      tts:false,
      microphone:false,
      recording:false,
      networkCalls:0,
      textPrimary:true,
      homeTouched:false
    });
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    this.disconnectChat();
    clearTimeout(this.mountTimer);
    document.getElementById(BADGE_ID)?.remove();
    delete document.documentElement.dataset.whitSilentPresence;
    delete document.documentElement.dataset.whitSilentState;
  }
}

export const createWhitSilentPresenceV316 = options => new WhitSilentPresenceV316(options);
