#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'COMMERCE-CATALOG-V10.json');
const c = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['contact-email', c?.consultations?.contactEmail === 'orbedasrealidades@hotmail.com'],
  ['no-whatsapp', c?.consultations?.whatsapp === false],
  ['four-services', c?.consultations?.services?.length === 4],
  ['required-form-fields', (c?.consultations?.requiredFields?.length || 0) >= 5],
  ['affiliate-disclosure', c?.store?.affiliateDisclosure === true],
  ['real-store-images', c?.store?.realImageRequired === true],
  ['safety-disclaimers', c?.safety?.noGuaranteedOutcome === true]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'COMMERCE-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
