import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const DELIVERY_ROOT=dirname(fileURLToPath(import.meta.url));
const SITE_ROOT=process.env.V200_SITE_ROOT||DELIVERY_ROOT;
const readDelivery=name=>readFileSync(join(DELIVERY_ROOT,name),'utf8');
const readSite=name=>readFileSync(join(SITE_ROOT,name),'utf8');
const sha256=(root,name)=>createHash('sha256').update(readFileSync(join(root,name))).digest('hex');
const passes=[],failures=[],warnings=[];
const check=(name,condition,severity='P1',detail='')=>{
  const item={name,severity,...(detail?{detail}:{})};
  (condition?passes:failures).push(item);
};

const manifest=JSON.parse(readDelivery('MANIFESTO-V200-VERDADE-COMERCIAL.json'));
const contract=JSON.parse(readDelivery('COMMERCIAL-TRUTH-V200.json'));
const index=readSite('index.html');
const app=readSite('app-v200.js');
const pwa=readSite('pwa-world-v200.js');
const sw=readSite('sw.js');
const config=readSite('config-v200.js');
const bridge=readSite('config.js');
const truthSource=readSite('commercial-truth-v200.js');
const policy=readSite('consultation-policy.js');
const sql=readDelivery('SUPABASE-COMMERCIAL-TRUTH-STAGING-V200.sql');
const booking=readSite('consultations-booking-v188.ts');

check('manifesto V200 sobre V199',manifest.version===200&&manifest.base_required==='V199 instalada','P0');
check('macroetapa 2 identificada',manifest.release==='plano-supremo-2.0-macroetapa-2-verdade-comercial-unica','P0');
check('delta plano, aditivo e sem exclusoes',manifest.delivery.type==='flat-delta'&&manifest.delivery.directories_inside_zip===0&&manifest.delivery.delete_existing_files===false,'P0');
check('delta tem 15 arquivos',manifest.delivery.files.length===15,'P0',String(manifest.delivery.files.length));
check('delta sem nomes duplicados',new Set(manifest.delivery.files).size===manifest.delivery.files.length,'P0');
for(const name of manifest.delivery.files){
  check(`delta presente: ${name}`,existsSync(join(DELIVERY_ROOT,name)),'P0');
  check(`delta nao vazio: ${name}`,existsSync(join(DELIVERY_ROOT,name))&&statSync(join(DELIVERY_ROOT,name)).size>0,'P0');
  check(`delta plano: ${name}`,!name.includes('/')&&!name.includes('\\'),'P0');
}

const {COMMERCIAL_TRUTH_V200:truth,assertCommercialTruthV200}=await import(`${pathToFileURL(join(SITE_ROOT,'commercial-truth-v200.js')).href}?qa=${Date.now()}`);
check('asserção canônica executa',assertCommercialTruthV200()===true,'P0');
check('verdade V200 em STAGING',truth.release==='V200'&&truth.environment==='staging','P0');
check('cobrança e checkout desligados',truth.realBilling===false&&truth.checkoutEnabled===false,'P0');
check('moeda BRL',truth.currency==='BRL','P0');
check('contato oficial correto',truth.officialContact.email==='orbedasrealidades@hotmail.com'&&truth.officialContact.whatsapp===null,'P0');
check('tag Amazon preservada',truth.affiliate.amazonAssociateTag==='orbedasrealid-20','P0');

const expectedServices=[
  ['mesa-real-profissional','Mesa Real Profissional',25000],
  ['leitura-mentes','Leitura de Mentes',15000],
  ['carta-conselho','Carta de Conselho',10000],
  ['pergunta-direta','Pergunta Direta',5000]
];
check('quatro consultas canônicas',truth.services.length===4,'P0');
for(const [id,name,cents] of expectedServices){
  const runtime=truth.services.find(item=>item.id===id);
  const json=contract.consultations.find(item=>item.id===id);
  check(`${name}: runtime R$${cents/100}`,runtime?.name===name&&runtime?.priceCents===cents&&runtime?.price===cents/100,'P0');
  check(`${name}: contrato R$${cents/100}`,json?.name===name&&json?.price_brl_cents===cents,'P0');
  check(`${name}: SQL reconciliado`,sql.includes(`'${id}'`)&&sql.includes(String(cents)),'P0');
}
check('ordem oficial 250/150/100/50',truth.services.map(item=>item.price).join('/')==='250/150/100/50','P0');

