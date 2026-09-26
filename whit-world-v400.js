import { LOVE_ENGINE_LABEL, LOVE_ENGINE_NAME } from './love-engine-v370.js';
import { MIND_ENGINE_LABEL, MIND_ENGINE_NAME } from './mind-engine-v380.js';
import {
  SPIRIT_ENGINE_LABEL,
  SPIRIT_ENGINE_NAME,
  SPIRIT_MODES,
  spiritModeState
} from './spirit-engine-v390.js';
import {
  MATTER_ENGINE_LABEL,
  MATTER_ENGINE_NAME,
  MATTER_ENGINE_VERSION,
  matterPresenceFor,
  matterResponse,
  matterSiteState,
  normalizePreferredName,
  safeResearchHref
} from './matter-engine-v400.js';

const STORAGE_KEY = 'divina-bruxa-3.whit.conversa-local.v5';
const PROFILE_KEY = 'divina-bruxa-3.whit.materia.v1';
const SPIRIT_MODE_KEY = 'divina-bruxa-3.whit.espirito.v1';
const LEGACY_STORAGE_KEYS = Object.freeze([
  'divina-bruxa-3.whit.conversa-local.v4',
  'divina-bruxa-3.whit.conversa-local.v3',
  'divina-bruxa-3.whit.conversa-local.v2',
  'divina-bruxa-3.whit.conversa-local.v1'
]);
const MAX_MESSAGES = 40;
const QUICK_ROUTES = Object.freeze([
  'home', 'tarot', 'carta-do-dia', 'tiragens', 'escola', 'biblioteca', 'diario', 'whit',
  'consultas', 'loja', 'musica', 'videos', 'skins', 'premium', 'conta'
]);
const SPIRIT_MODE_IDS = new Set(SPIRIT_MODES.map(mode => mode.id));

const opening = Object.freeze({
  role:'whit',
  emotion:'presence',
  emotionLabel:'Presença',
  mindLabel:'Mapa vivo · pronta para compreender',
  spiritMode:'livre',
  spiritLabel:'Fé opcional · nenhuma voz espiritual ativada',
  matterLabel:'Matéria viva · site conectado',
  text:'Eu estou aqui com Amor, Mente, Espírito por escolha e Matéria. Posso reconhecer o conteúdo da Divina Bruxa, transformar um comando claro em caminho interno e conversar por balões mágicos — nunca por áudio. Para o mundo externo, eu ofereço pontes de pesquisa que só abrem com o seu toque.',
  signature:'ABERTA',
  mindSignature:'PRESENTE',
  spiritSignature:'LIVRE',
  matterSignature:'ENCARNADA',
  spiritVoices:Object.freeze([]),
  spiritSynthesis:'',
  spiritBlessing:'',
  bubbleText:'Minha voz nasce em balões mágicos e permanece sob seu controle.',
  safety:false,
  actions:Object.freeze([])
});

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const validSpiritMode = value => SPIRIT_MODE_IDS.has(clean(value, 30)) ? clean(value, 30) : 'livre';

