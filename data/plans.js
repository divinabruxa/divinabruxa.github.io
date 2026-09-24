export const PLANS = Object.freeze([
  Object.freeze({id:'presence',name:'Presença',priceCents:0,cycle:'para sempre',description:'Tarot Livre, Carta do Dia e ritual diário.',includes:Object.freeze(['Tarot Livre','Carta do Dia','Tiragens essenciais'])}),
  Object.freeze({id:'premium',name:'Divina Bruxa Premium',priceCents:19990,cycle:'pagamento único',description:'Mesa Real, Escola offline e as 30 skins cosméticas.',includes:Object.freeze(['Mesa Real','Escola completa','30 skins cosméticas']),featured:true}),
  Object.freeze({id:'orbe-ia',name:'Orbe IA',priceCents:8990,cycle:'por mês · 400 créditos',description:'Conversas simbólicas com controle transparente de créditos.',includes:Object.freeze(['Luna · 1 crédito','Terra · 10 créditos','400 créditos por ciclo'])})
]);

export const CREDIT_PACKS = Object.freeze([
  Object.freeze({credits:200,priceCents:3990}),
  Object.freeze({credits:600,priceCents:9990}),
  Object.freeze({credits:1500,priceCents:19990})
]);
