#!/usr/bin/env node
/* QA determinístico da entrega incremental V190. Execute na raiz instalada do projeto. */

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = process.cwd();
const textCache = new Map();
const results = [];

async function source(file) {
  if (!textCache.has(file)) textCache.set(file, await readFile(path.join(ROOT, file), 'utf8'));
  return textCache.get(file);
}

function check(name, task) {
  try {
    task();
    results.push({ name, ok:true });
  } catch (error) {
    results.push({ name, ok:false, error:error.message });
  }
}

async function contains(file, entries) {
  const value = await source(file);
  entries.forEach(([name, needle]) => check(`${file}: ${name}`, () => {
    if (needle instanceof RegExp) assert.match(value, needle);
    else assert.ok(value.includes(needle), `ausente: ${needle}`);
  }));
}

async function excludes(file, entries) {
  const value = await source(file);
  entries.forEach(([name, needle]) => check(`${file}: ${name}`, () => {
    if (needle instanceof RegExp) assert.doesNotMatch(value, needle);
    else assert.ok(!value.includes(needle), `não deveria conter: ${needle}`);
  }));
}

for (const file of ['app.js','page-loader-v1.js','sw.js','config.js','auth-client-v189.js','ai-engine.js','ai-policy.js','ai-credits.js']) {
  check(`${file}: sintaxe JavaScript`, () => {
    const run = spawnSync(process.execPath, ['--check', file], { cwd:ROOT, encoding:'utf8' });
    assert.equal(run.status, 0, run.stderr || run.stdout);
  });
}
check('orbe-ai-chat-v190.ts: sintaxe TypeScript', () => {
  const run = spawnSync(process.execPath, ['--experimental-strip-types', '--check', 'orbe-ai-chat-v190.ts'], { cwd:ROOT, encoding:'utf8' });
  assert.equal(run.status, 0, run.stderr || run.stdout);
});

await contains('index.html', [
  ['app V190', 'app.js?v=190'],
  ['CSS V190', 'orbe-ai-governada-v190.css?v=190'],
  ['service worker V190', "register('./sw.js?v=190')"],
  ['chave de recarga V190', 'divina.sw.reload.v190'],
  ['seção Orbe V190', 'WHIT · ORBE IA GOVERNADA · V190'],
  ['Luna custa 1', 'Luna · 1 crédito'],
  ['Terra custa 10', 'Terra · 10 créditos'],
  ['Sol desligada', 'Sol · desligada'],
  ['ledger visível', 'saldo e o ledger confirmados pelo servidor'],
  ['Diário sem leitura silenciosa', 'sem leitura silenciosa do Diário'],
  ['Web desligada', 'sem busca na web'],
  ['sem cobrança', 'sem cobrança nesta etapa'],
  ['Tarot Livre 78', '78 cartas sem repetição'],
  ['revelação pela Orbe', 'Toque somente na Orbe'],
  ['sem significado', 'sem significado e sem repetição'],
  ['Mesa Real', 'MESA REAL'],
  ['13 por 6', '78 posições · 13 fileiras de 6'],
  ['linhas do grid', 'aria-rowcount="13"'],
  ['colunas do grid', 'aria-colcount="6"'],
  ['preços oficiais', 'Mesa Real Profissional<small>R$ 250'],
  ['preço Leitura', 'Leitura de Mentes<small>R$ 150'],
  ['preço Conselho', 'Carta de Conselho<small>R$ 100'],
  ['preço Pergunta', 'Pergunta Direta<small>R$ 50']
]);
await excludes('index.html', [
  ['sem app antigo', 'app.js?v=189'],
  ['sem SW antigo', "register('./sw.js?v=189')"],
  ['sem texto enganoso de IA', 'sem cobranças nesta versão']
]);

