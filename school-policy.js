/* DIVINA BRUXA — POLÍTICA DA ESCOLA DO TAROT V186
   Aprendizado local, portável, direto e sem envio silencioso de dados. */

export const SCHOOL_STORAGE_KEY = 'school-progress-v5';
export const SCHOOL_AI_SELECTION_KEY = 'school-ai-selection-v186';
export const SCHOOL_SCHEMA_VERSION = '6.0.0';
export const SCHOOL_ORIENTATION = 'normal';
export const SCHOOL_CARD_TOTAL = 78;
export const SCHOOL_THEORY_TOTAL = 46;
export const SCHOOL_LESSON_TOTAL = SCHOOL_CARD_TOTAL + SCHOOL_THEORY_TOTAL;
export const SCHOOL_NOTE_LIMIT = 1200;

export const SCHOOL_MODULES = Object.freeze([
  ['fundamentals','Fundamentos do Tarot','A linguagem simbólica, a estrutura do baralho e uma prática responsável.','foundation'],
  ['majors','Os 22 Arcanos Maiores','Os grandes arquétipos e passagens da jornada.','major'],
  ['wands','Paus','Fogo, coragem, impulso e criação.','Paus'],
  ['cups','Copas','Água, sentimentos, vínculos e intuição.','Copas'],
  ['swords','Espadas','Ar, pensamentos, escolhas e verdade.','Espadas'],
  ['pentacles','Ouros','Terra, corpo, trabalho e recursos.','Ouros'],
  ['court','Cartas da Corte','Pajem, Cavaleiro, Rainha e Rei como modos de expressão.','court'],
  ['numbers','Números e Padrões','Do Ás ao Dez: ciclos, repetições e movimento.','theory'],
  ['elements','Naipes e Elementos','Como Água, Ar, Fogo e Terra conversam.','theory'],
  ['positions','Posições de uma Tiragem','A carta muda de função conforme a posição.','practice'],
  ['combinations','Combinações','Relações, contrastes e apoios entre cartas.','practice'],
  ['synthesis','Construção de Síntese','Como transformar várias cartas em uma leitura coerente.','practice'],
  ['practice-spreads','Tiragens Práticas','Exercícios progressivos de uma, três e cinco cartas.','practice'],
  ['celtic-cross','Cruz Celta','As dez posições tradicionais e sua integração.','practice'],
  ['royal-table','Mesa Real','As 78 posições em 13 fileiras de 6.','advanced'],
  ['ethics','Ética','Consentimento, limites e linguagem não determinista.','foundation'],
  ['advanced','Prática Avançada','Método, registro, revisão e desenvolvimento da própria voz.','advanced']
].map((item, index) => Object.freeze({ id:item[0], order:index + 1, title:item[1], description:item[2], kind:item[3] })));

export const SCHOOL_FILTERS = Object.freeze([
  Object.freeze({ id:'all', label:'Todas' }),
  Object.freeze({ id:'todo', label:'A continuar' }),
  Object.freeze({ id:'favorites', label:'Favoritas' }),
  Object.freeze({ id:'review', label:'Revisar' }),
  Object.freeze({ id:'completed', label:'Concluídas' })
]);

export const SCHOOL_THEORY_COUNTS = Object.freeze({
  fundamentals:4,
  numbers:5,
  elements:4,
  positions:4,
  combinations:4,
  synthesis:4,
  'practice-spreads':4,
  'celtic-cross':5,
  'royal-table':4,
  ethics:4,
  advanced:4
});

const MODULE_IDS = new Set(SCHOOL_MODULES.map(module => module.id));
const FILTER_IDS = new Set(SCHOOL_FILTERS.map(filter => filter.id));
const ELEMENTS = new Set(['Água', 'Ar', 'Fogo', 'Terra']);
const THEORY_IDS = new Set(Object.entries(SCHOOL_THEORY_COUNTS).flatMap(([moduleId, total]) =>
  Array.from({ length:total }, (_, index) => `theory-${moduleId}-${index + 1}`)
));

const clean = (value, limit = 160) => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, limit);
const validDate = value => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

export function normalizeSchoolText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function cardModuleId(card) {
  if (card.arcanaCode === 'major') return 'majors';
  return ({ Paus:'wands', Copas:'cups', Espadas:'swords', Ouros:'pentacles' })[card.suit] || 'fundamentals';
}

export function isSchoolLessonId(value) {
  const id = String(value ?? '');
  const card = id.match(/^card-(\d{1,2})$/);
  if (card) {
    const number = Number(card[1]);
    return Number.isInteger(number) && number >= 0 && number < SCHOOL_CARD_TOTAL;
  }
  return THEORY_IDS.has(id);
}

const lessonIds = value => [...new Set(
  (Array.isArray(value) ? value : []).map(String).filter(isSchoolLessonId)
)].slice(0, SCHOOL_LESSON_TOTAL);

