import { CARDS } from './tarot-data.js';

const PAGES = Object.freeze([
  ['Divina Bruxa', './', 'Portal', 'portal', 'Tarot Livre, Carta do Dia, 78 cartas, tiragens, escola e consultas. início home orbe'],
  ['As 78 cartas do Tarot', 'cartas-do-tarot.html', 'Biblioteca', 'aprender', 'Significados de todas as cartas diretas, Arcanos Maiores, Arcanos Menores e naipes. baralho catálogo'],
  ['Tarot Livre', 'tarot-livre.html', 'Experiência', 'portal', 'Abra as 78 cartas oficiais, diretas e sem repetição, no seu ritmo. jogo grátis online mesa real 13 × 6'],
  ['Carta do Dia', 'carta-do-dia.html', 'Experiência', 'portal', 'Revele uma carta para observar a energia simbólica do dia. hoje diária'],
  ['Tiragens de Tarot', 'tiragens-de-tarot.html', '15 métodos', 'tiragens', 'Uma Carta, Passado Presente Tendência, Triângulo Mágico, Situação Desafio Conselho, Caminho em Cinco, Dois Caminhos, Amor, Trabalho, Dinheiro, Espiritualidade, Mandala, Árvore da Vida, Cruz Celta, Mesa Personalizada e Mesa Real.'],
  ['Escola do Tarot', 'escola-do-tarot.html', 'Aprender', 'aprender', 'Trilha de estudo com fundamentos, 78 cartas, símbolos, combinações, métodos e ética. curso aulas módulos'],
  ['Consultas de Tarot', 'consultas-de-tarot.html', 'Atendimento e protocolo', 'portal', 'Serviços, valores, solicitação durável, confirmação por e-mail e acompanhamento privado por protocolo. Estados recebida, aguardando confirmação, confirmada, concluída ou cancelada. Mesa Real, Leitura de Mentes, Conselho e Pergunta Direta.'],
  ['Sobre a Divina Bruxa', 'sobre-a-divina-bruxa.html', 'Portal', 'portal', 'Propósito da Orbe das Realidades e princípios do projeto. quem somos'],
  ['Metodologia do Tarot', 'metodologia-do-tarot.html', 'Método', 'aprender', 'Cartas diretas, contexto, luz, tensão, posições, combinações, síntese e limites.'],
  ['Ética e responsabilidade', 'etica-e-responsabilidade.html', 'Portal', 'portal', 'Autonomia, consentimento, privacidade, linguagem não determinista e limites das leituras.'],
  ['Contato oficial', 'contato.html', 'Portal', 'portal', 'Canal oficial para consultas, dúvidas e informações sobre a Divina Bruxa. e-mail'],
  ['Privacidade e dados', 'privacidade-e-dados.html', 'Portal', 'portal', 'Dados guardados no aparelho, informações enviadas em consultas e direitos de privacidade.'],
  ['Termos de Uso', 'termos-de-uso.html', 'Portal', 'portal', 'Regras de uso, limites do conteúdo simbólico, recursos gratuitos e links externos.'],
  ['Acessibilidade', 'acessibilidade.html', 'Portal', 'portal', 'Recursos de acessibilidade e canal para comunicar uma barreira encontrada.'],
  ['Guias para começar', 'guias-para-comecar.html', 'Aprender', 'aprender', 'Jornada inicial em cinco passos para conhecer o baralho e praticar com autonomia.'],
  ['Tarot para iniciantes', 'tarot-para-iniciantes.html', 'Aprender', 'aprender', 'Aprenda Tarot do zero, estrutura das 78 cartas, quatro naipes e prática de uma carta. básico começar'],
  ['Como fazer perguntas ao Tarot', 'como-fazer-perguntas-ao-tarot.html', 'Aprender', 'aprender', 'Perguntas abertas para amor, trabalho e decisões com clareza e autonomia. exemplos'],
  ['Arcanos Maiores', 'arcanos-maiores.html', '22 cartas', 'aprender', 'A jornada simbólica das 22 cartas, do Louco ao Mundo.'],
  ['Arcanos Menores', 'arcanos-menores.html', '56 cartas', 'aprender', 'Quatro naipes, cartas numeradas e figuras da corte.'],
  ['Naipe de Paus', 'naipe-de-paus.html', '14 cartas', 'aprender', 'Elemento Fogo, energia, coragem, criatividade e ação. Ás ao Rei.'],
  ['Naipe de Copas', 'naipe-de-copas.html', '14 cartas', 'aprender', 'Elemento Água, emoções, vínculos e intuição. Ás ao Rei.'],
  ['Naipe de Espadas', 'naipe-de-espadas.html', '14 cartas', 'aprender', 'Elemento Ar, pensamento, verdade e decisões. Ás ao Rei.'],
  ['Naipe de Ouros', 'naipe-de-ouros.html', '14 cartas', 'aprender', 'Elemento Terra, corpo, trabalho e recursos. Ás ao Rei. pentáculos moedas'],
  ['Numerologia no Tarot', 'numerologia-no-tarot.html', 'Aprender', 'aprender', 'Significados dos números do Ás ao 10 combinados com os quatro naipes.'],
  ['Figuras da Corte', 'figuras-da-corte-no-tarot.html', '16 cartas', 'aprender', 'Pajem, Cavaleiro, Rainha e Rei como atitudes, papéis, estágios ou pessoas.'],
  ['Combinações de cartas', 'combinacoes-de-cartas-no-tarot.html', 'Aprender', 'aprender', 'Una duas ou mais cartas por imagem, posição, reforço, contraste e sequência.'],
  ['Glossário do Tarot', 'glossario-do-tarot.html', '62 termos', 'aprender', 'Definições claras sobre cartas, naipes, tiragens, símbolos e leitura responsável. arcano arquétipo autonomia baralho cartomancia consentimento consulente contexto correspondência desafio elemento energia figura da corte intenção interpretação intuição leitura luz tensão método oráculo orientação direta pergunta aberta posição previsão querente reciprocidade repetição significado símbolo síntese tendência'],
  ['História do Tarot', 'historia-do-tarot.html', 'História documentada', 'aprender', 'Origem do Tarot no norte da Itália, registros de 1440 e 1450, jogo de vazas, Visconti-Sforza, Tarot de Marselha, Nicolas Conver, cartomancia, ocultismo, fatos, mitos, evidências, museus e fontes. Egito antigo renascimento renascentista'],
  ['Símbolos do Tarot', 'simbolos-do-tarot.html', '32 símbolos', 'aprender', 'Biblioteca visual pesquisável com Sol, Lua, Estrela, relâmpago, nuvens, água, montanha, caminho, jardim, árvore, fogo, taça, espada, bastão, moeda, coroa, trono, lanterna, livro, pergaminho, balança, roda, correntes, véu, cavalo, leão, asas, mãos e gestos. imagem iconografia observação interpretação'],
  ['Tipos de Tarot', 'tipos-de-tarot.html', 'Marselha · RWS · Thoth', 'aprender', 'Compare Tarot de Marselha, Rider-Waite-Smith e Thoth: história, autoria, Pamela Colman Smith, Arthur Edward Waite, Lady Frieda Harris, Aleister Crowley, Arcanos Menores, cartas numeradas, cenas, símbolos, nomes, ordem, corte, Discos, Ajustamento, Luxúria, Éon e Universo. tipos de baralho tradição visual linhagem diferenças qual escolher'],
  ['Como escolher um baralho de Tarot', 'como-escolher-um-baralho-de-tarot.html', 'Guia interativo', 'aprender', 'Teste local para descobrir afinidade com Marselha, Rider-Waite-Smith ou Thoth, comparar cartas numeradas, formato físico ou digital, tamanho, idioma, créditos, livreto e qualidade antes da compra. primeiro baralho escolher comprar presente consagrar limpar checklist'],
  ['Como embaralhar cartas de Tarot', 'como-embaralhar-cartas-de-tarot.html', '4 métodos', 'aprender', 'Guia acessível para embaralhar 78 cartas com mistura circular na mesa, pacotes pelas mãos, intercalação apoiada e distribuição em montes; corte, cartas grandes, mãos pequenas, mobilidade, conservação, posição direta e prática de 90 segundos. shuffle riffle quantas vezes sete limpar consagrar carta caiu invertida baralho grande cortar baralho'],
  ['Plano de estudo do Tarot em 30 dias', 'plano-de-estudo-do-tarot-em-30-dias.html', '30 dias · 10–30 min', 'aprender', 'Plano gratuito e interativo para estudar Tarot em 30 dias com sessões de 10, 20 ou 30 minutos, revisão espaçada, prática de memória, Arcanos Maiores, Arcanos Menores, naipes, números, figuras da corte, símbolos, perguntas, tiragens, combinações e ética. como cronograma rotina curso aprender memorizar decorar cartas caderno iniciante'],
  ['Diário de Tarot', 'diario-de-tarot.html', 'Diário privado e 4 modelos de ficha', 'aprender', 'Guia e Diário de Tarot privado com autosave local, busca sem acento, filtros, calendário, linha do tempo, favoritos, relações entre memórias, revisões separadas, Espelho Celestial, cópia JSON, backup, restauração, mesclar, excluir dados e funcionamento offline; gerador local de fichas para uma carta, três cartas, estudo e revisão. como fazer anotar escrever revisar leituras journaling journal celular papel cofre portabilidade'],
  ['Como limpar e consagrar um baralho de Tarot', 'como-limpar-consagrar-baralho-de-tarot.html', 'Guia de cuidado', 'aprender', 'Separe limpeza física, consagração simbólica e guarda; monte uma rotina local segura e evite sol direto, água, umidade, fumaça, cinzas, sal, cristais sobre as cartas, óleos, álcool, calor e pressão. como limpar energizar consagrar guardar proteger cuidar baralho tarot novo primeira leitura outra pessoa tocar incenso lua ritual caixa conservação'],
  ['Cartas invertidas no Tarot', 'cartas-invertidas-no-tarot.html', '4 lentes · 16 exemplos', 'aprender', 'Entenda se cartas invertidas são obrigatórias e pratique um método de leitura somente com cartas diretas usando imagem, posição, contexto, potência e tensão. carta de cabeça para baixo reversa reverso inversão significado negativo positivo bloqueio interiorização atraso excesso falta tarot sem invertidas por que Divina Bruxa não usa invertidas laboratório Sol Lua 5 de Copas 2 de Espadas'],
  ['Como memorizar as 78 cartas do Tarot', 'como-memorizar-as-cartas-do-tarot.html', '9 sessões de estudo', 'aprender', 'Aprenda a memorizar cartas do Tarot com recordação ativa, revisão espaçada, comparação por famílias, cartões de erro e planejador local para sessões de 10, 20 ou 30 minutos. decorar lembrar significados estudar revisar flashcards repetição espaçada teste memória 78 cartas arcanos naipes números figuras da corte cronograma iniciante'],
  ['Política editorial e correções', 'politica-editorial.html', 'Transparência', 'portal', 'Conheça a responsabilidade editorial da Divina Bruxa, os critérios de autoria, pesquisa, revisão, uso de inteligência artificial, datas verdadeiras e correção pública de erros. política editorial fontes confiança transparência quem escreveu como foi criado automação IA correções'],
  ['Fontes e referências do Tarot', 'fontes-e-referencias.html', '14 referências', 'aprender', 'Registro público de museus, acervos, pesquisas e documentação usados em história do Tarot, tipos de baralho, aprendizagem, conservação, acessibilidade e qualidade editorial. fontes referências bibliografia evidências V&A British Museum Morgan Met Warburg pesquisa'],
  ['Tiragem de Uma Carta', 'tiragem-de-uma-carta.html', '1 posição', 'tiragens', 'Mensagem central, pergunta, observação e reflexão prática.'],
  ['Tiragem de Três Cartas', 'tiragem-de-tres-cartas.html', '3 posições', 'tiragens', 'Estruturas, relações entre as cartas e síntese final. passado presente tendência'],
  ['Cruz Celta', 'cruz-celta-no-tarot.html', '10 posições', 'tiragens', 'Presente, desafio, base, passado, possibilidade, próximo movimento, atitude, ambiente, esperanças e síntese.'],
  ['Mesa Real', 'mesa-real-no-tarot.html', '78 posições', 'tiragens', 'Baralho completo em 13 fileiras de 6 e diferenças entre Tarot Livre, Premium e consulta.'],
  ['Tarot do Amor', 'tarot-do-amor.html', '6 posições', 'tiragens', 'Você, outra energia, vínculo, forças, limites e tendência. relações relacionamento casal'],
  ['Dois Caminhos', 'tiragem-dois-caminhos.html', '6 posições', 'tiragens', 'Compare forças e desafios de duas opções e defina critérios para decidir. escolha decisão'],
  ['Tarot para Trabalho', 'tarot-para-trabalho.html', '5 posições', 'tiragens', 'Lugar atual, talentos, ambiente, desafio e direção profissional. carreira emprego vocação'],
  ['Tarot para Dinheiro', 'tarot-para-dinheiro.html', '5 posições', 'tiragens', 'Realidade material, recurso, padrão, ação concreta e tendência. finanças recursos'],
  ['Tarot Espiritual', 'tarot-espiritual.html', '5 posições', 'tiragens', 'Presença, aprendizado, sombra, dom e integração. espiritualidade caminho'],
  ['Caminho em Cinco', 'tiragem-caminho-em-cinco.html', '5 posições', 'tiragens', 'Centro da questão, o que favorece, desafio, consciência e próximo passo.'],
  ['Mandala Astrológica', 'mandala-astrologica-no-tarot.html', '12 posições', 'tiragens', 'Identidade, recursos, comunicação, raízes, criação, rotina, relações, transformação, expansão, vocação, comunidade e mundo interior. casas astrologia'],
  ['Árvore da Vida', 'arvore-da-vida-no-tarot.html', '10 posições', 'tiragens', 'Coroa, Sabedoria, Entendimento, Misericórdia, Força, Beleza, Vitória, Esplendor, Fundamento e Manifestação.'],
  ['Mesa Personalizada', 'mesa-personalizada-no-tarot.html', '1–12 posições', 'tiragens', 'Escolha a quantidade de cartas antes da abertura e preserve a ordem das posições. customizada autoral']
]);

