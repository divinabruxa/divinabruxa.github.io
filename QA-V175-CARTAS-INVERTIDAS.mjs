import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root=path.resolve(process.argv[2]||'.');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const count=(text,re)=>(text.match(re)||[]).length;
const tests=[];
const check=(name,pass,detail='')=>tests.push({name,pass:Boolean(pass),detail});
const files=['sitemap.xml','buscar.html','busca-v165.js','metodologia-do-tarot.html','tarot-para-iniciantes.html','guias-para-comecar.html','escola-do-tarot.html','cartas-invertidas-no-tarot.html','cartas-invertidas-v175.css','cartas-invertidas-v175.js','00-LEIA-PRIMEIRO-V175-CARTAS-INVERTIDAS.txt','CARTAS-INVERTIDAS-V175.json','QA-V175-CARTAS-INVERTIDAS.mjs','ARQUIVOS-V175-SHA256.txt'];
for(const file of files) check(`arquivo presente: ${file}`,exists(file));

const html=read('cartas-invertidas-no-tarot.html');
const css=read('cartas-invertidas-v175.css');
const js=read('cartas-invertidas-v175.js');
const searchPage=read('buscar.html');
const searchJs=read('busca-v165.js');
const sitemap=read('sitemap.xml');
const contract=JSON.parse(read('CARTAS-INVERTIDAS-V175.json'));
const fullProject=exists('index.html')&&exists('tarot-livre.html');

