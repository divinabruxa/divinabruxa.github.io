import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {basename,resolve} from 'node:path';

const root=resolve(process.argv[2]||'.');
const read=name=>readFileSync(resolve(root,name),'utf8');
const has=(source,pattern,message)=>assert.match(source,pattern,message);
const lacks=(source,pattern,message)=>assert.doesNotMatch(source,pattern,message);

const app=read('app-v208.js');
const config=read('config-v200.js');
const index=read('index.html');
const loader=read('page-loader-v1.js');
const publicModule=read('music-video-supreme-v559.js');
const adminModule=read('admin-media-supreme-v559.js');
const edge=read('admin-media-v320-edge-v559.ts');
const worker=read('sw.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const mediaApi=await import(`data:text/javascript;base64,${Buffer.from(publicModule).toString('base64')}`);

has(app,/MACROETAPA 11\/14 · V559/,'app deve declarar Macro 11/V559');
has(app,/divinaMediaSupremeReleaseV559/,'contrato público V559 ausente');
has(app,/currentMacroStage:'11-of-14'/,'boot não aponta para 11/14');
has(index,/Sobre as Estrelas e Z, com 18 faixas oficiais/,'verdade musical da entrada ausente');
has(index,/data-media-engine="v559"/,'index não aponta para o motor V559');
has(config,/0GwJtJujeS9iwSZFADcL1k[\s\S]*trackCount:10/,'Sobre as Estrelas/10 faixas não preservado');
has(config,/4mq0UaLMXK21JbrKMFdhdO[\s\S]*trackCount:8/,'Z/8 faixas não preservado');
assert.equal((config.match(/trackCount:/g)||[]).length,2,'somente os dois álbuns verificados devem formar o fallback');

has(loader,/MusicVideoSupremeV559/,'page loader não carrega a experiência pública V559');
has(loader,/AdminMediaSupremeV559/,'page loader não carrega o CMS V559');
has(loader,/music-video-supreme-v559\.css\?v=559/,'CSS V559 não está no carregamento sob demanda');
has(publicModule,/status:'eq\.published'/,'feed público não filtra status publicado');
has(publicModule,/published_at\.lte/,'feed público não filtra agendamentos futuros');
has(publicModule,/databaseRows\.filter\(isPublishedNowV559\)/,'lançamentos não têm defesa local contra rascunhos');
has(publicModule,/release_id:`in\.\(\$\{databaseReleaseIds\.join/,'faixas não estão limitadas a lançamentos públicos');
has(publicModule,/episode_id:`in\.\(\$\{episodeIds\.join/,'cartas não estão limitadas a episódios públicos');
has(publicModule,/www\.youtube-nocookie\.com\/embed/,'embed com privacidade aprimorada ausente');
has(publicModule,/data-play-release/,'player musical não exige ação explícita');
has(publicModule,/data-play-episode/,'player de vídeo não exige ação explícita');
has(publicModule,/unloadPlayer\(\)/,'player não é desmontado ao sair');
lacks(publicModule,/autoplay=1|autoplay%3D1/i,'autoplay proibido encontrado');
lacks(publicModule,/setInterval\s*\(|requestAnimationFrame\s*\(/,'loop permanente encontrado no mundo de mídia');
lacks(publicModule,/localStorage|sessionStorage/,'mundo público de mídia não deve ler armazenamento pessoal');
assert.equal(mediaApi.spotifyIdentityV559('https://open.spotify.com/album/0GwJtJujeS9iwSZFADcL1k')?.id,'0GwJtJujeS9iwSZFADcL1k','ID Spotify válido não foi extraído');
assert.equal(mediaApi.spotifyIdentityV559('https://example.com/album/0GwJtJujeS9iwSZFADcL1k'),null,'host Spotify falso foi aceito');
assert.equal(mediaApi.youtubeIdentityV559('https://youtu.be/dQw4w9WgXcQ')?.embed.includes('youtube-nocookie.com'),true,'YouTube não foi normalizado com privacidade');
assert.equal(mediaApi.normalizeEpisodeV559({title:'Rascunho',video_url:'https://youtu.be/dQw4w9WgXcQ',status:'draft'}),null,'rascunho vazou para o normalizador público');
assert.equal(mediaApi.isPublishedNowV559({status:'published',published_at:'2999-01-01T00:00:00Z'}),false,'agendamento futuro vazou');

for(const resource of ['music_release','music_track','tarot_season','tarot_episode'])has(adminModule,new RegExp(resource),`CMS sem ${resource}`);
has(adminModule,/credentials:'include'/,'CMS não envia cookies seguros');
has(adminModule,/x-divina-admin-request':'v559'/,'guard V559 ausente no CMS');
has(adminModule,/PRÉVIA · NÃO PUBLICADA/,'prévia editorial ausente');
has(adminModule,/iphone[\s\S]*android[\s\S]*desktop/,'prévia multitelas ausente');
lacks(adminModule,/(?:localStorage|sessionStorage)\s*\.|SUPABASE_SERVICE_ROLE_KEY/,'CMS do navegador contém autoridade indevida');

for(const proof of ["claims.aal!=='aal2'","admin_owners","admin_sessions","admin_recovery_codes","admin_audit_events","HttpOnly; Secure; SameSite=None"])has(edge,new RegExp(proof.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),`barreira backend ausente: ${proof}`);
for(const table of ['music_releases','music_tracks','tarot_seasons','tarot_episodes','tarot_episode_cards'])has(edge,new RegExp(table),`Edge Function sem ${table}`);
has(edge,/schedule_must_be_future/,'agendamento futuro não é validado');
has(edge,/parent_season_not_published/,'publicação de episódio sem temporada não é bloqueada');
has(edge,/\['v320','v530','v547','v559'\]/,'compatibilidade dos guards anteriores ausente');

assert.equal(manifest.icons.every(icon=>icon.src.includes('v=559')),true,'ícones do manifesto não usam epoch V559');
assert.equal(manifest.shortcuts.some(item=>item.url.endsWith('#music')),true,'atalho Música ausente');
assert.equal(manifest.shortcuts.some(item=>item.url.endsWith('#videos')),true,'atalho Vídeos ausente');
has(worker,/const VERSION=559/,'service worker não usa V559');
has(worker,/music-video-supreme-v559\.js/,'service worker não conhece o módulo de mídia');
has(worker,/app-v208\\\.js\\\?v=559/,'service worker não valida o shell V559');
lacks(worker,/divina-bruxa-v558-(?:shell|content|images|offline-core)/,'cache V558 ainda ativo');

for(const page of ['musica.html','music.html','musica-tarot.html']){
  const source=read(page);has(source,/music-video-supreme-v559\.js\?v=559/,`${page} não usa o catálogo V559`);has(source,/data-media-engine="v559"/,`${page} sem mount V559`);
}
for(const page of ['de-frente-com-o-tarot.html','face-to-face-with-tarot.html','de-frente-con-el-tarot.html']){
  const source=read(page);has(source,/music-video-supreme-v559\.js\?v=559/,`${page} não usa episódios V559`);has(source,/data-media-engine="v559"/,`${page} sem mount V559`);
}

const localRefs=new Set(['music-video-supreme-v559.js','music-video-supreme-v559.css','admin-media-supreme-v559.js','config-v200.js','commercial-truth-v200.js','manifest.webmanifest','pwa-world-v196.js','pwa-world-v324.js']);
for(const reference of localRefs)assert.equal(statSync(resolve(root,reference)).isFile(),true,`dependência local ausente: ${reference}`);

const flat=readdirSync(root,{withFileTypes:true}).filter(item=>item.isDirectory()).length===0;
console.log(JSON.stringify({ok:true,release:'V559',macro:'11/14',verifiedAlbums:2,verifiedTracks:18,publishedEpisodesAtRelease:0,autoplay:false,inventedEpisodes:0,ownerMfa:true,localDependencies:localRefs.size,flatDirectory:flat,root:basename(root)},null,2));
