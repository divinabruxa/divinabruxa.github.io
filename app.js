import { CONFIG } from './config.js';
import { CARDS, DAILY_MESSAGES } from './tarot-data.js';
import { store, escapeHTML } from './storage.js';
import { createNavigation } from './navigation.js';
import { LivingOrb } from './orb-engine.js';
import { FreeTarot } from './tarot-engine.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const toast = message => { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2400); };
const { go } = createNavigation();
const orb = new LivingOrb($('#orbCanvas'));
new FreeTarot($('#tarot'));
$('#orb').addEventListener('pointerdown', () => orb.pulse());

const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());
function dailyCard(){return store.get('daily');}
function renderDaily(data){const card=CARDS[data.id];$('#dailyCard').innerHTML=`<p class="eyebrow">SUA INTENÇÃO</p><p>${escapeHTML(data.intention||'Presença')}</p><div class="current ${data.reversed?'reversed':''}" style="margin:20px auto"><img src="${card.image}" alt="${card.name}"></div><h3>${card.name}</h3><p>${data.reversed?'Posição invertida':'Posição direta'} · ${card.arcana}</p><article class="panel"><p>${DAILY_MESSAGES[card.suit]}</p><p><em>Reflexão:</em> o que esta carta convida você a reconhecer e transformar hoje?</p></article><button class="primary" id="saveDaily">Guardar no diário</button>`;$('#saveDaily').onclick=()=>addEntry(`Carta do Dia — ${card.name}. ${DAILY_MESSAGES[card.suit]}`);}
$('#drawDaily').onclick=()=>{let data=dailyCard();if(!data||data.date!==today()){const a=new Uint32Array(1);crypto.getRandomValues(a);data={date:today(),id:a[0]%78,reversed:Math.random()<.18,intention:$('#dailyIntention').value.trim()};store.set('daily',data);}renderDaily(data);navigator.vibrate?.([18,30,25]);};
{const data=dailyCard();if(data?.date===today())renderDaily(data);}

const spreads=[['Uma Carta',1,'Uma resposta direta'],['Passado · Presente · Tendência',3,'A linha do tempo'],['Situação · Ação · Resultado',3,'Clareza prática'],['Amor',3,'Você, a relação e o caminho'],['Dois Caminhos',5,'Compare possibilidades'],['Cruz Celta',10,'Leitura completa']];
$('#spreadGrid').innerHTML=spreads.map((s,i)=>`<button data-spread="${i}"><h3>${s[0]}</h3><span>${s[2]}</span><small>${s[1]} carta${s[1]>1?'s':''}</small></button>`).join('');
$('#spreadGrid').onclick=event=>{const button=event.target.closest('[data-spread]');if(!button)return;const spread=spreads[+button.dataset.spread],pool=[...CARDS].sort(()=>crypto.getRandomValues(new Uint32Array(1))[0]-.5).slice(0,spread[1]);$('#spreadResult').innerHTML=`<article class="panel"><p class="eyebrow">${spread[0]}</p><div class="memory">${pool.map(card=>`<button><img src="${card.image}" alt="${card.name}"><span>${card.name}</span></button>`).join('')}</div>${pool.map(card=>`<p><b>${card.name}:</b> ${DAILY_MESSAGES[card.suit]}</p>`).join('')}</article>`;$('#spreadResult').scrollIntoView({behavior:'smooth'});};

function entries(){return store.get('journal',[]);}function addEntry(text){const list=entries();list.unshift({text,date:new Date().toLocaleString('pt-BR')});store.set('journal',list);renderEntries();toast('Guardado no Diário da Orbe');}function renderEntries(){$('#entries').innerHTML=entries().map(item=>`<article><small>${escapeHTML(item.date)}</small><p>${escapeHTML(item.text)}</p></article>`).join('');}$('#journalForm').onsubmit=event=>{event.preventDefault();addEntry($('#journalText').value.trim());$('#journalText').value='';};renderEntries();

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
