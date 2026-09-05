/* DIVINA BRUXA — CONSULTAS CELESTIAIS V143
   Atendimento humano separado de Premium, Orbe IA e tiragens automáticas. */

export const CONSULTATION_POLICY=Object.freeze({
  schemaVersion:'9.0.0',
  priceTableVersion:'consultas-2026-09-05-v143',
  environment:'sandbox',
  realBilling:false,
  contactEmail:'orbedasrealidades@hotmail.com',
  channels:Object.freeze(['email']),
  phoneRequired:true,
  independentProducts:true,
  consumesAICredits:false,
  includedInPremium:false,
  services:Object.freeze([
    Object.freeze({id:'mesa-real-profissional',name:'Mesa Real Profissional',shortName:'Mesa Real',price:250,priceCents:25000,sigil:'✺',duration:'Leitura completa',delivery:'Prazo confirmado por e-mail',detail:'Uma leitura ampla para observar ciclos, caminhos, relações e decisões.',includes:Object.freeze(['Mesa completa','Síntese dos caminhos','Orientação final'])}),
    Object.freeze({id:'leitura-mentes',name:'Leitura de Mentes',shortName:'Mentes',price:150,priceCents:15000,sigil:'☾',duration:'Leitura direcionada',delivery:'Prazo confirmado por e-mail',detail:'Leitura simbólica da dinâmica, intenções e padrões entre você e outra pessoa.',includes:Object.freeze(['Dinâmica atual','Intenções simbólicas','Conselho de proteção'])}),
    Object.freeze({id:'carta-conselho',name:'Carta de Conselho',shortName:'Conselho',price:100,priceCents:10000,sigil:'◇',duration:'Uma carta profunda',delivery:'Prazo confirmado por e-mail',detail:'Uma carta para iluminar uma situação e oferecer orientação clara e cuidadosa.',includes:Object.freeze(['Uma carta','Interpretação profunda','Conselho objetivo'])}),
    Object.freeze({id:'pergunta-direta',name:'Pergunta Direta',shortName:'Pergunta',price:50,priceCents:5000,sigil:'✦',duration:'Uma questão',delivery:'Prazo confirmado por e-mail',detail:'Uma pergunta específica para compreender o momento e o próximo passo possível.',includes:Object.freeze(['Uma pergunta','Resposta simbólica','Direção prática'])})
  ]),
  safeguards:Object.freeze([
    'A solicitação não realiza cobrança.',
    'Consultas são atendimentos humanos separados do Premium e da Orbe IA.',
    'Nenhuma consulta consome créditos de IA.',
    'Valores futuros podem mudar; cada pedido preserva seu price_snapshot.'
  ])
});

export const consultationById=id=>CONSULTATION_POLICY.services.find(service=>service.id===id)||null;
export const consultationPriceSnapshot=service=>Object.freeze({
  serviceId:service.id,
  serviceName:service.name,
  price:service.price,
  priceCents:service.priceCents,
  currency:'BRL',
  priceTableVersion:CONSULTATION_POLICY.priceTableVersion,
  capturedAt:new Date().toISOString()
});
