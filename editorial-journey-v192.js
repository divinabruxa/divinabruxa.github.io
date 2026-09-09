/* DIVINA BRUXA V192 — JORNADA EDITORIAL SEM ESCRITA EXTERNA */
const CHANNELS = new Set(['store', 'music', 'videos']);

export class EditorialJourneyV192 {
  constructor(root, channel) {
    this.root = root || null;
    this.channel = CHANNELS.has(channel) ? channel : 'editorial';
    if (!this.root) return;
    this.root.dataset.editorialJourney = this.channel;
    this.root.addEventListener('click', this.onClick, { passive: true });
  }

  onClick = event => {
    const action = event.target?.closest?.('a,button');
    if (!action) return;
    this.root.dispatchEvent(new CustomEvent('divina:editorial-action', {
      bubbles: true,
      detail: Object.freeze({ channel: this.channel, transport: 'local-only' })
    }));
  };

  destroy() {
    this.root?.removeEventListener('click', this.onClick);
  }
}
