import fs from 'node:fs';
import assert from 'node:assert/strict';
const js=fs.readFileSync(new URL('./notifications-world-v628.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('./notifications-world-v628.css',import.meta.url),'utf8');
const loader=fs.readFileSync(new URL('./page-loader-v1.js',import.meta.url),'utf8');
let checks=0;
const has=(text,token)=>{assert.ok(text.includes(token),`ausente: ${token}`);checks++;};
[
  'version:628',"masterDefault:false","permission:'after-explicit-gesture'","preferences:'local-device-only'",
  "start:'22:00'","end:'08:00'","timeZone:'America/Sao_Paulo'","dailyCardReveal:false",
  'privateSegmentation:false','marketingDefault:false','providerPush:false','automaticSend:false',
  'automaticSchedule:false','localTestOnly:true','oneOrb:true','extraCanvas:0','work14:false',
  'Carta do Dia','Escola','Consultas','Conta e segurança','Pagamentos','Orbe IA','Música',
  'Episódios e Memojis','Skins','Novidades e ofertas','Diário, perguntas, tiragens, cartas',
  'Notification.requestPermission()','new Notification(','silent:true','divina:notification-opened',
  'action-completed','safeNotificationTargetV628','localStorage.setItem','ABRIR MEUS SINAIS'
].forEach(token=>has(js,token));
['notifications-world-v628.css?v=628-sinais-do-cosmos','notifications-world-v628.js?v=628-sinais-do-cosmos','createNotificationsWorldV628','skins-world-v627.js?v=627-atelie-dos-universos','notifications-sinais-do-cosmos','divinaCosmosVivoV628'].forEach(token=>has(loader,token));
['env(safe-area-inset-bottom)','min-height:48px','font-size:16px','prefers-reduced-motion','prefers-contrast:more','forced-colors:active','orientation:landscape'].forEach(token=>has(css,token));
['@keyframes','animation:','<canvas','setInterval(','fetch(','supabase','diario_entries','whit_messages'].forEach(token=>{assert.ok(!js.includes(token),`proibido no JS: ${token}`);checks++;});
assert.equal((js.match(/\['(?:daily|school|consultations|account|billing|orb|music|episodes|skins|marketing)'/g)||[]).length>=10,true);checks++;
console.log(`V628 estrutural: ${checks}/${checks} PASS`);
