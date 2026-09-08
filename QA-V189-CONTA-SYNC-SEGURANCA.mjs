import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const live = args.includes('--live');
const root = path.resolve(args.find(value => !value.startsWith('--')) || '.');
const filePath = file => path.join(root, file);
const exists = file => fs.existsSync(filePath(file));
const read = file => exists(file) ? fs.readFileSync(filePath(file), 'utf8') : '';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const count = (value, pattern) => (value.match(pattern) || []).length;
const checks = [];
const check = (name, pass, detail = '') => checks.push({ name, pass:Boolean(pass), ...(detail ? { detail:String(detail) } : {}) });
const syntax = file => {
  try { execFileSync(process.execPath, ['--check', filePath(file)], { stdio:'ignore' }); return true; }
  catch { return false; }
};
const freshImport = file => import(`${pathToFileURL(filePath(file)).href}?qa=${Date.now()}-${Math.random()}`);
const json = file => {
  try { const value = JSON.parse(read(file)); check(`json:${file}`, true); return value; }
  catch (error) { check(`json:${file}`, false, error.message); return {}; }
};

const packageFiles = [
  'app.js',
  'config.js',
  'daily-policy.js',
  'index.html',
  'journal-engine.js',
  'privacidade-e-dados.html',
  'ritual-engine.js',
  'school-engine.js',
  'storage.js',
  'sw.js',
  'termos-de-uso.html',
  'SUPABASE-CONTA-SYNC-STAGING-V189.sql',
  'account-engine-v189.js',
  'account-secure-v189.css',
  'account-sync-v189.ts',
  'auth-client-v189.js',
  'daily-card-account-v189.ts',
  'CONTA-SYNC-SEGURANCA-V189.json',
  'STAGING-CONTA-STATUS-V189.json',
  'QA-V189-CONTA-SYNC-SEGURANCA.mjs',
  '00-LEIA-PRIMEIRO-V189-CONTA-SYNC-SEGURANCA.txt',
  'ARQUIVOS-V189-SHA256.txt'
];
packageFiles.forEach(file => check(`arquivo:${file}`, exists(file)));
check('pacote:22-arquivos', packageFiles.length === 22, packageFiles.length);
check('pacote:arquivos-planos', packageFiles.every(file => path.basename(file) === file));

const syntaxFiles = [
  'app.js', 'config.js', 'daily-policy.js', 'journal-engine.js', 'ritual-engine.js',
  'school-engine.js', 'storage.js', 'sw.js', 'account-engine-v189.js',
  'account-sync-v189.ts', 'auth-client-v189.js', 'daily-card-account-v189.ts',
  'QA-V189-CONTA-SYNC-SEGURANCA.mjs'
];
syntaxFiles.forEach(file => check(`sintaxe:${file}`, exists(file) && syntax(file)));

const app = read('app.js');
const config = read('config.js');
const dailyPolicySource = read('daily-policy.js');
const index = read('index.html');
const journalEngine = read('journal-engine.js');
const privacy = read('privacidade-e-dados.html');
const ritual = read('ritual-engine.js');
const schoolEngine = read('school-engine.js');
const storage = read('storage.js');
const worker = read('sw.js');
const terms = read('termos-de-uso.html');
const sql = read('SUPABASE-CONTA-SYNC-STAGING-V189.sql');
const accountEngine = read('account-engine-v189.js');
const accountCss = read('account-secure-v189.css');
const accountSync = read('account-sync-v189.ts');
const authClient = read('auth-client-v189.js');
const dailyBackend = read('daily-card-account-v189.ts');
const readme = read('00-LEIA-PRIMEIRO-V189-CONTA-SYNC-SEGURANCA.txt');
const contract = json('CONTA-SYNC-SEGURANCA-V189.json');
const evidence = json('STAGING-CONTA-STATUS-V189.json');

