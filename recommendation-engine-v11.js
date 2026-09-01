// Recomendações determinísticas e explicáveis; não usa texto íntimo.
export function recommend(signals = {}) {
  const out = [];
  if (signals.completedLesson) out.push({ type: 'next-lesson', reason: 'você concluiu uma aula' });
  if (signals.favoriteSkin) out.push({ type: 'favorite-skin', reason: 'você escolheu esta skin' });
  if (signals.cardReviewDue) out.push({ type: 'flashcard-review', reason: 'há uma revisão de estudo disponível' });
  if (signals.startedSeason) out.push({ type: 'continue-season', reason: 'você começou esta temporada' });
  return out.length ? out : [{ type: 'daily-prompt', reason: 'sugestão editorial do dia' }];
}

export function filterSensitiveSignals(signals = {}) {
  const allowed = new Set(['explicitTopic','completedLesson','favoriteSkin','startedSeason','cardReviewDue','language','deviceClass']);
  return Object.fromEntries(Object.entries(signals).filter(([key]) => allowed.has(key)));
}
