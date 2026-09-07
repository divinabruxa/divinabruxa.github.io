import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(process.argv[2] || '.');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const tests = [];
const check = (name, pass, detail = '') => tests.push({ name, pass: Boolean(pass), detail });
const count = (text, pattern) => (text.match(pattern) || []).length;

const files = [
  'sitemap.xml','buscar.html','busca-v165.js','como-escolher-um-baralho-de-tarot.html',
  'como-embaralhar-cartas-de-tarot.html','guias-para-comecar.html','escola-do-tarot.html',
  'como-limpar-consagrar-baralho-de-tarot.html','cuidar-baralho-tarot-v174.css',
  'cuidar-baralho-tarot-v174.js','00-LEIA-PRIMEIRO-V174-CUIDAR-BARALHO-TAROT.txt',
  'CUIDAR-BARALHO-TAROT-V174.json','QA-V174-CUIDAR-BARALHO-TAROT.mjs','ARQUIVOS-V174-SHA256.txt'
];
for (const file of files) check(`arquivo presente: ${file}`, exists(file));

const html = read('como-limpar-consagrar-baralho-de-tarot.html');
const css = read('cuidar-baralho-tarot-v174.css');
const js = read('cuidar-baralho-tarot-v174.js');
const searchPage = read('buscar.html');
const searchJs = read('busca-v165.js');
const sitemap = read('sitemap.xml');
const contract = JSON.parse(read('CUIDAR-BARALHO-TAROT-V174.json'));
const fullProject = exists('index.html') && exists('tarot-livre.html');

