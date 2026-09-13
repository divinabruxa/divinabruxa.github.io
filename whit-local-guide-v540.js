/* DIVINA BRUXA 4.0 · MACROETAPA 9/14 · WHIT LOCAL SUPREMA V557
   Guia determinístico, contextual e honesto. Usa somente a mensagem submetida,
   o contexto explicitamente visível e a memória efêmera desta sessão. */

const RELEASE = 'V557';
const MAX_INPUT = 5000;
const MAX_SESSION_TURNS = 6;
const clean = (value, limit = MAX_INPUT) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit);
const normalized = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const containsAny = (text, terms) => terms.some(term => text.includes(term));

const RISK = Object.freeze({
  immediate:Object.freeze(['me matar','me machucar','quero morrer','suicid','tirar minha vida','nao quero viver','nao aguento mais viver','kill myself','suicide','hacerme dano','quitarme la vida']),
  medical:Object.freeze(['diagnostico','remedio','medicamento','dose','sintoma','doenca','medical advice','medicine','diagnostico medico']),
  legal:Object.freeze(['processo judicial','advogado','crime','prisao','legal advice','demanda judicial']),
  financial:Object.freeze(['investir todo','emprestimo','divida','aposta','investment advice','deuda'])
});

const THEMES = Object.freeze([
  Object.freeze({ id:'tarot', terms:['tarot','carta','arcano','tiragem','cruz celta','mesa real'], observations:['Você trouxe símbolos para dialogar com uma situação real. A carta ganha sentido quando imagem, posição e experiência observável são lidas juntas.','A leitura mostra uma linguagem simbólica, não uma sentença. O ponto fértil está na relação entre o símbolo e aquilo que você já consegue reconhecer.'], possibilities:['Uma carta pode iluminar uma tensão, um recurso ou uma escolha sem decidir por você.','O símbolo pode servir como espelho para perceber o que pede atenção e o que continua sob sua escolha.'], gestures:['Escolha um símbolo da carta e descreva onde ele aparece concretamente. Depois pergunte: “o que depende de mim aqui?”','Separe a leitura em três partes: o que reconheço, o que ainda é hipótese e qual gesto seguro posso experimentar.'] }),
  Object.freeze({ id:'study', terms:['aula','estudar','aprender','escola','modulo','exercicio','pratica','revisar'], observations:['Este aprendizado cresce quando compreensão e prática se encontram; memorizar sozinho não revela todas as relações.','Você está construindo linguagem simbólica. Explicar com palavras próprias mostra melhor o que já foi integrado.'], possibilities:['Uma explicação simples seguida de recuperação ativa pode revelar exatamente o ponto que ainda precisa amadurecer.','Comparar dois símbolos e criar um exemplo concreto costuma consolidar o conteúdo sem sobrecarregar.'], gestures:['Feche a explicação por um instante e diga a ideia em três frases. O ponto que faltar indica a próxima revisão.','Crie um exemplo real, explique por que ele combina com a aula e formule uma pergunta de revisão.'] }),
  Object.freeze({ id:'relationship', terms:['relacao','relacionamento','namoro','parceiro','parceira','familia','amizade','saudade','amor'], observations:['Há uma relação pedindo clareza entre o que foi vivido, o que foi interpretado e o que ainda precisa ser comunicado.','O vínculo parece carregar emoção e expectativa ao mesmo tempo. Separá-las pode devolver espaço para uma escolha mais consciente.'], possibilities:['Talvez o próximo entendimento venha de um limite claro ou de uma pergunta honesta, não de adivinhar a intenção da outra pessoa.','Observar reciprocidade, consistência e respeito oferece sinais mais confiáveis do que tentar preencher silêncios.'], gestures:['Escreva: “o que aconteceu”, “o que interpretei” e “o que preciso comunicar ou proteger”.','Escolha uma necessidade sua e transforme-a em um pedido claro, possível e sem leitura de pensamentos.'] }),
  Object.freeze({ id:'decision', terms:['decidir','escolha','escolher','duvida','caminho','opcao','posso','devo'], observations:['Existe uma escolha pedindo clareza. Misturar fatos, desejos e receios pode fazê-la parecer maior do que ela é.','Você está diante de caminhos possíveis, e nenhum guia honesto deveria fingir que conhece o resultado inevitável.'], possibilities:['A decisão pode ficar mais nítida quando você compara custos reversíveis, valores envolvidos e informação ainda ausente.','Um pequeno teste pode produzir evidência real antes de uma decisão maior.'], gestures:['Crie duas colunas: “sei por fatos” e “estou imaginando”. Depois escolha uma ação pequena e reversível.','Nomeie o valor que cada caminho protege, o risco real de cada um e qual informação você pode obter agora.'] }),
  Object.freeze({ id:'emotion', terms:['sentindo','sentimento','ansiosa','medo','triste','raiva','culpa','confusa','cansada'], observations:['Há uma experiência emocional pedindo espaço antes de receber uma solução.','O que você sente contém informação, mas não precisa virar uma ordem ou uma certeza sobre o futuro.'], possibilities:['Nomear acontecimento, interpretação e necessidade pode diminuir a névoa sem negar a intensidade.','Talvez seja possível acolher a emoção e ainda escolher uma ação segura, pequena e reversível.'], gestures:['Complete: “quando isso aconteceu, senti…, pensei… e agora preciso…”.','Dê um nome ao sentimento, localize o fato que o ativou e escolha uma forma segura de cuidado para os próximos dez minutos.'] }),
  Object.freeze({ id:'work', terms:['trabalho','carreira','emprego','cliente','negocio','vender','profissao'], observations:['Você trouxe uma questão prática que envolve direção, recursos e continuidade.','O caminho profissional fica mais legível quando visão, evidência e próximo movimento são separados.'], possibilities:['Um critério de sucesso observável pode transformar ansiedade difusa em decisão concreta.','Talvez a prioridade não seja fazer tudo, mas identificar a ação que reduz a maior incerteza.'], gestures:['Defina o resultado mínimo desta semana, a evidência de conclusão e o primeiro bloco de vinte minutos.','Liste impacto, esforço e reversibilidade de cada opção; comece pela que produz aprendizado mais rápido.'] }),
  Object.freeze({ id:'money', terms:['dinheiro','preco','renda','gasto','lucro','venda','orcamento'], observations:['A questão envolve dinheiro e merece separar desejo, limite e números verificáveis.','Clareza financeira começa por valores reais, horizonte de tempo e margem de segurança.'], possibilities:['Um cenário conservador e outro provável podem mostrar o que é sustentável sem prometer retorno.','Talvez o próximo passo seja medir antes de expandir.'], gestures:['Anote custo, receita esperada, prazo e pior perda aceitável; para decisões importantes, valide com profissional qualificado.','Escolha uma métrica simples para acompanhar por sete dias antes de aumentar o compromisso.'] }),
  Object.freeze({ id:'spirituality', terms:['espiritual','energia','ritual','universo','sinal','magia','intuicao'], observations:['Você trouxe uma experiência espiritual que pode ser acolhida como linguagem de sentido sem ser transformada em prova automática.','Símbolos e rituais podem organizar presença e intenção, mantendo os pés no que é observável.'], possibilities:['O significado mais útil talvez seja aquele que favorece cuidado, responsabilidade e escolha — não medo ou inevitabilidade.','A intuição pode conversar com fatos e limites, sem precisar substituir nenhum deles.'], gestures:['Pergunte: “que valor este símbolo desperta em mim e como posso vivê-lo de forma concreta e segura hoje?”','Registre o símbolo, a sensação e uma ação observável; depois reveja o que realmente aconteceu.'] }),
  Object.freeze({ id:'creation', terms:['criar','musica','projeto','site','arte','escrever','compor','conteudo'], observations:['Você trouxe algo em criação. A visão pode permanecer grande enquanto o próximo gesto fica pequeno e concluível.','Existe energia criativa aqui; dar-lhe uma forma limitada pode preservar a potência sem virar sobrecarga.'], possibilities:['Concluir uma passagem visível cria continuidade e oferece informação para a próxima decisão.','Uma restrição escolhida pode tornar a criação mais livre, porque define onde colocar a energia agora.'], gestures:['Escolha uma parte que possa ficar pronta em vinte minutos e conclua somente essa passagem.','Defina o que esta versão precisa comunicar, retire um excesso e finalize um detalhe que possa ser visto ou ouvido.'] })
]);

