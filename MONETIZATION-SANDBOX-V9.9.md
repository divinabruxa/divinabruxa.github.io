# Divina Bruxa — Macroetapa 10 / Monetização sandbox

## Catálogo protegido

- Premium pagamento único: R$ 199,90, sem IA.
- Orbe IA: assinatura mensal de R$ 89,90 com 400 créditos.
- Pacotes extras: 200 por R$ 39,90; 600 por R$ 99,90; 1.500 por R$ 199,90.
- Luna consome 1 crédito; Terra consome 10; Sol permanece desligado.

O contrato não contém chaves e não cria cobrança no cliente. Quando o backend
for conectado, pagamentos únicos e assinaturas devem usar Checkout Sessions;
renovações devem usar Billing/Customer Portal; métodos de pagamento devem ser
dinâmicos, sem hardcode de `payment_method_types`. O ledger de créditos deve
ser imutável, idempotente e processado no servidor. Para créditos pré-pagos e
uso de IA, avaliar Metronome conforme a arquitetura de billing da Stripe.

Antes de impostos automáticos, a situação fiscal e registros ativos precisam
ser confirmados; esta etapa não ativa `automatic_tax`.
