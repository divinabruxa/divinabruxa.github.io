/* DIVINA BRUXA — COROA PREMIUM V191
   Laboratório autenticado em STAGING. Nenhum dado de cartão é coletado. */

import {
  BILLING_POLICY_V191,
  PREMIUM_FEATURES_V191,
  PREMIUM_PRODUCTS_V191,
  moneyV191,
  productV191
} from './premium-policy-v191.js?v=191';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[character]);
const emit = message => globalThis.dispatchEvent(new CustomEvent('orbe:toast', { detail:message }));
const requestId = () => globalThis.crypto?.randomUUID?.() || `19100000-0000-4000-8000-${Date.now().toString().slice(-12).padStart(12, '0')}`;
const date = value => {
  const parsed = new Date(String(value || ''));
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('pt-BR', { dateStyle:'short', timeStyle:'short' }).format(parsed);
};

const fallbackSnapshot = () => ({
  release:'V191', environment:'staging', mode:'sandbox', authenticated:false,
  gates:{ realBilling:false, stripeCheckout:false, stripeWebhook:false, customerPortal:false, automaticTax:false },
  catalog:PREMIUM_PRODUCTS_V191,
  entitlements:[], purchases:[], receipts:[], subscriptions:[], skinIds:['classic'],
  wallet:{ monthlyCredits:0, extraCredits:0, demoCredits:0, totalCredits:0 }
});

const entitlementActive = (snapshot, key) => snapshot.entitlements?.some(item => item.key === key && item.status === 'active');
const latestPurchase = (snapshot, key) => snapshot.purchases?.find(item => item.productKey === key && item.status === 'paid') || null;

export class PremiumEngineV191 {
  constructor(root) {
    this.root = root;
    this.snapshot = fallbackSnapshot();
    this.busy = false;
    this.pending = null;
    if (!root) return;
    this.render();
    this.refresh();
    this.onAuth = () => this.refresh();
    addEventListener('divina:auth-state', this.onAuth);
  }

  catalogProduct(key) {
    const remote = this.snapshot.catalog?.find(item => item.productKey === key || item.key === key);
    const local = productV191(key);
    return remote ? {
      ...local,
      key,
      name:String(remote.name || local?.name || key),
      priceCents:Number(remote.priceCents ?? local?.priceCents ?? 0),
      credits:Number(remote.credits ?? local?.credits ?? 0) || undefined,
      billingMode:String(remote.billingMode || local?.billingMode || 'payment')
    } : local;
  }

