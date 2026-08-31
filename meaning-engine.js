/* DIVINA BRUXA — PONTE DO CONTEÚDO-MÃE V5 — CHECKPOINT 1.3 */
import './tarot-meanings.js';

const source = globalThis.DivinaBruxaTarotMeanings;

function contentId(card) {
  if (!card?.canonicalId) return '';
  return card.arcanaCode === 'major' ? card.canonicalId : card.canonicalId.replace(/^\d+-/, '');
}

function defensiveFallback(card) {
  const name = card?.name || 'Esta carta';
  return {
    keywords: 'presença · reflexão · escolha consciente',
    message: `${name} convida a observar fatos, sentimentos e possibilidades antes de escolher o próximo passo.`,
    light: 'Reconheça os recursos disponíveis e use-os com clareza, medida e responsabilidade.',
    shadow: 'Observe excessos, bloqueios e automatismos sem transformar tensão em destino inevitável.',
    emotional: 'Nomeie o que sente e diferencie emoção, hipótese, desejo e comportamento observável.',
    spiritual: 'Use o símbolo como espelho de autoconhecimento, não como prova sobrenatural.',
    practical: 'Escolha uma ação pequena, segura e verificável para as próximas vinte e quatro horas.',
    question: 'Que verdade concreta esta imagem me ajuda a reconhecer agora?',
    questions: ['O que é fato?', 'O que estou sentindo?', 'Qual escolha respeita meus limites?'],
    combinations: [],
    responsibleNotice: 'Leitura simbólica; não substitui orientação profissional nem prova fatos ou destino.'
  };
}

export function meaning(card, reversed = false) { reversed=false;
  const deep = source?.get?.(contentId(card));
  if (!deep || deep.orientation !== 'normal') return defensiveFallback(card);
  return Object.freeze({
    keywords: deep.keywords.join(' · '),
    message: deep.centralMessage,
    light: deep.light,
    shadow: deep.tension,
    emotional: `${deep.love}\n\n${deep.relationships}`,
    spiritual: deep.spirituality,
    practical: `${deep.advice}\n\n${deep.action}`,
    question: deep.reflectionQuestion,
    questions: Object.freeze([deep.reflectionQuestion, deep.challenge, deep.action]),
    combinations: deep.combinations,
    responsibleNotice: deep.responsibleNotice,
    sourceId: contentId(card),
    orientation: 'normal'
  });
}

export function contentFor(card) {
  return source?.get?.(contentId(card)) || null;
}

export function validateMeaningSource() {
  return source?.validate?.() || { ok: false, errors: ['Conteúdo-mãe indisponível.'] };
}
