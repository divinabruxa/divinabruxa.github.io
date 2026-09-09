/* DIVINA BRUXA V192 — CATÁLOGO EDITORIAL CANÔNICO
   Somente itens publicados ou curadorias revisadas chegam à interface pública. */

const freezeItems = items => Object.freeze(items.map(item => Object.freeze({
  ...item,
  tags: item.tags ? Object.freeze([...item.tags]) : undefined
})));

export const EDITORIAL_RELEASE_V192 = Object.freeze({
  version: 'V192',
  environment: 'editorial-staging',
  reviewedAt: '2026-09-09',
  language: 'pt-BR',
  contactEmail: 'orbedasrealidades@hotmail.com',
  productionPublished: false,
  externalWrites: false
});

export const STORE_PRODUCTS_V192 = freezeItems([
  {id:'tarot-rider',name:'Tarot Rider–Waite–Smith',category:'Baralhos',symbol:'☼',search:'tarot rider waite smith português',description:'O clássico para começar, estudar símbolos e aprofundar leituras.',why:'Bom ponto de partida para acompanhar a Biblioteca e a Escola.',note:'Compare edição, idioma, tamanho e qualidade de impressão.',tags:['baralho','iniciante','estudo'],featured:true},
  {id:'tarot-marselha',name:'Tarot de Marselha',category:'Baralhos',symbol:'✦',search:'tarot de marselha português',description:'Uma tradição visual histórica para ampliar repertório e comparação.',why:'Útil para observar diferenças reais entre sistemas de Tarot.',note:'Confira editora, idioma e imagens da edição antes da compra.',tags:['baralho','tradicional','estudo']},
  {id:'livro-tarot',name:'Livros para estudar Tarot',category:'Livros',symbol:'⌘',search:'livro tarot guia completo português',description:'Guias de Arcanos, combinações e exercícios para criar repertório.',why:'Apoio físico para continuar as aulas e anotações fora da tela.',note:'Leia a sinopse, o sumário e a autoria no anúncio parceiro.',tags:['estudo','significados','livro'],featured:true},
  {id:'diario-tarot',name:'Diário de Tarot e gratidão',category:'Livros',symbol:'☾',search:'diário tarot gratidão capa dura',description:'Um espaço físico para registrar cartas, sonhos e sincronicidades.',why:'Ajuda a transformar observações em uma prática pessoal contínua.',note:'Verifique número de páginas, tamanho e tipo de papel.',tags:['diário','ritual','escrita']},
  {id:'ametista',name:'Ametista natural',category:'Cristais',symbol:'◆',search:'ametista natural decoração',description:'Uma presença violeta para compor altar ou espaço de leitura.',why:'Escolha estética e contemplativa; não é apresentada como tratamento.',note:'Cristais naturais variam em cor, tamanho, peso e formato.',tags:['pedra','altar','decoração']},
  {id:'quartzo',name:'Quartzo transparente',category:'Cristais',symbol:'◇',search:'quartzo transparente natural ponta',description:'Peça luminosa para decoração, coleção e práticas pessoais.',why:'Pode marcar visualmente o espaço dedicado a estudo ou ritual.',note:'Origem, lapidação e dimensões devem ser conferidas no anúncio.',tags:['pedra','coleção','decoração']},
  {id:'velas',name:'Velas decorativas para ritual',category:'Ritual',symbol:'♨',search:'kit velas decorativas ritual',description:'Luz e atmosfera para criar um momento de presença antes da leitura.',why:'Apoia o ambiente do ritual sem prometer qualquer efeito sobrenatural.',note:'Nunca deixe vela acesa sem supervisão; confira materiais e avisos.',tags:['vela','altar','ambiente'],featured:true},
  {id:'incensario',name:'Incensário e porta-incenso',category:'Ritual',symbol:'〰',search:'porta incenso esotérico lua',description:'Uma base para organizar o uso de aromas no ambiente.',why:'Protege a superfície e ajuda a manter o espaço ritual organizado.',note:'Use em local ventilado e confira material, estabilidade e cuidados.',tags:['incenso','aroma','segurança']},
  {id:'toalha',name:'Toalha para mesa de Tarot',category:'Acessórios',symbol:'✧',search:'toalha mesa tarot astrológica',description:'Delimita o espaço da tiragem e ajuda a proteger as cartas.',why:'Cria contraste visual e uma superfície consistente para a mesa.',note:'Confira medidas e material para o tamanho do seu baralho.',tags:['mesa','tiragem','proteção']},
  {id:'caixa',name:'Caixa para guardar baralho',category:'Acessórios',symbol:'▣',search:'caixa madeira tarot baralho',description:'Organização e proteção para o seu deck favorito.',why:'Ajuda a reduzir poeira, luz direta e desgaste no armazenamento.',note:'Compare as medidas internas com o baralho e acessórios.',tags:['caixa','baralho','conservação']},
  {id:'luminaria-lua',name:'Luminária de Lua',category:'Decoração',symbol:'☽',search:'luminária lua decoração',description:'Uma luz suave para transformar quarto, estúdio ou espaço ritual.',why:'Iluminação ambiente para leitura, música e momentos de pausa.',note:'Confira alimentação, voltagem, dimensões e intensidade.',tags:['luz','quarto','ambiente'],featured:true},
  {id:'decoracao-celestial',name:'Decoração celestial',category:'Decoração',symbol:'✺',search:'decoração celestial lua estrelas',description:'Lua, estrelas e constelações para levar o universo da Orbe ao ambiente.',why:'Uma curadoria visual para criar identidade sem depender de um SKU.',note:'A cena editorial do site não representa o produto exato.',tags:['casa','presente','celestial']},
  {id:'iphone-criacao',name:'iPhone para criação',category:'Apple & Tecnologia',symbol:'◉',search:'Apple iPhone câmera',description:'Opções de smartphone Apple para gravar conteúdos e organizar a rotina.',why:'A busca é ampla para você comparar gerações, memória e câmera atuais.',note:'Modelo, cor, memória, preço, vendedor e garantia são confirmados na Amazon.',tags:['apple','iphone','vídeo','criação'],featured:true},
  {id:'macbook-criacao',name:'MacBook para criação',category:'Apple & Tecnologia',symbol:'⌘',search:'Apple MacBook notebook',description:'Opções de notebook Apple para edição, escrita, música e administração.',why:'A curadoria evita indicar como atual uma configuração que pode mudar.',note:'Compare chip, memória, armazenamento, teclado, vendedor e garantia.',tags:['apple','macbook','computador','criação'],featured:true},
  {id:'ipad-estudo',name:'iPad para estudo',category:'Apple & Tecnologia',symbol:'▣',search:'Apple iPad tablet',description:'Opções de tablet Apple para leitura, criação visual e organização.',why:'A busca permite escolher a geração adequada ao uso e ao orçamento.',note:'Confira geração, tela, armazenamento, acessórios e compatibilidade.',tags:['apple','ipad','tablet','estudo']},
  {id:'watch-rotina',name:'Apple Watch para rotina',category:'Apple & Tecnologia',symbol:'◫',search:'Apple Watch',description:'Opções de relógio Apple para organização, atividade e conectividade.',why:'A página parceira mostra os modelos realmente disponíveis no momento.',note:'Compare tamanho, conectividade, compatibilidade e recursos de saúde.',tags:['apple','watch','rotina']},
  {id:'airpods-escuta',name:'Fones Apple para escuta',category:'Apple & Tecnologia',symbol:'♫',search:'Apple AirPods fone',description:'Opções de áudio Apple para ouvir música, estudar e criar atmosferas.',why:'A busca ampla permite comparar formatos e gerações disponíveis.',note:'Confira tipo, compatibilidade, autonomia, vendedor e garantia.',tags:['apple','fone','música']},
  {id:'telescopio',name:'Telescópio astronômico',category:'Presentes Premium',symbol:'✺',search:'telescópio astronômico',description:'Uma janela real para observar a Lua, planetas e estrelas.',why:'Convite para contemplação e astronomia sem prometer desempenho específico.',note:'Abertura, montagem, acessórios e adequação ao uso devem ser comparados.',tags:['astronomia','presente','premium'],featured:true},
  {id:'cristal-premium',name:'Geodo de ametista',category:'Presentes Premium',symbol:'◆',search:'geodo ametista natural grande',description:'Peça mineral de presença marcante para altar, estúdio ou coleção.',why:'Curadoria estética para quem procura uma peça natural de destaque.',note:'Tamanho, peso, origem e tonalidade variam em cada peça.',tags:['cristal','ametista','decoração','premium']},
  {id:'projetor-estrelas',name:'Projetor de estrelas',category:'Presentes Premium',symbol:'✦',search:'projetor estrelas galáxia',description:'Luz ambiente para transformar o espaço em um céu particular.',why:'Acompanha escuta, leitura e descanso como recurso de ambientação.',note:'Confira área de projeção, alimentação, controles e avaliações.',tags:['luz','galáxia','decoração']},
  {id:'kit-tarot-premium',name:'Kit de Tarot para presente',category:'Presentes Premium',symbol:'☽',search:'kit tarot completo caixa livro cristais',description:'Conjuntos com baralho e acessórios para presentear ou iniciar a prática.',why:'Ponto de partida para comparar o que realmente vem em cada kit.',note:'Conteúdo, idioma, edição, qualidade e dimensões variam por anúncio.',tags:['tarot','kit','presente','premium']}
].map(item => ({...item,availability:'partner-confirmation',reviewedAt:'2026-09-09'})));

