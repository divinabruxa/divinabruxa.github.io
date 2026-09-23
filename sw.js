/* DIVINA BRUXA — WORK13 · SKINS · ATELIÊ DOS UNIVERSOS · V627
   O WORK12 V600 e os mundos V614-V626 permanecem protegidos. A instalacao so
   assume quando as 30 skins preservam direito confirmado pelo servidor,
   mudança cosmética global e a mesma Orbe canônica.
   Rede primeiro para código; cache apenas como chão seguro, nunca como prisão.
*/

const VERSION = 627;
const CACHE_PREFIX = 'divina-bruxa-';
const CACHE_NAME = 'divina-bruxa-work13-v627-skins-atelie-dos-universos';
const CORE = Object.freeze([
  './index.html',
  './app-v208.js?v=627-skins-atelie-dos-universos',
  './pentagrama-menu-vivo-v611.webp',
  './tarot-livre-soul-v610.js?v=614-camara-vazio-violeta',
  './tarot-livre-world-v614.css?v=614-camara-vazio-violeta',
  './carta-do-dia-soul-v610.js?v=610-work13-daily-soul',
  './carta-do-dia-soul-v610.css?v=610-work13-daily-soul',
  './carta-do-dia-world-v616.js?v=616-santuario-da-aurora',
  './carta-do-dia-world-v616.css?v=616-santuario-da-aurora',
  './tiragens-soul-v610.js?v=610-work13-spreads-soul',
  './tiragens-soul-v610.css?v=610-work13-spreads-soul',
  './tiragens-world-v617.js?v=617-concilio-das-constelacoes',
  './tiragens-world-v617.css?v=617-concilio-das-constelacoes',
  './escola-soul-v610.js?v=610-work13-school-soul',
  './escola-soul-v610.css?v=610-work13-school-soul',
  './escola-world-v618.js?v=618-jardim-das-78-sementes',
  './escola-world-v618.css?v=618-jardim-das-78-sementes',
  './biblioteca-soul-v610.js?v=615-sala-dos-fios-vivos',
  './biblioteca-world-v615.css?v=615-sala-dos-fios-vivos',
  './diario-soul-v610.js?v=610-work13-journal-soul',
  './diario-soul-v610.css?v=610-work13-journal-soul',
  './diario-world-v619.js?v=619-camara-da-tinta-viva',
  './diario-world-v619.css?v=619-camara-da-tinta-viva',
  './whit-world-v620.js?v=620-presenca-entre-mundos',
  './whit-world-v620.css?v=620-presenca-entre-mundos',
  './consultas-world-v621.js?v=621-templo-do-encontro',
  './consultas-world-v621.css?v=621-templo-do-encontro',
  './loja-world-v622.js?v=622-casa-das-escolhas-vivas',
  './loja-world-v622.css?v=622-casa-das-escolhas-vivas',
  './premium-world-v623.js?v=623-sala-das-chaves',
  './premium-world-v623.css?v=623-sala-das-chaves',
  './conta-world-v624.js?v=624-casa-do-retorno',
  './conta-world-v624.css?v=624-casa-do-retorno',
  './musica-world-v625.js?v=625-palco-das-estrelas',
  './musica-world-v625.css?v=625-palco-das-estrelas',
  './videos-world-v626.js?v=626-cinema-da-orbe',
  './videos-world-v626.css?v=626-cinema-da-orbe',
  './skins-world-v627.js?v=627-atelie-dos-universos',
  './skins-world-v627.css?v=627-atelie-dos-universos',
  './cosmos-entry-intention-v610.js?v=613-menu-global-vivo',
  './cosmos-entry-intention-v610.css?v=613-menu-global-vivo',
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
  const app = await responses.get('./app-v208.js?v=627-skins-atelie-dos-universos')?.clone().text();
  const tarotLivreSoul = await responses.get('./tarot-livre-soul-v610.js?v=614-camara-vazio-violeta')?.clone().text();
  const tarotLivreSoulStyles = await responses.get('./tarot-livre-world-v614.css?v=614-camara-vazio-violeta')?.clone().text();
  const cartaDoDiaSoul = await responses.get('./carta-do-dia-soul-v610.js?v=610-work13-daily-soul')?.clone().text();
  const cartaDoDiaSoulStyles = await responses.get('./carta-do-dia-soul-v610.css?v=610-work13-daily-soul')?.clone().text();
  const cartaDoDiaWorld = await responses.get('./carta-do-dia-world-v616.js?v=616-santuario-da-aurora')?.clone().text();
  const cartaDoDiaWorldStyles = await responses.get('./carta-do-dia-world-v616.css?v=616-santuario-da-aurora')?.clone().text();
  const tiragensSoul = await responses.get('./tiragens-soul-v610.js?v=610-work13-spreads-soul')?.clone().text();
  const tiragensSoulStyles = await responses.get('./tiragens-soul-v610.css?v=610-work13-spreads-soul')?.clone().text();
  const tiragensWorld = await responses.get('./tiragens-world-v617.js?v=617-concilio-das-constelacoes')?.clone().text();
  const tiragensWorldStyles = await responses.get('./tiragens-world-v617.css?v=617-concilio-das-constelacoes')?.clone().text();
  const escolaSoul = await responses.get('./escola-soul-v610.js?v=610-work13-school-soul')?.clone().text();
  const escolaSoulStyles = await responses.get('./escola-soul-v610.css?v=610-work13-school-soul')?.clone().text();
  const escolaWorld = await responses.get('./escola-world-v618.js?v=618-jardim-das-78-sementes')?.clone().text();
  const escolaWorldStyles = await responses.get('./escola-world-v618.css?v=618-jardim-das-78-sementes')?.clone().text();
  const bibliotecaSoul = await responses.get('./biblioteca-soul-v610.js?v=615-sala-dos-fios-vivos')?.clone().text();
  const bibliotecaSoulStyles = await responses.get('./biblioteca-world-v615.css?v=615-sala-dos-fios-vivos')?.clone().text();
  const diarioSoul = await responses.get('./diario-soul-v610.js?v=610-work13-journal-soul')?.clone().text();
  const diarioSoulStyles = await responses.get('./diario-soul-v610.css?v=610-work13-journal-soul')?.clone().text();
  const diarioWorld = await responses.get('./diario-world-v619.js?v=619-camara-da-tinta-viva')?.clone().text();
  const diarioWorldStyles = await responses.get('./diario-world-v619.css?v=619-camara-da-tinta-viva')?.clone().text();
  const whitWorld = await responses.get('./whit-world-v620.js?v=620-presenca-entre-mundos')?.clone().text();
  const whitWorldStyles = await responses.get('./whit-world-v620.css?v=620-presenca-entre-mundos')?.clone().text();
  const consultasWorld = await responses.get('./consultas-world-v621.js?v=621-templo-do-encontro')?.clone().text();
  const consultasWorldStyles = await responses.get('./consultas-world-v621.css?v=621-templo-do-encontro')?.clone().text();
  const lojaWorld = await responses.get('./loja-world-v622.js?v=622-casa-das-escolhas-vivas')?.clone().text();
  const lojaWorldStyles = await responses.get('./loja-world-v622.css?v=622-casa-das-escolhas-vivas')?.clone().text();
  const premiumWorld = await responses.get('./premium-world-v623.js?v=623-sala-das-chaves')?.clone().text();
  const premiumWorldStyles = await responses.get('./premium-world-v623.css?v=623-sala-das-chaves')?.clone().text();
  const contaWorld = await responses.get('./conta-world-v624.js?v=624-casa-do-retorno')?.clone().text();
  const contaWorldStyles = await responses.get('./conta-world-v624.css?v=624-casa-do-retorno')?.clone().text();
  const musicaWorld = await responses.get('./musica-world-v625.js?v=625-palco-das-estrelas')?.clone().text();
  const musicaWorldStyles = await responses.get('./musica-world-v625.css?v=625-palco-das-estrelas')?.clone().text();
  const videosWorld = await responses.get('./videos-world-v626.js?v=626-cinema-da-orbe')?.clone().text();
  const videosWorldStyles = await responses.get('./videos-world-v626.css?v=626-cinema-da-orbe')?.clone().text();
  const skinsWorld = await responses.get('./skins-world-v627.js?v=627-atelie-dos-universos')?.clone().text();
  const skinsWorldStyles = await responses.get('./skins-world-v627.css?v=627-atelie-dos-universos')?.clone().text();
  const entryIntention = await responses.get('./cosmos-entry-intention-v610.js?v=613-menu-global-vivo')?.clone().text();
  const entryStyles = await responses.get('./cosmos-entry-intention-v610.css?v=613-menu-global-vivo')?.clone().text();
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
    || !index.includes('name="divina-work13" content="V627"')) {
    throw new Error('work13-index-version-mismatch');
  }
  if (!index.includes('app-v208.js?v=627-skins-atelie-dos-universos')
    || !index.includes('name="divina-work13-correction" content="V627-SKINS-ATELIE-DOS-UNIVERSOS"')
    || !index.includes('id="divinaCosmosEntryIntentionV610"')
    || !index.includes('cosmos-entry-intention-v610.css?v=613-menu-global-vivo')
    || !index.includes('id="divinaCosmosWorldPresenceV610"')
    || !index.includes('cosmos-world-presence-v610.css?v=610-work13-final-presence')
    || !index.includes('id="cosmosEntryIntent"')
    || !index.includes('src="pentagrama-menu-vivo-v611.webp"')
    || !index.includes('aria-label="Abrir o menu mágico"')
    || index.includes('<span>Entrá</span>')
    || !index.includes('<section id="skins" class="screen skins-celestial-screen"')
    || !index.includes('data-skins-world="v627"')
    || !index.includes('id="divinaSkinsWorldV627"')
    || !index.includes('skins-world-v627.css?v=627-atelie-dos-universos')
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
  if (!app.includes("cosmos-entry-intention-v610.js?v=613-menu-global-vivo")
    || !app.includes('createCosmosEntryIntentionV610({')
    || !app.includes('entryIntention:cosmosEntryIntention')
    || !app.includes("invitation:'pentagrama-vermelho'")
    || !app.includes('divinaWork13MenuGlobalVivoV613')
    || !app.includes('visibleEntryWords:0')
    || !app.includes('whitInsideMenu:true')) {
    throw new Error('work13-entry-app-mismatch');
  }
  if (!app.includes("cosmos-world-presence-v610.js?v=610-work13-final-presence")
    || !app.includes('createCosmosWorldPresenceV610({')
    || !app.includes('worldPresence:cosmosWorldPresence')
    || !app.includes("correction:'lapidacao-final-presenca-das-realidades'")) {
    throw new Error('work13-world-presence-app-mismatch');
  }
  if (!app.includes("tarot-livre-soul-v610.js?v=614-camara-vazio-violeta")
    || !app.includes('createTarotLivreSoulV610({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.tarotLivreSoul = tarotLivreSoul')
    || !app.includes('divinaWork13TarotLivreWorldV614')
    || !app.includes("stage:'renovacao-dos-mundos-1-tarot-livre'")) {
    throw new Error('work13-tarot-livre-soul-app-mismatch');
  }
  if (!tarotLivreSoul?.includes('TAROT_LIVRE_WORLD_CONTRACT_V614')
    || !tarotLivreSoul.includes("sequence:Object.freeze(['arrival','orb-alone','touch','card','silence','freedom'])")
    || !tarotLivreSoul.includes("universe:'camara-do-vazio-violeta'")
    || !tarotLivreSoul.includes('cards:78')
    || !tarotLivreSoul.includes('rows:13')
    || !tarotLivreSoul.includes('columns:6')
    || !tarotLivreSoul.includes('reversedCards:false')
    || !tarotLivreSoul.includes('repetitionBeforeReset:false')
    || !tarotLivreSoul.includes('automaticMeanings:false')
    || !tarotLivreSoul.includes('cardSelectionChanges:0')
    || !tarotLivreSoul.includes('orbAloneOutsideMenu:true')
    || !tarotLivreSoul.includes('orbitingListsVisible:false')
    || !tarotLivreSoul.includes("revealEvent:'tarot:supreme-revealed'")
    || !tarotLivreSoul.includes('tableDeferredRendering:true')
    || !tarotLivreSoul.includes('reusesCanonicalOrb:true')
    || !tarotLivreSoul.includes('permanentAnimationLoops:0')
    || !tarotLivreSoul.includes('mutationObservers:0')
    || !tarotLivreSoul.includes('work14:false')) {
    throw new Error('work13-tarot-livre-soul-contract-missing');
  }
  if (!tarotLivreSoulStyles?.includes('[data-tarot-world="v614"]')
    || !tarotLivreSoulStyles.includes('[data-tarot-soul-phase="answering"]')
    || !tarotLivreSoulStyles.includes('[data-tarot-soul-phase="receiving"]')
    || !tarotLivreSoulStyles.includes('[data-tarot-soul-phase="silence"]')
    || !tarotLivreSoulStyles.includes('.orbital-cards')
    || !tarotLivreSoulStyles.includes('.altar-rings')
    || !tarotLivreSoulStyles.includes('content-visibility:auto')
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
  if (!app.includes("carta-do-dia-world-v616.js?v=616-santuario-da-aurora")
    || !app.includes('createCartaDoDiaWorldV616({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.cartaDoDiaWorld = cartaDoDiaWorld')
    || !app.includes("universe:'santuario-da-aurora'")) {
    throw new Error('work13-carta-do-dia-world-app-mismatch');
  }
  if (!cartaDoDiaWorld?.includes('CARTA_DO_DIA_WORLD_CONTRACT_V616')
    || !cartaDoDiaWorld.includes("sequence:Object.freeze(['arrival','orb','touch','card','silence','one-sentence-essence','depth-on-explicit-request'])")
    || !cartaDoDiaWorld.includes("universe:'santuario-da-aurora'")
    || !cartaDoDiaWorld.includes('cardsPerBrasiliaDay:1')
    || !cartaDoDiaWorld.includes("timeZone:'America/Sao_Paulo'")
    || !cartaDoDiaWorld.includes('normalCardsOnly:true')
    || !cartaDoDiaWorld.includes('maximumEssenceSentences:1')
    || !cartaDoDiaWorld.includes('depthRequiresExplicitGesture:true')
    || !cartaDoDiaWorld.includes("canonicalOrbAction:'reveal-daily-card'")
    || !cartaDoDiaWorld.includes('cardSelectionChanges:0')
    || !cartaDoDiaWorld.includes('reusesCanonicalOrb:true')
    || !cartaDoDiaWorld.includes('permanentAnimationLoops:0')
    || !cartaDoDiaWorld.includes('mutationObservers:0')
    || !cartaDoDiaWorld.includes('work14:false')) {
    throw new Error('work13-carta-do-dia-world-contract-missing');
  }
  if (!cartaDoDiaWorldStyles?.includes('[data-daily-world="v616"]')
    || !cartaDoDiaWorldStyles.includes('[data-daily-world-phase="answering"]')
    || !cartaDoDiaWorldStyles.includes('[data-daily-world-phase="silence"]')
    || !cartaDoDiaWorldStyles.includes('[data-reading-phase="depth"]')
    || !cartaDoDiaWorldStyles.includes('.db604-daily-essence')
    || !cartaDoDiaWorldStyles.includes('content-visibility:auto')
    || !cartaDoDiaWorldStyles.includes('@media(max-width:430px)')
    || !cartaDoDiaWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(cartaDoDiaWorldStyles)) {
    throw new Error('work13-carta-do-dia-world-styles-missing');
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
  if (!app.includes("tiragens-world-v617.js?v=617-concilio-das-constelacoes")
    || !app.includes('createTiragensWorldV617({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.tiragensWorld = tiragensWorld')
    || !app.includes("universe:'concilio-das-constelacoes'")) {
    throw new Error('work13-tiragens-world-app-mismatch');
  }
  if (!tiragensWorld?.includes('TIRAGENS_WORLD_CONTRACT_V617')
    || !tiragensWorld.includes("sequence:Object.freeze(['arrival','choice','orb','card-and-position','silence','essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'])")
    || !tiragensWorld.includes("universe:'concilio-das-constelacoes'")
    || !tiragensWorld.includes('methodsPreserved:15')
    || !tiragensWorld.includes('freeMethodsPreserved:4')
    || !tiragensWorld.includes('premiumMethodsPreserved:11')
    || !tiragensWorld.includes('celticCrossPositionsPreserved:10')
    || !tiragensWorld.includes('royalTableCardsPreserved:78')
    || !tiragensWorld.includes("royalTableGeometryPreserved:'13x6'")
    || !tiragensWorld.includes('maximumConversationVoices:3')
    || !tiragensWorld.includes('maximumSynthesisSentences:1')
    || !tiragensWorld.includes('depthRequiresExplicitGesture:true')
    || !tiragensWorld.includes("canonicalOrbAction:'reveal-next-position'")
    || !tiragensWorld.includes('premiumAuthorityChanges:0')
    || !tiragensWorld.includes('reusesCanonicalOrb:true')
    || !tiragensWorld.includes('permanentAnimationLoops:0')
    || !tiragensWorld.includes('mutationObservers:0')
    || !tiragensWorld.includes('work14:false')) {
    throw new Error('work13-tiragens-world-contract-missing');
  }
  if (!tiragensWorldStyles?.includes('[data-spreads-world="v617"]')
    || !tiragensWorldStyles.includes('[data-spreads-world-phase="answering"]')
    || !tiragensWorldStyles.includes('[data-spreads-world-phase="silence"]')
    || !tiragensWorldStyles.includes('[data-cosmic-spread-synthesis="v605"]')
    || !tiragensWorldStyles.includes('content-visibility:auto')
    || !tiragensWorldStyles.includes('.royal-table')
    || !tiragensWorldStyles.includes('@media(max-width:430px)')
    || !tiragensWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(tiragensWorldStyles)) {
    throw new Error('work13-tiragens-world-styles-missing');
  }
  if (!app.includes("escola-soul-v610.js?v=610-work13-school-soul")
    || !app.includes('createEscolaSoulV610({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.escolaSoul = escolaSoul')
    || !app.includes("stage:'quarta-realidade-alma-propria'")) {
    throw new Error('work13-escola-soul-app-mismatch');
  }
  if (!escolaSoul?.includes('ESCOLA_SOUL_CONTRACT_V610')
    || !escolaSoul.includes("universe:'jardim-arcano-do-conhecimento'")
    || !escolaSoul.includes("sequence:Object.freeze(['seed','one-next-step','path','one-whole-lesson','practice','root','silence'])")
    || !escolaSoul.includes("existingSchoolAuthority:'V555-preserved'")
    || !escolaSoul.includes("existingChamberAuthority:'V596-preserved'")
    || !escolaSoul.includes("existingLivingWisdomAuthority:'V607-preserved'")
    || !escolaSoul.includes('stagesPreserved:3')
    || !escolaSoul.includes('modulesPreserved:17')
    || !escolaSoul.includes('lessonsPreserved:124')
    || !escolaSoul.includes('cardLessonsPreserved:78')
    || !escolaSoul.includes('oneNaturalNextLesson:true')
    || !escolaSoul.includes('programmeRequiresExplicitGesture:true')
    || !escolaSoul.includes('progressAuthorityChanges:0')
    || !escolaSoul.includes('lessonContentChanges:0')
    || !escolaSoul.includes('premiumAuthorityChanges:0')
    || !escolaSoul.includes('reusesCanonicalOrb:true')
    || !escolaSoul.includes('privateContentReads:0')
    || !escolaSoul.includes('lessonBodyReads:0')
    || !escolaSoul.includes('schoolNoteReads:0')
    || !escolaSoul.includes('searchQueryReads:0')
    || !escolaSoul.includes('permanentAnimationLoops:0')
    || !escolaSoul.includes('mutationObservers:0')
    || !escolaSoul.includes('deferredTimers:0')
    || !escolaSoul.includes('work14:false')) {
    throw new Error('work13-escola-soul-contract-missing');
  }
  if (!escolaSoulStyles?.includes('[data-school-soul="v610"]')
    || !escolaSoulStyles.includes('[data-school-soul-phase="germinating"]')
    || !escolaSoulStyles.includes('[data-school-soul-phase="lesson"]')
    || !escolaSoulStyles.includes('[data-school-soul-phase="rooted"]')
    || !escolaSoulStyles.includes('.school-dashboard')
    || !escolaSoulStyles.includes('.school-v555-stages')
    || !escolaSoulStyles.includes('.school-lesson')
    || !escolaSoulStyles.includes('@media(max-width:430px)')
    || !escolaSoulStyles.includes('@media(orientation:landscape)')
    || !escolaSoulStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(escolaSoulStyles)) {
    throw new Error('work13-escola-soul-styles-missing');
  }
  if (!app.includes("escola-world-v618.js?v=618-jardim-das-78-sementes")
    || !app.includes('createEscolaWorldV618()')
    || !app.includes('window.orbe.escolaWorld = escolaWorld')
    || !app.includes('window.divinaWork13EscolaWorldV618')
    || !app.includes("stage:'renovacao-dos-mundos-5-escola'")
    || !app.includes("universe:'jardim-das-78-sementes'")) {
    throw new Error('work13-escola-world-app-mismatch');
  }
  if (!escolaWorld?.includes('ESCOLA_WORLD_CONTRACT_V618')
    || !escolaWorld.includes("universe:'jardim-das-78-sementes'")
    || !escolaWorld.includes("'arrival','one-living-seed','one-next-lesson','one-whole-lesson'")
    || !escolaWorld.includes("'practice','root','silence','programme-on-explicit-request'")
    || !escolaWorld.includes("schoolAuthority:'V555-preserved'")
    || !escolaWorld.includes("chamberAuthority:'V596-preserved'")
    || !escolaWorld.includes("livingWisdomAuthority:'V607-preserved'")
    || !escolaWorld.includes("soulAuthority:'V610-preserved'")
    || !escolaWorld.includes('stagesPreserved:3')
    || !escolaWorld.includes('modulesPreserved:17')
    || !escolaWorld.includes('lessonsPreserved:124')
    || !escolaWorld.includes('cardLessonsPreserved:78')
    || !escolaWorld.includes('theoryPracticeLessonsPreserved:46')
    || !escolaWorld.includes('freeLessonsPreserved:17')
    || !escolaWorld.includes('premiumLessonsPreserved:107')
    || !escolaWorld.includes('foundationsFreePreserved:true')
    || !escolaWorld.includes('premiumOfflinePreserved:true')
    || !escolaWorld.includes('oneNaturalNextLesson:true')
    || !escolaWorld.includes('oneWholeLessonAtATime:true')
    || !escolaWorld.includes('programmeRequiresExplicitGesture:true')
    || !escolaWorld.includes('privateContentReads:0')
    || !escolaWorld.includes('schoolNoteReads:0')
    || !escolaWorld.includes('answerReads:0')
    || !escolaWorld.includes('networkCalls:0')
    || !escolaWorld.includes('permanentAnimationLoops:0')
    || !escolaWorld.includes('mutationObservers:0')
    || !escolaWorld.includes('deferredTimers:0')
    || !escolaWorld.includes('work14:false')) {
    throw new Error('work13-escola-world-contract-missing');
  }
  if (!escolaWorldStyles?.includes('[data-work13-school-world="v618"]')
    || !escolaWorldStyles.includes('[data-school-world="v618"]')
    || !escolaWorldStyles.includes('[data-school-world-phase="germinating"]')
    || !escolaWorldStyles.includes('[data-school-world-phase="lesson"]')
    || !escolaWorldStyles.includes('[data-school-world-phase="rooted"]')
    || !escolaWorldStyles.includes('content-visibility:auto')
    || !escolaWorldStyles.includes('@media(max-width:430px)')
    || !escolaWorldStyles.includes('@media(orientation:landscape)')
    || !escolaWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|backdrop-filter|filter\s*:/.test(escolaWorldStyles)) {
    throw new Error('work13-escola-world-styles-missing');
  }
  if (!app.includes("biblioteca-soul-v610.js?v=615-sala-dos-fios-vivos")
    || !app.includes('createBibliotecaSoulV610({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.bibliotecaSoul = bibliotecaSoul')
    || !app.includes('divinaWork13BibliotecaWorldV615')
    || !app.includes("stage:'renovacao-dos-mundos-2-biblioteca'")) {
    throw new Error('work13-biblioteca-soul-app-mismatch');
  }
  if (!bibliotecaSoul?.includes('BIBLIOTECA_WORLD_CONTRACT_V615')
    || !bibliotecaSoul.includes("universe:'arquivo-de-luz-sala-dos-fios-vivos'")
    || !bibliotecaSoul.includes("'arrival','threshold','one-discovery','silence','symbolic-thread'")
    || !bibliotecaSoul.includes("existingLibraryWorldAuthority:'V302-preserved'")
    || !bibliotecaSoul.includes("existingLibraryDepthAuthority:'V332-preserved'")
    || !bibliotecaSoul.includes("existingPublicLibraryAuthority:'V544-preserved'")
    || !bibliotecaSoul.includes("existingLivingWisdomAuthority:'V607-preserved'")
    || !bibliotecaSoul.includes('cardsPreserved:78')
    || !bibliotecaSoul.includes('uprightCardsOnly:true')
    || !bibliotecaSoul.includes('reversedCards:false')
    || !bibliotecaSoul.includes('cataloguePageSizePreserved:18')
    || !bibliotecaSoul.includes('gridFullImageRequestsPreserved:0')
    || !bibliotecaSoul.includes('oneDiscoveryFirst:true')
    || !bibliotecaSoul.includes('onePrimaryChoice:true')
    || !bibliotecaSoul.includes('catalogueRequiresExplicitGesture:true')
    || !bibliotecaSoul.includes('catalogueRecedesAtArrival:true')
    || !bibliotecaSoul.includes('catalogueDeferredRendering:true')
    || !bibliotecaSoul.includes('readerDeferredRendering:true')
    || !bibliotecaSoul.includes("'symbol','element','number','archetype','related-cards'")
    || !bibliotecaSoul.includes("'pt-BR','en','es'")
    || !bibliotecaSoul.includes('cardMeaningChanges:0')
    || !bibliotecaSoul.includes('cardSelectionChanges:0')
    || !bibliotecaSoul.includes('premiumAuthorityChanges:0')
    || !bibliotecaSoul.includes('reusesCanonicalOrb:true')
    || !bibliotecaSoul.includes('privateContentReads:0')
    || !bibliotecaSoul.includes('cardIdentityReads:0')
    || !bibliotecaSoul.includes('cardMeaningReads:0')
    || !bibliotecaSoul.includes('searchQueryReads:0')
    || !bibliotecaSoul.includes('permanentAnimationLoops:0')
    || !bibliotecaSoul.includes('mutationObservers:0')
    || !bibliotecaSoul.includes('deferredTimers:0')
    || !bibliotecaSoul.includes('work14:false')) {
    throw new Error('work13-biblioteca-soul-contract-missing');
  }
  if (!bibliotecaSoulStyles?.includes('[data-library-world="v615"]')
    || !bibliotecaSoulStyles.includes('[data-library-soul-phase="answering"]')
    || !bibliotecaSoulStyles.includes('[data-library-soul-phase="discovery"]')
    || !bibliotecaSoulStyles.includes('[data-library-soul-phase="thread"]')
    || !bibliotecaSoulStyles.includes('[data-library-soul-phase="catalogue"]')
    || !bibliotecaSoulStyles.includes('.db607-library-guide')
    || !bibliotecaSoulStyles.includes('.lb302__sanctuary')
    || !bibliotecaSoulStyles.includes('.lb302__paths')
    || !bibliotecaSoulStyles.includes('.pl544')
    || !bibliotecaSoulStyles.includes('content-visibility:auto')
    || !bibliotecaSoulStyles.includes('contain-intrinsic-block-size:760px')
    || !bibliotecaSoulStyles.includes('@media(max-width:430px)')
    || !bibliotecaSoulStyles.includes('@media(orientation:landscape)')
    || !bibliotecaSoulStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(bibliotecaSoulStyles)) {
    throw new Error('work13-biblioteca-soul-styles-missing');
  }
  if (!app.includes("diario-soul-v610.js?v=610-work13-journal-soul")
    || !app.includes('createDiarioSoulV610({ orbCore:supremeOrb })')
    || !app.includes('window.orbe.diarioSoul = diarioSoul')
    || !app.includes("stage:'sexta-realidade-alma-propria'")
    || !app.includes('realitySouls:6')) {
    throw new Error('work13-diario-soul-app-mismatch');
  }
  if (!diarioSoul?.includes('DIARIO_SOUL_CONTRACT_V610')
    || !diarioSoul.includes("universe:'camara-da-tinta-lunar'")
    || !diarioSoul.includes("'threshold','direct-writing','silent-autosave','optional-details'")
    || !diarioSoul.includes("existingJournalAuthority:'V556-preserved'")
    || !diarioSoul.includes("existingJournalWorldAuthority:'V317-preserved'")
    || !diarioSoul.includes("existingChamberAuthority:'V596-preserved'")
    || !diarioSoul.includes("existingLivingWisdomAuthority:'V607-preserved'")
    || !diarioSoul.includes('directWritingFirst:true')
    || !diarioSoul.includes('memoriesRequireExplicitGesture:true')
    || !diarioSoul.includes('mirrorRequiresExplicitGesture:true')
    || !diarioSoul.includes('silentAutosavePreserved:true')
    || !diarioSoul.includes("syncDefault:'off-until-explicit-account-consent'")
    || !diarioSoul.includes('timelinePageSizePreserved:12')
    || !diarioSoul.includes('timelineFullImageRequestsPreserved:0')
    || !diarioSoul.includes('mirrorAggregateOnly:true')
    || !diarioSoul.includes('mirrorDiagnosis:false')
    || !diarioSoul.includes('mirrorPrediction:false')
    || !diarioSoul.includes('reusesCanonicalOrb:true')
    || !diarioSoul.includes('privateContentReads:0')
    || !diarioSoul.includes('journalBodyReads:0')
    || !diarioSoul.includes('titleReads:0')
    || !diarioSoul.includes('tagReads:0')
    || !diarioSoul.includes('draftReads:0')
    || !diarioSoul.includes('historyReads:0')
    || !diarioSoul.includes('formValueReads:0')
    || !diarioSoul.includes('permanentAnimationLoops:0')
    || !diarioSoul.includes('mutationObservers:0')
    || !diarioSoul.includes('deferredTimers:0')
    || !diarioSoul.includes('work14:false')) {
    throw new Error('work13-diario-soul-contract-missing');
  }
  if (!diarioSoulStyles?.includes('[data-journal-soul="v610"]')
    || !diarioSoulStyles.includes('[data-journal-soul-phase="opening"]')
    || !diarioSoulStyles.includes('[data-journal-soul-phase="writing"]')
    || !diarioSoulStyles.includes('[data-journal-soul-phase="saving"]')
    || !diarioSoulStyles.includes('[data-journal-soul-phase="saved"]')
    || !diarioSoulStyles.includes('[data-journal-soul-phase="mirror"]')
    || !diarioSoulStyles.includes('.db585-intent-threshold')
    || !diarioSoulStyles.includes('.db607-journal-path')
    || !diarioSoulStyles.includes('.journal-editor')
    || !diarioSoulStyles.includes('#journalForm')
    || !diarioSoulStyles.includes('.journal-mirror')
    || !diarioSoulStyles.includes('.journal-explorer')
    || !diarioSoulStyles.includes('.journal-timeline')
    || !diarioSoulStyles.includes('@media(max-width:430px)')
    || !diarioSoulStyles.includes('@media(orientation:landscape)')
    || !diarioSoulStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(diarioSoulStyles)) {
    throw new Error('work13-diario-soul-styles-missing');
  }
  if (!app.includes("diario-world-v619.js?v=619-camara-da-tinta-viva")
    || !app.includes('createDiarioWorldV619()')
    || !app.includes('window.orbe.diarioWorld = diarioWorld')
    || !app.includes('window.divinaWork13DiarioWorldV619')
    || !app.includes("stage:'renovacao-dos-mundos-6-diario'")
    || !app.includes("universe:'camara-da-tinta-viva'")) {
    throw new Error('work13-diario-world-app-mismatch');
  }
  if (!diarioWorld?.includes('DIARIO_WORLD_CONTRACT_V619')
    || !diarioWorld.includes("universe:'camara-da-tinta-viva'")
    || !diarioWorld.includes("identity:'obsidian-parchment-carmine-moon-silver'")
    || !diarioWorld.includes("'arrival','orb-threshold','blank-page','direct-writing','silent-autosave'")
    || !diarioWorld.includes("'ink-settles','optional-details','memories-on-explicit-request'")
    || !diarioWorld.includes("'aggregate-mirror-on-explicit-request','return','silence'")
    || !diarioWorld.includes("journalAuthority:'V556-preserved'")
    || !diarioWorld.includes("journalWorldAuthority:'V317-preserved'")
    || !diarioWorld.includes("chamberAuthority:'V596-preserved'")
    || !diarioWorld.includes("livingWisdomAuthority:'V607-preserved'")
    || !diarioWorld.includes("soulAuthority:'V610-preserved'")
    || !diarioWorld.includes('directWritingFirst:true')
    || !diarioWorld.includes('blankPageFirst:true')
    || !diarioWorld.includes('silentAutosavePreserved:true')
    || !diarioWorld.includes('syncConflictProtectionPreserved:true')
    || !diarioWorld.includes('memoriesRequireExplicitGesture:true')
    || !diarioWorld.includes('mirrorRequiresExplicitGesture:true')
    || !diarioWorld.includes('mirrorAggregateOnly:true')
    || !diarioWorld.includes('mirrorDiagnosis:false')
    || !diarioWorld.includes('mirrorPrediction:false')
    || !diarioWorld.includes('timelinePageSizePreserved:12')
    || !diarioWorld.includes('adminBodyAccess:false')
    || !diarioWorld.includes('analyticsBodyAccess:false')
    || !diarioWorld.includes('whitSilentRead:false')
    || !diarioWorld.includes('whitShareRequiresExplicitTemporaryConsent:true')
    || !diarioWorld.includes('privateContentReads:0')
    || !diarioWorld.includes('journalBodyReads:0')
    || !diarioWorld.includes('formValueReads:0')
    || !diarioWorld.includes('networkCalls:0')
    || !diarioWorld.includes('permanentAnimationLoops:0')
    || !diarioWorld.includes('mutationObservers:0')
    || !diarioWorld.includes('deferredTimers:0')
    || !diarioWorld.includes('work14:false')) {
    throw new Error('work13-diario-world-contract-missing');
  }
  if (!diarioWorldStyles?.includes('[data-work13-journal-world="v619"]')
    || !diarioWorldStyles.includes('[data-journal-world="v619"]')
    || !diarioWorldStyles.includes('[data-journal-world-phase="writing"]')
    || !diarioWorldStyles.includes('[data-journal-world-phase="saving"]')
    || !diarioWorldStyles.includes('[data-journal-world-phase="saved"]')
    || !diarioWorldStyles.includes('[data-journal-world-phase="mirror"]')
    || !diarioWorldStyles.includes('.journal-editor')
    || !diarioWorldStyles.includes('.journal-mirror')
    || !diarioWorldStyles.includes('.journal-timeline')
    || !diarioWorldStyles.includes('content-visibility:auto')
    || !diarioWorldStyles.includes('env(safe-area-inset-top)')
    || !diarioWorldStyles.includes('@media(max-width:430px)')
    || !diarioWorldStyles.includes('@media(orientation:landscape)')
    || !diarioWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(diarioWorldStyles)) {
    throw new Error('work13-diario-world-styles-missing');
  }
  if (!app.includes("whit-world-v620.js?v=620-presenca-entre-mundos")
    || !app.includes('createWhitWorldV620({')
    || !app.includes('window.orbe.whitWorld = whitWorld')
    || !app.includes('window.divinaWork13WhitWorldV620')
    || !app.includes("stage:'renovacao-dos-mundos-7-whit'")
    || !app.includes("universe:'presenca-entre-mundos'")) {
    throw new Error('work13-whit-world-app-mismatch');
  }
  if (!whitWorld?.includes('WHIT_WORLD_CONTRACT_V620')
    || !whitWorld.includes("universe:'presenca-entre-mundos'")
    || !whitWorld.includes("identity:'midnight-indigo-opal-electric-cyan'")
    || !whitWorld.includes("'arrival','silence','one-explicit-invitation','listening'")
    || !whitWorld.includes("'one-local-response','visible-session-trace'")
    || !whitWorld.includes("'context-on-explicit-consent','return','silence'")
    || !whitWorld.includes("localWhitAuthority:'V557-preserved'")
    || !whitWorld.includes("orbSoulAuthority:'V581-preserved'")
    || !whitWorld.includes("livingPresenceAuthority:'V594-preserved'")
    || !whitWorld.includes("silenceTimingAuthority:'V606-preserved'")
    || !whitWorld.includes('localDefaultPreserved:true')
    || !whitWorld.includes('accountRequired:false')
    || !whitWorld.includes('localApiCallsPreserved:0')
    || !whitWorld.includes('localModelCallsPreserved:0')
    || !whitWorld.includes('localCreditsUsedPreserved:0')
    || !whitWorld.includes('sessionMemoryTurnsPreserved:6')
    || !whitWorld.includes('sessionMemoryPersistent:false')
    || !whitWorld.includes('visibleContextOnly:true')
    || !whitWorld.includes('sendConsentRequired:true')
    || !whitWorld.includes("defaultResponse:'silence'")
    || !whitWorld.includes("visibleSpeechPolicy:'explicit-invitation-or-consent-only'")
    || !whitWorld.includes('privateByDefault:true')
    || !whitWorld.includes('journalSilentReads:0')
    || !whitWorld.includes('schoolNoteSilentReads:0')
    || !whitWorld.includes('tarotQuestionSilentReads:0')
    || !whitWorld.includes('privateContentReads:0')
    || !whitWorld.includes('formValueReads:0')
    || !whitWorld.includes('messageBodyReads:0')
    || !whitWorld.includes('storageReads:0')
    || !whitWorld.includes('networkCalls:0')
    || !whitWorld.includes('modelCalls:0')
    || !whitWorld.includes('existingWhitBodyReused:true')
    || !whitWorld.includes('separateWhitBody:false')
    || !whitWorld.includes('reusesCanonicalOrb:true')
    || !whitWorld.includes('permanentAnimationLoops:0')
    || !whitWorld.includes('mutationObservers:0')
    || !whitWorld.includes('deferredTimers:0')
    || !whitWorld.includes('work14:false')) {
    throw new Error('work13-whit-world-contract-missing');
  }
  if (!whitWorldStyles?.includes('[data-work13-whit-world="v620"]')
    || !whitWorldStyles.includes('[data-whit-world="v620"]')
    || !whitWorldStyles.includes('[data-whit-world-phase="listening"]')
    || !whitWorldStyles.includes('[data-whit-world-phase="responding"]')
    || !whitWorldStyles.includes('[data-whit-world-phase="present"]')
    || !whitWorldStyles.includes('[data-whit-world-phase="silence"]')
    || !whitWorldStyles.includes('#aiApp')
    || !whitWorldStyles.includes('content-visibility:auto')
    || !whitWorldStyles.includes('env(safe-area-inset-top)')
    || !whitWorldStyles.includes('@media(max-width:430px)')
    || !whitWorldStyles.includes('@media(orientation:landscape)')
    || !whitWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(whitWorldStyles)) {
    throw new Error('work13-whit-world-styles-missing');
  }
  if (!app.includes("consultas-world-v621.js?v=621-templo-do-encontro")
    || !app.includes('createConsultasWorldV621({')
    || !app.includes('window.orbe.consultasWorld = consultasWorld')
    || !app.includes('window.divinaWork13ConsultasWorldV621')
    || !app.includes("stage:'renovacao-dos-mundos-8-consultas'")
    || !app.includes("universe:'templo-do-encontro'")) {
    throw new Error('work13-consultas-world-app-mismatch');
  }
  if (!consultasWorld?.includes('CONSULTAS_WORLD_CONTRACT_V621')
    || !consultasWorld.includes("universe:'templo-do-encontro'")
    || !consultasWorld.includes("identity:'garnet-rosewood-candle-gold-moon-ivory'")
    || !consultasWorld.includes("'arrival','one-clear-intention','four-human-readings','one-explicit-choice'")
    || !consultasWorld.includes("'essential-contact','private-question-or-context','review','email-handoff'")
    || !consultasWorld.includes("'private-protocol','return','silence'")
    || !consultasWorld.includes("consultationsAuthority:'V558-preserved'")
    || !consultasWorld.includes("chamberAuthority:'V596-preserved'")
    || !consultasWorld.includes("livingCommerceAuthority:'V608-preserved'")
    || !consultasWorld.includes('servicesPreserved:4')
    || !consultasWorld.includes("'Mesa Real','Leitura de Mente','Carta de Conselho','Pergunta'")
    || !consultasWorld.includes('[25000,20000,15000,5000]')
    || !consultasWorld.includes('priceSnapshotPreserved:true')
    || !consultasWorld.includes('futurePricesAdminEditablePreserved:true')
    || !consultasWorld.includes('previousOrdersImmutable:true')
    || !consultasWorld.includes('humanReadingOnly:true')
    || !consultasWorld.includes('separateFromPremium:true')
    || !consultasWorld.includes("'name','email','phone','service','question-or-context'")
    || !consultasWorld.includes('emailRequired:true')
    || !consultasWorld.includes('phoneRequired:true')
    || !consultasWorld.includes('whatsappRequired:false')
    || !consultasWorld.includes("operationalContact:'orbedasrealidades@hotmail.com'")
    || !consultasWorld.includes("submissionChannel:'email-only'")
    || !consultasWorld.includes('onlineOnlySubmission:true')
    || !consultasWorld.includes('automaticEmail:false')
    || !consultasWorld.includes('falseDeliveryClaim:false')
    || !consultasWorld.includes('realBilling:false')
    || !consultasWorld.includes('privateByDefault:true')
    || !consultasWorld.includes('analyticsPrivateBodyAccess:false')
    || !consultasWorld.includes('commonLogsPrivateBodyAccess:false')
    || !consultasWorld.includes('whitSilentRead:false')
    || !consultasWorld.includes('existingConsultationBodyReused:true')
    || !consultasWorld.includes('separateConsultationBody:false')
    || !consultasWorld.includes('privateContentReads:0')
    || !consultasWorld.includes('formValueReads:0')
    || !consultasWorld.includes('questionReads:0')
    || !consultasWorld.includes('contactReads:0')
    || !consultasWorld.includes('protocolReads:0')
    || !consultasWorld.includes('storageReads:0')
    || !consultasWorld.includes('networkCalls:0')
    || !consultasWorld.includes('modelCalls:0')
    || !consultasWorld.includes('reusesCanonicalOrb:true')
    || !consultasWorld.includes('permanentAnimationLoops:0')
    || !consultasWorld.includes('mutationObservers:0')
    || !consultasWorld.includes('deferredTimers:0')
    || !consultasWorld.includes('work14:false')) {
    throw new Error('work13-consultas-world-contract-missing');
  }
  if (!consultasWorldStyles?.includes('[data-work13-consultas-world="v621"]')
    || !consultasWorldStyles.includes('[data-consultas-world="v621"]')
    || !consultasWorldStyles.includes('[data-consultas-world-phase="choices"]')
    || !consultasWorldStyles.includes('[data-consultas-world-phase="details"]')
    || !consultasWorldStyles.includes('[data-consultas-world-phase="protocol"]')
    || !consultasWorldStyles.includes('.consultation-v147-services')
    || !consultasWorldStyles.includes('.consultation-v147-service')
    || !consultasWorldStyles.includes('.consultation-flow-stage')
    || !consultasWorldStyles.includes('.consultation-tracker')
    || !consultasWorldStyles.includes('content-visibility:auto')
    || !consultasWorldStyles.includes('env(safe-area-inset-top)')
    || !consultasWorldStyles.includes('@media(max-width:430px)')
    || !consultasWorldStyles.includes('@media(orientation:landscape)')
    || !consultasWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(consultasWorldStyles)) {
    throw new Error('work13-consultas-world-styles-missing');
  }
  if (!app.includes("loja-world-v622.js?v=622-casa-das-escolhas-vivas")
    || !app.includes('createLojaWorldV622({')
    || !app.includes('window.orbe.lojaWorld = lojaWorld')
    || !app.includes('window.divinaWork13LojaWorldV622')
    || !app.includes("stage:'renovacao-dos-mundos-9-loja'")
    || !app.includes("universe:'casa-das-escolhas-vivas'")) {
    throw new Error('work13-loja-world-app-mismatch');
  }
  if (!lojaWorld?.includes('LOJA_WORLD_CONTRACT_V622')
    || !lojaWorld.includes("universe:'casa-das-escolhas-vivas'")
    || !lojaWorld.includes("identity:'night-emerald-patina-copper-amber-parchment'")
    || !lojaWorld.includes("'arrival','one-clear-intention','four-curated-paths','one-explicit-path'")
    || !lojaWorld.includes("'twenty-one-curated-choices','category-search-or-favorites-on-explicit-request'")
    || !lojaWorld.includes("'product-truth','external-amazon-passage','return','silence'")
    || !lojaWorld.includes("storeAuthority:'V543-preserved'")
    || !lojaWorld.includes("chamberAuthority:'V596-preserved'")
    || !lojaWorld.includes("livingCommerceAuthority:'V608-preserved'")
    || !lojaWorld.includes('productsPreserved:21')
    || !lojaWorld.includes('intentionPathsPreserved:4')
    || !lojaWorld.includes('categoriesPreserved:9')
    || !lojaWorld.includes('productCategoriesPreserved:8')
    || !lojaWorld.includes('featuredChoicesPreserved:7')
    || !lojaWorld.includes("destinationHost:'www.amazon.com.br'")
    || !lojaWorld.includes('affiliateDisclosureAdjacentPreserved:true')
    || !lojaWorld.includes("affiliateTagAuthority:'V543-config-preserved'")
    || !lojaWorld.includes('affiliateTagHardcodedByV622:false')
    || !lojaWorld.includes("checkout:'external-amazon-only'")
    || !lojaWorld.includes('checkoutInternal:false')
    || !lojaWorld.includes('realBilling:false')
    || !lojaWorld.includes('priceCache:false')
    || !lojaWorld.includes('stockCache:false')
    || !lojaWorld.includes('ratingCache:false')
    || !lojaWorld.includes('fakeDiscountClaims:0')
    || !lojaWorld.includes('fakeScarcityClaims:0')
    || !lojaWorld.includes('officialPartnershipClaim:false')
    || !lojaWorld.includes('searchLocalOnlyPreserved:true')
    || !lojaWorld.includes('favoritesLocalOnlyPreserved:true')
    || !lojaWorld.includes('privateContentReads:0')
    || !lojaWorld.includes('searchTextReads:0')
    || !lojaWorld.includes('favoritesReads:0')
    || !lojaWorld.includes('affiliateUrlReads:0')
    || !lojaWorld.includes('storageReads:0')
    || !lojaWorld.includes('networkCalls:0')
    || !lojaWorld.includes('modelCalls:0')
    || !lojaWorld.includes('reusesCanonicalOrb:true')
    || !lojaWorld.includes('permanentAnimationLoops:0')
    || !lojaWorld.includes('mutationObservers:0')
    || !lojaWorld.includes('deferredTimers:0')
    || !lojaWorld.includes('work14:false')) {
    throw new Error('work13-loja-world-contract-missing');
  }
  if (!lojaWorldStyles?.includes('[data-work13-loja-world="v622"]')
    || !lojaWorldStyles.includes('[data-loja-world="v622"]')
    || !lojaWorldStyles.includes('[data-loja-world-phase="intentions"]')
    || !lojaWorldStyles.includes('[data-loja-world-phase="filtering"]')
    || !lojaWorldStyles.includes('[data-loja-world-phase="passage"]')
    || !lojaWorldStyles.includes('.amazon-v543__intentions')
    || !lojaWorldStyles.includes('.store-v148-catalog')
    || !lojaWorldStyles.includes('.store-v148-product')
    || !lojaWorldStyles.includes('[data-affiliate]')
    || !lojaWorldStyles.includes('content-visibility:auto')
    || !lojaWorldStyles.includes('env(safe-area-inset-top)')
    || !lojaWorldStyles.includes('@media(max-width:430px)')
    || !lojaWorldStyles.includes('@media(orientation:landscape)')
    || !lojaWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(lojaWorldStyles)) {
    throw new Error('work13-loja-world-styles-missing');
  }
  if (!app.includes("premium-world-v623.js?v=623-sala-das-chaves")
    || !app.includes('createPremiumWorldV623({')
    || !app.includes('window.orbe.premiumWorld = premiumWorld')
    || !app.includes('window.divinaWork13PremiumWorldV623')
    || !app.includes("stage:'renovacao-dos-mundos-10-premium'")
    || !app.includes("universe:'sala-das-chaves'")) {
    throw new Error('work13-premium-world-app-mismatch');
  }
  if (!premiumWorld?.includes('PREMIUM_WORLD_CONTRACT_V623')
    || !premiumWorld.includes("universe:'sala-das-chaves'")
    || !premiumWorld.includes("identity:'obsidian-champagne-gold-peacock-teal-ivory'")
    || !premiumWorld.includes('premiumLifetimeCents:19990')
    || !premiumWorld.includes('skinsIncluded:30')
    || !premiumWorld.includes('aiIncludedInPremium:false')
    || !premiumWorld.includes('aiMonthlyCents:8990')
    || !premiumWorld.includes('aiCreditsPerCycle:400')
    || !premiumWorld.includes("environment:'staging'")
    || !premiumWorld.includes('simulatorOnly:true')
    || !premiumWorld.includes('realBilling:false')
    || !premiumWorld.includes('serverAuthority:true')
    || !premiumWorld.includes('frontendEntitlementGrants:false')
    || !premiumWorld.includes('billingPayloadReads:0')
    || !premiumWorld.includes('paymentDataReads:0')
    || !premiumWorld.includes('privateContentReads:0')
    || !premiumWorld.includes('networkCalls:0')
    || !premiumWorld.includes('reusesCanonicalOrb:true')
    || !premiumWorld.includes('permanentAnimationLoops:0')
    || !premiumWorld.includes('mutationObservers:0')
    || !premiumWorld.includes('deferredTimers:0')
    || !premiumWorld.includes('work14:false')) {
    throw new Error('work13-premium-world-contract-missing');
  }
  if (!premiumWorldStyles?.includes('[data-work13-premium-world="v623"]')
    || !premiumWorldStyles.includes('[data-premium-world="v623"]')
    || !premiumWorldStyles.includes('[data-premium-world-phase="keys"]')
    || !premiumWorldStyles.includes('[data-premium-world-phase="premium"]')
    || !premiumWorldStyles.includes('[data-premium-world-phase="ai"]')
    || !premiumWorldStyles.includes('[data-premium-world-phase="access"]')
    || !premiumWorldStyles.includes('.premium-v191-hero')
    || !premiumWorldStyles.includes('.premium-v191-ai')
    || !premiumWorldStyles.includes('.premium-v191-lifecycle')
    || !premiumWorldStyles.includes('env(safe-area-inset-top)')
    || !premiumWorldStyles.includes('@media(max-width:430px)')
    || !premiumWorldStyles.includes('@media(orientation:landscape)')
    || !premiumWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(premiumWorldStyles)) {
    throw new Error('work13-premium-world-styles-missing');
  }
  if (!app.includes("conta-world-v624.js?v=624-casa-do-retorno")
    || !app.includes('createContaWorldV624({')
    || !app.includes('window.orbe.contaWorld = contaWorld')
    || !app.includes('window.divinaWork13ContaWorldV624')
    || !app.includes("stage:'renovacao-dos-mundos-11-conta'")
    || !app.includes("universe:'casa-do-retorno'")) {
    throw new Error('work13-conta-world-app-mismatch');
  }
  if (!contaWorld?.includes('CONTA_WORLD_CONTRACT_V624')
    || !contaWorld.includes("universe:'casa-do-retorno'")
    || !contaWorld.includes("identity:'midnight-blue-sea-glass-silver-dawn-ivory'")
    || !contaWorld.includes("accountAuthority:'V201-preserved'")
    || !contaWorld.includes("accountWorldAuthority:'V319-preserved'")
    || !contaWorld.includes('authSessionStorageOnly:true')
    || !contaWorld.includes('authLocalStorageTokens:false')
    || !contaWorld.includes('serverAuthority:true')
    || !contaWorld.includes('rowLevelSecurityPreserved:true')
    || !contaWorld.includes('journalCloudConsentDefault:false')
    || !contaWorld.includes('marketingConsentDefault:false')
    || !contaWorld.includes('formValueReads:0')
    || !contaWorld.includes('passwordReads:0')
    || !contaWorld.includes('emailReads:0')
    || !contaWorld.includes('profileReads:0')
    || !contaWorld.includes('authPayloadReads:0')
    || !contaWorld.includes('journalBodyReads:0')
    || !contaWorld.includes('privateContentReads:0')
    || !contaWorld.includes('networkCalls:0')
    || !contaWorld.includes('reusesCanonicalOrb:true')
    || !contaWorld.includes('permanentAnimationLoops:0')
    || !contaWorld.includes('mutationObservers:0')
    || !contaWorld.includes('deferredTimers:0')
    || !contaWorld.includes('work14:false')) {
    throw new Error('work13-conta-world-contract-missing');
  }
  if (!contaWorldStyles?.includes('[data-work13-conta-world="v624"]')
    || !contaWorldStyles.includes('[data-conta-world="v624"]')
    || !contaWorldStyles.includes('[data-conta-world-phase="authentication"]')
    || !contaWorldStyles.includes('[data-conta-world-phase="continuity"]')
    || !contaWorldStyles.includes('[data-conta-world-phase="security"]')
    || !contaWorldStyles.includes('[data-conta-world-phase="data"]')
    || !contaWorldStyles.includes('#accountWorldV319')
    || !contaWorldStyles.includes('.account-v189-form')
    || !contaWorldStyles.includes('.account-v189-security')
    || !contaWorldStyles.includes('env(safe-area-inset-top)')
    || !contaWorldStyles.includes('@media(max-width:430px)')
    || !contaWorldStyles.includes('@media(orientation:landscape)')
    || !contaWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(contaWorldStyles)) {
    throw new Error('work13-conta-world-styles-missing');
  }
  if (!app.includes("musica-world-v625.js?v=625-palco-das-estrelas")
    || !app.includes('createMusicaWorldV625({')
    || !app.includes('window.orbe.musicaWorld = musicaWorld')
    || !app.includes('window.divinaWork13MusicaWorldV625')
    || !app.includes("stage:'renovacao-dos-mundos-12-musica'")
    || !app.includes("universe:'palco-das-estrelas'")) {
    throw new Error('work13-musica-world-app-mismatch');
  }
  if (!musicaWorld?.includes('MUSICA_WORLD_CONTRACT_V625')
    || !musicaWorld.includes("universe:'palco-das-estrelas'")
    || !musicaWorld.includes("identity:'cosmic-black-violet-magenta-champagne-starlight'")
    || !musicaWorld.includes("musicAuthority:'V559-preserved'")
    || !musicaWorld.includes("livingMediaAuthority:'V609-preserved'")
    || !musicaWorld.includes("title:'Sobre as Estrelas'")
    || !musicaWorld.includes("title:'Z'")
    || !musicaWorld.includes('verifiedTracks:18')
    || !musicaWorld.includes('inventedAlbums:0')
    || !musicaWorld.includes('inventedTracks:0')
    || !musicaWorld.includes('futureReleasesAdminEditable:true')
    || !musicaWorld.includes('draftPublishedFlowPreserved:true')
    || !musicaWorld.includes('publishedCatalogueOnly:true')
    || !musicaWorld.includes("officialPlayer:'spotify-embed-or-official-link'")
    || !musicaWorld.includes('playerLoadsAfterExplicitGesture:true')
    || !musicaWorld.includes('playbackNeverStartsOnArrival:true')
    || !musicaWorld.includes('autoplay:false')
    || !musicaWorld.includes('maximumActivePlayers:1')
    || !musicaWorld.includes("canonicalOrbResponse:'existing-pulse-only'")
    || !musicaWorld.includes('listeningHistoryReads:0')
    || !musicaWorld.includes('privateContentReads:0')
    || !musicaWorld.includes('networkCalls:0')
    || !musicaWorld.includes('reusesCanonicalOrb:true')
    || !musicaWorld.includes('newPlayers:0')
    || !musicaWorld.includes('permanentAnimationLoops:0')
    || !musicaWorld.includes('mutationObservers:0')
    || !musicaWorld.includes('deferredTimers:0')
    || !musicaWorld.includes('work14:false')) {
    throw new Error('work13-musica-world-contract-missing');
  }
  if (!musicaWorldStyles?.includes('[data-work13-musica-world="v625"]')
    || !musicaWorldStyles.includes('[data-musica-world="v625"]')
    || !musicaWorldStyles.includes('[data-musica-world-phase="albums"]')
    || !musicaWorldStyles.includes('[data-musica-world-phase="album"]')
    || !musicaWorldStyles.includes('[data-musica-world-phase="tracks"]')
    || !musicaWorldStyles.includes('[data-musica-world-phase="playing"]')
    || !musicaWorldStyles.includes('.mv559-catalog')
    || !musicaWorldStyles.includes('.mv559-release-card')
    || !musicaWorldStyles.includes('.mv559-player-slot')
    || !musicaWorldStyles.includes('env(safe-area-inset-top)')
    || !musicaWorldStyles.includes('@media(max-width:430px)')
    || !musicaWorldStyles.includes('@media(orientation:landscape)')
    || !musicaWorldStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(musicaWorldStyles)) {
    throw new Error('work13-musica-world-styles-missing');
  }
  if (!app.includes("videos-world-v626.js?v=626-cinema-da-orbe")
    || !app.includes('createVideosWorldV626({')
    || !app.includes('window.orbe.videosWorld = videosWorld')
    || !app.includes('window.divinaWork13VideosWorldV626')
    || !app.includes("event.data?.type === 'DIVINA_WORK13_VIDEOS_WORLD_ACTIVE'")
    || !app.includes("stage:'renovacao-dos-mundos-13-videos'")
    || !app.includes("universe:'cinema-da-orbe'")) {
    throw new Error('work13-videos-world-app-mismatch');
  }
  if (!index.includes('VÍDEOS · CINEMA DA ORBE · V626')
    || !index.includes('Seus Memojis têm palco')
    || !index.includes('id="adminMemojiV626Host"')
    || !index.includes('kyphdsamyygavmkzyezr.storage.supabase.co')) {
    throw new Error('work13-videos-world-index-mismatch');
  }
  if (!videosWorld?.includes('VIDEOS_WORLD_CONTRACT_V626')
    || !videosWorld.includes("universe:'cinema-da-orbe'")
    || !videosWorld.includes("channels:Object.freeze(['memoji-native','de-frente-com-o-tarot-youtube'])")
    || !videosWorld.includes("memojiUpload:'signed-resumable-tus'")
    || !videosWorld.includes('iphoneDirectUpload:true')
    || !videosWorld.includes('privateStorage:true')
    || !videosWorld.includes('publicSignedPlayback:true')
    || !videosWorld.includes("adminAuthority:'owner-confirmed-email-mfa-aal2-active-session-recovery-codes'")
    || !videosWorld.includes('officialEpisodesAtRelease:0')
    || !videosWorld.includes('inventedEpisodes:0')
    || !videosWorld.includes('playerLoadsAfterExplicitGesture:true')
    || !videosWorld.includes('autoplay:false')
    || !videosWorld.includes('maximumActivePlayers:1')
    || !videosWorld.includes("video.setAttribute('playsinline','')")
    || !videosWorld.includes("safeCall(engine,'unloadPlayer',true)")
    || !videosWorld.includes("action:'prepare_upload'")
    || !videosWorld.includes("'Tus-Resumable':'1.0.0'")
    || !videosWorld.includes('CHUNK_BYTES = 6 * 1024 * 1024')
    || !videosWorld.includes('work14:false')) {
    throw new Error('work13-videos-world-contract-missing');
  }
  if (!videosWorldStyles?.includes('#videos[data-videos-world="v626"]')
    || !videosWorldStyles.includes('.vw626-portals')
    || !videosWorldStyles.includes('.vw626-player-shell video')
    || !videosWorldStyles.includes('.am626-portals')
    || !videosWorldStyles.includes('.am626-progress')
    || !videosWorldStyles.includes('env(safe-area-inset-bottom)')
    || !videosWorldStyles.includes('@media (max-width:540px)')
    || !videosWorldStyles.includes('@media (prefers-reduced-motion:reduce)')) {
    throw new Error('work13-videos-world-styles-missing');
  }
  if (!app.includes("skins-world-v627.js?v=627-atelie-dos-universos")
    || !app.includes('createSkinsWorldV627({')
    || !app.includes('window.orbe.skinsWorld = skinsWorld')
    || !app.includes('window.orbe.atelieDosUniversos = skinsWorld')
    || !app.includes('stabilizeAtelierShortcutV627')
    || !app.includes('window.divinaWork13SkinsWorldV627')
    || !app.includes("event.data?.type === 'DIVINA_WORK13_SKINS_WORLD_ACTIVE'")
    || !app.includes("stage:'renovacao-dos-mundos-14-skins'")
    || !app.includes("universe:'atelie-dos-universos'")
    || !app.includes('window.divinaCosmosVivo = window.divinaWork13SkinsWorldV627')) {
    throw new Error('work13-skins-world-app-mismatch');
  }
  if (!index.includes('SKINS · ATELIÊ DOS UNIVERSOS · V627')
    || !index.includes('Mude o cosmos sem mudar a sua leitura.')
    || !index.includes('data-go="skins">Skins · Ateliê</button>')
    || !index.includes('version:627,base:626')) {
    throw new Error('work13-skins-world-index-mismatch');
  }
  if (!skinsWorld?.includes('SKINS_WORLD_CONTRACT_V627')
    || !skinsWorld.includes("universe:'atelie-dos-universos'")
    || !skinsWorld.includes("sequence:Object.freeze([\n    'arrival','current-form','one-explicit-choice','atelier-on-request','preview'")
    || !skinsWorld.includes('totalSkins:30')
    || !skinsWorld.includes("freeSkin:'classic'")
    || !skinsWorld.includes('freeSkins:1')
    || !skinsWorld.includes('paidSkins:29')
    || !skinsWorld.includes('individualPurchase:true')
    || !skinsWorld.includes('premiumIncludesAllSkins:true')
    || !skinsWorld.includes('priceTiersCents:Object.freeze([1990,2990,3990,4990])')
    || !skinsWorld.includes('cosmeticOnly:true')
    || !skinsWorld.includes('tarotLogicChanges:0')
    || !skinsWorld.includes('previewRequiresOwnership:false')
    || !skinsWorld.includes('previewGrantsEntitlement:false')
    || !skinsWorld.includes("entitlementAuthority:'account-server-snapshot'")
    || !skinsWorld.includes('frontendEntitlementGrants:false')
    || !skinsWorld.includes('restoreAcrossDevices:true')
    || !skinsWorld.includes('offlineActiveSkin:true')
    || !skinsWorld.includes('globalApplyWithoutReload:true')
    || !skinsWorld.includes('this.engine = new this.dependencies.Engine(this.engineHost)')
    || !skinsWorld.includes("this.engine.choose?.(this.selectedId)")
    || !skinsWorld.includes("this.orbCore?.pulse?.('skin-preview-touch'")
    || !skinsWorld.includes('realBilling:false')
    || !skinsWorld.includes('newOrbs:0')
    || !skinsWorld.includes('newCanvases:0')
    || !skinsWorld.includes('permanentAnimationLoops:0')
    || !skinsWorld.includes("nextReality:'notifications'")
    || !skinsWorld.includes('work14:false')) {
    throw new Error('work13-skins-world-contract-missing');
  }
  if (!skinsWorldStyles?.includes('#skins[data-skins-world="v627"]')
    || !skinsWorldStyles.includes('.skw627-preview')
    || !skinsWorldStyles.includes('.skw627-depth[hidden]')
    || !skinsWorldStyles.includes('.skins-v191-grid')
    || !skinsWorldStyles.includes('env(safe-area-inset-bottom)')
    || !skinsWorldStyles.includes('@media (max-width:430px)')
    || !skinsWorldStyles.includes('@media (max-height:470px) and (orientation:landscape)')
    || !skinsWorldStyles.includes('@media (prefers-reduced-motion:reduce)')
    || !skinsWorldStyles.includes('@media (prefers-contrast:more)')
    || !skinsWorldStyles.includes('@media (forced-colors:active)')
    || /@keyframes|animation\s*:|backdrop-filter|filter\s*:/.test(skinsWorldStyles)) {
    throw new Error('work13-skins-world-styles-missing');
  }
  if (!entryIntention?.includes('COSMOS_ENTRY_INTENTION_CONTRACT_V610')
    || !entryIntention.includes("invitation:'pentagrama-vermelho'")
    || !entryIntention.includes('entryIntentions:1')
    || !entryIntention.includes("correction:'menu-global-vivo-persistente'")
    || !entryIntention.includes('visibleEntryWords:0')
    || !entryIntention.includes('pentagramIsMenu:true')
    || !entryIntention.includes('globalPentagram:true')
    || !entryIntention.includes("pentagramPosition:'top-corner'")
    || !entryIntention.includes('globalMenuOnEveryPage:true')
    || !entryIntention.includes('pentagramVisibleWhileMenuOpen:true')
    || !entryIntention.includes('pentagramTogglesMenu:true')
    || !entryIntention.includes('arrivalStateRecovery:true')
    || !entryIntention.includes('maximumVisibleIntentions:2')
    || !entryIntention.includes("menuLife:'birth-breath-answer-silence'")
    || !entryIntention.includes('whitInsideMenu:true')
    || !entryIntention.includes("tarotOrbAction:'reveal-only'")
    || !entryIntention.includes('tarotOrbOpensMenu:false')
    || !entryIntention.includes('tarotOrbMenuListenersBypassed:true')
    || !entryIntention.includes("ai:'Whit'")
    || !entryIntention.includes('reusesCanonicalOrb:true')
    || !entryIntention.includes('reusesLivingMenuV593:true')
    || !entryIntention.includes('globalOrbMenuCycle:true')
    || !entryIntention.includes('everyRealityCanCallUniverse:true')
    || !entryIntention.includes('realityOwnedOrbActionsPreserved:true')
    || !entryIntention.includes('journalThresholdOrbActionPreserved:true')
    || (entryIntention.match(/if \(this\.route === 'tarot'\) return;/g) || []).length < 3
    || !entryIntention.includes('body.append(this.entry)')
    || !entryIntention.includes("'divina:work12-state'")
    || !entryIntention.includes("'divina:supreme-orb-did-navigate'")
    || !entryIntention.includes("'divina:experience-intelligence-state'")
    || !entryIntention.includes('this.toggleUniverse(')
    || !entryIntention.includes('menu.close({ restoreFocus:false')
    || !entryIntention.includes("target?.closest?.('[data-daily-orb-host]')")
    || !entryIntention.includes("target?.closest?.('#spreadResult')")
    || !entryIntention.includes("target.closest('[data-v585-orb-host]')")
    || !entryIntention.includes('Orbe viva. Toque para entrar e escrever no Diário')
    || !entryIntention.includes("this.openUniverse('orb-world')")
    || !entryIntention.includes('publicRealityNames:15')
    || !entryIntention.includes('automaticNavigation:false')
    || !entryIntention.includes('newCanvases:0')
    || !entryIntention.includes('work14:false')) {
    throw new Error('work13-entry-contract-missing');
  }
  if (!entryStyles?.includes('.cosmos-entry-intent')
    || !entryStyles.includes('position:fixed')
    || !entryStyles.includes('env(safe-area-inset-right)')
    || !entryStyles.includes('[data-work13-menu="pentagram-v613"] #menuBtn.menu-button')
    || !entryStyles.includes('[data-response="menu-open"]')
    || !entryStyles.includes('db613MenuCurrent')
    || !entryStyles.includes('db613MenuSoul')
    || !entryStyles.includes('.cosmos-entry-intent__whit')
    || !entryStyles.includes('db611PentagramBreath')
    || !entryStyles.includes('db611WhitHeartbeat')
    || !entryStyles.includes('[data-v502-route="ai"]')
    || !entryStyles.includes('.db502-portal__verb')
    || !entryStyles.includes('@media(max-width:430px)')
    || !entryStyles.includes('@media(prefers-reduced-motion:reduce)')
    || /backdrop-filter|filter\s*:/.test(entryStyles)) {
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
  if (!pageLoader.includes("skins-world-v627.js?v=627-atelie-dos-universos")
    || !pageLoader.includes("skins-world-v627.css?v=627-atelie-dos-universos")
    || !pageLoader.includes('globalThis.divinaWork13SkinsInstanceV627')
    || !pageLoader.includes('module.createSkinsWorldV627({')) {
    throw new Error('work13-page-loader-skins-mismatch');
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
        client.postMessage({ type:'DIVINA_WORK13_ENTRY_ACTIVE', version:VERSION, correction:'menu-global-vivo-persistente', symbol:'pentagrama-vermelho', position:'top-corner', globalMenuOnEveryPage:true, pentagramVisibleWhileMenuOpen:true, pentagramTogglesMenu:true, arrivalStateRecovery:true, visibleEntryWords:0, whitInsideMenu:true, tarotOrbAction:'reveal-only', tarotOrbMenuListenersBypassed:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_PENTAGRAM_MENU_ACTIVE', version:VERSION, symbol:'pentagrama-vermelho', position:'top-corner', global:true, globalMenuOnEveryPage:true, pentagramVisibleWhileMenuOpen:true, pentagramTogglesMenu:true, arrivalStateRecovery:true, publicWorlds:15, maximumVisibleIntentions:2, menuLife:'birth-breath-answer-silence', whitInsideMenu:true, tarotOrbAction:'reveal-only', tarotOrbOpensMenu:false, tarotOrbMenuListenersBypassed:true, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_FINAL_PRESENCE_ACTIVE', version:VERSION, correction:'lapidacao-final-presenca-das-realidades', publicWorlds:15, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_GLOBAL_MENU_ACTIVE', version:VERSION, correction:'menu-global-ciclo-vivo', publicWorlds:15, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_TAROT_SOUL_ACTIVE', version:VERSION, reality:'tarot', universe:'camara-do-vazio-violeta', cards:78, reversed:false, meanings:false, orbAlone:true, orbitingLists:false, tableDeferred:true, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_TAROT_WORLD_ACTIVE', version:VERSION, reality:'tarot', universe:'camara-do-vazio-violeta', sequence:['arrival','orb-alone','touch','card','silence','freedom'], revealEvent:'tarot:supreme-revealed', tarotOrbAction:'reveal-only', pentagramMenu:true, oneOrb:true, base:613, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_DAILY_SOUL_ACTIVE', version:VERSION, reality:'daily', cardsPerBrasiliaDay:1, timeZone:'America/Sao_Paulo', reversed:false, oneSentenceEssence:true, depthExplicit:true, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_DAILY_WORLD_ACTIVE', version:VERSION, reality:'daily', universe:'santuario-da-aurora', sequence:['arrival','orb','touch','card','silence','one-sentence-essence','depth-on-explicit-request'], cardsPerBrasiliaDay:1, timeZone:'America/Sao_Paulo', reversed:false, oneSentenceEssence:true, depthExplicit:true, pentagramMenu:true, oneOrb:true, base:615, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_SPREADS_SOUL_ACTIVE', version:VERSION, reality:'spreads', methods:15, freeMethods:4, premiumMethods:11, celticCrossPositions:10, royalTableCards:78, oneSentenceSynthesis:true, depthExplicit:true, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_SPREADS_WORLD_ACTIVE', version:VERSION, reality:'spreads', universe:'concilio-das-constelacoes', sequence:['arrival','choice','orb','card-and-position','silence','essence','cards-in-conversation','one-sentence-synthesis','depth-on-explicit-request'], methods:15, freeMethods:4, premiumMethods:11, celticCrossPositions:10, royalTableCards:78, royalTableGeometry:'13x6', oneSentenceSynthesis:true, depthExplicit:true, pentagramMenu:true, oneOrb:true, base:616, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_SCHOOL_SOUL_ACTIVE', version:VERSION, reality:'school', universe:'jardim-arcano-do-conhecimento', stages:3, modules:17, lessons:124, cardLessons:78, oneNextLesson:true, programmeExplicit:true, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_SCHOOL_WORLD_ACTIVE', version:VERSION, reality:'school', universe:'jardim-das-78-sementes', sequence:['arrival','one-living-seed','one-next-lesson','one-whole-lesson','practice','root','silence','programme-on-explicit-request'], stages:3, modules:17, lessons:124, cardLessons:78, theoryPracticeLessons:46, freeLessons:17, premiumLessons:107, oneNextLesson:true, oneWholeLesson:true, programmeExplicit:true, foundationsFree:true, premiumOffline:true, pentagramMenu:true, oneOrb:true, base:617, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_LIBRARY_SOUL_ACTIVE', version:VERSION, reality:'library', universe:'arquivo-de-luz-sala-dos-fios-vivos', cards:78, uprightOnly:true, reversed:false, pageSize:18, oneDiscoveryFirst:true, onePrimaryChoice:true, catalogueExplicit:true, catalogueDeferred:true, readerDeferred:true, symbolicThreads:5, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_LIBRARY_WORLD_ACTIVE', version:VERSION, reality:'library', universe:'arquivo-de-luz-sala-dos-fios-vivos', sequence:['arrival','threshold','one-discovery','silence','symbolic-thread','related-doors','catalogue-on-explicit-request'], pentagramMenu:true, oneOrb:true, base:614, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_JOURNAL_SOUL_ACTIVE', version:VERSION, reality:'journal', universe:'camara-da-tinta-lunar', privateByDefault:true, directWritingFirst:true, silentAutosave:true, timelinePageSize:12, mirrorAggregateOnly:true, mirrorDiagnosis:false, oneOrb:true, base:600, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_JOURNAL_WORLD_ACTIVE', version:VERSION, reality:'journal', universe:'camara-da-tinta-viva', sequence:['arrival','orb-threshold','blank-page','direct-writing','silent-autosave','ink-settles','optional-details','memories-on-explicit-request','aggregate-mirror-on-explicit-request','return','silence'], directWritingFirst:true, blankPageFirst:true, silentAutosave:true, privateByDefault:true, adminBodyAccess:false, analyticsBodyAccess:false, whitSilentRead:false, whitShareRequiresExplicitTemporaryConsent:true, timelinePageSize:12, mirrorAggregateOnly:true, mirrorDiagnosis:false, mirrorPrediction:false, offline:true, syncConflictProtection:true, pentagramMenu:true, oneOrb:true, base:618, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_WHIT_WORLD_ACTIVE', version:VERSION, reality:'ai', universe:'presenca-entre-mundos', sequence:['arrival','silence','one-explicit-invitation','listening','one-local-response','visible-session-trace','context-on-explicit-consent','return','silence'], localDefault:true, accountRequired:false, sessionMemoryTurns:6, sessionMemoryPersistent:false, sessionMemoryVisible:true, contextExplicitConsent:true, privateByDefault:true, privateContentReads:0, journalSilentReads:0, schoolNoteSilentReads:0, tarotQuestionSilentReads:0, automaticSpeech:false, pentagramMenu:true, oneOrb:true, base:619, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_CONSULTAS_WORLD_ACTIVE', version:VERSION, reality:'consultations', universe:'templo-do-encontro', sequence:['arrival','one-clear-intention','four-human-readings','one-explicit-choice','essential-contact','private-question-or-context','review','email-handoff','private-protocol','return','silence'], services:4, servicePricesCents:[25000,20000,15000,5000], priceSnapshot:true, futurePricesAdminEditable:true, previousOrdersImmutable:true, humanReadingOnly:true, separateFromPremium:true, emailRequired:true, phoneRequired:true, whatsappRequired:false, operationalContact:'orbedasrealidades@hotmail.com', emailOnly:true, onlineOnly:true, automaticEmail:false, realBilling:false, privateContentReads:0, formValueReads:0, questionReads:0, contactReads:0, protocolReads:0, pentagramMenu:true, oneOrb:true, base:620, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_LOJA_WORLD_ACTIVE', version:VERSION, reality:'store', universe:'casa-das-escolhas-vivas', sequence:['arrival','one-clear-intention','four-curated-paths','one-explicit-path','twenty-one-curated-choices','category-search-or-favorites-on-explicit-request','product-truth','external-amazon-passage','return','silence'], products:21, intentionPaths:4, categories:9, productCategories:8, featuredChoices:7, destinationHost:'www.amazon.com.br', checkout:'external-amazon-only', affiliateDisclosureAdjacent:true, affiliateTagAuthority:'V543-config-preserved', affiliateTagHardcodedByV622:false, priceCache:false, stockCache:false, ratingCache:false, fakeDiscountClaims:0, fakeScarcityClaims:0, officialPartnershipClaim:false, searchLocalOnly:true, favoritesLocalOnly:true, privateContentReads:0, searchTextReads:0, favoritesReads:0, affiliateUrlReads:0, pentagramMenu:true, oneOrb:true, base:621, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_PREMIUM_WORLD_ACTIVE', version:VERSION, reality:'subscriptions', universe:'sala-das-chaves', sequence:['arrival','one-clear-intention','three-explicit-keys','one-explicit-chamber','price-truth','staging-action','server-confirmed-rights','return','silence'], premiumLifetimeCents:19990, premiumBillingMode:'one-time', skinsIncluded:30, aiIncludedInPremium:false, aiMonthlyCents:8990, aiCreditsPerCycle:400, extraCreditPacks:[[200,3990],[600,9990],[1500,19990]], environment:'staging', simulatorOnly:true, realBilling:false, serverAuthority:true, frontendEntitlementGrants:false, billingPayloadReads:0, paymentDataReads:0, privateContentReads:0, pentagramMenu:true, oneOrb:true, base:622, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_CONTA_WORLD_ACTIVE', version:VERSION, reality:'login', universe:'casa-do-retorno', sequence:['arrival','one-clear-intention','authenticate-or-continue','one-explicit-area','server-confirmed-state','control-data-and-sessions','return','silence'], accountAuthority:'V201-preserved', accountWorldAuthority:'V319-preserved', authSessionStorageOnly:true, authLocalStorageTokens:false, serverAuthority:true, rowLevelSecurityPreserved:true, emailVerificationPreserved:true, passwordResetPreserved:true, logoutPreserved:true, globalSessionExitPreserved:true, exportPreserved:true, accountDeletionPreserved:true, journalCloudConsentDefault:false, journalCloudSyncOptInOnly:true, marketingConsentDefault:false, formValueReads:0, passwordReads:0, emailReads:0, profileReads:0, authPayloadReads:0, journalBodyReads:0, privateContentReads:0, pentagramMenu:true, oneOrb:true, base:623, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_MUSICA_WORLD_ACTIVE', version:VERSION, reality:'music', universe:'palco-das-estrelas', sequence:['arrival','two-real-albums','one-explicit-album','tracks-on-explicit-request','one-official-player','work-in-focus','return','silence'], artist:'Hércules DX', albums:['Sobre as Estrelas','Z'], albumYears:[2024,2026], trackCounts:[10,8], verifiedTracks:18, futureReleaseTypes:['album','ep','single'], futureReleasesAdminEditable:true, draftPublishedFlowPreserved:true, publishedCatalogueOnly:true, officialPlayer:'spotify-embed-or-official-link', playerLoadsAfterExplicitGesture:true, playbackNeverStartsOnArrival:true, autoplay:false, maximumActivePlayers:1, canonicalOrbResponse:'existing-pulse-only', listeningHistoryReads:0, privateContentReads:0, pentagramMenu:true, oneOrb:true, base:624, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_VIDEOS_WORLD_ACTIVE', version:VERSION, reality:'videos', universe:'cinema-da-orbe', channels:['memoji-native','de-frente-com-o-tarot-youtube'], primaryChannel:'memoji-native', memojiRole:'rosto-e-voz-da-orbe', memojiUpload:'signed-resumable-tus', iphoneDirectUpload:true, acceptedVideoTypes:['video/mp4','video/quicktime','video/webm','video/x-m4v'], privateStorage:true, publicSignedPlayback:true, ownerMfaRequired:true, editorialStates:['draft','review','scheduled','published','archived'], officialEpisodesAtRelease:0, inventedEpisodes:0, publicPublishedOnly:true, playerLoadsAfterExplicitGesture:true, autoplay:false, maximumActivePlayers:1, pentagramMenu:true, oneOrb:true, base:625, complete:true });
        client.postMessage({ type:'DIVINA_WORK13_SKINS_WORLD_ACTIVE', version:VERSION, reality:'skins', universe:'atelie-dos-universos', sequence:['arrival','current-form','one-explicit-choice','atelier-on-request','preview','server-authorized-apply','three-world-continuity','return','silence'], totalSkins:30, freeSkins:1, paidSkins:29, individualPurchase:true, premiumIncludesAllSkins:true, priceTiersCents:[1990,2990,3990,4990], cosmeticOnly:true, previewGrantsEntitlement:false, entitlementAuthority:'account-server-snapshot', frontendEntitlementGrants:false, restoreAcrossDevices:true, offlineActiveSkin:true, globalApplyWithoutReload:true, tarotLogicChanges:0, realBilling:false, pentagramMenu:true, oneOrb:true, base:626, complete:true });
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
