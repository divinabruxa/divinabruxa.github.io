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
const tarotFiles = ['tarot-core-contract-v9.js', 'tarot-data.js', 'daily-policy.js', 'spreads-policy.js'];
const tarotSource = tarotFiles
  .filter(file => fs.existsSync(path.join(root, file)))
  .map(file => fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');
const enablesReversedCards = /\breversed\s*:\s*true\b|\borientation\s*:\s*['"](?:reversed|invertida)['"]/i.test(tarotSource);
const declaresDirectOnly = /orientation\s*:\s*['"]normal['"]/.test(tarotSource)
  && /reversedAllowed\s*:\s*false|reversed\s*:\s*false/.test(tarotSource);
results.push({
  check: 'invariant:no-reversed-cards',
  status: !enablesReversedCards && declaresDirectOnly ? 'PASS' : 'BLOCKED'
});
const status = results.some(r => r.status === 'FAIL') ? 'FAIL'
  : results.some(r => r.status === 'BLOCKED') ? 'BLOCKED' : 'PASS';
console.log(JSON.stringify({ gate: 'DIVINA-BRUXA-V10', status, root, results }, null, 2));
process.exitCode = status === 'PASS' ? 0 : 1;