await contains('ai-policy.js', [
  ['release', "release: 'V190'"],
  ['schema', "AI_SCHEMA_VERSION = '8.0.0'"],
  ['teste 3', 'demoCredits: 3'],
  ['Luna', "luna: Object.freeze"],
  ['Luna 1', 'cost:1, enabled:true'],
  ['Terra', "terra: Object.freeze"],
  ['Terra 10', 'cost:10, enabled:true'],
  ['Sol off', 'cost:0, enabled:false'],
  ['seis por minuto', 'requestsPerMinute:6'],
  ['cem por dia', 'dailyCredits:100'],
  ['mensagem 5000', 'maxMessageCharacters:5000'],
  ['histórico 12', 'maxContextMessages:12'],
  ['contexto 24000', 'maxContextCharacters:24000'],
  ['billing off', 'billingEnabled:false'],
  ['Web off', 'webSearchEnabled:false'],
  ['ledger server', 'serverLedger:true'],
  ['Diário entrada única', "diaryScope:'single-entry'"],
  ['sem texto no ledger', 'ledgerReceivesText:false'],
  ['sem histórico no servidor', 'serverConversationHistory:false'],
  ['estado do provedor off', 'providerApplicationState:false'],
  ['histórico local', 'historyLocalOnly:true'],
  ['conta exigida', 'requiresAccount:true'],
  ['e-mail verificado', 'requiresVerifiedEmail:true'],
  ['consentimento', 'requiresConsent:true'],
  ['chave no servidor', "apiKeyLocation:'server-only'"],
  ['sem leitura mental', 'thirdPartyMindReading:false'],
  ['sem alegação de identidade', 'identityClaims:false']
]);
await excludes('ai-policy.js', [
  ['sem 400 créditos demonstrativos', /demoCredits\s*:\s*400/],
  ['sem modo Sol habilitado', /sol:[\s\S]{0,260}enabled:true/]
]);

await contains('ai-credits.js', [
  ['somente snapshot', 'let snapshot = null'],
  ['aceita servidor', 'acceptServerCreditState'],
  ['estado não autoritativo', 'authoritative:false'],
  ['estado autoritativo', 'authoritative:true'],
  ['provedor no snapshot', 'providerConfigured'],
  ['limpa memória', 'clearCreditState'],
  ['ledger limitado', '.slice(0, 20)']
]);
await excludes('ai-credits.js', [
  ['sem localStorage', 'localStorage'],
  ['sem concessão', 'grantCredits'],
  ['sem débito', 'spendCredits'],
  ['sem compra simulada', 'purchaseCredits'],
  ['sem saldo local fixo', 'balance:400']
]);

await contains('ai-engine.js', [
  ['status real', 'this.auth.aiStatus()'],
  ['chat real', 'this.auth.aiChat(request'],
  ['envio exige status autoritativo', '!creditState().authoritative'],
  ['envio exige provedor', '!availability.providerConfigured'],
  ['botão exige prontidão', 'this.sending || !ready'],
  ['AbortController', 'new AbortController()'],
  ['consentimento por envio', 'this.consent.checked = false'],
  ['conta verificada', 'Entre na sua conta verificada'],
  ['saldo do servidor', 'SALDO DO SERVIDOR'],
  ['ledger auditável', 'Ledger auditável do servidor'],
  ['histórico local', 'histórico somente local'],
  ['contexto visível', 'Contexto que será enviado:'],
  ['OpenAI nomeada', 'ao provedor OpenAI'],
  ['12 mensagens nomeadas', 'até 12 mensagens recentes'],
  ['Diário sem silêncio', 'Nada do Diário entra sem seleção explícita'],
  ['Diário único', "this.setSource('journal-single-entry')"],
  ['tiragem única', "this.setSource('tarot-single-spread'"],
  ['aula única', "this.setSource('school-single-lesson')"],
  ['cartas diretas', '(direta)'],
  ['Sol sem rota', 'não possui rota de servidor'],
  ['billing bloqueado', 'Cobrança continua desligada'],
  ['packs artigos', '<article><b>+'],
  ['proteção sem débito', 'sem débito de créditos'],
  ['exportação local', 'privateAIExport'],
  ['limpeza local', 'store.remove(AI_HISTORY_KEY)'],
  ['confirmação de extra', 'EXTRA_CONFIRMATION_REQUIRED'],
  ['request extra imutável', 'confirmExtra:true'],
  ['erro de custo global', 'GLOBAL_COST_LIMIT'],
  ['erro de limite diário', 'DAILY_CREDIT_LIMIT'],
  ['erro de sessão', 'ACTIVE_SESSION_REQUIRED'],
  ['erro de verificação', 'EMAIL_VERIFICATION_REQUIRED']
]);
await excludes('ai-engine.js', [
  ['sem grant local', 'grantCredits'],
  ['sem spend local', 'spendCredits'],
  ['sem simulação de resposta', 'setTimeout(resolve'],
  ['sem fetch direto OpenAI', 'api.openai.com'],
  ['sem chave de API', 'OPENAI_API_KEY']
]);

