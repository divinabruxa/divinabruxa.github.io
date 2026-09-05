/* DIVINA BRUXA — ESCOLA DO TAROT CELESTIAL V138 */

import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js';
import { dailyMeaning } from './daily-meaning-runtime.js';
import { cardPageHref } from './card-library-policy.js';
import { SCHOOL_MODULES, SCHOOL_STORAGE_KEY, normalizeSchoolState } from './school-policy.js';

const safe = value => escapeHTML(value ?? '');
const ELEMENTS = Object.freeze(['Água', 'Ar', 'Fogo', 'Terra']);
const MODULE_SIGILS = Object.freeze({
  fundamentals: '✦', majors: '☉', wands: '♨', cups: '☽', swords: '◇',
  pentacles: '⊕', court: '♛', numbers: '∞', elements: '△', positions: '⌖',
  combinations: '✧', synthesis: '◎', 'practice-spreads': '⋮',
  'celtic-cross': '✣', 'royal-table': '▦', ethics: '⚖', advanced: '✺'
});

const THEORY_LESSONS = Object.freeze({
  fundamentals: Object.freeze([
    ['O Tarot como linguagem', 'O Tarot organiza imagens, números, elementos e arquétipos para ampliar uma pergunta. A carta não elimina a realidade: ela oferece uma lente simbólica para observá-la.', 'Escolha uma carta e descreva primeiro apenas o que você vê, sem consultar significados.'],
    ['A arquitetura das 78 cartas', 'Os 22 Arcanos Maiores tratam de grandes movimentos da jornada. Os 56 Arcanos Menores aproximam esses movimentos da emoção, da mente, da ação e da vida material.', 'Separe mentalmente uma situação em tema maior e acontecimentos cotidianos.'],
    ['Perguntas que abrem caminhos', 'Perguntas abertas revelam possibilidades e escolhas. Em vez de pedir uma sentença, investigue o que precisa ser visto, compreendido ou praticado.', 'Transforme uma pergunta de sim ou não em uma pergunta que comece com “o que” ou “como”.'],
    ['Preparação e presença', 'Uma leitura clara começa com intenção, respiração e contexto. Registrar a pergunta antes de abrir as cartas reduz projeções e ajuda a revisar a interpretação depois.', 'Escreva uma intenção em uma frase antes da próxima leitura.']
  ]),
  numbers: Object.freeze([
    ['Ás e Dois — nascimento e encontro', 'O Ás concentra a potência inicial do naipe. O Dois cria relação, contraste, escolha ou equilíbrio entre duas forças.', 'Compare o Ás e o Dois do mesmo naipe e observe o que passou a existir entre eles.'],
    ['Três e Quatro — expressão e estrutura', 'O Três expande, comunica e faz circular. O Quatro delimita, estabiliza e protege, mas também pode imobilizar.', 'Procure nas imagens o que cresce no Três e o que ganha contorno no Quatro.'],
    ['Cinco e Seis — ruptura e recomposição', 'O Cinco introduz tensão, falta ou mudança. O Seis reorganiza o movimento e aponta uma passagem possível depois do conflito.', 'Conte uma pequena história ligando o Cinco ao Seis de um naipe.'],
    ['Sete e Oito — avaliação e domínio', 'O Sete pede estratégia, discernimento ou teste. O Oito acelera, aperfeiçoa ou aprofunda a experiência do elemento.', 'Identifique onde há escolha no Sete e prática no Oito.'],
    ['Nove e Dez — maturidade e conclusão', 'O Nove mostra a experiência perto de sua plenitude. O Dez encerra o ciclo, revela consequências e prepara um novo começo.', 'Observe o que amadurece no Nove e o que transborda no Dez.']
  ]),
  elements: Object.freeze([
    ['Fogo — vontade e criação', 'Paus move desejo, coragem, iniciativa, sexualidade criativa e propósito. Em excesso pode consumir; em falta pode apagar o impulso.', 'Pergunte onde a situação precisa de ação e onde precisa de medida.'],
    ['Água — vínculo e sensibilidade', 'Copas fala de afeto, imaginação, receptividade e memória emocional. Seu fluxo pode nutrir, transbordar ou estagnar.', 'Nomeie a emoção visível e a emoção que talvez esteja escondida.'],
    ['Ar — pensamento e verdade', 'Espadas trabalha ideias, linguagem, conflito, decisão e discernimento. A mente pode libertar ou criar prisões.', 'Separe os fatos, as interpretações e os medos presentes na pergunta.'],
    ['Terra — corpo e realidade', 'Ouros ancora recursos, trabalho, saúde cotidiana, tempo e resultados concretos. A matéria pede cuidado, ritmo e continuidade.', 'Escolha uma ação pequena e observável que possa ser realizada no mundo real.']
  ]),
  positions: Object.freeze([
    ['A posição é uma pergunta', 'A mesma carta muda de função conforme o lugar que ocupa. “Desafio”, “recurso” e “próximo passo” convocam aspectos diferentes da imagem.', 'Leia uma carta em duas posições opostas e compare as respostas.'],
    ['Passado, presente e tendência', 'Essas posições organizam uma sequência sem transformar o futuro em destino fixo. Tendência é direção atual, sujeita a escolhas e acontecimentos.', 'Formule a tendência usando “se o movimento continuar” em vez de uma certeza.'],
    ['Interior e exterior', 'Algumas posições distinguem experiência subjetiva e circunstâncias observáveis. A leitura ganha precisão quando não confunde sentimento com fato.', 'Liste um elemento interno e um elemento externo da situação.'],
    ['Conselho e síntese', 'Conselho aponta uma postura possível; síntese reúne o padrão dominante da tiragem. Nenhuma das duas posições deve apagar a complexidade das demais.', 'Converta o conselho em uma atitude prática e proporcional.']
  ]),
  combinations: Object.freeze([
    ['Repetições que amplificam', 'Muitos números, naipes ou figuras semelhantes aumentam a importância de um tema. A repetição é um coro, não uma regra automática.', 'Conte elementos repetidos antes de interpretar cada carta isoladamente.'],
    ['Contrastes que criam tensão', 'Cartas com ritmos, direções ou elementos opostos mostram forças em negociação. O contraste pode ser conflito, complemento ou escolha.', 'Descreva o que cada carta deseja preservar.'],
    ['Cartas que modificam vizinhas', 'Uma carta pode abrir, limitar, acelerar ou suavizar a leitura da outra. Observe primeiro a relação visual e depois confirme com o contexto.', 'Ligue duas cartas com um verbo: protege, confronta, revela, interrompe ou alimenta.'],
    ['Sequência como narrativa', 'A ordem das cartas cria movimento. Início, transformação e consequência ajudam a construir uma história sem reduzir a tiragem a frases soltas.', 'Conte a tiragem em três momentos, usando uma frase para cada momento.']
  ]),
  synthesis: Object.freeze([
    ['Encontre o centro', 'A síntese começa pelo tema que atravessa mais posições, não pela carta mais dramática. Procure o padrão que explica o conjunto.', 'Resuma o assunto central em até sete palavras.'],
    ['Organize forças e tensões', 'Separe aquilo que ajuda, aquilo que desafia e aquilo que ainda está indefinido. Essa estrutura mantém nuances sem perder clareza.', 'Crie três colunas: apoio, tensão e possibilidade.'],
    ['Devolva liberdade à leitura', 'Uma boa síntese apresenta tendências e escolhas em linguagem responsável. Evite certezas sobre terceiros, diagnósticos ou promessas absolutas.', 'Troque uma frase determinista por uma formulação de possibilidade.'],
    ['Finalize com um gesto possível', 'Depois da compreensão simbólica, indique uma ação pequena, segura e coerente com a pergunta. A prática ancora a leitura na vida.', 'Escolha um gesto que possa ser realizado nas próximas 24 horas.']
  ]),
  'practice-spreads': Object.freeze([
    ['Uma carta — foco', 'Uma única carta ajuda a nomear a energia central, o aprendizado ou a postura do momento. Quanto mais precisa a posição, mais clara a leitura.', 'Abra uma carta para “o que merece minha atenção agora?”.'],
    ['Três cartas — movimento', 'Três posições permitem observar origem, estado atual e direção; situação, desafio e recurso; ou mente, emoção e ação.', 'Escolha um trio de posições antes de revelar as cartas.'],
    ['Cinco cartas — contexto', 'Cinco posições comportam centro, influências, tensão, recurso e tendência. Elas aprofundam sem perder a visão do conjunto.', 'Leia primeiro a carta central e só depois as quatro relações.'],
    ['Revisão — aprender com a prática', 'Retornar à leitura depois de algum tempo mostra projeções, acertos de contexto e novas relações simbólicas.', 'Registre o que você compreendeu hoje e o que deseja revisar depois.']
  ]),
  'celtic-cross': Object.freeze([
    ['Centro — presente e desafio', 'As duas primeiras cartas mostram a questão viva e a força que a atravessa. Leia o cruzamento como relação, não como duas sentenças isoladas.', 'Dê um nome à relação entre as cartas 1 e 2.'],
    ['Eixo vertical — raiz e consciência', 'A base mostra raízes profundas; o topo revela consciência, intenção ou possibilidade percebida. Juntas, expõem o eixo interno da questão.', 'Compare o que sustenta a situação com o que a pessoa busca alcançar.'],
    ['Eixo horizontal — passado e aproximação', 'A carta anterior contextualiza o movimento que perde força; a seguinte indica o que começa a se aproximar.', 'Use linguagem de transição, não de destino.'],
    ['Coluna — postura e ambiente', 'A sétima carta observa a postura da pessoa e a oitava o campo externo. A diferença entre elas costuma revelar um ponto decisivo.', 'Separe claramente percepção pessoal e circunstância externa.'],
    ['Coluna — esperanças e síntese', 'A nona posição reúne esperanças e receios; a décima sintetiza a tendência do conjunto. A conclusão deve conversar com todas as posições anteriores.', 'Finalize com tema central, possibilidade e próximo gesto.']
  ]),
  'royal-table': Object.freeze([
    ['As 78 cartas como universo', 'A Mesa Real usa o baralho completo para observar um sistema amplo. Cada carta aparece uma vez e ganha sentido pela posição e pelas vizinhanças.', 'Antes de interpretar, observe a distribuição geral dos quatro naipes.'],
    ['Treze fileiras de seis', 'A grade de 13 por 6 cria eixos horizontais e verticais. Defina previamente o método de leitura das linhas para manter consistência.', 'Escolha o tema de cada fileira antes de abrir a mesa.'],
    ['Núcleos e constelações', 'Agrupamentos de Arcanos Maiores, figuras da Corte ou naipes repetidos formam núcleos temáticos. Comece por eles antes dos detalhes.', 'Marque três regiões que concentram mais intensidade simbólica.'],
    ['Síntese em camadas', 'Uma Mesa Real pede leitura gradual: panorama, áreas, relações e conclusão. Tentar interpretar tudo de uma vez cria ruído.', 'Escreva uma frase para o panorama antes de abrir qualquer detalhe.']
  ]),
  ethics: Object.freeze([
    ['Consentimento e privacidade', 'Leia apenas dentro do consentimento dado e preserve o que foi compartilhado. Curiosidade não autoriza invadir a intimidade de terceiros.', 'Reformule a pergunta para devolver o foco à pessoa presente.'],
    ['Linguagem não determinista', 'O Tarot pode explorar padrões e tendências, mas não comprova fatos ocultos nem fixa o futuro. A linguagem deve manter espaço para escolha.', 'Substitua “vai acontecer” por uma formulação responsável.'],
    ['Limites de atuação', 'Saúde, segurança, direito e finanças exigem profissionais qualificados. A leitura pode apoiar reflexão, jamais substituir cuidado especializado.', 'Identifique quando a resposta precisa incluir orientação para ajuda real.'],
    ['Acolhimento sem dependência', 'Uma prática ética fortalece autonomia. Evite criar medo, urgência artificial, promessa de salvação ou necessidade de consultas repetidas.', 'Termine a leitura lembrando uma escolha que pertence à consulente.']
  ]),
  advanced: Object.freeze([
    ['Construa um método próprio', 'Método nasce da repetição consciente: posições claras, registro, critérios de combinação e revisão. Intuição ganha força quando pode dialogar com processo.', 'Escreva os quatro passos que você sempre deseja seguir.'],
    ['Leia imagem antes de memória', 'Mesmo com estudo profundo, volte às cores, gestos, direções e relações visuais. A imagem impede que o significado vire fórmula automática.', 'Passe um minuto observando a carta antes de nomeá-la.'],
    ['Calibre a interpretação', 'Compare a leitura com contexto e acontecimentos posteriores sem forçar coincidências. Reconhecer limites melhora precisão e confiança.', 'Registre o que ficou claro, incerto e ausente.'],
    ['Desenvolva sua voz', 'Sua voz nasce do encontro entre tradição, prática, ética e linguagem pessoal. Profundidade não exige obscuridade: uma leitura forte também pode ser simples.', 'Explique uma carta em três frases que qualquer pessoa compreenderia.']
  ])
});

