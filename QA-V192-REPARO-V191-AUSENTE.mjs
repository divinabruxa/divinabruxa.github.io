import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(process.argv[2] || process.cwd());

const expectedHashes = {
  'PREMIUM-SKINS-BILLING-V191.json': '8a8fffafe2efb316ed83527f14e74ab262a5e585818292a523aa94940cf622f0',
  'STAGING-PREMIUM-BILLING-STATUS-V191.json': '7e70bee834fefb28c4eb6bb988ec65d5a1da5752bf4c26b103e75361aae8d7b8',
  'SUPABASE-PREMIUM-ACCOUNT-TRIGGER-HARDENING-V191.sql': '6df21d279ba6d8ac317f7d5bd315912faba280e621e3f277cab6a9ac3c125064',
  'SUPABASE-PREMIUM-BILLING-STAGING-V191.sql': 'be6dd7a33205e457cf3e9a18880edff5928ccbd41898f883bd4cc6715e85d94a',
  'SUPABASE-PREMIUM-IDEMPOTENCY-HARDENING-V191.sql': '5470b768f5e0e26f23b95ff7e460a86bce3f04f7006f4c6699a02dda6e165a79',
  'SUPABASE-PREMIUM-INDEX-HARDENING-V191.sql': 'b67c44633beedfe8ade1cea040e5961e30e62d406e55b454f01b1fd9646cdff9',
  'SUPABASE-PREMIUM-RECEIPT-HARDENING-V191.sql': '2fb477f697bf5aaf1550a77e56fa3a9becb552cbe66684d91d366e660f6b5301',
  'auth-client-v189.js': '59557e77ae7fd06ac29cd53a1ec0c95ffa4693214ac35ca176ec28a27ad8d5ea',
  'billing-account-v191.ts': 'a2828f24fdf0694fde9c20d5467873b268a166e240984e2668ca52a8f6f173c6',
  'premium-billing-v191.css': '28257b0d527c1fe0d4fbb6d375da0e7ef700a3b2fbd776e6315d63530b48c3a3',
  'premium-engine-v191.js': '749f01d063b4b2ba453d34264f5c3f5bd1cfeca416eb4a8ba4b8bde291cc45d5',
  'premium-policy-v191.js': '3db3db852cb0a098f9dbe043b609569f4941cc634d431a7df7ad9a40726d4287',
  'skins-v191.js': '650b92a2b28c063158415294bd20fe6a3a2ad0c9b089c5fb000d3e2bca257bbf',
};

const checks = [];
const add = (name, ok, detail = '') => checks.push({ name, ok, ...(detail ? { detail } : {}) });
const read = (name) => fs.readFileSync(path.join(ROOT, name), 'utf8');

for (const [name, expected] of Object.entries(expectedHashes)) {
  const file = path.join(ROOT, name);
  if (!fs.existsSync(file)) {
    add(`${name}: presente`, false, 'arquivo ausente');
    continue;
  }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  add(`${name}: integridade`, actual === expected, actual === expected ? '' : `sha256 ${actual}`);
}

const markers = [
  ['index.html: app V192 preservado', 'index.html', 'app.js?v=192'],
  ['index.html: service worker V192 preservado', 'index.html', "register('./sw.js?v=192')"],
  ['app.js: release V192 preservada', 'app.js', 'APLICATIVO V192'],
  ['app.js: loader V192 preservado', 'app.js', 'page-loader-v1.js?v=192'],
  ['sw.js: cache V192 preservado', 'sw.js', 'divina-bruxa-v62-editorial-v192'],
  ['V192: catálogo editorial presente', 'editorial-catalog-v192.js', null],
  ['V192: mídia presente', 'media-engine-v192.js', null],
  ['V192: universo visual presente', 'editorial-universe-v192.css', null],
];

for (const [name, fileName, marker] of markers) {
  const file = path.join(ROOT, fileName);
  if (!fs.existsSync(file)) {
    add(name, false, `${fileName} ausente`);
    continue;
  }
  add(name, marker === null || read(fileName).includes(marker), marker === null ? '' : `marcador ausente: ${marker}`);
}

const failures = checks.filter((check) => !check.ok);
const report = {
  suite: 'DIVINA-BRUXA-V192-REPARO-V191-AUSENTE',
  status: failures.length ? 'FAIL' : 'PASS',
  total: checks.length,
  passed: checks.length - failures.length,
  failed: failures.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = failures.length ? 1 : 0;
