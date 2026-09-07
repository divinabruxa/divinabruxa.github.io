import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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

const required = ['sitemap.xml','tiragens-de-tarot.html','tiragem-caminho-em-cinco.html','mandala-astrologica-no-tarot.html','arvore-da-vida-no-tarot.html','mesa-personalizada-no-tarot.html','00-LEIA-PRIMEIRO-V164-BIBLIOTECA-TIRAGENS-COMPLETA.txt','BIBLIOTECA-TIRAGENS-V164.json','QA-V164-BIBLIOTECA-TIRAGENS.mjs','ARQUIVOS-V164-SHA256.txt'];
for (const file of required) pass(`Arquivo presente: ${file}`, exists(file));
if (failures.length) { console.error(JSON.stringify({suite:'DIVINA-BRUXA-V164-BIBLIOTECA-TIRAGENS',status:'FAIL',failures},null,2)); process.exit(1); }

const pages = [
  {file:'tiragem-caminho-em-cinco.html',title:'Caminho em Cinco: tiragem de Tarot com 5 cartas | Divina Bruxa',canonical:'https://divinabruxa.com.br/tiragem-caminho-em-cinco.html',image:'card-07.webp',positions:['Centro da questão','O que favorece','O que desafia','O que pede consciência','Próximo passo']},
  {file:'mandala-astrologica-no-tarot.html',title:'Mandala Astrológica no Tarot: as 12 posições | Divina Bruxa',canonical:'https://divinabruxa.com.br/mandala-astrologica-no-tarot.html',image:'templo-tiragens-celestial-v1.webp',positions:['Identidade','Recursos','Comunicação','Raízes','Criação','Rotina','Relacionamentos','Transformação','Expansão','Vocação','Comunidade','Mundo interior']},
  {file:'arvore-da-vida-no-tarot.html',title:'Árvore da Vida no Tarot: as 10 posições | Divina Bruxa',canonical:'https://divinabruxa.com.br/arvore-da-vida-no-tarot.html',image:'card-21.webp',positions:['Coroa','Sabedoria','Entendimento','Misericórdia','Força','Beleza','Vitória','Esplendor','Fundamento','Manifestação']},
  {file:'mesa-personalizada-no-tarot.html',title:'Mesa Personalizada no Tarot: de 1 a 12 cartas | Divina Bruxa',canonical:'https://divinabruxa.com.br/mesa-personalizada-no-tarot.html',image:'card-10.webp',positions:['Centro da questão','Origem','Influência interior','Influência exterior','Desafio','Recurso disponível','O que pede consciência','O que ganha força','O que perde força','Próximo passo','Tendência','Síntese']}
];
const coreLinks = ['tarot-livre.html','carta-do-dia.html','tiragens-de-tarot.html','escola-do-tarot.html','consultas-de-tarot.html','cartas-do-tarot.html'];
const legalLinks = ['sobre-a-divina-bruxa.html','metodologia-do-tarot.html','etica-e-responsabilidade.html','privacidade-e-dados.html','termos-de-uso.html','acessibilidade.html','contato.html'];
const parsed = new Map(), titles = [], descriptions = [];
for (const page of pages) {
  const html = read(page.file); parsed.set(page.file, html);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
  titles.push(title); descriptions.push(description);
  pass(`Título exato: ${page.file}`, title === page.title);
  pass(`Título adequado: ${page.file}`, title.length >= 35 && title.length <= 65, `${title.length}`);
  pass(`Descrição adequada: ${page.file}`, description.length >= 120 && description.length <= 165, `${description.length}`);
  pass(`Canonical: ${page.file}`, html.includes(`<link rel="canonical" href="${page.canonical}">`));
  pass(`Robots: ${page.file}`, html.includes('index,follow,max-image-preview:large'));
  pass(`H1 único: ${page.file}`, count(html, /<h1(?:\s|>)/g) === 1);
  pass(`Main: ${page.file}`, count(html, /<main\b[^>]*id="conteudo"/g) === 1);
  pass(`Skip link: ${page.file}`, html.includes('<a class="skip-link" href="#conteudo">'));
  pass(`CSS reutilizado: ${page.file}`, count(html, /seo-portal-v154\.css\?v=154/g) === 1);
  pass(`Imagem principal: ${page.file}`, count(html, new RegExp(`<img src="${esc(page.image)}"`, 'g')) === 1);
  pass(`Alt principal: ${page.file}`, new RegExp(`<img src="${esc(page.image)}"[^>]+alt="[^"]{12,}"`).test(html));
  pass(`Sem og:image: ${page.file}`, !/property="og:image"/.test(html));
  pass(`Sem nome pessoal: ${page.file}`, !/\b[ií]sis\b/i.test(html));
  pass(`Sem script executável: ${page.file}`, [...html.matchAll(/<script(?:\s[^>]*)?>/g)].every(m => /application\/ld\+json/.test(m[0])));
  for (const tag of ['article','section','details']) pass(`Tags ${tag}: ${page.file}`, count(html,new RegExp(`<${tag}(?:\\s|>)`,'g')) === count(html,new RegExp(`</${tag}>`,'g')));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  pass(`IDs únicos: ${page.file}`, ids.length === new Set(ids).size);
  for (const m of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of m[1].split(/\s+/)) pass(`ARIA ${page.file}: ${id}`, ids.includes(id));
  let graph = []; try { graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')['@graph'] || []; pass(`JSON-LD: ${page.file}`, true); } catch (error) { pass(`JSON-LD: ${page.file}`, false, error.message); }
  for (const type of ['Organization','WebSite','Article','WebPage','BreadcrumbList','ImageObject']) pass(`${type}: ${page.file}`, graph.some(x => x['@type'] === type));
  pass(`Article URL: ${page.file}`, graph.some(x => x['@type'] === 'Article' && x.url === page.canonical));
  const list = html.match(/<ol class="catalog-grid">([\s\S]*?)<\/ol>/)?.[1] || '';
  pass(`Quantidade de posições: ${page.file}`, count(list, /<li>/g) === page.positions.length);
  for (const [index, position] of page.positions.entries()) pass(`Posição ${index+1} em ${page.file}`, new RegExp(`<li><span>${index+1}<\\/span>[\\s\\S]*?<h3>${esc(position)}<\\/h3>`).test(list));
  for (const href of [...coreLinks,...legalLinks]) pass(`Link ${page.file}: ${href}`, html.includes(`href="${href}"`));
}
pass('Títulos únicos', new Set(titles).size === 4);
pass('Descrições únicas', new Set(descriptions).size === 4);
pass('Rede completa entre guias', pages.every(a => pages.filter(b => b.file !== a.file).every(b => parsed.get(a.file).includes(`href="${b.file}"`))));
pass('Árvore respeita tradição', parsed.get('arvore-da-vida-no-tarot.html').includes('não pretende oferecer uma exposição completa ou definitiva da Cabala'));
pass('Mesa distingue Mesa Real', parsed.get('mesa-personalizada-no-tarot.html').includes('Mesa Personalizada não é Mesa Real'));

const hub = read('tiragens-de-tarot.html');
const sectionMatch = hub.match(/    <section class="related-portals" aria-labelledby="spread-advanced-title">[\s\S]*?<\/section>\n/);
pass('Seção avançada única no hub', count(hub,/id="spread-advanced-title"/g) === 1 && Boolean(sectionMatch));
for (const page of pages) pass(`Hub liga ${page.file}`, count(hub,new RegExp(`href="${esc(page.file)}"`,'g')) === 1);
const recoveredHub = sectionMatch ? hub.replace(sectionMatch[0],'') : hub;
pass('Hub V163 preservado fora da seção', sha256(recoveredHub) === '1f6cd674e64514c752189d428d750d89e1c3f79daf258499b6030859dd14ad9f', sha256(recoveredHub));

const sitemap = read('sitemap.xml');
pass('Sitemap com 117 URLs', count(sitemap,/<url>/g) === 117);
pass('Sitemap mantém 78 imagens', count(sitemap,/<image:image>/g) === 78);
let recoveredSitemap = sitemap;
for (const page of pages) {
  pass(`Sitemap inclui ${page.file}`, count(sitemap,new RegExp(`<loc>${esc(page.canonical)}<\\/loc>`,'g')) === 1);
  recoveredSitemap = recoveredSitemap.replace(`  <url>\n    <loc>${page.canonical}</loc>\n    <lastmod>2026-09-07</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`, '');
}
pass('Sitemap V163 preservado', sha256(recoveredSitemap) === '70ddf8d7590114f3c1f4ddb45010177fda990cb0e8c6467552257f697dd1af78', sha256(recoveredSitemap));

const contract = JSON.parse(read('BIBLIOTECA-TIRAGENS-V164.json'));
pass('Contrato V164', contract.schemaVersion === '164.0.0');
pass('Contrato quatro páginas', contract.publicPages?.length === 4);
pass('Contrato quinze métodos', contract.discoverability?.libraryMethodsTotal === 15);
pass('Contrato 117 URLs', contract.discoverability?.sitemapUrlsAfter === 117);
pass('Contrato preços', JSON.stringify(contract.safeguards?.consultationPricesBrl) === JSON.stringify([250,150,100,50]));
pass('Contrato e-mail obrigatório', contract.safeguards?.consultationEmailRequired === true);
pass('Contrato Tarot Livre', contract.safeguards?.tarotLivreChanged === false && contract.safeguards?.tarotLivreCards === 78);
pass('Contrato dez arquivos', contract.installation?.filesInPackage === 10);

const manifest = new Map();
for (const line of read('ARQUIVOS-V164-SHA256.txt').trim().split(/\r?\n/)) { const m=line.match(/^([a-f0-9]{64})  (.+)$/); if(m) manifest.set(m[2],m[1]); }
const hashed = required.filter(x => x !== 'ARQUIVOS-V164-SHA256.txt');
pass('Manifesto nove hashes', manifest.size === 9, `${manifest.size}`);
for (const file of hashed) pass(`Hash ${file}`, manifest.get(file) === sha256(bytes(file)));

const stable = {
  'index.html':'bcb4271567fed2c4464a7b5f61c6870d9919c25372fb7f669730541a0ec95701','tarot-livre.html':'57067f2daec1b32de96b263f0b584302641b62f46d665eb1b77d1f6879a8bff0','consultas-de-tarot.html':'35e3b5d67906e2239cebef81f7d8d908106cec33f659a5da50f385d43b5de423','carta-do-dia.html':'cfb0271ecef01b85c2c38a4c718bf903f36260f02fca7f9011b9feb6cabc5d9c','escola-do-tarot.html':'c65bf48ce29302497c71596950879677de9d212ba000459467314b36ca58d0df','cartas-do-tarot.html':'647b8ab8c0596f973d14b2cea7b7c8ae0616615de2a6baa92e55be0e89cb8ede','seo-portal-v154.css':'242db2fd8fafa81f4fc8d1d5835e8326f84135ebf9112d7aa899bb67d42f21a6','robots.txt':'7c3865bb831518c95339ee5b454ff5089b032adca24a1b42a432600a2b8f9bcd','spreads-policy.js':'b1c9f71ea5f4c9e0c9b894478a4663af81f5f604310eb4b7b9c316f349deaab0','consultation-policy.js':'e6c04c44e485bc36f9a2b7c37a0e49c25df1f39b044586507da6a66ac77c8cb3','consultation-engine.js':'745ad01c46eaeab52ddb6e12cf18d8cfa115a49b5144c7a75432d23832960050'
};
const full = Object.keys(stable).every(exists);
if (full) {
  for (const [file,hash] of Object.entries(stable)) pass(`Crítico preservado: ${file}`, sha256(bytes(file)) === hash);
  for (const page of pages) for (const ref of [...parsed.get(page.file).matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(x=>!/^(https?:|mailto:|#)/.test(x))) { const clean=ref.split(/[?#]/)[0].replace(/^\.\//,''); pass(`Destino ${page.file}: ${ref}`,exists(clean||'index.html')); }
  const policy=read('spreads-policy.js'); for (const page of pages) for (const position of page.positions) pass(`Política preserva ${position}`,policy.includes(`'${position}'`));
  const free=read('tarot-livre.html'),consult=read('consultas-de-tarot.html');
  pass('Tarot Livre 13 × 6',free.includes('Mesa Real 13 × 6'));
  pass('Tarot Livre direto e sem repetição',free.includes('78 cartas oficiais, sempre diretas e sem repetição'));
  pass('Tarot Livre sem interpretação automática',free.includes('sem uma interpretação automática entre você e a imagem'));
  pass('Consultas preservam preços',['R$ 250','R$ 150','R$ 100','R$ 50'].every(x=>consult.includes(x)));
  pass('Consultas preservam e-mail',consult.includes('Seu e-mail é obrigatório para o contato'));
}
const result={suite:'DIVINA-BRUXA-V164-BIBLIOTECA-TIRAGENS',status:failures.length?'FAIL':'PASS',mode:full?'full-project':'release-package',root,total:checks.length,passed:checks.filter(Boolean).length,failed:failures};
console.log(JSON.stringify(result,null,2)); if(failures.length) process.exit(1);
