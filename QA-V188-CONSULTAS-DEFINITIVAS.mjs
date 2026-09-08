import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const args=process.argv.slice(2);
const live=args.includes('--live');
const expectEmailActive=args.includes('--expect-email-active');
const root=path.resolve(args.find(value=>!value.startsWith('--'))||'.');
const exists=file=>fs.existsSync(path.join(root,file));
const read=file=>exists(file)?fs.readFileSync(path.join(root,file),'utf8'):'';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const count=(value,pattern)=>(value.match(pattern)||[]).length;
const checks=[];
const check=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),...(detail?{detail:String(detail)}:{})});
const syntax=file=>{try{execFileSync(process.execPath,['--check',path.join(root,file)],{stdio:'ignore'});return true;}catch{return false;}};
const freshImport=file=>import(`${pathToFileURL(path.join(root,file)).href}?qa=${Date.now()}-${Math.random()}`);
const json=file=>{try{const value=JSON.parse(read(file));check(`json:${file}`,true);return value;}catch(error){check(`json:${file}`,false,error.message);return {};}};

const packageFiles=[
  'index.html','app.js','page-loader-v1.js','sw.js','busca-v165.js','consultation-policy.js','consultation-engine.js',
  'consultations-definitive-v188.css','consultas-de-tarot.html','privacidade-e-dados.html','termos-de-uso.html',
  'SUPABASE-CONSULTAS-STAGING-V188-TRACKING-EMAIL.sql','consultations-booking-v188.ts','consultations-email-webhook-v188.ts',
  'CONSULTAS-DEFINITIVAS-V188.json','STAGING-CONSULTAS-STATUS-V188.json','QA-V188-CONSULTAS-DEFINITIVAS.mjs',
  '00-LEIA-PRIMEIRO-V188-CONSULTAS-DEFINITIVAS.txt','ARQUIVOS-V188-SHA256.txt'
];
packageFiles.forEach(file=>check(`arquivo:${file}`,exists(file)));
for(const file of ['app.js','page-loader-v1.js','sw.js','busca-v165.js','consultation-policy.js','consultation-engine.js','consultations-booking-v188.ts','consultations-email-webhook-v188.ts','QA-V188-CONSULTAS-DEFINITIVAS.mjs'])check(`sintaxe:${file}`,exists(file)&&syntax(file));

const index=read('index.html');
const app=read('app.js');
const loader=read('page-loader-v1.js');
const worker=read('sw.js');
const search=read('busca-v165.js');
const policySource=read('consultation-policy.js');
const engine=read('consultation-engine.js');
const css=read('consultations-definitive-v188.css');
const legacyConsultationCss=read('consultations-celestial-v1.css');
const consultationCss=legacyConsultationCss+'\n'+css;
const page=read('consultas-de-tarot.html');
const privacy=read('privacidade-e-dados.html');
const terms=read('termos-de-uso.html');
const sql=read('SUPABASE-CONSULTAS-STAGING-V188-TRACKING-EMAIL.sql');
const booking=read('consultations-booking-v188.ts');
const webhook=read('consultations-email-webhook-v188.ts');
const readme=read('00-LEIA-PRIMEIRO-V188-CONSULTAS-DEFINITIVAS.txt');
const contract=json('CONSULTAS-DEFINITIVAS-V188.json');
const evidence=json('STAGING-CONSULTAS-STATUS-V188.json');

check('ativação:app-v188',/app\.js\?v=188/.test(index));
check('ativação:loader-v188',/page-loader-v1\.js\?v=188/.test(app));
check('ativação:motor-v188',count(loader,/consultation-engine\.js\?v=188/g)===2,count(loader,/consultation-engine\.js\?v=188/g));
check('ativação:política-v188',/consultation-policy\.js\?v=188/.test(engine));
check('ativação:estilo-v188',/consultations-definitive-v188\.css\?v=188/.test(index));
check('ativação:sw-v58',/divina-bruxa-v58-consultations-v188/.test(worker));
check('ativação:registro-sw-v188',/register\('\.\/sw\.js\?v=188'\)/.test(index));
check('ativação:sessão-sw-v188',/divina\.sw\.reload\.v188/.test(index));

