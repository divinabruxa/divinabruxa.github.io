import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const baselinePath = path.join(root, 'v77-baseline.json');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const results = [];
let failures = 0;

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (!ok) failures += 1;
}

function expect(name, condition, detail = '') {
  record(name, Boolean(condition), detail);
}

function read(file, encoding = null) {
  return fs.readFileSync(path.join(root, file), encoding ?? undefined);
}

function sha256(file) {
  return crypto.createHash('sha256').update(read(file)).digest('hex');
}

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

for (const [file, expectedHash] of Object.entries(baseline.protectedFiles)) {
  const exists = fs.existsSync(path.join(root, file));
  expect(`arquivo protegido existe: ${file}`, exists);
  if (exists) expect(`assinatura V77 preservada: ${file}`, sha256(file) === expectedHash);
}

const index = read('index.html', 'utf8');
const css = read('visual-v68.css', 'utf8');
const sw = read('sw.js', 'utf8');
const tarotEngine = read('tarot-engine.js', 'utf8');
const meaningEngine = read('meaning-engine.js', 'utf8');

expect('folha visual V77 continua carregada', index.includes('visual-v68.css?v=77'));
expect('service worker continua na V77', sw.includes("divina-bruxa-v77-centro-mobile-exato"));
expect('canvas da Orbe principal existe', /<canvas\s+id="orbCanvas"/.test(index));
expect('motor da Orbe principal continua conectado', index.includes('id="orb"') && read('app.js', 'utf8').includes('RealityOrbEngine'));

const mobileRule = css.slice(css.lastIndexOf('@media(max-width:430px) and (orientation:portrait)'));
expect('regra mobile portrait existe', mobileRule.startsWith('@media(max-width:430px)'));
expect('Orbe mobile usa centro do próprio layout', mobileRule.includes('align-self:center') && mobileRule.includes('margin:15px auto 0'));
expect('Orbe fechada não recebe deslocamento horizontal', mobileRule.includes('transform:translate3d(0,0,0)'));
expect('Menu aberto move somente no eixo vertical', mobileRule.includes('transform:translate3d(0,-9svh,0)'));
expect('regra mobile não reintroduz compensação -50%', !mobileRule.includes('translate3d(-50%'));

const sections = new Set([...index.matchAll(/<section\s+id="([^"]+)"/g)].map(match => match[1]));
const targets = [...index.matchAll(/data-go="([^"]+)"/g)].map(match => match[1]);
const uniqueTargets = new Set(targets);
expect('14 telas principais preservadas', sections.size === baseline.contracts.mainSections, `encontradas: ${sections.size}`);
expect('14 destinos de navegação preservados', uniqueTargets.size === baseline.contracts.mainNavigationTargets, `encontrados: ${uniqueTargets.size}`);
expect('nenhum destino do menu está quebrado', [...uniqueTargets].every(target => sections.has(target)));
expect('nenhuma tela principal ficou sem acesso', [...sections].every(section => section === 'home' || uniqueTargets.has(section)));

const orbitalMenu = index.match(/<nav\s+id="orbMenu"[\s\S]*?<\/nav>/)?.[0] ?? '';
const dock = index.match(/<nav\s+class="magic-dock"[\s\S]*?<\/nav>/)?.[0] ?? '';
expect('Menu Mágico orbital existe', Boolean(orbitalMenu));
expect('Menu Mágico mantém 9 portais', (orbitalMenu.match(/<button\b/g) ?? []).length === baseline.contracts.orbitalMenuButtons);
expect('portal de vídeos permanece no Menu Mágico', orbitalMenu.includes('data-go="videos"'));
expect('menu inferior existe', Boolean(dock));
expect('menu inferior mantém 5 joias', (dock.match(/<button\b/g) ?? []).length === baseline.contracts.dockButtons);
expect('mini-orbe inferior continua abrindo Orbe IA', /data-go="ai"\s+class="dock-orb"/.test(dock));

const tarotModuleURL = `${pathToFileURL(path.join(root, 'tarot-data.js')).href}?verify=${Date.now()}`;
const { CARDS } = await import(tarotModuleURL);
expect('catálogo possui exatamente 78 cartas', CARDS.length === baseline.contracts.cardCount, `encontradas: ${CARDS.length}`);
expect('IDs das cartas são únicos', new Set(CARDS.map(card => card.id)).size === baseline.contracts.cardCount);
expect('nomes das cartas são únicos', new Set(CARDS.map(card => card.name)).size === baseline.contracts.cardCount);
expect('primeira carta é O Louco', CARDS[0]?.name === baseline.contracts.firstCard);
expect('última carta é Rei de Ouros', CARDS[77]?.name === baseline.contracts.lastCard);
expect('catálogo não contém orientação invertida', CARDS.every(card => card.reversed !== true && card.orientation !== 'reversed'));
expect('Tarot Livre grava somente orientação normal', tarotEngine.includes('this.state.reversed.push(false)') && tarotEngine.includes('const reversed = false'));
expect('motor de significado bloqueia reversão', meaningEngine.includes('reversed=false;'));

let imageFailures = 0;
for (const card of CARDS) {
  const file = path.join(root, card.image);
  if (!fs.existsSync(file)) { imageFailures += 1; continue; }
  const size = imageSize(card.image);
  if (!size || size.width < 1023 || size.height < 1402 || !card.image.endsWith('.webp')) imageFailures += 1;
}
expect('78 imagens HD existem e superam a base 300 × 450', imageFailures === 0, `falhas: ${imageFailures}`);

await import(`${pathToFileURL(path.join(root, 'tarot-meanings.js')).href}?verify=${Date.now()}`);
const meanings = globalThis.DivinaBruxaTarotMeanings;
const validation = meanings?.validate?.();
expect('base profunda das 78 cartas está disponível', meanings?.cardCount === baseline.contracts.cardCount);
expect('base profunda aceita somente orientação normal', meanings?.normalOnly === true && Object.values(meanings?.cards ?? {}).every(card => card.orientation === 'normal'));
expect('15 camadas editoriais continuam presentes', meanings?.schema?.length === baseline.contracts.deepMeaningLayers);
expect('validação editorial profunda aprovada', validation?.ok === true, validation?.errors?.join('; ') ?? 'indisponível');

const cardPages = fs.readdirSync(root).filter(file => /^carta-.*\.html$/.test(file));
expect('78 páginas editoriais preservadas', cardPages.length === baseline.contracts.editorialCardPages, `encontradas: ${cardPages.length}`);
expect('todas as páginas possuem título, canonical e biblioteca', cardPages.every(file => {
  const page = read(file, 'utf8');
  return page.includes('<title>') && page.includes('rel="canonical"') && page.includes('BIBLIOTECA DAS 78 CARTAS');
}));
const sitemap = read('sitemap.xml', 'utf8');
expect('sitemap mantém as 78 páginas de cartas', (sitemap.match(/<loc>[^<]*\/carta-/g) ?? []).length === baseline.contracts.editorialCardPages);

console.log(`\nDIVINA BRUXA — CONTRATO V77 (${baseline.version})\n`);
for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
}
console.log(`\n${results.length - failures}/${results.length} verificações aprovadas.`);
if (failures) {
  console.error(`A entrega foi bloqueada por ${failures} regressão(ões). Restaure a V77 ou aprove uma nova base conscientemente.`);
  process.exit(1);
}
console.log('V77 protegida. A evolução de conteúdo pode continuar.');
