/* DIVINA BRUXA — WORK13 V606 · QA DO SERVICE WORKER ATOMICO */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const coreBody = source.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
const coreAssets = [...coreBody.matchAll(/'([^']+)'/g)].map(match => match[1]);
const localFile = asset => new URL(asset, 'https://divina.test/').pathname.replace(/^\//, '');
const fileSources = new Map(coreAssets.map(asset => {
  const file = localFile(asset);
  return [asset, fs.readFileSync(path.join(root, file), 'utf8')];
}));

class FakeResponse {
  constructor(body = '', { ok = true, status = 200, type = 'basic' } = {}) {
    this.body = String(body);
    this.ok = ok;
    this.status = status;
    this.type = type;
  }
  clone() { return new FakeResponse(this.body, { ok:this.ok, status:this.status, type:this.type }); }
  async text() { return this.body; }
}

class FakeRequest {
  constructor(input, options = {}) {
    const previous = typeof input === 'string' ? null : input;
    this.url = new URL(typeof input === 'string' ? input : previous.url, 'https://divina.test/').href;
    this.method = options.method || previous?.method || 'GET';
    this.mode = options.mode || previous?.mode || 'same-origin';
    this.cache = options.cache || previous?.cache || 'default';
  }
}

function createHarness({ brokenAsset = '', brokenContent = false } = {}) {
  const listeners = new Map();
  const stores = new Map();
  const clientMessages = [];
  const sourceMessages = [];
  let skipped = 0;
  let claimed = 0;
  let offline = false;

  const cacheApi = name => ({
    async put(key, response) {
      if (!stores.has(name)) stores.set(name, new Map());
      stores.get(name).set(typeof key === 'string' ? key : key.url, response.clone());
    },
    async match(key) {
      const target = typeof key === 'string' ? key : key.url;
      return stores.get(name)?.get(target)?.clone() || null;
    }
  });
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      return cacheApi(name);
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(key) {
      const target = typeof key === 'string' ? key : key.url;
      for (const store of stores.values()) {
        const response = store.get(target);
        if (response) return response.clone();
      }
      return null;
    }
  };
  const fetch = async input => {
    if (offline) throw new Error('offline');
    const request = input instanceof FakeRequest ? input : new FakeRequest(input);
    const url = new URL(request.url);
    const asset = coreAssets.find(item => new URL(item, 'https://divina.test/').pathname === url.pathname
      && new URL(item, 'https://divina.test/').search === url.search);
    if (asset === brokenAsset && !brokenContent) return new FakeResponse('', { ok:false, status:404 });
    if (asset === brokenAsset && brokenContent) return new FakeResponse('BROKEN-CONTENT');
    if (asset) return new FakeResponse(fileSources.get(asset));
    const pathnameAsset = coreAssets.find(item => new URL(item, 'https://divina.test/').pathname === url.pathname);
    return new FakeResponse(pathnameAsset ? fileSources.get(pathnameAsset) : `asset:${url.pathname}`);
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
  }), { filename:'sw-v606.js' });

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
const cacheName = 'divina-bruxa-work13-v606-whit-silence-timing';
const harness = createHarness();

check('core:thirty-four-assets-declared', coreAssets.length === 34, coreAssets.length);
check('core:unique-assets', new Set(coreAssets).size === coreAssets.length);
check('core:app-v606', coreAssets.includes('./app-v208.js?v=606-work13-whit-timing'));
check('core:timing-js', coreAssets.includes('./whit-silence-timing-v606.js?v=606-work13-whit-timing'));
check('core:v605-js-preserved', coreAssets.includes('./cosmic-spread-reading-v605.js?v=605-work13-spread-reading'));
check('core:v605-css-preserved', coreAssets.includes('./cosmic-spread-reading-v605.css?v=605-work13-spread-reading'));
check('core:v604-preserved', coreAssets.includes('./cosmic-daily-reading-v604.js?v=604-work13-daily-reading'));
check('core:v603-preserved', coreAssets.includes('./cosmos-reality-resonance-v603.js?v=603-work13-resonance'));
check('core:v602-preserved', coreAssets.includes('./cosmos-context-memory-v602.js?v=602-work13-context'));
for (const event of ['install','activate','fetch','message']) check(`listener:${event}`, harness.listeners.has(event));

await harness.wait('install');
const cache = harness.stores.get(cacheName);
check('install:atomic-cache-created', cache instanceof Map);
check('install:thirty-four-core-assets', cache?.size === 34, cache?.size);
for (const asset of coreAssets) check(`install:${asset}`, cache?.has(asset));
check('install:skip-after-validation', harness.counters().skipped === 1, harness.counters().skipped);

for (const asset of coreAssets) {
  const broken = createHarness({ brokenAsset:asset });
  let rejected = false;
  try { await broken.wait('install'); } catch { rejected = true; }
  check(`atomic:${localFile(asset)}:rejected`, rejected);
  check(`atomic:${localFile(asset)}:never-cached`, !broken.stores.has(cacheName));
  check(`atomic:${localFile(asset)}:never-activates`, broken.counters().skipped === 0);
}

