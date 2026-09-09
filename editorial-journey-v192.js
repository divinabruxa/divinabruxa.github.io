/* DIVINA BRUXA V192 — PONTES ENTRE LOJA, MÚSICA, VÍDEO, ESCOLA E BIBLIOTECA */
import { EDITORIAL_RHYTHM_V192 } from './editorial-catalog-v192.js?v=192';
import { renderEditorialConsent } from './editorial-metrics-v192.js?v=192';

const purpose = Object.freeze({
  store: Object.freeze({
    title: 'Curadoria para apoiar prática, estudo e criação.',
    text: 'A Loja organiza possibilidades por finalidade e devolve preço, estoque e compra ao parceiro.',
    links: Object.freeze([
      ['library','◇','Biblioteca','Compreender cartas antes de escolher um baralho.','library_path'],
      ['school','▤','Escola','Transformar materiais em prática orientada.','school_path'],
      ['music','♫','Música','Criar uma atmosfera para leitura e escrita.','']
    ])
  }),
  music: Object.freeze({
    title: 'A obra sonora encontra estudo e contemplação.',
    text: 'Cada álbum publicado ganha contexto próprio, sem transformar música em promessa terapêutica.',
    links: Object.freeze([
      ['journal','☾','Diário','Registrar o que a escuta despertou.',''],
      ['library','◇','Biblioteca','Continuar pelos símbolos das 78 cartas.','library_path'],
      ['school','▤','Escola','Levar a percepção para uma prática guiada.','school_path']
    ])
  }),
  videos: Object.freeze({
    title: 'Conversas públicas só existem depois da publicação.',
    text: 'A série prepara contexto, acessibilidade e caminhos de aprofundamento antes de anunciar um episódio.',
    links: Object.freeze([
      ['school','▤','Escola','Aprofundar o tema em aulas e exercícios.','school_path'],
      ['library','◇','Biblioteca','Consultar cartas e símbolos relacionados.','library_path'],
      ['music','♫','Música','Conhecer a discografia já publicada.','']
    ])
  })
});

const metricForRhythm = item => item.destination === 'library'
  ? 'library_path'
  : item.destination === 'school'
    ? 'school_path'
    : '';

export class EditorialJourneyV192 {
  constructor(root, current) {
    this.root = root;
    this.current = current;
    this.render();
  }

  render() {
    if (!this.root || this.root.querySelector('[data-editorial-universe="v192"]')) return;
    const currentPurpose = purpose[this.current] || purpose.music;
    const host = document.createElement('div');
    host.className = 'editorial-v192-universe';
    host.dataset.editorialUniverse = 'v192';
    host.innerHTML = `
      <section class="editorial-v192-purpose" aria-labelledby="editorial-purpose-${this.current}">
        <header><p class="eyebrow">PROPÓSITO DESTA ÁREA</p><h3 id="editorial-purpose-${this.current}">${currentPurpose.title}</h3><p>${currentPurpose.text}</p></header>
        <nav aria-label="Caminhos relacionados">${currentPurpose.links.map(([id, sigil, title, description, metric]) => `<button type="button" data-go="${id}"${metric ? ` data-editorial-target="${metric}"` : ''}><span aria-hidden="true">${sigil}</span><span><b>${title}</b><small>${description}</small></span><i aria-hidden="true">→</i></button>`).join('')}</nav>
      </section>
      <section class="editorial-v192-rhythm" aria-labelledby="editorial-rhythm-${this.current}">
        <header><div><p class="eyebrow">CALENDÁRIO EDITORIAL</p><h3 id="editorial-rhythm-${this.current}">Um ritmo para voltar sem fabricar novidade.</h3></div><p>Este é um ciclo de curadoria, não uma promessa de lançamento. Cada destino só mostra o que já passou pela revisão correspondente.</p></header>
        <ol>${EDITORIAL_RHYTHM_V192.map(item => {
          const metric = metricForRhythm(item);
          return `<li><button type="button" data-go="${item.destination}"${metric ? ` data-editorial-target="${metric}"` : ''}><span><small>${item.day}</small><b>${item.sigil}</b></span><strong>${item.title}</strong><p>${item.description}</p><i aria-hidden="true">→</i></button></li>`;
        }).join('')}</ol>
        <p class="editorial-v192-rule"><span aria-hidden="true">✓</span><span><strong>Regra de publicação:</strong> rascunhos, episódios futuros e páginas sem direitos ou acessibilidade permanecem fora da experiência pública.</span></p>
      </section>`;
    this.root.append(host);
    renderEditorialConsent(this.root);
    this.root.dataset.editorialReady = 'v192';
  }
}
