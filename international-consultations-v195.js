/* DIVINA BRUXA V195 — local-only consultation request composer.
   It opens the visitor's mail application and never sends or stores data. */

const form = typeof document === 'undefined' ? null : document.querySelector('[data-consultation-request]');

if (form) {
  const language = form.dataset.language === 'es' ? 'es' : 'en';
  const status = form.querySelector('[data-form-status]');
  const copy = Object.freeze({
    en: Object.freeze({
      subject: 'Consultation request — Divina Bruxa',
      labels: Object.freeze({ name:'Name', email:'Reply email', service:'Requested format', topic:'Brief context', consent:'Consent recorded on page' }),
      consent:'Yes. I understand that this only prepares an email, does not reserve a time and does not charge me.',
      opening:'Your email application is opening. Review the message before sending it.',
      invalid:'Complete the required fields and confirm consent.'
    }),
    es: Object.freeze({
      subject: 'Solicitud de consulta — Divina Bruxa',
      labels: Object.freeze({ name:'Nombre', email:'Correo de respuesta', service:'Formato solicitado', topic:'Contexto breve', consent:'Consentimiento registrado en la página' }),
      consent:'Sí. Entiendo que esto solo prepara un correo, no reserva horario y no realiza ningún cobro.',
      opening:'Se está abriendo tu aplicación de correo. Revisa el mensaje antes de enviarlo.',
      invalid:'Completa los campos obligatorios y confirma el consentimiento.'
    })
  })[language];

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) {
      status.textContent = copy.invalid;
      return;
    }
    const data = new FormData(form);
    const body = [
      `${copy.labels.name}: ${data.get('name')}`,
      `${copy.labels.email}: ${data.get('email')}`,
      `${copy.labels.service}: ${data.get('service')}`,
      '',
      `${copy.labels.topic}:`,
      String(data.get('topic') || '').trim(),
      '',
      `${copy.labels.consent}: ${copy.consent}`,
      '',
      'Language / Idioma: ' + language
    ].join('\n');
    const href = `mailto:orbedasrealidades@hotmail.com?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = copy.opening;
    window.location.href = href;
  });
}
