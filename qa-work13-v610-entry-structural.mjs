import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html, app, sw, entryJs, entryCss, presenceJs, presenceCss, orchestra] = await Promise.all([
  read('./index.html'), read('./app-v208.js'), read('./sw.js'),
  read('./cosmos-entry-intention-v610.js'), read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-world-presence-v610.js'), read('./cosmos-world-presence-v610.css'),
  read('./cosmos-final-orchestra-v610.js')
]);

let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;
const publicRoutes = Object.freeze([
  'tarot','daily','spreads','library','school','journal','ai','consultations',
  'store','skins','music','videos','subscriptions','login','notifications'
]);

ok(count(html, /id="orb"/g) === 1, 'uma Orbe física');
ok(count(html, /id="orbCanvas"/g) === 1, 'um canvas canônico');
ok(count(html, /id="cosmosEntryIntent"/g) === 1, 'uma intenção de entrada');
ok(count(html, /<span>Entrá<\/span>/g) === 1, 'texto exato Entrá');
ok(/<div class="orb-stage-ref">[\s\S]*id="orb"[\s\S]*id="cosmosEntryIntent"[\s\S]*<\/div>/.test(html), 'convite junto da Orbe');
ok(html.includes('aria-label="Entrar no universo"'), 'nome acessível');
ok(html.includes('aria-controls="divinaOrbitalMenuV502"'), 'controle do menu vivo');
ok(html.includes('name="divina-work13-correction" content="V610-LAPIDACAO-FINAL"'), 'lapidação dentro do V610');
ok(html.includes('cosmos-entry-intention-v610.css?v=610-work13-final-presence'), 'entrada ligada');
ok(html.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence'), 'presença ligada');
ok(html.includes('app-v208.js?v=610-work13-final-presence'), 'aplicação ligada');
ok(html.includes("./sw.js?v=610-final-presence"), 'worker ligado');
ok(!/sopro/i.test(html), 'ornamento textual removido do HTML');

for (const route of publicRoutes) {
  ok(count(html, new RegExp(`<section id="${route}"`, 'g')) === 1, `tela completa: ${route}`);
}
ok(count(html, /<section id="/g) === 17, 'dezessete realidades estáticas, incluindo Skins');
ok(html.includes('<section id="skins" class="screen skins-celestial-screen"'), 'Skins tem página própria');
ok(html.includes('<div id="skinsApp"></div>'), 'motor existente de Skins tem destino');

ok(app.includes('createCosmosEntryIntentionV610'), 'controlador de entrada importado');
ok(app.includes('createCosmosWorldPresenceV610'), 'controlador de presença importado');
ok(app.includes('continuity:finalContinuity'), 'continuidade V598 reutilizada');
ok(app.includes('orbCore:supremeOrb'), 'Orbe Suprema reutilizada');
ok(app.includes('menuResolver:() => globalThis.divinaMenuV502'), 'menu V593 reutilizado');
ok(app.includes('window.orbe.entryIntention = cosmosEntryIntention'), 'entrada publicada');
ok(app.includes('window.orbe.worldPresence = cosmosWorldPresence'), 'presença publicada');
ok(app.includes("correction:'lapidacao-final-presenca-das-realidades'"), 'fechamento permanece no WORK13');
ok(app.includes('work14:false'), 'nenhum WORK14');
ok(!/sopro/i.test(app), 'rótulo ornamental ausente da aplicação');

ok(entryJs.includes('COSMOS_ENTRY_INTENTION_CONTRACT_V610'), 'contrato de entrada');
ok(entryJs.includes("invitation:'Entrá'"), 'convite único');
ok(entryJs.includes('entryIntentions:1'), 'somente uma intenção');
ok(entryJs.includes("responseModel:'touch-answer-silence'"), 'toque, resposta e silêncio');
ok(entryJs.includes('reusesCanonicalOrb:true'), 'Orbe canônica');
ok(entryJs.includes('reusesLivingMenuV593:true'), 'menu vivo preservado');
ok(entryJs.includes('globalOrbMenuCycle:true'), 'menu global pela Orbe');
ok(entryJs.includes('everyRealityCanCallUniverse:true'), 'todas as realidades reabrem o universo');
ok(entryJs.includes('realityOwnedOrbActionsPreserved:true'), 'ação própria da Orbe preservada');
ok(entryJs.includes("target?.closest?.('#tableOrb')"), 'Tarot Livre não é interceptado pelo menu');
ok(entryJs.includes("target?.closest?.('[data-daily-orb-host]')"), 'Carta do Dia não é interceptada pelo menu');
ok(entryJs.includes("target?.closest?.('#spreadResult')"), 'Tiragens não são interceptadas pelo menu');
ok(entryJs.includes("this.continuity?.callUniverse?.(source)"), 'abertura pela continuidade');
ok(entryJs.includes("this.openUniverse('orb-world')"), 'Orbe chama o menu fora da Home');
ok(entryJs.includes("this.orbCore?.pulse?.('work13-entry-response'"), 'resposta imediata');
ok(!/createElement|requestAnimationFrame|setInterval|setTimeout|MutationObserver/.test(entryJs), 'entrada sem DOM ou loops novos');
ok(!/location\.(?:href|assign|replace)/.test(entryJs), 'entrada sem troca seca');

ok(presenceJs.includes('COSMOS_WORLD_PRESENCE_CONTRACT_V610'), 'contrato das realidades');
ok(presenceJs.includes('allMenuDestinationsHaveFullScreens:true'), 'todos os destinos têm tela');
ok(presenceJs.includes('reusesCoordinatedNavigationV592:true'), 'travessia existente preservada');
ok(presenceJs.includes('touchesOrbEngine:false'), 'motor da Orbe intocado');
ok(presenceJs.includes('touchesUniverseEngine:false'), 'motor do Universo intocado');
ok(presenceJs.includes('automaticNavigation:false'), 'nenhum roteador paralelo');
ok(presenceJs.includes('permanentAnimationLoops:0'), 'nenhum loop permanente novo');
ok(!/createElement|requestAnimationFrame|setInterval|setTimeout|MutationObserver/.test(presenceJs), 'presença sem peso estrutural');
ok(!/location\.(?:href|assign|replace)/.test(presenceJs), 'presença sem teleporte');

ok(entryCss.includes('background:transparent'), 'Entrá não é caixa');
ok(entryCss.includes('border:0'), 'Entrá não é botão comum');
ok(entryCss.includes('min-height:48px'), 'alvo de toque confortável');
ok(entryCss.includes('[data-response="answering"]'), 'resposta imediata visível');
ok(entryCss.includes('[data-response="silent"]'), 'silêncio após resposta');
ok(presenceCss.includes('.db502-portal.is-touching'), 'balão responde ao toque');
ok(presenceCss.includes('#menuBtn.menu-button i'), 'acesso global funcional visível');
ok(presenceCss.includes('display:block!important'), 'coordenada do menu não fica invisível');
ok(presenceCss.includes('[data-work13-world-presence="approaching"]'), 'chegada progressiva');
ok(presenceCss.includes('[data-work13-world-presence="leaving"]'), 'saída progressiva');
ok(presenceCss.includes('min-block-size:100dvh'), 'cada mundo ocupa a tela');
for (const route of publicRoutes) ok(presenceCss.includes(`#${route}[data-work13-world]`), `identidade própria: ${route}`);
for (const css of [entryCss,presenceCss]) {
  ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido preservado');
  ok(!/@keyframes|backdrop-filter|filter\s*:/.test(css), 'sem efeito pesado');
}

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core, /^\s*'\.\//gm) === 53, '53 ativos centrais');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v610-escola-soul'"), 'cache isolado');
ok(sw.includes('DIVINA_WORK13_FINAL_PRESENCE_ACTIVE'), 'ativação comunicada');
ok(sw.includes('DIVINA_WORK13_GLOBAL_MENU_ACTIVE'), 'menu global comunicado');
ok(sw.includes('COSMOS_WORLD_PRESENCE_CONTRACT_V610'), 'worker valida presença');
ok(sw.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence'), 'worker inclui estilo');

const orchestraHash = createHash('sha256').update(orchestra).digest('hex');
ok(orchestraHash === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra V610 protegida byte a byte');

console.log(`PASS ${checks}/${checks} — lapidação estrutural do WORK13 V610`);
