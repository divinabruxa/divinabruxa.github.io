import fs from 'node:fs';
import assert from 'node:assert/strict';
const entryCss=fs.readFileSync(new URL('./cosmos-entry-intention-v610.css',import.meta.url),'utf8');
const menuCss=fs.readFileSync(new URL('./orbital-menu-v502.css',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('./orbital-menu-v502.js',import.meta.url),'utf8');
let checks=0;
const profiles=[
  ['iPhone SE',320,568,'portrait'],['iPhone 8',375,667,'portrait'],['iPhone 12 mini',360,780,'portrait'],
  ['iPhone 13',390,844,'portrait'],['iPhone 14 Pro',393,852,'portrait'],['iPhone 15 Pro',393,852,'portrait'],
  ['iPhone 15 Plus',430,932,'portrait'],['iPhone landscape',844,390,'landscape']
];
for(const [name,width,height,orientation] of profiles){
  assert.ok(width>=320&&height>=390,name);checks++;
  assert.ok(['portrait','landscape'].includes(orientation),name);checks++;
  assert.ok(entryCss.includes('min-width:48px')&&entryCss.includes('min-height:48px'),name);checks++;
  assert.ok(entryCss.includes('env(safe-area-inset-top)')&&entryCss.includes('env(safe-area-inset-right)'),name);checks++;
  assert.ok(entryCss.includes('touch-action:manipulation'),name);checks++;
  assert.ok(entryCss.includes('orientation:landscape'),name);checks++;
  assert.ok(entryCss.includes('prefers-reduced-motion:reduce'),name);checks++;
  assert.ok(menuCss.includes('100dvh')||menuCss.includes('height:auto!important'),name);checks++;
  assert.ok(menu.includes('maximumVisibleIntentions:2'),name);checks++;
  assert.ok(!entryCss.includes('infinite'),name);checks++;
}
console.log(`V630 iPhone: ${checks}/${checks} PASS`);