await contains('auth-client-v189.js', [
  ['ponte V190', 'PONTE ORBE IA V190'],
  ['status GET', "aiStatus() { return this.functionRequest('orbe-ai-chat', { method:'GET'"],
  ['chat POST', "aiChat(payload, signal) { return this.functionRequest('orbe-ai-chat'"],
  ['bearer da sessão', 'Authorization:`Bearer ${current.access_token}`'],
  ['publishable key', 'apikey:this.publishableKey'],
  ['timeout', 'CLIENT_TIMEOUT'],
  ['aborto', 'CLIENT_ABORTED'],
  ['rede', 'NETWORK_UNAVAILABLE'],
  ['sessão temporária', "SESSION_KEY = 'divina.auth.session.v189'"],
  ['function base', 'this.functionBase']
]);
await excludes('auth-client-v189.js', [
  ['sem service role', 'service_role'],
  ['sem secret key', 'OPENAI_API_KEY'],
  ['sem leitura de localStorage', 'localStorage.getItem'],
  ['sem escrita em localStorage', 'localStorage.setItem']
]);

await contains('orbe-ai-chat-v190.ts', [
  ['release V190', 'const RELEASE = "V190"'],
  ['schema 8', 'const SCHEMA_VERSION = "8.0.0"'],
  ['corpo 64 KB', '64 * 1024'],
  ['origem oficial', 'https://divinabruxa.com.br'],
  ['origem local 4173', 'http://localhost:4173'],
  ['getUser', 'user.auth.getUser(token)'],
  ['getClaims', 'user.auth.getClaims(token)'],
  ['sessão ativa', 'verify_active_account_session'],
  ['e-mail confirmado', 'EMAIL_VERIFICATION_REQUIRED'],
  ['somente Luna e Terra', 'new Set(["luna", "terra"])'],
  ['78 nomes canônicos', 'CARD_NAMES'],
  ['IDs sem repetição', 'ids.has(cardId)'],
  ['orientação normal', 'orientation: "normal"'],
  ['consentimento', 'CONSENT_REQUIRED'],
  ['Diário entrada única', 'JOURNAL_CONSENT_REQUIRED'],
  ['Web bloqueada', 'WEB_SEARCH_DISABLED'],
  ['fingerprint SHA-256', 'SHA-256'],
  ['gate antes da moderação', 'gate_ai_request_v190'],
  ['moderação', 'omni-moderation-latest'],
  ['endpoint moderação', 'https://api.openai.com/v1/moderations'],
  ['endpoint Responses', 'https://api.openai.com/v1/responses'],
  ['modelo Luna', 'gpt-5.6-luna'],
  ['modelo Terra', 'gpt-5.6-terra'],
  ['estado off', 'store: false'],
  ['sem Web Search', 'webSearch: false'],
  ['reserva RPC', 'reserve_ai_credits_v190'],
  ['liquidação RPC', 'settle_ai_usage_v190'],
  ['devolução RPC', 'refund_ai_credits_v190'],
  ['timeout 45s', 'setTimeout(stop, 45000)'],
  ['custo oficial por tokens', 'estimatedCost'],
  ['provider ID exigido', 'AI_PROVIDER_ID_MISSING'],
  ['sem prompt nos logs', 'console.error(`[orbe-ai-${RELEASE.toLowerCase()}]`, code, requestId'],
  ['segurança sem crédito', 'chargedCredits: 0'],
  ['histórico no servidor off', 'serverConversationHistory: false'],
  ['conteúdo no ledger off', 'contentInLedger: false']
]);
await excludes('orbe-ai-chat-v190.ts', [
  ['sem CORS curinga', 'Access-Control-Allow-Origin": "*'],
  ['sem modelo Sol', 'gpt-5.6-sol'],
  ['sem store true', 'store: true'],
  ['sem tools', 'tools:'],
  ['sem prompt no log', 'console.log(message'],
  ['sem conteúdo persistido', '.from("ai_messages").insert']
]);

