-- DIVINA BRUXA V190 — LIMPEZA DE ÍNDICES DUPLICADOS
-- Conserva ai_usage_user_created_idx e ai_ledger_user_created_idx já existentes.

begin;

drop index if exists public.ai_usage_user_created_v190_idx;
drop index if exists public.ai_ledger_user_created_v190_idx;

commit;
