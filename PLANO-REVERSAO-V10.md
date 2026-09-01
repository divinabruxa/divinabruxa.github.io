# Plano de reversão — Divina Bruxa V10

## Quando reverter

Reverter imediatamente em staging se houver tela branca, perda da orbe, quebra do menu, cartas repetidas, exposição de diário, erro de cobrança, regressão de acessibilidade P0/P1 ou falha no gate.

## Procedimento seguro

1. Interromper o deploy e marcar a release como `BLOCKED`.
2. Preservar logs, screenshot, navegador, aparelho, horário e commit causador.
3. Apontar staging para a última tag aprovada.
4. Reexecutar o gate e os testes Tarot Core, editorial, PWA e segurança.
5. Só promover novamente após correção, revisão e evidência anexada.

## Produção

Produção não será revertida automaticamente. Qualquer ação de publicação, DNS, cobrança real ou loja exige autorização explícita da proprietária depois de staging aprovado.
