import fs from 'node:fs';
import { CARDS } from './tarot-data.js';
import './tarot-meanings.js';
import { cardContentId, cardPageHref, librarySearchText, matchesLibraryFilters } from './card-library-policy.js';

let passed=0;
const failures=[];
const check=(condition,label)=>condition?passed++:failures.push(label);
const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
const exists=file=>fs.existsSync(new URL(file,import.meta.url));
const meaningFor=card=>globalThis.DivinaBruxaTarotMeanings?.get?.(cardContentId(card));

const required=[
  'public-library-core-v544.js','public-library-core-v544.css','library-world-v302.js','library-world-v302.css',
  'library-deep-v332.js','card-library-policy.js','card-library-engine.js','biblioteca-universal-v184.js',
  'busca-v165.js','buscar.html','cartas-do-tarot.html','sitemap.xml','sitemap-principal.xml','sitemap-cartas.xml',
  'page-loader-v1.js','app-v208.js','pwa-world-v324.js','pwa-world-v196.js','sw.js','index.html',
  'loja-mistica.html','instalar-app.html','install-app.html','instalar-aplicacion.html'
];
required.forEach(file=>check(exists(file),`arquivo:${file}`));

check(CARDS.length===78,'catalogo-78');
check(new Set(CARDS.map(card=>cardContentId(card))).size===78,'ids-78-unicos');
check(CARDS.filter(card=>card.orientation==='normal').length===78,'78-diretas');
check(CARDS.filter(meaningFor).length===78,'78-significados');
check(CARDS.filter(card=>card.arcanaCode==='major').length===22,'22-maiores');
check(CARDS.filter(card=>card.arcanaCode!=='major').length===56,'56-menores');
for(const suit of ['copas','espadas','paus','ouros'])check(CARDS.filter(card=>card.suitCode===suit).length===14,`14-${suit}`);

