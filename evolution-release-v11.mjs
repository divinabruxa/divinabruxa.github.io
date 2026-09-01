#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'EVOLUTION-ROADMAP-V11.json');
const e = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['staging-required', e?.governance?.stagingRequired === true],
  ['rollback-required', e?.governance?.rollbackRequired === true],
  ['public-changelog', e?.governance?.publicChangelog === true],
  ['quarterly-security', e?.governance?.securityReviewQuarterly === true],
  ['aggregated-experiments', e?.experiments?.aggregatedMetricsOnly === true],
  ['no-artificial-urgency', e?.experiments?.artificialUrgency === false],
  ['monthly-content', e?.cadence?.monthly === 'content-and-quality-release']
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'EVOLUTION-V11',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
