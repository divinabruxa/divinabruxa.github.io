/* DIVINA BRUXA — CATÁLOGO DE CONSULTAS E LOJA V9 */
export const OPERATIONS_EMAIL='orbedasrealidades@hotmail.com';
export const CONSULTATIONS=Object.freeze({
  mesaReal:Object.freeze({id:'mesa-real-profissional',name:'Mesa Real Profissional',priceBRL:250}),
  pensamentos:Object.freeze({id:'leitura-mentes',name:'Leitura de Mentes',priceBRL:150}),
  conselho:Object.freeze({id:'carta-conselho',name:'Carta de Conselho',priceBRL:100}),
  pergunta:Object.freeze({id:'pergunta-direta',name:'Pergunta Direta',priceBRL:50})
});
export const REQUIRED_FIELDS=Object.freeze(['name','email','phone','service','question']);
export const CONSULTATION_STATUS=Object.freeze(['received','under-review','reply-by-email','scheduled','closed']);
export const validateConsultation=form=>Boolean(form&&REQUIRED_FIELDS.every(field=>String(form[field]??'').trim())&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(form.email).trim())&&Object.values(CONSULTATIONS).some(item=>item.id===form.service));
export const storeDisclosure='A Divina Bruxa pode receber comissão por compras qualificadas em links de afiliados. O preço para você não muda.';
export const createConsultationRequest=form=>{const service=Object.values(CONSULTATIONS).find(item=>item.id===form?.service);return validateConsultation(form)?Object.freeze({...form,status:'received',operationsEmail:OPERATIONS_EMAIL,price_snapshot:Object.freeze({serviceId:service.id,priceBRL:service.priceBRL,currency:'BRL',capturedAt:new Date().toISOString()}),createdAt:new Date().toISOString()}):null;};
