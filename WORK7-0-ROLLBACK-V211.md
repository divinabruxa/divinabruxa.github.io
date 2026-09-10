# Rollback V211

V211 substitui somente `menu-completo-v177.js` e adiciona `menu-accessibility-v211.js` + documentos de contrato.

Para voltar à V210:

1. restaurar `menu-completo-v177.js` pelo blob/versão V177 anterior à candidata V211;
2. `menu-accessibility-v211.js` pode permanecer sem ser importado ou ser removido numa manutenção autorizada futura;
3. não alterar `navigation.js` V210, a Orbe V209/V208, shaders, CSS ou assets;
4. recarregar a página online para a estratégia network-first buscar o módulo restaurado.

Hash GitHub da base substituída `menu-completo-v177.js`: `e5e4c53cafc082fef084fd63b54433f92642df49`.
