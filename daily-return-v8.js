/* DIVINA BRUXA — CONTEÚDO VIVO / RETORNO DIÁRIO V8
   Conteúdo local, determinístico pelo dia de Brasília e sem revelar a carta.
*/
const MESSAGES=[
  ['O portal pede presença','Antes de buscar respostas, observe o que você já sabe e escolha um gesto possível para hoje.'],
  ['A intuição também precisa de espaço','Diminua o ruído por alguns minutos. Uma percepção delicada pode chegar quando você para de forçá-la.'],
  ['Toda travessia começa pequena','Escolha uma ação concreta que honre sua intenção. O caminho se revela enquanto você caminha.'],
  ['A verdade pode ser cuidadosa','Clareza não precisa ferir. Diga a si mesma o que é real, o que é medo e o que ainda está nascendo.'],
  ['O símbolo é uma porta, não uma sentença','Use o Tarot para refletir, ampliar perspectivas e recuperar sua liberdade de escolha.'],
  ['Cuide da energia que sustenta o sonho','Repouso, limites e presença também são movimentos mágicos. Preserve o que torna sua jornada possível.'],
  ['O agora tem uma linguagem própria','Repare em um detalhe do seu dia que normalmente passaria despercebido. Ele pode mudar sua pergunta.']
];
const dayIndex=()=>{const now=new Date();const utc=now.getTime()+now.getTimezoneOffset()*60000;const brasilia=new Date(utc-3*60*60000);const start=new Date(brasilia.getFullYear(),0,0);return Math.floor((brasilia-start)/86400000)};
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const render=()=>{const target=document.querySelector('.home-copy');if(!target||target.querySelector('[data-daily-return]'))return;const [title,text]=MESSAGES[dayIndex()%MESSAGES.length];const card=document.createElement('aside');card.dataset.dailyReturn='';card.className='daily-return-card';card.innerHTML=`<span class="daily-return-sigil" aria-hidden="true">✦</span><div><p class="eyebrow">SUSSURRO DO PORTAL</p><h2>${escapeHTML(title)}</h2><p>${escapeHTML(text)}</p></div>`;target.append(card)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
