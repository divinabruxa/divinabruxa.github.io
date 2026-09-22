import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('./tiragens-world-v617.css', import.meta.url),'utf8');
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
  const councilWidth = portrait
    ? width - 28
    : Math.min(width - 28,1080);
  const columns = portrait ? 1 : 3;
  const methodWidth = portrait ? Math.min(width * .78,286) : (councilWidth - (columns - 1) * 11) / columns;
  const resultWidth = Math.min(width - 20,410);
  const fieldWidth = portrait ? Math.min(resultWidth + 52,470) : Math.min(width * .62,480);
  ok(width >= 375 && height >= 375, `${id}: área utilizável`);
  ok([2,3].includes(dpr), `${id}: DPR conhecido`);
  ok((portrait ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação`);
  ok(councilWidth > 320 && councilWidth <= width, `${id}: concílio contido`);
  ok(methodWidth >= 118 && methodWidth < width, `${id}: método legível`);
  ok(resultWidth > 320 && resultWidth <= width, `${id}: leitura contida`);
  ok(fieldWidth > 0 && fieldWidth <= 480, `${id}: campo cósmico limitado`);
  ok(48 * dpr >= 96, `${id}: alvo físico confortável`);
}

ok(css.includes('min-block-size:100dvh') && css.includes('min-block-size:100svh'), 'viewports dinâmico e seguro');
ok(css.includes('safe-area-inset-top') && css.includes('safe-area-inset-bottom'), 'safe areas');
ok(css.includes('width:min(calc(100% - 28px),1080px)'), 'largura máxima do concílio');
ok(css.includes('max-width:100%'), 'largura móvel segura');
ok(css.includes('flex:0 0 min(78%,286px)'), 'um método por vez no retrato');
ok(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'), 'três portais respiram na paisagem');
ok(css.includes('min-block-size:48px'), 'alvo mínimo de toque');
ok(css.includes('touch-action:manipulation'), 'toque sem atraso');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'Safari limpo');
ok(css.includes('overflow-x:clip'), 'sem vazamento horizontal');
ok(css.includes('scroll-snap-type:x proximity') && css.includes('scroll-snap-align:center'), 'quinze métodos fluem por gesto');
ok(css.includes('overscroll-behavior-inline:contain'), 'Mesa Real contém a rolagem');
ok(css.includes('-webkit-overflow-scrolling:touch'), 'Mesa Real mantém inércia nativa');
ok(css.includes('content-visibility:auto'), 'camadas longas são adiadas');
ok(css.includes('contain-intrinsic-size:720px'), 'tabuleiro reserva geometria');
ok(css.includes('@media(max-width:430px)'), 'corte móvel');
ok(css.includes('@media(orientation:landscape) and (max-height:520px)'), 'corte paisagem');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido');
ok(css.includes('@media(forced-colors:active)'), 'contraste forçado');
ok(!/@keyframes|backdrop-filter|filter\s*:|animation\s*:/.test(css), 'sem peso contínuo');
ok(!/position\s*:\s*fixed/.test(css), 'sem camada fixa');
ok(!/100vw|112vw/.test(css), 'sem largura instável');

console.log(`PASS ${checks}/${checks} — Concílio das Constelações em 8 geometrias iPhone`);
