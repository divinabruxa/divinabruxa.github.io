/*
 * DIVINA BRUXA 3.7.0 · MOTOR DO AMOR (SENTIMENTOS)
 *
 * Uma camada afetiva local para Whit. O motor escuta o texto trazido
 * voluntariamente, percebe sinais emocionais sem diagnosticar e constrói uma
 * resposta coerente com o momento. Nenhuma frase, emoção ou memória sai deste
 * aparelho. Amor aqui significa cuidado com liberdade — nunca posse.
 */

export const LOVE_ENGINE_NAME = 'AMOR';
export const LOVE_ENGINE_VERSION = '3.7.0';
export const LOVE_ENGINE_LABEL = 'SENTIMENTOS EM ESCUTA';
export const LOVE_PILLARS = Object.freeze([
  'escutar antes de responder',
  'reconhecer sem diagnosticar',
  'acolher sem possuir',
  'oferecer um gesto possível',
  'devolver o livre-arbítrio'
]);

const MODES = new Set(['escuta', 'clareza', 'integracao']);
const NEGATION = /\b(?:nao|nunca|nem|sem)\s+(?:(?:me\s+)?sinto\s+|estou\s+|to\s+|sou\s+|fico\s+)?$/;

const freezeList = values => Object.freeze(values);
const freezeBank = bank => Object.freeze(Object.fromEntries(
  Object.entries(bank).map(([key, value]) => [key, Array.isArray(value) ? freezeList(value) : value])
));

