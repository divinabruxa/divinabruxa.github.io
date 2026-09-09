/* DIVINA BRUXA — CONSULTAS V200
   Política de atendimento alimentada pela verdade comercial única. */

import { COMMERCIAL_TRUTH_V200, commercialServiceById } from './commercial-truth-v200.js?v=200';

export const CONSULTATION_POLICY=Object.freeze({
  schemaVersion:'10.0.0',
  priceTableVersion:COMMERCIAL_TRUTH_V200.consultationPriceTableVersion,
  environment:'staging',
  realBilling:false,
  contactEmail:COMMERCIAL_TRUTH_V200.officialContact.email,
  channels:Object.freeze(['email']),
  phoneRequired:true,
  independentProducts:true,
  consumesAICredits:false,
  includedInPremium:false,
  timezone:'America/Sao_Paulo',
  tracking:Object.freeze({
    enabled:true,
    tokenStorage:'device-and-confirmation-email',
    publicStatuses:Object.freeze([
      Object.freeze({id:'received',label:'Recebida',detail:'A solicitação foi registrada com protocolo.'}),
      Object.freeze({id:'awaiting_confirmation',label:'Aguardando confirmação',detail:'A equipe está verificando disponibilidade e detalhes.'}),
      Object.freeze({id:'confirmed',label:'Confirmada',detail:'O atendimento foi confirmado pelo canal oficial.'}),
      Object.freeze({id:'completed',label:'Concluída',detail:'O atendimento foi finalizado.'}),
      Object.freeze({id:'cancelled',label:'Cancelada',detail:'A solicitação foi encerrada sem atendimento.'})
    ])
  }),
  services:COMMERCIAL_TRUTH_V200.services,
  safeguards:Object.freeze([
    'A solicitação não realiza cobrança automática.',
    'Consultas são atendimentos humanos separados do Premium e da Orbe IA.',
    'Nenhuma consulta consome créditos de IA.',
    'A leitura é simbólica e não substitui orientação médica, psicológica, jurídica ou financeira.',
    'Cada pedido preserva o valor exibido no momento da confirmação.',
    'O protocolo e o código privado permitem acompanhar apenas dados resumidos do pedido.'
  ])
});

export const consultationById=commercialServiceById;

export const consultationPriceSnapshot=(service,priceTableVersion=CONSULTATION_POLICY.priceTableVersion)=>Object.freeze({
  serviceId:service.id,
  serviceName:service.name,
  price:Number(service.priceCents)/100,
  priceCents:Number(service.priceCents),
  currency:'BRL',
  priceTableVersion:String(priceTableVersion||CONSULTATION_POLICY.priceTableVersion),
  capturedAt:new Date().toISOString()
});
