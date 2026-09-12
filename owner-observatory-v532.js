/* DIVINA BRUXA — MACROETAPA 8/10 · OBSERVATÓRIO DA PROPRIETÁRIA V532
   Uma camada visual sobre AdminEngine V532, usando a mesma sessão HttpOnly,
   a mesma autoridade owner + MFA/AAL2 e somente agregados sanitizados. */

const RELEASE='V532';
const STYLE_ID='divinaOwnerObservatoryV532Styles';
const CROWN_ID='ownerObservatoryCrownV532';
const MANAGED=Object.freeze([
  'today','finance','users','subscriptions','ai','tarot','school','consultations',
  'store','skins','seo','security','backups','audit','settings'
]);
const SPECIALIZED=Object.freeze(['media','notifications','analytics']);

const safe=value=>String(value??'').replace(/[&<>"']/g,character=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[character]));
const integer=value=>Math.max(0,Math.floor(Number(value)||0));
const decimal=(value,digits=2)=>new Intl.NumberFormat('pt-BR',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(Number(value)||0);
const brl=value=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(integer(value)/100);
const usd=value=>`US$ ${decimal(value,Math.abs(Number(value)||0)<.01?6:2)}`;
const stamp=value=>{try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}).format(new Date(value));}catch{return '—';}};
const list=value=>Array.isArray(value)?value:[];
const yesNo=value=>value===true?'ATIVO':'BLOQUEADO';
const percent=value=>`${integer(value)}%`;
const LABELS=Object.freeze({
  active:'ativo',allowed:'permitido',archived:'arquivado',cancelled:'cancelado',completed:'concluído',draft:'rascunho',
  denied:'negado',failed:'falhou',paid:'pago',pending:'pendente',processing:'processando',published:'publicado',
  received:'recebida',refunded:'reembolsado',revoked:'revogado',success:'sucesso',settled:'concluído',unknown:'sem sinal',
  'mesa-real-profissional':'Mesa Real Profissional','leitura-mentes':'Leitura de Pensamentos',
  'carta-conselho':'Carta de Conselho','pergunta-direta':'Pergunta',premium_lifetime:'Premium vitalício',
  orbe_ai_monthly:'Orbe IA mensal',credits_200:'200 créditos',credits_600:'600 créditos',credits_1500:'1.500 créditos',
  pt:'Português','pt-BR':'Português · Brasil',en:'Inglês',es:'Espanhol',web:'Web',ios:'iOS',android:'Android'
});
const human=value=>LABELS[String(value)]||String(value||'sem sinal').replaceAll('_',' ').replaceAll('-',' ');

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const link=document.createElement('link');
  link.id=STYLE_ID;link.rel='stylesheet';link.href='./owner-observatory-v532.css?v=532';
  document.head.append(link);
}

function scorecards(items){
  return `<section class="oov532-scorecards" aria-label="Indicadores do módulo">${items.map(item=>`
    <article class="${item.tone?`is-${safe(item.tone)}`:''}"><small>${safe(item.label)}</small><strong>${safe(item.value)}</strong><span>${safe(item.detail||'')}</span></article>`).join('')}</section>`;
}

function bars(items,empty='Ainda não há sinal neste recorte.'){
  const values=list(items),max=Math.max(1,...values.map(item=>integer(item.count)));
  if(!values.length)return `<p class="oov532-empty">${safe(empty)}</p>`;
  return `<div class="oov532-bars">${values.slice(0,18).map(item=>`
    <div><span><b>${safe(human(item.key))}</b><small>${integer(item.count)}</small></span><i><em style="--oov532-value:${Math.max(.035,integer(item.count)/max)}"></em></i></div>`).join('')}</div>`;
}

function facts(items){
  return `<dl class="oov532-facts">${items.map(item=>`
    <div><dt>${safe(item.label)}</dt><dd class="${item.tone?`is-${safe(item.tone)}`:''}">${safe(item.value)}</dd>${item.detail?`<small>${safe(item.detail)}</small>`:''}</div>`).join('')}</dl>`;
}

function panel(eyebrow,title,content,badge=''){return `<article class="oov532-panel"><header><div><p class="eyebrow">${safe(eyebrow)}</p><h5>${safe(title)}</h5></div>${badge?`<span>${safe(badge)}</span>`:''}</header>${content}</article>`;}

function gateFacts(values){
  return list(values).map(item=>({
    label:human(item.key),value:yesNo(item.enabled),tone:item.enabled?'warning':'safe',detail:item.updatedAt?`revisto ${stamp(item.updatedAt)}`:''
  }));
}

function eventLedger(events){
  const rows=list(events);
  if(!rows.length)return '<p class="oov532-empty">Nenhuma ação administrativa registrada ainda.</p>';
  return `<div class="oov532-ledger">${rows.slice(0,30).map(item=>`
    <div><span><b>${safe(human(item.action))}</b><small>${safe(human(item.moduleId))}</small></span><em class="is-${safe(item.result==='allowed'?'safe':item.result==='denied'?'warning':'muted')}">${safe(human(item.result))}</em><time>${safe(stamp(item.createdAt))}</time></div>`).join('')}</div>`;
}