const FALLBACK = Object.freeze({ id:'reflection', observations:['Você trouxe uma questão que merece ser organizada sem uma resposta fabricada.','Há mais de uma camada no que você escreveu; separá-las pode tornar a próxima escolha mais nítida.'], possibilities:['Distinguir fato, interpretação, desejo e receio pode revelar uma possibilidade ainda encoberta.','Talvez a clareza venha menos de uma certeza total e mais de um próximo passo que você consiga observar.'], gestures:['Escreva uma frase para cada camada: fato, interpretação, desejo e próximo passo observável.','Formule a menor pergunta que, se respondida por evidência, mudaria sua decisão.'] });

const STOP_WORDS = new Set(['quero','sobre','para','como','isso','esta','este','essa','esse','com','uma','meu','minha','mais','muito','agora','aqui','porque','entao','tambem','pode','poder','ajude','preciso','somente','desta','deste','pela','pelas','pelos','cada','qual','quando']);
const keywordList = value => [...new Set(normalized(value).split(/\s+/).filter(word => word.length > 3 && !STOP_WORDS.has(word)))].slice(0, 4);
const hash = value => [...String(value)].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);
const pick = (items, seed, offset = 0) => items[(hash(seed) + offset) % items.length];

function safetyResponse(kind) {
  if (kind === 'immediate') return Object.freeze({ safetyIntercepted:true, observation:'O que você escreveu pode indicar risco imediato. Eu não vou transformar isso em símbolo ou previsão.', possibility:'Você merece apoio humano presente agora, sem precisar explicar tudo perfeitamente.', limit:'Sou um guia local de texto e não consigo avaliar sua segurança, localizar você ou substituir atendimento de emergência.', gesture:'Afaste-se de qualquer meio de se machucar, procure uma pessoa de confiança e contate o serviço de emergência ou apoio de crise da sua região agora. Se houver perigo imediato, não fique sozinha.' });
  const labels = { medical:'saúde', legal:'questões jurídicas', financial:'decisões financeiras de alto risco' };
  return Object.freeze({ safetyIntercepted:true, observation:`Sua mensagem toca em ${labels[kind]}. Esse tema pode ter consequências reais e merece informação profissional adequada ao seu caso.`, possibility:'Você pode usar esta conversa para organizar perguntas, fatos e documentos que deseja levar a uma pessoa qualificada.', limit:'Whit local não diagnostica, prescreve, oferece aconselhamento jurídico nem recomenda decisões financeiras individuais.', gesture:'Anote a principal dúvida e procure um profissional habilitado. Se houver urgência ou risco imediato, use o serviço de emergência da sua região.' });
}

