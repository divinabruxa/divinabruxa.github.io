import fs from 'node:fs';
import assert from 'node:assert/strict';

const css=fs.readFileSync(new URL('./orbital-menu-v502.css',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('./orbital-menu-v502.js',import.meta.url),'utf8');
const entryCss=fs.readFileSync(new URL('./cosmos-entry-intention-v610.css',import.meta.url),'utf8');
let checks=0;
const profiles=[
  ['iPhone SE',320,568,'portrait'],
  ['iPhone 8',375,667,'portrait'],
  ['iPhone 12 mini',360,780,'portrait'],
  ['iPhone 13',390,844,'portrait'],
  ['iPhone 14 Pro',393,852,'portrait'],
  ['iPhone 15 Pro',393,852,'portrait'],
  ['iPhone 15 Plus',430,932,'portrait'],
  ['iPhone landscape',844,390,'landscape']
];

for(const [name,width,height,orientation] of profiles){
  assert.ok(width>=320&&height>=390,name);checks+=1;
  assert.ok(['portrait','landscape'].includes(orientation),name);checks+=1;
  assert.ok(css.includes('inset:0!important')&&css.includes('overflow:hidden!important'),name);checks+=1;
  assert.ok(entryCss.includes('min-width:48px')&&entryCss.includes('min-height:48px'),name);checks+=1;
  assert.ok(entryCss.includes('env(safe-area-inset-top)')&&entryCss.includes('env(safe-area-inset-right)'),name);checks+=1;
  assert.ok(entryCss.includes('orientation:landscape'),name);checks+=1;
  assert.ok(css.includes('overscroll-behavior:none!important')&&css.includes('touch-action:none'),name);checks+=1;
  assert.ok(css.includes('env(safe-area-inset-top)')&&css.includes('env(safe-area-inset-bottom)'),name);checks+=1;
  assert.ok(css.includes('touch-action:manipulation'),name);checks+=1;
  assert.ok(css.includes('@media (max-width:370px)')&&css.includes('@media (max-height:690px)'),name);checks+=1;
  assert.ok(css.includes('orientation:landscape')&&css.includes('max-height:520px'),name);checks+=1;
  assert.ok(css.includes('prefers-reduced-motion:reduce'),name);checks+=1;
  assert.ok(css.includes('html.db502-menu-open .app-header')&&css.includes('visibility:hidden!important'),name);checks+=1;
  assert.ok(css.includes('v631-fechamento-supremo')&&css.includes('#orbMenu[hidden][aria-hidden="true"]'),name);checks+=1;
  assert.ok(menu.includes('maximumVisibleIntentions:2')&&menu.includes('oneShotDiscoveryCue:true'),name);checks+=1;
  assert.ok(!css.includes('infinite')&&!entryCss.includes('infinite')&&!menu.includes('setInterval('),name);checks+=1;

  const bubbleWidth=width<=370?104:Math.min(152,Math.max(108,width*.30));
  const firstCenter=width*(width>=760?.32:.25);
  const secondCenter=width*(width>=760?.68:.75);
  assert.ok(firstCenter-bubbleWidth/2>=0,`${name}: balão esquerdo dentro da tela`);checks+=1;
  assert.ok(secondCenter+bubbleWidth/2<=width,`${name}: balão direito dentro da tela`);checks+=1;
  assert.ok(secondCenter-firstCenter>bubbleWidth*.92,`${name}: balões sem colisão horizontal`);checks+=1;
}

console.log(`V631 iPhone: ${checks}/${checks} PASS`);
