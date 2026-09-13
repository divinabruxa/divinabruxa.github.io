begin;
drop function if exists public.record_owner_final_review_v548(uuid,text,integer,integer,integer,integer,integer);
drop function if exists public.admin_final_readiness_v548(uuid);
drop table if exists private.owner_final_reviews_v548;
commit;
