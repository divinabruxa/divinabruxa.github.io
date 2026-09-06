/* DIVINA BRUXA — ENTITLEMENTS PREMIUM V142
   O estado local é somente sandbox; produção depende do servidor e de webhooks assinados. */

import { store } from './storage.js';
import { SKINS_V6, skinCatalogById, skinPackById } from './skin-catalog-v6.js?v=142';

export const PREMIUM_STATE_KEY='premium-entitlements-v142';
const LEGACY_KEY='billing-sandbox-v5';
const createId=prefix=>globalThis.crypto?.randomUUID?`${prefix}-${crypto.randomUUID()}`:`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
const validState=value=>['active','pending','grace','refunded','revoked','expired'].includes(value)?value:'unknown';

function seed(){
  const legacy=store.get(LEGACY_KEY,{});
  const legacyPremium=Array.isArray(legacy?.entitlements)&&legacy.entitlements.includes('premium');
  return {
    schemaVersion:'8.0.0',environment:'sandbox',revision:1,
    entitlements:{presence:'active',premium:legacyPremium?'active':'unknown','orbe-ia':'unknown'},
    skinIds:[],packIds:[],purchases:legacyPremium?[{id:createId('migration'),productId:'premium-one-time',kind:'migration',status:'active',environment:'sandbox',idempotencyKey:'migration:premium-v5',at:new Date().toISOString()}]:[],
    restoredAt:null,reconciliation:'local-sandbox'
  };
}

function normalize(value){
  if(!value||value.environment!=='sandbox'||!Array.isArray(value.purchases))return seed();
  const validSkinIds=[...new Set((Array.isArray(value.skinIds)?value.skinIds:[]).filter(id=>SKINS_V6.some(skin=>skin.id===id&&id!=='classic')))];
  const validPackIds=[...new Set((Array.isArray(value.packIds)?value.packIds:[]).filter(id=>Boolean(skinPackById(id))))];
  return {
    schemaVersion:'8.0.0',environment:'sandbox',revision:Math.max(1,Math.floor(Number(value.revision)||1)),
    entitlements:{presence:'active',premium:validState(value.entitlements?.premium),'orbe-ia':validState(value.entitlements?.['orbe-ia'])},
    skinIds:validSkinIds,packIds:validPackIds,
    purchases:value.purchases.filter(item=>item&&typeof item==='object').slice(-250).map(item=>({
      id:String(item.id||createId('purchase')).slice(0,160),productId:String(item.productId||'unknown').slice(0,160),kind:String(item.kind||'unknown').slice(0,40),status:validState(item.status),environment:'sandbox',idempotencyKey:String(item.idempotencyKey||createId('idem')).slice(0,180),at:Number.isNaN(new Date(item.at).getTime())?new Date().toISOString():new Date(item.at).toISOString()
    })),
    restoredAt:value.restoredAt&&!Number.isNaN(new Date(value.restoredAt).getTime())?new Date(value.restoredAt).toISOString():null,
    reconciliation:String(value.reconciliation||'local-sandbox').slice(0,80)
  };
}

const persist=next=>{store.set(PREMIUM_STATE_KEY,next);return premiumEntitlementState();};

export function premiumEntitlementState(){
  const existing=store.get(PREMIUM_STATE_KEY);
  const state=normalize(existing);
  if(!existing)store.set(PREMIUM_STATE_KEY,state);
  return Object.freeze({...state,entitlements:Object.freeze({...state.entitlements}),skinIds:Object.freeze([...state.skinIds]),packIds:Object.freeze([...state.packIds]),purchases:Object.freeze(state.purchases.map(item=>Object.freeze({...item})))});
}

export function hasEntitlement(id,state=premiumEntitlementState()){
  return id==='presence'||state.entitlements?.[id]==='active';
}

export function ownedSkinIds(state=premiumEntitlementState()){
  if(hasEntitlement('premium',state))return new Set(SKINS_V6.map(skin=>skin.id));
  const ids=new Set(['classic',...state.skinIds]);
  state.packIds.forEach(id=>skinPackById(id)?.skinIds.forEach(skinId=>ids.add(skinId)));
  return ids;
}

export function productForSandbox(kind,id){
  if(kind==='premium')return {kind,id:'premium',productId:'premium-one-time',name:'Divina Bruxa Premium',priceCents:19990};
  if(kind==='skin'){
    const skin=skinCatalogById(id);
    return skin.id!=='classic'?{kind,id:skin.id,productId:`skin-${skin.id}`,name:skin.name,priceCents:skin.priceCents}:null;
  }
  if(kind==='pack'){
    const pack=skinPackById(id);
    return pack?{kind,id:pack.id,productId:`skin-pack-${pack.id}`,name:pack.name,priceCents:pack.priceCents}:null;
  }
  return null;
}

export function simulateSandboxPurchase(kind,id){
  const product=productForSandbox(kind,id);
  if(!product)return {ok:false,reason:'invalid-product',state:premiumEntitlementState()};
  const current=premiumEntitlementState();
  const idempotencyKey=`sandbox:${product.productId}`;
  if(current.purchases.some(item=>item.idempotencyKey===idempotencyKey&&item.status==='active'))return {ok:true,duplicate:true,state:current,product};
  const next={...current,revision:current.revision+1,entitlements:{...current.entitlements},skinIds:[...current.skinIds],packIds:[...current.packIds],purchases:[...current.purchases]};
  if(kind==='premium')next.entitlements.premium='active';
  if(kind==='skin'&&!next.skinIds.includes(product.id))next.skinIds.push(product.id);
  if(kind==='pack'&&!next.packIds.includes(product.id))next.packIds.push(product.id);
  next.purchases.push({id:createId('purchase'),productId:product.productId,kind,status:'active',environment:'sandbox',idempotencyKey,at:new Date().toISOString()});
  next.reconciliation='sandbox-confirmed';
  return {ok:true,duplicate:false,state:persist(next),product};
}

export function cacheRemoteEntitlements({premium=false,premiumState='',skinIds=[]}={}){
  const current=premiumEntitlementState();
  const reconciledPremium=validState(premiumState||(premium?'active':'unknown'));
  const next={...current,revision:current.revision+1,entitlements:{...current.entitlements,premium:reconciledPremium},skinIds:[...new Set(skinIds)],packIds:[],purchases:[...current.purchases],restoredAt:new Date().toISOString(),reconciliation:'server-staging-authoritative'};
  return persist(normalize(next));
}

export function markSandboxRestore(){
  const current=premiumEntitlementState();
  return persist({...current,revision:current.revision+1,entitlements:{...current.entitlements},skinIds:[...current.skinIds],packIds:[...current.packIds],purchases:[...current.purchases],restoredAt:new Date().toISOString(),reconciliation:'local-sandbox-restored'});
}

export function resetPremiumSandbox(){
  const next=seed();
  next.entitlements.premium='unknown';
  next.purchases=[];
  next.reconciliation='local-sandbox-reset';
  store.set(PREMIUM_STATE_KEY,next);
  return premiumEntitlementState();
}
