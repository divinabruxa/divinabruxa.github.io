/** Whit Alma Divina · núcleo novo · análise, composição e verificação em um único fluxo. */
import { CARDS } from './data/cards.js';
import { SYMBOLIC_NOTICE } from './whit-alma-divina-base-v1.js';
import { writeWhitNarrative } from './whit-alma-divina-voz-v1.js';
import { WHIT_SPREADS } from './whit-alma-divina-posicoes-v1.js';
import { analyzeWhitLayout } from './whit-alma-divina-relacoes-v1.js';
import { cleanWhitText, normalizeWhitText, whitHash, secureWhitSeed } from './whit-alma-divina-utils-v1.js';
export const STORY_ENGINE_VERSION='alma-divina-1.1.0';
export const WHIT_READING_GATEWAY_VERSION='alma-divina-1.1.0';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const TOPICS=[
  ['love',/\b(amor|amar|ama|namoro|casamento|relacionamento|relacionamentos|vinculo|sentimento|sentimentos|voltar|reciprocidade|gosta de mim|sente por mim)\b/],
  ['work',/\b(trabalho|emprego|carreira|profissional|vocacao|projeto|negocio)\b/],
  ['money',/\b(dinheiro|renda|divida|recursos|financeir[oa]|investimento)\b/],
  ['family',/\b(familia|mae|pai|irmao|irma|filho|filha)\b/],
  ['identity',/\b(identidade|quem sou|autenticidade|me reconhecer|autoestima)\b/],
  ['spirit',/\b(espiritual|espiritualidade|alma|proposito|fe|sentido)\b/],
  ['choice',/\b(escolha|escolher|decidir|decisao|caminho)\b/],
  ['change',/\b(mudar|mudanca|transicao|recomecar|novo ciclo)\b/]
];
export function classifyWhitQuestion(question=''){
  const value=normalizeWhitText(question);return TOPICS.find(([,pattern])=>pattern.test(value))?.[0]||'general';
}
export function classifyWhitIntent(question=''){
  const value=normalizeWhitText(question);
  if(/\b(terminar|encerrar|desistir|separar|soltar)\b/.test(value))return 'ending';
  if(/\b(reconstruir|reparar|recomecar|recuperar|reatar)\b/.test(value))return 'renewal';
  if(/\b(esperar|aguardar|paciencia)\b/.test(value))return 'waiting';
  if(/\b(escolher|decidir|devo|aceitar|recusar)\b/.test(value))return 'decision';
  return 'understanding';
}
function spreadFrom(options){
  if(options.spreadId)return options.spreadId;
  const scope=String(options.scope||'tarot-livre');
  if(scope==='carta-do-dia'||scope==='tarot-livre')return scope;
  if(scope==='biblioteca')return 'conselho';
  if(scope.startsWith('tiragem-')&&WHIT_SPREADS[scope.slice(8)])return scope.slice(8);
  throw new TypeError('Identifique uma tiragem válida.');
}
function adaptedPositions(spreadId,options){
  if(options.scope==='biblioteca'){
    if(options.cards.length!==1)throw new TypeError('A consulta da Biblioteca exige uma carta.');
    return [0];
  }
  // Na aplicação atual a data diária é passada como posição; ela é metadado, não uma casa do Tarot.
  if(spreadId==='carta-do-dia'){
    if(options.cards.length!==1)throw new TypeError('Carta do Dia exige uma carta.');
    if(options.positions&&(!Array.isArray(options.positions)||options.positions.length!==1))throw new TypeError('Posição diária incompatível.');
    return [0];
  }
  if(spreadId==='tarot-livre'){
    if(!options.positions)return undefined;
    return options.positions.map((p,i)=>{
      if(Number.isInteger(p))return p;
      const match=/^(?:posi[çc][aã]o[-\s]+|Passagem\s+)(\d+)$/i.exec(String(p));
      if(match)return Number(match[1])-1;
      throw new TypeError('Posição livre inválida: '+String(p));
    });
  }
  return options.positions;
}
export function whitTarotReading(options={}){
  if(!options||typeof options!=='object')throw new TypeError('Entrada inválida.');
  if(options.cards==null)return null;
  if(!Array.isArray(options.cards)||options.cards.length===0)throw new TypeError('Revele cartas antes de pedir uma leitura.');
  if(options.language&&options.language!=='pt-BR')throw new TypeError('Este núcleo editorial inicial está disponível em PT-BR.');
  const question=cleanWhitText(options.question??options.intention,700);
  const topic=classifyWhitQuestion(question);
  const intent=classifyWhitIntent(question);
  const spreadId=spreadFrom(options);
  const layout=analyzeWhitLayout({cards:options.cards,spreadId,positions:adaptedPositions(spreadId,options)});
  const seed=cleanWhitText(options.seed,128)||whitHash(JSON.stringify([layout.contexts.map(c=>[c.card.canonicalId,c.position.index]),question,spreadId])).toString(16);
  const text=writeWhitNarrative({layout,topic,intent,seed});
  if(!text.essence||!text.story||!text.counselText||text.provenance.length!==options.cards.length)throw new Error('A leitura não passou pela verificação.');
  return freeze({...text,engine:'Whit Alma Divina',version:STORY_ENGINE_VERSION,signature:'ALMA DIVINA · SIMBÓLICA',
    symbolicNotice:SYMBOLIC_NOTICE,scope:options.scope||spreadId,spreadId,topic,intent,seed,
    analysis:layout,validation:{passed:true,cardsConsidered:layout.contexts.length,positionAware:true},
    engineProfile:{gateway:WHIT_READING_GATEWAY_VERSION,legacyFallback:false},
    consultationContext:{version:STORY_ENGINE_VERSION,canonicalIds:layout.contexts.map(c=>c.card.canonicalId),positions:layout.contexts.map(c=>c.position.index),spreadId,question,seed},
    tarotGrounded:true
  });
}

