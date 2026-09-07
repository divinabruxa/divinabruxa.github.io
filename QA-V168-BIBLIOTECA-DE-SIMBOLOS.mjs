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

const required=['sitemap.xml','buscar.html','busca-v165.js','guias-para-comecar.html','glossario-do-tarot.html','tarot-para-iniciantes.html','simbolos-do-tarot.html','simbolos-tarot-v168.css','simbolos-tarot-v168.js','00-LEIA-PRIMEIRO-V168-BIBLIOTECA-DE-SIMBOLOS.txt','SIMBOLOS-TAROT-V168.json','QA-V168-BIBLIOTECA-DE-SIMBOLOS.mjs','ARQUIVOS-V168-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V168-BIBLIOTECA-DE-SIMBOLOS-DO-TAROT',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('simbolos-do-tarot.html'),css=read('simbolos-tarot-v168.css'),script=read('simbolos-tarot-v168.js');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='Símbolos do Tarot: guia visual e interpretação | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/simbolos-do-tarot.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS dos símbolos',html.includes('simbolos-tarot-v168.css?v=168'));
pass('Script dos símbolos',html.includes('<script src="simbolos-tarot-v168.js?v=168" defer></script>'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
pass('Imagem existente com dimensões',html.includes('<img src="card-02.webp" width="1024" height="1536"'));
pass('Alt descreve símbolos visíveis',html.includes('alt="A Sacerdotisa diante de lua, estrelas, livro, taça, flores, colunas e véus"'));
pass('Arte contemporânea identificada',html.includes('CARTA CONTEMPORÂNEA · OS SÍMBOLOS VARIAM ENTRE BARALHOS'));

for(const tag of ['header','nav','main','article','section','aside','footer','figure','figcaption','form','ol','li','details','summary','dl','dt','dd'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
pass('IDs únicos',ids.length===new Set(ids).size,`${ids.length}/${new Set(ids).size}`);
const hashTargets=[...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
pass('Âncoras internas válidas',hashTargets.every(id=>ids.includes(id)));
for(const m of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of m[1].split(/\s+/))pass(`ARIA encontra ${id}`,ids.includes(id));

let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[];pass('JSON-LD válido',true);}catch(error){pass('JSON-LD válido',false,error.message);}
for(const type of ['Organization','WebSite','ImageObject','BreadcrumbList','DefinedTermSet','CollectionPage'])pass(`JSON-LD ${type}`,graph.some(x=>x['@type']===type));
const termSet=graph.find(x=>x['@type']==='DefinedTermSet');
pass('DefinedTermSet com 32 símbolos',termSet?.hasDefinedTerm?.length===32,`${termSet?.hasDefinedTerm?.length}`);
pass('DefinedTermSet usa DefinedTerm',termSet?.hasDefinedTerm?.every(x=>x['@type']==='DefinedTerm'&&x.name));
const domTerms=[...html.matchAll(/<h3><a href="#simbolo-[^"]+">([^<]+)<\/a><\/h3>/g)].map(m=>m[1]);
const schemaTerms=termSet?.hasDefinedTerm?.map(x=>x.name)||[];
pass('32 títulos de símbolos',domTerms.length===32);
pass('Símbolos únicos',new Set(domTerms).size===32);
pass('Schema corresponde ao conteúdo',JSON.stringify(schemaTerms)===JSON.stringify(domTerms));
const webpage=graph.find(x=>x['@type']==='CollectionPage');
pass('CollectionPage com datas',webpage?.datePublished==='2026-09-07'&&webpage?.dateModified==='2026-09-07');
pass('CollectionPage aponta para termos e imagem',webpage?.mainEntity?.['@id']?.endsWith('#termset')&&webpage?.primaryImageOfPage?.['@id']?.endsWith('#primaryimage'));

pass('32 entradas visuais',count(html,/data-symbol-entry data-category=/g)===32);
pass('Quatro famílias',count(html,/class="symbol-family" data-symbol-section=/g)===4);
const familyCounts=Object.fromEntries(['ceu','natureza','objetos','movimento'].map(category=>[category,count(html,new RegExp(`data-symbol-entry data-category="${category}"`,'g'))]));
pass('Famílias 8 + 8 + 10 + 6',JSON.stringify(familyCounts)===JSON.stringify({ceu:8,natureza:8,objetos:10,movimento:6}),JSON.stringify(familyCounts));
pass('32 links editoriais nas entradas',count(html,/class="symbol-card-link"/g)===32);
pass('Três camadas do método',count(html,/<ol class="symbol-method">/g)===1&&['Descreva','Relacione','Sintetize'].every(value=>html.includes(`<h3>${value}</h3>`)));
pass('Quatro perguntas frequentes',count(html,/<details>/g)===4);

pass('Formulário de busca local',html.includes('<form class="symbol-search" role="search" data-symbol-form>'));
pass('Rótulo visível',html.includes('<label for="buscar-simbolo">Buscar nesta biblioteca</label>'));
pass('Input nativo de busca',html.includes('id="buscar-simbolo" type="search"'));
pass('Cinco filtros',count(html,/data-symbol-filter="/g)===5);
pass('Filtro inicial pressionado',html.includes('aria-pressed="true" data-symbol-filter="todos"'));
pass('Contagem viva',html.includes('data-symbol-count aria-live="polite" aria-atomic="true">32 símbolos'));
pass('Estado vazio',html.includes('data-symbol-empty hidden')&&html.includes('data-symbol-reset'));

for(const phrase of ['Nenhum símbolo possui significado único, universal ou inevitável','mostra uma possibilidade de movimento, não uma rota inevitável','Um véu não prova segredo','símbolo não é fórmula','A imagem convida; não comprova','não demonstram pensamentos secretos, diagnósticos, acontecimentos inevitáveis ou fatos sem evidência'])pass(`Limite responsável: ${phrase}`,html.toLocaleLowerCase('pt-BR').includes(phrase.toLocaleLowerCase('pt-BR')));
for(const link of ['naipe-de-copas.html','naipe-de-espadas.html','naipe-de-paus.html','naipe-de-ouros.html','carta-02-a-sacerdotisa.html','carta-19-o-sol.html','carta-18-a-lua.html','carta-17-a-estrela.html','carta-16-a-torre.html','carta-15-o-diabo.html','carta-14-a-temperanca.html','carta-11-a-justica.html','carta-10-a-roda-da-fortuna.html','carta-09-o-eremita.html','carta-08-a-forca.html','carta-07-o-carro.html','carta-04-o-imperador.html','carta-03-a-imperatriz.html','carta-01-o-mago.html','carta-00-o-louco.html'])pass(`Ligação visual: ${link}`,html.includes(`href="${link}"`));

pass('Filtro normaliza acentos',script.includes(".normalize('NFD')")&&script.includes('/[\\u0300-\\u036f]/g'));
pass('Filtro usa as 32 entradas',script.includes("document.querySelectorAll('[data-symbol-entry]')"));
pass('Filtro combina palavras',script.includes('tokens.every(token => searchable.get(entry).includes(token))'));
pass('Filtro combina categoria',script.includes("activeCategory === 'todos' || entry.dataset.category === activeCategory"));
pass('Filtro esconde famílias vazias',script.includes("section.querySelector('[data-symbol-entry]:not([hidden])')"));
pass('Filtro anuncia quantidade',script.includes("visible === 1 ? 'símbolo' : 'símbolos'"));
pass('Filtro limpa com Escape',script.includes("event.key === 'Escape'"));
pass('Filtro possui reinício total',script.includes("activeCategory = 'todos'")&&script.includes("data-symbol-reset"));
pass('Sem injeção de HTML',!/innerHTML\s*=|insertAdjacentHTML|document\.write/.test(script));
pass('Sem transmissão externa',!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(script));
pass('Sem armazenamento',!/localStorage|sessionStorage|indexedDB|document\.cookie/.test(script));

pass('CSS principal em duas colunas',css.includes('.symbol-grid')&&css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
pass('CSS móvel em uma coluna',css.includes('@media (max-width: 760px)')&&css.includes('.symbol-grid {\n    grid-template-columns: 1fr'));
pass('CSS mantém texto principal em 16px',count(css,/font-size: 16px;/g)>=3&&css.includes('font: 500 16px/1.35'));
pass('CSS para telas mínimas',css.includes('@media (max-width: 340px)'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS de impressão revela conteúdo',css.includes('@media print')&&css.includes('.symbol-grid article[hidden]'));
pass('CSS possui foco de busca',css.includes(':focus-within'));
pass('CSS equilibrado',count(css,/{/g)===count(css,/}/g),`${count(css,/{/g)}/${count(css,/}/g)}`);

const guides=read('guias-para-comecar.html'),beginner=read('tarot-para-iniciantes.html'),glossary=read('glossario-do-tarot.html');
pass('Guias ligam símbolos uma vez',count(guides,/href="simbolos-do-tarot\.html"/g)===1);
pass('Iniciantes ligam símbolos duas vezes',count(beginner,/href="simbolos-do-tarot\.html"/g)===2);
pass('Glossário liga símbolos duas vezes',count(glossary,/href="simbolos-do-tarot\.html"/g)===2);
pass('Definição de símbolo liga biblioteca',glossary.includes('<a href="simbolos-do-tarot.html">Explore 32 símbolos recorrentes</a>'));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 120 caminhos',searchHtml.includes('120 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V168',searchHtml.includes('busca-v165.js?v=168'));
pass('Índice contém símbolos uma vez',count(searchScript,/\['Símbolos do Tarot', 'simbolos-do-tarot\.html'/g)===1);
pass('Símbolos em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26,27,28].includes(index)'));

const recoveredGuides=guides.replace(' <a href="simbolos-do-tarot.html">Explore a biblioteca de símbolos</a>.','');
pass('Guias V167 preservados fora da integração',sha256(recoveredGuides)==='be67aef9e43e15324b6c04a0c47c9384864a2ff7283a5d19e0fac7eec4562a26',sha256(recoveredGuides));
const recoveredBeginner=beginner.replace('<a href="simbolos-do-tarot.html">Símbolos</a>','').replace('<a href="simbolos-do-tarot.html"><span aria-hidden="true">✦</span><strong>Símbolos do Tarot</strong><small>32 imagens para observar</small></a>','');
pass('Iniciantes V167 preservado fora da integração',sha256(recoveredBeginner)==='9d6ab9048de9d13aefd6bfcd3ce6071e709cf74d3bbeac97199ee222c8c271de',sha256(recoveredBeginner));
const recoveredGlossary=glossary.replace('<a href="simbolos-do-tarot.html">Símbolos</a>','').replace(' <a href="simbolos-do-tarot.html">Explore 32 símbolos recorrentes</a>.','');
pass('Glossário V167 preservado fora da integração',sha256(recoveredGlossary)==='bf467edf569054505aaf427bb3a9fc421f494911d81f8c722f748f427a17d533',sha256(recoveredGlossary));
const recoveredSearchHtml=searchHtml.replace('120 CAMINHOS · UMA BUSCA','119 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=168','busca-v165.js?v=167');
pass('Página de busca V167 preservada',sha256(recoveredSearchHtml)==='674a3e30d09294a086bca28e7e2a7f72319a264dec81fd6a68ecfa830401e907',sha256(recoveredSearchHtml));
const symbolsIndexLine="  ['Símbolos do Tarot', 'simbolos-do-tarot.html', '32 símbolos', 'aprender', 'Biblioteca visual pesquisável com Sol, Lua, Estrela, relâmpago, nuvens, água, montanha, caminho, jardim, árvore, fogo, taça, espada, bastão, moeda, coroa, trono, lanterna, livro, pergaminho, balança, roda, correntes, véu, cavalo, leão, asas, mãos e gestos. imagem iconografia observação interpretação'],\n";
const recoveredSearchScript=searchScript.replace(symbolsIndexLine,'').replace('[1,2,3,4,5,6,14,15,26,27,28].includes(index)','[1,2,3,4,5,6,14,15,26,27].includes(index)');
pass('Motor de busca V167 preservado',sha256(recoveredSearchScript)==='e6ee1f7be9bbbb27b409e00e0964f5147bdf4d05b6a63f525620a5fcee00f173',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 121 URLs',count(sitemap,/<url>/g)===121);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('Símbolos únicos no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/simbolos-do-tarot\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(m=>m[1]);
pass('URLs de página únicas',pageLocs.length===121&&new Set(pageLocs).size===121,`${pageLocs.length}/${new Set(pageLocs).size}`);
const symbolsSitemapBlock='  <url>\n    <loc>https://divinabruxa.com.br/simbolos-do-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
const recoveredSitemap=sitemap.replace(symbolsSitemapBlock,'');
pass('Sitemap V167 preservado',sha256(recoveredSitemap)==='1baf923a3b979d3d520b3d46bf5d63df2c4c84a82f8349725972d63b3824e4b9',sha256(recoveredSitemap));

const contract=JSON.parse(read('SIMBOLOS-TAROT-V168.json'));
pass('Contrato V168',contract.schemaVersion==='168.0.0');
pass('Contrato 32 símbolos',contract.symbolLibrary?.definedSymbols===32&&contract.symbolLibrary?.families===4&&contract.symbolLibrary?.editorialLinksFromEntries===32);
pass('Contrato famílias',JSON.stringify(contract.symbolLibrary?.familyCounts)===JSON.stringify({ceu:8,natureza:8,objetos:10,movimento:6}));
pass('Contrato filtro local',contract.localFilter?.runsLocally===true&&contract.localFilter?.textStored===false&&contract.localFilter?.textTransmitted===false&&contract.localFilter?.accentInsensitive===true);
pass('Contrato interpretação responsável',contract.interpretationMethod?.symbolHasUniversalFixedMeaning===false&&contract.interpretationMethod?.symbolPresentedAsFactualProof===false&&contract.interpretationMethod?.contextRequired===true&&contract.interpretationMethod?.deckVariationAcknowledged===true);
pass('Contrato busca 120',contract.searchIntegration?.indexedDestinationsAfter===120&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===120);
pass('Contrato sitemap 121',contract.discoverability?.sitemapUrlsAfter===121&&contract.discoverability?.sitemapImageEntries===78);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78&&contract.safeguards?.tarotLivreRepeats===false);
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true);
pass('Contrato treze arquivos',contract.installation?.filesInPackage===13&&contract.installation?.replace?.length===6&&contract.installation?.add?.length===7);

const manifest=new Map();
for(const line of read('ARQUIVOS-V168-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V168-SHA256.txt');
pass('Manifesto doze hashes',manifest.size===12,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','historia-do-tarot.html':'215a77d865f652e534865a3cc1b748ba44416e8d21f802bbcd8973ef7ba11b1d','historia-tarot-v167.css':'fbe141aa683fdce8776111aa3bd9f3a362a799ed185ffa5d0bcc6cac44053d73','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','glossario-v166.css':'eade19b83031c1e27f88a9fc1f1a14165ce497b41b60eb06a04b575415d4ee06','glossario-v166.js':'33e5e1512f265d5ef7b23c62a9122edfe3d4ab0c0d4fa1826c45843e61fb634b','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  pass('Imagem da Sacerdotisa existente',exists('card-02.webp')&&fs.statSync(filePath('card-02.webp')).size>500000);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino dos símbolos: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=168`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 120 destinos',entries.length===120,`${entries.length}`);
  pass('Índice possui 120 URLs únicas',new Set(entries.map(x=>x.url)).size===120);
  const categories=Object.fromEntries(['cartas','tiragens','aprender','portal'].map(category=>[category,entries.filter(x=>x.category===category).length]));
  pass('Categorias 78 + 14 + 18 + 10',JSON.stringify(categories)===JSON.stringify({cartas:78,tiragens:14,aprender:18,portal:10}),JSON.stringify(categories));
  pass('Índice liga símbolos em destaque',entries.some(x=>x.url==='simbolos-do-tarot.html'&&x.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  for(const query of ['simbolos','lanterna','veu','iconografia'])pass(`Busca encontra símbolos: ${query}`,find(query).some(x=>x.url==='simbolos-do-tarot.html'));
  pass('Busca ainda encontra história',find('Visconti Sforza').some(x=>x.url==='historia-do-tarot.html'));
  pass('Busca ainda encontra carta',find('A Lua').some(x=>x.title==='A Lua'));
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(value=>consult.includes(value)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}

const result={suite:'DIVINA-BRUXA-V168-BIBLIOTECA-DE-SIMBOLOS-DO-TAROT',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
