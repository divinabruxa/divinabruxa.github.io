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

const required=['sitemap.xml','buscar.html','busca-v165.js','cartas-do-tarot.html','guias-para-comecar.html','glossario-do-tarot.html','glossario-v166.css','glossario-v166.js','00-LEIA-PRIMEIRO-V166-GLOSSARIO-DO-TAROT.txt','GLOSSARIO-TAROT-V166.json','QA-V166-GLOSSARIO-DO-TAROT.mjs','ARQUIVOS-V166-SHA256.txt'];
for(const file of required)pass(`Arquivo presente: ${file}`,exists(file));
if(failures.length){console.error(JSON.stringify({suite:'DIVINA-BRUXA-V166-GLOSSARIO-DO-TAROT',status:'FAIL',failures},null,2));process.exit(1);}

const html=read('glossario-do-tarot.html'),css=read('glossario-v166.css'),script=read('glossario-v166.js');
const title=html.match(/<title>([^<]+)<\/title>/)?.[1]||'';
const description=html.match(/<meta name="description" content="([^"]+)">/)?.[1]||'';
pass('Título exato',title==='Glossário do Tarot: 62 termos explicados | Divina Bruxa');
pass('Título adequado',title.length>=35&&title.length<=65,`${title.length}`);
pass('Descrição adequada',description.length>=120&&description.length<=165,`${description.length}`);
pass('Canonical',html.includes('<link rel="canonical" href="https://divinabruxa.com.br/glossario-do-tarot.html">'));
pass('Robots',html.includes('index,follow,max-image-preview:large'));
pass('Idioma',html.includes('<html lang="pt-BR">'));
pass('H1 único',count(html,/<h1(?:\s|>)/g)===1);
pass('Main único',count(html,/<main\b[^>]*id="conteudo"/g)===1);
pass('Skip link',html.includes('<a class="skip-link" href="#conteudo">'));
pass('Formulário de filtro',html.includes('<form class="glossary-filter" role="search"'));
pass('Rótulo visível',html.includes('<label for="filtrar-termos">Filtrar os termos desta página</label>'));
pass('Input de busca',html.includes('id="filtrar-termos" type="search"'));
pass('Contagem viva',html.includes('data-glossary-count aria-live="polite" aria-atomic="true">62 termos'));
pass('Índice com 17 letras',count(html,/<a href="#letra-[a-z]">[A-Z]<\/a>/g)===17);
pass('17 seções de letra',count(html,/class="glossary-letter" data-letter/g)===17);
pass('62 definições',count(html,/class="glossary-entry" data-glossary-entry/g)===62);
pass('62 termos em dt',count(html,/<dt><a href="#[^"]+">[^<]+<\/a><\/dt>/g)===62);
pass('CSS do portal',html.includes('seo-portal-v154.css?v=154'));
pass('CSS do glossário',html.includes('glossario-v166.css?v=166'));
pass('Script do glossário',html.includes('<script src="glossario-v166.js?v=166" defer></script>'));
pass('Sem imagem social',!/property="og:image"/.test(html));
pass('Sem nome pessoal',!/\b[ií]sis\b/i.test(html));
for(const tag of ['header','nav','main','section','footer','form','dl','dt','dd'])pass(`Tags ${tag}`,count(html,new RegExp(`<${tag}(?:\\s|>)`,'g'))===count(html,new RegExp(`</${tag}>`,'g')));
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
pass('IDs únicos',ids.length===new Set(ids).size,`${ids.length}/${new Set(ids).size}`);
const hashTargets=[...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
pass('Âncoras internas válidas',hashTargets.every(id=>ids.includes(id)));
for(const m of html.matchAll(/aria-labelledby="([^"]+)"/g))for(const id of m[1].split(/\s+/))pass(`ARIA encontra ${id}`,ids.includes(id));

let graph=[];try{graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[];pass('JSON-LD válido',true);}catch(error){pass('JSON-LD válido',false,error.message);}
for(const type of ['Organization','WebSite','BreadcrumbList','DefinedTermSet','CollectionPage'])pass(`JSON-LD ${type}`,graph.some(x=>x['@type']===type));
const termSet=graph.find(x=>x['@type']==='DefinedTermSet');
pass('DefinedTermSet com 62 termos',termSet?.hasDefinedTerm?.length===62,`${termSet?.hasDefinedTerm?.length}`);
pass('DefinedTermSet usa DefinedTerm',termSet?.hasDefinedTerm?.every(x=>x['@type']==='DefinedTerm'&&x.name));
const domTerms=[...html.matchAll(/<dt><a href="#[^"]+">([^<]+)<\/a><\/dt>/g)].map(m=>m[1]);
const schemaTerms=termSet?.hasDefinedTerm?.map(x=>x.name)||[];
pass('Termos únicos',new Set(domTerms).size===62);
pass('Schema corresponde ao conteúdo',JSON.stringify(schemaTerms)===JSON.stringify(domTerms));

for(const phrase of ['todas as cartas permanecem na orientação direta','medição científica','Deve permanecer hipótese','Não afirma acesso literal aos pensamentos secretos','não com acontecimentos inevitáveis ou garantidos','78 cartas em 13 fileiras de 6'])pass(`Limite responsável: ${phrase}`,html.includes(phrase));
for(const link of ['arvore-da-vida-no-tarot.html','tiragem-caminho-em-cinco.html','carta-do-dia.html','combinacoes-de-cartas-no-tarot.html','tiragem-dois-caminhos.html','cruz-celta-no-tarot.html','escola-do-tarot.html','figuras-da-corte-no-tarot.html','mandala-astrologica-no-tarot.html','mesa-personalizada-no-tarot.html','mesa-real-no-tarot.html','numerologia-no-tarot.html','como-fazer-perguntas-ao-tarot.html','tiragens-de-tarot.html','tiragem-de-tres-cartas.html','tiragem-de-uma-carta.html','cartas-do-tarot.html','guias-para-comecar.html','buscar.html'])pass(`Link editorial: ${link}`,html.includes(`href="${link}"`));

pass('Filtro normaliza acentos',script.includes(".normalize('NFD')")&&script.includes('/[\\u0300-\\u036f]/g'));
pass('Filtro usa todos os termos',script.includes("document.querySelectorAll('[data-glossary-entry]')"));
pass('Filtro combina palavras',script.includes('tokens.every(token => searchable.get(entry).includes(token))'));
pass('Filtro esconde letras vazias',script.includes("section.querySelector('[data-glossary-entry]:not([hidden])')"));
pass('Filtro anuncia quantidade',script.includes("visible === 1 ? 'termo' : 'termos'"));
pass('Filtro limpa com Escape',script.includes("event.key === 'Escape'"));
pass('Sem injeção de HTML',!/innerHTML\s*=|insertAdjacentHTML|document\.write/.test(script));
pass('Sem transmissão externa',!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(script));
pass('Sem armazenamento',!/localStorage|sessionStorage|indexedDB|document\.cookie/.test(script));
pass('CSS em duas colunas',css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
pass('CSS móvel em uma coluna',css.includes('@media (max-width: 700px)')&&css.includes('grid-template-columns: 1fr'));
pass('CSS respeita movimento reduzido',css.includes('@media (prefers-reduced-motion: reduce)'));
pass('CSS possui foco visível',css.includes(':focus-visible'));

const searchHtml=read('buscar.html'),searchScript=read('busca-v165.js');
pass('Busca anuncia 118 caminhos',searchHtml.includes('118 CAMINHOS · UMA BUSCA'));
pass('Busca usa revisão V166',searchHtml.includes('busca-v165.js?v=166'));
pass('Busca liga o glossário',count(searchHtml,/href="glossario-do-tarot\.html">Glossário<\/a>/g)===1);
pass('Índice contém glossário',count(searchScript,/\['Glossário do Tarot', 'glossario-do-tarot\.html'/g)===1);
pass('Glossário em destaque',searchScript.includes('[1,2,3,4,5,6,14,15,26].includes(index)'));
for(const file of ['cartas-do-tarot.html','guias-para-comecar.html'])pass(`Hub liga glossário: ${file}`,count(read(file),/href="glossario-do-tarot\.html">Glossário<\/a>/g)===1);

const recoveredCards=read('cartas-do-tarot.html').replace('<a href="glossario-do-tarot.html">Glossário</a>','');
pass('Cartas V165 preservado fora do link',sha256(recoveredCards)==='6ed5363e98956cb3142b93d01668793b866a67610b4e238a927b1e2f6314f836',sha256(recoveredCards));
const recoveredGuides=read('guias-para-comecar.html').replace('<a href="glossario-do-tarot.html">Glossário</a>','');
pass('Guias V165 preservado fora do link',sha256(recoveredGuides)==='4864c413f7f6935fd22bd1cf36a3185b2dacb6c67ead90233d04238520593baf',sha256(recoveredGuides));
const recoveredSearchHtml=searchHtml.replace('<a href="glossario-do-tarot.html">Glossário</a>','').replace('118 CAMINHOS · UMA BUSCA','117 CAMINHOS · UMA BUSCA').replace('busca-v165.js?v=166','busca-v165.js?v=165');
pass('Busca V165 preservada fora da integração',sha256(recoveredSearchHtml)==='2bfddaf204d15a37bd590afb13b956bfe55fe689b0b95b9085773fe04b396408',sha256(recoveredSearchHtml));
const glossaryIndexLine="  ['Glossário do Tarot', 'glossario-do-tarot.html', '62 termos', 'aprender', 'Definições claras sobre cartas, naipes, tiragens, símbolos e leitura responsável. arcano arquétipo autonomia baralho cartomancia consentimento consulente contexto correspondência desafio elemento energia figura da corte intenção interpretação intuição leitura luz tensão método oráculo orientação direta pergunta aberta posição previsão querente reciprocidade repetição significado símbolo síntese tendência'],\n";
const recoveredSearchScript=searchScript.replace(glossaryIndexLine,'').replace('[1,2,3,4,5,6,14,15,26].includes(index)','[1,2,3,4,5,6,14,15].includes(index)');
pass('Motor de busca V165 preservado',sha256(recoveredSearchScript)==='55fa63b35f6ee8177d782c76ee5f894457fed399c14e5d3e6185390adc467054',sha256(recoveredSearchScript));

const sitemap=read('sitemap.xml');
pass('Sitemap com 119 URLs',count(sitemap,/<url>/g)===119);
pass('Sitemap mantém 78 imagens',count(sitemap,/<image:image>/g)===78);
pass('Glossário único no sitemap',count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/glossario-do-tarot\.html<\/loc>/g)===1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(m=>m[1]);
pass('URLs de página únicas',pageLocs.length===119&&new Set(pageLocs).size===119,`${pageLocs.length}/${new Set(pageLocs).size}`);
const recoveredSitemap=sitemap.replace('  <url>\n    <loc>https://divinabruxa.com.br/glossario-do-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n','');
pass('Sitemap V165 preservado',sha256(recoveredSitemap)==='cbae2423132fe14fcce953af8660ee5c2a4c448a81a07b8ab0b57a84261fe6b0',sha256(recoveredSitemap));

const contract=JSON.parse(read('GLOSSARIO-TAROT-V166.json'));
pass('Contrato V166',contract.schemaVersion==='166.0.0');
pass('Contrato 62 termos',contract.glossary?.definedTerms===62&&contract.glossary?.activeLetters===17);
pass('Contrato filtro local',contract.glossary?.filterRunsLocally===true&&contract.glossary?.filterTextStored===false&&contract.glossary?.filterTextTransmitted===false);
pass('Contrato limites',Object.values(contract.responsibleDefinitions||{}).every(value=>value===false));
pass('Contrato busca 118',contract.searchIntegration?.indexedDestinationsAfter===118&&Object.values(contract.searchIntegration?.categoryCounts||{}).reduce((a,b)=>a+b,0)===118);
pass('Contrato sitemap 119',contract.discoverability?.sitemapUrlsAfter===119&&contract.discoverability?.sitemapImageEntries===78);
pass('Contrato Tarot Livre',contract.safeguards?.tarotLivreChanged===false&&contract.safeguards?.tarotLivreCards===78);
pass('Contrato consultas',JSON.stringify(contract.safeguards?.consultationPricesBrl)===JSON.stringify([250,150,100,50])&&contract.safeguards?.consultationEmailRequired===true);
pass('Contrato doze arquivos',contract.installation?.filesInPackage===12);

const manifest=new Map();
for(const line of read('ARQUIVOS-V166-SHA256.txt').trim().split(/\r?\n/)){const match=line.match(/^([a-f0-9]{64})  (.+)$/);if(match)manifest.set(match[2],match[1]);}
const hashed=required.filter(file=>file!=='ARQUIVOS-V166-SHA256.txt');
pass('Manifesto onze hashes',manifest.size===11,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','tiragens-de-tarot.html':'ce6268945e0a839a07f124d035d64df040d60495241364c628c6db24885d07e0','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','busca-v165.css':'7af9c88c6ceb1e695c368d67c6789020df964986ec197fb693b95f6bb9af7f48','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(value=>!/^(https?:|mailto:|tel:|#|data:)/.test(value))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino do glossário: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=166`);
  let source=searchScript.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[],normalize=data.normalize||String;
  pass('Índice possui 118 destinos',entries.length===118,`${entries.length}`);
  pass('Índice possui 118 URLs únicas',new Set(entries.map(x=>x.url)).size===118);
  pass('Índice liga o glossário',entries.some(x=>x.url==='glossario-do-tarot.html'&&x.featured));
  const find=query=>{const tokens=normalize(query).split(' ').filter(Boolean);return entries.filter(entry=>tokens.every(token=>entry.searchable.includes(token)||normalize(entry.title).includes(token)));};
  pass('Busca encontra arquétipo',find('arquetipo').some(x=>x.url==='glossario-do-tarot.html'));
  pass('Busca encontra carta',find('A Lua').some(x=>x.title==='A Lua'));
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(value=>consult.includes(value)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}

const result={suite:'DIVINA-BRUXA-V166-GLOSSARIO-DO-TAROT',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
