import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL(file,import.meta.url),'utf8');
const source = read('./sw.js');
const sources = Object.freeze({
  index:read('./index.html'),
  app:read('./app-v208.js'),
  foundation:read('./work12-foundation-v589.js'),
  universe:read('./living-universe-core-v524.js'),
  shell:read('./divina-shell-v180.css'),
  bridge:read('./cosmic-visual-atlas-v1.js')
});

class FakeRequest {
  constructor(input, options = {}) {
    const original = typeof input === 'string' ? null : input;
    this.url = typeof input === 'string' ? input : input.url;
    this.method = options.method || original?.method || 'GET';
    this.mode = options.mode || original?.mode || 'same-origin';
    this.cache = options.cache || original?.cache || 'default';
  }
}

class FakeResponse {
  constructor(body = '', { status=200,type='basic' } = {}) {
    this.body = String(body);
    this.status = status;
    this.ok = status >= 200 && status < 300;
    this.type = type;
  }
  clone() { return new FakeResponse(this.body,{status:this.status,type:this.type}); }
  async text() { return this.body; }
}

const keyFor = value => typeof value === 'string' ? value : value?.url;

function createHarness({ brokenUniverse=false } = {}) {
  const listeners = new Map();
  const stores = new Map();
  const deleted = [];
  const clientMessages = [];
  const sourceMessages = [];
  let offline = false;
  let claimed = 0;
  let skipped = 0;

  const coreBodies = new Map([
    ['./index.html',sources.index],
    ['./app-v208.js?v=590-work12-universe',sources.app],
    ['./work12-foundation-v589.js?v=589',sources.foundation],
    ['./living-universe-core-v524.js?v=590-work12-universe',brokenUniverse ? '/* wrong universe */' : sources.universe],
    ['./divina-shell-v180.css?v=180',sources.shell],
    ['./cosmic-visual-atlas-v1.js?v=590-work12-bridge',sources.bridge]
  ]);

  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name,new Map());
      const store = stores.get(name);
      return {
        async put(key,response) { store.set(keyFor(key),response.clone()); },
        async match(key) { return store.get(keyFor(key))?.clone(); }
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { deleted.push(name); return stores.delete(name); },
    async match(key) {
      const normalized = keyFor(key);
      for (const store of stores.values()) {
        const response = store.get(normalized);
        if (response) return response.clone();
      }
      return undefined;
    }
  };

  const fetch = async input => {
    if (offline) throw new Error('offline');
    const request = input instanceof FakeRequest ? input : new FakeRequest(input);
    if (coreBodies.has(request.url)) return new FakeResponse(coreBodies.get(request.url));
    const url = new URL(request.url,'https://divina.test/');
    if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) return new FakeResponse(sources.index);
    if (url.pathname.endsWith('/app-v208.js')) return new FakeResponse(sources.app);
    if (url.pathname.endsWith('/living-universe-core-v524.js')) return new FakeResponse(sources.universe);
    return new FakeResponse(`asset:${url.pathname}`);
  };

  const self = {
    location:{ origin:'https://divina.test' },
    addEventListener(type,handler) { listeners.set(type,handler); },
    async skipWaiting() { skipped += 1; },
    clients:{
      async claim() { claimed += 1; },
      async matchAll() { return [{ postMessage:message => clientMessages.push(message) }]; }
    }
  };

  vm.runInContext(source,vm.createContext({
    self,caches,fetch,Request:FakeRequest,URL,Object,Map,Set,Promise,Error,RegExp,console
  }),{filename:'sw-v590.js'});

  const wait = async (type,event = {}) => {
    let promise = Promise.resolve();
    listeners.get(type)?.({...event,waitUntil:value => { promise=Promise.resolve(value); }});
    return promise;
  };
  const fetchEvent = async request => {
    let response = null;
    listeners.get('fetch')?.({request,respondWith:value => { response=Promise.resolve(value); }});
    return response;
  };
  const message = async data => {
    let promise = Promise.resolve();
    listeners.get('message')?.({
      data,
      source:{postMessage:value => sourceMessages.push(value)},
      waitUntil:value => { promise=Promise.resolve(value); }
    });
    return promise;
  };
  return {
    listeners,stores,deleted,clientMessages,sourceMessages,wait,fetchEvent,message,
    offline:value => { offline=value; },
    counters:() => ({claimed,skipped})
  };
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({id,pass:Boolean(condition),detail:condition?'':detail});
const cacheName = 'divina-bruxa-work12-v590-universe';