  render() {
    if (!this.root) return;
    const premiumActive = entitlementActive(this.snapshot, 'premium_lifetime');
    const aiActive = entitlementActive(this.snapshot, 'orbe_ai_monthly');
    const accountState = this.snapshot.authenticated
      ? '<strong>Conta verificada</strong><span>O servidor STAGING é a autoridade desta tela.</span>'
      : '<strong>Entre para usar o laboratório</strong><span>Sem conta, nenhum acesso pago é simulado ou liberado.</span>';

    this.root.innerHTML = `
      <div class="premium-v191-shell" data-billing-busy="${this.busy}">
        <aside class="premium-v191-sandbox" role="status">
          <span>STAGING · SEM COBRANÇA REAL</span>
          <p>Checkout Stripe, webhook, Customer Portal e impostos estão desligados. Os botões abaixo testam somente estados internos; nenhum cartão é solicitado.</p>
          <b>V191</b>
        </aside>

        <section class="premium-v191-account" aria-label="Estado da conta e do billing">
          <div><i aria-hidden="true">◎</i><p>${accountState}</p></div>
          <div class="premium-v191-gates" aria-label="Travas de segurança">
            <span>REAL <b>OFF</b></span><span>STRIPE <b>OFF</b></span><span>TAX <b>OFF</b></span>
          </div>
        </section>

        <section class="premium-v191-hero" aria-labelledby="premiumV191Title">
          <div>
            <p class="eyebrow">COROA PREMIUM · LICENÇA VITALÍCIA</p>
            <h3 id="premiumV191Title">Tudo o que aprofunda a sua jornada.</h3>
            <p>Uma compra única para a formação completa, prática avançada e as 30 aparências da Orbe. A Orbe IA continua sendo um produto separado.</p>
            <ul>${PREMIUM_FEATURES_V191.filter(item => item.premium).slice(2).map(item => `<li><span>✦</span>${escapeHTML(item.label)}</li>`).join('')}</ul>
          </div>
          ${this.productCard('premium_lifetime', premiumActive, true)}
        </section>

        <section class="premium-v191-compare" aria-labelledby="premiumCompareTitle">
          <header><p class="eyebrow">COMPARAÇÃO HONESTA</p><h3 id="premiumCompareTitle">Grátis, Premium e IA não se confundem.</h3></header>
          <div class="premium-v191-table" role="table" aria-label="Comparação de acesso">
            <div role="row" class="is-head"><span role="columnheader">Benefício</span><b role="columnheader">Grátis</b><b role="columnheader">Premium</b></div>
            ${PREMIUM_FEATURES_V191.map(item => `<div role="row"><span role="cell">${escapeHTML(item.label)}${item.note ? `<small>${escapeHTML(item.note)}</small>` : ''}</span><b role="cell">${item.free ? '✓' : '—'}</b><b role="cell">${item.premium ? '✓' : item.note ? 'separada' : '—'}</b></div>`).join('')}
          </div>
        </section>

        <section class="premium-v191-ai" aria-labelledby="premiumAIHeading">
          <div><p class="eyebrow">ORBE IA · PRODUTO SEPARADO</p><h3 id="premiumAIHeading">400 créditos por ciclo, com custo visível.</h3><p>Luna custa 1 crédito; Terra custa 10; Sol permanece desligada. Créditos extras só são adicionados após confirmação do servidor.</p></div>
          ${this.productCard('orbe_ai_monthly', aiActive)}
        </section>

        <section class="premium-v191-credits" aria-labelledby="premiumCreditsHeading">
          <header><p class="eyebrow">CRÉDITOS EXTRAS</p><h3 id="premiumCreditsHeading">Escolha consciente, sempre confirmada.</h3></header>
          <div>${['credits_200','credits_600','credits_1500'].map(key => this.creditCard(key)).join('')}</div>
        </section>

        ${this.lifecycleMarkup()}
        ${this.receiptsMarkup()}

        <section class="premium-v191-next" aria-label="Arquitetura de pagamento preparada">
          <div><span>1</span><p><b>Agora</b><small>Simulador autenticado em STAGING</small></p></div>
          <div><span>2</span><p><b>Próxima autorização</b><small>Checkout hospedado e webhook assinado em sandbox Stripe</small></p></div>
          <div><span>3</span><p><b>Somente após revisão</b><small>Android primeiro; iOS preparado; impostos e produção aprovados</small></p></div>
        </section>

        <dialog class="premium-v191-dialog" aria-labelledby="premiumConfirmTitle">
          <form method="dialog">
            <span>CONFIRMAÇÃO DE TESTE</span><h3 id="premiumConfirmTitle">Simular no STAGING?</h3>
            <p data-confirm-copy></p>
            <aside>Nenhuma Checkout Session será criada. Nenhum cartão, PIX ou cobrança real será processado.</aside>
            <div><button value="cancel">Cancelar</button><button value="confirm" data-confirm>Confirmar simulação</button></div>
          </form>
        </dialog>
      </div>`;
    this.bind();
  }

  productCard(key, active, featured = false) {
    const product = this.catalogProduct(key);
    if (!product) return '';
    const purchase = latestPurchase(this.snapshot, key);
    return `<article class="premium-v191-product${featured ? ' is-featured' : ''}${active ? ' is-active' : ''}">
      <span>${active ? 'ATIVO NO STAGING' : product.billingMode === 'subscription' ? 'ASSINATURA' : 'PAGAMENTO ÚNICO'}</span>
      <h4>${escapeHTML(product.name)}</h4>
      <strong>${moneyV191(product.priceCents)}</strong><small>${escapeHTML(product.cycle || (product.billingMode === 'subscription' ? 'por mês' : 'pagamento único'))}</small>
      ${product.credits ? `<p><b>${product.credits}</b> créditos por ciclo</p>` : '<p>IA não incluída</p>'}
      <button type="button" data-purchase="${escapeHTML(key)}"${active || this.busy ? ' disabled' : ''}>${active ? 'JÁ ESTÁ ATIVO' : 'SIMULAR NO STAGING'}</button>
      ${purchase ? `<em>Recibo sandbox ${escapeHTML(String(purchase.receiptCode || 'registrado'))}</em>` : ''}
    </article>`;
  }

