#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const indexPath = path.join(root,'index.html');
const manifestPath = path.join(root,'manifest.webmanifest');
const index = fs.existsSync(indexPath) ? fs.readFileSync(indexPath,'utf8') : '';
const manifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath,'utf8') : '';
const checks = [
  ['viewport', /viewport/.test(index)],
  ['manifest-link', /manifest\.webmanifest/.test(index)],
  ['safe-area-contract', fs.existsSync(path.join(root,'MOBILE-SAFE-AREA-V10.css'))],
  ['aria-live-present', /aria-live/.test(index)],
  ['alt-attribute-presence', /\balt=/.test(index)],
  ['manifest-json-readable', (()=>{ try { JSON.parse(manifest); return true; } catch { return false; } })()]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'BLOCKED';
console.log(JSON.stringify({gate:'MOBILE-A11Y-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'BLOCKED'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
