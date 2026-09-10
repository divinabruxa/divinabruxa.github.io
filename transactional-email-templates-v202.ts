/* DIVINA BRUXA V202 — TEMPLATES TRANSACIONAIS PT-BR / EN / ES
   Conteúdo versionado, sem rastreamento e sem HTML fornecido pelo cliente. */

export type TransactionalLocaleV202 = 'pt-BR' | 'en' | 'es';
export type TransactionalTemplateKeyV202 =
  | 'account_confirmation'
  | 'account_recovery'
  | 'consultation_owner_new'
  | 'consultation_customer_confirmation'
  | 'security_alert'
  | 'purchase_receipt'
  | 'refund_confirmation'
  | 'support_update';

export type TransactionalValuesV202 = Record<string, string | number | boolean | null | undefined>;

const OFFICIAL_ORIGINS = new Set([
  'https://divinabruxa.com.br',
  'https://www.divinabruxa.com.br',
  'https://kyphdsamyygavmkzyezr.supabase.co'
]);

const keys = Object.freeze<TransactionalTemplateKeyV202[]>([
  'account_confirmation', 'account_recovery', 'consultation_owner_new',
  'consultation_customer_confirmation', 'security_alert', 'purchase_receipt',
  'refund_confirmation', 'support_update'
]);

export const TRANSACTIONAL_TEMPLATE_KEYS_V202 = keys;