function theoryLessons(module) {
  return (THEORY_LESSONS[module.id] || []).map((entry, index) => ({
    id: `theory-${module.id}-${index + 1}`,
    title: entry[0],
    body: entry[1],
    practice: entry[2]
  }));
}

function quizAlternatives(card) {
  const offset = Number(card.id) % ELEMENTS.length;
  return ELEMENTS.slice(offset).concat(ELEMENTS.slice(0, offset));
}

export class SchoolEngine {
  constructor(root) {
    this.root = root;
    this.state = normalizeSchoolState(store.get(SCHOOL_STORAGE_KEY));
    this.query = '';
    this.activeModule = SCHOOL_MODULES.some(module => module.id === this.state.lastModule)
      ? this.state.lastModule
      : SCHOOL_MODULES[0].id;
    this.render();
  }

  save() { store.set(SCHOOL_STORAGE_KEY, this.state); }

  lessonsFor(module) {
    if (module.kind === 'major') {
      return CARDS.filter(card => card.arcanaCode === 'major').map(card => ({ id:`card-${card.id}`, title:card.name, card }));
    }
    if (['Paus', 'Copas', 'Espadas', 'Ouros'].includes(module.kind)) {
      return CARDS.filter(card => card.suit === module.kind).map(card => ({ id:`card-${card.id}`, title:card.name, card }));
    }
    if (module.id === 'court') {
      return CARDS.filter(card => card.court).map(card => ({ id:`card-${card.id}`, title:card.name, card }));
    }
    return theoryLessons(module);
  }

