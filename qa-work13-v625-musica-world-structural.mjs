import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=name=>readFile(new URL(name,import.meta.url),'utf8');
const [html,app,sw,world,css]=await Promise.all([
  './index.html','./app-v208.js','./sw.js','./musica-world-v625.js','./musica-world-v625.css'
].map(read));
let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks+=1};
const count=(source,pattern)=>(source.match(pattern)||[]).length;

ok(count(html,/id="orb"/g)===1&&count(html,/id="orbCanvas"/g)===1,'uma Orbe e um canvas');
ok(count(html,/<section id="music"/g)===1&&count(html,/id="musicApp"/g)===1,'um corpo Música');
ok(html.includes('name="divina-work13" content="V625"')&&html.includes('V625-MUSICA-PALCO-DAS-ESTRELAS'),'release V625');
ok(html.includes('app-v208.js?v=625-musica-palco-das-estrelas')&&html.includes('sw.js?v=625-musica-palco-das-estrelas'),'cache busting completo');
ok(html.includes('Sobre as Estrelas e Z acendem o Palco das Estrelas.')&&html.includes('18 faixas oficiais'),'duas obras reais na entrada');
ok(count(app,/createMusicaWorldV625/g)===2&&app.includes("musica-world-v625.js?v=625-palco-das-estrelas"),'ligação única');
ok(app.includes('media:window.divinaMediaSupremeReleaseV559')&&app.includes('livingMedia:livingMediaSkins')&&app.includes('orbCore:supremeOrb'),'motores existentes reutilizados');
ok(app.includes('window.orbe.musicaWorld = musicaWorld')&&app.includes('window.divinaWork13MusicaWorldV625'),'publicação na Orbe');
ok(app.includes("stage:'renovacao-dos-mundos-12-musica'")&&app.includes("universe:'palco-das-estrelas'"),'mundo Música declarado');
ok(app.includes('musicaWorldStatus:musicaWorld?.status?.() || null'),'orquestra recebe estado');
ok(app.includes("event.data?.type === 'DIVINA_WORK13_MUSICA_WORLD_ACTIVE'")&&app.includes('window.divinaCosmosVivoV625'),'worker e continuidade');
ok(app.includes("document.documentElement.dataset.work13Macro = 'musica-palco-das-estrelas'")&&app.includes("document.documentElement.dataset.work13ContaWorld = 'v624'"),'V625 ativo sobre V624 protegido');

for(const token of [
  'MUSICA_WORLD_CONTRACT_V625',"universe:'palco-das-estrelas'",
  "identity:'cosmic-black-violet-magenta-champagne-starlight'",
  "musicAuthority:'V559-preserved'","livingMediaAuthority:'V609-preserved'",
  "artist:'Hércules DX'","title:'Sobre as Estrelas'","title:'Z'",
  'verifiedAlbumCount:2','verifiedTracks:18','inventedAlbums:0','inventedTracks:0',
  "futureReleaseTypes:Object.freeze(['album','ep','single'])",
  'futureReleasesAdminEditable:true','draftPublishedFlowPreserved:true',
  'publishedCatalogueOnly:true','coverTitleCreditsStoryPreserved:true',
  "officialPlayer:'spotify-embed-or-official-link'",'playerLoadsAfterExplicitGesture:true',
  'playbackNeverStartsOnArrival:true','autoplay:false','maximumActivePlayers:1',
  'anotherPlayerStopsBeforePlayback:true','canonicalOrbRespondsOnExplicitChoice:true',
  "canonicalOrbResponse:'existing-pulse-only'",'listeningHistoryStored:false',
  'listeningHistoryReads:0','accountDataReads:0','externalUrlReads:0',
  'privateContentReads:0','storageReads:0','storageWrites:0','networkCalls:0',
  'reusesCanonicalOrb:true','newCanvases:0','newPlayers:0','permanentAnimationLoops:0',
  'mutationObservers:0','deferredTimers:0','iphoneFirst:true','work14:false'
]) ok(world.includes(token),`contrato: ${token}`);

ok(!/innerHTML|\.value\b|localStorage|sessionStorage|fetch\(|XMLHttpRequest|MutationObserver|setTimeout|setInterval|requestAnimationFrame/.test(world),'camada não lê nem cria peso');
ok(!/createElement\?\.\('(?:canvas|img)'\)|new Image/.test(world),'sem imagem ou canvas');
ok(sw.includes('const VERSION = 625;')&&sw.includes('divina-bruxa-work13-v625-musica-palco-das-estrelas'),'worker V625');
ok(sw.includes("'./musica-world-v625.js?v=625-palco-das-estrelas'")&&sw.includes("'./musica-world-v625.css?v=625-palco-das-estrelas'"),'dois arquivos no núcleo');
ok((sw.slice(sw.indexOf('const CORE'),sw.indexOf(']);',sw.indexOf('const CORE'))).match(/^  '\.\//gm)||[]).length===78,'78 ativos essenciais');
ok(sw.includes("type:'DIVINA_WORK13_MUSICA_WORLD_ACTIVE'")&&sw.includes('base:624'),'ativação pública correta');
ok(css.includes('.mv559-catalog')&&css.includes('.mv559-release-card')&&css.includes('.mv559-player-slot'),'corpo V559 reutilizado');
ok(css.includes('[data-musica-world-phase="albums"]')&&css.includes('[data-musica-world-phase="tracks"]')&&css.includes('[data-musica-world-phase="playing"]'),'profundidade por estado');
ok(!/@keyframes|animation\s*:|backdrop-filter|filter\s*:|position\s*:\s*fixed|url\(/.test(css),'CSS leve');

console.log(`PASS ${checks}/${checks} — estrutura do Palco das Estrelas V625`);