  creditCard(key) {
    const product = this.catalogProduct(key);
    if (!product) return '';
    return `<article><span>✦</span><h4>${escapeHTML(product.name)}</h4><strong>${moneyV191(product.priceCents)}</strong><small>pagamento único · não expira nesta simulação</small><button type="button" data-purchase="${escapeHTML(key)}"${this.busy ? ' disabled' : ''}>SIMULAR PACOTE</button></article>`;
  }

  lifecycleMarkup() {
    const wallet = this.snapshot.wallet || {};
    const active = (this.snapshot.purchases || []).filter(item => item.status === 'paid');
    const subscription = this.snapshot.subscriptions?.find(item => item.productKey === 'orbe_ai_monthly');
    return `<section class="premium-v191-lifecycle" aria-labelledby="premiumLifecycleTitle">
      <header><p class="eyebrow">RESTAURAÇÃO E REVOGAÇÃO</p><h3 id="premiumLifecycleTitle">O ciclo completo precisa ser reversível.</h3><button type="button" data-restore${this.busy ? ' disabled' : ''}>RESTAURAR DA CONTA</button></header>
      <dl><div><dt>Mensais</dt><dd>${Number(wallet.monthlyCredits || 0)}</dd></div><div><dt>Extras</dt><dd>${Number(wallet.extraCredits || 0)}</dd></div><div><dt>Demonstração</dt><dd>${Number(wallet.demoCredits || 0)}</dd></div><div><dt>Total</dt><dd>${Number(wallet.totalCredits || 0)}</dd></div></dl>
      ${subscription ? `<p class="premium-v191-subscription"><span>Orbe IA: ${escapeHTML(subscription.status)}</span><small>${subscription.cancelAtPeriodEnd ? 'Cancelamento agendado para o fim do ciclo.' : `Ciclo até ${date(subscription.currentPeriodEnd)}.`}</small>${subscription.status === 'active' && !subscription.cancelAtPeriodEnd ? `<button type="button" data-cancel-subscription="orbe_ai_monthly"${this.busy ? ' disabled' : ''}>SIMULAR CANCELAMENTO</button>` : ''}</p>` : ''}
      <div class="premium-v191-active">${active.length ? active.map(item => `<article><p><b>${escapeHTML(item.name || item.productKey)}</b><small>${moneyV191(item.priceCents)} · ${date(item.createdAt)}</small></p><div><button type="button" data-refund="${escapeHTML(item.id)}"${this.busy ? ' disabled' : ''}>REEMBOLSAR</button><button type="button" data-revoke="${escapeHTML(item.id)}"${this.busy ? ' disabled' : ''}>REVOGAR</button></div></article>`).join('') : '<p class="premium-v191-empty">Nenhuma compra simulada ativa nesta conta.</p>'}</div>
    </section>`;
  }

  receiptsMarkup() {
    const receipts = this.snapshot.receipts || [];
    return `<section class="premium-v191-receipts" aria-labelledby="premiumReceiptsTitle"><header><p class="eyebrow">RECIBOS SANDBOX</p><h3 id="premiumReceiptsTitle">Histórico claro, sem dados de pagamento.</h3></header>${receipts.length ? `<ol>${receipts.slice(0, 12).map(item => `<li><span>${escapeHTML(item.code)}</span><p><b>${escapeHTML(item.name)}</b><small>${date(item.issuedAt)} · ${escapeHTML(item.status)}</small></p><strong>${moneyV191(item.amountCents)}</strong></li>`).join('')}</ol>` : '<p class="premium-v191-empty">Os recibos de teste aparecerão aqui.</p>'}</section>`;
  }

