import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('./tarot-core-contract-v9.js',import.meta.url),'utf8');
const session=readFileSync(new URL('./github-audit-v8-20260901/tarot-session.js',import.meta.url),'utf8');
const checks=[
  ['deck size is 78',source.includes('cards:78')&&session.includes('DECK_SIZE = 78')],
  ['orientation is normal only',source.includes("orientation:'normal'")&&session.includes('normalOnly: true')],
  ['no repeated cards',source.includes('repetition:false')&&session.includes('new Set(all).size')],
  ['13 by 6 table contract',source.includes('rows:13,columns:6')&&source.includes('index%6+1')],
  ['draw operation exists',source.includes('drawNextCard')],
  ['reset operation exists',source.includes('resetTarotState')],
  ['remaining shuffle exists',source.includes('shuffleRemainingCards')],
  ['no reversed orientation',!source.match(/revers|invert/i)]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-TAROT-CORE-V9.4',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
