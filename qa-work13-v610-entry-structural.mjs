import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const readBytes = name => readFile(new URL(name, import.meta.url));
const [html, app, sw, entryJs, entryCss, presenceJs, presenceCss, orchestra, pentagram] = await Promise.all([
  read('./index.html'), read('./app-v208.js'), read('./sw.js'),
  read('./cosmos-entry-intention-v610.js'), read('./cosmos-entry-intention-v610.css'),
  read('./cosmos-world-presence-v610.js'), read('./cosmos-world-presence-v610.css'),
  read('./cosmos-final-orchestra-v610.js'), readBytes('./pentagrama-menu-vivo-v611.webp')
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
ok(count(html, /<span>Entrá<\/span>/g) === 0, 'palavra Entrá removida');
ok(count(html, /pentagrama-menu-vivo-v611\.webp/g) === 2, 'pentagrama único ligado e pré-carregado');
ok(/<div class="orb-stage-ref">[\s\S]*id="orb"[\s\S]*id="cosmosEntryIntent"[\s\S]*<\/div>/.test(html), 'pentagrama nasce do palco protegido da Orbe');
ok(html.includes('aria-label="Abrir o menu mágico"'), 'nome acessível');
ok(html.includes('aria-controls="divinaOrbitalMenuV502"'), 'controle do menu vivo');
ok(html.includes('name="divina-work13-correction" content="V612-PENTAGRAMA-GLOBAL-TAROT-PROTEGIDO"'), 'correção permanece no WORK13');
ok(html.includes('cosmos-entry-intention-v610.css?v=612-global-pentagram-tarot-fix'), 'pentagrama global ligado');
ok(html.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence'), 'presença ligada');
ok(html.includes('app-v208.js?v=612-global-pentagram-tarot-fix'), 'aplicação ligada');
ok(html.includes("./sw.js?v=612-global-pentagram-tarot-fix"), 'worker ligado');
ok(!/sopro/i.test(html), 'ornamento textual removido do HTML');
ok(pentagram.length > 20000 && pentagram.length < 100000, 'imagem retina leve');
ok(pentagram.subarray(0,4).toString('ascii') === 'RIFF' && pentagram.subarray(8,12).toString('ascii') === 'WEBP', 'imagem WebP válida');

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
ok(app.includes('divinaWork13PentagramMenuV612'), 'correção V612 publicada');
ok(app.includes("dataset.work13Macro = 'pentagrama-global-tarot-protegido'"), 'macro do WORK13 atualizado');
ok(app.includes("pentagramPosition:'top-corner'"), 'posição global publicada');
ok(app.includes("tarotOrbAction:'reveal-only'"), 'gesto revelador do Tarot publicado');
ok(app.includes('tarotOrbOpensMenu:false'), 'menu não captura a Orbe do Tarot');
ok(app.includes('window.orbe.pentagramMenu'), 'menu pentagrama publicado na Orbe');
ok(app.includes('window.orbe.worldPresence = cosmosWorldPresence'), 'presença publicada');
ok(app.includes("correction:'lapidacao-final-presenca-das-realidades'"), 'fechamento permanece no WORK13');
ok(app.includes('work14:false'), 'nenhum WORK14');
ok(!/sopro/i.test(app), 'rótulo ornamental ausente da aplicação');

ok(entryJs.includes('COSMOS_ENTRY_INTENTION_CONTRACT_V610'), 'contrato de entrada');
ok(entryJs.includes("correction:'pentagrama-global-tarot-protegido'"), 'contrato nomeia a correção urgente');
ok(entryJs.includes("invitation:'pentagrama-vermelho'"), 'convite virou símbolo');
ok(entryJs.includes('entryIntentions:1'), 'somente uma intenção');
ok(entryJs.includes('visibleEntryWords:0'), 'entrada sem palavra visível');
ok(entryJs.includes('pentagramIsMenu:true'), 'pentagrama é o menu');
ok(entryJs.includes('globalPentagram:true'), 'pentagrama é global');
ok(entryJs.includes("pentagramPosition:'top-corner'"), 'pentagrama ocupa o canto superior');
ok(entryJs.includes('whitInsideMenu:true'), 'Whit dentro do menu');
ok(entryJs.includes("tarotOrbAction:'reveal-only'"), 'Orbe do Tarot só revela');
ok(entryJs.includes('tarotOrbOpensMenu:false'), 'Orbe do Tarot não abre o menu');
ok(entryJs.includes('tarotOrbMenuListenersBypassed:true'), 'listeners globais ignoram o gesto do Tarot');
ok(entryJs.includes("ai:'Whit'"), 'Whit nomeada no balão');
ok(entryJs.includes("responseModel:'touch-answer-silence'"), 'toque, resposta e silêncio');
ok(entryJs.includes('reusesCanonicalOrb:true'), 'Orbe canônica');
ok(entryJs.includes('reusesLivingMenuV593:true'), 'menu vivo preservado');
ok(entryJs.includes('globalOrbMenuCycle:true'), 'menu global pela Orbe');
ok(entryJs.includes('everyRealityCanCallUniverse:true'), 'todas as realidades reabrem o universo');
ok(entryJs.includes('realityOwnedOrbActionsPreserved:true'), 'ação própria da Orbe preservada');
ok(entryJs.includes('journalThresholdOrbActionPreserved:true'), 'entrada do Diário preservada');
ok(entryJs.includes("if (this.route === 'tarot') return true;"), 'Tarot Livre reivindica toda a Orbe física');
ok((entryJs.match(/if \(this\.route === 'tarot'\) return;/g) || []).length === 3, 'pointer, clique e teclado globais ignoram o Tarot');
ok(entryJs.includes('this.documentTarget.body.append(this.entry)'), 'pentagrama sobe para a camada global');
ok(entryJs.includes("target?.closest?.('[data-daily-orb-host]')"), 'Carta do Dia não é interceptada pelo menu');
ok(entryJs.includes("target?.closest?.('#spreadResult')"), 'Tiragens não são interceptadas pelo menu');
ok(entryJs.includes("target?.closest?.('[data-library-orb-host]')"), 'Biblioteca não é interceptada pelo menu');
ok(entryJs.includes("target?.closest?.('#cardLibraryApp [data-orb]')"), 'descoberta canônica da Biblioteca preservada');
ok(entryJs.includes('Orbe viva. Toque para descobrir uma carta'), 'ação local da Biblioteca anunciada');
ok(entryJs.includes("target.closest('[data-v585-orb-host]')"), 'Orbe do limiar do Diário preservada');
ok(entryJs.includes('Orbe viva. Toque para entrar e escrever no Diário'), 'escrita direta do Diário anunciada');
ok(entryJs.includes("!['engaged','travel'].includes(state)"), 'menu global retorna após o mergulho');
ok(entryJs.includes("'divina:orb-physical-claim-settled'"), 'rótulo acompanha a chegada da Orbe');
ok(entryJs.includes("this.continuity?.callUniverse?.(source)"), 'abertura pela continuidade');
ok(entryJs.includes("this.openUniverse('orb-world')"), 'Orbe chama o menu fora da Home');
ok(entryJs.includes("this.orbCore?.pulse?.('work13-entry-response'"), 'resposta imediata');
ok(entryJs.includes('this.pendingOpen = true'), 'toque aguarda menu sem se perder');
ok(entryJs.includes("if (shouldOpen) this.openUniverse('menu-ready')"), 'balões nascem após prontidão');
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

ok(entryCss.includes('pentagrama global'), 'identidade visual do pentagrama');
ok(entryCss.includes('position:fixed'), 'pentagrama não fica preso ao centro da Home');
ok(entryCss.includes('right:max(12px,env(safe-area-inset-right))'), 'canto direito respeita a área segura');
ok(entryCss.includes('top:max(12px,env(safe-area-inset-top))'), 'topo respeita a área segura');
ok(entryCss.includes('border:0'), 'pentagrama não é botão comum');
ok(entryCss.includes('min-height:48px'), 'alvo de toque confortável');
ok(entryCss.includes('.cosmos-entry-intent__whit'), 'presença de Whit no centro');
ok(entryCss.includes('db611PentagramBreath'), 'pentagrama respira');
ok(entryCss.includes('db611WhitHeartbeat'), 'Whit tem pulso contido');
ok(entryCss.includes('[data-response="answering"]'), 'resposta imediata visível');
ok(entryCss.includes('[data-response="silent"]'), 'silêncio após resposta');
ok(presenceCss.includes('.db502-portal.is-touching'), 'balão responde ao toque');
ok(entryCss.includes('[data-work13-menu="pentagram-v612"] #menuBtn.menu-button'), 'gatilho antigo cede lugar ao pentagrama');
ok(entryCss.includes('visibility:hidden!important'), 'sem dois gatilhos de menu na tela');
ok(presenceCss.includes('[data-work13-world-presence="approaching"]'), 'chegada progressiva');
ok(presenceCss.includes('[data-work13-world-presence="leaving"]'), 'saída progressiva');
ok(presenceCss.includes('min-block-size:100dvh'), 'cada mundo ocupa a tela');
for (const route of publicRoutes) ok(presenceCss.includes(`#${route}[data-work13-world]`), `identidade própria: ${route}`);
for (const css of [entryCss,presenceCss]) ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'movimento reduzido preservado');
ok(!/backdrop-filter|filter\s*:/.test(entryCss + presenceCss), 'sem filtro pesado');
ok((entryCss.match(/@keyframes/g) || []).length === 3, 'somente três respirações CSS leves');
ok(!/@keyframes/.test(presenceCss), 'presença das páginas sem loop novo');

const core = sw.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
ok(count(core, /^\s*'\.\//gm) === 58, '58 ativos centrais');
ok(sw.includes("CACHE_NAME = 'divina-bruxa-work13-v612-global-pentagram-tarot-fix'"), 'cache isolado');
ok(sw.includes("'./pentagrama-menu-vivo-v611.webp'"), 'imagem disponível offline');
ok(sw.includes('DIVINA_WORK13_PENTAGRAM_MENU_ACTIVE'), 'pentagrama comunicado');
ok(sw.includes('DIVINA_WORK13_FINAL_PRESENCE_ACTIVE'), 'ativação comunicada');
ok(sw.includes('DIVINA_WORK13_GLOBAL_MENU_ACTIVE'), 'menu global comunicado');
ok(sw.includes('COSMOS_WORLD_PRESENCE_CONTRACT_V610'), 'worker valida presença');
ok(sw.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence'), 'worker inclui estilo');

const orchestraHash = createHash('sha256').update(orchestra).digest('hex');
ok(orchestraHash === 'ebfe097bc1851540a24494a7a64eb3122c31aa04f35e3809a5288baac16ceca0', 'orquestra V610 protegida byte a byte');

console.log(`PASS ${checks}/${checks} — pentagrama global e Tarot protegido no WORK13 V612`);
