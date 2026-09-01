import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('./notification-policy-v9.js',import.meta.url),'utf8');
const checks=[
  ['Brasília quiet hours',source.includes('start:22,end:8')&&source.includes('America/Sao_Paulo')],
  ['daily card category exists',source.includes("'daily-card'")],
  ['marketing defaults off',source.includes('marketing:false')],
  ['marketing opt-in required',source.includes("category!=='marketing'||marketingOptIn")],
  ['security can bypass quiet hours',source.includes("category==='account-security'||category==='billing'")],
  ['daily message does not reveal card',source.includes('espera por você')&&!source.includes('card.name')],
  ['deep links are allowlisted',source.includes('^#(?:daily|tarot|school|music|videos|consultations)$')],
  ['notification categories are finite',source.includes('CATEGORIES=Object.freeze')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-NOTIFICATIONS-V9.12',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
