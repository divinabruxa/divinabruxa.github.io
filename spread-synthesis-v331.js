/* DIVINA BRUXA 2.0 — REBIRTH R031 · SÍNTESE DE VIDA V331
   Integra o desenho inteiro à vida real.
   Não determina destino, não lê pensamentos e não transforma símbolo em fato. */

const strengthPattern=/favorece|recurso|força|talento|dom|apoio|possibilidade|consciente/i;
const tensionPattern=/desafio|limite|sombra|padrão|medos|bloqueio|tensão|obstáculo/i;

const FIELD=Object.freeze({
  'Copas':'vínculos, necessidades emocionais, reciprocidade e aquilo que precisa ser sentido sem ser dramatizado',
  'Paus':'desejo, coragem, iniciativa e a energia disponível para mover o que está parado',
  'Espadas':'decisões, limites, pensamentos e conversas que pedem mais clareza do que reação',
  'Ouros':'corpo, rotina, recursos, segurança e aquilo que precisa ganhar forma concreta',
  'Maiores':'uma mudança de estrutura, direção ou identidade que merece tempo para ser assimilada'
});

const ELEMENT=Object.freeze({
  'Água':'sensibilidade, vínculo e capacidade de perceber nuances',
  'Fogo':'iniciativa, desejo e coragem para agir',
  'Ar':'clareza, conversa, escolha e reorganização mental',
  'Terra':'realidade concreta, corpo, tempo, recursos e consistência',
  'indefinido':'integração entre diferentes áreas da vida'
});

const plural=(amount,one,many)=>amount===1?one:many;

function mostFrequent(entries,fallback){
  return [...entries].sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0]),'pt-BR'))[0]||fallback;
}

function responsibleNotice(tone){
  if(tone==='love')return 'Use esta leitura para observar a dinâmica e suas próprias necessidades. Ela não comprova sentimentos, fidelidade, pensamentos ou intenção de outra pessoa. Comportamento, diálogo e consentimento continuam sendo a realidade verificável.';
  if(tone==='money')return 'Use a leitura para organizar prioridades e perguntas. Ela não substitui números, contratos, avaliação de risco ou orientação financeira profissional.';
  if(tone==='career')return 'A leitura pode ajudar a perceber padrões e escolhas, mas não garante contratação, promoção, resultado profissional ou decisão de terceiros.';
  if(tone==='spirituality')return 'Símbolos podem aprofundar reflexão e prática pessoal, mas não comprovam mensagens externas, entidades ou acontecimentos sobrenaturais.';
  return 'Esta leitura organiza símbolos e relações para apoiar reflexão e escolha. Ela não determina destino, não revela fatos ocultos e não substitui orientação médica, psicológica, jurídica ou financeira.';
}

function domainAction(tone){
  if(tone==='love')return 'Observe uma necessidade sua que está clara e transforme-a em uma conversa, limite ou gesto que respeite você e a outra pessoa.';
  if(tone==='money')return 'Escolha um número, prazo, gasto, contrato ou recurso concreto para revisar antes de qualquer decisão maior.';
  if(tone==='career')return 'Defina uma ação profissional que dependa de você: uma conversa, entrega, candidatura, estudo ou limite observável.';
  if(tone==='spirituality')return 'Transforme a percepção em prática simples: silêncio, estudo, registro ou ritual simbólico que não dependa de provar o invisível.';
  return 'Escolha uma ação pequena, observável e possível que dependa de você — não da previsão de um resultado.';
}

