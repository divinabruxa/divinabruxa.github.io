import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('./commerce-catalog-v9.js',import.meta.url),'utf8');
const checks=[
  ['operations email defined',source.includes('orbedasrealidades@hotmail.com')],
  ['Mesa Real R$250',source.includes('mesa-real-profissional')&&source.includes('priceBRL:250')],
  ['Leitura de Mentes R$150',source.includes('leitura-mentes')&&source.includes('priceBRL:150')],
  ['Conselho R$100',source.includes('carta-conselho')&&source.includes('priceBRL:100')],
  ['Pergunta R$50',source.includes('pergunta-direta')&&source.includes('priceBRL:50')],
  ['phone is required',source.includes("'phone'")],
  ['validated email and service',source.includes("service")&&source.includes("test(String(form.email)")],
  ['affiliate disclosure exists',source.includes('comissão por compras qualificadas')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-COMMERCE-V9.10',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
