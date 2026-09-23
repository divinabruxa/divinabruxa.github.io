import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const [html,app,sw,world,css,edge,sql]=await Promise.all([
  './index.html','./app-v208.js','./sw.js','./videos-world-v626.js',
  './videos-world-v626.css','./memoji-videos-v626-edge.ts','./SUPABASE-SETUP-V626-MEMOJIS.sql'
].map(read));
let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks+=1;};
const count=(source,pattern)=>(source.match(pattern)||[]).length;

ok(count(html,/id="orb"/g)===1&&count(html,/id="orbCanvas"/g)===1,'uma Orbe e um canvas');
ok(count(html,/<section id="videos"/g)===1&&count(html,/id="videoApp"/g)===1,'um mundo e um corpo de vídeos');
ok(count(html,/id="adminMemojiV626Host"/g)===1&&count(html,/id="adminApp"/g)===1,'host Memoji separado do Admin legado');
ok(html.includes('name="divina-work13" content="V626"')&&html.includes('V626-VIDEOS-CINEMA-DA-ORBE'),'release V626');
ok(html.includes('app-v208.js?v=626-videos-cinema-da-orbe')&&html.includes('sw.js?v=626-videos-cinema-da-orbe'),'cache busting V626');
ok(html.includes('VÍDEOS · CINEMA DA ORBE · V626')&&html.includes('Seus Memojis têm palco'),'entrada do Cinema da Orbe');
ok(html.includes('Memojis &amp; Tarot')&&html.includes('Vídeos · Memojis'),'menus reconhecem os dois portais');
ok(html.includes('kyphdsamyygavmkzyezr.storage.supabase.co'),'CSP permite Storage direto');

ok(app.includes("videos-world-v626.js?v=626-cinema-da-orbe")&&count(app,/createVideosWorldV626/g)===2,'ligação única do mundo');
ok(app.includes('config:CONFIG')&&app.includes('media:window.divinaMediaSupremeReleaseV559')&&app.includes('livingMedia:livingMediaSkins')&&app.includes('orbCore:supremeOrb'),'autoridades existentes reutilizadas');
ok(app.includes('window.orbe.videosWorld = videosWorld')&&app.includes('window.orbe.cinemaDaOrbe = videosWorld'),'publicação na Orbe');
ok(app.includes("stage:'renovacao-dos-mundos-13-videos'")&&app.includes("universe:'cinema-da-orbe'"),'etapa 13 declarada');
ok(app.includes('base:window.divinaWork13MusicaWorldV625')&&app.includes('window.divinaCosmosVivoV626'),'continua o V625');
ok(app.includes('videosWorldStatus:videosWorld?.status?.() || null'),'Orquestra recebe o estado');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_VIDEOS_WORLD_ACTIVE'")&&app.includes("dataset.work13VideosWorld = 'v626'"),'worker e identidade ligados');
ok(app.includes('videosWorldOfficialEpisodesAtRelease:0')&&app.includes('videosWorldInventedEpisodes:0'),'verdade editorial no boot');

for(const token of [
  'VIDEOS_WORLD_CONTRACT_V626',"universe:'cinema-da-orbe'",
  "channels:Object.freeze(['memoji-native','de-frente-com-o-tarot-youtube'])",
  "primaryChannel:'memoji-native'","memojiRole:'rosto-e-voz-da-orbe'",
  "memojiUpload:'signed-resumable-tus'",'iphoneDirectUpload:true',
  'privateStorage:true','publicSignedPlayback:true',
  "adminAuthority:'owner-confirmed-email-mfa-aal2-active-session-recovery-codes'",
  "editorialStates:Object.freeze([...STATES])",'editable:true','reorderable:true','hideable:true',
  "youtubeAuthority:'V559-preserved'","youtubeProject:'De Frente com o Tarot'",
  'officialEpisodesAtRelease:0','inventedEpisodes:0','publicPublishedOnly:true',
  'playerLoadsAfterExplicitGesture:true','autoplay:false','maximumActivePlayers:1',
  'anotherPlayerStopsBeforePlayback:true','existingVideoBodyReused:true',
  'oneCanonicalOrb:true','newOrbs:0','newCanvases:0','newRenderers:0',
  'automaticNavigation:false','automaticWhitSpeech:false','privateContentReads:0',
  'permanentAnimationLoops:0','mutationObservers:0','iphoneFirst:true','work14:false'
])ok(world.includes(token),`contrato: ${token}`);

ok(world.includes("video.setAttribute('playsinline','')")&&world.includes('video.autoplay=false'),'vídeo nativo sem autoplay');
ok(!/\.play\s*\(/.test(world),'nenhum play programático');
ok(count(world,/createElement\('video'\)/g)===1,'um construtor de player nativo');
ok(world.includes("safeCall(engine,'unloadPlayer',true)")&&world.includes("querySelectorAll?.('iframe,video,audio')"),'player anterior é encerrado');
ok(world.includes("credentials:scope==='admin'?'include':'omit'"),'cookies enviados somente ao Admin');
ok(!world.includes('SUPABASE_SERVICE_ROLE_KEY')&&!world.includes('service_role'),'nenhuma chave de serviço no navegador');
ok(world.includes("action:'prepare_upload'")&&world.includes("'Tus-Resumable':'1.0.0'")&&world.includes('CHUNK_BYTES = 6 * 1024 * 1024'),'upload TUS assinado');
ok(world.includes("accept=\"video/mp4,video/quicktime,video/webm,video/x-m4v\""),'formatos do iPhone aceitos');

ok(sw.includes('const VERSION = 626;')&&sw.includes('divina-bruxa-work13-v626-videos-cinema-da-orbe'),'worker V626');
ok(sw.includes("'./videos-world-v626.js?v=626-cinema-da-orbe'")&&sw.includes("'./videos-world-v626.css?v=626-cinema-da-orbe'"),'dois novos ativos no núcleo');
ok((sw.slice(sw.indexOf('const CORE'),sw.indexOf(']);',sw.indexOf('const CORE'))).match(/^  '\.\//gm)||[]).length===80,'80 ativos essenciais');
ok(sw.includes("type:'DIVINA_WORK13_VIDEOS_WORLD_ACTIVE'")&&sw.includes('base:625'),'ativação pública sobre V625');
ok(sw.includes("memojiUpload:'signed-resumable-tus'")&&sw.includes('officialEpisodesAtRelease:0'),'contrato do worker');

ok(css.includes('#videos[data-videos-world="v626"]')&&css.includes('.vw626-portals'),'mundo visual isolado');
ok(css.includes('.vw626-player-shell video')&&css.includes('#videos[data-v626-player="active"]'),'obra em primeiro plano');
ok(css.includes('.am626-portals')&&css.includes('.am626-progress'),'Admin e progresso próprios');
ok(css.includes('@media (prefers-reduced-motion:reduce)')&&css.includes('@media (forced-colors:active)'),'acessibilidade');

ok(edge.includes("const BUCKET='memoji-videos-v626'")&&sql.includes("'memoji-videos-v626'"),'cofre coerente');
ok(edge.includes("createSignedUploadUrl(path,{upsert:false})")&&edge.includes("createSignedUrl(safe,SIGNED_READ_SECONDS)"),'URLs assinadas de escrita e leitura');
ok(sql.includes('revoke all on table public.memoji_videos from public, anon, authenticated'),'Data API fechada');

console.log(`PASS ${checks}/${checks} — estrutura do Cinema da Orbe V626`);
