# Divina Bruxa V204 — Runbook Stripe TEST

Este roteiro é exclusivo para STAGING e modo TESTE. Nenhum passo autoriza objetos `livemode=true`, cobranças reais, produção ou concessão de direitos.

## Pré-condições

1. V201, V202 e V203 instaladas no projeto de STAGING.
2. Conta da proprietária confirmada, sessão ativa e MFA/AAL2 para ações administrativas.
3. Chave restrita `rk_test_…` no cofre das Edge Functions; nunca em arquivo ou navegador.
4. Segredo `whsec_…` do endpoint TESTE no mesmo cofre.
5. Migração V204 aplicada e revisada.
6. `automatic_tax_enabled=false` até revisão fiscal e registros válidos.

## Permissões mínimas da chave restrita TESTE

- Customers: leitura e escrita.
- Products: leitura e escrita somente durante provisionamento.
- Prices: leitura e escrita somente durante provisionamento.
- Checkout Sessions: leitura e escrita.
- Billing Portal Sessions: escrita.
- PaymentIntents, Invoices e Charges: leitura para reconciliação.

Após criar o catálogo, considere uma segunda chave ainda mais restrita para o runtime, sem escrita em Products/Prices. Configure também política de acesso/IP quando compatível com o ambiente.

## Implantação controlada

1. Aplicar `SUPABASE-STRIPE-TEST-STAGING-V204.sql` somente no STAGING.
2. Implantar as funções autenticadas com verificação JWT ligada:
   - `stripe-test-catalog-provision-v204`
   - `stripe-checkout-v204`
   - `stripe-customer-portal-v204`
   - `stripe-reconcile-v204`
3. Implantar `stripe-webhook-v204` com verificação JWT Supabase desligada; a autenticação obrigatória é a assinatura Stripe verificada sobre o corpo bruto.
4. Confirmar que todos os portões continuam fechados.
5. Com nova autorização específica, abrir apenas `test_catalog_provisioning_authorized`, executar o provisionamento uma vez e fechar o portão.
6. Conferir 9 Products e 9 Prices TESTE com moeda BRL e valores idênticos ao catálogo V200.
7. Criar endpoint TESTE apontando para `stripe-webhook-v204` e selecionar somente os 13 eventos do arquivo de matriz.
8. Guardar o novo segredo de assinatura e abrir `webhook_processing_enabled`.
9. Abrir `test_checkout_authorized` somente durante homologação.

## Cenários de homologação

Use apenas cartões de teste documentados pela Stripe. Nunca salve número de cartão, CVC, endereço ou corpo bruto do webhook.

| Cenário | Resultado esperado |
|---|---|
| Pagamento aprovado | Checkout completa; evento é persistido; estado local fica pago; nenhum direito é concedido na V204. |
| Autenticação 3DS | Checkout hospeda o desafio e retorna ao site; webhook continua sendo a autoridade. |
| Cartão recusado | Checkout não conclui; falha é registrada sem dados de cartão. |
| Assinatura Orbe IA | Subscription e invoice TESTE são registradas; 400 créditos não são concedidos antes da V205. |
| Renovação | `invoice.paid` atualiza o estado sem duplicar efeito. |
| Falha de renovação | `invoice.payment_failed` marca falha; o Portal permite atualizar o método. |
| Cancelamento | Estado cancelado é persistido; revogação será exercida pelo ledger V205. |
| Reembolso | Valor reembolsado entra na reconciliação; revogação fica pendente para V205. |
| Disputa | Estado disputado é registrado; congelamento/revogação pertence à V205. |

## Duplicação e ordem

1. Reenviar o mesmo evento TESTE pelo Workbench.
2. Confirmar `delivery_count` crescente e apenas um efeito normalizado.
3. Reenviar um evento mais antigo depois de um mais novo para o mesmo objeto.
4. Confirmar status `ignored` no evento antigo e preservação do estado mais novo.
5. Repetir após timeout simulado; a chave de idempotência deve devolver a mesma sessão.

## Reconciliação

1. Esperar a entrega dos eventos da rodada.
2. Confirmar zero eventos em `received`, `processing` ou `failed`.
3. Executar `stripe-reconcile-v204` com conta da proprietária em AAL2.
4. Exigir `differenceBrlCents=0`, `openEvents=0`, `duplicateEffectCount=0` e `entitlementDispatchCount=0`.
5. Exportar somente totais e identificadores técnicos; nunca texto de consulta, Diário, perguntas à IA ou dados de cartão.

## Encerramento da rodada

1. Fechar `test_checkout_authorized`.
2. Manter `live_billing_authorized=false`, `automatic_tax_enabled=false` e `entitlement_dispatch_enabled=false`.
3. Registrar evidência, falhas e correções.
4. Não migrar IDs, chaves ou webhooks TESTE para produção.

Referências oficiais: [Stripe Checkout](https://docs.stripe.com/payments/checkout), [webhooks](https://docs.stripe.com/webhooks), [Customer Portal](https://docs.stripe.com/customer-management/integrate-customer-portal), [cartões de teste](https://docs.stripe.com/testing#cards), [chaves restritas](https://docs.stripe.com/keys-best-practices), [Edge Functions e Stripe](https://supabase.com/docs/guides/functions/examples/stripe-webhooks).
