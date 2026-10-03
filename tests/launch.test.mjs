import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { CARDS } from '../data/cards.js';
import { normalizedRoute } from '../routes.js';
import { whitTarotReading } from '../whit-divine-soul-engine-v408.js';
import { positionedTarotCard } from '../whit-tarot-position-engine-v411.js';
import { soulConsultationForCard } from '../whit-tarot-soul-consultation-v419.js';

const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');
const sample = options => whitTarotReading({
  cards:[CARDS[17], CARDS[16], CARDS[19]],
  positions:['Presente', 'Obstáculo', 'Conselho'],
  question:'Como melhorar meu trabalho?', scope:'tiragem', seed:'launch-regression',
  ...options
});

test('links publicados antes do roteador atual entram na realidade correta', async () => {
  for (const [before, after] of Object.entries({
    daily:'carta-do-dia', spreads:'tiragens', school:'escola', consultations:'consultas',
    journal:'diario', library:'biblioteca', music:'musica', store:'loja', account:'conta'
  })) {
    assert.equal(normalizedRoute(`#${before}`), after);
    assert.equal(normalizedRoute(`#/${after}`), after);
  }
  assert.equal(normalizedRoute('#unknown'), 'home');
  const files = await readdir(new URL('../', import.meta.url));
  for (const file of files.filter(file => file.endsWith('.html'))) {
    for (const [, hash] of (await read(file)).matchAll(/href="\.\/(#[^"\s]+)"/g)) {
      if (hash === '#/home') continue;
      assert.notEqual(normalizedRoute(hash), 'home', `${file}: ${hash}`);
    }
  }
});

test('todas as 78 cartas produzem essência, tendência, conselho e aprofundamento', () => {
  const unique = new Set();
  for (const card of CARDS) {
    const reading = whitTarotReading({cards:[card], positions:['Presente'], scope:'carta-do-dia', seed:'same-seed'});
    assert.ok(reading.essence.includes(card.name));
    assert.ok(reading.essence.includes(reading.tendencyText));
    assert.ok(reading.essence.includes(reading.counselText));
    assert.ok(reading.depthResponses.complete.length > reading.essence.length);
    assert.equal(reading.soulConsultationProfile.cardsConsidered, 1);
    assert.ok(reading.essence.split(/(?<=[.!?])\s+/u).length <= 5);
    unique.add(reading.essence);
  }
  assert.equal(unique.size, 78);
  assert.equal(whitTarotReading(), null);
});

test('carta, ordem, posição e pergunta mudam a leitura com a mesma semente', () => {
  const baseline = sample();
  const mutations = [
    {cards:[CARDS[17], CARDS[18], CARDS[19]]},
    {cards:[CARDS[19], CARDS[16], CARDS[17]]},
    {positions:['Conselho', 'Presente', 'Obstáculo']},
    {question:'Como cuidar do meu relacionamento?'}
  ];
  for (const options of mutations) assert.notEqual(sample(options).essence, baseline.essence);
  assert.notEqual(sample(mutations[3]).counselText, baseline.counselText);
  assert.equal(sample().essence, baseline.essence);
});

test('a Mesa Real considera as 78 cartas e entrega síntese antes do aprofundamento', () => {
  const result = sample({cards:CARDS, positions:CARDS.map((_, i) => `Posição ${i + 1}`), scope:'tiragem-mesa-real'});
  assert.equal(result.soulConsultationProfile.cardsConsidered, 78);
  assert.ok(result.essence.split(/(?<=[.!?])\s+/u).length <= 7);
  assert.ok(result.depthOptions.some(option => option.key === 'complete'));
});

test('sinais dos motores mudam o conteúdo interpretado, não apenas metadados', () => {
  const entry = positionedTarotCard(CARDS[17], 'Presente');
  const baseline = soulConsultationForCard(entry, {human:{context:{hasContext:true,intent:'decision',territory:'decision'}}});
  const mind = soulConsultationForCard(entry, {
    human:{context:{hasContext:true,intent:'decision',territory:'decision'}},
    engineSignals:{mind:'Separe o fato do medo antes de responder.'}
  });
  assert.notDeepEqual(mind.visible.paragraphs, baseline.visible.paragraphs);
  const tendency = soulConsultationForCard(entry, {engineSignals:{tendency:'a escolha ganha clareza quando você verifica os fatos'}});
  assert.notEqual(tendency.visible.tendency, baseline.visible.tendency);
});

test('o chão offline inclui recursivamente as dependências da Whit e do roteador', async () => {
  const worker = await read('sw.js');
  const files = [...worker.split('self.addEventListener')[0].matchAll(/['"]\.\/([^'"]+)['"]/g)].map(match => match[1]);
  const included = new Set(files);
  for (const file of files.filter(file => file.endsWith('.js'))) {
    const source = await read(file);
    for (const [, relative] of source.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)) {
      const target = new URL(relative, new URL(`../${file}`, import.meta.url));
      const root = new URL('../', import.meta.url);
      assert.ok(included.has(target.pathname.slice(root.pathname.length)), `${file} → ${relative}`);
    }
  }
});

test('a Home apresenta identidade estruturada e caminhos sem JavaScript', async () => {
  const home = await read('index.html');
  const [, raw] = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const schema = JSON.parse(raw);
  assert.deepEqual(schema['@graph'].map(item => item['@type']), ['Organization', 'WebSite', 'WebPage']);
  assert.match(home, /<noscript>[\s\S]*href="cartas-do-tarot.html"[\s\S]*<\/noscript>/);
  assert.match(home, /og:image/);
});
