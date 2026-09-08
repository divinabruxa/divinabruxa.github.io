import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.112.4";

const RELEASE = "V190";
const SCHEMA_VERSION = "8.0.0";
const MAX_BODY_BYTES = 64 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SESSION_UUID = UUID;
const HASH = /^[0-9a-f]{64}$/;
const MODES = new Set(["luna", "terra"]);
const FOCUSES = new Set(["reflection", "tarot", "symbolic-persona", "school"]);
const SOURCES = new Set(["message", "journal-single-entry", "tarot-single-spread", "school-single-lesson"]);
const BASE_ORIGINS = new Set([
  "https://divinabruxa.com.br",
  "https://www.divinabruxa.com.br",
  "https://divinabruxa.github.io",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
]);

const MAJORS = [
  "O Louco","O Mago","A Sacerdotisa","A Imperatriz","O Imperador","O Hierofante","Os Enamorados",
  "O Carro","A Força","O Eremita","A Roda da Fortuna","A Justiça","O Pendurado","A Morte",
  "A Temperança","O Diabo","A Torre","A Estrela","A Lua","O Sol","O Julgamento","O Mundo"
];
const RANKS = ["Ás","2","3","4","5","6","7","8","9","10","Pajem","Cavaleiro","Rainha","Rei"];
const SUITS = ["Copas","Espadas","Paus","Ouros"];
const CARD_NAMES = Object.freeze([...MAJORS, ...SUITS.flatMap((suit) => RANKS.map((rank) => `${rank} de ${suit}`))]);

type Json = Record<string, unknown>;
type HistoryItem = { role: "user" | "assistant"; content: string };
type TarotPosition = { position: string; cardId: number; cardName: string; orientation: "normal" };
type TarotContext = { source: "spread"; spreadId: string; spreadName: string; question: string; consentScope: "single-spread"; positions: TarotPosition[] };

class OrbeError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "OrbeError";
    this.code = code;
    this.status = status;
  }
}

const env = (name: string) => Deno.env.get(name)?.trim() ?? "";
const clean = (value: unknown, limit: number) => String(value ?? "").replaceAll("\u0000", "").trim().slice(0, limit);
const bytes = (value: string) => new TextEncoder().encode(value).byteLength;

function configuredOrigins(): Set<string> {
  const result = new Set(BASE_ORIGINS);
  const configured = env("STAGING_ALLOWED_ORIGINS");
  if (!configured) return result;
  try {
    const values = configured.startsWith("[") ? JSON.parse(configured) : configured.split(",");
    if (Array.isArray(values)) values.map((value) => clean(value, 300)).filter(Boolean).forEach((value) => result.add(value));
  } catch {
    // Configuração inválida não amplia a lista segura.
  }
  return result;
}

function requestOrigin(req: Request): string | null {
  const origin = req.headers.get("Origin");
  if (!origin) return null;
  if (!configuredOrigins().has(origin)) throw new OrbeError("ORIGIN_NOT_ALLOWED", "Origem STAGING não autorizada.", 403);
  return origin;
}

function responseHeaders(origin: string | null, extra: Record<string, string> = {}): Headers {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Vary": "Origin",
    ...extra
  });
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

function json(origin: string | null, body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(origin, extra) });
}

function options(origin: string | null): Response {
  return new Response(null, {
    status: 204,
    headers: responseHeaders(origin, {
      "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Max-Age": "600"
    })
  });
}

function errorResponse(origin: string | null, error: unknown, requestId?: string): Response {
  const known = error instanceof OrbeError;
  const status = known ? error.status : 500;
  const code = known ? error.code : "ORBE_AI_REQUEST_FAILED";
  const message = known ? error.message : "A Orbe IA está temporariamente indisponível. Nenhum crédito novo foi consumido.";
  return json(origin, { ok: false, release: RELEASE, requestId: requestId ?? null, error: { code, message } }, status);
}

