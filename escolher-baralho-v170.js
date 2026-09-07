(() => {
  'use strict';

  const form = document.querySelector('[data-deck-quiz]');
  const result = document.querySelector('[data-quiz-result]');
  const count = document.querySelector('[data-quiz-count]');
  const progress = document.querySelector('[data-quiz-progress]');
  const resultTitle = document.querySelector('[data-result-title]');
  const resultCopy = document.querySelector('[data-result-copy]');
  const resultMatch = document.querySelector('[data-result-match]');
  const resultSymbol = document.querySelector('[data-result-symbol]');
  if (!form || !result || !count || !progress || !resultTitle || !resultCopy || !resultMatch || !resultSymbol) return;

  const total = form.querySelectorAll('fieldset').length;
  const profiles = Object.freeze({
    marselha: {
      name: 'Sua afinidade inicial é o Tarot de Marselha',
      symbol: '◇',
      copy: 'Você parece gostar de construir sentido por número, naipe, ritmo e arquitetura visual. Explore uma edição de Marselha observando especialmente as cartas do 2 ao 10.',
      match: 'Procure: emblemas legíveis, boa impressão, medidas confortáveis e um guia que explique a edição sem esconder suas variações.'
    },
    rws: {
      name: 'Sua afinidade inicial é o Rider–Waite–Smith',
      symbol: '↟',
      copy: 'Você parece aprender melhor quando personagens, gestos e cenários oferecem uma situação para descrever. Veja diferentes cartas numeradas antes de escolher uma edição.',
      match: 'Procure: crédito visível a Pamela Colman Smith, cenas legíveis, cores que funcionem para seus olhos e títulos no idioma adequado.'
    },
    thoth: {
      name: 'Sua afinidade inicial é o Tarot de Thoth',
      symbol: '✧',
      copy: 'Você parece se interessar por cor, geometria e sistemas de correspondências que se revelam aos poucos. Confirme se deseja acompanhar uma linguagem própria de nomes e corte.',
      match: 'Procure: reprodução nítida, guia compatível, símbolos visíveis no tamanho físico e disposição para um estudo mais investigativo.'
    }
  });

  const labels = Object.freeze({ marselha: 'Marselha', rws: 'Rider–Waite–Smith', thoth: 'Thoth' });

  const selectedCount = () => new Set([...form.querySelectorAll('input:checked')].map(input => input.name)).size;

  const updateProgress = () => {
    const selected = selectedCount();
    count.textContent = `${selected} de ${total}`;
    progress.style.width = `${(selected / total) * 100}%`;
  };

  const updateScores = scores => {
    for (const key of Object.keys(labels)) {
      const score = scores[key] || 0;
      const text = document.querySelector(`[data-score="${key}"]`);
      const bar = document.querySelector(`[data-score-bar="${key}"]`);
      if (text) text.textContent = `${score}/${total}`;
      if (bar) bar.style.width = `${(score / total) * 100}%`;
    }
  };

  form.addEventListener('change', updateProgress);

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const scores = { marselha: 0, rws: 0, thoth: 0 };
    for (const input of form.querySelectorAll('input:checked')) {
      if (Object.hasOwn(scores, input.value)) scores[input.value] += 1;
    }
    const high = Math.max(...Object.values(scores));
    const winners = Object.keys(scores).filter(key => scores[key] === high);
    updateScores(scores);
    if (winners.length === 1) {
      const profile = profiles[winners[0]];
      resultTitle.textContent = profile.name;
      resultCopy.textContent = profile.copy;
      resultMatch.textContent = profile.match;
      resultSymbol.textContent = profile.symbol;
    } else {
      const names = winners.map(key => labels[key]);
      const joined = names.length === 2 ? names.join(' e ') : names.join(', ').replace(/, ([^,]*)$/, ' e $1');
      resultTitle.textContent = 'Seu perfil é híbrido';
      resultCopy.textContent = `Suas escolhas aproximam ${joined}. Isso não é indecisão: você pode preferir um baralho contemporâneo que combine linguagens ou comparar edições antes de escolher.`;
      resultMatch.textContent = 'Procure: proposta autoral clara, imagens de várias cartas numeradas, créditos completos e um guia que explique quais tradições inspiraram o conjunto.';
      resultSymbol.textContent = '◎';
    }
    result.hidden = false;
    resultTitle.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  });

  form.addEventListener('reset', () => {
    requestAnimationFrame(() => {
      result.hidden = true;
      updateProgress();
      updateScores({ marselha: 0, rws: 0, thoth: 0 });
    });
  });

  updateProgress();
})();
