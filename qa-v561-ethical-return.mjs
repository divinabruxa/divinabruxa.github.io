import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.argv[2] || '.');
const read = name => readFileSync(resolve(root,name),'utf8');
const has = (source,pattern,message) => assert.match(source,pattern,message);
const lacks = (source,pattern,message) => assert.doesNotMatch(source,pattern,message);

const app = read('app-v208.js');
const index = read('index.html');
const loader = read('page-loader-v1.js');
const daily = read('daily-world-v509.js');
const runtime = read('ethical-return-core-v561.js');
const css = read('ethical-return-core-v561.css');
const worker = read('sw.js');
const admin = read('admin-intelligence-v322.js');
const ingest = read('ethical-analytics-v561-edge.ts');
const adminEdge = read('admin-analytics-v322-edge-v561.ts');
const sql = read('STAGING-RETENCAO-ETICA-V561.sql');
const manifest = JSON.parse(read('manifest.webmanifest'));
const delivery = JSON.parse(read('MANIFESTO-V561-RETENCAO-ETICA.json'));
const api = await import(pathToFileURL(resolve(root,'ethical-return-core-v561.js')).href);

assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.version,561,'contrato precisa ser V561');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.macroStage,'13-of-14','macro precisa ser 13/14');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.challengeCount,14,'devem existir 14 desafios');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.cardIdentityInNotification,false,'notificação não pode revelar carta');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.analyticsConsentRequired,true,'analytics deve exigir consentimento');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.analyticsRetentionDays,90,'retenção deve ser limitada a 90 dias');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.streaks,false,'streaks coercitivos devem permanecer ausentes');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.punishment,false,'não pode existir punição por ausência');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.mutationObservers,0,'núcleo não pode criar MutationObserver');
assert.equal(api.ETHICAL_RETURN_CONTRACT_V561.permanentAnimationLoops,0,'núcleo não pode criar loop permanente');

const challengeA = api.challengeForDateV561('2026-09-13');
const challengeB = api.challengeForDateV561('2026-09-13');
assert.deepEqual(challengeA,challengeB,'desafio do mesmo dia deve ser determinístico');
assert.equal(challengeA.day,'2026-09-13','dia do desafio incorreto');
assert.equal(api.isQuietHoursV561(new Date('2026-09-14T01:30:00Z')),true,'22h30 de Brasília deve ser silêncio');
assert.equal(api.isQuietHoursV561(new Date('2026-09-13T12:00:00Z')),false,'09h de Brasília deve permitir teste');
assert.equal(api.analyticsRouteV561('journal'),'private-area','Diário deve virar bucket genérico');
assert.equal(api.analyticsRouteV561('admin'),'','Admin não deve entrar no analytics público');

const sanitized = api.sanitizeAnalyticsEventV561({
  event_id:'a1b2c3d4-e5f6-4789-8abc-def012345678',
  event_key:'daily_revealed',route_key:'daily',occurred_at:'2026-09-13T12:00:00.000Z',
  text:'segredo',card_name:'A Lua',question:'não enviar'
});
assert.deepEqual(Object.keys(sanitized).sort(),['event_id','event_key','funnel_stage','occurred_at','route_key'],'evento sanitizado contém campo livre');
assert.equal(sanitized.funnel_stage,'ritual','estágio do ritual incorreto');
assert.equal(api.sanitizeAnalyticsEventV561({...sanitized,event_key:'arbitrary_text'}),null,'evento fora da allowlist foi aceito');
for (const template of Object.values(api.ETHICAL_NOTIFICATION_TEMPLATES_V561)) {
  assert.equal(Object.keys(template).sort().join(','),'body,route,title','template aceita campos além do contrato');
  assert.doesNotMatch(template.body,/A Lua|O Sol|carta recebida|significado|intenção/i,'template revela conteúdo da carta');
}

has(app,/MACROETAPA 13\/14 · V561/,'app não declara V561');
has(app,/createEthicalReturnCoreV561/,'app não importa núcleo V561');
has(app,/divinaEthicalReturnReleaseV561/,'contrato público V561 ausente');
has(app,/currentMacroStage:'13-of-14'/,'boot não aponta para 13/14');
has(app,/returnGarden:ethicalReturn/,'Orbe não expõe Jardim do Retorno');
has(app,/analyticsConsentRequired:true/,'contrato não exige consentimento');
has(app,/notificationProviderActive:false/,'provedor externo deve continuar desligado');
has(app,/productionPublish:false/,'produção deve permanecer bloqueada');
has(app,/realBilling:false/,'billing real deve permanecer bloqueado');

has(index,/manifest\.webmanifest\?v=561/,'manifesto V561 não está ligado');
has(index,/ethical-return-core-v561\.css\?v=561/,'CSS V561 não está ligado');
has(index,/app-v208\.js\?v=561/,'app V561 não está ligado');
has(index,/__divinaSWBootstrap='v561-inline'/,'bootstrap inline V561 ausente');
has(index,/sw\.js\?v=561/,'service worker V561 não está ligado');
has(index,/JARDIM DO RETORNO · V561/,'mundo de retorno não foi atualizado');

has(loader,/CARREGAMENTO V561/,'page loader não declara V561');
has(loader,/daily-world-v509\.js\?v=561/,'ponte segura da Carta do Dia não é carregada');
has(loader,/admin-intelligence-v322\.js\?v=561/,'Admin V561 não é carregado');
has(daily,/divina:daily-v561-revealed/,'Carta do Dia não emite evento seguro');
has(daily,/cardIdentityIncluded:false/,'evento da Carta não nega identidade');
has(daily,/intentionIncluded:false/,'evento da Carta não nega intenção');

