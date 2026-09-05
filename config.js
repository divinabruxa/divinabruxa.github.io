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
  contactEmail:'orbedasrealidades@hotmail.com',
  apiBase:'',
  consultationsApiBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/consultations-booking',
  adminApiBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/admin-api',
  youtubeVideos:[],
  cardPath:'',
  adminUser:'Isis33',
  // Troque apenas pelo seu código aprovado de Associado Amazon. Nunca coloque senhas ou chaves API aqui.
  amazonAssociateTag:'orbedasrealid-20',
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
    {id:'iphone-pro',name:'iPhone Pro',category:'Apple & Tecnologia',symbol:'◉',search:'Apple iPhone Pro Max',description:'Câmera avançada e alto desempenho para gravar conteúdos, lives e consultas.',note:'Modelo, cor, memória, preço e disponibilidade são confirmados na Amazon.',tags:['apple','iphone','premium','vídeo'],featured:true},
    {id:'macbook-pro',name:'MacBook Pro',category:'Apple & Tecnologia',symbol:'⌘',search:'Apple MacBook Pro chip M4',description:'Estação premium para edição de vídeos, música e administração do seu universo digital.',note:'Confira vendedor, configuração e garantia antes da compra.',tags:['apple','macbook','computador','premium'],featured:true},
    {id:'ipad-pro',name:'iPad Pro',category:'Apple & Tecnologia',symbol:'▣',search:'Apple iPad Pro',description:'Tela ampla e portátil para estudos, criação visual e organização de leituras.',tags:['apple','ipad','tablet','estudo']},
    {id:'watch-ultra',name:'Apple Watch Ultra',category:'Apple & Tecnologia',symbol:'◫',search:'Apple Watch Ultra',description:'Relógio premium para rotina, presença, bem-estar e conectividade.',tags:['apple','watch','premium']},
    {id:'airpods-max',name:'AirPods Max',category:'Apple & Tecnologia',symbol:'♫',search:'Apple AirPods Max',description:'Áudio imersivo para ouvir música, meditar e criar atmosferas.',tags:['apple','fone','música','premium']},
    {id:'telescopio',name:'Telescópio astronômico',category:'Presentes Premium',symbol:'✺',search:'telescópio astronômico profissional',description:'Uma janela real para a Lua, planetas e estrelas.',tags:['astronomia','presente','premium'],featured:true},
    {id:'cristal-premium',name:'Geodo de ametista',category:'Presentes Premium',symbol:'◆',search:'geodo ametista natural grande',description:'Peça mineral de presença marcante para altar, estúdio ou coleção.',note:'Tamanho, peso, origem e tonalidade variam por peça.',tags:['cristal','ametista','decoração','premium']},
    {id:'projetor-estrelas',name:'Projetor de galáxia',category:'Presentes Premium',symbol:'✦',search:'projetor galáxia estrelas premium',description:'Luz ambiente para transformar o espaço em um céu particular.',tags:['luz','galáxia','decoração']},
    {id:'kit-tarot-premium',name:'Kit Tarot Premium',category:'Presentes Premium',symbol:'☽',search:'kit tarot premium completo caixa livro cristais',description:'Baralho, acessórios e apresentação especial para presentear ou aprofundar a prática.',tags:['tarot','kit','presente','premium']}
  ],
  plans:[
    {id:'presence',name:'Presença',price:0,cycle:'para sempre',description:'Tarot Livre, Carta do Dia e ritual diário.'},
    {id:'premium',name:'Divina Bruxa Premium',price:199.90,cycle:'pagamento único',description:'Mesa Real, Escola offline e skins cosméticas.'},
    {id:'orbe-ia',name:'Orbe IA',price:89.90,cycle:'por mês · 400 créditos',description:'Conversas simbólicas com controle de créditos.'}
  ],
  aiCredits:[{id:'ia-200',credits:200,price:39.90},{id:'ia-600',credits:600,price:99.90},{id:'ia-1500',credits:1500,price:199.90}],
  services:[
    {name:'Mesa Real Profissional',price:250,description:'Leitura profunda e completa da sua realidade atual.'},
    {name:'Leitura de Mentes',price:150,description:'Leitura simbólica da dinâmica, intenções e padrões da relação.'},
    {name:'Carta de Conselho',price:100,description:'Uma carta, uma questão e uma orientação objetiva.'},
    {name:'Pergunta Direta',price:50,description:'Uma pergunta objetiva com orientação simbólica.'}
  ]
});