function specFor(id,d){
  const metric=d.metrics||{};
  switch(id){
    case 'today':return {
      sigil:'✦',eyebrow:'HOJE · CÉREBRO OPERACIONAL',title:'O universo inteiro em uma única vigília.',
      copy:'Prioridades reais do STAGING, sem transformar lacunas em números inventados.',
      cards:[
        {label:'CONTAS',value:integer(metric.registeredAccounts),detail:'registradas'},
        {label:'CONSULTAS',value:integer(metric.openConsultations),detail:'abertas'},
        {label:'SANDBOX · 30D',value:brl(metric.sandboxRevenueCents30d),detail:`${integer(metric.paidPurchases30d)} compras pagas`},
        {label:'ORBE IA · 30D',value:integer(metric.aiCredits30d),detail:'créditos'},
        {label:'PRIVACIDADE',value:integer(metric.pendingPrivacyRequests),detail:'pedidos pendentes',tone:metric.pendingPrivacyRequests?'warning':'safe'},
        {label:'SEGURANÇA',value:integer(metric.deniedAdminActions30d),detail:'negações · 30d',tone:metric.deniedAdminActions30d?'warning':'safe'},
        {label:'VÍDEOS',value:integer(metric.videoDrafts),detail:'rascunhos'}
      ],
      panels:[
        panel('CONSULTAS','Fila por estado',bars(d.consultationStatus,'Nenhuma consulta no STAGING.'),'SEM PERGUNTAS'),
        panel('PORTÕES','Tudo que continua fechado',facts(gateFacts(d.runtimeGates)),'FAIL CLOSED')
      ],
      covenant:'DAU/WAU/MAU oficial permanece indisponível até existir instrumentação consentida em todos os mundos.'
    };
    case 'finance':return {
      sigil:'◇',eyebrow:'FINANCEIRO · STAGING',title:'Receita vista sem confundir simulação com produção.',
      copy:'Compras, assinaturas e catálogo aparecem por estado e produto, sem nomes, e-mails ou identificadores de pagamento.',
      cards:[
        {label:'RECEITA · 30D',value:brl(metric.grossCents30d),detail:'sandbox pago'},
        {label:'COMPRAS · 30D',value:integer(metric.paid30d),detail:'pagas'},
        {label:'REEMBOLSOS · 90D',value:integer(metric.refunds90d),detail:'registrados'},
        {label:'PENDÊNCIAS · 90D',value:integer(metric.pending90d),detail:'pagamentos'},
        {label:'ASSINATURAS',value:integer(metric.activeSubscriptions),detail:'ativas'}
      ],
      panels:[panel('CONCILIAÇÃO','Estados das compras',bars(d.byStatus),'90 DIAS'),panel('PRODUTOS','Receita por oferta',bars(d.byProduct),'SEM CLIENTES'),panel('PLATAFORMA','Origem técnica',bars(d.byPlatform),'AGREGADO'),panel('ASSINATURAS','Ciclo mensal',bars(d.subscriptions),'AUTORIDADE SERVIDOR')],
      covenant:'Billing real continua bloqueado. Todos os valores exibidos pertencem ao ambiente STAGING.'
    };
    case 'users':return {
      sigil:'◎',eyebrow:'USUÁRIAS E CRM · PRIVACY FIRST',title:'Pessoas como contagens, nunca como exposição.',
      copy:'O Observatório acompanha crescimento, consentimento e solicitações LGPD sem retornar perfil, contato ou conteúdo pessoal.',
      cards:[
        {label:'CONTAS',value:integer(metric.registeredAccounts),detail:'registradas'},
        {label:'NOVAS · 30D',value:integer(metric.newAccounts30d),detail:'contas'},
        {label:'18+',value:integer(metric.adultDeclarationCount),detail:'declarações'},
        {label:'LGPD',value:integer(metric.pendingPrivacyRequests),detail:'pedidos pendentes',tone:metric.pendingPrivacyRequests?'warning':'safe'},
        {label:'MARKETING',value:integer(d.preferences?.marketingOptIn),detail:'opt-ins'},
        {label:'DIÁRIO NA NUVEM',value:integer(d.preferences?.journalCloudOptIn),detail:'opt-ins explícitos'}
      ],
      panels:[panel('IDIOMAS','Distribuição de locale',bars(d.locales),'AGREGADO'),panel('LGPD','Pedidos por tipo',bars(d.privacyByKind),'SEM NOTAS'),panel('CONSENTIMENTO','Eventos por escolha',bars(d.consentsByKey),'90 DIAS'),panel('ESTADO','Pedidos por status',bars(d.privacyByStatus),'RASTREÁVEL')],
      covenant:'CRM agregado: nomes, e-mails, telefones, fusos e corpos de conteúdo não entram na resposta.'
    };
    case 'subscriptions':return {
      sigil:'♕',eyebrow:'PREMIUM E ASSINATURAS',title:'Direitos concedidos pelo servidor, sem atalhos no navegador.',
      copy:'Premium vitalício, Orbe IA e créditos permanecem produtos separados, restauráveis e auditáveis.',
      cards:[
        {label:'ASSINATURAS',value:integer(metric.activeSubscriptions),detail:'ativas'},
        {label:'CANCELAR AO FIM',value:integer(metric.cancelAtPeriodEnd),detail:'ciclos'},
        {label:'DIREITOS',value:integer(metric.activeEntitlements),detail:'ativos'},
        {label:'COMPRAS',value:integer(metric.paidPurchases),detail:'pagas'},
        {label:'PREMIUM',value:brl(d.premiumLifetimeCents),detail:'uma vez'},
        {label:'ORBE IA',value:brl(d.aiMonthlyCents),detail:`mensal · ${integer(d.aiCreditsPerCycle)} créditos`}
      ],
      panels:[panel('ASSINATURAS','Estado dos ciclos',bars(d.subscriptionStatus),'SERVIDOR'),panel('DIREITOS','Estado dos acessos',bars(d.entitlementStatus),'RESTORE'),panel('CATÁLOGO','Direitos por chave',bars(d.entitlementsByKey),'SEM IDENTIDADE'),panel('COMPRAS','Produtos adquiridos',bars(d.purchasesByProduct),'AGREGADO')],
      covenant:'Premium inclui as 30 skins, mas não inclui Orbe IA. Billing real permanece fechado.'
    };
    case 'ai':return {
      sigil:'◉',eyebrow:'ORBE IA · CUSTO E LIMITES',title:'Consumo mensurável; conversas continuam invisíveis.',
      copy:'O painel recebe tokens, créditos, custo, latência e estados técnicos — nunca prompts ou respostas.',
      cards:[
        {label:'REQUESTS · 30D',value:integer(metric.requests30d),detail:'total'},
        {label:'SUCESSO · 30D',value:integer(metric.successful30d),detail:'concluídos'},
        {label:'CRÉDITOS · 30D',value:integer(metric.credits30d),detail:'consumidos'},
        {label:'CUSTO ESTIMADO',value:usd(metric.estimatedCostUsd30d),detail:'30 dias'},
        {label:'LATÊNCIA MÉDIA',value:`${integer(metric.averageLatencyMs)} ms`,detail:'requests'},
        {label:'SOL',value:'OFF',detail:'bloqueado',tone:'safe'}
      ],
      panels:[panel('MODELOS','Uso por modelo',bars(d.byModel),'30 DIAS'),panel('MODOS','Uso por experiência',bars(d.byMode),'SEM PROMPTS'),panel('ESTADOS','Saúde das requests',bars(d.byStatus),'AGREGADO'),panel('TOKENS E SALDOS','Consumo técnico',facts([{label:'Tokens de entrada',value:integer(metric.inputTokens30d)},{label:'Entrada em cache',value:integer(metric.cachedInputTokens30d)},{label:'Tokens de saída',value:integer(metric.outputTokens30d)},{label:'Créditos em carteiras',value:integer(metric.walletCredits)}]),'30 DIAS'),panel('LIMITES','Kill switches e tetos',facts([{label:'Orbe IA',value:yesNo(d.limits?.orbeAIEnabled),tone:d.limits?.orbeAIEnabled?'safe':'warning'},{label:'Sol',value:'BLOQUEADO',tone:'safe'},{label:'Créditos globais/dia',value:integer(d.limits?.globalDailyCredits)},{label:'Requests globais/dia',value:integer(d.limits?.globalDailyRequests)},{label:'Custo global/dia',value:usd(d.limits?.globalDailyCostUsd)},{label:'Entrada máxima',value:`${integer(d.limits?.maxInputCharacters)} caracteres`}]),'SERVER GATE')],
      covenant:'Prompts, respostas e histórico de conversas: 0 campos retornados.'
    };
    case 'tarot':return {
      sigil:'▣',eyebrow:'TAROT · INTEGRIDADE',title:'As 78 cartas permanecem uma única verdade.',
      copy:'O Observatório acompanha uso e integridade sem ver perguntas, sínteses ou cartas ligadas a uma pessoa.',
      cards:[
        {label:'BARALHO',value:integer(metric.canonicalCards),detail:'cartas oficiais'},
        {label:'CARTA DO DIA',value:integer(metric.dailyDraws30d),detail:'aberturas · 30d'},
        {label:'ÚLTIMAS 24H',value:integer(metric.dailyDraws24h),detail:'aberturas'},
        {label:'LEITURAS',value:integer(metric.completedReadings30d),detail:'30 dias'},
        {label:'SESSÕES',value:integer(metric.spreadSessions30d),detail:'tiragens · 30d'},
        {label:'MESA REAL',value:'13 × 6',detail:'78 posições'}
      ],
      panels:[panel('TIRAGENS','Leituras por método',bars(d.readingsBySpread),'NORMAL ONLY'),panel('SESSÕES','Estado das tiragens',bars(d.sessionsByStatus),'SEM PERGUNTAS'),panel('CONTRATO','Regras do baralho',facts([{label:'Cartas',value:'78'},{label:'Orientação',value:'normal only'},{label:'Repetições',value:'bloqueadas'},{label:'Métodos',value:'15'},{label:'Cruz Celta',value:'10 posições'},{label:'Mesa Real',value:'13 × 6'}]),'V528')],
      covenant:'Perguntas, sínteses e combinações pessoais não são lidas pelo Admin.'
    };
    case 'school':return {
      sigil:'▤',eyebrow:'ESCOLA · SABEDORIA VIVA',title:'17 módulos e 124 aulas, agora sem desvio.',
      copy:'Progresso e favoritos entram apenas como agregados; anotações de estudo e Diário não entram.',
      cards:[
        {label:'MÓDULOS',value:integer(metric.canonicalModules),detail:'oficiais'},
        {label:'AULAS',value:integer(metric.canonicalLessons),detail:'oficiais'},
        {label:'REGISTROS',value:integer(metric.progressRecords),detail:'de progresso'},
        {label:'CONCLUÍDAS',value:integer(metric.completed),detail:'registros'},
        {label:'EM CURSO',value:integer(metric.inProgress),detail:'registros'},
        {label:'PROGRESSO MÉDIO',value:percent(metric.averageProgressPercent),detail:'agregado'},
        {label:'FAVORITOS',value:integer(metric.favorites),detail:'marcações'}
      ],
      panels:[panel('JORNADA','Progresso por estado',bars(d.progressByStatus),'SEM NOMES'),panel('INTERESSE','Aulas mais favoritadas',bars(d.popularLessons),'AGREGADO')],
      covenant:'Anotações, respostas de exercícios e vínculos com o Diário permanecem invisíveis.'
    };
    case 'consultations':return {
      sigil:'♙',eyebrow:'CONSULTAS · OPERAÇÃO HUMANA',title:'Fila operacional sem abrir a intimidade da pergunta.',
      copy:'Estados, serviços e snapshots de valor orientam o trabalho; contato, protocolo e pergunta não chegam ao Observatório.',
      cards:[
        {label:'PEDIDOS · 90D',value:integer(metric.requests90d),detail:'recebidos'},
        {label:'ABERTAS',value:integer(metric.open),detail:'na fila'},
        {label:'CONCLUÍDAS',value:integer(metric.completed90d),detail:'90 dias'},
        {label:'VALOR EM SNAPSHOTS',value:brl(metric.valueSnapshotCents90d),detail:'90 dias'},
        {label:'MOVIMENTOS',value:integer(metric.statusMoves90d),detail:'de status'}
      ],
      panels:[panel('SERVIÇOS','Pedidos por consulta',bars(d.byService),'SEM PERGUNTAS'),panel('FILA','Pedidos por estado',bars(d.byStatus),'OPERACIONAL'),panel('PAGAMENTO','Estado informado',bars(d.byPaymentStatus),'STAGING')],
      covenant:'Nome, e-mail, telefone, protocolo e pergunta da consulta: 0 campos retornados.'
    };
    case 'store':return {
      sigil:'⌘',eyebrow:'LOJA MÍSTICA · CURADORIA',title:'Catálogo, política e interesse em uma visão honesta.',
      copy:'A Loja continua afiliada e externa: sem checkout interno, sem estoque inventado e sem capturar pagamento.',
      cards:[
        {label:'CURADORIA',value:integer(metric.affiliateProducts),detail:'produtos'},
        {label:'PUBLICADOS',value:integer(metric.publishedAffiliateProducts),detail:'itens'},
        {label:'DESTAQUES',value:integer(metric.featured),detail:'itens'},
        {label:'POLÍTICA REVISTA',value:integer(metric.policyReviewed),detail:'itens'},
        {label:'INTERESSE · 30D',value:integer(metric.productEvents30d),detail:'eventos consentidos'},
        {label:'CHECKOUT INTERNO',value:'0',detail:'sempre externo',tone:'safe'}
      ],
      panels:[panel('CATEGORIAS','Curadoria por mundo',bars(d.byCategory),'AMAZON'),panel('PUBLICAÇÃO','Estados editoriais',bars(d.byStatus),'HONESTO'),panel('IDIOMAS','Curadoria por locale',bars(d.byLocale),'PT · EN · ES'),panel('INTERESSE','Eventos por produto',bars(d.eventsByProduct),'30 DIAS')],
      covenant:'Preço, vendedor, estoque, pagamento e entrega são confirmados no parceiro externo.'
    };
    case 'skins':return {
      sigil:'◆',eyebrow:'SKINS · FORMA DA ORBE',title:'Trinta formas ativas; o arquivo antigo fica arquivado.',
      copy:'O Observatório separa o catálogo publicado dos registros históricos e confirma a autoridade do servidor.',
      cards:[
        {label:'CATÁLOGO OFICIAL',value:integer(metric.canonicalCatalog),detail:'skins'},
        {label:'PUBLICADAS',value:integer(metric.published),detail:'ativas',tone:metric.published===30?'safe':'warning'},
        {label:'ARQUIVADAS',value:integer(metric.archived),detail:'histórico'},
        {label:'GRÁTIS',value:integer(metric.freePublished),detail:'Clássica'},
        {label:'DIREITOS',value:integer(metric.activeEntitlements),detail:'ativos'},
        {label:'EQUIPADAS',value:integer(metric.equippedRecords),detail:'preferências'}
      ],
      panels:[panel('RARIDADE','Catálogo publicado',bars(d.byRarity),'30 ATIVAS'),panel('ORIGEM','Direitos por origem',bars(d.entitlementsBySource),'SERVIDOR'),panel('ESTADO','Direitos por estado',bars(d.entitlementsByStatus),'RESTORE'),panel('PROVEDORES','Produtos configurados',bars(d.productsByProvider),'STAGING')],
      covenant:`Clássica gratuita: ${d.integrity?.classicFree?'confirmada':'atenção'}. Skins continuam 100% cosméticas e não alteram sorte, cartas, IA ou acesso.`
    };
    case 'seo':return {
      sigil:'⌁',eyebrow:'SEO E ASO · DESCOBERTA',title:'O público encontra conteúdo; o privado permanece fora do índice.',
      copy:'Cobertura editorial e idiomas são medidos sem transformar Conta, Diário ou Admin em páginas públicas.',
      cards:[
        {label:'VÍDEOS',value:integer(metric.publishedVideos),detail:'publicados'},
        {label:'SEO COMPLETO',value:integer(metric.videoSeoComplete),detail:'vídeos'},
        {label:'MÚSICA',value:integer(metric.publishedMusic),detail:'lançamentos'},
        {label:'EPISÓDIOS TAROT',value:integer(metric.publishedTarotEpisodes),detail:'publicados'},
        {label:'IDIOMAS',value:3,detail:'PT · EN · ES'},
        {label:'ROTAS PRIVADAS',value:3,detail:'noindex'}
      ],
      panels:[panel('VÍDEOS','Publicação por locale',bars(d.videoLocales),'PÚBLICO'),panel('MÚSICA','Lançamentos por locale',bars(d.musicLocales),'PÚBLICO'),panel('TAROT','Episódios por locale',bars(d.tarotLocales),'PÚBLICO'),panel('ÍNDICE','Contrato de descoberta',facts([{label:'Sitemap',value:d.sitemapExpected?'ESPERADO':'AUSENTE'},{label:'Canonical',value:d.canonicalExpected?'ESPERADO':'AUSENTE'},{label:'Hreflang',value:d.hreflangExpected?'ESPERADO':'AUSENTE'},{label:'Conta',value:'NOINDEX',tone:'safe'},{label:'Diário',value:'NOINDEX',tone:'safe'},{label:'Admin',value:'NOINDEX',tone:'safe'}]),'PRIVACY FIRST')],
      covenant:'Publicar em lojas ou produção continua sem autorização nesta etapa.'
    };
    case 'security':return {
      sigil:'⬡',eyebrow:'SEGURANÇA · ZERO ATALHOS',title:'Identidade, sessão e autoridade verificadas no servidor.',
      copy:'A Central só nasce depois de owner ativa, e-mail verificado, MFA/AAL2 e códigos de recuperação.',
      cards:[
        {label:'PROPRIETÁRIAS',value:integer(metric.activeOwners),detail:'ativas'},
        {label:'SESSÕES',value:integer(metric.activeSessions),detail:'ativas'},
        {label:'REVOGADAS',value:integer(metric.revokedSessions),detail:'sessões'},
        {label:'RECUPERAÇÃO',value:integer(metric.unusedRecoveryCodes),detail:'códigos disponíveis'},
        {label:'NEGADAS · 30D',value:integer(metric.deniedActions30d),detail:'ações',tone:metric.deniedActions30d?'warning':'safe'},
        {label:'FALHAS · 30D',value:integer(metric.failedActions30d),detail:'ações',tone:metric.failedActions30d?'warning':'safe'}
      ],
      panels:[panel('SESSÕES','Nível de garantia',bars(d.sessionAssurance),'AAL2'),panel('PORTÕES','Autorizações de risco',facts(gateFacts(d.runtimeGates)),'FAIL CLOSED'),panel('CONTROLES','Contrato obrigatório',facts([{label:'E-mail verificado',value:'OBRIGATÓRIO',tone:'safe'},{label:'MFA / AAL2',value:'OBRIGATÓRIO',tone:'safe'},{label:'Códigos de recuperação',value:'OBRIGATÓRIO',tone:'safe'},{label:'Cookie HttpOnly + Secure',value:'ATIVO',tone:'safe'},{label:'Papel local',value:'NÃO CONFIÁVEL',tone:'safe'},{label:'Ambiente',value:'STAGING',tone:'safe'}]),'OWNER ONLY')],
      covenant:'Contas comuns recebem 403 sem dados administrativos. Segredos nunca chegam ao bundle público.'
    };
    case 'backups':return {
      sigil:'↻',eyebrow:'BACKUPS · RECUPERAÇÃO',title:'O que não está conectado aparece como lacuna, não como promessa.',
      copy:'O registro está isolado no schema privado. A V532 não lê esse cofre pelo navegador nem falsifica execuções.',
      cards:[
        {label:'EXECUÇÕES REPORTADAS',value:integer(metric.reportedRuns),detail:'telemetria desconectada'},
        {label:'RESTORES VERIFICADOS',value:integer(metric.verifiedRestores),detail:'ainda não reportados'},
        {label:'FALHAS',value:integer(metric.failedRuns),detail:'reportadas'},
        {label:'LEITURA PRIVADA',value:'0',detail:'campos',tone:'safe'}
      ],
      panels:[panel('ISOLAMENTO','Cofre de backup',facts([{label:'Schema',value:d.isolation?.schema||'private'},{label:'Leitura pelo navegador',value:'BLOQUEADA',tone:'safe'},{label:'Leitura privada pela V532',value:'0',tone:'safe'},{label:'Telemetria',value:'NÃO CONECTADA',tone:'warning'}]),'PRIVADO'),panel('PRONTIDÃO','Requisitos antes de ativar',facts([{label:'Criptografia',value:'OBRIGATÓRIA'},{label:'Hash do manifesto',value:'OBRIGATÓRIO'},{label:'Teste de restauração',value:'OBRIGATÓRIO'},{label:'Retenção',value:'A CONFIGURAR',tone:'warning'},{label:'Agendamento',value:'A CONFIGURAR',tone:'warning'},{label:'RPO / RTO',value:'A DEFINIR',tone:'warning'}]),'SEM FINGIMENTO')],
      covenant:d.message||'A automação e a restauração precisam ser conectadas antes de qualquer selo operacional.'
    };
    case 'audit':return {
      sigil:'≋',eyebrow:'AUDITORIA · RASTREABILIDADE',title:'Cada ação administrativa deixa um rastro sanitizado.',
      copy:'A visão recente exclui identidade da proprietária, request IDs, metadados sensíveis e qualquer conteúdo de usuária.',
      cards:[
        {label:'EVENTOS RECENTES',value:integer(metric.events),detail:'até 50'},
        {label:'PERMITIDOS',value:integer(metric.allowed),detail:'ações'},
        {label:'NEGADOS',value:integer(metric.denied),detail:'ações',tone:metric.denied?'warning':'safe'},
        {label:'FALHARAM',value:integer(metric.failed),detail:'ações',tone:metric.failed?'warning':'safe'}
      ],
      panels:[panel('MÓDULOS','Eventos por área',bars(d.byModule),'SANITIZADO'),panel('RESULTADOS','Distribuição recente',bars(d.byResult),'SEM IDENTIDADE'),panel('LINHA DO TEMPO','Últimas ações',eventLedger(d.events),'50 MAIS RECENTES')],
      covenant:'Actor IDs, request IDs e metadata: 0 campos retornados. O diagnóstico exportável continua sanitizado.'
    };
    case 'settings':return {
      sigil:'⚙',eyebrow:'CONFIGURAÇÕES · FONTE DA VERDADE',title:'Valores públicos claros; autorizações críticas somente leitura.',
      copy:'A V532 mostra o estado efetivo dos portões sem abrir controles perigosos no frontend.',
      cards:[
        {label:'AMBIENTE',value:'STAGING',detail:'isolado'},
        {label:'CATÁLOGO',value:integer(d.catalog?.items),detail:'itens'},
        {label:'ATIVOS',value:integer(d.catalog?.active),detail:'itens do catálogo'},
        {label:'BILLING REAL',value:'OFF',detail:'bloqueado',tone:'safe'},
        {label:'PRODUÇÃO',value:'OFF',detail:'bloqueada',tone:'safe'},
        {label:'SOL',value:'OFF',detail:'bloqueado',tone:'safe'}
      ],
      panels:[panel('PORTÕES','Estado efetivo',facts(gateFacts(d.runtimeGates)),'SOMENTE LEITURA'),panel('CATÁLOGO','Produtos por tipo',bars(d.catalog?.byType),'SERVIDOR'),panel('PADRÕES','Experiência pública',facts([{label:'Idioma principal',value:d.defaults?.locale||'pt-BR'},{label:'Fuso',value:d.defaults?.timeZone||'America/Sao_Paulo'},{label:'Silêncio',value:d.defaults?.notificationQuietHours||'22:00–08:00'},{label:'Marketing',value:'DESLIGADO POR PADRÃO',tone:'safe'}]),'CANÔNICO')],
      covenant:'Alterações críticas não são oferecidas nesta tela; billing, DNS, produção, lojas e Sol continuam fechados.'
    };
    default:return null;
  }
}

