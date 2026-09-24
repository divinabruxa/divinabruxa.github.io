export const WORLDS = Object.freeze({
  home: { category:'home', label:'Início', eyebrow:'ORIGEM', title:'Divina Bruxa', description:'Uma Orbe, um universo, muitos caminhos.', sigil:'✦', color:'157 85 255' },
  tarot: { category:'oracles', label:'Tarot Livre', eyebrow:'CÂMARA DO VAZIO VIOLETA', title:'Tarot Livre', description:'78 cartas diretas, sem repetição e sem significado automático.', sigil:'☽', color:'154 76 255', implemented:true },
  'carta-do-dia': { category:'oracles', label:'Carta do Dia', eyebrow:'SANTUÁRIO DA AURORA', title:'Carta do Dia', description:'Um encontro diário com a imagem que atravessa o seu tempo.', sigil:'☼', color:'255 160 103', implemented:true },
  tiragens: { category:'oracles', label:'Tiragens', eyebrow:'CONCÍLIO DAS CONSTELAÇÕES', title:'Tiragens', description:'Formas claras para perguntas que pedem mais de um ponto de vista.', sigil:'✣', color:'123 111 255', implemented:true },
  escola: { category:'wisdom', label:'Escola', eyebrow:'JARDIM DAS 78 SEMENTES', title:'Escola', description:'Estudo vivo do Tarot, da linguagem simbólica e da prática consciente.', sigil:'⌘', color:'102 196 151', implemented:true },
  biblioteca: { category:'wisdom', label:'Biblioteca', eyebrow:'SALA DOS FIOS VIVOS', title:'Biblioteca', description:'Textos, cartas e caminhos editoriais reunidos em uma mesma memória.', sigil:'☷', color:'116 164 222', implemented:true },
  diario: { category:'wisdom', label:'Diário', eyebrow:'CÂMARA DA TINTA VIVA', title:'Diário', description:'Um espaço íntimo para registrar cartas, sonhos e sincronicidades.', sigil:'✎', color:'196 112 187', implemented:true },
  whit: { category:'wisdom', label:'Whit', eyebrow:'PRESENÇA ENTRE MUNDOS', title:'Whit', description:'Companhia reflexiva que escuta o contexto sem tomar a sua escolha.', sigil:'◉', color:'189 159 255', implemented:true },
  consultas: { category:'encounter', label:'Consultas', eyebrow:'TEMPLO DO ENCONTRO', title:'Consultas', description:'Um caminho claro da intenção ao encontro, sem portas vazias.', sigil:'◇', color:'236 112 164', implemented:true },
  premium: { category:'encounter', label:'Premium', eyebrow:'SALA DAS CHAVES', title:'Premium', description:'Recursos profundos apresentados com verdade, valor e escolha.', sigil:'♢', color:'241 194 105', implemented:true },
  conta: { category:'encounter', label:'Conta', eyebrow:'CASA DO RETORNO', title:'Sua Conta', description:'Seu lugar para voltar, retomar e proteger o que é seu.', sigil:'⌂', color:'143 179 255', implemented:true },
  loja: { category:'creations', label:'Loja', eyebrow:'CASA DAS ESCOLHAS VIVAS', title:'Loja', description:'Objetos escolhidos com transparência e passagem consciente.', sigil:'✧', color:'240 174 111', implemented:true },
  musica: { category:'creations', label:'Música', eyebrow:'PALCO DAS ESTRELAS', title:'Música', description:'Canções, álbuns e atmosferas que fazem o universo respirar.', sigil:'♫', color:'189 94 255', implemented:true },
  videos: { category:'creations', label:'Vídeos', eyebrow:'CINEMA DA ORBE', title:'Vídeos & Memojis', description:'Seu palco de Memojis, conversas e episódios de De Frente com o Tarot.', sigil:'▷', color:'105 163 255', implemented:true },
  skins: { category:'creations', label:'Skins', eyebrow:'ATELIÊ DOS UNIVERSOS', title:'Skins', description:'Novas atmosferas para a mesma experiência, sem quebrar a leitura.', sigil:'◈', color:'109 216 205', implemented:true }
});

export const CATEGORY_LABELS = Object.freeze({
  home: 'Origem',
  oracles: 'Oráculos',
  wisdom: 'Sabedoria',
  encounter: 'Encontro',
  creations: 'Criações'
});