  progress() {
    const required = new Set(CARDS.map(card => `card-${card.id}`));
    const theory = new Set(
      SCHOOL_MODULES.flatMap(module => this.lessonsFor(module))
        .filter(lesson => !lesson.card)
        .map(lesson => lesson.id)
    );
    const done = this.state.completed.filter(id => required.has(id)).length;
    const theoryDone = this.state.completed.filter(id => theory.has(id)).length;
    return {
      done,
      total: 78,
      percent: Math.round(done / 78 * 100),
      theoryDone,
      theoryTotal: theory.size
    };
  }

  moduleProgress(module) {
    const lessons = this.lessonsFor(module);
    const done = lessons.filter(lesson => this.state.completed.includes(lesson.id)).length;
    return { done, total: lessons.length, percent: lessons.length ? Math.round(done / lessons.length * 100) : 0 };
  }

  render() {
    const progress = this.progress();
    const active = SCHOOL_MODULES.find(module => module.id === this.activeModule) || SCHOOL_MODULES[0];
    this.root.innerHTML = `
      <section class="school-dashboard" aria-labelledby="schoolPathTitle">
        <div class="school-path-copy">
          <p class="eyebrow">SEU CAMINHO CELESTIAL</p>
          <h3 id="schoolPathTitle">Conhecimento que vira presença.</h3>
          <p data-school-resume-copy>Retome o módulo ${String(active.order).padStart(2, '0')} · ${safe(active.title)}. Seu progresso fica guardado neste aparelho.</p>
          <div class="school-path-metrics">
            <span><b>${progress.done}</b><small>de 78 cartas</small></span>
            <span><b>${progress.theoryDone}</b><small>de ${progress.theoryTotal} práticas</small></span>
            <span><b>17</b><small>módulos da jornada</small></span>
          </div>
          <button type="button" class="school-continue" data-school-continue>Continuar no módulo ${String(active.order).padStart(2, '0')} <span aria-hidden="true">↓</span></button>
        </div>
        <div class="school-progress-orbit" style="--school-progress:${progress.percent * 3.6}deg" aria-label="${progress.percent}% das aulas de cartas concluídas">
          <span><b>${progress.percent}%</b><small>das cartas</small></span>
        </div>
      </section>
      <div class="school-controls">
        <label class="school-search">
          <span>Buscar em toda a escola</span>
          <input type="search" data-school-search placeholder="Ex.: A Lua, Copas, ética" value="${safe(this.query)}" autocomplete="off">
        </label>
        <span class="school-module-count">17 módulos · 78 cartas · zero invertidas</span>
      </div>
      <div class="school-workspace">
        <nav class="school-modules" aria-label="Módulos da Escola do Tarot">
          ${SCHOOL_MODULES.map(module => this.moduleMarkup(module)).join('')}
        </nav>
        <section class="school-lessons" data-school-lessons aria-live="polite"></section>
      </div>`;

    const search = this.root.querySelector('[data-school-search]');
    search.addEventListener('input', event => {
      this.query = event.target.value;
      this.renderLessons();
    });

    this.root.querySelector('.school-modules').addEventListener('click', event => {
      const button = event.target.closest('[data-school-module]');
      if (!button) return;
      this.activeModule = button.dataset.schoolModule;
      this.state.lastModule = this.activeModule;
      this.query = '';
      search.value = '';
      this.save();
      this.updateModuleSelection();
      this.updatePathHeading();
      this.renderLessons();
      this.root.querySelector('[data-school-lessons]')?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });

    this.root.querySelector('[data-school-continue]').addEventListener('click', () => {
      this.root.querySelector('[data-school-lessons]')?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });

    this.renderLessons();
  }

