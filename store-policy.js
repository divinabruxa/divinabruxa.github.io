/* DIVINA BRUXA V543 — POLÍTICA DA LOJA AMAZON · CURADORIA CONSCIENTE */

const collection = (id, name, sigil, description, categories) => Object.freeze({
  id,
  name,
  sigil,
  description,
  categories: Object.freeze(categories)
});

export const STORE_POLICY = Object.freeze({
  version: 'v543',
  environment: 'editorial-affiliate-staging',
  reviewedAt: '2026-09-13',
  checkout: false,
  productionBilling: false,
  storesPaymentData: false,
  affiliateHost: 'www.amazon.com.br',
  affiliateHostSuffix: '.amazon.com.br',
  disclosure: 'Como associado da Amazon, eu recebo por compras qualificadas. Você não paga nada a mais por isso.',
  partnerNotice: 'Preço, estoque, vendedor, configuração, pagamento, entrega, troca, garantia e suporte são confirmados e realizados na Amazon.',
  editorialImageNotice: 'Cena editorial da Divina Bruxa. Os objetos são ilustrativos e não representam um anúncio ou SKU específico.',
  privacyNotice: 'Busca e favoritos ficam neste aparelho. A Loja não envia sua busca, seus favoritos ou qualquer texto pessoal para analytics.',
  selectionRule: 'A curadoria aponta finalidades e buscas amplas; não declara preço, estoque, avaliação ou modelo atual.',
  linkPolicy: Object.freeze({
    strategy: 'amazon-search-query',
    directSkuPromise: false,
    priceCache: false,
    stockCache: false,
    ratingCache: false,
    adjacentDisclosure: true,
    officialPartnershipClaim: false,
    productImages: 'editorial-original-only',
    analyticsAllowedFields: Object.freeze(['event', 'product_id', 'category', 'destination_host']),
    analyticsForbiddenFields: Object.freeze(['search_text', 'favorites', 'email', 'question', 'journal', 'prompt'])
  }),
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
