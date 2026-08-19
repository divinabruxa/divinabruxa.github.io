
const CARDS=[{"i": 0, "name": "O Louco", "group": "Arcano Maior"}, {"i": 1, "name": "O Mago", "group": "Arcano Maior"}, {"i": 2, "name": "A Sacerdotisa", "group": "Arcano Maior"}, {"i": 3, "name": "A Imperatriz", "group": "Arcano Maior"}, {"i": 4, "name": "O Imperador", "group": "Arcano Maior"}, {"i": 5, "name": "O Hierofante", "group": "Arcano Maior"}, {"i": 6, "name": "Os Enamorados", "group": "Arcano Maior"}, {"i": 7, "name": "O Carro", "group": "Arcano Maior"}, {"i": 8, "name": "A Força", "group": "Arcano Maior"}, {"i": 9, "name": "O Eremita", "group": "Arcano Maior"}, {"i": 10, "name": "A Roda da Fortuna", "group": "Arcano Maior"}, {"i": 11, "name": "A Justiça", "group": "Arcano Maior"}, {"i": 12, "name": "O Enforcado", "group": "Arcano Maior"}, {"i": 13, "name": "A Morte", "group": "Arcano Maior"}, {"i": 14, "name": "A Temperança", "group": "Arcano Maior"}, {"i": 15, "name": "O Diabo", "group": "Arcano Maior"}, {"i": 16, "name": "A Torre", "group": "Arcano Maior"}, {"i": 17, "name": "A Estrela", "group": "Arcano Maior"}, {"i": 18, "name": "A Lua", "group": "Arcano Maior"}, {"i": 19, "name": "O Sol", "group": "Arcano Maior"}, {"i": 20, "name": "O Julgamento", "group": "Arcano Maior"}, {"i": 21, "name": "O Mundo", "group": "Arcano Maior"}, {"i": 22, "name": "Ás de Copas", "group": "Copas"}, {"i": 23, "name": "2 de Copas", "group": "Copas"}, {"i": 24, "name": "3 de Copas", "group": "Copas"}, {"i": 25, "name": "4 de Copas", "group": "Copas"}, {"i": 26, "name": "5 de Copas", "group": "Copas"}, {"i": 27, "name": "6 de Copas", "group": "Copas"}, {"i": 28, "name": "7 de Copas", "group": "Copas"}, {"i": 29, "name": "8 de Copas", "group": "Copas"}, {"i": 30, "name": "9 de Copas", "group": "Copas"}, {"i": 31, "name": "10 de Copas", "group": "Copas"}, {"i": 32, "name": "Pajem de Copas", "group": "Copas"}, {"i": 33, "name": "Cavaleiro de Copas", "group": "Copas"}, {"i": 34, "name": "Rainha de Copas", "group": "Copas"}, {"i": 35, "name": "Rei de Copas", "group": "Copas"}, {"i": 36, "name": "Ás de Ouros", "group": "Ouros"}, {"i": 37, "name": "2 de Ouros", "group": "Ouros"}, {"i": 38, "name": "3 de Ouros", "group": "Ouros"}, {"i": 39, "name": "4 de Ouros", "group": "Ouros"}, {"i": 40, "name": "5 de Ouros", "group": "Ouros"}, {"i": 41, "name": "6 de Ouros", "group": "Ouros"}, {"i": 42, "name": "7 de Ouros", "group": "Ouros"}, {"i": 43, "name": "8 de Ouros", "group": "Ouros"}, {"i": 44, "name": "9 de Ouros", "group": "Ouros"}, {"i": 45, "name": "10 de Ouros", "group": "Ouros"}, {"i": 46, "name": "Pajem de Ouros", "group": "Ouros"}, {"i": 47, "name": "Cavaleiro de Ouros", "group": "Ouros"}, {"i": 48, "name": "Rainha de Ouros", "group": "Ouros"}, {"i": 49, "name": "Rei de Ouros", "group": "Ouros"}, {"i": 50, "name": "Ás de Espadas", "group": "Espadas"}, {"i": 51, "name": "2 de Espadas", "group": "Espadas"}, {"i": 52, "name": "3 de Espadas", "group": "Espadas"}, {"i": 53, "name": "4 de Espadas", "group": "Espadas"}, {"i": 54, "name": "5 de Espadas", "group": "Espadas"}, {"i": 55, "name": "6 de Espadas", "group": "Espadas"}, {"i": 56, "name": "7 de Espadas", "group": "Espadas"}, {"i": 57, "name": "8 de Espadas", "group": "Espadas"}, {"i": 58, "name": "9 de Espadas", "group": "Espadas"}, {"i": 59, "name": "10 de Espadas", "group": "Espadas"}, {"i": 60, "name": "Pajem de Espadas", "group": "Espadas"}, {"i": 61, "name": "Cavaleiro de Espadas", "group": "Espadas"}, {"i": 62, "name": "Rainha de Espadas", "group": "Espadas"}, {"i": 63, "name": "Rei de Espadas", "group": "Espadas"}, {"i": 64, "name": "Ás de Paus", "group": "Paus"}, {"i": 65, "name": "2 de Paus", "group": "Paus"}, {"i": 66, "name": "3 de Paus", "group": "Paus"}, {"i": 67, "name": "4 de Paus", "group": "Paus"}, {"i": 68, "name": "5 de Paus", "group": "Paus"}, {"i": 69, "name": "6 de Paus", "group": "Paus"}, {"i": 70, "name": "7 de Paus", "group": "Paus"}, {"i": 71, "name": "8 de Paus", "group": "Paus"}, {"i": 72, "name": "9 de Paus", "group": "Paus"}, {"i": 73, "name": "10 de Paus", "group": "Paus"}, {"i": 74, "name": "Pajem de Paus", "group": "Paus"}, {"i": 75, "name": "Cavaleiro de Paus", "group": "Paus"}, {"i": 76, "name": "Rainha de Paus", "group": "Paus"}, {"i": 77, "name": "Rei de Paus", "group": "Paus"}];
const ADMIN_USER="Isis33";
const ADMIN_HASH="bf516cdd9df8ca987b867a291b08049fc0590d181e78b4a35c7ddefea2058736";
const DEFAULT_EMAIL='herculesfardim@hotmail.com';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={
 get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}},
 set(k,v){localStorage.setItem(k,JSON.stringify(v))}
};
const cardImg=c=>`card-${String(c.i).padStart(2,'0')}.jpg`;
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

