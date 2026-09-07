import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const sources = [
  'app.css',
  'motion.css',
  'update-04.css',
  'update-05.css',
  'update-06.css',
  'update-08.css',
  'update-09.css',
  'update-11.css',
  'visual-v68.css',
  'tarot-table-v5.css',
  'tarot-ritual-v5.css',
  'tarot-controls-v5.css',
  'tarot-editorial-v5.css',
  'spreads-v5.css',
  'card-library-v5.css',
  'ai-v5.css',
  'premium-v5.css',
  'consultation-v5.css',
  'notification-v5.css',
  'notification-celestial-v150.css',
  'admin-analytics-v1.css',
  'media-celestial-v149.css',
  'store-v5.css',
  'store-celestial-v1.css',
  'school-v5.css',
  'journal-v5.css',
  'cosmic-design-system-v1.css',
  'menu-ring-v8.css',
  'menu-completo-v177.css',
  'skins-v6.css',
  'COSMIC-DESIGN-SYSTEM-V10.css',
  'PAGE-INTERIORS-V10.css',
  'PORTAL-TRANSITIONS-V10.css',
  'runtime-v12.css',
  'home-orb-only-v1.css',
  'tarot-livre-official-v1.css',
  'home-orb-words-v2.css',
  'orb-skin-release-v1.css',
  'orb-loading-portal-v1.css',
  'tarot-livre-ios-v1.css',
  'cosmic-visual-atlas-v1.css',
  'school-celestial-v1.css',
  'spreads-temple-v1.css',
  'journal-celestial-v1.css',
  'ai-celestial-v1.css',
  'premium-constellation-v1.css',
  'consultations-celestial-v1.css',
  'admin-command-v1.css',
  'cosmic-media-v1.css',
  'seo-navigation-v156.css'
];

const chunks = await Promise.all(sources.map(async source => {
  const css = await readFile(source, 'utf8');
  if (/\@(?:charset|import)\b/i.test(css)) {
    throw new Error(`Diretiva não consolidável em ${source}`);
  }
  return `/* ── ${source} ── */\n${css.trim()}\n`;
}));

const header = [
  '/* DIVINA BRUXA — NÚCLEO VISUAL V179',
  '   Gerado por BUILD-V179-CSS.mjs.',
  '   Ordem original preservada: não editar este arquivo manualmente. */',
  ''
].join('\n');
const output = `${header}${chunks.join('\n')}`;
await writeFile('divina-core-v179.css', output, 'utf8');

const manifest = {
  release: 'V179',
  purpose: 'Arquitetura limpa e núcleo rápido',
  releaseDate: '2026-09-07',
  entryStylesBefore: sources.length,
  entryStylesAfter: 1,
  cascadeOrderPreserved: true,
  sources,
  output: {
    file: 'divina-core-v179.css',
    bytes: Buffer.byteLength(output),
    sha256: createHash('sha256').update(output).digest('hex')
  }
};
await writeFile('MANIFESTO-RUNTIME-V179.json', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(manifest.output));
