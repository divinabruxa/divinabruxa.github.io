export const CONSULTATION_SERVICES = Object.freeze([
  Object.freeze({
    id:'mesa-real-profissional', name:'Mesa Real Profissional', shortName:'Mesa Real',
    priceCents:25000, sigil:'✺', duration:'Leitura mais completa',
    description:'Uma leitura ampla para observar ciclos, caminhos, relações e decisões com profundidade.',
    idealFor:'Para compreender o cenário inteiro.',
    includes:Object.freeze(['Mesa completa','Síntese dos caminhos','Orientação final'])
  }),
  Object.freeze({
    id:'leitura-mentes', name:'Leitura de Mente', shortName:'Mente',
    priceCents:20000, sigil:'☾', duration:'Leitura direcionada',
    description:'Uma leitura simbólica da dinâmica, dos sinais e das intenções percebidas entre duas pessoas.',
    idealFor:'Para relações e movimentos emocionais.',
    includes:Object.freeze(['Dinâmica atual','Intenções simbólicas','Conselho de proteção'])
  }),
  Object.freeze({
    id:'carta-conselho', name:'Carta de Conselho', shortName:'Conselho',
    priceCents:15000, sigil:'◇', duration:'Uma carta profunda',
    description:'Uma carta para iluminar uma situação e oferecer orientação clara, cuidadosa e objetiva.',
    idealFor:'Para uma direção essencial no presente.',
    includes:Object.freeze(['Uma carta','Interpretação profunda','Conselho objetivo'])
  }),
  Object.freeze({
    id:'pergunta-direta', name:'Pergunta', shortName:'Pergunta',
    priceCents:5000, sigil:'✦', duration:'Uma questão específica',
    description:'Uma pergunta bem definida para compreender o momento e o próximo passo possível.',
    idealFor:'Para uma dúvida pontual que pede foco.',
    includes:Object.freeze(['Uma pergunta','Resposta simbólica','Direção prática'])
  })
]);

export const consultationById = id => CONSULTATION_SERVICES.find(service => service.id === id) || null;
export const money = cents => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(Number(cents || 0) / 100);