for (const asset of [
  './index.html',
  './app-v208.js?v=606-work13-whit-timing',
  './whit-silence-timing-v606.js?v=606-work13-whit-timing'
]) {
  const broken = createHarness({ brokenAsset:asset, brokenContent:true });
  let rejected = false;
  try { await broken.wait('install'); } catch { rejected = true; }
  check(`semantic:${localFile(asset)}:rejected`, rejected);
  check(`semantic:${localFile(asset)}:never-cached`, !broken.stores.has(cacheName));
}

harness.stores.set('divina-bruxa-work13-v605-cards-converse', new Map());
await harness.wait('activate');
check('activate:claims-clients', harness.counters().claimed === 1);
check('activate:keeps-v606', harness.stores.has(cacheName));
check('activate:deletes-v605-cache', !harness.stores.has('divina-bruxa-work13-v605-cards-converse'));
for (const type of [
  'DIVINA_WORK12_FOUNDATION_ACTIVE','DIVINA_WORK12_NAVIGATION_ACTIVE',
  'DIVINA_WORK12_UNIVERSE_ACTIVE','DIVINA_WORK12_ORB_ACTIVE',
  'DIVINA_WORK12_MENU_ACTIVE','DIVINA_WORK12_WHIT_ACTIVE',
  'DIVINA_WORK12_RITUAL_ACTIVE','DIVINA_WORK12_CHAMBERS_ACTIVE',
  'DIVINA_WORK12_INTELLIGENCE_ACTIVE','DIVINA_WORK12_FINAL_ACTIVE',
  'DIVINA_WORK13_CONTEXT_ACTIVE','DIVINA_WORK13_RESONANCE_ACTIVE',
  'DIVINA_WORK13_DAILY_READING_ACTIVE','DIVINA_WORK13_SPREAD_READING_ACTIVE',
  'DIVINA_WORK13_WHIT_TIMING_ACTIVE','DIVINA_RELEASE_READY'
]) check(`activate:${type}`, harness.clientMessages.some(item => item.type === type && item.version === 606));
check('activate:context-version-v602', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_CONTEXT_ACTIVE' && item.contextVersion === 602));
check('activate:resonance-version-v603', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_RESONANCE_ACTIVE' && item.resonanceVersion === 603));
check('activate:daily-version-v604', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_DAILY_READING_ACTIVE' && item.dailyReadingVersion === 604));
check('activate:spread-version-v605', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_SPREAD_READING_ACTIVE' && item.spreadReadingVersion === 605));
check('activate:timing-version-v606', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_WHIT_TIMING_ACTIVE' && item.whitTimingVersion === 606 && item.livingPresenceVersion === 594));

const onlineNavigation = await harness.fetchEvent(new FakeRequest('https://divina.test/index.html#ai', { mode:'navigate' }));
check('fetch:navigation-network', (await onlineNavigation.text()).includes('name="divina-work13" content="V606"'));
harness.offline(true);
const offlineNavigation = await harness.fetchEvent(new FakeRequest('https://divina.test/index.html#ai', { mode:'navigate' }));
check('fetch:navigation-offline', (await offlineNavigation.text()).includes('name="divina-work12" content="V600"'));
harness.offline(false);

for (const [file, needle] of [
  ['app-v208.js?v=606-work13-whit-timing','divinaWork13Macro6V606'],
  ['whit-silence-timing-v606.js?v=606-work13-whit-timing','WHIT_SILENCE_TIMING_CONTRACT_V606'],
  ['cosmic-spread-reading-v605.js?v=605-work13-spread-reading','COSMIC_SPREAD_READING_CONTRACT_V605'],
  ['cosmic-daily-reading-v604.js?v=604-work13-daily-reading','COSMIC_DAILY_READING_CONTRACT_V604'],
  ['cosmos-reality-resonance-v603.js?v=603-work13-resonance','COSMOS_REALITY_RESONANCE_CONTRACT_V603'],
  ['cosmos-context-memory-v602.js?v=602-work13-context','COSMOS_CONTEXT_MEMORY_CONTRACT_V602'],
  ['whit-living-presence-v594.js?v=594-work12-whit','WHIT_LIVING_PRESENCE_CONTRACT_V594'],
  ['work12-final-continuity-v598.js?v=598-work12-final','FINAL_CONTINUITY_CONTRACT_V598']
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
check('message:status-version', harness.sourceMessages.some(item => item.type === 'WORK12_STATUS' && item.version === 606));
check('message:status-thirty-four-assets', harness.sourceMessages.some(item => item.type === 'WORK12_STATUS' && item.core?.length === 34));
await harness.message({ type:'CLEAR_DIVINA_CACHES' });
check('message:clear-caches', !harness.stores.has(cacheName));
check('message:clear-confirmed', harness.sourceMessages.some(item => item.type === 'DIVINA_CACHES_CLEARED' && item.version === 606));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V606',
  work:'WORK13',
  macroStage:'6-of-10 / whit-silence-timing-service-worker-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  coreAssets:coreAssets.length,
  atomicAssetsChecked:coreAssets.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
