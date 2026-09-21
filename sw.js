/* DIVINA BRUXA — WORK13 · ALMA DAS TIRAGENS · V610
   O WORK12 V600, as etapas V602–V610 e as duas primeiras almas permanecem
   protegidos. A instalacao so assume o portal quando a mesma Orbe, o menu vivo,
   o rito diario e as quinze realidades completas pertencem ao mesmo corte.
   Rede primeiro para código; cache apenas como chão seguro, nunca como prisão.
*/

const VERSION = 610;
const CACHE_PREFIX = 'divina-bruxa-';
const CACHE_NAME = 'divina-bruxa-work13-v610-tiragens-soul';
const CORE = Object.freeze([
  './index.html',
  './app-v208.js?v=610-work13-final-presence',
  './tarot-livre-soul-v610.js?v=610-work13-tarot-soul',
  './tarot-livre-soul-v610.css?v=610-work13-tarot-soul',
  './carta-do-dia-soul-v610.js?v=610-work13-daily-soul',
  './carta-do-dia-soul-v610.css?v=610-work13-daily-soul',
  './tiragens-soul-v610.js?v=610-work13-spreads-soul',
  './tiragens-soul-v610.css?v=610-work13-spreads-soul',
  './cosmos-entry-intention-v610.js?v=610-work13-final-presence',
  './cosmos-entry-intention-v610.css?v=610-work13-final-presence',
  './cosmos-world-presence-v610.js?v=610-work13-final-presence',
  './cosmos-world-presence-v610.css?v=610-work13-final-presence',
  './cosmos-context-memory-v602.js?v=602-work13-context',
  './cosmos-reality-resonance-v603.js?v=603-work13-resonance',
  './cosmos-reality-resonance-v603.css?v=603-work13-resonance',
  './cosmic-daily-reading-v604.js?v=604-work13-daily-reading',
  './cosmic-daily-reading-v604.css?v=604-work13-daily-reading',
  './cosmic-spread-reading-v605.js?v=605-work13-spread-reading',
  './cosmic-spread-reading-v605.css?v=605-work13-spread-reading',
  './whit-silence-timing-v606.js?v=606-work13-whit-timing',
  './living-wisdom-path-v607.js?v=607-work13-living-wisdom',
  './living-wisdom-path-v607.css?v=607-work13-living-wisdom',
  './living-commerce-path-v608.js?v=608-work13-commerce-clarity',
  './living-commerce-path-v608.css?v=608-work13-commerce-clarity',
  './living-media-skins-v609.js?v=609-work13-media-skins',
  './living-media-skins-v609.css?v=609-work13-media-skins',
  './cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra',
  './work12-final-continuity-v598.js?v=598-work12-final',
  './work12-final-continuity-v598.css?v=599-live-audit',
  './experience-intelligence-v597.js?v=597-work12-intelligence',
  './experience-intelligence-v597.css?v=597-work12-intelligence',
  './reality-chambers-v596.js?v=596-work12-chambers',
  './reality-chambers-v596.css?v=596-work12-chambers',
  './school-world-v306.js?v=596-work12-chambers',
  './journal-world-v317.js?v=596-work12-chambers',
  './reading-ritual-core-v595.js?v=595-work12-ritual',
  './reading-ritual-core-v595.css?v=595-work12-ritual',
  './daily-world-v509.js?v=595-work12-ritual',
  './whit-living-presence-v594.js?v=594-work12-whit',
  './orbital-menu-v502.js?v=593-work12-menu',
  './orbital-menu-v502.css?v=593-work12-menu',
  './navigation.js?v=592-work12-navigation',
  './work12-foundation-v589.js?v=592-work12-navigation',
  './page-loader-v1.js?v=592-work12-navigation',
  './living-universe-core-v524.js?v=590-work12-universe',
  './supreme-orb-core-v501.js?v=591-work12-orb',
  './orb-engine-v208.js?v=591-work12-orb',
  './orb-persistent-journey-v565.js?v=583-coordinate-travel',
  './whit-orb-soul-bridge-v581.js?v=592-work12-navigation',
  './divina-shell-v180.css?v=180',
  './cosmic-visual-atlas-v1.js?v=590-work12-bridge'
]);

const sameOrigin = request => new URL(request.url).origin === self.location.origin;
const freshRequest = request => new Request(request, { cache:'no-cache' });
const isCode = url => /\.(?:html?|js|mjs|css|json|webmanifest)$/i.test(url.pathname);

const fetchCore = async path => {
  const response = await fetch(new Request(path, { cache:'no-store' }));
  if (!response?.ok) throw new Error(`work12-core-${response?.status || 'network'}:${path}`);
  return response;
};