  moduleMarkup(module) {
    const progress = this.moduleProgress(module);
    const active = module.id === this.activeModule;
    return `<button type="button" data-school-module="${module.id}" class="${active ? 'active' : ''}" aria-current="${active ? 'true' : 'false'}">
      <span class="school-module-sigil" aria-hidden="true">${MODULE_SIGILS[module.id] || '✦'}</span>
      <span class="school-module-copy">
        <small>MÓDULO ${String(module.order).padStart(2, '0')}</small>
        <strong>${safe(module.title)}</strong>
        <em>${progress.done}/${progress.total} concluídas</em>
      </span>
      <i aria-hidden="true"><u style="width:${progress.percent}%"></u></i>
    </button>`;
  }

  updateModuleSelection() {
    this.root.querySelectorAll('[data-school-module]').forEach(button => {
      const active = button.dataset.schoolModule === this.activeModule;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', String(active));
    });
  }

  updatePathHeading() {
    const active = SCHOOL_MODULES.find(module => module.id === this.activeModule) || SCHOOL_MODULES[0];
    const number = String(active.order).padStart(2, '0');
    const copy = this.root.querySelector('[data-school-resume-copy]');
    const button = this.root.querySelector('[data-school-continue]');
    if (copy) copy.textContent = `Retome o módulo ${number} · ${active.title}. Seu progresso fica guardado neste aparelho.`;
    if (button) {
      button.textContent = `Continuar no módulo ${number} `;
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↓';
      button.append(arrow);
    }
  }

