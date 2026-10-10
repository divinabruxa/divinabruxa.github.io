// Raiz do repositório: node --test whit-alma-divina-*.test.mjs tests/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CARDS } from './data/cards.js';
import { SPREAD_LIST } from './spread-state-v310.js';
import { whitTarotReading, storyResponse, classifyWhitQuestion, classifyWhitIntent } from './whit-alma-divina-core-v1.js';
const star=CARDS[17],tower=CARDS[16],sun=CARDS[19];
const sample=overrides=>whitTarotReading({cards:[star,tower,sun],scope:'tiragem-tres-tempos',question:'Como reconstruir meu relacionamento?',seed:'same-seed',...overrides});
test('78 cartas geram textos distintos com história, atitude e aviso simbólico',()=>{
  const texts=new Set();for(const card of CARDS){const r=whitTarotReading({cards:[card],scope:'carta-do-dia',positions:['2026-10-10']});
    assert.ok(r.story.length>400);assert.ok(r.counselText);assert.ok(r.depthResponses.complete.includes(r.symbolicNotice));
    assert.equal(r.validation.cardsConsidered,1);assert.equal(r.engineProfile.legacyFallback,false);texts.add(r.essence);
  }assert.equal(texts.size,78);
});
test('mesmas entradas preservam texto e seed sem regeneração acidental',()=>{assert.deepEqual(sample(),sample());});
test('carta, posição, pergunta e intenção alteram o conteúdo',()=>{
  const a=sample();for(const mutation of [{cards:[star,CARDS[14],sun]}, {positions:['Próximo movimento','Agora','Origem']}, {question:'Como reconstruir meu trabalho?'},{question:'Devo encerrar meu relacionamento?'}])assert.notEqual(sample(mutation).essence,a.essence);
});
test('todas as tiragens existentes usam o novo núcleo e cobrem suas cartas',()=>{
  for(const spread of SPREAD_LIST){const r=whitTarotReading({cards:CARDS.slice(0,spread.positions.length),positions:spread.positions,scope:'tiragem-'+spread.id});assert.equal(r.validation.cardsConsidered,spread.positions.length);assert.equal(r.provenance.length,spread.positions.length);}
});
test('Mesa Real mantém 78 cartas e relações espaciais, com capítulos acessíveis',()=>{
  const r=whitTarotReading({cards:CARDS,scope:'tiragem-mesa-real'});assert.equal(r.analysis.links.length,137);assert.equal(r.provenance.length,78);assert.ok(r.depthResponses.positions.includes('Linha 6 · Casa 13'));
});
test('adaptadores aceitam posição atual do Tarot Livre, data diária e Biblioteca',()=>{
  assert.equal(whitTarotReading({cards:[star],scope:'tarot-livre',positions:['POSIÇÃO 7']}).analysis.contexts[0].position.index,6);
  assert.equal(whitTarotReading({cards:[star],scope:'carta-do-dia',positions:['CARTA DO DIA']}).spreadId,'carta-do-dia');
  assert.equal(whitTarotReading({cards:[star],scope:'biblioteca',positions:['ARCANO MAIOR']}).spreadId,'conselho');
});
test('entradas inválidas e idiomas não implementados não acionam fallback',()=>{
  assert.equal(whitTarotReading(),null);
  for(const args of [{cards:[],scope:'tarot-livre'},{cards:[star],scope:'tiragem-inventada'}, {cards:[star],scope:'tarot-livre',positions:['casa inexistente']},{cards:[star],language:'en'},{cards:[star,star]}])assert.throws(()=>whitTarotReading(args));
});
test('área Whit pede uma mesa antes de inventar detalhes pessoais',()=>{
  const r=storyResponse('Me conte minha vida');assert.equal(r.consultationContext,null);assert.ok(r.actions.some(a=>a.route==='tarot'));assert.match(r.text,/não vou inventar uma biografia/);
});
test('área Whit reconhece cartas nomeadas em ordem e evita sorteio implícito',()=>{
  const r=storyResponse('A Estrela, A Torre e O Sol: como reconstruir meu trabalho?',{seed:'fixed'});
  assert.deepEqual(r.consultationContext.canonicalIds,[star.canonicalId,tower.canonicalId,sun.canonicalId]);assert.equal(r.consultationContext.question,'A Estrela, A Torre e O Sol: como reconstruir meu trabalho?');
});
test('pedido explícito sorteia uma carta e acompanhamento conserva a mesa',()=>{
  const first=storyResponse('Tire uma carta para o amor',{seed:'fixed'});
  const next=storyResponse('E qual atitude posso tomar?',{consultationContext:first.consultationContext});
  assert.deepEqual(next.consultationContext.canonicalIds,first.consultationContext.canonicalIds);assert.equal(next.consultationContext.seed,first.consultationContext.seed);
  assert.ok(next.text.includes('Não revela fatos privados'));
});
test('nova carta nomeada substitui contexto antigo de forma explícita',()=>{
  const a=storyResponse('A Estrela');const b=storyResponse('O Sol',{consultationContext:a.consultationContext});assert.deepEqual(b.consultationContext.canonicalIds,[sun.canonicalId]);
});
test('acompanhamento no amor muda o enquadramento sem mudar as cartas',()=>{
  const a=storyResponse('A Estrela para meu trabalho');const b=storyResponse('E no amor?',{consultationContext:a.consultationContext});assert.deepEqual(b.consultationContext.canonicalIds,a.consultationContext.canonicalIds);assert.match(b.text,/reciprocidade/);assert.notEqual(b.text,a.text);
});
test('pedido explícito de dano imediato interrompe a ficção',()=>{
  const r=storyResponse('vou me matar',{consultationContext:storyResponse('A Estrela').consultationContext});assert.equal(r.safety,true);assert.equal(r.consultationContext,null);assert.match(r.text,/apoio humano/);assert.equal(r.storyCard,undefined);
});
test('pergunta tem assunto e intenção distintos',()=>{
  assert.equal(classifyWhitQuestion('Devo terminar meu relacionamento?'),'love');assert.equal(classifyWhitIntent('Devo terminar meu relacionamento?'),'ending');assert.equal(classifyWhitIntent('Quero reconstruir meu relacionamento'),'renewal');
});
test('todos os pontos ativos importam o novo núcleo e utilidades neutras',async()=>{
  for(const name of ['app.js','whit-world-v401.js']){const s=await readFile(new URL(name,import.meta.url),'utf8');assert.match(s,/from '.\/whit-alma-divina-core-v1.js'/);assert.doesNotMatch(s,/from '.\/(?:whit-divine-soul-engine-v408|arbitrio-engine-v370|matter-engine-v400).js'/);}
  const sw=await readFile(new URL('sw.js',import.meta.url),'utf8');for(const f of ['core','utils','base','posicoes','relacoes'])assert.ok(sw.includes('whit-alma-divina-'+f+'-v1.js'));
});
