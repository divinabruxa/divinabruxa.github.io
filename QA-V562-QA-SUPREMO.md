# Divina Bruxa V562 — QA Supremo

Macroetapa 14/14 do Plano Supremo 4.0.  
Base: V561 em main, commit 28a17c0e9d741008665f20c25e4e87e44a5ee894.  
Ambiente autorizado: STAGING.

## Decisão

| Portão | Estado |
|---|---|
| Pacote incremental V562 | PASS |
| P0 aberto no código V562 | 0 |
| P1 aberto no código V562 | 0 |
| Instalação em STAGING | PASS |
| Lançamento/produção | BLOCKED |
| Aprovação da proprietária | BLOCKED |

A V562 está aprovada para instalação incremental em STAGING. Ela não está
aprovada para lançamento. Produção, DNS, cobrança real, lojas e Sol continuam
desligados.

## Incidente encontrado e corrigido

O smoke test público read-only da V561 abriu a Home, mas o Tarot caiu no painel
de recuperação com:

    TypeError: module.TarotLivreOrbOSV517 is not a constructor

O carregador executava três Promises — dois estilos e um import — e extraía a
segunda posição como se fosse o módulo. O mesmo padrão afetava Tarot, Carta do
Dia, Biblioteca, Escola, Tiragens e Loja.

A V562 cria loadModuleAfterStylesV562: estilos e módulo ainda carregam em
paralelo, porém o módulo é sempre o resultado final e é validado antes do uso.
O contrato foi aplicado preventivamente a 13 carregadores. A regressão prova:

- 13 carregadores cobertos;
- zero seleção posicional de module;
- rejeição atômica quando CSS falha;
- rejeição fechada quando o import não retorna módulo.

O FAIL original permanece no histórico como P0 fechado. Não existe P0 ou P1
aberto na fonte V562.

## Evidência automatizada

| Suíte | Resultado | Evidência |
|---|---:|---|
| QA Supremo estrutural e funcional | PASS | 44/44 grupos |
| Carregador de mundos | PASS | 13/13 carregadores |
| Service Worker | PASS | 36/36 verificações |
| JavaScript/MJS | PASS | 478 arquivos, 0 falhas |
| TypeScript | PASS | 28/28 |
| JSON/webmanifest | PASS | 320/320 no pacote final mesclado |
| HTML público | PASS | 321/321 |
| Referências locais | PASS | 6.967 resolvidas, 0 ausentes |
| Browser V562 | BLOCKED | suíte pronta; Chromium não disponível neste ambiente |

Comandos:

    node qa-v562-loader-runtime.mjs .
    node qa-v562-supreme.mjs .
    node qa-v562-service-worker-runtime.mjs .
    node qa-v562-browser.mjs .
    node qa-v562-run-all.mjs .

O browser retorna exit 2 quando está BLOCKED por dependência ausente. Esse
estado não é transformado em PASS.

## Cobertura obrigatória

| Área | Estado | Evidência |
|---|---|---|
| Sintaxe | PASS | JS/MJS, TS e JSON analisados |
| Referências | PASS | grafo local sem alvo ausente |
| Console | PASS/BLOCKED | P0 V561 corrigido; V562 implantada ainda precisa smoke |
| 404 | PASS | página com Home, Busca e Tarot |
| PWA | PASS | epoch/caches V562 e shell atômico |
| Offline | PASS | fallback trilíngue; autoridade fora de cache |
| Tarot 78 | PASS | 78 diretas e únicas; sem 79ª carta |
| Carta do Dia | PASS/NOT RUN | determinismo local + guardas DB; corrida real não executada |
| Tiragens | PASS | 15; 4 grátis; 11 Premium; Mesa Real 13×6 |
| Skins | PASS | 30; Clássica grátis; 29 avulsas |
| Acessibilidade | PASS | skip link, 44px, 16px, safe area e preferências |
| Segurança | PASS | 321 CSPs; sem segredo de cliente; flags fechadas |
| RLS | PASS | 55/55 tabelas public com RLS |
| Webhooks duplicados | PASS/NOT RUN | unicidade e assinatura; reentrega real não disparada |
| Créditos simultâneos | PASS/NOT RUN | unique + row/advisory locks; corrida real não disparada |
| Backup/restore | BLOCKED | 0 backups e 0 restores verificados |
| Cobrança sandbox | PASS/NOT RUN | guardas presentes; fluxo financeiro não disparado |

## STAGING Supabase — auditoria read-only

Verificada em 2026-09-14, sem DDL ou DML:

- projeto saudável, Postgres 17.6, região sa-east-1;
- 55/55 tabelas públicas com RLS;
- zero tabela gravável por anon;
- 23 tabelas possuem grants de escrita para authenticated, todas com política
  aplicável; zero grant de escrita sem política correspondente;
- zero função SECURITY DEFINER executável por anon;
- dois WARN para RPCs authenticated: account_access_is_active_v201() e
  account_control_v201(). Ambos são self-bound por auth.uid/auth.jwt, não
  usam user_metadata e possuem search_path='';
- zero ERROR/CRITICAL no advisor de segurança;
- 50 índices sem uso aparecem apenas como INFO; nenhum foi removido sem carga
  real que justificasse a mudança;
- PK/unique, ON CONFLICT, FOR UPDATE e advisory locks necessários estão
  presentes;
- cinco flags de autoridade estão false.

STAGING-QA-SUPREMO-V562.sql reproduz a consulta em transação READ ONLY e
termina com ROLLBACK.

## Pendências reais

### BLOCKED

- V562 ainda não foi instalada no STAGING para o smoke de 17 rotas.
- O backend V561 ainda não aparece no projeto: tabelas/funções de analytics
  ético e a Edge Function ethical-analytics-v561 estão ausentes.
- Scheduler de backup está not_connected.
- Restore está not_verified.
- Não existe proprietária ativa nem revisão final registrada.

### NOT RUN

- 471 avaliações físicas: 9 perfis × 59 casos.
- Duas gravações simultâneas reais de Carta do Dia.
- Reentrega duplicada de webhook Stripe sandbox.
- Duas reservas simultâneas reais de créditos.
- Compra, cancelamento, estorno e disputa sandbox.

Essas pendências exigem aparelhos, identidade/autorização da proprietária ou
operações que gravariam no STAGING. A auditoria atual foi deliberadamente
read-only.

## Alteração de acessibilidade V562

O shell principal recebeu um atalho de teclado “Ir para o conteúdo”, invisível
fora do foco, com alvo de 44px, safe area e foco de alto contraste. A mudança
fica em index.html e page-design-supreme-v560.css.

## Ordem para encerrar os bloqueios

1. Instalar o delta V562 na raiz da V561 em STAGING.
2. Concluir os passos de backend do pacote V561.
3. Executar qa-v562-browser.mjs contra a URL STAGING.
4. Registrar as 471 avaliações em aparelhos reais.
5. Conectar backup e executar restore isolado verificável.
6. Executar as provas concorrentes e o ciclo completo de cobrança sandbox.
7. Ativar e autenticar a proprietária com MFA e registrar a revisão final.

Somente depois dessas evidências a proprietária pode decidir sobre a Macroetapa
15 de lançamento. A V562 não concede essa autorização.