await contains('SUPABASE-ORBE-IA-STAGING-V190.sql', [
  ['transação', 'begin;'],
  ['Sol constraint', 'and sol_enabled = false'],
  ['IA pausada na migração', 'set orbe_ai_enabled = false'],
  ['RPM 6', 'per_user_requests_per_minute = 6'],
  ['dia 100', 'per_user_daily_credit_limit = 100'],
  ['créditos globais 2000', 'global_daily_credit_limit = 2000'],
  ['requests globais 500', 'global_daily_request_limit = 500'],
  ['custo global 2.50', 'global_daily_cost_limit_usd = 2.500000'],
  ['input 5000', 'max_input_characters = 5000'],
  ['histórico 12', 'max_history_messages = 12'],
  ['contexto 24000', 'max_context_characters = 24000'],
  ['saída Luna 700', 'luna_max_output_tokens = 700'],
  ['saída Terra 1400', 'terra_max_output_tokens = 1400'],
  ['conteúdo sempre false', 'and content_retained = false'],
  ['índice por estado', 'ai_usage_status_created_v190_idx'],
  ['tabela de gate sem texto', 'private.ai_request_gates'],
  ['gate por usuário', 'ai_request_gates_user_created_v190_idx'],
  ['gate global', 'ai_request_gates_created_v190_idx'],
  ['leitura própria conversa', 'create policy "read own conversations"'],
  ['sem escrita conversa', 'revoke insert, update, delete on public.ai_conversations'],
  ['sem escrita mensagens', 'revoke insert, update, delete on public.ai_messages'],
  ['flags sem cliente', 'revoke all on public.ai_feature_flags from anon, authenticated'],
  ['status RPC', 'ai_account_status_v190'],
  ['gate RPC', 'gate_ai_request_v190'],
  ['reserva RPC', 'reserve_ai_credits_v190'],
  ['liquidação RPC', 'settle_ai_usage_v190'],
  ['devolução RPC', 'refund_ai_credits_v190'],
  ['security definer', 'security definer'],
  ['search path vazio', "set search_path = ''"],
  ['lock global', "pg_advisory_xact_lock(hashtextextended('orbe-ai-global-v190', 190))"],
  ['lock por usuário', "pg_advisory_xact_lock(hashtextextended(target_user::text, 190))"],
  ['idempotência', 'request_id_conflict'],
  ['stale 15 minutos', "interval '15 minutes'"],
  ['Luna 1', "when 'luna' then 1 else 10"],
  ['Terra 10', "when 'luna' then 1 else 10"],
  ['reserva segura Luna', "when 'luna' then 0.020000 else 0.200000"],
  ['reserva segura Terra', "when 'luna' then 0.020000 else 0.200000"],
  ['mensal primeiro', 'wallet.monthly_credits >= cost'],
  ['demo só Luna', "requested_mode = 'luna' and wallet.demo_credits >= cost"],
  ['extra com confirmação', 'wallet.extra_credits >= cost and confirm_extra is true'],
  ['ledger reserva', "chosen_bucket,-cost,'reservation'"],
  ['ledger devolução', "-reservation.delta, 'refund'"],
  ['teto de custo por request', 'cost_ceiling_exceeded'],
  ['provider ID no ledger', 'provider_request_id = provider_id'],
  ['RPC só service role', 'grant execute on function public.ai_account_status_v190(uuid) to service_role'],
  ['gate só service role', 'grant execute on function public.gate_ai_request_v190(uuid,uuid,text) to service_role'],
  ['funções antigas removidas', 'drop function if exists public.reserve_ai_credits'],
  ['commit', 'commit;']
]);
await excludes('SUPABASE-ORBE-IA-STAGING-V190.sql', [
  ['sem índice de uso duplicado', 'ai_usage_user_created_v190_idx'],
  ['sem índice de ledger duplicado', 'ai_ledger_user_created_v190_idx']
]);

await contains('SUPABASE-ORBE-IA-INDEX-HARDENING-V190.sql', [
  ['remove índice de uso duplicado', 'drop index if exists public.ai_usage_user_created_v190_idx'],
  ['remove índice de ledger duplicado', 'drop index if exists public.ai_ledger_user_created_v190_idx']
]);

await contains('ATIVAR-ORBE-IA-STAGING-V190.sql', [
  ['STAGING', 'STAGING'],
  ['ativa V190', 'orbe_ai_enabled = true'],
  ['Sol continua off', 'sol_enabled = false']
]);

await contains('sw.js', [
  ['cache V190', "divina-bruxa-v60-orbe-ai-v190"],
  ['engine cache', "'./ai-engine.js'"],
  ['policy cache', "'./ai-policy.js'"],
  ['credits cache', "'./ai-credits.js'"],
  ['CSS cache', "'./orbe-ai-governada-v190.css'"],
  ['API sensível sem cache', '(ai|auth|account|admin|entitlements|billing|payments|consultations)'],
  ['somente GET cacheável', "event.request.method!=='GET'"],
  ['remove caches antigos', 'caches.delete(key)']
]);

