import fs from 'node:fs';
import assert from 'node:assert/strict';

const menu=fs.readFileSync(new URL('./orbital-menu-v502.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./orbital-menu-v502.css',import.meta.url),'utf8');
const entry=fs.readFileSync(new URL('./cosmos-entry-intention-v610.js',import.meta.url),'utf8');
const entryCss=fs.readFileSync(new URL('./cosmos-entry-intention-v610.css',import.meta.url),'utf8');
let checks=0;
const has=(text,token)=>{assert.ok(text.includes(token),`ausente: ${token}`);checks+=1;};
const lacks=(text,token)=>{assert.ok(!text.includes(token),`proibido: ${token}`);checks+=1;};

[
  'VERSION = 631',"AUTHORITY = 'v631-fechamento-supremo'",
  "STYLE_HREF = './orbital-menu-v502.css?v=631-fechamento-supremo'",
  "orbitalMenuStyle = 'v631'","release:'V631-FECHAMENTO-SUPREMO'",
  "label:'Início'",'>Início</span>','this.entryButton','this.silenceLegacyMenu()',
  'this.legacy.hidden = true',"dataset.retiredBy = AUTHORITY",'restoreLegacyMenu()',
  'DISCOVERY_CUE_DELAY_MS','DISCOVERY_CUE_MS','queueDiscoveryCue()',
  "classList.add('is-discovery-cue')",'this.discoveryCueShown = true',
  'oneShotDiscoveryCue:true','duplicateOriginLabel:false','visibleAdministrativeHeader:false',
  'legacyMenuSilenced:Boolean','maximumVisibleIntentions:2','automaticRotation:false',
  'permanentAnimationLoops:0','technicalMenuCopy:0','preserveClaim:true',
  'this.core.navigate(route','samePhysicalOrb','menuList:false','menuGrid:false',
  "work13:'concluido-e-congelado'",'work14:false'
].forEach(token=>has(menu,token));

[
  'FECHAMENTO-SUPREMO',"invitation:'entra-presenca'",'pentagramAssets:1',
  'pentagramIsMenu:true','globalPentagram:true','pentagramTogglesMenu:true',
  "'orb-threshold'","'top-corner'",'Entrá na Divina Bruxa',
  "tarotOrbAction:'reveal-only'",'tarotOrbOpensMenu:false',
  'visibleEntryWordsHome:1','visibleEntryWordsWorlds:0',
  'permanentAnimationLoops:0','technicalMenuCopy:0','work14:false'
].forEach(token=>has(entry,token));

[
  'content:"Entrá"','min-width:48px','min-height:48px',
  'env(safe-area-inset-top)','env(safe-area-inset-right)',
  'touch-action:manipulation','prefers-reduced-motion:reduce',
  'forced-colors:active','animation:none!important'
].forEach(token=>has(entryCss,token));

[
  'FECHAMENTO SUPREMO V631','html.db502-menu-open .app-header',
  'visibility:hidden!important','background:none!important',
  'html[data-menu-authority="v631-fechamento-supremo"] #orbMenu',
  '#orbMenu[hidden][aria-hidden="true"]','display:none!important',
  '.db502-menu.is-discovery-cue.has-intentions .db502-portal.is-offered',
  'translateX(-8px)','prefers-reduced-motion:reduce','forced-colors:active',
  'clip-path:inset(50%)','filter:none!important','animation:none'
].forEach(token=>has(css,token));

['content:"ORIGEM"','@keyframes','infinite','setInterval(','new Worker(','createElement(\'canvas\')','location.reload','window.location='].forEach(token=>{
  lacks(menu,token);
  lacks(css,token);
  lacks(entry,token);
  lacks(entryCss,token);
});

['index.html','app-v208.js','sw.js'].forEach(name=>{
  assert.ok(!fs.existsSync(new URL(`./${name}`,import.meta.url)),`arquivo congelado incluído: ${name}`);
  checks+=1;
});

const routes=['home','tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
for(const route of routes){assert.ok(menu.includes(`route:'${route}'`),`rota ausente: ${route}`);checks+=1;}
has(menu,'INTENTIONS.length + 1');

console.log(`V631 estrutural: ${checks}/${checks} PASS`);
