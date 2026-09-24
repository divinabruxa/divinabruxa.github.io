const rows = [
  ['classic','Clássica Divina',0,'Essencial','orbe.webp','#a565d6','#f0d68a'],
  ['lunar','Lunar Mistério',1990,'Lunar','skin-lunar-misterio.webp','#7582d9','#dfe5ff'],
  ['solar','Solar Dourada',1990,'Elemental','skin-solar-dourada.webp','#e3a735','#ffe2a0'],
  ['ocean','Oceanos de Copas',1990,'Elemental','skin-oceanos-copas.webp','#20a5cb','#b8f4ff'],
  ['emerald','Esmeralda Ancestral',1990,'Elemental','skin-esmeralda-ancestral.webp','#6ca943','#d7ffb4'],
  ['fire','Fogo Sagrado',1990,'Elemental','skin-fogo-sagrado.webp','#d94f62','#ffd2b8'],
  ['cosmic','Cósmica Infinita',1990,'Cósmica','skin-cosmica-infinita.webp','#7548c8','#e4c7ff'],
  ['eclipse','Eclipse Sombria',1990,'Lunar','skin-eclipse-sombria.webp','#291a3d','#cdb1ff'],
  ['venus','Rosa de Vênus',1990,'Lunar','skin-rosa-venus.webp','#c85a9d','#ffd1eb'],
  ['amethyst','Ametista Real',2990,'Cristais','skin-ametista-real.webp','#7f49bb','#ead2ff'],
  ['sapphire','Safira Celestial',2990,'Cristais','skin-safira-celestial.webp','#315fc7','#c7dcff'],
  ['ruby','Rubi da Bruxa',2990,'Elemental','skin-rubi-bruxa.webp','#b72e4b','#ffd0d8'],
  ['aurora','Aurora Boreal',2990,'Cósmica','skin-aurora-boreal.webp','#4ac4b8','#d0fff8'],
  ['storm','Tempestade Astral',2990,'Elemental','skin-tempestade-astral.webp','#5c5f9d','#d9dcff'],
  ['fairy','Jardim das Fadas',2990,'Encantada','skin-jardim-fadas.webp','#a457a9','#ffd8fb'],
  ['isis','Templo Lunar',2990,'Lunar','skin-templo-isis.webp','#6c61b9','#eee2ff'],
  ['twin-flame','Chama Gêmea',2990,'Elemental','skin-chama-gemea.webp','#d4566e','#ffe0d7'],
  ['realities','Portal das Realidades',3990,'Portais','skin-portal-realidades.webp','#6d2ba5','#f0d68a'],
  ['queen','Rainha do Universo',3990,'Realeza','skin-rainha-universo.webp','#8b3fa5','#ffe6af'],
  ['supreme','Divina Suprema',3990,'Realeza','skin-divina-suprema.webp','#9a4cc7','#fff0bd'],
  ['moon-silver','Lua de Prata',3990,'Lunar','skin-lua-prata.webp','#8690ae','#f5f7ff'],
  ['solstice','Solstício Dourado',3990,'Elemental','skin-solsticio-dourado.webp','#c7902e','#ffedb8'],
  ['neptune','Maré de Netuno',3990,'Elemental','skin-mare-netuno.webp','#287bb1','#c8efff'],
  ['enchanted-forest','Floresta Encantada',3990,'Encantada','skin-floresta-encantada.webp','#3d895c','#cfffdc'],
  ['cosmic-dragon','Dragão Cósmico',4990,'Cósmica','skin-dragao-cosmico.webp','#7442a0','#f0d1ff'],
  ['lunar-rose','Rosa Lunar',4990,'Lunar','skin-rosa-lunar.webp','#a85188','#ffd7ef'],
  ['saturn-crystal','Cristal de Saturno',4990,'Cristais','skin-cristal-saturno.webp','#6c70aa','#e6e8ff'],
  ['violet-phoenix','Fênix Violeta',4990,'Cósmica','skin-fenix-violeta.webp','#923eb1','#f7d3ff'],
  ['celestial-oracle','Oráculo Celestial',4990,'Realeza','skin-oraculo-celestial.webp','#5260a8','#e5e9ff'],
  ['star-crown','Coroa das Estrelas',4990,'Realeza','skin-coroa-estrelas.webp','#b08334','#fff0bd']
];

export const SKINS = Object.freeze(rows.map(([id,name,priceCents,collection,image,accent,light]) => Object.freeze({id,name,priceCents,collection,image,accent,light,cosmeticOnly:true})));
export const SKIN_COLLECTIONS = Object.freeze(['Todas', ...new Set(SKINS.map(skin => skin.collection))]);
export const skinById = id => SKINS.find(skin => skin.id === id) || SKINS[0];
