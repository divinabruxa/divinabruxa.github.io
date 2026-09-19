/* DIVINA BRUXA — WORK13 V605 · QA SERVICE WORKER ATOMICO */
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const source = read('./sw.js');
const coreBlock = source.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\n\]\);/)?.[1] || '';
const coreAssets = Object.freeze([...coreBlock.matchAll(/'([^']+)'/g)].map(match => match[1]));
const localFile = asset => asset.split('?')[0];
const sources = Object.freeze(Object.fromEntries(coreAssets.map(asset => [asset, read(localFile(asset))])));

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
  clone() { return new FakeResponse(this.body, { status:this.status, type:this.type }); }
  async text() { return this.body; }
}

const keyFor = value => typeof value === 'string' ? value : value?.url;

function createHarness({ brokenAsset = '' } = {}) {
  const listeners = new Map();
  const stores = new Map();
  const clientMessages = [];
  const sourceMessages = [];
  let offline = false;
  let claimed = 0;
  let skipped = 0;
  const paths = new Map(coreAssets.map(asset => [asset, asset === brokenAsset ? `/* broken ${asset} */` : sources[asset]]));
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async put(key, response) { store.set(keyFor(key), response.clone()); },
        async match(key) { return store.get(keyFor(key))?.clone(); }
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
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
    if (paths.has(request.url)) return new FakeResponse(paths.get(request.url));
    const url = new URL(request.url, 'https://divina.test/');
    if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) return new FakeResponse(sources['./index.html']);
    const asset = coreAssets.find(item => localFile(item).slice(1) === url.pathname);
    return new FakeResponse(asset ? sources[asset] : `asset:${url.pathname}`);
  };
  const self = {
    location:{ origin:'https://divina.test' },
    addEventListener(type, handler) { listeners.set(type, handler); },
    async skipWaiting() { skipped += 1; },
    clients:{
      async claim() { claimed += 1; },
      async matchAll() { return [{ postMessage:message => clientMessages.push(message) }]; }
    }
  };
  vm.runInContext(source, vm.createContext({
    self,caches,fetch,Request:FakeRequest,URL,Object,Map,Set,Promise,Error,RegExp,console
  }), { filename:'sw-v605.js' });
  const wait = async (type, event = {}) => {
    let promise = Promise.resolve();
    listeners.get(type)?.({ ...event, waitUntil:value => { promise = Promise.resolve(value); } });
    return promise;
  };
  const fetchEvent = async request => {
    let response = null;
    listeners.get('fetch')?.({ request, respondWith:value => { response = Promise.resolve(value); } });
    return response;
  };
  const message = async data => {
    let promise = Promise.resolve();
    listeners.get('message')?.({
      data,
      source:{ postMessage:value => sourceMessages.push(value) },
      waitUntil:value => { promise = Promise.resolve(value); }
    });
    return promise;
  };
  return {
    listeners,stores,clientMessages,sourceMessages,wait,fetchEvent,message,
    offline:value => { offline = value; },
    counters:() => ({ claimed, skipped })
  };
}

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const cacheName = 'divina-bruxa-work13-v605-cards-converse';
const harness = createHarness();

check('core:thirty-three-assets-declared', coreAssets.length === 33, coreAssets.length);
check('core:app-v605', coreAssets.includes('./app-v208.js?v=605-work13-spread-reading'));
check('core:spread-js', coreAssets.includes('./cosmic-spread-reading-v605.js?v=605-work13-spread-reading'));
check('core:spread-css', coreAssets.includes('./cosmic-spread-reading-v605.css?v=605-work13-spread-reading'));
check('core:v604-js-preserved', coreAssets.includes('./cosmic-daily-reading-v604.js?v=604-work13-daily-reading'));
check('core:v604-css-preserved', coreAssets.includes('./cosmic-daily-reading-v604.css?v=604-work13-daily-reading'));
check('core:v603-preserved', coreAssets.includes('./cosmos-reality-resonance-v603.js?v=603-work13-resonance'));
check('core:v602-preserved', coreAssets.includes('./cosmos-context-memory-v602.js?v=602-work13-context'));
for (const event of ['install','activate','fetch','message']) check(`listener:${event}`, harness.listeners.has(event));

await harness.wait('install');
const cache = harness.stores.get(cacheName);
check('install:atomic-cache-created', cache instanceof Map);
check('install:thirty-three-core-assets', cache?.size === 33, cache?.size);
for (const asset of coreAssets) check(`install:${asset}`, cache?.has(asset));
check('install:skip-after-validation', harness.counters().skipped === 1, harness.counters().skipped);

const unvalidated = new Set([
  './divina-shell-v180.css?v=180',
  './cosmic-visual-atlas-v1.js?v=590-work12-bridge'
]);
const validatedAssets = coreAssets.filter(asset => !unvalidated.has(asset));
for (const asset of validatedAssets) {
  const broken = createHarness({ brokenAsset:asset });
  let rejected = false;
  try { await broken.wait('install'); } catch { rejected = true; }
  check(`atomic:${localFile(asset)}:rejected`, rejected);
  check(`atomic:${localFile(asset)}:never-cached`, !broken.stores.has(cacheName));
  check(`atomic:${localFile(asset)}:never-activates`, broken.counters().skipped === 0);
}

