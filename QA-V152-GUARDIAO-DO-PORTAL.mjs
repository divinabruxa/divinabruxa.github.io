import fs from 'node:fs';
import path from 'node:path';

const root=path.dirname(new URL(import.meta.url).pathname);
const file=name=>path.join(root,name);
const exists=name=>fs.existsSync(file(name))&&fs.statSync(file(name)).isFile()&&fs.statSync(file(name)).size>0;
const read=name=>fs.readFileSync(file(name),'utf8');
const clean=specifier=>specifier.replace(/^\.\//,'').split(/[?#]/)[0];
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const results=[];
const check=(name,condition,detail='')=>results.push({name,ok:Boolean(condition),detail});

const releaseFiles=[
  'index.html','app.js','runtime-v12.js','page-loader-v1.js','sw.js',
  'orb-loading-portal-v1.js','orb-loading-portal-v1.css','QA-GATE-V10.mjs'
];
releaseFiles.forEach(name=>check(`release:${name}`,exists(name)));

const index=read('index.html');
const app=read('app.js');
const runtime=read('runtime-v12.js');
const pages=read('page-loader-v1.js');
const loader=read('orb-loading-portal-v1.js');
const loaderCSS=read('orb-loading-portal-v1.css');
const worker=read('sw.js');

check('HTML requests app V152',/id="divinaAppModule"[^>]+app\.js\?v=152/.test(index));
check('Guardian registers PWA outside the app',/__divinaSWBootstrap=true/.test(index)&&/serviceWorker\.register\('\.\/sw\.js\?v=152'\)/.test(index));
check('Guardian detects module failure',/is-boot-error/.test(index)&&/divinaAppModule/.test(index)&&/ATUALIZAR O PORTAL/.test(index));
check('Guardian has a cache-busting recovery',/portal-refresh/.test(index)&&/registration\?\.update/.test(index));
check('Guardian reloads once after a new worker takes control',/controllerchange/.test(index)&&/divina\.sw\.reload\.v152/.test(index));
check('App announces a successful boot',/dataset\.appShell = 'v152'/.test(app)&&/divina:boot-ready/.test(app));
check('Runtime and page loader are cache-busted',/runtime-v12\.js\?v=152/.test(app)&&/page-loader-v1\.js\?v=152/.test(app));
check('Skins cannot block the principal boot',!/^import .*SkinsEngine/m.test(app)&&/import\('\.\/skins-v6\.js\?v=142'\)/.test(pages));
check('Premium cannot block the principal boot',!/^import .*premium-entitlements/m.test(runtime));
check('Loader uses the V152 boot request',/boot:v152/.test(loader)&&/ORB_BOOT_REQUEST_V152/.test(loader));
check('Loader has a distinct recovery state',/is-boot-error/.test(loaderCSS)&&/is-refreshing/.test(loaderCSS));
check('Service worker is V48',/SERVICE WORKER V48/.test(worker)&&/divina-bruxa-v48-guardiao-v152/.test(worker));
check('Service worker validates core assets individually',/const CORE=\[/.test(worker)&&/cacheAsset/.test(worker)&&/Core cache incomplete/.test(worker));
check('Optional assets cannot block activation',/Promise\.allSettled\(optional\.map/.test(worker));
check('Brittle cache.addAll is absent',!worker.includes('cache.addAll(REQUIRED)'));
if(exists('skin-catalog-v6.js')){
  const catalog=read('skin-catalog-v6.js');
  check('Canonical skin catalog exports are present',/export const SKINS_V6/.test(catalog)&&/export const skinCatalogById/.test(catalog)&&/export const skinPackById/.test(catalog));
}

const routes=['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','videos','music','notifications','login','skins','admin'];
check('All 17 principal screens remain available',routes.every(route=>new RegExp(`id=["']${escape(route)}["']`).test(index)||new RegExp(`screen\\.id\\s*=\\s*['"]${escape(route)}['"]`).test(runtime)),`${routes.length} routes`);
check('Tarot Livre remains 78-card and direct',/78 cartas sem repetição/i.test(index)&&/DIRETA · SEM SIGNIFICADO/.test(index));
check('Consultation prices remain intact',/R\$ 250/.test(index)&&/R\$ 150/.test(index)&&/R\$ 100/.test(index)&&/R\$ 50/.test(index));
check('Notifications remain reachable',/data-go="notifications"/.test(index)&&/id="notifications"/.test(index));

const fullProject=exists('tarot-data.js')&&exists('page-loader-v1.js');
const graphIssues=[];
const visited=new Set();
const queue=fullProject?['app.js']:[];
const exported=(source,name)=>new RegExp(`export\\s+(?:async\\s+)?(?:const|let|var|function|class)\\s+${escape(name)}\\b`).test(source)
  ||new RegExp(`export\\s*\\{[^}]*\\b${escape(name)}\\b[^}]*\\}`).test(source);

while(queue.length){
  const current=queue.shift();
  if(visited.has(current))continue;
  visited.add(current);
  if(!exists(current)){graphIssues.push(`${current}: missing`);continue;}
  const source=read(current);
  const imports=[...source.matchAll(/^import\s+(.+?)\s+from\s+['"](\.\/[^'"]+)['"];?/gm)];
  for(const match of imports){
    const dependency=clean(match[2]);
    if(!exists(dependency)){graphIssues.push(`${current} -> ${dependency}: missing`);continue;}
    const named=match[1].match(/\{([^}]+)\}/)?.[1].split(',').map(value=>value.trim().split(/\s+as\s+/)[0]).filter(Boolean)||[];
    const dependencySource=read(dependency);
    named.forEach(name=>{if(!exported(dependencySource,name))graphIssues.push(`${current} -> ${dependency}: missing export ${name}`);});
    queue.push(dependency);
  }
  for(const match of source.matchAll(/import\(['"](\.\/[^'"]+)['"]\)/g)){
    const dependency=clean(match[1]);
    if(!exists(dependency))graphIssues.push(`${current} -> ${dependency}: missing dynamic module`);
    else queue.push(dependency);
  }
}
check('Complete application import graph is internally compatible',!fullProject||graphIssues.length===0,graphIssues.slice(0,8).join('; '));

const cards=Array.from({length:78},(_,index)=>`card-${String(index).padStart(2,'0')}.webp`);
const validWebP=name=>exists(name)&&fs.readFileSync(file(name)).subarray(0,12).toString('ascii',0,4)==='RIFF'&&fs.readFileSync(file(name)).subarray(0,12).toString('ascii',8,12)==='WEBP';
check('All 78 Tarot cards remain valid WEBP files',!fullProject||cards.every(validWebP),`${cards.length} cards`);

const coreMatch=worker.match(/const CORE=\[([\s\S]*?)\];/);
const coreAssets=coreMatch?[...coreMatch[1].matchAll(/'\.\/(.*?)'/g)].map(match=>match[1]):[];
check('Every core offline asset exists and is nonempty',coreAssets.length>=20&&(!fullProject||coreAssets.every(asset=>asset===''?exists('index.html'):exists(asset))),`${coreAssets.length} assets`);

const failed=results.filter(result=>!result.ok);
console.log(JSON.stringify({
  suite:'DIVINA-BRUXA-V152-GUARDIAO-DO-PORTAL',
  status:failed.length?'FAIL':'PASS',
  total:results.length,
  passed:results.length-failed.length,
  failed:failed.map(result=>({name:result.name,detail:result.detail})),
  importGraphFiles:visited.size,
  coreAssets:coreAssets.length,
  principalScreens:routes.length,
  tarotCards:cards.length,
  mode:fullProject?'full-project':'incremental-package'
},null,2));
if(failed.length)process.exitCode=1;
