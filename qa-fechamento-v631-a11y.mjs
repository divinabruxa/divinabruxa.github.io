import fs from 'node:fs';
import assert from 'node:assert/strict';

const menu=fs.readFileSync(new URL('./orbital-menu-v502.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./orbital-menu-v502.css',import.meta.url),'utf8');
let checks=0;
const has=(text,token)=>{assert.ok(text.includes(token),`ausente: ${token}`);checks+=1;};

[
  "root.setAttribute('role', 'dialog')",
  "root.setAttribute('aria-modal', 'true')",
  "root.setAttribute('aria-labelledby', 'db502MenuTitle')",
  "root.setAttribute('aria-describedby', 'db502MenuHint')",
  'aria-label="Intenções da Divina Bruxa"',
  'role="status" aria-live="polite" aria-atomic="true"',
  "this.entryButton = document.querySelector('#cosmosEntryIntent')",
  'const focusable = [this.entryButton, this.core.orb, ...this.visibleButtons]',
  "if (event.key === 'Escape')",
  "event.key === 'ArrowRight' || event.key === 'ArrowLeft'",
  "button.setAttribute('tabindex', visible ? '0' : '-1')",
  "button.setAttribute('aria-current', 'page')",
  "this.root.setAttribute('aria-hidden', String(!interactive))",
  "this.legacy.setAttribute?.('aria-hidden', 'true')",
  'this.legacy.inert = true',
  "ariaLabel:'Orbe central. Voltar ao Início'"
].forEach(token=>has(menu,token));

[
  '.db502-portal:focus-visible',
  'outline:none',
  'border:2px solid rgba(122,223,255,.72)',
  '.db502-menu__live{position:fixed;width:1px;height:1px',
  'clip-path:inset(50%)',
  '@media (prefers-reduced-motion:reduce)',
  'transition-duration:80ms!important',
  '@media (forced-colors:active)',
  'forced-color-adjust:auto',
  'border:2px solid ButtonText'
].forEach(token=>has(css,token));

const routes=['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
for(const route of routes){
  assert.ok(menu.includes(`route:'${route}'`),`sem destino acessível: ${route}`);
  checks+=1;
}

console.log(`V631 acessibilidade: ${checks}/${checks} PASS`);