function go(id){
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));

function react(stage,label='escutando'){
  if(!stage)return;
  stage.classList.remove('react'); void stage.offsetWidth; stage.classList.add('react');
  const cap=stage.querySelector('.orb-caption'); const old=cap?.textContent;
  if(cap) cap.textContent=label;
  if(navigator.vibrate) try{navigator.vibrate(16)}catch{}
  clearTimeout(stage._reactTimer);
  stage._reactTimer=setTimeout(()=>{stage.classList.remove('react');if(cap)cap.textContent=old||'pronta'},900);
}
function bindOrb(stage,onTap){
  if(!stage)return;
  const orb=stage.querySelector('.living-orb'); if(!orb)return;
  let raf=0;
  const move=e=>{
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      const r=orb.getBoundingClientRect();
      const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
      const y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
      orb.style.setProperty('--x',(x*100)+'%'); orb.style.setProperty('--y',(y*100)+'%');
      orb.style.setProperty('--dx',((x-.5)*10)+'px'); orb.style.setProperty('--dy',((y-.5)*10)+'px');
    });
  };
  orb.addEventListener('pointermove',move,{passive:true});
  orb.addEventListener('pointerleave',()=>{orb.style.setProperty('--dx','0px');orb.style.setProperty('--dy','0px')},{passive:true});
  orb.addEventListener('pointerdown',e=>{react(stage);onTap?.(e)},{passive:true});
}

