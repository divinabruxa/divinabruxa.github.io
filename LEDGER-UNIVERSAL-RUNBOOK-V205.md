# V205 — Runbook do Ledger Universal

## Resultado esperado

Depois de homologado no STAGING, o mesmo snapshot autoritativo atende a web e fica pronto para futuros adaptadores Google Play e StoreKit. O navegador continua somente leitor. Toda mudança nasce de um evento confirmado no servidor ou de uma intervenção temporária da proprietária, com MFA/AAL2 e auditoria.

## Verdade comercial congelada

| Produto | Valor | Regra |
|---|---:|---|
| Premium vitalício | R$ 199,90 | Inclui as 30 skins; não inclui Orbe IA |
| Orbe IA mensal | R$ 89,90 | 400 créditos por ciclo |
| 200 créditos | R$ 39,90 | Compra somente com Orbe IA ativa |
| 600 créditos | R$ 99,90 | Compra somente com Orbe IA ativa |
| 1.500 créditos | R$ 199,90 | Compra somente com Orbe IA ativa |
| Mesa Real Profissional | R$ 250,00 | Entrega agendada e confirmada por e-mail |
| Leitura de Mentes | R$ 150,00 | Entrega agendada e confirmada por e-mail |
| Carta de Conselho | R$ 100,00 | Entrega agendada e confirmada por e-mail |
| Pergunta Direta | R$ 50,00 | Entrega agendada e confirmada por e-mail |

As 29 skins pagas também podem ser adquiridas individualmente nas faixas R$ 19,90, R$ 29,90, R$ 39,90 e R$ 49,90, ou nos pacotes de R$ 79,90, R$ 99,90 e R$ 129,90. A Clássica Divina é sempre gratuita. Em um pacote parcialmente possuído, o Checkout exige confirmação explícita da sobreposição; um pacote totalmente possuído é bloqueado.

## Ordem de instalação no STAGING

1. Confirme backup V203 e a V204 instalada.
2. Execute `SUPABASE-LEDGER-UNIVERSAL-STAGING-V205.sql` como uma migração única no projeto STAGING.
3. Com todas as travas ainda fechadas, implante as funções:

| Arquivo | Slug de destino | JWT |
|---|---|---:|
| `billing-account-v205.ts` | `billing-account-v191` | obrigatório |
| `stripe-webhook-v205.ts` | `stripe-webhook-v204` | desativado; assinatura Stripe obrigatória |
| `stripe-checkout-v205.ts` | `stripe-checkout-v205` | obrigatório |
| `stripe-test-catalog-provision-v205.ts` | `stripe-test-catalog-provision-v205` | obrigatório |
| `ledger-restore-v205.ts` | `ledger-restore-v205` | obrigatório |
| `ledger-admin-v205.ts` | `ledger-admin-v205` | obrigatório |
| `ledger-reconcile-v205.ts` | `ledger-reconcile-v205` | obrigatório |

4. Mantenha os segredos exclusivamente nas Edge Functions: `STRIPE_RESTRICTED_KEY_TEST`, `STRIPE_WEBHOOK_SECRET_TEST`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PUBLISHABLE_KEY` e `PUBLIC_SITE_ORIGIN_STAGING`. Nunca coloque nenhum deles no site ou em logs.
5. No endpoint Stripe TEST, assine somente os 13 eventos descritos em `LEDGER-EVENT-MATRIX-V205.json`.
6. Valide novamente que a chave começa com `rk_test_`, que as sessões começam com `cs_test_` e que `liveBillingEnabled=false`.

## Abertura progressiva das travas

Cada etapa deve ser autorizada e testada separadamente. Nunca abra produção.

### 1. Criar o catálogo Stripe TEST em lotes

```sql
update private.ledger_gate_v205
set test_catalog_provisioning_enabled=true, updated_at=clock_timestamp()
where environment='staging' and live_billing_enabled=false and production_enabled=false;
```

Chame `stripe-test-catalog-provision-v205` com lotes de no máximo 10 até `remaining=0`. Em seguida, feche novamente `test_catalog_provisioning_enabled`.

### 2. Processar webhooks no ledger

```sql
update private.ledger_gate_v205
set ledger_processing_enabled=true, updated_at=clock_timestamp()
where environment='staging' and stripe_test_enabled=true
  and live_billing_enabled=false and production_enabled=false;
```

Reenvie os eventos TEST que chegaram enquanto a trava estava fechada. O mesmo `event_key` é seguro: eventos já concluídos não repetem efeitos; eventos apenas recebidos podem continuar.

### 3. Abrir Checkout TEST

Somente depois de todos os 41 produtos estarem `checkout_ready=true` e o webhook assinado estar saudável:

```sql
update private.ledger_gate_v205
set test_checkout_enabled=true, updated_at=clock_timestamp()
where environment='staging' and ledger_processing_enabled=true
  and live_billing_enabled=false and production_enabled=false;
