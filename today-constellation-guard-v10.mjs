#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const contractPath = path.join(root,'TODAY-CONSTELLATION-CONTRACT-V10.json');
const contract = fs.existsSync(contractPath) ? JSON.parse(fs.readFileSync(contractPath,'utf8')) : null;
const checks = [
  ['timezone-brasilia', contract?.timezone === 'America/Sao_Paulo'],
  ['one-card-per-day', contract?.dailyCard?.onePerDay === true],
  ['no-reversed', contract?.dailyCard?.reversed === false],
  ['no-punishment', contract?.retention?.noPunishment === true],
  ['privacy-analytics', contract?.privacy?.journalBodyExcludedFromAnalytics === true],
  ['quiet-hours', Boolean(contract?.retention?.quietHours)]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'TODAY-CONSTELLATION-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
