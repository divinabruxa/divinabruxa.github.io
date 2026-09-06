import fs from 'node:fs';
import path from 'node:path';

const root=path.dirname(new URL(import.meta.url).pathname);
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const exists=name=>fs.existsSync(path.join(root,name))&&fs.statSync(path.join(root,name)).size>0;
const index=read('index.html');
const app=read('app.js');
const runtime=read('runtime-v12.js');
const premium=read('premium-entitlements-v142.js');
const catalog=read('skin-catalog-v6.js');
const worker=read('sw.js');
const results=[];
const check=(name,condition)=>results.push({name,ok:Boolean(condition)});

check('HTML bypasses the cached V151 app',/app\.js\?v=1512/.test(index));
check('App shell identifies V151.2',/APLICATIVO V151\.2/.test(app)&&/dataset\.appShell = 'v1512'/.test(app));
check('App requests the corrected runtime',/runtime-v12\.js\?v=1512/.test(app));
check('Runtime requests the corrected entitlements module',/premium-entitlements-v142\.js\?v=1512/.test(runtime));
check('Entitlements requests the corrected catalog',/skin-catalog-v6\.js\?v=1512/.test(premium));
check('Catalog exports SKINS_V6',/export const SKINS_V6/.test(catalog));
check('Catalog exports skinCatalogById',/export const skinCatalogById/.test(catalog));
check('Catalog exports skinPackById',/export const skinPackById/.test(catalog));
check('Catalog contains exactly 30 definitions',(catalog.match(/^\s*\['/gm)||[]).length===30);
check('Service worker cache advances to V47',/SERVICE WORKER V47/.test(worker)&&/base-imortal-v1512/.test(worker));
check('App registers the corrected service worker',/sw\.js\?v=1512/.test(app));
check('Boot Orbe and rescue remain present',/id="orbLoadingPortal"/.test(index)&&/MOSTRAR A PÁGINA AGORA/.test(index));
check('Tarot Livre remains present',/id="tarot"/.test(index)&&/78 cartas sem repetição/i.test(index));
check('Consultations remain present',/id="consultations"/.test(index)&&/R\$ 250/.test(index)&&/R\$ 150/.test(index)&&/R\$ 100/.test(index)&&/R\$ 50/.test(index));
check('Notifications remain present',/id="notifications"/.test(index));

const releaseFiles=['index.html','app.js','runtime-v12.js','premium-entitlements-v142.js','skin-catalog-v6.js','sw.js'];
check('Every corrected runtime file exists and is nonempty',releaseFiles.every(exists));

const failed=results.filter(result=>!result.ok).map(result=>result.name);
console.log(JSON.stringify({
  suite:'DIVINA-BRUXA-V151.2-CORRECAO-MODULOS',
  status:failed.length?'FAIL':'PASS',
  total:results.length,
  passed:results.length-failed.length,
  failed
},null,2));
if(failed.length)process.exitCode=1;
