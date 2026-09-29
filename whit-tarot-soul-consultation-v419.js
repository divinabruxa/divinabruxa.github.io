/*
 * DIVINA BRUXA 4.1.9 · ALMA DA CONSULTA
 *
 * Os motores anteriores analisam. Esta camada transforma o conhecimento em
 * uma consulta humana, clara e contínua. Ela não acrescenta outra voz: é a
 * última escrita da Whit antes de a leitura chegar à pessoa.
 */

export const SOUL_CONSULTATION_ENGINE_NAME = 'ALMA DA CONSULTA';
export const SOUL_CONSULTATION_ENGINE_VERSION = '4.1.9';

export const SOUL_CONSULTATION_COVENANT = Object.freeze([
  'Whit presta atenção à situação oferecida pela pessoa antes de escolher as palavras',
  'as cartas iluminam a consulta sem transformar a resposta em aula ou dicionário',
  'cada frase continua a anterior e constrói uma única história humana',
  'clareza vale mais do que linguagem abstrata ou ornamentação vazia',
  'a leitura reconhece sentimento, revela o conflito, mostra a tendência e oferece um passo possível',
  'amor é tratado com dignidade, reciprocidade e verdade observável',
  'futuro permanece aberto à escolha e nenhuma personagem afirma possuir consciência literal'
]);

const clean = (value, limit = 5000) => String(value ?? '').replaceAll('\0', '').trim().slice(0, limit);
const clause = value => clean(value).replace(/[.!?…;:,]+$/u, '');
const lower = value => {
  const text = clause(value);
  return text ? `${text.charAt(0).toLocaleLowerCase('pt-BR')}${text.slice(1)}` : '';
};
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  const result = `${text.charAt(0).toLocaleUpperCase('pt-BR')}${text.slice(1)}`;
  return /[.!?…]$/u.test(result) ? result : `${result}.`;
};
const name = entry => clean(entry?.card?.name, 120) || 'A carta';
const core = entry => entry?.knowledge?.core || {};
const territory = entry => entry?.territory || {};

const HUMAN_OPENING = Object.freeze({
  return:'No amor, a saudade pode manter uma história aberta dentro de você, mas esta mesa separa o desejo de reencontro daquilo que realmente pode ser reconstruído.',
  trust:'Você quer uma reconstrução da confiança sem voltar ao lugar onde foi ferida; esta leitura observa se existe base real para isso.',
  ending:'Uma parte de você já percebeu que algo mudou, enquanto outra ainda tenta encontrar um modo de não perder o que sentiu.',
  commitment:'Você não está procurando apenas sentimento; quer saber se existe presença, escolha e responsabilidade suficientes para sustentar um vínculo.',
  reciprocity:'Seu coração quer uma resposta, mas a questão mais importante desta mesa é descobrir se aquilo que você oferece também encontra caminho de volta.',
  communication:'Existe algo que precisa sair do silêncio, porém as cartas pedem que verdade e momento certo caminhem juntos.',
  boundary:'Você chegou ao ponto em que preservar a paz exige deixar claro o que pode continuar e o que não será mais aceito.',
  healing:'A dor não precisa desaparecer de uma vez para que sua vida volte a andar; esta leitura procura o primeiro lugar onde a cura pode começar.',
  decision:'Você não precisa de mais possibilidades; precisa enxergar qual escolha respeita melhor sua verdade e as consequências que virão com ela.',
  action:'Você já percebe que algo precisa mudar, e a mesa agora procura o passo capaz de transformar intenção em movimento real.',
  timing:'A espera está ocupando espaço demais dentro de você; esta leitura procura condições reais para o caminho avançar, não numa data garantida.',
  future:'Você quer saber para onde esta história caminha porque permanecer sem resposta também cansa o coração.',
  beginning:'Existe vontade de começar, mas seu coração quer reconhecer se este nascimento possui espaço, direção e verdade para crescer.',
  stability:'Você procura segurança, e a mesa mostra o que precisa ganhar ordem antes de poder oferecer tranquilidade.',
  conflict:'O conflito já falou alto; agora é preciso descobrir qual verdade pode interromper a repetição sem aumentar a ferida.',
  purpose:'Você não procura apenas um destino; procura uma vida que tenha sentido quando o encanto do primeiro impulso passar.',
  understanding:'Você sente que existe algo importante por trás desta situação e quer finalmente enxergar o que antes parecia confuso.',
  general:'Esta leitura não veio para preencher o silêncio com frases bonitas; ela veio iluminar o ponto da sua vida que pede atenção agora.'
});

