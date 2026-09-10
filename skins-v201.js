/* DIVINA BRUXA — CONSTELAÇÃO DAS 30 SKINS V201
   Propriedade e skin ativa vêm da conta STAGING; a troca visual continua atômica. */

import { SKINS_V6 } from './skin-catalog-v6.js?v=142';
import { skinByIdV12 } from './skin-registry-v12.js?v=133';
import { activateSkinFluidV12, activeSkinV12, prepareSkinV12 } from './runtime-v12.js?v=133';

const PREVIEW_RELEASE_DELAY = 12000;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[character]);
const announceGlobal = message => dispatchEvent(new CustomEvent('orbe:toast', { detail:message }));

export class SkinsEngineV201 {
  constructor(root) {
    this.root = root;
    this.owned = new Set(['classic']);
    this.authenticated = Boolean(globalThis.divinaAuth?.session);
    this.query = '';
    this.filter = 'all';
    this.pending = '';
    this.switchToken = 0;
    this.syncToken = 0;
    this.previewObserver = null;
    this.previewUnloadTimers = new WeakMap();
    if (!root) return;
    this.render();
    this.sync(false);
    this.onApplied = () => this.updateActiveState();
    this.onBilling = event => this.useSnapshot(event.detail);
    this.onAuth = () => this.sync(false);
    document.addEventListener('divina:skin-applied', this.onApplied);
    addEventListener('divina:billing-updated', this.onBilling);
    addEventListener('divina:auth-state', this.onAuth);
  }

  visibleSkins() {
    const query = this.query.toLocaleLowerCase('pt-BR').trim();
    return SKINS_V6.filter(skin => {
      const matches = !query || `${skin.name} ${skin.collection}`.toLocaleLowerCase('pt-BR').includes(query);
      const owned = this.owned.has(skin.id);
      return matches && (this.filter === 'all' || (this.filter === 'owned' ? owned : !owned));
    });
  }

  render() {
    this.previewObserver?.disconnect();
    const active = activeSkinV12();
    const current = skinByIdV12(active);
    const visible = this.visibleSkins();
    this.root.innerHTML = `
      <div class="skins-v191-shell" data-release="V201" data-switching="${Boolean(this.pending)}">
        <aside class="skins-v191-oath"><span>30/30</span><p><b>Cosméticas, sincronizadas e honestas.</b><small>Nenhuma skin muda sorte, cartas, significado, velocidade ou acesso à IA. A Clássica Divina é sempre gratuita.</small></p></aside>
        <section class="skins-v191-stage" aria-labelledby="skinsV191Current">
          <div class="skins-v191-orb" aria-hidden="true"><i></i><img src="${escapeHTML(current.preview || current.image)}" alt="" width="360" height="360" decoding="async" fetchpriority="high"></div>
          <div><p class="eyebrow">SUA ORBE ATUAL</p><h3 id="skinsV191Current">${escapeHTML(current.name)}</h3><p>Uma escolha é aplicada à Home, Menu Mágico, mini-Orbe, Tarot e portais sem reiniciar o aplicativo.</p><div><button type="button" data-classic${active === 'classic' || this.pending ? ' disabled' : ''}>USAR CLÁSSICA DIVINA</button><button type="button" data-restore${this.pending ? ' disabled' : ''}>RESTAURAR DA CONTA</button></div></div>
        </section>
        <section class="skins-v191-tools" aria-label="Filtrar skins">
          <label><span>Buscar realidade</span><input type="search" value="${escapeHTML(this.query)}" placeholder="Lua, cristal, portal…" data-search></label>
          <div><button type="button" data-filter="all" aria-pressed="${this.filter === 'all'}">TODAS</button><button type="button" data-filter="owned" aria-pressed="${this.filter === 'owned'}">MINHAS</button><button type="button" data-filter="locked" aria-pressed="${this.filter === 'locked'}">PREMIUM</button></div>
          <p><b>${this.owned.size}</b> liberada${this.owned.size === 1 ? '' : 's'} · ${visible.length} visível${visible.length === 1 ? '' : 'eis'}</p>
        </section>
        <p class="skins-v191-live" role="status" aria-live="polite" aria-atomic="true"></p>
        <div class="skins-v191-grid" role="list" aria-label="Galeria das 30 skins">
          ${visible.length ? visible.map(skin => this.card(skin, active)).join('') : '<p class="skins-v191-empty">Nenhuma skin corresponde a este filtro.</p>'}
        </div>
        <aside class="skins-v191-premium"><p><span>✦</span><b>As 30 skins fazem parte do Premium vitalício.</b><small>A Orbe IA não está incluída. Compras reais continuam desligadas.</small></p><button type="button" data-open-premium>VER PREMIUM</button></aside>
      </div>`;
    this.bind();
    this.observePreviews();
  }

