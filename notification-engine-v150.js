/* DIVINA BRUXA — NOTIFICAÇÕES CELESTIAIS V150
   Preferências locais honestas; permissão do navegador somente após toque explícito. */
import { store } from './storage.js';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CONSENT_VERSION,
  NOTIFICATION_STORAGE_KEY,
  QUIET_HOURS,
  SAFE_DAILY_MESSAGE,
  defaultNotificationPreferences,
  normalizeNotificationPreferences,
  safeNotificationRoute
} from './notification-policy-v150.js?v=150';

const emit = message => window.dispatchEvent(new CustomEvent('orbe:toast', { detail: message }));

const permissionState = () => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

const permissionCopy = state => ({
  granted: ['PERMITIDO', 'Este navegador já pode mostrar avisos quando o site estiver aberto.'],
  denied: ['BLOQUEADO', 'A permissão foi bloqueada. Reative-a nos ajustes do navegador.'],
  default: ['NÃO SOLICITADO', 'A Orbe só pedirá permissão quando você tocar em “Ativar neste aparelho”.'],
  unsupported: ['INDISPONÍVEL', 'Este navegador não oferece notificações para este site.']
}[state] || ['DESCONHECIDO', 'Verifique as configurações deste navegador.']);

const loadLegacyV8 = () => {
  try { return JSON.parse(localStorage.getItem('divina-notification-preferences-v8') || 'null'); }
  catch { return null; }
};

const readPreferences = () => {
  const current = store.get(NOTIFICATION_STORAGE_KEY, null);
  if (current) return normalizeNotificationPreferences(current);
  const legacy = store.get('notifications-v5', null) || loadLegacyV8();
  return legacy ? normalizeNotificationPreferences(legacy) : defaultNotificationPreferences();
};

const persist = value => {
  try { store.set(NOTIFICATION_STORAGE_KEY, value); return true; }
  catch { return false; }
};

export class CelestialNotificationEngine {
  constructor(root, go) {
    this.root = root;
    this.go = go;
    this.state = readPreferences();
    if (root) this.render();
  }

  render() {
    const permission = permissionState();
    const [permissionLabel, permissionDescription] = permissionCopy(permission);
    const enabled = this.state.enabled === true;
    const quiet = this.state.quietHours || QUIET_HOURS;
    const activeCount = NOTIFICATION_CATEGORIES.filter(category => this.state.categories?.[category.id]).length;

    this.root.innerHTML = `<div class="celestial-notifications-v150">
      <header class="celestial-notification-hero">
        <div class="celestial-bell" aria-hidden="true"><i></i><span>☾</span></div>
        <div>
          <p class="eyebrow">NOTIFICAÇÕES CELESTIAIS · V150</p>
          <h3>Você escolhe quando a Orbe chama.</h3>
          <p>Controle cada tema, preserve seu horário de silêncio e ative o navegador somente se desejar.</p>
        </div>
        <div class="celestial-status-ribbon" aria-label="Resumo das preferências">
          <span class="${enabled ? 'is-on' : ''}"><b>${enabled ? 'ATIVAS' : 'PAUSADAS'}</b><small>neste aparelho</small></span>
          <span><b>${activeCount}/10</b><small>temas escolhidos</small></span>
          <span><b>${quiet.start}–${quiet.end}</b><small>horário silencioso</small></span>
        </div>
      </header>

      <section class="celestial-permission-card" data-permission="${permission}">
        <div><span aria-hidden="true">◎</span><p><small>PERMISSÃO DO NAVEGADOR</small><strong>${permissionLabel}</strong><em>${permissionDescription}</em></p></div>
        <button type="button" data-enable-device ${permission === 'granted' || permission === 'unsupported' ? 'disabled' : ''}>${permission === 'denied' ? 'COMO REATIVAR' : permission === 'granted' ? 'JÁ ATIVADO' : permission === 'unsupported' ? 'INDISPONÍVEL' : 'ATIVAR NESTE APARELHO'}</button>
      </section>

      <form class="celestial-notification-form" data-notification-form novalidate>
        <label class="celestial-master-switch">
          <span><b>Avisos neste aparelho</b><small>O interruptor principal começa desligado e não envia nada sozinho.</small></span>
          <input type="checkbox" name="enabled" ${enabled ? 'checked' : ''}>
          <i aria-hidden="true"></i>
        </label>

        <fieldset class="celestial-category-fieldset">
          <legend>Escolha o que deseja receber</legend>
          <p>Segurança e cobranças permanecem selecionadas por serem essenciais, mas dependem do sistema seguro quando ele estiver ativo.</p>
          <div class="celestial-category-grid">
            ${NOTIFICATION_CATEGORIES.map(category => `<label class="celestial-category ${category.essential ? 'is-essential' : ''} ${category.marketing ? 'is-marketing' : ''}">
              <span class="celestial-category-sigil" aria-hidden="true">${category.sigil}</span>
              <span><b>${category.label}</b><small>${category.description}</small>${category.essential ? '<em>ESSENCIAL</em>' : category.marketing ? '<em>OPCIONAL · CONSENTIMENTO</em>' : ''}</span>
              <input type="checkbox" data-category="${category.id}" ${this.state.categories?.[category.id] ? 'checked' : ''} ${category.essential ? 'disabled' : ''}>
              <i aria-hidden="true"></i>
            </label>`).join('')}
          </div>
        </fieldset>

        <fieldset class="celestial-quiet-fieldset">
          <legend>Horário silencioso</legend>
          <label class="celestial-quiet-toggle"><input type="checkbox" name="quietEnabled" ${quiet.enabled !== false ? 'checked' : ''}><span><b>Respeitar meu silêncio</b><small>Fuso de Brasília · America/Sao_Paulo</small></span></label>
          <div class="celestial-time-grid">
            <label><span>Começa</span><input type="time" name="quietStart" value="${quiet.start}"></label>
            <label><span>Termina</span><input type="time" name="quietEnd" value="${quiet.end}"></label>
          </div>
          <p>Alertas realmente essenciais de segurança e cobrança podem aparecer fora desse intervalo quando o serviço seguro estiver conectado.</p>
        </fieldset>

        <aside class="celestial-truth-card">
          <span aria-hidden="true">◇</span>
          <div><b>Transparência desta versão</b><p>Suas escolhas ficam somente neste aparelho. Não há envio automático, agendamento em segundo plano nem provedor de push ativo na V150. A Carta do Dia nunca é revelada no texto do aviso.</p></div>
        </aside>

        <div class="celestial-notification-actions">
          <button type="submit" class="primary">SALVAR PREFERÊNCIAS</button>
          <button type="button" class="ghost" data-test-notification>TESTAR AVISO</button>
        </div>
        <p class="celestial-notification-feedback" data-notification-feedback role="status" aria-live="polite">${this.state.savedAt ? 'Preferências deste aparelho salvas com segurança local.' : 'Nenhuma permissão será solicitada ao salvar.'}</p>
      </form>

      <footer class="celestial-notification-footer">
        <button type="button" data-notification-go="daily"><span>☾</span><b>Carta do Dia</b><small>Abrir ritual</small></button>
        <button type="button" data-notification-go="consultations"><span>♙</span><b>Consultas</b><small>Acompanhar caminho</small></button>
        <button type="button" data-notification-go="login"><span>◎</span><b>Minha Orbe</b><small>Conta e segurança</small></button>
      </footer>
    </div>`;
    this.bind();
  }

