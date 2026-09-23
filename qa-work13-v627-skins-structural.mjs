import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const [html, app, sw, loader, world, css] = await Promise.all([
  './index.html', './app-v208.js', './sw.js', './page-loader-v1.js',
  './skins-world-v627.js', './skins-world-v627.css'
].map(read));
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };
const count = (source, pattern) => (source.match(pattern) || []).length;

ok(count(html, /id="orb"/g) === 1 && count(html, /id="orbCanvas"/g) === 1, 'uma Orbe e um canvas');
ok(count(html, /<section id="skins"/g) === 1 && count(html, /id="skinsApp"/g) === 1, 'um Ateliê e um corpo de Skins');
ok(html.includes('name="divina-work13" content="V627"') && html.includes('V627-SKINS-ATELIE-DOS-UNIVERSOS'), 'release V627');
ok(html.includes('app-v208.js?v=627-skins-atelie-dos-universos') && html.includes('sw.js?v=627-skins-atelie-dos-universos'), 'cache busting V627');
ok(html.includes('skins-world-v627.css?v=627-atelie-dos-universos') && html.includes('id="divinaSkinsWorldV627"'), 'estilo do Ateliê ligado');
ok(html.includes('data-skins-world="v627"') && html.includes('SKINS · ATELIÊ DOS UNIVERSOS · V627'), 'identidade do mundo');
ok(html.includes('Mude o cosmos sem mudar a sua leitura.') && html.includes('sem alterar funções, contraste ou a lógica do Tarot'), 'promessa cosmética clara');
ok(html.includes('data-go="skins">Skins · Ateliê</button>')
  && app.includes('stabilizeAtelierShortcutV627')
  && app.includes('if (button !== canonical) button.remove()'), 'atalho explícito e único no menu');
ok(html.includes('version:627,base:626'), 'bootstrap continua o V626');

ok(app.includes("skins-world-v627.js?v=627-atelie-dos-universos") && count(app, /createSkinsWorldV627/g) === 2, 'ligação única do mundo');
ok(app.includes('root:document.getElementById(\'skinsApp\')') && app.includes('orbCore:supremeOrb') && app.includes('livingMedia:livingMediaSkins'), 'autoridades existentes reutilizadas');
ok(app.includes('window.orbe.skinsWorld = skinsWorld') && app.includes('window.orbe.atelieDosUniversos = skinsWorld'), 'Ateliê publicado na Orbe');
ok(app.includes("stage:'renovacao-dos-mundos-14-skins'") && app.includes("universe:'atelie-dos-universos'"), 'etapa 14 declarada');
ok(app.includes('base:window.divinaWork13VideosWorldV626') && app.includes('window.divinaCosmosVivoV627'), 'continua o V626');
ok(app.includes('skinsWorldStatus:skinsWorld?.status?.() || null'), 'Orquestra recebe o estado');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_SKINS_WORLD_ACTIVE'") && app.includes("dataset.work13SkinsWorld = 'v627'"), 'worker e identidade ligados');
ok(app.includes('skinsWorldTotal:30') && app.includes('skinsWorldPaid:29') && app.includes('skinsWorldRealBilling:false'), 'boot conhece catálogo e bloqueio de cobrança');
ok(app.includes('window.divinaCosmosVivo = window.divinaWork13SkinsWorldV627'), 'ponte viva aponta para V627');

ok(loader.includes("skins-world-v627.js?v=627-atelie-dos-universos"), 'loader usa módulo V627');
ok(loader.includes("skins-world-v627.css?v=627-atelie-dos-universos"), 'loader usa estilo V627');
ok(loader.includes('globalThis.divinaWork13SkinsInstanceV627') && loader.includes('module.createSkinsWorldV627({'), 'loader preserva singleton');
ok(!loader.includes("skins:async()=>new SkinsWorldV318"), 'loader não regressa ao mundo antigo');

