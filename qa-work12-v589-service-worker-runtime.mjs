import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('./sw.js',import.meta.url),'utf8');
const indexSource = fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const appSource = fs.readFileSync(new URL('./app-v208.js',import.meta.url),'utf8');
const foundationSource = fs.readFileSync(new URL('./work12-foundation-v589.js',import.meta.url),'utf8');
const shellSource = fs.readFileSync(new URL('./divina-shell-v180.css',import.meta.url),'utf8');
const bridgeSource = fs.readFileSync(new URL('./cosmic-visual-atlas-v1.js',import.meta.url),'utf8');

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
  constructor(body = '', { status = 200, type = 'basic' } = {}) {
    this.body = String(body);
    this.status = status;
    this.ok = status >= 200 && status < 300;
    this.type = type;
  }
  clone() { return new FakeResponse(this.body,{ status:this.status, type:this.type }); }
  async text() { return this.body; }
}

const keyFor = value => typeof value === 'string' ? value : value?.url;

function createHarness({ mismatchedApp = false } = {}) {
  const listeners = new Map();
  const cacheStores = new Map();
  const deleted = [];
  const clientMessages = [];
  const sourceMessages = [];
  let claimed = 0;
  let skipped = 0;
  let offline = false;
  let fetches = 0;

  const coreBodies = new Map([
    ['./index.html',indexSource],
    ['./app-v208.js?v=589-work12-foundation',mismatchedApp ? '/* wrong app */' : appSource],
    ['./work12-foundation-v589.js?v=589',foundationSource],
    ['./divina-shell-v180.css?v=180',shellSource],
    ['./cosmic-visual-atlas-v1.js?v=143',bridgeSource]
  ]);

  const caches = {
    async open(name) {
      if (!cacheStores.has(name)) cacheStores.set(name,new Map());
      const store = cacheStores.get(name);
      return {
        async put(key,response) { store.set(keyFor(key),response.clone()); },
        async match(key) { return store.get(keyFor(key))?.clone() || undefined; }
      };
    },
    async keys() { return [...cacheStores.keys()]; },
    async delete(name) { deleted.push(name); return cacheStores.delete(name); },
    async match(key) {
      const normalized = keyFor(key);
      for (const store of cacheStores.values()) {
        const value = store.get(normalized);
        if (value) return value.clone();
      }
      return undefined;
    }
  };

  const fetch = async input => {
    fetches += 1;
    if (offline) throw new Error('offline');
    const request = input instanceof FakeRequest ? input : new FakeRequest(input);
    if (coreBodies.has(request.url)) return new FakeResponse(coreBodies.get(request.url));
    const url = new URL(request.url,'https://divina.test/');
    if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) {
      return new FakeResponse(indexSource);
    }
    if (url.pathname.endsWith('/app-v208.js')) return new FakeResponse(appSource);
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

  const context = vm.createContext({
    self,
    caches,
    fetch,
    Request:FakeRequest,
    URL,
    Object,
    Map,
    Set,
    Promise,
    Error,
    RegExp,
    console
  });
  vm.runInContext(source,context,{ filename:'sw.js' });

  const runWait = async (type,event = {}) => {
    let promise = Promise.resolve();
    listeners.get(type)?.({ ...event, waitUntil:value => { promise = Promise.resolve(value); } });
    return promise;
  };
  const runFetch = async request => {
    let responsePromise = null;
    listeners.get('fetch')?.({ request, respondWith:value => { responsePromise = Promise.resolve(value); } });
    return responsePromise ? responsePromise : null;
  };
  const runMessage = async data => {
    let promise = Promise.resolve();
    listeners.get('message')?.({
      data,
      source:{ postMessage:message => sourceMessages.push(message) },
      waitUntil:value => { promise = Promise.resolve(value); }
    });
    return promise;
  };

  return {
    listeners,cacheStores,deleted,clientMessages,sourceMessages,
    runWait,runFetch,runMessage,
    setOffline:value => { offline = value; },
    counters:() => ({ claimed,skipped,fetches })
  };
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : detail });

