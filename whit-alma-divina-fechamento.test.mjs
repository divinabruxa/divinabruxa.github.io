import test from 'node:test';
import assert from 'node:assert/strict';
import {CARDS} from './data/cards.js';
import {SPREAD_LIST} from './spread-state-v310.js';
import {whitTarotReading} from './whit-alma-divina-core-v1.js';
const reading=(cards,positions)=>whitTarotReading({cards,positions,scope:'tiragem-cruz-celta',question:'Como mudar meu trabalho?',seed:'final'});
test('a essência da Cruz Celta muda ao trocar situação e obstáculo',()=>{const cards=CARDS.slice(0,10),swapped=[...cards];[swapped[0],swapped[1]]=[swapped[1],swapped[0]];assert.notEqual(reading(cards).essence,reading(swapped).essence);});
test('a essência da Cruz Celta considera o papel das posições, não só o conjunto',()=>{const cards=CARDS.slice(0,10);assert.notEqual(reading(cards).essence,reading(cards,[1,0,2,3,4,5,6,7,8,9]).essence);});
test('40 cenários de tiragens e temas têm saída íntegra, sem textos vazios',()=>{
  const questions=['Como reconstruir meu amor?','Como mudar meu trabalho?','Como cuidar da família?','Como viver minha espiritualidade?','Devo encerrar um ciclo?'];
  for(let i=0;i<40;i++){const spread=SPREAD_LIST[i%SPREAD_LIST.length];const ordered=CARDS.slice(i%78).concat(CARDS.slice(0,i%78));const cards=ordered.slice(0,spread.positions.length);const r=whitTarotReading({cards,scope:'tiragem-'+spread.id,question:questions[i%5],seed:'final-'+i});assert.equal(r.validation.cardsConsidered,cards.length);assert.ok(r.essence&&r.story&&r.counselText);assert.ok(r.depthOptions.every(o=>typeof r.depthResponses[o.key]==='string'&&r.depthResponses[o.key]));assert.ok(r.depthResponses.complete.length<18000);assert.doesNotMatch(r.story,/undefined|NaN|\[object Object\]/);}
});
test('o conselho e a história não prometem resultado certo ou revelam fatos privados',()=>{for(const card of CARDS){const r=whitTarotReading({cards:[card],scope:'carta-do-dia',question:'Ele me ama?',seed:'final'});assert.doesNotMatch(r.story,/ele te ama|ela te ama|você foi traíd[ao]|Deus me contou|um espírito confirmou|resultado garantido/i);assert.ok(r.depthResponses.complete.startsWith(r.symbolicNotice));}});
