# Divina Bruxa V11 — Macroetapa 25: segurança e continuidade

## Objetivo

Garantir que a Divina Bruxa consiga detectar, conter, comunicar e recuperar-se de falhas ou incidentes sem improvisação.

## Preparação

- Inventário de serviços, dados, fornecedores e responsáveis.
- Backups versionados, criptografados e testados por restauração.
- Segredos rotacionáveis e separados por ambiente.
- MFA para contas privilegiadas.
- Dependências e domínios monitorados.
- Plano de contato para suporte, privacidade e provedores.

## Resposta a incidente

Detectar → classificar severidade → conter → preservar evidências → corrigir → verificar → comunicar → revisar. O Diário não deve aparecer em logs ou relatórios de incidente além do mínimo necessário.

## Continuidade

Definir RTO/RPO, página de status, modo degradado, fallback offline e rollback. Compras, IA e consultas devem falhar de forma segura e informar claramente a pessoa.

## Exercícios

Testar indisponibilidade do backend, webhook duplicado, vazamento de segredo de teste, falha do storage, corrupção de cache, restore de backup e expiração de certificado.

## Critério de saída

Runbook aprovado, backup restaurado, contatos definidos, alertas testados, incidentes simulados e nenhum segredo real exposto.
