import fs from 'node:fs';
import assert from 'node:assert/strict';

const css=fs.readFileSync(new URL('./cosmos-entry-intention-v610.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('./cosmos-entry-intention-v610.js',import.meta.url),'utf8');
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
  assert.ok(css.includes('min-inline-size:48px')||css.includes('min-width:48px'),`${name}: alvo mínimo`);checks+=1;
  assert.ok(css.includes('min-block-size:100dvh!important'),`${name}: viewport dinâmico`);checks+=1;
  assert.ok(css.includes('min-block-size:100svh!important'),`${name}: fallback Safari`);checks+=1;
  assert.ok(css.includes('env(safe-area-inset-top)')&&css.includes('env(safe-area-inset-bottom)'),`${name}: áreas seguras verticais`);checks+=1;
  assert.ok(css.includes('env(safe-area-inset-right)'),`${name}: pentagrama fora do notch`);checks+=1;
  assert.ok(css.includes('touch-action:manipulation'),`${name}: toque sem atraso`);checks+=1;
  assert.ok(css.includes('overscroll-behavior:contain'),`${name}: chegada estável`);checks+=1;
  assert.ok(css.includes('@media(max-width:430px)'),`${name}: regra compacta`);checks+=1;
  assert.ok(css.includes('orientation:landscape'),`${name}: paisagem curta`);checks+=1;
  assert.ok(css.includes('prefers-reduced-motion:reduce'),`${name}: movimento reduzido`);checks+=1;
  assert.ok(css.includes('forced-colors:active'),`${name}: contraste forçado`);checks+=1;
  assert.ok(css.includes('inline-size:calc(100% - 16px)!important'),`${name}: conteúdo sem corte lateral`);checks+=1;
  assert.ok(js.includes("worldOrbOpensMenu:false"),`${name}: Orbe não chama menu`);checks+=1;
  assert.ok(js.includes("worldOrbAction:'open-current-world'"),`${name}: gesto único`);checks+=1;
  assert.ok(!css.includes('infinite')&&!js.includes('setInterval('),`${name}: sem loop permanente`);checks+=1;

  const compact=width<=430;
  const anchor=Math.min(width*(compact?.88:.76),compact?330:360);
  assert.ok(anchor<=width-16,`${name}: Orbe cabe na largura segura`);checks+=1;
  const worldThreshold=orientation==='landscape'?210:Math.min(390,Math.max(230,height*.38));
  assert.ok(worldThreshold<height,`${name}: conteúdo real aparece sem tela infinita`);checks+=1;
}

console.log(`V633 iPhone: ${checks}/${checks} PASS`);
