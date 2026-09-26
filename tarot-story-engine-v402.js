/*
 * DIVINA BRUXA 4.0.2 · ORÁCULO NARRATIVO DO TAROT
 *
 * Toda narrativa nasce das cartas reveladas. A intenção humana escolhe apenas
 * o território da vida; arcano, naipe, número, figura, tensão, gesto e
 * consequência pertencem ao Tarot. O motor cria ficção — não aula nem destino.
 */

import { loveHash, secureLoveSeed } from './love-engine-v370.js';
import { matterResponse, normalizePreferredName } from './matter-engine-v400.js';

export const STORY_ENGINE_NAME = 'ORÁCULO NARRATIVO DO TAROT';
export const STORY_ENGINE_VERSION = '4.0.2';
export const STORY_ENGINE_LABEL = 'CADA FRASE NASCE DA CARTA';

export const STORY_COVENANT = Object.freeze([
  'nenhuma história é escolhida fora do Tarot',
  'cada carta governa cena, tensão, gesto, consequência e verdade',
  'naipes, números e figuras alteram a ação dos Arcanos Menores',
  'nas tiragens cada carta recebe e transforma o capítulo anterior',
  'a intenção humana contextualiza a leitura sem substituir as cartas',
  'a narrativa é ficção simbólica, nunca previsão ou fato inventado'
]);

