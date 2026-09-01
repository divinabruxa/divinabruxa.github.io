#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'BACKEND-DATA-MAP-V10.json');
const c = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['staging-production-isolated', c?.environments?.staging === 'isolated' && c?.environments?.production === 'isolated'],
  ['rls-every-table', c?.security?.rls === 'enabled-on-every-exposed-table'],
  ['default-deny', c?.security?.defaultPolicy === 'deny'],
  ['service-role-backend-only', c?.security?.serviceRole === 'backend-only'],
  ['server-controlled-authz', c?.security?.authorizationSource === 'server-controlled-app-metadata'],
  ['diary-admin-aggregate-only', c?.ownership?.adminAggregatesOnly?.includes('diary_entries')],
  ['analytics-aggregate-only', c?.retention?.analytics === 'aggregate-only']
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'BACKEND-SECURITY-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