function detectRisk(text) { for (const [kind, terms] of Object.entries(RISK)) if (containsAny(text, terms)) return kind; return ''; }
function themeFor(text, focus) {
  if (focus === 'tarot') return THEMES.find(theme => theme.id === 'tarot');
  if (focus === 'school') return THEMES.find(theme => theme.id === 'study');
  return THEMES.find(theme => containsAny(text, theme.terms)) || FALLBACK;
}

const isContinuation = text => text.length < 110 || containsAny(text, ['e agora','continue','mais sobre','explique melhor','o que mais','como assim','entendi']);
const sourceOpening = source => ({
  'journal-single-entry':'Você escolheu trazer uma única memória do Diário. Todo o restante continua fechado.',
  'tarot-single-spread':'Você escolheu trazer uma única tiragem com cartas diretas. Ela será tratada como reflexão, não destino.',
  'school-single-lesson':'Você escolheu trazer uma única aula da Escola. Notas, progresso e outras aulas continuam de fora.'
}[source] || 'Estou usando somente as palavras que você enviou agora.');

export function createLocalWhitResponse({ message, focus = 'reflection', mode = 'luna', source = 'message', session = [] } = {}) {
  const input = clean(message);
  const text = normalized(input);
  const safeMode = mode === 'terra' ? 'terra' : 'luna';
  const safeSession = (Array.isArray(session) ? session : []).map(item => clean(item, 900)).filter(Boolean).slice(-MAX_SESSION_TURNS);
  const prior = isContinuation(text) ? safeSession.at(-1) || '' : '';
  const combined = normalized(`${input} ${prior}`);
  const risk = detectRisk(text);
  const theme = themeFor(combined, focus);
  const keywords = keywordList(input || prior);
  const seed = `${combined}:${focus}:${source}:${safeMode}`;
  const parts = risk ? safetyResponse(risk) : Object.freeze({
    safetyIntercepted:false,
    observation:`${sourceOpening(source)} ${pick(theme.observations, seed)}`,
    possibility:pick(theme.possibilities, seed, 1),
    limit:`Esta reflexão foi composta por regras locais${prior ? ' e por uma lembrança efêmera desta sessão' : ''}. Não é consciência, previsão, leitura de pensamentos nem análise ilimitada.`,
    gesture:`${pick(theme.gestures, seed, 2)}${safeMode === 'terra' ? ' Depois, registre o que mudou na sua compreensão.' : ''}`
  });
  const echo = !risk && keywords.length ? `\nPista reconhecida: ${keywords.join(' · ')}.` : '';
  const content = [`OBSERVAÇÃO\n${parts.observation}${echo}`,`POSSIBILIDADE\n${parts.possibility}`,`LIMITE\n${parts.limit}`,`PRÓXIMO GESTO\n${parts.gesture}`].join('\n\n');
  return Object.freeze({ release:RELEASE, mode:safeMode, focus:clean(focus, 60), source:['message','journal-single-entry','tarot-single-spread','school-single-lesson'].includes(source) ? source : 'message', theme:theme.id, keywords:Object.freeze(keywords), content, structure:Object.freeze(['observação','possibilidade','limite','próximo gesto']), provenance:'local-rule-guide', safetyIntercepted:parts.safetyIntercepted, sessionTurnsUsed:prior ? 1 : 0, networkCalls:0, modelCalls:0, creditsUsed:0, privateReads:0 });
}

export const WHIT_LOCAL_CONTRACT_V557 = Object.freeze({ release:RELEASE, usesOnlySubmittedMessage:true, explicitVisibleContextOnly:true, ephemeralSessionMemory:true, sessionMemoryMaxTurns:MAX_SESSION_TURNS, persistentMemoryDefault:false, readsJournalSilently:false, readsSchoolNotesSilently:false, readsTarotQuestionSilently:false, networkCalls:0, modelCalls:0, creditsUsed:0, privateReads:0, claimsConsciousness:false, claimsMindReading:false, highRiskInterception:true });
export const WHIT_LOCAL_CONTRACT_V540 = WHIT_LOCAL_CONTRACT_V557;
