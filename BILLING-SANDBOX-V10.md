# Divina Bruxa — Macroetapa 16: Billing sandbox

## Objetivo

Testar compra, assinatura, restauração, reembolso e webhooks sem movimentar dinheiro real. A cobrança só poderá ser ativada depois de staging aprovado, revisão jurídica/contábil e autorização explícita.

## Produtos

- Premium: R$199,90, pagamento único via Checkout Session.
- Orbe IA: R$89,90/mês, assinatura via Billing + Checkout, com 400 créditos.
- Créditos extras: produtos separados e confirmação antes da compra.

## Segurança

- Chaves restritas no backend; nenhuma chave secreta no frontend.
- `StripeClient` no servidor.
- Webhooks com assinatura verificada e processamento idempotente.
- Eventos persistidos antes de conceder entitlement.
- Restore, refunds, revocations e reconciliação testados.
- Não enviar `payment_method_types`; usar métodos dinâmicos do Dashboard.
- Impostos somente após confirmação de registro e configuração correta.

## Estados

Checkout criado → aguardando pagamento → pago → entitlement ativo → reembolso/revogação → acesso removido. Falha, duplicidade ou evento desconhecido nunca deve conceder acesso.

## Critério de saída

Todos os fluxos passam no ambiente de teste com cartões de teste, eventos duplicados, assinatura inválida, falha de rede e restauração em outro dispositivo, sem cobrança real.