  card(catalog, active) {
    const skin = skinByIdV12(catalog.id);
    const current = skin.id === active;
    const owned = this.owned.has(skin.id);
    const preview = escapeHTML(skin.preview || skin.image);
    return `<article class="skin-v191-card${current ? ' is-active' : ''}${owned ? ' is-owned' : ' is-locked'}" data-skin-card="${escapeHTML(skin.id)}" role="listitem"${current ? ' aria-current="true"' : ''} style="--skin-accent:${escapeHTML(skin.tokens.accent)};--skin-light:${escapeHTML(skin.tokens.light)}">
      <button class="skin-v191-preview" type="button" data-preview="${escapeHTML(skin.id)}" aria-label="Ampliar prévia de ${escapeHTML(skin.name)}">
        <img ${current ? `src="${preview}" ` : ''}data-preview-src="${preview}" alt="" width="320" height="320" loading="lazy" decoding="async" fetchpriority="low"><span>${current ? 'ATIVA' : owned ? 'LIBERADA' : 'PREMIUM'}</span>
      </button>
      <div><small>${escapeHTML(catalog.collection)}</small><h3>${escapeHTML(skin.name)}</h3><p>${skin.id === 'classic' ? 'Grátis para sempre' : 'Incluída no Premium vitalício'}</p></div>
      <button type="button" data-skin-action="${escapeHTML(skin.id)}"${current || this.pending ? ' disabled' : ''}>${current ? 'ATIVA' : owned ? 'USAR ESTA SKIN' : 'CONHECER O PREMIUM'}</button>
    </article>`;
  }

