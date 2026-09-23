import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const [edge,sql,client,guide]=await Promise.all([
  './memoji-videos-v626-edge.ts','./SUPABASE-SETUP-V626-MEMOJIS.sql',
  './videos-world-v626.js','./ATIVACAO-V626-MEMOJIS.md'
].map(name=>readFile(new URL(name,import.meta.url),'utf8')));
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks+=1;};

ok(edge.includes("import { createClient } from 'npm:@supabase/supabase-js@2.112.4'"),'SDK atual fixado');
ok(edge.includes("new URL(env('SUPABASE_URL')).hostname===`${STAGING_REF}.supabase.co`"),'projeto STAGING fixado');
ok(edge.includes("env('SUPABASE_SERVICE_ROLE_KEY')")&&edge.includes('serviceClient'),'service role somente no servidor');
ok(!client.includes('SUPABASE_SERVICE_ROLE_KEY')&&!client.includes('sb_secret_'),'segredo ausente do cliente');
ok(edge.includes("const COOKIE_ACCESS='db_admin_access'")&&edge.includes("const COOKIE_REFRESH='db_admin_refresh'"),'sessão HttpOnly existente');
ok(edge.includes("from('admin_owners')")&&edge.includes("eq('active',true)"),'proprietária ativa');
ok(edge.includes('user.email_confirmed_at')&&edge.includes("claims.aal!=='aal2'"),'e-mail e MFA AAL2');
ok(edge.includes("from('admin_sessions')")&&edge.includes('revoked_at'),'sessão revogada bloqueada');
ok(edge.includes("from('admin_recovery_codes')")&&edge.includes("is('used_at',null)"),'recuperação obrigatória');
ok(edge.includes("rpc('consume_admin_request_budget_v547'")&&edge.includes("'retry-after'"),'rate limit server-side');
ok(edge.includes("allowedOrigin(request)")&&edge.includes("origin_denied"),'allowlist de origem');
ok(edge.includes("x-divina-admin-request')||'')!=='v626'")&&edge.includes('fetchMetadataAllowed'),'guard e Fetch Metadata');
ok(edge.includes('MAX_BODY_BYTES=48*1024')&&edge.includes('request_body_too_large'),'corpo JSON limitado');

ok(edge.includes("scope==='public'")&&edge.includes("request.method!=='GET'"),'API pública somente GET');
ok(edge.includes('effectivelyPublished')&&edge.includes("row.status==='scheduled'")&&edge.includes('publishAt<=now'),'agendamento efetivo');
ok(edge.includes(".eq('is_visible',true).in('status',['published','scheduled'])"),'consulta pública restrita');
ok(edge.includes('privateContentIncluded:false')&&edge.includes('inventedEpisodes:0'),'resposta pública sem conteúdo privado ou inventado');
ok(edge.includes('videoUrl,posterUrl')&&!edge.includes('serviceRoleKey:'),'resposta pública usa somente URLs assinadas');
ok(edge.includes('SIGNED_READ_SECONDS=60*60')&&edge.includes('expiresAt'),'URLs expiram em uma hora');

ok(edge.includes("createSignedUploadUrl(path,{upsert:false})"),'reserva de upload sem sobrescrita');
ok(edge.includes('storage.supabase.co/storage/v1/upload/resumable'),'endpoint direto de Storage');
ok(edge.includes('CHUNK_BYTES=6*1024*1024'),'bloco TUS de 6 MB');
ok(edge.includes('verifiedPath')&&edge.includes("path.startsWith(prefix)")&&edge.includes("path.includes('..')"),'caminho pertence à proprietária');
ok(edge.includes('storageObject(context.db,path)'),'objeto conferido antes do cadastro');
ok(edge.includes("VIDEO_TYPES=new Map")&&edge.includes("['video/quicktime','mov']"),'MOV do iPhone validado');
ok(edge.includes('MAX_VIDEO_BYTES=512*1024*1024')&&edge.includes('MAX_POSTER_BYTES=12*1024*1024'),'limites explícitos');
ok(edge.includes("action==='reorder'")&&edge.includes('sort_order:index*10'),'ordenação governada');
ok(edge.includes("module_id:'memoji-videos'")&&edge.includes("'memoji-prepare-upload'"),'auditoria sem conteúdo do vídeo');

ok(sql.includes('create table if not exists public.memoji_videos'),'tabela idempotente');
ok(sql.includes('alter table public.memoji_videos enable row level security')&&sql.includes('force row level security'),'RLS obrigatório');
ok(sql.includes('revoke all on table public.memoji_videos from public, anon, authenticated'),'sem grant implícito');
ok(sql.includes('grant select, insert, update, delete on table public.memoji_videos to service_role'),'privilégio mínimo do servidor');
ok(!/grant\s+(?:select|insert|update|delete)[^;]*\s+to\s+(?:anon|authenticated)/i.test(sql),'nenhuma mutação direta do navegador');
ok(sql.includes("public, file_size_limit, allowed_mime_types")&&sql.includes("false,\n  536870912"),'bucket privado e limitado');
ok(sql.includes('video_path text not null unique')&&sql.includes("video_path !~ '(^|/)\\.\\.(/|$)'"),'caminho único sem traversal');
ok(sql.includes("status in ('draft','review','scheduled','published','archived')"),'workflow editorial completo');
ok(sql.includes("status <> 'scheduled' or publish_at is not null"),'agendamento consistente');
ok(sql.includes('created_by uuid not null references auth.users')&&sql.includes('updated_by uuid not null references auth.users'),'autoria persistida');
ok(sql.includes("notify pgrst, 'reload schema'"),'Data API recarregada');

ok(guide.includes('supabase migration new v626_memoji_videos')&&guide.includes('supabase db push'),'migração via CLI documentada');
ok(guide.includes('supabase functions deploy memoji-videos-v626 --no-verify-jwt'),'deploy correto documentado');
ok(guide.includes('A chave de serviço nunca deve entrar nos arquivos do site'),'segredo explicitamente protegido');

console.log(`PASS ${checks}/${checks} — backend protegido dos Memojis V626`);
