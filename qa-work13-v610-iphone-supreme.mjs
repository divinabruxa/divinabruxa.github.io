/* DIVINA BRUXA — WORK13 V610 · QA SUPREMO DETERMINÍSTICO PARA iPHONE/PWA */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COSMOS_FINAL_ORCHESTRA_CONTRACT_V610,
  normalizeIPhoneViewportV610
} from './cosmos-final-orchestra-v610.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const contract = COSMOS_FINAL_ORCHESTRA_CONTRACT_V610;
const index = read('index.html');
const manifest = JSON.parse(read('manifest.webmanifest'));
const app = read('app-v208.js');
const worker = read('sw.js');
const orchestra = read('cosmos-final-orchestra-v610.js');
const styles = Object.freeze({
  shell:read('divina-shell-v180.css'),
  iosNavigation:read('ios-navigation-v551.css'),
  orbitalMenu:read('orbital-menu-v502.css'),
  ritual:read('reading-ritual-core-v595.css'),
  chambers:read('reality-chambers-v596.css'),
  intelligence:read('experience-intelligence-v597.css'),
  finalContinuity:read('work12-final-continuity-v598.css'),
  resonance:read('cosmos-reality-resonance-v603.css'),
  daily:read('cosmic-daily-reading-v604.css'),
  spread:read('cosmic-spread-reading-v605.css'),
  wisdom:read('living-wisdom-path-v607.css'),
  commerce:read('living-commerce-path-v608.css'),
  mediaSkins:read('living-media-skins-v609.css'),
  entry:read('cosmos-entry-intention-v610.css'),
  worldPresence:read('cosmos-world-presence-v610.css'),
  spreadsSoul:read('tiragens-soul-v610.css'),
  schoolSoul:read('escola-soul-v610.css')
});

check('matrix:eight-profiles', contract.iphoneProfiles.length === 8);
check('matrix:four-portrait', contract.iphoneProfiles.filter(profile => profile.width < profile.height).length === 4);
check('matrix:four-landscape', contract.iphoneProfiles.filter(profile => profile.width > profile.height).length === 4);
check('matrix:se-through-pro-max', contract.iphoneProfiles.some(profile => profile.width === 375 && profile.height === 667)
  && contract.iphoneProfiles.some(profile => profile.width === 430 && profile.height === 932));
for (const profile of contract.iphoneProfiles) {
  const viewport = normalizeIPhoneViewportV610(profile);
  const expectedOrientation = profile.width > profile.height ? 'landscape' : 'portrait';
  check(`profile:${profile.id}:exact-size`, viewport.width === profile.width && viewport.height === profile.height);
  check(`profile:${profile.id}:orientation`, viewport.orientation === expectedOrientation, viewport.orientation);
  check(`profile:${profile.id}:dpr`, viewport.dpr === profile.dpr, viewport.dpr);
  check(`profile:${profile.id}:finite`, Number.isFinite(viewport.width) && Number.isFinite(viewport.height));
}
const keyboardViewport = normalizeIPhoneViewportV610({ width:390, height:392, dpr:3, standalone:true });
check('matrix:keyboard-viewport-remains-finite', keyboardViewport.width === 390 && keyboardViewport.height === 392);
check('matrix:keyboard-viewport-remains-portrait', keyboardViewport.orientation === 'portrait');
check('matrix:standalone-flag', keyboardViewport.standalone === true);

const viewportMeta = index.match(/<meta name="viewport" content="([^"]+)"/)?.[1] || '';
check('safari:device-width', viewportMeta.includes('width=device-width'));
check('safari:initial-scale', viewportMeta.includes('initial-scale=1'));
check('safari:viewport-fit-cover', viewportMeta.includes('viewport-fit=cover'));
check('safari:keyboard-resizes-content', viewportMeta.includes('interactive-widget=resizes-content'));
check('safari:zoom-not-disabled', !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(viewportMeta));
check('safari:apple-capable', index.includes('<meta name="apple-mobile-web-app-capable" content="yes">'));
check('safari:black-translucent', index.includes('apple-mobile-web-app-status-bar-style" content="black-translucent"'));
check('safari:apple-touch-icon', index.includes('rel="apple-touch-icon"'));
check('safari:manifest-linked', index.includes('rel="manifest" href="manifest.webmanifest?v=562"'));
check('safari:100dvh-critical', index.includes('height:100dvh'));
check('safari:100svh-critical', index.includes('min-height:100svh'));
check('safari:top-safe-critical', index.includes('safe-area-inset-top'));
check('safari:bottom-safe-critical', index.includes('safe-area-inset-bottom'));

check('pwa:display-standalone', manifest.display === 'standalone');
check('pwa:display-override', manifest.display_override?.includes('standalone'));
check('pwa:orientation-any', manifest.orientation === 'any');
check('pwa:launch-existing', manifest.launch_handler?.client_mode === 'navigate-existing');
check('pwa:start-url', manifest.start_url === './');
check('pwa:scope', manifest.scope === './');
check('pwa:id', manifest.id === './');
check('pwa:lang-pt-br', manifest.lang === 'pt-BR');
check('pwa:icon-192', manifest.icons?.some(icon => icon.sizes === '192x192' && icon.purpose === 'any'));
check('pwa:icon-512', manifest.icons?.some(icon => icon.sizes === '512x512' && icon.purpose === 'any'));
check('pwa:maskable-192', manifest.icons?.some(icon => icon.sizes === '192x192' && icon.purpose === 'maskable'));
check('pwa:maskable-512', manifest.icons?.some(icon => icon.sizes === '512x512' && icon.purpose === 'maskable'));
for (const hash of ['#tarot','#daily','#library','#school','#journal','#ai','#notifications','#music','#videos']) {
  check(`pwa:shortcut:${hash}`, manifest.shortcuts?.some(shortcut => shortcut.url.endsWith(hash)));
}

