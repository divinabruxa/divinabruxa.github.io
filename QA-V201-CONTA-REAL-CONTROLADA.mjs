import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const DELIVERY_ROOT = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = process.env.V201_SITE_ROOT || DELIVERY_ROOT;
const BASE_ROOT = process.env.V201_BASE_ROOT || '';
const readDelivery = name => readFileSync(join(DELIVERY_ROOT, name), 'utf8');
const readSite = name => readFileSync(join(SITE_ROOT, name), 'utf8');
const sha256Buffer = value => createHash('sha256').update(value).digest('hex');
const sha256 = (root, name) => sha256Buffer(readFileSync(join(root, name)));
const passes = [], failures = [], warnings = [];
const check = (name, condition, severity = 'P1', detail = '') => {
  const item = { name, severity, ...(detail ? { detail } : {}) };
  (condition ? passes : failures).push(item);
};

const manifest = JSON.parse(readDelivery('MANIFESTO-V201-CONTA-REAL-CONTROLADA.json'));
const contract = JSON.parse(readDelivery('CONTA-REAL-CONTROLADA-V201.json'));
const index = readSite('index.html');
const app = readSite('app-v201.js');
const auth = readSite('auth-client-v201.js');
const account = readSite('account-engine-v201.js');
const stateCopySource = readSite('account-state-copy-v201.js');
const skins = readSite('skins-v201.js');
const loader = readSite('page-loader-v1.js');
const pwa = readSite('pwa-world-v201.js');
const sw = readSite('sw.js');
const css = readSite('account-secure-v201.css');
const mainSql = readDelivery('SUPABASE-CONTA-CONTROLADA-STAGING-V201.sql');
const advisorySql = readDelivery('SUPABASE-ADVISORY-RLS-LEGACY-V201-REVIEW.sql');
const adminEngine = readSite('admin-engine.js');
const adminApi = readSite('admin-staging-api-v145.js');

check('manifesto V201 sobre V200', manifest.version === 201 && manifest.base_required === 'V200 instalada', 'P0');
check('macroetapa 3 identificada', manifest.release === 'plano-supremo-2.0-macroetapa-3-conta-real-controlada', 'P0');
check('delta plano, aditivo e sem exclusões', manifest.delivery.type === 'flat-delta' && manifest.delivery.directories_inside_zip === 0 && manifest.delivery.delete_existing_files === false, 'P0');
check('delta tem 18 arquivos', manifest.delivery.files.length === 18, 'P0', String(manifest.delivery.files.length));
check('delta sem nomes duplicados', new Set(manifest.delivery.files).size === manifest.delivery.files.length, 'P0');
for (const name of manifest.delivery.files) {
  check(`delta presente: ${name}`, existsSync(join(DELIVERY_ROOT, name)), 'P0');
  check(`delta não vazio: ${name}`, existsSync(join(DELIVERY_ROOT, name)) && statSync(join(DELIVERY_ROOT, name)).size > 0, 'P0');
  check(`delta plano: ${name}`, !name.includes('/') && !name.includes('\\'), 'P0');
}

for (const [key, expected] of Object.entries({
  register:true,
  email_confirmation:true,
  login:true,
  logout_local:true,
  logout_global:true,
  password_recovery:true,
  password_change_requires_current_password:true,
  other_sessions_revoked_after_password_change:true,
  self_service_export:true,
  self_service_delete:true
})) check(`contrato de conta: ${key}`, contract.account[key] === expected, 'P0');
for (const key of ['daily_card','school','favorites','active_skin','entitlements','purchases_read_only','journal_requires_explicit_opt_in','local_account_separation']) {
  check(`continuidade de conta: ${key}`, contract.continuity[key] === true, 'P0');
}
check('Diário continua local por padrão', contract.continuity.journal_cloud_default === false, 'P0');
check('três estados de ciclo de vida', contract.security.account_states.join('/') === 'active/suspended/deletion_pending', 'P0');
check('zero acesso cruzado por contrato', contract.security.cross_account_access === false, 'P0');
check('25 superfícies com RLS de estado', contract.security.rls_restrictive_policy_tables === 25, 'P0');
check('tombstone sem PII', contract.security.deletion_tombstone === 'sha256-user-id-no-pii', 'P0');
check('Admin proprietário exige AAL2', contract.security.owner_admin_mfa === 'required-aal2', 'P0');
check('autorização não usa user_metadata', contract.security.user_metadata_used_for_authorization === false, 'P0');
check('estados PT/EN/ES', contract.security.critical_states_locales.join('/') === 'pt/en/es', 'P0');

