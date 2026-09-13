/* DIVINA BRUXA 3.0 — MATRIZ FÍSICA V547
   Resultados locais, explícitos e sanitizados. Nenhum teste recebe PASS
   automático e nenhum dado é enviado para API. */

export const PHYSICAL_PROFILES_V547=Object.freeze([
  {id:'iphone-safari',label:'iPhone · Safari'},
  {id:'iphone-pwa',label:'iPhone · PWA instalado'},
  {id:'ipad-safari',label:'iPad · Safari'},
  {id:'android-chrome',label:'Android · Chrome'},
  {id:'android-pwa',label:'Android · PWA instalado'},
  {id:'mac-safari',label:'Mac · Safari'},
  {id:'desktop-chrome',label:'Desktop · Chrome'},
  {id:'desktop-firefox',label:'Desktop · Firefox'},
  {id:'desktop-edge',label:'Desktop · Edge'}
]);

const IOS=['iphone-safari','iphone-pwa','ipad-safari'];
const ANDROID=['android-chrome','android-pwa'];
const MOBILE=[...IOS,...ANDROID];
const DESKTOP=['mac-safari','desktop-chrome','desktop-firefox','desktop-edge'];
const PWA=['iphone-pwa','android-pwa'];
const GROUPS=Object.freeze({
  foundation:'Orbe, Home e Navegação',tarot:'Tarot Livre',worlds:'Mundos e Conteúdo',
  accessibility:'Acessibilidade',pwa:'PWA, Offline e Recuperação',security:'Conta, Privacidade e Admin'
});
const item=(id,group,title,steps,expected,profiles=null)=>Object.freeze({id,group,title,steps,expected,profiles});