const styleBundle = Object.values(styles).join('\n');
for (const side of ['top','right','bottom','left']) {
  check(`safe-area:${side}`, styleBundle.includes(`safe-area-inset-${side}`));
}
check('layout:svh-floor', styleBundle.includes('100svh'));
check('layout:dvh-floor', styleBundle.includes('100dvh'));
check('layout:no-global-horizontal-overflow', styles.shell.includes('overflow-x:hidden'));
check('layout:no-horizontal-overscroll', styles.shell.includes('overscroll-behavior-x:none'));
check('layout:webkit-font-smoothing', styles.shell.includes('-webkit-font-smoothing:antialiased'));
check('layout:webkit-touch-callout', styles.shell.includes('-webkit-touch-callout:none'));
check('layout:touch-action-orb', styles.shell.includes('touch-action:none'));
check('layout:touch-action-controls', styleBundle.includes('touch-action:manipulation'));
check('layout:media-inline-safe', styles.mediaSkins.includes('safe-area-inset-left') && styles.mediaSkins.includes('safe-area-inset-right'));
check('layout:media-bottom-safe', styles.mediaSkins.includes('safe-area-inset-bottom'));

for (const key of ['shell','ritual','chambers','intelligence','finalContinuity','daily','spread','wisdom','commerce','mediaSkins','entry','worldPresence','spreadsSoul','schoolSoul']) {
  check(`portrait:${key}`, /@media\s*\(?max-width\s*:\s*430px\)?/.test(styles[key]), key);
}
for (const key of ['shell','orbitalMenu','ritual','chambers','daily','spread','spreadsSoul','schoolSoul']) {
  check(`landscape:${key}`, /orientation\s*:\s*landscape/.test(styles[key]), key);
}
for (const [key, source] of Object.entries(styles)) {
  check(`reduced-motion:${key}`, /prefers-reduced-motion\s*:\s*reduce/.test(source), key);
}

for (const key of ['shell','ritual','chambers','finalContinuity','spread','wisdom','commerce','mediaSkins','schoolSoul']) {
  check(`touch-target:${key}`, /min-(?:height|width)\s*:\s*(?:4[4-9]|[5-9]\d)px/.test(styles[key]), key);
}
check('touch-target:loader-recovery-48', index.includes('db-orb-loader__recovery{display:none;min-height:48px'));
check('touch-target:core-primary-52', styles.shell.includes('min-height:52px'));
check('touch-target:tarot-controls-44', styles.shell.includes('min-height:44px'));

check('orchestra:reads-visual-viewport', orchestra.includes('win?.visualViewport'));
check('orchestra:reads-standalone', orchestra.includes("'(display-mode: standalone)'") && orchestra.includes('navigator?.standalone'));
check('orchestra:reads-reduced-motion', orchestra.includes("'(prefers-reduced-motion: reduce)'"));
check('orchestra:orientation-signal', orchestra.includes("'resize','orientationchange','pageshow','popstate','hashchange','online','offline'"));
check('orchestra:one-frame-coalescing', orchestra.includes('requestAnimationFrame') && orchestra.includes('maximumPendingFrames:1'));
check('orchestra:no-set-interval', !orchestra.includes('setInterval('));
check('orchestra:no-timeout', !orchestra.includes('setTimeout('));
check('orchestra:no-observer', !orchestra.includes('MutationObserver'));
check('orchestra:protected-no-style', contract.newStylesheets === 0 && !index.includes('cosmos-final-orchestra-v610.css'));
check('presence:one-light-style', index.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence'));
check('orchestra:no-new-player', contract.newPlayers === 0 && contract.maximumActivePlayers === 1);
check('orchestra:no-automatic-playback', contract.automaticPlayback === false);
check('orchestra:no-automatic-navigation', contract.automaticNavigation === false);
check('orchestra:no-automatic-whit', contract.automaticWhitSpeech === false);
check('orchestra:physical-device-not-claimed', contract.physicalDeviceClaim === false);
check('orchestra:owner-device-check-recommended', contract.ownerPhysicalIPhoneValidationRecommended === true);

check('routes:seventeen', contract.routes.length === 17);
for (const route of contract.routes) {
  check(`route:static:${route}`, new RegExp(`<section id="${route}"`).test(index), route);
}
check('route:skins-engine', read('runtime-v12.js').includes("screen.id = 'skins'") && index.includes('id="skinsApp"'));
check('route:one-orb', (index.match(/id="orb"/g) || []).length === 1);
check('route:one-canvas', (index.match(/id="orbCanvas"/g) || []).length === 1);

check('offline:cache-v610', worker.includes("divina-bruxa-work13-v610-escola-soul"));
check('offline:fifty-three-core-assets', (worker.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1].match(/'[^']+'/g) || []).length === 53);
check('offline:final-orchestra-cached', worker.includes("'./cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra'"));
check('offline:navigation-falls-to-index', worker.includes("networkFirst(request,'./index.html')"));
check('offline:network-first-code', worker.includes('if (isCode(url))'));
check('offline:no-unbounded-media-cache', worker.includes('Imagens, fontes e mídia continuam sob o cache HTTP'));
check('boot:v610-app', index.includes('app-v208.js?v=610-work13-final-presence'));
check('boot:v610-worker', index.includes("register('./sw.js?v=610-final-presence'"));
check('boot:final-module', app.includes("cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra"));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V610',
  work:'WORK13',
  macroStage:'10-of-10 / deterministic-iphone-pwa-matrix',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  profiles:contract.iphoneProfiles.map(({ id, width, height, dpr }) => ({ id, width, height, dpr })),
  physicalDeviceClaim:false,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
