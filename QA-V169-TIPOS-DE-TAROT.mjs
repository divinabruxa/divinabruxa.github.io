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

const required=['sitemap.xml','buscar.html','busca-v165.js','historia-do-tarot.html','tarot-para-iniciantes.html','simbolos-do-tarot.html','glossario-do-tarot.html','tipos-de-tarot.html','tipos-tarot-v169.css','00-LEIA-PRIMEIRO-V169-TIPOS-DE-TAROT.txt','TIPOS-DE-TAROT-V169.json','QA-V169-TIPOS-DE-TAROT.mjs','ARQUIVOS-V169-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V169-TIPOS-DE-TAROT',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('tipos-de-tarot.html'),css=read('tipos-tarot-v169.css');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='Tipos de Tarot: Marselha, Rider–Waite e Thoth | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/tipos-de-tarot.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS V169',html.includes('tipos-tarot-v169.css?v=169'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
pass('Sem script funcional',count(html,/<script(?:\s|>)/g)===1&&count(html,/type="application\/ld\+json"/g)===1);
pass('Imagem existente com dimensões',html.includes('<img src="tarot-atlas.webp" width="3000" height="3600"'));
pass('Alt descritivo',html.includes('alt="Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa"'));
pass('Arte contemporânea identificada',html.includes('ARTE CONTEMPORÂNEA · NÃO É REPRODUÇÃO HISTÓRICA'));

for(const tag of ['header','nav','main','article','section','aside','footer','figure','figcaption','ol','ul','li','dl','dt','dd','table','caption','thead','tbody','tr','th','td','details','summary'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
pass('IDs únicos',ids.length===new Set(ids).size,`${ids.length}/${new Set(ids).size}`);
const hashTargets=[...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
pass('Âncoras internas válidas',hashTargets.every(id=>ids.includes(id)));
for(const m of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of m[1].split(/\s+/))pass(`ARIA encontra ${id}`,ids.includes(id));

let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[];pass('JSON-LD válido',true);}catch(error){pass('JSON-LD válido',false,error.message);}
for(const type of ['Organization','WebSite','ImageObject','BreadcrumbList','Article','FAQPage'])pass(`JSON-LD ${type}`,graph.some(x=>x['@type']===type));
const article=graph.find(x=>x['@type']==='Article');
const faq=graph.find(x=>x['@type']==='FAQPage');
pass('Article com datas',article?.datePublished==='2026-09-07'&&article?.dateModified==='2026-09-07');
pass('Article gratuito e em português',article?.isAccessibleForFree===true&&article?.inLanguage==='pt-BR');
pass('Article com quatro citações',article?.citation?.length===4&&new Set(article.citation).size===4);
pass('FAQPage com quatro perguntas',faq?.mainEntity?.length===4&&faq.mainEntity.every(x=>x['@type']==='Question'&&x.acceptedAnswer?.['@type']==='Answer'));
pass('Imagem estruturada contemporânea',graph.find(x=>x['@type']==='ImageObject')?.caption==='Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa');

pass('Navegação interna completa',['#comparacao','#tradicoes','#nomes','#reconhecer','#divina-bruxa','#fontes'].every(value=>html.includes(`href="${value}"`)));
const tbody=html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1]||'';
pass('Tabela com cinco linhas comparativas',count(tbody,/<tr>/g)===5);
pass('Tabela com cabeçalhos de coluna',count(html,/<th scope="col">/g)===4);
pass('Tabela com cabeçalhos de linha',count(html,/<th scope="row">/g)===5);
pass('Tabela acessível e rolável',html.includes('tabindex="0" role="region" aria-label="Tabela comparativa das tradições do Tarot"'));
pass('Três perfis de tradição',count(html,/class="tradition-panel [^"]+-panel"/g)===3);
pass('Três chaves visuais',count(html,/class="visual-key"/g)===3);
pass('Nove sinais de observação',count(html,/<li><strong>(?:Observe primeiro|Estude com atenção|Evite [^:]+):<\/strong>/g)===9);
const variations=html.match(/<div class="name-variation-grid">([\s\S]*?)<\/div>\s*<p class="comparison-note">/)?.[1]||'';
pass('Quatro variações de nomes e ordem',count(variations,/<article>/g)===4);
const recognition=html.match(/<ol class="recognition-grid">([\s\S]*?)<\/ol>/)?.[1]||'';
pass('Quatro verificações de reconhecimento',count(recognition,/<li>/g)===4);
const choices=html.match(/<div class="choice-grid">([\s\S]*?)<\/div>/)?.[1]||'';
pass('Três perfis de escolha',count(choices,/<article>/g)===3);
pass('Quatro perguntas visíveis',count(html,/<details>/g)===4&&count(html,/<summary>/g)===4);
pass('Quatro fontes numeradas',count(html,/<li id="fonte-[^"]+">/g)===4);
pass('Quatro links externos seguros',count(html,/target="_blank" rel="noopener noreferrer"/g)===4);

const sourceUrls=['https://www.britishmuseum.org/collection/object/P_1904-0511-47-1-78','https://www.themorgan.org/exhibitions/tarot','https://www.themorgan.org/sites/default/files/pdf/exhibitions/Morgan_Tarot_ExhibitionLabels.pdf','https://warburg.sas.ac.uk/sites/default/files/Yorke%20Collection%20OS%20EE1%20-%20N6.pdf'];
for(const url of sourceUrls)pass(`Fonte: ${url}`,count(html,new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))===2);

for(const phrase of ['Nicolas Conver em 1760','concebido pelo místico Arthur Edward Waite e ilustrado pela artista Pamela Colman Smith','Lady Frieda Harris e Aleister Crowley','final dos anos 1930','os originais foram depositados na instituição'])pass(`Marco documentado: ${phrase}`,html.includes(phrase));
for(const phrase of ['não um único original imutável','Edições específicas podem alterar nomes, cores, numeração e detalhes','uma pista isolada não certifica a linhagem de um baralho','Nenhuma é automaticamente mais verdadeira, profunda ou legítima','Existem outros baralhos históricos, sistemas autorais e muitas criações híbridas'])pass(`Cautela editorial: ${phrase}`,html.includes(phrase));
for(const phrase of ['não são apresentadas como fac-símile nem reprodução histórica','sem repetição e sem significados automáticos durante a revelação','Nenhum baralho comprova pensamentos secretos, diagnósticos, acontecimentos inevitáveis ou fatos sem evidência'])pass(`Limite responsável: ${phrase}`,html.includes(phrase));
for(const link of ['historia-do-tarot.html','simbolos-do-tarot.html','tarot-para-iniciantes.html','cartas-do-tarot.html','glossario-do-tarot.html','metodologia-do-tarot.html','tarot-livre.html','guias-para-comecar.html','buscar.html'])pass(`Link editorial: ${link}`,html.includes(`href="${link}"`));

pass('CSS com tabela horizontal segura',css.includes('.comparison-scroll')&&css.includes('overflow-x: auto')&&css.includes('min-width: 790px'));
pass('CSS com três colunas editoriais',css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
pass('CSS com perfis de tradição',css.includes('.tradition-panel')&&css.includes('.visual-key'));
pass('CSS móvel',css.includes('@media (max-width: 760px)')&&css.includes('@media (max-width: 560px)'));
pass('CSS para telas mínimas',css.includes('@media (max-width: 340px)'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS de impressão',css.includes('@media print')&&css.includes('.comparison-table'));
pass('CSS equilibrado',count(css,/{/g)===count(css,/}/g),`${count(css,/{/g)}/${count(css,/}/g)}`);

const history=read('historia-do-tarot.html'),beginner=read('tarot-para-iniciantes.html'),symbols=read('simbolos-do-tarot.html'),glossary=read('glossario-do-tarot.html');
pass('História liga tipos uma vez',count(history,/href="tipos-de-tarot\.html"/g)===1);
pass('Iniciantes liga tipos uma vez',count(beginner,/href="tipos-de-tarot\.html"/g)===1);
pass('Símbolos liga tipos uma vez',count(symbols,/href="tipos-de-tarot\.html"/g)===1);
pass('Glossário liga tipos uma vez',count(glossary,/href="tipos-de-tarot\.html"/g)===1);
pass('Definição de baralho liga comparação',glossary.includes('<a href="tipos-de-tarot.html">Compare Marselha, Rider–Waite–Smith e Thoth</a>'));

const historyAddition=' <a href="tipos-de-tarot.html">Compare Marselha, Rider–Waite–Smith e Thoth</a>.';
const beginnerAddition=' <a href="tipos-de-tarot.html">Compare as tradições de Marselha, Rider–Waite–Smith e Thoth</a>.';
const symbolsAddition=' <a href="tipos-de-tarot.html">Veja como três tradições visuais organizam as cartas de modos diferentes</a>.';
const glossaryAddition=' <a href="tipos-de-tarot.html">Compare Marselha, Rider–Waite–Smith e Thoth</a>.';
pass('História V168 preservada fora da integração',sha256(history.replace(historyAddition,''))==='215a77d865f652e534865a3cc1b748ba44416e8d21f802bbcd8973ef7ba11b1d',sha256(history.replace(historyAddition,'')));
pass('Iniciantes V168 preservado fora da integração',sha256(beginner.replace(beginnerAddition,''))==='8da81b77ebc1039da5aa3d6a6fcccd4de05108aabc5e059833df5e2a696563a8',sha256(beginner.replace(beginnerAddition,'')));
pass('Símbolos V168 preservados fora da integração',sha256(symbols.replace(symbolsAddition,''))==='9255db5659096819509d79a3241959059df596eb74c66a25cfe290895f93c281',sha256(symbols.replace(symbolsAddition,'')));
pass('Glossário V168 preservado fora da integração',sha256(glossary.replace(glossaryAddition,''))==='029c18ae62b29218baf512dcf0cf9b767aa897a7dd5cadd1a4391bbf69b90cf7',sha256(glossary.replace(glossaryAddition,'')));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 121 caminhos',searchHtml.includes('121 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V169',searchHtml.includes('busca-v165.js?v=169'));
pass('Índice contém tipos uma vez',count(searchScript,/\['Tipos de Tarot', 'tipos-de-tarot\.html'/g)===1);
pass('Tipos em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26,27,28,29].includes(index)'));
const recoveredSearchHtml=searchHtml.replace('121 CAMINHOS · UMA BUSCA','120 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=169','busca-v165.js?v=168');
pass('Página de busca V168 preservada',sha256(recoveredSearchHtml)==='4cc19a0b6569612950805ad1457a8ad372569608c603826842a5aef86a6a2327',sha256(recoveredSearchHtml));
const typesIndexLine="  ['Tipos de Tarot', 'tipos-de-tarot.html', 'Marselha · RWS · Thoth', 'aprender', 'Compare Tarot de Marselha, Rider-Waite-Smith e Thoth: história, autoria, Pamela Colman Smith, Arthur Edward Waite, Lady Frieda Harris, Aleister Crowley, Arcanos Menores, cartas numeradas, cenas, símbolos, nomes, ordem, corte, Discos, Ajustamento, Luxúria, Éon e Universo. tipos de baralho tradição visual linhagem diferenças qual escolher'],\n";
const recoveredSearchScript=searchScript.replace(typesIndexLine,'').replace('[1,2,3,4,5,6,14,15,26,27,28,29].includes(index)','[1,2,3,4,5,6,14,15,26,27,28].includes(index)');
pass('Motor de busca V168 preservado',sha256(recoveredSearchScript)==='2539e712a450ba2cc01e2d3c469018d572886fc97c4b252c307860159f689ef0',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 122 URLs',count(sitemap,/<url>/g)===122);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('Tipos único no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/tipos-de-tarot\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(m=>m[1]);
pass('URLs de página únicas',pageLocs.length===122&&new Set(pageLocs).size===122,`${pageLocs.length}/${new Set(pageLocs).size}`);
const typesSitemapBlock='  <url>\n    <loc>https://divinabruxa.com.br/tipos-de-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
pass('Sitemap V168 preservado',sha256(sitemap.replace(typesSitemapBlock,''))==='5c66c9c69ac7a60e959c599dc6c42b90b5ba6537080e080f8e0ace72309a00fd',sha256(sitemap.replace(typesSitemapBlock,'')));

const contract=JSON.parse(read('TIPOS-DE-TAROT-V169.json'));
pass('Contrato V169',contract.schemaVersion==='169.0.0');
pass('Contrato três tradições',contract.traditionsPage?.traditionsCompared===3&&contract.traditions?.length===3);
pass('Contrato comparação completa',contract.traditionsPage?.comparisonRows===5&&contract.traditionsPage?.recognitionSteps===4&&contract.traditionsPage?.faqQuestions===4&&contract.traditionsPage?.institutionalSources===4);
pass('Contrato sem hierarquia',contract.editorialMethod?.traditionsComparedWithoutHierarchy===true&&contract.editorialMethod?.singleBestDeckClaimed===false&&contract.editorialMethod?.singleCorrectTraditionClaimed===false);
pass('Contrato créditos autorais',contract.traditions?.[1]?.art==='Pamela Colman Smith'&&contract.traditions?.[2]?.collaborators?.includes('Lady Frieda Harris'));
pass('Contrato Divina Bruxa contemporânea',contract.divinaBruxaPosition?.contemporaryIndependentCollection===true&&contract.divinaBruxaPosition?.presentedAsHistoricalFacsimile===false&&contract.divinaBruxaPosition?.orientation==='upright-only');
pass('Contrato quatro referências',contract.references?.length===4&&new Set(contract.references.map(x=>x.url)).size===4);
pass('Contrato busca 121',contract.searchIntegration?.indexedDestinationsAfter===121&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===121);
pass('Contrato sitemap 122',contract.discoverability?.sitemapUrlsAfter===122&&contract.discoverability?.sitemapImageEntries===78);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78&&contract.safeguards?.tarotLivreRepeats===false&&contract.safeguards?.tarotLivreMeaningsInsideFreeMode===false);
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true&&contract.safeguards?.ownerEmail==='orbedasrealidades@hotmail.com');
pass('Contrato treze arquivos',contract.installation?.filesInPackage===13&&contract.installation?.replace?.length===7&&contract.installation?.add?.length===6);

const manifest=new Map();
for(const line of read('ARQUIVOS-V169-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V169-SHA256.txt');
pass('Manifesto doze hashes',manifest.size===12,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','historia-tarot-v167.css':'fbe141aa683fdce8776111aa3bd9f3a362a799ed185ffa5d0bcc6cac44053d73','simbolos-tarot-v168.css':'df957a3c75a410f69745cd4070c37e707b02e17ddc6af2363ccf196b784b9ac2','simbolos-tarot-v168.js':'07dd2277c6b1e0a96055cc2f7448c46eb8928d5abc0490422cf83de53b158ef5','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','glossario-v166.css':'eade19b83031c1e27f88a9fc1f1a14165ce497b41b60eb06a04b575415d4ee06','glossario-v166.js':'33e5e1512f265d5ef7b23c62a9122edfe3d4ab0c0d4fa1826c45843e61fb634b','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  pass('Atlas existente preservado',exists('tarot-atlas.webp')&&fs.statSync(filePath('tarot-atlas.webp')).size>1000000);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino da página: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=169`);
  pass('Baralho de dados mantém 78 cartas',CARDS.length===78,`${CARDS.length}`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 121 destinos',entries.length===121,`${entries.length}`);
  pass('Índice possui 121 URLs únicas',new Set(entries.map(x=>x.url)).size===121);
  const categories=Object.fromEntries(['cartas','tiragens','aprender','portal'].map(category=>[category,entries.filter(x=>x.category===category).length]));
  pass('Categorias 78 + 14 + 19 + 10',JSON.stringify(categories)===JSON.stringify({cartas:78,tiragens:14,aprender:19,portal:10}),JSON.stringify(categories));
  pass('Índice liga tipos em destaque',entries.some(x=>x.url==='tipos-de-tarot.html'&&x.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  for(const query of ['tipos de Tarot','Marselha','Pamela Colman Smith','Frieda Harris','Thoth','tipos de baralho'])pass(`Busca encontra tipos: ${query}`,find(query).some(x=>x.url==='tipos-de-tarot.html'));
  pass('Busca ainda encontra história',find('Visconti Sforza').some(x=>x.url==='historia-do-tarot.html'));
  pass('Busca ainda encontra símbolos',find('lanterna').some(x=>x.url==='simbolos-do-tarot.html'));
  pass('Busca ainda encontra carta',find('A Lua').some(x=>x.title==='A Lua'));
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(value=>consult.includes(value)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}

const result={suite:'DIVINA-BRUXA-V169-TIPOS-DE-TAROT',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
