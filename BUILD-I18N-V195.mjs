/* DIVINA BRUXA — V195 INTERNATIONAL BUILD
   Generates the complete English and neutral-Spanish public journeys and
   injects reciprocal hreflang links into their seven Portuguese sources. */

import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const base = 'https://divinabruxa.com.br';
const releaseDate = '2026-09-09';

const routes = Object.freeze({
  home: Object.freeze({ pt: '', en: 'english.html', es: 'espanol.html' }),
  tarot: Object.freeze({ pt: 'tarot-livre.html', en: 'free-tarot-reading.html', es: 'tarot-libre.html' }),
  library: Object.freeze({ pt: 'cartas-do-tarot.html', en: 'tarot-card-meanings.html', es: 'significados-cartas-tarot.html' }),
  school: Object.freeze({ pt: 'escola-do-tarot.html', en: 'tarot-school.html', es: 'escuela-tarot.html' }),
  consultations: Object.freeze({ pt: 'consultas-de-tarot.html', en: 'tarot-consultations.html', es: 'consultas-tarot.html' }),
  ethics: Object.freeze({ pt: 'etica-e-responsabilidade.html', en: 'tarot-ethics.html', es: 'etica-tarot.html' }),
  contact: Object.freeze({ pt: 'contato.html', en: 'contact.html', es: 'contacto.html' })
});

const locale = Object.freeze({
  en: Object.freeze({
    html: 'en', og: 'en_US', home: 'Home', tarot: 'Free Tarot', library: '78 cards', school: 'Tarot School', consultations: 'Consultations', ethics: 'Ethics', contact: 'Contact',
    subbrand: 'ORB OF REALITIES', skip: 'Skip to content', explore: 'Explore Divina Bruxa', language: 'Choose language', menu: 'Open navigation',
    footerTitle: 'Divina Bruxa · Orb of Realities', footerCopy: 'Tarot as a symbolic language for reflection, autonomy and responsible choice.', official: 'Official support by email', rights: 'International editorial release V195.'
  }),
  es: Object.freeze({
    html: 'es', og: 'es_ES', home: 'Inicio', tarot: 'Tarot Libre', library: '78 cartas', school: 'Escuela de Tarot', consultations: 'Consultas', ethics: 'Ética', contact: 'Contacto',
    subbrand: 'ORBE DE LAS REALIDADES', skip: 'Ir al contenido', explore: 'Explora Divina Bruxa', language: 'Elegir idioma', menu: 'Abrir navegación',
    footerTitle: 'Divina Bruxa · Orbe de las Realidades', footerCopy: 'El Tarot como lenguaje simbólico para la reflexión, la autonomía y la elección responsable.', official: 'Soporte oficial por correo', rights: 'Edición editorial internacional V195.'
  })
});

const absolute = route => route ? `${base}/${route}` : `${base}/`;
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function alternateLinks(key) {
  const cluster = routes[key];
  return [
    `<link rel="alternate" hreflang="pt-BR" href="${absolute(cluster.pt)}">`,
    `<link rel="alternate" hreflang="en" href="${absolute(cluster.en)}">`,
    `<link rel="alternate" hreflang="es" href="${absolute(cluster.es)}">`,
    `<link rel="alternate" hreflang="x-default" href="${absolute(cluster.pt)}">`
  ].join('\n');
}

function languageSwitcher(key, current) {
  const cluster = routes[key];
  return `<nav class="intl-language" aria-label="${current === 'en' ? 'Choose language' : 'Elegir idioma'}">
    <a lang="pt-BR" hreflang="pt-BR" href="${cluster.pt || './'}">PT</a>
    <a lang="en" hreflang="en" href="${cluster.en}"${current === 'en' ? ' aria-current="page"' : ''}>EN</a>
    <a lang="es" hreflang="es" href="${cluster.es}"${current === 'es' ? ' aria-current="page"' : ''}>ES</a>
  </nav>`;
}

function schema({ key, language, title, description, pageType = 'WebPage', image }) {
  const current = routes[key][language];
  const url = absolute(current);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: 'Divina Bruxa',
        alternateName: language === 'en' ? 'Orb of Realities' : 'Orbe de las Realidades',
        url: `${base}/`,
        email: 'mailto:orbedasrealidades@hotmail.com',
        logo: { '@type': 'ImageObject', url: `${base}/icon-512.png`, width: 512, height: 512 }
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: 'Divina Bruxa',
        alternateName: language === 'en' ? 'Orb of Realities' : 'Orbe de las Realidades',
        inLanguage: language,
        publisher: { '@id': `${base}/#organization` }
      },
      {
        '@type': pageType,
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: language,
        isPartOf: { '@id': `${base}/#website` },
        primaryImageOfPage: image ? { '@type': 'ImageObject', url: `${base}/${image}` } : undefined,
        datePublished: releaseDate,
        dateModified: releaseDate
      }
    ]
  }).replace(',"primaryImageOfPage":undefined', '');
}

