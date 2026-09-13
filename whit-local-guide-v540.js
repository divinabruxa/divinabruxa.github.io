/* DIVINA BRUXA 3.0 · WHIT LOCAL V540
   Guia determinístico e honesto: usa somente a mensagem enviada pela pessoa,
   não chama rede, não lê outros campos e não reivindica consciência. */

const RELEASE = 'V540';
const MAX_INPUT = 5000;
const clean = value => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_INPUT);
const normalized = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const containsAny = (text, terms) => terms.some(term => text.includes(term));

const RISK = Object.freeze({
  immediate:Object.freeze(['me matar','me machucar','quero morrer','suicid','tirar minha vida','nao quero viver','nao aguento mais viver','kill myself','suicide','hacerme dano','quitarme la vida']),
  medical:Object.freeze(['diagnostico','diagnóstico','remedio','remédio','medicamento','dose','sintoma','doenca','doença','medical','medicine','diagnóstico médico']),
  legal:Object.freeze(['processo judicial','advogado','crime','prisao','prisão','legal advice','demanda judicial']),
  financial:Object.freeze(['investir todo','emprestimo','empréstimo','divida','dívida','aposta','investment advice','deuda'])
});

const THEMES = Object.freeze([
  Object.freeze({ id:'tarot', terms:['tarot','carta','arcano','tiragem','cruz celta','mesa real'], observation:'Você trouxe uma linguagem simbólica. O valor está em relacionar imagem, posição e realidade observável — não em transformar uma carta em sentença.', possibility:'A carta pode funcionar como uma lente para perceber uma tensão, um recurso ou uma escolha que já existe.' }),
  Object.freeze({ id:'study', terms:['aula','estudar','aprender','escola','modulo','módulo','exercicio','exercício'], observation:'Você está diante de um aprendizado que cresce por relação e prática, não apenas por memorização.', possibility:'Uma explicação simples, seguida de recuperação ativa, costuma revelar exatamente onde a compreensão ainda precisa amadurecer.' }),
  Object.freeze({ id:'decision', terms:['decidir','escolha','escolher','duvida','dúvida','caminho','opcao','opção'], observation:'Existe uma escolha pedindo clareza. Separar fatos, desejos e receios reduz o peso sem fingir que há uma resposta única.', possibility:'Talvez a decisão fique mais nítida quando você comparar o custo reversível de cada caminho com aquilo que realmente importa agora.' }),
  Object.freeze({ id:'emotion', terms:['sentindo','sentimento','ansiosa','ansioso','medo','triste','amor','saudade','raiva'], observation:'Há uma experiência emocional pedindo espaço antes de receber uma solução.', possibility:'Nomear o que aconteceu, o que foi interpretado e o que o corpo está sinalizando pode devolver um pouco de escolha.' }),
  Object.freeze({ id:'creation', terms:['criar','musica','música','projeto','site','arte','escrever','compor'], observation:'Você trouxe algo em processo de criação. A visão pode continuar grande enquanto o próximo gesto permanece pequeno e concreto.', possibility:'Escolher uma parte que já pode existir hoje ajuda a transformar intensidade em continuidade.' })
]);

function safetyResponse(kind) {
  if (kind === 'immediate') return Object.freeze({
    safetyIntercepted:true,
    observation:'O que você escreveu pode indicar risco imediato. Eu não vou transformar isso em símbolo ou previsão.',
    possibility:'Você merece apoio humano presente agora, sem precisar explicar tudo perfeitamente.',
    limit:'Sou um guia local de texto e não consigo avaliar sua segurança, localizar você ou substituir atendimento de emergência.',
    gesture:'Afaste-se de qualquer meio de se machucar, procure uma pessoa de confiança e contate o serviço de emergência ou apoio de crise da sua região agora. Se houver perigo imediato, não fique sozinha.'
  });
  const labels = { medical:'saúde', legal:'questões jurídicas', financial:'decisões financeiras' };
  return Object.freeze({
    safetyIntercepted:true,
    observation:`Sua mensagem toca em ${labels[kind]}. Esse tema pode ter consequências reais e merece informação profissional adequada ao seu caso.`,
    possibility:'Você pode usar esta conversa para organizar perguntas, fatos e documentos que deseja levar a uma pessoa qualificada.',
    limit:'Whit local não diagnostica, prescreve, oferece aconselhamento jurídico nem recomenda decisões financeiras individuais.',
    gesture:'Anote a principal dúvida e procure um profissional habilitado. Se houver urgência ou risco imediato, use o serviço de emergência da sua região.'
  });
}

