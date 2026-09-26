/* DIVINA BRUXA 3.2.1 — VOZ ORACULAR
   78 núcleos poéticos originais. Não ensina a carta: transforma o encontro
   aleatório em uma mensagem breve, estável durante o mesmo ritual. */

const CARD_VOICES = Object.freeze([
  'Uma porta aparece onde antes havia apenas horizonte. O primeiro passo não precisa conhecer o último.',
  'Tudo o que você precisa já circula entre intenção e gesto. Dê forma ao que estava disperso.',
  'O silêncio guarda uma resposta que o ruído ainda não merece. Escute antes de nomear.',
  'Algo fértil pede espaço, beleza e tempo. Nutrir também é uma forma de decidir.',
  'O que sustenta você precisa de contorno. Firmeza verdadeira não precisa endurecer o coração.',
  'Uma sabedoria antiga encontra uma pergunta nova. Guarde o essencial e solte a forma vazia.',
  'Duas verdades se olham e pedem escolha inteira. O desejo revela aquilo que a dúvida escondia.',
  'As forças deixam de puxar em direções contrárias. Quando o centro assume as rédeas, o caminho responde.',
  'A potência mais rara chega sem violência. O que parecia fera reconhece uma presença serena.',
  'Afaste-se do excesso para ouvir sua própria luz. A solidão escolhida devolve aquilo que a pressa levou.',
  'O ciclo gira sem pedir licença. O ponto de poder está na maneira como você atravessa a mudança.',
  'A balança não pede perfeição, pede verdade. O que for escolhido agora desejará coerência depois.',
  'O mundo muda quando o olhar aceita outra altura. Uma pausa pode revelar a saída invisível.',
  'Uma pele antiga terminou sua missão. Não negocie com a passagem que já começou dentro de você.',
  'Duas águas diferentes aprendem a correr juntas. A cura acontece no ritmo que não força nem abandona.',
  'Aquilo que prende perde força quando recebe nome. Desejo consciente deixa de ser corrente e vira escolha.',
  'O que não era verdadeiro não suporta mais o próprio peso. Entre os escombros, a liberdade respira primeiro.',
  'Uma esperança delicada continua acesa além do cansaço. Siga a luz que não exige espetáculo.',
  'Nem todo mistério é ameaça. Caminhe devagar até que a névoa revele o que o medo inventou.',
  'A vida quer ser vista sem diminuição. Há uma alegria possível quando você para de esconder o próprio brilho.',
  'Uma voz antiga chama pelo seu nome verdadeiro. Responder a ela encerra um sono que já durou bastante.',
  'O círculo se completa sem aprisionar. Você chega inteira ao fim e livre ao começo seguinte.',

  'Uma emoção nasce limpa antes de receber explicação. Deixe o coração reconhecer primeiro.',
  'O encontro verdadeiro não pede desaparecimento. Duas presenças podem se escolher sem deixar de existir.',
  'A alegria procura testemunhas. Há cura no que pode ser celebrado sem culpa.',
  'Proteja o que sente sem fechar todas as janelas. Segurança também precisa respirar.',
  'O que doeu deseja ser honrado, não transformado em morada. Ainda existem taças de pé atrás de você.',
  'Uma lembrança retorna trazendo perfume, não endereço. Receba a ternura e continue no presente.',
  'Muitas imagens disputam seu desejo. A escolha fica nítida quando você pergunta o que permanece ao amanhecer.',
  'O coração já se despediu do que os pés ainda não deixaram. A travessia começa por dentro.',
  'Um desejo amadurece perto de se realizar. Permita-se receber sem transformar prazer em medo.',
  'A abundância afetiva não precisa ser perfeita para ser real. Reconheça a casa que nasce entre presenças.',
  'Uma notícia delicada atravessa a água. A sensibilidade abre caminhos que a lógica não percebeu.',
  'O sentimento ganha movimento e procura expressão. Encanto é convite, nunca promessa.',
  'Uma presença profunda acolhe sem se abandonar. Cuidar do outro começa onde a própria margem permanece.',
  'O coração aprende a governar suas marés. Maturidade é sentir tudo sem entregar o leme à tempestade.',

  'Uma verdade rompe o céu e separa o essencial do ruído. Use a clareza para abrir, não para ferir.',
  'A escolha adiada também escolhe. Retire a venda com delicadeza e veja o que já estava decidido por dentro.',
  'A dor tem uma linguagem aguda, mas não possui a última palavra. O coração partido ainda sabe pulsar.',
  'O repouso devolve ordem ao que a batalha confundiu. Hoje, parar pode ser o movimento mais sábio.',
  'Nem toda vitória merece seu preço. Saia do conflito que exige que você perca a própria paz.',
  'A margem difícil começa a ficar para trás. Leve a memória, não o peso inteiro.',
  'Uma estratégia silenciosa pede honestidade consigo. Inteligência sem verdade cria labirintos.',
  'Você pode estar cercada sem estar vencida. O primeiro corte acontece na crença de que não há saída.',
  'A mente vigia uma ameaça que talvez já tenha passado. A madrugada termina quando o medo deixa de comandar.',
  'Um ciclo mental chegou ao limite. O que termina agora não levará sua capacidade de recomeçar.',
  'Uma ideia jovem toca a janela. Observe com curiosidade antes de transformá-la em certeza.',
  'A pressa carrega uma verdade, mas pode atropelar sua própria mensagem. Direção vale mais que velocidade.',
  'A lucidez ergue limites limpos. Dizer não ao excesso é dizer sim àquilo que precisa sobreviver.',
  'A mente encontra seu eixo e a palavra recupera peso. Decida sem crueldade e permaneça inteira.',

  'Uma centelha procura matéria. Comece pequeno, mas comece com o fogo inteiro.',
  'O horizonte cresce porque você já não cabe no mesmo mapa. Escolha a direção que expande sem dispersar.',
  'Algo enviado ao mundo começa a responder. Continue preparando o porto para aquilo que se aproxima.',
  'A alegria quer ganhar chão, corpo e testemunhas. Celebre a passagem antes de correr para a próxima.',
  'Muitas vontades acendem ao mesmo tempo. O fogo certo não precisa apagar todos os outros.',
  'Você chegou mais longe do que o medo admite. Proteja sua posição sem confundir defesa com isolamento.',
  'A coragem aparece quando a presença supera o barulho ao redor. Sustente seu lugar sem pedir desculpas.',
  'O movimento acelera e as coincidências se aproximam. Esteja pronta para responder com simplicidade.',
  'A chama continua mesmo cansada. Preserve a energia que resta para o que realmente importa.',
  'Carregar tudo provou sua força, mas não precisa definir seu destino. Divida, solte, reorganize.',
  'Uma mensagem de fogo chega pedindo experiência. Curiosidade é a senha desta porta.',
  'A vontade corre na frente e convida o mundo a acompanhar. Lembre-se de levar consigo o próprio centro.',
  'Sua presença acende outras presenças. Brilhar sem diminuir ninguém é uma forma rara de poder.',
  'A visão pede liderança, não controle. Faça do entusiasmo uma fogueira onde outros também possam chegar.',

  'Uma possibilidade concreta cabe na palma da mão. O futuro começa na forma como você toca o presente.',
  'Valor é também troca, tempo e escolha. O que você alimenta hoje revela o que deseja multiplicar.',
  'A construção procura alianças verdadeiras. O talento cresce quando encontra escuta, ofício e colaboração.',
  'Há riqueza no que permanece estável, mas vida nenhuma floresce dentro de um cofre fechado.',
  'A sensação de falta não define toda a paisagem. Uma porta de acolhimento pode estar mais perto do que parece.',
  'Dar e receber querem voltar ao mesmo rio. Ajuste a medida para que a generosidade não vire ausência de si.',
  'A semente trabalha no escuro e não está atrasada. Avalie o crescimento sem arrancar a raiz para conferir.',
  'A repetição consciente transforma gesto em domínio. O extraordinário começa quando o cuidado encontra constância.',
  'Você construiu um território que sabe seu nome. Desfrute sem culpa daquilo que sua presença sustentou.',
  'Uma herança invisível procura continuidade. Prosperar também é escolher o que não será repetido.',
  'Uma oportunidade chega disfarçada de tarefa simples. Toque a realidade com atenção de aprendiz.',
  'O avanço é lento porque deseja durar. Confie na passada que chega inteira ao chão.',
  'A abundância aprende a cuidar de si e do entorno. Receber plenamente permite oferecer sem esvaziamento.',
  'A matéria obedece a quem respeita tempo, limite e consequência. Faça do compromisso uma casa segura.'
]);

