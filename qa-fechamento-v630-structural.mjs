import fs from 'node:fs';
import assert from 'node:assert/strict';
const entry=fs.readFileSync(new URL('./cosmos-entry-intention-v610.js',import.meta.url),'utf8');
const entryCss=fs.readFileSync(new URL('./cosmos-entry-intention-v610.css',import.meta.url),'utf8');
const menu=fs.readFileSync(new URL('./orbital-menu-v502.js',import.meta.url),'utf8');
const menuCss=fs.readFileSync(new URL('./orbital-menu-v502.css',import.meta.url),'utf8');
let checks=0;
const has=(text,token)=>{assert.ok(text.includes(token),`ausente: ${token}`);checks++;};
[
  'FECHAMENTO-SUPREMO',"work13:'concluido-e-congelado'",'work14:false',"invitation:'entra-presenca'",
  'visibleEntryWordsHome:1','visibleEntryWordsWorlds:0','permanentAnimationLoops:0','technicalMenuCopy:0',
  "dataset.fechamentoMenu = 'v630'","dataset.work14 = 'false'",'#home .orb-stage-ref',
  "'orb-threshold'","'top-corner'",'Entrá na Divina Bruxa','tarotOrbAction:\'reveal-only\'',
  'tarotOrbOpensMenu:false','maximumVisibleIntentions:2','newCanvases:0','newRenderers:0'
].forEach(token=>has(entry,token));
[
  'V630-FECHAMENTO-SUPREMO',"AUTHORITY = 'v630-fechamento-supremo'",'maximumVisibleIntentions:2',
  'INTENTION_FRAMES','automaticRotation:false','permanentAnimationLoops:0','technicalMenuCopy:0',
  "STYLE_HREF = './orbital-menu-v502.css?v=630-fechamento-supremo'",'this.core.navigate(route',
  'preserveClaim:true','samePhysicalOrb','menuList:false','menuGrid:false'
].forEach(token=>has(menu,token));
[
  'content:"Entrá"','min-width:48px','min-height:48px','env(safe-area-inset-right)',
  'prefers-reduced-motion:reduce','forced-colors:active','animation:none!important'
].forEach(token=>has(entryCss,token));
[
  'data-fechamento-menu="v630"','clip-path:inset(50%)','filter:none!important','animation:none'
].forEach(token=>has(menuCss,token));
['infinite','setInterval(','new Worker(','createElement(\'canvas\')','location.reload','window.location='].forEach(token=>{
  assert.ok(!entry.includes(token)&&!menu.includes(token)&&!entryCss.includes(token)&&!menuCss.includes(token),`proibido: ${token}`);checks++;
});
['index.html','app-v208.js','sw.js'].forEach(name=>{assert.ok(!fs.existsSync(new URL(`./${name}`,import.meta.url)),`arquivo congelado incluído: ${name}`);checks++;});
const routes=['home','tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
for(const route of routes){assert.ok(menu.includes(`route:'${route}'`),`rota ausente: ${route}`);checks++;}
has(menu,'INTENTIONS.length + 1');
console.log(`V630 estrutural: ${checks}/${checks} PASS`);