  bind() {
    this.root.querySelector('[data-enable-device]')?.addEventListener('click', () => this.enableDevice());
    this.root.querySelector('[data-notification-form]')?.addEventListener('submit', event => this.save(event));
    this.root.querySelector('[data-test-notification]')?.addEventListener('click', () => this.test());
    this.root.querySelectorAll('[data-notification-go]').forEach(button => button.addEventListener('click', () => this.go?.(button.dataset.notificationGo)));
  }

  setFeedback(message, tone = '') {
    const element = this.root.querySelector('[data-notification-feedback]');
    if (!element) return;
    element.textContent = message;
    element.dataset.tone = tone;
  }

  async enableDevice() {
    const permission = permissionState();
    if (permission === 'unsupported') {
      this.setFeedback('Este navegador não oferece notificações para este site.', 'error');
      return;
    }
    if (permission === 'denied') {
      this.setFeedback('Abra Ajustes do navegador → Notificações → Divina Bruxa e permita os avisos.', 'error');
      return;
    }
    const result = permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (result === 'granted') {
      this.state.enabled = true;
      persist(this.state);
      this.render();
      this.setFeedback('Permissão concedida. Agora escolha os temas e salve.', 'success');
      emit('Notificações permitidas neste aparelho.');
      return;
    }
    this.render();
    this.setFeedback('A permissão não foi concedida. Nada será enviado.', 'error');
  }

  save(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const wasMarketing = this.state.marketingConsent?.granted === true;
    const now = new Date().toISOString();
    const categories = Object.fromEntries(NOTIFICATION_CATEGORIES.map(category => {
      const input = form.querySelector(`[data-category="${category.id}"]`);
      return [category.id, category.essential ? true : Boolean(input?.checked)];
    }));
    const marketingGranted = categories.marketing === true;
    this.state = normalizeNotificationPreferences({
      enabled: form.elements.enabled.checked,
      categories,
      quietHours: {
        enabled: form.elements.quietEnabled.checked,
        start: form.elements.quietStart.value,
        end: form.elements.quietEnd.value
      },
      marketingConsent: {
        granted: marketingGranted,
        version: NOTIFICATION_CONSENT_VERSION,
        consentedAt: marketingGranted ? (wasMarketing ? this.state.marketingConsent?.consentedAt : now) : null,
        revokedAt: !marketingGranted && wasMarketing ? now : this.state.marketingConsent?.revokedAt || null
      },
      savedAt: now
    });
    this.state.savedAt = now;
    if (!persist(this.state)) {
      this.setFeedback('O navegador não permitiu guardar as preferências neste aparelho.', 'error');
      return;
    }
    const message = this.state.enabled
      ? 'Preferências salvas neste aparelho. Não há envio automático nesta versão.'
      : 'Preferências salvas e avisos pausados neste aparelho.';
    this.render();
    this.setFeedback(message, 'success');
    emit('Preferências de notificações salvas.');
  }

  async test() {
    if (permissionState() !== 'granted') {
      this.setFeedback('Primeiro toque em “Ativar neste aparelho”. O teste não pedirá permissão sozinho.', 'error');
      return;
    }
    try {
      const registration = await navigator.serviceWorker?.ready;
      if (registration?.showNotification) {
        await registration.showNotification('Divina Bruxa', {
          body: SAFE_DAILY_MESSAGE,
          icon: './divina-icon-fast-v1.png',
          badge: './divina-icon-fast-v1.png',
          tag: 'divina-bruxa-v150-test',
          data: { url: safeNotificationRoute('#daily'), testOnly: true }
        });
      } else {
        new Notification('Divina Bruxa', { body: SAFE_DAILY_MESSAGE, tag: 'divina-bruxa-v150-test' });
      }
      this.setFeedback('Aviso de teste enviado somente para este aparelho.', 'success');
    } catch {
      this.setFeedback('O navegador não conseguiu mostrar o teste. Verifique se o site foi instalado e se a permissão continua ativa.', 'error');
    }
  }
}
