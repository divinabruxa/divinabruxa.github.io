#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'BILLING-CONTRACT-V10.json');
const b = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['sandbox-only', b?.environment === 'sandbox-only'],
  ['premium-price', b?.products?.find(p=>p.id==='divina-premium-lifetime')?.amountBRL === 199.90],
  ['ai-price', b?.products?.find(p=>p.id==='orbe-ai-monthly')?.amountBRL === 89.90],
  ['dynamic-methods', b?.checkout?.paymentMethodTypesOmitted === true],
  ['signed-webhooks', b?.webhooks?.signatureRequired === true],
  ['idempotent-webhooks', b?.webhooks?.idempotencyRequired === true],
  ['live-blocked', b?.blockedUntilApproved?.includes('realBilling')]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'BILLING-SANDBOX-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
