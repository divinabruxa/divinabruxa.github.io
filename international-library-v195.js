/* DIVINA BRUXA V195 — searchable 78-card library for English and Spanish. */
import { CARDS, REQUIRED_ORIENTATION } from './tarot-data.js?v=195';

const root = typeof document === 'undefined' ? null : document.querySelector('[data-international-library]');

if (root) {
  const language = root.dataset.language === 'es' ? 'es' : 'en';
  const search = root.querySelector('[data-library-search]');
  const filter = root.querySelector('[data-library-filter]');
  const summary = root.querySelector('[data-library-summary]');
  const grid = root.querySelector('[data-library-grid]');

  const majorNotes = Object.freeze({
    en: Object.freeze([
      'A conscious beginning: freedom grows when curiosity travels with responsibility.',
      'Available skill becomes meaningful through focus, honest language and verifiable action.',
      'Silence, perception and inner knowledge ask to be distinguished from assumption.',
      'Creation and care flourish through presence, resources and respect for the body.',
      'Structure protects what matters when authority remains accountable and flexible.',
      'Tradition can teach, but living wisdom requires reflection instead of blind obedience.',
      'Relationship and choice become clear through reciprocity, consent and aligned values.',
      'Directed movement needs emotional steadiness, boundaries and a chosen destination.',
      'Courage is sustained power: meet instinct with patience rather than domination.',
      'Withdrawal becomes wisdom when it clarifies a path back into responsible participation.',
      'Cycles change; notice what can be influenced without pretending to control everything.',
      'Clarity asks for proportion, evidence and willingness to accept consequences.',
      'A pause can reveal another perspective when surrender is not confused with helplessness.',
      'An ending clears space for transformation; grief and transition deserve their own pace.',
      'Integration comes from patient adjustment, dialogue and respect for real limits.',
      'Attachment becomes visible so desire, power and fear can be faced without shame.',
      'What cannot remain collapses; safety and truth matter more than preserving appearances.',
      'Hope becomes restorative when it is joined to honesty, community and small acts of care.',
      'Uncertainty invites careful observation; intuition does not replace facts.',
      'Vitality, visibility and joy can be received without denying complexity.',
      'A call to review, repair and choose again—without turning reflection into punishment.',
      'Completion gathers the journey into embodied knowledge and opens a new cycle.'
    ]),
    es: Object.freeze([
      'Un comienzo consciente: la libertad crece cuando la curiosidad viaja con responsabilidad.',
      'La capacidad disponible cobra sentido mediante enfoque, lenguaje honesto y acción verificable.',
      'El silencio, la percepción y el saber interior deben distinguirse de las suposiciones.',
      'La creación y el cuidado florecen con presencia, recursos y respeto por el cuerpo.',
      'La estructura protege lo importante cuando la autoridad es responsable y flexible.',
      'La tradición puede enseñar, pero la sabiduría viva exige reflexión y no obediencia ciega.',
      'El vínculo y la elección se aclaran mediante reciprocidad, consentimiento y valores coherentes.',
      'El movimiento dirigido necesita estabilidad emocional, límites y un destino elegido.',
      'El valor es poder sostenido: encuentra el instinto con paciencia y no con dominio.',
      'El retiro se vuelve sabiduría cuando aclara el camino de regreso a la participación responsable.',
      'Los ciclos cambian; observa qué puedes influir sin fingir controlarlo todo.',
      'La claridad exige proporción, evidencias y disposición para asumir consecuencias.',
      'Una pausa puede revelar otra perspectiva cuando la entrega no se confunde con impotencia.',
      'Un final abre espacio a la transformación; el duelo y la transición merecen su propio ritmo.',
      'La integración nace del ajuste paciente, el diálogo y el respeto por los límites reales.',
      'El apego se hace visible para mirar deseo, poder y miedo sin vergüenza.',
      'Lo que no puede sostenerse cae; la seguridad y la verdad importan más que las apariencias.',
      'La esperanza restaura cuando se une a honestidad, comunidad y pequeños actos de cuidado.',
      'La incertidumbre invita a observar con cuidado; la intuición no sustituye los hechos.',
      'La vitalidad, la visibilidad y la alegría pueden recibirse sin negar la complejidad.',
      'Un llamado a revisar, reparar y elegir de nuevo, sin convertir la reflexión en castigo.',
      'La culminación reúne el viaje en conocimiento encarnado y abre un nuevo ciclo.'
    ])
  });

  const rankNotes = Object.freeze({
    en: Object.freeze(['seed and potential','polarity and choice','expression and growth','structure and stability','tension and change','harmony and passage','evaluation and depth','movement and command','maturity and integration','completion and consequence','message and learning','movement and pursuit','inner authority and care','leadership and responsibility']),
    es: Object.freeze(['semilla y potencial','polaridad y elección','expresión y crecimiento','estructura y estabilidad','tensión y cambio','armonía y tránsito','evaluación y profundidad','movimiento y dominio','madurez e integración','culminación y consecuencia','mensaje y aprendizaje','movimiento y búsqueda','autoridad interior y cuidado','liderazgo y responsabilidad'])
  });

  const suits = Object.freeze({
    en: Object.freeze({
      copas: Object.freeze({ label:'Cups · Water', domain:'emotion, bonds and intuition', question:'what feeling needs honest care' }),
      espadas: Object.freeze({ label:'Swords · Air', domain:'thought, truth and decisions', question:'which fact or conversation can bring clarity' }),
      paus: Object.freeze({ label:'Wands · Fire', domain:'energy, courage and creative action', question:'where energy needs a deliberate direction' }),
      ouros: Object.freeze({ label:'Pentacles · Earth', domain:'body, work and resources', question:'which practical step can be sustained' })
    }),
    es: Object.freeze({
      copas: Object.freeze({ label:'Copas · Agua', domain:'emoción, vínculos e intuición', question:'qué sentimiento necesita cuidado honesto' }),
      espadas: Object.freeze({ label:'Espadas · Aire', domain:'pensamiento, verdad y decisiones', question:'qué hecho o conversación puede aportar claridad' }),
      paus: Object.freeze({ label:'Bastos · Fuego', domain:'energía, valor y acción creativa', question:'dónde la energía necesita una dirección consciente' }),
      ouros: Object.freeze({ label:'Oros · Tierra', domain:'cuerpo, trabajo y recursos', question:'qué paso práctico puede sostenerse' })
    })
  });

  const ui = Object.freeze({
    en: Object.freeze({ major:'Major Arcana · upright', note:(rank,suit)=>`In the field of ${suit.domain}, this card brings ${rank}. Consider ${suit.question}.`, result:n=>`${n} of 78 cards shown.`, empty:'No card matches this search.' }),
    es: Object.freeze({ major:'Arcanos Mayores · al derecho', note:(rank,suit)=>`En el ámbito de ${suit.domain}, esta carta aporta ${rank}. Considera ${suit.question}.`, result:n=>`Se muestran ${n} de 78 cartas.`, empty:'Ninguna carta coincide con esta búsqueda.' })
  })[language];

  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const noteFor = card => {
    if (card.arcanaCode === 'major') return majorNotes[language][card.number];
    const rankIndex = (card.id - 22) % 14;
    return ui.note(rankNotes[language][rankIndex], suits[language][card.suitCode]);
  };
  const familyFor = card => card.arcanaCode === 'major' ? ui.major : suits[language][card.suitCode].label;

  const render = () => {
    const query = normalize(search.value);
    const family = filter.value;
    const cards = CARDS.filter(card => {
      const familyMatch = family === 'all' || (family === 'major' ? card.arcanaCode === 'major' : card.suitCode === family);
      const haystack = normalize([card.names[language], card.names.en, card.names.es, card.names.ptBR, familyFor(card), noteFor(card)].join(' '));
      return familyMatch && (!query || haystack.includes(query));
    });
    summary.textContent = ui.result(cards.length);
    if (!cards.length) {
      grid.innerHTML = `<p class="intl-library-empty">${ui.empty}</p>`;
      return;
    }
    const fragment = document.createDocumentFragment();
    cards.forEach(card => {
      if (card.orientation !== REQUIRED_ORIENTATION) return;
      const article = document.createElement('article');
      article.className = 'intl-library-card';
      const image = document.createElement('img');
      image.src = card.image;
      image.alt = card.names[language];
      image.width = 240;
      image.height = 360;
      image.loading = 'lazy';
      image.decoding = 'async';
      const copy = document.createElement('div');
      const meta = document.createElement('small');
      meta.textContent = familyFor(card);
      const title = document.createElement('h3');
      title.textContent = card.names[language];
      const note = document.createElement('p');
      note.textContent = noteFor(card);
      copy.append(meta, title, note);
      article.append(image, copy);
      fragment.append(article);
    });
    grid.replaceChildren(fragment);
  };

  search.addEventListener('input', render);
  filter.addEventListener('change', render);
  render();
}
