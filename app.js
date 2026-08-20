import { CONFIG } from './config.js';
import { escapeHTML } from './storage.js';
import { createNavigation } from './navigation.js';
import { LivingOrb } from './orb-engine.js';
import { FreeTarot } from './tarot-engine.js';
import { DailyRitual } from './ritual-engine.js';
import { SpreadsEngine } from './spreads-engine.js';
import { JournalEngine } from './journal-engine.js';
import { CommerceEngine } from './commerce-engine.js';
import { MediaEngine } from './media-engine.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const toast = message => { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2400); };
const { go } = createNavigation();
const orb = new LivingOrb($('#orbCanvas'));
new FreeTarot($('#tarot'));
$('#orb').addEventListener('pointerdown', () => orb.pulse());
const journal = new JournalEngine($('#journalForm'), $('#entries'), $('#mirrorStats'));
new DailyRitual($('#dailyCard'), entry => journal.add(entry));
new SpreadsEngine($('#spreadGrid'), $('#spreadResult'), entry => journal.add(entry));
addEventListener('orbe:toast', event => toast(event.detail));
new CommerceEngine({store:$('#storeApp'),consultations:$('#consultationApp'),subscriptions:$('#subscriptionApp')},CONFIG);
new MediaEngine({videos:$('#videoApp'),music:$('#musicApp')},CONFIG);

$('#chatForm').onsubmit=event=>{event.preventDefault();const input=$('#chatInput'),question=input.value.trim();if(!question)return;$('#chat').insertAdjacentHTML('beforeend',`<p class="bubble user">${escapeHTML(question)}</p>`);input.value='';setTimeout(()=>{$('#chat').insertAdjacentHTML('beforeend','<p class="bubble bot">Respire. Qual imagem, palavra ou sensação aparece primeiro quando você lê sua própria pergunta? A conexão segura com a IA será ativada quando o servidor estiver configurado.</p>');$('#chat').scrollTop=$('#chat').scrollHeight;},420);};

$('#userLogin').onsubmit=event=>{event.preventDefault();toast('Login seguro será ativado com o servidor.');};
$('#adminLogin').onsubmit=event=>{event.preventDefault();if($('#adminUser').value!==CONFIG.adminUser){$('#adminMsg').textContent='Login não reconhecido.';return;}$('#adminMsg').textContent='Usuário reconhecido. A senha será validada somente pelo servidor seguro — nunca pelo arquivo público.';};

let installPrompt=null;addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#installApp').hidden=false;});$('#installApp').onclick=async()=>{if(!installPrompt){toast('No iPhone: Compartilhar → Adicionar à Tela de Início.');return;}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;};
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
window.orbe={go};
