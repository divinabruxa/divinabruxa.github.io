# DIVINA BRUXA — V534 · QA SUPREMO, EVIDÊNCIAS E ENTREGA

Data do corte: 12 de setembro de 2026  
Base confirmada: V533 instalada em `origin/main` (`9aea5d6b16fbd51eb24565a936907be89cd9151d`)  
Macroetapa: 10 de 10  
Ambiente: STAGING  
Pacote: incremental, plano e sem remoções

## Veredito atual

**PASS_WITH_BLOCKERS — NÃO marcar `READY FOR OWNER REVIEW` ainda.**

O código e o STAGING não têm P0 ou P1 conhecido aberto depois dos reparos V534. Porém, o Plano Supremo exige evidência em aparelhos físicos, autenticação real da proprietária com MFA AAL2, Mesa Real Premium autenticada e restauração de backup. Esses quatro portões continuam bloqueados até a execução humana.

Isso também significa: **não está pronta para produção, publicação, cobrança real, DNS, lojas ou Sol**.

## Completed

- Executada a matriz navegável das 17 rotas na V533 publicada.
- Preservadas a Home aprovada, a única Orbe física, a viagem V525, Whit V527, Tarot V528, Sabedoria Viva V529, Experiências V530, Identidade V531, Admin V532 e Responsividade V533.
- Corrigida a falha estrutural da rota Consultas: o mundo V319 agora é inserido ao lado do santuário usando o pai verdadeiro.
- Eliminada a sobreposição entre a dica do Menu Orbital e o dock inferior, com cálculo de altura, afastamento e safe-area.
- Garantidos 44 px para CTAs essenciais de suporte, Spotify e YouTube em ponteiro de toque.
- Criada a camada observacional V534, sem leitura de campos, conteúdo privado, storage ou APIs.
- Feito o corte de cache/PWA V534 em `index.html`, app, páginas de instalação e service worker.
- Auditado o Supabase STAGING em modo somente leitura: banco saudável, RLS, políticas, grants, funções, Edge Functions, billing e travas administrativas.
- Verificada ausência de valores reconhecíveis de chaves secretas no repositório.

## Bugs encontrados e resolvidos

| ID | Severidade | Evidência | Correção | Estado |
|---|---:|---|---|---|
| DB-V534-001 | P1 | `ConsultationsWorldV319.enhance()` lançava `NotFoundError` porque `insertBefore` recebia como referência um nó que não era filho direto de `#consultationApp`. | Inserção relativa com `sanctuary.insertAdjacentElement('afterend', world)`. | RESOLVIDO |
| DB-V534-002 | P1 | Em 1363×936, a dica do Menu ocupava Y 894–912 e o dock Y 848–926. | Dica posicionada 10 px acima do dock e da safe-area; ocultada em alturas comprimidas. | RESOLVIDO |
| DB-V534-003 | P1 móvel | CTAs externos essenciais podiam ficar abaixo de 44 px em dispositivos de toque. | Alvo mínimo de 44 px somente em `pointer: coarse`. | RESOLVIDO |

## Tests

| Escopo | Resultado | Evidência |
|---|---:|---|
| QA determinístico V534 | 59 PASS · 0 FAIL · 4 BLOCKED | `node qa-v534-supreme.mjs` |
| Sintaxe JavaScript do corte | PASS | App, loader, Consultas, QA core, PWA e SW |
| CSS V534 | PASS | 10/10 chaves balanceadas |
| Grafo de módulos | PASS | 105 módulos locais resolvidos; nenhum import ausente |
| Referências do `index.html` | PASS | 40 recursos locais resolvidos |
| Recursos do service worker | PASS | 187 recursos locais resolvidos |
| Rotas canônicas | PASS | 17/17 |
| Tarot canônico | PASS | 78/78 cartas diretas, IDs únicos, sem repetição |
| Tarot Livre | PASS | grade de 6 cartas por linha preservada |
| Tiragens | PASS | 15 métodos, Cruz Celta 10, Mesa Real 13×6 = 78 |
| Verdade comercial | PASS | STAGING; billing real e checkout desligados; preços oficiais preservados |
| Segredos | PASS | nenhum valor de chave secreta reconhecível |
| Suítes legadas A/B | SEM NOVA REGRESSÃO COMPORTAMENTAL | V180, V182, V183, V184, V185, V188 e V208 comparadas contra a V533; diferenças restantes são hashes/versões congelados |
| Browser desktop publicado V533 | 16 rotas OK; 1 P1 reproduzido | O único erro foi Consultas, corrigido no código V534 ainda não publicado |

## Evidência Supabase STAGING

