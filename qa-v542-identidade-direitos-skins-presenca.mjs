import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const checks=[];
const add=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const payload=[
  'skin-catalog-v6.js','commercial-truth-v200.js','premium-policy-v191.js',
  'skins-v201.js','skins-premium-world-v318.js','skins-premium-world-v318.css',
  'premium-engine-v191.js','premium-billing-v191.css','identity-rights-core-v531.js',
  'identity-rights-core-v531.css','responsive-enchantment-core-v533.js',
  'owner-observatory-v532.js','page-loader-v1.js','app-v208.js','pwa-world-v324.js',
  'sw.js','index.html','instalar-app.html','install-app.html','instalar-aplicacion.html'
];
payload.forEach(file=>add(`arquivo:${file}`,exists(file)));

const stamp=`?qa=${Date.now()}`;
const catalog=await import(pathToFileURL(path.join(root,'skin-catalog-v6.js')).href+stamp);
const truth=await import(pathToFileURL(path.join(root,'commercial-truth-v200.js')).href+stamp);
const premium=await import(pathToFileURL(path.join(root,'premium-policy-v191.js')).href+stamp);
const tarot=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+stamp);
const school=await import(pathToFileURL(path.join(root,'school-policy.js')).href+stamp);

const skins=catalog.SKINS_V6;
const paid=skins.filter(skin=>skin.individualPurchase);
add('catalogo:30-skins',skins.length===30,String(skins.length));
add('catalogo:uma-gratuita',skins.filter(skin=>skin.priceCents===0).length===1);
add('catalogo:classica-gratuita',skins[0]?.id==='classic'&&skins[0]?.priceCents===0);
add('catalogo:29-pagas',paid.length===29,String(paid.length));
add('catalogo:quatro-faixas',catalog.SKIN_PRICE_TIERS_V542.join(',')==='1990,2990,3990,4990');
add('catalogo:chaves-unicas',new Set(paid.map(skin=>skin.productKey)).size===29);
add('catalogo:compra-unidade',paid.every(skin=>skin.billingMode==='payment'&&skin.individualPurchase===true));
add('catalogo:premium-inclusivo',skins.every(skin=>skin.premiumIncluded===true));

const registry=read('skin-registry-v12.js');
const ledger=read('SUPABASE-LEDGER-UNIVERSAL-STAGING-V205.sql');
for(const skin of skins){
  const stem=skin.id==='classic'?'divina-orb':({
    lunar:'skin-lunar-misterio',solar:'skin-solar-dourada',ocean:'skin-oceanos-copas',emerald:'skin-esmeralda-ancestral',fire:'skin-fogo-sagrado',cosmic:'skin-cosmica-infinita',eclipse:'skin-eclipse-sombria',venus:'skin-rosa-venus',amethyst:'skin-ametista-real',sapphire:'skin-safira-celestial',ruby:'skin-rubi-bruxa',aurora:'skin-aurora-boreal',storm:'skin-tempestade-astral',fairy:'skin-jardim-fadas',isis:'skin-templo-isis','twin-flame':'skin-chama-gemea',realities:'skin-portal-realidades',queen:'skin-rainha-universo',supreme:'skin-divina-suprema','moon-silver':'skin-lua-prata',solstice:'skin-solsticio-dourado',neptune:'skin-mare-netuno','enchanted-forest':'skin-floresta-encantada','cosmic-dragon':'skin-dragao-cosmico','lunar-rose':'skin-rosa-lunar','saturn-crystal':'skin-cristal-saturno','violet-phoenix':'skin-fenix-violeta','celestial-oracle':'skin-oraculo-celestial','star-crown':'skin-coroa-estrelas'
  })[skin.id];
  add(`skin:${skin.id}:registro`,registry.includes(`['${skin.id}', '${skin.name}'`));
  add(`skin:${skin.id}:thumb`,exists(`${stem}-thumb-v1.webp`));
  add(`skin:${skin.id}:fast`,exists(`${stem}-fast-v1.webp`));
  if(skin.id!=='classic'){
    add(`skin:${skin.id}:produto-ledger`,ledger.includes(`('${skin.productKey}','skin','${skin.name}','payment',${skin.priceCents}`));
    add(`skin:${skin.id}:preco-valido`,catalog.SKIN_PRICE_TIERS_V542.includes(skin.priceCents));
  }
}