const harness = createHarness();
for (const event of ['install','activate','fetch','message']) check(`listener:${event}`,harness.listeners.has(event));
await harness.wait('install');
const cache = harness.stores.get(cacheName);
check('install:atomic-cache-created',cache instanceof Map);
check('install:six-core-assets',cache?.size === 6,String(cache?.size));
for (const asset of [
  './index.html','./app-v208.js?v=590-work12-universe','./work12-foundation-v589.js?v=589',
  './living-universe-core-v524.js?v=590-work12-universe','./divina-shell-v180.css?v=180',
  './cosmic-visual-atlas-v1.js?v=590-work12-bridge'
]) check(`install:${asset}`,cache?.has(asset));
check('install:skip-after-all-validation',harness.counters().skipped === 1);

const broken = createHarness({brokenUniverse:true});
let rejected = false;
try { await broken.wait('install'); } catch { rejected = true; }
check('atomic:broken-universe-rejected',rejected);
check('atomic:broken-universe-never-cached',!broken.stores.has(cacheName));
check('atomic:broken-universe-never-activates',broken.counters().skipped === 0);

harness.stores.set('divina-bruxa-work12-v589-foundation',new Map());
await harness.wait('activate');
check('activate:claims-clients',harness.counters().claimed === 1);
check('activate:keeps-v590',harness.stores.has(cacheName));
check('activate:deletes-v589',!harness.stores.has('divina-bruxa-work12-v589-foundation'));
check('activate:foundation-message',harness.clientMessages.some(item => item.type === 'DIVINA_WORK12_FOUNDATION_ACTIVE' && item.version === 590));
check('activate:universe-message',harness.clientMessages.some(item => item.type === 'DIVINA_WORK12_UNIVERSE_ACTIVE' && item.version === 590));
check('activate:release-message',harness.clientMessages.some(item => item.type === 'DIVINA_RELEASE_READY' && item.version === 590));

const navigation = new FakeRequest('https://divina.test/#tarot',{mode:'navigate'});
const onlineNavigation = await harness.fetchEvent(navigation);
check('fetch:navigation-network',(await onlineNavigation.text()).includes('content="V590"'));
harness.offline(true);
const offlineNavigation = await harness.fetchEvent(new FakeRequest('https://divina.test/#daily',{mode:'navigate'}));
check('fetch:navigation-offline',(await offlineNavigation.text()).includes('content="V590"'));
harness.offline(false);

const universeRequest = new FakeRequest('https://divina.test/living-universe-core-v524.js?v=590-work12-universe');
const onlineUniverse = await harness.fetchEvent(universeRequest);
check('fetch:universe-network',(await onlineUniverse.text()).includes('const RELEASE = 590;'));
harness.offline(true);
const offlineUniverse = await harness.fetchEvent(universeRequest);
check('fetch:universe-offline',(await offlineUniverse.text()).includes('const RELEASE = 590;'));
harness.offline(false);

await harness.message({type:'WORK12_STATUS'});
check('message:status-version',harness.sourceMessages.some(item => item.type === 'WORK12_STATUS' && item.version === 590));
check('message:status-six-assets',harness.sourceMessages.some(item => item.type === 'WORK12_STATUS' && item.core?.length === 6));
await harness.message({type:'CLEAR_DIVINA_CACHES'});
check('message:clear-caches',!harness.stores.has(cacheName));
check('message:clear-confirmed',harness.sourceMessages.some(item => item.type === 'DIVINA_CACHES_CLEARED' && item.version === 590));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V590',work:'WORK12',macroStage:'2-of-10 / service-worker-runtime',
  state:failures.length?'FAIL':'PASS',passed:checks.length-failures.length,
  failed:failures.length,total:checks.length,
  failures:failures.map(({id,detail}) => ({id,detail}))
},null,2));
if (failures.length) process.exitCode = 1;
