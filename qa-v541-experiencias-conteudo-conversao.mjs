import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const checks=[];
const add=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

const payload=[
  'experience-depth-core-v541.js','experience-depth-core-v541.css',
  'experience-conversion-core-v530.js','experience-conversion-core-v530.css',
  'media-engine-v149.js','media-engine-v192.js','media-commerce-world-v320.js',
  'page-loader-v1.js','app-v208.js','pwa-world-v324.js','sw.js','index.html',
  'consultas-de-tarot.html','tarot-consultations.html','consultas-tarot.html',
  'loja-mistica.html','musica.html','de-frente-com-o-tarot.html',
  'instalar-app.html','install-app.html','instalar-aplicacion.html'
];
payload.forEach(file=>add(`arquivo:${file}`,exists(file)));

const stamp=`?qa=${Date.now()}`;
const truth=await import(pathToFileURL(path.join(root,'commercial-truth-v200.js')).href+stamp);
const storePolicy=await import(pathToFileURL(path.join(root,'store-policy.js')).href+stamp);
const config=await import(pathToFileURL(path.join(root,'config-v200.js')).href+stamp);
const tarot=await import(pathToFileURL(path.join(root,'tarot-data.js')).href+stamp);
const school=await import(pathToFileURL(path.join(root,'school-policy.js')).href+stamp);

const prices=truth.COMMERCIAL_TRUTH_V200.services.map(item=>item.priceCents);
add('consultas:4-servicos',truth.COMMERCIAL_TRUTH_V200.services.length===4);
add('consultas:precos-canonicos',prices.join(',')==='50000,50000,30000,15000',prices.join(','));
add('consultas:nome-pensamentos',truth.COMMERCIAL_TRUTH_V200.services[1]?.name==='Leitura de Pensamentos');
add('consultas:email-oficial',truth.COMMERCIAL_TRUTH_V200.officialContact.email==='orbedasrealidades@hotmail.com');
add('consultas:email-apenas',truth.COMMERCIAL_TRUTH_V200.officialContact.whatsapp===null);
add('consultas:sem-billing-real',truth.COMMERCIAL_TRUTH_V200.realBilling===false&&truth.COMMERCIAL_TRUTH_V200.checkoutEnabled===false);