- Projeto em estado `ACTIVE_HEALTHY`, Postgres 17.6.1.
- Todas as relações públicas e privadas inspecionadas têm RLS habilitado.
- Nenhuma tabela pública sem RLS com grant DML para `anon` ou `authenticated`.
- Nenhuma view/materialized view exposta e nenhum grant DML do navegador no schema `private`.
- Tabelas públicas deliberadamente sem policy continuam sem grants e, portanto, fechadas por padrão.
- Políticas de dados pessoais isolam registros com `(select auth.uid()) = user_id` e políticas restritivas de conta ativa.
- Mesa Real exige conta própria ativa e entitlement `premium_lifetime`.
- Políticas de Consultas da proprietária chamam `private.is_owner()`, que exige e-mail verificado, sessão e AAL2.
- Duas funções `SECURITY DEFINER` executáveis por autenticados foram revisadas: são RPCs sem argumentos, autolimitadas ao chamador, com `search_path=''`; `anon` e `public` não executam.
- `admin-api`, mídia e analytics administrativos validam proprietária, e-mail e MFA AAL2 no servidor.
- Webhooks públicos inspecionados validam assinatura e idempotência; o simulador permanece STAGING.
- Flags `dns_changes_authorized`, `ORBE_AI_SOL_ENABLED`, `production_publish_authorized`, `real_billing_authorized` e `store_submission_authorized`: todas `false`.
- Billing: produção não autorizada, cobrança real desligada, Stripe checkout/webhook/Tax/portal desligados; simulador STAGING ligado.
- Atualmente não existe conta Auth verificada da proprietária, fator MFA, código de recuperação ou sessão administrativa ativa. O Admin permanece corretamente fechado.

Referências oficiais usadas para interpretar os controles: [Segurança da Data API e RLS](https://supabase.com/docs/guides/database/secure-data), [MFA e AAL2](https://supabase.com/docs/guides/auth/auth-mfa) e [funções de banco e `search_path`](https://supabase.com/docs/guides/database/functions).

## P0/P1

- P0 conhecido aberto após V534: **0**.
- P1 conhecido aberto após V534 no escopo automatizado/STAGING: **0**.
- P0/P1 manual não pode ser declarado como zero enquanto os quatro portões abaixo não tiverem evidência.

## Risks / backlog P2

- 12 avisos de performance `auth_rls_initplan` em políticas Whit; isolamento correto, otimização futura recomendada com `(select auth.uid())`.
- 2 foreign keys de `video_episodes` sem índice; tabela vazia em STAGING, corrigir antes de volume real.
- 53 índices atualmente não usados; não remover sem tráfego e análise real.
- `analytics-event` aceita somente eventos públicos permitidos e sem conteúdo privado, mas ainda merece rate limit contra spam antes de produção.
- As duas RPCs `SECURITY DEFINER` autolimitadas devem continuar cobertas por teste de regressão sempre que Auth mudar.

## Blocked

1. **Dispositivos físicos:** iPhone, iPad e Android em retrato/paisagem; teclado aberto; voltar/avançar; retorno do segundo plano; PWA instalada e offline seletivo.
2. **Proprietária real:** cadastro, e-mail verificado, MFA TOTP AAL2, códigos de recuperação, revogação e nova sessão.
3. **Mesa Real autenticada:** entitlement Premium STAGING, grade 13×6, autosave, retomada e continuidade em outro aparelho.
4. **Backup/restore:** backup real, hash do manifesto, restauração isolada e registro de RPO/RTO.

## Checklist depois de instalar a V534

- Abrir a Home online e confirmar visual idêntico: título, Orbe, luz, recorte, escala e dock.
- Abrir e fechar o Menu; confirmar que a dica não toca o dock.
- Abrir Consultas; confirmar que não aparece “Este mundo não abriu por completo”.
- Em Consultas, percorrer escolha, formulário e acompanhamento sem enviar dados reais desnecessários.
- Abrir Tarot Livre; confirmar 78 cartas, 6 por linha, todas diretas e sem repetição.
- Abrir Carta do Dia, Biblioteca, Escola, Tiragens, Whit, Diário, Loja, Premium, Skins, Vídeos, Música, Notificações, Conta e Admin.
- No iPhone, testar Safari, teclado, rotação, voltar/avançar, segundo plano e “Adicionar à Tela de Início”.
- Preparar o núcleo offline e confirmar que Auth, Whit gerativa, billing, Admin e envio de Consultas continuam exigindo rede.
- Executar os quatro portões bloqueados e anexar evidências antes de marcar `READY FOR OWNER REVIEW`.

## Next sprint

**Owner Review controlada da V534**, depois da instalação publicada:

1. Repetir a matriz live das 17 rotas já na V534.
2. Executar a matriz física iPhone/iPad/Android.
3. Criar e validar a conta real da proprietária com MFA AAL2 e recuperação.
4. Testar Mesa Real Premium e continuidade entre aparelhos.
5. Executar restore isolado e registrar RPO/RTO.
6. Somente com todos os portões aprovados, mudar o estado para `READY FOR OWNER REVIEW` — ainda sem autorizar produção.

## Credentials needed next

- Acesso da própria proprietária ao e-mail que será verificado.
- Aplicativo autenticador TOTP sob controle exclusivo da proprietária; códigos nunca devem ser enviados no chat ou gravados no repositório.
- iPhone/iPad/Android físicos para evidência.
- Acesso autorizado ao mecanismo de backup STAGING para o teste de restauração isolada.
- **Nenhuma chave de produção, Stripe real, DNS, loja ou Sol é necessária nesta fase.**