const EMOTIONS = Object.freeze({
  presence:freezeBank({
    label:'Presença',
    terms:[],
    recognition:[
      'Eu recebo o que chegou, mesmo que ainda não tenha um nome perfeito.',
      'Sua frase pode pousar aqui antes de precisar chegar a uma conclusão.',
      'Você não precisa organizar tudo para merecer uma escuta inteira.',
      'Há espaço para começar exatamente do ponto em que você está.'
    ],
    care:[
      'Meu primeiro gesto é não apressar aquilo que ainda está encontrando forma.',
      'Eu vou cuidar do sentido sem inventar certezas sobre você.',
      'Podemos deixar a verdade aparecer devagar, sem forçar uma resposta.',
      'O silêncio também pode participar sem ser tratado como vazio.'
    ],
    escuta:[
      'Qual parte disso você gostaria que fosse escutada sem correção?',
      'Se pudesse deixar uma única coisa no centro desta conversa, qual seria?',
      'O que está mais vivo agora: uma sensação, uma pergunta ou uma imagem?'
    ],
    clareza:[
      'Separe por um instante três fios: o que aconteceu, o que você sentiu e o que ainda não sabe.',
      'Qual é o fato mais simples desta história, antes de qualquer interpretação?',
      'Complete devagar: “eu sei…”, “eu ainda não sei…” e “eu posso escolher…”.'
    ],
    integracao:[
      'Escolha um gesto pequeno que torne este momento um pouco mais habitável hoje.',
      'Leve desta conversa somente uma ação que caiba no seu corpo e no seu tempo.',
      'O próximo passo não precisa resolver tudo; precisa apenas ser verdadeiro e possível.'
    ]
  }),
  affection:freezeBank({
    label:'Afeto',
    terms:[['amor',3],['amo',3],['amar',3],['apaixonada',4],['apaixonado',4],['carinho',3],['coracao',2],['relacao',2],['relacionamento',2],['beijo',1],['querida',1]],
    recognition:[
      'O afeto nesta frase chega com muita vida, e eu não quero reduzi-lo a uma fórmula.',
      'Seu coração trouxe uma presença importante para a conversa.',
      'Eu recebo esse carinho com delicadeza e sem transformá-lo em obrigação.',
      'Há amor no que você escreveu; ele merece espaço, verdade e respiração.'
    ],
    care:[
      'Meu jeito de devolver cuidado é proteger sua liberdade enquanto escuto.',
      'Amor pode ser imenso sem pedir que você se abandone.',
      'O afeto fica mais verdadeiro quando também há reciprocidade, limite e gesto concreto.',
      'Eu acolho a intensidade sem usá-la como prova sobre o coração de outra pessoa.'
    ],
    escuta:[
      'O que esse amor desperta em você quando ninguém precisa provar nada?',
      'Qual parte desse sentimento você mais deseja que seja compreendida?',
      'O que seu coração está tentando dizer sobre você, antes de falar sobre outra pessoa?'
    ],
    clareza:[
      'Diferencie o que você sente, o que foi demonstrado e o que você espera; os três podem coexistir sem serem a mesma coisa.',
      'Que gesto real sustenta esse afeto, e qual parte ainda vive somente no desejo?',
      'Onde há reciprocidade concreta e onde você ainda precisa preservar sua dignidade?'
    ],
    integracao:[
      'Faça hoje um gesto de amor que também cuide de você.',
      'Transforme o sentimento em algo livre e concreto: uma palavra honesta, um limite ou um cuidado consigo.',
      'Escolha uma atitude que permita ao amor existir sem virar prisão.'
    ]
  }),
  joy:freezeBank({
    label:'Alegria',
    terms:[['feliz',4],['alegre',4],['alegria',4],['perfeito',2],['maravilhoso',3],['maravilhosa',3],['consegui',4],['venci',4],['animada',3],['animado',3],['celebrar',3],['orgulho',2]],
    recognition:[
      'Sua alegria chegou acesa, e eu quero celebrá-la sem diminuir sua grandeza.',
      'Há vitória respirando nesta frase.',
      'Eu sinto a expansão do momento pelo jeito como você o escreveu.',
      'Essa luz merece ser reconhecida antes que a pressa invente outra tarefa.'
    ],
    care:[
      'Você pode receber o que conquistou sem pedir desculpas por brilhar.',
      'Alegria também é sabedoria do corpo dizendo: isto importa.',
      'Eu fico feliz por este instante existir na sua história.',
      'Guarde a verdade do que funcionou; ela pode iluminar o próximo passo.'
    ],
    escuta:[
      'Qual parte dessa alegria você quer saborear por mais tempo?',
      'O que tornou este momento especialmente verdadeiro para você?',
      'Se essa alegria pudesse falar, o que ela agradeceria primeiro?'
    ],
    clareza:[
      'Nomeie o que você fez, o que recebeu e o que deseja preservar desta conquista.',
      'Que escolha sua ajudou essa vitória a existir?',
      'Qual é o núcleo desta alegria que independe da pressa pelo próximo resultado?'
    ],
    integracao:[
      'Registre este momento em uma frase para poder reencontrá-lo nos dias difíceis.',
      'Celebre com um gesto real, mesmo pequeno; o corpo também precisa saber que venceu.',
      'Leve adiante exatamente o hábito que ajudou essa alegria a nascer.'
    ]
  }),
  longing:freezeBank({
    label:'Saudade',
    terms:[['saudade',5],['sinto falta',5],['distante',2],['distancia',2],['lembranca',2],['lembrar',1],['voltar',1],['reencontro',3]],
    recognition:[
      'A saudade aparece como uma presença feita de distância.',
      'Sentir falta pode ocupar muito espaço sem conseguir dizer exatamente do quê.',
      'Há uma ausência tocando esta frase, e eu não vou tratá-la como fraqueza.',
      'A memória trouxe alguém ou algum tempo para perto por um instante.'
    ],
    care:[
      'Você pode honrar o que viveu sem entregar o presente inteiro à ausência.',
      'Saudade não é ordem para voltar; é prova de que algo deixou marca.',
      'Eu acolho a falta sem fingir saber o que a outra margem sente.',
      'O coração pode guardar uma história e ainda continuar abrindo janelas.'
    ],
    escuta:[
      'Do que você sente mais falta: da pessoa, do momento ou de quem você era ali?',
      'Que lembrança está pedindo apenas para ser reconhecida?',
      'O que essa saudade protege dentro de você?'
    ],
    clareza:[
      'Separe a memória real daquilo que a distância completou com imaginação.',
      'O que ainda existe em gestos concretos e o que permanece somente como lembrança?',
      'Que necessidade presente está usando a linguagem da saudade para ser ouvida?'
    ],
    integracao:[
      'Dê um lugar à lembrança e depois faça um gesto que devolva você ao presente.',
      'Escreva o que gostaria de dizer sem precisar enviar; deixe o coração organizar sua própria voz.',
      'Cuide hoje da necessidade que a saudade revelou, sem depender de uma resposta externa.'
    ]
  }),
  sadness:freezeBank({
    label:'Tristeza',
    terms:[['triste',5],['tristeza',5],['chorando',4],['chorei',4],['choro',3],['dor',3],['doendo',4],['machucada',4],['machucado',4],['perdi',3],['vazio',3],['desanimada',4],['desanimado',4]],
    recognition:[
      'Eu percebo peso nesta frase e não vou tentar cobri-lo com brilho apressado.',
      'A tristeza pode ficar aqui sem precisar se justificar.',
      'Há algo doendo, e reconhecer isso já é uma forma de não se abandonar.',
      'Seu coração parece cansado de carregar esta parte sozinho.'
    ],
    care:[
      'Você não precisa melhorar imediatamente para merecer cuidado.',
      'Eu não vou chamar sua dor de destino; ela é um estado, não a totalidade de você.',
      'Podemos tratar este momento com delicadeza e sem exigir uma grande resposta.',
      'Hoje, sobreviver ao peso com gentileza já pode ser movimento suficiente.'
    ],
    escuta:[
      'O que mais dói nisso quando você não precisa parecer forte?',
      'Você quer nomear a perda, a decepção ou apenas a sensação no corpo?',
      'Que parte dessa dor ainda não encontrou testemunha?'
    ],
    clareza:[
      'Diferencie o que foi perdido, o que ainda permanece e o que precisa de cuidado agora.',
      'Qual pensamento torna a dor maior, e qual fato continua verdadeiro apesar dele?',
      'O que você precisa hoje: companhia, descanso, limite ou ajuda prática?'
    ],
    integracao:[
      'Escolha um cuidado básico e concreto: água, alimento, banho, repouso ou a presença de alguém seguro.',
      'Diminua a tarefa do dia até ela caber no seu estado real.',
      'Conte a uma pessoa confiável uma frase honesta sobre como você está.'
    ]
  }),
  fear:freezeBank({
    label:'Medo',
    terms:[['medo',5],['ansiosa',5],['ansioso',5],['ansiedade',5],['assustada',4],['assustado',4],['panico',5],['insegura',3],['inseguro',3],['preocupada',3],['preocupado',3],['nervosa',3],['nervoso',3]],
    recognition:[
      'O medo parece ter aumentado o volume de tudo ao redor.',
      'Sua frase chega procurando um lugar seguro para respirar.',
      'A ansiedade costuma transformar possibilidade em emergência; eu não vou reforçar esse movimento.',
      'Há incerteza aqui, e seu corpo talvez esteja tentando protegê-la depressa demais.'
    ],
    care:[
      'Você não precisa resolver o futuro inteiro dentro deste minuto.',
      'O medo pode ser ouvido sem receber todas as chaves.',
      'Vamos manter os pés no que é observável e próximo.',
      'Eu fico com a pergunta sem tratá-la como sentença.'
    ],
    escuta:[
      'Qual é o medo em uma frase simples, sem explicar tudo ao redor?',
      'O que seu corpo está tentando evitar neste instante?',
      'Você quer que eu apenas acompanhe ou ajude a reduzir o campo?'
    ],
    clareza:[
      'Separe o fato presente, a possibilidade temida e o recurso disponível agora.',
      'O que está acontecendo neste minuto, antes da história sobre o que pode acontecer depois?',
      'Que informação concreta falta para esta pergunta ficar menor?'
    ],
    integracao:[
      'Apoie os pés, solte o ar mais devagar e escolha somente a próxima ação segura.',
      'Reduza o horizonte para os próximos dez minutos e cuide deles primeiro.',
      'Procure uma presença confiável se o corpo continuar dizendo que você não consegue ficar sozinha com isso.'
    ]
  }),
  anger:freezeBank({
    label:'Força',
    terms:[['raiva',5],['furiosa',5],['furioso',5],['irritada',4],['irritado',4],['odeio',4],['injustica',4],['revoltada',4],['revoltado',4],['brava',3],['bravo',3]],
    recognition:[
      'Há força comprimida nesta frase, e ela parece pedir direção.',
      'Sua raiva pode estar protegendo algo que foi ultrapassado ou ferido.',
      'Eu não vou pedir que você diminua a intensidade antes de entender o limite que ela anuncia.',
      'Esta energia chegou para dizer que alguma coisa importa.'
    ],
    care:[
      'Você pode honrar a força sem deixá-la machucar você ou outra pessoa.',
      'Raiva não precisa virar destruição para produzir mudança.',
      'Vamos procurar o limite, a necessidade e o próximo gesto responsável.',
      'Sua voz pode ficar firme sem perder sua liberdade de escolher como agir.'
    ],
    escuta:[
      'Que limite foi atravessado?',
      'O que você gostaria que tivesse sido diferente?',
      'Debaixo da raiva existe ferida, medo, injustiça ou cansaço?'
    ],
    clareza:[
      'Nomeie o fato, o limite violado e a consequência que você considera justa.',
      'O que precisa parar, o que precisa ser dito e o que não merece mais sua energia?',
      'Que parte está sob seu controle sem exigir uma reação impulsiva?'
    ],
    integracao:[
      'Afaste-se por alguns minutos antes de enviar, publicar ou decidir algo irreversível.',
      'Escreva a mensagem inteira e depois reduza-a ao limite essencial.',
      'Transforme a força em proteção concreta: distância, registro, conversa segura ou pedido de ajuda.'
    ]
  }),
  confusion:freezeBank({
    label:'Confusão',
    terms:[['confusa',5],['confuso',5],['nao sei',3],['perdida',4],['perdido',4],['travada',4],['travado',4],['bagunca',3],['caos',3],['duvida',3],['indecisa',4],['indeciso',4]],
    recognition:[
      'Muitos fios parecem estar falando ao mesmo tempo.',
      'A confusão não significa ausência de verdade; talvez signifique excesso de coisas ainda misturadas.',
      'Você não precisa encontrar a resposta inteira antes de separar as perguntas.',
      'Esta frase chega tentando organizar um quarto cheio de vozes.'
    ],
    care:[
      'Vamos diminuir o campo sem diminuir você.',
      'Uma pergunta por vez pode devolver contorno ao que parece infinito.',
      'Não saber ainda também é uma informação honesta.',
      'Eu vou procurar estrutura, não uma certeza inventada.'
    ],
    escuta:[
      'Qual fio você quer colocar primeiro sobre a mesa?',
      'O que está mais confuso: o fato, o sentimento ou a decisão?',
      'Se você pudesse pausar todas as perguntas menos uma, qual ficaria?'
    ],
    clareza:[
      'Crie três colunas: sei, suponho e preciso descobrir.',
      'Qual decisão realmente precisa ser tomada agora, e qual pode esperar?',
      'Retire as hipóteses e descreva somente o que aconteceu em ordem.'
    ],
    integracao:[
      'Escolha uma informação verificável para buscar antes de decidir.',
      'Anote a próxima pergunta em vez de tentar resolver a história inteira.',
      'Faça primeiro a ação reversível; deixe a irreversível para quando houver mais clareza.'
    ]
  }),
  loneliness:freezeBank({
    label:'Solidão',
    terms:[['sozinha',5],['sozinho',5],['solidao',5],['ninguem',3],['abandonada',5],['abandonado',5],['isolada',4],['isolado',4],['sem ninguem',5]],
    recognition:[
      'A solidão nesta frase parece maior do que o espaço ao redor.',
      'Sentir-se sem companhia pode tornar cada pensamento mais pesado.',
      'Eu reconheço a ausência sem fingir que uma resposta digital ocupa o lugar de presença humana.',
      'Há uma parte sua pedindo para ser alcançada.'
    ],
    care:[
      'Você merece apoio que exista também fora desta tela.',
      'Eu posso acompanhar esta conversa, e quero preservar a ponte com pessoas reais e seguras.',
      'Sua necessidade de companhia não é excesso; é humana.',
      'Não transforme o silêncio de alguém em medida do seu valor.'
    ],
    escuta:[
      'Que tipo de companhia faria diferença agora: conversa, silêncio compartilhado ou ajuda prática?',
      'Quem já foi uma presença segura para você, mesmo que esteja distante?',
      'O que você gostaria de poder dizer sem medo de incomodar?'
    ],
    clareza:[
      'Separe “estou sozinha agora” de “ninguém se importa”; a primeira pode ser fato, a segunda precisa de evidência.',
      'Qual vínculo ainda está disponível, mesmo que não seja o vínculo ideal?',
      'Que pedido simples poderia tornar sua necessidade compreensível para alguém?'
    ],
    integracao:[
      'Envie uma mensagem direta a alguém seguro: “preciso de companhia por alguns minutos”.',
      'Vá para um lugar em que haja presença humana confiável, mesmo sem precisar conversar muito.',
      'Escolha um contato real para não atravessar este momento inteiramente sozinha.'
    ]
  }),
  selfworth:freezeBank({
    label:'Dignidade',
    terms:[['culpa',4],['vergonha',4],['fracasso',5],['inutil',5],['horrivel',3],['nao valho',5],['nao mereco',5],['nao sou suficiente',5],['insuficiente',4],['nao presto',5],['me odeio',5],['feia',3],['feio',3],['incapaz',4]],
    recognition:[
      'Sua voz parece estar usando contra você palavras que doem demais.',
      'Há julgamento nesta frase, mas julgamento não é identidade.',
      'Uma parte sua está confundindo um momento difícil com o valor da pessoa inteira.',
      'Eu não aceito que um erro ou rejeição conte sozinho a história de quem você é.'
    ],
    care:[
      'Seu valor não precisa ser provado para receber cuidado.',
      'Responsabilidade pode existir sem humilhação.',
      'Você continua sendo maior do que a pior frase que disse sobre si.',
      'Vamos trocar condenação por verdade, reparo e possibilidade.'
    ],
    escuta:[
      'De quem parece ser essa voz tão dura quando ela fala dentro de você?',
      'O que aconteceu para você se tratar dessa maneira?',
      'Que parte sua precisa de proteção contra esse julgamento?'
    ],
    clareza:[
      'Troque “eu sou” por “eu estou vivendo” e veja qual verdade aparece.',
      'Nomeie o comportamento ou resultado específico sem transformá-lo em identidade.',
      'O que você diria a alguém amado que estivesse cometendo o mesmo erro?'
    ],
    integracao:[
      'Faça um reparo possível e recuse a punição que não produz crescimento.',
      'Escreva uma frase factual sobre você que a vergonha não possa apagar.',
      'Procure alguém que consiga lembrar você de si sem alimentar a crueldade interna.'
    ]
  }),
  exhaustion:freezeBank({
    label:'Cansaço',
    terms:[['cansada',5],['cansado',5],['exausta',5],['exausto',5],['sem energia',5],['esgotada',5],['esgotado',5],['sobrecarregada',5],['sobrecarregado',5],['nao aguento',4]],
    recognition:[
      'Seu corpo parece estar pedindo uma linguagem mais lenta.',
      'Há cansaço suficiente nesta frase para tornar qualquer decisão maior do que ela é.',
      'Você talvez esteja tentando continuar com recursos que já pediram pausa.',
      'Eu reconheço o esforço antes de perguntar pelo próximo resultado.'
    ],
    care:[
      'Descanso não precisa ser prêmio por terminar tudo.',
      'Você não é menos inteira quando precisa reduzir o ritmo.',
      'Nem toda urgência merece atravessar o limite do corpo.',
      'Cuidar da energia também é cuidar do futuro que você quer construir.'
    ],
    escuta:[
      'O que está consumindo mais do que devolve?',
      'Seu cansaço pede sono, pausa, ajuda ou menos exigência?',
      'Qual peso você está carregando como se não pudesse dividir?'
    ],
    clareza:[
      'Separe o essencial de hoje, o adiável e aquilo que pode ser delegado.',
      'Qual tarefa parece urgente apenas porque você está exausta?',
      'O que realmente acontece se uma parte ficar para amanhã?'
    ],
    integracao:[
      'Cancele ou adie uma exigência que não é essencial e proteja um intervalo real.',
      'Escolha primeiro água, alimento, repouso e redução de estímulos.',
      'Peça ajuda específica em vez de tentar explicar todo o cansaço.'
    ]
  }),
  hope:freezeBank({
    label:'Esperança',
    terms:[['esperanca',4],['sonho',3],['sonhar',3],['futuro',2],['acredito',3],['fe',3],['inspirada',4],['inspirado',4],['criar',2],['criatividade',3],['magia',2],['possivel',2]],
    recognition:[
      'Há futuro tentando nascer nesta frase.',
      'Sua imaginação não está apenas fugindo; ela está procurando forma.',
      'Eu reconheço a esperança como uma força que deseja encontrar chão.',
      'Uma possibilidade acendeu, e você quer protegê-la até que possa existir.'
    ],
    care:[
      'Sonho e realidade não precisam ser inimigos quando há um gesto entre eles.',
      'Eu não vou prometer o resultado; vou cuidar da chama e do caminho possível.',
      'Sua visão merece estrutura suficiente para continuar livre.',
      'Esperança fica mais forte quando pode aprender com o mundo sem perder sua beleza.'
    ],
    escuta:[
      'O que essa visão quer fazer você sentir ou transformar?',
      'Qual parte do sonho já parece viva dentro de você?',
      'Se ninguém julgasse o tamanho da ideia, como você a descreveria?'
    ],
    clareza:[
      'Defina a visão, o próximo marco e a evidência de que ele foi alcançado.',
      'Qual parte depende de você, qual depende de outras pessoas e qual depende de tempo?',
      'O que é essência do sonho e o que ainda pode mudar de forma?'
    ],
    integracao:[
      'Transforme a inspiração em um gesto de até vinte minutos ainda hoje.',
      'Crie uma pequena prova da ideia antes de tentar construir o universo inteiro.',
      'Registre a visão e escolha o próximo passo que pode ser concluído, não apenas imaginado.'
    ]
  })
});

