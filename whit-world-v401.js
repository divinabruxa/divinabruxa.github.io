/*
 * DIVINA BRUXA 4.0.5 · WHIT PELA ORBE DAS REALIDADES
 *
 * Whit existe somente em sua própria realidade, não interrompe outras
 * páginas e não executa caminhos sem um toque.
 */

import { normalizePreferredName, safeResearchHref } from './matter-engine-v400.js';
import { STORY_ENGINE_VERSION, storyResponse } from './tarot-orbe-realities-engine-v405.js';

const STORAGE_KEY = 'divina-bruxa-3.whit.conversa-local.v10';
const PROFILE_KEY = 'divina-bruxa-3.whit.materia.v1';
const SPIRIT_MODE_KEY = 'divina-bruxa-3.whit.espirito.v1';
const MAX_MESSAGES = 36;
const ROUTE_PATTERN = /^[a-z0-9-]+$/;
const PAGE_PATTERN = /^[a-z0-9][a-z0-9-]*\.html$/;

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);

function storedPreference() {
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
    return normalizePreferredName(value?.preferredName);
  } catch {
    return '';
  }
}

function storedSpiritMode() {
  try {
    const value = clean(localStorage.getItem(SPIRIT_MODE_KEY), 30);
    return ['livre', 'jesus', 'cacurucaia', 'duas-vozes'].includes(value) ? value : 'livre';
  } catch {
    return 'livre';
  }
}

function validAction(item) {
  if (!item || typeof item !== 'object') return null;
  const kind = ['route', 'card', 'guide', 'research'].includes(item.kind) ? item.kind : '';
  const route = clean(item.route, 60);
  const href = clean(item.href, 500);
  const routeIsSafe = kind === 'route' && ROUTE_PATTERN.test(route) && href === `#/${route}`;
  const pageIsSafe = ['card', 'guide'].includes(kind) && PAGE_PATTERN.test(href);
  const researchIsSafe = kind === 'research' && safeResearchHref(href) === href;
  if ((!routeIsSafe && !pageIsSafe && !researchIsSafe) || !clean(item.label, 100)) return null;
  return {
    kind,
    ...(routeIsSafe ? { route } : {}),
    href,
    label:clean(item.label, 100),
    description:clean(item.description, 190),
    external:researchIsSafe
  };
}

function validMessage(item) {
  if (!item || !['user', 'whit'].includes(item.role)) return null;
  const text = clean(item.text);
  if (!text) return null;
  if (item.role === 'user') return { role:'user', text:clean(text, 700) };
  return {
    role:'whit',
    text,
    title:clean(item.title, 140),
    signature:clean(item.signature, 30),
    safety:Boolean(item.safety),
    actions:Array.isArray(item.actions) ? item.actions.map(validAction).filter(Boolean).slice(0, 4) : []
  };
}

function loadMessages() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(validMessage).filter(Boolean).slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

