#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'APP-STORES-CONTRACT-V11.json');
const a = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['android-first', a?.order?.[0] === 'android'],
  ['android-test-billing', a?.android?.billing === 'play-billing-test'],
  ['ios-sandbox', a?.ios?.billing === 'storekit-sandbox'],
  ['restore-purchases', a?.ios?.restorePurchases === true],
  ['privacy-assets', a?.requiredAssets?.includes('privacy-url')],
  ['symbolic-disclosure', a?.claims?.symbolicToolDisclosure === true],
  ['submission-blocked', a?.blockedUntilApproved?.includes('storeSubmission')],
  ['qa-matrix', (a?.qa?.length || 0) >= 5]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'STORE-READINESS-V11',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
