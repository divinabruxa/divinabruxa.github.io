export const PREMIUM_POLICY = Object.freeze({
  environment: 'sandbox', realBilling: false, productionPublish: false,
  plans: Object.freeze([
    Object.freeze({ id:'presence', name:'Presença', price:0, cycle:'sempre', description:'A experiência essencial da Orbe para começar.' }),
    Object.freeze({ id:'premium', name:'Premium', price:199.90, cycle:'pagamento único', description:'Mesa Real, Escola offline e skins cosméticas.' }),
    Object.freeze({ id:'orbe-ia', name:'Orbe IA', price:89.90, cycle:'por mês · 400 créditos', description:'Conversas simbólicas com controle de créditos.' })
  ]),
  skins: Object.freeze([
    Object.freeze({ id:'classica', name:'Clássica Divina', tone:'#b48b4c', status:'free' }),
    Object.freeze({ id:'lunar', name:'Lunar Mistério', tone:'#8f8be8', status:'premium' }),
    Object.freeze({ id:'solar', name:'Solar Dourada', tone:'#e3ad4b', status:'premium' }),
    Object.freeze({ id:'cosmica', name:'Cósmica', tone:'#cf73ee', status:'premium' })
  ])
});
