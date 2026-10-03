import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
function worker(fetch, cached) {
  let timer, cleared = false, saved = false;
  const context = {AbortController,Request,Response,fetch,caches:{open:async()=>({match:async()=>cached,put:async()=>{saved=true;}})},self:{addEventListener(){},location:{origin:'https://divinabruxa.com.br'}},setTimeout(fn,ms){assert.equal(ms,8000);timer=fn;return 1;},clearTimeout(){cleared=true;}};
  vm.runInNewContext(source,context);
  return {read:r=>context.networkFirst(r), expire:()=>timer(), result:()=>({cleared,saved})};
}
test('conexão travada é abortada e retorna a cópia local', async()=>{
  const cached = new Response('conteúdo local');
  const w = worker(request=>new Promise((resolve,reject)=>request.signal.addEventListener('abort',()=>reject(new Error('offline')))),cached);
  const pending = w.read(new Request('https://divinabruxa.com.br/app.js'));
  await new Promise(setImmediate); w.expire();
  assert.equal(await (await pending).text(),'conteúdo local');
  assert.equal(w.result().cleared,true);
});
test('rede disponível atualiza a cópia e libera o temporizador',async()=>{
  const w=worker(async()=>new Response('atualizado'),new Response('antigo'));
  assert.equal(await (await w.read(new Request('https://divinabruxa.com.br/app.js'))).text(),'atualizado');
  assert.equal(w.result().saved,true);assert.equal(w.result().cleared,true);
});
test('falha sem cópia retorna erro sem inventar um arquivo',async()=>{
  const w=worker(async()=>{throw new Error('offline');},undefined);
  assert.equal((await w.read(new Request('https://divinabruxa.com.br/modulo.js'))).type,'error');
});