let pile=[],freeDrawn=[],guided=[];
function resetDeck(){pile=shuffle(CARDS);freeDrawn=[];renderFree();}
function cardHTML(c,extra=''){return `<button class="tarot-card" data-card="${c.i}" ${extra}><img src="${cardImg(c)}" alt="${escapeHTML(c.name)}" loading="lazy"><div class="tarot-meta"><b>${escapeHTML(c.name)}</b><small>${escapeHTML(c.group)}</small></div></button>`}
function renderFree(){$('#remaining').textContent=`${pile.length} cartas restantes`;$('#freeTable').innerHTML=freeDrawn.length?freeDrawn.map(c=>cardHTML(c)).join(''):'<div class="empty">Toque na Orbe para revelar a primeira carta.</div>'}
function drawCard(){if(!pile.length)pile=shuffle(CARDS);const c=pile.pop();freeDrawn.push(c);renderFree();$('#orbStatus').textContent='revelada';setTimeout(()=>$('#orbStatus').textContent='pronta',700)}
$('#drawBtn').addEventListener('click',()=>{react(document.querySelector('[data-orb="draw"]'));drawCard()});
$('#shuffleBtn').addEventListener('click',resetDeck);
$('#clearBtn').addEventListener('click',()=>{freeDrawn=[];renderFree()});
bindOrb(document.querySelector('[data-orb="hero"]'),()=>setTimeout(()=>go('free'),250));
bindOrb(document.querySelector('[data-orb="draw"]'),drawCard);

const POS={
  1:['Mensagem central'],
  3:['Passado / raiz','Presente','Tendência / conselho'],
  5:['Situação','Desafio','Raiz','O que ajuda','Tendência'],
  10:['Situação','Desafio','Fundação','Passado recente','Possibilidade','Próximo passo','Você','Ambiente','Esperanças e medos','Síntese']
};
$$('.spread-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const n=+btn.dataset.count; guided=shuffle(CARDS).slice(0,n);
  $('#guidedTable').innerHTML=guided.map((c,i)=>`<div class="spread-slot"><span>${POS[n][i]}</span>${cardHTML(c)}</div>`).join('');
  $('#guidedNote').classList.remove('hidden');
  $('#guidedNote').innerHTML='<b>Leitura aberta.</b> Observe primeiro a imagem, a posição e as relações entre as cartas. A IA online poderá depois integrar a sequência em uma interpretação contextual.';
}));
$('#saveReading').addEventListener('click',()=>{
  if(!guided.length)return;
  const list=store.get('orbe8-journal',[]);
  list.unshift({date:new Date().toLocaleString('pt-BR'),question:$('#question').value.trim(),cards:guided.map(c=>c.name)});
  store.set('orbe8-journal',list.slice(0,60)); renderJournal();
});

function openCard(i){const c=CARDS[i];$('#modalImage').src=cardImg(c);$('#modalName').textContent=c.name;$('#modalGroup').textContent=c.group;$('#cardModal').classList.add('open');$('#cardModal').setAttribute('aria-hidden','false')}
document.addEventListener('click',e=>{const el=e.target.closest('[data-card]');if(el)openCard(+el.dataset.card)});
$('#modalClose').addEventListener('click',()=>$('#cardModal').classList.remove('open'));
$('#cardModal').addEventListener('click',e=>{if(e.target.id==='cardModal')e.currentTarget.classList.remove('open')});

function renderDeck(q=''){q=q.trim().toLowerCase();$('#deckGrid').innerHTML=CARDS.filter(c=>(c.name+' '+c.group).toLowerCase().includes(q)).map(c=>cardHTML(c)).join('')}
$('#deckSearch').addEventListener('input',e=>renderDeck(e.target.value));

function renderJournal(){const list=store.get('orbe8-journal',[]);$('#journalList').innerHTML=list.length?list.map(x=>`<div class="journal-item"><b>${escapeHTML(x.date)}</b><div>${escapeHTML(x.question||'Sem pergunta escrita')}</div><small>${x.cards.map(escapeHTML).join(' · ')}</small></div>`).join(''):'<p>Nenhuma leitura salva ainda.</p>'}
$('#clearJournal').addEventListener('click',()=>{localStorage.removeItem('orbe8-journal');renderJournal()});