export const PHYSICAL_CASES_V547=Object.freeze([
  item('foundation-boot','foundation','Entrada sem tela presa','Abra por uma aba limpa e aguarde a primeira resposta visual.','A página aparece sem loader infinito; o conteúdo pode ser usado mesmo se uma camada opcional falhar.'),
  item('foundation-home-orb','foundation','Orbe central da Home','Volte à Home e observe a primeira dobra em retrato e paisagem.','Há uma única Orbe viva, centralizada, sem linhas/listas ao redor e sem conteúdo cobrindo seu toque.'),
  item('foundation-orb-touch','foundation','Toque curto na Orbe','Toque uma vez no centro da Orbe e solte sem arrastar.','A resposta é imediata e sutil; não há salto, toque fantasma ou espera perceptível.',MOBILE),
  item('foundation-menu','foundation','Menu orbital abre e fecha','Abra o menu pela Orbe, escolha uma rota e repita três vezes.','O menu abre sem engasgo, fecha ao navegar e nunca duplica a Orbe.'),
  item('foundation-routes','foundation','Dezessete rotas vivas','Percorra todas as abas do menu e volte à Home.','Cada rota apresenta conteúdo real; nenhuma mostra placeholder, tela vazia ou erro de módulo.'),
  item('foundation-history','foundation','Voltar e avançar do navegador','Navegue por três mundos e use Voltar/Avançar.','A rota, o título e o conteúdo acompanham o histórico sem sobrepor telas.'),
  item('foundation-rotation','foundation','Rotação sem deslocamento','Gire retrato → paisagem → retrato na Home e no Tarot.','A Orbe e as cartas permanecem enquadradas; não aparece rolagem horizontal.',MOBILE),
  item('foundation-horizontal','foundation','Largura física do viewport','Deslize lateralmente nas principais páginas.','A página não passeia para os lados nem corta controles essenciais.'),
  item('foundation-single-orb','foundation','Uma Orbe viva por vez','Abra e feche menu, Conta, Whit e cinco mundos.','O inspetor visual nunca mostra duas Orbes vivas competindo.'),
  item('foundation-motion','foundation','Movimento não domina a resposta','Role e navegue por dois minutos em sequência.','O toque e a leitura continuam prioritários; nenhum efeito cria aquecimento ou travamento visível.'),

  item('tarot-no-fire','tarot','Motor de fogo ausente','Abra Tarot Livre, embaralhe e faça uma leitura.','Não há chama, fogo, fumaça pesada ou motor visual semelhante.'),
  item('tarot-78','tarot','Baralho completo','Abra a biblioteca/seletor do Tarot e confira o contador.','O universo contém exatamente 78 cartas canônicas.'),
  item('tarot-upright','tarot','Somente cartas normais','Faça várias leituras e observe todas as imagens/textos.','Nenhuma carta aparece invertida nem recebe interpretação invertida.'),
  item('tarot-no-repeat','tarot','Sem repetição na mesma mesa','Faça uma tiragem grande e compare as cartas abertas.','A mesma carta não aparece duas vezes dentro da sessão.'),
  item('tarot-reveal','tarot','Revelação responsiva','Revele cartas individualmente com toques rápidos e depois lentos.','Cada toque revela uma única carta; não há duplo disparo ou atraso acumulado.'),
  item('tarot-spreads','tarot','Tiragens livres','Teste leituras de 1, 3, 5 e 7 cartas.','Quantidade, posições e síntese correspondem à tiragem escolhida.'),
  item('tarot-celtic','tarot','Cruz Celta','Abra a Cruz Celta e revele as dez posições.','As 10 posições cabem, mantêm ordem e permanecem legíveis.'),
  item('tarot-royal','tarot','Mesa Real 13 × 6','Abra a Mesa Real e percorra toda a disposição.','Existem 13 colunas por 6 linhas, totalizando 78 cartas sem repetição.'),
  item('tarot-reset','tarot','Nova leitura limpa','Conclua uma tiragem, toque em nova leitura e escolha outra.','A sessão anterior não vaza seleção, pergunta ou estado visual.'),
  item('tarot-offline','tarot','Tarot disponível offline','Prepare o offline, desligue a rede e reabra o Tarot Livre.','Baralho, imagens essenciais e leitura livre continuam disponíveis.',PWA),

  item('world-daily','worlds','Carta do Dia coerente','Revele a carta, feche e reabra no mesmo dia.','A carta revelada e seu significado permanecem coerentes no aparelho.'),
  item('world-library-78','worlds','Biblioteca com 78 cartas','Abra a Biblioteca e percorra Arcanos Maiores e Menores.','As 78 páginas diretas existem, têm imagem, significado e navegação.'),
  item('world-library-search','worlds','Busca pública útil','Pesquise nomes, símbolos e temas diferentes.','Resultados verdadeiros aparecem sem ler Diário, Conta ou outras áreas privadas.'),
  item('world-school-map','worlds','Escola completa','Abra o mapa da Escola e percorra módulos/aulas.','São 17 módulos e 124 aulas, sem bloco vazio ou “em breve”.'),
  item('world-school-progress','worlds','Progresso da Escola','Marque uma aula, saia e volte.','O progresso reaparece e a interface informa claramente onde continuar.'),
  item('world-journal-local','worlds','Diário local por padrão','Crie uma entrada de teste sem ativar sincronização.','A entrada permanece no aparelho e não aparece em analytics/Admin.'),
  item('world-journal-lifecycle','worlds','Ciclo do Diário','Edite, reabra, exporte se disponível e exclua a entrada de teste.','As ações confirmam estado e a exclusão remove apenas a entrada escolhida.'),
  item('world-whit-local','worlds','Whit local sem API paga','Use a Whit básica com a rede desligada.','Ela responde dentro do escopo local, com linguagem contextual, sem prometer inteligência ilimitada.'),
  item('world-whit-context','worlds','Contexto só por escolha','Tente usar Diário/Escola como contexto e observe os controles.','Nenhum conteúdo privado atravessa silenciosamente; a seleção e o consentimento são explícitos.'),
  item('world-consultations','worlds','Consulta confiável','Abra Consultas, compare serviços/preços e avance até antes do envio.','Serviços reais, preço e regras estão claros; cobrança real continua bloqueada no STAGING.'),
  item('world-store','worlds','Loja externa e leve','Abra produtos e siga um link de compra.','Divulgação de afiliado fica próxima; checkout, estoque e preço final pertencem à Amazon.'),
  item('world-music','worlds','Música sob escolha','Abra Música e percorra os álbuns sem tocar em play.','Nada toca automaticamente; o player só começa após escolha.'),
  item('world-videos','worlds','Vídeos editoriais reais','Abra De Frente com o Tarot e compare com o estado publicado.','Só episódios publicados aparecem; nenhum episódio é inventado para preencher espaço.'),
  item('world-skins','worlds','Trinta skins e preços','Abra Skins e percorra todo o catálogo.','Existem 30 skins: Clássica grátis e 29 com preço unitário; Premium informa que inclui todas.'),
  item('world-skin-persist','worlds','Skin persiste sem pesar','Aplique uma skin permitida, navegue por cinco páginas e reabra.','A mesma escolha acompanha a Orbe sem alterar tamanho, hitbox ou fluidez.'),

  item('access-keyboard','accessibility','Navegação por teclado','Use Tab, Shift+Tab, Enter, Espaço e Escape sem mouse.','Foco sempre visível, ordem lógica e todos os controles alcançáveis.',DESKTOP),
  item('access-zoom','accessibility','Zoom a 200%','Amplie a página a 200% em Home, Tarot e Conta.','Conteúdo permanece legível, sem perda de função ou rolagem horizontal essencial.'),
  item('access-text-size','accessibility','Texto grande do sistema','Aumente o tamanho de texto/acessibilidade do sistema e reabra.','Títulos e botões não se sobrepõem; conteúdo importante não é truncado.'),
  item('access-reduced-motion','accessibility','Reduzir movimento','Ative “Reduzir movimento” no sistema e navegue novamente.','Transições pesadas desaparecem e a navegação continua imediata.'),
  item('access-voiceover','accessibility','VoiceOver','Com VoiceOver, percorra Home, menu, Tarot e Conta.','Rótulos são compreensíveis, a ordem é lógica e controles não ficam presos.',IOS),
  item('access-talkback','accessibility','TalkBack','Com TalkBack, percorra Home, menu, Tarot e Conta.','Rótulos são compreensíveis, a ordem é lógica e controles não ficam presos.',ANDROID),
  item('access-touch-targets','accessibility','Alvos de toque','Toque nas bordas de botões, cartas, menu e dock.','Controles importantes possuem alvo confortável e não acionam vizinhos.',MOBILE),
  item('access-contrast','accessibility','Contraste e leitura','Leia textos principais em brilho baixo e alto.','Texto funcional permanece distinguível do fundo; informação não depende apenas de cor.'),

  item('pwa-install','pwa','Instalação do PWA','Use o fluxo de instalação adequado ao perfil.','Ícone, nome e abertura standalone aparecem sem instrução enganosa.',[...MOBILE,'desktop-chrome','desktop-edge']),
  item('pwa-cold-offline','pwa','Abertura offline fria','Prepare o núcleo, feche totalmente, desligue a rede e abra pelo ícone.','Shell e mundos gratuitos preparados abrem; ações online explicam a necessidade de conexão.',PWA),
  item('pwa-free-premium','pwa','Separação free/premium offline','Prepare apenas o núcleo gratuito e inspecione os controles Premium.','Conteúdo Premium não é liberado por cache; benefícios dependem da autoridade da Conta.',PWA),
  item('pwa-update','pwa','Atualização sem tela velha','Com uma versão anterior aberta, publique/instale a nova e reabra.','A atualização troca o shell de forma íntegra, sem misturar versões.'),
  item('pwa-recovery','pwa','Recuperação do shell','Use “mostrar/atualizar portal” quando o carregamento for simulado como lento.','O portal volta sem exigir limpar todos os dados do navegador.'),
  item('pwa-network-return','pwa','Rede volta durante uso','Abra offline e religue a rede antes de usar Conta/Consultas.','Recursos online voltam a responder sem duplicar conteúdo ou recarregar a Orbe.'),
  item('pwa-admin-private-cache','pwa','Admin fora do cache','Abra Admin online, saia, desligue a rede e tente voltar.','Dados administrativos não reaparecem por cache offline.',PWA),

  item('security-account-register','security','Criação e verificação da Conta','Cadastre uma conta de teste, confirme o e-mail e entre.','A Conta só recebe autoridade após confirmação; mensagens não expõem existência indevida.'),
  item('security-session','security','Sessão e logout','Entre, navegue, saia e use Voltar.','A área autenticada se bloqueia e dados protegidos não reaparecem pela navegação.'),
  item('security-export','security','Exportar meus dados','Na Conta autenticada, solicite exportação.','O fluxo exige sessão e entrega somente os dados autorizados da própria conta.'),
  item('security-delete','security','Excluir minha conta','Em conta de teste descartável, percorra o fluxo até a confirmação final.','Há confirmação crítica; a exclusão não pode ser disparada silenciosamente.'),
  item('security-consent','security','Consentimento opcional','Ative, salve e revogue analytics/marketing no Centro de Privacidade.','Essenciais ficam separados; a revogação é clara e não abre conteúdo íntimo.'),
  item('security-admin-deny','security','Conta comum recebe 403','Com uma conta comum verificada, tente abrir a Central.','Nenhum módulo ou agregado administrativo é entregue.'),
  item('security-owner-mfa','security','Proprietária + MFA/AAL2','Com o e-mail oficial verificado, entre no Admin e conclua TOTP.','Senha sozinha não abre a Central; MFA/AAL2 é obrigatório.'),
  item('security-recovery','security','Recovery code de uso único','Em ambiente controlado, use um código de recuperação e tente reutilizá-lo.','O primeiro uso revoga MFA/sessões; a reutilização é recusada.'),
  item('security-admin-content','security','Conteúdo sem programação','No Admin, crie um rascunho de vídeo, revise e publique no STAGING.','O item publicado aparece no mundo público sem editar código; rascunho permanece privado.')
]);

