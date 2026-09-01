import { readFileSync } from 'node:fs';
const js=readFileSync(new URL('./privacy-center-v9.js',import.meta.url),'utf8');
const css=readFileSync(new URL('./privacy-center-v9.css',import.meta.url),'utf8');
const checks=[
  ['local preference key exists',js.includes('divina-privacy-preferences-v9')],
  ['essential consent cannot be disabled',js.includes('essential:true')],
  ['optional consent can be revoked',js.includes('revokeOptionalConsent')&&js.includes('analytics:false')],
  ['diary body access is false',js.includes('diaryBodyAccess:false')],
  ['real sync remains blocked',js.includes('realSync:false')],
  ['notice states local-only behavior',js.includes('somente preferências essenciais')&&js.includes('não lê nem envia')],
  ['accessible action has button',js.includes('data-privacy-revoke')],
  ['mobile layout exists',css.includes('@media(max-width:520px)')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-PRIVACY-CENTER-V9.8',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
