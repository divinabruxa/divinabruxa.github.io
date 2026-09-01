import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('github-audit-v8-20260901');
const output = 'AUDIT-INVENTORY-V9.0.json';
const gitFiles = fs.readFileSync(path.join(root, '.git', 'shallow'), 'utf8').trim() ? null : null;
const files = fs.readdirSync(root).filter((name) => name !== '.git').sort((a, b) => a.localeCompare(b));

const classify = (name) => {
  if (name === 'index.html' || name === 'app.js' || name === 'config.js' || name === 'sw.js' || name === 'manifest.webmanifest') return 'active-entry';
  if (/^carta-.*\.html$/.test(name)) return 'card-editorial';
  if (/^card-\d{2}\.(?:webp|jpg|png)$/i.test(name)) return 'card-asset';
  if (/^skin-.*\.png$/i.test(name)) return 'skin-asset';
  if (/^(404|offline)\.html$/.test(name)) return 'error-or-offline';
  if (/-v8\./.test(name) || /V8/.test(name)) return 'v8-candidate';
  if (/-v[4567]\./.test(name) || /(?:^|[-_])(v47|v48|v64|v68|v72|v76|v77|v80|v83|v84|v85|v87|v88|v89|v90|v124)(?:[-_.]|$)/i.test(name)) return 'legacy-versioned';
  return 'supporting-or-unclassified';
};

const entries = files.map((name) => {
  const full = path.join(root, name);
  const stat = fs.statSync(full);
  const bytes = fs.readFileSync(full);
  return { name, bytes: stat.size, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), category: classify(name) };
});

const byCategory = Object.fromEntries([...new Set(entries.map((entry) => entry.category))].sort().map((category) => [category, entries.filter((entry) => entry.category === category).length]));
const duplicateGroups = Object.values(entries.reduce((groups, entry) => { (groups[entry.sha256] ||= []).push(entry.name); return groups; }, {})).filter((group) => group.length > 1);
const result = {
  project: 'Divina Bruxa — Orbe das Realidades',
  repository: 'divinabruxa/divinabruxa.github.io',
  branch: 'main',
  commit: '8ab7dbabe29d4c7dd53ef36718b12773754b7aa0',
  auditedAt: '2026-09-01',
  checkoutRoot: 'github-audit-v8-20260901',
  totalFiles: entries.length,
  totalBytes: entries.reduce((total, entry) => total + entry.bytes, 0),
  byCategory,
  duplicateGroups,
  authoritativeCurrentRuntime: ['index.html', 'app.js', 'config.js', 'sw.js', 'manifest.webmanifest'],
  v8CandidateRuntime: entries.filter((entry) => entry.category === 'v8-candidate').map((entry) => entry.name),
  files: entries
};
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ suite: 'DIVINA-BRUXA-INVENTORY-V9.0', status: 'PASS', totalFiles: result.totalFiles, totalBytes: result.totalBytes, duplicateGroups: result.duplicateGroups.length, output }, null, 2));

