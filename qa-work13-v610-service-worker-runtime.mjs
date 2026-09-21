/* DIVINA BRUXA — WORK13 V610 · QA DO SERVICE WORKER ATÔMICO */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const coreBody = source.match(/const CORE = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
const coreAssets = [...coreBody.matchAll(/'([^']+)'/g)].map(match => match[1]);
const localFile = asset => new URL(asset, 'https://divina.test/').pathname.replace(/^\//, '');
const fileSources = new Map(coreAssets.map(asset => [asset, fs.readFileSync(path.join(root, localFile(asset)), 'utf8')]));

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
    const asset = coreAssets.find(item => {
      const candidate = new URL(item, 'https://divina.test/');
      return candidate.pathname === url.pathname && candidate.search === url.search;
    });
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
  }), { filename:'sw-v610.js' });
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
const cacheName = 'divina-bruxa-work13-v610-tarot-livre-soul';
const harness = createHarness();

check('core:forty-seven-assets-declared', coreAssets.length === 47, coreAssets.length);
check('core:unique-assets', new Set(coreAssets).size === coreAssets.length);
check('core:app-v610', coreAssets.includes('./app-v208.js?v=610-work13-final-presence'));
check('core:tarot-soul-js', coreAssets.includes('./tarot-livre-soul-v610.js?v=610-work13-tarot-soul'));
check('core:tarot-soul-css', coreAssets.includes('./tarot-livre-soul-v610.css?v=610-work13-tarot-soul'));
check('core:entry-js', coreAssets.includes('./cosmos-entry-intention-v610.js?v=610-work13-final-presence'));
check('core:entry-css', coreAssets.includes('./cosmos-entry-intention-v610.css?v=610-work13-final-presence'));
check('core:world-presence-js', coreAssets.includes('./cosmos-world-presence-v610.js?v=610-work13-final-presence'));
check('core:world-presence-css', coreAssets.includes('./cosmos-world-presence-v610.css?v=610-work13-final-presence'));
check('core:final-orchestra-js', coreAssets.includes('./cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra'));
check('core:media-skins-js', coreAssets.includes('./living-media-skins-v609.js?v=609-work13-media-skins'));
check('core:media-skins-css', coreAssets.includes('./living-media-skins-v609.css?v=609-work13-media-skins'));
for (const versioned of [
  './living-commerce-path-v608.js?v=608-work13-commerce-clarity',
  './living-wisdom-path-v607.js?v=607-work13-living-wisdom',
  './whit-silence-timing-v606.js?v=606-work13-whit-timing',
  './cosmic-spread-reading-v605.js?v=605-work13-spread-reading',
  './cosmic-daily-reading-v604.js?v=604-work13-daily-reading',
  './cosmos-reality-resonance-v603.js?v=603-work13-resonance',
  './cosmos-context-memory-v602.js?v=602-work13-context'
]) check(`core:preserved:${localFile(versioned)}`, coreAssets.includes(versioned));
for (const event of ['install','activate','fetch','message']) check(`listener:${event}`, harness.listeners.has(event));

await harness.wait('install');
const cache = harness.stores.get(cacheName);
check('install:atomic-cache-created', cache instanceof Map);
check('install:forty-seven-core-assets', cache?.size === 47, cache?.size);
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
  './app-v208.js?v=610-work13-final-presence',
  './cosmos-entry-intention-v610.js?v=610-work13-final-presence',
  './cosmos-entry-intention-v610.css?v=610-work13-final-presence',
  './cosmos-world-presence-v610.js?v=610-work13-final-presence',
  './cosmos-world-presence-v610.css?v=610-work13-final-presence',
  './cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra',
  './living-media-skins-v609.js?v=609-work13-media-skins',
  './living-media-skins-v609.css?v=609-work13-media-skins',
  './living-commerce-path-v608.js?v=608-work13-commerce-clarity',
  './living-commerce-path-v608.css?v=608-work13-commerce-clarity',
  './living-wisdom-path-v607.js?v=607-work13-living-wisdom'
]) {
  const broken = createHarness({ brokenAsset:asset, brokenContent:true });
  let rejected = false;
  try { await broken.wait('install'); } catch { rejected = true; }
  check(`semantic:${localFile(asset)}:rejected`, rejected);
  check(`semantic:${localFile(asset)}:never-cached`, !broken.stores.has(cacheName));
}

