/* DIVINA BRUXA — CENTRAL DA PROPRIETÁRIA V146
   Contrato owner-only. Nenhuma função administrativa confia em papel salvo no navegador. */

export const ADMIN_POLICY=Object.freeze({
  schemaVersion:'10.2.0',environment:'staging',route:'/admin',ownerOnly:true,
  access:Object.freeze({verifiedEmailRequired:true,mfaRequired:true,recoveryCodesRequired:true,secureCookieSession:true,clientSideRoleForbidden:true,stepUpForCriticalActions:true,unauthorizedBehavior:'403-without-admin-data'}),
  flags:Object.freeze({productionPublishAuthorized:false,dnsChangesAuthorized:false,realBillingAuthorized:false,storeSubmissionAuthorized:false,orbeAISolEnabled:false}),
  privacy:Object.freeze({journalBodiesVisible:false,journalQuestionsVisible:false,aiPromptsVisible:false,aiResponsesVisible:false,consultationQuestionsVisible:false,passwordsVisible:false,secretsVisible:false,analyticsSanitized:true}),
  modules:Object.freeze([
    Object.freeze({id:'today',name:'Hoje',sigil:'✦',group:'Operação',description:'Resumo da operação, alertas e ações prioritárias.'}),
    Object.freeze({id:'finance',name:'Financeiro',sigil:'◇',group:'Receita',description:'Receita, reembolsos, conciliação e produtos separados.'}),
    Object.freeze({id:'users',name:'Usuárias e CRM',sigil:'◎',group:'Pessoas',description:'Contas, acesso, consentimentos e suporte sem senhas.'}),
    Object.freeze({id:'subscriptions',name:'Premium e Assinaturas',sigil:'♕',group:'Receita',description:'Entitlements, compras, restore, refunds e revogações.'}),
    Object.freeze({id:'ai',name:'Orbe IA e Custos',sigil:'◉',group:'Produto',description:'Créditos, consumo, limites, custos e kill switches.'}),
    Object.freeze({id:'tarot',name:'Tarot',sigil:'▣',group:'Conteúdo',description:'78 cartas, Carta do Dia, tiragens e integridade do baralho.'}),
    Object.freeze({id:'school',name:'Escola',sigil:'▤',group:'Conteúdo',description:'17 módulos, 78 aulas, progresso e publicação.'}),
    Object.freeze({id:'consultations',name:'Consultas',sigil:'♙',group:'Operação',description:'Solicitações, status e preços futuros sem expor perguntas.'}),
    Object.freeze({id:'store',name:'Loja',sigil:'⌘',group:'Comércio',description:'Curadoria Amazon, categorias, links e código de associado.'}),
    Object.freeze({id:'skins',name:'Skins',sigil:'◆',group:'Comércio',description:'30 skins, preços, packs, propriedade e restauração.'}),
    Object.freeze({id:'media',name:'Música e Vídeos',sigil:'♫',group:'Conteúdo',description:'Álbuns, episódios, links e estados editoriais.'}),
    Object.freeze({id:'notifications',name:'Notificações',sigil:'☾',group:'Crescimento',description:'Categorias, campanhas, opt-in e horário silencioso.'}),
    Object.freeze({id:'analytics',name:'Analytics e Mapa',sigil:'◈',group:'Crescimento',description:'Funis e métricas agregadas, nunca textos privados.'}),
    Object.freeze({id:'seo',name:'SEO e ASO',sigil:'⌁',group:'Crescimento',description:'Busca, idiomas, metadados, sitemap e lojas.'}),
    Object.freeze({id:'security',name:'Segurança',sigil:'⬡',group:'Sistema',description:'MFA, sessões, segredos, incidentes e permissões.'}),
    Object.freeze({id:'backups',name:'Backups',sigil:'↻',group:'Sistema',description:'Estado, recuperação, RPO/RTO e testes de restauração.'}),
    Object.freeze({id:'audit',name:'Auditoria',sigil:'≋',group:'Sistema',description:'Ações administrativas sanitizadas e rastreáveis.'}),
    Object.freeze({id:'settings',name:'Configurações',sigil:'⚙',group:'Sistema',description:'Preferências globais e integrações permitidas.'})
  ]),
  consultationPriceFields:Object.freeze(['mesa-real-profissional','leitura-mentes','carta-conselho','pergunta-direta'])
});

export const adminModuleById=id=>ADMIN_POLICY.modules.find(module=>module.id===id)||ADMIN_POLICY.modules[0];
export const sanitizeAdminEvent=event=>Object.freeze({action:String(event?.action||'unknown').slice(0,80),moduleId:adminModuleById(event?.moduleId).id,result:String(event?.result||'unknown').slice(0,40),at:new Date(event?.at||Date.now()).toISOString()});
