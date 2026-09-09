# Divina Bruxa V198 — Plano de Produção

## Estado de saída

A V198 encerra a macroetapa 17 com um plano executável, mas não executa ações externas. Instalar o pacote **não** constitui autorização. Produção, DNS, Supabase de produção, Resend real, Stripe live, Google Play, App Store e Orbe IA Sol permanecem bloqueados até autorização escrita e específica.

O produto candidato continua sendo a V197 aprovada: Home somente com título localizado e Orbe viva; 78 cartas normais, sem repetição; Tarot Livre sem significados; Mesa Real 13×6; PT-BR, inglês e espanhol; PWA instalável e offline.

## Princípios operacionais

1. Uma mudança externa por vez, com proprietário humano, janela, evidência e rollback.
2. STAGING e produção usam contas, projetos, chaves, dados e webhooks separados.
3. Nenhum segredo em HTML, JavaScript público, repositório, ZIP, log ou captura.
4. Toda mutação de dados nasce em migração versionada, ensaiada e reversível.
5. O estado comercial vem do servidor; a interface nunca concede direito por conta própria.
6. Métricas respeitam consentimento e não armazenam perguntas, diário ou conteúdo sensível.
7. P0 ou P1 aberto interrompe a promoção. Evidência ausente equivale a portão reprovado.

## Sequência de promoção

| Fase | Objetivo | Entrada mínima | Saída verificável | Estado V198 |
|---|---|---|---|---|
| G0 | Congelar candidata | V197 QA 1221/1221 | SHA/tag de candidata e inventário | PREPARADO |
| G1 | Validar em dispositivos | build de staging | iPhone, Android, VoiceOver, TalkBack, offline e rede lenta aprovados | PENDENTE |
| G2 | Preparar dados | projeto de produção isolado | migrações ensaiadas, RLS, advisors e restore testados | BLOQUEADO |
| G3 | Preparar domínio | domínio verificado no host | plano DNS revisado e rollback registrado | BLOQUEADO |
| G4 | Preparar e-mail | subdomínio transacional | domínio verificado, TLS e DMARC revisados | BLOQUEADO |
| G5 | Preparar comércio web | catálogo e backend validados | Checkout/Billing em sandbox, webhooks idempotentes e reconciliação | BLOQUEADO |
| G6 | Preparar observabilidade | consentimento e runbook | alertas, SLO, painel e plantão testados | PENDENTE |
| G7 | Publicar web | autorização escrita G7 | smoke test, HTTPS e monitoramento estáveis | BLOQUEADO |
| G8 | Android | web estável e política revisada | teste interno, billing nativo e revisão aprovados | BLOQUEADO |
| G9 | iOS | web estável e política revisada | TestFlight, IAP e revisão aprovados | BLOQUEADO |
| G10 | Ampliar lançamento | 24 h sem P0/P1 | decisão registrar/avançar/reverter | BLOQUEADO |

## G0 — candidata e cadeia de custódia

- Executar `node QA-V197-RELEASE-CANDIDATE.mjs` e exigir 1221/1221, P0=0 e P1=0.
- Guardar ZIP V197, ZIP V198, checksums, commit exato e inventário antes de qualquer alteração.
- Criar tag de candidata somente quando o repositório correto estiver confirmado.
- Proibir edições manuais no branch de promoção durante a janela.
- Aceite: artefato reproduzível, hash registrado e responsável identificado.

## G1 — homologação física

- iPhone Safari e PWA instalada: primeira abertura, retorno, rotação, safe areas, teclado, gesto duplo e cache.
- Android Chrome e PWA instalada: instalação, retorno, back, offline, retomada e economia de dados.
- VoiceOver e TalkBack: ordem, nomes, foco visível, anúncios e alvos de toque.
- Rede: offline real, 3G lento, perda durante leitura, retomada e atualização do service worker.
- Medir Core Web Vitals no percentil 75 somente com amostra real e consentida; não inventar valores.
- Aceite: zero P0/P1 e registro por dispositivo/SO/navegador.

## G2 — Supabase de produção

- Criar projeto de produção separado de STAGING e conferir a região antes da primeira gravação.
- Atualizar runtime para Node 22+ antes de novas bibliotecas Supabase.
- Revisar o changelog imediatamente antes do corte. Em setembro de 2026, observar: endpoint OAuth deve aceitar qualquer 2XX; tabelas novas não são expostas automaticamente pela Data API; versões explícitas de extensões são ignoradas; mudanças diretas no schema `realtime` são bloqueadas.
- Aplicar migrações versionadas numa cópia restaurada; registrar duração, locks e estratégia reversa.
- Habilitar RLS em toda tabela exposta e testar `anon`, usuário autenticado, proprietário e conta suspensa.
- Nunca autorizar por `user_metadata`; usar claims controlados pelo servidor e tabelas de direito protegidas.
- Manter chave de serviço e segredos somente no servidor; frontend recebe apenas chave publicável prevista.
- Executar Security Advisor e Performance Advisor, resolver achados e executar novamente.
- Habilitar SSL, MFA administrativa, confirmação de e-mail/OTP, CAPTCHA/rate limit quando aplicável, backups/PITR e teste de restauração.
- Configurar SMTP próprio para autenticação antes de tráfego real.
- Aceite: migrações e rollback ensaiados, RLS negativa/positiva aprovada, advisors sem P0/P1, backup restaurável.

## G3 — hospedagem, domínio e HTTPS

