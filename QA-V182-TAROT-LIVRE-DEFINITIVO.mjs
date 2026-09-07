import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const exists = file => fs.existsSync(path.join(root, file));
const read = file => exists(file) ? fs.readFileSync(path.join(root, file), 'utf8') : '';
const bytes = file => exists(file) ? fs.readFileSync(path.join(root, file)) : Buffer.alloc(0);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, pattern) => (value.match(pattern) || []).length;
const checks = [];
const check = (name, condition, detail = '') => checks.push({ name, pass: Boolean(condition), ...(detail ? { detail: String(detail) } : {}) });
const syntax = file => {
  try { execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'ignore' }); return true; }
  catch { return false; }
};
const freshImport = file => import(`${pathToFileURL(path.join(root, file)).href}?qa=${Date.now()}-${Math.random()}`);

const packageFiles = [
  'index.html',
  'app.js',
  'page-loader-v1.js',
  'sw.js',
  'tarot-session.js',
  'tarot-continuity.js',
  'tarot-editorial-policy.js',
  'tarot-engine.js',
  'TAROT-LIVRE-DEFINITIVO-V182.json',
  'QA-V182-TAROT-LIVRE-DEFINITIVO.mjs',
  '00-LEIA-PRIMEIRO-V182-TAROT-LIVRE-DEFINITIVO.txt',
  'ARQUIVOS-V182-SHA256.txt'
];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));

for (const file of ['app.js','page-loader-v1.js','sw.js','tarot-session.js','tarot-continuity.js','tarot-editorial-policy.js','tarot-engine.js','QA-V182-TAROT-LIVRE-DEFINITIVO.mjs']) {
  check(`sintaxe:${file}`, exists(file) && syntax(file));
}

const index = read('index.html');
const app = read('app.js');
const loader = read('page-loader-v1.js');
const worker = read('sw.js');
const engine = read('tarot-engine.js');
const sessionSource = read('tarot-session.js');
const continuitySource = read('tarot-continuity.js');
const editorialSource = read('tarot-editorial-policy.js');
let contract = {};
try { contract = JSON.parse(read('TAROT-LIVRE-DEFINITIVO-V182.json')); check('contrato:json-válido', true); }
catch { check('contrato:json-válido', false); }

check('ativação:app-v182', /app\.js\?v=182/.test(index));
check('ativação:sw-v182', /sw\.js\?v=182/.test(index));
check('ativação:chave-recarga-v182', count(index, /divina\.sw\.reload\.v182/g) === 2);
check('ativação:loader-v182', /page-loader-v1\.js\?v=182/.test(app));
check('ativação:motor-v182-duas-rotas', count(loader, /tarot-engine\.js\?v=182/g) === 2);

