# Divina Bruxa V563 — correção 404/PWA pós-QA

## Resultado

O P0 do carregador encontrado na V561 foi confirmado como resolvido depois da instalação da V562. Tarot Livre, Carta do Dia, Tiragens, Escola, Biblioteca, Loja, Música, Vídeo e Consultas abriram no domínio sem recuperação e sem erros próprios no console.

Durante o teste foi reproduzido um P1: uma URL inexistente, embora online, era convertida pelo Service Worker na página “Modo offline”. O arquivo `404.html` estava correto; a classificação da resposta de navegação é que estava errada.

## Correção V563

- Resposta HTTP real `404`, `410` ou outra não-ok é devolvida sem cache.
- Fallback offline continua reservado a falha de rede ou timeout.
- Cache do Service Worker sobe para V563.
- `index.html` e `app-v208.js` registram o mesmo worker V563.
- Núcleo V562, rotas, conteúdo, Orbe e design permanecem preservados.

## Evidência reproduzível

| Verificação | Resultado |
| --- | --- |
| Pós-instalação V562 — 9 rotas | PASS |
| P0 Loader V561 | RESOLVIDO E VERIFICADO |
| 404 real em `404.html` | PASS |
| URL inexistente na V562 | FAIL fechado pela V563 |
| Runtime Service Worker V563 | PASS 39/39 |
| Loader V562 após hotfix | PASS 13/13 |
| Fonte V563 | P0=0 · P1=0 |
| Lançamento | BLOCKED |

O lançamento permanece bloqueado pelos testes físicos, instalação do backend V561, backup/restore, comportamento concorrente real, cobrança sandbox ponta a ponta e aprovação da proprietária.