const normalizeNotes = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([id, note]) => {
    const text = clean(note, SCHOOL_NOTE_LIMIT);
    return isSchoolLessonId(id) && text ? [[id, text]] : [];
  }).slice(0, SCHOOL_LESSON_TOTAL));
};

const normalizeQuiz = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([id, result]) => {
    if (!/^card-\d{1,2}$/.test(id) || !isSchoolLessonId(id) || !result || typeof result !== 'object') return [];
    const attempts = Math.max(0, Math.min(999, Math.trunc(Number(result.attempts) || 0)));
    if (!attempts) return [];
    return [[id, {
      attempts,
      correct:Boolean(result.correct),
      lastAnswer:ELEMENTS.has(result.lastAnswer) ? result.lastAnswer : null,
      updatedAt:validDate(result.updatedAt)
    }]];
  }).slice(0, SCHOOL_CARD_TOTAL));
};

export function defaultSchoolState() {
  return {
    completed:[],
    favorites:[],
    review:[],
    notes:{},
    quiz:{},
    lastModule:'fundamentals',
    lastLesson:null,
    lastStudiedAt:null,
    schemaVersion:SCHOOL_SCHEMA_VERSION
  };
}

export function normalizeSchoolState(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const lastLesson = isSchoolLessonId(source.lastLesson) ? String(source.lastLesson) : null;
  return {
    completed:lessonIds(source.completed),
    favorites:lessonIds(source.favorites),
    review:lessonIds(source.review),
    notes:normalizeNotes(source.notes),
    quiz:normalizeQuiz(source.quiz),
    lastModule:MODULE_IDS.has(source.lastModule) ? source.lastModule : 'fundamentals',
    lastLesson,
    lastStudiedAt:validDate(source.lastStudiedAt),
    schemaVersion:SCHOOL_SCHEMA_VERSION
  };
}

export function schoolFilterMatches(lessonId, state, filterId = 'all') {
  const normalized = state?.schemaVersion === SCHOOL_SCHEMA_VERSION ? state : normalizeSchoolState(state);
  const selected = FILTER_IDS.has(filterId) ? filterId : 'all';
  if (selected === 'todo') return !normalized.completed.includes(lessonId);
  if (selected === 'favorites') return normalized.favorites.includes(lessonId);
  if (selected === 'review') return normalized.review.includes(lessonId);
  if (selected === 'completed') return normalized.completed.includes(lessonId);
  return true;
}

export function mergeSchoolState(current, incoming) {
  const active = normalizeSchoolState(current);
  const backup = normalizeSchoolState(incoming);
  const quiz = { ...backup.quiz };
  Object.entries(active.quiz).forEach(([id, result]) => {
    const imported = quiz[id];
    quiz[id] = imported ? {
      attempts:Math.max(result.attempts, imported.attempts),
      correct:Boolean(result.correct || imported.correct),
      lastAnswer:result.lastAnswer || imported.lastAnswer,
      updatedAt:result.updatedAt || imported.updatedAt
    } : result;
  });
  return normalizeSchoolState({
    completed:[...active.completed, ...backup.completed],
    favorites:[...active.favorites, ...backup.favorites],
    review:[...active.review, ...backup.review],
    notes:{ ...backup.notes, ...active.notes },
    quiz,
    lastModule:backup.lastModule,
    lastLesson:backup.lastLesson || active.lastLesson,
    lastStudiedAt:backup.lastStudiedAt || active.lastStudiedAt
  });
}

export function privateSchoolExport(value) {
  return {
    project:'Divina Bruxa',
    kind:'private-school-progress-copy',
    exportedAt:new Date().toISOString(),
    private:true,
    syncState:'local-only',
    state:normalizeSchoolState(value)
  };
}

export function normalizeSchoolBackup(value) {
  if (!value || value.kind !== 'private-school-progress-copy' || !value.state) return null;
  return normalizeSchoolState(value.state);
}

export function createSchoolAISelection(input = {}) {
  const lessonId = isSchoolLessonId(input.lessonId) ? String(input.lessonId) : null;
  const moduleId = MODULE_IDS.has(input.moduleId) ? input.moduleId : null;
  if (!lessonId || !moduleId) return null;
  return Object.freeze({
    source:'school',
    consentScope:'single-school-lesson',
    lessonId,
    lessonType:lessonId.startsWith('card-') ? 'card' : 'theory',
    lessonTitle:clean(input.lessonTitle, 140),
    moduleId,
    moduleTitle:clean(input.moduleTitle, 140),
    lesson:clean(input.lesson, 3600),
    practice:clean(input.practice, 1200),
    orientation:SCHOOL_ORIENTATION,
    selectedAt:validDate(input.selectedAt) || new Date().toISOString(),
    private:true,
    excludes:Object.freeze(['notes', 'progress', 'favorites', 'history'])
  });
}

export function normalizeSchoolAISelection(value) {
  if (!value || value.consentScope !== 'single-school-lesson') return null;
  return createSchoolAISelection(value);
}
