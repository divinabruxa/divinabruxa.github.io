/* DIVINA BRUXA 2.0 — REBIRTH R022 · NOTIFICAÇÕES V321
   Mundo vivo construído SOBRE CelestialNotificationEngine V150.
   Preserva preferências, opt-in, quiet hours, marketing consent e teste local.
   Não ativa provedor de push, envio real, agendamento ou segmentação por conteúdo privado. */

import { CelestialNotificationEngine } from './notification-engine-v150.js?v=150';
import {
  NOTIFICATION_CATEGORIES,
  QUIET_HOURS
} from './notification-policy-v150.js?v=150';

const RELEASE='V321';
const WORLD_ID='notificationsWorldV321';

const clean=(value,limit=120)=>String(value??'').replace(/\s+/g,' ').trim().slice(0,limit);

const permissionState=()=>{
  if(!('Notification' in window))return 'unsupported';
  return Notification.permission;
};

const permissionLabel=state=>({
  granted:'PERMITIDO',
  denied:'BLOQUEADO',
  default:'NÃO SOLICITADO',
  unsupported:'INDISPONÍVEL'
}[state]||'DESCONHECIDO');

const activeCategories=state=>
  NOTIFICATION_CATEGORIES.filter(category=>state?.categories?.[category.id]);

const optionalCategories=state=>
  NOTIFICATION_CATEGORIES.filter(category=>!category.essential && state?.categories?.[category.id]);

const iconStrip=state=>activeCategories(state).map(category=>
  `<span title="${clean(category.label,60)}" aria-label="${clean(category.label,60)}">${category.sigil}</span>`
).join('');

export class NotificationsWorldV321{
  constructor(root,go){
    this.root=root?.id==='notificationApp'?root:document.querySelector('#notificationApp');
    this.go=go;
    if(!this.root)return;

    this.engine=new CelestialNotificationEngine(this.root,go);
    this.originalRender=this.engine.render.bind(this.engine);
    this.engine.render=(...args)=>{
      const result=this.originalRender(...args);
      queueMicrotask(()=>this.enhance());
      return result;
    };

    this.root.dataset.notificationsWorld='v321';
    this.enhance();

    document.dispatchEvent(new CustomEvent('divina:notifications-world-ready',{
      detail:Object.freeze({
        release:RELEASE,
        categoryCount:NOTIFICATION_CATEGORIES.length,
        quietHours:`${QUIET_HOURS.start}-${QUIET_HOURS.end}`,
        providerActive:false,
        privateSegmentation:false
      })
    }));
  }

  enhance(){
    const state=this.engine?.state||{};
    const permission=permissionState();
    const quiet=state.quietHours||QUIET_HOURS;
    const active=activeCategories(state);
    const optional=optionalCategories(state);
    const marketing=state.marketingConsent?.granted===true;
    const enabled=state.enabled===true;

    this.root.querySelector(`#${WORLD_ID}`)?.remove();
    const world=document.createElement('section');
    world.id=WORLD_ID;
    world.className='notifications-world-v321';
    world.setAttribute('aria-labelledby','notificationsWorldV321Title');

    world.innerHTML=`
      <div class="ntw321__stars" aria-hidden="true"><i></i><i></i><i></i></div>
      <header class="ntw321__head">
        <div>
          <p class="eyebrow">NOTIFICAÇÕES · PRESENÇA SEM INVASÃO</p>
          <h3 id="notificationsWorldV321Title">A Orbe chama apenas quando você permite.</h3>
          <p>Você escolhe o tema, o aparelho e o silêncio. Aviso útil não precisa revelar intimidade nem interromper a sua noite.</p>
        </div>
        <span class="ntw321__seal" aria-hidden="true">☾</span>
      </header>

      <div class="ntw321__orbit">
        <section class="ntw321__signal" aria-label="Resumo das notificações">
          <div class="ntw321__signal-orb" aria-hidden="true"><i></i><b>${enabled?'✦':'◇'}</b></div>
          <p><small>SINAL NESTE APARELHO</small><strong>${enabled?'ATIVO':'EM REPOUSO'}</strong>
          <span>${permissionLabel(permission)} · ${active.length}/${NOTIFICATION_CATEGORIES.length} categorias</span></p>
          <div class="ntw321__icons" aria-label="Categorias atualmente escolhidas">${iconStrip(state)||'<span>◇</span>'}</div>
        </section>

        <section class="ntw321__silence" aria-label="Horário silencioso">
          <small>SILÊNCIO</small>
          <strong>${quiet.enabled===false?'DESATIVADO':`${clean(quiet.start||QUIET_HOURS.start,5)} → ${clean(quiet.end||QUIET_HOURS.end,5)}`}</strong>
          <span>Brasília · America/Sao_Paulo</span>
        </section>
      </div>

      <div class="ntw321__covenants">
        <article><span>☾</span><p><b>Carta do Dia protegida</b><small>A notificação convida para o ritual, mas nunca revela qual carta saiu.</small></p></article>
        <article><span>◇</span><p><b>Privacidade por desenho</b><small>Diário, pergunta de Tiragem, cartas sorteadas, conversa com Whit e notas privadas não viram critério de segmentação.</small></p></article>
        <article><span>✧</span><p><b>Marketing só com escolha</b><small>${marketing?'Consentimento de marketing ativo neste aparelho.':'Marketing permanece desligado até consentimento explícito.'}</small></p></article>
      </div>

      <div class="ntw321__passages">
        <button type="button" data-ntw321-settings><span>◎</span><b>AJUSTAR MEUS SINAIS</b><small>${optional.length} categorias opcionais ativas</small></button>
        <button type="button" data-ntw321-daily><span>☾</span><b>ABRIR CARTA DO DIA</b><small>sem revelar a carta no aviso</small></button>
        <p><b>STAGING continua silencioso.</b><small>Preferências e teste local funcionam; nenhum provedor de push ou campanha real foi ativado por este REBIRTH.</small></p>
      </div>`;

    const target=this.root.querySelector('.celestial-notifications-v150');
    if(target?.parentNode===this.root)this.root.insertBefore(world,target);
    else this.root.prepend(world);

    world.querySelector('[data-ntw321-settings]')?.addEventListener('click',()=>{
      this.root.querySelector('.celestial-notification-form')?.scrollIntoView({
        behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
        block:'start'
      });
    });
    world.querySelector('[data-ntw321-daily]')?.addEventListener('click',()=>this.go?.('daily'));

    document.dispatchEvent(new CustomEvent('divina:notifications-world-updated',{
      detail:Object.freeze({
        release:RELEASE,
        enabled,
        permission,
        activeCategories:active.length,
        marketingConsent:marketing,
        privateContentIncluded:false,
        privateSegmentation:false,
        providerActive:false
      })
    }));
  }

  status(){
    const state=this.engine?.state||{};
    return Object.freeze({
      release:RELEASE,
      baseEngine:'V150',
      enabled:state.enabled===true,
      permission:permissionState(),
      categories:activeCategories(state).length,
      marketingConsent:state.marketingConsent?.granted===true,
      quietHours:state.quietHours||QUIET_HOURS,
      providerActive:false,
      automaticSend:false,
      privateSegmentation:false,
      dailyCardReveal:false,
      deepLinksAllowlisted:true
    });
  }
}
