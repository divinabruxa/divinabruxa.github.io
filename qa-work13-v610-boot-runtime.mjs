/* DIVINA BRUXA — WORK13 V614 · QA DO BOOT RECUPERÁVEL */
import fs from 'node:fs';
import vm from 'node:vm';

const checks = [];
const check = (id, condition, detail = '') => checks.push({ id, pass:Boolean(condition), detail:condition ? '' : String(detail) });
const indexSource = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const bootScript = [...indexSource.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .map(match => match[2])
  .find(body => body.includes('divina:work12-boot-release'));

function harness() {
  const timers = new Map();
  const listeners = new Map();
  const events = [];
  const registrations = [];
  let timerId = 0;
  const classList = () => {
    const values = new Set();
    return {
      add:(...items) => items.forEach(item => values.add(item)),
      remove:(...items) => items.forEach(item => values.delete(item)),
      contains:item => values.has(item)
    };
  };
  const style = () => {
    const values = new Map();
    return {
      setProperty:(name, value) => values.set(name, value),
      removeProperty:name => values.delete(name)
    };
  };
  const node = () => ({
    hidden:false,disabled:false,textContent:'',dataset:{},classList:classList(),style:style(),
    attributes:new Map(),listeners:new Map(),
    setAttribute(name, value) { this.attributes.set(name, String(value)); },
    removeAttribute(name) { this.attributes.delete(name); },
    addEventListener(type, handler) { this.listeners.set(type, handler); }
  });
  const root = node();
  const message = node();
  const whisper = node();
  const recovery = node();
  const portal = node();
  const app = node();
  const home = node();
  const body = node();
  portal.querySelector = selector => ({
    '.db-orb-loader__message':message,
    '.db-orb-loader__whisper':whisper,
    '.db-orb-loader__recovery':recovery
  })[selector] || null;
  const document = {
    documentElement:root,
    body,
    getElementById:id => ({ orbLoadingPortal:portal, app, home })[id] || null,
    dispatchEvent:event => { events.push(event); return true; }
  };
  class PlainCustomEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.detail = options.detail;
      this.bubbles = Boolean(options.bubbles);
    }
  }
  const context = {
    document,
    CustomEvent:PlainCustomEvent,
    console,
    navigator:{
      serviceWorker:{
        addEventListener(){},
        register:async (url, options) => {
          registrations.push({ url, options });
          return { scope:'https://divina.test/', update:async () => {} };
        }
      }
    },
    setTimeout:(handler, delay = 0) => {
      const id = ++timerId;
      timers.set(id, { handler, delay });
      return id;
    },
    clearTimeout:id => timers.delete(id),
    addEventListener:(type, handler) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(handler);
    },
    removeEventListener:(type, handler) => {
      listeners.set(type, (listeners.get(type) || []).filter(item => item !== handler));
    }
  };
  context.window = context;
  vm.runInContext(bootScript, vm.createContext(context), { filename:'work13-inline-boot-v613.js' });
  const runDelay = delay => {
    for (const [id, timer] of [...timers]) {
      if (timer.delay !== delay) continue;
      timers.delete(id);
      timer.handler();
    }
  };
  const fire = type => {
    for (const handler of listeners.get(type) || []) handler({ type });
  };
  const click = () => recovery.listeners.get('click')?.({ preventDefault(){}, stopImmediatePropagation(){} });
  return { root,portal,home,body,timers,events,registrations,runDelay,fire,click };
}

