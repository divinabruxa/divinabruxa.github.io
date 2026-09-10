/* DIVINA BRUXA 2.0 — REBIRTH R001 · COMPATIBILIDADE V300
   O atlas visual legado foi aposentado. Os mundos agora usam o mesmo universo vivo
   e recebem suas identidades pela camada Rebirth, sem imagens cenográficas concorrentes. */
document.documentElement.dataset.legacyCosmicAtlas = 'retired-v300';
document.dispatchEvent(new CustomEvent('divina:legacy-atlas-retired', { detail:{ version:300 } }));