const commercial=truth.COMMERCIAL_TRUTH_V200;
add('verdade:skins-unitarias',commercial.skins.individualPurchase===true);
add('verdade:29-pagas',commercial.skins.paidCount===29);
add('verdade:faixas',commercial.skins.priceTiersCents.join(',')==='1990,2990,3990,4990');
add('verdade:premium-19990',commercial.plans.find(item=>item.productKey==='premium_lifetime')?.priceCents===19990);
add('verdade:premium-todas',commercial.skins.premiumIncludesAll===true);
add('verdade:ia-separada',commercial.aiUsage.premiumIncludesAI===false);
add('verdade:staging',commercial.environment==='staging');
add('verdade:billing-off',commercial.realBilling===false&&commercial.checkoutEnabled===false);
add('politica:compra-unitaria',premium.BILLING_POLICY_V191.skinsAlsoSoldIndividually===true);
add('politica:checkout-unitario-off',premium.BILLING_POLICY_V191.individualSkinCheckoutEnabled===false);

const ui=read('skins-v201.js');
const world=read('skins-premium-world-v318.js');
const worldCss=read('skins-premium-world-v318.css');
const billingCss=read('premium-billing-v191.css');
const identity=read('identity-rights-core-v531.js');
const identityCss=read('identity-rights-core-v531.css');
const responsive=read('responsive-enchantment-core-v533.js');
const app=read('app-v208.js');
const loader=read('page-loader-v1.js');
const pwa=read('pwa-world-v324.js');
const sw=read('sw.js');
const index=read('index.html');

