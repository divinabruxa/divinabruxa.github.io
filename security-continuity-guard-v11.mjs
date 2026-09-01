#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'SECURITY-CONTINUITY-CONTRACT-V11.json');
const c = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['mfa', c?.controls?.includes('mfa')],
  ['environment-separation', c?.controls?.includes('environment-separation')],
  ['backup-restore', c?.controls?.includes('restore-test')],
  ['status-page', c?.controls?.includes('status-page')],
  ['incident-flow', (c?.incidentSteps?.length || 0) >= 7],
  ['safe-payment-failure', c?.safeFailure?.payments === 'no-access-grant'],
  ['diary-out-of-logs', c?.privacy?.diaryBodyInLogs === false],
  ['exercise-matrix', (c?.exercises?.length || 0) >= 6]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'SECURITY-CONTINUITY-V11',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
