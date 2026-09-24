import fs from 'node:fs';
import assert from 'node:assert/strict';

const entry=fs.readFileSync(new URL('./cosmos-entry-intention-v610.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./cosmos-entry-intention-v610.css',import.meta.url),'utf8');
let checks=0;
const has=(text,token)=>{assert.ok(text.includes(token),`ausente: ${token}`);checks+=1;};

[
  'ORBE SOZINHA, MUNDOS REAIS · V633','VERSION = 633',
  "correction:'orbe-sozinha-portas-reais'",
  'worldOrbOpensMenu:false',"worldOrbAction:'open-current-world'",
  'orbAloneArrival:true','technicalWorldLayersVisible:false',
  'realWorldSurfacesUnlocked:15','consultationsEntryReconnected:true',
  "consultations:'[data-v608-action=\"consultations-start\"]'",
  "store:'[data-v608-action=\"store-start\"]'",
  "subscriptions:'[data-v608-action=\"subscriptions-primary\"]'",
  "root.dataset.fechamentoSupremo = 'v633'",
  "root.dataset.fsupremeWorlds = 'v633'",
  "this.entry.dataset.work13MenuSymbol = 'pentagram-v633'",
  "screen.dataset.fsupremeWorldPhase = 'arrival'",
  "screen.dataset.fsupremeWorldPhase = 'world'",
  "event.stopImmediatePropagation?.()",
  "this.invokeWorldEntry(screen,this.route,orbWasInThreshold)",
  "divina:fsupreme-world-opened",
  "tarotOrbAction:'reveal-only'",'tarotOrbOpensMenu:false',
  'pentagramAssets:1','newCanvases:0','newRenderers:0',
  'permanentAnimationLoops:0','technicalMenuCopy:0',
  'homePreserved:true','worldsFrozen:false','worldsReopenedByProof:true','work14:false'
].forEach(token=>has(entry,token));

[
  'data-fsupreme-world-phase="arrival"',
  '> :not([data-fsupreme-orb-path]):not([data-route-recovery])',
  '[data-fsupreme-orb-anchor]',
  'data-fsupreme-world-phase="world"',
  '.db585-intent-threshold:not(:has(#orb))',
  '.db585-intent-threshold:has(#orb)',
  '#consultations[data-fsupreme-world-phase="world"] > #consultationApp',
  '#store[data-fsupreme-world-phase="world"] > #storeApp',
  '#school[data-fsupreme-world-phase="world"] > #schoolApp',
  '#journal[data-fsupreme-world-phase="world"] > #journalApp',
  '#videos[data-fsupreme-world-phase="world"] > .vw626',
  '#subscriptions[data-fsupreme-world-phase="world"] > #subscriptionApp',
  '#notifications[data-fsupreme-world-phase="world"] > #notificationApp',
  '.ec530-nav', '.ir531-nav', '.db608-commerce-guide',
  '@keyframes db633-world-arrive',
  '@media(prefers-reduced-motion:reduce)',
  '@media(forced-colors:active)'
].forEach(token=>has(css,token));

['setInterval(','new Worker(','createElement(\'canvas\')','location.reload','window.location='].forEach(token=>{
  assert.ok(!entry.includes(token),`proibido: ${token}`);checks+=1;
});
assert.ok(!css.includes('infinite'), 'nenhum loop CSS infinito');checks+=1;

['index.html','app-v208.js','sw.js','orbital-menu-v502.js','orbital-menu-v502.css'].forEach(name=>{
  assert.ok(!fs.existsSync(new URL(`./${name}`,import.meta.url)),`arquivo não substituído incluído: ${name}`);checks+=1;
});

const routeNames=['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
for(const route of routeNames){
  assert.ok(entry.includes(`${route}:`)||entry.includes(`'${route}'`),`rota ausente: ${route}`);checks+=1;
}

console.log(`V633 estrutural: ${checks}/${checks} PASS`);
