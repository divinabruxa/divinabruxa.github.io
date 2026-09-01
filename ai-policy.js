export const AI_POLICY = Object.freeze({
  demoCredits: 400,
  modes: Object.freeze({ support: { label:'Luna · acolhimento', cost:1 }, tarot:{ label:'Terra · tarot e símbolos', cost:10 }, channel:{ label:'Luna · canalização simbólica', cost:1 }, sol:{ label:'Sol · indisponível', cost:0, enabled:false } }),
  solEnabled: false,
  requiresSubscription: true,
  requiresConsent: true,
  apiKeyLocation: 'server-only',
  thirdPartyMindReading: false,
  identityClaims: false
});

export function aiDisclosure(mode) {
  return mode === 'channel' ? 'Canalização simbólica é uma dramatização ficcional. Não é a pessoa real e não acessa pensamentos, memórias privadas ou mensagens espirituais.' : 'As respostas são geradas por IA para reflexão e não substituem ajuda médica, jurídica, financeira ou psicológica.';
}
