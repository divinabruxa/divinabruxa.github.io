import { existsSync, readFileSync, statSync } from 'node:fs';
import { CARDS, REQUIRED_ORIENTATION } from './tarot-data.js';
import { CONFIG } from './config.js';
import { CONSULTATION_POLICY } from './consultation-policy.js';
import { STORE_POLICY } from './store-policy.js';
import { buildAmazonAffiliateURL, filterStoreProducts, normalizeStoreText } from './store-engine.js';

const text = file => readFileSync(new URL(`./${file}`, import.meta.url), 'utf8');
const tarotRuntime = text('tarot-image-runtime.js');
const tarotEngine = text('tarot-engine.js');
const consultationEngine = text('consultation-engine.js');
const consultationEdge = text('consultations-booking-v148.ts');
const notificationSql = text('SUPABASE-CONSULTAS-STAGING-V148-EMAIL.sql');
const storeEngine = text('store-engine.js');
const storeCss = text('store-celestial-v1.css');
const index = text('index.html');
const app = text('app.js');
const loader = text('page-loader-v1.js');
const worker = text('sw.js');

const expectedPrices = new Map([
  ['mesa-real-profissional', 25000],
  ['leitura-mentes', 15000],
  ['carta-conselho', 10000],
  ['pergunta-direta', 5000]
]);
const canonicalIds = new Set(CARDS.map(card => card.canonicalId));
const artFiles = new Set(CARDS.map(card => card.imageSources.medium));
const allCardFilesReady = [...artFiles].every(file => existsSync(new URL(`./${file}`, import.meta.url)) && statSync(new URL(`./${file}`, import.meta.url)).size > 1000);
const bracesBalanced = source => {
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, '');
  let balance = 0;
  for (const char of clean) {
    if (char === '{') balance += 1;
    if (char === '}') balance -= 1;
    if (balance < 0) return false;
  }
  return balance === 0;
};

