# QA V560 — Design de Páginas e Mobile Premium

Resultado: aprovado para instalação incremental sobre a V559 em STAGING.

## Evidências executadas

| Verificação | Resultado |
|---|---:|
| Sintaxe de page-design-supreme-v560.js | Aprovada |
| Sintaxe de app-v208.js | Aprovada |
| Sintaxe de sw.js | Aprovada |
| Manifesto PWA válido | Aprovado |
| Contratos estruturais V560 | Aprovados |
| Cobertura dos mundos | 17/17 |
| Famílias visuais | 7/7 |
| Runtime do Service Worker | 32/32 |
| Estrutura plana do delta | Aprovada |

## Matriz coberta

- Larguras: 320, 350, 375, 390, 430, 768, 1024, 1280 e 1920 px.
- Orientações: retrato e paisagem.
- Estados: idle, carregamento, sucesso, erro/recuperação e offline.
- Acessibilidade: skip link, nomes das telas, inert, aria-current,
  foco visível, redução de movimento, alto contraste e forced colors.
- Mobile: safe areas, Visual Viewport, teclado virtual, formulários a 16 px,
  alvos de 44 px (48 px em ponteiro coarse), PWA standalone e zoom 200%.
- Segurança: zero leitura privada, zero escrita em storage, zero chamadas de API.
- Performance: zero MutationObserver, zero Worker novo e zero loop permanente.
- Identidade visual: uma Orbe canônica; Home e menu preservados.

## Comandos

    node --check page-design-supreme-v560.js
    node --check app-v208.js
    node --check sw.js
    node qa-v560-page-design-supreme.mjs .
    node qa-v560-service-worker-runtime.mjs .

## Suite visual incluída

qa-v560-browser.mjs valida os 17 mundos em Chromium nas larguras-chave,
estados de carregamento/erro/offline, ausência de overflow, toque, Admin mobile,
reduced motion e a Orbe única.

Ela não foi executada neste ambiente porque não existe binário Chromium
instalado. O script está pronto para execução onde Playwright e Chromium
estejam disponíveis:

    node qa-v560-browser.mjs .

Essa limitação não foi convertida em aprovação fictícia.

## Barreiras preservadas

- Produção não publicada.
- DNS não alterado.
- Billing real não ativado.
- Lojas não submetidas.
- Direitos Premium continuam sob autoridade do servidor.
