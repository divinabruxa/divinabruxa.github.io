import fs from 'node:fs';
import assert from 'node:assert/strict';

const entry=fs.readFileSync(new URL('./cosmos-entry-intention-v610.js',import.meta.url),'utf8');
let checks=0;
const has=token=>{assert.ok(entry.includes(token),`ausente: ${token}`);checks+=1;};

[
  'RETORNO PELA MESMA ORBE · V632','VERSION = 632',
  "correction:'menu-supremo-retorno-pela-mesma-orbe'",
  "menuOpenOrbAction:'home'",'menuOpenOrbDelegatesToMenu:true',
  "menuOpenOrbAriaLabel:'Orbe central. Toque para voltar ao Início'",
  "dataset.fechamentoSupremo = 'v632'","dataset.work13MenuSymbol = 'pentagram-v632'",
  "menuOpen\n        ? 'Orbe central. Toque para voltar ao Início'",
  "if (this.menuState !== 'closed') return;",
  "tarotOrbAction:'reveal-only'",'tarotOrbOpensMenu:false',
  'realityOwnedOrbActionsPreserved:true','journalThresholdOrbActionPreserved:true',
  'pentagramAssets:1','newCanvases:0','newRenderers:0',
  'permanentAnimationLoops:0','technicalMenuCopy:0',
  'homePreserved:true','worldsFrozen:true','work14:false'
].forEach(has);

assert.equal((entry.match(/if \(this\.menuState !== 'closed'\) return;/g)||[]).length,2,'clique e teclado delegam à Orbe do menu');checks+=1;

['infinite','setInterval(','new Worker(','createElement(\'canvas\')','location.reload','window.location='].forEach(token=>{
  assert.ok(!entry.includes(token),`proibido: ${token}`);checks+=1;
});

['index.html','app-v208.js','sw.js','orbital-menu-v502.js','orbital-menu-v502.css','cosmos-entry-intention-v610.css'].forEach(name=>{
  assert.ok(!fs.existsSync(new URL(`./${name}`,import.meta.url)),`arquivo congelado incluído: ${name}`);checks+=1;
});

console.log(`V632 estrutural: ${checks}/${checks} PASS`);
