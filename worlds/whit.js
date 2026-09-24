const STORAGE_KEY = 'divina-bruxa-3.whit.conversa-local.v1';
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const opening = Object.freeze({
  role:'whit',
  text:'Estou aqui. Você não precisa organizar tudo antes de começar. Traga uma pergunta, uma imagem ou apenas o ponto que está mais vivo agora.'
});

function loadMessages() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(value) && value.length ? value.filter(item => item && ['user','whit'].includes(item.role) && typeof item.text === 'string').slice(-40) : [opening];
  } catch { return [opening]; }
}

function localResponse(input, mode) {
  const text = normalize(input);
  let response;
  if (/amor|relacao|relacionamento|pessoa|saudade/.test(text)) {
    response = 'Separe três coisas: o que você sente, o que realmente foi demonstrado e o limite que protege a sua dignidade. Qual dessas três está sendo confundida com as outras?';
  } else if (/trabalho|dinheiro|carreira|projeto|vender/.test(text)) {
    response = 'Volte ao concreto: qual resultado você procura, qual recurso já existe e qual é o menor movimento verificável nas próximas 24 horas?';
  } else if (/medo|ansiedade|ansiosa|confus|travada|travado/.test(text)) {
    response = 'Antes de interpretar, reduza o campo. Nomeie o fato presente, a história que a mente acrescentou e uma ação pequena que devolva segurança agora.';
  } else if (/carta|tarot|tiragem|orbe/.test(text)) {
    response = 'Olhe novamente para a imagem antes do significado. O que se move, o que permanece e para onde a figura dirige a atenção? Essa observação pode ser o primeiro fio da leitura.';
  } else {
    response = 'Eu ouvi o centro da sua frase. Se você retirasse a urgência por um instante, qual pergunta mais honesta permaneceria?';
  }
  if (mode === 'clareza') response += '\n\nTransforme isso em uma frase: “Eu sei…, ainda não sei…, e agora posso…”.';
  if (mode === 'integracao') response += '\n\nEscolha um gesto de integração que caiba no corpo, no tempo e na realidade de hoje.';
  return response;
}

export function createWhitWorld({ announce }) {
  const nodes = {
    modes:document.querySelector('#whitModes'),
    conversation:document.querySelector('#whitConversation'),
    form:document.querySelector('#whitForm'),
    input:document.querySelector('#whitInput'),
    clear:document.querySelector('#whitClear')
  };
  let mode = 'escuta';
  let messages = loadMessages();

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40))); } catch {}
  }

  function render() {
    const fragment = document.createDocumentFragment();
    messages.forEach(message => {
      const item = document.createElement('div');
      item.className = `whit-message whit-message--${message.role}`;
      const label = document.createElement('small');
      label.textContent = message.role === 'whit' ? 'Whit · presença local' : 'Você';
      const text = document.createElement('span');
      text.textContent = message.text;
      item.append(label, text);
      fragment.append(item);
    });
    nodes.conversation.replaceChildren(fragment);
    nodes.conversation.scrollTop = nodes.conversation.scrollHeight;
  }

  nodes.modes.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    nodes.modes.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    announce(`Whit em modo ${button.textContent}.`);
  }));

  nodes.form.addEventListener('submit', event => {
    event.preventDefault();
    const input = nodes.input.value.trim();
    if (!input) return;
    messages.push({ role:'user', text:input }, { role:'whit', text:localResponse(input, mode) });
    messages = messages.slice(-40);
    nodes.input.value = '';
    save();
    render();
    announce('Whit respondeu localmente.');
  });

  nodes.clear.addEventListener('click', () => {
    if (nodes.clear.dataset.armed !== 'true') {
      nodes.clear.dataset.armed = 'true';
      nodes.clear.textContent = 'Confirmar limpeza';
      setTimeout(() => { if (nodes.clear.isConnected) { nodes.clear.dataset.armed = 'false'; nodes.clear.textContent = 'Limpar conversa'; } }, 4500);
      return;
    }
    messages = [opening];
    nodes.clear.dataset.armed = 'false';
    nodes.clear.textContent = 'Limpar conversa';
    save();
    render();
    announce('A conversa local com Whit foi limpa.');
  });

  render();
  return Object.freeze({ activate:render });
}
