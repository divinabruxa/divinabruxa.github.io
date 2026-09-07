import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { ROUTES_V180 } from './route-registry-v180.js';

const previous = JSON.parse(await readFile('MANIFESTO-RUNTIME-V179.json', 'utf8'));
const deferredSources = Object.freeze([
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
  'skins-v6.css',
  'school-celestial-v1.css',
  'spreads-temple-v1.css',
  'journal-celestial-v1.css',
  'ai-celestial-v1.css',
  'premium-constellation-v1.css',
  'consultations-celestial-v1.css',
  'admin-command-v1.css'
]);

const sourceOrder = previous.sources;
const shellAddons = Object.freeze(['route-recovery-v180.css']);
const unknown = deferredSources.filter(source => !sourceOrder.includes(source));
if (unknown.length) throw new Error(`Fontes adiadas desconhecidas: ${unknown.join(', ')}`);
const shellSources = sourceOrder.filter(source => !deferredSources.includes(source));

const shellBuildSources = [...shellSources, ...shellAddons];
const chunks = await Promise.all(shellBuildSources.map(async source => {
  const css = await readFile(source, 'utf8');
  if (/@(?:charset|import)\b/i.test(css)) throw new Error(`Diretiva não consolidável em ${source}`);
  return `/* ── ${source} ── */\n${css.trim()}\n`;
}));

const header = [
  '/* DIVINA BRUXA — SHELL CRÍTICO V180',
  '   Gerado por BUILD-V180-SHELL.mjs.',
  '   Home, Tarot Livre, Carta do Dia e Conta sem CSS de portais pesados. */',
  ''
].join('\n');
const signature = ':root{--db-shell-v180:1}\n\n';
const output = `${header}${signature}${chunks.join('\n')}`;
await writeFile('divina-shell-v180.css', output, 'utf8');

const sha256 = value => createHash('sha256').update(value).digest('hex');
const manifest = {
  release: 'DIVINA-BRUXA-V180-ROTAS-SEM-TELA-BRANCA',
  releaseDate: '2026-09-07',
  sourceRelease: previous.release,
  routes: ROUTES_V180,
  styles: {
    entryRequests: 1,
    completeSourceCount: sourceOrder.length,
    shellSourceCount: shellSources.length,
    shellAddonCount: shellAddons.length,
    deferredSourceCount: deferredSources.length,
    completeBytes: previous.output.bytes,
    shellSources,
    shellAddons,
    deferredSources,
    deferredCompleteFile: previous.output.file,
    deferredCompleteSha256: previous.output.sha256,
    shell: {
      file: 'divina-shell-v180.css',
      bytes: Buffer.byteLength(output),
      sha256: sha256(output)
    }
  },
  safeguards: {
    unknownRouteFallback: 'home',
    portalTimeoutMs: 15000,
    retryWithoutReload: true,
    criticalInlineFallback: true,
    freeTarotOrientation: 'normal-only',
    freeTarotRepeatsBeforeExhaustion: false,
    realTable: '13x6',
    consultationPricesBrl: [250, 150, 100, 50],
    consultationEmailRequired: true,
    realBillingEnabled: false
  }
};
await writeFile('MANIFESTO-RUNTIME-V180.json', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(manifest.styles.shell));