check('doctype', /^<!doctype html>/i.test(html));
check('idioma pt-BR', /<html lang="pt-BR">/.test(html));
check('viewport', /viewport-fit=cover/.test(html));
check('título exclusivo', /<title>Como limpar e consagrar um baralho de Tarot \| Divina Bruxa<\/title>/.test(html));
check('description útil', /<meta name="description" content="[^"]{120,}/.test(html));
check('canonical', /rel="canonical" href="https:\/\/divinabruxa\.com\.br\/como-limpar-consagrar-baralho-de-tarot\.html"/.test(html));
check('robots index', /index,follow,max-image-preview:large/.test(html));
check('css comum', /seo-portal-v154\.css\?v=154/.test(html));
check('css V174', /cuidar-baralho-tarot-v174\.css\?v=174/.test(html));
check('js V174', /cuidar-baralho-tarot-v174\.js\?v=174/.test(html));
check('sem og:image novo', !/property="og:image"/.test(html));
check('um h1', count(html, /<h1\b/g) === 1);
check('skip link', /class="skip-link" href="#conteudo"/.test(html));
check('main identificável', /<main id="conteudo"/.test(html));
check('imagem existente dimensionada', /src="tarot-atlas\.webp" width="3000" height="3600"/.test(html));
check('alt descritivo', /alt="Mosaico contemporâneo das 78 cartas/.test(html));
check('sem nome pessoal', !/\bÍsis\b|\bIsis\b/.test(html));

for (const id of ['orientador','diferencas','sequencia','evite','guardar','faq','fontes']) check(`seção #${id}`, html.includes(`id="${id}"`));
check('dois fieldsets', count(html, /<fieldset>/g) === 2);
check('dois legends', count(html, /<legend>/g) === 2);
check('cinco radios', count(html, /type="radio"/g) === 5);
check('grupos obrigatórios', count(html, /type="radio"[^>]+required/g) === 2);
check('resultado live', /data-care-result[^>]+aria-live="polite"/.test(html));
check('status de cópia live', /data-care-status[^>]+role="status"[^>]+aria-live="polite"/.test(html));
check('fallback noscript', /<noscript>/.test(html));
check('privacidade explícita', /Privado por construção/.test(html));
check('nada salvo', /não são guardadas/.test(html));

const differencesBlock = html.match(/class="difference-grid"[\s\S]*?<\/div>/)?.[0] || '';
const sequenceBlock = html.match(/class="care-sequence"[\s\S]*?<\/ol>/)?.[0] || '';
const avoidBlock = html.match(/class="avoid-grid"[\s\S]*?<\/div>/)?.[0] || '';
const ritualBlock = html.match(/class="content-section ritual-section"[\s\S]*?<\/section>/)?.[0] || '';
const storageBlock = html.match(/class="storage-list"[\s\S]*?<\/ul>/)?.[0] || '';
check('três diferenças', count(differencesBlock, /<article>/g) === 3);
check('cinco passos', count(sequenceBlock, /<li>/g) === 5);
check('seis riscos', count(avoidBlock, /<article>/g) === 6);
check('quatro alternativas simbólicas', count(ritualBlock, /<article>/g) === 4);
check('oito cuidados de guarda', count(storageBlock, /<li>/g) === 8);
check('seis FAQs visíveis', count(html, /<details>/g) === 6);
check('três fontes visíveis', count(html.match(/class="source-list"[\s\S]*?<\/ol>/)?.[0] || '', /<li>/g) === 3);
check('aviso de mofo', /Mofo ativo pode afetar a saúde/.test(html));

for (const risk of ['Sol direto','Água e umidade','Fumaça e cinzas','Sal e cristais','Óleos, álcool e perfumes','Calor e pressão']) check(`risco: ${risk}`, html.includes(risk));
for (const idea of ['Cuidado físico','Ritual simbólico','Guarda']) check(`diferença: ${idea}`, html.includes(idea));
for (const url of ['https://www.loc.gov/preservation/care/paper.html','https://siarchives.si.edu/what-we-do/forums/collections-care-guidelines-resources/how-do-i-keep-old-family-papers-preserved','https://www.loc.gov/preservation/care/light.html']) check(`fonte: ${url}`, html.includes(url));

const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
check('JSON-LD presente', jsonMatch);
let graph = [];
try { graph = JSON.parse(jsonMatch[1])['@graph']; check('JSON-LD válido', Array.isArray(graph)); } catch { check('JSON-LD válido', false); }
for (const type of ['Organization','WebSite','ImageObject','BreadcrumbList','Article','HowTo','FAQPage']) check(`schema ${type}`, graph.some(item => item['@type'] === type));
const howTo = graph.find(item => item['@type'] === 'HowTo') || {};
const faq = graph.find(item => item['@type'] === 'FAQPage') || {};
check('HowTo cinco passos', howTo.step?.length === 5);
check('HowTo dez minutos', howTo.totalTime === 'PT10M');
check('FAQ schema seis perguntas', faq.mainEntity?.length === 6);
check('Article gratuito', graph.find(item => item['@type'] === 'Article')?.isAccessibleForFree === true);

try { execFileSync(process.execPath, ['--check', path.join(root,'cuidar-baralho-tarot-v174.js')], {stdio:'pipe'}); check('sintaxe JS do guia', true); } catch { check('sintaxe JS do guia', false); }
try { execFileSync(process.execPath, ['--check', path.join(root,'busca-v165.js')], {stdio:'pipe'}); check('sintaxe JS da busca', true); } catch { check('sintaxe JS da busca', false); }
for (const token of ["novo:","entre:","guardar:","short:","long:","navigator.clipboard.writeText","document.execCommand('copy')","FormData(form)"]) check(`JS contém ${token}`, js.includes(token));
for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket', 'localStorage', 'sessionStorage', 'document.cookie']) check(`JS sem ${forbidden}`, !js.includes(forbidden));
check('três objetivos JS', count(js, /^    (novo|entre|guardar):/gm) === 3);
check('seis listas de rotina', count(js, /      (short|long): \[/g) === 6);
check('reset esconde resultado', /result\.hidden = true/.test(js));
check('resultado mostra', /result\.hidden = false/.test(js));

for (const token of ['@media (max-width:860px)','@media (max-width:560px)','@media (prefers-reduced-motion:reduce)','@media print','grid-template-columns:1fr','font-size:15px']) check(`CSS contém ${token}`, css.includes(token));
check('controles com foco', /input:focus-visible\+span/.test(css));
check('corpo mínimo legível no componente', /font-size:16px/.test(css));

check('busca chama V174', /busca-v165\.js\?v=174/.test(searchPage));
check('entrada única na busca', count(searchJs, /como-limpar-consagrar-baralho-de-tarot\.html/g) === 1);
check('guia em destaque', /,34\]\.includes\(index\)/.test(searchJs));
const pageRows = count(searchJs, /^  \['/gm);
check('48 páginas editoriais', pageRows === 48, String(pageRows));
check('126 destinos pesquisáveis', 78 + pageRows === 126, String(78 + pageRows));
for (const query of ['como limpar baralho','consagrar tarot','guardar cartas','incenso','outra pessoa tocar']) {
  const words = query.split(' ');
  const row = searchJs.split('\n').find(line => line.includes('como-limpar-consagrar-baralho-de-tarot.html')) || '';
  check(`busca encontra: ${query}`, words.every(word => row.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(word)));
}

check('127 URLs no sitemap', count(sitemap, /<url>/g) === 127, String(count(sitemap, /<url>/g)));
check('78 imagens no sitemap', count(sitemap, /<image:image>/g) === 78, String(count(sitemap, /<image:image>/g)));
check('URL nova única no sitemap', count(sitemap, /<loc>https:\/\/divinabruxa\.com\.br\/como-limpar-consagrar-baralho-de-tarot\.html<\/loc>/g) === 1);
check('sitemap fecha corretamente', /<\/urlset>\s*$/.test(sitemap));

for (const file of ['como-escolher-um-baralho-de-tarot.html','como-embaralhar-cartas-de-tarot.html','guias-para-comecar.html','escola-do-tarot.html']) {
  check(`link integrado em ${file}`, count(read(file), /como-limpar-consagrar-baralho-de-tarot\.html/g) === 1);
}

check('contrato versão', contract.schemaVersion === '174.0.0');
check('contrato 14 arquivos', contract.installation.filesInPackage === 14);
check('contrato 7 substituições', contract.installation.replace.length === 7);
check('contrato 7 adições', contract.installation.add.length === 7);
check('contrato 6 rotinas', contract.guide.routineCombinations === 6);
check('contrato busca 126', contract.searchIntegration.indexedDestinationsAfter === 126);
check('contrato sitemap 127', contract.discoverability.sitemapUrlsAfter === 127);
check('contrato e-mail obrigatório', contract.safeguards.consultationEmailRequired === true);
check('contrato preços', JSON.stringify(contract.safeguards.consultationPricesBrl) === '[250,150,100,50]');
check('contrato sem cobrança real', contract.safeguards.realBillingEnabled === false);
check('contrato Resend adiado', contract.safeguards.resendConfigured === false);

const manifestLines = read('ARQUIVOS-V174-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
check('manifesto com 13 arquivos verificáveis', manifestLines.length === 13, String(manifestLines.length));
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`linha de manifesto válida: ${line.slice(-34)}`, match);
  if (match) check(`hash correto: ${match[2]}`, exists(match[2]) && sha(fs.readFileSync(path.join(root,match[2]))) === match[1]);
}

const stable = {
  'sitemap.xml':'247d3f1d7a3086a9aa16b3eb2fc71f7b851ff1e5c60193dd0b7ecb93817b6d55',
  'buscar.html':'7f08b3ea927087eeed66034b06e24d5ab21b1b9843604cd97aab7f3dda05052f',
  'busca-v165.js':'686cf1ab4f73449a188996a279b7bdd98e7955c3833005ac50b5c96b56d29ae3',
  'como-escolher-um-baralho-de-tarot.html':'3817047b99b688e7a0c9cb77443837e68aac864d0772227b2a02ff4e211b3f7b',
  'como-embaralhar-cartas-de-tarot.html':'82cde049f2be70c4d78e80d1f526c174632a015643cd80463688b64ae6565714',
  'guias-para-comecar.html':'c68623bdea394e7019780c82e5c0ffb3eb720677c9c921ec8723f94eddbee9e4',
  'escola-do-tarot.html':'dd3c876607de0fc32dedbe963dc5cbb34f1e535cfc75dee6bccb19e477cd4826',
  'como-limpar-consagrar-baralho-de-tarot.html':'609041016c5f66a7df9caf97da4f5b5b101b1628e686d6e23203dd7dd6312cc2',
  'cuidar-baralho-tarot-v174.css':'fb78f44d24484f5e59dd35eaafd37e9bb7561dd470d8858a81ff9dd79b44e638',
  'cuidar-baralho-tarot-v174.js':'60eab2eb4791615ad66b533b3f47a3a8af3138bf4102b20bf484ca7ec1c43aa7'
};
for (const [file,expected] of Object.entries(stable)) check(`hash estável: ${file}`, sha(fs.readFileSync(path.join(root,file))) === expected);

if (fullProject) {
  const index = read('index.html');
  const consultation = read('consultas-de-tarot.html');
  check('home mantém 78 cartas sem repetição', /78 cartas sem repetição/i.test(index));
  check('home mantém mesa 13 × 6', /13 fileiras de 6/i.test(index));
  check('home mantém cartas diretas', /DIRETA · SEM SIGNIFICADO/.test(index));
  for (const price of ['R$ 250','R$ 150','R$ 100','R$ 50']) check(`consulta mantém ${price}`, index.includes(price) && consultation.includes(price));
  check('consulta exige e-mail no conteúdo', /e-mail (?:é )?obrigatório/i.test(consultation));
  check('e-mail proprietário preservado', [...fs.readdirSync(root).filter(f => /consult|index|admin/i.test(f) && /\.(html|js|json)$/.test(f)).map(read)].join('\n').includes('orbedasrealidades@hotmail.com'));
  check('78 imagens oficiais presentes', fs.readdirSync(root).filter(file => /^card-[a-z0-9-]+\.webp$/.test(file)).length >= 78);
}

const failed = tests.filter(test => !test.pass);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-V174-CUIDAR-BARALHO-TAROT',status:failed.length?'FAIL':'PASS',mode:fullProject?'full-project':'release-package',root,total:tests.length,passed:tests.length-failed.length,failed},null,2));
process.exitCode = failed.length ? 1 : 0;
