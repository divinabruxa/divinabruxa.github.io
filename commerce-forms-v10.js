// Validação de formulário comercial; envio e pagamento ocorrem no backend aprovado.
export function validateConsultation(form = {}) {
  return Boolean(form.name?.trim() && form.email?.includes('@') && form.service && form.questionContext?.trim() && form.consent === true);
}

export function buildConsultationEmail(form) {
  if (!validateConsultation(form)) throw new Error('Formulário incompleto');
  return { to: 'orbedasrealidades@hotmail.com', subject: `Nova solicitação — ${form.service}`, replyTo: form.email, body: form.questionContext.trim() };
}

export function canShowStoreItem(item = {}) {
  return item.status === 'available' && Boolean(item.image && item.price && item.affiliateUrl && item.affiliateDisclosure);
}
