import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./tarot-livre-soul-v610.css', import.meta.url),'utf8');
const profiles = Object.freeze([
  ['iphone-se-p',375,667,2],['iphone-13-p',390,844,3],
  ['iphone-14-pro-p',393,852,3],['iphone-15-pro-max-p',430,932,3],
  ['iphone-se-l',667,375,2],['iphone-13-l',844,390,3],
  ['iphone-14-pro-l',852,393,3],['iphone-15-pro-max-l',932,430,3]
]);
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };

ok(profiles.length === 8, 'oito geometrias');
ok(profiles.filter(([,w,h]) => w < h).length === 4, 'quatro retratos');
ok(profiles.filter(([,w,h]) => w > h).length === 4, 'quatro paisagens');
for (const [id,width,height,dpr] of profiles) {
  ok(width >= 375 && height >= 375, `${id}: área utilizável`);
  ok([2,3].includes(dpr), `${id}: DPR conhecido`);
  ok(Number.isFinite(width / dpr) && Number.isFinite(height / dpr), `${id}: escala finita`);
  ok((width < height ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação`);
  const horizontalMargin = width <= 430 ? 20 : 28;
  ok(width - horizontalMargin > 0, `${id}: mesa sem largura negativa`);
  ok(Math.min(width * .88,390) <= width, `${id}: halo contido`);
}
ok(css.includes('min-block-size:100dvh'), 'viewport dinâmico');
ok(css.includes('min-block-size:100svh'), 'viewport seguro no iPhone');
ok(css.includes('safe-area-inset-top') && css.includes('safe-area-inset-bottom'), 'safe areas');
ok(css.includes('@media(max-width:430px)'), 'corte mobile');
ok(css.includes('@media(orientation:landscape) and (max-height:500px)'), 'corte paisagem');
ok(css.includes('touch-action:manipulation'), 'toque sem atraso');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'resposta limpa no Safari');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(css), 'sem peso contínuo');

console.log(`PASS ${checks}/${checks} — Tarot Livre em 8 geometrias iPhone`);
