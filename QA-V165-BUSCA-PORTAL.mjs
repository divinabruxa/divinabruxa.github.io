import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || process.cwd());
const checks = [], failures = [];
const pass = (name, condition, detail = '') => { checks.push(Boolean(condition)); if (!condition) failures.push(detail ? `${name}: ${detail}` : name); };
const filePath = name => path.join(root, name);
const exists = name => fs.existsSync(filePath(name)) && fs.statSync(filePath(name)).isFile();
const read = name => fs.readFileSync(filePath(name), 'utf8');
const bytes = name => fs.readFileSync(filePath(name));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, expression) => [...value.matchAll(expression)].length;
const esc = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const required = ['sitemap.xml','404.html','cartas-do-tarot.html','tiragens-de-tarot.html','guias-para-comecar.html','buscar.html','busca-v165.css','busca-v165.js','00-LEIA-PRIMEIRO-V165-BUSCA-COMPLETA-DO-PORTAL.txt','BUSCA-PORTAL-V165.json','QA-V165-BUSCA-PORTAL.mjs','ARQUIVOS-V165-SHA256.txt'];
for (const file of required) pass(`Arquivo presente: ${file}`, exists(file));
if (failures.length) { console.error(JSON.stringify({suite:'DIVINA-BRUXA-V165-BUSCA-PORTAL',status:'FAIL',failures},null,2)); process.exit(1); }

const html = read('buscar.html');
const css = read('busca-v165.css');
const script = read('busca-v165.js');
const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
pass('Título exato', title === 'Buscar cartas e conteúdos de Tarot | Divina Bruxa');
pass('Título adequado', title.length >= 35 && title.length <= 65, `${title.length}`);
pass('Descrição adequada', description.length >= 120 && description.length <= 165, `${description.length}`);
pass('Canonical', html.includes('<link rel="canonical" href="https://divinabruxa.com.br/buscar.html">'));
pass('Robots', html.includes('index,follow,max-image-preview:large'));
pass('Idioma', html.includes('<html lang="pt-BR">'));
pass('H1 único', count(html,/<h1(?:\s|>)/g) === 1);
pass('Main único', count(html,/<main\b[^>]*id="conteudo"/g) === 1);
pass('Skip link', html.includes('<a class="skip-link" href="#conteudo">'));
pass('Formulário de busca', html.includes('<form class="oracle-search" role="search"'));
pass('Rótulo visível', html.includes('<label for="busca">Buscar no portal</label>'));
pass('Input nativo', html.includes('id="busca" name="q" type="search"'));
pass('Contagem viva', html.includes('aria-live="polite" aria-atomic="true"'));
pass('Cinco filtros', count(html,/data-filter="(?:todos|cartas|tiragens|aprender|portal)"/g) === 5);
pass('Estado dos filtros', count(html,/aria-pressed="(?:true|false)" data-filter=/g) === 5);
pass('Estado vazio', html.includes('data-search-empty hidden'));
pass('Fallback sem JavaScript', html.includes('<noscript>'));
pass('Aviso de privacidade', html.includes('Busca privada e local') && html.includes('não recebe nem armazena suas buscas'));
pass('CSS do portal', html.includes('seo-portal-v154.css?v=154'));
pass('CSS da busca', html.includes('busca-v165.css?v=165'));
pass('Módulo da busca', html.includes('<script type="module" src="busca-v165.js?v=165"></script>'));
pass('Sem imagem social', !/property="og:image"/.test(html));
pass('Sem nome pessoal', !/\b[ií]sis\b/i.test(html));
for (const tag of ['header','nav','main','section','footer','form']) pass(`Tags ${tag}`, count(html,new RegExp(`<${tag}(?:\\s|>)`,'g')) === count(html,new RegExp(`</${tag}>`,'g')));
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
pass('IDs únicos', ids.length === new Set(ids).size);
for (const m of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of m[1].split(/\s+/)) pass(`ARIA encontra ${id}`, ids.includes(id));
let graph=[]; try { graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'{}')['@graph']||[]; pass('JSON-LD válido',true); } catch(error) { pass('JSON-LD válido',false,error.message); }
for (const type of ['Organization','WebSite','BreadcrumbList','CollectionPage']) pass(`JSON-LD ${type}`, graph.some(x=>x['@type']===type));
pass('CollectionPage correta', graph.some(x=>x['@type']==='CollectionPage' && x.url==='https://divinabruxa.com.br/buscar.html'));

