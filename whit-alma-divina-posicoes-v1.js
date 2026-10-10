/** Posições: funções narrativas, sem trocar sorteio, disposição ou acesso Premium. */
import { SPREAD_LIST } from './spread-state-v310.js';
export const WHIT_POSITION_VERSION = '1.0.0';
const freeze = v => { if(v && typeof v==='object' && !Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);} return v; };
const ROLES = freeze({
  present:{ lens:'contexto presente', task:'descrever a situação simbólica em curso, sem inventar acontecimentos' },
  challenge:{ lens:'tensão ou obstáculo', task:'mostrar como a força da carta pode encontrar resistência ou exceder sua medida' },
  intention:{ lens:'intenção consciente', task:'explorar o valor ou objetivo que orienta a pergunta' },
  foundation:{ lens:'base da situação', task:'explorar o padrão de sustentação, sem afirmar uma causa biográfica' },
  past:{ lens:'padrão que se afasta', task:'tratar a carta como antecedente narrativo e não como previsão' },
  future:{ lens:'movimento possível', task:'descrever uma direção condicional, dependente de contexto e atitudes' },
  posture:{ lens:'modo de participação', task:'examinar uma postura possível da pessoa, sem atribuir culpa' },
  environment:{ lens:'contexto e relações', task:'explorar condições do vínculo ou ambiente sem revelar pensamentos de terceiros' },
  hopeFear:{ lens:'expectativa e receio', task:'examinar o desejo e seu contraponto sem confundi-los com fatos' },
  synthesis:{ lens:'integração da sequência', task:'relacionar a carta ao percurso inteiro; não prometer um resultado certo' },
  counsel:{ lens:'gesto concreto', task:'transformar a força e a tensão da carta em uma atitude possível' },
  resource:{ lens:'recurso disponível', task:'explorar uma capacidade simbolizada, sem afirmar disponibilidade material real' },
  value:{ lens:'critério e valor', task:'buscar um critério coerente com a carta para orientar a reflexão' },
  perception:{ lens:'percepção subjetiva', task:'explorar uma leitura possível, distinguindo percepção de comprovação' },
  observation:{ lens:'verificação na realidade', task:'formular o que valeria observar; a carta não fornece evidência factual' },
  ambiguity:{ lens:'informação incompleta', task:'reconhecer a lacuna e evitar conclusões sobre o que não foi contado' },
  projection:{ lens:'hipótese interior', task:'explorar expectativas possíveis sem diagnosticar ou afirmar projeção como fato' },
  bond:{ lens:'dinâmica de encontro', task:'examinar reciprocidade, diferenças e espaço de diálogo' },
  need:{ lens:'necessidade a explorar', task:'propor uma pergunta sobre necessidade sem declarar que ela está oculta' },
  boundary:{ lens:'limite de cuidado', task:'explorar uma proteção proporcional sem recomendar controle sobre outra pessoa' },
  opportunity:{ lens:'possibilidade concreta', task:'converter o símbolo em algo cuja viabilidade deve ser verificada' },
  cost:{ lens:'custo de um padrão', task:'examinar o preço de manter a dinâmica representada' },
  release:{ lens:'desapego possível', task:'identificar uma forma de reduzir insistência sem impor ruptura' },
  emotion:{ lens:'experiência emocional', task:'oferecer linguagem para sentimentos possíveis sem diagnosticar' },
  cycle:{ lens:'capítulo de um ciclo simbólico', task:'criar um tema de reflexão, sem prever acontecimentos num mês' },
  royal:{ lens:'relação espacial na Mesa Real', task:'relacionar vizinhanças e padrões; a coordenada não representa uma área da vida fixa' },
  sequence:{ lens:'passagem na sequência livre', task:'relacionar a carta às anteriores, sem atribuir uma casa temática inexistente' }
});
const PLAN = {
  'conselho':['counsel'],
  'tres-tempos':['past','present','future'],
  'dois-caminhos':['posture','resource','challenge','resource','challenge','value'],
  'cruz-celta':['present','challenge','intention','foundation','past','future','posture','environment','hopeFear','synthesis'],
  'mesa-real':Array(78).fill('royal'),
  'amor-relacao':['posture','environment','bond','challenge','need','boundary','counsel'],
  'vinculo-percepcoes':['perception','observation','ambiguity','projection','bond','boundary','counsel'],
  'trabalho-vocacao':['present','resource','value','challenge','resource','opportunity','future'],
  'dinheiro-recursos':['present','resource','cost','value','counsel','value'],
  'sombra-integracao':['perception','environment','resource','cost','resource','boundary','counsel'],
  'ciclo-12-meses':Array(12).fill('cycle'),
  'mandala-ano':['synthesis','posture','resource','perception','foundation','resource','counsel','bond','release','opportunity','intention','environment','emotion'],
  'arvore-da-vida':['intention','resource','foundation','opportunity','boundary','synthesis','hopeFear','perception','bond','counsel'],
  'proposito-caminho':['intention','resource','value','past','release','resource','counsel'],
  'cura-emocional':['emotion','need','resource','environment','boundary','counsel']
};
export const WHIT_SPREADS = freeze(Object.fromEntries(SPREAD_LIST.map(spread => {
  const roles = PLAN[spread.id];
  if(!roles || roles.length!==spread.positions.length) throw new Error('Tiragem incompatível: '+spread.id);
  return [spread.id,{ id:spread.id, name:spread.name, access:spread.access,
    positions:spread.positions.map((label,index) => ({index,label,role:roles[index],...ROLES[roles[index]],
      ...(spread.id==='mesa-real'?{row:Math.floor(index/13)+1,column:index%13+1}:{}),
      ...(spread.id==='dois-caminhos'&&index>=1&&index<=4?{branch:index<3?'A':'B'}:{})
    })) }];
})));
export function whitPosition(spreadId, reference) {
  if(spreadId==='carta-do-dia') {
    if(reference!==0 && reference!=='Hoje') throw new TypeError('Carta do Dia tem uma posição: Hoje.');
    return freeze({index:0,label:'Hoje',role:'present',...ROLES.present,task:'explorar um tema para observar hoje; não prever eventos do dia'});
  }
  if(spreadId==='tarot-livre') {
    if(!Number.isInteger(reference)||reference<0||reference>=78) throw new TypeError('Posição livre inválida.');
    return freeze({index:reference,label:`Passagem ${reference+1}`,role:'sequence',...ROLES.sequence});
  }
  const spread=WHIT_SPREADS[spreadId];
  if(!spread) throw new TypeError('Tiragem desconhecida: '+spreadId);
  const position=typeof reference==='string'?spread.positions.find(p=>p.label===reference):spread.positions[reference];
  if(!position || (typeof reference!=='string' && !Number.isInteger(reference))) throw new TypeError('Posição inválida para '+spreadId);
  return position;
}
export function royalNeighbors(index) {
  if(!Number.isInteger(index)||index<0||index>=78) throw new TypeError('Coordenada inválida.');
  const row=Math.floor(index/13), column=index%13;
  return Object.freeze([row>0?index-13:null,row<5?index+13:null,column>0?index-1:null,column<12?index+1:null].filter(v=>v!==null));
}
