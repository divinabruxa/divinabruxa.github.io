#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'RELEASE-GATE-V10.json');
const g = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['p0-zero', g?.releasePolicy?.p0 === 0],
  ['p1-zero', g?.releasePolicy?.p1 === 0],
  ['staging-required', g?.releasePolicy?.stagingApproved === true],
  ['explicit-production-authorization', g?.releasePolicy?.explicitProductionAuthorization === true],
  ['rollback-ready', g?.releasePolicy?.rollbackReady === true],
  ['aggregate-telemetry', g?.telemetry?.aggregateOnly === true && g?.telemetry?.diaryBody === false],
  ['evidence-required', (g?.requiredEvidence?.length || 0) >= 6],
  ['sol-blocked', g?.blockedFlags?.includes('ORBE_AI_SOL_ENABLED=false')]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'BLOCKED';
console.log(JSON.stringify({gate:'RELEASE-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'BLOCKED'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