const checks = [
  ['Tarot has exactly 78 canonical cards', CARDS.length === 78 && canonicalIds.size === 78],
  ['Tarot card indexes are unique and complete', new Set(CARDS.map(card => card.index)).size === 78 && CARDS.every((card, indexValue) => card.index === indexValue)],
  ['Tarot remains direct-only', REQUIRED_ORIENTATION === 'normal' && CARDS.every(card => card.orientation === 'normal')],
  ['All 78 full card files are present', artFiles.size === 78 && allCardFilesReady],
  ['Tarot atlas is present', existsSync(new URL('./tarot-atlas.webp', import.meta.url)) && statSync(new URL('./tarot-atlas.webp', import.meta.url)).size > 100000],
  ['Tarot assets are versioned V148', tarotRuntime.includes("CARD_ASSET_VERSION = '148'")],
  ['Tarot markup uses instant atlas preview', tarotRuntime.includes('cardAtlasStyle(card)') && tarotRuntime.includes('background-size:1000% 800%')],
  ['Tarot prepares full image before reveal', tarotEngine.includes('await imagePreparation') && tarotEngine.includes('prepareCardImage')],
  ['Tarot has bounded progressive fallback', tarotRuntime.includes("finish('atlas')") && tarotRuntime.includes("image.dataset.imageState = 'atlas'") && tarotRuntime.includes("imageTasks.delete(source)")],
  ['Tarot loader points to V148', loader.includes("import('./tarot-engine.js?v=148')")],

  ['Store policy is V148 and affiliate-only', STORE_POLICY.version === 'v148' && STORE_POLICY.checkout === false && STORE_POLICY.productionBilling === false],
  ['Store exposes 21 choices', CONFIG.products.length === 21],
  ['Store exposes four collections', STORE_POLICY.collections.length === 4],
  ['Store categories cover every choice', CONFIG.products.every(product => STORE_POLICY.categories.includes(product.category))],
  ['Store search is accent-insensitive', normalizeStoreText('Acessórios & Cristais') === 'acessorios & cristais'],
  ['Store filter finds Tarot products', filterStoreProducts(CONFIG.products, { query: 'tarot', category: 'Todos' }).length >= 4],
  ['Store rejects a non-Amazon URL', new URL(buildAmazonAffiliateURL({ name: 'Teste', url: 'https://evil.example/item' }, 'orbedasrealid-20')).hostname === 'www.amazon.com.br'],
  ['Store adds approved affiliate tag', new URL(buildAmazonAffiliateURL({ name: 'Tarot' }, 'orbedasrealid-20')).searchParams.get('tag') === 'orbedasrealid-20'],
  ['Store links declare sponsored and noopener', storeEngine.includes('rel="nofollow sponsored noopener"')],
  ['Store does not record affiliate clicks', !storeEngine.includes('affiliateClicks')],
  ['Store editorial art is optimized and present', existsSync(new URL('./loja-mistica-celestial-v1.webp', import.meta.url)) && statSync(new URL('./loja-mistica-celestial-v1.webp', import.meta.url)).size > 50000 && statSync(new URL('./loja-mistica-celestial-v1.webp', import.meta.url)).size < 300000],
  ['Store CSS braces are balanced', bracesBalanced(storeCss)],
  ['Store supports mobile safe areas', storeCss.includes('env(safe-area-inset-bottom)') && storeCss.includes('@media (max-width: 640px)')],
  ['Store respects reduced motion', storeCss.includes('prefers-reduced-motion: reduce')],
  ['Store supports forced colors', storeCss.includes('forced-colors: active')],
  ['Store loader and stylesheet are V148', loader.includes("import('./store-engine.js?v=148')") && index.includes('store-celestial-v1.css?v=148')],

  ['Consultations keep the exact owner email', CONSULTATION_POLICY.contactEmail === 'orbedasrealidades@hotmail.com'],
  ['Consultations keep the four exact prices', CONSULTATION_POLICY.services.length === 4 && CONSULTATION_POLICY.services.every(service => expectedPrices.get(service.id) === service.priceCents)],
  ['Consultations remain free of real billing', CONSULTATION_POLICY.realBilling === false && consultationEdge.includes('realBilling:false')],
  ['Consultation form captures customer email', consultationEngine.includes('name="email"') && consultationEdge.includes('p_customer_email:email')],
  ['Owner notification uses fixed recipient', consultationEdge.includes('const OPERATIONS_EMAIL="orbedasrealidades@hotmail.com"')],
  ['Owner notification Reply-To uses customer email', consultationEdge.includes('reply_to:record.customer_email')],
  ['Email credentials remain server-side', consultationEdge.includes('Deno.env.get') && !index.includes('RESEND_API_KEY') && !app.includes('RESEND_API_KEY') && !CONFIG.RESEND_API_KEY],
  ['Email provider request is idempotent', consultationEdge.includes('Idempotency-Key') && consultationEdge.includes('divina-consultation-${record.id}-owner-v1')],
  ['Notification ledger has RLS and force RLS', notificationSql.includes('enable row level security') && notificationSql.includes('force row level security')],
  ['Notification ledger blocks browser roles', notificationSql.includes('revoke all on table public.consultation_email_notifications from public, anon, authenticated')],
  ['Notification ledger has an explicit service-role policy', notificationSql.includes('consultation_email_notifications_service_role') && notificationSql.includes('to service_role')],
  ['Notification ledger does not duplicate customer question', !notificationSql.includes('question_context') && !notificationSql.includes('customer_email')],
  ['Consultation UI distinguishes pending notification', consultationEngine.includes('notificationAccepted') && consultationEngine.includes('Aviso à equipe') && consultationEngine.includes('data-send-owner-copy')],
  ['Consultation loader points to V148', loader.includes("import('./consultation-engine.js?v=148')")],

  ['App shell is V148', index.includes('app.js?v=148') && app.includes('APLICATIVO V148')],
  ['Service worker cache is V148', worker.includes('divina-bruxa-v43-loja-tarot-email-v148') && app.includes("register('./sw.js?v=148')")],
  ['Service worker warms Tarot engine and atlas', worker.includes("'./tarot-engine.js'") && worker.includes("'./tarot-atlas.webp'")],
  ['Service worker warms Store assets', worker.includes("'./store-celestial-v1.css'") && worker.includes("'./loja-mistica-celestial-v1.webp'")],
  ['Home Orbe remains present', index.includes('id="orbCanvas"') && index.includes('Orbe das<br>Realidades')],
  ['Menu keeps Tarot Livre', index.includes('<b>Tarot Livre</b>')],
  ['Home keeps consultation prices', index.includes('Mesa Real Profissional<small>R$ 250</small>') && index.includes('Pergunta Direta<small>R$ 50</small>')],
  ['Production billing stays disabled', !consultationEdge.includes('STRIPE_SECRET_KEY') && !storeEngine.includes('data-checkout') && STORE_POLICY.storesPaymentData === false],
  ['Activation instructions are present', existsSync(new URL('./LEIA-PRIMEIRO-ATIVAR-EMAIL-CONSULTAS-V148.txt', import.meta.url))],
  ['Email status explicitly avoids a false live claim', JSON.parse(text('STAGING-EMAIL-STATUS-V148.json')).ownerEmailConfigured === false]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-V148-LOJA-TAROT-CONSULTAS',
  status: failed.length ? 'FAIL' : 'PASS',
  total: checks.length,
  passed: checks.length - failed.length,
  failed
}, null, 2));
process.exitCode = failed.length ? 1 : 0;
