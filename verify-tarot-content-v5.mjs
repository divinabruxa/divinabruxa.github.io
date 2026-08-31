#!/usr/bin/env node
/* Divina Bruxa — validação do Conteúdo-Mãe — Checkpoint 1.3 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
await import(`${pathToFileURL(path.join(root, 'tarot-meanings.js')).href}?content=${Date.now()}`);
const source = globalThis.DivinaBruxaTarotMeanings;
const { CARDS } = await import(`${pathToFileURL(path.join(root, 'tarot-data.js')).href}?catalog=${Date.now()}`);
const engine = await import(`${pathToFileURL(path.join(root, 'meaning-engine.js')).href}?engine=${Date.now()}`);
const results = [];
const check = (name, condition, detail = '') => results.push({ name, pass: Boolean(condition), detail });
const expectedSchema = ['essence','centralMessage','light','tension','love','relationships','career','money','spirituality','advice','symbols','reflectionQuestion','combinations','keywords','responsibleNotice'];
const idFor = card => card.arcanaCode === 'major' ? card.canonicalId : card.canonicalId.replace(/^\d+-/, '');

check('fonte declara versão 5.0.1', source?.schemaVersion === '5.0.1');
check('fonte declara orientação exclusivamente normal', source?.normalOnly === true);
check('schema oficial contém exatamente 15 camadas', source?.schema?.length === 15, `encontradas: ${source?.schema?.length ?? 0}`);
check('as 15 camadas têm os nomes oficiais', JSON.stringify(source?.schema) === JSON.stringify(expectedSchema));
check('conteúdo-mãe possui exatamente 78 cartas', source?.cardCount === 78 && Object.keys(source?.cards ?? {}).length === 78);
check('catálogo possui exatamente 78 cartas', CARDS.length === 78);

const contentCards = CARDS.map(card => source?.get?.(idFor(card)));
check('cada carta do catálogo encontra seu conteúdo', contentCards.every(Boolean));
check('os 78 nomes coincidem entre catálogo e conteúdo', contentCards.every((content, index) => content?.name === CARDS[index].name));
check('todas as cartas estão normais', contentCards.every(content => content?.orientation === 'normal'));
check('nenhuma chave de conteúdo invertido existe', contentCards.every(content => !Object.keys(content).some(key => /revers|invertid/i.test(key))));

const minimumLength = { essence:300, centralMessage:240, light:220, tension:220, love:220, relationships:200, career:220, money:220, spirituality:180, advice:180, reflectionQuestion:60, responsibleNotice:140 };
let layerErrors = 0;
let combinationErrors = 0;
for (const content of contentCards) {
  if (!content) { layerErrors += 1; continue; }
  if (Object.entries(minimumLength).some(([key, minimum]) => typeof content[key] !== 'string' || content[key].trim().length < minimum)) layerErrors += 1;
  if (!Array.isArray(content.keywords) || content.keywords.length < 5 || !Array.isArray(content.symbols) || content.symbols.length < 5) layerErrors += 1;
  if (!Array.isArray(content.combinations) || content.combinations.length < 3 || content.combinations.some(item => !item?.with || !item?.reading || item.reading.length < 80)) combinationErrors += 1;
}
check('78 cartas têm conteúdo profundo em todas as camadas', layerErrors === 0, `falhas: ${layerErrors}`);
check('78 cartas têm ao menos três combinações relevantes', combinationErrors === 0, `falhas: ${combinationErrors}`);

const knownNames = new Set(CARDS.map(card => card.name));
check('todas as combinações apontam para cartas existentes', contentCards.every(content => content.combinations.every(item => knownNames.has(item.with))));
check('mensagens centrais são próprias e únicas', new Set(contentCards.map(content => content.centralMessage)).size === 78);
check('essências são próprias e únicas', new Set(contentCards.map(content => content.essence)).size === 78);
check('avisos responsáveis estão presentes nas 78 cartas', contentCards.every(content => content.responsibleNotice.length >= 140));

const validation = source?.validate?.();
check('validação interna do conteúdo-mãe foi aprovada', validation?.ok === true, validation?.errors?.join('; ') ?? 'indisponível');

let engineErrors = 0;
for (const card of CARDS) {
  const interpreted = engine.meaning(card, true);
  if (!interpreted || interpreted.orientation !== 'normal' || interpreted.sourceId !== idFor(card) || interpreted.combinations.length < 3 || !interpreted.responsibleNotice || interpreted.message !== source.get(idFor(card)).centralMessage) engineErrors += 1;
}
check('motor usa o conteúdo profundo para as 78 cartas', engineErrors === 0, `falhas: ${engineErrors}`);
check('motor bloqueia qualquer pedido de inversão', fs.readFileSync(path.join(root, 'meaning-engine.js'), 'utf8').includes('reversed=false;'));

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const appVersion = Number(index.match(/app\.js\?v=(\d+)/)?.[1] ?? 0);
check('navegador recebe o novo conteúdo sem cache antigo', appVersion >= 80, `versão: ${appVersion}`);
check('conteúdo-mãe permanece disponível offline', sw.includes("'./tarot-meanings.js'") && sw.includes("'./meaning-engine.js'"));

const wordCount = contentCards.reduce((total, content) => total + expectedSchema.reduce((sum, key) => {
  const value = content[key];
  if (Array.isArray(value)) return sum + JSON.stringify(value).split(/\s+/).length;
  return sum + String(value).split(/\s+/).length;
}, 0), 0);
check('base editorial possui profundidade substancial', wordCount > 60000, `aproximadamente ${wordCount.toLocaleString('pt-BR')} palavras`);

for (const result of results) console.log(`${result.pass ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
const passed = results.filter(result => result.pass).length;
console.log(`\n${passed}/${results.length} verificações aprovadas.`);
if (passed !== results.length) process.exitCode = 1;
else console.log('Conteúdo-Mãe V5 aprovado: 78 cartas profundas, responsáveis e exclusivamente normais.');
