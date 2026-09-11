/* DIVINA BRUXA 2.0 — REBIRTH R019 · SKINS + PREMIUM V318
   Mundos vivos sobre SkinsEngine V201 e PremiumEngine V191.
   Não duplica catálogo, entitlement, snapshot, billing, compra ou troca de skin. */

import { SkinsEngineV201 } from './skins-v201.js?v=201';
import { PremiumEngineV191 } from './premium-engine-v191.js?v=191';
import { activeSkinV12, prepareSkinV12 } from './runtime-v12.js?v=133';
import { skinByIdV12 } from './skin-registry-v12.js?v=133';

const RELEASE = 'V318';
const SKINS_WORLD_ID = 'skinsWorldV318';
const PREMIUM_WORLD_ID = 'premiumWorldV318';

const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));

const emit = (type, detail = {}) =>
  document.dispatchEvent(new CustomEvent(type, {
    detail:Object.freeze({ release:RELEASE, ...detail })
  }));

function currentSkinName() {
  try { return skinByIdV12(activeSkinV12())?.name || 'Orbe Clássica Divina'; }
  catch { return 'Orbe Clássica Divina'; }
}

export class SkinsWorldV318 {
  constructor(root) {
    this.root = root?.id === 'skinsApp' ? root : document.querySelector('#skinsApp');
    if (!this.root) return;

    this.engine = new SkinsEngineV201(this.root);
    this.originalRender = this.engine.render.bind(this.engine);
    this.engine.render = (...args) => {
      const result = this.originalRender(...args);
      queueMicrotask(() => this.enhance());
      return result;
    };

    this.onApplied = event => {
      this.enhance(true);
      emit('divina:skins-world-changed', {
        skinId:String(event.detail?.skinId || activeSkinV12()),
        bodyIncluded:false
      });
    };
    document.addEventListener('divina:skin-applied', this.onApplied);

    this.root.dataset.skinsWorld = 'v318';
    this.enhance(true);
    emit('divina:skins-world-ready', {
      total:30,
      freeSkin:'classic',
      realBilling:false
    });
  }

  enhance(force = false) {
    if (!this.root) return;
    let world = document.getElementById(SKINS_WORLD_ID);
    if (!world) {
      world = document.createElement('section');
      world.id = SKINS_WORLD_ID;
      world.className = 'skins-world-v318';
      this.root.prepend(world);
    }

    const activeId = activeSkinV12();
    const active = skinByIdV12(activeId);
    world.innerHTML = `
      <div class="spw318__aurora" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="spw318__head">
        <div>
          <p class="eyebrow">SKINS · VESTIR A ORBE</p>
          <h3>A mesma alma. Trinta formas.</h3>
          <p>Troque a aparência sem interromper a jornada. A skin acompanha todas as Orbes e nunca altera sorte, cartas, significado ou acesso.</p>
        </div>
        <div class="spw318__living-orb" aria-hidden="true">
          <img src="${safe(active.preview || active.image)}" alt="" width="180" height="180" decoding="async">
          <i></i>
        </div>
      </header>
      <div class="spw318__identity">
        <p><small>FORMA ATUAL</small><b>${safe(active.name)}</b><span>aplicada globalmente</span></p>
        <div>
          <span>30</span><small>formas totais</small>
        </div>
        <button type="button" data-spw318-premium>VER A COROA PREMIUM</button>
      </div>
      <p class="spw318__truth"><span>◇</span><span><b>Cosmético é cosmético.</b> Nenhuma skin melhora leituras, IA ou chances. A Clássica Divina continua gratuita.</span></p>`;

    world.querySelector('[data-spw318-premium]')?.addEventListener('click', () => {
      globalThis.orbe?.go?.('subscriptions');
    });

    // Pré-aquece a skin ativa para transições visuais mais suaves.
    prepareSkinV12(activeId, { priority:'high' }).catch(() => undefined);
  }

