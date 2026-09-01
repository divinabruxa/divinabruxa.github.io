#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const read = name => fs.existsSync(path.join(root, name)) ? fs.readFileSync(path.join(root, name), 'utf8') : '';
const index = read('index.html');
const app = read('app.js');
const results = [];

results.push({check:'single-entrypoint', status:(index.match(/<script[^>]+src=["']app\.js/g)||[]).length === 1 ? 'PASS':'FAIL'});
results.push({check:'navigation-factory', status:/createNavigation\s*\(/.test(app) ? 'PASS':'FAIL'});
results.push({check:'duplicate-media-engine', status:(app.match(/new MediaEngine\s*\(/g)||[]).length > 1 ? 'BLOCKED':'PASS'});
results.push({check:'legacy-v8-loader-imported', status:/divina-v8-loader\.js/.test(index+app) ? 'BLOCKED':'PASS'});
results.push({check:'no-reversed-cards-contract', status:/revers|invertid/i.test(app) ? 'BLOCKED':'PASS'});
results.push({check:'404-fallback', status:fs.existsSync(path.join(root,'404.html')) ? 'PASS':'FAIL'});

const status = results.some(r=>r.status==='FAIL') ? 'FAIL' : results.some(r=>r.status==='BLOCKED') ? 'BLOCKED':'PASS';
console.log(JSON.stringify({gate:'RUNTIME-CANONICAL-V10', status, results}, null, 2));
process.exitCode = status === 'PASS' ? 0 : 1;
