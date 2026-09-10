/* DIVINA BRUXA 2.0 — REBIRTH R001 · WHIT PRESENÇA AMBIENTE V300
   Presença local, textual e contextual. Não lê conteúdo privado e não chama API. */

const ROUTE_MESSAGES = Object.freeze({
  home:['Estou aqui. A Orbe é a porta.', 'Toque a Orbe. O resto do universo pode esperar.', 'Há caminhos dentro desta esfera.'],
  tarot:['Aqui a leitura é livre. Eu não interpreto nada sem você me chamar.', 'Uma carta por vez. Sem pressa, sem destino imposto.'],
  spreads:['Escolha a forma da pergunta antes de procurar uma resposta.', 'Eu posso acompanhar a tiragem depois, se você abrir essa passagem.'],
  library:['Cada carta guarda mais de uma camada. Explore sem obrigação de concluir.', 'Quer aprofundar um símbolo? A Biblioteca é para isso.'],
  daily:['Uma carta para este dia. Sem punição por ontem, sem promessa sobre amanhã.', 'Use a carta como lente, não como sentença.'],
  school:['Aprender Tarot também é aprender a sustentar perguntas.', 'Você não precisa decorar tudo. Volte quando quiser.'],
  journal:['Este espaço é seu. Eu não leio nada daqui sem uma escolha explícita sua.', 'Seu Diário continua privado, mesmo quando eu estou por perto.'],
  consultations:['Aqui começa uma leitura humana, separada da minha presença.', 'Você escolhe quando um símbolo vira conversa com uma pessoa.'],
  store:['Leve apenas o que fizer sentido para a sua prática.', 'A loja é uma porta opcional, não o centro da experiência.'],
  music:['Ouça se quiser mudar o ritmo do espaço. Nada toca sozinho.', 'Música pode acompanhar o ritual sem comandá-lo.'],
  videos:['Quando houver algo novo, este mundo mostra o que realmente foi publicado.', 'Sem episódios inventados. Só o que existe.'],
  skins:['A forma pode mudar. A presença continua sendo a mesma.', 'Uma skin muda a aparência das Orbes, não a sua leitura.'],
  subscriptions:['Premium amplia o universo; Whit continua sendo um caminho separado.', 'Nada precisa parecer pago para ser mágico.'],
  notifications:['Você escolhe o que pode chamar sua atenção.', 'Silêncio também é uma configuração válida.'],
  login:['Sua conta serve para continuidade, não para vigiar sua experiência.', 'Entre apenas quando quiser levar seu universo para outros dispositivos.'],
  ai:['Aqui sou Whit. O que entra nesta conversa continua sob seu controle.', 'Eu posso conectar mundos, mas não possuo nenhum deles.'],
  default:['Posso te acompanhar sem tomar o controle.', 'O universo continua aberto. Escolha o próximo caminho.', 'Se quiser ajuda, toque em mim.']
});

const randomIndex = length => {
  if (length <= 1) return 0;
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1); crypto.getRandomValues(value); return value[0] % length;
  }
  return Math.floor(Math.random() * length);
};

export function createWhitPresenceV300({ core = globalThis.whit, go } = {}) {
  let timer = 0, hideTimer = 0, lastText = '', started = false;
  const root = document.createElement('aside');
  root.id = 'whitPresence';
  root.className = 'whit-presence-v300';
  root.setAttribute('aria-label', 'Whit, presença da Divina Bruxa');
  root.innerHTML = `
    <div class="whit-presence-v300__bubble" aria-live="polite" aria-atomic="true"><span data-whit-text></span><button type="button" data-whit-dismiss aria-label="Fechar mensagem">×</button></div>
    <button class="whit-presence-v300__orb" type="button" data-whit-open aria-label="Abrir Whit"><span data-orb-surface="whit"></span><i aria-hidden="true"></i></button>`;
  document.body.append(root);
  const textNode = root.querySelector('[data-whit-text]');
  const bubble = root.querySelector('.whit-presence-v300__bubble');

  const typing = () => document.activeElement?.matches?.('input,textarea,[contenteditable="true"]');
  const currentRoute = () => document.body.dataset.screen || 'home';
  const choose = route => {
    const family = ROUTE_MESSAGES[route] || ROUTE_MESSAGES.default;
    let value = family[randomIndex(family.length)];
    if (family.length > 1 && value === lastText) value = family[(family.indexOf(value) + 1) % family.length];
    return value;
  };
  const hide = () => bubble.classList.remove('is-visible');
  const speak = (message, { duration = 7200, force = false } = {}) => {
    if (!force && (document.hidden || typing() || document.documentElement.classList.contains('db-menu-open'))) return false;
    const value = String(message || choose(currentRoute())).trim().slice(0, 180);
    if (!value) return false;
    lastText = value;
    textNode.textContent = value;
    bubble.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, duration);
    return true;
  };
  const schedule = () => {
    clearTimeout(timer);
    const delay = 28000 + randomIndex(26000);
    timer = setTimeout(() => { speak(); schedule(); }, delay);
  };
  const onRoute = event => {
    hide();
    const id = event.detail?.id || currentRoute();
    clearTimeout(timer);
    timer = setTimeout(() => { speak(choose(id)); schedule(); }, id === 'home' ? 2500 : 900);
  };
  const start = () => {
    if (started) return;
    started = true;
    root.classList.add('is-awake');
    document.addEventListener('divina:route-ready', onRoute);
    globalThis.addEventListener('whit:whisper', event => speak(event.detail?.phrase, { force:true }));
    root.querySelector('[data-whit-open]').addEventListener('click', () => go?.('ai'));
    root.querySelector('[data-whit-dismiss]').addEventListener('click', hide);
    timer = setTimeout(() => { speak(); schedule(); }, 2600);
    core?.awaken?.();
  };
  const destroy = () => {
    clearTimeout(timer); clearTimeout(hideTimer); root.remove(); started = false;
  };
  return Object.freeze({ start, speak, hide, destroy, element:root });
}