const expectedProducts=[
  ['premium_lifetime',19990,null],['orbe_ai_monthly',8990,400],
  ['credits_200',3990,200],['credits_600',9990,600],['credits_1500',19990,1500]
];
const runtimeProducts=[...truth.plans.filter(item=>item.priceCents>0),...truth.aiCredits];
for(const [key,cents,credits] of expectedProducts){
  const runtime=runtimeProducts.find(item=>item.productKey===key);
  const json=contract.products.find(item=>item.key===key);
  check(`${key}: runtime canônico`,runtime?.priceCents===cents&&(credits===null||runtime?.credits===credits||runtime?.creditsPerCycle===credits),'P0');
  check(`${key}: contrato canônico`,json?.price_brl_cents===cents&&(credits===null||json?.credits===credits||json?.credits_per_cycle===credits),'P0');
  check(`${key}: SQL reconciliado`,sql.includes(`'${key}'`)&&sql.includes(String(cents)),'P0');
}
check('Premium sem IA',truth.plans.find(item=>item.productKey==='premium_lifetime')?.includesAI===false&&truth.aiUsage.premiumIncludesAI===false,'P0');
check('Premium inclui 30 skins',truth.skins.count===30&&truth.skins.premiumIncludesAll===true,'P0');
check('skin gratuita Clássica Divina',truth.skins.freeId==='classic'&&truth.skins.freeName==='Clássica Divina','P0');
check('custos Luna/Terra e Sol OFF',truth.aiUsage.lunaPerResponse===1&&truth.aiUsage.terraPerResponse===10&&truth.aiUsage.solEnabled===false,'P0');

check('config V200 importa unica verdade',/from '\.\/commercial-truth-v200\.js\?v=200'/.test(config),'P0');
for(const key of ['plans','aiCredits','services'])check(`config delega ${key}`,config.includes(`${key}:COMMERCIAL_TRUTH_V200.${key}`),'P0');
check('config delega contato e afiliado',config.includes('COMMERCIAL_TRUTH_V200.officialContact.email')&&config.includes('COMMERCIAL_TRUTH_V200.affiliate.amazonAssociateTag'),'P0');
check('ponte config.js sem catálogo duplicado',bridge.trim().split(/\r?\n/).length<=3&&/config-v200\.js\?v=200/.test(bridge),'P0');
check('política de consulta importa única verdade',/from '\.\/commercial-truth-v200\.js\?v=200'/.test(policy),'P0');
check('política delega os serviços',policy.includes('services:COMMERCIAL_TRUTH_V200.services'),'P0');
check('política conserva tabela compatível V147',truth.consultationPriceTableVersion==='consultas-2026-09-05-v147','P0');
check('catálogo billing conserva compatibilidade V191',truth.billingCatalogVersion==='V191','P0');

check('e-mail usa snapshot imutável do servidor',/price_brl_cents_snapshot/.test(booking)&&/Valor registrado:/.test(booking),'P0');
check('e-mail busca nome no catálogo do servidor',/from\("consultation_services"\)\.select\("name"\)/.test(booking),'P1');
check('SQL preparado e nao autoexecutado',/PREPARADA, NÃO EXECUTADA/.test(sql),'P0');
check('SQL exige gate STAGING fechado',/environment='staging'/.test(sql)&&/real_billing_authorized=false/.test(sql)&&/production_authorized=false/.test(sql),'P0');
check('SQL congela consultas',/consultation_services_commercial_v200_check/.test(sql),'P0');
check('SQL congela produtos',/product_catalog_commercial_v200_check/.test(sql),'P0');
check('SQL preserva V191 para backend ativo',/catalog_version='V191'/.test(sql),'P0');
check('SQL nao cria Stripe ou checkout',!/create\s+(?:table|function|extension)[\s\S]{0,80}(?:stripe|checkout)/i.test(sql),'P0');