const consultationPages=['consultas-de-tarot.html','tarot-consultations.html','consultas-tarot.html'];
for(const file of consultationPages){
  const html=read(file);
  add(`consultas:${file}:500`,(html.match(/R\$ 500/g)||[]).length>=2);
  add(`consultas:${file}:300`,html.includes('R$ 300'));
  add(`consultas:${file}:150`,html.includes('R$ 150'));
  add(`consultas:${file}:sem-preco-antigo`,!html.includes('R$ 250')&&!html.includes('R$ 100')&&!/R\$ 50(?:\D|$)/.test(html));
  add(`consultas:${file}:pensamentos`,html.includes('Leitura de Pensamentos'));
  add(`consultas:${file}:email`,html.includes('orbedasrealidades@hotmail.com'));
  add(`consultas:${file}:sem-whatsapp`,!html.includes('wa.me/')&&!html.includes('api.whatsapp.com'));
  for(const [,json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
    let valid=true;try{JSON.parse(json);}catch{valid=false;}add(`jsonld:${file}`,valid);
  }
}
const ptConsult=read('consultas-de-tarot.html');
add('consultas:json-precos-reais',['"price": 500','"price": 300','"price": 150'].every(value=>ptConsult.includes(value)));
add('consultas:json-sem-disponibilidade-falsa',!ptConsult.includes('schema.org/InStock'));
add('consultas:faixa-150-500',ptConsult.includes('R$ 150–500'));

add('loja:21-escolhas',config.CONFIG.products.length===21,String(config.CONFIG.products.length));
add('loja:4-colecoes',storePolicy.STORE_POLICY.collections.length===4);
add('loja:tag-oficial',config.CONFIG.amazonAssociateTag==='orbedasrealid-20');
add('loja:host-amazon-br',storePolicy.STORE_POLICY.affiliateHost==='www.amazon.com.br');
add('loja:aviso-afiliado',storePolicy.STORE_POLICY.disclosure.includes('associado da Amazon'));
add('loja:sem-checkout',storePolicy.STORE_POLICY.checkout===false&&storePolicy.STORE_POLICY.productionBilling===false);
add('loja:sem-dados-pagamento',storePolicy.STORE_POLICY.storesPaymentData===false);

add('musica:2-albuns',config.CONFIG.spotifyAlbums.length===2,String(config.CONFIG.spotifyAlbums.length));
add('musica:sobre-as-estrelas',config.CONFIG.spotifyAlbums.some(item=>item.name==='Sobre as Estrelas'));
add('musica:z',config.CONFIG.spotifyAlbums.some(item=>item.name==='Z'));
add('videos:zero-config-inventado',config.CONFIG.youtubeVideos.length===0);

const core=read('experience-depth-core-v541.js');
const css=read('experience-depth-core-v541.css');
const base=read('experience-conversion-core-v530.js');
const media=read('media-engine-v149.js');
const app=read('app-v208.js');
const loader=read('page-loader-v1.js');
const pwa=read('pwa-world-v324.js');
const sw=read('sw.js');
const index=read('index.html');

for(const route of ['consultations','store','music','videos'])add(`v541:mundo:${route}`,core.includes(`'${route}'`));
add('v541:consultas-guia',core.includes('O tamanho da leitura deve acompanhar o tamanho da pergunta'));
add('v541:consultas-precos',core.includes('[50000,50000,30000,15000]'));
add('v541:consultas-email-apenas',core.includes("consultationChannel:'email-only'"));
add('v541:loja-intencao',core.includes('Entre por uma intenção, não por impulso'));
add('v541:loja-comparacao',core.includes('Confira material, tamanho, idioma, vendedor e avaliações'));
add('v541:loja-afiliado',core.includes("storeAssociateTag:'orbedasrealid-20'"));
add('v541:musica-escuta',core.includes('A música começa somente quando você escolhe'));
add('v541:video-metodo',['Símbolo central','Pergunta humana','Gesto possível'].every(value=>core.includes(value)));
add('v541:video-busca',core.includes('data-ex541-video-search'));
add('v541:video-compartilhar',core.includes('navigator.share')&&core.includes('navigator.clipboard.writeText'));
add('v541:video-publicado-apenas',core.includes("videoPublicSource:'published-only'")&&core.includes('videoInventedEpisodes:0'));

const privacy=['privateFieldReads:0','journalReads:0','consultationQuestionReads:0','phoneReads:0','storageReads:0','storageWrites:0','analyticsTextWrites:0','networkCalls:0','modelCalls:0'];
privacy.forEach(item=>add(`privacidade:${item}`,core.includes(item)));
add('privacidade:sem-storage-no-core',!core.includes('localStorage')&&!core.includes('sessionStorage')&&!core.includes('store.get')&&!core.includes('store.set'));
add('privacidade:sem-leitura-formulario',!core.includes('FormData')&&!core.includes('textarea'));

add('fluidez:sem-loop-css',!css.includes('infinite'));
add('fluidez:sem-raf-v541',!core.includes('requestAnimationFrame'));
add('fluidez:sem-observer-v541',!core.includes('MutationObserver'));
add('fluidez:sem-pointermove-v541',!core.includes('pointermove'));
add('fluidez:sem-pointermove-v530',!base.includes("addEventListener('pointermove'"));
add('fluidez:sem-canvas-v541',!core.includes("createElement('canvas")&&!core.includes('getContext('));
add('fluidez:sem-blur-v541',!css.includes('backdrop-filter'));
add('fluidez:conteudo-diferido',css.includes('content-visibility:auto'));
add('fluidez:alvos-44',css.includes('min-height:44px'));
add('fluidez:mobile-uma-coluna',css.includes('@media(max-width:560px)')&&css.includes('grid-template-columns:1fr'));
add('fluidez:reduced-motion',css.includes('prefers-reduced-motion:reduce')&&css.includes('animation:none!important'));
add('fluidez:toque-manipulation',css.includes('touch-action:manipulation'));

add('musica:player-v530-adormecido',base.includes("this.loadedAlbumId = ''")&&base.includes('data-ec530-load-player'));
add('musica:player-base-adormecido',media.includes("this.loadedAlbumId=''")&&media.includes('data-media-load-album'));
add('musica:iframe-apos-escolha-v530',base.indexOf('if (this.loadedAlbumId !== album.spotifyId)')<base.indexOf('<iframe title="Ouvir'));
add('musica:iframe-apos-escolha-base',media.indexOf('if(this.loadedAlbumId!==album.id)')<media.indexOf('<iframe title="Ouvir'));
add('musica:sem-permissao-autoplay',!media.includes('allow="autoplay;')&&!base.includes('allow="autoplay;'));
add('musica:player-online-marcado',media.includes('data-requires-online')&&base.includes('data-requires-online'));

for(const file of ['loja-mistica.html','musica.html','de-frente-com-o-tarot.html','consultas-de-tarot.html']){
  add(`publica:${file}:v541`,read(file).includes('experience-depth-core-v541.js?v=541'));
}
add('publica:musica-cache-bust',read('musica.html').includes('media-engine-v192.js?v=541-lazy-player'));
add('publica:video-cache-bust',read('de-frente-com-o-tarot.html').includes('media-engine-v192.js?v=541-lazy-player'));
add('runtime:media-v192-cache-bust',read('media-engine-v192.js').includes('media-engine-v149.js?v=541-lazy-player'));
add('runtime:media-v320-cache-bust',read('media-commerce-world-v320.js').includes('media-engine-v192.js?v=541-lazy-player'));
add('runtime:loader-media-v541',(loader.match(/media-commerce-world-v320\.js\?v=541/g)||[]).length>=6);

add('release:app-v541',app.includes("release:'V541'")&&app.includes("currentMacroStage:'7-of-14'"));
add('release:epoch-v541',app.includes('const RELEASE_EPOCH_V537 = 541')&&app.includes("releaseEpoch = 'v541'"));
add('release:contrato-v541',app.includes('divinaExperienceReleaseV541'));
add('release:app-importa-v541',app.includes('experience-depth-core-v541.js?v=541'));
add('release:index-v541',index.includes('app-v208.js?v=541')&&index.includes('sw.js?v=541'));
add('release:pwa-v541',pwa.includes('const VERSION=541')&&pwa.includes('sw.js?v=541'));
add('release:pwa-bootstrap-v541',pwa.includes("__divinaSWBootstrap='v541'")&&pwa.includes('experiencias-conversao-v541'));
add('release:sw-v541',sw.includes('const VERSION=541')&&sw.includes('divina-bruxa-v541-shell'));
add('release:sw-core-v541',(sw.match(/experience-depth-core-v541\.js/g)||[]).length===3);
for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const html=read(file);add(`release:${file}-v541`,html.includes('PWA V541')&&html.includes('pwa-world-v324.js?v=541'));
}

