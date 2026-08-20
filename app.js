import { CONFIG } from './config.js';
import { escapeHTML } from './storage.js';
import { createNavigation } from './navigation.js';
import { LivingOrb } from './orb-engine.js';
import { FreeTarot } from './tarot-engine.js';
import { DailyRitual } from './ritual-engine.js';
import { SpreadsEngine } from './spreads-engine.js';
import { JournalEngine } from './journal-engine.js';

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

$('#chatForm').onsubmit=event=>{event.preventDefault();const input=$('#chatInput'),question=input.value.trim();if(!question)return;$('#chat').insertAdjacentHTML('beforeend',`<p class="bubble user">${escapeHTML(question)}</p>`);input.value='';setTimeout(()=>{$('#chat').insertAdjacentHTML('beforeend','<p class="bubble bot">Respire. Qual imagem, palavra ou sensação aparece primeiro quando você lê sua própria pergunta? A conexão segura com a IA será ativada quando o servidor estiver configurado.</p>');$('#chat').scrollTop=$('#chat').scrollHeight;},420);};

const products=[['Tarot Orbe das Realidades','Em breve'],['Leitura digital personalizada','R$ 100'],['Caderno Ritual da Orbe','Em breve'],['Arte exclusiva de Arcano','Em breve']];
const plans=[['Presença','Grátis','Carta do Dia e Tarot Livre'],['Orbe Lunar','R$ 19,90/mês','Diário, tiragens e estudos'],['Orbe Suprema','R$ 39,90/mês','Experiência completa e conteúdos exclusivos']];
function cardsInto(selector,items,label){$(selector).innerHTML=items.map(item=>`<article><h3>${item[0]}</h3><p>${item[2]||''}</p><p class="price">${item[1]}</p><button class="primary" data-commerce>${label}</button></article>`).join('');$$(selector+' [data-commerce]').forEach(button=>button.onclick=()=>toast('Pagamento seguro será conectado na etapa comercial.'));}
cardsInto('#products',products,'Ver produto');cardsInto('#plans',plans,'Escolher plano');cardsInto('#services',CONFIG.services.map(s=>[s.name,`R$ ${s.price}`,s.description]),'Agendar consulta');
$('#youtubeLink').href=CONFIG.youtube;$('#spotifyLink').href=CONFIG.spotify;
$('#userLogin').onsubmit=event=>{event.preventDefault();toast('Login seguro será ativado com o servidor.');};
$('#adminLogin').onsubmit=event=>{event.preventDefault();if($('#adminUser').value!==CONFIG.adminUser){$('#adminMsg').textContent='Login não reconhecido.';return;}$('#adminMsg').textContent='Usuário reconhecido. A senha será validada somente pelo servidor seguro — nunca pelo arquivo público.';};

let installPrompt=null;addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#installApp').hidden=false;});$('#installApp').onclick=async()=>{if(!installPrompt){toast('No iPhone: Compartilhar → Adicionar à Tela de Início.');return;}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;};
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
window.orbe={go};