export const OWNER_OBSERVATORY_CONTRACT_V532=Object.freeze({
  release:RELEASE,macroStage:'8/10',route:'admin',modules:18,managedAggregateModules:15,
  specializedModules:SPECIALIZED,placeholderModules:0,ownerOnly:true,verifiedEmailRequired:true,
  mfaAal2Required:true,recoveryCodesRequired:true,secureCookieSession:true,serverRoleAuthority:true,
  oneCanonicalOrb:true,independentOrbEngines:0,independentAuthEngines:0,environment:'staging',
  realBilling:false,productionPublish:false,storeSubmission:false,sol:false,
  journalBodyReads:0,consultationQuestionReads:0,aiPromptReads:0,aiResponseReads:0,
  personalIdentifierReads:0,localStorageReads:0,localStorageWrites:0,privateSchemaReads:0,
  analyticsAuthority:'AdminIntelligenceV322',editorialAuthority:'AdminMediaV320',
  adminAuthority:'AdminEngineV532 + admin-api-v532',permanentAnimationLoops:0
});

export class OwnerObservatoryV532{
  constructor(root,{engine=null,orbCore=null}={}){
    this.root=root;
    this.engine=engine;
    this.orbCore=orbCore||globalThis.divinaOrbSupremeV501?.core||globalThis.orbe?.supreme||null;
    this.cache=new Map();
    this.errors=new Map();
    this.loading=new Set();
    this.abort=new AbortController();
    this.observer=null;
    this.queued=false;
    installStyle();
    this.bind();
    this.observe();
    this.queueMount();
    document.documentElement.dataset.ownerObservatory='v532';
  }