const CLOSINGS = Object.freeze([
  'O sinal estará no que se repetir sem esforço.',
  'Não force a resposta: reconheça o próximo gesto.',
  'O que é seu encontrará uma maneira de permanecer.',
  'A parte mais silenciosa desta mensagem é a mais importante.',
  'Observe o que muda quando você para de pedir permissão ao medo.',
  'Hoje, a verdade pode chegar como alívio antes de chegar como certeza.',
  'Existe uma escolha pequena capaz de alterar todo o movimento.',
  'A Orbe não fecha o destino; ela ilumina a porta que está viva agora.'
]);

const CONNECTORS = Object.freeze([
  'abre uma passagem, e',
  'acende a pergunta; então',
  'retira o véu, enquanto',
  'entrega a chave, mas',
  'move a primeira maré; depois',
  'mostra o que nasce, e'
]);

export function oracleHash(value) {
  let hash = 2166136261;
  for (const character of String(value ?? '')) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function secureOracleSeed() {
  const values = new Uint32Array(1);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return values[0] >>> 0;
  }
  return oracleHash(`${Date.now()}-${Math.random()}-${globalThis.performance?.now?.() || 0}`);
}

const choose = (values, seed, salt = 0) => values[(oracleHash(`${seed}:${salt}`) % values.length)];

