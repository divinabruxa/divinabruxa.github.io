(() => {
  'use strict';
  const form = document.querySelector('[data-care-form]');
  const result = document.querySelector('[data-care-result]');
  if (!form || !result) return;
  const title = result.querySelector('[data-care-title]');
  const intro = result.querySelector('[data-care-intro]');
  const steps = result.querySelector('[data-care-steps]');
  const copy = result.querySelector('[data-care-copy]');
  const status = result.querySelector('[data-care-status]');
  const routines = {
    novo: {
      title: 'Primeiro encontro com o baralho',
      intro: 'Conheça o conjunto antes de buscar uma técnica especial.',
      short: ['Lave e seque completamente as mãos.', 'Confira se as 78 cartas estão presentes e sem umidade.', 'Alinhe o conjunto e formule uma intenção simples.'],
      long: ['Prepare uma mesa limpa, seca e sem bebidas ou velas.', 'Passe pelas 78 imagens e confira o estado das cartas.', 'Escolha uma frase de intenção para sua prática.', 'Faça uma tiragem de apresentação com três posições.', 'Registre a síntese no Diário e guarde o baralho na caixa.']
    },
    entre: {
      title: 'Pausa entre duas leituras',
      intro: 'Encerre uma pergunta antes de abrir espaço para a próxima.',
      short: ['Reúna e alinhe todas as cartas.', 'Respire e encerre mentalmente a pergunta anterior.', 'Embaralhe novamente com mãos e superfície secas.'],
      long: ['Registre uma frase de síntese da leitura encerrada.', 'Reúna as cartas e verifique se nenhuma ficou separada.', 'Faça uma pausa breve sem manipular o conjunto.', 'Nomeie a nova pergunta e as posições antes de embaralhar.', 'Misture com o método mais confortável, mantendo tudo direto.']
    },
    guardar: {
      title: 'Rotina de guarda e preservação',
      intro: 'Proteja o baralho com medidas pequenas e repetíveis.',
      short: ['Confira se cartas, mãos e caixa estão secas.', 'Alinhe o conjunto sem apertar as bordas.', 'Guarde longe de sol, calor, líquidos e peso.'],
      long: ['Observe bordas, poeira, umidade e cheiro incomum.', 'Remova somente poeira solta com tecido macio e seco.', 'Confira a caixa ou o tecido de proteção.', 'Escolha um local interno, estável, seco e sem luz direta.', 'Anote a data se houver dano e procure orientação para item valioso.']
    }
  };
  let currentText = '';

  const render = (goal, time) => {
    const routine = routines[goal];
    const selected = time === '5' ? routine.long : routine.short;
    title.textContent = `${routine.title} · ${time} min`;
    intro.textContent = routine.intro;
    steps.replaceChildren(...selected.map((item, index) => {
      const li = document.createElement('li');
      const mark = document.createElement('span');
      mark.textContent = String(index + 1).padStart(2, '0');
      const text = document.createElement('p');
      text.textContent = item;
      li.append(mark, text);
      return li;
    }));
    currentText = `${title.textContent}\n\n${routine.intro}\n\n${selected.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nDivina Bruxa · cuidado material e ritual opcional`;
    result.hidden = false;
    status.textContent = '';
    title.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const goal = data.get('goal');
    const time = data.get('time');
    if (routines[goal] && (time === '1' || time === '5')) render(goal, time);
  });

  form.addEventListener('reset', () => {
    result.hidden = true;
    currentText = '';
    status.textContent = '';
  });

  copy?.addEventListener('click', async () => {
    if (!currentText) return;
    try {
      await navigator.clipboard.writeText(currentText);
      status.textContent = 'Rotina copiada.';
    } catch {
      const area = document.createElement('textarea');
      area.value = currentText;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      status.textContent = copied ? 'Rotina copiada.' : 'Não foi possível copiar automaticamente.';
    }
  });
})();