function validAction(item) {
  if (!item || typeof item !== 'object') return null;
  const kind = ['route', 'card', 'guide', 'research'].includes(item.kind) ? item.kind : '';
  const route = clean(item.route, 60);
  const href = clean(item.href, 500);
  const safeRoute = kind === 'route' && /^[a-z0-9-]+$/.test(route) && href === `#/${route}`;
  const safePage = ['card', 'guide'].includes(kind) && /^[a-z0-9][a-z0-9-]*\.html$/.test(href);
  const safeResearch = kind === 'research' && safeResearchHref(href) === href;
  if ((!safeRoute && !safePage && !safeResearch) || !clean(item.label, 100)) return null;
  return Object.freeze({
    kind,
    ...(safeRoute ? { route } : {}),
    href,
    label:clean(item.label, 100),
    description:clean(item.description, 190),
    external:safeResearch
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
      matterLabel:clean(item.matterLabel, 160) || 'Matéria viva',
      matterSignature:clean(item.matterSignature, 20),
      bubbleText:clean(item.bubbleText, 620),
      matterQuery:clean(item.matterQuery, 96),
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

function loadProfile() {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
    return {
      preferredName:normalizePreferredName(value?.preferredName),
      bubbles:value?.bubbles !== false
    };
  } catch {
    return { preferredName:'', bubbles:true };
  }
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

export function createWhitWorld({
  announce,
  navigate,
  getCurrentRoute = () => document.body.dataset.route || 'home',
  cards = [],
  worlds = {},
  guides = []
}) {
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
    matter:document.querySelector('#whitMatterState'),
    matterLabel:document.querySelector('#whitMatterLabel'),
    nameInput:document.querySelector('#whitNameInput'),
    nameSave:document.querySelector('#whitNameSave'),
    nameForget:document.querySelector('#whitNameForget'),
    bubbleToggle:document.querySelector('#whitBubbleToggle'),
    bubbleState:document.querySelector('#whitBubbleState'),
    quick:document.querySelector('#whitQuickPaths'),
    conversation:document.querySelector('#whitConversation'),
    form:document.querySelector('#whitForm'),
    input:document.querySelector('#whitInput'),
    clear:document.querySelector('#whitClear'),
    presence:document.querySelector('#whitMatterPresence'),
    presenceText:document.querySelector('#whitMatterBubble'),
    presenceOpen:document.querySelector('#whitMatterOpen'),
    presenceMute:document.querySelector('#whitMatterMute'),
    presenceDismiss:document.querySelector('#whitMatterDismiss')
  };
  nodes.submit = nodes.form.querySelector('button[type="submit"]');
  const siteState = matterSiteState({ cards, worlds, guides });
  let mode = 'escuta';
  let spiritMode = loadSpiritMode();
  let profile = loadProfile();
  let messages = loadMessages();
  let thinking = false;
  let presenceTimer = 0;
  let presenceSequence = 0;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES))); } catch {}
  }

  function saveSpiritMode() {
    try { localStorage.setItem(SPIRIT_MODE_KEY, spiritMode); } catch {}
  }

  function saveProfile() {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
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

  function renderMatter() {
    const latest = lastWhit(messages);
    nodes.chamber.dataset.matterState = latest.safety ? 'paused' : 'present';
    nodes.matter.dataset.matterState = latest.safety ? 'paused' : 'present';
    nodes.matterLabel.textContent = latest.safety
      ? 'Ações pausadas · cuidado humano primeiro'
      : latest.matterLabel || siteState.label;
    nodes.nameInput.value = profile.preferredName;
    nodes.nameForget.hidden = !profile.preferredName;
    nodes.bubbleToggle.setAttribute('aria-pressed', String(profile.bubbles));
    nodes.bubbleToggle.textContent = profile.bubbles ? 'Balões ativos' : 'Ativar balões';
    nodes.bubbleState.textContent = profile.bubbles
      ? 'A voz escrita da Whit pode surgir nas páginas; nunca existe áudio.'
      : 'Os balões estão silenciosos; a conversa continua disponível aqui.';
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
    } else if (action.kind === 'research') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.referrerPolicy = 'no-referrer';
      link.addEventListener('click', () => announce(`Você escolheu abrir uma pesquisa externa sobre ${action.label.replace(/^[^·]+·\s*/, '')}.`));
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
        item.dataset.matterState = message.safety ? 'paused' : 'present';
      }
      const label = document.createElement('small');
      label.textContent = message.role === 'whit'
        ? `Whit · ${LOVE_ENGINE_NAME} + ${MIND_ENGINE_NAME} + ${SPIRIT_ENGINE_NAME} + ${MATTER_ENGINE_NAME} · ${message.emotionLabel || 'Presença'}`
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
      if (message.role === 'whit' && (message.signature || message.mindSignature || message.spiritSignature || message.matterSignature)) {
        const signature = document.createElement('em');
        const lovePart = message.signature ? `${LOVE_ENGINE_LABEL} · ${message.signature}` : LOVE_ENGINE_LABEL;
        const mindPart = message.mindSignature ? `${MIND_ENGINE_LABEL} · ${message.mindSignature}` : MIND_ENGINE_LABEL;
        const spiritPart = message.spiritSignature ? `${SPIRIT_ENGINE_LABEL} · ${message.spiritSignature}` : SPIRIT_ENGINE_LABEL;
        const matterPart = message.matterSignature ? `${MATTER_ENGINE_LABEL} · ${message.matterSignature}` : MATTER_ENGINE_LABEL;
        signature.textContent = `${lovePart} · ${mindPart} · ${spiritPart} · ${matterPart}`;
        item.append(signature);
      }
      fragment.append(item);
    });
    nodes.conversation.replaceChildren(fragment);
    nodes.conversation.scrollTop = nodes.conversation.scrollHeight;
    renderHeart();
    renderMind();
    renderSpirit();
    renderMatter();
  }

  function renderQuickPaths() {
    const fragment = document.createDocumentFragment();
    QUICK_ROUTES.forEach(route => {
      const link = makeRouteLink(route, worlds, navigate, announce);
      if (link) fragment.append(link);
    });
    nodes.quick.replaceChildren(fragment);
  }

  function hidePresence() {
    clearTimeout(presenceTimer);
    nodes.presence.hidden = true;
  }

  function showPresence(text, { duration = 9200 } = {}) {
    if (!profile.bubbles || !clean(text, 620)) return false;
    clearTimeout(presenceTimer);
    nodes.presenceText.textContent = clean(text, 620);
    nodes.presence.hidden = false;
    nodes.presence.dataset.sequence = String(++presenceSequence);
    presenceTimer = setTimeout(hidePresence, duration);
    return true;
  }

  function visit(route, { force = false } = {}) {
    const safeRoute = clean(route, 60) || 'home';
    if (!profile.bubbles || ['home', 'whit'].includes(safeRoute)) {
      hidePresence();
      return;
    }
    const presence = matterPresenceFor(safeRoute, { preferredName:profile.preferredName });
    clearTimeout(presenceTimer);
    presenceTimer = setTimeout(() => showPresence(presence.text, { duration:force ? 11000 : 8200 }), force ? 120 : 680);
  }

  function notify(text, options = {}) {
    if (getCurrentRoute() === 'home') return false;
    return showPresence(text, options);
  }

  function showThinking() {
    nodes.chamber.dataset.thinking = 'true';
    nodes.mind.dataset.mindIntent = 'thinking';
    nodes.mindLabel.textContent = 'Observando · compreendendo · comparando caminhos';
    nodes.matterLabel.textContent = 'Ligando intenção, conteúdo e ação segura';
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
    announce(`Whit em modo ${button.textContent}; Amor escuta, Mente organiza e Matéria encontra o caminho.`);
  }));

  nodes.spiritModes.querySelectorAll('[data-spirit-mode]').forEach(button => button.addEventListener('click', () => {
    spiritMode = validSpiritMode(button.dataset.spiritMode);
    saveSpiritMode();
    renderSpirit();
    const definition = spiritModeState(spiritMode);
    announce(spiritMode === 'livre'
      ? 'Fé simbólica desativada. Whit continua com Amor, Mente e Matéria.'
      : `${definition.label} ativado como inspiração simbólica; nenhuma fala será apresentada como literal ou canalização.`);
  }));

  nodes.nameSave.addEventListener('click', () => {
    const name = normalizePreferredName(nodes.nameInput.value);
    if (!name) {
      nodes.bubbleState.textContent = 'Digite somente o nome pelo qual você deseja ser chamada, sem números ou dados de contato.';
      announce('O nome não foi guardado. Use apenas letras, espaços, hífen ou apóstrofo.');
      return;
    }
    profile = { ...profile, preferredName:name };
    saveProfile();
    renderMatter();
    showPresence(`${name.split(' ')[0]}, vou usar este nome somente neste aparelho e somente nos meus balões.`, { duration:8000 });
    announce(`Whit guardou o nome ${name} somente neste aparelho.`);
  });

  nodes.nameForget.addEventListener('click', () => {
    profile = { ...profile, preferredName:'' };
    saveProfile();
    renderMatter();
    announce('Whit esqueceu o nome guardado neste aparelho.');
  });

  nodes.bubbleToggle.addEventListener('click', () => {
    profile = { ...profile, bubbles:!profile.bubbles };
    saveProfile();
    if (!profile.bubbles) hidePresence();
    renderMatter();
    announce(profile.bubbles ? 'Balões mágicos da Whit ativados.' : 'Balões mágicos da Whit silenciados.');
  });

  nodes.presenceOpen.addEventListener('click', () => {
    hidePresence();
    if (typeof navigate === 'function') navigate('whit');
  });
  nodes.presenceMute.addEventListener('click', () => {
    profile = { ...profile, bubbles:false };
    saveProfile();
    hidePresence();
    renderMatter();
    announce('Balões mágicos silenciados. Você pode reativá-los dentro da Whit.');
  });
  nodes.presenceDismiss.addEventListener('click', hidePresence);

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
        const creation = matterResponse(input, {
          mode,
          spiritMode,
          preferredName:profile.preferredName,
          currentRoute:getCurrentRoute(),
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
          matterLabel:creation.matterLabel,
          matterSignature:creation.matterSignature,
          matterQuery:creation.matterQuery,
          bubbleText:creation.bubbleText,
          safety:creation.safety,
          actions:creation.actions
        }].slice(-MAX_MESSAGES);
        save();
        render();

        if (creation.safety) announce('Whit pausou símbolo, pesquisa e caminhos para priorizar cuidado humano imediato.');
        else if (creation.execution?.kind === 'route' && typeof navigate === 'function') {
          announce(`Whit compreendeu o comando e vai abrir ${creation.execution.label}.`);
          setTimeout(() => {
            navigate(creation.execution.route);
            notify(`${profile.preferredName ? `${profile.preferredName.split(' ')[0]}, ` : ''}eu abri ${creation.execution.label}. Você continua no comando.`, { duration:9500 });
          }, 520);
        } else if (creation.matterQuery) announce('Whit criou pontes externas de pesquisa; nenhuma delas abrirá sem o seu toque.');
        else if (creation.actions.length) announce(`Whit encontrou ${creation.actions.length} ${creation.actions.length === 1 ? 'caminho possível' : 'caminhos possíveis'}.`);
        else announce('Whit respondeu por um balão mágico e preservou sua escolha.');
      } catch {
        messages = [...messages, {
          role:'whit',
          text:'Eu não consegui organizar a matéria desta vez. Sua mensagem continua somente neste aparelho; tente dizer o nome de uma área, uma carta ou um tema público para pesquisar.',
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
          matterLabel:'Matéria interrompida · nenhum comando executado',
          matterSignature:'REFAZER',
          matterQuery:'',
          bubbleText:'A matéria pede uma nova formulação.',
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
        renderMatter();
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
    announce('A conversa local foi limpa. Nome, balões e escolha espiritual continuam sob seu controle.');
  });

  renderQuickPaths();
  render();
  return Object.freeze({
    activate:render,
    visit,
    notify,
    hidePresence,
    version:MATTER_ENGINE_VERSION
  });
}
