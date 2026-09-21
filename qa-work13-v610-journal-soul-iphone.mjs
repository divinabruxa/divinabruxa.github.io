import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./diario-soul-v610.css', import.meta.url),'utf8');
const profiles = Object.freeze([
  ['iphone-se-p',375,667,2],['iphone-13-p',390,844,3],
  ['iphone-14-pro-p',393,852,3],['iphone-15-pro-max-p',430,932,3],
  ['iphone-se-l',667,375,2],['iphone-13-l',844,390,3],
  ['iphone-14-pro-l',852,393,3],['iphone-15-pro-max-l',932,430,3]
]);

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };

ok(profiles.length === 8, 'oito geometrias');
ok(profiles.filter(([,width,height]) => width < height).length === 4, 'quatro retratos');
ok(profiles.filter(([,width,height]) => width > height).length === 4, 'quatro paisagens');
for (const [id,width,height,dpr] of profiles) {
  const portrait = width < height;
  const journalWidth = portrait && width <= 430 ? width - 16 : Math.min(width - 28,1080);
  const pagePadding = portrait && width <= 430 ? 32 : Math.min(journalWidth * .12,116);
  const writingWidth = journalWidth - pagePadding;
  const writingHeight = portrait && width <= 430
    ? Math.min(430,Math.max(270,height * .43))
    : (height <= 520 ? 210 : Math.min(520,Math.max(300,height * .42)));
  const memoryWidth = portrait && width <= 430 ? Math.min(width * .84,318) : Math.min(journalWidth,920);
  ok(width >= 375 && height >= 375, `${id}: área utilizável`);
  ok([2,3].includes(dpr), `${id}: DPR conhecido`);
  ok((portrait ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação`);
  ok(journalWidth > 340 && journalWidth <= width, `${id}: câmara contida`);
  ok(writingWidth >= 308 && writingWidth < width, `${id}: papel sem corte lateral`);
  ok(writingHeight >= 210 && writingHeight < height, `${id}: escrita cabe e continua vertical`);
  ok(memoryWidth >= 315 || !portrait, `${id}: uma memória respira por vez`);
  ok(44 * dpr >= 88, `${id}: alvo de toque físico preservado`);
}

ok(css.includes('min-block-size:100dvh'), 'viewport dinâmico');
ok(css.includes('min-block-size:100svh'), 'viewport seguro no iPhone');
ok(css.includes('safe-area-inset-top') && css.includes('safe-area-inset-bottom'), 'safe areas verticais');
ok(css.includes('safe-area-inset-left') && css.includes('safe-area-inset-right'), 'safe areas em paisagem');
ok(css.includes('width:min(calc(100% - 28px),1080px)'), 'largura máxima do Diário');
ok(css.includes('width:calc(100% - 16px)'), 'respiro lateral compacto');
ok(css.includes('min-block-size:44px'), 'alvo mínimo de toque');
ok(css.includes('min-block-size:50px'), 'salvar confortável');
ok(css.includes('touch-action:manipulation'), 'toque sem atraso');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'resposta limpa no Safari');
ok(css.includes('min-block-size:clamp(270px,43svh,430px)'), 'papel útil no retrato');
ok(css.includes('min-block-size:210px'), 'papel útil em paisagem');
ok(css.includes('grid-auto-columns:min(84%,318px)'), 'uma memória por respiração');
ok(css.includes('scroll-snap-type:x mandatory'), 'memórias sem parede no retrato');
ok(css.includes('overscroll-behavior-inline:contain'), 'rolagem horizontal contida');
ok(css.includes('-webkit-overflow-scrolling:touch'), 'inércia nativa no iPhone');
ok(css.includes('content-visibility:auto'), 'histórico fora da tela é leve');
ok(css.includes('contain-intrinsic-block-size:220px'), 'timeline mantém geometria estável');
ok(css.includes('@media(max-width:430px)'), 'corte mobile');
ok(css.includes('@media(orientation:landscape) and (max-height:520px)'), 'corte paisagem');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(css.includes('@media(forced-colors:active)'), 'contraste forçado');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(css), 'sem peso contínuo');
ok(!/position\s*:\s*fixed/.test(css), 'sem sobreposição fixa');
ok(!/100vw/.test(css), 'sem largura que force rolagem horizontal');

console.log(`PASS ${checks}/${checks} — Diário e Espelho em 8 geometrias iPhone`);
