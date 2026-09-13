import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname,resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(process.argv[2] || '.');
const types = {'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const fixture = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><link rel="stylesheet" href="/ethical-return-core-v561.css?v=561"><style>body{margin:0;background:#05020a;color:#fff;font-family:system-ui;padding:1rem}.screen{display:none}.screen.active{display:block}button{font:inherit}</style></head><body data-screen="home"><main>
  <section id="home" class="screen active"><h2>Início</h2></section>
  <section id="daily" class="screen"><h2>Carta do Dia</h2><div id="dailyCard"></div></section>
  <section id="school" class="screen"><h2>Escola</h2><div id="schoolApp"></div></section>
  <section id="journal" class="screen"><h2>Diário</h2><div id="journalApp"><button data-journal-view="timeline">Linha</button><button data-journal-view="calendar">Calendário</button><label><input id="journalFavoriteFilter" type="checkbox">Favoritas</label><div class="journal-explorer"></div></div></section>
  <section id="videos" class="screen"><h2>Vídeos</h2><div id="videoApp"></div></section>
  <section id="skins" class="screen"><h2>Skins</h2><div id="skinsApp"></div></section>
  <section id="notifications" class="screen"><h2>Retorno</h2><div id="notificationApp"></div></section>
</main><script type="module">
  import {createEthicalReturnCoreV561} from '/ethical-return-core-v561.js?v=561';
  window.analyticsConsent=false;window.permissionPrompts=0;window.requests=[];window.challengeContinued=false;window.calendarClicks=0;
  window.Notification={permission:'default',requestPermission:()=>{window.permissionPrompts+=1;return Promise.resolve('denied');}};
  window.fetch=async(url,options={})=>{window.requests.push({url:String(url),method:options.method||'GET',body:options.body||''});return new Response('{}',{status:202,headers:{'content-type':'application/json'}});};
  document.querySelector('[data-journal-view="calendar"]').addEventListener('click',()=>window.calendarClicks+=1);
  window.divinaSchoolWorldV306={engine:{continuePath:()=>window.challengeContinued=true}};
  window.goRoute=id=>{document.querySelectorAll('.screen').forEach(screen=>screen.classList.toggle('active',screen.id===id));document.body.dataset.screen=id;location.hash=id;document.dispatchEvent(new CustomEvent('divina:route-ready',{detail:{id}}));document.dispatchEvent(new CustomEvent('divina:page-ready',{detail:{id}}));};
  window.returnCore=createEthicalReturnCoreV561({go:window.goRoute,config:{accountFunctionsBase:'https://staging.example/functions/v1',supabasePublishableKey:'sb_publishable_test'},getPrivacyPreferences:()=>({analytics:window.analyticsConsent})});
</script></body></html>`;

const server = createServer(async(request,response)=>{
  try{
    const url=new URL(request.url,'http://local.test');
    if(url.pathname==='/'||url.pathname==='/fixture.html'){
      response.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});response.end(fixture);return;
    }
    const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if(relative.includes('..'))throw new Error('invalid path');
    const file=resolve(root,relative);
    if(!file.startsWith(root))throw new Error('invalid path');
    const bytes=await readFile(file);
    response.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','cache-control':'no-store'});response.end(bytes);
  }catch{response.writeHead(404);response.end('not found');}
});

await new Promise(done=>server.listen(0,'127.0.0.1',done));
const address=server.address();
const base=`http://127.0.0.1:${address.port}`;
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
const page=await context.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));