export const PHYSICAL_MATRIX_CONTRACT_V547=Object.freeze({
  release:'V547',schema:'divina-bruxa-physical-matrix-v547',profiles:PHYSICAL_PROFILES_V547.length,
  cases:PHYSICAL_CASES_V547.length,automaticPasses:0,networkRequests:0,rawUserAgentStored:false,
  privateContentFields:0,localOnly:true,environment:'staging'
});

const STORAGE_KEY='divina-physical-matrix-v547';
const VALID_STATUS=new Set(['pending','pass','fail','blocked']);
const safeText=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const profileById=id=>PHYSICAL_PROFILES_V547.find(profile=>profile.id===id)||PHYSICAL_PROFILES_V547[0];
const applicable=(test,profileId)=>!Array.isArray(test.profiles)||test.profiles.includes(profileId);
const dateLabel=value=>{try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value));}catch{return '—';}};

const browserName=()=>{
  const ua=navigator.userAgent||'';
  if(/Edg\//.test(ua))return 'Edge';if(/Firefox\//.test(ua))return 'Firefox';
  if(/Chrome\//.test(ua)&&!/Edg\//.test(ua))return 'Chrome';if(/Safari\//.test(ua))return 'Safari';return 'Outro';
};
const osName=()=>{
  const ua=navigator.userAgent||'';
  if(/iPad/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))return 'iPadOS';
  if(/iPhone|iPod/.test(ua))return 'iOS';if(/Android/.test(ua))return 'Android';
  if(/Mac/.test(ua))return 'macOS';if(/Win/.test(ua))return 'Windows';if(/Linux/.test(ua))return 'Linux';return 'Outro';
};
const deviceFacts=()=>Object.freeze({
  browser:browserName(),os:osName(),
  viewport:`${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`,
  screen:`${screen.width} × ${screen.height}`,
  dpr:Number(devicePixelRatio||1).toFixed(2),
  touchPoints:Number(navigator.maxTouchPoints||0),
  pointer:matchMedia('(pointer: coarse)').matches?'toque':'preciso',
  reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,
  standalone:matchMedia('(display-mode: standalone)').matches||navigator.standalone===true,
  online:navigator.onLine,
  serviceWorker:'serviceWorker' in navigator
});
const suggestedProfile=()=>{
  const facts=deviceFacts();
  if(facts.os==='iOS')return facts.standalone?'iphone-pwa':'iphone-safari';
  if(facts.os==='iPadOS')return 'ipad-safari';
  if(facts.os==='Android')return facts.standalone?'android-pwa':'android-chrome';
  if(facts.browser==='Safari')return 'mac-safari';if(facts.browser==='Firefox')return 'desktop-firefox';
  if(facts.browser==='Edge')return 'desktop-edge';return 'desktop-chrome';
};

const blankState=()=>({schema:PHYSICAL_MATRIX_CONTRACT_V547.schema,release:'V547',currentProfile:suggestedProfile(),results:{},updatedAt:null});
const readState=()=>{
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!raw||raw.schema!==PHYSICAL_MATRIX_CONTRACT_V547.schema)return blankState();
    return {...blankState(),...raw,results:raw.results&&typeof raw.results==='object'?raw.results:{}};
  }catch{return blankState();}
};
const writeState=state=>{
  state.updatedAt=new Date().toISOString();
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}
};