for (const token of [
  'SKINS_WORLD_CONTRACT_V627', "stage:'renovacao-dos-mundos-14-skins'", "universe:'atelie-dos-universos'",
  "'arrival','current-form','one-explicit-choice','atelier-on-request','preview'",
  'totalSkins:30', "freeSkin:'classic'", 'freeSkins:1', 'paidSkins:29',
  'individualPurchase:true', 'premiumIncludesAllSkins:true',
  'priceTiersCents:Object.freeze([1990,2990,3990,4990])',
  'cosmeticOnly:true', 'tarotLogicChanges:0', 'tarotResultChanges:0',
  'previewRequiresOwnership:false', 'previewGrantsEntitlement:false',
  "entitlementAuthority:'account-server-snapshot'", 'frontendEntitlementGrants:false',
  "activePreferenceAuthority:'runtime-v12-and-account-server'", 'restoreAcrossDevices:true',
  'offlineActiveSkin:true', "fallbackSkin:'classic'", 'globalApplyWithoutReload:true',
  'canonicalSurfaces:7', 'touchPrimary:true', 'dragForbidden:true', "soundDefault:'off'",
  'realBilling:false', 'productionPublish:false', 'oneCanonicalOrb:true', 'oneCanonicalCanvas:true',
  'newOrbs:0', 'newCanvases:0', 'newRenderers:0', 'permanentAnimationLoops:0',
  'automaticNavigation:false', 'automaticWhitSpeech:false', 'privateContentReads:0',
  "nextReality:'notifications'", 'work14:false'
]) ok(world.includes(token), `contrato: ${token}`);

ok(world.includes("import('./skins-v201.js?v=542')") && world.includes("import('./runtime-v12.js?v=133')"), 'dependências carregadas somente sob demanda');
ok(count(world, /new this\.dependencies\.Engine/g) === 1, 'um único motor legado reutilizado');
ok(world.includes("this.engine.choose?.(this.selectedId)"), 'aplicação passa pela autoridade existente');
ok(world.includes("this.orbCore?.pulse?.('skin-preview-touch'") && world.includes('apply:false') && world.includes('navigate:false'), 'prévia toca a Orbe sem aplicar ou navegar');
ok(world.includes('this.continuityRoutes.size >= 3') && world.includes("'divina:skins-continuity-checked'"), 'continuidade por três realidades observada');
ok(world.includes('this.restoreSignals += 1') && world.includes("'divina:billing-updated'"), 'restauração da conta observada');
ok(!/createElement\(['"]canvas['"]\)/.test(world) && !/new\s+(?:Worker|WebGL)/.test(world), 'nenhum canvas ou renderizador novo');
ok(!/pointermove|dragstart|draggable\s*=/.test(world), 'nenhum gesto de arrastar');
ok(!/grantEntitlement|unlockSkin|owned\.add\(/.test(world), 'frontend não concede direito');

ok(sw.includes('const VERSION = 627;') && sw.includes('divina-bruxa-work13-v627-skins-atelie-dos-universos'), 'worker V627');
ok(sw.includes("'./skins-world-v627.js?v=627-atelie-dos-universos'") && sw.includes("'./skins-world-v627.css?v=627-atelie-dos-universos'"), 'dois novos ativos no núcleo');
const core = sw.slice(sw.indexOf('const CORE'), sw.indexOf(']);', sw.indexOf('const CORE')));
ok((core.match(/^  '\.\//gm) || []).length === 82, '82 ativos essenciais');
ok(sw.includes("type:'DIVINA_WORK13_SKINS_WORLD_ACTIVE'") && sw.includes('base:626'), 'ativação pública sobre V626');
ok(sw.includes('totalSkins:30') && sw.includes('previewGrantsEntitlement:false') && sw.includes("entitlementAuthority:'account-server-snapshot'"), 'contrato do worker');

ok(css.includes('#skins[data-skins-world="v627"]') && css.includes('.skw627-stage'), 'mundo visual isolado');
ok(css.includes('.skw627-depth[hidden]') && css.includes('.skins-v191-grid'), 'galeria profunda e catálogo preservado');
ok(css.includes('env(safe-area-inset-top)') && css.includes('env(safe-area-inset-bottom)'), 'safe areas do iPhone');
ok(css.includes('font-size:16px') && css.includes('min-height:48px') && css.includes('min-height:44px'), 'teclado e alvos de toque');
ok(css.includes('@media (max-width:430px)') && css.includes('@media (max-height:470px) and (orientation:landscape)'), 'retratos estreitos e paisagem compacta');
ok(css.includes('@media (prefers-reduced-motion:reduce)') && css.includes('@media (prefers-contrast:more)') && css.includes('@media (forced-colors:active)'), 'acessibilidade');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(css), 'sem animação ou filtro pesado');
ok(!/[Íí]sis/.test(`${html}\n${world}\n${css}`) && !/33\s+skins/i.test(`${html}\n${world}\n${css}`), 'novas superfícies sem nomes públicos removidos');

console.log(`PASS ${checks}/${checks} — estrutura do Ateliê dos Universos V627`);