pass('JavaScript sintaticamente preparado', script.includes("import { CARDS } from './tarot-data.js';"));
pass('Catálogo canônico reutilizado', script.includes('...CARDS.map(card =>'));
pass('Normalização Unicode', script.includes(".normalize('NFD')") && script.includes('/[\\u0300-\\u036f]/g'));
pass('Resultado criado com DOM seguro', script.includes("document.createElement('a')") && script.includes('title.textContent = entry.title'));
pass('Sem HTML injetado', !/innerHTML\s*=|insertAdjacentHTML|document\.write/.test(script));
pass('Sem transmissão externa', !/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(script));
pass('Sem armazenamento', !/localStorage|sessionStorage|indexedDB|document\.cookie/.test(script));
pass('Consulta no fragmento', script.includes("url.hash = query ? `q=${encodeURIComponent(query)}` : ''") && script.includes('window.location.hash.slice(1)'));
pass('Atalho de barra', script.includes("event.key === '/'"));
pass('Escape limpa', script.includes("event.key === 'Escape'"));
pass('CSS responsivo', css.includes('@media (max-width: 700px)') && css.includes('grid-template-columns: 1fr'));
pass('Movimento reduzido', css.includes('@media (prefers-reduced-motion: reduce)'));
pass('Texto utilizável', css.includes('font: 500 1rem/1.4'));
pass('Foco visível', css.includes(':focus-visible'));