- Verificar a propriedade do domínio antes de associá-lo ao GitHub Pages.
- Configurar o domínio no host **antes** de alterar o DNS; isso reduz risco de tomada do domínio.
- Para domínio raiz em GitHub Pages, usar apenas os quatro endereços A oficiais documentados; para `www`, CNAME para o domínio `usuario.github.io` correto. Não usar wildcard.
- Reduzir TTL 24–48 h antes somente após autorização; guardar valores anteriores.
- Após propagação, ativar HTTPS e validar raiz, `www`, redirecionamentos, canonical, manifest, service worker e rotas críticas.
- Aceite: domínio verificado, certificado válido, zero mixed content e rollback DNS pronto.

## G4 — Resend e e-mail transacional

- Usar subdomínio transacional dedicado para isolar reputação; não substituir o contato público `orbedasrealidades@hotmail.com` sem decisão explícita.
- Verificar o domínio exigido pelo Resend e publicar somente os registros DNS apresentados na conta autorizada.
- Revisar SPF/DKIM, DMARC, Return-Path, região e TLS; desabilitar tracking em mensagens sensíveis como acesso e recuperação.
- Limitar coleta, definir retenção, redigir templates PT-BR/EN/ES e testar bounce, complaint e supressão.
- Aceite: autenticação aprovada, remetente/Reply-To corretos, nenhuma mensagem real sem consentimento e nenhum segredo no cliente.

## G5 — pagamentos e direitos

### Web com Stripe

- Usar Checkout Sessions para compra avulsa e Billing + Checkout para assinatura mensal.
- Separar objetos sandbox/live; mapear cada oferta comercial para Product/Price imutável e manter a concessão no servidor.
- Fixar API `2026-07-29.dahlia`, usar SDK suportado e enviar `integration_identifier` nas Checkout Sessions conforme contrato atual.
- Não fixar `payment_method_types`; permitir métodos dinâmicos do Dashboard.
- Usar chave restrita de menor privilégio, cofre de segredos, assinatura de webhook, idempotência e tolerância a eventos duplicados, atrasados e fora de ordem.
- Reconciliação periódica deve corrigir perda de webhook; reembolso, disputa, cancelamento e expiração revogam ou ajustam direito segundo política publicada.
- Customer Portal controla assinatura. Logs não recebem token, segredo, dado completo de pagamento ou conteúdo sensível.
- `automatic_tax` permanece desligado até confirmar com profissional tributário registros, jurisdições, códigos dos produtos e endereço do cliente; registros sandbox não migram para live.

### Android e iOS

- Bens digitais no Android usam Google Play Billing; compra é verificada no servidor antes de conceder direito e reconhecida somente após estado `PURCHASED`.
- Uma TWA exige Digital Asset Links e um site útil por si; o app deve entregar valor móvel real, não só embrulhar a web.
- No iOS, desbloqueios, assinatura e créditos digitais usam In-App Purchase conforme a loja aplicável; créditos comprados não expiram e compras restauráveis precisam de restauração.
- Não exibir links ou chamadas Stripe no binário iOS onde a política da loja proibir.
- Direitos vindos de web, Play e App Store convergem numa tabela server-side com origem, transação, período, estado e idempotency key.
- Aceite: matrizes de compra, renovação, pendência, cancelamento, reembolso, disputa e restore aprovadas em sandbox das três plataformas.

## G6 — segurança, privacidade e observabilidade

- Security headers: CSP sem `unsafe-eval`, HSTS somente após HTTPS estável, `X-Content-Type-Options`, `Referrer-Policy` e proteção de frame.
- SLO inicial: disponibilidade das rotas críticas, taxa de erro, latência do backend, falhas de auth, webhooks pendentes e jobs de reconciliação.
- Alertas têm limiar, janela, dono, canal alternativo e runbook; testar cada alerta antes do corte.
- Eventos analíticos usam IDs pseudônimos e whitelist; nunca registrar cartas escolhidas, pergunta, diário ou resposta pessoal.
- Publicar política de privacidade, termos, suporte, exclusão/exportação de dados e política de reembolso antes da cobrança.
- Aceite: scan de segredos limpo, alertas testados, direitos exercitáveis e responsável de incidente disponível.

## G7–G10 — corte, lojas e expansão

1. Obter autorização escrita com escopo e janela.
2. Congelar candidata; confirmar backup e rollback.
3. Promover primeiro a web sem cobrança live; executar smoke test em PT-BR/EN/ES.
4. Após estabilidade e nova autorização, habilitar um domínio/e-mail/backend por vez.
5. Após transações sandbox e revisão jurídica, habilitar comércio live com compra interna controlada e capacidade de reembolso.
6. Android: internal testing → closed testing → produção gradual, com ficha, privacidade, classificação e credenciais de revisão completas.
7. iOS: TestFlight → App Review → phased release, com backend ativo para revisão, conta demo e notas sobre recursos não óbvios.
8. Expandir somente após 24 h sem P0/P1, reconciliação zerada e indicadores dentro do limite.

## Regra de parada

Qualquer P0 interrompe imediatamente e inicia rollback. P1 interrompe promoção até correção e nova evidência. P2 pode entrar em backlog com responsável e prazo. Falha de segurança, concessão comercial incorreta, indisponibilidade de rota crítica, corrupção de dados, política de loja ou ausência de rollback é sempre P0.

## Fontes oficiais consultadas em 9 de setembro de 2026

- GitHub Pages: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Supabase produção: https://supabase.com/docs/guides/deployment/going-into-prod
- Supabase Advisors: https://supabase.com/docs/guides/observability/advisors
- Supabase changelog: https://supabase.com/changelog
- Stripe go-live: https://docs.stripe.com/get-started/checklist/go-live
- Resend domínios: https://resend.com/docs/dashboard/domains/introduction
- Android TWA: https://developer.chrome.com/docs/android/trusted-web-activity
- Google Play Billing: https://developer.android.com/google/play/billing/integrate
- Apple App Review: https://developer.apple.com/app-store/review/guidelines/