export function synthesizeSpreadV331(items,context={}){
  const valid=Array.isArray(items)?items.filter(item=>item?.card&&item?.position):[];
  const suits=new Map(),elements=new Map(),ranks=new Map();
  let majors=0,courts=0;

  for(const {card} of valid){
    const suit=card.suit||'Maiores';
    if(card.arcanaCode==='major'||suit==='Maiores')majors+=1;
    if(card.court)courts+=1;
    suits.set(suit,(suits.get(suit)||0)+1);
    if(card.element)elements.set(card.element,(elements.get(card.element)||0)+1);
    if(Number.isInteger(card.number))ranks.set(card.number,(ranks.get(card.number)||0)+1);
  }

  const dominant=mostFrequent(suits,['Maiores',0]);
  const element=mostFrequent(elements,['indefinido',0]);
  const repeated=[...ranks].filter(([,count])=>count>1).sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0]||null;
  const field=FIELD[dominant[0]]||'escolhas, relações e acontecimentos do momento presente';
  const elementLife=ELEMENT[element[0]]||ELEMENT.indefinido;

  const opening=valid.length<=1
    ? `O ponto central desta leitura pede presença antes de resposta. Em vez de buscar uma conclusão imediata, observe onde ${field} já está aparecendo na sua vida e o que muda quando você encara isso sem pressa.`
    : majors>=Math.ceil(valid.length*.35)
      ? `Esta tiragem toca uma mudança maior do que um detalhe do dia. Há sinais de reorganização de direção, identidade ou prioridade. Na vida real, isso pede separar o que você ainda tenta manter por hábito daquilo que já está pedindo uma escolha mais consciente.`
      : `O desenho fala menos de “destino” e mais de como você está vivendo este momento. O campo mais insistente envolve ${field}. A pergunta útil agora é: onde isso já aparece em atitudes, conversas, rotina ou decisões concretas?`;

  const tension=dominant[1]>0
    ? `A tensão não está em “ter” muitas cartas de ${dominant[0]}, mas em repetir a mesma área da vida sem mudar a forma de agir. ${elementLife.charAt(0).toUpperCase()+elementLife.slice(1)} aparece como recurso e também como teste: use essa energia com consciência, sem deixar que ela vire excesso, fuga ou automatismo.${repeated?` Um mesmo ritmo numérico se repete no desenho; trate isso como insistência de tema, não como previsão.`:''}`
    : 'A leitura distribui a atenção entre áreas diferentes. O desafio é não tentar resolver tudo ao mesmo tempo: identifique qual parte realmente pede ação agora e qual pode amadurecer antes de uma decisão.';

  const first=valid[0],last=valid.at(-1);
  const possibility=first&&last&&first!==last
    ? `O movimento da tiragem vai de “${first.position}” até “${last.position}”. Em vez de tratar o final como sentença, use esse percurso como hipótese: se você mudar a maneira de responder ao ponto inicial, qual versão do desfecho se torna mais possível, mais saudável ou mais coerente com o que você quer construir?`
    : `A possibilidade está em aprofundar a posição “${first?.position||'central'}” até ela virar algo observável. Pergunte menos “o que vai acontecer?” e mais “o que esta posição me ajuda a perceber, escolher ou interromper agora?”.`;

  const strength=valid.find(item=>strengthPattern.test(item.position));
  const tensionItem=valid.find(item=>tensionPattern.test(item.position));
  const relation=strength&&tensionItem
    ? `Existe um recurso em “${strength.position}” e uma tensão em “${tensionItem.position}”. A leitura ganha poder quando os dois são vistos juntos: não use sua força para fugir do limite, nem transforme o limite em prova de que nada pode mudar. Procure a ação que respeita ambos.`
    : `Olhe para as posições que se apoiam e para as que se contradizem. Na vida, amadurecer uma escolha costuma significar sustentar duas verdades ao mesmo tempo: o que você deseja e o que a realidade exige.`;

  const integration=context.question
    ? `Volte à pergunta que você escreveu, mas troque a busca por certeza por uma pergunta de agência: “o que esta leitura está me mostrando sobre a parte que depende de mim?”. A resposta mais útil é aquela que você consegue reconhecer no cotidiano.`
    : `Resuma a tiragem em uma frase sem usar a palavra “destino”. Se a frase ainda estiver abstrata, traduza-a para comportamento: o que precisa ser dito, interrompido, organizado, escolhido ou praticado?`;

  const action=domainAction(context.tone);

  return Object.freeze({
    now:opening,
    tension,
    possibility,
    relation,
    integration,
    action,
    responsibleNotice:responsibleNotice(context.tone),
    dominantSuit:dominant[0],
    dominantElement:element[0],
    majorCount:majors,
    courtCount:courts,
    repeatedNumber:repeated?.[0]??null
  });
}
