(() => {
  'use strict';

  const form = document.querySelector('[data-shuffle-guide]');
  const result = document.querySelector('[data-shuffle-result]');
  const count = document.querySelector('[data-shuffle-count]');
  const progress = document.querySelector('[data-shuffle-progress]');
  const title = document.querySelector('[data-shuffle-title]');
  const copy = document.querySelector('[data-shuffle-copy]');
  const care = document.querySelector('[data-shuffle-care]');
  const symbol = document.querySelector('[data-shuffle-symbol]');
  if (!form || !result || !count || !progress || !title || !copy || !care || !symbol) return;

  const total = form.querySelectorAll('fieldset').length;
  const profiles = Object.freeze({
    mesa: {
      title: 'Comece pela mistura circular na mesa',
      symbol: '↻',
      copy: 'O apoio constante parece combinar com seu espaço, o tamanho do baralho e o movimento que você prefere. Espalhe as cartas fechadas, faça círculos suaves e reúna por pequenos grupos.',
      care: 'Atenção: use uma superfície limpa e lisa; não pressione as cartas contra tecidos ásperos nem misture perto de líquidos.'
    },
    pacotes: {
      title: 'Comece pelos pacotes nas mãos',
      symbol: '⇣',
      copy: 'Você parece confortável mantendo o conjunto próximo ao corpo e transferindo pequenos grupos. Varie o tamanho dos pacotes para interromper padrões sem acelerar o gesto.',
      care: 'Atenção: sustente sem apertar. Se o conjunto inteiro cansar as mãos, divida-o, misture as partes e reúna no final.'
    },
    intercalacao: {
      title: 'Comece pela intercalação apoiada',
      symbol: '⇆',
      copy: 'Duas metades sobre uma superfície firme parecem oferecer o controle que você procura. Aproxime apenas os cantos e deixe pequenos grupos se intercalarem.',
      care: 'Atenção: não faça ponte e não force cartas rígidas, frágeis ou grandes. Troque de método diante de curvatura, dor ou perda de controle.'
    }
  });

  const labels = Object.freeze({ mesa: 'mesa', pacotes: 'pacotes', intercalacao: 'intercalação' });
  const selectedCount = () => new Set([...form.querySelectorAll('input:checked')].map(input => input.name)).size;

  const updateProgress = () => {
    const selected = selectedCount();
    count.textContent = `${selected} de ${total}`;
    progress.style.width = `${(selected / total) * 100}%`;
  };

  const updateScores = scores => {
    for (const key of Object.keys(labels)) {
      const value = scores[key] || 0;
      const score = document.querySelector(`[data-shuffle-score="${key}"]`);
      const bar = document.querySelector(`[data-shuffle-bar="${key}"]`);
      if (score) score.textContent = `${value}/${total}`;
      if (bar) bar.style.width = `${(value / total) * 100}%`;
    }
  };

  form.addEventListener('change', updateProgress);

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const scores = { mesa: 0, pacotes: 0, intercalacao: 0 };
    for (const input of form.querySelectorAll('input:checked')) {
      if (Object.hasOwn(scores, input.value)) scores[input.value] += 1;
    }
    const high = Math.max(...Object.values(scores));
    const winners = Object.keys(scores).filter(key => scores[key] === high);
    updateScores(scores);
    if (winners.length === 1) {
      const profile = profiles[winners[0]];
      title.textContent = profile.title;
      copy.textContent = profile.copy;
      care.textContent = profile.care;
      symbol.textContent = profile.symbol;
    } else {
      const names = winners.map(key => labels[key]);
      const joined = names.join(', ').replace(/, ([^,]*)$/, ' e $1');
      title.textContent = 'Comece por uma mistura combinada';
      copy.textContent = `Suas respostas aproximam ${joined}. Faça uma rodada curta de cada movimento confortável e perceba qual oferece mais controle sem forçar as cartas.`;
      care.textContent = 'Atenção: combinar métodos não exige pressa. Você pode dividir o baralho em pacotes menores e manter apoio constante na mesa.';
      symbol.textContent = '◎';
    }
    result.hidden = false;
    title.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  });

  form.addEventListener('reset', () => {
    requestAnimationFrame(() => {
      result.hidden = true;
      updateProgress();
      updateScores({ mesa: 0, pacotes: 0, intercalacao: 0 });
    });
  });

  updateProgress();
})();
