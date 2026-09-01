# Divina Bruxa — Macroetapa 0

## Objetivo

Estabelecer uma linha de base imutável antes de qualquer reconstrução visual, funcional ou comercial. Esta etapa não publica alterações e não substitui arquivos do site.

## Linha de base auditada

- Repositório: `divinabruxa/divinabruxa.github.io`
- Branch: `main`
- Commit público: `4096b2eb20d3351fc61aee70ad1f808c8982638a`
- Data da verificação: 2026-09-01
- Estado: site funcional em partes, porém ainda beta avançada
- Inventário: 665 arquivos, aproximadamente 180,9 MiB
- Cartas: 78 diretas, sem invertidas
- Skins: 30 PNGs instaladas

## Regras de segurança

1. A `main` pública não será alterada durante esta macroetapa.
2. Toda mudança futura nasce em staging e recebe evidência de QA.
3. Nenhum segredo, chave de pagamento ou token entra no frontend.
4. Não apagar arquivos antes de existir cópia versionada e decisão registrada.
5. O bloqueio de produção permanece ativo: publicação, DNS, cobrança real, envio às lojas e Orbe IA Sol.

## Entregáveis desta etapa

- Linha de base do commit acima.
- Matriz de runtime ativo, adormecido e obsoleto.
- Portão único de QA com estados PASS, FAIL, BLOCKED e NOT RUN.
- Plano de reversão operacional.
- Checklist para aprovação da Macroetapa 1.

## Critério de saída

Macroetapa 0 só é aprovada quando a equipe confirmar: inventário conferido, screenshots douradas capturadas, staging separado, gate executável, rollback testado e zero mudança pública não autorizada.