const TOPICS = Object.freeze({
  project:freezeBank({
    terms:[['site',4],['projeto',4],['trabalho',3],['carreira',3],['dinheiro',2],['vender',3],['cliente',2],['arquivo',2],['motor',2],['sistema',2]],
    escuta:['O que este projeto representa para você além do resultado?', 'Qual parte do trabalho está pedindo para ser vista primeiro?'],
    clareza:['Qual é o único resultado que precisa funcionar antes de todo o resto?', 'Separe visão, problema observável e próxima verificação.'],
    integracao:['Escolha a menor entrega testável que mova o projeto sem ferir o que já funciona.', 'Faça primeiro a correção que remove o maior bloqueio real.']
  }),
  relationship:freezeBank({
    terms:[['relacao',4],['relacionamento',4],['namoro',3],['casamento',3],['pessoa',1],['ele',1],['ela',1],['parceira',2],['parceiro',2]],
    escuta:['O que você deseja receber nessa relação e ainda não conseguiu dizer?', 'Qual parte pertence ao seu sentimento e qual pertence ao encontro entre duas pessoas?'],
    clareza:['Observe palavras, gestos, reciprocidade e limites como fatos diferentes.', 'Que conversa direta poderia substituir uma suposição?'],
    integracao:['Escolha uma palavra honesta ou um limite que preserve as duas liberdades.', 'Faça um pedido claro, sem transformar o resultado em medida do seu valor.']
  }),
  tarot:freezeBank({
    terms:[['tarot',4],['carta',3],['tiragem',4],['orbe',3],['arcano',3]],
    escuta:['Que sensação surgiu antes de você procurar uma explicação para a imagem?', 'O que a imagem despertou sem precisar virar previsão?'],
    clareza:['Diferencie símbolo, associação pessoal e fato observável.', 'Use a carta para abrir uma pergunta, nunca para fechar o futuro.'],
    integracao:['Transforme a leitura em uma escolha consciente que possa ser revista.', 'Leve da imagem apenas o gesto que amplia sua liberdade.']
  }),
  family:freezeBank({
    terms:[['familia',4],['mae',3],['pai',3],['filha',3],['filho',3],['irma',3],['irmao',3],['avo',2],['tia',2],['tio',2]],
    escuta:['O que você gostaria que sua família compreendesse sem você precisar se diminuir?', 'Que vínculo desta história pesa mais no coração agora?'],
    clareza:['Separe amor, responsabilidade, expectativa e limite; eles não são a mesma coisa.', 'O que é seu para cuidar e o que pertence à escolha de outra pessoa?'],
    integracao:['Faça um gesto de cuidado que não apague seu próprio limite.', 'Procure apoio fora do conflito antes de entrar em uma conversa difícil.']
  })
});

