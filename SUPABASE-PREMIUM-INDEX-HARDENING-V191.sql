-- Divina Bruxa V191 — covering indexes for product-catalog foreign keys.
-- Corrective migration for staging databases that already ran the primary V191
-- migration. Safe and idempotent.

create index if not exists billing_receipts_v191_product_key_idx
  on public.billing_receipts_v191(product_key);

create index if not exists billing_subscriptions_v191_product_key_idx
  on public.billing_subscriptions_v191(product_key);
