(() => {
  'use strict';
  const form = document.querySelector('[data-lens-form]');
  const result = document.querySelector('[data-lens-result]');
  if (!form || !result) return;
  const fields = {
    title: result.querySelector('[data-lens-title]'),
    summary: result.querySelector('[data-lens-summary]'),
    image: result.querySelector('[data-lens-image]'),
    power: result.querySelector('[data-lens-power]'),
    tension: result.querySelector('[data-lens-tension]'),
    question: result.querySelector('[data-lens-question]')
  };
  const contexts = { geral:'Momento geral', amor:'Relações', trabalho:'Trabalho', espiritual:'Espiritualidade' };
  const cards = {
    sol: {
      name:'O Sol', summary:'Clareza, vitalidade e algo que pode ser visto com menos mediação.', image:'Luz aberta, presença e visibilidade.',
      geral:['Reconhecer o que já está claro e compartilhar energia com simplicidade.','Excesso de exposição, otimismo sem verificação ou necessidade de aprovação.','O que está realmente claro — e o que ainda precisa ser confirmado?'],
      amor:['Criar transparência, alegria compartilhada e espaço para ser visto.','Expor demais a relação ou exigir felicidade constante para validar o vínculo.','Que verdade pode ser celebrada sem ignorar os limites de cada pessoa?'],
      trabalho:['Dar visibilidade a resultados, colaborar e comunicar com confiança.','Confundir reconhecimento com valor pessoal ou prometer além das evidências.','Que resultado concreto merece aparecer — e qual ainda precisa de prova?'],
      espiritual:['Cultivar presença, gratidão e uma prática que aumenta clareza.','Buscar iluminação como desempenho ou negar emoções difíceis em nome da luz.','Que prática torna minha percepção mais honesta, não apenas mais agradável?']
    },
    lua: {
      name:'A Lua', summary:'Sensibilidade, ambiguidade e percepção que ainda precisa de verificação.', image:'Caminho noturno, reflexos, instinto e formas parcialmente visíveis.',
      geral:['Escutar sinais internos e tolerar um período de incerteza sem pressa.','Transformar medo, impressão ou desejo em certeza sobre os fatos.','O que eu percebo, o que eu sei e qual informação ainda falta?'],
      amor:['Reconhecer emoções sutis e conversar sobre inseguranças com cuidado.','Projetar intenções na outra pessoa ou alimentar narrativas sem confirmação.','Que sentimento é meu — e o que precisa ser perguntado diretamente?'],
      trabalho:['Perceber clima, riscos pouco claros e informações incompletas.','Decidir apenas por ansiedade, rumor ou promessa vaga.','Qual dado verificável reduziria a incerteza desta decisão?'],
      espiritual:['Acolher sonhos, símbolos e imaginação como materiais de reflexão.','Tratar experiência subjetiva como prova universal ou ordem externa.','Como honrar o símbolo sem abandonar discernimento e realidade?']
    },
    'cinco-copas': {
      name:'5 de Copas', summary:'Perda, elaboração emocional e recursos que continuam disponíveis.', image:'Atenção voltada ao que caiu, enquanto parte das taças permanece de pé.',
      geral:['Reconhecer uma perda real e permitir que o luto informe a próxima escolha.','Fixar a identidade no que terminou e deixar de perceber apoio restante.','O que precisa ser lamentado — e qual recurso continua comigo?'],
      amor:['Nomear decepção e cuidar do que ainda pode ser reparado com consentimento.','Repetir a dor como prova de que todo vínculo terminará da mesma forma.','O que foi perdido, o que permanece e o que depende de duas pessoas?'],
      trabalho:['Aprender com um resultado frustrante e preservar competências adquiridas.','Confundir um revés com incapacidade permanente ou ignorar alternativas.','Que aprendizado concreto pode acompanhar a próxima tentativa?'],
      espiritual:['Dar lugar à tristeza sem exigir uma explicação mística imediata.','Usar a espiritualidade para apagar dor ou atribuir culpa ao sofrimento.','Que gesto de cuidado é possível antes de buscar um significado maior?']
    },
    'dois-espadas': {
      name:'2 de Espadas', summary:'Pausa decisória, informação incompleta e equilíbrio provisório.', image:'Duas forças sustentadas enquanto a visão permanece limitada.',
      geral:['Criar silêncio para comparar opções e reunir o dado que falta.','Adiar indefinidamente ou fingir equilíbrio para evitar desconforto.','Qual decisão é realmente necessária e qual informação pode sustentá-la?'],
      amor:['Estabelecer pausa e limite antes de responder sob pressão.','Evitar conversa necessária ou neutralizar sentimentos para não escolher.','O que pode ser dito com clareza sem decidir pela outra pessoa?'],
      trabalho:['Comparar critérios, riscos e consequências antes de assumir compromisso.','Paralisar diante de opções imperfeitas ou esconder conflito relevante.','Qual critério objetivo pode desempatar esta escolha?'],
      espiritual:['Praticar discernimento e aceitar que nem toda resposta chega imediatamente.','Usar silêncio como fuga ou esperar um sinal que elimine toda responsabilidade.','Que parte da escolha continua sendo minha mesmo sem certeza total?']
    }
  };
  const render = ({ focus = false } = {}) => {
    const data = new FormData(form);
    const card = cards[data.get('card')] || cards.sol;
    const contextKey = contexts[data.get('context')] ? data.get('context') : 'geral';
    const [power,tension,question] = card[contextKey];
    fields.title.textContent = `${card.name} · ${contexts[contextKey]}`;
    fields.summary.textContent = card.summary;
    fields.image.textContent = card.image;
    fields.power.textContent = power;
    fields.tension.textContent = tension;
    fields.question.textContent = question;
    if (focus) fields.title.focus({ preventScroll:true });
  };
  form.addEventListener('submit', event => { event.preventDefault(); render({ focus:true }); });
  form.addEventListener('change', () => render());
  render();
})();
