import { CONFIG } from './data/config.js';
import { PLANS as BASE_PLANS } from './data/plans.js';
import { money } from './data/consultations.js';

const RELEASE = '3.5.0';
const BILLING_ENDPOINT = `${CONFIG.functionsBase}/billing-account-v191`;
const REQUEST_TIMEOUT = 18000;
const PLANS = Object.freeze(BASE_PLANS.map(plan => plan.id === 'premium' ? Object.freeze({
  ...plan,
  description:'Onze tiragens profundas, Escola offline e as 30 skins cosméticas.',
  includes:Object.freeze(['11 tiragens Premium', 'Escola completa', '30 skins cosméticas'])
}) : plan));

const cleanSession = value => value && typeof value === 'object' && typeof value.access_token === 'string'
  ? value
  : null;

const safeSnapshot = value => Boolean(
  value
  && value.release === 'V191'
  && value.environment === 'staging'
  && value.mode === 'sandbox'
  && value.gates?.realBilling === false
  && value.gates?.stripeCheckout === false
  && value.gates?.stripeWebhook === false
  && value.gates?.customerPortal === false
  && value.gates?.automaticTax === false
  && value.gates?.production === false
  && Array.isArray(value.entitlements)
  && Array.isArray(value.purchases)
  && Array.isArray(value.receipts)
);

const activePremium = snapshot => snapshot?.entitlements?.some(item => (
  item?.key === 'premium_lifetime'
  && item?.status === 'active'
  && (!item?.endsAt || new Date(item.endsAt).getTime() > Date.now())
));

async function billingRequest(session, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(BILLING_ENDPOINT, {
      method:'POST',
      signal:controller.signal,
      cache:'no-store',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
        Authorization:`Bearer ${session.access_token}`,
        apikey:CONFIG.supabasePublishableKey
      },
      body:JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    return { ok:response.ok, status:response.status, body:payload };
  } catch (error) {
    return { ok:false, status:0, body:{}, timeout:error?.name === 'AbortError' };
  } finally {
    clearTimeout(timer);
  }
}