check('index inicia app V200',/src="app-v200\.js\?v=200"/.test(index),'P0');
check('app usa config V200',/from '\.\/config-v200\.js\?v=200'/.test(app),'P0');
check('app usa PWA V200',/import '\.\/pwa-world-v200\.js\?v=200'/.test(app),'P0');
check('app registra SW V200',/register\('\.\/sw\.js\?v=200'\)/.test(app),'P0');
check('PWA identifica V200',/const VERSION = 200;/.test(pwa),'P0');
check('PWA registra SW V200',/register\('\.\/sw\.js\?v=200'\)/.test(pwa),'P0');
check('SW identifica V200',/const VERSION = 200;/.test(sw),'P0');
for(const cache of ['divina-bruxa-v200-shell','divina-bruxa-v200-content','divina-bruxa-v200-images','divina-bruxa-v200-tarot-offline'])check(`cache ${cache}`,sw.includes(cache),'P0');
for(const asset of ['./app-v200.js','./config.js','./config-v200.js','./commercial-truth-v200.js','./consultation-policy.js','./pwa-world-v200.js'])check(`SW prepara ${asset}`,sw.includes(`'${asset}'`),'P0');
check('SW valida shell V200',sw.includes('app-v200\\.js\\?v=200')&&sw.includes('home-orb-absolute-v199\\.css\\?v=199'),'P0');
check('SW remove caches próprios antigos',/key\.startsWith\(OWNED_PREFIX\) && !ACTIVE_CACHES\.has\(key\)/.test(sw),'P0');
check('SW mantém autoridade network-only',/authorityNetworkOnly/.test(sw)&&/cache-control': 'no-store/.test(sw),'P0');

const homeStart=index.indexOf('<section id="home"');
const tarotStart=index.indexOf('<section id="tarot"');
const home=homeStart>=0&&tarotStart>homeStart?index.slice(homeStart,tarotStart):'';
check('Home identificada antes do Tarot',home.length>0,'P0');
check('Home conserva apenas título principal',/<h1>Orbe das<br>Realidades/.test(home),'P0');
check('Home conserva Orbe viva',/class="orb-stage-ref"/.test(home)&&/id="orbCanvas"/.test(home),'P0');
check('Home conserva proteção V194/V199',/home-orb-only-v194/.test(home)&&/home-orb-absolute-v199\.css\?v=199/.test(index),'P0');
check('Home sem cards editoriais',!/editorial-card|shop-portals|service-card/.test(home),'P0');

