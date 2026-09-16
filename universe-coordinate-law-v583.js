/* DIVINA BRUXA 2.0 — FLUIDEZ SUPREMA · MACROETAPA 4/10 · V583
   A tela não contém páginas: revela coordenadas de um único universo.
   X é viagem entre realidades, Y é mergulho e Z é descoberta.

   Esta é a única fonte de coordenadas. Ela não cria UI, canvas, relógio,
   conteúdo ou uma segunda Orbe; apenas orienta a viagem física já existente.
*/

import {
  WORLD_ROUTES_V535,
  normalizeWorldRouteV535
} from './world-truth-registry-v535.js?v=535';

export const UNIVERSE_COORDINATE_VERSION_V583 = 583;

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const freezeCoordinate = (route, values) => Object.freeze({
  route,
  x:Number(values[0]),
  y:Number(values[1]),
  z:Number(values[2]),
  horizontal:'reality-travel',
  vertical:'immersion',
  depth:'discovery'
});

// X é deliberadamente exclusivo. Assim, qualquer troca de realidade exige
// uma travessia horizontal real; nunca existe salto entre dois pontos iguais.
const coordinateSource = Object.freeze({
  home:[0,0,0],
  tarot:[-4,2,2],
  daily:[-3,1,1],
  library:[-1,2,2],
  school:[1,3,3],
  spreads:[-2,3,2],
  ai:[3,3,3],
  journal:[2,3,2],
  store:[6,1,1],
  consultations:[5,2,2],
  subscriptions:[10,2,2],
  skins:[4,1,1],
  videos:[8,2,2],
  music:[7,2,2],
  notifications:[11,1,1],
  login:[9,0,1],
  admin:[12,3,3]
});

export const UNIVERSE_COORDINATES_V583 = Object.freeze(Object.fromEntries(
  Object.entries(coordinateSource).map(([route, values]) => [route, freezeCoordinate(route, values)])
));

const JOURNEY_FORMS_V583 = Object.freeze([
  Object.freeze({ key:'crescent', bend:-0.085, crossing:0.48, approach:0.80 }),
  Object.freeze({ key:'tide', bend:0.060, crossing:0.55, approach:0.83 }),
  Object.freeze({ key:'veil', bend:-0.025, crossing:0.62, approach:0.78 }),
  Object.freeze({ key:'breath', bend:0.095, crossing:0.44, approach:0.86 })
]);

const seedFor = (value, variation = 0) => {
  const text = `${String(value || '')}:${Math.max(0,Number(variation) || 0)}`;
  let seed = 17;
  for (let index=0; index<text.length; index+=1) {
    seed = (seed*31 + text.charCodeAt(index)) >>> 0;
  }
  return seed;
};

const directionFor = (delta, positive, negative, neutral = 'still') =>
  delta > 0 ? positive : delta < 0 ? negative : neutral;

export function universeCoordinateV583(value) {
  const route = normalizeWorldRouteV535(value, 'home');
  return UNIVERSE_COORDINATES_V583[route] || UNIVERSE_COORDINATES_V583.home;
}

export function universeCoordinateKeyV583(value) {
  const point = universeCoordinateV583(value);
  return `${point.x}:${point.y}:${point.z}`;
}

export function universeJourneyVectorV583(fromValue, toValue, variation = 0) {
  const origin = universeCoordinateV583(fromValue);
  const destination = universeCoordinateV583(toValue);
  const delta = Object.freeze({
    x:destination.x-origin.x,
    y:destination.y-origin.y,
    z:destination.z-origin.z
  });
  const routeChanged = origin.route !== destination.route;
  const form = JOURNEY_FORMS_V583[
    seedFor(`${origin.route}>${destination.route}`,variation) % JOURNEY_FORMS_V583.length
  ];
  const horizontalDirection = directionFor(delta.x,'right','left');
  const verticalDirection = directionFor(delta.y,'deeper','surface','level');
  const depthDirection = directionFor(delta.z,'discover','return','hold');
  const spatialDistance = Math.hypot(delta.x,delta.y,delta.z);
  const crossingScale = clamp(1-delta.z*.042,0.86,1.14);
  return Object.freeze({
    release:'V583',
    from:origin.route,
    to:destination.route,
    origin,
    destination,
    delta,
    routeChanged,
    axes:Object.freeze({
      horizontal:'reality-travel',
      vertical:'immersion',
      depth:'discovery'
    }),
    horizontal:Object.freeze({
      direction:horizontalDirection,
      sign:Math.sign(delta.x),
      distance:Math.abs(delta.x),
      required:routeChanged
    }),
    vertical:Object.freeze({
      direction:verticalDirection,
      level:destination.y,
      delta:delta.y
    }),
    depth:Object.freeze({
      direction:depthDirection,
      level:destination.z,
      delta:delta.z,
      crossingScale
    }),
    form:Object.freeze({
      key:form.key,
      bend:form.bend,
      crossing:form.crossing,
      approach:form.approach,
      varied:true,
      semanticAxesPreserved:true
    }),
    spatialDistance,
    continuous:true,
    teleport:false,
    flicker:false,
    duplicateOrb:false
  });
}