const validateCore = async responses => {
  const index = await responses.get('./index.html')?.clone().text();
  const app = await responses.get('./app-v208.js?v=610-work13-final-presence')?.clone().text();
  const tarotLivreSoul = await responses.get('./tarot-livre-soul-v610.js?v=610-work13-tarot-soul')?.clone().text();
  const tarotLivreSoulStyles = await responses.get('./tarot-livre-soul-v610.css?v=610-work13-tarot-soul')?.clone().text();
  const cartaDoDiaSoul = await responses.get('./carta-do-dia-soul-v610.js?v=610-work13-daily-soul')?.clone().text();
  const cartaDoDiaSoulStyles = await responses.get('./carta-do-dia-soul-v610.css?v=610-work13-daily-soul')?.clone().text();
  const tiragensSoul = await responses.get('./tiragens-soul-v610.js?v=610-work13-spreads-soul')?.clone().text();
  const tiragensSoulStyles = await responses.get('./tiragens-soul-v610.css?v=610-work13-spreads-soul')?.clone().text();
  const entryIntention = await responses.get('./cosmos-entry-intention-v610.js?v=610-work13-final-presence')?.clone().text();
  const entryStyles = await responses.get('./cosmos-entry-intention-v610.css?v=610-work13-final-presence')?.clone().text();
  const worldPresence = await responses.get('./cosmos-world-presence-v610.js?v=610-work13-final-presence')?.clone().text();
  const worldStyles = await responses.get('./cosmos-world-presence-v610.css?v=610-work13-final-presence')?.clone().text();
  const contextMemory = await responses.get('./cosmos-context-memory-v602.js?v=602-work13-context')?.clone().text();
  const realityResonance = await responses.get('./cosmos-reality-resonance-v603.js?v=603-work13-resonance')?.clone().text();
  const resonanceStyles = await responses.get('./cosmos-reality-resonance-v603.css?v=603-work13-resonance')?.clone().text();
  const dailyReading = await responses.get('./cosmic-daily-reading-v604.js?v=604-work13-daily-reading')?.clone().text();
  const dailyReadingStyles = await responses.get('./cosmic-daily-reading-v604.css?v=604-work13-daily-reading')?.clone().text();
  const spreadReading = await responses.get('./cosmic-spread-reading-v605.js?v=605-work13-spread-reading')?.clone().text();
  const spreadReadingStyles = await responses.get('./cosmic-spread-reading-v605.css?v=605-work13-spread-reading')?.clone().text();
  const whitTiming = await responses.get('./whit-silence-timing-v606.js?v=606-work13-whit-timing')?.clone().text();
  const livingWisdom = await responses.get('./living-wisdom-path-v607.js?v=607-work13-living-wisdom')?.clone().text();
  const livingWisdomStyles = await responses.get('./living-wisdom-path-v607.css?v=607-work13-living-wisdom')?.clone().text();
  const livingCommerce = await responses.get('./living-commerce-path-v608.js?v=608-work13-commerce-clarity')?.clone().text();
  const livingCommerceStyles = await responses.get('./living-commerce-path-v608.css?v=608-work13-commerce-clarity')?.clone().text();
  const livingMediaSkins = await responses.get('./living-media-skins-v609.js?v=609-work13-media-skins')?.clone().text();
  const livingMediaSkinsStyles = await responses.get('./living-media-skins-v609.css?v=609-work13-media-skins')?.clone().text();
  const finalOrchestra = await responses.get('./cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra')?.clone().text();
  const finalContinuity = await responses.get('./work12-final-continuity-v598.js?v=598-work12-final')?.clone().text();
  const finalStyles = await responses.get('./work12-final-continuity-v598.css?v=599-live-audit')?.clone().text();
  const intelligence = await responses.get('./experience-intelligence-v597.js?v=597-work12-intelligence')?.clone().text();
  const intelligenceStyles = await responses.get('./experience-intelligence-v597.css?v=597-work12-intelligence')?.clone().text();
  const chambers = await responses.get('./reality-chambers-v596.js?v=596-work12-chambers')?.clone().text();
  const chamberStyles = await responses.get('./reality-chambers-v596.css?v=596-work12-chambers')?.clone().text();
  const school = await responses.get('./school-world-v306.js?v=596-work12-chambers')?.clone().text();
  const journal = await responses.get('./journal-world-v317.js?v=596-work12-chambers')?.clone().text();
  const ritual = await responses.get('./reading-ritual-core-v595.js?v=595-work12-ritual')?.clone().text();
  const ritualStyles = await responses.get('./reading-ritual-core-v595.css?v=595-work12-ritual')?.clone().text();
  const daily = await responses.get('./daily-world-v509.js?v=595-work12-ritual')?.clone().text();
  const whitPresence = await responses.get('./whit-living-presence-v594.js?v=594-work12-whit')?.clone().text();
  const menu = await responses.get('./orbital-menu-v502.js?v=593-work12-menu')?.clone().text();
  const menuStyles = await responses.get('./orbital-menu-v502.css?v=593-work12-menu')?.clone().text();
  const navigation = await responses.get('./navigation.js?v=592-work12-navigation')?.clone().text();
  const foundation = await responses.get('./work12-foundation-v589.js?v=592-work12-navigation')?.clone().text();
  const pageLoader = await responses.get('./page-loader-v1.js?v=592-work12-navigation')?.clone().text();
  const universe = await responses.get('./living-universe-core-v524.js?v=590-work12-universe')?.clone().text();
  const orb = await responses.get('./supreme-orb-core-v501.js?v=591-work12-orb')?.clone().text();
  const renderer = await responses.get('./orb-engine-v208.js?v=591-work12-orb')?.clone().text();
  const journey = await responses.get('./orb-persistent-journey-v565.js?v=583-coordinate-travel')?.clone().text();
  const soul = await responses.get('./whit-orb-soul-bridge-v581.js?v=592-work12-navigation')?.clone().text();
  if (!index?.includes('name="divina-work12" content="V600"')
    || !index.includes('name="divina-live-audit" content="V600"')
    || !index.includes('name="divina-work13" content="V610"')) {
    throw new Error('work13-index-version-mismatch');
  }
  if (!index.includes('app-v208.js?v=610-work13-final-presence')
    || !index.includes('name="divina-work13-correction" content="V610-LAPIDACAO-FINAL"')
    || !index.includes('id="divinaCosmosEntryIntentionV610"')
    || !index.includes('cosmos-entry-intention-v610.css?v=610-work13-final-presence')
    || !index.includes('id="divinaCosmosWorldPresenceV610"')
    || !index.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence')
    || !index.includes('id="cosmosEntryIntent"')
    || !index.includes('<span>Entrá</span>')
    || !index.includes('<section id="skins" class="screen skins-celestial-screen"')
    || !index.includes('<div id="skinsApp"></div>')
    || !index.includes('living-media-skins-v609.css?v=609-work13-media-skins')
    || !index.includes('id="divinaLivingMediaSkinsV609"')
    || !index.includes('living-commerce-path-v608.css?v=608-work13-commerce-clarity')
    || !index.includes('id="divinaLivingCommercePathV608"')
    || !index.includes('living-wisdom-path-v607.css?v=607-work13-living-wisdom')
    || !index.includes('id="divinaLivingWisdomPathV607"')
    || !index.includes('cosmic-spread-reading-v605.css?v=605-work13-spread-reading')
    || !index.includes('id="divinaCosmicSpreadReadingV605"')
    || !index.includes('cosmic-daily-reading-v604.css?v=604-work13-daily-reading')
    || !index.includes('id="divinaCosmicDailyReadingV604"')
    || !index.includes('cosmos-reality-resonance-v603.css?v=603-work13-resonance')
    || !index.includes('id="divinaCosmosRealityResonanceV603"')
    || !index.includes('work12-final-continuity-v598.css?v=599-live-audit')
    || !index.includes('id="divinaWork12FinalContinuityV598"')
    || index.includes('id="divinaWork12FinalContinuityV599"')
    || !index.includes('experience-intelligence-v597.css?v=597-work12-intelligence')
    || !index.includes('reality-chambers-v596.css?v=596-work12-chambers')
    || !index.includes('reading-ritual-core-v595.css?v=595-work12-ritual')) {
    throw new Error('work12-index-chambers-mismatch');
  }
  if (!app?.includes("./navigation.js?v=592-work12-navigation")) throw new Error('work12-app-router-mismatch');
  if (!app.includes("./work12-foundation-v589.js?v=592-work12-navigation")) throw new Error('work12-app-foundation-mismatch');
  if (!app.includes("./living-universe-core-v524.js?v=590-work12-universe")) throw new Error('work12-app-universe-mismatch');
  if (!app.includes("./supreme-orb-core-v501.js?v=591-work12-orb") || !app.includes('divinaWork12Macro3V591')) {
    throw new Error('work12-app-orb-mismatch');
  }
  if (!app.includes('divinaWork12Macro4V592')) throw new Error('work12-app-navigation-mismatch');
  if (!app.includes('divinaWork12Macro5V593') || !app.includes("orbital-menu-v502.js?v=593-work12-menu")) {
    throw new Error('work12-app-menu-mismatch');
  }
  if (!app.includes('divinaWork12Macro6V594') || !app.includes("whit-living-presence-v594.js?v=594-work12-whit")) {
    throw new Error('work12-app-whit-mismatch');
  }
  if (!app.includes('divinaWork12Macro7V595') || !app.includes("reading-ritual-core-v595.js?v=595-work12-ritual")) {
    throw new Error('work12-app-reading-ritual-mismatch');
  }
  if (!app.includes('divinaWork12Macro8V596') || !app.includes("reality-chambers-v596.js?v=596-work12-chambers")) {
    throw new Error('work12-app-reality-chambers-mismatch');
  }
  if (!app.includes('divinaWork12Macro9V597')
    || !app.includes("experience-intelligence-v597.js?v=597-work12-intelligence")) {
    throw new Error('work12-app-experience-intelligence-mismatch');
  }
  if (!app.includes('divinaWork12Macro10V598')
    || !app.includes("work12-final-continuity-v598.js?v=598-work12-final")
    || !app.includes("stage:'fluidez-suprema-final'")) {
    throw new Error('work12-app-final-continuity-mismatch');
  }
  if (!app.includes("cosmos-context-memory-v602.js?v=602-work13-context")
    || !app.includes('createCosmosContextMemoryV602()')
    || !app.includes('divinaWork13Macro2V602')
    || !app.includes("stage:'memoria-de-contexto-global'")) {
    throw new Error('work13-app-context-memory-mismatch');
  }
  if (!app.includes("cosmos-reality-resonance-v603.js?v=603-work13-resonance")
    || !app.includes('createCosmosRealityResonanceV603({')
    || !app.includes('divinaWork13Macro3V603')
    || !app.includes("stage:'universo-reage-a-cada-realidade'")) {
    throw new Error('work13-app-reality-resonance-mismatch');
  }
  if (!app.includes("cosmic-daily-reading-v604.js?v=604-work13-daily-reading")
    || !app.includes('createCosmicDailyReadingV604({')
    || !app.includes('divinaWork13Macro4V604')
    || !app.includes("stage:'leitura-cosmica-em-camadas-carta-do-dia'")) {
    throw new Error('work13-app-daily-reading-mismatch');
  }
  if (!app.includes("cosmic-spread-reading-v605.js?v=605-work13-spread-reading")
    || !app.includes('createCosmicSpreadReadingV605()')
    || !app.includes('divinaWork13Macro5V605')
    || !app.includes("stage:'cartas-conversam-sintese-em-camadas'")) {
    throw new Error('work13-app-spread-reading-mismatch');
  }
  if (!app.includes("whit-silence-timing-v606.js?v=606-work13-whit-timing")
    || !app.includes('createWhitSilenceTimingV606({')
    || !app.includes('divinaWork13Macro6V606')
    || !app.includes("stage:'whit-viva-silencio-utilidade-timing'")) {
    throw new Error('work13-app-whit-timing-mismatch');
  }
  if (!app.includes("living-wisdom-path-v607.js?v=607-work13-living-wisdom")
    || !app.includes('createLivingWisdomPathV607({')
    || !app.includes('divinaWork13Macro7V607')
    || !app.includes("stage:'biblioteca-escola-diario-vivos'")) {
    throw new Error('work13-app-living-wisdom-mismatch');
  }
  if (!app.includes("living-commerce-path-v608.js?v=608-work13-commerce-clarity")
    || !app.includes('createLivingCommercePathV608({')
    || !app.includes('divinaWork13Macro8V608')
    || !app.includes("stage:'consultas-loja-premium-conta-com-clareza'")) {
    throw new Error('work13-app-commerce-clarity-mismatch');
  }
  if (!app.includes("living-media-skins-v609.js?v=609-work13-media-skins")
    || !app.includes('createLivingMediaSkinsV609({')
    || !app.includes('divinaWork13Macro9V609')
    || !app.includes("stage:'musica-videos-skins-interface-recua'")) {
    throw new Error('work13-app-media-skins-mismatch');
  }
  if (!app.includes("cosmos-final-orchestra-v610.js?v=610-work13-final-orchestra")
    || !app.includes('createCosmosFinalOrchestraV610({')
    || !app.includes('divinaWork13Macro10V610')
    || !app.includes("stage:'orquestra-final-tudo-respira-junto'")
    || !app.includes('work13EndsHere:true')
    || !app.includes('work14:false')) {
    throw new Error('work13-app-final-orchestra-mismatch');
  }
  if (!app.includes("cosmos-entry-intention-v610.js?v=610-work13-final-presence")
    || !app.includes('createCosmosEntryIntentionV610({')
    || !app.includes('entryIntention:cosmosEntryIntention')
    || !app.includes("invitation:'Entrá'")) {
    throw new Error('work13-entry-app-mismatch');
  }
  if (!app.includes("cosmos-world-presence-v610.js?v=610-work13-final-presence")
    || !app.includes('createCosmosWorldPresenceV610({')
    || !app.includes('worldPresence:cosmosWorldPresence')
    || !app.includes("correction:'lapidacao-final-presenca-das-realidades'")) {
    throw new Error('work13-world-presence-app-mismatch');
  }
  if (!app.includes("tarot-livre-soul-v610.js?v=610-work13-tarot-soul")
    || !app.includes('createTarotLivreSoulV610({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.tarotLivreSoul = tarotLivreSoul')
    || !app.includes("stage:'primeira-realidade-alma-propria'")) {
    throw new Error('work13-tarot-livre-soul-app-mismatch');
  }
  if (!tarotLivreSoul?.includes('TAROT_LIVRE_SOUL_CONTRACT_V610')
    || !tarotLivreSoul.includes("sequence:Object.freeze(['orb','card','silence','freedom'])")
    || !tarotLivreSoul.includes('cards:78')
    || !tarotLivreSoul.includes('rows:13')
    || !tarotLivreSoul.includes('columns:6')
    || !tarotLivreSoul.includes('reversedCards:false')
    || !tarotLivreSoul.includes('repetitionBeforeReset:false')
    || !tarotLivreSoul.includes('automaticMeanings:false')
    || !tarotLivreSoul.includes('cardSelectionChanges:0')
    || !tarotLivreSoul.includes('reusesCanonicalOrb:true')
    || !tarotLivreSoul.includes('permanentAnimationLoops:0')
    || !tarotLivreSoul.includes('mutationObservers:0')
    || !tarotLivreSoul.includes('work14:false')) {
    throw new Error('work13-tarot-livre-soul-contract-missing');
  }
  if (!tarotLivreSoulStyles?.includes('[data-tarot-soul="v610"]')
    || !tarotLivreSoulStyles.includes('[data-tarot-soul-phase="answering"]')
    || !tarotLivreSoulStyles.includes('[data-tarot-soul-phase="silence"]')
    || !tarotLivreSoulStyles.includes('#realTableViewport')
    || !tarotLivreSoulStyles.includes('@media(max-width:430px)')
    || !tarotLivreSoulStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(tarotLivreSoulStyles)) {
    throw new Error('work13-tarot-livre-soul-styles-missing');
  }
  if (!app.includes("carta-do-dia-soul-v610.js?v=610-work13-daily-soul")
    || !app.includes('createCartaDoDiaSoulV610({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.cartaDoDiaSoul = cartaDoDiaSoul')
    || !app.includes("stage:'segunda-realidade-alma-propria'")) {
    throw new Error('work13-carta-do-dia-soul-app-mismatch');
  }
  if (!cartaDoDiaSoul?.includes('CARTA_DO_DIA_SOUL_CONTRACT_V610')
    || !cartaDoDiaSoul.includes("sequence:Object.freeze(['orb','card','silence','one-sentence-essence','depth-on-explicit-request'])")
    || !cartaDoDiaSoul.includes('cardsPerBrasiliaDay:1')
    || !cartaDoDiaSoul.includes("timeZone:'America/Sao_Paulo'")
    || !cartaDoDiaSoul.includes('manualReveal:true')
    || !cartaDoDiaSoul.includes('automaticReveal:false')
    || !cartaDoDiaSoul.includes('reversedCards:false')
    || !cartaDoDiaSoul.includes('maximumEssenceSentences:1')
    || !cartaDoDiaSoul.includes('depthRequiresExplicitGesture:true')
    || !cartaDoDiaSoul.includes('cardSelectionChanges:0')
    || !cartaDoDiaSoul.includes('reusesCanonicalOrb:true')
    || !cartaDoDiaSoul.includes('permanentAnimationLoops:0')
    || !cartaDoDiaSoul.includes('mutationObservers:0')
    || !cartaDoDiaSoul.includes('work14:false')) {
    throw new Error('work13-carta-do-dia-soul-contract-missing');
  }
  if (!cartaDoDiaSoulStyles?.includes('[data-daily-soul="v610"]')
    || !cartaDoDiaSoulStyles.includes('[data-daily-soul-phase="answering"]')
    || !cartaDoDiaSoulStyles.includes('[data-daily-soul-phase="silence"]')
    || !cartaDoDiaSoulStyles.includes('[data-reading-phase="depth"]')
    || !cartaDoDiaSoulStyles.includes('.db604-daily-essence')
    || !cartaDoDiaSoulStyles.includes('@media(max-width:430px)')
    || !cartaDoDiaSoulStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(cartaDoDiaSoulStyles)) {
    throw new Error('work13-carta-do-dia-soul-styles-missing');
  }
  if (!app.includes("tiragens-soul-v610.js?v=610-work13-spreads-soul")
    || !app.includes('createTiragensSoulV610({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.tiragensSoul = tiragensSoul')
    || !app.includes("stage:'terceira-realidade-alma-propria'")) {
    throw new Error('work13-tiragens-soul-app-mismatch');
  }
  if (!tiragensSoul?.includes('TIRAGENS_SOUL_CONTRACT_V610')
    || !tiragensSoul.includes("sequence:Object.freeze(['choice','orb','revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])")
    || !tiragensSoul.includes('methodsPreserved:15')
    || !tiragensSoul.includes('freeMethodsPreserved:4')
    || !tiragensSoul.includes('premiumMethodsPreserved:11')
    || !tiragensSoul.includes('celticCrossPositionsPreserved:10')
    || !tiragensSoul.includes('royalTableCardsPreserved:78')
    || !tiragensSoul.includes("royalTableGeometryPreserved:'13x6'")
    || !tiragensSoul.includes('maximumConversationVoices:3')
    || !tiragensSoul.includes('maximumSynthesisSentences:1')
    || !tiragensSoul.includes('depthRequiresExplicitGesture:true')
    || !tiragensSoul.includes('cardSelectionChanges:0')
    || !tiragensSoul.includes('premiumAuthorityChanges:0')
    || !tiragensSoul.includes('reusesCanonicalOrb:true')
    || !tiragensSoul.includes('privateContentReads:0')
    || !tiragensSoul.includes('cardIdentityReads:0')
    || !tiragensSoul.includes('permanentAnimationLoops:0')
    || !tiragensSoul.includes('mutationObservers:0')
    || !tiragensSoul.includes('deferredTimers:0')
    || !tiragensSoul.includes('work14:false')) {
    throw new Error('work13-tiragens-soul-contract-missing');
  }
  if (!tiragensSoulStyles?.includes('[data-spreads-soul="v610"]')
    || !tiragensSoulStyles.includes('[data-spreads-soul-phase="answering"]')
    || !tiragensSoulStyles.includes('[data-spreads-soul-phase="silence"]')
    || !tiragensSoulStyles.includes('[data-cosmic-spread-synthesis="v605"]')
    || !tiragensSoulStyles.includes('#spreadGrid')
    || !tiragensSoulStyles.includes('#spreadResult #orb')
    || !tiragensSoulStyles.includes('@media(max-width:430px)')
    || !tiragensSoulStyles.includes('@media(orientation:landscape)')
    || !tiragensSoulStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(tiragensSoulStyles)) {
    throw new Error('work13-tiragens-soul-styles-missing');
  }
  if (!entryIntention?.includes('COSMOS_ENTRY_INTENTION_CONTRACT_V610')
    || !entryIntention.includes("invitation:'Entrá'")
    || !entryIntention.includes('entryIntentions:1')
    || !entryIntention.includes('reusesCanonicalOrb:true')
    || !entryIntention.includes('reusesLivingMenuV593:true')
    || !entryIntention.includes('globalOrbMenuCycle:true')
    || !entryIntention.includes('everyRealityCanCallUniverse:true')
    || !entryIntention.includes('realityOwnedOrbActionsPreserved:true')
    || !entryIntention.includes("target?.closest?.('#tableOrb')")
    || !entryIntention.includes("target?.closest?.('[data-daily-orb-host]')")
    || !entryIntention.includes("target?.closest?.('#spreadResult')")
    || !entryIntention.includes("this.openUniverse('orb-world')")
    || !entryIntention.includes('publicRealityNames:15')
    || !entryIntention.includes('automaticNavigation:false')
    || !entryIntention.includes('newCanvases:0')
    || !entryIntention.includes('work14:false')) {
    throw new Error('work13-entry-contract-missing');
  }
  if (!entryStyles?.includes('.cosmos-entry-intent')
    || !entryStyles.includes('.db502-portal__verb')
    || !entryStyles.includes('@media(max-width:430px)')
    || !entryStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(entryStyles)) {
    throw new Error('work13-entry-styles-missing');
  }
  if (!worldPresence?.includes('COSMOS_WORLD_PRESENCE_CONTRACT_V610')
    || !worldPresence.includes('publicWorlds:PUBLIC_WORLD_ROUTES_V610.length')
    || !worldPresence.includes('allMenuDestinationsHaveFullScreens:true')
    || !worldPresence.includes('reusesCoordinatedNavigationV592:true')
    || !worldPresence.includes('reusesLivingMenuV593:true')
    || !worldPresence.includes('touchesOrbEngine:false')
    || !worldPresence.includes('touchesUniverseEngine:false')
    || !worldPresence.includes('automaticNavigation:false')
    || !worldPresence.includes('permanentAnimationLoops:0')
    || !worldPresence.includes('work14:false')) {
    throw new Error('work13-world-presence-contract-missing');
  }
  if (!worldStyles?.includes('[data-work13-world]')
    || !worldStyles.includes('.db502-portal.is-touching')
    || !worldStyles.includes('#menuBtn.menu-button i')
    || !worldStyles.includes('display:block!important')
    || !worldStyles.includes('#skins[data-work13-world]')
    || !worldStyles.includes('@media(max-width:430px)')
    || !worldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(worldStyles)) {
    throw new Error('work13-world-presence-styles-missing');
  }
  if (!contextMemory?.includes('COSMOS_CONTEXT_MEMORY_CONTRACT_V602')
    || !contextMemory.includes("model:'local-session-route-metadata-only'")
    || !contextMemory.includes('maximumSuggestedSteps:1')
    || !contextMemory.includes('automaticNavigation:false')
    || !contextMemory.includes('automaticWhitSpeech:false')
    || !contextMemory.includes('privateContentReads:0')
    || !contextMemory.includes('formValueReads:0')
    || !contextMemory.includes('cardIdentityReads:0')
    || !contextMemory.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-context-memory-contract-missing');
  }
  if (!realityResonance?.includes('COSMOS_REALITY_RESONANCE_CONTRACT_V603')
    || !realityResonance.includes("inputModel:'public-route-and-public-phase-only'")
    || !realityResonance.includes('reusesExistingUniverse:true')
    || !realityResonance.includes('reusesExistingVeil:true')
    || !realityResonance.includes('automaticNavigation:false')
    || !realityResonance.includes('automaticWhitSpeech:false')
    || !realityResonance.includes('privateContentReads:0')
    || !realityResonance.includes('newCanvases:0')
    || !realityResonance.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-reality-resonance-contract-missing');
  }
  if (!resonanceStyles?.includes('#divinaLivingUniverseV524 .db524-universe__veil')
    || !resonanceStyles.includes('--db603-focus-x')
    || !resonanceStyles.includes('var(--db-skin-accent')
    || !resonanceStyles.includes('@media (prefers-reduced-motion: reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(resonanceStyles)) {
    throw new Error('work13-reality-resonance-styles-missing');
  }
  if (!dailyReading?.includes('COSMIC_DAILY_READING_CONTRACT_V604')
    || !dailyReading.includes("sequence:Object.freeze(['card','silence','one-sentence-essence','depth-on-explicit-request'])")
    || !dailyReading.includes("essenceSource:'approved-essence-first-sentence'")
    || !dailyReading.includes('maximumEssenceSentences:1')
    || !dailyReading.includes('depthControlReused:true')
    || !dailyReading.includes('depthRequiresExplicitGesture:true')
    || !dailyReading.includes('changesCardSelection:false')
    || !dailyReading.includes('automaticNavigation:false')
    || !dailyReading.includes('automaticWhitSpeech:false')
    || !dailyReading.includes('privateContentReads:0')
    || !dailyReading.includes('intentionReads:0')
    || !dailyReading.includes('cardIdentityReads:0')
    || !dailyReading.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-daily-reading-contract-missing');
  }
  if (!dailyReadingStyles?.includes('[data-cosmic-reading="v604"]')
    || !dailyReadingStyles.includes('[data-reading-phase="silence"]')
    || !dailyReadingStyles.includes('[data-reading-phase="essence"]')
    || !dailyReadingStyles.includes('[data-reading-phase="depth"]')
    || !dailyReadingStyles.includes('@media(max-width:430px)')
    || !dailyReadingStyles.includes('@media(prefers-reduced-motion:reduce)')) {
    throw new Error('work13-daily-reading-styles-missing');
  }
  if (!spreadReading?.includes('COSMIC_SPREAD_READING_CONTRACT_V605')
    || !spreadReading.includes("route:'spreads'")
    || !spreadReading.includes("sequence:Object.freeze(['revealed-card','silence','one-sentence-essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])")
    || !spreadReading.includes('maximumConversationVoices:3')
    || !spreadReading.includes('maximumVisibleSynthesisSentences:1')
    || !spreadReading.includes('depthRequiresExplicitGesture:true')
    || !spreadReading.includes('methodsPreserved:15')
    || !spreadReading.includes('royalTableCardsPreserved:78')
    || !spreadReading.includes('tarotFreeAutomaticMeanings:false')
    || !spreadReading.includes('changesCardSelection:false')
    || !spreadReading.includes('automaticWhitSpeech:false')
    || !spreadReading.includes('privateContentReads:0')
    || !spreadReading.includes('questionReads:0')
    || !spreadReading.includes('unrevealedCardReads:0')
    || !spreadReading.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-spread-reading-contract-missing');
  }
  if (!spreadReadingStyles?.includes('[data-cosmic-spread-reading="v605"]')
    || !spreadReadingStyles.includes('[data-cosmic-spread-phase="silence"]')
    || !spreadReadingStyles.includes('[data-cosmic-spread-synthesis="v605"]')
    || !spreadReadingStyles.includes('.db605-depth-call')
    || !spreadReadingStyles.includes('@media(max-width:430px)')
    || !spreadReadingStyles.includes('@media(prefers-reduced-motion:reduce)')) {
    throw new Error('work13-spread-reading-styles-missing');
  }
  if (!whitTiming?.includes('WHIT_SILENCE_TIMING_CONTRACT_V606')
    || !whitTiming.includes("defaultResponse:'silence'")
    || !whitTiming.includes("visibleSpeechPolicy:'explicit-invitation-or-consent-only'")
    || !whitTiming.includes("contextualOfferAuthority:'V594-qualified-pause-unchanged'")
    || !whitTiming.includes('automaticRevealSpeech:false')
    || !whitTiming.includes('automaticCompletionSpeech:false')
    || !whitTiming.includes('automaticSkinSpeech:false')
    || !whitTiming.includes('contextMemoryTriggersWhit:false')
    || !whitTiming.includes('privateContentReads:0')
    || !whitTiming.includes('domNodesCreated:0')
    || !whitTiming.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-whit-timing-contract-missing');
  }
  if (!livingWisdom?.includes('LIVING_WISDOM_PATH_CONTRACT_V607')
    || !livingWisdom.includes("sequence:Object.freeze(['one-discovery','one-lesson','direct-writing'])")
    || !livingWisdom.includes("libraryEntry:'one-discovery-through-canonical-orb'")
    || !livingWisdom.includes("schoolEntry:'one-natural-next-lesson'")
    || !livingWisdom.includes("journalEntry:'direct-writing-after-explicit-depth'")
    || !livingWisdom.includes('libraryCardsPreserved:78')
    || !livingWisdom.includes('schoolModulesPreserved:17')
    || !livingWisdom.includes('schoolLessonsPreserved:124')
    || !livingWisdom.includes('maximumContextualContinuations:1')
    || !livingWisdom.includes('automaticNavigation:false')
    || !livingWisdom.includes('automaticWhitSpeech:false')
    || !livingWisdom.includes('journalBodyReads:0')
    || !livingWisdom.includes('schoolNoteReads:0')
    || !livingWisdom.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-living-wisdom-contract-missing');
  }
  if (!livingWisdomStyles?.includes('[data-living-wisdom="v607"]')
    || !livingWisdomStyles.includes('[data-v607-library-mode="focus"]')
    || !livingWisdomStyles.includes('[data-v607-school-mode="lesson"]')
    || !livingWisdomStyles.includes('[data-v607-journal-mode="write"]')
    || !livingWisdomStyles.includes('@media(max-width:430px)')
    || !livingWisdomStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(livingWisdomStyles)) {
    throw new Error('work13-living-wisdom-styles-missing');
  }
  if (!livingCommerce?.includes('LIVING_COMMERCE_PATH_CONTRACT_V608')
    || !livingCommerce.includes("sequence:Object.freeze([\n    'one-clear-entry','explicit-choice','existing-engine','one-natural-next-step'")
    || !livingCommerce.includes("engine:'V558'")
    || !livingCommerce.includes('priceCents:Object.freeze([25000,20000,15000,5000])')
    || !livingCommerce.includes("associateTag:'orbedasrealid-20'")
    || !livingCommerce.includes('productsPreserved:21')
    || !livingCommerce.includes('premiumLifetimeCents:19990')
    || !livingCommerce.includes('aiMonthlyCents:8990')
    || !livingCommerce.includes('aiCreditsPerCycle:400')
    || !livingCommerce.includes("existingGuideReused:'AccountWorldV319'")
    || !livingCommerce.includes('maximumPrimaryActionsAtEntry:1')
    || !livingCommerce.includes('realBilling:false')
    || !livingCommerce.includes('frontendEntitlementGrants:false')
    || !livingCommerce.includes('automaticNavigation:false')
    || !livingCommerce.includes('automaticWhitSpeech:false')
    || !livingCommerce.includes('privateContentReads:0')
    || !livingCommerce.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-commerce-clarity-contract-missing');
  }
  if (!livingCommerceStyles?.includes('[data-living-commerce-path="v608"]')
    || !livingCommerceStyles.includes('[data-v608-commerce-mode="guide"]')
    || !livingCommerceStyles.includes('[data-v608-premium-section="premium"]')
    || !livingCommerceStyles.includes('#accountWorldV319')
    || !livingCommerceStyles.includes('@media(max-width:430px)')
    || !livingCommerceStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(livingCommerceStyles)) {
    throw new Error('work13-commerce-clarity-styles-missing');
  }
  if (!livingMediaSkins?.includes('LIVING_MEDIA_SKINS_CONTRACT_V609')
    || !livingMediaSkins.includes("sequence:Object.freeze([\n    'work-first','explicit-depth','single-player-on-demand','interface-recedes'")
    || !livingMediaSkins.includes("engine:'V559'")
    || !livingMediaSkins.includes("title:'Sobre as Estrelas'")
    || !livingMediaSkins.includes("title:'Z'")
    || !livingMediaSkins.includes('verifiedTracks:18')
    || !livingMediaSkins.includes('publishedEpisodesAtRelease:0')
    || !livingMediaSkins.includes('inventedEpisodes:0')
    || !livingMediaSkins.includes("engine:'V201'")
    || !livingMediaSkins.includes('count:30')
    || !livingMediaSkins.includes('globalApplyWithoutReload:true')
    || !livingMediaSkins.includes('activePlayersMaximum:1')
    || !livingMediaSkins.includes('automaticPlayback:false')
    || !livingMediaSkins.includes('automaticNavigation:false')
    || !livingMediaSkins.includes('automaticWhitSpeech:false')
    || !livingMediaSkins.includes('privateContentReads:0')
    || !livingMediaSkins.includes('newPlayers:0')
    || !livingMediaSkins.includes('permanentAnimationLoops:0')) {
    throw new Error('work13-media-skins-contract-missing');
  }
  if (!livingMediaSkinsStyles?.includes('[data-living-media-skins="v609"]')
    || !livingMediaSkinsStyles.includes('[data-v609-phase="focus"]')
    || !livingMediaSkinsStyles.includes('[data-v609-phase="detail"]')
    || !livingMediaSkinsStyles.includes('[data-v609-phase="immersive"]')
    || !livingMediaSkinsStyles.includes('[data-v609-phase="gallery"]')
    || !livingMediaSkinsStyles.includes('#skinsApp>#skinsWorldV318')
    || !livingMediaSkinsStyles.includes('@media(max-width:430px)')
    || !livingMediaSkinsStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(livingMediaSkinsStyles)) {
    throw new Error('work13-media-skins-styles-missing');
  }
  if (!finalOrchestra?.includes('COSMOS_FINAL_ORCHESTRA_CONTRACT_V610')
    || !finalOrchestra.includes("closure:'WORK13-completes-inside-WORK13'")
    || !finalOrchestra.includes('livingLayers:Object.freeze([602,603,604,605,606,607,608,609])')
    || !finalOrchestra.includes('expectedWorlds:17')
    || !finalOrchestra.includes('maximumActivePlayers:1')
    || !finalOrchestra.includes('maximumPendingFrames:1')
    || !finalOrchestra.includes('visualChanges:0')
    || !finalOrchestra.includes('newStylesheets:0')
    || !finalOrchestra.includes('automaticPlayback:false')
    || !finalOrchestra.includes('automaticNavigation:false')
    || !finalOrchestra.includes('automaticWhitSpeech:false')
    || !finalOrchestra.includes('privateContentReads:0')
    || !finalOrchestra.includes('physicalDeviceClaim:false')
    || !finalOrchestra.includes('work14:false')) {
    throw new Error('work13-final-orchestra-contract-missing');
  }
  if (!finalContinuity?.includes('FINAL_CONTINUITY_CONTRACT_V598')
    || !finalContinuity.includes("homeSingleTap:'call-intentions'")
    || !finalContinuity.includes("homeDoubleTap:'tarot-free'")
    || !finalContinuity.includes('maximumVisibleIntentions:2')
    || !finalContinuity.includes('automaticWhitSpeech:false')
    || !finalContinuity.includes('permanentAnimationLoops:0')) {
    throw new Error('work12-final-continuity-contract-missing');
  }
  if (!finalStyles?.includes('body[data-screen="home"] .app-header')
    || !finalStyles.includes('[data-work12-final-route="home"] body .app-header')
    || !finalStyles.includes(':not([data-work12-final-route="home"]) body:not([data-screen="home"])')
    || !finalStyles.includes('#menuBtn.menu-button span::after')
    || !finalStyles.includes('content:"SILÊNCIO"')
    || !finalStyles.includes('body .magic-dock')
    || !finalStyles.includes('#tarot[data-tarot-world="orbe-os-v517"] .tl517__header')
    || !finalStyles.includes('@media(max-width:430px)')) {
    throw new Error('work12-final-continuity-styles-missing');
  }
  if (!intelligence?.includes('EXPERIENCE_INTELLIGENCE_CONTRACT_V597')
    || !intelligence.includes('local-deterministic-context-coordinator')
    || !intelligence.includes('automaticWhitSpeech:false')
    || !intelligence.includes('privateContentReads:0')
    || !intelligence.includes("this.setBudget('essential', 'movement'")) {
    throw new Error('work12-experience-intelligence-contract-missing');
  }
  if (!intelligenceStyles?.includes('[data-experience-budget="essential"]')
    || !intelligenceStyles.includes('[data-experience-state="focus"]')
    || !intelligenceStyles.includes('@media(max-width:430px)')) {
    throw new Error('work12-experience-intelligence-styles-missing');
  }
  if (!chambers?.includes('REALITY_CHAMBERS_CONTRACT_V596')
    || !chambers.includes("states:Object.freeze(['threshold','awakening','present','engaged','travel'])")
    || !chambers.includes('maximumVisibleIntentions:2')
    || !chambers.includes('automaticWhitSpeech:false')) {
    throw new Error('work12-reality-chambers-contract-missing');
  }
  if (!chamberStyles?.includes('[data-db596-chamber-state="threshold"]')
    || !chamberStyles.includes('.db596-school-paths')
    || !chamberStyles.includes('.db596-store-return')
    || !chamberStyles.includes('scroll-snap-type:x mandatory')) {
    throw new Error('work12-reality-chambers-styles-missing');
  }
  if (!school?.includes("document.documentElement.dataset.realityChambers==='v596'")
    || !journal?.includes("document.documentElement.dataset.realityChambers === 'v596'")) {
    throw new Error('work12-reality-chambers-orb-authority-missing');
  }
  if (!ritual?.includes('READING_RITUAL_CONTRACT_V595')
    || !ritual.includes("sequence:Object.freeze(['symbol','silence','essence','depth-on-request'])")
    || !ritual.includes('automaticWhitSpeech:false')
    || !ritual.includes('oneDeferredTimer:true')) {
    throw new Error('work12-reading-ritual-contract-missing');
  }
  if (!ritualStyles?.includes('.db595-reading-intention')
    || !ritualStyles.includes('[data-reading-phase="silence"]')
    || !ritualStyles.includes('[data-reading-phase="depth"]')) {
    throw new Error('work12-reading-ritual-styles-missing');
  }
  if (!daily?.includes("readingRitualAuthority = 'work12-v595'")
    || !daily.includes("source:'daily-explicit-ritual'")
    || daily.includes("phrase:'Só existe uma carta para hoje")) {
    throw new Error('work12-daily-ritual-contract-missing');
  }
  if (!whitPresence?.includes('WHIT_LIVING_PRESENCE_CONTRACT_V594')
    || !whitPresence.includes('ordinaryTouchSpeech:false')
    || !whitPresence.includes("residence:'canonical-orb'")) {
    throw new Error('work12-whit-contract-missing');
  }
  if (!menu?.includes('const VERSION = 593;') || !menu.includes('maximumVisibleIntentions:2') || !menu.includes('progressiveReveal:true')) {
    throw new Error('work12-menu-contract-missing');
  }
  if (!menuStyles?.includes('db593IntentionBreath') || !menuStyles.includes('.db502-menu.has-intentions .db502-portal.is-offered')) {
    throw new Error('work12-menu-styles-contract-missing');
  }
  if (!navigation?.includes('const WORK12_HISTORY_RELEASE = 592;') || !navigation.includes("source:'history'")) {
    throw new Error('work12-router-contract-missing');
  }
  if (!foundation?.includes('WORK12_CONSTITUTION_V592') || !foundation.includes("navigationAuthority:this.orbNavigateProxy ? 'work12-v592'")) {
    throw new Error('work12-foundation-contract-missing');
  }
  if (!pageLoader?.includes('globalThis.divinaWork12V592') || !pageLoader.includes("source:'route-retry'")) {
    throw new Error('work12-page-loader-contract-missing');
  }
  if (!pageLoader.includes("daily-world-v509.js?v=595-work12-ritual")) {
    throw new Error('work12-page-loader-daily-ritual-mismatch');
  }
  if (!pageLoader.includes("school-world-v306.js?v=596-work12-chambers")
    || !pageLoader.includes("journal-world-v317.js?v=596-work12-chambers")) {
    throw new Error('work12-page-loader-chambers-mismatch');
  }
  if (!universe?.includes('const RELEASE = 590;') || !universe.includes('essentialUniverseDuringTravel:true')) {
    throw new Error('work12-universe-contract-missing');
  }
  if (!orb?.includes('const WORK12_RELEASE = 591;') || !orb.includes('auditPersistence(reason')) {
    throw new Error('work12-orb-identity-contract-missing');
  }
  if (!renderer?.includes('const ORB_RENDERER_RELEASE = 591;') || !renderer.includes('sharedMotionClock:true')) {
    throw new Error('work12-orb-renderer-contract-missing');
  }
  if (!journey?.includes('travelerCopies:0') || !journey.includes('physicalOrbTransport:true')) {
    throw new Error('work12-orb-journey-contract-missing');
  }
  if (!soul?.includes('const VERSION = 591;') || !soul.includes("'divina:work12-state'") || !soul.includes("591|592")) {
    throw new Error('work12-orb-soul-contract-missing');
  }
  return true;
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const responses = new Map();
    for (const path of CORE) responses.set(path, await fetchCore(path));
    await validateCore(responses);
    const cache = await caches.open(CACHE_NAME);
    for (const [path,response] of responses) await cache.put(path,response.clone());
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    for (const client of clients) {
      try {
        client.postMessage({ type:'DIVINA_WORK12_FOUNDATION_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_NAVIGATION_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_UNIVERSE_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_ORB_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_MENU_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_WHIT_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_RITUAL_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_CHAMBERS_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_INTELLIGENCE_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK12_FINAL_ACTIVE', version:VERSION });
        client.postMessage({ type:'DIVINA_WORK13_CONTEXT_ACTIVE', version:VERSION, contextVersion:602, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_RESONANCE_ACTIVE', version:VERSION, resonanceVersion:603, contextVersion:602, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_DAILY_READING_ACTIVE', version:VERSION, dailyReadingVersion:604, ritualVersion:595, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_SPREAD_READING_ACTIVE', version:VERSION, spreadReadingVersion:605, dailyReadingVersion:604, spreadMethods:15, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_WHIT_TIMING_ACTIVE', version:VERSION, whitTimingVersion:606, livingPresenceVersion:594, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_LIVING_WISDOM_ACTIVE', version:VERSION, livingWisdomVersion:607, whitTimingVersion:606, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_COMMERCE_CLARITY_ACTIVE', version:VERSION, commerceClarityVersion:608, livingWisdomVersion:607, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_MEDIA_SKINS_ACTIVE', version:VERSION, mediaSkinsVersion:609, commerceClarityVersion:608, base:600 });
        client.postMessage({ type:'DIVINA_WORK13_FINAL_ORCHESTRA_ACTIVE', version:VERSION, finalOrchestraVersion:610, mediaSkinsVersion:609, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_ENTRY_ACTIVE', version:VERSION, correction:'entrada-da-orbe', base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_FINAL_PRESENCE_ACTIVE', version:VERSION, correction:'lapidacao-final-presenca-das-realidades', publicWorlds:15, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_GLOBAL_MENU_ACTIVE', version:VERSION, correction:'menu-global-ciclo-vivo', publicWorlds:15, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_TAROT_SOUL_ACTIVE', version:VERSION, reality:'tarot', cards:78, reversed:false, meanings:false, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_DAILY_SOUL_ACTIVE', version:VERSION, reality:'daily', cardsPerBrasiliaDay:1, timeZone:'America/Sao_Paulo', reversed:false, oneSentenceEssence:true, depthExplicit:true, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_SPREADS_SOUL_ACTIVE', version:VERSION, reality:'spreads', methods:15, freeMethods:4, premiumMethods:11, celticCrossPositions:10, royalTableCards:78, oneSentenceSynthesis:true, depthExplicit:true, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_RELEASE_READY', version:VERSION });
      } catch {}
    }
  })());
});

const cacheSuccessful = async (cacheKey, response) => {
  if (!response?.ok || response.type === 'opaque') return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(cacheKey,response.clone()).catch(() => {});
  return response;
};

const networkFirst = async (request, fallbackKey = request) => {
  try {
    const response = await fetch(freshRequest(request));
    return cacheSuccessful(fallbackKey,response);
  } catch (error) {
    const cached = await caches.match(fallbackKey);
    if (cached) return cached;
    throw error;
  }
};

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !sameOrigin(request)) return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request,'./index.html'));
    return;
  }

  if (isCode(url)) {
    event.respondWith(networkFirst(request,request));
    return;
  }

  // Imagens, fontes e mídia continuam sob o cache HTTP do navegador. O WORK12
  // não ocupa o armazenamento do iPhone com um catálogo visual ilimitado.
  event.respondWith(fetch(request));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'WORK12_STATUS') {
    event.source?.postMessage?.({
      type:'WORK12_STATUS',
      version:VERSION,
      cache:CACHE_NAME,
      core:[...CORE]
    });
  }
  if (event.data?.type === 'CLEAR_DIVINA_CACHES') {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX))
        .map(key => caches.delete(key)));
      event.source?.postMessage?.({ type:'DIVINA_CACHES_CLEARED', version:VERSION });
    })());
  }
});
