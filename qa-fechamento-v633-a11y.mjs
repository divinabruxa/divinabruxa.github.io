import fs from 'node:fs';
import assert from 'node:assert/strict';

const js=fs.readFileSync(new URL('./cosmos-entry-intention-v610.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./cosmos-entry-intention-v610.css',import.meta.url),'utf8');
let checks=0;
const has=(text,token)=>{assert.ok(text.includes(token),`ausente: ${token}`);checks+=1;};

[
  "this.entry.setAttribute('aria-label'",
  "this.entry.setAttribute('aria-hidden'",
  "this.entry.setAttribute('aria-expanded'",
  "this.entry.tabIndex = interactive ? 0 : -1",
  "if (!['Enter',' '].includes(event?.key) || event?.repeat) return",
  "Orbe viva de ${REALITY_NAMES[this.route] || 'uma nova realidade'}. Toque para entrar",
  "Orbe viva. Toque para revelar a próxima carta",
  "Orbe viva. Toque para abrir a Carta do Dia",
  "Orbe viva. Toque para descobrir uma carta",
  "Orbe viva. Toque para conversar com Whit",
  "'Fechar o universo de caminhos'",
  "'Abrir o universo de caminhos'",
  "event.preventDefault?.()",
  "event.stopImmediatePropagation?.()",
  "divina:fsupreme-world-opened"
].forEach(token=>has(js,token));

[
  '.cosmos-entry-intent:focus-visible',
  'outline:2px solid rgba(255,222,174,.96)',
  'min-width:48px',
  'min-height:48px',
  '-webkit-tap-highlight-color:transparent',
  'touch-action:manipulation',
  '@media(prefers-reduced-motion:reduce)',
  'animation:none!important',
  '@media(forced-colors:active)',
  'outline:2px solid ButtonText!important'
].forEach(token=>has(css,token));

const routes=['tarot','daily','spreads','library','school','journal','ai','consultations','store','skins','music','videos','subscriptions','login','notifications'];
for(const route of routes){
  assert.ok(js.includes(`${route}:`)||js.includes(`'${route}'`),`nome acessível ausente: ${route}`);checks+=1;
}

assert.ok(!/aria-hidden=['"]true['"][^\n]*#orb/.test(css),'Orbe não é escondida da árvore acessível');checks+=1;
console.log(`V633 acessibilidade: ${checks}/${checks} PASS`);
