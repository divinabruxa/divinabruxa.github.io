/** Utilidades neutras: nenhuma interpretação ou dependência dos motores anteriores. */
export const cleanWhitText=(value,limit=700)=>String(value??'').replaceAll('\0','').trim().slice(0,limit);
export const normalizeWhitText=value=>cleanWhitText(value,7000).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g,' ').trim();
export function whitHash(value){let hash=0x811c9dc5;for(const char of String(value)){hash^=char.codePointAt(0);hash=Math.imul(hash,0x01000193);}return hash>>>0;}
export function secureWhitSeed(){
  if(!globalThis.crypto?.getRandomValues)throw new Error('Fonte aleatória segura indisponível.');
  return [...globalThis.crypto.getRandomValues(new Uint32Array(4))].map(n=>n.toString(16).padStart(8,'0')).join('');
}
export function normalizePreferredName(value){const name=cleanWhitText(value,48).replace(/\s+/g,' ');return name.length>=2&&/^[\p{L}\p{M}][\p{L}\p{M}'’ -]*$/u.test(name)&&name.split(' ').length<=5?name:'';}
// Somente compatibilidade com a validação de links já existente. O novo núcleo não cria pesquisas.
export function safeResearchHref(value){const href=cleanWhitText(value,500);return /^https:\/\/(?:pt\.wikipedia\.org\/w\/index\.php\?search=|www\.google\.com\/search\?q=)[^\s]+$/i.test(href)?href:'';}
