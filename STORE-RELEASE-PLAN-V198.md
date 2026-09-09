# Plano de Lojas V198

## Regra comum

A web deve ser estável e útil por si. O app precisa oferecer experiência móvel real: navegação, acessibilidade, continuidade segura, offline previsto, integrações adequadas e comportamento consistente. Uma simples embalagem de site eleva risco de rejeição.

## Android primeiro

- Escolher arquitetura somente após protótipo físico: TWA exige Digital Asset Links e propriedade comum verificada.
- Usar Play Billing para produtos e assinaturas digitais; verificar compra no servidor, conceder de forma idempotente e reconhecer somente quando `PURCHASED`.
- Preparar ficha, ícone, screenshots reais, classificação, Data safety, política, suporte e instruções de revisão.
- Sequência: testes locais → internal testing → closed testing → produção gradual.
- Portão: crashes/ANRs, acessibilidade, deep links, offline, compra pendente, cancelamento, reembolso e restore aprovados.

## iOS

- Entregar mais que um site reempacotado e funcionar autonomamente durante revisão.
- Usar IAP para desbloqueios, assinatura e créditos digitais conforme storefront; créditos comprados não expiram e compras restauráveis têm restore.
- Não inserir chamada Stripe onde a política local proibir.
- Fornecer conta demo ou modo de demonstração completo, backend ativo, contato e notas de revisão para recursos não óbvios.
- Sequência: dispositivo físico → TestFlight interno → TestFlight externo → App Review → phased release.
- Portão: crashes, safe areas, VoiceOver, privacidade, login, exclusão, IAP, restore, cancelamento e revisão legal aprovados.

## Convergência de direitos

Web, Play e App Store escrevem em um ledger server-side único com usuário, oferta, origem, ID de transação, estado, validade, quantidade, idempotency key e timestamps. O cliente apenas lê o direito. Reembolso, disputa, cancelamento, expiração e restore são eventos explícitos e reconciliáveis.