```

Checkout não libera direitos. O direito só aparece após o webhook assinado e a validação de produto, valor, moeda, usuário e estado atual no provedor.

### 4. Abrir restauração TEST

```sql
update private.ledger_gate_v205
set restore_enabled=true, updated_at=clock_timestamp()
where environment='staging' and ledger_processing_enabled=true
  and live_billing_enabled=false and production_enabled=false;
```

A restauração busca as compras pelo `customer` mapeado no servidor. O cliente não envia produto, valor nem comprovante. Repetir a restauração não duplica créditos.

### 5. Ajustes manuais excepcionais

Abra `manual_adjustments_enabled` apenas durante uma janela acompanhada. A função exige proprietária ativa, MFA/AAL2, UUID de idempotência, código de motivo e prazo máximo de 366 dias. Notas são reduzidas a SHA-256; conteúdo privado não entra no ledger. Feche a trava ao terminar.

## Testes de aceitação obrigatórios

- Reenviar o mesmo `invoice.paid` e confirmar um único lote mensal de 400 créditos.
- Consumir Luna duas vezes com o mesmo `request_id` e confirmar gasto total de 1, não 2.
- Consumir Terra duas vezes com o mesmo `request_id` e confirmar gasto total de 10, não 20.
- Comprar Premium e uma skin individual igual; reembolsar o Premium e confirmar que a compra individual permanece.
- Reembolsar a skin equipada e confirmar fallback para Clássica Divina quando não houver outro direito válido.
- Reembolsar créditos já usados e confirmar saldo disponível nunca negativo, dívida explícita e conta congelada para revisão.
- Cancelar Orbe IA no fim do período e confirmar acesso até `current_period_end`.
- Expirar a assinatura e confirmar créditos extras preservados no histórico, porém indisponíveis até reativação.
- Abrir disputa e confirmar congelamento; encerrar como ganha ou chargeback e confirmar, respectivamente, restauração ou revogação.
- Enviar evento antigo depois de reembolso e confirmar que ele não retrocede o estado.
- Rodar `ledger-reconcile-v205` e exigir: `transactionDifference=0`, `duplicateCreditEffects=0`, `ghostEntitlements=0`, `hashChainErrors=0` e `openReviewItems=0`.

O arquivo `LEDGER-ATOMIC-SMOKE-V205.sql` cobre a máquina de estados com identificadores sintéticos e termina em `ROLLBACK`.

## Política de créditos

- Luna custa 1; Terra custa 10; Sol permanece desligada.
- Os 400 créditos mensais expiram no fim do ciclo e não se acumulam indefinidamente.
- Créditos extras ficam registrados quando a assinatura está inativa, mas o uso retorna bloqueado.
- O consumo trava a conta lógica do usuário, usa primeiro lotes mensais que vencem antes e grava a alocação exata.
- Uma falha de IA pode reverter o gasto pelo `request_id`; a mesma reversão não pode ocorrer duas vezes.
- Reembolso remove o saldo restante e registra separadamente eventual parte já consumida como dívida, sem apresentar saldo disponível negativo.

## Reembolso, disputa e conteúdo

O ledger revoga acesso, nunca conteúdo criado. Diário, tiragens, progresso e demais dados pertencentes à pessoa não são apagados por reembolso. Direitos sobrepostos têm fontes independentes. Disputa parcial congela a fonte para revisão; chargeback preserva todo o histórico, revoga a fonte e congela gasto.

## Incidente e reversão segura

Em qualquer dúvida, feche primeiro as travas:

```sql
update private.ledger_gate_v205 set
  ledger_processing_enabled=false,
  restore_enabled=false,
  manual_adjustments_enabled=false,
  test_catalog_provisioning_enabled=false,
  test_checkout_enabled=false,
  google_play_sandbox_enabled=false,
  apple_store_sandbox_enabled=false,
  updated_at=clock_timestamp()
where environment='staging';
```

Não apague eventos, transações, recibos ou ledger. Corrija a causa, reconcilie o provedor e reprocese com a mesma chave idempotente. Produção, live mode, DNS, publicação e lojas ficam fora da V205.

## Futuras lojas

Google Play e StoreKit devem apenas traduzir recibos validados no servidor para o mesmo contrato `ledger_apply_provider_event_v205`. Eles não ganham tabelas de direitos paralelas. Seus gates começam falsos e não são abertos nesta versão.