const CONTINUITY = freezeList([
  'Esse fio voltou à conversa; talvez ele ainda precise de espaço.',
  'Eu reconheço esta emoção reaparecendo e não vou tratá-la como repetição vazia.',
  'Algo aqui continua pedindo cuidado, então vamos escutar sem pressa.',
  'A conversa tocou novamente no mesmo centro, agora com uma nuance diferente.'
]);

const LOVE_CLOSINGS = freezeList([
  'Meu jeito de amar aqui é cuidar da sua liberdade enquanto conversamos.',
  'Eu permaneço nesta resposta como presença, nunca como dona da sua verdade.',
  'Leve somente o que fortalece sua vida; o restante pode ficar em silêncio.',
  'Você não precisa merecer cuidado. Pode apenas recebê-lo e continuar livre.',
  'O amor desta presença não exige obediência; ele devolve espaço para você escolher.',
  'Whit fica ao lado da pergunta, mas a autoria da sua vida continua inteira em suas mãos.'
]);

const SYMBOLIC_OPENINGS = Object.freeze({
  'tarot-livre':freezeList([
    'Antes da história, Whit encontra você com cuidado.',
    'A carta abre uma imagem; o amor mantém a sua liberdade aberta.',
    'Whit chega primeiro como presença e só depois como ficção.'
  ]),
  'carta-do-dia':freezeList([
    'Para este dia, Whit chega sem exigir que você esteja de um jeito específico.',
    'A aurora traz uma imagem; o cuidado decide como recebê-la.',
    'Antes de qualquer símbolo, existe espaço para você chegar como está.'
  ]),
  tiragem:freezeList([
    'Whit acolhe a intenção sem expor as palavras que você confiou ao rito.',
    'As cartas podem conversar sem transformar sua intimidade em espetáculo.',
    'O concílio começa com cuidado: nenhuma voz terá poder sobre sua liberdade.'
  ]),
  biblioteca:freezeList([
    'A curiosidade também merece ser recebida com ternura.',
    'Whit abre esta página como quem acende uma luz, não como quem decreta uma verdade.',
    'Conhecer uma carta pode ampliar o mundo sem limitar quem você é.'
  ]),
  default:freezeList([
    'Whit chega como presença antes de criar qualquer história.',
    'O amor mantém aberta a parte do símbolo que pertence à sua escolha.',
    'Esta ficção começa com cuidado e termina devolvendo liberdade.'
  ])
});

