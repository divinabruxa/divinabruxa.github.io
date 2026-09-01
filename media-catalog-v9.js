/* DIVINA BRUXA — CATÁLOGO DE MÚSICA E DE FRENTE COM O TAROT V9 */
export const MEDIA_STATUS=Object.freeze(['draft','review','scheduled','published','archived']);
export const MEDIA_TYPES=Object.freeze(['album','ep','single','season','episode']);
export const MEDIA_CATALOG=Object.freeze({
  music:Object.freeze({id:'music',title:'Música',items:[],platforms:['Spotify','YouTube Music']}),
  tarotFront:Object.freeze({id:'de-frente-com-o-tarot',title:'De Frente com o Tarot',seasons:[],platforms:['YouTube']})
});
export const isMediaEntry=entry=>Boolean(entry&&MEDIA_TYPES.includes(entry.type)&&MEDIA_STATUS.includes(entry.status||'draft')&&typeof entry.title==='string'&&entry.title.trim()&&typeof entry.description==='string'&&entry.description.trim()&&typeof entry.slug==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug));
export const createMediaEntry=input=>isMediaEntry(input)?Object.freeze({...input,status:input.status||'draft',updatedAt:new Date().toISOString()}):null;
export const publishMediaEntry=entry=>isMediaEntry(entry)&&entry.status==='review'?Object.freeze({...entry,status:'published',publishedAt:new Date().toISOString()}):null;
