// Helpers puros da Constelação de Hoje; integração com backend ocorrerá depois.
export function brasiliaDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(date);
}

export function dailyKey(userId, date = new Date()) {
  return `divina.daily.${userId || 'guest'}.${brasiliaDate(date)}`;
}

export function buildTodayModules({ revealed = false, nextLesson = null } = {}) {
  return [
    { id: 'welcome', state: 'ready' },
    { id: 'daily-card', state: revealed ? 'revealed' : 'new' },
    { id: 'deep-meaning', state: revealed ? 'ready' : 'locked' },
    { id: 'daily-pulse', state: revealed ? 'ready' : 'locked' },
    { id: 'micro-lesson', state: nextLesson ? 'ready' : 'empty' },
    { id: 'journal-prompt', state: 'optional' }
  ];
}
