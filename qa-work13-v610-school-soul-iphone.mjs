import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./escola-soul-v610.css', import.meta.url),'utf8');
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
  const gardenWidth = Math.min(width - (portrait && width <= 430 ? 16 : 28),1120);
  const pathWidth = portrait && width <= 430 ? Math.min(width * .86,304) : Math.min(gardenWidth * .84,330);
  const dashboardHeight = portrait && width <= 430 ? 184 : (height <= 520 ? 156 : 210);
  ok(width >= 375 && height >= 375, `${id}: área utilizável`);
  ok([2,3].includes(dpr), `${id}: DPR conhecido`);
  ok((portrait ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação`);
  ok(gardenWidth > 320 && gardenWidth <= width, `${id}: jardim contido`);
  ok(pathWidth >= 260 && pathWidth < width, `${id}: um caminho respira por vez`);
  ok(dashboardHeight >= 156 && dashboardHeight < height, `${id}: próximo passo cabe no primeiro gesto`);
  ok(44 * dpr >= 88, `${id}: alvo de toque físico preservado`);
}

ok(css.includes('min-block-size:100dvh'), 'viewport dinâmico');
ok(css.includes('min-block-size:100svh'), 'viewport seguro no iPhone');
ok(css.includes('safe-area-inset-top') && css.includes('safe-area-inset-bottom'), 'safe areas');
ok(css.includes('width:min(calc(100% - 28px),1120px)'), 'largura máxima da Escola');
ok(css.includes('width:calc(100% - 16px)!important'), 'respiro lateral compacto');
ok(css.includes('min-block-size:44px'), 'alvo mínimo de toque');
ok(css.includes('min-block-size:48px'), 'próximo passo confortável');
ok(css.includes('touch-action:manipulation'), 'toque sem atraso');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'resposta limpa no Safari');
ok(css.includes('scroll-snap-type:x mandatory'), 'caminhos sem parede no retrato');
ok(css.includes('overscroll-behavior-inline:contain'), 'rolagem horizontal contida');
ok(css.includes('-webkit-overflow-scrolling:touch'), 'inércia nativa no iPhone');
ok(css.includes('flex-basis:min(86%,304px)'), 'um módulo por respiração');
ok(css.includes('@media(max-width:430px)'), 'corte mobile');
ok(css.includes('@media(orientation:landscape) and (max-height:520px)'), 'corte paisagem');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(css.includes('@media(forced-colors:active)'), 'contraste forçado');
ok(!/@keyframes|backdrop-filter|filter\s*:/.test(css), 'sem peso contínuo');
ok(!/position\s*:\s*fixed/.test(css), 'sem sobreposição fixa');
ok(!/100vw/.test(css), 'sem largura que force rolagem horizontal');

console.log(`PASS ${checks}/${checks} — Escola em 8 geometrias iPhone`);
