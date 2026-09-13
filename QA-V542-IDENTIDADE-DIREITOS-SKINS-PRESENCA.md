# QA V542 — Identidade, Direitos, Skins e Presença

Macroetapa 8 de 14 da Divina Bruxa 3.0, instalada sobre a V541.

## Resultado automatizado

O script `qa-v542-identidade-direitos-skins-presenca.mjs` aprovou **346 de 346 verificações** de catálogo, preços, arquivos visuais, produtos STAGING, conteúdo, segurança, PWA e regressões essenciais. Testes físicos em aparelhos não são contados como aprovados automaticamente.

## Contratos fechados

- 30 skins: 1 gratuita e 29 pagas.
- Preços unitários em BRL: R$ 19,90, R$ 29,90, R$ 39,90 e R$ 49,90.
- Todas as skins pagas podem ser adquiridas individualmente, sem Premium obrigatório.
- Premium vitalício continua por R$ 199,90 e inclui as 30 skins.
- Orbe IA permanece separada.
- Entitlements e restauração continuam autoritativos no servidor.
- Checkout real permanece desligado; a interface não solicita cartão.
- Skins são cosméticas e não alteram Tarot, sorte, significados ou IA.

## Fluidez

- Nenhum motor de Orbe ou universo foi criado.
- Nenhum listener `pointermove`, `MutationObserver`, `setInterval` ou loop visual permanente foi adicionado.
- A galeria mantém miniaturas preguiçosas, `content-visibility` e alvos de toque de 44 px.
- A prévia superior não usa mais animação contínua de respiração.
- A decisão de compra abre uma ficha leve e nativa.

## Verificação manual recomendada depois do deployment

1. Abrir Skins no iPhone e conferir os 30 cartões.
2. Confirmar os quatro preços e a Clássica gratuita.
3. Abrir uma skin bloqueada e confirmar a ficha de compra unitária.
4. Confirmar que o botão de cobrança permanece bloqueado em STAGING.
5. Restaurar uma conta de teste e equipar uma skin já adquirida.
6. Verificar a mesma skin na Home, Menu, dock e Tarot Livre.
7. Conferir Conta, Premium e Notificações em orientação vertical e horizontal.
8. Reabrir o PWA e confirmar que a V542 substituiu o cache anterior.

## Travas preservadas

- `production_publish_authorized=false`
- `dns_changes_authorized=false`
- `real_billing_authorized=false`
- `store_submission_authorized=false`
- `ORBE_AI_SOL_ENABLED=false`
