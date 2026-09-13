# QA V561 — Retenção Ética e Conteúdo Diário

Resultado: aprovado para instalação incremental sobre a V560 em STAGING.

## Evidências executadas

| Verificação | Resultado |
|---|---:|
| Sintaxe de ethical-return-core-v561.js | Aprovada |
| Sintaxe de app-v208.js, daily, loader, Admin e SW | Aprovada |
| Sintaxe TypeScript das duas Edge Functions | Aprovada |
| Manifesto PWA válido | Aprovado |
| Contratos estruturais V561 | Aprovados |
| Desafios determinísticos | 14/14 |
| Categorias de lembrete | 4/4 |
| Templates sem texto remoto | 4/4 |
| Runtime do Service Worker | 37/37 |
| Estrutura plana do delta | Aprovada |

## Retorno ético

- Um desafio da Escola por dia de Brasília, sem streak, placar coercitivo,
  punição, urgência fabricada ou perda de progresso.
- Histórico local limitado a dia + ID de rota; favoritos dependem de ação direta.
- Exportação e exclusão do histórico disponíveis no próprio Jardim.
- Calendário, favoritas e linha do tempo abrem o Diário sem ler seus registros.
- Carta do Dia emite apenas data + confirmação booleana; não emite carta,
  intenção, imagem ou significado.
- Episódios usam a contagem do feed publicado. O zero permanece zero.
- Skins apontam para o catálogo oficial de 30; nenhuma nova skin foi inventada.

## Notificações

- Nenhuma permissão é solicitada ao carregar a aplicação.
- Opt-in separado para Carta, Escola, skins e episódios.
- Silêncio fixo das 22h às 08h em America/Sao_Paulo.
- O Service Worker escolhe título, corpo e rota a partir de quatro templates
  internos. Payload remoto não pode fornecer texto livre.
- O template da Carta diz somente que ela está pronta para ser encontrada.
- Push exige release V561 + consent=true e ainda depende de futura autorização
  para ativar um provedor. Na V561, somente o teste local está ativo.

## Analytics consentido

- Desligado por padrão e conectado a privacy-center-v9.
- Token aleatório só é criado após opt-in; rotação em 90 dias.
- A Edge Function transforma tokens em HMAC-SHA256 com pepper secreto.
- Banco recebe enums estritos; não há coluna de texto livre.
- Lote máximo 20, corpo máximo 32 KiB, allowlist de Origin/chave/evento/rota,
  rate limit, janela temporal e exclusão por aparelho.
- RLS habilitado + forçado; anon/authenticated sem privilégio na tabela.
- Funções SQL são SECURITY INVOKER e executáveis somente por service_role.
- Snapshot retorna DAU, WAU, MAU, retorno em 7d, funil e retenção D1/D7/D30,
  sempre agregados.
- Zero Diário, carta, Consulta, Whit, nome, e-mail, telefone ou localização precisa.

## Comandos executados

    node --check ethical-return-core-v561.js
    node --check app-v208.js
    node --check daily-world-v509.js
    node --check page-loader-v1.js
    node --check admin-intelligence-v322.js
    node --check sw.js
    node --experimental-strip-types --check ethical-analytics-v561-edge.ts
    node --experimental-strip-types --check admin-analytics-v322-edge-v561.ts
    node qa-v561-ethical-return.mjs .
    node qa-v561-service-worker-runtime.mjs .

## Validação externa preservada

O SQL e as Edge Functions não foram aplicados automaticamente no projeto remoto.
O arquivo STAGING-EDGE-FUNCTIONS-V561.txt contém a ordem e as consultas de
verificação. Isso evita transformar uma entrega de arquivos em mutação externa.

## Suite visual incluída

qa-v561-browser.mjs cobre o Jardim em mobile, desafio, favoritos, histórico,
calendário, zero real de episódios, opt-in/revogação e payload sanitizado.

Ela não foi executada neste ambiente porque não há binário Chromium instalado.
O script está pronto para execução onde Playwright e Chromium estejam disponíveis:

    node qa-v561-browser.mjs .

Essa limitação não foi convertida em aprovação fictícia.

## Barreiras preservadas

- Produção não publicada.
- DNS não alterado.
- Billing real não ativado.
- Lojas não submetidas.
- Sol desligada.
- Direitos Premium continuam sob autoridade do servidor.

Próxima macroetapa: 14/14 — QA Supremo.
