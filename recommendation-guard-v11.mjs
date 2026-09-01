#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'RECOMMENDATION-CONTRACT-V11.json');
const r = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['allowed-signals', (r?.allowedSignals?.length || 0) >= 5],
  ['sensitive-forbidden', (r?.forbiddenSignals?.length || 0) >= 6],
  ['explanation-required', r?.explanation?.required === true],
  ['opt-out', r?.controls?.optOut === true],
  ['ads-disabled', r?.controls?.adsUseRecommendations === false],
  ['aggregate-metrics', r?.metrics === 'aggregate-only'],
  ['fallback', r?.fallback === 'editorial-default']
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'RECOMMENDATION-V11',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
