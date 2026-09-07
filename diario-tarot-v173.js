(() => {
  'use strict';

  const models = Object.freeze({
    one: {
      label: 'UMA CARTA',
      title: 'DIÁRIO DE TAROT · LEITURA DE UMA CARTA',
      essential: [
        'DATA:',
        'PERGUNTA OU INTENÇÃO:',
        'POSIÇÃO DA CARTA:',
        'CARTA:',
        '',
        'O QUE OBSERVO NA IMAGEM:',
        '',
        'MINHA PRIMEIRA HIPÓTESE:',
        '',
        'O QUE CONSULTEI:',
        '',
        'SÍNTESE CONTEXTUAL:',
        '',
        'PRÓXIMO PASSO OBSERVÁVEL:',
        'REVISAR EM:'
      ],
      complete: [
        'DATA E HORÁRIO:',
        'BARALHO:',
        'PERGUNTA OU INTENÇÃO:',
        'CONTEXTO NECESSÁRIO:',
        'POSIÇÃO DEFINIDA:',
        'CARTA:',
        '',
        'PERSONAGENS, OBJETOS E CENÁRIO:',
        '',
        'COR, DIREÇÃO E MOVIMENTO:',
        '',
        'MINHA PRIMEIRA HIPÓTESE:',
        '',
        'ESTRUTURA E REFERÊNCIAS CONSULTADAS:',
        '',
        'O QUE A POSIÇÃO MUDA NA LEITURA:',
        '',
        'SÍNTESE CONTEXTUAL:',
        '',
        'LIMITE OU INCERTEZA:',
        'PRÓXIMO PASSO OBSERVÁVEL:',
        'REVISAR EM:'
      ]
    },
    three: {
      label: 'TRÊS CARTAS',
      title: 'DIÁRIO DE TAROT · LEITURA DE TRÊS CARTAS',
      essential: [
        'DATA:',
        'PERGUNTA OU INTENÇÃO:',
        'MÉTODO:',
        '',
        'POSIÇÃO 1 · FUNÇÃO / CARTA / OBSERVAÇÃO:',
        '',
        'POSIÇÃO 2 · FUNÇÃO / CARTA / OBSERVAÇÃO:',
        '',
        'POSIÇÃO 3 · FUNÇÃO / CARTA / OBSERVAÇÃO:',
        '',
        'RELAÇÃO ENTRE AS CARTAS:',
        '',
        'SÍNTESE CONTEXTUAL:',
        '',
        'PRÓXIMO PASSO OBSERVÁVEL:',
        'REVISAR EM:'
      ],
      complete: [
        'DATA E HORÁRIO:',
        'BARALHO:',
        'PERGUNTA OU INTENÇÃO:',
        'CONTEXTO NECESSÁRIO:',
        'MÉTODO E POSIÇÕES DEFINIDAS:',
        '',
        'POSIÇÃO 1 · FUNÇÃO:',
        'CARTA / OBSERVAÇÃO / HIPÓTESE:',
        '',
        'POSIÇÃO 2 · FUNÇÃO:',
        'CARTA / OBSERVAÇÃO / HIPÓTESE:',
        '',
        'POSIÇÃO 3 · FUNÇÃO:',
        'CARTA / OBSERVAÇÃO / HIPÓTESE:',
        '',
        'APOIOS, CONTRASTES OU PASSAGENS:',
        '',
        'ELEMENTOS, NÚMEROS E DIREÇÕES RECORRENTES:',
        '',
        'REFERÊNCIAS CONSULTADAS:',
        '',
        'SÍNTESE CONTEXTUAL:',
        '',
        'LIMITE OU INCERTEZA:',
        'PRÓXIMO PASSO OBSERVÁVEL:',
        'REVISAR EM:'
      ]
    },
    study: {
      label: 'ESTUDO DE CARTA',
      title: 'DIÁRIO DE TAROT · ESTUDO DE UMA CARTA',
      essential: [
        'DATA:',
        'CARTA:',
        'ARCANO / NAIPE / NÚMERO OU FIGURA:',
        '',
        'O QUE OBSERVO SEM CONSULTAR:',
        '',
        'O QUE RECORDO:',
        '',
        'O QUE A BIBLIOTECA ACRESCENTOU:',
        '',
        'TRÊS PALAVRAS MINHAS:',
        '',
        'UMA PERGUNTA QUE ESTA CARTA PODE ABRIR:',
        'REVISAR EM:'
      ],
      complete: [
        'DATA:',
        'CARTA E TRADIÇÃO VISUAL:',
        'ARCANO / NAIPE / NÚMERO OU FIGURA:',
        '',
        'PERSONAGENS, OBJETOS E CENÁRIO:',
        '',
        'COR, DIREÇÃO, GESTO E MOVIMENTO:',
        '',
        'O QUE RECORDO ANTES DE CONSULTAR:',
        '',
        'ESTRUTURA E REFERÊNCIAS CONSULTADAS:',
        '',
        'LUZ, TENSÃO E LIMITE DA CARTA:',
        '',
        'COMO MUDA EM RECURSO / DESAFIO / PRÓXIMO PASSO:',
        '',
        'DUAS CARTAS PARA COMPARAR DEPOIS:',
        '',
        'TRÊS PALAVRAS MINHAS:',
        'UMA PERGUNTA QUE ESTA CARTA PODE ABRIR:',
        'REVISAR EM:'
      ]
    },
    review: {
      label: 'REVISÃO',
      title: 'DIÁRIO DE TAROT · REVISÃO DE LEITURA',
      essential: [
        'DATA DA LEITURA ORIGINAL:',
        'DATA DESTA REVISÃO:',
        'PERGUNTA E CARTAS ORIGINAIS:',
        '',
        'O QUE EU INTERPRETEI NA ÉPOCA:',
        '',
        'O QUE REALMENTE OBSERVEI DEPOIS:',
        '',
        'O QUE NÃO OCORREU OU FICOU INCERTO:',
        '',
        'O QUE APRENDI SOBRE MEU MÉTODO:',
        '',
        'PRÓXIMA REVISÃO OU PRÁTICA:'
      ],
      complete: [
        'DATA DA LEITURA ORIGINAL:',
        'DATA DESTA REVISÃO:',
        'PERGUNTA, CONTEXTO, MÉTODO E POSIÇÕES ORIGINAIS:',
        '',
        'CARTAS NA ORDEM ORIGINAL:',
        '',
        'MINHA HIPÓTESE E SÍNTESE ORIGINAIS:',
        '',
        'O QUE REALMENTE OBSERVEI DEPOIS:',
        '',
        'O QUE NÃO OCORREU OU CONTINUA INCERTO:',
        '',
        'INFORMAÇÃO QUE EU NÃO TINHA:',
        '',
        'ONDE HOUVE PROJEÇÃO, PRESSA OU CERTEZA EXCESSIVA:',
        '',
        'O QUE A IMAGEM SUSTENTAVA COM MAIS CLAREZA:',
        '',
        'O QUE APRENDI SOBRE MEU MÉTODO:',
        '',
        'UMA REGRA QUE QUERO TESTAR NA PRÓXIMA LEITURA:',
        'PRÓXIMA REVISÃO OU PRÁTICA:'
      ]
    }
  });

  const mediumNotes = Object.freeze({
    paper: 'Preencha à mão sem apagar a hipótese inicial; deixe a revisão para outra data.',
    digital: 'Salve em um local cujo acesso, sincronização e compartilhamento você conhece.'
  });

  const mediumFooters = Object.freeze({
    paper: ['SUPORTE: PAPEL OU IMPRESSÃO', 'CUIDADO: guarde a ficha onde somente pessoas autorizadas possam acessá-la.'],
    digital: ['SUPORTE: NOTA OU DIÁRIO DIGITAL', 'CUIDADO: confira bloqueio, conta conectada, sincronização e compartilhamento.']
  });

  const form = document.querySelector('[data-template-form]');
  const output = document.querySelector('[data-template-output]');
  const printCopy = document.querySelector('[data-template-print]');
  if (!form || !output || !printCopy) return;

  const kind = document.querySelector('[data-template-kind]');
  const depth = document.querySelector('[data-template-depth]');
  const medium = document.querySelector('[data-template-medium]');
  const kindLabel = document.querySelector('[data-template-kind-label]');
  const depthLabel = document.querySelector('[data-template-depth-label]');
  const note = document.querySelector('[data-template-note]');
  const title = document.querySelector('#template-title');
  const result = document.querySelector('[data-template-result]');
  const copyButton = document.querySelector('[data-copy-template]');
  const printButton = document.querySelector('[data-print-template]');
  const copyStatus = document.querySelector('[data-copy-status]');
  const presetButtons = [...document.querySelectorAll('[data-preset]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const buildText = () => {
    const model = models[kind.value] || models.one;
    const selectedDepth = depth.value === 'complete' ? 'complete' : 'essential';
    const selectedMedium = medium.value === 'digital' ? 'digital' : 'paper';
    const lines = [model.title, '', ...model[selectedDepth], '', ...mediumFooters[selectedMedium]];

    output.value = lines.join('\n');
    printCopy.textContent = output.value;
    kindLabel.textContent = model.label;
    depthLabel.textContent = selectedDepth === 'complete' ? 'COMPLETA' : 'ESSENCIAL';
    note.textContent = mediumNotes[selectedMedium];
    copyStatus.textContent = 'O modelo não contém respostas pessoais.';
  };

  const revealResult = () => {
    buildText();
    title.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };

  const copyTemplate = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard-unavailable');
      await navigator.clipboard.writeText(output.value);
      copyStatus.textContent = 'Modelo copiado. Agora cole no aplicativo ou documento que você escolheu.';
    } catch {
      output.focus();
      output.select();
      output.setSelectionRange(0, output.value.length);
      copyStatus.textContent = 'Não foi possível copiar automaticamente. O texto foi selecionado para você copiar.';
    }
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    revealResult();
  });
  for (const control of [kind, depth, medium]) control.addEventListener('change', buildText);
  copyButton.addEventListener('click', copyTemplate);
  printButton.addEventListener('click', () => {
    printCopy.textContent = output.value;
    window.print();
  });
  presetButtons.forEach(button => button.addEventListener('click', () => {
    if (!models[button.dataset.preset]) return;
    kind.value = button.dataset.preset;
    revealResult();
  }));

  buildText();
})();
