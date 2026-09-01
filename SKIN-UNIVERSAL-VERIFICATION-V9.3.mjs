import { readFileSync } from 'node:fs';
const bridge=readFileSync(new URL('./orb-skin-bridge-v9.js',import.meta.url),'utf8');
const css=readFileSync(new URL('./skin-universal-v9.css',import.meta.url),'utf8');
const checks=[
  ['bridge marks primary orb',bridge.includes('.orb,.orb--hero,.orb--dock')],
  ['bridge marks menu and mini orbs',bridge.includes('.mini-orb')&&bridge.includes('.home-orb-menu')],
  ['bridge marks table orb',bridge.includes('.table-orb')],
  ['bridge reacts to skin event',bridge.includes('orbe:skin-change')],
  ['bridge observes dynamic surfaces',bridge.includes('MutationObserver')],
  ['css applies skin image to orb surfaces',css.includes('.orb[data-orbe-surface]')],
  ['reduced motion is honored',css.includes('prefers-reduced-motion')],
  ['no destructive operation',!bridge.includes('remove(')&&!bridge.includes('delete(')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-SKIN-UNIVERSAL-V9.3',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
