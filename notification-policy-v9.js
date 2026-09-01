/* DIVINA BRUXA — NOTIFICAÇÕES RESPONSÁVEIS V9 */
export const QUIET_HOURS=Object.freeze({start:22,end:8,timeZone:'America/Sao_Paulo'});
export const CATEGORIES=Object.freeze(['daily-card','school','consultations','account-security','billing','orbe-ai','music','episodes','skins','marketing']);
export const DEFAULT_NOTIFICATION_PREFERENCES=Object.freeze({dailyCard:true,school:true,consultations:true,accountSecurity:true,billing:true,orbeAI:true,music:true,episodes:true,skins:true,marketing:false});
export const isQuietHour=(hour,timezone=QUIET_HOURS.timeZone)=>{const h=Number(hour);return Number.isInteger(h)&&(h>=QUIET_HOURS.start||h<QUIET_HOURS.end)};
export const canSendNotification=({category,marketingOptIn=false,hour=new Date().getHours()}={})=>Boolean(CATEGORIES.includes(category)&&(!isQuietHour(hour)||category==='account-security'||category==='billing')&&(category!=='marketing'||marketingOptIn));
export const safeDailyMessage='Sua Carta do Dia espera por você na Orbe.';
export const safeDeepLink=path=>typeof path==='string'&&/^#(?:daily|tarot|school|music|videos|consultations)$/.test(path)?path:'#daily';
