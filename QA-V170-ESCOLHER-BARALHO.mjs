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

const required=['sitemap.xml','buscar.html','busca-v165.js','tipos-de-tarot.html','tarot-para-iniciantes.html','guias-para-comecar.html','como-escolher-um-baralho-de-tarot.html','escolher-baralho-v170.css','escolher-baralho-v170.js','00-LEIA-PRIMEIRO-V170-ESCOLHER-BARALHO.txt','ESCOLHER-BARALHO-V170.json','QA-V170-ESCOLHER-BARALHO.mjs','ARQUIVOS-V170-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V170-ESCOLHER-BARALHO-DE-TAROT',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('como-escolher-um-baralho-de-tarot.html'),css=read('escolher-baralho-v170.css'),js=read('escolher-baralho-v170.js');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='Como escolher um baralho de Tarot | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/como-escolher-um-baralho-de-tarot.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS V170',html.includes('escolher-baralho-v170.css?v=170'));
pass('JS V170',html.includes('escolher-baralho-v170.js?v=170'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
pass('Somente JSON-LD e script local',count(html,/<script(?:\s|>)/g)===2&&count(html,/type="application\/ld\+json"/g)===1&&count(html,/src="escolher-baralho-v170\.js\?v=170"/g)===1);
pass('Imagem existente com dimensões',html.includes('<img src="card-00.webp" width="1024" height="1536"'));
pass('Alt descritivo',html.includes('alt="O Louco — carta do Tarot em posição direta"'));
pass('Arte contemporânea identificada',html.includes('CARTA CONTEMPORÂNEA · O COMEÇO É UMA ESCOLHA'));

for(const tag of ['header','nav','main','article','section','aside','footer','figure','figcaption','ol','ul','li','dl','dt','dd','details','summary','fieldset','legend','form','label','button'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
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
pass('FAQPage com cinco perguntas',faq?.mainEntity?.length===5&&faq.mainEntity.every(x=>x['@type']==='Question'&&x.acceptedAnswer?.['@type']==='Answer'));
pass('Imagem estruturada contemporânea',graph.find(x=>x['@type']==='ImageObject')?.caption==='O Louco, carta contemporânea da coleção Divina Bruxa em posição direta');

pass('Navegação interna completa',['#teste','#criterios','#checklist','#formatos','#primeiros-minutos','#fontes'].every(value=>html.includes(`href="${value}"`)));
const quiz=html.match(/<form class="deck-quiz"[\s\S]*?<\/form>/)?.[0]||'';
pass('Formulário do teste presente',quiz.includes('data-deck-quiz'));
pass('Cinco perguntas em fieldsets',count(quiz,/<fieldset>/g)===5&&count(quiz,/<legend>/g)===5);
pass('Quinze opções nativas',count(quiz,/type="radio"/g)===15&&count(quiz,/<label>/g)===15);
pass('Cinco grupos obrigatórios',count(quiz,/\brequired\b/g)===5);
const radioNames=[...quiz.matchAll(/type="radio" name="([^"]+)"/g)].map(match=>match[1]);
pass('Cinco grupos com três opções',new Set(radioNames).size===5&&[...new Set(radioNames)].every(name=>radioNames.filter(value=>value===name).length===3));
for(const value of ['marselha','rws','thoth'])pass(`Cinco respostas ${value}`,count(quiz,new RegExp(`value="${value}"`,'g'))===5);
pass('Progresso anunciado',html.includes('data-quiz-count aria-live="polite" aria-atomic="true"')&&html.includes('data-quiz-progress'));
pass('Resultado acessível',html.includes('data-quiz-result aria-labelledby="result-title" aria-live="polite" aria-atomic="true" hidden')&&html.includes('id="result-title" tabindex="-1"'));
pass('Três placares',count(html,/data-score="(?:marselha|rws|thoth)"/g)===3&&count(html,/data-score-bar="(?:marselha|rws|thoth)"/g)===3);
const criteria=html.match(/<div class="criteria-grid">([\s\S]*?)<\/div>\s*<\/section>/)?.[1]||'';
pass('Cinco critérios de escolha',count(criteria,/<article>/g)===5);
const checklist=html.match(/<ol class="purchase-checklist">([\s\S]*?)<\/ol>/)?.[1]||'';
pass('Sete verificações de compra',count(checklist,/<li>/g)===7);
const formats=html.match(/<div class="format-compare">([\s\S]*?)<\/div>\s*<p class="decision-note">/)?.[1]||'';
pass('Dois formatos comparados',count(formats,/<article>/g)===2&&formats.includes('<h3>Físico</h3>')&&formats.includes('<h3>Digital</h3>'));
pass('Cinco perguntas visíveis',count(html,/<details>/g)===5&&count(html,/<summary>/g)===5);
pass('Prática de quinze minutos',html.includes('Uma prática para os primeiros 15 minutos')&&count(html.match(/<section id="primeiros-minutos"[\s\S]*?<\/section>/)?.[0]||'',/<li>/g)===4);
pass('Quatro fontes numeradas',count(html,/<li id="fonte-[^"]+">/g)===4);
pass('Quatro links externos seguros',count(html,/target="_blank" rel="noopener noreferrer"/g)===4);

const sourceUrls=['https://www.vam.ac.uk/articles/tarot-cards','https://www.britishmuseum.org/collection/object/P_1904-0511-47-1-78','https://www.themorgan.org/exhibitions/tarot','https://www.themorgan.org/sites/default/files/pdf/exhibitions/Morgan_Tarot_ExhibitionLabels.pdf'];
for(const url of sourceUrls)pass(`Fonte: ${url}`,count(html,new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))===2);
for(const phrase of ['não recomenda marcas, lojas ou produtos específicos','Preço não garante clareza visual','Meu primeiro baralho precisa ser presente?','Não existe uma obrigação técnica','nenhum formato torna a interpretação automaticamente superior','Nada é enviado, salvo ou associado a você'])pass(`Cautela editorial: ${phrase}`,html.includes(phrase));
for(const phrase of ['cartas numeradas','Créditos de artista e autoria','altura, largura, flexibilidade e acabamento','Confirme o idioma','Defina o uso principal'])pass(`Critério essencial: ${phrase}`,html.includes(phrase));
for(const link of ['tipos-de-tarot.html','tarot-para-iniciantes.html','simbolos-do-tarot.html','cartas-do-tarot.html','tarot-livre.html','guias-para-comecar.html','buscar.html'])pass(`Link editorial: ${link}`,html.includes(`href="${link}"`));

try{new Function(js);pass('JavaScript sintaticamente válido',true);}catch(error){pass('JavaScript sintaticamente válido',false,error.message);}
pass('JS com três perfis',js.includes('const profiles = Object.freeze')&&['marselha','rws','thoth'].every(value=>js.includes(`${value}: {`)));
pass('JS calcula empate híbrido',js.includes("resultTitle.textContent = 'Seu perfil é híbrido'")&&js.includes('winners.length === 1'));
pass('JS valida o formulário',js.includes('form.reportValidity()'));
pass('JS atualiza sem HTML injetado',js.includes('.textContent =')&&!/\.innerHTML\b|insertAdjacentHTML|outerHTML/.test(js));
pass('JS sem rede',!/(?:\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource)/.test(js));
pass('JS sem armazenamento',!/(?:localStorage|sessionStorage|indexedDB|document\.cookie)/.test(js));
pass('JS respeita movimento reduzido',js.includes("matchMedia('(prefers-reduced-motion: reduce)')"));

pass('CSS com seleção acessível',css.includes('.quiz-options input:focus-visible + span')&&css.includes('.quiz-options input:checked + span'));
pass('CSS com resultado e placares',css.includes('.quiz-result')&&css.includes('.score-list'));
pass('CSS com layouts editoriais',css.includes('.criteria-grid')&&css.includes('.purchase-checklist')&&css.includes('.format-compare'));
pass('CSS móvel',css.includes('@media (max-width: 980px)')&&css.includes('@media (max-width: 760px)')&&css.includes('@media (max-width: 560px)'));
pass('CSS para telas mínimas',css.includes('@media (max-width: 340px)'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS de impressão',css.includes('@media print')&&css.includes('.choice-tool'));
pass('CSS equilibrado',count(css,/{/g)===count(css,/}/g),`${count(css,/{/g)}/${count(css,/}/g)}`);

const types=read('tipos-de-tarot.html'),beginner=read('tarot-para-iniciantes.html'),guides=read('guias-para-comecar.html');
pass('Tipos liga novo guia uma vez',count(types,/href="como-escolher-um-baralho-de-tarot\.html"/g)===1);
pass('Iniciantes liga novo guia uma vez',count(beginner,/href="como-escolher-um-baralho-de-tarot\.html"/g)===1);
pass('Guias liga novo guia uma vez',count(guides,/href="como-escolher-um-baralho-de-tarot\.html"/g)===1);
const typesAddition=' Se preferir uma orientação personalizada, <a href="como-escolher-um-baralho-de-tarot.html">faça o teste para escolher seu baralho</a>.';
const beginnerAddition=' Se estiver escolhendo o primeiro conjunto, <a href="como-escolher-um-baralho-de-tarot.html">use o guia interativo</a>.';
const guidesAddition='<a href="como-escolher-um-baralho-de-tarot.html">Escolher o primeiro baralho com critérios →</a>';
pass('Tipos V169 preservado fora da integração',sha256(types.replace(typesAddition,''))==='cd603ab78997a9828b2c6ae6bddc2365c0788f3f71319a0a13bd57c203d828ce',sha256(types.replace(typesAddition,'')));
pass('Iniciantes V169 preservado fora da integração',sha256(beginner.replace(beginnerAddition,''))==='819bbdaf26319816f8aaca6e5711965821b467761266df8853c6b4707527c0ea',sha256(beginner.replace(beginnerAddition,'')));
pass('Guias V169 preservado fora da integração',sha256(guides.replace(guidesAddition,''))==='d6f02428307643c34669d7a1ac1f6e899d2b526bb5e956103c1b0f9674932f6d',sha256(guides.replace(guidesAddition,'')));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 122 caminhos',searchHtml.includes('122 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V170',searchHtml.includes('busca-v165.js?v=170'));
pass('Índice contém novo guia uma vez',count(searchScript,/\['Como escolher um baralho de Tarot', 'como-escolher-um-baralho-de-tarot\.html'/g)===1);
pass('Novo guia em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26,27,28,29,30].includes(index)'));
const recoveredSearchHtml=searchHtml.replace('122 CAMINHOS · UMA BUSCA','121 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=170','busca-v165.js?v=169');
pass('Página de busca V169 preservada',sha256(recoveredSearchHtml)==='1de6810b340ca7e7ee5d4669d77a77b5c64a8bd430854158d72351ddc2c26472',sha256(recoveredSearchHtml));
const guideIndexLine="  ['Como escolher um baralho de Tarot', 'como-escolher-um-baralho-de-tarot.html', 'Guia interativo', 'aprender', 'Teste local para descobrir afinidade com Marselha, Rider-Waite-Smith ou Thoth, comparar cartas numeradas, formato físico ou digital, tamanho, idioma, créditos, livreto e qualidade antes da compra. primeiro baralho escolher comprar presente consagrar limpar checklist'],\n";
const recoveredSearchScript=searchScript.replace(guideIndexLine,'').replace('[1,2,3,4,5,6,14,15,26,27,28,29,30].includes(index)','[1,2,3,4,5,6,14,15,26,27,28,29].includes(index)');
pass('Motor de busca V169 preservado',sha256(recoveredSearchScript)==='92e66400e9b448b88504f04df958c74b85b2b4027678090a48a6aac745fa2595',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 123 URLs',count(sitemap,/<url>/g)===123);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('Novo guia único no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/como-escolher-um-baralho-de-tarot\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(m=>m[1]);
pass('URLs de página únicas',pageLocs.length===123&&new Set(pageLocs).size===123,`${pageLocs.length}/${new Set(pageLocs).size}`);
const sitemapBlock='  <url>\n    <loc>https://divinabruxa.com.br/como-escolher-um-baralho-de-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
pass('Sitemap V169 preservado',sha256(sitemap.replace(sitemapBlock,''))==='7a08f1e5ca2b63078f5ef67b68a7ce6d21ad6eb5e00f98b46377f4a0a47d337c',sha256(sitemap.replace(sitemapBlock,'')));

const contract=JSON.parse(read('ESCOLHER-BARALHO-V170.json'));
pass('Contrato V170',contract.schemaVersion==='170.0.0');
pass('Contrato teste completo',contract.choiceGuide?.quizQuestions===5&&contract.choiceGuide?.quizOptions===15&&contract.choiceGuide?.quizProfiles?.length===3&&contract.choiceGuide?.hybridResultSupported===true);
pass('Contrato conteúdo completo',contract.choiceGuide?.selectionCriteria===5&&contract.choiceGuide?.purchaseChecks===7&&contract.choiceGuide?.faqQuestions===5&&contract.choiceGuide?.institutionalSources===4);
pass('Contrato privacidade local',contract.quizPrivacy?.runsLocally===true&&contract.quizPrivacy?.networkRequests===false&&contract.quizPrivacy?.choicesStored===false);
pass('Contrato sem recomendações comerciais',contract.editorialMethod?.brandRecommendations===false&&contract.editorialMethod?.sellerRecommendations===false&&contract.editorialMethod?.specificProductRecommendations===false);
pass('Contrato quatro referências',contract.references?.length===4&&new Set(contract.references.map(x=>x.url)).size===4);
pass('Contrato busca 122',contract.searchIntegration?.indexedDestinationsAfter===122&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===122);
pass('Contrato sitemap 123',contract.discoverability?.sitemapUrlsAfter===123&&contract.discoverability?.sitemapImageEntries===78);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78&&contract.safeguards?.tarotLivreRepeats===false&&contract.safeguards?.tarotLivreMeaningsInsideFreeMode===false);
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true&&contract.safeguards?.ownerEmail==='orbedasrealidades@hotmail.com');
pass('Contrato treze arquivos',contract.installation?.filesInPackage===13&&contract.installation?.replace?.length===6&&contract.installation?.add?.length===7);

const manifest=new Map();
for(const line of read('ARQUIVOS-V170-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V170-SHA256.txt');
pass('Manifesto doze hashes',manifest.size===12,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','historia-do-tarot.html':'7d63c8fdc0a45225e29648b9118b43ee6c688d08c37fde67507a8696ce72216c','historia-tarot-v167.css':'fbe141aa683fdce8776111aa3bd9f3a362a799ed185ffa5d0bcc6cac44053d73','simbolos-do-tarot.html':'8650b833ef42e6eb6334e2ace93284b87f55dfe94fc48fc3db59f972dc7acca2','simbolos-tarot-v168.css':'df957a3c75a410f69745cd4070c37e707b02e17ddc6af2363ccf196b784b9ac2','simbolos-tarot-v168.js':'07dd2277c6b1e0a96055cc2f7448c46eb8928d5abc0490422cf83de53b158ef5','glossario-do-tarot.html':'456e905fbeabbe17df4efbc5e12aebee68f986d536c9b1b9465a6cd2eb3b3936','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','glossario-v166.css':'eade19b83031c1e27f88a9fc1f1a14165ce497b41b60eb06a04b575415d4ee06','glossario-v166.js':'33e5e1512f265d5ef7b23c62a9122edfe3d4ab0c0d4fa1826c45843e61fb634b','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  pass('Carta existente preservada',exists('card-00.webp')&&fs.statSync(filePath('card-00.webp')).size>100000);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino da página: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=170`);
  pass('Baralho de dados mantém 78 cartas',CARDS.length===78,`${CARDS.length}`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 122 destinos',entries.length===122,`${entries.length}`);
  pass('Índice possui 122 URLs únicas',new Set(entries.map(x=>x.url)).size===122);
  const categories=Object.fromEntries(['cartas','tiragens','aprender','portal'].map(category=>[category,entries.filter(x=>x.category===category).length]));
  pass('Categorias 78 + 14 + 20 + 10',JSON.stringify(categories)===JSON.stringify({cartas:78,tiragens:14,aprender:20,portal:10}),JSON.stringify(categories));
  pass('Índice liga novo guia em destaque',entries.some(x=>x.url==='como-escolher-um-baralho-de-tarot.html'&&x.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  for(const query of ['escolher baralho','primeiro baralho','baralho digital','checklist','consagrar limpar','Rider Waite Smith'])pass(`Busca encontra guia: ${query}`,find(query).some(x=>x.url==='como-escolher-um-baralho-de-tarot.html'));
  pass('Busca ainda encontra tipos',find('Frieda Harris').some(x=>x.url==='tipos-de-tarot.html'));
  pass('Busca ainda encontra história',find('Visconti Sforza').some(x=>x.url==='historia-do-tarot.html'));
  pass('Busca ainda encontra símbolos',find('lanterna').some(x=>x.url==='simbolos-do-tarot.html'));
  pass('Busca ainda encontra carta',find('A Lua').some(x=>x.title==='A Lua'));
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

const result={suite:'DIVINA-BRUXA-V170-ESCOLHER-BARALHO-DE-TAROT',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
