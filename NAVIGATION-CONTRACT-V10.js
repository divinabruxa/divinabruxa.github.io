// Contrato de navegação da Macroetapa 1. Não inicializa nada sozinho.
export const DIVINA_ROUTES = Object.freeze({
  home: 'home', tarot: 'tarot', daily: 'dailyCard', library: 'cardLibrary',
  school: 'school', spreads: 'spreads', journal: 'journal', skins: 'skins',
  premium: 'subscription', ai: 'ai', consultations: 'consultation',
  store: 'store', media: 'media', account: 'account', admin: 'admin'
});

export function resolveDivinaRoute(id) {
  return DIVINA_ROUTES[id] || null;
}
