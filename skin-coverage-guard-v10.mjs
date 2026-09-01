#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const files = fs.existsSync(root) ? fs.readdirSync(root) : [];
const pngSkins = files.filter(f => /^skin-.*\.png$/i.test(f));
const surfaces = ['main-orb','menu-orb','header-orb','dock-orb','table-orb','context-orb','ai-orb'];
const result = {
  gate: 'SKIN-COVERAGE-V10',
  root,
  sourceSkinFiles: pngSkins.length,
  requiredSurfaceCount: surfaces.length,
  expectedAssertions: Math.max(pngSkins.length, 30) * surfaces.length * 6,
  status: pngSkins.length >= 30 ? 'PASS' : 'BLOCKED',
  note: 'Presence of PNGs does not prove that runtime swapping works; browser assertions remain mandatory.'
};
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.status === 'PASS' ? 0 : 1;