export const MUSIC_ALBUMS_V192 = freezeItems([
  {name:'Sobre as Estrelas',artist:'Hércules DX',id:'0GwJtJujeS9iwSZFADcL1k',releaseYear:2024,status:'published',url:'https://open.spotify.com/album/0GwJtJujeS9iwSZFADcL1k',context:'Um álbum para escuta contemplativa, escrita e travessias noturnas.',credits:'Catálogo oficial de Hércules DX no Spotify.',verifiedAt:'2026-09-09'},
  {name:'Z',artist:'Hércules DX',id:'4mq0UaLMXK21JbrKMFdhdO',releaseYear:2026,status:'published',url:'https://open.spotify.com/album/4mq0UaLMXK21JbrKMFdhdO',context:'Canções sobre encontro, desejo e movimento para ouvir como obra completa.',credits:'Catálogo oficial de Hércules DX no Spotify.',verifiedAt:'2026-09-09'}
]);

export const VIDEO_SERIES_V192 = Object.freeze({
  id: 'de-frente-com-o-tarot',
  name: 'De Frente com o Tarot',
  status: 'pilot-preparation',
  publicEpisodeCount: 0,
  channel: 'https://www.youtube.com/@divinabruxa33',
  episodes: Object.freeze([]),
  publicationRule: 'Somente episódios publicados, revisados e com URL oficial aparecem.',
  accessibilityRule: 'Cada episódio público deve ter resumo textual e legenda ou transcrição revisada.'
});

