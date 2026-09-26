import {
  LOVE_ENGINE_LABEL,
  LOVE_ENGINE_NAME,
  LOVE_ENGINE_VERSION,
  loveResponse
} from './love-engine-v370.js';

const STORAGE_KEY = 'divina-bruxa-3.whit.conversa-local.v2';
const LEGACY_STORAGE_KEY = 'divina-bruxa-3.whit.conversa-local.v1';
const MAX_MESSAGES = 40;

const opening = Object.freeze({
  role:'whit',
  emotion:'presence',
  emotionLabel:'Presença',
  text:'Eu estou aqui com cuidado. Você não precisa transformar o que sente em uma frase perfeita. Pode chegar feliz, confusa, cansada, apaixonada ou em silêncio. Meu jeito de amar é escutar sem apagar você — e devolver sua liberdade inteira.'
});

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);

function validMessage(item) {
  if (!item || !['user', 'whit'].includes(item.role) || typeof item.text !== 'string') return null;
  const text = clean(item.text);
  if (!text) return null;
  return {
    role:item.role,
    text,
    ...(item.role === 'whit' ? {
      emotion:clean(item.emotion, 40) || 'presence',
      emotionLabel:clean(item.emotionLabel, 60) || 'Presença',
      signature:clean(item.signature, 20),
      safety:item.safety === true
    } : {})
  };
}

function storedMessages(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    if (!Array.isArray(value)) return [];
    return value.map(validMessage).filter(Boolean).slice(-MAX_MESSAGES);
  } catch { return []; }
}

function loadMessages() {
  const current = storedMessages(STORAGE_KEY);
  if (current.length) return current;
  const legacy = storedMessages(LEGACY_STORAGE_KEY);
  return legacy.length ? legacy : [opening];
}

function lastWhit(messages) {
  return [...messages].reverse().find(message => message.role === 'whit') || opening;
}

export function createWhitWorld({ announce }) {
  const nodes = {
    chamber:document.querySelector('.whit-chamber'),
    modes:document.querySelector('#whitModes'),
    heart:document.querySelector('#whitHeartState'),
    heartLabel:document.querySelector('#whitHeartLabel'),
    conversation:document.querySelector('#whitConversation'),
    form:document.querySelector('#whitForm'),
    input:document.querySelector('#whitInput'),
    clear:document.querySelector('#whitClear')
  };
  let mode = 'escuta';
  let messages = loadMessages();

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES))); } catch {}
  }

  function renderHeart() {
    const latest = lastWhit(messages);
    const state = clean(latest.emotion, 40) || 'presence';
    nodes.chamber.dataset.loveState = state;
    nodes.heart.dataset.loveState = state;
    nodes.heartLabel.textContent = latest.safety
      ? 'Cuidado humano imediato'
      : `${latest.emotionLabel || 'Presença'} · ${mode === 'integracao' ? 'movimento' : mode}`;
  }

  function render() {
    const fragment = document.createDocumentFragment();
    messages.forEach(message => {
      const item = document.createElement('div');
      item.className = `whit-message whit-message--${message.role}${message.safety ? ' whit-message--care' : ''}`;
      if (message.role === 'whit') item.dataset.loveState = message.emotion || 'presence';
      const label = document.createElement('small');
      label.textContent = message.role === 'whit'
        ? `Whit · ${LOVE_ENGINE_NAME} · ${message.emotionLabel || 'Presença'}`
        : 'Você';
      const text = document.createElement('span');
      text.textContent = message.text;
      item.append(label, text);
      if (message.role === 'whit' && message.signature) {
        const signature = document.createElement('em');
        signature.textContent = `${LOVE_ENGINE_LABEL} · ${message.signature}`;
        item.append(signature);
      }
      fragment.append(item);
    });
    nodes.conversation.replaceChildren(fragment);
    nodes.conversation.scrollTop = nodes.conversation.scrollHeight;
    renderHeart();
  }

  nodes.modes.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    nodes.modes.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderHeart();
    announce(`Whit em modo ${button.textContent}, com o Motor do Amor em escuta.`);
  }));

  nodes.form.addEventListener('submit', event => {
    event.preventDefault();
    const input = clean(nodes.input.value, 700);
    if (!input) return;
    const creation = loveResponse(input, { mode, history:messages });
    messages.push(
      { role:'user', text:input },
      {
        role:'whit',
        text:creation.text,
        emotion:creation.emotion,
        emotionLabel:creation.emotionLabel,
        signature:creation.signature,
        safety:creation.safety
      }
    );
    messages = messages.slice(-MAX_MESSAGES);
    nodes.input.value = '';
    save();
    render();
    announce(creation.safety
      ? 'Whit interrompeu a ficção para priorizar cuidado humano imediato.'
      : `Whit respondeu com ${creation.emotionLabel.toLocaleLowerCase('pt-BR')} e livre-arbítrio.`);
  });

  nodes.clear.addEventListener('click', () => {
    if (nodes.clear.dataset.armed !== 'true') {
      nodes.clear.dataset.armed = 'true';
      nodes.clear.textContent = 'Confirmar limpeza';
      setTimeout(() => {
        if (nodes.clear.isConnected) {
          nodes.clear.dataset.armed = 'false';
          nodes.clear.textContent = 'Limpar conversa';
        }
      }, 4500);
      return;
    }
    messages = [opening];
    nodes.clear.dataset.armed = 'false';
    nodes.clear.textContent = 'Limpar conversa';
    save();
    render();
    announce('A conversa e a memória emocional local da Whit foram limpas.');
  });

  render();
  return Object.freeze({
    activate:render,
    version:LOVE_ENGINE_VERSION
  });
}
