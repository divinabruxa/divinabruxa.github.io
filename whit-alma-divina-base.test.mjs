// Enviar à raiz do repositório. Executar: node --test whit-alma-divina-base.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CARDS } from './data/cards.js';
import { SPREAD_LIST } from './spread-state-v310.js';
import { WHIT_CARDS, whitCard, WHIT_THEME_AXES } from './whit-alma-divina-base-v1.js';
import { WHIT_SPREADS, whitPosition, royalNeighbors } from './whit-alma-divina-posicoes-v1.js';
import { whitRelation, contextualizeWhitCard, analyzeWhitLayout } from './whit-alma-divina-relacoes-v1.js';
const star=CARDS.find(c=>c.name==='A Estrela'),tower=CARDS.find(c=>c.name==='A Torre'),sun=CARDS.find(c=>c.name==='O Sol');

test('as 78 identidades existentes preservam ordem, elemento e orientação',()=>{
  assert.equal(WHIT_CARDS.length,78);
  for(const [i,c] of CARDS.entries()){
    const profile=whitCard(c);assert.equal(profile.canonicalId,c.canonicalId);assert.equal(profile.id,c.id);
    assert.equal(profile.name,c.name);assert.equal(profile.element,c.element);assert.equal(profile.orientation,'normal');
    assert.equal(WHIT_CARDS[i],profile);
  }
});
test('cada carta tem conteúdo editorial próprio e quatro dimensões',()=>{
  assert.equal(new Set(WHIT_CARDS.map(c=>c.scene)).size,78);
  assert.equal(new Set(WHIT_CARDS.map(c=>c.action)).size,78);
  for(const c of WHIT_CARDS){for(const key of ['scene','strength','tension','action','symbol'])assert.ok(typeof c[key]==='string'&&c[key].trim().length>0,`${c.name}: ${key}`);
    for(const d of ['love','mind','action','spirit'])assert.ok(c.dimensions[d].anchor);
    for(const theme of c.themes)assert.ok(WHIT_THEME_AXES[theme],theme);
  }
});
test('a base distingue dor, perda e ruptura de celebração',()=>{
  assert.ok(whitCard(tower).themes.includes('ruptura'));
  assert.ok(whitCard(sun).themes.includes('alegria'));
  assert.ok(WHIT_CARDS.find(c=>c.name==='3 de Espadas').themes.includes('dor'));
  assert.ok(WHIT_CARDS.find(c=>c.name==='5 de Copas').themes.includes('perda'));
});
test('identificadores desconhecidos e orientação invertida não são reinterpretados silenciosamente',()=>{
  assert.equal(whitCard({canonicalId:'inexistente',id:0}),null);
  assert.equal(whitCard({...star,orientation:'reversed'}),null);
  assert.throws(()=>analyzeWhitLayout({cards:[{id:999}],spreadId:'conselho'}),/canônico/);
});
test('dados editoriais e perfis são imutáveis em profundidade',()=>{
  assert.throws(()=>{WHIT_CARDS[0].dimensions.love.anchor='alterado';},TypeError);
  assert.throws(()=>{WHIT_CARDS[0].themes.push('alterado');},TypeError);
});
test('todas as 15 tiragens existentes têm posições e acesso preservados',()=>{
  assert.equal(Object.keys(WHIT_SPREADS).length,SPREAD_LIST.length);
  for(const s of SPREAD_LIST){const p=WHIT_SPREADS[s.id];assert.equal(p.access,s.access);
    assert.deepEqual(p.positions.map(x=>x.label),s.positions);for(const x of p.positions)assert.ok(x.task);
  }
});
test('a mesma carta em obstáculo e conselho desempenha funções diferentes',()=>{
  const obstacle=contextualizeWhitCard(star,whitPosition('cruz-celta','Desafio que atravessa'));
  const counsel=contextualizeWhitCard(star,whitPosition('conselho',0));
  assert.match(obstacle.functionText,/A tensão/);assert.equal(counsel.functionText,whitCard(star).action+'.');
  assert.notEqual(obstacle.functionText,counsel.functionText);
});
test('inverter posições de Três Tempos altera o papel narrativo',()=>{
  const a=analyzeWhitLayout({cards:[star,tower,sun],spreadId:'tres-tempos'});
  const b=analyzeWhitLayout({cards:[star,tower,sun],spreadId:'tres-tempos',positions:['Próximo movimento','Agora','Origem']});
  assert.equal(a.contexts[0].position.role,'past');assert.equal(b.contexts[0].position.role,'future');
  assert.notEqual(a.contexts[0].functionText,b.contexts[0].functionText);
  assert.equal(b.opening.card.canonicalId,sun.canonicalId);
});
test('relações são direcionais e identificam esperança, ruptura e clareza',()=>{
  assert.match(whitRelation(star,tower).narrative,/esperança.*estrutura/);
  assert.match(whitRelation(tower,sun).narrative,/clareza/);
  assert.notEqual(whitRelation(star,tower).narrative,whitRelation(tower,star).narrative);
});
test('Duas alternativas não viram uma sequência entre os caminhos A e B',()=>{
  const a=analyzeWhitLayout({cards:CARDS.slice(0,6),spreadId:'dois-caminhos'});
  assert.ok(!a.links.some(l=>l.fromPosition===2&&l.toPosition===3));
  assert.ok(a.links.some(l=>l.fromPosition===0&&l.toPosition===3));
  assert.ok(a.links.some(l=>l.fromPosition===4&&l.toPosition===5));
});
test('Mesa Real tem 6 linhas por 13 casas e não atravessa bordas',()=>{
  assert.deepEqual(royalNeighbors(12),[25,11]);assert.deepEqual(royalNeighbors(13),[0,26,14]);
  assert.equal(WHIT_SPREADS['mesa-real'].positions[77].row,6);
  assert.equal(WHIT_SPREADS['mesa-real'].positions[77].column,13);
  const a=analyzeWhitLayout({cards:CARDS,spreadId:'mesa-real'});
  assert.equal(a.links.length,137);assert.deepEqual(a.center.map(c=>c.position.index),[32,45]);
  assert.ok(!a.links.some(l=>l.fromPosition===12&&l.toPosition===13));
});
test('tiragem parcial só relaciona posições efetivamente presentes',()=>{
  const a=analyzeWhitLayout({cards:[star,tower],spreadId:'mesa-real',positions:[12,25]});
  assert.equal(a.links.length,1);assert.equal(a.links[0].fromPosition,12);assert.equal(a.links[0].toPosition,25);
});
test('Mandala liga o centro às casas, sem inventar ordem causal entre elas',()=>{
  const a=analyzeWhitLayout({cards:CARDS.slice(0,13),spreadId:'mandala-ano'});
  assert.equal(a.links.length,12);assert.ok(a.links.every(l=>l.fromPosition===0));
});
test('naipes, números repetidos, Maiores e corte são contexto correto',()=>{
  const a=analyzeWhitLayout({cards:[CARDS[22],CARDS[36],CARDS[50],CARDS[64]],spreadId:'tarot-livre'});
  assert.deepEqual(a.repeatedNumbers,[{number:1,count:4}]);assert.equal(a.majorCount,0);assert.equal(a.courtCount,0);
  assert.deepEqual(a.elements,{'Água':1,'Ar':1,'Fogo':1,'Terra':1});
  assert.equal(analyzeWhitLayout({cards:CARDS,spreadId:'mesa-real'}).majorCount,22);
  assert.equal(analyzeWhitLayout({cards:CARDS,spreadId:'mesa-real'}).courtCount,16);
});
test('entradas incoerentes são recusadas sem criar uma leitura',()=>{
  for(const args of [{cards:[],spreadId:'conselho'},{cards:[star,star],spreadId:'tarot-livre'},{cards:[star],spreadId:'desconhecida'},
    {cards:[star,tower],spreadId:'tres-tempos',positions:[0]}, {cards:[star,tower],spreadId:'tres-tempos',positions:[0,0]}])assert.throws(()=>analyzeWhitLayout(args),TypeError);
  assert.throws(()=>whitPosition('cruz-celta','posição inventada'),TypeError);
});
test('Carta do Dia não interpreta a data como posição tarológica',()=>{
  assert.equal(whitPosition('carta-do-dia',0).label,'Hoje');
  assert.throws(()=>whitPosition('carta-do-dia','2026-10-10'),TypeError);
});
test('novos módulos não importam motores narrativos antigos ou APIs externas',async()=>{
  for(const name of ['whit-alma-divina-base-v1.js','whit-alma-divina-posicoes-v1.js','whit-alma-divina-relacoes-v1.js']){
    const source=await readFile(new URL(name,import.meta.url),'utf8');
    const dependencies=[...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(m=>m[1]);
    assert.ok(dependencies.every(d=>d.startsWith('./whit-alma-divina-')||['./data/cards.js','./spread-state-v310.js'].includes(d)));
    assert.doesNotMatch(source,/\bfetch\s*\(|localStorage|document\.|window\./);
  }
});
