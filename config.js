export const CONFIG = Object.freeze({
  appName: 'Orbe das Realidades',
  youtube: 'https://www.youtube.com/@divinabruxa33',
  spotify: 'https://open.spotify.com/album/0GwJtJujeS9iwSZFADcL1k',
  spotifyAlbumId: '0GwJtJujeS9iwSZFADcL1k',
  whatsapp: '',
  contactEmail: '',
  adminUser: 'Isis33',
  cardPath: '',
  products: [
    { id:'reading-digital', name:'Leitura Digital Personalizada', price:100, category:'Leituras', description:'Uma leitura simbólica entregue digitalmente.' },
    { id:'tarot-orbe', name:'Tarot Orbe das Realidades', price:null, category:'Tarot', description:'O baralho autoral da Divina Bruxa. Lista de espera.' },
    { id:'caderno-orbe', name:'Caderno Ritual da Orbe', price:null, category:'Ritual', description:'Um espaço físico para cartas, sonhos e reflexões.' },
    { id:'arte-arcano', name:'Arte Exclusiva de Arcano', price:null, category:'Arte', description:'Arte digital inspirada no arcano escolhido.' }
  ],
  plans: [
    { id:'presence', name:'Presença', price:0, cycle:'para sempre', description:'Tarot Livre, Carta do Dia e ritual diário.' },
    { id:'lunar', name:'Orbe Lunar', price:19.90, cycle:'por mês', description:'Diário ampliado, tiragens e jornada de estudos.' },
    { id:'supreme', name:'Orbe Suprema', price:39.90, cycle:'por mês', description:'Experiência completa, conteúdos e benefícios exclusivos.' }
  ],
  services: [
    { name: 'Mesa Real', price: 200, description: 'Leitura profunda e completa da sua realidade atual.' },
    { name: 'Leitura de Mentes', price: 200, description: 'Leitura simbólica da dinâmica, intenções e padrões da relação.' },
    { name: 'Carta de Conselho', price: 100, description: 'Uma carta, uma questão e uma orientação objetiva.' }
  ]
});
