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
const countLiteral=(value,needle)=>value.split(needle).length-1;

const required=['sitemap.xml','buscar.html','busca-v165.js','como-escolher-um-baralho-de-tarot.html','tarot-para-iniciantes.html','guias-para-comecar.html','como-embaralhar-cartas-de-tarot.html','embaralhar-tarot-v171.css','embaralhar-tarot-v171.js','00-LEIA-PRIMEIRO-V171-COMO-EMBARALHAR-TAROT.txt','EMBARALHAR-TAROT-V171.json','QA-V171-COMO-EMBARALHAR-TAROT.mjs','ARQUIVOS-V171-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V171-COMO-EMBARALHAR-TAROT',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('como-embaralhar-cartas-de-tarot.html'),css=read('embaralhar-tarot-v171.css'),js=read('embaralhar-tarot-v171.js');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='Como embaralhar cartas de Tarot | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/como-embaralhar-cartas-de-tarot.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS V171',html.includes('embaralhar-tarot-v171.css?v=171'));
pass('JS V171',html.includes('embaralhar-tarot-v171.js?v=171'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
pass('Somente JSON-LD e script local',count(html,/<script(?:\s|>)/g)===2&&count(html,/type="application\/ld\+json"/g)===1&&count(html,/src="embaralhar-tarot-v171\.js\?v=171"/g)===1);
pass('Imagem existente com dimensões',html.includes('<img src="tarot-atlas.webp" width="3000" height="3600"'));
pass('Alt descritivo',html.includes('alt="Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa"'));
pass('Coleção contemporânea identificada',html.includes('COLEÇÃO CONTEMPORÂNEA · TODAS AS CARTAS DIRETAS'));

for(const tag of ['header','nav','main','article','section','aside','footer','figure','figcaption','ol','ul','li','dl','dt','dd','table','caption','thead','tbody','tr','th','td','details','summary','fieldset','legend','form','label','button'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
pass('IDs únicos',ids.length===new Set(ids).size,`${ids.length}/${new Set(ids).size}`);
const hashTargets=[...html.matchAll(/href="#([^"]+)"/g)].map(match=>match[1]);
pass('Âncoras internas válidas',hashTargets.every(id=>ids.includes(id)));
for(const match of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of match[1].split(/\s+/))pass(`ARIA encontra ${id}`,ids.includes(id));

let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[];pass('JSON-LD válido',true);}catch(error){pass('JSON-LD válido',false,error.message);}
for(const type of ['Organization','WebSite','ImageObject','BreadcrumbList','Article','FAQPage'])pass(`JSON-LD ${type}`,graph.some(item=>item['@type']===type));
const article=graph.find(item=>item['@type']==='Article');
const faq=graph.find(item=>item['@type']==='FAQPage');
pass('Article com datas',article?.datePublished==='2026-09-07'&&article?.dateModified==='2026-09-07');
pass('Article gratuito e em português',article?.isAccessibleForFree===true&&article?.inLanguage==='pt-BR');
pass('Article com três citações',article?.citation?.length===3&&new Set(article.citation).size===3);
pass('FAQPage com cinco perguntas',faq?.mainEntity?.length===5&&faq.mainEntity.every(item=>item['@type']==='Question'&&item.acceptedAnswer?.['@type']==='Answer'));
pass('Imagem estruturada contemporânea',graph.find(item=>item['@type']==='ImageObject')?.caption==='Mosaico contemporâneo das 78 cartas da coleção Divina Bruxa');

pass('Navegação interna completa',['#assistente','#sequencia','#metodos','#comparacao','#acessibilidade','#cuidados','#fontes'].every(value=>html.includes(`href="${value}"`)));
const form=html.match(/<form class="shuffle-form"[\s\S]*?<\/form>/)?.[0]||'';
pass('Formulário do assistente presente',form.includes('data-shuffle-guide'));
pass('Três perguntas em fieldsets',count(form,/<fieldset>/g)===3&&count(form,/<legend>/g)===3);
pass('Nove opções nativas',count(form,/type="radio"/g)===9&&count(form,/<label>/g)===9);
pass('Três grupos obrigatórios',count(form,/\brequired\b/g)===3);
const radioNames=[...form.matchAll(/type="radio" name="([^"]+)"/g)].map(match=>match[1]);
pass('Três grupos com três opções',new Set(radioNames).size===3&&[...new Set(radioNames)].every(name=>radioNames.filter(value=>value===name).length===3));
for(const value of ['mesa','pacotes','intercalacao'])pass(`Três respostas ${value}`,count(form,new RegExp(`value="${value}"`,'g'))===3);
pass('Progresso anunciado',html.includes('data-shuffle-count aria-live="polite" aria-atomic="true"')&&html.includes('data-shuffle-progress'));
pass('Resultado acessível',html.includes('data-shuffle-result aria-labelledby="shuffle-result-title" aria-live="polite" aria-atomic="true" hidden')&&html.includes('id="shuffle-result-title" tabindex="-1"'));
pass('Três placares',count(html,/data-shuffle-score="(?:mesa|pacotes|intercalacao)"/g)===3&&count(html,/data-shuffle-bar="(?:mesa|pacotes|intercalacao)"/g)===3);

const sequence=html.match(/<ol class="shuffle-sequence">([\s\S]*?)<\/ol>/)?.[1]||'';
pass('Sequência com seis movimentos',count(sequence,/<li>/g)===6);
const methods=html.match(/<div class="method-grid">([\s\S]*?)<\/div>\s*<\/section>/)?.[1]||'';
pass('Quatro métodos completos',count(methods,/<article id=/g)===4&&count(methods,/<aside>/g)===4);
for(const method of ['Mistura circular na mesa','Pacotes pelas mãos','Intercalação apoiada','Distribuição em montes'])pass(`Método: ${method}`,html.includes(`<h3>${method}</h3>`));
const tbody=html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1]||'';
pass('Tabela com cinco movimentos',count(tbody,/<tr>/g)===5);
pass('Tabela com cabeçalhos',count(html,/<th scope="col">/g)===4&&count(html,/<th scope="row">/g)===5);
pass('Tabela acessível e rolável',html.includes('tabindex="0" role="region" aria-label="Tabela comparativa dos métodos de embaralhamento"'));
pass('Limite matemático explícito',html.includes('modelo específico de riffle aplicado a um baralho de 52 cartas')&&html.includes('transformar sete em obrigação ritual'));
const access=html.match(/<div class="access-grid">([\s\S]*?)<\/div>/)?.[1]||'';
pass('Quatro adaptações de acessibilidade',count(access,/<article>/g)===4);
const careList=html.match(/<ol class="care-list">([\s\S]*?)<\/ol>/)?.[1]||'';
pass('Seis cuidados físicos',count(careList,/<li>/g)===6);
pass('Cinco perguntas visíveis',count(html,/<details>/g)===5&&count(html,/<summary>/g)===5);
const practice=html.match(/<section class="content-section quick-practice"[\s\S]*?<\/section>/)?.[0]||'';
pass('Prática de noventa segundos',practice.includes('PRÁTICA DE 90 SEGUNDOS')&&count(practice,/<li>/g)===3&&['30','45','15'].every(value=>practice.includes(`<span>${value}</span>`)));
pass('Três fontes numeradas',count(html,/<li id="fonte-[^"]+">/g)===3);
pass('Três links externos seguros',count(html,/target="_blank" rel="noopener noreferrer"/g)===3);

const sourceUrls=['https://www.vam.ac.uk/articles/tarot-cards','https://projecteuclid.org/journals/annals-of-applied-probability/volume-2/issue-2/Trailing-the-Dovetail-Shuffle-to-its-Lair/10.1214/aoap/1177005705.full','https://siarchives.si.edu/what-we-do/forums/collections-care-guidelines-resources/how-do-i-keep-old-family-papers-preserved'];
for(const url of sourceUrls)pass(`Fonte: ${url}`,countLiteral(html,url)===2,`${countLiteral(html,url)}`);
for(const phrase of ['Não existe um número ritual obrigatório','não é uma exigência técnica','Não necessariamente. Você pode recolocar a carta','Não existe obrigação técnica','A Divina Bruxa trabalha apenas com cartas em posição direta'])pass(`Cautela editorial: ${phrase}`,html.includes(phrase));
for(const phrase of ['mãos limpas e secas','livre de líquidos','Não force uma carta','luz direta e umidade','Dor, tremor, mobilidade reduzida, fadiga ou cartas grandes','Embaralhamento não é teste de habilidade manual'])pass(`Cuidado e acessibilidade: ${phrase}`,html.includes(phrase));
for(const link of ['como-escolher-um-baralho-de-tarot.html','como-fazer-perguntas-ao-tarot.html','tiragem-de-uma-carta.html','tiragens-de-tarot.html','cartas-do-tarot.html','tarot-livre.html','guias-para-comecar.html','buscar.html'])pass(`Link editorial: ${link}`,html.includes(`href="${link}"`));

try{new Function(js);pass('JavaScript sintaticamente válido',true);}catch(error){pass('JavaScript sintaticamente válido',false,error.message);}
pass('JS com três perfis',js.includes('const profiles = Object.freeze')&&['mesa','pacotes','intercalacao'].every(value=>js.includes(`${value}: {`)));
pass('JS calcula resultado combinado',js.includes("title.textContent = 'Comece por uma mistura combinada'")&&js.includes('winners.length === 1'));
pass('JS valida o formulário',js.includes('form.reportValidity()'));
pass('JS atualiza sem HTML injetado',js.includes('.textContent =')&&!/\.innerHTML\b|insertAdjacentHTML|outerHTML/.test(js));
pass('JS sem rede',!/(?:\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource)/.test(js));
pass('JS sem armazenamento',!/(?:localStorage|sessionStorage|indexedDB|document\.cookie)/.test(js));
pass('JS respeita movimento reduzido',js.includes("matchMedia('(prefers-reduced-motion: reduce)')"));

pass('CSS com seleção acessível',css.includes('.shuffle-options input:focus-visible + span')&&css.includes('.shuffle-options input:checked + span'));
pass('CSS com resultado e placares',css.includes('.shuffle-result')&&css.includes('.result-scores'));
pass('CSS com tabela horizontal segura',css.includes('.comparison-scroll')&&css.includes('overflow-x: auto')&&css.includes('min-width: 790px'));
pass('CSS com layouts editoriais',css.includes('.method-grid')&&css.includes('.shuffle-sequence')&&css.includes('.access-grid')&&css.includes('.care-list'));
pass('CSS móvel',css.includes('@media (max-width: 980px)')&&css.includes('@media (max-width: 760px)')&&css.includes('@media (max-width: 560px)'));
pass('CSS para telas mínimas',css.includes('@media (max-width: 340px)'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS de impressão',css.includes('@media print')&&css.includes('.shuffle-tool')&&css.includes('.shuffle-table'));
const openBraces=count(css,/{/g),closeBraces=count(css,/}/g);
pass('CSS equilibrado',openBraces===closeBraces,`${openBraces}/${closeBraces}`);

const choice=read('como-escolher-um-baralho-de-tarot.html'),beginner=read('tarot-para-iniciantes.html'),guides=read('guias-para-comecar.html');
pass('Escolha de baralho liga novo guia uma vez',count(choice,/href="como-embaralhar-cartas-de-tarot\.html"/g)===1);
pass('Iniciantes liga novo guia uma vez',count(beginner,/href="como-embaralhar-cartas-de-tarot\.html"/g)===1);
pass('Guias liga novo guia uma vez',count(guides,/href="como-embaralhar-cartas-de-tarot\.html"/g)===1);
const choiceAddition='<a href="como-embaralhar-cartas-de-tarot.html">Aprender a embaralhar sem forçar as cartas →</a>';
const beginnerAddition=' <a href="como-embaralhar-cartas-de-tarot.html">Prepare e embaralhe o baralho com conforto</a>.';
const guidesAddition=' <a href="como-embaralhar-cartas-de-tarot.html">Aprenda quatro formas de embaralhar</a>.';
pass('Escolha V170 preservada fora da integração',sha256(choice.replace(choiceAddition,''))==='6ab72103ebd97de14d6be71047e29f06e5f69b18df0591413aa3eb2aaa86e6f8',sha256(choice.replace(choiceAddition,'')));
pass('Iniciantes V170 preservado fora da integração',sha256(beginner.replace(beginnerAddition,''))==='ff73ea9054ede0b04fd85d60794f961e900f746f58a2c156cb832ca5ae7e505a',sha256(beginner.replace(beginnerAddition,'')));
pass('Guias V170 preservado fora da integração',sha256(guides.replace(guidesAddition,''))==='c6470e3ff2b9f9472de5cec857eaf6ebdea0586cbcff8435a0130fb362a1f1dc',sha256(guides.replace(guidesAddition,'')));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 123 caminhos',searchHtml.includes('123 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V171',searchHtml.includes('busca-v165.js?v=171'));
pass('Índice contém novo guia uma vez',count(searchScript,/\['Como embaralhar cartas de Tarot', 'como-embaralhar-cartas-de-tarot\.html'/g)===1);
pass('Novo guia em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26,27,28,29,30,31].includes(index)'));
const recoveredSearchHtml=searchHtml.replace('123 CAMINHOS · UMA BUSCA','122 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=171','busca-v165.js?v=170');
pass('Página de busca V170 preservada',sha256(recoveredSearchHtml)==='1a5572ce1fc7313b68bd83bdd1a7c4a492ae13768bded73dfd51545156eb83bc',sha256(recoveredSearchHtml));
const shuffleIndexLine="  ['Como embaralhar cartas de Tarot', 'como-embaralhar-cartas-de-tarot.html', '4 métodos', 'aprender', 'Guia acessível para embaralhar 78 cartas com mistura circular na mesa, pacotes pelas mãos, intercalação apoiada e distribuição em montes; corte, cartas grandes, mãos pequenas, mobilidade, conservação, posição direta e prática de 90 segundos. shuffle riffle quantas vezes sete limpar consagrar carta caiu invertida baralho grande cortar baralho'],\n";
const recoveredSearchScript=searchScript.replace(shuffleIndexLine,'').replace('[1,2,3,4,5,6,14,15,26,27,28,29,30,31].includes(index)','[1,2,3,4,5,6,14,15,26,27,28,29,30].includes(index)');
pass('Motor de busca V170 preservado',sha256(recoveredSearchScript)==='ac3de27a28a975eb6662fc32b39cda2a2105544cffdbeac85e94f93ead19f407',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 124 URLs',count(sitemap,/<url>/g)===124);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('Novo guia único no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/como-embaralhar-cartas-de-tarot\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(match=>match[1]);
pass('URLs de página únicas',pageLocs.length===124&&new Set(pageLocs).size===124,`${pageLocs.length}/${new Set(pageLocs).size}`);
const sitemapBlock='  <url>\n    <loc>https://divinabruxa.com.br/como-embaralhar-cartas-de-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
pass('Sitemap V170 preservado',sha256(sitemap.replace(sitemapBlock,''))==='312e4edee6a9e4eadd5c220bac902ba7611ef31bd076787a89af5aa1e683383d',sha256(sitemap.replace(sitemapBlock,'')));

const contract=JSON.parse(read('EMBARALHAR-TAROT-V171.json'));
pass('Contrato V171',contract.schemaVersion==='171.0.0');
pass('Contrato assistente completo',contract.shuffleGuide?.assistantQuestions===3&&contract.shuffleGuide?.assistantOptions===9&&contract.shuffleGuide?.assistantProfiles?.length===3&&contract.shuffleGuide?.combinedResultSupported===true);
pass('Contrato conteúdo completo',contract.shuffleGuide?.primaryMethods===4&&contract.shuffleGuide?.preparationSteps===6&&contract.shuffleGuide?.comparisonRows===5&&contract.shuffleGuide?.careChecks===6&&contract.shuffleGuide?.faqQuestions===5);
pass('Contrato acessibilidade',contract.shuffleGuide?.accessibilityAdaptations===4&&contract.accessibility?.oneHandAndLimitedMobilityGuidance===true);
pass('Contrato privacidade local',contract.assistantPrivacy?.runsLocally===true&&contract.assistantPrivacy?.networkRequests===false&&contract.assistantPrivacy?.answersStored===false);
pass('Contrato sem obrigações',contract.editorialMethod?.singleUniversalMethodClaimed===false&&contract.editorialMethod?.mandatoryShuffleCountClaimed===false&&contract.editorialMethod?.sevenShufflesPresentedAsTarotRule===false&&contract.editorialMethod?.cleansingOrConsecrationRequired===false);
pass('Contrato três referências',contract.references?.length===3&&new Set(contract.references.map(item=>item.url)).size===3);
pass('Contrato busca 123',contract.searchIntegration?.indexedDestinationsAfter===123&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===123);
pass('Contrato sitemap 124',contract.discoverability?.sitemapUrlsAfter===124&&contract.discoverability?.sitemapImageEntries===78);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78&&contract.safeguards?.tarotLivreRepeats===false&&contract.safeguards?.tarotLivreMeaningsInsideFreeMode===false);
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true&&contract.safeguards?.ownerEmail==='orbedasrealidades@hotmail.com');
pass('Contrato treze arquivos',contract.installation?.filesInPackage===13&&contract.installation?.replace?.length===6&&contract.installation?.add?.length===7);

const manifest=new Map();
for(const line of read('ARQUIVOS-V171-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V171-SHA256.txt');
pass('Manifesto doze hashes',manifest.size===12,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','historia-do-tarot.html':'7d63c8fdc0a45225e29648b9118b43ee6c688d08c37fde67507a8696ce72216c','historia-tarot-v167.css':'fbe141aa683fdce8776111aa3bd9f3a362a799ed185ffa5d0bcc6cac44053d73','simbolos-do-tarot.html':'8650b833ef42e6eb6334e2ace93284b87f55dfe94fc48fc3db59f972dc7acca2','simbolos-tarot-v168.css':'df957a3c75a410f69745cd4070c37e707b02e17ddc6af2363ccf196b784b9ac2','simbolos-tarot-v168.js':'07dd2277c6b1e0a96055cc2f7448c46eb8928d5abc0490422cf83de53b158ef5','glossario-do-tarot.html':'456e905fbeabbe17df4efbc5e12aebee68f986d536c9b1b9465a6cd2eb3b3936','tipos-de-tarot.html':'f4a0149a8f5d9bf890802a110390c256b4d74164249982f6859c32bb4870b668','escolher-baralho-v170.css':'2c889c4fc2bb29d758bac7fcb2f3c32f72578d46cd6e9235278b992695cab6de','escolher-baralho-v170.js':'eeb74aeb3d009a3c201e0787912725683135588710750185924bd8e22470ddf2','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  pass('Atlas existente preservado',exists('tarot-atlas.webp')&&fs.statSync(filePath('tarot-atlas.webp')).size>1000000);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match=>match[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino da página: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=171`);
  pass('Baralho de dados mantém 78 cartas',CARDS.length===78,`${CARDS.length}`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 123 destinos',entries.length===123,`${entries.length}`);
  pass('Índice possui 123 URLs únicas',new Set(entries.map(item=>item.url)).size===123);
  const categories=Object.fromEntries(['cartas','tiragens','aprender','portal'].map(category=>[category,entries.filter(item=>item.category===category).length]));
  pass('Categorias 78 + 14 + 21 + 10',JSON.stringify(categories)===JSON.stringify({cartas:78,tiragens:14,aprender:21,portal:10}),JSON.stringify(categories));
  pass('Índice liga novo guia em destaque',entries.some(item=>item.url==='como-embaralhar-cartas-de-tarot.html'&&item.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  for(const query of ['como embaralhar','baralho grande','cortar baralho','sete vezes','carta invertida','riffle'])pass(`Busca encontra guia: ${query}`,find(query).some(item=>item.url==='como-embaralhar-cartas-de-tarot.html'));
  pass('Busca ainda encontra escolher baralho',find('primeiro baralho').some(item=>item.url==='como-escolher-um-baralho-de-tarot.html'));
  pass('Busca ainda encontra tipos',find('Frieda Harris').some(item=>item.url==='tipos-de-tarot.html'));
  pass('Busca ainda encontra símbolos',find('lanterna').some(item=>item.url==='simbolos-do-tarot.html'));
  pass('Busca ainda encontra carta',find('A Lua').some(item=>item.title==='A Lua'));
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(value=>consult.includes(value)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}else{
  const packageFiles=fs.readdirSync(root,{withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>entry.name).sort();
  pass('Pacote contém somente treze arquivos',JSON.stringify(packageFiles)===JSON.stringify([...required].sort()),packageFiles.join(', '));
}

const result={suite:'DIVINA-BRUXA-V171-COMO-EMBARALHAR-TAROT',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