harness.stores.set('divina-bruxa-work13-v604-layered-daily-reading', new Map());
await harness.wait('activate');
check('activate:claims-clients', harness.counters().claimed === 1);
check('activate:keeps-v605', harness.stores.has(cacheName));
check('activate:deletes-v604-cache', !harness.stores.has('divina-bruxa-work13-v604-layered-daily-reading'));
for (const type of [
  'DIVINA_WORK12_FOUNDATION_ACTIVE','DIVINA_WORK12_NAVIGATION_ACTIVE',
  'DIVINA_WORK12_UNIVERSE_ACTIVE','DIVINA_WORK12_ORB_ACTIVE',
  'DIVINA_WORK12_MENU_ACTIVE','DIVINA_WORK12_WHIT_ACTIVE',
  'DIVINA_WORK12_RITUAL_ACTIVE','DIVINA_WORK12_CHAMBERS_ACTIVE',
  'DIVINA_WORK12_INTELLIGENCE_ACTIVE','DIVINA_WORK12_FINAL_ACTIVE',
  'DIVINA_WORK13_CONTEXT_ACTIVE','DIVINA_WORK13_RESONANCE_ACTIVE',
  'DIVINA_WORK13_DAILY_READING_ACTIVE','DIVINA_WORK13_SPREAD_READING_ACTIVE',
  'DIVINA_RELEASE_READY'
]) check(`activate:${type}`, harness.clientMessages.some(item => item.type === type && item.version === 605));
check('activate:context-version-v602', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_CONTEXT_ACTIVE' && item.contextVersion === 602));
check('activate:resonance-version-v603', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_RESONANCE_ACTIVE' && item.resonanceVersion === 603));
check('activate:daily-version-v604', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_DAILY_READING_ACTIVE' && item.dailyReadingVersion === 604));
check('activate:spread-version-v605', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_SPREAD_READING_ACTIVE' && item.spreadReadingVersion === 605));
check('activate:spread-methods', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_SPREAD_READING_ACTIVE' && item.spreadMethods === 15));

const onlineNavigation = await harness.fetchEvent(new FakeRequest('https://divina.test/#spreads', { mode:'navigate' }));
check('fetch:navigation-network', (await onlineNavigation.text()).includes('name="divina-work13" content="V605"'));
harness.offline(true);
const offlineNavigation = await harness.fetchEvent(new FakeRequest('https://divina.test/#spreads', { mode:'navigate' }));
check('fetch:navigation-offline', (await offlineNavigation.text()).includes('name="divina-work12" content="V600"'));
harness.offline(false);

for (const [file, needle] of [
  ['app-v208.js?v=605-work13-spread-reading','divinaWork13Macro5V605'],
  ['cosmic-spread-reading-v605.js?v=605-work13-spread-reading','COSMIC_SPREAD_READING_CONTRACT_V605'],
  ['cosmic-spread-reading-v605.css?v=605-work13-spread-reading','db605-synthesis-phrase'],
  ['cosmic-daily-reading-v604.js?v=604-work13-daily-reading','COSMIC_DAILY_READING_CONTRACT_V604'],
  ['cosmos-reality-resonance-v603.js?v=603-work13-resonance','COSMOS_REALITY_RESONANCE_CONTRACT_V603'],
  ['cosmos-context-memory-v602.js?v=602-work13-context','COSMOS_CONTEXT_MEMORY_CONTRACT_V602'],
  ['reading-ritual-core-v595.js?v=595-work12-ritual','READING_RITUAL_CONTRACT_V595'],
  ['work12-final-continuity-v598.js?v=598-work12-final','FINAL_CONTINUITY_CONTRACT_V598'],
  ['supreme-orb-core-v501.js?v=591-work12-orb','const WORK12_RELEASE = 591;']
]) {
  const request = new FakeRequest(`https://divina.test/${file}`);
  const online = await harness.fetchEvent(request);
  check(`fetch:${file}:network`, (await online.text()).includes(needle));
  harness.offline(true);
  const cached = await harness.fetchEvent(request);
  check(`fetch:${file}:offline`, (await cached.text()).includes(needle));
  harness.offline(false);
}

await harness.message({ type:'WORK12_STATUS' });
check('message:status-version', harness.sourceMessages.some(item => item.type === 'WORK12_STATUS' && item.version === 605));
check('message:status-thirty-three-assets', harness.sourceMessages.some(item => item.type === 'WORK12_STATUS' && item.core?.length === 33));
await harness.message({ type:'CLEAR_DIVINA_CACHES' });
check('message:clear-caches', !harness.stores.has(cacheName));
check('message:clear-confirmed', harness.sourceMessages.some(item => item.type === 'DIVINA_CACHES_CLEARED' && item.version === 605));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V605',
  work:'WORK13',
  macroStage:'5-of-10 / cards-converse-service-worker-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  coreAssets:coreAssets.length,
  atomicAssetsChecked:validatedAssets.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
