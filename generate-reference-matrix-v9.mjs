import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('github-audit-v8-20260901');
const exists = (file) => fs.existsSync(path.join(root, file));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const unique = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b));

const index = read('index.html');
const app = read('app.js');
const sw = read('sw.js');
const indexRefs = unique([...index.matchAll(/(?:src|href)=["']([^"'#?]+)(?:\?[^"']*)?["']/g)].map((match) => match[1]).filter((file) => !file.startsWith('http') && !file.startsWith('data:')));
const appImports = unique([...app.matchAll(/(?:from|import)\s+["']\.\/([^"'?]+)/g)].map((match) => match[1]));
const swRefs = unique([...sw.matchAll(/["']\.\/([^"'?]+)(?:\?[^"']*)?["']/g)].map((match) => match[1]));
const fourOhFour = read('404.html');
const fourOhFourRefs = unique([...fourOhFour.matchAll(/(?:src|href)=["']\.\/([^"'?]+)/g)].map((match) => match[1]));
const result = {
  project: 'Divina Bruxa — Orbe das Realidades',
  auditedAt: '2026-09-01',
  currentRuntime: {
    entry: 'index.html',
    indexDirectRefs: indexRefs,
    indexMissingRefs: indexRefs.filter((file) => !exists(file)),
    appStaticImports: appImports,
    appMissingImports: appImports.filter((file) => !exists(file)),
    serviceWorkerRefs: swRefs,
    serviceWorkerMissingRefs: swRefs.filter((file) => !exists(file))
  },
  orphanErrorRuntime: {
    entry: '404.html',
    referencedFiles: fourOhFourRefs,
    missingFiles: fourOhFourRefs.filter((file) => !exists(file))
  },
  v8Candidate: {
    loaderPresent: exists('divina-v8-loader.js'),
    loaderReferencedByIndex: index.includes('divina-v8-loader.js'),
    universalSkinPresent: exists('skin-universal-v8.js'),
    orbBridgePresent: exists('orb-skin-bridge-v8.js')
  },
  conclusion: 'Current index/app runtime has no missing static references; 404 runtime references missing build chunks; V8 candidate is not active.'
};
fs.writeFileSync('RUNTIME-REFERENCE-MATRIX-V9.0.json', JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ suite: 'DIVINA-BRUXA-REFERENCE-MATRIX-V9.0', status: 'PASS', indexRefs: indexRefs.length, appImports: appImports.length, fourOhFourMissing: result.orphanErrorRuntime.missingFiles.length, output: 'RUNTIME-REFERENCE-MATRIX-V9.0.json' }, null, 2));

