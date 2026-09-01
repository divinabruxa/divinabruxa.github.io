// Gate de interface; a decisão final deve ser confirmada no backend.
export function hasPremium(entitlement) {
  return entitlement?.state === 'active' && entitlement?.productId === 'divina-premium-lifetime';
}

export function featureAccess(feature, entitlement) {
  const premiumFeatures = new Set(['academy-17-modules','card-lessons-78','flashcards','quizzes','error-review','spreads-24-plus','custom-spread-builder','advanced-real-table','mirror-advanced','offline-content','skins-30','seasonal-workbooks']);
  return !premiumFeatures.has(feature) || hasPremium(entitlement);
}

export function explainAccess(feature, entitlement) {
  return featureAccess(feature, entitlement) ? 'available' : 'premium-required';
}