const frozen={
  'orb-engine-v68.js':'3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js':'26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js':'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js':'2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
for(const [name,expected] of Object.entries(frozen)){
  check(`congelado presente: ${name}`,existsSync(join(SITE_ROOT,name)),'P0');
  check(`congelado intacto: ${name}`,existsSync(join(SITE_ROOT,name))&&sha256(SITE_ROOT,name)===expected,'P0');
}
check('escopo preserva Orbe/menu/Tarot/Home',manifest.scope.orb_engine_changed===false&&manifest.scope.mini_orb_changed===false&&manifest.scope.menu_changed===false&&manifest.scope.tarot_changed===false&&manifest.scope.home_content_changed===false,'P0');
check('preços não foram alterados',manifest.scope.prices_changed===false,'P0');
check('todos os portões externos fechados',Object.values(manifest.release_blocks).every(value=>value===false),'P0');

const eagerImports=new Map();
const visit=name=>{
  if(eagerImports.has(name))return;
  if(!existsSync(join(SITE_ROOT,name))){eagerImports.set(name,['__MISSING__']);return;}
  const source=readSite(name);
  const deps=[...source.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g)]
    .map(match=>normalize(join(dirname(name),match[1].split(/[?#]/)[0])).replace(/^\.\//,''))
    .filter(dep=>/\.(?:js|mjs)$/.test(dep));
  eagerImports.set(name,deps);deps.forEach(visit);
};
visit('app-v200.js');
const missingImports=[...eagerImports].flatMap(([name,deps])=>deps.filter(dep=>dep==='__MISSING__'||!existsSync(join(SITE_ROOT,dep))).map(dep=>`${name} -> ${dep}`));
check('grafo inicial de imports completo',missingImports.length===0,'P0',missingImports.join('; '));
const visiting=new Set(),visited=new Set(),cycles=[];
const detect=(name,stack=[])=>{if(visiting.has(name)){cycles.push([...stack,name].join(' -> '));return;}if(visited.has(name))return;visiting.add(name);for(const dep of eagerImports.get(name)||[])if(dep!=='__MISSING__')detect(dep,[...stack,name]);visiting.delete(name);visited.add(name);};
detect('app-v200.js');
check('grafo inicial sem ciclos',cycles.length===0,'P0',cycles.join('; '));

for(const name of ['app-v200.js','commercial-truth-v200.js','config-v200.js','config.js','consultation-policy.js','pwa-world-v200.js','sw.js','QA-V200-VERDADE-COMERCIAL.mjs']){
  const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:readDelivery(name),encoding:'utf8',timeout:20000});
  check(`${name}: sintaxe JavaScript`,result.status===0,'P0',result.stderr?.slice(-400)||'');
}
const legacy=spawnSync(process.execPath,[join(SITE_ROOT,'QA-V197-RELEASE-CANDIDATE.mjs')],{cwd:SITE_ROOT,encoding:'utf8',timeout:180000});
const legacyOutput=`${legacy.stdout||''}\n${legacy.stderr||''}`;
check('regressão V197 preserva 1219 checks',/1219\/1221 PASS/.test(legacyOutput),'P0',legacyOutput.slice(-800));
check('regressão antiga diverge só nos 2 portões versionados',/P0=2 P1=0/.test(legacyOutput)&&/index usa app V196/.test(legacyOutput)&&/service worker atual V196/.test(legacyOutput),'P0',legacyOutput.slice(-800));
for(const name of manifest.delivery.files.filter(name=>extname(name)==='.json')){let valid=true;try{JSON.parse(readDelivery(name));}catch{valid=false;}check(`${name}: JSON válido`,valid,'P0');}
const localRefs=[...index.matchAll(/(?:href|src)="([^"#]+)"/g)].map(match=>match[1].split(/[?#]/)[0]).filter(value=>value&&!/^(?:https?:|mailto:|data:|blob:)/.test(value)&&value!=='./');
const missingRefs=[...new Set(localRefs.filter(name=>!existsSync(join(SITE_ROOT,name))))];
check('referências locais do index resolvidas',missingRefs.length===0,'P0',missingRefs.join(', '));

const secrets=[/(?:live_secret|restricted_live|webhook_secret)_[A-Za-z0-9]{16,}/i,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/];
const deliveryText=manifest.delivery.files.filter(name=>!['ARQUIVOS-V200-SHA256.txt','EVIDENCIA-QA-V200.json'].includes(name)).map(readDelivery).join('\n');
check('delta sem segredo material',!secrets.some(pattern=>pattern.test(deliveryText)),'P0');
check('delta sem link WhatsApp',!/(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(deliveryText),'P0');

const hashLines=readDelivery('ARQUIVOS-V200-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const hashes=new Map(hashLines.map(line=>{const match=line.match(/^([a-f0-9]{64})  (.+)$/);return match?[match[2],match[1]]:['',''];}));
const hashTargets=manifest.delivery.files.filter(name=>!['ARQUIVOS-V200-SHA256.txt','EVIDENCIA-QA-V200.json'].includes(name));
check('checksums cobrem arquivos estáveis',hashTargets.every(name=>hashes.has(name))&&hashes.size===hashTargets.length,'P0');
for(const name of hashTargets)check(`checksum válido: ${name}`,hashes.get(name)===sha256(DELIVERY_ROOT,name),'P0');

warnings.push('SUPABASE-COMMERCIAL-TRUTH-STAGING-V200.sql foi preparado, mas não executado.');
warnings.push('Cobrança real, produção, DNS, Stripe, lojas, Resend e Orbe IA Sol continuam bloqueados.');
warnings.push('O primeiro carregamento após instalar a V200 precisa estar online para renovar o cache.');
const p0=failures.filter(item=>item.severity==='P0').length,p1=failures.filter(item=>item.severity==='P1').length;
const evidence={project:'Divina Bruxa',version:200,suite:'Plano Supremo 2.0 - Macroetapa 2 - Verdade Comercial Única',generated_at:new Date().toISOString(),total:passes.length+failures.length,passed:passes.length,failed:failures.length,gate:{p0,p1,package_approved:p0===0&&p1===0},commercial:{consultations_brl:truth.services.map(item=>item.price),products_brl_cents:expectedProducts.map(([,cents])=>cents),source:'commercial-truth-v200.js'},runtime:{entrypoint:'app-v200.js?v=200',cache_generation:200,eager_import_cycles:cycles.length},home:{visible:['localized_orb_title','living_orb'],changed:false},legacy_regression:{passed:1219,total:1221,intended_version_gate_differences:2},frozen_hashes:frozen,external_actions:{production:false,dns:false,real_billing:false,stripe:false,resend:false,stores:false,sol:false},warnings,failures};
if(process.env.V200_QA_NO_WRITE!=='1')writeFileSync(join(DELIVERY_ROOT,'EVIDENCIA-QA-V200.json'),`${JSON.stringify(evidence,null,2)}\n`);
console.log(`DIVINA BRUXA V200 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
console.log('TRUTH=V200 PRICES=250/150/100/50 BILLING=OFF HOME=TITLE+ORB');
if(failures.length){for(const failure of failures)console.error(`[${failure.severity}] ${failure.name}${failure.detail?` :: ${failure.detail}`:''}`);process.exitCode=1;}