const TERRITORY_CLOSING = Object.freeze({
  love:'Você não precisa negar o que sente; sua escolha começa quando o silêncio do outro deixa de definir o seu valor.',
  relationship:'Um vínculo verdadeiro não pede que você desapareça para conservá-lo.',
  work:'Seu caminho profissional cresce quando talento, constância e escolha passam a trabalhar na mesma direção.',
  money:'Segurança não nasce de uma promessa; nasce de decisões que continuam sustentáveis depois do entusiasmo.',
  family:'É possível amar sua história sem continuar carregando sozinha tudo o que pertence a ela.',
  identity:'Este momento pode tocar profundamente você, mas não possui o direito de definir toda a sua identidade.',
  change:'A mudança deixa de ser apenas perda quando você reconhece o espaço que ela está tentando devolver à sua vida.',
  decision:'A melhor escolha não elimina todo medo; ela permite que você continue se respeitando depois de decidir.',
  spirituality:'Leve desta leitura o que aproxima você da verdade, da compaixão e da responsabilidade pela própria vida.',
  general:'A carta ilumina o caminho, mas é a sua presença na própria vida que transforma orientação em destino.'
});

const TERRITORY_OPENING = Object.freeze({
  love:'Você quer saber se esse sentimento encontra um caminho real para existir sem ferir sua dignidade.',
  relationship:'Você está tentando compreender se este vínculo ainda consegue crescer com verdade dos dois lados.',
  work:'Você quer saber se seu esforço pode se transformar em resultado, segurança e reconhecimento.',
  money:'Você procura uma direção que proteja seus recursos sem paralisar seus planos.',
  family:'Você quer cuidar dessa relação sem continuar carregando sozinha o peso de toda a história.',
  identity:'Você procura reconhecer quem é por baixo da pressão, do medo e das expectativas externas.',
  change:'Você sente que a vida está mudando e quer atravessar essa passagem sem perder a própria direção.',
  decision:'Você está diante de uma escolha que precisa respeitar tanto sua verdade quanto suas consequências.',
  spirituality:'Você procura um sentido que aproxime fé, realidade e responsabilidade pela própria vida.'
});

function humanOpening(context, fallbackCard = '') {
  if (!context?.hasContext) {
    return sentence(`${fallbackCard || 'Esta carta'} chega para iluminar o que merece sua atenção antes da próxima escolha`);
  }
  if (context.intent === 'general' && TERRITORY_OPENING[context.territory]) {
    return TERRITORY_OPENING[context.territory];
  }
  return HUMAN_OPENING[context.intent] || HUMAN_OPENING.general;
}

function cardInPosition(entry) {
  const role = entry?.classification?.role || 'general';
  const label = clean(entry?.classification?.label, 120);
  const truth = core(entry).truth || entry?.reading?.emphasis || 'uma verdade pede atenção';
  if (role === 'general' && /^\d{4}-\d{2}-\d{2}$/u.test(label)) {
    return sentence(`Hoje, ${name(entry)} mostra que ${lower(truth)}`);
  }
  const prefix = ({
    origin:'Na raiz desta situação',
    past:'No passado desta história',
    present:'Neste momento',
    obstacle:'Como obstáculo',
    hidden:'No que ainda está oculto',
    desire:'No seu desejo',
    fear:'No medo que atravessa esta escolha',
    advice:'Como conselho',
    choice:'Na escolha que devolve sua força',
    future:'Como tendência',
    outcome:'Como resultado',
    birth:'No que tenta nascer',
    ending:'No que completou sua função',
    freewill:'No espaço do seu livre-arbítrio',
    general:'No centro desta leitura'
  })[role] || 'No centro desta leitura';
  return sentence(`${prefix}, ${name(entry)} mostra que ${lower(truth)}`);
}

function tensionLine(entry) {
  const conflict = core(entry).conflict || entry?.reading?.emphasis || 'o padrão atual precisa ser reconhecido';
  return sentence(`No centro da mesa, a tensão aparece com ${name(entry)}: ${lower(conflict)}`);
}

