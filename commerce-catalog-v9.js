/* DIVINA BRUXA — CATÁLOGO DE CONSULTAS E LOJA V9 */
export const OPERATIONS_EMAIL='orbedasrealidades@hotmail.com';
export const CONSULTATIONS=Object.freeze({
  mesaReal:Object.freeze({id:'mesa-real-profissional',name:'Mesa Real Profissional',priceBRL:500}),
  pensamentos:Object.freeze({id:'leitura-de-pensamentos',name:'Leitura de Pensamentos',priceBRL:500}),
  conselho:Object.freeze({id:'carta-de-conselho',name:'Carta de Conselho',priceBRL:300}),
  pergunta:Object.freeze({id:'pergunta',name:'Pergunta',priceBRL:150})
});
export const REQUIRED_FIELDS=Object.freeze(['name','email','phone','service','question']);
export const CONSULTATION_STATUS=Object.freeze(['received','under-review','reply-by-email','scheduled','closed']);
export const validateConsultation=form=>Boolean(form&&REQUIRED_FIELDS.every(field=>String(form[field]??'').trim())&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(form.email).trim())&&Object.values(CONSULTATIONS).some(item=>item.id===form.service));
export const storeDisclosure='A Divina Bruxa pode receber comissão por compras qualificadas em links de afiliados. O preço para você não muda.';
export const createConsultationRequest=form=>validateConsultation(form)?Object.freeze({...form,status:'received',operationsEmail:OPERATIONS_EMAIL,createdAt:new Date().toISOString()}):null;
