#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const css = fs.existsSync(path.join(root,'PAGE-INTERIORS-V10.css')) ? fs.readFileSync(path.join(root,'PAGE-INTERIORS-V10.css'),'utf8') : '';
const json = fs.existsSync(path.join(root,'PAGE-WORLDS-V10.json')) ? JSON.parse(fs.readFileSync(path.join(root,'PAGE-WORLDS-V10.json'),'utf8')) : null;
const checks = [
  ['interior-css', css.includes('db-page-world')],
  ['responsive-grid', css.includes('auto-fit')],
  ['touch-target', css.includes('min-height: 44px')],
  ['world-catalog', Boolean(json?.worlds?.length >= 10)],
  ['empty-state-contract', Boolean(json?.sharedComponents?.includes('empty-state'))]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'INTERIORS-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
