/* DIVINA BRUXA — SALÃO DAS REALIDADES V7
   Galeria progressiva, troca atômica e nenhuma reconstrução da página ao escolher uma skin. */

import { SKINS_V6 } from './skin-catalog-v6.js';
import { skinByIdV12 } from './skin-registry-v12.js?v=133';
import { activateSkinFluidV12, activeSkinV12, prepareSkinV12 } from './runtime-v12.js?v=133';

const KEY = 'divina-skin-entitlements-v6';
const PREVIEW_RELEASE_DELAY = 12000;
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const escapeHTML = value => String(value).replace(/[&<>"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
})[character]);

const read = () => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]');
    const ids = Array.isArray(value) ? value.filter(id => SKINS_V6.some(skin => skin.id === id)) : [];
    return new Set(['classic', ...ids]);
  } catch {
    return new Set(['classic']);
  }
};

const write = set => {
  try { localStorage.setItem(KEY, JSON.stringify([...set])); }
  catch { /* armazenamento local é opcional */ }
};

export class SkinsEngine {
  constructor(root) {
    this.root = root;
    if (!root) return;

    this.owned = read();
    this.pending = '';
    this.switchToken = 0;
    this.syncToken = 0;
    this.previewUnloadTimers = new WeakMap();
    this.renderOnce();
    this.bind();
    this.observePreviews();
    this.updateActiveState();
    this.sync(false);
  }

  skinCardMarkup(catalogSkin, active) {
    const skin = skinByIdV12(catalogSkin.id);
    const current = skin.id === active;
    const owned = this.owned.has(skin.id);
    const price = catalogSkin.priceCents ? money.format(catalogSkin.priceCents / 100) : 'Grátis';
    const source = escapeHTML(skin.preview || skin.image);
    return `
      <article class="skin-tile${current ? ' is-active' : ''}" data-skin-card="${escapeHTML(skin.id)}"
        style="--skin-accent:${escapeHTML(skin.tokens.accent)};--skin-light:${escapeHTML(skin.tokens.light)}"
        role="listitem"${current ? ' aria-current="true"' : ''}>
        <div class="skin-preview" role="img" aria-label="Prévia da skin ${escapeHTML(skin.name)}">
          <img ${current ? `src="${source}" ` : ''}data-preview-src="${source}" data-preview-skin="${escapeHTML(skin.id)}"
            class="${current ? 'is-loaded' : ''}" alt="" width="320" height="320" loading="lazy" decoding="async" fetchpriority="low" aria-hidden="true">
          <span class="skin-active-seal" aria-hidden="true">✦</span>
        </div>
        <div class="skin-copy">
          <h3>${escapeHTML(skin.name)}</h3>
          <p data-skin-state>${current ? 'Vive em todas as Orbes' : owned ? 'Disponível na sua coleção' : 'Realidade exclusiva'}</p>
          <strong>${price}</strong>
        </div>
        <button type="button" data-skin-action="${escapeHTML(skin.id)}" aria-pressed="${current}"${current ? ' disabled' : ''}>
          ${current ? 'ATIVA' : owned ? 'USAR ESTA SKIN' : 'DESBLOQUEAR'}
        </button>
      </article>`;
  }

  renderOnce() {
    const active = activeSkinV12();
    const skin = skinByIdV12(active);
    this.root.innerHTML = `
      <div class="skins-v7-shell">
        <section class="skins-v7-current" aria-labelledby="skinsCurrentTitle">
          <div class="skins-v7-active-orb" aria-hidden="true">
            <img id="skinsCurrentImage" src="${escapeHTML(skin.preview || skin.image)}" alt="" width="320" height="320" decoding="async" fetchpriority="high">
            <span>✦</span>
          </div>
          <div class="skins-v7-current-copy">
            <p>SUA ORBE ATUAL</p>
            <h3 id="skinsCurrentTitle">${escapeHTML(skin.name)}</h3>
            <span>Sincronizada na Home, no menu, no rodapé, no Tarot Livre e em todos os portais.</span>
          </div>
        </section>

        <div class="skins-v7-tools" aria-label="Ações da coleção de skins">
          <button type="button" data-skins-classic>Usar Clássica Divina</button>
          <button type="button" data-skins-restore>Restaurar compras</button>
        </div>

        <p id="skinsLive" class="skins-v7-sr" role="status" aria-live="polite" aria-atomic="true"></p>
        <div class="skins-v6-grid" role="list" aria-label="Trinta skins da Orbe">
          ${SKINS_V6.map(catalogSkin => this.skinCardMarkup(catalogSkin, active)).join('')}
        </div>
      </div>`;

    this.currentImage = this.root.querySelector('#skinsCurrentImage');
    this.currentTitle = this.root.querySelector('#skinsCurrentTitle');
    this.live = this.root.querySelector('#skinsLive');
    this.classicButton = this.root.querySelector('[data-skins-classic]');
    this.restoreButton = this.root.querySelector('[data-skins-restore]');
  }