try{
  await page.goto(`${base}/fixture.html`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>Boolean(window.returnCore?.audit));
  assert.equal(await page.evaluate(()=>window.permissionPrompts),0,'não pode pedir permissão automaticamente');

  await page.evaluate(()=>window.goRoute('notifications'));
  await page.locator('#ethicalReturnHubV561').waitFor();
  assert.equal(await page.locator('#ethicalReturnHubV561').getByText('Voltar porque existe algo vivo — nunca por culpa.').isVisible(),true,'hub ético ausente');
  assert.match(await page.locator('#ethicalReturnHubV561').innerText(),/não existe sequência para quebrar/i,'garantia sem streak ausente');
  assert.match(await page.locator('#ethicalReturnHubV561').innerText(),/provedor de envio externo permanece desligado/i,'limite do STAGING ausente');

  await page.evaluate(()=>window.goRoute('daily'));
  await page.locator('#ethicalReturnDailyV561 [data-erv561-favorite="daily"]').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('divina-ethical-return-v561')).favorites.includes('daily')),true,'favorito local não foi salvo');

  await page.evaluate(()=>window.goRoute('school'));
  await page.locator('#ethicalReturnSchoolV561 [data-erv561-challenge-start]').click();
  assert.equal(await page.evaluate(()=>window.challengeContinued),true,'desafio não abriu próxima aula');
  await page.locator('#ethicalReturnSchoolV561 [data-erv561-challenge-complete]').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('divina-ethical-return-v561')).challengeHistory[0].completed),true,'desafio não foi concluído');

  await page.evaluate(()=>window.goRoute('notifications'));
  await page.locator('#ethicalReturnHubV561 [data-erv561-journal="calendar"]').click();
  assert.equal(await page.evaluate(()=>window.calendarClicks),1,'atalho de calendário não acionou o Diário');

  await page.evaluate(()=>{window.goRoute('videos');document.dispatchEvent(new CustomEvent('divina:media-supreme-ready',{detail:{release:559,episodes:0,inventedEpisodes:0}}));});
  assert.match(await page.locator('#ethicalReturnVideosV561').innerText(),/Nenhum episódio foi publicado ainda/i,'zero real de episódios não foi preservado');

  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('divina:daily-v561-revealed',{detail:{date:'2026-09-13',revealed:true,cardIncluded:false,intentionIncluded:false}})));
  const localState=await page.evaluate(()=>localStorage.getItem('divina-ethical-return-v561'));
  assert.doesNotMatch(localState,/A Lua|significado|intenção secreta/i,'estado local contém identidade ou texto da carta');

  await page.evaluate(()=>{window.analyticsConsent=true;window.dispatchEvent(new CustomEvent('divina:privacy-change',{detail:{analytics:true}}));});
  await page.waitForTimeout(900);
  const post=await page.evaluate(()=>window.requests.find(request=>request.method==='POST'));
  assert.ok(post,'opt-in não iniciou ingestão');
  const body=JSON.parse(post.body);
  assert.deepEqual(Object.keys(body).sort(),['actor_token','consent','consent_version','events','locale','platform','release','session_token'],'payload contém campo não permitido');
  assert.equal(body.consent,true,'payload sem consentimento explícito');
  assert.equal(body.events.every(event=>Object.keys(event).sort().join(',')==='event_id,event_key,funnel_stage,occurred_at,route_key'),true,'evento contém texto livre');
  assert.doesNotMatch(post.body,/A Lua|intenção secreta|journal body|question/i,'payload vazou conteúdo privado');

  await page.evaluate(()=>{window.analyticsConsent=false;window.dispatchEvent(new CustomEvent('divina:privacy-change',{detail:{analytics:false}}));});
  await page.waitForTimeout(80);
  assert.equal(await page.evaluate(()=>localStorage.getItem('divina-ethical-analytics-v561')),null,'revogação não apagou identificador local');

  for(const viewport of [{width:320,height:568},{width:430,height:932},{width:768,height:1024},{width:1440,height:900}]){
    await page.setViewportSize(viewport);await page.waitForTimeout(25);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,`${viewport.width}px gerou overflow`);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  const transition=await page.locator('#ethicalReturnVideosV561 button').first().evaluate(element=>parseFloat(getComputedStyle(element).transitionDuration));
  assert.equal(transition<=.001,true,'reduced motion não neutralizou transição');
  assert.deepEqual(errors,[],'runtime gerou erro JavaScript');

  console.log(JSON.stringify({ok:true,release:'V561',hub:true,dailySafe:true,schoolChallenge:true,journalBridge:true,realEpisodeCount:true,consentGate:true,revocation:true,permissionPrompts:0,privateLeakage:0,viewports:[320,390,430,768,1440],pageErrors:0},null,2));
}finally{
  await browser.close();
  await new Promise(done=>server.close(done));
}
