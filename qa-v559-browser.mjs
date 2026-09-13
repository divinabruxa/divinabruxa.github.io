import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const root=resolve(process.argv[2]||'.');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp'};
const server=createServer(async(request,response)=>{try{const url=new URL(request.url,'http://local.test');const relative=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname).replace(/^\/+/, '');if(relative.includes('..'))throw new Error('invalid path');const file=resolve(root,relative);if(!file.startsWith(root))throw new Error('invalid path');const bytes=await readFile(file);response.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store'});response.end(bytes);}catch{response.writeHead(404);response.end('not found');}});
await new Promise(resolveReady=>server.listen(0,'127.0.0.1',resolveReady));
const address=server.address(),base=`http://127.0.0.1:${address.port}`;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
await page.route('https://kyphdsamyygavmkzyezr.supabase.co/rest/v1/**',route=>route.fulfill({status:200,contentType:'application/json',body:'[]'}));
try{
  await page.goto(`${base}/musica.html`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.mv559-world');
  assert.equal(await page.locator('.mv559-release-card').count(),2,'devem existir dois álbuns reais');
  assert.equal(await page.locator('iframe').count(),0,'nenhum iframe antes do toque');
  await page.locator('[data-play-release]').first().click();
  await page.waitForSelector('.mv559-player-slot iframe');
  assert.equal(await page.locator('.mv559-player-slot iframe').count(),1,'apenas um player musical');
  assert.doesNotMatch(await page.locator('.mv559-player-slot iframe').getAttribute('src'),/autoplay/i,'Spotify não pode ter autoplay');
  await page.locator('.mv559-release-card').nth(1).click();
  assert.equal(await page.locator('iframe').count(),0,'trocar álbum desmonta player');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,'música não pode gerar overflow no iPhone');

  await page.goto(`${base}/de-frente-com-o-tarot.html`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.mv559-empty');
  assert.equal(await page.locator('.mv559-empty strong').textContent(),'0','estado vazio real deve mostrar zero');
  assert.equal(await page.locator('iframe').count(),0,'vídeo vazio não cria player');
  assert.match(await page.locator('.mv559-empty').innerText(),/nenhum título|zero episódios/i,'estado vazio deve ser explícito');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,'vídeo não pode gerar overflow no iPhone');

  await page.setViewportSize({width:1440,height:900});
  await page.goto(`${base}/music.html`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.mv559-world');
  assert.equal(await page.locator('.mv559-release-card').count(),2,'paridade inglesa deve manter os dois álbuns');
  assert.match(await page.locator('.mv559-hero h3').textContent(),/Two real albums/i,'copy inglesa não foi aplicada');
  assert.deepEqual(pageErrors,[],'não pode haver erro JavaScript na navegação editorial');
  console.log(JSON.stringify({ok:true,release:'V559',viewports:['390x844@3','1440x900'],albums:2,videoEmpty:true,autoplay:false,iframesBeforeTap:0,pageErrors:0},null,2));
}finally{await browser.close();await new Promise(resolveDone=>server.close(resolveDone));}