const localReplies=[
 'Use a leitura para separar desejo, medo e evidência. O que você consegue confirmar na realidade agora?',
 'A Orbe sugere olhar para o que está sob seu controle: limite, conversa, escolha ou espera.',
 'Nem toda incerteza pede uma resposta imediata. Talvez o próximo passo seja observar antes de concluir.',
 'O simbolismo pode revelar como você está vivendo a situação, mas não prova pensamentos privados de outra pessoa.',
 'Pergunte a si mesma qual atitude deixaria você mais alinhada com seus valores, mesmo sem garantia do resultado.'
];
function bubble(role,text){const d=document.createElement('div');d.className='bubble '+role;d.textContent=text;$('#chatLog').appendChild(d);$('#chatLog').scrollTop=$('#chatLog').scrollHeight}
async function askOrb(text){
  text=(text||'').trim();if(!text)return;
  bubble('user',text);
  const endpoint=store.get('orbe8-ai-endpoint','');
  if(endpoint){
    const wait=document.createElement('div');wait.className='bubble orb';wait.textContent='A Orbe está formando a resposta…';$('#chatLog').appendChild(wait);
    try{
      const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:text,name:$('#channelName').value.trim(),intention:$('#channelIntent').value.trim()})});
      const data=await r.json();wait.remove();bubble('orb',data.reply||data.output||data.message||'A conexão respondeu, mas o formato precisa ser ajustado.');$('#aiMode').textContent='IA online conectada';
    }catch{wait.remove();bubble('orb','A IA online não respondeu. Continuei em modo simbólico local.');}
  }else{
    const c=CARDS[Math.floor(Math.random()*CARDS.length)];
    await new Promise(r=>setTimeout(r,250));
    bubble('orb',`${c.name} aparece como símbolo. ${localReplies[Math.floor(Math.random()*localReplies.length)]}`);
  }
}
$('#chatSend').addEventListener('click',()=>{const t=$('#chatInput').value;$('#chatInput').value='';askOrb(t)});
$('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#chatSend').click()}});
bindOrb(document.querySelector('[data-orb="chat"]'),()=>askOrb($('#channelIntent').value.trim()||'Abra uma reflexão simbólica para este momento.'));

$$('.service-pick').forEach(b=>b.addEventListener('click',()=>{$('#serviceSelect').value=b.dataset.service;$('#bookingForm').scrollIntoView({behavior:'smooth'})}));
function bookings(){return store.get('orbe8-bookings',[])}
$('#bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const b={service:$('#serviceSelect').value,name:$('#bookName').value.trim(),email:$('#bookEmail').value.trim(),phone:$('#bookPhone').value.trim(),date:$('#bookDate').value,time:$('#bookTime').value,message:$('#bookMessage').value.trim(),created:new Date().toLocaleString('pt-BR')};
  const list=bookings();list.unshift(b);store.set('orbe8-bookings',list);renderAdminBookings();refreshStats();
  const email=store.get('orbe8-email',DEFAULT_EMAIL);
  const subject=encodeURIComponent('Consulta — '+b.service);
  const body=encodeURIComponent(`Serviço: ${b.service}\nNome: ${b.name}\nE-mail: ${b.email}\nTelefone/WhatsApp: ${b.phone}\nData: ${b.date}\nHorário: ${b.time}\n\nTema:\n${b.message}`);
  $('#bookingStatus').classList.remove('hidden');$('#bookingStatus').innerHTML='<b>Solicitação registrada.</b> O aplicativo de e-mail será aberto com os dados preenchidos.';
  setTimeout(()=>location.href=`mailto:${email}?subject=${subject}&body=${body}`,250);
});

