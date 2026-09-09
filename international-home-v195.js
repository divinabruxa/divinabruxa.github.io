/* DIVINA BRUXA V195 — living Orb on the English and Spanish homes. */
import { RealityOrbEngine } from './orb-engine-v68.js?v=100';

const canvas = typeof document === 'undefined' ? null : document.querySelector('#orbCanvas');
const language = typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('es') ? 'es' : 'en';
const destinations = Object.freeze({
  en: './free-tarot-reading.html',
  es: './tarot-libre.html'
});

if (canvas) {
  new RealityOrbEngine(canvas, {
    onOpen: () => window.location.assign(destinations[language])
  });
}