await contains('orbe-ai-governada-v190.css', [
  ['gate', '#ai .ai-auth-gate'],
  ['hidden', '.ai-auth-gate[hidden]'],
  ['foco', '#ai .ai-focus-field'],
  ['escopo', '#ai .ai-context-scope'],
  ['ledger', '#ai [data-ai-ledger-list]'],
  ['packs travados', '.ai-credit-store-locked .ai-pack-grid article'],
  ['mobile', '@media (max-width: 760px)'],
  ['movimento reduzido', '@media (prefers-reduced-motion: reduce)'],
  ['alvos 44px', 'min-height: 44px']
]);

await contains('privacidade-e-dados.html', [
  ['V190', 'ORBE IA GOVERNADA · V190'],
  ['OpenAI', '<h3>OpenAI</h3>'],
  ['contexto 12', 'no máximo 12 mensagens recentes'],
  ['Diário único', 'uma única entrada do Diário'],
  ['store false', '<code>store: false</code>'],
  ['treino por padrão off', 'não são usados para treinar modelos por padrão'],
  ['retenção de abuso', 'retidos por até 30 dias'],
  ['gate 30 dias', 'Um gate técnico conserva ID, usuário, hash e horário por até 30 dias'],
  ['hash não é anonimização', 'não deve ser tratado como anonimização'],
  ['consentimento renovado', 'O consentimento é desmarcado após cada envio']
]);
await contains('termos-de-uso.html', [
  ['V190', 'ORBE IA GOVERNADA · V190'],
  ['IA não pessoa', 'não uma pessoa ou autoridade'],
  ['Luna 1', 'Luna custa 1 crédito'],
  ['Terra 10', 'Terra custa 10'],
  ['Sol off', 'Sol permanece desligada'],
  ['3 teste', '3 créditos Luna de teste'],
  ['sem billing', 'Billing, renovação e pacotes permanecem desligados'],
  ['refundo', 'Falha antes da conclusão aciona devolução'],
  ['sem cartão', 'Orbe IA, Consulta ou e-mail']
]);

const expectedFrozen = {
  'orb-engine-v68.js':'3f8a1c87c558194901089f96f96059b066c7dde8bf33475816ceaca74b9a369f',
  'mini-orb-engine.js':'26d46580f7465139ac54b9953eaa6d0488e3a89c0bee9c7f2d0fbbaa27b91916',
  'menu-completo-v177.js':'f8c010d779844cecd24a1fa66acbefa2b3e78715e329e961496ed0954a921b64',
  'tarot-engine.js':'2abf5a31f1a9f219074e03fe4a7052c60fed598df5fb07c4502bf8f5e8eaf92e',
  'tarot-data.js':'18e5a1a3bcecf27fdb9c14c44c964a61f6eacfadc2f52ccaa76f0cbf60ee7cc3'
};
for (const [file, expected] of Object.entries(expectedFrozen)) {
  const digest = createHash('sha256').update(await readFile(path.join(ROOT, file))).digest('hex');
  check(`${file}: congelado byte a byte`, () => assert.equal(digest, expected));
}

const tarot = await import(`${pathToFileURL(path.join(ROOT, 'tarot-data.js')).href}?qa=190`);
check('catálogo: 78 cartas', () => assert.equal(tarot.CARDS.length, 78));
check('catálogo: IDs 0 a 77', () => assert.deepEqual(tarot.CARDS.map(card => card.id), Array.from({ length:78 }, (_, index) => index)));
check('catálogo: canonical IDs únicos', () => assert.equal(new Set(tarot.CARDS.map(card => card.canonicalId)).size, 78));
check('catálogo: todas diretas', () => assert.ok(tarot.CARDS.every(card => card.orientation === 'normal')));
check('catálogo: orientação exigida direta', () => assert.equal(tarot.REQUIRED_ORIENTATION, 'normal'));

