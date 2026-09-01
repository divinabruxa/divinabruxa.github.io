import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('./monetization-sandbox-v9.js',import.meta.url),'utf8');
const checks=[
  ['staging only',source.includes("BILLING_ENV='staging'")],
  ['premium price is R$199.90',source.includes('priceBRL:199.90')&&source.includes('premium-one-time')],
  ['orbe IA is monthly R$89.90',source.includes('orbe-ia-monthly')&&source.includes('priceBRL:89.90')],
  ['400 credits included',source.includes('credits:400')],
  ['credit packs defined',source.includes('credits:200')&&source.includes('credits:600')&&source.includes('credits:1500')],
  ['Luna and Terra costs protected',source.includes('luna:1')&&source.includes('terra:10')],
  ['Sol remains disabled',source.includes('sol:null')&&source.includes('orbeSol:false')],
  ['server-only checkout and dynamic methods',source.includes('serverOnly:true')&&source.includes('dynamicPaymentMethods:true')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-MONETIZATION-SANDBOX-V9.9',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
