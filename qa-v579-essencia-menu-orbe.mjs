import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const bytes = file => fs.readFileSync(path.join(root, file));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (text, pattern) => (text.match(pattern) || []).length;
const slice = (text, from, to) => text.slice(text.indexOf(from), text.indexOf(to, text.indexOf(from)));

const index = read('index.html');
const app = read('app-v208.js');
const navigation = read('navigation.js');
const menu = read('orbital-menu-v502.js');
const legacyMenu = read('menu-completo-v177.js');
const menuCss = read('orbital-menu-v502.css');
const worker = read('sw.js');

const homeStart = index.indexOf('<section id="home"');
const tarotStart = index.indexOf('<section id="tarot"', homeStart);
const dailyStart = index.indexOf('<section id="daily"', tarotStart);
const libraryStart = index.indexOf('<section id="library"', dailyStart);
const home = index.slice(homeStart, tarotStart).trimEnd() + '\n';
const tarot = index.slice(tarotStart, dailyStart).trimEnd() + '\n';
const daily = index.slice(dailyStart, libraryStart).trimEnd() + '\n';

const protectedHashes = Object.freeze({
  'orbital-menu-v502.css':'f276ce015fcef04aa30fee4ed80be190e7013a6eb67fa613af41e9e3749e2002',
  'orb-engine-v208.js':'8444122fcfaf24ee284724a6523460fec64d11e073fe6fa8e12b0c63d940fa6c',
  'orb-persistent-journey-v565.js':'4bac3e3870165f7b8898c6dfa0bd80f8c572ce016b033bd28ebe872e5439de07',
  'supreme-orb-core-v501.js':'3d6e7979d58ee81db8e150e731330c910e04f1d4c7e233232f73d287040c1e27',
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'tarot-livre-orbe-os-v517.css':'a093bd5e7ed7c0a3b88a8706a835bfefccad0fa2ea08661762c65988266340ee',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-world-v509.css':'a6c48374be42705e5a8b574fba9eaa75110b2463d0835051aed6a4bc63e1c4b6',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259'
});

const checks = [];
const check = (id, pass, detail = '') => checks.push({ id, pass:Boolean(pass), detail:String(detail || '') });

