/* DIVINA BRUXA — CATÁLOGO CANÔNICO DAS 30 SKINS V142
   Uma gratuita; quatro faixas individuais; cosméticos sem efeito em sorte ou conteúdo. */

const definitions = [
  ['classic','Clássica Divina',0,'Essencial'],
  ['lunar','Lunar Mistério',1990,'Lunar'],
  ['solar','Solar Dourada',1990,'Elemental'],
  ['ocean','Oceanos de Copas',1990,'Elemental'],
  ['emerald','Esmeralda Ancestral',1990,'Elemental'],
  ['fire','Fogo Sagrado',1990,'Elemental'],
  ['cosmic','Cósmica Infinita',1990,'Cósmica'],
  ['eclipse','Eclipse Sombria',1990,'Lunar'],
  ['venus','Rosa de Vênus',1990,'Lunar'],
  ['amethyst','Ametista Real',2990,'Cristais'],
  ['sapphire','Safira Celestial',2990,'Cristais'],
  ['ruby','Rubi da Bruxa',2990,'Elemental'],
  ['aurora','Aurora Boreal',2990,'Cósmica'],
  ['storm','Tempestade Astral',2990,'Elemental'],
  ['fairy','Jardim das Fadas',2990,'Encantada'],
  ['isis','Templo Lunar',2990,'Lunar'],
  ['twin-flame','Chama Gêmea',2990,'Elemental'],
  ['realities','Portal das Realidades',3990,'Portais'],
  ['queen','Rainha do Universo',3990,'Realeza'],
  ['supreme','Divina Suprema',3990,'Realeza'],
  ['moon-silver','Lua de Prata',3990,'Lunar'],
  ['solstice','Solstício Dourado',3990,'Elemental'],
  ['neptune','Maré de Netuno',3990,'Elemental'],
  ['enchanted-forest','Floresta Encantada',3990,'Encantada'],
  ['cosmic-dragon','Dragão Cósmico',4990,'Cósmica'],
  ['lunar-rose','Rosa Lunar',4990,'Lunar'],
  ['saturn-crystal','Cristal de Saturno',4990,'Cristais'],
  ['violet-phoenix','Fênix Violeta',4990,'Cósmica'],
  ['celestial-oracle','Oráculo Celestial',4990,'Realeza'],
  ['star-crown','Coroa das Estrelas',4990,'Realeza']
];

export const SKINS_V6 = Object.freeze(definitions.map(([id,name,priceCents,collection],index)=>Object.freeze({
  id,name,priceCents,collection,index,status:index===0?'free':'paid',cosmeticOnly:true
})));

export const SKIN_PACKS_V142 = Object.freeze([
  Object.freeze({ id:'constelacao-lunar', name:'Constelação Lunar', priceCents:7990, skinIds:Object.freeze(['lunar','eclipse','venus','isis','moon-silver','lunar-rose']) }),
  Object.freeze({ id:'portais-elementais', name:'Portais Elementais', priceCents:9990, skinIds:Object.freeze(['solar','ocean','emerald','fire','ruby','storm','solstice','neptune','enchanted-forest']) }),
  Object.freeze({ id:'coroa-suprema', name:'Coroa Suprema', priceCents:12990, skinIds:Object.freeze(['cosmic','amethyst','sapphire','aurora','fairy','twin-flame','realities','queen','supreme','cosmic-dragon','saturn-crystal','violet-phoenix','celestial-oracle','star-crown']) })
]);

export const skinCatalogById = id => SKINS_V6.find(skin=>skin.id===id) || SKINS_V6[0];
export const skinPackById = id => SKIN_PACKS_V142.find(pack=>pack.id===id) || null;
