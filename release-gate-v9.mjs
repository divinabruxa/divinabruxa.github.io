import { readFileSync, existsSync } from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('./PROGRESSIVE-RELEASE-V9.15.json',import.meta.url),'utf8'));
const required=['qa-supreme-v9.mjs','QA-MATRIX-V9.13.csv','DIVINA-BRUXA-V9-MACROETAPA-14-QA-SUPREMO.zip','DIVINA-BRUXA-V9-MACROETAPA-13-NOTIFICACOES.zip','DIVINA-BRUXA-V9-MACROETAPA-12-MUSICA-VIDEOS.zip'];
const checks=[
  ['channel is staging',manifest.channel==='staging'],
  ['production publish blocked',manifest.gates.production_publish_authorized===false],
  ['DNS changes blocked',manifest.gates.dns_changes_authorized===false],
  ['real billing blocked',manifest.gates.real_billing_authorized===false],
  ['store submission blocked',manifest.gates.store_submission_authorized===false],
  ['Orbe IA Sol blocked',manifest.gates.orbe_ai_sol_enabled===false],
  ['rollback is documented',typeof manifest.rollback==='string'&&manifest.rollback.length>10],
  ['preservation list is complete',manifest.preserve.includes('78 cards')&&manifest.preserve.includes('skin assets')&&manifest.preserve.includes('orb engine')],
  ['QA artifacts exist',required.every(file=>existsSync(new URL(`./${file}`,import.meta.url)))]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-RELEASE-GATE-V9.15',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed,stages:manifest.stages},null,2));
process.exitCode=failed.length?1:0;
