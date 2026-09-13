import { COMMERCIAL_TRUTH_V200 } from './commercial-truth-v200.js?v=558';

export const CONFIG=Object.freeze({
  appName:'Orbe das Realidades',
  youtube:'https://www.youtube.com/@divinabruxa33',
  spotify:'https://open.spotify.com/album/0GwJtJujeS9iwSZFADcL1k',
  spotifyAlbumId:'0GwJtJujeS9iwSZFADcL1k',
  spotifyAlbums:[
    {name:'Sobre as Estrelas',artist:'Hércules DX',id:'0GwJtJujeS9iwSZFADcL1k'},
    {name:'Z',artist:'Hércules DX',id:'4mq0UaLMXK21JbrKMFdhdO'}
  ],
  whatsapp:'',
  contactEmail:COMMERCIAL_TRUTH_V200.officialContact.email,
  apiBase:'',
  aiEnabled:true,
  supabaseUrl:'https://kyphdsamyygavmkzyezr.supabase.co',
  supabasePublishableKey:'sb_publishable__UOlBYwmX4dl7txLy_FprA_KS_3EBq6',
  accountFunctionsBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1',
  consultationsApiBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/consultations-booking',
  adminApiBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/admin-api',
  youtubeVideos:[],
  cardPath:'',
  // Troque apenas pelo seu código aprovado de Associado Amazon. Nunca coloque senhas ou chaves API aqui.
  amazonAssociateTag:COMMERCIAL_TRUTH_V200.affiliate.amazonAssociateTag,
  products:[
    {id:'tarot-rider',name:'Tarot Rider-Waite',category:'Baralhos',symbol:'☼',search:'tarot rider waite português',description:'O clássico para começar, estudar símbolos e aprofundar leituras.',note:'Compare edições, idioma e tamanho antes da compra.',tags:['baralho','iniciante'],featured:true},
    {id:'tarot-marselha',name:'Tarot de Marselha',category:'Baralhos',symbol:'✦',search:'tarot de marselha português',description:'Tradição, cores marcantes e uma linguagem visual histórica.',tags:['baralho','tradicional']},
    {id:'livro-tarot',name:'Livros para estudar Tarot',category:'Livros',symbol:'⌘',search:'livro tarot guia completo português',description:'Guias de Arcanos, combinações e exercícios para criar repertório.',tags:['estudo','significados'],featured:true},
    {id:'diario-tarot',name:'Diário de Tarot e Gratidão',category:'Livros',symbol:'☾',search:'diário tarot gratidão capa dura',description:'Um espaço físico para registrar cartas, sonhos e sincronicidades.',tags:['diário','ritual']},
    {id:'ametista',name:'Ametista natural',category:'Cristais',symbol:'◆',search:'ametista natural decoração',description:'Uma presença violeta para compor seu altar ou espaço de leitura.',note:'Cristais naturais variam em cor, tamanho e formato.',tags:['pedra','altar']},
    {id:'quartzo',name:'Quartzo transparente',category:'Cristais',symbol:'◇',search:'quartzo transparente natural ponta',description:'Peça luminosa para decoração, coleção e práticas pessoais.',tags:['pedra','coleção']},
    {id:'velas',name:'Velas para ritual',category:'Ritual',symbol:'♨',search:'kit velas decorativas ritual',description:'Luz e atmosfera para criar um momento de presença antes da leitura.',tags:['vela','altar'],featured:true},
    {id:'incensario',name:'Incensário e porta-incenso',category:'Ritual',symbol:'〰',search:'porta incenso esotérico lua',description:'Uma base bonita e segura para perfumar o ambiente.',tags:['incenso','aroma']},
    {id:'toalha',name:'Toalha para mesa de Tarot',category:'Acessórios',symbol:'✧',search:'toalha mesa tarot astrológica',description:'Delimita o espaço da tiragem e protege suas cartas.',tags:['mesa','tiragem']},
    {id:'caixa',name:'Caixa para guardar baralho',category:'Acessórios',symbol:'▣',search:'caixa madeira tarot baralho',description:'Organização e proteção para o seu deck favorito.',tags:['caixa','baralho']},
    {id:'luminaria-lua',name:'Luminária Lua',category:'Decoração',symbol:'☽',search:'luminária lua 3d',description:'Uma luz suave para transformar o quarto ou espaço ritual.',tags:['luz','quarto'],featured:true},
    {id:'decoracao-celestial',name:'Decoração celestial',category:'Decoração',symbol:'✺',search:'decoração celestial lua estrelas',description:'Lua, estrelas e constelações para levar o universo da Orbe ao ambiente.',tags:['casa','presente']},
    {id:'iphone-pro',name:'Seleção iPhone Pro',category:'Apple & Tecnologia',symbol:'◉',search:'Apple iPhone Pro',description:'Uma busca para comparar aparelhos voltados à criação de conteúdo, vídeo e rotina móvel.',note:'Modelo, cor, memória, condição, preço e disponibilidade são confirmados na Amazon.',tags:['apple','iphone','premium','vídeo'],featured:true},
    {id:'macbook-pro',name:'Seleção MacBook Pro',category:'Apple & Tecnologia',symbol:'⌘',search:'Apple MacBook Pro',description:'Uma busca para comparar configurações destinadas à edição, música e administração do projeto.',note:'Confira geração, memória, armazenamento, vendedor, condição e garantia antes da compra.',tags:['apple','macbook','computador','premium'],featured:true},
    {id:'ipad-pro',name:'Seleção iPad Pro',category:'Apple & Tecnologia',symbol:'▣',search:'Apple iPad Pro',description:'Uma busca para comparar telas e configurações para estudo, criação visual e organização.',note:'Confira geração, tamanho, conectividade, memória e acessórios incluídos.',tags:['apple','ipad','tablet','estudo']},
    {id:'watch-ultra',name:'Seleção Apple Watch Ultra',category:'Apple & Tecnologia',symbol:'◫',search:'Apple Watch Ultra',description:'Uma busca para comparar versões, tamanhos e condições de relógios para a rotina conectada.',note:'Recursos variam por geração, região, configuração e aparelho emparelhado.',tags:['apple','watch','premium']},
    {id:'airpods-max',name:'Seleção AirPods Max',category:'Apple & Tecnologia',symbol:'♫',search:'Apple AirPods Max',description:'Uma busca para comparar opções de áudio para ouvir, editar e criar atmosferas.',note:'Confira condição, cor, vendedor, garantia e compatibilidade antes da compra.',tags:['apple','fone','música','premium']},
    {id:'telescopio',name:'Telescópio astronômico',category:'Presentes Premium',symbol:'✺',search:'telescópio astronômico profissional',description:'Uma janela real para a Lua, planetas e estrelas.',tags:['astronomia','presente','premium'],featured:true},
    {id:'cristal-premium',name:'Geodo de ametista',category:'Presentes Premium',symbol:'◆',search:'geodo ametista natural grande',description:'Peça mineral de presença marcante para altar, estúdio ou coleção.',note:'Tamanho, peso, origem e tonalidade variam por peça.',tags:['cristal','ametista','decoração','premium']},
    {id:'projetor-estrelas',name:'Projetor de galáxia',category:'Presentes Premium',symbol:'✦',search:'projetor galáxia estrelas premium',description:'Luz ambiente para transformar o espaço em um céu particular.',tags:['luz','galáxia','decoração']},
    {id:'kit-tarot-premium',name:'Kit Tarot Premium',category:'Presentes Premium',symbol:'☽',search:'kit tarot premium completo caixa livro cristais',description:'Baralho, acessórios e apresentação especial para presentear ou aprofundar a prática.',tags:['tarot','kit','presente','premium']}
  ],
  plans:COMMERCIAL_TRUTH_V200.plans,
  aiCredits:COMMERCIAL_TRUTH_V200.aiCredits,
  services:COMMERCIAL_TRUTH_V200.services,
  commercialTruth:COMMERCIAL_TRUTH_V200
});
