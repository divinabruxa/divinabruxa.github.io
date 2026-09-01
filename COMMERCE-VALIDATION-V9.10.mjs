import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('./commerce-catalog-v9.js',import.meta.url),'utf8');
const checks=[
  ['operations email defined',source.includes('orbedasrealidades@hotmail.com')],
  ['Mesa Real R$500',source.includes('mesa-real-profissional')&&source.includes('priceBRL:500')],
  ['Pensamentos R$500',source.includes('leitura-de-pensamentos')],
  ['Conselho R$300',source.includes('carta-de-conselho')&&source.includes('priceBRL:300')],
  ['Pergunta R$150',source.includes("pergunta:Object.freeze")&&source.includes('priceBRL:150')],
  ['phone is required',source.includes("'phone'")],
  ['validated email and service',source.includes("service")&&source.includes("test(String(form.email)")],
  ['affiliate disclosure exists',source.includes('comissão por compras qualificadas')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-COMMERCE-V9.10',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
