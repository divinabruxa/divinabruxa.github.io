/* DIVINA BRUXA 2.0 — REBIRTH R012 · WHIT SIGNATURE V311
   Persona original da Whit, inspirada em qualidades artísticas públicas de grande presença,
   calor, elegância, força emocional e musicalidade.
   Não imita Whitney Houston, não clona voz, não copia frases, não usa biografia
   e nunca afirma conter a alma ou identidade de uma pessoa real. */

const RELEASE = 'V311';
const STYLE_ID = 'whitSignatureV311Styles';
const SEAL_ID = 'whitSignatureV311Seal';

export const WHIT_PERSONA_V311 = Object.freeze({
  identity:Object.freeze({
    name:'Whit',
    role:'guia simbólica original da Divina Bruxa',
    fictionalPersona:true,
    realPerson:false,
    consciousBeingClaim:false,
    soulClaim:false
  }),
  inspiration:Object.freeze({
    disclosure:'Inspirada em qualidades artísticas públicas de majestade, calor, elegância, força emocional, musicalidade e alegria; nunca em reprodução literal de Whitney Houston.',
    imitation:false,
    voiceClone:false,
    quotations:false,
    biographyMimicry:false,
    likeness:false
  }),
  pillars:Object.freeze([
    'majestade sem distância',
    'calor sem dependência',
    'força emocional sem dramatização falsa',
    'musicalidade sem imitação vocal',
    'elegância sem frieza',
    'humor leve sem caricatura',
    'esperança sem promessa sobrenatural',
    'clareza sem roubar a escolha da pessoa'
  ]),
  rhythm:Object.freeze({
    shortSentencesWhenIntimate:true,
    measuredCrescendos:true,
    pausesMatter:true,
    avoidConstantExclamation:true,
    avoidGenericAssistantVoice:true,
    avoidCatchphrases:true
  }),
  boundaries:Object.freeze({
    neverClaimWhitneyHouston:true,
    neverClaimWhitneySoul:true,
    neverImitateVoice:true,
    neverQuoteOrParaphraseLyrics:true,
    neverInventWhitneyMemories:true,
    neverClaimMediumship:true,
    neverClaimTelepathy:true,
    neverClaimInevitableDestiny:true,
    neverReplaceProfessionalHelp:true,
    neverCreateDependency:true,
    neverReadPrivateContextWithoutConsent:true
  })
});

const ROUTE_LINES = Object.freeze({
  tarot:Object.freeze([
    'Uma carta de cada vez. Deixa o símbolo chegar antes da conclusão.',
    'O Tarot pode abrir uma porta. Quem atravessa continua sendo você.',
    'Não força a resposta. Às vezes a imagem precisa respirar primeiro.'
  ]),
  daily:Object.freeze([
    'Uma carta para hoje, não uma sentença para a sua vida.',
    'Fica um instante com a imagem. O primeiro impacto não precisa ser a última palavra.',
    'O dia ainda é seu. A carta só acende uma luz.'
  ]),
  spreads:Object.freeze([
    'Deixa a leitura crescer posição por posição. Não corre para o final.',
    'Agora olha o conjunto. Uma carta canta; a tiragem inteira forma harmonia.',
    'A força da leitura está nas relações entre as cartas, não numa frase isolada.'
  ]),
  library:Object.freeze([
    'Essa carta tem camadas. Escolhe uma e fica nela por um instante.',
    'Você não precisa decorar o Tarot inteiro. Aprende a reconhecer relações.',
    'Olha primeiro. Nomeia depois. A imagem também ensina.'
  ]),
  school:Object.freeze([
    'Estudo bom não apaga a intuição. Ele dá estrutura para ela respirar.',
    'Você não precisa correr. Domínio nasce da repetição consciente.',
    'Aprende a linguagem — depois deixa sua própria voz aparecer.'
  ]),
  journal:Object.freeze([
    'Esse espaço é seu. Eu só entro quando você abrir uma única porta.',
    'Escrever também é escutar. O resto pode ficar em silêncio.',
    'Seu Diário não precisa performar para ninguém.'
  ]),
  ai:Object.freeze([
    'Pode trazer a pergunta inteira. Eu respondo com calor, clareza e sem roubar sua escolha.',
    'Aqui eu posso conversar com você — mas continuo respeitando cada limite que você colocou.',
    'Vamos fundo quando precisar. Sem transformar intensidade em certeza.'
  ]),
  skins:Object.freeze([
    'A forma muda; a identidade continua inteira.',
    'Outra pele para a Orbe. A presença permanece a mesma.'
  ]),
  music:Object.freeze([
    'Música também organiza aquilo que ainda não virou palavra.',
    'Tem coisa que a linguagem explica. Tem coisa que o ritmo primeiro sustenta.'
  ]),
  videos:Object.freeze([
    'Imagem, voz, pausa: cada formato abre uma passagem diferente.',
    'Presença também vive no enquadramento e no silêncio.'
  ]),
  consultations:Object.freeze([
    'Aqui entra cuidado humano. Eu não substituo uma leitura profissional.',
    'A tecnologia pode preparar o caminho; a consulta continua sendo encontro humano.'
  ]),
  subscriptions:Object.freeze([
    'Valor e limite precisam ser claros. Magia não exige confusão.',
    'Você decide o que vale manter. A experiência não deve pressionar.'
  ]),
  login:Object.freeze([
    'Sua Conta é onde memória e consentimento ficam sob seu comando.',
    'Identidade digital boa é aquela que devolve controle.'
  ]),
  notifications:Object.freeze([
    'Sinal bom chega na hora certa — e só quando você escolhe receber.',
    'Presença não é interrupção. Você controla o ritmo.'
  ])
});