check('index inicia app V201', /src="app-v201\.js\?v=201"/.test(index), 'P0');
check('index carrega CSS de Conta V201', /account-secure-v201\.css\?v=201/.test(index), 'P0');
check('index não inicia app V200', !/src="app-v200\.js\?v=200"/.test(index), 'P0');
check('app importa cliente V201', /AuthClientV201 as AuthClient/.test(app) && /auth-client-v201\.js\?v=201/.test(app), 'P0');
check('app importa motor de Conta V201', /AccountEngineV201/.test(app) && /account-engine-v201\.js\?v=201/.test(app), 'P0');
check('app importa PWA V201', /pwa-world-v201\.js\?v=201/.test(app), 'P0');
check('app registra SW V201', /register\('\.\/sw\.js\?v=201'\)/.test(app), 'P0');
check('loader importa skins V201', /skins-v201\.js\?v=201/.test(loader) && /SkinsEngineV201/.test(loader), 'P0');
check('PWA identifica V201', /const VERSION = 201;/.test(pwa), 'P0');
check('PWA registra SW V201', /register\('\.\/sw\.js\?v=201'\)/.test(pwa), 'P0');
check('SW identifica V201', /const VERSION = 201;/.test(sw), 'P0');
for (const cache of ['divina-bruxa-v201-shell','divina-bruxa-v201-content','divina-bruxa-v201-images','divina-bruxa-v201-tarot-offline']) check(`cache ${cache}`, sw.includes(cache), 'P0');
for (const asset of ['./app-v201.js','./auth-client-v201.js','./account-engine-v201.js','./account-state-copy-v201.js','./account-secure-v201.css','./skins-v201.js','./pwa-world-v201.js']) check(`SW prepara ${asset}`, sw.includes(`'${asset}'`), 'P0');
check('SW valida shell V201', sw.includes('app-v201\\.js\\?v=201') && sw.includes('home-orb-absolute-v199\\.css\\?v=199'), 'P0');
check('SW remove caches próprios antigos', /key\.startsWith\(OWNED_PREFIX\) && !ACTIVE_CACHES\.has\(key\)/.test(sw), 'P0');
check('SW mantém autoridade network-only', /authorityNetworkOnly/.test(sw) && /cache-control': 'no-store/.test(sw), 'P0');