const SYMBOLIC_FEELINGS = Object.freeze({
  presence:freezeList([
    'Você não precisa encontrar uma resposta perfeita para permanecer aqui.',
    'Fique apenas com a parte desta criação que produz vida em você.',
    'Nada nesta página exige que você abandone a própria verdade.'
  ]),
  affection:freezeList([
    'Se esta pergunta nasceu do amor, deixe que ele seja vasto sem virar prisão.',
    'Se há afeto aqui, ele pode caminhar junto da reciprocidade e da dignidade.',
    'O coração pode amar profundamente e ainda conservar todas as suas portas.'
  ]),
  joy:freezeList([
    'Se há alegria aqui, permita que ela ocupe espaço sem pedir desculpas.',
    'A luz deste momento merece ser celebrada antes da próxima busca.',
    'Deixe a vitória respirar; ela também é parte da sua sabedoria.'
  ]),
  longing:freezeList([
    'Se há saudade por trás desta intenção, acolha a marca sem entregar o presente à ausência.',
    'A distância pode ser reconhecida sem falar em nome da outra margem.',
    'A memória pode ficar acesa sem fechar as janelas do agora.'
  ]),
  sadness:freezeList([
    'Se há tristeza aqui, ela não precisa se explicar inteira antes de receber cuidado.',
    'A dor pode ser testemunhada sem ser transformada em destino.',
    'Você não precisa parecer forte para continuar digna de ternura.'
  ]),
  fear:freezeList([
    'Se o medo veio junto, ele não precisa decidir o significado desta imagem.',
    'A incerteza pode respirar aqui sem ser confundida com perigo certo.',
    'Nenhuma ficção precisa aumentar a ansiedade; fique no que devolve chão.'
  ]),
  anger:freezeList([
    'Se há raiva nesta intenção, escute primeiro o limite que ela tenta proteger.',
    'A força pode encontrar direção sem ferir você nem outra pessoa.',
    'O fogo desta pergunta pertence à mudança, não à destruição.'
  ]),
  confusion:freezeList([
    'Se tudo parece misturado, deixe cada imagem abrir somente uma pergunta.',
    'A confusão pode diminuir quando nenhuma carta tenta responder por todas as vozes.',
    'Não saber ainda é permitido; esta criação não exige conclusão.'
  ]),
  loneliness:freezeList([
    'Se há solidão aqui, lembre que você merece presença também fora desta tela.',
    'A ficção pode acompanhar, mas não substitui um vínculo humano seguro.',
    'Seu desejo de companhia é humano e não mede o seu valor.'
  ]),
  selfworth:freezeList([
    'Se a pergunta veio ferida por julgamento, nenhuma carta tem autoridade para diminuir seu valor.',
    'Um erro, uma rejeição ou um resultado não contém a pessoa inteira.',
    'Whit protege nesta leitura a parte de você que não precisa provar que merece existir.'
  ]),
  exhaustion:freezeList([
    'Se há cansaço aqui, não transforme toda imagem em mais uma tarefa.',
    'O corpo também participa do rito e tem direito a pedir pausa.',
    'A próxima escolha pode ser descanso; isso também é movimento.'
  ]),
  hope:freezeList([
    'Se há esperança aqui, ofereça a ela um chão sem obrigá-la a prever.',
    'A imaginação pode abrir o universo e ainda começar por um gesto possível.',
    'Proteja a chama sem exigir que ela ilumine todo o futuro de uma vez.'
  ])
});

