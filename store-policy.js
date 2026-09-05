/* DIVINA BRUXA V148 — POLÍTICA DA LOJA MÍSTICA CELESTIAL */

const collection = (id, name, sigil, description, categories) => Object.freeze({
  id,
  name,
  sigil,
  description,
  categories: Object.freeze(categories)
});

export const STORE_POLICY = Object.freeze({
  version: 'v148',
  environment: 'affiliate-staging',
  checkout: false,
  productionBilling: false,
  storesPaymentData: false,
  affiliateHost: 'www.amazon.com.br',
  affiliateHostSuffix: '.amazon.com.br',
  disclosure: 'Como associado da Amazon, eu recebo por compras qualificadas. O preço para você não muda.',
  partnerNotice: 'Preço, estoque, vendedor, pagamento, entrega, troca e suporte são confirmados e realizados na Amazon.',
  editorialImageNotice: 'Cena editorial da Divina Bruxa. Os objetos são ilustrativos e não representam um anúncio ou SKU específico.',
  privacyNotice: 'Busca e favoritos ficam somente neste aparelho. Cliques não são gravados sem consentimento.',
  heroImage: 'loja-mistica-celestial-v1.webp',
  categories: Object.freeze([
    'Todos',
    'Baralhos',
    'Livros',
    'Cristais',
    'Ritual',
    'Acessórios',
    'Decoração',
    'Apple & Tecnologia',
    'Presentes Premium'
  ]),
  collections: Object.freeze([
    collection('tarot-estudo', 'Tarot & Estudo', '☼', 'Baralhos, livros e repertório para aprofundar sua leitura.', ['Baralhos', 'Livros']),
    collection('ritual-cristais', 'Ritual & Cristais', '◆', 'Presença, atmosfera e objetos para o seu espaço ritual.', ['Cristais', 'Ritual']),
    collection('casa-orbe', 'Casa da Orbe', '☾', 'Acessórios e detalhes celestiais para organizar e acolher.', ['Acessórios', 'Decoração']),
    collection('criacao-presentes', 'Criação & Presentes', '✦', 'Tecnologia e escolhas especiais para criar, ouvir e presentear.', ['Apple & Tecnologia', 'Presentes Premium'])
  ]),
  menuPortal: Object.freeze({ label: 'Loja Mística', description: 'Itens para sua jornada' })
});

export const storeToneFor = category => ({
  Baralhos: 'solar',
  Livros: 'lunar',
  Cristais: 'crystal',
  Ritual: 'ember',
  'Acessórios': 'violet',
  'Decoração': 'aurora',
  'Apple & Tecnologia': 'cosmic',
  'Presentes Premium': 'gold'
}[category] || 'violet');
