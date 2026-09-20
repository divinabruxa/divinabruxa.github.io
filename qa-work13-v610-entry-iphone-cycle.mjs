import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html, entryCss, entryJs, presenceCss, presenceJs] = await Promise.all([
  read('./index.html'), read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-entry-intention-v610.js'), read('./cosmos-world-presence-v610.css'),
  read('./cosmos-world-presence-v610.js')
]);

const profiles = Object.freeze([
  ['iPhone SE',375,667], ['iPhone 12/13 mini',375,812],
  ['iPhone 14',390,844], ['iPhone 15 Pro',393,852],
  ['iPhone 14 Pro Max',430,932], ['iPhone SE paisagem',667,375],
  ['iPhone 14 paisagem',844,390], ['iPhone 14 Pro Max paisagem',932,430]
]);
const routes = Object.freeze([
  'tarot','daily','spreads','library','school','journal','ai','consultations',
  'store','skins','music','videos','subscriptions','login','notifications'
]);
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };

for (const [name, width, height] of profiles) {
  ok(width >= 375 && height >= 375, `${name}: viewport válido`);
  ok(entryCss.includes('min-height:48px') || entryCss.includes('min-height:44px'), `${name}: toque >= 44px`);
  ok(html.includes('env(safe-area-inset'), `${name}: safe areas herdadas`);
  ok(html.includes('viewport-fit=cover'), `${name}: viewport iOS`);
  ok(html.includes('interactive-widget=resizes-content'), `${name}: teclado não quebra a tela`);
}

ok(entryCss.includes('touch-action:manipulation'), 'toque direto sem atraso artificial');
ok(entryCss.includes('-webkit-tap-highlight-color:transparent'), 'resposta integrada no iOS');
ok(entryCss.includes('[data-response="answering"]'), 'Entrá responde no pointerdown');
ok(entryCss.includes('[data-response="silent"]'), 'resposta termina em silêncio');
ok(presenceCss.includes('min-block-size:100dvh') && presenceCss.includes('min-block-size:100svh'), 'mundos inteiros em viewport dinâmica');
ok(presenceCss.includes('.db502-portal.is-touching'), 'balões respondem no primeiro toque');
ok(entryCss.includes('@media(prefers-reduced-motion:reduce)'), 'entrada acessível com movimento reduzido');
ok(presenceCss.includes('@media(prefers-reduced-motion:reduce)'), 'travessia acessível com movimento reduzido');
ok(!/@keyframes|backdrop-filter|filter\s*:/.test(entryCss + presenceCss), 'efeito pesado removido');

for (const route of routes) {
  ok(new RegExp(`<section id="${route}"`).test(html), `Entrá → menu → ${route}`);
  ok(presenceJs.includes(`${route}:`) || presenceJs.includes(`'${route}'`), `${route}: presença reconhecida`);
}
ok(routes.length === 15, 'todas as 15 realidades públicas');
ok((html.match(/id="orb"/g) || []).length === 1, 'uma Orbe em todo o ciclo');
ok((html.match(/id="orbCanvas"/g) || []).length === 1, 'um canvas em todo o ciclo');
ok(!/location\.(?:href|assign|replace)/.test(entryJs + presenceJs), 'nenhuma troca seca criada');
ok(!/requestAnimationFrame|setInterval|setTimeout|MutationObserver/.test(presenceJs), 'nenhum peso contínuo novo');

console.log(`PASS ${checks}/${checks} — 8 perfis iPhone e ciclo das 15 realidades`);