  bind() {
    this.onClick = event => {
      const restore = event.target.closest('[data-skins-restore]');
      if (restore) {
        this.sync(true);
        return;
      }

      const classic = event.target.closest('[data-skins-classic]');
      if (classic) {
        this.switchTo('classic');
        return;
      }

      const action = event.target.closest('[data-skin-action]');
      if (!action) return;
      this.choose(action.dataset.skinAction);
    };

    this.onIntent = event => {
      const card = event.target.closest?.('[data-skin-card]');
      if (!card) return;
      const id = card.dataset.skinCard;
      const preview = card.querySelector('[data-preview-src]');
      this.loadPreview(preview, 'high');
      prepareSkinV12(id, { priority: 'high' }).catch(() => {});
    };

    this.onApplied = () => this.updateActiveState();
    this.root.addEventListener('click', this.onClick);
    this.root.addEventListener('pointerover', this.onIntent, { passive: true });
    this.root.addEventListener('pointerdown', this.onIntent, { passive: true });
    this.root.addEventListener('focusin', this.onIntent);
    document.addEventListener('divina:skin-applied', this.onApplied);
  }

  observePreviews() {
    const previews = [...this.root.querySelectorAll('[data-preview-src]')];
    if (typeof IntersectionObserver !== 'function') {
      previews.forEach(preview => {
        preview.loading = 'lazy';
        this.loadPreview(preview, 'low');
      });
      return;
    }

    this.previewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const preview = entry.target;
        preview.dataset.previewNear = String(entry.isIntersecting);
        if (entry.isIntersecting) {
          const timer = this.previewUnloadTimers.get(preview);
          if (timer) clearTimeout(timer);
          this.loadPreview(preview, 'low');
        } else {
          this.queuePreviewRelease(preview);
        }
      });
    }, { rootMargin: '360px 0px', threshold: 0.01 });

    previews.forEach(preview => this.previewObserver.observe(preview));
  }

  loadPreview(preview, priority = 'low') {
    if (!preview) return;
    const source = preview.dataset.previewSrc;
    if (!source) return;
    if (preview.getAttribute('src') === source && preview.complete && preview.naturalWidth) {
      preview.classList.add('is-loaded');
      return;
    }
    if (preview.dataset.previewLoading === source) return;

    preview.dataset.previewLoading = source;
    if ('fetchPriority' in preview) preview.fetchPriority = priority;
    preview.onload = async () => {
      try { await preview.decode?.(); } catch { /* a imagem carregada continua válida */ }
      if (preview.dataset.previewLoading !== source) return;
      preview.classList.add('is-loaded');
      delete preview.dataset.previewLoading;
    };
    preview.onerror = () => {
      if (preview.dataset.previewLoading !== source) return;
      preview.classList.remove('is-loaded');
      delete preview.dataset.previewLoading;
    };
    preview.src = source;
  }

  queuePreviewRelease(preview) {
    const previous = this.previewUnloadTimers.get(preview);
    if (previous) clearTimeout(previous);
    const timer = setTimeout(() => {
      if (preview.dataset.previewNear === 'true') return;
      const card = preview.closest('[data-skin-card]');
      if (card?.dataset.skinCard === activeSkinV12()) return;
      preview.onload = null;
      preview.onerror = null;
      preview.removeAttribute('src');
      preview.classList.remove('is-loaded');
      delete preview.dataset.previewLoading;
    }, PREVIEW_RELEASE_DELAY);
    this.previewUnloadTimers.set(preview, timer);
  }

  releaseFarPreviews() {
    this.root.querySelectorAll('[data-preview-near="false"][data-preview-src]').forEach(preview => {
      this.queuePreviewRelease(preview);
    });
  }

  async choose(id) {
    if (!SKINS_V6.some(skin => skin.id === id) || this.pending) return false;
    if (this.owned.has(id)) return this.switchTo(id);

    this.pending = id;
    this.updateActiveState();
    const remote = await globalThis.divinaAuth?.saveSkinEntitlement?.(id);
    if (globalThis.divinaAuth?.enabled && !remote?.ok) {
      this.pending = '';
      this.updateActiveState();
      this.announce('Não foi possível liberar essa skin agora. Tente novamente.');
      return false;
    }

    this.owned.add(id);
    write(this.owned);
    this.pending = '';
    return this.switchTo(id, {
      message: globalThis.divinaAuth?.enabled
        ? 'Skin liberada na sua coleção e ativada.'
        : 'Skin liberada nesta demonstração e ativada.'
    });
  }

  async switchTo(id, { message = '' } = {}) {
    if (!SKINS_V6.some(skin => skin.id === id)) return false;
    if (activeSkinV12() === id) {
      this.pending = '';
      this.updateActiveState();
      return true;
    }

    const token = ++this.switchToken;
    this.pending = id;
    this.updateActiveState();
    const applied = await activateSkinFluidV12(id);
    if (token !== this.switchToken) return false;

    this.pending = '';
    this.updateActiveState();
    const skin = skinByIdV12(id);
    if (!applied) {
      this.announce(`A skin ${skin.name} não conseguiu atravessar o portal. Tente novamente.`);
      return false;
    }

    this.announce(message || `${skin.name} agora vive em todas as suas Orbes.`);
    this.releaseFarPreviews();
    return true;
  }

  updateActiveState() {
    if (!this.root) return;
    const active = activeSkinV12();
    const activeSkin = skinByIdV12(active);
    this.root.dataset.switching = this.pending ? 'true' : 'false';

    if (this.currentTitle) this.currentTitle.textContent = activeSkin.name;
    if (this.currentImage) {
      const source = activeSkin.preview || activeSkin.image;
      const target = new URL(source, document.baseURI).href;
      if (this.currentImage.src !== target) this.currentImage.src = source;
    }
    if (this.classicButton) this.classicButton.disabled = active === 'classic' || Boolean(this.pending);

    this.root.querySelectorAll('[data-skin-card]').forEach(card => {
      const id = card.dataset.skinCard;
      const current = id === active;
      const owned = this.owned.has(id);
      const waiting = id === this.pending;
      card.classList.toggle('is-active', current);
      card.classList.toggle('is-switching', waiting);
      if (current) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');

      const state = card.querySelector('[data-skin-state]');
      if (state) state.textContent = current
        ? 'Vive em todas as Orbes'
        : waiting
          ? 'Preparando a realidade…'
          : owned
            ? 'Disponível na sua coleção'
            : 'Realidade exclusiva';

      const button = card.querySelector('[data-skin-action]');
      if (!button) return;
      button.disabled = current || Boolean(this.pending);
      button.setAttribute('aria-pressed', String(current));
      button.textContent = current ? 'ATIVA' : waiting ? 'ABRINDO…' : owned ? 'USAR ESTA SKIN' : 'DESBLOQUEAR';
    });
  }

  announce(message) {
    if (this.live) {
      this.live.textContent = '';
      requestAnimationFrame(() => { if (this.live) this.live.textContent = message; });
    }
    window.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));
  }

  async sync(showFeedback = false) {
    const token = ++this.syncToken;
    if (this.restoreButton) {
      this.restoreButton.disabled = true;
      this.restoreButton.textContent = 'Restaurando…';
    }

    const result = await globalThis.divinaAuth?.skinEntitlements?.();
    if (token !== this.syncToken) return;
    const ids = result?.ok && Array.isArray(result.body?.skinIds)
      ? result.body.skinIds.filter(id => SKINS_V6.some(skin => skin.id === id))
      : null;

    if (ids) {
      this.owned = new Set(['classic', ...ids]);
      write(this.owned);
      if (!this.owned.has(activeSkinV12())) await this.switchTo('classic');
    } else {
      this.owned = read();
    }

    if (this.restoreButton) {
      this.restoreButton.disabled = false;
      this.restoreButton.textContent = 'Restaurar compras';
    }
    this.updateActiveState();
    if (showFeedback) this.announce(ids
      ? 'Sua coleção de skins foi restaurada.'
      : 'As skins disponíveis neste aparelho foram restauradas.');
  }
}
