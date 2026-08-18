# ORBE DAS REALIDADES — NEGÓCIO V1

Este pacote acrescenta assinaturas, cotas de IA e proteção de orçamento à Orbe.

## Planos pré-configurados
- Livre — R$ 0
- Premium — R$ 19,90/mês: 300 mensagens Persona IA + 10 análises profundas/mês
- Suprema — R$ 39,90/mês: 1.000 mensagens Persona IA + 40 análises profundas/mês

Os preços são definidos no Stripe; o site apenas mostra a tabela.

## Arquitetura
GitHub Pages (site)
→ Cloudflare Worker (segredos, Stripe, limites, OpenAI)
→ Cloudflare D1 (assinaturas, uso, orçamento)
→ Stripe (cobrança)
→ OpenAI (IA)

## SEGREDOS — nunca coloque no GitHub
No diretório worker:
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put APP_TOKEN_SECRET
npx wrangler secret put STRIPE_PRICE_PREMIUM
npx wrangler secret put STRIPE_PRICE_SUPREMA

APP_TOKEN_SECRET deve ser uma sequência longa e aleatória.

## D1
1. `npx wrangler d1 create orbe-prod`
2. Copie o database_id retornado para wrangler.jsonc.
3. `npx wrangler d1 execute orbe-prod --remote --file=./schema.sql`

## Stripe
Crie dois produtos recorrentes mensais:
- Orbe Premium — R$ 19,90
- Orbe Suprema — R$ 39,90

Copie os Price IDs (`price_...`) e salve nos secrets acima.

Webhook do Stripe:
`https://SEU-WORKER.workers.dev/api/stripe-webhook`

Eventos necessários:
- checkout.session.completed
- invoice.paid
- invoice.payment_failed
- customer.subscription.updated
- customer.subscription.deleted

## Limite financeiro
`MONTHLY_OPENAI_CAP_USD` vem configurado em US$ 20/mês.
Quando o valor estimado da IA chega ao teto, o backend para novas chamadas à OpenAI.
O Tarot local continua funcionando.

## Publicação
1. Publique o Worker.
2. Abra o site uma única vez com:
   `https://divinabruxa.com.br/?api=https://SEU-WORKER.workers.dev`
3. Substitua o index.html do GitHub pelo arquivo `site/index.html`.

## Importante
- O sistema de assinatura está tecnicamente preparado, mas pagamentos reais só funcionam depois de a conta Stripe estar criada/verificada e os Price IDs reais serem configurados.
- A versão web usa Stripe. Apps iOS/Android de conteúdo digital exigem planejamento separado para as regras de cobrança das lojas.
- As 78 imagens continuam referenciadas em `assets/cards/`.
