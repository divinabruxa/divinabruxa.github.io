const surfaceMap = image => Object.freeze({
  home: image,
  menu: image,
  dock: image,
  table: image,
  header: image,
  ai: image,
  internal: image
});

const definitions = [
  // A clássica usa exatamente a textura V68 já aprovada para não alterar a Home atual.
  ['classic', 'Clássica Divina', 'divina-orb-v68.png', '#a565d6', '#f0d68a'],
  ['lunar', 'Lunar Mistério', 'skin-lunar-misterio-v1.png', '#7582d9', '#dfe5ff'],
  ['solar', 'Solar Dourada', 'skin-solar-dourada-v1.png', '#e3a735', '#ffe2a0'],
  ['ocean', 'Oceanos de Copas', 'skin-oceanos-copas-v1.png', '#20a5cb', '#b8f4ff'],
  ['emerald', 'Esmeralda Ancestral', 'skin-esmeralda-ancestral-v1.png', '#6ca943', '#d7ffb4'],
  ['fire', 'Fogo Sagrado', 'skin-fogo-sagrado-v1.png', '#d94f62', '#ffd2b8'],
  ['cosmic', 'Cósmica Infinita', 'skin-cosmica-infinita-v1.png', '#7548c8', '#e4c7ff'],
  ['eclipse', 'Eclipse Sombria', 'skin-eclipse-sombria-v1.png', '#291a3d', '#cdb1ff'],
  ['venus', 'Rosa de Vênus', 'skin-rosa-venus-v1.png', '#c85a9d', '#ffd1eb'],
  ['amethyst', 'Ametista Real', 'skin-ametista-real-v1.png', '#7f49bb', '#ead2ff'],
  ['sapphire', 'Safira Celestial', 'skin-safira-celestial-v1.png', '#315fc7', '#c7dcff'],
  ['ruby', 'Rubi da Bruxa', 'skin-rubi-bruxa-v1.png', '#b72e4b', '#ffd0d8'],
  ['aurora', 'Aurora Boreal', 'skin-aurora-boreal-v1.png', '#4ac4b8', '#d0fff8'],
  ['storm', 'Tempestade Astral', 'skin-tempestade-astral-v1.png', '#5c5f9d', '#d9dcff'],
  ['fairy', 'Jardim das Fadas', 'skin-jardim-fadas-v1.png', '#a457a9', '#ffd8fb'],
  ['isis', 'Templo Lunar', 'skin-templo-isis-v1.png', '#6c61b9', '#eee2ff'],
  ['twin-flame', 'Chama Gêmea', 'skin-chama-gemea-v1.png', '#d4566e', '#ffe0d7'],
  ['realities', 'Portal das Realidades', 'skin-portal-realidades-v1.png', '#6d2ba5', '#f0d68a'],
  ['queen', 'Rainha do Universo', 'skin-rainha-universo-v1.png', '#8b3fa5', '#ffe6af'],
  ['supreme', 'Divina Suprema', 'skin-divina-suprema-v1.png', '#9a4cc7', '#fff0bd'],
  ['moon-silver', 'Lua de Prata', 'skin-lua-prata-v1.png', '#8690ae', '#f5f7ff'],
  ['solstice', 'Solstício Dourado', 'skin-solsticio-dourado-v1.png', '#c7902e', '#ffedb8'],
  ['neptune', 'Maré de Netuno', 'skin-mare-netuno-v1.png', '#287bb1', '#c8efff'],
  ['enchanted-forest', 'Floresta Encantada', 'skin-floresta-encantada-v1.png', '#3d895c', '#cfffdc'],
  ['cosmic-dragon', 'Dragão Cósmico', 'skin-dragao-cosmico-v1.png', '#7442a0', '#f0d1ff'],
  ['lunar-rose', 'Rosa Lunar', 'skin-rosa-lunar-v1.png', '#a85188', '#ffd7ef'],
  ['saturn-crystal', 'Cristal de Saturno', 'skin-cristal-saturno-v1.png', '#6c70aa', '#e6e8ff'],
  ['violet-phoenix', 'Fênix Violeta', 'skin-fenix-violeta-v1.png', '#923eb1', '#f7d3ff'],
  ['celestial-oracle', 'Oráculo Celestial', 'skin-oraculo-celestial-v1.png', '#5260a8', '#e5e9ff'],
  ['star-crown', 'Coroa das Estrelas', 'skin-coroa-estrelas-v1.png', '#b08334', '#fff0bd']
];

const skins = definitions.map(([id, name, image, accent, light]) => Object.freeze({
  id,
  name,
  image,
  tokens: Object.freeze({ accent, light }),
  surfaces: surfaceMap(image)
}));

export const SKIN_REGISTRY_V12 = Object.freeze({
  version: '12.0.0',
  skins: Object.freeze(skins),
  fallbackSkin: skins[0]
});

export const skinByIdV12 = id =>
  SKIN_REGISTRY_V12.skins.find(skin => skin.id === id) || SKIN_REGISTRY_V12.fallbackSkin;