export function createWhitWorld({ announce, navigate, cards = [], worlds = {}, guides = [] }) {
  const nodes = {
    chamber:document.querySelector('.whit-chamber'),
    conversation:document.querySelector('#whitConversation'),
    form:document.querySelector('#whitForm'),
    input:document.querySelector('#whitInput'),
    clear:document.querySelector('#whitClear')
  };
  nodes.submit = nodes.form.querySelector('button[type="submit"]');

  const preferredName = storedPreference();
  const spiritMode = storedSpiritMode();
  let messages = loadMessages();
  let thinking = false;
  let clearTimer = 0;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES))); } catch {}
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
        announce?.(`${action.label} foi aberto por sua escolha.`);
      });
    } else if (action.kind === 'research') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.referrerPolicy = 'no-referrer';
    }
    return link;
  }

  function render() {
    const fragment = document.createDocumentFragment();
    messages.forEach(message => {
      const item = document.createElement('article');
      item.className = `whit-message whit-message--${message.role}${message.safety ? ' whit-message--care' : ''}`;
      const label = document.createElement('small');
      label.textContent = message.role === 'whit' ? 'Whit' : 'Você';
      item.append(label);

      if (message.role === 'whit' && message.title) {
        const title = document.createElement('h3');
        title.className = 'whit-story-title';
        title.textContent = message.title;
        item.append(title);
      }

      const text = document.createElement('span');
      text.textContent = message.text;
      item.append(text);

      if (message.role === 'whit' && message.actions.length) {
        const paths = document.createElement('nav');
        paths.className = 'whit-message__paths';
        paths.setAttribute('aria-label', 'Continuações possíveis');
        message.actions.forEach(action => paths.append(renderAction(action)));
        item.append(paths);
      }

      if (message.role === 'whit') {
        const signature = document.createElement('em');
        signature.textContent = `ORBE ${message.signature || 'LOCAL'} · LEITURA BASEADA NAS CARTAS`;
        item.append(signature);
      }
      fragment.append(item);
    });
    nodes.conversation.replaceChildren(fragment);
    nodes.conversation.dataset.empty = String(messages.length === 0);
    nodes.conversation.scrollTop = nodes.conversation.scrollHeight;
  }

  function setThinking(active) {
    thinking = active;
    nodes.chamber.dataset.thinking = String(active);
    nodes.conversation.setAttribute('aria-busy', String(active));
    nodes.input.disabled = active;
    nodes.submit.disabled = active;
    nodes.submit.textContent = active ? 'Whit está organizando sua leitura…' : 'Conversar com Whit';
  }

  nodes.form.addEventListener('submit', event => {
    event.preventDefault();
    const input = clean(nodes.input.value, 700);
    if (!input || thinking) return;
    const history = messages.slice(-12);
    messages = [...messages, { role:'user', text:input }].slice(-MAX_MESSAGES);
    nodes.input.value = '';
    save();
    render();
    setThinking(true);

    requestAnimationFrame(() => {
      try {
        const creation = storyResponse(input, {
          mode:'integracao',
          spiritMode,
          preferredName,
          currentRoute:'whit',
          history,
          cards,
          worlds,
          guides
        });
        const next = validMessage({
          role:'whit',
          text:creation.text,
          title:creation.storyTitle,
          signature:creation.storySignature,
          safety:creation.safety,
          actions:creation.actions
        });
        if (next) messages = [...messages, next].slice(-MAX_MESSAGES);
        save();
        render();
        if (creation.safety) announce?.('Whit priorizou apoio humano imediato.');
        else announce?.(`Whit trouxe uma leitura de Tarot${creation.storyCard?.name ? ` por ${creation.storyCard.name}` : ''}.`);
      } catch {
        messages = [...messages, {
          role:'whit',
          title:'O Tarot permanece em silêncio por um instante',
          text:'A leitura não conseguiu se organizar agora. Nenhum significado foi inventado e nenhum caminho foi executado. Quando quiser, apresente a situação novamente ou escreva o nome de uma carta.',
          signature:'SILÊNCIO',
          safety:false,
          actions:[]
        }].slice(-MAX_MESSAGES);
        save();
        render();
        announce?.('Nenhum caminho foi executado. Whit pediu uma nova formulação.');
      } finally {
        setThinking(false);
        nodes.input.focus({ preventScroll:true });
      }
    });
  });

  nodes.clear.addEventListener('click', () => {
    if (thinking) return;
    if (nodes.clear.dataset.armed !== 'true') {
      nodes.clear.dataset.armed = 'true';
      nodes.clear.textContent = 'Confirmar limpeza';
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        if (!nodes.clear.isConnected) return;
        nodes.clear.dataset.armed = 'false';
        nodes.clear.textContent = 'Limpar conversa';
      }, 4500);
      return;
    }
    clearTimeout(clearTimer);
    messages = [];
    nodes.clear.dataset.armed = 'false';
    nodes.clear.textContent = 'Limpar conversa';
    save();
    render();
    announce?.('A conversa local foi limpa.');
  });

  render();
  return Object.freeze({ activate:render, version:STORY_ENGINE_VERSION });
}
