#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'PREMIUM-ENTITLEMENTS-V10.json');
const p = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['one-time-price', p?.product?.priceBRL === 199.90 && p?.product?.billing === 'one-time'],
  ['ai-separate', p?.product?.includesAI === false && p?.ai?.included === false],
  ['deep-academy', p?.premium?.includes('academy-17-modules') && p?.premium?.includes('card-lessons-78')],
  ['advanced-spreads', p?.premium?.includes('spreads-24-plus') && p?.premium?.includes('custom-spread-builder')],
  ['restore-idempotent', p?.restore?.crossDevice === true && p?.restore?.idempotent === true],
  ['truth-rule', Boolean(p?.truthRule)]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'PREMIUM-VALUE-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
