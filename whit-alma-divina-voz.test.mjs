import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CARDS } from './data/cards.js';
import { whitTarotReading, storyResponse } from './whit-alma-divina-core-v1.js';
const trio=[CARDS[17],CARDS[16],CARDS[19]];
const sample=changes=>whitTarotReading({cards:trio,scope:'tiragem-tres-tempos',question:'Como reconstruir meu relacionamento?',seed:'voz',...changes});
test('a voz produz narrativa extensa e essência separada para as 78 cartas',()=>{
  for(const card of CARDS){const r=whitTarotReading({cards:[card],scope:'carta-do-dia',seed:'voz'});assert.ok(r.story.split(/\s+/).length>=250);assert.ok(r.story.length>r.essence.length);assert.ok(r.voiceProfile.version==='1.1.0');}
});
test('a história preserva seis ou mais parágrafos sem repetir parágrafos inteiros',()=>{const r=sample();assert.ok(r.paragraphs.length>=6);assert.equal(new Set(r.paragraphs).size,r.paragraphs.length);});
test('a narrativa principal não lista nomes e definições das cartas',()=>{
  const r=sample();for(const card of trio)assert.ok(!r.story.includes(card.name));assert.match(r.story,/esperança encontra uma estrutura/);assert.match(r.story,/Depois de uma quebra/);
});
test('a relação Estrela, Torre e Sol conserva tensão e clareza, sem positividade forçada',()=>{const r=sample();assert.match(r.story,/ruptura|desgaste|quebra/);assert.match(r.story,/clareza/);assert.doesNotMatch(r.story,/tudo vai dar certo|felicidade garantida/i);});
test('troca de carta, pergunta, intenção e posição muda a história',()=>{
  const baseline=sample().story;for(const changes of [{cards:[CARDS[17],CARDS[14],CARDS[19]]},{question:'Como reconstruir meu trabalho?'},{question:'Devo encerrar meu relacionamento?'},{positions:['Próximo movimento','Agora','Origem']}])assert.notEqual(sample(changes).story,baseline);
});
test('as variações de seed mudam a voz sem mudar o conselho ou tema',()=>{
  const variants=Array.from({length:18},(_,i)=>sample({seed:'voz-'+i}));assert.ok(new Set(variants.map(r=>r.story)).size>=4);assert.equal(new Set(variants.map(r=>r.counselText)).size,1);assert.equal(new Set(variants.map(r=>r.topic)).size,1);
});
test('amor, mente e espiritualidade mudam conforme a carta e não são só metadados',()=>{
  const a=whitTarotReading({cards:[CARDS[17]],scope:'carta-do-dia'}),b=whitTarotReading({cards:[CARDS[16]],scope:'carta-do-dia'});
  for(const dim of ['love','mind','spirit','action'])assert.notEqual(a.depthResponses[dim],b.depthResponses[dim]);
});
test('cada aprofundamento pertence ao conteúdo da história principal',()=>{const r=sample();for(const key of ['love','mind','spirit','action'])assert.ok(r.story.includes(r.depthResponses[key]));});
test('o conselho concretiza a direção sem prometer resultados',()=>{const r=sample();assert.ok(r.depthResponses.action.includes(r.counselText));assert.match(r.tendencyText,/sem garantir/);});
test('tema amor aborda reciprocidade sem declarar pensamentos privados',()=>{
  const r=sample({question:'Ele me ama e vai voltar?'});assert.equal(r.topic,'love');assert.match(r.story,/reciprocidade/);assert.doesNotMatch(r.story,/ele te ama|ele vai voltar|ela te ama|ela vai voltar/i);
});
test('a transparência simbólica abre o texto completo sem virar sua biografia',()=>{const r=sample();assert.ok(r.depthResponses.complete.startsWith(r.symbolicNotice));assert.match(r.story,/imagine/);assert.doesNotMatch(r.story,/Deus me contou|um espírito confirmou|você foi traíd[ao]/i);});
test('reflexões finais não são sempre iguais entre cartas',()=>{
  const endings=CARDS.map(card=>whitTarotReading({cards:[card],scope:'carta-do-dia',seed:'fim-'+card.id}).closing);assert.ok(new Set(endings).size>=10);
});
test('o gateway preserva a determinabilidade mesmo com voz variada',()=>{assert.deepEqual(sample(),sample());});
test('a conversa continua uma mesa da versão anterior sem sortear outra carta',()=>{
  const a=storyResponse('A Estrela e O Sol para o amor',{seed:'old'});const old={...a.consultationContext,version:'alma-divina-1.0.0'};
  const b=storyResponse('Qual atitude?',{consultationContext:old});assert.deepEqual(b.consultationContext.canonicalIds,a.consultationContext.canonicalIds);assert.equal(b.consultationContext.seed,a.consultationContext.seed);
});
test('uma intenção nova no acompanhamento é incorporada à pergunta original',()=>{
  const a=storyResponse('A Estrela: como reconstruir meu relacionamento?',{seed:'context'});
  const b=storyResponse('Devo encerrar?',{consultationContext:a.consultationContext});
  assert.deepEqual(b.consultationContext.canonicalIds,a.consultationContext.canonicalIds);assert.match(b.text,/procura um encerramento/);
});
test('textos da Whit cabem no limite de mensagem ampliado e não são cortados em quatro mil caracteres',async()=>{
  const source=await readFile(new URL('whit-world-v401.js',import.meta.url),'utf8');assert.match(source,/clean\(item.text, 18000\)/);
  const long=whitTarotReading({cards:CARDS,scope:'tiragem-mesa-real'}).depthResponses.complete;assert.ok(long.length<18000);
});
test('núcleo e cache carregam a voz nova sem importar o compositor antigo',async()=>{
  const core=await readFile(new URL('whit-alma-divina-core-v1.js',import.meta.url),'utf8');assert.match(core,/writeWhitNarrative\(\{layout,topic,intent,seed\}\)/);assert.doesNotMatch(core,/function compose\(/);
  const sw=await readFile(new URL('sw.js',import.meta.url),'utf8');assert.ok(sw.includes('./whit-alma-divina-voz-v1.js'));
});
test('fragmentos de junção não expõem construções de artigo quebradas',()=>{
  for(const card of CARDS){const r=whitTarotReading({cards:[card,CARDS[(card.id+1)%78]],scope:'tarot-livre'});assert.doesNotMatch(r.story,/\bde a luz\b|\bde o caminho\b|\bNo campo de os\b/);}
});
