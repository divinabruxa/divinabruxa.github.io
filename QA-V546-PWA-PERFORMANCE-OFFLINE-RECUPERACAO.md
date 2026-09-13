# QA V546 — PWA, Performance, Offline e Recuperação

Macroetapa 12 de 14 da Divina Bruxa 3.0, instalada sobre a V545.

## Resultado automatizado

O script estrutural `qa-v546-pwa-performance-recuperacao.mjs` aprovou **1.962 de 1.962 verificações**. O laboratório isolado `qa-v546-service-worker-runtime.mjs` aprovou outras **30 de 30 verificações funcionais** de instalação, ativação, offline, entitlement, corrupção, reparo e falta simulada de espaço no cache. Resultado combinado: **1.992 de 1.992 verificações aprovadas**.

Testes físicos permanecem explicitamente pendentes e não são contados como aprovados automaticamente. O navegador visual desta sessão não possuía binário executável, portanto nenhum teste visual foi inventado.

## Contratos fechados

- Cache V546 separado em shell, conteúdo, imagens, offline gratuito e estáticos Premium.
- Ativação atômica: se o shell falhar, a versão anterior continua controlando o site.
- Navegação com preload e fallback no idioma da página.
- Cache de conteúdo limitado a 180 itens; cache de imagens limitado a 96 itens e 1,8 MB por imagem dinâmica.
- Preparação offline gratuita somente quando solicitada.
- Preparação offline Premium disponível na própria página Premium e bloqueada sem entitlement ativo.
- Whit Local disponível offline; Whit online permanece somente online.
- Conta, billing, Admin, checkout e envio de Consulta fora do cache de autoridade.
- Reparação do shell sem apagar Diário, Conta ou armazenamento privado.
- Um único registro de Service Worker por contexto em execução.
- Nenhum novo motor visual, canvas, MutationObserver ou loop permanente.

## Performance observável

- LCP alvo: até 2,5 s.
- INP alvo: até 200 ms.
- CLS alvo: até 0,1.
- Resposta visual ao toque: até 100 ms.
- Movimento alvo: 60 fps; fallback de 30 fps; 20 fps em movimento reduzido.
- Métricas ficam locais e só persistem com consentimento de analytics.

## Verificação manual depois do deployment

1. Fechar totalmente o PWA V545 e abrir a V546.
2. Confirmar que a Home aparece antes de PWA e mundos opcionais terminarem de carregar.
3. Percorrer Home → Tarot → Biblioteca → Whit → Home sem toque duplicado.
4. Preparar o núcleo offline e executar o roteiro de modo avião do laboratório V546.
5. Verificar e, se necessário, reparar o núcleo pela página de instalação.
6. Testar retomada após bloqueio de tela e gesto voltar no iPhone.
7. Executar a matriz de aparelhos de `LAB-V546-DISPOSITIVOS-E-RECUPERACAO.md`.

## Travas preservadas

- `production_publish_authorized=false`
- `dns_changes_authorized=false`
- `real_billing_authorized=false`
- `store_submission_authorized=false`
- `ORBE_AI_SOL_ENABLED=false`
- Tarot Livre sem fogo, invertidas ou repetição.
- 29 skins pagas continuam com preço unitário visível e sem checkout real em STAGING.
