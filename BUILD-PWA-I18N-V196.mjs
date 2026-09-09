/* DIVINA BRUXA — V196
   Instala o manifesto, a camada PWA/WCAG e o runtime resiliente nas sete
   jornadas públicas em português, inglês e espanhol. Reexecução idempotente.
*/
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('./', import.meta.url);
const pages = Object.freeze([
  'tarot-livre.html', 'cartas-do-tarot.html', 'escola-do-tarot.html', 'consultas-de-tarot.html', 'etica-e-responsabilidade.html', 'contato.html',
  'english.html', 'free-tarot-reading.html', 'tarot-card-meanings.html', 'tarot-school.html', 'tarot-consultations.html', 'tarot-ethics.html', 'contact.html',
  'espanol.html', 'tarot-libre.html', 'significados-cartas-tarot.html', 'escuela-tarot.html', 'consultas-tarot.html', 'etica-tarot.html', 'contacto.html'
]);

const manifest = '  <link rel="manifest" href="manifest.webmanifest?v=196">';
const styles = '  <link rel="stylesheet" href="pwa-world-v196.css?v=196">';
const runtime = '  <script type="module" src="pwa-world-v196.js?v=196"></script>';

for (const filename of pages) {
  const url = new URL(filename, root);
  let html = await readFile(url, 'utf8');
  html = html.replaceAll('international-tarot-v195.js?v=195', 'international-tarot-v195.js?v=196');
  html = html.replaceAll('international-library-v195.js?v=195', 'international-library-v195.js?v=196');
  if (!/manifest\.webmanifest\?v=196/.test(html)) html = html.replace('</head>', `${manifest}\n</head>`);
  if (!/pwa-world-v196\.css\?v=196/.test(html)) html = html.replace('</head>', `${styles}\n</head>`);
  if (!/pwa-world-v196\.js\?v=196/.test(html)) html = html.replace('</body>', `${runtime}\n</body>`);
  await writeFile(url, html, 'utf8');
}

console.log(`DIVINA BRUXA V196 — PWA instalada em ${pages.length} jornadas públicas.`);
