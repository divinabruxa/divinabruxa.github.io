#!/usr/bin/env node
/* Divina Bruxa — auditoria reproduzível da Mesa Real 13 × 6 — Checkpoint 2.2 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const engine = read('tarot-engine.js');
const css = read('tarot-table-v5.css');
const runtime = read('tarot-image-runtime.js');
const app = read('app.js');
const sw = read('sw.js');
const tarotSection = index.match(/<section id="tarot"[\s\S]*?<\/section>/)?.[0] ?? '';
const results = [];
const check = (name, condition, detail = '') => results.push({ name, pass: Boolean(condition), detail });

const { DECK_SIZE, createTarotState, drawNextCard } = await import(
  `${pathToFileURL(path.join(root, 'tarot-session.js')).href}?mesa=${Date.now()}`
);

check('folha exclusiva da Mesa Real está carregada', index.includes('tarot-table-v5.css?v=82'));
check('aplicativo recebeu a versão 82', index.includes('app.js?v=82') && app.includes('tarot-engine.js?v=82'));
check('cache identifica o Checkpoint 2.2', sw.includes('cp22-mesa-real'));
check('modo offline inclui a folha da mesa', sw.includes("'./tarot-table-v5.css'") && sw.includes("'./tarot-table-v5.css?v=82'"));

check('título declara 78 posições em 13 fileiras de 6', tarotSection.includes('78 posições · 13 fileiras de 6'));
check('Mesa Real usa semântica de grade', /id="realTable"[^>]*role="grid"/.test(tarotSection));
check('grade declara 13 fileiras', tarotSection.includes('aria-rowcount="13"'));
check('grade declara 6 colunas', tarotSection.includes('aria-colcount="6"'));
check('78 posições fecham exatamente 13 × 6', DECK_SIZE === 78 && 13 * 6 === DECK_SIZE);
check('motor cria sempre as 78 posições', engine.includes('Array.from({ length: DECK_SIZE }'));
check('motor calcula fileira a cada seis posições', engine.includes('Math.floor(index / 6) + 1'));
check('motor calcula coluna de 1 a 6', engine.includes('(index % 6) + 1'));
check('cada posição recebe coordenadas acessíveis', engine.includes('aria-rowindex="${row}"') && engine.includes('aria-colindex="${column}"'));
check('posições aguardando não são botões falsos', engine.includes('<div data-position="${index}" class="table-slot waiting"'));
check('posições aguardando são marcadas indisponíveis', engine.includes('aria-disabled="true"'));
check('somente cartas reveladas geram botão de ampliação', engine.includes('<button type="button" data-index="${index}"'));
check('as 78 posições continuam numeradas', engine.includes('<span class="position">${index + 1}</span>') && engine.includes('<span class="order">${index + 1}</span>'));

check('área própria de navegação horizontal existe', tarotSection.includes('id="realTableViewport"') && css.includes('.real-table-viewport'));
check('área da mesa aceita foco de teclado', tarotSection.includes('id="realTableViewport" class="real-table-viewport" tabindex="0"'));
check('deslizamento horizontal fica contido na mesa', css.includes('overscroll-behavior-x:contain') && css.includes('touch-action:pan-x pan-y'));
check('rolagem suave está ativa no modo normal', css.includes('scroll-behavior:smooth'));
check('Reduced Motion remove a rolagem animada', css.includes('@media(prefers-reduced-motion:reduce)') && css.includes('scroll-behavior:auto'));
check('desktop conserva seis colunas confortáveis', css.includes('grid-template-columns:repeat(6'));
check('mobile conserva seis colunas na mesma fileira', css.includes('--tarot-card-width:clamp(82px,23vw,96px)') && css.includes('repeat(6,var(--tarot-card-width))'));
check('mobile usa largura própria sem esmagar as cartas', css.includes('width:max-content') && css.includes('overflow-x:auto'));
check('modo compacto continua exatamente com seis colunas', css.includes('.real-table-viewport.is-compact .real-table') && css.includes('repeat(6,minmax(0,1fr))'));
check('usuária pode alternar mesa inteira e cartas ampliadas', tarotSection.includes('id="tableCompact"') && engine.includes("'Ampliar cartas' : 'Ver mesa inteira'"));
check('preferência visual da mesa é retomada', engine.includes("this.storage.get('free-tarot-table-compact'") && engine.includes("this.storage.set('free-tarot-table-compact'"));
check('controles laterais possuem nomes acessíveis', tarotSection.includes('Mover a mesa para a esquerda') && tarotSection.includes('Mover a mesa para a direita'));
check('setas do teclado percorrem a mesa', engine.includes("event.key !== 'ArrowLeft' && event.key !== 'ArrowRight'") && engine.includes('this.scrollTable'));
check('nova carta é centralizada horizontalmente', engine.includes('centerTablePosition(landing)') && engine.includes('this.viewport.scrollTo'));
check('controles de toque têm pelo menos 44 px', css.includes('min-width:44px') && css.includes('min-height:44px'));

check('ampliação usa dialog nativo', tarotSection.includes('<dialog id="cardLightbox"') && engine.includes('this.lightbox.showModal()'));
check('ampliação possui título e posição acessíveis', tarotSection.includes('aria-labelledby="lightboxTitle"') && tarotSection.includes('id="lightboxPosition"'));
check('ampliação fecha por botão e pelo fundo', engine.includes("this.lightboxClose.addEventListener('click'") && engine.includes('event.target === this.lightbox'));
check('ampliação permite carta anterior e próxima', tarotSection.includes('id="lightboxPrev"') && tarotSection.includes('id="lightboxNext"'));
check('navegação ampliada respeita os limites revelados', engine.includes('nextIndex < 0 || nextIndex >= this.state.revealed.length'));
check('botões anterior e próximo são desativados nos extremos', engine.includes('this.lightboxIndex <= 0') && engine.includes('this.lightboxIndex >= this.state.revealed.length - 1'));
check('setas do teclado também navegam na ampliação', engine.includes('this.moveLightbox(event.key ==='));
check('foco retorna à carta após fechar', engine.includes('focusTarget?.focus?.({ preventScroll: true })'));
check('fundo da página não rola com ampliação aberta', css.includes('body.card-lightbox-open{overflow:hidden}'));

check('artes usam enquadramento proporcional sem corte', css.includes('object-fit:contain'));
check('artes nunca recebem rotação na nova mesa', css.includes('transform:none!important'));
const forbiddenClass = ['rev', 'ersed'].join('');
check('novo motor não contém caminho de inversão', !engine.includes(`.${forbiddenClass}`) && !engine.includes(`'${forbiddenClass}'`));
check('nova folha não contém classe de inversão', !css.includes(forbiddenClass));
check('ampliação identifica explicitamente carta direta', tarotSection.includes('DIRETA · SEM SIGNIFICADO'));
check('Tarot Livre continua sem motor de significados', !/(meaning-engine|tarot-meanings)/.test(engine));
check('imagem ampliada usa prioridade alta', engine.includes("priority: 'high'") && engine.includes('ampliada'));
check('runtime reserva dimensão HD 1024 × 1536', runtime.includes('width="1024" height="1536"'));
check('imagens da mesa continuam sob demanda', runtime.includes('loading="${eager ? \'eager\' : \'lazy\'}"'));
check('somente vizinhas da ampliação recebem preload', engine.includes('this.lightboxIndex - 1') && engine.includes('this.lightboxIndex + 1') && engine.includes('], 2)'));
check('baralho inteiro não é forçado no cache inicial', !sw.includes("'./card-00.webp'"));

let simulation = createTarotState({ randomInt: max => max - 1 });
let stablePositions = true;
for (let position = 0; position < DECK_SIZE; position += 1) {
  const result = drawNextCard(simulation);
  if (result.position !== position) stablePositions = false;
  simulation = result.state;
}
check('simulação ocupa sequencialmente as posições 1 a 78', stablePositions && simulation.revealed.length === 78);
check('simulação termina em 13 fileiras completas', simulation.revealed.length / 6 === 13);

for (const result of results) console.log(`${result.pass ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` — ${result.detail}` : ''}`);
const passed = results.filter(result => result.pass).length;
console.log(`\n${passed}/${results.length} verificações aprovadas.`);
if (passed !== results.length) process.exitCode = 1;
else console.log('Mesa Real aprovada: 13 × 6 estável, nítida, navegável e exclusivamente normal.');
