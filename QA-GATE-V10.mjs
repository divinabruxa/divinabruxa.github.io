#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const required = ['index.html', 'app.js', 'manifest.webmanifest', 'robots.txt'];
const results = [];
for (const file of required) {
  results.push({ check: `required:${file}`, status: fs.existsSync(path.join(root, file)) ? 'PASS' : 'FAIL' });
}
const index = fs.existsSync(path.join(root, 'index.html'))
  ? fs.readFileSync(path.join(root, 'index.html'), 'utf8') : '';
results.push({
  check: 'index:canonical-entrypoint',
  status: index.includes('app.js') ? 'PASS' : 'FAIL'
});
results.push({
  check: 'invariant:no-reversed-cards',
  status: /revers|invertid/i.test(index) ? 'BLOCKED' : 'PASS'
});
const status = results.some(r => r.status === 'FAIL') ? 'FAIL'
  : results.some(r => r.status === 'BLOCKED') ? 'BLOCKED' : 'PASS';
console.log(JSON.stringify({ gate: 'DIVINA-BRUXA-V10', status, root, results }, null, 2));
process.exitCode = status === 'PASS' ? 0 : 1;