const harness = createHarness();
check('listeners:install', harness.listeners.has('install'));
check('listeners:activate', harness.listeners.has('activate'));
check('listeners:fetch', harness.listeners.has('fetch'));
check('listeners:message', harness.listeners.has('message'));

await harness.runWait('install');
const cacheName = 'divina-bruxa-work12-v589-foundation';
const coreCache = harness.cacheStores.get(cacheName);
check('install:cache-created', coreCache instanceof Map);
check('install:five-core-assets', coreCache?.size === 5, String(coreCache?.size));
check('install:index-cached', coreCache?.has('./index.html'));
check('install:app-cached', coreCache?.has('./app-v208.js?v=589-work12-foundation'));
check('install:foundation-cached', coreCache?.has('./work12-foundation-v589.js?v=589'));
check('install:skip-after-validation', harness.counters().skipped === 1);

const broken = createHarness({ mismatchedApp:true });
let rejected = false;
try { await broken.runWait('install'); } catch { rejected = true; }
check('atomic:mismatch-rejected', rejected);
check('atomic:no-cache-on-mismatch', !broken.cacheStores.has(cacheName));
check('atomic:no-skip-on-mismatch', broken.counters().skipped === 0);

harness.cacheStores.set('divina-bruxa-v588-recovery',new Map());
await harness.runWait('activate');
check('activate:claims-clients', harness.counters().claimed === 1);
check('activate:keeps-v589', harness.cacheStores.has(cacheName));
check('activate:deletes-old', !harness.cacheStores.has('divina-bruxa-v588-recovery'));
check('activate:work12-message', harness.clientMessages.some(message => message.type === 'DIVINA_WORK12_FOUNDATION_ACTIVE' && message.version === 589));
check('activate:release-message', harness.clientMessages.some(message => message.type === 'DIVINA_RELEASE_READY' && message.version === 589));

const navigation = new FakeRequest('https://divina.test/#tarot',{ mode:'navigate' });
const onlineNavigation = await harness.runFetch(navigation);
check('fetch:navigation-network', (await onlineNavigation.text()).includes('divina-work12'));
check('fetch:navigation-refreshes-fallback', harness.cacheStores.get(cacheName)?.has('./index.html'));

harness.setOffline(true);
const offlineNavigation = await harness.runFetch(new FakeRequest('https://divina.test/#daily',{ mode:'navigate' }));
check('fetch:navigation-offline-fallback', (await offlineNavigation.text()).includes('divina-work12'));
harness.setOffline(false);

const codeRequest = new FakeRequest('https://divina.test/app-v208.js?v=589-work12-foundation');
const onlineCode = await harness.runFetch(codeRequest);
check('fetch:code-network', (await onlineCode.text()).includes('createWork12FoundationV589'));
harness.setOffline(true);
const offlineCode = await harness.runFetch(codeRequest);
check('fetch:code-cache-fallback', (await offlineCode.text()).includes('createWork12FoundationV589'));
harness.setOffline(false);

await harness.runMessage({ type:'WORK12_STATUS' });
check('message:status-version', harness.sourceMessages.some(message => message.type === 'WORK12_STATUS' && message.version === 589));
check('message:status-core', harness.sourceMessages.some(message => message.type === 'WORK12_STATUS' && message.core?.length === 5));
await harness.runMessage({ type:'CLEAR_DIVINA_CACHES' });
check('message:clear-caches', !harness.cacheStores.has(cacheName));
check('message:clear-confirmation', harness.sourceMessages.some(message => message.type === 'DIVINA_CACHES_CLEARED' && message.version === 589));

const failures = checks.filter(item => !item.pass);
const output = {
  release:'V589',
  work:'WORK12',
  macroStage:'1-of-10 / service-worker-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  failures:failures.map(({ id,detail }) => ({ id,detail }))
};
console.log(JSON.stringify(output,null,2));
if (failures.length) process.exitCode = 1;
