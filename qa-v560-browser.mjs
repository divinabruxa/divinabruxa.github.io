import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = resolve(process.argv[2] || '.');
const types = {'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const routes = ['home','tarot','daily','spreads','library','school','journal','ai','store','consultations','music','videos','login','subscriptions','skins','notifications','admin'];
const fixture = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,interactive-widget=resizes-content"><link id="divinaPageDesignSupremeV560" rel="stylesheet" href="/page-design-supreme-v560.css?v=560"><style>body{margin:0;padding:80px 0 100px;background:#05020a;color:#fff;font-family:system-ui}.screen{display:none}.screen.active{display:block}.app-header{position:fixed;inset:0 0 auto;height:64px;z-index:5}.magic-dock{position:fixed;inset:auto 0 0;height:72px}button,input{padding:10px}</style></head><body data-screen="home"><header class="app-header"><button data-go="home">Início</button><button data-go="admin">Admin</button></header><main id="app">${routes.map((id,index)=>`<section id="${id}" class="screen${index===0?' active':''}">${id==='home'?'<button id="orb">Orbe</button>':''}<p class="eyebrow">MUNDO</p><h2>${id}</h2><p class="lead">Conteúdo responsivo deste mundo.</p>${id==='admin'?'<input aria-label="Campo administrativo"><button>Salvar</button>':'<button>Abrir</button>'}</section>`).join('')}</main><nav class="magic-dock"><button data-go="tarot">Tarot</button></nav><script type="module">import{createPageDesignSupremeV560}from'/page-design-supreme-v560.js?v=560';window.design=createPageDesignSupremeV560({go:id=>window.__go=id,pageLoader:{retry:id=>window.__retry=id}});</script></body></html>`;

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://local.test');
    if (url.pathname === '/' || url.pathname === '/fixture.html') {
      response.writeHead(200, {'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
      response.end(fixture);
      return;
    }
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (relative.includes('..')) throw new Error('invalid path');
    const file = resolve(root, relative);
    if (!file.startsWith(root)) throw new Error('invalid path');
    const bytes = await readFile(file);
    response.writeHead(200, {'content-type':types[extname(file)] || 'application/octet-stream','cache-control':'no-store'});
    response.end(bytes);
  } catch {
    response.writeHead(404);
    response.end('not found');
  }
});

await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
const address = server.address();
const base = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true });
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

try {
  await page.goto(`${base}/fixture.html`, { waitUntil:'networkidle' });
  await page.waitForFunction(() => Boolean(window.design?.audit));

  assert.equal(await page.locator('#app > .screen[data-v560-screen]').count(), 17, '17 mundos devem receber a gramática V560');
  assert.equal(await page.locator('.v560-world-mark').count(), 16, 'somente mundos internos recebem marca visual');
  assert.equal(await page.locator('#home > .v560-world-mark').count(), 0, 'Home deve preservar somente a Orbe canônica');
  assert.equal(await page.locator('#orb').count(), 1, 'deve existir uma única Orbe canônica');
  assert.equal(await page.locator('#app > .screen[aria-labelledby]').count(), 17, 'todos os mundos devem ter nome acessível');
  assert.equal(await page.locator('#home').getAttribute('aria-hidden'), 'false', 'Home deve iniciar ativa');
  assert.equal(await page.locator('#tarot').getAttribute('aria-hidden'), 'true', 'mundo inativo deve ser oculto de tecnologia assistiva');
  assert.equal(await page.locator('#tarot').getAttribute('inert'), '', 'mundo inativo deve ser inert');
  assert.equal(await page.locator('[data-go="home"]').first().getAttribute('aria-current'), 'page', 'rota atual deve ser anunciada');

  const touchTarget = await page.locator('#home button').evaluate(element => parseFloat(getComputedStyle(element).minHeight));
  assert.equal(touchTarget >= 44, true, 'alvo de toque deve ter ao menos 44px');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, '390px não pode gerar overflow horizontal');

  await page.evaluate(() => {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.toggle('active', screen.id === 'admin'));
    document.body.dataset.screen = 'admin';
    document.dispatchEvent(new CustomEvent('divina:page-loading', {detail:{id:'admin'}}));
  });
  await page.waitForTimeout(150);
  assert.equal(await page.locator('#v560SystemState').getAttribute('data-v560-state'), 'loading', 'estado loading deve aparecer');
  assert.equal(await page.locator('#admin').getAttribute('aria-hidden'), 'false', 'Admin deve ficar ativo');
  assert.equal(await page.locator('#home').getAttribute('aria-hidden'), 'true', 'Home deve ficar inativa');
  assert.equal(await page.locator('[data-go="admin"]').getAttribute('aria-current'), 'page', 'Admin deve ser rota atual');

  await page.evaluate(() => document.dispatchEvent(new CustomEvent('divina:page-ready', {detail:{id:'admin'}})));
  assert.equal(await page.locator('#admin').getAttribute('data-v560-state'), 'success', 'estado sucesso deve ser exposto');
  assert.equal(await page.locator('#v560SystemState').isHidden(), true, 'estado de loading deve sair ao concluir');
  const adminInputFont = await page.locator('#admin input').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  assert.equal(adminInputFont >= 16, true, 'formulário do Admin deve manter 16px no mobile');

  await page.evaluate(() => document.dispatchEvent(new CustomEvent('divina:page-error', {detail:{id:'admin'}})));
  assert.equal(await page.locator('#v560SystemState').getAttribute('role'), 'alert', 'erro deve usar alerta');
  assert.equal(await page.locator('.v560-system-state__retry').isVisible(), true, 'erro deve oferecer nova tentativa');
  await page.locator('.v560-system-state__retry').click();
  assert.equal(await page.evaluate(() => window.__retry), 'admin', 'nova tentativa deve chamar o page loader');

  await context.setOffline(true);
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#v560SystemState').getAttribute('data-v560-state'), 'offline', 'modo offline deve ser explícito');
  await context.setOffline(false);
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#v560SystemState').getAttribute('data-v560-state'), 'success', 'reconexão deve ser confirmada');

  for (const viewport of [{width:320,height:568},{width:430,height:932},{width:768,height:1024},{width:1440,height:900}]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(30);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `${viewport.width}px não pode gerar overflow horizontal`);
  }

  assert.equal(await page.evaluate(() => window.design.profile('conta').id), 'login', 'alias Conta incorreto no navegador');
  assert.equal(await page.evaluate(() => window.design.contract.zoom200Resilient), true, 'contrato de zoom 200% ausente');
  assert.equal(await page.evaluate(() => window.design.audit().duplicateOrbs), 0, 'auditoria detectou Orbe duplicada');
  assert.equal(await page.evaluate(() => window.design.audit().permanentAnimationLoops), 0, 'auditoria detectou loop permanente');

  await page.emulateMedia({ reducedMotion:'reduce' });
  const transitionSeconds = await page.locator('#v560SkipLink').evaluate(element => parseFloat(getComputedStyle(element).transitionDuration));
  assert.equal(transitionSeconds <= .001, true, 'movimento reduzido deve eliminar transições perceptíveis');
  assert.deepEqual(pageErrors, [], 'não pode haver erro JavaScript no runtime V560');

  console.log(JSON.stringify({
    ok:true,
    release:'V560',
    worlds:17,
    worldMarks:16,
    viewports:['320x568','390x844@3','430x932','768x1024','1440x900'],
    loading:true,
    success:true,
    errorRecovery:true,
    offline:true,
    reducedMotion:true,
    canonicalOrb:true,
    pageErrors:0
  }, null, 2));
} finally {
  await browser.close();
  await new Promise(resolveDone => server.close(resolveDone));
}
