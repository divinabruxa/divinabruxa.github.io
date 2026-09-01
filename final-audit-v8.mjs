import crypto from 'node:crypto';
import fs from 'node:fs';
import process from 'node:process';

const read = (file) => fs.readFileSync(file, 'utf8');
const manifest = JSON.parse(read('FINAL-MANIFEST-V8.30.json'));
const production = JSON.parse(read('PRODUCTION-READINESS-V8.29.json'));
const loader = read('divina-v8-loader.js');
const skin = read('skin-universal-v8.js');
const checks = [];
const add = (name, pass, detail = '') => checks.push({ name, pass: Boolean(pass), detail });

const required = [
  'divina-v8-loader.js','skin-universal-v8.js','skin-universal-v8.css','orb-skin-bridge-v8.js',
  'visual-foundation-v8.css','visual-surfaces-v8.css','portal-atmospheres-v8.css','portal-atmospheres-v8.js',
  'daily-return-v8.css','daily-return-v8.js','premium-experience-v8.css','premium-experience-v8.js',
  'school-experience-v8.css','school-experience-v8.js','tarot-ritual-experience-v8.css','tarot-ritual-experience-v8.js',
  'daily-ritual-v8.css','daily-ritual-v8.js','spreads-experience-v8.css','spreads-experience-v8.js',
  'journal-experience-v8.css','journal-experience-v8.js','ai-experience-v8.css','ai-experience-v8.js',
  'consultations-experience-v8.css','consultations-experience-v8.js','store-experience-v8.css','store-experience-v8.js',
  'media-experience-v8.css','media-experience-v8.js','account-trust-v8.css','account-trust-v8.js',
  'admin-experience-v8.css','admin-experience-v8.js','notifications-experience-v8.css','notifications-experience-v8.js',
  'seo-analytics-v8.js','pwa-performance-v8.css','pwa-performance-v8.js','accessibility-stability-v8.css','accessibility-stability-v8.js',
  'qa-supreme-v8.mjs','regression-v8.28.mjs','release-gate-v8.mjs','production-readiness-v8.mjs',
  'FINAL-MANIFEST-V8.30.json','FINAL-FILE-CHECKSUMS-V8.30.txt','FINAL-INSTALL-V8.30.txt'
];

for (const file of required) add(`required:${file}`, fs.existsSync(file), 'Arquivo obrigatório ausente.');
add('manifest:release', manifest.release === '8.30-final-package');
add('manifest:flat', manifest.archiveLayout === 'flat');
add('manifest:not-installed', manifest.installed === false);
add('manifest:not-production', manifest.productionReady === false);
add('loader:version', loader.includes("const VERSION='8.28'"));
add('loader:20-styles', (loader.match(/-v8\.css/g) || []).length === 20);
add('loader:20-modules', (loader.match(/-v8\.js/g) || []).length >= 20);
add('skins:30-images', (skin.match(/skin-[^']+-v1\.png/g) || []).length === 30);
add('tarot:78-normal', manifest.runtime.tarotCardsExpectedInRepository === 78 && manifest.runtime.invertedCards === false);
add('pricing:premium', production.products.premiumOneTimeBRL === 199.90);
add('pricing:orbe-ai', production.products.orbeAiMonthlyBRL === 89.90 && production.products.orbeAiCredits === 400);
add('pricing:modes', production.products.lunaCreditCost === 1 && production.products.terraCreditCost === 10 && production.products.solEnabled === false);

for (const [flag, value] of Object.entries(manifest.authorizations)) add(`lock:${flag}`, value === false, 'Trava final precisa permanecer false.');

const forbiddenFiles = fs.readdirSync('.').filter((file) => file === 'CNAME' || /^card-\d{2}\.(?:webp|jpg|png)$/i.test(file));
add('package:preserves-repository-assets', forbiddenFiles.length === 0, forbiddenFiles.join(', '));

const textFiles = fs.readdirSync('.').filter((file) => /\.(?:css|js|mjs|json|txt)$/i.test(file));
const combined = textFiles.map((file) => read(file)).join('\n');
const secretPatterns = [/sk_live_[A-Za-z0-9]{12,}/,/rk_live_[A-Za-z0-9]{12,}/,/whsec_[A-Za-z0-9]{12,}/,/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/];
add('security:no-live-secrets', !secretPatterns.some((pattern) => pattern.test(combined)), 'Possível segredo real encontrado.');

const checksumLines = read('FINAL-FILE-CHECKSUMS-V8.30.txt').split('\n').filter((line) => /^[a-f0-9]{64}  /.test(line));
const checksumFailures = [];
for (const line of checksumLines) {
  const hash = line.slice(0, 64);
  const file = line.slice(66);
  if (!fs.existsSync(file)) { checksumFailures.push(file); continue; }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (actual !== hash) checksumFailures.push(file);
}
add('integrity:checksums-present', checksumLines.length >= 90, `Somente ${checksumLines.length} checksums.`);
add('integrity:checksums-valid', checksumFailures.length === 0, checksumFailures.join(', '));

const failed = checks.filter((check) => !check.pass);
console.log(JSON.stringify({
  suite: 'DIVINA-BRUXA-FINAL-AUDIT-V8.30',
  packageStatus: failed.length ? 'FAIL' : 'FINAL_PACKAGE_PASS',
  productionReady: false,
  total: checks.length,
  passed: checks.length - failed.length,
  failed,
  externalGates: manifest.externalGates
}, null, 2));
process.exitCode = failed.length ? 1 : 0;

