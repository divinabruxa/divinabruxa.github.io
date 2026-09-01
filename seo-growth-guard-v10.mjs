#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'SEO-I18N-CONTRACT-V10.json');
const s = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['three-languages', s?.languages?.length === 3],
  ['private-noindex', (s?.noindexPrivate?.length || 0) >= 5],
  ['og-image', s?.requiredMeta?.includes('og:image')],
  ['structured-data', (s?.structuredData?.length || 0) >= 3],
  ['published-sitemap', s?.sitemap?.publishedOnly === true],
  ['utm-consent', s?.acquisition?.utmConsent === true],
  ['no-sensational-claims', s?.acquisition?.noSensationalClaims === true]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'SEO-I18N-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