class PhysicalMatrixV547{
  constructor(){
    this.state=readState();this.search='';this.group='all';this.status='all';this.abort=new AbortController();
    this.profile=document.querySelector('[data-profile]');this.cases=document.querySelector('[data-cases]');this.live=document.querySelector('[data-live]');
    this.install();this.renderFacts();this.render();this.bind();
    document.documentElement.dataset.physicalMatrix='v547';
  }

  install(){
    if(this.profile)this.profile.innerHTML=PHYSICAL_PROFILES_V547.map(profile=>`<option value="${profile.id}">${safeText(profile.label)}</option>`).join('');
    if(this.profile)this.profile.value=profileById(this.state.currentProfile).id;
    const group=document.querySelector('[data-group-filter]');
    if(group)group.insertAdjacentHTML('beforeend',Object.entries(GROUPS).map(([id,label])=>`<option value="${id}">${safeText(label)}</option>`).join(''));
  }

  bind(){
    const {signal}=this.abort;
    this.profile?.addEventListener('change',()=>{this.state.currentProfile=profileById(this.profile.value).id;writeState(this.state);this.render();this.say(`Perfil alterado para ${profileById(this.state.currentProfile).label}.`);},{signal});
    document.querySelector('[data-search]')?.addEventListener('input',event=>{this.search=String(event.currentTarget.value||'').trim().toLocaleLowerCase('pt-BR');this.render();},{signal});
    document.querySelector('[data-group-filter]')?.addEventListener('change',event=>{this.group=event.currentTarget.value;this.render();},{signal});
    document.querySelector('[data-status-filter]')?.addEventListener('change',event=>{this.status=event.currentTarget.value;this.render();},{signal});
    this.cases?.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-case][data-status]');if(!button)return;
      this.mark(button.dataset.case,button.dataset.status);
    },{signal});
    document.querySelector('[data-export]')?.addEventListener('click',()=>this.export(),{signal});
    document.querySelector('[data-reset]')?.addEventListener('click',()=>this.reset(),{signal});
  }

  profileResults(){
    const id=this.state.currentProfile;
    if(!this.state.results[id]||typeof this.state.results[id]!=='object')this.state.results[id]={};
    return this.state.results[id];
  }

  result(testId){
    const value=this.profileResults()[testId];
    return value&&VALID_STATUS.has(value.status)?value:{status:'pending',checkedAt:null};
  }

  mark(testId,status){
    const test=PHYSICAL_CASES_V547.find(candidate=>candidate.id===testId);
    if(!test||!applicable(test,this.state.currentProfile)||!VALID_STATUS.has(status))return;
    const results=this.profileResults();
    if(status==='pending')delete results[testId];
    else results[testId]={status,checkedAt:new Date().toISOString()};
    const saved=writeState(this.state);
    this.render();
    this.say(`${test.title}: ${status==='pass'?'passou':status==='fail'?'falhou':status==='blocked'?'bloqueado':'voltou a não executado'}${saved?'':' (não foi possível persistir neste navegador)'}.`);
  }

  visibleTests(){
    return PHYSICAL_CASES_V547.filter(test=>{
      if(!applicable(test,this.state.currentProfile))return false;
      const state=this.result(test.id).status;
      const text=`${test.title} ${test.steps} ${test.expected}`.toLocaleLowerCase('pt-BR');
      return (this.group==='all'||test.group===this.group)&&(this.status==='all'||state===this.status)&&(!this.search||text.includes(this.search));
    });
  }

  render(){
    const tests=this.visibleTests();
    if(this.cases){
      const byGroup=new Map();for(const test of tests){if(!byGroup.has(test.group))byGroup.set(test.group,[]);byGroup.get(test.group).push(test);}
      this.cases.innerHTML=tests.length?[...byGroup].map(([group,items])=>`<section class="lab-group" aria-labelledby="group-${group}"><h3 id="group-${group}">${safeText(GROUPS[group])}</h3>${items.map(test=>this.card(test)).join('')}</section>`).join(''):'<p class="lab-empty">Nenhum teste corresponde aos filtros atuais.</p>';
    }
    this.renderProgress();
  }

  card(test){
    const result=this.result(test.id),labels={pending:'NÃO EXECUTADO',pass:'PASSOU',fail:'FALHOU',blocked:'BLOQUEADO'};
    return `<article class="lab-case" data-state="${result.status}"><header class="lab-case__head"><div><small>${safeText(test.id.toUpperCase())}</small><h4>${safeText(test.title)}</h4></div><span class="lab-case__state">${labels[result.status]}</span></header><div class="lab-case__body"><p><b>COMO TESTAR</b>${safeText(test.steps)}</p><p><b>RESULTADO ESPERADO</b>${safeText(test.expected)}</p></div><div class="lab-case__actions" aria-label="Resultado de ${safeText(test.title)}"><button type="button" data-case="${test.id}" data-status="pass" aria-pressed="${result.status==='pass'}">PASSOU</button><button type="button" data-case="${test.id}" data-status="fail" aria-pressed="${result.status==='fail'}">FALHOU</button><button type="button" data-case="${test.id}" data-status="blocked" aria-pressed="${result.status==='blocked'}">BLOQUEADO</button><button type="button" data-case="${test.id}" data-status="pending" aria-pressed="${result.status==='pending'}">LIMPAR</button></div>${result.checkedAt?`<time datetime="${safeText(result.checkedAt)}">Marcado em ${safeText(dateLabel(result.checkedAt))}</time>`:''}</article>`;
  }

  renderProgress(){
    const applicableTests=PHYSICAL_CASES_V547.filter(test=>applicable(test,this.state.currentProfile));
    const results=applicableTests.map(test=>this.result(test.id));
    const executed=results.filter(result=>result.status!=='pending').length,passed=results.filter(result=>result.status==='pass').length,failed=results.filter(result=>result.status==='fail').length,blocked=results.filter(result=>result.status==='blocked').length;
    const percent=applicableTests.length?Math.round(executed/applicableTests.length*100):0;
    document.querySelector('[data-progress-bar]')?.style.setProperty('--lab-progress',`${percent}%`);
    const label=document.querySelector('[data-progress-label]'),truth=document.querySelector('[data-progress-truth]');
    if(label)label.textContent=`${executed} de ${applicableTests.length} executados · ${passed} passaram`;
    if(truth)truth.textContent=failed?`${failed} falha(s) exigem correção.`:blocked?`${blocked} bloqueio(s) ainda precisam de aparelho, conta ou infraestrutura.`:executed===applicableTests.length?'Todos foram executados; revise a evidência antes do selo final.':'Testes pendentes continuam sem aprovação.';
  }

  renderFacts(){
    const facts=deviceFacts(),root=document.querySelector('[data-device-facts]');if(!root)return;
    const rows=[['Sistema',facts.os],['Navegador',facts.browser],['Viewport',facts.viewport],['Tela',facts.screen],['Densidade',facts.dpr],['Pontos de toque',facts.touchPoints],['Ponteiro',facts.pointer],['Reduzir movimento',facts.reducedMotion?'sim':'não'],['Standalone',facts.standalone?'sim':'não'],['Rede ao abrir',facts.online?'online':'offline'],['Service Worker',facts.serviceWorker?'disponível':'indisponível']];
    root.innerHTML=rows.map(([label,value])=>`<div><dt>${safeText(label)}</dt><dd>${safeText(value)}</dd></div>`).join('');
  }

  export(){
    const results={};
    for(const profile of PHYSICAL_PROFILES_V547){
      const source=this.state.results[profile.id]||{},clean={};
      for(const test of PHYSICAL_CASES_V547){const value=source[test.id];if(value&&VALID_STATUS.has(value.status)&&value.status!=='pending')clean[test.id]={status:value.status,checkedAt:value.checkedAt||null};}
      results[profile.id]=clean;
    }
    const payload={...PHYSICAL_MATRIX_CONTRACT_V547,exportedAt:new Date().toISOString(),currentProfile:this.state.currentProfile,deviceFacts:deviceFacts(),results,privacy:{rawUserAgent:false,name:false,email:false,credentials:false,privateContent:false}};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),anchor=document.createElement('a');
    anchor.href=URL.createObjectURL(blob);anchor.download=`divina-bruxa-matriz-fisica-v547-${new Date().toISOString().slice(0,10)}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(anchor.href),1000);
    this.say('Matriz sanitizada exportada. Nenhum dado foi enviado pela internet.');
  }

  reset(){
    const label=profileById(this.state.currentProfile).label;
    if(!globalThis.confirm?.(`Zerar somente os resultados de ${label}?`))return;
    delete this.state.results[this.state.currentProfile];writeState(this.state);this.render();this.say(`Resultados de ${label} zerados.`);
  }

  say(message){if(this.live)this.live.textContent=message;}
  destroy(){this.abort.abort();delete document.documentElement.dataset.physicalMatrix;}
}

if(typeof document!=='undefined'){
  const start=()=>{
    const core=new PhysicalMatrixV547();
    globalThis.divinaPhysicalMatrixV547=Object.freeze({core,contract:PHYSICAL_MATRIX_CONTRACT_V547,status:()=>({profile:core.state.currentProfile,updatedAt:core.state.updatedAt}),automaticPasses:0,apiCalls:0});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else queueMicrotask(start);
}
