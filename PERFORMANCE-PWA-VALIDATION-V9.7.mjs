import { readFileSync } from 'node:fs';
const js=readFileSync(new URL('./performance-runtime-v9.js',import.meta.url),'utf8');
const css=readFileSync(new URL('./performance-runtime-v9.css',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('./manifest.webmanifest',import.meta.url),'utf8'));
const checks=[
  ['manifest parses',manifest.name==='Divina Bruxa — Orbe das Realidades'],
  ['standalone PWA',manifest.display==='standalone'&&manifest.scope==='./'],
  ['shortcuts exist',Array.isArray(manifest.shortcuts)&&manifest.shortcuts.length>=2],
  ['network state tracked',js.includes("data-network")&&js.includes("addEventListener('offline'" )],
  ['lazy loading enabled',js.includes("loading='lazy'")],
  ['intersection observer enabled',js.includes('IntersectionObserver')],
  ['reduced motion supported',css.includes('prefers-reduced-motion')],
  ['offline online actions guarded',css.includes('data-requires-online')]
];
const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-PWA-PERFORMANCE-V9.7',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