export function createPremiumWorld({ navigate, announce, getSession = () => null }) {
  const root = document.querySelector('#premiumPlans');
  let initialized = false;
  let busy = false;
  let snapshot = null;
  let loadedToken = '';
  let status = 'Nenhuma cobrança real pode acontecer nesta fase.';
  let statusError = false;

  function accountFacts(session) {
    if (!session) return {
      title:'Entre para consultar suas chaves',
      detail:'O acesso Premium pertence à conta, nunca a um registro local do aparelho.'
    };
    if (!snapshot) return {
      title:'Conta reconhecida · cofre aguardando consulta',
      detail:'Atualize para confirmar acessos, recibos e restaurações diretamente no servidor.'
    };
    const purchases = snapshot.purchases.length;
    const receipts = snapshot.receipts.length;
    return activePremium(snapshot) ? {
      title:'Chave Premium ativa',
      detail:`A conta possui ${purchases} ${purchases === 1 ? 'registro de compra' : 'registros de compra'} e ${receipts} ${receipts === 1 ? 'recibo protegido' : 'recibos protegidos'}.`
    } : {
      title:'Nenhuma chave Premium ativa',
      detail:`O servidor encontrou ${purchases} ${purchases === 1 ? 'registro' : 'registros'} nesta homologação. A venda real continua fechada.`
    };
  }

  function planAction(plan, session) {
    if (plan.id === 'presence') return { label:'ENTRAR NO TAROT', route:'tarot' };
    if (plan.id === 'premium' && activePremium(snapshot)) return { label:'ABRIR AS 11 TIRAGENS', route:'tiragens' };
    if (!session) return { label:'ENTRAR NA CONTA', route:'conta' };
    return { label:'VER MINHA CONTA', route:'conta' };
  }

  function render() {
    const session = cleanSession(getSession());
    const facts = accountFacts(session);
    const plans = PLANS.map(plan => {
      const action = planAction(plan, session);
      return `<article class="premium-card${plan.featured ? ' is-featured' : ''}">
        ${plan.featured ? '<span class="premium-card__mark">CHAVE CENTRAL</span>' : ''}
        <p class="eyebrow">${plan.id === 'presence' ? 'PORTA ABERTA' : plan.id === 'premium' ? 'ACESSO VITALÍCIO' : 'PRESENÇA MENSAL'}</p>
        <h2>${plan.name}</h2>
        <p>${plan.description}</p>
        <strong>${plan.priceCents ? money(plan.priceCents) : 'Grátis'} <small>${plan.cycle}</small></strong>
        <ul>${plan.includes.map(item => `<li>${item}</li>`).join('')}</ul>
        <button type="button" data-premium-route="${action.route}">${action.label}</button>
      </article>`;
    }).join('');

    root.innerHTML = `<section class="premium-readiness" aria-labelledby="premiumReadinessTitle">
      <div class="premium-readiness__heading">
        <span aria-hidden="true">◈</span>
        <div><p class="eyebrow">MACROETAPA 5 · HOMOLOGAÇÃO SEGURA</p><h2 id="premiumReadinessTitle">A estrutura está viva. O caixa real permanece fechado.</h2><p>O servidor já protege preço, recibo, restauração, reembolso, revogação e idempotência. A abertura financeira só acontece depois de produção separada, MFA da proprietária e autorização explícita.</p></div>
      </div>
      <ul class="premium-gates" aria-label="Travas financeiras atuais">
        <li><b>OFF</b><span>Cobrança real</span></li>
        <li><b>OFF</b><span>Checkout Stripe</span></li>
        <li><b>OFF</b><span>Portal do cliente</span></li>
        <li><b>OFF</b><span>Impostos automáticos</span></li>
      </ul>
      <div class="premium-account-state">
        <span aria-hidden="true">${activePremium(snapshot) ? '✦' : '◇'}</span>
        <div><b>${facts.title}</b><small>${facts.detail}</small></div>
      </div>
      <div class="premium-readiness__actions">
        ${session
          ? `<button type="button" data-billing-refresh${busy ? ' disabled' : ''}>${busy ? 'CONSULTANDO…' : 'ATUALIZAR MINHAS CHAVES'}</button><button type="button" data-billing-restore${busy ? ' disabled' : ''}>RESTAURAR ACESSOS</button>`
          : '<button type="button" data-premium-route="conta">ENTRAR NA CONTA</button>'}
      </div>
      <p class="premium-readiness__status${statusError ? ' is-error' : ''}" role="status">${status}</p>
      <small class="premium-readiness__release">Divina Bruxa ${RELEASE} · nenhum dado de cartão é coletado pelo site.</small>
    </section>
    <div class="premium-plans__grid">${plans}</div>`;
  }

  async function refresh({ quiet = false } = {}) {
    const session = cleanSession(getSession());
    if (!session) {
      snapshot = null;
      loadedToken = '';
      status = 'Entre na Conta para consultar direitos e restaurações.';
      statusError = false;
      render();
      return;
    }
    busy = true;
    if (!quiet) status = 'Consultando o cofre Premium…';
    statusError = false;
    render();
    const result = await billingRequest(session, { action:'snapshot' });
    busy = false;
    if (!result.ok || result.body?.ok !== true || !safeSnapshot(result.body?.snapshot)) {
      snapshot = null;
      loadedToken = '';
      status = result.status === 401
        ? 'A sessão precisa ser renovada na Conta.'
        : result.status === 0
          ? 'O cofre está temporariamente fora de alcance. Nenhum acesso foi liberado localmente.'
          : 'O servidor recusou um estado financeiro incompleto. A proteção permaneceu fechada.';
      statusError = true;
      render();
      return;
    }
    snapshot = result.body.snapshot;
    loadedToken = session.access_token;
    status = activePremium(snapshot)
      ? 'Chave Premium confirmada pelo servidor.'
      : 'Conta consultada. A venda real ainda não foi aberta.';
    statusError = false;
    render();
  }

  async function restore() {
    const session = cleanSession(getSession());
    const requestId = globalThis.crypto?.randomUUID?.();
    if (!session || !requestId || busy) return;
    busy = true;
    status = 'Restaurando somente compras válidas registradas no servidor…';
    statusError = false;
    render();
    const result = await billingRequest(session, {
      action:'command',
      command:'restore',
      requestId,
      productKey:null,
      purchaseId:null,
      platform:'web'
    });
    busy = false;
    if (!result.ok || result.body?.ok !== true || !safeSnapshot(result.body?.snapshot)) {
      status = 'A restauração não foi confirmada. Nenhuma chave foi criada no aparelho.';
      statusError = true;
      render();
      return;
    }
    snapshot = result.body.snapshot;
    loadedToken = session.access_token;
    status = 'Restauração concluída pelo servidor. Apenas compras válidas foram consideradas.';
    statusError = false;
    render();
    announce('Restauração Premium concluída com segurança.');
  }

  function handleClick(event) {
    const routeButton = event.target.closest('[data-premium-route]');
    if (routeButton) {
      navigate(routeButton.dataset.premiumRoute);
      announce(routeButton.dataset.premiumRoute === 'tiragens'
        ? 'Abrindo as tiragens confirmadas pela sua chave Premium.'
        : `Abrindo ${routeButton.dataset.premiumRoute}.`);
      return;
    }
    if (event.target.closest('[data-billing-refresh]')) void refresh();
    if (event.target.closest('[data-billing-restore]')) void restore();
  }

  function activate() {
    const session = cleanSession(getSession());
    if (!initialized) {
      initialized = true;
      root.addEventListener('click', handleClick);
    }
    render();
    if (session?.access_token && session.access_token !== loadedToken && !busy) void refresh({ quiet:true });
  }

  return { activate, refresh };
}