const normalize = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const displayDescription = value => {
  const sentenceEnd = value.lastIndexOf('.');
  return sentenceEnd >= 0 ? value.slice(0, sentenceEnd + 1) : value;
};

const cardUrl = card => card.arcanaCode === 'major'
  ? `carta-${card.canonicalId}.html`
  : `carta-${card.canonicalId.replace(/^\d{2}-/, '')}.html`;

const cardDescription = card => {
  const group = card.arcanaCode === 'major' ? 'Arcano Maior' : `${card.arcana} · ${card.suit}`;
  const details = [card.element, card.correspondences?.astrological, card.correspondences?.numerology, card.correspondences?.domain].filter(Boolean).join(' · ');
  return `${group}${details ? ` · ${details}` : ''}`;
};

const entries = Object.freeze([
  ...CARDS.map(card => ({
    title: card.name,
    url: cardUrl(card),
    kind: card.arcanaCode === 'major' ? 'Arcano Maior' : card.suit,
    category: 'cartas',
    description: cardDescription(card),
    icon: card.arcanaCode === 'major' ? '✦' : ({ Copas:'♡', Espadas:'◇', Paus:'♙', Ouros:'⊕' }[card.suit] || '◇'),
    searchable: normalize([card.name, card.names?.en, card.names?.es, card.arcana, card.suit, card.rank, card.number, card.element, card.correspondences?.astrological, card.correspondences?.numerology, card.correspondences?.domain].filter(Boolean).join(' ')),
    featured: false
  })),
  ...PAGES.map(([title,url,kind,category,description], index) => ({
    title, url, kind, category, description: displayDescription(description),
    icon: category === 'tiragens' ? '✧' : category === 'aprender' ? '▤' : '◉',
    searchable: normalize(`${title} ${kind} ${description}`),
    featured: [1,2,3,4,5,6,14,15,26,27,28,29,30,31,32,33,34,35,36,50,51].includes(index)
  }))
]);

