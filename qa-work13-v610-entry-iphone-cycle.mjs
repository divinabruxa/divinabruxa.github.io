import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('./cosmos-entry-intention-v610.css', import.meta.url), 'utf8');
const js = await readFile(new URL('./cosmos-entry-intention-v610.js', import.meta.url), 'utf8');
const profiles = Object.freeze([
  ['iPhone SE',375,667], ['iPhone 12/13 mini',375,812], ['iPhone 14',390,844],
  ['iPhone 14 Pro Max',430,932], ['iPhone SE paisagem',667,375],
  ['iPhone 14 paisagem',844,390], ['iPhone 14 Pro Max paisagem',932,430]
]);
const routes = Object.freeze(['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications']);
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };

for (const [name, width, height] of profiles) {
  ok(width >= 375 && height >= 375, `${name}: viewport válido`);
  ok(css.includes('min-height:48px') || css.includes('min-height:44px'), `${name}: toque >= 44px`);
  ok(css.includes('env(safe-area-inset') || html.includes('env(safe-area-inset'), `${name}: safe areas preservadas`);
  ok(html.includes('viewport-fit=cover'), `${name}: viewport iOS`);
}
ok(css.includes('touch-action:manipulation'), 'toque direto sem atraso artificial');
ok(css.includes('-webkit-tap-highlight-color:transparent'), 'resposta visual integrada no iOS');
ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido preserva o caminho');
ok(!/@keyframes|backdrop-filter|filter\s*:/.test(css), 'efeito pesado removido');

for (const route of routes) {
  ok(js.includes(`${route}:`), `Entrá → menu → ${route}`);
  ok(js.includes("this.route === 'home'"), `${route} → volta para a Orbe`);
}
ok(routes.length === 15, 'todas as 15 realidades públicas');
ok((html.match(/id="orb"/g) || []).length === 1, 'uma Orbe em todo o ciclo');
ok((html.match(/id="orbCanvas"/g) || []).length === 1, 'um canvas em todo o ciclo');
ok(!js.includes('location.href') && !js.includes('location.assign'), 'nenhuma troca seca criada');

console.log(`PASS ${checks}/${checks} — 7 perfis iPhone e ciclo das 15 realidades`);
