import { CARDS } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { cardImageMarkup } from './tarot-image-runtime.js';
import { dailyMeaning } from './daily-meaning-runtime.js';
import { cardPageHref } from './card-library-policy.js';
import { SCHOOL_MODULES, SCHOOL_STORAGE_KEY, cardModuleId, normalizeSchoolState } from './school-policy.js';

const safe = value => escapeHTML(value ?? '');
const GENERAL_LESSONS = Object.freeze({
  fundamentals:'O Tarot como linguagem simbólica e prática de reflexão.', court:'As Cartas da Corte podem representar atitudes, estágios de aprendizagem e formas de agir.', numbers:'Números revelam progressão, tensão, maturidade e encerramento dentro de cada naipe.', elements:'Elementos mostram afinidades e contrastes entre emoção, pensamento, ação e matéria.', positions:'A posição cria uma pergunta específica para a carta responder simbolicamente.', combinations:'Combine cartas observando repetição, contraste, direção e contexto.', synthesis:'Uma síntese reúne o tema central sem copiar cada interpretação isolada.', 'practice-spreads':'Comece com poucas posições, registre a pergunta e revise a leitura depois.', 'celtic-cross':'A Cruz Celta organiza presente, desafio, raízes, possibilidades e síntese.', 'royal-table':'A Mesa Real observa as 78 cartas como um sistema completo em 13 fileiras de 6.', ethics:'Leituras responsáveis respeitam consentimento, realidade observável e liberdade de escolha.', advanced:'Prática avançada exige método, registro, revisão e humildade interpretativa.'
});

export class SchoolEngine {
  constructor(root) {
    this.root = root;
    this.state = normalizeSchoolState(store.get(SCHOOL_STORAGE_KEY));
    this.query = '';
    this.activeModule = this.state.lastModule;
    this.render();
  }

  save() { store.set(SCHOOL_STORAGE_KEY, this.state); }
  lessonsFor(module) {
    if (module.kind === 'major') return CARDS.filter(card => card.arcanaCode === 'major').map(card => ({ id:`card-${card.id}`, title:card.name, card }));
    if (['Paus','Copas','Espadas','Ouros'].includes(module.kind)) return CARDS.filter(card => card.suit === module.kind).map(card => ({ id:`card-${card.id}`, title:card.name, card }));
    if (module.id === 'court') return CARDS.filter(card => card.court).map(card => ({ id:`card-${card.id}`, title:card.name, card }));
    return [{ id:`theory-${module.id}`, title:module.title, body:GENERAL_LESSONS[module.id] || module.description }];
  }

  progress() {
    const required = new Set(CARDS.map(card => `card-${card.id}`));
    const done = this.state.completed.filter(id => required.has(id)).length;
    return { done, total:78, percent:Math.round(done / 78 * 100) };
  }

  render() {
    const progress = this.progress();
    this.root.innerHTML = `<div class="school-dashboard"><div><span>SEU CAMINHO</span><strong>${progress.done}/78 aulas de cartas</strong></div><div class="school-progress"><i style="width:${progress.percent}%"></i></div><small>${progress.percent}% concluído</small></div><label class="school-search">Buscar aula ou carta<input type="search" data-school-search placeholder="Ex.: A Lua, Copas, ética" value="${safe(this.query)}"></label><div class="school-modules">${SCHOOL_MODULES.map(module => `<button data-school-module="${module.id}" class="${module.id === this.activeModule ? 'active' : ''}"><span>${String(module.order).padStart(2,'0')}</span><strong>${safe(module.title)}</strong><small>${safe(module.description)}</small></button>`).join('')}</div><div class="school-lessons" data-school-lessons></div>`;
    this.root.querySelector('[data-school-search]').addEventListener('input', event => { this.query = event.target.value; this.renderLessons(); });
    this.root.querySelector('.school-modules').onclick = event => { const button=event.target.closest('[data-school-module]'); if (!button) return; this.activeModule=button.dataset.schoolModule; this.state.lastModule=this.activeModule; this.save(); this.render(); };
    this.renderLessons();
  }

