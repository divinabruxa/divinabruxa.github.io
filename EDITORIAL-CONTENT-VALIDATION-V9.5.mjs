import { readFileSync } from 'node:fs';
const data=readFileSync(new URL('./github-audit-v8-20260901/tarot-meanings.js',import.meta.url),'utf8');
const daily=readFileSync(new URL('./daily-editorial-contract-v9.js',import.meta.url),'utf8');
const ids=(data.match(/^    "name"\s*:/gm)||[]).length;
const normal=(data.match(/"orientation"\s*:\s*"normal"/g)||[]).length;
const checks=[
  ['78 editorial entries',ids===78],
  ['78 normal orientations',normal===78],
  ['deep daily fields',daily.includes('DAILY_FIELDS')&&daily.includes('reflectionQuestion')],
  ['Brasília timezone',daily.includes('America/Sao_Paulo')],
  ['one daily key per user/date',daily.includes('dailyKey')&&daily.includes('record?.userId')],
  ['reversed cards rejected',daily.includes('reversed!==true')],
  ['editorial normal-only guard',daily.includes("orientation==='normal'")],
  ['responsible notice is present',data.includes('responsibleNotice')||data.includes('não substitui')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-EDITORIAL-V9.5',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed,detectedEntries:ids,detectedNormal:normal},null,2));
process.exitCode=failed.length?1:0;
