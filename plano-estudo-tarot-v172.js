(() => {
  'use strict';

  const sessions = Object.freeze([
    { phase:'FASE 1 · MAPA DO BARALHO', title:'Prepare seu caderno de observação', focus:'Defina um lugar simples para registrar imagem, hipótese, consulta e revisão.', recall:'Escreva o que você acredita que o Tarot pode e não pode fazer.', practice:'Crie quatro campos: observei, associei, consultei e revisarei.', compare:'Compare uma anotação puramente visual com outra baseada em uma palavra-chave.', review:'Defina uma intenção de estudo que preserve sua autonomia.', link:'guias-para-comecar.html', label:'Usar o guia para começar' },
    { phase:'FASE 1 · MAPA DO BARALHO', title:'Mapeie as 78 cartas', focus:'Veja o baralho como uma arquitetura de famílias antes de estudar cartas isoladas.', recall:'Anote quantas cartas você acredita que existam em cada grande grupo.', practice:'Desenhe a conta 78 = 22 Maiores + 56 Menores; divida os Menores em quatro grupos de 14.', compare:'Compare a função geral dos Maiores com a dos Menores em duas frases.', review:'Feche a fonte e reconstrua a conta sem olhar.', link:'tarot-para-iniciantes.html', label:'Entender os fundamentos' },
    { phase:'FASE 1 · MAPA DO BARALHO', title:'Observe os Maiores de 0 a 7', focus:'Acompanhe o começo da jornada do Louco ao Carro sem reduzir cada carta a uma palavra.', recall:'Liste os nomes entre O Louco e O Carro que você já recorda.', practice:'Observe as oito imagens e registre personagem, objeto e direção de cada uma.', compare:'Escolha duas cartas e descreva o que muda entre potencial e ação.', review:'Conte o trecho inteiro em uma frase de movimento.', link:'arcanos-maiores.html', label:'Abrir os Arcanos Maiores' },
    { phase:'FASE 1 · MAPA DO BARALHO', title:'Observe os Maiores de 8 a 14', focus:'Perceba domínio, recolhimento, mudança, ajuste, suspensão, transformação e integração.', recall:'Tente nomear as cartas entre A Força e A Temperança na ordem.', practice:'Escolha três imagens e descreva o gesto central antes de consultar significados.', compare:'Compare duas formas de equilíbrio presentes neste trecho.', review:'Marque apenas os nomes ou transições que ainda confundem você.', link:'arcanos-maiores.html', label:'Comparar a sequência' },
    { phase:'FASE 1 · MAPA DO BARALHO', title:'Observe os Maiores de 15 a 21', focus:'Investigue tensão, ruptura, esperança, incerteza, clareza, chamado e integração.', recall:'Tente nomear as sete cartas finais sem abrir a biblioteca.', practice:'Escolha três cenas e escreva o que muda do conflito para a integração.', compare:'Compare A Lua e O Sol apenas por elementos visuais observáveis.', review:'Resuma a passagem do Diabo ao Mundo sem usar a palavra destino.', link:'arcanos-maiores.html', label:'Concluir a jornada' },
    { phase:'FASE 1 · MAPA DO BARALHO', title:'Reconstrua a jornada dos Maiores', focus:'Use a tentativa de lembrar para localizar lacunas reais, sem transformar erro em punição.', recall:'Liste os 22 Arcanos Maiores na ordem que vier à memória.', practice:'Confira a sequência e circule somente ausências, trocas ou posições duvidosas.', compare:'Agrupe as cartas em três movimentos criados por você e explique o critério.', review:'Reescreva apenas o trecho em que houve mais lacunas.', link:'cartas-do-tarot.html', label:'Conferir na biblioteca' },
    { phase:'FASE 1 · MAPA DO BARALHO', title:'Conte a jornada em sete frases', focus:'Comprima a primeira semana em relações que você consiga explicar com a própria voz.', recall:'Diga em voz alta a conta 22 + 56 e os nomes dos quatro naipes.', practice:'Escreva sete frases cobrindo do Louco ao Mundo em blocos de cartas.', compare:'Escolha a carta mais clara e a mais difícil; registre por que a diferença existe.', review:'Defina quais três Maiores voltarão ao seu próximo ciclo de revisão.', link:'carta-00-o-louco.html', label:'Recomeçar pelo Louco' },
    { phase:'FASE 2 · GRAMÁTICA DOS MENORES', title:'Conheça os quatro naipes', focus:'Associe cada naipe a um domínio sem tratá-lo como significado rígido.', recall:'Nomeie os quatro naipes e qualquer elemento ou tema que você associe a eles.', practice:'Crie quatro colunas para Paus, Copas, Espadas e Ouros e registre ações, cenas e assuntos.', compare:'Escolha uma situação cotidiana e veja como cada naipe faria uma pergunta diferente sobre ela.', review:'Escreva uma frase de contraste entre cada par de naipes.', link:'arcanos-menores.html', label:'Abrir os 56 Menores' },
    { phase:'FASE 2 · GRAMÁTICA DOS MENORES', title:'Compare Ases e Dois', focus:'Observe como começo e dualidade mudam quando atravessam os quatro naipes.', recall:'Escreva o que Ás e Dois sugerem para você antes de ver as cartas.', practice:'Coloque os quatro Ases ao lado dos quatro Dois e descreva o movimento de cada par.', compare:'Compare o mesmo número em dois naipes e o mesmo naipe nos dois números.', review:'Crie uma pergunta que ajude a distinguir início de relação.', link:'numerologia-no-tarot.html', label:'Estudar números no Tarot' },
    { phase:'FASE 2 · GRAMÁTICA DOS MENORES', title:'Compare Três e Quatro', focus:'Procure expansão e estrutura sem obrigar todas as imagens a dizerem a mesma coisa.', recall:'Tente lembrar uma carta Três e uma carta Quatro de qualquer naipe.', practice:'Observe as oito cartas e marque sinais de crescimento, grupo, pausa, proteção ou limite.', compare:'Explique como expansão pode ajudar ou tensionar uma estrutura.', review:'Escolha uma imagem e sintetize número + naipe em uma frase.', link:'numerologia-no-tarot.html', label:'Comparar Três e Quatro' },
    { phase:'FASE 2 · GRAMÁTICA DOS MENORES', title:'Compare Cinco e Seis', focus:'Acompanhe como tensão e resposta aparecem de formas diferentes em cada elemento.', recall:'Liste ideias que você associa aos números Cinco e Seis.', practice:'Descreva o problema visível em cada Cinco e a mudança visível em cada Seis.', compare:'Escolha um naipe e conte a passagem do Cinco ao Seis sem consultar texto.', review:'Registre onde sua primeira hipótese mudou depois da observação.', link:'numerologia-no-tarot.html', label:'Comparar Cinco e Seis' },
    { phase:'FASE 2 · GRAMÁTICA DOS MENORES', title:'Compare Sete e Oito', focus:'Investigue avaliação, estratégia, persistência, ajuste e movimento nas oito cartas.', recall:'Escreva os Sete ou Oito que você consegue visualizar de memória.', practice:'Para cada naipe, anote um verbo no Sete e outro no Oito.', compare:'Compare velocidade, pausa e direção em duas cartas contrastantes.', review:'Explique por que o número sozinho não encerra uma interpretação.', link:'numerologia-no-tarot.html', label:'Comparar Sete e Oito' },
    { phase:'FASE 2 · GRAMÁTICA DOS MENORES', title:'Compare Nove e Dez', focus:'Observe maturidade, intensidade e fechamento sem confundir conclusão com final feliz obrigatório.', recall:'Diga o que Nove e Dez sugerem antes de abrir as imagens.', practice:'Percorra as oito cartas e registre o que amadurece, pesa, completa ou transborda.', compare:'Compare um Dez confortável e um Dez tenso pela imagem e pelo naipe.', review:'Sintetize a diferença entre chegar ao auge e encerrar um ciclo.', link:'numerologia-no-tarot.html', label:'Comparar Nove e Dez' },
    { phase:'FASE 2 · GRAMÁTICA DOS MENORES', title:'Revise os números entre naipes', focus:'Teste relações entre número e elemento antes de consultar cada significado individual.', recall:'Escolha ao acaso três números e diga o movimento geral que você associa a cada um.', practice:'Para um número, explique sua expressão em Paus, Copas, Espadas e Ouros.', compare:'Repita com outro número e marque onde a lógica funciona ou precisa de contexto.', review:'Liste cinco cartas numeradas que merecem nova visita.', link:'cartas-do-tarot.html', label:'Conferir as cartas' },
    { phase:'FASE 3 · PERSONAGENS E SÍMBOLOS', title:'Compare os quatro Pajens', focus:'Leia o Pajem como possibilidade de aprender, receber ou iniciar algo em cada naipe.', recall:'Anote tudo que a ideia de Pajem desperta antes de ver as cartas.', practice:'Observe postura, objeto, cenário e direção dos quatro Pajens.', compare:'Escreva como curiosidade muda entre Fogo, Água, Ar e Terra.', review:'Crie uma frase que leia Pajem como atitude, não como pessoa fixa.', link:'figuras-da-corte-no-tarot.html', label:'Abrir as figuras da corte' },
    { phase:'FASE 3 · PERSONAGENS E SÍMBOLOS', title:'Compare os quatro Cavaleiros', focus:'Reconheça modos de buscar, agir e avançar sem ordenar um como melhor que os outros.', recall:'Visualize um Cavaleiro e descreva sua direção de memória.', practice:'Compare velocidade, postura, montaria, objeto e paisagem nas quatro cartas.', compare:'Escolha dois Cavaleiros e descreva quando cada ritmo seria recurso ou tensão.', review:'Escreva quatro verbos, um para cada Cavaleiro.', link:'figuras-da-corte-no-tarot.html', label:'Estudar os Cavaleiros' },
    { phase:'FASE 3 · PERSONAGENS E SÍMBOLOS', title:'Compare as quatro Rainhas', focus:'Observe maturidade e domínio interior sem limitar as figuras a um gênero.', recall:'Escreva o que diferencia uma Rainha de um Pajem ou Cavaleiro.', practice:'Descreva olhar, trono, objeto e ambiente das quatro Rainhas.', compare:'Leia duas Rainhas como atitudes disponíveis na mesma situação.', review:'Sintetize como receptividade pode assumir quatro linguagens.', link:'figuras-da-corte-no-tarot.html', label:'Estudar as Rainhas' },
    { phase:'FASE 3 · PERSONAGENS E SÍMBOLOS', title:'Compare os quatro Reis', focus:'Investigue direção, responsabilidade e expressão externa do elemento.', recall:'Anote o que você espera encontrar visualmente em um Rei.', practice:'Observe posição, objeto, ambiente e grau de movimento dos quatro Reis.', compare:'Compare autoridade flexível e rígida em duas imagens, sem torná-las diagnóstico de pessoa.', review:'Escreva uma responsabilidade possível para cada Rei.', link:'figuras-da-corte-no-tarot.html', label:'Estudar os Reis' },
    { phase:'FASE 3 · PERSONAGENS E SÍMBOLOS', title:'Use três lentes para a corte', focus:'Pratique ler uma figura como pessoa possível, atitude ou estágio, sempre guiada pelo contexto.', recall:'Nomeie as quatro categorias da corte e um verbo associado a cada uma.', practice:'Escolha uma figura e escreva três leituras: pessoa, atitude e estágio de desenvolvimento.', compare:'Repita em uma pergunta diferente e observe qual lente se torna mais útil.', review:'Registre por que uma carta da corte não prova algo sobre um terceiro.', link:'figuras-da-corte-no-tarot.html', label:'Rever as três lentes' },
    { phase:'FASE 3 · PERSONAGENS E SÍMBOLOS', title:'Escolha oito símbolos recorrentes', focus:'Construa um vocabulário visual que permaneça ligado à cena e à pergunta.', recall:'Liste oito símbolos de Tarot que você consegue imaginar agora.', practice:'Observe água, montanha, caminho, coroa, espada, taça, estrela e mãos em cartas diferentes.', compare:'Escolha um símbolo e explique como muda em duas cenas.', review:'Escreva uma pergunta de observação para usar sempre que o símbolo reaparecer.', link:'simbolos-do-tarot.html', label:'Explorar 32 símbolos' },
    { phase:'FASE 3 · PERSONAGENS E SÍMBOLOS', title:'Descreva quatro cartas sem consultar', focus:'Separe evidência visual, associação pessoal e referência estudada.', recall:'Escreva três regras do seu processo de observação.', practice:'Abra quatro cartas e registre somente personagens, objetos, cores, direção e movimento.', compare:'Agora consulte a biblioteca e marque o que sua observação sustentou ou não percebeu.', review:'Reescreva uma interpretação deixando clara a diferença entre imagem e associação.', link:'tarot-livre.html', label:'Observar no Tarot Livre' },
    { phase:'FASE 4 · LEITURA E RESPONSABILIDADE', title:'Formule uma pergunta útil', focus:'Troque busca de certeza por contexto, possibilidades, recursos e ação observável.', recall:'Anote uma pergunta fechada ou determinista que você já tenha visto.', practice:'Reescreva essa pergunta em três versões abertas: compreender, avaliar e agir.', compare:'Leia as versões e identifique qual devolve mais autonomia à pessoa.', review:'Escolha uma pergunta e defina claramente seu contexto e limite.', link:'como-fazer-perguntas-ao-tarot.html', label:'Reformular perguntas' },
    { phase:'FASE 4 · LEITURA E RESPONSABILIDADE', title:'Conduza uma leitura de uma carta', focus:'Una observação, pergunta e síntese sem pedir que uma imagem resolva tudo.', recall:'Diga os cinco movimentos da leitura: observar, perceber, estudar, contextualizar e sintetizar.', practice:'Abra uma carta direta e registre uma linha para cada movimento.', compare:'Escreva uma síntese precipitada e uma síntese contextual; identifique a diferença.', review:'Finalize com uma pergunta ou ação pequena que possa ser observada na realidade.', link:'tiragem-de-uma-carta.html', label:'Usar a tiragem de uma carta' },
    { phase:'FASE 4 · LEITURA E RESPONSABILIDADE', title:'Mude a posição, mude o foco', focus:'Perceba como a função definida antes da abertura orienta a leitura da mesma carta.', recall:'Liste três posições que podem organizar uma leitura simples.', practice:'Escolha uma carta e leia-a como recurso, desafio e próximo passo.', compare:'Sublinhe o que permaneceu na carta e o que mudou por causa da posição.', review:'Escreva por que posição não é sinônimo de significado fixo.', link:'metodologia-do-tarot.html', label:'Entender posição e contexto' },
    { phase:'FASE 4 · LEITURA E RESPONSABILIDADE', title:'Leia uma sequência de três cartas', focus:'Interprete partes e relações antes de produzir uma conclusão única.', recall:'Reconstrua as posições situação, desafio e conselho sem consultar.', practice:'Abra três cartas, descreva cada imagem e responda apenas à sua posição.', compare:'Procure apoio, contraste ou passagem entre a primeira e a terceira carta.', review:'Escreva uma síntese em até três frases, preservando possibilidades.', link:'tiragem-de-tres-cartas.html', label:'Abrir o método de três cartas' },
    { phase:'FASE 4 · LEITURA E RESPONSABILIDADE', title:'Pratique combinações', focus:'Leia relações sem fundir duas cartas em uma palavra-chave genérica.', recall:'Liste quatro eixos de comparação entre cartas.', practice:'Escolha duas cartas e compare elemento, número, direção e cena.', compare:'Leia o par como apoio, contraste e sequência; note como a relação muda.', review:'Retorne às posições e escreva qual relação é mais coerente com a pergunta.', link:'combinacoes-de-cartas-no-tarot.html', label:'Estudar combinações' },
    { phase:'FASE 4 · LEITURA E RESPONSABILIDADE', title:'Defina seus limites éticos', focus:'Transforme responsabilidade em decisões concretas antes de ler para outra pessoa.', recall:'Liste situações em que uma leitura deve parar ou mudar de linguagem.', practice:'Escreva seus compromissos sobre consentimento, privacidade, autonomia e não diagnóstico.', compare:'Reescreva uma afirmação determinista como possibilidade contextual.', review:'Defina como indicar ajuda qualificada quando a questão ultrapassar o Tarot.', link:'etica-e-responsabilidade.html', label:'Ler os princípios éticos' },
    { phase:'FASE 4 · LEITURA E RESPONSABILIDADE', title:'Conduza uma leitura completa', focus:'Integre pergunta, posições, imagens, relações, síntese, limite e ação possível.', recall:'Escreva a ordem do seu método antes de abrir qualquer carta.', practice:'Escolha uma tiragem pequena e registre cada etapa sem pular a observação.', compare:'Leia sua síntese e procure certezas absolutas, projeções ou trechos sem apoio visual.', review:'Revise a linguagem e anote uma ação concreta que possa ser avaliada depois.', link:'tiragens-de-tarot.html', label:'Escolher uma tiragem' },
    { phase:'FECHAMENTO · DIAGNÓSTICO', title:'Crie um mapa das lacunas', focus:'Descubra o que precisa de nova prática em vez de medir seu valor por uma nota.', recall:'Liste 10 cartas que ainda parecem difíceis sem abrir a biblioteca.', practice:'Separe-as em três grupos: não reconheço, reconheço sem explicar e explico sem contextualizar.', compare:'Escolha uma carta de cada grupo e identifique o próximo exercício necessário.', review:'Monte uma lista curta de revisão para a próxima semana.', link:'buscar.html', label:'Buscar o que precisa revisar' },
    { phase:'FECHAMENTO · CONTINUIDADE', title:'Faça uma leitura e escolha o próximo ciclo', focus:'Compare sua escrita inicial com o método que você consegue aplicar agora.', recall:'Refaça de memória o mapa 78 = 22 + 56 e os passos de uma leitura simples.', practice:'Conduza uma leitura de uma ou três cartas com pergunta, posições e síntese registradas.', compare:'Leia a anotação do dia 1 e marque mudanças em observação, linguagem e limites.', review:'Escolha uma família de cartas e defina três metas realistas para os próximos 30 dias.', link:'escola-do-tarot.html', label:'Continuar na Escola' }
  ]);

  const form = document.querySelector('[data-study-planner]');
  const select = document.querySelector('[data-study-day]');
  const result = document.querySelector('[data-study-result]');
  if (!form || !select || !result || sessions.length !== 30) return;

  const count = document.querySelector('[data-study-count]');
  const progress = document.querySelector('[data-study-progress]');
  const phase = document.querySelector('[data-study-phase]');
  const durationLabel = document.querySelector('[data-study-duration]');
  const title = document.querySelector('[data-study-title]');
  const focus = document.querySelector('[data-study-focus]');
  const number = document.querySelector('[data-study-number]');
  const steps = document.querySelector('[data-study-steps]');
  const support = document.querySelector('[data-study-support]');
  const anchor = document.querySelector('[data-study-anchor]');
  const previous = document.querySelector('[data-day-prev]');
  const next = document.querySelector('[data-day-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const durationPlans = Object.freeze({
    10: [
      ['2 min · Recordar', 'recall'],
      ['5 min · Praticar', 'practice'],
      ['3 min · Registrar', 'review']
    ],
    20: [
      ['3 min · Recordar', 'recall'],
      ['9 min · Praticar', 'practice'],
      ['5 min · Comparar', 'compare'],
      ['3 min · Registrar', 'review']
    ],
    30: [
      ['5 min · Recordar', 'recall'],
      ['12 min · Praticar', 'practice'],
      ['8 min · Comparar', 'compare'],
      ['5 min · Explicar', 'review']
    ]
  });

  const selectedDuration = () => Number(form.elements.duration.value) || 10;

  const makeStep = ([label, key], session) => {
    const item = document.createElement('li');
    const heading = document.createElement('b');
    const copy = document.createElement('span');
    heading.textContent = label;
    copy.textContent = session[key];
    item.append(heading, copy);
    return item;
  };

  const render = ({ moveFocus = false, scroll = false } = {}) => {
    const day = Math.min(30, Math.max(1, Number(select.value) || 1));
    const duration = selectedDuration();
    const session = sessions[day - 1];

    count.textContent = `Dia ${day} de 30`;
    progress.style.width = `${(day / 30) * 100}%`;
    phase.textContent = session.phase;
    durationLabel.textContent = `${duration} MINUTOS`;
    title.textContent = session.title;
    focus.textContent = session.focus;
    number.textContent = String(day).padStart(2, '0');
    steps.replaceChildren(...durationPlans[duration].map(step => makeStep(step, session)));
    support.href = session.link;
    support.textContent = session.label;
    anchor.href = `#dia-${day}`;
    previous.disabled = day === 1;
    next.disabled = day === 30;

    if (moveFocus) title.focus({ preventScroll: true });
    if (scroll) result.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  const moveDay = delta => {
    select.value = String(Math.min(30, Math.max(1, Number(select.value) + delta)));
    render({ moveFocus: true, scroll: true });
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    render({ moveFocus: true, scroll: true });
  });
  select.addEventListener('change', () => render());
  form.querySelectorAll('input[name="duration"]').forEach(input => input.addEventListener('change', () => render()));
  previous.addEventListener('click', () => moveDay(-1));
  next.addEventListener('click', () => moveDay(1));

  render();
})();
