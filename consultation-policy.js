/* DIVINA BRUXA — CONSULTAS CELESTIAIS V188
   Atendimento humano, persistência durável e rastreamento privado no STAGING. */

export const CONSULTATION_POLICY=Object.freeze({
  schemaVersion:'10.0.0',
  priceTableVersion:'consultas-2026-09-05-v147',
  environment:'staging',
  realBilling:false,
  contactEmail:'orbedasrealidades@hotmail.com',
  channels:Object.freeze(['email']),
  phoneRequired:true,
  independentProducts:true,
  consumesAICredits:false,
  includedInPremium:false,
  timezone:'America/Sao_Paulo',
  tracking:Object.freeze({
    enabled:true,
    tokenStorage:'device-and-confirmation-email',
    publicStatuses:Object.freeze([
      Object.freeze({id:'received',label:'Recebida',detail:'A solicitação foi registrada com protocolo.'}),
      Object.freeze({id:'awaiting_confirmation',label:'Aguardando confirmação',detail:'A equipe está verificando disponibilidade e detalhes.'}),
      Object.freeze({id:'confirmed',label:'Confirmada',detail:'O atendimento foi confirmado pelo canal oficial.'}),
      Object.freeze({id:'completed',label:'Concluída',detail:'O atendimento foi finalizado.'}),
      Object.freeze({id:'cancelled',label:'Cancelada',detail:'A solicitação foi encerrada sem atendimento.'})
    ])
  }),
  services:Object.freeze([
    Object.freeze({
      id:'mesa-real-profissional',
      name:'Mesa Real Profissional',
      shortName:'Mesa Real',
      price:250,
      priceCents:25000,
      sigil:'✺',
      duration:'Leitura mais completa',
      delivery:'Confirmação por e-mail',
      detail:'Uma leitura ampla para observar ciclos, caminhos, relações e decisões com profundidade.',
      idealFor:'Para quem deseja compreender o cenário inteiro.',
      includes:Object.freeze(['Mesa completa','Síntese dos caminhos','Orientação final'])
    }),
    Object.freeze({
      id:'leitura-mentes',
      name:'Leitura de Mentes',
      shortName:'Mentes',
      price:150,
      priceCents:15000,
      sigil:'☾',
      duration:'Leitura direcionada',
      delivery:'Confirmação por e-mail',
      detail:'Uma leitura simbólica da dinâmica, dos sinais e das intenções percebidas entre duas pessoas.',
      idealFor:'Para relações, dúvidas e movimentos emocionais.',
      includes:Object.freeze(['Dinâmica atual','Intenções simbólicas','Conselho de proteção'])
    }),
    Object.freeze({
      id:'carta-conselho',
      name:'Carta de Conselho',
      shortName:'Conselho',
      price:100,
      priceCents:10000,
      sigil:'◇',
      duration:'Uma carta profunda',
      delivery:'Confirmação por e-mail',
      detail:'Uma carta para iluminar uma situação e oferecer orientação clara, cuidadosa e objetiva.',
      idealFor:'Para uma direção essencial no momento presente.',
      includes:Object.freeze(['Uma carta','Interpretação profunda','Conselho objetivo'])
    }),
    Object.freeze({
      id:'pergunta-direta',
      name:'Pergunta Direta',
      shortName:'Pergunta',
      price:50,
      priceCents:5000,
      sigil:'✦',
      duration:'Uma questão específica',
      delivery:'Confirmação por e-mail',
      detail:'Uma pergunta bem definida para compreender o momento e o próximo passo possível.',
      idealFor:'Para uma dúvida pontual que pede foco.',
      includes:Object.freeze(['Uma pergunta','Resposta simbólica','Direção prática'])
    })
  ]),
  safeguards:Object.freeze([
    'A solicitação não realiza cobrança automática.',
    'Consultas são atendimentos humanos separados do Premium e da Orbe IA.',
    'Nenhuma consulta consome créditos de IA.',
    'A leitura é simbólica e não substitui orientação médica, psicológica, jurídica ou financeira.',
    'Cada pedido preserva o valor exibido no momento da confirmação.',
    'O protocolo e o código privado permitem acompanhar apenas dados resumidos do pedido.'
  ])
});

export const consultationById=id=>CONSULTATION_POLICY.services.find(service=>service.id===id)||null;

export const consultationPriceSnapshot=(service,priceTableVersion=CONSULTATION_POLICY.priceTableVersion)=>Object.freeze({
  serviceId:service.id,
  serviceName:service.name,
  price:Number(service.priceCents)/100,
  priceCents:Number(service.priceCents),
  currency:'BRL',
  priceTableVersion:String(priceTableVersion||CONSULTATION_POLICY.priceTableVersion),
  capturedAt:new Date().toISOString()
});