const frozenFiles={
  'orb-engine-v68.js':'3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js':'26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js':'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3',
  'tarot-engine.js':'2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-session.js':'df2b0375cd1e29b60f902c168b2a734f25ddadfe5bcf9f3ef37ecc4a1ccf2eb2',
  'tarot-continuity.js':'8db7c90abafcdd415574658f55b9a44759fadc56f22c236342302f321aa130f0',
  'tarot-experience-v6.js':'5962f947bde21b293a01c69aa91308bccbe4f45b646a68b8fde7fbf8c6584fc8',
  'tarot-image-runtime.js':'82077941bfd5b5af3c065bb42e8780e37cb494ff567af62bbfff1447cdf78d9a',
  'tarot-meanings.js':'479a62a2dc61d0a087cfa0c88ebced4221963d1a830a86d77fdf2485b428c0ba',
  'spread-synthesis.js':'aebbeb3e7e0f4ea21d18c3c179d4ef03b3c00601246ec51505592fa9e4846ef4',
  'journal-engine.js':'9e18d68ede7281ab058cf2fa83e5663035bff6dc0e826befc537f45515166520',
  'school-engine.js':'dd62be7c78649f3aa2d4a6e848ee3bc4f4498c8e46f9f951d3dd0f4a4ba5ee42',
  'ritual-engine.js':'8a2b05ede1ea9512b9a8054e9f82e9591d316f932d699af84016d794a655392c',
  'daily-policy.js':'d180598cdd82b12dcccf95b76b2cdd98d82984989091ae148dcbb82fe5fd5a8a'
};
for(const [file,expected] of Object.entries(frozenFiles))check(`congelado:${file}`,exists(file)&&sha(fs.readFileSync(path.join(root,file)))===expected);
const indexLines=index.split(/\r?\n/);
const frozenIndexLines=[
  ['Orbe-e-Menu',line=>line.includes('<div class="orb-stage-ref">'),'44c77c5de5a4bdd2815d70e2636edae57fd6c0e3fafc234e78e78d1c9228f832'],
  ['dock-mini-Orbe-drawer',line=>line.includes('<nav class="magic-dock"'),'e3afc87bc9e1a496feb69341a363b63917f6c3c0cca243f52d4bb4f0ab959587'],
  ['Tarot-Livre',line=>line.includes('<section id="tarot"'),'6d480ffa677b91d2cc8210d659222fd060c07c508e09fed30db198fcc2b1d30a']
];
for(const [name,predicate,expected] of frozenIndexLines){const line=indexLines.find(predicate)||'';check(`congelado:index:${name}`,sha(line)===expected);}

const consultationPolicy=await freshImport('consultation-policy.js');
const policy=consultationPolicy.CONSULTATION_POLICY;
check('política:esquema-10',policy.schemaVersion==='10.0.0');
check('política:staging',policy.environment==='staging');
check('política:sem-cobrança',policy.realBilling===false);
check('política:e-mail-oficial',policy.contactEmail==='orbedasrealidades@hotmail.com');
check('política:somente-e-mail',policy.channels.join(',')==='email');
check('política:telefone-obrigatório',policy.phoneRequired===true);
const expectedServices=[
  ['mesa-real-profissional','Mesa Real Profissional',25000],
  ['leitura-mentes','Leitura de Mentes',15000],
  ['carta-conselho','Carta de Conselho',10000],
  ['pergunta-direta','Pergunta Direta',5000]
];
check('serviços:quatro',policy.services.length===4,policy.services.length);
expectedServices.forEach(([id,name,price],index)=>{const service=policy.services[index];check(`serviço:${id}`,service?.id===id&&service?.name===name&&service?.priceCents===price);});
const expectedStatuses=['received','awaiting_confirmation','confirmed','completed','cancelled'];
check('rastreamento:cinco-estados',JSON.stringify(policy.tracking.publicStatuses.map(item=>item.id))===JSON.stringify(expectedStatuses));
check('rastreamento:política-congelada',Object.isFrozen(policy)&&Object.isFrozen(policy.services)&&Object.isFrozen(policy.tracking.publicStatuses));
const snapshot=consultationPolicy.consultationPriceSnapshot(policy.services[3]);
check('preço:snapshot-preservado',snapshot.priceCents===5000&&snapshot.currency==='BRL'&&Object.isFrozen(snapshot));