const policy = await import(`${pathToFileURL(path.join(ROOT, 'ai-policy.js')).href}?qa=190`);
check('política: Luna 1', () => assert.equal(policy.AI_POLICY.modes.luna.cost, 1));
check('política: Terra 10', () => assert.equal(policy.AI_POLICY.modes.terra.cost, 10));
check('política: Sol off', () => assert.equal(policy.AI_POLICY.modes.sol.enabled, false));
check('política: billing off', () => assert.equal(policy.AI_POLICY.subscription.billingEnabled, false));
const longHistory = Array.from({ length:20 }, (_, index) => policy.createAIMessage(index % 2 ? 'assistant' : 'user', `mensagem-${index}`, { id:`m-${index}` }));
const request = policy.createAIRequest({ history:longHistory, mode:'terra', focus:'tarot', source:'journal-single-entry', message:'agora' });
check('request: UUID', () => assert.match(request.requestId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i));
check('request: 12 mensagens', () => assert.equal(request.history.length, 12));
check('request: mantém as 12 recentes', () => assert.equal(request.history[0].content, 'mensagem-8'));
check('request: Terra', () => assert.equal(request.mode, 'terra'));
check('request: foco Tarot', () => assert.equal(request.focus, 'tarot'));
check('request: entrada única', () => assert.equal(request.journalConsentScope, 'single-entry'));
check('request: consentimento true', () => assert.equal(request.consent, true));
check('request: Web false', () => assert.equal(request.capabilities.webSearch, false));
check('request: sem histórico de servidor', () => assert.equal(request.capabilities.serverConversationHistory, false));
const normalizedTarot = policy.normalizeTarotContext({ consentScope:'single-spread', spreadId:'x', spreadName:'T', positions:[
  { position:'A', cardId:0, cardName:'O Louco' },
  { position:'B', cardId:0, cardName:'duplicada' },
  { position:'C', cardId:77, cardName:'Rei de Ouros' },
  { position:'D', cardId:78, cardName:'inválida' }
] });
check('tarot IA: filtra repetição e inválida', () => assert.deepEqual(normalizedTarot.positions.map(item => item.cardId), [0,77]));
check('tarot IA: força direta', () => assert.ok(normalizedTarot.positions.every(item => item.orientation === 'normal')));
check('histórico: máximo 40 local', () => assert.equal(policy.normalizeAIHistory(Array.from({ length:60 }, (_, index) => ({ id:`h-${index}`, role:'user', content:`${index}` }))).length, 40));
check('mensagem: limpa NUL', () => assert.equal(policy.createAIMessage('user', 'a\u0000b').content, 'ab'));

const credits = await import(`${pathToFileURL(path.join(ROOT, 'ai-credits.js')).href}?qa=190`);
check('créditos: vazio não autoritativo', () => assert.equal(credits.creditState().authoritative, false));
const accepted = credits.acceptServerCreditState({
  enabled:true,
  provider:{ configured:true },
  wallet:{ monthly:10, extra:4, demo:2, total:16 },
  usage:{ todayCredits:11, todayRemaining:89 },
  ledgerCount:1,
  ledger:[{ id:'l', requestId:'r', bucket:'monthly', delta:-10, reason:'reservation', createdAt:'2026-09-08T00:00:00Z' }],
  limits:{ requestsPerMinute:6, dailyCredits:100, maxInputCharacters:5000, maxHistoryMessages:12, maxContextCharacters:24000 },
  serverTime:'2026-09-08T00:00:01Z'
});
check('créditos: snapshot autoritativo', () => assert.equal(accepted.authoritative, true));
check('créditos: saldo servidor', () => assert.equal(accepted.balance, 16));
check('créditos: buckets', () => assert.deepEqual([accepted.monthly, accepted.extra, accepted.demo], [10,4,2]));
check('créditos: provedor', () => assert.equal(accepted.providerConfigured, true));
check('créditos: ledger', () => assert.equal(accepted.ledger[0].delta, -10));
check('créditos: limite servidor', () => assert.equal(accepted.limits.maxMessageCharacters, 5000));
check('créditos: clear', () => assert.equal(credits.clearCreditState().authoritative, false));

const configText = await source('config.js');
for (const [service, price] of [['Mesa Real Profissional',250],['Leitura de Mentes',150],['Carta de Conselho',100],['Pergunta Direta',50]]) {
  check(`config: ${service} R$ ${price}`, () => assert.ok(configText.includes(`{name:'${service}',price:${price}`)));
}
check('config: e-mail oficial', () => assert.ok(configText.includes("contactEmail:'orbedasrealidades@hotmail.com'")));
check('config: sem WhatsApp', () => assert.ok(configText.includes("whatsapp:''")));
check('config: IA habilitada no cliente', () => assert.ok(configText.includes('aiEnabled:true')));

const failures = results.filter(result => !result.ok);
console.log(JSON.stringify({
  release:'V190',
  suite:'Orbe IA verdadeira e governada',
  passed:results.length - failures.length,
  failed:failures.length,
  total:results.length,
  failures
}, null, 2));
if (failures.length) process.exitCode = 1;
