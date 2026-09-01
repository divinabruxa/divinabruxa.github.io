// Primitivas de aprendizagem sem dependência do backend.
export function gradeQuiz(answers = [], correct = []) {
  const total = Math.max(correct.length, 1);
  const score = answers.reduce((sum, answer, i) => sum + (answer === correct[i] ? 1 : 0), 0);
  return { score, total, percent: Math.round(score / total * 100), passed: score / total >= .7 };
}

export function nextReviewDate(now = new Date(), intervalDays = 1) {
  const date = new Date(now);
  date.setDate(date.getDate() + Math.max(1, intervalDays));
  return date.toISOString();
}

export function progressState(completed, total) {
  if (!total || completed <= 0) return 'started';
  if (completed >= total) return 'completed';
  return 'in-progress';
}
