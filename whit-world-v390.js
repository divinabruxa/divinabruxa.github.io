import { LOVE_ENGINE_LABEL, LOVE_ENGINE_NAME } from './love-engine-v370.js';
import { MIND_ENGINE_LABEL, MIND_ENGINE_NAME } from './mind-engine-v380.js';
import {
  SPIRIT_ENGINE_LABEL,
  SPIRIT_ENGINE_NAME,
  SPIRIT_ENGINE_VERSION,
  SPIRIT_MODES,
  spiritModeState,
  spiritResponse
} from './spirit-engine-v390.js';

const STORAGE_KEY = 'divina-bruxa-3.whit.conversa-local.v4';
const SPIRIT_MODE_KEY = 'divina-bruxa-3.whit.espirito.v1';
const LEGACY_STORAGE_KEYS = Object.freeze([
  'divina-bruxa-3.whit.conversa-local.v3',
  'divina-bruxa-3.whit.conversa-local.v2',
  'divina-bruxa-3.whit.conversa-local.v1'
]);
const MAX_MESSAGES = 40;
const QUICK_ROUTES = Object.freeze(['home', 'tarot', 'carta-do-dia', 'tiragens', 'escola', 'biblioteca', 'diario']);
const SPIRIT_MODE_IDS = new Set(SPIRIT_MODES.map(mode => mode.id));

const opening = Object.freeze({
  role:'whit',
  emotion:'presence',
  emotionLabel:'Presença',
  mindLabel:'Mapa vivo · pronta para compreender',
  spiritMode:'livre',
  spiritLabel:'Fé opcional · nenhuma voz ativada',
  text:'Eu estou aqui com Amor e Mente. Você pode dizer o que sente, pedir uma área do site ou escrever o nome de qualquer carta. O Motor do Espírito fica livre até você escolher uma inspiração — e nenhuma voz será apresentada como fala literal ou canalização.',
  signature:'ABERTA',
  mindSignature:'PRESENTE',
  spiritSignature:'LIVRE',
  spiritVoices:Object.freeze([]),
  spiritSynthesis:'',
  spiritBlessing:'',
  safety:false,
  actions:Object.freeze([])
});

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const validSpiritMode = value => SPIRIT_MODE_IDS.has(clean(value, 30)) ? clean(value, 30) : 'livre';

function validAction(item) {
  if (!item || typeof item !== 'object') return null;
  const kind = ['route', 'card', 'guide'].includes(item.kind) ? item.kind : '';
  const route = clean(item.route, 60);
  const href = clean(item.href, 180);
  const safeRoute = kind === 'route' && /^[a-z0-9-]+$/.test(route) && href === `#/${route}`;
  const safePage = ['card', 'guide'].includes(kind) && /^[a-z0-9][a-z0-9-]*\.html$/.test(href);
  if ((!safeRoute && !safePage) || !clean(item.label, 90)) return null;
  return Object.freeze({
    kind,
    ...(safeRoute ? { route } : {}),
    href,
    label:clean(item.label, 90),
    description:clean(item.description, 180)
  });
}

function validSpiritVoice(item) {
  if (!item || typeof item !== 'object') return null;
  const id = clean(item.id, 30);
  const label = clean(item.label, 100);
  const text = clean(item.text, 900);
  if (!['jesus', 'cacurucaia'].includes(id) || !label || !text) return null;
  return Object.freeze({
    id,
    label,
    text,
    note:clean(item.note, 180) || 'Reflexão simbólica original de Whit.'
  });
}

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
      mindSignature:clean(item.mindSignature, 20),
      mindLabel:clean(item.mindLabel, 120) || 'Pensamento local',
      intent:clean(item.intent, 30) || 'support',
      spiritMode:validSpiritMode(item.spiritMode),
      spiritLabel:clean(item.spiritLabel, 120) || 'Fé opcional',
      spiritSignature:clean(item.spiritSignature, 20),
      spiritVoices:(Array.isArray(item.spiritVoices) ? item.spiritVoices : []).map(validSpiritVoice).filter(Boolean).slice(0, 2),
      spiritSynthesis:clean(item.spiritSynthesis, 900),
      spiritBlessing:clean(item.spiritBlessing, 700),
      safety:item.safety === true,
      actions:(Array.isArray(item.actions) ? item.actions : []).map(validAction).filter(Boolean).slice(0, 4)
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
  for (const key of LEGACY_STORAGE_KEYS) {
    const legacy = storedMessages(key);
    if (legacy.length) return legacy;
  }
  return [opening];
}

