import { CONFIG } from '../data/config.js';
import { CONSULTATION_SERVICES, consultationById, money } from '../data/consultations.js';

const REQUESTS_KEY = 'divina-bruxa-3.consultation-requests.v1';
const TIMEOUT = 12000;
const clean = value => String(value ?? '').trim();
const escapeHTML = value => clean(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function readRequests() {
  try {
    const value = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, 30) : [];
  } catch { return []; }
}

function writeRequests(value) {
  try { localStorage.setItem(REQUESTS_KEY, JSON.stringify(value.slice(0, 30))); } catch {}
}

async function api(body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(CONFIG.consultationsEndpoint, {
      method:body ? 'POST' : 'GET',
      signal:controller.signal,
      cache:'no-store',
      credentials:'omit',
      headers:{ Accept:'application/json', ...(body ? {'Content-Type':'application/json'} : {}) },
      ...(body ? { body:JSON.stringify(body) } : {})
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.ok === false) {
      const error = new Error(clean(payload?.code || payload?.error || `HTTP_${response.status}`));
      error.code = error.message;
      throw error;
    }
    return payload;
  } finally { clearTimeout(timer); }
}

function errorMessage(error) {
  const code = clean(error?.code || error?.message);
  return ({
    INVALID_NAME:'Revise o nome informado.', INVALID_EMAIL:'Revise o e-mail informado.',
    INVALID_PHONE:'Revise o telefone com DDD.', INVALID_CONTEXT:'Conte um pouco mais sobre a sua pergunta.',
    CONSENT_REQUIRED:'Confirme as declarações para continuar.', SERVICE_UNAVAILABLE:'Esta consulta está temporariamente indisponível.',
    RATE_LIMITED:'Muitas tentativas foram feitas. Aguarde alguns minutos.', TRACKING_NOT_FOUND:'Protocolo ou código privado não encontrado.',
    SLOT_UNAVAILABLE:'Esse horário acabou de ficar indisponível. Escolha outro na agenda atualizada.',
    INVALID_SLOT:'O horário escolhido não é mais válido. Escolha outro na agenda atualizada.',
    HOLD_EXPIRED:'A reserva temporária do horário expirou. Escolha o horário novamente.'
  })[code] || 'A conexão segura não concluiu o registro. Seus dados continuam no formulário; tente novamente ou use o e-mail oficial.';
}

