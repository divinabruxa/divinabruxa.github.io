/** Whit Alma Divina · base editorial nova · 1.0.0. Não altera a interface. */
import { CARDS } from './data/cards.js';
export const WHIT_BASE_VERSION = '1.0.0';
export const SYMBOLIC_NOTICE = 'Uma história simbólica criada a partir do Tarot para inspirar reflexão. Não revela fatos privados nem garante acontecimentos.';
const deepFreeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze); Object.freeze(value);
  }
  return value;
};
const EDITORIAL = [
  {
    "name": "O Louco",
    "scene": "Um caminho começa antes que exista um mapa completo",
    "strength": "curiosidade e abertura",
    "tension": "confundir liberdade com ausência de cuidado",
    "action": "Experimente um passo pequeno e confira o terreno",
    "symbol": "a travessia do desconhecido",
    "themes": [
      "inicio",
      "movimento"
    ]
  },
  {
    "name": "O Mago",
    "scene": "Recursos dispersos podem ganhar uma intenção comum",
    "strength": "iniciativa e habilidade",
    "tension": "usar palavras para esconder a falta de ação",
    "action": "Escolha um recurso disponível e coloque-o em prática",
    "symbol": "a vontade que encontra forma",
    "themes": [
      "inicio",
      "acao"
    ]
  },
  {
    "name": "A Sacerdotisa",
    "scene": "Algo pede escuta antes de ganhar uma explicação",
    "strength": "observação e reserva",
    "tension": "tomar silêncio por confirmação do que se deseja",
    "action": "Observe o que ainda não está claro sem preencher lacunas",
    "symbol": "o mistério que amadurece em silêncio",
    "themes": [
      "interior",
      "incerteza"
    ]
  },
  {
    "name": "A Imperatriz",
    "scene": "O que recebe cuidado encontra espaço para crescer",
    "strength": "criação e nutrição",
    "tension": "cuidar de tudo e esquecer as próprias necessidades",
    "action": "Dê tempo e condições reais ao que deseja cultivar",
    "symbol": "a vida que floresce quando é nutrida",
    "themes": [
      "cuidado",
      "crescimento"
    ]
  },
  {
    "name": "O Imperador",
    "scene": "Uma estrutura pode proteger aquilo que precisa durar",
    "strength": "limites e responsabilidade",
    "tension": "transformar organização em controle rígido",
    "action": "Estabeleça um acordo claro sem tentar controlar cada detalhe",
    "symbol": "a construção de um chão firme",
    "themes": [
      "estrutura",
      "limite"
    ]
  },
  {
    "name": "O Hierofante",
    "scene": "Uma tradição oferece linguagem para uma busca de sentido",
    "strength": "aprendizado e pertencimento",
    "tension": "obedecer a uma regra que já não corresponde aos seus valores",
    "action": "Examine o que recebeu e escolha o que faz sentido manter",
    "symbol": "o encontro entre herança e convicção",
    "themes": [
      "sentido",
      "estrutura"
    ]
  },
  {
    "name": "Os Enamorados",
    "scene": "Um encontro ou uma escolha expõe valores importantes",
    "strength": "afinidade e compromisso",
    "tension": "desejar união sem reconhecer diferenças",
    "action": "Nomeie o que considera essencial antes de assumir um compromisso",
    "symbol": "a união que exige presença de duas partes",
    "themes": [
      "vinculo",
      "decisao"
    ]
  },
  {
    "name": "O Carro",
    "scene": "Forças diferentes precisam encontrar uma direção comum",
    "strength": "determinação e movimento",
    "tension": "avançar para fugir de uma tensão que segue junto",
    "action": "Defina uma direção e ajuste o ritmo ao que consegue sustentar",
    "symbol": "o movimento guiado por intenção",
    "themes": [
      "movimento",
      "acao"
    ]
  },
  {
    "name": "A Força",
    "scene": "Uma intensidade pode ser acolhida sem dominar a situação",
    "strength": "coragem serena",
    "tension": "confundir firmeza com repressão ou imposição",
    "action": "Expresse um limite com calma e mantenha-o nas atitudes",
    "symbol": "o encontro entre instinto e cuidado",
    "themes": [
      "limite",
      "cuidado"
    ]
  },
  {
    "name": "O Eremita",
    "scene": "A distância do ruído ajuda a reconhecer uma pergunta própria",
    "strength": "discernimento e recolhimento",
    "tension": "transformar reflexão em isolamento sem retorno",
    "action": "Reserve um tempo de silêncio e depois retome uma conversa útil",
    "symbol": "a luz pequena que orienta uma busca interior",
    "themes": [
      "interior",
      "sentido"
    ]
  },
  {
    "name": "A Roda da Fortuna",
    "scene": "Uma mudança de circunstância convida a rever a posição ocupada",
    "strength": "adaptação e percepção de ciclos",
    "tension": "esperar controlar o que depende de muitos fatores",
    "action": "Distinga o que pode ajustar do que precisa acompanhar",
    "symbol": "o ciclo que muda sem pedir autorização",
    "themes": [
      "mudanca",
      "incerteza"
    ]
  },
  {
    "name": "A Justiça",
    "scene": "Uma decisão exige proporção entre palavra e consequência",
    "strength": "clareza e responsabilidade",
    "tension": "confundir julgamento rápido com avaliação justa",
    "action": "Reúna fatos e explicite os critérios da decisão",
    "symbol": "o equilíbrio entre intenção e consequência",
    "themes": [
      "verdade",
      "decisao"
    ]
  },
  {
    "name": "O Pendurado",
    "scene": "Uma pausa modifica a forma de enxergar uma situação",
    "strength": "mudança de perspectiva",
    "tension": "usar a espera para adiar indefinidamente uma escolha",
    "action": "Mude o ponto de observação e marque uma hora para reavaliar",
    "symbol": "a suspensão que permite outro olhar",
    "themes": [
      "pausa",
      "interior"
    ]
  },
  {
    "name": "A Morte",
    "scene": "Uma forma antiga perde espaço para uma passagem necessária",
    "strength": "encerramento e transformação",
    "tension": "insistir numa continuidade que já não se sustenta",
    "action": "Reconheça o que terminou e preserve o que pode seguir de outro modo",
    "symbol": "a passagem entre fim e renovação",
    "themes": [
      "fim",
      "mudanca"
    ]
  },
  {
    "name": "A Temperança",
    "scene": "Partes diferentes encontram um ritmo quando podem se ajustar",
    "strength": "integração e medida",
    "tension": "chamar de equilíbrio uma acomodação que apaga diferenças",
    "action": "Faça um ajuste viável e observe seu efeito antes do próximo",
    "symbol": "a mistura paciente que cria outra possibilidade",
    "themes": [
      "equilibrio",
      "cuidado"
    ]
  },
  {
    "name": "O Diabo",
    "scene": "Um desejo ou apego mostra o preço de sua repetição",
    "strength": "reconhecimento de padrões",
    "tension": "confundir intensidade com vínculo saudável",
    "action": "Identifique o custo de um hábito e reduza uma dependência concreta",
    "symbol": "a corrente que precisa ser vista para ser questionada",
    "themes": [
      "apego",
      "limite"
    ]
  },
  {
    "name": "A Torre",
    "scene": "Uma estrutura encontra um limite que já não consegue esconder",
    "strength": "revelação e reorganização",
    "tension": "negar sinais de desgaste ou provocar ruptura sem cuidado",
    "action": "Proteja o essencial e reveja a base que deixou de funcionar",
    "symbol": "a queda de uma forma que parecia incontestável",
    "themes": [
      "ruptura",
      "verdade"
    ]
  },
  {
    "name": "A Estrela",
    "scene": "Depois de um desgaste, uma esperança pode voltar a ter espaço",
    "strength": "renovação e confiança gradual",
    "tension": "usar a esperança para não olhar a realidade",
    "action": "Retome um cuidado simples que torne a esperança praticável",
    "symbol": "a luz que permanece depois da noite",
    "themes": [
      "esperanca",
      "cuidado"
    ]
  },
  {
    "name": "A Lua",
    "scene": "Uma percepção intensa convive com informações incompletas",
    "strength": "imaginação e sensibilidade",
    "tension": "tratar medo ou intuição como prova",
    "action": "Confira uma informação antes de concluir o que ela significa",
    "symbol": "a passagem por imagens que ainda não ganharam nitidez",
    "themes": [
      "incerteza",
      "interior"
    ]
  },
  {
    "name": "O Sol",
    "scene": "Uma experiência ganha clareza e espaço para ser compartilhada",
    "strength": "vitalidade e transparência",
    "tension": "supor que entusiasmo resolve toda dificuldade",
    "action": "Diga com simplicidade o que ficou claro e celebre um avanço real",
    "symbol": "a luz que torna visível o que pode ser vivido",
    "themes": [
      "clareza",
      "alegria"
    ]
  },
  {
    "name": "O Julgamento",
    "scene": "Uma revisão permite responder de outro modo ao que retorna",
    "strength": "reconhecimento e renovação",
    "tension": "transformar revisão em culpa interminável",
    "action": "Reconheça uma consequência e escolha uma reparação possível",
    "symbol": "o chamado para responder com mais consciência",
    "themes": [
      "renovacao",
      "verdade"
    ]
  },
  {
    "name": "O Mundo",
    "scene": "Um ciclo reúne aprendizagens antes de abrir outra etapa",
    "strength": "integração e conclusão",
    "tension": "continuar buscando um fechamento perfeito que nunca chega",
    "action": "Reconheça o que foi concluído e decida o que levar adiante",
    "symbol": "a totalidade provisória de uma travessia",
    "themes": [
      "conclusao",
      "equilibrio"
    ]
  },
  {
    "name": "Ás de Copas",
    "scene": "Um sentimento encontra uma primeira abertura",
    "strength": "disponibilidade afetiva",
    "tension": "esperar que uma emoção nova responda a tudo",
    "action": "Dê uma expressão simples ao que sente sem exigir resposta imediata",
    "symbol": "a fonte que começa a transbordar",
    "themes": [
      "inicio",
      "vinculo"
    ]
  },
  {
    "name": "2 de Copas",
    "scene": "Um vínculo pede encontro e reconhecimento mútuo",
    "strength": "reciprocidade",
    "tension": "confundir desejo de união com reciprocidade comprovada",
    "action": "Observe se palavras e atitudes permitem um acordo entre duas partes",
    "symbol": "o espelho do encontro",
    "themes": [
      "vinculo",
      "equilibrio"
    ]
  },
  {
    "name": "3 de Copas",
    "scene": "Uma alegria encontra força quando pode ser partilhada",
    "strength": "amizade e comunidade",
    "tension": "depender da aprovação do grupo para sentir pertencimento",
    "action": "Procure uma companhia com quem possa partilhar algo verdadeiro",
    "symbol": "o círculo que acolhe a celebração",
    "themes": [
      "vinculo",
      "alegria"
    ]
  },
  {
    "name": "4 de Copas",
    "scene": "Uma oferta convive com cansaço ou pouca disponibilidade para recebê-la",
    "strength": "reavaliação emocional",
    "tension": "rejeitar por hábito ou aceitar sem vontade",
    "action": "Reconheça o que falta antes de decidir sobre uma oferta",
    "symbol": "a pausa diante do que chega",
    "themes": [
      "pausa",
      "interior"
    ]
  },
  {
    "name": "5 de Copas",
    "scene": "Uma perda ocupa o olhar enquanto algo ainda permanece",
    "strength": "reconhecimento da tristeza",
    "tension": "reduzir toda a experiência ao que não deu certo",
    "action": "Dê espaço à perda e identifique um apoio que continua presente",
    "symbol": "o luto simbólico e a margem que resta",
    "themes": [
      "perda",
      "cuidado"
    ]
  },
  {
    "name": "6 de Copas",
    "scene": "Uma lembrança traz afeto e pede um lugar no presente",
    "strength": "memória e ternura",
    "tension": "confundir uma lembrança bonita com o que existe hoje",
    "action": "Acolha a memória e confira o que ainda faz sentido agora",
    "symbol": "a visita ao jardim da memória",
    "themes": [
      "memoria",
      "vinculo"
    ]
  },
  {
    "name": "7 de Copas",
    "scene": "Muitas imagens disputam a atenção antes de uma escolha",
    "strength": "imaginação e possibilidades",
    "tension": "investir numa fantasia sem examinar sua viabilidade",
    "action": "Escolha uma possibilidade e verifique o primeiro requisito real",
    "symbol": "as imagens que pedem discernimento",
    "themes": [
      "incerteza",
      "decisao"
    ]
  },
  {
    "name": "8 de Copas",
    "scene": "Uma busca de sentido começa quando algo deixa de preencher",
    "strength": "desapego e honestidade emocional",
    "tension": "sair sem reconhecer o que precisa ser concluído",
    "action": "Nomeie o que já não basta e organize uma transição cuidadosa",
    "symbol": "a partida em busca de outro sentido",
    "themes": [
      "fim",
      "movimento"
    ]
  },
  {
    "name": "9 de Copas",
    "scene": "Um desejo atendido convida a perceber o que traz satisfação",
    "strength": "contentamento",
    "tension": "tomar satisfação momentânea por plenitude permanente",
    "action": "Desfrute uma conquista sem exigir que ela resolva toda a vida",
    "symbol": "a taça que recebe gratidão",
    "themes": [
      "alegria",
      "desejo"
    ]
  },
  {
    "name": "10 de Copas",
    "scene": "Uma imagem de convivência revela o valor de construir pertencimento",
    "strength": "harmonia compartilhada",
    "tension": "usar um ideal de felicidade para esconder diferenças",
    "action": "Converse sobre o que faz cada pessoa se sentir incluída",
    "symbol": "o horizonte de uma casa compartilhada",
    "themes": [
      "vinculo",
      "equilibrio"
    ]
  },
  {
    "name": "Pajem de Copas",
    "scene": "Uma sensibilidade nova procura uma forma de expressão",
    "strength": "curiosidade afetiva",
    "tension": "transformar uma impressão delicada numa certeza sobre alguém",
    "action": "Expresse algo com gentileza e permita espaço para resposta",
    "symbol": "o primeiro gesto de uma escuta sensível",
    "themes": [
      "inicio",
      "cuidado"
    ]
  },
  {
    "name": "Cavaleiro de Copas",
    "scene": "Um impulso afetivo procura aproximar sentimento e gesto",
    "strength": "expressão e convite",
    "tension": "prometer mais do que consegue sustentar",
    "action": "Faça um convite claro e acompanhe-o com uma atitude consistente",
    "symbol": "a busca que leva uma oferta",
    "themes": [
      "movimento",
      "vinculo"
    ]
  },
  {
    "name": "Rainha de Copas",
    "scene": "Uma escuta profunda precisa também proteger seus limites",
    "strength": "empatia e percepção emocional",
    "tension": "absorver tudo como se fosse responsabilidade própria",
    "action": "Escute sem abandonar as suas necessidades",
    "symbol": "a água que acolhe sem perder suas margens",
    "themes": [
      "cuidado",
      "interior"
    ]
  },
  {
    "name": "Rei de Copas",
    "scene": "Uma emoção intensa encontra sustentação numa postura responsável",
    "strength": "maturidade afetiva",
    "tension": "esconder sentimentos atrás de uma aparência de controle",
    "action": "Reconheça o sentimento e escolha uma resposta proporcional",
    "symbol": "a travessia emocional conduzida com presença",
    "themes": [
      "equilibrio",
      "cuidado"
    ]
  },
  {
    "name": "Ás de Espadas",
    "scene": "Uma ideia ou uma verdade abre um corte na confusão",
    "strength": "discernimento",
    "tension": "usar clareza como arma para ferir",
    "action": "Formule o ponto principal com precisão e respeito",
    "symbol": "a lâmina que separa o que estava misturado",
    "themes": [
      "inicio",
      "verdade"
    ]
  },
  {
    "name": "2 de Espadas",
    "scene": "Uma decisão permanece suspensa entre critérios conflitantes",
    "strength": "pausa deliberada",
    "tension": "evitar informação para não ter que decidir",
    "action": "Busque o dado que falta e defina um critério de escolha",
    "symbol": "a encruzilhada que exige olhar",
    "themes": [
      "pausa",
      "decisao"
    ]
  },
  {
    "name": "3 de Espadas",
    "scene": "Uma verdade dolorosa precisa ser reconhecida sem ampliar a ferida",
    "strength": "honestidade diante da dor",
    "tension": "repetir uma interpretação dolorosa como se fosse o único fato",
    "action": "Nomeie o que aconteceu e procure uma forma segura de elaborar",
    "symbol": "a passagem da dor para a compreensão",
    "themes": [
      "dor",
      "verdade"
    ]
  },
  {
    "name": "4 de Espadas",
    "scene": "Uma mente cansada pede intervalo antes de outra resposta",
    "strength": "repouso e reorganização",
    "tension": "continuar produzindo respostas quando falta energia para avaliar",
    "action": "Adie uma resposta não urgente e crie um intervalo de descanso",
    "symbol": "o silêncio que permite recompor",
    "themes": [
      "pausa",
      "cuidado"
    ]
  },
  {
    "name": "5 de Espadas",
    "scene": "Um conflito expõe o custo de vencer sem preservar a relação",
    "strength": "avaliação de consequências",
    "tension": "sustentar uma disputa apenas para não recuar",
    "action": "Pergunte o que essa discussão custa e se há outro modo de encerrá-la",
    "symbol": "a vitória que pede exame do preço",
    "themes": [
      "conflito",
      "limite"
    ]
  },
  {
    "name": "6 de Espadas",
    "scene": "Uma passagem permite afastar-se de um desgaste sem apagar a memória",
    "strength": "transição e perspectiva",
    "tension": "esperar que mudar de lugar elimine toda a bagagem",
    "action": "Organize a mudança e escolha o apoio de que precisa",
    "symbol": "a travessia que leva apenas o necessário",
    "themes": [
      "movimento",
      "mudanca"
    ]
  },
  {
    "name": "7 de Espadas",
    "scene": "Uma estratégia pede atenção à transparência e aos próprios motivos",
    "strength": "discrição e planejamento",
    "tension": "usar evasão para evitar responsabilidade",
    "action": "Confira o que está sendo omitido sem acusar alguém sem evidência",
    "symbol": "o caminho indireto e sua responsabilidade",
    "themes": [
      "estrategia",
      "verdade"
    ]
  },
  {
    "name": "8 de Espadas",
    "scene": "Uma sensação de restrição estreita a percepção das alternativas",
    "strength": "reconhecimento de limites",
    "tension": "supor que nenhuma margem de ação existe",
    "action": "Distinga restrição real de suposição e encontre um apoio viável",
    "symbol": "a abertura possível entre limites",
    "themes": [
      "limite",
      "incerteza"
    ]
  },
  {
    "name": "9 de Espadas",
    "scene": "Uma preocupação ocupa espaço maior que os fatos disponíveis",
    "strength": "consciência de um sofrimento",
    "tension": "confundir repetição mental com confirmação do perigo",
    "action": "Escreva o que sabe e separe do que teme; procure apoio se precisar",
    "symbol": "a noite em que o pensamento pede companhia",
    "themes": [
      "preocupacao",
      "cuidado"
    ]
  },
  {
    "name": "10 de Espadas",
    "scene": "Um desgaste chega a um ponto que exige encerramento",
    "strength": "reconhecimento de um limite final",
    "tension": "prolongar uma situação apenas porque muito já foi investido",
    "action": "Interrompa o que amplia o desgaste e organize o cuidado seguinte",
    "symbol": "o fim de uma forma de suportar",
    "themes": [
      "fim",
      "dor"
    ]
  },
  {
    "name": "Pajem de Espadas",
    "scene": "Uma pergunta abre uma busca de informação",
    "strength": "curiosidade e vigilância",
    "tension": "transformar observação em suspeita permanente",
    "action": "Faça uma pergunta clara e confirme a informação recebida",
    "symbol": "o aprendiz que afia o discernimento",
    "themes": [
      "inicio",
      "verdade"
    ]
  },
  {
    "name": "Cavaleiro de Espadas",
    "scene": "Uma convicção ganha velocidade e pede responsabilidade no impacto",
    "strength": "determinação intelectual",
    "tension": "agir antes de compreender o efeito das palavras",
    "action": "Confira a premissa antes de tomar uma atitude rápida",
    "symbol": "o pensamento que encontra movimento",
    "themes": [
      "movimento",
      "conflito"
    ]
  },
  {
    "name": "Rainha de Espadas",
    "scene": "Uma experiência amadurecida permite clareza e limites",
    "strength": "discernimento independente",
    "tension": "usar distância para evitar qualquer vulnerabilidade",
    "action": "Diga o necessário com firmeza sem apagar a dimensão humana",
    "symbol": "a lucidez que conhece seu próprio limite",
    "themes": [
      "verdade",
      "limite"
    ]
  },
  {
    "name": "Rei de Espadas",
    "scene": "Uma decisão pede critérios e responsabilidade pelo seu alcance",
    "strength": "raciocínio e direção",
    "tension": "tratar pessoas como peças de uma solução abstrata",
    "action": "Explicite os critérios e considere quem será afetado",
    "symbol": "a palavra que assume o peso de decidir",
    "themes": [
      "decisao",
      "estrutura"
    ]
  },
  {
    "name": "Ás de Paus",
    "scene": "Uma vontade criativa encontra um começo possível",
    "strength": "entusiasmo e impulso",
    "tension": "confundir inspiração com um projeto já sustentado",
    "action": "Dê ao impulso uma primeira experiência concreta",
    "symbol": "a centelha que procura matéria",
    "themes": [
      "inicio",
      "acao"
    ]
  },
  {
    "name": "2 de Paus",
    "scene": "Uma perspectiva mais ampla convida a planejar a expansão",
    "strength": "visão e preparação",
    "tension": "permanecer no plano para não assumir o risco do primeiro passo",
    "action": "Compare os caminhos e escolha um teste de pequena escala",
    "symbol": "o horizonte observado antes da partida",
    "themes": [
      "decisao",
      "crescimento"
    ]
  },
  {
    "name": "3 de Paus",
    "scene": "Uma iniciativa começa a dialogar com um horizonte maior",
    "strength": "expansão e acompanhamento",
    "tension": "esperar retorno sem ajustar o que foi lançado",
    "action": "Acompanhe o que iniciou e prepare o próximo movimento",
    "symbol": "o olhar que aprende com a distância",
    "themes": [
      "crescimento",
      "movimento"
    ]
  },
  {
    "name": "4 de Paus",
    "scene": "Um marco compartilhado oferece chão para celebrar",
    "strength": "estabilidade e encontro",
    "tension": "imaginar que uma celebração encerra toda construção",
    "action": "Reconheça um marco e cuide dos acordos que o sustentam",
    "symbol": "o portal de uma conquista partilhada",
    "themes": [
      "estrutura",
      "alegria"
    ]
  },
  {
    "name": "5 de Paus",
    "scene": "Forças diferentes disputam espaço numa situação",
    "strength": "diversidade e confronto produtivo",
    "tension": "deixar a competição substituir o objetivo comum",
    "action": "Defina o que está em disputa e um modo justo de participar",
    "symbol": "o fogo que precisa de um campo de encontro",
    "themes": [
      "conflito",
      "acao"
    ]
  },
  {
    "name": "6 de Paus",
    "scene": "Um esforço encontra reconhecimento e visibilidade",
    "strength": "confiança e mérito",
    "tension": "depender da aprovação para manter o próprio rumo",
    "action": "Receba o reconhecimento e divida o mérito quando ele for compartilhado",
    "symbol": "a passagem que se torna visível",
    "themes": [
      "alegria",
      "crescimento"
    ]
  },
  {
    "name": "7 de Paus",
    "scene": "Uma posição conquistada pede defesa e escolha de limites",
    "strength": "persistência",
    "tension": "responder a toda diferença como se fosse um ataque",
    "action": "Escolha o limite essencial e evite gastar energia em toda disputa",
    "symbol": "o lugar que pede sustentação",
    "themes": [
      "limite",
      "conflito"
    ]
  },
  {
    "name": "8 de Paus",
    "scene": "Um movimento acelerado aproxima decisões e acontecimentos",
    "strength": "agilidade e comunicação",
    "tension": "responder a tudo sem conferir prioridades",
    "action": "Organize o que é urgente e confirme a mensagem antes de agir",
    "symbol": "as forças que atravessam um intervalo",
    "themes": [
      "movimento",
      "acao"
    ]
  },
  {
    "name": "9 de Paus",
    "scene": "Um percurso exigente pede persistência sem esquecer o desgaste",
    "strength": "resiliência",
    "tension": "viver em alerta mesmo quando é possível receber apoio",
    "action": "Proteja sua energia e peça ajuda antes de se esgotar",
    "symbol": "a vigília que também precisa descansar",
    "themes": [
      "limite",
      "cuidado"
    ]
  },
  {
    "name": "10 de Paus",
    "scene": "Muitas responsabilidades comprimem o espaço de movimento",
    "strength": "capacidade de sustentar trabalho",
    "tension": "carregar tudo para provar valor ou evitar delegar",
    "action": "Redistribua uma tarefa e negocie um limite realista",
    "symbol": "o peso que precisa encontrar outras mãos",
    "themes": [
      "sobrecarga",
      "limite"
    ]
  },
  {
    "name": "Pajem de Paus",
    "scene": "Uma curiosidade criativa convida a experimentar",
    "strength": "descoberta",
    "tension": "confundir novidade com compromisso de longo prazo",
    "action": "Explore uma ideia sem prometer mais do que conhece",
    "symbol": "o aprendiz diante da primeira chama",
    "themes": [
      "inicio",
      "crescimento"
    ]
  },
  {
    "name": "Cavaleiro de Paus",
    "scene": "Uma vontade intensa procura aventura e movimento",
    "strength": "coragem e iniciativa",
    "tension": "abandonar a continuidade assim que o entusiasmo muda",
    "action": "Aja com coragem e defina como dará continuidade ao gesto",
    "symbol": "o fogo que atravessa distâncias",
    "themes": [
      "movimento",
      "desejo"
    ]
  },
  {
    "name": "Rainha de Paus",
    "scene": "Uma presença confiante cria espaço para expressão",
    "strength": "autenticidade e magnetismo",
    "tension": "medir valor pessoal pela atenção recebida",
    "action": "Mostre uma capacidade sem pedir licença para existir",
    "symbol": "a chama que ilumina a própria presença",
    "themes": [
      "acao",
      "alegria"
    ]
  },
  {
    "name": "Rei de Paus",
    "scene": "Uma visão pede liderança capaz de organizar pessoas e energia",
    "strength": "direção criativa",
    "tension": "impor uma vontade sem ouvir limites e contribuições",
    "action": "Compartilhe a visão e combine responsabilidades claras",
    "symbol": "o fogo conduzido para uma construção comum",
    "themes": [
      "acao",
      "estrutura"
    ]
  },
  {
    "name": "Ás de Ouros",
    "scene": "Uma oportunidade concreta pode começar em escala pequena",
    "strength": "recurso e viabilidade",
    "tension": "esperar que uma possibilidade produza resultado sozinha",
    "action": "Verifique condições e dê um primeiro passo sustentável",
    "symbol": "a semente que precisa de chão",
    "themes": [
      "inicio",
      "recursos"
    ]
  },
  {
    "name": "2 de Ouros",
    "scene": "Demandas diferentes pedem ajuste de ritmo e prioridades",
    "strength": "flexibilidade",
    "tension": "normalizar uma instabilidade que já causa desgaste",
    "action": "Reorganize duas prioridades e reconheça o que pode esperar",
    "symbol": "o equilíbrio em movimento",
    "themes": [
      "equilibrio",
      "recursos"
    ]
  },
  {
    "name": "3 de Ouros",
    "scene": "Uma construção ganha qualidade quando competências se encontram",
    "strength": "cooperação e aprendizado",
    "tension": "trabalhar junto sem combinar expectativas",
    "action": "Defina responsabilidades e peça retorno sobre o trabalho",
    "symbol": "o ofício que cresce em colaboração",
    "themes": [
      "crescimento",
      "estrutura"
    ]
  },
  {
    "name": "4 de Ouros",
    "scene": "Uma busca de segurança expõe o modo de guardar recursos",
    "strength": "preservação",
    "tension": "confundir proteção com retenção que impede circulação",
    "action": "Revise o que precisa preservar e o que pode compartilhar",
    "symbol": "a reserva que precisa de medida",
    "themes": [
      "apego",
      "recursos"
    ]
  },
  {
    "name": "5 de Ouros",
    "scene": "Uma sensação de falta torna importante reconhecer apoio acessível",
    "strength": "percepção da necessidade",
    "tension": "tomar dificuldade material como medida de valor pessoal",
    "action": "Identifique uma necessidade concreta e procure apoio disponível",
    "symbol": "a procura de abrigo numa passagem difícil",
    "themes": [
      "perda",
      "recursos"
    ]
  },
  {
    "name": "6 de Ouros",
    "scene": "Uma troca pede proporção entre receber, oferecer e poder",
    "strength": "generosidade e reciprocidade",
    "tension": "aceitar uma ajuda que cria obrigação sem acordo claro",
    "action": "Converse sobre condições e limites de uma troca",
    "symbol": "a balança entre oferta e necessidade",
    "themes": [
      "equilibrio",
      "vinculo"
    ]
  },
  {
    "name": "7 de Ouros",
    "scene": "Um investimento pede avaliação antes de continuar",
    "strength": "paciência e acompanhamento",
    "tension": "persistir apenas pelo tempo já investido",
    "action": "Confira os resultados e decida qual ajuste vale fazer",
    "symbol": "o cultivo que exige observar a estação",
    "themes": [
      "pausa",
      "crescimento"
    ]
  },
  {
    "name": "8 de Ouros",
    "scene": "Uma habilidade se constrói no encontro entre repetição e atenção",
    "strength": "aperfeiçoamento",
    "tension": "repetir sem aprender ou exigir perfeição antes de praticar",
    "action": "Escolha uma habilidade e pratique com retorno concreto",
    "symbol": "o ofício que amadurece nas mãos",
    "themes": [
      "acao",
      "crescimento"
    ]
  },
  {
    "name": "9 de Ouros",
    "scene": "Uma conquista permite desfrutar autonomia e cuidado com o que foi construído",
    "strength": "independência e fruição",
    "tension": "confundir autonomia com nunca precisar de ninguém",
    "action": "Reconheça uma conquista e mantenha uma rede de apoio",
    "symbol": "o jardim cultivado que pode ser habitado",
    "themes": [
      "recursos",
      "alegria"
    ]
  },
  {
    "name": "10 de Ouros",
    "scene": "Uma construção duradoura reúne recursos, vínculos e continuidade",
    "strength": "legado e estabilidade",
    "tension": "submeter a vida a uma expectativa herdada sem examiná-la",
    "action": "Converse sobre o que deseja preservar e para quem faz sentido",
    "symbol": "a casa que atravessa gerações",
    "themes": [
      "estrutura",
      "vinculo"
    ]
  },
  {
    "name": "Pajem de Ouros",
    "scene": "Um interesse encontra uma oportunidade de aprender na prática",
    "strength": "estudo e atenção ao concreto",
    "tension": "adiar o começo esperando dominar tudo",
    "action": "Escolha um aprendizado e pratique num problema pequeno",
    "symbol": "o aprendiz que reconhece valor na semente",
    "themes": [
      "inicio",
      "recursos"
    ]
  },
  {
    "name": "Cavaleiro de Ouros",
    "scene": "Uma rotina consistente permite avançar mesmo sem novidade",
    "strength": "constância",
    "tension": "transformar compromisso em rigidez sem avaliação",
    "action": "Mantenha um passo regular e reveja o método quando necessário",
    "symbol": "a caminhada que confia no ritmo",
    "themes": [
      "estrutura",
      "acao"
    ]
  },
  {
    "name": "Rainha de Ouros",
    "scene": "Um cuidado concreto sustenta a vida cotidiana",
    "strength": "acolhimento e administração de recursos",
    "tension": "cuidar do conforto de todos sem reservar recursos próprios",
    "action": "Organize um cuidado viável também para você",
    "symbol": "o chão que acolhe e nutre",
    "themes": [
      "cuidado",
      "recursos"
    ]
  },
  {
    "name": "Rei de Ouros",
    "scene": "Uma capacidade de administrar pode criar sustentação compartilhada",
    "strength": "responsabilidade material",
    "tension": "medir segurança apenas pelo que se possui",
    "action": "Use um recurso com responsabilidade e clareza de finalidade",
    "symbol": "a abundância que precisa saber para que serve",
    "themes": [
      "estrutura",
      "recursos"
    ]
  }
];
if (CARDS.length !== 78 || EDITORIAL.length !== 78) throw new Error('Catálogo incompleto para Whit.');
export const WHIT_CARDS = deepFreeze(CARDS.map((card,index) => {
  const text = EDITORIAL[index];
  if (card.name !== text.name || card.orientation !== 'normal') throw new Error('Identidade canônica incompatível: '+card.canonicalId);
  return {
    canonicalId:card.canonicalId, id:card.id, name:card.name,
    arcana:card.arcanaCode, suit:card.suitCode, element:card.element,
    number:card.number, court:card.court, orientation:'normal',
    ...text,
    dimensions:{
      love:{ focus:'vínculos, reciprocidade e limites', anchor:text.scene, risk:text.tension },
      mind:{ focus:'percepção, fatos e interpretação', anchor:text.strength, risk:text.tension },
      action:{ focus:'um gesto possível', anchor:text.action },
      spirit:{ focus:'propósito e imagem simbólica', anchor:text.symbol }
    }
  };
}));
const byCanonical = new Map(WHIT_CARDS.map(card => [card.canonicalId,card]));
const byId = new Map(WHIT_CARDS.map(card => [card.id,card]));
export function whitCard(reference) {
  if (typeof reference === 'string') return byCanonical.get(reference) || null;
  if (Number.isInteger(reference)) return byId.get(reference) || null;
  if (!reference || typeof reference !== 'object') return null;
  if(reference.orientation != null && reference.orientation !== 'normal') return null;
  // O identificador canônico, se informado, tem prioridade; um ID inválido não cai silenciosamente em outro.
  return reference.canonicalId != null ? byCanonical.get(reference.canonicalId) || null : byId.get(reference.id) || null;
}
export const WHIT_THEME_AXES = deepFreeze({
  inicio:'abrir espaço para um começo', fim:'reconhecer um encerramento',
  ruptura:'reorganizar o que perdeu sustentação', esperanca:'retomar uma confiança praticável',
  verdade:'buscar clareza e responsabilidade', incerteza:'aguardar informação suficiente',
  vinculo:'examinar encontro e reciprocidade', limite:'proteger uma margem necessária',
  estrutura:'dar sustentação ao que importa', movimento:'acompanhar uma passagem',
  cuidado:'sustentar necessidades reais', interior:'escutar a experiência interna',
  recursos:'examinar condições concretas', conflito:'reconhecer interesses em tensão',
  crescimento:'acompanhar o que amadurece', alegria:'dar lugar ao que pode ser celebrado',
  decisao:'definir um critério', equilibrio:'ajustar partes diferentes',
  acao:'converter intenção em gesto', sentido:'buscar propósito', mudanca:'acompanhar uma transformação',
  apego:'examinar o que prende', renovacao:'responder de outro modo', conclusao:'reconhecer uma etapa concluída',
  perda:'acolher o que deixou de estar presente', memoria:'examinar o lugar de uma lembrança',
  desejo:'reconhecer o que se deseja', dor:'acolher uma experiência difícil',
  estrategia:'examinar a forma de conduzir uma ação', preocupacao:'separar inquietação de evidência',
  sobrecarga:'rever o peso de responsabilidades', clareza:'tornar uma percepção compreensível',
  pausa:'criar um intervalo para observar e recompor'
});
