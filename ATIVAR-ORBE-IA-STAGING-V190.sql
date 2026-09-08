-- Executar somente no STAGING depois da migração V190 e do deploy da Edge Function V190
-- e da homologação dos controles. Mantém Sol obrigatoriamente desligado.
update public.ai_feature_flags
set orbe_ai_enabled = true,
    sol_enabled = false,
    updated_at = now()
where id = true;