  status() {
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V201',
      totalSkins:30,
      activeSkin:activeSkinV12(),
      globalApply:true,
      cosmeticOnly:true,
      realBilling:false
    });
  }

  destroy() {
    document.removeEventListener('divina:skin-applied', this.onApplied);
    this.engine?.destroy?.();
    document.getElementById(SKINS_WORLD_ID)?.remove();
    delete this.root?.dataset?.skinsWorld;
  }
}

export class PremiumWorldV318 {
  constructor(root) {
    this.root = root?.id === 'subscriptionApp' ? root : document.querySelector('#subscriptionApp');
    if (!this.root) return;

    this.engine = new PremiumEngineV191(this.root);
    this.originalRender = this.engine.render.bind(this.engine);
    this.engine.render = (...args) => {
      const result = this.originalRender(...args);
      queueMicrotask(() => this.enhance());
      return result;
    };

    this.root.dataset.premiumWorld = 'v318';
    this.enhance(true);
    emit('divina:premium-world-ready', {
      premiumPriceCents:19990,
      aiPriceCents:8990,
      realBilling:false,
      stripeCheckout:false
    });
  }

  enhance() {
    if (!this.root) return;
    let world = document.getElementById(PREMIUM_WORLD_ID);
    if (!world) {
      world = document.createElement('section');
      world.id = PREMIUM_WORLD_ID;
      world.className = 'premium-world-v318';
      this.root.prepend(world);
    }

    const snapshot = this.engine?.snapshot || {};
    const authenticated = snapshot.authenticated === true;
    const premiumActive = snapshot.entitlements?.some(
      item => item.key === 'premium_lifetime' && item.status === 'active'
    );
    const aiActive = snapshot.entitlements?.some(
      item => item.key === 'orbe_ai_monthly' && item.status === 'active'
    );

    world.innerHTML = `
      <div class="spw318__crown-glow" aria-hidden="true"></div>
      <header class="spw318__head spw318__head--premium">
        <div>
          <p class="eyebrow">COROA PREMIUM · JORNADA COMPLETA</p>
          <h3>Valor claro. Magia sem armadilha.</h3>
          <p>Premium é vitalício e a Orbe IA continua separada. O ambiente permanece STAGING: nenhum pagamento real é processado nesta etapa.</p>
        </div>
        <span class="spw318__crown" aria-hidden="true">♢</span>
      </header>

      <div class="spw318__plans">
        <article class="${premiumActive ? 'is-active' : ''}">
          <small>PREMIUM VITALÍCIO</small>
          <strong>R$ 199,90</strong>
          <p>17 módulos · 124 aulas · tiragens avançadas · Diário/Espelho avançados · offline preparado · 30 skins.</p>
          <span>${premiumActive ? 'ATIVO NO STAGING' : 'PAGAMENTO ÚNICO'}</span>
        </article>

        <article class="${aiActive ? 'is-active' : ''}">
          <small>ORBE IA</small>
          <strong>R$ 89,90/mês</strong>
          <p>400 créditos por ciclo. Luna = 1 · Terra = 10 · Sol continua OFF.</p>
          <span>${aiActive ? 'ATIVA NO STAGING' : 'PRODUTO SEPARADO'}</span>
        </article>
      </div>

      <div class="spw318__covenant">
        <span>✦</span>
        <p><b>${authenticated ? 'Servidor STAGING conectado à conta.' : 'Entre na Conta para restaurar acessos.'}</b>
        <small>Interface nunca concede entitlement sozinha. Snapshot do servidor continua sendo a autoridade.</small></p>
        <button type="button" data-spw318-skins>VER AS 30 SKINS</button>
      </div>`;

    world.querySelector('[data-spw318-skins]')?.addEventListener('click', () => {
      globalThis.orbe?.go?.('skins');
    });
  }

  status() {
    const snapshot = this.engine?.snapshot || {};
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V191',
      environment:snapshot.environment || 'staging',
      premiumLifetimePriceCents:19990,
      aiMonthlyPriceCents:8990,
      realBilling:false,
      stripeCheckout:false,
      serverAuthority:true
    });
  }

  destroy() {
    this.engine?.destroy?.();
    document.getElementById(PREMIUM_WORLD_ID)?.remove();
    delete this.root?.dataset?.premiumWorld;
  }
}
