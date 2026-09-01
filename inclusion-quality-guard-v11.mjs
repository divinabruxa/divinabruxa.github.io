#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'INCLUSION-I18N-CONTRACT-V11.json');
const c = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['wcag-aa', c?.accessibility?.wcagTarget === 'AA'],
  ['keyboard', c?.accessibility?.keyboardComplete === true],
  ['screen-reader', c?.accessibility?.screenReaderLabels === true],
  ['media-captions', c?.media?.captionsRequired === true && c?.media?.transcriptRequired === true],
  ['three-languages', c?.languages?.length === 3],
  ['human-translation-review', c?.localization?.humanReview === true],
  ['mixed-language-forbidden', c?.localization?.mixedLanguageForbidden === true],
  ['editorial-review', (c?.editorialReview?.length || 0) >= 5]
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'INCLUSION-QUALITY-V11',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
