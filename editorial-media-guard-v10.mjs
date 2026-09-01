#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const contractPath = path.join(root,'EDITORIAL-CONTENT-CONTRACT-V10.json');
const catalogPath = path.join(root,'MEDIA-CATALOG-V10.json');
const c = fs.existsSync(contractPath) ? JSON.parse(fs.readFileSync(contractPath,'utf8')) : null;
const m = fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath,'utf8')) : null;
const checks = [
  ['workflow-states', (c?.states?.length || 0) >= 6],
  ['rights-required', c?.publishingRules?.rightsRequired === true],
  ['unpublished-hidden', c?.publishingRules?.unpublishedHidden === true],
  ['published-sitemap-only', c?.publishingRules?.sitemapOnlyPublished === true],
  ['media-catalog', (m?.catalogs?.length || 0) >= 3],
  ['truth-rule', m?.truthRule === 'only published items appear to visitors']
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'EDITORIAL-MEDIA-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