export function auditUniverseCoordinateLawV583() {
  const canonicalRoutes = WORLD_ROUTES_V535.map(world => world.id);
  const registeredRoutes = Object.keys(UNIVERSE_COORDINATES_V583);
  const finiteCoordinates = registeredRoutes.every(route => {
    const point = UNIVERSE_COORDINATES_V583[route];
    return [point.x,point.y,point.z].every(Number.isFinite);
  });
  const uniqueHorizontalCoordinates = new Set(
    registeredRoutes.map(route => UNIVERSE_COORDINATES_V583[route].x)
  ).size === registeredRoutes.length;
  const routeParity = canonicalRoutes.length === registeredRoutes.length
    && canonicalRoutes.every(route => registeredRoutes.includes(route));
  const directedTransitions = canonicalRoutes.flatMap(from =>
    canonicalRoutes.filter(to => to !== from).map(to => universeJourneyVectorV583(from,to))
  );
  const everyRealityTransitionIsHorizontal = directedTransitions.every(vector =>
    vector.routeChanged && vector.horizontal.required && vector.horizontal.sign !== 0
  );
  const home = universeCoordinateV583('home');
  const homeIsOrigin = home.x === 0 && home.y === 0 && home.z === 0;
  return Object.freeze({
    release:'V583',
    routeCount:registeredRoutes.length,
    directedTransitionCount:directedTransitions.length,
    routeParity,
    finiteCoordinates,
    uniqueHorizontalCoordinates,
    everyRealityTransitionIsHorizontal,
    homeIsOrigin,
    oneCoordinateRegistry:true,
    valid:routeParity && registeredRoutes.length === 17 && finiteCoordinates
      && uniqueHorizontalCoordinates && everyRealityTransitionIsHorizontal && homeIsOrigin
  });
}

export function installUniverseCoordinateLawV583(documentRef = globalThis.document) {
  const root = documentRef?.documentElement;
  if (!root?.dataset) return auditUniverseCoordinateLawV583();
  const activeRoute = normalizeWorldRouteV535(
    documentRef.body?.dataset?.screen || globalThis.location?.hash || 'home',
    'home'
  );
  root.dataset.universeScreenModel = 'coordinate-reveal-v583';
  root.dataset.universeAxes = 'x-reality__y-immersion__z-discovery';
  root.dataset.universeCoordinate = universeCoordinateKeyV583(activeRoute);
  root.dataset.universePages = 'none';
  root.dataset.universeTravelLaw = 'continuous-physical-orb-v583';
  return auditUniverseCoordinateLawV583();
}

export const UNIVERSE_COORDINATE_LAW_V583 = Object.freeze({
  release:'V583',
  statement:'A tela revela coordenadas do universo.',
  screenModel:'coordinate-reveal',
  pages:false,
  axes:Object.freeze({
    horizontal:'travel-between-realities',
    vertical:'immersion',
    depth:'discovery'
  }),
  routeCount:17,
  oneCoordinateRegistry:true,
  onePhysicalOrb:true,
  continuousTravel:true,
  teleport:false,
  flicker:false,
  duplicateOrb:false,
  heavyEffectsDuringTravel:false,
  form:Object.freeze({ unpredictable:true, meaning:'coherent' }),
  voice:Object.freeze({ automaticEveryTouch:false, repeats:false, silenceIsPresence:true }),
  bubbles:Object.freeze({ oneIntention:true, fewWords:true, preserveMeaning:true }),
  practicalAreas:Object.freeze({ magic:true, clarity:'absolute' }),
  admissionRule:'anything-that-breaks-this-law-stays-out',
  iphoneFirst:true
});

export default UNIVERSE_COORDINATE_LAW_V583;
