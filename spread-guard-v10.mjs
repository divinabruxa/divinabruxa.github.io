#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'SPREAD-REGISTRY-V10.json');
const registry = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['at-least-24-spreads', (registry?.spreads?.length || 0) >= 24],
  ['78-card-deck', registry?.rules?.deckSize === 78],
  ['no-reversals', registry?.rules?.reversed === false],
  ['unique-cards', registry?.rules?.uniqueCardsPerReading === true],
  ['custom-builder-limited', registry?.customBuilder?.maxPositions <= 24]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'SPREADS-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