const cardHrefs=new Set();
CARDS.forEach((card,index)=>{
  const id=cardContentId(card);
  const href=cardPageHref(card);
  const deep=meaningFor(card)||{};
  check(!cardHrefs.has(href),`${id}:href-unico`);cardHrefs.add(href);
  check(exists(href),`${id}:pagina`);
  check(exists(card.image),`${id}:imagem`);
  check(card.orientation==='normal',`${id}:direta`);
  check(Boolean(card.name&&card.names?.en&&card.names?.es),`${id}:nomes-3-idiomas`);
  check(Boolean(card.element),`${id}:elemento`);
  check(Array.isArray(deep.keywords)&&deep.keywords.length>=3,`${id}:palavras-chave`);
  check(Boolean(deep.essence||deep.centralMessage),`${id}:essencia`);
  check(librarySearchText(card).includes(card.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR')),`${id}:indice-nome`);
  check(matchesLibraryFilters(card,{query:card.name,arcana:'',suit:'',element:'',kind:''}),`${id}:busca-nome`);
  const page=read(href);
  check(page.length>14000,`${id}:conteudo-profundo`);
  check(page.includes('<link rel="canonical"'),`${id}:canonical`);
  check(page.includes('application/ld+json'),`${id}:dados-estruturados`);
  check(page.includes('<h1>'),`${id}:h1`);
  check(page.includes('id="amor"'),`${id}:amor`);
  check(page.includes('id="trabalho"'),`${id}:trabalho`);
  check(page.includes('id="simbolos"'),`${id}:simbolos`);
  check(page.includes('id="combinacoes"'),`${id}:combinacoes`);
  check(page.includes('id="conselho"'),`${id}:conselho`);
  check(page.includes('posição direta')||page.includes('ORIENTAÇÃO DIRETA'),`${id}:orientacao-publica`);
  check(!/carta invertida sorteada|orientação invertida/i.test(page),`${id}:sem-invertida-operacional`);
  check(index===card.index,`${id}:ordem-canonica`);
});

const guides=['tarot-para-iniciantes.html','simbolos-do-tarot.html','como-fazer-perguntas-ao-tarot.html','como-embaralhar-cartas-de-tarot.html','como-limpar-consagrar-baralho-de-tarot.html','plano-de-estudo-do-tarot-em-30-dias.html','diario-de-tarot.html','etica-e-responsabilidade.html'];
guides.forEach(file=>{check(exists(file),`guia:${file}`);const html=read(file);check(html.includes('<title>'),`${file}:title`);check(html.includes('rel="canonical"'),`${file}:canonical`);check(html.includes('<h1>'),`${file}:h1`);});

const core=read('public-library-core-v544.js');
check((core.match(/\['[^']+','[^']+','[^']+','[^']+'\]/g)||[]).length===6,'seis-intencoes');
guides.forEach(file=>check(core.includes(file),`core-guia:${file}`));
['pointermove','MutationObserver','setInterval(','requestAnimationFrame(','<canvas'].forEach(token=>check(!core.includes(token),`core-sem:${token}`));
check(core.includes('privateSearchReads:0'),'busca-privada');
check(core.includes('permanentAnimationLoops:0'),'sem-loops');

const world=read('library-world-v302.js');
check(!world.includes('startWhit()'),'sem-ciclo-whit');
check(!world.includes('whisperDelay'),'sem-timer-whit');
check(world.includes("release:'V544'"),'world-v544');
check(world.includes('duration:420'),'resposta-leve');
const deep=read('library-deep-v332.js');
check(!deep.includes('MutationObserver'),'sem-observador-mutacao');
check(deep.includes('mutationObservers:0'),'contrato-sem-observador');

const search=read('busca-v165.js');
check(search.includes("import './tarot-meanings.js?v=544'"),'busca-significados');
for(const field of ['deep.keywords','deep.symbols','deep.love','deep.career','deep.money','deep.spirituality','deep.advice'])check(search.includes(field),`busca:${field}`);
check((search.match(/^  \['/gm)||[]).length===56,'busca-56-paginas');
check(78+(search.match(/^  \['/gm)||[]).length===134,'busca-134-caminhos');
const searchPage=read('buscar.html');
check(searchPage.includes('134 CAMINHOS · BUSCA PROFUNDA V544'),'pagina-busca-v544');
check(searchPage.includes('Busca privada e local'),'pagina-busca-privada');

const index=read('index.html');
check(index.includes('app-v208.js?v=544'),'index-app-v544');
check(index.includes("__divinaSWBootstrap='v544-inline'"),'index-pwa-v544');
check(index.includes('BIBLIOTECA PÚBLICA · V544 · 78 CARTAS'),'index-biblioteca-v544');
const app=read('app-v208.js');
check(app.includes("currentMacroStage:'10-of-14'"),'app-macro-10');
check(app.includes("release:'V544'"),'app-release-v544');
check(app.includes('createPublicLibraryCoreV544'),'app-core-v544');
check(app.includes('oneCanonicalOrb:true'),'orbe-canonica');
check(app.includes('tarotFireRemoved:true'),'tarot-sem-fogo-preservado');
check(app.includes('canonicalTarotNormalOnly:true'),'tarot-direto-preservado');
check(app.includes("amazonStore:'v543'"),'loja-v543-preservada');

const publicPage=read('cartas-do-tarot.html');
check(publicPage.includes('numberOfItems": 78'),'schema-78');
check(publicPage.includes('public-library-core-v544.css?v=544'),'pagina-publica-css');
check(publicPage.includes('createPublicLibraryCoreV544'),'pagina-publica-core');
check(publicPage.includes('"dateModified": "2026-09-13"'),'pagina-publica-revisada');

const sw=read('sw.js');
check(sw.includes('const VERSION=544'),'sw-v544');
check(sw.includes("'./public-library-core-v544.js','./public-library-core-v544.css'"),'sw-core-v544');
check(sw.includes("'./buscar.html','./guias-para-comecar.html','./mapa-do-tarot.html'"),'sw-publicos');
check(sw.includes("'./busca-v165.js','./busca-v165.css'"),'sw-busca');
check(!sw.includes('divina-bruxa-v543-shell'),'sw-cache-antigo-removido');

for(const file of ['instalar-app.html','install-app.html','instalar-aplicacion.html']){
  const html=read(file);check(html.includes('manifest.webmanifest?v=544'),`${file}:manifest`);check(html.includes('pwa-world-v324.js?v=544'),`${file}:pwa`);
}
check(read('sitemap-principal.xml').includes('<loc>https://divinabruxa.com.br/buscar.html</loc><lastmod>2026-09-13</lastmod>'),'sitemap-busca');
check(/cartas-do-tarot\.html<\/loc>\s*<lastmod>2026-09-13<\/lastmod>/.test(read('sitemap-cartas.xml')),'sitemap-biblioteca');

const total=passed+failures.length;
console.log(`V544 QA: ${passed}/${total} verificações aprovadas.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
