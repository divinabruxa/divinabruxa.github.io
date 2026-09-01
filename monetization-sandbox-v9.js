/* DIVINA BRUXA — CATÁLOGO DE MONETIZAÇÃO STAGING V9
   Somente configuração e regras. Nenhuma cobrança real é criada no navegador.
*/
export const BILLING_ENV='staging';
export const PRODUCTS=Object.freeze({
  premium:Object.freeze({id:'premium-one-time',mode:'payment',priceBRL:199.90,ai:false}),
  orbeIA:Object.freeze({id:'orbe-ia-monthly',mode:'subscription',priceBRL:89.90,credits:400}),
  credits200:Object.freeze({id:'orbe-ia-credits-200',mode:'payment',priceBRL:39.90,credits:200}),
  credits600:Object.freeze({id:'orbe-ia-credits-600',mode:'payment',priceBRL:99.90,credits:600}),
  credits1500:Object.freeze({id:'orbe-ia-credits-1500',mode:'payment',priceBRL:199.90,credits:1500})
});
export const AI_MODES=Object.freeze({luna:1,terra:10,sol:null});
export const BILLING_GATES=Object.freeze({production:false,realBilling:false,orbeSol:false,webhooks:false});
export const checkoutContract=({productId,clientToken}={})=>Object.freeze({environment:BILLING_ENV,productId,clientToken:clientToken||null,provider:'stripe-checkout',dynamicPaymentMethods:true,serverOnly:true});
export const canSpendCredits=(balance,mode)=>Number.isInteger(balance)&&balance>=0&&AI_MODES[mode]!==null&&balance>=AI_MODES[mode];
export const spendCredits=(balance,mode)=>canSpendCredits(balance,mode)?balance-AI_MODES[mode]:balance;
