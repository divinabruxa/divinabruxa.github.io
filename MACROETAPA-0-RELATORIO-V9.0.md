# Macroetapa 0 — Relatório de Cofre e Autoridade

## Resultado

Inventário concluído sem escrita no repositório remoto. O checkout auditado
contém 574 arquivos rastreados e 189.450.299 bytes de conteúdo versionado.

## Mapa de categorias

| Categoria | Quantidade |
|---|---:|
| Entradas ativas | 5 |
| Páginas editoriais das cartas | 78 |
| Ativos de cartas | 156 |
| Ativos de skins | 30 |
| Candidato V8 | 67 |
| Arquivos versionados legados | 87 |
| Suporte/não classificado | 149 |
| 404/offline | 2 |

## Referências

- `index.html`: referências estáticas presentes no checkout.
- `app.js`: imports estáticos presentes no checkout.
- `sw.js`: arquivos do cache atual presentes no checkout.
- `404.html`: referências a chunks ausentes; P0 confirmado.
- V8: arquivos presentes, porém loader não referenciado pelo index atual.

## Duplicação

Foi encontrada uma duplicata exata: `BACKEND-STAGING-CONTRACT-V6.md` e
`BACKEND-STAGING-CONTRACT-V6 2.md`. Ela não será apagada nesta etapa; será
comparada e arquivada somente depois de aprovação.

## Decisão

O projeto deve avançar por consolidação reversível. A Macroetapa 1 deve tratar
primeiro o erro de boot do `app.js`, depois 404/PWA, e só então ativar o V8.

