// Validações de material de loja; não envia builds nem acessa contas de loja.
export function requiredStoreAssets(asset = {}) {
  return ['icon','splash','screenshots','storeDescription','privacyUrl','termsUrl','supportUrl'].every(key => Boolean(asset[key]));
}

export function normalizeStorePrice(value, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}

export const STORE_BLOCKS = Object.freeze({ storeSubmission: false, productionBilling: false, publicRelease: false });
