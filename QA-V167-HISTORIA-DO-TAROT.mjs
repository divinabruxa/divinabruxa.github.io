import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root=path.resolve(process.argv[2]||process.cwd());
const checks=[],failures=[];
const pass=(name,condition,detail='')=>{checks.push(Boolean(condition));if(!condition)failures.push(detail?`${name}: ${detail}`:name);};
const filePath=name=>path.join(root,name);
const exists=name=>fs.existsSync(filePath(name))&&fs.statSync(filePath(name)).isFile();
const read=name=>fs.readFileSync(filePath(name),'utf8');
const bytes=name=>fs.readFileSync(filePath(name));
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const count=(value,expression)=>[...value.matchAll(expression)].length;

const required=['sitemap.xml','buscar.html','busca-v165.js','guias-para-comecar.html','glossario-do-tarot.html','historia-do-tarot.html','historia-tarot-v167.css','00-LEIA-PRIMEIRO-V167-HISTORIA-DOCUMENTADA-DO-TAROT.txt','HISTORIA-TAROT-V167.json','QA-V167-HISTORIA-DO-TAROT.mjs','ARQUIVOS-V167-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V167-HISTORIA-DOCUMENTADA-DO-TAROT',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('historia-do-tarot.html'),css=read('historia-tarot-v167.css');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='História do Tarot: origem, fatos e mitos | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/historia-do-tarot.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS da história',html.includes('historia-tarot-v167.css?v=167'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
pass('Sem script funcional',count(html,/<script(?:\s|>)/g)===1&&count(html,/type="application\/ld\+json"/g)===1);
pass('Arte contemporânea identificada',html.includes('ARTE CONTEMPORÂNEA · NÃO É DOCUMENTO HISTÓRICO'));
pass('Imagem com dimensões',html.includes('<img src="tarot-atlas.webp" width="3000" height="3600"'));
pass('Alt descritivo',html.includes('alt="Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa"'));

for(const tag of ['header','nav','main','article','section','aside','footer','figure','figcaption','ol','li','dl','dt','dd'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
pass('IDs únicos',ids.length===new Set(ids).size,`${ids.length}/${new Set(ids).size}`);
const hashTargets=[...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
pass('Âncoras internas válidas',hashTargets.every(id=>ids.includes(id)));
for(const m of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of m[1].split(/\s+/))pass(`ARIA encontra ${id}`,ids.includes(id));

let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[];pass('JSON-LD válido',true);}catch(error){pass('JSON-LD válido',false,error.message);}
for(const type of ['Organization','WebSite','ImageObject','BreadcrumbList','Article'])pass(`JSON-LD ${type}`,graph.some(x=>x['@type']===type));
const article=graph.find(x=>x['@type']==='Article');
pass('Article com datas',article?.datePublished==='2026-09-07'&&article?.dateModified==='2026-09-07');
pass('Article gratuito e em português',article?.isAccessibleForFree===true&&article?.inLanguage==='pt-BR');
pass('Article com quatro citações',article?.citation?.length===4&&new Set(article.citation).size===4);
pass('Imagem estruturada contemporânea',graph.find(x=>x['@type']==='ImageObject')?.caption==='Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa');

pass('Navegação interna completa',['#evidencias','#linha-do-tempo','#mitos','#estrutura','#fontes'].every(value=>html.includes(`href="${value}"`)));
pass('Três blocos de evidência',count(html,/class="evidence-grid"/g)===1&&count(html,/Fontes? [123](?: e 3)? <span class="sr-only"/g)===3);
pass('Seis momentos históricos',count(html,/class="timeline-date"/g)===6);
pass('Quatro comparações mito e evidência',count(html,/class="claim-label"/g)===4);
pass('Quatro fontes numeradas',count(html,/<li id="fonte-[^"]+">/g)===4);
pass('Quatro links externos seguros',count(html,/target="_blank" rel="noopener noreferrer"/g)===4);
for(const url of ['https://www.metmuseum.org/perspectives/tarot-2','https://www.themorgan.org/collection/tarot-cards','https://www.themorgan.org/exhibitions/tarot','https://www.britishmuseum.org/collection/object/P_1904-0511-47-1-78'])pass(`Fonte: ${url}`,count(html,new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))===2);

for(const phrase of ['1440 e 1450','norte da Itália','jogo de vazas','56 cartas de naipe, 21 triunfos e o Louco','Visconti-Sforza','Nicolas Conver em 1760','associação do Tarot com adivinhação e ocultismo ganhou circulação no século XIX'])pass(`Marco histórico: ${phrase}`,html.includes(phrase));
for(const phrase of ['Uma origem egípcia pertence a narrativas esotéricas posteriores','o uso inicial documentado é um jogo de vazas','conjuntos antigos apresentam variações','não permitem reconstruir cada etapa anterior','não está demonstrada pelas fontes disponíveis'])pass(`Cautela editorial: ${phrase}`,html.includes(phrase));
for(const phrase of ['sem prometer certezas','não é documento histórico','não é o mesmo que lenda de origem','não determina como alguém deve se relacionar'])pass(`Contexto responsável: ${phrase}`,html.includes(phrase));

for(const link of ['guias-para-comecar.html','buscar.html','glossario-do-tarot.html','cartas-do-tarot.html','tarot-para-iniciantes.html','arcanos-maiores.html','arcanos-menores.html','metodologia-do-tarot.html','etica-e-responsabilidade.html'])pass(`Link editorial: ${link}`,html.includes(`href="${link}"`));

pass('CSS com linha do tempo',css.includes('.history-timeline::before')&&css.includes('.history-timeline li::before'));
pass('CSS com evidências em grade',css.includes('.evidence-grid')&&css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
pass('CSS com mitos em grade',css.includes('.myth-grid')&&css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
pass('CSS móvel',css.includes('@media (max-width: 760px)')&&css.includes('@media (max-width: 560px)'));
pass('CSS para telas mínimas',css.includes('@media (max-width: 340px)'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS de impressão',css.includes('@media print'));
pass('CSS equilibrado',count(css,/{/g)===count(css,/}/g),`${count(css,/{/g)}/${count(css,/}/g)}`);

const guides=read('guias-para-comecar.html'),glossary=read('glossario-do-tarot.html');
pass('Guias ligam história três vezes',count(guides,/href="historia-do-tarot\.html"/g)===3);
pass('Glossário liga história duas vezes',count(glossary,/href="historia-do-tarot\.html"/g)===2);
pass('Definição de Tarot liga história',glossary.includes('<a href="historia-do-tarot.html">Conheça sua história documentada</a>'));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 119 caminhos',searchHtml.includes('119 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V167',searchHtml.includes('busca-v165.js?v=167'));
pass('Índice contém história uma vez',count(searchScript,/\['História do Tarot', 'historia-do-tarot\.html'/g)===1);
pass('História em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26,27].includes(index)'));

const recoveredGuides=guides.replace('<a href="historia-do-tarot.html">História</a>','').replace('<a href="historia-do-tarot.html">Conhecer a história documentada do Tarot →</a>','').replace('<a href="historia-do-tarot.html"><span aria-hidden="true">1440</span><strong>História do Tarot</strong><small>Origem, fatos e mitos</small></a>','');
pass('Guias V166 preservados fora da integração',sha256(recoveredGuides)==='33561aae608355c9c9ba6fff3392f00e4ec41a2dfecb23f2d150a1c501977a98',sha256(recoveredGuides));
const recoveredGlossary=glossary.replace(' <a href="historia-do-tarot.html">Conheça sua história documentada</a>.','').replace('<a href="historia-do-tarot.html"><span aria-hidden="true">1440</span><strong>História do Tarot</strong><small>Origem, fatos e mitos</small></a>','');
pass('Glossário V166 preservado fora da integração',sha256(recoveredGlossary)==='2bbeda3f738b5b1bf4534d212c7d9d379df2db914633f03549e6b39cce40c231',sha256(recoveredGlossary));
const recoveredSearchHtml=searchHtml.replace('119 CAMINHOS · UMA BUSCA','118 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=167','busca-v165.js?v=166');
pass('Página de busca V166 preservada',sha256(recoveredSearchHtml)==='a02a7e43f2efdb9869d274b5fa781dfd996cf009fe71f70522a422563784307f',sha256(recoveredSearchHtml));
const historyIndexLine="  ['História do Tarot', 'historia-do-tarot.html', 'História documentada', 'aprender', 'Origem do Tarot no norte da Itália, registros de 1440 e 1450, jogo de vazas, Visconti-Sforza, Tarot de Marselha, Nicolas Conver, cartomancia, ocultismo, fatos, mitos, evidências, museus e fontes. Egito antigo renascimento renascentista'],\n";
const recoveredSearchScript=searchScript.replace(historyIndexLine,'').replace('[1,2,3,4,5,6,14,15,26,27].includes(index)','[1,2,3,4,5,6,14,15,26].includes(index)');
pass('Motor de busca V166 preservado',sha256(recoveredSearchScript)==='488429ef96441e2717f1cb72896e22f4ac1a5f8350d0d3b5bb9232618ba9f0f0',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 120 URLs',count(sitemap,/<url>/g)===120);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('História única no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/historia-do-tarot\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(m=>m[1]);
pass('URLs de página únicas',pageLocs.length===120&&new Set(pageLocs).size===120,`${pageLocs.length}/${new Set(pageLocs).size}`);
const historySitemapBlock='  <url>\n    <loc>https://divinabruxa.com.br/historia-do-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
const recoveredSitemap=sitemap.replace(historySitemapBlock,'');
pass('Sitemap V166 preservado',sha256(recoveredSitemap)==='c062276cbfde795efe3047f449fb5493f7580ce454104b92c2bdd771e407ed07',sha256(recoveredSitemap));

const contract=JSON.parse(read('HISTORIA-TAROT-V167.json'));
pass('Contrato V167',contract.schemaVersion==='167.0.0');
pass('Contrato histórico',contract.historyPage?.timelineMoments===6&&contract.historyPage?.mythEvidenceComparisons===4&&contract.historyPage?.institutionalSources===4);
pass('Contrato metodologia',contract.editorialMethod?.historicalEvidenceSeparatedFromTradition===true&&contract.editorialMethod?.historicalEvidenceSeparatedFromMyth===true&&contract.editorialMethod?.uncertaintyExplicitlyAcknowledged===true);
pass('Contrato rejeita alegações indevidas',contract.editorialMethod?.ancientEgyptPresentedAsProvenOrigin===false&&contract.editorialMethod?.divinationPresentedAsOriginalDocumentedUse===false&&contract.editorialMethod?.singleImmutableDeckClaimed===false);
pass('Contrato quatro referências',contract.references?.length===4&&new Set(contract.references.map(x=>x.url)).size===4);
pass('Contrato busca 119',contract.searchIntegration?.indexedDestinationsAfter===119&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===119);
pass('Contrato sitemap 120',contract.discoverability?.sitemapUrlsAfter===120&&contract.discoverability?.sitemapImageEntries===78);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78&&contract.safeguards?.tarotLivreRepeats===false);
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true);
pass('Contrato onze arquivos',contract.installation?.filesInPackage===11&&contract.installation?.replace?.length===5&&contract.installation?.add?.length===6);

const manifest=new Map();
for(const line of read('ARQUIVOS-V167-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V167-SHA256.txt');
pass('Manifesto dez hashes',manifest.size===10,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','glossario-v166.css':'eade19b83031c1e27f88a9fc1f1a14165ce497b41b60eb06a04b575415d4ee06','glossario-v166.js':'33e5e1512f265d5ef7b23c62a9122edfe3d4ab0c0d4fa1826c45843e61fb634b','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  pass('Atlas existente preservado',exists('tarot-atlas.webp')&&fs.statSync(filePath('tarot-atlas.webp')).size>1000000);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino da história: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=167`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 119 destinos',entries.length===119,`${entries.length}`);
  pass('Índice possui 119 URLs únicas',new Set(entries.map(x=>x.url)).size===119);
  const categories=Object.fromEntries(['cartas','tiragens','aprender','portal'].map(category=>[category,entries.filter(x=>x.category===category).length]));
  pass('Categorias 78 + 14 + 17 + 10',JSON.stringify(categories)===JSON.stringify({cartas:78,tiragens:14,aprender:17,portal:10}),JSON.stringify(categories));
  pass('Índice liga história em destaque',entries.some(x=>x.url==='historia-do-tarot.html'&&x.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  for(const query of ['historia','Visconti Sforza','Nicolas Conver','Egito antigo'])pass(`Busca encontra história: ${query}`,find(query).some(x=>x.url==='historia-do-tarot.html'));
  pass('Busca ainda encontra carta',find('A Lua').some(x=>x.title==='A Lua'));
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(value=>consult.includes(value)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}

const result={suite:'DIVINA-BRUXA-V167-HISTORIA-DOCUMENTADA-DO-TAROT',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
