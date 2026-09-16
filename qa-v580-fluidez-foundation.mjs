/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · FUNDAÇÃO V580
   Prova a governança antirrepetição e congela Tarot Livre/Carta do Dia. */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || path.dirname(fileURLToPath(import.meta.url)));
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const failures = [];
let passed = 0;
const check = (condition, id, detail = '') => condition ? passed += 1 : failures.push({ id, detail });

const required = [
  'experience-message-governor-v580.js',
  'app-v208.js',
  'index.html',
  'orb-persistent-journey-v565.js',
  'whit-presence-v307.js',
  'whit-core-supreme-v527.js',
  'whit-signature-v311.js',
  'sw.js',
  'tarot-livre-orbe-os-v517.js',
  'daily-world-v509.js'
];
required.forEach(file => check(fs.existsSync(path.join(root,file)),`file:${file}`));

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key,value) { this.values.set(key,String(value)); }
}

const { ExperienceMessageGovernorV580 } = await import(
  pathToFileURL(path.join(root,'experience-message-governor-v580.js')).href + '?qa=v580'
);

let now = 100000;
const session = new MemoryStorage();
const persistent = new MemoryStorage();
const documentElement = { dataset:{}, getAttribute:() => null };
const governor = new ExperienceMessageGovernorV580({
  session,
  persistent,
  eventTarget:null,
  documentElement,
  clock:() => now
});

const first = governor.request({
  id:'route:tarot',
  text:'O Tarot Livre está aberto.',
  route:'tarot',
  channel:'orb-voice',
  semanticKey:'route-arrival:tarot',
  cooldownKey:'route-arrival:tarot',
  cooldownMs:90000,
  duration:2000
});
check(first.accepted && Boolean(first.token),'governor:first-message-accepted');
check(governor.release(first.token,'qa'),'governor:token-release');

now += 1000;
const cooldown = governor.request({
  id:'route:tarot',
  text:'A mesa está pronta.',
  route:'tarot',
  channel:'whit-presence',
  semanticKey:'route-arrival:tarot',
  cooldownKey:'route-arrival:tarot',
  cooldownMs:90000
});
check(!cooldown.accepted && cooldown.reason === 'cooldown','governor:cross-channel-route-cooldown');

const foreignRouteBubble = governor.request({
  id:'whit-route:library',
  text:'Outra orientação automática.',
  route:'library',
  channel:'whit-presence',
  category:'route-guidance',
  semanticKey:'route-arrival:library',
  cooldownKey:'route-arrival:library'
});
check(!foreignRouteBubble.accepted && foreignRouteBubble.reason === 'route-owner','governor:orb-owns-route-message');

now += 100000;
const literal = governor.request({
  id:'another-id',
  text:'O Tarot Livre está aberto.',
  route:'tarot',
  channel:'whit-supreme',
  semanticKey:'different-semantic',
  cooldownKey:'different-cooldown',
  cooldownMs:0
});
check(!literal.accepted && literal.reason === 'literal-repeat','governor:literal-repeat-blocked');

const variantGovernor = new ExperienceMessageGovernorV580({
  session:new MemoryStorage(),
  persistent:new MemoryStorage(),
  eventTarget:null,
  documentElement:{dataset:{},getAttribute:() => null},
  clock:() => now
});
const variantA = variantGovernor.request({
  id:'variants', variants:['Primeira presença.','Segunda presença.'], cooldownMs:0, duration:1
});
variantGovernor.release(variantA.token,'qa');
now += 2;
const variantB = variantGovernor.request({
  id:'variants', variants:['Primeira presença.','Segunda presença.'], cooldownMs:0, duration:1
});
check(variantA.accepted && variantB.accepted && variantA.text !== variantB.text,'governor:variant-rotation');
variantGovernor.release(variantB.token,'qa');

now += 2;
const semanticA = variantGovernor.request({
  id:'semantic-a', text:'Mensagem A.', semanticKey:'same-meaning', cooldownMs:0, duration:1
});
variantGovernor.release(semanticA.token,'qa');
now += 2;
const semanticB = variantGovernor.request({
  id:'semantic-b', text:'Mensagem B.', semanticKey:'same-meaning', cooldownMs:0, duration:1
});
check(!semanticB.accepted && semanticB.reason === 'semantic-repeat','governor:semantic-repeat-blocked');

