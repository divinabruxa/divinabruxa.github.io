import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const exists = file => fs.existsSync(path.join(root, file));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const results = [];
const check = (name, condition, detail = '') => results.push({ check: name, status: condition ? 'PASS' : 'FAIL', ...(detail ? { detail } : {}) });

const packageFiles = [
  'premium-constellation-v1.css',
  'premium-constelacao-30-skins-v1.webp',
  '00-LEIA-PRIMEIRO-V178-COFRE-INVENTARIO.txt',
  'BASELINE-VIVO-V178.json',
  'DEPENDENCIAS-VIVAS-V178.json',
  'ARQUIVAMENTO-SEGURO-V178.json',
  'QA-BASELINE-V178.mjs'
];
packageFiles.forEach(file => check(`package:${file}`, exists(file)));

const baseline = JSON.parse(read('BASELINE-VIVO-V178.json'));
const dependencies = JSON.parse(read('DEPENDENCIAS-VIVAS-V178.json'));
const archivePlan = JSON.parse(read('ARQUIVAMENTO-SEGURO-V178.json'));

check('release:baseline', baseline.release === 'DIVINA-BRUXA-V178-COFRE-INVENTARIO');
check('release:dependencies', dependencies.release === baseline.release);
check('release:archive-plan', archivePlan.release === baseline.release);
check('lock:no-delete', baseline.locks.deleteAuthorized === false && archivePlan.deleteAuthorized === false);
check('lock:no-production', baseline.locks.productionPublishAuthorized === false);
check('lock:no-real-billing', baseline.locks.realBillingAuthorized === false);
check('repair:premium-css-sha', sha256('premium-constellation-v1.css') === dependencies.repairedByV178[0].sha256);
check('repair:premium-image-sha', sha256('premium-constelacao-30-skins-v1.webp') === dependencies.repairedByV178[1].sha256);
check('repair:premium-image-size', fs.statSync(path.join(root, 'premium-constelacao-30-skins-v1.webp')).size === 117246);

const fullProject = exists('tarot-data.js') && exists('index.html');
if (fullProject) {
  for (const [file, expected] of Object.entries(baseline.criticalSha256)) {
    check(`vault:${file}`, exists(file) && sha256(file) === expected);
  }

  const [{ CARDS, REQUIRED_ORIENTATION }, imageManifest, consultationModule, tarotSession] = await Promise.all([
    import(`./tarot-data.js?v=${Date.now()}`),
    Promise.resolve(JSON.parse(read('tarot-image-manifest-v5.json'))),
    import(`./consultation-policy.js?v=${Date.now()}`),
    import(`./tarot-session.js?v=${Date.now()}`)
  ]);

  check('tarot:78-cards', CARDS.length === 78);
  check('tarot:78-numeric-ids', new Set(CARDS.map(card => card.id)).size === 78);
  check('tarot:78-canonical-ids', new Set(CARDS.map(card => card.canonicalId)).size === 78);
  check('tarot:normal-orientation-policy', REQUIRED_ORIENTATION === 'normal');
  check('tarot:all-normal', CARDS.every(card => card.orientation === 'normal'));
  check('tarot:image-manifest-78', imageManifest.cards.length === 78);
  check('tarot:image-hashes-unique', new Set(imageManifest.cards.map(card => card.sha256)).size === 78);

  const imageFailures = imageManifest.cards.filter(card => !exists(card.file) || sha256(card.file) !== card.sha256);
  check('tarot:78-official-images-intact', imageFailures.length === 0, `${imageFailures.length} falhas`);
  check('tarot:atlas-intact', sha256(imageManifest.atlas.file) === imageManifest.atlas.sha256);
  check('tarot:atlas-grid', imageManifest.atlas.grid.usedCells === 78 && imageManifest.atlas.grid.columns === 10 && imageManifest.atlas.grid.rows === 8);

  for (let sessionIndex = 0; sessionIndex < 12; sessionIndex += 1) {
    let seed = sessionIndex + 1;
    const randomInt = max => ((seed = (seed * 1664525 + 1013904223) >>> 0) % max);
    let state = tarotSession.createTarotState({ randomInt, sessionId: `qa-v178-${sessionIndex}` });
    const drawn = [];
    while (!state.completed) {
      const result = tarotSession.drawNextCard(state);
      drawn.push(result.cardId);
      state = result.state;
    }
    check(`tarot:session-${sessionIndex + 1}-complete`, drawn.length === 78 && new Set(drawn).size === 78 && state.normalOnly === true);
  }

  const policy = consultationModule.CONSULTATION_POLICY;
  check('consultations:email-channel', policy.channels.length === 1 && policy.channels[0] === 'email');
  check('consultations:no-real-billing', policy.realBilling === false);
  check('consultations:four-independent-services', policy.services.length === 4 && policy.independentProducts === true);
  check('consultations:prices', policy.services.map(service => service.price).join(',') === '250,150,100,50');
  check('consultations:email-required-in-form', /name="email"[^>]+required/.test(read('consultation-engine.js')));

  const index = read('index.html');
  check('menu:library-screen', index.includes('id="library"'));
  check('menu:v177-loaded', index.includes('menu-completo-v177.js?v=177'));
  check('table:13x6', index.includes('aria-rowcount="13"') && index.includes('aria-colcount="6"'));
  check('free-tarot:no-meanings-copy', index.includes('DIRETA · SEM SIGNIFICADO'));
  check('repair:index-premium-css', index.includes('premium-constellation-v1.css?v=142'));
  check('repair:about-premium-image', read('sobre-a-divina-bruxa.html').includes('premium-constelacao-30-skins-v1.webp'));

  const sitemap = read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  check('seo:sitemap-129', urls.length === 129 && new Set(urls).size === 129);
  check('seo:78-card-pages', urls.filter(url => /\/carta-(?!do-dia)/.test(url)).length === 78);
}

const failed = results.filter(result => result.status === 'FAIL');
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-V178-BASELINE',
  status: failed.length ? 'FAIL' : 'PASS',
  mode: fullProject ? 'full-project' : 'package',
  total: results.length,
  passed: results.length - failed.length,
  failed
}, null, 2));
if (failed.length) process.exit(1);
