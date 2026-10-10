/** Whit Alma Divina · núcleo novo · análise, composição e verificação em um único fluxo. */
import { CARDS } from './data/cards.js';
import { SYMBOLIC_NOTICE, WHIT_THEME_AXES } from './whit-alma-divina-base-v1.js';
import { WHIT_SPREADS } from './whit-alma-divina-posicoes-v1.js';
import { analyzeWhitLayout } from './whit-alma-divina-relacoes-v1.js';
import { cleanWhitText, normalizeWhitText, whitHash, secureWhitSeed } from './whit-alma-divina-utils-v1.js';
export const STORY_ENGINE_VERSION='alma-divina-1.0.0';
export const WHIT_READING_GATEWAY_VERSION='alma-divina-1.0.0';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const lower=s=>s.charAt(0).toLocaleLowerCase('pt-BR')+s.slice(1);
const sentence=s=>/[.!?]$/.test(s)?s:s+'.';
const TOPICS=[
  ['love',/\b(amor|namoro|casamento|relacionamento|vinculo|sentimento|voltar|reciprocidade)\b/],
  ['work',/\b(trabalho|emprego|carreira|profissional|vocacao|projeto|negocio)\b/],
  ['money',/\b(dinheiro|renda|divida|recursos|financeir[oa]|investimento)\b/],
  ['family',/\b(familia|mae|pai|irmao|irma|filho|filha)\b/],
  ['identity',/\b(identidade|quem sou|autenticidade|me reconhecer|autoestima)\b/],
  ['spirit',/\b(espiritual|espiritualidade|alma|proposito|fe|sentido)\b/],
  ['choice',/\b(escolha|escolher|decidir|decisao|caminho)\b/],
  ['change',/\b(mudar|mudanca|transicao|recomecar|novo ciclo)\b/]
];
const FRAMES=freeze({
  love:{label:'vínculos e sentimentos',reflection:'Observe se o encontro permite reciprocidade e se aquilo que se diz aparece também nas atitudes.',question:'Que gesto de reciprocidade você consegue observar, sem precisar adivinhar o que a outra pessoa pensa?'},
  work:{label:'trabalho e construção',reflection:'Distinga a intenção do projeto das condições que permitem realizá-lo; uma possibilidade precisa de tempo, recursos e acordos.',question:'Qual parte do próximo passo depende de você e qual precisa ser negociada?'},
  money:{label:'recursos e prioridades',reflection:'Examine condições e compromissos reais antes de tomar uma decisão material; o símbolo não promete ganho ou segurança financeira.',question:'Qual prioridade você consegue sustentar com os recursos que realmente tem?'},
  family:{label:'família e pertencimento',reflection:'Um vínculo pode ter história e ainda precisar de limites; cuidado não exige que uma pessoa sustente tudo sozinha.',question:'Que acordo tornaria a convivência mais clara sem apagar suas necessidades?'},
  identity:{label:'identidade e presença',reflection:'Procure a distância entre o que deseja expressar e o que sente que precisa esconder para ser aceita ou aceito.',question:'O que merece espaço em sua vida sem depender da aprovação de todos?'},
  spirit:{label:'sentido e espiritualidade',reflection:'A imagem espiritual oferece uma linguagem para a experiência; ela não confirma mensagens de entidades nem substitui os fatos.',question:'Que prática simples aproxima seus valores da forma como vive?'},
  choice:{label:'escolha e direção',reflection:'Compare os caminhos pelo que exigem, pelo que oferecem e pelos limites que você deseja preservar.',question:'Qual critério continua importante mesmo quando o entusiasmo ou o receio mudam?'},
  change:{label:'mudança e passagem',reflection:'Uma passagem pode precisar tanto de coragem quanto de preparação; nem tudo precisa mudar ao mesmo tempo.',question:'O que pode mudar primeiro sem abandonar aquilo que ainda sustenta você?'},
  general:{label:'momento e possibilidades',reflection:'Use a imagem para reconhecer um padrão possível e conferir onde ele se aproxima ou se afasta da sua experiência.',question:'O que nesta história encontra eco em sua experiência, e o que não encontra?'}
});
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
const INTENTS=freeze({ending:'A pergunta procura um limite de continuidade; encerrar ou permanecer precisa ser avaliado pelo que se sustenta na realidade.',renewal:'A pergunta procura uma possibilidade de reconstrução; renovar exige condições, não apenas desejo.',waiting:'A pergunta procura um ritmo de espera; dar tempo não deve impedir reconhecer uma informação importante.',decision:'A pergunta procura um critério para agir; a decisão pede comparar custos, condições e valores.',understanding:'A pergunta procura compreensão; reconhecer a dinâmica pode vir antes de escolher uma atitude.'});
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
function selectRoles(layout){
  const ordered=[...layout.contexts].sort((a,b)=>a.position.index-b.position.index);
  const tension=ordered.find(c=>['challenge','cost','hopeFear'].includes(c.position.role))||ordered.find(c=>c.card.themes.some(t=>['ruptura','conflito','dor','incerteza','apego'].includes(t)))||ordered[0];
  const direction=ordered.find(c=>['synthesis','counsel'].includes(c.position.role))||ordered.at(-1);
  return {ordered,tension,direction};
}
function compose(layout,topic,intent,seed){
  const {ordered,tension,direction}=selectRoles(layout);
  const frame=FRAMES[topic];
  const opening=layout.opening;
  const themes=layout.themes.slice(0,3).map(t=>WHIT_THEME_AXES[t.theme]);
  const link=layout.links.find(l=>l.kind==='transition')||layout.links[0];
  const lead=ordered.length===1
    ? `A imagem central é esta: ${lower(opening.card.scene)}.`
    : `A história começa por ${lower(opening.card.scene)} e encontra uma tensão: ${tension.card.tension}.`;
  const directionText=direction.position.role==='challenge'||direction.position.role==='cost'
    ? `O ponto a trabalhar é ${direction.card.tension}; a possibilidade de mudança está em ${lower(direction.card.action)}.`
    : `Uma direção possível é ${lower(direction.card.action)}.`;
  const positionSignal=ordered.length===1?'' : opening.functionText;
  const ensemble=ordered.length>1?`Os temas que atravessam a mesa convidam a ${themes.join(', ')}.`:'';
  const essence=['Ficção simbólica para reflexão.',lead,positionSignal,link?.narrative||`A força de ${opening.card.strength} precisa reconhecer o risco de ${opening.card.tension}.`,ensemble,INTENTS[intent],directionText,frame.reflection].filter(Boolean).join(' ');
  const intro=`Nesta história simbólica sobre ${frame.label}, ${lower(opening.card.scene)}. Não é uma descrição de acontecimentos que Whit conheça: é uma imagem para explorar o que a pergunta trouxe. A força de ${opening.card.strength} dá o primeiro tom à passagem.`;
  const conflict=`O ponto de atenção está em ${tension.card.tension}. ${tension.position.role==='challenge'? 'Como obstáculo, essa força pede medida antes de ser ampliada.':'Essa tensão é uma possibilidade de reflexão, não uma acusação sobre a sua vida.'} ${INTENTS[intent]} ${frame.reflection}`;
  const relations=layout.links.filter(l=>l.kind==='transition').slice(0,3);
  const movement=relations.length?relations.map(l=>l.narrative).join(' '):`O movimento precisa conciliar ${opening.card.strength} com ${direction.card.strength}. ${directionText} Antes de tomar essa direção como resposta, confira se ela corresponde às condições que você conhece.`;
  const spiritual=`No plano espiritual, a abertura evoca ${opening.card.symbol} e o movimento final evoca ${direction.card.symbol}. A imagem fala de ${themes.join(', ')}. Ela oferece uma linguagem para propósito e transformação, sem afirmar intervenção sobrenatural ou destino fixo.`;
  const final=`${directionText} Um gesto útil não precisa resolver tudo: pode apenas tornar o próximo passo mais claro. ${frame.question}`;
  const paragraphs=[intro,conflict,movement,spiritual,final];
  const love=`Nos vínculos, a força de ${tension.card.strength} convive com o risco de ${tension.card.tension}. Procure reciprocidade e limites nas atitudes observáveis; a tiragem não revela sentimentos privados de outra pessoa.`;
  const mind=`No campo da mente, ${tension.position.lens} convida a observar ${tension.card.tension}. Separe o que você sabe, o que supõe e o que ainda precisa perguntar. Uma interpretação pode ser importante sem se tornar um fato.`;
  const counsel=sentence(direction.card.action);
  const complete=[SYMBOLIC_NOTICE,...paragraphs].join('\n\n');
  const details=ordered.map(c=>`${c.position.label}: ${c.functionText}`).join('\n\n');
  const titleBank=['O fio da travessia','A passagem que pede presença','Entre o símbolo e o próximo passo'];
  return {
    title:titleBank[whitHash(seed+topic)%titleBank.length],essence,paragraphs,story:paragraphs.join('\n\n'),
    heartline:lead,whisper:essence,closing:frame.question,
    tendencyText:directionText,counselText:counsel,
    depthOptions:[{key:'complete',label:'Ler a história completa'},{key:'love',label:'Explorar os vínculos'},{key:'mind',label:'Entender a tensão'},{key:'action',label:'Ver atitudes possíveis'},{key:'spirit',label:'Explorar o sentido espiritual'},{key:'positions',label:'Entender as relações da mesa'}],
    depthResponses:{complete,love,mind,action:`${counsel} ${frame.question}`,spirit:spiritual,positions:details},
    provenance:ordered.map(c=>({canonicalId:c.card.canonicalId,position:c.position.label,role:c.position.role})),
    _parts:{opening:opening.card.canonicalId,tension:tension.card.canonicalId,direction:direction.card.canonicalId}
  };
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
  const text=compose(layout,topic,intent,seed);
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
  if(!named.length&&!draw&&context?.version===STORY_ENGINE_VERSION){
    cards=context.canonicalIds.map(id=>CARDS.find(c=>c.canonicalId===id));
    spreadId=context.spreadId;positions=context.positions;seed=context.seed;
    question=classifyWhitQuestion(raw)!=='general'?raw:context.question;
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
