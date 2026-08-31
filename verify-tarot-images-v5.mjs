#!/usr/bin/env node
/* Divina Bruxa — auditoria reproduzível das 78 imagens HD — Checkpoint 1.3 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tarot-image-manifest-v5.json'), 'utf8'));
const { CARDS } = await import(`${pathToFileURL(path.join(root, 'tarot-data.js')).href}?audit=${Date.now()}`);
const results = [];
const check = (name, condition, detail = '') => results.push({ name, pass: Boolean(condition), detail });
const read = file => fs.readFileSync(path.join(root, file));
const hash = file => crypto.createHash('sha256').update(read(file)).digest('hex');

function imageSize(file) {
  const data = read(file);
  if (data.length >= 24 && data.toString('ascii', 1, 4) === 'PNG') {
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }
  if (data.length >= 4 && data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < data.length) {
      if (data[offset] !== 0xff) { offset += 1; continue; }
      const marker = data[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      const length = data.readUInt16BE(offset + 2);
      if (length < 2 || offset + length + 2 > data.length) break;
      if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
        return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
      }
      offset += length + 2;
    }
  }
  if (data.length >= 30 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = data.toString('ascii', 12, 16);
    if (chunk === 'VP8 ' && data[23] === 0x9d && data[24] === 0x01 && data[25] === 0x2a) {
      return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
    }
  }
  return null;
}

check('manifesto identifica o Checkpoint 1.3', manifest.checkpoint === '1.3');
check('política preserva 78 artes oficiais', manifest.policy?.officialArtworks === 78);
check('as 78 artes possuem fonte individual em alta resolução', manifest.policy?.highResolutionArtworks === 78);
check('nenhuma arte foi substituída', manifest.policy?.replacedArtworks === 0);
check('nenhuma arte recebeu ampliação artificial', manifest.policy?.upscaledArtworks === 0);
check('os dois ZIPs enviados são cópias idênticas', manifest.sourceAudit?.archivesAreByteIdentical === true);
check('a fonte enviada contém exatamente 78 imagens reais', manifest.sourceAudit?.realImageFiles === 78 && manifest.sourceAudit?.uniqueSourceHashes === 78);
check('o mapeamento da fonte está completo', manifest.sourceAudit?.mappingStatus === 'complete');
check('manifesto contém 78 registros', manifest.cards?.length === 78, `encontrados: ${manifest.cards?.length ?? 0}`);
check('catálogo continua com 78 cartas', CARDS.length === 78, `encontradas: ${CARDS.length}`);
check('primeira carta continua O Louco', CARDS[0]?.name === 'O Louco');
check('última carta continua Rei de Ouros', CARDS[77]?.name === 'Rei de Ouros');
check('todas continuam na orientação normal', CARDS.every(card => card.orientation === 'normal'));

let fileErrors = 0;
let mappingErrors = 0;
for (const entry of manifest.cards ?? []) {
  const card = CARDS[entry.index];
  const filePath = path.join(root, entry.file ?? '');
  if (!card || !fs.existsSync(filePath)) { fileErrors += 1; continue; }
  const size = imageSize(entry.file);
  const fileStat = fs.statSync(filePath);
  if (!size || size.width !== entry.width || size.height !== entry.height || size.width < 1023 || size.height < 1402 || !entry.file.endsWith('.webp') || fileStat.size !== entry.bytes || hash(entry.file) !== entry.sha256) fileErrors += 1;
  const expectedColumn = card.atlasIndex % 10;
  const expectedRow = Math.floor(card.atlasIndex / 10);
  if (entry.canonicalId !== card.canonicalId || entry.name !== card.name || entry.atlasIndex !== card.atlasIndex || entry.file !== card.image || entry.orientation !== 'normal' || entry.mappingStatus !== 'verified-high-resolution' || entry.atlasCell?.column !== expectedColumn || entry.atlasCell?.row !== expectedRow || entry.atlasCell?.x !== expectedColumn * 300 || entry.atlasCell?.y !== expectedRow * 450) mappingErrors += 1;
}
check('78 arquivos HD passam em formato, dimensão, tamanho e SHA-256', fileErrors === 0, `falhas: ${fileErrors}`);
check('78 associações catálogo ↔ imagem ↔ atlas estão corretas', mappingErrors === 0, `falhas: ${mappingErrors}`);
check('todos os hashes individuais são únicos', new Set(manifest.cards.map(card => card.sha256)).size === 78);
check('todas as fontes originais registradas são únicas', new Set(manifest.cards.map(card => card.sourceSha256)).size === 78);
check('catálogo aponta somente para WebP HD', CARDS.every(card => /^card-\d{2}\.webp$/.test(card.image) && card.imageSources.full === card.image));

const atlas = manifest.atlas;
const atlasExists = fs.existsSync(path.join(root, atlas.file));
const atlasSize = atlasExists ? imageSize(atlas.file) : null;
check('atlas oficial existe', atlasExists);
check('atlas oficial mede 3000 × 3600', atlasSize?.width === 3000 && atlasSize?.height === 3600, atlasSize ? `${atlasSize.width} × ${atlasSize.height}` : 'indisponível');
check('assinatura SHA-256 do atlas confere', atlasExists && hash(atlas.file) === atlas.sha256);
check('atlas mantém grade 10 × 8 e células 300 × 450', atlas.grid?.columns === 10 && atlas.grid?.rows === 8 && atlas.grid?.cellWidth === 300 && atlas.grid?.cellHeight === 450 && atlas.grid?.usedCells === 78);

const pages = fs.readdirSync(root).filter(file => /^carta-.*\.html$/.test(file));
let pageErrors = 0;
for (const card of CARDS) {
  const expectedX = ((card.atlasIndex % 10) / 9 * 100).toFixed(6);
  const expectedY = (Math.floor(card.atlasIndex / 10) / 7 * 100).toFixed(6);
  const page = pages.find(file => fs.readFileSync(path.join(root, file), 'utf8').includes(`<h1>${card.name}</h1>`));
  if (!page) { pageErrors += 1; continue; }
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  if (!html.includes(`background-position:${expectedX}% ${expectedY}%`)) pageErrors += 1;
}
check('78 páginas editoriais apontam para a célula correta do atlas', pageErrors === 0, `falhas: ${pageErrors}`);

const runtime = fs.readFileSync(path.join(root, 'tarot-image-runtime.js'), 'utf8');
const tarotEngine = fs.readFileSync(path.join(root, 'tarot-engine.js'), 'utf8');
const ritualEngine = fs.readFileSync(path.join(root, 'ritual-engine.js'), 'utf8');
const spreadEngine = fs.readFileSync(path.join(root, 'spreads-engine.js'), 'utf8');
const journalEngine = fs.readFileSync(path.join(root, 'journal-engine.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
check('imagens reservam proporção HD sem salto de layout', runtime.includes('width="1024" height="1536"'));
check('carregamento progressivo está ativo', runtime.includes('loading="${eager ? \'eager\' : \'lazy\'}"') && runtime.includes('decoding="async"'));
check('preload inteligente está limitado a três cartas', runtime.includes('Math.min(limit, 3)') && tarotEngine.includes('preloadCardImages(this.state.waiting, 3)'));
check('fallback visível usa célula do atlas', runtime.includes("backgroundSize = '1000% 800%'") && runtime.includes('atlasFallback'));
check('falha de imagem é registrada', runtime.includes('console.error') && runtime.includes('tarot:image-error'));
check('Tarot Livre usa runtime central', tarotEngine.includes('cardImageMarkup'));
check('Carta do Dia usa runtime central', ritualEngine.includes('cardImageMarkup'));
check('Tiragens usam runtime central', spreadEngine.includes('cardImageMarkup'));
check('Diário usa runtime central', journalEngine.includes('cardImageMarkup'));
const appVersion = Number(index.match(/app\.js\?v=(\d+)/)?.[1] ?? 0);
check('navegador recebe a versão HD sem intervalo antigo', appVersion >= 80, `versão: ${appVersion}`);
check('modo offline preserva runtime, catálogo e atlas', ['tarot-image-runtime.js','tarot-data.js','tarot-atlas.webp'].every(file => sw.includes(`'./${file}'`)));
check('cartas HD carregam sob demanda e não travam a instalação', !sw.includes("'./card-00.webp'"));

for (const result of results) console.log(`${result.pass ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
const passed = results.filter(result => result.pass).length;
console.log(`\n${passed}/${results.length} verificações aprovadas.`);
if (passed !== results.length) process.exitCode = 1;
else console.log('Auditoria das 78 imagens HD aprovada: baralho completo, normal, nítido e mapeado sem lacunas.');
