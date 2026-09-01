#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const css = fs.existsSync(path.join(root,'PORTAL-TRANSITIONS-V10.css')) ? fs.readFileSync(path.join(root,'PORTAL-TRANSITIONS-V10.css'),'utf8') : '';
const js = fs.existsSync(path.join(root,'portal-transition-v10.js')) ? fs.readFileSync(path.join(root,'portal-transition-v10.js'),'utf8') : '';
const checks = [
  ['layer-style', css.includes('db-portal-layer')],
  ['reduced-motion', css.includes('prefers-reduced-motion')],
  ['explicit-factory', js.includes('createPortalTransition')],
  ['max-duration', /850/.test(css) || /850/.test(js)
];
const status = checks.every(([,ok])=>ok) ? 'PASS' : 'FAIL';
console.log(JSON.stringify({gate:'PORTAL-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
