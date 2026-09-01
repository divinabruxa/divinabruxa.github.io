# Divina Bruxa — Billing Sandbox V6

Este contrato é exclusivo para testes. Nenhuma operação abaixo deve capturar cartão ou gerar cobrança real.

## Operações

- `POST /subscriptions/checkout`: cria uma intenção idempotente no ambiente sandbox.
- `POST /subscriptions/restore`: reconsulta concessões da conta sem duplicá-las.
- `POST /subscriptions/revoke`: revoga uma concessão de teste e registra o motivo.
- `POST /subscriptions/refund`: simula reembolso e remove a concessão correspondente.

## Garantias

1. Cada operação recebe `idempotencyKey` único.
2. Webhooks repetidos não criam novas concessões.
3. Estado final é derivado do ledger, não do navegador.
4. Revogação e reembolso são auditáveis, sem dados de cartão.
5. Stripe, App Store e Google Play permanecem desligados até aprovação explícita.

## Bloqueios

`real_billing_authorized=false`  
`store_submission_authorized=false`