const routeAction=(route,label,description)=>({kind:'route',route,href:'#/'+route,label,description});
export function storyResponse(input,options={}){
  const raw=cleanWhitText(input,700),text=normalizeWhitText(raw);
  // Interromper a ficção em pedidos explícitos de dano imediato; não produzir um conselho tarológico.
  if(/\b(vou me matar|quero me matar|quero morrer|vou me ferir|vou matar alguem)\b/.test(text))return freeze({safety:true,actions:[],text:'Sua segurança merece apoio humano agora. Se houver risco imediato, procure o serviço de emergência local e uma pessoa de confiança que possa ficar com você. A Whit não vai transformar esse momento em uma leitura de Tarot.',storyTitle:'Sua segurança vem primeiro',storySignature:'APOIO HUMANO',consultationContext:null});
  const context=options.consultationContext;
  const named=CARDS.map(c=>({card:c,index:(' '+text+' ').indexOf(' '+normalizeWhitText(c.name)+' ')})).filter(v=>v.index>=0).sort((a,b)=>a.index-b.index).map(v=>v.card);
  const draw=/\b(tire|tirar|puxe|puxar|sortear|sorteie|revelar|revele)\b/.test(text)&&/\bcarta\b/.test(text);
  let cards=named,spreadId='tarot-livre',positions,seed=cleanWhitText(options.seed,128),question=raw;
  if(!named.length&&!draw&&['alma-divina-1.0.0',STORY_ENGINE_VERSION].includes(context?.version)){
    cards=context.canonicalIds.map(id=>CARDS.find(c=>c.canonicalId===id));
    spreadId=context.spreadId;positions=context.positions;seed=context.seed;
    question=classifyWhitQuestion(raw)!=='general'?raw:classifyWhitIntent(raw)!=='understanding'?`${context.question} ${raw}`:context.question;
  }else if(draw&&!named.length){
    seed=seed||secureWhitSeed();cards=[CARDS[whitHash(seed)%CARDS.length]];
  }
  if(!cards.length)return freeze({safety:false,storyTitle:'Antes da história, a sua mesa',storySignature:'ALMA DIVINA',text:'Posso construir uma história simbólica com as cartas que você revelar. Abra uma tiragem, escreva o nome de uma carta ou peça para tirar uma carta. Sua pergunta pode orientar a leitura; não vou inventar uma biografia para preencher o que você não contou.',actions:[routeAction('tarot','Abrir o Tarot Livre','Revelar cartas no seu ritmo'),routeAction('tiragens','Escolher uma tiragem','Relacionar cartas e posições')],consultationContext:null});
  const reading=whitTarotReading({cards,spreadId,positions,seed,question});
  const focus=/\b(conselho|atitude|agir)\b/.test(text)?'action':/\b(espiritual|espiritualidade)\b/.test(text)?'spirit':/\b(mente|tensao)\b/.test(text)?'mind':null;
  return freeze({text:focus?SYMBOLIC_NOTICE+'\n\n'+reading.depthResponses[focus]:reading.depthResponses.complete,
    storyTitle:reading.title,storySignature:reading.signature,storyCard:cards[0],safety:false,actions:[],
    consultationContext:reading.consultationContext,tarotGrounded:true,version:STORY_ENGINE_VERSION});
}