const form = document.querySelector('[data-search-form]');
const input = document.querySelector('[data-search-input]');
const clearButton = document.querySelector('[data-search-clear]');
const filterBox = document.querySelector('[data-search-filters]');
const resultsBox = document.querySelector('[data-search-results]');
const emptyBox = document.querySelector('[data-search-empty]');
const countBox = document.querySelector('[data-results-count]');
const kicker = document.querySelector('[data-results-kicker]');
const heading = document.querySelector('[data-results-title]');
let activeFilter = 'todos';

const scoreEntry = (entry, query, tokens) => {
  const title = normalize(entry.title);
  if (!tokens.every(token => entry.searchable.includes(token) || title.includes(token))) return -1;
  let score = 0;
  if (title === query) score += 100;
  if (title.startsWith(query)) score += 55;
  if (title.includes(query)) score += 35;
  for (const token of tokens) {
    if (title.split(' ').includes(token)) score += 14;
    else if (title.includes(token)) score += 8;
    else score += 2;
  }
  return score;
};

const makeResult = entry => {
  const link = document.createElement('a');
  link.className = 'search-result';
  link.href = entry.url;
  const icon = document.createElement('span');
  icon.className = 'result-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = entry.icon;
  const copy = document.createElement('span');
  copy.className = 'result-copy';
  const kind = document.createElement('small');
  kind.className = 'result-kind';
  kind.textContent = entry.kind;
  const title = document.createElement('h3');
  title.textContent = entry.title;
  const description = document.createElement('p');
  description.textContent = entry.description;
  const arrow = document.createElement('span');
  arrow.className = 'result-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  copy.append(kind, title, description);
  link.append(icon, copy, arrow);
  return link;
};

