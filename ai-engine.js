import { escapeHTML, store } from './storage.js';
import { AI_POLICY, aiDisclosure } from './ai-policy.js';
import { canSpend, creditState, grantCredits, spend } from './ai-credits.js';
import { JOURNAL_AI_SELECTION_KEY } from './journal-policy.js?v=140';

export class AIEngine {
  constructor(root, config) {
    this.root=root; this.config=config; this.chat=root.querySelector('#chat'); this.form=root.querySelector('#chatForm'); this.mode=root.querySelector('#aiMode'); this.persona=root.querySelector('#aiPersona'); this.history=store.get('whit-history',[]); this.ensureControls(); this.bind(); this.renderHistory(); this.prepareJournalSelection();
  }
  ensureControls(){
    if(!this.mode.querySelector('[value="sol"]')){const option=document.createElement('option');option.value='sol';option.textContent='Sol · expansão (indisponível)';option.disabled=true;this.mode.append(option);}
    const packs=(this.config.aiCredits||[]).map(pack=>`<button type="button" data-credit-pack="${pack.credits}">${pack.credits} créditos · R$ ${Number(pack.price).toFixed(2).replace('.',',')} <small>simular sandbox</small></button>`).join('');
    this.root.querySelector('#aiMode').insertAdjacentHTML('afterend',`<p class="ai-credit-status" data-ai-credits></p><div class="ai-credit-packs" aria-label="Pacotes de créditos em ambiente de testes">${packs}</div><label class="ai-consent"><input type="checkbox" id="aiConsent"> Entendo que a Orbe IA é uma ferramenta simbólica e não uma pessoa real.</label>`);
    this.root.querySelectorAll('[data-credit-pack]').forEach(button=>button.onclick=()=>{grantCredits(button.dataset.creditPack);this.updateCredits();this.renderHistory();window.dispatchEvent(new CustomEvent('orbe:toast',{detail:'Créditos adicionados somente no sandbox.'}));});
    this.updateCredits();
  }
  updateCredits(){const state=creditState();const status=this.root.querySelector('[data-ai-credits]');if(status)status.textContent=`Créditos demonstrativos: ${state.remaining} · Luna 1 crédito · Terra 10 créditos` ;}
  bind(){
    this.mode.onchange=()=>{const channel=this.mode.value==='channel';this.root.querySelector('#personaField').hidden=!channel;this.root.querySelector('#channelNotice').hidden=!channel;this.root.querySelector('#channelNotice').textContent=aiDisclosure(this.mode.value);};
    this.form.onsubmit=e=>{e.preventDefault();this.send();};
    this.root.querySelector('#clearChat').onclick=()=>{this.history=[];store.set('whit-history',[]);this.renderHistory();};
    window.addEventListener('divina:journal-ai-selected',()=>this.prepareJournalSelection());
  }
  prepareJournalSelection(){
    const selected=store.get(JOURNAL_AI_SELECTION_KEY);
    if(!selected||selected.consentScope!=='single-entry'||typeof selected.text!=='string')return;
    const input=this.root.querySelector('#chatInput');
    if(!input)return;
    const cards=Array.isArray(selected.cards)&&selected.cards.length?`\nCartas relacionadas: ${selected.cards.join(', ')}`:'';
    const question=selected.question?`\nIntenção: ${selected.question}`:'';
    const tags=selected.tags?`\nEtiquetas: ${selected.tags}`:'';
    input.value=`Quero refletir somente sobre esta entrada que escolhi no meu Diário.\nTítulo: ${String(selected.title||'Memória da Orbe')}\nReflexão: ${selected.text.slice(0,5000)}${question}${cards}${tags}`;
    this.root.querySelector('.ai-journal-selection')?.remove();
    const notice=document.createElement('aside');
    notice.className='ai-journal-selection';
    notice.innerHTML='<span aria-hidden="true">◇</span><p><b>Uma única memória foi preparada.</b><small>Revise o texto abaixo. Nada será enviado até você marcar o consentimento e tocar em Enviar.</small></p><button type="button">Remover</button>';
    notice.querySelector('button').onclick=()=>{input.value='';notice.remove();};
    this.form.insertAdjacentElement('beforebegin',notice);
    store.remove(JOURNAL_AI_SELECTION_KEY);
    input.focus({preventScroll:true});
  }
  renderHistory(){this.chat.innerHTML='<p class="bubble bot">Eu sou Whit. Escolha um modo e converse com presença. Esta experiência é uma simulação de IA.</p>'+this.history.map(m=>`<p class="bubble ${m.role==='user'?'user':'bot'}">${escapeHTML(m.content)}</p>`).join('');this.chat.scrollTop=this.chat.scrollHeight;}
  async send(){
    const input=this.root.querySelector('#chatInput'),content=input.value.trim(),mode=this.mode.value,persona=this.persona.value.trim(),consent=this.root.querySelector('#aiConsent')?.checked;
    if(!content||!consent)return;
    if(mode==='sol'||!AI_POLICY.modes[mode]||AI_POLICY.modes[mode].enabled===false){this.history.push({role:'assistant',content:'Este modo permanece desativado até uma futura aprovação de produção.'});this.renderHistory();return;}
    if(mode==='channel'&&!persona){this.persona.focus();return;}
    if(!canSpend(mode)){this.history.push({role:'assistant',content:'Seus créditos demonstrativos acabaram. Nenhuma cobrança será feita.'});this.renderHistory();return;}
    this.history.push({role:'user',content});input.value='';this.renderHistory();const pending=document.createElement('p');pending.className='bubble bot';pending.textContent='A Orbe está refletindo…';this.chat.append(pending);
    try{if(!this.config.apiBase)throw new Error('offline');const response=await fetch(`${this.config.apiBase.replace(/\/$/,'')}/ai/chat`,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({mode,persona:persona||null,message:content,history:this.history.slice(-12),disclosure:aiDisclosure(mode),consent:true})});if(response.status===401||response.status===403)throw new Error('subscription');if(!response.ok)throw new Error('server');const data=await response.json();if(!spend(mode))throw new Error('credits');this.history.push({role:'assistant',content:String(data.answer||'Não consegui formar uma resposta.')});}
    catch(error){const messages={offline:'A conexão segura da Whit ainda não foi configurada no servidor. Sua chave permanece protegida e nenhum crédito foi consumido.',subscription:'A Whit é exclusiva para assinantes. Confirme uma assinatura ativa no servidor seguro.',server:'A Whit está temporariamente indisponível. Nenhum crédito foi consumido.',credits:'Os créditos demonstrativos acabaram.'};this.history.push({role:'assistant',content:messages[error.message]||messages.server});}
    pending.remove();store.set('whit-history',this.history.slice(-40));this.updateCredits();this.renderHistory();
  }
}