  renderLessons() {
    const module = SCHOOL_MODULES.find(item => item.id === this.activeModule) || SCHOOL_MODULES[0];
    const query = this.query.trim().toLocaleLowerCase('pt-BR');
    const lessons = this.lessonsFor(module).filter(lesson => !query || `${lesson.title} ${lesson.card?.suit || ''} ${lesson.card?.element || ''}`.toLocaleLowerCase('pt-BR').includes(query));
    const container = this.root.querySelector('[data-school-lessons]');
    container.innerHTML = `<header><p class="eyebrow">MÓDULO ${module.order}</p><h3>${safe(module.title)}</h3><p>${safe(module.description)}</p></header>${lessons.map(lesson => this.lessonMarkup(lesson)).join('') || '<p class="school-empty">Nenhuma aula encontrada neste módulo.</p>'}`;
    container.onclick = event => {
      const complete = event.target.closest('[data-complete]');
      const favorite = event.target.closest('[data-favorite]');
      const quiz = event.target.closest('[data-quiz]');
      if (complete) this.toggleList('completed', complete.dataset.complete);
      if (favorite) this.toggleList('favorites', favorite.dataset.favorite);
      if (quiz) this.answerQuiz(quiz);
    };
  }

  lessonMarkup(lesson) {
    const completed = this.state.completed.includes(lesson.id);
    const favorite = this.state.favorites.includes(lesson.id);
    if (!lesson.card) return `<article class="school-lesson theory"><span>AULA FUNDAMENTAL</span><h4>${safe(lesson.title)}</h4><p>${safe(lesson.body)}</p><div class="school-actions"><button data-complete="${lesson.id}">${completed ? '✓ Concluída' : 'Marcar como concluída'}</button><button data-favorite="${lesson.id}" aria-pressed="${favorite}">${favorite ? '★ Favorita' : '☆ Favoritar'}</button></div></article>`;
    const meaning = dailyMeaning(lesson.card);
    const alternatives = [lesson.card.element, ...['Água','Ar','Fogo','Terra'].filter(item => item !== lesson.card.element).slice(0,2)];
    return `<article class="school-lesson card-lesson"><div class="school-card-art">${cardImageMarkup(lesson.card,{priority:'auto'})}</div><div><span>${safe(lesson.card.arcana === 'Arcano Maior' ? 'ARCANO MAIOR' : lesson.card.suit)} · DIRETA</span><h4>${safe(lesson.card.name)}</h4><p>${safe(meaning.essence)}</p><details><summary>Aprofundar aula</summary><h5>Luz</h5><p>${safe(meaning.light)}</p><h5>Tensão</h5><p>${safe(meaning.tension)}</p><h5>Símbolos</h5>${meaning.symbols.map(symbol => `<p>✦ ${safe(symbol)}</p>`).join('')}<a href="${cardPageHref(lesson.card)}">Abrir página completa →</a><div class="school-quiz"><b>Exercício: qual é o elemento desta carta?</b>${alternatives.map(value => `<button data-quiz="${safe(value)}" data-answer="${safe(lesson.card.element)}">${safe(value)}</button>`).join('')}<small aria-live="polite"></small></div></details><div class="school-actions"><button data-complete="${lesson.id}">${completed ? '✓ Concluída' : 'Marcar como concluída'}</button><button data-favorite="${lesson.id}" aria-pressed="${favorite}">${favorite ? '★ Favorita' : '☆ Favoritar'}</button></div></div></article>`;
  }

  toggleList(key, id) { const set=new Set(this.state[key]); set.has(id) ? set.delete(id) : set.add(id); this.state[key]=[...set]; this.state.lastLesson=id; this.save(); this.render(); }
  answerQuiz(button) { const output=button.parentElement.querySelector('small'); const correct=button.dataset.quiz === button.dataset.answer; output.textContent=correct ? 'Resposta correta. Observe como esse elemento aparece na imagem.' : `Ainda não. O elemento correto é ${button.dataset.answer}.`; output.className=correct ? 'correct' : 'retry'; }
}
