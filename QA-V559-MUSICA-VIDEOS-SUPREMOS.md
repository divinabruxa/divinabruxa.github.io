# QA V559 — Música, Vídeos e “De Frente com o Tarot”

Resultado: **aprovada para instalação em STAGING sobre a V558**, com uma limitação operacional documentada no teste visual automatizado.

| Bloco | Resultado |
| --- | --- |
| Contrato V559 de Música/Vídeos | Aprovado |
| Verdade pública: 2 álbuns, 18 faixas, 0 episódios | Aprovado |
| Filtros de publicação e isolamento de rascunhos | Aprovado |
| CMS, owner e MFA no código cliente/servidor | Aprovado |
| Edge Function em STAGING | ACTIVE, versão 4 |
| RLS das 5 tabelas normalizadas | Aprovado, 5 políticas por tabela |
| Service Worker em execução simulada | 32/32 |
| Sintaxe JavaScript | Aprovado |
| Compilação TypeScript da Edge Function | Aprovado |
| JSON, manifesto e estrutura plana | Aprovado |
| Produção, DNS, billing e loja | Intocados |

## Verdade editorial aprovada

- **Sobre as Estrelas** — Hércules DX, 2024, 10 faixas, Spotify `0GwJtJujeS9iwSZFADcL1k`.
- **Z** — Hércules DX, 2026, 8 faixas, Spotify `4mq0UaLMXK21JbrKMFdhdO`.
- **De Frente com o Tarot** — zero episódios publicados no fechamento da V559.
- Nenhum título, convidado, data ou episódio foi criado para preencher o estado vazio.

## Comportamento público verificado

- conteúdo público exige `published` e `published_at` já alcançado;
- faixas só são solicitadas após confirmar lançamentos públicos;
- episódios só são solicitados após confirmar temporadas públicas;
- cartas só são solicitadas para episódios públicos;
- links Spotify e YouTube passam por allowlist HTTPS;
- YouTube usa `youtube-nocookie.com`;
- nenhum iframe existe antes da ação da visitante;
- no máximo um player fica ativo;
- trocar a seleção ou sair da rota desmonta o player;
- não há autoplay, armazenamento pessoal nem loop permanente no módulo de mídia;
- telemetria aceita somente evento agregado, sem texto pesquisado e sem PII.

## ADMIN e publicação

O CMS cobre lançamentos, faixas, temporadas, episódios, tags e cartas relacionadas. Os estados editoriais são `draft`, `review`, `scheduled`, `published` e `archived`, com confirmação antes de agendar/publicar e prévias iPhone, Android e Desktop.

A Edge Function exige cookie HttpOnly, conta proprietária, e-mail confirmado, MFA AAL2, sessão não revogada e recovery code disponível. As operações recebem rate limit e auditoria. Um episódio não pode ser publicado antes da temporada correspondente.

Agendamentos são gravados como conteúdo publicado com `published_at` futuro; a própria RLS mantém o registro invisível até o instante programado, sem depender de cron.

## STAGING verificado

- Projeto: `divina-bruxa-staging` (`kyphdsamyygavmkzyezr`).
- Função: `admin-media-v320`, versão 4, estado `ACTIVE`.
- Origem permitida sem sessão: HTTP 401 `missing_session`.
- Origem não permitida: HTTP 403 `origin_denied`.
- `music_releases`, `music_tracks`, `tarot_seasons`, `tarot_episodes` e `tarot_episode_cards`: zero linhas, RLS ativa e cinco políticas em cada tabela.
- GET anônimo explícito devolveu HTTP 200 com lista vazia; filtros de publicação futura também devolveram lista vazia.
- Nenhuma migração DDL foi necessária ou aplicada.

O `verify_jwt` da plataforma permanece desativado deliberadamente nessa função porque a autenticação usa cookies HttpOnly próprios. A autorização não fica aberta: ela é validada dentro da função com todas as barreiras descritas acima.

## PWA verificado

O ensaio executou instalação atômica, ativação, remoção do cache V558, verificação do shell, cache Premium fail-closed, preparação offline, disponibilidade do texto de Música/Vídeos, players somente online, autoridade offline bloqueada, detecção/reparo de corrupção e tolerância a falha de quota: **32/32 verificações aprovadas**.

Como a V559 é incremental, 143 arquivos herdados da V558 foram representados por fixtures no ensaio isolado; os novos `music-video-supreme-v559.js` e `.css` foram lidos dos arquivos reais e validados no cache.

## Limitação do teste visual

`qa-v559-browser.mjs` foi incluído para conferir os viewports 390×844@3 e 1440×900, ausência de overflow, um único iframe e paridade inglesa. Ele não foi executado no fechamento porque o runtime não possuía o binário Chromium e as tentativas de download expiraram. Isso não invalida os testes de contrato, sintaxe, TypeScript, backend, RLS e service worker aprovados acima; significa apenas que a inspeção visual automatizada deve ser rodada em um ambiente com Playwright + Chromium antes de promover STAGING para produção.

Comando sugerido no site completo:

```bash
node qa-v559-browser.mjs .
```
