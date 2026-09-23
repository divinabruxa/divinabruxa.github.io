import fs from 'node:fs';
import assert from 'node:assert/strict';
const css=fs.readFileSync(new URL('./notifications-world-v628.css',import.meta.url),'utf8');
let checks=0;
const profiles=[
  ['iPhone SE',320,568],['iPhone 8',375,667],['iPhone 12 mini',360,780],['iPhone 13',390,844],
  ['iPhone 14 Pro',393,852],['iPhone 15 Pro',393,852],['iPhone 15 Plus',430,932],['iPhone landscape',844,390]
];
for(const [name,width,height] of profiles){
  assert.ok(width>=320&&height>=390,name);checks++;
  assert.ok(css.includes('width:min(100%,760px)'),name);checks++;
  assert.ok(css.includes('box-sizing:border-box'),name);checks++;
  assert.ok(css.includes('env(safe-area-inset-bottom)'),name);checks++;
  assert.ok(css.includes('min-height:48px'),name);checks++;
  assert.ok(css.includes('font-size:16px'),name);checks++;
  assert.ok(!css.includes('100vw'),name);checks++;
  assert.ok(!css.includes('position:fixed'),name);checks++;
}
console.log(`V628 iPhone: ${checks}/${checks} PASS`);
