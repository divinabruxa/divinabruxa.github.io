import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const exists = file => fs.existsSync(path.join(root, file));
const read = file => exists(file) ? fs.readFileSync(path.join(root, file), 'utf8') : '';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, pattern) => (value.match(pattern) || []).length;
const checks = [];
const check = (name, pass, detail = '') => checks.push({ name, pass: Boolean(pass), ...(detail ? { detail: String(detail) } : {}) });
const syntax = file => { try { execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'ignore' }); return true; } catch { return false; } };
const freshImport = file => import(`${pathToFileURL(path.join(root, file)).href}?qa=${Date.now()}-${Math.random()}`);

const packageFiles = [
  'index.html','app.js','page-loader-v1.js','sw.js','card-library-policy.js','card-library-engine.js',
  'cartas-do-tarot.html','biblioteca-universal-v184.css','biblioteca-universal-v184.js',
  'BIBLIOTECA-UNIVERSAL-V184.json','QA-V184-BIBLIOTECA-UNIVERSAL.mjs',
  '00-LEIA-PRIMEIRO-V184-BIBLIOTECA-UNIVERSAL.txt','ARQUIVOS-V184-SHA256.txt'
];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));
for (const file of ['app.js','page-loader-v1.js','sw.js','card-library-policy.js','card-library-engine.js','biblioteca-universal-v184.js','QA-V184-BIBLIOTECA-UNIVERSAL.mjs']) check(`sintaxe:${file}`, exists(file) && syntax(file));

const index = read('index.html');
const app = read('app.js');
const loader = read('page-loader-v1.js');
const worker = read('sw.js');
const engine = read('card-library-engine.js');
const policySource = read('card-library-policy.js');
const css = read('biblioteca-universal-v184.css');
const libraryPage = read('cartas-do-tarot.html');
const standalone = read('biblioteca-universal-v184.js');
const tarotEngine = read('tarot-engine.js');
const editorial = read('tarot-editorial-policy.js');
const daily = read('daily-policy.js');
const ritual = read('ritual-engine.js');
const consultationPolicy = read('consultation-policy.js');
const consultationEngine = read('consultation-engine.js');
let contract = {};
try { contract = JSON.parse(read('BIBLIOTECA-UNIVERSAL-V184.json')); check('contrato:json-válido', true); } catch { check('contrato:json-válido', false); }

check('ativação:app-v184', /app\.js\?v=184/.test(index));
check('ativação:loader-v184', /page-loader-v1\.js\?v=184/.test(app));
check('ativação:css-v184', /biblioteca-universal-v184\.css\?v=184/.test(index));
check('ativação:loader-biblioteca-v184', /card-library-engine\.js\?v=184/.test(loader));
check('ativação:conteúdo-profundo-v184', /tarot-meanings\.js\?v=184/.test(loader));
check('ativação:seção-universal', /BIBLIOTECA UNIVERSAL DAS 78 CARTAS/.test(index));
check('ativação:busca-trilíngue-declarada', /português, inglês ou espanhol/.test(index));
check('ativação:sw-v54', /divina-bruxa-v54-library-v184/.test(worker));

