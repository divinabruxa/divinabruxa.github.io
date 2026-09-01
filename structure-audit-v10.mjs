#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const entry = path.join(root, 'app.js');
const source = fs.existsSync(entry) ? fs.readFileSync(entry, 'utf8') : '';
const imports = [...source.matchAll(/from\s+['"]\.\/([^'"]+)['"]/g)].map(m => m[1].split('?')[0]);
const missing = imports.filter(file => !fs.existsSync(path.join(root, file)));
const duplicateMedia = (source.match(/new MediaEngine\s*\(/g) || []).length;
const result = {
  gate: 'STRUCTURE-V10',
  root,
  entrypoint: fs.existsSync(entry) ? 'PASS' : 'FAIL',
  importsFound: imports.length,
  missingImports: missing,
  duplicateMediaEngine: duplicateMedia > 1,
  status: !fs.existsSync(entry) || missing.length ? 'FAIL' : duplicateMedia > 1 ? 'BLOCKED' : 'PASS'
};
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.status === 'PASS' ? 0 : 1;
