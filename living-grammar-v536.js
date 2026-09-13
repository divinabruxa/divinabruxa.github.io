/* DIVINA BRUXA — V536 · GRAMÁTICA VIVA
   Projeta o estado do Barramento de Vitalidade em atributos semânticos leves.
   Não desenha, não move a Orbe e não executa animação permanente. */

import { worldForRouteV535 } from './world-truth-registry-v535.js?v=535';

const VERSION = 536;
const INSTANCE = Symbol.for('divina.living.grammar.v536');
const STYLE_ID = 'divinaLivingGrammarV536';
const STYLE_HREF = './living-grammar-v536.css?v=536';
const DATASET_KEYS = Object.freeze([
  'lifePhase','lifePresence','lifeNetwork','lifeMotion','lifeRoute','lifeDestination',
  'lifeWorldFamily','lifeOrb','lifeMenu','lifeLoad','lifeRecovery'
]);

const installStyles = () => {
  if (document.getElementById(STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_ID;
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.append(link);
};

export const LIVING_GRAMMAR_V536 = Object.freeze({
  release:'V536', macroStage:'2-of-14', source:'vitality-bus-v536',
  publicAttributes:Object.freeze(DATASET_KEYS.map(key => `data-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`)),
  semanticDurationsMs:Object.freeze({ response:80, shift:160, journey:442 }),
  permanentAnimationLoops:0, visualEffectsAdded:0, independentOrbEngines:0
});

export class LivingGrammarV536 {
  constructor({ bus }) {
    if (!bus?.subscribe) throw new Error('vitality-bus-v536-required');
    this.bus = bus;
    this.controller = new AbortController();
    this.lastSequence = -1;
    installStyles();
    this.unsubscribe = bus.subscribe(snapshot => this.apply(snapshot), { signal:this.controller.signal });
    document.documentElement.dataset.livingGrammar = 'v536';
    queueMicrotask(() => document.dispatchEvent(new CustomEvent('divina:living-grammar-ready', {
      detail:Object.freeze({ version:VERSION, route:bus.snapshot().route })
    })));
  }

  apply(snapshot) {
    if (!snapshot || snapshot.sequence === this.lastSequence) return;
    this.lastSequence = snapshot.sequence;
    const root = document.documentElement;
    const next = {
      lifePhase:snapshot.phase,
      lifePresence:snapshot.presence,
      lifeNetwork:snapshot.network,
      lifeMotion:snapshot.motion,
      lifeRoute:snapshot.route,
      lifeDestination:snapshot.destination || '',
      lifeWorldFamily:snapshot.world?.family || 'origin',
      lifeOrb:snapshot.orb,
      lifeMenu:snapshot.menu,
      lifeLoad:snapshot.load,
      lifeRecovery:String(Boolean(snapshot.recovery))
    };
    for (const [key, value] of Object.entries(next)) {
      if (value === '') delete root.dataset[key];
      else if (root.dataset[key] !== value) root.dataset[key] = value;
    }
    document.dispatchEvent(new CustomEvent('divina:living-grammar', {
      detail:Object.freeze({ version:VERSION, sequence:snapshot.sequence, route:snapshot.route, phase:snapshot.phase })
    }));
  }

  describe(rawRoute) {
    const world = worldForRouteV535(rawRoute);
    return Object.freeze({ id:world.id, name:world.name, family:world.family, purpose:world.purpose });
  }

  status() {
    const state = this.bus.snapshot();
    return Object.freeze({
      release:'V536', macroStage:'2-of-14', route:state.route, phase:state.phase,
      worldFamily:state.world.family, semanticAttributes:DATASET_KEYS.length,
      permanentAnimationLoops:0, visualEffectsAdded:0, independentOrbEngines:0,
      privateContentReads:0, storageReads:0, storageWrites:0, apiCalls:0
    });
  }

  destroy() {
    this.controller.abort();
    this.unsubscribe?.();
    for (const key of DATASET_KEYS) delete document.documentElement.dataset[key];
    delete document.documentElement.dataset.livingGrammar;
    if (globalThis[INSTANCE] === this) delete globalThis[INSTANCE];
  }
}

export function createLivingGrammarV536(options = {}) {
  if (globalThis[INSTANCE]) return globalThis[INSTANCE];
  const grammar = new LivingGrammarV536(options);
  globalThis[INSTANCE] = grammar;
  return grammar;
}
