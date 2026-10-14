/** Leituras estáveis por dia e histórico local de sequências. Não sorteia cartas. */
import { whitCard } from './whit-alma-divina-base-v1.js';
import { whitHash } from './whit-alma-divina-utils-v1.js';
const DAILY_PREFIX='divina-bruxa.whit.daily.snapshot.v1.';
const ARCHIVE_KEY='divina-bruxa.whit.tarot.sequence.history.v1';
const FIELDS=['title','essence','paragraphs','story','closing','heartline','whisper','tendencyText','counselText','depthOptions','depthResponses','signature','version','scope','spreadId','topic','intent','seed','consultationContext','symbolicNotice','provenance','engineProfile'];
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function compact(reading){
  if(!reading?.title||!reading?.essence||!reading?.depthResponses?.complete)throw new TypeError('Leitura incompleta.');
  return freeze(JSON.parse(JSON.stringify(Object.fromEntries(FIELDS.filter(k=>reading[k]!==undefined).map(k=>[k,reading[k]])))));
}
function validReading(reading,ids){return reading&&typeof reading.title==='string'&&typeof reading.essence==='string'&&typeof reading.story==='string'&&Array.isArray(reading.depthOptions)&&reading.depthOptions.every(o=>typeof o.key==='string'&&typeof o.label==='string')&&typeof reading.depthResponses?.complete==='string'&&Array.isArray(reading.consultationContext?.canonicalIds)&&JSON.stringify(reading.consultationContext.canonicalIds)===JSON.stringify(ids);}
function canonical(cards){
  if(!Array.isArray(cards)||cards.length<1||cards.length>78)throw new TypeError('Revele de 1 a 78 cartas.');
  const ids=cards.map(c=>{const card=whitCard(c);if(!card)throw new TypeError('Carta inválida.');return card.canonicalId;});
  if(new Set(ids).size!==ids.length)throw new TypeError('Cartas repetidas.');return ids;
}
export function sequenceIdentity(cards,question=''){
  if(typeof question!=='string'||question.length>700)throw new TypeError('Pergunta inválida.');
  return JSON.stringify({cards:canonical(cards),question:question.trim()});
}
export function createWhitSessions(storage){
  const memory=new Map(),durable=new Map(),parsed=new Map();
  function read(key){if(memory.has(key))return memory.get(key);try{const raw=storage?.getItem(key)||null;if(raw)memory.set(key,raw);return raw;}catch{return null;}}
  function write(key,value){memory.set(key,value);try{if(!storage?.setItem)throw new Error('Sem armazenamento.');storage.setItem(key,value);durable.set(key,true);return true;}catch{durable.set(key,false);return false;}}
  function parse(key,max){try{const raw=read(key);if(!raw||raw.length>max)return null;const cached=parsed.get(key);if(cached?.raw===raw)return cached.value;const value=JSON.parse(raw);parsed.set(key,{raw,value});return value;}catch{return null;}}
  function history(){
    const entries=parse(ARCHIVE_KEY,900000);
    return Array.isArray(entries)?entries.filter(e=>{
      try{return Array.isArray(e?.canonicalIds)&&e.id===sequenceIdentity(e.canonicalIds,e.question)&&validReading(e.reading,e.canonicalIds);}catch{return false;}
    }).slice(-8).map(e=>({...e,persisted:durable.get(ARCHIVE_KEY)??true})):[];
  }
  return Object.freeze({
    daily({dateKey,card,seed,generate}){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(dateKey))throw new TypeError('Data inválida.');
      const id=canonical([card])[0],key=DAILY_PREFIX+dateKey;
      const saved=parse(key,150000);
      if(saved?.dateKey===dateKey&&saved.canonicalId===id&&validReading(saved.reading,[id]))return freeze({...saved,persisted:durable.get(key)??true});
      const reading=compact(generate({cards:[card],scope:'carta-do-dia',positions:[dateKey],seed:seed||whitHash(dateKey+':'+id).toString(16)}));
      const record={dateKey,canonicalId:id,reading};const persisted=write(key,JSON.stringify(record));
      return freeze({...record,persisted});
    },
    sequence({cards,question='',generate}){
      const id=sequenceIdentity(cards,question),entries=history(),existing=entries.find(e=>e.id===id);
      if(existing)return freeze(existing);
      const ids=canonical(cards),reading=compact(generate({cards,positions:cards.map((_,i)=>i),scope:'tarot-livre',question:question.trim(),seed:whitHash(id).toString(16)}));
      const record={id,canonicalIds:ids,question:question.trim(),reading};
      const persisted=write(ARCHIVE_KEY,JSON.stringify([...entries,record].slice(-8)));
      return freeze({...record,persisted});
    },
    history:()=>freeze(history()),
    matches:(record,cards,question='')=>record?.id===sequenceIdentity(cards,question)
  });
}