async function readBody(req: Request): Promise<Json> {
  const contentLength = Number(req.headers.get("Content-Length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) throw new OrbeError("REQUEST_TOO_LARGE", "A mensagem ultrapassa o limite seguro.", 413);
  const text = await req.text();
  if (bytes(text) > MAX_BODY_BYTES) throw new OrbeError("REQUEST_TOO_LARGE", "A mensagem ultrapassa o limite seguro.", 413);
  try {
    const parsed = JSON.parse(text);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("invalid");
    return parsed as Json;
  } catch {
    throw new OrbeError("INVALID_JSON", "Solicitação inválida.", 400);
  }
}

function requiredEnvironment(name: string): string {
  const value = env(name);
  if (!value) throw new OrbeError("SERVER_CONFIGURATION_MISSING", "Configuração segura indisponível.", 503);
  return value;
}

function bearer(req: Request): string {
  const match = (req.headers.get("Authorization") ?? "").match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) throw new OrbeError("AUTHENTICATION_REQUIRED", "Entre na sua conta para conversar com a Orbe.", 401);
  return match[1];
}

function userClient(req: Request): SupabaseClient {
  return createClient(requiredEnvironment("SUPABASE_URL"), requiredEnvironment("SUPABASE_ANON_KEY"), {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

function adminClient(): SupabaseClient {
  return createClient(requiredEnvironment("SUPABASE_URL"), requiredEnvironment("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

async function authenticated(req: Request) {
  const token = bearer(req);
  const user = userClient(req);
  const [{ data: userData, error: userError }, { data: claimsData, error: claimsError }] = await Promise.all([
    user.auth.getUser(token),
    user.auth.getClaims(token)
  ]);
  const account = userData?.user;
  const claims = claimsData?.claims;
  const sessionId = clean(claims?.session_id, 80);
  if (userError || claimsError || !account || !claims || claims.sub !== account.id || claims.role !== "authenticated") {
    throw new OrbeError("AUTHENTICATION_REQUIRED", "Entre novamente para continuar.", 401);
  }
  if (!SESSION_UUID.test(sessionId)) throw new OrbeError("ACTIVE_SESSION_REQUIRED", "Sua sessão precisa ser renovada.", 401);
  if (!account.email_confirmed_at && !account.confirmed_at) {
    throw new OrbeError("EMAIL_VERIFICATION_REQUIRED", "Confirme seu e-mail antes de usar a Orbe IA.", 403);
  }
  const admin = adminClient();
  const { data: active, error } = await admin.rpc("verify_active_account_session", {
    p_user_id: account.id,
    p_session_id: sessionId
  });
  if (error || active !== true) throw new OrbeError("ACTIVE_SESSION_REQUIRED", "Sua sessão não está mais ativa. Entre novamente.", 401);
  return { account, admin };
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function parseHistory(value: unknown, maxMessages: number, maxCharacters: number): HistoryItem[] {
  if (value == null) return [];
  if (!Array.isArray(value) || value.length > maxMessages) throw new OrbeError("INVALID_HISTORY", "O contexto da conversa ultrapassa o limite seguro.", 400);
  let characters = 0;
  return value.map((item) => {
    if (!item || typeof item !== "object") throw new OrbeError("INVALID_HISTORY", "Contexto de conversa inválido.", 400);
    const role = (item as Json).role;
    if (role !== "user" && role !== "assistant") throw new OrbeError("INVALID_HISTORY", "Papel de conversa inválido.", 400);
    const content = clean((item as Json).content, 3000);
    if (!content) throw new OrbeError("INVALID_HISTORY", "Mensagem vazia no contexto.", 400);
    characters += content.length;
    if (characters > maxCharacters) throw new OrbeError("INVALID_HISTORY", "O contexto da conversa ultrapassa o limite seguro.", 400);
    return { role, content };
  });
}

function parseTarot(value: unknown): TarotContext | null {
  if (value == null) return null;
  if (!value || Array.isArray(value) || typeof value !== "object") throw new OrbeError("INVALID_TAROT_CONTEXT", "Tiragem inválida.", 400);
  const raw = value as Json;
  if (raw.source !== "spread" || raw.consentScope !== "single-spread" || !Array.isArray(raw.positions)) {
    throw new OrbeError("INVALID_TAROT_CONTEXT", "Apenas uma tiragem consentida pode ser enviada.", 400);
  }
  if (raw.positions.length < 1 || raw.positions.length > 12) throw new OrbeError("INVALID_TAROT_CONTEXT", "A tiragem excede o limite de 12 posições.", 400);
  const ids = new Set<number>();
  const positions = raw.positions.map((entry) => {
    if (!entry || typeof entry !== "object") throw new OrbeError("INVALID_TAROT_CONTEXT", "Posição inválida.", 400);
    const item = entry as Json;
    const cardId = Number(item.cardId);
    if (!Number.isInteger(cardId) || cardId < 0 || cardId >= 78 || ids.has(cardId)) {
      throw new OrbeError("INVALID_TAROT_CONTEXT", "As cartas precisam ser canônicas e sem repetição.", 400);
    }
    ids.add(cardId);
    const position = clean(item.position, 100);
    if (!position) throw new OrbeError("INVALID_TAROT_CONTEXT", "Nome de posição ausente.", 400);
    return { position, cardId, cardName: CARD_NAMES[cardId], orientation: "normal" as const };
  });
  return {
    source: "spread",
    spreadId: clean(raw.spreadId, 100),
    spreadName: clean(raw.spreadName, 120) || "Tiragem",
    question: clean(raw.question, 600),
    consentScope: "single-spread",
    positions
  };
}

function databaseError(error: unknown): never {
  const message = clean((error as { message?: unknown })?.message, 500).toLowerCase();
  const rules: Array<[string, string, string, number]> = [
    ["orbe_ai_disabled", "ORBE_AI_DISABLED", "A Orbe IA está pausada pelo controle de segurança.", 503],
    ["extra_confirmation_required", "EXTRA_CONFIRMATION_REQUIRED", "Confirme o uso de créditos extras para esta mensagem.", 409],
    ["insufficient_credits", "INSUFFICIENT_CREDITS", "Seu saldo não permite este modo. Nenhuma cobrança foi feita.", 402],
    ["rate_limit_per_minute", "RATE_LIMIT_PER_MINUTE", "Aguarde um minuto antes de enviar novamente.", 429],
    ["daily_credit_limit", "DAILY_CREDIT_LIMIT", "O limite diário de proteção foi alcançado.", 429],
    ["global_request_limit", "GLOBAL_REQUEST_LIMIT", "A Orbe atingiu o limite seguro do ambiente hoje.", 503],
    ["global_credit_limit", "GLOBAL_CREDIT_LIMIT", "A Orbe atingiu o limite seguro do ambiente hoje.", 503],
    ["global_cost_limit", "GLOBAL_COST_LIMIT", "O teto de custo do STAGING foi alcançado.", 503],
    ["sol_disabled", "SOL_DISABLED", "O modo Sol permanece desligado.", 409],
    ["request_id_conflict", "REQUEST_ID_CONFLICT", "Esta solicitação não corresponde ao seu conteúdo original.", 409]
  ];
  for (const [needle, code, publicMessage, status] of rules) {
    if (message.includes(needle)) throw new OrbeError(code, publicMessage, status);
  }
  throw new OrbeError("LEDGER_UNAVAILABLE", "O ledger seguro não respondeu. Nenhum débito foi concluído.", 503);
}

function systemPrompt(mode: string, focus: string, source: string, tarot: TarotContext | null): string {
  const base = [
    "Você é Whit, a Orbe IA da Divina Bruxa.",
    "Sua natureza é explícita: você é um sistema de IA que gera linguagem, não uma pessoa, consciência, médium ou autoridade sobrenatural.",
    "Responda em português do Brasil com calor, clareza e autonomia. Não alegue telepatia, leitura de mentes, contato espiritual comprovado, destino inevitável, certeza sobre o futuro ou acesso a sentimentos privados de terceiros.",
    "Tarot é linguagem simbólica para reflexão. Todas as cartas estão na orientação direta/normal. Não invente cartas, posições, fatos biográficos ou fontes.",
    "Não ofereça diagnóstico nem substitua apoio médico, psicológico, jurídico ou financeiro. Em temas sensíveis, reconheça limites, incentive apoio humano qualificado e priorize segurança imediata quando houver risco.",
    "Use somente o texto e o contexto explicitamente fornecidos nesta requisição. Você não possui acesso ao Diário, à conta, a mensagens externas, à web ou a outras conversas.",
    `Origem consentida desta requisição: ${source}.`
  ];
  if (mode === "luna") base.push("Modo Luna: acolhimento objetivo. Seja concisa, reflita o que foi dito, diferencie fato de interpretação e encerre com uma pergunta ou pequena ação observável.");
  if (mode === "terra") base.push("Modo Terra: análise estruturada e profunda. Organize em símbolos observados, tensões e possibilidades, integração prática e uma pergunta final; profundidade não significa certeza.");
  if (focus === "symbolic-persona") base.push("A dramatização simbólica é ficcional. Nunca imite uma pessoa real como se ela estivesse presente nem atribua a ela pensamentos, intenções ou falas verdadeiras.");
  if (focus === "school") base.push("Atue como tutora: use somente a aula fornecida, explique sem determinismo e termine com uma pergunta de recuperação da memória.");
  if (tarot) {
    const cards = tarot.positions.map((item) => `${item.position}: ${item.cardName} (direta)`).join("; ");
    base.push(`Tiragem canônica autorizada: ${tarot.spreadName}. ${tarot.question ? `Pergunta: ${tarot.question}. ` : ""}Cartas: ${cards}.`);
  }
  return base.join(" ");
}

function extractText(payload: Json): string {
  if (typeof payload.output_text === "string") return payload.output_text.trim();
  const output = Array.isArray(payload.output) ? payload.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as Json).content) ? (item as Json).content as unknown[] : [];
    for (const part of content) {
      if (part && typeof part === "object" && (part as Json).type === "output_text" && typeof (part as Json).text === "string") {
        return String((part as Json).text).trim();
      }
    }
  }
  return "";
}

function usageOf(payload: Json) {
  const usage = payload.usage && typeof payload.usage === "object" ? payload.usage as Json : {};
  const details = usage.input_tokens_details && typeof usage.input_tokens_details === "object" ? usage.input_tokens_details as Json : {};
  const input = Math.max(0, Math.floor(Number(usage.input_tokens) || 0));
  const cached = Math.min(input, Math.max(0, Math.floor(Number(details.cached_tokens) || 0)));
  const output = Math.max(0, Math.floor(Number(usage.output_tokens) || 0));
  return { input, cached, output };
}

function estimatedCost(mode: string, usage: { input: number; cached: number; output: number }): number {
  const rate = mode === "terra" ? { input: 2, cached: 0.2, output: 12 } : { input: 0.2, cached: 0.02, output: 1.2 };
  const uncached = Math.max(0, usage.input - usage.cached);
  return Number((((uncached * rate.input) + (usage.cached * rate.cached) + (usage.output * rate.output)) / 1_000_000).toFixed(6));
}

async function moderate(openaiKey: string, input: string, signal: AbortSignal): Promise<"ok" | "self-harm" | "blocked"> {
  const response = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ model: "omni-moderation-latest", input })
  });
  const payload = await response.json().catch(() => ({})) as Json;
  if (!response.ok) throw new OrbeError("SAFETY_CHECK_UNAVAILABLE", "A verificação de segurança está indisponível. Nenhum crédito foi consumido.", 503);
  const first = Array.isArray(payload.results) ? payload.results[0] as Json | undefined : undefined;
  if (!first?.flagged) return "ok";
  const categories = first.categories && typeof first.categories === "object" ? first.categories as Json : {};
  if (categories["self-harm"] || categories["self-harm/intent"] || categories["self-harm/instructions"]) return "self-harm";
  return "blocked";
}

function safetyAnswer(kind: "self-harm" | "blocked"): string {
  if (kind === "self-harm") {
    return "Sinto muito que isso esteja tão pesado. A Orbe é uma IA e não consegue oferecer ajuda de emergência. Se houver risco imediato, afaste-se de meios de se ferir e procure agora o serviço de emergência da sua região ou uma pessoa de confiança que possa ficar com você. Se puder, contate também um serviço humano de apoio emocional ou profissional de saúde. Você não precisa atravessar este momento sozinha.";
  }
  return "Não posso ajudar a produzir esse conteúdo. Posso, porém, apoiar uma reflexão segura, prevenção de dano ou uma alternativa que preserve você e outras pessoas.";
}

Deno.serve(async (req: Request) => {
  let origin: string | null = null;
  let requestId: string | undefined;
  let admin: SupabaseClient | null = null;
  let accountId: string | null = null;
  let reserved = false;
  try {
    origin = requestOrigin(req);
    if (req.method === "OPTIONS") return options(origin);
    if (req.method !== "GET" && req.method !== "POST") throw new OrbeError("METHOD_NOT_ALLOWED", "Método não permitido.", 405);

    const context = await authenticated(req);
    admin = context.admin;
    accountId = context.account.id;
    const openaiKey = env("OPENAI_API_KEY");

    if (req.method === "GET") {
      const { data: snapshot, error } = await admin.rpc("ai_account_status_v190", { target_user: accountId });
      if (error || !snapshot) databaseError(error);
      return json(origin, {
        ok: true,
        ...snapshot,
        provider: {
          configured: Boolean(openaiKey),
          responsesApi: true,
          applicationStateStored: false,
          webSearch: false,
          models: { luna: "gpt-5.6-luna", terra: "gpt-5.6-terra", sol: null }
        },
        privacy: { serverConversationHistory: false, contentInLedger: false, diaryScope: "single-entry-explicit" }
      });
    }

    const body = await readBody(req);
    requestId = clean(body.requestId, 80);
    if (!UUID.test(requestId)) throw new OrbeError("INVALID_REQUEST_ID", "Gere uma nova solicitação e tente novamente.", 400);
    if (body.schemaVersion !== SCHEMA_VERSION) throw new OrbeError("UNSUPPORTED_SCHEMA", "Atualize o aplicativo antes de conversar.", 409);
    if (body.consent !== true) throw new OrbeError("CONSENT_REQUIRED", "Autorize explicitamente o envio desta mensagem.", 400);
    if (!openaiKey) throw new OrbeError("AI_PROVIDER_NOT_CONFIGURED", "O provedor de IA ainda não foi configurado no servidor.", 503);

    const mode = clean(body.mode, 20);
    if (mode === "sol") throw new OrbeError("SOL_DISABLED", "O modo Sol permanece desligado.", 409);
    if (!MODES.has(mode)) throw new OrbeError("INVALID_MODE", "Escolha Luna ou Terra.", 400);
    const focus = clean(body.focus, 40) || "reflection";
    const source = clean(body.source, 40) || "message";
    if (!FOCUSES.has(focus) || !SOURCES.has(source)) throw new OrbeError("INVALID_CONTEXT_SCOPE", "O contexto informado não é permitido.", 400);
    if (source === "journal-single-entry" && body.journalConsentScope !== "single-entry") {
      throw new OrbeError("JOURNAL_CONSENT_REQUIRED", "Escolha e autorize uma única entrada do Diário.", 400);
    }
    if (body.capabilities && typeof body.capabilities === "object" && (body.capabilities as Json).webSearch !== false) {
      throw new OrbeError("WEB_SEARCH_DISABLED", "A busca na web permanece desligada.", 409);
    }

    const { data: flags, error: flagsError } = await admin.from("ai_feature_flags").select("*").eq("id", true).maybeSingle();
    if (flagsError || !flags) throw new OrbeError("AI_FLAGS_UNAVAILABLE", "Os controles da Orbe não responderam.", 503);
    if (flags.orbe_ai_enabled !== true) throw new OrbeError("ORBE_AI_DISABLED", "A Orbe IA está pausada pelo controle de segurança.", 503);
    if (flags.sol_enabled === true) throw new OrbeError("INVALID_SOL_CONFIGURATION", "O modo Sol permanece desligado.", 503);

    const message = clean(body.message, Number(flags.max_input_characters));
    if (!message) throw new OrbeError("MESSAGE_REQUIRED", "Escreva uma mensagem antes de enviar.", 400);
    if (String(body.message ?? "").trim().length > Number(flags.max_input_characters)) {
      throw new OrbeError("MESSAGE_TOO_LONG", "A mensagem ultrapassa o limite de caracteres.", 413);
    }
    const history = parseHistory(body.history, Number(flags.max_history_messages), Number(flags.max_context_characters));
    const tarot = parseTarot(body.tarotContext);
    if (source === "tarot-single-spread" && !tarot) throw new OrbeError("TAROT_CONTEXT_REQUIRED", "A tiragem selecionada não acompanhou a mensagem.", 400);
    if (tarot && source !== "tarot-single-spread") throw new OrbeError("INVALID_TAROT_SCOPE", "A tiragem precisa de consentimento próprio.", 400);

    const canonical = JSON.stringify({ schemaVersion: SCHEMA_VERSION, mode, focus, source, message, history, tarot });
    const requestHash = await sha256(canonical);
    if (!HASH.test(requestHash)) throw new OrbeError("FINGERPRINT_FAILED", "Não foi possível proteger esta solicitação.", 500);

    const { data: gate, error: gateError } = await admin.rpc("gate_ai_request_v190", {
      target_user: accountId,
      request_uuid: requestId,
      request_hash: requestHash
    });
    if (gateError || gate?.status !== "accepted") databaseError(gateError);

    const timeout = new AbortController();
    const stop = () => timeout.abort();
    req.signal.addEventListener("abort", stop, { once: true });
    const timer = setTimeout(stop, 45000);
    try {
      const moderationInput = [...history.map((item) => `${item.role}: ${item.content}`), `user: ${message}`].join("\n");
      const safety = await moderate(openaiKey, moderationInput, timeout.signal);
      if (safety !== "ok") {
        return json(origin, {
          ok: true,
          release: RELEASE,
          requestId,
          answer: safetyAnswer(safety),
          safetyIntercepted: true,
          chargedCredits: 0,
          balanceUnchanged: true,
          provider: { model: "omni-moderation-latest", applicationStateStored: false }
        });
      }

      const { data: reservation, error: reserveError } = await admin.rpc("reserve_ai_credits_v190", {
        target_user: accountId,
        requested_mode: mode,
        request_uuid: requestId,
        request_hash: requestHash,
        requested_focus: focus,
        requested_source: source,
        confirm_extra: body.confirmExtra === true
      });
      if (reserveError || !reservation) databaseError(reserveError);
      if (reservation.idempotent === true) {
        const state = clean(reservation.status, 30);
        const labels: Record<string, [string, string]> = {
          reserved: ["REQUEST_IN_PROGRESS", "Esta solicitação já está em processamento."],
          completed: ["REQUEST_ALREADY_COMPLETED", "Esta solicitação já foi concluída sem débito duplicado."],
          refunded: ["REQUEST_ALREADY_REFUNDED", "Esta solicitação já foi devolvida sem débito duplicado."]
        };
        const [code, text] = labels[state] ?? ["REQUEST_ALREADY_HANDLED", "Esta solicitação já foi tratada."];
        throw new OrbeError(code, text, 409);
      }
      reserved = true;

      const model = clean(reservation.modelId, 80);
      const instructions = systemPrompt(mode, focus, source, tarot);
      const providerInput = [...history, { role: "user" as const, content: message }];
      const started = Date.now();
      const providerResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        signal: timeout.signal,
        body: JSON.stringify({
          model,
          reasoning: { effort: mode === "terra" ? "medium" : "low" },
          instructions,
          input: providerInput,
          max_output_tokens: mode === "terra" ? Number(flags.terra_max_output_tokens) : Number(flags.luna_max_output_tokens),
          store: false
        })
      });
      const providerPayload = await providerResponse.json().catch(() => ({})) as Json;
      if (!providerResponse.ok) throw new OrbeError("AI_PROVIDER_FAILED", "O provedor não concluiu a resposta. Os créditos serão devolvidos.", 502);
      const answer = extractText(providerPayload).slice(0, 12000);
      if (!answer) throw new OrbeError("AI_EMPTY_RESPONSE", "A resposta veio vazia. Os créditos serão devolvidos.", 502);
      const usage = usageOf(providerPayload);
      const cost = estimatedCost(mode, usage);
      const providerId = clean(providerPayload.id, 160);
      if (!providerId) throw new OrbeError("AI_PROVIDER_ID_MISSING", "A resposta não pôde ser auditada. Os créditos serão devolvidos.", 502);

      const { data: settlement, error: settleError } = await admin.rpc("settle_ai_usage_v190", {
        target_user: accountId,
        request_uuid: requestId,
        provider_model: model,
        provider_id: providerId,
        input_count: usage.input,
        cached_count: usage.cached,
        output_count: usage.output,
        cost_usd: cost,
        elapsed_ms: Date.now() - started
      });
      if (settleError || settlement?.status !== "completed") databaseError(settleError);
      reserved = false;

      const { data: snapshot } = await admin.rpc("ai_account_status_v190", { target_user: accountId });
      return json(origin, {
        ok: true,
        release: RELEASE,
        requestId,
        answer,
        mode,
        focus,
        chargedCredits: Number(settlement.credits),
        balance: Number(settlement.balance),
        wallet: snapshot?.wallet ?? null,
        usage: { inputTokens: usage.input, cachedInputTokens: usage.cached, outputTokens: usage.output },
        governance: { webSearch: false, serverConversationHistory: false, applicationStateStored: false, solEnabled: false }
      });
    } finally {
      clearTimeout(timer);
      req.signal.removeEventListener("abort", stop);
    }
  } catch (error) {
    if (reserved && admin && accountId && requestId) {
      await admin.rpc("refund_ai_credits_v190", { target_user: accountId, request_uuid: requestId });
      reserved = false;
    }
    const code = error instanceof OrbeError ? error.code : "ORBE_AI_REQUEST_FAILED";
    console.error(`[orbe-ai-${RELEASE.toLowerCase()}]`, code, requestId ?? "no-request-id");
    return errorResponse(origin, error, requestId);
  }
});
