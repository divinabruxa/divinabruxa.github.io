import assert from'node:assert/strict';import{readFile}from'node:fs/promises';const css=await readFile(new URL('./conta-world-v624.css',import.meta.url),'utf8');let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++};
const profiles=[['se-2-p',375,667,2],['mini-p',375,812,3],['12-p',390,844,3],['14-p',390,844,3],['pro-p',393,852,3],['max-p',430,932,3],['se-2-l',667,375,2],['max-l',932,430,3]];
for(const[id,w,h,dpr]of profiles){const portrait=w<h,room=w<=430?w-16:Math.min(w-28,980);ok(room>320&&room<=w,`${id}: casa contida`);ok((portrait?'portrait':'landscape')===(id.endsWith('-p')?'portrait':'landscape'),`${id}: orientação`);ok(48*dpr>=96,`${id}: alvo físico confortável`);ok(h>=375,`${id}: teclado e viewport utilizáveis`)}
ok(css.includes('min-block-size:100dvh')&&css.includes('min-block-size:100svh'),'viewports dinâmico e seguro');
ok(css.includes('safe-area-inset-top')&&css.includes('safe-area-inset-bottom'),'safe areas verticais');
ok(css.includes('safe-area-inset-left')&&css.includes('safe-area-inset-right'),'safe areas horizontais');
ok(css.includes('width:min(calc(100% - 32px),800px)')&&css.includes('width:min(calc(100% - 28px),980px)'),'conteúdo contido');
ok(css.includes('min-block-size:48px')&&css.includes('min-block-size:50px'),'botões e campos confortáveis');
ok(css.includes('touch-action:manipulation')&&css.includes('-webkit-tap-highlight-color:transparent'),'toque Safari limpo');
ok(css.includes('overflow-x:clip'),'sem vazamento lateral');
ok(css.includes('@media(max-width:430px)')&&css.includes('@media(orientation:landscape) and (max-height:520px)'),'cortes iPhone');
ok(css.includes('@media(prefers-reduced-motion:reduce)')&&css.includes('@media(forced-colors:active)'),'acessibilidade');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:|position\s*:\s*fixed|100vw|url\(/.test(css),'sem peso ou largura instável');
console.log(`PASS ${checks}/${checks} — Casa do Retorno em 8 geometrias iPhone`);
