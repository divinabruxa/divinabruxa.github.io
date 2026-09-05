import { existsSync, readFileSync, statSync } from 'node:fs';
import { CONFIG } from './config.js';
import { CARDS } from './tarot-data.js';
import { CONSULTATION_POLICY } from './consultation-policy.js';
import { MEDIA_POLICY_V149, publishedMediaItems, safeMediaURL, safeSpotifyAlbumId } from './media-policy-v149.js';

const text=file=>readFileSync(new URL(`./${file}`,import.meta.url),'utf8');
const mediaEngine=text('media-engine-v149.js');
const ecosystem=text('media-ecosystem-v149.js');
const css=text('media-celestial-v149.css');
const index=text('index.html');
const app=text('app.js');
const loader=text('page-loader-v1.js');
const worker=text('sw.js');
const tarotRuntime=text('tarot-image-runtime.js');
const consultationEngine=text('consultation-engine.js');
const storeEngine=text('store-engine.js');
const contract=JSON.parse(text('MEDIA-CONTENT-CONTRACT-V149.json'));

const cssBracesBalanced=source=>{
  const clean=source.replace(/\/\*[\s\S]*?\*\//g,'');
  let balance=0;
  for(const character of clean){
    if(character==='{')balance+=1;
    if(character==='}')balance-=1;
    if(balance<0)return false;
  }
  return balance===0;
};

const expectedAlbums=new Map([
  ['Sobre as Estrelas','0GwJtJujeS9iwSZFADcL1k'],
  ['Z','4mq0UaLMXK21JbrKMFdhdO']
]);
const expectedPrices=new Map([
  ['mesa-real-profissional',25000],
  ['leitura-mentes',15000],
  ['carta-conselho',10000],
  ['pergunta-direta',5000]
]);
const now=new Date('2026-09-05T12:00:00Z');
const publicationFixture=[
  {title:'Rascunho',status:'rascunho',url:'https://youtu.be/draft'},
  {title:'Host inválido',status:'publicado',url:'https://evil.example/video'},
  {title:'Futuro',status:'publicado',url:'https://www.youtube.com/watch?v=future',publishAt:'2027-01-01T00:00:00Z'},
  {title:'Publicado',status:'publicado',url:'https://www.youtube.com/watch?v=published',publishAt:'2026-09-01T00:00:00Z'}
];

const checks=[
  ['Media policy is V149 staging',MEDIA_POLICY_V149.version==='v149'&&MEDIA_POLICY_V149.environment==='editorial-staging'],
  ['Artist identity is Hércules DX',MEDIA_POLICY_V149.artist==='Hércules DX'],
  ['Exactly the two configured albums remain valid',CONFIG.spotifyAlbums.length===2&&CONFIG.spotifyAlbums.every(album=>expectedAlbums.get(album.name)===album.id&&Boolean(safeSpotifyAlbumId(album.id)))],
  ['Spotify rejects malformed album IDs',safeSpotifyAlbumId('../script')===''],
  ['Official YouTube channel is preserved',MEDIA_POLICY_V149.youtubeChannel==='https://www.youtube.com/@divinabruxa33'],
  ['Media URLs require HTTPS and approved hosts',safeMediaURL('https://www.youtube.com/watch?v=ok').startsWith('https://www.youtube.com/')&&safeMediaURL('http://youtube.com/watch?v=no')===''&&safeMediaURL('javascript:alert(1)')===''&&safeMediaURL('https://evil.example/watch')===''],
  ['Only explicit, valid and current publications appear',publishedMediaItems(publicationFixture,now).length===1&&publishedMediaItems(publicationFixture,now)[0].title==='Publicado'],
  ['Empty video state does not expose technical instructions',mediaEngine.includes('O primeiro capítulo está sendo preparado.')&&!mediaEngine.includes('adicione título')&&!mediaEngine.includes('<b>config.js</b>')],
  ['Music loads one active Spotify player',mediaEngine.match(/<iframe/g)?.length===1&&mediaEngine.includes('data-album-player')],
  ['Album selector follows tab semantics',mediaEngine.includes('role="tablist"')&&mediaEngine.includes('role="tab"')&&mediaEngine.includes('aria-selected')],
  ['Album selector supports arrow keys',mediaEngine.includes("'ArrowLeft'")&&mediaEngine.includes("'ArrowRight'")],
  ['External links use opener isolation',mediaEngine.includes('rel="noopener noreferrer"')],
  ['Spotify embed has a privacy-conscious referrer policy',mediaEngine.includes('referrerpolicy="strict-origin-when-cross-origin"')],
  ['Editorial image exists and is optimized',existsSync(new URL('./midia-celestial-estudio-v1.webp',import.meta.url))&&statSync(new URL('./midia-celestial-estudio-v1.webp',import.meta.url)).size>70000&&statSync(new URL('./midia-celestial-estudio-v1.webp',import.meta.url)).size<300000],
  ['Both pages use the editorial image',mediaEngine.match(/MEDIA_POLICY_V149.heroImage/g)?.length>=2],
  ['Cross-universe portals cover both media pages',ecosystem.includes('music:Object.freeze')&&ecosystem.includes('videos:Object.freeze')&&ecosystem.includes('data-go=')],
  ['Media CSS is structurally valid',cssBracesBalanced(css)],
  ['Media CSS supports mobile safe areas',css.includes('@media (max-width: 680px)')&&css.includes('env(safe-area-inset-bottom)')],
  ['Media CSS respects reduced motion',css.includes('prefers-reduced-motion: reduce')&&css.includes('animation: none')],
  ['Media CSS supports forced colors',css.includes('forced-colors: active')],
  ['Media stylesheet and sections are V149',index.includes('media-celestial-v149.css?v=149')&&index.includes('data-media-engine="v149"')],
  ['Media loader imports only V149 engines',loader.includes("media-engine-v149.js?v=149")&&loader.includes("media-ecosystem-v149.js?v=149")&&!loader.includes("import('./media-engine-v5.js')")],
  ['Application and service worker are V149',index.includes('app.js?v=149')&&app.includes("page-loader-v1.js?v=149")&&app.includes("sw.js?v=149")&&worker.includes('divina-bruxa-v44-midia-celestial-v149')],
  ['Service worker warms every V149 media asset',['media-celestial-v149.css','midia-celestial-estudio-v1.webp','media-engine-v149.js','media-policy-v149.js','media-ecosystem-v149.js'].every(asset=>worker.includes(`'./${asset}'`))],
  ['Media contract matches implementation',contract.version==='V149'&&contract.music.playerMode==='one-active-embed'&&contract.video.publicStatus==='publicado'&&contract.video.inventedEpisodes===false],

  ['Tarot still has exactly 78 direct cards',CARDS.length===78&&new Set(CARDS.map(card=>card.canonicalId)).size===78&&CARDS.every(card=>card.orientation==='normal')],
  ['Tarot progressive V148 remains active',tarotRuntime.includes("CARD_ASSET_VERSION = '148'")&&loader.includes("tarot-engine.js?v=148")],
  ['Consultations keep exact owner email',CONSULTATION_POLICY.contactEmail==='orbedasrealidades@hotmail.com'],
  ['Consultations keep all four protected prices',CONSULTATION_POLICY.services.length===4&&CONSULTATION_POLICY.services.every(service=>expectedPrices.get(service.id)===service.priceCents)],
  ['Consultation notification fallback remains present',consultationEngine.includes('data-send-owner-copy')],
  ['Store V148 remains active',index.includes('store-celestial-v1.css?v=148')&&loader.includes("store-engine.js?v=148")&&!storeEngine.includes('affiliateClicks')],
  ['Home Orbe and approved menu remain present',index.includes('id="orbCanvas"')&&index.includes('Orbe das<br>Realidades')&&index.includes('<b>Tarot Livre</b>')&&index.includes('<strong>LOJA MÍSTICA</strong>')],
  ['No production or billing integration was added',!mediaEngine.includes('STRIPE_SECRET_KEY')&&!mediaEngine.includes('checkout')&&contract.productionChanged===false],
  ['V149 instructions are present',existsSync(new URL('./LEIA-PRIMEIRO-V149-MUSICA-DE-FRENTE.txt',import.meta.url))]
];

const failed=checks.filter(([,ok])=>!ok).map(([name])=>name);
console.log(JSON.stringify({suite:'DIVINA-BRUXA-V149-MUSICA-DE-FRENTE',status:failed.length?'FAIL':'PASS',total:checks.length,passed:checks.length-failed.length,failed},null,2));
process.exitCode=failed.length?1:0;