  bind(){
    if(!this.root)return;
    const {signal}=this.abort;
    this.root.addEventListener('click',event=>{
      const open=event.target.closest?.('[data-oov532-open]');
      if(open){
        event.preventDefault();
        const target=String(open.dataset.oov532Open||'');
        if(MANAGED.includes(target)||SPECIALIZED.includes(target))this.root.querySelector(`.admin-sidebar [data-admin-module="${target}"]`)?.click();
        return;
      }
      const refresh=event.target.closest?.('[data-oov532-refresh]');
      if(refresh){event.preventDefault();this.load(refresh.dataset.oov532Refresh,true);return;}
      const nav=event.target.closest?.('[data-admin-module]');
      if(nav){
        const id=String(nav.dataset.adminModule||'today');
        this.orbCore?.pulse?.('owner-observatory',{intensity:.52,moduleId:id,privateContentIncluded:false});
        setTimeout(()=>this.queueMount(),0);
      }
      if(event.target.closest?.('[data-refresh-module]')){
        const id=this.selected();
        if(MANAGED.includes(id)){this.cache.delete(id);this.errors.delete(id);setTimeout(()=>this.load(id,true),0);}
      }
    },{capture:true,signal});
    document.addEventListener('divina:page-ready',event=>{if(event.detail?.id==='admin')this.queueMount();},{signal});
  }

