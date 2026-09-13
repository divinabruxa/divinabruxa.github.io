# QA V543 — Loja Amazon

Macroetapa 9 de 14 da Divina Bruxa 3.0, instalada sobre a V542.

## Resultado automatizado

O script `qa-v543-loja-amazon.mjs` aprovou **352 de 352 verificações** de catálogo, destinos, tag de afiliado, transparência, conteúdo, privacidade, PWA e regressões essenciais.

O ambiente de construção não possuía um executável Chromium para a inspeção visual automatizada. Portanto, nenhum teste visual ou físico foi contado como aprovado.

## Contratos fechados

- 21 escolhas editoriais com identificadores únicos.
- Quatro caminhos por intenção: Tarot e Estudo, Ritual e Cristais, Casa da Orbe, Criação e Presentes.
- Tag `orbedasrealid-20` presente nos 21 destinos.
- URLs HTTPS restritas a `amazon.com.br`.
- Zero preço, estoque ou avaliação congelados no catálogo.
- Zero checkout interno e zero coleta de cartão.
- Aviso de afiliado acessível junto à saída de cada cartão.
- Busca e favoritos permanecem no aparelho e não entram em analytics.
- Cenas editoriais próprias permanecem separadas de anúncios e SKUs.

## Fluidez

- Nenhum motor de Orbe ou universo foi criado.
- Nenhum `pointermove`, `MutationObserver`, `setInterval`, canvas ou loop visual permanente foi adicionado.
- Os quatro caminhos reutilizam o filtro já existente; não duplicam catálogo nem rede.
- O checklist usa `details` nativo e só abre sob escolha da pessoa.
- A Loja continua sendo carregada por demanda.

## Verificação manual recomendada depois do deployment

1. Abrir Loja Amazon no iPhone em orientação vertical.
2. Tocar nos quatro caminhos e confirmar a filtragem imediata.
3. Buscar “tarot” e depois limpar a busca.
4. Salvar e remover um favorito.
5. Abrir o Ritual de Compra Consciente.
6. Abrir três escolhas diferentes e confirmar Amazon, HTTPS e tag `orbedasrealid-20` na URL.
7. Confirmar que preço, estoque e vendedor só aparecem na Amazon.
8. Abrir `loja-mistica.html` diretamente e repetir uma busca.
9. Reabrir o PWA e confirmar que a V543 substituiu o cache anterior.
10. Navegar Loja → Home → Tarot Livre e confirmar a fluidez da mesma Orbe.

## Travas preservadas

- `production_publish_authorized=false`
- `dns_changes_authorized=false`
- `real_billing_authorized=false`
- `store_submission_authorized=false`
- `ORBE_AI_SOL_ENABLED=false`
