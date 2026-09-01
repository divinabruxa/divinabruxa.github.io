// Validações de payload; não chama Stripe e não contém chaves.
export function checkoutLabel(productId) {
  const suffix = Math.random().toString(36).slice(2, 10).replace(/[^a-z]/g, 'a');
  return `${productId}-${suffix}`;
}

export function validateCheckoutIntent(intent = {}) {
  return Boolean(intent.productId && intent.environment === 'sandbox' && intent.integrationIdentifier && !intent.payment_method_types);
}

export function canGrantFromWebhook(event = {}, processedIds = new Set()) {
  if (!event.id || processedIds.has(event.id) || !event.signatureVerified) return false;
  return ['checkout.session.completed','invoice.paid'].includes(event.type);
}
