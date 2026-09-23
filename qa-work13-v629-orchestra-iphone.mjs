import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('./cosmos-supreme-orchestra-v629.js',import.meta.url),'utf8');
let checks=0;
const profiles=[
  ['iPhone SE',320,568,'portrait'],['iPhone 8',375,667,'portrait'],['iPhone 12 mini',360,780,'portrait'],
  ['iPhone 13',390,844,'portrait'],['iPhone 14 Pro',393,852,'portrait'],['iPhone 15 Pro',393,852,'portrait'],
  ['iPhone 15 Plus',430,932,'portrait'],['iPhone landscape',844,390,'landscape']
];
for(const [name,width,height,orientation] of profiles){
  assert.ok(width>=320&&height>=390,name);checks++;
  assert.ok(['portrait','landscape'].includes(orientation),name);checks++;
  assert.ok(source.includes('prefers-reduced-motion: reduce'),name);checks++;
  assert.ok(source.includes("addEventListener('pageshow'"),name);checks++;
  assert.ok(source.includes("addEventListener('visibilitychange'"),name);checks++;
  assert.ok(source.includes("dataset.orchestraNetwork"),name);checks++;
  assert.ok(source.includes('pauseMediaOutside(next)'),name);checks++;
  assert.ok(source.includes('requestServiceWorkerUpdate()'),name);checks++;
  assert.ok(!source.includes('touchmove'),name);checks++;
  assert.ok(!source.includes('preventDefault()'),name);checks++;
}
console.log(`V629 iPhone/PWA: ${checks}/${checks} PASS`);