export function oracleForCard(card, seed, salt = 0) {
  const core = CARD_VOICES[Number(card?.id)] || 'Uma imagem chega antes da palavra. Permita que ela encontre você por inteiro.';
  return `${core} ${choose(CLOSINGS, seed, Number(card?.id || 0) + salt)}`;
}

export function oracleConversation(cards, positions, seed, intention = '') {
  const visible = cards.filter(Boolean);
  if (!visible.length) return null;
  const first = visible[0];
  const last = visible.at(-1);
  const firstPosition = positions?.[0] || 'A primeira presença';
  const lastPosition = positions?.[visible.length - 1] || 'A presença mais recente';
  const facts = [];

  if (visible.length === 1) {
    facts.push(`${firstPosition}: ${oracleForCard(first, seed, 11)}`);
  } else {
    const pairs = visible.length <= 4
      ? visible.slice(1).map((card, index) => [visible[index], card, index])
      : [[visible[0], visible[1], 0], [visible[Math.floor(visible.length / 2) - 1], visible[Math.floor(visible.length / 2)], 1], [visible.at(-2), visible.at(-1), 2]];
    pairs.forEach(([before, after, index]) => {
      const connector = choose(CONNECTORS, seed, index + before.id + after.id);
      facts.push(`${before.name} ${connector} ${after.name} responde: ${CARD_VOICES[after.id]}`);
    });
  }

  const intentionLine = String(intention || '').trim()
    ? 'A intenção foi ouvida, mas as cartas preservam o espaço que ainda pertence à sua escolha.'
    : choose(CLOSINGS, seed, visible.length + 97);

  return Object.freeze({
    title:visible.length === 1 ? 'A primeira voz' : 'O diálogo das cartas',
    prompt:visible.length === 1
      ? `${first.name} chega em ${firstPosition.toLowerCase()} e inaugura o fio da leitura.`
      : `${first.name} iniciou o movimento; ${last.name}, em ${lastPosition.toLowerCase()}, transforma aquilo que veio antes. ${intentionLine}`,
    facts:Object.freeze(facts.slice(0, 3))
  });
}

export const ORACLE_VOICE_COUNT = CARD_VOICES.length;
