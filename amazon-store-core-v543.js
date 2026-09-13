/* DIVINA BRUXA 3.0 — MACROETAPA 9/14 · LOJA AMAZON V543
   Profundidade editorial sem preço congelado, scraping, checkout ou telemetria privada. */

import { STORE_POLICY } from './store-policy.js?v=543';
import { auditAmazonCatalogV543 } from './store-engine.js?v=543';

const RELEASE = 'V543';
const ROOT_ID = 'storeApp';

const INTENTIONS = Object.freeze([
  { collection: 'tarot-estudo', sigil: '☼', title: 'Estudar o Tarot', copy: 'Baralhos e livros para criar repertório, comparar símbolos e praticar com constância.' },
  { collection: 'ritual-cristais', sigil: '◆', title: 'Preparar um ritual', copy: 'Objetos de atmosfera e presença — nunca substitutos de cuidado médico, psicológico ou financeiro.' },
  { collection: 'casa-orbe', sigil: '☾', title: 'Cuidar do meu espaço', copy: 'Escolhas para guardar, iluminar e organizar o ambiente onde sua prática acontece.' },
  { collection: 'criacao-presentes', sigil: '✦', title: 'Criar ou presentear', copy: 'Tecnologia e presentes escolhidos por finalidade, sem prometer modelo, preço ou disponibilidade.' }
]);

const CHECKS = Object.freeze([
  ['Idioma e edição', 'Confirme se livro ou baralho está em português e se a edição corresponde ao que você procura.'],
  ['Conteúdo do anúncio', 'Compare medidas, quantidade, materiais e itens inclusos; a imagem pode reunir variações.'],
  ['Vendedor e avaliações', 'Leia avaliações recentes e confira quem vende, envia e presta suporte.'],
  ['Entrega e devolução', 'Veja prazo, frete, garantia e política de devolução antes de concluir a compra.']
]);

function render(root, audit) {
  root.querySelector('#amazonStoreCoreV543')?.remove();
  const section = document.createElement('section');
  section.id = 'amazonStoreCoreV543';
  section.className = 'amazon-v543';
  section.setAttribute('aria-labelledby', 'amazon-v543-title');
  section.innerHTML = `
    <header class="amazon-v543__head">
      <div><p class="eyebrow">A ORBE AJUDA A ESCOLHER</p><h3 id="amazon-v543-title">Comece pela sua intenção.</h3>
      <p>Você escolhe o caminho; a curadoria organiza possibilidades. O anúncio final, o preço e a disponibilidade são sempre conferidos na Amazon.</p></div>
      <span class="amazon-v543__seal" aria-hidden="true">◇</span>
    </header>
    <div class="amazon-v543__intentions" aria-label="Caminhos da curadoria">
      ${INTENTIONS.map(item => `<button type="button" data-collection="${item.collection}" aria-pressed="false"><span aria-hidden="true">${item.sigil}</span><b>${item.title}</b><small>${item.copy}</small><em>ABRIR CAMINHO</em></button>`).join('')}
    </div>
    <details class="amazon-v543__checklist">
      <summary><span aria-hidden="true">✦</span><span><b>Ritual de compra consciente</b><small>Quatro conferências antes de sair da Divina Bruxa</small></span><i aria-hidden="true">＋</i></summary>
      <ol>${CHECKS.map(([title, copy]) => `<li><b>${title}</b><span>${copy}</span></li>`).join('')}</ol>
    </details>
    <aside class="amazon-v543__truth" aria-label="Transparência da Loja Amazon">
      <span aria-hidden="true">↗</span><p><b>Link de afiliado, compra externa.</b> ${STORE_POLICY.disclosure} ${STORE_POLICY.partnerNotice}</p>
      <small>${audit.productCount} destinos com formato seguro · ${audit.mutableCommerceClaims} preço ou estoque gravado no site · checkout interno desligado</small>
    </aside>`;
  const catalog = root.querySelector('.store-v148-catalog');
  catalog?.before(section);
  if (!catalog) root.append(section);
  root.dataset.amazonStore = 'v543';
  root.dataset.amazonCatalogAudit = audit.passed ? 'passed' : 'failed';
}

export function createAmazonStoreCoreV543({ config = globalThis.CONFIG } = {}) {
  const controller = new AbortController();
  let lastAudit = auditAmazonCatalogV543(config?.products || [], config?.amazonAssociateTag || '');
  const enhance = () => {
    const root = document.getElementById(ROOT_ID);
    if (!root?.dataset?.storeReady) return false;
    lastAudit = auditAmazonCatalogV543(config?.products || [], config?.amazonAssociateTag || '');
    render(root, lastAudit);
    return true;
  };
  document.addEventListener('divina:store-world-ready', enhance, { signal: controller.signal });
  document.addEventListener('divina:page-ready', event => {
    if (event.detail?.id === 'store') enhance();
  }, { signal: controller.signal });
  enhance();
  return Object.freeze({
    release: RELEASE,
    enhance,
    audit: () => lastAudit,
    status: () => Object.freeze({
      release: RELEASE,
      macroStage: '9-of-14',
      world: 'store',
      products: lastAudit.productCount,
      collections: STORE_POLICY.collections.length,
      affiliateHost: STORE_POLICY.affiliateHost,
      checkoutInternal: false,
      mutableCommerceClaims: 0,
      privateContentReads: 0,
      permanentAnimationLoops: 0,
      passed: lastAudit.passed
    }),
    destroy: () => controller.abort()
  });
}