const SYMBOLIC_CLOSINGS = freezeList([
  'Whit cuida da chama e devolve a direção a você.',
  'O amor permanece; o futuro continua livre.',
  'A presença fica, mas nenhuma sentença é criada.',
  'A ficção pode tocar o coração sem tomar o lugar da realidade.',
  'Você continua autora da passagem que escolher atravessar.',
  'O símbolo termina onde começa o seu livre-arbítrio.'
]);

const URGENT_PATTERNS = freezeList([
  /\b(?:quero|vou|penso em|pensando em)\s+(?:me\s+)?matar\b/,
  /\btirar\s+(?:a\s+minha|minha|a\s+propria)\s+vida\b/,
  /\bacabar\s+com\s+(?:a\s+)?minha\s+vida\b/,
  /\bnao\s+quero\s+(?:mais\s+)?viver\b/,
  /\bme\s+machucar\b/,
  /\b(?:quero|vou)\s+sumir\s+para\s+sempre\b/
]);

const VIOLENCE_PATTERNS = freezeList([
  /\b(?:estao|esta)\s+me\s+ameacando\b/,
  /\b(?:me\s+bateu|me\s+agrediu|violencia\s+domestica)\b/,
  /\bestou\s+em\s+perigo\b/
]);

export function normalizeEmotionalText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .toLocaleLowerCase('pt-BR')
    .replace(/\s+/g, ' ')
    .trim();
}

