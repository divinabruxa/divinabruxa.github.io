/* DIVINA BRUXA — SÍNTESE ESTRUTURAL RESPONSÁVEL V185 */
const plural = (amount, one, many) => amount === 1 ? one : many;
const strengthPattern = /favorece|recurso|força|talento|dom|apoio|possibilidade|consciente/i;
const tensionPattern = /desafio|limite|sombra|padrão|medos|bloqueio|tensão/i;

function mostFrequent(entries, fallback) {
  return [...entries].sort((left, right) => right[1] - left[1] || String(left[0]).localeCompare(String(right[0]), 'pt-BR'))[0] || fallback;
}

function responsibleNotice(tone) {
  if (tone === 'love') return 'A leitura ilumina a sua percepção do vínculo, mas não prova sentimentos, fidelidade ou intenção de outra pessoa. Considere comunicação, consentimento e comportamento observável.';
  if (tone === 'money') return 'A leitura é simbólica e não constitui orientação financeira. Confirme números, contratos, riscos e apoio profissional antes de decisões materiais.';
  if (tone === 'career') return 'Use a leitura para organizar perguntas e ações; ela não garante contratação, promoção, resultado profissional ou decisão de terceiros.';
  if (tone === 'spirituality') return 'Símbolos podem apoiar autoconhecimento, mas não comprovam mensagens externas nem substituem realidade, cuidado ou discernimento.';
  return 'Esta síntese organiza símbolos e padrões; não determina destino, não comprova fatos ocultos e não substitui orientação médica, psicológica, jurídica ou financeira.';
}

export function synthesizeSpread(items, context = {}) {
  const validItems = Array.isArray(items) ? items.filter(item => item?.card && item?.position) : [];
  const suitCounts = new Map();
  const elementCounts = new Map();
  const rankCounts = new Map();
  let majors = 0;
  let courts = 0;
  for (const { card } of validItems) {
    if (card.arcanaCode === 'major' || card.suit === 'Maiores') majors += 1;
    if (card.court) courts += 1;
    suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
    if (card.element) elementCounts.set(card.element, (elementCounts.get(card.element) || 0) + 1);
    if (Number.isInteger(card.number)) rankCounts.set(card.number, (rankCounts.get(card.number) || 0) + 1);
  }
  const dominant = mostFrequent(suitCounts, ['Maiores', 0]);
  const element = mostFrequent(elementCounts, ['indefinido', 0]);
  const repeatedNumber = [...rankCounts].filter(([, amount]) => amount > 1).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0] || null;
  const opening = majors
    ? `${majors} ${plural(majors, 'Arcano Maior coloca', 'Arcanos Maiores colocam')} escolhas estruturais no centro desta leitura.`
    : 'Os Arcanos Menores aproximam a leitura de comportamentos, relações e acontecimentos cotidianos.';
  const pattern = `O campo mais presente é ${dominant[0]}, com ${dominant[1]} ${plural(dominant[1], 'carta', 'cartas')}; o elemento ${element[0]} concentra a energia principal.${courts ? ` ${courts} ${plural(courts, 'carta da corte destaca', 'cartas da corte destacam')} atitudes, maturidade e modos de agir.` : ''}${repeatedNumber ? ` O número ${repeatedNumber[0]} se repete ${repeatedNumber[1]} vezes e merece observação como ritmo, não como previsão.` : ''}`;
  const first = validItems[0];
  const last = validItems.at(-1);
  const movement = first && last
    ? first === last
      ? `${first.card.name} ocupa ${first.position}: aprofunde essa única relação antes de buscar uma resposta maior do que a posição oferece.`
      : `A leitura começa com ${first.card.name} em ${first.position} e termina com ${last.card.name} em ${last.position}. Observe o que precisa mudar entre esses dois pontos, sem tratar a última carta como sentença.`
    : 'A síntese precisa de cartas e posições válidas para reconhecer um movimento.';
  const strength = validItems.find(item => strengthPattern.test(item.position));
  const tension = validItems.find(item => tensionPattern.test(item.position));
  const bridge = strength && tension
    ? `Integre ${strength.card.name} em ${strength.position} com ${tension.card.name} em ${tension.position}: use o recurso sem ignorar o limite.`
    : 'Compare as posições que oferecem apoio e tensão. A carta muda de função conforme o lugar que ocupa na estrutura.';
  const integration = 'Leia cada carta dentro de sua posição, depois verifique repetições, contrastes e a pergunta original. A síntese reúne padrões para apoiar uma escolha consciente, concreta e respeitosa com seus limites.';
  const action = context.question
    ? 'Retome a pergunta escrita e complete: “Depois desta leitura, a ação pequena que depende de mim é…”. Escolha algo observável e possível.'
    : 'Escreva em uma frase o padrão central da tiragem e transforme-o em uma ação pequena, observável e possível para o presente.';
  return Object.freeze({
    opening,
    pattern,
    movement,
    bridge,
    integration,
    action,
    responsibleNotice: responsibleNotice(context.tone),
    dominantSuit: dominant[0],
    dominantElement: element[0],
    majorCount: majors,
    courtCount: courts,
    repeatedNumber: repeatedNumber?.[0] ?? null
  });
}
