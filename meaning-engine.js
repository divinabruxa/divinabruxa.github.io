const ARCANA = {
  'O Louco':['começo, liberdade e confiança','Dê um passo novo sem abandonar sua consciência.'],
  'O Mago':['ação, habilidade e manifestação','Use o que já está em suas mãos.'],
  'A Sacerdotisa':['intuição, silêncio e mistério','Escute antes de agir.'],
  'A Imperatriz':['criação, prazer e abundância','Nutra aquilo que deseja ver crescer.'],
  'O Imperador':['estrutura, liderança e limites','Organize sua força e sustente sua decisão.'],
  'O Hierofante':['aprendizado, valores e tradição','Reconheça a sabedoria que pode orientar você.'],
  'Os Enamorados':['amor, escolha e alinhamento','Escolha o que combina desejo e verdade.'],
  'O Carro':['movimento, vitória e direção','Conduza energias opostas para o mesmo destino.'],
  'A Força':['coragem, domínio e compaixão','A verdadeira força não precisa ferir.'],
  'O Eremita':['introspecção, busca e sabedoria','Afaste o ruído para ouvir sua própria luz.'],
  'A Roda da Fortuna':['ciclos, destino e mudança','Mova-se com o ciclo em vez de lutar contra ele.'],
  'A Justiça':['verdade, equilíbrio e consequência','Decida com honestidade e aceite os efeitos.'],
  'O Pendurado':['pausa, entrega e perspectiva','Veja a situação por um ângulo diferente.'],
  'A Morte':['fim, transformação e renascimento','Libere o que terminou para abrir espaço.'],
  'A Temperança':['harmonia, cura e integração','Misture extremos com paciência.'],
  'O Diabo':['desejo, apego e sombra','Reconheça o vínculo antes de tentar rompê-lo.'],
  'A Torre':['ruptura, revelação e libertação','O que cai mostra onde faltava verdade.'],
  'A Estrela':['esperança, inspiração e guia','Permita-se acreditar de novo.'],
  'A Lua':['intuição, medo e inconsciente','Nem tudo precisa ser decidido na escuridão.'],
  'O Sol':['alegria, vitalidade e clareza','Ocupe seu espaço e deixe a vida aparecer.'],
  'O Julgamento':['chamado, despertar e renascimento','Responda à versão de você que deseja nascer.'],
  'O Mundo':['conclusão, integração e plenitude','Celebre o ciclo completo antes de começar outro.']
};
const SUITS={Copas:['emoções, vínculos e intuição','acolha o que você sente sem se perder no sentimento'],Espadas:['pensamentos, verdade e decisões','transforme ansiedade em clareza e escolha'],Paus:['energia, coragem e criatividade','direcione seu fogo para uma ação possível'],Ouros:['corpo, trabalho e recursos','construa com presença, paciência e consistência']};
const NUMBERS={Ás:'uma semente e um novo começo',2:'uma escolha ou parceria',3:'crescimento e expressão',4:'estrutura, pausa ou estabilidade',5:'tensão que provoca mudança',6:'harmonia, passagem ou reconhecimento',7:'avaliação, defesa ou possibilidades',8:'movimento, domínio ou limitação',9:'maturidade e aproximação do resultado',10:'conclusão e consequência',Pajem:'mensagem, curiosidade e aprendizado',Cavaleiro:'movimento, busca e intensidade',Rainha:'domínio interior e cuidado',Rei:'liderança, responsabilidade e direção'};

export function meaning(card,reversed=false){
  const major=ARCANA[card.name];
  if(major){const essence=major[0],guidance=major[1];return enrich(card,essence,guidance,reversed);}
  const rank=card.name.split(' de ')[0],suit=SUITS[card.suit];
  return enrich(card,`${NUMBERS[rank]} · ${suit[0]}`,`Hoje, ${suit[1]}. Esta carta aponta ${NUMBERS[rank]}.`,reversed);
}

function enrich(card,keywords,guidance,reversed){
 const suit=card.suit==='Maiores'?'uma transformação central da sua jornada':`o território de ${SUITS[card.suit][0]}`;
 const message=reversed?`A energia de ${keywords} pede revisão. Não leia a posição invertida como castigo: ela indica uma força interior bloqueada, excessiva ou ainda não reconhecida. Antes de procurar uma resposta fora, observe onde você está repetindo uma defesa antiga.`:`${guidance} A presença desta carta mostra que ${suit} está ativo agora. Ela não determina um destino: oferece uma linguagem para reconhecer padrões, possibilidades e escolhas com mais consciência.`;
 return {keywords,message,
  light:`Na expressão luminosa, ${card.name} convida você a agir com presença, honestidade e responsabilidade. Perceba os recursos que já existem, inclusive os pequenos, e escolha um movimento que possa ser sustentado na vida real.`,
  shadow:`Na sombra, esta energia pode aparecer como pressa, rigidez, idealização, medo de perder o controle ou dificuldade de escutar os próprios limites. O caminho não é negar a sombra, mas compreender o que ela tenta proteger.`,
  practical:`Transforme a leitura em prática: escreva o que está sob seu controle, escolha uma atitude simples para as próximas vinte e quatro horas e deixe para depois aquilo que ainda depende de clareza.`,
  emotional:`Emocionalmente, esta carta pede espaço para sentir sem confundir sentimento com sentença. Nomear o que acontece dentro de você diminui a força do automático e devolve liberdade à escolha.`,
  spiritual:`No plano simbólico, ${card.name} recorda que toda passagem contém aprendizado. Use a imagem como espelho de reflexão — não como prova absoluta, previsão inevitável ou substituição de decisões profissionais.`,
  question:`Onde a energia de ${keywords.split(' · ')[0]} já está presente na minha realidade — e qual verdade eu consigo acolher hoje?`,
  questions:[`O que esta carta ilumina que eu estava evitando nomear?`,`Que escolha preserva minha dignidade e também respeita meus limites?`,`Qual atitude concreta transforma esta mensagem em experiência?`]};
}