const copy = {
  'pt-BR': {
    brand: 'Divina Bruxa', universe: 'Orbe das Realidades', greeting: 'Olá',
    official: 'Canal oficial', noReply: 'Se você não iniciou esta ação, ignore a mensagem e proteja sua conta.',
    staging: 'Mensagem de teste do ambiente STAGING. Nenhuma cobrança real foi realizada.',
    open: 'ABRIR COM SEGURANÇA', protocol: 'Protocolo', service: 'Consulta', amount: 'Valor registrado',
    preference: 'Preferência', tracking: 'Código privado', status: 'Estado', device: 'Dispositivo',
    date: 'Data', receipt: 'Recibo', reason: 'Motivo', ticket: 'Atendimento',
    name: 'Nome', email: 'E-mail', phone: 'Telefone', question: 'Pergunta ou contexto',
    templates: {
      account_confirmation: ['Confirme sua conta na Divina Bruxa', 'Seu portal está quase pronto.', 'Confirme seu e-mail para concluir o cadastro.', 'CONFIRMAR CONTA'],
      account_recovery: ['Recupere sua conta com segurança', 'Recebemos um pedido de recuperação.', 'Use o acesso seguro abaixo para criar uma nova senha.', 'RECUPERAR CONTA'],
      consultation_owner_new: ['Nova solicitação de consulta', 'Uma nova solicitação chegou ao STAGING.', 'Confira os dados operacionais e responda pelo canal oficial.', 'ABRIR CONSULTAS'],
      consultation_customer_confirmation: ['Recebemos sua solicitação', 'Seu protocolo foi criado.', 'Sua solicitação foi registrada. Disponibilidade, formato e prazo serão confirmados por e-mail.', 'ACOMPANHAR SOLICITAÇÃO'],
      security_alert: ['Alerta de segurança da sua conta', 'Uma ação sensível foi registrada.', 'Revise a atividade abaixo. Se não reconhecê-la, troque sua senha e encerre as outras sessões.', 'PROTEGER MINHA CONTA'],
      purchase_receipt: ['Seu recibo da Divina Bruxa', 'Pagamento de teste confirmado.', 'Seu recibo e os direitos concedidos estão registrados abaixo.', 'VER MINHA CONTA'],
      refund_confirmation: ['Seu reembolso foi registrado', 'A devolução foi processada.', 'O reembolso foi registrado e os direitos correspondentes foram reconciliados.', 'VER DETALHES'],
      support_update: ['Atualização do seu atendimento', 'Há uma nova resposta no suporte.', 'Seu atendimento recebeu uma atualização. Consulte o estado pelo acesso seguro.', 'ABRIR ATENDIMENTO']
    }
  },
  en: {
    brand: 'Divina Bruxa', universe: 'Orb of Realities', greeting: 'Hello',
    official: 'Official channel', noReply: 'If you did not start this action, ignore this message and secure your account.',
    staging: 'Test message from the STAGING environment. No real charge was made.',
    open: 'OPEN SECURELY', protocol: 'Protocol', service: 'Reading', amount: 'Recorded amount',
    preference: 'Preference', tracking: 'Private code', status: 'Status', device: 'Device',
    date: 'Date', receipt: 'Receipt', reason: 'Reason', ticket: 'Support case',
    name: 'Name', email: 'Email', phone: 'Phone', question: 'Question or context',
    templates: {
      account_confirmation: ['Confirm your Divina Bruxa account', 'Your portal is almost ready.', 'Confirm your email address to finish creating your account.', 'CONFIRM ACCOUNT'],
      account_recovery: ['Recover your account securely', 'We received a recovery request.', 'Use the secure access below to create a new password.', 'RECOVER ACCOUNT'],
      consultation_owner_new: ['New tarot reading request', 'A new request reached STAGING.', 'Review the operational details and reply through the official channel.', 'OPEN READINGS'],
      consultation_customer_confirmation: ['We received your request', 'Your protocol was created.', 'Your request was recorded. Availability, format, and delivery time will be confirmed by email.', 'TRACK REQUEST'],
      security_alert: ['Account security alert', 'A sensitive action was recorded.', 'Review the activity below. If you do not recognize it, change your password and end other sessions.', 'SECURE MY ACCOUNT'],
      purchase_receipt: ['Your Divina Bruxa receipt', 'Test payment confirmed.', 'Your receipt and granted entitlements are recorded below.', 'VIEW MY ACCOUNT'],
      refund_confirmation: ['Your refund was recorded', 'The refund was processed.', 'The refund was recorded and the corresponding entitlements were reconciled.', 'VIEW DETAILS'],
      support_update: ['Support case update', 'There is a new support response.', 'Your support case has an update. Check its status through the secure access.', 'OPEN SUPPORT CASE']
    }
  },
  es: {
    brand: 'Divina Bruxa', universe: 'Orbe de las Realidades', greeting: 'Hola',
    official: 'Canal oficial', noReply: 'Si no iniciaste esta acción, ignora este mensaje y protege tu cuenta.',
    staging: 'Mensaje de prueba del entorno STAGING. No se realizó ningún cobro real.',
    open: 'ABRIR CON SEGURIDAD', protocol: 'Protocolo', service: 'Consulta', amount: 'Importe registrado',
    preference: 'Preferencia', tracking: 'Código privado', status: 'Estado', device: 'Dispositivo',
    date: 'Fecha', receipt: 'Recibo', reason: 'Motivo', ticket: 'Atención',
    name: 'Nombre', email: 'Correo', phone: 'Teléfono', question: 'Pregunta o contexto',
    templates: {
      account_confirmation: ['Confirma tu cuenta de Divina Bruxa', 'Tu portal está casi listo.', 'Confirma tu correo para finalizar el registro.', 'CONFIRMAR CUENTA'],
      account_recovery: ['Recupera tu cuenta con seguridad', 'Recibimos una solicitud de recuperación.', 'Usa el acceso seguro para crear una nueva contraseña.', 'RECUPERAR CUENTA'],
      consultation_owner_new: ['Nueva solicitud de consulta', 'Una nueva solicitud llegó a STAGING.', 'Revisa los datos operativos y responde por el canal oficial.', 'ABRIR CONSULTAS'],
      consultation_customer_confirmation: ['Recibimos tu solicitud', 'Tu protocolo fue creado.', 'Tu solicitud fue registrada. La disponibilidad, el formato y el plazo se confirmarán por correo.', 'SEGUIR SOLICITUD'],
      security_alert: ['Alerta de seguridad de tu cuenta', 'Se registró una acción sensible.', 'Revisa la actividad. Si no la reconoces, cambia tu contraseña y cierra las otras sesiones.', 'PROTEGER MI CUENTA'],
      purchase_receipt: ['Tu recibo de Divina Bruxa', 'Pago de prueba confirmado.', 'Tu recibo y los derechos concedidos están registrados abajo.', 'VER MI CUENTA'],
      refund_confirmation: ['Tu reembolso fue registrado', 'La devolución fue procesada.', 'El reembolso fue registrado y los derechos correspondientes fueron conciliados.', 'VER DETALLES'],
      support_update: ['Actualización de tu atención', 'Hay una nueva respuesta de soporte.', 'Tu atención recibió una actualización. Consulta el estado mediante el acceso seguro.', 'ABRIR ATENCIÓN']
    }
  }
} as const;