[
  ['ui:preco-helper',ui.includes('moneySkinV542')],
  ['ui:filtro-a-venda',ui.includes('À VENDA')],
  ['ui:cta-preco',ui.includes('VER COMPRA · ${moneySkinV542(catalog.priceCents)}')],
  ['ui:modal-unitario',ui.includes('COMPRA UNITÁRIA · SEM PREMIUM OBRIGATÓRIO')],
  ['ui:pagamento-unico',ui.includes('pagamento único')],
  ['ui:staging-explicito',ui.includes('STAGING · SEM COBRANÇA REAL')],
  ['ui:checkout-bloqueado',ui.includes('data-skin-staging-disabled disabled')],
  ['ui:restauravel-conta',ui.includes('restaurá-la em seus aparelhos')],
  ['ui:cosmetico',ui.includes('não altera cartas, sorte, leituras ou IA')],
  ['ui:premium-opcional',ui.includes('VER PREMIUM COM 30 SKINS')],
  ['ui:sem-redirecionamento-forcado',!ui.includes("globalThis.orbe?.go?.(this.authenticated ? 'subscriptions' : 'login')")],
  ['ui:sem-fetch-direto',!ui.includes('fetch(')],
  ['ui:sem-cartao',!ui.includes('cardNumber')&&!ui.includes('numeroCartao')],
  ['world:v542',world.includes("const RELEASE = 'V542'")],
  ['world:29-pagas',world.includes('paidSkins:29')],
  ['world:faixas',world.includes('priceTiersCents:[1990,2990,3990,4990]')],
  ['world:sem-loop',!worldCss.includes('infinite')],
  ['css:dialog',billingCss.includes('.skin-v542-dialog')],
  ['css:touch-44',billingCss.includes('min-height:44px')],
  ['css:mobile',billingCss.includes('@media(max-width:520px)')],
  ['identity:v542',identity.includes("const RELEASE = 'V542'")],
  ['identity:macro-8',identity.includes("macroStage:'8/14'")],
  ['identity:4-mundos',['login','subscriptions','skins','notifications'].every(route=>identity.includes(`  ${route}:Object.freeze`))],
  ['identity:12-capitulos',(identity.match(/Object\.freeze\(\{title:/g)||[]).length===12],
  ['identity:profundidade',identity.includes('mountDepth(route)')&&identity.includes('data-ir531-depth')],
  ['identity:sem-pointermove',!identity.includes("addEventListener('pointermove'")],
  ['identity:sem-observer',!identity.includes('MutationObserver')],
  ['identity:sem-loop',!identity.includes('setInterval')],
  ['identity:sem-storage',!identity.includes('localStorage')&&!identity.includes('sessionStorage')],
  ['identity:sem-rede',!identity.includes('fetch(')],
  ['identity:conteudo-diferido',identityCss.includes('content-visibility:auto')],
  ['identity:mobile-uma-coluna',identityCss.includes('.ir531-depth{grid-template-columns:1fr}')],
  ['responsive:skins-unitarias',responsive.includes('Cada uma das outras 29 skins pode ser comprada separadamente')],
  ['premium:unidade-sem-premium',read('premium-engine-v191.js').includes('Cada skin também pode ser adquirida separadamente, sem Premium')],
  ['admin:verdade-unitaria',read('owner-observatory-v532.js').includes('compra unitária independente')],
  ['loader:skins-v542',(loader.match(/skins-premium-world-v318\.(?:js|css)\?v=542/g)||[]).length===8],
  ['app:v542',app.includes("release:'V542'")&&app.includes("currentMacroStage:'8-of-14'")],
  ['app:epoch-542',app.includes('const RELEASE_EPOCH_V537 = 542')&&app.includes("releaseEpoch = 'v542'")],
  ['app:contrato-v542',app.includes('divinaIdentityRightsReleaseV542')],
  ['app:29-skins-pagas',app.includes('paidSkinCount:29')],
  ['app:checkout-unitario-off',app.includes('individualSkinCheckoutEnabled:false')],
  ['index:v542',index.includes('app-v208.js?v=542')&&index.includes('sw.js?v=542')],
  ['index:verdade-unitaria',index.includes('Cada skin paga também pode ser adquirida separadamente, sem Premium')],
  ['pwa:v542',pwa.includes('const VERSION=542')&&pwa.includes('sw.js?v=542')],
  ['sw:v542',sw.includes('const VERSION=542')&&sw.includes('divina-bruxa-v542-shell')],
  ['sw:skins',sw.includes("'./skin-registry-v12.js','./skin-universal-v10.js','./skin-catalog-v6.js'")],
  ['seguranca:orbe-unica',identity.includes('independentOrbEngines:0')&&identity.includes('independentUniverseEngines:0')],
  ['seguranca:frontend-nao-concede',identity.includes('frontendEntitlementGrants:false')],
  ['seguranca:servidor-autoridade',identity.includes("entitlementAuthority:'server'")],
  ['seguranca:dados-privados-zero',identity.includes('privateContentReads:0')],
  ['regressao:tarot-78',tarot.CARDS.length===78&&new Set(tarot.CARDS.map(card=>card.id)).size===78],
  ['regressao:tarot-direto',tarot.CARDS.every(card=>card.orientation==='normal')],
  ['regressao:escola-17-124',school.SCHOOL_MODULES.length===17&&school.SCHOOL_LESSON_TOTAL===124],
  ['regressao:tarot-sem-fogo',read('tarot-livre-orbe-os-v517.js').includes('fireInsideUniverseCanvas:false')],
  ['regressao:whit-local',app.includes('whitLocalBasic:true')&&app.includes('whitLocalCredits:0')],
  ['regressao:consultas-email',commercial.officialContact.email==='orbedasrealidades@hotmail.com'&&commercial.officialContact.whatsapp===null]
].forEach(([name,pass])=>add(name,pass));

for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const html=read(file);add(`release:${file}`,html.includes('PWA V542')&&html.includes('pwa-world-v324.js?v=542'));
}

for(const file of ['skin-catalog-v6.js','commercial-truth-v200.js','premium-policy-v191.js','skins-v201.js','skins-premium-world-v318.js','premium-engine-v191.js','identity-rights-core-v531.js','responsive-enchantment-core-v533.js','owner-observatory-v532.js','page-loader-v1.js','app-v208.js','pwa-world-v324.js']){
  const source=read(file);
  for(const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)|import\(\s*['"](\.\.?\/[^'"]+)/g)){
    const ref=(match[1]||match[2]).split('?')[0];
    add(`referencia:${file}:${ref}`,exists(path.normalize(path.join(path.dirname(file),ref))));
  }
}

const failed=checks.filter(check=>!check.pass);
const result={version:'V542',macroStage:'8/14',total:checks.length,passed:checks.length-failed.length,failed:failed.length,failures:failed};
console.log(JSON.stringify(result,null,2));
if(failed.length)process.exitCode=1;
