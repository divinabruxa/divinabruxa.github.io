-- DIVINA BRUXA — ADMIN STAGING V146 HARDENING
-- Aplicar somente em kyphdsamyygavmkzyezr. Não autoriza produção.

begin;

-- O painel possui exatamente uma proprietária ativa.
create unique index if not exists admin_single_active_owner_idx
  on public.admin_owners ((active))
  where active = true;

do $$
begin
  if not exists (
    select 1 from pg_catalog.pg_constraint
    where conname = 'admin_recovery_codes_hash_format'
      and conrelid = 'public.admin_recovery_codes'::regclass
  ) then
    alter table public.admin_recovery_codes
      add constraint admin_recovery_codes_hash_format
      check (code_hash ~ '^[0-9a-f]{64}$');
  end if;
end;
$$;

-- Detecta chaves privadas também quando estiverem aninhadas no JSON.
create or replace function public.reject_private_admin_metadata()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.metadata::text ~* '"(body|content|question|prompt|response|password|secret|token|email|phone|contact|message)"[[:space:]]*:' then
    raise exception 'private_admin_metadata_key';
  end if;
  return new;
end;
$$;

revoke all on function public.reject_private_admin_metadata() from public, anon, authenticated;

-- Um recovery code pode apenas passar de não usado para usado; hash e dono são imutáveis.
create or replace function public.protect_admin_recovery_code()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.user_id is distinct from new.user_id
     or old.code_hash is distinct from new.code_hash
     or old.created_at is distinct from new.created_at
     or new.used_at is null
     or old.used_at is not null then
    raise exception 'immutable_admin_recovery_code';
  end if;
  return new;
end;
$$;

revoke all on function public.protect_admin_recovery_code() from public, anon, authenticated;

drop trigger if exists admin_recovery_code_protection on public.admin_recovery_codes;
create trigger admin_recovery_code_protection
before update on public.admin_recovery_codes
for each row execute function public.protect_admin_recovery_code();

comment on table public.admin_owners is 'Owner única do painel Divina Bruxa STAGING.';
comment on table public.admin_sessions is 'Sessões administrativas revogáveis; nunca contém tokens.';
comment on table public.admin_recovery_codes is 'Hashes de códigos de recuperação de uso único.';
comment on table public.admin_audit_events is 'Auditoria append-only sanitizada, sem conteúdo privado.';
comment on table public.consultation_price_versions is 'Histórico append-only de preços; pedidos preservam snapshot.';
comment on table public.admin_runtime_flags is 'Travas STAGING; flags de produção permanecem false.';

commit;