export function createConsultationsWorld({ announce }) {
  const root = document.querySelector('#consultationsApp');
  let services = CONSULTATION_SERVICES;
  let selected = '';
  let stage = 'services';
  let connection = 'loading';
  let busy = false;
  let status = '';
  let draft = {};
  let pending = null;
  let success = null;
  let tracking = null;
  let started = false;
  let slots = [];
  let activeDay = '';

  const slotDay = value => {
    try {
      return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
    } catch { return ''; }
  };
  const slotDate = value => new Intl.DateTimeFormat('pt-BR', {timeZone:'America/Sao_Paulo',weekday:'short',day:'2-digit',month:'short'}).format(new Date(value)).replaceAll('.','');
  const slotTime = value => new Intl.DateTimeFormat('pt-BR', {timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
  const slotFull = value => new Intl.DateTimeFormat('pt-BR', {timeZone:'America/Sao_Paulo',dateStyle:'long',timeStyle:'short'}).format(new Date(value));

  function serviceCards() {
    return `<div class="consultation-services">${services.map((service, index) => `
      <button type="button" class="consultation-service${index === 0 ? ' is-featured' : ''}" data-service="${service.id}">
        <span class="consultation-service__number">0${index + 1}</span>${index === 0 ? '<em>MAIS COMPLETA</em>' : ''}
        <i aria-hidden="true">${service.sigil}</i><small>${service.duration}</small><h2>${service.name}</h2><p>${service.description}</p>
        <span>${service.idealFor}</span><ul>${service.includes.map(item => `<li>${item}</li>`).join('')}</ul>
        <strong>${money(service.priceCents)}</strong><b>ESCOLHER <span aria-hidden="true">→</span></b>
      </button>`).join('')}</div>`;
  }

  function tracker() {
    const records = readRequests();
    return `<details class="consultation-tracker"${stage === 'tracking' ? ' open' : ''}>
      <summary>Acompanhar uma solicitação <span>${records.length ? `${records.length} neste aparelho` : 'protocolo privado'}</span></summary>
      ${tracking ? `<article class="consultation-tracking-result"><small>ESTADO ATUAL</small><h3>${escapeHTML(tracking.publicStatusLabel || tracking.request?.publicStatusLabel || 'Recebida')}</h3><p>${escapeHTML(tracking.request?.serviceName || tracking.serviceName || '')}</p></article>` : ''}
      ${records.length ? `<div class="consultation-records">${records.map(record => `<button type="button" data-track-record="${escapeHTML(record.protocol)}"><span><b>${escapeHTML(record.serviceName)}</b><small>${escapeHTML(record.protocol)}</small></span><em>CONSULTAR</em></button>`).join('')}</div>` : ''}
      <form data-track-form><label><span>Protocolo</span><input name="protocol" autocomplete="off" placeholder="DB-AAAAMMDD-XXXXXXXX" required></label><label><span>Código privado</span><input name="token" autocomplete="off" required></label><button type="submit">ACOMPANHAR</button></form>
      <p>O código fica somente neste aparelho. Não o publique.</p>
    </details>`;
  }

  function formMarkup() {
    const service = consultationById(selected) || services.find(item => item.id === selected);
    const value = name => escapeHTML(draft[name] || '');
    const today = new Date().toISOString().slice(0, 10);
    const days = [...new Set(slots.map(slot => slotDay(slot.start)).filter(Boolean))].slice(0, 7);
    if (!activeDay && days.length) activeDay = days[0];
    const daySlots = slots.filter(slot => slotDay(slot.start) === activeDay).slice(0, 12);
    const schedule = connection === 'ready' && slots.length ? `<section class="consultation-live-schedule">
      <div><p class="eyebrow">AGENDA REAL · HORÁRIO DE BRASÍLIA</p><h3>Escolha um horário ou informe uma preferência.</h3></div>
      <div class="consultation-days">${days.map(day => { const first = slots.find(slot => slotDay(slot.start) === day); return `<button type="button" data-consultation-day="${day}" aria-pressed="${day === activeDay}">${slotDate(first.start)}</button>`; }).join('')}</div>
      <div class="consultation-times">${daySlots.map(slot => `<button type="button" data-consultation-slot="${escapeHTML(slot.start)}" aria-pressed="${draft.slotStartAt === slot.start}">${slotTime(slot.start)}</button>`).join('')}</div>
      ${draft.slotStartAt ? `<p class="consultation-slot-choice">Escolhido: <b>${escapeHTML(slotFull(draft.slotStartAt))}</b></p>` : '<p class="consultation-slot-choice">Nenhum horário escolhido; você também pode usar os campos abaixo.</p>'}
    </section>` : `<p class="consultation-schedule-fallback">A agenda online será verificada novamente no envio. Você pode registrar uma preferência abaixo.</p>`;
    return `<section class="consultation-form-stage">
      <header><div><p class="eyebrow">SUA ESCOLHA</p><h2>${service.name}</h2><p>${money(service.priceCents)} · sem cobrança agora</p></div><button type="button" data-back-services>TROCAR</button></header>
      ${status ? `<p class="consultation-status" role="status">${escapeHTML(status)}</p>` : ''}
      <form data-consultation-form novalidate>
        ${schedule}
        <div class="consultation-preference">
          <label><span>Data preferida <small>(opcional)</small></span><input name="date" type="date" min="${today}" value="${value('date')}"></label>
          <label><span>Período</span><select name="period"><option value="">A combinar</option>${['Manhã','Tarde','Noite'].map(period => `<option${draft.period === period ? ' selected' : ''}>${period}</option>`).join('')}</select></label>
        </div>
        <label><span>Nome completo</span><input name="name" autocomplete="name" minlength="2" required value="${value('name')}"></label>
        <label><span>E-mail</span><input name="email" type="email" autocomplete="email" required value="${value('email')}"></label>
        <label><span>Telefone com DDD</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required value="${value('phone')}"></label>
        <label><span>Pergunta ou contexto</span><textarea name="question" minlength="10" maxlength="3000" required placeholder="Não inclua senhas, documentos ou dados bancários.">${value('question')}</textarea></label>
        <div class="consultation-consents">
          <label><input name="valueConsent" type="checkbox" required${draft.valueConsent ? ' checked' : ''}><span>Confirmo o valor de ${money(service.priceCents)} e entendo que ainda não haverá cobrança.</span></label>
          <label><input name="privacyConsent" type="checkbox" required${draft.privacyConsent ? ' checked' : ''}><span>Autorizo o uso destes dados somente para administrar esta solicitação.</span></label>
          <label><input name="symbolicConsent" type="checkbox" required${draft.symbolicConsent ? ' checked' : ''}><span>Entendo que a leitura é simbólica e não substitui orientação médica, jurídica ou financeira.</span></label>
        </div>
        <button type="submit">REVISAR SOLICITAÇÃO <span aria-hidden="true">→</span></button>
      </form>
    </section>`;
  }

  function reviewMarkup() {
    const service = consultationById(selected) || services.find(item => item.id === selected);
    const preference = draft.slotStartAt ? `${slotFull(draft.slotStartAt)} · horário de Brasília` : [draft.date ? new Intl.DateTimeFormat('pt-BR', {dateStyle:'long'}).format(new Date(`${draft.date}T12:00:00`)) : '', draft.period].filter(Boolean).join(' · ') || 'A combinar';
    return `<section class="consultation-review">
      <p class="eyebrow">REVISE ANTES DE REGISTRAR</p><h2>${service.name}</h2>
      ${status ? `<p class="consultation-status" role="status">${escapeHTML(status)}</p>` : ''}
      <dl><div><dt>Valor</dt><dd>${money(service.priceCents)} · sem cobrança agora</dd></div><div><dt>Preferência</dt><dd>${escapeHTML(preference)}</dd></div><div><dt>Nome</dt><dd>${escapeHTML(draft.name)}</dd></div><div><dt>E-mail</dt><dd>${escapeHTML(draft.email)}</dd></div><div><dt>Telefone</dt><dd>${escapeHTML(draft.phone)}</dd></div><div><dt>Contexto</dt><dd>${escapeHTML(draft.question)}</dd></div></dl>
      <div><button type="button" data-confirm-consultation${busy ? ' disabled' : ''}>${busy ? 'REGISTRANDO…' : 'REGISTRAR E GERAR PROTOCOLO'}</button><button type="button" data-edit-consultation${busy ? ' disabled' : ''}>VOLTAR E EDITAR</button></div>
      ${status ? `<a href="mailto:${CONFIG.contactEmail}">USAR O E-MAIL OFICIAL</a>` : ''}
    </section>`;
  }

  function successMarkup() {
    return `<section class="consultation-success">
      <span aria-hidden="true">◇</span><p class="eyebrow">SOLICITAÇÃO REGISTRADA</p><h2>O encontro ganhou um caminho.</h2>
      <p>Guarde os dois códigos. O protocolo identifica o pedido; o código privado permite acompanhar o estado.</p>
      <div><label>Protocolo <output>${escapeHTML(success.protocol)}</output></label><button type="button" data-copy="protocol">COPIAR</button></div>
      <div><label>Código privado <output>${escapeHTML(success.trackingToken)}</output></label><button type="button" data-copy="trackingToken">COPIAR</button></div>
      <p>${escapeHTML(success.serviceName)} · ${money(success.priceCents)} · nenhuma cobrança automática.</p>
      <button type="button" data-new-consultation>NOVA SOLICITAÇÃO</button>
    </section>`;
  }

  function render() {
    const connectionLabel = connection === 'ready' ? 'REGISTRO CONECTADO' : connection === 'loading' ? 'VERIFICANDO REGISTRO' : 'RECONEXÃO NO ENVIO';
    const central = stage === 'services' ? `<section class="consultation-choice"><header><p class="eyebrow">QUATRO CAMINHOS REAIS</p><h2>Qual leitura acolhe o seu momento?</h2><p>Compare finalidade e valor antes de escolher.</p></header>${serviceCards()}</section>` : stage === 'form' ? formMarkup() : stage === 'review' ? reviewMarkup() : successMarkup();
    root.innerHTML = `<section class="consultation-sanctuary"><div><p class="eyebrow">ATENDIMENTO HUMANO · PRIVADO</p><h2>Sua pergunta merece presença.</h2><p>Quatro leituras de R$ 50 a R$ 250. Você revisa tudo antes de registrar.</p></div><span class="consultation-connection is-${connection}"><i></i>${connectionLabel}</span></section>${central}${tracker()}`;
    bind();
  }

  function bind() {
    root.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { selected = button.dataset.service; stage = 'form'; status = ''; render(); }));
    root.querySelector('[data-back-services]')?.addEventListener('click', () => { stage = 'services'; status = ''; render(); });
    root.querySelector('[data-consultation-form]')?.addEventListener('submit', prepareReview);
    root.querySelectorAll('[data-consultation-day]').forEach(button => button.addEventListener('click', () => { activeDay = button.dataset.consultationDay; draft.slotStartAt = ''; render(); }));
    root.querySelectorAll('[data-consultation-slot]').forEach(button => button.addEventListener('click', () => { draft.slotStartAt = button.dataset.consultationSlot; draft.date = ''; draft.period = ''; render(); }));
    root.querySelector('[data-edit-consultation]')?.addEventListener('click', () => { stage = 'form'; status = ''; render(); });
    root.querySelector('[data-confirm-consultation]')?.addEventListener('click', submit);
    root.querySelector('[data-new-consultation]')?.addEventListener('click', () => { selected = ''; stage = 'services'; draft = {}; pending = null; success = null; status = ''; render(); });
    root.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(success?.[button.dataset.copy] || ''); announce('Código copiado.'); }
      catch { announce('Selecione o código para copiar.'); }
    }));
    root.querySelector('[data-track-form]')?.addEventListener('submit', event => {
      event.preventDefault(); const values = new FormData(event.currentTarget); track(clean(values.get('protocol')).toUpperCase(), clean(values.get('token')));
    });
    root.querySelectorAll('[data-track-record]').forEach(button => button.addEventListener('click', () => {
      const record = readRequests().find(item => item.protocol === button.dataset.trackRecord);
      if (record) track(record.protocol, record.trackingToken);
    }));
  }

  function prepareReview(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const manualDate = clean(values.get('date'));
    const manualPeriod = clean(values.get('period'));
    const selectedSlot = clean(draft.slotStartAt);
    draft = {
      date:clean(values.get('date')), period:clean(values.get('period')), name:clean(values.get('name')),
      email:clean(values.get('email')), phone:clean(values.get('phone')), question:clean(values.get('question')).slice(0,3000),
      valueConsent:values.get('valueConsent') === 'on', privacyConsent:values.get('privacyConsent') === 'on', symbolicConsent:values.get('symbolicConsent') === 'on'
    };
    draft.slotStartAt = manualDate || manualPeriod ? '' : selectedSlot;
    const phone = draft.phone.replace(/\D/g, '');
    const invalid = draft.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) || phone.length < 10 || phone.length > 15 || draft.question.length < 10 || !draft.valueConsent || !draft.privacyConsent || !draft.symbolicConsent;
    if (invalid) { status = 'Revise os campos e confirme as três declarações.'; render(); root.querySelector('[data-consultation-form] :invalid')?.focus(); return; }
    pending = { submissionId:crypto.randomUUID(), trackingToken:randomToken() };
    stage = 'review'; status = ''; render();
  }

  async function submit() {
    if (busy || !pending) return;
    const service = consultationById(selected) || services.find(item => item.id === selected);
    busy = true; status = ''; render();
    try {
      let holdToken = '';
      if (draft.slotStartAt) {
        const hold = await api({action:'hold',serviceKey:service.id,slotStartAt:draft.slotStartAt,website:''});
        holdToken = clean(hold.holdToken);
      }
      const result = await api({
        action:'submit', holdToken, submissionId:pending.submissionId, trackingToken:pending.trackingToken,
        serviceKey:service.id, preferredDate:draft.date, preferredPeriod:draft.period,
        name:draft.name, email:draft.email, phone:draft.phone, questionContext:draft.question,
        acceptTerms:true, acceptPrivacy:true, acceptSymbolic:true, marketingOptIn:false, website:''
      });
      success = { protocol:clean(result.protocol) || pending.submissionId, trackingToken:pending.trackingToken, serviceName:service.name, serviceId:service.id, priceCents:Number(result.priceCents) || service.priceCents };
      const records = readRequests().filter(record => record.protocol !== success.protocol);
      writeRequests([{...success, createdAt:new Date().toISOString()}, ...records]);
      stage = 'success'; pending = null; draft = {}; announce('Solicitação registrada. Guarde o protocolo e o código privado.');
    } catch (error) {
      status = errorMessage(error);
      if (['SLOT_UNAVAILABLE','INVALID_SLOT','HOLD_EXPIRED'].includes(clean(error?.code || error?.message))) {
        draft.slotStartAt = ''; stage = 'form'; connect();
      }
    }
    busy = false; render();
  }

  async function track(protocol, trackingToken) {
    if (!/^DB-[0-9]{8}-[A-Z0-9]{8}$/.test(protocol) || !/^[A-Za-z0-9_-]{24,96}$/.test(trackingToken)) {
      status = 'Revise o protocolo e o código privado.'; stage = stage === 'success' ? 'success' : stage; return render();
    }
    status = 'Consultando o registro seguro…'; render();
    try { tracking = await api({ action:'status', protocol, trackingToken, website:'' }); status = ''; announce('Estado da solicitação atualizado.'); }
    catch (error) { status = errorMessage(error); }
    render();
  }

  async function connect() {
    try {
      const result = await api();
      if (result?.environment !== 'staging' || result?.rules?.realBilling !== false || !Array.isArray(result.services)) throw new Error('INVALID_CATALOG');
      const remote = CONSULTATION_SERVICES.map(local => {
        const found = result.services.find(item => clean(item.service_key) === local.id);
        const price = Number(found?.price_brl_cents);
        return Number.isInteger(price) && price > 0 ? {...local, priceCents:price} : local;
      });
      services = Object.freeze(remote);
      slots = (Array.isArray(result.slots) ? result.slots : []).map(slot => ({start:clean(slot.slot_start_at || slot.start),end:clean(slot.slot_end_at || slot.end)})).filter(slot => slot.start && new Date(slot.start) > new Date());
      if (draft.slotStartAt && !slots.some(slot => slot.start === draft.slotStartAt)) draft.slotStartAt = '';
      activeDay = slotDay(draft.slotStartAt) || activeDay || slotDay(slots[0]?.start);
      connection = 'ready';
    } catch { connection = 'offline'; slots = []; }
    render();
  }

  function activate() {
    if (!started) { started = true; render(); connect(); }
  }

  return { activate };
}