check('boot:script-found', Boolean(bootScript));
check('boot:work13-meta-v614', indexSource.includes('name="divina-work13" content="V614"'));
check('boot:work12-meta-v600', indexSource.includes('name="divina-work12" content="V600"'));
check('boot:app-v614', indexSource.includes('app-v208.js?v=614-tarot-livre-camara-violeta'));
check('boot:worker-v614', indexSource.includes("register('./sw.js?v=614-tarot-livre-camara-violeta'"));
check('boot:v614-bootstrap', indexSource.includes("__divinaSWBootstrap='v614-tarot-livre-camara-violeta-inline'"));
check('boot:v610-presence-style', indexSource.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence'));
check('boot:v609-style-preserved', indexSource.includes('living-media-skins-v609.css?v=609-work13-media-skins'));
check('boot:v608-style-preserved', indexSource.includes('living-commerce-path-v608.css?v=608-work13-commerce-clarity'));
check('boot:v607-style-preserved', indexSource.includes('living-wisdom-path-v607.css?v=607-work13-living-wisdom'));
check('boot:v606-no-style', !indexSource.includes('whit-silence-timing-v606.css'));
check('boot:v605-style-preserved', indexSource.includes('cosmic-spread-reading-v605.css?v=605-work13-spread-reading'));
check('boot:v604-style-preserved', indexSource.includes('cosmic-daily-reading-v604.css?v=604-work13-daily-reading'));
check('boot:v603-style-preserved', indexSource.includes('cosmos-reality-resonance-v603.css?v=603-work13-resonance'));
check('boot:final-style-v599', indexSource.includes('work12-final-continuity-v598.css?v=599-live-audit'));
for (const id of [
  'divinaLivingMediaSkinsV609','divinaLivingCommercePathV608','divinaLivingWisdomPathV607',
  'divinaCosmicSpreadReadingV605','divinaCosmicDailyReadingV604',
  'divinaCosmosRealityResonanceV603','divinaWork12FinalContinuityV598',
  'divinaCosmosEntryIntentionV610','divinaCosmosWorldPresenceV610'
]) check(`boot:one-style:${id}`, [...indexSource.matchAll(new RegExp(`id="${id}"`, 'g'))].length === 1);
check('boot:one-orb', [...indexSource.matchAll(/id="orb"/g)].length === 1);
check('boot:one-canvas', [...indexSource.matchAll(/id="orbCanvas"/g)].length === 1);

const watchdog = harness();
check('boot:watchdog-armed', [...watchdog.timers.values()].some(timer => timer.delay === 4500));
watchdog.runDelay(4500);
watchdog.runDelay(180);
check('boot:watchdog-reveals-home', watchdog.home.classList.contains('active') && watchdog.body.dataset.screen === 'home');
check('boot:watchdog-hides-portal', watchdog.portal.hidden && watchdog.portal.attributes.get('aria-hidden') === 'true');
check('boot:watchdog-work12-v600', watchdog.root.dataset.work12Boot === 'released-v600' && watchdog.root.dataset.work12BootReason === 'boot-watchdog');
check('boot:watchdog-work13-orchestra-v610', watchdog.root.dataset.work13Boot === 'released-v610');
check('boot:watchdog-event-work12', watchdog.events.some(event => event.type === 'divina:work12-boot-release' && event.detail.version === 600));
check('boot:recovery-source-v600', watchdog.events.some(event => event.type === 'divina:loading-bypass' && event.detail.source === 'work12-one-style-v600'));

const manual = harness();
manual.click();
check('boot:manual-opens', manual.home.classList.contains('active') && manual.root.dataset.work12BootReason === 'manual');
check('boot:manual-work13-orchestra', manual.root.dataset.work13Boot === 'released-v610');

const healthy = harness();
healthy.root.dataset.appShell = 'v180';
healthy.fire('divina:boot-ready');
healthy.runDelay(4500);
check('boot:healthy-work12-ready', healthy.root.dataset.work12Boot === 'ready-v600');
check('boot:healthy-work13-orchestra-ready', healthy.root.dataset.work13Boot === 'ready-v610');
check('boot:healthy-never-bypassed', !healthy.home.classList.contains('active'));
healthy.fire('load');
await Promise.resolve();
check('boot:registers-v614', healthy.registrations.some(item => item.url === './sw.js?v=614-tarot-livre-camara-violeta'));
check('boot:no-cache-registration', healthy.registrations.some(item => item.options?.updateViaCache === 'none'));

const failures = checks.filter(item => !item.pass);
console.log(JSON.stringify({
  release:'V614',
  work:'WORK13',
  macroStage:'WORK13 / tarot-livre-camara-violeta-boot-runtime',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  failed:failures.length,
  total:checks.length,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
}, null, 2));

if (failures.length) process.exitCode = 1;
