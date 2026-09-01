# Divina Bruxa — Macroetapa 2 / Shell unificado V9.2

## Objetivo

Fazer Home, 404 e modo offline compartilharem a mesma linguagem visual e
remover do 404 os imports Vinext/RSC que apontavam para sete chunks inexistentes.

## Entregas

- `404.html`: fallback estático, leve e navegável, sem JavaScript ou chunks.
- `offline.html`: tela dedicada para falha de rede, pronta para o PWA.
- `fallback-shell-v1.css`: visual roxo, dourado e orbe consistente.
- `sw-v9.2-unificado.js`: cache mínimo seguro e fallback de navegação para offline.

## Evidência corrigida

O 404 anterior carregava `index-BrnhCKFY.js`, `framework-CXnKph_e.js`,
`page-DZpHAAq2.js` e outros chunks que não existem na raiz publicada. O novo
404 não depende de nenhum deles.

## Limites

Este pacote não substitui automaticamente o `sw.js` nem publica no GitHub.
O arquivo `sw-v9.2-unificado.js` deve substituir o `sw.js` na branch de teste.
Não há alteração em cartas, skins, menu ou motor da orbe.