now += 2;
const low = variantGovernor.request({
  id:'low', text:'Baixa prioridade.', channel:'ambient-a', priority:10, explicit:true, duration:1000
});
const blocked = variantGovernor.request({
  id:'lower', text:'Outra presença.', channel:'ambient-b', priority:9, duration:1000
});
const high = variantGovernor.request({
  id:'high', text:'Mensagem funcional.', channel:'system', priority:90, explicit:true, duration:1000
});
check(low.accepted && !blocked.accepted && blocked.reason === 'another-bubble-active','governor:one-bubble-at-a-time');
check(high.accepted && high.preempted?.channel === 'ambient-a','governor:priority-preemption');
variantGovernor.release(high.token,'qa');

documentElement.dataset.orbNavigationState = 'active';
const duringTravel = governor.request({
  id:'travel', text:'Não deve aparecer.', channel:'ambient', cooldownMs:0
});
check(!duringTravel.accepted && duringTravel.reason === 'navigation-silence','governor:silence-during-travel');
delete documentElement.dataset.orbNavigationState;

const explicit = governor.request({
  id:'consent', text:'Permissão confirmada.', channel:'whit-supreme', priority:100,
  semanticKey:'consent:tarot', cooldownKey:'consent:tarot',
  explicit:true, cooldownMs:0, duration:1
});
check(explicit.accepted,'governor:explicit-functional-message-preserved');
governor.release(explicit.token,'qa');
const consentCollision = governor.request({
  id:'consent-copy', text:'Limite confirmado.', channel:'whit-presence', priority:100,
  semanticKey:'consent:tarot', cooldownKey:'consent:tarot',
  explicit:true, cooldownMs:0, duration:1
});
check(!consentCollision.accepted && consentCollision.reason === 'event-collision','governor:explicit-event-fanout-deduplicated');

const stored = `${session.getItem('divina.message.governor.v580.session') || ''}${persistent.getItem('divina.message.governor.v580.memory') || ''}`;
check(!stored.includes('O Tarot Livre está aberto.'),'privacy:no-message-text-in-storage');
check(governor.status().sessionHistory <= 12,'governor:session-ring-limit');
check(governor.status().oneBubbleAtATime === true,'governor:single-bubble-contract');
check(governor.routeMessageOwner === 'orb-voice','governor:orb-route-authority');

const app = read('app-v208.js');
const index = read('index.html');
const journey = read('orb-persistent-journey-v565.js');
const whitPresence = read('whit-presence-v307.js');
const whitSupreme = read('whit-core-supreme-v527.js');
const whitSignature = read('whit-signature-v311.js');
const sw = read('sw.js');

