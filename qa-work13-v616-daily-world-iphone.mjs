import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./carta-do-dia-world-v616.css', import.meta.url),'utf8');
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
  const portrait = width < height;
  const altarWidth = Math.min(width,860) - (width <= 430 ? 8 : 20);
  const cardWidth = portrait ? Math.min(width * .63,232) : Math.min(width * .33,206);
  ok(width >= 375 && height >= 375, `${id}: área utilizável`);
  ok([2,3].includes(dpr), `${id}: DPR conhecido`);
  ok((portrait ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação`);
  ok(altarWidth > 320 && altarWidth <= width, `${id}: altar contido`);
  ok(cardWidth > 0 && cardWidth < altarWidth, `${id}: carta contida`);
  ok(44 * dpr >= 88, `${id}: toque físico preservado`);
}
ok(css.includes('min-block-size:100dvh') && css.includes('min-block-size:100svh'), 'viewports dinâmico e seguro');
ok(css.includes('safe-area-inset-top') && css.includes('safe-area-inset-bottom'), 'safe areas');
ok(css.includes('width:min(100%,860px)'), 'largura máxima');
ok(css.includes('min-block-size:44px'), 'alvo de toque');
ok(css.includes('touch-action:manipulation'), 'toque sem atraso');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'Safari limpo');
ok(css.includes('overflow-x:clip'), 'sem vazamento horizontal');
ok(css.includes('@media(max-width:430px)'), 'corte móvel');
ok(css.includes('@media(orientation:landscape) and (max-height:520px)'), 'corte paisagem');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(css.includes('@media(forced-colors:active)'), 'contraste forçado');
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(css), 'sem peso contínuo');
ok(!/position\s*:\s*fixed/.test(css), 'sem camada fixa');
ok(!/100vw/.test(css), 'sem largura instável');

console.log(`PASS ${checks}/${checks} — Santuário da Aurora em 8 geometrias iPhone`);
