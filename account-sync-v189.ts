/* DIVINA BRUXA — CONTA E SINCRONIZAÇÃO V189 · SUPABASE STAGING */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.112.4";

const RELEASE = "V189";
const ENVIRONMENT = "staging";
const MAX_BODY_BYTES = 2_500_000;
const MAX_JOURNAL_ENTRIES = 2_000;
const MAX_SCHOOL_LESSONS = 124;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CLIENT_ID = /^[A-Za-z0-9._:-]{1,160}$/;
const LESSON_ID = /^[a-z0-9-]{1,120}$/;
const SCHOOL_MODULES = new Set([
  "fundamentals", "majors", "wands", "cups", "swords", "pentacles", "court",
  "numbers", "elements", "positions", "combinations", "synthesis", "practice-spreads",
  "celtic-cross", "royal-table", "ethics", "advanced"
]);
const JOURNAL_TYPES: Record<string, string> = Object.freeze({
  note: "free_reflection",
  daily: "daily_card",
  spread: "spread",
  lesson: "quick_note"
});
const DEFAULT_ORIGINS = [
  "https://divinabruxa.com.br",
  "https://www.divinabruxa.com.br",
  "https://divinabruxa.github.io",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
];

class SyncError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "SyncError";
    this.code = code;
    this.status = status;
  }
}

const env = (name: string) => Deno.env.get(name)?.trim() || "";
const clean = (value: unknown, limit: number) => String(value ?? "").replaceAll("\0", "").trim().slice(0, limit);
const unique = (value: unknown, limit: number, validator: (item: string) => boolean) => [
  ...new Set((Array.isArray(value) ? value : []).map(String).map(item => clean(item, 160)).filter(validator))
].slice(0, limit);
const integer = (value: unknown, minimum: number, maximum: number, fallback = 0) => {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) ? Math.max(minimum, Math.min(maximum, parsed)) : fallback;
};
const iso = (value: unknown, fallback: string | null = null) => {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return fallback;
  const minimum = Date.UTC(2000, 0, 1);
  const maximum = Date.now() + 5 * 60 * 1000;
  if (date.getTime() < minimum || date.getTime() > maximum) return fallback;
  return date.toISOString();
};
const dateOnly = (value: unknown, fallback: string) => {
  const parsed = iso(value);
  return parsed ? parsed.slice(0, 10) : fallback;
};
const byteLength = (value: unknown) => new TextEncoder().encode(JSON.stringify(value)).byteLength;

function configuredOrigins() {
  const raw = env("STAGING_ALLOWED_ORIGINS");
  if (!raw) return new Set(DEFAULT_ORIGINS);
  try {
    const parsed = raw.startsWith("[") ? JSON.parse(raw) : raw.split(",");
    return new Set([...DEFAULT_ORIGINS, ...(Array.isArray(parsed) ? parsed : [])].map(item => String(item).trim()).filter(Boolean));
  } catch {
    return new Set(DEFAULT_ORIGINS);
  }
}

function requestOrigin(req: Request) {
  const origin = req.headers.get("Origin");
  if (!origin) return null;
  if (!configuredOrigins().has(origin)) throw new SyncError("ORIGIN_NOT_ALLOWED", "Origem não autorizada no STAGING.", 403);
  return origin;
}

function headers(origin: string | null, extra: Record<string, string> = {}) {
  const result = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Vary": "Origin",
    ...extra
  });
  if (origin) result.set("Access-Control-Allow-Origin", origin);
  return result;
}

const reply = (origin: string | null, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: headers(origin)
});

const options = (origin: string | null) => new Response(null, {
  status: 204,
  headers: headers(origin, {
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "600"
  })
});