const DEFAULT_PRODUCTS=[{name:'Baralhos e Tarot',price:'Curadoria',desc:'Cadastre aqui seu primeiro link de afiliado.',link:''},{name:'Cristais e itens místicos',price:'Curadoria',desc:'Espaço para sua seleção de produtos.',link:''}];
function products(){return store.get('orbe8-products',DEFAULT_PRODUCTS)}
function renderProducts(q=''){q=q.toLowerCase();$('#shopGrid').innerHTML=products().filter(p=>(p.name+' '+p.desc).toLowerCase().includes(q)).map((p,i)=>`<article class="glass product"><h3>${escapeHTML(p.name)}</h3><div class="price">${escapeHTML(p.price)}</div><p>${escapeHTML(p.desc||'')}</p>${p.link?`<a class="btn gold" href="${escapeHTML(p.link)}" target="_blank" rel="noopener sponsored">Ver produto</a>`:'<small>Configure o link no Admin</small>'}</article>`).join('')}
$('#shopSearch').addEventListener('input',e=>renderProducts(e.target.value));
function renderAdminProducts(){$('#adminProducts').innerHTML=products().map((p,i)=>`<div class="admin-row"><b>${escapeHTML(p.name)}</b> · ${escapeHTML(p.price)}<br><small>${escapeHTML(p.link||'Sem link')}</small><br><button class="btn ghost" data-remove-product="${i}">Excluir</button></div>`).join('')}
$('#prodAdd').addEventListener('click',()=>{const name=$('#prodName').value.trim(),price=$('#prodPrice').value.trim();if(!name||!price)return;const list=products();list.push({name,price,link:$('#prodLink').value.trim(),desc:$('#prodDesc').value.trim()});store.set('orbe8-products',list);['prodName','prodPrice','prodLink','prodDesc'].forEach(id=>$('#'+id).value='');renderProducts();renderAdminProducts();refreshStats()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-remove-product]');if(!b)return;const list=products();list.splice(+b.dataset.removeProduct,1);store.set('orbe8-products',list);renderProducts();renderAdminProducts();refreshStats()});

let db=null;
const req=indexedDB.open('orbe8-db',1);
req.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('episodes'))d.createObjectStore('episodes',{keyPath:'id'})};
req.onsuccess=e=>{db=e.target.result;renderEpisodes()};
req.onerror=()=>{console.warn('IndexedDB indisponível')}; 
function getEpisodes(){return new Promise(resolve=>{if(!db)return resolve([]);const r=db.transaction('episodes').objectStore('episodes').getAll();r.onsuccess=()=>resolve((r.result||[]).sort((a,b)=>b.id-a.id));r.onerror=()=>resolve([])})}
async function renderEpisodes(){const eps=await getEpisodes();$('#adminEpisodes').innerHTML=eps.length?eps.map(e=>`<div class="admin-row"><b>${escapeHTML(e.title)}</b><br><small>${escapeHTML(e.desc||'')}</small></div>`).join(''):'<p>Nenhum episódio salvo.</p>';$('#videoArchive').innerHTML='';if(!eps.length){$('#videoEmpty').classList.remove('hidden');$('#featuredVideo').classList.add('hidden')}else{$('#videoEmpty').classList.add('hidden');const first=eps[0];$('#featuredVideo').classList.remove('hidden');$('#featuredVideo').src=URL.createObjectURL(first.file);$('#featuredTitle').textContent=first.title;$('#featuredDesc').textContent=first.desc||'';for(const e of eps.slice(1)){const el=document.createElement('article');el.className='glass video-card';const v=document.createElement('video');v.controls=true;v.playsInline=true;v.src=URL.createObjectURL(e.file);const h=document.createElement('h3');h.textContent=e.title;const p=document.createElement('p');p.textContent=e.desc||'';el.append(v,h,p);$('#videoArchive').appendChild(el)}}refreshStats(eps.length)}
$('#epSave').addEventListener('click',()=>{const f=$('#epFile').files[0];if(!f||!db)return alert('Escolha um vídeo primeiro.');if(f.size>250*1024*1024)return alert('Para evitar travamentos, esta demonstração local aceita até 250 MB. Vídeos maiores serão publicados pelo armazenamento online.');const tx=db.transaction('episodes','readwrite');tx.objectStore('episodes').put({id:Date.now(),title:$('#epTitle').value.trim()||'Novo episódio',desc:$('#epDesc').value.trim(),file:f});tx.oncomplete=()=>{$('#epFile').value='';$('#epTitle').value='';$('#epDesc').value='';renderEpisodes()}});
$('#epClear').addEventListener('click',()=>{if(!db)return;const tx=db.transaction('episodes','readwrite');tx.objectStore('episodes').clear();tx.oncomplete=renderEpisodes});

