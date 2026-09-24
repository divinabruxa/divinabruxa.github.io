import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CONFIG } from '../data/config.js';
import { CONSULTATION_SERVICES } from '../data/consultations.js';
import { MUSIC_RELEASES } from '../data/media.js';
import { CREDIT_PACKS, PLANS } from '../data/plans.js';
import { SKINS } from '../data/skins.js';
import { amazonSearchUrl, STORE_PRODUCTS } from '../data/store.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => readFile(path.join(root, relative), 'utf8');

test('Encontro e Criações possuem sete seções reais e controladores ligados', async () => {
  const [html, app] = await Promise.all([read('index.html'), read('app.js')]);
  for (const [route, section, controller] of [
    ['consultas','consultations','consultations'], ['premium','premium','premium'], ['conta','account','account'],
    ['loja','store','store'], ['musica','music','music'], ['videos','videos','videos'], ['skins','skins','skins']
  ]) {
    assert.match(html, new RegExp(`id="${section}"[^>]+data-world="${route}"`), route);
    assert.match(app, new RegExp(`if \\(next === '${route}'\\) ${controller}\\.activate\\(\\)`), route);
  }
  assert.doesNotMatch(html, /Travessia protegida[\s\S]+conteúdo real será migrado/);
});

test('a Consulta preserva quatro serviços e os quatro valores oficiais', () => {
  assert.equal(CONSULTATION_SERVICES.length, 4);
  assert.deepEqual(CONSULTATION_SERVICES.map(service => service.priceCents), [25000,20000,15000,5000]);
  assert.equal(new Set(CONSULTATION_SERVICES.map(service => service.id)).size, 4);
  assert.match(CONFIG.consultationsEndpoint, /^https:\/\/kyphdsamyygavmkzyezr\.supabase\.co\/functions\/v1\/consultations-booking$/);
});

test('a Consulta reserva um horário real antes de criar o protocolo', async () => {
  const source = await read('worlds/consultations.js');
  assert.match(source, /action:'hold'/);
  assert.match(source, /holdToken/);
  assert.match(source, /slotStartAt/);
  assert.match(source, /SLOT_UNAVAILABLE/);
  assert.match(source, /HOLD_EXPIRED/);
});

test('Premium não abre cobrança real e mantém os valores canônicos', () => {
  assert.equal(CONFIG.environment, 'staging');
  assert.equal(CONFIG.realBilling, false);
  assert.deepEqual(PLANS.map(plan => plan.priceCents), [0,19990,8990]);
  assert.deepEqual(CREDIT_PACKS.map(pack => [pack.credits,pack.priceCents]), [[200,3990],[600,9990],[1500,19990]]);
});

test('a Loja possui 21 escolhas únicas e links afiliados transparentes', () => {
  assert.equal(STORE_PRODUCTS.length, 21);
  assert.equal(new Set(STORE_PRODUCTS.map(product => product.id)).size, 21);
  const url = new URL(amazonSearchUrl('tarot rider waite português', CONFIG.amazonAssociateTag));
  assert.equal(url.hostname, 'www.amazon.com.br');
  assert.equal(url.searchParams.get('tag'), 'orbedasrealid-20');
  assert.equal(url.searchParams.get('k'), 'tarot rider waite português');
});

test('Música contém somente os dois álbuns oficiais verificados', () => {
  assert.deepEqual(MUSIC_RELEASES.map(album => album.id), ['0GwJtJujeS9iwSZFADcL1k','4mq0UaLMXK21JbrKMFdhdO']);
  assert.deepEqual(MUSIC_RELEASES.map(album => album.tracks), [10,8]);
});

test('as 30 skins têm identidade única e miniaturas leves', async () => {
  assert.equal(SKINS.length, 30);
  assert.equal(new Set(SKINS.map(skin => skin.id)).size, 30);
  assert.deepEqual([...new Set(SKINS.map(skin => skin.priceCents))], [0,1990,2990,3990,4990]);
  const files = (await readdir(path.join(root,'assets','skins'))).filter(file => file.endsWith('.webp'));
  assert.equal(files.length, 30);
  let total = 0;
  for (const skin of SKINS) {
    const info = await stat(path.join(root,'assets','skins',skin.image));
    total += info.size;
    assert.ok(info.size < 60_000, `${skin.image} está pesada`);
  }
  assert.ok(total < 1.5 * 1024 * 1024, `miniaturas somam ${total} bytes`);
});

test('Conta guarda sessão apenas na aba e nenhum segredo de servidor entra no cliente', async () => {
  const [account, config, videos] = await Promise.all([read('worlds/account.js'),read('data/config.js'),read('worlds/videos.js')]);
  assert.match(account, /sessionStorage/);
  assert.doesNotMatch(account, /localStorage/);
  assert.match(account, /escapeHTML\(name\)/);
  assert.match(account, /escapeHTML\(user\?\.email/);
  assert.match(account, /session && user && !recoverySession/);
  assert.doesNotMatch(`${account}\n${config}\n${videos}`, /service[_-]?role|SUPABASE_SERVICE_ROLE_KEY|sb_secret_/i);
});

test('Vídeos exige gesto, limita o player e possui estúdio de publicação', async () => {
  const [html, videos] = await Promise.all([read('index.html'),read('worlds/videos.js')]);
  assert.match(html, /id="videosApp"/);
  assert.match(videos, /PUBLICAR (?:MEU PRIMEIRO )?MEMOJI/);
  assert.match(videos, /data-memoji-form/);
  assert.match(videos, /prepare_upload/);
  assert.match(videos, /Tus-Resumable/);
  assert.doesNotMatch(videos, /\.autoplay\s*=\s*true|autoplay="true"|<video[^>]+autoplay/);
});