check('motor:sete-caminhos', count(engine, /data-library-path=/g) === 7);
check('motor:busca', /data-library-query/.test(engine));
for (const filter of ['arcana','suit','element','kind']) check(`motor:filtro:${filter}`, new RegExp(`data-library-${filter}`).test(engine));
for (const order of ['journey','name','element']) check(`motor:ordem:${order}`, engine.includes(`value="${order}"`) || (order === 'journey' && engine.includes('value="journey"')));
check('motor:comparação-limite', /LIBRARY_COMPARE_LIMIT/.test(engine) && /this\.comparison\.length < LIBRARY_COMPARE_LIMIT/.test(engine));
check('motor:comparação-não-é-tiragem', /não substitui uma tiragem contextualizada/.test(engine));
check('motor:estado-em-memória', /this\.comparison = \[\]/.test(engine) && !/localStorage|sessionStorage|indexedDB/.test(engine));
check('motor:escape-html', /escapeHTML/.test(engine) && count(engine, /safe\(/g) >= 10);
check('motor:estado-vazio', /Nenhuma carta encontrada/.test(engine));
check('motor:resultado-ao-vivo', /data-library-status aria-live="polite"/.test(engine));
check('motor:comparação-aria', /data-library-compare hidden aria-live="polite"/.test(engine));
check('motor:botão-comparar-pressionado', /aria-pressed="\$\{selected\}"/.test(engine));
check('motor:imagens-oficiais', /cardImageMarkup/.test(engine));
check('motor:links-profundos', /cardPageHref\(card\)/.test(engine));
check('motor:mais-24', /this\.limit \+= LIBRARY_PAGE_SIZE/.test(engine));

check('política:sem-acento', /normalize\('NFD'\)/.test(policySource) && /\\u0300-\\u036f/.test(policySource));
check('política:todas-palavras', /terms\.every/.test(policySource));
check('política:três-idiomas', ['ptBR','en','es'].every(key => policySource.includes(`card.names?.${key}`)));
check('política:palavras-chave', /deep\?\.keywords/.test(policySource));
check('política:símbolos', /deep\?\.symbols/.test(policySource));
check('política:correspondências', ['astrological','numerology','domain'].every(key => policySource.includes(`correspondence.${key}`)));
check('política:somente-direta', /card\.orientation !== LIBRARY_ORIENTATION/.test(policySource));
check('política:comparação-dois', /LIBRARY_COMPARE_LIMIT = 2/.test(policySource));
check('política:página-canônica', /carta-\$\{cardContentId\(card\)\}\.html/.test(policySource));

check('página:doctype', /^<!doctype html>/i.test(libraryPage));
check('página:pt-BR', /<html lang="pt-BR">/.test(libraryPage));
check('página:canonical', /https:\/\/divinabruxa\.com\.br\/cartas-do-tarot\.html/.test(libraryPage));
check('página:collection-page', /"@type": "CollectionPage"/.test(libraryPage));
check('página:item-list-78', /"numberOfItems": 78/.test(libraryPage));
check('página:data-v184', /"dateModified": "2026-09-07"/.test(libraryPage));
check('página:css-v184', /biblioteca-universal-v184\.css\?v=184/.test(libraryPage));
check('página:js-v184', /biblioteca-universal-v184\.js\?v=184/.test(libraryPage));
check('página:destino-do-app', /id="universalLibraryApp"/.test(libraryPage));
check('página:índice-estático-78', count(libraryPage, /class="library-tile"/g) === 78, count(libraryPage, /class="library-tile"/g));
check('página:78-links-únicos', new Set([...libraryPage.matchAll(/class="library-tile"[\s\S]*?<a href="([^"]+)"/g)].map(match => match[1])).size === 78);
check('página:um-h1', count(libraryPage, /<h1\b/g) === 1);
check('página:nota-responsável', /não substituem orientação médica, psicológica, jurídica ou financeira/.test(libraryPage));
check('progressivo:ativa-só-após-sucesso', standalone.indexOf("new CardLibraryEngine") < standalone.indexOf("classList.add('library-enhanced')"));
check('progressivo:fallback-preservado', /índice estático preservado/.test(standalone));
check('progressivo:oculta-só-aprimorado', /library-enhanced[^{]*library-group/.test(css));

for (const marker of ['library-paths','library-tools','library-compare','library-grid','library-card','library-empty']) check(`css:${marker}`, css.includes(`.${marker}`));
check('css:mobile-620', /@media\(max-width:620px\)/.test(css));
check('css:mobile-370', /@media\(max-width:370px\)/.test(css));
check('css:movimento-reduzido', /prefers-reduced-motion:reduce/.test(css));
check('css:toque-44', count(css, /min-height:44px/g) >= 2);
check('css:busca-48', /min-height:48px/.test(css));
check('css:foco-visível', /:focus/.test(css) && /outline:2px/.test(css));

const core = worker.match(/const CORE=\[([\s\S]*?)\];/)?.[1] || '';
for (const file of ['card-library-policy.js','card-library-engine.js','biblioteca-universal-v184.css','biblioteca-universal-v184.js','cartas-do-tarot.html','tarot-data.js','tarot-meanings.js','tarot-atlas.webp']) check(`offline:núcleo:${file}`, core.includes(`'./${file}'`));
check('offline:instalação-atômica', /Promise\.allSettled\(CORE\.map/.test(worker) && /if\(coreFailures\.length\)throw/.test(worker));
check('offline:não-pré-carrega-78-artes', !/\.\/card-00\.webp/.test(core));
check('offline:imagem-visitada-em-cache', /event\.request\.destination==='image'/.test(worker) && /cache\.put\(event\.request,response\.clone\(\)\)/.test(worker));

await freshImport('tarot-meanings.js');
const [{ CARDS }, policy, session, dailyPolicy] = await Promise.all([
  freshImport('tarot-data.js'), freshImport('card-library-policy.js'), freshImport('tarot-session.js'), freshImport('daily-policy.js')
]);
check('dados:78-cartas', CARDS.length === 78, CARDS.length);
check('dados:22-maiores', CARDS.filter(card => card.arcanaCode === 'major').length === 22);
check('dados:56-menores', CARDS.filter(card => card.arcanaCode === 'minor').length === 56);
check('dados:16-corte', CARDS.filter(card => policy.cardKind(card) === 'court').length === 16);
for (const suit of ['copas','espadas','paus','ouros']) check(`dados:14-${suit}`, CARDS.filter(card => card.suitCode === suit).length === 14);
check('dados:todas-diretas', CARDS.every(card => card.orientation === 'normal'));
check('dados:78-ids-únicos', new Set(CARDS.map(card => card.canonicalId)).size === 78);
check('dados:78-links-existem', CARDS.every(card => exists(policy.cardPageHref(card))));

const filtered = (query = '', extra = {}) => CARDS.filter(card => policy.matchesLibraryFilters(card, { query, arcana: '', suit: '', element: '', kind: '', ...extra }));
check('busca:vazia-78', filtered('').length === 78);
check('busca:sem-acento', filtered('sacerdotisa').some(card => card.name === 'A Sacerdotisa'));
check('busca:inglês', filtered('high priestess').some(card => card.name === 'A Sacerdotisa'));
check('busca:espanhol-sem-acento', filtered('ermitano').some(card => card.name === 'O Eremita'));
check('busca:símbolo-lanterna', filtered('lanterna').some(card => card.name === 'O Eremita'));
check('busca:todas-as-palavras', filtered('lua ciclos').every(card => policy.librarySearchText(card).includes('lua') && policy.librarySearchText(card).includes('ciclos')));
check('filtro:maiores-22', filtered('', { arcana: 'major' }).length === 22);
check('filtro:menores-56', filtered('', { arcana: 'minor' }).length === 56);
check('filtro:copas-14', filtered('', { suit: 'copas' }).length === 14);
check('filtro:corte-16', filtered('', { kind: 'court' }).length === 16);
check('filtro:numeradas-40', filtered('', { kind: 'number' }).length === 40);
check('filtro:água-normalizada', filtered('', { element: 'agua' }).every(card => card.element === 'Água'));
check('ordem:jornada', policy.sortLibraryCards(CARDS, 'journey').every((card, index) => card.index === index));
check('ordem:nome', policy.sortLibraryCards(CARDS, 'name')[0].name === '2 de Copas');
check('conteúdo:78-profundos', CARDS.every(card => policy.meaningForCard(card)));
check('conteúdo:78-com-palavras-chave', CARDS.every(card => policy.meaningForCard(card)?.keywords?.length >= 3));
check('conteúdo:78-com-símbolos', CARDS.every(card => policy.meaningForCard(card)?.symbols?.length >= 3));

let state = session.createTarotState({ randomInt: max => max - 1, now: () => 1, sessionId: 'qa-v184' });
const revealed = [];
for (let index = 0; index < 78; index += 1) { const draw = session.drawNextCard(state, { now: () => index + 2 }); state = draw.state; revealed.push(draw.cardId); }
check('tarot:78-reveladas', revealed.length === 78);
check('tarot:zero-repetições', new Set(revealed).size === 78);
check('tarot:termina-sem-restantes', state.waiting.length === 0 && state.completed === true);
check('tarot:normal-only', state.normalOnly === true);
check('tarot:mesa-13x6', /aria-rowcount="13" aria-colcount="6"/.test(index) && /Math\.floor\(index \/ 6\)/.test(tarotEngine));
check('tarot:sem-significados', /automaticMeanings: false/.test(editorial) && !/meaning-engine|tarot-meanings/.test(tarotEngine));
check('tarot:orbe-revela', /this\.orb\.addEventListener\('click', \(\) => this\.draw\(\)\)/.test(tarotEngine));
check('tarot:embaralha-restantes', /shuffleRemainingCards/.test(tarotEngine));
check('tarot:sem-vibração-web', !/navigator\??\.vibrate|\.vibrate\?\./.test(tarotEngine));

check('diária:fuso-Brasília', dailyPolicy.DAILY_TIME_ZONE === 'America/Sao_Paulo');
check('diária:78-cartas', dailyPolicy.DAILY_CARD_COUNT === 78);
check('diária:estável-no-dia', dailyPolicy.dailyCardIndex('2026-09-07') === dailyPolicy.dailyCardIndex('2026-09-07'));
check('diária:registro-direto', dailyPolicy.createDailyRecord('', new Date('2026-09-07T12:00:00Z')).orientation === 'normal');
check('diária:conteúdo-profundo', /tarot-meanings\.js\?v=183/.test(read('daily-meaning-runtime.js')));
check('diária:14-seções', ['ENERGIA DO DIA','ESSÊNCIA','LUZ','TENSÃO','AMOR','RELACIONAMENTOS','CARREIRA','DINHEIRO','ESPIRITUALIDADE','CONSELHO','SÍMBOLOS','PERGUNTA PARA O DIA','AÇÃO POSSÍVEL','LEITURA RESPONSÁVEL'].every(title => ritual.includes(title)));

for (const price of [25000,15000,10000,5000]) check(`consultas:preço-${price}`, consultationPolicy.includes(`priceCents:${price}`));
check('consultas:e-mail-obrigatório', /name="email" type="email"[\s\S]{0,80}required/.test(consultationEngine));
check('consultas:sem-cobrança', /Nenhuma cobrança automática foi realizada/.test(consultationEngine));

check('contrato:versão', contract.schemaVersion === '184.0.0');
check('contrato:macroetapa-6', contract.macroStage === 6);
check('contrato:78', contract.catalog?.cards === 78);
check('contrato:15-camadas', contract.catalog?.deepEditorialLayersPerCard === 15);
check('contrato:três-idiomas', contract.discovery?.languages?.join(',') === 'pt-BR,en,es');
check('contrato:comparação-privada', contract.comparison?.maximumCards === 2 && contract.comparison?.stored === false);
check('contrato:progressivo', contract.progressiveEnhancement?.staticIndexPreserved === true);
check('contrato:offline-equilibrado', contract.progressiveEnhancement?.essentialCatalogAvailableOffline === true && contract.progressiveEnhancement?.allCardImagesPrecached === false);
check('contrato:visual-preservado', contract.visualSafeguards?.homeCompositionChanged === false && contract.visualSafeguards?.orbArtworkChanged === false && contract.visualSafeguards?.tarotTableChanged === false && contract.visualSafeguards?.cardArtworkChanged === false && contract.visualSafeguards?.existingCosmicIdentityPreserved === true);
check('contrato:13-arquivos', contract.installation?.filesInPackage === 13 && packageFiles.length === 13);
check('contrato:7-substituir', contract.installation?.replace?.length === 7);
check('contrato:6-adicionar', contract.installation?.add?.length === 6);

const manifest = read('ARQUIVOS-V184-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
if (manifest.length) {
  check('hash:12-entradas', manifest.length === 12, manifest.length);
  for (const line of manifest) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    check(`hash:formato:${line.slice(-32)}`, Boolean(match));
    if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(fs.readFileSync(path.join(root, match[2]))) === match[1]);
  }
} else check('hash:manifesto-presente', false);

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({ suite: 'DIVINA-BRUXA-V184-BIBLIOTECA-UNIVERSAL', status: failed.length ? 'FAIL' : 'PASS', root, total: checks.length, passed: checks.length - failed.length, failed }, null, 2));
if (failed.length) process.exitCode = 1;