  bind() {
    this.root.querySelectorAll('[data-purchase]').forEach(button => button.addEventListener('click', () => this.confirm('simulate_purchase', button.dataset.purchase)));
    this.root.querySelector('[data-restore]')?.addEventListener('click', () => this.execute('restore'));
    this.root.querySelectorAll('[data-refund]').forEach(button => button.addEventListener('click', () => this.confirm('refund', '', button.dataset.refund)));
    this.root.querySelectorAll('[data-revoke]').forEach(button => button.addEventListener('click', () => this.confirm('revoke', '', button.dataset.revoke)));
    this.root.querySelector('[data-cancel-subscription]')?.addEventListener('click', button => this.confirm('cancel_subscription', button.currentTarget.dataset.cancelSubscription));
  }

  async refresh({ announce = false } = {}) {
    const auth = globalThis.divinaAuth;
    if (!auth?.session) {
      this.snapshot = fallbackSnapshot();
      this.render();
      if (announce) emit('Entre na sua conta para restaurar compras do STAGING.');
      return false;
    }
    this.busy = true;
    this.render();
    const result = await auth.billingSnapshot?.();
    this.busy = false;
    if (result?.ok && result.body?.snapshot) {
      this.snapshot = { ...fallbackSnapshot(), ...result.body.snapshot, authenticated:true };
      this.render();
      if (announce) emit('Compras e acessos restaurados pelo servidor STAGING.');
      dispatchEvent(new CustomEvent('divina:billing-updated', { detail:this.snapshot }));
      return true;
    }
    this.snapshot = { ...fallbackSnapshot(), authenticated:false };
    this.render();
    if (announce) emit(result?.message || 'Não foi possível restaurar o billing agora.');
    return false;
  }

  confirm(command, productKey = '', purchaseId = '') {
    if (!globalThis.divinaAuth?.session) {
      emit('Entre na Conta para usar o laboratório Premium.');
      globalThis.orbe?.go?.('login');
      return;
    }
    const product = productKey ? this.catalogProduct(productKey) : null;
    const purchase = purchaseId ? this.snapshot.purchases?.find(item => item.id === purchaseId) : null;
    const verbs = { simulate_purchase:'ativar', refund:'reembolsar', revoke:'revogar', cancel_subscription:'agendar o cancelamento de' };
    const target = product?.name || purchase?.name || purchase?.productKey || 'este acesso';
    this.pending = { command, productKey, purchaseId };
    const dialog = this.root.querySelector('.premium-v191-dialog');
    const copy = dialog?.querySelector('[data-confirm-copy]');
    if (copy) copy.textContent = `Você vai ${verbs[command] || 'alterar'} ${target} somente no ambiente de testes.`;
    if (!dialog?.showModal) {
      if (globalThis.confirm?.(`Confirmar a simulação de ${target}?`)) this.execute(command, productKey, purchaseId);
      return;
    }
    dialog.addEventListener('close', () => {
      const pending = this.pending;
      this.pending = null;
      if (dialog.returnValue === 'confirm' && pending) this.execute(pending.command, pending.productKey, pending.purchaseId);
    }, { once:true });
    dialog.showModal();
  }

  async execute(command, productKey = '', purchaseId = '') {
    if (this.busy) return;
    const auth = globalThis.divinaAuth;
    if (!auth?.session || !auth.billingSandboxCommand) {
      emit('Entre na Conta para continuar.');
      return;
    }
    this.busy = true;
    this.render();
    const result = await auth.billingSandboxCommand({ command, productKey, purchaseId, requestId:requestId(), platform:'web' });
    this.busy = false;
    if (result?.ok && result.body?.snapshot) {
      this.snapshot = { ...fallbackSnapshot(), ...result.body.snapshot, authenticated:true };
      this.render();
      emit(result.body.message || 'Ciclo de billing atualizado no STAGING.');
      dispatchEvent(new CustomEvent('divina:billing-updated', { detail:this.snapshot }));
      return;
    }
    this.render();
    emit(result?.message || 'A simulação não foi concluída.');
  }

  destroy() {
    removeEventListener('divina:auth-state', this.onAuth);
  }
}