check('doctype',/^<!doctype html>/i.test(html));
check('idioma pt-BR',/<html lang="pt-BR">/.test(html));
check('viewport',/viewport-fit=cover/.test(html));
check('title correto',/<title>Cartas invertidas no Tarot: são obrigatórias\? \| Divina Bruxa<\/title>/.test(html));
check('description ampla',/<meta name="description" content="[^"]{130,}/.test(html));
check('canonical',/rel="canonical" href="https:\/\/divinabruxa\.com\.br\/cartas-invertidas-no-tarot\.html"/.test(html));
check('robots',/index,follow,max-image-preview:large/.test(html));
check('css comum',/seo-portal-v154\.css\?v=154/.test(html));
check('css V175',/cartas-invertidas-v175\.css\?v=175/.test(html));
check('js V175',/cartas-invertidas-v175\.js\?v=175/.test(html));
check('sem og:image novo',!/property="og:image"/.test(html));
check('um h1',count(html,/<h1\b/g)===1);
check('skip link',/class="skip-link" href="#conteudo"/.test(html));
check('main',/<main id="conteudo"/.test(html));
check('imagem existente dimensionada',/src="tarot-atlas\.webp" width="3000" height="3600"/.test(html));
check('alt descritivo',/alt="Mosaico contemporâneo das 78 cartas diretas/.test(html));
check('sem nome pessoal',!/\bÍsis\b|\bIsis\b/.test(html));

for(const id of ['laboratorio','fundamento','lentes','comparacao','consistencia','faq','fontes']) check(`seção #${id}`,html.includes(`id="${id}"`));
check('dois selects',count(html,/<select\b/g)===2);
check('oito opções',count(html,/<option\b/g)===8);
check('resultado live',/data-lens-result[^>]+aria-live="polite"/.test(html));
check('título focalizável',/id="lens-result-title" tabindex="-1"/.test(html));
check('quatro cartões do resultado',count(html.match(/class="lens-grid"[\s\S]*?<\/div>/)?.[0]||'',/<article>/g)===4);
check('fallback noscript',/<noscript>/.test(html));
check('privacidade local',/Privado por construção/.test(html)&&/não são enviadas nem guardadas/.test(html));
check('Tarot Livre explícito',/78 cartas diretas, sem repetição e sem significados durante a revelação/.test(html));

const meaningBlock=html.match(/class="meaning-grid"[\s\S]*?<\/div>/)?.[0]||'';
const lensesBlock=html.match(/class="four-lenses"[\s\S]*?<\/ol>/)?.[0]||'';
const consistencyBlock=html.match(/class="consistency-section"[\s\S]*?<\/section>/)?.[0]||'';
const tableBlock=html.match(/<table>[\s\S]*?<\/table>/)?.[0]||'';
check('quatro possibilidades de inversão',count(meaningBlock,/<article>/g)===4);
check('quatro lentes',count(lensesBlock,/<li>/g)===4);
check('cinco decisões de consistência',count(consistencyBlock,/<li>/g)===5);
check('cinco linhas comparativas',count(tableBlock,/<tr>/g)===6);
check('seis FAQs',count(html,/<details>/g)===6);
check('duas fontes',count(html.match(/class="source-list"[\s\S]*?<\/ol>/)?.[0]||'',/<li>/g)===2);
for(const term of ['Bloqueio','Interiorização','Excesso ou falta','Atraso ou revisão']) check(`possibilidade: ${term}`,html.includes(term));
for(const lens of ['Imagem','Posição','Contexto','Integração']) check(`lente: ${lens}`,html.includes(`>${lens}<`));
for(const phrase of ['Direta não garante benefício','Invertida não anuncia dano','não são sinônimos automáticos','a Divina Bruxa permanece direta']) check(`princípio: ${phrase}`,html.toLocaleLowerCase('pt-BR').includes(phrase.toLocaleLowerCase('pt-BR')));

const jsonMatch=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
check('JSON-LD presente',jsonMatch);
let graph=[];
try{graph=JSON.parse(jsonMatch[1])['@graph'];check('JSON-LD válido',Array.isArray(graph));}catch{check('JSON-LD válido',false);}
for(const type of ['Organization','WebSite','ImageObject','BreadcrumbList','Article','HowTo','FAQPage']) check(`schema ${type}`,graph.some(x=>x['@type']===type));
const howTo=graph.find(x=>x['@type']==='HowTo')||{};
const faq=graph.find(x=>x['@type']==='FAQPage')||{};
check('HowTo quatro passos',howTo.step?.length===4);
check('HowTo oito minutos',howTo.totalTime==='PT8M');
check('FAQ schema seis',faq.mainEntity?.length===6);
check('Article gratuito',graph.find(x=>x['@type']==='Article')?.isAccessibleForFree===true);
check('duas citações no Article',graph.find(x=>x['@type']==='Article')?.citation?.length===2);
for(const url of ['https://www.gutenberg.org/files/43548/43548-h/43548-h.htm','https://www.vam.ac.uk/articles/tarot-cards']) check(`fonte ${url}`,html.includes(url));

try{execFileSync(process.execPath,['--check',path.join(root,'cartas-invertidas-v175.js')],{stdio:'pipe'});check('sintaxe JS guia',true);}catch{check('sintaxe JS guia',false);}
try{execFileSync(process.execPath,['--check',path.join(root,'busca-v165.js')],{stdio:'pipe'});check('sintaxe JS busca',true);}catch{check('sintaxe JS busca',false);}
for(const card of ["sol:","lua:","'cinco-copas':","'dois-espadas':"]) check(`JS carta ${card}`,js.includes(card));
for(const context of ["geral:","amor:","trabalho:","espiritual:"]) check(`JS contexto ${context}`,count(js,new RegExp(context.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))>=4);
check('16 combinações JS',count(js,/      (geral|amor|trabalho|espiritual):\[/g)===16,String(count(js,/      (geral|amor|trabalho|espiritual):\[/g)));
for(const field of ['title','summary','image','power','tension','question']) check(`JS atualiza ${field}`,js.includes(`fields.${field}.textContent`));
for(const forbidden of ['fetch(','XMLHttpRequest','WebSocket','localStorage','sessionStorage','document.cookie']) check(`JS sem ${forbidden}`,!js.includes(forbidden));
check('render inicial',/render\(\);\s*\}\)\(\);/.test(js));
check('change atualiza',/addEventListener\('change'/.test(js));
check('submit evita recarregar',/event\.preventDefault\(\)/.test(js));

for(const token of ['@media (max-width:930px)','@media (max-width:860px)','@media (max-width:620px)','@media (prefers-reduced-motion:reduce)','@media print','grid-template-columns:1fr']) check(`CSS ${token}`,css.includes(token));
check('select com foco visível',/select:focus-visible/.test(css));
check('texto principal 16px',/font-size:16px/.test(css));
check('tabela rolável',/overflow-x:auto/.test(css));

check('busca chama V175',/busca-v165\.js\?v=175/.test(searchPage));
check('entrada única busca',count(searchJs,/cartas-invertidas-no-tarot\.html/g)===1);
check('guia em destaque',/,35\]\.includes\(index\)/.test(searchJs));
const rows=count(searchJs,/^  \['/gm);
check('49 páginas editoriais',rows===49,String(rows));
check('127 destinos',78+rows===127,String(78+rows));
const searchRow=searchJs.split('\n').find(line=>line.includes('cartas-invertidas-no-tarot.html'))||'';
for(const query of ['cartas invertidas','carta de cabeça para baixo','tarot sem invertidas','significado negativo','bloqueio interiorização']) { const normalized=query.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,''); const normalizedRow=searchRow.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,''); check(`busca encontra ${query}`,normalized.split(' ').every(word=>normalizedRow.includes(word))); }

check('128 URLs sitemap',count(sitemap,/<url>/g)===128,String(count(sitemap,/<url>/g)));
check('78 imagens sitemap',count(sitemap,/<image:image>/g)===78,String(count(sitemap,/<image:image>/g)));
check('URL nova única sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/cartas-invertidas-no-tarot\.html<\/loc>/g)===1);
check('sitemap fechado',/<\/urlset>\s*$/.test(sitemap));
for(const file of ['metodologia-do-tarot.html','tarot-para-iniciantes.html','guias-para-comecar.html','escola-do-tarot.html']) check(`link integrado ${file}`,count(read(file),/cartas-invertidas-no-tarot\.html/g)===1);

check('contrato versão',contract.schemaVersion==='175.0.0');
check('contrato 14 arquivos',contract.installation.filesInPackage===14);
check('contrato 7 substituições',contract.installation.replace.length===7);
check('contrato 7 adições',contract.installation.add.length===7);
check('contrato 16 exemplos',contract.guide.interactiveExamples===16);
check('contrato busca 127',contract.searchIntegration.indexedDestinationsAfter===127);
check('contrato sitemap 128',contract.discoverability.sitemapUrlsAfter===128);
check('contrato orientação direta',contract.safeguards.tarotLivreOrientation==='upright-only');
check('contrato preços',JSON.stringify(contract.safeguards.consultationPricesBrl)==='[250,150,100,50]');
check('contrato e-mail',contract.safeguards.consultationEmailRequired===true);
check('contrato cobrança desligada',contract.safeguards.realBillingEnabled===false);

const manifest=read('ARQUIVOS-V175-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
check('manifesto 13 entradas',manifest.length===13,String(manifest.length));
for(const line of manifest){const m=line.match(/^([a-f0-9]{64})  (.+)$/);check(`linha válida ${line.slice(-32)}`,m);if(m)check(`hash correto ${m[2]}`,exists(m[2])&&sha(fs.readFileSync(path.join(root,m[2])))===m[1]);}

const stable={
  'sitemap.xml':'37c7eeafa1b5d2d0d2ae2e7fe0575e256230e28cf8dbf6a828f0651ea00d169c','buscar.html':'2b3a04fbf6ca35c788c337b21c36d6e90a15d9d89de40d3a32270416d62f671d','busca-v165.js':'9dfdea4e88dcae9bdea075cd2c58bd78cf1a455022af2ef40ebe4c80e48b8026','metodologia-do-tarot.html':'e430afb72d237496b22e461aabf8698ae771158b6aa2132de70f6335774ec360','tarot-para-iniciantes.html':'341430278dab908313dea48d00352ac0fc1bb0496e039c71661ffce2e1d89ab7','guias-para-comecar.html':'5eaeb7f50ca1cde291e89b7f52d531a6200b91df945533da82e699d61e6ebb21','escola-do-tarot.html':'40d97ecc8341041fd542d177e11247c0a0aede0ded2f422a9a9959338d17ffe9','cartas-invertidas-no-tarot.html':'5785719a690b1e2be3ee763bdc937f6d06f33d30c3d4377482b6ed74ab25994b','cartas-invertidas-v175.css':'a57aa87fe3a7ac895bac5536d903d4efd310fc7825f1a11167120d92c0d246ec','cartas-invertidas-v175.js':'b2ae8707a146f9e88f5c5aea1e910b8e01fc579b8adf6e4a09261aecbd86d08e'};
for(const [file,expected] of Object.entries(stable)) check(`hash estável ${file}`,sha(fs.readFileSync(path.join(root,file)))===expected);

if(fullProject){
  const index=read('index.html'); const consult=read('consultas-de-tarot.html');
  check('home 78 sem repetição',/78 cartas sem repetição/i.test(index));
  check('home mesa 13 por 6',/13 fileiras de 6/i.test(index));
  check('home direta sem significado',/DIRETA · SEM SIGNIFICADO/.test(index));
  for(const price of ['R$ 250','R$ 150','R$ 100','R$ 50']) check(`consulta ${price}`,index.includes(price)&&consult.includes(price));
  check('consulta e-mail obrigatório',/e-mail (?:é )?obrigatório/i.test(consult));
  check('e-mail proprietário',[...fs.readdirSync(root).filter(f=>/consult|index|admin/i.test(f)&&/\.(html|js|json)$/.test(f)).map(read)].join('\n').includes('orbedasrealidades@hotmail.com'));
  check('78 imagens oficiais',fs.readdirSync(root).filter(f=>/^card-[a-z0-9-]+\.webp$/.test(f)).length>=78);
}

const failed=tests.filter(t=>!t.pass);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-V175-CARTAS-INVERTIDAS',status:failed.length?'FAIL':'PASS',mode:fullProject?'full-project':'release-package',root,total:tests.length,passed:tests.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
