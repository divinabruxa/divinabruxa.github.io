import {
  LOVE_ENGINE_LABEL,
  LOVE_ENGINE_NAME
} from './love-engine-v370.js';
import {
  MIND_ENGINE_LABEL,
  MIND_ENGINE_NAME,
  MIND_ENGINE_VERSION,
  mindResponse
} from './mind-engine-v380.js';

const STORAGE_KEY = 'divina-bruxa-3.whit.conversa-local.v3';
const LEGACY_STORAGE_KEYS = Object.freeze([
  'divina-bruxa-3.whit.conversa-local.v2',
  'divina-bruxa-3.whit.conversa-local.v1'
]);
const MAX_MESSAGES = 40;
const QUICK_ROUTES = Object.freeze(['home', 'tarot', 'carta-do-dia', 'tiragens', 'escola', 'biblioteca', 'diario']);

const opening = Object.freeze({
  role:'whit',
  emotion:'presence',
  emotionLabel:'Presença',
  mindLabel:'Mapa vivo · pronta para compreender',
  text:'Eu estou aqui com Amor e Mente. Você pode dizer o que sente, pedir uma área do site ou escrever o nome de qualquer carta. Eu vou organizar o pedido, conferir o mapa e oferecer caminhos — sem decidir por você.',
  signature:'ABERTA',
  mindSignature:'PRESENTE',
  safety:false,
  actions:Object.freeze([])
});

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);

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
    quick:document.querySelector('#whitQuickPaths'),
    conversation:document.querySelector('#whitConversation'),
    form:document.querySelector('#whitForm'),
    input:document.querySelector('#whitInput'),
    clear:document.querySelector('#whitClear')
  };
  nodes.submit = nodes.form.querySelector('button[type="submit"]');
  let mode = 'escuta';
  let messages = loadMessages();
  let thinking = false;

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

  function renderMind() {
    const latest = lastWhit(messages);
    nodes.chamber.dataset.mindIntent = clean(latest.intent, 30) || 'support';
    nodes.mind.dataset.mindIntent = clean(latest.intent, 30) || 'support';
    nodes.mindLabel.textContent = latest.safety
      ? 'Segurança antes de qualquer caminho'
      : latest.mindLabel || 'Mapa vivo · pronta para compreender';
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
    } else {
      link.addEventListener('click', () => announce(`Whit abriu ${action.label}.`));
    }
    return link;
  }

  function render() {
    const fragment = document.createDocumentFragment();
    messages.forEach(message => {
      const item = document.createElement('div');
      item.className = `whit-message whit-message--${message.role}${message.safety ? ' whit-message--care' : ''}`;
      if (message.role === 'whit') {
        item.dataset.loveState = message.emotion || 'presence';
        item.dataset.mindIntent = message.intent || 'support';
      }
      const label = document.createElement('small');
      label.textContent = message.role === 'whit'
        ? `Whit · ${LOVE_ENGINE_NAME} + ${MIND_ENGINE_NAME} · ${message.emotionLabel || 'Presença'}`
        : 'Você';
      const text = document.createElement('span');
      text.textContent = message.text;
      item.append(label, text);
      if (message.role === 'whit' && message.actions?.length) {
        const paths = document.createElement('nav');
        paths.className = 'whit-message__paths';
        paths.setAttribute('aria-label', 'Caminhos sugeridos pela Whit');
        message.actions.forEach(action => paths.append(renderAction(action)));
        item.append(paths);
      }
      if (message.role === 'whit' && (message.signature || message.mindSignature)) {
        const signature = document.createElement('em');
        const lovePart = message.signature ? `${LOVE_ENGINE_LABEL} · ${message.signature}` : LOVE_ENGINE_LABEL;
        const mindPart = message.mindSignature ? `${MIND_ENGINE_LABEL} · ${message.mindSignature}` : MIND_ENGINE_LABEL;
        signature.textContent = `${lovePart} · ${mindPart}`;
        item.append(signature);
      }
      fragment.append(item);
    });
    nodes.conversation.replaceChildren(fragment);
    nodes.conversation.scrollTop = nodes.conversation.scrollHeight;
    renderHeart();
    renderMind();
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
        const creation = mindResponse(input, {
          mode,
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
          safety:creation.safety,
          actions:creation.actions
        }].slice(-MAX_MESSAGES);
        save();
        render();
        if (creation.safety) announce('Whit interrompeu os caminhos do site para priorizar cuidado humano imediato.');
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
          safety:false,
          actions:[]
        }].slice(-MAX_MESSAGES);
        save();
        render();
        announce('Whit não executou nenhum caminho e pediu uma nova formulação.');
      } finally {
        finishThinking();
        renderMind();
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
    announce('A conversa e as memórias locais de Amor e Mente foram limpas.');
  });

  renderQuickPaths();
  render();
  return Object.freeze({
    activate:render,
    version:MIND_ENGINE_VERSION
  });
}