function detectRisk(text) {
  for (const [kind, terms] of Object.entries(RISK)) if (containsAny(text, terms)) return kind;
  return '';
}

function themeFor(text, focus) {
  if (focus === 'tarot') return THEMES[0];
  if (focus === 'school') return THEMES[1];
  return THEMES.find(theme => containsAny(text, theme.terms)) || Object.freeze({
    id:'reflection',
    observation:'Você trouxe uma questão que merece ser organizada sem pressa e sem uma resposta fabricada.',
    possibility:'Separar o que é fato, interpretação, desejo e receio pode revelar uma possibilidade que ainda não estava visível.',
  });
}

function nextGesture(theme, mode) {
  const gestures = {
    tarot:'Escolha um símbolo da carta e escreva uma situação concreta em que ele aparece. Depois pergunte: “o que depende de mim aqui?”',
    study:'Feche a explicação por um instante e tente dizer a ideia em três frases. O ponto que faltar indica a próxima revisão.',
    decision:'Crie duas colunas: “sei por fatos” e “estou imaginando”. Escolha uma ação pequena e reversível para obter informação real.',
    emotion:'Complete, sem se corrigir: “quando isso aconteceu, eu senti…, pensei… e agora preciso…”.',
    creation:'Defina uma parte que possa ficar pronta em vinte minutos e conclua somente essa passagem.',
    reflection:'Escreva uma frase para cada camada: fato, interpretação, desejo e próximo passo observável.'
  };
  const base = gestures[theme.id] || gestures.reflection;
  return mode === 'terra' ? `${base} Depois, registre o que mudou na sua compreensão.` : base;
}

export function createLocalWhitResponse({ message, focus = 'reflection', mode = 'luna' } = {}) {
  const input = clean(message);
  const text = normalized(input);
  const safeMode = mode === 'terra' ? 'terra' : 'luna';
  const risk = detectRisk(text);
  const parts = risk ? safetyResponse(risk) : (() => {
    const theme = themeFor(text, focus);
    return Object.freeze({
      safetyIntercepted:false,
      observation:theme.observation,
      possibility:theme.possibility,
      limit:'Esta é uma reflexão local baseada somente nas palavras que você decidiu enviar. Não é consciência, previsão, leitura de pensamentos nem análise ilimitada.',
      gesture:nextGesture(theme, safeMode)
    });
  })();
  const content = [
    `OBSERVAÇÃO\n${parts.observation}`,
    `POSSIBILIDADE\n${parts.possibility}`,
    `LIMITE\n${parts.limit}`,
    `PRÓXIMO GESTO\n${parts.gesture}`
  ].join('\n\n');
  return Object.freeze({
    release:RELEASE,
    mode:safeMode,
    focus:clean(focus).slice(0, 60),
    content,
    structure:Object.freeze(['observação','possibilidade','limite','próximo gesto']),
    provenance:'local-rule-guide',
    safetyIntercepted:parts.safetyIntercepted,
    networkCalls:0,
    modelCalls:0,
    creditsUsed:0,
    privateReads:0
  });
}

export const WHIT_LOCAL_CONTRACT_V540 = Object.freeze({
  release:RELEASE,
  usesOnlySubmittedMessage:true,
  readsJournalSilently:false,
  readsSchoolNotesSilently:false,
  readsTarotQuestionSilently:false,
  networkCalls:0,
  modelCalls:0,
  creditsUsed:0,
  privateReads:0,
  claimsConsciousness:false,
  claimsMindReading:false,
  highRiskInterception:true
});
