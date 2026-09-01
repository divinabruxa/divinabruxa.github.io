/* DIVINA BRUXA — CARTA DO DIA / CONTRATO EDITORIAL V9 */
export const DAILY_CONTRACT='v9.5';
export const DAILY_TIME_ZONE='America/Sao_Paulo';
export const DAILY_FIELDS=Object.freeze(['essence','light','tension','love','relationships','career','money','spirituality','advice','symbols','reflectionQuestion','action']);
export const brasiliaDate=(now=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:DAILY_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
export const dailyKey=(userId,date=brasiliaDate())=>`${String(userId||'anonymous').trim()}:${date}`;
export const isDailyRecordV9=(record,date=brasiliaDate())=>Boolean(record&&record.date===date&&Number.isInteger(record.id)&&record.id>=0&&record.id<78&&record.reversed!==true&&record.timeZone===DAILY_TIME_ZONE);
export const isEditorialEntry=entry=>Boolean(entry&&entry.orientation==='normal'&&DAILY_FIELDS.every(field=>typeof entry[field]==='string'||Array.isArray(entry[field])));
export const createDailyEnvelope=({record,editorial,source='local'}={})=>Object.freeze({contract:DAILY_CONTRACT,key:dailyKey(record?.userId,record?.date),record,editorial,source,generatedAt:new Date().toISOString()});
