#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(process.argv[2] || path.dirname(fileURLToPath(import.meta.url)));
const TAG = '<meta name="google-site-verification" content="VJjhRxQ18euRcUn_hPcAtTNi5Dj-qX3kjr7-xzvAT8k">';
const BASELINE_INDEX_SHA256 = 'e68eeea6f2a30c7d1b47e5f422decfc2a7a0790182ac7c1d349c2ada5e59cbb7';
const failures = [];
const checks = [];

const check = (condition, label) => condition ? checks.push(label) : failures.push(label);
const read = (filename, required = true) => {
  const target = path.join(ROOT, filename);
  if (!fs.existsSync(target)) {
    if (required) failures.push(`arquivo presente: ${filename}`);
    return '';
  }
  return fs.readFileSync(target, 'utf8');
};
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const index = read('index.html');
const occurrences = index.split(TAG).length - 1;
const headEnd = index.indexOf('</head>');
const bodyStart = index.indexOf('<body');
const tagPosition = index.indexOf(TAG);
const baseline = index.replace(TAG, '');

check(occurrences === 1, 'Home: exatamente uma metatag oficial do Google');
check(tagPosition > 0 && tagPosition < headEnd && tagPosition < bodyStart, 'Home: metatag dentro do <head> e antes do <body>');
check(sha256(baseline) === BASELINE_INDEX_SHA256, 'Home: única alteração é a metatag oficial');
check(index.startsWith('<!doctype html><html lang="pt-BR"><head>'), 'Home: documento e idioma preservados');
check(index.includes('<title>Divina Bruxa — Tarot Livre, Carta do Dia e 78 Cartas</title>'), 'Home: título SEO preservado');
check(index.includes('<link rel="canonical" href="https://divinabruxa.com.br/">'), 'Home: canonical preservado');
check(index.includes('name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"'), 'Home: indexação permitida');
check(index.includes('href="https://divinabruxa.com.br/cartas-do-tarot.html"'), 'Home: biblioteca das 78 cartas preservada');
check(index.includes('app.js?v=152') && index.includes('sw.js?v=152'), 'Home: Guardião do Portal V152 preservado');
check(index.includes('78 cartas sem repetição') && index.includes('Somente as imagens'), 'Tarot Livre: contrato sem repetição e sem significado preservado');
check(index.includes('Mesa Real Profissional<small>R$ 250</small>'), 'Consultas: Mesa Real Profissional por R$ 250 preservada');
check(index.includes('Leitura de Mentes<small>R$ 150</small>'), 'Consultas: Leitura de Mentes por R$ 150 preservada');
check(index.includes('Carta de Conselho<small>R$ 100</small>'), 'Consultas: Carta de Conselho por R$ 100 preservada');
check(index.includes('Pergunta Direta<small>R$ 50</small>'), 'Consultas: Pergunta Direta por R$ 50 preservada');
check(!/<meta (?:property|name)="(?:og:image|twitter:)/.test(index), 'Home: nenhuma imagem social provisória adicionada');
check((index.match(/google-site-verification/g) || []).length === 1, 'Google: nenhum token duplicado ou provisório');

const manifestSource = read('SEARCH-CONSOLE-V155.json');
try {
  const manifest = JSON.parse(manifestSource);
  check(manifest.schemaVersion === '155.0.0', 'Manifesto: versão V155 correta');
  check(manifest.property === 'https://divinabruxa.com.br/', 'Manifesto: propriedade URL-prefix correta');
  check(manifest.verification?.method === 'html-tag', 'Manifesto: método Tag HTML registrado');
  check(manifest.verification?.metaTag === TAG, 'Manifesto: metatag idêntica à Home');
  check(manifest.status === 'prepared-awaiting-github-installation', 'Manifesto: instalação no GitHub ainda necessária');
  check(manifest.safeguards?.visualChanged === false && manifest.safeguards?.applicationChanged === false, 'Manifesto: visual e aplicativo protegidos');
} catch (error) {
  failures.push(`SEARCH-CONSOLE-V155.json: JSON válido (${error.message})`);
}

const sitemap = read('sitemap.xml', false);
if (sitemap) {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const images = [...sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map(match => match[1]);
  check(locs.length === 85 && new Set(locs).size === 85, 'Sitemap V154: 85 URLs únicas disponíveis');
  check(images.length === 78 && new Set(images).size === 78, 'Sitemap V154: 78 imagens oficiais disponíveis');
  check(locs.includes('https://divinabruxa.com.br/tarot-livre.html') && locs.includes('https://divinabruxa.com.br/consultas-de-tarot.html'), 'Sitemap V154: Tarot Livre e Consultas incluídos');
} else {
  checks.push('Pacote incremental: sitemap V154 permanece no site e não é duplicado');
}

console.log('DIVINA BRUXA · QA V155 · GOOGLE SEARCH CONSOLE');
console.log(`Diretório: ${ROOT}`);
console.log(`Verificações aprovadas: ${checks.length}`);
if (failures.length) {
  console.error(`Falhas: ${failures.length}`);
  failures.forEach(failure => console.error(`  ✗ ${failure}`));
  process.exit(1);
}
console.log('Resultado: APROVADO — tag oficial pronta e nenhuma alteração visual no site.');
