#!/usr/bin/env node
/* Divina Bruxa — validação do Catálogo Canônico V5 — Checkpoint 1.1 */
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  CARDS,
  CARD_BY_CANONICAL_ID,
  CARD_BY_PTBR_NAME,
  CATALOG_SCHEMA_VERSION,
  REQUIRED_ORIENTATION,
  getCardByCanonicalId,
  getCardByIndex
} from './tarot-data.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const results = [];
const check = (name, condition, detail = '') => results.push({ name, pass: Boolean(condition), detail });
const unique = values => new Set(values).size === values.length;

check('schema do catálogo identificada', CATALOG_SCHEMA_VERSION === '5.0.1');
check('orientação oficial é normal', REQUIRED_ORIENTATION === 'normal');
check('catálogo contém exatamente 78 cartas', CARDS.length === 78, `encontradas: ${CARDS.length}`);
check('IDs numéricos seguem 0–77', CARDS.every((card, index) => card.id === index));
check('índices seguem 0–77', CARDS.every((card, index) => card.index === index));
check('atlasIndex cobre 0–77 sem repetição', unique(CARDS.map(card => card.atlasIndex)) && CARDS.every(card => card.atlasIndex >= 0 && card.atlasIndex <= 77));
check('IDs permanentes são únicos', unique(CARDS.map(card => card.canonicalId)));
check('nomes PT-BR são únicos', unique(CARDS.map(card => card.names?.ptBR)));
check('nomes EN são únicos', unique(CARDS.map(card => card.names?.en)));
check('nomes ES são únicos', unique(CARDS.map(card => card.names?.es)));
check('todas têm nome PT-BR', CARDS.every(card => typeof card.names?.ptBR === 'string' && card.names.ptBR.length > 1));
check('todas têm nome futuro EN', CARDS.every(card => typeof card.names?.en === 'string' && card.names.en.length > 1));
check('todas têm nome futuro ES', CARDS.every(card => typeof card.names?.es === 'string' && card.names.es.length > 1));
check('nome legado coincide com PT-BR', CARDS.every(card => card.name === card.names.ptBR));
check('primeira carta é O Louco', CARDS[0]?.name === 'O Louco');
check('última carta é Rei de Ouros', CARDS[77]?.name === 'Rei de Ouros');
check('22 Arcanos Maiores', CARDS.filter(card => card.arcanaCode === 'major').length === 22);
check('56 Arcanos Menores', CARDS.filter(card => card.arcanaCode === 'minor').length === 56);
check('14 cartas de Copas', CARDS.filter(card => card.suit === 'Copas').length === 14);
check('14 cartas de Espadas', CARDS.filter(card => card.suit === 'Espadas').length === 14);
check('14 cartas de Paus', CARDS.filter(card => card.suit === 'Paus').length === 14);
check('14 cartas de Ouros', CARDS.filter(card => card.suit === 'Ouros').length === 14);
check('todas as cartas estão normais', CARDS.every(card => card.orientation === 'normal'));
check('nenhuma propriedade sugere inversão', CARDS.every(card => !('reversed' in card) && !('orientationReversed' in card)));
check('todas têm elemento', CARDS.every(card => ['Ar', 'Água', 'Fogo', 'Terra'].includes(card.element)));
check('todas têm correspondências', CARDS.every(card => card.correspondences && Object.keys(card.correspondences).length >= 2));
check('todas têm caminho de imagem canônico HD', CARDS.every(card => card.image === `card-${String(card.atlasIndex).padStart(2, '0')}.webp`));
check('mapa por ID permanente contém 78 cartas', Object.keys(CARD_BY_CANONICAL_ID).length === 78);
check('mapa por nome PT-BR contém 78 cartas', Object.keys(CARD_BY_PTBR_NAME).length === 78);
check('busca por índice é íntegra', CARDS.every(card => getCardByIndex(card.index) === card));
check('busca por ID permanente é íntegra', CARDS.every(card => getCardByCanonicalId(card.canonicalId) === card));
check('catálogo está congelado', Object.isFrozen(CARDS) && CARDS.every(Object.isFrozen));

const imageChecks = await Promise.all(CARDS.map(async card => {
  try { await access(path.join(root, card.image)); return true; } catch { return false; }
}));
check('78 caminhos apontam para arquivos presentes', imageChecks.every(Boolean), `presentes: ${imageChecks.filter(Boolean).length}/78`);

for (const result of results) {
  console.log(`${result.pass ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
}

const passed = results.filter(result => result.pass).length;
console.log(`\n${passed}/${results.length} verificações aprovadas.`);
if (passed !== results.length) process.exitCode = 1;
else console.log('Catálogo Canônico V5 íntegro: 78 cartas normais, de O Louco a Rei de Ouros.');