function documentHead({ key, language, title, description, image = 'divina-orb-fast-v1.webp', pageType = 'WebPage' }) {
  const url = absolute(routes[key][language]);
  const data = schema({ key, language, title, description, pageType, image });
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#07030c">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${url}">
  ${alternateLinks(key)}
  <link rel="icon" href="divina-icon-fast-v1.png?v=133" type="image/png">
  <link rel="apple-touch-icon" href="divina-icon-fast-v1.png?v=133">
  <link rel="stylesheet" href="international-v195.css?v=195">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${base}/${image}">
  <meta property="og:locale" content="${locale[language].og}">
  <meta property="og:site_name" content="Divina Bruxa">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${data}</script>`;
}

function header(key, language) {
  const words = locale[language];
  const links = ['home', 'tarot', 'library', 'school', 'consultations'];
  return `<header class="intl-header">
    <a class="intl-brand" href="${routes.home[language]}"><span class="intl-brand-orb" aria-hidden="true"></span><span><strong>DIVINA BRUXA</strong><small>${words.subbrand}</small></span></a>
    ${languageSwitcher(key, language)}
  </header>
  <nav class="intl-primary-nav" aria-label="${words.explore}">${links.map(item => `<a href="${routes[item][language]}"${item === key ? ' aria-current="page"' : ''}>${words[item]}</a>`).join('')}</nav>`;
}

function footer(language) {
  const words = locale[language];
  return `<footer class="intl-footer"><div class="intl-footer-grid"><div><h2>${words.footerTitle}</h2><p>${words.footerCopy}</p></div><nav aria-label="${words.explore}"><a href="${routes.ethics[language]}">${words.ethics}</a><a href="${routes.contact[language]}">${words.contact}</a><a href="mailto:orbedasrealidades@hotmail.com">${words.official}</a></nav></div><small>© 2026 Divina Bruxa · ${words.rights}</small></footer>`;
}

function breadcrumbs(key, language) {
  const words = locale[language];
  return `<nav class="intl-breadcrumbs" aria-label="${language === 'en' ? 'Breadcrumb' : 'Ruta de navegación'}"><ol><li><a href="${routes.home[language]}">${words.home}</a></li><li aria-current="page">${words[key]}</li></ol></nav>`;
}

function hero({ eyebrow, title, lead, image, alt, caption, actions = '' }) {
  return `<article class="intl-hero"><div><p class="intl-eyebrow">${eyebrow}</p><h1>${title}</h1><p class="intl-hero-lead">${lead}</p>${actions ? `<div class="intl-actions">${actions}</div>` : ''}</div><figure class="intl-hero-art"><img src="${image}" width="864" height="1296" alt="${esc(alt)}" decoding="async" fetchpriority="high"><figcaption>${caption}</figcaption></figure></article>`;
}

function stats(items) {
  return `<dl class="intl-stats">${items.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
}

function featureCards(items) {
  return `<div class="intl-grid">${items.map(([symbol, title, body, extra = '']) => `<article class="intl-card"><span aria-hidden="true">${symbol}</span><h3>${title}</h3><p>${body}</p>${extra}</article>`).join('')}</div>`;
}

function page({ key, language, title, description, image, pageType, body, scripts = '' }) {
  const words = locale[language];
  return `<!doctype html>
<html lang="${words.html}">
<head>
  ${documentHead({ key, language, title, description, image, pageType })}
</head>
<body class="intl-page intl-${key}">
  <a class="intl-skip" href="#main">${words.skip}</a>
  ${header(key, language)}
  <main id="main" class="intl-shell">
    ${breadcrumbs(key, language)}
    ${body}
  </main>
  ${footer(language)}
  ${scripts}
</body>
</html>
`;
}

const homeContent = Object.freeze({
  en: Object.freeze({ title: 'Divina Bruxa — Orb of Realities', description: 'Enter the Orb of Realities and open the complete Free Tarot with 78 unique upright cards.', heading: 'Orb of<br>Realities', aria: 'Living Orb: touch and move; double tap opens Free Tarot' }),
  es: Object.freeze({ title: 'Divina Bruxa — Orbe de las Realidades', description: 'Entra en la Orbe de las Realidades y abre el Tarot Libre completo con 78 cartas únicas al derecho.', heading: 'Orbe de las<br>Realidades', aria: 'Orbe viva: toca y mueve; un toque doble abre el Tarot Libre' })
});

function homePage(language) {
  const words = locale[language];
  const content = homeContent[language];
  return `<!doctype html>
<html lang="${words.html}">
<head>
  ${documentHead({ key: 'home', language, title: content.title, description: content.description, image: 'divina-orb-fast-v1.webp' })}
</head>
<body class="intl-page intl-home">
  <a class="intl-skip" href="#main">${words.skip}</a>
  <header class="intl-header">
    <a class="intl-brand" href="${routes.home[language]}" aria-current="page"><span class="intl-brand-orb" aria-hidden="true"></span><span><strong>DIVINA BRUXA</strong><small>${words.subbrand}</small></span></a>
    <details class="intl-home-menu"><summary aria-label="${words.menu}">Menu</summary><div class="intl-home-menu-panel" role="navigation" aria-label="${words.explore}">${languageSwitcher('home', language)}${['tarot','library','school','consultations','ethics','contact'].map(key => `<a href="${routes[key][language]}">${words[key]}</a>`).join('')}</div></details>
  </header>
  <main id="main" class="intl-orb-home">
    <h1>${content.heading}</h1>
    <div class="intl-orb-stage"><button class="intl-orb-shell orb-shell orb-loading" type="button" aria-label="${content.aria}"><span class="orb-halo" aria-hidden="true"></span><canvas id="orbCanvas"></canvas><span class="orb-glass" aria-hidden="true"></span></button></div>
    <p id="orbStatus" class="intl-visually-hidden" aria-live="polite"></p>
  </main>
  <script type="module" src="international-home-v195.js?v=195"></script>
</body>
</html>
`;
}

const tarotContent = Object.freeze({
  en: Object.freeze({
    metaTitle: 'Free Tarot: 78 unique upright cards | Divina Bruxa',
    description: 'Open a complete 78-card Free Tarot table. Every card appears once, always upright, in a Royal Table of 13 rows by 6 columns, with no meanings in the reveal.',
    eyebrow: 'FREE TAROT · COMPLETE DECK · NO REPEATS', title: 'The complete 78-card<br>Royal Table',
    lead: 'Reveal the canonical deck at your own pace. Every position receives one unique card, always upright. The free reveal presents images only—no interpretation is imposed on your question.',
    imageAlt: 'Cosmic Tarot temple surrounding an upright card', caption: '78 CARDS · 13 × 6 · UPRIGHT ONLY',
    start: 'Open the table', library: 'Study the 78 cards',
    stats: [['Deck','78 cards'],['Layout','13 × 6'],['Orientation','Upright'],['Repeats','None']],
    tableTitle: 'Royal Table', revealed: 'revealed', remaining: 'remaining', reveal: 'Reveal one card', shuffle: 'Shuffle unrevealed', reset: 'Start a new table', tableLabel: 'Royal Table with 13 rows and 6 columns',
    rule: '<strong>Free reveal rule:</strong> images and card names only. No meaning, reversed card or repeated card is inserted.',
    howKicker: 'CLEAR RITUAL', howTitle: 'How the free experience works',
    steps: [['Prepare the question','Choose a question you can examine without asking the cards to replace facts or professional advice.'],['Touch the Orb','Each touch takes the next card from a freshly shuffled canonical deck. Revealed positions stay fixed.'],['Observe before interpreting','Notice image, sequence and response. Use the Library separately when you intentionally want editorial context.']],
    note: 'The table never claims certainty about another person, a diagnosis, legal outcome or financial result. It is a symbolic practice for reflection.'
  }),
  es: Object.freeze({
    metaTitle: 'Tarot Libre: 78 cartas únicas al derecho | Divina Bruxa',
    description: 'Abre una mesa completa de Tarot Libre con 78 cartas. Cada carta aparece una sola vez, siempre al derecho, en una Mesa Real de 13 filas por 6 columnas y sin significados durante la revelación.',
    eyebrow: 'TAROT LIBRE · MAZO COMPLETO · SIN REPETICIONES', title: 'La Mesa Real completa<br>de 78 cartas',
    lead: 'Revela el mazo canónico a tu propio ritmo. Cada posición recibe una carta única, siempre al derecho. La revelación libre muestra solamente las imágenes, sin imponer una interpretación a tu pregunta.',
    imageAlt: 'Templo cósmico del Tarot alrededor de una carta al derecho', caption: '78 CARTAS · 13 × 6 · AL DERECHO',
    start: 'Abrir la mesa', library: 'Estudiar las 78 cartas',
    stats: [['Mazo','78 cartas'],['Estructura','13 × 6'],['Orientación','Al derecho'],['Repeticiones','Ninguna']],
    tableTitle: 'Mesa Real', revealed: 'reveladas', remaining: 'restantes', reveal: 'Revelar una carta', shuffle: 'Barajar las ocultas', reset: 'Iniciar otra mesa', tableLabel: 'Mesa Real con 13 filas y 6 columnas',
    rule: '<strong>Regla de la revelación libre:</strong> solo imágenes y nombres. No se inserta ningún significado, carta invertida ni repetida.',
    howKicker: 'RITUAL CLARO', howTitle: 'Cómo funciona la experiencia libre',
    steps: [['Prepara la pregunta','Elige una pregunta que puedas explorar sin pedir a las cartas que sustituyan hechos o asesoramiento profesional.'],['Toca la Orbe','Cada toque toma la siguiente carta de un mazo canónico recién barajado. Las posiciones reveladas permanecen fijas.'],['Observa antes de interpretar','Mira la imagen, la secuencia y tu respuesta. Usa la Biblioteca por separado cuando quieras contexto editorial de forma intencional.']],
    note: 'La mesa nunca afirma certezas sobre otra persona, un diagnóstico, un resultado legal o financiero. Es una práctica simbólica para la reflexión.'
  })
});

function tarotPage(language) {
  const c = tarotContent[language];
  const app = `<section id="royal-table" class="intl-tarot-app" data-international-tarot data-language="${language}" aria-labelledby="table-title"><div class="intl-tarot-head"><div><p class="intl-kicker">78 · 13 × 6</p><h2 id="table-title">${c.tableTitle}</h2></div><output class="intl-tarot-count"><span data-revealed-count>0</span><small>/78</small></output></div><button class="intl-tarot-orb" type="button" data-draw-card><span>${c.reveal}</span></button><p class="intl-tarot-status" data-tarot-status aria-live="polite"></p><div class="intl-table-actions"><span><strong data-remaining-count>78</strong> ${c.remaining}</span><span><button type="button" data-shuffle-remaining>${c.shuffle}</button> <button type="button" data-reset-table>${c.reset}</button></span></div><div class="intl-real-table-wrap" tabindex="0"><div class="intl-real-table" data-real-table role="grid" aria-label="${c.tableLabel}" aria-rowcount="13" aria-colcount="6"></div></div><p class="intl-tarot-rule">${c.rule}</p><noscript><p class="intl-notice">JavaScript is required to shuffle and reveal the local deck.</p></noscript></section>`;
  const steps = `<ol class="intl-numbered">${c.steps.map(([title, body]) => `<li><h3>${title}</h3><p>${body}</p></li>`).join('')}</ol>`;
  const body = `${hero({ eyebrow:c.eyebrow, title:c.title, lead:c.lead, image:'tarot-temple-background-v1.webp', alt:c.imageAlt, caption:c.caption, actions:`<a class="intl-button primary" href="#royal-table">${c.start}</a><a class="intl-button" href="${routes.library[language]}">${c.library}</a>` })}${stats(c.stats)}${app}<section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.howKicker}</p><h2>${c.howTitle}</h2></header>${steps}<aside class="intl-notice"><span aria-hidden="true">✦</span><p>${c.note}</p></aside></section>`;
  return page({ key:'tarot', language, title:c.metaTitle, description:c.description, image:'tarot-temple-background-v1.webp', body, scripts:'<script type="module" src="international-tarot-v195.js?v=195"></script>' });
}

const libraryContent = Object.freeze({
  en: Object.freeze({
    metaTitle: 'Tarot card meanings: the complete 78-card library | Divina Bruxa',
    description: 'Explore all 78 official Tarot cards in English: 22 Major Arcana and 56 Minor Arcana, always upright, with searchable concise and responsible editorial notes.',
    eyebrow: 'COMPLETE TAROT LIBRARY · ENGLISH', title: 'Meet all<br>78 Tarot cards',
    lead: 'Search the canonical deck by name, family or symbolic theme. Each entry offers a concise upright note designed to open reflection—not to turn possibility into fate.',
    alt: 'Celestial library containing the complete Tarot deck', caption: '22 MAJORS · 56 MINORS · UPRIGHT',
    stats: [['Total','78 cards'],['Major Arcana','22'],['Minor Arcana','56'],['Reversed','0']],
    search:'Search by card or theme', placeholder:'Example: Star, choice, boundaries…', filter:'Filter the deck', all:'All 78 cards', major:'Major Arcana', cups:'Cups', swords:'Swords', wands:'Wands', pentacles:'Pentacles',
    guideKicker:'RESPONSIBLE STUDY', guideTitle:'Read symbol, context and choice together',
    guide:[['◇','Start with the image','Describe what you can actually see before importing a memorized conclusion.'],['✦','Return to the question','A card becomes more precise when it is connected to a real context and available choices.'],['☾','Hold light and tension','Every upright card can express resources and excesses; upright does not mean “good”.'],['☉','End with an action','Translate insight into a question, boundary, conversation or small verifiable step.']],
    note:'These concise notes do not diagnose, prove another person’s private thoughts or replace medical, psychological, legal or financial professionals.'
  }),
  es: Object.freeze({
    metaTitle: 'Significados del Tarot: biblioteca completa de 78 cartas | Divina Bruxa',
    description: 'Explora las 78 cartas oficiales del Tarot en español: 22 Arcanos Mayores y 56 Menores, siempre al derecho, con notas editoriales breves, buscables y responsables.',
    eyebrow: 'BIBLIOTECA COMPLETA DEL TAROT · ESPAÑOL', title: 'Conoce las<br>78 cartas del Tarot',
    lead: 'Busca el mazo canónico por nombre, familia o tema simbólico. Cada entrada ofrece una nota breve al derecho que abre la reflexión sin convertir una posibilidad en destino.',
    alt: 'Biblioteca celestial con el mazo completo del Tarot', caption: '22 MAYORES · 56 MENORES · AL DERECHO',
    stats: [['Total','78 cartas'],['Arcanos Mayores','22'],['Arcanos Menores','56'],['Invertidas','0']],
    search:'Buscar por carta o tema', placeholder:'Ejemplo: Estrella, elección, límites…', filter:'Filtrar el mazo', all:'Las 78 cartas', major:'Arcanos Mayores', cups:'Copas', swords:'Espadas', wands:'Bastos', pentacles:'Oros',
    guideKicker:'ESTUDIO RESPONSABLE', guideTitle:'Lee símbolo, contexto y elección en conjunto',
    guide:[['◇','Empieza por la imagen','Describe lo que realmente puedes ver antes de imponer una conclusión memorizada.'],['✦','Vuelve a la pregunta','Una carta gana precisión cuando se conecta con un contexto real y con elecciones disponibles.'],['☾','Integra luz y tensión','Toda carta al derecho puede expresar recursos y excesos; al derecho no significa “buena”.'],['☉','Termina con una acción','Convierte la percepción en pregunta, límite, conversación o pequeño paso verificable.']],
    note:'Estas notas breves no diagnostican, no prueban pensamientos privados de otras personas y no sustituyen a profesionales médicos, psicológicos, jurídicos o financieros.'
  })
});

function libraryPage(language) {
  const c = libraryContent[language];
  const controls = `<section class="intl-section" data-international-library data-language="${language}" aria-labelledby="library-title"><header class="intl-section-heading"><p class="intl-kicker">78 / 78</p><h2 id="library-title">${language === 'en' ? 'The canonical deck' : 'El mazo canónico'}</h2></header><div class="intl-library-tools"><label>${c.search}<input type="search" data-library-search placeholder="${c.placeholder}" autocomplete="off"></label><label>${c.filter}<select data-library-filter><option value="all">${c.all}</option><option value="major">${c.major}</option><option value="copas">${c.cups}</option><option value="espadas">${c.swords}</option><option value="paus">${c.wands}</option><option value="ouros">${c.pentacles}</option></select></label></div><p class="intl-library-summary" data-library-summary aria-live="polite"></p><div class="intl-library-grid" data-library-grid></div><noscript><p class="intl-notice">JavaScript is required to build the searchable canonical catalog.</p></noscript></section>`;
  const body = `${hero({ eyebrow:c.eyebrow, title:c.title, lead:c.lead, image:'biblioteca-celestial-78-cartas-v1.webp', alt:c.alt, caption:c.caption, actions:`<a class="intl-button primary" href="#library-title">${language === 'en' ? 'Explore the cards' : 'Explorar las cartas'}</a><a class="intl-button" href="${routes.tarot[language]}">${locale[language].tarot}</a>` })}${stats(c.stats)}${controls}<section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.guideKicker}</p><h2>${c.guideTitle}</h2></header>${featureCards(c.guide)}<aside class="intl-notice"><span aria-hidden="true">✦</span><p>${c.note}</p></aside></section>`;
  return page({ key:'library', language, title:c.metaTitle, description:c.description, image:'biblioteca-celestial-78-cartas-v1.webp', body, scripts:'<script type="module" src="international-library-v195.js?v=195"></script>' });
}

const modules = Object.freeze({
  en: Object.freeze([
    ['Tarot Foundations','Symbolic language, deck structure and responsible practice.'],['The 22 Major Arcana','The great archetypes and turning points of the journey.'],['Wands','Fire, courage, impulse and creation.'],['Cups','Water, feeling, relationships and intuition.'],['Swords','Air, thought, choice and truth.'],['Pentacles','Earth, body, work and resources.'],['Court Cards','Page, Knight, Queen and King as modes of expression.'],['Numbers and Patterns','From Ace to Ten: cycles, repetition and movement.'],['Suits and Elements','How Water, Air, Fire and Earth enter dialogue.'],['Positions in a Spread','How a card changes function according to its position.'],['Combinations','Relationships, contrasts and support between cards.'],['Building a Synthesis','How several cards become one coherent reading.'],['Practical Spreads','Progressive exercises with one, three and five cards.'],['Celtic Cross','The ten traditional positions and their integration.'],['Royal Table','All 78 positions in thirteen rows of six.'],['Ethics','Consent, limits and non-deterministic language.'],['Advanced Practice','Method, journaling, review and development of your own voice.']
  ]),
  es: Object.freeze([
    ['Fundamentos del Tarot','Lenguaje simbólico, estructura del mazo y práctica responsable.'],['Los 22 Arcanos Mayores','Los grandes arquetipos y pasajes del recorrido.'],['Bastos','Fuego, valor, impulso y creación.'],['Copas','Agua, sentimientos, vínculos e intuición.'],['Espadas','Aire, pensamiento, elecciones y verdad.'],['Oros','Tierra, cuerpo, trabajo y recursos.'],['Cartas de la Corte','Sota, Caballero, Reina y Rey como modos de expresión.'],['Números y Patrones','Del As al Diez: ciclos, repeticiones y movimiento.'],['Palos y Elementos','Cómo dialogan Agua, Aire, Fuego y Tierra.'],['Posiciones de una Tirada','La carta cambia de función según su posición.'],['Combinaciones','Relaciones, contrastes y apoyos entre cartas.'],['Construcción de Síntesis','Cómo transformar varias cartas en una lectura coherente.'],['Tiradas Prácticas','Ejercicios progresivos de una, tres y cinco cartas.'],['Cruz Celta','Las diez posiciones tradicionales y su integración.'],['Mesa Real','Las 78 posiciones en trece filas de seis.'],['Ética','Consentimiento, límites y lenguaje no determinista.'],['Práctica Avanzada','Método, registro, revisión y desarrollo de una voz propia.']
  ])
});

const schoolContent = Object.freeze({
  en: Object.freeze({
    metaTitle:'Tarot School: a 17-module upright curriculum | Divina Bruxa', description:'Explore the Divina Bruxa Tarot School roadmap: 17 modules, 78 upright cards and 46 theory and practice lessons for a responsible reading method.',
    eyebrow:'TAROT SCHOOL · PUBLIC SYLLABUS', title:'Learn the symbols.<br>Build your own voice.', lead:'A structured path joins the complete deck to method, practice and ethics. The curriculum teaches cards upright only and treats interpretation as contextual reasoning—not automatic prediction.',
    alt:'Celestial observatory representing the Tarot School', caption:'17 MODULES · 124 LESSONS · UPRIGHT',
    stats:[['Roadmap','17 modules'],['Cards','78 upright'],['Theory + practice','46 lessons'],['Total','124 lessons']],
    pillarsKicker:'LEARNING METHOD', pillarsTitle:'A path from observation to synthesis',
    pillars:[['◇','Observe before naming','Begin with image, position and question before reaching for a fixed definition.'],['✦','Practice in context','Compare what a symbol suggests with facts, boundaries and choices that actually exist.'],['☾','Record your reasoning','A private notebook can reveal patterns in your interpretation without turning them into diagnosis.'],['☉','Review with ethics','Revise language that creates fear, certainty or dependence; return agency to the reader.']],
    syllabusKicker:'COMPLETE ROADMAP', syllabusTitle:'The seventeen-module curriculum', syllabusLead:'The public international syllabus mirrors the canonical structure of the School. Deep study stays organized around the same 78 cards and 46 unique theory and practice lessons.',
    practiceKicker:'STARTER PRACTICE', practiceTitle:'A four-step study session',
    practice:[['Choose one upright card','Write three details you can see without interpreting them.'],['Name a possible dynamic','Use conditional language: “this may suggest…” or “one possibility is…”.'],['Connect it to context','Separate facts, feelings, hypotheses and choices.'],['Close with agency','Write one question or small action that remains under your control.']],
    note:'Tarot study supports reflection and symbolic literacy. It does not qualify anyone to diagnose, prescribe, determine legal outcomes or promise financial results.'
  }),
  es: Object.freeze({
    metaTitle:'Escuela de Tarot: programa de 17 módulos al derecho | Divina Bruxa', description:'Explora el recorrido de la Escuela de Tarot de Divina Bruxa: 17 módulos, 78 cartas al derecho y 46 lecciones de teoría y práctica para una lectura responsable.',
    eyebrow:'ESCUELA DE TAROT · PROGRAMA PÚBLICO', title:'Aprende los símbolos.<br>Construye tu propia voz.', lead:'Un recorrido estructurado une el mazo completo con método, práctica y ética. El programa enseña solamente cartas al derecho y trata la interpretación como razonamiento contextual, no como predicción automática.',
    alt:'Observatorio celestial que representa la Escuela de Tarot', caption:'17 MÓDULOS · 124 LECCIONES · AL DERECHO',
    stats:[['Recorrido','17 módulos'],['Cartas','78 al derecho'],['Teoría + práctica','46 lecciones'],['Total','124 lecciones']],
    pillarsKicker:'MÉTODO DE APRENDIZAJE', pillarsTitle:'Un recorrido de la observación a la síntesis',
    pillars:[['◇','Observa antes de nombrar','Empieza por la imagen, la posición y la pregunta antes de recurrir a una definición fija.'],['✦','Practica en contexto','Compara lo que sugiere un símbolo con hechos, límites y elecciones que realmente existen.'],['☾','Registra tu razonamiento','Un cuaderno privado puede mostrar patrones interpretativos sin convertirlos en diagnóstico.'],['☉','Revisa con ética','Corrige el lenguaje que crea miedo, certeza o dependencia y devuelve autonomía a quien lee.']],
    syllabusKicker:'RECORRIDO COMPLETO', syllabusTitle:'El programa de diecisiete módulos', syllabusLead:'El programa público internacional refleja la estructura canónica de la Escuela. El estudio profundo se organiza alrededor de las mismas 78 cartas y 46 lecciones únicas de teoría y práctica.',
    practiceKicker:'PRÁCTICA INICIAL', practiceTitle:'Una sesión de estudio en cuatro pasos',
    practice:[['Elige una carta al derecho','Escribe tres detalles visibles sin interpretarlos.'],['Nombra una dinámica posible','Usa lenguaje condicional: “esto puede sugerir…” o “una posibilidad es…”.'],['Conéctala con el contexto','Separa hechos, sentimientos, hipótesis y elecciones.'],['Cierra con autonomía','Escribe una pregunta o pequeña acción que siga bajo tu control.']],
    note:'El estudio del Tarot apoya la reflexión y la alfabetización simbólica. No habilita para diagnosticar, prescribir, determinar resultados jurídicos ni prometer resultados financieros.'
  })
});

function schoolPage(language) {
  const c = schoolContent[language];
  const syllabus = `<ol class="intl-module-grid">${modules[language].map(([title, description], index) => `<li><small>${language === 'en' ? 'MODULE' : 'MÓDULO'} ${String(index + 1).padStart(2,'0')}</small><h3>${title}</h3><p>${description}</p></li>`).join('')}</ol>`;
  const practice = `<ol class="intl-numbered">${c.practice.map(([title, body]) => `<li><h3>${title}</h3><p>${body}</p></li>`).join('')}</ol>`;
  const body = `${hero({ eyebrow:c.eyebrow, title:c.title, lead:c.lead, image:'escola-tarot-observatorio-v1.webp', alt:c.alt, caption:c.caption, actions:`<a class="intl-button primary" href="#syllabus">${language === 'en' ? 'See the syllabus' : 'Ver el programa'}</a><a class="intl-button" href="${routes.library[language]}">${locale[language].library}</a>` })}${stats(c.stats)}<section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.pillarsKicker}</p><h2>${c.pillarsTitle}</h2></header>${featureCards(c.pillars)}</section><section id="syllabus" class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.syllabusKicker}</p><h2>${c.syllabusTitle}</h2><p>${c.syllabusLead}</p></header>${syllabus}</section><section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.practiceKicker}</p><h2>${c.practiceTitle}</h2></header>${practice}<aside class="intl-notice"><span aria-hidden="true">✦</span><p>${c.note}</p></aside></section>`;
  return page({ key:'school', language, title:c.metaTitle, description:c.description, image:'escola-tarot-observatorio-v1.webp', pageType:'CollectionPage', body });
}

const consultationServices = Object.freeze({
  en: Object.freeze([
    ['✺','Professional Royal Table','R$ 250','A broad reading for cycles, paths, relationships and decisions. Includes the complete table, a synthesis of the main patterns and a closing orientation.'],
    ['☾','Relationship Dynamics (Leitura de Mentes)','R$ 150','A symbolic reading of a relationship’s dynamics and observable signals. It does not literally read minds or prove another person’s private intentions.'],
    ['◇','Guidance Card','R$ 100','One card with a focused, careful interpretation and an objective closing question for the present situation.'],
    ['✦','Direct Question','R$ 50','One clearly framed question, a symbolic response and a practical direction that remains under your control.']
  ]),
  es: Object.freeze([
    ['✺','Mesa Real Profesional','R$ 250','Una lectura amplia sobre ciclos, caminos, vínculos y decisiones. Incluye la mesa completa, una síntesis de los patrones principales y una orientación final.'],
    ['☾','Lectura de Dinámicas (Leitura de Mentes)','R$ 150','Una lectura simbólica de la dinámica y las señales observables de un vínculo. No lee literalmente la mente ni demuestra intenciones privadas de otra persona.'],
    ['◇','Carta de Consejo','R$ 100','Una carta con interpretación cuidadosa y enfocada, más una pregunta final objetiva para la situación presente.'],
    ['✦','Pregunta Directa','R$ 50','Una pregunta claramente formulada, una respuesta simbólica y una dirección práctica que permanece bajo tu control.']
  ])
});

const consultationContent = Object.freeze({
  en: Object.freeze({
    metaTitle:'Tarot consultations: formats and BRL prices | Divina Bruxa', description:'Compare four human Tarot consultation formats from Divina Bruxa, with transparent BRL prices, required reply email, explicit consent and no automatic charge.',
    eyebrow:'HUMAN TAROT CONSULTATIONS · CLEAR TERMS', title:'Choose how you want<br>to be supported', lead:'Four independent consultation formats with transparent prices in Brazilian reais. A request opens your own email application; it does not book a time, process a payment or consume AI credits.',
    alt:'Celestial sanctuary representing human Tarot consultations', caption:'HUMAN SERVICE · EMAIL CONFIRMATION · BRL',
    stats:[['Service','Human'],['Formats','4'],['Currency','BRL'],['Channel','Email']],
    serviceKicker:'TRANSPARENT PRICES', serviceTitle:'Four independent formats', serviceLead:'Prices are shown in BRL without invented exchange rates. Final availability, terms and any payment step require a separate reply through the official channel.',
    requestKicker:'REQUEST BY EMAIL', requestTitle:'Prepare your consultation request', requestLead:'Nothing is sent or stored by this page. After validation, your own email application opens with a draft for you to review.',
    name:'Your name', email:'Your reply email', service:'Consultation format', choose:'Choose one format', context:'Brief context or question', consent:'I understand that this form only prepares an email. It does not reserve a time, confirm a service or charge me. I consent to including the information above in my email draft.', submit:'Open my email draft',
    safeguardsKicker:'CONSENT AND SUPPORT', safeguardsTitle:'What applies in every market',
    safeguards:[['✉','One official channel','Support and confirmation use orbedasrealidades@hotmail.com. No WhatsApp channel is advertised.'],['◇','No automatic charge','Sending a request never creates a purchase or reservation. Any next step must be explicitly confirmed.'],['☾','Share only what is needed','Do not send passwords, authentication codes, full documents, bank details or complete card numbers.'],['✦','Responsible limits','Tarot does not replace medical, psychological, legal or financial professionals and is not an emergency service.']],
    note:'If there is immediate danger or an emergency, contact the appropriate emergency services and trusted support network in your location.'
  }),
  es: Object.freeze({
    metaTitle:'Consultas de Tarot: formatos y precios en BRL | Divina Bruxa', description:'Compara cuatro formatos de consulta humana de Tarot de Divina Bruxa, con precios transparentes en BRL, correo obligatorio, consentimiento explícito y sin cobro automático.',
    eyebrow:'CONSULTAS HUMANAS DE TAROT · CONDICIONES CLARAS', title:'Elige cómo deseas<br>recibir acompañamiento', lead:'Cuatro formatos independientes con precios transparentes en reales brasileños. La solicitud abre tu propia aplicación de correo; no reserva horario, no procesa pagos y no consume créditos de IA.',
    alt:'Santuario celestial que representa consultas humanas de Tarot', caption:'ATENCIÓN HUMANA · CONFIRMACIÓN POR CORREO · BRL',
    stats:[['Atención','Humana'],['Formatos','4'],['Moneda','BRL'],['Canal','Correo']],
    serviceKicker:'PRECIOS TRANSPARENTES', serviceTitle:'Cuatro formatos independientes', serviceLead:'Los precios se muestran en BRL sin inventar tipos de cambio. La disponibilidad, las condiciones finales y cualquier paso de pago requieren una respuesta separada por el canal oficial.',
    requestKicker:'SOLICITUD POR CORREO', requestTitle:'Prepara tu solicitud de consulta', requestLead:'Esta página no envía ni almacena datos. Después de validar, tu propia aplicación de correo abre un borrador para que lo revises.',
    name:'Tu nombre', email:'Tu correo de respuesta', service:'Formato de consulta', choose:'Elige un formato', context:'Contexto breve o pregunta', consent:'Entiendo que este formulario solo prepara un correo. No reserva horario, no confirma un servicio y no realiza cobros. Acepto incluir la información anterior en mi borrador de correo.', submit:'Abrir mi borrador de correo',
    safeguardsKicker:'CONSENTIMIENTO Y SOPORTE', safeguardsTitle:'Lo que se aplica en todos los mercados',
    safeguards:[['✉','Un único canal oficial','El soporte y la confirmación usan orbedasrealidades@hotmail.com. No se anuncia ningún canal de WhatsApp.'],['◇','Sin cobro automático','Enviar una solicitud nunca crea una compra o una reserva. Cada paso siguiente debe confirmarse de forma explícita.'],['☾','Comparte solo lo necesario','No envíes contraseñas, códigos de acceso, documentos completos, datos bancarios ni números completos de tarjeta.'],['✦','Límites responsables','El Tarot no sustituye a profesionales médicos, psicológicos, jurídicos o financieros y no es un servicio de emergencias.']],
    note:'Si existe peligro inmediato o una emergencia, contacta a los servicios de emergencia y a una red de apoyo confiable de tu ubicación.'
  })
});

function consultationsPage(language) {
  const c = consultationContent[language];
  const services = featureCards(consultationServices[language].map(([symbol,title,price,body]) => [symbol,title,body,`<strong class="intl-price">${price} <small>BRL</small></strong>`]));
  const options = consultationServices[language].map(([,title,price]) => `<option value="${esc(`${title} — ${price} BRL`)}">${title} — ${price} BRL</option>`).join('');
  const form = `<form class="intl-request-form" data-consultation-request data-language="${language}" novalidate><label>${c.name}<input name="name" autocomplete="name" maxlength="100" required></label><label>${c.email}<input name="email" type="email" autocomplete="email" maxlength="160" required></label><label>${c.service}<select name="service" required><option value="">${c.choose}</option>${options}</select></label><label>${c.context}<textarea name="topic" maxlength="1400" required></textarea></label><label class="intl-consent"><input name="consent" type="checkbox" required><span>${c.consent}</span></label><button class="intl-form-submit" type="submit">${c.submit}</button><p class="intl-form-status" data-form-status aria-live="polite"></p></form>`;
  const body = `${hero({ eyebrow:c.eyebrow, title:c.title, lead:c.lead, image:'consultas-celestiais-santuario-v1.webp', alt:c.alt, caption:c.caption, actions:`<a class="intl-button primary" href="#formats">${language === 'en' ? 'Compare formats' : 'Comparar formatos'}</a><a class="intl-button" href="${routes.ethics[language]}">${locale[language].ethics}</a>` })}${stats(c.stats)}<section id="formats" class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.serviceKicker}</p><h2>${c.serviceTitle}</h2><p>${c.serviceLead}</p></header>${services}</section><section id="request" class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.requestKicker}</p><h2>${c.requestTitle}</h2><p>${c.requestLead}</p></header>${form}</section><section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.safeguardsKicker}</p><h2>${c.safeguardsTitle}</h2></header>${featureCards(c.safeguards)}<aside class="intl-notice"><span aria-hidden="true">!</span><p>${c.note}</p></aside></section>`;
  return page({ key:'consultations', language, title:c.metaTitle, description:c.description, image:'consultas-celestiais-santuario-v1.webp', pageType:'CollectionPage', body, scripts:'<script type="module" src="international-consultations-v195.js?v=195"></script>' });
}

const ethicsContent = Object.freeze({
  en: Object.freeze({
    metaTitle:'Ethics and responsibility in Tarot | Divina Bruxa', description:'Read the Divina Bruxa commitments to autonomy, consent, privacy, non-deterministic language and responsible limits in Tarot.',
    eyebrow:'AUTONOMY · CONSENT · LIMITS', title:'Ethics and responsibility<br>in Tarot', lead:'A responsible reading does not use mystery to impose fear, dependence or certainty. It protects dignity, names its limits and returns the final decision to the person asking.',
    alt:'Cosmic Tarot temple representing responsible boundaries', caption:'CLARITY BEFORE CERTAINTY', stats:[['Decision','Always yours'],['Consent','Explicit'],['Language','Non-deterministic'],['Safety','Facts first']],
    principlesKicker:'FOUR COMMITMENTS', principlesTitle:'What guides every public journey',
    principles:[['◇','Autonomy','A card can suggest questions and possibilities. It never turns one path into an obligation.'],['✦','Consent','Questions about relationships must respect boundaries and focus on choices available to the person asking.'],['☾','Privacy','Tarot is not secret access to another person’s mind, body, messages or private life.'],['☉','Responsibility','Health, mental health, legal and financial decisions require qualified professionals and verifiable facts.']],
    languageKicker:'NON-DETERMINISTIC LANGUAGE', languageTitle:'Turn conclusions into useful questions',
    steps:[['Avoid sentences of fate','Name scenarios, conditions and observable signals instead of declaring that something must happen.'],['Separate symbol from fact','A card can represent a dynamic; it cannot confirm betrayal, illness, crime or a hidden intention.'],['Return choice','Close with alternatives, boundaries and a concrete question the person can evaluate in reality.']],
    limitsKicker:'IMPORTANT LIMITS', limitsTitle:'When Tarot is not the right tool',
    limits:[['Medical or psychological decisions','Tarot does not diagnose, prescribe or replace professional care.'],['Legal or financial decisions','Documents, evidence, budgets, contracts and qualified advice come before symbolic interpretation.'],['Urgency or danger','Contact local emergency services and a trusted support network. A reading or email is not emergency assistance.']],
    note:'If an interpretation creates intense fear, isolation or pressure to act, stop the reading, return to observable facts and seek reliable support.'
  }),
  es: Object.freeze({
    metaTitle:'Ética y responsabilidad en el Tarot | Divina Bruxa', description:'Conoce los compromisos de Divina Bruxa con la autonomía, el consentimiento, la privacidad, el lenguaje no determinista y los límites responsables del Tarot.',
    eyebrow:'AUTONOMÍA · CONSENTIMIENTO · LÍMITES', title:'Ética y responsabilidad<br>en el Tarot', lead:'Una lectura responsable no usa el misterio para imponer miedo, dependencia o certeza. Protege la dignidad, reconoce sus límites y devuelve la decisión final a quien consulta.',
    alt:'Templo cósmico del Tarot que representa límites responsables', caption:'CLARIDAD ANTES QUE CERTEZA', stats:[['Decisión','Siempre tuya'],['Consentimiento','Explícito'],['Lenguaje','No determinista'],['Seguridad','Hechos primero']],
    principlesKicker:'CUATRO COMPROMISOS', principlesTitle:'Lo que guía cada recorrido público',
    principles:[['◇','Autonomía','Una carta puede sugerir preguntas y posibilidades. Nunca convierte un camino en obligación.'],['✦','Consentimiento','Las preguntas sobre vínculos deben respetar límites y centrarse en las elecciones disponibles para quien consulta.'],['☾','Privacidad','El Tarot no es un acceso secreto a la mente, el cuerpo, los mensajes ni la vida privada de otra persona.'],['☉','Responsabilidad','Las decisiones de salud, salud mental, derecho y finanzas exigen profesionales cualificados y hechos verificables.']],
    languageKicker:'LENGUAJE NO DETERMINISTA', languageTitle:'Transforma conclusiones en preguntas útiles',
    steps:[['Evita sentencias de destino','Nombra escenarios, condiciones y señales observables en lugar de afirmar que algo debe suceder.'],['Separa símbolo y hecho','Una carta puede representar una dinámica; no confirma traición, enfermedad, delito ni intención oculta.'],['Devuelve la elección','Cierra con alternativas, límites y una pregunta concreta que la persona pueda evaluar en la realidad.']],
    limitsKicker:'LÍMITES IMPORTANTES', limitsTitle:'Cuándo el Tarot no es la herramienta adecuada',
    limits:[['Decisiones médicas o psicológicas','El Tarot no diagnostica, prescribe ni sustituye la atención profesional.'],['Decisiones jurídicas o financieras','Los documentos, las evidencias, los presupuestos, los contratos y el asesoramiento cualificado vienen antes que la interpretación simbólica.'],['Urgencia o peligro','Contacta a los servicios locales de emergencia y a una red de apoyo confiable. Una lectura o un correo no son asistencia de emergencia.']],
    note:'Si una interpretación genera miedo intenso, aislamiento o presión para actuar, detén la lectura, vuelve a los hechos observables y busca apoyo confiable.'
  })
});

function ethicsPage(language) {
  const c = ethicsContent[language];
  const steps = `<ol class="intl-numbered">${c.steps.map(([title,body])=>`<li><h3>${title}</h3><p>${body}</p></li>`).join('')}</ol>`;
  const limits = `<div class="intl-grid">${c.limits.map(([title,body])=>`<article class="intl-card"><h3>${title}</h3><p>${body}</p></article>`).join('')}</div>`;
  const body = `${hero({ eyebrow:c.eyebrow, title:c.title, lead:c.lead, image:'tarot-temple-background-v1.webp', alt:c.alt, caption:c.caption, actions:`<a class="intl-button primary" href="${routes.tarot[language]}">${locale[language].tarot}</a><a class="intl-button" href="${routes.contact[language]}">${locale[language].contact}</a>` })}${stats(c.stats)}<section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.principlesKicker}</p><h2>${c.principlesTitle}</h2></header>${featureCards(c.principles)}</section><section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.languageKicker}</p><h2>${c.languageTitle}</h2></header>${steps}</section><section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.limitsKicker}</p><h2>${c.limitsTitle}</h2></header>${limits}<aside class="intl-notice"><span aria-hidden="true">!</span><p>${c.note}</p></aside></section>`;
  return page({ key:'ethics', language, title:c.metaTitle, description:c.description, image:'tarot-temple-background-v1.webp', body });
}

const contactContent = Object.freeze({
  en: Object.freeze({
    metaTitle:'Official contact for Divina Bruxa', description:'Contact Divina Bruxa through the official support email for Tarot consultation requests, website questions and information about the Orb of Realities.',
    eyebrow:'OFFICIAL CHANNEL · EMAIL SUPPORT', title:'Contact<br>Divina Bruxa', lead:'Use the official email for consultation requests, website questions or information about the Orb of Realities. Include only the information needed to understand your request.',
    alt:'Celestial sanctuary representing the official contact channel', caption:'OFFICIAL CONTACT · EMAIL ONLY', stats:[['Channel','Email'],['WhatsApp','Not offered'],['Sending','No charge'],['Emergency','Not supported']],
    emailKicker:'OFFICIAL EMAIL', emailTitle:'orbedasrealidades@hotmail.com', emailBody:'Sending an email does not confirm an appointment, payment, deadline or contract. Wait for a reply before considering any service agreed.', button:'Open my email application',
    topicsKicker:'CHOOSE A CLEAR SUBJECT', topicsTitle:'Help us understand your message',
    topics:[['♙','Tarot consultations','Name the format you are interested in and provide a brief context. Review the BRL price before writing.'],['◇','Website questions','Mention the page or feature you were using and what happened, without sending passwords or codes.'],['▤','Content and School','Identify the card, module or public page related to your question.'],['✦','General information','Use a clear subject line and describe the reason for contact in a few lines.']],
    safetyKicker:'SEND SAFELY', safetyTitle:'What never belongs in an email',
    safety:[['Use your reply address','Include the email at which you want to receive the answer.'],['Share only what is needed','Never send passwords, authentication codes, full identity documents or banking credentials.'],['Wait for confirmation','A sent message is not a completed purchase, reservation or consultation.']],
    note:'This inbox is not an emergency service. In urgent situations, contact the appropriate local emergency service and a trusted person.'
  }),
  es: Object.freeze({
    metaTitle:'Contacto oficial de Divina Bruxa', description:'Contacta a Divina Bruxa por el correo oficial para solicitudes de consulta de Tarot, dudas sobre el sitio e información de la Orbe de las Realidades.',
    eyebrow:'CANAL OFICIAL · SOPORTE POR CORREO', title:'Contacta a<br>Divina Bruxa', lead:'Usa el correo oficial para solicitudes de consulta, dudas sobre el sitio o información de la Orbe de las Realidades. Incluye solamente la información necesaria para comprender tu mensaje.',
    alt:'Santuario celestial que representa el canal oficial de contacto', caption:'CONTACTO OFICIAL · SOLO CORREO', stats:[['Canal','Correo'],['WhatsApp','No disponible'],['Envío','Sin cobro'],['Emergencia','No atendida']],
    emailKicker:'CORREO OFICIAL', emailTitle:'orbedasrealidades@hotmail.com', emailBody:'Enviar un correo no confirma una cita, un pago, un plazo ni un contrato. Espera una respuesta antes de considerar cualquier servicio acordado.', button:'Abrir mi aplicación de correo',
    topicsKicker:'ELIGE UN ASUNTO CLARO', topicsTitle:'Ayúdanos a comprender tu mensaje',
    topics:[['♙','Consultas de Tarot','Indica el formato que te interesa y un contexto breve. Revisa el precio en BRL antes de escribir.'],['◇','Dudas sobre el sitio','Menciona la página o función que estabas usando y qué sucedió, sin enviar contraseñas ni códigos.'],['▤','Contenido y Escuela','Identifica la carta, el módulo o la página pública relacionada con tu duda.'],['✦','Información general','Usa un asunto claro y describe el motivo del contacto en pocas líneas.']],
    safetyKicker:'ENVÍA CON SEGURIDAD', safetyTitle:'Lo que nunca debe ir en un correo',
    safety:[['Usa tu dirección de respuesta','Incluye el correo donde quieres recibir la respuesta.'],['Comparte solo lo necesario','Nunca envíes contraseñas, códigos de acceso, documentos de identidad completos ni credenciales bancarias.'],['Espera la confirmación','Un mensaje enviado no equivale a una compra, reserva o consulta completada.']],
    note:'Este correo no es un servicio de emergencias. En situaciones urgentes, contacta al servicio local adecuado y a una persona de confianza.'
  })
});

function contactPage(language) {
  const c = contactContent[language];
  const steps = `<ol class="intl-numbered">${c.safety.map(([title,body])=>`<li><h3>${title}</h3><p>${body}</p></li>`).join('')}</ol>`;
  const mailSubject = encodeURIComponent(language === 'en' ? 'Contact from the Divina Bruxa website' : 'Contacto desde el sitio de Divina Bruxa');
  const body = `${hero({ eyebrow:c.eyebrow, title:c.title, lead:c.lead, image:'consultas-celestiais-santuario-v1.webp', alt:c.alt, caption:c.caption, actions:`<a class="intl-button primary" href="mailto:orbedasrealidades@hotmail.com?subject=${mailSubject}">${c.button}</a><a class="intl-button" href="${routes.consultations[language]}">${locale[language].consultations}</a>` })}${stats(c.stats)}<section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.emailKicker}</p><h2>${c.emailTitle}</h2><p>${c.emailBody}</p></header><div class="intl-actions"><a class="intl-button primary" href="mailto:orbedasrealidades@hotmail.com?subject=${mailSubject}">${c.button}</a></div></section><section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.topicsKicker}</p><h2>${c.topicsTitle}</h2></header>${featureCards(c.topics)}</section><section class="intl-section"><header class="intl-section-heading"><p class="intl-kicker">${c.safetyKicker}</p><h2>${c.safetyTitle}</h2></header>${steps}<aside class="intl-notice"><span aria-hidden="true">!</span><p>${c.note}</p></aside></section>`;
  return page({ key:'contact', language, title:c.metaTitle, description:c.description, image:'consultas-celestiais-santuario-v1.webp', pageType:'ContactPage', body });
}

async function injectPortugueseAlternates(key) {
  const filename = routes[key].pt || 'index.html';
  const url = new URL(filename, root);
  let html = await readFile(url, 'utf8');
  html = html.replace(/\s*<!-- V195 I18N HEAD START -->[\s\S]*?<!-- V195 I18N HEAD END -->\s*/g, '\n');
  html = html.replace(/\s*<!-- V195 I18N SWITCH START -->[\s\S]*?<!-- V195 I18N SWITCH END -->\s*/g, '\n');
  html = html.replace(/\s*<!-- V195 I18N MENU START -->[\s\S]*?<!-- V195 I18N MENU END -->\s*/g, '');
  const headBlock = `\n<!-- V195 I18N HEAD START -->\n${alternateLinks(key)}\n<link rel="stylesheet" href="international-v195.css?v=195">\n<!-- V195 I18N HEAD END -->\n`;
  html = html.replace('</head>', `${headBlock}</head>`);
  if (key === 'home') {
    const menu = `<!-- V195 I18N MENU START --><strong>IDIOMAS · LANGUAGES</strong><a lang="en" hreflang="en" href="${routes.home.en}">English</a><a lang="es" hreflang="es" href="${routes.home.es}">Español</a><!-- V195 I18N MENU END -->`;
    html = html.replace(/(<nav class="magic-menu-guides"[^>]*>)/, `$1${menu}`);
  } else {
    const switcher = `<!-- V195 I18N SWITCH START --><nav class="v195-language-switcher" aria-label="Escolher idioma"><a href="${routes[key].pt}" aria-current="page">PT</a><a lang="en" hreflang="en" href="${routes[key].en}">EN</a><a lang="es" hreflang="es" href="${routes[key].es}">ES</a></nav><!-- V195 I18N SWITCH END -->`;
    html = html.replace(/(<header class="site-header"[\s\S]*?<\/header>)/, `$1\n${switcher}`);
  }
  await writeFile(url, html, 'utf8');
}

function languageSitemap(language) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(routes).map(key => `  <url>\n    <loc>${absolute(routes[key][language])}</loc>\n    <lastmod>${releaseDate}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
}

async function updateSitemapIndex() {
  const url = new URL('sitemap.xml', root);
  let xml = await readFile(url, 'utf8');
  xml = xml.replace(/\s*<!-- V195 INTERNATIONAL SITEMAPS START -->[\s\S]*?<!-- V195 INTERNATIONAL SITEMAPS END -->\s*/g, '\n');
  const addition = `  <!-- V195 INTERNATIONAL SITEMAPS START -->
  <sitemap>
    <loc>${base}/sitemap-en.xml</loc>
    <lastmod>${releaseDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-es.xml</loc>
    <lastmod>${releaseDate}</lastmod>
  </sitemap>
  <!-- V195 INTERNATIONAL SITEMAPS END -->
`;
  xml = xml.replace('</sitemapindex>', `${addition}</sitemapindex>`);
  await writeFile(url, xml, 'utf8');
}

const outputs = Object.freeze({
  'english.html': homePage('en'),
  'espanol.html': homePage('es'),
  'free-tarot-reading.html': tarotPage('en'),
  'tarot-libre.html': tarotPage('es'),
  'tarot-card-meanings.html': libraryPage('en'),
  'significados-cartas-tarot.html': libraryPage('es'),
  'tarot-school.html': schoolPage('en'),
  'escuela-tarot.html': schoolPage('es'),
  'tarot-consultations.html': consultationsPage('en'),
  'consultas-tarot.html': consultationsPage('es'),
  'tarot-ethics.html': ethicsPage('en'),
  'etica-tarot.html': ethicsPage('es'),
  'contact.html': contactPage('en'),
  'contacto.html': contactPage('es')
});

for (const [filename, content] of Object.entries(outputs)) {
  await writeFile(new URL(filename, root), content, 'utf8');
}

for (const key of Object.keys(routes)) await injectPortugueseAlternates(key);
await writeFile(new URL('sitemap-en.xml', root), languageSitemap('en'), 'utf8');
await writeFile(new URL('sitemap-es.xml', root), languageSitemap('es'), 'utf8');
await updateSitemapIndex();

console.log(`V195 i18n build complete: ${Object.keys(outputs).length} localized pages, ${Object.keys(routes).length} reciprocal clusters.`);