add('travas:staging',truth.COMMERCIAL_TRUTH_V200.environment==='staging'&&core.includes('productionPublish:false'));
add('travas:billing-off',core.includes('realBilling:false')&&app.includes('experienceConsultationRealBilling:false'));
add('travas:orbe-unica',core.includes("canonicalOrb:'V501'")&&core.includes('parallelOrbEngines:0'));
add('travas:sol-off',app.includes('whitSolEnabled:false'));
add('regressao:tarot-78',tarot.CARDS.length===78&&new Set(tarot.CARDS.map(card=>card.id)).size===78);
add('regressao:tarot-direto',tarot.CARDS.every(card=>card.orientation==='normal'));
add('regressao:escola-17-124',school.SCHOOL_MODULES.length===17&&school.SCHOOL_LESSON_TOTAL===124);
add('regressao:whit-local-v540',app.includes('whitLocalBasic:true')&&app.includes('whitLocalCredits:0'));
add('regressao:tarot-sem-fogo',read('tarot-livre-orbe-os-v517.js').includes('fireInsideUniverseCanvas:false'));

for(const file of ['experience-depth-core-v541.js','experience-conversion-core-v530.js','media-engine-v149.js','media-engine-v192.js','media-commerce-world-v320.js','app-v208.js','page-loader-v1.js']){
  const source=read(file);
  for(const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)|import\(\s*['"](\.\.?\/[^'"]+)/g)){
    const ref=(match[1]||match[2]).split('?')[0];
    add(`referencia:${file}:${ref}`,exists(path.normalize(path.join(path.dirname(file),ref))));
  }
}

const failed=checks.filter(check=>!check.pass);
const result={version:'V541',macroStage:'7/14',total:checks.length,passed:checks.length-failed.length,failed:failed.length,failures:failed};
console.log(JSON.stringify(result,null,2));
if(failed.length)process.exitCode=1;