  globalResults(query) {
    const results = [];
    const seen = new Set();
    SCHOOL_MODULES.forEach(module => {
      this.lessonsFor(module).forEach(lesson => {
        if (seen.has(lesson.id)) return;
        const searchable = [lesson.title, lesson.body, lesson.practice, lesson.card?.suit, lesson.card?.element, module.title, module.description]
          .filter(Boolean).join(' ').toLocaleLowerCase('pt-BR');
        if (!searchable.includes(query)) return;
        seen.add(lesson.id);
        results.push({ lesson, module });
      });
    });
    return results;
  }

  renderLessons() {
    const module = SCHOOL_MODULES.find(item => item.id === this.activeModule) || SCHOOL_MODULES[0];
    const query = this.query.trim().toLocaleLowerCase('pt-BR');
    const results = query
      ? this.globalResults(query)
      : this.lessonsFor(module).map(lesson => ({ lesson, module }));
    const container = this.root.querySelector('[data-school-lessons]');
    if (!container) return;

    container.innerHTML = `
      <header class="school-lessons-head">
        <div>
          <p class="eyebrow">${query ? 'RESULTADOS DA BUSCA' : `MÓDULO ${String(module.order).padStart(2, '0')}`}</p>
          <h3>${query ? `Encontrei ${results.length} ${results.length === 1 ? 'aula' : 'aulas'}` : safe(module.title)}</h3>
          <p>${query ? `Resultados para “${safe(this.query.trim())}” em toda a Escola do Tarot.` : safe(module.description)}</p>
        </div>
        <span>${results.length} ${results.length === 1 ? 'aula' : 'aulas'}</span>
      </header>
      <div class="school-lesson-list">
        ${results.map(({ lesson, module: lessonModule }, index) => this.lessonMarkup(lesson, lessonModule, index)).join('') || '<p class="school-empty">Nenhuma aula encontrada. Tente outra palavra.</p>'}
      </div>`;

    container.onclick = event => {
      const complete = event.target.closest('[data-complete]');
      const favorite = event.target.closest('[data-favorite]');
      const quiz = event.target.closest('[data-quiz]');
      if (complete) this.toggleList('completed', complete.dataset.complete);
      if (favorite) this.toggleList('favorites', favorite.dataset.favorite);
      if (quiz) this.answerQuiz(quiz);
    };
  }