check('ativação:app-v189', /app\.js\?v=189/.test(index));
check('ativação:css-v189', /account-secure-v189\.css\?v=189/.test(index));
check('ativação:auth-v189', /auth-client-v189\.js\?v=189/.test(app));
check('ativação:motor-conta-v189', /account-engine-v189\.js\?v=189/.test(app) && /new AccountEngineV189\(\$\('#login'\), authClient\)/.test(app));
check('ativação:área-conta-v189', /<section id="login" class="screen"><p class="eyebrow">MINHA ORBE · V189/.test(index));
check('ativação:sw-v59', /divina-bruxa-v59-account-v189/.test(worker));
check('ativação:registro-sw-v189', /register\('\.\/sw\.js\?v=189'\)/.test(index));
check('ativação:sessão-sw-v189', /divina\.sw\.reload\.v189/.test(index));
for (const asset of ['auth-client-v189.js', 'account-engine-v189.js', 'account-secure-v189.css']) {
  check(`offline:${asset}`, count(worker, new RegExp(`'\\./${asset.replaceAll('.', '\\.')}'`, 'g')) >= 2);
}

check('config:projeto-staging', /https:\/\/kyphdsamyygavmkzyezr\.supabase\.co/.test(config));
check('config:chave-publicável-moderna', /supabasePublishableKey:'sb_publishable_[A-Za-z0-9_-]+'/.test(config));
check('config:funções-staging', /accountFunctionsBase:'https:\/\/kyphdsamyygavmkzyezr\.supabase\.co\/functions\/v1'/.test(config));
check('config:e-mail-oficial', /contactEmail:'orbedasrealidades@hotmail\.com'/.test(config));

