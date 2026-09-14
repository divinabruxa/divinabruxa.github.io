import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const packagedRoot=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(process.argv[2]||packagedRoot);
const failures=[];
let passed=0;
const check=(condition,id,detail='')=>condition?passed++:failures.push({id,detail});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

for(const file of ['app-v208.js','index.html','manifest.webmanifest','sw.js','404.html']){
  check(fs.existsSync(path.join(root,file)),'required:'+file);
}

for(const file of ['app-v208.js','sw.js','qa-v563-service-worker-runtime.mjs']){
  const result=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});
  check(result.status===0,'syntax:'+file,String(result.stderr||''));
}

const app=read('app-v208.js');
const index=read('index.html');
const sw=read('sw.js');
const notFound=read('404.html');

check(/app-v208\.js\?v=563/.test(index),'index:app-epoch');
check(/register\('\.\/sw\.js\?v=563'/.test(index),'index:sw-epoch');
check(/divina\.sw\.reload\.v563/.test(index),'index:reload-key');
check(/version:563/.test(index),'index:pwa-event');
check(/register\('\.\/sw\.js\?v=563'/.test(app),'app:sw-epoch');
check(/releaseEpoch = 'v563'/.test(app),'app:release-epoch');
check(!/register\('\.\/sw\.js\?v=562'/.test(index+app),'registration:no-v562');
check(/const VERSION=563;/.test(sw),'sw:version');
check((sw.match(/divina-bruxa-v563-/g)||[]).length>=5,'sw:cache-epoch');
check(/app-v208\\\.js\\\?v=563/.test(sw),'sw:shell-contract');

const preserve=sw.indexOf('if(response&&!response.ok)return response;');
const fallback=sw.indexOf('const cached=await matchAny(request);if(cached)return cached;',preserve);
check(preserve>0&&fallback>preserve,'sw:preserve-http-before-offline');
check(/Voltar para a Orbe/i.test(notFound)&&/Buscar no portal/i.test(notFound)&&/Abrir Tarot Livre/i.test(notFound),'404:recovery-links');

const loader=spawnSync(process.execPath,[path.join(root,'qa-v562-loader-runtime.mjs'),root],{encoding:'utf8'});
check(loader.status===0,'regression:loader-v562',String(loader.stderr||loader.stdout||''));

const total=passed+failures.length;
console.log(JSON.stringify({
  release:'V563',
  state:failures.length?'FAIL':'PASS',
  scope:'post-install-404-pwa-hotfix',
  passed,
  failed:failures.length,
  total,
  openP0:failures.length?1:0,
  openP1:0,
  failures
},null,2));
process.exitCode=failures.length?1:0;
