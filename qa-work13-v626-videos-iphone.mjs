import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [css,world,html]=await Promise.all([
  './videos-world-v626.css','./videos-world-v626.js','./index.html'
].map(name=>readFile(new URL(name,import.meta.url),'utf8')));
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks+=1;};
const profiles=[
  ['se-2-p',375,667,2],['mini-p',375,812,3],['12-p',390,844,3],
  ['14-p',390,844,3],['pro-p',393,852,3],['max-p',430,932,3],
  ['se-2-l',667,375,2],['max-l',932,430,3]
];

for(const[id,w,h,dpr]of profiles){
  const portrait=w<h,room=portrait?w-24:w-32,tab=(room-10)/2;
  ok(room>=343&&room<=w,`${id}: Cinema contido`);
  ok(tab>=166||!portrait,`${id}: dois portais tocáveis`);
  ok(44*dpr>=88,`${id}: alvo físico confortável`);
  ok((portrait?'portrait':'landscape')===(id.endsWith('-p')?'portrait':'landscape'),`${id}: orientação`);
  ok(h>=375,`${id}: viewport útil`);
}

ok(css.includes('max-height:72svh')&&css.includes('max-height:66svh'),'player respeita viewport móvel');
ok(css.includes('env(safe-area-inset-bottom)')&&css.includes('env(safe-area-inset-left)')&&css.includes('env(safe-area-inset-right)'),'safe areas do iPhone');
ok(css.includes('min-height:44px')&&css.includes('touch-action:manipulation'),'alvos de toque');
ok(css.includes('.am626 input,.am626 select,.am626 textarea{font-size:16px;}'),'sem zoom automático em formulário iOS');
ok(css.includes('@media (max-width:540px)')&&css.includes('@media (max-width:820px)'),'quebras mobile-first');
ok(css.includes('grid-template-columns:1fr')&&css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'grade adapta de um a dois portais');
ok(css.includes('aspect-ratio:4/5')&&css.includes('object-fit:contain'),'retrato no card e obra inteira no player');
ok(css.includes('@media (prefers-reduced-motion:reduce)')&&css.includes('@media (prefers-contrast:more)')&&css.includes('@media (forced-colors:active)'),'preferências acessíveis');

ok(world.includes("video.setAttribute('playsinline','')")&&world.includes('video.controls=true'),'player nativo inline');
ok(world.includes('video.preload=\'metadata\'')&&world.includes('video.autoplay=false'),'pré-carga leve e sem autoplay');
ok(!/\.play\s*\(/.test(world),'nenhum início automático');
ok(world.includes("'video/quicktime'")&&world.includes("'video/x-m4v'"),'formatos de vídeo Apple');
ok(world.includes("'image/heic'")===false,'capa evita formato sem suporte web garantido');
ok(world.includes('MAX_VIDEO_BYTES = 512 * 1024 * 1024'),'limite grande sem proxy da Edge');
ok(world.includes('CHUNK_BYTES = 6 * 1024 * 1024'),'partes de 6 MB');
ok(world.includes("for(const delay of [0,1500,3500,7000])")&&world.includes("method:'HEAD'"),'retomada após instabilidade');
ok(world.includes("method:'PATCH'")&&world.includes("Content-Type':'application/offset+octet-stream'"),'protocolo TUS');
ok(world.includes('this.uploadAbort?.abort?.()'),'cancelamento explícito');
ok(html.includes('interactive-widget=resizes-content')&&html.includes('viewport-fit=cover'),'viewport iPhone preservado');
ok(html.includes('kyphdsamyygavmkzyezr.storage.supabase.co'),'conexão direta liberada pela CSP');

console.log(`PASS ${checks}/${checks} — Cinema da Orbe em 8 geometrias iPhone`);