const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character] || character));

const clean = (value: unknown, max = 240) => String(value ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const plain = (value: unknown) => String(value ?? '').replace(/</g, '‹').replace(/>/g, '›');

export function normalizeTransactionalLocaleV202(value: unknown): TransactionalLocaleV202 {
  const locale = clean(value, 16).toLowerCase();
  if (locale === 'en' || locale.startsWith('en-')) return 'en';
  if (locale === 'es' || locale.startsWith('es-')) return 'es';
  return 'pt-BR';
}

function safeActionUrl(value: unknown) {
  try {
    const url = new URL(String(value || 'https://divinabruxa.com.br/#login'));
    if (!OFFICIAL_ORIGINS.has(url.origin) || url.protocol !== 'https:') return 'https://divinabruxa.com.br/';
    return url.toString().slice(0, 1200);
  } catch {
    return 'https://divinabruxa.com.br/';
  }
}

function detailsFor(templateKey: TransactionalTemplateKeyV202, locale: TransactionalLocaleV202, values: TransactionalValuesV202) {
  const language = copy[locale];
  const details: Array<[string, string]> = [];
  const push = (label: string, key: string, max = 300) => {
    const value = clean(values[key], max);
    if (value) details.push([label, value]);
  };
  if (templateKey.startsWith('consultation_')) {
    push(language.protocol, 'protocol', 40); push(language.service, 'serviceName', 120);
    push(language.amount, 'amountLabel', 80); push(language.preference, 'preferenceLabel', 180);
    if (templateKey === 'consultation_customer_confirmation') push(language.tracking, 'trackingCode', 100);
    if (templateKey === 'consultation_owner_new') {
      push(language.name, 'customerName', 120); push(language.email, 'customerEmail', 254);
      push(language.phone, 'customerPhone', 40); push(language.question, 'questionContext', 3000);
    }
  } else if (templateKey === 'security_alert') {
    push(language.status, 'actionLabel', 160); push(language.device, 'deviceLabel', 180); push(language.date, 'dateLabel', 100);
  } else if (templateKey === 'purchase_receipt') {
    push(language.receipt, 'receiptCode', 100); push(language.amount, 'amountLabel', 80); push(language.status, 'productName', 160);
  } else if (templateKey === 'refund_confirmation') {
    push(language.receipt, 'receiptCode', 100); push(language.amount, 'amountLabel', 80); push(language.reason, 'reasonLabel', 180);
  } else if (templateKey === 'support_update') {
    push(language.ticket, 'ticketCode', 100); push(language.status, 'statusLabel', 120); push(language.date, 'dateLabel', 100);
  }
  return details;
}

export function renderTransactionalEmailV202(
  templateKey: TransactionalTemplateKeyV202,
  localeInput: unknown,
  values: TransactionalValuesV202 = {}
) {
  if (!keys.includes(templateKey)) throw new Error('V202_TEMPLATE_NOT_ALLOWED');
  const locale = normalizeTransactionalLocaleV202(localeInput);
  const language = copy[locale];
  const [baseSubject, preview, intro, actionLabel] = language.templates[templateKey];
  const protocol = clean(values.protocol, 40);
  const subject = clean(`${baseSubject}${protocol && templateKey.includes('consultation') ? ` · ${protocol}` : ''}`, 180);
  const personName = clean(values.personName || values.customerName, 120);
  const greeting = personName ? `${language.greeting}, ${personName}.` : `${language.greeting}.`;
  const actionUrl = safeActionUrl(values.actionUrl);
  const details = detailsFor(templateKey, locale, values);
  const securityNotice = templateKey === 'account_confirmation' || templateKey === 'account_recovery' || templateKey === 'security_alert'
    ? language.noReply : '';
  const plainDetails = details.map(([label, value]) => `${plain(label)}: ${plain(value)}`).join('\n');
  const text = [plain(greeting), intro, '', plainDetails, '', securityNotice, language.staging,
    `${actionLabel}: ${actionUrl}`, `${language.official}: orbedasrealidades@hotmail.com`]
    .filter(Boolean).join('\n');
  const detailRows = details.map(([label, value]) => `<tr><td style="padding-top:8px;padding-right:12px;padding-bottom:8px;padding-left:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#cdbbe7;vertical-align:top;">${esc(label)}</td><td style="padding-top:8px;padding-right:0;padding-bottom:8px;padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:21px;color:#fff8df;vertical-align:top;text-align:right;">${esc(value)}</td></tr>`).join('');
  const html = `<!DOCTYPE html><html lang="${esc(locale)}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>${esc(subject)}</title></head><body style="margin:0;background-color:#08040d;"><table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;background-color:#08040d;"><tr><td align="center" bgcolor="#08040d" style="padding-top:28px;padding-right:14px;padding-bottom:28px;padding-left:14px;background-color:#08040d;"><table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;max-width:600px;border-width:1px;border-style:solid;border-color:#8d6b2f;border-radius:24px;background-color:#190828;"><tr><td align="center" bgcolor="#190828" style="padding-top:34px;padding-right:28px;padding-bottom:18px;padding-left:28px;background-color:#190828;"><p style="margin-top:0;margin-right:0;margin-bottom:8px;margin-left:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:32px;color:#fff5d8;">${esc(language.brand)}</p><p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;letter-spacing:2px;color:#d5b66f;text-transform:uppercase;">${esc(language.universe)}</p></td></tr><tr><td bgcolor="#190828" style="padding-top:14px;padding-right:28px;padding-bottom:12px;padding-left:28px;background-color:#190828;"><p style="margin-top:0;margin-right:0;margin-bottom:12px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:26px;color:#fff8df;">${esc(greeting)}</p><h1 style="margin-top:0;margin-right:0;margin-bottom:14px;margin-left:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:37px;font-weight:normal;color:#ffffff;">${esc(baseSubject)}</h1><p style="margin-top:0;margin-right:0;margin-bottom:18px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:25px;color:#e4d8ee;">${esc(intro)}</p>${details.length ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:100%;border-top-width:1px;border-top-style:solid;border-top-color:#4e3265;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#4e3265;">${detailRows}</table>` : ''}</td></tr><tr><td align="center" bgcolor="#190828" style="padding-top:22px;padding-right:28px;padding-bottom:22px;padding-left:28px;background-color:#190828;"><table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr><td align="center" bgcolor="#d4ad54" style="border-radius:999px;background-color:#d4ad54;"><a href="${esc(actionUrl)}" style="display:inline-block;padding-top:14px;padding-right:24px;padding-bottom:14px;padding-left:24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;font-weight:bold;letter-spacing:1px;color:#170922;text-decoration:none;">${esc(actionLabel || language.open)}</a></td></tr></table></td></tr><tr><td bgcolor="#110719" style="padding-top:20px;padding-right:28px;padding-bottom:26px;padding-left:28px;background-color:#110719;"><p style="margin-top:0;margin-right:0;margin-bottom:10px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#bfaed0;">${esc(securityNotice)}</p><p style="margin-top:0;margin-right:0;margin-bottom:10px;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#d5b66f;">${esc(language.staging)}</p><p style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#bfaed0;">${esc(language.official)}: <a href="mailto:orbedasrealidades@hotmail.com" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#fff5d8;text-decoration:underline;">orbedasrealidades@hotmail.com</a></p></td></tr></table></td></tr></table></body></html>`;
  return Object.freeze({ release: 'V202', templateKey, locale, subject, preview, html, text });
}
