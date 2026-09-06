import fs from 'node:fs';
import path from 'node:path';

const root=path.dirname(new URL(import.meta.url).pathname);
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const exists=name=>fs.existsSync(path.join(root,name))&&fs.statSync(path.join(root,name)).size>0;
const index=read('index.html');
const app=read('app.js');
const loader=read('orb-loading-portal-v1.js');
const loaderCSS=read('orb-loading-portal-v1.css');
const pages=read('page-loader-v1.js');
const worker=read('sw.js');
const navigation=read('navigation.js');
const notificationPolicy=read('notification-policy-v150.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const hasConsultationPolicy=exists('consultation-policy.js');
const fullProject=hasConsultationPolicy&&exists('app.css');
const consultation=hasConsultationPolicy?read('consultation-policy.js'):index;

const results=[];
const check=(name,condition)=>results.push({name,ok:Boolean(condition)});

check('App shell is V151',/APLICATIVO V151/.test(app)&&/dataset\.appShell = 'v151'/.test(app));
check('HTML requests the V151 app',/app\.js\?v=151/.test(index));
check('Static boot Orbe exists before the app',/id="orbLoadingPortal"[^>]+data-boot-loader/.test(index)&&/Despertando a Divina Bruxa/.test(index));
check('Static boot rescue works without the module',/is-recovery/.test(index)&&/MOSTRAR A PÁGINA AGORA/.test(index));
check('Boot handoff waits for the initial page task',/queueMicrotask\(\(\) => loadingPortal\.end\(ORB_BOOT_REQUEST_V151\)\)/.test(app));
check('Loader has a bounded recovery action',/RECOVERY_DELAY = 4800/.test(loader)&&/divina:loading-bypass/.test(loader));
check('Loader retains a visual fallback Orbe',/divina-orb-fast-v1\.webp/.test(loaderCSS)&&/radial-gradient/.test(loaderCSS));
check('Essential portals warm only after load',/warmEssentialPortals/.test(app)&&/saveData/.test(app)&&/pageLoader\.warm/.test(app));
check('Page loader exposes warm without rendering',/const warmers/.test(pages)&&/warm,/.test(pages));
check('Service worker is V151',/SERVICE WORKER V46 · BASE IMORTAL V151/.test(worker)&&/base-imortal-v151/.test(worker));
check('Service worker rejects zero-byte responses',/content-length/.test(worker)&&/zeroLength/.test(worker)&&/Empty core asset rejected/.test(worker));
check('Service worker validates the app shell',/validAppShell/.test(worker)&&/id=\["'\]app/.test(worker));
check('Notification deep links are accepted',/skins\|notifications/.test(app)&&/skins\|notifications/.test(worker));
check('V150 notification screen is included',/id="notifications"/.test(index)&&/notification-engine-v150/.test(pages));
check('Notification master switch starts off',/defaultNotificationPreferences[\s\S]*?enabled:\s*false/.test(notificationPolicy));
check('Manifest has a stable app id',manifest.id==='./');
check('Manifest has 192 and 512 any icons',manifest.icons.some(icon=>icon.sizes==='192x192'&&icon.purpose==='any')&&manifest.icons.some(icon=>icon.sizes==='512x512'&&icon.purpose==='any'));
check('Manifest has maskable icons',manifest.icons.some(icon=>icon.purpose==='maskable'&&icon.sizes==='192x192')&&manifest.icons.some(icon=>icon.purpose==='maskable'&&icon.sizes==='512x512'));
check('Manifest preserves the notification shortcut',manifest.shortcuts.some(shortcut=>shortcut.url.includes('#notifications')));
check('Consultation prices remain 250, 150, 100 and 50',hasConsultationPolicy
  ? /price:250/.test(consultation)&&/price:150/.test(consultation)&&/price:100/.test(consultation)&&/price:50/.test(consultation)
  : /R\$ 250/.test(index)&&/R\$ 150/.test(index)&&/R\$ 100/.test(index)&&/R\$ 50/.test(index));
check('Consultations keep the fixed owner email',/orbedasrealidades@hotmail\.com/.test(consultation));
check('No old R$ 500 consultation is present in the HTML',!index.includes('R$ 500'));
check('Tarot Livre remains a direct 78-card experience',/78 cartas sem repetição/i.test(index)&&/DIRETA · SEM SIGNIFICADO/.test(index));

const tarotImages=Array.from({length:78},(_,index)=>`card-${String(index).padStart(2,'0')}.webp`);
check('All 78 Tarot WEBP files exist and are nonempty',!fullProject||tarotImages.every(exists));

const requiredMatch=worker.match(/const REQUIRED=\[([\s\S]*?)\];/);
const requiredAssets=requiredMatch?[...requiredMatch[1].matchAll(/'\.\/(.*?)'/g)].map(match=>match[1]):[];
check('Every required offline asset exists and is nonempty',requiredAssets.length>20&&(!fullProject||requiredAssets.every(exists)));

const releaseFiles=[
  'index.html','app.js','navigation.js','page-loader-v1.js','runtime-v12.js','sw.js','manifest.webmanifest',
  'orb-loading-portal-v1.js','orb-loading-portal-v1.css','auth-client-v6.js','admin-engine.js','admin-staging-api-v145.js',
  'consultation-policy.js',
  'notification-policy-v150.js','notification-engine-v150.js','notification-celestial-v150.css',
  'divina-orb-thumb-v1.webp','divina-orb-fast-v1.webp','icon-192.png','icon-512.png','icon-maskable-192.png','icon-maskable-512.png'
];
check('Every V151 runtime file exists and is nonempty',releaseFiles.every(exists));
check('Navigation exposes Notificações without changing the Orbe geometry',/Notificações/.test(navigation)&&/MENU ORBITAL CONTÍNUO/.test(navigation));

const failed=results.filter(result=>!result.ok).map(result=>result.name);
console.log(JSON.stringify({
  suite:'DIVINA-BRUXA-V151-BASE-IMORTAL',
  status:failed.length?'FAIL':'PASS',
  total:results.length,
  passed:results.length-failed.length,
  failed,
  requiredAssets:requiredAssets.length,
  tarotImages:tarotImages.length,
  mode:fullProject?'full-project':'incremental-package'
},null,2));
if(failed.length)process.exitCode=1;
