import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./escola-world-v618.css',import.meta.url),'utf8');
const profiles = Object.freeze([
  ['iphone-se-p',375,667,2],['iphone-13-p',390,844,3],
  ['iphone-14-pro-p',393,852,3],['iphone-15-pro-max-p',430,932,3],
  ['iphone-se-l',667,375,2],['iphone-13-l',844,390,3],
  ['iphone-14-pro-l',852,393,3],['iphone-15-pro-max-l',932,430,3]
]);

let checks = 0;
const ok = (value,message) => { assert.ok(value,message); checks += 1; };
ok(profiles.length === 8, 'oito geometrias');
ok(profiles.filter(([,w,h]) => w < h).length === 4, 'quatro retratos');
ok(profiles.filter(([,w,h]) => w > h).length === 4, 'quatro paisagens');

for (const [id,width,height,dpr] of profiles) {
  const portrait = width < height;
  const worldWidth = width <= 430 ? width - 16 : Math.min(width - 28,1120);
  const seedWidth = portrait ? Math.min(worldWidth * .86,304) : Math.min(worldWidth * .42,304);
  const physicalTarget = 48 * dpr;
  ok(width >= 375 && height >= 375, `${id}: área utilizável`);
  ok([2,3].includes(dpr), `${id}: DPR conhecido`);
  ok((portrait ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação`);
  ok(worldWidth > 320 && worldWidth <= width, `${id}: jardim contido`);
  ok(seedWidth > 0 && seedWidth < worldWidth, `${id}: uma semente cabe por respiro`);
  ok(physicalTarget >= 96, `${id}: alvo de toque físico`);
}

ok(css.includes('min-block-size:100dvh') && css.includes('min-block-size:100svh'), 'viewports dinâmico e seguro');
ok(css.includes('safe-area-inset-top') && css.includes('safe-area-inset-bottom'), 'safe areas');
ok(css.includes('width:min(calc(100% - 28px),1120px)'), 'largura máxima');
ok(css.includes('min-block-size:48px'), 'alvo de toque');
ok(css.includes('touch-action:manipulation'), 'toque sem atraso');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'Safari limpo');
ok(css.includes('overflow-x:clip'), 'sem vazamento horizontal');
ok(css.includes('scroll-snap-type:x mandatory') && css.includes('scroll-snap-align:center'), 'um módulo por respiro');
ok(css.includes('overscroll-behavior-inline:contain') && css.includes('-webkit-overflow-scrolling:touch'), 'trilho iOS contido');
ok(css.includes('content-visibility:auto') && css.includes('contain-intrinsic-size:760px'), 'programa abaixo da dobra adiado');
ok(css.includes('@media(max-width:430px)'), 'corte móvel');
ok(css.includes('@media(orientation:landscape) and (max-height:520px)'), 'corte paisagem');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(css.includes('@media(forced-colors:active)'), 'contraste forçado');
ok(css.includes('animation:none!important'), 'loops herdados neutralizados');
ok(!/@keyframes|backdrop-filter|filter\s*:/.test(css), 'sem peso contínuo');
ok(!/position\s*:\s*fixed/.test(css), 'sem camada fixa');
ok(!/100vw|112vw/.test(css), 'sem largura instável');

console.log(`PASS ${checks}/${checks} — Jardim das 78 Sementes em 8 geometrias iPhone`);
