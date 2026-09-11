/* DIVINA BRUXA — VERDADE COMERCIAL ÚNICA V200 · REBIRTH R020
   Fonte canônica do runtime. Valores em centavos evitam divergência decimal. */

const freezeItems=items=>Object.freeze(items.map(item=>Object.freeze(item)));

export const COMMERCIAL_TRUTH_V200=Object.freeze({
  release:'V200',
  truthVersion:'commercial-2026-09-10-r020',
  consultationPriceTableVersion:'consultas-2026-09-10-r020',
  billingCatalogVersion:'V191',
  currency:'BRL',
  environment:'staging',
  realBilling:false,
  checkoutEnabled:false,
  officialContact:Object.freeze({email:'orbedasrealidades@hotmail.com',whatsapp:null}),
  affiliate:Object.freeze({amazonAssociateTag:'orbedasrealid-20'}),
  plans:freezeItems([
    {id:'presence',productKey:'presence_free',name:'Presença',price:0,priceCents:0,cycle:'para sempre',billingMode:'free',description:'Tarot Livre, Carta do Dia e ritual diário.'},
    {id:'premium',productKey:'premium_lifetime',name:'Divina Bruxa Premium',price:199.90,priceCents:19990,cycle:'pagamento único',billingMode:'payment',description:'Mesa Real, Escola offline e todas as 30 skins cosméticas.',includesAI:false,includesAllSkins:true},
    {id:'orbe-ia',productKey:'orbe_ai_monthly',name:'Orbe IA',price:89.90,priceCents:8990,cycle:'por mês · 400 créditos',billingMode:'subscription',description:'Conversas simbólicas com controle de créditos.',creditsPerCycle:400}
  ]),
  aiCredits:freezeItems([
    {id:'ia-200',productKey:'credits_200',credits:200,price:39.90,priceCents:3990,billingMode:'payment'},
    {id:'ia-600',productKey:'credits_600',credits:600,price:99.90,priceCents:9990,billingMode:'payment'},
    {id:'ia-1500',productKey:'credits_1500',credits:1500,price:199.90,priceCents:19990,billingMode:'payment'}
  ]),
  aiUsage:Object.freeze({lunaPerResponse:1,terraPerResponse:10,solEnabled:false,premiumIncludesAI:false}),
  skins:Object.freeze({count:30,freeId:'classic',freeName:'Clássica Divina',premiumIncludesAll:true,cosmeticOnly:true}),
  services:freezeItems([
    {
      id:'mesa-real-profissional',
      name:'Mesa Real Profissional',
      shortName:'Mesa Real',
      price:500,
      priceCents:50000,
      sigil:'✺',
      duration:'Leitura mais completa',
      delivery:'Confirmação por e-mail',
      detail:'Uma leitura ampla para observar ciclos, caminhos, relações e decisões com profundidade.',
      description:'Leitura profunda e completa da sua realidade atual.',
      idealFor:'Para quem deseja compreender o cenário inteiro.',
      includes:Object.freeze(['Mesa completa','Síntese dos caminhos','Orientação final'])
    },
    {
      id:'leitura-mentes',
      name:'Leitura de Pensamentos',
      shortName:'Pensamentos',
      price:500,
      priceCents:50000,
      sigil:'☾',
      duration:'Leitura direcionada',
      delivery:'Confirmação por e-mail',
      detail:'Uma leitura simbólica da dinâmica, dos sinais e das intenções percebidas entre duas pessoas.',
      description:'Leitura simbólica da dinâmica, intenções e padrões da relação.',
      idealFor:'Para relações, dúvidas e movimentos emocionais.',
      includes:Object.freeze(['Dinâmica atual','Intenções simbólicas','Conselho de proteção'])
    },
    {
      id:'carta-conselho',
      name:'Carta de Conselho',
      shortName:'Conselho',
      price:300,
      priceCents:30000,
      sigil:'◇',
      duration:'Uma carta profunda',
      delivery:'Confirmação por e-mail',
      detail:'Uma carta para iluminar uma situação e oferecer orientação clara, cuidadosa e objetiva.',
      description:'Uma carta, uma questão e uma orientação objetiva.',
      idealFor:'Para uma direção essencial no momento presente.',
      includes:Object.freeze(['Uma carta','Interpretação profunda','Conselho objetivo'])
    },
    {
      id:'pergunta-direta',
      name:'Pergunta',
      shortName:'Pergunta',
      price:150,
      priceCents:15000,
      sigil:'✦',
      duration:'Uma questão específica',
      delivery:'Confirmação por e-mail',
      detail:'Uma pergunta bem definida para compreender o momento e o próximo passo possível.',
      description:'Uma pergunta objetiva com orientação simbólica.',
      idealFor:'Para uma dúvida pontual que pede foco.',
      includes:Object.freeze(['Uma pergunta','Resposta simbólica','Direção prática'])
    }
  ])
});

export const commercialProductByKey=key=>[...COMMERCIAL_TRUTH_V200.plans,...COMMERCIAL_TRUTH_V200.aiCredits].find(item=>item.productKey===key)||null;
export const commercialServiceById=id=>COMMERCIAL_TRUTH_V200.services.find(item=>item.id===id)||null;

export const assertCommercialTruthV200=()=>{
  const truth=COMMERCIAL_TRUTH_V200;
  const consultationPrices=truth.services.map(item=>item.priceCents).join(',');
  const productKeys=[...truth.plans.filter(item=>item.priceCents>0),...truth.aiCredits].map(item=>item.productKey);
  if(consultationPrices!=='50000,50000,30000,15000')throw new Error('COMMERCIAL_CONSULTATION_PRICE_DRIFT');
  if(new Set(productKeys).size!==productKeys.length)throw new Error('COMMERCIAL_DUPLICATE_PRODUCT_KEY');
  if(truth.realBilling||truth.checkoutEnabled)throw new Error('COMMERCIAL_BILLING_GATE_OPEN');
  return true;
};
assertCommercialTruthV200();
