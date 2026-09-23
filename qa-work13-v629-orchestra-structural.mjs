import fs from 'node:fs';
import assert from 'node:assert/strict';
const js=fs.readFileSync(new URL('./cosmos-supreme-orchestra-v629.js',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('./page-loader-v1.js',import.meta.url),'utf8');
let checks=0;
const has=(text,token)=>{assert.ok(text.includes(token),`ausente: ${token}`);checks++;};
[
  'version:629',"work:'WORK13'","stage:'orquestra-suprema-dos-mundos'",'worlds:15',
  'routeReloads:0','extraOrbs:0','extraCanvas:0','extraPlayers:0','extraMenus:0',
  'duplicateListeners:false',"movement:'event-driven'",'iphoneGeometries:8','safariReturn:true',
  'pwaResume:true','offlineContinuity:true','reducedMotion:true','productionPublishAuthorized:false',
  'dnsChangesAuthorized:false','realBillingAuthorized:false','storeSubmissionAuthorized:false',
  'campaignsAuthorized:false','orbeAiSolEnabled:false','work14:false','WORK13_WORLDS_V629',
  'normalizeWorldRouteV629','nextJourneyStateV629','mediaBelongsToRouteV629','compactJourneyV629',
  'divina:supreme-orb-did-navigate','divina:route-ready','divina:page-ready','visibilitychange',
  'pageshow','safari-bfcache','prefers-reduced-motion: reduce','serviceWorker.getRegistration()',
  "querySelectorAll('audio,video')",'media.pause()','#cosmosEntryIntent','canonicalOrbs<=1',
  'canonicalCanvases<=1','openPlayers<=1','menuRoots<=1','work13Closed:true'
].forEach(token=>has(js,token));
[
  "./cosmos-supreme-orchestra-v629.js?v=629-orquestra-suprema",'createCosmosSupremeOrchestraV629',
  'orchestraStatus','orchestra?.destroy?.()','notifications-world-v628.js?v=628-sinais-do-cosmos',
  'skins-world-v627.js?v=627-atelie-dos-universos'
].forEach(token=>has(loader,token));
['location.reload','window.location=','setInterval(','requestAnimationFrame(','<canvas','createElement(\'canvas\')','new Audio(','new Worker('].forEach(token=>{assert.ok(!js.includes(token),`proibido: ${token}`);checks++;});
assert.equal((js.match(/'tarot'|'daily'|'spreads'|'library'|'school'|'journal'|'ai'|'consultations'|'store'|'music'|'videos'|'skins'|'subscriptions'|'login'|'notifications'/g)||[]).length>=15,true);checks++;
console.log(`V629 estrutural: ${checks}/${checks} PASS`);