check('orbe:único-chamador-draw', count(engine, /this\.draw\(\)/g) === 1, count(engine, /this\.draw\(\)/g));
check('orbe:click-oficial', /this\.orb\.addEventListener\('click', \(\) => this\.draw\(\)\)/.test(engine));
const navigateForwardBlock = engine.match(/async navigateForward[\s\S]*?\n  \}\n\n  announceCardNavigation/)?.[0] || '';
check('orbe:seta-não-revela', navigateForwardBlock.length > 0 && !/this\.draw\(|drawNextCard/.test(navigateForwardBlock));
check('orbe:botão-próximo-só-conhecido', /this\.currentNext\.disabled = this\.drawing \|\| !hasKnownNext/.test(engine));
check('orbe:instrução-visível', /TOQUE NA ORBE PARA UMA NOVA CARTA/.test(engine));
check('orbe:sem-vibração-web', !/navigator\??\.vibrate|\.vibrate\?\./.test(engine));
check('orbe:sem-revelação-por-arraste', !/drag(?:start|end|over|enter)[\s\S]{0,180}(?:drawNextCard|this\.draw)/.test(engine));

for (const state of ['Ready','Touched','Revealing','Disabled','Error']) {
  check(`estado:${state}`, engine.includes(`'${state}'`));
}
check('estado:exposto-na-raiz', /root\.dataset\.interactionState = state/.test(engine));
check('estado:exposto-na-orbe', /orb\.dataset\.interactionState = state/.test(engine));
check('estado:touched-por-ponteiro', /addEventListener\('pointerdown', touchOrb\)/.test(engine));
check('estado:revelando-bloqueia-orbe', /state === TAROT_INTERACTION_STATES\.REVEALING/.test(engine));
check('estado:erro-recuperável', /TENTAR NOVAMENTE/.test(engine) && /toque novamente na Orbe para tentar/i.test(engine));
check('estado:aria-busy', /setAttribute\('aria-busy', 'true'\)/.test(engine) && /removeAttribute\('aria-busy'\)/.test(engine));

const commitAt = engine.indexOf('coordinator.commit(latest => drawNextCard(latest))');
const imageAt = engine.indexOf('prepareCardImage(CARDS[result.cardId]');
const renderAt = engine.indexOf('this.render(result.position, false)');
const eventAt = engine.indexOf("new CustomEvent('tarot:revealed'");
check('fluxo:commit-antes-da-imagem', commitAt >= 0 && commitAt < imageAt);
check('fluxo:imagem-antes-do-render', imageAt >= 0 && imageAt < renderAt);
check('fluxo:render-antes-do-evento', renderAt >= 0 && renderAt < eventAt);
check('fluxo:concorrência-bloqueada', /if \(this\.drawing \|\| this\.navigationAnimation \|\| this\.state\.completed\) return null/.test(engine));
check('fluxo:desbloqueio-final', /settleRevealMagic\(failed\)/.test(engine));
check('fluxo:falha-preserva-coordenador', /this\.state = this\.coordinator\.latest\(\)/.test(engine));

check('editorial:quatro-campos', /\['image', 'name', 'position', 'orientation'\]/.test(editorialSource));
check('editorial:sem-significado', /automaticMeanings: false/.test(editorialSource));
check('editorial:direta-obrigatória', /card\.orientation === 'normal'/.test(editorialSource));
check('editorial:posição-visível', /POSIÇÃO \$\{position\} ·/.test(editorialSource) && /freeCardLabel\(card, index \+ 1\)/.test(engine));
check('editorial:frase-central', /A Orbe revela\. Você interpreta\./.test(engine));

check('mesa:78-posições', /Array\.from\(\{ length: DECK_SIZE \}/.test(engine));
check('mesa:seis-colunas-na-lógica', /Math\.floor\(index \/ 6\) \+ 1/.test(engine) && /\(index % 6\) \+ 1/.test(engine));
check('mesa:modo-compacto-fixo', /this\.compactView = true; this\.viewport\.classList\.add\('is-compact'\)/.test(engine));
check('mesa:contador-78', /\$\{total\}<small>\/\$\{DECK_SIZE\}<\/small>/.test(engine));
check('mesa:embaralha-restantes', /shuffleRemainingCards\(latest\)/.test(engine));
check('mesa:reveladas-imutáveis-no-embaralhar', /this\.state\.revealed\.join\(','\) !== revealedBefore/.test(engine));

check('continuidade:schema-v540', /TAROT_SESSION_SCHEMA = '5\.4\.0'/.test(sessionSource));
check('continuidade:memória-da-aba', /this\.memoryState/.test(continuitySource));
check('continuidade:leitura-protegida', /try \{ stored = normalizeTarotState\(this\.storage\.get/.test(continuitySource));
check('continuidade:gravação-protegida', /try \{ this\.storage\.set\(this\.key, state\); persisted = true; \}/.test(continuitySource));
check('continuidade:web-locks', /navigator\?\.locks\?\.request/.test(continuitySource));
check('continuidade:fila-local', /this\.queue\.then\(execute, execute\)/.test(continuitySource));
check('continuidade:aviso-honesto', /continua segura nesta aba/.test(engine));
check('backup:limite-256k', /TAROT_MAX_BACKUP_BYTES = 262144/.test(sessionSource));
check('backup:limite-antes-do-texto', engine.indexOf('file.size') >= 0 && engine.indexOf('file.size') < engine.indexOf('file.text()'));

check('offline:cache-v52', /divina-bruxa-v52-tarot-v182/.test(worker));
const coreMatch = worker.match(/const CORE=\[([\s\S]*?)\];/);
const core = coreMatch?.[1] || '';
for (const file of contract.offlineCore || []) check(`offline:núcleo:${file}`, core.includes(`'./${file}'`));
check('offline:instalação-atômica', /Promise\.allSettled\(CORE\.map/.test(worker) && /if\(coreFailures\.length\)throw/.test(worker));
check('offline:assume-controle', /self\.skipWaiting\(\)/.test(worker) && /self\.clients\.claim\(\)/.test(worker));
check('offline:fallback-de-navegação', /caches\.match\('\.\/offline\.html'\)/.test(worker));

check('contrato:versão', contract.schemaVersion === '182.0.0');
check('contrato:macroetapa-4', contract.macroStage === 4);
check('contrato:78-cartas', contract.canonicalDeck?.cards === 78);
check('contrato:diretas', contract.canonicalDeck?.orientation === 'upright-only');
check('contrato:sem-repetição', contract.canonicalDeck?.repeatsPerSession === false);
check('contrato:sem-significados', contract.canonicalDeck?.automaticMeanings === false);
check('contrato:13x6', contract.canonicalDeck?.tableRows === 13 && contract.canonicalDeck?.tableColumns === 6);
check('contrato:orbe-única', contract.revelation?.onlyTrigger === '#tableOrb');
check('contrato:cinco-estados', contract.interactionStateMachine?.join(',') === 'Ready,Touched,Revealing,Disabled,Error');
check('contrato:visual-preservado', contract.visualSafeguards?.homeChanged === false && contract.visualSafeguards?.mainOrbArtworkChanged === false && contract.visualSafeguards?.tarotCardArtworkChanged === false);
check('contrato:12-arquivos', contract.installation?.filesInPackage === 12);
check('contrato:8-substituir', contract.installation?.replace?.length === 8);
check('contrato:4-adicionar', contract.installation?.add?.length === 4);
check('contrato:não-apagar', contract.installation?.deleteOtherFiles === false);
check('contrato:preços', contract.protectedAreas?.consultationPricesBrl?.join(',') === '250,150,100,50');
check('contrato:sem-cobrança-real', contract.protectedAreas?.realBillingEnabled === false);

const sessionModule = exists('tarot-session.js') ? await freshImport('tarot-session.js') : null;
const continuityModule = exists('tarot-continuity.js') ? await freshImport('tarot-continuity.js') : null;
const editorialModule = exists('tarot-editorial-policy.js') ? await freshImport('tarot-editorial-policy.js') : null;
if (sessionModule) {
  check('sessão:deck-size-78', sessionModule.DECK_SIZE === 78 && sessionModule.CARD_IDS.length === 78);
  check('sessão:ids-únicos', new Set(sessionModule.CARD_IDS).size === 78);
  let seed = 182;
  const randomInt = max => ((seed = (seed * 1664525 + 1013904223) >>> 0) % max);
  let state = sessionModule.createTarotState({ randomInt, now: () => 182000, sessionId: 'qa-v182' });
  const revealed = [];
  for (let position = 0; position < 78; position += 1) {
    const result = sessionModule.drawNextCard(state, { now: () => 182001 + position });
    revealed.push(result.cardId);
    state = result.state;
    check(`sessão:posição-${position + 1}`, result.position === position && state.revealed.length === position + 1 && state.waiting.length === 77 - position);
  }
  check('sessão:78-revelações', revealed.length === 78);
  check('sessão:zero-repetições', new Set(revealed).size === 78);
  check('sessão:todos-os-ids', [...revealed].sort((a, b) => a - b).join(',') === sessionModule.CARD_IDS.join(','));
  check('sessão:completa', state.completed === true && state.waiting.length === 0 && state.revealed.length === 78);
  const afterComplete = sessionModule.drawNextCard(state);
  check('sessão:não-revela-após-78', afterComplete.cardId === null && afterComplete.state.revision === state.revision);
  check('sessão:sempre-direta', state.normalOnly === true);

  let partial = sessionModule.createTarotState({ randomInt, sessionId: 'qa-shuffle' });
  for (let index = 0; index < 17; index += 1) partial = sessionModule.drawNextCard(partial).state;
  const fixed = partial.revealed.join(',');
  const remainingSet = [...partial.waiting].sort((a, b) => a - b).join(',');
  const shuffled = sessionModule.shuffleRemainingCards(partial, { randomInt: () => 0 });
  check('sessão:shuffle-preserva-reveladas', shuffled.revealed.join(',') === fixed);
  check('sessão:shuffle-preserva-restantes', [...shuffled.waiting].sort((a, b) => a - b).join(',') === remainingSet);
  check('sessão:shuffle-sem-duplicar', new Set([...shuffled.revealed, ...shuffled.waiting]).size === 78);

  const backup = sessionModule.createTarotBackup(partial, { now: () => 182999 });
  const restored = sessionModule.restoreTarotBackup(backup, { now: () => 183000 });
  check('sessão:backup-restaura', restored?.revealed.join(',') === partial.revealed.join(',') && restored?.waiting.join(',') === partial.waiting.join(','));
  check('sessão:backup-avança-revisão', restored?.revision === partial.revision + 1);
  check('sessão:backup-vazio-rejeitado', sessionModule.restoreTarotBackup('') === null);
  check('sessão:backup-kind-rejeitado', sessionModule.restoreTarotBackup('{"kind":"outro","version":1,"state":{}}') === null);
  check('sessão:backup-grande-rejeitado', sessionModule.restoreTarotBackup('x'.repeat(sessionModule.TAROT_MAX_BACKUP_BYTES + 1)) === null);
  const corruptedWaiting = [...partial.waiting];
  corruptedWaiting[0] = partial.revealed[0];
  const corrupted = { ...partial, waiting: corruptedWaiting };
  check('sessão:duplicação-corrompida-rejeitada', sessionModule.normalizeTarotState(corrupted) === null);

  let stressPass = true;
  for (let round = 0; round < 256 && stressPass; round += 1) {
    let stressSeed = round + 1;
    const rng = max => ((stressSeed = (stressSeed * 1103515245 + 12345) >>> 0) % max);
    let stress = sessionModule.createTarotState({ randomInt: rng, sessionId: `stress-${round}` });
    const ids = [];
    while (!stress.completed) { const output = sessionModule.drawNextCard(stress); ids.push(output.cardId); stress = output.state; }
    stressPass = ids.length === 78 && new Set(ids).size === 78;
  }
  check('sessão:256-mesas-sem-repetição', stressPass);
}

if (continuityModule && sessionModule) {
  const blockedStorage = { get() { throw new Error('blocked'); }, set() { throw new Error('blocked'); } };
  const blocked = new continuityModule.TarotSessionCoordinator({ storage: blockedStorage, key: 'qa-blocked' });
  const blockedCards = [];
  for (let index = 0; index < 12; index += 1) {
    const result = await blocked.commit(latest => sessionModule.drawNextCard(latest));
    blockedCards.push(result.cardId);
  }
  check('coordenador:bloqueio-mantém-12-cartas', blocked.latest().revealed.length === 12);
  check('coordenador:bloqueio-sem-repetição', new Set(blockedCards).size === 12);
  check('coordenador:bloqueio-declarado', blocked.lastPersisted === false);

  let saved = null;
  const persistentStorage = {
    get() { return saved ? structuredClone(saved) : null; },
    set(_key, value) { saved = structuredClone(value); }
  };
  const first = new continuityModule.TarotSessionCoordinator({ storage: persistentStorage, key: 'qa-persist' });
  for (let index = 0; index < 9; index += 1) await first.commit(latest => sessionModule.drawNextCard(latest));
  const resumed = new continuityModule.TarotSessionCoordinator({ storage: persistentStorage, key: 'qa-persist' });
  check('coordenador:retoma-nove-cartas', resumed.latest().revealed.length === 9);
  check('coordenador:gravação-confirmada', first.lastPersisted === true);

  let queuedSaved = null;
  const queuedStorage = { get() { return queuedSaved; }, set(_key, value) { queuedSaved = structuredClone(value); } };
  const queued = new continuityModule.TarotSessionCoordinator({ storage: queuedStorage, key: 'qa-queue' });
  const concurrent = await Promise.all(Array.from({ length: 24 }, () => queued.commit(latest => sessionModule.drawNextCard(latest))));
  check('coordenador:24-commits-serializados', queued.latest().revealed.length === 24);
  check('coordenador:24-commits-únicos', new Set(concurrent.map(result => result.cardId)).size === 24);
}

if (editorialModule) {
  const card = { index: 0, name: '<O Louco>', orientation: 'normal' };
  const label = editorialModule.freeCardLabel(card, 7);
  check('editorial:escape-html', label.includes('&lt;O Louco&gt;'));
  check('editorial:posição-7', label.includes('POSIÇÃO 7 · DIRETA'));
  check('editorial:rejeita-invertida', editorialModule.isFreeTarotCard({ ...card, orientation: 'reversed' }) === false);
  check('editorial:aria-completa', editorialModule.freeCardAriaLabel(card, 7).includes('direta, posição 7'));
}

const fullProject = exists('tarot-data.js') && exists('tarot-image-manifest-v5.json') && exists('consultation-policy.js') && exists('consultation-engine.js');
if (fullProject) {
  const [{ CARDS, REQUIRED_ORIENTATION }, consultationModule] = await Promise.all([
    freshImport('tarot-data.js'),
    freshImport('consultation-policy.js')
  ]);
  check('catálogo:78-cartas', CARDS.length === 78);
  check('catálogo:78-identidades', new Set(CARDS.map(card => card.canonicalId)).size === 78);
  check('catálogo:78-índices', CARDS.every((card, index) => card.index === index));
  check('catálogo:todas-diretas', REQUIRED_ORIENTATION === 'normal' && CARDS.every(card => card.orientation === 'normal'));
  check('catálogo:sem-significados-no-motor', !/meaning|significado|interpreta(?:ção|r)/i.test(engine.replace('Nenhum significado automático interfere na sua leitura.', '')));

  const imageManifest = JSON.parse(read('tarot-image-manifest-v5.json'));
  check('imagens:78-registros', imageManifest.cards?.length === 78);
  check('imagens:78-arquivos-únicos', new Set(imageManifest.cards?.map(card => card.file)).size === 78);
  check('imagens:todas-diretas', imageManifest.cards?.every(card => card.orientation === 'normal'));
  check('imagens:atlas-78-células', imageManifest.atlas?.grid?.usedCells === 78);
  check('imagens:atlas-íntegro', exists(imageManifest.atlas?.file) && sha(bytes(imageManifest.atlas.file)) === imageManifest.atlas.sha256);
  let artworkIntegrity = true;
  for (const card of imageManifest.cards || []) {
    if (!exists(card.file) || sha(bytes(card.file)) !== card.sha256) { artworkIntegrity = false; break; }
  }
  check('imagens:78-artes-íntegras', artworkIntegrity);
  check('imagens:mapeamento-catálogo', imageManifest.cards?.every((card, index) => card.canonicalId === CARDS[index]?.canonicalId && card.file === CARDS[index]?.imageSources?.full));

  const policy = consultationModule.CONSULTATION_POLICY;
  check('consultas:quatro-serviços', policy.services.length === 4);
  check('consultas:preços-preservados', policy.services.map(service => service.price).join(',') === '250,150,100,50');
  check('consultas:email-obrigatório', policy.channels.join(',') === 'email' && /name="email"[^>]+required/.test(read('consultation-engine.js')));
  check('consultas:cobrança-desligada', policy.realBilling === false);

  check('verdade:v181-política-presente', exists('politica-editorial.html'));
  check('verdade:v181-fontes-presentes', exists('fontes-e-referencias.html'));
  check('verdade:v181-busca-130-destinos', count(read('busca-v165.js'), /^  \['/gm) + 78 === 130);
  check('verdade:v181-sitemap-131', count(read('sitemap.xml'), /<url>/g) === 131);
  check('verdade:v181-menu-preservado', read('menu-completo-v177.js').includes("heading.textContent = 'VERDADE EDITORIAL'"));

  const importTargets = [...`${app}\n${loader}\n${engine}\n${continuitySource}`.matchAll(/(?:from\s+|import\()['"]\.\/([^?'"]+)/g)].map(match => match[1]);
  check('integração:imports-locais-presentes', importTargets.every(file => exists(file)), importTargets.filter(file => !exists(file)).join(','));
  for (const file of contract.offlineCore || []) check(`integração:offline-existe:${file}`, exists(file));
}

const hashText = read('ARQUIVOS-V182-SHA256.txt').trim();
const hashLines = hashText ? hashText.split(/\r?\n/) : [];
check('pacote:11-hashes', hashLines.length === 11, hashLines.length);
for (const line of hashLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-34)}`, match);
  if (match) check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(bytes(match[2])) === match[1]);
}

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-V182-TAROT-LIVRE-DEFINITIVO',
  status: failed.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'release-package',
  root,
  total: checks.length,
  passed: checks.length - failed.length,
  failed
}, null, 2));
if (failed.length) process.exit(1);
