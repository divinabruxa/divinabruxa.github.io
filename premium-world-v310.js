import { PLANS as BASE_PLANS } from './data/plans.js';
import { money } from './data/consultations.js';

const PLANS = Object.freeze(BASE_PLANS.map(plan => plan.id === 'premium' ? Object.freeze({
  ...plan,
  description:'Onze tiragens profundas, Escola offline e as 30 skins cosméticas.',
  includes:Object.freeze(['11 tiragens Premium', 'Escola completa', '30 skins cosméticas'])
}) : plan));

export function createPremiumWorld({ navigate, announce }) {
  const planRoot = document.querySelector('#premiumPlans');
  let ready = false;

  function render() {
    if (ready) return;
    ready = true;
    planRoot.replaceChildren(...PLANS.map(plan => {
      const article = document.createElement('article');
      article.className = `premium-card${plan.featured ? ' is-featured' : ''}`;
      article.innerHTML = `
        ${plan.featured ? '<span class="premium-card__mark">CHAVE CENTRAL</span>' : ''}
        <p class="eyebrow">${plan.id === 'presence' ? 'PORTA ABERTA' : plan.id === 'premium' ? 'ACESSO VITALÍCIO' : 'PRESENÇA MENSAL'}</p>
        <h2>${plan.name}</h2>
        <p>${plan.description}</p>
        <strong>${plan.priceCents ? money(plan.priceCents) : 'Grátis'} <small>${plan.cycle}</small></strong>
        <ul>${plan.includes.map(item => `<li>${item}</li>`).join('')}</ul>
        <button type="button" data-plan="${plan.id}">${plan.id === 'presence' ? 'ENTRAR NO TAROT' : plan.id === 'premium' ? 'VER AS 11 TIRAGENS' : 'ENTRAR NA CONTA'}</button>`;
      return article;
    }));

    planRoot.addEventListener('click', event => {
      const button = event.target.closest('[data-plan]');
      if (!button) return;
      const route = button.dataset.plan === 'presence' ? 'tarot' : button.dataset.plan === 'premium' ? 'tiragens' : 'conta';
      navigate(route);
      announce(button.dataset.plan === 'premium' ? 'Abrindo o concílio das 11 tiragens Premium.' : `Abrindo ${route}.`);
    });
  }

  return { activate:render };
}
