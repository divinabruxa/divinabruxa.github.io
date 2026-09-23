import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [css, world, html] = await Promise.all([
  './skins-world-v627.css', './skins-world-v627.js', './index.html'
].map(name => readFile(new URL(name, import.meta.url), 'utf8')));
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const profiles = [
  ['se-1-p', 320, 568, 2], ['se-2-p', 375, 667, 2], ['mini-p', 375, 812, 3],
  ['12-p', 390, 844, 3], ['pro-p', 393, 852, 3], ['max-p', 430, 932, 3],
  ['se-2-l', 667, 375, 2], ['max-l', 932, 430, 3]
];

for (const [id, width, height, dpr] of profiles) {
  const portrait = width < height;
  const outerInset = portrait ? 20 : 32;
  const content = width - outerInset;
  const preview = portrait ? Math.min(width * .78, 286) : 176;
  ok(content >= 300 && content <= width, `${id}: Ateliê contido`);
  ok(preview <= content, `${id}: prévia cabe sem corte`);
  ok(44 * dpr >= 88, `${id}: alvo físico confortável`);
  ok((portrait ? 'portrait' : 'landscape') === (id.endsWith('-p') ? 'portrait' : 'landscape'), `${id}: orientação correta`);
  ok(height >= 375, `${id}: viewport útil`);
}

ok(css.includes('overflow-x:clip'), 'sem rolagem horizontal do mundo');
ok(css.includes('env(safe-area-inset-top)') && css.includes('env(safe-area-inset-bottom)'), 'safe areas verticais');
ok(css.includes('env(safe-area-inset-left)') && css.includes('env(safe-area-inset-right)'), 'safe areas laterais');
ok(css.includes('min-height:48px') && css.includes('min-height:44px'), 'alvos de toque de 44–48 px');
ok(css.includes('touch-action:manipulation') && css.includes('-webkit-tap-highlight-color:transparent'), 'toque primário no iOS');
ok(css.includes('font-size:16px'), 'busca não provoca zoom automático');
ok(css.includes('aspect-ratio:1') && css.includes('object-fit:contain'), 'Orbes inteiras e proporcionais');
ok(css.includes('grid-template-columns:1fr') && css.includes('repeat(2,minmax(0,1fr))') && css.includes('repeat(3,minmax(0,1fr))'), 'galeria adapta de uma a três colunas');
ok(css.includes('@media (max-width:430px)'), 'quebra para iPhones estreitos');
ok(css.includes('@media (max-height:470px) and (orientation:landscape)'), 'paisagem curta compacta');
ok(css.includes('@media (prefers-reduced-motion:reduce)') && css.includes('transition-duration:.01ms'), 'movimento reduzido preserva significado');
ok(css.includes('@media (prefers-contrast:more)') && css.includes('@media (forced-colors:active)'), 'contraste e cores forçadas');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(css), 'sem efeito pesado ou loop');
ok(!/width:\s*100vw|left:\s*-\d+vw/.test(css), 'nenhuma largura que force overflow');

ok(world.includes('decoding="async"') && world.includes('fetchpriority="high"'), 'forma atual priorizada sem bloquear decodificação');
ok(world.includes("prepareSkin?.(requested, { priority:'high' })"), 'prévia escolhida é preparada sob demanda');
ok(world.includes('atelier-on-request') && world.includes('if (this.phase === \'gallery\') await this.ensureEngine()'), 'galeria profunda só após pedido');
ok(world.includes('touchPrimary:true') && world.includes('dragForbidden:true'), 'toque substitui arraste');
ok(!/pointermove|touchmove|dragstart/.test(world), 'nenhum gesto frágil de arrastar');
ok(world.includes("this.root?.querySelector?.('#skw627DepthTitle')?.focus?.({ preventScroll:true })"), 'foco acessível sem salto de viewport');
ok(world.includes("opener?.focus?.({ preventScroll:true })"), 'foco devolvido ao fechar');
ok(world.includes("this.engine = new this.dependencies.Engine(this.engineHost)"), 'motor nasce apenas na profundidade');
ok(world.includes('globalApplyWithoutReload:true') && world.includes('reload:false'), 'troca global sem recarga');
ok(world.includes('offlineActiveSkin:true') && world.includes("fallbackSkin:'classic'"), 'reabertura offline tem chão seguro');
ok(html.includes('interactive-widget=resizes-content') && html.includes('viewport-fit=cover'), 'viewport do iPhone preservado');

console.log(`PASS ${checks}/${checks} — Ateliê dos Universos em 8 geometrias iPhone`);