for (const marker of [
  '/signup?redirect_to=',
  '/token?grant_type=password',
  '/token?grant_type=refresh_token',
  '/recover?redirect_to=',
  '/resend?redirect_to=',
  "method:'PUT'",
  "/logout?scope=local",
  "syncAccount(payload)",
  "dailyCard()",
  "exportAccount()",
  "deleteAccount(payload)"
]) check(`auth:${marker}`, authClient.includes(marker));
check('auth:sessão-somente-na-aba', /sessionStorage\.setItem\(SESSION_KEY/.test(authClient) && /sessionStorage\.removeItem\(SESSION_KEY/.test(authClient));
check('auth:token-fora-do-localStorage', !/\blocalStorage\s*\./.test(authClient));
check('auth:refresh-antes-expirar', /expires_at\) - Math\.floor\(Date\.now\(\) \/ 1000\) <= 90/.test(authClient));
check('auth:fragmento-seguro-limpo', /history\.replaceState\(null, '', url\.href\)/.test(authClient));
check('auth:retorno-verificação', /account-action.*verify|redirectUrl\('verify'\)/s.test(authClient));
check('auth:retorno-recuperação', /redirectUrl\('recovery'\)/.test(authClient));
check('auth:publishable-sem-segredo', /apikey:this\.publishableKey/.test(authClient));

for (const marker of [
  'minlength="12"',
  'Declaro ter 18 anos ou mais',
  'Confira seu e-mail',
  'REENVIAR CONFIRMAÇÃO',
  'ENVIAR LINK DE RECUPERAÇÃO',
  'EXCLUIR MINHA CONTA',
  'BAIXAR TODOS OS MEUS DADOS',
  'Sincronizar meu Diário privado',
  'Compras são somente leitura',
  'MFA/AAL2'
]) check(`conta:${marker}`, accountEngine.includes(marker));
check('conta:senha-mínima-validada', /password\.length < 12/.test(accountEngine));
check('conta:idade-validada', /values\.age !== 'on'/.test(accountEngine));
check('conta:exclusão-reauth', /this\.auth\.reauthenticate/.test(accountEngine));
check('conta:exclusão-dupla-confirmação', /values\.confirmation !== 'EXCLUIR MINHA CONTA'/.test(accountEngine) && /Última confirmação/.test(accountEngine));
check('conta:cache-por-usuário', /account-cache-v189:/.test(accountEngine) && /accountCacheKey\(this\.user\.id\)/.test(accountEngine));
check('conta:separa-sessão-expirada', /event === 'SIGNED_OUT'[\s\S]{0,120}this\.separateExpiredAccount\(\)/.test(accountEngine));
check('conta:separa-logout', /cacheAndSeparateCurrentAccount\(\)[\s\S]{0,100}this\.auth\.logout\(\)/.test(accountEngine));
check('conta:consentimento-explícito', /journalConsent:consentDecision/.test(accountEngine) && /confirm\('Ativar a sincronização do Diário privado/.test(accountEngine));
const payloadBlock = accountEngine.match(/localSyncPayload\(consentDecision\)[\s\S]*?\n  async syncNow/)?.[0] || '';
check('conta:rascunhos-fora-do-payload', payloadBlock && !/draft|rascunho/i.test(payloadBlock));
check('conta:tombstones-diário', /deletedJournalEntries/.test(payloadBlock) && /journalDeletedIds/.test(accountEngine));
check('conta:carta-servidor-após-revelação', /!snapshot\.daily && store\.get\(DAILY_STORAGE_KEY\)/.test(accountEngine) && /this\.auth\.dailyCard\(\)/.test(accountEngine));
check('conta:aplica-sync-nos-módulos', /divina:account-sync-applied/.test(accountEngine) && /divina:account-sync-applied/.test(schoolEngine) && /divina:account-sync-applied/.test(journalEngine) && /divina:account-sync-applied/.test(ritual));
check('storage:evento-local', /divina:storage-change/.test(storage));

for (const marker of [
  'MAX_BODY_BYTES = 2_500_000',
  'MAX_JOURNAL_ENTRIES = 2_000',
  'requestOrigin(req)',
  'getUser(token)',
  'getClaims(token)',
  'EMAIL_VERIFICATION_REQUIRED',
  'verify_active_account_session',
  'consume_account_sync_quota_v189',
  'p_limit: 30',
  'record_account_sync_audit_v189',
  'journalSyncEnabled',
  'journalDeletedIds',
  'schoolAuthority',
  'purchasesClientWritable: false'
]) check(`sync:${marker}`, accountSync.includes(marker));
check('sync:origens-oficiais', ['https://divinabruxa.com.br', 'https://www.divinabruxa.com.br', 'https://divinabruxa.github.io'].every(origin => accountSync.includes(origin)));
check('sync:sem-cors-curinga', !/Access-Control-Allow-Origin["']?\s*[:,]\s*["']\*/.test(accountSync));
check('sync:sem-log-de-conteúdo', !/console\.(?:log|info|debug|warn|error)/.test(accountSync));
check('sync:auditoria-só-contagens', /safe_counts := pg_catalog\.jsonb_build_object/.test(sql) && /p_counts: counts/.test(accountSync) && !/p_counts:\s*(?:body|journal|school|text|notes)/i.test(accountSync));
check('sync:compras-somente-leitura', /from\("purchases"\)\.select/.test(accountSync) && !/from\("purchases"\)\.(?:insert|upsert|update|delete)/.test(accountSync));
check('sync:benefícios-somente-leitura', /from\("entitlements"\)\.select/.test(accountSync) && !/from\("entitlements"\)\.(?:insert|upsert|update|delete)/.test(accountSync));
check('sync:orientação-diário-direta', /orientation: "normal"/.test(accountSync));

for (const marker of [
  'SESSION_UUID',
  'https://divinabruxa.com.br',
  'getUser(token)',
  'getClaims(token)',
  'EMAIL_VERIFICATION_REQUIRED',
  'verify_active_account_session',
  'exactRandom78',
  'bytes[0] < 234',
  'orientation:"normal"'
]) check(`carta-backend:${marker}`, dailyBackend.includes(marker));
check('carta-backend:sem-cors-curinga', !/Access-Control-Allow-Origin["']?\s*[:,]\s*["']\*/.test(dailyBackend));
check('carta-backend:sem-carta-invertida', !/reversed\s*:\s*true|orientation\s*:\s*["']reversed/.test(dailyBackend));

for (const marker of [
  'journal_sync_enabled boolean not null default false',
  'client_entry_id text',
  'client_payload jsonb not null',
  'create table if not exists public.school_sync_state',
  'enable row level security',
  'school_sync_state_select_own',
  '(select auth.uid()) = user_id',
  'private.account_sync_rate_limits',
  'security definer',
  "set search_path = ''",
  'from public, anon, authenticated',
  'to service_role',
  'revoke all on table public.purchases from anon',
  'revoke all on table public.entitlements from anon'
]) check(`sql:${marker}`, sql.includes(marker));
check('sql:sem-grant-rpc-ao-cliente', !/grant execute on function public\.(?:consume_account_sync_quota_v189|record_account_sync_audit_v189)[\s\S]{0,200}to (?:public|anon|authenticated)/i.test(sql));
check('sql:transação', /^--[\s\S]*?begin;/.test(sql) && /commit;\s*$/.test(sql));
check('sql:sem-cobrança', !/insert into public\.(?:payments|orders|billing)|api\.stripe\.com|checkout\.sessions|payment_intent/i.test(sql.replace(/^\s*--.*$/gm, '')));

check('admin:MFA-obrigatório', /mfaRequired:true/.test(read('admin-staging-api-v145.js')) && /claims\.aal!=='aal2'/.test(read('admin-staging-api-v145.js')));
check('admin:cliente-exige-tudo', /ownerVerified===true&&body\?\.emailVerified===true&&body\?\.mfaVerified===true&&body\?\.recoveryCodesReady===true/.test(read('admin-engine.js')));
check('admin:diário-não-exibido', /sem exibir o corpo privado dos Diários/.test(read('admin-experience-v8.js')));

check('legal:conta-staging', /Conta V189 funciona no Supabase STAGING/.test(privacy) && /Conta real no STAGING/.test(terms));
check('legal:diário-opt-in', /Diário permanece local por padrão/.test(privacy) && /sincronização do Diário fica desligada por padrão/.test(terms));
check('legal:rascunhos-locais', /Rascunhos nunca são sincronizados/.test(privacy) && /Rascunhos continuam somente no aparelho/.test(terms));
check('legal:direitos', /Baixar todos os meus dados/.test(privacy) && /Encerrar e excluir minha conta/.test(privacy));
check('legal:sem-cobrança', /cobrança real[^<]*continuam desativados/.test(privacy) && /Nenhuma cobrança é realizada nesta versão/.test(terms));

check('css:chaves-equilibradas', count(accountCss, /\{/g) === count(accountCss, /\}/g));
check('css:toques-mínimos', count(accountCss, /min-height:(?:2\.9|3)rem/g) >= 4);
check('css:foco-visível', /:focus-visible/.test(accountCss));
check('css:movimento-reduzido', /prefers-reduced-motion:reduce/.test(accountCss));
check('css:alto-contraste', /forced-colors:active/.test(accountCss));
check('css:responsivo', /@media\(min-width:42rem\)/.test(accountCss));

const sensitiveSources = [app, config, dailyPolicySource, index, journalEngine, privacy, ritual, schoolEngine, storage, worker, terms, sql, accountEngine, accountCss, accountSync, authClient, dailyBackend].join('\n');
check('segredos:sem-service-key-materializada', !/\bsb_secret_[A-Za-z0-9_-]{16,}\b|\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/.test(sensitiveSources));
check('segredos:sem-chave-Resend', !/\bre_[A-Za-z0-9_]{16,}\b|\bwhsec_[A-Za-z0-9+/=_-]{12,}\b/.test(sensitiveSources));
check('escopo:sem-WhatsApp', !/wa\.me|whats\s*app/i.test([app, config.replace("whatsapp:''", ''), accountEngine, accountSync, dailyBackend].join('\n')));
check('escopo:sem-billing', !/api\.stripe\.com|checkout\.sessions|payment_intent|mercadopago/i.test([app, accountEngine, accountSync, dailyBackend, sql].join('\n')));

const frozenFiles = {
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
  'spread-synthesis.js':'aebbeb3e7e0f4ea21d18c3c179d4ef03b3c00601246ec51505592fa9e4846ef4'
};
for (const [file, expected] of Object.entries(frozenFiles)) {
  check(`congelado:${file}`, exists(file) && sha(fs.readFileSync(filePath(file))) === expected);
}
const indexLines = index.split(/\r?\n/);
for (const [name, finder, expected] of [
  ['Orbe-e-Menu', line => line.includes('<div class="orb-stage-ref">'), '44c77c5de5a4bdd2815d70e2636edae57fd6c0e3fafc234e78e78d1c9228f832'],
  ['dock-mini-Orbe-drawer', line => line.includes('<nav class="magic-dock"'), 'e3afc87bc9e1a496feb69341a363b63917f6c3c0cca243f52d4bb4f0ab959587'],
  ['Tarot-Livre', line => line.includes('<section id="tarot"'), '6d480ffa677b91d2cc8210d659222fd060c07c508e09fed30db198fcc2b1d30a']
]) {
  check(`congelado:index:${name}`, sha(indexLines.find(finder) || '') === expected);
}

globalThis.document = globalThis.document || { addEventListener() {} };
globalThis.HTMLImageElement = globalThis.HTMLImageElement || class HTMLImageElement {};
await freshImport('tarot-meanings.js');
const [{ CARDS }, tarotSession, dailyPolicy, spreads] = await Promise.all([
  freshImport('tarot-data.js'),
  freshImport('tarot-session.js'),
  freshImport('daily-policy.js'),
  freshImport('spreads-policy.js')
]);
check('regressão:catálogo-78', CARDS.length === 78, CARDS.length);
check('regressão:78-diretas', CARDS.every(card => card.orientation === 'normal'));
let tarotState = tarotSession.createTarotState({ randomInt:max => max - 1, now:() => 1, sessionId:'qa-v189' });
const draws = [];
for (let indexDraw = 0; indexDraw < 78; indexDraw += 1) {
  const draw = tarotSession.drawNextCard(tarotState, { now:() => indexDraw + 2 });
  tarotState = draw.state;
  draws.push(draw.cardId);
}
check('regressão:78-reveladas', draws.length === 78);
check('regressão:sem-repetição', new Set(draws).size === 78);
check('regressão:Mesa-13x6', /aria-rowcount="13" aria-colcount="6"/.test(index) && /Math\.floor\(index \/ 6\)/.test(read('tarot-engine.js')));
check('regressão:sem-significado-na-revelação', /automaticMeanings: false/.test(read('tarot-editorial-policy.js')) && !/meaning-engine|tarot-meanings/.test(read('tarot-engine.js')));
check('regressão:15-tiragens', spreads.SPREADS.length === 15, spreads.SPREADS.length);
check('regressão:Carta-do-Dia-78', dailyPolicy.DAILY_CARD_COUNT === 78 && dailyPolicy.DAILY_TIME_ZONE === 'America/Sao_Paulo');
const accountDaily = dailyPolicy.createAccountDailyRecord({ date:'2026-09-08', cardIndex:77, createdAt:'2026-09-08T12:00:00Z' }, 'teste');
check('regressão:Carta-da-conta-direta', accountDaily.id === 77 && accountDaily.orientation === 'normal' && accountDaily.reversed === false && accountDaily.selectionVersion === 'account-authority-v189');
check('regressão:preços-250-150-100-50', JSON.stringify((await freshImport('consultation-policy.js')).CONSULTATION_POLICY.services.map(item => item.priceCents)) === JSON.stringify([25000, 15000, 10000, 5000]));

for (const file of ['app.js', 'config.js', 'daily-policy.js', 'journal-engine.js', 'ritual-engine.js', 'school-engine.js', 'storage.js', 'account-engine-v189.js', 'auth-client-v189.js']) {
  const missing = [];
  for (const match of read(file).matchAll(/(?:from\s+|import\s*\()(['"])(\.\/[^'"]+)\1/g)) {
    const target = match[2].split('?')[0];
    if (!exists(target.slice(2))) missing.push(target);
  }
  check(`imports:${file}`, missing.length === 0, missing.join(', '));
}

for (const file of ['index.html', 'privacidade-e-dados.html', 'termos-de-uso.html']) {
  const broken = [];
  const source = read(file);
  for (const match of source.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    let target = match[1].trim();
    if (!target || target.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:|blob:)/i.test(target) || target.includes('${')) continue;
    target = target.split('#')[0].split('?')[0];
    if (!target) continue;
    try { target = decodeURIComponent(target); } catch {}
    let local = path.resolve(path.dirname(filePath(file)), target);
    if (!local.startsWith(root)) { broken.push(match[1]); continue; }
    if (target.endsWith('/')) local = path.join(local, 'index.html');
    if (!fs.existsSync(local)) broken.push(match[1]);
  }
  check(`links:${file}`, broken.length === 0, broken.slice(0, 5).join(', '));
  for (const [position, match] of [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].entries()) {
    try { JSON.parse(match[1]); check(`jsonld:${file}:${position + 1}`, true); }
    catch { check(`jsonld:${file}:${position + 1}`, false); }
  }
}

check('contrato:versão', contract.release === 'V189' && contract.macroetapa === 11 && contract.base_release === 'V188');
check('contrato:22-arquivos', contract.installation?.package_files === 22 && contract.installation?.replace_files === 11 && contract.installation?.add_files === 11);
check('contrato:sem-produção', contract.scope?.production_publish === false && contract.scope?.automatic_billing === false);
check('contrato:gate-banco', contract.gates?.database_cross_access === 'passed' && contract.gates?.rls_and_least_privilege === 'passed');
check('contrato:gates-honestos', /pending/.test(contract.gates?.controlled_signup_verification_recovery || '') && /pending/.test(contract.gates?.offsite_backup_and_isolated_restore || '') && /pending/.test(contract.gates?.v188_real_email_delivery || ''));
check('contrato:invariantes', contract.unchanged_invariants?.main_orb_frozen === true && contract.unchanged_invariants?.tarot_cards === 78 && contract.unchanged_invariants?.mesa_real_rows === 13 && contract.unchanged_invariants?.mesa_real_columns === 6);

check('evidência:projeto-saudável', evidence.supabase?.status === 'ACTIVE_HEALTHY' && evidence.supabase?.auth_users_after_tests === 0);
check('evidência:migração-v189', evidence.migration?.version === '20260908164449' && evidence.migration?.present === true);
check('evidência:funções-ativas-jwt', evidence.edge_functions?.length === 4 && evidence.edge_functions.every(item => item.status === 'ACTIVE' && item.verify_jwt === true));
check('evidência:versões-finais', JSON.stringify(evidence.edge_functions?.map(item => [item.slug, item.version])) === JSON.stringify([['account-sync-v189', 2], ['daily-card-account', 2], ['account-export', 4], ['account-delete', 3]]));
check('evidência:cors-oficial', evidence.official_origin_preflight?.passed === true && ['account_sync_v189', 'daily_card_account', 'account_export', 'account_delete'].every(key => evidence.official_origin_preflight[key] === 204));
check('evidência:isolamento', evidence.database_cross_access_gate?.passed === true && evidence.database_cross_access_gate?.account_a?.cross_rows_visible_per_resource === 0 && evidence.database_cross_access_gate?.account_b?.cross_rows_visible_per_resource === 0 && evidence.database_cross_access_gate?.cross_account_updates_affected_rows === 0);
check('evidência:rls', evidence.database_security?.rls_enabled_on_all_account_resources === true && evidence.database_security?.anon_sensitive_table_grants === false);
check('evidência:compras-readonly', evidence.database_security?.purchases_authenticated_access === 'SELECT only' && evidence.database_security?.entitlements_authenticated_access === 'SELECT only');
check('evidência:advisors-sem-alerta', evidence.advisors?.security?.errors === 0 && evidence.advisors?.security?.warnings === 0 && evidence.advisors?.performance?.errors === 0 && evidence.advisors?.performance?.warnings === 0);
check('evidência:gates-pendentes', evidence.controlled_account_flow?.email_verification === 'pending' && evidence.backup_gate?.isolated_restore_test === 'pending' && evidence.v188_email_gate?.real_delivery_confirmed === false);
check('evidência:produção-intocada', evidence.production?.deployed === false && evidence.production?.dns_changed === false && evidence.production?.billing_enabled === false);

check('leia-me:iPhone', /COMO INSTALAR PELO IPHONE/.test(readme) && /22 arquivos soltos/.test(readme));
check('leia-me:11-substituir', /11 ARQUIVOS SUBSTITUÍDOS/.test(readme) && /11 ARQUIVOS NOVOS/.test(readme));
check('leia-me:não-reexecutar-SQL', /NÃO execute novamente o arquivo SQL/.test(readme));
check('leia-me:redirects', /Site URL: https:\/\/divinabruxa\.com\.br/.test(readme) && /https:\/\/divinabruxa\.com\.br\/\*\*/.test(readme));
check('leia-me:segredos-fora-GitHub', /Nunca coloque chave, segredo ou token/.test(readme));
check('leia-me:teste-controlado', /TESTE CONTROLADO APÓS A INSTALAÇÃO/.test(readme));
check('leia-me:backup-pendente', /BACKUP E PORTÃO OPERACIONAL/.test(readme) && /restauração em ambiente isolado/.test(readme));
check('leia-me:V188-pendente', /O PORTÃO V188 DE E-MAIL DE CONSULTAS CONTINUA ABERTO/.test(readme));

const manifestLines = read('ARQUIVOS-V189-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const expectedManifestFiles = packageFiles.filter(file => file !== 'ARQUIVOS-V189-SHA256.txt').sort();
const manifestFiles = [];
check('hash:21-entradas', manifestLines.length === 21, manifestLines.length);
for (const line of manifestLines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  check(`hash:formato:${line.slice(-48)}`, Boolean(match));
  if (!match) continue;
  manifestFiles.push(match[2]);
  check(`hash:arquivo:${match[2]}`, exists(match[2]) && sha(fs.readFileSync(filePath(match[2]))) === match[1]);
}
check('hash:conjunto-exato', JSON.stringify(manifestFiles.sort()) === JSON.stringify(expectedManifestFiles));

if (live) {
  const projectBase = 'https://kyphdsamyygavmkzyezr.supabase.co/functions/v1';
  const publishable = config.match(/supabasePublishableKey:'([^']+)'/)?.[1] || '';
  const endpoints = [
    ['account-sync-v189', 'POST', JSON.stringify({ requestId:'00000000-0000-4000-8000-000000000189' })],
    ['daily-card-account', 'GET', undefined],
    ['account-export', 'POST', '{}'],
    ['account-delete', 'POST', '{}']
  ];
  const request = async (slug, options) => {
    try {
      const response = await fetch(`${projectBase}/${slug}`, { ...options, signal:AbortSignal.timeout(45000) });
      return { response, body:await response.text() };
    } catch (error) {
      return { error };
    }
  };
  const preflights = await Promise.all(endpoints.map(([slug]) => request(slug, {
    method:'OPTIONS',
    headers:{
      Origin:'https://divinabruxa.com.br',
      'Access-Control-Request-Method':'POST',
      'Access-Control-Request-Headers':'authorization,apikey,content-type'
    }
  })));
  preflights.forEach((result, indexLive) => {
    const slug = endpoints[indexLive][0];
    check(`live:cors:${slug}`, result.response?.status === 204 && result.response.headers.get('access-control-allow-origin') === 'https://divinabruxa.com.br', result.error?.message || result.response?.status);
  });
  const forbidden = await Promise.all(endpoints.map(([slug]) => request(slug, {
    method:'OPTIONS',
    headers:{ Origin:'https://example.invalid', 'Access-Control-Request-Method':'POST' }
  })));
  forbidden.forEach((result, indexLive) => {
    const slug = endpoints[indexLive][0];
    check(`live:origem-proibida:${slug}`, result.response?.status === 403, result.error?.message || result.response?.status);
  });
  const unauthenticated = await Promise.all(endpoints.map(([slug, method, body]) => request(slug, {
    method,
    headers:{ Origin:'https://divinabruxa.com.br', apikey:publishable, 'content-type':'application/json' },
    ...(body === undefined ? {} : { body })
  })));
  unauthenticated.forEach((result, indexLive) => {
    const slug = endpoints[indexLive][0];
    check(`live:jwt-obrigatório:${slug}`, result.response?.status === 401, result.error?.message || result.response?.status);
  });
}

const failed = checks.filter(item => !item.pass);
const passed = checks.length - failed.length;
console.log(`V189 QA ${live ? 'STATIC+LIVE' : 'STATIC'}: ${passed}/${checks.length} PASS`);
if (failed.length) {
  failed.forEach(item => console.error(`FAIL ${item.name}${item.detail ? ` — ${item.detail}` : ''}`));
  process.exitCode = 1;
} else {
  console.log('STATUS: PASS');
}