  observe(){
    if(!this.root)return;
    this.observer=new MutationObserver(()=>this.queueMount());
    this.observer.observe(this.root,{childList:true,subtree:true});
  }

  queueMount(){
    if(this.queued)return;
    this.queued=true;
    queueMicrotask(()=>{this.queued=false;this.mount();});
  }

  authorized(){return Boolean(this.root?.querySelector('.admin-v144-shell'));}
  selected(){return String(this.root?.querySelector('.admin-sidebar [data-admin-module][aria-current="page"]')?.dataset.adminModule||'today');}

  mount(){
    if(!this.authorized())return false;
    this.mountCrown();
    const id=this.selected();
    if(SPECIALIZED.includes(id))return true;
    if(!MANAGED.includes(id))return false;
    this.paint(id);
    if(!this.cache.has(id)&&!this.errors.has(id)&&!this.loading.has(id))this.load(id,false);
    return true;
  }

  mountCrown(){
    const shell=this.root.querySelector('.admin-v144-shell'),header=shell?.querySelector('.admin-command-header');
    if(!shell||!header)return;
    let crown=document.getElementById(CROWN_ID);
    if(!crown){crown=document.createElement('section');crown.id=CROWN_ID;crown.className='oov532-crown';header.insertAdjacentElement('afterend',crown);}
    if(crown.dataset.oov532Ready==='true')return;
    crown.dataset.oov532Ready='true';
    crown.innerHTML=`<div class="oov532-crown__mark"><span aria-hidden="true">◉</span><p><small>MACROETAPA 8/10 · V532</small><b>Observatório da Proprietária</b></p></div><div class="oov532-crown__truth"><span><b>18</b><small>áreas reais</small></span><span><b>0</b><small>placeholders</small></span><span><b>AAL2</b><small>acesso</small></span><span><b>0</b><small>leituras íntimas</small></span></div><nav aria-label="Atalhos do Observatório"><button type="button" data-oov532-open="security">SEGURANÇA</button><button type="button" data-oov532-open="backups">BACKUPS</button><button type="button" data-oov532-open="audit">AUDITORIA</button></nav>`;
  }