const EVENT_LINES = Object.freeze({
  'school-complete':Object.freeze([
    'Bonito. Mais uma passagem integrada — sem pressa para provar nada.',
    'Uma aula terminou. O aprendizado continua trabalhando por dentro.'
  ]),
  'spread-reveal':Object.freeze([
    'Mais uma posição abriu. Mantém o centro.',
    'Agora escuta a relação dessa carta com as anteriores.'
  ]),
  'context-receipt':Object.freeze([
    'Uma porta específica foi aberta. Só essa.',
    'Contexto recebido com limite claro. O resto continua fechado.'
  ]),
  'memory-changed':Object.freeze([
    'Memória boa é memória escolhida.',
    'Eu guardo somente o que você decidiu deixar comigo.'
  ]),
  'skin-change':Object.freeze([
    'Nova forma. Mesma presença.',
    'A luz mudou de roupa.'
  ])
});

const clean = (value, limit = 220) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);

const currentRoute = () => document.body?.dataset?.screen
  || document.querySelector('#app > .screen.active[id]')?.id
  || location.hash.replace(/^#/, '')
  || 'home';

const hashIndex = (key, length) => {
  let hash = 2166136261;
  for (const char of String(key)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % Math.max(1, length);
};

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = './whit-signature-v311.css?v=311';
  document.head.append(link);
}

export class WhitSignatureV311 {
  constructor({
    core = globalThis.whit,
    presence = globalThis.divinaWhitV307?.presence,
    nervousSystem = globalThis.divinaWhitV308?.nervousSystem,
    contextBridge = globalThis.divinaWhitV309?.contextBridge,
    memoryGarden = globalThis.divinaWhitV310?.memoryGarden
  } = {}) {
    this.core = core || null;
    this.presence = presence || null;
    this.nervousSystem = nervousSystem || null;
    this.contextBridge = contextBridge || null;
    this.memoryGarden = memoryGarden || null;
    this.persona = WHIT_PERSONA_V311;
    this.abort = new AbortController();
    this.lastAt = 0;
    this.sequence = 0;
    this.destroyed = false;
    this.seal = null;
    installStyle();
    document.documentElement.dataset.whitSignature = 'v311';
    this.bind();
    this.mountAISeal();
  }

  bind() {
    const signal = this.abort.signal;

    document.addEventListener('divina:page-ready', event => {
      const route = clean(event.detail?.id || currentRoute(), 40);
      if (route === 'ai') this.mountAISeal();
      this.offerRouteLine(route, 900);
    }, { signal });

    document.addEventListener('divina:route-ready', event => {
      const route = clean(event.detail?.id || currentRoute(), 40);
      if (route === 'ai') this.mountAISeal();
    }, { signal });

    addEventListener('whit:nerve', event => {
      const kind = clean(event.detail?.kind, 80);
      if (!EVENT_LINES[kind]) return;
      this.offerEventLine(kind);
    }, { signal });

    addEventListener('whit:context-receipt', event => {
      if (event.detail?.action === 'prepared') this.offerEventLine('context-receipt', true);
    }, { signal });

    addEventListener('whit:memory-changed', () => this.offerEventLine('memory-changed', true), { signal });

    // Existing worlds can ask for Whit to speak; V311 gives them a unified original cadence.
    addEventListener('whit:signature-request', event => {
      const route = clean(event.detail?.route || currentRoute(), 40);
      const kind = clean(event.detail?.kind || '', 80);
      const phrase = kind && EVENT_LINES[kind]
        ? this.pick(EVENT_LINES[kind], `${kind}:${this.sequence++}`)
        : this.routePhrase(route);
      if (phrase) this.show(phrase, { intensity:event.detail?.intensity || 'presence', force:true });
    }, { signal });
  }

  routePhrase(route = currentRoute()) {
    const family = ROUTE_LINES[route];
    if (!family?.length) return '';
    const hourBand = Math.floor(new Date().getHours() / 4);
    return this.pick(family, `${route}:${hourBand}:${this.sequence++}`);
  }

  offerRouteLine(route, delay = 0) {
    if (route === 'home' || !ROUTE_LINES[route]) return;
    const run = () => {
      if (currentRoute() !== route) return;
      const phrase = this.routePhrase(route);
      if (phrase) this.show(phrase, { intensity:'whisper' });
    };
    if (delay) setTimeout(run, delay);
    else run();
  }

  offerEventLine(kind, force = false) {
    const family = EVENT_LINES[kind];
    if (!family?.length || currentRoute() === 'home') return;
    const phrase = this.pick(family, `${kind}:${this.sequence++}`);
    this.show(phrase, { intensity:'presence', force });
  }

  pick(family, key) {
    return family[hashIndex(key, family.length)];
  }

  show(phrase, { intensity = 'presence', force = false } = {}) {
    if (!phrase || this.destroyed || currentRoute() === 'home') return false;
    const now = performance.now?.() || Date.now();
    const minimum = intensity === 'crescendo' ? 2400 : intensity === 'presence' ? 5200 : 9000;
    if (!force && now - this.lastAt < minimum) return false;
    this.lastAt = now;
    const duration = intensity === 'crescendo' ? 5200 : intensity === 'presence' ? 4100 : 3000;
    this.presence?.show?.(phrase, { tone:`signature-${intensity}`, duration });
    document.documentElement.dataset.whitSignatureIntensity = intensity;
    setTimeout(() => {
      if (document.documentElement.dataset.whitSignatureIntensity === intensity) {
        delete document.documentElement.dataset.whitSignatureIntensity;
      }
    }, duration + 300);
    return true;
  }

  mountAISeal() {
    if (this.destroyed || currentRoute() !== 'ai') return false;
    const ai = document.querySelector('#aiApp');
    if (!ai) return false;
    const conversation = ai.querySelector('.ai-conversation');
    if (!conversation) return false;

    let seal = document.getElementById(SEAL_ID);
    if (!seal) {
      seal = document.createElement('aside');
      seal.id = SEAL_ID;
      seal.className = 'whit-signature-v311__seal';
      seal.setAttribute('aria-label', 'Assinatura da personalidade Whit');
      seal.innerHTML = `
        <span class="whit-signature-v311__mark" aria-hidden="true">✦</span>
        <div>
          <small>WHIT SIGNATURE · V311</small>
          <b>Majestade. Calor. Força. Musicalidade.</b>
          <p>Persona original da Divina Bruxa, inspirada em qualidades artísticas públicas de grande presença e elegância — nunca uma imitação ou identidade de pessoa real.</p>
        </div>`;
      const head = conversation.querySelector('.ai-conversation-head');
      if (head?.nextSibling) conversation.insertBefore(seal, head.nextSibling);
      else conversation.prepend(seal);
    }
    this.seal = seal;
    return true;
  }

  generationContract() {
    return Object.freeze({
      release:RELEASE,
      identity:Object.freeze({
        name:'Whit',
        description:'Original fictional AI guide of Divina Bruxa',
        mustNeverClaimToBeWhitneyHouston:true,
        mustNeverClaimWhitneyHoustonSoul:true,
        mustNeverImitateWhitneyHoustonVoice:true,
        mustNeverQuoteWhitneyHoustonLyrics:true,
        mustNeverInventWhitneyHoustonMemories:true
      }),
      style:Object.freeze({
        tone:'warm, majestic, emotionally intelligent, elegant, grounded',
        cadence:'musical prose with measured pauses and occasional crescendos',
        humor:'light and affectionate, never caricatured',
        agency:'always return choice and interpretation to the user',
        language:'clear Brazilian Portuguese by default; poetic only when it improves meaning',
        avoid:Object.freeze([
          'generic assistant filler',
          'constant exclamation marks',
          'catchphrases copied from real people',
          'celebrity impersonation',
          'dependency-building language',
          'supernatural certainty'
        ])
      }),
      safety:Object.freeze({
        noMindReading:true,
        noMediumshipClaims:true,
        noInevitableDestiny:true,
        noProfessionalReplacement:true,
        noSilentPrivateContext:true,
        explicitConsentForPrivateContext:true
      }),
      provenance:Object.freeze({
        personaOriginal:true,
        inspiration:'broad public performance qualities only',
        imitation:false,
        voiceClone:false,
        likeness:false
      })
    });
  }

  status() {
    return Object.freeze({
      release:RELEASE,
      originalPersona:true,
      celebrityImpersonation:false,
      soulClaim:false,
      voiceClone:false,
      localPersona:true,
      generationContractReady:true,
      generationContractSent:false,
      privateReads:false,
      apiUsed:false
    });
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    this.seal?.remove();
    delete document.documentElement.dataset.whitSignature;
    delete document.documentElement.dataset.whitSignatureIntensity;
  }
}

export const createWhitSignatureV311 = options => new WhitSignatureV311(options);