for(const marker of ['consultation-draft-v188','consultation-requests-v188','consultation-catalog-v188','createTrackingToken','new Uint8Array(24)','crypto.getRandomValues','submissionId','trackingToken','preferredDate','preferredPeriod','price_snapshot','data-tracking-form','data-resend-current'])check(`motor:${marker}`,engine.includes(marker));
check('motor:formulário-curto',/name="name"[\s\S]*name="email" type="email"[\s\S]*name="phone" type="tel"[\s\S]*name="question"/.test(engine));
check('motor:e-mail-obrigatório',/name="email" type="email"[\s\S]{0,100}required/.test(engine));
check('motor:telefone-obrigatório',/name="phone" type="tel"[\s\S]{0,100}required/.test(engine));
check('motor:três-consentimentos',count(engine,/name="accept(?:Terms|Privacy|Symbolic)"/g)===3,count(engine,/name="accept(?:Terms|Privacy|Symbolic)"/g));
check('motor:revisão-antes-envio',engine.indexOf('REVISAR SOLICITAÇÃO')<engine.indexOf('REGISTRAR E GERAR PROTOCOLO'));
check('motor:preferência-honesta',/sem fingir disponibilidade/.test(engine)&&/sem promessa de disponibilidade/.test(engine));
check('motor:registro-durável',/action:'submit'/.test(engine)&&/completeRequest\(result\)/.test(engine));
check('motor:hold-de-horário-real',/action:'hold'/.test(engine)&&/holdToken/.test(engine));
check('motor:token-não-vai-na-URL',!/searchParams\.(?:set|append)\([^\n]*tracking|href=[^\n]*trackingToken|location\.href=[^\n]*trackingToken/.test(engine));
check('motor:painel-não-mostra-PII',/nunca a sua pergunta ou dados de contato/.test(engine));
check('motor:sem-billing',/Nenhuma cobrança automática foi realizada/.test(engine)&&/Não há cartão, checkout nem cobrança automática/.test(engine));
check('motor:fallback-oficial',/mailto:\$\{CONSULTATION_POLICY\.contactEmail\}/.test(engine));
check('motor:cópia-honesta-sem-provedor',/enquanto o provedor estiver pendente, guarde os códigos exibidos na tela/.test(engine));
check('motor:status-cinco',expectedStatuses.every(status=>engine.includes(`'${status}'`)));
check('motor:remove-apenas-cópia-local',/O pedido no servidor permanece preservado/.test(engine));
check('motor:sem-WhatsApp',!/whats\s*app|wa\.me/i.test(engine+policySource+page));
check('motor:sem-integração-de-cobrança',!/api\.stripe\.com|checkout\.sessions|payment_intent|pix_qr|mercadopago/i.test(engine+booking+sql));

for(const marker of ['consultation-sanctuary','consultation-steps','consultation-preference-grid','consultation-review-price','consultation-tracking-secret','consultation-status-path','consultation-restore-form','consultation-mobile-summary'])check(`css:${marker}`,consultationCss.includes(`.${marker}`));
check('css:foco-visível',/:focus-visible/.test(consultationCss));
check('css:novos-toques-44px',count(css,/min-height:\s*(?:2\.(?:75|8|9)|3(?:\.\d+)?)rem/g)>=5,count(css,/min-height:\s*(?:2\.(?:75|8|9)|3(?:\.\d+)?)rem/g));
check('css:mobile-760',/@media \(max-width:\s*760px\)/.test(consultationCss));
check('css:mobile-640',/@media \(max-width:\s*640px\)/.test(consultationCss));
check('css:movimento-reduzido',/prefers-reduced-motion:\s*reduce/.test(css));
check('css:alto-contraste',/forced-colors:\s*active/.test(css));
check('css:chaves-equilibradas',count(css,/\{/g)===count(css,/\}/g));

for(const [id,name,price] of expectedServices){check(`página:${id}`,page.includes(name)&&page.includes(`R$ ${price/100}`));}
check('página:comparação',/Escolha o formato da sua consulta/.test(page));
check('página:quatro-passos',count(page,/<li><span>0[1-4]<\/span>/g)===4);
for(const label of ['Recebida','Aguardando confirmação','Confirmada','Concluída','Cancelada'])check(`página:estado:${label}`,page.includes(label));
check('página:protocolo-e-código',/protocolo junto com o código privado/.test(page));
check('página:sem-falsa-disponibilidade',/sem promessa falsa de disponibilidade/.test(page));
check('página:e-mail-condicionado',/O envio por e-mail acontece depois da ativação segura do provedor/.test(page));
check('página:sem-cobrança',/não realiza cobrança automática/i.test(page));
check('página:data-v188',/"dateModified": "2026-09-08"/.test(page));
check('privacidade:Supabase-STAGING',/Supabase STAGING/.test(privacy));
check('privacidade:Resend-condicional',/Resend permanece condicionado à ativação dos segredos no servidor/.test(privacy));
check('privacidade:hash-sem-PII-no-status',/servidor armazena somente o hash do código privado; o acompanhamento não devolve pergunta, nome, e-mail ou telefone/.test(privacy));
check('termos:pedido-não-confirmado',/Solicitação não é confirmação automática/.test(terms));
check('termos:sem-cobrança',/Nenhuma cobrança é realizada nesta versão/.test(terms));
check('busca:consulta-v188',/solicitação durável/.test(search)&&/Estados recebida, aguardando confirmação, confirmada, concluída ou cancelada/.test(search));

const core=worker.match(/const CORE=\[([\s\S]*?)\];/)?.[1]||'';
const warm=worker.match(/const WARM=\[([\s\S]*?)\];/)?.[1]||'';
for(const file of ['consultation-policy.js','consultation-engine.js','consultations-celestial-v1.css','consultations-definitive-v188.css'])check(`offline:núcleo:${file}`,core.includes(`'./${file}'`));
check('offline:página-consultas',warm.includes("'./consultas-de-tarot.html'"));
check('offline:rotas-sensíveis-rede',/\(ai\|auth\|account\|admin\|entitlements\|billing\|payments\|consultations\)/.test(worker));
check('offline:instalação-atômica',/Promise\.allSettled\(CORE\.map/.test(worker)&&/if\(coreFailures\.length\)throw/.test(worker));

for(const marker of ['OPERATIONS_EMAIL="orbedasrealidades@hotmail.com"','RESEND_API_KEY','CONSULTATIONS_EMAIL_FROM','RESEND_WEBHOOK_SECRET','Idempotency-Key','divina-consultation-${record.id}-${audience}-v188','sendEmail(admin,record,"owner",trackingToken)','sendEmail(admin,record,"customer",trackingToken)','manualPreferencePersistence:true','privateTracking:true','realBilling:false'])check(`backend:${marker}`,booking.includes(marker));
check('backend:dois-e-mails-em-paralelo',/Promise\.all\(\[\s*sendEmail\(admin,record,"owner"[\s\S]*sendEmail\(admin,record,"customer"/.test(booking));
check('backend:preço-servidor',/priceCents:record\.price_brl_cents_snapshot/.test(booking));
check('backend:tracking-hash',/const tokenHash=await sha256\(trackingToken\)/.test(booking));
check('backend:tracking-incorreto-404',/TRACKING_NOT_FOUND"\},404/.test(booking));
check('backend:resposta-status-sem-PII',/request:\{\s*protocol:record\.protocol,[\s\S]*realBilling:false\s*\}/.test(booking));
check('backend:status-mapeados',expectedStatuses.every(status=>booking.includes(`"${status}"`)));
check('backend:origens-permitidas',/https:\/\/divinabruxa\.com\.br/.test(booking)&&/https:\/\/divinabruxa\.github\.io/.test(booking));
check('backend:limites-de-abuso',/limits:Record<string,number>=\{hold:12,submit:8,status:30,email:5\}/.test(booking));
check('backend:sem-segredo-materializado',!/\bre_[A-Za-z0-9_]{20,}\b|whsec_[A-Za-z0-9+/=_-]{12,}/.test(booking+webhook+sql));

for(const marker of ['svix-id','svix-timestamp','svix-signature','HMAC','SHA-256','MAX_CLOCK_SKEW_SECONDS=300','equalBytes','consultation_email_event_server_v188'])check(`webhook:${marker}`,webhook.includes(marker));
check('webhook:assinatura-antes-da-configuração',webhook.indexOf('INVALID_SIGNATURE')<webhook.indexOf('SERVER_CONFIG_ERROR'));
check('webhook:corpo-bruto',/const payload=await req\.text\(\)/.test(webhook));
check('webhook:idempotência',/idempotent:data===false/.test(webhook));
check('webhook:tipos-suportados',['email.delivered','email.bounced','email.complained','email.failed'].every(type=>sql.includes(type)));

for(const marker of ['tracking_token_hash','manual_preference','consultation_submit_server_v188','consultation_email_record_server_v188','consultation_email_event_server_v188','private.consultation_email_webhook_events','force row level security','on conflict (event_id) do nothing','price_brl_cents_snapshot'])check(`sql:${marker}`,sql.includes(marker));
check('sql:token-hash-64',/tracking_token_hash ~ '\^\[0-9a-f\]\{64\}\$'/.test(sql));
check('sql:status-inicial-recebido',/s\.delivery_method,'received','not_started'/.test(sql));
check('sql:preferência-ou-agenda',/source := 'calendar_slot'/.test(sql)&&/source := 'manual_preference'/.test(sql));
check('sql:grants-server-only',count(sql,/grant execute on function public\.consultation_(?:submit|email_)/g)===3&&count(sql,/to service_role;/g)>=3);
check('sql:sem-grant-anônimo',!/grant execute[\s\S]{0,240}to (?:public|anon|authenticated)/i.test(sql));
check('sql:revoga-cliente',count(sql,/from public,anon,authenticated;/g)>=4);
const sqlWithoutComments=sql.replace(/^\s*--.*$/gm,'');
check('sql:sem-cobrança',!/insert into public\.(?:payments|billing|orders)|api\.stripe\.com|checkout\.sessions|payment_intent/i.test(sqlWithoutComments));

check('contrato:versão',contract.release==='V188'&&contract.macroetapa===10&&contract.base_release==='V187');
check('contrato:19-arquivos',contract.installation?.package_files===19&&packageFiles.length===19);
check('contrato:10-substituir',contract.installation?.replace_files===10);
check('contrato:9-adicionar',contract.installation?.add_files===9);
check('contrato:gate-honesto',contract.gates?.macroetapa_10==='pending_real_email_delivery_gate');
check('contrato:invariantes',contract.unchanged_invariants?.main_orb_frozen===true&&contract.unchanged_invariants?.tarot_cards===78&&contract.unchanged_invariants?.reversed_cards===0&&contract.unchanged_invariants?.mesa_real_rows===13&&contract.unchanged_invariants?.mesa_real_columns===6);
check('evidência:projeto-saudável',evidence.supabase?.status==='ACTIVE_HEALTHY');
check('evidência:migrações',evidence.deployed_migrations?.map(item=>item.name).join(',')==='consultations_v188_tracking_email,consultations_v188_remove_redundant_indexes');
check('evidência:functions-ativas',evidence.edge_functions?.every(item=>item.status==='ACTIVE'));
check('evidência:teste-sintético',evidence.controlled_synthetic_submission?.durable_record_created===true&&evidence.controlled_synthetic_submission?.idempotent_resubmission===true&&evidence.controlled_synthetic_submission?.wrong_private_code_rejected_with_404===true);
check('evidência:zero-pagamento',evidence.safe_database_aggregate_after_test?.payment_started===0);
check('evidência:sem-token',evidence.controlled_synthetic_submission?.private_tracking_code_recorded_here===false&&!/tracking_token"\s*:/.test(JSON.stringify(evidence)));
check('evidência:gate-pendente',evidence.gate?.confirmed_real_email_delivery==='pending');
check('leia-me:iPhone',/COMO INSTALAR PELO IPHONE/.test(readme)&&/19 arquivos soltos/.test(readme));
check('leia-me:segredos-fora-do-GitHub',/Nunca coloque uma chave, segredo ou token no GitHub/.test(readme));
check('leia-me:gate-real',/Somente então marque o portão de e-mail real como aprovado/.test(readme));

globalThis.document=globalThis.document||{addEventListener(){}};
globalThis.HTMLImageElement=globalThis.HTMLImageElement||class HTMLImageElement{};
await freshImport('tarot-meanings.js');
const [{CARDS},tarotSession,dailyPolicy]=await Promise.all([freshImport('tarot-data.js'),freshImport('tarot-session.js'),freshImport('daily-policy.js')]);
check('regressão:catálogo-78',CARDS.length===78,CARDS.length);
check('regressão:78-diretas',CARDS.every(card=>card.orientation==='normal'));
let state=tarotSession.createTarotState({randomInt:max=>max-1,now:()=>1,sessionId:'qa-v188'});
const draws=[];
for(let i=0;i<78;i+=1){const draw=tarotSession.drawNextCard(state,{now:()=>i+2});state=draw.state;draws.push(draw.cardId);}
check('regressão:78-reveladas',draws.length===78);
check('regressão:sem-repetição',new Set(draws).size===78);
check('regressão:Mesa-13x6',/aria-rowcount="13" aria-colcount="6"/.test(index)&&/Math\.floor\(index \/ 6\)/.test(read('tarot-engine.js')));
check('regressão:sem-significado-na-revelação',/automaticMeanings: false/.test(read('tarot-editorial-policy.js'))&&!/meaning-engine|tarot-meanings/.test(read('tarot-engine.js')));
check('regressão:Carta-do-Dia-Brasília',dailyPolicy.DAILY_TIME_ZONE==='America/Sao_Paulo'&&dailyPolicy.DAILY_CARD_COUNT===78);
check('regressão:15-tiragens',(await freshImport('spreads-policy.js')).SPREADS.length===15);

const htmlFiles=fs.readdirSync(root).filter(file=>file.endsWith('.html'));
for(const file of ['index.html','consultas-de-tarot.html','privacidade-e-dados.html','termos-de-uso.html']){
  const source=read(file),broken=[];
  for(const match of source.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)){
    let target=match[1].trim();
    if(!target||target.startsWith('#')||/^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(target)||target.includes('${'))continue;
    target=target.split('#')[0].split('?')[0];if(!target)continue;
    try{target=decodeURIComponent(target);}catch{}
    let local=path.resolve(path.dirname(path.join(root,file)),target);
    if(!local.startsWith(root)){broken.push(match[1]);continue;}
    if(target.endsWith('/'))local=path.join(local,'index.html');
    if(!fs.existsSync(local))broken.push(match[1]);
  }
  check(`links:${file}`,broken.length===0,broken.slice(0,5).join(', '));
  for(const [position,match] of [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].entries()){
    try{JSON.parse(match[1]);check(`jsonld:${file}:${position+1}`,true);}catch{check(`jsonld:${file}:${position+1}`,false);}
  }
}
check('portal:mais-de-130-páginas',htmlFiles.length>=130,htmlFiles.length);

const manifest=read('ARQUIVOS-V188-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
check('hash:18-entradas',manifest.length===18,manifest.length);
for(const line of manifest){
  const match=line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-48)}`,Boolean(match));
  if(match)check(`hash:arquivo:${match[2]}`,exists(match[2])&&sha(fs.readFileSync(path.join(root,match[2])))===match[1]);
}

let liveState={evaluated:false,providerConfigured:null,deliveryTracking:null,gate:'NOT_EVALUATED'};
if(live){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),30000);
  try{
    const response=await fetch('https://kyphdsamyygavmkzyezr.supabase.co/functions/v1/consultations-booking',{headers:{Accept:'application/json'},signal:controller.signal});
    const body=await response.json();
    check('live:http-200',response.ok,response.status);
    check('live:staging-sem-billing',body.ok===true&&body.environment==='staging'&&body.rules?.realBilling===false);
    check('live:preferência-durável',body.rules?.manualPreferencePersistence===true);
    check('live:rastreamento-privado',body.rules?.privateTracking===true);
    check('live:cinco-estados',JSON.stringify(body.publicStatuses)===JSON.stringify(expectedStatuses));
    check('live:quatro-preços',JSON.stringify(body.services?.map(item=>item.price_brl_cents))===JSON.stringify([25000,15000,10000,5000]));
    check('live:e-mail-oficial',body.notifications?.ownerEmail==='orbedasrealidades@hotmail.com');
    liveState={evaluated:true,providerConfigured:body.notifications?.providerConfigured===true,deliveryTracking:body.notifications?.deliveryTracking===true,gate:body.notifications?.providerConfigured===true&&body.notifications?.deliveryTracking===true?'READY_FOR_CONTROLLED_DELIVERY_TEST':'PENDING_PROVIDER_SECRETS'};
    if(expectEmailActive)check('live:provedor-e-webhook-ativos',liveState.providerConfigured&&liveState.deliveryTracking,JSON.stringify(liveState));
  }catch(error){check('live:endpoint-acessível',false,error.message);liveState={evaluated:true,providerConfigured:null,deliveryTracking:null,gate:'LIVE_CHECK_FAILED'};}
  finally{clearTimeout(timer);}
}

const failed=checks.filter(item=>!item.pass);
const status=failed.length?'FAIL':liveState.gate==='PENDING_PROVIDER_SECRETS'?'PASS_WITH_EMAIL_GATE_PENDING':'PASS';
console.log(JSON.stringify({suite:'DIVINA-BRUXA-V188-CONSULTAS-DEFINITIVAS',status,root,total:checks.length,passed:checks.length-failed.length,failed,live:liveState,macroetapa10Gate:failed.length?'BLOCKED_BY_QA':liveState.gate==='READY_FOR_CONTROLLED_DELIVERY_TEST'?'PENDING_CONTROLLED_REAL_DELIVERY':liveState.gate==='PENDING_PROVIDER_SECRETS'?'PENDING_PROVIDER_SECRETS_AND_REAL_DELIVERY':'NOT_EVALUATED'},null,2));
if(failed.length)process.exitCode=1;