export const EDITORIAL_RHYTHM_V192 = freezeItems([
  {id:'biblioteca-em-foco',day:'Segunda',sigil:'◇',title:'Biblioteca em foco',description:'Uma carta, símbolo ou combinação já publicada ganha um novo caminho de leitura.',destination:'library',href:'./#library',publication:'evergreen'},
  {id:'pratica-guiada',day:'Quarta',sigil:'▤',title:'Prática guiada',description:'A Escola transforma repertório em exercício, revisão e observação aplicada.',destination:'school',href:'./#school',publication:'evergreen'},
  {id:'escuta-autoral',day:'Sexta',sigil:'♫',title:'Escuta autoral',description:'Um álbum oficial acompanha escrita, pausa ou ritual sem promessa terapêutica.',destination:'music',href:'./#music',publication:'published-catalog'},
  {id:'caderno-de-frente',day:'Domingo',sigil:'▶',title:'Caderno De Frente',description:'Bastidores editoriais e episódios entram apenas quando a publicação estiver confirmada.',destination:'videos',href:'./#videos',publication:'when-published'}
]);

export const EDITORIAL_CONVERSION_TARGETS_V192 = Object.freeze([
  'store_amazon',
  'spotify_album',
  'youtube_channel',
  'library_path',
  'school_path',
  'store_guide',
  'music_guide',
  'video_guide'
]);

export const VIDEO_EPISODES_V192 = VIDEO_SERIES_V192.episodes;
