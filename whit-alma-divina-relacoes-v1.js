/** Análise estruturada nova. Não gera ainda a resposta pública da Whit. */
import { whitCard, WHIT_THEME_AXES } from './whit-alma-divina-base-v1.js';
import { whitPosition, royalNeighbors } from './whit-alma-divina-posicoes-v1.js';
export const WHIT_RELATION_VERSION = '1.0.0';
const freeze = v => { if(v && typeof v==='object' && !Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);} return v; };
const TRANSITIONS = [
  ['esperanca','ruptura','A esperança encontra uma estrutura que precisa ser revista; preservar a luz não exige preservar toda a forma.'],
  ['ruptura','clareza','Depois de uma quebra de estrutura, a clareza permite reconhecer o que merece ser reconstruído.'],
  ['clareza','incerteza','Uma percepção clara encontra uma zona ainda ambígua; a sequência pede distinguir o conhecido do suposto.'],
  ['incerteza','clareza','A dúvida encontra uma possibilidade de esclarecimento; a narrativa pede confirmação em atitudes e fatos.'],
  ['fim','inicio','O encerramento abre espaço para uma tentativa nova, que ainda precisa de condições para crescer.'],
  ['inicio','fim','Uma iniciativa encontra um limite de continuidade; a história pede avaliar o que pode mudar ou terminar.'],
  ['apego','limite','A insistência encontra uma margem de proteção; intensidade não dispensa cuidado.'],
  ['conflito','equilibrio','O confronto encontra um convite ao ajuste; diferenças precisam de espaço e medida.'],
  ['pausa','movimento','A espera encontra uma passagem para agir; o ritmo deve incorporar o que foi aprendido no intervalo.'],
  ['movimento','pausa','O impulso encontra um intervalo; parar pode permitir rever a direção antes de continuar.'],
  ['perda','cuidado','Uma perda encontra sustentação no cuidado; reconhecer a dor não exige apagar o apoio que permanece.'],
  ['sobrecarga','limite','O excesso de responsabilidade encontra a necessidade de redistribuir peso e proteger energia.'],
  ['vinculo','verdade','Um vínculo encontra uma exigência de clareza; palavras precisam dialogar com atitudes.'],
  ['verdade','vinculo','Uma verdade encontra o campo das relações; clareza pede uma forma humana de ser comunicada.']
];
function required(ref){const c=whitCard(ref);if(!c)throw new TypeError('Carta fora do catálogo canônico.');return c;}
export function whitRelation(first,second) {
  const a=required(first),b=required(second);
  if(a.canonicalId===b.canonicalId) throw new TypeError('Uma sequência não pode repetir a mesma carta.');
  const shared=a.themes.filter(t=>b.themes.includes(t));
  const rule=TRANSITIONS.find(([left,right])=>a.themes.includes(left)&&b.themes.includes(right));
  return freeze({from:a.canonicalId,to:b.canonicalId,
    kind:rule?'transition':shared.length?'reinforcement':'contrast',sharedThemes:shared,
    narrative:rule?rule[2]:shared.length
      ? `O tema de ${WHIT_THEME_AXES[shared[0]]||shared[0]} reaparece, mas passa de ${a.strength} para ${b.strength}.`
      : `O percurso muda de ${a.strength} para ${b.strength}; a tensão de ${a.tension} encontra a necessidade de ${b.action.charAt(0).toLocaleLowerCase('pt-BR')+b.action.slice(1)}.`,
    elemental:{from:a.element,to:b.element,same:a.element===b.element}
  });
}
export function contextualizeWhitCard(reference, position) {
  const card=required(reference);
  if(!position || typeof position.task!=='string') throw new TypeError('Posição estruturada necessária.');
  const functionText=position.role==='challenge'||position.role==='cost'
    ? `A tensão a examinar é ${card.tension}.`
    : position.role==='counsel'||position.role==='boundary'
    ? card.action+'.'
    : position.role==='past'
    ? `Como antecedente simbólico, ${card.scene.charAt(0).toLocaleLowerCase('pt-BR')+card.scene.slice(1)}.`
    : position.role==='future'
    ? `Como possibilidade de movimento, ${card.scene.charAt(0).toLocaleLowerCase('pt-BR')+card.scene.slice(1)}; essa imagem não garante um acontecimento.`
    : `Como ${position.lens}, ${card.scene.charAt(0).toLocaleLowerCase('pt-BR')+card.scene.slice(1)}.`;
  return freeze({card,position,functionText,instruction:position.task});
}
export function analyzeWhitLayout({cards,spreadId,positions}={}) {
  if(!Array.isArray(cards)||cards.length<1||cards.length>78) throw new TypeError('A análise exige de 1 a 78 cartas.');
  const entries=cards.map(required);
  if(new Set(entries.map(c=>c.canonicalId)).size!==entries.length)throw new TypeError('Cartas repetidas.');
  if(positions && (!Array.isArray(positions)||positions.length!==cards.length))throw new TypeError('Quantidade de posições incompatível.');
  const contexts=entries.map((card,index)=>contextualizeWhitCard(card,whitPosition(spreadId,positions?positions[index]:index)));
  if(new Set(contexts.map(c=>c.position.index)).size!==contexts.length)throw new TypeError('Posições repetidas.');
  const elements=Object.fromEntries(['Água','Ar','Fogo','Terra'].map(e=>[e,entries.filter(c=>c.element===e).length]));
  const themes={};for(const c of entries)for(const theme of c.themes)themes[theme]=(themes[theme]||0)+1;
  const positionIndices=contexts.map(c=>c.position.index).sort((a,b)=>a-b);
  const pairs=spreadId==='mesa-real'
    ? positionIndices.flatMap(i=>royalNeighbors(i).filter(j=>j>i).map(j=>[i,j]))
    : spreadId==='dois-caminhos'
    ? [[0,1],[1,2],[0,3],[3,4],[2,5],[4,5]]
    : spreadId==='cruz-celta'
    ? [[0,1],[3,0],[4,0],[0,5],[2,6],[6,9],[7,9],[8,9],[5,9]]
    : spreadId==='mandala-ano'
    ? Array.from({length:12},(_,i)=>[0,i+1])
    : positionIndices.slice(0,-1).map((index,i)=>[index,positionIndices[i+1]]);
  const links=pairs.flatMap(([from,to])=>{
    const a=contexts.find(c=>c.position.index===from),b=contexts.find(c=>c.position.index===to);
    return a&&b?[{fromPosition:from,toPosition:to,...whitRelation(a.card,b.card)}]:[];
  });
  const numberCounts={};for(const card of entries.filter(c=>c.arcana==='minor'&&c.number!=null))numberCounts[card.number]=(numberCounts[card.number]||0)+1;
  const ordered=[...contexts].sort((a,b)=>a.position.index-b.position.index);
  return freeze({spreadId,contexts,links,elements,
    missingElements:Object.keys(elements).filter(e=>!elements[e]),
    // Elementos e ausências são contexto simbólico; nunca diagnóstico de uma pessoa.
    themes:Object.entries(themes).sort((a,b)=>b[1]-a[1]).map(([theme,count])=>({theme,count})),
    majorCount:entries.filter(c=>c.arcana==='major').length,
    courtCount:entries.filter(c=>c.court).length,
    suitCounts:Object.fromEntries(['copas','espadas','paus','ouros'].map(suit=>[suit,entries.filter(c=>c.suit===suit).length])),
    repeatedNumbers:Object.entries(numberCounts).filter(([,count])=>count>1).map(([number,count])=>({number:Number(number),count})),
    center:spreadId==='mesa-real'?contexts.filter(c=>[32,45].includes(c.position.index)):spreadId==='mandala-ano'?contexts.filter(c=>c.position.index===0):[],
    opening:ordered[0],ending:ordered.at(-1),
    notice:'Análise simbólica de cartas e posições. Não descreve fatos privados.'
  });
}