function revelationLine(entry, tensionEntry) {
  const movement = core(entry).movement || entry?.reading?.movement || 'agir de acordo com o que a realidade confirma';
  if (entry === tensionEntry || name(entry) === name(tensionEntry)) {
    return sentence(`A saída começa quando você ${lower(movement)}`);
  }
  return sentence(`${name(entry)} muda a direção da história; na prática, você ${lower(movement)}`);
}

function tendencyLine(entry) {
  const consequence = core(entry).consequence || entry?.reading?.possibility || 'a situação encontra uma nova direção';
  const role = entry?.classification?.role;
  const prefix = role === 'outcome' ? `Como resultado, ${name(entry)}` : name(entry);
  return sentence(`${prefix} mostra que, se o padrão continuar, ${lower(consequence)}; esta é uma tendência, não uma sentença, e sua escolha ainda participa do caminho`);
}

function counselLine(action, entry) {
  const practical = (clause(action) || clause(core(entry).movement) || 'Escolha uma atitude pequena que possa ser confirmada pela realidade')
    .replace(
      /antes de decidir, reúna dados verificáveis, registre limites e procure apoio humano adequado para confirmar o próximo passo/iu,
      'antes de decidir, reúna dados e apoio adequado; registre limites e confirme o próximo passo com um profissional'
    );
  if (/^seu livre-arb[ií]trio\b/iu.test(practical)) return sentence(practical);
  if (/^escolha uma a[cç][aã]o pequena\b/iu.test(practical)) {
    return sentence(`Como conselho, ${name(entry)} leva esta verdade para a vida: você ${lower(core(entry).movement || practical)}`);
  }
  return sentence(`Como conselho, ${name(entry)} pede um passo simples: ${lower(practical)}`);
}

function sequenceLine(entries, revelationEntry) {
  if (entries.length < 3 || entries.length > 5) return '';
  const sequence = entries.map(name);
  const middle = sequence.slice(1, -1).join(' e ');
  const movement = core(revelationEntry).movement || 'a realidade precisa orientar a próxima atitude';
  return sentence(
    `Para começar, ${sequence[0]} abre a história; ${middle ? `no centro, o caminho atravessa ${middle}; ` : ''}` +
    `por fim, ${sequence.at(-1)} revela a direção mais forte: na prática, você ${lower(movement)}`
  );
}

function closingLine(context) {
  return TERRITORY_CLOSING[context?.territory] || TERRITORY_CLOSING.general;
}

function cardsDepth(entries, tensionEntry, revelationEntry) {
  const opening = entries[0];
  const ending = entries.at(-1);
  const parts = [
    sentence(`${name(opening)} abre a leitura mostrando que ${lower(core(opening).truth)}`),
    sentence(`${name(tensionEntry)} revela o conflito: ${lower(core(tensionEntry).conflict)}`),
    sentence(`${name(ending || revelationEntry)} aponta a transformação possível: ${lower(core(ending || revelationEntry).consequence)}`)
  ];
  return parts.filter(Boolean).join(' ');
}

function loveDepth(context, tensionEntry, counselEntry) {
  if (!['love', 'relationship'].includes(context?.territory)) return '';
  const boundary = territory(counselEntry).boundary || 'sentimento precisa aparecer em presença, atitude e respeito';
  return [
    sentence(`No amor, ${name(tensionEntry)} mostra que ${lower(core(tensionEntry).conflict)}`),
    sentence(`${name(counselEntry)} devolve a medida desta relação: ${lower(boundary)}`),
    'O que existe no coração só se torna vínculo quando também existe na realidade.'
  ].join(' ');
}

function positionDepth(entries) {
  return entries.slice(0, 4).map(entry => {
    const label = clean(entry?.classification?.label || entry?.classification?.title, 120);
    const purpose = entry?.reading?.function || 'mostrar sua função nesta história';
    return sentence(`Em “${label}”, ${name(entry)} tem a função de ${lower(purpose)}`);
  }).join(' ');
}

function depthResponses(entries, context, tensionEntry, revelationEntry, tendencyEntry, counselEntry, action) {
  const responses = {
    cards:cardsDepth(entries, tensionEntry, revelationEntry),
    tendency:tendencyLine(tendencyEntry),
    counsel:counselLine(action, counselEntry),
    position:positionDepth(entries)
  };
  const love = loveDepth(context, tensionEntry, counselEntry);
  if (love) responses.love = love;
  return Object.freeze(responses);
}

