# Divina Bruxa — Macroetapa 1: Runtime canônico

## Resultado esperado

Uma única entrada (`index.html` → `app.js`) controla navegação, orbe, menu e páginas. Nenhum runtime V8/V9 adormecido deve ser carregado automaticamente.

## Evidência encontrada

O `app.js` atual importa `navigation.js?v=80`, `orb-engine-v68.js?v=69`, `skins-v6.js`, `media-engine.js` e `media-engine-v5.js`. Isso confirma que a próxima correção deve eliminar duplicidade de engines antes de acrescentar efeitos novos.

## Contrato canônico

- Entrada única: `app.js`.
- Navegação única: `createNavigation()`.
- Uma instância por engine de página.
- Toda página possui um `id` de seção e um estado de rota.
- Rota inválida mostra 404 mágico, sem tela branca.
- Rotas privadas nunca entram no sitemap.
- Nenhuma mudança de skin pode recriar o runtime inteiro.
- O estado da Carta do Dia respeita o fuso de Brasília.
- Tarot Livre mantém 78 cartas únicas e nunca usa invertidas.

## Regra de migração

Não excluir arquivos históricos nesta etapa. Primeiro marcar cada arquivo, remover imports duplicados em staging, executar o gate e só então arquivar versões antigas em uma tag de segurança.

## Saída da macroetapa

Todas as rotas da matriz devem carregar o mesmo runtime, sem engine duplicada, sem erro de console e com fallback 404 validado.
