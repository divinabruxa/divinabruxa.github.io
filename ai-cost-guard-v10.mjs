#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'ORBE-AI-CONTRACT-V10.json');
const a = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['subscription-price', a?.subscription?.priceBRL === 89.90],
  ['400-credits', a?.subscription?.credits === 400],
  ['luna-terra-enabled', a?.modes?.luna?.enabled === true && a?.modes?.terra?.enabled === true],
  ['sol-off', a?.modes?.sol?.enabled === false && a?.controls?.solEnabled === false],
  ['immutable-ledger', a?.ledger?.immutable === true && a?.ledger?.balanceDerived === true],
  ['rate-limits', a?.limits?.requestsPerMinute > 0 && a?.limits?.dailyCredits > 0],
  ['consent-and-delete', a?.privacy?.diaryRequiresConsent === true && a?.privacy?.historyDelete === true],
  ['kill-switch', a?.controls?.killSwitch === true]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'ORBE-AI-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
