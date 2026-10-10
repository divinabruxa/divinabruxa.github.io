/** Voz editorial de Whit: imagens declaradamente fictícias, sustentadas pela análise do Tarot. */
import { SYMBOLIC_NOTICE, WHIT_THEME_AXES } from './whit-alma-divina-base-v1.js';
import { whitHash } from './whit-alma-divina-utils-v1.js';
export const WHIT_VOICE_VERSION='1.1.0';
const lower=s=>s.charAt(0).toLocaleLowerCase('pt-BR')+s.slice(1);
const sentence=s=>/[.!?]$/.test(s)?s:s+'.';
const unique=list=>[...new Set(list.filter(Boolean))];
const joinNatural=list=>list.length<2?list.join(''):list.slice(0,-1).join(', ')+' e '+list.at(-1);
const pick=(list,seed,key)=>list[whitHash(seed+'|'+key)%list.length];
const MOTIFS={
  inicio:{place:'uma porta que acaba de se abrir',image:'a primeira luz ainda não mostra a estrada inteira',titles:['A porta antes do caminho','A primeira luz','Onde o começo respira']},
  vinculo:{place:'uma ponte entre duas margens',image:'uma ponte permite encontro porque nenhuma margem precisa desaparecer',titles:['Entre duas margens','O lugar do encontro','A ponte que pede presença']},
  cuidado:{place:'um jardim que volta a receber água',image:'o que é vivo não cresce por exigência; precisa de condições e continuidade',titles:['O jardim e suas margens','Aquilo que merece cuidado','A vida encontra espaço']},
  estrutura:{place:'uma casa cujo chão precisa ser observado',image:'uma casa pode abrigar sem fechar todas as janelas',titles:['A casa e o horizonte','O chão que sustenta','Onde a vida pode permanecer']},
  interior:{place:'um quarto silencioso com uma janela entreaberta',image:'o silêncio pode acolher uma pergunta antes que ela encontre palavras',titles:['A janela do silêncio','A luz que vem de dentro','O que amadurece sem ruído']},
  sentido:{place:'uma trilha onde antigas marcas encontram novos passos',image:'uma marca antiga pode orientar, mas não precisa escolher o destino por quem caminha',titles:['A trilha e o sentido','O nome do caminho','O que vale levar adiante']},
  movimento:{place:'uma travessia entre o conhecido e uma paisagem diferente',image:'atravessar não exige esquecer de onde se veio, mas pede olhar para onde se pisa',titles:['A travessia e o ritmo','O horizonte em movimento','O próximo trecho do caminho']},
  mudanca:{place:'uma estação entre partidas e chegadas',image:'o intervalo também faz parte da viagem; nem toda espera é permanência',titles:['Entre partida e chegada','O intervalo da mudança','Outra forma de seguir']},
  verdade:{place:'uma sala em que a luz revela contornos antes confusos',image:'a claridade ajuda a distinguir sem exigir que tudo seja resolvido de uma vez',titles:['O contorno da verdade','Quando a luz muda o olhar','A palavra que encontra medida']},
  decisao:{place:'uma encruzilhada que pede um critério',image:'os caminhos não precisam prometer tudo para que um deles faça sentido',titles:['O critério da passagem','Diante dos caminhos','A escolha que pede presença']},
  pausa:{place:'um intervalo à sombra depois de uma caminhada',image:'descansar pode devolver discernimento, sem transformar a pausa em abandono',titles:['O intervalo necessário','O tempo de recompor','Antes do próximo gesto']},
  fim:{place:'um limiar entre uma sala que se fecha e outra ainda sem nome',image:'o que termina pode deixar memória sem continuar comandando a passagem',titles:['O limiar e a memória','Depois da última porta','O que pode seguir de outro modo']},
  equilibrio:{place:'um encontro de águas que aprendem outro ritmo',image:'ajuste não significa apagar diferenças; significa permitir que elas convivam sem se destruir',titles:['A medida entre as águas','Um ritmo para as diferenças','A delicadeza do ajuste']},
  apego:{place:'um nó que precisa ser visto antes de ser desfeito',image:'apertar mais o nó nem sempre protege aquilo que se teme perder',titles:['O nó e a margem','O preço de segurar','A mão que pode afrouxar']},
  ruptura:{place:'uma construção cuja rachadura finalmente se torna visível',image:'reconhecer uma rachadura permite cuidar da estrutura antes de chamar o desgaste de segurança',titles:['A rachadura e a luz','Depois que a forma cede','O essencial entre os escombros']},
  esperanca:{place:'um jardim depois de uma noite longa',image:'uma luz pequena não apaga a noite; oferece um lugar por onde recomeçar',titles:['A luz que permanece','O jardim depois da noite','Uma esperança com raízes']},
  incerteza:{place:'uma paisagem em que a névoa ainda cobre parte do caminho',image:'a névoa modifica a visão, mas não transforma uma impressão em prova',titles:['O caminho na névoa','Entre imagem e certeza','O que pede um olhar mais atento']},
  alegria:{place:'um pátio onde a luz permite compartilhar uma conquista',image:'a alegria pode ser recebida sem exigir que a vida inteira esteja resolvida',titles:['O pátio da luz','A alegria que cabe no presente','O que pode ser celebrado']},
  renovacao:{place:'uma passagem que devolve uma pergunta antiga com outro tom',image:'responder de outro modo pode ser mais importante que repetir uma resposta perfeita',titles:['Outra resposta ao chamado','A passagem revista','O que retorna para mudar']},
  conclusao:{place:'um círculo que reúne marcas de uma travessia',image:'concluir não apaga a viagem; permite escolher o que levar ao próximo ciclo',titles:['O círculo e o horizonte','O que a travessia deixou','A inteireza de uma etapa']},
  perda:{place:'uma margem onde algo se foi e algo ainda oferece apoio',image:'uma ausência merece espaço sem ocupar, sozinha, toda a paisagem',titles:['A margem que permanece','O que fica depois da perda','Dar lugar à ausência']},
  memoria:{place:'um jardim conhecido que já não é exatamente o mesmo',image:'uma lembrança pode trazer ternura sem se tornar um contrato com o presente',titles:['O jardim da memória','O afeto que atravessa o tempo','A visita que não exige retorno']},
  desejo:{place:'uma mesa diante daquilo que se deseja receber',image:'um desejo pode ser reconhecido sem receber o poder de decidir tudo',titles:['O lugar do desejo','Aquilo que se quer receber','Desejo e medida']},
  dor:{place:'um espaço onde uma ferida pode ser reconhecida sem ser reaberta',image:'dar nome à dor não obriga a repetir a cena que a sustenta',titles:['A ferida e a palavra','O que pode ser elaborado','Um lugar para o que dói']},
  conflito:{place:'um campo onde forças diferentes procuram espaço',image:'uma diferença pode ser escutada antes de virar uma batalha para provar valor',titles:['As forças e o encontro','Além da disputa','O preço de ter razão']},
  limite:{place:'uma margem que protege o que está vivo',image:'um limite pode criar espaço para respirar, sem se tornar uma muralha contra todo encontro',titles:['A margem necessária','O espaço que protege','Onde a presença encontra limite']},
  recursos:{place:'um chão que pede atenção ao que pode ser plantado',image:'uma semente precisa de condições; promessa de colheita não substitui o cultivo',titles:['A semente e o chão','O cuidado com o possível','Aquilo que pode sustentar']},
  crescimento:{place:'uma construção que aprende com cada ajuste',image:'crescer inclui rever o método, não apenas repetir esforço',titles:['O que amadurece','A construção e seus ajustes','Crescer com atenção']},
  sobrecarga:{place:'uma passagem estreitada pelo peso de muitas tarefas',image:'redistribuir peso pode devolver movimento sem apagar o valor do que já foi feito',titles:['O peso e as outras mãos','Uma passagem mais leve','O que não precisa ser carregado só']},
  estrategia:{place:'um caminho indireto que pede clareza sobre seus motivos',image:'discrição pode proteger um processo; omissão também pode afastá-lo da responsabilidade',titles:['O caminho e seus motivos','A medida da discrição','Aquilo que precisa ser esclarecido']},
  preocupacao:{place:'uma noite em que pensamentos insistem em ocupar o horizonte',image:'uma imagem repetida na mente não ganha, por repetição, o estatuto de acontecimento',titles:['A noite e o pensamento','Uma companhia para a inquietação','Quando o receio ocupa o olhar']},
  acao:{place:'um lugar onde uma intenção procura forma',image:'o impulso ganha sentido quando encontra um gesto que pode ser sustentado',titles:['A intenção encontra mãos','O primeiro gesto possível','Entre vontade e construção']},
  clareza:{place:'uma paisagem que começa a ganhar contornos nítidos',image:'ver melhor permite escolher com mais cuidado, sem prometer controle sobre tudo',titles:['A paisagem mais nítida','Quando a clareza chega','O que já pode ser nomeado']}
};
const TOPICS={
  love:{label:'os vínculos',bridge:'Se essa imagem tocar sua vida afetiva, procure reciprocidade entre sentimento, disponibilidade e atitude. Uma relação não se sustenta apenas na intensidade de uma pessoa; precisa de espaço para duas presenças e para a verdade de ambas.',question:'Que atitude mostra reciprocidade, e que parte desta história existe apenas na sua expectativa?',mind:'Nos vínculos, o desejo de receber uma resposta pode transformar um silêncio em muitas explicações. Antes de escolher uma delas, considere o que foi dito, o que foi feito e o que ainda permanece desconhecido.'},
  work:{label:'o trabalho e a construção',bridge:'No trabalho, essa passagem convida a aproximar vontade, capacidade e condições de realização. Um projeto precisa de acordos tão claros quanto sua intenção. Vale observar onde um esforço amadurece e onde apenas se repete sem produzir aprendizado.',question:'Qual ajuste tornaria seu próximo passo mais viável, em vez de apenas mais urgente?',mind:'Uma possibilidade profissional merece exame antes de virar obrigação. Separe o que é uma condição concreta, o que é uma expectativa sua e o que depende de uma conversa ou de um acordo.'},
  money:{label:'os recursos e as prioridades',bridge:'No campo material, a imagem pede atenção ao que sustenta a vida, aos compromissos assumidos e ao espaço que ainda existe para ajustar prioridades. Segurança simbólica não é garantia de ganho; qualquer decisão precisa considerar condições reais.',question:'O que merece prioridade com os recursos disponíveis, e o que pode esperar?',mind:'Uma preocupação material pode misturar números, receios e expectativas. Conferir condições e compromissos ajuda a reduzir essa mistura. A leitura oferece reflexão, não uma previsão de ganho nem uma recomendação de investimento.'},
  family:{label:'o pertencimento',bridge:'Na família, histórias compartilhadas podem dar abrigo e também criar expectativas difíceis de nomear. Essa passagem convida a examinar o cuidado que aproxima, o limite que protege e a conversa que permite existir sem carregar toda a convivência.',question:'Que acordo daria espaço às suas necessidades sem exigir que todos fossem iguais?',mind:'Uma história familiar pode fazer uma frase do presente carregar o peso de muitas outras. Considere o que está acontecendo agora antes de tratar uma memória ou expectativa como descrição completa de alguém.'},
  identity:{label:'a própria presença',bridge:'Quando a pergunta toca identidade, essa passagem convida a olhar para a distância entre aquilo que deseja expressar e aquilo que sente que deve apresentar para caber. A imagem não define quem você é; oferece um lugar para examinar essa distância.',question:'O que você deseja expressar com mais verdade, e que cuidado tornaria isso possível?',mind:'Uma expectativa alheia pode acabar soando como uma regra interior. Vale distinguir o que você deseja, o que teme perder e o que reconhece como um valor próprio. Nenhuma carta substitui sua experiência de si.'},
  spirit:{label:'o sentido e a espiritualidade',bridge:'Na busca espiritual, a imagem pode aproximar propósito e cotidiano. Uma convicção ganha corpo no cuidado, na forma de tratar alguém e no que se escolhe sustentar. O mistério permanece uma linguagem simbólica, sem precisar fabricar uma confirmação sobrenatural.',question:'Que prática tornaria o sentido que você procura mais presente no seu cotidiano?',mind:'Uma experiência simbólica pode emocionar sem se tornar uma prova externa. Dê espaço ao significado que encontra nela e preserve a distinção entre esse significado, uma interpretação e um fato verificável.'},
  choice:{label:'a decisão',bridge:'Diante de uma escolha, essa passagem convida a considerar o que cada caminho exige, permite e deixa para trás. Uma alternativa não precisa eliminar toda dúvida para ser viável; precisa respeitar um critério que você consiga reconhecer e sustentar.',question:'Qual critério permanece importante quando o entusiasmo diminui ou o receio aumenta?',mind:'Escolher pode se tornar mais difícil quando cada alternativa precisa prometer uma vida perfeita. Compare condições e custos possíveis. Uma dúvida importante merece investigação; nem toda dúvida precisa se tornar impedimento.'},
  change:{label:'a mudança',bridge:'Numa mudança, essa passagem convida a perceber o que já não encontra lugar e o que ainda oferece sustentação. Preparar uma transição pode ser um gesto de coragem. Nem toda renovação exige pressa, e nem todo cuidado significa permanecer.',question:'O que pode mudar primeiro, e qual apoio você deseja preservar durante a passagem?',mind:'A vontade de mudar pode conviver com o receio de perder uma referência. Examinar as duas forças evita chamar toda cautela de medo ou todo impulso de certeza. Procure a informação que torna o próximo passo mais claro.'},
  general:{label:'o momento presente',bridge:'Sem uma pergunta definida, essa passagem oferece um espelho aberto. Repare onde a imagem encontra eco na sua experiência e onde não encontra. Uma leitura se torna útil quando ajuda a nomear uma questão; não precisa servir como descrição inteira da sua vida.',question:'Que parte desta imagem merece sua atenção hoje, e que parte você pode deixar passar?',mind:'Uma imagem pode encontrar sentido em mais de uma situação. Escolha aquela que você reconhece e examine o que sabe sobre ela. Não é necessário adaptar sua história à leitura para que a reflexão tenha valor.'}
};
const ROLE_OPEN={
  present:'O tempo desta cena é o agora: aquilo que pode receber atenção antes do próximo gesto.',
  past:'A abertura guarda a imagem de um padrão que se afasta, sem afirmar que ele aconteceu na sua vida.',
  future:'A abertura é uma possibilidade de movimento, não uma lembrança nem uma promessa de acontecimento.',
  challenge:'A abertura ocupa o lugar de tensão: sua força precisa ser examinada pelo custo ou resistência que pode encontrar.',
  counsel:'A abertura procura um gesto que possa dar forma à reflexão.',
  synthesis:'A abertura procura reunir diferenças num fio de compreensão.',
  royal:'Essa imagem ocupa um lugar da mesa e conversa com as posições próximas; não é uma sentença sobre uma área fixa da vida.',
  sequence:'Essa imagem pertence a uma sequência que pode ganhar sentido conforme outras imagens se aproximam.'
};
const INTENT={
  ending:'Quando a pergunta procura um encerramento, o ponto não é sair ou ficar por obediência ao símbolo: é reconhecer o que ainda se sustenta e o que apenas prolonga desgaste.',
  renewal:'Quando a pergunta procura reconstrução, a esperança precisa de condições. Renovar não é repetir uma promessa; pode exigir um acordo diferente, um limite ou outra maneira de agir.',
  waiting:'Quando a pergunta procura um tempo de espera, vale distinguir amadurecimento de adiamento. Dar tempo faz sentido quando também existe atenção ao que muda ou permanece.',
  decision:'Quando a pergunta procura uma decisão, o critério importa tanto quanto a intensidade do desejo. Examine o que consegue sustentar depois do primeiro impulso.',
  understanding:'Quando a pergunta procura compreensão, reconhecer uma tensão pode ser mais útil que produzir uma resposta imediata. A clareza começa pelo que pode ser nomeado.'
};
export function writeWhitNarrative({layout,topic='general',intent='understanding',seed=''}={}){
  if(!layout?.contexts?.length)throw new TypeError('A voz precisa de uma análise válida.');
  const ordered=[...layout.contexts].sort((a,b)=>a.position.index-b.position.index);
  const opening=ordered[0];
  const tension=ordered.find(c=>['challenge','cost','hopeFear'].includes(c.position.role))||ordered.find(c=>c.card.themes.some(t=>['ruptura','conflito','dor','incerteza','apego'].includes(t)))||opening;
  const direction=ordered.find(c=>['synthesis','counsel'].includes(c.position.role))||ordered.at(-1);
  const frame=TOPICS[topic]||TOPICS.general;
  const motif=MOTIFS[opening.card.themes[0]]||MOTIFS.interior;
  const role=ROLE_OPEN[opening.position.role]||`Nesta passagem, o foco está em ${opening.position.lens}.`;
  const primary=layout.links.find(l=>l.kind==='transition')||layout.links[0];
  const orderedLinks=layout.links.filter(l=>l.kind==='transition');
  const relations=unique([primary?.narrative,...orderedLinks.map(l=>l.narrative)]).slice(0,ordered.length>5?4:2);
  const scenePrefix=pick(['Imagine','Como cena simbólica, imagine','A história pode ser vista assim: imagine'],seed,'scene');
  const intro=`${scenePrefix} ${motif.place}. Nessa paisagem, ${lower(opening.card.scene)}. ${role} ${motif.image.charAt(0).toLocaleUpperCase('pt-BR')+motif.image.slice(1)}. A força que dá início à passagem é ${opening.card.strength}; ela precisa encontrar uma forma que possa ser vivida, não apenas desejada.`;
  const shadowPrefix=pick(['O contraste aparece no risco de','A parte delicada desta imagem é','O fio pode se apertar ao'],seed,'shadow');
  const shadow=`${shadowPrefix} ${tension.card.tension}. É nesse ponto que a imagem muda de tom: a força de ${tension.card.strength} também pede medida. ${INTENT[intent]||INTENT.understanding} Reconhecer duas necessidades diferentes pode ser mais fértil que tentar fazer uma delas desaparecer.`;
  const linkText=relations.length?relations.join(' '):`A força de ${opening.card.strength} encontra o risco de ${opening.card.tension}. A mesma imagem pode abrir uma possibilidade e mostrar o cuidado necessário para que ela não se transforme em excesso.`;
  const movement=ordered.length>1?`${linkText} O sentido nasce da conversa entre as imagens. Um movimento pode oferecer clareza e ainda precisar de tempo para ganhar forma. A direção deve encontrar um lugar nas condições que você conhece e no espaço que as pessoas envolvidas conseguem compartilhar.`:null;
  const relational=`${frame.bridge} Nas trocas com outras pessoas, a força de ${tension.card.strength} pede uma forma de presença que possa ser reconhecida nas atitudes. Se essa passagem fizer sentido para você, procure um gesto que a aproxime da realidade: uma pergunta clara, um limite respeitado ou um cuidado que possa ser recebido.`;
  const mental=`${frame.mind} No pensamento, vale distinguir a força de ${tension.card.strength} do risco de ${tension.card.tension}. O que ainda não se sabe pode continuar sendo uma pergunta, enquanto um gesto possível é escolhido. Uma conversa cuidadosa pode trazer mais clareza que muitas explicações construídas em silêncio.`;
  const themes=layout.themes.slice(0,3).map(t=>WHIT_THEME_AXES[t.theme]).filter(Boolean);
  const spiritual=opening.card.canonicalId===direction.card.canonicalId
    ? `Espiritualmente, a imagem evoca ${opening.card.symbol}. O símbolo convida a ${joinNatural(themes)}. Essa dimensão não precisa se afastar do cotidiano: pode existir numa pausa, num cuidado ou numa conversa que aproxime intenção e atitude. O sagrado, nesta história, é uma forma poética de reconhecer o valor do que está sendo vivido.`
    : `Espiritualmente, a passagem coloca lado a lado duas imagens: ${opening.card.symbol}; ${direction.card.symbol}. Entre elas, o sentido convida a ${joinNatural(themes)}. Essa é uma linguagem para propósito, transformação e presença. Ela ganha corpo quando encontra um cuidado ou uma atitude que faça sentido para você.`;
  const counsel=sentence(direction.card.action);
  const directionText=direction.position.role==='challenge'||direction.position.role==='cost'
    ? `O movimento pede reconhecer o risco de ${direction.card.tension}, em vez de ampliá-lo.`
    : `A direção da história encontra apoio em ${direction.card.strength}, sem garantir um resultado.`;
  const closing=pick([frame.question,`Onde você encontra espaço para ${WHIT_THEME_AXES[direction.card.themes[0]]||'um próximo passo'} sem ignorar o limite que apareceu?`],seed,'question');
  const final=`${counsel} ${directionText} Se fizer sentido, transforme essa atitude num gesto de escala pequena e observe seu efeito antes de exigir uma resposta definitiva. A história termina com uma abertura: ${lower(closing)}`;
  const base=ordered.length>5?ordered.find(c=>c.position.role==='foundation')||ordered[Math.floor(ordered.length/2)]:null;
  const support=base?`Sob a passagem principal, há outra imagem a considerar: ${lower(base.card.scene)}. Ela introduz ${base.card.strength} e pede cuidado com ${base.card.tension}. Esse fio não precisa anular o anterior. Pode mostrar por que uma mudança pede sustentação e por que uma esperança também precisa de um limite reconhecido.`:null;
  const paragraphs=unique([intro,shadow,movement,relational,mental,support,spiritual,final]);
  const lead=`${opening.functionText} O ponto delicado é ${tension.card.tension}.`;
  const essence=['Ficção simbólica para reflexão.',lead,primary?.narrative,`Para ${frame.label}, ${lower(INTENT[intent]||INTENT.understanding)}`,directionText,counsel].filter(Boolean).join(' ');
  const complete=[SYMBOLIC_NOTICE,...paragraphs].join('\n\n');
  return {title:pick(motif.titles,seed,opening.card.canonicalId+topic),essence,paragraphs,story:paragraphs.join('\n\n'),heartline:lead,whisper:essence,closing,tendencyText:directionText,counselText:counsel,
    depthOptions:[{key:'complete',label:'Ler a história completa'},{key:'love',label:'Explorar os vínculos'},{key:'mind',label:'Entender a tensão'},{key:'action',label:'Ver atitudes possíveis'},{key:'spirit',label:'Explorar o sentido espiritual'},{key:'positions',label:'Entender as relações da mesa'}],
    depthResponses:{complete,love:relational,mind:mental,action:final,spirit:spiritual,positions:ordered.map(c=>`${c.position.label}: ${c.functionText}`).join('\n\n')},
    provenance:ordered.map(c=>({canonicalId:c.card.canonicalId,position:c.position.label,role:c.position.role})),
    voiceProfile:{version:WHIT_VOICE_VERSION,topic,intent,images:ordered.length,selectedRelations:relations.length},
    _parts:{opening:opening.card.canonicalId,tension:tension.card.canonicalId,direction:direction.card.canonicalId}
  };
}