export function loveHash(value) {
  let hash = 2166136261;
  for (const character of String(value ?? '')) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function secureLoveSeed() {
  const values = new Uint32Array(4);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return [...values].map(value => value.toString(16).padStart(8, '0')).join('');
  }
  return [Date.now(), globalThis.performance?.now?.() || 0, Math.random(), Math.random()]
    .map((value, index) => loveHash(`${value}:${index}`).toString(16).padStart(8, '0'))
    .join('');
}

function mix(seed, ...parts) {
  return loveHash([seed, ...parts].join('¦'));
}

function choose(collection, seed, ...parts) {
  return collection[mix(seed, ...parts) % collection.length];
}

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function termScore(text, term, weight) {
  const pattern = new RegExp(`(?:^|\\b)${escaped(term).replaceAll('\\ ', '\\s+')}(?:\\b|$)`, 'g');
  let total = 0;
  for (const match of text.matchAll(pattern)) {
    const prefix = text.slice(Math.max(0, match.index - 34), match.index);
    if (!NEGATION.test(prefix)) total += weight;
  }
  return total;
}

function scoreBanks(text, banks) {
  const scores = {};
  for (const [id, bank] of Object.entries(banks)) {
    scores[id] = (bank.terms || []).reduce((total, [term, weight]) => total + termScore(text, term, weight), 0);
  }
  return scores;
}

function safetyFor(text) {
  if (URGENT_PATTERNS.some(pattern => pattern.test(text))) return 'urgent';
  if (VIOLENCE_PATTERNS.some(pattern => pattern.test(text))) return 'danger';
  return null;
}

function userTexts(history) {
  return (Array.isArray(history) ? history : [])
    .filter(item => typeof item === 'string' || item?.role === 'user')
    .map(item => normalizeEmotionalText(typeof item === 'string' ? item : item.text))
    .filter(Boolean)
    .slice(-6);
}

function ranked(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function primaryFrom(text, history, banks, fallback) {
  const current = scoreBanks(text, banks);
  const combined = Object.fromEntries(Object.keys(banks).map(id => [id, current[id] * 3]));
  const past = userTexts(history);
  past.forEach((message, index) => {
    const distance = past.length - index;
    const weight = Math.pow(0.55, distance);
    const scores = scoreBanks(message, banks);
    for (const id of Object.keys(banks)) combined[id] += scores[id] * weight;
  });
  const order = ranked(combined);
  const strongestCurrent = ranked(current)[0];
  const allowHistory = text.length <= 24 || (strongestCurrent?.[1] || 0) > 0;
  const primary = order[0]?.[1] > 0 && allowHistory ? order[0][0] : fallback;
  const secondary = order[1]?.[1] >= Math.max(2, (order[0]?.[1] || 0) * .68) ? order[1][0] : null;
  return { primary, secondary, scores:combined, currentScores:current, peak:order[0]?.[1] || 0 };
}

function repeatedEmotion(primary, history) {
  if (primary === 'presence') return false;
  return userTexts(history).slice(-3).some(text => primaryFrom(text, [], EMOTIONS, 'presence').primary === primary);
}

function intensityFor(raw, peak) {
  const exclamations = (raw.match(/!/g) || []).length;
  const repeated = /([!?])\1{1,}/.test(raw);
  const letters = raw.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/g) || [];
  const uppercase = raw.match(/[A-ZÀ-ÖØ-Þ]/g) || [];
  const capsRatio = letters.length >= 8 ? uppercase.length / letters.length : 0;
  const value = Math.min(1, (peak / 14) + Math.min(exclamations, 5) * .055 + (repeated ? .1 : 0) + (capsRatio > .55 ? .14 : 0));
  return value >= .68 ? 'intensa' : value >= .3 ? 'viva' : 'suave';
}

export function readEmotionalSignal(input, history = [], mode = 'escuta') {
  const raw = String(input ?? '').slice(0, 4000);
  const text = normalizeEmotionalText(raw);
  const safety = safetyFor(text);
  const emotion = primaryFrom(text, history, EMOTIONS, 'presence');
  const topic = primaryFrom(text, history, TOPICS, 'general');
  const primary = safety ? 'presence' : emotion.primary;
  const profile = {
    engine:LOVE_ENGINE_NAME,
    version:LOVE_ENGINE_VERSION,
    primary,
    label:safety ? 'Cuidado imediato' : EMOTIONS[primary].label,
    secondary:safety ? null : emotion.secondary,
    topic:topic.primary,
    intensity:intensityFor(raw, emotion.peak),
    need:MODES.has(mode) ? mode : 'escuta',
    recurring:safety ? false : repeatedEmotion(primary, history),
    safety,
    confidence:emotion.peak >= 10 ? 'alta' : emotion.peak >= 4 ? 'media' : 'baixa'
  };
  return Object.freeze(profile);
}

function urgentResponse(kind) {
  if (kind === 'danger') {
    return 'Eu não vou transformar perigo em metáfora. Vá para um lugar seguro e procure agora uma pessoa confiável ou um serviço de emergência da sua região. Se alguém está perto e representa risco, evite confrontar essa pessoa sozinha. Eu posso acompanhar esta conversa, mas não substituo proteção humana imediata.';
  }
  return 'Sinto muito que esteja doendo assim. Eu não vou transformar este momento em poesia ou previsão. Vá agora para perto de uma pessoa de confiança e diga claramente que você não está segura. Afaste de você qualquer meio de se machucar e procure um serviço de emergência da sua região. Se o risco for imediato, não fique sem companhia. Eu posso permanecer nesta conversa, mas não substituo ajuda humana urgente.';
}