  async load(id,announce=false){
    if(!MANAGED.includes(id)||this.loading.has(id)||!this.authorized())return;
    this.loading.add(id);this.errors.delete(id);this.paint(id);
    const result=await globalThis.divinaAuth?.adminModule?.(id);
    this.loading.delete(id);
    if(result?.ok&&result.body?.release===RELEASE&&result.body?.sanitized===true&&result.body?.privateContentIncluded===false){
      this.cache.set(id,result.body);this.errors.delete(id);
      if(announce)globalThis.dispatchEvent(new CustomEvent('orbe:toast',{detail:`${human(id)} atualizado no STAGING.`}));
    }else{
      this.errors.set(id,String(result?.body?.error||'observatory_snapshot_unavailable').slice(0,120));
      if(announce)globalThis.dispatchEvent(new CustomEvent('orbe:toast',{detail:'O snapshot sanitizado não respondeu agora.'}));
    }
    this.paint(id);
    document.dispatchEvent(new CustomEvent('divina:owner-observatory-updated',{detail:Object.freeze({release:RELEASE,moduleId:id,ok:this.cache.has(id),privateContentIncluded:false})}));
  }

  paint(id){
    if(!this.authorized()||this.selected()!==id)return;
    if(id==='consultations'){this.paintConsultations();return;}
    const slot=this.root.querySelector('[data-admin-module-content]');
    if(!slot)return;
    const data=this.cache.get(id),error=this.errors.get(id)||'',state=`${id}:${data?.generatedAt||''}:${this.loading.has(id)}:${error}`;
    if(slot.dataset.oov532Stamp===state)return;
    slot.dataset.oov532Stamp=state;
    slot.innerHTML=this.view(id,data,error);
    slot.querySelector('[data-oov532-refresh]')?.addEventListener('click',event=>{event.preventDefault();this.load(id,true);});
  }

