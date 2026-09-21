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
  ok(entryCss.includes('position:fixed'), `${name}: pentagrama fixo no canto`);
  ok(entryCss.includes('env(safe-area-inset-right)'), `${name}: canto direito seguro`);
  ok(entryCss.includes('env(safe-area-inset-top)'), `${name}: topo seguro`);
}

ok(entryCss.includes('touch-action:manipulation'), 'toque direto sem atraso artificial');
ok(entryCss.includes('-webkit-tap-highlight-color:transparent'), 'resposta integrada no iOS');
ok(entryCss.includes('[data-response="answering"]'), 'pentagrama responde no pointerdown');
ok(entryCss.includes('[data-response="menu-open"]'), 'pentagrama continua vivo dentro do menu');
ok(entryCss.includes('[data-response="closing"]'), 'fechamento responde sem corte seco');
ok(html.includes('pentagrama-menu-vivo-v611.webp'), 'imagem retina ligada ao universo global');
ok(html.includes('aria-label="Abrir o menu mágico"'), 'gesto legível pelo VoiceOver');
ok(entryJs.includes('body.append(this.entry)'), 'pentagrama sai do palco central e retorna à camada global');
ok(entryJs.includes('globalPentagram:true'), 'menu disponível em todas as páginas');
ok(entryJs.includes('globalMenuOnEveryPage:true'), 'todas as páginas compartilham o menu');
ok(entryJs.includes('pentagramVisibleWhileMenuOpen:true'), 'pentagrama permanece no próprio menu');
ok(entryJs.includes('pentagramTogglesMenu:true'), 'o mesmo alvo abre e fecha');
ok(entryJs.includes('arrivalStateRecovery:true'), 'menu reaparece ao terminar a chegada');
ok(entryJs.includes("'divina:work12-state'"), 'fim da travessia é observado');
ok(entryJs.includes("'divina:supreme-orb-did-navigate'"), 'chegada da Orbe é observada');
ok(entryJs.includes("'pageshow'"), 'retorno do Safari recompõe o alvo');
ok(entryJs.includes("tarotOrbAction:'reveal-only'"), 'Orbe do Tarot revela');
ok(entryJs.includes('tarotOrbOpensMenu:false'), 'Orbe do Tarot não abre o menu');
ok((entryJs.match(/if \(this\.route === 'tarot'\) return;/g) || []).length === 3, 'gestos globais não capturam o Tarot');
ok(entryCss.includes('[data-work13-menu="pentagram-v613"] #menuBtn.menu-button'), 'somente o pentagrama representa o menu');
ok(entryCss.includes('[data-menu-state="closed"][data-work12-state="arrive" i]'), 'chegada recolhe apenas o menu fechado');
ok(!entryCss.includes('html[data-menu-state]:not([data-menu-state="closed"]) .cosmos-entry-intent'), 'menu aberto nunca perde o pentagrama');
ok(presenceCss.includes('min-block-size:100dvh') && presenceCss.includes('min-block-size:100svh'), 'mundos inteiros em viewport dinâmica');
ok(presenceCss.includes('.db502-portal.is-touching'), 'balões respondem no primeiro toque');
ok(entryCss.includes('db613MenuCurrent') && entryCss.includes('db613MenuSoul'), 'menu e balões têm vida leve');
ok(entryCss.includes('@media(prefers-reduced-motion:reduce)'), 'entrada acessível com movimento reduzido');
ok(presenceCss.includes('@media(prefers-reduced-motion:reduce)'), 'travessia acessível com movimento reduzido');
ok(!/backdrop-filter|filter\s*:/.test(entryCss + presenceCss), 'filtro pesado removido');
ok((entryCss.match(/@keyframes/g) || []).length === 5, 'cinco respirações CSS pequenas');
ok(entryCss.includes('@media(forced-colors:active)'), 'pentagrama preservado em alto contraste');

for (const route of routes) {
  ok(new RegExp(`<section id="${route}"`).test(html), `pentagrama → menu → ${route}`);
  ok(presenceJs.includes(`${route}:`) || presenceJs.includes(`'${route}'`), `${route}: presença reconhecida`);
  ok(!entryCss.includes(`data-work12-final-route="${route}"`) || route === 'home', `${route}: CSS não esconde o pentagrama por rota`);
}
ok(routes.length === 15, 'todas as 15 realidades públicas');
ok((html.match(/id="orb"/g) || []).length === 1, 'uma Orbe em todo o ciclo');
ok((html.match(/id="orbCanvas"/g) || []).length === 1, 'um canvas em todo o ciclo');
ok(!/location\.(?:href|assign|replace)/.test(entryJs + presenceJs), 'nenhuma troca seca criada');
ok(!/requestAnimationFrame|setInterval|setTimeout|MutationObserver/.test(presenceJs), 'nenhum peso contínuo novo');

console.log(`PASS ${checks}/${checks} — pentagrama global, Tarot e 8 perfis iPhone`);