const updateAddress = query => {
  const url = new URL(window.location.href);
  url.searchParams.delete('q');
  url.hash = query ? `q=${encodeURIComponent(query)}` : '';
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
};

const render = ({ updateUrl = false } = {}) => {
  const raw = input.value.trim();
  const query = normalize(raw);
  const tokens = query.split(' ').filter(Boolean);
  clearButton.hidden = !raw;
  if (updateUrl) updateAddress(raw);
  let matches;
  if (query) {
    matches = entries
      .filter(entry => activeFilter === 'todos' || entry.category === activeFilter)
      .map(entry => ({ entry, score: scoreEntry(entry, query, tokens) }))
      .filter(result => result.score >= 0)
      .sort((a,b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'pt-BR'))
      .map(result => result.entry);
    kicker.textContent = 'RESULTADOS DA BUSCA';
    heading.textContent = `Para “${raw}”`;
  } else {
    matches = activeFilter === 'todos'
      ? entries.filter(entry => entry.featured)
      : entries.filter(entry => entry.category === activeFilter).sort((a,b) => a.title.localeCompare(b.title, 'pt-BR'));
    kicker.textContent = activeFilter === 'todos' ? 'COMECE POR AQUI' : 'EXPLORAR CATEGORIA';
    heading.textContent = activeFilter === 'todos' ? 'Caminhos em destaque' : filterBox.querySelector(`[data-filter="${activeFilter}"]`)?.textContent || 'Resultados';
  }
  resultsBox.replaceChildren(...matches.map(makeResult));
  resultsBox.hidden = matches.length === 0;
  emptyBox.hidden = matches.length !== 0;
  countBox.textContent = query || activeFilter !== 'todos' ? `${matches.length} ${matches.length === 1 ? 'resultado' : 'resultados'}` : `${entries.length} páginas pesquisáveis`;
};

form.addEventListener('submit', event => {
  event.preventDefault();
  render({ updateUrl: true });
  document.querySelector('#results-title')?.focus?.();
});

input.addEventListener('input', () => render());
input.addEventListener('search', () => render({ updateUrl: true }));
clearButton.addEventListener('click', () => { input.value = ''; input.focus(); render({ updateUrl: true }); });
document.querySelector('[data-empty-clear]')?.addEventListener('click', () => { input.value = ''; activeFilter = 'todos'; filterBox.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === 'todos'))); input.focus(); render({ updateUrl: true }); });
filterBox.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  filterBox.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  render();
});

document.addEventListener('keydown', event => {
  if (event.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) { event.preventDefault(); input.focus(); }
  if (event.key === 'Escape' && document.activeElement === input && input.value) { input.value = ''; render({ updateUrl: true }); }
});

const initialQuery = new URLSearchParams(window.location.hash.slice(1)).get('q') || '';
input.value = initialQuery.slice(0, 120);
render();