  paintConsultations(){
    const host=this.root.querySelector('[data-v532-consultation-host]');
    if(!host)return;
    const id='consultations',data=this.cache.get(id),error=this.errors.get(id)||'',state=`${data?.generatedAt||''}:${this.loading.has(id)}:${error}`;
    if(host.dataset.oov532Stamp===state)return;
    host.dataset.oov532Stamp=state;
    if(!data){host.innerHTML=this.stateCard(id,error);return;}
    const spec=specFor(id,data);
    host.innerHTML=`<section class="oov532-consultation-pulse">${scorecards(spec.cards)}<div class="oov532-grid">${spec.panels.join('')}</div><p class="oov532-covenant"><span>◇</span><span><b>Privacidade operacional.</b>${safe(spec.covenant)}</span></p><footer><span>Snapshot ${safe(data.release)} · ${safe(stamp(data.generatedAt))}</span><button type="button" data-oov532-refresh="consultations">ATUALIZAR FILA</button></footer></section>`;
  }

  stateCard(id,error=''){
    return `<section class="oov532-state"><span aria-hidden="true">${error?'◇':'◉'}</span><p><b>${error?'O snapshot não abriu agora.':'Lendo agregados do STAGING…'}</b><small>${error?safe(error):'Nenhum conteúdo íntimo entra nesta leitura.'}</small></p>${error?`<button type="button" data-oov532-refresh="${safe(id)}">TENTAR NOVAMENTE</button>`:''}</section>`;
  }