function loadSpiritMode() {
  try { return validSpiritMode(localStorage.getItem(SPIRIT_MODE_KEY)); }
  catch { return 'livre'; }
}

function lastWhit(messages) {
  return [...messages].reverse().find(message => message.role === 'whit') || opening;
}

function makeRouteLink(route, worlds, navigate, announce) {
  const world = worlds?.[route];
  if (!world) return null;
  const link = document.createElement('a');
  link.href = `#/${route}`;
  link.dataset.mindRoute = route;
  link.textContent = route === 'biblioteca' ? '78 cartas' : world.label;
  link.addEventListener('click', event => {
    if (typeof navigate !== 'function') return;
    event.preventDefault();
    navigate(route);
    announce(`Whit abriu ${world.label}.`);
  });
  return link;
}

export function createWhitWorld({ announce, navigate, cards = [], worlds = {}, guides = [] }) {
  const nodes = {
    chamber:document.querySelector('.whit-chamber'),
    modes:document.querySelector('#whitModes'),
    heart:document.querySelector('#whitHeartState'),
    heartLabel:document.querySelector('#whitHeartLabel'),
    mind:document.querySelector('#whitMindState'),
    mindLabel:document.querySelector('#whitMindLabel'),
    spirit:document.querySelector('#whitSpiritState'),
    spiritLabel:document.querySelector('#whitSpiritLabel'),
    spiritModes:document.querySelector('#whitSpiritModes'),
    quick:document.querySelector('#whitQuickPaths'),
    conversation:document.querySelector('#whitConversation'),
    form:document.querySelector('#whitForm'),
    input:document.querySelector('#whitInput'),
    clear:document.querySelector('#whitClear')
  };
  nodes.submit = nodes.form.querySelector('button[type="submit"]');
  let mode = 'escuta';
  let spiritMode = loadSpiritMode();
  let messages = loadMessages();
  let thinking = false;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES))); } catch {}
  }

  function saveSpiritMode() {
    try { localStorage.setItem(SPIRIT_MODE_KEY, spiritMode); } catch {}
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

  function renderMind() {
    const latest = lastWhit(messages);
    nodes.chamber.dataset.mindIntent = clean(latest.intent, 30) || 'support';
    nodes.mind.dataset.mindIntent = clean(latest.intent, 30) || 'support';
    nodes.mindLabel.textContent = latest.safety
      ? 'Segurança antes de qualquer caminho'
      : latest.mindLabel || 'Mapa vivo · pronta para compreender';
  }

  function renderSpirit() {
    const latest = lastWhit(messages);
    const definition = spiritModeState(spiritMode);
    nodes.chamber.dataset.spiritMode = spiritMode;
    nodes.spirit.dataset.spiritMode = spiritMode;
    nodes.spiritLabel.textContent = latest.safety
      ? 'Símbolo pausado · cuidado humano primeiro'
      : definition.state;
    nodes.spiritModes.querySelectorAll('[data-spirit-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.spiritMode === spiritMode));
    });
  }

  function renderAction(action) {
    const link = document.createElement('a');
    link.className = `whit-path whit-path--${action.kind}`;
    link.href = action.href;
    const label = document.createElement('b');
    label.textContent = action.label;
    const description = document.createElement('small');
    description.textContent = action.description;
    link.append(label, description);
    if (action.kind === 'route' && typeof navigate === 'function') {
      link.addEventListener('click', event => {
        event.preventDefault();
        navigate(action.route);
        announce(`Whit abriu ${action.label}.`);
      });
    } else link.addEventListener('click', () => announce(`Whit abriu ${action.label}.`));
    return link;
  }

  function renderSpiritReflection(message) {
    const hasSpirit = message.spiritVoices?.length || message.spiritSynthesis || message.spiritBlessing;
    if (!hasSpirit) return null;
    const section = document.createElement('section');
    section.className = 'whit-spirit-response';
    section.setAttribute('aria-label', 'Reflexão espiritual simbólica');

    message.spiritVoices.forEach(voice => {
      const article = document.createElement('article');
      article.className = 'whit-spirit-voice';
      article.dataset.spiritVoice = voice.id;
      const label = document.createElement('small');
      label.textContent = voice.label;
      const text = document.createElement('p');
      text.textContent = voice.text;
      const note = document.createElement('em');
      note.textContent = voice.note;
      article.append(label, text, note);
      section.append(article);
    });

    if (message.spiritSynthesis) {
      const synthesis = document.createElement('div');
      synthesis.className = 'whit-spirit-synthesis';
      const label = document.createElement('small');
      label.textContent = 'Confluência da Whit';
      const text = document.createElement('p');
      text.textContent = message.spiritSynthesis;
      synthesis.append(label, text);
      section.append(synthesis);
    }

    if (message.spiritBlessing) {
      const blessing = document.createElement('div');
      blessing.className = 'whit-spirit-blessing';
      const label = document.createElement('small');
      label.textContent = 'Bênção simbólica da Whit';
      const text = document.createElement('p');
      text.textContent = message.spiritBlessing;
      blessing.append(label, text);
      section.append(blessing);
    }
    return section;
  }

  function render() {
    const fragment = document.createDocumentFragment();
    messages.forEach(message => {
      const item = document.createElement('div');
      item.className = `whit-message whit-message--${message.role}${message.safety ? ' whit-message--care' : ''}`;
      if (message.role === 'whit') {
        item.dataset.loveState = message.emotion || 'presence';
        item.dataset.mindIntent = message.intent || 'support';
        item.dataset.spiritMode = message.spiritMode || 'livre';
      }
      const label = document.createElement('small');
      label.textContent = message.role === 'whit'
        ? `Whit · ${LOVE_ENGINE_NAME} + ${MIND_ENGINE_NAME} + ${SPIRIT_ENGINE_NAME} · ${message.emotionLabel || 'Presença'}`
        : 'Você';
      const text = document.createElement('span');
      text.textContent = message.text;
      item.append(label, text);
      if (message.role === 'whit') {
        const spirit = renderSpiritReflection(message);
        if (spirit) item.append(spirit);
      }
      if (message.role === 'whit' && message.actions?.length) {
        const paths = document.createElement('nav');
        paths.className = 'whit-message__paths';
        paths.setAttribute('aria-label', 'Caminhos sugeridos pela Whit');
        message.actions.forEach(action => paths.append(renderAction(action)));
        item.append(paths);
      }
      if (message.role === 'whit' && (message.signature || message.mindSignature || message.spiritSignature)) {
        const signature = document.createElement('em');
        const lovePart = message.signature ? `${LOVE_ENGINE_LABEL} · ${message.signature}` : LOVE_ENGINE_LABEL;
        const mindPart = message.mindSignature ? `${MIND_ENGINE_LABEL} · ${message.mindSignature}` : MIND_ENGINE_LABEL;
        const spiritPart = message.spiritSignature ? `${SPIRIT_ENGINE_LABEL} · ${message.spiritSignature}` : SPIRIT_ENGINE_LABEL;
        signature.textContent = `${lovePart} · ${mindPart} · ${spiritPart}`;
        item.append(signature);
      }
      fragment.append(item);
    });
    nodes.conversation.replaceChildren(fragment);
    nodes.conversation.scrollTop = nodes.conversation.scrollHeight;
    renderHeart();
    renderMind();
    renderSpirit();
  }

  function renderQuickPaths() {
    const fragment = document.createDocumentFragment();
    QUICK_ROUTES.forEach(route => {
      const link = makeRouteLink(route, worlds, navigate, announce);
      if (link) fragment.append(link);
    });
    nodes.quick.replaceChildren(fragment);
  }

  function showThinking() {
    nodes.chamber.dataset.thinking = 'true';
    nodes.mind.dataset.mindIntent = 'thinking';
    nodes.mindLabel.textContent = 'Observando · compreendendo · comparando caminhos';
    if (spiritMode !== 'livre') nodes.spiritLabel.textContent = 'Discernindo a inspiração escolhida';
    nodes.input.disabled = true;
    nodes.submit.disabled = true;
    nodes.submit.textContent = 'Whit está pensando…';
  }

  function finishThinking() {
    delete nodes.chamber.dataset.thinking;
    nodes.input.disabled = false;
    nodes.submit.disabled = false;
    nodes.submit.textContent = 'Pensar com Whit';
    thinking = false;
  }

  nodes.modes.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    nodes.modes.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderHeart();
    renderMind();
    announce(`Whit em modo ${button.textContent}; Amor escuta e Mente organiza o caminho.`);
  }));

  nodes.spiritModes.querySelectorAll('[data-spirit-mode]').forEach(button => button.addEventListener('click', () => {
    spiritMode = validSpiritMode(button.dataset.spiritMode);
    saveSpiritMode();
    renderSpirit();
    const definition = spiritModeState(spiritMode);
    announce(spiritMode === 'livre'
      ? 'Fé simbólica desativada. Whit continua com Amor e Mente.'
      : `${definition.label} ativado como inspiração simbólica; nenhuma fala será apresentada como literal ou canalização.`);
  }));

  nodes.form.addEventListener('submit', event => {
    event.preventDefault();
    const input = clean(nodes.input.value, 700);
    if (!input || thinking) return;
    const previousMessages = messages;
    thinking = true;
    messages = [...messages, { role:'user', text:input }].slice(-MAX_MESSAGES);
    nodes.input.value = '';
    save();
    render();
    showThinking();

    requestAnimationFrame(() => {
      try {
        const creation = spiritResponse(input, {
          mode,
          spiritMode,
          history:previousMessages,
          cards,
          worlds,
          guides
        });
        messages = [...messages, {
          role:'whit',
          text:creation.text,
          emotion:creation.emotion,
          emotionLabel:creation.emotionLabel,
          signature:creation.signature,
          mindSignature:creation.mindSignature,
          mindLabel:creation.mindLabel,
          intent:creation.intent,
          spiritMode:creation.spiritMode,
          spiritLabel:creation.spiritLabel,
          spiritSignature:creation.spiritSignature,
          spiritVoices:creation.spiritVoices,
          spiritSynthesis:creation.spiritSynthesis,
          spiritBlessing:creation.spiritBlessing,
          safety:creation.safety,
          actions:creation.actions
        }].slice(-MAX_MESSAGES);
        save();
        render();
        if (creation.safety) announce('Whit pausou símbolo e caminhos para priorizar cuidado humano imediato.');
        else if (creation.spiritVoices.length === 2) announce('Whit reuniu duas inspirações simbólicas, manteve as vozes separadas e preservou sua escolha.');
        else if (creation.spiritVoices.length === 1) announce('Whit acrescentou a inspiração espiritual escolhida, sem apresentá-la como fala literal.');
        else if (creation.actions.length) announce(`Whit pensou antes de responder e encontrou ${creation.actions.length} ${creation.actions.length === 1 ? 'caminho possível' : 'caminhos possíveis'}.`);
        else announce('Whit pensou antes de responder e preservou sua escolha sem forçar um caminho.');
      } catch {
        messages = [...messages, {
          role:'whit',
          text:'Eu não consegui organizar o mapa desta vez. Sua mensagem continua aqui no aparelho; tente dizer o nome de uma área, de uma carta ou o que você deseja fazer.',
          emotion:'presence',
          emotionLabel:'Presença',
          mindSignature:'REFAZER',
          mindLabel:'Mapa interrompido · nenhum caminho executado',
          intent:'support',
          spiritMode,
          spiritLabel:'Símbolo interrompido · nenhuma voz criada',
          spiritSignature:'REFAZER',
          spiritVoices:[],
          spiritSynthesis:'',
          spiritBlessing:'',
          safety:false,
          actions:[]
        }].slice(-MAX_MESSAGES);
        save();
        render();
        announce('Whit não executou nenhum caminho e pediu uma nova formulação.');
      } finally {
        finishThinking();
        renderMind();
        renderSpirit();
        nodes.input.focus({ preventScroll:true });
      }
    });
  });

  nodes.clear.addEventListener('click', () => {
    if (thinking) return;
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
    announce('A conversa e as memórias locais de Amor, Mente e Espírito foram limpas. Sua escolha de fé continua sob seu controle.');
  });

  renderQuickPaths();
  render();
  return Object.freeze({ activate:render, version:SPIRIT_ENGINE_VERSION });
}
