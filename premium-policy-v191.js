/* DIVINA BRUXA — CONTRATO PREMIUM E BILLING V191
   Valores em centavos. A interface nunca concede acesso sem confirmação do servidor. */

export const PREMIUM_RELEASE_V191 = 'V191';

export const PREMIUM_PRODUCTS_V191 = Object.freeze([
  Object.freeze({
    key:'premium_lifetime', kind:'premium', name:'Divina Bruxa Premium',
    priceCents:19990, billingMode:'payment', cycle:'pagamento único',
    description:'A jornada completa de estudo, prática e as 30 skins da Orbe. A IA é separada.'
  }),
  Object.freeze({
    key:'orbe_ai_monthly', kind:'ai_subscription', name:'Orbe IA',
    priceCents:8990, billingMode:'subscription', cycle:'por mês', credits:400,
    description:'400 créditos por ciclo para Luna e Terra, com saldo governado pelo servidor.'
  }),
  Object.freeze({ key:'credits_200', kind:'credits', name:'200 créditos', priceCents:3990, billingMode:'payment', credits:200 }),
  Object.freeze({ key:'credits_600', kind:'credits', name:'600 créditos', priceCents:9990, billingMode:'payment', credits:600 }),
  Object.freeze({ key:'credits_1500', kind:'credits', name:'1.500 créditos', priceCents:19990, billingMode:'payment', credits:1500 })
]);

export const PREMIUM_FEATURES_V191 = Object.freeze([
  Object.freeze({ label:'Tarot Livre e Carta do Dia', free:true, premium:true }),
  Object.freeze({ label:'Biblioteca essencial e tiragens introdutórias', free:true, premium:true }),
  Object.freeze({ label:'17 módulos e 124 aulas da Escola', free:false, premium:true }),
  Object.freeze({ label:'78 aulas de cartas, flashcards e quizzes', free:false, premium:true }),
  Object.freeze({ label:'Tiragens avançadas e Mesa Real avançada', free:false, premium:true }),
  Object.freeze({ label:'Diário e Espelho avançados', free:false, premium:true }),
  Object.freeze({ label:'Conteúdo offline e jornadas sazonais', free:false, premium:true }),
  Object.freeze({ label:'Constelação completa das 30 skins', free:false, premium:true }),
  Object.freeze({ label:'Orbe IA', free:false, premium:false, note:'Produto separado' })
]);

export const BILLING_POLICY_V191 = Object.freeze({
  release:PREMIUM_RELEASE_V191,
  environment:'staging',
  checkoutProvider:'simulador interno',
  realBilling:false,
  stripeCheckoutEnabled:false,
  stripeWebhookEnabled:false,
  customerPortalEnabled:false,
  automaticTaxEnabled:false,
  premiumIncludesAI:false,
  premiumSkinCount:30,
  freeSkinId:'classic',
  products:PREMIUM_PRODUCTS_V191,
  lifecycle:Object.freeze(['snapshot','simulate_purchase','restore','refund','revoke','cancel_subscription'])
});

export const moneyV191 = cents => new Intl.NumberFormat('pt-BR', {
  style:'currency', currency:'BRL'
}).format(Math.max(0, Number(cents) || 0) / 100);

export const productV191 = key => PREMIUM_PRODUCTS_V191.find(product => product.key === key) || null;