  lessonMarkup(lesson, module, index) {
    const completed = this.state.completed.includes(lesson.id);
    const favorite = this.state.favorites.includes(lesson.id);
    const position = String(index + 1).padStart(2, '0');

    if (!lesson.card) {
      return `<article class="school-lesson theory ${completed ? 'is-complete' : ''}">
        <div class="school-lesson-number" aria-hidden="true">${position}</div>
        <div class="school-lesson-body">
          <span class="school-lesson-kind">${safe(module.title)} · AULA FUNDAMENTAL</span>
          <h4>${safe(lesson.title)}</h4>
          <p>${safe(lesson.body)}</p>
          <div class="school-practice"><b>PRÁTICA DO CÉU</b><p>${safe(lesson.practice)}</p></div>
          ${this.actionsMarkup(lesson.id, completed, favorite)}
        </div>
      </article>`;
    }

    const meaning = dailyMeaning(lesson.card);
    const alternatives = quizAlternatives(lesson.card);
    return `<article class="school-lesson card-lesson ${completed ? 'is-complete' : ''}">
      <div class="school-card-art">${cardImageMarkup(lesson.card, { priority:'auto' })}<span aria-hidden="true">${position}</span></div>
      <div class="school-lesson-body">
        <span class="school-lesson-kind">${safe(module.title)} · ${safe(lesson.card.arcana === 'Arcano Maior' ? 'ARCANO MAIOR' : lesson.card.suit)} · DIRETA</span>
        <h4>${safe(lesson.card.name)}</h4>
        <p>${safe(meaning.essence)}</p>
        <details>
          <summary><span>Aprofundar aula</span><b aria-hidden="true">＋</b></summary>
          <div class="school-deep-lesson">
            <h5>Luz</h5><p>${safe(meaning.light)}</p>
            <h5>Tensão</h5><p>${safe(meaning.tension)}</p>
            <h5>Símbolos</h5>${meaning.symbols.map(symbol => `<p>✦ ${safe(symbol)}</p>`).join('')}
            <a href="${cardPageHref(lesson.card)}">Abrir página completa <span aria-hidden="true">→</span></a>
            <div class="school-quiz">
              <b>Exercício: qual é o elemento desta carta?</b>
              <div>${alternatives.map(value => `<button type="button" data-quiz="${safe(value)}" data-answer="${safe(lesson.card.element)}">${safe(value)}</button>`).join('')}</div>
              <small aria-live="polite"></small>
            </div>
          </div>
        </details>
        ${this.actionsMarkup(lesson.id, completed, favorite)}
      </div>
    </article>`;
  }

  actionsMarkup(id, completed, favorite) {
    return `<div class="school-actions">
      <button type="button" data-complete="${id}" aria-pressed="${completed}">${completed ? '✓ Aula concluída' : 'Marcar como concluída'}</button>
      <button type="button" data-favorite="${id}" aria-pressed="${favorite}">${favorite ? '★ Favorita' : '☆ Favoritar'}</button>
    </div>`;
  }

  toggleList(key, id) {
    const set = new Set(this.state[key]);
    set.has(id) ? set.delete(id) : set.add(id);
    this.state[key] = [...set];
    this.state.lastLesson = id;
    this.save();
    this.render();
  }

  answerQuiz(button) {
    const output = button.closest('.school-quiz')?.querySelector('small');
    if (!output) return;
    const correct = button.dataset.quiz === button.dataset.answer;
    output.textContent = correct
      ? 'Resposta correta. Observe como esse elemento aparece na imagem.'
      : `Ainda não. O elemento correto é ${button.dataset.answer}.`;
    output.className = correct ? 'correct' : 'retry';
  }
}