async function sha256(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function showAdmin(){const ok=sessionStorage.getItem('orbe8-admin')==='1';$('#adminLogin').classList.toggle('hidden',ok);$('#adminPortal').classList.toggle('hidden',!ok);if(ok){renderAdminProducts();renderAdminBookings();refreshStats();loadAdminFields()}}
$('#adminEnter').addEventListener('click',async()=>{const ok=$('#adminUser').value.trim()===ADMIN_USER && await sha256($('#adminPass').value)===ADMIN_HASH;if(ok){sessionStorage.setItem('orbe8-admin','1');$('#adminError').textContent='';showAdmin()}else $('#adminError').textContent='Usuário ou senha incorretos.'});
$('#adminPass').addEventListener('keydown',e=>{if(e.key==='Enter')$('#adminEnter').click()});
$('#adminLogout').addEventListener('click',()=>{sessionStorage.removeItem('orbe8-admin');showAdmin()});
$$('.admin-tab').forEach(b=>b.addEventListener('click',()=>{$$('.admin-tab').forEach(x=>x.classList.toggle('active',x===b));$$('.admin-page').forEach(p=>p.classList.toggle('active',p.dataset.adminPage===b.dataset.page))}));
function renderAdminBookings(){const list=bookings();$('#adminBookings').innerHTML=list.length?list.map(b=>`<div class="admin-row"><b>${escapeHTML(b.service)}</b><br>${escapeHTML(b.name)} · ${escapeHTML(b.phone)} · ${escapeHTML(b.email)}<br><small>${escapeHTML(b.date)} às ${escapeHTML(b.time)} · ${escapeHTML(b.message||'')}</small></div>`).join(''):'<p>Nenhuma solicitação registrada neste aparelho.</p>'}
function loadAdminFields(){const msg=store.get('orbe8-home-message','A Orbe está aberta. Escolha uma experiência e siga sua curiosidade.');$('#homeMessageEdit').value=msg;$('#homeMessage').textContent=msg;const ep=store.get('orbe8-ai-endpoint','');$('#aiEndpoint').value=ep;$('#aiStatus').textContent=ep?'Endpoint de IA salvo neste aparelho.':'Modo simbólico local ativo.'}
$('#homeMessageSave').addEventListener('click',()=>{const msg=$('#homeMessageEdit').value.trim();store.set('orbe8-home-message',msg);$('#homeMessage').textContent=msg});
$('#aiSave').addEventListener('click',()=>{store.set('orbe8-ai-endpoint',$('#aiEndpoint').value.trim());loadAdminFields()});
$('#aiTest').addEventListener('click',async()=>{const ep=$('#aiEndpoint').value.trim();if(!ep)return $('#aiStatus').textContent='Informe um endpoint primeiro.';$('#aiStatus').textContent='Testando…';try{const r=await fetch(ep,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'Teste de conexão da Orbe'})});$('#aiStatus').textContent=r.ok?'O endpoint respondeu.':'O endpoint respondeu com erro '+r.status}catch(e){$('#aiStatus').textContent='Falha de conexão: '+e.message}});
async function refreshStats(knownEpisodes){$('#stProducts').textContent=products().length;$('#stBookings').textContent=bookings().length;$('#stEpisodes').textContent=knownEpisodes??(await getEpisodes()).length}

if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
resetDeck();renderDeck();renderJournal();renderProducts();showAdmin();loadAdminFields();