has(runtime,/JARDIM DO RETORNO · V561/,'hub V561 ausente');
has(runtime,/Pular não quebra sequência/,'garantia não coercitiva ausente');
has(runtime,/divina:privacy-change/,'revogação de consentimento não é ouvida');
has(runtime,/credentials:'omit'/,'ingestão não isola credenciais');
has(runtime,/x-divina-analytics-request':'v561'/,'guarda de ingestão ausente');
has(runtime,/private-area/,'bucket privado genérico ausente');
has(runtime,/removeItem\(ETHICAL_ANALYTICS_STATE_KEY_V561\)/,'identificador local não é removível');
lacks(runtime,/new MutationObserver|setInterval\s*\(|createElement\(['"]canvas|new Worker|new SharedWorker/,'núcleo criou observador, loop ou motor visual');
lacks(runtime,/JOURNAL_STORAGE_KEY|journal-engine.*all\(|\.currentCard|\.currentMeaning|\[name=["'](?:text|question)["']\]/,'núcleo tenta ler conteúdo privado');

has(css,/min-block-size:\s*44px/,'alvo de toque mínimo ausente');
has(css,/prefers-reduced-motion:\s*reduce/,'redução de movimento ausente');
has(css,/prefers-contrast:\s*more/,'alto contraste ausente');
has(css,/forced-colors:\s*active/,'forced colors ausente');
lacks(css,/animation\s*:\s*[^;]*infinite|backdrop-filter\s*:/,'CSS contém loop infinito ou blur pesado');

has(ingest,/ANALYTICS_HASH_PEPPER/,'pepper dedicado ausente');
has(ingest,/name:'HMAC',hash:'SHA-256'/,'HMAC-SHA256 ausente');
has(ingest,/publishableKeyAllowed/,'publishable key não é validada');
has(ingest,/MAX_BATCH = 20/,'limite de lote ausente');
has(ingest,/rawIdentifiersStored:false/,'contrato de pseudônimo ausente');
has(ingest,/privateTextIncluded:false/,'negação de texto privado ausente');
has(ingest,/request\.method === 'DELETE'/,'exclusão por aparelho ausente');
lacks(ingest,/service_role[^\n]*['"][A-Za-z0-9_-]{24,}|SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"]/,'segredo parece hardcoded');

has(sql,/alter table public\.ethical_analytics_events_v561 force row level security/,'FORCE RLS ausente');
has(sql,/revoke all on table public\.ethical_analytics_events_v561 from public, anon, authenticated/,'revoke público ausente');
has(sql,/security invoker/g,'funções precisam respeitar privilégio do chamador');
lacks(sql,/security definer/i,'SQL não pode criar SECURITY DEFINER');
has(sql,/ethical_analytics_snapshot_v561/,'snapshot agregado ausente');
has(sql,/retentionWindowDays',90|interval '90 days'/,'janela de 90 dias ausente');
has(sql,/privateTextFields',0/,'snapshot não nega texto privado');

has(adminEdge,/ethical_analytics_snapshot_v561/,'Edge Admin não lê snapshot agregado V561');
has(adminEdge,/officialDauWauMauAvailable:Boolean\(ethical\)/,'Admin não condiciona métricas oficiais');
has(adminEdge,/rawAnalyticsIdentifiers:false/,'Admin não nega pseudônimos crus');
has(admin,/DAU \/ WAU \/ MAU consentidos/,'UI Admin não explica métricas consentidas');
has(admin,/RETENÇÃO/,'UI Admin não mostra retenção');
has(admin,/tokens ou hashes individuais/,'UI Admin não declara limite de privacidade');

has(worker,/const VERSION=561/,'service worker não usa V561');
has(worker,/divina-bruxa-v561-shell/,'cache V561 ausente');
has(worker,/ethical-return-core-v561\.js/,'núcleo V561 não está no shell atômico');
has(worker,/SHOW_LOCAL_NOTIFICATION_V561/,'teste local seguro ausente');
has(worker,/payload\?\.release!=='V561'\|\|payload\?\.consent!==true/,'push não exige release e consentimento');
has(worker,/Sua Carta do Dia está pronta para ser encontrada\./,'copy segura da Carta ausente');
lacks(worker,/divina-bruxa-v560-(?:shell|content|images|offline-core|premium-static)/,'cache V560 permaneceu ativo');

assert.equal(manifest.icons.every(icon => icon.src.includes('v=561')),true,'ícones do manifesto não usam epoch V561');
assert.equal(manifest.shortcuts.length,10,'atalhos PWA devem ser preservados');
assert.equal(manifest.shortcuts.every(shortcut => shortcut.icons.every(icon => icon.src.includes('v=561'))),true,'atalhos não usam epoch V561');
assert.equal(manifest.shortcuts.some(shortcut => shortcut.name === 'Jardim do Retorno'),true,'atalho do Jardim ausente');

const entries = readdirSync(root,{withFileTypes:true});
assert.equal(entries.some(entry => entry.isDirectory()),false,'pacote incremental deve ser plano');
assert.equal(entries.length,delivery.expected_file_count,'quantidade de arquivos diverge do manifesto');
assert.deepEqual(entries.map(entry=>entry.name).sort(),[...delivery.new_files,...delivery.replacement_files].sort(),'manifesto não descreve exatamente o delta');

console.log(JSON.stringify({
  ok:true,release:'V561',macro:'13/14',challenges:14,
  reminders:['daily','school','skins','episodes'],quietHours:'22:00-08:00 America/Sao_Paulo',
  analyticsConsentRequired:true,analyticsRetentionDays:90,
  privateTextFields:0,rawIdentifiersStored:false,preciseLocation:false,
  notificationCardIdentity:false,streaks:false,punishment:false,
  mutationObservers:0,permanentAnimationLoops:0,canonicalOrb:true,
  flatDirectory:true,root:basename(root)
},null,2));