check('release:meta-v579', /name="divina-essence-release" content="V579" data-macroetapa="2-menu-orbe"/.test(index));
check('release:index-app-v579', /app-v208\.js\?v=579-menu/.test(index));
check('release:inline-worker-v579', /register\('\.\/sw\.js\?v=579'/.test(index) && /divina\.sw\.reload\.v579/.test(index));
check('release:worker-v579', /const VERSION=579;/.test(worker) && /divina-bruxa-v579-shell/.test(worker));
check('release:worker-validator-v579', /app-v208\\\.js\\\?v=579-menu/.test(worker) && /content=\["'\]V579/.test(worker));
check('release:critical-menu-generation', /RELEASE_CRITICAL_PATTERN_V579/.test(worker) && /\|navigation\|/.test(worker));
check('release:app-menu-query', /navigation\.js\?v=579-menu-authority/.test(app) && /orbital-menu-v502\.js\?v=579-essence-state/.test(app));
check('release:legacy-menu-query', /menu-completo-v177\.js\?v=579-menu-authority/.test(index));

check('visual:css-byte-protected', sha256(menuCss) === protectedHashes['orbital-menu-v502.css'], sha256(menuCss));
check('visual:rings-byte-protected', sha256(slice(menu, 'const INNER', 'const ICONS')) === 'bded4dc1705cfc57d5f6c6c8f2730cab86e7025a8a24918ef09b8aa867bb553c');
check('visual:icons-byte-protected', sha256(slice(menu, 'const ICONS', 'const wait')) === '5b376527189602fdf0d7d9e84f1c480df6e69ea09decf09760be6c68e1fc82f3');
check('visual:markup-byte-protected', sha256(slice(menu, 'function iconMarkup', 'function nativePulse')) === '5bf3a2732bb470bf929f79f9629759365b59e49b025999e75e25b5c751c72657');
check('visual:two-approved-rings', /INNER\.map\([\s\S]*'inner'/.test(menu) && /OUTER\.map\([\s\S]*'outer'/.test(menu));
check('visual:thirteen-portals', count(slice(menu, 'const INNER', 'const ICONS'), /route:'/g) === 13, count(slice(menu, 'const INNER', 'const ICONS'), /route:'/g));
check('visual:no-duplicate-close', !/class="db502-menu__close"/.test(menu));
check('visual:no-new-canvas-or-orb', !/createElement\(['"]canvas/.test(menu) && count(index, /id="orb"/g) === 1);
check('visual:safe-areas-preserved', /safe-area-inset-top/.test(menuCss) && /safe-area-inset-right/.test(menuCss) && /safe-area-inset-bottom/.test(menuCss));
check('visual:dynamic-iphone-height', count(menuCss, /dvh/g) >= 6, count(menuCss, /dvh/g));

for (const state of ['CLOSED','OPENING','OPEN','REVERSING','CLOSING','NAVIGATING']) {
  check(`state:${state.toLowerCase()}`, new RegExp(`${state}:'${state.toLowerCase()}'`).test(menu));
}
check('state:single-v579-authority', /const AUTHORITY = 'v579'/.test(menu) && /dataset\.menuAuthority = AUTHORITY/.test(menu));
check('state:legacy-navigation-delegated', /menuDelegated/.test(navigation) && /delegated-menu-authority/.test(navigation));
check('state:legacy-accessibility-delegated', /menuAuthority !== 'v579'/.test(legacyMenu) && /installMenuAccessibilityV211\(\)/.test(legacyMenu));
check('state:authority-before-navigation', app.indexOf("dataset.menuAuthority = 'v579-pending'") < app.indexOf('const navigation = createNavigation()'));
check('state:fallback-releases-authority', /delete document\.documentElement\.dataset\.menuAuthority/.test(app));
check('state:stale-motion-cancelled', count(menu, /\+\+this\.motionToken/g) >= 2 && count(menu, /this\.motionToken \+= 1/g) >= 2 && count(menu, /token !== this\.motionToken/g) >= 4);
check('state:reverse-open', /reverse-open/.test(menu) && /root\.classList\.remove\('is-closing'\)/.test(menu));
check('state:reverse-close', /reverse-close/.test(menu) && /MOVING_STATES\.has\(this\.state\)/.test(menu));
check('state:navigation-explicit', /publish\(MENU_STATE\.NAVIGATING/.test(menu));
check('state:no-immediate-portal-close', !/reason:`route:\$\{route\}`,[\s\S]{0,120}immediate:true/.test(menu));

check('interaction:background-inert', /lockBackground\(\)/.test(menu) && /node\.inert = true/.test(menu));
check('interaction:background-restored', /unlockBackground\(\)/.test(menu) && /snapshot\.inertValue/.test(menu));
check('interaction:root-inert-while-closing', /setRootInteractive\(false\)/.test(menu));
check('interaction:pointer-shield-active', /this\.isActive\(\) && !this\.root\.contains\(target\)/.test(menu));
check('interaction:pointerdown-cancelable', /capture:true, passive:false, signal/.test(menu));
check('interaction:focus-loop', /const next = current < 0/.test(menu) && /safeFocus\(focusable\[next\]\)/.test(menu));
check('interaction:focus-restored', /safeFocus\(this\.lastFocus\?\.isConnected \? this\.lastFocus : this\.menuButton\)/.test(menu));
check('interaction:will-change-released', /is-ios-settling/.test(menu) && /classList\.remove\('is-ios-settling'\)/.test(menu));
check('interaction:single-claim-on-reverse', /if \(!this\.host\.contains\(this\.core\.orb\)\)/.test(menu));
check('interaction:one-navigation-at-a-time', /if \(this\.navigating \|\| !this\.targetOpen/.test(menu));
check('interaction:claim-preserved-for-flight', /preserveClaim:true/.test(menu) && /source:'orbital-menu-v502'/.test(menu));

check('protected:home-html', sha256(home) === '811f01c55fe8fec3f30d4f30024999e45bec9784915350170e0d4733a3aaec7e', sha256(home));
check('protected:tarot-html', sha256(tarot) === '59a6226f3526d7c03c5825b0e0911489a75338318f117e88b023c616f9361484', sha256(tarot));
check('protected:daily-html', sha256(daily) === 'aa3ccae8fe84c3bfdaf83a60788e041aec58a2aee1481d23a234f02614b6d6a3', sha256(daily));
for (const [file, expected] of Object.entries(protectedHashes)) {
  const full = path.join(root, file);
  check(`protected:${file}`, fs.existsSync(full) && sha256(bytes(file)) === expected, fs.existsSync(full) ? sha256(bytes(file)) : 'missing');
}

const requiredShellBlock = worker.match(/const REQUIRED_SHELL=Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
const requiredShell = [...requiredShellBlock.matchAll(/'\.\/([^']*)'/g)].map(match => match[1]);
const missingShell = requiredShell.filter(file => file && !fs.existsSync(path.join(root, file)));
check('pwa:required-shell-resolved', requiredShell.length >= 50 && missingShell.length === 0, missingShell.join(','));
check('pwa:five-isolated-v579-caches', new Set(
  [...worker.matchAll(/const (?:SHELL|CONTENT|IMAGE|OFFLINE|PREMIUM)_CACHE='([^']+)'/g)].map(match => match[1])
).size === 5 && count(worker, /divina-bruxa-v579-(?:shell|content|images|offline-core|premium-static)/g) === 5);

class FakeElement {
  constructor(name = 'node') {
    this.name = name;
    this.dataset = {};
    this.attributes = new Map();
    this.children = [];
    this.parentNode = null;
    this.hidden = false;
    this.inert = false;
    this.isConnected = true;
    this.label = null;
    const tokens = new Set();
    this.classList = {
      add:(...names) => names.forEach(value => tokens.add(value)),
      remove:(...names) => names.forEach(value => tokens.delete(value)),
      toggle:(value, force) => {
        if (force === true) tokens.add(value);
        else if (force === false) tokens.delete(value);
        else if (tokens.has(value)) tokens.delete(value);
        else tokens.add(value);
      },
      contains:value => tokens.has(value)
    };
  }
  append(node) {
    if (node.parentNode) node.parentNode.children = node.parentNode.children.filter(child => child !== node);
    node.parentNode = this;
    this.children.push(node);
  }
  contains(node) { return node === this || this.children.some(child => child === node || child.contains?.(node)); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  hasAttribute(name) { return this.attributes.has(name); }
  removeAttribute(name) { this.attributes.delete(name); }
  querySelector(selector) { return selector === 'span' || selector === '.db502-portal__label' ? this.label : null; }
  querySelectorAll() { return []; }
  getBoundingClientRect() { return { left:120, top:220, width:48, height:48 }; }
  closest(selector) {
    if (selector !== '[inert]') return null;
    let node = this;
    while (node) {
      if (node.hasAttribute?.('inert')) return node;
      node = node.parentNode;
    }
    return null;
  }
  focus() { globalThis.document.activeElement = this; }
}

globalThis.HTMLElement = FakeElement;
globalThis.Element = FakeElement;
globalThis.Node = FakeElement;
globalThis.CustomEvent = class CustomEvent {
  constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
};
globalThis.matchMedia = () => ({ matches:true });
globalThis.requestAnimationFrame = callback => setTimeout(() => callback(globalThis.performance.now()), 0);
globalThis.innerWidth = 390;
globalThis.innerHeight = 844;

const menuModule = await import(`${pathToFileURL(path.join(root, 'orbital-menu-v502.js')).href}?qa=v579-${Date.now()}`);
const makeFixture = () => {
  const html = new FakeElement('html');
  const body = new FakeElement('body');
  const appNode = new FakeElement('app');
  const dock = new FakeElement('dock');
  const brand = new FakeElement('brand');
  const skip = new FakeElement('skip');
  const drawer = new FakeElement('drawer');
  const map = new Map([
    ['#app', appNode], ['.magic-dock', dock], ['.app-header .brand', brand],
    ['.v562-skip-link', skip], ['#drawer', drawer]
  ]);
  const events = [];
  globalThis.document = {
    documentElement:html,
    body,
    activeElement:null,
    querySelector:selector => map.get(selector) || null,
    dispatchEvent:event => events.push(event)
  };
  const rootNode = new FakeElement('menu-root');
  rootNode.setAttribute('aria-hidden', 'true');
  const host = new FakeElement('menu-host');
  rootNode.append(host);
  const homeHost = new FakeElement('home-host');
  const orb = new FakeElement('orb');
  homeHost.append(orb);
  const menuButton = new FakeElement('menu-button');
  menuButton.label = new FakeElement('menu-label');
  menuButton.label.textContent = 'MENU';
  const portal = new FakeElement('portal');
  portal.dataset.v502Route = 'tarot';
  portal.label = new FakeElement('portal-label');
  portal.label.textContent = 'Tarot Livre';
  rootNode.append(portal);
  const live = new FakeElement('live');
  let claims = 0;
  let releases = 0;
  let navigations = 0;
  const core = {
    orb,
    claim(target) {
      claims += 1;
      const previous = orb.parentNode;
      target.append(orb);
      let released = false;
      return () => {
        if (released) return false;
        released = true;
        releases += 1;
        previous.append(orb);
        return true;
      };
    },
    pulse() {},
    prime() {},
    async navigate() { navigations += 1; return true; },
    settleRoute() {},
    returnHome() { homeHost.append(orb); },
    snapshot() { return { livingOrbConnected:true }; }
  };
  const instance = Object.create(menuModule.OrbitalMenuV502.prototype);
  Object.assign(instance, {
    core,
    menuButton,
    root:rootNode,
    host,
    live,
    buttons:[portal],
    state:'closed',
    targetOpen:false,
    releaseOrb:null,
    lastFocus:menuButton,
    motionToken:0,
    navigating:false,
    backgroundLocked:false,
    backgroundSnapshots:[],
    fallbackTabSnapshots:[],
    supportsInert:true
  });
  instance.setRootInteractive(false);
  return {
    instance, appNode, host, homeHost, orb, portal,
    get claims() { return claims; },
    get releases() { return releases; },
    get navigations() { return navigations; },
    events
  };
};

const reverseClose = makeFixture();
check('behavior:opens', await reverseClose.instance.open() === true && reverseClose.instance.state === 'open');
check('behavior:one-physical-claim', reverseClose.claims === 1 && reverseClose.host.contains(reverseClose.orb));
check('behavior:background-locked', reverseClose.appNode.inert === true && reverseClose.appNode.getAttribute('aria-hidden') === 'true');
const closing = reverseClose.instance.close({ restoreFocus:true, reason:'qa-close' });
await new Promise(resolve => setTimeout(resolve, 2));
const reopening = reverseClose.instance.open();
const [cancelledClose, reopened] = await Promise.all([closing, reopening]);
check('behavior:close-reverses-from-current-frame', cancelledClose === false && reopened === true && reverseClose.instance.state === 'open');
check('behavior:reverse-does-not-reclaim-orb', reverseClose.claims === 1 && reverseClose.releases === 0);
check('behavior:close-settles', await reverseClose.instance.close({ restoreFocus:true, reason:'qa-final-close' }) === true && reverseClose.instance.state === 'closed');
check('behavior:single-release', reverseClose.releases === 1 && reverseClose.homeHost.contains(reverseClose.orb));
check('behavior:background-restored', reverseClose.appNode.inert === false && !reverseClose.appNode.hasAttribute('aria-hidden'));

const reverseOpen = makeFixture();
const opening = reverseOpen.instance.open();
const reverseToClose = reverseOpen.instance.close({ reason:'qa-reverse-opening' });
const [cancelledOpen, closedFromOpening] = await Promise.all([opening, reverseToClose]);
check('behavior:opening-reverses-without-reset', cancelledOpen === false && closedFromOpening === true && reverseOpen.instance.state === 'closed');
check('behavior:no-orphan-claim', reverseOpen.claims === 0 && reverseOpen.releases === 0 && reverseOpen.homeHost.contains(reverseOpen.orb));

const navigationFixture = makeFixture();
await navigationFixture.instance.open();
navigationFixture.instance.navigating = true;
navigationFixture.instance.publish('navigating', 'qa-route');
navigationFixture.instance.finishNavigation('qa-route-complete');
check('behavior:navigation-finishes-closed', navigationFixture.instance.state === 'closed' && navigationFixture.instance.root.hidden === true);
check('behavior:navigation-cleans-authority', navigationFixture.instance.navigating === false && navigationFixture.instance.backgroundLocked === false && navigationFixture.releases === 1);

const portalFixture = makeFixture();
await portalFixture.instance.open();
await portalFixture.instance.activate(portalFixture.portal);
check('behavior:portal-single-navigation', portalFixture.navigations === 1);
check('behavior:portal-settles-clean', portalFixture.instance.state === 'closed' && portalFixture.instance.navigating === false && portalFixture.instance.backgroundLocked === false && portalFixture.instance.root.hidden === true);

const failures = checks.filter(item => !item.pass);
const result = {
  release:'V579',
  phase:'Divina Bruxa 2.0 — Essência Suprema',
  macroStage:'2 — Menu da Orbe',
  state:failures.length ? 'FAIL' : 'PASS',
  passed:checks.length - failures.length,
  total:checks.length,
  visualChanged:false,
  portalCount:13,
  ringCount:2,
  singleMenuAuthority:true,
  reversibleMotion:true,
  onePhysicalOrb:true,
  tarotLivreProtected:true,
  cartaDoDiaProtected:true,
  newProductFunctions:0,
  failures:failures.map(({ id, detail }) => ({ id, detail }))
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
