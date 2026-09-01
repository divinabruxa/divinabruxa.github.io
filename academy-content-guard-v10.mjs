#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2] || process.cwd();
const file = path.join(root,'ACADEMY-CURRICULUM-V10.json');
const c = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : null;
const checks = [
  ['17-modules', (c?.modules?.length || 0) === 17],
  ['78-card-lessons', c?.cardLessons?.count === 78],
  ['deep-sections', (c?.cardLessons?.requiredSections?.length || 0) >= 10],
  ['learning-tools', (c?.learningTools?.length || 0) >= 6],
  ['substantive-lesson', c?.lessonMinimum?.mainTextWords >= 250],
  ['offline-premium', c?.progress?.offline === 'premium-downloaded-content']
];
const status = checks.every(([,ok])=>ok) ? 'PASS':'FAIL';
console.log(JSON.stringify({gate:'ACADEMY-V10',status,checks:checks.map(([check,ok])=>({check,status:ok?'PASS':'FAIL'}))},null,2));
process.exitCode = status === 'PASS' ? 0 : 1;