const pageSource = script.match(/const PAGES = Object\.freeze\(\[([\s\S]*?)\n\]\);/)?.[1] || '';
pass('39 páginas declaradas', count(pageSource,/^  \['/gm) === 39, `${count(pageSource,/^  \['/gm)}`);
for (const term of ['Carta do Dia','Tarot Livre','Tiragens de Tarot','Escola do Tarot','Consultas de Tarot','Caminho em Cinco','Mandala Astrológica','Árvore da Vida','Mesa Personalizada']) pass(`Índice contém ${term}`, pageSource.includes(`'${term}'`));

const hubs = ['cartas-do-tarot.html','tiragens-de-tarot.html','guias-para-comecar.html'];
for (const file of hubs) pass(`Link da busca em ${file}`, count(read(file),/href="buscar\.html">Buscar<\/a>/g) === 1);
const notFound = read('404.html');
pass('404 liga busca', count(notFound,/href="\.\/buscar\.html">Buscar no portal<\/a>/g) === 1);
pass('404 liga Tarot Livre diretamente', notFound.includes('href="./tarot-livre.html">Abrir Tarot Livre</a>'));

const recoveries = {
  'cartas-do-tarot.html': ['<a href="buscar.html">Buscar</a>', '647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede'],
  'tiragens-de-tarot.html': ['<a href="buscar.html">Buscar</a>', 'a2f27f947cdd1a1200ddf22d000c508ab9e7d439df4ac2625bcd0189cfeba562'],
  'guias-para-comecar.html': ['<a href="buscar.html">Buscar</a>', 'c9f410da98667737e1fc4b5f175ce11188aecc4fc2697cbb69f36d2020fe8529']
};
for (const [file,[addition,baseline]] of Object.entries(recoveries)) pass(`${file} preservado fora do link`, sha256(read(file).replace(addition,'')) === baseline, sha256(read(file).replace(addition,'')));
const recovered404 = notFound
  .replace('Este caminho se perdeu no universo da Divina Bruxa. Use a busca para encontrar cartas, tiragens e guias de Tarot.','Este caminho se perdeu no universo da Divina Bruxa.')
  .replace('O caminho que você procurou atravessou um portal vazio. Volte à origem, abra o Tarot Livre ou busque outra página.','O caminho que você procurou atravessou um portal vazio. Volte à origem ou desperte uma nova jornada.')
  .replace('<div class="actions"><a href="./index.html">Voltar para a Orbe</a><a class="secondary" href="./buscar.html">Buscar no portal</a><a class="secondary" href="./tarot-livre.html">Abrir Tarot Livre</a></div>','<div class="actions"><a href="./index.html">Voltar para a Orbe</a><a class="secondary" href="./index.html#tarot">Abrir Tarot Livre</a></div>');
pass('404 V164 preservado fora da melhoria', sha256(recovered404) === '29cba84f4a9e176faaad58fe76c69b266ed8bc4e64db7545926f8dbef65b7302', sha256(recovered404));

const sitemap = read('sitemap.xml');
pass('Sitemap com 118 URLs', count(sitemap,/<url>/g) === 118);
pass('Sitemap mantém 78 imagens', count(sitemap,/<image:image>/g) === 78);
pass('Busca única no sitemap', count(sitemap,/<loc>https:\/\/divinabruxa\.com\.br\/buscar\.html<\/loc>/g) === 1);
const pageLocs=[...sitemap.matchAll(/<loc>(https:\/\/divinabruxa\.com\.br\/(?![^<]+\.(?:webp|png|jpe?g|svg))[^<]*)<\/loc>/g)].map(m=>m[1]);
pass('URLs de página únicas', pageLocs.length === 118 && new Set(pageLocs).size === 118, `${pageLocs.length}/${new Set(pageLocs).size}`);
let recoveredSitemap=sitemap
  .replace('    <loc>https://divinabruxa.com.br/cartas-do-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>','    <loc>https://divinabruxa.com.br/cartas-do-tarot.html</loc>\n    <lastmod>2026-09-06</lastmod>')
  .replace('    <loc>https://divinabruxa.com.br/tiragens-de-tarot.html</loc>\n    <lastmod>2026-09-07</lastmod>','    <loc>https://divinabruxa.com.br/tiragens-de-tarot.html</loc>\n    <lastmod>2026-09-06</lastmod>')
  .replace('    <loc>https://divinabruxa.com.br/guias-para-comecar.html</loc>\n    <lastmod>2026-09-07</lastmod>','    <loc>https://divinabruxa.com.br/guias-para-comecar.html</loc>\n    <lastmod>2026-09-06</lastmod>')
  .replace('  <url>\n    <loc>https://divinabruxa.com.br/buscar.html</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n','');
pass('Sitemap V164 preservado', sha256(recoveredSitemap) === '1f3361eb236c135deb526c9f71daea46a8e7bcbee2374fe9783bfd194b890808', sha256(recoveredSitemap));

const contract=JSON.parse(read('BUSCA-PORTAL-V165.json'));
pass('Contrato V165', contract.schemaVersion === '165.0.0');
pass('Contrato 117 destinos', contract.search?.indexedDestinations === 117 && contract.search?.uniqueDestinations === 117);
pass('Contrato 78 cartas e 39 páginas', contract.search?.cards === 78 && contract.search?.portalPages === 39);
pass('Contrato categorias', Object.values(contract.search?.categories || {}).reduce((a,b)=>a+b,0) === 117);
pass('Contrato busca local', contract.search?.externalSearchService === false && contract.search?.searchTextStored === false && contract.search?.searchTextTransmitted === false);
pass('Contrato 118 URLs', contract.integration?.sitemapUrlsAfter === 118 && contract.integration?.sitemapImageEntries === 78);
pass('Contrato Tarot Livre', contract.safeguards?.tarotLivreChanged === false && contract.safeguards?.tarotLivreCards === 78);
pass('Contrato consultas', JSON.stringify(contract.safeguards?.consultationPricesBrl) === JSON.stringify([250,150,100,50]) && contract.safeguards?.consultationEmailRequired === true);
pass('Contrato doze arquivos', contract.installation?.filesInPackage === 12);

const manifest=new Map();
for(const line of read('ARQUIVOS-V165-SHA256.txt').trim().split(/\r?\n/)){const m=line.match(/^([a-f0-9]{64})  (.+)$/);if(m)manifest.set(m[2],m[1]);}
const hashed=required.filter(x=>x!=='ARQUIVOS-V165-SHA256.txt');
pass('Manifesto onze hashes',manifest.size===11,`${manifest.size}`);
for(const file of hashed)pass(`Hash ${file}`,manifest.get(file)===sha256(bytes(file)));

const stable={
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050','tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3','fallback-shell-v1.css':'e89270368ba9997ce06b7f31f278532f7dae2e4363f850dad9861d204485fd4f'
};
const full=Object.keys(stable).every(exists);
if(full){
  for(const [file,hash] of Object.entries(stable))pass(`Crítico preservado: ${file}`,sha256(bytes(file))===hash);
  for(const ref of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(x=>!/^(https?:|mailto:|tel:|#|data:)/.test(x))){const clean=ref.split(/[?#]/)[0].replace(/^\.\//,'')||'index.html';pass(`Destino da busca: ${ref}`,exists(clean));}
  const {CARDS}=await import(`${pathToFileURL(filePath('tarot-data.js')).href}?qa=165`);
  let source=script.replace(/^import[^\n]+\n/,'');source=source.slice(0,source.indexOf('const form ='));
  let data={};try{data=new Function('CARDS',`${source};return {PAGES,entries,normalize};`)(CARDS);pass('Índice executa',true);}catch(error){pass('Índice executa',false,error.message);}
  const entries=data.entries||[];
  pass('Catálogo possui 78 cartas',CARDS.length===78);
  pass('Índice possui 117 destinos',entries.length===117,`${entries.length}`);
  pass('Índice possui 117 URLs únicas',new Set(entries.map(x=>x.url)).size===117);
  pass('Índice sem campos vazios',entries.every(x=>x.title&&x.url&&x.description&&x.searchable));
  for(const entry of entries){const target=entry.url==='./'?'index.html':entry.url;pass(`Resultado existe: ${entry.url}`,exists(target));}
  const normalize=data.normalize||String;
  const find=q=>{const tokens=normalize(q).split(' ').filter(Boolean);return entries.filter(x=>tokens.every(t=>x.searchable.includes(t)||normalize(x.title).includes(t)));};
  pass('Busca A Lua',find('A Lua').some(x=>x.title==='A Lua'));
  pass('Busca sem acento',find('arvore da vida').some(x=>x.title==='Árvore da Vida'));
  pass('Busca amor',find('amor').some(x=>x.title==='Tarot do Amor'));
  pass('Busca emprego',find('emprego').some(x=>x.title==='Tarot para Trabalho'));
  pass('Busca em inglês',find('pentacles').length===14,`${find('pentacles').length}`);
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(x=>consult.includes(x)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}

const result={suite:'DIVINA-BRUXA-V165-BUSCA-PORTAL',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2));if(failures.length)process.exit(1);