export function soulConsultationForCard(entry, {
  human,
  supremeCounsel
} = {}) {
  if (!entry) return null;
  const context = human?.context || {};
  const action = supremeCounsel?.visible?.action || '';
  const opening = humanOpening(context, name(entry));
  const lead = cardInPosition(entry);
  const conflict = tensionLine(entry);
  const revelation = revelationLine(entry, entry);
  const tendency = tendencyLine(entry);
  const counsel = counselLine(action, entry);
  const closing = closingLine(context);
  const paragraphs = Object.freeze(context.hasContext
    ? [conflict, tendency, counsel]
    : [tendency, counsel]);
  const responses = depthResponses([entry], context, entry, entry, entry, entry, action);
  return Object.freeze({
    engine:SOUL_CONSULTATION_ENGINE_NAME,
    version:SOUL_CONSULTATION_ENGINE_VERSION,
    visible:Object.freeze({
      opening,
      tension:lead,
      paragraphs,
      story:paragraphs.join('\n\n'),
      tendency,
      counsel,
      closing
    }),
    depthResponses:responses,
    profile:Object.freeze({
      territory:context.territory || 'general',
      intent:context.intent || 'general',
      cardsConsidered:1,
      humanFirst:true,
      tarotIlluminates:true,
      technicalLanguageVisible:false,
      singleVoice:true,
      literalConsciousnessClaim:false
    })
  });
}

export function soulConsultationSpread(positioned, {
  human,
  narrative,
  supremeCounsel
} = {}) {
  const entries = positioned?.entries || [];
  if (!entries.length) return null;
  if (entries.length === 1) return soulConsultationForCard(entries[0], { human, supremeCounsel });
  const arc = narrative?.arcProfile || {};
  const context = human?.context || {};
  const at = node => entries[node?.index ?? 0] || entries[0];
  const openingEntry = at(arc.beginning);
  const tensionEntry = at(arc.tension);
  const revelationEntry = at(arc.revelation);
  const tendencyEntry = at(arc.tendency);
  const counselEntry = at(arc.counsel);
  const action = supremeCounsel?.visible?.action || '';
  const opening = humanOpening(context, name(openingEntry));
  const lead = cardInPosition(openingEntry);
  const tension = tensionLine(tensionEntry);
  const revelation = revelationLine(revelationEntry, tensionEntry);
  const sequence = sequenceLine(entries, revelationEntry);
  const tendency = tendencyLine(tendencyEntry);
  const counsel = counselLine(action, counselEntry);
  const closing = closingLine(context);
  const paragraphs = Object.freeze(
    context.intent === 'general' && sequence
      ? [sequence, tendency, counsel]
      : [tension, sequence || revelation, tendency, counsel]
  );
  return Object.freeze({
    engine:SOUL_CONSULTATION_ENGINE_NAME,
    version:SOUL_CONSULTATION_ENGINE_VERSION,
    visible:Object.freeze({
      opening,
      tension:lead,
      paragraphs,
      story:paragraphs.join('\n\n'),
      tendency,
      counsel,
      closing
    }),
    depthResponses:depthResponses(entries, context, tensionEntry, revelationEntry, tendencyEntry, counselEntry, action),
    profile:Object.freeze({
      territory:context.territory || 'general',
      intent:context.intent || 'general',
      cardsConsidered:entries.length,
      humanFirst:true,
      tarotIlluminates:true,
      technicalLanguageVisible:false,
      singleVoice:true,
      literalConsciousnessClaim:false
    })
  });
}

export function soulConsultationCapacity() {
  return Object.freeze({
    cards:78,
    humanIntentions:Object.keys(HUMAN_OPENING).length,
    lifeTerritories:Object.keys(TERRITORY_CLOSING).length,
    humanFirst:true,
    tarotIlluminates:true,
    technicalLanguageVisible:false,
    singleVoice:true,
    literalConsciousnessClaim:false,
    rule:'Whit olha para a pessoa, deixa as cartas iluminarem sua compreensão e responde com uma história que pode ser vivida'
  });
}
