/* DIVINA BRUXA 2.0 — REBIRTH R001 · CONSTELAÇÃO DE NAVEGAÇÃO V300
   O menu deixa de ser lista: quatro constelações orbitam uma Orbe central. */

const CLUSTERS = Object.freeze({
  tarot: {
    label:'Tarot',
    hint:'Abrir símbolos, cartas e aprendizado',
    routes:[['tarot','✦','Tarot Livre'],['spreads','✧','Tiragens'],['daily','☾','Carta do Dia'],['library','▥','Biblioteca'],['school','◇','Escola']]
  },
  self: {
    label:'Você',
    hint:'Seu espaço dentro do universo',
    routes:[['journal','◌','Diário'],['skins','◆','Skins'],['subscriptions','✦','Premium'],['login','◎','Conta']]
  },
  worlds: {
    label:'Mundos',
    hint:'Explorar tudo além da leitura',
    routes:[['consultations','✧','Consultas'],['store','◇','Loja Mística'],['music','♫','Música'],['videos','▶','Vídeos'],['notifications','☾','Notificações']]
  },
  whit: {
    label:'Whit',
    hint:'Presença que conecta os mundos',
    routes:[['ai','✦','Entrar em Whit']]
  }
});

const routeButton = ([id, sigil, label]) => `<button class="db-menu-destination" type="button" data-go="${id}"><span aria-hidden="true">${sigil}</span><b>${label}</b></button>`;

function buildMenu() {
  const menu = document.querySelector('#orbMenu');
  if (!menu) return false;
  menu.className = 'home-orb-menu db-cosmos-menu';
  menu.dataset.menuVersion = '300';
  menu.setAttribute('aria-label', 'Universo de navegação da Divina Bruxa');
  menu.innerHTML = `
    <div class="db-menu-sky">
      <p class="db-menu-whisper" aria-hidden="true">ESCOLHA UM CAMINHO</p>
      <button class="db-menu-core" type="button" data-go="home" aria-label="Voltar à Orbe central">
        <span class="db-menu-core__orb" data-orb-surface="menu"></span>
        <span class="db-menu-core__name">DIVINA BRUXA</span>
      </button>
      <div class="db-menu-constellations" role="tablist" aria-label="Constelações do universo">
        ${Object.entries(CLUSTERS).map(([id, cluster], index) => `<button type="button" role="tab" data-menu-cluster="${id}" aria-selected="${index === 0}" aria-controls="db-menu-panel-${id}"><span>${cluster.label}</span><small>${cluster.hint}</small></button>`).join('')}
      </div>
      <div class="db-menu-panels">
        ${Object.entries(CLUSTERS).map(([id, cluster], index) => `<section id="db-menu-panel-${id}" class="db-menu-panel" data-menu-panel="${id}" role="tabpanel" ${index ? 'hidden inert' : ''}>${cluster.routes.map(routeButton).join('')}</section>`).join('')}
      </div>
      <p class="db-menu-foot">A Orbe permanece o centro. Whit aparece quando você quiser companhia.</p>
    </div>`;
  if (menu.parentElement !== document.body) document.body.append(menu);

  const activate = id => {
    if (!CLUSTERS[id]) return;
    menu.querySelectorAll('[data-menu-cluster]').forEach(button => {
      const active = button.dataset.menuCluster === id;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    menu.querySelectorAll('[data-menu-panel]').forEach(panel => {
      const active = panel.dataset.menuPanel === id;
      panel.hidden = !active;
      if ('inert' in panel) panel.inert = !active;
      else panel.toggleAttribute('inert', !active);
    });
    menu.dataset.activeCluster = id;
  };

  menu.addEventListener('click', event => {
    const cluster = event.target.closest('[data-menu-cluster]');
    if (cluster) activate(cluster.dataset.menuCluster);
  });
  menu.addEventListener('keydown', event => {
    const current = event.target.closest('[data-menu-cluster]');
    if (!current || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...menu.querySelectorAll('[data-menu-cluster]')];
    let index = tabs.indexOf(current);
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else index = (index + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + tabs.length) % tabs.length;
    const next = tabs[index];
    activate(next.dataset.menuCluster);
    next.focus();
  });
  activate('tarot');
  document.dispatchEvent(new CustomEvent('divina:menu-built', { detail:{ version:300 } }));
  return true;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildMenu, { once:true });
else buildMenu();