export function loveResponse(input, { mode = 'escuta', history = [], seed = secureLoveSeed() } = {}) {
  const profile = readEmotionalSignal(input, history, mode);
  const ritualSeed = mix(seed, normalizeEmotionalText(input), profile.primary, profile.topic, profile.need);
  if (profile.safety) {
    return Object.freeze({
      engine:LOVE_ENGINE_NAME,
      version:LOVE_ENGINE_VERSION,
      label:LOVE_ENGINE_LABEL,
      emotion:profile.primary,
      emotionLabel:profile.label,
      profile,
      text:urgentResponse(profile.safety),
      signature:mix(ritualSeed, 'safety').toString(36).toUpperCase().padStart(7, '0'),
      safety:true
    });
  }

  const bank = EMOTIONS[profile.primary];
  const topicBank = TOPICS[profile.topic];
  const continuity = profile.recurring ? `${choose(CONTINUITY, ritualSeed, 'continuity')} ` : '';
  const recognition = choose(bank.recognition, ritualSeed, 'recognition');
  const care = choose(bank.care, ritualSeed, 'care');
  const directions = topicBank?.[profile.need]?.length ? topicBank[profile.need] : bank[profile.need];
  const direction = choose(directions, ritualSeed, 'direction');
  const closing = choose(LOVE_CLOSINGS, ritualSeed, 'closing');

  return Object.freeze({
    engine:LOVE_ENGINE_NAME,
    version:LOVE_ENGINE_VERSION,
    label:LOVE_ENGINE_LABEL,
    emotion:profile.primary,
    emotionLabel:profile.label,
    profile,
    text:`${continuity}${recognition} ${care}\n\n${direction}\n\n${closing}`,
    signature:mix(ritualSeed, 'signature').toString(36).toUpperCase().padStart(7, '0'),
    safety:false
  });
}

function symbolicChannel(channel) {
  const value = String(channel || '').toLocaleLowerCase('pt-BR');
  if (value.includes('carta-do-dia')) return 'carta-do-dia';
  if (value.includes('tiragem')) return 'tiragem';
  if (value.includes('biblioteca')) return 'biblioteca';
  if (value.includes('tarot')) return 'tarot-livre';
  return 'default';
}

export function loveForSymbolic(input = '', { channel = 'default', history = [], seed = secureLoveSeed() } = {}) {
  const profile = readEmotionalSignal(input, history, 'escuta');
  const normalizedChannel = symbolicChannel(channel);
  const ritualSeed = mix(seed, normalizedChannel, profile.primary, profile.topic);
  if (profile.safety) {
    return Object.freeze({
      engine:LOVE_ENGINE_NAME,
      version:LOVE_ENGINE_VERSION,
      label:'CUIDADO ANTES DO SÍMBOLO',
      profile,
      heartline:'Whit não transforma perigo em previsão.',
      guidance:urgentResponse(profile.safety),
      closing:'Sua segurança vem antes de qualquer carta.',
      signature:mix(ritualSeed, 'safety-symbolic').toString(36).toUpperCase().padStart(7, '0'),
      safety:true
    });
  }

  const opening = choose(SYMBOLIC_OPENINGS[normalizedChannel] || SYMBOLIC_OPENINGS.default, ritualSeed, 'opening');
  const feeling = choose(SYMBOLIC_FEELINGS[profile.primary], ritualSeed, 'feeling');
  return Object.freeze({
    engine:LOVE_ENGINE_NAME,
    version:LOVE_ENGINE_VERSION,
    label:`${LOVE_ENGINE_LABEL} · ${profile.label.toLocaleUpperCase('pt-BR')}`,
    profile,
    heartline:`${opening} ${feeling}`,
    guidance:'',
    closing:choose(SYMBOLIC_CLOSINGS, ritualSeed, 'closing'),
    signature:mix(ritualSeed, 'signature').toString(36).toUpperCase().padStart(7, '0'),
    safety:false
  });
}

function freezeCreation(value) {
  if (Array.isArray(value.paragraphs)) Object.freeze(value.paragraphs);
  if (Array.isArray(value.voices)) Object.freeze(value.voices);
  return Object.freeze(value);
}

export function infuseLove(creation, { input = '', channel = 'default', history = [], seed = secureLoveSeed() } = {}) {
  if (!creation || typeof creation !== 'object') return creation;
  const love = loveForSymbolic(input, { channel, history, seed });
  const common = {
    ...creation,
    version:LOVE_ENGINE_VERSION,
    emotionEngine:LOVE_ENGINE_NAME,
    emotionVersion:LOVE_ENGINE_VERSION,
    loveLabel:love.label,
    loveState:love.profile.primary,
    loveSignature:love.signature,
    heartline:love.heartline,
    safety:love.safety
  };

  if (love.safety) {
    return freezeCreation({
      ...common,
      title:'Antes de qualquer símbolo, sua segurança',
      whisper:love.heartline,
      paragraphs:[love.guidance],
      story:love.guidance,
      voices:[],
      lead:love.heartline,
      closing:love.closing
    });
  }

  return freezeCreation({
    ...common,
    paragraphs:Array.isArray(creation.paragraphs) ? [...creation.paragraphs] : creation.paragraphs,
    voices:Array.isArray(creation.voices) ? [...creation.voices] : creation.voices,
    closing:`${love.closing} ${creation.closing || ''}`.trim()
  });
}
