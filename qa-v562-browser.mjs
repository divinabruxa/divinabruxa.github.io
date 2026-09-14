/* DIVINA BRUXA 4.0 — QA VISUAL V562
   Uso local: node qa-v562-browser.mjs /caminho/da/base-mesclada
   Uso STAGING: DIVINA_QA_BASE_URL=https://staging.exemplo node qa-v562-browser.mjs */

import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {dirname,extname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const packagedRoot=dirname(fileURLToPath(import.meta.url));
const root=resolve(process.argv[2]||packagedRoot);
const externalBase=String(process.env.DIVINA_QA_BASE_URL||'').replace(/\/$/,'');
const routes=['home','tarot','daily','library','school','spreads','ai','journal','store','consultations','subscriptions','skins','videos','music','notifications','login','admin'];
const moduleRoutes=new Set(routes.filter(route=>!['home','login'].includes(route)));
const mime={
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json',
  '.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.svg':'image/svg+xml','.woff2':'font/woff2'
};

let chromium;
try{({chromium}=require('playwright'));}
catch(error){
  console.log(JSON.stringify({state:'BLOCKED',release:'V562',reason:'playwright-package-unavailable',detail:error.code||error.name},null,2));
  process.exit(2);
}

let server=null;
let base=externalBase;
if(!base){
  server=createServer(async(request,response)=>{
    try{
      const url=new URL(request.url,'http://local.test');
      let relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
      if(relative.includes('..'))throw new Error('invalid-path');
      const file=resolve(root,relative);
      if(!file.startsWith(`${root}/`))throw new Error('invalid-path');
      const bytes=await readFile(file);
      response.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});
      response.end(bytes);
    }catch{
      try{
        const bytes=await readFile(resolve(root,'404.html'));
        response.writeHead(404,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
        response.end(bytes);
      }catch{
        response.writeHead(404,{'content-type':'text/plain; charset=utf-8'});
        response.end('not found');
      }
    }
  });
  await new Promise(resolveReady=>server.listen(0,'127.0.0.1',resolveReady));
  base=`http://127.0.0.1:${server.address().port}`;
}

let browser;
try{browser=await chromium.launch({headless:true});}
catch(error){
  await new Promise(resolveDone=>server?.close(resolveDone)||resolveDone());
  console.log(JSON.stringify({state:'BLOCKED',release:'V562',reason:'chromium-binary-unavailable',detail:String(error.message||error).split('\n')[0]},null,2));
  process.exit(2);
}

const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
const page=await context.newPage();
const consoleErrors=[];
const pageErrors=[];
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text().slice(0,240));});
page.on('pageerror',error=>pageErrors.push(String(error.message||error).slice(0,240)));

try{
  const response=await page.goto(`${base}/index.html?qa-v562=1`,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response?.ok(),true,'index deve responder 2xx');
  await page.waitForFunction(()=>document.documentElement.dataset.appShell&&window.orbe?.go,{timeout:30000});
  await page.waitForFunction(()=>document.querySelector('[data-boot-loader]')?.getAttribute('aria-hidden')==='true'||!document.querySelector('[data-boot-loader]')?.classList.contains('is-visible'),{timeout:20000});
  assert.equal(await page.locator('#app > .screen').count(),17,'shell deve conter 17 mundos');
  assert.equal(await page.locator('#orb').count(),1,'deve existir uma única Orbe canônica');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,'Home não pode ter overflow horizontal');

  const routeEvidence=[];
  for(const route of routes){
    await page.evaluate(id=>window.orbe.go(id,{source:'qa-v562-browser'}),route);
    await page.waitForFunction(id=>document.body.dataset.screen===id||document.querySelector(`#${id}.active`),route,{timeout:15000});
    if(moduleRoutes.has(route)){
      await page.waitForFunction(id=>{
        const screen=document.getElementById(id);
        return screen?.dataset.moduleState==='ready'||screen?.dataset.moduleState==='error';
      },route,{timeout:20000});
    }
    const state=await page.locator(`#${route}`).getAttribute('data-module-state');
    const recovery=await page.locator(`#${route} [data-route-recovery]`).count();
    assert.equal(recovery,0,`${route} não pode cair na recuperação`);
    assert.notEqual(state,'error',`${route} não pode terminar em erro`);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,`${route} não pode ter overflow horizontal`);
    routeEvidence.push({route,state:state||'static'});
  }

  for(const viewport of [{width:320,height:568},{width:430,height:932},{width:768,height:1024},{width:1440,height:900}]){
    await page.setViewportSize(viewport);
    await page.waitForTimeout(80);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,`${viewport.width}px não pode gerar overflow horizontal`);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true,'preferência de movimento reduzido deve chegar ao runtime');

  const missing=await page.goto(`${base}/qa-v562-missing-route`,{waitUntil:'domcontentloaded',timeout:15000});
  if(!externalBase)assert.equal(missing?.status(),404,'servidor local deve preservar status 404');
  assert.equal(await page.locator('[data-view="404"]').count(),1,'404 deve renderizar recuperação');

  assert.deepEqual(pageErrors,[],'não pode haver pageerror');
  assert.deepEqual(consoleErrors,[],'não pode haver console.error');
  console.log(JSON.stringify({
    state:'PASS',release:'V562',base,routeCount:routes.length,routes:routeEvidence,
    viewports:['320x568','390x844@3','430x932','768x1024','1440x900'],
    reducedMotion:true,notFound:true,pageErrors:0,consoleErrors:0
  },null,2));
}finally{
  await context.close();
  await browser.close();
  if(server)await new Promise(resolveDone=>server.close(resolveDone));
}