const clean = (value, limit = 4000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const normalize = value => clean(value, 800)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const mix = (seed, ...parts) => loveHash([seed, ...parts].join('¦'));
const choose = (values, seed, key) => values[mix(seed, key) % values.length];
const sentence = value => {
  const text = clean(value);
  const capitalized = text ? `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}` : '';
  return /[.!?…]$/.test(capitalized) ? capitalized : `${capitalized}.`;
};

const ARCANA = Object.freeze({
  louco:Object.freeze({
    aliases:['o louco', 'louco', 'the fool'], title:'A estrada antes do mapa', element:'air', defaultLens:'change',
    scene:'uma figura chega à borda com pouca bagagem, uma rosa nas mãos e um cão atento ao passo seguinte',
    pressure:'o horizonte chama com força, mas a beira do precipício exige presença',
    gesture:'confere o chão sem devolver ao medo a vontade de partir',
    consequence:'a estrada aparece durante o movimento, sem prometer onde terminará',
    truth:'liberdade se torna real quando curiosidade e consciência viajam juntas'
  }),
  mago:Object.freeze({
    aliases:['o mago', 'mago', 'the magician'], title:'A mesa onde intenção vira gesto', element:'air', defaultLens:'work',
    scene:'uma mão aponta o céu, a outra toca a terra, e taça, lâmina, moeda e bastão aguardam sobre a mesma mesa',
    pressure:'todos os recursos estão presentes, mas potência dispersa ainda não é criação',
    gesture:'escolhe um instrumento, reúne atenção e transforma intenção em primeiro ato',
    consequence:'o que parecia apenas possibilidade deixa uma marca concreta no mundo',
    truth:'poder não está em possuir todas as ferramentas, mas em assumir autoria sobre o uso delas'
  }),
  sacerdotisa:Object.freeze({
    aliases:['a sacerdotisa', 'sacerdotisa', 'papisa', 'high priestess'], title:'O livro atrás do véu', element:'water', defaultLens:'self',
    scene:'entre duas colunas, uma guardiã protege um livro parcialmente oculto enquanto a lua move águas invisíveis',
    pressure:'há informação suficiente para perceber o mistério, mas ainda não para arrancar dele uma resposta',
    gesture:'suspende o ruído, observa o que se repete e permite que a verdade amadureça antes da exposição',
    consequence:'o silêncio deixa de ser vazio e revela aquilo que a pressa vinha encobrindo',
    truth:'nem todo conhecimento pede anúncio imediato; parte da sabedoria nasce ao preservar o tempo certo'
  }),
  imperatriz:Object.freeze({
    aliases:['a imperatriz', 'imperatriz', 'the empress'], title:'O jardim que exige cuidado', element:'earth', defaultLens:'love',
    scene:'um campo fértil cresce ao redor de uma presença coroada, cercada por trigo, água e frutos ainda em formação',
    pressure:'a abundância pode nutrir a vida ou se perder quando cuidado vira excesso sem limite',
    gesture:'oferece presença, corpo e tempo ao que demonstra capacidade real de crescer',
    consequence:'o vínculo alimentado com constância começa a produzir forma, prazer e continuidade',
    truth:'criar é amar o bastante para nutrir e respeitar o bastante para não sufocar'
  }),
  imperador:Object.freeze({
    aliases:['o imperador', 'imperador', 'the emperor'], title:'O trono que sustenta o mundo', element:'fire', defaultLens:'work',
    scene:'um trono de pedra permanece firme diante das montanhas, e a coroa precisa responder por tudo o que governa',
    pressure:'estrutura protege, mas endurece quando controle ocupa o lugar da responsabilidade',
    gesture:'define fronteiras, organiza recursos e assume a consequência de cada ordem dada',
    consequence:'o território deixa de depender do improviso e encontra uma base capaz de durar',
    truth:'autoridade íntegra não domina a vida; cria condições para que ela permaneça de pé'
  }),
  hierofante:Object.freeze({
    aliases:['o hierofante', 'hierofante', 'o papa', 'papa', 'the hierophant'], title:'As chaves diante do templo', element:'earth', defaultLens:'family',
    scene:'duas chaves repousam diante de um templo onde ensinamentos antigos passam de uma geração para outra',
    pressure:'a tradição oferece linguagem e pertencimento, mas pode pedir obediência onde deveria oferecer orientação',
    gesture:'escuta a sabedoria recebida, separa princípio de costume e escolhe conscientemente o que continuará',
    consequence:'o legado deixa de ser repetição automática e se transforma em valor vivido',
    truth:'honrar uma tradição também pode significar impedir que ela apague a consciência de quem a recebe'
  }),
  enamorados:Object.freeze({
    aliases:['os enamorados', 'enamorados', 'os amantes', 'amantes', 'the lovers'], title:'A escolha sob o anjo', element:'air', defaultLens:'love',
    scene:'duas presenças se reconhecem sob um anjo, enquanto caminhos diferentes continuam abertos atrás delas',
    pressure:'o desejo aproxima, mas somente uma escolha alinhada consegue impedir que paixão e contradição governem juntas',
    gesture:'coloca palavras, valores e atitudes diante da mesma luz antes de oferecer compromisso',
    consequence:'o vínculo revela se consegue unir liberdade, verdade e reciprocidade sem partir nenhuma delas',
    truth:'amor se torna escolha quando aquilo que se sente consegue conversar com aquilo que se vive'
  }),
  carro:Object.freeze({
    aliases:['o carro', 'carro', 'a carruagem', 'carruagem', 'the chariot'], title:'As forças diante da mesma estrada', element:'water', defaultLens:'change',
    scene:'uma carruagem aguarda enquanto duas forças opostas apontam para direções diferentes',
    pressure:'movimento sem direção pode parecer vitória enquanto apenas aumenta a distância do centro',
    gesture:'segura as rédeas internas, escolhe um rumo e faz vontades contrárias trabalharem pelo mesmo avanço',
    consequence:'a travessia ganha velocidade porque conflito e desejo deixam de puxar o caminho para lados incompatíveis',
    truth:'conquista começa quando força deixa de ser dispersão e aceita servir a uma direção consciente'
  }),
  justica:Object.freeze({
    aliases:['a justica', 'justica', 'justice'], title:'A balança e a lâmina', element:'air', defaultLens:'decision',
    scene:'uma balança mede o que foi colocado sobre ela enquanto uma lâmina erguida impede que a verdade seja torcida',
    pressure:'sentimento, promessa e consequência precisam receber o peso exato, sem privilégio nem vingança',
    gesture:'separa fato de interpretação e aceita responder pelo efeito real de cada escolha',
    consequence:'a decisão deixa de buscar conforto imediato e começa a restaurar proporção',
    truth:'clareza não exige frieza; exige que nenhuma parte importante seja escondida do julgamento'
  }),
  eremita:Object.freeze({
    aliases:['o eremita', 'eremita', 'the hermit'], title:'A lanterna sobre a montanha', element:'earth', defaultLens:'self',
    scene:'no alto de uma montanha, uma lanterna ilumina apenas o trecho que um passo humano consegue atravessar',
    pressure:'a solidão pode devolver direção ou se tornar esconderijo quando o mundo inteiro é mantido do lado de fora',
    gesture:'reduz o caminho ao essencial, escuta a experiência e avança somente até onde a luz alcança',
    consequence:'a resposta perde grandiosidade e ganha precisão suficiente para orientar o próximo passo',
    truth:'sabedoria não ilumina o futuro inteiro; ilumina com honestidade o que pode ser vivido agora'
  }),
  roda:Object.freeze({
    aliases:['a roda da fortuna', 'roda da fortuna', 'a roda', 'wheel of fortune'], title:'O giro que muda as posições', element:'spirit', defaultLens:'change',
    scene:'uma grande roda gira e leva ao alto aquilo que antes estava embaixo, sem conservar nenhuma posição para sempre',
    pressure:'a mudança já começou, mas tentar congelar o giro transforma adaptação em sofrimento',
    gesture:'reconhece o ciclo, protege o que importa e usa o movimento em vez de lutar contra cada volta',
    consequence:'a instabilidade deixa de ser puro acaso e passa a oferecer uma janela concreta de reposicionamento',
    truth:'não controlar o giro não significa perder autoria sobre a forma de atravessá-lo'
  }),
  forca:Object.freeze({
    aliases:['a forca', 'forca', 'strength'], title:'A mão serena diante do leão', element:'fire', defaultLens:'self',
    scene:'uma presença se aproxima do leão sem arma, mantendo firmeza suficiente para tocar aquilo que poderia ferir',
    pressure:'instinto e raiva pedem expressão, mas violência contra si ou contra o outro apenas muda o dono da ferida',
    gesture:'permanece diante da intensidade, oferece limite e conduz a força sem tentar destruí-la',
    consequence:'o impulso deixa de comandar a cena e se converte em energia disponível para proteger e criar',
    truth:'coragem profunda não humilha o que é selvagem; ensina essa potência a não devorar a própria vida'
  }),
  enforcado:Object.freeze({
    aliases:['o enforcado', 'enforcado', 'o pendurado', 'pendurado', 'hanged man'], title:'O mundo visto de cabeça para baixo', element:'water', defaultLens:'decision',
    scene:'uma figura suspensa observa a paisagem invertida, imóvel por fora e cercada de luz por dentro',
    pressure:'forçar movimento repetiria a mesma visão, enquanto a pausa exige abrir mão de uma certeza antiga',
    gesture:'interrompe a reação automática e permite que outra perspectiva reorganize o problema',
    consequence:'aquilo que parecia atraso revela o ponto exato onde a história precisava mudar de ângulo',
    truth:'rendição consciente não é derrota; é parar de alimentar uma direção que já não produz passagem'
  }),
  morte:Object.freeze({
    aliases:['a morte', 'morte', 'death'], title:'A porta depois do último nome', element:'water', defaultLens:'change',
    scene:'um cavalo branco atravessa o campo enquanto uma coroa cai e o sol nasce entre duas torres distantes',
    pressure:'o ciclo terminou antes que todas as partes da vida aceitassem pronunciar o fim',
    gesture:'retira energia do que já se encerrou, honra a passagem e abre espaço concreto para outra forma existir',
    consequence:'a perda de uma estrutura devolve matéria, tempo e verdade ao começo seguinte',
    truth:'transformação não apaga o que viveu; impede que uma forma concluída aprisione tudo o que ainda pode nascer'
  }),
  temperanca:Object.freeze({
    aliases:['a temperanca', 'temperanca', 'temperance'], title:'A água entre as duas taças', element:'fire', defaultLens:'self',
    scene:'com um pé na água e outro na terra, uma presença transfere líquido entre duas taças sem perder uma gota',
    pressure:'extremos competem pela cena e prometem velocidade, embora nenhum consiga sustentar sozinho a travessia',
    gesture:'combina ritmos, testa proporções e cria uma terceira via com aquilo que antes parecia incompatível',
    consequence:'o fluxo encontra medida e permite que corpo, desejo e realidade continuem juntos',
    truth:'equilíbrio vivo não é imobilidade; é ajuste contínuo entre forças que precisam cooperar'
  }),
  diabo:Object.freeze({
    aliases:['o diabo', 'diabo', 'the devil'], title:'As correntes que podem ser abertas', element:'earth', defaultLens:'love',
    scene:'duas figuras permanecem diante de uma força sedutora, presas por correntes largas o bastante para serem retiradas',
    pressure:'prazer, medo e dependência confundem intensidade com impossibilidade de escolha',
    gesture:'nomeia o desejo sem enfeitá-lo, observa o preço cobrado e toca a corrente no ponto em que ela pode abrir',
    consequence:'o vínculo perde parte do poder oculto quando sua troca real fica visível',
    truth:'encarar a própria participação numa prisão é o primeiro gesto capaz de devolver liberdade'
  }),
  torre:Object.freeze({
    aliases:['a torre', 'torre', 'the tower'], title:'O raio que não aceita fachada', element:'fire', defaultLens:'change',
    scene:'um raio atravessa a coroa de uma torre e expulsa para o ar tudo o que parecia protegido pela altura',
    pressure:'a estrutura já estava partida por dentro, mas a aparência ainda exigia que todos fingissem estabilidade',
    gesture:'abandona a fachada, protege o que está vivo e deixa cair aquilo que só permanecia por medo',
    consequence:'o choque remove uma segurança falsa e revela o chão sobre o qual algo verdadeiro poderá ser reconstruído',
    truth:'quando a verdade derruba uma forma insustentável, o vazio também pode ser o início da honestidade'
  }),
  estrela:Object.freeze({
    aliases:['a estrela', 'estrela', 'the star'], title:'A água devolvida à noite', element:'air', defaultLens:'self',
    scene:'sob oito estrelas, uma presença derrama água na terra e no rio, sem esconder a vulnerabilidade do próprio corpo',
    pressure:'a esperança retorna depois da ruptura, mas ainda precisa aprender a confiar sem negar a ferida',
    gesture:'oferece verdade ao presente, nutre o que sobreviveu e permite que a recuperação aconteça sem espetáculo',
    consequence:'a vida volta a circular onde o medo havia transformado proteção em secura',
    truth:'esperança profunda não promete ausência de noite; mostra que ainda existe água para atravessá-la'
  }),
  lua:Object.freeze({
    aliases:['a lua', 'lua', 'the moon'], title:'O caminho entre as duas torres', element:'water', defaultLens:'self',
    scene:'um caminho atravessa duas torres enquanto cão, lobo e criatura das águas respondem de formas diferentes à mesma lua',
    pressure:'medo, memória e imaginação projetam sinais sobre uma estrada que ainda não pode ser vista por inteiro',
    gesture:'avança devagar, verifica cada impressão e não transforma sensação intensa em prova definitiva',
    consequence:'o nevoeiro continua existindo, mas deixa de decidir sozinho qual passo será dado',
    truth:'intuição cresce quando pode dialogar com realidade, tempo e observação sem precisar fingir certeza'
  }),
  sol:Object.freeze({
    aliases:['o sol', 'sol', 'the sun'], title:'A verdade sob a luz inteira', element:'fire', defaultLens:'self',
    scene:'uma criança atravessa o jardim sob um sol aberto, entre girassóis que já não precisam procurar outra direção',
    pressure:'a luz revela alegria e também tudo o que vinha sobrevivendo apenas nas sombras',
    gesture:'assume a própria presença, compartilha o que é verdadeiro e deixa a vitalidade ocupar espaço sem pedir desculpa',
    consequence:'o que estava confuso ganha contorno, calor e possibilidade de celebração concreta',
    truth:'clareza não diminui o mistério da vida; permite que a alegria exista sem precisar esconder a verdade'
  }),
  julgamento:Object.freeze({
    aliases:['o julgamento', 'julgamento', 'judgement', 'judgment'], title:'O chamado que levanta os adormecidos', element:'fire', defaultLens:'change',
    scene:'uma trombeta atravessa o céu e faz antigas versões da vida se levantarem para responder ao chamado',
    pressure:'o passado pede avaliação sem condenação, porque repetir e reparar já não podem ocupar o mesmo lugar',
    gesture:'ouve o chamado, reconhece o que precisa ser respondido e abandona a sentença que impedia mudança',
    consequence:'a história antiga encontra uma leitura mais ampla e libera uma decisão que antes parecia impossível',
    truth:'renascimento começa quando responsabilidade e perdão deixam de ser tratados como inimigos'
  }),
  mundo:Object.freeze({
    aliases:['o mundo', 'mundo', 'the world'], title:'A dança dentro da coroa', element:'earth', defaultLens:'change',
    scene:'uma figura dança dentro de uma coroa viva enquanto quatro guardiões reconhecem a conclusão ao redor',
    pressure:'o ciclo está completo, mas encerrá-lo exige aceitar que plenitude não significa permanecer para sempre no mesmo lugar',
    gesture:'reúne aprendizado, celebra o que chegou inteiro e atravessa a última fronteira sem diminuir a conquista',
    consequence:'as partes dispersas formam uma totalidade capaz de sustentar o próximo começo',
    truth:'concluir é permitir que a obra exista inteira sem obrigá-la a impedir o nascimento de outra jornada'
  })
});

const MAJOR_ORDER = Object.freeze([
  'louco', 'mago', 'sacerdotisa', 'imperatriz', 'imperador', 'hierofante', 'enamorados',
  'carro', 'justica', 'eremita', 'roda', 'forca', 'enforcado', 'morte', 'temperanca',
  'diabo', 'torre', 'estrela', 'lua', 'sol', 'julgamento', 'mundo'
]);

const SUITS = Object.freeze({
  paus:Object.freeze({
    aliases:['paus', 'bastoes', 'bastao', 'wands'], title:'Paus', element:'fire', defaultLens:'work',
    landscape:'uma chama procura direção entre desejo, coragem e criação',
    pressure:'o fogo pode iluminar o caminho ou consumir energia antes que a obra exista',
    gesture:'concentra impulso numa ação que possa continuar depois do entusiasmo',
    consequence:'vontade deixa de ser faísca isolada e começa a alterar a realidade',
    truth:'paixão se torna potência quando encontra direção, ritmo e responsabilidade'
  }),
  copas:Object.freeze({
    aliases:['copas', 'tacas', 'taca', 'cups'], title:'Copas', element:'water', defaultLens:'love',
    landscape:'a água registra afeto, memória e tudo o que passa de uma presença para outra',
    pressure:'sentimento transborda quando imaginação e reciprocidade deixam de ser distinguidas',
    gesture:'escuta o coração e confronta sua corrente com os gestos que realmente voltam',
    consequence:'a emoção encontra recipiente e pode nutrir sem inundar a própria vida',
    truth:'sentir profundamente não elimina a necessidade de troca, limite e realidade'
  }),
  espadas:Object.freeze({
    aliases:['espadas', 'espada', 'swords'], title:'Espadas', element:'air', defaultLens:'decision',
    landscape:'o ar se transforma em pensamento, palavra e lâmina capaz de separar verdade de ruído',
    pressure:'a mente tenta vencer o conflito criando certezas mais rápidas do que os fatos',
    gesture:'nomeia a questão, corta a distorção e usa clareza sem transformar precisão em crueldade',
    consequence:'o conflito ganha contorno e deixa de atacar todas as direções ao mesmo tempo',
    truth:'verdade liberta quando sua lâmina serve à consciência em vez de servir ao medo'
  }),
  ouros:Object.freeze({
    aliases:['ouros', 'ouro', 'pentaculos', 'pentaculo', 'moedas', 'moeda', 'pentacles'], title:'Ouros', element:'earth', defaultLens:'work',
    landscape:'a terra reúne corpo, tempo, dinheiro, trabalho e aquilo que precisa durar além da intenção',
    pressure:'segurança pode virar prisão quando possuir substitui viver e conservar impede qualquer mudança',
    gesture:'mede recursos, cuida da matéria e constrói uma etapa que possa ser sustentada',
    consequence:'o valor sai da abstração e aparece em rotina, resultado, limite e continuidade',
    truth:'prosperidade começa quando matéria recebe cuidado sem receber autoridade sobre toda a vida'
  })
});

const RANKS = Object.freeze({
  as:Object.freeze({ aliases:['as', 'ace', '1'], title:'A semente', stage:'um único emblema aparece como matéria ainda intacta', pressure:'todo começo contém força e também o risco de permanecer apenas promessa', gesture:'aceita iniciar na menor escala verdadeira', consequence:'a possibilidade ganha um primeiro corpo', truth:'uma origem vale pelo que consegue inaugurar' }),
  dois:Object.freeze({ aliases:['dois', '2'], title:'O espelho', stage:'duas forças se encaram e tornam impossível fingir que existe apenas um caminho', pressure:'equilíbrio provisório pode esconder uma escolha adiada', gesture:'coloca as duas margens em relação sem apagar a diferença', consequence:'a relação entre os lados revela qual movimento é possível', truth:'dualidade pede diálogo antes de pedir vitória' }),
  tres:Object.freeze({ aliases:['tres', '3'], title:'A formação', stage:'uma terceira presença surge e transforma encontro em construção', pressure:'crescer exige coordenação entre desejos que já não cabem num gesto solitário', gesture:'reúne contribuição, visão e execução', consequence:'o que era intenção compartilhada começa a produzir forma', truth:'expansão verdadeira cria espaço para cooperação' }),
  quatro:Object.freeze({ aliases:['quatro', '4'], title:'A estrutura', stage:'quatro pontos delimitam um território que pode proteger, sustentar ou conter', pressure:'estabilidade corre o risco de confundir descanso com imobilidade', gesture:'fortalece a base e verifica onde ela precisa de uma abertura', consequence:'a energia encontra um lugar seguro para permanecer', truth:'estrutura saudável protege movimento em vez de proibi-lo' }),
  cinco:Object.freeze({ aliases:['cinco', '5'], title:'A ruptura', stage:'a quinta força rompe a simetria e revela o conflito que a ordem escondia', pressure:'perda e disputa tentam convencer a cena de que nada importante restou', gesture:'reconhece a fratura e procura o recurso que ainda está disponível', consequence:'o conflito deixa uma verdade que a antiga forma não conseguia dizer', truth:'crise também revela o que precisa mudar para não se repetir' }),
  seis:Object.freeze({ aliases:['seis', '6'], title:'A passagem', stage:'depois do abalo, seis movimentos procuram troca, travessia e nova proporção', pressure:'seguir adiante pode repetir a dívida antiga se ninguém observar o que está sendo levado', gesture:'redistribui peso e atravessa com consciência do que pertence a cada lado', consequence:'a corrente volta a circular entre passado e continuidade', truth:'harmonia não apaga a travessia que foi necessária para alcançá-la' }),
  sete:Object.freeze({ aliases:['sete', '7'], title:'A prova', stage:'sete caminhos testam estratégia, convicção e capacidade de sustentar uma escolha', pressure:'possibilidades demais podem esconder fuga, defesa ou desejo sem direção', gesture:'seleciona o que merece energia e protege a decisão do excesso', consequence:'a prova distingue vontade momentânea de compromisso real', truth:'discernimento também é saber a qual possibilidade dizer não' }),
  oito:Object.freeze({ aliases:['oito', '8'], title:'O movimento', stage:'oito repetições criam velocidade, disciplina e consequência acumulada', pressure:'ritmo intenso pode produzir domínio ou automatizar uma prisão', gesture:'ajusta o padrão e repete somente aquilo que conduz ao resultado desejado', consequence:'a energia concentrada atravessa uma distância antes impossível', truth:'constância amplifica tanto a consciência quanto o erro; direção importa' }),
  nove:Object.freeze({ aliases:['nove', '9'], title:'O limiar', stage:'nove marcas mostram uma obra quase completa diante de seu último aprendizado', pressure:'proximidade do fim mistura maturidade, cansaço e medo de perder o que foi conquistado', gesture:'protege a experiência sem fechar a porta para a etapa final', consequence:'a trajetória revela o valor e o custo de tudo o que foi sustentado', truth:'maturidade reconhece a conquista sem negar a necessidade de concluir' }),
  dez:Object.freeze({ aliases:['dez', '10'], title:'A consequência', stage:'dez unidades levam o ciclo ao limite e tornam visível tudo o que foi acumulado', pressure:'plenitude e excesso chegam juntos, exigindo distinguir legado de peso', gesture:'encerra, distribui e decide o que realmente seguirá adiante', consequence:'o ciclo entrega seu resultado inteiro e prepara outra origem', truth:'todo fim mostra o que a repetição construiu e o que já não pode carregar' }),
  valete:Object.freeze({ aliases:['valete', 'pajem', 'page', 'princesa'], title:'A mensagem', stage:'uma figura jovem observa o emblema como se ele acabasse de revelar uma linguagem', pressure:'curiosidade pode abrir aprendizado ou falar antes de compreender', gesture:'faz a pergunta essencial e experimenta sem fingir domínio', consequence:'uma notícia, descoberta ou desejo encontra voz pela primeira vez', truth:'começar a aprender é mais poderoso do que representar uma certeza inexistente' }),
  cavaleiro:Object.freeze({ aliases:['cavaleiro', 'knight', 'principe'], title:'A perseguição', stage:'uma figura montada transforma o emblema em direção, velocidade e busca', pressure:'o impulso de alcançar pode ultrapassar corpo, contexto e consequência', gesture:'alinha movimento ao propósito antes de avançar', consequence:'a energia atravessa o território e obriga a situação a responder', truth:'movimento revela caráter quando encontra resistência' }),
  rainha:Object.freeze({ aliases:['rainha', 'queen'], title:'O domínio interior', stage:'uma figura coroada sustenta o emblema sem precisar exibir sua força', pressure:'cuidado e domínio internos podem se fechar quando proteção vira isolamento', gesture:'recebe, compreende e governa a energia a partir de dentro', consequence:'a presença transforma o ambiente sem abandonar o próprio centro', truth:'maturidade interior não precisa diminuir ninguém para permanecer soberana' }),
  rei:Object.freeze({ aliases:['rei', 'king'], title:'A responsabilidade', stage:'uma figura coroada ocupa o trono onde decisão e consequência se encontram', pressure:'poder externo perde integridade quando resultado vale mais do que responsabilidade', gesture:'decide, organiza e responde pelo efeito produzido no território', consequence:'a energia alcança expressão pública, direção e legado', truth:'domínio verdadeiro inclui prestar contas pelo mundo que ajuda a construir' })
});

const minorCard = (title, scene, pressure, gesture, consequence, truth) => Object.freeze({
  title, scene, pressure, gesture, consequence, truth
});

/*
 * As 56 cartas menores não recebem um texto genérico de naipe. Cada encontro
 * entre número/figura e naipe possui uma cena, um conflito e um movimento
 * próprios. O naipe continua definindo o elemento; a carta inteira escreve a
 * narrativa.
 */
const MINOR_ARCANA = Object.freeze({
  'as-de-paus':minorCard(
    'A mão que oferece a chama',
    'uma mão surge da nuvem sustentando um bastão vivo, ainda coberto por folhas que anunciam criação',
    'a centelha é verdadeira, mas pode desaparecer se entusiasmo não encontrar direção',
    'recebe o impulso e escolhe uma primeira ação capaz de alimentar o fogo amanhã',
    'o desejo deixa de ser apenas sensação e ganha o início de uma obra',
    'todo grande incêndio criador começa quando alguém protege a primeira chama'
  ),
  'dois-de-paus':minorCard(
    'O mundo entre duas varas',
    'do alto de uma muralha, uma figura segura o mundo enquanto observa a distância entre o território conhecido e o horizonte',
    'ter possibilidades nas mãos não resolve a tensão entre permanecer seguro e ampliar a própria vida',
    'compara os dois caminhos, mede o risco e escolhe onde a vontade deixará de ser contemplação',
    'o horizonte se transforma em plano e a ambição recebe uma direção possível',
    'visão só se torna poder quando aceita perder os futuros que não serão escolhidos'
  ),
  'tres-de-paus':minorCard(
    'Os navios além da margem',
    'uma figura observa navios atravessando o mar depois de ter firmado três bastões na terra',
    'a obra já partiu, mas resultado, distância e tempo não obedecem ao ritmo da ansiedade',
    'mantém a base, acompanha o movimento e prepara espaço para aquilo que poderá retornar transformado',
    'o primeiro esforço amplia o território e começa a trazer resposta do mundo',
    'expansão pede coragem para enviar e maturidade para esperar sem abandonar o porto'
  ),
  'quatro-de-paus':minorCard(
    'A passagem sob as flores',
    'quatro bastões sustentam uma guirlanda enquanto pessoas celebram diante de uma casa que pode recebê-las',
    'a conquista quer ser celebrada, mas alegria sem presença vira apenas decoração',
    'reconhece quem ajudou a erguer a passagem e transforma vitória em pertencimento compartilhado',
    'o esforço encontra uma pausa segura, uma casa simbólica e motivo concreto para festa',
    'celebrar também é consagrar a base que permitirá continuar'
  ),
  'cinco-de-paus':minorCard(
    'O fogo sem direção comum',
    'cinco figuras erguem bastões ao mesmo tempo, misturando treino, disputa e ruído numa única arena',
    'forças valiosas se chocam porque nenhuma aceita ainda uma regra, uma escuta ou um objetivo comum',
    'define a verdadeira disputa, separa adversário de aliado e dá ao fogo uma arena justa',
    'o conflito revela capacidades, limites e a razão pela qual todos estavam lutando',
    'divergência pode aprimorar uma obra quando deixa de usar confusão como medida de força'
  ),
  'seis-de-paus':minorCard(
    'A coroa diante da multidão',
    'uma figura atravessa a cidade levando no bastão uma coroa de louros, reconhecida pelos que caminham ao redor',
    'o aplauso confirma uma conquista, mas pode aprisionar a identidade ao olhar da plateia',
    'recebe o reconhecimento, nomeia o trabalho coletivo e não entrega ao sucesso o governo do próximo passo',
    'a vitória se torna visível e devolve confiança ao caminho percorrido',
    'ser visto é uma passagem; saber por que continuar é o verdadeiro triunfo'
  ),
  'sete-de-paus':minorCard(
    'A posição que precisa ser defendida',
    'num terreno elevado, uma figura sustenta o próprio bastão diante de seis forças que avançam de baixo',
    'a conquista criou oposição e agora ceder por exaustão parece mais fácil do que lembrar por que ela importa',
    'firma os pés, escolhe a batalha essencial e protege a posição sem lutar contra o mundo inteiro',
    'a resistência deixa claro quais valores permanecem de pé quando recebem pressão',
    'convicção não é atacar todos; é não abandonar o que merece defesa'
  ),
  'oito-de-paus':minorCard(
    'As oito setas no mesmo céu',
    'oito bastões atravessam o ar na mesma direção, sem obstáculos entre lançamento e chegada',
    'a velocidade abre passagem, mas qualquer desalinhamento também alcançará depressa sua consequência',
    'elimina o ruído, responde ao momento e mantém todas as forças apontadas para o mesmo destino',
    'a espera se rompe e notícias, decisões ou encontros começam a se mover de uma vez',
    'quando direção e tempo se encontram, o fogo percorre em instantes o que antes parecia distante'
  ),
  'nove-de-paus':minorCard(
    'O guardião ferido',
    'uma figura marcada pela batalha vigia o último bastão diante de uma cerca construída com os oito anteriores',
    'experiência oferece proteção, mas a memória do ataque pode transformar toda aproximação em ameaça',
    'preserva a fronteira necessária, cuida da ferida e verifica o presente antes de repetir a guerra',
    'a força restante basta para completar a travessia sem negar o preço que já foi pago',
    'resistir não exige viver para sempre dentro da postura de combate'
  ),
  'dez-de-paus':minorCard(
    'A cidade atrás do peso',
    'uma figura carrega dez bastões diante do rosto enquanto a cidade está próxima, mas quase invisível sob a carga',
    'responsabilidade virou acúmulo e aquilo que deveria servir ao destino agora impede enxergá-lo',
    'separa dever de excesso, redistribui o peso e conserva apenas o que precisa chegar ao fim',
    'a etapa pode ser concluída sem exigir que uma única pessoa sustente tudo sozinha',
    'capacidade não cria obrigação de carregar cada peso disponível'
  ),
  'valete-de-paus':minorCard(
    'A mensagem no deserto',
    'uma figura jovem contempla o próprio bastão brotando em pleno deserto como se escutasse uma notícia vinda do fogo',
    'a descoberta pede aventura, mas ainda não conhece terreno, duração ou consequência',
    'faz a pergunta corajosa, experimenta em pequena escala e permite que curiosidade se torne aprendizado',
    'uma possibilidade ganha voz e convida a vida a sair da repetição',
    'entusiasmo é mensageiro; experiência é o caminho que decide o que a mensagem poderá criar'
  ),
  'cavaleiro-de-paus':minorCard(
    'O cavalo dentro da labareda',
    'um cavaleiro avança pelo deserto com o bastão erguido enquanto o cavalo parece saltar antes de receber toda a direção',
    'coragem e impaciência usam o mesmo fogo, embora levem a destinos muito diferentes',
    'escolhe a aventura que merece velocidade e confere se o impulso consegue responder pelo rastro deixado',
    'a energia rompe a estagnação e obriga a paisagem a reagir',
    'movimento apaixonado conquista distância; compromisso decide se haverá chegada'
  ),
  'rainha-de-paus':minorCard(
    'O girassol e o gato negro',
    'uma rainha sustenta o bastão e o girassol enquanto um gato negro guarda, aos seus pés, a parte instintiva de sua presença',
    'brilho pessoal pode inspirar ou se esconder quando comparação e medo de julgamento ocupam o trono',
    'entra inteira na cena, aquece o ambiente e mantém a intuição ao lado da própria confiança',
    'a criatividade se torna presença magnética sem precisar diminuir outra luz',
    'carisma verdadeiro nasce quando desejo, instinto e generosidade deixam de disputar o mesmo corpo'
  ),
  'rei-de-paus':minorCard(
    'O trono das salamandras',
    'um rei segura o bastão florescido num trono cercado por salamandras, como quem aprendeu a governar o fogo sem apagá-lo',
    'visão ampla perde integridade quando liderança confunde inspiração com direito absoluto de mandar',
    'declara a direção, reúne pessoas pela finalidade e responde pelo mundo que sua chama produz',
    'o impulso individual se transforma em projeto, influência e legado coletivo',
    'liderar o fogo é fazê-lo iluminar mais vidas do que consome'
  ),

  'as-de-copas':minorCard(
    'A taça que transborda',
    'uma mão oferece uma taça da qual cinco correntes caem sobre as águas, enquanto uma pomba traz presença ao centro',
    'o sentimento nasce abundante, mas ainda precisa descobrir onde poderá repousar sem se perder',
    'recebe a emoção, permite que ela atravesse o corpo e oferece somente o que encontra abertura real',
    'o coração volta a circular e inaugura uma possibilidade de afeto, cura ou criação',
    'amor começa como fonte; reciprocidade decide qual jardim ele poderá nutrir'
  ),
  'dois-de-copas':minorCard(
    'As duas taças sob o leão',
    'duas pessoas trocam taças sob um símbolo alado, reconhecendo uma à outra sem abandonar seus próprios corpos',
    'a atração abre o encontro, mas somente gesto recíproco transforma espelho em vínculo',
    'coloca sentimento, palavra e atitude diante da mesma troca e observa o que realmente volta',
    'duas vontades encontram uma linguagem comum sem precisar se tornar uma só',
    'união verdadeira nasce quando reconhecimento e liberdade cabem na mesma taça'
  ),
  'tres-de-copas':minorCard(
    'A colheita erguida em três taças',
    'três figuras levantam suas taças sobre frutos e flores, formando um círculo de celebração',
    'alegria compartilhada cura isolamento, mas o círculo perde verdade se alguém precisa representar felicidade para pertencer',
    'convoca a presença sincera, divide a conquista e permite que amizade testemunhe o que floresceu',
    'o afeto se multiplica porque deixa de depender de uma única fonte',
    'comunidade é a arte de celebrar sem apagar a história particular de cada pessoa'
  ),
  'quatro-de-copas':minorCard(
    'A taça oferecida ao silêncio',
    'sob uma árvore, uma figura cruza os braços diante de três taças enquanto uma quarta surge da nuvem sem receber seu olhar',
    'cansaço e comparação tornam invisível aquilo que o presente ainda tenta oferecer',
    'respeita a pausa, nomeia a ausência sentida e depois olha novamente para a oferta sem obrigação de aceitá-la',
    'a apatia revela se falta desejo, descanso ou capacidade de reconhecer uma possibilidade diferente',
    'nem toda recusa é ingratidão, mas todo fechamento merece saber o que está protegendo'
  ),
  'cinco-de-copas':minorCard(
    'As duas taças que permaneceram',
    'uma figura de manto escuro lamenta três taças derramadas sem ainda se voltar para as duas que continuam de pé junto à ponte',
    'a perda ocupa o campo inteiro da visão e tenta convencer o coração de que nada sobreviveu',
    'honra o que caiu, permite o luto e, no tempo possível, reconhece a ponte e aquilo que permaneceu',
    'a dor deixa de negar o vínculo perdido e também deixa de apagar todos os caminhos restantes',
    'cura não exige esquecer as taças derramadas; exige recuperar a capacidade de ver as que ficaram'
  ),
  'seis-de-copas':minorCard(
    'As flores devolvidas ao passado',
    'duas crianças trocam uma taça cheia de flores num pátio protegido pela memória',
    'a lembrança oferece doçura, mas pode transformar o passado em lugar mais perfeito do que realmente foi',
    'recebe o afeto antigo, distingue memória de repetição e leva adiante apenas o que ainda é vivo',
    'uma origem retorna como recurso, reconciliação ou despedida mais gentil',
    'inocência pode ser recuperada sem entregar novamente a ela o governo da vida adulta'
  ),
  'sete-de-copas':minorCard(
    'As sete visões na nuvem',
    'diante de uma silhueta, sete taças exibem tesouro, desejo, perigo e glória dentro da mesma nuvem',
    'imaginação multiplica futuros até que escolher pareça uma perda maior do que permanecer sonhando',
    'nomeia o desejo central, testa cada visão contra a realidade e retira energia das promessas sem chão',
    'a fantasia deixa de esconder a escolha e uma possibilidade começa a adquirir contorno',
    'sonhar abre portais; discernir decide qual deles conduz a uma vida possível'
  ),
  'oito-de-copas':minorCard(
    'A partida sob a lua',
    'uma figura deixa oito taças cuidadosamente empilhadas e segue por um caminho de montanha sob a lua',
    'algo foi construído e ainda assim não alimenta mais a verdade de quem precisa partir',
    'reconhece o valor do que existiu, aceita a falta que permaneceu e caminha sem transformar partida em desprezo',
    'o vazio deixa de ser mantido por lealdade e se torna espaço para uma busca mais profunda',
    'ir embora também pode honrar aquilo que já entregou tudo o que podia oferecer'
  ),
  'nove-de-copas':minorCard(
    'O banquete diante das nove taças',
    'uma figura se senta diante de nove taças organizadas como uma abundância conquistada e visível',
    'satisfação pode virar fachada quando prazer é usado para impedir que outra necessidade seja escutada',
    'reconhece o desejo realizado, desfruta sem culpa e verifica se a plenitude alcançou também o interior',
    'a conquista oferece prazer, confiança e a chance de aprender a receber',
    'um desejo cumprido é celebração, não prova de que o coração nunca mais sentirá falta'
  ),
  'dez-de-copas':minorCard(
    'O arco das dez taças',
    'dez taças formam um arco sobre uma família que celebra enquanto casa, rio e horizonte permanecem abertos',
    'a imagem de felicidade pode unir pessoas ou obrigá-las a esconder tudo o que não combina com o ideal',
    'constrói alegria em gestos cotidianos, inclui diferenças e permite que pertencimento seja verdadeiro em vez de perfeito',
    'o afeto encontra continuidade, comunidade e uma casa emocional compartilhada',
    'felicidade duradoura não é uma fotografia sem conflito; é um vínculo capaz de atravessar a verdade'
  ),
  'valete-de-copas':minorCard(
    'O peixe que fala da taça',
    'uma figura jovem observa surpresa um peixe surgir de sua taça como uma mensagem impossível vinda da água',
    'sensibilidade percebe o extraordinário, mas pode confundir imaginação, promessa e reciprocidade',
    'escuta a mensagem do coração, responde com honestidade e deixa a realidade participar da poesia',
    'um sentimento inesperado encontra linguagem e abre espaço para ternura criativa',
    'encanto continua mágico quando não precisa mentir para permanecer vivo'
  ),
  'cavaleiro-de-copas':minorCard(
    'A oferta que atravessa o rio',
    'um cavaleiro conduz lentamente sua taça por uma paisagem cortada por água, como quem leva uma proposta ao mundo',
    'ideal romântico e beleza do gesto podem chegar antes da capacidade de sustentar o que prometem',
    'leva a oferta com clareza, pergunta se há recepção e deixa intenção ser confirmada por continuidade',
    'o sentimento sai da fantasia e procura encontro, criação ou reconciliação concreta',
    'a declaração abre a porta; presença repetida revela a verdade da promessa'
  ),
  'rainha-de-copas':minorCard(
    'A taça fechada diante do mar',
    'uma rainha contempla uma taça única e fechada à beira do mar, ouvindo profundidades que não estão visíveis',
    'empatia sem limite absorve dores alheias até perder a diferença entre intuição e sobrecarga',
    'escuta profundamente, protege o próprio recipiente e oferece cuidado sem assumir a vida do outro',
    'a sensibilidade se torna abrigo lúcido em vez de oceano sem margem',
    'amor intuitivo permanece puro quando também sabe onde termina o próprio corpo'
  ),
  'rei-de-copas':minorCard(
    'O trono sobre as águas',
    'um rei permanece estável num trono cercado por ondas, sustentando a taça enquanto o mar continua em movimento',
    'controle aparente pode esconder emoção reprimida, e intensidade sem governo pode inundar todo o território',
    'reconhece o que sente, regula a resposta e usa maturidade afetiva para proteger a verdade da relação',
    'as águas continuam profundas sem derrubar o centro que precisa decidir',
    'governar emoções não é silenciá-las; é permitir que informem sem tomar o trono'
  ),

  'as-de-espadas':minorCard(
    'A coroa sobre a lâmina',
    'uma mão ergue da nuvem uma espada coroada, atravessando o ar com uma verdade ainda sem uso',
    'clareza chega afiada e pode libertar a cena ou feri-la quando certeza se confunde com superioridade',
    'nomeia o ponto central, corta a distorção e entrega à verdade uma linguagem precisa',
    'a confusão se abre e uma decisão intelectual encontra começo',
    'a primeira função da verdade é iluminar; vencer é apenas uma de suas consequências possíveis'
  ),
  'dois-de-espadas':minorCard(
    'A venda diante de duas lâminas',
    'uma figura vendada cruza duas espadas diante do mar enquanto a lua observa uma decisão suspensa',
    'evitar informação protege por um instante, mas mantém forças incompatíveis ocupando o mesmo corpo',
    'abaixa as lâminas o bastante para recolher fatos, sentir o conflito e escolher um critério',
    'a paralisia perde proteção e a escolha começa a ter forma',
    'neutralidade prolongada também decide: entrega o futuro à tensão que ninguém quis olhar'
  ),
  'tres-de-espadas':minorCard(
    'O coração atravessado pela verdade',
    'três espadas atravessam um coração sob chuva e nuvens, sem permitir que a ferida permaneça abstrata',
    'dor, rejeição ou separação querem transformar um acontecimento em sentença sobre todo o amor possível',
    'dá nome exato à ferida, retira dela as culpas inventadas e permite que o luto atravesse o corpo',
    'a verdade dói sem precisar continuar perfurando tudo o que virá depois',
    'um coração ferido não é um coração incapaz; é um coração que precisa retirar as lâminas com honestidade'
  ),
  'quatro-de-espadas':minorCard(
    'O silêncio na capela',
    'uma figura repousa sob três espadas enquanto a quarta permanece horizontal e uma janela colore o silêncio',
    'a mente exausta tenta resolver em vigília aquilo que somente pausa e recuperação conseguem reorganizar',
    'interrompe a batalha, protege o descanso e adia decisões que nasceriam apenas do esgotamento',
    'o pensamento reduz o ruído e recupera espaço para discernir',
    'repouso não abandona a luta; devolve consciência a quem precisará escolher como continuar'
  ),
  'cinco-de-espadas':minorCard(
    'As lâminas depois da disputa',
    'uma figura recolhe espadas enquanto duas pessoas se afastam sob um céu rasgado pela vitória amarga',
    'ganhar a discussão ameaça custar confiança, vínculo e a própria razão que deveria ser defendida',
    'observa o preço da vitória, interrompe a humilhação e escolhe quais armas não levará adiante',
    'o conflito revela quem foi ferido, o que foi protegido e se ainda existe reparação possível',
    'há vitórias que diminuem o vencedor porque deixam ninguém capaz de voltar inteiro'
  ),
  'seis-de-espadas':minorCard(
    'A travessia com as espadas a bordo',
    'um barco conduz três presenças sobre águas mais calmas, embora seis espadas continuem fincadas na embarcação',
    'partir reduz o conflito, mas pensamentos antigos viajam junto e podem reconstruir a mesma tempestade em outra margem',
    'aceita a passagem, leva apenas o aprendizado e permite que ajuda conduza o trecho que ainda dói',
    'a distância cria silêncio suficiente para que a mente deixe o estado de guerra',
    'mudar de margem inicia a cura; retirar as espadas da embarcação completa a travessia'
  ),
  'sete-de-espadas':minorCard(
    'As cinco lâminas levadas em silêncio',
    'uma figura deixa o acampamento carregando cinco espadas enquanto duas permanecem fincadas atrás de seus passos',
    'estratégia protege autonomia, mas segredo e atalho podem cobrar uma verdade maior do que aquela que evitaram',
    'identifica o que precisa de discrição, abandona a esperteza destrutiva e verifica o que ficou exposto',
    'o plano revela se nasceu de inteligência, medo ou recusa de prestar contas',
    'nem toda ação silenciosa é mentira, mas toda estratégia responde pelo que escolheu deixar para trás'
  ),
  'oito-de-espadas':minorCard(
    'O círculo que não está fechado',
    'uma figura vendada e amarrada permanece entre oito espadas, embora exista passagem no terreno ao redor',
    'a mente descreve a prisão como total e transforma limites reais em impossibilidade absoluta',
    'nomeia cada restrição, testa uma pequena margem de movimento e procura apoio onde a venda não consegue enxergar',
    'uma fresta de escolha aparece e desmonta a ideia de que nenhum gesto é possível',
    'a prisão mental perde poder quando o primeiro movimento prova que o círculo nunca esteve completamente fechado'
  ),
  'nove-de-espadas':minorCard(
    'A noite das nove lâminas',
    'uma pessoa desperta na cama enquanto nove espadas ocupam a parede e a noite transforma pensamento em perseguição',
    'culpa, medo e antecipação repetem a mesma cena até parecerem maiores do que o mundo desperto',
    'acende uma luz concreta, separa fato de catástrofe e divide o peso com uma presença segura',
    'o sofrimento deixa de crescer sozinho no escuro e encontra proporção, cuidado e linguagem',
    'pensamento noturno merece acolhimento, não autoridade automática sobre toda a realidade'
  ),
  'dez-de-espadas':minorCard(
    'A aurora depois das dez lâminas',
    'uma figura jaz sob dez espadas enquanto, atrás das montanhas, uma faixa dourada já rompe a noite',
    'o fim chegou com excesso e a mente insiste em narrá-lo como prova de que nada poderá recomeçar',
    'aceita que a antiga forma terminou, interrompe a repetição da ferida e volta o rosto para a primeira luz',
    'o ponto mais baixo encerra a queda e devolve ao horizonte a possibilidade de outro capítulo',
    'quando o fim já aconteceu, continuar atravessando a mesma lâmina apenas adia a aurora'
  ),
  'valete-de-espadas':minorCard(
    'A pergunta contra o vento',
    'uma figura jovem ergue a espada enquanto nuvens e árvores mostram que o vento muda depressa ao redor',
    'curiosidade afiada recolhe sinais, mas pode transformar vigilância em suspeita e palavra em reação',
    'investiga antes de concluir, faz a pergunta difícil e aprende a usar linguagem sem atacar por antecipação',
    'uma ideia nova testa o ambiente e revela informações antes escondidas',
    'inteligência desperta cresce quando prefere descobrir a parecer invencível'
  ),
  'cavaleiro-de-espadas':minorCard(
    'A carga sob o céu partido',
    'um cavaleiro avança com a espada erguida enquanto cavalo, nuvens e árvores parecem cortados pela mesma velocidade',
    'convicção pede ação imediata, mas pode atropelar contexto, corpo e pessoas antes de alcançar a verdade',
    'mantém a coragem, reduz a pressa e aponta a lâmina para o problema exato em vez de ferir todo o caminho',
    'a estagnação é rompida e a questão recebe uma resposta impossível de ignorar',
    'uma mente veloz se torna justa quando aprende que precisão vale mais do que impacto'
  ),
  'rainha-de-espadas':minorCard(
    'A mão aberta diante da espada',
    'uma rainha mantém a espada vertical e estende a outra mão, unindo discernimento rigoroso e disposição para escutar',
    'experiência ensinou a reconhecer engano, mas a defesa pode cortar também aquilo que chega com honestidade',
    'ouve sem ingenuidade, fala sem crueldade e estabelece o limite que preserva a própria dignidade',
    'a verdade encontra uma forma nítida que não precisa gritar para permanecer firme',
    'clareza madura não é ausência de sentimento; é amor que se recusa a colaborar com a mentira'
  ),
  'rei-de-espadas':minorCard(
    'O trono da palavra responsável',
    'um rei sustenta a espada erguida num trono de borboletas, julgando o território pela força do pensamento consciente',
    'autoridade intelectual pode organizar a verdade ou usar lógica para esconder interesse e distância humana',
    'examina evidências, declara critérios e aceita ser medido pela mesma regra que aplica aos outros',
    'a decisão ganha coerência pública e capacidade de orientar consequências reais',
    'razão se torna sabedoria quando poder, verdade e responsabilidade ocupam o mesmo trono'
  ),

  'as-de-ouros':minorCard(
    'A moeda acima do jardim',
    'uma mão oferece uma moeda dourada sobre um jardim cujo caminho atravessa o arco e segue até as montanhas',
    'a oportunidade é concreta, mas continuará símbolo se não receber tempo, corpo e cultivo',
    'aceita a semente material, verifica o terreno e cria uma rotina pequena que possa fazê-la crescer',
    'o possível encontra chão e começa a existir em recurso, trabalho, saúde ou sustento',
    'prosperidade entra pela porta que a prática consegue manter aberta'
  ),
  'dois-de-ouros':minorCard(
    'As moedas dentro do infinito',
    'uma figura movimenta duas moedas ligadas pelo infinito enquanto navios sobem e descem nas ondas ao fundo',
    'adaptação mantém tudo em movimento, mas equilíbrio permanente se torna impossível quando nada pode ser colocado no chão',
    'reorganiza prioridades, respeita o limite do corpo e escolhe o que precisa de ritmo diferente',
    'a oscilação deixa de ameaçar queda e vira uma dança administrável',
    'flexibilidade sustenta mudanças; excesso de malabarismo apenas adia uma escolha necessária'
  ),
  'tres-de-ouros':minorCard(
    'A obra sob as três moedas',
    'numa construção sagrada, artesão e planejadores observam juntos a obra marcada por três moedas',
    'talento isolado não completa uma estrutura que exige linguagem comum, escuta e padrão de qualidade',
    'mostra o trabalho, recebe conhecimento complementar e transforma contribuição em arquitetura compartilhada',
    'a habilidade ganha reconhecimento e a colaboração produz algo maior do que cada parte',
    'competência cresce quando encontra pessoas capazes de construir, avaliar e aprender juntas'
  ),
  'quatro-de-ouros':minorCard(
    'A cidade além das quatro moedas',
    'uma figura segura uma moeda junto ao peito, mantém duas sob os pés e leva outra sobre a cabeça diante da cidade distante',
    'proteger recursos oferece segurança, mas o medo de perder começa a impedir troca, movimento e pertencimento',
    'define o suficiente, preserva o essencial e libera aquilo que a retenção transformou em peso',
    'a matéria volta a servir à vida sem destruir a base construída',
    'possuir algo com firmeza não exige permitir que essa coisa possua todo o corpo'
  ),
  'cinco-de-ouros':minorCard(
    'A janela acesa na neve',
    'duas figuras atravessam a neve em dificuldade enquanto uma janela iluminada permanece próxima acima do caminho',
    'escassez e vergonha estreitam a visão até que pedir ajuda pareça mais doloroso do que continuar no frio',
    'reconhece a necessidade, procura a porta por trás da luz e permite que apoio material seja recebido sem humilhação',
    'o isolamento se rompe e um recurso antes invisível entra na travessia',
    'necessidade não diminui dignidade; muitas vezes ela apenas revela qual abrigo precisa ser encontrado'
  ),
  'seis-de-ouros':minorCard(
    'A balança sobre as moedas',
    'uma figura distribui moedas enquanto sustenta uma balança e duas pessoas recebem em posições diferentes',
    'generosidade pode restaurar equilíbrio ou criar dependência quando poder e condição permanecem escondidos',
    'torna a troca transparente, pergunta do que cada lado precisa e distribui recurso sem comprar silêncio',
    'dar e receber encontram proporção mais justa e fazem a matéria voltar a circular',
    'ajuda íntegra não transforma necessidade em dívida de submissão'
  ),
  'sete-de-ouros':minorCard(
    'A pausa diante da colheita',
    'uma figura apoia o corpo na ferramenta e observa sete moedas crescendo lentamente numa planta cultivada',
    'o tempo investido desperta a dúvida entre persistir, corrigir o método ou abandonar uma colheita ainda incompleta',
    'mede o que cresceu, compara esforço e retorno e ajusta o cultivo antes de oferecer mais tempo',
    'a espera deixa de ser passiva e se transforma em avaliação capaz de proteger o futuro',
    'paciência não é repetir para sempre; é dar ao processo o tempo que resultados reais conseguem justificar'
  ),
  'oito-de-ouros':minorCard(
    'A oficina das oito moedas',
    'um artesão grava moedas uma após outra na bancada, afastado da cidade para aperfeiçoar o próprio ofício',
    'repetição constrói excelência, mas pode esvaziar sentido quando produzir substitui aprender',
    'escolhe uma habilidade, observa cada detalhe e melhora o próximo trabalho a partir do anterior',
    'a prática acumula domínio visível e transforma esforço em capacidade confiável',
    'talento ganha permanência quando aceita a humildade de voltar à bancada'
  ),
  'nove-de-ouros':minorCard(
    'O falcão dentro do jardim',
    'uma figura caminha num jardim fértil com um falcão pousado na mão, cercada por frutos de trabalho cultivado',
    'autonomia conquistada oferece prazer, mas pode se fechar num jardim onde ninguém consegue entrar',
    'desfruta a própria obra, reconhece independência e escolhe companhia sem negociar a liberdade construída',
    'recurso, refinamento e segurança se tornam experiência vivida em vez de simples exibição',
    'abundância madura permite receber o mundo sem abandonar o território interior'
  ),
  'dez-de-ouros':minorCard(
    'A herança sob o arco',
    'gerações, animais e símbolos de dez moedas se encontram sob um arco onde riqueza, casa e memória atravessam o tempo',
    'legado oferece sustentação, mas repete desigualdades quando tradição vale mais do que a vida de quem a recebe',
    'nomeia o que merece continuar, organiza a transmissão e interrompe o padrão que não deve virar herança',
    'a matéria deixa de servir apenas ao presente e encontra continuidade entre gerações',
    'prosperidade completa inclui o tipo de mundo que os recursos ajudam a deixar depois de nós'
  ),
  'valete-de-ouros':minorCard(
    'A moeda estudada no campo',
    'uma figura jovem observa a moeda com atenção enquanto campos e montanhas aguardam trabalho paciente ao redor',
    'a oportunidade promete crescimento, mas exige aprendizado que entusiasmo sozinho não consegue substituir',
    'estuda o recurso, formula um plano simples e aceita começar como aprendiz da realidade',
    'uma possibilidade material ganha método e pode se transformar em habilidade, estudo ou trabalho',
    'o primeiro patrimônio é a atenção capaz de aprender a cuidar do que chegou'
  ),
  'cavaleiro-de-ouros':minorCard(
    'O cavalo parado diante do campo',
    'um cavaleiro mantém a moeda nas mãos enquanto seu cavalo permanece imóvel diante de campos que pedem continuidade',
    'prudência protege o resultado, mas pode usar preparação como desculpa para nunca atravessar o primeiro sulco',
    'confirma o método, assume uma cadência sustentável e cumpre o próximo passo sem buscar espetáculo',
    'a constância transforma promessa em obra confiável e lentamente acumulada',
    'o caminho mais firme raramente é o mais veloz, mas precisa continuar sendo caminho'
  ),
  'rainha-de-ouros':minorCard(
    'A moeda no jardim do corpo',
    'uma rainha acolhe a moeda no colo entre flores, frutos e um coelho que lembra a fertilidade do mundo vivo',
    'cuidar de tudo pode parecer amor enquanto corpo, prazer e necessidade própria ficam sem lugar no jardim',
    'organiza a matéria com ternura, recebe apoio e inclui o próprio corpo entre aquilo que merece prosperar',
    'o cuidado se torna abundância concreta sem exigir autoabandono',
    'nutrir a vida começa ao reconhecer que quem cuida também pertence ao jardim'
  ),
  'rei-de-ouros':minorCard(
    'O reino entre uvas e touros',
    'um rei ocupa um trono de touros cercado por uvas e segura a moeda como resultado de um território cultivado',
    'sucesso material pode sustentar muitas vidas ou se tornar prova rígida de valor, controle e superioridade',
    'administra recursos com visão longa, protege quem depende da estrutura e mede riqueza pelo que ela consegue sustentar',
    'a experiência transforma matéria em estabilidade, influência e legado responsável',
    'riqueza alcança domínio quando deixa de ser troféu e passa a construir segurança que não humilha'
  )
});

const RANK_ORDER = Object.freeze(['as', 'dois', 'tres', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'valete', 'cavaleiro', 'rainha', 'rei']);
const SUIT_ORDER = Object.freeze(['paus', 'copas', 'espadas', 'ouros']);

const LENSES = Object.freeze({
  love:Object.freeze({
    keywords:/\b(?:amor|amar|apaixonad[oa]|relacao|relacionamento|namoro|casamento|saudade|ex|romance|reciprocidade)\b/,
    context:['um vínculo importante chegou ao ponto em que sentimento e reciprocidade precisam se enxergar', 'uma aproximação carrega desejo verdadeiro, mas ainda precisa mostrar como existe em atitudes', 'o coração tenta compreender uma relação que já não cabe apenas em expectativa'],
    stakes:['preservar afeto sem abandonar verdade e dignidade', 'descobrir se duas liberdades conseguem construir presença', 'separar intensidade, promessa e gesto recíproco'],
    action:['uma conversa direta compara palavras com atitudes', 'um limite permite que o vínculo revele sua forma real', 'a pessoa observa o que volta sem fabricar respostas para o silêncio'],
    outcome:['a relação encontra uma forma compatível com o que realmente existe', 'o afeto permanece verdadeiro sem precisar sustentar uma espera infinita', 'reciprocidade ou ausência dela finalmente ganha contorno']
  }),
  work:Object.freeze({
    keywords:/\b(?:trabalho|emprego|carreira|dinheiro|projeto|negocio|cliente|profissao|estudo|criar|criatividade)\b/,
    context:['um projeto importante exige que desejo, recurso e execução parem de caminhar separados', 'a rotina de trabalho chegou ao limite entre segurança e crescimento', 'uma ideia procura espaço concreto dentro de prazos, corpo e responsabilidade'],
    stakes:['transformar energia em resultado sem usar o próprio corpo como combustível descartável', 'proteger sustento enquanto uma direção mais autoral ganha forma', 'distinguir movimento real de ocupação sem avanço'],
    action:['uma prioridade vira entrega verificável', 'recursos e prazos são reorganizados ao redor do essencial', 'a próxima etapa é reduzida ao tamanho que pode ser concluído'],
    outcome:['o trabalho encontra direção e uma medida capaz de continuar', 'a criação ganha forma sem depender de perfeição', 'resultado e sustentabilidade deixam de ser adversários']
  }),
  family:Object.freeze({
    keywords:/\b(?:familia|mae|pai|irma|irmao|filha|filho|casa|parente)\b/,
    context:['um vínculo familiar repete uma antiga forma de amor, silêncio e responsabilidade', 'a casa tenta preservar união sem reconhecer o peso distribuído de maneira desigual', 'uma relação de origem pede outra linguagem para continuar'],
    stakes:['pertencer sem desaparecer dentro do papel que os outros esperam', 'manter afeto e limite na mesma casa', 'honrar a história sem repetir tudo o que ela ensinou'],
    action:['um comportamento concreto recebe um limite concreto', 'ajuda passa a existir dentro de condições sustentáveis', 'a conversa deixa de julgar toda a família e nomeia o ponto que precisa mudar'],
    outcome:['o vínculo aprende uma forma nova ou revela a distância necessária', 'a culpa perde força quando cuidado deixa de exigir autoabandono', 'pertencimento e voz própria conseguem ocupar o mesmo espaço']
  }),
  change:Object.freeze({
    keywords:/\b(?:mudar|mudanca|recomeco|novo|partir|viagem|cidade|fase|futuro|terminar|fim)\b/,
    context:['um ciclo antigo já não consegue organizar a vida que deseja nascer', 'a mudança começou por dentro antes de encontrar uma forma visível', 'o futuro chama, mas ainda precisa de uma ponte construída no presente'],
    stakes:['avançar sem destruir aquilo que ainda oferece sustentação', 'deixar uma forma terminar sem confundir encerramento com fracasso', 'transformar desejo de recomeço em passagem possível'],
    action:['uma etapa recebe data, limite e primeiro gesto', 'o novo começa numa rotina praticável antes de ganhar um nome grandioso', 'a travessia preserva o necessário e solta o que já concluiu sua função'],
    outcome:['a mudança deixa de ser fantasia e encontra sequência', 'o passado vira experiência em vez de endereço obrigatório', 'o próximo ciclo nasce com espaço para correção e crescimento']
  }),
  self:Object.freeze({
    keywords:/\b(?:eu|alma|autoestima|valor|vergonha|culpa|cansad[oa]|exaust[oa]|ansiedade|medo|triste|sozinh[oa]|identidade)\b/,
    context:['uma parte íntima pede cuidado depois de sustentar mais do que conseguia nomear', 'a própria identidade foi confundida com um erro, uma rejeição ou uma fase difícil', 'corpo e mente pedem que a vida reduza o ruído antes de escolher direção'],
    stakes:['recuperar dignidade sem negar aquilo que precisa mudar', 'cuidar de si sem transformar pausa em culpa', 'distinguir a pessoa inteira da dor que ocupa este momento'],
    action:['o dia é reduzido ao essencial e uma necessidade recebe nome', 'responsabilidade é separada de humilhação', 'um compromisso pequeno consigo substitui uma acusação repetida'],
    outcome:['a experiência continua importante sem possuir a identidade inteira', 'o corpo recupera espaço para sentir e decidir', 'dignidade e transformação começam a caminhar juntas']
  }),
  decision:Object.freeze({
    keywords:/\b(?:decidir|decisao|escolher|escolha|duvida|caminho|opcao|confus[oa])\b/,
    context:['duas possibilidades disputam o futuro enquanto os fatos permanecem espalhados', 'uma decisão espera por certeza absoluta e, por isso, ainda não encontrou movimento', 'desejo e medo contam versões diferentes da mesma escolha'],
    stakes:['escolher com responsabilidade sem fingir controle sobre tudo', 'separar fato, hipótese e vontade', 'preservar a possibilidade de corrigir a rota sem abandonar a própria dignidade'],
    action:['os critérios são escritos antes da conclusão', 'um primeiro passo reversível testa a realidade', 'a pergunta perfeita é trocada por uma decisão possível e verificável'],
    outcome:['a incerteza continua existindo sem comandar todos os passos', 'o caminho ganha informação nova porque finalmente houve movimento', 'a escolha deixa de sustentar futuros incompatíveis ao mesmo tempo']
  })
});

const BEGINNING_FORMS = Object.freeze([
  'A carta “{card}” abre o capítulo: {scene}. Na vida ao redor, {context}.',
  'Sob “{card}”, {scene}. É nesse território que {context}.',
  'O primeiro quadro pertence a “{card}”: {scene}. Fora da imagem, {context}.',
  'Quando “{card}” ocupa a mesa, {scene}. A cena encontra a vida: {context}.',
  'A história atravessa “{card}” antes de ganhar palavras: {scene}. Ao mesmo tempo, {context}.',
  'Tudo começa dentro de “{card}”: {scene}. Do lado humano da carta, {context}.',
  '“{card}” acende a primeira cena: {scene}. Essa luz alcança um momento em que {context}.',
  'A mesa entrega “{card}” como origem: {scene}. O capítulo encontra a realidade: {context}.'
]);

const TENSION_FORMS = Object.freeze([
  'A própria carta aperta o conflito: {pressure}. O que está em jogo é {stakes}.',
  'Mas “{card}” não permite uma história fácil: {pressure}. Por isso, a tensão passa a ser {stakes}.',
  'O símbolo então mostra sua resistência: {pressure}. Nada avança sem enfrentar a necessidade de {stakes}.',
  'A cena muda quando a força de “{card}” encontra seu limite: {pressure}. O capítulo precisa {stakes}.',
  'Dentro da mesma carta nasce o obstáculo: {pressure}. A vida pede agora {stakes}.',
  '“{card}” sustenta duas verdades ao mesmo tempo: {pressure}. Entre elas, torna-se necessário {stakes}.',
  'O movimento encontra uma porta fechada: {pressure}. A chave está em {stakes}.',
  'A carta recusa qualquer atalho: {pressure}. O conflito só amadurece ao {stakes}.'
]);

const ACTION_FORMS = Object.freeze([
  'A virada também pertence a “{card}”: {gesture}. No lado humano da cena, {action}.',
  'O capítulo muda quando a carta executa seu gesto: {gesture}. Na vida concreta, {action}.',
  'Em vez de fugir da tensão, “{card}” responde: {gesture}. Em resposta, {action}.',
  'A força da carta deixa de ser imagem e vira movimento: {gesture}. A partir disso, {action}.',
  'A escolha nasce da própria carta: {gesture}. A partir dali, {action}.',
  '“{card}” não oferece uma sentença; oferece um gesto: {gesture}. Esse gesto ganha chão: {action}.',
  'A história encontra direção dentro da carta: {gesture}. O próximo ato coloca a vida em movimento: {action}.',
  'O ponto de mudança surge sem abandonar “{card}”: {gesture}. No mundo vivido, {action}.'
]);

const OUTCOME_FORMS = Object.freeze([
  'Depois desse movimento, {consequence}. Assim, {outcome}.',
  'A consequência conserva a assinatura da carta: {consequence}. Na vida, {outcome}.',
  'O gesto altera toda a paisagem: {consequence}. O efeito humano aparece quando {outcome}.',
  'Nada termina no mesmo lugar, porque {consequence}. A partir daí, {outcome}.',
  'A realidade responde ao movimento de “{card}”: {consequence}. Por isso, {outcome}.',
  'O capítulo encontra resultado sem abandonar sua origem: {consequence}. Com isso, {outcome}.',
  'A carta completa a transformação iniciada na primeira cena: {consequence}. Então, {outcome}.',
  'O que era tensão encontra forma: {consequence}. O novo estado aparece assim: {outcome}.'
]);

const ENDING_FORMS = Object.freeze([
  'A última verdade continua dentro de “{card}”: {truth}.',
  'Por isso, a história termina onde a carta permanece viva: {truth}.',
  'O capítulo se fecha sem sair do Tarot: {truth}.',
  'A carta recolhe a cena e deixa uma verdade inteira: {truth}.',
  'Nenhuma frase precisa abandonar “{card}” para concluir: {truth}.',
  'O desfecho devolve a palavra à própria carta: {truth}.',
  'No fim, o mesmo símbolo que abriu a história revela sua lei: {truth}.',
  'A narrativa chega à última linha ainda governada por “{card}”: {truth}.'
]);

const SUBJECTS = Object.freeze([
  'quem atravessa esta história', 'a pessoa no centro da cena', 'quem sustenta a pergunta',
  'a presença diante da carta', 'quem chegou até esta mesa', 'a vida que recebe o símbolo'
]);

const ELEMENT_NAMES = Object.freeze({ fire:'fogo', water:'água', air:'ar', earth:'terra', spirit:'espírito' });

function includesAlias(text, alias) {
  const safeAlias = normalize(alias);
  return text === safeAlias || text.startsWith(`${safeAlias} `) || text.endsWith(` ${safeAlias}`) || text.includes(` ${safeAlias} `);
}

function majorFrom(card) {
  const identity = normalize(`${card?.name || ''} ${card?.canonicalId || ''}`);
  for (const [key, value] of Object.entries(ARCANA)) {
    if (value.aliases.some(alias => includesAlias(identity, alias))) return { key, value };
  }
  const id = Number(card?.id);
  if (Number.isInteger(id) && id >= 0 && id < MAJOR_ORDER.length) {
    const key = MAJOR_ORDER[id];
    return { key, value:ARCANA[key] };
  }
  return null;
}

function minorFrom(card) {
  const identity = normalize(`${card?.name || ''} ${card?.canonicalId || ''}`);
  let suitKey = SUIT_ORDER.find(key => SUITS[key].aliases.some(alias => includesAlias(identity, alias)));
  let rankKey = RANK_ORDER.find(key => RANKS[key].aliases.some(alias => includesAlias(identity, alias)));
  const id = Number(card?.id);
  if ((!suitKey || !rankKey) && Number.isInteger(id) && id >= 22 && id < 78) {
    const offset = id - 22;
    suitKey ||= SUIT_ORDER[Math.floor(offset / 14)];
    rankKey ||= RANK_ORDER[offset % 14];
  }
  if (!suitKey || !rankKey) return null;
  return { suitKey, suit:SUITS[suitKey], rankKey, rank:RANKS[rankKey] };
}

function cardName(card) {
  return clean(card?.name, 100) || 'Carta do Tarot';
}

export function tarotIdentity(card) {
  const major = majorFrom(card);
  if (major) return Object.freeze({
    source:'major', key:major.key, arcana:'major', title:major.value.title,
    element:major.value.element, defaultLens:major.value.defaultLens,
    scene:major.value.scene, pressure:major.value.pressure, gesture:major.value.gesture,
    consequence:major.value.consequence, truth:major.value.truth
  });

  const minor = minorFrom(card);
  if (minor) {
    const key = `${minor.rankKey}-de-${minor.suitKey}`;
    const exact = MINOR_ARCANA[key];
    return Object.freeze({
      source:'minor', key, arcana:'minor', suit:minor.suitKey, rank:minor.rankKey,
      title:exact?.title || `${minor.rank.title} de ${minor.suit.title}`,
      element:minor.suit.element, defaultLens:minor.suit.defaultLens,
      scene:exact?.scene || `${minor.rank.stage}; no território de ${minor.suit.title}, ${minor.suit.landscape}`,
      pressure:exact?.pressure || `${minor.suit.pressure}; ${minor.rank.pressure}`,
      gesture:exact?.gesture || `${minor.rank.gesture} e ${minor.suit.gesture}`,
      consequence:exact?.consequence || `${minor.rank.consequence}; ${minor.suit.consequence}`,
      truth:exact?.truth || `${minor.suit.truth}; ${minor.rank.truth}`
    });
  }

  const fallback = ARCANA.estrela;
  return Object.freeze({
    source:'fallback-tarot', key:'estrela', arcana:'major', title:fallback.title,
    element:fallback.element, defaultLens:fallback.defaultLens,
    scene:fallback.scene, pressure:fallback.pressure, gesture:fallback.gesture,
    consequence:fallback.consequence, truth:fallback.truth
  });
}

function lensFor(intention, defaultLens = 'decision') {
  const text = normalize(intention);
  const explicit = Object.entries(LENSES).find(([, lens]) => lens.keywords.test(text));
  const key = explicit?.[0] || (LENSES[defaultLens] ? defaultLens : 'decision');
  return { key, value:LENSES[key] };
}

function preferredSubject(preferredName, seed) {
  const name = normalizePreferredName(preferredName).split(' ')[0];
  return name || choose(SUBJECTS, seed, 'subject');
}

function explicitContext(intention) {
  const raw = clean(intention, 180).replace(/\s+/g, ' ').replace(/[.!?…]+$/u, '');
  return normalize(raw).split(' ').filter(Boolean).length >= 4
    ? `a situação chega à mesa com estas palavras: “${raw}”`
    : '';
}

function fill(form, tokens) {
  return form.replace(/\{(\w+)\}/g, (_, key) => tokens[key] || '');
}

function cardIdentity(card) {
  return `${card?.canonicalId ?? card?.id ?? 'carta'}:${cardName(card)}`;
}

function signature(seed, key) {
  return mix(seed, key).toString(36).toUpperCase().padStart(8, '0');
}

function storyTokens(card, seed, intention, preferredName) {
  const tarot = tarotIdentity(card);
  const lens = lensFor(intention, tarot.defaultLens);
  const anchoredContext = explicitContext(intention);
  return Object.freeze({
    card:cardName(card),
    scene:tarot.scene,
    pressure:tarot.pressure,
    gesture:tarot.gesture,
    consequence:tarot.consequence,
    truth:tarot.truth,
    context:anchoredContext || choose(lens.value.context, seed, 'lens-context'),
    stakes:choose(lens.value.stakes, seed, 'lens-stakes'),
    action:choose(lens.value.action, seed, 'lens-action'),
    outcome:choose(lens.value.outcome, seed, 'lens-outcome'),
    subject:preferredSubject(preferredName, seed),
    tarot,
    lens:lens.key
  });
}

export function storyForCard(card, seed = secureLoveSeed(), {
  scope = 'carta', moment = 'agora', intention = '', preferredName = ''
} = {}) {
  const safeSeed = `${seed}:${cardIdentity(card)}:${scope}:${moment}`;
  const tokens = storyTokens(card, safeSeed, intention, preferredName);
  const heartline = sentence(fill(choose(BEGINNING_FORMS, safeSeed, 'beginning'), tokens));
  const whisper = sentence(fill(choose(TENSION_FORMS, safeSeed, 'tension'), tokens));
  const paragraphs = Object.freeze([
    sentence(fill(choose(ACTION_FORMS, safeSeed, 'action'), tokens)),
    sentence(fill(choose(OUTCOME_FORMS, safeSeed, 'outcome'), tokens)),
    sentence(fill(choose(ENDING_FORMS, safeSeed, 'ending'), tokens))
  ]);
  return Object.freeze({
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'FICÇÃO NASCIDA DESTA CARTA',
    title:`${cardName(card)} · ${tokens.tarot.title}`,
    heartline,
    whisper,
    paragraphs,
    story:paragraphs.join('\n\n'),
    closing:`A carta “${cardName(card)}” criou o capítulo inteiro; a decisão continua humana.`,
    signature:signature(safeSeed, 'tarot-story'),
    tarotBasis:Object.freeze({
      card:cardName(card), source:tokens.tarot.source, key:tokens.tarot.key,
      arcana:tokens.tarot.arcana, suit:tokens.tarot.suit || '', rank:tokens.tarot.rank || '',
      element:tokens.tarot.element, lens:tokens.lens
    }),
    cohesion:Object.freeze({ beginning:true, tension:true, choice:true, consequence:true, ending:true, tarot:true })
  });
}

function relationBetween(previous, current, previousName, currentName) {
  const previousElement = ELEMENT_NAMES[previous.element] || 'mistério';
  const currentElement = ELEMENT_NAMES[current.element] || 'mistério';
  if (previous.element === current.element) {
    return `o ${currentElement} de “${currentName}” aprofunda o ${previousElement} iniciado por “${previousName}”`;
  }
  if (current.element === 'spirit') {
    return `o espírito de “${currentName}” muda o ciclo que “${previousName}” havia colocado em movimento`;
  }
  if (previous.element === 'spirit') {
    return `o ${currentElement} de “${currentName}” dá forma ao giro deixado por “${previousName}”`;
  }
  const encounters = Object.freeze({
    'fire>air':'o ar encontra direção para o fogo', 'air>fire':'o fogo dá consequência ao pensamento',
    'fire>water':'a água mede a temperatura do impulso', 'water>fire':'o fogo devolve movimento ao sentimento',
    'fire>earth':'a terra obriga a chama a construir', 'earth>fire':'o fogo retira a matéria da imobilidade',
    'water>air':'o ar dá nome ao que a água sentia', 'air>water':'a água devolve profundidade ao pensamento',
    'water>earth':'a terra oferece recipiente ao afeto', 'earth>water':'a água faz a matéria voltar a circular',
    'air>earth':'a terra confronta a ideia com os fatos', 'earth>air':'o ar abre possibilidade dentro da estrutura'
  });
  const key = `${previous.element}>${current.element}`;
  return `${encounters[key] || `o ${currentElement} responde ao ${previousElement}`} quando “${currentName}” recebe o capítulo de “${previousName}”`;
}

function representativeIndices(length) {
  if (length <= 5) return Array.from({ length }, (_, index) => index);
  return [...new Set([0, Math.round((length - 1) * .25), Math.round((length - 1) * .5), Math.round((length - 1) * .75), length - 1])];
}

export function storyConversation(cards = [], positions = [], seed = secureLoveSeed(), intention = '', preferredName = '') {
  const validCards = (Array.isArray(cards) ? cards : []).filter(Boolean);
  if (!validCards.length) return null;
  if (validCards.length === 1) {
    const single = storyForCard(validCards[0], seed, {
      scope:'tiragem', moment:clean(positions[0], 100) || 'posição 1', intention, preferredName
    });
    return Object.freeze({
      ...single,
      label:'UMA CARTA · UMA HISTÓRIA INTEIRA',
      lead:single.heartline,
      voices:Object.freeze([`Capítulo 1 · ${clean(positions[0], 100) || 'Posição 1'} · “${cardName(validCards[0])}”: ${single.whisper}`])
    });
  }

  const safeSeed = `${seed}:${validCards.map(cardIdentity).join('→')}:tarot-conversation`;
  const identities = validCards.map(tarotIdentity);
  const positionAt = index => clean(positions[index], 100) || `posição ${index + 1}`;
  const first = validCards[0];
  const firstIdentity = identities[0];
  const lastIndex = validCards.length - 1;
  const last = validCards[lastIndex];
  const lastIdentity = identities[lastIndex];
  const elementPath = identities.map(identity => ELEMENT_NAMES[identity.element] || 'mistério').join(' → ');
  const lead = `Em ${positionAt(0)}, “${cardName(first)}” abre a história: ${sentence(firstIdentity.scene)} ${sentence(firstIdentity.pressure)}`;

  const selected = representativeIndices(validCards.length);
  const transitionParagraphs = selected.slice(1).map(index => {
    const previousIndex = selected[selected.indexOf(index) - 1];
    const relation = relationBetween(
      identities[previousIndex], identities[index], cardName(validCards[previousIndex]), cardName(validCards[index])
    );
    return `Em ${positionAt(index)}, ${relation}. ${sentence(identities[index].scene)} ${sentence(identities[index].gesture)}`;
  });
  const pivotIndex = Math.floor(lastIndex / 2);
  const pivot = validCards[pivotIndex];
  const pivotIdentity = identities[pivotIndex];
  const synthesis = `O eixo da conversa permanece em “${cardName(pivot)}”, na posição ${positionAt(pivotIndex)}: ${sentence(pivotIdentity.pressure)} A resposta da própria carta é direta: ${sentence(pivotIdentity.gesture)}`;
  const ending = `A última consequência pertence a “${cardName(last)}”: ${sentence(lastIdentity.consequence)} A sequência inteira — ${elementPath} — termina com a verdade desta carta: ${sentence(lastIdentity.truth)}`;
  const storyParts = [synthesis, ...transitionParagraphs, ending];

  const voices = Object.freeze(validCards.map((card, index) => {
    const identity = identities[index];
    if (index === 0) return `Capítulo 1 · ${positionAt(index)} · “${cardName(card)}”: ${sentence(identity.scene)} ${sentence(identity.pressure)}`;
    const relation = relationBetween(identities[index - 1], identity, cardName(validCards[index - 1]), cardName(card));
    return `Capítulo ${index + 1} · ${positionAt(index)} · “${cardName(card)}”: ${sentence(relation)} ${sentence(identity.gesture)} ${sentence(identity.consequence)}`;
  }));

  return Object.freeze({
    engine:STORY_ENGINE_NAME,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    label:'AS CARTAS CONVERSAM · SEQUÊNCIA DO TAROT',
    title:`${cardName(first)} encontra ${cardName(last)}`,
    heartline:`A história nasce somente desta sequência: ${validCards.map(card => `“${cardName(card)}”`).join(' → ')}.`,
    lead,
    story:storyParts.join('\n\n'),
    voices,
    closing:`“${cardName(last)}” recebe tudo o que as cartas anteriores moveram e encerra este capítulo sem transformar a tiragem em destino.`,
    signature:signature(safeSeed, 'tarot-spread-story'),
    tarotBasis:Object.freeze({
      cards:Object.freeze(validCards.map((card, index) => Object.freeze({
        card:cardName(card), key:identities[index].key, source:identities[index].source,
        element:identities[index].element, position:positionAt(index)
      }))),
      elementPath
    }),
    cohesion:Object.freeze({ beginning:true, tension:true, choice:true, consequence:true, ending:true, tarot:true })
  });
}

function findMentionedCard(input, cards) {
  const text = ` ${normalize(input)} `;
  const candidates = cards.map(card => {
    const full = normalize(cardName(card));
    const withoutArticle = full.replace(/^(?:a|o|as|os)\s+/, '');
    return { card, terms:[full, withoutArticle].filter(term => term.length >= 3) };
  }).sort((a, b) => Math.max(...b.terms.map(term => term.length)) - Math.max(...a.terms.map(term => term.length)));
  return candidates.find(candidate => candidate.terms.some(term => text.includes(` ${term} `)))?.card || null;
}

function chooseTarotCard(input, cards, seed) {
  const available = (Array.isArray(cards) ? cards : []).filter(card => card && cardName(card));
  if (!available.length) return Object.freeze({ id:17, canonicalId:'a-estrela', name:'A Estrela' });
  return findMentionedCard(input, available) || available[mix(seed, normalize(input), 'tarot-card') % available.length];
}

export function storyResponse(input, {
  seed = secureLoveSeed(), preferredName = '', cards = [], ...matterOptions
} = {}) {
  const raw = clean(input, 700);
  const base = matterResponse(raw, { ...matterOptions, cards, preferredName, seed:`${seed}:materia` });
  const safeSeed = `${seed}:${normalize(raw)}:${base.intent || 'support'}`;

  if (base.safety) return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyTitle:'Segurança antes de qualquer leitura',
    storySignature:signature(safeSeed, 'safety'),
    storyCohesion:true,
    tarotGrounded:true
  });

  if (base.matterQuery) {
    const text = `A pergunta “${base.matterQuery}” pede fatos atuais, não uma invenção apresentada como verdade. Whit mantém o Tarot no território simbólico e deixa abaixo somente fontes públicas que você pode escolher abrir.\n\nNenhuma carta será usada para fabricar informações sobre uma pessoa real. A ficção pertence ao Tarot; fatos pertencem a fontes verificáveis.`;
    return Object.freeze({
      ...base,
      engine:`${base.engine}+${STORY_ENGINE_NAME}`,
      version:STORY_ENGINE_VERSION,
      storyEngine:STORY_ENGINE_NAME,
      storyTitle:'Fatos não são ficção do Tarot',
      storySignature:signature(safeSeed, 'research'),
      storyCohesion:true,
      tarotGrounded:true,
      execution:null,
      actions:Object.freeze(base.actions.filter(action => action.kind === 'research')),
      spiritVoices:Object.freeze([]), spiritSynthesis:'', spiritBlessing:'', text
    });
  }

  const card = chooseTarotCard(raw, cards, safeSeed);
  const creation = storyForCard(card, safeSeed, {
    scope:'whit', moment:'conversa', intention:raw, preferredName
  });
  const text = [creation.heartline, creation.whisper, ...creation.paragraphs, creation.closing].join('\n\n');
  return Object.freeze({
    ...base,
    engine:`${base.engine}+${STORY_ENGINE_NAME}`,
    version:STORY_ENGINE_VERSION,
    storyEngine:STORY_ENGINE_NAME,
    storyTitle:creation.title,
    storySignature:creation.signature,
    storyCohesion:true,
    tarotGrounded:true,
    storyCard:Object.freeze({ id:card?.id ?? '', canonicalId:card?.canonicalId ?? '', name:cardName(card) }),
    tarotBasis:creation.tarotBasis,
    spiritVoices:Object.freeze([]), spiritSynthesis:'', spiritBlessing:'', text
  });
}

export function storyCapacity() {
  const structuralCombinations = 78 * Object.keys(LENSES).length * (8 ** 5) * 78;
  return Object.freeze({
    cards:78,
    majorArcana:Object.keys(ARCANA).length,
    minorArcana:Object.keys(SUITS).length * Object.keys(RANKS).length,
    structuralCombinations,
    exceedsOneBillion:structuralCombinations > 1_000_000_000,
    rule:'todas as combinações continuam subordinadas às cartas'
  });
}