  bind() {
    this.root.querySelector('[data-search]')?.addEventListener('input', event => {
      this.query = event.target.value;
      this.render();
      requestAnimationFrame(() => {
        const input = this.root.querySelector('[data-search]');
        input?.focus();
        input?.setSelectionRange(this.query.length, this.query.length);
      });
    });
    this.root.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      this.filter = button.dataset.filter;
      this.render();
    }));
    this.root.querySelector('[data-classic]')?.addEventListener('click', () => this.switchTo('classic'));
    this.root.querySelector('[data-restore]')?.addEventListener('click', () => this.sync(true));
    this.root.querySelector('[data-open-premium]')?.addEventListener('click', () => globalThis.orbe?.go?.('subscriptions'));
    this.root.querySelectorAll('[data-skin-action]').forEach(button => button.addEventListener('click', () => this.choose(button.dataset.skinAction)));
    this.root.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => this.prepare(button.dataset.preview)));
    this.root.querySelectorAll('[data-skin-card]').forEach(card => {
      const prepare = () => this.prepare(card.dataset.skinCard);
      card.addEventListener('pointerover', prepare, { passive:true });
      card.addEventListener('focusin', prepare);
    });
  }

  prepare(id) {
    const card = this.root.querySelector(`[data-skin-card="${CSS.escape(id)}"]`);
    const image = card?.querySelector('[data-preview-src]');
    this.loadPreview(image, 'high');
    prepareSkinV12(id, { priority:'high' }).catch(() => undefined);
  }

  observePreviews() {
    const images = [...this.root.querySelectorAll('[data-preview-src]')];
    if (typeof IntersectionObserver !== 'function') {
      images.forEach(image => this.loadPreview(image, 'low'));
      return;
    }
    this.previewObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      const image = entry.target;
      image.dataset.near = String(entry.isIntersecting);
      if (entry.isIntersecting) this.loadPreview(image, 'low');
      else this.releasePreviewLater(image);
    }), { rootMargin:'360px 0px', threshold:.01 });
    images.forEach(image => this.previewObserver.observe(image));
  }

  loadPreview(image, priority = 'low') {
    if (!image?.dataset.previewSrc) return;
    const source = image.dataset.previewSrc;
    if (image.getAttribute('src') === source) return;
    if ('fetchPriority' in image) image.fetchPriority = priority;
    image.src = source;
  }

  releasePreviewLater(image) {
    const previous = this.previewUnloadTimers.get(image);
    if (previous) clearTimeout(previous);
    this.previewUnloadTimers.set(image, setTimeout(() => {
      if (image.dataset.near === 'true' || image.closest('[data-skin-card]')?.dataset.skinCard === activeSkinV12()) return;
      image.removeAttribute('src');
    }, PREVIEW_RELEASE_DELAY));
  }

  async choose(id) {
    if (this.pending || !SKINS_V6.some(skin => skin.id === id)) return;
    if (!this.owned.has(id)) {
      announceGlobal(this.authenticated ? 'Esta realidade está incluída no Premium vitalício.' : 'Entre na Conta e conheça o Premium para liberar esta realidade.');
      globalThis.orbe?.go?.(this.authenticated ? 'subscriptions' : 'login');
      return;
    }
    await this.switchTo(id);
  }

  async switchTo(id) {
    if (!this.owned.has(id) || this.pending) return false;
    if (activeSkinV12() === id) return true;
    const token = ++this.switchToken;
    this.pending = id;
    this.updateActiveState();
    const applied = await activateSkinFluidV12(id);
    if (token !== this.switchToken) return false;
    this.pending = '';
    this.updateActiveState();
    const skin = skinByIdV12(id);
    if (!applied) {
      this.announce(`A skin ${skin.name} não conseguiu atravessar o portal.`);
      return false;
    }
    if (!this.authenticated || typeof globalThis.divinaAuth?.saveSkinPreference !== 'function') {
      this.announce(`${skin.name} vive neste aparelho. Entre na Conta para sincronizar a escolha.`);
      return true;
    }
    const saved = await globalThis.divinaAuth.saveSkinPreference(id);
    this.announce(saved?.ok
      ? `${skin.name} agora vive em todas as suas Orbes.`
      : `${skin.name} foi aplicada aqui, mas a conta não confirmou a sincronização.`);
    return applied;
  }

  updateActiveState() {
    const active = activeSkinV12();
    const skin = skinByIdV12(active);
    const title = this.root.querySelector('#skinsV191Current');
    const image = this.root.querySelector('.skins-v191-orb img');
    if (title) title.textContent = skin.name;
    if (image) image.src = skin.preview || skin.image;
    this.root.querySelectorAll('[data-skin-card]').forEach(card => {
      const id = card.dataset.skinCard;
      const current = id === active;
      card.classList.toggle('is-active', current);
      if (current) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
      const button = card.querySelector('[data-skin-action]');
      if (button) {
        button.disabled = current || Boolean(this.pending);
        button.textContent = current ? 'ATIVA' : this.pending === id ? 'ABRINDO…' : this.owned.has(id) ? 'USAR ESTA SKIN' : 'CONHECER O PREMIUM';
      }
    });
  }

  useSnapshot(snapshot) {
    if (!snapshot || snapshot.release !== 'V191') return;
    this.authenticated = snapshot.authenticated === true;
    const allowed = new Set(SKINS_V6.map(skin => skin.id));
    this.owned = new Set(['classic', ...(snapshot.skinIds || []).filter(id => allowed.has(id))]);
    if (!this.owned.has(activeSkinV12())) activateSkinFluidV12('classic').catch(() => undefined);
    this.render();
  }

  async sync(showFeedback = false) {
    const token = ++this.syncToken;
    const result = await globalThis.divinaAuth?.billingSnapshot?.();
    if (token !== this.syncToken) return;
    if (result?.ok && result.body?.snapshot) {
      this.useSnapshot({ ...result.body.snapshot, authenticated:true });
      const preference = await globalThis.divinaAuth?.skinPreference?.();
      if (token !== this.syncToken) return;
      const remoteSkin = String(preference?.body?.skinId || '');
      if (preference?.ok && this.owned.has(remoteSkin) && remoteSkin !== activeSkinV12()) {
        await activateSkinFluidV12(remoteSkin).catch(() => false);
        if (token !== this.syncToken) return;
        this.render();
      }
      if (showFeedback) this.announce(preference?.ok
        ? 'Sua coleção e sua Orbe ativa foram restauradas pelo servidor STAGING.'
        : 'Sua coleção foi restaurada; a preferência visual continua somente neste aparelho.');
      return;
    }
    this.authenticated = false;
    this.owned = new Set(['classic']);
    if (activeSkinV12() !== 'classic') await activateSkinFluidV12('classic').catch(() => false);
    this.render();
    if (showFeedback) this.announce('Entre na Conta para restaurar as skins Premium.');
  }

  announce(message) {
    const live = this.root.querySelector('.skins-v191-live');
    if (live) live.textContent = message;
    announceGlobal(message);
  }

  destroy() {
    this.previewObserver?.disconnect();
    document.removeEventListener('divina:skin-applied', this.onApplied);
    removeEventListener('divina:billing-updated', this.onBilling);
    removeEventListener('divina:auth-state', this.onAuth);
  }
}
