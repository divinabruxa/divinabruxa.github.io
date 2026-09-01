#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const css = path.join(root, 'COSMIC-DESIGN-SYSTEM-V10.css');
const tokens = path.join(root, 'DESIGN-TOKENS-COSMIC-V10.json');
const checks = [
  ['css-present', fs.existsSync(css)],
  ['tokens-present', fs.existsSync(tokens)],
  ['reduced-motion', fs.existsSync(css) && fs.readFileSync(css,'utf8').includes('prefers-reduced-motion')],
  ['focus-visible', fs.existsSync(css) && fs.readFileSync(css,'utf8').includes('focus-visible')],
  ['touch-target-contract', fs.existsSync(tokens) && fs.readFileSync(tokens,'utf8').includes('touchTargetMinPx')]
];
const status = checks.every(([,ok])=>ok) ? 'PASS' : 'FAIL';
console.log(JSON.stringify({gate:'DESIGN-SYSTEM-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
