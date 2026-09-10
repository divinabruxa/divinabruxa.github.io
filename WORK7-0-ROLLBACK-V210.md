# WORK7.0 — Rollback V210

A V210 altera somente `navigation.js`.

## Voltar para a base anterior

Restaurar o `navigation.js` da versão publicada imediatamente anterior à V210.
Nenhum CSS, asset da Orbe, shader, catálogo, banco, billing, conteúdo ou arquivo
de identidade precisa ser revertido.

## Por que o rollback é isolado

A API pública de `createNavigation()` foi preservada: `go`, `start`,
`setBeforeEnter`, `openOrbMenu` e `closeOrbMenu` continuam disponíveis. A V210
apenas acrescenta `menuSnapshot` e a enumeração `MENU_STATE` ao objeto retornado.

## Regiões congeladas

Não reverter nem substituir arquivos da Orbe V208/V209, `divina-shell-v180.css`,
`home-orb-absolute-v206.css`, imagens de skins, Menu visual, dock ou páginas.
