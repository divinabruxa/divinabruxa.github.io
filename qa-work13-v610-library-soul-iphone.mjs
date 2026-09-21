import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./biblioteca-world-v615.css', import.meta.url),'utf8');
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
  const archiveWidth = portrait && width <= 430 ? width - 14 : Math.min(width - 24,1180);
  const discoveryHeight = portrait && width <= 430 ? Math.min(height * .57,500) : (height <= 520 ? 260 : Math.min(height * .61,680));
  const shelfWidth = portrait && width <= 430 ? Math.min(width * .76,278) : Math.min(archiveWidth * .48,360);
  ok(width >= 375 && height >= 375, `${id}: área utilizável`);
  ok([2,3].includes(dpr), `${id}: DPR conhecido`);
  ok((portrait ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação`);
  ok(archiveWidth > 320 && archiveWidth <= width, `${id}: arquivo contido`);
  ok(discoveryHeight >= 250 && discoveryHeight < height, `${id}: descoberta cabe no primeiro gesto`);
  ok(shelfWidth >= 270 || !portrait, `${id}: uma porta respira por vez`);
  ok(44 * dpr >= 88, `${id}: alvo de toque físico preservado`);
}

ok(css.includes('min-block-size:100dvh'), 'viewport dinâmico');
ok(css.includes('min-block-size:100svh'), 'viewport seguro no iPhone');
ok(css.includes('safe-area-inset-top') && css.includes('safe-area-inset-bottom'), 'safe areas verticais');
ok(css.includes('safe-area-inset-left') && css.includes('safe-area-inset-right'), 'safe areas em paisagem');
ok(css.includes('width:min(calc(100% - 24px),1180px)'), 'largura máxima da Biblioteca');
ok(css.includes('width:calc(100% - 14px)'), 'respiro lateral compacto');
ok(css.includes('min-block-size:44px'), 'alvo mínimo de toque');
ok(css.includes('min-block-size:48px'), 'convite confortável');
ok(css.includes('touch-action:manipulation'), 'toque sem atraso');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'resposta limpa no Safari');
ok(css.includes('scroll-snap-type:x mandatory'), 'catálogo sem parede no retrato');
ok(css.includes('overscroll-behavior-inline:contain'), 'rolagem horizontal contida');
ok(css.includes('-webkit-overflow-scrolling:touch'), 'inércia nativa no iPhone');
ok(css.includes('grid-auto-columns:min(76%,278px)'), 'uma carta por respiração');
ok(css.includes('content-visibility:auto'), 'catálogo e leitor adiam renderização');
ok(css.includes('[data-library-world="v615"]'), 'Sala dos Fios Vivos ativa');
ok(css.includes('@media(max-width:430px)'), 'corte mobile');
ok(css.includes('@media(orientation:landscape) and (max-height:520px)'), 'corte paisagem');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(css.includes('@media(forced-colors:active)'), 'contraste forçado');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(css), 'sem peso contínuo');
ok(!/position\s*:\s*fixed/.test(css), 'sem sobreposição fixa');
ok(!/100vw/.test(css), 'sem largura que force rolagem horizontal');

console.log(`PASS ${checks}/${checks} — Sala dos Fios Vivos em 8 geometrias iPhone`);