  view(id,data,error=''){
    if(!data)return this.stateCard(id,error);
    const spec=specFor(id,data);
    if(!spec)return this.stateCard(id,'module_contract_missing');
    return `<section class="oov532-world" data-oov532-managed="${safe(id)}">
      <header class="oov532-hero"><div><p class="eyebrow">${safe(spec.eyebrow)}</p><h4>${safe(spec.title)}</h4><p>${safe(spec.copy)}</p></div><span aria-hidden="true">${safe(spec.sigil)}</span></header>
      ${scorecards(spec.cards)}
      <div class="oov532-grid">${spec.panels.join('')}</div>
      <p class="oov532-covenant"><span>◇</span><span><b>Verdade operacional.</b>${safe(spec.covenant)}</span></p>
      <footer class="oov532-footer"><p><b>Snapshot ${safe(data.release)} · ${safe(data.environment)}</b><small>Gerado ${safe(stamp(data.generatedAt))} · somente agregados sanitizados.</small></p><button type="button" data-oov532-refresh="${safe(id)}">ATUALIZAR SNAPSHOT</button></footer>
    </section>`;
  }

  contract(){return OWNER_OBSERVATORY_CONTRACT_V532;}
  audit(){
    return Object.freeze({
      release:RELEASE,authorized:this.authorized(),selectedModule:this.selected(),loadedModules:[...this.cache.keys()],
      errors:Object.fromEntries(this.errors),privateContentRead:false,personalIdentifiersRead:false,
      localStorageReads:0,privateSchemaReads:0,independentAuthEngines:0,oneCanonicalOrb:true
    });
  }
  status(){return this.audit();}

  destroy(){
    this.abort.abort();this.observer?.disconnect();document.getElementById(CROWN_ID)?.remove();
    delete document.documentElement.dataset.ownerObservatory;
  }
}

export function createOwnerObservatoryV532(root,options={}){
  const core=new OwnerObservatoryV532(root,options);
  globalThis.divinaOwnerObservatoryV532=Object.freeze({
    version:532,core,contract:()=>core.contract(),audit:()=>core.audit(),status:()=>core.status(),
    modules:18,placeholderModules:0,ownerOnly:true,mfaAal2Required:true,oneCanonicalOrb:true,
    independentAuthEngines:0,privateContentReads:0,personalIdentifierReads:0,privateSchemaReads:0,
    realBilling:false,productionPublish:false,sol:false
  });
  if(globalThis.orbe)globalThis.orbe.observatory=core;
  return core;
}
