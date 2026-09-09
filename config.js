import { MUSIC_ALBUMS_V192, STORE_PRODUCTS_V192, VIDEO_EPISODES_V192 } from './editorial-catalog-v192.js?v=192';

export const CONFIG=Object.freeze({
  appName:'Orbe das Realidades',
  youtube:'https://www.youtube.com/@divinabruxa33',
  spotify:'https://open.spotify.com/album/0GwJtJujeS9iwSZFADcL1k',
  spotifyAlbumId:'0GwJtJujeS9iwSZFADcL1k',
  spotifyAlbums:MUSIC_ALBUMS_V192,
  whatsapp:'',
  contactEmail:'orbedasrealidades@hotmail.com',
  apiBase:'',
  aiEnabled:true,
  supabaseUrl:'https://kyphdsamyygavmkzyezr.supabase.co',
  supabasePublishableKey:'sb_publishable__UOlBYwmX4dl7txLy_FprA_KS_3EBq6',
  accountFunctionsBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1',
  consultationsApiBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/consultations-booking',
  adminApiBase:'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/admin-api',
  youtubeVideos:VIDEO_EPISODES_V192,
  cardPath:'',
  adminUser:'Isis33',
  // Troque apenas pelo seu código aprovado de Associado Amazon. Nunca coloque senhas ou chaves API aqui.
  amazonAssociateTag:'orbedasrealid-20',
  products:STORE_PRODUCTS_V192,
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