check(app.includes("./experience-message-governor-v580.js?v=580-foundation"),'wiring:governor-import');
check(app.includes('createWhitPresenceV307({') && app.includes('messageGovernor'),'wiring:whit-presence-governed');
check(app.includes('createOrbPersistentJourneyV565({'),'wiring:journey-governed');
check(app.includes('createWhitCoreSupremeV527({'),'wiring:whit-supreme-governed');
check(journey.includes('cooldownKey:`route-arrival:${id}`'),'journey:shared-route-cooldown');
check(journey.includes('voiceSuppressions:this.voiceSuppressions'),'journey:suppression-observable');
check(!journey.includes("showVoice('Estou aqui.'") && !journey.includes("showVoice('Estou ouvindo.'"),'journey:no-mechanical-touch-loop');
check(!journey.includes("id:'orb-touch-response'") && journey.includes("if (id === 'home')"),'journey:visual-touch-and-silent-home');
check(journey.includes('this.suspendHeavyEffects();') && journey.includes('this.resumeHeavyEffects();'),'journey:heavy-effects-paused-in-flight');
check(journey.includes("setAttribute(FLIGHT_ATTR,'active')"),'journey:global-flight-signal');
check(whitPresence.includes('duplicateEvent') && whitPresence.includes('now - this.lastEnterAt < 1400'),'whit:duplicate-route-events-coalesced');
check(whitPresence.includes("channel:'whit-presence'") && whitSupreme.includes("channel:'whit-supreme'"),'whit:shared-governance');
check(whitPresence.includes("orb-owns-route-arrival") && whitSupreme.includes('orbOwnsArrival'),'whit:no-redundant-route-timers');
check(whitSignature.includes("category:'route-guidance'") && whitSignature.includes('semanticKey:`route-arrival:${route}`'),'whit:signature-route-governed');
check(app.includes("./whit-signature-v311.js?v=580-foundation"),'wiring:signature-cache-busted');
check(index.includes('app-v208.js?v=580') && index.includes('sw.js?v=580'),'cache:index-v580');
check(index.includes('divina.sw.reload.v580') && index.includes('version:580'),'cache:inline-release-v580');
check(sw.includes('const VERSION=580;') && sw.includes('divina-bruxa-v580-shell'),'cache:worker-v580');
check(sw.includes("'./experience-message-governor-v580.js'"),'cache:governor-in-atomic-shell');
check(sw.includes('RELEASE_CRITICAL_PATTERN_V580') && sw.includes('experience-message-governor-v580'),'cache:governor-network-first');
check(sw.includes('whit-signature-v311'),'cache:signature-network-first');
check((index.match(/id=["']orb["']/g) || []).length === 1,'orb:one-canonical-id');

const frozen = Object.freeze({
  'tarot-livre-orbe-os-v517.js':'c64083581462d35ee013d7973047be1a45cba3f64899b6485221785604f74b51',
  'tarot-session.js':'085c5c9c934d607d1e6adcd4433f54edc27cb08e14352f1cfc33b04466f91577',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'daily-world-v509.js':'ab928eae10cb89a24e97698877a8a7c58e0786e2391a2d0efe79c01c1a8d0f15',
  'daily-policy-v303.js':'cfe357cc5c5f24c5468c704dd4beb036bb444537d5a0051a072878744f95a259',
  'daily-policy.js':'bac539d0940987becc9806c026c8cba71c5b8b0ef00d7df6f7d3587c952d0a4e',
  'navigation.js':'fb33453fb9d10b10b3860fbb9f4586bd6c2f9c4e70e5482fc2e4063b44081694',
  'supreme-orb-core-v501.js':'3d6e7979d58ee81db8e150e731330c910e04f1d4c7e233232f73d287040c1e27',
  'orb-universal-presence-v526.js':'9df8d1131ed769392d921077e1931c9d780969d623e0ce30c7b1ca044c3a532b',
  'orbital-menu-v502.js':'ae4aefa12f231b15a86604b63b66de9a1975d815ba9a1e10aebab131c9d29259'
});
Object.entries(frozen).forEach(([file,expected]) => check(sha(file) === expected,`protected:${file}`));

const sessionModule = await import(pathToFileURL(path.join(root,'tarot-session.js')).href + '?qa=v580');
const { CARDS } = await import(pathToFileURL(path.join(root,'tarot-data.js')).href + '?qa=v580');
let tarotState = sessionModule.createTarotState({
  randomInt:max => max - 1,
  now:() => 1,
  sessionId:'qa-v580-protected-tarot',
  auditSeed:'qa-v580-protected-tarot-seed'
});
const revealed = [];
for (let index = 0; index < 78; index += 1) {
  const result = sessionModule.drawNextCard(tarotState,{ now:() => index + 2 });
  tarotState = result.state;
  revealed.push(result.cardId);
}
check(revealed.length === 78 && new Set(revealed).size === 78,'tarot:78-without-repetition');
check(revealed.every(id => CARDS[id]?.orientation === 'normal'),'tarot:all-cards-direct');
check(tarotState.completed && tarotState.waiting.length === 0,'tarot:complete-table-preserved');

const total = passed + failures.length;
console.log(JSON.stringify({
  release:'V580',
  base:'V577',
  macroStage:'Fluidez Suprema / 1 de 10 / Fundação',
  state:failures.length ? 'FAIL' : 'PASS',
  passed,
  failed:failures.length,
  total,
  protected:{ tarotLivre:true, cartaDoDia:true, navigation:true, canonicalOrb:true },
  messageGovernor:governor.status(),
  failures
},null,2));
if (failures.length) process.exitCode = 1;