harness.stores.set('divina-bruxa-work13-v609-media-skins', new Map());
await harness.wait('activate');
check('activate:claims-clients', harness.counters().claimed === 1);
check('activate:keeps-v610', harness.stores.has(cacheName));
check('activate:deletes-v609-cache', !harness.stores.has('divina-bruxa-work13-v609-media-skins'));
for (const type of [
  'DIVINA_WORK12_FOUNDATION_ACTIVE','DIVINA_WORK12_NAVIGATION_ACTIVE',
  'DIVINA_WORK12_UNIVERSE_ACTIVE','DIVINA_WORK12_ORB_ACTIVE',
  'DIVINA_WORK12_MENU_ACTIVE','DIVINA_WORK12_WHIT_ACTIVE',
  'DIVINA_WORK12_RITUAL_ACTIVE','DIVINA_WORK12_CHAMBERS_ACTIVE',
  'DIVINA_WORK12_INTELLIGENCE_ACTIVE','DIVINA_WORK12_FINAL_ACTIVE',
  'DIVINA_WORK13_CONTEXT_ACTIVE','DIVINA_WORK13_RESONANCE_ACTIVE',
  'DIVINA_WORK13_DAILY_READING_ACTIVE','DIVINA_WORK13_SPREAD_READING_ACTIVE',
  'DIVINA_WORK13_WHIT_TIMING_ACTIVE','DIVINA_WORK13_LIVING_WISDOM_ACTIVE',
  'DIVINA_WORK13_COMMERCE_CLARITY_ACTIVE','DIVINA_WORK13_MEDIA_SKINS_ACTIVE',
  'DIVINA_WORK13_FINAL_ORCHESTRA_ACTIVE','DIVINA_WORK13_ENTRY_ACTIVE',
  'DIVINA_WORK13_FINAL_PRESENCE_ACTIVE',
  'DIVINA_RELEASE_READY'
]) check(`activate:${type}`, harness.clientMessages.some(item => item.type === type && item.version === 610));
check('activate:context-version-v602', harness.clientMessages.some(item => item.contextVersion === 602));
check('activate:resonance-version-v603', harness.clientMessages.some(item => item.resonanceVersion === 603));
check('activate:daily-version-v604', harness.clientMessages.some(item => item.dailyReadingVersion === 604));
check('activate:spread-version-v605', harness.clientMessages.some(item => item.spreadReadingVersion === 605));
check('activate:timing-version-v606', harness.clientMessages.some(item => item.whitTimingVersion === 606));
check('activate:wisdom-version-v607', harness.clientMessages.some(item => item.livingWisdomVersion === 607));
check('activate:commerce-version-v608', harness.clientMessages.some(item => item.commerceClarityVersion === 608));
check('activate:media-skins-version-v609', harness.clientMessages.some(item => item.mediaSkinsVersion === 609));
check('activate:final-orchestra-version-v610', harness.clientMessages.some(item => item.finalOrchestraVersion === 610 && item.complete === true));
check('activate:final-presence-v610', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_FINAL_PRESENCE_ACTIVE' && item.publicWorlds === 15 && item.complete === true));
check('activate:global-menu-v610', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_GLOBAL_MENU_ACTIVE' && item.publicWorlds === 15 && item.oneOrb === true && item.complete === true));
check('activate:tarot-soul-v610', harness.clientMessages.some(item => item.type === 'DIVINA_WORK13_TAROT_SOUL_ACTIVE' && item.reality === 'tarot' && item.cards === 78 && item.reversed === false && item.meanings === false && item.oneOrb === true));

const onlineNavigation = await harness.fetchEvent(new FakeRequest('https://divina.test/index.html#music', { mode:'navigate' }));
check('fetch:navigation-network', (await onlineNavigation.text()).includes('name="divina-work13" content="V610"'));
harness.offline(true);
const offlineNavigation = await harness.fetchEvent(new FakeRequest('https://divina.test/index.html#skins', { mode:'navigate' }));
check('fetch:navigation-offline', (await offlineNavigation.text()).includes('name="divina-work12" content="V600"'));
harness.offline(false);

for (const [file, needle] of [
  ['app-v208.js?v=610-work13-final-presence','divinaWork13Macro10V610'],
  ['cosmos-entry-intention-v610.js?v=610-work13-final-presence','COSMOS_ENTRY_INTENTION_CONTRACT_V610'],
  ['cosmos-entry-intention-v610.css?v=610-work13-final-presence','.cosmos-entry-intent'],
  ['cosmos-world-presence-v610.js?v=610-work13-final-presence','COSMOS_WORLD_PRESENCE_CONTRACT_V610'],
  ['cosmos-world-presence-v610.css?v=610-work13-final-presence','[data-work13-world]'],
  ['cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra','COSMOS_FINAL_ORCHESTRA_CONTRACT_V610'],
  ['living-media-skins-v609.js?v=609-work13-media-skins','LIVING_MEDIA_SKINS_CONTRACT_V609'],
  ['living-media-skins-v609.css?v=609-work13-media-skins','[data-living-media-skins="v609"]'],
  ['living-commerce-path-v608.js?v=608-work13-commerce-clarity','LIVING_COMMERCE_PATH_CONTRACT_V608'],
  ['living-wisdom-path-v607.js?v=607-work13-living-wisdom','LIVING_WISDOM_PATH_CONTRACT_V607'],
  ['whit-silence-timing-v606.js?v=606-work13-whit-timing','WHIT_SILENCE_TIMING_CONTRACT_V606'],
  ['cosmic-spread-reading-v605.js?v=605-work13-spread-reading','COSMIC_SPREAD_READING_CONTRACT_V605'],
  ['cosmic-daily-reading-v604.js?v=604-work13-daily-reading','COSMIC_DAILY_READING_CONTRACT_V604'],
  ['cosmos-reality-resonance-v603.js?v=603-work13-resonance','COSMOS_REALITY_RESONANCE_CONTRACT_V603'],
  ['cosmos-context-memory-v602.js?v=602-work13-context','COSMOS_CONTEXT_MEMORY_CONTRACT_V602'],
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
check('message:status-version', harness.sourceMessages.some(item => item.type === 'WORK12_STATUS' && item.version === 610));
check('message:status-forty-seven-assets', harness.sourceMessages.some(item => item.core?.length === 47));
await harness.message({ type:'CLEAR_DIVINA_CACHES' });
check('message:clear-caches', !harness.stores.has(cacheName));
check('message:clear-confirmed', harness.sourceMessages.some(item => item.type === 'DIVINA_CACHES_CLEARED' && item.version === 610));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V610',
  work:'WORK13',
  macroStage:'10-of-10 / final-presence-service-worker-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  coreAssets:coreAssets.length,
  atomicAssetsChecked:coreAssets.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
