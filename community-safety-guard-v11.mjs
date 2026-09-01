#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'COMMUNITY-CONTRACT-V11.json');
const c = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['participation-opt-in', c?.privacy?.participationOptIn === true],
  ['diary-never-public', c?.privacy?.diaryNeverPublic === true],
  ['report-and-block', c?.safety?.report === true && c?.safety?.block === true],
  ['moderation-queue', c?.safety?.moderationQueue === true],
  ['anti-doxxing', c?.safety?.antiDoxxing === true],
  ['public-rules', c?.governance?.rulesPublic === true],
  ['forbidden-private-metrics', (c?.excludedMetrics?.length || 0) >= 3]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'COMMUNITY-SAFETY-V11',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