check('sessão V201 somente em sessionStorage', /divina\.auth\.session\.v201/.test(auth) && /sessionStorage/.test(auth), 'P0');
check('sessão V189 migra sem perda', /LEGACY_SESSION_KEYS/.test(auth) && /divina\.auth\.session\.v189/.test(auth), 'P0');
check('token não é persistido em localStorage', !/localStorage\.(?:setItem|getItem)[\s\S]{0,100}(?:access_token|SESSION_KEY)/.test(auth), 'P0');
check('logout tem escopos local/global/others', /\['local', 'global', 'others'\]/.test(auth) && /logout\?scope=\$\{safeScope\}/.test(auth), 'P0');
check('troca exige current_password', /current_password:String\(currentPassword/.test(auth), 'P0');
check('troca revoga outras sessões', /logout\?scope=others/.test(auth) && /otherSessionsRevoked/.test(auth), 'P0');
check('controle server-authoritative via RPC', /rpc\/account_control_v201/.test(auth), 'P0');
check('REST autenticado usa chave pública e bearer', /apikey:this\.publishableKey/.test(auth) && /Authorization:`Bearer \$\{current\.access_token\}`/.test(auth), 'P0');
check('preferência remota é lida', /orb_skin_preferences\?select=equipped_skin_id,updated_at/.test(auth), 'P0');
check('preferência remota usa upsert por user_id', /orb_skin_preferences\?on_conflict=user_id/.test(auth) && /resolution=merge-duplicates,return=representation/.test(auth), 'P0');
check('slug de skin é validado no cliente', /\^\[a-z0-9-\]\{1,80\}\$/.test(auth), 'P0');
check('cadastro marca release V201', /registration_release:'V201'/.test(auth), 'P1');
check('cliente mantém exportação e exclusão', /exportAccount\(\)/.test(auth) && /deleteAccount\(payload\)/.test(auth), 'P0');

check('motor de Conta identifica V201', /export class AccountEngineV201/.test(account) && /dataset\.accountV201/.test(account), 'P0');
check('controle é verificado no boot antes da restauração local', /this\.user = account\.body\.user;\s*if \(!await this\.checkAccountControl\(\)\) return;\s*this\.prepareLocalForUser/.test(account), 'P0');
check('controle é verificado depois do login', /this\.criticalState = '';\s*if \(!await this\.checkAccountControl\(\)\) return;\s*this\.prepareLocalForUser/.test(account), 'P0');
check('conta suspensa bloqueia e separa dados', /status === 'suspended'/.test(account) && /blockAccount/.test(account) && /cacheAndSeparateCurrentAccount/.test(account), 'P0');
check('exclusão pendente bloqueia sync', /deletion_pending/.test(account), 'P0');
check('sessão expirada é tratada', /SESSION_EXPIRED/.test(account) && /expireAccount/.test(account), 'P0');
check('falha 401 aciona separação', /result\?\.status === 401/.test(account) && /handleSecurityFailure/.test(account), 'P0');
check('formulário troca senha acessível', /data-account-form="change-password"/.test(account) && /autocomplete="current-password"/.test(account) && /autocomplete="new-password"/.test(account), 'P0');
check('botão sair de todos existe', /data-account-logout-all/.test(account) && /logoutAll\(\)/.test(account), 'P0');
check('exportação inclui controle V201', /accountControlV201:this\.accountControl/.test(account), 'P1');
check('exclusão exige frase exata', account.includes("values.confirmation !== 'EXCLUIR MINHA CONTA'"), 'P0');
check('exclusão exige senha recente', /this\.auth\.reauthenticate/.test(account), 'P0');
check('Diário exige opt-in e confirmação', /data-journal-sync/.test(account) && /Ativar a sincronização do Diário privado/.test(account), 'P0');
check('payload V201 identifica aparelho', /deviceId:'web-pwa-v201'/.test(account), 'P1');
check('conexão lenta tem estado acessível', /account-v201-network/.test(account) && /role="status"/.test(account), 'P1');
check('estado crítico usa alert assertivo', /account-v201-critical/.test(account) && /role="alert"/.test(account) && /aria-live="assertive"/.test(account), 'P0');
check('suporte usa somente Contato oficial', /Contato oficial/.test(account) && !/(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(account), 'P0');
check('CSS cobre dataset V201', /#login\[data-account-v201\]/.test(css), 'P0');
check('CSS inclui foco visível', /:focus-visible/.test(css), 'P1');
check('CSS respeita movimento reduzido', /prefers-reduced-motion:reduce/.test(css), 'P1');
check('CSS respeita cores forçadas', /forced-colors:active/.test(css), 'P1');

const { ACCOUNT_STATE_COPY_V201 } = await import(`${pathToFileURL(join(SITE_ROOT, 'account-state-copy-v201.js')).href}?qa=${Date.now()}`);
const stateKeys = ['offline','slowNetwork','tooMany','verifyEmail','delayedEmail','invalidCredentials','weakPassword','suspendedError','expiredError','suspendedTitle','suspendedBody','deletionTitle','deletionBody','expiredTitle','expiredBody','support','passwordChanged','signedOutAll'];
for (const locale of ['pt','en','es']) {
  check(`dicionário crítico ${locale} existe`, typeof ACCOUNT_STATE_COPY_V201[locale] === 'object', 'P0');
  for (const key of stateKeys) check(`estado ${locale}.${key}`, typeof ACCOUNT_STATE_COPY_V201[locale]?.[key] === 'string' && ACCOUNT_STATE_COPY_V201[locale][key].length >= 8, 'P1');
}
check('dicionário não contém HTML executável', !/<script|javascript:|onerror=/i.test(stateCopySource), 'P0');

check('Skins identifica V201', /export class SkinsEngineV201/.test(skins) && /data-release="V201"/.test(skins), 'P0');
check('skin só persiste depois de aplicação bem-sucedida', /if \(!applied\)[\s\S]*saveSkinPreference\(id\)/.test(skins), 'P0');
check('skin remota é restaurada após benefícios', /billingSnapshot[\s\S]*skinPreference/.test(skins), 'P0');
check('skin remota precisa estar liberada', /this\.owned\.has\(remoteSkin\)/.test(skins), 'P0');
check('falha de sync não desfaz skin local', /foi aplicada aqui, mas a conta não confirmou/.test(skins), 'P1');
check('Clássica continua sempre liberada', /new Set\(\['classic'/.test(skins), 'P0');

check('migração é transacional', /^--[\s\S]*\nbegin;[\s\S]*\ncommit;\s*$/i.test(mainSql), 'P0');
check('migração cria estado privado', /create table if not exists private\.account_states_v201/.test(mainSql), 'P0');
check('estado tem FK cascade para auth.users', /user_id uuid primary key references auth\.users\(id\) on delete cascade/.test(mainSql), 'P0');
for (const state of ['active','suspended','deletion_pending']) check(`SQL permite estado ${state}`, mainSql.includes(`'${state}'`), 'P0');
check('reason_code sanitizado', /reason_code ~ '\^\[A-Z0-9_\]\{1,48\}\$'/.test(mainSql), 'P0');
check('estado privado usa RLS e FORCE', /alter table private\.account_states_v201 enable row level security/.test(mainSql) && /alter table private\.account_states_v201 force row level security/.test(mainSql), 'P0');
check('estado não concede cliente', /revoke all on table private\.account_states_v201 from public, anon, authenticated/.test(mainSql), 'P0');
check('estado indexado por PK user_id', /user_id uuid primary key/.test(mainSql), 'P1');
check('novos usuários recebem estado ativo', /create trigger account_state_seed_v201/.test(mainSql) && /values \(new\.id, 'active'\)/.test(mainSql), 'P0');
check('usuários existentes recebem backfill idempotente', /select users\.id, 'active'[\s\S]*on conflict \(user_id\) do nothing/.test(mainSql), 'P0');
check('declaração 18+ recebe horário do servidor', /v_age_declared[\s\S]*case when v_age_declared then now\(\)/.test(mainSql), 'P1');
check('handle_new_user preserva preferências e notificações', /seed_notification_preferences/.test(mainSql) && /orb_skin_preferences/.test(mainSql) && /CLASSIC_SKIN_MISSING/.test(mainSql), 'P0');

check('migração cria tombstone privado', /create table if not exists private\.account_tombstones_v201/.test(mainSql), 'P0');
const tombstoneDefinition = mainSql.match(/create table if not exists private\.account_tombstones_v201[\s\S]*?\n\);/)?.[0] || '';
check('tombstone contém somente hash/data/release', /subject_hash/.test(tombstoneDefinition) && /deleted_at/.test(tombstoneDefinition) && /release/.test(tombstoneDefinition) && !/(?:email|phone|body|journal|raw_user|display_name)/i.test(tombstoneDefinition), 'P0');
check('tombstone usa SHA-256 pgcrypto', /extensions\.digest\(old\.id::text, 'sha256'\)/.test(mainSql), 'P0');
check('tombstone nasce após exclusão auth.users', /create trigger account_tombstone_v201\s*after delete on auth\.users/.test(mainSql), 'P0');
check('tombstone usa RLS e FORCE', /alter table private\.account_tombstones_v201 enable row level security/.test(mainSql) && /alter table private\.account_tombstones_v201 force row level security/.test(mainSql), 'P0');
check('tombstone não concede cliente', /revoke all on table private\.account_tombstones_v201 from public, anon, authenticated/.test(mainSql), 'P0');

check('sessão exige usuário e session_id', /p_user_id is not null[\s\S]*p_session_id is not null/.test(mainSql), 'P0');
check('sessão exige e-mail confirmado', /account\.email_confirmed_at is not null/.test(mainSql), 'P0');
check('sessão exige estado ativo', /state\.status = 'active'/.test(mainSql), 'P0');
check('sessão valida auth.sessions e prazo', /from auth\.sessions as session[\s\S]*session\.not_after/.test(mainSql), 'P0');
check('controle recusa auth.uid nulo', /if v_user_id is null[\s\S]*AUTH_REQUIRED/.test(mainSql), 'P0');
check('controle retorna somente estado próprio', /where state\.user_id = v_user_id/.test(mainSql), 'P0');
check('controle reconhece owner pela tabela', /from public\.admin_owners as owner_account[\s\S]*owner_account\.active = true/.test(mainSql), 'P0');
check('controle sinaliza MFA obrigatório e AAL2', /'mfaRequired', v_owner/.test(mainSql) && /v_aal = 'aal2'/.test(mainSql), 'P0');
check('RPC negada a anon', /revoke all on function public\.account_control_v201\(\) from public, anon/.test(mainSql), 'P0');
check('RPC concedida só a authenticated', /grant execute on function public\.account_control_v201\(\) to authenticated/.test(mainSql), 'P0');

const accountTableBlock = mainSql.match(/account_tables constant text\[\] := array\[([\s\S]*?)\n  \];/)?.[1] || '';
const policyTables = [...accountTableBlock.matchAll(/'([^']+)'/g)].map(match => match[1]);
const expectedPolicyTables = [
  'ai_conversations','ai_credit_ledger','ai_messages','ai_usage','ai_wallets',
  'billing_receipts_v191','billing_subscriptions_v191','consent_events','consultation_requests',
  'consultation_status_history','daily_cards','entitlements','journal_entries','notification_preferences',
  'notifications','orb_skin_entitlements','orb_skin_preferences','privacy_requests','profiles','purchases',
  'school_favorites','school_progress','school_sync_state','tarot_readings','user_settings'
];
check('matriz RLS lista exatamente 25 tabelas', policyTables.length === 25 && new Set(policyTables).size === 25, 'P0', policyTables.join(','));
for (const table of expectedPolicyTables) check(`RLS de estado cobre ${table}`, policyTables.includes(table), 'P0');
check('RLS falha se tabela obrigatória faltar', /V201_REQUIRED_TABLE_MISSING/.test(mainSql), 'P0');
check('RLS adicional é restritiva', /create policy account_active_v201[\s\S]*as restrictive for all to authenticated/.test(mainSql), 'P0');
check('RLS protege leitura e escrita', /using \(\(select public\.account_access_is_active_v201\(\)\)\) with check \(\(select public\.account_access_is_active_v201\(\)\)\)/.test(mainSql), 'P0');
check('RLS usa SELECT para avaliação por statement', /select public\.account_access_is_active_v201\(\)/.test(mainSql), 'P1');

check('migração principal não toca guard legado', !/billing_environment_guard/.test(mainSql), 'P0');
check('migração principal não cria usuário', !/insert\s+into\s+auth\.users/i.test(mainSql), 'P0');
check('migração principal não envia e-mail', !/(?:resend|send_email|http_post|net\.http)/i.test(mainSql), 'P0');
check('migração principal não cria Stripe/checkout', !/create\s+(?:table|function|extension)[\s\S]{0,80}(?:stripe|checkout)/i.test(mainSql), 'P0');
check('advisory declara revisão humana', /NÃO EXECUTADA AUTOMATICAMENTE/.test(advisorySql), 'P0');
check('advisory mira somente guard legado', /private\.billing_environment_guard/.test(advisorySql) && !/account_states_v201|account_tombstones_v201/.test(advisorySql), 'P0');
check('advisory ativa e força RLS', /enable row level security/.test(advisorySql) && /force row level security/.test(advisorySql), 'P0');
check('advisory revoga todos os papéis de app', /from public, anon, authenticated, service_role/.test(advisorySql), 'P0');
check('advisory não amplia grants', !/\bgrant\b/i.test(advisorySql), 'P0');
check('advisory nega clientes explicitamente', /using \(false\)[\s\S]*with check \(false\)/.test(advisorySql), 'P0');

check('Admin cliente exige owner/email/MFA/recovery', /ownerVerified===true&&body\?\.emailVerified===true&&body\?\.mfaVerified===true&&body\?\.recoveryCodesReady===true/.test(adminEngine), 'P0');
check('Admin servidor exige AAL2', /claims\.aal!==\'aal2\'/.test(adminApi), 'P0');
check('Admin usa TOTP challengeAndVerify', /mfa\.challengeAndVerify/.test(adminApi) && /factorType:'totp'/.test(adminApi), 'P0');
check('Admin valida owner no servidor', /from\('admin_owners'\)/.test(adminApi) && /\.eq\('active',true\)/.test(adminApi), 'P0');
check('authorization não depende de user_metadata role', !/user_metadata[\s\S]{0,80}(?:role|owner|admin)/i.test(`${auth}\n${account}\n${mainSql}\n${adminApi}`), 'P0');

const { COMMERCIAL_TRUTH_V200: truth, assertCommercialTruthV200 } = await import(`${pathToFileURL(join(SITE_ROOT, 'commercial-truth-v200.js')).href}?qa=${Date.now()}`);
check('verdade comercial V200 continua válida', assertCommercialTruthV200() === true && truth.release === 'V200', 'P0');
check('preços continuam 250/150/100/50', truth.services.map(item => item.price).join('/') === '250/150/100/50', 'P0');
check('Premium continua 199,90 sem IA e 30 skins', truth.plans.find(item => item.productKey === 'premium_lifetime')?.priceCents === 19990 && truth.aiUsage.premiumIncludesAI === false && truth.skins.count === 30, 'P0');
check('Orbe IA continua 89,90/400', truth.plans.find(item => item.productKey === 'orbe_ai_monthly')?.priceCents === 8990 && truth.plans.find(item => item.productKey === 'orbe_ai_monthly')?.creditsPerCycle === 400, 'P0');
check('packs continuam 200/600/1500', truth.aiCredits.map(item => `${item.credits}:${item.priceCents}`).join('/') === '200:3990/600:9990/1500:19990', 'P0');
check('Luna 1, Terra 10, Sol OFF', truth.aiUsage.lunaPerResponse === 1 && truth.aiUsage.terraPerResponse === 10 && truth.aiUsage.solEnabled === false, 'P0');
check('cobrança e checkout continuam desligados', truth.realBilling === false && truth.checkoutEnabled === false, 'P0');

const homeStart = index.indexOf('<section id="home"');
const tarotStart = index.indexOf('<section id="tarot"');
const home = homeStart >= 0 && tarotStart > homeStart ? index.slice(homeStart, tarotStart) : '';
check('Home identificada antes do Tarot', home.length > 0, 'P0');
check('Home conserva somente título principal', /<h1>Orbe das<br>Realidades/.test(home), 'P0');
check('Home conserva Orbe viva', /class="orb-stage-ref"/.test(home) && /id="orbCanvas"/.test(home), 'P0');
check('Home conserva proteção V194/V199', /home-orb-only-v194/.test(home) && /home-orb-absolute-v199\.css\?v=199/.test(index), 'P0');
check('Home sem cards editoriais visíveis', !/editorial-card|shop-portals|service-card/.test(home), 'P0');
check('Home byte estável desde V200', sha256Buffer(home) === '31bfd1ab0460e3367cd0e88dfeea03b5638ef33f996bb1351a0557ed5537bea1', 'P0', sha256Buffer(home));
if (BASE_ROOT && existsSync(join(BASE_ROOT, 'index.html'))) {
  const old = readFileSync(join(BASE_ROOT, 'index.html'), 'utf8');
  const oldHome = old.slice(old.indexOf('<section id="home"'), old.indexOf('<section id="tarot"'));
  check('Home idêntica à instalação V200 fornecida', home === oldHome, 'P0');
} else warnings.push('Comparação física com V200 não executada; hash canônico da Home foi validado.');

const frozen = {
  'orb-engine-v68.js':'3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js':'26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js':'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js':'2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
for (const [name, expected] of Object.entries(frozen)) {
  check(`congelado presente: ${name}`, existsSync(join(SITE_ROOT, name)), 'P0');
  check(`congelado intacto: ${name}`, existsSync(join(SITE_ROOT, name)) && sha256(SITE_ROOT, name) === expected, 'P0');
}
check('escopo preserva Orbe/menu/Tarot/Home', manifest.scope.orb_engine_changed === false && manifest.scope.mini_orb_changed === false && manifest.scope.menu_changed === false && manifest.scope.tarot_changed === false && manifest.scope.home_content_changed === false, 'P0');
check('preços não foram alterados', manifest.scope.prices_changed === false, 'P0');
check('todos os portões externos fechados', Object.values(manifest.release_blocks).every(value => value === false), 'P0');

const eagerImports = new Map();
const visit = name => {
  if (eagerImports.has(name)) return;
  if (!existsSync(join(SITE_ROOT, name))) { eagerImports.set(name, ['__MISSING__']); return; }
  const source = readSite(name);
  const deps = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/g)]
    .map(match => normalize(join(dirname(name), match[1].split(/[?#]/)[0])).replace(/^\.\//, ''))
    .filter(dep => /\.(?:js|mjs)$/.test(dep));
  eagerImports.set(name, deps);
  deps.forEach(visit);
};
visit('app-v201.js');
const missingImports = [...eagerImports].flatMap(([name, deps]) => deps.filter(dep => dep === '__MISSING__' || !existsSync(join(SITE_ROOT, dep))).map(dep => `${name} -> ${dep}`));
check('grafo inicial de imports completo', missingImports.length === 0, 'P0', missingImports.join('; '));
const visiting = new Set(), visited = new Set(), cycles = [];
const detect = (name, stack = []) => {
  if (visiting.has(name)) { cycles.push([...stack, name].join(' -> ')); return; }
  if (visited.has(name)) return;
  visiting.add(name);
  for (const dep of eagerImports.get(name) || []) if (dep !== '__MISSING__') detect(dep, [...stack, name]);
  visiting.delete(name); visited.add(name);
};
detect('app-v201.js');
check('grafo inicial sem ciclos', cycles.length === 0, 'P0', cycles.join('; '));

for (const name of ['app-v201.js','auth-client-v201.js','account-engine-v201.js','account-state-copy-v201.js','page-loader-v1.js','pwa-world-v201.js','skins-v201.js','sw.js','QA-V201-CONTA-REAL-CONTROLADA.mjs']) {
  const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input:readDelivery(name), encoding:'utf8', timeout:20000 });
  check(`${name}: sintaxe JavaScript`, result.status === 0, 'P0', result.stderr?.slice(-500) || '');
}
for (const name of manifest.delivery.files.filter(name => extname(name) === '.json')) {
  let valid = true;
  try { JSON.parse(readDelivery(name)); } catch { valid = false; }
  check(`${name}: JSON válido`, valid, 'P0');
}
const localRefs = [...index.matchAll(/(?:href|src)="([^"#]+)"/g)].map(match => match[1].split(/[?#]/)[0]).filter(value => value && !/^(?:https?:|mailto:|data:|blob:)/.test(value) && value !== './');
const missingRefs = [...new Set(localRefs.filter(name => !existsSync(join(SITE_ROOT, name))))];
check('referências locais do index resolvidas', missingRefs.length === 0, 'P0', missingRefs.join(', '));

const secrets = [/(?:live_secret|restricted_live|webhook_secret)_[A-Za-z0-9]{16,}/i,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/];
const deliveryText = manifest.delivery.files.filter(name => !['ARQUIVOS-V201-SHA256.txt','EVIDENCIA-QA-V201.json'].includes(name)).map(readDelivery).join('\n');
check('delta sem segredo material', !secrets.some(pattern => pattern.test(deliveryText)), 'P0');
check('delta sem link WhatsApp', !/(?:wa\.me|api\.whatsapp|whatsapp:\/\/)/i.test(deliveryText), 'P0');
check('delta sem ativação de cobrança', !/realBilling\s*[:=]\s*true|checkoutEnabled\s*[:=]\s*true/i.test(deliveryText), 'P0');

const hashLines = readDelivery('ARQUIVOS-V201-SHA256.txt').trim().split(/\r?\n/).filter(Boolean);
const hashes = new Map(hashLines.map(line => { const match = line.match(/^([a-f0-9]{64})  (.+)$/); return match ? [match[2], match[1]] : ['', '']; }));
const hashTargets = manifest.delivery.files.filter(name => !['ARQUIVOS-V201-SHA256.txt','EVIDENCIA-QA-V201.json'].includes(name));
check('checksums cobrem arquivos estáveis', hashTargets.every(name => hashes.has(name)) && hashes.size === hashTargets.length, 'P0');
for (const name of hashTargets) check(`checksum válido: ${name}`, hashes.get(name) === sha256(DELIVERY_ROOT, name), 'P0');

const legacy = spawnSync(process.execPath, [join(SITE_ROOT, 'QA-V197-RELEASE-CANDIDATE.mjs')], { cwd:SITE_ROOT, encoding:'utf8', timeout:180000 });
const legacyOutput = `${legacy.stdout || ''}\n${legacy.stderr || ''}`;
check('regressão V197 preserva ao menos 1219 checks', /1219\/1221 PASS/.test(legacyOutput), 'P0', legacyOutput.slice(-1000));
check('regressão antiga diverge só nos 2 portões versionados', /P0=2 P1=0/.test(legacyOutput) && /index usa app V196/.test(legacyOutput) && /service worker atual V196/.test(legacyOutput), 'P0', legacyOutput.slice(-1000));

warnings.push('A migração principal V201 e a correção RLS legada permanecem decisões remotas separadas até autorização explícita.');
warnings.push('O STAGING observado não possui contas Auth nem proprietária Admin; e-mail real e MFA da proprietária não foram disparados.');
warnings.push('Cobrança real, produção, DNS, Stripe, lojas, Resend e Orbe IA Sol continuam bloqueados.');
warnings.push('O primeiro carregamento após instalar a V201 precisa estar online para renovar o cache.');
const p0 = failures.filter(item => item.severity === 'P0').length;
const p1 = failures.filter(item => item.severity === 'P1').length;
const evidence = {
  project:'Divina Bruxa',
  version:201,
  suite:'Plano Supremo 2.0 - Macroetapa 3 - Conta Real Controlada',
  generated_at:new Date().toISOString(),
  total:passes.length + failures.length,
  passed:passes.length,
  failed:failures.length,
  gate:{ p0, p1, package_approved:p0 === 0 && p1 === 0 },
  account:{ flows:10, sync_surfaces:7, lifecycle_states:3, rls_tables:policyTables.length, critical_locales:3 },
  runtime:{ entrypoint:'app-v201.js?v=201', cache_generation:201, eager_import_cycles:cycles.length },
  home:{ visible:['localized_orb_title','living_orb'], changed:false, sha256:sha256Buffer(home) },
  commercial:{ consultations_brl:truth.services.map(item => item.price), real_billing:false },
  staging:{
    project_ref:contract.supabase.project_ref,
    main_migration:contract.supabase.main_migration,
    legacy_rls_advisory:contract.supabase.legacy_rls_advisory,
    auth_users_observed:contract.supabase.auth_users_observed,
    active_admin_owners_observed:contract.supabase.active_admin_owners_observed,
    real_email_flow_executed:false,
    owner_mfa_flow_executed:false
  },
  frozen_hashes:frozen,
  external_actions:{ production:false, dns:false, real_billing:false, stripe:false, resend:false, personal_account_creation:false, stores:false, sol:false },
  warnings,
  failures
};
if (process.env.V201_QA_NO_WRITE !== '1') writeFileSync(join(DELIVERY_ROOT, 'EVIDENCIA-QA-V201.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`DIVINA BRUXA V201 — ${passes.length}/${evidence.total} PASS`);
console.log(`P0=${p0} P1=${p1}`);
console.log(`ACCOUNT=CONTROLLED RLS=${policyTables.length} HOME=TITLE+ORB BILLING=OFF`);
if (failures.length) {
  for (const failure of failures) console.error(`[${failure.severity}] ${failure.name}${failure.detail ? ` :: ${failure.detail}` : ''}`);
  process.exitCode = 1;
}