function userClient(req: Request) {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_ANON_KEY");
  if (!url || !key) throw new SyncError("STAGING_CONFIGURATION_MISSING", "Configuração segura indisponível.", 503);
  return createClient(url, key, {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

function adminClient() {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new SyncError("STAGING_CONFIGURATION_MISSING", "Configuração segura indisponível.", 503);
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

function bearer(req: Request) {
  const match = (req.headers.get("Authorization") || "").match(/^Bearer\s+(.+)$/i);
  if (!match?.[1]) throw new SyncError("AUTHENTICATION_REQUIRED", "Entre novamente para sincronizar.", 401);
  return match[1];
}

async function readBody(req: Request) {
  const advertised = Number(req.headers.get("Content-Length") || 0);
  if (advertised > MAX_BODY_BYTES) throw new SyncError("SYNC_TOO_LARGE", "A sincronização excede o limite seguro desta etapa.", 413);
  const raw = await req.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) throw new SyncError("SYNC_TOO_LARGE", "A sincronização excede o limite seguro desta etapa.", 413);
  try {
    const parsed = JSON.parse(raw || "{}");
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("invalid");
    return parsed as Record<string, unknown>;
  } catch {
    throw new SyncError("INVALID_JSON", "Solicitação de sincronização inválida.", 400);
  }
}

async function authenticate(req: Request) {
  const token = bearer(req);
  const userDb = userClient(req);
  const admin = adminClient();
  const [{ data: userData, error: userError }, { data: claimsData, error: claimsError }] = await Promise.all([
    userDb.auth.getUser(token),
    userDb.auth.getClaims(token)
  ]);
  const user = userData?.user;
  const claims = claimsData?.claims as Record<string, unknown> | undefined;
  if (userError || claimsError || !user || claims?.sub !== user.id || claims?.role !== "authenticated") {
    throw new SyncError("AUTHENTICATION_REQUIRED", "Entre novamente para sincronizar.", 401);
  }
  if (!user.email_confirmed_at && !user.confirmed_at) {
    throw new SyncError("EMAIL_VERIFICATION_REQUIRED", "Confirme seu e-mail antes de sincronizar.", 403);
  }
  const sessionId = String(claims?.session_id || "");
  if (!UUID.test(sessionId)) throw new SyncError("ACTIVE_SESSION_REQUIRED", "Sua sessão precisa ser renovada.", 401);
  const { data: active, error: activeError } = await admin.rpc("verify_active_account_session", {
    p_user_id: user.id,
    p_session_id: sessionId
  });
  if (activeError || active !== true) throw new SyncError("ACTIVE_SESSION_REQUIRED", "Sua sessão não está mais ativa.", 401);
  return { token, user, userDb, admin };
}

function normalizeSchool(value: unknown) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const lessonIds = (items: unknown) => unique(items, MAX_SCHOOL_LESSONS, item => LESSON_ID.test(item));
  const notes = input.notes && typeof input.notes === "object" && !Array.isArray(input.notes)
    ? Object.fromEntries(Object.entries(input.notes as Record<string, unknown>)
        .filter(([id]) => LESSON_ID.test(id))
        .map(([id, note]) => [id, clean(note, 1200)])
        .filter(([, note]) => Boolean(note))
        .slice(0, MAX_SCHOOL_LESSONS))
    : {};
  const quiz = input.quiz && typeof input.quiz === "object" && !Array.isArray(input.quiz)
    ? Object.fromEntries(Object.entries(input.quiz as Record<string, unknown>)
        .filter(([id, result]) => LESSON_ID.test(id) && result && typeof result === "object" && !Array.isArray(result))
        .map(([id, result]) => {
          const item = result as Record<string, unknown>;
          return [id, {
            attempts: integer(item.attempts, 0, 999),
            correct: Boolean(item.correct),
            lastAnswer: clean(item.lastAnswer, 24) || null,
            updatedAt: iso(item.updatedAt)
          }];
        })
        .slice(0, 78))
    : {};
  const lastModule = clean(input.lastModule, 40);
  const lastLesson = clean(input.lastLesson, 120);
  return {
    completed: lessonIds(input.completed),
    favorites: lessonIds(input.favorites),
    review: lessonIds(input.review),
    notes,
    quiz,
    lastModule: SCHOOL_MODULES.has(lastModule) ? lastModule : "fundamentals",
    lastLesson: LESSON_ID.test(lastLesson) ? lastLesson : null,
    lastStudiedAt: iso(input.lastStudiedAt),
    schemaVersion: "6.0.0"
  };
}

function journalPayload(entry: Record<string, unknown>) {
  const payload = {
    schemaVersion: clean(entry.schemaVersion, 24) || "7.0.0",
    question: clean(entry.question, 600),
    mood: clean(entry.mood, 80),
    collection: clean(entry.collection, 80),
    relationships: clean(entry.relationships, 300),
    reviewDate: /^\d{4}-\d{2}-\d{2}$/.test(String(entry.reviewDate || "")) ? String(entry.reviewDate) : "",
    revisions: (Array.isArray(entry.revisions) ? entry.revisions : []).slice(-30).map(value => {
      const revision = value && typeof value === "object" ? value as Record<string, unknown> : {};
      return { id: clean(revision.id, 160), text: clean(revision.text, 3000), createdAt: iso(revision.createdAt) };
    }).filter(item => item.text),
    linkedEntryIds: unique(entry.linkedEntryIds, 12, item => CLIENT_ID.test(item)),
    type: Object.hasOwn(JOURNAL_TYPES, String(entry.type)) ? String(entry.type) : "note",
    cardId: Number.isInteger(Number(entry.cardId)) && Number(entry.cardId) >= 0 && Number(entry.cardId) <= 77 ? Number(entry.cardId) : null,
    orientation: "normal",
    private: true
  };
  if (byteLength(payload) > 196_000) throw new SyncError("JOURNAL_ENTRY_TOO_LARGE", "Uma memória excede o limite seguro de sincronização.", 413);
  return payload;
}

async function stableUuid(userId: string, clientId: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${userId}:${clientId}:v189`)));
  const bytes = digest.slice(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function normalizeJournalEntry(userId: string, value: unknown) {
  const entry = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const clientId = clean(entry.id, 160);
  if (!CLIENT_ID.test(clientId)) throw new SyncError("INVALID_JOURNAL_ENTRY", "Uma memória não possui identificação válida.", 400);
  const createdAt = iso(entry.createdAt, new Date().toISOString()) as string;
  const updatedAt = iso(entry.updatedAt, createdAt) as string;
  const cardIds = [...new Set([
    ...(Array.isArray(entry.cardIds) ? entry.cardIds : []),
    entry.cardId
  ].map(Number).filter(value => Number.isInteger(value) && value >= 0 && value <= 77))].slice(0, 78);
  return {
    id: await stableUuid(userId, clientId),
    user_id: userId,
    client_entry_id: clientId,
    entry_type: JOURNAL_TYPES[String(entry.type)] || "free_reflection",
    title: clean(entry.title, 120),
    body: clean(entry.text, 16000),
    entry_date: dateOnly(createdAt, createdAt.slice(0, 10)),
    mood: null,
    tags: unique(String(entry.tags || "").split(","), 12, item => Boolean(item)).map(item => item.slice(0, 36)),
    is_favorite: Boolean(entry.favorite),
    related_card_ids: cardIds,
    related_lesson_id: clean(entry.relatedLesson, 180) || null,
    created_at: createdAt,
    updated_at: updatedAt,
    deleted_at: null,
    client_payload: journalPayload(entry)
  };
}

function toClientJournal(row: Record<string, unknown>) {
  const payload = row.client_payload && typeof row.client_payload === "object" && !Array.isArray(row.client_payload)
    ? row.client_payload as Record<string, unknown>
    : {};
  const cardIds = Array.isArray(row.related_card_ids) ? row.related_card_ids.map(Number).filter(Number.isInteger) : [];
  return {
    ...payload,
    id: String(row.client_entry_id || row.id),
    title: String(row.title || "Memória da Orbe"),
    text: String(row.body || ""),
    tags: Array.isArray(row.tags) ? row.tags.join(", ") : "",
    favorite: Boolean(row.is_favorite),
    relatedLesson: String(row.related_lesson_id || ""),
    cardIds,
    cardId: Number.isInteger(Number(payload.cardId)) ? Number(payload.cardId) : (cardIds[0] ?? null),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    status: "saved",
    orientation: "normal",
    private: true,
    syncState: "synced"
  };
}

async function reconcileSchoolTables(client: SupabaseClient, userId: string, school: ReturnType<typeof normalizeSchool>) {
  const started = new Set<string>([
    ...school.completed,
    ...school.review,
    ...Object.keys(school.notes),
    ...Object.keys(school.quiz),
    ...(school.lastLesson ? [school.lastLesson] : [])
  ]);
  const completed = new Set(school.completed);
  const desiredProgress = [...started].map(lessonId => ({
    user_id: userId,
    lesson_id: lessonId,
    status: completed.has(lessonId) ? "completed" : "started",
    progress_percent: completed.has(lessonId) ? 100 : 1,
    completed_at: completed.has(lessonId) ? school.lastStudiedAt || new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  }));
  const [{ data: currentProgress, error: progressReadError }, { data: currentFavorites, error: favoritesReadError }] = await Promise.all([
    client.from("school_progress").select("lesson_id").eq("user_id", userId),
    client.from("school_favorites").select("lesson_id").eq("user_id", userId)
  ]);
  if (progressReadError || favoritesReadError) throw new SyncError("SCHOOL_SYNC_FAILED", "Não foi possível sincronizar a Escola.", 500);
  const removeProgress = (currentProgress || []).map(row => String(row.lesson_id)).filter(id => !started.has(id));
  const favoriteSet = new Set(school.favorites);
  const removeFavorites = (currentFavorites || []).map(row => String(row.lesson_id)).filter(id => !favoriteSet.has(id));
  const tasks: PromiseLike<unknown>[] = [];
  if (desiredProgress.length) tasks.push(client.from("school_progress").upsert(desiredProgress, { onConflict: "user_id,lesson_id" }));
  if (removeProgress.length) tasks.push(client.from("school_progress").delete().eq("user_id", userId).in("lesson_id", removeProgress));
  if (school.favorites.length) tasks.push(client.from("school_favorites").upsert(school.favorites.map(lessonId => ({ user_id: userId, lesson_id: lessonId })), { onConflict: "user_id,lesson_id" }));
  if (removeFavorites.length) tasks.push(client.from("school_favorites").delete().eq("user_id", userId).in("lesson_id", removeFavorites));
  const results = await Promise.all(tasks);
  if (results.some(result => (result as { error?: unknown })?.error)) throw new SyncError("SCHOOL_SYNC_FAILED", "Não foi possível sincronizar a Escola.", 500);
}

async function syncSchool(client: SupabaseClient, userId: string, incoming: unknown, clientChangedAt: unknown) {
  const { data: current, error: readError } = await client
    .from("school_sync_state")
    .select("state,client_updated_at,revision,updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (readError) throw new SyncError("SCHOOL_SYNC_FAILED", "Não foi possível ler a Escola sincronizada.", 500);
  const normalized = normalizeSchool(incoming);
  const incomingAt = iso(clientChangedAt) || normalized.lastStudiedAt;
  const remoteAt = iso(current?.client_updated_at) || iso(current?.updated_at);
  const clientWins = !current || Boolean(incomingAt && (!remoteAt || new Date(incomingAt) > new Date(remoteAt)));
  if (clientWins) {
    const { error: writeError } = await client.from("school_sync_state").upsert({
      user_id: userId,
      state: normalized,
      client_updated_at: incomingAt,
      revision: Number(current?.revision || 0) + 1,
      environment: ENVIRONMENT,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (writeError) throw new SyncError("SCHOOL_SYNC_FAILED", "Não foi possível guardar o progresso da Escola.", 500);
    await reconcileSchoolTables(client, userId, normalized);
    return { state:normalized, authority:"client" };
  }
  return { state:normalizeSchool(current?.state), authority:"server" };
}

async function syncJournal(client: SupabaseClient, userId: string, incoming: unknown, deletions: unknown) {
  const local = Array.isArray(incoming) ? incoming : [];
  if (local.length > MAX_JOURNAL_ENTRIES) throw new SyncError("TOO_MANY_JOURNAL_ENTRIES", "O Diário excede o limite desta sincronização.", 413);
  const normalized = await Promise.all(local.map(entry => normalizeJournalEntry(userId, entry)));
  const { data: before, error: beforeError } = await client
    .from("journal_entries")
    .select("client_entry_id,updated_at,deleted_at")
    .eq("user_id", userId)
    .limit(MAX_JOURNAL_ENTRIES);
  if (beforeError) throw new SyncError("JOURNAL_SYNC_FAILED", "Não foi possível ler o Diário sincronizado.", 500);
  const remote = new Map((before || []).map(row => [String(row.client_entry_id), row]));
  const upserts = normalized.filter(row => {
    const known = remote.get(row.client_entry_id);
    return !known || new Date(row.updated_at) > new Date(String(known.updated_at));
  });
  for (let offset = 0; offset < upserts.length; offset += 100) {
    const { error } = await client.from("journal_entries").upsert(upserts.slice(offset, offset + 100), { onConflict: "user_id,client_entry_id" });
    if (error) throw new SyncError("JOURNAL_SYNC_FAILED", "Não foi possível guardar todas as memórias.", 500);
  }
  const deletedIds = unique(
    (Array.isArray(deletions) ? deletions : []).map(item => item && typeof item === "object" ? (item as Record<string, unknown>).id : item),
    MAX_JOURNAL_ENTRIES,
    item => CLIENT_ID.test(item)
  );
  const deletedAt = new Date().toISOString();
  for (let offset = 0; offset < deletedIds.length; offset += 100) {
    const { error } = await client.from("journal_entries")
      .update({ deleted_at: deletedAt, updated_at: deletedAt })
      .eq("user_id", userId)
      .in("client_entry_id", deletedIds.slice(offset, offset + 100));
    if (error) throw new SyncError("JOURNAL_DELETE_FAILED", "Não foi possível propagar uma exclusão do Diário.", 500);
  }
  const { data: active, error: activeError } = await client
    .from("journal_entries")
    .select("id,client_entry_id,entry_type,title,body,entry_date,tags,is_favorite,related_card_ids,related_lesson_id,created_at,updated_at,client_payload")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(MAX_JOURNAL_ENTRIES);
  if (activeError) throw new SyncError("JOURNAL_SYNC_FAILED", "Não foi possível concluir a sincronização do Diário.", 500);
  const { data: deleted, error: deletedError } = await client
    .from("journal_entries")
    .select("client_entry_id")
    .eq("user_id", userId)
    .not("deleted_at", "is", null)
    .order("updated_at", { ascending: false })
    .limit(MAX_JOURNAL_ENTRIES);
  if (deletedError) throw new SyncError("JOURNAL_SYNC_FAILED", "Não foi possível concluir as exclusões do Diário.", 500);
  return {
    entries:(active || []).map(row => toClientJournal(row as Record<string, unknown>)),
    deletedIds:(deleted || []).map(row => String(row.client_entry_id)).filter(id => CLIENT_ID.test(id))
  };
}

async function ensureProfile(client: SupabaseClient, user: Record<string, any>) {
  const { data: profile, error } = await client.from("profiles").select("display_name,age_declared_18_plus").eq("user_id", user.id).maybeSingle();
  if (error) throw new SyncError("PROFILE_READ_FAILED", "Não foi possível abrir o perfil.", 500);
  if (profile) return profile;
  const metadata = user.user_metadata || {};
  const displayName = clean(metadata.display_name || metadata.name || String(user.email || "").split("@")[0], 80) || "Minha Orbe";
  const ageDeclared = metadata.age_declared_18_plus === true;
  const { data: created, error: createError } = await client.from("profiles").insert({
    user_id: user.id,
    display_name: displayName,
    age_declared_18_plus: ageDeclared,
    age_declared_at: ageDeclared ? iso(metadata.age_declared_at, new Date().toISOString()) : null,
    locale: "pt-BR",
    timezone: "America/Sao_Paulo"
  }).select("display_name,age_declared_18_plus").single();
  if (createError) throw new SyncError("PROFILE_CREATE_FAILED", "Não foi possível preparar o perfil.", 500);
  return created;
}

async function audit(admin: SupabaseClient, userId: string, requestId: string, action: string, outcome: string, counts: Record<string, number>) {
  await admin.rpc("record_account_sync_audit_v189", {
    p_user_id: userId,
    p_request_id: requestId,
    p_action: action,
    p_outcome: outcome,
    p_counts: counts
  });
}

Deno.serve(async (req: Request) => {
  let origin: string | null = null;
  let context: Awaited<ReturnType<typeof authenticate>> | null = null;
  let requestId = crypto.randomUUID();
  let auditAction = "pull";
  try {
    origin = requestOrigin(req);
    if (req.method === "OPTIONS") return options(origin);
    if (req.method !== "POST") throw new SyncError("METHOD_NOT_ALLOWED", "Método não permitido.", 405);
    const body = await readBody(req);
    requestId = clean(body.requestId, 40);
    if (!UUID.test(requestId)) throw new SyncError("INVALID_REQUEST_ID", "Gere uma nova sincronização.", 400);
    context = await authenticate(req);
    const { user, userDb, admin } = context;
    const { data: withinQuota, error: quotaError } = await admin.rpc("consume_account_sync_quota_v189", {
      p_user_id: user.id,
      p_limit: 30,
      p_window_seconds: 60
    });
    if (quotaError || withinQuota !== true) {
      await audit(admin, user.id, requestId, "pull", "denied", {});
      throw new SyncError("RATE_LIMITED", "Muitas sincronizações em pouco tempo. Aguarde um minuto.", 429);
    }
    const profile = await ensureProfile(userDb, user as unknown as Record<string, any>);
    const consentSupplied = typeof body.journalConsent === "boolean";
    auditAction = consentSupplied ? "consent" : (body.school || body.journal ? "sync" : "pull");
    if (consentSupplied) {
      const { error: settingsError } = await userDb.from("user_settings").upsert({
        user_id: user.id,
        journal_sync_enabled: body.journalConsent,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      const { error: consentError } = await userDb.from("consent_events").insert({
        user_id: user.id,
        consent_key: "journal_cloud_sync",
        granted: body.journalConsent,
        policy_version: "ACCOUNT-SYNC-V189",
        source: "web"
      });
      if (settingsError || consentError) throw new SyncError("CONSENT_SAVE_FAILED", "Não foi possível guardar sua escolha de privacidade.", 500);
    }
    const { data: settings, error: settingsReadError } = await userDb
      .from("user_settings")
      .select("journal_sync_enabled")
      .eq("user_id", user.id)
      .maybeSingle();
    if (settingsReadError) throw new SyncError("SETTINGS_READ_FAILED", "Não foi possível abrir as preferências da conta.", 500);
    const journalEnabled = settings?.journal_sync_enabled === true;
    const school = await syncSchool(userDb, user.id, body.school, body.schoolChangedAt);
    const journal = journalEnabled ? await syncJournal(userDb, user.id, body.journal, body.deletedJournalEntries) : null;
    const [dailyResult, purchasesResult, entitlementsResult] = await Promise.all([
      userDb.from("daily_cards").select("local_date,card_id,timezone,revealed_at").eq("user_id", user.id).order("local_date", { ascending: false }).limit(1).maybeSingle(),
      userDb.from("purchases").select("id,product_key,platform,environment,price_brl_cents_snapshot,status,created_at,updated_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(500),
      userDb.from("entitlements").select("id,entitlement_key,status,starts_at,ends_at,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(500)
    ]);
    if (dailyResult.error || purchasesResult.error || entitlementsResult.error) throw new SyncError("ACCOUNT_SNAPSHOT_FAILED", "Não foi possível concluir o retrato da conta.", 500);
    const counts = {
      journal: journal?.entries.length || 0,
      school: school.state.completed.length,
      favorites: school.state.favorites.length,
      purchases: purchasesResult.data?.length || 0
    };
    await audit(admin, user.id, requestId, auditAction, "succeeded", counts);
    return reply(origin, {
      ok: true,
      release: RELEASE,
      environment: ENVIRONMENT,
      requestId,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: Boolean(user.email_confirmed_at || user.confirmed_at),
        displayName: profile?.display_name || "Minha Orbe"
      },
      settings: { journalSyncEnabled: journalEnabled },
      data: {
        daily: dailyResult.data || null,
        school:school.state,
        schoolAuthority:school.authority,
        journal:journal?.entries || null,
        journalDeletedIds:journal?.deletedIds || [],
        purchases: purchasesResult.data || [],
        entitlements: entitlementsResult.data || []
      },
      counts,
      privacy: {
        diaryRequiresExplicitConsent: true,
        diaryReadByAI: false,
        diaryReadByAdmin: false,
        purchasesClientWritable: false
      }
    });
  } catch (error) {
    const known = error instanceof SyncError;
    if (context) {
      await audit(context.admin, context.user.id, UUID.test(requestId) ? requestId : crypto.randomUUID(), auditAction, "failed", {}).catch(() => undefined);
    }
    return reply(origin, {
      ok: false,
      error: {
        code: known ? error.code : "ACCOUNT_SYNC_FAILED",
        message: known ? error.message : "Não foi possível sincronizar a conta."
      }
    }, known ? error.status : 500);
  }
});
