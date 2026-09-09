/* DIVINA BRUXA V192 — MOTOR EDITORIAL RESTAURADO PELA V197 */
import { MediaEngineV149 } from './media-engine-v149.js?v=149';

export class MediaEngineV192 extends MediaEngineV149 {
  constructor(roots, config = {}) {
    super(roots, config);
    roots?.music?.setAttribute('data-media-ready', 'v192-restored');
    roots?.videos?.setAttribute('data-media-ready', 'v192-restored');
  }
}
