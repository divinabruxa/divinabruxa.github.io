# Divina Bruxa — Macroetapa 20: QA, beta e lançamento

## Objetivo

Garantir que a beleza não esconda falhas. O lançamento só acontece quando o produto é rápido, acessível, seguro, recuperável e honesto sobre o que está disponível.

## Matriz obrigatória

- Desktop Chrome, Safari e Firefox.
- iPhone Safari e Android Chrome.
- 320 px, 375 px, 390 px, 430 px e desktop largo.
- Rede rápida, rede móvel, offline e retomada.
- Conta nova, conta existente, logout, recuperação e MFA.
- Tarot Livre: 78 cartas, sem repetição e sem invertidas.
- Carta do Dia: fuso de Brasília e concorrência.
- Tiragens, Escola, Diário, skins e PWA.
- Billing sandbox: sucesso, falha, duplicidade, reembolso e restore.
- RLS: usuário A nunca acessa dados do usuário B.

## Observabilidade

Registrar erros técnicos, tempos, funis e retenção em dados agregados. Nunca registrar corpo do Diário, perguntas íntimas ou segredos. Alertas devem possuir responsável, severidade e procedimento de resposta.

## Estados de release

NOT RUN → BLOCKED → FAIL → PASS. P0 e P1 devem ser zero. Um item BLOCKED não é sucesso disfarçado.

## Beta

Começar com grupo pequeno, convite, feedback estruturado, rollback preparado e cobrança real desativada. Expandir somente após estabilidade, clareza de preço, privacidade e suporte.

## Critério final

Staging aprovado, evidências anexadas, backup restaurado, zero P0/P1, produção autorizada explicitamente e plano de incidente conhecido.
