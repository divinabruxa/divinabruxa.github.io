const rows = [
  ['tarot-rider','Tarot Rider-Waite','Baralhos','☼','tarot rider waite português','O clássico para começar, estudar símbolos e aprofundar leituras.',['baralho','iniciante'],true],
  ['tarot-marselha','Tarot de Marselha','Baralhos','✦','tarot de marselha português','Tradição, cores marcantes e uma linguagem visual histórica.',['baralho','tradicional']],
  ['livro-tarot','Livros para estudar Tarot','Livros','⌘','livro tarot guia completo português','Guias de Arcanos, combinações e exercícios para criar repertório.',['estudo','significados'],true],
  ['diario-tarot','Diário de Tarot e Gratidão','Livros','☾','diário tarot gratidão capa dura','Um espaço físico para registrar cartas, sonhos e sincronicidades.',['diário','ritual']],
  ['ametista','Ametista natural','Cristais','◆','ametista natural decoração','Uma presença violeta para compor seu altar ou espaço de leitura.',['pedra','altar']],
  ['quartzo','Quartzo transparente','Cristais','◇','quartzo transparente natural ponta','Peça luminosa para decoração, coleção e práticas pessoais.',['pedra','coleção']],
  ['velas','Velas para ritual','Ritual','♨','kit velas decorativas ritual','Luz e atmosfera para criar um momento de presença antes da leitura.',['vela','altar'],true],
  ['incensario','Incensário e porta-incenso','Ritual','〰','porta incenso esotérico lua','Uma base bonita e segura para perfumar o ambiente.',['incenso','aroma']],
  ['toalha','Toalha para mesa de Tarot','Acessórios','✧','toalha mesa tarot astrológica','Delimita o espaço da tiragem e protege suas cartas.',['mesa','tiragem']],
  ['caixa','Caixa para guardar baralho','Acessórios','▣','caixa madeira tarot baralho','Organização e proteção para o seu deck favorito.',['caixa','baralho']],
  ['luminaria-lua','Luminária Lua','Decoração','☽','luminária lua 3d','Uma luz suave para transformar o quarto ou espaço ritual.',['luz','quarto'],true],
  ['decoracao-celestial','Decoração celestial','Decoração','✺','decoração celestial lua estrelas','Lua, estrelas e constelações para levar o universo da Orbe ao ambiente.',['casa','presente']],
  ['iphone-pro','Seleção iPhone Pro','Apple & Tecnologia','◉','Apple iPhone Pro','Compare aparelhos para criação de conteúdo, vídeo e rotina móvel.',['apple','iphone','vídeo'],true],
  ['macbook-pro','Seleção MacBook Pro','Apple & Tecnologia','⌘','Apple MacBook Pro','Compare configurações destinadas à edição, música e administração.',['apple','macbook','computador'],true],
  ['ipad-pro','Seleção iPad Pro','Apple & Tecnologia','▣','Apple iPad Pro','Compare telas e configurações para estudo, criação visual e organização.',['apple','ipad','tablet']],
  ['watch-ultra','Seleção Apple Watch Ultra','Apple & Tecnologia','◫','Apple Watch Ultra','Compare versões e condições de relógios para a rotina conectada.',['apple','watch']],
  ['airpods-max','Seleção AirPods Max','Apple & Tecnologia','♫','Apple AirPods Max','Compare opções de áudio para ouvir, editar e criar atmosferas.',['apple','fone','música']],
  ['telescopio','Telescópio astronômico','Presentes Premium','✺','telescópio astronômico profissional','Uma janela real para a Lua, planetas e estrelas.',['astronomia','presente'],true],
  ['cristal-premium','Geodo de ametista','Presentes Premium','◆','geodo ametista natural grande','Peça mineral de presença marcante para altar, estúdio ou coleção.',['cristal','ametista','decoração']],
  ['projetor-estrelas','Projetor de galáxia','Presentes Premium','✦','projetor galáxia estrelas premium','Luz ambiente para transformar o espaço em um céu particular.',['luz','galáxia','decoração']],
  ['kit-tarot-premium','Kit Tarot Premium','Presentes Premium','☽','kit tarot premium completo caixa livro cristais','Baralho, acessórios e apresentação especial para presentear ou aprofundar a prática.',['tarot','kit','presente']]
];

export const STORE_PRODUCTS = Object.freeze(rows.map(([id,name,category,symbol,search,description,tags,featured=false]) => Object.freeze({id,name,category,symbol,search,description,tags:Object.freeze(tags),featured})));
export const STORE_CATEGORIES = Object.freeze(['Tudo', ...new Set(STORE_PRODUCTS.map(product => product.category))]);

export function amazonSearchUrl(query, tag) {
  const url = new URL('https://www.amazon.com.br/s');
  url.searchParams.set('k', query);
  if (tag) url.searchParams.set('tag', tag);
  return url.href;
}
